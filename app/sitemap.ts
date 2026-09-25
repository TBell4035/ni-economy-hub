import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/siteUrl'

// Lough Signal first, Hub pages as supporting evidence. Module URLs unchanged.
const hubModules = ['output', 'labour', 'trade', 'fiscal', 'productivity', 'ai', 'business', 'housing', 'entrepreneurship', 'scenarios', 'intelligence', 'sources']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/hub`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...hubModules.map(m => ({ url: `${siteUrl}/${m}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
