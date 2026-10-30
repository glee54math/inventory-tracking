import { palette } from "../../../shared/lib/palette";

export interface UnequalPartsBarProps {
  /** Relative widths of each part, left to right — e.g. [1, 1, 1, 1] is four
   *  EQUAL parts (same as shared FractionBar), but [1, 2, 0.5, 1.5] is four
   *  parts that are NOT the same size. Only the ratios between entries
   *  matter; they're normalized to fill `width` either way. */
  segments: number[];
  /** Which segments (0-indexed) are shaded. */
  shadedIndices: number[];
  width?: number;
  height?: number;
  label?: string;
}

/** True when every segment is (within floating-point tolerance) the same
 *  size — the single fact this whole diagram exists to make visible, and
 *  the SAME check Unit 1's practice/test generators use to decide whether a
 *  picture is a valid fraction picture at all. Shared here so the caption
 *  and the grading logic can never disagree about what counts as "equal." */
export function segmentsAreEqual(segments: number[]): boolean {
  if (segments.length === 0) return true;
  const first = segments[0];
  return segments.every((s) => Math.abs(s - first) < 1e-6);
}

/**
 * A bar split into `segments.length` parts whose WIDTHS can differ — the
 * non-example picture for Unit 1's "equal parts is the rule, not just
 * 'some parts are shaded'" trap bucket. Deliberately a separate component
 * from shared/diagrams/FractionBar.tsx rather than a generalization of it:
 * FractionBar's entire contract (and every existing caller across the app)
 * assumes `denominator` equal cells, so adding unequal-width support there
 * would mean auditing every caller's assumption instead of touching none of
 * them. First consumer of "unequal parts" visuals anywhere in this app, so
 * this stays lab-local rather than promoted (see
 * VISUAL_COMPONENT_TODO.txt's MG6 FractionsFoundationsLab entry).
 */
export function UnequalPartsBar({ segments, shadedIndices, width = 320, height = 64, label }: UnequalPartsBarProps) {
  const total = segments.reduce((a, b) => a + b, 0);
  let x = 0;
  const equal = segmentsAreEqual(segments);

  return (
    <svg viewBox={`0 0 ${width} ${height + (label ? 22 : 0)}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={label ?? `a whole split into ${segments.length} parts of different sizes`}>
      {segments.map((seg, i) => {
        const w = (seg / total) * width;
        const rect = (
          <rect
            key={i}
            x={x}
            y={0}
            width={w}
            height={height}
            style={{
              fill: shadedIndices.includes(i) ? palette.a : palette.paper,
              fillOpacity: shadedIndices.includes(i) ? 0.85 : 1,
              stroke: palette.line,
              strokeWidth: 1,
            }}
          />
        );
        x += w;
        return rect;
      })}
      <rect x={0} y={0} width={width} height={height} style={{ fill: "none", stroke: equal ? palette.ink : palette.bad, strokeWidth: 2 }} />
      {label && (
        <text x={width / 2} y={height + 16} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
          {label}
        </text>
      )}
    </svg>
  );
}
