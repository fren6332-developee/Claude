# NeuroNourish — App Store submission checklist

A start-to-finish path to the App Store, wired to the assets already in this repo.
Work top to bottom. Items marked **(you)** require your Apple account / Mac and
can't be done from this repo.

---

## Phase 0 — Prerequisites (do these first)

- [ ] **(you)** Enroll in the **Apple Developer Program** — $99/yr — https://developer.apple.com/programs/
- [ ] **(you)** A **Mac with Xcode** installed (App Store), plus CocoaPods: `sudo gem install cocoapods`
- [ ] **(you)** Fill the placeholders before anything goes public:
  - `genenutrition-atlas/support.html` → replace `[ADD-SUPPORT-EMAIL]`
  - `genenutrition-atlas/privacy.html` → replace `[ADD-SUPPORT-EMAIL]` and `[ADD DATE BEFORE PUBLISHING]`
  - (A dedicated support alias is better than a personal address.)
- [ ] Confirm the two required URLs resolve (they're already deployed):
  - Support: `https://fren6332-developee.github.io/Claude/genenutrition-atlas/support.html`
  - Privacy: `https://fren6332-developee.github.io/Claude/genenutrition-atlas/privacy.html`

> **Strongly recommended before charging money:** get the signed clinical reviewer
> packet (`reviewer/clinical-review-packet.html`) and a quick legal review. Not
> required to submit a *free* app, but important once you monetize health content.

---

## Phase 1 — Build the native app (Mac)

```bash
cd capacitor-app
npm install
npm run copy:web                 # copies the live app into www/
npx cap add ios
npm run sync                     # copy:web + cap sync
# icons + splash from assets/icon.png and assets/splash.png:
npx @capacitor/assets generate --iconBackgroundColor '#6C63FF' \
  --iconBackgroundColorDark '#6C63FF' \
  --splashBackgroundColor '#6C63FF' --splashBackgroundColorDark '#0e1018'
npx cap open ios                 # opens Xcode
```

In **Xcode**:
- [ ] Select the project ▸ target ▸ **Signing & Capabilities**: pick your **Team**;
      enable **Automatically manage signing**.
- [ ] Confirm **Bundle Identifier** = `com.neuronourish.app` (must match
      App Store Connect; can't change after the app record is created).
- [ ] Set **Version** `1.1.0` and **Build** `1`.
- [ ] Pick a **Deployment Target** (e.g., iOS 14+) and a **Display Name** = NeuroNourish.
- [ ] Run on a **real device** once to sanity-check (audio plays, gate shows, links work).
- [ ] **Product ▸ Archive** → **Distribute App ▸ App Store Connect ▸ Upload**.
      (Or export the .ipa and upload with **Transporter**.)

> iPhone-only vs universal: if you don't want to support iPad, set the target's
> devices to iPhone — then you won't need iPad screenshots.

---

## Phase 2 — Create the app record (App Store Connect)

- [ ] **(you)** https://appstoreconnect.apple.com ▸ **Apps ▸ +  ▸ New App**
  - Platform: **iOS** · Name: **NeuroNourish** · Primary language: English (U.S.)
  - Bundle ID: **com.neuronourish.app** · SKU: any unique string (e.g., `gna-001`)
- [ ] Accept any pending agreements (and the **Paid Apps** agreement if you'll monetize).

---

## Phase 3 — Version metadata  (copy from `store/app-store-listing.md`)

- [ ] **Subtitle:** `Genes, food & mental wellness`
- [ ] **Promotional text** (§2), **Description** (§3), **Keywords** (§4), **What's New** (§5)
- [ ] **Support URL** and **Marketing URL** (§6) — Marketing URL =
      `https://fren6332-developee.github.io/Claude/genenutrition-atlas/`
- [ ] **Privacy Policy URL** (required) = the privacy.html link above
- [ ] **Category:** Primary **Reference**, Secondary **Medical** (recommended for a
      smoother first review — see the category note in §1)

---

## Phase 4 — Media

- [ ] **App Icon:** Xcode pulls it from the asset catalog; the 1024 marketing icon is
      `store/icons/AppStore-1024.png` (no alpha — Apple-safe).
- [ ] **Screenshots:** upload `store/screenshots/iphone-6.9_*.png` into the **6.9"**
      slot (covers all modern iPhones). Add `ipad-12.9_*` only if you kept iPad support.
- [ ] **App Preview (optional but nice):** record it from `store/app-preview-storyboard.md`
      (6 beats, ~24s), export H.264 1080×1920, upload to the 6.9" slot. First frame = poster.

---

## Phase 5 — Compliance answers

- [ ] **App Privacy:** answer **Data Not Collected** (§7). No analytics, ads, or accounts.
- [ ] **Age rating:** complete honestly; "Medical/Treatment Information: Infrequent/Mild" (§8).
- [ ] **App Review Information ▸ Notes:** paste the notes from §9 (this is the big one —
      it pre-empts the medical-app guidelines). Contact info: your name/email/phone.
      **Demo account:** none needed (no login) — say so.

---

## Phase 6 — Pricing & submit

- [ ] **Pricing:** Free (recommended for v1). You can add a subscription / IAP later.
- [ ] Select the uploaded **Build** in the version page.
- [ ] **Add for Review ▸ Submit**.
- [ ] Review usually takes ~1–3 days. If rejected, reviewers cite a guideline number —
      most medical-app rejections are 1.4.1 (claims), 4.2 (minimum functionality), or
      5.1.1 (privacy/data); the disclaimers, bundled content, and "Data Not Collected"
      answer are built to satisfy all three.

---

## Phase 7 — After approval (before/when you monetize)

- [ ] Put the **signed clinical reviewer packet** on file; then fill
      `APP_INFO.reviewerSignoff` in `js/data.js` so the in-app status flips from
      "pending" to "independently reviewed," and resubmit.
- [ ] If charging: set up an **auto-renewable subscription** or IAP in App Store Connect
      (iOS digital goods must use Apple IAP). Update **App Privacy** if you add any SDKs.
- [ ] Consider **Google Play** too (cheaper/faster; TWA via Bubblewrap) — same disclaimers.

---

## Asset index (everything is in the repo)

| Need | File |
|---|---|
| Listing copy + review notes | `store/app-store-listing.md` |
| Screenshots | `store/screenshots/` |
| App icons (incl. 1024) | `store/icons/` |
| Splash screens | `store/splash/` |
| App Preview storyboard | `store/app-preview-storyboard.md` + `store/storyboard/` |
| Clinical reviewer packet | `reviewer/clinical-review-packet.html` |
| Privacy / Support pages | `privacy.html` / `support.html` |
| QR codes | `store/qr/` |
| Native wrapper | `../capacitor-app/` |
