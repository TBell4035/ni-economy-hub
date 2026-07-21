'use client'
import { useState } from 'react'
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import TheoryTag from '@/components/TheoryTag'
import M from '@/data/scenarios.json'

const T = {
  bg0:'#07090d',bg1:'#0d1117',bg2:'#131920',bg3:'#192230',
  card:'#0f1620',border:'#1e2d3d',border2:'#243444',
  text0:'#eef2f7',text1:'#b8c8d8',text2:'#6a88a0',text3:'#3a5268',
  gold:'#e8a020',teal:'#12c4a4',blue:'#3a8fd4',red:'#e05050',
  green:'#38c070',amber:'#e89020',purple:'#9a70d4',
}

const Tip = ({active,payload,label}:any) => {
  if(!active||!payload?.length) return null
  return (
    <div style={{background:T.bg2,border:`1px solid ${T.border2}`,padding:'10px 14px',borderRadius:4,fontSize:11,fontFamily:'monospace'}}>
      <div style={{color:T.text0,fontWeight:700,marginBottom:6}}>{label}</div>
      {payload.map((p:any,i:number)=>(
        <div key={i} style={{color:p.color||T.text1,marginBottom:2}}>
          {p.name}: <strong>{typeof p.value==='number'?p.value.toFixed(2):p.value}</strong>
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
    weak:{col:T.amber,label:'△ MODEL NOTE'},
  }
  const c = cfg[type]
  return (
    <div style={{background:`${c.col}08`,borderLeft:`3px solid ${c.col}`,borderRadius:'0 4px 4px 0',padding:'10px 14px',marginBottom:10,fontSize:13,color:T.text1,lineHeight:1.65}}>
      <span className="mono" style={{fontSize:9,letterSpacing:2,color:c.col,marginRight:8}}>{c.label}</span>
      {text}
    </div>
  )
}

// ---- narrative scenarios (qualitative), aligned to the model & EY anchor ----
const NARRATIVE = {
  baseline: {
    label:'Baseline', color:T.teal,
    subtitle:'Windsor Framework stability · SR settlement holds · current trajectory',
    notes:'Windsor Framework settlement stable, £19.3bn/yr Spending Review settlement delivers, cross-border trade integration continues, productivity gap narrows slowly. Near-term GVA growth anchored to the EY Economic Eye Spring 2026 forecast (+0.7% 2026, +1.3% 2027), converging to the model’s ~1.5% potential.',
    theory:'Solow framework: growth remains factor-accumulation driven with modest TFP improvement. Barnett formula delivers adequate funding. Hysteresis in inactivity persists without health-system reform.',
    risks:['Final Fiscal Framework negotiations stall','Windsor Framework renegotiation uncertainty','Health waiting lists continue to suppress labour supply'],
  },
  downside: {
    label:'Downside', color:T.red,
    subtitle:'UK fiscal tightening · Windsor instability · export shock',
    notes:'Modelled as a sustained exports −3% + government consumption −2% shock. UK fiscal tightening reduces Barnett consequentials; Windsor renegotiation raises the investment-uncertainty premium; health waiting lists worsen, lifting inactivity. The GVA level path stays below baseline throughout.',
    theory:'Keynesian transmission: UK fiscal contraction transmits directly to NI with no local automatic stabiliser. Hysteresis deepens as health-driven inactivity entrenches.',
    risks:['UK spending shift to defence at the expense of public services','Windsor Framework legal mechanism for UK–EU divergence is untested','NI has no fiscal buffer to offset external shocks locally'],
  },
  upside: {
    label:'Upside', color:T.green,
    subtitle:'Dual-market capture · capital investment uplift',
    notes:'Modelled as a sustained exports +3% (dual-market FDI capture) + government investment +4% shock. Delivers a GVA level modestly above baseline and lower unemployment via Okun’s law. Requires the dual-market proposition to translate into measurable inward-investment outcomes.',
    theory:'New Growth / Regional Economics: sustained external demand plus public capital deepening raise the level path; employment follows the output gap.',
    risks:['Requires dual-market FDI to actually materialise','Public investment delivery capacity is constrained','Gains are level effects, not permanently higher growth'],
  },
} as const

const proj:any = (M as any).projection
const lvl = proj.gva_level_index
const levelData = proj.years.map((y:number,i:number)=>({
  y:String(y), Baseline:lvl.baseline[i], Downside:lvl.downside[i], Upside:lvl.upside[i]}))
const unempData = proj.years.map((y:number,i:number)=>({
  y:String(y), Baseline:proj.unemployment.baseline[i], Downside:proj.unemployment.downside[i], Upside:proj.unemployment.upside[i]}))

const IRF_LABELS:Record<string,string> = {
  gov_consumption:'Govt consumption +1%',
  exports_permanent:'Exports permanent +1%',
  exports_temporary:'Exports temp +1%',
  interest_rate_100bp:'UK rate +100bp',
}

export default function ScenariosPage() {
  const [active, setActive] = useState<keyof typeof NARRATIVE>('baseline')
  const [irfKey, setIrfKey] = useState<string>('gov_consumption')
  const scenario = NARRATIVE[active]
  const irf:any = (M as any).irf[irfKey]
  const irfData = irf.quarters.map((q:number,i:number)=>({
    q, Output:irf.output[i], Employment:irf.employment[i] }))

  return (
    <div style={{maxWidth:1100}} className="page-enter">
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 09 · SCENARIOS &amp; MACRO-MODEL
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Economic Scenarios 2026–2030
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:760,lineHeight:1.7,marginBottom:14}}>
          This module is powered by a purpose-built <strong style={{color:T.text1}}>core macro-model
          of the NI economy</strong> — a transparent, reproducible replica of the core block of the
          NIESR/ESRI AMNIE model (Bergin, Low, Millard &amp; Verma, 2025), built directly from that
          paper&rsquo;s published equations and estimated coefficients. The scenario paths below are
          generated by this model, not drawn by hand.
        </p>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <TheoryTag tag="solow"/><TheoryTag tag="keynes"/><TheoryTag tag="north"/>
          <TheoryTag tag="diffusion"/><TheoryTag tag="hysteresis"/>
        </div>
      </div>

      {/* ---- MODEL PANEL: validation ---- */}
      <div style={{border:`2px solid ${T.blue}22`,borderTop:`3px solid ${T.blue}`,borderRadius:6,padding:20,marginBottom:20,background:T.card}}>
        <div style={{fontSize:15,fontWeight:700,color:T.text0,marginBottom:4}}>NI Core Macro-Model</div>
        <div className="mono" style={{fontSize:10,color:T.blue,marginBottom:12}}>
          SIMPLIFIED AMNIE REPLICA · ERROR-CORRECTION CORE BLOCK · QUARTERLY
        </div>
        <p style={{fontSize:12,color:T.text2,lineHeight:1.7,marginBottom:14}}>
          The model implements DP-566&rsquo;s consumption, employment, wage, hours, investment and
          housing equations using the paper&rsquo;s published coefficients, solved with an open engine
          (not the proprietary NiGEM). Its correctness test is whether it reproduces the four
          simulations DP-566 itself reports:
        </p>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead>
            <tr style={{color:T.text3,fontFamily:'monospace',fontSize:10,textAlign:'left'}}>
              <th style={{padding:'6px 8px',borderBottom:`1px solid ${T.border2}`}}>SCENARIO</th>
              <th style={{padding:'6px 8px',borderBottom:`1px solid ${T.border2}`}}>THIS MODEL</th>
              <th style={{padding:'6px 8px',borderBottom:`1px solid ${T.border2}`}}>DP-566</th>
            </tr>
          </thead>
          <tbody>
            {(M as any).validation.map((v:any,i:number)=>(
              <tr key={i}>
                <td style={{padding:'6px 8px',borderBottom:`1px solid ${T.border}`,color:T.text1}}>{v.scenario}</td>
                <td style={{padding:'6px 8px',borderBottom:`1px solid ${T.border}`,color:T.teal,fontFamily:'monospace'}}>{v.model>0?'+':''}{v.model}%</td>
                <td style={{padding:'6px 8px',borderBottom:`1px solid ${T.border}`,color:T.text2,fontFamily:'monospace'}}>{v.paper}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mono" style={{fontSize:9,color:T.text3,marginTop:10,lineHeight:1.5}}>
          Reproduces the paper&rsquo;s two key results: a fiscal multiplier well below 1 (high regional
          import leakage) and a small export multiplier (export production is highly import-intensive).
        </div>
      </div>

      {/* ---- MODEL PROJECTION ---- */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20,marginBottom:20}}>
        <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:3}}>Model Projection 2026–2030</div>
        <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>REAL GVA LEVEL INDEX ({lvl.basis}) · MODEL-GENERATED</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={levelData}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis domain={[98,'auto']} tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <Line type="monotone" dataKey="Baseline" stroke={T.teal} strokeWidth={2.5} dot={false}/>
                <Line type="monotone" dataKey="Downside" stroke={T.red} strokeWidth={1.5} strokeDasharray="4 2" dot={false}/>
                <Line type="monotone" dataKey="Upside" stroke={T.green} strokeWidth={1.5} strokeDasharray="4 2" dot={false}/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </LineChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:4}}>
              Avg annual growth — baseline {proj.avg_annual_growth.baseline}% · downside {proj.avg_annual_growth.downside}% · upside {proj.avg_annual_growth.upside}%
            </div>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={unempData}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${v}%`}/>
                <Tooltip content={<Tip/>}/>
                <Line type="monotone" dataKey="Baseline" stroke={T.teal} strokeWidth={2.5} dot={false}/>
                <Line type="monotone" dataKey="Downside" stroke={T.red} strokeWidth={1.5} strokeDasharray="4 2" dot={false}/>
                <Line type="monotone" dataKey="Upside" stroke={T.green} strokeWidth={1.5} strokeDasharray="4 2" dot={false}/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </LineChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:4}}>UNEMPLOYMENT RATE (%) · OKUN&rsquo;S-LAW LINK TO OUTPUT GAP</div>
          </div>
        </div>
        <div className="mono" style={{fontSize:9,color:T.text3,marginTop:10,lineHeight:1.5}}>{proj.anchor_note}</div>
      </div>

      {/* ---- IMPULSE-RESPONSE EXPLORER ---- */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20,marginBottom:20}}>
        <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:3}}>Impulse Responses</div>
        <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:12}}>% DEVIATION FROM BASELINE · 20 QUARTERS</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>
          {Object.keys(IRF_LABELS).map(k=>(
            <button key={k} onClick={()=>setIrfKey(k)} style={{
              background: irfKey===k?`${T.blue}22`:'transparent',
              color: irfKey===k?T.blue:T.text2,
              border:`2px solid ${irfKey===k?T.blue:T.border}`,
              padding:'6px 14px',cursor:'pointer',fontSize:10,fontFamily:'monospace',borderRadius:4}}>
              {IRF_LABELS[k]}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={irfData}>
            <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
            <XAxis dataKey="q" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${v}%`}/>
            <Tooltip content={<Tip/>}/>
            <ReferenceLine y={0} stroke={T.border2}/>
            <Line type="monotone" dataKey="Output" stroke={T.gold} strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="Employment" stroke={T.blue} strokeWidth={2} dot={false}/>
            <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ---- NARRATIVE SCENARIO EXPLORER ---- */}
      <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:10}}>Scenario narratives</div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:20}}>
        {(Object.entries(NARRATIVE) as [keyof typeof NARRATIVE, typeof NARRATIVE[keyof typeof NARRATIVE]][]).map(([k,v])=>(
          <button key={k} onClick={()=>setActive(k)} style={{
            background: active===k?`${v.color}22`:'transparent',
            color: active===k?v.color:T.text2,
            border:`2px solid ${active===k?v.color:T.border}`,
            padding:'8px 20px',cursor:'pointer',fontSize:11,fontFamily:'monospace',letterSpacing:1,borderRadius:4}}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{border:`2px solid ${scenario.color}22`,borderTop:`3px solid ${scenario.color}`,borderRadius:6,padding:20,marginBottom:20,background:T.card}}>
        <div style={{fontSize:16,fontWeight:700,color:T.text0,marginBottom:4}}>{scenario.label}</div>
        <div className="mono" style={{fontSize:10,color:scenario.color,marginBottom:10}}>{scenario.subtitle}</div>
        <p style={{fontSize:13,color:T.text2,lineHeight:1.7,marginBottom:10}}>{scenario.notes}</p>
        <div style={{background:T.bg2,borderRadius:4,padding:'10px 14px',fontSize:12,color:T.text2,lineHeight:1.6,marginBottom:12}}>
          <span style={{color:scenario.color,fontFamily:'monospace',fontSize:10,letterSpacing:1,marginRight:8}}>THEORETICAL BASIS</span>
          {scenario.theory}
        </div>
        <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:8}}>KEY RISKS &amp; ASSUMPTIONS</div>
        {scenario.risks.map((r,i)=>(
          <div key={i} style={{display:'flex',gap:12,marginBottom:8,alignItems:'flex-start'}}>
            <span className="mono" style={{fontSize:10,color:scenario.color,flexShrink:0}}>·</span>
            <span style={{fontSize:12,color:T.text2,lineHeight:1.5}}>{r}</span>
          </div>
        ))}
      </div>

      <Insight type="explain" text="Scenario paths are generated by the NI Core Macro-Model — a simplified, open replica of the core block of the NIESR/ESRI AMNIE model, built from that paper's published equations. It reproduces DP-566's reported multipliers to within ~0.02–0.03pp. The baseline is anchored to the EY Economic Eye Spring 2026 forecast; UUEPC's forecast is cited elsewhere on this platform but is not used to set the path." />
      <Insight type="weak" text="Model limitations (full detail in the methodology): this is the core real-side block only, not the full ~60-variable AMNIE system; it uses an open solver rather than the proprietary NiGEM; the capital–labour substitution elasticity and two open-economy leakage parameters are calibrated (the latter to reproduce DP-566's multipliers) because the paper does not print NI-specific values; and three NI data series (nominal GVA by year, compensation of employees, GFCF) are calibrated around genuine gaps in the published regional accounts. It is a transparency and scenario-illustration tool, not a substitute for AMNIE or official NISRA/ESRI forecasts." />
    </div>
  )
}
