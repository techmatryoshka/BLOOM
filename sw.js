/* ============================================================
   Bloom — sw.js (Service Worker)
   Caches all assets for offline use
   ============================================================ */

const CACHE_NAME    = 'bloom-v1';
const CACHE_VERSION = '1.0.0';

// All assets to cache for offline use
const ASSETS_TO_CACHE = [
  '/BLOOM/',
  '/BLOOM/index.html',
  '/BLOOM/css/style.css',
  '/BLOOM/js/app.js',
  '/BLOOM/manifest.json',

  // Fonts (cache from Google Fonts CDN)
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Lora:ital,wght@0,400;1,400&family=Satisfy&display=swap',

  // Stickers
  '/BLOOM/assets/stickers/crown.webp',
  '/BLOOM/assets/stickers/crown-gold.webp',
  '/BLOOM/assets/stickers/moon.webp',
  '/BLOOM/assets/stickers/sun.png',
  '/BLOOM/assets/stickers/seedling.png',
  '/BLOOM/assets/stickers/blossom.webp',
  '/BLOOM/assets/stickers/sunflower.webp',
  '/BLOOM/assets/stickers/clover.webp',
  '/BLOOM/assets/stickers/iris.webp',
  '/BLOOM/assets/stickers/notebook.webp',
  '/BLOOM/assets/stickers/diary.webp',
  '/BLOOM/assets/stickers/radio.png',
  '/BLOOM/assets/stickers/flower10.webp',
  '/BLOOM/assets/stickers/calendar.png',
  '/BLOOM/assets/stickers/trophy.png',
  '/BLOOM/assets/stickers/candle.png',
  '/BLOOM/assets/stickers/snail.png',
  '/BLOOM/assets/stickers/bee.png',
  '/BLOOM/assets/stickers/ladybug.png',

  // Background floaties
  '/BLOOM/assets/bg/flower1.png',
  '/BLOOM/assets/bg/flower2.webp',
  '/BLOOM/assets/bg/flower3.webp',
  '/BLOOM/assets/bg/flower4.webp',
  '/BLOOM/assets/bg/flower5.webp',
  '/BLOOM/assets/bg/flower6.webp',
  '/BLOOM/assets/bg/flower7.webp',
  '/BLOOM/assets/bg/flower9.webp',
  '/BLOOM/assets/bg/flower10.webp',
  '/BLOOM/assets/bg/flower11.png',
  '/BLOOM/assets/bg/flower12.png',
  '/BLOOM/assets/bg/flower13.png',
  '/BLOOM/assets/bg/flower14.png',
  '/BLOOM/assets/bg/flower15.png',
  '/BLOOM/assets/bg/flower16.png',
  '/BLOOM/assets/bg/flower17.png',
  '/BLOOM/assets/bg/blossom.webp',
  '/BLOOM/assets/bg/butterfly.webp',
  '/BLOOM/assets/bg/leaf1.webp',
  '/BLOOM/assets/bg/leaf2.webp',
  '/BLOOM/assets/bg/petal1.webp',
  '/BLOOM/assets/bg/petal2.webp',
  '/BLOOM/assets/bg/petal3.webp',
  '/BLOOM/assets/bg/star1.png',
  '/BLOOM/assets/bg/star2.webp',
  '/BLOOM/assets/bg/star3.png',
  '/BLOOM/assets/bg/sparkle1.png',
  '/BLOOM/assets/bg/sparkle2.png',
  '/BLOOM/assets/bg/sparkle3.png',
  '/BLOOM/assets/bg/sparkle4.png',

  // Icons
  '/BLOOM/assets/icons/icon-192x192.png',
  '/BLOOM/assets/icons/icon-512x512.png',

  // Nature sounds
  '/BLOOM/assets/sounds/rain.mp3',
  '/BLOOM/assets/sounds/forest.mp3',
  '/BLOOM/assets/sounds/birds.mp3',
  '/BLOOM/assets/sounds/stream.mp3',
  '/BLOOM/assets/sounds/wind.mp3',
  '/BLOOM/assets/sounds/fireplace.mp3',
];

// ── Install: cache everything ─────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[Bloom SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Bloom SW] Caching all assets');
        // Cache in batches to avoid overwhelming the browser
        const batches = [];
        const batchSize = 10;
        for (let i = 0; i < ASSETS_TO_CACHE.length; i += batchSize) {
          batches.push(ASSETS_TO_CACHE.slice(i, i + batchSize));
        }
        return batches.reduce((promise, batch) => {
          return promise.then(() =>
            Promise.allSettled(batch.map(url => cache.add(url).catch(e => {
              console.warn('[Bloom SW] Failed to cache:', url, e);
            })))
          );
        }, Promise.resolve());
      })
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[Bloom SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[Bloom SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: serve from cache, fall back to network ─────────────────
self.addEventListener('fetch', event => {
  // Don't intercept audio streams — they need to be live
  const url = event.request.url;
  if (url.includes('somafm.com') || url.includes('youtube.com') || url.includes('chillhop')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;
        // Not in cache — fetch from network
        return fetch(event.request)
          .then(response => {
            // Cache successful GET responses
            if (
              response &&
              response.status === 200 &&
              event.request.method === 'GET' &&
              !url.includes('chrome-extension')
            ) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => {
            // Offline fallback — return cached index.html for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/BLOOM/index.html');
            }
          });
      })
  );
});
