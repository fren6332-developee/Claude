---
name: to-premiere
description: Off-ramp from step 2 (rough-cut). Exports the rough cut to Premiere Pro instead of continuing through the automated pipeline. Use only when a job needs to finish by hand.
---

# To Premiere (off-ramp)

Dashed/alternate path off step 2. This is not part of the default straight-through
pipeline — only use it when the user explicitly wants to finish a job by hand in
Premiere Pro rather than continuing through `graphics-plan` / `embedded-captions` /
`background-music`.

## Prerequisites

- `rough-cut` has completed: `projects/<job>/rough-cut/rough-cut.mp4`, `cuts.json`,
  and `script.md` all exist.

## What to do

1. Export an edit-decision list Premiere can import: an XML (FCPXML) or AAF
   reflecting the cuts already made in the rough cut, referencing the **original raw
   media** in `raw/` (not the rendered rough-cut file) so the editor keeps full
   resolution and handles to trim further.
2. Stage everything the human editor needs in `projects/<job>/to-premiere/`:
   - the XML/AAF
   - `script.md` (copied from rough-cut, for reference)
   - a short `README.md` noting the format variant and any locked presets
     (`presets/*.json`) the editor should match by hand if they want visual
     consistency with the automated pipeline's output.
3. Update `job.json.status` to `"handed-off-to-premiere"` and record the handoff
   timestamp. This job now exits the automated pipeline — `finalize`/`prune` won't
   apply to it unless the resulting export is manually dropped into
   `outputs/<job>.final.mp4` later.

## Next step

None automated. The human editor finishes the job in Premiere; if they want it
folded back into `outputs/`, place the exported file at
`outputs/<job>.final.mp4` directly.
