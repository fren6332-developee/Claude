// Renders a graphics-plan.json into frame sequences (one per beat) and
// composites them onto the base video, in order. Which HTML template and
// motion parameters to use comes from the format's locked preset's
// `engine` block (see presets/*.json) -- never hardcode style choices here.
import { readFile, readdir, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderFrames, fillTemplate } from './render-html.js';
import {
  buildFrameSequenceToOverlayArgs,
  buildOverlayCompositeArgs,
  runFfmpeg,
} from './ffmpeg.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, 'templates');

/**
 * @param {object} opts
 * @param {string} opts.planPath - path to graphics-plan.json (array of
 *   { start, end, copy, type } beats, seconds relative to the base video).
 * @param {string} opts.presetPath - path to the format's locked preset json.
 * @param {string} opts.baseVideo - path to the video to composite onto.
 * @param {string} opts.outDir - scratch dir for frame sequences + intermediates.
 * @param {string} opts.outFile - final composited video path.
 * @param {number} [opts.fps]
 * @param {boolean} [opts.dryRun] - build ffmpeg argv but don't execute; for tests.
 */
export async function renderGraphics({ planPath, presetPath, baseVideo, outDir, outFile, fps = 30, dryRun = false }) {
  const beats = JSON.parse(await readFile(planPath, 'utf-8'));
  const preset = JSON.parse(await readFile(presetPath, 'utf-8'));
  const engine = preset.engine;
  if (!engine?.graphics_template) {
    throw new Error(`Preset ${preset.preset ?? presetPath} has no engine.graphics_template`);
  }

  const templatePath = path.join(TEMPLATES_DIR, engine.graphics_template);
  const templateSrc = await readFile(templatePath, 'utf-8');

  await mkdir(outDir, { recursive: true });

  const commands = [];
  let currentBase = baseVideo;

  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    const durationSec = beat.end - beat.start;
    if (durationSec <= 0) {
      throw new Error(`Beat ${i} has non-positive duration (start=${beat.start}, end=${beat.end})`);
    }

    const beatDir = path.join(outDir, `beat-${String(i).padStart(3, '0')}`);
    const sceneData = {
      copy: beat.copy,
      durationSec,
      inDurationSec: engine.in_duration_sec,
      outDurationSec: engine.out_duration_sec,
      zoomPct: engine.zoom_pct,
    };
    const html = fillTemplate(templateSrc, { DATA: sceneData });

    // Frame rendering always runs for real (Playwright/Chromium) --
    // `dryRun` only controls whether we shell out to ffmpeg below, so tests
    // can exercise the actual HTML rendering without requiring ffmpeg.
    await renderFrames({
      html,
      width: beat.width ?? 1080,
      height: beat.height ?? 1920,
      durationSec,
      fps,
      outDir: beatDir,
    });

    const overlayFile = path.join(outDir, `beat-${String(i).padStart(3, '0')}-overlay.mov`);
    const toOverlayArgs = buildFrameSequenceToOverlayArgs({
      framesGlob: path.join(beatDir, 'frame-%06d.png'),
      fps,
      outFile: overlayFile,
    });
    const compositeFile = path.join(outDir, `composite-${String(i).padStart(3, '0')}.mp4`);
    const overlayArgs = buildOverlayCompositeArgs({
      baseFile: currentBase,
      overlayFile,
      startSec: beat.start,
      outFile: compositeFile,
    });

    commands.push({ step: 'encode-overlay', args: toOverlayArgs });
    commands.push({ step: 'composite', args: overlayArgs });

    if (!dryRun) {
      runFfmpeg(toOverlayArgs);
      runFfmpeg(overlayArgs);
    }
    currentBase = compositeFile;
  }

  if (!dryRun) {
    await runFfmpeg(['-y', '-i', currentBase, '-c', 'copy', outFile]);
  }

  return { commands, beatsRendered: beats.length, outFile };
}
