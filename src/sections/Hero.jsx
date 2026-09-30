import { motion, useInView, useReducedMotion } from 'motion/react'
import { Fragment, useRef } from 'react'
import { COVERS, PLAN_DAYS } from '../data.js'
import { Icon, Scribble } from '../ui.jsx'

const ease = [0.22, 1, 0.36, 1]

function Words({ text, delay = 0 }) {
  return text.split(' ').map((w, i) => (
    <Fragment key={`${w}-${i}`}>
      <span className="word-mask">
        <motion.span
          className="word"
          initial={{ y: '110%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 0.8, delay: delay + i * 0.06, ease }}
        >
          {w}
        </motion.span>
      </span>{' '}
    </Fragment>
  ))
}

// A plan deals itself out into days: the page's one big orchestrated moment.
function BookFan() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const go = inView || reduce
  const mid = (PLAN_DAYS.length - 1) / 2
  return (
    <div className="fan" ref={ref} aria-label="A reading plan split into daily readings: 3 of 14 days done, day 4 is today">
      <motion.div
        className="fan-note"
        initial={{ opacity: 0, y: 10 }}
        animate={go ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <span>14 mornings · 8 min each</span>
        <svg viewBox="0 0 80 60" aria-hidden="true">
          <motion.path
            d="M6 6 C 30 8, 60 20, 62 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={go ? { pathLength: 1 } : undefined}
            transition={{ delay: 1.5, duration: 0.6 }}
          />
          <motion.path d="M54 42 L62 52 L70 42" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ opacity: 0 }} animate={go ? { opacity: 1 } : undefined} transition={{ delay: 2 }} />
        </svg>
      </motion.div>

      {PLAN_DAYS.map((d, i) => {
        const off = i - mid
        const rotate = off * 8
        const x = off * 34
        const y = Math.abs(off) * 12 - (d.state === 'today' ? 38 : 0)
        return (
          <motion.div
            key={d.day}
            className={`fan-card is-${d.state}`}
            style={{ zIndex: d.state === 'today' ? 20 : 10 - Math.abs(off) }}
            initial={reduce ? false : { opacity: 0, rotate: 0, x: 0, y: 150 }}
            animate={go ? { opacity: 1, rotate, x, y } : undefined}
            whileHover={{ y: y - 18, transition: { duration: 0.2, ease: 'easeOut' } }}
            transition={{ delay: 0.5 + i * 0.06, duration: 0.9, ease }}
          >
            <div className="fan-card-top">
              <span className="fan-day">Day {d.day}</span>
              {d.state === 'done' && <span className="fan-done"><Icon.check /></span>}
              {d.state === 'today' && <span className="fan-today">Today</span>}
              {d.state === 'next' && <span className="fan-lock"><Icon.lock /></span>}
            </div>
            <span className="fan-title">{d.title}</span>
            <span className="fan-meta"><Icon.clock /> 8 min</span>
          </motion.div>
        )
      })}

      <motion.div
        className="fan-progress"
        initial={reduce ? false : { opacity: 0, x: '-50%', y: 16 }}
        animate={go ? { opacity: 1, x: '-50%', y: 0 } : undefined}
        transition={{ delay: 0.15, duration: 0.6, ease }}
      >
        <span className="fan-progress-dot"><Icon.check /></span>
        <span className="fan-progress-text"><strong>3 of 14 days</strong> done</span>
        <span className="fan-progress-bar" aria-hidden="true">
          <motion.span initial={{ scaleX: 0 }} animate={go ? { scaleX: 3 / 14 } : undefined} transition={{ delay: 1.2, duration: 0.8, ease }} />
        </span>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">
            <Words text="Finish the books" delay={0.15} />
            <br />
            <Words text="you" delay={0.4} />
            <span className="hl">
              <span className="word-mask">
                <motion.span className="word" initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.8, delay: 0.48, ease }}>
                  start.
                </motion.span>
              </span>
              <Scribble delay={1.15} />
            </span>
          </h1>
          <motion.p className="hero-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
            Mindleaf breaks big self-help books into ten-minute daily readings. Each one ends with a small thing to try and a question to think about, so the ideas actually stick.
          </motion.p>
          <motion.div className="hero-ctas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.6 }}>
            <a href="#start" className="btn btn-orange btn-lg">Start Day 1 free <Icon.arrow /></a>
            <a href="#how" className="btn btn-ghost btn-lg">See how a day works</a>
          </motion.div>
          <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
            <div className="proof-covers">
              {[COVERS.money, COVERS.deep, COVERS.mindset].map((c) => <img key={c} src={c} alt="" />)}
            </div>
            <span>Plans for <strong>Atomic Habits</strong>, <strong>The Psychology of Money</strong>, <strong>Deep Work</strong> and more</span>
          </motion.div>
        </div>
        <BookFan />
      </div>
    </section>
  )
}
