import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { dayOf } from '../content.js'
import { toAppError } from '../lib/errors.js'
import { useInstall } from '../lib/pwa.js'
import { TIMES, greeting, useNav } from '../nav.js'
import { Btn, I, Leaf, TabBar, Top } from '../parts.jsx'

const ease = [0.16, 1, 0.3, 1]
const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function WeekRow({ week }) {
  return (
    <div className="week" aria-label={`${week.filter((d) => d.read).length} days read this week`}>
      {week.map((d, i) => (
        <div key={d.date} className="week-day">
          <span className={d.today ? 'strong' : ''}>{DAYS_SHORT[i]}</span>
          <span className={`dot ${d.read ? 'done' : d.grace ? 'grace' : d.today ? 'today' : ''}`} title={d.grace ? 'Grace day' : undefined}>
            {d.read && <I.check />}{d.grace && !d.read && <Leaf color="#FFFFFF" size={12} />}
          </span>
        </div>
      ))}
    </div>
  )
}

function InstallCard() {
  const { mode, install } = useInstall()
  const [hidden, setHidden] = useState(() => { try { return localStorage.getItem('mindleaf-install-dismissed') === '1' } catch { return false } })
  const [showSteps, setShowSteps] = useState(false)
  if (hidden || mode === 'installed' || mode === 'none') return null
  const dismiss = () => { setHidden(true); try { localStorage.setItem('mindleaf-install-dismissed', '1') } catch { /* ignore */ } }
  return (
    <div className="install-card">
      <div className="row-between"><strong>Add Mindleaf to your home screen</strong><button type="button" className="icon-btn sm" aria-label="Dismiss" onClick={dismiss}><I.close /></button></div>
      {showSteps || mode === 'ios' ? (
        <span className="body-sm">In Safari, tap <strong>Share</strong> <ShareGlyph /> then <strong>Add to Home Screen</strong>. Mindleaf opens like an app, full screen.</span>
      ) : (
        <span className="body-sm">Open it like an app, straight to today’s reading.</span>
      )}
      {mode === 'prompt' && <Btn kind="dark" onClick={async () => { const ok = await install(); if (!ok) setShowSteps(false) }}>Install app</Btn>}
    </div>
  )
}
const ShareGlyph = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: '-2px' }}><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" /></svg>)

