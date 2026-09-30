import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { planFor } from '../content.js'
import { toAppError } from '../lib/errors.js'
import { GOALS, TIMES, useNav } from '../nav.js'
import { Btn, I, Leaf, Logo, Steps, Top } from '../parts.jsx'

const ease = [0.16, 1, 0.3, 1]
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESEND_SECONDS = 60

function ErrorLine({ id, error }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p key={error} id={id} className="form-error" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function DemoNote() {
  const { live } = useNav()
  if (live) return null
  return <span className="demo-note">Demo mode: accounts are saved in this browser only.</span>
}

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
        <DemoNote />
      </div>
    </div>
  )
}

export function SignIn() {
  const { go, draft, setDraft, sendCode, google, online } = useNav()
  const [busy, setBusy] = useState(null) // 'email' | 'google'
  const [error, setError] = useState(null)
  const [touched, setTouched] = useState(false)
  const email = draft.email.trim()
  const valid = EMAIL.test(email)
  const showInvalid = touched && email && !valid

  const submit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (!valid || busy) return
    setBusy('email'); setError(null)
    try {
      await sendCode(email)
      setDraft({ email, codeSentAt: Date.now() })
      go('verify')
    } catch (err) {
      const e2 = toAppError(err, 'send')
      setError(e2.message)
      if (e2.kind === 'rate') setDraft({ codeSentAt: Date.now() - (RESEND_SECONDS - (e2.wait || 60)) * 1000 })
    } finally { setBusy(null) }
  }
  const withGoogle = async () => {
    setBusy('google'); setError(null)
    try { await google() } catch (err) { setError(toAppError(err, 'google').message); setBusy(null) }
  }

  return (
    <div className="screen">
      <Top back="welcome" />
      <form className="body" onSubmit={submit} noValidate>
        <div className="stack-10">
          <h1 className="h1">Let’s get you <span className="green">reading.</span></h1>
          <p className="lede">Sign in or create an account. No password to remember.</p>
        </div>
        <Btn kind="ghost" onClick={withGoogle} disabled={Boolean(busy) || !online}>
          {busy === 'google' ? <span className="spinner" aria-hidden="true" /> : <GoogleMark />}{busy === 'google' ? 'Opening Google…' : 'Continue with Google'}
        </Btn>
        <div className="divider">or use your email</div>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck="false" placeholder="you@example.com"
            value={draft.email} onChange={(e) => { setDraft({ email: e.target.value }); setError(null) }} onBlur={() => setTouched(true)}
            aria-invalid={Boolean(showInvalid || error)} aria-describedby="email-hint email-error" />
          <span id="email-hint" className={showInvalid ? 'hint error' : 'hint'}>{showInvalid ? 'Enter an email address like name@example.com.' : 'We’ll email you a 6-digit code to sign in.'}</span>
          <ErrorLine id="email-error" error={error} />
        </div>
        <Btn type="submit" disabled={Boolean(busy) || !online}>{busy === 'email' ? <><span className="spinner" aria-hidden="true" /> Sending your code…</> : 'Send me a code'}</Btn>
        {!online && <p className="hint center">You’re offline. Connect to the internet to sign in.</p>}
      </form>
      <p className="foot-note fine">By continuing you agree to Mindleaf’s <a href="../#terms">Terms</a> and <a href="../#privacy">Privacy Policy</a>.</p>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z" />
    </svg>
  )
}

