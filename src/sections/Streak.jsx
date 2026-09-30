import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Eyebrow, Icon, Reveal } from '../ui.jsx'

const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const LEAVES = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 + (i % 2) * 0.3
  const d = 90 + (i % 3) * 34
  return { x: Math.cos(a) * d, y: Math.sin(a) * d - 30, r: (i * 67) % 360, c: i % 3 === 0 ? '#1F4034' : '#FF8A45' }
})

// Where the demo cursor sits, relative to the button row. The tip lands on the tick circle.
const CURSOR = {
  away: { x: 300, y: 120, opacity: 0, scale: 1 },
  enter: { x: 260, y: 90, opacity: 1, scale: 1 },
  target: { x: 44, y: 44, opacity: 1, scale: 1 },
  press: { x: 44, y: 44, opacity: 1, scale: 0.82 },
  leave: { x: 150, y: 110, opacity: 0, scale: 1 },
}
// One demo cycle, in ms from the start of the loop.
const TIMELINE = [
  [0, 'reset'],
  [400, 'enter'],
  [700, 'target'],
  [1600, 'press'],
  [1750, 'click'],
  [2600, 'leave'],
]
const LOOP_MS = 6000

function Leaf({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20c0-9 6-15 16-15 0 10-6 15-15 15z" fill={color} />
    </svg>
  )
}

function Pointer() {
  return (
    <svg width="30" height="34" viewBox="0 0 30 34" aria-hidden="true">
      <path d="M3 2.5v24.2c0 .9 1.1 1.3 1.7.7l5.7-5.9 4.2 9.6c.3.6 1 .9 1.6.6l3.4-1.5c.6-.3.9-1 .6-1.6l-4.2-9.4 8.3-.6c.9-.1 1.3-1.1.7-1.7L4.7 1.8C4.1 1.2 3 1.6 3 2.5z" fill="#16181B" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

// Streak demo: a cursor taps "Finish Day 4" on its own, the count rolls 11 → 12 and leaves burst.
// Visitors can still tap it themselves, which hands control over and stops the demo.
function StreakCard() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.6 })
  const reduce = useReducedMotion()
  const [done, setDone] = useState(false)
  const [burst, setBurst] = useState(0)
  const [cursor, setCursor] = useState('away')
  const [auto, setAuto] = useState(true)
  const count = done ? 12 : 11

  useEffect(() => {
    if (!inView || !auto || reduce) {
      setCursor('away')
      return undefined
    }
    let timers = []
    const run = () => {
      timers = TIMELINE.map(([ms, step]) => setTimeout(() => {
        if (step === 'reset') { setDone(false); setCursor('away') }
        else if (step === 'click') { setCursor('target'); setDone(true); setBurst((b) => b + 1) }
        else setCursor(step)
      }, ms))
    }
    run()
    const loop = setInterval(run, LOOP_MS)
    return () => { clearInterval(loop); timers.forEach(clearTimeout) }
  }, [inView, auto, reduce])

  const onClick = () => {
    setAuto(false)
    setCursor('away')
    if (!done) setBurst((b) => b + 1)
    setDone((d) => !d)
  }

  return (
    <div className="streak-card" ref={ref}>
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
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
              <motion.span className={`streak-dot is-${state}`} animate={i === 3 && done ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
                {state === 'done' && <Icon.check width="12" height="12" />}
              </motion.span>
            </div>
          )
        })}
      </div>
      <div className="streak-action">
        <motion.button
          type="button"
          className={`tick ${done ? 'is-done' : ''}`}
          onClick={onClick}
          aria-pressed={done}
          animate={{ scale: cursor === 'press' ? 0.98 : 1 }}
          transition={{ duration: 0.1 }}
        >
          <motion.span className="tick-circle" aria-hidden="true" animate={{ scale: cursor === 'press' ? 0.88 : 1 }} transition={{ duration: 0.1 }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={false} animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }} transition={{ duration: 0.3, delay: done ? 0.1 : 0 }} />
            </svg>
          </motion.span>
          <span className="tick-text">{done ? 'Day 4 done. See you tomorrow.' : 'Finish Day 4'}</span>
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
        </motion.button>
        <motion.span
          className="demo-cursor"
          aria-hidden="true"
          initial={false}
          animate={CURSOR[cursor]}
          transition={{
            duration: cursor === 'target' ? 0.9 : cursor === 'press' ? 0.1 : 0.3,
            ease: cursor === 'leave' ? [0.7, 0, 0.84, 0] : [0.16, 1, 0.3, 1],
          }}
        >
          <Pointer />
          <AnimatePresence>
            {cursor === 'press' && (
              <motion.span className="click-ring" initial={{ scale: 0.4, opacity: 0.8 }} animate={{ scale: 1.6, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} />
            )}
          </AnimatePresence>
        </motion.span>
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
        </div>
        <Reveal delay={0.1} y={40}><StreakCard /></Reveal>
      </div>
    </section>
  )
}
