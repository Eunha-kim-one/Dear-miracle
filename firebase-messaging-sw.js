// firebase-messaging-sw.js
// =======================
// 야간 당직 직원 (푸시 전담)

// 설치되면 바로 대기 상태로
self.addEventListener("install", (event) => {
  console.log("[SW] install");
  self.skipWaiting();
});

// 활성화되면 모든 탭 제어
self.addEventListener("activate", (event) => {
  console.log("[SW] activate");
  event.waitUntil(self.clients.claim());
});
