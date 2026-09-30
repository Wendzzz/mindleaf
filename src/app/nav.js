import { createContext, useContext } from 'react'

// Navigation + signed-in data, provided by App.jsx.
export const NavContext = createContext(null)
export const useNav = () => useContext(NavContext)

export const GOALS = [
  { id: 'habits', label: 'Build better habits', plan: 'atomic' },
  { id: 'money', label: 'Handle money calmly', plan: 'money' },
  { id: 'focus', label: 'Focus without distraction', plan: 'deep' },
  { id: 'confidence', label: 'Grow in confidence', plan: 'mindset' },
  { id: 'patience', label: 'Be more patient', plan: 'mindset' },
  { id: 'lead', label: 'Lead people well', plan: 'seven' },
  { id: 'rest', label: 'Rest and slow down', plan: 'atomic' },
  { id: 'learn', label: 'Keep learning', plan: 'mindset' },
]

export const TIMES = {
  morning: { label: 'Morning', hint: 'With my first coffee', time: '7:30 AM' },
  noon: { label: 'Lunch break', hint: 'A quiet ten minutes', time: '1:00 PM' },
  night: { label: 'Before bed', hint: 'Instead of scrolling', time: '9:30 PM' },
}

// Screens anyone can see, screens for finishing sign-up, and everything else needs an account.
export const PUBLIC = ['welcome', 'signin', 'verify']
export const ONBOARDING = ['goals', 'schedule', 'firstplan', 'reminders']

export const greeting = (d = new Date()) => {
  const h = d.getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}
