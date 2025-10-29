import { NextRequest, NextResponse } from 'next/server'
import {
  verifyToken,
  generateAccessToken,
  getCookieOptions,
  ACCESS_TOKEN_MAX_AGE,
} from '@/lib/auth'

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(request: NextRequest) {
  try {
    // Extract refresh token from cookies
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      )
    }

    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((cookie) => {
        const [name, ...rest] = cookie.split('=')
        return [name, rest.join('=')]
      })
    )

    const refreshToken = cookies.refreshToken

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      )
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    })

    // Create response with new access token
    const response = NextResponse.json(
      {
        success: true,
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
      },
      { status: 200 }
    )

    // Set new access token in httpOnly cookie
    response.cookies.set(
      'accessToken',
      newAccessToken,
      getCookieOptions(ACCESS_TOKEN_MAX_AGE)
    )

    return response
  } catch (error) {
    console.error('Error refreshing token:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    )
  }
}
