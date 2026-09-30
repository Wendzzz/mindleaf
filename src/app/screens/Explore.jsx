import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { BOOKS, COVERS } from '../../data.js'
import { PLANS, planFor } from '../content.js'
import { toAppError } from '../lib/errors.js'
import { useInstall } from '../lib/pwa.js'
import { TIMES, useNav } from '../nav.js'
import { Btn, I, Leaf, Logo, TabBar, Top } from '../parts.jsx'

const TOPICS = ['All', 'Habits', 'Money', 'Focus', 'Mindset']

export function Library() {
  const { go, derived, updateProfile, notify } = useNav()
  const [topic, setTopic] = useState('All')
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()
  const books = BOOKS.filter((b) => topic === 'All' || b.topic === topic)
    .filter((b) => !query || `${b.title} ${b.author} ${b.topic}`.toLowerCase().includes(query))
  const open = async (b) => {
    if (!PLANS[b.id]?.available) return
    if (b.id !== derived.plan.id) {
      try { await updateProfile({ plan: b.id }) } catch (err) { notify(toAppError(err).message); return }
    }
    go('plan')
  }
  return (
    <div className="screen with-tabs">
      <div className="body home">
        <h1 className="h1 md">Library</h1>
        <label className="search">
          <I.search /><span className="sr-only">Search plans</span>
          <input type="search" placeholder="Search books, authors or goals" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="chips" role="group" aria-label="Filter by topic">
          {TOPICS.map((t) => (
            <button key={t} type="button" className={`chip ${t === topic ? 'on' : ''}`} aria-pressed={t === topic} onClick={() => setTopic(t)}>{t}</button>
          ))}
        </div>
        <div className="row-between"><h2 className="h2">{topic === 'All' ? 'Reading plans' : topic}</h2><span className="muted-sm" aria-live="polite">{books.length} {books.length === 1 ? 'plan' : 'plans'}</span></div>
        {books.length === 0 ? (
          <div className="empty"><strong>No plans match “{q}”</strong><span>Try a book title, an author or a goal like “money”.</span><Btn kind="ghost" onClick={() => setQ('')}>Clear search</Btn></div>
        ) : (
          <motion.div className="grid-2 books" layout>
            <AnimatePresence mode="popLayout">
              {books.map((b) => {
                const ready = PLANS[b.id]?.available
                const current = b.id === derived.plan.id
                return (
                  <motion.button key={b.id} layout type="button" className={`book-tile ${ready ? '' : 'soon'}`} onClick={() => open(b)} aria-disabled={!ready}
                    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}>
                    <span className="book-tile-cover"><img src={b.cover} alt="" />{current ? <span className="tag-dark top-right">Reading</span> : !ready && <span className="tag-soft top-right">Coming soon</span>}</span>
                    <span className="book-tile-title">{b.title}</span>
                    <span className="muted-xs">{b.days} days · {b.mins} min</span>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <TabBar active="library" />
    </div>
  )
}

export function Journal() {
  const { logs, highlights, go } = useNav()
  const [tab, setTab] = useState('all')
  const fmt = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  const entries = [
    ...logs.filter((l) => l.reflection).map((l) => ({ type: 'reflection', text: l.reflection, source: `${planFor(l.planId).title} · Day ${l.day}`, date: l.date })),
    ...highlights.map((h) => ({ type: 'highlight', text: h.text, source: `${planFor(h.planId).title} · Day ${h.day}`, date: h.date })),
  ].filter((e) => tab === 'all' || e.type === tab).sort((a, b) => (a.date < b.date ? 1 : -1))
  return (
    <div className="screen with-tabs">
      <div className="body home">
        <div className="row-between"><h1 className="h1 md">Journal</h1><span className="muted-sm"><I.lock size={14} /> Only you</span></div>
        <div className="seg" role="tablist" aria-label="Journal entries">
          {[['all', 'All'], ['reflection', 'Reflections'], ['highlight', 'Saved ideas']].map(([id, l]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{l}</button>
          ))}
        </div>
        {entries.length === 0 ? (
          <div className="empty">
            <strong>{tab === 'highlight' ? 'No saved ideas yet' : 'Your journal starts tonight'}</strong>
            <span>{tab === 'highlight' ? 'Tap the bookmark while reading to save the day’s idea here.' : 'Answer the evening question after a reading, and your words will collect here.'}</span>
            <Btn kind="ghost" onClick={() => go('home')}>Go to today’s reading</Btn>
          </div>
        ) : (
          <div className="stack-10">
            <AnimatePresence mode="popLayout" initial={false}>
              {entries.map((e) => (
                <motion.div key={`${e.type}-${e.source}-${e.text}`} layout className={`entry ${e.type === 'highlight' ? 'peach' : ''}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <div className="row-between"><span className={`entry-kind ${e.type === 'highlight' ? 'accent' : ''}`}>{e.type === 'highlight' ? 'Saved idea' : 'Reflection'}</span><span className="muted-xs">{fmt(e.date)}</span></div>
                  <span className="entry-text">{e.text}</span>
                  <span className="muted-xs strong">{e.source}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <TabBar active="journal" />
    </div>
  )
}

const PREVIEW = [
  { who: 'Tobi', text: 'Moved my savings to an account I don’t see every day. Out of sight really works.' },
  { who: 'You', me: true, text: 'Finally set up the automatic transfer. Day 9 done.' },
]
export function Club() {
  const { goBack, profile, updateProfile, notify } = useNav()
  const [busy, setBusy] = useState(false)
  const join = async () => {
    setBusy(true)
    try { await updateProfile({ clubsWaitlist: true }) } catch (err) { notify(toAppError(err).message) } finally { setBusy(false) }
  }
  return (
    <div className="screen grey">
      <Top back="profile" title="Book clubs" />
      <div className="body">
        <div className="club-preview" aria-hidden="true">
          <div className="club-preview-head"><img src={COVERS.money} alt="" /><span className="stack-0"><strong>Sunday Book Club</strong><span className="muted-xs">The Psychology of Money · Day 9 of 21</span></span></div>
          {PREVIEW.map((m) => <div key={m.text} className={`bubble ${m.me ? 'me' : ''}`}><span className="bubble-who">{m.who}</span><span>{m.text}</span></div>)}
        </div>
        <div className="stack-10">
          <span className="eyebrow">Coming soon</span>
          <h1 className="h1">Read a plan with friends.</h1>
          <p className="lede">Invite your book club, partner or team. Everyone reads the same page each day and shares what they tried. We’re building it now.</p>
        </div>
      </div>
      <div className="foot">
        {profile.clubsWaitlist ? (
          <p className="plus-on light"><span className="tick on"><I.check color="#16181B" /></span>You’re on the list. We’ll email {profile.email || 'you'} when book clubs open.</p>
        ) : (
          <Btn onClick={join} disabled={busy}>{busy ? 'Saving…' : 'Tell me when it’s ready'}</Btn>
        )}
        <Btn kind="text" onClick={() => goBack('profile')}>Back</Btn>
      </div>
    </div>
  )
}

const monthGrid = (logs, graceDays) => {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const days = new Date(y, m + 1, 0).getDate()
  const read = new Set(logs.map((l) => l.date))
  const today = now.getDate()
  return Array.from({ length: days }, (_, i) => {
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
    return { iso, v: read.has(iso) ? 1 : graceDays.includes(iso) ? 2 : i + 1 > today ? 3 : 0 }
  })
}

export function Profile() {
  const { go, profile, logs, derived, signOut, updateProfile, notify, live, resetDemo } = useNav()
  const { mode, install } = useInstall()
  const [showIos, setShowIos] = useState(false)
  const finishedBooks = Object.values(PLANS).filter((p) => p.days > 0 && new Set(logs.filter((l) => l.planId === p.id).map((l) => l.day)).size >= p.days).length
  const actionsTried = logs.reduce((n, l) => n + Object.values(l.actions || {}).filter(Boolean).length, 0)
  const cal = monthGrid(logs, derived.streak.graceDays)
  const month = new Date().toLocaleDateString(undefined, { month: 'long' })
  const setTime = async (time) => {
    try { await updateProfile({ time }) } catch (err) { notify(toAppError(err).message) }
  }
  return (
    <div className="screen with-tabs">
      <div className="body home">
        <div className="row-10 center-y">
          <span className="avatar lg" style={{ background: '#7FB89D' }}>{profile.name.slice(0, 2).toUpperCase()}</span>
          <span className="stack-0 flex-1"><h1 className="h1 sm">{profile.name}</h1><span className="muted-sm">{profile.email}</span></span>
        </div>
        <div className="grid-2 stats">
          <div className="stat green"><span className="stat-num">{derived.streak.streak}</span><span>day streak</span></div>
          <div className="stat"><span className="stat-num">{finishedBooks}</span><span>{finishedBooks === 1 ? 'book' : 'books'} finished</span></div>
          <div className="stat"><span className="stat-num">{new Set(logs.map((l) => l.date)).size}</span><span>days read</span></div>
          <div className="stat"><span className="stat-num">{actionsTried}</span><span>actions tried</span></div>
        </div>
        <div className="calendar">
          <div className="row-between"><strong>{month}</strong><span className="muted-xs">Each dot is a day</span></div>
          <div className="cal-grid" aria-label={`Reading days in ${month}`}>{cal.map((d) => <span key={d.iso} className={`cal-dot v${d.v}`} title={d.iso} />)}</div>
          <div className="legend"><span><i className="cal-dot v1" />Read</span><span><i className="cal-dot v2" />Grace day</span><span><i className="cal-dot v0" />Missed</span></div>
        </div>
        <div className="settings">
          <label className="setting" htmlFor="reminder-time">
            <I.bell /><span className="flex-1">Reading time</span>
            <select id="reminder-time" value={profile.time} onChange={(e) => setTime(e.target.value)}>
              {Object.entries(TIMES).map(([id, t]) => <option key={id} value={id}>{t.time}</option>)}
            </select>
          </label>
          {mode !== 'installed' && mode !== 'none' && (
            <button type="button" className="setting" onClick={() => (mode === 'prompt' ? install() : setShowIos((s) => !s))}><Logo size={20} /><span className="flex-1">Install the Mindleaf app</span><I.chevron /></button>
          )}
          {showIos && <p className="body-sm pad">In Safari, tap <strong>Share</strong> then <strong>Add to Home Screen</strong>.</p>}
          <button type="button" className="setting" onClick={() => go('club')}><Leaf color="#1F4034" size={20} /><span className="flex-1">Book clubs</span><span className="muted-sm">Coming soon</span><I.chevron /></button>
          <button type="button" className="setting" onClick={() => go('paywall')}><Leaf color="#CC4A0A" size={20} /><span className="flex-1">Mindleaf Plus</span><span className="accent-sm">{profile.plusWaitlist ? 'On the list' : 'Coming soon'}</span><I.chevron /></button>
          <button type="button" className="setting" onClick={signOut}><I.back /><span className="flex-1">Sign out</span></button>
          {!live && resetDemo && <button type="button" className="setting" onClick={resetDemo}><I.close /><span className="flex-1">Reset demo data</span></button>}
        </div>
      </div>
      <TabBar active="profile" />
    </div>
  )
}

export function Paywall() {
  const { goBack, profile, updateProfile, notify } = useNav()
  const [busy, setBusy] = useState(false)
  const join = async () => {
    setBusy(true)
    try { await updateProfile({ plusWaitlist: true }) } catch (err) { notify(toAppError(err).message) } finally { setBusy(false) }
  }
  return (
    <div className="screen green">
      <Top close="profile"><span className="flex-1" /></Top>
      <div className="body">
        <Logo size={56} variant="reversed" />
        <div className="stack-10">
          <span className="eyebrow orange">Mindleaf Plus · coming soon</span>
          <h1 className="h1 on-dark">Every plan. Every book. Your way.</h1>
        </div>
        <ul className="checks on-dark">
          {['Every plan in the library', 'Audio for every daily reading', 'Book clubs with friends', 'Read offline, anywhere'].map((f) => <li key={f}><span className="tick on"><I.check color="#16181B" /></span>{f}</li>)}
        </ul>
        <div className="price-card"><span className="stack-2"><strong>Monthly</strong><span className="muted-sm">Cancel anytime</span></span><span className="price">₦5,000<small>/month</small></span></div>
      </div>
      <div className="foot">
        <AnimatePresence mode="wait" initial={false}>
          {profile.plusWaitlist ? (
            <motion.p key="on" className="plus-on" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <span className="tick on"><I.check color="#16181B" /></span><span>You’re on the list. We’ll email you when Plus opens.</span>
            </motion.p>
          ) : (
            <motion.div key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Btn onClick={join} disabled={busy}>{busy ? 'Saving…' : 'Tell me when Plus opens'}</Btn>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="fine center on-dark">You’ll be able to pay by card, bank transfer or USSD. Nothing is charged today.</p>
        <Btn kind="text" onClick={() => goBack('profile')}>Not now</Btn>
      </div>
    </div>
  )
}
