import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { trpc } from '../utils/trpc'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [sessionToken, setSessionToken] = useState<string | null>(null)

  useEffect(() => {
    // Get session token from localStorage
    const token = localStorage.getItem('sessionToken')
    setSessionToken(token)
  }, [])

  const { data: user, isLoading } = trpc.auth.me.useQuery(
    { sessionToken: sessionToken || undefined },
    { enabled: !!sessionToken }
  )

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      localStorage.removeItem('sessionToken')
      setSessionToken(null)
      window.location.reload()
    },
  })

  const handleLogout = () => {
    if (sessionToken) {
      logoutMutation.mutate({ sessionToken })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Sobo
            </Link>
            <div className="space-x-4">
              {isLoading ? (
                <span className="text-gray-500">Loading...</span>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    Welcome, {user.name || user.email}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Sobo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create and share social media boards with your friends
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Replace cluttered group chats with organized boards of social media posts
          </p>

          {!user && (
            <div className="flex justify-center space-x-4">
              <Link
                to="/signup"
                className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 text-lg font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Sign In
              </Link>
            </div>
          )}

          {user && (
            <div className="mt-12 p-8 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Boards
              </h2>
              <p className="text-gray-600">
                Start creating your first board to organize social media posts!
              </p>
              <button className="mt-6 px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Create New Board
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
