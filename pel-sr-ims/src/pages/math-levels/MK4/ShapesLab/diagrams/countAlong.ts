import { useEffect, useState } from "react";
import { getState } from "../../../shared/tts/speechEngine";
import { useTtsState } from "../../../shared/tts/ttsContext";

/**
 * "Count with me" timing for the "Show me" walk-throughs — one item lights
 * up (and gets its number) per spoken number, at the student's read-aloud
 * speed, same pacing as MK1's CounterGroup countAlong.
 */
const STEP_MS = { slow: 1300, normal: 1000, fast: 800 } as const;
// Wait for "Let's count together:" before the first item gets its number.
const LEAD_IN_MS = 1200;

/** Milliseconds a count-along of `count` items takes, for Step.showMeHoldMs
 *  (`count` can include beats of pause, e.g. a second shape's `startAfter`). */
export const countAlongMs = (count: number) => LEAD_IN_MS + count * STEP_MS[getState().speed];

/** How many items are counted so far (0 → count) while `active`; 0 otherwise.
 *  `startAfter` waits that many counting beats first — so a second shape can
 *  start its own count once the first one is finished. */
export function useCountAlong(active: boolean, count: number, startAfter = 0): number {
  const perMs = STEP_MS[useTtsState().speed];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    if (!active) return;
    let iv: number | undefined;
    const lead = window.setTimeout(() => {
      setShown(1);
      iv = window.setInterval(() => setShown((k) => (k >= count ? k : k + 1)), perMs);
    }, LEAD_IN_MS + startAfter * perMs);
    return () => {
      window.clearTimeout(lead);
      window.clearInterval(iv);
    };
  }, [active, count, perMs, startAfter]);
  return active ? shown : 0;
}

/** Spoken/written "Show me" line for a count-along: "Let's count together: 1, 2, 3. That's 3 sides." */
export const countAlongText = (n: number, noun: string) =>
  n === 0 ? `There are no ${noun} to count. That is zero.` : `Let's count together: ${Array.from({ length: n }, (_, i) => i + 1).join(", ")}. That's ${n} ${noun}.`;
