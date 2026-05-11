/* ============================================================
   Bloom — js/app.js
   ============================================================ */

// ── Cursor ────────────────────────────────────────────────────────
const cursorEl      = document.getElementById('cursor');
const cursorTrailEl = document.getElementById('cursor-trail');
document.addEventListener('mousemove', e => {
  cursorEl.style.left      = e.clientX + 'px';
  cursorEl.style.top       = e.clientY + 'px';
  cursorTrailEl.style.left = e.clientX + 'px';
  cursorTrailEl.style.top  = e.clientY + 'px';
});
document.addEventListener('mousedown', () => cursorEl.style.transform = 'translate(-50%,-50%) scale(0.7)');
document.addEventListener('mouseup',   () => cursorEl.style.transform = 'translate(-50%,-50%) scale(1)');

// ── Parallax ──────────────────────────────────────────────────────
document.addEventListener('mousemove', e => {
  const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
  const cy = (e.clientY / window.innerHeight - 0.5) * 2;
  document.querySelectorAll('.float-img').forEach((el, i) => {
    const d = 0.008 + (i % 4) * 0.005;
    el.style.marginLeft = (cx * d * 80) + 'px';
    el.style.marginTop  = (cy * d * 50) + 'px';
  });
  document.getElementById('bg-layer').style.transform =
    `translate(${cx * 8}px, ${cy * 6}px) scale(1.02)`;
});

// ── Theme ─────────────────────────────────────────────────────────
const html     = document.documentElement;
const themeImg = document.getElementById('theme-icon-img');
function getSavedTheme() {
  return localStorage.getItem('bloom-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}
function applyTheme(t) {
  html.setAttribute('data-theme', t);
  themeImg.src = t === 'dark' ? 'assets/stickers/sun.png' : 'assets/stickers/moon.webp';
  localStorage.setItem('bloom-theme', t);
}
function toggleTheme() { applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
applyTheme(getSavedTheme());

// ── Modals ────────────────────────────────────────────────────────
document.getElementById('about-btn').addEventListener('click', () => openModal('about-modal'));
document.getElementById('designer-btn').addEventListener('click', () => openModal('designer-modal'));

function openModal(id) {
  document.getElementById(id).classList.add('show');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}
// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('show');
  });
});

// ── Sound effects ─────────────────────────────────────────────────
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTone(freq, type, duration, gainVal) {
  try {
    const ctx = getAudioCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + duration);
  } catch(e) {}
}
function playCastSpell() {
  playTone(523.25, 'sine', 0.4, 0.12);
  setTimeout(() => playTone(659.25, 'sine', 0.4, 0.10), 150);
  setTimeout(() => playTone(783.99, 'sine', 0.6, 0.08), 300);
}
function playSessionEnd() {
  playTone(880, 'sine', 1.2, 0.15);
  setTimeout(() => playTone(1046.5, 'sine', 1.0, 0.10), 300);
  setTimeout(() => playTone(880,    'sine', 1.5, 0.08), 600);
}
function playClick() { playTone(600, 'sine', 0.1, 0.04); }
function playLevelUp() {
  [523, 659, 784, 1047].forEach((f, i) =>
    setTimeout(() => playTone(f, 'sine', 0.5, 0.12), i * 120));
}
document.querySelectorAll('.btn, .tab, .lofi-btn, .theme-toggle, .icon-btn').forEach(b =>
  b.addEventListener('click', playClick));

