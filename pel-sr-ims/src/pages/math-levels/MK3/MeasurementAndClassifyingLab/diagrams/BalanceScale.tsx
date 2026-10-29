import { palette, diagramFont } from "../../../shared/lib/palette";

export type Tone = "a" | "b" | "c";
const toneColor = (tone?: Tone) => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

const WIDTH = 320;
const HEIGHT = 190;
const BEAM_HALF = 110;
const MAX_TILT = 14; // degrees
const PIVOT = { x: WIDTH / 2, y: 80 };

export interface BalanceScaleProps {
  /** Weight units, 0-8 — purely comparative (this standard never introduces
   *  a numeric weight unit), used only to decide tilt direction and how
   *  many glyphs to stack in each pan. */
  left: number;
  right: number;
  leftTone?: Tone;
  rightTone?: Tone;
  leftLabel?: string;
  rightLabel?: string;
  glyph?: string;
}

const beamPoint = (rad: number, sign: -1 | 1) => ({
  x: PIVOT.x + sign * BEAM_HALF * Math.cos(rad),
  y: PIVOT.y - sign * BEAM_HALF * Math.sin(rad),
});

/** A simple two-pan balance: the HEAVIER side's pan sits lower and the beam
 * tilts toward it — K.MD.2's own named model for directly comparing weight.
 * No numeric readout anywhere; weight stays purely comparative at this
 * grade, same as length never gets a ruler unit in this lab. */
export function BalanceScale({ left, right, leftTone, rightTone, leftLabel = "Left", rightLabel = "Right", glyph = "🧱" }: BalanceScaleProps) {
  const diff = left - right;
  const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, diff * 3));
  const rad = (tilt * Math.PI) / 180;
  const leftColor = toneColor(leftTone ?? "a");
  const rightColor = toneColor(rightTone ?? "b");
  const leftBeam = beamPoint(rad, -1);
  const rightBeam = beamPoint(rad, 1);

  const pan = (p: { x: number; y: number }, count: number, color: string, label: string) => {
    const n = Math.min(8, Math.max(0, Math.round(count)));
    return (
      <g>
        <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + 34} stroke={palette.line} strokeWidth={2} />
        <ellipse cx={p.x} cy={p.y + 40} rx={38} ry={10} fill="none" stroke={color} strokeWidth={3} />
        {Array.from({ length: n }, (_, i) => (
          <text key={i} x={p.x - 24 + (i % 4) * 16} y={p.y + 30 - Math.floor(i / 4) * 16} fontSize={16} textAnchor="middle">
            {glyph}
          </text>
        ))}
        <text x={p.x} y={p.y + 58} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
          {label}
        </text>
      </g>
    );
  };

  const tiltDesc = diff === 0 ? "balanced" : diff > 0 ? `${leftLabel} is heavier` : `${rightLabel} is heavier`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`Balance scale: ${tiltDesc}`}
      style={{ display: "block", width: "100%", maxWidth: WIDTH, height: "auto", fontFamily: diagramFont }}
    >
      <polygon
        points={`${PIVOT.x - 10},${HEIGHT - 10} ${PIVOT.x + 10},${HEIGHT - 10} ${PIVOT.x},${PIVOT.y}`}
        fill={palette.grid}
        stroke={palette.line}
        strokeWidth={2}
      />
      <line x1={leftBeam.x} y1={leftBeam.y} x2={rightBeam.x} y2={rightBeam.y} stroke={palette.ink} strokeWidth={4} />
      <circle cx={PIVOT.x} cy={PIVOT.y} r={5} fill={palette.ink} />
      {pan(leftBeam, left, leftColor, leftLabel)}
      {pan(rightBeam, right, rightColor, rightLabel)}
    </svg>
  );
}
