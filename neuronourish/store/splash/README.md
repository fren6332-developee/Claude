# NeuroNourish — splash / launch screens

Matching launch screens: the DNA-helix-and-leaf logo with the **GeneNutrition
Atlas** wordmark on the brand gradient. Generated from `../../icons/icon-master.svg`
with `node ../../scripts/make_splash.mjs`.

## Files here (reference renders)
- `splash-2732-light.png` / `splash-2732-dark.png` — 2732×2732 square masters.
- `iphone-1290x2796.png` — portrait iPhone 6.9".
- `ipad-2048x2732.png` — portrait iPad 12.9".
- `generic-1080x1920.png` — generic portrait.

## Easiest path (Capacitor)
The Capacitor project already has the source images at
`../../../capacitor-app/assets/splash.png` (light) and `splash-dark.png` (dark).
After adding platforms, run:

```bash
cd capacitor-app
npx @capacitor/assets generate --splashBackgroundColor '#6C63FF' --splashBackgroundColorDark '#0e1018'
```

`@capacitor/assets` reads `assets/splash.png` (+ `splash-dark.png`) and generates
every iOS launch image and Android 12+ splash automatically. The same command also
generates the app icons from `assets/icon.png`.

## Notes
- Keep the logo within the central ~60% (done here) so it survives per-device cropping.
- iOS shows the launch screen only briefly; don't put essential info on it.
- Android 12+ uses an icon-style splash — `@capacitor/assets` handles the masking.
