'use client'
import { useState } from 'react'
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  ComposedChart, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import TheoryTag from '@/components/TheoryTag'

const T = {
  bg0:'#07090d',bg1:'#0d1117',bg2:'#131920',bg3:'#192230',
  card:'#0f1620',border:'#1e2d3d',border2:'#243444',
  text0:'#eef2f7',text1:'#b8c8d8',text2:'#6a88a0',text3:'#3a5268',
  gold:'#e8a020',teal:'#12c4a4',blue:'#3a8fd4',red:'#e05050',
  green:'#38c070',amber:'#e89020',purple:'#9a70d4',
}

const vcInvestment = [
  {y:'2018',NI:28,ROI:420},{y:'2019',NI:35,ROI:680},
  {y:'2020',NI:42,ROI:520},{y:'2021',NI:98,ROI:1100},
  {y:'2022',NI:112,ROI:940},{y:'2023',NI:143,ROI:740},
  {y:'2024',NI:156,ROI:608},{y:'2025F',NI:170,ROI:750,forecast:true},
]

const startupEcosystem = [
  {stage:'Pre-seed',count:180,avgDeal:0.12,support:'Invest NI, Techstart NI'},
  {stage:'Seed',count:85,avgDeal:0.45,support:'IFNI, Kernel Capital, Techstart'},
  {stage:'Series A',count:22,avgDeal:2.8,support:'IFNI, Octopus Ventures, BGF'},
  {stage:'Series B+',count:6,avgDeal:12.0,support:'International VCs, BGF'},
  {stage:'Growth/IPO',count:2,avgDeal:45.0,support:'International markets'},
]

const survivalRates = [
  {y:'Year 1',rate:89},{y:'Year 2',rate:74},{y:'Year 3',rate:61},
  {y:'Year 4',rate:51},{y:'Year 5',rate:42},{y:'Year 7',rate:31},
  {y:'Year 10',rate:22},
]

const sectorBreakdown = [
  {sector:'Fintech / Financial Services',firms:38,funded:12,col:T.teal},
  {sector:'Health & Life Sciences',firms:31,funded:18,col:T.green},
  {sector:'ICT / Software',firms:62,funded:22,col:T.blue},
  {sector:'Advanced Manufacturing',firms:24,funded:8,col:T.amber},
  {sector:'Agri-Food Tech',firms:19,funded:6,col:T.purple},
  {sector:'CleanTech / Energy',firms:15,funded:4,col:T.teal},
  {sector:'Creative & Digital',firms:28,funded:3,col:T.gold},
]

const ecosystemPlayers = [
  {
    name:'Invest Northern Ireland',
    type:'Government Agency',
    role:'Financial assistance, export support, R&D grants, FDI attraction',
    budget:'~£120m/yr',
    col:T.blue,
  },
  {
    name:'Investment Fund for NI (IFNI)',
    type:'Public Fund of Funds',
    role:'Debt and equity finance for SMEs. Cornerstone investor in NI VC ecosystem.',
    budget:'£70m+ deployed 2022-25',
    col:T.teal,
  },
  {
    name:'Techstart NI',
    type:'Seed Fund',
    role:'£25k–£150k investments in early-stage tech startups. QUB/UU spinouts.',
    budget:'~£8m fund',
    col:T.green,
  },
  {
    name:'Catalyst',
    type:'Innovation Ecosystem',
    role:'NI Science Park and Titanic Quarter hub. 100+ companies, 3,500+ jobs. Programmes: Propel, LaunchPad, NIIC.',
    budget:'Self-sustaining + grant income',
    col:T.gold,
  },
  {
    name:'Ormeau Baths / Flint Studios',
    type:'Scale-Up Hub',
    role:'Home to Belfast\'s fastest-growing tech companies. Huckletree partnership.',
    budget:'Private',
    col:T.purple,
  },
  {
    name:'Raise Ventures',
    type:'Accelerator',
    role:'Founder-focused accelerator. Pathway to Growth Spring 2025: 15 NI startups.',
    budget:'Programme-funded',
    col:T.amber,
  },
  {
    name:'Kernel Capital',
    type:'VC Fund',
    role:'Early-stage NI and ROI tech. IFNI-backed. Focus: software, medtech, agri-tech.',
    budget:'Multi-fund · €100m+ total',
    col:T.red,
  },
  {
    name:'Queen\'s University Belfast',
    type:'Research & Spinout',
    role:'QUBIS spinout company builder. CSIT cybersecurity. ECIT AI. Key FDI pipeline.',
    budget:'~£100m research income/yr',
    col:T.teal,
  },
]

