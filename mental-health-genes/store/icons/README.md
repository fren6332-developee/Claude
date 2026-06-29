# NutriGene Mind — app icon set

Generated from `../../icons/icon-master.svg` (regenerate with
`node ../../scripts/make_icons.mjs`). All "marketing" / iOS icons are **flattened
RGB with no alpha channel** (Apple rejects icons that contain alpha).

## Contents

- **`AppStore-1024.png`** — 1024×1024 App Store marketing icon (no alpha).
- **`ios/AppIcon.appiconset/`** — drop-in iOS asset catalog (all sizes +
  `Contents.json`). In Xcode, replace the app's `AppIcon.appiconset` with this
  folder, or drag the images into the existing one.
- **`android/`** — `mipmap-*/ic_launcher.png` (square), `ic_launcher_round.png`
  (round), and `ic_launcher_foreground.png` (transparent, for adaptive icons),
  across all five densities, plus `ic_launcher-playstore.png` (512) for the Play
  Store listing. Adaptive background color: **#6C63FF**.

## Easiest path with Capacitor

Instead of placing these by hand, the Capacitor project (`../../../capacitor-app/`)
includes `assets/icon.png` (the 1024 master). After adding platforms, run:

```bash
cd capacitor-app
npx @capacitor/assets generate --iconBackgroundColor '#6C63FF' --iconBackgroundColorDark '#6C63FF'
```

That auto-generates every iOS and Android icon (and splash screens) into the
native projects. Use the hand-placed sets here only if you're not using
`@capacitor/assets`.

## Web / PWA

The live web app icons in `../../icons/` (`icon-192.png`, `icon-512.png`,
`apple-touch-icon.png`, `favicon-32.png`) were updated from the same master.
