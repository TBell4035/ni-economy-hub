'use client'
import { useState } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  ComposedChart, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea
} from 'recharts'
import TheoryTag from '@/components/TheoryTag'

const T = {
  bg0:'#07090d',bg1:'#0d1117',bg2:'#131920',bg3:'#192230',
  card:'#0f1620',border:'#1e2d3d',border2:'#243444',
  text0:'#eef2f7',text1:'#b8c8d8',text2:'#6a88a0',text3:'#3a5268',
  gold:'#e8a020',teal:'#12c4a4',blue:'#3a8fd4',red:'#e05050',
  green:'#38c070',amber:'#e89020',purple:'#9a70d4',
}

const labourAnnual = [
  {y:'2004',emp:66.8,unemp:5.2,inact:29.8},{y:'2006',emp:67.5,unemp:4.4,inact:29.2},
  {y:'2008',emp:68.0,unemp:4.6,inact:28.4},{y:'2010',emp:66.2,unemp:6.8,inact:28.4},
  {y:'2012',emp:66.4,unemp:7.2,inact:28.0},{y:'2014',emp:67.7,unemp:6.4,inact:27.6},
  {y:'2016',emp:69.2,unemp:5.1,inact:27.0},{y:'2018',emp:71.0,unemp:3.4,inact:26.8},
  {y:'2019',emp:71.8,unemp:2.9,inact:26.5},{y:'2020',emp:69.5,unemp:3.1,inact:28.4},
  {y:'2021',emp:70.3,unemp:2.8,inact:27.8},{y:'2022',emp:71.2,unemp:2.4,inact:27.5},
  {y:'2023',emp:72.8,unemp:2.2,inact:26.1},{y:'2024',emp:74.0,unemp:1.8,inact:24.6},
  {y:'Q3 25',emp:71.4,unemp:2.4,inact:26.8},
]

const wages = [
  {m:'Jan 22',median:2050,mean:2480},{m:'Jul 22',median:2080,mean:2510},
  {m:'Jan 23',median:2100,mean:2530},{m:'Jul 23',median:2160,mean:2590},
  {m:'Jan 24',median:2210,mean:2640},{m:'Jul 24',median:2261,mean:2701},
  {m:'Jan 25',median:2320,mean:2750},{m:'Aug 25',median:2371,mean:2790},
  {m:'Oct 25',median:2411,mean:2830},
  {m:'Mar 26F',median:2460,mean:2870,forecast:true},
  {m:'Aug 26F',median:2510,mean:2920,forecast:true},
]

const paye = [
  {m:'Jan 20',v:732},{m:'Jul 20',v:700},{m:'Jan 21',v:712},{m:'Jul 21',v:738},
  {m:'Jan 22',v:762},{m:'Jul 22',v:778},{m:'Jan 23',v:786},{m:'Jul 23',v:796},
  {m:'Jan 24',v:803},{m:'Jul 24',v:810},{m:'Jan 25',v:812},{m:'Oct 25',v:815},
]

