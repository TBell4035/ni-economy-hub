'use client'
import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ComposedChart, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import TheoryTag from '@/components/TheoryTag'
import { T } from '@/lib/tokens'
import meta from '@/data/economic/meta.json'

// ── COLOUR PALETTE ────────────────────────────────────────────────

// ── DATA ──────────────────────────────────────────────────────────
const gvaGrowth = [
  { y:'2001',NI:4.8,UK:2.6,ROI:5.8 },{ y:'2005',NI:5.8,UK:3.0,ROI:6.1 },
  { y:'2008',NI:-1.1,UK:-0.3,ROI:-4.0 },{ y:'2010',NI:2.6,UK:1.9,ROI:0.4 },
  { y:'2013',NI:1.7,UK:2.1,ROI:1.5 },{ y:'2016',NI:1.2,UK:1.9,ROI:3.7 },
  { y:'2019',NI:1.0,UK:1.6,ROI:5.0 },{ y:'2020',NI:-9.2,UK:-9.4,ROI:6.2 },
  { y:'2021',NI:8.1,UK:7.5,ROI:13.6 },{ y:'2022',NI:3.2,UK:4.1,ROI:12.0 },
  { y:'2023',NI:2.1,UK:0.3,ROI:2.5 },{ y:'2024',NI:9.6,UK:1.4,ROI:3.0 },
]

const nicei = [
  { q:'Q1 22',v:104.8 },{ q:'Q2 22',v:105.4 },{ q:'Q3 22',v:106.1 },{ q:'Q4 22',v:106.8 },
  { q:'Q1 23',v:107.4 },{ q:'Q2 23',v:108.2 },{ q:'Q3 23',v:109.0 },{ q:'Q4 23',v:110.1 },
  { q:'Q1 24',v:111.2 },{ q:'Q2 24',v:111.9 },{ q:'Q3 24',v:113.4 },{ q:'Q4 24',v:114.8 },
]

const gvaPerHead = [
  { region:'London', gva:67400 },{ region:'SE England', gva:38200 },
  { region:'Scotland', gva:32100 },{ region:'E England', gva:31500 },
  { region:'SW England', gva:27800 },{ region:'E Midlands', gva:27200 },
  { region:'Yorkshire', gva:26900 },{ region:'NE England', gva:24300 },
  { region:'Wales', gva:24100 },{ region:'N Ireland', gva:29234 },
  { region:'UK Avg', gva:36100 },
].sort((a,b) => b.gva - a.gva)

const sectorGVA = [
  { sector:'Services', share:52, growth:5.6, color:T.teal },
  { sector:'Public Sector', share:24, growth:1.8, color:T.blue },
  { sector:'Production', share:12, growth:0.8, color:T.red },
  { sector:'Construction', share:7, growth:2.0, color:T.amber },
  { sector:'Agriculture', share:5, growth:-0.1, color:T.green },
]

const radarData = [
  { metric:'GVA/hour vs UK', NI:85, ROI:147 },
  { metric:'Employment Rate', NI:74, ROI:73 },
  { metric:'R&D Intensity', NI:61, ROI:142 },
  { metric:'Export Intensity', NI:72, ROI:185 },
  { metric:'Business Formation', NI:78, ROI:110 },
  { metric:'Skills (NVQ4+)', NI:88, ROI:105 },
]

// ── SUB-COMPONENTS ────────────────────────────────────────────────
const KPI = ({ label, value, unit, sub, delta, deltaPos, color }: {
  label: string, value: string, unit?: string, sub: string,
  delta: string, deltaPos?: boolean, color: string
}) => (
  <div style={{
    background: T.card, border: `1px solid ${T.border}`,
    borderTop: `2px solid ${color}`, borderRadius:0, padding: '16px 18px',
  }}>
    <div className="mono" style={{ fontSize: 12, letterSpacing:'0.12em', color: T.text3, textTransform: 'uppercase', marginBottom: 6 }}>
      {label}
    </div>
    <div style={{ fontSize: 24, fontWeight: 700, color: T.text0, lineHeight: 1, marginBottom: 4 }}>
      {value}<span style={{ fontSize: 14, color: T.text2, marginLeft: 2 }}>{unit}</span>
    </div>
    <div style={{ fontSize: 12, color: T.text2, marginBottom: 4 }}>{sub}</div>
    <div className="mono" style={{ fontSize: 12, color: deltaPos === false ? T.red : T.green }}>
      {delta}
    </div>
  </div>
)

