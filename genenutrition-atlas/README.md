# NeuroNourish 🧬

An educational, mobile-friendly web app that explains **27 mental-health genes**
(from the Genomind Pharmacogenetic Panel) in plain language — and connects each
gene to the medicines it affects and the **foods that support that pathway**.

👉 Open `index.html` (or deploy the `genenutrition-atlas/` folder) to use it.
It's a static Progressive Web App — no build step, no server required, and it
works offline once loaded.

## Safety & App Store readiness

To support distribution as a health/medical app (e.g., Apple App Store
Guidelines 1.4.1, 4.2, 5.1), the app includes:

- A **one-time acknowledgment gate** (educational-only, not medical advice, talk
  to your prescriber, crisis line) shown before first use.
- A **caution banner, drug-safety note, and per-gene source line** on every gene page.
- A **Safety, Sources & Methodology** screen (header "⚕️ Safety & Sources") with a
  full medical disclaimer, **crisis resources** (988, Crisis Text Line, 911, Find A
  Helpline), the build **methodology**, cited **references** (APA, NIMH, ISNPR, Food
  & Mood Centre, ASN, GBHI, plus CPIC, PharmGKB, NIH GTR, FDA), a **privacy**
  statement (no data collected), and an **honest clinical-review status**.

> **Clinical review is marked "pending" on purpose.** The app does not claim a
> clinician has signed off, because none has yet. When a licensed reviewer
> verifies the content, fill in `APP_INFO.reviewerSignoff` in `js/data.js`
> (reviewer name, credentials, date) and the status flips to "independently
> reviewed." Do not ship a "reviewed" claim before that is true.

## What's inside each gene page

For all 27 genes the app shows:

- **🎧 Plain-language explanation** at an 8th-grade reading level, with a
  **"Listen"** button that narrates it in a calm, confident **male voice**
  (using the device's built-in text-to-speech — see *Audio* below).
- **👥 Population health** — roughly how much of the general population carries
  the relevant variant.
- **🧠 Linked mental-health conditions** correlated with the gene.
- **💊 Top 3 most-prescribed drugs** and how the gene changes the response.
- **🔬 Pharmacology / pharmacodynamics / pharmacokinetics** notes for the common
  drugs.
- **🥗 Five foods** that **Amplify**, **Modulate**, or **Protect** that pathway.
- **✨ Foods that "mimic" drug efficacy** — whole-food ways to support the *same*
  biological pathway (gently, as a complement — never a replacement).

You can **search** by gene, illness, drug, or food, and **filter** by pathway
(metabolism, transporters, serotonin, dopamine/adrenergic, signaling & mood,
other/safety).

## Audio narration

Each gene has a **fixed, studio-rendered MP3** narration in `audio/<SYMBOL>.mp3`,
spoken in a **warm, calm, confident male voice**. These sound identical on every
device — no dependence on whatever voices a phone or browser happens to have.

The "Listen" button plays the MP3. If a file can't be loaded (e.g., truly
offline before the cache is warm), the app gracefully **falls back** to the
browser's Web Speech API reading the same script.

**How the MP3s were generated** (re-runnable): the build script
`scripts/generate_audio.py` synthesizes each narration with **Kokoro v1.0**
(neural TTS, voice `am_michael`) and encodes to MP3. The spoken script is the
gene's `plain` explanation plus its population note and a short disclaimer — the
exact text in `js/data.js`. To regenerate after editing content:

```bash
pip install kokoro-onnx soundfile imageio-ffmpeg
# download the model + voices (see scripts/generate_audio.py header), then:
python scripts/generate_audio.py
```

`audio/manifest.json` records the voice, engine, and duration of each clip.

## Evidence base & cross-referencing

Content was compiled and cross-referenced against guidance and reviews from:

- American Psychiatric Association (APA)
- National Institute of Mental Health (NIMH)
- International Society for Nutritional Psychiatry Research (ISNPR)
- Food & Mood Centre, Deakin University (FMC)
- American Society for Nutrition (ASN)
- Global Brain Health Institute (GBHI)

Where these bodies differ, the app presents the **conservative, consensus** view
and frames nutrition as **whole-diet patterns** (e.g., Mediterranean / "SMILES"-
style diets) that are broadly endorsed as **adjuncts** to clinical care.

Gene list source: **Genomind Pharmacogenetic Report / NIH Genetic Testing
Registry (GTR000523653, last updated October 2025).**

## ⚠️ Important disclaimer

This app is **educational information, not medical advice**, and is **not** a
substitute for the official Genomind report or a clinician's judgment. Foods do
**not** replace medications. "Mimic" means a food influences the *same* pathway
in a gentler, supportive way. Always work with your prescriber before changing
any medication or diet — especially for genes flagged for **drug-safety testing**
(HLA-A, HLA-B), where a genetic test, not nutrition, is the protective step.

## Files

```
genenutrition-atlas/
├── index.html              # app shell
├── css/styles.css          # styling
├── js/data.js              # the 27-gene database (edit content here)
├── js/app.js               # rendering, search/filter, audio narration
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # network-first service worker (offline support)
├── audio/                  # fixed MP3 narration per gene + manifest.json
├── scripts/generate_audio.py  # re-render the narration MP3s
└── icons/                  # app icons
```
