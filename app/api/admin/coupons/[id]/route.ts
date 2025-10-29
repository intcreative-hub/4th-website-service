import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * PATCH /api/admin/coupons/[id]
 * Update a coupon (admin)
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

    const couponId = params.id
    const body = await request.json()
    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxUses,
      expiresAt,
      active,
    } = body

    // Prepare update data
    const updateData: any = {}
    if (code !== undefined) {
      // Check if new code already exists
      const existingCoupon = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() },
      })

      if (existingCoupon && existingCoupon.id !== couponId) {
        return NextResponse.json(
          { error: 'Coupon code already exists' },
          { status: 409 }
        )
      }
      updateData.code = code.toUpperCase()
    }
    if (discountType !== undefined) updateData.discountType = discountType
    if (discountValue !== undefined) updateData.discountValue = parseFloat(discountValue)
    if (minPurchase !== undefined)
      updateData.minPurchase = minPurchase ? parseFloat(minPurchase) : null
    if (maxUses !== undefined) updateData.maxUses = maxUses ? parseInt(maxUses) : null
    if (expiresAt !== undefined)
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null
    if (active !== undefined) updateData.active = active

    // Update coupon
    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: updateData,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Coupon updated successfully',
        coupon,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/coupons/[id]
 * Delete a coupon (admin)
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

    const couponId = params.id

    await prisma.coupon.delete({
      where: { id: couponId },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Coupon deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    )
  }
}
