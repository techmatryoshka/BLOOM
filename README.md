<div align="center">

<img src="assets/stickers/crown.webp" width="80" alt="Bloom crown">

# Bloom
### *a gentle focus app for neurodivergent minds*

**Bloom is free and always will be. No ads, no paywalls. Enjoy your growth, carefree.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bloom-e8a0b4?style=for-the-badge&logo=github)](https://yourusername.github.io/bloom)
[![License: MIT](https://img.shields.io/badge/License-MIT-9daf89?style=for-the-badge)](LICENSE)
[![Made with love](https://img.shields.io/badge/Made%20with-love%20%26%20petals-e8a0b4?style=for-the-badge)](https://www.linkedin.com/in/amina-radon%C4%8Di%C4%87-090b99288/)

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
| **XP & Growth System** | Earn XP for every completed session and journal entry — grow from Seedling to Fairy Queen |
| **Daily Bloom Log** | A record of everything you tended to today, with timestamps and XP earned |
| **Journal — "What makes you bloom today?"** | Press Enter to save a reflection — earns you XP because self-awareness is growth |
| **Affirmations** | Gentle, neurodivergent-affirming messages that unlock new tiers as you level up |
| **Lo-fi Focus Radio** | Ambient SomaFM streams play softly in the background while you work |
| **Light & Dark Mode** | Cottagecore light mode and enchanted night garden dark mode |
| **Petal Rain Celebration** | Real flower petal images fall across the screen when you complete a session |
| **Custom Cursor** | A soft flower cursor follows your mouse |
| **Parallax Background** | Flowers, leaves, petals and stars fall gently from the top of the screen |
| **Privacy First** | All data stored locally on your device — nothing sent anywhere, ever |

---

## XP Level System

Your growth is tracked across 7 levels, each represented by a real flower image:

| Level | XP Required | Icon |
|---|---|---|
| 🌱 Seedling | 0 XP | Starting point |
| 🌸 Sprout | 50 XP | Unlocks new affirmations |
| 🌺 Blooming | 150 XP | Unlocks new affirmations |
| 🌻 Flourishing | 300 XP | Unlocks new affirmations |
| 🍀 Enchanted | 500 XP | Unlocks new affirmations |
| 💜 Iris Queen | 750 XP | Unlocks new affirmations |
| 👑 Fairy Queen | 1000 XP | Full bloom — you made it |

**XP sources:**
- 5-min session → +10 XP
- 15-min session → +25 XP
- 25-min session → +40 XP
- Journal entry → +5 XP

---

## Tech Stack

```
Pure HTML5 · CSS3 · Vanilla JavaScript
No frameworks. No dependencies. No build tools.
```

| Layer | Details |
|---|---|
| **Structure** | Semantic HTML5 |
| **Styling** | CSS custom properties (full dark/light theming), CSS animations, backdrop-filter |
| **Logic** | Vanilla JS — timestamp-based timer (works in background tabs), Web Audio API for sound effects, Canvas API for petal rain |
| **Storage** | localStorage — private, local, resets daily |
| **Audio** | SomaFM internet radio streams via `<audio>` element |
| **Fonts** | Google Fonts — Satisfy, Playfair Display, Lora |
| **Assets** | Custom flower, petal, leaf, star PNGs/WebPs |

---

## Project Structure

```
bloom/
├── index.html              # App shell
├── css/
│   └── style.css           # All styles, themes, animations
├── js/
│   └── app.js              # All logic — timer, XP, audio, floaties, canvas
├── assets/
│   ├── stickers/           # UI icons — crown, moon, sun, radio, notebook, level badges
│   └── bg/                 # Background floaties — flowers, petals, leaves, stars
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
# Install the "Live Server" extension, right-click index.html → Open with Live Server
```

> **Note:** The lo-fi radio requires an internet connection and a server context (not `file://`).
> Any of the three options above will enable it.

---

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)` folder
4. Click **Save**
5. Your app is live at `https://yourusername.github.io/bloom` in ~60 seconds

The radio, all assets, and localStorage all work perfectly on GitHub Pages.

---

## Designer

<div align="center">

**Amina Radončić**
*Neuroadaptive System Engineer*

MSc in Bioengineering · PhD student in Electrical Engineering & IT

As a person with AuDHD who constantly struggled with focus and time blindness, I built Bloom for minds alike — hoping it would inspire you to start the tasks that feel impossible to begin.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Amina%20Radončić-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/amina-radon%C4%8Di%C4%87-090b99288/?skipRedirect=true)

</div>

---

## License

MIT — free to use, remix, and bloom. 🌸

---

<div align="center">
<i>"One flower at a time."</i>
</div>
