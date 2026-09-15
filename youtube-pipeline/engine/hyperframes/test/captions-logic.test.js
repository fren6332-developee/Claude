import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyCorrections, groupIntoCues } from '../src/captions.js';

test('applyCorrections replaces whole words case-insensitively', () => {
  const words = [
    { text: 'the', start: 0, end: 0.2 },
    { text: 'mthfr', start: 0.2, end: 0.6 },
    { text: 'gene', start: 0.6, end: 0.9 },
  ];
  const out = applyCorrections(words, { mthfr: 'MTHFR' });
  assert.deepEqual(out.map((w) => w.text), ['the', 'MTHFR', 'gene']);
});

test('applyCorrections does not touch partial matches', () => {
  const words = [{ text: 'dnaish', start: 0, end: 0.3 }];
  const out = applyCorrections(words, { dna: 'DNA' });
  assert.equal(out[0].text, 'dnaish');
});

test('groupIntoCues breaks on a silence gap', () => {
  const words = [
    { text: 'hello', start: 0, end: 0.4 },
    { text: 'world', start: 0.4, end: 0.8 },
    // 1s gap here, over the default 0.6s maxGapSec
    { text: 'next', start: 1.8, end: 2.1 },
  ];
  const cues = groupIntoCues(words);
  assert.equal(cues.length, 2);
  assert.deepEqual(cues[0].words.map((w) => w.text), ['hello', 'world']);
  assert.deepEqual(cues[1].words.map((w) => w.text), ['next']);
});

test('groupIntoCues breaks once maxWords is reached', () => {
  const words = Array.from({ length: 10 }, (_, i) => ({ text: `w${i}`, start: i * 0.2, end: i * 0.2 + 0.15 }));
  const cues = groupIntoCues(words, { maxWords: 4, maxCueDurationSec: 999, maxGapSec: 999 });
  assert.equal(cues.length, 3); // 4, 4, 2
  assert.equal(cues[0].words.length, 4);
  assert.equal(cues[2].words.length, 2);
});

test('groupIntoCues cue start/end span its words', () => {
  const words = [
    { text: 'a', start: 1.0, end: 1.2 },
    { text: 'b', start: 1.2, end: 1.6 },
  ];
  const cues = groupIntoCues(words);
  assert.equal(cues[0].start, 1.0);
  assert.equal(cues[0].end, 1.6);
});