const Insight = ({ type, text }: { type: 'insight'|'warning'|'opportunity'|'explain', text: string }) => {
  const cfg = {
    insight:     { col: T.teal,   label: '◆ INSIGHT' },
    warning:     { col: T.red,    label: '⚠ RISK' },
    opportunity: { col: T.green,  label: '↑ OPPORTUNITY' },
    explain:     { col: T.blue,   label: 'ℹ EXPLAINER' },
  }
  const c = cfg[type]
  return (
    <div style={{
      background: `${c.col}08`, borderLeft: `3px solid ${c.col}`,
      borderRadius:0, padding: '10px 14px',
      marginBottom: 10, fontSize: 14, color: T.text1, lineHeight: 1.65,
    }}>
      <span className="mono" style={{ fontSize: 12, letterSpacing:'0.08em', color: c.col, marginRight: 8 }}>
        {c.label}
      </span>
      {text}
    </div>
  )
}

const ChartCard = ({ title, subtitle, children }: {
  title: string, subtitle: string, children: React.ReactNode
}) => (
  <div style={{
    background: T.card, border: `1px solid ${T.border}`,
    borderRadius:0, padding: 20,
  }}>
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.text0, marginBottom: 3 }}>{title}</div>
      <div className="mono" style={{ fontSize: 12, color: T.text3, letterSpacing: 0.5 }}>{subtitle}</div>
    </div>
    {children}
  </div>
)

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: T.bg2, border: `1px solid ${T.border2}`,
      padding: '10px 14px', borderRadius:0, fontSize: 12, fontFamily: 'var(--font-mono)',
    }}>
      <div style={{ color: T.text0, fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || T.text1, marginBottom: 2 }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong>
        </div>
      ))}
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
export default function OverviewPage() {
  const [activeTab, setActiveTab] = useState<'snapshot'|'structure'>('snapshot')

  return (
    <div style={{ maxWidth: 1100 }}>

      {/* ── MASTHEAD ── */}
      <div style={{
        background: `linear-gradient(135deg, ${T.bg2} 0%, ${T.bg3} 100%)`,
        border: `1px solid ${T.border}`, borderRadius:0,
        padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 300, height: '100%',
          background: 'radial-gradient(ellipse at right center, rgba(15,76,74,.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div className="mono" style={{ fontSize: 12, letterSpacing:'0.14em', color: T.teal, marginBottom: 10 }}>
          NORTHERN IRELAND · ECONOMIC INTELLIGENCE · {meta.publicationLabel.toUpperCase()}
        </div>
        <h1 style={{fontFamily:'var(--font-display)',lineHeight:1.1,
          margin: '0 0 12px', fontSize:40, fontWeight:400,
          color: T.text0, letterSpacing:-0.4,
        }}>
          Northern Ireland<br/>
          <span style={{ color: T.gold }}>Economy Hub</span>
        </h1>
<p style={{ margin: '0 0 6px', color: T.text2, fontSize: 14, maxWidth: 620, lineHeight: 1.7 }}>
  A multi-dimensional analytical framework integrating output, labour, trade, fiscal,
  productivity and AI data within Keynesian, New Growth and Regional Economics theory.
  Every forecast is confidence-rated. Every data gap is flagged. Based on all available
  official NI statistics to Q1 2026 / mid-2026, and a purpose-built NI macro-model.
</p>
<p style={{ margin: '0 0 18px', fontSize: 14, lineHeight: 1.6 }}>
  <span style={{ color: T.text3, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing:'0.04em' }}>
    BUILT & MAINTAINED BY{' '}
  </span>
  <a
    href="https://www.linkedin.com/in/thomas-bell-299883a0/"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: T.teal, textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing:'0.04em' }}
  >
    THOMAS BELL
  </a>
  <span style={{ color: T.text3, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing:'0.04em' }}>
        {' '}· ECONOMIST · LOUGH SIGNAL · NORTHERN IRELAND
  </span>
</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <TheoryTag tag="keynes" />
          <TheoryTag tag="solow" />
          <TheoryTag tag="north" />
          <TheoryTag tag="gravity" />
          <TheoryTag tag="hysteresis" />
          <TheoryTag tag="lse" />
          <TheoryTag tag="diffusion" />
          <TheoryTag tag="barnett" />
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 24 }}>
        {(['snapshot', 'structure'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: activeTab === tab ? `${T.teal}18` : 'transparent',
            color: activeTab === tab ? T.teal : T.text2,
            border: 'none',
            borderBottom: `2px solid ${activeTab === tab ? T.teal : 'transparent'}`,
            padding: '8px 20px', cursor: 'pointer',
            fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing:'0.04em',
            textTransform: 'uppercase', transition: 'all 0.12s',
          }}>
            {tab === 'snapshot' ? 'Economic Snapshot' : 'Structural Position'}
          </button>
        ))}
      </div>

      {/* ── SNAPSHOT TAB ── */}
      {activeTab === 'snapshot' && (
        <div>
          {/* KPI Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
            gap: 10, marginBottom: 24,
          }}>
            <KPI
              label="GVA Growth 2024 (NIABI)"
              value="+9.6" unit="%"
              sub="Confirmed aGVA · NIABI 2024"
              delta="+8.2pp vs UK (1.4%)"
              color={T.teal}
            />
            <KPI
              label="NICEI Q2 2026 (YoY)"
              value="+2.3" unit="%"
              sub="Composite index proxy · NISRA 24 Sep 2026"
              delta="+1.0% on quarter · series high"
              color={T.teal}
            />
            <KPI
              label="GVA Per Head 2023"
              value="£29,234"
              sub="81% of UK average · ONS"
              delta="Gap narrowing slowly"
              color={T.gold}
            />
            <KPI
              label="Employment Rate May–Jul 2026"
              value="72.2" unit="%"
              sub="LFS · NISRA Sep 2026"
              delta="+0.2pp over quarter"
              color={T.teal}
            />
            <KPI
              label="Economic Inactivity May–Jul 2026"
              value="26.0" unit="%"
              sub="+6pp above UK avg · LFS"
              delta="Structural — health-driven"
              deltaPos={false}
              color={T.red}
            />
            <KPI
              label="Median Pay Aug 2026"
              value="£2,509" unit="/mo"
              sub="HMRC RTI flash · nominal"
              delta="+5.6% YoY"
              color={T.green}
            />
            <KPI
              label="Cross-Border Trade 2024"
              value="£14.6" unit="bn"
              sub="Goods+Services · NIETS 2024"
              delta="+16.8% YoY · record"
              color={T.teal}
            />
            <KPI
              label="Public Spend Per Head"
              value="£16,116"
              sub="2024-25 · 19% above UK avg"
              delta="HMT CRA Nov 2025"
              deltaPos={false}
              color={T.red}
            />
          </div>

          {/* Charts row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <ChartCard
              title="GVA Growth: NI vs UK vs ROI (%)"
              subtitle="ANNUAL · 2001–2024 · NISRA / ONS / CSO"
            >
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                <TheoryTag tag="solow" />
                <TheoryTag tag="north" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={gvaGrowth}>
                  <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="y" tick={{ fontSize:12, fill:T.text3, fontFamily:'var(--font-mono)' }} tickLine={false}/>
                  <YAxis tick={{ fontSize:12, fill:T.text3, fontFamily:'var(--font-mono)' }} tickLine={false} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<Tip/>}/>
                  <ReferenceLine y={0} stroke={T.border2}/>
                  <Bar isAnimationActive={false} dataKey="NI" fill={T.teal} opacity={0.8} name="NI"/>
                  <Line isAnimationActive={false} type="monotone" dataKey="UK" stroke={T.red} strokeWidth={2} dot={false} name="UK" strokeDasharray="4 2"/>
                  <Line isAnimationActive={false} type="monotone" dataKey="ROI" stroke={T.gold} strokeWidth={1.5} dot={false} name="ROI"/>
                  <Legend wrapperStyle={{ fontSize:12, fontFamily:'var(--font-mono)' }}/>
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mono" style={{ fontSize:12, color:T.text3, marginTop:8 }}>
                NOTE: calendar-year 2024 — NIABI aGVA +9.6% (business economy) vs NICEI +3.6% (whole-economy proxy); different measures. Latest NICEI: Q2 2026, +2.3% y/y
              </div>
            </ChartCard>

            <ChartCard
              title="NICEI Quarterly Index (Q1 2019 = 100)"
              subtitle="NI COMPOSITE ECONOMIC INDEX · NISRA · Q1 2022–Q4 2024"
            >
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={nicei}>
                  <defs>
                    <linearGradient id="niceiG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.teal} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={T.teal} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="q" tick={{ fontSize:12, fill:T.text3, fontFamily:'var(--font-mono)' }} tickLine={false}/>
                  <YAxis domain={[102,118]} tick={{ fontSize:12, fill:T.text3, fontFamily:'var(--font-mono)' }} tickLine={false}/>
                  <Tooltip content={<Tip/>}/>
                  <Area isAnimationActive={false} type="monotone" dataKey="v" stroke={T.teal} fill="url(#niceiG)" strokeWidth={2} name="NICEI"/>
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Insight boxes */}
          <Insight type="insight" text="NI's business economy grew 9.6% in GVA terms in 2024 (NIABI confirmed), outperforming UK growth of 1.4% by over 8 percentage points. Construction alone grew 30.7%, adding £1.7bn. This is the strongest confirmed growth in over a decade — but it is partly factor-accumulation driven (more buildings, more workers) rather than productivity driven. The TFP question remains open." />
          <Insight type="warning" text="On the September 2026 data, unemployment is 2.4% and the claimant count 33,400 — still low, though unemployment rose significantly over the quarter. Yet economic inactivity remains 26.0%, still around 6 percentage points above the UK average. This is the persistent structural problem: not a shortage of jobs but a large working-age population outside the labour market, much of it linked to long-term sickness. Hub view: demand-side measures alone look unlikely to shift this much; the evidence points more towards health and other supply-side factors." />
          <Insight type="opportunity" text="Cross-border trade reached £14.6bn in 2024 — a 16.8% increase in a single year, and 6.5x the 2015 level. NI runs a trade surplus with every external market simultaneously. No other UK region holds dual access to the UK Internal Market and EU Single Market for goods. Hub view: we have not found a published inward investment strategy from Invest NI or DfE that sets out how to use this position systematically — it looks like an under-used advantage." />
        </div>
      )}

      {/* ── STRUCTURE TAB ── */}
      {activeTab === 'structure' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

            {/* GVA Per Head Bar Chart */}
            <ChartCard
              title="GVA Per Head by UK Region (2023, £)"
              subtitle="ONS REGIONAL ACCOUNTS 2023 · SORTED BY VALUE"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={gvaPerHead} layout="vertical">
                  <CartesianGrid strokeDasharray="2 4" stroke={T.border} horizontal={false}/>
                  <XAxis type="number" tick={{ fontSize:12, fill:T.text3, fontFamily:'var(--font-mono)' }} tickLine={false} tickFormatter={v=>`£${(v/1000).toFixed(0)}k`}/>
                  <YAxis type="category" dataKey="region" tick={{ fontSize:12, fill:T.text1 }} tickLine={false} width={90}/>
                  <Tooltip content={<Tip/>}/>
                  <ReferenceLine x={36100} stroke={T.red} strokeDasharray="3 3"/>
                  <Bar isAnimationActive={false} dataKey="gva" name="GVA per head (£)"
                    fill={T.teal}
                    shape={(props: any) => {
                      const isNI = props.region === 'N Ireland'
                      const isUK = props.region === 'UK Avg'
                      return <rect {...props} fill={isNI ? T.gold : isUK ? T.red : T.teal} opacity={isUK ? 0.6 : 0.8}/>
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mono" style={{ fontSize:12, color:T.text3, marginTop:8 }}>
                Gold = N Ireland · Red dashed line = UK average (£36,100) · NI at 81% of UK avg
              </div>
            </ChartCard>

            {/* Radar Chart */}
            <div>
              <ChartCard
                title="Structural Indicators: NI vs ROI (UK = 100)"
                subtitle="COMPOSITE · ONS / EUROSTAT / NISRA 2023–24"
              >
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  <TheoryTag tag="solow" />
                  <TheoryTag tag="diffusion" />
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={T.border}/>
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize:12, fill:T.text2, fontFamily:'var(--font-mono)' }}/>
                    <Radar name="NI" dataKey="NI" stroke={T.teal} fill={T.teal} fillOpacity={0.2}/>
                    <Radar name="ROI" dataKey="ROI" stroke={T.gold} fill={T.gold} fillOpacity={0.1}/>
                    <Legend wrapperStyle={{ fontSize:12, fontFamily:'var(--font-mono)' }}/>
                    <Tooltip content={<Tip/>}/>
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Sector composition */}
              <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius:0, padding: 20, marginTop: 16,
              }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.text0, marginBottom:4 }}>
                  GVA Sector Composition
                </div>
                <div className="mono" style={{ fontSize:12, color:T.text3, marginBottom:14 }}>
                  % OF TOTAL · NISRA NICEI Q4 2024 SECTORAL WEIGHTS
                </div>
                {sectorGVA.map(s => (
                  <div key={s.sector} style={{ marginBottom: 10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, marginBottom:3 }}>
                      <span style={{ color:T.text1 }}>{s.sector}</span>
                      <span className="mono" style={{ fontSize:12, color: s.growth > 0 ? T.green : T.red }}>
                        {s.share}% · {s.growth > 0 ? '+' : ''}{s.growth}pp
                      </span>
                    </div>
                    <div style={{ background:T.bg3, height:5, borderRadius:0 }}>
                      <div style={{ background:s.color, height:5, width:`${s.share * 1.8}%`, borderRadius:0 }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Structure insights */}
          <Insight type="insight" text="NI sits at 81% of UK GVA per head — above Wales (67%) and North East England (67%) but well below the UK average of £36,100. The gap with London (£67,400) is structural and widening. Within the UK, NI's position has improved marginally — but the more meaningful comparison is with ROI, where GVA per hour worked is now 172% of the UK average, making NI approximately 60% as productive as its nearest neighbour." />
          <Insight type="warning" text="Services dominate NI's GVA at 52% — but these are predominantly low-value domestic services (retail, hospitality, care) rather than high-value tradeable services. The public sector at 24% acts as both a wage floor and a resource allocator, crowding labour from the private sector. NERI's July 2025 analysis confirms NI underperforms both the foreign and domestically-controlled sectors of the ROI economy in almost every sector." />
          <Insight type="explain" text="Two GVA measures are used throughout this platform. NICEI (+3.6% over calendar 2024; +2.3% y/y in Q2 2026) is a quarterly composite index — timely but a proxy, not national accounts. NIABI aGVA (+9.6% in 2024) is the confirmed annual business inquiry figure published March 2026. Construction alone grew 30.7% in NIABI 2024, which explains the gap between the two measures. Both are valid; they measure different things. This platform uses NIABI as the primary confirmed measure and NICEI for quarterly trend analysis." />
        </div>
      )}
    </div>
  )
}
