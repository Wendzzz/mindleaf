// Clicks through the prototype like a visitor: website "Sign in" → onboarding → Day 4 → Home shows the day as done.
import { chromium, devices } from 'playwright'
import { preview } from 'vite'

const server = await preview({ preview: { port: 4821 }, logLevel: 'silent' })
const base = server.resolvedUrls.local[0]
const browser = await chromium.launch()
const page = await browser.newPage({ ...devices['iPhone 13'] })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
const step = async (label, fn) => { await fn(); await page.waitForTimeout(450); console.log(`✓ ${label} → ${new URL(page.url()).hash || '(site)'}`) }
const tap = (name) => page.getByRole('button', { name }).first().click()

await page.goto(base, { waitUntil: 'networkidle' })
await step('Website menu → Sign in', async () => { await page.getByRole('button', { name: 'Open menu' }).click(); await page.getByRole('link', { name: 'Sign in' }).last().click(); await page.waitForURL(/app\//) })
await step('Send me a code', () => tap('Send me a code'))
await step('Verify and continue (after code fills in)', async () => { await page.waitForTimeout(1600); await tap('Verify and continue') })
await step('Pick "Focus without distraction", continue', async () => { await tap('Focus without distraction'); await tap('Continue') })
await step('Pick "Before bed", continue', async () => { await page.getByRole('radio', { name: /Before bed/ }).click(); await tap('Continue') })
const rec = await page.locator('.rec-title').textContent()
await step(`First plan shows "${rec}"; start it`, () => tap('Start this plan'))
const nudge = await page.locator('.screen .h1').first().textContent()
await step(`Reminders: "${nudge}"; turn on`, () => tap('Turn on reminders'))
await step('Start Day 1', () => tap('Start Day 1'))
await step('Done reading', () => tap('Done reading'))
await step('Tick 2nd action, next', async () => { await page.getByRole('button', { name: /pillow/ }).click(); await tap('Next: tonight’s question') })
await step('Finish Day 4', () => tap('Finish Day 4'))
await page.waitForTimeout(1000)
const streak = await page.locator('.streak-num').textContent()
await step(`Day complete shows streak ${streak}; back to home`, () => tap('Back to home'))
const card = await page.locator('.today-card .today-title').textContent()
const chip = await page.locator('.streak-chip').textContent()
console.log(`Home card: "${card}" · streak chip: ${chip}`)
await page.goBack(); await page.waitForTimeout(500)
console.log(`Browser back → ${new URL(page.url()).hash}`)
await browser.close(); await server.close()
console.log(errors.length ? `Errors:\n${errors.join('\n')}` : 'No errors')
