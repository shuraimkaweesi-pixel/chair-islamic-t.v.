// =========================
// CHAIR ISLAMIC TV SW V2
// App Shell = Offline, API = Online only
// =========================
const CACHE_NAME = 'chair-islamic-v3';
const URLS_TO_CACHE = [
  '/chair-islamic/',
  '/chair-islamic/index.html',
  '/chair-islamic/hadith.html',
  '/chair-islamic/quran.html',
  '/chair-islamic/prayer.html',
  '/chair-islamic/videos.html',
  '/chair-islamic/styles.css',
  '/chair-islamic/hadiths.json',
  '/chair-islamic/manifest.json',
  '/chair-islamic/logo.png'
];

// Install - cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - serve from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cache if found
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request).then(response => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          // Clone and cache new requests
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/chair-islamic/index.html');
        }
      })
  );
});
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
