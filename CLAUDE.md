# Purple Haze Smoke Shop - Project Memory

## Project Context
Modern landing page for Purple Haze Smoke Shop in Brunswick, Ohio. Single-page design with dark theme, 3D hero animation, and smooth scroll effects.

## Technology Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS (dark theme, emerald + purple accents)
- **3D Graphics**: React Three Fiber + Drei
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Docker + docker-compose (primary), Vercel (alternative)

## Project Structure
```
/home/intadmin/INT-Creative/ACTIVE-PROJECTS/purple-haze-smoke-shop/
├── app/              # Next.js App Router
├── components/       # React components
├── lib/             # Constants and utilities
├── public/          # Static assets
├── Dockerfile       # Production Docker build
├── docker-compose.yml
└── README.md        # Full documentation
```

## Brand Guidelines
**Colors:**
- Dark Background: #0f172a
- Emerald Accent: #10b981
- Purple Accent: #a855f7
- Light Text: #f1f5f9

**Typography:**
- Primary: Inter (via Next.js font optimization)
- Headings: Bold, tracking-tight
- Body: 16px base size

## Component Architecture

1. **Header** - Sticky nav with mobile hamburger menu
2. **Hero** - 3D rotating cube (Three.js) + headline + CTAs
3. **WhatWeOffer** - 3-column product categories
4. **WhyChooseUs** - 4-item value prop grid
5. **HoursLocation** - Google Maps iframe + hours + contact
6. **SocialProof** - Testimonial cards with star ratings
7. **FAQ** - Accordion with Framer Motion animations
8. **Footer** - Contact info + social links

## Development Workflow

### Local Development
```bash
npm install
npm run dev  # http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker-compose up -d --build
```

## Content Management
All editable content is centralized in `lib/constants.ts`:
- Contact information
- Business hours
- Social media links
- Product categories
- Value propositions
- Testimonials
- FAQ items

## Key Technical Decisions

1. **React 18 instead of 19**: React Three Fiber requires React 18
2. **Next.js 15 App Router**: Modern Next.js patterns
3. **Standalone output**: Optimized for Docker deployment
4. **Dynamic import for 3D**: Avoid SSR issues with Three.js
5. **iframe for Maps**: No API key needed (can upgrade later)

## Pre-Launch Checklist
- [ ] Update all placeholder content in `lib/constants.ts`
- [ ] Replace logo (`public/logo.png`)
- [ ] Replace favicon (`app/favicon.ico`)
- [ ] Add real customer testimonials
- [ ] Get actual Google Maps embed URL
- [ ] Update social media links
- [ ] Test on mobile (375px, 768px, 1024px)
- [ ] Run Lighthouse audit (target: >90)
- [ ] Test Docker build

## Deployment Notes
- **Primary**: Docker on VPS with nginx reverse proxy
- **Alternative**: Vercel (automatic deployments)
- **Port**: 3000 (container), proxy via nginx on 80/443
- **SSL**: Use Let's Encrypt via reverse proxy

## Performance Optimizations
- Multi-stage Docker build (~150MB final image)
- Image optimization via Next.js
- Lazy loading for 3D scene
- Reduced motion support for accessibility
- Prefetch links for faster navigation

## Known Considerations
- Three.js adds ~600KB to bundle (lazy-loaded)
- Mobile 3D performance may vary on low-end devices
- Google Maps iframe requires address to be finalized

## Repository
GitHub: https://github.com/intcreative-hub/Purple-Haze

## Client Budget
$200 - Landing page only (no e-commerce, no backend)

## Timeline
Deploy-ready in 2 hours from scaffolding start.

---

**Last Updated**: October 23, 2025
**Status**: Ready for content update and deployment
