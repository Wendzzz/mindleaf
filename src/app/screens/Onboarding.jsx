import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { BOOKS } from '../../data.js'
import { DAY1, GOALS, TIMES, useNav } from '../nav.js'
import { Btn, I, Leaf, Logo, Steps, Top } from '../parts.jsx'

const ease = [0.16, 1, 0.3, 1]
const book = (id) => BOOKS.find((b) => b.id === id)

// Small version of the website's hero fan: days rise out and fan open.
function MiniFan() {
  const cards = [
    { day: 2, title: 'Become the person first', x: -92, y: 22, r: -16, dim: false },
    { day: 3, title: 'The four steps of a habit', x: -46, y: 8, r: -8, dim: false },
    { day: 6, title: 'Design your space', x: 92, y: 22, r: 16, dim: true },
    { day: 5, title: 'Stack it on what you do', x: 46, y: 8, r: 8, dim: true },
  ]
  return (
    <div className="mini-fan" aria-hidden="true">
      {cards.map((c, i) => (
        <motion.div key={c.day} className={`mini-card ${c.dim ? 'dim' : ''}`}
          initial={{ x: 0, y: 90, rotate: 0, opacity: 0 }}
          animate={{ x: c.x, y: c.y, rotate: c.r, opacity: 1 }}
          transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease }}>
          <span className="mini-day">Day {c.day}</span><span className="mini-title">{c.title}</span>
        </motion.div>
      ))}
      <motion.div className="mini-card today" initial={{ y: 90, opacity: 0 }} animate={{ y: -26, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8, ease }}>
        <div className="row-between"><span className="mini-day accent">Day 4</span><span className="pill-today">Today</span></div>
        <span className="mini-title">The cue comes first</span>
        <span className="mini-meta">8 min</span>
      </motion.div>
      <motion.div className="progress-pill" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5, ease }}>
        <span className="pp-dot"><I.check color="#16181B" /></span><span><strong>3 of 14 days</strong> <span className="pp-soft">done</span></span>
      </motion.div>
    </div>
  )
}

export function Welcome() {
  const { go } = useNav()
  return (
    <div className="screen">
      <div className="top brand-top"><Logo size={30} /><span className="brand-word">Mindleaf</span></div>
      <MiniFan />
      <div className="body">
        <h1 className="h1 xl">Finish the books you <span className="hl">start.<svg viewBox="0 0 240 26" preserveAspectRatio="none" aria-hidden="true"><motion.path d="M4 17 C 46 7, 96 5, 138 10 S 212 21, 236 9" fill="none" stroke="#FF8A45" strokeWidth="7" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 0.6 }} /></svg></span></h1>
        <p className="lede">Ten minutes a day. One idea to read, one thing to try, one question to think about.</p>
      </div>
      <div className="foot">
        <Btn onClick={() => go('signin')}>Get started <I.arrow /></Btn>
        <Btn kind="ghost" onClick={() => go('signin')}>I already have an account</Btn>
      </div>
    </div>
  )
}

export function SignIn() {
  const { go, state, set } = useNav()
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())
  return (
    <div className="screen">
      <Top back="welcome" />
      <form className="body" onSubmit={(e) => { e.preventDefault(); if (valid) go('verify') }}>
        <div className="stack-10">
          <h1 className="h1">Let’s get you <span className="green">reading.</span></h1>
          <p className="lede">Sign in or create an account. No password to remember.</p>
        </div>
        <div className="stack-10">
          <Btn kind="dark" onClick={() => go('goals')}><I.apple /> Continue with Apple</Btn>
          <Btn kind="ghost" onClick={() => go('goals')}><span className="g-mark" aria-hidden="true">G</span> Continue with Google</Btn>
        </div>
        <div className="divider">or use your email</div>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="email" value={state.email} onChange={(e) => set({ email: e.target.value })} aria-invalid={!valid} aria-describedby="email-hint" />
          <span id="email-hint" className={valid ? 'hint' : 'hint error'}>{valid ? 'We’ll send a 6-digit code to sign you in.' : 'Enter an email address like name@example.com.'}</span>
        </div>
        <Btn type="submit" disabled={!valid}>Send me a code</Btn>
      </form>
      <p className="foot fine center">By continuing you agree to Mindleaf’s <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
    </div>
  )
}

