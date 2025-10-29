import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, source } = body

    // Validation
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json({ error: 'This email is already subscribed' }, { status: 400 })
      }
      // Resubscribe if previously unsubscribed
      await prisma.newsletter.update({
        where: { email },
        data: {
          status: 'active',
          name: name || existing.name,
          unsubscribedAt: null,
          confirmedAt: new Date(),
        },
      })
    } else {
      // Create new subscription
      await prisma.newsletter.create({
        data: {
          email,
          name: name || null,
          source: source || 'website',
          status: 'active',
          confirmedAt: new Date(),
        },
      })
    }

    // Send welcome email
    const emailTemplate = emailTemplates.newsletterWelcome({ name })
    await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter!',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Failed to subscribe to newsletter' }, { status: 500 })
  }
}

// GET - Get newsletter subscribers (admin only)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscribers = await prisma.newsletter.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ subscribers, count: subscribers.length }, { status: 200 })
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

// DELETE - Unsubscribe from newsletter
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (!subscriber) {
      return NextResponse.json({ error: 'Email not found in our system' }, { status: 404 })
    }

    await prisma.newsletter.update({
      where: { email },
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully unsubscribed from newsletter',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }
}
