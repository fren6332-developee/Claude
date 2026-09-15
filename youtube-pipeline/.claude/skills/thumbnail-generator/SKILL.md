---
name: thumbnail-generator
description: Generates the video thumbnail. Not a numbered pipeline step — runs around export, and whether it runs at all depends on the job's format (always for long-form, usually skipped for short-form).
---

# Thumbnail generator

Runs around export time (alongside/just before `finalize`), not as one of the 7
numbered steps. Whether it runs at all is format-dependent — check
`formats/<format>.json`'s `thumbnail` field:

| Format | Thumbnail |
|---|---|
| `short-explainer` | usually skip — only generate if the user asks |
| `short-tiktok-raw` | skip — don't generate one |
| `long-form-youtube` | always — required before shipping |

## What to do (when it applies)

1. Pick a candidate frame from `composite.mp4` (a strong, legible expression/moment),
   or compose a custom graphic if the job wants text/branding on the thumbnail rather
   than a frame grab.
2. Render at the platform's expected thumbnail resolution (1280x720 for YouTube,
   regardless of the video's own aspect ratio).
3. Apply `presets/signature-style.json` typography/color if adding text overlay, so
   it's visually consistent with the in-video graphics.
4. Save to `projects/<job>/thumbnail.png`.

## Next step

`finalize` (step 7) — for `long-form-youtube` jobs, treat a missing thumbnail as a
blocker and generate one before finalizing, not after.
