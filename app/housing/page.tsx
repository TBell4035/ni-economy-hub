'use client'
import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
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

const hpiAnnual = [
  {y:'Q1 10',v:152000},{y:'Q1 11',v:148000},{y:'Q1 12',v:139000},
  {y:'Q1 13',v:137000},{y:'Q1 14',v:140000},{y:'Q1 15',v:144000},
  {y:'Q1 16',v:148000},{y:'Q1 17',v:153000},{y:'Q1 18',v:158000},
  {y:'Q1 19',v:164000},{y:'Q1 20',v:163000},{y:'Q1 21',v:172000},
  {y:'Q1 22',v:192000},{y:'Q1 23',v:198000},{y:'Q1 24',v:206000},
  {y:'Q1 25',v:221233},{y:'Q3 25',v:230000},
  {y:'Q1 26F',v:238000,forecast:true},{y:'Q3 26F',v:244000,forecast:true},
]

const hpiGrowth = [
  {y:'2015',NI:2.1,UK:5.6},{y:'2016',NI:3.2,UK:7.1},
  {y:'2017',NI:3.8,UK:4.8},{y:'2018',NI:4.1,UK:3.0},
  {y:'2019',NI:3.9,UK:1.4},{y:'2020',NI:5.3,UK:7.3},
  {y:'2021',NI:10.2,UK:10.2},{y:'2022',NI:8.6,UK:9.8},
  {y:'2023',NI:5.1,UK:1.1},{y:'2024',NI:7.5,UK:3.4},
  {y:'2025',NI:9.5,UK:4.2},
]

const councilPrices = [
  {area:'Lisburn & Castlereagh',price:221029,growth:4.1},
  {area:'Ards & North Down',price:218400,growth:5.2},
  {area:'Belfast',price:178000,growth:5.4},
  {area:'Antrim & Newtownabbey',price:192000,growth:6.8},
  {area:'Armagh, B & C',price:182000,growth:7.1},
  {area:'Causeway C & G',price:174000,growth:6.2},
  {area:'Derry & Strabane',price:168000,growth:14.5},
  {area:'Newry, M & D',price:192000,growth:8.3},
  {area:'Mid Ulster',price:165000,growth:3.9},
  {area:'Mid & East Antrim',price:165289,growth:8.1},
  {area:'Fermanagh & O',price:163000,growth:2.8},
].sort((a,b)=>b.price-a.price)

const rentData = [
  {area:'Belfast',rent:1130,change:5.8},
  {area:'NI Average',rent:880,change:5.0},
  {area:'UK Average',rent:1367,change:3.5},
  {area:'London',rent:2100,change:2.1},
]

const supplyData = [
  {y:'2015',completions:6200,starts:6800},{y:'2016',completions:6500,starts:7100},
  {y:'2017',completions:7200,starts:7800},{y:'2018',completions:7800,starts:8200},
  {y:'2019',completions:8100,starts:8400},{y:'2020',completions:6200,starts:5800},
  {y:'2021',completions:7400,starts:8100},{y:'2022',completions:8200,starts:7600},
  {y:'2023',completions:8800,starts:7200},{y:'2024',completions:8400,starts:6800},
]

const affordabilityData = [
  {y:'2015',ratio:4.2,NI_median:24800,house:152000},
  {y:'2017',ratio:4.6,NI_median:26100,house:153000},
  {y:'2019',ratio:5.0,NI_median:27200,house:164000},
  {y:'2021',ratio:5.4,NI_median:27800,house:172000},
  {y:'2022',ratio:6.1,NI_median:28400,house:192000},
  {y:'2023',ratio:6.4,NI_median:28900,house:198000},
  {y:'2024',ratio:6.8,NI_median:29234,house:206000},
  {y:'2025',ratio:7.2,NI_median:30000,house:221233},
]

