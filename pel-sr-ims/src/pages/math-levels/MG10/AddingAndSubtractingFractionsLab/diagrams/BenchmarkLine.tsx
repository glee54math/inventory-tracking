import { palette, diagramFont } from "../../../shared/lib/palette";
import { halvesText } from "../lib/fractions";
import { spokenFractions } from "../../../shared/components/MathText";
import { SvgMath } from "./SvgMath";

export interface BenchmarkPoint {
  /** Position on the line. */
  value: number;
  /** Text over the dot, e.g. "3/8" (drawn stacked). Omit for a bare dot. */
  label?: string;
  tone?: "a" | "b" | "c";
  /** Draw as an open diamond (an estimate) instead of a dot. */
  estimate?: boolean;
}

export interface BenchmarkLineProps {
  /** Whole numbers at the ends of the line. */
  min?: number;
  max: number;
  points?: BenchmarkPoint[];
  /** Pull this benchmark (in halves, e.g. 1 = 1/2) out with a ring. */
  ringHalves?: number;
  width?: number;
}

const PAD = 36; // room for a centered "estimate" label at either end
// Labels are stacked fractions (about 26 px tall), so each label height is
// 30 px above the next. The line sits lower when labels have to stack up.
const LIFT = 30;
const lineYFor = (maxLift: number) => 50 + maxLift * LIFT;
const BELOW = 52; // tick labels (stacked halves) and their ring under the line

const toneColor = (t?: "a" | "b" | "c") => (t === "b" ? palette.b : t === "c" ? palette.c : palette.a);

/**
 * A number line with the benchmark numbers marked — every half (0, 1/2, 1,
 * 1 1/2 …) gets a tall tick and a label — so "which benchmark is 3/8 closest
 * to?" can be answered by looking. Points sit on the line with their own
 * label above; an estimate is an open diamond. Labels alternate height when
 * up to three points are close, so they never sit on top of each other.
 */
export function BenchmarkLine({ min = 0, max, points = [], ringHalves, width = 520 }: BenchmarkLineProps) {
  const span = max - min;
  const x = (v: number) => PAD + ((v - min) / span) * (width - 2 * PAD);
  const halves: number[] = [];
  for (let h = min * 2; h <= max * 2; h++) halves.push(h);
  const labelHalves = span <= 4;
  const sorted = [...points].sort((p, q) => p.value - q.value);
  const lift = new Map<BenchmarkPoint, number>();
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    // Up to three label heights, so a cluster of close points (two
    // fractions and the estimate near 0) never prints labels on top of each other.
    const close = prev && Math.abs(x(p.value) - x(prev.value)) < 56;
    lift.set(p, close ? ((lift.get(prev) ?? 0) + 1) % 3 : 0);
  });
  const LINE_Y = lineYFor(Math.max(0, ...lift.values()));
  const H = LINE_Y + BELOW;

  // Screen readers: say where each marked point is, without naming its closest
  // benchmark (that is often the question): "3/8 is between 0 and 1/2."
  const where = points
    .filter((p) => p.label)
    .map((p) => {
      const name = p.estimate ? "The estimate" : p.label;
      const h2 = p.value * 2;
      if (Math.abs(h2 - Math.round(h2)) < 1e-9) return `${name} is at ${halvesText(Math.round(h2))}.`;
      return `${name} is between ${halvesText(Math.floor(h2))} and ${halvesText(Math.floor(h2) + 1)}.`;
    })
    .join(" ");
  // Fractions in words ("3 over 8"), to match the stacked labels on screen.
  const ariaLabel = spokenFractions(`Number line from ${min} to ${max} with benchmarks at every half.${where ? ` ${where}` : ""}`);

  return (
    <svg viewBox={`0 0 ${width} ${H}`} width={width} style={{ maxWidth: "100%", fontFamily: diagramFont, display: "block" }} role="img" aria-label={ariaLabel}>
      <line x1={PAD - 8} y1={LINE_Y} x2={width - PAD + 8} y2={LINE_Y} style={{ stroke: palette.ink, strokeWidth: 2 }} />
      {halves.map((h) => {
        const isWhole = h % 2 === 0;
        const ringed = ringHalves === h;
        return (
          <g key={h}>
            <line x1={x(h / 2)} y1={LINE_Y - (isWhole ? 10 : 7)} x2={x(h / 2)} y2={LINE_Y + (isWhole ? 10 : 7)} style={{ stroke: palette.ink, strokeWidth: isWhole ? 2.5 : 2 }} />
            {(isWhole || labelHalves) && <SvgMath text={halvesText(h)} x={x(h / 2)} y={LINE_Y + 30} fontSize={14} color={palette.ink} weight={700} />}
            {ringed && <circle cx={x(h / 2)} cy={LINE_Y + 30} r={19} style={{ fill: "none", stroke: palette.good, strokeWidth: 2.5 }} />}
          </g>
        );
      })}
      {points.map((p, i) => {
        const cx = x(Math.min(max, Math.max(min, p.value)));
        const col = toneColor(p.tone);
        const ly = LINE_Y - 30 - (lift.get(p) ?? 0) * LIFT;
        return (
          <g key={i}>
            {p.estimate ? (
              <rect x={cx - 7} y={LINE_Y - 7} width={14} height={14} transform={`rotate(45 ${cx} ${LINE_Y})`} style={{ fill: palette.paper, stroke: col, strokeWidth: 3 }} />
            ) : (
              <circle cx={cx} cy={LINE_Y} r={7} style={{ fill: col, stroke: palette.paper, strokeWidth: 2 }} />
            )}
            {p.label && <SvgMath text={p.label} x={cx} y={ly} fontSize={13} color={col} />}
          </g>
        );
      })}
    </svg>
  );
}
