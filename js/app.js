/* ============================================================
   Bloom — js/app.js
   ============================================================ */

// ── PWA Service Worker registration ──────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('[Bloom] Service worker registered:', reg.scope))
      .catch(err => console.log('[Bloom] Service worker failed:', err));
  });
}

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
document.getElementById('rest-btn').addEventListener('click', () => openModal('rest-modal'));
document.getElementById('feedback-btn').addEventListener('click', () => openModal('feedback-modal'));

// Soundscape button toggles the floating panel
document.getElementById('soundscape-btn').addEventListener('click', () => {
  const panel = document.getElementById('soundscape-panel');
  panel.classList.toggle('visible');
  playClick();
});
// Close soundscape panel when clicking elsewhere
document.addEventListener('click', e => {
  const panel = document.getElementById('soundscape-panel');
  const btn   = document.getElementById('soundscape-btn');
  if (panel.classList.contains('visible') && !panel.contains(e.target) && !btn.contains(e.target)) {
    panel.classList.remove('visible');
  }
});

// ── Seasonal themes ───────────────────────────────────────────────
const SEASONS = {
  spring: { months:[2,3,4],  name:'Spring', icon:'assets/stickers/cherry-blossom.png' },
  summer: { months:[5,6,7],  name:'Summer', icon:'assets/stickers/daisy.png'          },
  autumn: { months:[8,9,10], name:'Autumn', icon:'assets/stickers/maple-leaf.png'     },
  winter: { months:[11,0,1], name:'Winter', icon:'assets/stickers/pine-cone.png'      },
};

function getCurrentSeason() {
  const month = new Date().getMonth();
  return Object.entries(SEASONS).find(([,v]) => v.months.includes(month))?.[0] || 'spring';
}

function applySeason() {
  const season = getCurrentSeason();
  html.setAttribute('data-season', season);
  const info = SEASONS[season];
  // Add/update season chip
  let chip = document.querySelector('.season-chip');
  if (!chip) {
    chip = document.createElement('div');
    chip.className = 'season-chip';
    document.body.appendChild(chip);
  }
  chip.innerHTML = `<img src="${info.icon}" class="season-chip-icon" alt="${info.name}"><span>${info.name}</span>`;
}
applySeason();

// ── Task suggestions (rotating placeholder) ───────────────────────
const TASK_SUGGESTIONS = [
  'write one paragraph...',
  'reply to that email...',
  'read for 15 minutes...',
  'sketch one idea...',
  'review your notes...',
  'tidy one small thing...',
  'make that one call...',
  'finish that one slide...',
  'water your plants...',
  'stretch for 5 minutes...',
];
let suggestionIdx = 0;
const taskInput = document.getElementById('task-input');

function rotateSuggestion() {
  if (document.activeElement !== taskInput && !taskInput.value) {
    suggestionIdx = (suggestionIdx + 1) % TASK_SUGGESTIONS.length;
    taskInput.placeholder = `e.g. ${TASK_SUGGESTIONS[suggestionIdx]}`;
  }
}
setInterval(rotateSuggestion, 3000);

// ── Nature soundscape engine — real looping MP3s ─────────────────
const SOUNDSCAPE_FILES = {
  rain:      'assets/sounds/rain.mp3',
  forest:    'assets/sounds/forest.mp3',
  birds:     'assets/sounds/birds.mp3',
  stream:    'assets/sounds/stream.mp3',
  wind:      'assets/sounds/wind.mp3',
  fireplace: 'assets/sounds/fireplace.mp3',
};
const SOUNDSCAPE_NAMES = {
  rain:'Gentle Rain', forest:'Forest', birds:'Birds',
  stream:'Stream', wind:'Wind', fireplace:'Fireplace',
};

let scAudio = null, scPlaying = null;

function stopSoundscape() {
  if (scAudio) { scAudio.pause(); scAudio.currentTime = 0; scAudio = null; }
  scPlaying = null;
  document.querySelectorAll('.sc-panel-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sc-now-playing').style.display = 'none';
}

function setSoundscapeVolume(v) {
  if (scAudio) scAudio.volume = parseFloat(v);
}

