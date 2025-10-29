import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/analytics/export
 * Export analytics data as CSV
 */
export async function GET(request: NextRequest) {
  try {
    // Simple admin auth check
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'orders' // orders, products, customers, revenue
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Calculate date filter
    let dateFilter: any = {}
    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      dateFilter = {
        gte: thirtyDaysAgo,
      }
    }

    let csvContent = ''

    // ============================================
    // ORDERS EXPORT
    // ============================================
    if (type === 'orders') {
      const orders = await prisma.order.findMany({
        where: {
          createdAt: dateFilter,
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      // CSV Header
      csvContent = 'Order ID,Customer Name,Customer Email,Status,Total,Items Count,Created At\n'

      // CSV Rows
      orders.forEach((order) => {
        const itemsCount = Array.isArray(order.items)
          ? order.items.length
          : typeof order.items === 'object'
          ? Object.keys(order.items).length
          : 0

        csvContent += `${order.id},"${order.customer.name}","${order.customer.email}",${order.status},${order.total},${itemsCount},${order.createdAt.toISOString()}\n`
      })
    }

    // ============================================
    // PRODUCTS EXPORT
    // ============================================
    else if (type === 'products') {
      const products = await prisma.product.findMany({
        where: {
          active: true,
        },
        orderBy: {
          name: 'asc',
        },
      })

      // CSV Header
      csvContent = 'Product ID,Name,Category,Price,Sale Price,Stock,Featured,Active,Created At\n'

      // CSV Rows
      products.forEach((product) => {
        csvContent += `${product.id},"${product.name}","${product.category}",${product.price},${product.salePrice || ''},${product.stock},${product.featured},${product.active},${product.createdAt.toISOString()}\n`
      })
    }

    // ============================================
    // CUSTOMERS EXPORT
    // ============================================
    else if (type === 'customers') {
      const customers = await prisma.user.findMany({
        where: {
          role: 'customer',
          createdAt: dateFilter,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      // CSV Header
      csvContent = 'Customer ID,Name,Email,Phone,Total Orders,Registered At\n'

      // CSV Rows
      customers.forEach((customer) => {
        csvContent += `${customer.id},"${customer.name}","${customer.email}","${customer.phone || ''}",${customer._count.orders},${customer.createdAt.toISOString()}\n`
      })
    }

    // ============================================
    // REVENUE EXPORT
    // ============================================
    else if (type === 'revenue') {
      const orders = await prisma.order.findMany({
        where: {
          createdAt: dateFilter,
        },
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          customer: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      // CSV Header
      csvContent = 'Order ID,Customer,Amount,Status,Date\n'

      // CSV Rows
      orders.forEach((order) => {
        csvContent += `${order.id},"${order.customer.name}",${order.total},${order.status},${order.createdAt.toISOString()}\n`
      })
    }

    // Return CSV as downloadable file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="analytics-${type}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting analytics:', error)
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    )
  }
}
