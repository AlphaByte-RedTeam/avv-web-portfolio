import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const { docs: posts } = await payload.find({
    collection: 'blog',
    limit: 1000,
  })

  const postsUrls = posts.map((post) => {
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.lastUpdated || post.date),
    }
  })

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/activity`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/microlink`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/prompts`,
      lastModified: new Date(),
    },
    ...postsUrls,
  ]
}
