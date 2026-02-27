import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://lms-platform.com' // Replace with your actual domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/'], // Disallow crawling of admin and dashboard areas
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
