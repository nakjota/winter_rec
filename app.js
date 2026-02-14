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

// ---------- ツインジェスチャー：お題データ（2人向け寄せ） ----------
const PROMPTS = {
  ふつう: [
    "綱引き",
    "腕相撲",
    "二人で重い箱を運ぶ",
    "二人で机を運ぶ",
    "二人で傘に入る",
    "二人で自撮りを撮る",
    "握手して和解",
    "喧嘩して仲直り",
    "上司と部下",
    "先生と生徒",
    "面接官と就活生",
    "店員とクレーマー",
    "医者と患者",
    "美容師と客",
    "漫才（ボケとツッコミ）",
    "占い師と相談者",
    "コーチと選手",
    "審判と抗議する選手",
    "終電ダッシュの二人",
    "タクシーを奪い合う二人",
    "二人で乾杯",
    "酔って絡む／それをさばく",
    "飲み物を注いであげる",
    "口裏を合わせる",
    "二人で謝罪会見"
  ],
  大逆転: [
    "片方が嘘をついてて、もう片方が必死に合わせる",
    "片方が怒ってるのに、もう片方が全く気づいてない",
    "その場の空気を読んで話題を変える二人",
    "『今それ言う？』を目で止める",
    "二人だけが知ってる内輪ネタで盛り上がる",
    "目配せだけで意思疎通してる",
    "片方が酔ってないフリ、もう片方がそれを守る",
    "片方が記憶ないのに断言、もう片方が困る",
    "二人で“バレないように”静かに笑う",
    "二人で“やらかした事実”を隠蔽する",
    "気まずい沈黙を“笑い”に変えようとして失敗",
    "距離感を間違えて一気に気まずくなる",
    "『帰る？帰らない？』の駆け引き",
    "『奢るよ』と言った瞬間に後悔する",
    "写真を撮ったら思ったより盛れてなくて気まずい",
    "目が合って“笑ったら負け”が始まる"
  ]
};

// ---------- ツインジェスチャー：状態 ----------
const categorySelect = document.getElementById("categorySelect");
const promptText = document.getElementById("promptText");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnShuffle = document.getElementById("btnShuffle");
const btnHard = document.getElementById("btnHard");

let currentCategory = "ふつう";
let order = [];
let idx = 0;

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
  if (!list || list.length === 0) {
    promptText.textContent = "（お題なし）";
    return;
  }
  const realIndex = order[idx % order.length];
  promptText.textContent = list[realIndex];
}

categorySelect.addEventListener("change", () => {
  currentCategory = categorySelect.value;
  resetOrder();
});

btnNext.onclick = () => { idx++; setPrompt(); };
btnPrev.onclick = () => { idx = Math.max(0, idx - 1); setPrompt(); };
btnShuffle.onclick = () => { resetOrder(); };

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