function playSoundscape(type) {
  stopSoundscape();
  scPlaying = type;

  scAudio        = new Audio(SOUNDSCAPE_FILES[type]);
  scAudio.loop   = true;
  scAudio.volume = parseFloat(document.querySelector('.sc-vol-slider').value);

  // Keep audio playing in background tabs by preventing Chrome from
  // suspending it — we request a Wake Lock style hint via playing
  // immediately on user gesture and never pausing on visibility change
  scAudio.play().catch(() => {
    document.getElementById('sc-playing-text').textContent = 'tap again to start';
    document.getElementById('sc-now-playing').style.display = 'flex';
  });

  document.querySelectorAll('.sc-panel-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(`sc-${type}`);
  if (activeBtn) activeBtn.classList.add('active');
  document.getElementById('sc-now-playing').style.display = 'flex';
  document.getElementById('sc-playing-text').textContent =
    `${SOUNDSCAPE_NAMES[type]} is playing`;
}

// DO NOT pause on visibility change — let it play in background!!
// Chrome allows audio to continue if it was started by a user gesture,
// which it always is since the user clicked a soundscape button.


// ── Rest mode ────────────────────────────────────────────────────
const REST_XP = { 5:5, 10:8, 20:12 };
let restInterval = null, restRemaining = 0;

function startRest(mins) {
  closeModal('rest-modal');
  restRemaining = mins * 60;
  document.getElementById('rest-overlay').classList.add('show');
  updateRestDisplay();
  clearInterval(restInterval);
  restInterval = setInterval(() => {
    restRemaining--;
    updateRestDisplay();
    if (restRemaining <= 0) { clearInterval(restInterval); endRest(mins); }
  }, 1000);
  playTone(440, 'sine', 0.8, 0.08);
  setTimeout(() => playTone(550, 'sine', 0.8, 0.06), 400);
}

function updateRestDisplay() {
  document.getElementById('rest-digits').textContent =
    `${pad(Math.floor(restRemaining/60))}:${pad(restRemaining%60)}`;
}

function endRest(mins) {
  clearInterval(restInterval);
  document.getElementById('rest-overlay').classList.remove('show');
  const xpGain = REST_XP[mins] || 5;
  awardXP(xpGain);
  addLogEntry('rest', mins || Math.round((restRemaining)/60), xpGain);
  playTone(523, 'sine', 0.6, 0.1);
  setTimeout(() => playTone(659, 'sine', 0.6, 0.08), 200);
}

// ── Lifetime stats (added to weekly stats modal) ──────────────────
function getLifetimeStats() {
  const xp      = parseInt(localStorage.getItem('bloom-xp') || '0', 10);
  let sessions  = 0, minutes = 0, journalCount = 0;
  try {
    // Today's log
    const today = JSON.parse(localStorage.getItem('bloom-log') || 'null');
    if (today) {
      sessions     += (today.entries || []).length;
      minutes      += (today.entries || []).reduce((s,e) => s + (e.durationMins||0), 0);
      journalCount += (today.journalEntries || []).length;
    }
    // History
    const hist = JSON.parse(localStorage.getItem('bloom-history') || '{}');
    Object.values(hist).forEach(day => {
      sessions     += (day.entries || []).length;
      minutes      += (day.entries || []).reduce((s,e) => s + (e.durationMins||0), 0);
      journalCount += (day.journalEntries || []).length;
    });
  } catch(e) {}
  return { xp, sessions, minutes, journalCount };
}

// Inject lifetime stats into the stats modal after it's built
const _origBuildWeekly = buildWeeklyStats;
buildWeeklyStats = function() {
  _origBuildWeekly();
  // Add lifetime stats section if not already there
  let lifetimeSection = document.getElementById('lifetime-section');
  if (!lifetimeSection) {
    lifetimeSection = document.createElement('div');
    lifetimeSection.id = 'lifetime-section';
    lifetimeSection.className = 'lifetime-section';
    document.querySelector('.backup-section').before(lifetimeSection);
  }
  const { xp, sessions, minutes, journalCount } = getLifetimeStats();
  lifetimeSection.innerHTML = `
    <p class="stats-section-title">
      <img src="assets/stickers/lifetime-stats.png" class="stats-title-icon" alt="">
      all time
    </p>
    <div class="lifetime-grid">
      <div class="stats-summary-card">
        <img src="assets/stickers/trophy.png" class="stats-summary-icon" alt="">
        <span class="stats-summary-num">${sessions}</span>
        <span class="stats-summary-label">total sessions</span>
      </div>
      <div class="stats-summary-card">
        <img src="assets/stickers/chart.png" class="stats-summary-icon" alt="">
        <span class="stats-summary-num">${minutes}</span>
        <span class="stats-summary-label">min focused</span>
      </div>
      <div class="stats-summary-card">
        <img src="assets/stickers/favorite.png" class="stats-summary-icon" alt="">
        <span class="stats-summary-num">${journalCount}</span>
        <span class="stats-summary-label">journal entries</span>
      </div>
    </div>
  `;
};

function openModal(id) {
  document.getElementById(id).classList.add('show');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('show');
  });
});

