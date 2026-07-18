---
name: prune
description: Cleans up a shipped job's intermediate render artifacts (rough-cut renders, graphics, captions, music stems, composite), keeping only raw/ and job.json. Only use after finalize has shipped outputs/<job>.final.mp4.
---

# Prune

Not a numbered pipeline step — cleanup after step 7 ships. Reclaims disk space from
render intermediates that are all reproducible from `raw/` plus the plan files
(`graphics-plan.json`, `cuts.json`, presets).

## Prerequisites

- `outputs/<job>.final.mp4` already exists (i.e. `finalize` has run). The script
  refuses to run otherwise — don't work around that check.

## What to do

1. Confirm with the user before pruning — this deletes `rough-cut/`, `graphics/`,
   `captions/`, `music/`, and `composite.mp4` from the project. It is destructive
   and not meant to be silently automatic after `finalize`.
2. Run from the pipeline root:
   ```
   scripts/prune.sh <job>
   ```
3. What survives: `projects/<job>/raw/` (source footage) and `projects/<job>/job.json`
   (manifest/history) — everything else is deleted.

## When not to use

If the user might want to re-run `second-pass` with different notes, or re-render
graphics/captions/music without re-doing the rough cut, don't prune yet — pruning
means the next change to this job starts over from `raw/`.
