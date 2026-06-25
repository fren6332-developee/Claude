# Blast from the Past — Claude Created from Scratch

A free, instantly playable top-down action game inspired by **The Legend of
Zelda: A Link to the Past**. Travel through **six** single-screen realms — one
for each Earth biome — clearing out **ghosts, goblins, and bats**, with
chiptune music written in the spirit of **Final Fantasy VI**. Tuned to be
gentle and quick to finish.

## ▶ Play right away

**No build, no install.** The simplest option:

- **Double-click [`play.html`](play.html)** — the entire game in a single
  self-contained file. Works offline straight from your computer, no server.

Or run the full multi-file version:

- Double-click `index.html`, **or**
- Run a tiny local server and visit it:
  ```bash
  python3 -m http.server 8000
  # then open http://localhost:8000
  ```

### Play online (one-time setup)

This repo ships a GitHub Pages workflow. To get a public, always-on URL:

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

After the next push, the game is live at
`https://<your-username>.github.io/<repo>/` — shareable and playable instantly.

## 📱 Install it like an app (free)

The game is a **Progressive Web App (PWA)**, so it can be installed to your
phone or desktop and run full-screen and offline — no fees, no stores:

- **iPhone/iPad (Safari):** open the site → Share → **Add to Home Screen**.
- **Android (Chrome):** open the site → menu → **Install app**.
- **Desktop (Chrome/Edge):** click the **Install** icon in the address bar.

It then behaves just like a downloaded app, with its own icon and offline play.

> **About the Apple App Store / Google Play:** I can't publish to those stores
> for you — Apple requires a paid Apple Developer Program membership ($99/year)
> plus a native build and an app-review process, and Google Play charges a
> one-time developer fee. None of that can be done from a code repository
> alone. The **PWA install above is the genuinely free, instant equivalent**:
> a real installable app on the home screen with offline support. If you later
> want it wrapped as a native store submission, that can be done with a tool
> like [PWABuilder](https://www.pwabuilder.com/) once you have the developer
> accounts.

## 🎮 Controls

| Action      | Keys                          |
| ----------- | ----------------------------- |
| Move        | Arrow keys or **W A S D**     |
| Swing sword | **Spacebar** or **Z**         |
| Toggle music| **♪ Music** button (top-right)|

Clear every foe in a realm to open the gate, then step through it to advance.
Reach the **Relic of Dawn** in the sixth realm to win.

## 🗺 The six realms

1. **Verdant Wood** — forest
2. **Sun-Scoured Desert** — desert
3. **Frostpeak Tundra** — snow/ice
4. **Emberreach Volcano** — volcanic
5. **Mistmire Swamp** — wetland
6. **Lumin Coast** — coastline (final realm)

## 🛠 Tech

Plain HTML5 Canvas + vanilla JavaScript. Music and sound effects are
synthesized live with the Web Audio API — no audio files, no dependencies.

```
index.html              # app shell + PWA wiring
css/style.css           # framed retro UI
js/audio.js             # Web Audio chiptune engine + biome themes
js/game.js              # game loop, combat, enemies, realms
manifest.webmanifest    # PWA manifest
sw.js                   # service worker (offline play)
icons/                  # app icons
```
