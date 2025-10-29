# Website 3rd Tier ($600 Package)

## 🚀 **Professional Business Website with Booking, Blog & E-Commerce**

A modern, full-stack Next.js 15 application designed for service businesses that need advanced features beyond a basic website. This is the perfect mid-tier solution between a simple brochure site and a complex enterprise platform.

---

## ✨ **What's Included**

### 🎯 **Core Features**
- ✅ **Modern Tech Stack**: Next.js 15, React 18, TypeScript, Tailwind CSS
- ✅ **Database-Driven**: PostgreSQL + Prisma ORM
- ✅ **E-Commerce Ready**: Product catalog, shopping cart, Stripe checkout
- ✅ **Booking System**: Appointment scheduling with email confirmations
- ✅ **Blog Platform**: Full-featured blog with categories and SEO
- ✅ **Email Marketing**: Newsletter signup with automated welcome emails
- ✅ **Contact Management**: Form submissions saved to database
- ✅ **Admin Dashboard**: Manage products, orders, bookings, blog posts
- ✅ **Payment Processing**: Stripe integration for online payments
- ✅ **Email Notifications**: Automated emails via Resend
- ✅ **Responsive Design**: Mobile-first, works on all devices
- ✅ **SEO Optimized**: Meta tags, structured data, sitemaps
- ✅ **Feature Toggles**: Easily enable/disable features

### 📦 **What Makes This Different from 2nd Tier**

| Feature | 2nd Tier ($400) | 3rd Tier ($600) | Added Value |
|---------|----------------|----------------|-------------|
| **Content Management** | Hardcoded | Database-driven | Edit without code |
| **E-Commerce** | ❌ | ✅ Full shop + cart | Sell online |
| **Booking System** | ❌ | ✅ Appointments | Capture bookings 24/7 |
| **Blog** | ❌ | ✅ Full CMS | Content marketing |
| **Newsletter** | ❌ | ✅ Automated emails | Build audience |
| **Admin Panel** | ❌ | ✅ Full dashboard | Manage everything |
| **Database** | ❌ | ✅ PostgreSQL | Data persistence |
| **Payments** | ❌ | ✅ Stripe | Accept payments |
| **Email Service** | Console logs | ✅ Resend API | Real emails |

---

## 🛠️ **Tech Stack**

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library with Server Components
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management (shopping cart)
- **React Hot Toast** - Notifications

### Backend
- **Prisma ORM** - Type-safe database client
- **PostgreSQL 15** - Relational database
- **Stripe** - Payment processing
- **Resend** - Email delivery service

### Development
- **ESLint** - Code linting
- **Docker** - Containerization
- **Git** - Version control

---

## 📋 **Prerequisites**

Before you begin, ensure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Docker** (for PostgreSQL database)
- **Stripe Account** (for payments)
- **Resend Account** (for emails)

---

## 🚀 **Getting Started**

### 1. Clone the Repository

```bash
git clone https://github.com/intcreative-hub/Website-3rd-tier.git
cd Website-3rd-tier
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/website_3rd_tier?schema=public"

# Stripe (get from https://stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Resend (get from https://resend.com)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"

# Admin Password
ADMIN_PASSWORD="your-secure-password"

# Feature Toggles
NEXT_PUBLIC_ENABLE_BOOKING=true
NEXT_PUBLIC_ENABLE_BLOG=true
NEXT_PUBLIC_ENABLE_SHOP=true
NEXT_PUBLIC_ENABLE_NEWSLETTER=true
```

### 4. Start Database

```bash
# Start PostgreSQL via Docker
docker-compose up -d db

# Verify it's running
docker ps
```

### 5. Run Database Migrations

```bash
# Create database tables
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 6. Seed Database (Optional but Recommended)

```bash
# Add sample products and blog posts
npm run db:seed
```

This will create:
- 10 sample products
- 5 blog posts
- 3 newsletter subscribers

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 **Project Structure**

```
Website-3rd-tier/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── contact/              # Contact form submissions
│   │   ├── bookings/             # Appointment management
│   │   ├── newsletter/           # Newsletter subscriptions
│   │   ├── products/             # Product CRUD
│   │   └── orders/               # Order processing
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── services/                 # Services page
│   ├── shop/                     # 🚧 Shop pages (TODO)
│   ├── blog/                     # 🚧 Blog pages (TODO)
│   ├── booking/                  # 🚧 Booking page (TODO)
│   ├── admin/                    # 🚧 Admin dashboard (TODO)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ContactForm.tsx
│   ├── ToastProvider.tsx
│   └── ... (13 total components)
├── lib/                          # Utilities & config
│   ├── prisma.ts                 # Database client
│   ├── stripe.ts                 # Payment processing
│   ├── email.ts                  # Email service
│   ├── store.ts                  # Shopping cart state
│   └── config.ts                 # Unified configuration
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Sample data
├── public/                       # Static assets
├── docker-compose.yml            # Docker configuration
├── .env.example                  # Environment template
├── PROJECT_STATUS.md             # 📊 Detailed status
└── README.md                     # You are here
```

---

## 🗄️ **Database Schema**

The application uses 8 main database models:

1. **User** - Future authentication system
2. **ContactSubmission** - Contact form entries
3. **Appointment** - Booking appointments
4. **BlogPost** - Blog articles
5. **Product** - E-commerce products
6. **Order** & **OrderItem** - Purchase orders
7. **Newsletter** - Email subscribers

View the full schema in `prisma/schema.prisma`.

### Database Commands

```bash
# View database in browser
npx prisma studio

