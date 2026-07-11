// Burns in on-beat captions from a word-level transcript (WhisperX-shaped:
// [{ text, start, end }, ...], seconds absolute in the base video), applying
// caption-corrections.json fixes and the format's locked caption preset.
import { readFile, mkdir } from 'node:fs/promises';
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

/** Applies caption-corrections.json's `corrections` map ({ wrong: right }), case-insensitively, whole-word. */
export function applyCorrections(words, corrections) {
  const pairs = Object.entries(corrections);
  return words.map((w) => {
    let text = w.text;
    for (const [wrong, right] of pairs) {
      const re = new RegExp(`\\b${wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      text = text.replace(re, right);
    }
    return { ...w, text };
  });
}

/**
 * Groups word-level timestamps into caption cues (on-screen lines). A new
 * cue starts on a silence gap over `maxGapSec`, or once a cue would exceed
 * `maxWords` / `maxCueDurationSec`.
 */
export function groupIntoCues(words, { maxWords = 6, maxCueDurationSec = 3.2, maxGapSec = 0.6 } = {}) {
  const cues = [];
  let current = [];

  for (const word of words) {
    const prev = current[current.length - 1];
    const gapTooBig = prev && word.start - prev.end > maxGapSec;
    const tooLong = prev && word.end - current[0].start > maxCueDurationSec;
    const tooManyWords = current.length >= maxWords;

    if (current.length > 0 && (gapTooBig || tooLong || tooManyWords)) {
      cues.push(current);
      current = [];
    }
    current.push(word);
  }
  if (current.length > 0) cues.push(current);

  return cues.map((cueWords) => ({
    start: cueWords[0].start,
    end: cueWords[cueWords.length - 1].end,
    words: cueWords,
  }));
}

/**
 * @param {object} opts
 * @param {string} opts.transcriptPath - word-level transcript JSON.
 * @param {string} opts.correctionsPath - presets/caption-corrections.json.
 * @param {string} opts.presetPath - the format's locked caption preset json.
 * @param {string} opts.baseVideo
 * @param {string} opts.outDir
 * @param {string} opts.outFile
 * @param {number} [opts.fps]
 * @param {boolean} [opts.dryRun]
 */
export async function renderCaptions({
  transcriptPath,
  correctionsPath,
  presetPath,
  baseVideo,
  outDir,
  outFile,
  fps = 30,
  dryRun = false,
}) {
  const words = JSON.parse(await readFile(transcriptPath, 'utf-8'));
  const correctionsDoc = JSON.parse(await readFile(correctionsPath, 'utf-8'));
  const preset = JSON.parse(await readFile(presetPath, 'utf-8'));
  const engine = preset.engine;
  if (!engine?.captions_template) {
    throw new Error(`Preset ${preset.preset ?? presetPath} has no engine.captions_template`);
  }

  const corrected = applyCorrections(words, correctionsDoc.corrections ?? {});
  const cues = groupIntoCues(corrected);

  const templatePath = path.join(TEMPLATES_DIR, engine.captions_template);
  const templateSrc = await readFile(templatePath, 'utf-8');

  await mkdir(outDir, { recursive: true });

  const commands = [];
  let currentBase = baseVideo;

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    const durationSec = cue.end - cue.start;
    const cueDir = path.join(outDir, `cue-${String(i).padStart(3, '0')}`);

    const sceneData = {
      position: engine.captions_position,
      fontSizePct: preset.typography?.size_pct_of_frame_height,
      words: cue.words.map((w) => ({ text: w.text, start: w.start - cue.start, end: w.end - cue.start })),
    };
    const html = fillTemplate(templateSrc, { DATA: sceneData });

    // Frame rendering always runs for real (Playwright/Chromium) --
    // `dryRun` only controls whether we shell out to ffmpeg below, so tests
    // can exercise the actual HTML rendering without requiring ffmpeg.
    await renderFrames({
      html,
      width: cue.width ?? 1080,
      height: cue.height ?? 1920,
      durationSec,
      fps,
      outDir: cueDir,
    });

    const overlayFile = path.join(outDir, `cue-${String(i).padStart(3, '0')}-overlay.mov`);
    const toOverlayArgs = buildFrameSequenceToOverlayArgs({
      framesGlob: path.join(cueDir, 'frame-%06d.png'),
      fps,
      outFile: overlayFile,
    });
    const compositeFile = path.join(outDir, `composite-${String(i).padStart(3, '0')}.mp4`);
    const overlayArgs = buildOverlayCompositeArgs({
      baseFile: currentBase,
      overlayFile,
      startSec: cue.start,
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

  return { commands, cuesRendered: cues.length, outFile };
}
