/* =========================
   ✅ FCM background (Service Worker)
   - This runs when the page is closed/backgrounded
========================= */

// Firebase compat (Service Worker에서 가장 덜 꼬이는 방식)
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// ⚠️ script.js에 있는 firebaseConfig와 동일해야 함
firebase.initializeApp({
  apiKey: "AIzaSyA1PxEOrwjVi4BOLA13UbFIncTYe6RdYIQ",
  authDomain: "dear-miracle.firebaseapp.com",
  projectId: "dear-miracle",
  storageBucket: "dear-miracle.firebasestorage.app",
  messagingSenderId: "793139917614",
  appId: "1:793139917614:web:dec74f65af6a0df1c740bf",
  measurementId: "G-VF22L8ZR6D"
});

const messaging = firebase.messaging();

// ✅ 백그라운드에서 푸시가 도착하면 알림 띄우기
messaging.onBackgroundMessage((payload) => {
  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    "Dear Miracle";

  const body =
    payload?.notification?.body ||
    payload?.data?.body ||
    "새 메시지가 도착했어요.";

  // 클릭 시 이동할 링크(나중에 DM 딥링크로 확장 가능)
  const url =
    payload?.data?.url ||
    "./";

  self.registration.showNotification(title, {
    body,
    icon: "./appicons/icon002sky_192.png",
    badge: "./appicons/icon002sky_192.png",
    data: { url }
  });
});

// ✅ 알림 클릭 → 앱(웹앱) 열기/포커스
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "./";

  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });

    // 이미 열려 있으면 포커스
    for (const client of allClients) {
      if ("focus" in client) {
        await client.focus();
        // 필요하면 여기서 특정 URL로 이동도 가능:
        // await client.navigate(url);
        return;
      }
    }

    // 없으면 새 창 열기
    if (clients.openWindow) {
      await clients.openWindow(url);
    }
  })());
});


const CACHE_NAME = "dear-miracle-v2";

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
