/* ============================================================
   Bloom — a gentle focus app
   js/app.js
   ============================================================ */

// ── Theme (dark / light) ────────────────────────────────────────
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let isDark = localStorage.getItem('bloom-theme') === 'dark' ||
             (localStorage.getItem('bloom-theme') === null && prefersDark);

function applyTheme() {
  document.body.classList.toggle('dark', isDark);
  document.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
}

function toggleTheme() {
  isDark = !isDark;
  localStorage.setItem('bloom-theme', isDark ? 'dark' : 'light');
  applyTheme();
}

applyTheme();


// ── Lo-fi radio player ──────────────────────────────────────────
let lofiPlaying = false;
const LOFI_PLAYING_LABELS = [
  'lo-fi beats for soft focus 🌿',
  'gentle music for gentle minds ✨',
  'the fairies approve of this playlist 🧚',
  'let the music carry you 🌸',
];

function toggleLofi() {
  const iframe   = document.getElementById('yt-iframe');
  const btn      = document.getElementById('play-btn');
  const icon     = document.getElementById('lofi-anim');
  const sub      = document.getElementById('lofi-sub');

  lofiPlaying = !lofiPlaying;

  if (lofiPlaying) {
    // Reload iframe with autoplay=1 to start playback
    iframe.src = 'https://www.youtube.com/embed/sF80I-TQiW0?autoplay=1&controls=0&loop=1&playlist=sF80I-TQiW0&enablejsapi=1';
    btn.textContent = '⏸';
    btn.classList.add('playing');
    icon.classList.add('playing');
    sub.textContent = LOFI_PLAYING_LABELS[Math.floor(Math.random() * LOFI_PLAYING_LABELS.length)];
  } else {
    // Pause by reloading without autoplay
    iframe.src = 'https://www.youtube.com/embed/sF80I-TQiW0?autoplay=0&controls=0&loop=1&playlist=sF80I-TQiW0&enablejsapi=1';
    btn.textContent = '▶';
    btn.classList.remove('playing');
    icon.classList.remove('playing');
    sub.textContent = 'paused — take a breath 🌙';
  }
}

function setVolume(value) {
  // Volume is controlled via iframe postMessage to YouTube player API
  const iframe = document.getElementById('yt-iframe');
  const vol = parseInt(value, 10);
  // Update the volume icon
  const icon = document.querySelector('.lofi-vol-icon');
  if (vol === 0)      icon.textContent = '🔇';
  else if (vol < 40)  icon.textContent = '🔈';
  else if (vol < 70)  icon.textContent = '🔉';
  else                icon.textContent = '🔊';

  // Post volume message to YouTube iframe
  try {
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: 'setVolume', args: [vol] }),
      '*'
    );
  } catch(e) { /* iframe not ready yet */ }
}

// ── Floaty elements ────────────────────────────────────────────
const SPARKLE_EMOJIS = ['✨','🌸','🌿','🦋','🌼','⭐','💫','🍄','🌺','🌾','🍀','🌙','🫧','🐝','🐞','💐','🌻'];
const FAIRY_EMOJIS   = ['🧚','🧚‍♀️','🦋','🐞','🐝','🌟'];

function spawnSparkle() {
  const el = document.createElement('div');
  el.className = 'sparkle';
  el.textContent = SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)];
  el.style.left     = Math.random() * 100 + 'vw';
  el.style.bottom   = '-2rem';
  el.style.fontSize = (0.6 + Math.random() * 0.8) + 'rem';

  const dur = 6 + Math.random() * 10;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay   = Math.random() * 4 + 's';

  document.getElementById('floaties').appendChild(el);
  setTimeout(() => el.remove(), (dur + 4) * 1000);
}

function spawnFairy() {
  const el = document.createElement('div');
  el.className = 'fairy';

  el.style.setProperty('--fx',  (Math.random() - 0.5) * 60 + 'vw');
  el.style.setProperty('--fy',  (Math.random() - 0.5) * 40 + 'vh');
  el.style.setProperty('--fx2', (Math.random() - 0.5) * 80 + 'vw');
  el.style.setProperty('--fy2', (Math.random() - 0.5) * 60 + 'vh');

  el.textContent = FAIRY_EMOJIS[Math.floor(Math.random() * FAIRY_EMOJIS.length)];
  el.style.left = Math.random() * 90 + 'vw';
  el.style.top  = Math.random() * 90 + 'vh';

  const dur = 8 + Math.random() * 12;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay   = Math.random() * 3 + 's';

  document.getElementById('floaties').appendChild(el);
  setTimeout(() => el.remove(), (dur + 3) * 1000);
}

// Start ambient magic
setInterval(spawnSparkle, 700);
setInterval(spawnFairy,   2500);
for (let i = 0; i < 10; i++) setTimeout(spawnSparkle, i * 200);
for (let i = 0; i < 3;  i++) setTimeout(spawnFairy,   i * 800);


