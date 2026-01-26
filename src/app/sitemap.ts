import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://metis-tech.it'
  const now = new Date()

  // Only include crawlable URLs. Hash fragments (e.g., #services) are invalid in sitemaps.
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          it: siteUrl,
          en: siteUrl,
        },
      },
    },
  ]
}