function toggleStatsPanel() {
  buildWeeklyStats();
  openModal('stats-modal');
  playClick();
}

// ── Draggable panels & XP bar ─────────────────────────────────────
//
// Makes any element draggable by its drag-handle child (or itself).
// Works on both mouse and touch (mobile friendly!).
// Saves position to localStorage so it persists between sessions.

function makeDraggable(el, storageKey, handleSelector) {
  let isDragging = false;
  let hasMoved   = false;  // ← key fix: track if mouse actually moved
  let startX, startY, origLeft, origTop;

  // Try to restore saved position
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved) {
      el.style.left      = saved.left;
      el.style.top       = saved.top;
      el.style.right     = 'auto';
      el.style.bottom    = 'auto';
      el.style.transform = 'none';
      el.dataset.dragged = '1';
    }
  } catch(e) {}

  const handle = handleSelector ? el.querySelector(handleSelector) : el;
  if (!handle) return;

  handle.style.cursor = 'grab';

  function onStart(e) {
    // Don't start drag if clicking a button, input or anchor inside the panel
    if (e.target.closest('button, input, a, label, select')) return;

    isDragging = true;
    hasMoved   = false;
    handle.style.cursor = 'grabbing';

    const rect = el.getBoundingClientRect();
    origLeft = rect.left;
    origTop  = rect.top;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = clientX - origLeft;
    startY = clientY - origTop;

    e.stopPropagation();
  }

  function onMove(e) {
    if (!isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = Math.abs(clientX - (startX + origLeft));
    const dy = Math.abs(clientY - (startY + origTop));

    // Only start actually moving after 5px threshold
    if (!hasMoved && dx < 5 && dy < 5) return;
    hasMoved = true;

    // Now anchor element at absolute position (only once)
    if (el.style.position !== 'fixed' || !el.dataset.anchored) {
      el.style.left      = origLeft + 'px';
      el.style.top       = origTop  + 'px';
      el.style.right     = 'auto';
      el.style.bottom    = 'auto';
      el.style.transform = 'none';
      el.style.transition = 'none';
      el.dataset.anchored = '1';
    }

    const maxX = window.innerWidth  - el.offsetWidth  - 10;
    const maxY = window.innerHeight - el.offsetHeight - 10;
    const newX = Math.max(10, Math.min(maxX, clientX - startX));
    const newY = Math.max(10, Math.min(maxY, clientY - startY));

    el.style.left = newX + 'px';
    el.style.top  = newY + 'px';

    e.preventDefault();
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    handle.style.cursor = 'grab';
    el.style.transition = '';
    el.dataset.anchored = '';

    if (hasMoved) {
      el.dataset.dragged = '1';
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          left: el.style.left,
          top:  el.style.top,
        }));
      } catch(e) {}
    }
  }

  handle.addEventListener('mousedown',  onStart);
  document.addEventListener('mousemove', onMove, { passive:false });
  document.addEventListener('mouseup',   onEnd);
  handle.addEventListener('touchstart', onStart, { passive:true });
  document.addEventListener('touchmove', onMove,  { passive:false });
  document.addEventListener('touchend',  onEnd);
}

