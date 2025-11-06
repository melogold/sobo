import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Sobo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create and share social media boards with your friends
          </p>
          <p className="text-lg text-gray-500">
            Replace cluttered group chats with organized boards of social media posts
          </p>
        </div>
      </div>
    </div>
  )
}
