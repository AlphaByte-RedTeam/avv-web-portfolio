'use client'

import { BookOpen, Code2, Zap } from 'lucide-react'
import * as motion from 'motion/react-client'

interface NowWidgetProps {
  status?: string
  project?: string
  learning?: string
}

export const NowWidget = ({ status, project, learning }: NowWidgetProps) => {
  if (!status && !project && !learning) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mb-16 print:hidden"
    >
      <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-5 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
        
        {/* Pulsing "Live" Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
            Now
          </span>
        </div>

        <div className="grid gap-6">
          {/* Status Column */}
          {status && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Mood</span>
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {status}
              </p>
            </div>
          )}

          {/* Project Column */}
          {project && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Code2 className="h-3.5 w-3.5 text-blue-500" />
                <span>Building</span>
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {project}
              </p>
            </div>
          )}

          {/* Learning/Reading Column */}
          {learning && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <BookOpen className="h-3.5 w-3.5 text-rose-500" />
                <span>Learning</span>
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {learning}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
