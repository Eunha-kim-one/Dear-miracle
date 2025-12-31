// script.js
// - Extracted from index_MINIPLAYERFIX.html
// - Consolidated to keep index.html clean
// - Works for both desktop & mobile (mobile-only UI rules stay in mobile-fix.css)


// ===== Desktop / window system / YouTube window controls =====
(function(){
// ===== 창 드래그 + 앞으로 가져오기 + (첫 로딩) 화면별 자동 배치 =====
  const wins = Array.from(document.querySelectorAll(".win"));
  let topZ = 100;
  let hasUserMoved = false;

  function bringToFront(win){
    topZ += 1;
    win.style.zIndex = topZ;
    wins.forEach(w => w.classList.remove("is-front"));
    win.classList.add("is-front");
  }

  function clamp(n, min, max){ return Math.min(Math.max(n, min), max); }

  function place(win, x01, y01){
    const taskbar = document.querySelector(".taskbar");
    const taskH = taskbar ? taskbar.offsetHeight : 44;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const marginX = 18;
    const marginTop = 18;
    const marginBottom = taskH + 18;

    const w = win.offsetWidth;
    const h = win.offsetHeight;

    const usableW = vw - marginX*2 - w;
    const usableH = vh - marginTop - marginBottom - h;

    let left = marginX + (usableW * x01);
    let top  = marginTop + (usableH * y01);

    // 화면 밖으로 너무 나가지 않게
    const maxX = vw - 60;
    const maxY = vh - 120;
    left = clamp(left, -40, maxX);
    top  = clamp(top,  -20, maxY);

    win.style.left = left + "px";
    win.style.top  = top  + "px";
  }

  function autoLayout(){
    if(hasUserMoved) return;

    const byKey = {};
    wins.forEach(w => { byKey[w.dataset.key] = w; });

    const vw = window.innerWidth;

    // ===== PC (원래 버전) =====
    if(vw >= 1100){
 if(byKey.notice) place(byKey.notice, 0.02, 0.03);
  if(byKey.yt) place(byKey.yt, 0.05, 0.50);

      if(byKey.w1)     place(byKey.w1,     0.31, 0.02);
      if(byKey.w2)     place(byKey.w2,     0.50, 0.15);
      if(byKey.w3)     place(byKey.w3,     0.28, 0.42);

      if(byKey.w4)     place(byKey.w4,     0.05, 0.78);
      if(byKey.w5)     place(byKey.w5,     0.35, 0.95);

      if(byKey.w7)     place(byKey.w7,     0.78, 0.10);
      if(byKey.w6)     place(byKey.w6,     0.70, 0.45);
      if(byKey.w8)     place(byKey.w8,     0.88, 0.77);
      if(byKey.w10)    place(byKey.w10,    0.92, 0.66);
      if(byKey["dm-notice"]) place(byKey["dm-notice"], 0.92, 0.40);

      return;
    }

    // ===== 태블릿 (원래 버전) =====
    if(vw >= 700){
      if(byKey.notice) place(byKey.notice, 0.03, 0.03);
      if(byKey.yt)     place(byKey.yt,     0.03, 0.55);

      if(byKey.w1)     place(byKey.w1,     0.45, 0.10);
      if(byKey.w2)     place(byKey.w2,     0.45, 0.35);
      if(byKey.w3)     place(byKey.w3,     0.20, 0.30);

      if(byKey.w4)     place(byKey.w4,     0.03, 0.78);
      if(byKey.w5)     place(byKey.w5,     0.45, 0.78);

      if(byKey.w6)     place(byKey.w6,     0.70, 0.50);
      if(byKey.w7)     place(byKey.w7,     0.70, 0.05);
      if(byKey.w8)     place(byKey.w8,     0.70, 0.70);

      if(byKey.w10)    place(byKey.w10,    0.45, 0.60);
      return;
    }

    // ===== 모바일 (원래 버전) =====
    const order = ["notice","yt","w1","w2","w3","w4","w5","w6","w7","w8","w10","dm-notice"];
    let y = 0.03;
    order.forEach((k, i) => {
      const w = byKey[k];
      if(!w) return;
      place(w, (i % 2 ? 0.08 : 0.02), y);
      y += 0.07;
    });
  }

  // ===== 드래그 기능(에러 없이 정상) =====
  wins.forEach((win) => {
    const bar = win.querySelector(".titlebar");
    if(!bar) return;

    let dragging = false;
    let startX = 0, startY = 0;
    let winX = 0, winY = 0;

    bar.addEventListener("pointerdown", (e) => {
      dragging = true;
      hasUserMoved = true;
      bringToFront(win);

      startX = e.clientX;
      startY = e.clientY;

      winX = parseFloat(win.style.left) || win.offsetLeft;
      winY = parseFloat(win.style.top)  || win.offsetTop;

      bar.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    bar.addEventListener("pointermove", (e) => {
      if(!dragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let nx = winX + dx;
      let ny = winY + dy;

      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 120;
      nx = Math.min(Math.max(nx, -40), maxX);
      ny = Math.min(Math.max(ny, -20), maxY);

      win.style.left = nx + "px";
      win.style.top  = ny + "px";
    });

    bar.addEventListener("pointerup", () => dragging = false);
    bar.addEventListener("pointercancel", () => dragging = false);

    // 클릭만 해도 앞으로 오게
    win.addEventListener("pointerdown", ()=> bringToFront(win));
  });

 window.addEventListener("load", () => {
  autoLayout();
  // byKey 대신 실제 ID를 사용하는 방식으로 안전하게 변경
  const noticeWin = document.getElementById("notice"); 
  if (noticeWin) bringToFront(noticeWin);
});
  
  window.addEventListener("resize", () => autoLayout());

  // ===== 시계 =====
  const clock = document.getElementById("clock");
  function tick(){
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,"0");
    const mm = String(d.getMinutes()).padStart(2,"0");
    clock.textContent = `${hh}:${mm}`;
  }
  tick();
  setInterval(tick, 1000 * 10);

  // ===== 유튜브 소리 버튼(iframe src 토글) =====
  const ytFrame = document.getElementById("ytFrame");
  const soundBtn = document.getElementById("ytSoundBtn");
  let isMuted = true;
  if (soundBtn) soundBtn.innerHTML = "🔇 <span class=\"sound-label\">음소거 해제</span>";
  const _hint0 = document.getElementById("ytMuteHint");
  if (_hint0) _hint0.style.display = "block";

  soundBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const url = new URL(ytFrame.src);
    url.searchParams.set("mute", isMuted ? "0" : "1");
    ytFrame.src = url.toString();

    isMuted = !isMuted;
    soundBtn.innerHTML = isMuted ? "🔇 <span class=\"sound-label\">음소거 해제</span>" : "🔊 <span class=\"sound-label\">소리 끄기</span>";
    const hint = document.getElementById("ytMuteHint");
    if (hint) hint.style.display = isMuted ? "block" : "none";
  });
})();


