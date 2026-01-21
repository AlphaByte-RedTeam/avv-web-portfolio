'use client'

import { IconBrandGithub } from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import * as motion from 'motion/react-client'

const ActivityCalendar = dynamic<ActivityCalendarProps>(
  () =>
    import('react-activity-calendar').then(
      (mod: any) => mod.ActivityCalendar || mod.default || mod,
    ),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
)

interface ActivityCalendarProps {
  data: Array<{
    date: string
    count: number
    level: number
  }>
  colorScheme?: 'light' | 'dark'
  blockSize?: number
  blockMargin?: number
  fontSize?: number
  theme?: {
    light: string[]
    dark: string[]
  }
  labels?: {
    totalCount?: string
    legend?: {
      less: string
      more: string
    }
  }
  showWeekdayLabels?: boolean
}

interface GithubCalendarProps {
  username?: string
}

export const GithubCalendar = ({ username }: GithubCalendarProps) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    if (!username) {
      setLoading(false)
      return
    }

    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((response) => response.json())
      .then((json) => {
        setData(json.contributions)
        setLoading(false)
      })
      .catch((e) => {
        console.error('Failed to fetch github contributions', e)
        setLoading(false)
      })
  }, [username])

  if (loading) return null
  if (!data || data.length === 0) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="space-y-6 mb-16 print:hidden"
    >
      <div className="flex items-center gap-3 text-primary">
        <IconBrandGithub className="h-4 w-4" />
        <h2 className="text-lg tracking-widest uppercase text-muted-foreground">
          Github Activity
        </h2>
      </div>
      
      <div className="border border-border/50 bg-secondary/10 p-4 rounded-xl overflow-x-auto flex justify-center">
        <ActivityCalendar
          data={data}
          colorScheme={theme === 'dark' ? 'dark' : 'light'}
          blockSize={10}
          blockMargin={4}
          fontSize={12}
          theme={{
            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
          }}
          labels={{
            totalCount: '{{count}} contributions in the last year',
          }}
          showWeekdayLabels
        />
      </div>
    </motion.div>
  )
}
