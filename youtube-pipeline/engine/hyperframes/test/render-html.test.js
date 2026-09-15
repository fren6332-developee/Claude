// Real tests -- actually launches headless Chromium via Playwright and
// checks the rendered output, not mocks. This is the part of HyperFrames
// that most needs exercising, since it's the only module that talks to a
// browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, rm, mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { renderFrames, fillTemplate } from '../src/render-html.js';

test('renderFrames produces one PNG per frame at the requested fps/duration', async (t) => {
  const outDir = await mkdtemp(path.join(tmpdir(), 'hf-render-'));
  t.after(() => rm(outDir, { recursive: true, force: true }));

  const html = `<!doctype html><html><body style="margin:0">
    <div id="box" style="position:absolute;width:100px;height:100px;background:red"></div>
    <script>window.hfSetTime = () => {};</script>
  </body></html>`;

  const frames = await renderFrames({ html, width: 200, height: 200, durationSec: 0.2, fps: 10, outDir });

  assert.equal(frames.length, 2); // 0.2s * 10fps
  const files = await readdir(outDir);
  assert.equal(files.filter((f) => f.endsWith('.png')).length, 2);
  for (const f of frames) {
    const s = await stat(f);
    assert.ok(s.size > 0, `${f} should be a non-empty PNG`);
  }
});

test('renderFrames actually drives window.hfSetTime per frame (rendered bytes change over time)', async (t) => {
  const outDir = await mkdtemp(path.join(tmpdir(), 'hf-render-'));
  t.after(() => rm(outDir, { recursive: true, force: true }));

  // A box that only becomes visible after t >= 0.5s -- if hfSetTime weren't
  // being called with the right per-frame time, every frame's PNG bytes
  // would be identical (all-transparent).
  const html = `<!doctype html><html><body style="margin:0">
    <div id="box" style="position:absolute;width:100px;height:100px;background:red;opacity:0"></div>
    <script>
      window.hfSetTime = function (t) {
        document.getElementById('box').style.opacity = t >= 0.5 ? '1' : '0';
      };
    </script>
  </body></html>`;

  const frames = await renderFrames({ html, width: 200, height: 200, durationSec: 1.0, fps: 4, outDir });
  assert.equal(frames.length, 4); // t = 0, 0.25, 0.5, 0.75

  const [beforeBuf, midHiddenBuf, atVisibleBuf] = await Promise.all([
    readFile(frames[0]), // t = 0, hidden
    readFile(frames[1]), // t = 0.25, still hidden
    readFile(frames[2]), // t = 0.5, visible
  ]);

  assert.deepEqual(beforeBuf, midHiddenBuf, 'two hidden frames should render identically');
  assert.notDeepEqual(beforeBuf, atVisibleBuf, 'the frame where the box becomes visible must differ from a hidden frame');
});

test('fillTemplate injects JSON data into a {{DATA}} placeholder', () => {
  const template = '<script id="hf-data" type="application/json">{{DATA}}</script>';
  const out = fillTemplate(template, { DATA: { copy: 'hello "world"' } });
  const embedded = out.match(/>(.*)<\/script>/)[1];
  assert.equal(JSON.parse(embedded).copy, 'hello "world"');
});
