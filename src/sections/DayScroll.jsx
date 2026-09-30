import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { MOMENTS } from '../data.js'
import { Eyebrow, Icon } from '../ui.jsx'

const SKY = ['#FFE9DC', '#FFE9DC', '#E3ECE7', '#E3ECE7', '#16181B', '#16181B']
const INK = ['#16181B', '#16181B', '#16181B', '#16181B', '#F4F4F2', '#F4F4F2']
const STOPS = [0, 0.28, 0.38, 0.62, 0.72, 1]

function ReadScreen() {
  return (
    <div className="scr scr-read">
      <div className="scr-top"><span>Day 4 of 14</span><span className="scr-muted">8 min</span></div>
      <div className="scr-bar"><motion.span initial={{ width: '10%' }} animate={{ width: '62%' }} transition={{ duration: 1.4, ease: 'easeOut' }} /></div>
      <span className="scr-kicker">Atomic Habits · Part 2</span>
      <h3 className="scr-h">The cue comes first.</h3>
      <p className="scr-p">Every habit starts with something you notice. A phone on the table, a smell from the kitchen, the time on the clock.</p>
      <div className="scr-quote">Make the good cues easy to see. Hide the ones that pull you off course.</div>
      <p className="scr-p">Before you can change what you do, you have to see what prompts it.</p>
      <span className="scr-btn">Done reading <Icon.arrow width="14" height="14" /></span>
    </div>
  )
}

const ACTIONS = ['Notice three cues at home', 'Put tonight’s book on your pillow', 'Move one distraction out of sight']
function ActScreen() {
  return (
    <div className="scr scr-act">
      <div className="scr-top"><span>Day 4 · Live it</span><span className="scr-muted">2 of 3</span></div>
      <h3 className="scr-h">Now, try it today.</h3>
      <div className="scr-list">
        {ACTIONS.map((a, i) => (
          <motion.div key={a} className="scr-item" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12 }}>
            <motion.span
              className="scr-check"
              initial={{ backgroundColor: 'rgba(255,138,69,0)', scale: 1 }}
              animate={i < 2 ? { backgroundColor: 'rgba(255,138,69,1)', scale: [1, 1.2, 1] } : {}}
              transition={{ delay: 0.7 + i * 0.35, duration: 0.35 }}
            >
              {i < 2 && <Icon.check />}
            </motion.span>
            <span>{a}</span>
          </motion.div>
        ))}
      </div>
      <div className="scr-note">Small enough to do before dinner.</div>
    </div>
  )
}

const ANSWER = 'Reaching for my phone the second I wake up. It charges right next to my bed.'
function ReflectScreen() {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? ANSWER.length : 0)
  useEffect(() => {
    if (reduce) return undefined
    const t = setInterval(() => setN((v) => (v >= ANSWER.length ? v : v + 1)), 32)
    return () => clearInterval(t)
  }, [reduce])
  return (
    <div className="scr scr-reflect">
      <div className="scr-top"><span>Day 4 · Tonight</span><span className="scr-muted">Journal</span></div>
      <span className="scr-kicker">Sit with this</span>
      <h3 className="scr-h">What sets off the habit you most want to change?</h3>
      <div className="scr-answer">{ANSWER.slice(0, n)}<span className="caret" /></div>
      <span className="scr-btn">Finish Day 4</span>
      <motion.div className="scr-toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 }}>
        <span className="scr-check on"><Icon.check /></span> 12 day streak
      </motion.div>
    </div>
  )
}

const SCREENS = [ReadScreen, ActScreen, ReflectScreen]

export default function DayScroll() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const bg = useTransform(scrollYProgress, STOPS, SKY)
  const ink = useTransform(scrollYProgress, STOPS, INK)
  const sunX = useTransform(scrollYProgress, [0, 1], ['54%', '94%'])
  const sunY = useTransform(scrollYProgress, [0, 0.5, 1], [260, 110, 260])
  const sunColor = useTransform(scrollYProgress, [0, 0.45, 0.66, 0.74], ['#FF8A45', '#FFC069', '#FFC069', '#F4F4F2'])
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const [step, setStep] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(v < 0.33 ? 0 : v < 0.67 ? 1 : 2))
  const m = MOMENTS[step]
  const Screen = SCREENS[step]

  return (
    <section id="how" ref={ref} className="day">
      <motion.div className="day-sticky" style={{ backgroundColor: bg, color: ink }}>
        {!reduce && <motion.span className="sun" style={{ left: sunX, top: sunY, backgroundColor: sunColor }} aria-hidden="true" />}
        <div className="container day-grid">
          <div className="day-copy">
            <Eyebrow tone="on-sky">How it works · a day with Mindleaf</Eyebrow>
            <h2 className="h2 day-h">One book.<br />Three small moments a day.</h2>
            <div className="day-step" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="day-step-inner"
                >
                  <span className="day-time">{m.time}</span>
                  <h3 className="day-title">{m.title}</h3>
                  <p className="day-body">{m.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="day-progress" aria-hidden="true">
              <div className="day-track"><motion.span style={{ width: fill }} /></div>
              <div className="day-labels">
                {MOMENTS.map((x, i) => <span key={x.id} className={i === step ? 'on' : ''}>{x.label}</span>)}
              </div>
            </div>
          </div>
          <div className="day-visual">
            <div className="phone">
              <div className="phone-screen">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    className="phone-page"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Screen />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
