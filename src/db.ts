import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient()
export const db = prisma // Alias for consistency

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
