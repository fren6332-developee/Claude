---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Ketosis is a real, physiologically achievable state where your body burns fat for fuel instead of sugar — and it even fuels your brain."
destination: general
aspect: 1920x1080
language: en
length: 60s
angle: concept
---

## Intent

Explain, for a general audience, how ketosis actually works in the body: why
it's physiologically possible (not a fad), how it connects to weight loss,
how it lowers insulin, how it releases stored fat from adipose tissue, how
the liver turns fat into ketones, and how exercise-driven lactate boosts
BDNF in the brain. Written at an 8th-grade reading level. Tone: funny,
comical, entertaining — a playful, energetic hype-man/coach voice cracking
jokes while still teaching the real mechanism accurately.

## Customizations

- `VO_MODE: restructure` (revised) — the science content and citation are
  locked, but the line-by-line wording is rewritten for comedy/entertainment
  per the user's later request. See the revised `SCRIPT.md` / `STORYBOARD.md`.
- Visual style (revised): the user asked for "Studio Ghibli art" — a named
  studio's specific trademarked visual style, which is not something to
  clone. Substituted with an original, colorful, vivid, hand-drawn
  storybook/sticker-book illustration style instead: cheerful pastel scenes,
  charcoal-outlined cute character icons with faces/expressions (a friendly
  liver, a bouncy insulin blob, googly-eyed fat cells, a grinning brain),
  hand-drawn ornaments (suns, clouds, stars). No photorealism, no stock
  photography/footage, and no attempt to imitate any specific studio's
  copyrighted style.
- Narration voice: energetic, playful, comedic hype-man/coach delivery —
  big personality, timing for jokes, still clear and simple. Explicitly NOT
  a clone of any specific named real athlete's voice or likeness.

## Notes

- Scientific accuracy is a hard requirement; do not alter the physiological
  claims in the script.
- The lactate → BDNF claim is based on El Hayek et al. 2019, *Journal of
  Neuroscience*, DOI 10.1523/JNEUROSCI.1661-18.2019 — exercise-generated
  lactate crosses the blood-brain barrier and induces hippocampal BDNF via
  SIRT1/PGC-1α/FNDC5 signaling.
- No destination platform was specified, so default to a general-purpose
  16:9 landscape cut suitable for YouTube/embed.
- Autonomous run: no live user to answer follow-up questions, so `flow:
  automation` and `storyboard: no` are locked in; proceeding straight to a
  finished one-shot video from this brief.
