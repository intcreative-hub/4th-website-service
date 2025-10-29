import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/reviews
 * Get all reviews for moderation (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Simple admin auth check
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'pending', 'approved', 'all'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build filter
    const where: any = {}
    if (status === 'pending') {
      where.approved = false
    } else if (status === 'approved') {
      where.approved = true
    }

    // Fetch reviews with product and user info
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              name: true,
              slug: true,
              images: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.review.count({ where }),
    ])

    // Get counts by status
    const [pendingCount, approvedCount] = await Promise.all([
      prisma.review.count({ where: { approved: false } }),
      prisma.review.count({ where: { approved: true } }),
    ])

    return NextResponse.json(
      {
        success: true,
        reviews,
        stats: {
          pending: pendingCount,
          approved: approvedCount,
          total: pendingCount + approvedCount,
        },
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
