// dm-badge.js  (✅ 복붙용)
// 이 파일은 "쪽지 안읽음 뱃지"만 담당합니다.

import {
  getFirestore, collection, query, where, limit, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function startDMUnreadingBadge({
  db,
  getNick,
  badgeIds = [],     // ["inboxBadge", "homeBadge", ...]
  maxScan = 200,     // where(to==me) 결과를 최대 몇 개까지 훑을지
}) {
  let unsub = null;

  const setBadge = (count) => {
    badgeIds.forEach(id=>{
      const el = document.getElementById(id);
      if(!el) return;
      const n = Number(count || 0);
      if(n <= 0){
        el.textContent = "0";
        el.style.display = "none";
      }else if(n > 99){
        el.textContent = "99+";
        el.style.display = "inline-block";
      }else{
        el.textContent = String(n);
        el.style.display = "inline-block";
      }
    });
  };

  const stop = () => {
    if(unsub){ unsub(); unsub = null; }
  };

  const start = () => {
    stop();
    const me = (getNick?.() || "").trim();
    if(!me){ setBadge(0); return; }

    // ✅ 인덱스 회피: where만 걸고 JS에서 read===false 카운트
    const qy = query(collection(db, "messages"), where("to","==",me), limit(maxScan));

    unsub = onSnapshot(qy, (snap)=>{
      let unread = 0;
      snap.forEach(d=>{
        const m = d.data();
        if(m && m.read === false) unread += 1;
      });
      setBadge(unread);
    }, (err)=>{
      console.error("badge snapshot error:", err);
      setBadge(0);
    });
  };

  // 처음 한 번 시작
  start();

  return { start, stop };
}
