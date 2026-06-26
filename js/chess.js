/*
 * Final Fantasy Chess — board controller.
 * Handles rendering, mouse / touch drag-and-drop, highlights, the captured
 * trays, an optional computer opponent, and pawn promotion.
 */
(function () {
  "use strict";

  const C = window.Chess;
  const P = window.Pieces;
  const NAMES = P.NAMES;

  // ---- canvas + geometry ------------------------------------------------
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  const BOARD = 560;
  const SQ = BOARD / 8;
  const DPR = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  canvas.width = BOARD * DPR;
  canvas.height = BOARD * DPR;
  // Let CSS scale the display size (responsive on phones/iOS); the canvas keeps
  // its square aspect from the width/height attributes. Pointer math reads the
  // live displayed size, so any scale works.
  ctx.scale(DPR, DPR);

  const LIGHT = "#f1e3c4";
  const DARK = "#b07f55";

  // A coarse grain tile, scaled up over the board for a matte, hand-pressed
  // clay surface.
  const noiseCanvas = (function makeNoise(size) {
    const n = document.createElement("canvas");
    n.width = n.height = size;
    const c = n.getContext("2d");
    const img = c.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 64; // around neutral grey
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    c.putImageData(img, 0, 0);
    return n;
  })(190);

  // ---- game state -------------------------------------------------------
  let game = C.newGame();
  let history = [];          // past states for undo
  let flipped = false;
  let selected = null;       // [r,c] of selected piece
  let legal = [];            // legal moves for the selected piece
  let dragging = null;       // { from:[r,c], piece, x, y, moved }
  let anim = null;           // { piece, from:[x,y], to:[x,y], t0, dur }
  let pendingPromotion = null; // { from, to, candidates }
  let mode = "ai";          // 'ai' | 'hotseat'
  let aiColor = "b";
  let aiLevel = 3;          // 1 (super easy) … 5 (hardest)
  let aiThinking = false;
  let gameOver = false;
  let dirty = true; // only repaint the board when something actually changes
  function invalidate() { dirty = true; }

  // Difficulty profiles. Lower levels search shallowly and play loose, noisy
  // moves (sometimes outright random); higher levels search deeper and play
  // the best move they find.
  const LEVELS = {
    1: { depth: 1, jitter: 450, blunder: 0.55 }, // super easy
    2: { depth: 2, jitter: 130, blunder: 0.18 }, // low–medium
    3: { depth: 2, jitter: 55, blunder: 0.05 },  // medium
    4: { depth: 3, jitter: 20, blunder: 0.0 },   // medium–high
    5: { depth: 4, jitter: 0, blunder: 0.0 },    // hardest
  };

  const music = window.ChessMusic;
  let musicWanted = true;

  // ---- coordinate mapping ----------------------------------------------
  function boardToScreen(r, c) {
    return flipped ? [7 - r, 7 - c] : [r, c];
  }
  function screenToBoard(sr, sc) {
    return flipped ? [7 - sr, 7 - sc] : [sr, sc];
  }
  function squareTopLeft(r, c) {
    const [sr, sc] = boardToScreen(r, c);
    return [sc * SQ, sr * SQ];
  }
  function eventToSquare(e) {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * BOARD;
    const y = ((e.clientY - rect.top) / rect.height) * BOARD;
    if (x < 0 || y < 0 || x >= BOARD || y >= BOARD) return null;
    const sc = Math.floor(x / SQ);
    const sr = Math.floor(y / SQ);
    return { sq: screenToBoard(sr, sc), x, y };
  }

  // ---- rendering --------------------------------------------------------
  function drawBoard() {
    ctx.clearRect(0, 0, BOARD, BOARD);

    const kingPos = C.inCheck(game, game.turn) ? C.findKing(game.board, game.turn) : null;
    const lm = game.lastMove;

    for (let sr = 0; sr < 8; sr++) {
      for (let sc = 0; sc < 8; sc++) {
        const x = sc * SQ, y = sr * SQ;
        ctx.fillStyle = (sr + sc) % 2 === 0 ? LIGHT : DARK;
        ctx.fillRect(x, y, SQ, SQ);

        // pressed-clay tile bevel: lit on the top-left, shaded on the bottom-right
        const bev = ctx.createLinearGradient(x, y, x + SQ, y + SQ);
        bev.addColorStop(0, "rgba(255,255,255,0.13)");
        bev.addColorStop(0.5, "rgba(255,255,255,0)");
        bev.addColorStop(1, "rgba(0,0,0,0.16)");
        ctx.fillStyle = bev;
        ctx.fillRect(x, y, SQ, SQ);
        // grout seam between tiles
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(60,38,28,0.30)";
        ctx.strokeRect(x + 0.5, y + 0.5, SQ - 1, SQ - 1);

        const [r, c] = screenToBoard(sr, sc);

        // last-move tint
        if (lm && ((lm.from[0] === r && lm.from[1] === c) || (lm.to[0] === r && lm.to[1] === c))) {
          ctx.fillStyle = "rgba(120,180,90,0.35)";
          ctx.fillRect(x, y, SQ, SQ);
        }
        // selected square
        if (selected && selected[0] === r && selected[1] === c) {
          ctx.fillStyle = "rgba(255,221,120,0.55)";
          ctx.fillRect(x, y, SQ, SQ);
        }
        // king in check
        if (kingPos && kingPos[0] === r && kingPos[1] === c) {
          ctx.fillStyle = "rgba(220,70,70,0.45)";
          ctx.fillRect(x, y, SQ, SQ);
        }

        // coordinate labels
        if (sc === 0) label(x + 3, y + 12, 8 - r);
        if (sr === 7) label(x + SQ - 10, y + SQ - 5, "abcdefgh"[c]);
      }
    }

    // matte clay grain across the whole board surface
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.globalCompositeOperation = "overlay";
    ctx.drawImage(noiseCanvas, 0, 0, BOARD, BOARD);
    ctx.restore();

    // legal-move markers for the selected/dragged piece
    for (const m of legal) {
      const [x, y] = squareTopLeft(m.to[0], m.to[1]);
      const cx = x + SQ / 2, cy = y + SQ / 2;
      ctx.fillStyle = "rgba(40,60,30,0.30)";
      if (m.capture) {
        ctx.beginPath();
        ctx.arc(cx, cy, SQ * 0.42, 0, Math.PI * 2);
        ctx.lineWidth = SQ * 0.08;
        ctx.strokeStyle = "rgba(40,60,30,0.35)";
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(cx, cy, SQ * 0.14, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // pieces
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = game.board[r][c];
        if (!p) continue;
        if (dragging && dragging.from[0] === r && dragging.from[1] === c) continue; // lifted
        if (anim && anim.to[0] === r && anim.to[1] === c) continue; // animating in
        const [x, y] = squareTopLeft(r, c);
        P.draw(ctx, p.t, p.c, x, y, SQ);
      }
    }

    // sliding animation
    if (anim) {
      const t = Math.min(1, (performance.now() - anim.t0) / anim.dur);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease
      const x = anim.fromXY[0] + (anim.toXY[0] - anim.fromXY[0]) * e;
      const y = anim.fromXY[1] + (anim.toXY[1] - anim.fromXY[1]) * e;
      P.draw(ctx, anim.piece.t, anim.piece.c, x, y, SQ);
      if (t >= 1) { anim = null; }
    }

    // dragged piece follows the cursor, lifted slightly
    if (dragging) {
      P.draw(ctx, dragging.piece.t, dragging.piece.c,
        dragging.x - SQ / 2, dragging.y - SQ / 2 - SQ * 0.08, SQ);
    }
  }

  function label(x, y, text) {
    ctx.fillStyle = "rgba(40,28,20,0.55)";
    ctx.font = `bold ${SQ * 0.16}px "Trebuchet MS", sans-serif`;
    ctx.fillText(text, x, y);
  }

  function loop() {
    // Repaint only when needed: on a change, or while dragging/animating.
    if (dirty || dragging || anim) {
      drawBoard();
      if (!dragging && !anim) dirty = false;
    }
    requestAnimationFrame(loop);
  }

  // ---- interaction ------------------------------------------------------
  function humanToMove() {
    if (gameOver || aiThinking) return false;
    if (mode === "ai" && game.turn === aiColor) return false;
    return true;
  }

  function onDown(e) {
    // A real user gesture — a good moment to (re)start audio if wanted.
    updateMusic();
    if (pendingPromotion) return;
    const hit = eventToSquare(e);
    if (!hit) return;
    const [r, c] = hit.sq;

    // If a piece is already selected and this is a legal destination → move.
    if (selected) {
      const m = legal.find((mm) => mm.to[0] === r && mm.to[1] === c);
      if (m) { commitMove(selected, [r, c]); clearSelection(); return; }
    }

    if (!humanToMove()) { clearSelection(); return; }
    const p = game.board[r][c];
    if (p && p.c === game.turn) {
      selected = [r, c];
      legal = C.legalMoves(game, [r, c]);
      dragging = { from: [r, c], piece: p, x: hit.x, y: hit.y, moved: false };
      canvas.classList.add("grabbing");
      invalidate();
    } else {
      clearSelection();
    }
  }

  function onMove(e) {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    dragging.x = ((e.clientX - rect.left) / rect.width) * BOARD;
    dragging.y = ((e.clientY - rect.top) / rect.height) * BOARD;
    dragging.moved = true;
  }

  function onUp(e) {
    canvas.classList.remove("grabbing");
    if (!dragging) return;
    const drag = dragging;
    dragging = null;
    invalidate(); // the lifted piece must be repainted onto a square again
    const hit = eventToSquare(e);
    if (hit) {
      const [r, c] = hit.sq;
      const m = legal.find((mm) => mm.to[0] === r && mm.to[1] === c);
      if (m) {
        // A drag drop: move with no slide animation (piece is already there).
        commitMove(drag.from, [r, c], { animate: !drag.moved });
        clearSelection();
        return;
      }
      // Dropped on its own square → keep it selected (click-to-move mode).
      if (drag.from[0] === r && drag.from[1] === c && drag.moved === false) {
        return; // selection stays
      }
    }
    clearSelection();
  }

  function clearSelection() {
    selected = null;
    legal = [];
    invalidate();
  }

  // ---- moving -----------------------------------------------------------
  function commitMove(from, to, opts) {
    opts = opts || {};
    const candidates = C.legalMoves(game, from).filter(
      (m) => m.to[0] === to[0] && m.to[1] === to[1]
    );
    if (candidates.length === 0) return;

    if (candidates.length > 1 && candidates[0].promotion) {
      // Promotion — ask which Final Fantasy hero to crown.
      showPromotion(from, to, candidates);
      return;
    }
    finishMove(candidates[0], opts.animate);
  }

  function finishMove(move, animate) {
    const piece = game.board[move.from[0]][move.from[1]];
    history.push(C.cloneState(game));
    if (animate) {
      const [fx, fy] = squareTopLeft(move.from[0], move.from[1]);
      const [tx, ty] = squareTopLeft(move.to[0], move.to[1]);
      anim = { piece, to: [move.to[0], move.to[1]], fromXY: [fx, fy], toXY: [tx, ty], t0: performance.now(), dur: 180 };
    }
    game = C.applyMove(game, move);
    invalidate();
    afterMove();
  }

  function afterMove() {
    updateStatus();
    updateCaptured();
    if (!gameOver && mode === "ai" && game.turn === aiColor) {
      aiThinking = true;
      updateStatus();
      setTimeout(runAI, 60);
    }
  }

  // ---- status / captured ------------------------------------------------
  const statusEl = document.getElementById("status");
  const turnDot = document.getElementById("turn-dot");

  function updateStatus() {
    const st = C.status(game);
    const mover = game.turn === "w" ? "White" : "Black";
    turnDot.className = "dot " + (game.turn === "w" ? "white" : "black");
    if (st === "checkmate") {
      const winner = game.turn === "w" ? "Black" : "White";
      statusEl.textContent = `Checkmate — ${winner} wins!`;
      gameOver = true;
    } else if (st === "stalemate") {
      statusEl.textContent = "Stalemate — it's a draw.";
      gameOver = true;
    } else if (st === "draw50") {
      statusEl.textContent = "Draw — 50-move rule.";
      gameOver = true;
    } else if (st === "insufficient") {
      statusEl.textContent = "Draw — insufficient material.";
      gameOver = true;
    } else if (aiThinking) {
      statusEl.textContent = "Aerith's army is plotting…";
    } else if (st === "check") {
      statusEl.textContent = `${mover} is in check!`;
    } else {
      statusEl.textContent = `${mover} to move`;
    }
  }

  const START_COUNT = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
  function updateCaptured() {
    drawTray("captW", "w");
    drawTray("captB", "b");
  }
  function drawTray(id, color) {
    const cnv = document.getElementById(id);
    const c2 = cnv.getContext("2d");
    const w = cnv.width, h = cnv.height;
    c2.clearRect(0, 0, w, h);
    // count current pieces of this colour
    const cur = {};
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = game.board[r][c];
        if (p && p.c === color) cur[p.t] = (cur[p.t] || 0) + 1;
      }
    // captured = start - current (these are pieces of `color` that were taken)
    const sz = h;
    let x = 2;
    let score = 0;
    for (const t of ["q", "r", "b", "n", "p"]) {
      const lost = START_COUNT[t] - (cur[t] || 0);
      for (let i = 0; i < lost; i++) {
        if (x + sz * 0.7 > w) break;
        P.draw(c2, t, color, x - sz * 0.15, 0, sz);
        x += sz * 0.42;
        score += C.VALUES[t];
      }
    }
    return score;
  }

  // ---- promotion picker -------------------------------------------------
  const promoEl = document.getElementById("promotion");
  function showPromotion(from, to, candidates) {
    pendingPromotion = { from, to, candidates };
    promoEl.innerHTML = "";
    const color = game.turn;
    for (const t of ["q", "r", "b", "n"]) {
      const m = candidates.find((mm) => mm.promotion === t);
      const btn = document.createElement("button");
      btn.className = "promo-btn";
      btn.title = NAMES[t];
      const mini = document.createElement("canvas");
      mini.width = 72; mini.height = 72;
      P.draw(mini.getContext("2d"), t, color, 0, 0, 72);
      const cap = document.createElement("span");
      cap.textContent = NAMES[t];
      btn.appendChild(mini);
      btn.appendChild(cap);
      btn.addEventListener("click", () => {
        promoEl.classList.add("hidden");
        pendingPromotion = null;
        finishMove(m, false);
      });
      promoEl.appendChild(btn);
    }
    promoEl.classList.remove("hidden");
  }

  // ---- computer opponent (negamax + alpha-beta) -------------------------
  function evaluate(state) {
    let score = 0;
    const center = [3.5, 3.5];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = state.board[r][c];
        if (!p) continue;
        const sign = p.c === "w" ? 1 : -1;
        let v = C.VALUES[p.t];
        // gentle centralisation for minor pieces / queen
        if (p.t === "n" || p.t === "b" || p.t === "q") {
          const d = Math.abs(r - center[0]) + Math.abs(c - center[1]);
          v += (7 - d) * 3;
        }
        // pawns are worth more the closer they get to promotion
        if (p.t === "p") {
          const adv = p.c === "w" ? 6 - r : r - 1;
          v += adv * adv * 2;
        }
        score += sign * v;
      }
    return score;
  }

  function orderMoves(state, moves) {
    return moves
      .map((m) => {
        const victim = state.board[m.to[0]][m.to[1]];
        const s = (victim ? C.VALUES[victim.t] : 0) + (m.promotion ? 800 : 0);
        return { m, s };
      })
      .sort((a, b) => b.s - a.s)
      .map((o) => o.m);
  }

  function negamax(state, depth, alpha, beta, sign) {
    if (depth === 0) return sign * evaluate(state);
    const moves = C.legalMoves(state);
    if (moves.length === 0) {
      if (C.inCheck(state, state.turn)) return -100000 - depth; // mated
      return 0; // stalemate
    }
    let best = -Infinity;
    for (const m of orderMoves(state, moves)) {
      const next = C.applyMove(state, m);
      const val = -negamax(next, depth - 1, -beta, -alpha, -sign);
      if (val > best) best = val;
      if (best > alpha) alpha = best;
      if (alpha >= beta) break;
    }
    return best;
  }

  function runAI() {
    const cfg = LEVELS[aiLevel] || LEVELS[3];
    const sign = game.turn === "w" ? 1 : -1;
    const rootMoves = C.legalMoves(game);
    let best = null;

    if (rootMoves.length === 0) {
      aiThinking = false;
      updateStatus();
      return;
    }

    if (Math.random() < cfg.blunder) {
      // An easy-level slip: just grab a random legal move.
      best = rootMoves[Math.floor(Math.random() * rootMoves.length)];
    } else {
      let bestVal = -Infinity;
      for (const m of orderMoves(game, rootMoves)) {
        const next = C.applyMove(game, m);
        let val = -negamax(next, cfg.depth - 1, -Infinity, Infinity, -sign);
        if (cfg.jitter) val += (Math.random() * 2 - 1) * cfg.jitter;
        if (val > bestVal) { bestVal = val; best = m; }
      }
    }
    aiThinking = false;
    if (best) finishMove(best, true);
    else updateStatus();
  }

  // ---- controls ---------------------------------------------------------
  function newGame() {
    game = C.newGame();
    history = [];
    clearSelection();
    anim = null;
    pendingPromotion = null;
    promoEl.classList.add("hidden");
    gameOver = false;
    aiThinking = false;
    invalidate();
    // If the human plays Black vs computer, let the computer (White) open.
    afterMoveInit();
  }
  function afterMoveInit() {
    updateStatus();
    updateCaptured();
    updateMusic();
    if (mode === "ai" && game.turn === aiColor) {
      aiThinking = true;
      updateStatus();
      setTimeout(runAI, 200);
    }
  }

  function undo() {
    if (pendingPromotion) return;
    if (history.length === 0) return;
    // In AI mode, undo a full pair (player + computer) so it stays the
    // human's turn.
    let steps = mode === "ai" && !aiThinking ? 2 : 1;
    while (steps-- > 0 && history.length > 0) {
      game = history.pop();
    }
    gameOver = false;
    aiThinking = false;
    clearSelection();
    anim = null;
    invalidate();
    updateStatus();
    updateCaptured();
  }

  // ---- wire up controls -------------------------------------------------
  document.getElementById("new-game").addEventListener("click", newGame);
  document.getElementById("undo").addEventListener("click", undo);
  document.getElementById("flip").addEventListener("click", () => { flipped = !flipped; invalidate(); });

  const modeSel = document.getElementById("mode");
  const sideSel = document.getElementById("side");
  const diffSel = document.getElementById("difficulty");
  const sideWrap = document.getElementById("side-wrap");
  const diffWrap = document.getElementById("diff-wrap");

  function syncOptions() {
    mode = modeSel.value;
    const ai = mode === "ai";
    sideWrap.style.display = ai ? "" : "none";
    diffWrap.style.display = ai ? "" : "none";
    // human side; aiColor is the opposite
    const human = sideSel.value; // 'w' or 'b'
    aiColor = human === "w" ? "b" : "w";
    flipped = human === "b";
    aiLevel = parseInt(diffSel.value, 10);
  }
  modeSel.addEventListener("change", () => { syncOptions(); newGame(); });
  sideSel.addEventListener("change", () => { syncOptions(); newGame(); });
  diffSel.addEventListener("change", () => { aiLevel = parseInt(diffSel.value, 10); });

  // ---- music ------------------------------------------------------------
  const musicBtn = document.getElementById("music");
  function updateMusic() {
    if (mode === "ai" && musicWanted) music.start();
    else music.stop();
  }
  function syncMusicBtn() {
    musicBtn.textContent = "♪ Music: " + (musicWanted ? "On" : "Off");
    musicBtn.classList.toggle("off", !musicWanted);
  }
  musicBtn.addEventListener("click", () => {
    musicWanted = !musicWanted;
    music.setEnabled(musicWanted);
    syncMusicBtn();
    updateMusic();
  });
  syncMusicBtn();

  // pointer events (mouse + touch)
  canvas.addEventListener("pointerdown", (e) => { e.preventDefault(); onDown(e); });
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());

  // ---- start ------------------------------------------------------------
  syncOptions();
  newGame();
  loop();
})();
