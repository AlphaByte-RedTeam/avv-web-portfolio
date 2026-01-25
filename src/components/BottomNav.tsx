'use client'

import { Briefcase, FileText, Home, Image as ImageIcon, Link2, Menu, Terminal, Volume2, VolumeX, X } from 'lucide-react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { usePreferences } from '@/components/PreferencesProvider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export const BottomNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [shortcut, setShortcut] = useState('⌘K')
  const pathname = usePathname()
  const { soundEnabled, toggleSound } = usePreferences()

  useEffect(() => {
    const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
    setShortcut(isMac ? '⌘K' : 'Ctrl+K')
  }, [])

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/blog', label: 'Blog', icon: FileText },
    { href: '/activity', label: 'Activity', icon: ImageIcon },
    { href: '/microlink', label: 'Microlinks', icon: Link2 },
    { href: '/prompts', label: 'Prompts', icon: Terminal },
    { href: '/resume', label: 'Resume', icon: Briefcase, external: true },
  ]

  const menuVariants: Variants = {
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
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none print:hidden">
        <div className="relative pointer-events-auto group">
          {/* Expanded Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className="absolute bottom-full mb-3 w-[calc(100vw-2rem)] sm:w-72 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-2 space-y-1">
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
                        'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200',
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
                <Separator className="my-1 bg-zinc-200/50 dark:bg-zinc-800/50" />
                <div className="px-4 py-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                    <ThemeToggle />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Sound Effects</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full" 
                      onClick={toggleSound}
                    >
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Pill Bar */}
        <motion.div
          layout
          className="bg-zinc-900/80 dark:bg-zinc-100/80 backdrop-blur-2xl text-zinc-50 dark:text-zinc-900 border border-white/10 dark:border-white/20 rounded-full px-5 pl-6 py-1 flex items-center justify-between gap-8 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.3)] min-w-45"
        >
          <Link
            href="/"
            className="font-mono font-medium tracking-[0.2em] text-lg hover:opacity-70 transition-opacity"
            onClick={() => setIsOpen(false)}
          >
            {process.env.NEXT_PUBLIC_SITE_NAME || 'AVV'}
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 dark:bg-black/10 border border-white/10 dark:border-black/5 text-[10px] font-medium tracking-widest opacity-50">
            {shortcut}
          </div>

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
    </>
  )
}
