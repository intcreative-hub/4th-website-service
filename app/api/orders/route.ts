import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { sendEmail, emailTemplates, ADMIN_EMAIL } from '@/lib/email'

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      billingAddress,
    } = body

    // Validation
    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )
    const tax = subtotal * 0.08 // 8% tax (adjust as needed)
    const shipping = subtotal > 50 ? 0 : 10 // Free shipping over $50
    const total = subtotal + tax + shipping

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe uses cents
      currency: 'usd',
      metadata: {
        orderNumber,
        customerEmail,
      },
      description: `Order ${orderNumber} for ${customerName}`,
    })

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        shippingAddress: shippingAddress || null,
        billingAddress: billingAddress || null,
        subtotal,
        tax,
        shipping,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        paymentId: paymentIntent.id,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
            variant: item.variant || null,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        order,
        clientSecret: paymentIntent.client_secret,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

// GET - Fetch orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const orderNumber = searchParams.get('orderNumber')
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // Admin can see all orders
    if (authHeader === `Bearer ${adminPassword}`) {
      const orders = await prisma.order.findMany({
        include: {
          orderItems: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ orders, count: orders.length }, { status: 200 })
    }

    // Get specific order by order number
    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          orderItems: true,
        },
      })
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json({ order }, { status: 200 })
    }

    // Get orders by customer email
    if (email) {
      const orders = await prisma.order.findMany({
        where: { customerEmail: email },
        include: {
          orderItems: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ orders, count: orders.length }, { status: 200 })
    }

    return NextResponse.json({ error: 'Email or order number required' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderNumber, status, paymentStatus } = body

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const order = await prisma.order.update({
      where: { orderNumber },
      data: updateData,
      include: {
        orderItems: true,
      },
    })

    // Send confirmation email if payment is completed
    if (paymentStatus === 'paid' && order.customerEmail) {
      const emailTemplate = emailTemplates.orderConfirmation({
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        total: order.total,
        items: order.orderItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      })

      await sendEmail({
        to: order.customerEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      })

      // Notify admin
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `New Order Received - ${order.orderNumber}`,
        html: emailTemplate.html,
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order updated successfully',
        order,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
