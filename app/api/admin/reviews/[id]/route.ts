import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * PATCH /api/admin/reviews/[id]
 * Approve or reject a review (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simple admin auth check
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reviewId = params.id
    const body = await request.json()
    const { approved } = body

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Approved field must be a boolean' },
        { status: 400 }
      )
    }

    // Update review
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { approved },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: approved ? 'Review approved' : 'Review rejected',
        review,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/reviews/[id]
 * Delete a review (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simple admin auth check
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reviewId = params.id

    await prisma.review.delete({
      where: { id: reviewId },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Review deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
