'use client'
import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
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

const gvaGrowth = [
  {y:'2001',NI:4.8,UK:2.6,ROI:5.8},{y:'2002',NI:5.7,UK:2.7,ROI:6.2},
  {y:'2003',NI:5.8,UK:4.0,ROI:4.4},{y:'2004',NI:6.1,UK:2.7,ROI:4.8},
  {y:'2005',NI:5.8,UK:3.0,ROI:6.1},{y:'2006',NI:6.4,UK:2.7,ROI:5.5},
  {y:'2007',NI:6.0,UK:2.4,ROI:4.9},{y:'2008',NI:-1.1,UK:-0.3,ROI:-4.0},
  {y:'2009',NI:-7.3,UK:-4.3,ROI:-8.1},{y:'2010',NI:2.6,UK:1.9,ROI:0.4},
  {y:'2011',NI:1.1,UK:1.6,ROI:3.8},{y:'2012',NI:0.6,UK:1.4,ROI:1.1},
  {y:'2013',NI:1.7,UK:2.1,ROI:1.5},{y:'2014',NI:2.5,UK:3.0,ROI:8.8},
  {y:'2015',NI:1.8,UK:2.3,ROI:25.2},{y:'2016',NI:1.2,UK:1.9,ROI:3.7},
  {y:'2017',NI:1.5,UK:2.1,ROI:9.2},{y:'2018',NI:1.1,UK:1.3,ROI:9.4},
  {y:'2019',NI:1.0,UK:1.6,ROI:5.0},{y:'2020',NI:-9.2,UK:-9.4,ROI:6.2},
  {y:'2021',NI:8.1,UK:7.5,ROI:13.6},{y:'2022',NI:3.2,UK:4.1,ROI:12.0},
  {y:'2023',NI:2.1,UK:0.3,ROI:2.5},{y:'2024',NI:9.6,UK:1.4,ROI:3.0},
  {y:'2025F',NI:3.2,UK:1.6,ROI:2.8,forecast:true},
  {y:'2026F',NI:2.8,UK:1.5,ROI:2.5,forecast:true},
]

const nicei = [
  {q:'Q1 19',v:100.2},{q:'Q2 19',v:100.8},{q:'Q3 19',v:101.2},{q:'Q4 19',v:101.0},
  {q:'Q1 20',v:98.4},{q:'Q2 20',v:87.2},{q:'Q3 20',v:93.8},{q:'Q4 20',v:92.9},
  {q:'Q1 21',v:95.2},{q:'Q2 21',v:100.4},{q:'Q3 21',v:103.1},{q:'Q4 21',v:104.2},
  {q:'Q1 22',v:104.8},{q:'Q2 22',v:105.4},{q:'Q3 22',v:106.1},{q:'Q4 22',v:106.8},
  {q:'Q1 23',v:107.4},{q:'Q2 23',v:108.2},{q:'Q3 23',v:109.0},{q:'Q4 23',v:110.1},
  {q:'Q1 24',v:111.2},{q:'Q2 24',v:111.9},{q:'Q3 24',v:113.4},{q:'Q4 24',v:114.8},
]

const gvaPerHead = [
  {y:'2004',NI:18200,UK:22800},{y:'2006',NI:20400,UK:24600},
  {y:'2008',NI:21900,UK:26100},{y:'2010',NI:20800,UK:25400},
  {y:'2012',NI:20900,UK:25900},{y:'2014',NI:22100,UK:27300},
  {y:'2016',NI:22800,UK:28900},{y:'2018',NI:24100,UK:30900},
  {y:'2020',NI:22400,UK:29800},{y:'2021',NI:24200,UK:31700},
  {y:'2022',NI:25900,UK:33600},{y:'2023',NI:29234,UK:36100},
  {y:'2025F',NI:31000,UK:37500,forecast:true},
  {y:'2027F',NI:33200,UK:39000,forecast:true},
]

const nabiSectors = [
  {sector:'Wholesale & Retail',turnover:16.3,gva:4.2},
  {sector:'Manufacturing',turnover:14.7,gva:8.1},
  {sector:'Construction',turnover:8.4,gva:7.2},
  {sector:'Prof. Services',turnover:6.8,gva:3.8},
  {sector:'Accommodation & Food',turnover:3.6,gva:1.4},
  {sector:'Transport & Storage',turnover:3.2,gva:1.1},
  {sector:'ICT',turnover:2.8,gva:1.8},
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
  label:string,value:string,unit?:string,sub:string,
  delta:string,deltaPos?:boolean,color:string
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

const ChartCard = ({title,subtitle,children}:{
  title:string,subtitle:string,children:React.ReactNode
}) => (
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:3}}>{title}</div>
      <div className="mono" style={{fontSize:10,color:T.text3,letterSpacing:0.5}}>{subtitle}</div>
    </div>
    {children}
  </div>
)

