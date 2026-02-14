// ==============================
// タブ切替
// ==============================
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

// ==============================
// 札（1/2/4）
// ==============================
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

// ==============================
// ツインジェスチャー：お題
// ※あなたの150個リストをここに入れてOK
// ==============================
const PROMPTS = {
  ふつう: [
    "ボクシング",
    "相撲",
    "柔道",
    "レスリング",
    "プロレス",
    "卓球",
    "テニス",
    "バドミントン",
    "サッカー",
    "野球",
    "バスケットボール",
    "バレーボール",
    "ラグビー",
    "ハンドボール",
    "アイスホッケー",
    "ドッジボール",
    "綱引き",
    "腕相撲",
    "指相撲",
    "じゃんけん",
    "鬼ごっこ",
    "かくれんぼ",
    "リレー",
    "PK戦",
    "ゴルフ",
    "ボウリング",
    "ビリヤード",
    "ダーツ",
    "空手",
    "剣道",
    "フェンシング",
    "弓道",
    "体操",
    "トランポリン",
    "スキー",
    "スノーボード",
    "サーフィン",
    "水泳",
    "スケートボード",
    "ボルダリング",

    "面接",
    "授業",
    "テスト",
    "発表",
    "自己紹介",
    "診察",
    "取り調べ",
    "記者会見",
    "謝罪会見",
    "プレゼン",
    "会議",
    "打ち合わせ",
    "乾杯",
    "誕生日会",
    "結婚式",
    "披露宴",
    "入学式",
    "卒業式",
    "入社式",
    "送別会",
    "歓迎会",
    "合コン",
    "カラオケ",
    "漫才",
    "コント",
    "ディベート",
    "表彰式",
    "開会式",
    "閉会式",
    "始球式",
    "抽選会",
    "ビンゴ大会",
    "写真撮影",
    "動画撮影",
    "実況",
    "罰ゲーム",
    "早食い",
    "早飲み",
    "ダンスバトル",
    "引っ越し",
    "買い物",
    "レジ",
    "注文",
    "料理対決",
    "掃除",
    "洗濯",
    "おんぶ",
    "仲直り",
    "説教",
    "交渉",

    "告白",
    "プロポーズ",
    "別れ話",
    "初デート",
    "映画デート",
    "三角関係",
    "遠距離恋愛",
    "浮気発覚",
    "復縁",
    "待ち合わせ",

    "海水浴",
    "キャンプ",
    "花火大会",
    "遊園地",
    "ジェットコースター",
    "観覧車",
    "動物園",
    "水族館",
    "雪合戦",
    "雪だるま",
    "プール",
    "釣り",
    "凧揚げ",
    "フラフープ",
    "シャボン玉",
    "テレビゲーム",
    "UNO",
    "オセロ",
    "将棋",
    "囲碁",
    "チェス",
    "人生ゲーム",
    "スマブラ",
    "マリオカート",
    "ポケモンバトル",
    "ヒーローショー",
    "戦隊ヒーロー",
    "悪役",
    "刑事",
    "犯人",
    "医者",
    "患者",
    "店員",
    "客",
    "先生",
    "生徒",
    "親子",
    "兄弟",
    "ライバル",
    "優勝",
    "決勝戦",
    "サプライズ",
    "ハイタッチ",
    "握手",
    "土下座",
    "インタビュー",
    "オーディション",
    "CM撮影",
    "ニュース番組",
    "料理番組",
    "スポーツ実況",
    "対決",
    "勝負"
  ],

  // 激ムズを使いたいならここに入れる
  大逆転: [
    "PK戦ラストキッカーとキーパー",
    "ブザービーター直前",
    "ドラフト1位指名直前",
    "最終面接結果発表",
    "緊急謝罪会見冒頭",
    "ドッキリ種明かし",
    "ニュース速報生放送",
    "優勝インタビュー直前",
    "涙の表彰式",
    "当落発表の瞬間"
  ]
};

// ==============================
// ツインジェスチャー：UI参照
// ==============================
const categorySelect = document.getElementById("categorySelect");
const teamSelect = document.getElementById("teamSelect");
const promptText = document.getElementById("promptText");
const statusLine = document.getElementById("statusLine");

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnShuffle = document.getElementById("btnShuffle");
const btnShowTeamLog = document.getElementById("btnShowTeamLog");
const btnShowAllLog = document.getElementById("btnShowAllLog");
const btnClearAll = document.getElementById("btnClearAll");

// ==============================
// 保存（localStorage）キー
// ==============================
const STORE_KEY = "gesture_state_v2";

