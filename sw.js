const CACHE_NAME = 'chess-royale-offline-v5';

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
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/pawn/scene.gltf',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/pawn/scene.bin',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/rook/scene.gltf',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/rook/scene.bin',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/knight/scene.gltf',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/knight/scene.bin',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/bishop/scene.gltf',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/bishop/scene.bin',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/queen/scene.gltf',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/queen/scene.bin',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/queen/textures/lambert4_baseColor.png',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/queen/textures/lambert4_metallicRoughness.png',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/queen/textures/lambert4_normal.png',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/bishop/textures/wood_baseColor.png',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/bishop/textures/wood_metallicRoughness.png',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/bishop/textures/wood_normal.png',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/rook/textures/Material.001_baseColor.jpeg',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/rook/textures/Material.001_metallicRoughness.png',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/rook/textures/Material.001_normal.png',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/king/scene.gltf',
  'https://raw.githubusercontent.com/Sushant-Coder-01/chess3d/main/public/models/king/scene.bin'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    await Promise.allSettled(
      APP_ASSETS.map(async (url) => {
        try {
          const response = await fetch(url, { cache: 'no-cache' });
          if (response.ok) await cache.put(url, response);
        } catch (error) {
          console.warn('Could not cache app asset:', url, error);
        }
      })
    );

    // Cross-origin assets are cached individually so one failed asset does not
    // prevent the rest of the offline bundle from being prepared.
    await Promise.allSettled(
      REMOTE_ASSETS.map(async (url) => {
        try {
          const response = await fetch(url, { mode: 'cors', cache: 'no-cache' });
          if (response.ok) await cache.put(url, response.clone());
        } catch (error) {
          console.warn('Could not cache remote asset:', url, error);
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
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(request);

      if (response.ok || response.type === 'opaque') {
        cache.put(request, response.clone()).catch(() => {});
      }

      return response;
    } catch (error) {
      const fallback = await cache.match('./index.html');
      if (fallback) return fallback;
      throw error;
    }
  })());
});
