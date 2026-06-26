/*
 * Service worker for "Curt Frenzel's First Masterpiece Chess Game".
 *
 * Network-first: always try to fetch the latest file from the network (so new
 * deploys show up immediately), and fall back to the cache only when offline.
 * The cache still makes the game fully playable offline once it has been
 * opened. Bump CACHE whenever the cached set should be refreshed.
 */
const CACHE = "ff-chess-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./css/chess.css",
  "./js/engine.js",
  "./js/pieces.js",
  "./js/music.js",
  "./js/sfx.js",
  "./js/chess.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting(); // activate the new worker as soon as it is installed
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()) // take control of open pages right away
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // don't touch cross-origin requests

  // Network-first: fetch fresh, refresh the cache, fall back to cache offline.
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return resp;
      })
      .catch(() =>
        caches.match(e.request).then((hit) => hit || caches.match("./index.html"))
      )
  );
});
