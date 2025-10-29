import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  hashPassword,
  generateTokens,
  validatePassword,
  validateEmail,
  getCookieOptions,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '@/lib/auth'
import { RegisterData, AuthResponse } from '@/lib/types/auth'

/**
 * POST /api/auth/register
 * Register a new customer account
 */
export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json()
    const { email, password, name, phone } = body

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Password does not meet requirements',
          details: passwordValidation.errors,
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        phone: phone || null,
        role: 'customer',
      },
    })

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
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokens,
    }

    // Create response with httpOnly cookies
    const nextResponse = NextResponse.json(response, { status: 201 })

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
    console.error('Error creating account:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
