<div align="center">

<img src="assets/stickers/crown.webp" width="80" alt="Bloom crown">

# Bloom
### *a gentle focus app for neurodivergent minds*

**Bloom is free and always will be. No ads, no paywalls. Enjoy your growth, carefree.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-techmatryoshka.github.io/BLOOM-e8a0b4?style=for-the-badge&logo=github)](https://techmatryoshka.github.io/BLOOM/)
[![License: MIT](https://img.shields.io/badge/License-MIT-9daf89?style=for-the-badge)](LICENSE)
[![Made with love](https://img.shields.io/badge/Made%20with-love%20%26%20petals-e8a0b4?style=for-the-badge)](https://www.linkedin.com/in/amina-radon%C4%8Di%C4%87-090b99288/)
[![PWA Ready](https://img.shields.io/badge/PWA-installable-9daf89?style=for-the-badge)](https://techmatryoshka.github.io/BLOOM/)

</div>

---

## About

Bloom was designed for neurodivergent minds by a neurodivergent mind — because you need a little gentleness and grace to get going.

She is not here to turn you into a productive machine. She asks you to tend to **one thing at a time**, like a gardener taking care of one flower at a time. No overwhelming lists, no harsh timers that fill your screen — just gentle encouragement and a garden that grows with you.

Built with love for anyone with ADHD, autism, AuDHD, anxiety, or any brain that needs a softer way to focus.

---

## Features

| Feature | Description |
|---|---|
| **One Thing Focus Timer** | Type one task, choose 5 / 15 / 25 minutes, and let Bloom hold space for you |
| **Breathing Exercise** | A gentle 4-4-4 breathing cycle before each session to ease task initiation |
| **XP & Growth System** | Earn XP for every completed session, rest break, and journal entry — grow from Seedling to Fairy Queen |
| **Daily Bloom Log** | A record of everything you tended to today, with timestamps and XP earned |
| **Journal — "What makes you bloom today?"** | Press Enter to save a reflection — earns you XP because self-awareness is growth |
| **Rest Mode** | Timed rest sessions (5 / 10 / 20 min) that earn you XP — rest is not giving up |
| **Nature Soundscapes** | Rain, forest, birds, stream, wind and fireplace — generated with Web Audio API, no files needed |
| **Lo-fi Focus Radio** | Four ambient music styles via SomaFM streams, with Chillhop link for real lo-fi |
| **Affirmations** | Gentle, neurodivergent-affirming messages that unlock new tiers as you level up |
| **Week in Bloom** | Weekly stats with flower bar chart, ladybug streak badges, and journal highlights |
| **Lifetime Stats** | All-time sessions, minutes focused, and journal entries tracked |
| **Seasonal Themes** | Cherry blossoms in spring, daisies in summer, maple leaves in autumn, snowflakes in winter |
| **Light & Dark Mode** | Cottagecore light mode and enchanted night garden dark mode |
| **Petal Rain Celebration** | Real flower petal images rain down on the canvas when you complete a session |
| **Draggable Panels** | Nature sounds panel, lo-fi player and XP bar are all freely draggable — positions saved |
| **Custom Flower Cursor** | A soft flower cursor follows your mouse |
| **Feedback Form** | Built-in feedback form powered by EmailJS — messages land directly in the designer's inbox |
| **Export & Import** | Download your bloom data as a JSON backup and restore it on any device |
| **PWA Installable** | Add to Home Screen on Android or iOS — works offline after first load |
| **Privacy First** | All data stored locally on your device — nothing sent anywhere, ever |

---

## XP Level System

| Level | XP Required | Icon |
|---|---|---|
| Seedling | 0 XP | Starting point |
| Sprout | 50 XP | Unlocks new affirmations |
| Blooming | 150 XP | Unlocks new affirmations |
| Flourishing | 300 XP | Unlocks new affirmations |
| Enchanted | 500 XP | Unlocks new affirmations |
| Iris Queen | 750 XP | Unlocks new affirmations |
| Fairy Queen | 1000 XP | Full bloom — you made it |

**XP sources:**
- 5-min session → +10 XP
- 15-min session → +25 XP
- 25-min session → +40 XP
- Journal entry → +5 XP
- 5-min rest → +5 XP
- 10-min rest → +8 XP
- 20-min rest → +12 XP

---

## Tech Stack

```
Pure HTML5 · CSS3 · Vanilla JavaScript
No frameworks. No dependencies. No build tools.
```

| Layer | Details |
|---|---|
| **Structure** | Semantic HTML5 |
| **Styling** | CSS custom properties (full dark/light/seasonal theming), CSS animations, backdrop-filter |
| **Logic** | Vanilla JS — timestamp-based timer (works in background tabs), Web Audio API for sound effects and nature soundscapes, Canvas API for petal rain |
| **Storage** | localStorage — private, local, daily resets, exportable |
| **Feedback** | EmailJS for in-app feedback form (no backend needed) |
| **Audio** | SomaFM internet radio streams via `<audio>` element |
| **PWA** | Web App Manifest + Service Worker for offline use and home screen installation |
| **Fonts** | Google Fonts — Satisfy, Playfair Display, Lora |
| **Assets** | Custom flower, petal, leaf, star, butterfly PNGs/WebPs |

---

## Project Structure

```
bloom/
├── index.html              # App shell
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (offline caching)
├── css/
│   └── style.css           # All styles, themes, animations
├── js/
│   └── app.js              # All logic — timer, XP, audio, soundscapes, canvas, drag
├── assets/
│   ├── stickers/           # UI icons — crown, level badges, feature icons
│   ├── bg/                 # Background floaties — flowers, petals, leaves, stars
│   └── icons/              # PWA icons — all required sizes
└── README.md
```

---

## Running Locally

No build step needed — just serve the folder:

```bash
# Option 1 — Python (built into macOS/Linux)
python3 -m http.server 3000

# Option 2 — Node.js
npx serve .

# Option 3 — VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

> **Note:** The lo-fi radio requires internet. Nature soundscapes and all other features work fully offline.

---

## Setting up the Feedback Form

The in-app feedback form uses [EmailJS](https://emailjs.com) (free tier: 200 emails/month).

1. Sign up at **emailjs.com**
2. Add Gmail as an email service
3. Create a template with `{{from_name}}` and `{{message}}` variables
4. In `js/app.js` at the bottom, replace:

```js
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
```

5. In EmailJS → Account → Security, add your domain to restrict key usage

---

## Installing as an Android / iOS App (PWA)

1. Open `https://techmatryoshka.github.io/BLOOM/` in Chrome (Android) or Safari (iOS)
2. Tap the browser menu → **"Add to Home Screen"**
3. Bloom appears on your home screen with her own icon, opens fullscreen

---

## Designer

<div align="center">

**Amina Radončić**
*Neuroadaptive System Engineer*

MSc in Bioengineering · PhD student in Electrical Engineering & IT

As a person with AuDHD who constantly struggled with focus and time blindness, I built Bloom for minds alike — hoping it would inspire you to start the tasks that feel impossible to begin.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Amina%20Radončić-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/amina-radon%C4%8Di%C4%87-090b99288/?skipRedirect=true)
[![Email](https://img.shields.io/badge/Email-matlabmatryoshka%40gmail.com-e8a0b4?style=for-the-badge)](mailto:matlabmatryoshka@gmail.com)

</div>

---

## License

MIT — free to use, remix, and bloom. 🌸

---

<div align="center">
<i>"One flower at a time."</i>
</div>
