import { palette, diagramFont } from "../../../shared/lib/palette";

export interface JumpSpec {
  from: number;
  to: number;
  tone?: "a" | "b" | "c";
  /** e.g. "+15" or "-8" — shown above the arc. */
  label?: string;
}

export interface NumberLineMDProps {
  /** Axis spans 0..max. */
  max: number;
  tickStep?: number;
  /** A single highlighted point (position bucket). */
  point?: number;
  /** One or more jump arcs (sum/difference bucket) — drawn in order, so a
   *  second jump can start where the first one landed. */
  jumps?: JumpSpec[];
  /** Two or more independently-labeled points, e.g. for a "how much longer
   *  is A than B" compare question where both values sit on one shared
   *  axis — distinct from `point` (exactly one, no label) and from `jumps`
   *  (an arc between two positions, not two standalone marks). */
  points?: { value: number; tone?: "a" | "b" | "c"; label?: string }[];
  tone?: "a" | "b" | "c";
}

const PAD = 20;
const AXIS_Y = 70;
const PX_PER_UNIT_DEFAULT = 6;

const toneFill = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/**
 * A plain 0..max number line for 2.MD.6 — distinct from LinePlot.tsx (which
 * stacks repeated data-frequency marks above a value). This diagram only
 * ever shows POSITION (a single highlighted point) or a SUM/DIFFERENCE
 * (one or more jump arcs between two positions) — never a frequency count,
 * which is what keeps it a visually different diagram from LinePlot even
 * though both are horizontal axes with tick marks (see this lab's own
 * build notes on why these were kept as two separate components).
 */
export function NumberLineMD({ max, tickStep = 10, point, jumps, points, tone = "a" }: NumberLineMDProps) {
  const pxPerUnit = Math.min(PX_PER_UNIT_DEFAULT, (760 - PAD * 2) / max);
  const width = PAD * 2 + max * pxPerUnit;
  const height = AXIS_Y + 50;
  const fill = toneFill(tone);
  const x = (v: number) => PAD + v * pxPerUnit;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={
        point !== undefined
          ? `A number line from 0 to ${max}, with a point marked at ${point}`
          : jumps && jumps.length
          ? `A number line from 0 to ${max}, showing a jump from ${jumps[0].from} to ${jumps[jumps.length - 1].to}`
          : `A number line from 0 to ${max}`
      }
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      <line x1={PAD} y1={AXIS_Y} x2={width - PAD} y2={AXIS_Y} stroke={palette.ink} strokeWidth={2} />
      {Array.from({ length: Math.floor(max / tickStep) + 1 }, (_, i) => {
        const v = i * tickStep;
        return (
          <g key={v}>
            <line x1={x(v)} y1={AXIS_Y - 7} x2={x(v)} y2={AXIS_Y + 7} stroke={palette.ink} strokeWidth={2} />
            <text x={x(v)} y={AXIS_Y + 24} textAnchor="middle" fontSize={12} fontWeight={600} fill={palette.muted}>
              {v}
            </text>
          </g>
        );
      })}
      {jumps?.map((j, i) => {
        const jFill = toneFill(j.tone ?? tone);
        const mid = (x(j.from) + x(j.to)) / 2;
        const arcHeight = 32;
        const dir = j.to >= j.from ? 1 : -1;
        return (
          <g key={i}>
            <path
              d={`M ${x(j.from)} ${AXIS_Y} Q ${mid} ${AXIS_Y - arcHeight} ${x(j.to)} ${AXIS_Y}`}
              fill="none"
              stroke={jFill}
              strokeWidth={2.5}
              markerEnd="url(#arrowhead)"
            />
            <text x={mid} y={AXIS_Y - arcHeight - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={jFill}>
              {j.label ?? (dir > 0 ? `+${j.to - j.from}` : `${j.to - j.from}`)}
            </text>
            <circle cx={x(j.to)} cy={AXIS_Y} r={5} fill={jFill} />
          </g>
        );
      })}
      {jumps && jumps.length > 0 && <circle cx={x(jumps[0].from)} cy={AXIS_Y} r={5} fill={palette.ink} />}
      {point !== undefined && (
        <g>
          <circle cx={x(point)} cy={AXIS_Y} r={6} fill={fill} />
          <text x={x(point)} y={AXIS_Y - 14} textAnchor="middle" fontSize={13} fontWeight={700} fill={fill}>
            {point}
          </text>
        </g>
      )}
      {points?.map((p, i) => {
        const pFill = toneFill(p.tone ?? (i === 0 ? "a" : "b"));
        return (
          <g key={i}>
            <circle cx={x(p.value)} cy={AXIS_Y} r={6} fill={pFill} />
            <text x={x(p.value)} y={AXIS_Y - 14} textAnchor="middle" fontSize={13} fontWeight={700} fill={pFill}>
              {p.label ?? p.value}
            </text>
          </g>
        );
      })}
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={palette.a} />
        </marker>
      </defs>
    </svg>
  );
}
