// Core primitive: renders an HTML/CSS "scene" to a numbered PNG frame sequence
// by driving headless Chromium frame-by-frame. Every higher-level module
// (graphics, captions) is built on this -- it's the only place that touches
// the browser.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {object} opts
 * @param {string} opts.html - full HTML document string for the scene. Must
 *   expose `window.hfSetTime(t)` (t = seconds since the scene started) so the
 *   renderer can drive its animation deterministically, frame by frame.
 * @param {number} opts.width
 * @param {number} opts.height
 * @param {number} opts.durationSec
 * @param {number} opts.fps
 * @param {string} opts.outDir - directory to write frame-%06d.png into.
 * @returns {Promise<string[]>} paths of the frames written, in order.
 */
export async function renderFrames({ html, width, height, durationSec, fps, outDir }) {
  if (durationSec <= 0) throw new Error(`durationSec must be > 0, got ${durationSec}`);
  if (fps <= 0) throw new Error(`fps must be > 0, got ${fps}`);

  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: process.env.HYPERFRAMES_CHROMIUM_PATH || undefined,
  });
  const frameCount = Math.max(1, Math.round(durationSec * fps));
  const framePaths = [];

  try {
    const page = await browser.newPage({
      viewport: { width, height },
      // Transparent page background so the PNG sequence can be composited
      // as an overlay over the base footage rather than covering it.
      colorScheme: 'light',
    });
    await page.emulateMedia({ media: 'screen' });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => {
      document.documentElement.style.background = 'transparent';
      document.body.style.background = 'transparent';
    });

    for (let i = 0; i < frameCount; i++) {
      const t = i / fps;
      await page.evaluate((time) => {
        if (typeof window.hfSetTime === 'function') window.hfSetTime(time);
      }, t);
      const framePath = path.join(outDir, `frame-${String(i).padStart(6, '0')}.png`);
      await page.screenshot({ path: framePath, omitBackground: true });
      framePaths.push(framePath);
    }
  } finally {
    await browser.close();
  }

  return framePaths;
}

/**
 * Fills a template string's `{{key}}` placeholders from `data`, JSON-escaping
 * anything injected into a `<script type="application/json">` block so
 * templates can safely embed arbitrary caption/graphics data.
 */
export function fillTemplate(templateSrc, data) {
  return templateSrc.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in data)) throw new Error(`Template placeholder {{${key}}} has no data`);
    const value = data[key];
    return typeof value === 'string' ? value : JSON.stringify(value);
  });
}

export async function writeManifest(outDir, manifest) {
  await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
}
