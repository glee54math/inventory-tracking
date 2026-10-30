import { palette, diagramFont } from "../../../shared/lib/palette";

export interface ScaleGaugeProps {
  /** Whole units the dial is marked up to (the last major tick). */
  maxUnits: number;
  /** How many units the needle points to — lands exactly on a major tick
   *  (a multiple of `majorStep`) or exactly on the lighter mid-tick halfway
   *  between two major ticks, same "always on a drawn mark" convention as
   *  GraduatedContainer. */
  valueUnits: number;
  /** Spacing between labeled major ticks, e.g. 100 for a 0-1000 gram dial. */
  majorStep: number;
  unitLabel: string; // "g" or "kg"
  tone?: "a" | "b" | "c";
}

const W = 220;
const H = 150;
const CX = W / 2;
const CY = H - 14;
const R = 96;
const START_DEG = -180; // left horizontal
const END_DEG = 0; // right horizontal (a half-circle gauge, needle sweeps left-to-right)

/**
 * A half-circle dial scale: a needle sweeping from 0 (far left) to `maxUnits`
 * (far right) over a semicircle, with a major tick (bold, labeled) every
 * `majorStep` units and a lighter mid-tick halfway between each pair. The
 * needle's angle and the digital readout underneath are both derived from
 * the SAME `valueUnits`, so they can never show two different values.
 */
export function ScaleGauge({ maxUnits, valueUnits, majorStep, unitLabel, tone = "a" }: ScaleGaugeProps) {
  const fill = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;
  const toDeg = (v: number) => START_DEG + (v / maxUnits) * (END_DEG - START_DEG);
  const toPoint = (deg: number, r: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  };

  const majorTicks: number[] = [];
  for (let v = 0; v <= maxUnits; v += majorStep) majorTicks.push(v);
  const midTicks: number[] = [];
  for (let v = majorStep / 2; v < maxUnits; v += majorStep) midTicks.push(v);

  const needleDeg = toDeg(valueUnits);
  const needleTip = toPoint(needleDeg, R * 0.86);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`A scale dial marked up to ${maxUnits} ${unitLabel}, pointing at ${valueUnits} ${unitLabel}`}
      style={{ display: "block", width: "100%", maxWidth: W, height: "auto", fontFamily: diagramFont }}
    >
      <path
        d={`M ${toPoint(START_DEG, R).x} ${toPoint(START_DEG, R).y} A ${R} ${R} 0 0 1 ${toPoint(END_DEG, R).x} ${toPoint(END_DEG, R).y}`}
        fill="none"
        stroke={palette.line}
        strokeWidth={2.5}
      />
      {midTicks.map((v) => {
        const p1 = toPoint(toDeg(v), R * 0.92);
        const p2 = toPoint(toDeg(v), R);
        return <line key={`mid${v}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={palette.grid} strokeWidth={1.5} />;
      })}
      {majorTicks.map((v) => {
        const p1 = toPoint(toDeg(v), R * 0.82);
        const p2 = toPoint(toDeg(v), R);
        const lp = toPoint(toDeg(v), R * 1.14);
        return (
          <g key={`maj${v}`}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={palette.muted} strokeWidth={2.5} />
            <text x={lp.x} y={lp.y} textAnchor="middle" fontSize={11} fontWeight={700} fill={palette.ink}>
              {v}
            </text>
          </g>
        );
      })}
      <line x1={CX} y1={CY} x2={needleTip.x} y2={needleTip.y} stroke={fill} strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={CX} cy={CY} r={6} fill={palette.ink} />
    </svg>
  );
}
