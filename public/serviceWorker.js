// Kill switch for a service worker left by an earlier app on this address.
// It takes over, deletes every cache, unregisters itself and reloads open tabs onto the live site.
self.addEventListener("install", () => self.skipWaiting())
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.map((k) => caches.delete(k)))
    await self.registration.unregister()
    const tabs = await self.clients.matchAll({ type: "window" })
    tabs.forEach((tab) => tab.navigate(tab.url))
  })())
})
