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
    const hash = crypto.createHash('sha256').update(`${ip}-${userAgent}-${slug}-like`).digest('hex')

    // Check if like already exists
    const existing = await payload.find({
      collection: 'blog-likes',
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
        collection: 'blog-likes',
        data: {
          blogSlug: slug,
          hash: hash,
        },
      })
    }

    const count = await payload.count({
      collection: 'blog-likes',
      where: {
        blogSlug: { equals: slug }
      }
    })

    return NextResponse.json({ likes: count.totalDocs, hasLiked: true })

  } catch (error) {
    console.error('Error tracking like:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
    try {
        const { slug } = await req.json()
        
        if (!slug) {
          return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
        }
    
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })
        const headersList = await headers()
        
        const ip = headersList.get('x-forwarded-for') || 'unknown'
        const userAgent = headersList.get('user-agent') || 'unknown'
        const hash = crypto.createHash('sha256').update(`${ip}-${userAgent}-${slug}-like`).digest('hex')
    
        // Check if like exists
        const existing = await payload.find({
          collection: 'blog-likes',
          where: {
            and: [
              { blogSlug: { equals: slug } },
              { hash: { equals: hash } }
            ]
          },
          limit: 1,
        })
    
        if (existing.docs.length > 0) {
          await payload.delete({
            collection: 'blog-likes',
            id: existing.docs[0].id,
          })
        }
    
        const count = await payload.count({
          collection: 'blog-likes',
          where: {
            blogSlug: { equals: slug }
          }
        })
    
        return NextResponse.json({ likes: count.totalDocs, hasLiked: false })
    
      } catch (error) {
        console.error('Error removing like:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
      }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const slug = searchParams.get('slug')
    
        if (!slug) {
          return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
        }
    
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })
        const headersList = await headers()
        
        const ip = headersList.get('x-forwarded-for') || 'unknown'
        const userAgent = headersList.get('user-agent') || 'unknown'
        const hash = crypto.createHash('sha256').update(`${ip}-${userAgent}-${slug}-like`).digest('hex')

        const [count, userLike] = await Promise.all([
             payload.count({
                collection: 'blog-likes',
                where: {
                  blogSlug: { equals: slug }
                }
              }),
              payload.find({
                collection: 'blog-likes',
                where: {
                    and: [
                        { blogSlug: { equals: slug } },
                        { hash: { equals: hash } }
                    ]
                },
                limit: 1
              })
        ])
    
        return NextResponse.json({ likes: count.totalDocs, hasLiked: userLike.docs.length > 0 })
    
      } catch (error) {
        console.error('Error getting likes:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
      }
}