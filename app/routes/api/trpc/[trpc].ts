import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '../../../server/trpc'
import { createContext } from '../../../server/context'

export async function GET(request: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext,
  })
}

export async function POST(request: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext,
  })
}
