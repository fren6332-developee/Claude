import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const EXE = process.argv[2];
const SVG = process.argv[3];   // icon-master.svg
const OUT = process.argv[4];

// Motif only (strip the icon's background rects so the helix sits on the splash bg)
const motif = readFileSync(SVG, 'utf8')
  .replace(/<rect width="512" height="512" fill="url\(#g\)"\/>/, '')
  .replace(/<rect width="512" height="512" fill="url\(#hl\)"\/>/, '');

mkdirSync(OUT, { recursive: true });
mkdirSync(join(OUT, 'capacitor'), { recursive: true });
mkdirSync(join(OUT, 'store'), { recursive: true });

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage();

function splashHtml(w, h, dark) {
  const m = Math.min(w, h);
  const bg = dark
    ? 'radial-gradient(120% 120% at 50% 38%, #1a1f3a 0%, #0e1018 70%)'
    : 'linear-gradient(160deg,#6C63FF,#00B8A9)';
  const logo = Math.round(m * 0.26);
  const name = Math.round(m * 0.064);
  const tag  = Math.round(m * 0.030);
  return `<!DOCTYPE html><html><head><meta charset="utf8"><style>
    *{margin:0;box-sizing:border-box;}
    html,body{width:${w}px;height:${h}px;}
    .s{width:${w}px;height:${h}px;background:${bg};
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;}
    .logo{width:${logo}px;height:${logo}px;filter:drop-shadow(0 ${Math.round(m*0.012)}px ${Math.round(m*0.03)}px rgba(0,0,0,.25));}
    .logo svg{width:100%;height:100%;}
    .name{color:#fff;font-weight:800;font-size:${name}px;letter-spacing:-1px;margin-top:${Math.round(m*0.05)}px;}
    .tag{color:#fff;opacity:.9;font-size:${tag}px;margin-top:${Math.round(m*0.012)}px;}
  </style></head><body>
    <div class="s">
      <div class="logo">${motif}</div>
      <div class="name">NeuroNourish</div>
      <div class="tag">Understand your mind.</div>
    </div>
  </body></html>`;
}

async function render(w, h, outPath, dark = false) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(splashHtml(w, h, dark), { waitUntil: 'load' });
  await page.waitForTimeout(80);
  await page.screenshot({ path: outPath, clip: { x:0, y:0, width:w, height:h } });
}

// Capacitor sources (@capacitor/assets generates all platform splashes from these)
await render(2732, 2732, join(OUT, 'capacitor', 'splash.png'), false);
await render(2732, 2732, join(OUT, 'capacitor', 'splash-dark.png'), true);

// Store / reference renders
await render(2732, 2732, join(OUT, 'store', 'splash-2732-light.png'), false);
await render(2732, 2732, join(OUT, 'store', 'splash-2732-dark.png'), true);
await render(1290, 2796, join(OUT, 'store', 'iphone-1290x2796.png'), false);
await render(2048, 2732, join(OUT, 'store', 'ipad-2048x2732.png'), false);
await render(1080, 1920, join(OUT, 'store', 'generic-1080x1920.png'), false);

await browser.close();
console.log('Splash set generated under', OUT);