const CODE = '482193'
export function Verify() {
  const { go, state } = useNav()
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? CODE.length : 0)
  useEffect(() => {
    if (reduce) return undefined
    const t = setInterval(() => setN((v) => (v >= CODE.length ? v : v + 1)), 220)
    return () => clearInterval(t)
  }, [reduce])
  const complete = n >= CODE.length
  return (
    <div className="screen">
      <Top back="signin" />
      <div className="body">
        <div className="icon-tile peach"><I.mail /></div>
        <div className="stack-10">
          <h1 className="h1">Check your email</h1>
          <p className="lede">We sent a 6-digit code to <strong>{state.email}</strong>.</p>
        </div>
        <div className="otp" role="group" aria-label="6-digit code">
          {CODE.split('').map((d, i) => (
            <motion.span key={i} className={`otp-box ${i < n ? 'filled' : ''} ${i === n ? 'active' : ''}`}
              animate={i < n ? { scale: [0.9, 1] } : {}} transition={{ duration: 0.15 }}>
              {i < n ? d : i === n ? <span className="caret" /> : ''}
            </motion.span>
          ))}
        </div>
        <p className="lede small" aria-live="polite">{complete ? <span className="ok"><I.check color="#1F4034" /> Code filled in from your email</span> : 'Filling in your code…'}</p>
      </div>
      <div className="foot">
        <Btn onClick={() => go('goals')} disabled={!complete}>Verify and continue</Btn>
        <Btn kind="text" onClick={() => go('signin')}>Use a different email</Btn>
      </div>
    </div>
  )
}

