# Ketosis explainer — AI video

A 56-second animated explainer on ketosis: why it's physiologically achievable,
how it connects to weight loss, insulin and adipose tissue, and how
exercise-derived lactate raises BDNF in the brain.

**Deliverable:** `renders/video.mp4` — 1920×1080, h264 + AAC, 22.1 MB.
The committed render is the 58.9s Kokoro cut; the retimed 55.9s Sterling cut is
pending the two outstanding narration lines.

## What it covers

Carbohydrate intake down → liver glycogen falls → insulin falls → adipose tissue
releases stored fatty acids → the liver converts them to ketone bodies → ketones
fuel brain and muscle. Then a second track: working muscle produces lactate,
which crosses into the brain and raises BDNF.

The lactate→BDNF beat is grounded in El Hayek et al. (2019), *Journal of
Neuroscience* — lactate-induced hippocampal BDNF via SIRT1 / PGC-1α / FNDC5
([DOI](https://doi.org/10.1523/JNEUROSCI.1661-18.2019)). The citation is shown
on screen in that frame.

Written at roughly an 8th-grade reading level, with a comedic delivery.

## Build

Frames are generated as standalone HyperFrames HTML compositions:

```bash
node build-frames.mjs                       # writes compositions/frames/*.html
npx hyperframes check                       # lint + layout + contrast gates
npx hyperframes render --quality high --output renders/video.mp4
```

`build-frames.mjs` is the single source of truth for the artwork — every visual
is authored as vector SVG/CSS (cosmic backdrops, the presenter character,
glossy organs, body-type figures) and animated on a paused GSAP timeline.

## Assets

- `assets/voice/` — narration, 10 lines. Regenerate from `SCRIPT.md`.
- `assets/voice-sterling/` — Higgsfield `seed_audio` takes in the **Sterling**
  preset voice (`speech_rate: 40`), staged to replace `assets/voice/`. 8 of 10
  lines are present; lines 01 and 04 are still outstanding. The frame timings in
  `STORYBOARD.md` are already synced to the full Sterling set, so the swap is a
  straight copy once those two land — do not render a mix of the two voices.
- `assets/fonts/` — Zen Maru Gothic + Klee One (SIL Open Font License).
- `assets/js/gsap.min.js` — vendored locally; the render environment has no CDN
  access.

## Notes

- Timings in `STORYBOARD.md` are synced to real TTS durations; changing the
  script means re-running the audio step and re-syncing.
- Captions are off: the local TTS engine returned no word-level timings, so the
  karaoke track was skipped. On-screen typography carries the key terms instead.
- The art style went through several passes (flat icon → painted storybook →
  anatomical plates → vivid anime). The current build is the anime pass.
