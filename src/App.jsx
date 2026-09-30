import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import Clubs from './sections/Clubs.jsx'
import DayScroll from './sections/DayScroll.jsx'
import FinalCta from './sections/FinalCta.jsx'
import Hero from './sections/Hero.jsx'
import Library from './sections/Library.jsx'
import Manifesto from './sections/Manifesto.jsx'
import Pile from './sections/Pile.jsx'
import Pricing from './sections/Pricing.jsx'
import Streak from './sections/Streak.jsx'
import { Icon, Logo } from './ui.jsx'

const LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#library', label: 'Library' },
  { href: '#clubs', label: 'Book clubs', tag: 'New' },
  { href: '#pricing', label: 'Pricing' },
]

function useActiveSection(ids) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

const SECTION_IDS = ['how', 'library', 'clubs', 'pricing']

function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  return (
    <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <motion.nav
        className="nav"
        aria-label="Main"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="#top" className="nav-brand" aria-label="Mindleaf home">
          <Logo size={30} />
          <span>Mindleaf</span>
        </a>
        <div className="nav-links">
          {LINKS.map((l) => {
            const on = active === l.href.slice(1)
            return (
              <a key={l.href} href={l.href} className={`nav-link ${on ? 'is-active' : ''}`} aria-current={on ? 'true' : undefined}>
                {on && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="nav-link-label">{l.label}</span>
                {l.tag && <span className="nav-tag">{l.tag}</span>}
              </a>
            )
          })}
        </div>
        <div className="nav-actions">
          <a href="#login" className="nav-signin">Sign in</a>
          <a href="#start" className="btn btn-orange btn-sm">Start reading free</a>
          <button type="button" className="nav-menu" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <Icon.close /> : <Icon.menu />}
          </button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-sheet"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
                {l.tag && <span className="nav-tag">{l.tag}</span>}
              </a>
            ))}
            <a href="#login" onClick={() => setOpen(false)}>Sign in</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a href="#top" className="nav-brand"><Logo size={26} /><span>Mindleaf</span></a>
        <nav className="footer-links" aria-label="Footer">
          <a href="#about">About</a>
          <a href="#authors">For authors &amp; publishers</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </nav>
        <p className="footer-fine">© 2026 Mindleaf · Photos from Unsplash · Covers from Open Library</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Pile />
        <DayScroll />
        <Streak />
        <Manifesto />
        <Library />
        <Clubs />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </MotionConfig>
  )
}
