// UniWork UK service worker: lets the app open from the home screen, and shows the last
// version it saw when the phone is offline. Pages always try the network first, so a new
// deploy is picked up on the next visit. Bump VERSION to clear old caches.
const VERSION = 'uniwork-v1';
const CORE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'fonts/geist-latin-400-normal.woff2',
  'fonts/geist-latin-500-normal.woff2',
  'fonts/geist-latin-600-normal.woff2',
  'fonts/geist-latin-700-normal.woff2',
  'fonts/geist-latin-800-normal.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only this site's own files. The job feed (api/) and the backend always go to the network.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined)))
  );
});