const ForecastBadge = ({confidence,methodology,weaknesses,sources}:{
  confidence:number,methodology:string,weaknesses:string[],sources:string[]
}) => {
  const col = confidence>=70?T.green:confidence>=55?T.amber:T.red
  return (
    <div style={{marginTop:14,borderTop:`1px solid ${T.border}`,paddingTop:14}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
        <div className="mono" style={{fontSize:10,letterSpacing:2,color:T.text3}}>FORECAST CONFIDENCE</div>
        <div style={{flex:1,height:4,background:T.bg3,borderRadius:2}}>
          <div style={{width:`${confidence}%`,height:4,background:col,borderRadius:2}}/>
        </div>
        <div className="mono" style={{fontSize:13,fontWeight:700,color:col,minWidth:40}}>{confidence}%</div>
      </div>
      <div style={{fontSize:11,color:T.text2,lineHeight:1.6,marginBottom:8}}>{methodology}</div>
      {weaknesses.length>0&&(
        <div style={{background:'#1a0808',border:'1px solid #3a1010',borderRadius:4,padding:'8px 12px',marginBottom:8}}>
          <div className="mono" style={{fontSize:9,letterSpacing:2,color:T.red,marginBottom:5}}>⚠ MODEL WEAKNESSES</div>
          {weaknesses.map((w,i)=>(
            <div key={i} style={{fontSize:11,color:'#c06060',marginBottom:2}}>· {w}</div>
          ))}
        </div>
      )}
      <div className="mono" style={{fontSize:10,color:T.text3}}>
        Sources: {sources.join(' · ')}
      </div>
    </div>
  )
}

export default function OutputPage() {
  const [view, setView] = useState<'growth'|'levels'|'sectors'>('growth')

  return (
    <div style={{maxWidth:1100}} className="page-enter">

      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 02 · OUTPUT & GROWTH
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Economic Output & Growth
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:14}}>
          NI does not have an official GDP measure. The primary output indicator is GVA (Gross
          Value Added). The NICEI provides the most timely quarterly proxy; NIABI provides
          confirmed annual business economy GVA. These two measures are complementary —
          they capture different parts of the economy and should not be directly compared.
        </p>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <TheoryTag tag="solow"/>
          <TheoryTag tag="north"/>
          <TheoryTag tag="keynes"/>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:24}}>
        <KPI label="aGVA 2024 (NIABI confirmed)" value="+9.6" unit="%" sub="Business economy · published 11 Mar 2026" delta="+8.2pp vs UK avg" color={T.teal}/>
        <KPI label="NICEI Growth 2024" value="+3.6" unit="%" sub="Composite proxy · NISRA Q4 2024" delta="+2.2pp vs UK" color={T.teal}/>
        <KPI label="GVA Per Head 2023" value="£29,234" sub="ONS Regional Accounts 2023" delta="81% of UK average" deltaPos={false} color={T.gold}/>
        <KPI label="Total Turnover 2024" value="£109.3" unit="bn" sub="NIABI 2024 · record high" delta="+7.5% YoY" color={T.blue}/>
        <KPI label="Construction GVA 2024" value="+30.7" unit="%" sub="Largest sector rise · NIABI 2024" delta="+£1.7bn in one year" color={T.amber}/>
        <KPI label="NICEI Q4 2024" value="114.8" sub="Q1 2019 = 100 · NISRA" delta="+14.8% since pre-COVID" color={T.teal}/>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        {(['growth','levels','sectors'] as const).map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{
            background:view===v?`${T.teal}18`:'transparent',
            color:view===v?T.teal:T.text2,
            border:'none',borderBottom:`2px solid ${view===v?T.teal:'transparent'}`,
            padding:'8px 20px',cursor:'pointer',
            fontSize:11,fontFamily:'monospace',letterSpacing:1,
            textTransform:'uppercase',transition:'all 0.12s',
          }}>
            {v==='growth'?'Growth Rates':v==='levels'?'GVA Levels':'Sector Detail'}
          </button>
        ))}
      </div>

      {view==='growth'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Annual GVA Growth: NI vs UK vs ROI (%)" subtitle="2001–2026F · NISRA / ONS / CSO · FORECASTS SHADED">
            <div style={{display:'flex',gap:6,marginBottom:10}}>
              <TheoryTag tag="solow"/>
              <TheoryTag tag="north"/>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={gvaGrowth}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} interval={3}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`${v}%`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceLine y={0} stroke={T.border2}/>
                <ReferenceArea x1="2025F" x2="2026F" fill={T.bg3} opacity={0.8}/>
                <Bar dataKey="NI" fill={T.teal} opacity={0.75} name="NI GVA Growth"/>
                <Line type="monotone" dataKey="UK" stroke={T.red} strokeWidth={2} dot={false} name="UK" strokeDasharray="4 2"/>
                <Line type="monotone" dataKey="ROI" stroke={T.gold} strokeWidth={1.5} dot={false} name="ROI"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </ComposedChart>
            </ResponsiveContainer>
            <ForecastBadge
              confidence={68}
              methodology="ARIMA(2,1,1) on NICEI quarterly series. Calibrated against ESRI/NIESR macro model projections. External assumption: UK fiscal stance neutral."
              weaknesses={[
                "No NI-specific macro-econometric model with public access",
                "Windsor Framework trade impact not fully modelled at GVA level",
                "ROI 2015 figure (25.2%) is a multinational accounting artefact"
              ]}
              sources={["NISRA NICEI Q4 2024","ESRI NI Macro Projections 2025","ONS Regional Accounts 2023"]}
            />
          </ChartCard>

          <ChartCard title="NICEI Quarterly Index (Q1 2019 = 100)" subtitle="Q1 2019–Q4 2024 · NI COMPOSITE ECONOMIC INDEX · NISRA">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={nicei}>
                <defs>
                  <linearGradient id="niceiG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.teal} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={T.teal} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="q" tick={{fontSize:8,fill:T.text3,fontFamily:'monospace'}} tickLine={false} interval={3}/>
                <YAxis domain={[82,118]} tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceLine y={100} stroke={T.text3} strokeDasharray="3 3"/>
                <ReferenceArea x1="Q2 20" x2="Q3 20" fill="#300000" opacity={0.5}/>
                <Area type="monotone" dataKey="v" stroke={T.teal} fill="url(#niceiG)" strokeWidth={2} name="NICEI"/>
              </AreaChart>
            </ResponsiveContainer>
            <div style={{marginTop:14,borderTop:`1px solid ${T.border}`,paddingTop:14}}>
              <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:8}}>WHAT IS THE NICEI?</div>
              <p style={{fontSize:12,color:T.text2,lineHeight:1.65}}>
                The NICEI is not GDP. It is a composite index weighted by production, services,
                construction, public sector and agriculture using historic GVA shares. It does not
                capture informal economy activity, cross-border income flows, or capital formation.
                Use as a directional growth indicator only. The ONS Regional Accounts GVA
                (published annually with a 2-year lag) is the authoritative measure.
              </p>
            </div>
          </ChartCard>

          <Insight type="insight" text="NIABI 2024 confirms NI's business economy GVA grew 9.6% in 2024 — the strongest growth in over a decade outside COVID recovery. Construction led at +30.7%, adding £1.7bn. This explains the gap between the NICEI proxy (+3.6%) and the confirmed NIABI figure — the NICEI underweights construction in its sectoral composition. Both figures are correct; they measure different things." />
          <Insight type="weak" text="ROI GVA figures are severely distorted by multinational profit-shifting. The 2015 figure of 25.2% was an accounting artefact. NI-ROI comparisons should use ROI modified GNI* (CSO measure) which gives a more realistic picture of approximately €36,000 per head — still significantly above NI but without the multinational distortion." />
        </div>
      )}

      {view==='levels'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="GVA Per Head: NI vs UK (£, nominal)" subtitle="ONS REGIONAL ACCOUNTS · 2004–2027F">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={gvaPerHead}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false}/>
                <XAxis dataKey="y" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false}/>
                <YAxis tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${(v/1000).toFixed(0)}k`}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceArea x1="2025F" x2="2027F" fill={T.bg3} opacity={0.6}/>
                <Line type="monotone" dataKey="NI" stroke={T.teal} strokeWidth={2} dot={{r:3,fill:T.teal}} name="NI GVA/head"/>
                <Line type="monotone" dataKey="UK" stroke={T.red} strokeWidth={2} dot={{r:3,fill:T.red}} strokeDasharray="4 2" name="UK GVA/head"/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </LineChart>
            </ResponsiveContainer>
            <ForecastBadge
              confidence={62}
              methodology="Linear trend extrapolation on ONS Regional Accounts series. No structural model. Forecast assumes NI growth outperformance of UK continues at reduced rate post-2024 construction boom."
              weaknesses={[
                "No NI-specific price deflator — nominal figures affected by UK CPI",
                "2024 and 2025 ONS Regional Accounts not yet published",
                "Construction boom in 2024 may not sustain at same rate"
              ]}
              sources={["ONS Regional Accounts 2023","NISRA NIABI 2024","NIFC Spending Review Response 2025"]}
            />
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
                Growth Accounting Decomposition
              </div>
              <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:12}}>
                SOLOW FRAMEWORK · NI 2024 ESTIMATE
              </div>
              <TheoryTag tag="solow"/>
              <div style={{
                fontFamily:'monospace',background:T.bg0,
                padding:'14px 16px',borderRadius:4,
                fontSize:12,color:T.text1,margin:'12px 0',lineHeight:1.8,
              }}>
                <div style={{color:T.text3,fontSize:10,marginBottom:6}}>
                  Δln(Y) = Δln(A) + α·Δln(K) + (1-α)·Δln(L)
                </div>
                <div>9.6% ≈ <span style={{color:T.amber}}>A</span> + 0.35×(~8.5%) + 0.65×(~1.5%)</div>
                <div>9.6% ≈ <span style={{color:T.amber}}>A</span> + 2.98% + 0.98%</div>
                <div style={{color:T.teal,marginTop:4}}>∴ TFP contribution (A) ≈ 5.6%</div>
                <div style={{color:T.text3,fontSize:10,marginTop:8}}>
                  // α=capital share ~0.35 · K growth driven by construction boom
                </div>
              </div>
              <p style={{fontSize:12,color:T.text2,lineHeight:1.65}}>
                The unusually high TFP residual in 2024 is partly a statistical artefact of the
                construction boom. In trend years (2017–2019), the TFP residual was near zero,
                indicating NI growth was almost entirely factor-accumulation driven. Sustained
                convergence requires structural TFP improvement — the hardest policy lever.
              </p>
            </div>
            <Insight type="insight" text="The GVA per head gap with the UK narrowed in 2023 to £6,866. At current trajectory NI reaches £33,200 per head by 2027 against UK £39,000 — still 85% of UK average. At the current rate, full convergence with the UK average is approximately 40 years away without a structural productivity intervention." />
          </div>
        </div>
      )}

      {view==='sectors'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <ChartCard title="Turnover & GVA by Sector (£bn)" subtitle="NIABI 2024 · NISRA · CONFIRMED 11 MARCH 2026">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={nabiSectors} layout="vertical">
                <CartesianGrid strokeDasharray="2 4" stroke={T.border} horizontal={false}/>
                <XAxis type="number" tick={{fontSize:9,fill:T.text3,fontFamily:'monospace'}} tickLine={false} tickFormatter={v=>`£${v}bn`}/>
                <YAxis type="category" dataKey="sector" tick={{fontSize:9,fill:T.text1}} tickLine={false} width={130}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="turnover" fill={T.blue} opacity={0.7} name="Turnover (£bn)" radius={[0,2,2,0]}/>
                <Bar dataKey="gva" fill={T.teal} opacity={0.8} name="GVA (£bn)" radius={[0,2,2,0]}/>
                <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
                NIABI 2024 — Key Sectoral Findings
              </div>
              <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:14}}>
                CONFIRMED ACTUALS · NISRA 11 MARCH 2026
              </div>
              {[
                {sector:'Construction',col:T.amber,text:'GVA +30.7% — added £1.7bn in a single year. Primary driver of the gap between NICEI (+3.6%) and NIABI aGVA (+9.6%). City Deal and infrastructure investment the primary cause.'},
                {sector:'Manufacturing',col:T.blue,text:'GVA +15.2% · turnover £14.7bn. Advanced engineering and agri-food processing leading. Windsor Framework access to EU market a structural tailwind for food manufacturers.'},
                {sector:'Distribution',col:T.teal,text:'GVA +14.5% · turnover £16.3bn (largest by turnover). Cross-border logistics and wholesale distribution benefiting from N-S trade boom.'},
                {sector:'ICT / Digital',col:T.purple,text:'Turnover £2.8bn · growing fastest per-employee. Undercounted in NIABI — excludes many platform and digital-native firms below survey threshold.'},
              ].map(s=>(
                <div key={s.sector} style={{borderLeft:`3px solid ${s.col}`,padding:'8px 12px',background:T.bg2,marginBottom:8,borderRadius:'0 4px 4px 0'}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.text0,marginBottom:3}}>{s.sector}</div>
                  <div style={{fontSize:11,color:T.text2,lineHeight:1.55}}>{s.text}</div>
                </div>
              ))}
            </div>
            <Insight type="weak" text="NIABI excludes agriculture, financial services, and the public sector. These three sectors account for approximately 35% of NI's total GVA. The confirmed £43.6bn aGVA figure covers the business economy only — total NI GVA including excluded sectors is estimated at approximately £55–58bn. No single published source gives a comprehensive total." />
          </div>
        </div>
      )}
    </div>
  )
}