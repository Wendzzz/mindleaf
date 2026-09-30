import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Eyebrow, Icon, Reveal } from '../ui.jsx'

const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const LEAVES = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 + (i % 2) * 0.3
  const d = 90 + (i % 3) * 34
  return { x: Math.cos(a) * d, y: Math.sin(a) * d - 30, r: (i * 67) % 360, c: i % 3 === 0 ? '#1F4034' : '#FF8A45' }
})

function Leaf({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20c0-9 6-15 16-15 0 10-6 15-15 15z" fill={color} />
    </svg>
  )
}

// Interactive streak: tap to tick off today, the count rolls over and leaves burst out.
function StreakCard() {
  const [done, setDone] = useState(false)
  const [burst, setBurst] = useState(0)
  const count = done ? 12 : 11
  const toggle = () => {
    if (!done) setBurst((b) => b + 1)
    setDone((d) => !d)
  }
  return (
    <div className="streak-card">
      <div className="streak-head">
        <div className="streak-count" aria-live="polite">
          <span className="sr-only">{count} day streak</span>
          <span className="streak-num" aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                initial={{ y: done ? 60 : -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: done ? -60 : 60, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="streak-label" aria-hidden="true">day streak</span>
        </div>
        <div className="streak-grace" title="Grace days protect your streak if you miss a day">
          <span>Grace days</span>
          <span className="grace-leaves"><Leaf color="#1F4034" /><Leaf color="#1F4034" /></span>
        </div>
      </div>
      <div className="streak-week">
        {WEEK.map((d, i) => {
          const state = i < 3 ? 'done' : i === 3 ? (done ? 'done' : 'today') : 'next'
          return (
            <div key={i} className="streak-day">
              <span className={i === 3 ? 'today-label' : ''}>{d}</span>
              <motion.span className={`streak-dot is-${state}`} animate={i === 3 && done ? { scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.35 }}>
                {state === 'done' && <Icon.check width="12" height="12" />}
              </motion.span>
            </div>
          )
        })}
      </div>
      <div className="streak-action">
        <button type="button" className={`tick ${done ? 'is-done' : ''}`} onClick={toggle} aria-pressed={done}>
          <span className="tick-ring" aria-hidden="true" />
          <span className="tick-circle" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={false} animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }} transition={{ duration: 0.35, delay: done ? 0.1 : 0 }} />
            </svg>
          </span>
          <span className="tick-text">{done ? 'Day 4 done. See you tomorrow.' : 'Tap to finish Day 4'}</span>
          <AnimatePresence>
            {burst > 0 && done && (
              <motion.span key={burst} className="burst" aria-hidden="true">
                {LEAVES.map((l, i) => (
                  <motion.span
                    key={i}
                    className="burst-leaf"
                    initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.4 }}
                    animate={{ x: l.x, y: l.y, rotate: l.r, opacity: 0, scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Leaf color={l.c} />
                  </motion.span>
                ))}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}

export default function Streak() {
  return (
    <section className="section streak">
      <div className="container streak-grid">
        <div className="streak-copy">
          <Reveal><Eyebrow>Streaks, the kind way</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 className="h2">Small wins, <span className="accent-text">every morning.</span></h2></Reveal>
          <Reveal delay={0.1}><p className="lede">Each finished day grows your streak. Miss one and nothing breaks: your plan waits, and two grace days a week keep your streak safe.</p></Reveal>
          <Reveal delay={0.15}><p className="hint">Go on, try it <Icon.arrow /></p></Reveal>
        </div>
        <Reveal delay={0.1} y={40}><StreakCard /></Reveal>
      </div>
    </section>
  )
}
