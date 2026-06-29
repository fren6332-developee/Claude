# GeneNutrition Atlas — App Preview video storyboard

A shot-by-shot plan for the 15–30s App Preview shown on your App Store page.
Target length: **~24 seconds**. Built from real app footage (Apple requires App
Previews to be captured from the app, not pure motion graphics — only the
title/end cards and text overlays are added in editing).

---

## Technical specs (Apple App Preview)

| Spec | Value |
|---|---|
| Duration | 15–30 s (target 24 s) |
| Orientation | Portrait |
| Resolution (iPhone 6.9"/6.7") | **1080 × 1920** or 886 × 1920 |
| Resolution (iPad 13") | 1200 × 1600 (if you keep iPad) |
| Frame rate | 30 fps (25–30 ok) |
| Format / codec | .mov / .mp4, **H.264** (or ProRes 422 HQ) |
| Max size | 500 MB |
| Poster frame | First frame shown before play — make it the Home screen (Shot 1) |
| Audio | Optional; many previews are music + captions. Keep VO neutral/educational. |

> One App Preview can be uploaded per localization, per device size. The 6.9"
> video also serves smaller iPhones.

---

## The 6 beats (~24 s)

| # | Time | Visual (real app) | Action / motion | On-screen caption | VO (optional) | Transition |
|---|------|-------------------|-----------------|-------------------|---------------|-----------|
| 1 | 0:00–0:03 | **Home grid** (poster frame) | App opens; the title settles, grid of gene cards fades in | “Your mind, your genes,\nyour food.” | “Meet GeneNutrition Atlas.” | Cut |
| 2 | 0:03–0:07 | **Home grid** | Gentle scroll through colorful gene cards; tap a card | “27 mental-health genes,\nexplained simply.” | “Twenty-seven genes, in plain language.” | Push left |
| 3 | 0:07–0:13 | **Gene detail (BDNF)** | Detail opens; finger taps **Listen**; show the button switch to “Playing,” brief calm narration plays | “Plain-language guides\n+ calm audio.” | (let ~2 s of the real narration play) | Cross-dissolve |
| 4 | 0:13–0:17 | **Foods section** | Scroll reveals Amplify / Modulate / Protect food cards | “Foods that support\neach gene’s pathway.” | “And foods that support the same pathways.” | Push left |
| 5 | 0:17–0:21 | **Safety & Sources** | Scroll past disclaimer → sources list → privacy line | “Trusted sources.\nPrivate by design.” | “Sourced, transparent, and private.” | Cross-dissolve |
| 6 | 0:21–0:24 | **End card** (brand gradient + icon) | Icon scales in; tagline | “GeneNutrition Atlas” / “Understand your mind.” | “GeneNutrition Atlas.” | Fade out |

---

## Voiceover script (optional — male, calm, matches the in-app narrator)

> Total ≈ 18 s of speech across 24 s; leave room for the live audio in Shot 3.

```
Meet GeneNutrition Atlas.
Twenty-seven mental-health genes — explained in plain language,
with calm audio you can listen to anywhere.
Discover the medications each gene affects…
and the foods that support the same pathways.
All sourced, transparent, and private by design.
GeneNutrition Atlas. Understand your mind.
```

*If you skip VO:* keep the on-screen captions and let soft music carry it. Captions
alone are fully acceptable and often perform better for accessibility.

---

## Music & sound direction

- **Mood:** warm, calm, hopeful — soft piano/marimba with a gentle pulse; nothing
  clinical or tense. Royalty-free libraries: Epidemic Sound, Artlist, or Apple’s
  built-in iMovie tracks (“Reflection,” “Daydream”).
- **Level:** duck the music to ~20% during Shot 3 so the real narration is clear.
- **SFX:** a soft tap sound on each interaction; a light “shimmer” on the end card.
- Make sure you have rights to any music — Apple can reject previews for unlicensed audio.

---

## On-screen caption list (for quick editing)

1. Your mind, your genes, your food.
2. 27 mental-health genes, explained simply.
3. Plain-language guides + calm audio.
4. Foods that support each gene’s pathway.
5. Trusted sources. Private by design.
6. GeneNutrition Atlas — Understand your mind.

Style: large, bold, white, with a soft drop shadow; same brand purple→teal as the
screenshots. Keep each caption on screen ≥1.5 s and within the safe area (avoid the
top notch and bottom 10%).

---

## Compliance notes (keep the preview approvable)

- Position as **educational**, never as diagnosis/treatment. The captions and VO
  above are deliberately neutral. Do **not** add claims like “improve your mood,”
  “treat depression,” or “personalized advice.”
- Don’t imply the app replaces a clinician or a lab test.
- It’s fine (and good) that Shot 5 shows the disclaimer/sources — it signals
  responsibility to reviewers.
- Avoid on-screen “Download now / Buy” CTAs inside the video; Apple discourages them.

---

## How to record & assemble

1. **Capture the screens** (no third-party watermark):
   - Easiest: run the app in the **iOS Simulator** (Xcode) on an iPhone 16 Pro Max,
     and use **File ▸ Record Screen**, or `xcrun simctl io booted recordVideo preview.mov`.
   - Or screen-record a real device via QuickTime (Mac) → *File ▸ New Movie Recording* → select the iPhone.
   - Perform the exact actions in the table, slowly and smoothly.
2. **Edit** in iMovie, CapCut, or Final Cut:
   - Trim to the 6 beats; total ≤ 30 s.
   - Add the captions and (optional) VO + music; duck music under Shot 3.
   - Add the brand end card (use `store/icons/AppStore-1024.png` on a purple→teal gradient).
3. **Export**: H.264, 30 fps, 1080×1920 portrait, .mov/.mp4.
4. **Upload** in App Store Connect under the version’s Media → App Previews (6.9" slot).
   The first frame becomes the poster — make sure it’s the clean Home screen.

> Tip: keep motion slow and deliberate. Fast scrolling reads as jittery at 30 fps
> and can trigger reviewer questions about hidden content.
