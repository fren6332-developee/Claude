# GeneNutrition Atlas — native app wrapper (Capacitor)

This folder turns the GeneNutrition Atlas web app (in `../mental-health-genes/`) into a
native **iOS** and **Android** app using [Capacitor](https://capacitorjs.com), so
it can be submitted to the App Store and Google Play.

There's almost no rewrite: the same HTML/CSS/JS/audio is bundled into a native
shell. The web app stays the single source of truth — this project just copies it
into `www/` and wraps it.

---

## What you need (one-time)

- **A Mac with Xcode** (for iOS) — Apple requires this to build/submit.
- **Node.js 18+** and **npm**.
- **CocoaPods** (`sudo gem install cocoapods`) for iOS.
- For Android: **Android Studio** (works on Mac/Windows/Linux).
- An **Apple Developer Program** account ($99/yr) to submit to the App Store.

## Build steps

```bash
cd capacitor-app

# 1. Install Capacitor
npm install

# 2. Copy the web app into ./www
npm run copy:web

# 3. Add the native platforms (generates ios/ and android/)
npx cap add ios
npx cap add android       # optional, for Google Play

# 4. Copy web assets + native config into the platforms
npx cap sync

# 5. Generate app icons & splash screens from assets/icon.png (the 1024 master)
npx @capacitor/assets generate --iconBackgroundColor '#6C63FF' \
  --iconBackgroundColorDark '#6C63FF' \
  --splashBackgroundColor '#6C63FF' --splashBackgroundColorDark '#0e1018'
#    (Pre-generated icon sets are also in ../mental-health-genes/store/icons/ if
#     you'd rather place them by hand.)

# 6. Open in the native IDE to run / archive / submit
npx cap open ios          # → Xcode: set your Team, bundle id, then Product > Archive
npx cap open android      # → Android Studio
```

> After any change to the web app, re-run **`npm run sync`** (copies web + `cap sync`)
> and rebuild in Xcode/Android Studio.

## Configuration

`capacitor.config.json`:
- `appId`: **`com.genenutritionatlas.app`** — change to a reverse-DNS id you control
  before your first submission (it can't be changed after the app is created in
  App Store Connect).
- `appName`: **GeneNutrition Atlas**
- `webDir`: **www** (populated by `npm run copy:web`)

## App Store / Play submission

The listing copy, App Review notes, privacy-policy text, and a pre-submission
checklist are in **`../mental-health-genes/store/app-store-listing.md`**.

Key reminders:
- The app is positioned as an **educational reference, not a medical device**.
- Host the **Privacy Policy** (`../mental-health-genes/privacy.html`) and
  **Support** (`../mental-health-genes/support.html`) pages at public URLs and add
  them in App Store Connect. They're already live on the web deployment at
  `…/mental-health-genes/privacy.html` and `…/support.html`.
- Paste the **App Review notes** so the reviewer sees the disclaimers, safety
  screen, and offline content up front.

## Why `www/`, `ios/`, `android/` aren't committed

`www/` is regenerated from the web app (avoids duplicating ~9 MB of audio in git),
and the native `ios/`/`android/` folders are generated on your Mac. All three are
git-ignored by default. If you want them versioned, remove the relevant lines from
`.gitignore` after generating them.

## Notes / gotchas

- The "Listen" buttons play bundled MP3s, which work offline inside the native app.
  The Web Speech fallback may be unavailable in a native WebView — that's fine,
  since every gene has a real audio file.
- No network/permissions are required; the app collects no data.
- Capacitor major versions move quickly. If you want the newest, run
  `npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/ios@latest @capacitor/android@latest`
  and re-sync.
