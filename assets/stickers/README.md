# 🌸 Bloom — Sticker Guide

When you're ready to replace the emoji fallbacks with real graphics,
drop your files into this folder and name them as listed below.

Any standard image format works: `.png` (recommended), `.svg`, `.webp`, `.gif`.
Transparent backgrounds (PNG with alpha) look best!

## Required stickers

| File name                  | Used for                          | Recommended size |
|----------------------------|-----------------------------------|------------------|
| `crown.png`                | App logo / header icon            | 120×120 px       |
| `fairy-celebrate.png`      | Celebration screen                | 160×160 px       |
| `fairy-small.png`          | Orbiting around the timer ring    | 60×60 px         |
| `task-default.png`         | Generic task icon                 | 96×96 px         |
| `task-write.png`           | Tasks containing "write"          | 96×96 px         |
| `task-read.png`            | Tasks containing "read"           | 96×96 px         |
| `task-study.png`           | Tasks containing "study"          | 96×96 px         |
| `task-code.png`            | Tasks containing "code"           | 96×96 px         |
| `task-email.png`           | Tasks containing "email"          | 96×96 px         |
| `task-research.png`        | Tasks containing "research"       | 96×96 px         |
| `task-draw.png`            | Tasks containing "draw"           | 96×96 px         |
| `task-plan.png`            | Tasks containing "plan"           | 96×96 px         |
| `task-cook.png`            | Tasks containing "cook"           | 96×96 px         |
| `task-clean.png`           | Tasks containing "clean"          | 96×96 px         |
| `task-exercise.png`        | Tasks containing "exercise"       | 96×96 px         |
| `task-meet.png`            | Tasks containing "meet"           | 96×96 px         |
| `task-call.png`            | Tasks containing "call"           | 96×96 px         |

## How it works

Each `<img>` tag has an `onerror` handler:
- ✅ If the file **exists** → the sticker image is shown
- 🔄 If the file is **missing** → the emoji fallback is shown automatically

So you can drop in stickers one by one — the app degrades gracefully
with emojis until you have all your graphics ready!

## Free sticker sources to get you started

- [icons8.com](https://icons8.com) — search "fairy", "flower", "star" (free tier available)
- [flaticon.com](https://flaticon.com) — sticker packs, PNG download
- [Canva](https://canva.com) — design your own, export as PNG
- [LottieFiles](https://lottiefiles.com) — animated stickers (needs extra JS to use)
- AI tools (Midjourney, DALL-E, Adobe Firefly) — generate cottagecore illustrations