// Apply draggable to soundscape panel, lo-fi player, and XP bar
makeDraggable(
  document.getElementById('soundscape-panel'),
  'bloom-sc-pos',
  '.soundscape-panel-title'
);
makeDraggable(
  document.querySelector('.lofi-player'),
  'bloom-lofi-pos',
  '.lofi-inner'
);
makeDraggable(
  document.querySelector('.xp-bar-wrap'),
  'bloom-xp-pos',
  null
);


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
  { src:'assets/bg/flower11.png',   size:[45, 72] },
  { src:'assets/bg/flower12.png',   size:[50, 78] },
  { src:'assets/bg/flower14.png',   size:[48, 75] },
  { src:'assets/bg/flower15.png',   size:[45, 72] },
  { src:'assets/bg/flower16.png',   size:[50, 80] },
  { src:'assets/bg/flower17.png',   size:[48, 78] },
  { src:'assets/bg/sparkle1.png',   size:[25, 40] },
  { src:'assets/bg/sparkle2.png',   size:[28, 44] },
  { src:'assets/bg/sparkle3.png',   size:[25, 40] },
  { src:'assets/bg/sparkle4.png',   size:[28, 44] },
  { src:'assets/bg/star2.webp',     size:[30, 50] },
  { src:'assets/bg/star3.png',      size:[26, 44] },
];

// Add season-specific floaties dynamically
const season = getCurrentSeason();
const SEASONAL_EXTRAS = {
  spring: [
    { src:'assets/stickers/cherry-blossom.png', size:[40,65] },
    { src:'assets/stickers/cherry-blossom.png', size:[35,55] },
  ],
  summer: [
    { src:'assets/stickers/daisy.png', size:[40,65] },
    { src:'assets/stickers/daisy.png', size:[35,55] },
  ],
  autumn: [
    { src:'assets/stickers/maple-leaf.png', size:[40,65] },
    { src:'assets/stickers/maple-leaf.png', size:[35,55] },
  ],
  winter: [
    { src:'assets/stickers/snowflake.png', size:[35,55] },
    { src:'assets/stickers/snowflake.png', size:[30,50] },
    { src:'assets/stickers/pine-cone.png', size:[30,50] },
  ],
};
if (SEASONAL_EXTRAS[season]) {
  BG_IMAGES.push(...SEASONAL_EXTRAS[season]);
}

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

document.getElementById('stats-btn').addEventListener('click', () => {
  toggleStatsPanel();
});

// ── Weekly Stats Engine ───────────────────────────────────────────

// Flowers for each day's bar — ordered by how "big" the day was
const BAR_FLOWERS = [
  'assets/bg/flower13.png',  // sunflower — big day
  'assets/bg/flower17.png',  // hibiscus
  'assets/bg/flower16.png',  // lotus
  'assets/bg/flower5.webp',  // dahlia
  'assets/bg/flower9.webp',  // pink flower
  'assets/bg/flower3.webp',  // cosmos
  'assets/bg/flower12.png',  // small flower — quiet day
];
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const FULL_DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const JOURNAL_FLOWERS_STATS = [
  'assets/bg/flower10.webp','assets/bg/blossom.webp','assets/bg/flower5.webp',
  'assets/bg/petal2.webp','assets/bg/flower3.webp',
];

function getWeekData() {
  // Build 7 days ending today
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    // Try to load saved data for this day
    let entries = [], journalEntries = [], note = '';
    try {
      const raw = JSON.parse(localStorage.getItem('bloom-log') || 'null');
      if (raw && raw.date === key) {
        entries        = raw.entries        || [];
        journalEntries = raw.journalEntries || [];
        note           = raw.note           || '';
      }
    } catch(e) {}
    // Also check bloom-history for past days
    try {
      const hist = JSON.parse(localStorage.getItem('bloom-history') || '{}');
      if (hist[key]) {
        entries        = hist[key].entries        || [];
        journalEntries = hist[key].journalEntries || [];
      }
    } catch(e) {}

    const totalMins = entries.reduce((sum, e) => sum + (e.durationMins || 0), 0);
    const totalXP   = entries.reduce((sum, e) => sum + (e.xpGained    || 0), 0)
                    + journalEntries.length * 5;
    days.push({
      date: d, key, dayName: DAY_NAMES[d.getDay()],
      fullName: FULL_DAYS[d.getDay()],
      isToday: i === 0,
      entries, journalEntries,
      totalMins, totalXP,
      bloomed: entries.length > 0 || journalEntries.length > 0,
    });
  }
  return days;
}

