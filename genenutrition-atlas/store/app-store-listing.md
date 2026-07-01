# NeuroNourish — App Store submission kit

Copy-paste-ready metadata for **App Store Connect**, plus **App Review notes**
written to pre-empt the medical-app guidelines (1.4.1, 4.2, 5.1). Character
limits are noted next to each field — stay within them or App Store Connect will
reject the entry. Counts shown are approximate; verify in the form.

> ⚠️ Reminder: this app is positioned as **educational reference, not a medical
> device**. Do not add any wording that claims to diagnose, treat, or give
> individualized medical advice, and do not claim clinical review until a signed
> reviewer packet is on file. The copy below is written to that line — keep it there.

---

## 1. App information

| Field | Value |
|---|---|
| **App Name** (≤30 chars) | `NeuroNourish` |
| **Subtitle** (≤30 chars) | `Genes, food & mental wellness` |
| **Primary category** | Medical *(see note below)* |
| **Secondary category** | Reference |
| **Bundle display name** | NeuroNourish |

**Category note:** *Medical* reaches the right audience but draws the most review
scrutiny — which is exactly why the disclaimer gate, Safety & Sources screen, and
sourcing exist. If you'd prefer a smoother first review, set **Primary = Reference**
(or Education) and **Secondary = Medical**; the content is an educational reference,
so either is defensible. Recommendation: start with **Reference / Medical** for the
first approval, switch to **Medical / Reference** later if you want.

---

## 2. Promotional text (≤170 chars)
> Editable anytime without resubmitting — use it for announcements.

```
Understand 27 mental-health genes in plain language: the medicines they affect and the foods that support each pathway. Calm audio guides. Educational, ad-free.
```
*(≈157 chars)*

---

## 3. Description (≤4000 chars)

```
NeuroNourish turns complex pharmacogenomics into clear, calm, everyday language.
Explore 27 mental-health-related genes — the same panel used in clinical
pharmacogenetic testing — and understand how each one shapes the way the brain,
medications, and food work together.

This is an educational reference designed to help you have better-informed
conversations with your own clinician. It does not diagnose, treat, or give
personal medical advice.

WHAT'S INSIDE
• All 27 genes, grouped by pathway (metabolism, transporters, serotonin, dopamine,
  neuronal signaling, and drug-safety genes)
• A plain-language, 8th-grade-level explanation of every gene
• Calm, studio-recorded audio narration for each gene — listen on the go
• Population-health context: roughly how common each gene variant is
• The mental-health conditions associated with each gene
• The three medications most associated with each gene, and how the gene can
  influence the body's response (pharmacology, pharmacodynamics, pharmacokinetics)
• Five foods per gene that may amplify, modulate, or protect that pathway —
  framed as complements to care, never replacements for medication
• Fast search and pathway filters

BUILT ON TRUSTED SOURCES
Content is compiled and cross-referenced against guidance from the American
Psychiatric Association, the National Institute of Mental Health, the
International Society for Nutritional Psychiatry Research, the Food & Mood Centre,
the American Society for Nutrition, and the Global Brain Health Institute, and
aligned with CPIC and PharmGKB pharmacogenomics resources. A full source list and
methodology are inside the app under "Safety & Sources."

PRIVATE BY DESIGN
NeuroNourish runs entirely on your device. No account, no sign-in, no tracking,
and no personal or health data is collected, stored, or shared. The app works
offline once loaded.

IMPORTANT — PLEASE READ
NeuroNourish provides educational information only. It is not medical advice, a
diagnosis, a treatment, or a medical device, and it is not a substitute for your
physician, pharmacist, a genetic test, or the official lab report. Never start,
stop, or change any medication, supplement, or diet based on this app — always
talk to your prescriber first. Foods described as "supporting the same pathway"
are complements, not substitutes for medication, and are not treatment claims.
Genetic results must be interpreted by a qualified professional.

IF YOU ARE IN CRISIS
If you are in the U.S. and thinking about suicide or self-harm, call or text 988
(Suicide & Crisis Lifeline), or call 911 in an emergency. International helplines
are listed inside the app.

This content is currently pending independent clinical review; its status is shown
transparently inside the app.
```

---

## 4. Keywords (≤100 chars, comma-separated, no spaces)

```
genes,mental health,pharmacogenomics,mood,nutrition,psychiatry,depression,anxiety,brain,medication
```
*(≈99 chars — trim if App Store Connect flags it. Don't repeat words used in the
App Name/Subtitle; Apple already indexes those.)*

---

## 5. What's New (version notes, ≤4000 chars) — v1.1.0

```
• New "Safety & Sources" screen: full medical disclaimer, crisis resources,
  methodology, and a complete source list.
• A one-time welcome notice clarifying the app is educational and not medical advice.
• Clearer per-page reminders to talk with your prescriber.
• Studio-recorded audio narration for every gene.
• Reliability and offline improvements.
```

---

## 6. URLs (required / recommended)

| Field | Value |
|---|---|
| **Support URL** (required) | A page where users can reach you (e.g., a simple site or a mailto-style contact page). |
| **Marketing URL** (optional) | `https://fren6332-developee.github.io/Claude/genenutrition-atlas/` (or your standalone nutrigene-mind repo URL) |
| **Privacy Policy URL** (required) | Host the privacy text below at a public URL and link it here. |

