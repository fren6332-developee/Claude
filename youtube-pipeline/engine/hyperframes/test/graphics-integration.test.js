// End-to-end test of the graphics-plan.json -> rendered frame sequences
// path, using the real signature-style preset and template shipped in
// presets/ and src/templates/. Runs real Chromium; only the final ffmpeg
// composite is skipped (dryRun) since ffmpeg isn't assumed to be installed
// wherever these tests run.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderGraphics } from '../src/graphics.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PIPELINE_ROOT = path.resolve(__dirname, '../../..');
const SIGNATURE_PRESET = path.join(PIPELINE_ROOT, 'presets', 'signature-style.json');

test('renderGraphics renders real frames for each beat and records the ffmpeg composite plan', async (t) => {
  const workDir = await mkdtemp(path.join(tmpdir(), 'hf-graphics-'));
  t.after(() => rm(workDir, { recursive: true, force: true }));

  const planPath = path.join(workDir, 'graphics-plan.json');
  await writeFile(
    planPath,
    JSON.stringify([
      { start: 0, end: 1, copy: 'Beat one', width: 200, height: 200 },
      { start: 3, end: 4.5, copy: 'Beat two', width: 200, height: 200 },
    ])
  );

  const outDir = path.join(workDir, 'render');
  const result = await renderGraphics({
    planPath,
    presetPath: SIGNATURE_PRESET,
    baseVideo: path.join(workDir, 'fake-base.mp4'), // never opened in dryRun
    outDir,
    outFile: path.join(workDir, 'composite.mp4'),
    fps: 5,
    dryRun: true,
  });

  assert.equal(result.beatsRendered, 2);

  const beat0Frames = await readdir(path.join(outDir, 'beat-000'));
  const beat1Frames = await readdir(path.join(outDir, 'beat-001'));
  assert.equal(beat0Frames.filter((f) => f.endsWith('.png')).length, 5); // 1s @ 5fps
  assert.equal(beat1Frames.filter((f) => f.endsWith('.png')).length, 8); // 1.5s @ 5fps (rounded)

  // Beat 1 starts at t=3s in the base video -- the overlay composite step
  // must carry that offset through.
  const compositeStep = result.commands.find((c) => c.step === 'composite' && c.args.includes('3'));
  assert.ok(compositeStep, 'expected a composite command offset at start=3 for beat two');
});

test('renderGraphics rejects a beat with non-positive duration', async (t) => {
  const workDir = await mkdtemp(path.join(tmpdir(), 'hf-graphics-'));
  t.after(() => rm(workDir, { recursive: true, force: true }));

  const planPath = path.join(workDir, 'graphics-plan.json');
  await writeFile(planPath, JSON.stringify([{ start: 5, end: 5, copy: 'bad beat' }]));

  await assert.rejects(
    () =>
      renderGraphics({
        planPath,
        presetPath: SIGNATURE_PRESET,
        baseVideo: 'unused.mp4',
        outDir: path.join(workDir, 'render'),
        outFile: path.join(workDir, 'composite.mp4'),
        dryRun: true,
      }),
    /non-positive duration/
  );
});
