# Final Fantasy Chess

A free, instantly playable game of chess where every piece is a beloved
**Final Fantasy** character, sculpted like a **claymation** figure that
**stands up on a three-dimensional board** viewed at an angle, with a soft
Studio Ghibli warmth. Drag pieces with your mouse or finger, choose from
**five difficulty levels** against the computer, and play to a wistful
adventuring theme.

## ♟ The cast

| Piece  | Character        | Series          |
| ------ | ---------------- | --------------- |
| King   | **Noctis**       | Final Fantasy XV |
| Queen  | **Aerith**       | Final Fantasy VII |
| Rook   | **Barret**       | Final Fantasy VII |
| Bishop | **Strago**       | Final Fantasy VI |
| Knight | **Cecil Harvey** | Final Fantasy IV |
| Pawn   | **Imp**          | Final Fantasy IV |

Both armies use the same heroes. You can tell the sides apart by the little
platform each figure stands on — **sunlit cream** for White, **twilight
indigo** for Black — and by a gentle warm-vs-cool shift in their colours.

> The artwork is original vector painting drawn live on an HTML5 canvas.
> The scene is rendered through a real perspective camera: the board is a
> thick, angled clay slab and every figure **stands upright** on its square as
> a depth-scaled sculpt — nearer pieces are larger and overlap the ones
> behind. Each figure is modelled with a single soft light source, a glossy
> sheen and a grounding shadow so it reads like a moulded **clay sculpture**.
> It's an affectionate *interpretation* of these characters, not copied
> sprites.

## ▶ Play right away

**No build, no install.** Double-click **`index.html`**, or run a tiny local
server and open it:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

### Play online (one-time setup)

This repo ships a GitHub Pages workflow. To get a public, always-on URL:

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

After the next push the game is live at
`https://<your-username>.github.io/<repo>/`.

## 🎮 How to play

- **Move a piece** by **dragging** it with the mouse (or your finger on a
  touch screen). You can also **tap/click a piece, then tap its
  destination**. Legal moves are shown as dots; captures are ringed.
- All standard chess rules are implemented: **castling, en passant, pawn
  promotion, check, checkmate and stalemate**, plus draw detection.
- **Promotion** lets you crown your imp as Aerith, Barret, Cecil or Strago.
- Buttons: **New Game**, **Undo**, **Flip Board**, and a **♪ Music** toggle.

## 🧠 Opponent & difficulty

Choose **vs Computer** or **Two Players** (same device). Against the computer,
pick which side you play and one of five levels:

| Level | Strength        | Behaviour                                  |
| ----- | --------------- | ------------------------------------------ |
| 1     | Super easy      | Very shallow, frequently plays random moves |
| 2     | Low–medium      | Looks one move ahead, fairly loose          |
| 3     | Medium          | Looks ahead, mostly sensible                |
| 4     | Medium–high     | Deeper search, plays its best move          |
| 5     | Hardest         | Deepest search, no mistakes on purpose      |

## 🎵 Music

While you face the computer, a gentle, lilting **adventuring theme** plays in
the background — written live with the Web Audio API in the wistful,
folk-hero spirit of **Locke's theme from Final Fantasy VI** (an original tune,
not a transcription). Toggle it any time with the **♪ Music** button. It does
not play in Two-Player mode.

## 📱 iPhone / iPad (and installing as an app)

The game is built to work on **iOS Safari**:

- The board uses pointer/touch events with `touch-action: none`, so dragging a
  piece won't scroll or zoom the page.
- The layout is responsive — the board scales to fit the screen and stacks
  above the controls on phones, with comfortably sized tap targets.
- Background music starts on your first tap (iOS requires a user gesture
  before audio can play — that's handled automatically).

It's also a **Progressive Web App**, so you can install it to your home
screen and play offline:

- **iPhone/iPad (Safari):** open the site → Share → **Add to Home Screen**.
- **Android (Chrome):** open the site → menu → **Install app**.
- **Desktop (Chrome/Edge):** click the **Install** icon in the address bar.

## 🛠 Tech

Plain HTML5 Canvas + vanilla JavaScript, no dependencies. Pieces and music are
generated entirely in code — no image or audio files.

```
index.html              # app shell + PWA wiring
css/chess.css           # responsive, iOS-friendly UI
js/engine.js            # chess rules: move generation, check/mate, castling…
js/pieces.js            # Ghibli-styled Final Fantasy piece artwork
js/music.js             # Web Audio adventuring theme (vs-computer only)
js/chess.js             # board, drag-and-drop, AI, controls
manifest.webmanifest    # PWA manifest
sw.js                   # service worker (offline play)
icons/                  # app icons
```

> An earlier Zelda-style game still lives in the self-contained
> [`play.html`](play.html) if you'd like to revisit it.