const crossBorderComparison = [
  {metric:'Avg house price',NI:221233,ROI:385000,UK:269000},
  {metric:'Annual growth %',NI:9.5,ROI:7.4,UK:4.2},
  {metric:'Avg monthly rent £',NI:880,ROI:1850,UK:1367},
  {metric:'Price-to-income ratio',NI:7.2,ROI:12.1,UK:8.9},
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

export default function HousingPage() {
  const [view, setView] = useState<'prices'|'affordability'|'supply'|'crossborder'>('prices')

  return (
    <div style={{maxWidth:1100}} className="page-enter">
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 12 · HOUSING
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Housing Market
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:14}}>
          NI's housing market is outperforming every other UK region on price growth but
          faces structural supply constraints rooted in planning failures and NI Water
          infrastructure capacity. This module draws on NISRA House Price Index,
          Ulster University/NIHE Quarterly House Price Index, ONS Private Rent data,
          and PropertyPal market analysis.
        </p>
        <div style={{
          background:'#1a0808',border:'1px solid #3a1010',
          borderRadius:4,padding:'10px 14px',marginBottom:14,
          fontSize:11,color:'#c06060'
        }}>
          <span className="mono" style={{fontSize:9,letterSpacing:2,color:T.red,marginRight:8}}>
            ⚠ DATA GAP
          </span>
          There is no dedicated NI housing economist in the public sector. No published
          NI-specific housing supply/demand structural model exists. No NI equivalent
          of the ONS UK Affordability Index. Housing is the most data-poor major economic
          domain in this platform. Forecasts carry low confidence (42%).
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:24}}>
        <KPI label="Avg House Price Q4 2025" value="£221,233" sub="UU/NIHE HPI · +4.8% YoY" delta="Highest since pre-2008 peak" color={T.gold}/>
        <KPI label="Annual Growth 2025" value="+9.5" unit="%" sub="NISRA HPI Q1 2025 · fastest in UK" delta="UK average: +4.2%" color={T.amber}/>
        <KPI label="Belfast Avg Price Q4 2025" value="£178,000" sub="ONS · +5.4% YoY" delta="Below NI average growth" deltaPos={false} color={T.blue}/>
        <KPI label="Belfast Monthly Rent Jan 26" value="£1,130" sub="ONS Private Rent · +5.8% YoY" delta="NI avg £880 · UK avg £1,367" color={T.teal}/>
        <KPI label="Price-to-Income Ratio 2025" value="7.2x" sub="Median house ÷ median salary" delta="Up from 4.2x in 2015" deltaPos={false} color={T.red}/>
        <KPI label="First-Time Buyers" value="~40" unit="%" sub="Of all transactions · Q4 2025" delta="High vs rest of UK" color={T.green}/>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        {(['prices','affordability','supply','crossborder'] as const).map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{
            background:view===v?`${T.teal}18`:'transparent',
            color:view===v?T.teal:T.text2,
            border:'none',borderBottom:`2px solid ${view===v?T.teal:'transparent'}`,
            padding:'8px 20px',cursor:'pointer',
            fontSize:11,fontFamily:'monospace',letterSpacing:1,
            textTransform:'uppercase',transition:'all 0.12s',
          }}>
            {v==='prices'?'Prices & Rents':v==='affordability'?'Affordability':v==='supply'?'Supply':'Cross-Border'}
          </button>
        ))}
      </div>

      {view==='prices'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="NI Average House Price (£)" subtitle="UU/NIHE HPI · QUARTERLY · 2010–2026F">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={hpiAnnual}>
                <defs>
                  <linearGradient id="hpG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.gold} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={T.gold} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:8,fill:T.text3,fontFamily:'monospace'}} tickLine={false} interval={4}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${(v/1000).toFixed(0)}k`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceLine y={184000} stroke={T.text3} strokeDasharray="3 3"/>
                <Area type="monotone" dataKey="v" stroke={T.gold} fill="url(#hpG)" strokeWidth={2} name="Avg House Price (£)"/>
              </AreaChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:8}}>
              Dashed = pre-2008 peak (£184,000) · Source: Ulster University / NIHE HPI
            </div>
          </ChartCard>

          <ChartCard title="Annual House Price Growth: NI vs UK (%)" subtitle="NISRA HPI / ONS UK HPI · 2015–2025">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={hpiGrowth}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${v}%`}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="NI" fill={T.gold} opacity={0.75} name="NI"/>
                <Line type="monotone" dataKey="UK" stroke={T.blue} strokeWidth={2} dot={false} name="UK" strokeDasharray="4 2"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Average Price by Council Area (£, 2025)" subtitle="NISRA HPI / UU · Q1–Q2 2025 · SORTED BY PRICE">
            <div style={{paddingTop:4}}>
              {councilPrices.map(d=>(
                <div key={d.area} style={{marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}>
                    <span style={{color:T.text1}}>{d.area}</span>
                    <span className="mono" style={{fontSize:11}}>
                      <span style={{color:T.gold}}>£{d.price.toLocaleString()}</span>
                      <span style={{color:d.growth>7?T.amber:T.text3,marginLeft:8}}>+{d.growth}%</span>
                    </span>
                  </div>
                  <div style={{background:T.bg3,height:4,borderRadius:2}}>
                    <div style={{
                      background:d.area==='Belfast'?T.blue:T.gold,
                      height:4,
                      width:`${(d.price/230000)*100}%`,
                      borderRadius:2
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                Rent Comparison (January 2026)
              </div>
              <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:12}}>
                ONS PRIVATE RENT · MONTHLY AVERAGE
              </div>
              {rentData.map(r=>(
                <div key={r.area} style={{padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                    <span style={{fontSize:12,color:T.text1}}>{r.area}</span>
                    <span className="mono" style={{fontSize:12,color:T.teal,fontWeight:700}}>£{r.rent}/mo</span>
                  </div>
                  <div style={{fontSize:10,color:T.text3}}>+{r.change}% YoY</div>
                </div>
              ))}
              <div style={{marginTop:12,fontSize:11,color:T.text2,lineHeight:1.6}}>
                NI rents are the lowest of any UK region — but growing fast. The Belfast-NI gap (£1,130 vs £880) reflects urban premium. NI rents are still 34% below the UK average.
              </div>
            </div>
            <Insight type="insight" text="NI has been the fastest-growing UK housing market for three consecutive years. Derry & Strabane saw 14.5% annual price growth in Q2 2025 — the highest of any NI council area. Price growth is now spreading beyond Belfast and commuter belt into secondary cities, reflecting both genuine demand and supply constraints." />
          </div>
        </div>
      )}

      {view==='affordability'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="House Price-to-Income Ratio" subtitle="NI MEDIAN HOUSE PRICE ÷ NI MEDIAN SALARY · 2015–2025">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={affordabilityData}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${v}x`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceLine y={4.5} stroke={T.green} strokeDasharray="3 3"/>
                <ReferenceLine y={7.0} stroke={T.red} strokeDasharray="3 3"/>
                <Line type="monotone" dataKey="ratio" stroke={T.amber} strokeWidth={2.5} dot={{r:3,fill:T.amber}} name="Price-to-Income Ratio"/>
              </LineChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:8}}>
              Green dashed = affordable threshold (4.5x) · Red dashed = severe affordability stress (7.0x)
            </div>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                Affordability Pressures — 2025
              </div>
              {[
                {issue:'First-time buyer squeeze',col:T.red,text:'Price-to-income ratio reached 7.2x in 2025 — up from 4.2x in 2015. Despite NI still being cheaper than most UK regions, the pace of deterioration is the fastest in the UK. First-time buyers without parental support are increasingly priced out.'},
                {issue:'Deposit barrier',col:T.amber,text:'A 10% deposit on the NI average home (£221,000) requires £22,100 — approximately 9 months of median take-home pay. In 2015 the equivalent figure was 6 months. The deposit barrier is growing faster than wages.'},
                {issue:'Mortgage cost improvement',col:T.green,text:'Bank of England rate cuts to 3.75% in December 2025 have improved mortgage affordability at the margin. Lender competition is strong. First-time buyer mortgage products have improved significantly since the 2023 peak.'},
                {issue:'Help to Buy NI',col:T.blue,text:'NI has its own Help to Buy: ISA scheme administered by NIHE. Take-up has been significant but the scheme is not designed for the current price environment — the property price cap is under review.'},
              ].map(s=>(
                <div key={s.issue} style={{borderLeft:`3px solid ${s.col}`,padding:'8px 12px',background:T.bg2,marginBottom:8,borderRadius:'0 4px 4px 0'}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text0,marginBottom:3}}>{s.issue}</div>
                  <div style={{fontSize:11,color:T.text2,lineHeight:1.55}}>{s.text}</div>
                </div>
              ))}
            </div>
            <Insight type="warning" text="NI is approaching a structural affordability crisis for younger buyers. The price-to-income ratio of 7.2x has crossed the threshold that the Resolution Foundation identifies as severe affordability stress. Unlike London where the crisis has been decades in the making, NI's deterioration has happened in under a decade — and without the wage growth that partially offset London's problem." />
          </div>
        </div>
      )}

      {view==='supply'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Housing Completions & Starts" subtitle="DFI / NISRA CONSTRUCTION STATISTICS · ANNUAL · 2015–2024">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={supplyData}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="completions" fill={T.teal} opacity={0.75} name="Completions"/>
                <Line type="monotone" dataKey="starts" stroke={T.gold} strokeWidth={2} dot={false} name="Starts"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                The NI Water Supply Constraint
              </div>
              <div style={{
                background:'#1a0808',border:'1px solid #3a1010',
                borderRadius:4,padding:'12px 14px',marginBottom:12,
                fontSize:12,color:'#c06060',lineHeight:1.65
              }}>
                NI Water's outdated wastewater infrastructure has stalled new housing projects across multiple council areas. Planning permission is being granted but development cannot proceed because the water and sewerage network cannot support new connections. This is not a planning problem — it is an infrastructure investment problem.
              </div>
              {[
                {issue:'Scale of constraint',text:'Multiple council areas — including parts of Belfast, Antrim and Newtownabbey, and Derry & Strabane — have planning permissions that cannot be built due to wastewater capacity limits.'},
                {issue:'NI Water budget',text:'NI Water receives ~£350m/year in public funding but has a capital investment backlog estimated in the billions. It is not commercially funded — no water charges exist — limiting its borrowing capacity.'},
                {issue:'Policy gap',text:'No dedicated housing economist in NI public sector. No published housing supply model. DfI housing statistics track completions but do not model the wastewater constraint or quantify suppressed supply.'},
                {issue:'Executive response',text:'The NI Executive committed to a Housing Supply Action Plan in 2024. Implementation progress is limited. The fundamental tension: water investment requires capital that competes with health spending.'},
              ].map(r=>(
                <div key={r.issue} style={{padding:'7px 0',borderBottom:`1px solid ${T.border}`}}>
                  <div style={{fontSize:10,color:T.text3,fontFamily:'monospace',letterSpacing:0.5,marginBottom:2}}>{r.issue.toUpperCase()}</div>
                  <div style={{fontSize:11,color:T.text2,lineHeight:1.5}}>{r.text}</div>
                </div>
              ))}
            </div>
            <Insight type="warning" text="NI's housing supply crisis is infrastructure-driven, not planning-driven. The wastewater constraint means that even when land is available and planning permission granted, homes cannot be built. This is a unique NI problem with no direct UK equivalent — and it will worsen as population grows and existing infrastructure ages without adequate capital investment." />
          </div>
        </div>
      )}

      {view==='crossborder'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
              NI vs ROI vs UK — Housing Comparison 2025
            </div>
            <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>
              ONS · NISRA · CSO · DAFT.IE · JANUARY 2026
            </div>
            {crossBorderComparison.map((r,i)=>(
              <div key={i} style={{padding:'10px 0',borderBottom:`1px solid ${T.border}`}}>
                <div className="mono" style={{fontSize:9,color:T.text3,marginBottom:6}}>{r.metric.toUpperCase()}</div>
                <div style={{display:'flex',gap:16}}>
                  <div style={{flex:1,textAlign:'center',padding:'8px',background:T.bg2,borderRadius:4}}>
                    <div className="mono" style={{fontSize:9,color:T.teal,marginBottom:4}}>NI</div>
                    <div style={{fontSize:14,fontWeight:700,color:T.text0}}>
                      {typeof r.NI==='number'&&r.NI>1000?`£${r.NI.toLocaleString()}`:r.NI}
                    </div>
                  </div>
                  <div style={{flex:1,textAlign:'center',padding:'8px',background:T.bg2,borderRadius:4}}>
                    <div className="mono" style={{fontSize:9,color:T.gold,marginBottom:4}}>ROI</div>
                    <div style={{fontSize:14,fontWeight:700,color:T.text0}}>
                      {typeof r.ROI==='number'&&r.ROI>1000?`€${r.ROI.toLocaleString()}`:r.ROI}
                    </div>
                  </div>
                  <div style={{flex:1,textAlign:'center',padding:'8px',background:T.bg2,borderRadius:4}}>
                    <div className="mono" style={{fontSize:9,color:T.blue,marginBottom:4}}>UK</div>
                    <div style={{fontSize:14,fontWeight:700,color:T.text0}}>
                      {typeof r.UK==='number'&&r.UK>1000?`£${r.UK.toLocaleString()}`:r.UK}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                Cross-Border Housing Dynamics
              </div>
              {[
                {title:'NI as affordable alternative to ROI',col:T.green,text:'NI average house price (£221,000) is 42% of ROI median (€385,000 / ~£330,000). This gap is driving cross-border residential movement — ROI workers buying in border areas and commuting south, attracted by lower prices and recent interest rate improvements.'},
                {title:'Returning diaspora effect',col:T.teal,text:'Simon Brien estate agents (Q4 2025) note strong demand from returning residents and newcomers attracted by affordability, quality of life, and remote/hybrid working. This is compressing supply in the Belfast metropolitan area and key commuter belts.'},
                {title:'ROI supply crisis comparison',col:T.amber,text:'ROI average rent in Dublin is €2,500+/month, house price €475,000+. The all-island housing crisis is severe on both sides of the border but NI remains markedly more affordable. This relative advantage is a genuine economic asset — but it is eroding.'},
                {title:'Data gap: cross-border flows',col:T.red,text:'No published data source tracks cross-border residential property transactions. The scale of ROI→NI house purchases and the cross-border rental market is unknown. This is a significant gap for all-island economic analysis.'},
              ].map(s=>(
                <div key={s.title} style={{borderLeft:`3px solid ${s.col}`,padding:'8px 12px',background:T.bg2,marginBottom:8,borderRadius:'0 4px 4px 0'}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text0,marginBottom:3}}>{s.title}</div>
                  <div style={{fontSize:11,color:T.text2,lineHeight:1.55}}>{s.text}</div>
                </div>
              ))}
            </div>
            <Insight type="opportunity" text="NI's housing affordability advantage relative to ROI is a genuine economic asset that is not captured in any existing economic strategy document. If remote working normalises cross-border employment, NI's lower housing costs become a competitive draw for talent — particularly in tech and professional services where ROI wages are high but Dublin living costs are prohibitive." />
          </div>
        </div>
      )}
    </div>
  )
}