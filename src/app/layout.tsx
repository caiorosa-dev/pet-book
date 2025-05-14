import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { FullScreenPage } from '@/components/layout/full-screen-page'
import { LaunchScreen } from '@/components/misc/launch-screen'

const interFont = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'PetBook',
  description: 'A rede social para donos de pets e ONGs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.variable} antialiased`}>
        <LaunchScreen />
        {children}
      </body>
    </html>
  )
}
