import { palette, diagramFont } from "../../../shared/lib/palette";

export interface LinePlotProps {
  /** Raw measured values, one entry per data point (duplicates are the
   *  whole point — e.g. three different pencils all measuring 4 inches
   *  stack as three separate X's above the "4" tick, not one). */
  values: number[];
  min: number;
  max: number;
  unitLabel?: string;
  tone?: "a" | "b" | "c";
}

const toneFill = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/**
 * A line plot (2.MD.9) — distinct from NumberLineMD.tsx: this diagram's
 * whole point is FREQUENCY (how many data points landed on each value, each
 * drawn as its own stacked mark) rather than a single position or a
 * sum/difference jump. Deliberately kept as its own component rather than a
 * variant of NumberLineMD, per this lab's own build notes, even though both
 * are a horizontal tick-marked axis — the stacking logic below has no
 * equivalent in NumberLineMD and would only clutter it.
 */
export function LinePlot({ values, min, max, unitLabel, tone = "a" }: LinePlotProps) {
  const PAD = 20;
  const AXIS_Y = 140;
  const unitPx = Math.min(44, (760 - PAD * 2) / (max - min));
  const width = PAD * 2 + (max - min) * unitPx;
  const fill = toneFill(tone);

  // Count how many values landed on each whole-number tick, so each one
  // stacks its own column of marks — the direct visual tell that repeated
  // marks at the same value mean MULTIPLE data points, not one.
  const counts: Record<number, number> = {};
  for (const v of values) counts[v] = (counts[v] ?? 0) + 1;

  return (
    <svg
      viewBox={`0 0 ${width} ${AXIS_Y + 50}`}
      role="img"
      aria-label={`A line plot from ${min} to ${max}${unitLabel ? " " + unitLabel : ""}, with ${values.length} data points: ${Object.entries(counts)
        .map(([v, c]) => `${c} at ${v}`)
        .join(", ")}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      <line x1={PAD} y1={AXIS_Y} x2={width - PAD} y2={AXIS_Y} stroke={palette.ink} strokeWidth={2} />
      {Array.from({ length: max - min + 1 }, (_, i) => {
        const v = min + i;
        const x = PAD + i * unitPx;
        const n = counts[v] ?? 0;
        return (
          <g key={v}>
            <line x1={x} y1={AXIS_Y - 6} x2={x} y2={AXIS_Y + 6} stroke={palette.ink} strokeWidth={1.5} />
            <text x={x} y={AXIS_Y + 22} textAnchor="middle" fontSize={12} fontWeight={600} fill={palette.muted}>
              {v}
            </text>
            {Array.from({ length: n }, (_, k) => (
              <text key={k} x={x} y={AXIS_Y - 14 - k * 18} textAnchor="middle" fontSize={15} fontWeight={800} fill={fill}>
                ×
              </text>
            ))}
          </g>
        );
      })}
      {unitLabel && (
        <text x={width / 2} y={AXIS_Y + 44} textAnchor="middle" fontSize={12} fill={palette.muted}>
          {unitLabel}
        </text>
      )}
    </svg>
  );
}
