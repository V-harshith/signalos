import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, BarChart3, CalendarDays, Check, ChevronRight, FileText, Lightbulb, Linkedin, Menu, Plus, Quote, ShieldCheck, Sparkles, Target, X, Zap } from 'lucide-react'

type View = 'home' | 'strategy' | 'create' | 'plan' | 'insights'
type Draft = { id: string; platform: 'LinkedIn' | 'X'; text: string; status: 'Draft' | 'Ready'; date: string }
type Workspace = { company: string; audience: string; promise: string; voice: string; pillars: string[]; idea: string; evidence: string; drafts: Draft[] }

const STORAGE_KEY = 'signalos.workspace.v1'

const nav: { id: View; label: string; icon: typeof Target }[] = [
  { id: 'home', label: 'Overview', icon: BarChart3 },
  { id: 'strategy', label: 'Brand strategy', icon: Target },
  { id: 'create', label: 'Idea studio', icon: Sparkles },
  { id: 'plan', label: 'Content plan', icon: CalendarDays },
  { id: 'insights', label: 'Weekly insights', icon: Lightbulb },
]

const initialDrafts: Draft[] = [
  { id: 'demo-linkedin-1', platform: 'LinkedIn', status: 'Ready', date: 'Tue, 9:30 AM', text: 'Most early-stage founders don’t have a content problem.\n\nThey have an evidence problem.\n\nLast quarter, we reviewed 127 founder posts. The strongest ones didn’t start with a hot take—they started with something the founder had actually observed.\n\nA customer objection. A failed experiment. A number that changed their mind.\n\nYour experience is the moat. Document it before you decorate it.' },
  { id: 'demo-x-1', platform: 'X', status: 'Draft', date: 'Thu, 11:00 AM', text: 'Most founders don’t have a content problem.\n\nThey have an evidence problem.\n\nThe best posts start with something real:\n→ a customer objection\n→ a failed experiment\n→ a number that changed your mind\n\nYour experience is the moat. Document it.' },
]

const defaults: Workspace = {
  company: 'Northstar Studio',
  audience: 'B2B SaaS founders building their first repeatable growth engine',
  promise: 'Turn hard-won operating experience into a trusted founder brand',
  voice: 'Clear, candid, useful—not performative',
  pillars: ['Founder-led growth', 'Evidence over opinion', 'Building in public'],
  idea: 'Founders do not need more content prompts. They need a system for noticing what they already know.',
  evidence: 'In 12 client interviews, 9 founders said their best-performing posts came from customer calls or internal decisions—not brainstorms.',
  drafts: initialDrafts,
}

function loadWorkspace(): Workspace {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaults
    const parsed = JSON.parse(saved) as Partial<Workspace>
    return {
      ...defaults,
      ...parsed,
      pillars: Array.isArray(parsed.pillars) ? parsed.pillars.filter((x): x is string => typeof x === 'string') : defaults.pillars,
      drafts: Array.isArray(parsed.drafts) ? parsed.drafts.filter((d): d is Draft => Boolean(d && typeof d.id === 'string' && typeof d.text === 'string')) : defaults.drafts,
    }
  } catch {
    return defaults
  }
}

