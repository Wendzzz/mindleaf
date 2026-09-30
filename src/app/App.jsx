import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { planFor } from './content.js'
import { addDays, computeStreak, localDay, weekStart } from './lib/dates.js'
import { useOnline } from './lib/pwa.js'
import { store } from './lib/store.js'
import { NavContext, ONBOARDING, PUBLIC } from './nav.js'
import { Logo } from './parts.jsx'
import { DayDone, Home, LiveIt, Plan, Reading, Reflect, WelcomeBack } from './screens/Daily.jsx'
import { Club, Journal, Library, Paywall, Profile } from './screens/Explore.jsx'
import { FirstPlan, Goals, Ready, Reminders, Schedule, SignIn, Verify, Welcome } from './screens/Onboarding.jsx'

const SCREENS = {
  welcome: Welcome, signin: SignIn, verify: Verify, goals: Goals, schedule: Schedule, firstplan: FirstPlan, reminders: Reminders, ready: Ready,
  home: Home, plan: Plan, reading: Reading, liveit: LiveIt, reflect: Reflect, daydone: DayDone, welcomeback: WelcomeBack,
  library: Library, journal: Journal, club: Club, profile: Profile, paywall: Paywall,
}
const TABBED = ['home', 'library', 'journal', 'profile']

const readHash = () => {
  const id = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return SCREENS[id] ? id : 'welcome'
}

