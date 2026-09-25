'use client'
import { useState } from 'react'
import {
  BarChart, Bar, AreaChart, Area, ComposedChart, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import TheoryTag from '@/components/TheoryTag'
import { T } from '@/lib/tokens'


const aiGvaProjection = [
  {y:'2024',v:82,scenario:'actual'},
  {y:'2025',v:110,scenario:'mid'},
  {y:'2026',v:148,scenario:'mid'},
  {y:'2027',v:186,scenario:'mid'},
  {y:'2028',v:200,scenario:'mid'},
  {y:'2025',v:95,scenario:'low'},
  {y:'2028',v:130,scenario:'low'},
  {y:'2025',v:130,scenario:'high'},
  {y:'2028',v:280,scenario:'high'},
]

const aiGvaChart = [
  {y:'2024',actual:82},{y:'2025',mid:110,low:95,high:130},
  {y:'2026',actual:214,mid:148,low:118,high:190},{y:'2027',mid:186,low:140,high:238},
  {y:'2028',mid:200,low:130,high:280},
]

const sectorRisk = [
  {sector:'Financial services back-office',risk:8.5,opportunity:3.0,col:T.red},
  {sector:'Legal process outsourcing',risk:8.0,opportunity:3.5,col:T.red},
  {sector:'Call centres / customer service',risk:7.8,opportunity:2.5,col:T.red},
  {sector:'Public admin / civil service',risk:6.5,opportunity:4.0,col:T.amber},
  {sector:'Retail / wholesale',risk:5.5,opportunity:4.5,col:T.amber},
  {sector:'Advanced manufacturing',risk:3.5,opportunity:7.5,col:T.green},
  {sector:'Professional services',risk:4.0,opportunity:7.0,col:T.green},
  {sector:'Agri-food / precision ag',risk:2.5,opportunity:8.0,col:T.green},
  {sector:'ICT / digital',risk:3.0,opportunity:9.0,col:T.teal},
  {sector:'Health & life sciences',risk:4.5,opportunity:8.5,col:T.teal},
]

const adoptionComparison = [
  {metric:'AI-active firms (% of total)',NI:0.48,Ireland:null,UK:null,note:'400 of ~83,900 NI businesses · AICC Census 2026'},
  {metric:'Orgs using/planning AI (%)',NI:null,Ireland:92,UK:68,note:'Trinity/Microsoft 2026 · Ireland'},
  {metric:'Advanced AI deployment (%)',NI:null,Ireland:10,UK:8,note:'Trinity/Microsoft 2026'},
  {metric:'SME weekly time saving (2hrs+)',NI:null,Ireland:25,UK:null,note:'Large firms 54% vs SMEs 25%'},
  {metric:'AI GVA (£m)',NI:214,Ireland:null,UK:null,note:'AICC Census 2026 (was £82m in 2025 Census)'},
]

const Tip = ({active,payload,label}:any) => {
  if(!active||!payload?.length) return null
  return (
    <div style={{background:T.bg2,border:`1px solid ${T.border2}`,padding:'10px 14px',borderRadius:0,fontSize:12,fontFamily:'var(--font-mono)'}}>
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
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderTop:`2px solid ${color}`,borderRadius:0,padding:'16px 18px'}}>
    <div className="mono" style={{fontSize:12,letterSpacing:'0.12em',color:T.text3,textTransform:'uppercase',marginBottom:6}}>{label}</div>
    <div style={{fontSize:24,fontWeight:700,color:T.text0,lineHeight:1,marginBottom:4}}>
      {value}<span style={{fontSize:14,color:T.text2,marginLeft:2}}>{unit}</span>
    </div>
    <div style={{fontSize:12,color:T.text2,marginBottom:4}}>{sub}</div>
    <div className="mono" style={{fontSize:12,color:deltaPos===false?T.red:T.green}}>{delta}</div>
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
    <div style={{background:`${c.col}08`,borderLeft:`3px solid ${c.col}`,borderRadius:0,padding:'10px 14px',marginBottom:10,fontSize:14,color:T.text1,lineHeight:1.65}}>
      <span className="mono" style={{fontSize:12,letterSpacing:'0.08em',color:c.col,marginRight:8}}>{c.label}</span>
      {text}
    </div>
  )
}

