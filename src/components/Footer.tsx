'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AVV'
  const pathname = usePathname()

  return (
    <footer className="mt-32 pb-32 md:pb-12 print:hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="pt-8 border-t border-border/40 text-center space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground/60 tracking-wide">
              © {currentYear} {siteName} • Built with love.
            </p>
            <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground/60">
              <Link href="/blog" className="transition-colors hover:text-primary">
                Blog
              </Link>
              <Link href="/activity" className="transition-colors hover:text-primary">
                Activity
              </Link>
              <Link href="/microlink" className="transition-colors hover:text-primary">
                Microlinks
              </Link>
              <Link href="/prompts" className="transition-colors hover:text-primary">
                Prompts
              </Link>
              <Link href="/resume" className="transition-colors hover:text-primary">
                Resume
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
