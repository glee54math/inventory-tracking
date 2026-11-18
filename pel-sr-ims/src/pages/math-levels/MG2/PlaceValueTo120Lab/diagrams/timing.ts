import { getState } from "../../../shared/tts/speechEngine";

// Count-along pace for this lab's pictures, matched to the read-aloud voice
// (about 1 second per item, after a short lead-in) — the same pacing as MK1's
// CounterGroup. Kept out of the component files so they export components only.
export const STEP_MS = { slow: 1300, normal: 1000, fast: 800 } as const;
export const LEAD_IN_MS = 1000;
/** Milliseconds per counted item at the student's read-aloud speed. */
export const countStepMs = () => STEP_MS[getState().speed];
/** How long a count-along of `items` takes (for Step.showMeHoldMs). */
export const countAlongMs = (items: number) => LEAD_IN_MS + Math.max(1, items) * countStepMs();
/** How long the "make a new ten" slide takes. */
export const BUNDLE_MS = 2200;
