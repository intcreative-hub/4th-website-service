import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.website;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
