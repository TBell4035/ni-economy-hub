import TrackedLink from '@/components/TrackedLink'
import { T } from '@/lib/tokens'

// A single, quiet commercial prompt at the foot of high-intent Hub modules.
// Connects the evidence to a Lough Signal service without turning the page
// into an advert. `from` is carried into the enquiry as source attribution.
export default function ServicePrompt({ from, question, cta }: { from: string; question: string; cta: string }) {
  return (
    <aside
      aria-label="Work with Lough Signal"
      style={{
        marginTop: 28, background: T.paper, border: `1px solid ${T.rule}`, borderLeft: `3px solid ${T.ochre}`,
        padding: '18px 22px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      <div>
        <div className="mono" style={{ fontSize: 12, letterSpacing: '0.08em', color: T.ochre, marginBottom: 4, textTransform: 'uppercase' }}>
          Need this for your organisation?
        </div>
        <div style={{ fontSize: 16, color: T.ink, lineHeight: 1.5, maxWidth: 640 }}>{question}</div>
      </div>
      <TrackedLink
        href={`/?from=hub-${from}#contact`}
        cta={`hub-${from}`}
        style={{ fontSize: 14, fontWeight: 500, color: T.bone, background: T.ink, padding: '10px 18px', borderRadius: 2, textDecoration: 'none', whiteSpace: 'nowrap' }}
      >
        {cta}
      </TrackedLink>
    </aside>
  )
}
