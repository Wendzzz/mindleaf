import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { BOOKS, COVERS } from '../../data.js'
import { TIMES, useNav } from '../nav.js'
import { Btn, I, Leaf, Logo, TabBar, Top } from '../parts.jsx'

const TOPICS = ['For you', 'Habits', 'Money', 'Focus', 'Mindset']
const FOR_YOU = ['atomic', 'money', 'deep', 'mindset']

export function Library() {
  const { go } = useNav()
  const [topic, setTopic] = useState('For you')
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()
  const books = BOOKS.filter((b) => (topic === 'For you' ? FOR_YOU.includes(b.id) : b.topic === topic))
    .filter((b) => !query || `${b.title} ${b.author} ${b.topic}`.toLowerCase().includes(query))
  return (
    <div className="screen">
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
        <div className="row-between"><h2 className="h2">{topic === 'For you' ? 'Picked for your goals' : topic}</h2><span className="muted-sm" aria-live="polite">{books.length} {books.length === 1 ? 'plan' : 'plans'}</span></div>
        {books.length === 0 ? (
          <div className="empty"><strong>No plans match “{q}”</strong><span>Try a book title, an author or a goal like “money”.</span><Btn kind="ghost" onClick={() => setQ('')}>Clear search</Btn></div>
        ) : (
          <motion.div className="grid-2 books" layout>
            <AnimatePresence mode="popLayout">
              {books.map((b) => (
                <motion.button key={b.id} layout type="button" className="book-tile" onClick={() => go('plan')} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}>
                  <span className="book-tile-cover"><img src={b.cover} alt="" />{b.id !== 'atomic' && <span className="tag-dark top-right">Plus</span>}</span>
                  <span className="book-tile-title">{b.title}</span>
                  <span className="muted-xs">{b.days} days · {b.mins} min</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <TabBar active="library" />
    </div>
  )
}

export function Journal() {
  const { state } = useNav()
  const [tab, setTab] = useState('all')
  const entries = [
    ...(state.dayDone && state.answer.trim() ? [{ type: 'reflection', text: state.answer.trim(), source: 'Atomic Habits · Day 4', date: 'Today' }] : []),
    { type: 'highlight', text: 'Before you can change what you do, you have to see what prompts it.', source: 'Atomic Habits · Day 4', date: 'Today' },
    { type: 'reflection', text: 'My evening scroll is a reward I don’t even enjoy.', source: 'Atomic Habits · Day 3', date: 'Wed' },
    { type: 'reflection', text: '“Enough” for me is paying rent early and not checking my balance every day.', source: 'The Psychology of Money · Day 8', date: 'Tue' },
    { type: 'highlight', text: 'Decide who you want to be, then prove it with small wins.', source: 'Atomic Habits · Day 2', date: 'Tue' },
  ].filter((e) => tab === 'all' || e.type === tab)
  return (
    <div className="screen">
      <div className="body home">
        <div className="row-between"><h1 className="h1 md">Journal</h1><span className="muted-sm"><I.lock size={14} /> Only you</span></div>
        <div className="seg" role="tablist" aria-label="Journal entries">
          {[['all', 'All'], ['reflection', 'Reflections'], ['highlight', 'Highlights']].map(([id, l]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{l}</button>
          ))}
        </div>
        <div className="stack-10">
          <AnimatePresence mode="popLayout" initial={false}>
            {entries.map((e) => (
              <motion.div key={e.text} layout className={`entry ${e.type === 'highlight' ? 'peach' : ''}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="row-between"><span className={`entry-kind ${e.type === 'highlight' ? 'accent' : ''}`}>{e.type === 'highlight' ? 'Highlight' : 'Reflection'}</span><span className="muted-xs">{e.date}</span></div>
                <span className="entry-text">{e.text}</span>
                <span className="muted-xs strong">{e.source}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <TabBar active="journal" />
    </div>
  )
}

const MEMBERS = [['TK', 'Tobi', '#FF8A45', 'Day 9 done'], ['AO', 'You', '#7FB89D', 'Day 9 done'], ['NE', 'Nkem', '#1F4034', 'On Day 8']]
const SEED = [
  { who: 'Tobi', text: 'Moved my savings to an account I don’t see every day. Out of sight really works.' },
  { who: 'Nkem', text: 'Still on Day 8, catching up tonight. Don’t spoil it!' },
  { who: 'You', me: true, text: 'Enough is paying rent early and not checking my balance every day.' },
]
export function Club() {
  const { goBack, state, set } = useNav()
  const [draft, setDraft] = useState('')
  const listRef = useRef(null)
  const messages = [...SEED, ...state.chat]
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }) }, [messages.length])
  const send = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    set((s) => ({ chat: [...s.chat, { who: 'You', me: true, text }] }))
    setDraft('')
  }
  return (
    <div className="screen grey">
      <div className="top club-top">
        <button type="button" className="icon-btn" aria-label="Back" onClick={() => goBack('home')}><I.back /></button>
        <img src={COVERS.money} alt="" className="club-cover" />
        <span className="stack-0 flex-1"><strong>Sunday Book Club</strong><span className="muted-xs">The Psychology of Money · Day 9 of 21</span></span>
        <button type="button" className="icon-btn" aria-label="Invite friends"><I.invite /></button>
      </div>
      <div className="members">
        {MEMBERS.map(([ini, name, color, status]) => (
          <div key={ini} className="member"><span className="avatar" style={{ background: color, color: color === '#1F4034' ? '#fff' : '#16181B' }}>{ini}</span><span className="stack-0"><strong className="sm">{name}</strong><span className={`xs ${status.includes('done') ? 'green' : 'muted'}`}>{status}</span></span></div>
        ))}
      </div>
      <div className="question-card"><span className="eyebrow orange">Today’s question</span><strong>What does “enough” look like for you?</strong></div>
      <div className="chat-list" ref={listRef} aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div key={i} className={`bubble ${m.me ? 'me' : ''}`} initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
              <span className="bubble-who">{m.who}</span><span>{m.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <form className="composer" onSubmit={send}>
        <label htmlFor="msg" className="sr-only">Message</label>
        <input id="msg" type="text" placeholder={state.dayDone ? 'Share what you tried today…' : 'Share what you tried…'} value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button type="submit" className="send" aria-label="Send" disabled={!draft.trim()}><I.arrow /></button>
      </form>
    </div>
  )
}

// September reading log: 1 = read, 2 = grace day, 0 = missed.
const LOG = [0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1]
export function Profile() {
  const { go, state, reset } = useNav()
  const streak = state.dayDone ? 12 : 11
  return (
    <div className="screen">
      <div className="body home">
        <div className="row-10 center-y">
          <span className="avatar lg" style={{ background: '#7FB89D' }}>AO</span>
          <span className="stack-0 flex-1"><h1 className="h1 sm">Ada Okafor</h1><span className="muted-sm">Reading since September</span></span>
          <button type="button" className="round-btn outline sm" aria-label="Settings"><I.gear /></button>
        </div>
        <div className="grid-2 stats">
          <div className="stat green"><span className="stat-num">{streak}</span><span>day streak</span></div>
          <div className="stat"><span className="stat-num">2</span><span>books finished</span></div>
          <div className="stat"><span className="stat-num">{state.dayDone ? 30 : 29}</span><span>days read</span></div>
          <div className="stat"><span className="stat-num">{17 + Object.values(state.actions).filter(Boolean).length - 1}</span><span>actions tried</span></div>
        </div>
        <div className="calendar">
          <div className="row-between"><strong>September</strong><span className="muted-xs">Each dot is a day</span></div>
          <div className="cal-grid" aria-label="Reading days in September">{LOG.map((v, i) => <span key={i} className={`cal-dot v${v}`} title={`September ${i + 1}`} />)}</div>
          <div className="legend"><span><i className="cal-dot v1" />Read</span><span><i className="cal-dot v2" />Grace day</span><span><i className="cal-dot v0" />Missed</span></div>
        </div>
        <div className="settings">
          <div className="setting"><I.bell /><span className="flex-1">Daily reminder</span><span className="muted-sm">{state.remind ? TIMES[state.time].time : 'Off'}</span></div>
          <button type="button" className="setting" onClick={() => go('paywall')}><Leaf color="#CC4A0A" size={20} /><span className="flex-1">Mindleaf Plus</span><span className="accent-sm">{state.plus ? 'Active' : 'Upgrade'}</span><I.chevron /></button>
          <button type="button" className="setting" onClick={() => { reset(); go('welcome') }}><I.back /><span className="flex-1">Sign out and restart the demo</span></button>
        </div>
      </div>
      <TabBar active="profile" />
    </div>
  )
}

export function Paywall() {
  const { goBack, state, set } = useNav()
  return (
    <div className="screen green">
      <Top close="profile"><span className="flex-1" /></Top>
      <div className="body">
        <Logo size={56} variant="reversed" />
        <div className="stack-10">
          <span className="eyebrow orange">Mindleaf Plus</span>
          <h1 className="h1 on-dark">Every plan. Every book. Your way.</h1>
        </div>
        <ul className="checks on-dark">
          {['Every plan in the library', 'Audio for every daily reading', 'Book clubs with friends', 'Read offline, anywhere'].map((f) => <li key={f}><span className="tick on"><I.check color="#16181B" /></span>{f}</li>)}
        </ul>
        <div className="price-card"><span className="stack-2"><strong>Monthly</strong><span className="muted-sm">Cancel anytime</span></span><span className="price">₦5,000<small>/month</small></span></div>
      </div>
      <div className="foot">
        <AnimatePresence mode="wait" initial={false}>
          {state.plus ? (
            <motion.div key="on" className="plus-on" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <span className="tick on"><I.check color="#16181B" /></span><span>Plus is on for this demo. No payment was taken.</span>
            </motion.div>
          ) : (
            <motion.div key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Btn onClick={() => set({ plus: true })}>Get Plus for ₦5,000 a month</Btn>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="fine center on-dark">Billed monthly through your App Store or Google Play account.</p>
        <Btn kind="text" onClick={() => goBack('profile')}>{state.plus ? 'Done' : 'Not now'}</Btn>
      </div>
    </div>
  )
}
