import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * PATCH /api/admin/variants/[id]
 * Update a variant (admin only)
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

    const variantId = params.id
    const body = await request.json()
    const { name, sku, price, stock, attributes, active } = body

    // Prepare update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (sku !== undefined) {
      // Check if new SKU already exists
      const existingSku = await prisma.productVariant.findUnique({
        where: { sku },
      })

      if (existingSku && existingSku.id !== variantId) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 409 }
        )
      }
      updateData.sku = sku
    }
    if (price !== undefined) updateData.price = price ? parseFloat(price) : null
    if (stock !== undefined) updateData.stock = parseInt(stock)
    if (attributes !== undefined) updateData.attributes = attributes
    if (active !== undefined) updateData.active = active

    // Update variant
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: updateData,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Variant updated successfully',
        variant,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating variant:', error)
    return NextResponse.json(
      { error: 'Failed to update variant' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/variants/[id]
 * Delete a variant (admin only)
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

    const variantId = params.id

    await prisma.productVariant.delete({
      where: { id: variantId },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Variant deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting variant:', error)
    return NextResponse.json(
      { error: 'Failed to delete variant' },
      { status: 500 }
    )
  }
}
