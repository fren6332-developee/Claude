---
name: rough-cut
description: Step 2 of the YouTube pipeline. Runs WhisperX to transcribe/align the raw clip, cuts filler and dead air, polishes audio, and produces the working script. Use after intake, before graphics-plan.
---

# Rough cut

Step 2 of 7. Same for every format. Produces the script that steps 3 and 5 both
consume.

## Prerequisites

- `projects/<job>/raw/` populated by `intake`.
- `whisperx` installed and on PATH (or reachable via `python -m whisperx`). If it
  isn't available, tell the user rather than approximating a transcript by hand.
- `ffmpeg` on PATH for audio extraction/rendering.

## What to do

1. Extract audio from the raw clip if needed:
   `ffmpeg -i raw/<source> -vn -acodec pcm_s16le -ar 16000 -ac 1 rough-cut/audio-src.wav`
2. Run WhisperX for word-level timestamps and speaker alignment:
   `whisperx rough-cut/audio-src.wav --output_dir rough-cut/ --output_format json`
3. From the word-level transcript, build a cut list at `rough-cut/cuts.json`:
   - Mark filler words (`um`, `uh`, false starts, stammered repeats) for removal.
   - Mark silences/dead air beyond ~0.6s for trimming (leave natural breath room).
   - Each cut entry: `{ "start": <sec>, "end": <sec>, "reason": "filler"|"silence" }`.
4. Render the rough cut by cutting the marked segments out and concatenating the
   remainder (ffmpeg `select`/`concat`, or an edit-decision-list workflow — whichever
   is more reliable for the source format). Output: `rough-cut/rough-cut.mp4`.
5. Reframe to the job's target aspect ratio/resolution (read `job.json.format`, then
   `formats/<format>.json` for `aspect_ratio`/`resolution`) — raw footage is commonly
   16:9 camera source, but `short-explainer`/`short-tiktok-raw` need 9:16:
   ```
   node engine/hyperframes/bin/hyperframes.js reframe \
     --in projects/<job>/rough-cut/rough-cut.mp4 \
     --width <target-width> --height <target-height> \
     --out projects/<job>/rough-cut/rough-cut.mp4
   ```
   Use a temp output path and replace the original rather than reading and writing
   the same file in one ffmpeg invocation. Skip this step only if the raw footage
   was already shot at the target aspect ratio — check, don't assume.
6. Polish audio on the render: loudness-normalize to a broadcast target
   (`ffmpeg -af loudnorm=I=-16:TP=-1.5:LRA=11`), output `rough-cut/audio.wav`.
7. Write `rough-cut/script.md`: the transcript **as it now reads after cuts** —
   this is "the script." It's the input graphics-plan and embedded-captions both
   read from, so keep it in sync with the actual cut timing (timestamps per line).
8. Write `rough-cut/words.json`: the word-level transcript **remapped onto the
   rough-cut's timeline**, not WhisperX's original raw-clip timeline. For each word
   that survived (wasn't inside a removed cut span), subtract the total duration of
   every earlier cut from its `start`/`end`. `embedded-captions` (step 5) burns
   captions in against `composite.mp4`, which descends from this rough cut, not the
   raw clip — timestamps that don't account for the cuts will drift out of sync with
   the speaker.
9. Update `job.json.status` to `"rough-cut"`.

Reframing before the audio pass (rather than after) means loudnorm's analysis runs
once on the final-geometry render, not twice.

## Off-ramp

If the user wants to finish this job by hand in Premiere Pro instead of continuing
through the automated pipeline, stop here and invoke `to-premiere` instead of
`graphics-plan`. This is a dashed/alternate path — most jobs continue straight on.

## Next step

Hand off to `graphics-plan` (step 3), or `to-premiere` if taking the off-ramp.
