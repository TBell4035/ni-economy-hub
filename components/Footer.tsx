import Link from 'next/link'
import meta from '@/data/economic/meta.json'

// Version + date come ONLY from data/economic/meta.json. Edit there, not here.
export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--rule)',
      padding: '20px 28px',
      background: 'var(--bone)',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      flexShrink: 0,
    }}>
      <span className="mono" style={{ fontSize: 12, color: 'var(--mist)', textTransform: 'uppercase' }}>
        NI Economy Hub · a <Link href="/" style={{ color: 'var(--teal)' }}>Lough Signal</Link> product · {meta.dataVersion} · {meta.publicationLabel} · <Link href="/privacy" style={{ color: 'var(--teal)' }}>Privacy</Link>
      </span>
      <span className="mono" style={{ fontSize: 12, color: 'var(--mist)', textTransform: 'uppercase' }}>
        Sources: NISRA · ONS · HMRC · HMT · NI Fiscal Council · ESRI · QUB · UU
      </span>
    </footer>
  )
}
