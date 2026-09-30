// Serves dist/ and captures every prototype screen at desktop (phone frame) and phone size.
// Usage: npm run build && node scripts/shoot-app.mjs   (writes PNGs to out/app/)
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { preview } from 'vite'

const out = new URL('../out/app/', import.meta.url)
await mkdir(out, { recursive: true })
const server = await preview({ preview: { port: 4820 }, logLevel: 'silent' })
const base = server.resolvedUrls.local[0]
const browser = await chromium.launch()
const errors = []
const SCREENS = ['welcome', 'signin', 'verify', 'goals', 'schedule', 'firstplan', 'reminders', 'ready', 'home', 'plan', 'reading', 'liveit', 'reflect', 'daydone', 'welcomeback', 'library', 'journal', 'club', 'profile', 'paywall']

for (const [name, viewport] of [['phone', { width: 390, height: 780 }], ['desktop', { width: 1440, height: 900 }]]) {
  const page = await browser.newPage({ viewport })
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${name}] ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`[${name}] ${e.message}`))
  await page.goto(`${base}app/#/welcome`, { waitUntil: 'networkidle' })
  for (const id of (name === 'desktop' ? ['welcome', 'home', 'reading', 'daydone'] : SCREENS)) {
    await page.evaluate((s) => { window.location.hash = `/${s}` }, id)
    await page.waitForTimeout(id === 'verify' || id === 'daydone' ? 1800 : 900)
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src))
    if (broken.length) errors.push(`[${name}/${id}] broken images: ${broken.join(', ')}`)
    await page.screenshot({ path: new URL(`${name}-${id}.png`, out).pathname })
  }
  await page.close()
}
await browser.close()
await server.close()
console.log(errors.length ? errors.join('\n') : 'No console errors or broken images')
