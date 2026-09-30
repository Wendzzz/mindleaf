import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { COVERS } from '../../data.js'
import { TIMES, useNav } from '../nav.js'
import { Btn, I, Leaf, TabBar, Top, Week } from '../parts.jsx'

const ease = [0.16, 1, 0.3, 1]

export function Home() {
  const { go, state } = useNav()
  const done = state.dayDone
  const streak = done ? 12 : 11
  const t = TIMES[state.time]
  return (
    <div className="screen">
      <div className="body home">
        <div className="row-between">
          <div className="stack-2">
            <span className="muted-sm">Thursday, 1 October</span>
            <h1 className="h1 md">Good morning, Ada</h1>
          </div>
          <button type="button" className="streak-chip" aria-label={`${streak} day streak`} onClick={() => go('profile')}>
            <span className="dot done"><I.check color="#16181B" /></span>{streak}
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div key="done" className="today-card done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <span className="today-label">Day 4 done</span>
              <span className="today-title">See you tomorrow.</span>
              <span className="today-meta">Day 5 · Stack it on what you already do · {t.time}</span>
              <Btn kind="ghost-dark" onClick={() => go('journal')}>Read what you wrote</Btn>
            </motion.div>
          ) : (
            <motion.div key="todo" className="today-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Leaf color="#FF8A45" size={150} style={{ position: 'absolute', right: -34, top: -30, opacity: 0.18 }} />
              <div className="row-between rel"><span className="today-label">Today · Day 4 of 14</span><span className="today-meta">8 min</span></div>
              <div className="stack-2 rel"><span className="today-title">The cue comes first</span><span className="today-meta">Atomic Habits · Part 2</span></div>
              <div className="ticks rel" aria-label="3 of 14 days done">{Array.from({ length: 14 }, (_, i) => <span key={i} className={i < 3 ? 'done' : i === 3 ? 'now' : ''} />)}</div>
              <div className="row-10 rel">
                <Btn onClick={() => go('reading')}>Start reading <I.arrow /></Btn>
                <button type="button" className="round-btn" aria-label="Listen instead" onClick={() => go('reading')}><I.headphones /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="stack-10">
          <div className="row-between"><h2 className="h2">This week</h2><span className="muted-sm">2 grace days left</span></div>
          <Week doneThrough={3} todayDone={done} />
        </div>

        <div className="stack-10">
          <div className="row-between"><h2 className="h2">Your plans</h2><button type="button" className="link" onClick={() => go('library')}>Find more</button></div>
          <div className="plans-row">
            {[
              { id: 'plan', cover: COVERS.atomic, title: 'Atomic Habits', pct: done ? 29 : 21 },
              { id: 'club', cover: COVERS.money, title: 'The Psychology of Money', pct: 38, tag: 'Book club' },
              { id: 'plan', cover: COVERS.deep, title: 'Deep Work', pct: 10 },
            ].map((p) => (
              <button key={p.title} type="button" className="plan-card" onClick={() => go(p.id)}>
                <span className="plan-card-cover"><img src={p.cover} alt="" />{p.tag && <span className="tag-dark">{p.tag}</span>}</span>
                <span className="plan-card-title">{p.title}</span>
                <span className="bar-row"><span className="bar"><span style={{ width: `${p.pct}%` }} /></span><span>{p.pct}%</span></span>
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="demo-link" onClick={() => go('welcomeback')}>Preview: what happens if you miss a day</button>
      </div>
      <TabBar active="home" />
    </div>
  )
}

const DAYS = [
  [1, 'Tiny changes add up'], [2, 'Become the person first'], [3, 'The four steps of a habit'], [4, 'The cue comes first'], [5, 'Stack it on what you already do'], [6, 'Design your space'],
]
export function Plan() {
  const { go, state } = useNav()
  const [tab, setTab] = useState('days')
  const done = state.dayDone
  return (
    <div className="screen">
      <Top back="home" right={<button type="button" className="icon-btn" aria-label="Share plan"><I.share /></button>}><span className="flex-1" /></Top>
      <div className="body">
        <div className="plan-head">
          <img src={COVERS.atomic} alt="Atomic Habits by James Clear" />
          <div className="stack-6"><h1 className="h1 md">Atomic Habits</h1><span className="muted-sm">James Clear</span><span className="strong-sm">14 days · 8 min a day</span></div>
        </div>
        <div className="panel stack-10">
          <div className="row-between"><strong>{done ? 4 : 3} of 14 days done</strong><span className="muted-sm">Finishes 11 Oct</span></div>
          <div className="bar thick"><span style={{ width: `${((done ? 4 : 3) / 14) * 100}%` }} /></div>
        </div>
        <div className="seg" role="tablist" aria-label="Plan sections">
          {[['days', 'Days'], ['about', 'About'], ['notes', 'My notes']].map(([id, l]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{l}</button>
          ))}
        </div>
        {tab === 'days' && (
          <div className="day-list">
            {DAYS.map(([n, title]) => {
              const isDone = n < 4 || (n === 4 && done)
              const isToday = n === 4 && !done
              if (isToday) return (
                <button key={n} type="button" className="day-row today" onClick={() => go('reading')}>
                  <span className="day-num orange">{n}</span><span className="stack-2 flex-1"><span className="accent-sm">Today · 8 min</span><strong>{title}</strong></span><I.arrow />
                </button>
              )
              return (
                <div key={n} className={`day-row ${isDone ? '' : 'locked'}`}>
                  <span className={`day-num ${isDone ? 'green' : 'dashed'}`}>{isDone ? <I.check color="#FFFFFF" /> : n}</span>
                  <span className="stack-2 flex-1"><span className="muted-sm">{n === (done ? 5 : 5) && !isDone ? 'Tomorrow' : `Day ${n}`}</span><span className="day-title">{title}</span></span>
                  {!isDone && <I.lock />}
                </div>
              )
            })}
          </div>
        )}
        {tab === 'about' && (
          <div className="stack-16">
            <p className="lede">Small habits, repeated daily, quietly shape who you become. Over fourteen mornings this plan walks through the book’s main ideas and turns each one into something you can try the same day.</p>
            <div className="stack-8 body-sm"><span><strong>Part 1</strong> · Days 1–3 · Why small habits matter</span><span><strong>Part 2</strong> · Days 4–8 · Make it obvious and easy</span><span><strong>Part 3</strong> · Days 9–14 · Make it stick</span></div>
            <div className="note-row"><I.book /><span>{state.mode === 'own' ? 'You’re reading your own copy. Each day lists the pages to read.' : 'Reading your own copy? Each day can list the pages to read instead.'}</span></div>
          </div>
        )}
        {tab === 'notes' && (
          <div className="stack-10">
            <div className="entry"><span className="entry-kind">Day 3 · Reflection</span><span className="entry-text">My evening scroll is a reward I don’t even enjoy.</span></div>
            <div className="entry peach"><span className="entry-kind accent">Day 2 · Highlight</span><span className="entry-text">Decide who you want to be, then prove it with small wins.</span></div>
          </div>
        )}
      </div>
      <div className="foot"><Btn onClick={() => go(done ? 'home' : 'reading')}>{done ? 'Day 5 opens tomorrow' : 'Continue Day 4'}</Btn></div>
    </div>
  )
}

const AUDIO_SECONDS = 485
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
export function Reading() {
  const { go } = useNav()
  const bodyRef = useRef(null)
  const [read, setRead] = useState(0)
  const [saved, setSaved] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(192)
  useEffect(() => {
    if (!playing) return undefined
    const t = setInterval(() => setPos((p) => Math.min(AUDIO_SECONDS, p + 1)), 1000)
    return () => clearInterval(t)
  }, [playing])
  const onScroll = () => {
    const el = bodyRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    setRead(max > 0 ? el.scrollTop / max : 1)
  }
  return (
    <div className="screen">
      <Top close="home" title={<span className="stack-0 center"><strong>Day 4 of 14</strong><span className="muted-xs">Atomic Habits</span></span>} right={<button type="button" className="icon-btn text-size" aria-label="Text size">Aa</button>} />
      <div className="read-bar" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(read * 100)}><motion.span animate={{ scaleX: Math.max(0.04, read) }} transition={{ duration: 0.15 }} /></div>
      <article className="body reading" ref={bodyRef} onScroll={onScroll}>
        <span className="eyebrow">8 min · Part 2, make it obvious</span>
        <h1 className="h1">The cue comes first.</h1>
        <p>Every habit starts with something you notice. A phone on the table, a smell from the kitchen, the time on the clock. <mark>Before you can change what you do, you have to see what prompts it.</mark></p>
        <div className="idea"><span className="eyebrow orange">Today’s idea</span><span>Make the good cues easy to see. Hide the ones that pull you off course.</span></div>
        <p>Most cues work quietly. You don’t decide to scroll; the phone is simply there, and your hand reaches for it. The same is true of the good habits you want: if the book is on the shelf in another room, you won’t pick it up.</p>
        <p>So start by looking. Walk through your home and notice what each space invites you to do. The sofa facing the television invites watching. The phone charging by your bed invites scrolling before you are fully awake.</p>
        <p>Then change one thing. Put the book on your pillow. Move the phone charger to the kitchen. You don’t need more willpower; you need a room that makes the right choice the easy one.</p>
      </article>
      <div className="audio">
        <button type="button" className="audio-play" aria-label={playing ? 'Pause audio' : 'Play audio'} onClick={() => setPlaying((p) => !p)}>{playing ? <I.pause /> : <I.play />}</button>
        <div className="stack-6 flex-1">
          <div className="row-between audio-meta"><span>{playing ? 'Playing' : 'Listen instead'}</span><span>{fmt(pos)} / {fmt(AUDIO_SECONDS)}</span></div>
          <div className="bar dark"><span style={{ width: `${(pos / AUDIO_SECONDS) * 100}%` }} /></div>
        </div>
      </div>
      <div className="foot row">
        <button type="button" className={`round-btn outline ${saved ? 'saved' : ''}`} aria-pressed={saved} aria-label={saved ? 'Highlight saved' : 'Save highlight'} onClick={() => setSaved((s) => !s)}><I.bookmark filled={saved} /></button>
        <Btn onClick={() => go('liveit')}>Done reading <I.arrow /></Btn>
      </div>
      <AnimatePresence>{saved && <motion.div className="toast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>Highlight saved to your journal</motion.div>}</AnimatePresence>
    </div>
  )
}

const ACTIONS = [
  ['a', 'Notice three things at home that set off habits you want to drop.'],
  ['b', 'Put the book you want to read on your pillow tonight.'],
  ['c', 'Move one distraction out of sight before tomorrow.'],
]
export function LiveIt() {
  const { go, state, set } = useNav()
  const count = ACTIONS.filter(([id]) => state.actions[id]).length
  return (
    <div className="screen">
      <Top back="reading" title="Day 4 · Try it today" />
      <div className="body">
        <div className="stack-8">
          <h1 className="h1">Now, try it <span className="green">today.</span></h1>
          <p className="lede">Small enough to do before dinner. Tick them off as you go.</p>
        </div>
        <div className="row-between"><span className="eyebrow">Action points</span><strong className="sm" aria-live="polite">{count} of 3 done</strong></div>
        <div className="stack-10">
          {ACTIONS.map(([id, text]) => {
            const on = !!state.actions[id]
            return (
              <button key={id} type="button" className={`action ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => set((s) => ({ actions: { ...s.actions, [id]: !s.actions[id] } }))}>
                <motion.span className="tick lg" animate={on ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>{on && <I.check color="#16181B" />}</motion.span>
                <span className="action-text">{text}</span>
              </button>
            )
          })}
        </div>
        <div className="note-row dashed">
          <I.bell /><span className="flex-1 strong-sm">Remind me at 1:00 PM</span>
          <button type="button" role="switch" aria-checked={state.middayReminder} aria-label="Midday reminder" className={`switch ${state.middayReminder ? 'on' : ''}`} onClick={() => set((s) => ({ middayReminder: !s.middayReminder }))}><span /></button>
        </div>
      </div>
      <div className="foot"><Btn onClick={() => go('reflect')}>Next: tonight’s question</Btn></div>
    </div>
  )
}

export function Reflect() {
  const { go, state, set } = useNav()
  const add = (starter) => set((s) => ({ answer: s.answer.trim() ? `${s.answer.trim()} ${starter}` : starter }))
  return (
    <div className="screen dark">
      <Top back="liveit" title="Day 4 · Tonight" />
      <div className="body">
        <I.moon size={40} color="#FF8A45" />
        <span className="eyebrow orange">Sit with this</span>
        <h1 className="h1 on-dark">What sets off the habit you most want to change?</h1>
        <div className="field dark">
          <label htmlFor="answer">Your answer</label>
          <textarea id="answer" rows={5} value={state.answer} placeholder="Write a line or two…" onChange={(e) => set({ answer: e.target.value })} />
        </div>
        <div className="stack-8">
          <span className="muted-sm">Stuck? Start with one of these</span>
          <div className="row-wrap">
            {['The first thing I do when…', 'I notice it most at…'].map((s) => <button key={s} type="button" className="starter" onClick={() => add(s)}>{s}</button>)}
          </div>
        </div>
        <span className="note-quiet"><I.lock /> Only you can see your journal.</span>
      </div>
      <div className="foot"><Btn onClick={() => { set({ dayDone: true }); go('daydone') }} disabled={!state.answer.trim()}>Finish Day 4</Btn></div>
    </div>
  )
}

const BURST = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  const d = 110 + (i % 3) * 30
  return [Math.cos(a) * d, Math.sin(a) * d, i % 3 === 0 ? '#1F4034' : '#FF8A45', (i * 67) % 360]
})
export function DayDone() {
  const { go } = useNav()
  const reduce = useReducedMotion()
  const [count, setCount] = useState(reduce ? 12 : 11)
  useEffect(() => {
    if (reduce) return undefined
    const t = setTimeout(() => setCount(12), 700)
    return () => clearTimeout(t)
  }, [reduce])
  return (
    <div className="screen">
      <div className="body center-text done-body">
        <div className="done-badge">
          {!reduce && count === 12 && BURST.map(([x, y, c, r], i) => (
            <motion.span key={i} className="confetti" initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }} animate={{ x, y, opacity: 0, scale: 1, rotate: r }} transition={{ duration: 0.9, ease }}><Leaf color={c} size={18} /></motion.span>
          ))}
          <motion.span className="done-check" initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ duration: 0.4, ease }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} /></svg>
          </motion.span>
        </div>
        <div className="streak-big" aria-live="polite">
          <span className="streak-num"><AnimatePresence mode="popLayout" initial={false}><motion.span key={count} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }} transition={{ duration: 0.3, ease }}>{count}</motion.span></AnimatePresence></span>
          <span className="streak-label">day streak</span>
        </div>
        <h1 className="h1 md">Day 4 done. Nicely done, Ada.</h1>
        <Week doneThrough={3} todayDone />
        <div className="plan-row">
          <span className="icon-tile sm white"><I.sunrise /></span>
          <div className="stack-2"><span className="muted-xs strong">Tomorrow · 7:30 AM</span><strong>Stack it on what you already do</strong></div>
        </div>
      </div>
      <div className="foot">
        <Btn kind="ghost" onClick={() => go('club')}><I.share /> Share with your book club</Btn>
        <Btn onClick={() => go('home')}>Back to home</Btn>
      </div>
    </div>
  )
}

export function WelcomeBack() {
  const { go } = useNav()
  return (
    <div className="screen">
      <Top close="home"><span className="flex-1" /></Top>
      <div className="body">
        <div className="icon-tile sage"><Leaf color="#1F4034" size={30} /></div>
        <div className="stack-10">
          <h1 className="h1">Welcome back. <span className="green">No stress.</span></h1>
          <p className="lede">You missed yesterday, so a grace day kept your 12-day streak safe. Your plan waited for you.</p>
        </div>
        <div className="note-row">
          <span className="big-num">12</span>
          <span className="stack-2 flex-1"><strong>Streak protected</strong><span className="muted-sm">1 grace day left this week</span></span>
          <span className="row-4" aria-label="1 of 2 grace days left"><Leaf color="#1F4034" size={20} /><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20c0-9 6-15 16-15 0 10-6 15-15 15z" fill="none" stroke="#9CA3AF" strokeWidth="1.8" /></svg></span>
        </div>
        <div className="recap">
          <span className="eyebrow">Catch up in 3 minutes</span>
          <strong className="recap-title">Day 4 in short: the cue comes first.</strong>
          <span className="body-sm">Every habit starts with something you notice. Change what you see, and you start to change what you do.</span>
        </div>
      </div>
      <div className="foot">
        <Btn onClick={() => go('reading')}>Read the 3-minute recap</Btn>
        <Btn kind="text" onClick={() => go('plan')}>Skip to Day 5 instead</Btn>
      </div>
    </div>
  )
}
