export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '16px 28px',
      background: 'var(--bg1)',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 8,
      flexShrink: 0,
    }}>
      <span className="mono" style={{ fontSize: 9, color: 'var(--text3)' }}>
        NI ECONOMY HUB V3 · ACADEMIC & POLICY INTELLIGENCE · MAY 2026
      </span>
      <span className="mono" style={{ fontSize: 9, color: 'var(--text3)' }}>
        NISRA · ONS · NERI · ESRI · INTERTRADEIRELAND · NI FISCAL COUNCIL · HMRC · QUB · UU
      </span>
    </footer>
  )
}