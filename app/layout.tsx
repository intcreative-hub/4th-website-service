import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG, SEO } from "@/lib/config";
import ToastProvider from "@/components/ToastProvider";
import PromoBanner from "@/components/PromoBanner";
import ExitIntentPopup from "@/components/ExitIntentPopup";

// Typography System - Three-Tier Hierarchy
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["400", "600", "700", "800"],
});

// Note: Using Outfit as fallback for Roc Grotesk (similar geometric sans-serif)
// Roc Grotesk not available in next/font/google, so we'll use Outfit for headlines too
const rocGrotesk = outfit; // Using Outfit as Roc Grotesk alternative

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  authors: [{ name: SITE_CONFIG.name }],
  creator: "INT Creative",
  publisher: SITE_CONFIG.name,
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.website,
    siteName: SITE_CONFIG.name,
    title: SEO.title,
    description: SEO.description,
    images: [
      {
        url: SEO.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    images: [SEO.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${rocGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Google Fonts - Backup for any missing fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Structured Data for Professional Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: SITE_CONFIG.name,
              description: SITE_CONFIG.tagline,
              telephone: SITE_CONFIG.phone,
              email: SITE_CONFIG.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE_CONFIG.address,
                addressCountry: "US",
              },
              url: SITE_CONFIG.website,
              priceRange: "$$-$$$",
            }),
          }}
        />
      </head>
      <body className="font-sans">
        <ToastProvider />
        <PromoBanner />
        <ExitIntentPopup />
        {children}
      </body>
    </html>
  );
}
