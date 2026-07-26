---
format: 1920x1080
duration: 62s
message: "Ketosis is a real, physiologically achievable state where your body burns fat for fuel instead of sugar — and it even fuels your brain — told with jokes, not just diagrams."
arc: concept-explainer with process
audience: general public, 8th-grade reading level
mode: autonomous
music: none
---

## Video direction

- **Palette system** (from `frame.md`, Daisy Days): cream + rotating saturated pastels
  (sky / butter / mint / soft-pink / peach / turquoise / lavender), one surface per frame, coral
  reserved as a small accent marker only. Frame 1 (hook) and Frame 10 (landing) both use **sky** as
  a deliberate color bookend for the video. No ninth color; charcoal outlines + hard offset shadows
  everywhere (Daisy Days' sticker-on-paper signature) instead of the earlier flat-poster look.
- **Cast of recurring characters** (the invented, hand-drawn-style cast that carries the comedy):
  a round, wide-eyed **body-blob** mascot (Frames 1, 2, 10); a tired-then-relieved **liver blob**
  with a face (Frames 3, 6); a bouncy **insulin hexagon** with a face (Frame 4); three googly-eyed
  **fat-cell** characters (Frames 5, 7) plus a mustached **bouncer** icon; a grinning **ketone
  diamond** trio (Frame 6); a winking **bathroom-scale** character (Frame 7); a sprinting
  **running-shoe** character and a flexing **muscle** character (Frame 8); a fairy-light-eyed
  **brain** character (Frames 6, 9, 10). Every character keeps the same charcoal 3px outline +
  simple dot eyes + one expression change per beat — cheap, consistent, and funny.
- **Motion grammar + reveal model:** smooth long-tail `power3` settles are the default, exactly as
  the motion doctrine requires — BUT this is an explicitly comedic, playful piece, so 2-3 marked
  "joke beats" per video (a character pop, a comedic "poof," a wink) are allowed the doctrine's
  named exception: a light `spring-pop-entrance` overshoot, used sparingly and never as the default
  entrance. Every frame still reveals paced to the voiceover — nothing appears before its cue.
- **Rhythm / held-frame allocation:** Frames 2, 7, and 10 are the deliberate breather/held beats
  (concept-name landing, the weight-loss punchline, and the closing line) — each resolves early and
  holds. All other frames build progressively, timed to the joke landing in the line.
- **Stage continuity:** the liver character (Frame 3) and the fat-cell trio (Frame 5) are callbacks
  that physically return in Frames 6 and 7 rather than being redrawn, so the story reads as one
  continuous cartoon, not unrelated stickers. The brain (introduced in Frame 6) returns as the hero
  in Frame 9, then joins the body-blob and muscle character in Frame 10's closing lineup.
- **Negative list:** no photorealism or stock photography of any kind (the "basic pictures →
  colorful/vivid" request is met entirely through this hand-drawn sticker-book system, never real
  photos); no attempt to imitate any specific named studio's copyrighted art style; no blurred or
  `rgba` shadows (Daisy Days is hard-offset only); no glyph bullets; no empty corners (ornament
  wreath fills them); no lazy breathing; no slow pan/push in a frame's back half; no infinite loops;
  overshoot/spring-pop stays a rare marked exception, never the default ease.

## Frame 1 — Hook

- scene: A wide-eyed, googly little body-blob character looks around, surprised, on a sunny-sky background, as the headline burns in above it.
- voiceover: "Ever wonder how your body can go from hangry to a full-on fat-burning furnace?"
- duration: 4.288s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Rhetorical question (comedic framing)
- beat: curiosity and amusement
- blueprint: kinetic-type-beats (Adapt)
- focal: the body-blob mascot + the headline
- roles: body-blob mascot = foreground subject (introduced here, returns in Frames 2 and 10) · Fredoka headline (white, charcoal text-shadow) = foreground subject · sun + cloud ornaments = supporting (ornament wreath)

narrativeRole: Opens the curiosity gap with a joke, not a lecture — the body has a secret fuel mode.
keyMessage: Your body can flip into a totally different, fat-burning fuel mode.

Adapt: keep kinetic-type-beats' word-landing signature; the usual brand payoff becomes the body-blob mascot's surprised reaction instead.

Scene 1 (0.0–1.6s): sky-blue saturated ground; 2-3 hand-drawn sun/cloud ornaments crop in at the corners (`svg-path-draw`); the body-blob mascot (a round charcoal-outlined pastel-cream shape, two dot eyes, no mouth yet) sits centered-low, still, as the VO opens.
Scene 2 (1.6–3.4s): as the VO says "hangry to a full-on fat-burning furnace," the mascot's face flips to a wide "!" surprised expression (in-place token swap on the mouth/eyebrow shapes) and a tiny cartoon flame pops into its tummy via one marked `spring-pop-entrance` (playful exception) — comedic beat #1; simultaneously the Fredoka headline builds in above via per-word staggered reveal (`dynamic-content-sequencing`), white with 3px charcoal text-shadow, Centered ~55% of frame.
Scene 3 (3.4–5.0s): headline + mascot hold; the tummy-flame has one low-amplitude live-SVG flicker (`svg-icon-enrichment`) as the only aliveness — no further motion.

## Frame 2 — Name it: ketosis

- scene: The body-blob mascot gives a confident thumbs-up on a sunny butter-yellow background as the word "ketosis" locks in.
- voiceover: "That's ketosis, and no, it's not magic — it's just chemistry showing off."
- duration: 4.139s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-name-ketosis.html
- type: product_intro
- persuasion: Concept announcement (deadpan punchline)
- beat: clarity and amusement
- blueprint: kinetic-type-beats (Adapt)
- focal: the word "ketosis"
- roles: "ketosis" Fredoka display = foreground subject · body-blob mascot (callback, now with arms + thumbs-up) = supporting · star/daisy ornaments = supporting (wreath)

narrativeRole: Names the concept and deflates the "magic/fad" assumption with a joke, in one breath.
keyMessage: Ketosis is a real, physiologically achievable state — not magic, not a fad.

Adapt: the usual "Introducing…" name-drop resolves on the term itself; ground switches to butter as the punctuation beat (this is one of the video's breather beats).

Scene 1 (0.0–1.2s): hard cut to butter-yellow saturated ground, ornament wreath (stars + a daisy) crops in at the corners; the body-blob mascot (callback, small, left) sits still as the VO's line begins.
Scene 2 (1.2–2.6s): as the VO says "that's called ketosis" (er — "that's ketosis"), the word locks in via `scale-swap-transition` at Fredoka `display` scale, white with charcoal text-shadow, Centered ~55% of frame, smooth `power3` settle.
Scene 3 (2.6–4.5s): as the VO lands "chemistry showing off," the mascot's arm pops up into a thumbs-up (one marked `spring-pop-entrance`, comedic beat #2) and holds; everything else holds still.

## Frame 3 — Carbs down, glycogen down

- scene: A tired-looking liver-blob character wears a little fuel-gauge dial around its neck labeled "glycogen," which drains toward empty.
- voiceover: "Eat fewer carbs, and your liver's sugar stash — glycogen — empties out faster than free snacks at a meeting."
- duration: 6.4s
- transition_in: push-slide RIGHT
- status: animated
- src: compositions/frames/03-glycogen.html
- type: feature_showcase
- persuasion: Causal chain (A leads to B) + comedic analogy
- beat: comprehension and amusement
- blueprint: compose
- focal: the liver-blob character + its glycogen fuel-gauge dial
- roles: liver-blob character = foreground subject (introduced here, callback in Frame 6) · fuel-gauge dial = supporting · cream ground + ornament wreath = background/supporting

narrativeRole: First link in the mechanism chain, landed as a joke about free snacks disappearing fast.
keyMessage: Eating fewer carbs drains the liver's glycogen stores.

Compose: no product blueprint fits a physiological gauge; built from bars/progress-fill + SVG-draw, with a googly-eyed character carrying the gauge instead of a plain icon.

Scene 1 (0.0–2.0s): cream ground, light ornament wreath (a couple of stars); the liver-blob character (rounded charcoal-outlined mint shape, dot eyes, small worried mouth) draws itself in upper-left (`svg-path-draw`) — asymmetric 60/40, character left / open caption rail right.
Scene 2 (2.0–4.0s): as the VO says "your liver's sugar stash — glycogen," a small circular dial appears around the character's neck labeled "glycogen" (layer-reveal), needle at full.
Scene 3 (4.0–7.0s): as the VO delivers "empties out faster than free snacks at a meeting," the dial's needle sweeps toward empty (`stat-bars-and-fills`, `power3` long-tail) while the character's expression droops a little more; settles and holds.

## Frame 4 — Insulin drops

- scene: A bouncy hexagon "insulin" character, holding a tiny drooping "SAVE EVERYTHING" sign, shrinks and looks sleepy.
- voiceover: "That drop makes insulin, the hormone whose whole job is \"save everything,\" chill out and drop too."
- duration: 5.525s
- transition_in: push-slide RIGHT
- status: animated
- src: compositions/frames/04-insulin.html
- type: feature_showcase
- persuasion: Causal chain (A leads to B) + comedic personification
- beat: comprehension and amusement
- blueprint: compose
- focal: the insulin-hexagon character
- roles: insulin-hexagon character = foreground subject · tiny "SAVE EVERYTHING" sign = supporting · dimmed glycogen-dial callback in the corner = supporting (stage continuity)

narrativeRole: Second link — low glycogen means the fat-storage hormone, personified as an over-eager hoarder, also chills out.
keyMessage: Low glycogen means low insulin, the hormone that stores fat.

Compose: built from a value-scaled shrink + SVG-draw; the personified sign is the joke's payload.

Scene 1 (0.0–1.8s): mint ground continues the stage; a bouncy fire-orange-turned-mint hexagon "insulin" character (charcoal outline, dot eyes, small confident grin, holding a tiny pennant sign) draws itself in center (`svg-path-draw`) — Centered ~45% of frame; the drained glycogen dial from Frame 3 sits small and dim in the corner as a callback.
Scene 2 (1.8–3.8s): as the VO says "the hormone whose whole job is 'save everything,'" the sign's text reveals ("SAVE EVERYTHING," Fredoka label, layer-reveal).
Scene 3 (3.8–6.0s): as the VO lands "chill out and drop too," the hexagon character shrinks in scale, its grin fades to sleepy half-closed eyes, and the sign droops/wilts (a value-scaled shrink, `power3` settle); holds still, no further motion.

## Frame 5 — Fat cells release fat

- scene: Three googly-eyed fat-cell characters fling open little hatches and comically launch droplet-characters into the bloodstream while a mustached bouncer icon steps aside.
- voiceover: "Low insulin is like a bouncer stepping aside — fat cells fling the doors open and dump stored fat into your blood."
- duration: 6.933s
- transition_in: push-slide RIGHT
- status: animated
- src: compositions/frames/05-fat-release.html
- type: feature_showcase
- persuasion: Causal chain (A leads to B) + Analogy (the "bouncer")
- beat: comprehension and delight
- blueprint: compose
- focal: the row of fat-cell characters + the bouncer icon
- roles: fat-cell character trio = foreground subject (callback in Frame 7) · bouncer icon = supporting (the analogy's visual punchline) · bloodstream hairline = supporting

narrativeRole: Third link, told as the "bouncer stepping aside" analogy the VO names.
keyMessage: Low insulin lets fat cells release stored fat into the blood.

Compose: built from cluster→outward expansion + a per-element stagger; the bouncer icon is the analogy made literal, which is the joke.

Scene 1 (0.0–1.8s): soft-pink ground; a small mustached, bow-tied circular "bouncer" icon draws in on the left (`svg-path-draw`) as the VO says "bouncer stepping aside."
Scene 2 (1.8–2.8s): the bouncer character steps aside (a short lateral slide, `power3`) — as it clears the frame, three googly-eyed fat-cell characters (charcoal-outlined pastel circles, wide eyes) cluster in at center via `center-outward-expansion`, evenly spaced — full-width strip.
Scene 3 (2.8–5.5s): as the VO says "fling the doors open and dump stored fat," each fat-cell character's little hatch pops open in sequence and comically launches one droplet-character outward (one marked `spring-pop-entrance` per droplet, staggered, never simultaneous) — sequential comedic beats.
Scene 4 (5.5–7.5s): as the VO lands "into your blood," the droplets land on a thin coral-accented hairline beneath the row — the "bloodstream" line (`svg-path-draw`); holds still.

## Frame 6 — Liver makes ketones

- scene: The liver-blob character (now grinning like a chef) catches the fat droplets, stamps them into shiny diamond ketone tokens, and tosses them to a grinning brain character and a flexing muscle character.
- voiceover: "Your liver scoops up all that fat and cooks it into ketones — basically premium fuel for your brain and muscles, no sugar required."
- duration: 7.765s
- transition_in: push-slide RIGHT
- status: animated
- src: compositions/frames/06-ketones.html
- type: feature_showcase
- persuasion: Causal chain (culmination) + comedic personification ("chef" liver)
- beat: comprehension, "aha," and delight
- blueprint: compose
- focal: the liver-blob character stamping droplets into ketone tokens
- roles: liver-blob character (callback, now grinning) = foreground subject · ketone-diamond tokens = supporting · brain character (introduced here, hero of Frame 9) + muscle character (introduced here, callback in Frame 8) = supporting

narrativeRole: Culminates the mechanism chain, told as the liver "cooking" — the payoff product fuels brain and muscle.
keyMessage: The liver turns released fat into ketones — fuel for brain and muscle.

Compose: closest in spirit to a morph-handoff (`scale-swap-transition`) for the fat-to-ketone conversion, staged as a comedic "chef" beat.

Scene 1 (0.0–2.2s): cream ground; the liver-blob character from Frame 3 returns centered (callback, no redraw) with its expression flipped from worried to a big chef-like grin (a tiny chef-hat ornament pops on, one marked `spring-pop-entrance`); the bloodstream droplets (callback from Frame 5) drift in from the left toward it via layer-reveal.
Scene 2 (2.2–5.0s): as the VO says "cooks it into ketones," each droplet reaching the liver hands off via `scale-swap-transition` into a small shiny diamond "ketone" token with a little sparkle, one per beat — the signature handoff move, never simultaneous.
Scene 3 (5.0–8.0s): as the VO says "premium fuel for your brain and muscles, no sugar required," two thin dotted arrows draw themselves (`svg-path-draw`) from the ketone cluster to a small grinning brain character (right) and a small flexing-bicep muscle character (far right), landing as the hero trio, dead-center weighting; holds still, subtle jitter only.

## Frame 7 — The weight-loss payoff

- scene: The fat-cell character row visibly deflates with comedic little "poof" sparkles while a winking bathroom-scale character's needle drops.
- voiceover: "Less carbs, less insulin, shrinking fat cells — that combo right there is the actual weight-loss plot twist."
- duration: 6.165s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-weight-loss.html
- type: benefit_highlight
- persuasion: Distillation + comedic payoff framing ("plot twist")
- beat: confidence and satisfaction
- blueprint: dataviz-countup (Adapt)
- focal: the shrinking fat-cell row + the winking scale character
- roles: fat-cell character trio (callback, now shrinking) = foreground subject · winking scale character = supporting

narrativeRole: States the "so what" as a punchline — the mechanism just shown IS the weight-loss link.
keyMessage: Lower carbs and lower insulin shrink fat tissue and support weight loss.

Adapt: dataviz-countup's hero-metric push stands in for a comedic count-DOWN — the deflating fat-cell row and a winking scale are the "metric." This is one of the video's breather beats.

Scene 1 (0.0–2.2s): peach ground; the fat-cell character trio callback from Frame 5 sits at its prior size, static, as the VO opens the line.
Scene 2 (2.2–4.5s): as the VO says "shrinking fat cells," each character deflates in place, one after another, with a tiny comedic "poof" sparkle burst on each (a value-scaled shrink in reverse + one marked `spring-pop-entrance` sparkle, `power3` long-tail on the shrink itself) — sequential per character.
Scene 3 (4.5–6.5s): as the VO lands "the actual weight-loss plot twist," a simple winking bathroom-scale character draws in beside the shrunken row (`svg-path-draw`) and its needle settles low with a little wink animation; everything holds still as the breather beat.

## Frame 8 — Add exercise

- scene: A bouncy running-shoe character sprints in place while a flexing muscle character winks and pops out a "lactate" droplet character.
- voiceover: "Now toss in a workout. Your muscles start pumping out lactate like it's getting paid overtime."
- duration: 5.248s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-exercise-lactate.html
- type: feature_showcase
- persuasion: Signposting + new causal branch + comedic analogy ("paid overtime")
- beat: anticipation and amusement
- blueprint: compose
- focal: the running-shoe character
- roles: running-shoe character = foreground subject · muscle character (callback from Frame 6) + lactate droplet character = supporting

narrativeRole: Pivots to a second track — exercise adds a brain-health mechanism on top of ketosis, told as a workplace joke.
keyMessage: Exercise makes muscles produce lactate.

Compose: built from a spring-pop entrance + SVG-draw; the muscle character here is the same callback introduced in Frame 6, now the source of Frame 9's lactate droplet.

Scene 1 (0.0–1.8s): turquoise ground; a bouncy running-shoe character (a few flat charcoal-outlined shapes with tiny motion lines) hops in from the left edge and settles mid-frame via one marked `spring-pop-entrance` (comedic beat) as the VO says "now toss in a workout."
Scene 2 (1.8–5.5s): as the VO says "muscles start pumping out lactate like it's getting paid overtime," the flexing muscle character (callback from Frame 6) winks and pops out one orange-accented droplet character labeled "lactate" (`svg-path-draw` + a short comedic rise); holds.

## Frame 9 — Lactate boosts BDNF

- scene: The lactate droplet character rides a tiny rocket-trail up into a big grinning brain character whose fairy-light neuron squiggles switch on one by one; a small citation chip sits in the corner.
- voiceover: "That lactate zooms straight to your brain and cranks up BDNF — a protein that basically waters your brain cells so they grow stronger connections."
- duration: 8.533s
- transition_in: push-slide RIGHT
- status: animated
- src: compositions/frames/09-bdnf.html
- type: social_proof
- persuasion: Citation/source + Causal chain + comedic image ("waters your brain cells")
- beat: fascination, amusement, and confidence
- blueprint: compose
- focal: the brain character with lighting neuron squiggles
- roles: lactate droplet character (callback from Frame 8) = supporting · brain character (callback from Frame 6, now hero) = foreground subject · citation chip = supporting/chrome

narrativeRole: Grounds the brain claim in real evidence, landed with the "waters your brain cells" joke.
keyMessage: Lactate crosses into the brain and boosts BDNF, helping brain cells grow stronger connections.

Compose: built from SVG-draw + live-SVG-internals for the neuron squiggles; the citation chip keeps the joke honest.

Scene 1 (0.0–2.5s): lavender ground; the lactate droplet character from Frame 8 rides a small dotted rocket-trail upward (`svg-path-draw`) toward the brain character (callback from Frame 6, now drawn larger as the grinning hero) on the right, as the VO says "that lactate zooms straight to your brain."
Scene 2 (2.5–6.0s): as the VO says "cranks up BDNF... waters your brain cells," thin fairy-light neuron squiggles inside the brain character light up one by one, each with a tiny "sparkle" pop (`svg-icon-enrichment`, per-element stagger, one marked `spring-pop-entrance` on the very first squiggle only) — never simultaneous.
Scene 3 (6.0–9.0s): as the VO lands "grow stronger connections," a small mono citation chip ("El Hayek et al., 2019") fades in at the bottom corner; the grinning brain holds still with only its neuron-squiggles pulsing faintly (`svg-icon-enrichment`, low amplitude) as the sanctioned aliveness.

## Frame 10 — Landing

- scene: The body-blob mascot, brain character, and muscle character line up together, high-fiving, as the closing punchline locks in on a sunny-sky background.
- voiceover: "Real science, real fuel, one seriously overachieving body."
- duration: 3.925s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-landing.html
- type: branding
- persuasion: Distillation + Callback
- beat: triumphant and delighted
- blueprint: kinetic-type-beats (Adapt)
- focal: the closing line "real science, real fuel, one seriously overachieving body."
- roles: closing headline = foreground subject · body-blob + brain + muscle character lineup (callbacks) = supporting

narrativeRole: Lands the thesis as one last joke — the whole chain compresses to one proud, funny closing line.
keyMessage: Diet and movement work together to fuel your body and your brain.

Adapt: a relaxed full-frame beat relay terminating in a long-held closing line; sky ground bookends Frame 1's opening color. This is the video's true exit.

Scene 1 (0.0–1.3s): sky-blue saturated ground, full ornament wreath (sun, clouds, stars); the body-blob mascot (Frame 1/2 callback), brain character (Frame 9 callback), and muscle character (Frame 6/8 callback) line up in a row at the top third via `center-outward-expansion`, settling evenly spaced with one shared comedic high-five pose (one marked `spring-pop-entrance` on the high-five landing).
Scene 2 (1.3–2.5s): as the VO delivers "real science, real fuel," the closing line builds beneath the character row via per-word staggered reveal (`dynamic-content-sequencing`), each clause landing on its own beat.
Scene 3 (2.5–3.5s): as the VO lands "one seriously overachieving body," the line holds dead-center at full display scale — the video's true exit; a restrained fade begins only in the final ~0.3s (the one frame allowed a real exit).