function App() {
  const [view, setView] = useState<View>('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [workspace, setWorkspace] = useState(loadWorkspace)
  const { company, audience, promise, voice, pillars, idea, evidence, drafts } = workspace
  const patch = <K extends keyof Workspace>(key: K, value: Workspace[K]) => setWorkspace(current => ({ ...current, [key]: value }))
  const [generated, setGenerated] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace)) } catch { /* Keep the app usable when storage is unavailable. */ }
  }, [workspace])

  const activeLabel = nav.find((item) => item.id === view)?.label
  const completion = useMemo(() => [company, audience, promise, voice].filter(Boolean).length * 25, [company, audience, promise, voice])

  function go(next: View) { setView(next); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function generate() {
    const proof = evidence.trim() || 'The strongest ideas are grounded in lived experience.'
    const thesis = idea.trim() || 'Expertise becomes memorable when it is made specific.'
    const batch = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    patch('drafts', [
      { id: `draft-${batch}-linkedin`, platform: 'LinkedIn', status: 'Draft', date: 'Unscheduled', text: `${thesis}\n\nHere’s the evidence:\n\n${proof}\n\nThe takeaway is simple: don’t manufacture authority. Capture the moments that earned it.\n\nWhat are you noticing in your work right now?` },
      { id: `draft-${batch}-x`, platform: 'X', status: 'Draft', date: 'Unscheduled', text: `${thesis}\n\nProof: ${proof}\n\nDon’t manufacture authority. Capture the moments that earned it.` },
      ...drafts,
    ])
    setGenerated(true)
  }

  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Zap size={18} fill="currentColor" /></span><span>Signal<span>OS</span></span></div>
      <button className="close-menu" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></button>
      <div className="workspace"><div className="avatar">NS</div><div><strong>{company || 'Your brand'}</strong><small>Founder workspace</small></div><ChevronRight size={16} /></div>
      <nav aria-label="Main navigation">{nav.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => go(item.id)}><item.icon size={18} /><span>{item.label}</span>{item.id === 'create' && <em>2</em>}</button>)}</nav>
      <div className="sidebar-foot"><div className="human-card"><ShieldCheck size={20} /><div><strong>Human-approved</strong><p>Nothing publishes without you.</p></div></div><div className="profile"><div className="avatar dark">AD</div><div><strong>Alex Doe</strong><small>Free workspace</small></div></div></div>
    </aside>
    {mobileOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <div className="main-wrap">
      <header><button className="menu-btn" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu /></button><span className="crumb">Workspace <ChevronRight size={14} /> <strong>{activeLabel}</strong></span><button className="new-idea" onClick={() => go('create')}><Plus size={17} /> New idea</button></header>
      <main id="main">
        {view === 'home' && <Dashboard go={go} completion={completion} drafts={drafts} />}
        {view === 'strategy' && <Strategy company={company} setCompany={v=>patch('company',v)} audience={audience} setAudience={v=>patch('audience',v)} promise={promise} setPromise={v=>patch('promise',v)} voice={voice} setVoice={v=>patch('voice',v)} pillars={pillars} setPillars={v=>patch('pillars',v)} completion={completion} go={go} />}
        {view === 'create' && <Studio idea={idea} setIdea={v=>patch('idea',v)} evidence={evidence} setEvidence={v=>patch('evidence',v)} generate={generate} generated={generated} drafts={drafts.slice(0,2)} go={go} edit={setEditingId} />}
        {view === 'plan' && <Plan drafts={drafts} edit={setEditingId} go={go} />}
        {view === 'insights' && <Insights go={go} />}
      </main>
    </div>
    {editingId && <DraftEditor draft={drafts.find(d=>d.id===editingId)} close={()=>setEditingId(null)} save={updated=>{patch('drafts',drafts.map(d=>d.id===updated.id?updated:d));setEditingId(null)}} />}
  </div>
}

function PageHead({ eyebrow, title, text, action }: { eyebrow?: string; title: string; text: string; action?: React.ReactNode }) {
  return <div className="page-head"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{text}</p></div>{action}</div>
}