export function Home() {
  const { go, profile, derived } = useNav()
  const { plan, currentDay, doneToday, finished, streak, week, daysCompleted } = derived
  const day = dayOf(plan.id, currentDay)
  const next = dayOf(plan.id, currentDay + 1)
  const t = TIMES[profile.time] || TIMES.morning
  const pct = Math.round((daysCompleted / plan.days) * 100)
  return (
    <div className="screen with-tabs">
      <div className="body home">
        <div className="row-between">
          <div className="stack-2">
            <span className="muted-sm">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            <h1 className="h1 md">{greeting()}, {profile.name}</h1>
          </div>
          <button type="button" className="streak-chip" aria-label={`${streak.streak} day streak`} onClick={() => go('profile')}>
            <span className={`dot ${streak.streak > 0 ? 'done' : ''}`}>{streak.streak > 0 && <I.check color="#16181B" />}</span>{streak.streak}
          </button>
        </div>

        {streak.missedYesterday && !doneToday && (
          <button type="button" className="welcome-back-banner" onClick={() => go('welcomeback')}>
            <Leaf color="#1F4034" size={20} /><span className="flex-1"><strong>Welcome back.</strong> A grace day kept your streak safe.</span><I.chevron />
          </button>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {finished ? (
            <motion.div key="finished" className="today-card done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <span className="today-label">Plan complete</span>
              <span className="today-title">You finished {plan.title}.</span>
              <span className="today-meta">All {plan.days} days. Pick your next book whenever you’re ready.</span>
              <Btn kind="ghost-dark" onClick={() => go('library')}>Choose your next plan</Btn>
            </motion.div>
          ) : doneToday ? (
            <motion.div key="done" className="today-card done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <span className="today-label">Day {currentDay} done</span>
              <span className="today-title">See you tomorrow.</span>
              <span className="today-meta">{next ? `Day ${currentDay + 1} · ${next.title} · ${t.time}` : 'That was the last day of this plan.'}</span>
              <Btn kind="ghost-dark" onClick={() => go('journal')}>Read what you wrote</Btn>
            </motion.div>
          ) : (
            <motion.div key="todo" className="today-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Leaf color="#FF8A45" size={150} style={{ position: 'absolute', right: -34, top: -30, opacity: 0.18 }} />
              <div className="row-between rel"><span className="today-label">Today · Day {currentDay} of {plan.days}</span><span className="today-meta">{profile.minutes} min</span></div>
              <div className="stack-2 rel"><span className="today-title">{day?.title}</span><span className="today-meta">{plan.title} · {day?.part?.split(' · ')[0]}</span></div>
              <div className="ticks rel" aria-label={`${daysCompleted} of ${plan.days} days done`}>{Array.from({ length: plan.days }, (_, i) => <span key={i} className={i < daysCompleted ? 'done' : i === daysCompleted ? 'now' : ''} />)}</div>
              <Btn onClick={() => go('reading')}>{currentDay === 1 ? 'Start Day 1' : 'Start reading'} <I.arrow /></Btn>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="stack-10">
          <div className="row-between"><h2 className="h2">This week</h2><span className="muted-sm">{streak.graceLeft} grace {streak.graceLeft === 1 ? 'day' : 'days'} left</span></div>
          <WeekRow week={week} />
        </div>

        <div className="stack-10">
          <div className="row-between"><h2 className="h2">Your plan</h2><button type="button" className="link" onClick={() => go('library')}>Browse the library</button></div>
          <button type="button" className="plan-row as-button" onClick={() => go('plan')}>
            <img src={plan.cover} alt="" />
            <span className="stack-6 flex-1"><strong>{plan.title}</strong><span className="bar-row"><span className="bar"><span style={{ width: `${pct}%` }} /></span><span>{pct}%</span></span><span className="muted-xs">{daysCompleted} of {plan.days} days</span></span>
            <I.chevron />
          </button>
        </div>
        <InstallCard />
      </div>
      <TabBar active="home" />
    </div>
  )
}

export function Plan() {
  const { go, profile, derived } = useNav()
  const [tab, setTab] = useState('days')
  const { plan, planLogs, currentDay, doneToday, finished, daysCompleted } = derived
  const doneDays = new Set(planLogs.map((l) => l.day))
  return (
    <div className="screen">
      <Top back="home"><span className="flex-1" /></Top>
      <div className="body">
        <div className="plan-head">
          <img src={plan.cover} alt={`${plan.title} by ${plan.author}`} />
          <div className="stack-6"><h1 className="h1 md">{plan.title}</h1><span className="muted-sm">{plan.author}</span><span className="strong-sm">{plan.days} days · {profile.minutes} min a day</span></div>
        </div>
        <div className="panel stack-10">
          <div className="row-between"><strong>{daysCompleted} of {plan.days} days done</strong><span className="muted-sm">{finished ? 'Finished' : doneToday ? 'Next day tomorrow' : `Day ${currentDay} is open`}</span></div>
          <div className="bar thick"><span style={{ width: `${(daysCompleted / plan.days) * 100}%` }} /></div>
        </div>
        <div className="seg" role="tablist" aria-label="Plan sections">
          {[['days', 'Days'], ['about', 'About']].map(([id, l]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{l}</button>
          ))}
        </div>
        {tab === 'days' ? (
          <div className="day-list">
            {plan.dayList.map((d, i) => {
              const n = i + 1
              const isDone = doneDays.has(n)
              const isToday = n === currentDay && !doneToday && !finished
              if (isToday) return (
                <button key={n} type="button" className="day-row today" onClick={() => go('reading')}>
                  <span className="day-num orange">{n}</span><span className="stack-2 flex-1"><span className="accent-sm">Today · {profile.minutes} min</span><strong>{d.title}</strong></span><I.arrow />
                </button>
              )
              return (
                <div key={n} className={`day-row ${isDone ? '' : 'locked'}`}>
                  <span className={`day-num ${isDone ? 'green' : 'dashed'}`}>{isDone ? <I.check color="#FFFFFF" /> : n}</span>
                  <span className="stack-2 flex-1"><span className="muted-sm">Day {n}{n === currentDay + (doneToday ? 1 : 0) && !isDone ? ' · tomorrow' : ''}</span><span className="day-title">{d.title}</span></span>
                  {!isDone && <I.lock />}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="stack-16">
            <p className="lede">{plan.about}</p>
            <div className="note-row"><I.book /><span>Mindleaf readings are written by our team, based on the ideas in {plan.title} by {plan.author}. They don’t replace the book.</span></div>
          </div>
        )}
      </div>
      <div className="foot"><Btn onClick={() => go(doneToday || finished ? 'home' : 'reading')}>{finished ? 'Back to home' : doneToday ? 'Next day opens tomorrow' : `Continue Day ${currentDay}`}</Btn></div>
    </div>
  )
}

export function Reading() {
  const { go, derived, highlights, toggleHighlight, profile, notify } = useNav()
  const { plan, currentDay, doneToday } = derived
  const day = dayOf(plan.id, currentDay)
  const bodyRef = useRef(null)
  const [read, setRead] = useState(0)
  const saved = day ? highlights.some((h) => h.planId === plan.id && h.day === currentDay && h.text === day.idea) : false
  const onScroll = () => {
    const el = bodyRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    setRead(max > 0 ? el.scrollTop / max : 1)
  }
  const toggleSave = async () => {
    try { await toggleHighlight({ planId: plan.id, day: currentDay, text: day.idea }, !saved) }
    catch (err) { notify(toAppError(err).message) }
  }
  if (!day?.reading) {
    return (
      <div className="screen">
        <Top close="home" title={`Day ${currentDay} of ${plan.days}`} />
        <div className="body">
          <div className="icon-tile sage"><Leaf color="#1F4034" size={30} /></div>
          <h1 className="h1">{day?.title || 'Coming soon'}</h1>
          <p className="lede">This reading is still being written. We’ll send it to you as soon as it’s ready, and your streak is safe until then.</p>
        </div>
        <div className="foot"><Btn onClick={() => go('home')}>Back to home</Btn></div>
      </div>
    )
  }
  return (
    <div className="screen">
      <Top close="home" title={<span className="stack-0 center"><strong>Day {currentDay} of {plan.days}</strong><span className="muted-xs">{plan.title}</span></span>} />
      <div className="read-bar" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(read * 100)}><motion.span animate={{ scaleX: Math.max(0.04, read) }} transition={{ duration: 0.15 }} /></div>
      <article className="body reading" ref={bodyRef} onScroll={onScroll}>
        <span className="eyebrow">{profile.minutes} min · {day.part}</span>
        <h1 className="h1">{day.title}.</h1>
        {profile.mode === 'own' && <p className="note-row"><I.book /><span>Reading your own copy? Read the matching chapter first, then use this as your recap.</span></p>}
        {day.reading.slice(0, 1).map((p) => <p key={p}>{p}</p>)}
        <div className="idea"><span className="eyebrow orange">Today’s idea</span><span>{day.idea}</span></div>
        {day.reading.slice(1).map((p) => <p key={p}>{p}</p>)}
        <p className="source">Written by Mindleaf, based on ideas from {plan.title} by {plan.author}.</p>
      </article>
      <div className="foot row">
        <button type="button" className={`round-btn outline ${saved ? 'saved' : ''}`} aria-pressed={saved} aria-label={saved ? 'Remove saved idea' : 'Save today’s idea to your journal'} onClick={toggleSave}><I.bookmark filled={saved} /></button>
        <Btn onClick={() => go(doneToday ? 'home' : 'liveit')}>{doneToday ? 'Back to home' : <>Done reading <I.arrow /></>}</Btn>
      </div>
    </div>
  )
}

export function LiveIt() {
  const { go, draft, setDraft, derived } = useNav()
  const day = dayOf(derived.plan.id, derived.currentDay)
  const actions = day?.actions || []
  const count = actions.filter((_, i) => draft.actions[i]).length
  return (
    <div className="screen">
      <Top back="reading" title={`Day ${derived.currentDay} · Try it today`} />
      <div className="body">
        <div className="stack-8">
          <h1 className="h1">Now, try it <span className="green">today.</span></h1>
          <p className="lede">Small enough to do before dinner. Tick them off as you go; you can come back later.</p>
        </div>
        <div className="row-between"><span className="eyebrow">Action points</span><strong className="sm" aria-live="polite">{count} of {actions.length} done</strong></div>
        <div className="stack-10">
          {actions.map((text, i) => {
            const on = Boolean(draft.actions[i])
            return (
              <button key={text} type="button" className={`action ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => setDraft((d) => ({ actions: { ...d.actions, [i]: !d.actions[i] } }))}>
                <motion.span className="tick lg" animate={on ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>{on && <I.check color="#16181B" />}</motion.span>
                <span className="action-text">{text}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="foot"><Btn onClick={() => go('reflect')}>Next: tonight’s question</Btn></div>
    </div>
  )
}

export function Reflect() {
  const { go, draft, setDraft, derived, saveLog, online } = useNav()
  const day = dayOf(derived.plan.id, derived.currentDay)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const add = (starter) => setDraft((d) => ({ answer: d.answer.trim() ? `${d.answer.trim()} ${starter}` : starter }))
  const finish = async () => {
    setBusy(true); setError(null)
    try {
      await saveLog({ planId: derived.plan.id, day: derived.currentDay, date: derived.today, actions: draft.actions, reflection: draft.answer.trim() })
      setDraft({ actions: {}, answer: '', lastStreak: derived.streak.streak })
      go('daydone')
    } catch (err) { setError(toAppError(err).message) } finally { setBusy(false) }
  }
  return (
    <div className="screen dark">
      <Top back="liveit" title={`Day ${derived.currentDay} · Tonight`} />
      <div className="body">
        <I.moon size={40} color="#FF8A45" />
        <span className="eyebrow orange">Sit with this</span>
        <h1 className="h1 on-dark">{day?.question}</h1>
        <div className="field dark">
          <label htmlFor="answer">Your answer <span className="optional">(optional)</span></label>
          <textarea id="answer" rows={5} maxLength={4000} value={draft.answer} placeholder="Write a line or two…" onChange={(e) => setDraft({ answer: e.target.value })} />
        </div>
        <div className="stack-8">
          <span className="muted-sm">Stuck? Start with one of these</span>
          <div className="row-wrap">
            {['The first thing I do when…', 'I notice it most at…'].map((s) => <button key={s} type="button" className="starter" onClick={() => add(s)}>{s}</button>)}
          </div>
        </div>
        <span className="note-quiet"><I.lock /> Only you can see your journal.</span>
        {error && <p className="form-error on-dark" role="alert">{error} <button type="button" className="link light" onClick={finish}>Try again</button></p>}
      </div>
      <div className="foot"><Btn onClick={finish} disabled={busy || !online}>{busy ? 'Saving…' : `Finish Day ${derived.currentDay}`}</Btn></div>
    </div>
  )
}

const BURST = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  const d = 110 + (i % 3) * 30
  return [Math.cos(a) * d, Math.sin(a) * d, i % 3 === 0 ? '#1F4034' : '#FF8A45', (i * 67) % 360]
})
export function DayDone() {
  const { go, derived, draft, profile } = useNav()
  const reduce = useReducedMotion()
  const target = derived.streak.streak
  const from = typeof draft.lastStreak === 'number' && draft.lastStreak < target ? draft.lastStreak : target
  const [count, setCount] = useState(reduce ? target : from)
  useEffect(() => {
    if (reduce || count === target) return undefined
    const t = setTimeout(() => setCount(target), 700)
    return () => clearTimeout(t)
  }, [reduce, count, target])
  const next = dayOf(derived.plan.id, derived.currentDay + 1)
  const t = TIMES[profile.time] || TIMES.morning
  return (
    <div className="screen">
      <div className="body center-text done-body">
        <div className="done-badge">
          {!reduce && count === target && BURST.map(([x, y, c, r], i) => (
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
        <h1 className="h1 md">Day {derived.currentDay} done. Nicely done, {profile.name}.</h1>
        <WeekRow week={derived.week} />
        {next && (
          <div className="plan-row">
            <span className="icon-tile sm white"><I.sunrise /></span>
            <div className="stack-2"><span className="muted-xs strong">Tomorrow · {t.time}</span><strong>{next.title}</strong></div>
          </div>
        )}
      </div>
      <div className="foot">
        <Btn onClick={() => go('home')}>Back to home</Btn>
      </div>
    </div>
  )
}

export function WelcomeBack() {
  const { go, derived } = useNav()
  const { streak, plan, currentDay } = derived
  const day = dayOf(plan.id, currentDay)
  return (
    <div className="screen">
      <Top close="home"><span className="flex-1" /></Top>
      <div className="body">
        <div className="icon-tile sage"><Leaf color="#1F4034" size={30} /></div>
        <div className="stack-10">
          <h1 className="h1">Welcome back. <span className="green">No stress.</span></h1>
          <p className="lede">You missed yesterday, so a grace day kept your {streak.streak}-day streak safe. Your plan waited for you.</p>
        </div>
        <div className="note-row">
          <span className="big-num">{streak.streak}</span>
          <span className="stack-2 flex-1"><strong>Streak protected</strong><span className="muted-sm">{streak.graceLeft} grace {streak.graceLeft === 1 ? 'day' : 'days'} left this week</span></span>
        </div>
        {day?.idea && (
          <div className="recap">
            <span className="eyebrow">Where you left off</span>
            <strong className="recap-title">Day {currentDay}: {day.title}.</strong>
            <span className="body-sm">{day.idea}</span>
          </div>
        )}
      </div>
      <div className="foot"><Btn onClick={() => go('reading')}>Pick up Day {currentDay}</Btn></div>
    </div>
  )
}