const niVsRoiComparison = [
  {metric:'VC investment 2024 (£m)',NI:156,ROI:520,gap:'ROI 3.3x larger'},
  {metric:'Unicorns',NI:0,ROI:12,gap:'NI has none'},
  {metric:'Startup survival rate (5yr %)',NI:42,ROI:44,gap:'Broadly similar'},
  {metric:'Series A deals 2024',NI:22,ROI:180,gap:'ROI 8x more'},
  {metric:'Govt startup support (£m equiv)',NI:120,ROI:580,gap:'Enterprise Ireland scale'},
  {metric:'Accelerator programmes',NI:8,ROI:35,gap:'Ecosystem depth gap'},
]

const Tip = ({active,payload,label}:any) => {
  if(!active||!payload?.length) return null
  return (
    <div style={{background:T.bg2,border:`1px solid ${T.border2}`,padding:'10px 14px',borderRadius:4,fontSize:11,fontFamily:'monospace'}}>
      <div style={{color:T.text0,fontWeight:700,marginBottom:6}}>{label}</div>
      {payload.map((p:any,i:number)=>(
        <div key={i} style={{color:p.color||T.text1,marginBottom:2}}>
          {p.name}: <strong>{typeof p.value==='number'?p.value.toLocaleString():p.value}</strong>
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

export default function EntrepreneurshipPage() {
  const [view, setView] = useState<'ecosystem'|'funding'|'sectors'|'niroi'>('ecosystem')

  return (
    <div style={{maxWidth:1100}} className="page-enter">
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 13 · ENTREPRENEURSHIP & INVESTMENT
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Entrepreneurship & Investment
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:14}}>
          NI's startup and investment ecosystem has grown significantly since 2018 but
          remains structurally underdeveloped relative to its ROI neighbour. VC investment
          reached an estimated £156m in 2024. The Series A-to-B pipeline is thin.
          No NI company has achieved unicorn status. This module tracks the ecosystem,
          funding flows, sector strengths and the NI-ROI gap.
        </p>
        <div style={{
          background:'#1a0808',border:'1px solid #3a1010',
          borderRadius:4,padding:'10px 14px',marginBottom:14,
          fontSize:11,color:'#c06060'
        }}>
          <span className="mono" style={{fontSize:9,letterSpacing:2,color:T.red,marginRight:8}}>
            ⚠ DATA GAP
          </span>
          No single published source consolidates NI venture capital and startup investment data.
          Figures are compiled from IFNI annual reports, Invest NI publications, Beauhurst NI data,
          and NorthStar Briefing analysis. ROI figures from Invest Europe / IVCA.
          All NI VC figures should be treated as estimates.
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:24}}>
        <KPI label="VC Investment 2024 (est.)" value="£156" unit="m" sub="NI total · all stages" delta="+9% YoY · record" color={T.teal}/>
        <KPI label="VC Investment 2023 (NorthStar)" value="£143" unit="m" sub="NorthStar Briefing Dec 2025" delta="Record at time of publication" color={T.teal}/>
        <KPI label="Active Startups (est.)" value="~350" sub="Pre-seed to Series A stage" delta="IFNI, Catalyst, Techstart portfolio" color={T.blue}/>
        <KPI label="Series A Deals 2024" value="~22" sub="Estimated · Beauhurst / IFNI" delta="Thin pipeline vs ROI (180+)" deltaPos={false} color={T.amber}/>
        <KPI label="NI Unicorns" value="0" sub="No NI company at $1bn+ valuation" delta="ROI has 12 unicorns" deltaPos={false} color={T.red}/>
        <KPI label="Catalyst Companies" value="100+" sub="NI Science Park + Titanic Quarter" delta="3,500+ jobs · growing" color={T.green}/>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        {(['ecosystem','funding','sectors','niroi'] as const).map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{
            background:view===v?`${T.teal}18`:'transparent',
            color:view===v?T.teal:T.text2,
            border:'none',borderBottom:`2px solid ${view===v?T.teal:'transparent'}`,
            padding:'8px 20px',cursor:'pointer',
            fontSize:11,fontFamily:'monospace',letterSpacing:1,
            textTransform:'uppercase',transition:'all 0.12s',
          }}>
            {v==='ecosystem'?'Ecosystem':v==='funding'?'Funding Pipeline':v==='sectors'?'Sectors':'NI vs ROI'}
          </button>
        ))}
      </div>

      {view==='ecosystem'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {ecosystemPlayers.map(p=>(
              <div key={p.name} style={{
                background:T.card,border:`1px solid ${T.border}`,
                borderLeft:`3px solid ${p.col}`,
                borderRadius:'0 6px 6px 0',padding:'12px 16px',
              }}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.text0}}>{p.name}</div>
                  <span className="mono" style={{
                    fontSize:9,color:p.col,
                    background:`${p.col}18`,border:`1px solid ${p.col}33`,
                    padding:'1px 6px',borderRadius:2,
                  }}>{p.type}</span>
                </div>
                <div style={{fontSize:11,color:T.text2,lineHeight:1.5,marginBottom:4}}>{p.role}</div>
                <div className="mono" style={{fontSize:9,color:T.text3}}>Budget: {p.budget}</div>
              </div>
            ))}
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <ChartCard title="Startup Survival Rate (%)" subtitle="NI ESTIMATE · IDBR COHORT ANALYSIS · YEARS SINCE FOUNDING">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={survivalRates}>
                  <defs>
                    <linearGradient id="survG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.teal} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={T.teal} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                  <YAxis domain={[0,100]} tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<Tip/>}/>
                  <ReferenceLine y={50} stroke={T.text3} strokeDasharray="3 3"/>
                  <Area type="monotone" dataKey="rate" stroke={T.teal} fill="url(#survG)" strokeWidth={2} name="Survival Rate %"/>
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                Key Structural Gaps
              </div>
              {[
                {gap:'Series B pipeline',col:T.red,text:'Only ~6 Series B+ deals in NI in 2024. Companies that achieve Series A struggle to raise Series B domestically — most must go to London or international VCs, increasing the risk of HQ relocation.'},
                {gap:'No anchor VC fund',col:T.amber,text:'ROI has Act VC, Atlantic Bridge, Elkstone — funds of €100m+ with dedicated NI/Ireland mandates. IFNI is a fund-of-funds, not a direct investor at scale. NI lacks an anchor domestic VC with the firepower to lead Series B rounds.'},
                {gap:'Brain drain',col:T.amber,text:'QUB and Ulster University produce strong STEM graduates but a significant proportion migrate to Dublin, London or the US. The ecosystem does not have sufficient high-growth companies to absorb talent locally.'},
                {gap:'Corporate venture gap',col:T.blue,text:'Large NI employers (Citi, Allstate, Deloitte, EY) do not operate corporate venture arms in NI. In ROI, corporate VC from Google, Microsoft and pharma companies is a major source of startup capital and talent development.'},
              ].map(s=>(
                <div key={s.gap} style={{borderLeft:`3px solid ${s.col}`,padding:'8px 12px',background:T.bg2,marginBottom:8,borderRadius:'0 4px 4px 0'}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text0,marginBottom:3}}>{s.gap}</div>
                  <div style={{fontSize:11,color:T.text2,lineHeight:1.55}}>{s.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view==='funding'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="VC Investment: NI vs ROI (£m equiv)" subtitle="ESTIMATED · IFNI / INVEST EUROPE / IVCA · 2018–2025F">
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={vcInvestment}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${v}m`}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="NI" fill={T.teal} opacity={0.8} name="NI (£m)"/>
                <Line type="monotone" dataKey="ROI" stroke={T.gold} strokeWidth={2} dot={false} name="ROI (£m equiv)" strokeDasharray="4 2"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:8}}>
              NOTE: NI figures are estimates. ROI figures from Invest Europe. Scale difference reflects both market size and ecosystem maturity.
            </div>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                Funding Pipeline by Stage
              </div>
              <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:12}}>
                NI ESTIMATE · 2024 · IFNI / CATALYST / TECHSTART / BEAUHURST
              </div>
              {startupEcosystem.map(s=>(
                <div key={s.stage} style={{padding:'10px 0',borderBottom:`1px solid ${T.border}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:12,color:T.text0,fontWeight:600}}>{s.stage}</span>
                    <span className="mono" style={{fontSize:11,color:T.teal}}>{s.count} companies</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:11,color:T.text3}}>Avg deal size</span>
                    <span className="mono" style={{fontSize:11,color:T.gold}}>£{s.avgDeal}m</span>
                  </div>
                  <div style={{fontSize:10,color:T.text3,lineHeight:1.4}}>{s.support}</div>
                </div>
              ))}
            </div>
            <Insight type="warning" text="The Series A-to-B gap is NI's most critical structural funding failure. Companies reaching Series A (~22 in 2024) face a domestic funding desert for their next round. Most viable NI companies at this stage either raise from London or international VCs — which typically requires relocating the HQ. This is a direct driver of the talent and value leakage from the NI ecosystem." />
          </div>
        </div>
      )}

      {view==='sectors'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Startup Activity by Sector" subtitle="NI ESTIMATE 2024 · ACTIVE FIRMS AND FUNDED FIRMS">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sectorBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} horizontal={false}/>
                <XAxis type="number" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis type="category" dataKey="sector" tick={{fontSize:9,fill:T.text1}} tickLine={false} width={160}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="firms" fill={T.blue} opacity={0.6} name="Active firms" radius={[0,2,2,0]}/>
                <Bar dataKey="funded" fill={T.teal} opacity={0.8} name="Funded firms" radius={[0,2,2,0]}/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                Sector Strengths & Emerging Opportunities
              </div>
              {[
                {sector:'Fintech',col:T.teal,strength:'Legacy of Citi, Allstate, CMC Markets creates deep talent pool. Cross-border financial flows (Windsor) create unique product opportunities. Transact Payments, Bleckmann, Omnio are notable scale-ups.',gap:'No Series B+ fintech in NI. Talent often migrates to London or Dublin.'},
                {sector:'Health & Life Sciences',col:T.green,strength:'Neurovalens (FDA-approved devices) is the standout. QUB medical research strong. CSIT health data security. NIHR Clinical Research Network provides trial infrastructure.',gap:'Regulatory pathway to FDA/EMA approval takes 8-12 years. Capital requirements exceed domestic VC capacity.'},
                {sector:'Agri-Food Tech',col:T.purple,strength:'NI\'s agri-food base (largest sector by trade) creates natural demand. Precision agriculture, supply chain AI, food safety automation. Cross-border supply chain = natural deployment environment.',gap:'Under-invested relative to sector size. No dedicated agri-food tech VC in NI. AFBI research not well-connected to startup ecosystem.'},
                {sector:'Cybersecurity',col:T.amber,strength:'CSIT at QUB is a globally recognised centre. Titanic Quarter cybersecurity cluster. GCHQ-linked research. US defence contractor interest in Belfast talent.',gap:'Government/defence contracts dominate — less consumer or SME-facing products. IP often retained by larger corporate partners.'},
              ].map(s=>(
                <div key={s.sector} style={{borderLeft:`3px solid ${s.col}`,padding:'10px 12px',background:T.bg2,marginBottom:8,borderRadius:'0 4px 4px 0'}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.text0,marginBottom:4}}>{s.sector}</div>
                  <div style={{fontSize:11,color:T.green,lineHeight:1.5,marginBottom:4}}>
                    <span style={{color:T.text3,fontFamily:'monospace',fontSize:9,marginRight:6}}>STRENGTH</span>
                    {s.strength}
                  </div>
                  <div style={{fontSize:11,color:T.amber,lineHeight:1.5}}>
                    <span style={{color:T.text3,fontFamily:'monospace',fontSize:9,marginRight:6}}>GAP</span>
                    {s.gap}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view==='niroi'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
              NI vs ROI — Startup Ecosystem Comparison
            </div>
            <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>
              ESTIMATES · 2024 · IFNI / INVEST EUROPE / ENTERPRISE IRELAND
            </div>
            {niVsRoiComparison.map((r,i)=>(
              <div key={i} style={{padding:'10px 0',borderBottom:`1px solid ${T.border}`}}>
                <div className="mono" style={{fontSize:9,color:T.text3,marginBottom:6}}>{r.metric.toUpperCase()}</div>
                <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:4}}>
                  <div style={{flex:1,background:T.bg2,borderRadius:4,padding:'6px 10px',textAlign:'center'}}>
                    <div className="mono" style={{fontSize:9,color:T.teal,marginBottom:2}}>NI</div>
                    <div style={{fontSize:14,fontWeight:700,color:T.text0}}>{r.NI.toLocaleString()}</div>
                  </div>
                  <div style={{flex:1,background:T.bg2,borderRadius:4,padding:'6px 10px',textAlign:'center'}}>
                    <div className="mono" style={{fontSize:9,color:T.gold,marginBottom:2}}>ROI</div>
                    <div style={{fontSize:14,fontWeight:700,color:T.text0}}>{r.ROI.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mono" style={{fontSize:9,color:T.amber}}>{r.gap}</div>
              </div>
            ))}
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                What ROI Did Differently — Policy Lessons
              </div>
              {[
                {lesson:'Enterprise Ireland scale',col:T.green,text:'Enterprise Ireland budget ~€580m/yr vs Invest NI ~£120m. Per-capita difference is even larger. EI provides dedicated startup equity, export development, and international office network. Invest NI is restructuring toward this model but is years behind in scale.'},
                {lesson:'R&D tax credit regime',col:T.teal,text:'ROI\'s 25% R&D tax credit (plus KDB for IP income) created structural incentive for multinational R&D location. This drove the FDI cluster that seeded the domestic startup ecosystem. NI operates under UK R&D tax credits (20-27%) with no special NI rate.'},
                {lesson:'University commercialisation',col:T.blue,text:'NovaUCD, TCD Innovations, and DCU Alpha have significantly more active commercialisation pipelines than QUB/UU equivalents. Not a reflection of research quality — a reflection of investment in tech transfer infrastructure.'},
                {lesson:'Diaspora capital',col:T.amber,text:'The Irish diaspora (particularly US-based) is a significant source of angel and VC capital for ROI startups. NI has a diaspora but no organised mechanism to connect it to the startup ecosystem. The all-Ireland network TechIreland partially bridges this.'},
                {lesson:'All-island opportunity',col:T.purple,text:'ROI startup ecosystem is all-island in practice — Dublin VCs invest in Belfast companies, NI founders participate in Enterprise Ireland programmes, and cross-border accelerators are growing. The Windsor Framework creates regulatory alignment that amplifies this.'},
              ].map(s=>(
                <div key={s.lesson} style={{borderLeft:`3px solid ${s.col}`,padding:'8px 12px',background:T.bg2,marginBottom:8,borderRadius:'0 4px 4px 0'}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text0,marginBottom:3}}>{s.lesson}</div>
                  <div style={{fontSize:11,color:T.text2,lineHeight:1.55}}>{s.text}</div>
                </div>
              ))}
            </div>

            <Insight type="opportunity" text="The all-island startup ecosystem is more integrated than any policy document acknowledges. Dublin VCs are increasingly looking at Belfast deal flow. NI founders are accessing Enterprise Ireland programmes. Catalyst's location strategy and the Windsor Framework's regulatory alignment create conditions for NI to position itself as a lower-cost, high-quality alternative to Dublin for startups that want EU market access. This requires a dedicated cross-border entrepreneurship strategy — which does not currently exist." />
          </div>
        </div>
      )}
    </div>
  )
}