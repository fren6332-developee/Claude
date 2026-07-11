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
  on-beat sync.

## What to do

1. Take the word-level transcript from `rough-cut/` and `rough-cut/script.md`.
2. Apply `presets/caption-corrections.json`: run every corrections entry over the
   transcript text before rendering (brand names, spelling, technical terms — these
   are upstream fixes, not job-specific, so don't skip them).
3. Style per format (see table in `CLAUDE.md`):
   - `short-explainer`: centered, **locked position** — don't move it per-job.
   - `short-tiktok-raw`: low, under face — this one does track the subject, not a
     fixed position.
4. Burn in **on-beat**: sync caption word/phrase reveals to audio emphasis, not just
   flat word-by-word timing — use the preset's `burn_in: "on-beat"` behavior via the
   HyperFrames captions module (see `engine/hyperframes/README.md`).
5. Output to `projects/<job>/captions/`, and update `composite.mp4` with captions
   burned in.
6. Update `job.json.status` to `"captions"`.

## Next step

Hand off to `background-music` (step 6, optional) or straight to `finalize`
(step 7) if no music is needed.