// ── Floaties — TOP to BOTTOM, no butterfly/clover/iris ────────────
// Petals are weighted heavily for abundant blossom-falling effect
const BG_IMAGES = [
  { src:'assets/bg/flower1.png',    size:[60, 95] },
  { src:'assets/bg/flower2.webp',   size:[55, 90] },
  { src:'assets/bg/flower3.webp',   size:[50, 80] },
  { src:'assets/bg/flower4.webp',   size:[50, 80] },
  { src:'assets/bg/flower5.webp',   size:[55, 85] },
  { src:'assets/bg/flower6.webp',   size:[55, 90] },
  { src:'assets/bg/flower7.webp',   size:[50, 80] },
  { src:'assets/bg/flower9.webp',   size:[55, 88] },
  { src:'assets/bg/flower10.webp',  size:[50, 80] },
  { src:'assets/bg/blossom.webp',   size:[55, 85] },
  { src:'assets/bg/sunflower.webp', size:[55, 90] },
  { src:'assets/bg/leaf1.webp',     size:[45, 70] },
  { src:'assets/bg/leaf2.webp',     size:[40, 65] },
  // Petals appear 3x more than flowers for that abundant blossom effect
  { src:'assets/bg/petal1.webp',    size:[28, 46] },
  { src:'assets/bg/petal1.webp',    size:[24, 40] },
  { src:'assets/bg/petal1.webp',    size:[30, 48] },
  { src:'assets/bg/petal2.webp',    size:[26, 44] },
  { src:'assets/bg/petal2.webp',    size:[22, 38] },
  { src:'assets/bg/petal2.webp',    size:[28, 46] },
  { src:'assets/bg/petal3.webp',    size:[28, 48] },
  { src:'assets/bg/petal3.webp',    size:[24, 42] },
  { src:'assets/bg/petal3.webp',    size:[30, 50] },
  { src:'assets/bg/star2.webp',     size:[30, 50] },
  { src:'assets/bg/star3.png',      size:[26, 44] },
];

const floatiesEl = document.getElementById('floaties');

function spawnFloatie() {
  const cfg = BG_IMAGES[Math.floor(Math.random() * BG_IMAGES.length)];
  const el  = document.createElement('img');
  el.src = cfg.src; el.alt = ''; el.className = 'float-img';
  const size = cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0]);
  el.style.width = el.style.height = size + 'px';
  el.style.objectFit = 'contain';
  // Start from TOP (negative top position)
  el.style.left = (Math.random() * 100) + 'vw';
  el.style.top  = (-size - 20) + 'px';
  el.style.setProperty('--rot', ((Math.random() - 0.5) * 300) + 'deg');
  const dur = 9 + Math.random() * 12, delay = Math.random() * 4;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay   = delay + 's';
  floatiesEl.appendChild(el);
  setTimeout(() => el.remove(), (dur + delay + 1) * 1000);
}

// Spawn abundantly — petals weight means lots of petals
for (let i = 0; i < 18; i++) setTimeout(spawnFloatie, i * 250);
setInterval(spawnFloatie, 700); // faster spawn = more petals on screen

// ── Petal rain canvas (celebration) ──────────────────────────────
const petalCanvas = document.getElementById('petal-canvas');
const pctx        = petalCanvas.getContext('2d');
const PETAL_SRCS  = ['assets/bg/petal1.webp','assets/bg/petal2.webp','assets/bg/petal3.webp'];
const petalImgs   = PETAL_SRCS.map(s => { const i = new Image(); i.src = s; return i; });
let petals = [], petalRaf = null;

function resizePetalCanvas() { petalCanvas.width = window.innerWidth; petalCanvas.height = window.innerHeight; }
window.addEventListener('resize', resizePetalCanvas);
resizePetalCanvas();

function spawnPetals(count) {
  for (let i = 0; i < count; i++) {
    petals.push({
      img:      petalImgs[Math.floor(Math.random() * petalImgs.length)],
      x:        Math.random() * window.innerWidth,
      y:        -Math.random() * window.innerHeight * 0.4,
      size:     22 + Math.random() * 32,
      speedY:   1.0 + Math.random() * 2.0,
      speedX:   (Math.random() - 0.5) * 1.0,
      rot:      Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      opacity:  0.65 + Math.random() * 0.35,
      sway:     Math.random() * Math.PI * 2,
      swaySpeed:0.018 + Math.random() * 0.022,
    });
  }
}

function animatePetals() {
  pctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
  petals = petals.filter(p => p.y < petalCanvas.height + 80);
  petals.forEach(p => {
    p.sway += p.swaySpeed; p.x += p.speedX + Math.sin(p.sway) * 0.8;
    p.y += p.speedY; p.rot += p.rotSpeed;
    pctx.save();
    pctx.globalAlpha = p.opacity;
    pctx.translate(p.x + p.size / 2, p.y + p.size / 2);
    pctx.rotate(p.rot);
    try { pctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size); } catch(e) {}
    pctx.restore();
  });
  if (petals.length > 0) petalRaf = requestAnimationFrame(animatePetals);
  else { petalCanvas.classList.remove('active'); cancelAnimationFrame(petalRaf); }
}

