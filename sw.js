const CACHE_NAME = "chair-tv-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/logo.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch (offline support)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
// ===============================
// SERVICE WORKER (BACKGROUND)
// ===============================

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  console.log("Service Worker Activated");
});

// Listen for messages from app
self.addEventListener("message", event => {

  if(event.data.type === "PRAYER_ALERT"){

    self.registration.showNotification("🕌 Prayer Time", {
      body: "It's time for " + event.data.prayer,
      icon: "logo.png",
      vibrate: [200, 100, 200]
    });

  }

});
