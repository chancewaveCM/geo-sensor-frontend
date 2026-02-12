import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/settings/', '/analysis/'],
      },
    ],
    sitemap: 'https://geosensor.ai/sitemap.xml',
  }
}
