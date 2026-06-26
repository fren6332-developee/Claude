/*
 * Piece artwork — Final Fantasy characters drawn in a soft Studio Ghibli
 * style, painted procedurally on a 2D canvas (no image files).
 *
 *   Knight  → Cecil Harvey  (Final Fantasy IV)
 *   Bishop  → Strago        (Final Fantasy VI)
 *   Rook    → Barret        (Final Fantasy VII)
 *   Queen   → Aerith        (Final Fantasy VII)
 *   King    → Noctis        (Final Fantasy XV)
 *   Pawn    → Imp           (Final Fantasy IV)
 *
 * White and Black armies share the same characters; the side is shown by the
 * colour of the little platform each figure stands on and a gentle palette
 * shift (sunlit for White, twilight for Black).
 *
 * Exposes window.Pieces.draw(ctx, type, color, x, y, size).
 */
(function () {
  "use strict";

  // ---- small colour utilities -------------------------------------------
  function hexToRgb(h) {
    h = h.replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function rgbToHex(r, g, b) {
    const f = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
    return "#" + f(r) + f(g) + f(b);
  }
  function mix(a, b, t) {
    const A = hexToRgb(a), B = hexToRgb(b);
    return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
  }
  function shade(h, amt) {
    // amt < 0 darkens, amt > 0 lightens
    return amt < 0 ? mix(h, "#000000", -amt) : mix(h, "#ffffff", amt);
  }

  const OUTLINE = "#3b2a26"; // warm Ghibli ink, not pure black

  // For the Black army, nudge each fabric colour toward a cool twilight so the
  // two sides read differently even at a glance.
  function sideTint(hex, color) {
    return color === "b" ? shade(mix(hex, "#33365f", 0.32), -0.1) : hex;
  }

  // ---- claymation shading -----------------------------------------------
  // Every solid colour is painted as a soft, modelled lump of clay: a single
  // top-left light source gives each shape a rounded highlight-to-shadow
  // gradient, so the figures read as three-dimensional sculpts.
  function clayRadial(ctx, cx, cy, rad, base) {
    rad = Math.max(rad, 2);
    const hx = cx - rad * 0.36, hy = cy - rad * 0.42;
    const g = ctx.createRadialGradient(hx, hy, rad * 0.08, cx, cy, rad * 1.18);
    g.addColorStop(0, shade(base, 0.36));
    g.addColorStop(0.45, base);
    g.addColorStop(1, shade(base, -0.32));
    return g;
  }
  const isHex = (v) => typeof v === "string" && v[0] === "#";

  // ---- generic drawing helpers ------------------------------------------
  function ellipse(ctx, cx, cy, rx, ry, fill, stroke, lw) {
    const rad = Math.max(rx, ry);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = isHex(fill) && rad >= 5 ? clayRadial(ctx, cx, cy, rad, fill) : fill;
      ctx.fill();
    }
    if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
    // glossy clay sheen on sizeable rounded shapes
    if (isHex(fill) && rad >= 11) {
      ctx.beginPath();
      ctx.ellipse(cx - rx * 0.3, cy - ry * 0.42, rx * 0.36, ry * 0.26, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.20)";
      ctx.fill();
    }
  }

  function blob(ctx, pts, fill, stroke, lw) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    if (fill) {
      let f = fill;
      if (isHex(fill)) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const p of pts) {
          if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0];
          if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1];
        }
        const rad = Math.max(maxX - minX, maxY - minY) / 2;
        f = clayRadial(ctx, (minX + maxX) / 2, (minY + maxY) / 2, Math.max(rad, 4), fill);
      }
      ctx.fillStyle = f;
      ctx.fill();
    }
    if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = "round"; ctx.stroke(); }
  }

  // A friendly pair of Ghibli eyes + soft blush.
  function face(ctx, cx, eyeY, S, eyeGap, opts) {
    opts = opts || {};
    const er = S * (opts.size || 0.045);
    for (const s of [-1, 1]) {
      const ex = cx + s * eyeGap;
      // eye
      ellipse(ctx, ex, eyeY, er, er * 1.35, "#3a2b3a", null, 0);
      // highlight
      ellipse(ctx, ex + er * 0.35, eyeY - er * 0.5, er * 0.4, er * 0.45, "#ffffff", null, 0);
    }
    if (opts.blush !== false) {
      ellipse(ctx, cx - eyeGap * 1.7, eyeY + er * 1.6, er * 1.1, er * 0.7, "rgba(232,140,150,0.55)", null, 0);
      ellipse(ctx, cx + eyeGap * 1.7, eyeY + er * 1.6, er * 1.1, er * 0.7, "rgba(232,140,150,0.55)", null, 0);
    }
    if (opts.smile !== false) {
      ctx.beginPath();
      ctx.arc(cx, eyeY + er * 1.7, eyeGap * 0.6, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.lineWidth = S * 0.012;
      ctx.strokeStyle = "#7a4a44";
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }

  // The coloured platform that marks which army a piece belongs to.
  function platform(ctx, cx, cy, S, color) {
    const top = color === "w" ? "#f6efda" : "#33345e";
    const bot = color === "w" ? "#d9c391" : "#1f2042";
    const rim = color === "w" ? "#caa85a" : "#7d79c4";
    // soft cast shadow on the board so the sculpt looks like it stands above it
    const sg = ctx.createRadialGradient(cx + S * 0.03, cy + S * 0.05, S * 0.03, cx + S * 0.03, cy + S * 0.05, S * 0.4);
    sg.addColorStop(0, "rgba(25,16,28,0.42)");
    sg.addColorStop(1, "rgba(25,16,28,0)");
    ctx.beginPath();
    ctx.ellipse(cx + S * 0.03, cy + S * 0.05, S * 0.4, S * 0.13, 0, 0, Math.PI * 2);
    ctx.fillStyle = sg;
    ctx.fill();
    const g = ctx.createLinearGradient(cx, cy - S * 0.06, cx, cy + S * 0.07);
    g.addColorStop(0, top); g.addColorStop(1, bot);
    ellipse(ctx, cx, cy, S * 0.3, S * 0.09, g, rim, S * 0.014);
    ellipse(ctx, cx, cy - S * 0.012, S * 0.3, S * 0.09, "rgba(255,255,255,0.12)", null, 0);
  }

  // ---- characters -------------------------------------------------------
  // Each receives (ctx, cx, S, color) where cx is the horizontal centre and
  // the figure is drawn standing on a platform near the bottom of the square.

  function drawCecil(ctx, cx, S, color) {
    const lw = S * 0.026;
    const baseY = S * 0.86;
    platform(ctx, cx, baseY, S, color);
    const cape = sideTint(color === "w" ? "#4a63a8" : "#7a3050", color === "b" ? "w" : "w");
    const armor = sideTint("#cdd6e2", color);
    const armorDk = shade(armor, -0.25);
    const plume = sideTint(color === "w" ? "#7fc6e6" : "#e2627a", "w");

    // cape behind
    blob(ctx, [
      [cx - S * 0.2, S * 0.4], [cx + S * 0.2, S * 0.4],
      [cx + S * 0.26, baseY - S * 0.04], [cx - S * 0.26, baseY - S * 0.04],
    ], cape, OUTLINE, lw);

    // armored body / pauldrons
    blob(ctx, [
      [cx - S * 0.13, S * 0.46], [cx + S * 0.13, S * 0.46],
      [cx + S * 0.2, baseY - S * 0.02], [cx - S * 0.2, baseY - S * 0.02],
    ], armor, OUTLINE, lw);
    ellipse(ctx, cx - S * 0.16, S * 0.49, S * 0.09, S * 0.07, armorDk, OUTLINE, lw); // L pauldron
    ellipse(ctx, cx + S * 0.16, S * 0.49, S * 0.09, S * 0.07, armorDk, OUTLINE, lw); // R pauldron
    // chest emblem
    ellipse(ctx, cx, S * 0.6, S * 0.05, S * 0.06, plume, OUTLINE, lw * 0.8);

    // head + silver hair
    const skin = "#f0cda6";
    ellipse(ctx, cx, S * 0.34, S * 0.12, S * 0.13, skin, OUTLINE, lw);
    // flowing silver hair
    blob(ctx, [
      [cx - S * 0.13, S * 0.3], [cx - S * 0.16, S * 0.5],
      [cx - S * 0.08, S * 0.46], [cx - S * 0.05, S * 0.3],
    ], "#e7e9ef", OUTLINE, lw * 0.8);
    blob(ctx, [
      [cx + S * 0.13, S * 0.3], [cx + S * 0.16, S * 0.5],
      [cx + S * 0.08, S * 0.46], [cx + S * 0.05, S * 0.3],
    ], "#e7e9ef", OUTLINE, lw * 0.8);

    // helmet crown with a soft plume
    blob(ctx, [
      [cx - S * 0.12, S * 0.27], [cx + S * 0.12, S * 0.27],
      [cx + S * 0.1, S * 0.21], [cx - S * 0.1, S * 0.21],
    ], armor, OUTLINE, lw);
    ellipse(ctx, cx, S * 0.18, S * 0.035, S * 0.06, plume, OUTLINE, lw * 0.7); // plume
    face(ctx, cx, S * 0.35, S, S * 0.045);
  }

  function drawStrago(ctx, cx, S, color) {
    const lw = S * 0.026;
    const baseY = S * 0.86;
    platform(ctx, cx, baseY, S, color);
    const robe = sideTint("#3f6fb0", color);
    const robeDk = shade(robe, -0.22);
    const hat = sideTint("#345fa0", color);

    // long robe (bell shape)
    blob(ctx, [
      [cx - S * 0.1, S * 0.46], [cx + S * 0.1, S * 0.46],
      [cx + S * 0.22, baseY - S * 0.02], [cx - S * 0.22, baseY - S * 0.02],
    ], robe, OUTLINE, lw);
    // robe hem trim
    blob(ctx, [
      [cx - S * 0.22, baseY - S * 0.06], [cx + S * 0.22, baseY - S * 0.06],
      [cx + S * 0.22, baseY - S * 0.02], [cx - S * 0.22, baseY - S * 0.02],
    ], robeDk, null, 0);
    // sleeve / arm holding a staff
    ellipse(ctx, cx + S * 0.18, S * 0.6, S * 0.05, S * 0.08, robeDk, OUTLINE, lw * 0.8);
    ctx.beginPath();
    ctx.moveTo(cx + S * 0.24, S * 0.42);
    ctx.lineTo(cx + S * 0.24, baseY - S * 0.04);
    ctx.lineWidth = lw * 1.1; ctx.strokeStyle = "#7a5230"; ctx.lineCap = "round"; ctx.stroke();
    ellipse(ctx, cx + S * 0.24, S * 0.4, S * 0.04, S * 0.045, "#7fe0d0", OUTLINE, lw * 0.7); // orb

    // head + long white beard
    const skin = "#e9c39c";
    ellipse(ctx, cx, S * 0.36, S * 0.105, S * 0.115, skin, OUTLINE, lw);
    blob(ctx, [
      [cx - S * 0.09, S * 0.4], [cx + S * 0.09, S * 0.4],
      [cx + S * 0.05, S * 0.56], [cx, S * 0.6], [cx - S * 0.05, S * 0.56],
    ], "#eef0f4", OUTLINE, lw * 0.9); // beard
    // tall pointed wizard hat, slightly drooping
    blob(ctx, [
      [cx - S * 0.14, S * 0.28], [cx + S * 0.14, S * 0.28],
      [cx + S * 0.08, S * 0.06], [cx + S * 0.12, S * 0.04],
    ], hat, OUTLINE, lw);
    blob(ctx, [
      [cx - S * 0.16, S * 0.3], [cx + S * 0.16, S * 0.3],
      [cx + S * 0.16, S * 0.26], [cx - S * 0.16, S * 0.26],
    ], shade(hat, 0.15), OUTLINE, lw * 0.8); // brim
    face(ctx, cx, S * 0.35, S, S * 0.04, { smile: false });
  }

  function drawBarret(ctx, cx, S, color) {
    const lw = S * 0.028;
    const baseY = S * 0.86;
    platform(ctx, cx, baseY, S, color);
    const vest = sideTint("#4f6b3c", color);
    const vestDk = shade(vest, -0.25);
    const skin = "#6f4a31";
    const gun = sideTint("#9aa1ad", color);

    // very broad fortress-like torso
    blob(ctx, [
      [cx - S * 0.22, S * 0.5], [cx + S * 0.22, S * 0.5],
      [cx + S * 0.24, baseY - S * 0.02], [cx - S * 0.24, baseY - S * 0.02],
    ], vest, OUTLINE, lw);
    // vest opening
    blob(ctx, [
      [cx - S * 0.06, S * 0.5], [cx + S * 0.06, S * 0.5],
      [cx + S * 0.03, baseY - S * 0.06], [cx - S * 0.03, baseY - S * 0.06],
    ], shade(skin, 0.05), null, 0);
    // big shoulders
    ellipse(ctx, cx - S * 0.21, S * 0.52, S * 0.08, S * 0.09, skin, OUTLINE, lw);
    // gun-arm on the right
    blob(ctx, [
      [cx + S * 0.16, S * 0.5], [cx + S * 0.28, S * 0.52],
      [cx + S * 0.28, S * 0.78], [cx + S * 0.16, S * 0.78],
    ], gun, OUTLINE, lw);
    ellipse(ctx, cx + S * 0.22, S * 0.8, S * 0.07, S * 0.05, shade(gun, -0.2), OUTLINE, lw); // muzzle

    // head: dark skin, beard, bandana, shades
    ellipse(ctx, cx, S * 0.34, S * 0.12, S * 0.125, skin, OUTLINE, lw);
    blob(ctx, [
      [cx - S * 0.1, S * 0.36], [cx + S * 0.1, S * 0.36],
      [cx + S * 0.07, S * 0.48], [cx - S * 0.07, S * 0.48],
    ], "#241a14", OUTLINE, lw * 0.8); // beard
    // bandana
    blob(ctx, [
      [cx - S * 0.12, S * 0.28], [cx + S * 0.12, S * 0.28],
      [cx + S * 0.12, S * 0.22], [cx - S * 0.12, S * 0.22],
    ], sideTint("#7a4a2a", color), OUTLINE, lw * 0.9);
    // sunglasses
    ellipse(ctx, cx - S * 0.05, S * 0.34, S * 0.035, S * 0.03, "#15161c", null, 0);
    ellipse(ctx, cx + S * 0.05, S * 0.34, S * 0.035, S * 0.03, "#15161c", null, 0);
    ctx.beginPath();
    ctx.moveTo(cx - S * 0.015, S * 0.34); ctx.lineTo(cx + S * 0.015, S * 0.34);
    ctx.lineWidth = lw * 0.7; ctx.strokeStyle = "#15161c"; ctx.stroke();
    ellipse(ctx, cx - S * 0.06, S * 0.33, S * 0.012, S * 0.01, "#9fd8ff", null, 0); // glint
  }

  function drawAerith(ctx, cx, S, color) {
    const lw = S * 0.026;
    const baseY = S * 0.86;
    platform(ctx, cx, baseY, S, color);
    const dress = sideTint("#e88aa6", color);
    const jacket = sideTint("#c0473a", color);
    const hair = "#6f4a2c";

    // long braid down one side
    blob(ctx, [
      [cx + S * 0.08, S * 0.34], [cx + S * 0.18, S * 0.5],
      [cx + S * 0.16, S * 0.74], [cx + S * 0.08, S * 0.74], [cx + S * 0.04, S * 0.42],
    ], hair, OUTLINE, lw * 0.8);
    for (let i = 0; i < 3; i++) {
      ellipse(ctx, cx + S * 0.12, S * (0.52 + i * 0.07), S * 0.045, S * 0.035, shade(hair, -0.12), null, 0);
    }

    // flowing pink dress (bell)
    blob(ctx, [
      [cx - S * 0.1, S * 0.52], [cx + S * 0.1, S * 0.52],
      [cx + S * 0.2, baseY - S * 0.02], [cx - S * 0.2, baseY - S * 0.02],
    ], dress, OUTLINE, lw);
    // red bolero jacket / bodice
    blob(ctx, [
      [cx - S * 0.12, S * 0.46], [cx + S * 0.12, S * 0.46],
      [cx + S * 0.1, S * 0.6], [cx - S * 0.1, S * 0.6],
    ], jacket, OUTLINE, lw);

    // head + hair
    const skin = "#f3cfa6";
    ellipse(ctx, cx, S * 0.34, S * 0.11, S * 0.12, skin, OUTLINE, lw);
    blob(ctx, [
      [cx - S * 0.12, S * 0.32], [cx - S * 0.13, S * 0.16],
      [cx, S * 0.18], [cx + S * 0.13, S * 0.16], [cx + S * 0.12, S * 0.32],
      [cx + S * 0.1, S * 0.24], [cx, S * 0.22], [cx - S * 0.1, S * 0.24],
    ], hair, OUTLINE, lw * 0.9);
    // pink ribbon + tiny flower crown (Queen)
    ellipse(ctx, cx, S * 0.19, S * 0.03, S * 0.025, "#f6a9c4", OUTLINE, lw * 0.7);
    for (let i = -1; i <= 1; i++) {
      ellipse(ctx, cx + i * S * 0.06, S * 0.2, S * 0.018, S * 0.018, "#ffd84d", "#e0a93a", lw * 0.5);
    }
    face(ctx, cx, S * 0.35, S, S * 0.042);
  }

  function drawNoctis(ctx, cx, S, color) {
    const lw = S * 0.026;
    const baseY = S * 0.86;
    platform(ctx, cx, baseY, S, color);
    const jacket = sideTint("#23242f", color);
    const jacketHi = shade(jacket, 0.12);

    // black jacket / slim regal coat
    blob(ctx, [
      [cx - S * 0.12, S * 0.46], [cx + S * 0.12, S * 0.46],
      [cx + S * 0.18, baseY - S * 0.02], [cx - S * 0.18, baseY - S * 0.02],
    ], jacket, OUTLINE, lw);
    // open collar
    blob(ctx, [
      [cx - S * 0.12, S * 0.46], [cx, S * 0.46],
      [cx - S * 0.02, S * 0.66], [cx - S * 0.1, S * 0.6],
    ], jacketHi, OUTLINE, lw * 0.7);
    blob(ctx, [
      [cx + S * 0.12, S * 0.46], [cx, S * 0.46],
      [cx + S * 0.02, S * 0.66], [cx + S * 0.1, S * 0.6],
    ], jacketHi, OUTLINE, lw * 0.7);
    ellipse(ctx, cx, S * 0.56, S * 0.04, S * 0.07, "#2c2d3a", null, 0); // shirt

    // head + spiky black hair
    const skin = "#edc59c";
    ellipse(ctx, cx, S * 0.35, S * 0.115, S * 0.125, skin, OUTLINE, lw);
    blob(ctx, [
      [cx - S * 0.14, S * 0.34], [cx - S * 0.16, S * 0.2],
      [cx - S * 0.06, S * 0.27], [cx - S * 0.08, S * 0.17],
      [cx + S * 0.01, S * 0.26], [cx + S * 0.04, S * 0.16],
      [cx + S * 0.1, S * 0.25], [cx + S * 0.16, S * 0.2],
      [cx + S * 0.14, S * 0.34],
    ], "#1b1b24", OUTLINE, lw * 0.9); // spiky hair

    // golden crown (King)
    blob(ctx, [
      [cx - S * 0.11, S * 0.2], [cx + S * 0.11, S * 0.2],
      [cx + S * 0.09, S * 0.12], [cx + S * 0.05, S * 0.17],
      [cx, S * 0.1], [cx - S * 0.05, S * 0.17], [cx - S * 0.09, S * 0.12],
    ], "#f0c34e", OUTLINE, lw * 0.9);
    ellipse(ctx, cx, S * 0.16, S * 0.02, S * 0.02, "#e0463a", "#8a2a22", lw * 0.5); // jewel
    face(ctx, cx, S * 0.37, S, S * 0.045, { smile: false, blush: false });
  }

  function drawImp(ctx, cx, S, color) {
    const lw = S * 0.024;
    const baseY = S * 0.84;
    platform(ctx, cx, baseY, S, color);
    const body = sideTint("#8a63c4", color);
    const belly = shade(body, 0.28);

    // little bat wings
    for (const s of [-1, 1]) {
      blob(ctx, [
        [cx + s * S * 0.1, S * 0.56], [cx + s * S * 0.26, S * 0.5],
        [cx + s * S * 0.24, S * 0.66], [cx + s * S * 0.12, S * 0.66],
      ], shade(body, -0.2), OUTLINE, lw * 0.8);
    }
    // round body
    ellipse(ctx, cx, S * 0.62, S * 0.15, S * 0.16, body, OUTLINE, lw);
    ellipse(ctx, cx, S * 0.66, S * 0.08, S * 0.09, belly, null, 0);

    // big head with huge bat ears
    ellipse(ctx, cx, S * 0.4, S * 0.15, S * 0.14, body, OUTLINE, lw);
    for (const s of [-1, 1]) {
      blob(ctx, [
        [cx + s * S * 0.1, S * 0.34], [cx + s * S * 0.3, S * 0.2],
        [cx + s * S * 0.16, S * 0.42],
      ], body, OUTLINE, lw); // ear
      blob(ctx, [
        [cx + s * S * 0.12, S * 0.34], [cx + s * S * 0.24, S * 0.25],
        [cx + s * S * 0.16, S * 0.4],
      ], shade(body, 0.3), null, 0); // inner ear
    }
    // tiny horns
    for (const s of [-1, 1]) {
      blob(ctx, [
        [cx + s * S * 0.05, S * 0.28], [cx + s * S * 0.08, S * 0.2],
        [cx + s * S * 0.1, S * 0.28],
      ], shade(body, -0.3), OUTLINE, lw * 0.6);
    }
    // big mischievous eyes
    for (const s of [-1, 1]) {
      ellipse(ctx, cx + s * S * 0.06, S * 0.4, S * 0.05, S * 0.06, "#fffdf2", OUTLINE, lw * 0.6);
      ellipse(ctx, cx + s * S * 0.07, S * 0.41, S * 0.024, S * 0.03, "#2a2030", null, 0);
      ellipse(ctx, cx + s * S * 0.08, S * 0.39, S * 0.01, S * 0.012, "#ffffff", null, 0);
    }
    // grin
    ctx.beginPath();
    ctx.arc(cx, S * 0.47, S * 0.05, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.lineWidth = lw * 0.8; ctx.strokeStyle = "#3a2030"; ctx.lineCap = "round"; ctx.stroke();
  }

  const DRAW = {
    n: drawCecil,
    b: drawStrago,
    r: drawBarret,
    q: drawAerith,
    k: drawNoctis,
    p: drawImp,
  };

  function draw(ctx, type, color, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    DRAW[type](ctx, size / 2, size, color);
    ctx.restore();
  }

  window.Pieces = { draw, NAMES: {
    n: "Cecil Harvey",
    b: "Strago",
    r: "Barret",
    q: "Aerith",
    k: "Noctis",
    p: "Imp",
  }};
})();
