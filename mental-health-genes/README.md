# NutriGene Mind 🧬

An educational, mobile-friendly web app that explains **27 mental-health genes**
(from the Genomind Pharmacogenetic Panel) in plain language — and connects each
gene to the medicines it affects and the **foods that support that pathway**.

👉 Open `index.html` (or deploy the `mental-health-genes/` folder) to use it.
It's a static Progressive Web App — no build step, no server required, and it
works offline once loaded.

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

The "Listen" feature uses the **Web Speech API** built into modern browsers, so
no audio files are bundled and nothing is sent to a server. The app prefers a
male English voice and lowers the rate and pitch slightly for a calm, grounded
delivery. Available voices vary by device/browser; if a device has no suitable
voice, the button reports "Audio unavailable."

> To ship fixed, studio-style narration instead of on-device TTS, pre-render an
> MP3 per gene from the `plain` text in `js/data.js` and swap the `Narrator`
> module to play the audio files. The script text is already written for it.

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
mental-health-genes/
├── index.html              # app shell
├── css/styles.css          # styling
├── js/data.js              # the 27-gene database (edit content here)
├── js/app.js               # rendering, search/filter, audio narration
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # network-first service worker (offline support)
└── icons/                  # app icons
```
