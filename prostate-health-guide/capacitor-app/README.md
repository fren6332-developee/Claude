# Prostate Health Guide — native app wrapper (Capacitor)

This folder turns the Prostate Health Guide web app (the single `../index.html`)
into a native **iOS** and **Android** app using [Capacitor](https://capacitorjs.com),
so it can be submitted to the App Store and Google Play.

There's no rewrite: the same HTML/CSS/JS is bundled into a native shell. The web
app stays the single source of truth — this project copies it into `www/` and wraps it.

> **You cannot finish this on the web session.** Building and submitting an iOS app
> requires a Mac with Xcode and a paid Apple Developer account. The steps below are
> run on your own Mac. Everything in this repo (config, icons, copy script, store
> materials) is prepared so those steps are short.

---

## What you need (one-time)

- **A Mac with Xcode** (for iOS) — Apple requires this to build/submit.
- **Node.js 18+** and **npm**.
- **CocoaPods** (`sudo gem install cocoapods`) for iOS.
- For Android: **Android Studio** (works on Mac/Windows/Linux).
- An **Apple Developer Program** account ($99/yr) to submit to the App Store.

## Build steps

```bash
cd prostate-health-guide/capacitor-app

# 1. Install Capacitor
npm install

# 2. Copy the web app into ./www
npm run copy:web

# 3. Add the native platforms (generates ios/ and android/)
npx cap add ios
npx cap add android        # optional, for Google Play

# 4. Copy web assets + native config into the platforms
npx cap sync

# 5. Generate app icons & splash screens from assets/icon.png (the 1024 master)
npm run assets

# 6. Open in the native IDE to run / archive / submit
npx cap open ios           # → Xcode: set your Team + bundle id, then Product > Archive
npx cap open android       # → Android Studio
```

## App identity (already configured in `capacitor.config.json`)

| Field    | Value                               |
|----------|-------------------------------------|
| App name | Prostate Health Guide               |
| Bundle ID| `com.scottmguide.prostatehealth`    |
| Web dir  | `www` (populated by `copy:web`)     |
| BG color | `#152220`                           |

Change the bundle ID to one you own (e.g. reverse-DNS of your domain) before
submitting.

## Before you submit

Read [`../store/review-notes.md`](../store/review-notes.md) — it lists the App Store
review requirements for a medical/health app (guidelines 1.4.1 and 5.1.1), plus the
privacy-policy and support URLs Apple will ask for. The store listing copy is in
[`../store/listing.md`](../store/listing.md).
