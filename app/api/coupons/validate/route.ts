import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/coupons/validate
 * Validate a coupon code (public)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, orderTotal } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      )
    }

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code', valid: false },
        { status: 404 }
      )
    }

    // Check if coupon is active
    if (!coupon.active) {
      return NextResponse.json(
        { error: 'This coupon is no longer active', valid: false },
        { status: 400 }
      )
    }

    // Check if coupon has expired
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json(
        { error: 'This coupon has expired', valid: false },
        { status: 400 }
      )
    }

    // Check max uses
    if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
      return NextResponse.json(
        { error: 'This coupon has reached its usage limit', valid: false },
        { status: 400 }
      )
    }

    // Check minimum purchase requirement
    if (coupon.minPurchase && orderTotal < coupon.minPurchase) {
      return NextResponse.json(
        {
          error: `Minimum purchase of $${coupon.minPurchase.toFixed(2)} required`,
          valid: false,
        },
        { status: 400 }
      )
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderTotal * coupon.discountValue) / 100
    } else if (coupon.discountType === 'FIXED') {
      discountAmount = coupon.discountValue
    }

    // Ensure discount doesn't exceed order total
    discountAmount = Math.min(discountAmount, orderTotal)

    return NextResponse.json(
      {
        success: true,
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount,
        },
        message: `Coupon applied! You save $${discountAmount.toFixed(2)}`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to validate coupon', valid: false },
      { status: 500 }
    )
  }
}
