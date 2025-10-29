import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  verifyPassword,
  generateTokens,
  getCookieOptions,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '@/lib/auth'
import { LoginCredentials, AuthResponse } from '@/lib/types/auth'

/**
 * POST /api/auth/login
 * Login with email and password, returns JWT tokens in httpOnly cookies
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Prepare response
    const response: AuthResponse = {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokens,
    }

    // Create response with httpOnly cookies
    const nextResponse = NextResponse.json(response, { status: 200 })

    nextResponse.cookies.set(
      'accessToken',
      tokens.accessToken,
      getCookieOptions(ACCESS_TOKEN_MAX_AGE)
    )

    nextResponse.cookies.set(
      'refreshToken',
      tokens.refreshToken,
      getCookieOptions(REFRESH_TOKEN_MAX_AGE)
    )

    return nextResponse
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}
