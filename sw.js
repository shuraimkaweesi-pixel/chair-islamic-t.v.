const CACHE_NAME = "chair-tv-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/quran.html",
  "/hadith.html",
  "/prayer.html",
  "/videos.html",
  "/styles.css",
  "/logo.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch (offline support)
self.addEventListener("message", event => {
  if (event.data.type === "PLAY_ADHAN") {

    self.registration.showNotification("🕌 Prayer Time", {
      body: "It's time for " + event.data.prayer,
      icon: "logo.png"
    });

  }
});
