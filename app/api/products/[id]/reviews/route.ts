import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, optionalAuth } from '@/lib/middleware/auth'

/**
 * GET /api/products/[id]/reviews
 * Get all approved reviews for a product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get approved reviews with user info
    const [reviews, totalCount, averageRating] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          approved: true,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.review.count({
        where: {
          productId,
          approved: true,
        },
      }),
      prisma.review.aggregate({
        where: {
          productId,
          approved: true,
        },
        _avg: {
          rating: true,
        },
      }),
    ])

    // Calculate rating distribution
    const ratingCounts = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        productId,
        approved: true,
      },
      _count: {
        rating: true,
      },
    })

    const distribution = [1, 2, 3, 4, 5].map((rating) => {
      const found = ratingCounts.find((r) => r.rating === rating)
      return {
        rating,
        count: found?._count.rating || 0,
      }
    })

    return NextResponse.json(
      {
        success: true,
        reviews,
        stats: {
          total: totalCount,
          averageRating: averageRating._avg.rating || 0,
          distribution,
        },
        pagination: {
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

/**
 * POST /api/products/[id]/reviews
 * Submit a review for a product (requires authentication)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) return authResult.response

    const userId = authResult.user!.userId
    const productId = params.id
    const body = await request.json()
    const { rating, comment } = body

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Review must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      )
    }

    // Optional: Check if user purchased this product
    // const hasPurchased = await prisma.orderItem.findFirst({
    //   where: {
    //     productId,
    //     order: {
    //       userId,
    //       paymentStatus: 'paid',
    //     },
    //   },
    // })

    // if (!hasPurchased) {
    //   return NextResponse.json(
    //     { error: 'You must purchase this product before reviewing' },
    //     { status: 403 }
    //   )
    // }

    // Create review (pending approval)
    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating: parseInt(rating),
        comment: comment.trim(),
        approved: false, // Requires admin approval
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Review submitted successfully and is pending approval',
        review,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