function startPetalRain() {
  petalCanvas.classList.add('active');
  resizePetalCanvas();
  // 3 waves of petals for a lush blossom shower
  spawnPetals(80);
  setTimeout(() => spawnPetals(60), 800);
  setTimeout(() => spawnPetals(50), 1800);
  if (petalRaf) cancelAnimationFrame(petalRaf);
  petalRaf = requestAnimationFrame(animatePetals);
}

// ── Breathing ─────────────────────────────────────────────────────
let breathingTimer = null;
function startBreathing() {
  const task = document.getElementById('task-input').value.trim();
  if (!task) { document.getElementById('task-input').focus(); return; }
  playCastSpell();
  document.getElementById('breathing-overlay').classList.add('show');
  runBreathingCycle();
}
function runBreathingCycle() {
  const circle = document.getElementById('breathing-circle');
  const instr  = document.getElementById('breathing-instruction');
  const count  = document.getElementById('breathing-count');
  circle.classList.add('expand');
  instr.textContent = 'inhale...';
  let n = 4; count.textContent = n;
  const inhaleInt = setInterval(() => { n--; if (n <= 0) clearInterval(inhaleInt); else count.textContent = n; }, 1000);
  breathingTimer = setTimeout(() => {
    instr.textContent = 'hold...'; n = 4; count.textContent = n;
    const holdInt = setInterval(() => { n--; if (n <= 0) clearInterval(holdInt); else count.textContent = n; }, 1000);
    breathingTimer = setTimeout(() => {
      circle.classList.remove('expand');
      instr.textContent = 'exhale...'; n = 4; count.textContent = n;
      const exhaleInt = setInterval(() => { n--; if (n <= 0) clearInterval(exhaleInt); else count.textContent = n; }, 1000);
      breathingTimer = setTimeout(() => {
        document.getElementById('breathing-overlay').classList.remove('show');
        startFocus();
      }, 4200);
    }, 4200);
  }, 4200);
}
function skipBreathing() {
  clearTimeout(breathingTimer);
  document.getElementById('breathing-circle').classList.remove('expand');
  document.getElementById('breathing-overlay').classList.remove('show');
  startFocus();
}

// ── XP & Levels ───────────────────────────────────────────────────
const LEVELS = [
  { name:'Seedling',    xp:0,    img:'assets/stickers/seedling.png',    reward:'Welcome to the garden! Your journey begins here.' },
  { name:'Sprout',      xp:50,   img:'assets/stickers/blossom.webp',    reward:'You are putting down roots. New affirmations unlocked.' },
  { name:'Blooming',    xp:150,  img:'assets/bg/flower7.webp',          reward:'You are in full bloom. The garden sees your dedication.' },
  { name:'Flourishing', xp:300,  img:'assets/stickers/sunflower.webp',  reward:'Like a sunflower reaching for the light — keep shining.' },
  { name:'Enchanted',   xp:500,  img:'assets/stickers/clover.webp',     reward:'A four-leaf clover — rare and magical, just like you.' },
  { name:'Iris Queen',  xp:750,  img:'assets/stickers/iris.webp',       reward:'Standing tall and regal as an iris. Extraordinary.' },
  { name:'Fairy Queen', xp:1000, img:'assets/stickers/crown-gold.webp', reward:'The crown is yours, Fairy Queen. You are magnificent.' },
];

const XP_TABLE = { 5:10, 15:25, 25:40 };
let totalXP = parseInt(localStorage.getItem('bloom-xp') || '0', 10);
const CELEB_IMGS = ['assets/bg/flower5.webp','assets/bg/blossom.webp','assets/bg/flower9.webp','assets/bg/flower10.webp','assets/bg/petal1.webp','assets/bg/petal2.webp','assets/bg/star2.webp'];

function getCurrentLevelIdx() {
  let idx = 0;
  LEVELS.forEach((l, i) => { if (totalXP >= l.xp) idx = i; });
  return idx;
}
function getCurrentLevel() { return LEVELS[getCurrentLevelIdx()]; }
function getNextLevel()    { return LEVELS[getCurrentLevelIdx() + 1] || null; }

