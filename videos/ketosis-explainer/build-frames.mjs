/* Vivid anime / cel-shaded generator — ketosis explainer.
   Cosmic saturated backdrops, an anime "science presenter" character, glossy organs,
   and bold poster-style type. All artwork authored from scratch as vector. */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "/tmp/claude-0/-home-user-Claude/f89ce694-d14c-53e9-804e-2a476ddceffb/scratchpad/videos/ketosis-explainer/compositions/frames";
mkdirSync(OUT, { recursive: true });

const rngOf = (s0) => { let a = s0 >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const f = (n) => Number(n).toFixed(1);
const INK = "#2A1038";

/* ============ cosmic backdrop ============ */
function cosmos(p, o) {
  o = o || {};
  const r = rngOf(o.seed || 7);
  const A = o.a || "#FF4FA3", B = o.b || "#7A4CE0", C = o.c || "#2ED9E8";
  let stars = "", bokeh = "", bolts = "";
  for (let i = 0; i < 120; i++) stars += `<circle cx="${f(r() * 1920)}" cy="${f(r() * 1080)}" r="${f(1 + r() * 2.4)}" fill="#FFFFFF" opacity="${(0.25 + r() * 0.6).toFixed(2)}"/>`;
  for (let i = 0; i < 16; i++) {
    const x = r() * 1920, y = r() * 1080, rad = 16 + r() * 54;
    bokeh += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="url(#${p}-bok)" opacity="${(0.18 + r() * 0.4).toFixed(2)}"/>`;
  }
  for (let b = 0; b < 4; b++) {
    let x = 120 + r() * 1680, y = -20, d = `M${f(x)} ${y}`;
    for (let i = 0; i < 7; i++) { x += (r() * 2 - 1) * 110; y += 90 + r() * 90; d += ` L${f(x)} ${f(y)}`; }
    bolts += `<path d="${d}" fill="none" stroke="${C}" stroke-width="${(2 + r() * 3).toFixed(1)}" opacity="${(0.16 + r() * 0.24).toFixed(2)}" stroke-linecap="round" filter="url(#${p}-gl)"/>`;
  }
  return `<defs>
    <linearGradient id="${p}-bg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#1B0B3A"/><stop offset="48%" stop-color="#2A0E52"/><stop offset="100%" stop-color="#120726"/></linearGradient>
    <radialGradient id="${p}-n1"><stop offset="0%" stop-color="${A}" stop-opacity="0.62"/><stop offset="100%" stop-color="${A}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${p}-n2"><stop offset="0%" stop-color="${B}" stop-opacity="0.6"/><stop offset="100%" stop-color="${B}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${p}-n3"><stop offset="0%" stop-color="${C}" stop-opacity="0.5"/><stop offset="100%" stop-color="${C}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${p}-bok"><stop offset="0%" stop-color="#FFE6FF" stop-opacity="0.9"/><stop offset="100%" stop-color="#FFB8F0" stop-opacity="0"/></radialGradient>
    <radialGradient id="${p}-halo"><stop offset="0%" stop-color="#FFF3B0" stop-opacity="0.85"/><stop offset="100%" stop-color="#FF8AD8" stop-opacity="0"/></radialGradient>
    <filter id="${p}-gl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="${p}-soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>
    <filter id="${p}-far" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
    <linearGradient id="${p}-liv" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stop-color="#FF9E86"/><stop offset="52%" stop-color="#E05A55"/><stop offset="100%" stop-color="#9A2E45"/></linearGradient>
    <linearGradient id="${p}-brn" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stop-color="#FFD3E4"/><stop offset="50%" stop-color="#F58FB8"/><stop offset="100%" stop-color="#B8478C"/></linearGradient>
    <linearGradient id="${p}-msc" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stop-color="#FFB48F"/><stop offset="52%" stop-color="#E86B54"/><stop offset="100%" stop-color="#9E3348"/></linearGradient>
    <linearGradient id="${p}-fat" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stop-color="#FFF3B8"/><stop offset="55%" stop-color="#FFD05E"/><stop offset="100%" stop-color="#D98A2E"/></linearGradient>
    <linearGradient id="${p}-ins" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stop-color="#D9C2FF"/><stop offset="55%" stop-color="#9A6BF0"/><stop offset="100%" stop-color="#5B2FB0"/></linearGradient>
    <linearGradient id="${p}-ket" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stop-color="#FFFCD0"/><stop offset="50%" stop-color="#FFE066"/><stop offset="100%" stop-color="#E89A16"/></linearGradient>
    <linearGradient id="${p}-skin" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stop-color="#FFE8D6"/><stop offset="100%" stop-color="#F6C9AE"/></linearGradient>
  </defs>
  <rect x="0" y="0" width="1920" height="1080" fill="url(#${p}-bg)"/>
  <g>${stars}</g>
  <ellipse cx="330" cy="250" rx="760" ry="560" fill="url(#${p}-n2)"/>
  <ellipse cx="1620" cy="360" rx="820" ry="600" fill="url(#${p}-n1)"/>
  <ellipse cx="960" cy="980" rx="1100" ry="520" fill="url(#${p}-n3)"/>
  <g>${bolts}</g>
  <g>${bokeh}</g>`;
}

/* ============ glossy organs ============ */
const gloss = (d, op) => `<path d="${d}" fill="#FFFFFF" opacity="${op || 0.4}"/>`;

function brainArt(p, o) {
  o = o || {};
  return `<g>
    <ellipse cx="0" cy="0" rx="300" ry="250" fill="url(#${p}-halo)" opacity="${o.halo === false ? 0 : 0.75}"/>
    <path d="M-236 -18 C-250 -112 -168 -186 -62 -198 C42 -210 158 -176 204 -98 C240 -38 230 38 172 82 C122 120 38 134 -38 126 C-100 120 -150 98 -182 66 C-216 32 -232 8 -236 -18 Z"
      fill="url(#${p}-brn)" stroke="${INK}" stroke-width="6" stroke-opacity="0.75"/>
    <g fill="none" stroke="#A63A79" stroke-width="8" stroke-linecap="round" opacity="0.75">
      <path d="M-190 -62 C-152 -106 -96 -114 -62 -80"/><path d="M-44 -146 C-4 -180 62 -178 92 -138"/>
      <path d="M108 -106 C148 -126 186 -98 188 -58"/><path d="M-168 8 C-118 -32 -52 -30 -18 10"/>
      <path d="M8 -34 C50 -74 116 -66 144 -18"/><path d="M-122 78 C-76 42 -12 46 24 82"/>
      <path d="M56 62 C98 30 150 40 168 78"/></g>
    ${o.hip ? `<path id="${o.hip}" d="M-74 46 C-26 8 46 16 76 60 C92 84 74 106 48 100" fill="none" stroke="#FF4D8D" stroke-width="17" stroke-linecap="round" opacity="0.22"/>` : ""}
    <path d="M108 96 C164 82 224 100 236 140 C246 176 204 206 148 202 C100 198 72 168 76 136 C78 114 92 100 108 96 Z"
      fill="#E39ABE" stroke="${INK}" stroke-width="6" stroke-opacity="0.7"/>
    <g fill="none" stroke="#A63A79" stroke-width="5" opacity="0.7">
      <path d="M88 122 C138 112 194 122 226 146"/><path d="M84 143 C136 134 192 145 226 166"/></g>
    <path d="M64 162 C58 206 64 238 86 260 C60 266 34 252 24 224 C14 196 24 172 42 160 Z" fill="#D488AC" stroke="${INK}" stroke-width="6" stroke-opacity="0.7"/>
    ${gloss("M-186 -120 C-132 -168 -40 -180 24 -160 C-40 -142 -122 -108 -160 -70 C-186 -86 -196 -104 -186 -120 Z", 0.42)}
  </g>`;
}
function liverArt(p) {
  return `<g>
    <ellipse cx="0" cy="0" rx="300" ry="190" fill="url(#${p}-halo)" opacity="0.7"/>
    <path d="M-268 -34 C-258 -122 -152 -158 -18 -160 C126 -162 248 -124 266 -40 C276 4 244 66 148 100 C52 132 -66 138 -156 106 C-238 76 -274 22 -268 -34 Z"
      fill="url(#${p}-liv)" stroke="${INK}" stroke-width="6" stroke-opacity="0.75"/>
    <path d="M18 -160 C14 -84 10 -8 4 66" fill="none" stroke="#7E2438" stroke-width="11" stroke-linecap="round" opacity="0.7"/>
    <path d="M-240 -16 C-152 30 -18 48 136 26" fill="none" stroke="#8E2C42" stroke-width="5" opacity="0.45"/>
    <ellipse cx="-70" cy="116" rx="48" ry="32" fill="#5FCB8E" stroke="${INK}" stroke-width="6" stroke-opacity="0.7"/>
    <path d="M-4 76 C30 96 58 100 96 96" fill="none" stroke="#FF7C93" stroke-width="13" stroke-linecap="round"/>
    <path d="M-8 92 C28 112 58 118 94 116" fill="none" stroke="#6FA8FF" stroke-width="16" stroke-linecap="round"/>
    ${gloss("M-214 -92 C-152 -128 -44 -140 30 -122 C-40 -104 -140 -74 -184 -44 C-212 -60 -224 -78 -214 -92 Z", 0.4)}
  </g>`;
}
function muscleArt(p) {
  return `<g>
    <ellipse cx="0" cy="0" rx="270" ry="150" fill="url(#${p}-halo)" opacity="0.65"/>
    <path d="M-214 6 C-192 -12 -170 -14 -152 -8" fill="none" stroke="#F4E2C8" stroke-width="30" stroke-linecap="round"/>
    <path d="M214 6 C192 -12 170 -14 152 -8" fill="none" stroke="#F4E2C8" stroke-width="30" stroke-linecap="round"/>
    <path d="M-158 -6 C-100 -112 100 -112 158 -6 C100 102 -100 102 -158 -6 Z" fill="url(#${p}-msc)" stroke="${INK}" stroke-width="6" stroke-opacity="0.75"/>
    <g fill="none" stroke="#8E2C42" stroke-width="6" opacity="0.55">
      <path d="M-132 -16 C-72 -80 72 -80 132 -16"/><path d="M-138 2 C-76 -34 76 -34 138 2"/>
      <path d="M-132 18 C-72 60 72 60 132 18"/><path d="M-120 36 C-66 84 66 84 120 36"/></g>
    ${gloss("M-118 -56 C-72 -84 -6 -88 34 -74 C-14 -60 -74 -40 -104 -20 C-120 -32 -126 -46 -118 -56 Z", 0.38)}
  </g>`;
}
function fatCellArt(p, id) {
  return `<g id="${id}">
    <circle cx="0" cy="0" r="112" fill="url(#${p}-fat)" stroke="${INK}" stroke-width="6" stroke-opacity="0.75"/>
    <circle cx="0" cy="0" r="82" fill="#FFE9A0" opacity="0.55"/>
    ${gloss("M-78 -50 C-46 -80 6 -86 40 -72 C0 -56 -46 -36 -68 -14 C-80 -28 -84 -40 -78 -50 Z", 0.5)}
  </g>`;
}
function ketoneArt(p, id) {
  return `<g id="${id}">
    <ellipse cx="0" cy="0" rx="96" ry="96" fill="url(#${p}-halo)" opacity="0.85"/>
    <path d="M0 -66 L58 0 L0 66 L-58 0 Z" fill="url(#${p}-ket)" stroke="${INK}" stroke-width="6" stroke-opacity="0.75" stroke-linejoin="round"/>
    ${gloss("M-26 -16 L0 -46 L20 -22 L-6 4 Z", 0.55)}
  </g>`;
}

/* ============ anime presenter ============ */
function presenter(p, o) {
  o = o || {};
  const coat = "#FBFCFF", coatSh = "#D6DEEE", scrub = "#1FA9A0", scrubSh = "#14807A";
  const hair = "#5B3320", hairLt = "#8A5233";
  return `<g id="${o.id || p + "-pres"}">
    <!-- back hair -->
    <path d="M-138 -196 C-160 -300 -104 -392 6 -394 C118 -396 168 -306 152 -196 C144 -140 148 -66 158 -10 C120 -34 96 -74 92 -128 L-84 -128 C-88 -70 -112 -30 -152 -6 C-142 -66 -132 -140 -138 -196 Z"
      fill="${hair}" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <!-- torso: lab coat -->
    <path d="M-14 -150 C-92 -136 -156 -92 -172 -14 C-186 56 -192 160 -196 262 L196 262 C192 160 186 56 172 -14 C156 -92 92 -136 14 -150 Z"
      fill="${coat}" stroke="${INK}" stroke-width="5" stroke-opacity="0.65"/>
    <path d="M110 -128 C150 -102 168 -52 176 6 C186 88 190 178 194 262 L104 262 C110 160 112 40 110 -128 Z" fill="${coatSh}" opacity="0.75"/>
    <!-- scrub top -->
    <path d="M-14 -150 C-30 -100 -12 -60 0 -34 C12 -60 30 -100 14 -150 C6 -146 -6 -146 -14 -150 Z" fill="${scrub}" stroke="${INK}" stroke-width="4" stroke-opacity="0.6"/>
    <path d="M-56 -140 C-40 -66 -18 -22 0 -34 C-14 -66 -34 -110 -34 -146 Z" fill="${scrub}" opacity="0.95"/>
    <path d="M56 -140 C40 -66 18 -22 0 -34 C14 -66 34 -110 34 -146 Z" fill="${scrubSh}" opacity="0.95"/>
    <!-- lapels -->
    <path d="M-14 -150 C-56 -140 -80 -104 -86 -56 C-70 -96 -44 -122 -8 -132 Z" fill="${coatSh}" opacity="0.9"/>
    <path d="M14 -150 C56 -140 80 -104 86 -56 C70 -96 44 -122 8 -132 Z" fill="${coatSh}" opacity="0.9"/>
    <!-- stethoscope -->
    <path d="M-52 -142 C-72 -70 -60 -6 -18 26" fill="none" stroke="#2E3A4E" stroke-width="10" stroke-linecap="round"/>
    <path d="M52 -142 C74 -70 66 8 24 44" fill="none" stroke="#2E3A4E" stroke-width="10" stroke-linecap="round"/>
    <circle cx="30" cy="54" r="20" fill="#9DB0C8" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <!-- shoulder cap keeps the silhouette clean -->
    <!-- head -->
    <path d="M-88 -286 C-88 -338 -50 -370 0 -370 C50 -370 88 -338 88 -286 C88 -242 74 -204 46 -176 C28 -158 12 -150 0 -150 C-12 -150 -28 -158 -46 -176 C-74 -204 -88 -242 -88 -286 Z"
      fill="url(#${p}-skin)" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <path d="M40 -330 C74 -316 88 -286 84 -252 C80 -216 66 -190 44 -172 C58 -206 62 -270 40 -330 Z" fill="#E9B69A" opacity="0.55"/>
    <!-- eyes -->
    <g>
      <ellipse cx="-40" cy="-262" rx="26" ry="30" fill="#FFFFFF"/>
      <ellipse cx="40" cy="-262" rx="26" ry="30" fill="#FFFFFF"/>
      <circle cx="-38" cy="-258" r="19" fill="#6B3A1E"/><circle cx="42" cy="-258" r="19" fill="#6B3A1E"/>
      <circle cx="-38" cy="-256" r="10" fill="#1E0F08"/><circle cx="42" cy="-256" r="10" fill="#1E0F08"/>
      <circle cx="-46" cy="-268" r="8" fill="#FFFFFF" opacity="0.95"/><circle cx="34" cy="-268" r="8" fill="#FFFFFF" opacity="0.95"/>
      <circle cx="-30" cy="-246" r="4" fill="#FFFFFF" opacity="0.8"/><circle cx="50" cy="-246" r="4" fill="#FFFFFF" opacity="0.8"/>
      <path d="M-68 -286 C-56 -300 -20 -302 -12 -288" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
      <path d="M12 -288 C20 -302 56 -300 68 -286" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
      <path d="M-66 -312 C-54 -322 -24 -322 -14 -314" fill="none" stroke="#4A2716" stroke-width="6" stroke-linecap="round"/>
      <path d="M14 -314 C24 -322 54 -322 66 -312" fill="none" stroke="#4A2716" stroke-width="6" stroke-linecap="round"/>
    </g>
    <ellipse cx="-58" cy="-224" rx="20" ry="10" fill="#F58AA0" opacity="0.42"/>
    <ellipse cx="58" cy="-224" rx="20" ry="10" fill="#F58AA0" opacity="0.42"/>
    <path d="M-12 -196 C-4 -188 4 -188 12 -196" fill="none" stroke="#8E4A38" stroke-width="5" stroke-linecap="round"/>
    <!-- bangs + headband -->
    <path d="M-92 -290 C-98 -352 -50 -390 4 -390 C60 -390 100 -350 94 -290 C86 -318 66 -336 40 -340 C22 -312 -12 -300 -46 -306 C-64 -310 -82 -300 -92 -290 Z"
      fill="${hair}" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <path d="M-64 -348 C-30 -368 26 -368 58 -346 C24 -356 -28 -356 -64 -348 Z" fill="${hairLt}" opacity="0.85"/>
    <path d="M-96 -300 C-64 -318 60 -318 96 -298 L96 -278 C60 -298 -62 -298 -96 -280 Z" fill="#20BFB2" stroke="${INK}" stroke-width="4" stroke-opacity="0.6"/>
    <path d="M-96 -286 C-116 -246 -120 -196 -110 -156 C-124 -206 -122 -258 -96 -286 Z" fill="${hair}"/>
    <path d="M96 -286 C116 -246 120 -196 110 -156 C124 -206 122 -258 96 -286 Z" fill="${hair}"/>
  </g>`;
}

/* ============ body-type figures ============ */
function figBuilt(p) {
  return `<g>
    <path d="M-98 -18 C-98 -68 -54 -94 0 -94 C54 -94 98 -68 98 -18 C98 24 76 46 48 56 C50 110 46 160 38 198 L-38 198 C-46 160 -50 110 -48 56 C-76 46 -98 24 -98 -18 Z" fill="url(#${p}-skin)" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <path d="M-98 -22 C-132 -6 -148 26 -144 62 C-140 92 -122 106 -106 100 C-94 96 -90 78 -94 58" fill="url(#${p}-skin)" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <path d="M98 -22 C132 -6 148 26 144 62 C140 92 122 106 106 100 C94 96 90 78 94 58" fill="url(#${p}-skin)" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <path d="M-78 -52 C-42 -26 42 -26 78 -52 C82 -4 78 40 70 74 C30 88 -30 88 -70 74 C-78 40 -82 -4 -78 -52 Z" fill="#2ED9E8" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <path d="M-60 70 C-22 82 22 82 60 70 C64 108 60 138 54 160 L10 160 L0 118 L-10 160 L-54 160 C-60 138 -64 108 -60 70 Z" fill="#7A4CE0" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <circle cx="0" cy="-140" r="54" fill="url(#${p}-skin)" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <circle cx="-19" cy="-146" r="8" fill="#1E0F08"/><circle cx="19" cy="-146" r="8" fill="#1E0F08"/>
    <path d="M-14 -122 C-6 -114 6 -114 14 -122" fill="none" stroke="#8E4A38" stroke-width="5" stroke-linecap="round"/></g>`;
}
function figLean(p) {
  return `<g>
    <path d="M-46 -20 C-46 -64 -22 -86 0 -86 C22 -86 46 -64 46 -20 C46 22 38 48 32 64 C34 118 30 162 24 198 L-24 198 C-30 162 -34 118 -32 64 C-38 48 -46 22 -46 -20 Z" fill="url(#${p}-skin)" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <path d="M-46 -24 C-70 -10 -82 22 -80 58 C-78 86 -66 98 -56 94 C-48 90 -46 74 -50 56" fill="url(#${p}-skin)" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <path d="M46 -24 C70 -10 82 22 80 58 C78 86 66 98 56 94 C48 90 46 74 50 56" fill="url(#${p}-skin)" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <path d="M-38 -50 C-20 -30 20 -30 38 -50 C42 -8 40 32 34 66 C14 76 -14 76 -34 66 C-40 32 -42 -8 -38 -50 Z" fill="#FF4FA3" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <path d="M-32 62 C-12 72 12 72 32 62 C36 98 32 128 26 150 L6 150 L0 116 L-6 150 L-26 150 C-32 128 -36 98 -32 62 Z" fill="#B33A86" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <circle cx="0" cy="-130" r="50" fill="url(#${p}-skin)" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    <circle cx="-17" cy="-136" r="8" fill="#1E0F08"/><circle cx="17" cy="-136" r="8" fill="#1E0F08"/>
    <path d="M-13 -113 C-5 -105 5 -105 13 -113" fill="none" stroke="#8E4A38" stroke-width="5" stroke-linecap="round"/></g>`;
}

/* ============ shell ============ */
function shell(id, k, dur, base, body, js, css = "") {
  return `<template>
  <style>
@font-face{font-family:'ZenMaru';src:url('assets/fonts/ZenMaru-700.woff2') format('woff2');font-weight:700;font-style:normal;font-display:block;}
@font-face{font-family:'ZenMaru';src:url('assets/fonts/ZenMaru-500.woff2') format('woff2');font-weight:500;font-style:normal;font-display:block;}
@font-face{font-family:'KleeOne';src:url('assets/fonts/KleeOne-600.woff2') format('woff2');font-weight:600;font-style:normal;font-display:block;}
@font-face{font-family:'KleeOne';src:url('assets/fonts/KleeOne-400.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block;}
    #root{position:relative;width:1920px;height:1080px;overflow:hidden;container-type:size;background:#120726;}
    #root .clip{position:absolute;inset:0;}
    .${k}-hero{font-family:'ZenMaru',sans-serif;font-weight:700;color:#FFF6D8;letter-spacing:0.01em;line-height:1.06;
      -webkit-text-stroke:9px #2A0A3E;paint-order:stroke fill;
      text-shadow:0 0 34px rgba(255,90,190,0.95), 0 0 70px rgba(122,76,224,0.85), 0 10px 0 rgba(42,10,62,0.55);}
    .${k}-sub{font-family:'KleeOne',serif;font-weight:600;color:#8FF6FF;
      -webkit-text-stroke:5px #21094A;paint-order:stroke fill;
      text-shadow:0 0 22px rgba(46,217,232,0.95), 0 4px 0 rgba(33,9,74,0.6);}
    .${k}-chip{font-family:'ZenMaru',sans-serif;font-weight:700;font-size:34px;color:#2A0A3E;white-space:nowrap;
      background:linear-gradient(180deg,#FFF6C8,#FFD05E);border:5px solid #2A0A3E;border-radius:999px;padding:12px 30px;
      box-shadow:0 0 26px rgba(255,208,94,0.8), 0 8px 0 rgba(42,10,62,0.5);}
    .${k}-chipc{background:linear-gradient(180deg,#D6FBFF,#57D9F2);}
    .${k}-chipp{background:linear-gradient(180deg,#FFD9F0,#FF6FC0);}
${css}
  </style>
  <div id="root" data-composition-id="${id}" data-start="0" data-duration="${dur}" data-width="1920" data-height="1080">
    <div class="clip ${k}-bg" id="${k}-bg" data-start="0" data-duration="${dur}" data-track-index="0"></div>
    <div class="clip ${k}-stage" id="${k}-stage" data-start="0" data-duration="${dur}" data-track-index="1">
${body}
    </div>
  </div>
  <script src="assets/js/gsap.min.js"></script>
  <script>
    (function(){
      window.__timelines = window.__timelines || {};
      var R = document.querySelector('[data-composition-id="${id}"]');
      if (!R) return;
      var q = function(s){ return R.querySelector(s); };
      var qa = function(s){ return Array.prototype.slice.call(R.querySelectorAll(s)); };
      var __tl = gsap.timeline({ paused: true });
      // Beats below are authored against BASE seconds and played over D seconds.
      // SC rescales every position, duration and stagger so the choreography
      // survives a change of narration length without truncating late beats.
      var BASE = ${base}, D = ${dur}, SC = D / BASE;
      function sv(v){
        if (!v) return v;
        var o = {}, kx;
        for (kx in v) o[kx] = v[kx];
        if (typeof o.duration === "number") o.duration *= SC;
        if (typeof o.stagger === "number") o.stagger *= SC;
        return o;
      }
      var tl = {
        to: function(t, v, p){ return __tl.to(t, sv(v), typeof p === "number" ? p * SC : p); },
        fromTo: function(t, f, v, p){ return __tl.fromTo(t, f, sv(v), typeof p === "number" ? p * SC : p); }
      };
      function shimmer(sel, start, cycles, amp){
        var els = qa(sel); if(!els.length) return; var end = Math.max(0.3, BASE - start);
        els.forEach(function(el, i){ var o = { p: i * 0.9 };
          tl.to(o, { p: i * 0.9 + Math.PI * 2 * cycles, duration: end, ease: "none", onUpdate: function(){
            gsap.set(el, { opacity: 0.55 + Math.abs(Math.sin(o.p)) * amp }); }}, start); });
      }
      function bob(el, start, amp, cycles, baseY){
        if(!el) return; var end = Math.max(0.3, BASE - start), o = { p: 0 }, b = baseY || 0;
        tl.to(o, { p: Math.PI * 2 * cycles, duration: end, ease: "none", onUpdate: function(){
          gsap.set(el, { y: b + Math.sin(o.p) * amp }); }}, start);
      }
${js}
      window.__timelines["${id}"] = __tl;
    })();
  </script>
</template>
`;
}

const F = [];
const HERO = (k, top, size) => `.${k}-h{position:absolute;left:0;top:${top}px;width:1920px;text-align:center;font-size:${size}px;}`;
const SUB  = (k, top, size) => `.${k}-s{position:absolute;left:0;top:${top}px;width:1920px;text-align:center;font-size:${size}px;}`;

/* ===== 1 HOOK ===== */
F.push({ id: "01-hook", k: "hk", dur: 4.108, base: 4.288,
  css: HERO("hk", 92, 128) + SUB("hk", 262, 46),
  body: `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;">
  ${cosmos("hk", { seed: 11 })}
  <g opacity="0.34" filter="url(#hk-far)"><g transform="translate(300 780) scale(0.5)">${brainArt("hk", { halo: false })}</g>
    <g transform="translate(1680 800) scale(0.44)">${liverArt("hk")}</g></g>
  <g id="hk-pres" transform="translate(980 800) scale(1.16)">${presenter("hk", {})}</g>
  <g id="hk-orb" transform="translate(742 730)">
    <ellipse cx="0" cy="0" rx="150" ry="150" fill="url(#hk-halo)"/>
    <g transform="scale(0.42)">${brainArt("hk", {})}</g></g>
</svg>
<div class="hk-h hk-hero">FROM HANGRY TO FURNACE</div>
<div class="hk-s hk-sub">your body has a second fuel tank</div>`,
  js: `
      var pres = q('#hk-pres'), orb = q('#hk-orb'), h = q('.hk-h'), s = q('.hk-s');
      gsap.set([h, s], { opacity: 0 }); gsap.set(orb, { opacity: 0 });
      tl.fromTo(pres, { opacity: 0, x: 980, y: 890, scale: 1.10 }, { opacity: 1, x: 980, y: 800, scale: 1.16, duration: 1.0, ease: "power3.out", transformOrigin: "50% 100%" }, 0.05);
      tl.fromTo(orb, { opacity: 0, x: 742, y: 790, scale: 0.6 }, { opacity: 1, x: 742, y: 730, scale: 1, duration: 0.7, ease: "back.out(1.8)", transformOrigin: "50% 50%" }, 1.1);
      tl.fromTo(h, { opacity: 0, scale: 0.86, y: 26 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 1.5);
      tl.fromTo(s, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 2.2);
      shimmer('.hk-bok', 0.2, 1.2, 0.4);`,
});

/* ===== 2 KETOSIS ===== */
F.push({ id: "02-name-ketosis", k: "kt", dur: 3.667, base: 4.139,
  css: HERO("kt", 330, 250) + SUB("kt", 636, 48),
  body: `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;">
  ${cosmos("kt", { seed: 23, a: "#FFB03A", b: "#FF3D9A" })}
  <g id="kt-burst" opacity="0.9">${Array.from({ length: 18 }, (_, i) => { const a = (i * Math.PI * 2) / 18; return `<path d="M${f(960 + Math.cos(a) * 250)} ${f(540 + Math.sin(a) * 250)} L${f(960 + Math.cos(a) * 900)} ${f(540 + Math.sin(a) * 900)}" stroke="#FFD05E" stroke-width="${(6 + (i % 3) * 5)}" opacity="0.2" stroke-linecap="round"/>`; }).join("")}</g>
  <g opacity="0.4" filter="url(#kt-far)"><g transform="translate(330 300) scale(0.4)">${ketoneArt("kt", "kt-d1")}</g>
    <g transform="translate(1610 800) scale(0.46)">${ketoneArt("kt", "kt-d2")}</g></g>
</svg>
<div class="kt-h kt-hero">KETOSIS</div>
<div class="kt-s kt-sub">not magic &mdash; just chemistry showing off</div>`,
  js: `
      var h = q('.kt-h'), s = q('.kt-s'), burst = q('#kt-burst');
      gsap.set([h, s], { opacity: 0 }); gsap.set(burst, { opacity: 0 });
      tl.fromTo(burst, { opacity: 0, scale: 0.6 }, { opacity: 0.9, scale: 1, duration: 0.9, ease: "power3.out", transformOrigin: "50% 50%" }, 0.6);
      tl.fromTo(h, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.7)", transformOrigin: "50% 50%" }, 0.9);
      tl.fromTo(s, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 2.3);`,
});

/* ===== 3 GLYCOGEN ===== */
F.push({ id: "03-glycogen", k: "gl", dur: 6.310, base: 6.400,
  css: HERO("gl", 74, 92) + SUB("gl", 196, 40),
  body: `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;">
  ${cosmos("gl", { seed: 31, a: "#FF6A5E", b: "#8A46D6" })}
  <g id="gl-big" transform="translate(1300 560) scale(1.24)">${liverArt("gl")}</g>
  <g id="gl-pres" transform="translate(560 840) scale(1.02)">${presenter("gl", {})}</g>
  <g id="gl-hand" transform="translate(332 686) scale(0.32)">${liverArt("gl")}</g>
  <g id="gl-gauge" transform="translate(880 700)">
    <rect x="-40" y="-150" width="80" height="300" rx="34" fill="#2A0A3E" stroke="#FFD05E" stroke-width="6"/>
    <clipPath id="gl-gc"><rect x="-30" y="-140" width="60" height="280" rx="28"/></clipPath>
    <g clip-path="url(#gl-gc)"><rect id="gl-fill" x="-30" y="-140" width="60" height="280" fill="url(#gl-ket)"/></g>
  </g></svg>
<div class="gl-h gl-hero">THE SUGAR STORE DRAINS</div>
<div class="gl-s gl-sub">fewer carbs &rarr; the liver&rsquo;s glycogen runs low</div>
<div class="gl-c1 gl-chip" style="position:absolute;left:1180px;top:868px;">liver &mdash; stores sugar as glycogen</div>
<div class="gl-c2 gl-chip gl-chipc" style="position:absolute;left:800px;top:876px;">glycogen &darr;</div>`,
  js: `
      var big = q('#gl-big'), pres = q('#gl-pres'), hand = q('#gl-hand'), gauge = q('#gl-gauge'),
          fill = q('#gl-fill'), c1 = q('.gl-c1'), c2 = q('.gl-c2'), h = q('.gl-h'), s = q('.gl-s');
      gsap.set([c1, c2, h, s], { opacity: 0 }); gsap.set([gauge, hand], { opacity: 0 });
      gsap.set(fill, { transformOrigin: "50% 100%" });
      tl.fromTo(big, { opacity: 0, x: 1300, y: 560, scale: 1.0 }, { opacity: 1, x: 1300, y: 560, scale: 1.24, duration: 1.1, ease: "power3.out", transformOrigin: "50% 50%" }, 0.05);
      tl.fromTo(pres, { opacity: 0, x: 460, y: 840 }, { opacity: 1, x: 560, y: 840, duration: 0.9, ease: "power3.out" }, 0.2);
      tl.fromTo(h, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 0.7);
      tl.fromTo(s, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.1);
      tl.fromTo(hand, { opacity: 0, x: 332, y: 726, scale: 0.2 }, { opacity: 1, x: 332, y: 686, scale: 0.32, duration: 0.6, ease: "back.out(1.9)", transformOrigin: "50% 50%" }, 1.4);
      tl.fromTo(c1, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.8);
      tl.fromTo(gauge, { opacity: 0, x: 880, y: 740 }, { opacity: 1, x: 880, y: 700, duration: 0.7, ease: "back.out(1.6)" }, 3.0);
      tl.fromTo(c2, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 3.3);
      tl.fromTo(fill, { scaleY: 1 }, { scaleY: 0.1, duration: 2.3, ease: "power2.inOut" }, 3.7);
      bob(big, 0.9, 12, 1.4, 560);`,
});

/* ===== 4 INSULIN ===== */
F.push({ id: "04-insulin", k: "in", dur: 5.792, base: 5.525,
  css: HERO("in", 74, 92) + SUB("in", 196, 40),
  body: `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;">
  ${cosmos("in", { seed: 41, a: "#A46BFF", b: "#5B2FB0", c: "#43E0FF" })}
  <g id="in-hex" transform="translate(1290 560)">
    <ellipse cx="0" cy="0" rx="330" ry="330" fill="url(#in-halo)" opacity="0.8"/>
    <path d="M0 -250 L216 -125 L216 125 L0 250 L-216 125 L-216 -125 Z" fill="url(#in-ins)" stroke="${INK}" stroke-width="7" stroke-opacity="0.75" stroke-linejoin="round"/>
    ${gloss("M-150 -140 C-96 -180 -6 -190 54 -172 C-10 -150 -108 -110 -150 -70 C-172 -94 -172 -120 -150 -140 Z", 0.4)}
  </g>
  <g id="in-pres" transform="translate(560 840) scale(1.02)">${presenter("in", {})}</g>
  <g id="in-dots">${[[880,420],[960,520],[900,640],[1010,700],[840,540],[1040,430]].map(([x,y])=>`<circle class="in-d" cx="${x}" cy="${y}" r="15" fill="#8FF6FF" opacity="0.95"/>`).join("")}</g>
</svg>
<div class="in-h in-hero">INSULIN CLOCKS OUT</div>
<div class="in-s in-sub">low sugar coming in &rarr; low insulin in the blood</div>
<div class="in-c1 in-chip in-chipp" style="position:absolute;left:1090px;top:876px;">insulin &mdash; the &ldquo;store it&rdquo; signal</div>`,
  js: `
      var hex = q('#in-hex'), pres = q('#in-pres'), dots = qa('.in-d'), c1 = q('.in-c1'), h = q('.in-h'), s = q('.in-s');
      gsap.set([c1, h, s], { opacity: 0 });
      tl.fromTo(hex, { opacity: 0, x: 1290, y: 560, scale: 0.72 }, { opacity: 1, x: 1290, y: 560, scale: 1, duration: 1.0, ease: "back.out(1.4)", transformOrigin: "50% 50%" }, 0.05);
      tl.fromTo(pres, { opacity: 0, x: 460, y: 840 }, { opacity: 1, x: 560, y: 840, duration: 0.9, ease: "power3.out" }, 0.2);
      tl.fromTo(h, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 0.7);
      tl.fromTo(s, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.1);
      tl.fromTo(dots, { opacity: 0, scale: 0.3 }, { opacity: 0.95, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(2)", transformOrigin: "50% 50%" }, 1.3);
      tl.fromTo(c1, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.9);
      tl.to(dots, { opacity: 0.1, scale: 0.5, duration: 1.4, stagger: 0.08, ease: "power2.inOut", transformOrigin: "50% 50%" }, 3.2);
      tl.to(hex, { scale: 0.72, duration: 1.5, ease: "power3.out", transformOrigin: "50% 50%" }, 3.4);`,
});

/* ===== 5 FAT RELEASE ===== */
F.push({ id: "05-fat-release", k: "fr", dur: 5.447, base: 6.933,
  css: HERO("fr", 74, 88) + SUB("fr", 190, 40),
  body: `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;">
  ${cosmos("fr", { seed: 53, a: "#FFC93A", b: "#FF4FA3" })}
  <g transform="translate(1010 540)">${fatCellArt("fr", "fr-c1")}</g>
  <g transform="translate(1330 480)">${fatCellArt("fr", "fr-c2")}</g>
  <g transform="translate(1600 600)">${fatCellArt("fr", "fr-c3")}</g>
  <g id="fr-pres" transform="translate(500 840) scale(1.02)">${presenter("fr", {})}</g>
  <g id="fr-drops">${[[1010,540],[1330,480],[1600,600]].map(([x,y],i)=>`<g id="fr-d${i+1}" transform="translate(${x} ${y})">
    <path d="M0 -46 C34 -6 46 22 46 40 C46 70 24 90 0 90 C-24 90 -46 70 -46 40 C-46 22 -34 -6 0 -46 Z" fill="url(#fr-liv)" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/>
    ${gloss("M-14 22 C-6 6 6 2 14 8 C4 18 -4 34 -6 46 C-14 40 -18 32 -14 22 Z", 0.5)}</g>`).join("")}</g>
  <path id="fr-vein" d="M840 900 C1120 850 1500 850 1800 900" fill="none" stroke="#E0385C" stroke-width="26" stroke-linecap="round" opacity="0.95"/>
</svg>
<div class="fr-h fr-hero">THE FAT CELLS OPEN UP</div>
<div class="fr-s fr-sub">stored fat pours into the bloodstream</div>
<div class="fr-c1l fr-chip" style="position:absolute;left:1180px;top:944px;">fatty acids &rarr; blood</div>`,
  js: `
      var pres = q('#fr-pres'), cells = [q('#fr-c1'), q('#fr-c2'), q('#fr-c3')],
          drops = [q('#fr-d1'), q('#fr-d2'), q('#fr-d3')], vein = q('#fr-vein'),
          c1 = q('.fr-c1l'), h = q('.fr-h'), s = q('.fr-s');
      gsap.set([c1, h, s], { opacity: 0 }); gsap.set(drops, { opacity: 0 }); gsap.set(vein, { opacity: 0 });
      tl.fromTo(pres, { opacity: 0, x: 400, y: 840 }, { opacity: 1, x: 500, y: 840, duration: 0.9, ease: "power3.out" }, 0.05);
      tl.fromTo(cells, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.14, ease: "back.out(1.7)", transformOrigin: "50% 50%" }, 0.4);
      tl.fromTo(h, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 0.8);
      tl.fromTo(s, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.2);
      tl.fromTo(vein, { opacity: 0 }, { opacity: 0.95, duration: 0.6, ease: "power2.out" }, 2.4);
      [0,1,2].forEach(function(i){
        var t = 2.9 + i * 0.62, xy = [[1010,540],[1330,480],[1600,600]][i];
        tl.fromTo(drops[i], { opacity: 0, x: xy[0], y: xy[1], scale: 0.4 }, { opacity: 1, x: xy[0], y: xy[1], scale: 1, duration: 0.4, ease: "back.out(2)", transformOrigin: "50% 50%" }, t);
        tl.to(drops[i], { y: 872, duration: 1.3, ease: "power2.in" }, t + 0.35);
        tl.to(cells[i], { scale: 0.72, duration: 1.0, ease: "power2.out", transformOrigin: "50% 50%" }, t + 0.35);
      });
      tl.fromTo(c1, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 4.4);`,
});

/* ===== 6 KETONES ===== */
F.push({ id: "06-ketones", k: "ke", dur: 8.274, base: 7.765,
  css: HERO("ke", 68, 86) + SUB("ke", 182, 38),
  body: `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;">
  ${cosmos("ke", { seed: 61, a: "#FFC93A", b: "#FF4FA3", c: "#5BE8FF" })}
  <g id="ke-liver" transform="translate(760 560) scale(0.9)">${liverArt("ke")}</g>
  <g id="ke-brain" transform="translate(1520 380) scale(0.62)">${brainArt("ke", {})}</g>
  <g id="ke-musc" transform="translate(1520 800) scale(0.62)">${muscleArt("ke")}</g>
  <g id="ke-pres" transform="translate(300 880) scale(0.9)">${presenter("ke", {})}</g>
  <g id="ke-ks">${[[1090,470],[1120,600],[1090,730]].map(([x,y],i)=>`<g id="ke-k${i+1}" transform="translate(${x} ${y}) scale(0.8)">${ketoneArt("ke", "ke-kk" + i)}</g>`).join("")}</g>
  <g id="ke-ar" stroke="#FFD05E" stroke-width="8" stroke-dasharray="3 20" fill="none" stroke-linecap="round" opacity="0">
    <path d="M1190 460 C1290 420 1370 400 1430 392"/><path d="M1190 740 C1290 780 1370 796 1430 800"/></g>
</svg>
<div class="ke-h ke-hero">THE LIVER MAKES KETONES</div>
<div class="ke-s ke-sub">clean fuel for brain and muscle &mdash; no sugar required</div>
<div class="ke-cb ke-chipp ke-chip" style="position:absolute;left:1400px;top:262px;">&rarr; BRAIN</div>
<div class="ke-cm ke-chipc ke-chip" style="position:absolute;left:1382px;top:928px;">&rarr; MUSCLE</div>`,
  js: `
      var liver = q('#ke-liver'), brain = q('#ke-brain'), musc = q('#ke-musc'), pres = q('#ke-pres'),
          ks = [q('#ke-k1'), q('#ke-k2'), q('#ke-k3')], ar = q('#ke-ar'),
          cb = q('.ke-cb'), cm = q('.ke-cm'), h = q('.ke-h'), s = q('.ke-s');
      gsap.set([cb, cm, h, s], { opacity: 0 }); gsap.set(ks, { opacity: 0 });
      gsap.set([brain, musc], { opacity: 0 });
      tl.fromTo(liver, { opacity: 0, x: 760, y: 620, scale: 0.7 }, { opacity: 1, x: 760, y: 560, scale: 0.9, duration: 1.0, ease: "power3.out", transformOrigin: "50% 50%" }, 0.05);
      tl.fromTo(pres, { opacity: 0, x: 200, y: 880 }, { opacity: 1, x: 300, y: 880, duration: 0.9, ease: "power3.out" }, 0.2);
      tl.fromTo(h, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 0.7);
      tl.fromTo(s, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.1);
      [0,1,2].forEach(function(i){
        var xy = [[1090,470],[1120,600],[1090,730]][i];
        tl.fromTo(ks[i], { opacity: 0, x: xy[0] - 220, y: xy[1], scale: 0.3 }, { opacity: 1, x: xy[0], y: xy[1], scale: 0.8, duration: 0.7, ease: "back.out(1.7)", transformOrigin: "50% 50%" }, 2.2 + i * 0.5);
      });
      tl.fromTo(ar, { opacity: 0 }, { opacity: 0.95, duration: 0.6, ease: "power2.out" }, 4.2);
      tl.fromTo(brain, { opacity: 0, x: 1520, y: 380, scale: 0.4 }, { opacity: 1, x: 1520, y: 380, scale: 0.62, duration: 0.7, ease: "back.out(1.7)", transformOrigin: "50% 50%" }, 4.5);
      tl.fromTo(cb, { opacity: 0, x: 26 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, 4.9);
      tl.fromTo(musc, { opacity: 0, x: 1520, y: 800, scale: 0.4 }, { opacity: 1, x: 1520, y: 800, scale: 0.62, duration: 0.7, ease: "back.out(1.7)", transformOrigin: "50% 50%" }, 5.4);
      tl.fromTo(cm, { opacity: 0, x: 26 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, 5.8);
      bob(liver, 1.2, 10, 1.4, 560);`,
});

/* ===== 7 WEIGHT LOSS ===== */
F.push({ id: "07-weight-loss", k: "wl", dur: 7.001, base: 6.165,
  css: HERO("wl", 66, 128) + SUB("wl", 226, 40),
  body: `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;">
  ${cosmos("wl", { seed: 71, a: "#3AE0C0", b: "#7A4CE0" })}
  <g id="wl-cells">${[[520,660],[760,700],[1000,660]].map(([x,y],i)=>`<g id="wl-fc${i+1}" transform="translate(${x} ${y}) scale(0.78)">${fatCellArt("wl", "wl-fcc" + i)}</g>`).join("")}</g>
  <g id="wl-bodies">
    <g transform="translate(1400 690) scale(1.05)">${figBuilt("wl")}</g>
    <g transform="translate(1710 700) scale(1.05)">${figLean("wl")}</g>
  </g></svg>
<div class="wl-h wl-hero">PLOT TWIST</div>
<div class="wl-s wl-sub">less carbs &rarr; less insulin &rarr; the fat stores shrink</div>
<div class="wl-c wl-chip wl-chipc" style="position:absolute;left:1330px;top:900px;">same chemistry &mdash; every body</div>`,
  js: `
      var cells = [q('#wl-fc1'), q('#wl-fc2'), q('#wl-fc3')], bodies = q('#wl-bodies'),
          c = q('.wl-c'), h = q('.wl-h'), s = q('.wl-s');
      gsap.set([c, h, s], { opacity: 0 }); gsap.set(bodies, { opacity: 0 });
      tl.fromTo(cells, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 0.78, duration: 0.8, stagger: 0.12, ease: "back.out(1.7)", transformOrigin: "50% 50%" }, 0.05);
      tl.fromTo(h, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.8)", transformOrigin: "50% 50%" }, 0.9);
      tl.fromTo(s, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.5);
      cells.forEach(function(el, i){ tl.to(el, { scale: 0.4, duration: 0.9, ease: "power3.out", transformOrigin: "50% 50%" }, 2.2 + i * 0.4); });
      tl.fromTo(bodies, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 3.6);
      tl.fromTo(c, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 4.4);`,
});

/* ===== 8 EXERCISE ===== */
F.push({ id: "08-exercise-lactate", k: "ex", dur: 4.814, base: 5.248,
  css: HERO("ex", 74, 92) + SUB("ex", 196, 40),
  body: `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;">
  ${cosmos("ex", { seed: 83, a: "#FF7A3A", b: "#E03A8A", c: "#4BE8FF" })}
  <g id="ex-musc" transform="translate(1220 580) scale(1.2)">${muscleArt("ex")}</g>
  <g id="ex-fig" transform="translate(520 720) scale(1.25)">${figBuilt("ex")}</g>
  <g id="ex-lac" transform="translate(1560 320)">
    <ellipse cx="0" cy="0" rx="120" ry="120" fill="url(#ex-halo)"/>
    <path d="M0 -56 C40 -8 58 26 58 48 C58 84 30 110 0 110 C-30 110 -58 84 -58 48 C-58 26 -40 -8 0 -56 Z" fill="url(#ex-ket)" stroke="${INK}" stroke-width="6" stroke-opacity="0.75"/>
    ${gloss("M-18 26 C-8 6 8 2 18 10 C4 22 -6 42 -8 56 C-18 48 -22 38 -18 26 Z", 0.5)}
  </g></svg>
<div class="ex-h ex-hero">MUSCLES MAKE LACTATE</div>
<div class="ex-s ex-sub">working muscle pumps it straight into the blood</div>
<div class="ex-c ex-chip" style="position:absolute;left:1418px;top:472px;">LACTATE</div>`,
  js: `
      var musc = q('#ex-musc'), fig = q('#ex-fig'), lac = q('#ex-lac'), c = q('.ex-c'), h = q('.ex-h'), s = q('.ex-s');
      gsap.set([c, h, s], { opacity: 0 }); gsap.set(lac, { opacity: 0 });
      tl.fromTo(fig, { opacity: 0, x: 400, y: 720 }, { opacity: 1, x: 520, y: 720, duration: 0.9, ease: "back.out(1.3)" }, 0.05);
      tl.fromTo(musc, { opacity: 0, x: 1220, y: 580, scale: 0.8 }, { opacity: 1, x: 1220, y: 580, scale: 1.2, duration: 0.9, ease: "back.out(1.4)", transformOrigin: "50% 50%" }, 0.4);
      tl.fromTo(h, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 0.8);
      tl.fromTo(s, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.2);
      tl.fromTo(lac, { opacity: 0, x: 1560, y: 400, scale: 0.4 }, { opacity: 1, x: 1560, y: 320, scale: 1, duration: 0.7, ease: "back.out(1.9)", transformOrigin: "50% 50%" }, 2.6);
      tl.fromTo(c, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 3.0);
      bob(musc, 1.4, 12, 1.6, 580);`,
});

/* ===== 9 BDNF ===== */
F.push({ id: "09-bdnf", k: "bd", dur: 7.108, base: 8.533,
  css: HERO("bd", 62, 84) + SUB("bd", 172, 38) + `.bd-cite{position:absolute;left:110px;top:970px;font-size:26px;
      font-family:'KleeOne',serif;color:#EAF3FF;background:rgba(30,10,60,0.82);border:3px solid #7A4CE0;border-radius:999px;padding:11px 26px;}`,
  body: `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;">
  ${cosmos("bd", { seed: 97, a: "#FF4FA3", b: "#6A3AE0", c: "#4BE8FF" })}
  <g id="bd-brain" transform="translate(1180 560) scale(1.22)">${brainArt("bd", { hip: "bd-hip" })}</g>
  <g id="bd-pres" transform="translate(390 880) scale(0.94)">${presenter("bd", {})}</g>
  <g id="bd-spark" transform="translate(660 800)">
    <ellipse cx="0" cy="0" rx="90" ry="90" fill="url(#bd-halo)"/>
    <path d="M0 -42 C28 -6 40 16 40 34 C40 60 22 78 0 78 C-22 78 -40 60 -40 34 C-40 16 -28 -6 0 -42 Z" fill="url(#bd-ket)" stroke="${INK}" stroke-width="5" stroke-opacity="0.7"/></g>
  <g id="bd-neu" opacity="0">${[["M-186 -70 C-146 -114 -92 -120 -58 -86"],["M-36 -152 C4 -186 68 -184 98 -146"],["M-176 16 C-126 -24 -60 -22 -24 16"],["M14 -30 C56 -70 122 -62 150 -14"]].map((d,i)=>`<path id="bd-n${i+1}" d="${d[0]}" fill="none" stroke="#FFE96B" stroke-width="11" stroke-linecap="round" opacity="0.1"/>`).join("")}</g>
</svg>
<div class="bd-h bd-hero">LACTATE WAKES THE BRAIN</div>
<div class="bd-s bd-sub">it crosses in and raises BDNF &mdash; brain cells build stronger links</div>
<div class="bd-c bd-chip bd-chipp" style="position:absolute;left:1240px;top:872px;">hippocampus &mdash; BDNF &uarr;</div>
<div class="bd-cite">El Hayek et al., 2019 &mdash; J. Neuroscience &middot; lactate-induced hippocampal BDNF (SIRT1 / PGC-1&alpha; / FNDC5)</div>`,
  js: `
      var brain = q('#bd-brain'), pres = q('#bd-pres'), sp = q('#bd-spark'), neu = q('#bd-neu'),
          hip = q('#bd-hip'), c = q('.bd-c'), cite = q('.bd-cite'), h = q('.bd-h'), s = q('.bd-s');
      var ns = [q('#bd-n1'), q('#bd-n2'), q('#bd-n3'), q('#bd-n4')];
      gsap.set([c, cite, h, s], { opacity: 0 }); gsap.set(sp, { opacity: 0 });
      tl.fromTo(brain, { opacity: 0, x: 1180, y: 560, scale: 0.9 }, { opacity: 1, x: 1180, y: 560, scale: 1.22, duration: 1.1, ease: "power3.out", transformOrigin: "50% 50%" }, 0.05);
      tl.fromTo(pres, { opacity: 0, x: 290, y: 880 }, { opacity: 1, x: 390, y: 880, duration: 0.9, ease: "power3.out" }, 0.2);
      tl.fromTo(h, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 0.7);
      tl.fromTo(s, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.1);
      tl.fromTo(sp, { opacity: 0, x: 660, y: 830, scale: 0.5 }, { opacity: 1, x: 660, y: 800, scale: 1, duration: 0.6, ease: "back.out(1.9)", transformOrigin: "50% 50%" }, 1.8);
      tl.to(sp, { x: 1100, y: 560, duration: 1.5, ease: "power2.inOut" }, 2.4);
      tl.to(sp, { opacity: 0, scale: 0.4, duration: 0.3, ease: "power2.in", transformOrigin: "50% 50%" }, 3.8);
      tl.fromTo(neu, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" }, 3.9);
      ns.forEach(function(nn, i){ tl.fromTo(nn, { opacity: 0.1, strokeWidth: 11 }, { opacity: 1, strokeWidth: 16, duration: 0.45, ease: "power3.out" }, 4.0 + i * 0.5); });
      tl.fromTo(hip, { opacity: 0.22 }, { opacity: 1, duration: 0.6, ease: "power3.out" }, 6.0);
      tl.fromTo(c, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 6.3);
      tl.fromTo(cite, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 7.0);
      bob(brain, 1.4, 10, 1.3, 560);`,
});

/* ===== 10 LANDING ===== */
F.push({ id: "10-landing", k: "ld", dur: 3.400, base: 3.925,
  css: HERO("ld", 616, 116) + SUB("ld", 800, 42),
  body: `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;">
  ${cosmos("ld", { seed: 101, a: "#FFB03A", b: "#FF3D9A", c: "#4BE8FF" })}
  <g id="ld-b" transform="translate(660 380) scale(0.56)">${brainArt("ld", {})}</g>
  <g id="ld-l" transform="translate(1260 360) scale(0.5)">${liverArt("ld")}</g>
  <g id="ld-m" transform="translate(960 470) scale(0.56)">${muscleArt("ld")}</g>
  <g id="ld-pres" transform="translate(300 1010) scale(0.86)">${presenter("ld", {})}</g>
</svg>
<div class="ld-grp2">
<div class="ld-h ld-hero">REAL SCIENCE. REAL FUEL.</div>
<div class="ld-s ld-sub">one seriously overachieving body</div></div>`,
  js: `
      var b = q('#ld-b'), l = q('#ld-l'), m = q('#ld-m'), pres = q('#ld-pres'),
          h = q('.ld-h'), s = q('.ld-s'), g2 = q('.ld-grp2');
      gsap.set([h, s], { opacity: 0 });
      tl.fromTo(b, { opacity: 0, x: 660, y: 430, scale: 0.34 }, { opacity: 1, x: 660, y: 380, scale: 0.56, duration: 0.8, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 0.05);
      tl.fromTo(m, { opacity: 0, x: 960, y: 520, scale: 0.34 }, { opacity: 1, x: 960, y: 470, scale: 0.56, duration: 0.8, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 0.18);
      tl.fromTo(l, { opacity: 0, x: 1260, y: 410, scale: 0.3 }, { opacity: 1, x: 1260, y: 360, scale: 0.5, duration: 0.8, ease: "back.out(1.6)", transformOrigin: "50% 50%" }, 0.31);
      tl.fromTo(pres, { opacity: 0, x: 200, y: 1010 }, { opacity: 1, x: 300, y: 1010, duration: 0.8, ease: "power3.out" }, 0.2);
      tl.fromTo(h, { opacity: 0, scale: 0.72 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", transformOrigin: "50% 50%" }, 1.1);
      tl.fromTo(s, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 2.0);
      tl.to(g2, { opacity: 0, duration: 0.3, ease: "power2.in" }, BASE - 0.3);`,
});

for (const fr of F) {
  writeFileSync(join(OUT, fr.id + ".html"), shell(fr.id, fr.k, fr.dur, fr.base, fr.body, fr.js, fr.css || ""));
  console.log("wrote", fr.id);
}
