import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GEO Sensor - AI Citation Analytics',
  description: 'Analyze brand citations in AI responses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <a href="#app-content" className="skip-link">
          본문으로 건너뛰기
        </a>
        <Providers>
          <div id="app-content" tabIndex={-1}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
