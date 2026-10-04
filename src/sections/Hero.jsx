import { motion, useInView, useReducedMotion } from 'motion/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { COVERS, PLAN_DAYS } from '../data.js'
import { Icon, Scribble } from '../ui.jsx'

const ease = [0.22, 1, 0.36, 1]

function Words({ text, delay = 0, active }) {
  return text.split(' ').map((w, i) => (
    <Fragment key={`${w}-${i}`}>
      <span className="word-mask">
        <motion.span
          className="word"
          initial={{ y: '110%' }}
          animate={active ? { y: '0%' } : undefined}
          transition={{ duration: 0.8, delay: delay + i * 0.06, ease }}
        >
          {w}
        </motion.span>
      </span>{' '}
    </Fragment>
  ))
}

// Timing budget (ms) for the one-shot "open the book, flip through every
// page, close it" intro that plays once on load, before the shrink-and-dock.
const OPEN = 650
const PAGE_GAP = 230
const PAGE_DUR = 360
const PAGE_COUNT = 4
const PAGES_START = OPEN + 40
const PAGES_END = PAGES_START + (PAGE_COUNT - 1) * PAGE_GAP + PAGE_DUR
const CLOSE_START = PAGES_END + 100
const CLOSE_DUR = 520
const CLOSE_END = CLOSE_START + CLOSE_DUR
const DOCK_DELAY = CLOSE_END + 180 // a closed-book beat before it docks
const COVER_TOTAL = DOCK_DELAY / 1000
const DOCK_DURATION = 0.85

// Four slightly different leaves, so the flip-through reads as a stack of
// pages rather than one shape repeating.
const PAGE_PATHS = [
  'M210 40 C 256 18, 312 24, 352 46 L 352 214 C 312 194, 256 188, 210 208 Z',
  'M210 42 C 262 20, 320 26, 358 48 L 358 212 C 320 192, 262 186, 210 206 Z',
  'M210 38 C 258 14, 314 20, 356 42 L 356 216 C 314 196, 258 190, 210 210 Z',
  'M210 40 C 260 16, 320 22, 360 44 L 360 212 C 320 192, 260 186, 210 206 Z',
]

// The open book behind the day-card fan. `playIntro` runs the one-shot
// flip-through once on load (cover opens, every page turns, cover closes);
// afterwards — and for reduced motion, which skips the flip-through
// entirely — it's a static or slowly idling cover instead.
function BookArt({ playIntro, reduce }) {
  return (
    <svg viewBox="0 0 420 300" aria-hidden="true" className="book-art">
      <path d="M210 40 C 120 10, 30 24, 10 52 L 10 230 C 30 204, 120 192, 210 220 Z" fill="var(--surface)" stroke="var(--rule)" />
      <path d="M210 40 C 300 10, 390 24, 410 52 L 410 230 C 390 204, 300 192, 210 220 Z" fill="var(--surface)" stroke="var(--rule)" />
      <path d="M210 40 L 210 220" stroke="var(--rule)" strokeWidth="2" />

      {/* Each page collapses flat against the spine in turn — a flip read
          through its silhouette rather than a 3D rotation, so it stays
          legible without a perspective rig. The cream page-edge beneath
          shows through as each one goes, then the next is revealed. */}
      {playIntro && PAGE_PATHS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill={i % 2 ? 'var(--panel)' : '#fff'}
          stroke="var(--rule)"
          style={{ transformOrigin: '210px 128px' }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ delay: (PAGES_START + i * PAGE_GAP) / 1000, duration: PAGE_DUR / 1000, ease: 'easeIn' }}
        />
      ))}

      {reduce ? (
        <path d="M210 40 C 260 16, 320 22, 360 44 L 360 212 C 320 192, 260 186, 210 206 Z" fill="var(--panel)" />
      ) : playIntro ? (
        <motion.path
          d="M210 40 C 260 16, 320 22, 360 44 L 360 212 C 320 192, 260 186, 210 206 Z"
          fill="var(--panel)"
          stroke="var(--rule)"
          style={{ transformOrigin: '210px 128px' }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: [1, 0, 0, 1] }}
          transition={{ duration: COVER_TOTAL, times: [0, OPEN / DOCK_DELAY, CLOSE_START / DOCK_DELAY, CLOSE_END / DOCK_DELAY], ease: 'easeInOut' }}
        />
      ) : (
        <motion.path
          d="M210 40 C 260 16, 320 22, 360 44 L 360 212 C 320 192, 260 186, 210 206 Z"
          fill="var(--panel)"
          style={{ transformOrigin: '210px 128px' }}
          animate={{ rotateY: [0, 170, 170, 0] }}
          transition={{ duration: 6, times: [0, 0.18, 0.82, 1], repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
        />
      )}

      {playIntro && (
        <motion.g initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: (OPEN * 0.35) / 1000, duration: 0.3 }}>
          <path d="M296 108c0-14 10-24 25-24 0 16-10 26-23 26z" fill="var(--accent)" />
          <path d="M297 129 310 113" stroke="var(--forest)" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      )}
    </svg>
  )
}

