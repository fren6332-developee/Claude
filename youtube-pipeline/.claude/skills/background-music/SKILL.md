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
   whenever the voice track is active, so it never competes with speech.
   `sidechaincompress`'s first input is the one that gets ducked, its second is the
   key it ducks *against* — the music must be first, the dialogue second, or you'll
   duck the wrong track (confirmed by actually running it: the swapped version
   compresses speech under the music, silently, no error):
   ```
   ffmpeg -i composite.mp4 -i music/track.wav -filter_complex \
     "[1:a][0:a]sidechaincompress=threshold=0.05:ratio=8[ducked_music]; \
      [0:a][ducked_music]amix=inputs=2:duration=first,loudnorm=I=-16:TP=-1.5:LRA=11[aout]" \
     -map 0:v -map "[aout]" -c:v copy -c:a aac out.mp4
   ```
   `[0:a]` (dialogue) is referenced twice here — as the base of the mix and as the
   sidechain key — and that's fine without `asplit`; a raw input stream can feed
   multiple filters directly. `asplit` is only for reusing a *filter's output*, and
   an unused `asplit` output is a hard ffmpeg error (`unconnected output`), not a
   silent no-op. Adjust `threshold`/`ratio` to taste per job, don't hardcode
   blindly — this pairing is just a tested starting point.
3. `amix` halves each input's volume by default (`normalize=1`); the trailing
   `loudnorm` in the command above re-normalizes the mix to the same target used in
   `rough-cut`, so adding music doesn't change the finished piece's perceived
   volume — don't drop that stage.
4. Update `composite.mp4` with the mixed audio (`out.mp4` above, then replace).
5. Update `job.json.status` to `"music"`.

## Next step

Hand off to `finalize` (step 7), and `thumbnail-generator` first/alongside it if the
format's thumbnail rule is `always` (see `formats/<format>.json`).
