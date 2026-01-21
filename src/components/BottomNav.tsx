'use client'

import { Briefcase, FileText, Home, Image as ImageIcon, Menu, X } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export const BottomNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/blog', label: 'Blog', icon: FileText },
    { href: '/activity', label: 'Activity', icon: ImageIcon },
    { href: '/resume', label: 'Resume', icon: Briefcase, external: true },
  ]

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="relative pointer-events-auto group">
        {/* Expanded Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className="absolute bottom-full mb-6 w-[calc(100vw-2.5rem)] max-w-sm -left-1/2 translate-x-[calc(50%-1rem)] sm:translate-x-0 sm:left-auto sm:w-80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-3 space-y-1">
                {links.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200',
                        isActive
                          ? 'bg-zinc-900/5 dark:bg-white/10 text-zinc-900 dark:text-white font-semibold'
                          : 'hover:bg-zinc-900/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground font-medium',
                      )}
                    >
                      <Icon className={cn('h-5 w-5', isActive ? 'stroke-[2.5px]' : 'stroke-2')} />
                      {link.label}
                    </Link>
                  )
                })}
                <Separator className="my-2 bg-zinc-200/50 dark:bg-zinc-800/50" />
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Pill Bar */}
        <motion.div
          layout
          className="bg-zinc-900/80 dark:bg-zinc-100/80 backdrop-blur-2xl text-zinc-50 dark:text-zinc-900 border border-white/10 dark:border-white/20 rounded-full px-6 pl-8 py-4 flex items-center justify-between gap-16 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.3)] min-w-[220px]"
        >
          <Link
            href="/"
            className="font-mono font-medium tracking-[0.2em] text-lg hover:opacity-70 transition-opacity"
            onClick={() => setIsOpen(false)}
          >
            AVV
          </Link>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 -mr-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
            aria-label="Toggle Menu"
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