// The loading moment: the book opens, flips through its pages and closes,
// dead centre — then shrinks and slides exactly onto the small book already
// waiting (invisible) in the fan's slot, fading out as that one fades in. A
// plain measured transform rather than a shared `layoutId` match: the stage
// lives in a body portal (to escape `.hero`'s own overflow:hidden) while the
// real book lives inside `.fan`, and a layout transition that crosses a
// portal boundary like that ghosts — briefly rendering both ends of the
// transition at once. `dockTarget` is measured from the real slot's actual
// on-screen position (see Hero's effect below) so the two line up exactly.
function BookIntroStage({ docking, dockTarget }) {
  return createPortal(
    <>
      <motion.div
        className="book-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: docking ? 0 : 1 }}
        transition={{ duration: docking ? 0.45 : 0.5 }}
      />
      <div className="book-stage">
        <motion.div
          className="book-stage-inner"
          initial={{ opacity: 0, scale: 0.92, x: 0, y: 0 }}
          animate={docking
            ? { opacity: 0, scale: dockTarget.scale, x: dockTarget.x, y: dockTarget.y }
            : { opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ duration: docking ? DOCK_DURATION : 0.4, ease }}
        >
          <BookArt playIntro reduce={false} />
        </motion.div>
      </div>
    </>,
    document.body,
  )
}

// A plan deals itself out into days: the page's one big orchestrated moment.
// Waits for `ready` (the book has started docking, or reduced motion skipped
// straight there) before dealing the cards, so the fan arrives as the book lands.
function BookFan({ ready, showStage, docking, dockTarget, reduce }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const go = (inView && ready) || reduce
  const mid = (PLAN_DAYS.length - 1) / 2
  return (
    <motion.div
      className="fan"
      ref={ref}
      aria-label="A reading plan split into daily readings: 3 of 14 days done, day 4 is today"
      animate={go && !reduce ? { y: [0, -10, 0] } : undefined}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
    >
      {!reduce && showStage && <BookIntroStage docking={docking} dockTarget={dockTarget} />}
      <motion.div
        className="fan-book"
        initial={reduce ? false : { opacity: 0, scale: 0.85 }}
        animate={ready ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.5, ease }}
      >
        <BookArt playIntro={false} reduce={reduce} />
      </motion.div>
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
    </motion.div>
  )
}

const FALLBACK_DOCK_TARGET = { x: '30vw', y: '-9vh', scale: 0.32 }

export default function Hero() {
  const reduce = useReducedMotion()
  const [docking, setDocking] = useState(reduce)
  const [showStage, setShowStage] = useState(!reduce)
  const [dockTarget, setDockTarget] = useState(FALLBACK_DOCK_TARGET)
  const ready = reduce || docking

  useEffect(() => {
    if (reduce) return
    const t1 = setTimeout(() => {
      // Measure the real (still invisible) book's on-screen slot so the
      // stage's shrink lands exactly on it instead of just roughly nearby.
      const stageEl = document.querySelector('.book-stage-inner')
      const targetEl = document.querySelector('.fan-book')
      if (stageEl && targetEl) {
        const s = stageEl.getBoundingClientRect()
        const t = targetEl.getBoundingClientRect()
        if (s.width && t.width) {
          setDockTarget({
            x: (t.left + t.width / 2) - (s.left + s.width / 2),
            y: (t.top + t.height / 2) - (s.top + s.height / 2),
            scale: t.width / s.width,
          })
        }
      }
      setDocking(true)
    }, DOCK_DELAY)
    const t2 = setTimeout(() => setShowStage(false), DOCK_DELAY + DOCK_DURATION * 1000 + 120)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [reduce])

  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">
            <Words text="Finish the books" delay={0.15} active={ready} />
            <br />
            <Words text="you" delay={0.4} active={ready} />
            <span className="hl">
              <span className="word-mask">
                <motion.span className="word" initial={{ y: '110%' }} animate={ready ? { y: '0%' } : undefined} transition={{ duration: 0.8, delay: 0.48, ease }}>
                  start.
                </motion.span>
              </span>
              {ready && <Scribble delay={0.65} />}
            </span>
          </h1>
          <motion.p className="hero-lede" initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.7, duration: 0.6 }}>
            Mindleaf breaks big self-help books into ten-minute daily readings. Each one ends with a small thing to try and a question to think about, so the ideas actually stick.
          </motion.p>
          <motion.div className="hero-ctas" initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.85, duration: 0.6 }}>
            <a href="./app/" className="btn btn-orange btn-lg">Start Day 1 free <Icon.arrow /></a>
            <a href="#how" className="btn btn-ghost btn-lg">See how a day works</a>
          </motion.div>
          <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ delay: 1.1 }}>
            <div className="proof-covers">
              {[COVERS.money, COVERS.deep, COVERS.mindset].map((c) => <img key={c} src={c} alt="" />)}
            </div>
            <span>Plans for <strong>Atomic Habits</strong>, <strong>The Psychology of Money</strong>, <strong>Deep Work</strong> and more</span>
          </motion.div>
        </div>
        <BookFan ready={ready} showStage={showStage} docking={docking} dockTarget={dockTarget} reduce={reduce} />
      </div>
    </section>
  )
}
