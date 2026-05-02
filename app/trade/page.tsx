'use client'
import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, LineChart, Line,
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

const northSouthTrade = [
  {y:'2001',v:1.9},{y:'2005',v:2.2},{y:'2010',v:2.2},{y:'2015',v:1.9},
  {y:'2016',v:2.2},{y:'2017',v:2.8},{y:'2018',v:3.5},{y:'2019',v:4.1},
  {y:'2020',v:5.8},{y:'2021',v:7.2},{y:'2022',v:7.0},{y:'2023',v:8.7},
  {y:'2024',v:10.5},{y:'2025F',v:12.2,forecast:true},{y:'2026F',v:13.5,forecast:true},
]

const bilateralGoods = [
  {y:'2015',NST:1.1,SNT:0.8},{y:'2016',NST:1.3,SNT:0.9},
  {y:'2017',NST:1.6,SNT:1.2},{y:'2018',NST:2.0,SNT:1.5},
  {y:'2019',NST:2.3,SNT:1.8},{y:'2020',NST:3.3,SNT:2.5},
  {y:'2021',NST:4.1,SNT:3.1},{y:'2022',NST:4.0,SNT:3.0},
  {y:'2023',NST:4.8,SNT:4.3},{y:'2024',NST:5.5,SNT:4.4},
  {y:'2025F',NST:6.4,SNT:5.0,forecast:true},
]

const externalSales = [
  {y:'2019',GB:15.8,ROI:3.9,EU:1.1,world:2.4},
  {y:'2020',GB:16.1,ROI:5.4,EU:1.2,world:2.3},
  {y:'2021',GB:16.8,ROI:7.0,EU:1.4,world:2.4},
  {y:'2022',GB:17.4,ROI:8.2,EU:1.6,world:2.6},
  {y:'2023',GB:19.4,ROI:8.7,EU:1.8,world:2.9},
  {y:'2024',GB:20.1,ROI:10.5,EU:2.2,world:3.4},
  {y:'2025F',GB:20.8,ROI:12.4,EU:2.5,world:3.7,forecast:true},
]

const tradeBalance = [
  {y:'2019',exports:23.2,imports:18.4,balance:4.8},
  {y:'2020',exports:24.1,imports:18.9,balance:5.2},
  {y:'2021',exports:25.6,imports:20.1,balance:5.5},
  {y:'2022',exports:29.8,imports:22.4,balance:7.4},
  {y:'2023',exports:34.8,imports:23.9,balance:10.9},
  {y:'2024',exports:39.8,imports:27.5,balance:12.3},
  {y:'2025F',exports:44.0,imports:29.5,balance:14.5,forecast:true},
]

const servicesTrade = [
  {type:'Prof. & Business',exports:1.24,imports:0.68},
  {type:'ICT Services',exports:0.82,imports:0.44},
  {type:'Transport',exports:0.48,imports:0.31},
  {type:'Financial',exports:0.38,imports:0.22},
  {type:'Tourism/Travel',exports:0.22,imports:0.14},
  {type:'Other',exports:0.16,imports:0.11},
]