// 状態：全チーム共通の使用済み + チーム別履歴
// used: { "category::prompt": true }
// logs: { "1": [{cat, text, ts}], "2": [...], "3": [...], "4": [...] }
// lastByTeam: { "1": {cat,text} ... }  ※表示用
function defaultState() {
  return {
    used: {},
    logs: { "1": [], "2": [], "3": [], "4": [] },
    lastByTeam: { "1": null, "2": null, "3": null, "4": null }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const s = JSON.parse(raw);
    // 足りないキー補完
    const d = defaultState();
    return {
      used: s.used || d.used,
      logs: s.logs || d.logs,
      lastByTeam: s.lastByTeam || d.lastByTeam
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

let state = loadState();

// ==============================
// カテゴリ初期化
// ==============================
function buildCategoryOptions() {
  categorySelect.innerHTML = "";
  Object.keys(PROMPTS).forEach((k) => {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = k;
    categorySelect.appendChild(opt);
  });
  // 初期は「ふつう」
  categorySelect.value = PROMPTS["ふつう"] ? "ふつう" : Object.keys(PROMPTS)[0];
}
buildCategoryOptions();

// ==============================
// 被りなし抽選（全チーム共通）
// ==============================
function keyOf(cat, text) {
  return `${cat}::${text}`;
}

function getUnusedCandidates(cat) {
  const list = PROMPTS[cat] || [];
  return list.filter((t) => !state.used[keyOf(cat, t)]);
}

// 「次へ」「ランダム」は同じ：未使用からランダムに1つ
function drawPrompt(cat) {
  const candidates = getUnusedCandidates(cat);
  if (candidates.length === 0) return null;
  const text = candidates[Math.floor(Math.random() * candidates.length)];
  return text;
}

function setStatus(msg) {
  statusLine.textContent = msg || "";
}

// ==============================
// 表示更新
// ==============================
function renderCurrentForTeam() {
  const team = teamSelect.value;
  const current = state.lastByTeam[team];
  if (!current) {
    promptText.textContent = "（お題を表示）";
    setStatus("");
    return;
  }
  promptText.textContent = current.text;
  const usedCount = Object.keys(state.used).length;
  setStatus(`チーム${team}：表示中 / 使用済み ${usedCount} 個`);
}

teamSelect.addEventListener("change", renderCurrentForTeam);

// ==============================
// お題を確定してログに積む
// ==============================
function commitPrompt(team, cat, text) {
  const k = keyOf(cat, text);
  state.used[k] = true;

  const entry = { cat, text, ts: Date.now() };
  state.logs[team].push(entry);
  state.lastByTeam[team] = { cat, text };

  saveState();
  renderCurrentForTeam();
}

// ==============================
// 次へ（被りなし）
// ==============================
function nextPrompt() {
  const team = teamSelect.value;
  const cat = categorySelect.value;

  const text = drawPrompt(cat);
  if (!text) {
    promptText.textContent = "（このカテゴリは出し切りました）";
    setStatus(`チーム${team}：このカテゴリは使用済みで空です`);
    return;
  }
  commitPrompt(team, cat, text);
}

btnNext.onclick = nextPrompt;
btnShuffle.onclick = nextPrompt;

// ==============================
// 戻る（1つ取り消し）
// ・そのチームの最新ログを1件戻す
// ・そのお題をusedから外す（= 他チームでも再び出る）
// ==============================
function undoLast() {
  const team = teamSelect.value;
  const arr = state.logs[team];
  if (!arr || arr.length === 0) {
    setStatus(`チーム${team}：戻れる履歴がありません`);
    return;
  }

  const last = arr.pop();
  // used解除（※他チームで同じお題が使われていたら本当は解除すべきでないが、
  // 今回は「同じ端末・運用」で、基本的に被りなしで進む前提なのでOK）
  delete state.used[keyOf(last.cat, last.text)];

  // lastByTeamを更新（1つ前があればそれ、なければnull）
  const prev = arr.length ? arr[arr.length - 1] : null;
  state.lastByTeam[team] = prev ? { cat: prev.cat, text: prev.text } : null;

  saveState();
  renderCurrentForTeam();
  setStatus(`チーム${team}：1つ戻しました`);
}

btnPrev.onclick = undoLast;

// ==============================
// 履歴表示
// ==============================
function formatTime(ts) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function showTeamLog() {
  const team = teamSelect.value;
  const arr = state.logs[team] || [];
  if (arr.length === 0) {
    alert(`チーム${team}の履歴：なし`);
    return;
  }
  const lines = arr.map((e, i) => `${i + 1}. [${e.cat}] ${e.text} (${formatTime(e.ts)})`);
  alert(`チーム${team}の履歴\n\n` + lines.join("\n"));
}

function showAllLog() {
  const out = [];
  for (const team of ["1", "2", "3", "4"]) {
    const arr = state.logs[team] || [];
    out.push(`--- チーム${team} ---`);
    if (arr.length === 0) out.push("（なし）");
    else {
      arr.forEach((e, i) => out.push(`${i + 1}. [${e.cat}] ${e.text}`));
    }
    out.push("");
  }
  alert(out.join("\n"));
}

btnShowTeamLog.onclick = showTeamLog;
btnShowAllLog.onclick = showAllLog;

// ==============================
// 全リセット
// ==============================
function clearAll() {
  const ok = confirm("全チームの履歴・使用済みを全部リセットします。よろしいですか？");
  if (!ok) return;
  state = defaultState();
  saveState();
  renderCurrentForTeam();
  setStatus("全リセットしました");
}

btnClearAll.onclick = clearAll;

// ==============================
// 初期描画
// ==============================
renderCurrentForTeam();

// ==============================
// 2分タイマー（元のまま）
// ==============================
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
function renderTimer() { timerEl.textContent = fmt(remaining); }
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
