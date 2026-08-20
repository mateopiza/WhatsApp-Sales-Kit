/**
 * Empires Jewelry - Service Worker (Offline Shell & Asset Cache)
 * Version: empires-v1.0.0
 */

const CACHE_STATIC_NAME = 'empires-static-v1';
const CACHE_SHELL_NAME = 'empires-shell-v1';
const MAX_IMAGE_CACHE_ENTRIES = 60;

const PRECACHE_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/logos/logo-lockup-cream.png',
  '/assets/logos/mark-only-taupe.png',
  '/assets/hero/hero-necklace-rings.png'
];

// Precache App Shell on Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_SHELL_NAME).then((cache) => {
      return cache.addAll(PRECACHE_SHELL_ASSETS);
    })
  );
});

// Clean up legacy caches on Activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_STATIC_NAME && name !== CACHE_SHELL_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Cache Limit Helper
async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      await cache.delete(keys[0]);
      await trimCache(cacheName, maxItems);
    }
  } catch (e) {
    // Ignore cache trimming errors in restricted environments
  }
}

// Fetch Interception
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Strategy 1: CacheFirst for Fonts, Images, Audio, Icons
  const isStaticAsset =
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.includes('/assets/') ||
    url.hostname.includes('fontsource') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isStaticAsset) {
    event.respondWith(
      caches.open(CACHE_STATIC_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
            trimCache(CACHE_STATIC_NAME, MAX_IMAGE_CACHE_ENTRIES);
          }
          return networkResponse;
        } catch (error) {
          // If offline and image not found, return fallback SVG placeholder
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="#F5EDE6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Cinzel, serif" fill="#8A8176" font-size="14">EMPIRES JEWELRY</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
          throw error;
        }
      })
    );
    return;
  }

  // Strategy 2: StaleWhileRevalidate for HTML, JS, CSS, JSON
  event.respondWith(
    caches.open(CACHE_SHELL_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed, rely on cache or fallback
          return cachedResponse || (request.mode === 'navigate' ? cache.match('/index.html') : null);
        });

      return cachedResponse || fetchPromise;
    })
  );
});
