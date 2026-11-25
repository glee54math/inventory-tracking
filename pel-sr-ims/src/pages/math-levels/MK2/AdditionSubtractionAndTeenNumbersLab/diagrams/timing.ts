import { useCallback, useEffect, useRef, useState } from "react";
import { getState, sayText } from "../../../shared/tts/speechEngine";

// Count-along pace for this lab's pictures, matched to the read-aloud voice
// (about 1 second per item after a short lead-in), same as MK1, MG2 and MK4.
export const STEP_MS = { slow: 1300, normal: 1000, fast: 800 } as const;
export const LEAD_IN_MS = 1000;

/** Milliseconds per counted item at the student's read-aloud speed. */
export const stepMs = () => STEP_MS[getState().speed];

/** How long a count-along of `items` takes (for Step.showMeHoldMs). */
export const holdFor = (items: number) => LEAD_IN_MS + Math.max(1, items) * stepMs() + 200;

/** How many items are counted so far (0 up to `items`) while `active`; 0 otherwise. */
export function useCountAlong(active: boolean, items: number): number {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!active) return;
    const perMs = stepMs();
    let k = 0;
    let iv: number | undefined;
    const lead = window.setTimeout(() => {
      k = 1;
      setShown(1);
      iv = window.setInterval(() => {
        k = Math.min(items, k + 1);
        setShown(k);
        if (k >= items) window.clearInterval(iv);
      }, perMs);
    }, LEAD_IN_MS);
    return () => {
      window.clearTimeout(lead);
      window.clearInterval(iv);
      setShown(0);
    };
  }, [active, items]);
  return active ? Math.min(shown, items) : 0;
}

export interface WatchDemo {
  /** The demo is running; the controls stay held until it ends. */
  playing: boolean;
  /** Items shown so far (0 up to the demo's length). */
  tick: number;
  /** The demo has played to the end at least once. */
  seen: boolean;
  play: () => void;
  /** Stop and clear the picture (the student changed a number). */
  clear: () => void;
}

/**
 * One guided "Watch" demo in Explore: one item per second, each spoken by
 * `say` (return null for a silent beat). `seen` turns on when it ends.
 */
export function useWatch(items: number, say: (tick: number) => string | null): WatchDemo {
  const [playing, setPlaying] = useState(false);
  const [tick, setTick] = useState(0);
  const [seen, setSeen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const sayRef = useRef(say);
  useEffect(() => {
    sayRef.current = say;
  });
  useEffect(() => () => window.clearInterval(timer.current), []);

  const clear = useCallback(() => {
    window.clearInterval(timer.current);
    setPlaying(false);
    setTick(0);
  }, []);

  const play = useCallback(() => {
    window.clearInterval(timer.current);
    setPlaying(true);
    setTick(0);
    let k = 0;
    timer.current = window.setInterval(() => {
      k += 1;
      if (k > items) {
        window.clearInterval(timer.current);
        setPlaying(false);
        setSeen(true);
        return;
      }
      setTick(k);
      const line = sayRef.current(k);
      if (line) sayText(`mk2-watch-${k}-${Date.now()}`, line);
    }, stepMs());
  }, [items]);

  return { playing, tick, seen, play, clear };
}