function Dashboard({ go, completion, drafts }: { go: (v: View) => void; completion: number; drafts: Draft[] }) {
  return <>
    <section className="hero"><div className="hero-copy"><span className="eyebrow light">WEEK OF MAY 20</span><h1>Your expertise is the signal.<br/><em>Make it travel.</em></h1><p>Turn what you’re learning, seeing, and proving into distinct content for LinkedIn and X.</p><button className="primary inverse" onClick={() => go('create')}>Capture an idea <ArrowRight size={17}/></button></div><div className="signal-art" aria-hidden="true"><div className="orbit o1"></div><div className="orbit o2"></div><div className="pulse"><Zap fill="currentColor" /></div><span className="dot d1"></span><span className="dot d2"></span><span className="dot d3"></span></div></section>
    <div className="metric-row"><article><span className="metric-icon coral"><FileText /></span><div><strong>{drafts.length}</strong><small>Drafts in queue</small></div><span className="trend">+2 this week</span></article><article><span className="metric-icon green"><Target /></span><div><strong>{completion}%</strong><small>Strategy complete</small></div><button onClick={() => go('strategy')}>Review</button></article><article><span className="metric-icon purple"><Sparkles /></span><div><strong>3</strong><small>Ideas captured</small></div><span className="trend">Best: proof-led</span></article></div>
    <div className="section-title"><div><span className="eyebrow">TODAY’S FOCUS</span><h2>Move one idea forward</h2></div><button className="text-btn" onClick={() => go('plan')}>View content plan <ArrowRight size={15}/></button></div>
    <div className="focus-grid"><article className="task-card accent"><div className="task-top"><span className="number">01</span><span className="tag">RECOMMENDED</span></div><Quote size={25}/><h3>Turn a customer objection into a point of view</h3><p>Your “evidence over opinion” pillar has a gap this week. Start from a real conversation.</p><button className="primary" onClick={() => go('create')}>Start writing <ArrowRight size={16}/></button></article><article className="task-card"><div className="task-top"><span className="number">02</span><span className="platform linkedin"><Linkedin size={13}/> LINKEDIN</span></div><div className="mini-preview"><span>READY FOR REVIEW</span><p>Most early-stage founders don’t have a content problem...</p></div><h3>Review Tuesday’s draft</h3><p>Proof-led post · Founder-led growth</p><button className="secondary" onClick={() => go('plan')}>Review draft</button></article><article className="task-card insight-mini"><div className="task-top"><span className="number">03</span><span className="tag neutral">EXPERIMENT</span></div><BarChart3 size={26}/><h3>Test a sharper opening</h3><p>Your direct observations hold attention better than broad advice. Try leading with the finding.</p><button className="secondary" onClick={() => go('insights')}>See recommendation</button></article></div>
  </>
}

type StrategyProps = { company:string; setCompany:(v:string)=>void; audience:string; setAudience:(v:string)=>void; promise:string; setPromise:(v:string)=>void; voice:string; setVoice:(v:string)=>void; pillars:string[]; setPillars:(v:string[])=>void; completion:number; go:(v:View)=>void }
function Strategy(p: StrategyProps) {
  const [newPillar, setNewPillar] = useState('')
  return <><PageHead eyebrow="YOUR FOUNDATION" title="Build a recognizable point of view" text="Give SignalOS enough context to keep every draft specific, credible, and unmistakably yours." action={<div className="completion"><span>{p.completion}% complete</span><div><i style={{width:`${p.completion}%`}}/></div></div>} />
  <div className="two-col"><section className="panel form-panel"><div className="panel-head"><span className="step">1</span><div><h2>Positioning</h2><p>Who you help and why your perspective matters.</p></div></div><label>Brand or company<input value={p.company} onChange={e=>p.setCompany(e.target.value)} /></label><label>Core audience<textarea rows={3} value={p.audience} onChange={e=>p.setAudience(e.target.value)} /></label><label>Core promise<textarea rows={3} value={p.promise} onChange={e=>p.setPromise(e.target.value)} /></label><label>Voice in one sentence<input value={p.voice} onChange={e=>p.setVoice(e.target.value)} /></label></section>
  <div><section className="panel"><div className="panel-head"><span className="step">2</span><div><h2>Content pillars</h2><p>The recurring territory you want to own.</p></div></div><div className="pillar-list">{p.pillars.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><strong>{x}</strong><button aria-label={`Remove ${x}`} onClick={()=>p.setPillars(p.pillars.filter(y=>y!==x))}><X size={15}/></button></div>)}</div><div className="inline-add"><input placeholder="Add a pillar" value={newPillar} onChange={e=>setNewPillar(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&newPillar.trim()){p.setPillars([...p.pillars,newPillar.trim()]);setNewPillar('')}}}/><button onClick={()=>{if(newPillar.trim()){p.setPillars([...p.pillars,newPillar.trim()]);setNewPillar('')}}}><Plus size={17}/> Add</button></div></section><section className="tip"><Lightbulb/><div><strong>Strong pillars create constraints</strong><p>Choose 3–5 themes where your experience gives you an unfair advantage.</p></div></section><button className="primary wide" onClick={()=>p.go('create')}>Save strategy & capture an idea <ArrowRight size={17}/></button></div></div></>
}

