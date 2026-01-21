import { getPayload } from 'payload'
import React from 'react'
import { ActivityGrid } from '@/components/ActivityGrid'
import config from '@/payload.config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Activity Gallery',
  description: 'A visual feed of my latest updates, travels, and moments.',
}

export default async function ActivityPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: activities } = await payload.find({
    collection: 'activity',
    sort: '-date',
    limit: 100, // Reasonable limit for a gallery
  })

  // Transform data to match ActivityGrid props
  const formattedActivities = activities.map((item: any) => ({
    id: item.id,
    image: {
      url: item.image.url,
      alt: item.image.alt,
      width: item.image.width,
      height: item.image.height,
    },
    caption: item.caption,
    location: item.location,
    date: item.date,
  }))

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 md:px-12 pb-32">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>

        <header className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight">Activity</h1>
          <p className="text-muted-foreground text-lg">
            Snapshots of life, code, and everything in between.
          </p>
        </header>

        {formattedActivities.length > 0 ? (
          <ActivityGrid activities={formattedActivities} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-70">
            <p className="text-xl text-muted-foreground font-light">
              Sorry, there's nothing here.
            </p>
            <p className="text-sm text-muted-foreground/60">
              The author may be busy or there's something wrong.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
