import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { WatchDemo } from "../diagrams";

/** The big "Watch" button that plays an Explore's one guided demo. */
export function WatchButton({ demo, label = "Watch" }: { demo: WatchDemo; label?: string }) {
  return (
    <button type="button" className="btn primary big" style={{ width: "fit-content" }} disabled={demo.playing} onClick={demo.play}>
      {demo.playing ? "Watch and listen" : demo.seen ? "Watch again" : `▶ ${label}`}
    </button>
  );
}

/** Explore controls: held (gray) while the demo plays. */
export function HeldControls({ held, children }: { held: boolean; children: ReactNode }) {
  return (
    <fieldset disabled={held} style={{ border: 0, padding: 0, margin: 0, minWidth: 0, opacity: held ? 0.55 : 1 }}>
      <div className="control-row" data-readaloud-part>
        {children}
      </div>
    </fieldset>
  );
}

const roundKey = (unit: string) => `mk2-check-round:${unit}`;

/** The fixed question set (0 or 1) a repeating Check will use next. */
export function readCheckRound(unit: string): 0 | 1 {
  try {
    return Number(window.localStorage.getItem(roundKey(unit)) ?? 0) % 2 === 1 ? 1 : 0;
  } catch {
    return 0;
  }
}

/**
 * Which fixed set of questions a repeating Check uses (0 or 1). Each pass moves
 * to the other set, so a re-check isn't the same screen from memory.
 */
export function useCheckRound(unit: string, onComplete?: () => void): { round: 0 | 1; finish: () => void } {
  const [round] = useState<0 | 1>(() => readCheckRound(unit));
  const latest = useRef(onComplete);
  useEffect(() => {
    latest.current = onComplete;
  });
  const finished = useRef(false);
  // Stable, and acts once: CheckSequence calls it again if its identity changes.
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      window.localStorage.setItem(roundKey(unit), String(round + 1));
    } catch {
      // Private mode: the first set simply repeats.
    }
    latest.current?.();
  }, [unit, round]);
  return { round, finish };
}
