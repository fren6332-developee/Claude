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
- HyperFrames vendored under `engine/hyperframes/vendor/` (check
  `engine/hyperframes/skills-lock.json` — if `"vendored": false`, you can still do
  the planning half of this skill, but rendering is blocked; tell the user).

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

Invoke the vendored HyperFrames engine (see `engine/hyperframes/README.md` for its
entry point) with `graphics-plan.json` and the matching locked preset. Never
hand-write competing graphics-rendering logic here, and never hand-edit files under
`engine/hyperframes/vendor/` — if the render looks wrong, fix the plan or preset
inputs, not the engine.

Output rendered graphic assets/composite to `projects/<job>/graphics/`, and produce
an updated `composite.mp4` (rough-cut + graphics composited together) at the project
root.

3. Update `job.json.status` to `"graphics"`.

## Next step

Hand off to `second-pass` (step 4) for human review.