const inactivityReasons = [
  {reason:'Long-term sick / disabled',pct:43.2},
  {reason:'Looking after family',pct:22.1},
  {reason:'Student',pct:19.4},
  {reason:'Discouraged worker',pct:6.8},
  {reason:'Retired early',pct:5.1},
  {reason:'Other',pct:3.4},
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

export default function LabourPage() {
  const [view, setView] = useState<'rates'|'wages'|'inactivity'>('rates')

  return (
    <div style={{maxWidth:1100}} className="page-enter">
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 03 · LABOUR MARKET
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Labour Market
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:14}}>
          Employment, wages, inactivity and labour supply. Primary sources: NISRA Economic
          and Labour Market Statistics (ELMS), published monthly by DfE — most recent release
          November 2025 (Jul–Sep 2025 LFS data). HMRC PAYE RTI provides more timely monthly
          payroll data but excludes self-employed. LFS is the official ILO-standard measure.
        </p>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <TheoryTag tag="hysteresis"/>
          <TheoryTag tag="lse"/>
          <TheoryTag tag="keynes"/>
        </div>
      </div>

      <div style={{
        background:'#0e1a10',border:'1px solid #1e3a20',
        borderRadius:4,padding:'10px 14px',marginBottom:20,
        fontSize:11,color:'#70b880'
      }}>
        <span className="mono" style={{letterSpacing:1,fontSize:9,color:'#38c070',marginRight:8}}>
          ↻ LATEST DATA
        </span>
        ELMS November 2025 (published 11 Nov 2025): Employment rate 71.4% (Q3 2025), down 0.7pp
        year-on-year. Inactivity rising to 26.8%. Median monthly pay £2,411 in Oct 2025 (+5.7% YoY).
        Claimant count 37,700.
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:24}}>
        <KPI label="Employment Rate Q3 2025" value="71.4" unit="%" sub="LFS Jul–Sep 2025 · ELMS Nov 25" delta="-0.7pp over year" deltaPos={false} color={T.amber}/>
        <KPI label="Unemployment Rate Q3 2025" value="2.4" unit="%" sub="LFS · claimant count 37,700" delta="+0.7pp over year" deltaPos={false} color={T.amber}/>
        <KPI label="Economic Inactivity Q3 2025" value="26.8" unit="%" sub="LFS · +6pp above UK avg" delta="Structural — health-driven" deltaPos={false} color={T.red}/>
        <KPI label="PAYE Employees Oct 2025" value="815,000" sub="HMRC RTI · +1.0% over year" delta="+0.1% over month" color={T.teal}/>
        <KPI label="Median Pay Oct 2025" value="£2,411" unit="/mo" sub="HMRC RTI · nominal" delta="+5.7% YoY · real terms positive" color={T.green}/>
        <KPI label="Peak Employment 2024" value="74.0" unit="%" sub="Annual LFS 2024 · historic high" delta="Now cooling to 71.4%" deltaPos={false} color={T.gold}/>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        {(['rates','wages','inactivity'] as const).map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{
            background:view===v?`${T.teal}18`:'transparent',
            color:view===v?T.teal:T.text2,
            border:'none',borderBottom:`2px solid ${view===v?T.teal:'transparent'}`,
            padding:'8px 20px',cursor:'pointer',
            fontSize:11,fontFamily:'monospace',letterSpacing:1,
            textTransform:'uppercase',transition:'all 0.12s',
          }}>
            {v==='rates'?'Employment Rates':v==='wages'?'Wages':'Inactivity'}
          </button>
        ))}
      </div>

      {view==='rates'&&(
        <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:16}}>
          <ChartCard title="Employment, Unemployment & Inactivity Rates (%)" subtitle="LFS ANNUAL 2004–Q3 2025 · NISRA / DFE ELMS">
            <div style={{display:'flex',gap:6,marginBottom:10}}>
              <TheoryTag tag="hysteresis"/>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={labourAnnual}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} interval={2}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceArea x1="2008" x2="2013" fill="#1a0a00" opacity={0.4}/>
                <ReferenceArea x1="2020" x2="2021" fill="#1a0000" opacity={0.4}/>
                <Line type="monotone" dataKey="emp" stroke={T.green} strokeWidth={2} dot={false} name="Employment Rate"/>
                <Line type="monotone" dataKey="inact" stroke={T.amber} strokeWidth={2} dot={false} name="Inactivity Rate"/>
                <Line type="monotone" dataKey="unemp" stroke={T.red} strokeWidth={1.5} dot={false} name="Unemployment Rate"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </LineChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:8}}>
              Shaded areas: Global Financial Crisis (2008–13) and COVID-19 (2020–21)
            </div>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <ChartCard title="PAYE Employees (000s)" subtitle="HMRC RTI MONTHLY · 2020–2025">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={paye}>
                  <defs>
                    <linearGradient id="payeG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.blue} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={T.blue} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="m" tick={{fontSize:8,fill:T.text3,fontFamily:'monospace'}} tickLine={false} interval={3}/>
                  <YAxis domain={[680,830]} tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                  <Tooltip content={<Tip/>}/>
                  <Area type="monotone" dataKey="v" stroke={T.blue} fill="url(#payeG)" strokeWidth={2} name="PAYE Employees (000s)"/>
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:16}}>
              <div className="mono" style={{fontSize:9,letterSpacing:2,color:T.text3,marginBottom:10}}>
                PAYE RTI vs LFS — KEY DISTINCTION
              </div>
              <p style={{fontSize:12,color:T.text2,lineHeight:1.65}}>
                LFS (survey) measures 16–64 participation including self-employed.
                PAYE RTI (administrative) measures payrolled employees only — more
                timely but subject to revision. Self-employed in NI are approximately
                8% of employment, significant in agriculture and construction.
                Always check which measure is being cited.
              </p>
            </div>

            <Insight type="warning" text="The employment rate fell 2.6pp from its 2024 annual peak of 74.0% to 71.4% in Q3 2025. This cooling is faster than expected and warrants monitoring. It may reflect the post-construction-boom labour market adjustment or early signs of broader economic softening." />
          </div>
        </div>
      )}

      {view==='wages'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Median & Mean Monthly Pay (£, nominal)" subtitle="HMRC PAYE RTI · 2022–2026F · STATISTICS IN DEVELOPMENT">
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={wages}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="m" tick={{fontSize:8,fill:T.text3,fontFamily:'monospace'}} tickLine={false} interval={2}/>
                <YAxis domain={[2000,3000]} tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${v}`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceArea x1="Mar 26F" x2="Aug 26F" fill={T.bg3} opacity={0.6}/>
                <Line type="monotone" dataKey="median" stroke={T.teal} strokeWidth={2} dot={false} name="Median (£)"/>
                <Line type="monotone" dataKey="mean" stroke={T.gold} strokeWidth={1.5} dot={false} name="Mean (£)" strokeDasharray="3 2"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
                NI vs UK Wage Comparison
              </div>
              <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>
                OCTOBER 2025 · HMRC PAYE RTI
              </div>
              {[
                {label:'NI Median Monthly Pay',value:'£2,411',color:T.teal},
                {label:'UK Median Monthly Pay',value:'£2,700+',color:T.blue},
                {label:'NI as % of UK',value:'~89%',color:T.amber},
                {label:'NI YoY growth',value:'+5.7%',color:T.green},
                {label:'UK CPI Jul 2025',value:'3.5%',color:T.red},
                {label:'Real wage position',value:'Positive',color:T.green},
              ].map(r=>(
                <div key={r.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:12,color:T.text2}}>{r.label}</span>
                  <span className="mono" style={{fontSize:12,color:r.color,fontWeight:700}}>{r.value}</span>
                </div>
              ))}
            </div>

            <Insight type="insight" text="Median pay grew 5.7% YoY to October 2025 — now above CPI (3.5% in July 2025) for the first time since 2021. NI workers are experiencing modest real wage gains. However the NI-UK wage gap persists at approximately 11%, reflecting the structural public sector wage anchor and lower private sector productivity." />
            <Insight type="weak" text="PAYE RTI wage data is classified as 'statistics in development' by NISRA — subject to revision. The figures exclude self-employed income, which in NI's agricultural and construction sectors can be substantial. These are the best available monthly wage indicators but should be treated with appropriate caution." />
          </div>
        </div>
      )}

      {view==='inactivity'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Economic Inactivity Reasons (2024)" subtitle="LFS · % OF ECONOMICALLY INACTIVE 16–64 · NISRA">
            <TheoryTag tag="hysteresis"/>
            <div style={{paddingTop:12}}>
              {inactivityReasons.map(d=>(
                <div key={d.reason} style={{marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
                    <span style={{color:T.text1}}>{d.reason}</span>
                    <span className="mono" style={{color:T.text3,fontSize:11}}>{d.pct}%</span>
                  </div>
                  <div style={{background:T.bg3,height:6,borderRadius:3}}>
                    <div style={{
                      background:d.reason.includes('sick')?T.red:T.teal,
                      height:6,width:`${d.pct}%`,borderRadius:3
                    }}/>
                  </div>
                </div>
              ))}
              <div className="mono" style={{fontSize:9,color:T.text3,marginTop:12}}>
                Long-term sick is primary driver — direct link to NHS waiting list crisis
              </div>
            </div>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
                The Health–Inactivity–Productivity Link
              </div>
              <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:12}}>
                STRUCTURAL ANALYSIS · CROSS-MODULE REFERENCE
              </div>
              <TheoryTag tag="hysteresis"/>
              <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:10}}>
                {[
                  {step:'01',text:'NHS waiting lists: 430,000 people (record high, longest in UK)',col:T.red},
                  {step:'02',text:'Long-term sickness: 43% of all economically inactive — primary driver',col:T.amber},
                  {step:'03',text:'~50,000 more inactive than at UK average rates',col:T.amber},
                  {step:'04',text:'Estimated foregone output: ~£900m/year (NERI estimate)',col:T.gold},
                  {step:'05',text:'Health consumes 51% of NI Executive budget — yet waiting lists grow',col:T.red},
                  {step:'06',text:'Policy implication: demand-side stimulus alone cannot resolve this',col:T.teal},
                ].map(s=>(
                  <div key={s.step} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                    <span className="mono" style={{fontSize:10,color:s.col,flexShrink:0,marginTop:2}}>{s.step}</span>
                    <span style={{fontSize:12,color:T.text2,lineHeight:1.5}}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <Insight type="warning" text="Economic inactivity at 26.8% is 6 percentage points above the UK average — representing approximately 50,000 more people out of work than would be expected at UK rates. 43% cite long-term sickness. This is simultaneously a welfare failure and an economic cost. No labour market policy can resolve it without NHS reform — which is a 5–10 year structural issue, not a cyclical one." />
            <Insight type="explain" text="NI has the worst economic inactivity rate of any UK region. Scotland is 22.7%, England 20.6%, Wales 24.4%. The NI figure is structurally embedded — it has barely changed in 20 years despite significant employment rate improvements. The long-term sick pathway under Universal Credit reinforces inactivity rather than supporting return to work." />
          </div>
        </div>
      )}
    </div>
  )
}