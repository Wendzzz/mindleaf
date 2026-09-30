// Checks the app is installable and opens offline. Usage: npm run build && node scripts/test-pwa.mjs
import { chromium } from 'playwright'
import { preview } from 'vite'

const server = await preview({ preview: { port: 4823 }, logLevel: 'silent' })
const base = server.resolvedUrls.local[0]
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } })
const page = await ctx.newPage()
await page.goto(`${base}app/`, { waitUntil: 'networkidle' })
const manifest = await page.evaluate(async () => {
  const href = document.querySelector('link[rel=manifest]').href
  const m = await (await fetch(href)).json()
  return { name: m.name, display: m.display, start_url: m.start_url, icons: m.icons.length }
})
const sw = await page.evaluate(async () => {
  const reg = await Promise.race([navigator.serviceWorker.ready, new Promise((r) => setTimeout(() => r(null), 5000))])
  return reg ? reg.scope : null
})
await page.reload({ waitUntil: 'networkidle' }) // let the worker take control and cache the shell
await ctx.setOffline(true)
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1200)
const offlineHeading = await page.locator('.screen .h1').first().textContent().catch(() => null)
const offlinePill = await page.locator('.offline-pill').isVisible().catch(() => false)
console.log(JSON.stringify({ manifest, serviceWorkerScope: sw, opensOffline: Boolean(offlineHeading), offlineHeading, offlineNoticeShown: offlinePill }, null, 2))
await browser.close(); await server.close()
