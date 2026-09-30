// Renders the Mindleaf leaf mark to the PNG icons the app manifest and iOS need.
import { chromium } from 'playwright'

const leaf = (inset) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
  <rect width="32" height="32" rx="${inset ? 0 : 7}" fill="#1F4034"/>
  <g transform="translate(16 16) scale(${inset ? 0.74 : 0.8}) translate(-16 -16)">
    <path d="M8.5 23.5c0-8.6 5.8-14.5 15-14.5 0 9.7-5.9 15.5-14.2 15.5z" fill="#FF8A45"/>
    <path d="M9.5 22.5 18 14" stroke="#1F4034" stroke-width="1.8" stroke-linecap="round"/>
  </g></svg>`
const jobs = [
  ['public/app/icons/icon-192.png', 192, false],
  ['public/app/icons/icon-512.png', 512, false],
  ['public/app/icons/maskable-512.png', 512, true],
  ['public/app/icons/apple-touch-icon.png', 180, true],
]
const b = await chromium.launch()
for (const [path, size, full] of jobs) {
  const p = await b.newPage({ viewport: { width: size, height: size } })
  await p.setContent(`<html><body style="margin:0;background:transparent">${leaf(full)}</body></html>`)
  await p.screenshot({ path, omitBackground: !full })
  await p.close()
}
await b.close()
console.log('icons written')
