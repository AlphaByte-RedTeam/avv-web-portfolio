'use client'

import { DialogTitle } from '@radix-ui/react-dialog'
import { CalendarDays, MapPin, X } from 'lucide-react'
import Image from 'next/image'
import type React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type ActivityItem = {
  id: string
  image: {
    url: string
    alt: string
    width: number
    height: number
  }
  caption?: string
  location?: string
  date: string
}

type Props = {
  activities: ActivityItem[]
}

export const ActivityGrid: React.FC<Props> = ({ activities }) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-8">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="group relative aspect-square cursor-pointer overflow-hidden bg-muted rounded-xl"
            onClick={() => setSelectedActivity(activity)}
          >
            <Image
              src={activity.image.url}
              alt={activity.image.alt || 'Activity photo'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110 rounded-xl"
              sizes="(max-width: 768px) 50vw, 33vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-medium text-sm line-clamp-3">
                  {activity.caption || 'View Details'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-none sm:max-h-[90vh] flex flex-col sm:flex-row">
          <DialogHeader className="sr-only">
            <DialogTitle>Activity Details</DialogTitle>
          </DialogHeader>

          {selectedActivity && (
            <>
              {/* Image Section */}
              <div className="relative w-full sm:w-1/2 md:w-3/5 bg-black flex items-center justify-center min-h-[300px] sm:min-h-0">
                <Image
                  src={selectedActivity.image.url}
                  alt={selectedActivity.image.alt || 'Activity photo'}
                  width={selectedActivity.image.width}
                  height={selectedActivity.image.height}
                  className="max-h-[80vh] w-auto h-auto max-w-full object-contain"
                />
              </div>

              {/* Details Section */}
              <div className="flex flex-col p-6 sm:w-1/2 md:w-2/5 max-h-[50vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  {/* Placeholder Avatar if we had user info, for now just a generic header */}
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">AV</span>
                  </div>
                  <span className="font-semibold text-sm">Andrew V.</span>
                </div>

                <div className="flex-1 space-y-4">
                  {selectedActivity.caption && (
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                      {selectedActivity.caption}
                    </p>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>
                      {new Date(selectedActivity.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {selectedActivity.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{selectedActivity.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
