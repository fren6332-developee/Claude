# HyperFrames toolkit

An HTML-based video engine: it renders graphics/caption "scenes" as HTML+CSS,
drives them frame-by-frame through headless Chromium (Playwright) to a
transparent PNG sequence, then composites that sequence onto the base
footage with ffmpeg. It handles `reframe`, `graphics`, `b-roll`, `motion`,
and `captions` for the pipeline in `youtube-pipeline/`.

This is first-party source, built in this repo (`src/`, `bin/`) — not a
drop-in from an external project. It's still called "vendored" and gated
behind `skills-lock.json` because the *policy* is the same either way:
skills must never hand-edit `src/`/`bin/`/`templates/` as a side effect of
rendering one job. Engine changes are deliberate, version-bumped, and
recorded in `skills-lock.json`.

## Install

```
cd engine/hyperframes
npm install
npm test
```

Requires Node >= 18 and `ffmpeg` on PATH for actually rendering a job (not
bundled — see `src/ffmpeg.js`; missing ffmpeg fails with a clear error,
not a crash). `npm install` also pulls down Playwright's matching Chromium
build for HTML frame rendering, unless one is already cached at
`PLAYWRIGHT_BROWSERS_PATH`.

`playwright` is pinned to an **exact** version in `package.json` (not a
range) on purpose: Playwright ties each release to a specific bundled
Chromium revision, so a semver-compatible `npm install` picking up a newer
patch can silently expect a browser build that isn't the one you have
cached — that's a real class of "worked yesterday, breaks today" bug, not
just a sandbox quirk. Bump it deliberately, not implicitly.

If your environment has Chromium pre-installed at a nonstandard path (some
CI images, this repo's own dev sandbox) and you'd rather point at that than
let Playwright manage its own copy, override it:

```
export HYPERFRAMES_CHROMIUM_PATH=/path/to/chromium
```

## CLI

```
node bin/hyperframes.js reframe   --in <file> --width <n> --height <n> --out <file>
node bin/hyperframes.js graphics  --plan <graphics-plan.json> --preset <preset.json> \
                                   --base <video> --out-dir <scratch-dir> --out <file> [--fps 30]
node bin/hyperframes.js captions  --transcript <words.json> --corrections <caption-corrections.json> \
                                   --preset <preset.json> --base <video> --out-dir <scratch-dir> --out <file> [--fps 30]
node bin/hyperframes.js broll     --plan <broll-plan.json> --base <video> --out <file>
```

Add `--dry-run` to any command to build (and print) the ffmpeg command plan
without shelling out to ffmpeg — useful in environments without ffmpeg
installed. `graphics` and `captions` still render real frames through
Chromium in dry-run mode; only the final ffmpeg encode/composite is skipped.

The `graphics-plan` and `embedded-captions` skills in
`youtube-pipeline/.claude/skills/` call this CLI — they should never
import from `src/` directly or reimplement rendering logic themselves.

## Architecture

```
src/
  render-html.js   # core primitive: HTML scene -> PNG frame sequence (Playwright)
  ffmpeg.js         # ffmpeg argv builders (pure functions) + a thin spawn wrapper
  graphics.js        # graphics-plan.json + preset -> rendered beats -> composited video
  captions.js          # word transcript + corrections + preset -> cued captions -> composited video
  reframe.js            # crop/scale/pad to a format's target aspect ratio
  broll.js               # mechanically splices a b-roll plan's clips into the base
  templates/
    signature-card.html   # short-explainer: top-half cards (signature-style)
    hook-card.html          # short-tiktok-raw: hook card -> cut to raw (tiktok-raw-style)
    liquid-glass.html         # long-form-youtube: glass + zoom (liquid-glass-style)
    captions.html               # both caption presets; position comes from preset.engine
bin/
  hyperframes.js   # CLI entry point
test/
  *.test.js        # node --test; includes real Chromium-rendered assertions,
                     # not just mocks -- run with `npm test`
```

Each locked preset in `presets/*.json` carries an `engine` block
(`graphics_template`, `captions_template`, `captions_position`, motion
params like `zoom_pct`) that tells this engine which template and
parameters to use — that's the seam between "what a preset says" and "what
HyperFrames renders." Add a new format variant by adding a template here
and an `engine` block to its preset, not by branching on format names
inside `graphics.js`/`captions.js`.

## Update policy

**Never hand-edit `src/`, `bin/`, or `templates/` as part of rendering a
job.** To change the engine:

1. Make the change as a deliberate commit (not folded into a job's render).
2. Bump `version` in both `package.json` and `skills-lock.json`.
3. Run `npm test`, and spot-check one job per format variant still renders
   correctly.
