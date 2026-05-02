'use client'
import { useState } from 'react'
import {
  BarChart, Bar, AreaChart, Area, ComposedChart, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ReferenceArea
} from 'recharts'
import TheoryTag from '@/components/TheoryTag'

const T = {
  bg0:'#07090d',bg1:'#0d1117',bg2:'#131920',bg3:'#192230',
  card:'#0f1620',border:'#1e2d3d',border2:'#243444',
  text0:'#eef2f7',text1:'#b8c8d8',text2:'#6a88a0',text3:'#3a5268',
  gold:'#e8a020',teal:'#12c4a4',blue:'#3a8fd4',red:'#e05050',
  green:'#38c070',amber:'#e89020',purple:'#9a70d4',
}

const fiscalAnnual = [
  {y:'2010-11',spend:19.2,rev:12.8,deficit:6.4},
  {y:'2012-13',spend:20.1,rev:13.2,deficit:6.9},
  {y:'2014-15',spend:21.2,rev:14.1,deficit:7.1},
  {y:'2016-17',spend:22.0,rev:14.8,deficit:7.2},
  {y:'2018-19',spend:23.1,rev:15.4,deficit:7.7},
  {y:'2020-21',spend:28.4,rev:15.8,deficit:12.6},
  {y:'2021-22',spend:28.1,rev:16.4,deficit:11.7},
  {y:'2022-23',spend:27.2,rev:16.9,deficit:10.3},
  {y:'2023-24',spend:27.8,rev:17.2,deficit:10.6},
  {y:'2024-25',spend:28.2,rev:17.8,deficit:10.4},
  {y:'2025-26F',spend:29.0,rev:18.2,deficit:10.8,forecast:true},
  {y:'2026-27F',spend:29.8,rev:18.6,deficit:11.2,forecast:true},
]

const healthSpend = [
  {y:'2010',pct:42.1},{y:'2012',pct:43.4},{y:'2014',pct:44.2},
  {y:'2016',pct:45.8},{y:'2018',pct:47.2},{y:'2020',pct:50.1},
  {y:'2022',pct:50.8},{y:'2024',pct:51.4},
]

const deptAllocations = [
  {dept:'Health',share:51,amt:'~£14.4bn',color:'#e05050'},
  {dept:'Education',share:14,amt:'~£3.9bn',color:'#3a8fd4'},
  {dept:'Infrastructure',share:8,amt:'~£2.2bn',color:'#e89020'},
  {dept:'Communities',share:7,amt:'~£2.0bn',color:'#9a70d4'},
  {dept:'Justice',share:6,amt:'~£1.7bn',color:'#6a88a0'},
  {dept:'Economy (DfE)',share:4,amt:'~£1.1bn',color:'#12c4a4'},
  {dept:'Agriculture',share:3,amt:'~£0.8bn',color:'#38c070'},
  {dept:'Other / Executive',share:7,amt:'~£2.0bn',color:'#3a5268'},
]