type StudioProps={idea:string;setIdea:(v:string)=>void;evidence:string;setEvidence:(v:string)=>void;generate:()=>void;generated:boolean;drafts:Draft[];go:(v:View)=>void;edit:(id:string)=>void}
function Studio(p:StudioProps){return <><PageHead eyebrow="IDEA STUDIO" title="Start with what you know" text="Capture one useful observation and the evidence behind it. We’ll shape it for each platform—without flattening your voice."/><div className="studio-layout"><section className="panel capture"><div className="capture-step"><span>01</span><div><h2>What’s the idea?</h2><p>Write it plainly. A rough thought is enough.</p></div></div><textarea aria-label="Idea" rows={6} value={p.idea} onChange={e=>p.setIdea(e.target.value)} placeholder="Something you noticed, learned, or changed your mind about..."/><div className="capture-step"><span>02</span><div><h2>What makes it true?</h2><p>Add a source, result, story, or direct observation.</p></div></div><textarea aria-label="Evidence" rows={6} value={p.evidence} onChange={e=>p.setEvidence(e.target.value)} placeholder="A customer quote, data point, experiment, or firsthand experience..."/><div className="evidence-types"><span>Evidence type</span><button className="selected"><Check size={14}/> Firsthand observation</button><button>Customer signal</button><button>Data / result</button></div><button className="primary wide" onClick={p.generate}><Sparkles size={17}/> Transform into platform drafts</button></section><section className="preview-side"><div className="preview-label"><span>PLATFORM PREVIEW</span><small>{p.generated?'Fresh drafts generated':'Live template preview'}</small></div>{p.drafts.map(d=><DraftCard key={d.id} draft={d} edit={p.edit}/>) }<p className="safe-note"><ShieldCheck size={16}/> Drafts stay private until you review and publish manually.</p>{p.generated&&<button className="primary wide" onClick={()=>p.go('plan')}>Add drafts to content plan <ArrowRight size={16}/></button>}</section></div></>}

function DraftCard({draft,edit}:{draft:Draft;edit:(id:string)=>void}){return <article className="draft-card"><div className="draft-head"><span className={draft.platform==='LinkedIn'?'platform linkedin':'platform x'}>{draft.platform==='LinkedIn'?<Linkedin size={14}/>:<X size={14}/>} {draft.platform}</span><span className="status">{draft.status}</span></div><p>{draft.text}</p><div className="draft-foot"><span>{draft.text.length} characters</span><button onClick={()=>edit(draft.id)}>Refine</button></div></article>}

function Plan({drafts,edit,go}:{drafts:Draft[];edit:(id:string)=>void;go:(v:View)=>void}){const days=['MON 20','TUE 21','WED 22','THU 23','FRI 24'];return <><PageHead eyebrow="CONTENT PLAN" title="A focused week, not a content treadmill" text="Review your queue across LinkedIn and X. Keep the cadence sustainable and every post human-approved." action={<button className="primary" onClick={()=>go('create')}><Plus size={16}/> Add idea</button>}/><div className="calendar">{days.map((day,i)=><div className={`day ${i===1||i===3?'has-post':''}`} key={day}><strong>{day}</strong>{i===1&&<CalendarCard draft={drafts[0]}/>} {i===3&&<CalendarCard draft={drafts[1]}/>} {i!==1&&i!==3&&<button className="add-slot" onClick={()=>go('create')}><Plus size={16}/> Add</button>}</div>)}</div><div className="queue-head"><h2>Draft queue</h2><span>{drafts.length} items</span></div><div className="queue">{drafts.map(d=><article key={d.id}><span className={d.platform==='LinkedIn'?'social-badge li':'social-badge tw'}>{d.platform==='LinkedIn'?<Linkedin/>:<X/>}</span><div><strong>{d.text.split('\n')[0]}</strong><small>{d.platform} · {d.date}</small></div><span className={`status-pill ${d.status.toLowerCase()}`}>{d.status}</span><button className="secondary" onClick={()=>edit(d.id)}>Edit</button></article>)}</div></>}
function CalendarCard({draft}:{draft?:Draft}){if(!draft)return null;return <div className="cal-card"><span className={draft.platform==='LinkedIn'?'platform linkedin':'platform x'}>{draft.platform}</span><p>{draft.text.split('\n')[0]}</p><small>{draft.date.split(', ')[1]||'Unscheduled'}</small></div>}