# Create a migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database
npm run db:seed
```

---

## 🔌 **API Endpoints**

### Public Endpoints

#### Contact Form
```
POST /api/contact
Body: { name, email, phone?, service?, message }
```

#### Bookings
```
POST /api/bookings
Body: { customerName, customerEmail, customerPhone, service, date, time, notes? }

GET /api/bookings?email=user@example.com
```

#### Newsletter
```
POST /api/newsletter
Body: { email, name?, source? }

DELETE /api/newsletter?email=user@example.com
```

#### Products
```
GET /api/products?category=services&featured=true&search=marketing
```

#### Orders
```
POST /api/orders
Body: { customerName, customerEmail, customerPhone?, items[], shippingAddress?, billingAddress? }

GET /api/orders?email=user@example.com
GET /api/orders?orderNumber=ORD-123
```

### Admin Endpoints (require `Authorization: Bearer {ADMIN_PASSWORD}`)

```
GET /api/contact - List all contact submissions
GET /api/bookings - List all appointments
GET /api/newsletter - List all subscribers
GET /api/products - All products (with admin actions)
POST /api/products - Create product
PUT /api/products - Update product
DELETE /api/products?id=xxx - Delete product
GET /api/orders - List all orders
PUT /api/orders - Update order status
```

---

## ⚙️ **Configuration**

All website content and settings are in `/lib/config.ts`:

```typescript
// Enable/disable features
export const FEATURES = {
  enableBooking: true,
  enableBlog: true,
  enableShop: true,
  enableNewsletter: true,
}

// Site information
export const SITE_CONFIG = {
  name: 'Your Business Name',
  url: 'https://yourdomain.com',
  phone: '(555) 123-4567',
  email: 'info@yourbusiness.com',
  // ... more settings
}

// Services, testimonials, FAQs, etc.
// Edit these arrays to customize your content
```

---

## 🎨 **Customization Guide**

### Change Colors

Edit `lib/config.ts`:

```typescript
export const BRANDING = {
  colors: {
    primary: '#8b5cf6',    // Purple
    secondary: '#10b981',  // Emerald
    accent: '#14b8a6',     // Teal
  },
}
```

### Change Content

All content is in `lib/config.ts`:
- Services/offerings
- Testimonials
- FAQs
- Navigation links
- Business hours
- Social media links

### Add/Remove Pages

Enable or disable features in `.env`:

```env
NEXT_PUBLIC_ENABLE_BOOKING=true
NEXT_PUBLIC_ENABLE_BLOG=false
NEXT_PUBLIC_ENABLE_SHOP=true
NEXT_PUBLIC_ENABLE_NEWSLETTER=true
```

### Customize Email Templates

Edit `lib/email.ts` to modify email content.

---

## 📧 **Email Configuration**

This project uses [Resend](https://resend.com) for email delivery.

### Setup Steps:
1. Create a free Resend account
2. Add your domain
3. Verify DNS records
4. Get your API key
5. Add to `.env`:

```env
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"
```

### Email Templates

Pre-built templates for:
- Contact form submissions
- Booking confirmations
- Order confirmations
- Newsletter welcome

Customize in `lib/email.ts`.

---

## 💳 **Stripe Configuration**

### Setup Steps:
1. Create a Stripe account
2. Get test API keys from dashboard
3. Add to `.env`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

### Test Mode

Use Stripe test card numbers:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`

Any future expiry date and any CVC.

---

## 🚢 **Deployment**

### Option 1: Docker (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Stop services
docker-compose down
```

Access at `http://localhost:3000`

### Option 2: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Note:** You'll need to set up a PostgreSQL database (e.g., Supabase, Neon, Railway) and update the `DATABASE_URL` in Vercel's environment variables.

### Environment Variables for Production

Ensure all these are set in your hosting platform:
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- Feature toggle variables

---

## 📊 **Project Status**

**Current Progress: 60% Complete**

### ✅ Completed:
- Full backend infrastructure
- All database models
- All API routes
- Payment integration
- Email system
- Configuration system

### 🚧 In Progress:
- Frontend pages (shop, blog, booking)
- Admin dashboard
- Additional UI components

See `PROJECT_STATUS.md` for detailed breakdown and implementation guidance.

---

## 🤝 **Support**

### Need Help?

1. Check `PROJECT_STATUS.md` for implementation guidance
2. Review API documentation above
3. Check environment variables are correct
4. Ensure database is running (`docker ps`)

### Common Issues

**Database connection error:**
```bash
# Restart PostgreSQL
docker-compose restart db

# Check DATABASE_URL in .env
```

**Prisma errors:**
```bash
# Regenerate client
npx prisma generate

# Reset database (WARNING: deletes data)
npx prisma migrate reset
```

**Email not sending:**
- Verify RESEND_API_KEY is correct
- Check email domain is verified in Resend
- Look at console for error messages

---

## 📝 **License**

Proprietary - INT Creative

---

## 🎯 **Next Steps**

1. ✅ Set up environment variables
2. ✅ Start database and run migrations
3. ✅ Seed with sample data
4. ✅ Test API endpoints
5. 🚧 Build frontend pages (see PROJECT_STATUS.md)
6. 🚧 Create admin dashboard
7. 🚧 Test full user flow
8. 🚧 Deploy to production

---

**Questions?** Check `PROJECT_STATUS.md` for detailed implementation guidance.

**Version:** 3.0.0
**Last Updated:** October 29, 2025