> You need a real **Support URL** and **Privacy Policy URL** before you can submit.
> The simplest option: a one-page site (even a GitHub Pages page) with a contact
> email and the privacy policy. I can generate both pages for you.

---

## 7. App Privacy ("nutrition label" questionnaire)

Answer the App Privacy section as **Data Not Collected**:

- **Do you or your third-party partners collect any data from this app?** → **No**
- No analytics SDKs, no ads, no account system, no device identifiers.
- This is accurate because the app is fully static and on-device. If you later add
  analytics or payments, you MUST update these answers.

---

## 8. Age rating questionnaire (guidance)

- Medical/Treatment Information: **Infrequent/Mild** (it discusses medications and
  conditions in an educational way).
- No violence, sexual content, profanity, gambling, or user-generated content.
- Expected result: **17+** is possible because of the "Medical/Treatment
  Information" flag; **12+** if rated as infrequent/mild references. Answer honestly
  — an accurate rating avoids problems later.

---

## 9. App Review Information — Notes (the most important field)

> Paste this into **App Review Information → Notes**. It proactively addresses the
> guidelines reviewers apply to health apps.

```
Thank you for reviewing NeuroNourish.

WHAT THIS APP IS
NeuroNourish is an EDUCATIONAL REFERENCE about 27 pharmacogenomic
("mental-health") genes — the medications they influence and dietary patterns that
support the same biological pathways. It is presented in plain language with
optional audio narration.

WHAT THIS APP IS NOT (Guideline 1.4.1)
It does NOT diagnose, treat, or provide individualized medical advice, and it is
NOT a medical device. It does not request or process any patient/health data and
makes no treatment or efficacy claims. Foods are described as complements that
influence the same pathway — never as replacements for medication.

SAFETY MEASURES YOU WILL SEE
• On first launch, a mandatory acknowledgment screen states the app is educational
  only, instructs users never to start/stop/change medication, supplement, or diet
  without their prescriber, and shows the 988 Suicide & Crisis Lifeline and 911.
• Every gene page shows a caution banner, a drug-safety note (medication/dose
  decisions belong to a clinician), and a cited source line.
• The header "Safety & Sources" screen contains the full medical disclaimer,
  crisis resources, methodology, a complete source list (APA, NIMH, ISNPR, Food &
  Mood Centre, ASN, GBHI, CPIC, PharmGKB, NIH GTR, FDA), and a privacy statement.
• The app transparently states that its content is pending independent clinical
  review; it makes no claim of clinician endorsement.

NOT JUST A WEB PAGE (Guideline 4.2)
All content is bundled in the app and works fully offline, including 27
studio-recorded audio narrations, on-device search, and pathway filtering. There
is no login wall and no externally hosted content required to use the app.

PRIVACY (Guideline 5.1)
The app runs entirely on-device. It collects, stores, and transmits NO personal or
health data, uses no analytics or ads, and requires no account. App Privacy is
declared as "Data Not Collected."

DEMO ACCOUNT
None required — the app has no sign-in. All features are available immediately.

CONTACT
[your name] — [your email] — happy to answer any questions or provide our source
documentation and clinical-review materials on request.
```

---

## 10. Privacy Policy text (host at a public URL, link in §6)

```
NeuroNourish — Privacy Policy
Last updated: [DATE]

NeuroNourish ("the app") is an educational reference that runs entirely on your
device. We designed it to be private by default.

Information we collect: None. The app does not collect, store, transmit, or share
any personal information or health data. There are no user accounts, no sign-in,
and no profiles.

Analytics and advertising: None. The app contains no third-party analytics, no
advertising SDKs, and no tracking technologies. We do not use device identifiers.

Data you enter: The app does not ask you to enter personal or health information.
Any text you type into the in-app search is processed on your device and is not
transmitted or stored.

Children: The app is a general-audience educational reference and is not directed
to children under 13. We do not knowingly collect information from anyone.

Third parties: The app does not share data with third parties because it does not
collect any.

Changes: If this policy changes, the updated version will be posted at this URL
with a new "last updated" date.

Contact: [your email]

Medical disclaimer: NeuroNourish provides educational information only and is not
medical advice, a diagnosis, a treatment, or a medical device. Always consult a
qualified clinician before making medical or dietary decisions.
```

---

## 11. Bonus — Google Play short copy (if you also publish there)

- **Short description (≤80 chars):** `Understand 27 mental-health genes — the meds they affect and supportive foods.`
- **Full description:** reuse §3.
- Play is generally faster for this type of app and accepts PWAs via a Trusted Web
  Activity (Bubblewrap). Same disclaimers apply; declare "No data collected" in the
  Data Safety form.

---

## Pre-submission checklist

- [ ] Apple Developer Program account active ($99/yr)
- [ ] App built as a native shell (e.g., Capacitor) around the web app
- [ ] App icon (1024×1024) + screenshots for required device sizes
- [ ] Support URL live
- [ ] Privacy Policy URL live (text in §10)
- [ ] App Privacy questionnaire = Data Not Collected
- [ ] Age rating completed honestly
- [ ] App Review Notes pasted (§9)
- [ ] (Strongly recommended before charging money) signed clinical reviewer packet on file
```
