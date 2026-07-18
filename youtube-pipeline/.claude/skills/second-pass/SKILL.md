---
name: second-pass
description: Step 4 of the YouTube pipeline (manual). Prepares a review packet for the human reviewer and applies incremental re-composites based on their notes. Do not run this skill autonomously to approve a job — it exists to assist the human review, not replace it.
---

# Second pass (manual)

Step 4 of 7. **This step is a human checkpoint, not something Claude does on its
own.** The diagram marks it manual for a reason: someone (Jason) needs to actually
look at the graphics cut before it moves on to captions/music/export.

## What Claude does here

1. **Prepare the review packet.** After `graphics-plan` produces `composite.mp4`,
   surface it to the reviewer (send the file, or point at its path) along with
   `graphics/graphics-plan.json` so they can see what was planned, not just the
   render.
2. **Wait for notes.** Do not proceed to `embedded-captions` / `background-music` /
   `finalize` until the reviewer has actually responded. If asked to "just finish the
   job," push back and ask for sign-off on this step first, unless the user
   explicitly says to skip review for this job.
3. **Apply incremental re-composite.** When notes come back ("card 3 is on screen
   too long," "swap this beat's copy"), edit `graphics/graphics-plan.json` for just
   the affected beats and re-invoke the HyperFrames render for the changed segments
   only — don't re-plan or re-render the whole job from scratch. Update
   `composite.mp4`.
4. Loop step 2-3 until the reviewer approves.
5. Update `job.json.status` to `"reviewed"` once approved, and record who approved it
   and when.

## Next step

Hand off to `embedded-captions` (step 5) if the format calls for burned-in captions,
otherwise skip straight to `background-music` (step 6, optional) or `finalize`
(step 7).
