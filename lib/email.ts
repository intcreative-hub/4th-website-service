import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not defined in environment variables. Email functionality will not work.')
}

export const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key')

export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@yourdomain.com'
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yourdomain.com'

// Email templates
export const emailTemplates = {
  contactSubmission: (data: { name: string; email: string; message: string; service?: string }) => ({
    subject: 'New Contact Form Submission',
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.service ? `<p><strong>Service:</strong> ${data.service}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  }),

  appointmentConfirmation: (data: {
    customerName: string
    service: string
    date: string
    time: string
  }) => ({
    subject: 'Appointment Confirmation',
    html: `
      <h2>Your Appointment is Confirmed!</h2>
      <p>Hi ${data.customerName},</p>
      <p>Your appointment has been confirmed for:</p>
      <ul>
        <li><strong>Service:</strong> ${data.service}</li>
        <li><strong>Date:</strong> ${data.date}</li>
        <li><strong>Time:</strong> ${data.time}</li>
      </ul>
      <p>We look forward to seeing you!</p>
    `,
  }),

  orderConfirmation: (data: {
    customerName: string
    orderNumber: string
    total: number
    items: Array<{ name: string; quantity: number; price: number }>
  }) => ({
    subject: `Order Confirmation #${data.orderNumber}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Hi ${data.customerName},</p>
      <p>Your order #${data.orderNumber} has been received and is being processed.</p>
      <h3>Order Summary:</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="border-bottom: 1px solid #ddd;">
            <th style="text-align: left; padding: 8px;">Item</th>
            <th style="text-align: center; padding: 8px;">Qty</th>
            <th style="text-align: right; padding: 8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${data.items
            .map(
              (item) => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px;">${item.name}</td>
              <td style="text-align: center; padding: 8px;">${item.quantity}</td>
              <td style="text-align: right; padding: 8px;">$${item.price.toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="text-align: right; padding: 8px;"><strong>Total:</strong></td>
            <td style="text-align: right; padding: 8px;"><strong>$${data.total.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>
    `,
  }),

  newsletterWelcome: (data: { name?: string }) => ({
    subject: 'Welcome to Our Newsletter!',
    html: `
      <h2>Welcome!</h2>
      <p>Hi${data.name ? ` ${data.name}` : ''},</p>
      <p>Thank you for subscribing to our newsletter. You'll be the first to know about our latest updates, offers, and news.</p>
      <p>Stay tuned!</p>
    `,
  }),
}

// Helper function to send emails
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  try {
    const response = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    })
    return { success: true, data: response }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}