function getStreak() {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    let bloomed = false;
    try {
      if (key === TODAY_KEY) {
        const raw = JSON.parse(localStorage.getItem('bloom-log') || 'null');
        bloomed = raw && (raw.entries?.length > 0 || raw.journalEntries?.length > 0);
      } else {
        const hist = JSON.parse(localStorage.getItem('bloom-history') || '{}');
        const day  = hist[key];
        bloomed = day && (day.entries?.length > 0 || day.journalEntries?.length > 0);
      }
    } catch(e) {}
    if (bloomed) streak++;
    else if (i > 0) break; // gap — stop counting
  }
  return streak;
}

function buildWeeklyStats() {
  const days     = getWeekData();
  const maxMins  = Math.max(...days.map(d => d.totalMins), 1);
  const weekXP   = days.reduce((s, d) => s + d.totalXP, 0);
  const weekSess = days.reduce((s, d) => s + d.entries.length, 0);
  const weekMins = days.reduce((s, d) => s + d.totalMins, 0);
  const streak   = getStreak();
  const bestDay  = days.reduce((best, d) => d.totalMins > best.totalMins ? d : best, days[0]);

  // Dates header
  const first = days[0].date, last = days[6].date;
  document.getElementById('stats-dates').textContent =
    `${first.toLocaleDateString('en-US',{month:'short',day:'numeric'})} — ${last.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`;

  // Summary
  document.getElementById('streak-num').textContent      = streak;
  document.getElementById('week-xp-num').textContent     = weekXP;
  document.getElementById('week-sessions-num').textContent = weekSess;
  document.getElementById('week-mins-num').textContent   = weekMins;

  // Flower bar chart
  const chart  = document.getElementById('stats-chart');
  const labels = document.getElementById('stats-chart-labels');
  chart.innerHTML = ''; labels.innerHTML = '';

  days.forEach((day, i) => {
    const pct      = day.totalMins / maxMins;
    const imgH     = Math.max(28, Math.round(pct * 90));
    const isEmpty  = day.totalMins === 0;
    // Pick flower based on how productive the day was
    const flowerIdx = isEmpty ? -1 : Math.floor((1 - pct) * (BAR_FLOWERS.length - 1));
    const flowerSrc = isEmpty ? 'assets/stickers/snail.png' : BAR_FLOWERS[Math.max(0, flowerIdx)];

    const wrap = document.createElement('div');
    wrap.className = 'chart-bar-wrap';
    wrap.innerHTML = `
      <div class="chart-bar" style="height:${Math.max(28, imgH)}px">
        <img src="${flowerSrc}" class="chart-bar-flower${isEmpty?' snail':''}"
             style="height:${Math.max(28,imgH)}px; width:auto;" alt="${day.dayName}">
      </div>
      <span class="chart-bar-mins">${day.totalMins > 0 ? day.totalMins+'m' : ''}</span>
    `;
    chart.appendChild(wrap);

    const lbl = document.createElement('div');
    lbl.className = 'chart-label' + (day.isToday ? ' today' : '');
    lbl.textContent = day.isToday ? 'today' : day.dayName;
    labels.appendChild(lbl);
  });

  // Best day highlight
  const highlight = document.getElementById('stats-highlight');
  if (bestDay.totalMins > 0) {
    highlight.style.display = 'flex';
    document.getElementById('highlight-day').textContent =
      `${bestDay.fullName} — ${bestDay.totalMins} min focused, +${bestDay.totalXP} XP`;
  } else {
    highlight.style.display = 'none';
  }

  // Ladybug daily badges
  const badgeRow = document.getElementById('badge-row');
  badgeRow.innerHTML = '';
  days.forEach((day, i) => {
    const badge = document.createElement('div');
    badge.className = 'day-badge' + (day.bloomed ? '' : ' empty');
    badge.style.animationDelay = (i * 0.06) + 's';
    badge.innerHTML = `
      <img src="${day.bloomed ? 'assets/stickers/ladybug.png' : 'assets/bg/petal1.webp'}"
           class="day-badge-img" alt="${day.dayName}">
      <span class="day-badge-name">${day.isToday ? 'today' : day.dayName}</span>
    `;
    badgeRow.appendChild(badge);
  });

  // Journal highlights — collect all journal entries from the week
  const journalList = document.getElementById('stats-journal-list');
  journalList.innerHTML = '';
  const allJournal = [];
  days.forEach(day => {
    (day.journalEntries || []).forEach(e => {
      allJournal.push({ ...e, dayName: day.isToday ? 'today' : day.dayName });
    });
  });
  if (!allJournal.length) {
    journalList.innerHTML = '<p class="stats-journal-empty">No journal entries this week yet</p>';
  } else {
    [...allJournal].reverse().slice(0, 8).forEach((e, i) => {
      const div = document.createElement('div');
      div.className = 'stats-journal-item';
      const src = JOURNAL_FLOWERS_STATS[i % JOURNAL_FLOWERS_STATS.length];
      div.innerHTML = `<img src="${src}" class="stats-journal-flower" alt=""><span>${e.text}</span>`;
      journalList.appendChild(div);
    });
  }
}

