---
name: background-music
description: Step 6 of the YouTube pipeline (optional). Adds sidechain-ducked background music under the mix and re-normalizes loudness. Skip if the job doesn't call for music.
---

# Background music

Step 6 of 7. **Optional** — only run this when the user asks for music on a job, or
the job brief calls for it. Most jobs can skip straight from `embedded-captions` (or
`second-pass`, for long-form) to `finalize`.

## Prerequisites

- `second-pass` review approved, and `embedded-captions` complete if the format uses
  it.
- A music track/stem to use — ask the user for one (path, library reference, or mood
  description to pick from an existing library) if not already specified.

## What to do

1. Place the chosen track in `projects/<job>/music/`.
2. Sidechain duck the music under dialogue: reduce music level automatically
   whenever the voice track is active, so it never competes with speech. A
   reasonable ffmpeg approach:
   `ffmpeg -i composite.mp4 -i music/track.wav -filter_complex
   "[1:a]asplit=2[sc][mix];[0:a][sc]sidechaincompress=threshold=0.05:ratio=8[ducked];
   [0:a][ducked]amix=inputs=2" ...`
   — adjust threshold/ratio to taste per job, don't hardcode one value blindly.
3. Re-normalize the full mix to the same loudness target used in `rough-cut`
   (`loudnorm=I=-16:TP=-1.5:LRA=11`) so adding music doesn't change the perceived
   volume of the finished piece.
4. Update `composite.mp4` with the mixed audio.
5. Update `job.json.status` to `"music"`.

## Next step

Hand off to `finalize` (step 7), and `thumbnail-generator` first/alongside it if the
format's thumbnail rule is `always` (see `formats/<format>.json`).