function renderXP() {
  const cur = getCurrentLevel(), next = getNextLevel();
  const pct = next ? Math.min(100, ((totalXP - cur.xp) / (next.xp - cur.xp)) * 100) : 100;
  document.getElementById('xp-fill').style.width       = pct + '%';
  document.getElementById('xp-level-name').textContent = cur.name;
  document.getElementById('xp-level-img').src          = cur.img;
  document.getElementById('xp-pts').textContent        = next
    ? `${totalXP} / ${next.xp} XP` : `${totalXP} XP — Fairy Queen!`;
}

function awardXP(amount) {
  const before = getCurrentLevelIdx();
  totalXP += amount;
  localStorage.setItem('bloom-xp', totalXP);
  renderXP();
  if (getCurrentLevelIdx() > before) { playLevelUp(); showLevelUp(LEVELS[getCurrentLevelIdx()]); }
}

function showLevelUp(level) {
  document.getElementById('levelup-img').src            = level.img;
  document.getElementById('levelup-name').textContent   = level.name;
  document.getElementById('levelup-reward').textContent = level.reward;
  const row = document.getElementById('levelup-flowers');
  row.innerHTML = '';
  CELEB_IMGS.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src; img.className = 'levelup-flower';
    img.style.animationDelay = (i * 0.07) + 's';
    row.appendChild(img);
  });
  document.getElementById('levelup-overlay').classList.add('show');
  for (let i = 0; i < 12; i++) setTimeout(spawnFloatie, i * 80);
}
function closeLevelUp() { document.getElementById('levelup-overlay').classList.remove('show'); }
renderXP();

// ── Affirmations ──────────────────────────────────────────────────
const AFFIRMATIONS_BY_TIER = [
  ["You don't have to do everything today. Just one thing.","Small steps still move you forward. Every one counts.","The fact that you're trying at all is enough.","Be as gentle with yourself as you are with others.","You showed up. That already took courage."],
  ["Your brain works differently, not wrongly. That's a gift.","Rest is not giving up. Rest is how you bloom.","You are allowed to take up space and take your time.","Messy progress is still progress. Keep going.","One thing at a time. That's all. Just one."],
  ["Your worth is not measured by your productivity.","Every task you finish is a tiny spell you cast on the world.","Breathe. You are right where you need to be.","Your nervous system is doing its best. So are you."],
  ["The garden grows at its own pace. So do you.","You have already overcome so much. Today is just another petal.","Your effort is quiet magic. Never doubt it."],
  ["Four leaves of luck — you've earned every one.","You are rare. You are enough. You are blooming."],
  ["Standing tall, rooted deep. That's you.","Royalty doesn't rush. You are exactly on time."],
  ["You are the magic the garden was waiting for.","Fairy Queen: you have bloomed into something magnificent."],
];

let lastAffirmIdx = -1;
function getAvailableAffirmations() {
  const lvlIdx = getCurrentLevelIdx();
  let pool = [];
  for (let i = 0; i <= Math.min(lvlIdx, AFFIRMATIONS_BY_TIER.length - 1); i++)
    pool = pool.concat(AFFIRMATIONS_BY_TIER[i]);
  return pool;
}
function newAffirmation() {
  const pool = getAvailableAffirmations();
  let idx;
  do { idx = Math.floor(Math.random() * pool.length); }
  while (idx === lastAffirmIdx && pool.length > 1);
  lastAffirmIdx = idx;
  const el = document.getElementById('affirmation-text');
  el.style.opacity = '0';
  setTimeout(() => { el.textContent = pool[idx]; el.style.opacity = '1'; }, 200);
}
document.getElementById('affirmation-text').style.transition = 'opacity .3s';
newAffirmation();

// ── Daily log ─────────────────────────────────────────────────────
const TODAY_KEY = new Date().toISOString().split('T')[0];
function getLog() {
  try {
    const raw = JSON.parse(localStorage.getItem('bloom-log') || 'null');
    if (!raw || raw.date !== TODAY_KEY) return { entries:[], note:'' };
    return raw;
  } catch { return { entries:[], note:'' }; }
}
function saveLog(data) { localStorage.setItem('bloom-log', JSON.stringify({ date:TODAY_KEY, ...data })); }

