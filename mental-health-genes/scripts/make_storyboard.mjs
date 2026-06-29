import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const EXE = process.argv[2];
const RAW = process.argv[3];   // dir with phone-*.png
const OUT = process.argv[4];   // output dir

// Shot 6 is a generated end card (data URI not needed — inline gradient div).
const SHOTS = [
  { n:1, t:'0:00–0:03', img:'phone-home.png',   cap:'Your mind, your genes, your food.',
    action:'App opens; gene grid fades in. (Poster frame.)', vo:'“Meet GeneNutrition Atlas.”', trans:'Cut' },
  { n:2, t:'0:03–0:07', img:'phone-home.png',   cap:'27 mental-health genes, explained simply.',
    action:'Gentle scroll through cards; tap a gene.', vo:'“Twenty-seven genes, in plain language.”', trans:'Push left' },
  { n:3, t:'0:07–0:13', img:'phone-detail.png', cap:'Plain-language guides + calm audio.',
    action:'Detail opens; tap Listen → narration plays.', vo:'(let ~2s of real narration play)', trans:'Cross-dissolve' },
  { n:4, t:'0:13–0:17', img:'phone-foods.png',  cap:'Foods that support each gene’s pathway.',
    action:'Scroll reveals Amplify / Modulate / Protect.', vo:'“…and foods that support the same pathways.”', trans:'Push left' },
  { n:5, t:'0:17–0:21', img:'phone-safety.png', cap:'Trusted sources. Private by design.',
    action:'Scroll disclaimer → sources → privacy.', vo:'“Sourced, transparent, and private.”', trans:'Cross-dissolve' },
  { n:6, t:'0:21–0:24', img:'__endcard__',      cap:'GeneNutrition Atlas — Understand your mind.',
    action:'Brand end card; icon scales in.', vo:'“GeneNutrition Atlas.”', trans:'Fade out' }
];

function cell(s) {
  const thumb = s.img === '__endcard__'
    ? `<div class="thumb endcard"><div class="ec-ic">🧬</div><div class="ec-name">GeneNutrition&nbsp;Atlas</div><div class="ec-tag">Understand your mind.</div></div>`
    : `<div class="thumb"><img src="${s.img}"></div>`;
  return `<div class="cell">
    <div class="cap-bar"><span class="num">${s.n}</span><span class="time">${s.t}</span><span class="trans">${s.trans} ▸</span></div>
    ${thumb}
    <div class="caption">“${s.cap}”</div>
    <div class="meta"><b>Action:</b> ${s.action}</div>
    <div class="meta vo"><b>VO:</b> ${s.vo}</div>
  </div>`;
}

const html = `<!DOCTYPE html><html><head><meta charset="utf8"><style>
  *{box-sizing:border-box;margin:0;font-family:"Segoe UI",Helvetica,Arial,sans-serif;}
  body{width:1680px;background:#f3f4fb;color:#1f2540;}
  .wrap{padding:46px 48px;}
  h1{font-size:40px;letter-spacing:-1px;}
  .sub{color:#5a6079;font-size:19px;margin:6px 0 4px;}
  .specs{color:#5a6079;font-size:15px;margin-bottom:26px;}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;}
  .cell{background:#fff;border:1px solid #e6e8f2;border-radius:18px;overflow:hidden;
    box-shadow:0 8px 26px rgba(40,44,80,.07);display:flex;flex-direction:column;}
  .cap-bar{display:flex;align-items:center;gap:10px;padding:12px 16px;background:#1f2540;color:#fff;}
  .num{background:linear-gradient(135deg,#6C63FF,#00B8A9);width:30px;height:30px;border-radius:50%;
    display:grid;place-items:center;font-weight:800;}
  .time{font-weight:700;font-variant-numeric:tabular-nums;}
  .trans{margin-left:auto;color:#a9b0d0;font-size:14px;}
  .thumb{background:#0e1018;display:flex;justify-content:center;padding:16px;}
  .thumb img{height:520px;width:auto;border-radius:18px;}
  .endcard{height:552px;align-items:center;flex-direction:column;justify-content:center;
    background:linear-gradient(160deg,#6C63FF,#00B8A9);color:#fff;}
  .ec-ic{font-size:90px;filter:drop-shadow(0 4px 12px rgba(0,0,0,.25));}
  .ec-name{font-size:40px;font-weight:800;margin-top:8px;}
  .ec-tag{font-size:21px;opacity:.92;margin-top:4px;}
  .caption{font-weight:800;font-size:21px;padding:14px 16px 4px;line-height:1.2;}
  .meta{font-size:15px;color:#444a66;padding:3px 16px;}
  .meta.vo{color:#6C63FF;padding-bottom:14px;}
  .foot{margin-top:26px;color:#5a6079;font-size:14px;}
</style></head><body><div class="wrap">
  <h1>GeneNutrition Atlas — App Preview storyboard</h1>
  <div class="sub">~24-second App Store preview · 6 beats · real app footage + captions</div>
  <div class="specs">Export: portrait 1080×1920 · H.264 · 30 fps · ≤30 s · poster frame = Shot 1 (Home).
    Full shot notes, VO script, music direction &amp; recording guide: store/app-preview-storyboard.md</div>
  <div class="grid">${SHOTS.map(cell).join('')}</div>
  <div class="foot">Educational positioning throughout — no diagnosis/treatment claims. Captions ≥1.5 s, within safe area. Duck music under Shot 3 so narration is audible.</div>
</div></body></html>`;

const htmlPath = join(RAW, '_storyboard.html');
writeFileSync(htmlPath, html);

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport:{ width:1680, height:1200 }, deviceScaleFactor:2 });
await page.goto('file://' + htmlPath, { waitUntil:'load' });
await page.evaluate(() => Promise.all(Array.from(document.images).map(
  i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; }))));
await page.waitForTimeout(150);
const full = await page.evaluate(() => document.body.scrollHeight);
await page.setViewportSize({ width:1680, height: full });
await page.screenshot({ path: join(OUT, 'app-preview-storyboard.png'), fullPage:true });
await page.pdf({ path: join(OUT, 'app-preview-storyboard.pdf'), width:'1680px', height:(full+20)+'px', printBackground:true });
await browser.close();
console.log('Storyboard sheet rendered:', full, 'px tall');