// ── Save history daily so weekly stats can look back ─────────────
// Called once on load — archives yesterday's log into bloom-history
function archiveYesterdayIfNeeded() {
  try {
    const raw = JSON.parse(localStorage.getItem('bloom-log') || 'null');
    if (!raw || raw.date === TODAY_KEY) return; // today or empty
    // It's a past day — archive it
    const hist = JSON.parse(localStorage.getItem('bloom-history') || '{}');
    if (!hist[raw.date]) {
      hist[raw.date] = { entries: raw.entries || [], journalEntries: raw.journalEntries || [] };
      // Keep only last 30 days to avoid storage bloat
      const keys = Object.keys(hist).sort().reverse().slice(0, 30);
      const trimmed = {};
      keys.forEach(k => trimmed[k] = hist[k]);
      localStorage.setItem('bloom-history', JSON.stringify(trimmed));
    }
  } catch(e) {}
}
archiveYesterdayIfNeeded();

// ── Export / Import backup ────────────────────────────────────────
function exportBloom() {
  const data = {
    version:    '1.0',
    exportedAt: new Date().toISOString(),
    xp:         localStorage.getItem('bloom-xp')      || '0',
    theme:      localStorage.getItem('bloom-theme')   || 'light',
    log:        localStorage.getItem('bloom-log')     || 'null',
    history:    localStorage.getItem('bloom-history') || '{}',
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `bloom-backup-${TODAY_KEY}.json`;
  a.click();
  URL.revokeObjectURL(url);
  playTone(740, 'sine', 0.3, 0.08);
  setTimeout(() => playTone(880, 'sine', 0.4, 0.07), 150);
}

function importBloom(event) {
  const file   = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.version) throw new Error('Invalid backup file');
      if (data.xp)      localStorage.setItem('bloom-xp',      data.xp);
      if (data.theme)   localStorage.setItem('bloom-theme',   data.theme);
      if (data.log)     localStorage.setItem('bloom-log',     data.log);
      if (data.history) localStorage.setItem('bloom-history', data.history);
      // Reload everything
      applyTheme(data.theme || 'light');
      renderXP();
      renderLog();
      renderJournalEntries();
      buildWeeklyStats();
      playLevelUp();
    } catch(err) {
      alert('That doesn\'t look like a Bloom backup file, darling.');
    }
  };
  reader.readAsText(file);
}


// ── Music player with genre selector ─────────────────────────────
// SomaFM doesn't have actual lo-fi hip hop — their softest channel
// is Drone Zone (deep ambient). For real lo-fi beats we link out
// to Chillhop on YouTube since they don't offer free direct streams.