function addLogEntry(task, durationMins, xpGained) {
  const data = getLog(), now = new Date();
  data.entries.push({ task, durationMins, xpGained, time:now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}) });
  saveLog(data); renderLog();
}

// Use flower images instead of emoji icons for log items
const TASK_FLOWER = {
  write:'assets/bg/flower3.webp', read:'assets/bg/flower2.webp',
  study:'assets/bg/flower4.webp', code:'assets/bg/star2.webp',
  email:'assets/bg/blossom.webp', meet:'assets/bg/flower5.webp',
  research:'assets/bg/flower9.webp', draw:'assets/bg/flower6.webp',
  default:'assets/bg/flower10.webp',
};
function getTaskFlower(text) {
  const t = text.toLowerCase();
  for (const [k, v] of Object.entries(TASK_FLOWER)) { if (k !== 'default' && t.includes(k)) return v; }
  return TASK_FLOWER.default;
}

function renderLog() {
  const { entries } = getLog();
  const list = document.getElementById('log-list');
  list.innerHTML = '';
  if (!entries.length) { list.innerHTML = '<li class="log-empty">Nothing bloomed yet today</li>'; return; }
  [...entries].reverse().forEach(e => {
    const li = document.createElement('li');
    li.className = 'log-item';
    li.innerHTML = `<img src="${getTaskFlower(e.task)}" class="log-item-flower" alt=""><span class="log-item-text">${e.task}</span><span class="log-item-xp">+${e.xpGained} XP</span><span class="log-item-time">${e.time}</span>`;
    list.appendChild(li);
  });
}

function toggleLog() {
  const body  = document.getElementById('log-body');
  const arrow = document.getElementById('log-arrow-img');
  const hdr   = document.getElementById('log-header');
  const open  = body.classList.toggle('open');
  arrow.classList.toggle('open', open);
  hdr.setAttribute('aria-expanded', open);
  if (open) { renderLog(); loadJournalNote(); }
}

function loadJournalNote() {
  renderJournalEntries();
}

// ── Journal entries — Enter to submit, earns XP, resets after 24h ──
const JOURNAL_XP = 5; // XP per journal entry

function submitJournalEntry() {
  const input = document.getElementById('journal-input');
  const text  = input.value.trim();
  if (!text) { input.focus(); return; }

  const data = getLog();
  if (!data.journalEntries) data.journalEntries = [];

  const now = new Date();
  data.journalEntries.push({
    text,
    time: now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' }),
  });
  saveLog(data);

  // Clear input
  input.value = '';

  // Award XP for journaling
  awardXP(JOURNAL_XP);

  // Re-render
  renderJournalEntries();

  // Tiny celebration sound
  playTone(740, 'sine', 0.3, 0.08);
  setTimeout(() => playTone(880, 'sine', 0.3, 0.07), 150);

  // Brief flash on the submit button
  const btn = document.getElementById('journal-submit-btn');
  btn.style.transform = 'scale(1.3) rotate(20deg)';
  setTimeout(() => btn.style.transform = '', 300);
}

// Enter key submits journal
document.getElementById('journal-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); submitJournalEntry(); }
});

const JOURNAL_FLOWERS = [
  'assets/bg/flower10.webp','assets/bg/blossom.webp','assets/bg/flower9.webp',
  'assets/bg/flower5.webp','assets/bg/flower3.webp','assets/bg/petal2.webp',
];

function renderJournalEntries() {
  const { journalEntries } = getLog();
  const container = document.getElementById('journal-entries');
  if (!container) return;
  container.innerHTML = '';
  if (!journalEntries || !journalEntries.length) return;

  [...journalEntries].reverse().forEach((entry, i) => {
    const div = document.createElement('div');
    div.className = 'journal-entry';
    div.style.animationDelay = (i * 0.05) + 's';
    const flowerSrc = JOURNAL_FLOWERS[i % JOURNAL_FLOWERS.length];
    div.innerHTML = `
      <img src="${flowerSrc}" class="journal-entry-flower" alt="">
      <span class="journal-entry-text">${entry.text}</span>
      <span class="journal-entry-xp">+${JOURNAL_XP} XP</span>
      <span class="journal-entry-time">${entry.time}</span>
    `;
    container.appendChild(div);
  });
}
renderLog();

