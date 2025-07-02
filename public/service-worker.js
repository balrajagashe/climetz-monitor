const CACHE_NAME = 'climetz-pwa-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/_next/static/favicon.ico',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js',
  '/_next/static/chunks/webpack.js',
  '/_next/static/css/styles.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const keepList = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!keepList.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Data API: network-first
  if (request.url.includes('/api/soil-moisture')) {
    event.respondWith(
      fetch(request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Navigation (HTML): cache-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then(cached =>
        cached || fetch(request).catch(() => caches.match(OFFLINE_URL))
      )
    );
    return;
  }

  // Other assets (CSS/JS/images): cache-first
  event.respondWith(
    caches.match(request).then(cached =>
      cached || fetch(request)
    )
  );
});
