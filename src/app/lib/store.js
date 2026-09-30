// One data API with two back ends:
//  - Supabase (live): real accounts, email codes, Google sign-in, rows protected by RLS.
//  - Demo: the same calls saved to this browser only, used until the Supabase keys are set.
import { AppError, toAppError } from './errors.js'
import { isLive, supabase } from './supabase.js'

const nameFrom = (email) => {
  const raw = (email || '').split('@')[0].split(/[._-]/)[0] || 'Reader'
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

const toProfile = (row, user) => row && ({
  id: row.id,
  email: user?.email ?? row.email ?? '',
  name: row.display_name ? row.display_name.charAt(0).toUpperCase() + row.display_name.slice(1) : nameFrom(user?.email),
  goals: row.goals ?? [],
  time: row.reading_time ?? 'morning',
  minutes: row.minutes ?? 10,
  plan: row.current_plan ?? 'atomic',
  mode: row.reading_mode ?? 'app',
  remind: row.reminders ?? true,
  plusWaitlist: row.plus_waitlist ?? false,
  clubsWaitlist: row.clubs_waitlist ?? false,
  onboarded: Boolean(row.onboarded_at),
})

const PROFILE_COLUMNS = {
  name: 'display_name', goals: 'goals', time: 'reading_time', minutes: 'minutes', plan: 'current_plan',
  mode: 'reading_mode', remind: 'reminders', plusWaitlist: 'plus_waitlist', clubsWaitlist: 'clubs_waitlist',
}
const toRow = (patch) => {
  const row = {}
  for (const [k, v] of Object.entries(patch)) {
    if (k === 'onboarded') row.onboarded_at = v ? new Date().toISOString() : null
    else if (PROFILE_COLUMNS[k]) row[PROFILE_COLUMNS[k]] = v
  }
  return row
}
const toLog = (r) => ({ planId: r.plan_id, day: r.day, date: r.completed_on, actions: r.actions || {}, reflection: r.reflection || '' })

const redirectTo = () => `${window.location.origin}${window.location.pathname}`

function liveStore() {
  const must = async (p, context) => {
    const { data, error } = await p
    if (error) throw toAppError(error, context)
    return data
  }
  const userId = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data?.user) throw new AppError('session', 'You’ve been signed out. Sign in again to keep going.')
    return data.user
  }
  return {
    live: true,
    async session() {
      const { data } = await supabase.auth.getSession()
      return data.session
    },
    onAuth(cb) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session))
      return () => data.subscription.unsubscribe()
    },
    async sendCode(email) {
      await must(supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: redirectTo() } }), 'send')
    },
    async verifyCode(email, token) {
      const data = await must(supabase.auth.verifyOtp({ email, token, type: 'email' }), 'verify')
      return data.session
    },
    async google() {
      await must(supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo() } }), 'google')
    },
    async signOut() {
      await supabase.auth.signOut()
    },
    async profile() {
      const user = await userId()
      const row = await must(supabase.from('profiles').select('*').eq('id', user.id).maybeSingle())
      if (row) return toProfile(row, user)
      // Trigger missed (e.g. project created before the migration): create the row now.
      const created = await must(supabase.from('profiles').insert({ id: user.id, display_name: user.user_metadata?.full_name || user.email.split('@')[0] }).select().single())
      return toProfile(created, user)
    },
    async updateProfile(patch) {
      const user = await userId()
      const row = await must(supabase.from('profiles').update(toRow(patch)).eq('id', user.id).select().single())
      return toProfile(row, user)
    },
    async logs() {
      const rows = await must(supabase.from('day_logs').select('plan_id, day, completed_on, actions, reflection').order('completed_on', { ascending: false }))
      return rows.map(toLog)
    },
    async saveLog(log) {
      const user = await userId()
      const row = await must(supabase.from('day_logs').upsert({
        user_id: user.id, plan_id: log.planId, day: log.day, completed_on: log.date, actions: log.actions, reflection: log.reflection || null,
      }).select().single())
      return toLog(row)
    },
    async highlights() {
      const rows = await must(supabase.from('highlights').select('plan_id, day, text, created_at').order('created_at', { ascending: false }))
      return rows.map((r) => ({ planId: r.plan_id, day: r.day, text: r.text, date: r.created_at.slice(0, 10) }))
    },
    async addHighlight(h) {
      const user = await userId()
      await must(supabase.from('highlights').upsert({ user_id: user.id, plan_id: h.planId, day: h.day, text: h.text }, { onConflict: 'user_id,plan_id,day,text', ignoreDuplicates: true }))
    },
    async removeHighlight(h) {
      await must(supabase.from('highlights').delete().match({ plan_id: h.planId, day: h.day, text: h.text }))
    },
  }
}

// Demo back end: same shape, stored in localStorage (falls back to memory if storage is blocked).
function demoStore() {
  const KEY = 'mindleaf-demo-v1'
  let mem = null
  const read = () => {
    if (mem) return mem
    try { mem = JSON.parse(localStorage.getItem(KEY)) } catch { mem = null }
    return (mem ||= { session: null, profile: null, logs: [], highlights: [] })
  }
  const write = () => { try { localStorage.setItem(KEY, JSON.stringify(mem)) } catch { /* private mode: keep in memory */ } }
  const listeners = new Set()
  const emit = () => listeners.forEach((cb) => cb(read().session))
  const wait = (ms) => new Promise((r) => setTimeout(r, ms))
  return {
    live: false,
    async session() { return read().session },
    onAuth(cb) { listeners.add(cb); return () => listeners.delete(cb) },
    async sendCode(email) {
      await wait(500)
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AppError('email', 'That email address doesn’t look right. Check it and try again.')
      read().pendingEmail = email
      write()
    },
    async verifyCode(email, token) {
      await wait(400)
      if (!/^\d{6}$/.test(token)) throw new AppError('code', 'Enter the 6-digit code from the email.')
      const s = read()
      s.session = { user: { id: 'demo-user', email } }
      if (!s.profile || s.profile.email !== email) {
        s.profile = { id: 'demo-user', email, name: nameFrom(email), goals: [], time: 'morning', minutes: 10, plan: 'atomic', mode: 'app', remind: true, plusWaitlist: false, clubsWaitlist: false, onboarded: false }
        s.logs = []
        s.highlights = []
      }
      write(); emit()
      return s.session
    },
    async google() {
      return this.verifyCode('reader@gmail.com', '000000')
    },
    async signOut() { const s = read(); s.session = null; write(); emit() },
    async profile() { return read().profile },
    async updateProfile(patch) { const s = read(); s.profile = { ...s.profile, ...patch }; write(); return s.profile },
    async logs() { return [...read().logs].sort((a, b) => (a.date < b.date ? 1 : -1)) },
    async saveLog(log) {
      const s = read()
      s.logs = [...s.logs.filter((l) => !(l.planId === log.planId && l.day === log.day)), log]
      write()
      return log
    },
    async highlights() { return read().highlights },
    async addHighlight(h) { const s = read(); if (!s.highlights.some((x) => x.text === h.text && x.day === h.day)) s.highlights = [{ ...h, date: new Date().toISOString().slice(0, 10) }, ...s.highlights]; write() },
    async removeHighlight(h) { const s = read(); s.highlights = s.highlights.filter((x) => !(x.text === h.text && x.day === h.day && x.planId === h.planId)); write() },
    reset() { mem = { session: null, profile: null, logs: [], highlights: [] }; write(); emit() },
  }
}

export const store = isLive ? liveStore() : demoStore()