export function Verify() {
  const { goBack, draft, setDraft, sendCode, verifyCode, live, online } = useNav()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [now, setNow] = useState(Date.now())
  const inputRef = useRef(null)
  const sentAt = draft.codeSentAt || 0
  const wait = Math.max(0, Math.ceil(RESEND_SECONDS - (now - sentAt) / 1000))

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = async (value = code) => {
    if (value.length !== 6 || busy) return
    setBusy(true); setError(null)
    try {
      await verifyCode(draft.email.trim(), value)
      // App's route guard moves on to onboarding or home once the account loads.
    } catch (err) {
      setError(toAppError(err, 'verify').message)
      setCode('')
      inputRef.current?.focus()
    } finally { setBusy(false) }
  }
  const onChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(v); setError(null)
    if (v.length === 6) submit(v)
  }
  const resend = async () => {
    setError(null)
    try { await sendCode(draft.email.trim()); setDraft({ codeSentAt: Date.now() }); setNow(Date.now()) }
    catch (err) { const e2 = toAppError(err, 'send'); setError(e2.message) }
  }

  return (
    <div className="screen">
      <Top back="signin" />
      <div className="body">
        <div className="icon-tile peach"><I.mail /></div>
        <div className="stack-10">
          <h1 className="h1">Check your email</h1>
          <p className="lede">We sent a 6-digit code to <strong>{draft.email.trim() || 'your email'}</strong>. It can take a minute to arrive.</p>
        </div>
        <label className="otp" htmlFor="code" onClick={() => inputRef.current?.focus()}>
          <span className="sr-only">6-digit code</span>
          <input ref={inputRef} id="code" className="otp-input" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" maxLength={6}
            value={code} onChange={onChange} disabled={busy} aria-invalid={Boolean(error)} aria-describedby="code-error code-hint" />
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={`otp-box ${i < code.length ? 'filled' : ''} ${i === code.length && !busy ? 'active' : ''} ${error ? 'bad' : ''}`} aria-hidden="true">
              {code[i] ?? (i === code.length && !busy ? <span className="caret" /> : '')}
            </span>
          ))}
        </label>
        <ErrorLine id="code-error" error={error} />
        <p id="code-hint" className="lede small">{busy ? <span className="ok"><span className="spinner dark" aria-hidden="true" /> Checking your code…</span> : live ? 'Tip: paste the code, or tap it in the email suggestion above your keyboard.' : 'Demo mode: any 6 digits will work.'}</p>
        <div className="resend">
          {wait > 0 ? <span className="muted-sm">Resend code in <strong className="tabular">{Math.floor(wait / 60)}:{String(wait % 60).padStart(2, '0')}</strong></span>
            : <button type="button" className="link" onClick={resend} disabled={!online}>Send a new code</button>}
        </div>
      </div>
      <div className="foot">
        <Btn onClick={() => submit()} disabled={code.length !== 6 || busy || !online}>{busy ? 'Checking…' : 'Verify and continue'}</Btn>
        <Btn kind="text" onClick={() => goBack('signin')}>Use a different email</Btn>
      </div>
    </div>
  )
}

export function Goals() {
  const { go, draft, setDraft, signOut } = useNav()
  const toggle = (id) => setDraft((d) => {
    if (d.goals.includes(id)) return { goals: d.goals.filter((g) => g !== id) }
    return d.goals.length < 3 ? { goals: [...d.goals, id] } : {}
  })
  const count = draft.goals.length
  return (
    <div className="screen">
      <div className="top">
        <button type="button" className="icon-btn" aria-label="Sign out" onClick={signOut}><I.back /></button>
        <div className="steps" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={1} aria-label="Step 1 of 4"><span className="on" /><span /><span /><span /></div>
      </div>
      <div className="body">
        <div className="stack-10">
          <span className="eyebrow">Step 1 of 4</span>
          <h1 className="h1">What do you want to change?</h1>
          <p className="lede">Pick up to three. We’ll suggest where to start.</p>
        </div>
        <div className="grid-2" role="group" aria-label="Goals">
          {GOALS.map((g) => {
            const on = draft.goals.includes(g.id)
            const full = !on && count >= 3
            return (
              <button key={g.id} type="button" className={`option goal ${on ? 'is-on' : ''}`} aria-pressed={on} aria-disabled={full} onClick={() => toggle(g.id)}>
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
          const first = GOALS.find((g) => g.id === draft.goals[0])
          const suggested = first ? first.plan : 'atomic'
          setDraft({ plan: planFor(suggested).available ? suggested : 'atomic', suggested })
          go('schedule')
        }} disabled={count === 0}>Continue</Btn>
      </div>
    </div>
  )
}

const TIME_ICON = { morning: I.sunrise, noon: I.sun, night: I.moon }
export function Schedule() {
  const { go, draft, setDraft } = useNav()
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
            const on = draft.time === id
            const Icon = TIME_ICON[id]
            return (
              <button key={id} type="button" role="radio" aria-checked={on} className={`option row ${on ? 'is-on' : ''}`} onClick={() => setDraft({ time: id })}>
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
              <button key={m} type="button" role="radio" aria-checked={draft.minutes === m} className={draft.minutes === m ? 'on' : ''} onClick={() => setDraft({ minutes: m })}>{m} min</button>
            ))}
          </div>
        </div>
      </div>
      <div className="foot"><Btn onClick={() => go('firstplan')}>Continue</Btn></div>
    </div>
  )
}

