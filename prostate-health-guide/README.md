# Scott M.'s Prostate Health Guide

A private, single-file web app that helps a person newly diagnosed with prostate
cancer **organize their records** and **understand the language, drugs, and choices**
of treatment — in plain, eighth-grade-level explanations with optional audio.

> **Educational use only.** This is not a medical device and not medical advice.
> It does not diagnose or recommend treatment. Every decision belongs with the
> patient and their licensed care team. See the in-app **Disclaimers** section.

## Live app

- **URL:** https://claude.ai/code/artifact/c0ce29d2-8db8-4c62-ae43-a86a830104bb
- **QR code:** [`qr-code.png`](./qr-code.png) — scan to open on a phone.
- On an iPhone, open the URL in Safari and choose **Share → Add to Home Screen**
  for an app-like icon without the App Store.
- To ship it as a real **native iOS/Android app**, see
  [`capacitor-app/`](./capacitor-app/) and the store materials in [`store/`](./store/).

## First-run acknowledgement

On first launch, a full-screen gate states plainly that this is not medical advice,
that the care team should always be followed, that data stays on-device, and what to
do in an emergency. It must be explicitly accepted (checkbox + button) before the app
is usable, and can be reopened anytime from **Disclaimers**.

## Personalized, adaptive focus

The Overview shows a **"Scott's focus areas"** panel that reads everything entered
across the app — the diagnosis text (Gleason, ISUP, stage, gene results), **lab
values**, the **symptom and urine trackers**, and **rehab progress** — and
automatically highlights the most relevant sections and next steps:
- A BRCA2 mention surfaces PARP-inhibitor drugs, genetics, and matched trials.
- A high grade or "metastatic" surfaces intensive treatment and bone-directed options.
- A low hemoglobin or elevated liver enzyme in Labs surfaces a relevant question for
  the care team.
- A logged fever or a high-severity symptom surfaces a same-day-call reminder.
- Checking off rehab action items updates a **live progress bar and suggests the next
  unchecked steps** — the recommendations genuinely evolve as recovery continues,
  rather than staying static.

It is keyword- and threshold-based on your own entered data (lab flags use general
adult reference ranges, not Scott's own lab's range), clearly labeled as
auto-generated, and never a diagnosis or recommendation. It updates live as more is
entered.

## What's inside

**Scott's records** (stored *only on the device*, no server, no account, no tracking):
- Imaging & scans — upload MRI / X-ray / PET / PSMA / CT images with notes (IndexedDB)
- Biopsy & diagnosis — paste the pathology report; fields for Gleason, ISUP, TNM
- **Labs** — structured fields for CBC (WBC, hemoglobin, hematocrit, platelets, ANC),
  CMP (creatinine, eGFR, BUN, glucose, liver enzymes, electrolytes), and other
  biomarkers (testosterone, vitamin D, calcium), plus a dated lab-results log and
  photo upload for lab report pages
- Health history — conditions, medications, allergies, family history, care team
- Vitals — PSA, blood pressure, heart rate, weight, plus a dated PSA trend log
- **Flow sheets** — three daily-tracking logs: a vitals trend (BP/HR/weight/temp/O₂
  over time), a urine output tracker (times voided, estimated volume, leakage/control),
  and a symptom tracker (symptom type, 0–10 severity, notes)
- Backup & print — export/restore all records as a JSON file (important, since data
  lives only on the device), plus a one-page printable **appointment summary** that
  gathers the diagnosis, labs, vitals, history, recent symptoms/urine output, and
  checked-off questions for the care team

**Quick reference** — each item has a **colorful illustration** of its idea, a
plain-language explanation, an audio "Listen" button (browser text-to-speech), and
10+ action items to bring to the care team:
- Medications · **Chemotherapy** · Treatment plans · Radiation plans ·
  **Exercise & rehab** · Nutrition (with a **foods-to-avoid** section) · Supplements
- Surgery recovery · Genetic variations · Medical terms

The **Chemotherapy** section explains what biopsy findings (Gleason/ISUP grade,
extent, perineural invasion, disease volume) typically factor into the chemo
conversation — it is explicitly educational context, not a personalized
recommendation; that determination belongs to Scott's oncologist.

The **Exercise & rehab** section covers pre-surgery "prehab" (aerobic base,
pelvic-floor priming, strength, breathing, whole-body optimization) and post-surgery
rehab (early walking, pelvic-floor/Kegel retraining, continence and erectile
rehabilitation, progressive return to exercise, ADT-specific resistance training,
lymphedema awareness, fatigue pacing, and red-flag safety signs).

The pictures are hand-drawn inline SVG "flashcards" that depict each metaphor (a flame
losing its fuel for hormone therapy, a capped socket for receptor blockers, a DNA-repair
crew with a wrench for BRCA/PARP, a homing target for PSMA drugs, a tomato for lycopene,
sunshine for vitamin D, …). They are self-contained — no external images — and render
crisply in both light and dark themes with zero load time.

**Research & trust:**
- Clinical trials — a real, dated snapshot of major recruiting Phase 3 prostate cancer
  trials from ClinicalTrials.gov (with NCT links and plain-language explanations), plus
  live pre-filtered search links to find current trials near the patient
- Research databases — official links organized by category (SEER, TCGA, cBioPortal,
  PubMed, Cochrane, DrugBank, PharmGKB, ClinVar, ClinicalTrials.gov, TCIA, and more)
- Scholarly resources — guideline bodies and systematic-review sources
- Review & publishing — an honest roadmap for clinical peer review, legal/regulatory
  review, and Apple App Store submission (these require licensed clinicians, an
  attorney, and a developer account; they are **not** done)
- Disclaimers

## Packaging & publishing

- [`capacitor-app/`](./capacitor-app/) — a [Capacitor](https://capacitorjs.com) wrapper
  that turns the web app into a native iOS/Android build. It has the config, an app
  icon (`assets/icon.png`), a copy script, and step-by-step build instructions.
  Requires a Mac + Xcode + Apple Developer account to actually build and submit.
- [`store/listing.md`](./store/listing.md) — App Store / Play listing copy, keywords,
  privacy-label answers, and the screenshot shot-list.
- [`store/review-notes.md`](./store/review-notes.md) — App Store review-guideline
  mapping (1.4.1, 5.1.1) and the required human steps (clinical peer review, legal
  review) before submission.
- [`privacy.html`](./privacy.html) and [`support.html`](./support.html) — the public
  Privacy Policy and Support pages Apple requires URLs for.
- [`manifest.webmanifest`](./manifest.webmanifest) + [`icons/`](./icons/) — PWA install
  support (Add to Home Screen) with the app icon.

## Technical notes

- Single self-contained `index.html` — no build step, no external requests.
- Works offline. Data persists in `localStorage` (text) and `IndexedDB` (images).
- Light/dark themes with a manual toggle. Responsive; mobile menu.
- Audio uses the Web Speech API (`speechSynthesis`) — no data leaves the device.

## Honest limitations

- Content is **general and educational**, not reviewed by clinicians and not tailored
  to any individual. It may not reflect the latest research.
- The listed research databases are **linked, not integrated** — the app points to the
  trusted source rather than pulling live data.
- "Peer reviewed", "legal clearance", and "App Store publication" are a **roadmap**,
  not a completed status. See the in-app *Review & publishing* section.
