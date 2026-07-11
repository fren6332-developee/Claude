# YouTube editing pipeline

This directory is a self-contained production pipeline for turning a raw clip into a
shipped YouTube video (short-explainer, short-tiktok/raw, or long-form). It is the
same 7 steps for every job, raw to done. Skills live in `.claude/skills/` and are
scoped to this directory (invoke them as `youtube-pipeline:<skill-name>`).

## The pipeline (raw to done)

| # | Step | What happens | Skill |
|---|------|--------------|-------|
| 1 | Intake | Copy raw clip into `projects/<job>/raw/`, create the job manifest | `intake` |
| 2 | Rough cut | WhisperX cut, kill filler, polish audio, produce the working script | `rough-cut` |
| 2→ | *(off-ramp)* | Hand the rough cut to Premiere Pro instead of continuing | `to-premiere` |
| 3 | Graphics | Plan beats, then build graphics via HyperFrames — **format-specific** | `graphics-plan` |
| 4 | Second pass | Manual human review (Jason), incremental re-composite | `second-pass` |
| 5 | Captions | Short-form only, burn in on-beat — **format-specific** | `embedded-captions` |
| 6 | Background music | Optional, sidechain duck, re-normalize | `background-music` |
| 7 | Export | Finalize + prune, promote to `outputs/<job>.final.mp4` | `finalize`, `prune` |

Thumbnail generation isn't a numbered step — it runs alongside export, and whether it
runs at all depends on the format (see below). Its skill is `thumbnail-generator`.

Run the skills in pipeline order for a new job. Steps 1, 2, 4, 6, 7 are the same
regardless of format. Steps 3 and 5 change per format variant. Step 4 is a human
checkpoint, not something Claude does autonomously — see `second-pass/SKILL.md`.

## Directory conventions

```
youtube-pipeline/
  projects/<job>/
    job.json            # manifest: format, status, timestamps, notes
    raw/                 # step 1 — source footage, never modified after intake
    rough-cut/           # step 2 — cuts.json, script.md, polished audio
    graphics/            # step 3 — rendered HyperFrames graphics
    captions/            # step 5 — burned-in caption assets (short-form only)
    music/                # step 6 — music stems + ducking automation (optional)
    composite.mp4         # the fully-assembled render, input to finalize.sh
    thumbnail.png         # step "thumb" — only for formats where thumb = always
  outputs/
    <job>.final.mp4        # step 7 — the shipped deliverable
```

`<job>` is a short slug, e.g. `2026-07-11-mthfr-explainer`. Everything for a job lives
under `projects/<job>/` until it ships to `outputs/<job>.final.mp4`; `prune.sh` then
strips the reproducible intermediates and keeps `raw/` + `job.json` as the record.

## Format variants (only steps 3 & 5 change)

| Format | Aspect | Resolution | Graphics (step 3) | Captions (step 5) | Thumbnail |
|---|---|---|---|---|---|
| `short-explainer` | 9:16 | 1080x1920 | top-half cards | centered, locked | usually skip |
| `short-tiktok-raw` | 9:16 | 1080x1920 | hook card → raw | low, under face | skip |
| `long-form-youtube` | 16:9 | 1920x1080 | glass + zoom | none (native YT captions) | always |

Machine-readable copies of this table live in `formats/*.json`. `job.json.format` must
be one of these three values; skills read the matching file to decide behavior.

## Skills, engine & presets

**Core editing skills** (this repo, `.claude/skills/`): `intake`, `rough-cut`,
`graphics-plan`, `second-pass`, `embedded-captions`, `background-music`,
`thumbnail-generator`, `to-premiere`, `finalize`, `prune`.

**Engine — HyperFrames toolkit (vendored, external)**: an HTML-based video engine
handling reframe, graphics, b-roll, motion, and captions rendering. It is **not**
implemented in this repo — see `engine/hyperframes/README.md` for how to vendor it in.
Update only via the `engine/hyperframes/skills-lock.json` registry; never hand-edit
vendored engine files.

**Locked presets** (`presets/`, treat as read-only from skills — see file header for
the update process): `signature-style.json`, `captions-style.json`,
`tiktok-raw-style.json`, `liquid-glass-style.json`, `caption-corrections.json` (upstream
brand & spelling fixes applied during captioning).

## Legend (matches the source diagram)

- Default / this repo — implemented here.
- Changes by format — steps 3 & 5, and the thumbnail step.
- Finish line — step 7, `outputs/<job>.final.mp4` ships.
- Optional / external — background music (step 6), the Premiere off-ramp (step 2→).
