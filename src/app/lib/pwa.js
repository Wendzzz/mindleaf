import { useEffect, useState } from 'react'

// Registers the app's service worker (production builds only) so Mindleaf opens offline
// and can be installed. Scope is /app/, separate from the landing page.
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => { /* app still works without it */ })
  })
}

const isStandalone = () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

// Install state for the "Install Mindleaf" button:
//  - 'prompt'   Chrome/Edge/Android can show their own install dialog
//  - 'ios'      Safari on iPhone/iPad: show Share → Add to Home Screen steps
//  - 'installed' already running as an app
//  - 'none'     browser can't install (e.g. desktop Safari, Firefox)
let deferred = null
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; window.dispatchEvent(new Event('mindleaf-installable')) })
}

export function useInstall() {
  const compute = () => (isStandalone() ? 'installed' : deferred ? 'prompt' : isIOS() ? 'ios' : 'none')
  const [mode, setMode] = useState(compute)
  useEffect(() => {
    const update = () => setMode(compute())
    window.addEventListener('mindleaf-installable', update)
    window.addEventListener('appinstalled', update)
    return () => { window.removeEventListener('mindleaf-installable', update); window.removeEventListener('appinstalled', update) }
  }, [])
  const install = async () => {
    if (!deferred) return false
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    deferred = null
    setMode(compute())
    return outcome === 'accepted'
  }
  return { mode, install }
}

export function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])
  return online
}
