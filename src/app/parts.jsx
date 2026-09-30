import { Logo } from '../ui.jsx'
import { useNav } from './nav.js'

export { Logo }

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
export const I = {
  back: () => (<svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><path d="m15 18-6-6 6-6" /></svg>),
  close: () => (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><path d="M18 6 6 18M6 6l12 12" /></svg>),
  arrow: () => (<svg width="18" height="18" viewBox="0 0 24 24" {...stroke} strokeWidth={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>),
  check: ({ size = 12, color = 'currentColor', w = 3.5 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>),
  share: () => (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" /></svg>),
  lock: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" {...stroke}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>),
  bell: () => (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></svg>),
  headphones: () => (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" /></svg>),
  bookmark: ({ filled }) => (<svg width="20" height="20" viewBox="0 0 24 24" {...stroke} fill={filled ? 'currentColor' : 'none'}><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>),
  play: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4.8v14.4c0 .8.9 1.3 1.6.8l11.1-7.2c.6-.4.6-1.3 0-1.7L7.6 4c-.7-.5-1.6 0-1.6.8z" /></svg>),
  pause: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>),
  sunrise: () => (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><path d="M12 3v2M5.6 6.6l1.4 1.4M3 13h2M19 13h2M17 8l1.4-1.4M7 17a5 5 0 0 1 10 0M2 21h20" /></svg>),
  sun: () => (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>),
  moon: ({ size = 22, color = 'currentColor' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>),
  mail: () => (<svg width="30" height="30" viewBox="0 0 24 24" {...stroke}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>),
  search: () => (<svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>),
  gear: () => (<svg width="20" height="20" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></svg>),
  invite: () => (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><circle cx="9" cy="8" r="4" /><path d="M2 21c1-4 4-6 7-6s6 2 7 6M19 8v6M16 11h6" /></svg>),
  chevron: () => (<svg width="16" height="16" viewBox="0 0 24 24" {...stroke}><path d="m9 18 6-6-6-6" /></svg>),
  book: () => (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><path d="M2 5.5C4.5 4.5 8.5 4.5 12 6.5v13c-3.5-2-7.5-2-10-1z" /><path d="M22 5.5c-2.5-1-6.5-1-10 1v13c3.5-2 7.5-2 10-1z" /></svg>),
  apple: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.9-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2-1.1 2.8-2.3.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8zM14.1 5.8c.6-.8 1.1-1.8 1-2.8-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.7-1 2.7 1 .1 2-.5 2.7-1.3z" /></svg>),
}

export function Leaf({ color = '#FF8A45', size = 18, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={style}>
      <path d="M4 20c0-9 6-15 16-15 0 10-6 15-15 15z" fill={color} />
    </svg>
  )
}

// Top bar with an optional back / close target and a centred title.
export function Top({ back, close, title, right, children }) {
  const { goBack } = useNav()
  return (
    <div className="top">
      {back && <button type="button" className="icon-btn" aria-label="Back" onClick={() => goBack(back)}><I.back /></button>}
      {close && <button type="button" className="icon-btn" aria-label="Close" onClick={() => goBack(close)}><I.close /></button>}
      {title && <span className="top-title">{title}</span>}
      {children}
      {right ?? ((back || close) && title ? <span className="icon-spacer" /> : null)}
    </div>
  )
}

// Onboarding progress: back button + four segments.
export function Steps({ step, back }) {
  const { goBack } = useNav()
  return (
    <div className="top">
      <button type="button" className="icon-btn" aria-label="Back" onClick={() => goBack(back)}><I.back /></button>
      <div className="steps" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step} aria-label={`Step ${step} of 4`}>
        {[1, 2, 3, 4].map((n) => <span key={n} className={n <= step ? 'on' : ''} />)}
      </div>
    </div>
  )
}

export function Btn({ kind = 'orange', onClick, children, disabled, type = 'button' }) {
  return (
    <button type={type} className={`btn btn-${kind}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

const TABS = [
  { id: 'home', label: 'Home', icon: <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg> },
  { id: 'library', label: 'Library', icon: <I.book /> },
  { id: 'reading', label: 'Today', center: true },
  { id: 'journal', label: 'Journal', icon: <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg> },
  { id: 'profile', label: 'Me', icon: <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg> },
]

export function TabBar({ active }) {
  const { go } = useNav()
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((t) => t.center ? (
        <button key={t.id} type="button" className="tab-center" aria-label="Today's reading" onClick={() => go(t.id)}>
          <span><svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true"><path d="M8.5 23.5c0-8.6 5.8-14.5 15-14.5 0 9.7-5.9 15.5-14.2 15.5z" fill="#FFFFFF" /><path d="M9.5 22.5 18 14" stroke="#CC4A0A" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
        </button>
      ) : (
        <button key={t.id} type="button" className={`tab ${active === t.id ? 'on' : ''}`} aria-current={active === t.id ? 'page' : undefined} onClick={() => go(t.id)}>
          {t.icon}<span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

// A week of reading days: done / today / upcoming.
export function Week({ doneThrough = 3, todayDone = false }) {
  return (
    <div className="week" aria-label={`${doneThrough + (todayDone ? 1 : 0)} days read this week`}>
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
        const done = i < doneThrough || (i === doneThrough && todayDone)
        const today = i === doneThrough && !todayDone
        return (
          <div key={i} className="week-day">
            <span className={i === doneThrough ? 'strong' : ''}>{d}</span>
            <span className={`dot ${done ? 'done' : today ? 'today' : ''}`}>{done && <I.check />}</span>
          </div>
        )
      })}
    </div>
  )
}
