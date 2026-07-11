# Claws, Clots, and Cytokines — The Real Biology Behind Wolverine's Healing Factor

A ready-to-render **3-minute narrated explainer video** package: finalized
voiceover script, shot-by-shot visual prompts, and the locked art style —
built for the Higgsfield `video-explainer` pipeline (`nano_banana_pro` style
key → `gemini_omni` clips → `seed_audio` narration → server-side assembly).

> **Rendering is not done yet.** The connected Higgsfield workspace has
> 12.99 credits; 18 clips at 30 credits each (≈540 credits) plus narration
> and assembly exceed that balance. Everything below is ready to submit the
> moment credits are topped up — see [Rendering this package](#rendering-this-package).

## Original character, not Marvel's trademarked design

The video discusses Marvel's Wolverine by name in the narration (commentary
on a well-known fictional character), but the **on-screen character is an
original design** — a clawed, feral, healing-factor mutant in a red-and-black
outfit, not Marvel/Disney's exact trademarked costume, name-branding, or
likeness. This mirrors how this repo's own chess game uses "affectionate
interpretations" of Final Fantasy characters rather than copied art assets.

## Art style — 90s Marvel-style comic ink

Locked STYLE descriptor, pasted into every prompt below:

> bold 1990s Marvel-style comic book ink illustration, thick black contour
> linework, dynamic hatching and speed lines, gritty halftone dot shading,
> saturated primary color palette of reds yellows and blues, dramatic
> high-contrast comic-panel lighting, slight paper grain texture

**Style key image** (generated, `nano_banana_pro`, 16:9, job id
`bc327360-4031-47c9-b904-fe3d3b0332e5`):
https://d8j0ntlcm91z4.cloudfront.net/user_3FXkaaX6FQujj0bdoFO3BTKC32U/hf_20260711_210818_bc327360-4031-47c9-b904-fe3d3b0332e5.png

Character design used across every block: *a rugged, muscular clawed mutant
hero with wild spiky black hair, thick mutton-chop sideburns, three long
silver retractable claws per fist, a red-and-black tactical strap suit, and
faint golden bio-energy glow lines tracing his healing wounds.*

## Format

- **Length:** 3 minutes = 18 blocks × 10 seconds, server-assembled into one MP4.
- **Character:** mascot (the clawed hero appears throughout; Block 1 greets,
  Block 18 signs off — mouth never opens, no lip-sync).
- **Aspect:** 16:9 (standard YouTube landscape).
- **Subtitles:** off.
- **Language:** English.
- **Voice:** not yet picked — Phase 5 requires calling `list_voices` and
  having a human choose the narrator, then voicing all 18 blocks with that
  same voice.

---

## Narration script (18 blocks, one per 10s clip)

Each line lands ~7–9 seconds of speech, centered in its 10-second block.

```
Block 1
Marvel's Wolverine takes a shotgun blast to the chest, then lights a cigar two scenes later like nothing happened.

Block 2
It looks like magic, but almost every ingredient of that healing factor already exists inside your own body right now.

Block 3
Meet stem cells, flexible new hires that have not decided what job they want, ready to become almost any tissue.

Block 4
When tissue tears open, stem cells rush in and specialize into new muscle, new skin, new blood vessel walls.

Block 5
Your stem cells do this every single day, closing a cut over two weeks instead of two seconds.

Block 6
First responders arrive fast. Platelets clump at the wound and plug the leak within minutes, like emergency plywood.

Block 7
Those same platelets release a chemical burst that shouts for backup, kicking the entire repair operation into gear.

Block 8
Cytokines are the body's group chat, tiny proteins cells use to shout instructions across the injury site.

Block 9
One message says specialize into skin, another says grow new vessels, another calls in the immune system.

Block 10
New tissue is worthless without blood flow, so a signal called vascular endothelial growth factor calls in new plumbing.

Block 11
Nearby vessels sprout fresh branches toward the wound, delivering oxygen so the newly built tissue actually survives.

Block 12
Hormones fuel the whole project, redirecting energy and protein toward repair the way a company reroutes its entire budget.

Block 13
Stack all of it together and a wound that should take weeks closes in minutes, that is Wolverine's healing factor.

Block 14
None of this is fantasy. Bone marrow transplants already repopulate a patient's stem cells after severe illness today.

Block 15
Nature already builds real healing factors. Axolotls regrow entire limbs, and deer regrow antlers every single year.

Block 16
Even Wolverine's healing has limits. It still needs oxygen, raw material, and time measured in seconds, not zero.

Block 17
Rebuilding tissue this fast burns enormous fuel, which is why comic healing heroes always seem to eat like they are starving.

Block 18
The wildest part is the twist. You already employ Wolverine's exact construction crew, it just clocks out for the night.
```

