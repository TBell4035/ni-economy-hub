'use client'
import { useState } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  ComposedChart, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea
} from 'recharts'
import TheoryTag from '@/components/TheoryTag'
import { T } from '@/lib/tokens'


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

export default function LabourPage() {
  const [view, setView] = useState<'rates'|'wages'|'inactivity'>('rates')

  return (
    <div style={{maxWidth:1100}}>
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:12,letterSpacing:'0.12em',color:T.teal,marginBottom:6}}>
          MODULE 03 · LABOUR MARKET
        </div>
        <h1 style={{fontFamily:'var(--font-display)',lineHeight:1.1,fontSize:40,fontWeight:400,color:T.text0,marginBottom:10,letterSpacing:-0.4}}>
          Labour Market
        </h1>
        <p style={{fontSize:14,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:14}}>
          Employment, wages, inactivity and labour supply. Primary sources: NISRA Labour
          Market Report, published monthly by DfE — most recent release September 2026
          (May–Jul 2026 LFS data; HMRC payroll and claimant data to August 2026). HMRC PAYE RTI
          provides more timely monthly payroll data but excludes self-employed. LFS is the
          official ILO-standard measure.
        </p>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <TheoryTag tag="hysteresis"/>
          <TheoryTag tag="lse"/>
          <TheoryTag tag="keynes"/>
        </div>
      </div>

      <div style={{
        background:'rgba(47,93,58,.07)',border:'1px solid rgba(47,93,58,.28)',
        borderRadius:0,padding:'10px 14px',marginBottom:20,
        fontSize:12,color:T.text1
      }}>
        <span className="mono" style={{letterSpacing:'0.04em',fontSize:12,color:T.opportunity,marginRight:8}}>
          ↻ LATEST DATA
        </span>
        NISRA Labour Market Report September 2026 (published 15 Sep 2026): Employment rate 72.2%
        (May–Jul 2026). Unemployment 2.4%, up 0.6pp on the quarter — the only statistically significant change. Inactivity 26.0%.
        Payrolled employees 819,200 and median monthly pay £2,509 (August 2026 flash estimate, +5.6% YoY).
        Claimant count 33,400. Next release 20 October 2026. NISRA flags a divergence: HMRC payroll shows employment rising
        over the year while the LFS shows no statistically significant change.
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:24}}>
        <KPI label="Employment Rate (May–Jul 26)" value="72.2" unit="%" sub="LFS · NISRA Sep 2026" delta="+0.2pp over quarter" color={T.teal}/>
        <KPI label="Unemployment Rate (May–Jul 26)" value="2.4" unit="%" sub="LFS · NISRA Sep 2026" delta="+0.6pp over quarter · significant" deltaPos={false} color={T.red}/>
        <KPI label="Economic Inactivity (May–Jul 26)" value="26.0" unit="%" sub="LFS · +6pp above UK avg" delta="Structural — health-driven" deltaPos={false} color={T.red}/>
        <KPI label="Payrolled Employees Aug 2026" value="819,200" sub="HMRC RTI flash · +0.8% over year" delta="Employment rising on payroll data" color={T.teal}/>
        <KPI label="Median Pay Aug 2026" value="£2,509" unit="/mo" sub="HMRC RTI flash · nominal" delta="+5.6% YoY (nominal)" color={T.green}/>
        <KPI label="Claimant Count Aug 2026" value="33,400" sub="3.3% of workforce" delta="+1.4% on month · 11.8% above Mar 2020" color={T.teal}/>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        {(['rates','wages','inactivity'] as const).map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{
            background:view===v?`${T.teal}18`:'transparent',
            color:view===v?T.teal:T.text2,
            border:'none',borderBottom:`2px solid ${view===v?T.teal:'transparent'}`,
            padding:'8px 20px',cursor:'pointer',
            fontSize:12,fontFamily:'var(--font-mono)',letterSpacing:'0.04em',
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
                <XAxis dataKey="y" tick={{fontSize:12,fill:T.text3,fontFamily:'var(--font-mono)'}} tickLine={false} interval={2}/>
                <YAxis tick={{fontSize:12,fill:T.text3,fontFamily:'var(--font-mono)'}} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceArea x1="2008" x2="2013" fill="#EAE5DA" opacity={0.7}/>
                <ReferenceArea x1="2020" x2="2021" fill="#EAE5DA" opacity={0.7}/>
                <Line isAnimationActive={false} type="monotone" dataKey="emp" stroke={T.green} strokeWidth={2} dot={false} name="Employment Rate"/>
                <Line isAnimationActive={false} type="monotone" dataKey="inact" stroke={T.amber} strokeWidth={2} dot={false} name="Inactivity Rate"/>
                <Line isAnimationActive={false} type="monotone" dataKey="unemp" stroke={T.red} strokeWidth={1.5} dot={false} name="Unemployment Rate"/>
                <Legend wrapperStyle={{fontSize:12,fontFamily:'var(--font-mono)'}}/>
              </LineChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:12,color:T.text3,marginTop:8}}>
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
                  <XAxis dataKey="m" tick={{fontSize:12,fill:T.text3,fontFamily:'var(--font-mono)'}} tickLine={false} interval={3}/>
                  <YAxis domain={[680,830]} tick={{fontSize:12,fill:T.text3,fontFamily:'var(--font-mono)'}} tickLine={false}/>
                  <Tooltip content={<Tip/>}/>
                  <Area isAnimationActive={false} type="monotone" dataKey="v" stroke={T.blue} fill="url(#payeG)" strokeWidth={2} name="PAYE Employees (000s)"/>
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:0,padding:16}}>
              <div className="mono" style={{fontSize:12,letterSpacing:'0.08em',color:T.text3,marginBottom:10}}>
                PAYE RTI vs LFS — KEY DISTINCTION
              </div>
              <p style={{fontSize:14,color:T.text2,lineHeight:1.65}}>
                LFS (survey) measures 16–64 participation including self-employed.
                PAYE RTI (administrative) measures payrolled employees only — more
                timely but subject to revision. Self-employed in NI are approximately
                8% of employment, significant in agriculture and construction.
                Always check which measure is being cited.
              </p>
            </div>

            <Insight type="insight" text="The headline story in the September 2026 release is a divergence between data sources, which NISRA itself flags. HMRC payroll data shows employment rising over the year (payrolled employees +0.8%), while the Labour Force Survey shows no statistically significant change in employment, unemployment or inactivity over the year. The one significant move is unemployment rising 0.6pp over the quarter to 2.4% — worth watching, though still low by historical standards. The claimant count is broadly flat at 33,400. The 2024 LFS employment-rate peak of 74.0% partly reflected a since-revised vintage; the payroll series is the more reliable guide to the direction of travel." />
          </div>
        </div>
      )}

      {view==='wages'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Median & Mean Monthly Pay (£, nominal)" subtitle="HMRC PAYE RTI · 2022–2026F · STATISTICS IN DEVELOPMENT">
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={wages}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="m" tick={{fontSize:12,fill:T.text3,fontFamily:'var(--font-mono)'}} tickLine={false} interval={2}/>
                <YAxis domain={[2000,3000]} tick={{fontSize:12,fill:T.text3,fontFamily:'var(--font-mono)'}} tickLine={false} tickFormatter={v=>`£${v}`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceArea x1="Mar 26F" x2="Aug 26F" fill={T.bg3} opacity={0.6}/>
                <Line isAnimationActive={false} type="monotone" dataKey="median" stroke={T.teal} strokeWidth={2} dot={false} name="Median (£)"/>
                <Line isAnimationActive={false} type="monotone" dataKey="mean" stroke={T.gold} strokeWidth={1.5} dot={false} name="Mean (£)" strokeDasharray="3 2"/>
                <Legend wrapperStyle={{fontSize:12,fontFamily:'var(--font-mono)'}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:0,padding:20}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text0,marginBottom:4}}>
                NI vs UK Wage Comparison
              </div>
              <div className="mono" style={{fontSize:12,color:T.text3,marginBottom:14}}>
                JUNE 2026 · HMRC PAYE RTI
              </div>
              {[
                {label:'NI Median Monthly Pay',value:'£2,509',color:T.teal},
                {label:'UK Median Monthly Pay',value:'£2,700+',color:T.blue},
                {label:'NI as % of UK',value:'~89%',color:T.amber},
                {label:'NI YoY growth',value:'+5.6%',color:T.green},
                {label:'UK CPI (2026)',value:'~3%',color:T.red},
                {label:'Real wage position',value:'Positive',color:T.green},
              ].map(r=>(
                <div key={r.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:14,color:T.text2}}>{r.label}</span>
                  <span className="mono" style={{fontSize:14,color:r.color,fontWeight:700}}>{r.value}</span>
                </div>
              ))}
            </div>

            <Insight type="insight" text="Median monthly pay grew 5.6% YoY to £2,509 in August 2026 (HMRC flash estimate, nominal, likely to be revised). However the NI-UK wage gap persists at approximately 11%, reflecting the structural public sector wage anchor and lower private sector productivity." />
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
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:14,marginBottom:4}}>
                    <span style={{color:T.text1}}>{d.reason}</span>
                    <span className="mono" style={{color:T.text3,fontSize:12}}>{d.pct}%</span>
                  </div>
                  <div style={{background:T.bg3,height:6,borderRadius:0}}>
                    <div style={{
                      background:d.reason.includes('sick')?T.red:T.teal,
                      height:6,width:`${d.pct}%`,borderRadius:0
                    }}/>
                  </div>
                </div>
              ))}
              <div className="mono" style={{fontSize:12,color:T.text3,marginTop:12}}>
                Long-term sick is primary driver — direct link to NHS waiting list crisis
              </div>
            </div>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:0,padding:20}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text0,marginBottom:4}}>
                The Health–Inactivity–Productivity Link
              </div>
              <div className="mono" style={{fontSize:12,color:T.text3,marginBottom:12}}>
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
                    <span className="mono" style={{fontSize:12,color:s.col,flexShrink:0,marginTop:2}}>{s.step}</span>
                    <span style={{fontSize:14,color:T.text2,lineHeight:1.5}}>{s.text}</span>
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
