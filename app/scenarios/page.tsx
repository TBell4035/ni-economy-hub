'use client'
import { useState } from 'react'
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import TheoryTag from '@/components/TheoryTag'

const T = {
  bg0:'#07090d',bg1:'#0d1117',bg2:'#131920',bg3:'#192230',
  card:'#0f1620',border:'#1e2d3d',border2:'#243444',
  text0:'#eef2f7',text1:'#b8c8d8',text2:'#6a88a0',text3:'#3a5268',
  gold:'#e8a020',teal:'#12c4a4',blue:'#3a8fd4',red:'#e05050',
  green:'#38c070',amber:'#e89020',purple:'#9a70d4',
}

const SCENARIOS = {
  baseline: {
    label:'Baseline',
    subtitle:'Windsor Framework stability · SR settlement holds · current trajectory',
    color: T.teal,
    gdp:[{y:'2025',v:3.2},{y:'2026',v:2.8},{y:'2027',v:2.4},{y:'2028',v:2.3},{y:'2029',v:2.2}],
    emp:[{y:'2025',v:72.0},{y:'2026',v:72.5},{y:'2027',v:72.8},{y:'2028',v:73.0},{y:'2029',v:73.2}],
    notes:'Assumes Windsor Framework settlement remains stable, £19.3bn/yr SR settlement delivers as planned, cross-border trade integration continues, productivity gap narrows slowly. Employment rate stabilises around 72-73% following Q3 2025 cooling.',
    theory:'Solow framework: growth remains factor-accumulation driven with modest TFP improvement. Barnett formula delivers adequate funding. Hysteresis in inactivity persists without health system reform.',
    risks:['Final Fiscal Framework negotiations stall','Windsor Framework renegotiation uncertainty','Health waiting lists continue to suppress labour supply'],
  },
  optimistic: {
    label:'Optimistic',
    subtitle:'Productivity uplift · AI diffusion · fiscal reform · Productivity & Growth Board',
    color: T.green,
    gdp:[{y:'2025',v:3.8},{y:'2026',v:4.2},{y:'2027',v:4.5},{y:'2028',v:4.3},{y:'2029',v:4.0}],
    emp:[{y:'2025',v:72.5},{y:'2026',v:73.5},{y:'2027',v:74.8},{y:'2028',v:75.5},{y:'2029',v:76.0}],
    notes:'Assumes NI Executive implements Productivity 2040 recommendations including Productivity & Growth Board. AI adoption reaches SME base via diffusion-focused policy (Singapore model). Health reform reduces inactivity. Final Fiscal Framework locks in 24% premium permanently. Dual-market FDI strategy delivers.',
    theory:'New Growth Theory (Romer): TFP uplift from technology diffusion and management improvement. Solow residual increases as R&D translates into economy-wide adoption. Institutional quality improves with stable Executive and long-term budgeting.',
    risks:['Requires sustained political will across multiple Departments','AI SME diffusion programmes take 3-5 years to show in GVA','Health reform is a decade-long structural challenge'],
  },
  downside: {
    label:'Downside',
    subtitle:'UK fiscal tightening · Windsor instability · health crisis deepens',
    color: T.red,
    gdp:[{y:'2025',v:2.1},{y:'2026',v:1.2},{y:'2027',v:0.8},{y:'2028',v:0.9},{y:'2029',v:1.1}],
    emp:[{y:'2025',v:71.0},{y:'2026',v:70.2},{y:'2027',v:69.8},{y:'2028',v:69.5},{y:'2029',v:69.8}],
    notes:'UK fiscal tightening via defence reallocation reduces Barnett consequentials. Windsor Framework renegotiation creates investment uncertainty. Health waiting lists worsen, driving inactivity above 28%. US tariffs hit NI manufacturing. Construction boom does not sustain into 2026.',
    theory:'Keynesian transmission: UK fiscal contraction transmits directly to NI with no automatic stabiliser. Hysteresis deepens as health-driven inactivity becomes entrenched. Institutional Economics: political uncertainty premium suppresses long-horizon FDI.',
    risks:['Most acute risk: UK spending shift to defence at expense of public services','Windsor Framework legal mechanism for UK-EU divergence is untested','NI has no fiscal buffer — cannot offset external shocks locally'],
  },
  ai_adoption: {
    label:'AI Adoption',
    subtitle:'What if NI SMEs achieve Ireland-level AI adoption by 2029?',
    color: T.purple,
    gdp:[{y:'2025',v:3.2},{y:'2026',v:3.6},{y:'2027',v:4.1},{y:'2028',v:4.8},{y:'2029',v:5.2}],
    emp:[{y:'2025',v:72.0},{y:'2026',v:72.8},{y:'2027',v:73.5},{y:'2028',v:74.2},{y:'2029',v:75.0}],
    notes:'Scenario: NI SME AI adoption reaches 60% (Ireland 2026: 92% of all organisations) by 2029 through a dedicated diffusion programme modelled on Singapore\'s Productivity Solutions Grant. Assumes 18% productivity gain for adopting SMEs (Trinity/Microsoft finding), applied to NI\'s 44,000 SMEs with 1-9 employees. GVA impact modelled as productivity gain × employment × wage base.',
    theory:'Diffusion economics: general-purpose technology (AI) creates economy-wide productivity gains only when adopted broadly, not just in frontier firms. Singapore empirical evidence: 3% productivity increase and 2.2% revenue increase for SME participants. Applied to NI SME base of ~44,000 firms.',
    risks:['Requires a diffusion programme that does not currently exist in NI policy','SME adoption is constrained by digital literacy, not just access to tools','18% productivity gain is average — distribution across SMEs is likely highly skewed','Timeline assumes rapid policy implementation — optimistic given NI governance history'],
  },
}

