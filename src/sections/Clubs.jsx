import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { CLUB_CHAT, CLUB_MEMBERS } from '../data.js'
import { Eyebrow, Reveal } from '../ui.jsx'

const TYPE_MS = 1400 // how long someone "types" before their message lands
const GAP_MS = 700 // pause after a message before the next person starts typing
const END_MS = 2800 // pause on the last message before the conversation restarts
const VISIBLE = 3
const member = (who) => CLUB_MEMBERS.find((m) => m.who === who)

// Looping group chat: typing dots → message lands → next person types → … → restart.
function Chat() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(reduce ? VISIBLE : 0)
  const [typing, setTyping] = useState(null)

  useEffect(() => {
    if (!inView || reduce) return undefined
    let timers = []
    const play = () => {
      timers.forEach(clearTimeout)
      timers = []
      setShown(0)
      setTyping(null)
      let t = 500
      CLUB_CHAT.forEach((m, i) => {
        timers.push(setTimeout(() => setTyping(m.who), t))
        t += TYPE_MS
        timers.push(setTimeout(() => { setTyping(null); setShown(i + 1) }, t))
        t += GAP_MS
      })
      timers.push(setTimeout(play, t + END_MS))
    }
    play()
    return () => timers.forEach(clearTimeout)
  }, [inView, reduce])

  const visible = CLUB_CHAT.slice(0, shown).map((m, i) => ({ ...m, i })).slice(-VISIBLE)
  const typer = typing && member(typing)
  const typerIsMe = typing === 'You'

  return (
    <div className="chat" ref={ref} aria-label="Example group chat for the Sunday Book Club">
      <div className="chat-head">
        <div className="avatars">
          {CLUB_MEMBERS.map((c) => <span key={c.initials} style={{ background: c.color }}>{c.initials}</span>)}
        </div>
        <span><strong>Sunday Book Club</strong> · Day 9 of 21</span>
      </div>
      <div className="chat-body">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((m) => (
            <motion.div
              key={m.i}
              layout
              className={`bubble ${m.me ? 'me' : ''}`}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="bubble-who">{m.who} · Day 9</span>
              <span>{m.text}</span>
            </motion.div>
          ))}
          {typer && (
            <motion.div
              key={`typing-${shown}`}
              layout
              className={`typing ${typerIsMe ? 'me' : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              aria-hidden="true"
            >
              <span className="typing-avatar" style={{ background: typer.color }}>{typer.initials}</span>
              <span className="typing-dots"><span /><span /><span /></span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Clubs() {
  return (
    <section id="clubs" className="section clubs">
      <div className="container">
        <div className="clubs-card">
          <div className="clubs-copy">
            <Reveal><Eyebrow>Book clubs · new</Eyebrow></Reveal>
            <Reveal delay={0.05}><h2 className="h2">Start a plan with friends. <span className="accent-text">Finish it together.</span></h2></Reveal>
            <Reveal delay={0.1}><p className="lede">Invite your book club, your partner or your team. Everyone reads the same page each day and shares what they tried.</p></Reveal>
            <Reveal delay={0.15}><a href="#start" className="btn btn-ghost">Create a group plan</a></Reveal>
          </div>
          <Chat />
        </div>
      </div>
    </section>
  )
}