const ChartCard = ({title,subtitle,children}:{title:string,subtitle:string,children:React.ReactNode}) => (
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:0,padding:20}}>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:14,fontWeight:700,color:T.text0,marginBottom:3}}>{title}</div>
      <div className="mono" style={{fontSize:12,color:T.text3,letterSpacing:0.5}}>{subtitle}</div>
    </div>
    {children}
  </div>
)

export default function AIPage() {
  const [view, setView] = useState<'ecosystem'|'risk'|'adoption'>('ecosystem')

  return (
    <div style={{maxWidth:1100}}>
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:12,letterSpacing:'0.12em',color:T.teal,marginBottom:6}}>
          MODULE 07 · AI & DIGITAL ECONOMY
        </div>
        <h1 style={{fontFamily:'var(--font-display)',lineHeight:1.1,fontSize:40,fontWeight:400,color:T.text0,marginBottom:10,letterSpacing:-0.4}}>
          AI & Digital Economy
        </h1>
        <p style={{fontSize:14,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:14}}>
          The AICC (Ulster University / QUB, funded by Invest NI and DfE) published the second
          AI Capability Census in September 2026, prepared by Perspective Economics. It updates the
          inaugural August 2025 baseline. This module draws on both Censuses alongside the
          Trinity/Microsoft AI Economy Ireland 2026 report (April 2026) and NorthStar Briefing's
          analysis of NI's AI year (December 2025).
        </p>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <TheoryTag tag="diffusion"/>
          <TheoryTag tag="solow"/>
          <TheoryTag tag="lse"/>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:24}}>
        <KPI label="AI-Active Firms" value="400" sub="AICC Census · Sep 2026 · of ~83,900 total" delta="Up from 198 · ~0.5% of NI firms" color={T.teal}/>
        <KPI label="AI-Related GVA" value="£214" unit="m" sub="AICC Census · Sep 2026 · estimate" delta="Up from £82m · 2028 mid scenario passed" color={T.teal}/>
        <KPI label="Equity Raised Since 2024" value="£158" unit="m" sub="Census firms · AICC 2026" delta="<1% of UK AI equity (2025)" deltaPos={false} color={T.amber}/>
        <KPI label="AI-Related Jobs" value="2,402" sub="FTEs · AICC Census · Sep 2026" delta="+79% · 2028 ambition passed" color={T.blue}/>
        <KPI label="Belfast Concentration" value="73" unit="%" sub="Of AI firms · 2025 Census · check 2026" delta="Regional expansion needed" deltaPos={false} color={T.amber}/>
        <KPI label="Ireland AI Adoption" value="92" unit="%" sub="Orgs using/planning AI · TCD/Microsoft" delta="NI: ~55% currently using AI (AICC 2026 · different measure)" deltaPos={false} color={T.amber}/>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        {(['ecosystem','risk','adoption'] as const).map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{
            background:view===v?`${T.teal}18`:'transparent',
            color:view===v?T.teal:T.text2,
            border:'none',borderBottom:`2px solid ${view===v?T.teal:'transparent'}`,
            padding:'8px 20px',cursor:'pointer',
            fontSize:12,fontFamily:'var(--font-mono)',letterSpacing:'0.04em',
            textTransform:'uppercase',transition:'all 0.12s',
          }}>
            {v==='ecosystem'?'NI AI Ecosystem':v==='risk'?'Sector Risk & Opportunity':'Adoption Gap'}
          </button>
        ))}
      </div>

      {view==='ecosystem'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="AI GVA reached the 2028 target two years early" subtitle="AICC CENSUS 2026 OUTTURN vs 2025 CENSUS SCENARIOS · £M">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={aiGvaChart}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:12,fill:T.text3,fontFamily:'var(--font-mono)'}} tickLine={false}/>
                <YAxis tick={{fontSize:12,fill:T.text3,fontFamily:'var(--font-mono)'}} tickLine={false} tickFormatter={v=>`£${v}m`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceLine y={200} stroke={T.gold} strokeDasharray="3 3"/>
                <Bar isAnimationActive={false} dataKey="actual" fill={T.teal} opacity={0.9} name="Actual (£m)"/>
                <Line isAnimationActive={false} type="monotone" dataKey="mid" stroke={T.teal} strokeWidth={2} dot={false} name="Mid scenario"/>
                <Line isAnimationActive={false} type="monotone" dataKey="low" stroke={T.amber} strokeWidth={1.5} dot={false} name="Low scenario" strokeDasharray="4 2"/>
                <Line isAnimationActive={false} type="monotone" dataKey="high" stroke={T.green} strokeWidth={1.5} dot={false} name="High scenario" strokeDasharray="4 2"/>
                <Legend wrapperStyle={{fontSize:12,fontFamily:'var(--font-mono)'}}/>
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:12,color:T.text3,marginTop:8}}>
              Ochre dashed = £200m (2025 Census mid scenario for 2028) · Bars = Census estimates · Lines = 2025 scenarios, now superseded · Source: AICC Capability Census 2025 & 2026
            </div>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:0,padding:20}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text0,marginBottom:12}}>
                NI AI Ecosystem — Structural Profile
              </div>
              <div className="mono" style={{fontSize:12,color:T.text3,marginBottom:12}}>
                AICC CENSUS 2026 (SEP 2026) · ROWS MARKED 2025 NOT YET UPDATED FROM FULL REPORT
              </div>
              {[
                {label:'Skills demand (2026)',value:'AI/ML job adverts up 161% (rolling 12 months) · median advertised AI salary ~£61,000, H1 2026'},
                {label:'Adoption gap (2026)',value:'Around 45% of NI businesses report not currently using AI'},
                {label:'Investment (2026)',value:'~£158m equity raised by Census firms since 2024 · NI under 1% of UK AI equity by value in 2025'},
                {label:'Sectoral strengths (2025)',value:'Services & consulting (35%), Software & development (33%), Health & life sciences (9%)'},
                {label:'Business model (2025)',value:'51% developing/enhancing AI products · 33% providing AI implementation & advisory services'},
                {label:'Firm size structure (2025)',value:'36 anchor employers (10+ AI professionals) · 92 early-stage firms (0-2 staff) · thin mid-market'},
                {label:'Top 10 firm concentration (2025)',value:'541 FTEs = 40% of 1,340 AI FTEs — concentration risk; 2026 Census reports broader-based growth'},
                {label:'AICC investment',value:'£16.3m initiative · 260+ postgraduate scholars · 100+ SMEs engaged'},
                {label:'Policy gap',value:'No published DfE AI strategy as of July 2026 — DfE Industrial Strategy consultation (Feb 2026) barely mentions AI. Economy Minister now references an AI Advisory Panel (Sep 2026)'},
              ].map(r=>(
                <div key={r.label} style={{padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                  <div style={{fontSize:12,color:T.text3,marginBottom:3,fontFamily:'var(--font-mono)',letterSpacing:0.5}}>{r.label.toUpperCase()}</div>
                  <div style={{fontSize:14,color:T.text1,lineHeight:1.5}}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>

          <Insight type="insight" text="The 2026 Census finds 400 AI-engaged firms, 2,402 AI-related jobs and an estimated £214m of AI-related GVA — above the 2025 Census's mid scenario for 2028, two years early. The supply side has outrun expectations; the gap is now on the demand side. Around 45% of NI businesses report not using AI at all, NI accounted for under 1% of UK AI equity investment in 2025, and scaling smaller firms remains the stated weakness. For an SME owner the question is no longer whether local AI capability exists, but whether your business is using it." />
          <Insight type="warning" text="There is no published NI AI strategy from DfE as of July 2026. The AICC provides a research and commercialisation infrastructure, but without a clear government strategy linking AI adoption to the productivity agenda, NI risks repeating the pattern identified in the Productivity 2040 report — public investment in innovation without economy-wide diffusion." />
        </div>
      )}

      {view==='risk'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:0,padding:20}}>
            <div style={{fontSize:14,fontWeight:700,color:T.text0,marginBottom:4}}>
              Automation Risk vs AI Opportunity by Sector
            </div>
            <div className="mono" style={{fontSize:12,color:T.text3,marginBottom:14}}>
              ASSESSMENT · BASED ON FREY-OSBORNE / OECD 2023 FRAMEWORKS · NI SECTOR PROFILE
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span className="mono" style={{fontSize:12,color:T.text3}}>SECTOR</span>
              <div style={{display:'flex',gap:20}}>
                <span className="mono" style={{fontSize:12,color:T.red}}>RISK</span>
                <span className="mono" style={{fontSize:12,color:T.green}}>OPPORTUNITY</span>
              </div>
            </div>
            {sectorRisk.map(s=>(
              <div key={s.sector} style={{marginBottom:10,padding:'8px 10px',background:T.bg2,borderRadius:0,borderLeft:`3px solid ${s.col}`}}>
                <div style={{fontSize:12,color:T.text1,marginBottom:6}}>{s.sector}</div>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <span className="mono" style={{fontSize:12,color:T.text3,width:50}}>Risk</span>
                  <div style={{flex:1,background:T.bg3,height:4,borderRadius:0}}>
                    <div style={{background:T.red,height:4,width:`${s.risk*10}%`,borderRadius:0,opacity:0.7}}/>
                  </div>
                  <span className="mono" style={{fontSize:12,color:T.red,width:20}}>{s.risk}</span>
                </div>
                <div style={{display:'flex',gap:8,alignItems:'center',marginTop:4}}>
                  <span className="mono" style={{fontSize:12,color:T.text3,width:50}}>Opp.</span>
                  <div style={{flex:1,background:T.bg3,height:4,borderRadius:0}}>
                    <div style={{background:T.green,height:4,width:`${s.opportunity*10}%`,borderRadius:0,opacity:0.7}}/>
                  </div>
                  <span className="mono" style={{fontSize:12,color:T.green,width:20}}>{s.opportunity}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:0,padding:20}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text0,marginBottom:12}}>
                NI-Specific Risk Factors
              </div>
              {[
                {title:'Financial services concentration',col:T.red,text:'Belfast has disproportionate employment in financial services back-office (Citi, Danske, Ulster Bank). These roles — data processing, compliance, customer operations — are among the highest automation-risk categories globally.'},
                {title:'Large administrative workforce',col:T.amber,text:'NI\'s public sector (30%+ of employment, highest in UK) contains a high proportion of administrative roles. The UK Civil Service AI study (Dec 2025) found significant AI exposure across government administrative tasks.'},
                {title:'Agri-food opportunity',col:T.green,text:'NI\'s agri-food sector has genuine comparative advantage in AI adoption — precision agriculture, supply chain AI, food safety automation. Cross-border supply chains create natural deployment contexts that are underexplored.'},
                {title:'Transition pain is real',col:T.amber,text:'NorthStar Briefing (Dec 2025): NI will not be immune to AI-related job losses. The US Congressional report cited 54,000+ AI-related job losses in 2025. NI\'s service-heavy economy and low productivity base make it more exposed than higher-productivity regions.'},
              ].map(s=>(
                <div key={s.title} style={{borderLeft:`3px solid ${s.col}`,padding:'8px 12px',background:T.bg2,marginBottom:8,borderRadius:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.text0,marginBottom:3}}>{s.title}</div>
                  <div style={{fontSize:12,color:T.text2,lineHeight:1.55}}>{s.text}</div>
                </div>
              ))}
            </div>
            <Insight type="warning" text="NI has a service-heavy economy, a large administrative workforce, and relatively low productivity. AI will be a net gain over time, but the transition will not be painless. Without an independent body producing regular assessments of AI adoption, workforce impact, and displacement patterns — as recommended by NorthStar Briefing — NI risks being reactive rather than strategic." />
          </div>
        </div>
      )}

      {view==='adoption'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:0,padding:20}}>
            <div style={{fontSize:14,fontWeight:700,color:T.text0,marginBottom:4}}>
              NI vs Ireland — AI Adoption Comparison
            </div>
            <div className="mono" style={{fontSize:12,color:T.text3,marginBottom:14}}>
              AICC CENSUS 2026 (SEP 2026) vs TRINITY/MICROSOFT AI ECONOMY IRELAND 2026 (APR 2026)
            </div>
            <div style={{background:'rgba(140,47,38,.06)',border:'1px solid rgba(140,47,38,.28)',borderRadius:0,padding:'10px 12px',marginBottom:14,fontSize:12,color:T.risk}}>
              <span className="mono" style={{fontSize:12,letterSpacing:'0.08em',color:T.red,display:'block',marginBottom:4}}>⚠ COMPARISON LIMITATION</span>
              Direct NI-Ireland comparison is not straightforward. The AICC Census measures AI-active firms (supply-side). The Trinity/Microsoft survey measures AI adoption intention across organisations (demand-side). These are different methodologies measuring different things. The gap is directionally real but not precisely measurable.
            </div>
            {adoptionComparison.map((r,i)=>(
              <div key={i} style={{padding:'10px 0',borderBottom:`1px solid ${T.border}`}}>
                <div style={{fontSize:12,color:T.text1,marginBottom:6,fontWeight:600}}>{r.metric}</div>
                <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:4}}>
                  {r.NI!==null&&<div><span className="mono" style={{fontSize:12,color:T.text3}}>NI: </span><span className="mono" style={{fontSize:14,color:T.amber,fontWeight:700}}>{r.NI}{r.metric.includes('%')||r.metric.includes('(%)')?'':''}</span></div>}
                  {r.Ireland!==null&&<div><span className="mono" style={{fontSize:12,color:T.text3}}>Ireland: </span><span className="mono" style={{fontSize:14,color:T.teal,fontWeight:700}}>{r.Ireland}%</span></div>}
                  {r.UK!==null&&<div><span className="mono" style={{fontSize:12,color:T.text3}}>UK: </span><span className="mono" style={{fontSize:14,color:T.blue,fontWeight:700}}>{r.UK}%</span></div>}
                </div>
                <div className="mono" style={{fontSize:12,color:T.text3}}>{r.note}</div>
              </div>
            ))}
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:0,padding:20}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text0,marginBottom:12}}>
                The SME Adoption Gap
              </div>
              <TheoryTag tag="diffusion"/>
              <p style={{fontSize:14,color:T.text2,lineHeight:1.65,marginTop:12,marginBottom:12}}>
                The Trinity/Microsoft AI Economy Ireland 2026 report (April 2026) finds a widening
                maturity gap between large organisations and SMEs. AI adoption is near-universal
                at 92% across Irish organisations — but just 10% describe their deployment as
                advanced or frontier-level.
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {[
                  {metric:'Large firms: weekly 2hr+ time savings',value:'54%',col:T.green},
                  {metric:'SMEs: weekly 2hr+ time savings',value:'25%',col:T.amber},
                  {metric:'Large firms: no formal AI training',value:'6%',col:T.green},
                  {metric:'SMEs: no formal AI training',value:'15%',col:T.red},
                  {metric:'SMEs reporting significant productivity gains',value:'18%',col:T.teal},
                  {metric:'Large firms reporting significant gains',value:'8%',col:T.blue},
                ].map(r=>(
                  <div key={r.metric} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${T.border}`}}>
                    <span style={{fontSize:12,color:T.text2}}>{r.metric}</span>
                    <span className="mono" style={{fontSize:14,color:r.col,fontWeight:700}}>{r.value}</span>
                  </div>
                ))}
              </div>
              <p style={{fontSize:12,color:T.text3,marginTop:10,lineHeight:1.5}}>
                Source: Trinity College Dublin / Microsoft Ireland, AI Economy Ireland 2026, April 2026.
                Survey of 250 organisations, Dec 2025–Jan 2026.
              </p>
            </div>

            <Insight type="opportunity" text="SMEs that invest in AI are more likely to report significant productivity gains than large organisations (18% vs 8%). NI's 83,900 SME base — predominantly micro and small businesses — represents the greatest untapped AI productivity opportunity. The constraint is not the technology; it is adoption support, digital literacy, and the absence of a diffusion-focused enterprise policy." />
            <Insight type="insight" text="The most important AI policy question for NI is not 'how do we build more AI companies' but 'how do we get existing firms to adopt proven AI tools'. This maps directly to the diffusion vs invention critique in the Productivity module — and suggests the Singapore Productivity Solutions Grant model is more relevant to NI's economic structure than the current innovation cluster approach." />
          </div>
        </div>
      )}
    </div>
  )
}
