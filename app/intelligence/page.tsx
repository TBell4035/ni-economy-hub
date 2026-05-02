'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { computeScore, computeCategory, CATEGORY_CONFIG } from '@/lib/scoring'
import type { IntelligenceEntry } from '@/lib/supabase'

const T = {
  bg0:'#07090d',bg1:'#0d1117',bg2:'#131920',bg3:'#192230',
  card:'#0f1620',border:'#1e2d3d',border2:'#243444',
  text0:'#eef2f7',text1:'#b8c8d8',text2:'#6a88a0',text3:'#3a5268',
  gold:'#e8a020',teal:'#12c4a4',blue:'#3a8fd4',red:'#e05050',
  green:'#38c070',amber:'#e89020',purple:'#9a70d4',
}

const SEED_ENTRIES: IntelligenceEntry[] = [
  {
    source_id:'THOMAS_BELL_LINKEDIN_MAR26',
    source_name:'Thomas Bell · Catalyst',
    source_quality:3,
    alignment:'extends',
    title:'Five charts from NISRA NIETS 2024 — and two questions',
    summary:'NI economy grew faster than UK last year. Cross-border trade has grown 6.5x since 2015. Business economy hit record £109.3bn turnover. Services exports up 35.5%. Two questions raised: (1) Is the dual-market opportunity under Windsor Framework being systematically exploited? (2) GB goods purchases fell 6.7% — are we trading one dependency for another?',
    url:'https://www.linkedin.com',
    published_date:'2026-03-12',
    module_relevance:['overview','trade','business'],
  },
  {
    source_id:'ESMOND_BIRNIE_NIETS_MAR26',
    source_name:'Esmond Birnie · Ulster University',
    source_quality:4,
    alignment:'challenges',
    title:'NIETS 2024: the picture is more complicated than the headline',
    summary:'Headline looks spectacular — record £109.3bn sales, aGVA up 9.6%. But sales of goods to GB grew just 0.8% while goods to Ireland grew 22%. Windsor Framework advocates will claim this as a dual-market win. But they need to explain why GB goods trade is growing so poorly. The picture is more complicated than the headline.',
    url:'https://www.ulster.ac.uk',
    published_date:'2026-03-11',
    module_relevance:['trade','output'],
  },
  {
    source_id:'PAUL_MAC_FLYNN_WAGES_MAR26',
    source_name:'Paul Mac Flynn · NERI',
    source_quality:4,
    alignment:'confirms',
    title:'HMRC RTI data: NI payroll employment and real wages',
    summary:'NI payroll employment up 0.4% YoY to 810k. Real wages still negative in adjusted terms — median £2,371 vs CPI 3.5%. The wage-productivity gap persists.',
    url:'https://www.nerinstitute.net',
    published_date:'2026-03-02',
    module_relevance:['labour','productivity'],
  },
  {
    source_id:'ADELE_BERGIN_ESRI_FEB26',
    source_name:'Adele Bergin · ESRI',
    source_quality:5,
    alignment:'extends',
    title:'Updated ESRI/NIESR NI macro model projections',
    summary:'Baseline 2.4% for 2026. Key upside risk: continued N-S trade integration. Key downside: UK fiscal tightening via block grant transmission. Paper out next month.',
    url:'https://www.esri.ie',
    published_date:'2026-03-01',
    module_relevance:['output','fiscal','scenarios'],
  },
  {
    source_id:'JOHN_CAMPBELL_BBC_MAR26',
    source_name:'John Campbell · BBC NI',
    source_quality:3,
    alignment:'confirms',
    title:'NIETS 2024: NI businesses sales to Ireland now half the size of GB sales',
    summary:'Total NI sales hit £109.3bn — a record. NI businesses sales to Ireland now £10.5bn, up 20% in one year. For context: NI→Ireland sales are now half the size of NI→GB sales (£20.1bn). That would have seemed extraordinary even 5 years ago. The Windsor Framework trade story is real, whatever the political argument about it.',
    url:'https://www.bbc.co.uk/news/northern-ireland',
    published_date:'2026-03-11',
    module_relevance:['trade','overview'],
  },
  {
    source_id:'NORTHSTAR_AI_DEC25',
    source_name:'NorthStar Briefing',
    source_quality:2,
    alignment:'extends',
    title:'NI\'s Year in AI — The Lessons We Learned, The Choices We Face',
    summary:'NI will not be immune to AI-related job losses. Service-heavy economy, large administrative workforce, relatively low productivity. AI will be a net gain over time, but the transition will not be painless. Need for independent body producing regular assessments of AI adoption, workforce impact and displacement patterns.',
    url:'https://northstarbriefing.substack.com/p/northern-irelands-year-in-ai-the',
    published_date:'2025-12-29',
    module_relevance:['ai','productivity','labour'],
  },
  {
    source_id:'PRODUCTIVITY_DASHBOARD_DEC25',
    source_name:'QUB / Productivity Institute',
    source_quality:5,
    alignment:'confirms',
    title:'NI Productivity Dashboard 2025',
    summary:'13 of 20 productivity drivers below UK average. Management practices: worst of 12 UK regions (0.52/1.0). Skills gap: highest in UK (10.7% lacking basic qualifications vs 6.9% UK avg). Productivity gap narrowed to 12.4% from 13.2%. NI moved from 10th to 8th place. Best absolute performance improvement since Dashboard began.',
    url:'https://www.productivity.ac.uk/research/northern-ireland-productivity-dashboard-2025/',
    published_date:'2025-12-04',
    module_relevance:['productivity','labour','business'],
  },
  {
    source_id:'NIFC_SR_RESPONSE_JUL25',
    source_name:'NI Fiscal Council',
    source_quality:5,
    alignment:'confirms',
    title:'NI Fiscal Council Response to 2025 Spending Review',
    summary:'SR provides £19.3bn/yr average 2026-29 for NI Executive — largest settlement since devolution. NI will continue to receive over 24% more per person than equivalent UK Government spending. Final Fiscal Framework negotiations remain outstanding. Holtham Review of NI relative need to be conducted.',
    url:'https://www.nifiscalcouncil.org',
    published_date:'2025-07-01',
    module_relevance:['fiscal','scenarios'],
  },
  {
    source_id:'LISA_WILSON_NERI_FEB26',
    source_name:'Lisa Wilson · NERI',
    source_quality:4,
    alignment:'confirms',
    title:'Unpicking NI inactivity: 43% long-term sick — a health system failure',
    summary:'43% of NI economic inactivity is long-term sick/disabled — that is a health system failure with direct economic consequences. Compare Scotland 38%, England 36%. NI waiting lists are not just a health crisis — they are an economic crisis.',
    url:'https://www.nerinstitute.net',
    published_date:'2026-02-26',
    module_relevance:['labour','fiscal'],
  },
  {
    source_id:'TRINITY_MICROSOFT_AI_APR26',
    source_name:'Trinity College Dublin / Microsoft Ireland',
    source_quality:5,
    alignment:'extends',
    title:'AI Economy Ireland 2026: Widening SME-Large Firm Gap',
    summary:'AI adoption near-universal at 92% of organisations. But just 10% describe deployment as advanced or frontier-level. SMEs reporting significant productivity gains: 18% vs 8% for large firms. Large firms twice as likely to deliver 2hr+ weekly time savings. SMEs twice as likely to have no formal AI training. Left unchecked, this divide risks becoming a structural drag.',
    url:'https://news.microsoft.com/source/emea/features/trinity-college-dublin-and-microsoft-ireland-research-shows-a-widening-ai-maturity-gap-between-smes-and-large-organisations/',
    published_date:'2026-04-29',
    module_relevance:['ai','productivity','business'],
  },
]

