import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Icon, Reveal, Scribble } from '../ui.jsx'

// Waitlist form. Not connected to a backend yet: it validates and confirms locally.
export default function FinalCta() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const onSubmit = (e) => {
    e.preventDefault()
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    setStatus(ok ? 'done' : 'error')
  }
  return (
    <section id="start" className="section final">
      <div className="container final-inner">
        <Reveal>
          <h2 className="final-title">
            Your first page takes{' '}
            <span className="hl">ten minutes.<Scribble inView delay={0.3} /></span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}><p className="lede center">Mindleaf is coming to iPhone and Android. Join the waitlist and we’ll send you Day 1 the morning we launch.</p></Reveal>
        <Reveal delay={0.15} className="final-form-wrap">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'done' ? (
              <motion.p key="done" className="form-done" role="status" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <span className="scr-check on"><Icon.check /></span> You’re on the list. See you on Day 1.
              </motion.p>
            ) : (
              <motion.form key="form" className="final-form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, scale: 0.96 }}>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                  aria-invalid={status === 'error'}
                  aria-describedby={status === 'error' ? 'email-error' : undefined}
                />
                <button type="submit" className="btn btn-orange">Join the waitlist</button>
              </motion.form>
            )}
          </AnimatePresence>
          {status === 'error' && <p id="email-error" className="form-error">Enter an email address like name@example.com.</p>}
        </Reveal>
        <Reveal delay={0.2} className="stores">
          <span className="store"><Icon.apple /> iPhone · coming soon</span>
          <span className="store"><Icon.play /> Android · coming soon</span>
        </Reveal>
      </div>
    </section>
  )
}
