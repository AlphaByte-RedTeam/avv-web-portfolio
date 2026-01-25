import type { Metadata } from 'next'
import { IBM_Plex_Mono, Manrope } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from 'next-themes'
import { BottomNav } from '@/components/BottomNav'
import { Toaster } from '@/components/ui/sonner'
import { ReadingProgress } from '@/components/ReadingProgress'
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  display: 'swap',
})

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://avv-portfolio.vercel.app'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AVV'
const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'AVV | Portfolio'
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Andrew V. Personal Portfolio and Resume'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: './',
    siteName: `${siteName} Portfolio`,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER_ID as string} />
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID as string} />
      <body
        className={`${manrope.variable} ${ibmPlexMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="system"
        >
          <ReadingProgress />
          {children}
          <BottomNav />
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
