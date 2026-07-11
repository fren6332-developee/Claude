# HyperFrames toolkit (vendored, external)

HyperFrames is an HTML-based video engine that handles reframe, graphics, b-roll,
motion, and captions rendering for this pipeline. It is **not implemented in this
repo** — it's a vendored external dependency, referenced by the `graphics-plan` and
`embedded-captions` skills.

This directory is the vendoring point. Nothing here is fabricated scaffolding for
"a video engine" — that's a real piece of software that needs to be dropped in from
wherever it's actually maintained.

## To vendor HyperFrames in

1. Place the toolkit's distributable (or a git submodule / subtree checkout) under
   `engine/hyperframes/vendor/`.
2. Record what you vendored in `skills-lock.json` next to this file: source, pinned
   version/commit, and the date it was vendored.
3. Skills call HyperFrames through whatever CLI/entry point it exposes — do not
   hand-write a competing implementation inside a skill.

## Update policy

**Never hand-edit files under `engine/hyperframes/vendor/`.** To pick up a new
version:

1. Re-vendor from upstream (repeat step 1 above).
2. Update the `version` / `commit` / `vendored_at` fields in `skills-lock.json`.
3. Spot-check one job per format variant still renders correctly before committing.

If HyperFrames isn't vendored yet, `graphics-plan` and `embedded-captions` can still
produce the *plan* (beats, copy, caption text + timing) — only the actual render step
is blocked until the engine is in place.
