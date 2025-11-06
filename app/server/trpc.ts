import { initTRPC } from '@trpc/server'
import type { Context } from './context'
import { z } from 'zod'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

// Example router with a simple greeting procedure
export const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        message: `Hello ${input.name ?? 'World'}!`,
      }
    }),
})

export type AppRouter = typeof appRouter
