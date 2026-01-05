const CACHE_NAME = "dear-miracle-v1";

const ASSETS = [
  "./", 
  "./index.html",
  "./manifest.webmanifest",
  "./mobile-fix_CLEAN.css",
  "./appicons/icon002sky_192.png",
  "./appicons/icon002sky_512.png"
  // 필요하면 이미지, js 파일 여기 추가
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});