const spendPerHead = [
  {region:'Northern Ireland',val:16116,color:'#e8a020'},
  {region:'Scotland',val:15400,color:'#12c4a4'},
  {region:'London',val:15217,color:'#3a8fd4'},
  {region:'Wales',val:15155,color:'#9a70d4'},
  {region:'UK Average',val:13504,color:'#6a88a0'},
  {region:'England',val:13134,color:'#3a5268'},
  {region:'South East',val:12031,color:'#3a5268'},
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

export default function FiscalPage() {
  const [view, setView] = useState<'overview'|'departments'|'barnett'|'transformation'>('overview')

  return (
    <div style={{maxWidth:1100}} className="page-enter">
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 05 · FISCAL ARCHITECTURE
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Fiscal Architecture
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:14}}>
          NI's public finances are defined by almost total dependence on the Westminster Block
          Grant. This module cross-references HM Treasury CRA 2025, NI Fiscal Council assessments,
          NI Assembly research, Pivotal Policy, and media commentary. Where sources diverge,
          both figures are shown with attribution.
        </p>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <TheoryTag tag="keynes"/>
          <TheoryTag tag="barnett"/>
          <TheoryTag tag="north"/>
        </div>
      </div>

      {/* Sources panel */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:16,marginBottom:20}}>
        <div className="mono" style={{fontSize:9,letterSpacing:2,color:T.gold,marginBottom:10}}>
          ▣ FISCAL DATA SOURCES — ALL FIGURES CROSS-REFERENCED
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,fontSize:11,color:T.text2,lineHeight:1.6}}>
          <div>
            <strong style={{color:T.text1}}>Block Grant (£17.7bn Barnett, 2024-25):</strong> HM Treasury Annual Report 2024-25.
            Total DEL (~£28bn) includes Barnett + non-Barnett additions.
            Spending Review 2025 confirms £19.3bn/yr average 2026-29.
          </div>
          <div>
            <strong style={{color:T.text1}}>Spend per head (£16,116, 19% above UK):</strong> HM Treasury CRA November 2025.
            NI Fiscal Council confirms Executive funded above assessed level of need.
            NI Affairs Committee follow-up report, June 2025.
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:24}}>
        <KPI label="Spend Per Head 2024-25" value="£16,116" sub="19% above UK avg · HMT CRA Nov 2025" delta="Highest of any UK nation" deltaPos={false} color={T.red}/>
        <KPI label="SR Settlement 2026-29" value="£19.3" unit="bn/yr" sub="Average · Spending Review 2025" delta="Largest since devolution in 1998" color={T.gold}/>
        <KPI label="Total DEL 2024-25" value="~£28" unit="bn" sub="Budget Act NI 2025 · £31bn resources" delta="Source: NI Fiscal Council" color={T.amber}/>
        <KPI label="Fiscal Gap 2024-25" value="~£10.4" unit="bn" sub="Spend minus NI-raised revenue" delta="~95% funded externally" deltaPos={false} color={T.red}/>
        <KPI label="Health DEL Share" value="51" unit="%" sub="Of total budget allocation" delta="Up from 42% in 2010" deltaPos={false} color={T.amber}/>
        <KPI label="Transformation Fund" value="£235" unit="m" sub="PSTB · £129m allocated to 6 projects" delta="47 bids received (~£750m total)" color={T.teal}/>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        {(['overview','departments','barnett','transformation'] as const).map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{
            background:view===v?`${T.teal}18`:'transparent',
            color:view===v?T.teal:T.text2,
            border:'none',borderBottom:`2px solid ${view===v?T.teal:'transparent'}`,
            padding:'8px 20px',cursor:'pointer',
            fontSize:11,fontFamily:'monospace',letterSpacing:1,
            textTransform:'uppercase',transition:'all 0.12s',
          }}>
            {v==='overview'?'Overview':v==='departments'?'Departments':v==='barnett'?'Barnett & Needs':'Transformation'}
          </button>
        ))}
      </div>

      {view==='overview'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Public Spending & Revenue (£bn)" subtitle="FISCAL YEAR · 2010–2026F · NI FISCAL COUNCIL / HMT PESA">
            <TheoryTag tag="keynes"/>
            <div style={{marginTop:10}}>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={fiscalAnnual}>
                  <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="y" tick={{fontSize:8,fill:T.text3,fontFamily:'monospace'}} tickLine={false} interval={1} angle={-30} textAnchor="end" height={40}/>
                  <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${v}bn`}/>
                  <Tooltip content={<Tip/>}/>
                  <ReferenceArea x1="2025-26F" x2="2026-27F" fill={T.bg3} opacity={0.6}/>
                  <Bar dataKey="spend" fill={T.blue} opacity={0.6} name="Total Spending"/>
                  <Bar dataKey="rev" fill={T.teal} opacity={0.7} name="NI-Raised Revenue"/>
                  <Line type="monotone" dataKey="deficit" stroke={T.red} strokeWidth={2} dot={false} name="Fiscal Gap"/>
                  <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Public Spending Per Head (£, 2024-25)" subtitle="HM TREASURY CRA NOVEMBER 2025 · UK NATIONS & REGIONS">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={spendPerHead} layout="vertical">
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} horizontal={false}/>
                <XAxis type="number" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${(v/1000).toFixed(0)}k`}/>
                <YAxis type="category" dataKey="region" tick={{fontSize:9,fill:T.text1}} tickLine={false} width={110}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceLine x={13504} stroke={T.text3} strokeDasharray="3 3"/>
                <Bar dataKey="val" name="Spend per head (£)" radius={[0,2,2,0]}
  fill={T.teal}
  shape={(props:any)=>{
    const {region, x, y, width, height} = props
    const isNI = region==='Northern Ireland'
    const isUK = region==='UK Average'
    return <rect x={x} y={y} width={width} height={height} fill={isNI?T.gold:isUK?T.text3:T.teal} opacity={isUK?0.5:0.8}/>
  }}