// Render saved journal entries on load (log section may be closed but entries load when opened)
// Also pre-render so they're ready when log opens
setTimeout(renderJournalEntries, 100);
let durationSecs = 25 * 60, durationMins = 25;
let startTime = null, pausedAt = null, pausedOffset = 0;
let tickInterval = null, running = false, paused = false;
let sessions = 0, currentTask = '';

function getRemainingMs() {
  if (!startTime) return durationSecs * 1000;
  return Math.max(0, durationSecs * 1000 - ((paused ? pausedAt : Date.now()) - startTime - pausedOffset));
}
function pad(n) { return String(n).padStart(2, '0'); }
function fmtSecs(s) { return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; }
function updateTimerDisplay() {
  const s    = Math.ceil(getRemainingMs() / 1000);
  document.getElementById('timer-digits').textContent = fmtSecs(s);
  const circ = 2 * Math.PI * 70;
  document.getElementById('timer-ring').style.strokeDasharray  = circ;
  document.getElementById('timer-ring').style.strokeDashoffset = circ * (1 - s / durationSecs);
}
function tick() {
  if (paused) return;
  updateTimerDisplay();
  if (getRemainingMs() <= 0) { clearInterval(tickInterval); running = false; celebrate(); }
}
function selectDuration(btn, mins) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  durationSecs = mins * 60; durationMins = mins;
}
function startFocus() {
  const task = document.getElementById('task-input').value.trim();
  if (!task) { document.getElementById('task-input').focus(); return; }
  currentTask = task; sessions++;
  document.getElementById('task-label').textContent     = task;
  document.getElementById('session-info').textContent   = `session ${sessions}`;
  document.getElementById('input-screen').style.display = 'none';
  document.getElementById('focus-screen').style.display  = 'block';
  document.getElementById('main-card').classList.add('timer-running');
  startTime = Date.now(); pausedOffset = 0; pausedAt = null; paused = false; running = true;
  document.getElementById('pause-btn').textContent = 'pause';
  updateTimerDisplay();
  clearInterval(tickInterval);
  tickInterval = setInterval(tick, 250);
}
function togglePause() {
  if (!running) return;
  paused = !paused;
  if (paused) {
    pausedAt = Date.now();
    document.getElementById('pause-btn').textContent = 'resume';
    document.getElementById('main-card').classList.remove('timer-running');
  } else {
    pausedOffset += Date.now() - pausedAt; pausedAt = null;
    document.getElementById('pause-btn').textContent = 'pause';
    document.getElementById('main-card').classList.add('timer-running');
  }
}
function resetAll() {
  clearInterval(tickInterval);
  running = false; paused = false; startTime = null; pausedOffset = 0; pausedAt = null;
  document.getElementById('main-card').classList.remove('timer-running');
  document.getElementById('celebration').classList.remove('show');
  document.getElementById('task-input').value             = '';
  document.getElementById('focus-screen').style.display   = 'none';
  document.getElementById('input-screen').style.display   = 'block';
  const circ = 2 * Math.PI * 70;
  document.getElementById('timer-ring').style.strokeDasharray  = circ;
  document.getElementById('timer-ring').style.strokeDashoffset = 0;
  document.getElementById('timer-digits').textContent = fmtSecs(durationSecs);
  petals = []; petalCanvas.classList.remove('active');
  newAffirmation();
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && running && !paused) updateTimerDisplay();
});

// ── Celebration ───────────────────────────────────────────────────
const CELEBRATE_MESSAGES = [
  "The fairies did a little dance just for you.<br>One task at a time — that's the cottage way.",
  "You tended to your garden so beautifully.<br>Now rest, dear one. You've earned it.",
  "A spell completed. The meadow glows brighter for it.",
  "Even the bees stopped to celebrate you today.",
  "The enchanted forest sees your hard work. You are doing wonderfully.",
  "Look at you — you actually did it. So proud.",
  "Another petal on your flower. You are blooming.",
];

