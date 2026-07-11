# YouTube editing pipeline

A raw-to-shipped video pipeline, driven through Claude Code Skills. See
[`CLAUDE.md`](CLAUDE.md) for the full pipeline reference (steps, directory
conventions, format variants, presets). This README is the quick-start.

## Quick start

```
Claude, take raw/interview-042.mov and run it through the pipeline as a
short-explainer.
```

Claude will work through the skills in `.claude/skills/` in order:

```
intake → rough-cut → [to-premiere, off-ramp] → graphics-plan → second-pass (manual)
       → embedded-captions → background-music (optional) → finalize → prune
```

Steps 3 (`graphics-plan`) and 5 (`embedded-captions`) branch on the job's format —
`short-explainer`, `short-tiktok-raw`, or `long-form-youtube` — everything else is
identical across formats. Step 4 (`second-pass`) is a human review gate: Claude
prepares the review packet and applies incremental fixes, but won't move a job past
it without an actual sign-off.

## What's real vs. what needs to be plugged in

This scaffolding is complete and functional, including the render engine:
- Directory conventions, job manifests, format configs (`formats/*.json`)
- `scripts/finalize.sh` and `scripts/prune.sh` (real bash, exercised against
  `projects/<job>/`)
- All 10 skills, with concrete step-by-step instructions and ffmpeg/WhisperX
  command shapes
- **HyperFrames** (`engine/hyperframes/`) — a real, working HTML video engine used by
  `graphics-plan` and `embedded-captions`. It renders scenes through headless Chromium
  (Playwright) and composites them with ffmpeg. `npm install && npm test` inside that
  directory sets it up and exercises it end-to-end, including real Chromium-rendered
  frame checks. See [`engine/hyperframes/README.md`](engine/hyperframes/README.md).

One piece is an external dependency this repo intentionally does not fabricate:
- **WhisperX** — must be installed (`pip install whisperx`) for `rough-cut`'s
  transcription/alignment to run.

`ffmpeg` also needs to be on PATH wherever a job is actually rendered (not bundled by
either the pipeline scripts or HyperFrames).

## Layout

```
CLAUDE.md                 # full pipeline reference
.claude/skills/            # one skill per pipeline step
scripts/                   # finalize.sh, prune.sh
engine/hyperframes/        # the HTML video engine (Node/Playwright/ffmpeg), + skills-lock.json
presets/                   # locked style presets (signature, captions, tiktok-raw,
                            # liquid-glass, caption-corrections) -- each carries an
                            # `engine` block binding it to a HyperFrames template
formats/                   # short-explainer.json, short-tiktok-raw.json,
                            # long-form-youtube.json
projects/<job>/             # working directory per job (gitignored contents aside
                            # from .gitkeep — jobs are local working state)
outputs/                    # <job>.final.mp4 lands here — the ship-ready file
```