function DraftEditor({draft,close,save}:{draft?:Draft;close:()=>void;save:(d:Draft)=>void}) {
  const [form,setForm]=useState<Draft|undefined>(draft)
  const textRef=useRef<HTMLTextAreaElement>(null)
  useEffect(()=>{textRef.current?.focus();const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};document.addEventListener('keydown',onKey);document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow=''}},[close])
  if(!form)return null
  return <div className="dialog-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}><section className="draft-dialog" role="dialog" aria-modal="true" aria-labelledby="draft-dialog-title"><div className="dialog-head"><div><span className="eyebrow">DRAFT REVIEW</span><h2 id="draft-dialog-title">Refine your draft</h2></div><button className="dialog-close" onClick={close} aria-label="Close draft editor"><X/></button></div><label htmlFor="draft-text">Draft text</label><textarea ref={textRef} id="draft-text" rows={12} value={form.text} onChange={e=>setForm({...form,text:e.target.value})}/><div className="dialog-grid"><label htmlFor="draft-platform">Platform<select id="draft-platform" value={form.platform} onChange={e=>setForm({...form,platform:e.target.value as Draft['platform']})}><option>LinkedIn</option><option>X</option></select></label><label htmlFor="draft-status">Status<select id="draft-status" value={form.status} onChange={e=>setForm({...form,status:e.target.value as Draft['status']})}><option>Draft</option><option>Ready</option></select></label></div><label htmlFor="draft-date">Schedule label<input id="draft-date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><div className="dialog-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" onClick={()=>save(form)} disabled={!form.text.trim()}>Save changes</button></div></section></div>
}

function Insights({go}:{go:(v:View)=>void}){return <><PageHead eyebrow="WEEKLY SIGNAL" title="Learn what to do next—not just what happened" text="Directional recommendations based on your local demo activity. No fabricated reach, engagement, or audience metrics."/><section className="insight-hero"><div><span className="eyebrow light">THIS WEEK’S PATTERN</span><h2>Your specificity is your advantage.</h2><p>Ideas grounded in customer language and firsthand observations are the clearest expression of your positioning.</p></div><div className="score-ring"><strong>8.4</strong><span>Evidence<br/>strength</span></div></section><div className="recommend-grid"><article><span className="rec-num">01</span><div className="rec-icon coral"><Quote/></div><h3>Lead with the observed detail</h3><p>Replace broad opening advice with the surprising thing you saw or heard. It earns attention without manufacturing controversy.</p><div className="example"><small>TRY THIS</small><p>“9 of 12 founders told us their best post began in a customer call.”</p></div><button className="text-btn" onClick={()=>go('create')}>Use this prompt <ArrowRight size={15}/></button></article><article><span className="rec-num">02</span><div className="rec-icon green"><Target/></div><h3>Fill your pillar gap</h3><p>“Building in public” has no planned idea this week. Share one decision in progress and the tradeoff behind it.</p><div className="pillar-meter"><div><span>Founder-led growth</span><b>2</b></div><div><span>Evidence over opinion</span><b>1</b></div><div className="low"><span>Building in public</span><b>0</b></div></div><button className="text-btn" onClick={()=>go('create')}>Capture a decision <ArrowRight size={15}/></button></article><article><span className="rec-num">03</span><div className="rec-icon purple"><Zap/></div><h3>Run one clean experiment</h3><p>On X, test a single-sentence thesis against a short proof-led thread. Change only the format so the learning is useful.</p><div className="experiment"><span>A</span><p>Single thesis</p><span>B</span><p>Proof-led thread</p></div><button className="text-btn" onClick={()=>go('plan')}>Add to plan <ArrowRight size={15}/></button></article></div><div className="integrity-banner"><ShieldCheck/><div><strong>Honest signals only</strong><p>SignalOS never invents performance data. Future analytics will use official platform connections and clearly distinguish measured results from recommendations.</p></div></div></>}

export default App
