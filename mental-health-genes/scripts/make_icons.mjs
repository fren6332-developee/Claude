import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const EXE = process.argv[2];
const SVG = process.argv[3];          // path to icon-master.svg
const OUT = process.argv[4];          // output root
const svg = readFileSync(SVG, 'utf8');

const dirs = {
  ios:    join(OUT, 'ios', 'AppIcon.appiconset'),
  androidMip: (d) => join(OUT, 'android', `mipmap-${d}`),
  androidExtra: join(OUT, 'android'),
  web:    join(OUT, 'web'),
  master: OUT
};
mkdirSync(dirs.ios, { recursive: true });
mkdirSync(dirs.web, { recursive: true });
['mdpi','hdpi','xhdpi','xxhdpi','xxxhdpi'].forEach(d => mkdirSync(dirs.androidMip(d), { recursive: true }));

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage();

// Render the master SVG (opaque, full-bleed) at an exact pixel size.
async function render(size, outPath, { round = false, fgOnly = false } = {}) {
  const radius = round ? '50%' : '0';
  // fgOnly = transparent background with just the motif (for Android adaptive foreground)
  let inner = svg;
  if (fgOnly) {
    inner = svg
      .replace(/<rect width="512" height="512" fill="url\(#g\)"\/>/, '')
      .replace(/<rect width="512" height="512" fill="url\(#hl\)"\/>/, '');
  }
  const html = `<!DOCTYPE html><html><head><meta charset="utf8"><style>
    html,body{margin:0;padding:0;width:${size}px;height:${size}px;background:transparent;}
    .b{width:${size}px;height:${size}px;border-radius:${radius};overflow:hidden;}
    svg{display:block;width:${size}px;height:${size}px;}
  </style></head><body><div class="b">${inner}</div></body></html>`;
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: outPath, clip: { x:0, y:0, width:size, height:size }, omitBackground: fgOnly || round });
}

/* ---------- iOS AppIcon.appiconset ---------- */
const iosPx = [20,29,40,58,60,76,80,87,120,152,167,180,1024];
for (const px of iosPx) await render(px, join(dirs.ios, `AppIcon-${px}.png`));

const iosImages = [
  ['iphone','20x20','2x',40],['iphone','20x20','3x',60],
  ['iphone','29x29','2x',58],['iphone','29x29','3x',87],
  ['iphone','40x40','2x',80],['iphone','40x40','3x',120],
  ['iphone','60x60','2x',120],['iphone','60x60','3x',180],
  ['ipad','20x20','1x',20],['ipad','20x20','2x',40],
  ['ipad','29x29','1x',29],['ipad','29x29','2x',58],
  ['ipad','40x40','1x',40],['ipad','40x40','2x',80],
  ['ipad','76x76','1x',76],['ipad','76x76','2x',152],
  ['ipad','83.5x83.5','2x',167],
  ['ios-marketing','1024x1024','1x',1024]
].map(([idiom,size,scale,px]) => ({ idiom, size, scale, filename:`AppIcon-${px}.png` }));
writeFileSync(join(dirs.ios, 'Contents.json'),
  JSON.stringify({ images: iosImages, info:{ version:1, author:'genenutrition' } }, null, 2));

/* ---------- Android mipmaps ---------- */
const androidDens = { mdpi:48, hdpi:72, xhdpi:96, xxhdpi:144, xxxhdpi:192 };
for (const [d, px] of Object.entries(androidDens)) {
  await render(px, join(dirs.androidMip(d), 'ic_launcher.png'));
  await render(px, join(dirs.androidMip(d), 'ic_launcher_round.png'), { round:true });
  // adaptive foreground (transparent, motif centered with safe-zone padding ~ render at px but motif only)
  await render(px, join(dirs.androidMip(d), 'ic_launcher_foreground.png'), { fgOnly:true });
}
await render(512, join(dirs.androidExtra, 'ic_launcher-playstore.png'));
writeFileSync(join(dirs.androidExtra, 'ic_launcher_background.txt'),
  'Adaptive icon background: solid color #6C63FF (or use a 108dp gradient). Foreground = ic_launcher_foreground.png.\n');

/* ---------- Web / PWA ---------- */
await render(192, join(dirs.web, 'icon-192.png'));
await render(512, join(dirs.web, 'icon-512.png'));
await render(180, join(dirs.web, 'apple-touch-icon.png'));
await render(32,  join(dirs.web, 'favicon-32.png'));

/* ---------- Master ---------- */
await render(1024, join(dirs.master, 'AppStore-1024.png'));

await browser.close();
console.log('Icon set generated under', OUT);
