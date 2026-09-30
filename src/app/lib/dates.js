// Dates are stored as the reader's local calendar day (YYYY-MM-DD), so "today" means their today.
export const localDay = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const addDays = (iso, n) => {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d + n)
  return localDay(date)
}

// Monday of the week containing `iso`.
export const weekStart = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const offset = (date.getDay() + 6) % 7
  return addDays(iso, -offset)
}

const GRACE_PER_WEEK = 2
const MAX_GAP = 2 // never bridge more than two missed days in a row

// Streak with grace days: a missed day doesn't break the streak while the reader
// still has grace days left that week (two per Monday–Sunday week), and never for more than two days in a row.
export function computeStreak(logDates, today = localDay()) {
  const read = new Set(logDates)
  const graceUsed = {}
  let streak = 0
  let graceDays = []
  let gap = 0
  // If today isn't read yet, start counting from yesterday: today is still open.
  let cursor = read.has(today) ? today : addDays(today, -1)
  for (let i = 0; i < 400; i++) {
    if (read.has(cursor)) {
      streak += 1
      gap = 0
    } else {
      const wk = weekStart(cursor)
      const used = graceUsed[wk] || 0
      // A grace day only bridges a gap if there is a read day before it.
      const earlierRead = [...read].some((d) => d < cursor)
      if (used < GRACE_PER_WEEK && earlierRead && gap < MAX_GAP) {
        graceUsed[wk] = used + 1
        gap += 1
        graceDays.push(cursor)
      } else {
        // The gap was too long: the grace days tried for it didn't save anything, so give them back.
        for (let k = 0; k < gap; k++) {
          const g = graceDays.pop()
          graceUsed[weekStart(g)] -= 1
        }
        break
      }
    }
    cursor = addDays(cursor, -1)
  }
  // Grace days at the start of the run don't count if nothing was read before them.
  graceDays = graceDays.filter((g) => [...read].some((d) => d < g))
  const thisWeek = weekStart(today)
  return {
    streak,
    graceDays,
    graceLeft: GRACE_PER_WEEK - (graceUsed[thisWeek] || 0),
    readToday: read.has(today),
    missedYesterday: !read.has(addDays(today, -1)) && streak > 0,
  }
}
