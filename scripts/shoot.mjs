// Serves dist/ with Vite's preview server, captures screenshots at key moments, then shuts down.
// Usage: npm run shoot   (writes PNGs to out/)
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { preview } from 'vite'

const out = new URL('../out/', import.meta.url)
await mkdir(out, { recursive: true })
const server = await preview({ preview: { port: 4818, strictPort: false }, logLevel: 'silent' })
const url = server.resolvedUrls.local[0]
const browser = await chromium.launch()
const errors = []

async function run(name, viewport, steps) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${name}] ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`[${name}] ${e.message}`))
  await page.goto(url, { waitUntil: 'networkidle' })
  for (const [label, fn] of steps) {
    await fn(page)
    await page.screenshot({ path: new URL(`${name}-${label}.png`, out).pathname })
  }
  await page.close()
}

const at = (sel, extra = 0, wait = 1400) => async (p) => {
  await p.evaluate(([s, e]) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + e) }, [sel, extra])
  await p.waitForTimeout(wait)
}
const dayAt = (frac) => async (p) => {
  await p.evaluate((f) => { const el = document.querySelector('#how'); const top = el.offsetTop; window.scrollTo(0, top + (el.offsetHeight - innerHeight) * f) }, frac)
  await p.waitForTimeout(1600)
}

const steps = (mobile) => [
  ['01-hero', async (p) => p.waitForTimeout(3200)],
  ['02-pile', at('.pile', mobile ? 0 : -60)],
  ['03-morning', dayAt(0.12)],
  ['04-midday', dayAt(0.5)],
  ['05-evening', dayAt(0.92)],
  ['06-streak-cursor', at('.streak', mobile ? 0 : -40, 1500)],
  ['07-streak-done', async (p) => p.waitForTimeout(500)],
  ['08-manifesto', at('.manifesto', 120, 800)],
  ['09-library', at('#library', -80)],
  ['10-library-hover', async (p) => { if (!mobile) { await p.hover('.book:nth-child(2) .book-link'); await p.waitForTimeout(500) } }],
  ['11-clubs', at('#clubs', -80, 3200)],
  ['12-pricing', at('#pricing', -80)],
  ['13-final', at('#start', -80)],
]

await run('desktop', { width: 1440, height: 900 }, steps(false))
await run('mobile', { width: 390, height: 844 }, steps(true))

await browser.close()
await server.close()
console.log(errors.length ? `Console errors:\n${errors.join('\n')}` : 'No console errors')
