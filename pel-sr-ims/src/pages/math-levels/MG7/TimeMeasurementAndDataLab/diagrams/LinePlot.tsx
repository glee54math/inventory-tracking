import { palette, diagramFont } from "../../../shared/lib/palette";

/** A quarter-inch value as a kid-readable mixed number: 3 -> "3",
 *  3.25 -> "3 1/4", 3.5 -> "3 1/2", 3.75 -> "3 3/4". The one formatter every
 *  Unit 6 prompt, explanation and choice label uses. */
export function inchText(v: number): string {
  const whole = Math.floor(v + 1e-9);
  const q = Math.round((v - whole) * 4);
  const frac = q === 0 ? "" : q === 2 ? "1/2" : `${q}/4`;
  if (!frac) return String(whole);
  return whole === 0 ? frac : `${whole} ${frac}`;
}

export interface LinePlotProps {
  /** Whole-inch range the axis spans, e.g. 2 to 5. */
  minWhole: number;
  maxWhole: number;
  /** Every data point as a quarter-inch count from `minWhole` (e.g. 0.25
   *  steps) — the line plot's x-axis is marked in whole, half, AND quarter
   *  units (3.MD.4's own requirement), so data is keyed by the raw inch
   *  value (e.g. 3.25, 3.5, 3.75) rather than a bucketed index. */
  data: number[];
  tone?: "a" | "b" | "c";
}

const STEP_PX = 26; // pixel distance between adjacent quarter-inch ticks
const AXIS_Y = 150;
const DOT_R = 7;
const DOT_GAP = 16;

/**
 * A line plot whose axis shows whole-, half-, AND quarter-inch tick marks
 * together (whole ticks tallest+labeled, half ticks medium, quarter ticks
 * shortest+unlabeled) — stacked dots above each position show how many
 * measurements landed there. Dot x-position and every graded "how many at
 * this value" / "how many more here than there" answer are both computed
 * from the SAME `data` array, so they can never disagree.
 */
export function LinePlot({ minWhole, maxWhole, data, tone = "a" }: LinePlotProps) {
  const fill = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;
  const quarterSteps = (maxWhole - minWhole) * 4;
  const width = 24 + quarterSteps * STEP_PX + 24;

  // Count how many data points land at each quarter-inch position, for dot stacking.
  const counts = new Map<number, number>();
  for (const v of data) counts.set(v, (counts.get(v) ?? 0) + 1);
  const maxStack = Math.max(0, ...counts.values());
  const height = AXIS_Y + 20 + maxStack * DOT_GAP + 20;

  const xFor = (inches: number) => 24 + (inches - minWhole) * 4 * STEP_PX;

  const ticks: { x: number; kind: "whole" | "half" | "quarter"; label?: string }[] = [];
  for (let q = 0; q <= quarterSteps; q++) {
    const inches = minWhole + q / 4;
    const kind = q % 4 === 0 ? "whole" : q % 2 === 0 ? "half" : "quarter";
    ticks.push({ x: xFor(inches), kind, label: kind === "whole" ? String(inches) : undefined });
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`A line plot from ${minWhole} to ${maxWhole} inches, marked in whole, half, and quarter inches, with ${data.length} measurements plotted`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      <line x1={24} y1={AXIS_Y} x2={width - 24} y2={AXIS_Y} stroke={palette.ink} strokeWidth={2} />
      {ticks.map((t, i) => {
        const h = t.kind === "whole" ? 14 : t.kind === "half" ? 10 : 6;
        return (
          <g key={i}>
            <line x1={t.x} y1={AXIS_Y} x2={t.x} y2={AXIS_Y + h} stroke={palette.muted} strokeWidth={t.kind === "whole" ? 2 : 1.25} />
            {t.label && (
              <text x={t.x} y={AXIS_Y + h + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={palette.ink}>
                {t.label}"
              </text>
            )}
          </g>
        );
      })}
      {Array.from(counts.entries()).map(([value, n]) =>
        Array.from({ length: n }, (_, i) => (
          <circle key={`${value}-${i}`} cx={xFor(value)} cy={AXIS_Y - 10 - i * DOT_GAP} r={DOT_R} fill={fill} opacity={0.85} />
        ))
      )}
    </svg>
  );
}
