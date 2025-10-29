import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWTPayload, AuthTokens } from './types/auth'

// ==============================================
// JWT CONFIGURATION
// ==============================================

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12')

// ==============================================
// PASSWORD HASHING
// ==============================================

/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// ==============================================
// JWT TOKEN GENERATION
// ==============================================

/**
 * Generate JWT access and refresh tokens
 * @param payload - User data to encode in token
 * @returns Object containing access and refresh tokens
 */
export function generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>): AuthTokens {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  })

  return {
    accessToken,
    refreshToken,
  }
}

/**
 * Generate a single access token
 * @param payload - User data to encode in token
 * @returns JWT access token
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

// ==============================================
// JWT TOKEN VERIFICATION
// ==============================================

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    // Token invalid or expired
    return null
  }
}

/**
 * Decode a JWT token without verification (for expired token refresh)
 * @param token - JWT token to decode
 * @returns Decoded payload or null if invalid format
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

// ==============================================
// COOKIE HELPERS
// ==============================================

/**
 * Get cookie options for setting httpOnly cookies
 * @param maxAge - Maximum age in milliseconds
 * @returns Cookie options object
 */
export function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
  }
}

/**
 * Convert time string (e.g., "7d") to milliseconds
 * @param timeString - Time string like "7d", "24h", "30m"
 * @returns Time in milliseconds
 */
export function timeToMs(timeString: string): number {
  const units: { [key: string]: number } = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }

  const match = timeString.match(/^(\d+)([smhd])$/)
  if (!match) return 7 * 24 * 60 * 60 * 1000 // Default 7 days

  const value = parseInt(match[1])
  const unit = match[2]
  return value * (units[unit] || units.d)
}

// Cookie max ages
export const ACCESS_TOKEN_MAX_AGE = timeToMs(JWT_EXPIRES_IN)
export const REFRESH_TOKEN_MAX_AGE = timeToMs(JWT_REFRESH_EXPIRES_IN)

// ==============================================
// TOKEN EXTRACTION
// ==============================================

/**
 * Extract token from Authorization header or cookies
 * @param request - Next.js Request object
 * @returns Token string or null
 */
export function extractToken(request: Request): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Try cookies
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((cookie) => {
      const [name, ...rest] = cookie.split('=')
      return [name, rest.join('=')]
    })
  )

  return cookies.accessToken || null
}

// ==============================================
// PASSWORD VALIDATION
// ==============================================

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with isValid boolean and errors array
 */
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns True if email format is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
