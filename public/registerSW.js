// Loaded by an earlier app's cached page. Remove its service workers and caches, then reload onto the live site.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(async (regs) => {
    await Promise.all(regs.map((r) => r.unregister()))
    if (window.caches) await Promise.all((await caches.keys()).map((k) => caches.delete(k)))
    if (regs.length) location.reload()
  })
}
