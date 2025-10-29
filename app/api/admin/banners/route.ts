import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/banners
 * Get all promo banners (admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Simple admin auth check
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const banners = await prisma.promoBanner.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(
      {
        success: true,
        banners,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/banners
 * Create a new promo banner (admin)
 */
export async function POST(request: NextRequest) {
  try {
    // Simple admin auth check
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, message, type, link, startDate, endDate } = body

    // Validation
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }

    // Create banner
    const banner = await prisma.promoBanner.create({
      data: {
        title,
        message,
        type: type || 'info',
        link: link || null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        active: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Banner created successfully',
        banner,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}
