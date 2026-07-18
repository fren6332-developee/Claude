---
name: finalize
description: Step 7 of the YouTube pipeline. Runs finalize.sh to promote the job's composite render to outputs/<job>.final.mp4 -- the ship-ready deliverable. This is the finish line.
---

# Finalize

Step 7 of 7. Same for every format. This is the finish line — after this, the job is
shippable.

## Prerequisites

- `second-pass` review approved.
- `embedded-captions` done if the format uses it; `background-music` done if the job
  wanted it.
- For `long-form-youtube`: `thumbnail.png` exists (see `thumbnail-generator`) —
  treat its absence as a blocker, not optional polish.
- `projects/<job>/composite.mp4` is the final assembled render.

## What to do

1. Run the script from the pipeline root:
   ```
   scripts/finalize.sh <job>
   ```
   This copies/repackages `projects/<job>/composite.mp4` to
   `outputs/<job>.final.mp4` (fast-start MP4, ready to upload) and marks
   `job.json.status = "shipped"`.
2. Confirm the output file exists and report its path back to the user — this is
   the deliverable, don't just say "done."
3. If the format requires a thumbnail, mention `projects/<job>/thumbnail.png`
   alongside the final video when reporting completion, since it ships separately
   (uploaded as the video's thumbnail, not muxed into the file).

## Next step

Optionally hand off to `prune` to clean up the project's intermediate artifacts now
that the job has shipped. Don't prune automatically — ask first, since it's a
destructive cleanup of everything except `raw/` and `job.json`.
