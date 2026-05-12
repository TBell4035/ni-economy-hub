import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import TopBar from '@/components/TopBar'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'NI Economy Hub — Northern Ireland Economic Intelligence',
  description: 'A multi-dimensional analytical framework integrating output, labour, trade, fiscal, productivity and AI data for the Northern Ireland economy. Academic quality, publicly accessible.',
  keywords: 'Northern Ireland economy, NI GDP, NI GVA, Windsor Framework, Northern Ireland trade, NI fiscal, Northern Ireland productivity',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg0)' }}>
          <Navigation />
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <TopBar />
            <main
              style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 40px' }}
              className="page-enter"
            >
              {children}
            </main>
            <Footer />
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  )
}