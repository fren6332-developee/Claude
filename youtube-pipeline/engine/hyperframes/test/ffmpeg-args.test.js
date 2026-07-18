import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFrameSequenceToOverlayArgs,
  buildOverlayCompositeArgs,
  buildReframeArgs,
  buildBrollSpliceArgs,
} from '../src/ffmpeg.js';

test('buildFrameSequenceToOverlayArgs encodes an RGBA PNG sequence at the given fps', () => {
  const args = buildFrameSequenceToOverlayArgs({
    framesGlob: '/tmp/beat-000/frame-%06d.png',
    fps: 30,
    outFile: '/tmp/beat-000-overlay.mov',
  });
  assert.deepEqual(args, [
    '-y',
    '-framerate', '30',
    '-i', '/tmp/beat-000/frame-%06d.png',
    '-c:v', 'png',
    '-pix_fmt', 'rgba',
    '/tmp/beat-000-overlay.mov',
  ]);
});

test('buildOverlayCompositeArgs offsets the overlay by startSec and preserves base audio', () => {
  const args = buildOverlayCompositeArgs({
    baseFile: 'base.mp4',
    overlayFile: 'overlay.mov',
    startSec: 12.5,
    endSec: 14.0,
    outFile: 'out.mp4',
  });
  assert.equal(args[2], 'base.mp4');
  assert.equal(args[4], '12.5');
  assert.equal(args[6], 'overlay.mov');
  assert.ok(args.includes('0:a?'), 'maps base audio through unchanged');
});

test('buildOverlayCompositeArgs turns the overlay back off at endSec and does not freeze its last frame', () => {
  // Regression test: an earlier version used enable='gte(t,start)' with no
  // upper bound, and ffmpeg's overlay filter defaults to eof_action=repeat --
  // together those freeze the overlay's last frame on screen for the rest of
  // the video once its (short) frame sequence runs out. Confirmed visually
  // against a real render before this fix (the graphic ghosted well past its
  // beat's end). Both `between(...)` and `eof_action=pass` are required.
  const args = buildOverlayCompositeArgs({
    baseFile: 'base.mp4',
    overlayFile: 'overlay.mov',
    startSec: 12.5,
    endSec: 14.0,
    outFile: 'out.mp4',
  });
  const filter = args[args.indexOf('-filter_complex') + 1];
  assert.match(filter, /between\(t,12\.5,14\)/);
  assert.doesNotMatch(filter, /gte\(/);
  assert.match(filter, /eof_action=pass/);
});

test('buildReframeArgs crops to the target resolution after upscaling to cover it', () => {
  const args = buildReframeArgs({ inFile: 'raw.mp4', width: 1080, height: 1920, outFile: 'reframed.mp4' });
  const vf = args[args.indexOf('-vf') + 1];
  assert.match(vf, /scale=1080:1920:force_original_aspect_ratio=increase/);
  assert.match(vf, /crop=1080:1920/);
});

test('buildBrollSpliceArgs concatenates pre/broll/post segments around [start,end)', () => {
  const args = buildBrollSpliceArgs({ baseFile: 'base.mp4', brollFile: 'broll.mp4', start: 10, end: 14, outFile: 'out.mp4' });
  const filter = args[args.indexOf('-filter_complex') + 1];
  assert.match(filter, /trim=0:10/);
  assert.match(filter, /trim=0:4/); // end - start
  assert.match(filter, /trim=14/);
  assert.match(filter, /concat=n=3:v=1:a=0/);
});