const Tip = ({active,payload,label}:any) => {
  if(!active||!payload?.length) return null
  return (
    <div style={{background:T.bg2,border:`1px solid ${T.border2}`,padding:'10px 14px',borderRadius:4,fontSize:11,fontFamily:'monospace'}}>
      <div style={{color:T.text0,fontWeight:700,marginBottom:6}}>{label}</div>
      {payload.map((p:any,i:number)=>(
        <div key={i} style={{color:p.color||T.text1,marginBottom:2}}>
          {p.name}: <strong>{typeof p.value==='number'?p.value.toFixed(1):p.value}</strong>
        </div>
      ))}
    </div>
  )
}

const Insight = ({type,text}:{type:'insight'|'warning'|'opportunity'|'explain'|'weak',text:string}) => {
  const cfg = {
    insight:{col:T.teal,label:'◆ INSIGHT'},
    warning:{col:T.red,label:'⚠ RISK'},
    opportunity:{col:T.green,label:'↑ OPPORTUNITY'},
    explain:{col:T.blue,label:'ℹ EXPLAINER'},
    weak:{col:T.amber,label:'△ DATA NOTE'},
  }
  const c = cfg[type]
  return (
    <div style={{background:`${c.col}08`,borderLeft:`3px solid ${c.col}`,borderRadius:'0 4px 4px 0',padding:'10px 14px',marginBottom:10,fontSize:13,color:T.text1,lineHeight:1.65}}>
      <span className="mono" style={{fontSize:9,letterSpacing:2,color:c.col,marginRight:8}}>{c.label}</span>
      {text}
    </div>
  )
}

