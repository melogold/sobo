import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
const JWT_EXPIRES_IN = '7d'

export interface JWTPayload {
  userId: string
  email: string
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Create a session for a user
 */
export async function createSession(userId: string) {
  const sessionToken = generateToken({ userId, email: '' })
  const expires = new Date()
  expires.setDate(expires.getDate() + 7) // 7 days from now

  const session = await db.session.create({
    data: {
      userId,
      sessionToken,
      expires,
    },
  })

  return session
}

/**
 * Get user from session token
 */
export async function getUserFromSession(sessionToken: string) {
  const payload = verifyToken(sessionToken)
  if (!payload) return null

  const session = await db.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  })

  if (!session) return null
  if (session.expires < new Date()) {
    // Session expired, delete it
    await db.session.delete({ where: { id: session.id } })
    return null
  }

  return session.user
}

/**
 * Delete a session
 */
export async function deleteSession(sessionToken: string) {
  await db.session.deleteMany({
    where: { sessionToken },
  })
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  valid: boolean
  message?: string
} {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' }
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one lowercase letter',
    }
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter',
    }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  return { valid: true }
}
