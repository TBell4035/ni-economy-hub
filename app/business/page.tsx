'use client'
import { useState } from 'react'
import {
  BarChart, Bar, AreaChart, Area, ComposedChart, LineChart, Line,
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

const totalBusinesses = [
  {y:'2012',v:72170},{y:'2013',v:72480},{y:'2014',v:73510},
  {y:'2015',v:74830},{y:'2016',v:76120},{y:'2017',v:77350},
  {y:'2018',v:78490},{y:'2019',v:79620},{y:'2020',v:78840},
  {y:'2021',v:80210},{y:'2022',v:81350},{y:'2023',v:82640},
  {y:'2024',v:83900},
]

const birthsDeaths = [
  {y:'2015',births:8240,deaths:6980,net:1260},
  {y:'2016',births:8610,deaths:7120,net:1490},
  {y:'2017',births:8830,deaths:7340,net:1490},
  {y:'2018',births:9010,deaths:7560,net:1450},
  {y:'2019',births:9240,deaths:7820,net:1420},
  {y:'2020',births:7640,deaths:8310,net:-670},
  {y:'2021',births:9980,deaths:7180,net:2800},
  {y:'2022',births:9420,deaths:8040,net:1380},
  {y:'2023',births:8870,deaths:8210,net:660},
  {y:'2024',births:8900,deaths:8400,net:500},
]

const sizeBands = [
  {band:'0 employees',count:38200,pct:45.5},
  {band:'1–9 (micro)',count:32100,pct:38.3},
  {band:'10–49 (small)',count:9800,pct:11.7},
  {band:'50–249 (medium)',count:2900,pct:3.5},
  {band:'250+ (large)',count:900,pct:1.1},
]

const niabiTurnover = [
  {sector:'Wholesale & Retail',turnover:16.3,employees:70200},
  {sector:'Manufacturing',turnover:14.7,employees:84400},
  {sector:'Construction',turnover:8.4,employees:43800},
  {sector:'Prof. Services',turnover:6.8,employees:56100},
  {sector:'Accommodation & Food',turnover:3.6,employees:60200},
  {sector:'Transport & Storage',turnover:3.2,employees:22600},
  {sector:'ICT',turnover:2.8,employees:25900},
]

const rdExpenditure = [
  {y:'2015',berd:284,herd:148,total:432},{y:'2016',berd:298,herd:154,total:452},
  {y:'2017',berd:312,herd:162,total:474},{y:'2018',berd:328,herd:171,total:499},
  {y:'2019',berd:341,herd:178,total:519},{y:'2020',berd:352,herd:184,total:536},
  {y:'2021',berd:368,herd:192,total:560},{y:'2022',berd:384,herd:201,total:585},
  {y:'2023',berd:401,herd:210,total:611},{y:'2024',berd:418,herd:220,total:638},
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

export default function BusinessPage() {
  const [view, setView] = useState<'structure'|'niabi'|'investni'>('structure')

  return (
    <div style={{maxWidth:1100}} className="page-enter">
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 08 · BUSINESS ECONOMY
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Business Economy
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:14}}>
          Structure, size and activity of the NI business base. Primary sources:
          Inter-Departmental Business Register (IDBR) via ONS UK Business Counts;
          NI Annual Business Inquiry (NIABI) 2024 — published 11 March 2026;
          ONS Business Enterprise R&D Survey (BERD); Invest NI Annual Report 2024-25.
        </p>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <TheoryTag tag="diffusion"/>
          <TheoryTag tag="lse"/>
          <TheoryTag tag="solow"/>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:24}}>
        <KPI label="Total Businesses 2024" value="83,900" sub="IDBR · all enterprises" delta="+1.5% YoY · +16% since 2012" color={T.teal}/>
        <KPI label="Total Turnover 2024" value="£109.3" unit="bn" sub="NIABI 2024 · +7.5% YoY · record" delta="Published 11 March 2026" color={T.blue}/>
        <KPI label="aGVA 2024 (confirmed)" value="£43.6" unit="bn" sub="NIABI 2024 · +9.6% YoY" delta="Construction led: +30.7%" color={T.teal}/>
        <KPI label="Sole traders (0 employees)" value="45.5" unit="%" sub="IDBR · 38,200 businesses" delta="SME-dominated economy" deltaPos={false} color={T.amber}/>
        <KPI label="R&D Expenditure 2024" value="£638" unit="m" sub="ONS BERD · BERD+HERD combined" delta="+4.4% YoY · growing slowly" color={T.blue}/>
        <KPI label="Large firms (250+)" value="900" sub="IDBR · 1.1% of all businesses" delta="Limited large employer base" deltaPos={false} color={T.amber}/>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        {(['structure','niabi','investni'] as const).map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{
            background:view===v?`${T.teal}18`:'transparent',
            color:view===v?T.teal:T.text2,
            border:'none',borderBottom:`2px solid ${view===v?T.teal:'transparent'}`,
            padding:'8px 20px',cursor:'pointer',
            fontSize:11,fontFamily:'monospace',letterSpacing:1,
            textTransform:'uppercase',transition:'all 0.12s',
          }}>
            {v==='structure'?'Business Structure':v==='niabi'?'NIABI 2024':'Invest NI'}
          </button>
        ))}
      </div>

      {view==='structure'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Total NI Businesses (000s)" subtitle="IDBR · ONS UK BUSINESS COUNTS · 2012–2024">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={totalBusinesses}>
                <defs>
                  <linearGradient id="bizG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.teal} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={T.teal} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis domain={[68000,88000]} tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                <Tooltip content={<Tip/>}/>
                <Area type="monotone" dataKey="v" stroke={T.teal} fill="url(#bizG)" strokeWidth={2} name="Total Businesses"/>
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Business Births & Deaths" subtitle="IDBR · ANNUAL · 2015–2024">
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={birthsDeaths}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(1)}k`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceLine y={0} stroke={T.border2}/>
                <Bar dataKey="births" fill={T.green} opacity={0.7} name="Births"/>
                <Bar dataKey="deaths" fill={T.red} opacity={0.6} name="Deaths"/>
                <Line type="monotone" dataKey="net" stroke={T.gold} strokeWidth={2} dot={false} name="Net Change"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
              Business Size Distribution 2024
            </div>
            <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>
              IDBR · ONS UK BUSINESS COUNTS · % OF ALL NI ENTERPRISES
            </div>
            {sizeBands.map(d=>(
              <div key={d.band} style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}>
                  <span style={{color:T.text1}}>{d.band}</span>
                  <span className="mono" style={{color:T.teal,fontSize:11}}>{d.pct}% · {d.count.toLocaleString()}</span>
                </div>
                <div style={{background:T.bg3,height:5,borderRadius:2}}>
                  <div style={{background:T.teal,height:5,width:`${d.pct}%`,borderRadius:2}}/>
                </div>
              </div>
            ))}
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <Insight type="insight" text="NI's business base has grown steadily from 72,170 in 2012 to 83,900 in 2024 — a 16% increase. However, 83.8% of businesses have fewer than 10 employees. This SME-dominated structure is a direct driver of the productivity gap — smaller firms have lower management quality scores, invest less in R&D, and are less likely to export." />
            <Insight type="weak" text="IDBR captures VAT and PAYE registrations only. An estimated 20-30% of sole traders operate below these thresholds and are invisible to the register. In NI, agricultural and micro-hospitality sectors are particularly under-counted. The true business count is likely 15-20% higher than IDBR figures." />
          </div>
        </div>
      )}

      {view==='niabi'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Turnover by Sector (£bn)" subtitle="NIABI 2024 · NISRA · CONFIRMED 11 MARCH 2026">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={niabiTurnover} layout="vertical">
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} horizontal={false}/>
                <XAxis type="number" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${v}bn`}/>
                <YAxis type="category" dataKey="sector" tick={{fontSize:9,fill:T.text1}} tickLine={false} width={130}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="turnover" fill={T.blue} opacity={0.8} name="Turnover (£bn)" radius={[0,2,2,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <ChartCard title="R&D Expenditure (£m)" subtitle="ONS BERD · NI REGION · 2015–2024 · BUSINESS + HIGHER EDUCATION">
              <ResponsiveContainer width="100%" height={180}>
                <ComposedChart data={rdExpenditure}>
                  <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                  <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${v}m`}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="berd" stackId="rd" fill={T.purple} opacity={0.8} name="Business R&D (£m)"/>
                  <Bar dataKey="herd" stackId="rd" fill={T.blue} opacity={0.7} name="HE R&D (£m)"/>
                  <Line type="monotone" dataKey="total" stroke={T.gold} strokeWidth={2} dot={false} name="Total R&D (£m)"/>
                  <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>

            <Insight type="insight" text="NIABI 2024 confirms an exceptional year — aGVA rose 9.6% to £43.6bn, the strongest growth in over a decade outside COVID recovery. Construction led at +30.7%, followed by Manufacturing at +15.2% and Distribution at +14.5%. Total turnover reached a record £109.3bn." />
            <Insight type="weak" text="NIABI excludes agriculture, financial services, and the public sector. These three sectors account for approximately 35% of NI's total GVA. The confirmed £43.6bn aGVA covers the business economy only. No single published source gives a comprehensive total NI GVA figure for 2024." />
          </div>
        </div>
      )}

      {view==='investni'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
              Invest NI — Strategy 2024-27 & Annual Report 2024-25
            </div>
            <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>
              SOURCES: INVEST NI AR 2024-25 (OCT 2025) · STRATEGY 2024-27 (NOV 2024)
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:T.gold,marginBottom:8}}>
                New Economic Vision (Feb 2024) — 4 Priorities:
              </div>
              {[
                {p:'1',text:'Increase the number of good jobs',col:T.teal},
                {p:'2',text:'Raise productivity',col:T.blue},
                {p:'3',text:'Decarbonise the economy',col:T.green},
                {p:'4',text:'Deliver much improved regional balance',col:T.amber},
              ].map(r=>(
                <div key={r.p} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:8}}>
                  <span className="mono" style={{fontSize:10,color:r.col,flexShrink:0}}>0{r.p}</span>
                  <span style={{fontSize:12,color:T.text2}}>{r.text}</span>
                </div>
              ))}
            </div>
            <div style={{borderTop:`1px solid ${T.border}`,paddingTop:14}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text0,marginBottom:8}}>
                Key Strategy Shifts vs Previous Period:
              </div>
              {[
                {change:'Job quality over job quantity',detail:'Financial support only for jobs above Real Living Wage — shift from pure job count targets'},
                {change:'Productivity-first framing',detail:'Closing the productivity gap = potential £7bn addition to NI economy. Explicit target: Value Added per FTE'},
                {change:'Dual-market exploitation',detail:'Windsor Framework dual access explicitly referenced as competitive advantage to be leveraged'},
                {change:'Independent Review response',detail:'New client definition, operating model restructure, commitment to renewal following critical review'},
              ].map(r=>(
                <div key={r.change} style={{borderLeft:`3px solid ${T.teal}`,padding:'8px 12px',background:T.bg2,marginBottom:8,borderRadius:'0 4px 4px 0'}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text0,marginBottom:3}}>{r.change}</div>
                  <div style={{fontSize:11,color:T.text2,lineHeight:1.5}}>{r.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                Invest NI — Critical Assessment
              </div>
              <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:12}}>
                NI PRODUCTIVITY 2040 (JAN 2025) · NI AUDIT OFFICE PERFORMANCE REVIEW
              </div>
              {[
                {issue:'Job creation prioritised over productivity',severity:'high',text:'Independent review found job creation received 29% of assistance 2017-21 — ahead of productivity. This is despite unemployment no longer being NI\'s primary economic problem.'},
                {issue:'Additionality questions',severity:'medium',text:'NI Audit Office review questions whether Invest NI support is genuinely additional — i.e., would the investment have happened anyway without public subsidy?'},
                {issue:'Contact centre legacy',severity:'medium',text:'Over 9,000 jobs created before 2008 were in contact centres — only a third paid above private sector average. Quality over quantity shift is welcome but late.'},
                {issue:'Budget uncertainty',severity:'high',text:'Absence of multi-year budget continues to constrain Invest NI planning and delivery. Cannot make long-term commitments to investors without multi-year resource certainty.'},
              ].map(r=>(
                <div key={r.issue} style={{borderLeft:`3px solid ${r.severity==='high'?T.red:T.amber}`,padding:'8px 12px',background:T.bg2,marginBottom:8,borderRadius:'0 4px 4px 0'}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text0,marginBottom:3}}>{r.issue}</div>
                  <div style={{fontSize:11,color:T.text2,lineHeight:1.55}}>{r.text}</div>
                </div>
              ))}
            </div>
            <Insight type="insight" text="Invest NI's 2024-27 strategy represents a genuine shift in framing — from job creation to productivity, from quantity to quality, from ad hoc FDI attraction to systematic dual-market leverage. Whether the strategy translates into practice is the question. The 2024-25 Annual Report describes 'very strong' results but 8 of 47 Business Plan targets require corrective action." />
          </div>
        </div>
      )}
    </div>
  )
}