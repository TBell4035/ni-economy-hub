export default function OverviewPage() {
  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderTop: '3px solid var(--teal)',
        borderRadius: 6,
        padding: '32px',
        marginBottom: 24,
      }}>
        <div className="mono" style={{
          fontSize: 9,
          letterSpacing: 3,
          color: 'var(--teal)',
          marginBottom: 12
        }}>
          NORTHERN IRELAND · ECONOMIC INTELLIGENCE · V3 SCAFFOLD COMPLETE
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: 'var(--text0)',
          marginBottom: 12
        }}>
          NI Economy Hub
        </h1>
        <p style={{
          fontSize: 14,
          color: 'var(--text2)',
          lineHeight: 1.7
        }}>
          Scaffold deployed successfully. Stage 1 — Overview module — builds next.
        </p>
      </div>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--green)',
        borderRadius: '0 4px 4px 0',
        padding: '12px 16px',
        fontSize: 12,
        color: 'var(--text1)',
        fontFamily: 'monospace',
      }}>
        ✓ Design system loaded · ✓ Navigation active · ✓ Supabase connected · ✓ Module config live
      </div>
    </div>
  )
}