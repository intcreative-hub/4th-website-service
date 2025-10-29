// ==============================================
// WEBSITE 3RD TIER - UNIFIED CONFIGURATION
// ==============================================
// This is the single source of truth for all website content and settings
// Edit this file to customize your website

// ======================
// FEATURE TOGGLES
// ======================
export const FEATURES = {
  enableBooking: process.env.NEXT_PUBLIC_ENABLE_BOOKING === 'true',
  enableBlog: process.env.NEXT_PUBLIC_ENABLE_BLOG === 'true',
  enableShop: process.env.NEXT_PUBLIC_ENABLE_SHOP === 'true',
  enableNewsletter: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER === 'true',
}

// ======================
// SITE METADATA
// ======================
export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Business Name',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  description: 'Professional business website with booking, blog, and e-commerce capabilities',
  tagline: 'Your Success is Our Mission',
  phone: process.env.NEXT_PUBLIC_PHONE || '(555) 123-4567',
  email: process.env.NEXT_PUBLIC_EMAIL || 'info@yourbusiness.com',
  address: process.env.NEXT_PUBLIC_ADDRESS || '123 Main St, Your City, ST 12345',
  mapsUrl: process.env.NEXT_PUBLIC_MAPS_EMBED_URL || '',
}

// ======================
// BUSINESS HOURS
// ======================
export const BUSINESS_HOURS = {
  weekday: process.env.NEXT_PUBLIC_HOURS_WEEKDAY || '9:00 AM - 6:00 PM',
  weekend: process.env.NEXT_PUBLIC_HOURS_WEEKEND || '10:00 AM - 4:00 PM',
  schedule: [
    { day: 'Monday - Friday', hours: process.env.NEXT_PUBLIC_HOURS_WEEKDAY || '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: process.env.NEXT_PUBLIC_HOURS_WEEKEND || '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ],
}

// ======================
// SOCIAL MEDIA LINKS
// ======================
export const SOCIAL_LINKS = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
}

// ======================
// BRANDING
// ======================
export const BRANDING = {
  colors: {
    primary: '#8b5cf6', // Purple
    secondary: '#10b981', // Emerald
    accent: '#14b8a6', // Teal
  },
  logo: '/logo-placeholder.svg',
}

// ======================
// SERVICES/OFFERINGS
// ======================
export const SERVICES = [
  {
    id: '1',
    title: 'Professional Consulting',
    description: 'Expert guidance and strategic planning tailored to your business needs',
    icon: 'briefcase',
    link: '/services',
  },
  {
    id: '2',
    title: 'Custom Solutions',
    description: 'Tailored solutions designed specifically for your unique challenges',
    icon: 'wrench',
    link: '/services',
  },
  {
    id: '3',
    title: 'Support & Maintenance',
    description: '24/7 support to keep your operations running smoothly',
    icon: 'headphones',
    link: '/services',
  },
  {
    id: '4',
    title: 'Training & Education',
    description: 'Comprehensive training programs to empower your team',
    icon: 'graduationcap',
    link: '/services',
  },
]

// ======================
// VALUE PROPOSITIONS
// ======================
export const VALUE_PROPS = [
  {
    id: '1',
    title: 'Expert Team',
    description: 'Highly skilled professionals with years of industry experience',
    icon: 'users',
  },
  {
    id: '2',
    title: 'Quality Guaranteed',
    description: 'We stand behind our work with a 100% satisfaction guarantee',
    icon: 'shield',
  },
  {
    id: '3',
    title: 'Fast Delivery',
    description: 'Quick turnaround times without compromising on quality',
    icon: 'zap',
  },
  {
    id: '4',
    title: 'Customer First',
    description: 'Your success is our priority. We go above and beyond',
    icon: 'heart',
  },
]

// ======================
// TESTIMONIALS
// ======================
export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CEO, Tech Startup',
    content: 'Working with this team transformed our business. Their expertise and dedication are unmatched.',
    rating: 5,
    avatar: 'SJ',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Marketing Director',
    content: 'Exceptional service from start to finish. They exceeded our expectations in every way.',
    rating: 5,
    avatar: 'MC',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Small Business Owner',
    content: 'The best investment we\'ve made for our company. Highly recommend to anyone!',
    rating: 5,
    avatar: 'ER',
  },
]

