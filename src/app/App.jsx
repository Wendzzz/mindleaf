import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { INITIAL_STATE, NavContext } from './nav.js'
import { Logo } from './parts.jsx'
import { DayDone, Home, LiveIt, Plan, Reading, Reflect, WelcomeBack } from './screens/Daily.jsx'
import { Club, Journal, Library, Paywall, Profile } from './screens/Explore.jsx'
import { FirstPlan, Goals, Ready, Reminders, Schedule, SignIn, Verify, Welcome } from './screens/Onboarding.jsx'

const SCREENS = {
  welcome: Welcome, signin: SignIn, verify: Verify, goals: Goals, schedule: Schedule, firstplan: FirstPlan, reminders: Reminders, ready: Ready,
  home: Home, plan: Plan, reading: Reading, liveit: LiveIt, reflect: Reflect, daydone: DayDone, welcomeback: WelcomeBack,
  library: Library, journal: Journal, club: Club, profile: Profile, paywall: Paywall,
}

const GROUPS = [
  { title: 'Sign in & onboarding', items: [['welcome', 'Welcome'], ['signin', 'Sign in'], ['verify', 'Check your email'], ['goals', 'Goals'], ['schedule', 'Reading time'], ['firstplan', 'First plan'], ['reminders', 'Reminders'], ['ready', 'Day 1 is ready']] },
  { title: 'Every day', items: [['home', 'Home'], ['plan', 'Reading plan'], ['reading', 'Today’s reading'], ['liveit', 'Action points'], ['reflect', 'Tonight’s question'], ['daydone', 'Day complete'], ['welcomeback', 'Missed a day']] },
  { title: 'Explore & grow', items: [['library', 'Library'], ['journal', 'Journal'], ['club', 'Book club'], ['profile', 'Profile'], ['paywall', 'Mindleaf Plus']] },
]

const readHash = () => {
  const id = window.location.hash.replace(/^#\/?/, '')
  return SCREENS[id] ? id : 'welcome'
}

// Screen changes: a short push/pop slide. With reduced motion, MotionConfig drops the slide and keeps the fade.
const variants = {
  enter: (dir) => ({ x: dir * 28, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: (dir) => ({ x: dir * -20, opacity: 0, transition: { duration: 0.15, ease: [0.7, 0, 0.84, 0] } }),
}

export default function App() {
  const [screen, setScreen] = useState(readHash)
  const [dir, setDir] = useState(1)
  const [state, setAll] = useState(INITIAL_STATE)

  useEffect(() => {
    const onHash = () => setScreen(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((id, d) => {
    setDir(d)
    if (readHash() === id) setScreen(id)
    else window.location.hash = `/${id}`
  }, [])
  const nav = useMemo(() => ({
    screen,
    go: (id) => navigate(id, 1),
    goBack: (id) => navigate(id, -1),
    state,
    set: (patch) => setAll((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) })),
    reset: () => setAll(INITIAL_STATE),
  }), [screen, state, navigate])

  const Screen = SCREENS[screen]

  return (
    <MotionConfig reducedMotion="user">
      <NavContext.Provider value={nav}>
        <div className="proto">
          <aside className="proto-side">
            <a href="../" className="proto-brand"><Logo size={32} /><span>Mindleaf</span></a>
            <h1>App prototype</h1>
            <p>Tap through Mindleaf like a real phone app. Choices carry between screens: pick goals, finish Day 4, and Home updates.</p>
            <p className="fine">Prototype only. No account is created, nothing is sent and no payment is taken.</p>
            <div className="proto-actions">
              <button type="button" className="chip-link" onClick={() => { nav.reset(); navigate('welcome', -1) }}>Start over</button>
              <a href="../" className="chip-link">Back to the website</a>
            </div>
          </aside>
          <div className="device">
            <div className="device-screen">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.div key={screen} className="screen-wrap" custom={dir} variants={variants} initial="enter" animate="center" exit="exit">
                  <Screen />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <nav className="proto-index" aria-label="All screens">
            {GROUPS.map((g) => (
              <div key={g.title} className="proto-group">
                <span className="proto-group-title">{g.title}</span>
                {g.items.map(([id, label]) => (
                  <button key={id} type="button" className={`proto-link ${screen === id ? 'on' : ''}`} aria-current={screen === id ? 'page' : undefined} onClick={() => nav.go(id)}>{label}</button>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </NavContext.Provider>
    </MotionConfig>
  )
}
