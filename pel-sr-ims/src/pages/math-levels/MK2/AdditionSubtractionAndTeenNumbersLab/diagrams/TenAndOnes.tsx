import { TenFrame } from "./TenFrame";
import { useCountAlong } from "./timing";

export interface TenAndOnesProps {
  /** 0 or 1: this lab only ever shows a single ten. */
  tens: 0 | 1;
  /** 0-9 ones, drawn in a second ten-frame. */
  ones: number;
  tenTone?: "a" | "b" | "c";
  onesTone?: "a" | "b" | "c";
  /** Filled boxes in the first frame, for a "Build it" demo. Default: all 10. */
  tenFilled?: number;
  /** Number the ten's dots 1 to this many (a demo). */
  tenNumbered?: number;
  /** Number this many ones at once, counting on from 10 (a demo). */
  onesNumbered?: number;
  /** Count on from 10 over the ones, one per second ("Show me"). */
  countOn?: boolean;
  /** Number the ones 1, 2, 3 one per second ("Show me": how many ones?). */
  countOnes?: boolean;
  /** Outline the ones frame, to point at it after a wrong try. */
  ringOnes?: boolean;
  /** Draw the ones frame empty with a "?": the ones are what is asked. */
  unknownOnes?: boolean;
}

/** A teen number as one full ten-frame (the ten) plus a second ten-frame
 *  holding the ones in another color, so 16 reads as a full frame and 5 + 1. */
export function TenAndOnes({ tens, ones, tenTone = "a", onesTone = "b", tenFilled, tenNumbered = 0, onesNumbered, countOn = false, countOnes = false, ringOnes = false, unknownOnes = false }: TenAndOnesProps) {
  const onesCount = Math.max(0, Math.min(9, Math.round(ones)));
  const counted = useCountAlong(countOn || countOnes, onesCount);
  const labelCount = countOn || countOnes ? counted : (onesNumbered ?? 0);
  const base = countOnes ? 0 : 10;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
      {tens === 1 && (
        <div style={{ flex: "1 1 200px", maxWidth: 238 }}>
          <TenFrame filled={tenFilled ?? 10} tone={tenTone} numberCount={tenNumbered} />
        </div>
      )}
      <div
        style={{
          flex: "1 1 200px",
          maxWidth: 238,
          borderRadius: 12,
          outline: ringOnes ? "3px solid var(--qc)" : undefined,
          outlineOffset: 2,
          position: "relative",
        }}
      >
        <TenFrame filled={unknownOnes ? 0 : onesCount} tone={onesTone} numberCount={unknownOnes ? 0 : labelCount} numberBase={base} />
        {unknownOnes && (
          <span aria-label="How many ones?" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, color: `var(--q${onesTone})` }}>
            ?
          </span>
        )}
      </div>
    </div>
  );
}
