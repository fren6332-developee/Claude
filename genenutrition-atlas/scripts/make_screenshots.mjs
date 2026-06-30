import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const EXE = process.argv[2];
const RAW = process.argv[3];                 // scratch dir for raw screen captures
const OUT = process.argv[4];                 // final output dir
const BASE = 'http://localhost:8755/';
mkdirSync(RAW, { recursive: true });
mkdirSync(OUT, { recursive: true });

// Apple required sizes (portrait).
const SIZES = {
  'iphone-6.9': { w: 1290, h: 2796, kind: 'phone' },   // iPhone 6.7"/6.9" — required set
  'ipad-12.9':  { w: 2048, h: 2732, kind: 'tablet' }   // iPad 12.9"/13" — if iPad supported
};

const SCREENS = [
  { id: 'home',   caption: '27 mental-health genes,\nexplained simply' },
  { id: 'detail', caption: 'Plain-language explanations\nwith calm audio' },
  { id: 'foods',  caption: 'Five foods that support\neach gene’s pathway' },
  { id: 'safety', caption: 'Trusted sources.\nPrivate by design.' },
  { id: 'gate',   caption: 'An educational reference,\nbuilt responsibly' }
];

const browser = await chromium.launch({ executablePath: EXE });

/* ---------- 1. Capture raw app screens ---------- */
async function capture(kind, vw, vh) {
  const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: 3 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  // gate first
  await page.waitForSelector('#ackGate');
  await page.screenshot({ path: join(RAW, `${kind}-gate.png`) });
  await page.click('#ackAgree');
  // Kill smooth scrolling so jump-to-position is deterministic (SPA, persists).
  await page.addStyleTag({ content: '*{scroll-behavior:auto !important;}' });
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(RAW, `${kind}-home.png`) });
  // detail — force instant top so the hero (name + Listen + population) shows
  await page.click('text=BDNF');
  await page.waitForSelector('#listenBtn');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(350);
  await page.screenshot({ path: join(RAW, `${kind}-detail.png`) });
  // foods — align the foods section to the top (just below the sticky header)
  await page.evaluate(() => {
    const s = [...document.querySelectorAll('.section')].find(x => x.querySelector('.food-list'));
    if (s) { s.scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(RAW, `${kind}-foods.png`) });
  // safety
  await page.click('#backBtn');
  await page.waitForTimeout(150);
  await page.click('#safetyBtn');
  await page.waitForSelector('.crisis-box');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(RAW, `${kind}-safety.png`) });
  await page.close();
}
await capture('phone', 390, 844);
await capture('tablet', 1024, 1366);

/* ---------- 2. Composite framed marketing screenshots ---------- */
const GRADS = [
  'linear-gradient(160deg,#6C63FF,#00B8A9)',
  'linear-gradient(160deg,#F6416C,#FF9F45)',
  'linear-gradient(160deg,#3DA5D9,#6C63FF)',
  'linear-gradient(160deg,#00B8A9,#3DA5D9)',
  'linear-gradient(160deg,#7B6CF6,#F6416C)'
];

function composeHtml(W, H, caption, imgFile, grad, kind) {
  const cap = Math.round(W * (kind === 'tablet' ? 0.046 : 0.058));
  const pad = Math.round(W * 0.07);
  const screenH = Math.round(H * (kind === 'tablet' ? 0.70 : 0.72));
  const bezel = Math.round(W * (kind === 'tablet' ? 0.012 : 0.014));
  const radius = Math.round(W * (kind === 'tablet' ? 0.03 : 0.055));
  return `<!DOCTYPE html><html><head><meta charset="utf8"><style>
    * { margin:0; box-sizing:border-box; }
    html,body { width:${W}px; height:${H}px; }
    .wrap { width:${W}px; height:${H}px; background:${grad};
      display:flex; flex-direction:column; align-items:center;
      padding:${pad}px ${pad}px 0; font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif; }
    .cap { color:#fff; font-weight:800; font-size:${cap}px; line-height:1.18; text-align:center;
      letter-spacing:-0.5px; white-space:pre-line; text-shadow:0 2px 14px rgba(0,0,0,.18);
      margin-bottom:${Math.round(W*0.05)}px; }
    .device { background:#0e1018; padding:${bezel}px; border-radius:${radius+bezel}px;
      box-shadow:0 ${Math.round(W*0.03)}px ${Math.round(W*0.08)}px rgba(0,0,0,.35); }
    .device img { display:block; height:${screenH}px; width:auto; border-radius:${radius}px; }
  </style></head><body>
    <div class="wrap"><div class="cap">${caption}</div>
      <div class="device"><img src="${imgFile}"></div></div>
  </body></html>`;
}

const page = await browser.newPage();
const manifest = [];
for (const [sizeName, s] of Object.entries(SIZES)) {
  const kind = s.kind;
  for (let i = 0; i < SCREENS.length; i++) {
    const sc = SCREENS[i];
    const rawFile = `${kind}-${sc.id}.png`;                     // relative to RAW dir
    const html = composeHtml(s.w, s.h, sc.caption, rawFile, GRADS[i % GRADS.length], kind);
    const htmlPath = join(RAW, `_compose_${sizeName}_${sc.id}.html`);
    writeFileSync(htmlPath, html);
    await page.setViewportSize({ width: s.w, height: s.h });
    await page.goto('file://' + htmlPath, { waitUntil: 'load' });
    await page.evaluate(() => Promise.all(Array.from(document.images).map(
      img => img.complete ? 1 : new Promise(r => { img.onload = img.onerror = r; }))));
    await page.waitForTimeout(120);
    const outName = `${sizeName}_${String(i+1).padStart(2,'0')}_${sc.id}.png`;
    await page.screenshot({ path: join(OUT, outName), clip: { x:0, y:0, width:s.w, height:s.h } });
    manifest.push(`${outName}  (${s.w}x${s.h})`);
  }
}
await browser.close();
writeFileSync(join(OUT, 'INDEX.txt'),
  'GeneNutrition Atlas — App Store screenshots\n\n' + manifest.join('\n') + '\n');
console.log('Generated', manifest.length, 'screenshots');
manifest.forEach(m => console.log(' ', m));
