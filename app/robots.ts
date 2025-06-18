import { baseUrl } from 'app/sitemap'

export default function robots() {
  return {
            rules: [
          {
            userAgent: '*',
            allow: ['/', '/api/og/'],
            disallow: ['/api/', '/private/'],
          },
          {
            userAgent: 'GPTBot',
            disallow: '/',
          },
        ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