/>
              </BarChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:8}}>
              Gold = NI · Dashed = UK average (£13,504) · Source: HMT CRA Nov 2025
            </div>
          </ChartCard>

          <Insight type="insight" text="NI receives £16,116 per person in public spending — 19% above the UK average and the highest of any UK nation. The Spending Review 2025 confirmed £19.3bn/yr average for 2026-29, described as the largest settlement in real terms since devolution. The NI Executive will continue to receive over 24% more per person than equivalent UK Government spending." />
          <Insight type="warning" text="High spending does not translate to good outcomes. NI has the longest NHS waiting lists in the UK (430,000 people), the lowest educational attainment, and the worst productivity of any UK region. The value-for-money question — what NI gets for its spending premium — is rarely asked publicly and has no systematic published answer." />
        </div>
      )}

      {view==='departments'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Departmental Allocations 2024-25" subtitle="NI FISCAL COUNCIL / DOF · % OF TOTAL DEL">
            <div style={{paddingTop:8}}>
              {deptAllocations.map(d=>(
                <div key={d.dept} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <div style={{width:130,fontSize:11,color:T.text1}}>{d.dept}</div>
                  <div style={{flex:1,background:T.bg3,height:6,borderRadius:2}}>
                    <div style={{background:d.color,height:6,width:`${d.share*1.8}%`,borderRadius:2}}/>
                  </div>
                  <div className="mono" style={{fontSize:11,color:T.text2,width:70,textAlign:'right'}}>{d.amt}</div>
                </div>
              ))}
            </div>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <ChartCard title="Health as % of NI Budget" subtitle="DHSSPS / DOF ANNUAL · 2010–2024">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={healthSpend}>
                  <defs>
                    <linearGradient id="hG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.red} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={T.red} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                  <YAxis domain={[38,56]} tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<Tip/>}/>
                  <ReferenceLine y={50} stroke={T.amber} strokeDasharray="3 3"/>
                  <Area type="monotone" dataKey="pct" stroke={T.red} fill="url(#hG)" strokeWidth={2} name="Health % of Budget"/>
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <Insight type="warning" text="Health rising from 42% to 51% of the total budget over 14 years means capital investment, economic development, housing and infrastructure are being squeezed. DfE receives just 4% of total spend. This fiscal composition is structurally inconsistent with a productivity-led growth strategy. The real-terms decline in DfE funding while health grows is flagged by Pivotal Policy (December 2025) as a serious concern." />
            <Insight type="explain" text="Per-head spending data (HMT CRA) measures all identifiable public expenditure including DWP, HMRC and UK-wide departments. The NI Executive's own DEL budget is approximately £28bn. The difference between total identifiable spending (~£30bn) and DEL (~£28bn) reflects UK-wide spending attributed to NI residents — defence, debt interest, pensions." />
          </div>
        </div>
      )}

      {view==='barnett'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
              How the Barnett Formula Works
            </div>
            <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>
              MECHANISM · SOURCE: NI FISCAL COUNCIL / HMT
            </div>
            <TheoryTag tag="barnett"/>
            <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:12}}>
              {[
                {step:'Step 1',text:'UK Government increases English department spending by £X',col:T.blue},
                {step:'Step 2',text:'NI receives 2.8% of £X (NI population share of England)',col:T.teal},
                {step:'Step 3',text:'If NI per-head falls below 124% of England — 24% needs top-up applies',col:T.gold},
                {step:'Step 4',text:'Result: NI currently receives ~19% above UK average spend per head',col:T.green},
                {step:'Note',text:'If UK switches from public services to defence spending, NI gets less — Barnett follows comparable functions only',col:T.amber},
              ].map(s=>(
                <div key={s.step} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                  <span className="mono" style={{fontSize:10,color:s.col,flexShrink:0,minWidth:50}}>{s.step}</span>
                  <span style={{fontSize:12,color:T.text2,lineHeight:1.5}}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                Fiscal Framework Status
              </div>
              <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:12}}>
                AS OF MAY 2026 · SOURCES: NI FISCAL COUNCIL, NI AFFAIRS COMMITTEE
              </div>
              {[
                {label:'Interim Framework agreed',status:'✓ May 2024',col:T.green},
                {label:'Spending Review settlement',status:'✓ Jun 2025 · £19.3bn/yr',col:T.green},
                {label:'24% needs factor confirmed',status:'✓ Above assessed need',col:T.green},
                {label:'Final Fiscal Framework',status:'⧖ Negotiations ongoing',col:T.amber},
                {label:'Holtham Review of NI need',status:'⧖ In scope of framework',col:T.amber},
                {label:'Further fiscal devolution',status:'○ Under discussion',col:T.text3},
                {label:'Water charges / rate reform',status:'○ Low political appetite',col:T.text3},
              ].map(r=>(
                <div key={r.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:12,color:T.text2}}>{r.label}</span>
                  <span className="mono" style={{fontSize:11,color:r.col}}>{r.status}</span>
                </div>
              ))}
            </div>
            <Insight type="insight" text="The 2026-27 fiscal cliff — flagged as the primary near-term risk in V1 and V2 — has been partially resolved by the Spending Review 2025. The £19.3bn/yr settlement and confirmed 24% needs premium provide a more stable fiscal foundation than existed at the time of those analyses. The unresolved question is whether the final Fiscal Framework will make this permanent." />
          </div>
        </div>
      )}

      {view==='transformation'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
              Public Sector Transformation Board
            </div>
            <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>
              PSTB · £235M TRANSFORMATION FUND · SOURCE: NIO / NI FISCAL COUNCIL
            </div>
            {[
              {label:'Total Transformation Fund',value:'£235m',sub:'Ringfenced from restoration package',col:T.gold},
              {label:'Allocated to date',value:'£129m',sub:'To 6 projects · March 2025',col:T.teal},
              {label:'Bids received',value:'47 projects',sub:'Total value ~£750m — far exceeds fund',col:T.amber},
              {label:'Annual transformation funding',value:'~£59-65m/yr',sub:'2026-29 per SR settlement',col:T.blue},
            ].map(r=>(
              <div key={r.label} style={{padding:'12px 0',borderBottom:`1px solid ${T.border}`}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                  <span style={{fontSize:12,color:T.text2}}>{r.label}</span>
                  <span className="mono" style={{fontSize:13,fontWeight:700,color:r.col}}>{r.value}</span>
                </div>
                <div style={{fontSize:11,color:T.text3}}>{r.sub}</div>
              </div>
            ))}
            <div style={{marginTop:14,padding:12,background:T.bg2,borderRadius:4,fontSize:12,color:T.text2,lineHeight:1.6}}>
              The gap between bids (~£750m) and available funding (~£235m) means only 31% of
              identified transformation projects can be funded. Departments competing for
              transformation money creates perverse incentives — projects framed as
              transformation rather than designed as transformation.
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                ALBs & NDPBs — Economic Footprint
              </div>
              <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:12}}>
                KEY ARMS LENGTH BODIES · APPROXIMATE ANNUAL SPEND
              </div>
              {[
                {body:'Health & Social Care Trusts (x5)',spend:'~£7bn+',note:'Delivery mechanism for 51% health budget · 70,000+ staff'},
                {body:'Education Authority',spend:'~£1.4bn',note:'Replaced Education & Library Boards'},
                {body:'NI Housing Executive',spend:'~£500m+',note:'Largest landlord in Western Europe historically'},
                {body:'NI Water',spend:'~£350m',note:'Not commercially funded — no water charges'},
                {body:'Translink / NI Railways',spend:'~£200m+',note:'Annual subsidy · public transport'},
                {body:'Invest NI',spend:'~£120m',note:'Economic development · FDI · R&D support'},
                {body:'QUB + Ulster University',spend:'~£150m',note:'Combined public grant funding'},
              ].map(r=>(
                <div key={r.body} style={{padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                    <span style={{fontSize:11,color:T.text1,fontWeight:600}}>{r.body}</span>
                    <span className="mono" style={{fontSize:11,color:T.teal}}>{r.spend}</span>
                  </div>
                  <div style={{fontSize:10,color:T.text3}}>{r.note}</div>
                </div>
              ))}
            </div>
            <Insight type="weak" text="ALB spending data is not consolidated in any single published source. The figures above are estimates compiled from Budget Act NI 2025, departmental annual reports, and NI Fiscal Council assessments. A comprehensive ALB spending map — showing all bodies, their budgets, staff counts, and outcome metrics — does not currently exist as a public document. This is a significant transparency gap." />
          </div>
        </div>
      )}
    </div>
  )
}