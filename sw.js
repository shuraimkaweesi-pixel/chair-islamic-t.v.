// =========================
// CHAIR ISLAMIC TV SW V2
// App Shell = Offline, API = Online only
// =========================

const CACHE_NAME = 'yasarnah-shell-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap'
];

// URLs that should NEVER be cached - always go online
const NETWORK_ONLY = [
  'everyayah.com',           // Quran audio
  'youtube.com',             // YouTube videos
  'api.alquran.cloud',       // Quran text API
  'api.aladhan.com',         // Adhan times
  'cdn.islamic.network'      // Adhan audio
];

// Install - cache only the app shell
self.addEventListener('install', event => {
  console.log('[SW] Installing app shell...');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
  );
});

// Activate - delete old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // 1. NETWORK-ONLY: Quran audio, YouTube, APIs must be online
  if (NETWORK_ONLY.some(domain => url.includes(domain))) {
    console.log('[SW] Network only:', url);
    event.respondWith(fetch(event.request).catch(() => {
      // If offline, return empty response so app doesn't crash
      return new Response('', { status: 503, statusText: 'Offline' });
    }));
    return;
  }

  // 2. CACHE-FIRST FOR APP SHELL: HTML/CSS/Fonts work offline
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        console.log('[SW] Cache hit:', url);
        return cached;
      }
      
      // Not in cache, try network
      return fetch(event.request).then(response => {
        // Cache new app shell files only
        if (response.status === 200 && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // 3. OFFLINE FALLBACK: If requesting a page, return index.html
        if (event.request.mode === 'navigate') {
          console.log('[SW] Offline fallback to index.html');
          return caches.match('/index.html');
        }
        // For images/audio that fail, return nothing
        return new Response('', { status: 404 });
      });
    })
  );
});
