import { initTRPC, TRPCError } from '@trpc/server'
import type { Context } from './context'
import { z } from 'zod'
import { db } from '../db'
import {
  hashPassword,
  verifyPassword,
  createSession,
  getUserFromSession,
  deleteSession,
  isValidEmail,
  isValidPassword,
} from './auth'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

// Authentication router
const authRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password, name } = input

      // Validate email
      if (!isValidEmail(email)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid email address',
        })
      }

      // Validate password strength
      const passwordValidation = isValidPassword(password)
      if (!passwordValidation.valid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: passwordValidation.message,
        })
      }

      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists',
        })
      }

      // Hash password
      const hashedPassword = await hashPassword(password)

      // Create user
      const user = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      })

      // Create session
      const session = await createSession(user.id)

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        sessionToken: session.sessionToken,
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input

      // Find user
      const user = await db.user.findUnique({
        where: { email },
      })

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        })
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password)
      if (!isValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        })
      }

      // Create session
      const session = await createSession(user.id)

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        sessionToken: session.sessionToken,
      }
    }),

  logout: publicProcedure
    .input(z.object({ sessionToken: z.string() }))
    .mutation(async ({ input }) => {
      await deleteSession(input.sessionToken)
      return { success: true }
    }),

  me: publicProcedure
    .input(z.object({ sessionToken: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.sessionToken) {
        return null
      }

      const user = await getUserFromSession(input.sessionToken)
      if (!user) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    }),
})

// Main app router
export const appRouter = router({
  auth: authRouter,
})

export type AppRouter = typeof appRouter