// ======================
// FAQ ITEMS
// ======================
export const FAQ_ITEMS = [
  {
    id: '1',
    question: 'How do I get started?',
    answer: 'Getting started is easy! Simply contact us through our contact form or give us a call. We\'ll schedule a consultation to discuss your needs and create a customized plan.',
  },
  {
    id: '2',
    question: 'What are your pricing options?',
    answer: 'We offer flexible pricing tailored to your specific needs and budget. Contact us for a personalized quote based on your requirements.',
  },
  {
    id: '3',
    question: 'Do you offer support after delivery?',
    answer: 'Absolutely! We provide ongoing support and maintenance to ensure everything runs smoothly. Our team is always here to help.',
  },
  {
    id: '4',
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary depending on scope and complexity. Most projects are completed within 2-4 weeks, but we can accommodate rush orders if needed.',
  },
  {
    id: '5',
    question: 'Can I customize my service package?',
    answer: 'Yes! We believe in flexibility. Every business is unique, and we\'ll work with you to create a package that fits your specific needs.',
  },
]

// ======================
// NAVIGATION
// ======================
export const NAV_LINKS = [
  { href: '/#home', label: 'Home' },
  { href: '/#services', label: 'Services' },
  { href: '/about', label: 'About' },
  ...(FEATURES.enableBlog ? [{ href: '/blog', label: 'Blog' }] : []),
  ...(FEATURES.enableShop ? [{ href: '/shop', label: 'Shop' }] : []),
  ...(FEATURES.enableBooking ? [{ href: '/booking', label: 'Book Now' }] : []),
  { href: '/contact', label: 'Contact' },
]

// ======================
// BOOKING SETTINGS
// ======================
export const BOOKING_CONFIG = {
  services: [
    { id: '1', name: 'Consultation (30 min)', duration: 30, price: 0 },
    { id: '2', name: 'Standard Service (1 hour)', duration: 60, price: 100 },
    { id: '3', name: 'Premium Service (2 hours)', duration: 120, price: 200 },
    { id: '4', name: 'Full Day Service', duration: 480, price: 800 },
  ],
  timeSlots: [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
  ],
  workingDays: [1, 2, 3, 4, 5], // Monday to Friday (0 = Sunday)
}

// ======================
// PRODUCT CATEGORIES
// ======================
export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'All Products', slug: 'all' },
  { id: 'featured', name: 'Featured', slug: 'featured' },
  { id: 'new', name: 'New Arrivals', slug: 'new' },
  { id: 'sale', name: 'On Sale', slug: 'sale' },
]

// ======================
// BLOG CATEGORIES
// ======================
export const BLOG_CATEGORIES = [
  { id: 'news', name: 'News', slug: 'news' },
  { id: 'tips', name: 'Tips & Tricks', slug: 'tips' },
  { id: 'guides', name: 'Guides', slug: 'guides' },
  { id: 'updates', name: 'Updates', slug: 'updates' },
]

// ======================
// SEO
// ======================
export const SEO = {
  defaultTitle: SITE_CONFIG.name,
  titleTemplate: `%s | ${SITE_CONFIG.name}`,
  description: SITE_CONFIG.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    handle: '@yourbusiness',
    site: '@yourbusiness',
    cardType: 'summary_large_image',
  },
}

// ======================
// ADMIN SETTINGS
// ======================
export const ADMIN_CONFIG = {
  password: process.env.ADMIN_PASSWORD || 'admin123',
  itemsPerPage: 10,
}

export default {
  FEATURES,
  SITE_CONFIG,
  BUSINESS_HOURS,
  SOCIAL_LINKS,
  BRANDING,
  SERVICES,
  VALUE_PROPS,
  TESTIMONIALS,
  FAQ_ITEMS,
  NAV_LINKS,
  BOOKING_CONFIG,
  PRODUCT_CATEGORIES,
  BLOG_CATEGORIES,
  SEO,
  ADMIN_CONFIG,
}