export function FirstPlan() {
  const { go, draft, setDraft } = useNav()
  const plan = planFor(draft.plan)
  const suggested = planFor(draft.suggested || draft.plan)
  const goal = GOALS.find((g) => g.id === draft.goals[0])
  return (
    <div className="screen">
      <Steps step={3} back="schedule" />
      <div className="body">
        <div className="stack-8">
          <span className="eyebrow">Step 3 of 4</span>
          <h1 className="h1">Start with this one.</h1>
          <p className="lede">Picked for <strong>{goal ? goal.label : 'you'}</strong>.</p>
        </div>
        <div className="rec-card">
          <img src={plan.cover} alt={`${plan.title} by ${plan.author}`} />
          <div className="stack-6">
            <span className="pill-rec">{suggested.id === plan.id ? 'Recommended' : 'Ready now'}</span>
            <span className="rec-title">{plan.title}</span>
            <span className="rec-author">{plan.author}</span>
            <span className="rec-meta">{plan.days} days · {plan.mins} min a day</span>
          </div>
        </div>
        {suggested.id !== plan.id && (
          <p className="note-row"><Leaf color="#1F4034" size={18} /><span>Our <strong>{suggested.title}</strong> plan is still being written. We’ll tell you when it’s ready. Start with {plan.title} for now.</span></p>
        )}
        <div className="stack-10">
          <span className="label">How will you read it?</span>
          <div className="grid-2" role="radiogroup" aria-label="Reading format">
            {[['app', 'Read in Mindleaf', 'A short guided reading each day'], ['own', 'I have the book', 'Read your copy, then do the day’s action']].map(([id, t, h]) => (
              <button key={id} type="button" role="radio" aria-checked={draft.mode === id} className={`option col ${draft.mode === id ? 'is-on' : ''}`} onClick={() => setDraft({ mode: id })}>
                <span className="option-title">{t}</span><span className="option-hint">{h}</span>
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
  const { draft, updateProfile, go } = useNav()
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)
  const t = TIMES[draft.time]
  const plan = planFor(draft.plan)
  const finish = async (remind) => {
    setBusy(remind ? 'on' : 'off'); setError(null)
    try {
      await updateProfile({ goals: draft.goals, time: draft.time, minutes: draft.minutes, plan: draft.plan, mode: draft.mode, remind, onboarded: true })
      go('ready')
    } catch (err) { setError(toAppError(err).message) } finally { setBusy(null) }
  }
  return (
    <div className="screen">
      <Steps step={4} back="firstplan" />
      <div className="lock-preview" aria-hidden="true">
        <span className="lock-time">{t.time.replace(/ [AP]M/, '')}</span>
        <span className="lock-date">Tomorrow</span>
        <motion.div className="notif" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.4, ease }}>
          <Logo size={36} />
          <div className="notif-text"><div className="row-between"><strong>MINDLEAF</strong><span>now</span></div><span className="notif-title">Day 1 is ready</span><span>{plan.dayList[0]?.title} · {draft.minutes} min</span></div>
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
        <ErrorLine id="remind-error" error={error} />
      </div>
      <div className="foot">
        <Btn onClick={() => finish(true)} disabled={Boolean(busy)}>{busy === 'on' ? 'Saving…' : 'Turn on reminders'}</Btn>
        <Btn kind="text" onClick={() => finish(false)} disabled={Boolean(busy)}>Not now</Btn>
      </div>
    </div>
  )
}

const CONFETTI = [[-150, -40, '#FF8A45', -20], [140, -70, '#7FB89D', 40], [150, 60, '#FF8A45', 110], [-130, 80, '#7FB89D', 200], [-60, -120, '#FF8A45', 70], [70, -130, '#7FB89D', -60]]
export function Ready() {
  const { go, profile } = useNav()
  const plan = planFor(profile?.plan)
  const day1 = plan.dayList[0]
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
        <p className="lede on-dark">Your plan starts now. {profile?.minutes || 10} minutes, one idea, one small thing to try.</p>
        <div className="plan-row light">
          <img src={plan.cover} alt="" />
          <div className="stack-2"><span className="eyebrow">Day 1 of {plan.days}</span><span className="plan-row-title">{day1?.title}</span><span className="plan-row-meta">{plan.title}</span></div>
        </div>
      </div>
      <div className="foot">
        <Btn onClick={() => go('reading')}>Start Day 1 <I.arrow /></Btn>
        <Btn kind="text" onClick={() => go('home')}>Look around first</Btn>
      </div>
    </div>
  )
}