const lgdSales = [
  {lgd:'Belfast',pct:28.4,change:2.1},
  {lgd:'Newry, M & D',pct:12.6,change:2.8},
  {lgd:'Armagh, B & C',pct:10.8,change:1.9},
  {lgd:'Derry & Strabane',pct:9.8,change:1.4},
  {lgd:'Ant. & Newtownabbey',pct:9.2,change:0.8},
  {lgd:'Mid & East Antrim',pct:8.9,change:0.6},
  {lgd:'Lisburn & Castlereagh',pct:7.4,change:0.4},
  {lgd:'Causeway C & G',pct:5.6,change:0.3},
  {lgd:'Ards & North Down',pct:4.2,change:-0.2},
  {lgd:'Mid Ulster',pct:3.1,change:0.5},
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

export default function TradePage() {
  const [view, setView] = useState<'overview'|'crossborder'|'services'|'geography'>('overview')

  return (
    <div style={{maxWidth:1100}} className="page-enter">
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 04 · TRADE & WINDSOR FRAMEWORK
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Trade & the Windsor Framework
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:14}}>
          NI's trade flows have undergone the most dramatic structural shift in the region's
          economic history. This module combines NISRA NIETS 2024 (published 11 March 2026),
          CSO monthly cross-border goods data, and InterTradeIreland analysis.
        </p>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <TheoryTag tag="gravity"/>
          <TheoryTag tag="north"/>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:24}}>
        <KPI label="Total NI Sales 2024" value="£109.3" unit="bn" sub="NIETS 2024 · +7.5% YoY · record" delta="Strongest since survey began" color={T.teal}/>
        <KPI label="Cross-Border Trade 2024" value="£14.6" unit="bn" sub="Goods+Services · NIETS 2024" delta="+16.8% YoY · ~€17.2bn" color={T.green}/>
        <KPI label="NI → Ireland (NST) 2024" value="£8.7" unit="bn" sub="Goods exports · NIETS 2024" delta="+22% YoY · record" color={T.teal}/>
        <KPI label="Trade Surplus 2024" value="+£12.3" unit="bn" sub="Exports £39.8bn vs Imports £27.5bn" delta="Surplus with every market" color={T.green}/>
        <KPI label="Services Exports 2024" value="£9.3" unit="bn" sub="NIETS 2024 · fastest growing" delta="+35.5% YoY" color={T.teal}/>
        <KPI label="GB Goods Purchases 2024" value="-6.7" unit="%" sub="Trade diversion signal" delta="NI sourcing from ROI/EU instead" deltaPos={false} color={T.amber}/>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        {(['overview','crossborder','services','geography'] as const).map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{
            background:view===v?`${T.teal}18`:'transparent',
            color:view===v?T.teal:T.text2,
            border:'none',borderBottom:`2px solid ${view===v?T.teal:'transparent'}`,
            padding:'8px 20px',cursor:'pointer',
            fontSize:11,fontFamily:'monospace',letterSpacing:1,
            textTransform:'uppercase',transition:'all 0.12s',
          }}>
            {v==='overview'?'Overview':v==='crossborder'?'Cross-Border':v==='services'?'Services':'Geography'}
          </button>
        ))}
      </div>

      {view==='overview'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="NI External Sales by Market (£bn)" subtitle="NIETS 2019–2025F · SALES OUTSIDE NI">
            <div style={{display:'flex',gap:6,marginBottom:10}}>
              <TheoryTag tag="gravity"/>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={externalSales}>
                <defs>
                  <linearGradient id="gbG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.blue} stopOpacity={0.4}/><stop offset="95%" stopColor={T.blue} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="roiG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.green} stopOpacity={0.4}/><stop offset="95%" stopColor={T.green} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${v}bn`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceArea x1="2025F" x2="2025F" fill={T.bg3} opacity={0.8}/>
                <Area type="monotone" dataKey="GB" stroke={T.blue} fill="url(#gbG)" strokeWidth={2} name="Great Britain"/>
                <Area type="monotone" dataKey="ROI" stroke={T.green} fill="url(#roiG)" strokeWidth={2} name="Ireland"/>
                <Area type="monotone" dataKey="EU" stroke={T.purple} fill={T.purple} fillOpacity={0.2} strokeWidth={1.5} name="Rest of EU"/>
                <Area type="monotone" dataKey="world" stroke={T.gold} fill={T.gold} fillOpacity={0.2} strokeWidth={1.5} name="Rest of World"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Trade Balance: Exports vs Imports (£bn)" subtitle="NIETS 2019–2025F · TOTAL EXTERNAL TRADE">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={tradeBalance}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${v}bn`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceArea x1="2025F" x2="2025F" fill={T.bg3} opacity={0.8}/>
                <Bar dataKey="exports" fill={T.green} opacity={0.7} name="Exports (£bn)"/>
                <Bar dataKey="imports" fill={T.red} opacity={0.6} name="Imports (£bn)"/>
                <Line type="monotone" dataKey="balance" stroke={T.gold} strokeWidth={2.5} dot={{r:3}} name="Trade Surplus (£bn)"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <Insight type="insight" text="NIETS 2024 confirms NI runs a trade surplus with every external market — total exports £39.8bn vs imports £27.5bn, a surplus of £12.3bn. Services exports grew +35.5% to £9.3bn — now 23% of all NI external sales, up from 17% in 2019. NI is a net exporter across goods, services, and all geographies — a fact rarely stated in public discourse." />
          <Insight type="warning" text="Trade diversion is now visible in the data. Purchases of goods from GB fell 6.7% in 2024 while total purchases rose 4.7%. NI businesses are sourcing from Ireland and EU suppliers instead of GB. This makes economic sense under the Windsor Framework — but creates supply chain concentration risk if the political settlement changes." />
        </div>
      )}

      {view==='crossborder'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="N-S Trade: Long-Run History (£bn goods+services)" subtitle="2001–2026F · NIETS / INTERTRADEIRELAND / CSO">
            <div style={{display:'flex',gap:6,marginBottom:10}}>
              <TheoryTag tag="gravity"/>
              <TheoryTag tag="north"/>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={northSouthTrade}>
                <defs>
                  <linearGradient id="nsG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.green} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={T.green} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} interval={2}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${v}bn`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceArea x1="2025F" x2="2026F" fill={T.bg3} opacity={0.6}/>
                <ReferenceLine x="2020" stroke={T.amber} strokeDasharray="3 3"/>
                <ReferenceLine x="2023" stroke={T.teal} strokeDasharray="3 3"/>
                <Area type="monotone" dataKey="v" stroke={T.green} fill="url(#nsG)" strokeWidth={2} name="N-S Trade (£bn)"/>
              </AreaChart>
            </ResponsiveContainer>
            <div className="mono" style={{fontSize:9,color:T.text3,marginTop:8}}>
              Amber dashed = NI Protocol (2020) · Teal dashed = Windsor Framework (2023)
            </div>
          </ChartCard>

          <ChartCard title="Bilateral Goods Split: NST vs SNT (£bn)" subtitle="NI→IRELAND (NST) vs IRELAND→NI (SNT) · CSO ANNUAL">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={bilateralGoods}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${v}bn`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceArea x1="2025F" x2="2025F" fill={T.bg3} opacity={0.8}/>
                <Bar dataKey="NST" fill={T.teal} opacity={0.8} name="NI → Ireland"/>
                <Bar dataKey="SNT" fill={T.blue} opacity={0.7} name="Ireland → NI"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <Insight type="insight" text="Cross-border trade has undergone a structural shift — from £1.9bn throughout 2001–2015 to £10.5bn in 2024, a 5.5x increase. NI→Ireland (NST) reached £5.5bn in 2024, exceeding Ireland→NI (SNT) at £4.4bn. NI runs a goods trade surplus with Ireland — a reversal of the pre-Protocol pattern." />
          <Insight type="opportunity" text="The Windsor Framework gives NI simultaneous access to the UK Internal Market and EU Single Market for goods — a position no other UK region holds. Combined with dual regulatory alignment, this creates a genuine FDI attraction proposition and logistics hub opportunity that has not yet been systematically leveraged by Invest NI or DfE in any published strategy." />
        </div>
      )}

      {view==='services'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Services Trade: Exports vs Imports (£bn)" subtitle="NIETS 2024 · BY SERVICE TYPE">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={servicesTrade} layout="vertical">
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} horizontal={false}/>
                <XAxis type="number" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${v}bn`}/>
                <YAxis type="category" dataKey="type" tick={{fontSize:9,fill:T.text1}} tickLine={false} width={110}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="exports" fill={T.green} opacity={0.8} name="Exports (£bn)" radius={[0,2,2,0]}/>
                <Bar dataKey="imports" fill={T.blue} opacity={0.6} name="Imports (£bn)" radius={[0,2,2,0]}/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                Services Trade — Why It Matters
              </div>
              {[
                {title:'More resilient than goods',col:T.teal,text:'Services trade is less affected by Windsor Framework mechanics than goods. It is not subject to the same regulatory divergence risks and is harder to divert.'},
                {title:'Fastest growing component',col:T.green,text:'Services exports grew +35.5% in 2024 to £9.3bn — now 23% of all NI external sales, up from 17% in 2019. Professional & business services lead at £1.24bn.'},
                {title:'ICT growth signal',col:T.purple,text:'ICT services exports £0.82bn, growing faster than any other category. Belfast–Dublin tech corridor is driving cross-border digital service flows.'},
              ].map(s=>(
                <div key={s.title} style={{borderLeft:`3px solid ${s.col}`,padding:'8px 12px',background:T.bg2,marginBottom:8,borderRadius:'0 4px 4px 0'}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text0,marginBottom:3}}>{s.title}</div>
                  <div style={{fontSize:11,color:T.text2,lineHeight:1.55}}>{s.text}</div>
                </div>
              ))}
            </div>
            <Insight type="insight" text="Services exports at £9.3bn (+35.5%) are now the most dynamic part of NI's trade story. Unlike goods, services exports are not affected by GB-NI regulatory friction and are growing in both directions — NI firms selling professional services to GB and ROI, and ROI and international firms buying NI ICT and financial services." />
          </div>
        </div>
      )}

      {view==='geography'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="External Sales by Local Government District (%)" subtitle="NIETS 2024 · % OF ALL NI EXTERNAL SALES · NISRA">
            <div style={{paddingTop:8}}>
              {lgdSales.map(d=>(
                <div key={d.lgd} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}>
                    <span style={{color:T.text1}}>{d.lgd}</span>
                    <span className="mono" style={{color:T.teal,fontSize:11}}>
                      {d.pct}%
                      <span style={{fontSize:9,marginLeft:6,color:d.change>=0?T.green:T.red}}>
                        {d.change>=0?'+':''}{d.change}pp
                      </span>
                    </span>
                  </div>
                  <div style={{background:T.bg3,height:5,borderRadius:2}}>
                    <div style={{background:T.teal,height:5,width:`${d.pct*2.8}%`,borderRadius:2}}/>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:12}}>
                Geographic Trade Findings
              </div>
              {[
                {title:'Belfast dominates (28.4%)',col:T.teal,text:'Belfast accounts for over a quarter of all NI external sales — disproportionately high given its ~20% population share. Professional services, ICT and financial services drive this.'},
                {title:'Border LGDs: 33.2% combined',col:T.green,text:'Newry/Mourne/Down, Armagh/Banbridge/Craigavon and Derry/Strabane together account for 33.2% of NI external sales. These councils have the deepest cross-border trade integration.'},
                {title:'East underperforms',col:T.amber,text:'Ards & North Down (-0.2pp) and Lisburn & Castlereagh (+0.4pp) show the weakest growth. Oriented toward domestic NI services with lower export intensity.'},
              ].map(s=>(
                <div key={s.title} style={{borderLeft:`3px solid ${s.col}`,padding:'8px 12px',background:T.bg2,marginBottom:8,borderRadius:'0 4px 4px 0'}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text0,marginBottom:3}}>{s.title}</div>
                  <div style={{fontSize:11,color:T.text2,lineHeight:1.55}}>{s.text}</div>
                </div>
              ))}
            </div>
            <Insight type="weak" text="NIETS LGD data assigns sales to the location of the reporting business, not the origin of production. A Belfast-headquartered firm selling agri-food produced in Armagh appears as Belfast trade. The geographic picture is directionally correct but likely overstates Belfast and understates production-intensive border councils." />
          </div>
        </div>
      )}
    </div>
  )
}