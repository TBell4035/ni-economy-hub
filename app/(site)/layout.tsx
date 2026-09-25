import Link from 'next/link'
import './landing.css'
import TrackedLink from '@/components/TrackedLink'

// Lough Signal site shell: sticky top bar + footer. The Hub has its own
// sidebar layout under app/(hub); the two share only globals.css + fonts.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ls-site">
      <header className="top">
        <div className="wrap">
          <Link href="/" className="brand"><span className="dot" aria-hidden="true" />Lough Signal</Link>
          <nav className="nav" aria-label="Main">
            <a href="/#services">Services</a>
            <a href="/#work">How we work</a>
            <Link href="/hub">The Hub</Link>
            <a href="/#founder">About</a>
            <TrackedLink href="/#contact" cta="nav" className="cta">Start a conversation</TrackedLink>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="foot">
        <div className="wrap">
          <div>
            <div className="fbrand"><span className="dot" aria-hidden="true" />Lough Signal</div>
            <p style={{ marginTop: 10 }}>Evidence-led economics · Northern Ireland</p>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/hub">NI Economy Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
