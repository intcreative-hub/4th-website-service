import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates, ADMIN_EMAIL } from '@/lib/email'
import { format } from 'date-fns'

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, customerPhone, service, date, time, notes } = body

    // Validation
    if (!customerName || !customerEmail || !customerPhone || !service || !date || !time) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Create booking in database
    const appointment = await prisma.appointment.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        service,
        date: new Date(date),
        time,
        notes: notes || null,
        status: 'pending',
      },
    })

    // Send confirmation email to customer
    const emailTemplate = emailTemplates.appointmentConfirmation({
      customerName,
      service,
      date: format(new Date(date), 'MMMM d, yyyy'),
      time,
    })

    await sendEmail({
      to: customerEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    })

    // Notify admin
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: 'New Booking Request',
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${format(new Date(date), 'MMMM d, yyyy')}</p>
        <p><strong>Time:</strong> ${time}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
      `,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Booking created successfully!',
        appointment,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

// GET - Retrieve bookings (admin only, or by email)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // If admin token provided, return all bookings
    if (authHeader === `Bearer ${adminPassword}`) {
      const appointments = await prisma.appointment.findMany({
        orderBy: { date: 'asc' },
      })
      return NextResponse.json({ appointments }, { status: 200 })
    }

    // If email provided, return bookings for that email
    if (email) {
      const appointments = await prisma.appointment.findMany({
        where: { customerEmail: email },
        orderBy: { date: 'asc' },
      })
      return NextResponse.json({ appointments }, { status: 200 })
    }

    return NextResponse.json({ error: 'Unauthorized or missing email parameter' }, { status: 401 })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
