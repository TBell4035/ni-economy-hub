'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { formsOpen } from '@/lib/launch'
import { trackEvent, readAttribution } from '@/lib/track'

type State = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)
  const onStart = () => { if (!started.current) { started.current = true; trackEvent('form_started', { form: 'enquiry' }) } }

  // Launch gate: see lib/launch.ts. Nothing is collected until it opens.
  if (!formsOpen) {
    return (
      <div className="form-closed" role="status">
        <h3>Enquiries open shortly.</h3>
        <p>
          Lough Signal is completing its company and data-protection registration. The enquiry
          form will open here as soon as that is done.
        </p>
        <p>In the meantime, the <Link href="/hub">NI Economy Hub</Link> shows the standard of evidence you can expect.</p>
      </div>
    )
  }

  if (state === 'sent') {
    return (
      <div className="form-closed" role="status">
        <h3>Thank you — that&apos;s with us.</h3>
        <p>Thomas will read it personally and reply with an honest view on whether Lough Signal can help.</p>
      </div>
    )
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending'); setError(null)
    const d = new FormData(e.currentTarget)
    const attr = readAttribution()
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: d.get('name'), organisation: d.get('organisation'), email: d.get('email'),
          problem: d.get('problem'), sector: d.get('sector') || null, timing: d.get('timing') || null,
          service: d.get('service') || null, location: d.get('location') || null, budget: d.get('budget') || null,
          from: attr.from, referrer: attr.referrer,
          company_website: d.get('company_website') || null, // honeypot
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) { setError(json.error ?? 'Something went wrong. Please try again.'); setState('error'); return }
      trackEvent('form_completed', { form: 'enquiry', from: attr.from ?? 'direct' })
      setState('sent')
    } catch {
      setError('Could not send just now. Please try again.'); setState('error')
    }
  }

  return (
    <form onSubmit={onSubmit} onFocus={onStart}>
      <div className="form-field"><label htmlFor="name">Name <span className="req">*</span></label><input id="name" name="name" type="text" required autoComplete="name" /></div>
      <div className="form-field"><label htmlFor="organisation">Organisation <span className="req">*</span></label><input id="organisation" name="organisation" type="text" required autoComplete="organization" /></div>
      <div className="form-field"><label htmlFor="email">Email <span className="req">*</span></label><input id="email" name="email" type="email" required autoComplete="email" /></div>
      <div className="form-field"><label htmlFor="problem">What decision or problem are you working on? <span className="req">*</span></label><textarea id="problem" name="problem" required /></div>
      <div className="form-field"><label htmlFor="sector">Your sector</label>
        <select id="sector" name="sector" defaultValue="">
          <option value="">Select…</option>
          <option>Agri-food</option><option>Manufacturing</option><option>Construction</option>
          <option>Professional services</option><option>Technology / digital</option>
          <option>Public sector</option><option>Third sector</option><option>Other</option>
        </select></div>
      <div className="form-field"><label htmlFor="timing">Rough timing <span className="req">*</span></label>
        <select id="timing" name="timing" defaultValue="" required>
          <option value="">Select…</option><option>Exploring / no fixed date</option>
          <option>Within a month</option><option>This quarter</option><option>Longer term</option>
        </select></div>
      <div className="form-field"><label htmlFor="service">Service you&apos;re interested in</label>
        <select id="service" name="service" defaultValue="">
          <option value="">Not sure yet</option>
          <option value="economic_evidence_brief">Economic Evidence Brief</option>
          <option value="market_opportunity_snapshot">Market Opportunity Snapshot</option>
          <option value="data_process_systems_review">Data, Process &amp; Systems Review</option>
          <option value="grants">A funding bid</option>
        </select></div>
      <div className="form-field"><label htmlFor="location">Where you&apos;re based</label><input id="location" name="location" type="text" autoComplete="address-level2" placeholder="e.g. Belfast, Newry, Dublin" /></div>
      <div className="form-field"><label htmlFor="budget">Indicative budget</label>
        <select id="budget" name="budget" defaultValue="">
          <option value="">Prefer to discuss</option>
          <option>Under £1,000</option><option>£1,000–£2,500</option><option>£2,500–£5,000</option><option>Over £5,000</option>
        </select></div>
      <input className="hp" type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" className="btn btn-primary" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send'}</button>
      <p className={`form-note${error ? ' error' : ''}`} role={error ? 'alert' : undefined}>
        {error ?? <>We use your details only to reply to this enquiry — see our <Link href="/privacy">privacy notice</Link>. You won&apos;t be added to any mailing list.</>}
      </p>
    </form>
  )
}