---

## Shot-by-shot video prompts (18 blocks, `gemini_omni`, 10s each, 720p)

Every block reuses the style key image (job id
`bc327360-4031-47c9-b904-fe3d3b0332e5`) as its `medias` image reference.

```
Block 1
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: An original clawed mutant hero staggers backward from a fresh shotgun-blast wound on his chest, smoke curling from the impact, then straightens up with a confident smirk and gives a thumbs-up gesture toward camera, mouth closed.
MOTION: Quick comic-panel push-in on impact, then a settling hold on the thumbs-up pose, small radiating speed lines.
AUDIO: dramatic comic-book hit sound, low string stab, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 2
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: Camera pushes through the hero's chest wound into a stylized X-ray cutaway view, revealing glowing golden biological systems and pulsing cellular structures at work inside him.
MOTION: Slow dramatic push-in through the wound into the glowing interior, gentle pulsing light.
AUDIO: low electric hum, soft heartbeat pulse, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 3
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: Microscopic comic panel of small round glowing stem-cell characters with blank featureless faces, drifting weightlessly, each outlined with a soft shimmer showing they have not chosen a form yet.
MOTION: Gentle drifting float, cells slowly rotating in place, camera slow orbit.
AUDIO: soft shimmering chime, ambient hum, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 4
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: The glowing stem cells rush toward a torn wound edge and transform mid-flight into muscle fiber bundles, skin patches, and thin red vessel walls, each snapping into place like comic panel transitions.
MOTION: Fast directional rush toward the wound, sharp transformation snap-cuts, speed lines.
AUDIO: quick whoosh, comic transformation zap, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 5
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: Split comic panel: left side the mutant hero's wound sealing instantly in a flash of light, right side an ordinary civilian's small cut slowly scabbing over across a wall calendar with pages flipping.
MOTION: Static split-panel hold, calendar pages flip on the right side, light flash on the left.
AUDIO: soft page-flip flutter, faint sparkle on the flash side, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 6
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: Tiny disc-shaped platelet characters swarm and clump together over a bleeding wound edge like sandbags stacking, sealing the gap shut.
MOTION: Rapid swarming motion converging on the wound, stacking snap into place.
AUDIO: quick overlapping thud sounds, sealing hiss, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 7
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: The clumped platelets pulse and burst outward with a radiant starburst signal flare, golden light rays shooting outward across the tissue like a rallying call.
MOTION: Sudden radial burst outward from center, rays pulsing twice.
AUDIO: rising electric charge sound, bright ping burst, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 8
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: Dozens of small glowing speech-bubble-shaped particles zip rapidly between comic-style cell characters, crisscrossing like a chattering network of signals, no legible text inside the bubbles.
MOTION: Fast crisscrossing zips between cells, energetic chaotic movement.
AUDIO: quick electronic blips and chirps overlapping, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 9
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: Three glowing directive arrows shoot from a central signal hub toward three different cell types, each arrow striking home and causing that cell to transform — one into skin, one into a vessel, one into a spiky immune cell.
MOTION: Arrows launch in quick succession, each impact triggers a bright transformation flash.
AUDIO: three quick zap-impact sounds in sequence, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 10
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: A glowing beacon signal rises from oxygen-starved tissue and summons a wave of new pipe-like blood vessel branches, drawn like glowing plumbing conduits, extending toward the wound.
MOTION: Beacon pulses upward, then vessels extend and snake forward across the panel.
AUDIO: low rising drone, plumbing-pipe clank echo, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 11
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: Bright red glowing vessel tendrils branch and interconnect across newly formed tissue, pulsing with flowing golden light as they deliver energy into the healing wound.
MOTION: Branching growth animation, tendrils extending and pulsing with flowing light.
AUDIO: soft flowing whoosh, gentle pulse, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 12
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: The mutant hero stands in a dynamic action pose as golden hormone energy radiates off his entire body, muscles flexing, comic power-up aura lines bursting outward.
MOTION: Slow dramatic push-in on the power-up pose, radiating aura pulses outward twice.
AUDIO: rising power-up hum, bright chime crescendo, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 13
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: A rapid multi-panel comic montage shows the hero's wound sealing completely in flashes of light across several small panels, ending with him standing fully healed and confident.
MOTION: Fast montage cuts between panels, final panel holds on the standing hero.
AUDIO: quick succession of comic zap sounds building to a triumphant chime, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 14
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: A stylized comic panel of a lab scientist character holding a glowing vial marked with an abstract cross symbol, standing beside a patient's bed with softly glowing cell particles floating above it.
MOTION: Slow steady push-in on the glowing vial, gentle particle drift above the bed.
AUDIO: soft ambient lab hum, gentle chime, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 15
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: A stylized comic-book axolotl regrows a glowing new limb in one panel while beside it a deer regrows a full set of glowing antlers, both rendered as bold ink illustrations in a forest clearing.
MOTION: Gentle simultaneous regrowth animation on both creatures, soft glow pulses.
AUDIO: soft nature ambience, gentle magical shimmer, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 16
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: The mutant hero struggles underwater, bubbles streaming from his mouth, his healing glow flickering weakly as he strains against the current, showing his limits.
MOTION: Slow motion thrashing struggle, glow flickers on and off, bubbles rise.
AUDIO: muffled underwater rumble, faint distressed breathing, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 17
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: The hero sits at a comic diner table devouring an enormous stack of food, plates piling up around him, golden energy sparking faintly from his fork with every bite.
MOTION: Rapid comic-style eating motion, plates stacking higher, small spark flashes.
AUDIO: comic chomping and clattering plate sounds, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.

Block 18
STYLE REFERENCE: Match the attached reference image EXACTLY. Replicate its look precisely: bold 1990s Marvel-style comic book ink illustration, thick black contour linework, dynamic hatching and speed lines, gritty halftone dot shading, saturated primary color palette of reds yellows and blues, dramatic high-contrast comic-panel lighting, slight paper grain texture. Every element below rendered in that identical style.
SCENE: The healed mutant hero stands confidently, faint golden glow fading from his knuckles, and gives a firm nod and a two-finger salute toward camera, mouth closed, radiating comic speed lines behind him.
MOTION: Slow steady push-in on the salute pose, gentle glow fade, speed lines pulse once.
AUDIO: warm triumphant chime, soft fading hum, no voice.
NEGATIVE: color drift, photorealism, 3D render, lip-sync, captions, on-screen text, watermark, realistic human anatomy, exact copyrighted comic costume colors, official logos.
```

