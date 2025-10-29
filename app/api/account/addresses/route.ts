import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware/auth'

/**
 * GET /api/account/addresses
 * Get all saved addresses for customer
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) return authResult.response

    const userId = authResult.user!.userId

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ success: true, addresses }, { status: 200 })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/account/addresses
 * Create a new saved address
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) return authResult.response

    const userId = authResult.user!.userId
    const body = await request.json()
    const { street, city, state, zip, country, isDefault } = body

    // Validation
    if (!street || !city || !state || !zip) {
      return NextResponse.json(
        { error: 'Street, city, state, and zip are required' },
        { status: 400 }
      )
    }

    // If this is being set as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    // Create address
    const address = await prisma.address.create({
      data: {
        userId,
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        country: country?.trim() || 'USA',
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Address saved successfully',
        address,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Failed to save address' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/account/addresses
 * Update an existing address
 */
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) return authResult.response

    const userId = authResult.user!.userId
    const body = await request.json()
    const { id, street, city, state, zip, country, isDefault } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    })

    if (!existingAddress || existingAddress.userId !== userId) {
      return NextResponse.json(
        { error: 'Address not found or access denied' },
        { status: 404 }
      )
    }

    // If this is being set as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, NOT: { id } },
        data: { isDefault: false },
      })
    }

    // Prepare update data
    const updateData: any = {}
    if (street !== undefined) updateData.street = street.trim()
    if (city !== undefined) updateData.city = city.trim()
    if (state !== undefined) updateData.state = state.trim()
    if (zip !== undefined) updateData.zip = zip.trim()
    if (country !== undefined) updateData.country = country.trim()
    if (isDefault !== undefined) updateData.isDefault = isDefault

    // Update address
    const address = await prisma.address.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Address updated successfully',
        address,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/account/addresses
 * Delete a saved address
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) return authResult.response

    const userId = authResult.user!.userId
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    })

    if (!existingAddress || existingAddress.userId !== userId) {
      return NextResponse.json(
        { error: 'Address not found or access denied' },
        { status: 404 }
      )
    }

    // Delete address
    await prisma.address.delete({
      where: { id },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Address deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
