'use client'
import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, ComposedChart,
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

const productivityTrend = [
  {y:'2004',NI:72,UK:100,ROI:118},{y:'2006',NI:74,UK:100,ROI:124},
  {y:'2008',NI:76,UK:100,ROI:121},{y:'2010',NI:77,UK:100,ROI:118},
  {y:'2012',NI:78,UK:100,ROI:120},{y:'2014',NI:80,UK:100,ROI:128},
  {y:'2016',NI:81,UK:100,ROI:138},{y:'2018',NI:82,UK:100,ROI:148},
  {y:'2020',NI:83,UK:100,ROI:162},{y:'2022',NI:84,UK:100,ROI:168},
  {y:'2023',NI:87.6,UK:100,ROI:172},
]

const rdIntensity = [
  {y:'2010',NI:0.8,UK:1.7,ROI:1.4},{y:'2012',NI:0.9,UK:1.7,ROI:1.5},
  {y:'2014',NI:1.0,UK:1.7,ROI:1.6},{y:'2016',NI:1.1,UK:1.7,ROI:1.8},
  {y:'2018',NI:1.1,UK:1.7,ROI:2.0},{y:'2020',NI:1.2,UK:1.8,ROI:2.2},
  {y:'2022',NI:1.2,UK:1.7,ROI:2.4},{y:'2024',NI:1.3,UK:1.7,ROI:2.5},
]

const dashboardDrivers = [
  {driver:'Management practices',NI:0.52,UK:0.55,status:'red',note:'Worst of 12 UK regions · Dec 2025 Dashboard'},
  {driver:'R&D per job (£)',NI:1053,UK:1505,status:'red',note:'7th of 12 regions · ONS BERD 2023'},
  {driver:'Skills (no quals %)',NI:10.7,UK:6.9,status:'red',note:'Highest in UK · LFS 2024'},
  {driver:'Economic inactivity %',NI:26.5,UK:21.1,status:'red',note:'Worst in UK · LFS 2024'},
  {driver:'Export intensity %',NI:30.1,UK:null,status:'green',note:'4th of 12 regions · ONS 2023'},
  {driver:'Lifelong learning %',NI:null,UK:null,status:'amber',note:'New 2025 measure · data pending'},
  {driver:'Gigabit broadband %',NI:null,UK:null,status:'amber',note:'Improving · below UK avg'},
]

const radarData = [
  {metric:'GVA/hour',NI:88,UK:100,ROI:147},
  {metric:'R&D intensity',NI:61,UK:100,ROI:147},
  {metric:'Management',NI:95,UK:100,ROI:102},
  {metric:'Export intensity',NI:110,UK:100,ROI:185},
  {metric:'Skills NVQ4+',NI:88,UK:100,ROI:105},
  {metric:'Business formation',NI:78,UK:100,ROI:110},
]

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

const KPI = ({label,value,unit,sub,delta,deltaPos,color}:{
  label:string,value:string,unit?:string,sub:string,delta:string,deltaPos?:boolean,color:string
}) => (
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderTop:`2px solid ${color}`,borderRadius:6,padding:'16px 18px'}}>
    <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.text3,textTransform:'uppercase',marginBottom:6}}>{label}</div>
    <div style={{fontSize:24,fontWeight:700,color:T.text0,lineHeight:1,marginBottom:4}}>
      {value}<span style={{fontSize:13,color:T.text2,marginLeft:2}}>{unit}</span>
    </div>
    <div style={{fontSize:11,color:T.text2,marginBottom:4}}>{sub}</div>
    <div className="mono" style={{fontSize:11,color:deltaPos===false?T.red:T.green}}>{delta}</div>
  </div>
)

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

const ChartCard = ({title,subtitle,children}:{title:string,subtitle:string,children:React.ReactNode}) => (
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:3}}>{title}</div>
      <div className="mono" style={{fontSize:10,color:T.text3,letterSpacing:0.5}}>{subtitle}</div>
    </div>
    {children}
  </div>
)