// Screen changes: a short push/pop slide. With reduced motion, MotionConfig drops the slide and keeps the fade.
const variants = {
  enter: (dir) => ({ x: dir * 28, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: (dir) => ({ x: dir * -20, opacity: 0, transition: { duration: 0.15, ease: [0.7, 0, 0.84, 0] } }),
}

const emptyDraft = (p) => ({
  email: p?.email || '',
  goals: p?.goals?.length ? p.goals : [],
  time: p?.time || 'morning',
  minutes: p?.minutes || 10,
  plan: p?.plan || 'atomic',
  mode: p?.mode || 'app',
  actions: {},
  answer: '',
})

export default function App() {
  const [screen, setScreen] = useState(readHash)
  const [dir, setDir] = useState(1)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [logs, setLogs] = useState([])
  const [highlights, setHighlights] = useState([])
  const [draft, setDraftState] = useState(emptyDraft(null))
  const [toast, setToast] = useState(null)
  const online = useOnline()
  const framed = new URLSearchParams(window.location.search).has('frame')

  const notify = useCallback((message) => {
    setToast(message)
    window.clearTimeout(notify.t)
    notify.t = window.setTimeout(() => setToast(null), 4000)
  }, [])

  const loadAccount = useCallback(async (s) => {
    if (!s) { setSession(null); setProfile(null); setLogs([]); setHighlights([]); return }
    // Load everything before switching screens, so returning readers never flash onboarding.
    const [p, l, h] = await Promise.all([store.profile(), store.logs(), store.highlights()])
    setProfile(p); setLogs(l); setHighlights(h); setSession(s)
    setDraftState((d) => ({ ...emptyDraft(p), email: d.email || p?.email || '' }))
  }, [])

  // Restore the session (and finish a Google redirect), then follow sign-in / sign-out.
  useEffect(() => {
    let alive = true
    store.session()
      .then((s) => loadAccount(s))
      .then(() => alive && setStatus('ready'))
      .catch(() => alive && setStatus('error'))
    const off = store.onAuth((s) => { loadAccount(s).catch(() => notify('We couldn’t load your account. Pull to refresh or try again.')) })
    return () => { alive = false; off() }
  }, [loadAccount, notify])

  useEffect(() => {
    const onHash = () => setScreen(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((id, d, replace = false) => {
    setDir(d)
    const url = `${window.location.pathname}${window.location.search}#/${id}`
    if (replace) { window.history.replaceState(null, '', url); setScreen(id) }
    else if (readHash() === id) setScreen(id)
    else window.location.hash = `/${id}`
  }, [])

  // Route guard: signed-out people stay on the public screens, new accounts finish onboarding first.
  const target = useMemo(() => {
    if (status !== 'ready') return screen
    if (!session) return PUBLIC.includes(screen) ? screen : 'welcome'
    if (!profile?.onboarded) return ONBOARDING.includes(screen) ? screen : 'goals'
    if (PUBLIC.includes(screen) || ONBOARDING.includes(screen)) return 'home'
    return screen
  }, [status, session, profile, screen])
  useEffect(() => { if (target !== screen) navigate(target, 1, true) }, [target, screen, navigate])

  const derived = useMemo(() => {
    const today = localDay()
    const plan = planFor(profile?.plan)
    const planLogs = logs.filter((l) => l.planId === plan.id)
    const daysCompleted = new Set(planLogs.map((l) => l.day)).size
    const todayLog = logs.find((l) => l.date === today)
    const doneToday = Boolean(todayLog)
    const finished = daysCompleted >= plan.days && plan.days > 0
    const currentDay = doneToday && todayLog.planId === plan.id ? todayLog.day : Math.min(daysCompleted + 1, plan.days || 1)
    const streak = computeStreak(logs.map((l) => l.date), today)
    const monday = weekStart(today)
    const week = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(monday, i)
      return { date, read: logs.some((l) => l.date === date), grace: streak.graceDays.includes(date), today: date === today, future: date > today }
    })
    return { today, plan, planLogs, daysCompleted, doneToday, todayLog, finished, currentDay, streak, week }
  }, [profile, logs])

  const nav = useMemo(() => ({
    screen, live: store.live, online, session, profile, logs, highlights, draft, derived, notify,
    go: (id) => navigate(id, 1),
    goBack: (id) => navigate(id, -1),
    setDraft: (patch) => setDraftState((d) => ({ ...d, ...(typeof patch === 'function' ? patch(d) : patch) })),
    async updateProfile(patch) { const p = await store.updateProfile(patch); setProfile(p); return p },
    async saveLog(log) { const saved = await store.saveLog(log); setLogs((l) => [saved, ...l.filter((x) => !(x.planId === saved.planId && x.day === saved.day))]); return saved },
    async toggleHighlight(h, on) {
      if (on) { await store.addHighlight(h); setHighlights((x) => [{ ...h, date: localDay() }, ...x]) }
      else { await store.removeHighlight(h); setHighlights((x) => x.filter((y) => !(y.text === h.text && y.day === h.day && y.planId === h.planId))) }
    },
    sendCode: (email) => store.sendCode(email),
    verifyCode: (email, code) => store.verifyCode(email, code),
    google: () => store.google(),
    async signOut() { await store.signOut(); setDraftState(emptyDraft(null)); navigate('welcome', -1, true) },
    resetDemo: store.reset ? () => { store.reset(); setDraftState(emptyDraft(null)); navigate('welcome', -1, true) } : null,
  }), [screen, online, session, profile, logs, highlights, draft, derived, notify, navigate])

  const Screen = SCREENS[target] ?? Welcome
  const tabbed = TABBED.includes(target)

  return (
    <MotionConfig reducedMotion="user">
      <NavContext.Provider value={nav}>
        <div className={`proto ${framed ? 'framed' : 'web'} ${tabbed ? 'has-tabs' : ''}`}>
          {framed && (
            <aside className="proto-side">
              <a href="../" className="proto-brand"><Logo size={32} /><span>Mindleaf</span></a>
              <p className="proto-title">App preview</p>
              <p>This is the real app inside a phone frame, for design reviews. Remove <code>?frame</code> from the address to use it normally.</p>
            </aside>
          )}
          <div className="device">
            <div className="device-screen">
              {status === 'loading' ? (
                <div className="splash" role="status" aria-label="Loading Mindleaf"><Logo size={72} /></div>
              ) : status === 'error' ? (
                <div className="splash error" role="alert">
                  <Logo size={56} />
                  <strong>We couldn’t open Mindleaf.</strong>
                  <span>Check your connection, then try again.</span>
                  <button type="button" className="btn btn-orange" onClick={() => window.location.reload()}>Try again</button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                  <motion.div key={target} className="screen-wrap" custom={dir} variants={variants} initial="enter" animate="center" exit="exit">
                    {/* Per-screen provider: a screen that is animating out keeps the data it last had (e.g. after sign-out). */}
                    <NavContext.Provider value={nav}><Screen /></NavContext.Provider>
                  </motion.div>
                </AnimatePresence>
              )}
              <AnimatePresence>
                {!online && <motion.div key="offline" className="offline-pill" role="status" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>You’re offline. Reading works; saving needs a connection.</motion.div>}
                {toast && <motion.div key="toast" className="app-toast" role="alert" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>{toast}</motion.div>}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </NavContext.Provider>
    </MotionConfig>
  )
}