// ── App state ───────────────────────────────────────────────────
let duration  = 25 * 60;
let remaining = duration;
let interval  = null;
let paused    = false;
let sessions  = 0;


// ── Task emoji map ──────────────────────────────────────────────
const TASK_EMOJIS = {
  write:    '✍️',
  read:     '📖',
  study:    '📚',
  code:     '💻',
  email:    '📬',
  meet:     '🌸',
  call:     '📞',
  draw:     '🎨',
  plan:     '🗓️',
  research: '🔍',
  clean:    '🧹',
  cook:     '🍵',
  exercise: '🌿',
  default:  '🌟',
};

function getTaskEmoji(text) {
  const lower = text.toLowerCase();
  for (const [keyword, emoji] of Object.entries(TASK_EMOJIS)) {
    if (lower.includes(keyword)) return emoji;
  }
  return TASK_EMOJIS.default;
}


// ── Timer helpers ───────────────────────────────────────────────
function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(seconds) {
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
}

function updateRingProgress() {
  const circumference = 2 * Math.PI * 70; // r = 70
  const offset = circumference * (1 - remaining / duration);
  const ring = document.getElementById('timer-ring');
  ring.style.strokeDasharray  = circumference;
  ring.style.strokeDashoffset = offset;
}

function updateTimerDisplay() {
  document.getElementById('timer-digits').textContent = formatTime(remaining);
}


// ── Duration selection ──────────────────────────────────────────
function selectDuration(btn, minutes) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  duration = minutes * 60;
}


// ── Focus session ───────────────────────────────────────────────
function startFocus() {
  const taskInput = document.getElementById('task-input');
  const task = taskInput.value.trim();

  if (!task) {
    taskInput.focus();
    taskInput.style.borderColor = '#e8a0b4';
    return;
  }

  sessions++;
  document.getElementById('task-label').textContent    = task;
  document.getElementById('task-emoji').textContent    = getTaskEmoji(task);
  document.getElementById('session-info').textContent  = `🌸 session ${sessions}`;

  document.getElementById('input-screen').style.display = 'none';
  document.getElementById('focus-screen').style.display = 'block';

  remaining = duration;
  updateTimerDisplay();
  updateRingProgress();

  paused = false;
  document.getElementById('pause-btn').textContent = '⏸ pause';

  clearInterval(interval);
  interval = setInterval(tick, 1000);
}

function tick() {
  if (paused) return;
  remaining--;
  updateTimerDisplay();
  updateRingProgress();
  if (remaining <= 0) {
    clearInterval(interval);
    celebrate();
  }
}

function togglePause() {
  paused = !paused;
  document.getElementById('pause-btn').textContent = paused ? '▶ resume' : '⏸ pause';
}

function resetAll() {
  clearInterval(interval);
  paused    = false;
  remaining = duration;

  document.getElementById('celebration').classList.remove('show');
  document.getElementById('task-input').value           = '';
  document.getElementById('focus-screen').style.display = 'none';
  document.getElementById('input-screen').style.display = 'block';
  document.getElementById('timer-ring').style.strokeDashoffset = 0;

  updateTimerDisplay();
}


// ── Celebration ─────────────────────────────────────────────────
const CELEBRATE_MESSAGES = [
  "The fairies did a little dance just for you.<br>One task at a time — that's the cottage way. 🌿",
  "You tended to your garden so beautifully.<br>Now rest, dear one. You've earned it. 🌸",
  "A spell completed! The mushroom circle glows brighter for it. ✨",
  "Even the bees stopped to celebrate you.<br>Well done, lovely thing. 🐝💐",
  "The enchanted forest sees your hard work.<br>You are doing wonderfully. 🦋",
];

const CELEB_EMOJIS = ['🌸','🌼','🌺','💐','🍀','🌻','🌷','✨','🌟','💫'];

function celebrate() {
  const msg = CELEBRATE_MESSAGES[Math.floor(Math.random() * CELEBRATE_MESSAGES.length)];
  document.getElementById('celebrate-msg').innerHTML = msg;

  const row = document.getElementById('flowers-row');
  row.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const f = document.createElement('span');
    f.className = 'flower';
    f.textContent = CELEB_EMOJIS[Math.floor(Math.random() * CELEB_EMOJIS.length)];
    f.style.animationDelay = (i * 0.08) + 's';
    row.appendChild(f);
  }

  document.getElementById('celebration').classList.add('show');

  // Extra burst of magic!
  for (let i = 0; i < 20; i++) setTimeout(spawnSparkle, i * 100);
  for (let i = 0; i < 5;  i++) setTimeout(spawnFairy,   i * 300);
}
