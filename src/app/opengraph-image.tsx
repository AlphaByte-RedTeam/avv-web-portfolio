import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const runtime = 'nodejs'

export const alt = 'Portfolio'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'profile',
    limit: 1,
  })

  const profile = docs[0]
  const name = profile?.name || 'Portfolio'
  const title = profile?.title || 'Software Engineer'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b', // zinc-950
          color: '#fafafa', // zinc-50
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          {/* Initials Circle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: '#27272a', // zinc-800
              fontSize: '48px',
              fontWeight: 600,
              color: '#fafafa',
              marginBottom: '20px',
              border: '2px solid #3f3f46', // zinc-700
            }}
          >
            {name.charAt(0)}
          </div>

          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              textAlign: 'center',
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#a1a1aa', // zinc-400
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
