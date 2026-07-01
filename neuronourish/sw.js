/* NeuroNourish service worker — network-first so updates are never stale,
   with a cache fallback for offline use. */
const CACHE = "neuronourish-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/data.js",
  "./js/premium.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./fonts/PlusJakartaSans-800.woff2",
  "./fonts/PlusJakartaSans-700.woff2",
  "./audio/manifest.json"
];
// Narration MP3s (audio/<SYMBOL>.mp3) are cached on first play by the
// network-first fetch handler below, so they work offline thereafter.

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
  );
});
