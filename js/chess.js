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
  // Logical canvas size. It is taller than wide so the tall pieces standing at
  // the far edge have headroom and the angled board fits below them.
  const VIEW_W = 560;
  const VIEW_H = 600;
  const DPR = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  canvas.width = VIEW_W * DPR;
  canvas.height = VIEW_H * DPR;
  // Let CSS scale the display size (responsive on phones/iOS); the canvas keeps
  // its aspect from the width/height attributes. Pointer math reads the live
  // displayed size, so any scale works.
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
  let sanList = [];          // algebraic notation of each ply, for the record
  let result = "*";          // PGN result: "1-0" / "0-1" / "1/2-1/2" / "*"
  let flipped = false;
  let selected = null;       // [r,c] of selected piece
  let legal = [];            // legal moves for the selected piece
  let dragging = null;       // { from:[r,c], piece, x, y, moved }
  let anim = null;           // { piece, from:[x,y], to:[x,y], t0, dur }
  let captureFlashes = [];   // { sq:[r,c], t0, dur } neon glow where a capture happened
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

  // ---- 3D camera & board geometry --------------------------------------
  // A single, static three-quarter camera looks down at a board lying on the
  // ground plane (y = 0). Files run along X (−3.5 … 3.5), ranks along Z, with
  // larger Z nearer the camera. Pieces are drawn as upright billboards whose
  // size follows the perspective, so they stand up and the near ones are
  // bigger than the far ones.
  const CAM_EYE = [0, 8.6, 9.9];
  const CAM_TGT = [0, 0.2, 0.4];
  const CAM_FOV = 36 * Math.PI / 180;
  const SLAB = 0.62;        // board thickness (world units)
  const FRAME = 0.42;       // border beyond the 8×8 squares
  const PIECE_SCALE = 1.95; // billboard height as a multiple of one square

  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  function lookAt(eye, c, up) {
    const z = norm(sub(eye, c)), x = norm(cross(up, z)), y = cross(z, x);
    return [x[0], x[1], x[2], -dot3(x, eye), y[0], y[1], y[2], -dot3(y, eye), z[0], z[1], z[2], -dot3(z, eye), 0, 0, 0, 1];
  }
  function persp(f, a, n, fa) {
    const t = 1 / Math.tan(f / 2);
    return [t / a, 0, 0, 0, 0, t, 0, 0, 0, 0, (fa + n) / (n - fa), (2 * fa * n) / (n - fa), 0, 0, -1, 0];
  }
  function mul(A, B) {
    const o = new Array(16);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      let s = 0; for (let k = 0; k < 4; k++) s += A[i * 4 + k] * B[k * 4 + j]; o[i * 4 + j] = s;
    }
    return o;
  }
  const VP = mul(persp(CAM_FOV, VIEW_W / VIEW_H, 0.1, 100), lookAt(CAM_EYE, CAM_TGT, [0, 1, 0]));
  function project(x, y, z) {
    const cx = VP[0] * x + VP[1] * y + VP[2] * z + VP[3];
    const cy = VP[4] * x + VP[5] * y + VP[6] * z + VP[7];
    const cw = VP[12] * x + VP[13] * y + VP[14] * z + VP[15];
    return [(cx / cw * 0.5 + 0.5) * VIEW_W, (1 - (cy / cw * 0.5 + 0.5)) * VIEW_H, cw];
  }

  // Precomputed projected geometry (the camera never moves).
  let GRID = [];      // [9][9] corner points
  let CELL = [];      // [fr][fc] -> { quad, cx, cy, ppu }
  let SLAB_FACES = [], FRAME_TOP = [], FRAME_BBOX = [0, 0, 0, 0];
  function precompute() {
    GRID = [];
    for (let gi = 0; gi <= 8; gi++) {
      GRID[gi] = [];
      for (let gj = 0; gj <= 8; gj++) { const p = project(gj - 4, 0, gi - 4); GRID[gi][gj] = [p[0], p[1]]; }
    }
    CELL = [];
    for (let fr = 0; fr < 8; fr++) {
      CELL[fr] = [];
      for (let fc = 0; fc < 8; fc++) {
        const quad = [GRID[fr][fc], GRID[fr][fc + 1], GRID[fr + 1][fc + 1], GRID[fr + 1][fc]];
        const base = project(fc - 3.5, 0, fr - 3.5);
        const top = project(fc - 3.5, 1, fr - 3.5);
        CELL[fr][fc] = { quad, cx: base[0], cy: base[1], ppu: base[1] - top[1] };
      }
    }
    const B = 4 + FRAME;
    const TLt = project(-B, 0, -B), TRt = project(B, 0, -B), NRt = project(B, 0, B), NLt = project(-B, 0, B);
    const TLb = project(-B, -SLAB, -B), TRb = project(B, -SLAB, -B), NRb = project(B, -SLAB, B), NLb = project(-B, -SLAB, B);
    FRAME_TOP = [TLt, TRt, NRt, NLt];
    SLAB_FACES = [
      { pts: [NLt, TLt, TLb, NLb], style: "#5b4430" }, // left face
      { pts: [TRt, NRt, NRb, TRb], style: "#5b4430" }, // right face
      { pts: [NLt, NRt, NRb, NLb], style: "#74502f" }, // near (front) face
    ];
    let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
    for (const p of FRAME_TOP) { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); }
    FRAME_BBOX = [minx, miny, maxx - minx, maxy - miny];
  }

  // board square (r,c) <-> world cell (fr = rank from far, fc = file)
  const cellOf = (r, c) => (flipped ? [7 - r, 7 - c] : [r, c]);
  const boardOf = (fr, fc) => (flipped ? [7 - fr, 7 - fc] : [fr, fc]);
  function squareCenterScreen(r, c) {
    const [fr, fc] = cellOf(r, c);
    const cell = CELL[fr][fc];
    return [cell.cx, cell.cy, cell.ppu];
  }

  function eventXY(e) {
    const rect = canvas.getBoundingClientRect();
    return [((e.clientX - rect.left) / rect.width) * VIEW_W, ((e.clientY - rect.top) / rect.height) * VIEW_H];
  }
  const triSign = (px, py, a, b) => (px - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (py - b[1]);
  function inTri(px, py, a, b, c) {
    const d1 = triSign(px, py, a, b), d2 = triSign(px, py, b, c), d3 = triSign(px, py, c, a);
    const neg = d1 < 0 || d2 < 0 || d3 < 0, pos = d1 > 0 || d2 > 0 || d3 > 0;
    return !(neg && pos);
  }
  const inQuad = (px, py, q) => inTri(px, py, q[0], q[1], q[2]) || inTri(px, py, q[0], q[2], q[3]);

  // Which square's floor is under the cursor (near rows tested first).
  function squareAt(x, y) {
    for (let fr = 7; fr >= 0; fr--) for (let fc = 0; fc < 8; fc++) {
      if (inQuad(x, y, CELL[fr][fc].quad)) return boardOf(fr, fc);
    }
    return null;
  }
  // Pick which of the side-to-move's pieces the cursor is choosing. A standing
  // figure's body rises into the rank behind it, so picking purely by billboard
  // bounds would let a tall near piece "cover" the square behind it. Instead we
  // prefer the piece on the floor tile directly under the cursor, and only fall
  // back to body-overlap (choosing the figure whose base is just below the
  // cursor) when that tile is empty — e.g. when clicking a piece's upper body.
  function pickSquare(x, y) {
    const floor = squareAt(x, y);
    if (floor) {
      const p = game.board[floor[0]][floor[1]];
      if (p && p.c === game.turn) return floor;
    }
    let best = null, bestDy = Infinity;
    for (let fr = 7; fr >= 0; fr--) for (let fc = 0; fc < 8; fc++) {
      const [r, c] = boardOf(fr, fc);
      const p = game.board[r][c];
      if (!p || p.c !== game.turn) continue;
      const cell = CELL[fr][fc], box = cell.ppu * PIECE_SCALE;
      if (x >= cell.cx - box * 0.40 && x <= cell.cx + box * 0.40 &&
          y >= cell.cy - box * 0.80 && y <= cell.cy + box * 0.06) {
        const dy = cell.cy - y; // how far the cursor sits above this base
        if (dy >= 0 && dy < bestDy) { bestDy = dy; best = [r, c]; }
      }
    }
    return best || floor;
  }

  // ---- rendering --------------------------------------------------------
  function beginPoly(pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
  }
  function fillPoly(pts, style) { beginPoly(pts); ctx.fillStyle = style; ctx.fill(); }
  function strokePoly(pts, style, lw) {
    beginPoly(pts); ctx.lineWidth = lw; ctx.strokeStyle = style; ctx.lineJoin = "round"; ctx.stroke();
  }
  function bevelTile(q) {
    const xs = q.map((p) => p[0]), ys = q.map((p) => p[1]);
    const g = ctx.createLinearGradient(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
    g.addColorStop(0, "rgba(255,255,255,0.13)");
    g.addColorStop(0.5, "rgba(255,255,255,0)");
    g.addColorStop(1, "rgba(0,0,0,0.16)");
    fillPoly(q, g);
  }
  // A move marker lying flat on a square's floor (a foreshortened ellipse).
  function markerAt(cell, capture) {
    ctx.beginPath();
    const rr = capture ? cell.ppu * 0.42 : cell.ppu * 0.16;
    ctx.ellipse(cell.cx, cell.cy - cell.ppu * 0.02, rr, rr * 0.52, 0, 0, Math.PI * 2);
    if (capture) { ctx.lineWidth = cell.ppu * 0.08; ctx.strokeStyle = "rgba(40,60,30,0.40)"; ctx.stroke(); }
    else { ctx.fillStyle = "rgba(40,60,30,0.34)"; ctx.fill(); }
  }
  // An upright clay figure standing with its feet at (baseX, baseY).
  function drawFigure(type, color, baseX, baseY, ppu) {
    const box = ppu * PIECE_SCALE;
    P.draw(ctx, type, color, baseX - box / 2, baseY - 0.86 * box, box);
  }
  // A soft arrow across the board floor showing the last move's from → to.
  function drawArrow(a, b, ppu, color) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const head = Math.max(14, ppu * 0.5);
    const lw = Math.max(5, ppu * 0.13);
    const sx = a[0] + ux * ppu * 0.22, sy = a[1] + uy * ppu * 0.22;
    const ex = b[0] - ux * head * 0.7, ey = b[1] - uy * head * 0.7;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    const px = -uy, py = ux; // perpendicular
    ctx.beginPath();
    ctx.moveTo(b[0] - ux * head * 0.15, b[1] - uy * head * 0.15);
    ctx.lineTo(ex - px * head * 0.5, ey - py * head * 0.5);
    ctx.lineTo(ex + px * head * 0.5, ey + py * head * 0.5);
    ctx.closePath();
    ctx.fill();
  }
  // ---- capture explosion ------------------------------------------------
  // A capture detonates the square: a neon panel flash, a white-hot core, an
  // expanding shockwave ring, a burst of glowing embers under gravity, and a
  // short screen shake.
  const EXPLODE_MS = 1000;
  const EMBER_COLORS = ["#ffffff", "#fff7a0", "#ffe14d", "#ffb020", "#ff6a1f", "#ff3b30"];
  function makeExplosion(sq) {
    const [fr, fc] = cellOf(sq[0], sq[1]);
    const cell = CELL[fr][fc];
    const ppu = cell.ppu;
    const ox = cell.cx, oy = cell.cy - ppu * 0.45; // burst from mid-body height
    const parts = [];
    const N = 42;
    for (let i = 0; i < N; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = ppu * (3.0 + Math.random() * 8.5);
      const up = ppu * (2.5 + Math.random() * 5.0); // launch upward
      parts.push({
        x: ox + (Math.random() - 0.5) * ppu * 0.3,
        y: oy + (Math.random() - 0.5) * ppu * 0.3,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - up,
        size: ppu * (0.05 + Math.random() * 0.11),
        color: EMBER_COLORS[(Math.random() * EMBER_COLORS.length) | 0],
        streak: Math.random() < 0.55,
      });
    }
    return { sq, t0: performance.now(), dur: EXPLODE_MS, ox, oy, fx: cell.cx, fy: cell.cy, ppu, parts };
  }

  // pass 1 (under the pieces): the panel itself flares neon yellow
  function drawGlowPanel(cell, k) {
    fillPoly(cell.quad, `rgba(238,255,0,${0.72 * k})`);
    fillPoly(cell.quad, `rgba(255,255,200,${0.42 * k})`);
  }

  // pass 2 (over the pieces): flash + shockwave + embers
  function drawExplosion(exp, now) {
    const el = now - exp.t0;
    const k = 1 - el / exp.dur;
    if (k <= 0) return;
    const t = el / 1000; // seconds
    const ppu = exp.ppu;
    const GRAV = ppu * 22;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // white-hot core flash (very brief)
    const fa = Math.max(0, 1 - el / 150);
    if (fa > 0) {
      const fg = ctx.createRadialGradient(exp.ox, exp.oy, 1, exp.ox, exp.oy, ppu * 2.4);
      fg.addColorStop(0, `rgba(255,255,255,${0.95 * fa})`);
      fg.addColorStop(0.4, `rgba(255,235,130,${0.7 * fa})`);
      fg.addColorStop(1, "rgba(255,200,0,0)");
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.ellipse(exp.ox, exp.oy, ppu * 2.4, ppu * 1.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // lingering neon bloom
    const flick = 0.7 + 0.3 * Math.sin(now / 35);
    const bg = ctx.createRadialGradient(exp.ox, exp.oy, 1, exp.ox, exp.oy, ppu * 1.7);
    bg.addColorStop(0, `rgba(255,255,200,${0.7 * k * flick})`);
    bg.addColorStop(0.4, `rgba(240,255,0,${0.5 * k * flick})`);
    bg.addColorStop(1, "rgba(240,255,0,0)");
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.ellipse(exp.ox, exp.oy, ppu * 1.7, ppu * 1.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // expanding shockwave ring on the floor (foreshortened)
    const rt = Math.min(1, el / 480);
    if (rt < 1) {
      const rr = ppu * (0.3 + rt * 2.4);
      ctx.strokeStyle = `rgba(255,240,150,${(1 - rt) * 0.8})`;
      ctx.lineWidth = Math.max(1.5, ppu * 0.16 * (1 - rt));
      ctx.beginPath();
      ctx.ellipse(exp.fx, exp.fy, rr, rr * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // glowing embers, launched outward and falling under gravity
    for (const p of exp.parts) {
      const px = p.x + p.vx * t;
      const py = p.y + p.vy * t + 0.5 * GRAV * t * t;
      ctx.globalAlpha = Math.max(0, k);
      ctx.strokeStyle = p.color;
      ctx.fillStyle = p.color;
      if (p.streak) {
        ctx.lineWidth = p.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - p.vx * 0.035, py - (p.vy + GRAV * t) * 0.035);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // brief screen shake while any explosion is fresh
  function captureShake() {
    let mx = 0, my = 0;
    const now = performance.now();
    for (const f of captureFlashes) {
      const el = now - f.t0;
      if (el < 280) {
        const m = (1 - el / 280) * 9;
        mx += (Math.random() - 0.5) * m;
        my += (Math.random() - 0.5) * m;
      }
    }
    return [mx, my];
  }
  function drawLabels() {
    ctx.fillStyle = "rgba(40,28,20,0.6)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 13px 'Trebuchet MS', sans-serif";
    for (let fc = 0; fc < 8; fc++) {
      const [, c] = boardOf(7, fc);
      const p = project(fc - 3.5, 0, 4 + FRAME * 0.55);
      ctx.fillText("abcdefgh"[c], p[0], p[1]);
    }
    for (let fr = 0; fr < 8; fr++) {
      const [r] = boardOf(fr, 0);
      const p = project(-4 - FRAME * 0.55, 0, fr - 3.5);
      ctx.fillText(String(8 - r), p[0], p[1]);
    }
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function drawBoard() {
    ctx.clearRect(0, 0, VIEW_W, VIEW_H);

    // screen shake on a fresh capture (transform restored at the end)
    const [shx, shy] = captureShake();
    ctx.save();
    if (shx || shy) ctx.translate(shx, shy);

    const kingPos = C.inCheck(game, game.turn) ? C.findKing(game.board, game.turn) : null;
    const lm = game.lastMove;

    // the board as a thick 3D slab: side faces, then the framed top
    for (const f of SLAB_FACES) fillPoly(f.pts, f.style);
    fillPoly(FRAME_TOP, "#a9794d");
    strokePoly(FRAME_TOP, "rgba(40,26,16,0.5)", 2);

    // tiles, drawn far → near
    for (let fr = 0; fr < 8; fr++) {
      for (let fc = 0; fc < 8; fc++) {
        const cell = CELL[fr][fc], q = cell.quad;
        const [r, c] = boardOf(fr, fc);
        fillPoly(q, (r + c) % 2 === 0 ? LIGHT : DARK);
        bevelTile(q);
        strokePoly(q, "rgba(60,38,28,0.30)", 1);
        if (lm && ((lm.from[0] === r && lm.from[1] === c) || (lm.to[0] === r && lm.to[1] === c)))
          fillPoly(q, "rgba(120,180,90,0.35)");
        if (selected && selected[0] === r && selected[1] === c) fillPoly(q, "rgba(255,221,120,0.55)");
        if (kingPos && kingPos[0] === r && kingPos[1] === c) fillPoly(q, "rgba(220,70,70,0.45)");
      }
    }

    // matte clay grain, clipped to the board surface
    ctx.save();
    beginPoly(FRAME_TOP);
    ctx.clip();
    ctx.globalAlpha = 0.5;
    ctx.globalCompositeOperation = "overlay";
    ctx.drawImage(noiseCanvas, FRAME_BBOX[0], FRAME_BBOX[1], FRAME_BBOX[2], FRAME_BBOX[3]);
    ctx.restore();

    drawLabels();

    // last-move arrow on the floor (hidden while dragging to avoid clutter)
    if (lm && !dragging) {
      const [ffr, ffc] = cellOf(lm.from[0], lm.from[1]);
      const [tfr, tfc] = cellOf(lm.to[0], lm.to[1]);
      const A = CELL[ffr][ffc], B = CELL[tfr][tfc];
      drawArrow([A.cx, A.cy], [B.cx, B.cy], B.ppu, "rgba(243,201,93,0.55)");
    }

    // neon capture flares — panel glow under the pieces (bloom drawn later)
    for (const f of captureFlashes) {
      const k = 1 - (performance.now() - f.t0) / f.dur;
      if (k <= 0) continue;
      const [fr, fc] = cellOf(f.sq[0], f.sq[1]);
      drawGlowPanel(CELL[fr][fc], k);
    }

    // legal-move markers on the floor
    for (const m of legal) {
      const [fr, fc] = cellOf(m.to[0], m.to[1]);
      markerAt(CELL[fr][fc], m.capture);
    }

    // standing pieces, drawn far → near so nearer figures overlap farther ones
    for (let fr = 0; fr < 8; fr++) {
      for (let fc = 0; fc < 8; fc++) {
        const [r, c] = boardOf(fr, fc);
        const p = game.board[r][c];
        if (!p) continue;
        if (dragging && dragging.from[0] === r && dragging.from[1] === c) continue; // lifted
        if (anim && anim.to[0] === r && anim.to[1] === c) continue; // animating in
        const cell = CELL[fr][fc];
        drawFigure(p.t, p.c, cell.cx, cell.cy, cell.ppu);
      }
    }

    // sliding animation with a little hop
    if (anim) {
      const t = Math.min(1, (performance.now() - anim.t0) / anim.dur);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const a = squareCenterScreen(anim.from[0], anim.from[1]);
      const b = squareCenterScreen(anim.to[0], anim.to[1]);
      const x = a[0] + (b[0] - a[0]) * e;
      const y = a[1] + (b[1] - a[1]) * e;
      const ppu = a[2] + (b[2] - a[2]) * e;
      drawFigure(anim.piece.t, anim.piece.c, x, y - Math.sin(e * Math.PI) * ppu * 0.25, ppu);
      if (t >= 1) anim = null;
    }

    // the dragged piece follows the cursor, sized for the square it hovers
    if (dragging) {
      const [ffr, ffc] = cellOf(dragging.from[0], dragging.from[1]);
      let ppu = CELL[ffr][ffc].ppu;
      const sq = squareAt(dragging.x, dragging.y);
      if (sq) { const [hr, hc] = cellOf(sq[0], sq[1]); ppu = CELL[hr][hc].ppu; }
      drawFigure(dragging.piece.t, dragging.piece.c, dragging.x, dragging.y + ppu * 0.25, ppu);
    }

    // capture explosions — flash, shockwave and embers over the pieces
    if (captureFlashes.length) {
      const now = performance.now();
      for (const f of captureFlashes) drawExplosion(f, now);
      captureFlashes = captureFlashes.filter((f) => now - f.t0 < f.dur);
    }

    ctx.restore(); // end screen-shake transform
  }

  function loop() {
    // Repaint only when needed: on a change, or while dragging/animating/flaring.
    const flaring = captureFlashes.length > 0;
    if (dirty || dragging || anim || flaring) {
      drawBoard();
      if (!dragging && !anim && captureFlashes.length === 0) dirty = false;
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
    const [x, y] = eventXY(e);
    const tile = squareAt(x, y);

    // If a piece is already selected and a legal destination is clicked → move.
    if (selected && tile) {
      const m = legal.find((mm) => mm.to[0] === tile[0] && mm.to[1] === tile[1]);
      if (m) { commitMove(selected, tile); clearSelection(); return; }
    }

    if (!humanToMove()) { clearSelection(); return; }

    // Pick up the standing figure under the cursor.
    const pk = pickSquare(x, y);
    if (pk) {
      const p = game.board[pk[0]][pk[1]];
      if (p && p.c === game.turn) {
        selected = pk;
        legal = C.legalMoves(game, pk);
        dragging = { from: pk, piece: p, x, y, moved: false };
        canvas.classList.add("grabbing");
        if (window.ChessSFX) window.ChessSFX.play("select");
        invalidate();
        return;
      }
    }
    clearSelection();
  }

  function onMove(e) {
    if (!dragging) return;
    const [x, y] = eventXY(e);
    dragging.x = x;
    dragging.y = y;
    dragging.moved = true;
  }

  function onUp(e) {
    canvas.classList.remove("grabbing");
    if (!dragging) return;
    const drag = dragging;
    dragging = null;
    invalidate(); // the lifted piece must be repainted onto a square again
    const tile = squareAt(...eventXY(e));
    if (tile) {
      const m = legal.find((mm) => mm.to[0] === tile[0] && mm.to[1] === tile[1]);
      if (m) {
        // A drag drop: move with no slide animation (piece is already there).
        commitMove(drag.from, tile, { animate: !drag.moved });
        clearSelection();
        return;
      }
      // Dropped on its own square → keep it selected (click-to-move mode).
      if (drag.from[0] === tile[0] && drag.from[1] === tile[1] && drag.moved === false) {
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
    const willCapture = !!game.board[move.to[0]][move.to[1]] || move.enpassant;
    const san = sanOf(game, move);
    history.push(C.cloneState(game));
    sanList.push(san);
    if (animate) {
      anim = {
        piece,
        from: [move.from[0], move.from[1]],
        to: [move.to[0], move.to[1]],
        t0: performance.now(),
        dur: 200,
      };
    }
    game = C.applyMove(game, move);
    if (willCapture) {
      captureFlashes.push(makeExplosion([move.to[0], move.to[1]]));
    }
    invalidate();
    renderMoves();
    playMoveSound(move, willCapture);
    afterMove();
  }

  // Standard algebraic notation for a move, evaluated against the position
  // *before* it is played (so disambiguation and capture detection are correct).
  function sanOf(state, move) {
    let s;
    if (move.castle === "K") s = "O-O";
    else if (move.castle === "Q") s = "O-O-O";
    else {
      const board = state.board;
      const piece = board[move.from[0]][move.from[1]];
      const capture = !!board[move.to[0]][move.to[1]] || move.enpassant;
      const dest = C.algebraic(move.to);
      if (piece.t === "p") {
        s = (capture ? "abcdefgh"[move.from[1]] + "x" : "") + dest;
        if (move.promotion) s += "=" + move.promotion.toUpperCase();
      } else {
        s = piece.t.toUpperCase();
        // disambiguate when another identical piece can also reach the square
        const others = C.legalMoves(state).filter((m) => {
          const pp = state.board[m.from[0]][m.from[1]];
          return pp && pp.t === piece.t && pp.c === piece.c &&
            m.to[0] === move.to[0] && m.to[1] === move.to[1] &&
            !(m.from[0] === move.from[0] && m.from[1] === move.from[1]);
        });
        if (others.length) {
          const sameFile = others.some((m) => m.from[1] === move.from[1]);
          const sameRank = others.some((m) => m.from[0] === move.from[0]);
          if (!sameFile) s += "abcdefgh"[move.from[1]];
          else if (!sameRank) s += String(8 - move.from[0]);
          else s += "abcdefgh"[move.from[1]] + String(8 - move.from[0]);
        }
        if (capture) s += "x";
        s += dest;
      }
    }
    const next = C.applyMove(state, move);
    if (C.status(next) === "checkmate") s += "#";
    else if (C.inCheck(next, next.turn)) s += "+";
    return s;
  }

  function playMoveSound(move, willCapture) {
    const sfx = window.ChessSFX;
    if (!sfx) return;
    if (move.castle) sfx.play("castle");
    else if (move.promotion) sfx.play("promote");
    else if (willCapture) sfx.play("capture");
    else sfx.play("move");
    // an end-of-move flourish, layered just after the placement sound
    const st = C.status(game);
    if (st === "checkmate") setTimeout(() => sfx.play("win"), 140);
    else if (st === "stalemate" || st === "draw50" || st === "insufficient") setTimeout(() => sfx.play("draw"), 140);
    else if (st === "check") setTimeout(() => sfx.play("check"), 90);
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
      const winner = game.turn === "w" ? "b" : "w";
      const name = winner === "w" ? "White" : "Black";
      statusEl.textContent = `Checkmate — ${name} wins!`;
      gameOver = true;
      result = winner === "w" ? "1-0" : "0-1";
      showEndgame("Checkmate!", `${name} (${winner === "w" ? "Sunlit" : "Twilight"}) wins`, winner);
    } else if (st === "stalemate") {
      statusEl.textContent = "Stalemate — it's a draw.";
      gameOver = true;
      result = "1/2-1/2";
      showEndgame("Stalemate", "A draw — no legal moves", null);
    } else if (st === "draw50") {
      statusEl.textContent = "Draw — 50-move rule.";
      gameOver = true;
      result = "1/2-1/2";
      showEndgame("Draw", "50-move rule", null);
    } else if (st === "insufficient") {
      statusEl.textContent = "Draw — insufficient material.";
      gameOver = true;
      result = "1/2-1/2";
      showEndgame("Draw", "Insufficient material", null);
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

  // ---- move list --------------------------------------------------------
  const movesEl = document.getElementById("moves");
  function renderMoves() {
    if (!movesEl) return;
    if (sanList.length === 0) {
      movesEl.innerHTML = '<div class="moves-empty">No moves yet</div>';
      return;
    }
    let html = "";
    for (let i = 0; i < sanList.length; i += 2) {
      const n = i / 2 + 1;
      const w = sanList[i];
      const b = sanList[i + 1] || "";
      const last = i + 1 >= sanList.length - 1;
      html += `<div class="move-row">
        <span class="move-no">${n}.</span>
        <span class="ply${i === sanList.length - 1 ? " current" : ""}">${w}</span>
        <span class="ply${i + 1 === sanList.length - 1 ? " current" : ""}">${b}</span>
      </div>`;
      void last;
    }
    movesEl.innerHTML = html;
    movesEl.scrollTop = movesEl.scrollHeight;
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

  // ---- end-game overlay -------------------------------------------------
  const endgameEl = document.getElementById("endgame");
  let endgameShown = false;
  function showEndgame(title, subtitle, winnerColor) {
    if (endgameShown) return;
    endgameShown = true;
    endgameEl.innerHTML = "";
    const card = document.createElement("div");
    card.className = "end-card";
    if (winnerColor) {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 110;
      P.draw(cv.getContext("2d"), "k", winnerColor, 0, 0, 110); // the victorious Noctis
      card.appendChild(cv);
    }
    const h = document.createElement("div");
    h.className = "end-title";
    h.textContent = title;
    const s = document.createElement("div");
    s.className = "end-sub";
    s.textContent = subtitle;
    const btn = document.createElement("button");
    btn.className = "primary";
    btn.textContent = "New Game";
    btn.addEventListener("click", newGame);
    card.append(h, s, btn);
    endgameEl.appendChild(card);
    endgameEl.classList.remove("hidden");
  }
  function hideEndgame() {
    endgameShown = false;
    endgameEl.classList.add("hidden");
  }

  // ---- resign / draw / PGN ----------------------------------------------
  function flashStatus(msg) {
    statusEl.textContent = msg;
    setTimeout(() => { if (!gameOver) updateStatus(); }, 1700);
  }

  function resign() {
    if (gameOver || aiThinking) return;
    const loser = game.turn;              // the side to move concedes
    const winner = loser === "w" ? "b" : "w";
    const name = winner === "w" ? "White" : "Black";
    result = winner === "w" ? "1-0" : "0-1";
    gameOver = true;
    statusEl.textContent = `${name} wins by resignation`;
    showEndgame("Resignation", `${name} wins`, winner);
  }

  function acceptDraw(subtitle) {
    result = "1/2-1/2";
    gameOver = true;
    statusEl.textContent = "Draw agreed";
    if (window.ChessSFX) window.ChessSFX.play("draw");
    showEndgame("Draw", subtitle, null);
  }

  function offerDraw() {
    if (gameOver || aiThinking) return;
    if (mode !== "ai") { acceptDraw("Agreed between players"); return; }
    // The computer accepts only when it is not better than roughly level.
    const evalForAI = (aiColor === "w" ? 1 : -1) * evaluate(game);
    if (evalForAI <= 60) acceptDraw("The computer accepts your draw");
    else flashStatus("The computer declines the draw.");
  }

  function buildPGN() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const date = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
    let white, black;
    if (mode === "ai") {
      const cpu = `Computer (Level ${aiLevel})`;
      if (aiColor === "w") { white = cpu; black = "Player"; }
      else { white = "Player"; black = cpu; }
    } else { white = "Player 1 (White)"; black = "Player 2 (Black)"; }
    let mt = "";
    for (let i = 0; i < sanList.length; i += 2) {
      mt += `${i / 2 + 1}. ${sanList[i]}${sanList[i + 1] ? " " + sanList[i + 1] : ""} `;
    }
    mt = (mt + result).trim();
    return `[Event "Final Fantasy Chess"]\n[Site "Final Fantasy Chess"]\n[Date "${date}"]\n` +
      `[White "${white}"]\n[Black "${black}"]\n[Result "${result}"]\n\n${mt}\n`;
  }

  function flashBtn(btn, txt) {
    const old = btn.dataset.label || btn.textContent;
    btn.dataset.label = old;
    btn.textContent = txt;
    setTimeout(() => { btn.textContent = btn.dataset.label; }, 1400);
  }

  function copyPGN(btn) {
    const pgn = buildPGN();
    const done = () => flashBtn(btn, "Copied!");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pgn).then(done).catch(() => legacyCopy(pgn, btn));
    } else {
      legacyCopy(pgn, btn);
    }
  }
  function legacyCopy(text, btn) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      flashBtn(btn, "Copied!");
    } catch (e) {
      flashBtn(btn, "Copy failed");
    }
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
    sanList = [];
    result = "*";
    renderMoves();
    clearSelection();
    anim = null;
    captureFlashes = [];
    pendingPromotion = null;
    promoEl.classList.add("hidden");
    hideEndgame();
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
      sanList.pop();
    }
    hideEndgame();
    gameOver = false;
    aiThinking = false;
    clearSelection();
    anim = null;
    captureFlashes = [];
    invalidate();
    renderMoves();
    updateStatus();
    updateCaptured();
  }

  // ---- wire up controls -------------------------------------------------
  document.getElementById("new-game").addEventListener("click", newGame);
  document.getElementById("undo").addEventListener("click", undo);
  document.getElementById("flip").addEventListener("click", () => { flipped = !flipped; invalidate(); });
  document.getElementById("resign").addEventListener("click", resign);
  document.getElementById("draw").addEventListener("click", offerDraw);
  document.getElementById("pgn").addEventListener("click", (e) => copyPGN(e.currentTarget));

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
  precompute();
  syncOptions();
  newGame();
  loop();
})();
