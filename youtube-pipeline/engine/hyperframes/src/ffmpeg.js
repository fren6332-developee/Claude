// Thin wrapper around the system ffmpeg binary. HyperFrames does not vendor
// or bundle ffmpeg -- it must be installed on the machine actually running
// the pipeline (see the top-level youtube-pipeline/README.md).
import { spawnSync } from 'node:child_process';

export function assertFfmpegAvailable() {
  const probe = spawnSync('ffmpeg', ['-version']);
  if (probe.error || probe.status !== 0) {
    throw new Error(
      'ffmpeg not found on PATH. HyperFrames composites video with the system ffmpeg -- install it before rendering.'
    );
  }
}

/** Runs ffmpeg with the given argv, throwing with stderr on failure. */
export function runFfmpeg(args, { dryRun = false } = {}) {
  if (dryRun) return { args };
  assertFfmpegAvailable();
  const result = spawnSync('ffmpeg', args, { encoding: 'utf-8' });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed (exit ${result.status}):\n${result.stderr}`);
  }
  return result;
}

/**
 * Builds the argv for turning a PNG frame sequence into a transparency-
 * preserving overlay clip. Pure function -- no I/O -- so it's unit-testable
 * without ffmpeg installed.
 */
export function buildFrameSequenceToOverlayArgs({ framesGlob, fps, outFile }) {
  return [
    '-y',
    '-framerate', String(fps),
    '-i', framesGlob,
    '-c:v', 'png',
    '-pix_fmt', 'rgba',
    outFile,
  ];
}

/**
 * Builds the argv for compositing an overlay clip onto a base video across
 * [startSec, endSec), re-muxing audio through unchanged.
 *
 * Two things matter here and both are load-bearing, not stylistic:
 *  - `enable='between(t,start,end)'`, not `gte(t,start)` -- the overlay must
 *    turn back off at `end`, or it stays composited for the rest of the video.
 *  - `eof_action=pass` -- overlay's default eof_action is `repeat`, which
 *    freezes the overlay input's *last frame* and keeps compositing it once
 *    that (short) overlay stream reaches EOF. Combined with a `gte` enable
 *    expression this produces a real, confirmed bug: the graphic ghost-
 *    freezes on screen for the remainder of the video after every beat.
 *    `pass` makes the filter fall through to the unmodified base video once
 *    the overlay ends, which is what "between" already implies.
 */
export function buildOverlayCompositeArgs({ baseFile, overlayFile, startSec, endSec, outFile }) {
  return [
    '-y',
    '-i', baseFile,
    '-itsoffset', String(startSec),
    '-i', overlayFile,
    '-filter_complex',
    `[0:v][1:v]overlay=enable='between(t,${startSec},${endSec})':eof_action=pass:shortest=0[v]`,
    '-map', '[v]',
    '-map', '0:a?',
    '-c:a', 'copy',
    outFile,
  ];
}

/** Builds the argv for cropping/scaling/padding a source to a target aspect ratio + resolution. */
export function buildReframeArgs({ inFile, width, height, outFile }) {
  return [
    '-y',
    '-i', inFile,
    '-vf',
    `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}`,
    '-c:a', 'copy',
    outFile,
  ];
}

/** Builds the argv for splicing a b-roll clip into the base at [start,end), replacing that span. */
export function buildBrollSpliceArgs({ baseFile, brollFile, start, end, outFile }) {
  return [
    '-y',
    '-i', baseFile,
    '-i', brollFile,
    '-filter_complex',
    `[0:v]trim=0:${start},setpts=PTS-STARTPTS[pre];` +
      `[1:v]trim=0:${end - start},setpts=PTS-STARTPTS[broll];` +
      `[0:v]trim=${end},setpts=PTS-STARTPTS[post];` +
      `[pre][broll][post]concat=n=3:v=1:a=0[v]`,
    '-map', '[v]',
    '-map', '0:a',
    outFile,
  ];
}
