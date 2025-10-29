import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clean existing data (optional - comment out if you want to keep existing data)
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.contactSubmission.deleteMany()

  // Seed Products
  console.log('Seeding products...')
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Premium Business Consultation',
        slug: 'premium-business-consultation',
        description:
          'Get expert advice from our seasoned consultants. This comprehensive package includes market analysis, strategy development, and implementation guidance to help your business thrive.',
        price: 499.99,
        salePrice: 399.99,
        images: [
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
        ],
        category: 'services',
        stock: 100,
        sku: 'SRV-001',
        featured: true,
        active: true,
        tags: ['consulting', 'business', 'strategy', 'featured'],
      },
      {
        name: 'Digital Marketing Package',
        slug: 'digital-marketing-package',
        description:
          'Comprehensive digital marketing services including SEO, social media management, content creation, and analytics. Drive traffic and convert leads effectively.',
        price: 799.99,
        images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
        category: 'services',
        stock: 50,
        sku: 'SRV-002',
        featured: true,
        active: true,
        tags: ['marketing', 'digital', 'seo', 'social media'],
      },
      {
        name: 'Website Development',
        slug: 'website-development',
        description:
          'Custom website development tailored to your business needs. Includes responsive design, modern UI/UX, SEO optimization, and ongoing support.',
        price: 2999.99,
        images: ['https://images.unsplash.com/photo-1547658719-da2b51169166?w=800'],
        category: 'services',
        stock: 25,
        sku: 'SRV-003',
        featured: true,
        active: true,
        tags: ['development', 'website', 'design', 'featured'],
      },
      {
        name: 'Brand Identity Design',
        slug: 'brand-identity-design',
        description:
          'Complete brand identity package including logo design, color palette, typography, brand guidelines, and marketing materials to establish your unique brand presence.',
        price: 1299.99,
        salePrice: 999.99,
        images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'],
        category: 'design',
        stock: 75,
        sku: 'DSN-001',
        featured: false,
        active: true,
        tags: ['design', 'branding', 'logo', 'identity'],
      },
      {
        name: 'Social Media Management',
        slug: 'social-media-management',
        description:
          'Full-service social media management across all major platforms. Includes content creation, scheduling, engagement, and monthly analytics reports.',
        price: 599.99,
        images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800'],
        category: 'marketing',
        stock: 100,
        sku: 'MKT-001',
        featured: false,
        active: true,
        tags: ['social media', 'marketing', 'content'],
      },
      {
        name: 'SEO Optimization Package',
        slug: 'seo-optimization-package',
        description:
          'Comprehensive SEO services to improve your search rankings. Includes keyword research, on-page optimization, link building, and performance tracking.',
        price: 899.99,
        images: ['https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?w=800'],
        category: 'marketing',
        stock: 60,
        sku: 'MKT-002',
        featured: false,
        active: true,
        tags: ['seo', 'optimization', 'marketing', 'search'],
      },
      {
        name: 'Content Creation Bundle',
        slug: 'content-creation-bundle',
        description:
          'Professional content creation services including blog posts, social media content, email newsletters, and video scripts to engage your audience.',
        price: 449.99,
        images: ['https://images.unsplash.com/photo-1542435503-956c469947f6?w=800'],
        category: 'marketing',
        stock: 80,
        sku: 'MKT-003',
        featured: false,
        active: true,
        tags: ['content', 'writing', 'marketing', 'creation'],
      },
      {
        name: 'Business Analytics Dashboard',
        slug: 'business-analytics-dashboard',
        description:
          'Custom analytics dashboard to track your key business metrics. Real-time data visualization, automated reports, and actionable insights.',
        price: 1799.99,
        images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'],
        category: 'services',
        stock: 40,
        sku: 'SRV-004',
        featured: false,
        active: true,
        tags: ['analytics', 'dashboard', 'data', 'insights'],
      },
      {
        name: 'E-commerce Setup Package',
        slug: 'ecommerce-setup-package',
        description:
          'Complete e-commerce solution with product catalog, shopping cart, payment integration, inventory management, and order tracking.',
        price: 3499.99,
        salePrice: 2999.99,
        images: ['https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800'],
        category: 'services',
        stock: 20,
        sku: 'SRV-005',
        featured: true,
        active: true,
        tags: ['ecommerce', 'online store', 'shopping', 'featured'],
      },
      {
        name: 'Mobile App Development',
        slug: 'mobile-app-development',
        description:
          'Native iOS and Android app development with modern UI, seamless performance, and cross-platform compatibility. Includes app store submission.',
        price: 8999.99,
        images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800'],
        category: 'services',
        stock: 15,
        sku: 'SRV-006',
        featured: false,
        active: true,
        tags: ['mobile', 'app', 'development', 'ios', 'android'],
      },
    ],
  })
  console.log(`Created ${products.count} products`)

  // Seed Blog Posts
  console.log('Seeding blog posts...')
  const blogPosts = await prisma.blogPost.createMany({
    data: [
      {
        title: '10 Essential Tips for Growing Your Small Business in 2025',
        slug: '10-essential-tips-growing-small-business-2025',
        excerpt:
          'Discover the proven strategies that successful entrepreneurs use to scale their businesses in the modern marketplace.',
        content: `
# 10 Essential Tips for Growing Your Small Business in 2025

Growing a small business in today's competitive landscape requires strategic thinking, adaptability, and a customer-first approach. Here are ten essential tips to help your business thrive in 2025 and beyond.

## 1. Embrace Digital Transformation

In 2025, having a strong digital presence isn't optional—it's essential. This means more than just having a website. You need to be where your customers are, whether that's social media, mobile apps, or online marketplaces.

## 2. Focus on Customer Experience

Your customers have more choices than ever before. The businesses that succeed are those that prioritize exceptional customer experiences at every touchpoint.

## 3. Leverage Data and Analytics

Make data-driven decisions by tracking key metrics and understanding customer behavior. Modern analytics tools make it easier than ever to gain actionable insights.

## 4. Build a Strong Brand Identity

Your brand is more than your logo—it's the entire experience customers have with your business. Invest in creating a cohesive brand identity that resonates with your target audience.

## 5. Invest in Your Team

Your employees are your greatest asset. Provide training, create a positive work culture, and empower your team to make decisions.

## 6. Optimize Your Operations

Look for ways to streamline processes, reduce costs, and improve efficiency. Automation and technology can help you do more with less.

## 7. Network and Collaborate

Build relationships with other businesses, join industry associations, and look for collaboration opportunities. Sometimes the best growth comes from strategic partnerships.

## 8. Stay Financially Healthy

Keep a close eye on cash flow, maintain a financial cushion, and make informed financial decisions. Consider working with a financial advisor or accountant.

## 9. Adapt and Innovate

The business landscape is constantly changing. Stay informed about industry trends, be willing to pivot when necessary, and continuously look for ways to improve.

## 10. Never Stop Marketing

Consistent marketing is essential for growth. Whether it's content marketing, social media, email campaigns, or traditional advertising, keep your business top-of-mind for your target audience.

---

**Ready to take your business to the next level?** Contact us today to learn how we can help you implement these strategies and achieve your growth goals.
        `,
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
        author: 'Sarah Johnson',
        category: 'tips',
        tags: ['business growth', 'small business', 'entrepreneurship', 'strategy'],
        published: true,
        views: 1247,
        readTime: 8,
        publishedAt: new Date('2025-01-15'),
      },
      {
        title: 'The Ultimate Guide to Digital Marketing for Local Businesses',
        slug: 'ultimate-guide-digital-marketing-local-businesses',
        excerpt:
          'Learn how to leverage digital marketing to attract more local customers and grow your community presence.',
        content: `
# The Ultimate Guide to Digital Marketing for Local Businesses

Digital marketing has leveled the playing field for local businesses. With the right strategies, you can compete with larger competitors and reach customers in your area more effectively than ever before.

## Understanding Local SEO

Local SEO is the foundation of digital marketing for local businesses. When potential customers search for products or services "near me," you want your business to appear at the top of the results.

### Key Local SEO Strategies:

- **Google Business Profile**: Claim and optimize your profile with accurate information, photos, and customer reviews
- **Local Keywords**: Include location-specific keywords in your website content
- **NAP Consistency**: Ensure your Name, Address, and Phone number are consistent across all online platforms
- **Local Citations**: Get listed in relevant local directories and business listings

## Social Media for Local Engagement

Social media is perfect for building relationships with local customers. Focus on platforms where your target audience spends time.

### Best Practices:

- Share local content and community news
- Engage with other local businesses
- Use location tags and local hashtags
- Run geo-targeted ads
- Respond promptly to messages and comments

## Content Marketing That Resonates Locally

Create content that speaks to your local audience. This could include:

- Local event coverage
- Community involvement and sponsorships
- Local customer success stories
- Area guides and resources
- Behind-the-scenes content

## Email Marketing for Customer Retention

Build an email list of local customers and send them regular updates, special offers, and valuable content.

## Paid Advertising

While organic reach is important, paid advertising can give you a quick boost. Consider:

- Google Local Services Ads
- Facebook and Instagram geo-targeted ads
- Display advertising on local news websites

---

**Need help with your digital marketing?** Our team specializes in helping local businesses grow their online presence and attract more customers.
        `,
        coverImage: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200',
        author: 'Michael Chen',
        category: 'guides',
        tags: ['digital marketing', 'local business', 'seo', 'social media'],
        published: true,
        views: 892,
        readTime: 12,
        publishedAt: new Date('2025-01-10'),
      },
      {
        title: 'Why Every Business Needs a Professional Website in 2025',
        slug: 'why-every-business-needs-professional-website-2025',
        excerpt:
          'In the digital age, your website is often the first impression customers have of your business. Here's why it matters more than ever.',
        content: `
# Why Every Business Needs a Professional Website in 2025

Your website is your digital storefront, open 24/7 to customers around the world. In 2025, having a professional website isn't just recommended—it's essential for business success.

## First Impressions Matter

When potential customers research your business, they're likely starting online. A professional website immediately establishes credibility and trust.

## Your Website Works Around the Clock

Unlike a physical store, your website never closes. Customers can learn about your products, services, and values at any time that's convenient for them.

## Compete with Larger Businesses

A well-designed website levels the playing field, allowing small businesses to compete with much larger competitors.

## Control Your Brand Narrative

Your website allows you to tell your story exactly the way you want it told, without intermediaries or limitations.

## Generate Leads and Sales

Modern websites are sophisticated marketing machines that can:
- Capture email addresses for marketing
- Showcase products and services
- Enable online booking or purchases
- Provide customer support
- Build trust through testimonials and case studies

## Essential Website Features for 2025

1. **Mobile Responsiveness**: Most web traffic now comes from mobile devices
2. **Fast Loading Speed**: Users expect instant page loads
3. **Clear Call-to-Actions**: Guide visitors toward taking action
4. **Contact Information**: Make it easy for customers to reach you
5. **Social Proof**: Display reviews, testimonials, and trust badges
6. **Security**: SSL certificates and secure payment processing
7. **SEO Optimization**: Help customers find you through search engines

## The Cost of Not Having a Website

Without a professional website, you're:
- Missing out on potential customers
- Losing credibility in a digital-first world
- Giving competitors an advantage
- Limiting your growth potential

---

**Ready to build your professional website?** Contact us today for a free consultation and quote.
        `,
        coverImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200',
        author: 'Emily Rodriguez',
        category: 'guides',
        tags: ['website', 'web development', 'business', 'online presence'],
        published: true,
        views: 2103,
        readTime: 6,
        publishedAt: new Date('2025-01-05'),
      },
      {
        title: 'How to Build a Strong Brand Identity from Scratch',
        slug: 'how-to-build-strong-brand-identity-from-scratch',
        excerpt:
          'A comprehensive guide to creating a memorable brand identity that resonates with your target audience and stands out from competitors.',
        content: `
# How to Build a Strong Brand Identity from Scratch

Your brand identity is more than just a logo—it's the complete personality of your business. Here's how to build a brand that customers remember and trust.

## Understanding Brand Identity

Brand identity encompasses all the visual and verbal elements that represent your business:
- Logo and visual design
- Color palette and typography
- Tone of voice and messaging
- Brand values and personality
- Customer experience

## Step 1: Define Your Brand Strategy

Before designing anything, understand:
- **Your Purpose**: Why does your business exist?
- **Your Audience**: Who are you serving?
- **Your Values**: What do you stand for?
- **Your Positioning**: What makes you different?

## Step 2: Develop Your Visual Identity

Create a cohesive visual system that includes:
- A memorable logo
- A consistent color palette
- Typography choices
- Imagery style
- Design elements and patterns

## Step 3: Craft Your Brand Voice

Your brand voice should:
- Reflect your personality
- Resonate with your audience
- Be consistent across all channels
- Differentiate you from competitors

## Step 4: Create Brand Guidelines

Document everything to ensure consistency:
- Logo usage rules
- Color specifications
- Typography guidelines
- Tone of voice examples
- Do's and don'ts

## Step 5: Implement Consistently

Apply your brand identity everywhere:
- Website and digital presence
- Marketing materials
- Social media
- Packaging and products
- Customer communications

## Common Branding Mistakes to Avoid

1. Copying competitors
2. Inconsistent application
3. Following trends blindly
4. Ignoring your audience
5. Making frequent changes

---

**Need help building your brand?** Our design team specializes in creating cohesive brand identities that drive business growth.
        `,
        coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
        author: 'David Kim',
        category: 'guides',
        tags: ['branding', 'design', 'marketing', 'business identity'],
        published: true,
        views: 1567,
        readTime: 10,
        publishedAt: new Date('2025-01-01'),
      },
      {
        title: '2025 Digital Marketing Trends You Can't Ignore',
        slug: '2025-digital-marketing-trends-you-cant-ignore',
        excerpt:
          'Stay ahead of the curve with these emerging digital marketing trends that will shape the industry in 2025.',
        content: `
# 2025 Digital Marketing Trends You Can't Ignore

The digital marketing landscape is constantly evolving. Here are the key trends that will define success in 2025.

## 1. AI-Powered Marketing Automation

Artificial intelligence is revolutionizing how businesses interact with customers through:
- Personalized content recommendations
- Chatbots and virtual assistants
- Predictive analytics
- Automated ad optimization

## 2. Voice Search Optimization

With the rise of smart speakers and voice assistants, optimizing for voice search is crucial. Focus on:
- Conversational keywords
- Featured snippets
- Local SEO
- FAQ-style content

## 3. Video Content Dominance

Video continues to be the most engaging content format:
- Short-form video (TikTok, Reels, Shorts)
- Live streaming
- Interactive video
- Video SEO

## 4. Privacy-First Marketing

With increasing data privacy regulations:
- First-party data collection
- Transparent data practices
- Cookieless tracking solutions
- Building direct customer relationships

## 5. Social Commerce

Social media platforms are becoming full-featured shopping destinations:
- In-app purchases
- Shoppable posts
- Live shopping events
- Social proof integration

## 6. Sustainability Marketing

Consumers increasingly care about environmental impact:
- Authentic sustainability messaging
- Transparent business practices
- Eco-friendly initiatives
- Purpose-driven campaigns

## 7. Micro and Nano Influencers

Smaller, niche influencers often drive better engagement:
- Higher authenticity
- Stronger community connections
- Better ROI
- More targeted audiences

## Preparing Your Business for These Trends

1. **Audit Your Current Strategy**: Identify gaps and opportunities
2. **Invest in New Technologies**: Don't fall behind on tools and platforms
3. **Test and Learn**: Experiment with new approaches
4. **Stay Customer-Focused**: Trends matter, but your customers matter more

---

**Want to stay ahead of the curve?** Contact us to develop a forward-thinking marketing strategy for your business.
        `,
        coverImage: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200',
        author: 'Sarah Johnson',
        category: 'updates',
        tags: ['trends', 'digital marketing', '2025', 'innovation'],
        published: true,
        views: 3421,
        readTime: 9,
        publishedAt: new Date('2024-12-28'),
      },
    ],
  })
  console.log(`Created ${blogPosts.count} blog posts`)

  // Seed Newsletter Subscribers
  console.log('Seeding newsletter subscribers...')
  const newsletters = await prisma.newsletter.createMany({
    data: [
      {
        email: 'subscriber1@example.com',
        name: 'John Doe',
        status: 'active',
        source: 'website',
        confirmedAt: new Date(),
      },
      {
        email: 'subscriber2@example.com',
        name: 'Jane Smith',
        status: 'active',
        source: 'footer',
        confirmedAt: new Date(),
      },
      {
        email: 'subscriber3@example.com',
        status: 'active',
        source: 'popup',
        confirmedAt: new Date(),
      },
    ],
  })
  console.log(`Created ${newsletters.count} newsletter subscribers`)

  console.log('Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
