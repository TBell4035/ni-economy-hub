import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import TopBar from '@/components/TopBar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'NI Economy Hub — Northern Ireland Economic Intelligence',
  description: 'Independent economic intelligence for Northern Ireland: output, labour, trade, fiscal, productivity and AI, with every figure sourced. A Lough Signal product.',
  keywords: 'Northern Ireland economy, NI GDP, NI GVA, Windsor Framework, Northern Ireland trade, NI fiscal, Northern Ireland productivity',
  openGraph: {
    type: 'website',
    siteName: 'NI Economy Hub — a Lough Signal product',
    locale: 'en_GB',
    title: 'NI Economy Hub — Northern Ireland’s economy, with every figure sourced',
    description: 'Independent economic intelligence for Northern Ireland: output, labour, trade, fiscal, productivity and AI. A Lough Signal product.',
    images: [{ url: '/og-hub.png', width: 1200, height: 630, alt: 'NI Economy Hub — a Lough Signal product' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-hub.png'] },
}

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg0)' }}>
      <Navigation />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar />
        <main className="hub-main" style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 40px' }}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
