---
name: embedded-captions
description: Step 5 of the YouTube pipeline (format-specific, short-form only). Burns in on-beat captions using locked caption presets and caption-corrections.json. Skipped entirely for long-form YouTube.
---

# Embedded captions

Step 5 of 7. **Format-specific, and short-form only.**

## Does this format even use this step?

Check `job.json.format`:

- `short-explainer` → yes, use `presets/captions-style.json`.
- `short-tiktok-raw` → yes, use `presets/tiktok-raw-style.json`'s `captions` block.
- `long-form-youtube` → **skip this step entirely.** Long-form relies on native
  YouTube CC (uploaded separately as an `.srt`/`.vtt`, not burned in). If asked to run
  this skill on a long-form job, say so and skip rather than burning in captions
  that shouldn't be there.

## Prerequisites

- `second-pass` review has approved the current `composite.mp4`.
- `rough-cut/rough-cut.mp4`'s word-level timestamps (from WhisperX, step 2) for
  on-beat sync — save/keep these as `rough-cut/words.json` (`[{ text, start, end }]`)
  during the `rough-cut` skill so this step can read them directly.
- HyperFrames set up: `cd engine/hyperframes && npm install` (one-time).

## What to do

1. Take the word-level transcript at `rough-cut/words.json`.
2. Invoke the HyperFrames CLI, which applies `presets/caption-corrections.json`,
   groups words into on-beat cues, and renders + composites them per the preset's
   position rule (centered/locked for `short-explainer`, low-under-face for
   `short-tiktok-raw`):

   ```
   node engine/hyperframes/bin/hyperframes.js captions \
     --transcript projects/<job>/rough-cut/words.json \
     --corrections presets/caption-corrections.json \
     --preset presets/<captions-style-or-tiktok-raw-style>.json \
     --base projects/<job>/composite.mp4 \
     --out-dir projects/<job>/captions/render \
     --out projects/<job>/composite.mp4 \
     --width <format.resolution.width> --height <format.resolution.height>
   ```

   `--width`/`--height` come from `formats/<format>.json` — same resolution the
   `graphics-plan` step rendered at; the CLI refuses to run without them.

   Don't hand-roll correction or cue-grouping logic here — that's the engine's job;
   if a specific correction is missing, add it to `presets/caption-corrections.json`
   (a deliberate, tracked edit) rather than working around it per-job.
3. Update `job.json.status` to `"captions"`.

## Next step

Hand off to `background-music` (step 6, optional) or straight to `finalize`
(step 7) if no music is needed.