const MUSIC_SOURCES = [
  {
    label: 'Drone Zone',
    desc:  'deep ambient · softest',
    type:  'stream',
    urls:  ['https://ice5.somafm.com/dronezone-128-mp3','https://ice3.somafm.com/dronezone-128-mp3'],
  },
  {
    label: 'Groove Salad',
    desc:  'ambient downtempo',
    type:  'stream',
    urls:  ['https://ice5.somafm.com/groovesalad-128-mp3','https://ice3.somafm.com/groovesalad-128-mp3'],
  },
  {
    label: 'Lo-fi Hip Hop',
    desc:  'opens Chillhop in new tab',
    type:  'external',
    url:   'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  },
  {
    label: 'Lush',
    desc:  'indie dream pop',
    type:  'stream',
    urls:  ['https://ice5.somafm.com/lush-128-mp3','https://ice3.somafm.com/lush-128-mp3'],
  },
];

let audio = null, lofiPlaying = false, streamIdx = 0, currentSource = 0;

// Add cycle button to player — next to volume
(function addCycleBtn() {
  const controls = document.querySelector('.lofi-controls');
  if (!controls) return;
  const btn = document.createElement('button');
  btn.className = 'lofi-btn cycle-btn';
  btn.title = 'Switch music style';
  btn.innerHTML = '<img src="assets/bg/sparkle1.png" style="width:16px;height:16px;object-fit:contain" alt="switch">';
  btn.onclick = cycleMusic;
  controls.appendChild(btn);
})();

function buildAudio() {
  if (audio) { audio.pause(); audio = null; }
  const src = MUSIC_SOURCES[currentSource];
  if (src.type === 'external') return;
  audio = new Audio();
  audio.volume = parseFloat(document.querySelector('.lofi-volume').value);
  audio.src    = src.urls[streamIdx];
  audio.onerror = () => {
    streamIdx++;
    if (streamIdx < src.urls.length) { buildAudio(); audio.play().catch(()=>{}); }
    else {
      streamIdx = 0; setLofiState(false);
      document.getElementById('lofi-sub').textContent = 'stream unavailable — try switching';
    }
  };
  audio.onstalled = () => {
    if (streamIdx < MUSIC_SOURCES[currentSource].urls.length - 1) {
      streamIdx++; buildAudio(); audio.play().catch(()=>{});
    }
  };
  audio.onplaying = () => {
    document.getElementById('lofi-sub').textContent = MUSIC_SOURCES[currentSource].desc;
  };
}

function toggleLofi() {
  const src = MUSIC_SOURCES[currentSource];
  if (src.type === 'external') {
    window.open(src.url, '_blank', 'noopener');
    document.getElementById('lofi-sub').textContent = 'opened Chillhop in new tab';
    return;
  }
  if (!lofiPlaying) {
    streamIdx = 0; buildAudio();
    audio.play()
      .then(() => setLofiState(true))
      .catch(() => {
        document.getElementById('lofi-sub').textContent =
          location.protocol === 'file:' ? 'host on a server to enable radio' : 'tap again to start';
      });
  } else {
    audio.pause(); setLofiState(false);
    document.getElementById('lofi-sub').textContent = 'paused — take a breath';
  }
}

function cycleMusic() {
  if (audio) { audio.pause(); audio = null; }
  setLofiState(false);
  currentSource = (currentSource + 1) % MUSIC_SOURCES.length;
  streamIdx = 0;
  const src = MUSIC_SOURCES[currentSource];
  const titleEl = document.querySelector('.lofi-title');
  if (titleEl) titleEl.textContent = src.label;
  document.getElementById('lofi-sub').textContent = src.desc + ' · tap play';
  playClick();
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

// Audio continues in background — Chrome allows this when started by user gesture



// ── Feedback form — EmailJS ───────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_qvby9tx';
const EMAILJS_TEMPLATE_ID = 'template_6f128mw';
const EMAILJS_PUBLIC_KEY  = 'wvcPyqj6vPOvRoJv';

// Initialise once on page load
window.addEventListener('load', () => {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
});

function sendFeedback() {
  const name    = document.getElementById('feedback-name').value.trim() || 'A Bloom user';
  const message = document.getElementById('feedback-message').value.trim();
  if (!message) { document.getElementById('feedback-message').focus(); return; }

  document.getElementById('feedback-send-btn').style.display = 'none';
  document.getElementById('feedback-sending').style.display  = 'block';
  document.getElementById('feedback-sent').style.display     = 'none';
  document.getElementById('feedback-error').style.display    = 'none';

  if (typeof emailjs === 'undefined') {
    fallbackMailto(name, message); return;
  }

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name: name,
    message:   message,
    reply_to:  'matlabmatryoshka@gmail.com',
  })
  .then(() => {
    document.getElementById('feedback-sending').style.display = 'none';
    document.getElementById('feedback-sent').style.display    = 'block';
    document.getElementById('feedback-name').value            = '';
    document.getElementById('feedback-message').value         = '';
    playTone(740,'sine',0.4,0.08);
    setTimeout(() => playTone(880,'sine',0.4,0.07), 200);
  })
  .catch(err => {
    console.error('EmailJS error:', err);
    fallbackMailto(name, message);
  });
}

function fallbackMailto(name, message) {
  document.getElementById('feedback-sending').style.display  = 'none';
  document.getElementById('feedback-send-btn').style.display = 'block';
  document.getElementById('feedback-error').style.display    = 'block';
}
