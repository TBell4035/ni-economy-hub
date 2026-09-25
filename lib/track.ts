'use client'
import { track } from '@vercel/analytics'

// Thin wrapper over Vercel Web Analytics custom events (cookieless).
// Custom events may need a paid Vercel plan to appear in the dashboard; the
// commercial metric that matters (enquiries by source) is recorded in our own
// database by /api/contact regardless, so nothing depends on this.
export function trackEvent(name: string, props?: Record<string, string>) {
  try { track(name, props) } catch { /* analytics must never break the page */ }
}

// Attribution without device storage (PECR): read the ?from= tag carried on
// internal CTA links, plus the referrer, at the moment it's needed.
export function readAttribution(): { from: string | null; referrer: string | null; path: string } {
  if (typeof window === 'undefined') return { from: null, referrer: null, path: '/' }
  const from = new URLSearchParams(window.location.search).get('from')
  let referrer: string | null = null
  try {
    if (document.referrer) {
      const u = new URL(document.referrer)
      referrer = u.host === window.location.host ? `internal:${u.pathname}` : u.host
    }
  } catch { /* ignore malformed referrer */ }
  return { from: from ? from.slice(0, 60) : null, referrer, path: window.location.pathname }
}