export default function ProductivityPage() {
  const [view, setView] = useState<'gap'|'drivers'|'policy'>('gap')

  return (
    <div style={{maxWidth:1100}} className="page-enter">
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 06 · PRODUCTIVITY
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Productivity & Structural Competitiveness
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:14}}>
          NI's productivity gap is its most persistent economic failure. This module integrates
          the NI Productivity Dashboard 2025 (QUB / Productivity Institute, December 2025),
          NI Productivity 2040 (January 2025), NERI's Lever of Riches (July 2025), and
          NorthStar Briefing's diffusion analysis (December 2025).
        </p>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <TheoryTag tag="solow"/>
          <TheoryTag tag="lse"/>
          <TheoryTag tag="diffusion"/>
          <TheoryTag tag="north"/>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:24}}>
        <KPI label="GVA/Hour vs UK (UK=100)" value="87.6" sub="2023 · 8th of 12 UK regions" delta="Narrowed from 86.8 in 2022" color={T.amber}/>
        <KPI label="Productivity Gap" value="12.4" unit="%" sub="Below UK average · Dec 2025 Dashboard" delta="Was 13.2% in prev dashboard" color={T.amber}/>
        <KPI label="Management Practices" value="0.52/1.0" sub="Worst of 12 UK regions · 2023" delta="UK avg 0.55" deltaPos={false} color={T.red}/>
        <KPI label="R&D Per Job 2023" value="£1,053" sub="7th of 12 regions · ONS BERD" delta="UK avg £1,505 · -30%" deltaPos={false} color={T.red}/>
        <KPI label="No Qualifications (16-64)" value="10.7" unit="%" sub="Highest in UK · LFS 2024" delta="UK avg 6.9%" deltaPos={false} color={T.red}/>
        <KPI label="Innovation-Active Firms" value="32" unit="%" sub="Down from 38% despite R&D grants" delta="-6pp decline" deltaPos={false} color={T.red}/>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        {(['gap','drivers','policy'] as const).map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{
            background:view===v?`${T.teal}18`:'transparent',
            color:view===v?T.teal:T.text2,
            border:'none',borderBottom:`2px solid ${view===v?T.teal:'transparent'}`,
            padding:'8px 20px',cursor:'pointer',
            fontSize:11,fontFamily:'monospace',letterSpacing:1,
            textTransform:'uppercase',transition:'all 0.12s',
          }}>
            {v==='gap'?'The Gap':v==='drivers'?'20 Drivers':'Policy Failures'}
          </button>
        ))}
      </div>

      {view==='gap'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="GVA Per Hour Worked (UK=100)" subtitle="ONS REGIONAL PRODUCTIVITY · 2004–2023 · NI / UK / ROI">
            <div style={{display:'flex',gap:6,marginBottom:10}}>
              <TheoryTag tag="solow"/>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={productivityTrend}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} interval={1}/>
                <YAxis domain={[65,185]} tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceLine y={100} stroke={T.text3} strokeDasharray="3 3"/>
                <Line type="monotone" dataKey="NI" stroke={T.teal} strokeWidth={2} dot={{r:3,fill:T.teal}} name="NI"/>
                <Line type="monotone" dataKey="UK" stroke={T.text3} strokeWidth={1} dot={false} name="UK" strokeDasharray="3 3"/>
                <Line type="monotone" dataKey="ROI" stroke={T.gold} strokeWidth={2} dot={{r:3,fill:T.gold}} name="ROI"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </LineChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:8}}>
              NOTE: ROI figures distorted by multinational profit-shifting post-2015. Use ROI modified GNI* for realistic comparison (~125% of UK, not 172%).
            </div>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <ChartCard title="Structural Indicators: NI vs ROI (UK=100)" subtitle="COMPOSITE · ONS / EUROSTAT / NISRA 2023-24">
              <div style={{display:'flex',gap:6,marginBottom:10}}>
                <TheoryTag tag="diffusion"/>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={T.border}/>
                  <PolarAngleAxis dataKey="metric" tick={{fontSize:9,fill:T.text2,fontFamily:'monospace'}}/>
                  <Radar name="NI" dataKey="NI" stroke={T.teal} fill={T.teal} fillOpacity={0.2}/>
                  <Radar name="ROI" dataKey="ROI" stroke={T.gold} fill={T.gold} fillOpacity={0.1}/>
                  <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
                  <Tooltip content={<Tip/>}/>
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
            <Insight type="warning" text="NI's productivity gap with ROI is the most economically significant — and politically uncomfortable — comparison available. Even using modified GNI* (adjusted for multinational distortion), ROI is approximately 25-30% more productive than NI. This gap has widened continuously since the 1990s and no policy intervention has reversed it." />
          </div>
        </div>
      )}

      {view==='drivers'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
              NI Productivity Dashboard 2025 — 20 Drivers
            </div>
            <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>
              QUB / PRODUCTIVITY INSTITUTE · DECEMBER 2025 · DONALDSON, JORDAN, MCDONALD, TURNER
            </div>
            <div style={{marginBottom:12,fontSize:12,color:T.text2,lineHeight:1.6}}>
              13 of 20 drivers are below the UK average (red). 3 are equal to or above the median (amber). Only 4 are above the UK average (green). 8 drivers have continuously lagged since the first Dashboard in 2022.
            </div>
            {dashboardDrivers.map(d=>(
              <div key={d.driver} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,padding:'8px 10px',background:T.bg2,borderRadius:4,borderLeft:`3px solid ${d.status==='red'?T.red:d.status==='green'?T.green:T.amber}`}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:T.text1,marginBottom:2}}>{d.driver}</div>
                  <div className="mono" style={{fontSize:9,color:T.text3}}>{d.note}</div>
                </div>
                <div className="mono" style={{fontSize:10,color:d.status==='red'?T.red:d.status==='green'?T.green:T.amber,flexShrink:0}}>
                  {d.status==='red'?'↓ BELOW':d.status==='green'?'↑ ABOVE':'~ EQUAL'}
                </div>
              </div>
            ))}
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <ChartCard title="R&D Intensity (% of GVA)" subtitle="ONS / EUROSTAT · NI vs UK vs ROI · 2010–2024">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={rdIntensity}>
                  <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                  <YAxis domain={[0.5,3.0]} tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<Tip/>}/>
                  <Line type="monotone" dataKey="NI" stroke={T.teal} strokeWidth={2} dot={{r:3}} name="NI"/>
                  <Line type="monotone" dataKey="UK" stroke={T.blue} strokeWidth={2} dot={{r:3}} name="UK" strokeDasharray="4 2"/>
                  <Line type="monotone" dataKey="ROI" stroke={T.gold} strokeWidth={2} dot={{r:3}} name="ROI"/>
                  <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <Insight type="weak" text="No firm-level productivity microdata is publicly available for NI. The 87.6% of UK figure is derived from aggregate GVA divided by estimated hours worked — not measured productivity at firm or sector level. We cannot identify which sectors, firm sizes or regions are driving the gap. This is a critical data gap for policy design." />
            <Insight type="insight" text="The productivity gap narrowed to 12.4% below UK average in 2023, from 13.2% the year before. NI moved from 10th to 8th place among UK's 12 regions. This is the best short- and long-term driver performance since the Dashboard began in 2022 — 11 of 20 drivers improved in both the short and long term. Progress is real but fragile." />
          </div>
        </div>
      )}

      {view==='policy'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
              Why Policy Has Failed — NI Productivity 2040
            </div>
            <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>
              QUB / PRODUCTIVITY INSTITUTE · JANUARY 2025 · DONALDSON, JORDAN, TURNER
            </div>
            <TheoryTag tag="north"/>
            <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:10}}>
              {[
                {issue:'Misdiagnosis',text:'Policy historically treated NI\'s productivity gap as an unemployment problem. Job creation received 29% of Invest NI assistance 2017-21 — prioritised ahead of productivity.',col:T.red},
                {issue:'Siloed policymaking',text:'Productivity requires cross-departmental action but NI departments operate in silos. No mechanism exists to coordinate productivity-relevant policies across Education, Economy, Health and Infrastructure simultaneously.',col:T.amber},
                {issue:'Short-termism',text:'11 consecutive single-year budgets means departments cannot plan long-term. The Productivity 2040 report identifies this as a structural barrier to sustained productivity investment.',col:T.amber},
                {issue:'Invention bias',text:'£232m in R&D grants by 2021, yet innovation-active firms fell from 38% to 32%. Policy is biased toward frontier R&D and academic spin-outs rather than technology diffusion across the 83,900 SME base.',col:T.red},
                {issue:'Political instability',text:'Executive collapsed 2002-07, 2017-20, 2022-24 — approximately 40% of post-GFA governance time. QUB estimates ~£2.3bn cumulative lost capital investment during suspension periods.',col:T.red},
              ].map(s=>(
                <div key={s.issue} style={{borderLeft:`3px solid ${s.col}`,padding:'8px 12px',background:T.bg2,borderRadius:'0 4px 4px 0'}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text0,marginBottom:3}}>{s.issue}</div>
                  <div style={{fontSize:11,color:T.text2,lineHeight:1.55}}>{s.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
                The Diffusion Problem
              </div>
              <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:12}}>
                NORTHSTAR BRIEFING · DECEMBER 2025 · ANALYSIS
              </div>
              <TheoryTag tag="diffusion"/>
              <p style={{fontSize:12,color:T.text2,lineHeight:1.65,marginTop:12,marginBottom:12}}>
                NI output per hour worked sits 13% below the UK average and nearly 20% below
                Ireland. Despite over £232m in R&D grants by 2021 and record venture capital
                reaching £143m in 2023, the proportion of innovation-active firms has fallen.
                The system generates early-stage activity concentrated in Belfast, but with
                thin late-stage deal flow and few Series C rounds.
              </p>
              <div style={{background:T.bg2,borderRadius:4,padding:'12px 14px',fontSize:12,color:T.text1,lineHeight:1.65}}>
                <strong style={{color:T.teal}}>Singapore model:</strong> The Productivity Solutions Grant
                provides financial support for SMEs to adopt pre-approved, off-the-shelf digital
                tools. Impact evaluations show participating firms achieved 3% productivity
                increases and 2.2% revenue increases. Smaller firms saw the largest improvements —
                exactly the demographic that maps to NI's private sector.
              </div>
            </div>

            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                NI Productivity 2040 — Key Recommendation
              </div>
              <div style={{background:`${T.gold}12`,border:`1px solid ${T.gold}33`,borderRadius:4,padding:'14px 16px',fontSize:13,color:T.text1,lineHeight:1.7}}>
                <strong style={{color:T.gold}}>A Productivity and Growth Board</strong> — an independent
                body working closely with the NI Executive, publishing an annual report on the
                state of productivity with short- and long-term policy recommendations. Requires
                political commitment and cross-departmental cooperation. Would help address
                previous short-termism and siloed policymaking.
              </div>
              <p style={{fontSize:12,color:T.text2,lineHeight:1.65,marginTop:12}}>
                As of May 2026, this recommendation has not been implemented. The NI Executive's
                Programme for Government (March 2025) includes productivity as a priority but
                does not establish the independent board mechanism recommended.
              </p>
            </div>

            <Insight type="opportunity" text="The AI module (see AI & Digital Economy) presents a potential productivity lever — but only if adoption reaches beyond the 198 AI-active firms currently identified by the AICC Census. The Trinity/Microsoft AI Economy Ireland 2026 research shows SMEs that invest in AI report 18% productivity gains vs 8% for large firms. NI's SME base is the target — not the AI sector itself." />
          </div>
        </div>
      )}
    </div>
  )
}