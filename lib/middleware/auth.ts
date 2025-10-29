import { NextRequest, NextResponse } from 'next/server'
import { extractToken, verifyToken } from '../auth'
import { JWTPayload } from '../types/auth'

// ==============================================
// AUTHENTICATION MIDDLEWARE
// ==============================================

/**
 * Middleware to require authentication on API routes
 * Returns 401 if user is not authenticated
 *
 * Usage in API route:
 * ```typescript
 * const authResult = await requireAuth(request)
 * if (authResult.error) return authResult.response
 * const user = authResult.user
 * ```
 */
export async function requireAuth(request: NextRequest): Promise<{
  user?: JWTPayload
  error?: boolean
  response?: NextResponse
}> {
  const token = extractToken(request)

  if (!token) {
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    }
  }

  const payload = verifyToken(token)

  if (!payload) {
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      ),
    }
  }

  return {
    user: payload,
  }
}

/**
 * Middleware to optionally get authenticated user
 * Does not return error if user is not authenticated
 *
 * Usage in API route:
 * ```typescript
 * const { user } = await optionalAuth(request)
 * // user will be undefined if not authenticated
 * ```
 */
export async function optionalAuth(request: NextRequest): Promise<{
  user?: JWTPayload
}> {
  const token = extractToken(request)

  if (!token) {
    return {}
  }

  const payload = verifyToken(token)

  if (!payload) {
    return {}
  }

  return {
    user: payload,
  }
}

/**
 * Middleware to require admin role
 * Returns 403 if user is not an admin
 *
 * Usage in API route:
 * ```typescript
 * const authResult = await requireAdmin(request)
 * if (authResult.error) return authResult.response
 * const user = authResult.user
 * ```
 */
export async function requireAdmin(request: NextRequest): Promise<{
  user?: JWTPayload
  error?: boolean
  response?: NextResponse
}> {
  const authResult = await requireAuth(request)

  if (authResult.error) {
    return authResult
  }

  if (authResult.user?.role !== 'admin') {
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      ),
    }
  }

  return {
    user: authResult.user,
  }
}

/**
 * Middleware to check if user owns the resource
 * Returns 403 if user does not own the resource (unless admin)
 *
 * @param request - Next.js request
 * @param resourceUserId - ID of the user who owns the resource
 *
 * Usage in API route:
 * ```typescript
 * const authResult = await requireOwnership(request, order.userId)
 * if (authResult.error) return authResult.response
 * const user = authResult.user
 * ```
 */
export async function requireOwnership(
  request: NextRequest,
  resourceUserId: string
): Promise<{
  user?: JWTPayload
  error?: boolean
  response?: NextResponse
}> {
  const authResult = await requireAuth(request)

  if (authResult.error) {
    return authResult
  }

  const user = authResult.user!

  // Admins can access any resource
  if (user.role === 'admin') {
    return { user }
  }

  // Check if user owns the resource
  if (user.userId !== resourceUserId) {
    return {
      error: true,
      response: NextResponse.json(
        { error: 'You do not have permission to access this resource' },
        { status: 403 }
      ),
    }
  }

  return { user }
}
