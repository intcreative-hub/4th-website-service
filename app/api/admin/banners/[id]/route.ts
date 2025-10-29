import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * PATCH /api/admin/banners/[id]
 * Update a promo banner (admin)
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

    const bannerId = params.id
    const body = await request.json()
    const { title, message, type, link, startDate, endDate, active } = body

    // Prepare update data
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (message !== undefined) updateData.message = message
    if (type !== undefined) updateData.type = type
    if (link !== undefined) updateData.link = link || null
    if (startDate !== undefined) updateData.startDate = new Date(startDate)
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null
    if (active !== undefined) updateData.active = active

    // Update banner
    const banner = await prisma.promoBanner.update({
      where: { id: bannerId },
      data: updateData,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Banner updated successfully',
        banner,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/banners/[id]
 * Delete a promo banner (admin)
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

    const bannerId = params.id

    await prisma.promoBanner.delete({
      where: { id: bannerId },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Banner deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    )
  }
}
