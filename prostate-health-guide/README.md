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

## What's inside

**Scott's records** (stored *only on the device*, no server, no account, no tracking):
- Imaging & scans — upload MRI / X-ray / PET / PSMA / CT images with notes (IndexedDB)
- Biopsy & diagnosis — paste the pathology report; fields for Gleason, ISUP, TNM
- Health history — conditions, medications, allergies, family history, care team
- Vitals — PSA, blood pressure, heart rate, weight, plus a dated PSA trend log
- Backup & print — export/restore all records as a JSON file (important, since data
  lives only on the device), plus a one-page printable **appointment summary** that
  gathers the diagnosis, vitals, history, and checked-off questions for the care team

**Quick reference** — each item has a plain-language explanation, an audio "Listen"
button (browser text-to-speech), and 10+ action items to bring to the care team:
- Medications · Treatment plans · Radiation plans · Nutrition · Supplements
- Surgery recovery · Genetic variations · Medical terms

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