---

## Rendering this package

Once the Higgsfield workspace has enough credits (~600–700 to be safe:
18 clips × 30 credits + 18 narration takes + assembly), rendering is:

1. **Voice:** call `list_voices`, have a human pick one narrator voice
   (`voice_id` + `voice_type`), then call `generate_audio`
   (`model: seed_audio`) once per block with that same voice, using the
   Block N line above as the `prompt`.
2. **Clips:** call `generate_video` (`model: gemini_omni`, `duration: 10`,
   `resolution: "720p"`) once per block above, each with
   `medias: [{ value: "bc327360-4031-47c9-b904-fe3d3b0332e5", role: "image" }]`.
   Poll `job_display` on each returned job id until `status: "completed"`.
3. **Assemble:** call `explainer_video` with all 18 `{ video: <clip job id>,
   audio: <voice job id> }` pairs in order, `width: 1280`, `height: 720`.
   Poll the returned job id for the final MP4.

## Sources for the narration's factual claims

- Stem cell / tissue repair biology, cytokine signaling, platelet clotting
  cascade: standard cell biology / immunology (e.g. Alberts et al.,
  *Molecular Biology of the Cell*).
- VEGF and angiogenesis in wound healing: Bao et al., "The role of vascular
  endothelial growth factor in wound healing," *J Surg Res* (2009).
- Bone marrow transplantation as clinical hematopoietic stem cell therapy:
  standard oncology/hematology reference.
- Axolotl limb regeneration via blastema cells: Tanaka, "The Molecular and
  Cellular Choreography of Appendage Regeneration," *Cell* (2016).
- Annual deer antler regrowth as the fastest-growing mammalian tissue:
  standard wildlife biology reference.
