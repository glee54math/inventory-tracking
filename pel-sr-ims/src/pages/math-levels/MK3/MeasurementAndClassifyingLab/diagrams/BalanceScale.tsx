import { palette, diagramFont } from "../../../shared/lib/palette";
import { useCountAlong } from "./SortedBins";

export type Tone = "a" | "b" | "c";
export type ScaleSide = "left" | "right";
const toneColor = (tone?: Tone) => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

const WIDTH = 320;
const HEIGHT = 200;
const BEAM_HALF = 100;
const MIN_TILT = 7; // degrees: a difference of 1 must still be easy to see
const MAX_TILT = 14;
const PIVOT = { x: WIDTH / 2, y: 74 };
const ARROW_DOWN = "M6 0h10v14h6L11 28 0 14h6z";
const ARROW_UP = "M11 0l11 14h-6v14H6V14H0z";

/** A real object sitting in a pan (drawn instead of blocks). */
export interface ScaleObject {
  glyph: string;
  name: string;
  /** Draw it large, for "big does not mean heavy". */
  big?: boolean;
}

export interface BalanceScaleProps {
  /** Plain blocks in each pan, 0-8. Blocks are compared, never a weight unit. */
  left: number;
  right: number;
  /** Blue (c) and orange (b) by default, so the sides can be named by color. */
  leftTone?: Tone;
  rightTone?: Tone;
  /** Printed under the pan, below its rim. Empty by default. */
  leftLabel?: string;
  rightLabel?: string;
  /** A real object in the pan, in place of that side's blocks. */
  leftObject?: ScaleObject;
  rightObject?: ScaleObject;
  /** Which side is down when a pan holds an object (blocks alone decide it otherwise). */
  down?: ScaleSide | "even";
  /** Draw a big arrow over this side. It points the way that side moved. */
  point?: ScaleSide;
  /** Ring this side: "look at this one". */
  ringSide?: ScaleSide;
  /** Count this side's blocks one at a time ("Show me"). */
  countSide?: ScaleSide;
}

const beamPoint = (rad: number, sign: -1 | 1) => ({
  x: PIVOT.x + sign * BEAM_HALF * Math.cos(rad),
  y: PIVOT.y - sign * BEAM_HALF * Math.sin(rad),
});

/** Beam angle for a signed difference: never less than MIN_TILT unless level. */
const tiltFor = (diff: number) => (diff === 0 ? 0 : Math.sign(diff) * Math.min(MAX_TILT, MIN_TILT + (Math.abs(diff) - 1) * 2));

/** A simple two-pan scale: the heavier side sits lower. K.MD.2's own model for
 * comparing weight directly. No numeric readout. A pan holds a real object or
 * plain square blocks, always called "blocks". */
export function BalanceScale({ left, right, leftTone = "c", rightTone = "b", leftLabel = "", rightLabel = "", leftObject, rightObject, down, point, ringSide, countSide }: BalanceScaleProps) {
  const diff = down === "left" ? 2 : down === "right" ? -2 : down === "even" ? 0 : left - right;
  const lowSide: ScaleSide | null = diff > 0 ? "left" : diff < 0 ? "right" : null;
  const rad = (tiltFor(diff) * Math.PI) / 180;
  const leftBeam = beamPoint(rad, -1);
  const rightBeam = beamPoint(rad, 1);
  const countTotal = countSide === "left" ? left : countSide === "right" ? right : 0;
  const shown = useCountAlong(!!countSide, countTotal);

  const pan = (side: ScaleSide) => {
    const p = side === "left" ? leftBeam : rightBeam;
    const count = side === "left" ? left : right;
    const color = toneColor(side === "left" ? leftTone : rightTone);
    const label = side === "left" ? leftLabel : rightLabel;
    const object = side === "left" ? leftObject : rightObject;
    const n = Math.min(8, Math.max(0, Math.round(count)));
    const rimY = p.y + 40;
    const counting = countSide === side;
    return (
      <g>
        <line x1={p.x} y1={p.y} x2={p.x - 34} y2={rimY} stroke={palette.line} strokeWidth={2} />
        <line x1={p.x} y1={p.y} x2={p.x + 34} y2={rimY} stroke={palette.line} strokeWidth={2} />
        <ellipse cx={p.x} cy={rimY} rx={38} ry={10} fill="none" stroke={color} strokeWidth={3} />
        {object ? (
          <text x={p.x} y={rimY - 4} fontSize={object.big ? 46 : 26} textAnchor="middle">
            {object.glyph}
          </text>
        ) : (
          Array.from({ length: n }, (_, i) => {
            const x = p.x - 31 + (i % 4) * 16;
            const y = rimY - 18 - Math.floor(i / 4) * 15;
            return (
              <g key={i}>
                <rect x={x} y={y} width={14} height={14} rx={2} fill={color} stroke={palette.paper} strokeWidth={1} />
                {counting && i < shown && (
                  <text x={x + 7} y={y + 11} textAnchor="middle" fontSize={10} fontWeight={800} fill="#fff">
                    {i + 1}
                  </text>
                )}
              </g>
            );
          })
        )}
        {label && (
          <text x={p.x} y={rimY + 26} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
            {label}
          </text>
        )}
        {ringSide === side && <rect x={p.x - 45} y={p.y + 2} width={90} height={54} rx={10} fill="none" stroke={palette.ink} strokeWidth={2.5} />}
        {point === side && <path transform={`translate(${p.x - 11}, ${Math.max(2, p.y - 38)})`} d={lowSide !== null && side !== lowSide ? ARROW_UP : ARROW_DOWN} fill="#f59e0b" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />}
      </g>
    );
  };

  const desc = diff === 0 ? "level" : diff > 0 ? "the first side is down" : "the second side is down";

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`Scale: ${desc}`}
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
      {pan("left")}
      {pan("right")}
    </svg>
  );
}
