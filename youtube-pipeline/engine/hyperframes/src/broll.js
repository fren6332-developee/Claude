// Splices b-roll clips into the base video at marked timestamps. Footage
// *selection* (which b-roll, at which beat) is an editorial decision made
// upstream by the graphics-plan skill / a human -- this module only
// mechanically executes a plan of { start, end, clip } entries.
import { readFile } from 'node:fs/promises';
import { buildBrollSpliceArgs, runFfmpeg } from './ffmpeg.js';

/**
 * @param {object} opts
 * @param {string} opts.planPath - JSON array of { start, end, clip } entries,
 *   sorted by start, non-overlapping, seconds relative to the base video.
 * @param {string} opts.baseVideo
 * @param {string} opts.outFile
 * @param {boolean} [opts.dryRun]
 */
export async function spliceBroll({ planPath, baseVideo, outFile, dryRun = false }) {
  const plan = JSON.parse(await readFile(planPath, 'utf-8'));
  const commands = [];
  let currentBase = baseVideo;

  for (let i = 0; i < plan.length; i++) {
    const entry = plan[i];
    const isLast = i === plan.length - 1;
    const stepOut = isLast ? outFile : `${outFile}.step-${i}.mp4`;
    const args = buildBrollSpliceArgs({
      baseFile: currentBase,
      brollFile: entry.clip,
      start: entry.start,
      end: entry.end,
      outFile: stepOut,
    });
    commands.push(args);
    if (!dryRun) runFfmpeg(args);
    currentBase = stepOut;
  }

  return { commands, splicesApplied: plan.length };
}
