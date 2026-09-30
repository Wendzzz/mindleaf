import { motion } from 'motion/react'

export function Logo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#1F4034" />
      <path d="M8.5 23.5c0-8.6 5.8-14.5 15-14.5 0 9.7-5.9 15.5-14.2 15.5z" fill="#FF8A45" />
      <path d="M9.5 22.5 18 14" stroke="#1F4034" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
export const Icon = {
  arrow: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>),
  check: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" {...base} strokeWidth={3.2} {...p}><path d="M20 6 9 17l-5-5" /></svg>),
  lock: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" {...base} {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>),
  menu: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>),
  close: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>),
  chevron: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" {...base} strokeWidth={2.4} {...p}><path d="m6 9 6 6 6-6" /></svg>),
  bookmark: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>),
  clock: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>),
  headphones: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" /></svg>),
  apple: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.9-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2-1.1 2.8-2.3.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8zM14.1 5.8c.6-.8 1.1-1.8 1-2.8-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.7-1 2.7 1 .1 2-.5 2.7-1.3z" /></svg>),
  play: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M4.5 3.3v17.4c0 .6.7 1 1.2.7l14.7-8.7c.5-.3.5-1.1 0-1.4L5.7 2.6c-.5-.3-1.2.1-1.2.7z" /></svg>),
}

// Hand-drawn underline that draws itself, like a note in a book's margin.
export function Scribble({ delay = 0, inView = false, className = '' }) {
  const draw = { pathLength: 1, opacity: 1 }
  const props = inView
    ? { whileInView: draw, viewport: { once: true, amount: 0.8 } }
    : { animate: draw }
  return (
    <svg className={`scribble ${className}`} viewBox="0 0 240 26" preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d="M4 17 C 46 7, 96 5, 138 10 S 212 21, 236 9"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="7"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        transition={{ delay, duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        {...props}
      />
    </svg>
  )
}

// Fade-and-rise when a block scrolls into view.
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

export function Eyebrow({ children, tone = '' }) {
  return <span className={`eyebrow ${tone}`}>{children}</span>
}