export function Goals() {
  const { go, state, set } = useNav()
  const toggle = (id) => set((s) => {
    if (s.goals.includes(id)) return { goals: s.goals.filter((g) => g !== id) }
    return s.goals.length < 3 ? { goals: [...s.goals, id] } : {}
  })
  const count = state.goals.length
  return (
    <div className="screen">
      <Steps step={1} back="verify" />
      <div className="body">
        <div className="stack-10">
          <span className="eyebrow">Step 1 of 4</span>
          <h1 className="h1">What do you want to change?</h1>
          <p className="lede">Pick up to three. We’ll suggest where to start.</p>
        </div>
        <div className="grid-2" role="group" aria-label="Goals">
          {GOALS.map((g) => {
            const on = state.goals.includes(g.id)
            return (
              <button key={g.id} type="button" className={`option goal ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggle(g.id)}>
                <span className="tick">{on && <I.check color="#16181B" />}</span>
                <span className="option-title">{g.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="foot">
        <span className="fine center" aria-live="polite">{count === 0 ? 'Pick at least one' : count === 3 ? '3 of 3 picked (that’s the most)' : `${count} of 3 picked`}</span>
        <Btn onClick={() => {
          const first = GOALS.find((g) => g.id === state.goals[0])
          set({ plan: first ? first.plan : 'atomic' })
          go('schedule')
        }} disabled={count === 0}>Continue</Btn>
      </div>
    </div>
  )
}

const TIME_ICON = { morning: I.sunrise, noon: I.sun, night: I.moon }
export function Schedule() {
  const { go, state, set } = useNav()
  return (
    <div className="screen">
      <Steps step={2} back="goals" />
      <div className="body">
        <div className="stack-10">
          <span className="eyebrow">Step 2 of 4</span>
          <h1 className="h1">When will you read?</h1>
          <p className="lede">Tie it to something you already do. That’s what makes it stick.</p>
        </div>
        <div className="stack-10" role="radiogroup" aria-label="Reading time">
          {Object.entries(TIMES).map(([id, t]) => {
            const on = state.time === id
            const Icon = TIME_ICON[id]
            return (
              <button key={id} type="button" role="radio" aria-checked={on} className={`option row ${on ? 'is-on' : ''}`} onClick={() => set({ time: id })}>
                <span className={`icon-tile sm ${on ? 'orange' : ''}`}><Icon /></span>
                <span className="option-text"><span className="option-title">{t.label}</span><span className="option-hint">{t.hint}</span></span>
                <span className="option-time">{t.time}</span>
              </button>
            )
          })}
        </div>
        <div className="stack-10">
          <span className="label">How long each day?</span>
          <div className="seg dark" role="radiogroup" aria-label="Minutes per day">
            {[5, 10, 15].map((m) => (
              <button key={m} type="button" role="radio" aria-checked={state.minutes === m} className={state.minutes === m ? 'on' : ''} onClick={() => set({ minutes: m })}>{m} min</button>
            ))}
          </div>
        </div>
      </div>
      <div className="foot"><Btn onClick={() => go('firstplan')}>Continue</Btn></div>
    </div>
  )
}

export function FirstPlan() {
  const { go, state, set } = useNav()
  const plan = book(state.plan)
  const goal = GOALS.find((g) => g.id === state.goals[0])
  const others = ['atomic', 'mindset', 'deep', 'money'].filter((id) => id !== state.plan).slice(0, 2).map(book)
  return (
    <div className="screen">
      <Steps step={3} back="schedule" />
      <div className="body">
        <div className="stack-8">
          <span className="eyebrow">Step 3 of 4</span>
          <h1 className="h1">Start with this one.</h1>
          <p className="lede">Picked for <strong>{goal ? goal.label : 'you'}</strong>.</p>
        </div>
        <motion.div key={plan.id} className="rec-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <img src={plan.cover} alt={`${plan.title} by ${plan.author}`} />
          <div className="stack-6">
            <span className="pill-rec">Recommended</span>
            <span className="rec-title">{plan.title}</span>
            <span className="rec-author">{plan.author}</span>
            <span className="rec-meta">{plan.days} days · {plan.mins} min a day</span>
          </div>
        </motion.div>
        <div className="stack-10">
          <span className="label">How will you read it?</span>
          <div className="grid-2" role="radiogroup" aria-label="Reading format">
            {[['app', 'Read in Mindleaf', 'A short guided reading each day'], ['own', 'I have the book', 'We tell you which pages to read']].map(([id, t, h]) => (
              <button key={id} type="button" role="radio" aria-checked={state.mode === id} className={`option col ${state.mode === id ? 'is-on' : ''}`} onClick={() => set({ mode: id })}>
                <span className="option-title">{t}</span><span className="option-hint">{h}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="stack-8">
          <span className="label muted">Or start with</span>
          <div className="row-10">
            {others.map((b) => (
              <button key={b.id} type="button" className="mini-plan" onClick={() => set({ plan: b.id })}>
                <img src={b.cover} alt="" /><span className="stack-2"><span className="mini-plan-title">{b.title}</span><span className="mini-plan-meta">{b.days} days</span></span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="foot"><Btn onClick={() => go('reminders')}>Start this plan</Btn></div>
    </div>
  )
}

export function Reminders() {
  const { go, state, set } = useNav()
  const t = TIMES[state.time]
  const plan = book(state.plan)
  return (
    <div className="screen">
      <Steps step={4} back="firstplan" />
      <div className="lock-preview" aria-hidden="true">
        <span className="lock-time">{t.time.replace(/ [AP]M/, '')}</span>
        <span className="lock-date">Thursday 1 October</span>
        <motion.div className="notif" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.4, ease }}>
          <Logo size={36} />
          <div className="notif-text"><div className="row-between"><strong>MINDLEAF</strong><span>now</span></div><span className="notif-title">Day 1 is ready</span><span>{DAY1[plan.id]} · {state.minutes} min</span></div>
        </motion.div>
      </div>
      <div className="body">
        <span className="eyebrow">Step 4 of 4</span>
        <h1 className="h1">A gentle nudge at {t.time}.</h1>
        <ul className="checks">
          <li><I.check color="#1F4034" /> One reminder a day. Never more.</li>
          <li><I.check color="#1F4034" /> Miss a day and we won’t guilt you.</li>
          <li><I.check color="#1F4034" /> Change the time whenever you like.</li>
        </ul>
      </div>
      <div className="foot">
        <Btn onClick={() => { set({ remind: true }); go('ready') }}>Turn on reminders</Btn>
        <Btn kind="text" onClick={() => { set({ remind: false }); go('ready') }}>Not now</Btn>
      </div>
    </div>
  )
}

const CONFETTI = [[-150, -40, '#FF8A45', -20], [140, -70, '#7FB89D', 40], [150, 60, '#FF8A45', 110], [-130, 80, '#7FB89D', 200], [-60, -120, '#FF8A45', 70], [70, -130, '#7FB89D', -60]]
export function Ready() {
  const { go, state } = useNav()
  const plan = book(state.plan)
  return (
    <div className="screen green">
      <div className="ready-hero">
        {CONFETTI.map(([x, y, c, r], i) => (
          <motion.span key={i} className="confetti" initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.4 }} animate={{ x, y, rotate: r, opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.04, duration: 0.9, ease }}>
            <Leaf color={c} size={18} />
          </motion.span>
        ))}
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease }}><Logo size={96} variant="reversed" /></motion.div>
      </div>
      <div className="body center-text">
        <h1 className="h1 xl on-dark">Day 1 is ready.</h1>
        <p className="lede on-dark">Your plan starts now. {state.minutes} minutes, one idea, one small thing to try.</p>
        <div className="plan-row light">
          <img src={plan.cover} alt="" />
          <div className="stack-2"><span className="eyebrow">Day 1 of {plan.days} · {state.minutes} min</span><span className="plan-row-title">{DAY1[plan.id]}</span><span className="plan-row-meta">{plan.title}</span></div>
        </div>
      </div>
      <div className="foot">
        <Btn onClick={() => go('reading')}>Start Day 1 <I.arrow /></Btn>
        <Btn kind="text" onClick={() => go('home')}>Look around first</Btn>
      </div>
    </div>
  )
}
