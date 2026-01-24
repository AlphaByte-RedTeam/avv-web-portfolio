import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const headersList = await headers()
    
    // Create unique hash for visitor
    const ip = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    const hash = crypto.createHash('sha256').update(`${ip}-${userAgent}-${slug}`).digest('hex')

    // Check if view already exists
    const existing = await payload.find({
      collection: 'blog-views',
      where: {
        and: [
          { blogSlug: { equals: slug } },
          { hash: { equals: hash } }
        ]
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'blog-views',
        data: {
          blogSlug: slug,
          hash: hash,
        },
      })
    }

    const count = await payload.count({
      collection: 'blog-views',
      where: {
        blogSlug: { equals: slug }
      }
    })

    return NextResponse.json({ views: count.totalDocs })

  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}