// End-to-end check of the app in demo mode (no Supabase keys): sign up with an email code,
// onboard, finish Day 1, confirm progress survives a reload, then sign out.
// Saves screenshots to out/flow/. Usage: npm run test:flow
import { mkdir } from 'node:fs/promises'
import { chromium, devices } from 'playwright'
import { preview } from 'vite'

const out = new URL('../out/flow/', import.meta.url)
await mkdir(out, { recursive: true })
const server = await preview({ preview: { port: 4821 }, logLevel: 'silent' })
const base = server.resolvedUrls.local[0]
const browser = await chromium.launch()
const errors = []
let failed = false

async function run(name, contextOptions) {
  const ctx = await browser.newContext(contextOptions)
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`[${name}] ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${name}] ${m.text()}`) })
  const shot = (label) => page.screenshot({ path: new URL(`${name}-${label}.png`, out).pathname })
  const hash = () => new URL(page.url()).hash
  const expect = (cond, msg) => { if (!cond) { failed = true; console.log(`✗ [${name}] ${msg}`) } else console.log(`✓ [${name}] ${msg}`) }
  const btn = (n) => page.getByRole('button', { name: n }).first()
  const settle = () => page.waitForTimeout(600)

  await page.goto(`${base}app/`, { waitUntil: 'networkidle' }); await settle(); await shot('01-welcome')
  await btn('Get started').click(); await settle()
  await page.getByLabel('Email address').fill('ada@example'); await btn('Send me a code').click(); await settle()
  expect(await page.getByText('Enter an email address like name@example.com.').isVisible(), 'bad email shows a clear error')
  await page.getByLabel('Email address').fill('ada@example.com'); await shot('02-signin')
  await btn('Send me a code').click(); await page.waitForTimeout(900)
  expect(hash() === '#/verify', 'sending a code opens the code screen')
  await shot('03-verify')
  await page.locator('#code').fill('123456'); await page.waitForTimeout(1200)
  expect(hash() === '#/goals', 'a 6-digit code signs in and starts onboarding')
  await btn('Build better habits').click(); await btn('Focus without distraction').click(); await shot('04-goals')
  await btn('Continue').click(); await settle()
  await page.getByRole('radio', { name: /Before bed/ }).click(); await btn('Continue').click(); await settle()
  await shot('05-firstplan')
  await btn('Start this plan').click(); await settle()
  expect((await page.locator('.screen .h1').first().textContent()).includes('9:30 PM'), 'reminder time carries through (9:30 PM)')
  await btn('Turn on reminders').click(); await page.waitForTimeout(900)
  expect(hash() === '#/ready', 'onboarding saves and shows Day 1 is ready')
  await btn('Start Day 1').click(); await settle(); await shot('06-reading')
  expect((await page.locator('.reading .h1').textContent()).includes('Tiny changes add up'), 'Day 1 reading is shown')
  await page.getByRole('button', { name: /Save today’s idea/ }).click(); await page.waitForTimeout(300)
  await btn('Done reading').click(); await settle()
  await btn('Shrink it until it takes under two minutes.').click(); await shot('07-liveit')
  await btn('Next: tonight’s question').click(); await settle()
  await page.getByLabel(/Your answer/).fill('Reading one page before bed instead of scrolling.')
  await btn('Finish Day 1').click(); await page.waitForTimeout(1500); await shot('08-daydone')
  expect((await page.locator('.streak-num').textContent()).trim() === '1', 'finishing Day 1 starts a 1-day streak')
  await btn('Back to home').click(); await settle(); await shot('09-home')
  expect((await page.locator('.today-card .today-title').textContent()).includes('See you tomorrow'), 'Home shows today as done')
  await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(800)
  expect(hash() === '#/home' && (await page.locator('.streak-chip').textContent()).trim() === '1', 'reload keeps you signed in with your streak')
  await page.getByRole('button', { name: 'Journal', exact: true }).click(); await settle(); await shot('10-journal')
  expect(await page.getByText('Reading one page before bed instead of scrolling.').isVisible(), 'reflection appears in the journal')
  expect(await page.getByText('Care less about how big the step is').isVisible(), 'saved idea appears in the journal')
  await page.getByRole('button', { name: 'Library', exact: true }).click(); await settle(); await shot('11-library')
  await page.getByRole('button', { name: 'Me', exact: true }).click(); await settle(); await shot('12-profile')
  await btn('Sign out').click(); await settle()
  expect(hash() === '#/welcome', 'signing out returns to the welcome screen')
  await page.goto(`${base}app/#/home`); await settle()
  expect(hash() === '#/welcome', 'signed-out visitors can’t open Home directly')
  await ctx.close()
}

await run('phone', { ...devices['iPhone 13'] })
await run('desktop', { viewport: { width: 1440, height: 900 } })
await browser.close(); await server.close()
console.log(errors.length ? `Errors:\n${errors.join('\n')}` : 'No console errors')
if (failed || errors.length) process.exit(1)
