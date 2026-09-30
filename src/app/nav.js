import { createContext, useContext } from 'react'

// Navigation + shared prototype state, provided by App.jsx.
// go(id) moves forward, back(id) moves back to a named screen; state carries the user's choices between screens.
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

export const DAY1 = {
  atomic: 'Tiny changes add up',
  money: 'No one is crazy',
  deep: 'Why focus is rare',
  mindset: 'Two ways to see ability',
  seven: 'Change starts inside',
}

export const INITIAL_STATE = {
  email: 'ada@example.com',
  goals: ['habits', 'money'],
  time: 'morning',
  minutes: 10,
  plan: 'atomic',
  mode: 'app',
  remind: true,
  middayReminder: true,
  actions: { a: true },
  answer: 'Reaching for my phone the second I wake up. It charges right next to my bed.',
  dayDone: false,
  plus: false,
  chat: [],
}
