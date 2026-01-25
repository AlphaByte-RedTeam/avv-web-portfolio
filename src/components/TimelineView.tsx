'use client'

import React from 'react'
import { motion } from 'motion/react'
import { Briefcase, Folder, GraduationCap, Trophy, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export type TimelineItem = {
  id: string
  type: 'work' | 'education' | 'project' | 'accomplishment'
  title: string
  subtitle?: string
  date: string // ISO string or 'Present'
  endDate?: string
  description?: any
  link?: string
  tags?: string[]
}

const getItemIcon = (type: TimelineItem['type']) => {
  switch (type) {
    case 'work': return Briefcase
    case 'education': return GraduationCap
    case 'project': return Folder
    case 'accomplishment': return Trophy
    default: return Calendar
  }
}

const getItemColor = (type: TimelineItem['type']) => {
  switch (type) {
    case 'work': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    case 'education': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    case 'project': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    case 'accomplishment': return 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Present'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export const TimelineView = ({ items }: { items: TimelineItem[] }) => {
  return (
    <div className="relative max-w-3xl mx-auto py-10 px-4">
      {/* Central Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border/60 -translate-x-1/2" />

      <div className="space-y-12">
        {items.map((item, index) => {
          const Icon = getItemIcon(item.type)
          const isEven = index % 2 === 0

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative flex flex-col md:flex-row gap-8 md:gap-0",
                isEven ? "md:flex-row-reverse" : ""
              )}
            >
              {/* Date Marker (Opposite side on Desktop) */}
              <div className={cn(
                "hidden md:flex w-1/2 items-center",
                isEven ? "justify-start pl-12" : "justify-end pr-12"
              )}>
                <Badge variant="outline" className="font-mono text-xs py-1">
                  {item.endDate ? `${formatDate(item.date)} — ${formatDate(item.endDate)}` : formatDate(item.date)}
                </Badge>
              </div>

              {/* Center Node */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border z-10 shadow-sm">
                 <div className={cn("w-6 h-6 flex items-center justify-center rounded-full", getItemColor(item.type))}>
                    <Icon className="w-3.5 h-3.5" />
                 </div>
              </div>

              {/* Content Card */}
              <div className={cn(
                "ml-16 md:ml-0 w-full md:w-1/2",
                isEven ? "md:pr-12" : "md:pl-12"
              )}>
                <div className="relative bg-secondary/20 hover:bg-secondary/30 transition-colors p-5 rounded-xl border border-border/50">
                  {/* Mobile Date */}
                  <div className="md:hidden mb-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {item.endDate ? `${formatDate(item.date)} — ${formatDate(item.endDate)}` : formatDate(item.date)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground leading-tight">
                    {item.title}
                  </h3>
                  
                  {item.subtitle && (
                    <div className="text-sm text-primary font-medium mt-1">
                      {item.subtitle}
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-4 right-4 opacity-50">
                     <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  {item.tags && item.tags.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-3">
                        {item.tags.map(tag => (
                           <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-sm bg-background/50 text-muted-foreground border border-border/50">
                              {tag}
                           </span>
                        ))}
                     </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
