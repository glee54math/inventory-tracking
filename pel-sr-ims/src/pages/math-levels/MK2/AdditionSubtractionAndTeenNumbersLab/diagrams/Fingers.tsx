import { palette, diagramFont } from "../../../shared/lib/palette";

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

const HAND_W = 150;
const HAND_H = 120;
const FINGER_W = 22;
const FINGER_H = 70;
const FINGER_GAP = 8;

/** One hand: 5 fingers, drawn as rounded bars rising from a palm, the first
 *  `raised` of them filled in `color`, the rest left as a plain outline. */
function Hand({ raised, color, x }: { raised: number; color: string; x: number }) {
  const r = Math.max(0, Math.min(5, raised));
  return (
    <g transform={`translate(${x}, 0)`}>
      <rect x={0} y={HAND_H - 38} width={HAND_W} height={34} rx={14} fill={palette.grid} stroke={palette.line} strokeWidth={1.5} />
      {Array.from({ length: 5 }, (_, i) => {
        const up = i < r;
        const fx = i * (FINGER_W + FINGER_GAP) + FINGER_GAP / 2;
        const fy = up ? HAND_H - 38 - FINGER_H : HAND_H - 38 - FINGER_H * 0.32;
        const fh = up ? FINGER_H : FINGER_H * 0.32;
        return (
          <rect
            key={i}
            x={fx}
            y={fy}
            width={FINGER_W}
            height={fh}
            rx={FINGER_W / 2}
            fill={up ? color : "none"}
            stroke={up ? palette.paper : palette.line}
            strokeWidth={up ? 2 : 1.5}
          />
        );
      })}
    </g>
  );
}

export interface FingersProps {
  /** 0-10 fingers raised, filled in order: first hand (1-5), then second hand (6-10). */
  count: number;
  tone?: "a" | "b" | "c";
}

/** Fingers as a concrete, no-picture-of-objects representation of a count —
 *  the distinct "fingers" modality this lab's Unit 1 plan calls for,
 *  alongside (not instead of) concrete-object scenes. New diagram: nothing
 *  in MK1 shows a hand/finger count, since that lab's content never needed
 *  this specific manipulative. */
export function Fingers({ count, tone }: FingersProps) {
  const n = Math.max(0, Math.min(10, Math.round(count)));
  const firstHand = Math.min(5, n);
  const secondHand = Math.max(0, n - 5);
  const color = toneColor(tone);
  const width = HAND_W * 2 + 20;
  return (
    <svg
      viewBox={`0 0 ${width} ${HAND_H}`}
      role="img"
      aria-label={`${n} finger${n === 1 ? "" : "s"} raised`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      <Hand raised={firstHand} color={color} x={0} />
      <Hand raised={secondHand} color={color} x={HAND_W + 20} />
    </svg>
  );
}
