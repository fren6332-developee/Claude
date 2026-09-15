// Crops/scales/pads source footage to a format's target aspect ratio +
// resolution (e.g. 16:9 raw down to 9:16 short-form).
import { buildReframeArgs, runFfmpeg } from './ffmpeg.js';

export async function reframe({ inFile, width, height, outFile, dryRun = false }) {
  const args = buildReframeArgs({ inFile, width, height, outFile });
  if (!dryRun) runFfmpeg(args);
  return { args };
}
