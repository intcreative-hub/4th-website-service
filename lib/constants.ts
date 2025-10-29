// Purple Haze Smoke Shop - Real Business Data
// Updated: October 23, 2025

export const SITE_CONFIG = {
  name: "Purple Haze Smoke Shop",
  tagline: "Premium tobacco, vapes, CBD & accessories in Brunswick, Ohio",
  phone: "(330) 741-3163",
  email: "phss201975@yahoo.com",
  address: "1315 Pearl Rd, Brunswick, OH 44212",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3071.8652693943826!2d-81.75012!3d41.16246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8838ba1f5e5e5e5d%3A0x8838ba1f5e5e5e5d!2s1315%20Pearl%20Rd%2C%20Brunswick%2C%20OH%2044212!5e0!3m2!1sen!2sus!4v1234567890",
  googleMapsLink: "https://www.google.com/maps/place/1315+Pearl+Rd,+Brunswick,+OH+44212",
  website: "https://purplehazess.com",
};

export const BUSINESS_HOURS = {
  weekday: "Monday - Saturday, 11:00 AM - 9:00 PM",
  weekend: "Sunday, 12:00 PM - 8:00 PM",
};

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/purplehazesmokeshop",
  facebook: "https://www.facebook.com/p/Purple-Haze-Smoke-Shop-Brunswick-100063773754190/",
  website: "https://purplehazess.com",
};

export const PRODUCT_CATEGORIES = [
  {
    id: "vapes",
    title: "Premium Vapes",
    brands: ["ELFBAR", "Geek Bar", "Fifty Bar", "SMOK", "Vaporesso"],
    description: "Latest disposable vapes, pods, and mods. Top brands, authentic products only.",
    icon: "Zap",
    priceMin: 15,
    priceMax: 45,
    gradient: "from-purple-600 via-primary-purple to-primary-emerald",
  },
  {
    id: "glass",
    title: "Glass & Accessories",
    brands: ["Hand-Blown Glass", "Premium Pipes", "Cleaning Supplies", "Storage Solutions"],
    description: "High-quality glass pipes, water bongs, and smoking accessories for every preference.",
    icon: "Waves",
    priceMin: 20,
    priceMax: 150,
    gradient: "from-primary-emerald via-teal-500 to-emerald-400",
  },
  {
    id: "cbd",
    title: "CBD Products",
    brands: ["Hemp Flower", "CBD Oils", "Gummies", "Edibles"],
    description: "Legal hemp-derived CBD products. Lab-tested, THC-compliant, and high-quality.",
    icon: "Leaf",
    priceMin: 10,
    priceMax: 80,
    gradient: "from-emerald-500 via-green-500 to-lime-400",
  },
  {
    id: "tobacco",
    title: "Tobacco & Papers",
    brands: ["Premium Brands", "Rolling Papers", "Hand-Rolled", "Incense"],
    description: "Hand-rolled tobacco, premium brands, rolling papers, incense, and more.",
    icon: "Flame",
    priceMin: 5,
    priceMax: 50,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
  },
];

export const VALUE_PROPS = [
  {
    id: "local",
    title: "Local Expertise",
    description: "Brunswick's trusted smoke shop since 2020",
    icon: "MapPin",
  },
  {
    id: "authentic",
    title: "Authentic Products",
    description: "100% genuine products from authorized distributors",
    icon: "ShieldCheck",
  },
  {
    id: "prices",
    title: "Best Prices",
    description: "Competitive pricing with regular deals and promotions",
    icon: "DollarSign",
  },
  {
    id: "selection",
    title: "Wide Selection",
    description: "Extensive inventory of products for all preferences",
    icon: "Grid3x3",
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Jordan K.",
    rating: 5,
    text: "Came in looking for premium vape, left with exactly what I needed. Staff really knows their stuff.",
    date: "Oct 2024",
    product: "ELFBAR Premium Vape",
    photo: "/images/customer-1.jpg", // Placeholder - will add in Phase 3
  },
  {
    id: 2,
    name: "Mike R.",
    rating: 5,
    text: "Best smoke shop in Brunswick. Great selection, fair prices, and the service is always helpful.",
    date: "Oct 2024",
    product: "Premium Glass Pipe",
    photo: "/images/customer-2.jpg", // Placeholder - will add in Phase 3
  },
  {
    id: 3,
    name: "Sarah M.",
    rating: 5,
    text: "Amazing collection of glass and such cool miscellaneous items. Great vibe, highly recommend!",
    date: "Sep 2024",
    product: "Hand-Blown Glass Set",
    photo: "/images/customer-3.jpg", // Placeholder - will add in Phase 3
  },
  {
    id: 4,
    name: "Chris L.",
    rating: 4,
    text: "Solid selection. Friendly staff who actually listen to what you're looking for.",
    date: "Sep 2024",
    product: "CBD Products",
    photo: "/images/customer-4.jpg", // Placeholder - will add in Phase 3
  },
];

export const FAQ_ITEMS = [
  {
    id: "age",
    question: "What is your age verification policy?",
    answer: "You must be 18 years or older to purchase tobacco products in Ohio. We require valid government-issued ID for all purchases. No exceptions.",
  },
  {
    id: "returns",
    question: "What is your return and exchange policy?",
    answer: "Unopened products may be returned within 7 days with receipt. Due to health regulations, opened tobacco and vape products cannot be returned. Defective devices are covered under manufacturer warranty.",
  },
  {
    id: "inventory",
    question: "Do you carry all major brands?",
    answer: "Yes! We stock products from all leading manufacturers including RAW, Storz & Bickel, SMOK, Vaporesso, and many more. If we don't have what you're looking for, we can special order it.",
  },
  {
    id: "hours",
    question: "What are your hours and location?",
    answer: `We're located at ${SITE_CONFIG.address}. Open ${BUSINESS_HOURS.weekday} and ${BUSINESS_HOURS.weekend}. Call us at ${SITE_CONFIG.phone} for any questions!`,
  },
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Hours", href: "#hours" },
  { label: "Contact", href: "#contact" },
];
