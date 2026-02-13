// ---------- 共通：タブ切替 ----------
const tabs = document.querySelectorAll(".tab");
const panels = {
  cards: document.getElementById("cards"),
  gesture: document.getElementById("gesture"),
};

tabs.forEach((t) => {
  t.addEventListener("click", () => {
    tabs.forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    const key = t.dataset.tab;
    Object.values(panels).forEach((p) => p.classList.remove("active"));
    panels[key].classList.add("active");
  });
});

// ---------- 札（1/2/4） ----------
const bigNumber = document.getElementById("bigNumber");
let numberHidden = false;

function setBigNumber(n) {
  bigNumber.textContent = String(n);
}
document.getElementById("btn1").onclick = () => setBigNumber(1);
document.getElementById("btn2").onclick = () => setBigNumber(2);
document.getElementById("btn4").onclick = () => setBigNumber(4);

document.getElementById("btnRandomCard").onclick = () => {
  const arr = [1, 2, 4];
  setBigNumber(arr[Math.floor(Math.random() * arr.length)]);
};

document.getElementById("btnHideNumber").onclick = () => {
  numberHidden = !numberHidden;
  bigNumber.style.visibility = numberHidden ? "hidden" : "visible";
};

// ---------- ツインジェスチャー：お題データ ----------
const PROMPTS = {
  ふつう: [
    "野球", "サッカー", "バスケ", "バレー", "釣り",
    "歯みがき", "シャワー", "スマホ打つ", "自撮り", "ゲームする",
    "電車に乗る", "寝坊", "テスト勉強", "プレゼン", "会議",
    "カラオケ", "お祭り", "花火", "海水浴", "雪だるま",
    "ラーメンを食べる", "寿司を食べる", "アイスを食べる", "コンビニ", "レジ打ち",
    "引っ越し", "掃除", "洗濯", "片付け", "料理",
    "筋トレ", "ランニング", "ストレッチ", "ヨガ", "登山",
    "面接", "謝る", "怒られる", "褒められる", "ドヤ顔",
    "二日酔い", "終電ダッシュ", "財布落とす", "酔って電話", "記憶ない"
  ],
  大逆転: [
    "『え、今それ言う？』って空気", 
    "酔ってないフリをする人", 
    "記憶ないのに断言する人",
    "テンションだけで乗り切るプレゼン",
    "気まずい沈黙を笑いで潰す",
    "『一杯だけ』が信用できない人",
    "グループLINE誤爆",
    "隣の部屋にバレないように盛り上がる",
    "『それ昨日も聞いた』を初めて聞く顔で聞く",
    "無言で察してほしいのに全く伝わらない"
  ]
};

// ---------- ツインジェスチャー：状態 ----------
const categorySelect = document.getElementById("categorySelect");
const promptText = document.getElementById("promptText");
const promptMask = document.getElementById("promptMask");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnShuffle = document.getElementById("btnShuffle");
const btnToggle = document.getElementById("btnToggle");
const btnHard = document.getElementById("btnHard");

let currentCategory = "ふつう";
let order = [];
let idx = 0;
let masked = true;

function buildCategoryOptions() {
  categorySelect.innerHTML = "";
  Object.keys(PROMPTS).forEach((k) => {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = k;
    categorySelect.appendChild(opt);
  });
  categorySelect.value = currentCategory;
}
buildCategoryOptions();

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function resetOrder() {
  order = PROMPTS[currentCategory].map((_, i) => i);
  shuffleArray(order);
  idx = 0;
  setPrompt();
}

function setPrompt() {
  const list = PROMPTS[currentCategory];
  if (!list.length) {
    promptText.textContent = "（お題なし）";
    return;
  }
  const realIndex = order[idx % order.length];
  promptText.textContent = list[realIndex];
  // デフォで隠す
  masked = true;
  promptMask.style.display = "flex";
}

categorySelect.addEventListener("change", () => {
  currentCategory = categorySelect.value;
  resetOrder();
});

btnNext.onclick = () => { idx++; setPrompt(); };
btnPrev.onclick = () => { idx = Math.max(0, idx - 1); setPrompt(); };
btnShuffle.onclick = () => { resetOrder(); };

function toggleMask() {
  masked = !masked;
  promptMask.style.display = masked ? "flex" : "none";
}
btnToggle.onclick = toggleMask;
promptMask.onclick = toggleMask;

btnHard.onclick = () => {
  currentCategory = (currentCategory === "大逆転") ? "ふつう" : "大逆転";
  categorySelect.value = currentCategory;
  resetOrder();
};

resetOrder();

// ---------- 2分タイマー ----------
const timerEl = document.getElementById("timer");
const btnStart = document.getElementById("btnStart");
const btnPause = document.getElementById("btnPause");
const btnReset = document.getElementById("btnReset");

let totalSeconds = 120;
let remaining = totalSeconds;
let timerId = null;

function fmt(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}
function renderTimer(){ timerEl.textContent = fmt(remaining); }
renderTimer();

function startTimer() {
  if (timerId) return;
  timerId = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      remaining = 0;
      renderTimer();
      clearInterval(timerId);
      timerId = null;
      // 時間切れで自動的にマスクON（司会向け）
      masked = true;
      promptMask.style.display = "flex";
      return;
    }
    renderTimer();
  }, 1000);
}
function pauseTimer() {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
}
function resetTimer() {
  pauseTimer();
  remaining = totalSeconds;
  renderTimer();
}

btnStart.onclick = startTimer;
btnPause.onclick = pauseTimer;
btnReset.onclick = resetTimer;
