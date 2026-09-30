// Unit checks for the streak + grace-day rules. Usage: node scripts/test-streak.mjs
import { computeStreak } from '../src/app/lib/dates.js'

const cases = [
  ['nothing read', [], '2026-10-01', { streak: 0, readToday: false, missedYesterday: false }],
  ['read today only', ['2026-10-01'], '2026-10-01', { streak: 1, readToday: true }],
  ['read yesterday, today still open', ['2026-09-30'], '2026-10-01', { streak: 1, readToday: false, missedYesterday: false }],
  ['three days in a row', ['2026-09-29', '2026-09-30', '2026-10-01'], '2026-10-01', { streak: 3 }],
  ['missed yesterday: grace keeps streak', ['2026-09-28', '2026-09-29'], '2026-10-01', { streak: 2, missedYesterday: true, graceLeft: 1 }],
  ['two gaps in one week: still covered', ['2026-09-28', '2026-09-30', '2026-10-02'], '2026-10-02', { streak: 3, graceLeft: 0 }],
  ['three missed in a row: streak ends', ['2026-09-25'], '2026-09-29', { streak: 0, graceLeft: 2, missedYesterday: false }],
]
let bad = 0
for (const [name, dates, today, want] of cases) {
  const got = computeStreak(dates, today)
  const ok = Object.entries(want).every(([k, v]) => got[k] === v)
  if (!ok) bad++
  console.log(`${ok ? '✓' : '✗'} ${name}${ok ? '' : ` → got ${JSON.stringify(got)}`}`)
}
process.exit(bad ? 1 : 0)