// ===== Firebase (messenger / board) =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import {
      getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit,
      serverTimestamp, doc, updateDoc, onSnapshot
    } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

    // ✅ 동일해야 함
    const firebaseConfig = {
      apiKey: "AIzaSyA1PxEOrwjVi4BOLA13UbFIncTYe6RdYIQ",
      authDomain: "dear-miracle.firebaseapp.com",
      projectId: "dear-miracle",
      storageBucket: "dear-miracle.firebasestorage.app",
      messagingSenderId: "793139917614",
      appId: "1:793139917614:web:dec74f65af6a0df1c740bf",
      measurementId: "G-VF22L8ZR6D"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const $ = (id)=>document.getElementById(id);

    // ===== 닉네임 =====
    const NICK_KEY = "dm_nick";
    function getNick(){ return (localStorage.getItem(NICK_KEY) || "").trim(); }
    function setNick(n){ localStorage.setItem(NICK_KEY, (n||"").trim()); }

    function fmtTime(ts){
      if(!ts) return "";
      try{
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        const yy = String(d.getFullYear()).slice(2);
        const mm = String(d.getMonth()+1).padStart(2,"0");
        const dd = String(d.getDate()).padStart(2,"0");
        const hh = String(d.getHours()).padStart(2,"0");
        const mi = String(d.getMinutes()).padStart(2,"0");
        return `${yy}.${mm}.${dd} ${hh}:${mi}`;
      }catch{
        return "";
      }
    }

    // ===== UI =====
    const dmFabBtn = $("dmFabBtn");
    const dmBadge  = $("dmBadge");

    const dmBg = $("dmBg");
    const dmCloseBtn = $("dmCloseBtn");
    const dmRefresh = $("dmRefresh");
    const dmNickBtn = $("dmNickBtn");
    const dmHint = $("dmHint");

    const roomList = $("roomList");
    const roomHint = $("roomHint");

    const chatWith = $("chatWith");
    const chatHintTop = $("chatHintTop");
    const chatList = $("chatList");
    const chatInput = $("chatInput");
    const chatSend = $("chatSend");
    const chatBackBtn = $("chatBackBtn");

    // 닉 모달
    const nickBg = $("nickBg");
    const nickClose = $("nickClose");
    const nickInput = $("nickInput");
    const nickCancel = $("nickCancel");
    const nickSave = $("nickSave");
    const nickHint = $("nickHint");

    let currentPeer = "";
    let unsubRoomsA = null;
    let unsubRoomsB = null;
    let unsubChatA = null;
    let unsubChatB = null;
    let unsubBadge = null;

    function stopRooms(){
      if(unsubRoomsA) unsubRoomsA();
      if(unsubRoomsB) unsubRoomsB();
      unsubRoomsA = unsubRoomsB = null;
    }
    function stopChat(){
      if(unsubChatA) unsubChatA();
      if(unsubChatB) unsubChatB();
      unsubChatA = unsubChatB = null;
    }
    function stopBadge(){
      if(unsubBadge) unsubBadge();
      unsubBadge = null;
    }

    function showHint(s){ dmHint.textContent = s || ""; }

    function openNickModal(force=false){
      nickHint.textContent = "";
      nickInput.value = getNick();
      nickBg.style.display = "flex";
      nickClose.style.display = force ? "none" : "block";
      setTimeout(()=> nickInput.focus(), 30);
    }
    function closeNickModal(){
      nickBg.style.display = "none";
    }
    function ensureNick(){
      const n = getNick();
      if(!n){
        openNickModal(true);
        return false;
      }
      return true;
    }

    nickSave.addEventListener("click", ()=>{
      const val = (nickInput.value || "").trim();
      if(!val){
        nickHint.textContent = "닉네임을 입력해주세요.";
        return;
      }
      setNick(val);
      closeNickModal();
      startBadge(); // 닉 설정 후 뱃지 시작
    });
    nickCancel.addEventListener("click", ()=>{
      if(getNick()) closeNickModal();
      else nickHint.textContent = "닉네임을 입력해야 진행할 수 있습니다.";
    });
    nickClose.addEventListener("click", closeNickModal);
    nickBg.addEventListener("click", (e)=>{ if(e.target===nickBg && getNick()) closeNickModal(); });

    // ===== 안읽음 뱃지(진짜 read=false) =====
    function updateBadge(n){
      const num = Math.max(0, Number(n)||0);
      dmBadge.textContent = num > 99 ? "99+" : String(num);
      dmBadge.style.display = num > 0 ? "inline-flex" : "none";
    }

    function startBadge(){
      stopBadge();
      const me = getNick();
      if(!me){ updateBadge(0); return; }

      const qy = query(
        collection(db, "messages"),
        where("to", "==", me),
        where("read", "==", false)
      );

      unsubBadge = onSnapshot(qy, (snap)=>{
        updateBadge(snap.size);
      });
    }

    // ===== 모달 열기/닫기 =====
    function openDM(){
      if(!ensureNick()) return;
      dmBg.style.display = "flex";
      showHint("");
      showRooms();
      startRooms();
    }
    function closeDM(){
      dmBg.style.display = "none";
      showHint("");
      stopRooms();
      stopChat();
    }

    dmFabBtn.addEventListener("click", openDM);
    dmCloseBtn.addEventListener("click", closeDM);
    dmBg.addEventListener("click", (e)=>{ if(e.target===dmBg) closeDM(); });
    dmNickBtn.addEventListener("click", ()=> openNickModal(false));
    dmRefresh.addEventListener("click", ()=>{
      if(!ensureNick()) return;
      if(currentPeer){
        stopChat();
        startChat(currentPeer);
      }else{
        stopRooms();
        startRooms();
      }
    });

    function showRooms(){
      currentPeer = "";
      chatBackBtn.style.display = "none";
      chatWith.textContent = "대화를 선택하세요";
      chatHintTop.textContent = "";
      chatList.innerHTML = "";
      chatInput.value = "";
      roomHint.textContent = "";
    }

    function showChat(peer){
      currentPeer = peer;
      chatBackBtn.style.display = "inline-flex";
      chatWith.textContent = `상대: ${peer}`;
      chatHintTop.textContent = "";
      chatList.innerHTML = "";
      chatInput.value = "";
    }

    chatBackBtn.addEventListener("click", ()=>{
      stopChat();
      showRooms();
      startRooms();
    });

    // ===== 대화방 목록 실시간(받은+보낸 합쳐서 방 만들기) =====
    function renderRoomsFromMixed(all, me){
      roomList.innerHTML = "";
      if(all.length === 0){
        roomHint.textContent = "쪽지가 없습니다.";
        return;
      }

      // 최신순 정렬
      all.sort((a,b)=>{
        const at = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bt = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return bt - at;
      });

      // 상대방 기준 방 묶기 + 안읽음(상대->나 read=false) 카운트
      const rooms = new Map();
      const unreadCnt = new Map();

      for(const m of all){
        const peer = (m.from === me) ? (m.to || "") : (m.from || "");
        if(!peer) continue;

        // 최신 메시지 1개
        if(!rooms.has(peer)) rooms.set(peer, m);

        // 안읽음 카운트(상대가 보낸 것 중 read=false만)
        if(m.to === me && m.from === peer && m.read === false){
          unreadCnt.set(peer, (unreadCnt.get(peer)||0) + 1);
        }
      }

      const frag = document.createDocumentFragment();
      for(const [peer, lastMsg] of rooms.entries()){
        const div = document.createElement("div");
        div.className = "room";
        div.onclick = ()=>{
          stopRooms();
          showChat(peer);
          startChat(peer);
        };

        const left = document.createElement("div");
        left.style.minWidth = "0";

        const name = document.createElement("div");
        name.className = "name";
        name.textContent = peer;

        const last = document.createElement("div");
        last.className = "last";
        last.textContent = lastMsg.body || "";

        left.appendChild(name);
        left.appendChild(last);

        const right = document.createElement("div");
        right.className = "right";

        const time = document.createElement("div");
        time.className = "time";
        time.textContent = fmtTime(lastMsg.createdAt);

        const badge = document.createElement("div");
        badge.className = "unread";
        const n = unreadCnt.get(peer) || 0;
        badge.textContent = n > 99 ? "99+" : String(n);
        badge.style.display = n > 0 ? "inline-flex" : "none";

        right.appendChild(time);
        right.appendChild(badge);

        div.appendChild(left);
        div.appendChild(right);
        frag.appendChild(div);
      }

      roomList.appendChild(frag);
      roomHint.textContent = "";
    }

    function startRooms(){
      if(!ensureNick()) return;
      const me = getNick();
      roomHint.textContent = "불러오는 중…";
      roomList.innerHTML = "";

      stopRooms();

      const recvQ = query(
        collection(db, "messages"),
        where("to", "==", me),
        orderBy("createdAt", "desc"),
        limit(80)
      );
      const sentQ = query(
        collection(db, "messages"),
        where("from", "==", me),
        orderBy("createdAt", "desc"),
        limit(80)
      );

      let recvArr = [];
      let sentArr = [];

      unsubRoomsA = onSnapshot(recvQ, (snap)=>{
        recvArr = [];
        snap.forEach(d => recvArr.push({ id:d.id, ...d.data() }));
        renderRoomsFromMixed([...recvArr, ...sentArr], me);
      });

      unsubRoomsB = onSnapshot(sentQ, (snap)=>{
        sentArr = [];
        snap.forEach(d => sentArr.push({ id:d.id, ...d.data() }));
        renderRoomsFromMixed([...recvArr, ...sentArr], me);
      });
    }

    // ===== 읽음 처리: 내가 대화창 열면 상대->나 read=false 를 read=true로 =====
    async function markRead(peer){
      const me = getNick();
      const qy = query(
        collection(db, "messages"),
        where("from", "==", peer),
        where("to", "==", me),
        where("read", "==", false),
        limit(80)
      );
      const snap = await getDocs(qy);
      const jobs = [];
      snap.forEach(d=>{
        jobs.push(updateDoc(doc(db, "messages", d.id), { read:true }));
      });
      if(jobs.length) await Promise.all(jobs);
    }

    // ===== 대화 실시간(양쪽 쿼리 합쳐서 렌더) =====
    function startChat(peer){
      if(!ensureNick()) return;
      const me = getNick();

      stopChat();
      chatHintTop.textContent = "불러오는 중…";
      chatList.innerHTML = "";

      const aQ = query(
        collection(db, "messages"),
        where("from", "==", me),
        where("to", "==", peer),
        orderBy("createdAt", "desc"),
        limit(120)
      );
      const bQ = query(
        collection(db, "messages"),
        where("from", "==", peer),
        where("to", "==", me),
        orderBy("createdAt", "desc"),
        limit(120)
      );

      let aArr = [];
      let bArr = [];

      function render(){
        const all = [...aArr, ...bArr];
        if(all.length === 0){
          chatHintTop.textContent = "대화가 없습니다.";
          chatList.innerHTML = "";
          return;
        }

        all.sort((x,y)=>{
          const xt = x.createdAt?.toMillis ? x.createdAt.toMillis() : 0;
          const yt = y.createdAt?.toMillis ? y.createdAt.toMillis() : 0;
          return xt - yt;
        });

        chatList.innerHTML = "";
        const frag = document.createDocumentFragment();

        for(const m of all){
          const row = document.createElement("div");
          row.className = "chat-row";

          const bubble = document.createElement("div");
          bubble.className = "bubble" + (m.from === me ? " me" : "");
          bubble.textContent = m.body || "";

          const t = document.createElement("div");
          t.className = "t";
          t.textContent = `${m.from === me ? "나" : (m.from || "-")} · ${fmtTime(m.createdAt)}`;

          bubble.appendChild(t);
          row.appendChild(bubble);
          frag.appendChild(row);
        }

        chatList.appendChild(frag);
        chatHintTop.textContent = "";
        setTimeout(()=>{ chatList.scrollTop = chatList.scrollHeight; }, 0);
      }

      unsubChatA = onSnapshot(aQ, (snap)=>{
        aArr = [];
        snap.forEach(d => aArr.push({ id:d.id, ...d.data() }));
        render();
      });

      unsubChatB = onSnapshot(bQ, async (snap)=>{
        bArr = [];
        snap.forEach(d => bArr.push({ id:d.id, ...d.data() }));
        render();

        // 상대가 보낸 걸 읽음 처리
        try{ await markRead(peer); }catch(e){}
      });
    }

    // ===== 보내기 =====
    chatSend.addEventListener("click", async ()=>{
      if(!ensureNick()) return;
      const me = getNick();
      const peer = currentPeer;
      const body = (chatInput.value || "").trim();

      if(!peer){ showHint("대화 상대를 먼저 선택해주세요."); return; }
      if(!body){ showHint("내용을 입력해주세요."); return; }
      if(peer === me){ showHint("자기 자신에게는 보낼 수 없습니다."); return; }

      try{
        chatSend.disabled = true;
        showHint("전송 중…");

        await addDoc(collection(db, "messages"), {
          from: me,
          to: peer,
          body,
          postId: "",
          read: false,
          createdAt: serverTimestamp()
        });

        chatInput.value = "";
        showHint("");
      }catch(err){
        console.error(err);
        showHint("전송에 실패했습니다.");
      }finally{
        chatSend.disabled = false;
      }
    });

    // 엔터로 보내기(Shift+Enter는 줄바꿈)
    chatInput.addEventListener("keydown", (e)=>{
      if(e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        chatSend.click();
      }
    });

    // ===== 초기 구동 =====
    // 닉 있으면 뱃지 실시간 시작
    if(getNick()) startBadge();
  
/* ---- Mobile window layout polish (random overlap + bring key buttons forward) ---- */


// ===== Mobile wallpaper tap + one-time hint =====
const isMobile = () => window.matchMedia && window.matchMedia("(max-width: 768px)").matches;

const wallpapers = ["bg.png","bg.jpg","bg(1).png","img01.jpg","img02.jpg","img03.jpg","img04.jpg","img05.jpg","img06.jpg","img07.jpg","img08.jpg","img09.jpg"];

function pickNext(current){
  if(!wallpapers.length) return current || "";
  if(wallpapers.length === 1) return wallpapers[0];
  let next = current || "";
  let guard = 0;
  while(next === current && guard < 20){
    next = wallpapers[Math.floor(Math.random() * wallpapers.length)];
    guard++;
  }
  return next;
}

function setWallpaper(file){
  const el = document.querySelector(".wallpaper");
  if(!el || !file) return;
  el.style.backgroundImage = `url(${file})`;
  el.dataset.wallpaper = file;
}

function showHintOnce(){
  const hint = document.getElementById("mobileHint");
  if(!hint) return;

  if(!isMobile()){
    hint.classList.add("hidden");
    return;
  }
  const seen = localStorage.getItem("mobileHintSeen");
  if(seen === "1"){
    hint.classList.add("hidden");
    return;
  }
  hint.classList.remove("hidden");
}

function hideHint(){
  const hint = document.getElementById("mobileHint");
  if(!hint) return;
  hint.classList.add("hidden");
  try{ localStorage.setItem("mobileHintSeen","1"); }catch(e){}
}

function onBackgroundTap(e){
  if(!isMobile()) return;

  // If the tap started inside any window / floating UI, do nothing.
  const t = e && e.target;
  if(t && t.closest){
    if(t.closest(".win") || t.closest(".messenger-fab") || t.closest(".dm-fab") || t.closest(".taskbar")) return;
  }

  const wp = document.querySelector(".wallpaper");
  if(!wp) return;

  const cur = wp.dataset.wallpaper || "";
  const next = pickNext(cur);
  setWallpaper(next);
  hideHint();
}
document.addEventListener("DOMContentLoaded", () => {
  // only on mobile: set initial wallpaper + hint + tap handler
  if(isMobile()){
    setWallpaper(pickNext(""));
    showHintOnce();

    const wp = document.querySelector(".wallpaper");
    if(wp){
      // listen on document; ignore taps inside windows/buttons
      document.addEventListener("pointerdown", onBackgroundTap, {passive:true});
    }
  } else {
    // desktop: keep hint hidden
    const hint = document.getElementById("mobileHint");
    if(hint) hint.classList.add("hidden");
  }
});

=========================
Floating Stickers
========================= 
const STICKERS = ["assets/stickers/camera.png", 
"assets/stickers/flower-dot.png", 
"assets/stickers/headphone.png", 
"assets/stickers/video-tape.png", 
"assets/stickers/wings.png", 
"assets/stickers/radio.png", 
"assets/stickers/rainbow.png"
];


// 이 아래에 있는 rand, pick, spawnStickers 함수들은 그대로 두시면 됩니다!
function rand(min, max){ return Math.random() * (max - min) + min; }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function spawnStickers(){
  const layer = document.getElementById("sticker-layer");
  if(!layer) return;

  layer.innerHTML = "";

  const w = window.innerWidth;
  const h = window.innerHeight;
  const isMobile = w <= 768;

  const gapX = isMobile ? 110 : 150;
  const gapY = isMobile ? 140 : 180;
  const pad  = 24;

  const cols = Math.floor((w - pad * 2) / gapX);
  const rows = Math.floor((h - pad * 2) / gapY);

  for(let y = 0; y < rows; y++){
    for(let x = 0; x < cols; x++){
      if(Math.random() > 0.67) continue;

      const img = document.createElement("img");
      img.src = pick(STICKERS);
      img.className = `sticker v${Math.ceil(rand(1,3))}`;

      img.style.left = `${pad + x * gapX + rand(-14,14)}px`;
      img.style.top  = `${pad + y * gapY + rand(-18,18)}px`;

      layer.appendChild(img);
    }
  }
}

document.addEventListener("DOMContentLoaded", spawnStickers);
window.addEventListener("resize", spawnStickers);
