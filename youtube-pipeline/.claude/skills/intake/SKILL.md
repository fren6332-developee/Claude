---
name: intake
description: Step 1 of the YouTube pipeline. Copies a raw clip into projects/<job>/raw/ and creates the job manifest. Use whenever the user wants to start a new video job from a raw clip.
---

# Intake

Step 1 of 7. Same for every format.

## When to use

The user hands you a raw clip (a file path, or a folder of raw footage) and wants to
start a new job. This is always the first skill invoked for a job.

## What to do

1. Pick a job slug: `YYYY-MM-DD-short-description`, kebab-case, no spaces. Confirm it
   with the user if the source material doesn't make an obvious name evident.
2. Determine the format variant up front — ask the user if it isn't already clear:
   - `short-explainer`
   - `short-tiktok-raw`
   - `long-form-youtube`
   See `../../formats/<format>.json` at the pipeline root for what each implies.
3. Create the project skeleton:
   ```
   projects/<job>/
     raw/
     rough-cut/
     graphics/
     captions/
     music/
   ```
4. Copy the raw source file(s) into `projects/<job>/raw/` verbatim. Never modify
   files in `raw/` after intake — every later step treats it as read-only source of
   truth.
5. Write `projects/<job>/job.json`:
   ```json
   {
     "job": "<job>",
     "format": "<format>",
     "status": "intake",
     "source": "<original path the clip came from>",
     "created_at": "<ISO 8601 UTC timestamp>"
   }
   ```

## Next step

Hand off to `rough-cut` (step 2).
