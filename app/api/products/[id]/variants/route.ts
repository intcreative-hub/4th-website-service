import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/products/[id]/variants
 * Get all variants for a product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get all active variants
    const variants = await prisma.productVariant.findMany({
      where: {
        productId,
        active: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(
      {
        success: true,
        variants,
        count: variants.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching variants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/products/[id]/variants
 * Create a new variant (admin only)
 */
export async function POST(
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

    const productId = params.id
    const body = await request.json()
    const { name, sku, price, stock, attributes } = body

    // Validation
    if (!name || !sku) {
      return NextResponse.json(
        { error: 'Name and SKU are required' },
        { status: 400 }
      )
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if SKU already exists
    const existingSku = await prisma.productVariant.findUnique({
      where: { sku },
    })

    if (existingSku) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 409 }
      )
    }

    // Create variant
    const variant = await prisma.productVariant.create({
      data: {
        productId,
        name,
        sku,
        price: price ? parseFloat(price) : null,
        stock: stock ? parseInt(stock) : 0,
        attributes: attributes || {},
        active: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Variant created successfully',
        variant,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating variant:', error)
    return NextResponse.json(
      { error: 'Failed to create variant' },
      { status: 500 }
    )
  }
}
