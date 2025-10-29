// Service Business Template - Customizable Content
// Update this file to customize your business information

// ==================== BRANDING CONFIGURATION ====================
export const BRANDING = {
  // Primary brand color (used for buttons, links, accents)
  primaryColor: {
    hex: "#10b981", // emerald-500
    tailwind: "emerald",
  },
  // Secondary brand color
  secondaryColor: {
    hex: "#a855f7", // purple-500
    tailwind: "purple",
  },
  // Company logo (replace with your own)
  logo: "/logo-placeholder.svg",
};

// ==================== SITE CONFIGURATION ====================
export const SITE_CONFIG = {
  name: "Your Business Name",
  tagline: "Professional services that deliver results",
  phone: "(555) 123-4567",
  email: "hello@yourbusiness.com",
  address: "123 Main Street, Your City, ST 12345",
  // Update with your Google Maps embed URL
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316d7e0e4b%3A0x6b7a0c0e0e0e0e0e!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890",
  googleMapsLink: "https://www.google.com/maps",
  website: "https://yourbusiness.com",
};

// ==================== BUSINESS HOURS ====================
export const BUSINESS_HOURS = {
  weekday: "Monday - Friday, 9:00 AM - 6:00 PM",
  weekend: "Saturday, 10:00 AM - 4:00 PM",
  closed: "Sunday - Closed",
};

// ==================== SOCIAL MEDIA LINKS ====================
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/yourbusiness",
  facebook: "https://facebook.com/yourbusiness",
  linkedin: "https://linkedin.com/company/yourbusiness",
  twitter: "https://twitter.com/yourbusiness",
  website: "https://yourbusiness.com",
};

// ==================== SERVICES ====================
// Update these with your actual services
export const SERVICES = [
  {
    id: "consulting",
    title: "Business Consulting",
    description: "Strategic guidance to help your business grow and overcome challenges with proven methodologies.",
    icon: "Briefcase",
    features: ["Strategic Planning", "Process Optimization", "Growth Strategy", "Market Analysis"],
    gradient: "from-purple-600 via-purple-500 to-emerald-500",
  },
  {
    id: "strategy",
    title: "Digital Strategy",
    description: "Comprehensive digital transformation planning to modernize your operations and reach new markets.",
    icon: "TrendingUp",
    features: ["Digital Roadmap", "Tech Integration", "Analytics Setup", "ROI Tracking"],
    gradient: "from-emerald-500 via-teal-500 to-cyan-400",
  },
  {
    id: "design",
    title: "Creative Design",
    description: "Beautiful, functional design that captures your brand and engages your audience effectively.",
    icon: "Palette",
    features: ["Brand Design", "UI/UX Design", "Marketing Materials", "Visual Identity"],
    gradient: "from-cyan-500 via-blue-500 to-indigo-400",
  },
  {
    id: "development",
    title: "Web Development",
    description: "Modern, fast, and responsive websites built with the latest technologies and best practices.",
    icon: "Code",
    features: ["Custom Websites", "E-commerce", "Web Apps", "Maintenance"],
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
  },
];

// ==================== VALUE PROPOSITIONS ====================
export const VALUE_PROPS = [
  {
    id: "experience",
    title: "Proven Expertise",
    description: "Years of experience delivering results for businesses like yours",
    icon: "Award",
  },
  {
    id: "quality",
    title: "Quality First",
    description: "We never compromise on quality, ensuring exceptional outcomes every time",
    icon: "ShieldCheck",
  },
  {
    id: "support",
    title: "Dedicated Support",
    description: "Responsive support and clear communication throughout your project",
    icon: "HeadphonesIcon",
  },
  {
    id: "results",
    title: "Results-Driven",
    description: "Focused on delivering measurable outcomes that matter to your business",
    icon: "Target",
  },
];

// ==================== TESTIMONIALS ====================
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "Tech Startup Inc.",
    role: "CEO",
    rating: 5,
    text: "Working with this team transformed our business. Their expertise and dedication to our success made all the difference.",
    date: "Dec 2024",
    service: "Business Consulting",
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Local Retail Co.",
    role: "Owner",
    rating: 5,
    text: "Professional, responsive, and incredibly talented. They delivered exactly what we needed, on time and on budget.",
    date: "Nov 2024",
    service: "Digital Strategy",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "Creative Agency",
    role: "Marketing Director",
    rating: 5,
    text: "The quality of work exceeded our expectations. Highly recommend for anyone looking for top-tier service.",
    date: "Oct 2024",
    service: "Creative Design",
  },
  {
    id: 4,
    name: "David Kim",
    company: "E-commerce Brand",
    role: "Founder",
    rating: 5,
    text: "From start to finish, the process was smooth and the results speak for themselves. Great team to work with.",
    date: "Oct 2024",
    service: "Web Development",
  },
];

// ==================== FAQ ====================
export const FAQ_ITEMS = [
  {
    id: "services",
    question: "What services do you offer?",
    answer: "We offer a comprehensive range of business services including consulting, digital strategy, creative design, and web development. Each service is tailored to meet your specific business needs and goals.",
  },
  {
    id: "process",
    question: "What is your process for new projects?",
    answer: "We start with a discovery call to understand your needs, then provide a detailed proposal. Once approved, we kick off with a planning phase, followed by execution and regular check-ins. We ensure clear communication throughout the entire process.",
  },
  {
    id: "timeline",
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on scope and complexity. A typical consulting engagement might be 4-8 weeks, while a web development project could be 6-12 weeks. We'll provide a detailed timeline in your proposal.",
  },
  {
    id: "pricing",
    question: "How do you structure pricing?",
    answer: `We offer flexible pricing models including project-based, hourly, and retainer options. Contact us at ${SITE_CONFIG.email} or ${SITE_CONFIG.phone} for a custom quote based on your specific needs.`,
  },
  {
    id: "contact",
    question: "How can I get started?",
    answer: `Simply reach out via our contact form, email us at ${SITE_CONFIG.email}, or call ${SITE_CONFIG.phone}. We'll schedule a free consultation to discuss your project and how we can help.`,
  },
];

// ==================== NAVIGATION ====================
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ==================== SEO METADATA ====================
export const SEO = {
  title: "Your Business Name - Professional Services",
  description: "Professional services that deliver results. Expert consulting, strategy, design, and development for businesses ready to grow.",
  keywords: ["business consulting", "digital strategy", "web design", "web development", "professional services"],
  ogImage: "/og-image.jpg", // Add your Open Graph image
};
