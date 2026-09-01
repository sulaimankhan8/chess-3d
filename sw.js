const CACHE_NAME = 'chess-royale-offline-v6';

const APP_ASSETS = [
  './',
  './index.html',
  './style.css',
  './js/3d-app.js',
  './js/game.js',
  './js/ai.js'
];

const REMOTE_ASSETS = [
  'https://unpkg.com/three@0.126.0/build/three.module.js',
  'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js',
  'https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js',
  'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
  'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
  'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
  'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(
      APP_ASSETS.concat(REMOTE_ASSETS).map(async (url) => {
        try {
          const response = await fetch(url, { cache: 'no-cache' });
          if (response.ok) await cache.put(url, response);
        } catch (error) {
          console.warn('Could not cache app asset:', url, error);
        }
      })
    );
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request, { cache: 'no-cache' });
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
        return response;
      }
    } catch (err) {
      // Network failed, serve from cache
    }
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    return fetch(request);
  })());
});