export default function ScenariosPage() {
  const [active, setActive] = useState<keyof typeof SCENARIOS>('baseline')
  const scenario = SCENARIOS[active]

  return (
    <div style={{maxWidth:1100}} className="page-enter">
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 09 · SCENARIOS
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Economic Scenarios 2025–2029
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:14}}>
          Four scenarios for the NI economy to 2029. Each is grounded in the theoretical
          frameworks that underpin this platform. Scenarios are illustrative — based on
          qualitative assessment of identified risks and opportunities, not calibrated
          macro-econometric models. The AI Adoption scenario is new to V3.
        </p>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <TheoryTag tag="solow"/>
          <TheoryTag tag="keynes"/>
          <TheoryTag tag="north"/>
          <TheoryTag tag="diffusion"/>
          <TheoryTag tag="hysteresis"/>
        </div>
      </div>

      {/* Scenario selector */}
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:24}}>
        {(Object.entries(SCENARIOS) as [keyof typeof SCENARIOS, typeof SCENARIOS[keyof typeof SCENARIOS]][]).map(([k,v])=>(
          <button key={k} onClick={()=>setActive(k)} style={{
            background: active===k ? `${v.color}22` : 'transparent',
            color: active===k ? v.color : T.text2,
            border: `2px solid ${active===k ? v.color : T.border}`,
            padding:'8px 20px',cursor:'pointer',
            fontSize:11,fontFamily:'monospace',letterSpacing:1,
            borderRadius:4,transition:'all 0.15s',
          }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Active scenario */}
      <div style={{border:`2px solid ${scenario.color}22`,borderTop:`3px solid ${scenario.color}`,borderRadius:6,padding:20,marginBottom:20,background:T.card}}>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:16,fontWeight:700,color:T.text0,marginBottom:4}}>{scenario.label}</div>
          <div className="mono" style={{fontSize:10,color:scenario.color,marginBottom:10}}>{scenario.subtitle}</div>
          <p style={{fontSize:13,color:T.text2,lineHeight:1.7,marginBottom:10}}>{scenario.notes}</p>
          <div style={{background:T.bg2,borderRadius:4,padding:'10px 14px',fontSize:12,color:T.text2,lineHeight:1.6,marginBottom:10}}>
            <span style={{color:scenario.color,fontFamily:'monospace',fontSize:10,letterSpacing:1,marginRight:8}}>THEORETICAL BASIS</span>
            {scenario.theory}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div>
            <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:10}}>
              PROJECTED GVA GROWTH (%)
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={scenario.gdp}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${v}%`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceLine y={1.4} stroke={T.text3} strokeDasharray="3 3"/>
                <Bar dataKey="v" fill={scenario.color} opacity={0.75} name="GVA Growth %"/>
              </BarChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:4}}>
              Dashed = UK 2024 baseline (1.4%)
            </div>
          </div>

          <div>
            <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:10}}>
              PROJECTED EMPLOYMENT RATE (%)
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={scenario.emp}>
                <defs>
                  <linearGradient id="scenG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={scenario.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={scenario.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis domain={[67,80]} tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceLine y={75} stroke={T.text3} strokeDasharray="3 3"/>
                <Area type="monotone" dataKey="v" stroke={scenario.color} fill="url(#scenG)" strokeWidth={2} name="Employment Rate %"/>
              </AreaChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:4}}>
              Dashed = UK avg employment rate (~75%)
            </div>
          </div>
        </div>
      </div>

      {/* Risks for active scenario */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20,marginBottom:20}}>
        <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:12}}>
          KEY RISKS & ASSUMPTIONS — {scenario.label.toUpperCase()} SCENARIO
        </div>
        {scenario.risks.map((r,i)=>(
          <div key={i} style={{display:'flex',gap:12,marginBottom:8,alignItems:'flex-start'}}>
            <span className="mono" style={{fontSize:10,color:scenario.color,flexShrink:0}}>·</span>
            <span style={{fontSize:12,color:T.text2,lineHeight:1.5}}>{r}</span>
          </div>
        ))}
      </div>

      {/* All scenarios comparison */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20,marginBottom:20}}>
        <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>
          ALL SCENARIOS — GVA GROWTH COMPARISON 2025–2029
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart>
            <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
            <XAxis dataKey="y" type="category" allowDuplicatedCategory={false}
              tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${v}%`}/>
            <Tooltip content={<Tip/>}/>
            <ReferenceLine y={0} stroke={T.border2}/>
            {(Object.entries(SCENARIOS) as [keyof typeof SCENARIOS, typeof SCENARIOS[keyof typeof SCENARIOS]][]).map(([k,v])=>(
              <Line key={k} data={v.gdp} type="monotone" dataKey="v" stroke={v.color} strokeWidth={k===active?2.5:1.5}
                dot={false} name={v.label} strokeDasharray={k===active?undefined:"4 2"}/>
            ))}
            <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Insight type="explain" text="These scenarios are illustrative analytical frameworks, not forecasts. They are designed to make the key uncertainties legible — not to predict outcomes. The baseline reflects current trajectory; the optimistic scenario requires sustained political will and policy delivery that NI's governance history suggests is difficult; the downside is plausible under UK fiscal conditions that are largely outside NI's control; the AI adoption scenario is the most speculative but grounded in empirical evidence from Ireland and Singapore." />
      <Insight type="weak" text="Forecast confidence ratings: Baseline 62% · Optimistic 45% · Downside 55% · AI Adoption 38%. No NI-specific macro-econometric model with public access exists. These projections are not calibrated against a structural model. The ESRI/NIESR NI macro model is the most rigorous available tool but is not publicly accessible at the required granularity." />
    </div>
  )
}