import type { Metadata } from 'next'
import { IBM_Plex_Mono, Manrope } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'

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

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Andrew V. Personal Portfolio and Resume',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${ibmPlexMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="system"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