const MODULES = ['All','overview','output','labour','trade','fiscal','productivity','ai','business','scenarios']
const ALIGNMENTS = ['All','confirms','challenges','extends','unresolved']
const CATEGORIES = ['All','Strategic Intelligence','Active Review','Established']

export default function IntelligencePage() {
  const [entries, setEntries] = useState<IntelligenceEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [moduleFilter, setModuleFilter] = useState('All')
  const [alignFilter, setAlignFilter] = useState('All')
  const [catFilter, setCatFilter] = useState('All')
  const [feedback, setFeedback] = useState({name:'',organisation:'',comment:''})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(()=>{
    loadEntries()
  },[])

  const loadEntries = async () => {
    setLoading(true)
    try {
      const {data} = await supabase.from('intelligence_feed').select('*').order('published_date',{ascending:false})
      if(data && data.length > 0){
        setEntries(data)
      } else {
        const scored = SEED_ENTRIES.map(e=>({
          ...e,
          score: computeScore(e.source_quality, e.alignment),
          category: computeCategory(computeScore(e.source_quality, e.alignment), e.alignment),
        }))
        setEntries(scored)
      }
    } catch {
      const scored = SEED_ENTRIES.map(e=>({
        ...e,
        score: computeScore(e.source_quality, e.alignment),
        category: computeCategory(computeScore(e.source_quality, e.alignment), e.alignment),
      }))
      setEntries(scored)
    }
    setLoading(false)
  }

  const filtered = entries.filter(e=>{
    const modMatch = moduleFilter==='All' || e.module_relevance.includes(moduleFilter)
    const alignMatch = alignFilter==='All' || e.alignment===alignFilter
    const score = e.score ?? computeScore(e.source_quality, e.alignment)
    const cat = e.category ?? computeCategory(score, e.alignment)
    const catMatch = catFilter==='All' || cat===catFilter
    return modMatch && alignMatch && catMatch
  })

  const handleSubmit = async () => {
    if(!feedback.comment.trim()) return
    setSubmitting(true)
    try {
      await supabase.from('feedback').insert({
        module:'intelligence',
        name:feedback.name||null,
        organisation:feedback.organisation||null,
        comment:feedback.comment,
      })
      setSubmitted(true)
      setFeedback({name:'',organisation:'',comment:''})
    } catch {
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  const getScoreColor = (score:number, alignment:string) => {
    if(alignment==='unresolved') return T.amber
    if(score>=11) return T.gold
    if(score>=6) return T.red
    return T.green
  }

  const getAlignmentColor = (a:string) => {
    if(a==='confirms') return T.green
    if(a==='challenges') return T.red
    if(a==='extends') return T.gold
    return T.amber
  }

  return (
    <div style={{maxWidth:1100}} className="page-enter">
      <div style={{marginBottom:24}}>
        <div className="mono" style={{fontSize:9,letterSpacing:3,color:T.teal,marginBottom:6}}>
          MODULE 10 · INTELLIGENCE FEED
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text0,marginBottom:10,letterSpacing:-0.5}}>
          Intelligence Feed
        </h1>
        <p style={{fontSize:13,color:T.text2,maxWidth:720,lineHeight:1.7,marginBottom:10}}>
          Commentary, research and analysis from economists, journalists and institutions
          covering the NI economy. Each entry is scored using the confidence matrix:
          Source Quality (1–5) × Alignment Multiplier (Confirms ×1, Challenges ×2, Extends ×3,
          Unresolved +0). Scores 1–5 = Established · 6–10 = Active Review · 11–15 = Strategic Intelligence.
        </p>
        <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:4,padding:'10px 14px',marginBottom:14,fontSize:12,color:T.text2,lineHeight:1.6}}>
          <span className="mono" style={{fontSize:9,color:T.teal,marginRight:8,letterSpacing:2}}>◎ HOW TO USE</span>
          <strong style={{color:T.gold}}>Strategic Intelligence (11-15)</strong> sources are extending V3's analytical model into new territory — priority for incorporation.
          <strong style={{color:T.red}}> Active Review (6-10)</strong> sources challenge existing analysis — these trigger review flags on relevant modules.
          <strong style={{color:T.green}}> Established (1-5)</strong> sources validate existing analysis. Use the filters below to narrow by module, alignment or category.
        </div>
      </div>

      {/* Score legend */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
        {(Object.entries(CATEGORY_CONFIG) as [keyof typeof CATEGORY_CONFIG, typeof CATEGORY_CONFIG[keyof typeof CATEGORY_CONFIG]][]).map(([k,v])=>(
          <div key={k} style={{background:T.card,border:`1px solid ${v.borderColor}`,borderTop:`2px solid ${v.color}`,borderRadius:6,padding:'12px 14px'}}>
            <div className="mono" style={{fontSize:10,color:v.color,marginBottom:4}}>{k}</div>
            <div style={{fontSize:11,color:T.text2,lineHeight:1.5}}>{v.description}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:20}}>
        <div>
          <div className="mono" style={{fontSize:9,color:T.text3,marginBottom:6}}>MODULE</div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            {MODULES.map(m=>(
              <button key={m} onClick={()=>setModuleFilter(m)} style={{
                background:moduleFilter===m?`${T.teal}22`:'transparent',
                color:moduleFilter===m?T.teal:T.text3,
                border:`1px solid ${moduleFilter===m?T.teal:T.border}`,
                padding:'3px 10px',borderRadius:3,cursor:'pointer',
                fontSize:9,fontFamily:'monospace',letterSpacing:1,
                textTransform:'uppercase',transition:'all 0.12s',
              }}>{m}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="mono" style={{fontSize:9,color:T.text3,marginBottom:6}}>ALIGNMENT</div>
          <div style={{display:'flex',gap:4}}>
            {ALIGNMENTS.map(a=>(
              <button key={a} onClick={()=>setAlignFilter(a)} style={{
                background:alignFilter===a?`${T.blue}22`:'transparent',
                color:alignFilter===a?T.blue:T.text3,
                border:`1px solid ${alignFilter===a?T.blue:T.border}`,
                padding:'3px 10px',borderRadius:3,cursor:'pointer',
                fontSize:9,fontFamily:'monospace',letterSpacing:1,
                textTransform:'uppercase',transition:'all 0.12s',
              }}>{a}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="mono" style={{fontSize:9,color:T.text3,marginBottom:6}}>CATEGORY</div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            {CATEGORIES.map(c=>(
              <button key={c} onClick={()=>setCatFilter(c)} style={{
                background:catFilter===c?`${T.gold}22`:'transparent',
                color:catFilter===c?T.gold:T.text3,
                border:`1px solid ${catFilter===c?T.gold:T.border}`,
                padding:'3px 10px',borderRadius:3,cursor:'pointer',
                fontSize:9,fontFamily:'monospace',letterSpacing:1,
                textTransform:'uppercase',transition:'all 0.12s',
              }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{color:T.text3,fontFamily:'monospace',fontSize:12,padding:'20px 0'}}>Loading feed...</div>
      ) : (
        <div style={{marginBottom:32}}>
          {filtered.length===0 && (
            <div style={{color:T.text3,fontFamily:'monospace',fontSize:12,padding:'20px 0'}}>
              No entries match current filters.
            </div>
          )}
          {filtered.map((e,i)=>{
            const score = e.score ?? computeScore(e.source_quality, e.alignment)
            const cat = e.category ?? computeCategory(score, e.alignment)
            const catConfig = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]
            return (
              <div key={i} style={{
                background:T.card,border:`1px solid ${T.border}`,
                borderLeft:`3px solid ${catConfig.color}`,
                borderRadius:'0 6px 6px 0',
                padding:16,marginBottom:12,
              }}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10,flexWrap:'wrap',gap:8}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:2}}>{e.title}</div>
                    <div className="mono" style={{fontSize:10,color:T.text3}}>{e.source_name} · {e.published_date}</div>
                  </div>
                  <div style={{display:'flex',gap:6,flexShrink:0,flexWrap:'wrap'}}>
                    <span style={{
                      background:`${getAlignmentColor(e.alignment)}18`,
                      border:`1px solid ${getAlignmentColor(e.alignment)}44`,
                      color:getAlignmentColor(e.alignment),
                      padding:'2px 8px',borderRadius:2,
                      fontSize:9,fontFamily:'monospace',letterSpacing:1,
                      textTransform:'uppercase',
                    }}>{e.alignment}</span>
                    <span style={{
                      background:`${catConfig.color}18`,
                      border:`1px solid ${catConfig.color}44`,
                      color:catConfig.color,
                      padding:'2px 8px',borderRadius:2,
                      fontSize:9,fontFamily:'monospace',letterSpacing:1,
                    }}>{cat}</span>
                    <span style={{
                      background:`${getScoreColor(score,e.alignment)}18`,
                      border:`1px solid ${getScoreColor(score,e.alignment)}44`,
                      color:getScoreColor(score,e.alignment),
                      padding:'2px 8px',borderRadius:2,
                      fontSize:9,fontFamily:'monospace',letterSpacing:1,
                    }}>SCORE {score}/15</span>
                    <span style={{
                      background:T.bg2,border:`1px solid ${T.border}`,
                      color:T.text3,padding:'2px 8px',borderRadius:2,
                      fontSize:9,fontFamily:'monospace',letterSpacing:1,
                    }}>Q{e.source_quality}/5</span>
                  </div>
                </div>
                <p style={{fontSize:12,color:T.text2,lineHeight:1.65,marginBottom:10}}>{e.summary}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    {e.module_relevance.map(m=>(
                      <span key={m} style={{
                        background:T.bg3,color:T.teal,
                        padding:'1px 6px',borderRadius:2,
                        fontSize:9,fontFamily:'monospace',
                      }}>{m}</span>
                    ))}
                  </div>
                  <a href={e.url} target="_blank" rel="noopener noreferrer"
                    style={{fontSize:10,color:T.teal,fontFamily:'monospace',textDecoration:'none'}}>
                    Source →
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Feedback form */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:24}}>
        <div style={{fontSize:13,fontWeight:700,color:T.text0,marginBottom:4}}>
          Submit Feedback or Flag Data
        </div>
        <div className="mono" style={{fontSize:10,color:T.text3,marginBottom:16}}>
          SUGGEST A SOURCE · CHALLENGE ANALYSIS · FLAG AN ERROR · NOMINATE AN ECONOMIST
        </div>
        {submitted ? (
          <div style={{background:'#081a10',border:'1px solid #1e3a20',borderRadius:4,padding:'12px 16px',fontSize:12,color:T.green}}>
            ✓ Feedback received. All submissions are reviewed and incorporated where appropriate.
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <input
              placeholder="Name (optional)"
              value={feedback.name}
              onChange={e=>setFeedback(p=>({...p,name:e.target.value}))}
              style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:4,padding:'8px 12px',color:T.text1,fontSize:12,fontFamily:'monospace',outline:'none'}}
            />
            <input
              placeholder="Organisation (optional)"
              value={feedback.organisation}
              onChange={e=>setFeedback(p=>({...p,organisation:e.target.value}))}
              style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:4,padding:'8px 12px',color:T.text1,fontSize:12,fontFamily:'monospace',outline:'none'}}
            />
            <textarea
              placeholder="Your feedback, data challenge, source suggestion or error flag..."
              value={feedback.comment}
              onChange={e=>setFeedback(p=>({...p,comment:e.target.value}))}
              rows={4}
              style={{gridColumn:'1/-1',background:T.bg2,border:`1px solid ${T.border}`,borderRadius:4,padding:'8px 12px',color:T.text1,fontSize:12,fontFamily:'monospace',outline:'none',resize:'vertical'}}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting||!feedback.comment.trim()}
              style={{
                gridColumn:'1/-1',
                background:feedback.comment.trim()?`${T.teal}22`:'transparent',
                border:`1px solid ${feedback.comment.trim()?T.teal:T.border}`,
                color:feedback.comment.trim()?T.teal:T.text3,
                padding:'10px',borderRadius:4,cursor:feedback.comment.trim()?'pointer':'default',
                fontSize:11,fontFamily:'monospace',letterSpacing:1,transition:'all 0.15s',
              }}
            >
              {submitting?'Submitting...':'Submit Feedback →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}