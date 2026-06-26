/*
 * Service worker for "Final Fantasy Chess".
 * Caches the full app shell so the game is installable and fully playable
 * offline once it has been opened a single time.
 */
const CACHE = "ff-chess-v2";
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
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request))
  );
});
