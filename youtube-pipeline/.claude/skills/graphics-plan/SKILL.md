---
name: graphics-plan
description: Step 3 of the YouTube pipeline (format-specific). Plans graphic beats from the rough-cut script, then builds the graphics via the HyperFrames engine, styled per the job's format variant.
---

# Graphics plan

Step 3 of 7. **Format-specific** — read `projects/<job>/job.json` for the format,
then `formats/<format>.json` (both at the pipeline root) for what that format wants.

## Prerequisites

- `rough-cut` has completed: `rough-cut/script.md` and `rough-cut/rough-cut.mp4`
  exist.
- HyperFrames set up: `cd engine/hyperframes && npm install` (one-time). Requires
  `ffmpeg` on PATH for the actual render/composite step — the plan (beats, copy)
  can still be produced without it, but rendering will fail with a clear error if
  it's missing.

## What to do

### 1. Plan the beats

Read `rough-cut/script.md`. Identify graphic beats — points where a visual should
appear (a claim worth putting on screen, a list, a stat, a transition). For each
beat, write an entry to `graphics/graphics-plan.json`:

```json
{ "start": 12.4, "end": 15.0, "copy": "MTHFR affects folate metabolism", "type": "..." }
```

`type` and overall treatment depend on format:

| Format | Graphics style | Preset to use |
|---|---|---|
| `short-explainer` | top-half cards | `presets/signature-style.json` |
| `short-tiktok-raw` | hook card, then cut to raw (no further cards) | `presets/tiktok-raw-style.json` |
| `long-form-youtube` | glass + zoom | `presets/liquid-glass-style.json` |

For `short-tiktok-raw`, only plan **one** beat: the hook card at the top (per
`tiktok-raw-style.json`'s `hook_card.duration_sec`). Everything after that is raw
footage, untouched.

### 2. Build the graphics

Invoke the HyperFrames CLI with `graphics-plan.json` and the matching locked preset:

```
node engine/hyperframes/bin/hyperframes.js graphics \
  --plan projects/<job>/graphics/graphics-plan.json \
  --preset presets/<preset-for-format>.json \
  --base projects/<job>/rough-cut/rough-cut.mp4 \
  --out-dir projects/<job>/graphics/render \
  --out projects/<job>/composite.mp4 \
  --width <format.resolution.width> --height <format.resolution.height>
```

`--width`/`--height` are the job's target resolution from `formats/<format>.json`
(e.g. 1080x1920 for `short-explainer`, 1920x1080 for `long-form-youtube`) — the whole
render happens at one resolution, there's no per-beat default, and the CLI will
refuse to run without them rather than silently guessing.

Never hand-write competing graphics-rendering logic here, and never hand-edit files
under `engine/hyperframes/src/`, `bin/`, or `templates/` — if the render looks wrong,
fix the plan or preset inputs, not the engine. If you do need to change the engine
itself (a new template, a new motion parameter), that's a deliberate change following
the update policy in `engine/hyperframes/README.md`, not something to do inline while
rendering a job.

`projects/<job>/composite.mp4` (rough-cut + graphics composited together) is now the
project's working master; later steps (captions, music) keep updating this same file.

3. Update `job.json.status` to `"graphics"`.

## Next step

Hand off to `second-pass` (step 4) for human review.
