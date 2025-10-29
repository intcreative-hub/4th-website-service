import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/banners
 * Get active promo banners (public)
 */
export async function GET(request: NextRequest) {
  try {
    const now = new Date()

    const banners = await prisma.promoBanner.findMany({
      where: {
        active: true,
        startDate: {
          lte: now,
        },
        OR: [
          { endDate: null },
          {
            endDate: {
              gte: now,
            },
          },
        ],
      },
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
