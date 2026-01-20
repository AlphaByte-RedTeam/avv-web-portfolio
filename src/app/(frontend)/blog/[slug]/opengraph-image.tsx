import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const runtime = 'nodejs'

export const alt = 'Blog Post'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch Blog Post
  const { docs: blogDocs } = await payload.find({
    collection: 'blog',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const post = blogDocs[0]

  // Fetch Author Profile for the name (optional, but good for branding)
  const { docs: profileDocs } = await payload.find({
    collection: 'profile',
    limit: 1,
  })
  const profile = profileDocs[0]
  const authorName = profile?.name || 'Portfolio'

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            color: '#fafafa',
            fontSize: '48px',
            fontWeight: 600,
          }}
        >
          Post Not Found
        </div>
      ),
      { ...size }
    )
  }

  const date = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09090b', // zinc-950
          color: '#fafafa', // zinc-50
          fontFamily: 'sans-serif',
          padding: '80px',
        }}
      >
        {/* Top: Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {post.category && (
            <div
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#09090b',
                backgroundColor: '#fafafa',
                padding: '8px 24px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {post.category}
            </div>
          )}
          <div
            style={{
              fontSize: '24px',
              color: '#a1a1aa', // zinc-400
            }}
          >
            {date}
          </div>
        </div>

        {/* Middle: Title */}
        <div
          style={{
            fontSize: '80px',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          {post.title}
        </div>

        {/* Bottom: Author/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #27272a', // zinc-800
            paddingTop: '32px',
            marginTop: '32px',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#e4e4e7', // zinc-200
            }}
          >
            {authorName}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#52525b', // zinc-600
            }}
          >
            Blog
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