function celebrate() {
  playSessionEnd();
  startPetalRain();
  const xpGain = XP_TABLE[durationMins] || 20;
  addLogEntry(currentTask, durationMins, xpGain);
  awardXP(xpGain);
  document.getElementById('celebrate-msg').innerHTML =
    CELEBRATE_MESSAGES[Math.floor(Math.random() * CELEBRATE_MESSAGES.length)];
  document.getElementById('xp-gained-badge').textContent = `+${xpGain} XP earned`;
  // Use real flower images instead of emojis
  const row = document.getElementById('flowers-row');
  row.innerHTML = '';
  const flowerSrcs = ['assets/bg/flower5.webp','assets/bg/blossom.webp','assets/bg/flower9.webp','assets/bg/flower10.webp','assets/bg/petal1.webp','assets/bg/petal2.webp','assets/bg/star2.webp','assets/bg/flower7.webp'];
  flowerSrcs.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src; img.className = 'celeb-petal';
    img.style.animationDelay = (i * 0.08) + 's';
    row.appendChild(img);
  });
  document.getElementById('main-card').classList.remove('timer-running');
  document.getElementById('celebration').classList.add('show');
}

// ── Lo-fi radio ───────────────────────────────────────────────────
// Using ice.somafm.com — the correct direct stream servers (updated May 2026)
// streams.somafm.com was the old format and is no longer reliable
const LOFI_STREAMS = [
  'https://ice5.somafm.com/lush-128-mp3',       // SomaFM Lush — main server
  'https://ice3.somafm.com/lush-128-mp3',       // SomaFM Lush — alt server
  'https://ice5.somafm.com/groovesalad-128-mp3',// SomaFM Groove Salad — main
  'https://ice3.somafm.com/groovesalad-128-mp3',// SomaFM Groove Salad — alt
  'https://ice5.somafm.com/dronezone-128-mp3',  // SomaFM Drone Zone — ambient
  'https://ice3.somafm.com/dronezone-128-mp3',  // SomaFM Drone Zone — alt
];
const LOFI_LABELS = [
  'ambient sounds for soft focus',
  'gentle music for gentle minds',
  'let the music carry you',
  'you are doing so well, keep going',
];
let audio = null, lofiPlaying = false, streamIdx = 0;
function buildAudio() {
  if (audio) { audio.pause(); audio = null; }
  audio = new Audio();
  // Don't set crossOrigin — SomaFM streams don't require it and it can block requests
  audio.volume = parseFloat(document.querySelector('.lofi-volume').value);
  audio.src    = LOFI_STREAMS[streamIdx];
  audio.onerror = () => {
    streamIdx++;
    if (streamIdx < LOFI_STREAMS.length) {
      // Try next stream
      buildAudio();
      audio.play().catch(() => {});
    } else {
      // All streams failed
      streamIdx = 0;
      setLofiState(false);
      document.getElementById('lofi-sub').textContent = 'open somafm.com/lush to listen';
    }
  };
  audio.onplaying = () => {
    document.getElementById('lofi-sub').textContent =
      LOFI_LABELS[Math.floor(Math.random() * LOFI_LABELS.length)];
  };
  audio.onstalled = () => {
    // Stream stalled — try next
    if (streamIdx < LOFI_STREAMS.length - 1) {
      streamIdx++;
      buildAudio();
      audio.play().catch(() => {});
    }
  };
}
function toggleLofi() {
  if (!lofiPlaying) {
    streamIdx = 0; // Always start from first (best) stream
    buildAudio();
    audio.play()
      .then(() => setLofiState(true))
      .catch(err => {
        // If file:// protocol blocks it, show helpful message
        if (location.protocol === 'file:') {
          document.getElementById('lofi-sub').textContent = 'host on a server to enable radio';
        } else {
          document.getElementById('lofi-sub').textContent = 'tap again to start';
        }
      });
  } else {
    audio.pause();
    setLofiState(false);
    document.getElementById('lofi-sub').textContent = 'paused — take a breath';
  }
}
function setLofiState(playing) {
  lofiPlaying = playing;
  document.getElementById('play-icon').innerHTML = playing ? '&#9646;&#9646;' : '&#9654;';
  document.getElementById('play-btn').classList.toggle('playing', playing);
  document.getElementById('lofi-radio-img').classList.toggle('playing', playing);
}
function setVolume(value) {
  if (audio) audio.volume = parseFloat(value);
}
document.addEventListener('visibilitychange', () => {
  if (!audio || !lofiPlaying) return;
  document.hidden ? audio.pause() : audio.play().catch(()=>{});
});
