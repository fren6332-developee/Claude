# App Store review notes & compliance checklist

For a **Medical**-category app, Apple's review is stricter than usual. This file maps
the app to the relevant App Store Review Guidelines and lists what you must have ready.
Read it before you submit.

---

## Notes for the App Reviewer (paste into App Store Connect → App Review Information)

> This is an educational and personal-organization app for people affected by prostate
> cancer. It does **not** diagnose, does not recommend treatment, does not perform any
> calculation that drives a medical decision, and is not a medical device.
>
> All data is stored locally on the device (localStorage/IndexedDB). There is no
> account and no server — nothing to log into. The app makes no network calls except
> opening external reference websites (e.g. ClinicalTrials.gov) in the browser when the
> user taps a link.
>
> A medical disclaimer appears on the Overview screen and in a dedicated Disclaimers
> section. The "Clinical trials" content is a clearly dated, read-only snapshot with a
> prominent note that it is not medical advice or an eligibility check.
>
> No demo account is needed. To exercise features, tap through the left-hand navigation.

## Guideline mapping

### 1.4.1 — Medical apps must be accurate and not endanger users
- ✅ Content is general and educational; no dosing calculators, no diagnostic output.
- ✅ Every reference section defers to the care team and lists "questions to ask."
- ✅ Persistent disclaimer on the home screen and a dedicated Disclaimers screen.
- ⚠️ **You must complete a clinical review** (see below) so claims are accurate and
  current. Keep a dated record of who reviewed the content.

### 5.1.1 — Data collection and storage / privacy
- ✅ No data leaves the device; App Privacy label = "Data Not Collected."
- ✅ Privacy policy provided (`privacy.html`) and linked in-app.
- ✅ User can export and erase all data.

### 5.1.1(iii) — Health data
- ✅ Health data is never used for advertising and is not shared.
- ✅ The app does not write to Apple HealthKit (nothing to declare there).

### 2.1 — App completeness
- ✅ Fully functional offline; no placeholder content or broken links intended.
- Capture the screenshots listed in `listing.md` on real devices.

### 4.2 — Minimum functionality
- ✅ More than a repackaged website: local record storage, image uploads, audio
  explanations, backup/restore, printable summary, and a personalization engine.

## Before you submit — required human steps (an app builder cannot do these for you)

1. **Clinical peer review.** Have a urologist, medical oncologist, radiation
   oncologist, and an oncology dietitian review the reference content for accuracy and
   safety. Keep signed, dated sign-off. Revise until they approve.
2. **Legal/regulatory review.** Have a healthcare attorney confirm the app stays within
   "general wellness / education" (FDA guidance on general wellness devices) and that
   the disclaimers and terms are sufficient. Confirm it is **not** a regulated medical
   device.
3. **Privacy review.** Confirm HIPAA does not apply (no covered entity, no data
   transmission) and that the privacy policy is accurate for your final build.
4. **Host the legal pages.** Publish `privacy.html` and `support.html` at stable public
   URLs and put those URLs in the listing.
5. **Own the bundle ID and accounts.** Enroll in the Apple Developer Program, set your
   Team and a bundle ID you control in Xcode.
6. **Add a first-run acknowledgement (recommended).** A one-time "I understand this is
   not medical advice" screen strengthens the 1.4.1 position. (Not yet built — optional
   enhancement.)

## Honest status

As shipped in this repository, the app has **not** completed clinical peer review or
legal review, and is **not** on the App Store. This folder makes those steps as short
as possible, but steps 1–5 above require licensed professionals and your own accounts.
