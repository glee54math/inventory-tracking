import { NumberLine } from "../../../shared/diagrams";

export interface StackedNumberLinesProps {
  n1: number;
  d1: number;
  n2: number;
  d2: number;
}

/**
 * Two 0-to-1 number lines stacked at the SAME width — the top one ticked in
 * d1ths with n1/d1 marked, the bottom in d2ths with n2/d2 marked. Because
 * both are the shared NumberLine over the identical [0, 1] range, their x
 * scales are identical, so "same point" reads as "one dot directly above the
 * other." Used instead of two points on ONE line, where an equivalent pair's
 * labels would be drawn on top of each other at the same x and become
 * unreadable (the longest case, e.g. "3/4" over "6/8", fully overlaps).
 */
export function StackedNumberLines({ n1, d1, n2, d2 }: StackedNumberLinesProps) {
  return (
    <div role="img" aria-label={`${n1}/${d1} on one number line, ${n2}/${d2} on another`} style={{ display: "grid", gap: 2 }}>
      <NumberLine min={0} max={1} minorTicksPerUnit={d1} points={[{ value: n1 / d1, label: `${n1}/${d1}`, tone: "a" }]} />
      <NumberLine min={0} max={1} minorTicksPerUnit={d2} points={[{ value: n2 / d2, label: `${n2}/${d2}`, tone: "c" }]} />
    </div>
  );
}
