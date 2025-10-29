import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/analytics
 * Get comprehensive analytics data
 */
export async function GET(request: NextRequest) {
  try {
    // Simple admin auth check
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters for date filtering
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y

    // Calculate date range
    let dateFilter: any = {}
    const now = new Date()

    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    } else {
      // Default period-based filtering
      const daysAgo = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
      const startOfPeriod = new Date(now)
      startOfPeriod.setDate(startOfPeriod.getDate() - daysAgo)
      dateFilter = {
        gte: startOfPeriod,
      }
    }

    // ============================================
    // 1. REVENUE ANALYTICS
    // ============================================
    const orders = await prisma.order.findMany({
      where: {
        createdAt: dateFilter,
      },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
      },
    })

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Revenue by status
    const revenueByStatus = {
      completed: orders
        .filter((o) => o.status === 'delivered' || o.status === 'completed')
        .reduce((sum, o) => sum + o.total, 0),
      pending: orders
        .filter((o) => o.status === 'pending' || o.status === 'processing')
        .reduce((sum, o) => sum + o.total, 0),
      cancelled: orders.filter((o) => o.status === 'cancelled').reduce((sum, o) => sum + o.total, 0),
    }

    // Daily revenue trends (last 30 days)
    const dailyRevenue: { date: string; revenue: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayOrders = orders.filter(
        (o) => o.createdAt >= date && o.createdAt < nextDate
      )
      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.total, 0)

      dailyRevenue.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue,
      })
    }

    // ============================================
    // 2. ORDER STATISTICS
    // ============================================
    const orderStats = {
      total: orders.length,
      pending: orders.filter(
        (o) => o.status === 'pending' || o.status === 'processing'
      ).length,
      completed: orders.filter(
        (o) => o.status === 'delivered' || o.status === 'completed'
      ).length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    }

    // ============================================
    // 3. TOP SELLING PRODUCTS
    // ============================================
    const allOrders = await prisma.order.findMany({
      where: {
        createdAt: dateFilter,
      },
      select: {
        items: true,
      },
    })

    // Count product sales
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}

    for (const order of allOrders) {
      if (typeof order.items === 'object' && order.items !== null) {
        const items = order.items as any[]
        for (const item of items) {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              name: item.name || 'Unknown Product',
              quantity: 0,
              revenue: 0,
            }
          }
          productSales[item.productId].quantity += item.quantity || 1
          productSales[item.productId].revenue += (item.price || 0) * (item.quantity || 1)
        }
      }
    }

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        id,
        name: data.name,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // ============================================
    // 4. CUSTOMER ANALYTICS
    // ============================================
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'customer',
      },
    })

    const newCustomers = await prisma.user.count({
      where: {
        role: 'customer',
        createdAt: dateFilter,
      },
    })

    // Customer growth (last 30 days)
    const customerGrowth: { date: string; total: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const count = await prisma.user.count({
        where: {
          role: 'customer',
          createdAt: {
            lte: date,
          },
        },
      })

      customerGrowth.push({
        date: date.toISOString().split('T')[0],
        total: count,
      })
    }

    // ============================================
    // 5. PRODUCT INVENTORY ANALYTICS
    // ============================================
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 10,
        },
        active: true,
      },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
      },
      orderBy: {
        stock: 'asc',
      },
      take: 10,
    })

    const totalProducts = await prisma.product.count({
      where: {
        active: true,
      },
    })

    const outOfStockProducts = await prisma.product.count({
      where: {
        stock: 0,
        active: true,
      },
    })

    // ============================================
    // 6. CATEGORY PERFORMANCE
    // ============================================
    const productsByCategory = await prisma.product.groupBy({
      by: ['category'],
      _count: true,
      where: {
        active: true,
      },
    })

    const categoryPerformance = productsByCategory.map((cat) => ({
      category: cat.category,
      productCount: cat._count,
    }))

    // ============================================
    // 7. RECENT ACTIVITY
    // ============================================
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // ============================================
    // RETURN COMPREHENSIVE ANALYTICS
    // ============================================
    return NextResponse.json(
      {
        success: true,
        analytics: {
          revenue: {
            total: totalRevenue,
            byStatus: revenueByStatus,
            dailyTrends: dailyRevenue,
          },
          orders: orderStats,
          topProducts,
          customers: {
            total: totalCustomers,
            new: newCustomers,
            growth: customerGrowth,
          },
          inventory: {
            totalProducts,
            outOfStock: outOfStockProducts,
            lowStock: lowStockProducts,
          },
          categories: categoryPerformance,
          recentActivity: recentOrders,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
