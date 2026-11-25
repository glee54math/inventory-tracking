import { palette, diagramFont } from "../../../shared/lib/palette";
import { useCountAlong } from "./timing";

type Tone = "a" | "b" | "c";
const toneColor = (tone?: Tone) => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

const HAND_W = 150;
const HAND_H = 120;
const LABEL_H = 20;
const FINGER_W = 22;
const FINGER_H = 70;
const FINGER_GAP = 8;

/** One hand: 5 fingers rising from a palm. The first `raised` are up, the last
 *  `gone` of those are drawn going down (faded), and `labels` numbers them. */
function Hand({ raised, gone, labels, color, x, ring }: { raised: number; gone: number; labels: (number | null)[]; color: string; x: number; ring: boolean }) {
  const r = Math.max(0, Math.min(5, raised));
  return (
    <g transform={`translate(${x}, ${LABEL_H})`}>
      <rect x={0} y={HAND_H - 38} width={HAND_W} height={34} rx={14} fill={palette.grid} stroke={palette.line} strokeWidth={1.5} />
      {Array.from({ length: 5 }, (_, i) => {
        const up = i < r;
        const faded = up && i >= r - gone;
        const fx = i * (FINGER_W + FINGER_GAP) + FINGER_GAP / 2;
        const fy = up ? HAND_H - 38 - FINGER_H : HAND_H - 38 - FINGER_H * 0.32;
        const fh = up ? FINGER_H : FINGER_H * 0.32;
        return (
          <g key={i}>
            <rect
              x={fx}
              y={fy}
              width={FINGER_W}
              height={fh}
              rx={FINGER_W / 2}
              fill={up ? color : "none"}
              fillOpacity={faded ? 0.18 : 1}
              stroke={faded ? color : up ? palette.paper : palette.line}
              strokeWidth={up ? 2 : 1.5}
              strokeDasharray={faded ? "3 3" : undefined}
            />
            {ring && up && !faded && <rect x={fx - 3} y={fy - 3} width={FINGER_W + 6} height={fh + 6} rx={FINGER_W / 2 + 3} fill="none" stroke={palette.c} strokeWidth={3} />}
            {labels[i] !== null && labels[i] !== undefined && (
              <text x={fx + FINGER_W / 2} y={fy - 5} textAnchor="middle" fontSize={15} fontWeight={800} fill={palette.ink}>
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export interface FingersProps {
  /** Fingers up on the first hand (0-5). */
  left: number;
  /** Fingers up on the second hand (0-5). */
  right?: number;
  toneLeft?: Tone;
  toneRight?: Tone;
  /** How many raised fingers are going down, counted from the last one up. */
  gone?: number;
  /** Number the fingers still up, one per second ("Show me"). */
  countAlong?: boolean;
  /** Number this many fingers at once (a demo driven from outside). */
  numbered?: number;
  /** Ring the fingers that are up, to point at them after a wrong try. */
  ring?: boolean;
  /** Draw the last raised finger on this hand faded: where the next finger goes. */
  ghostOn?: "left" | "right";
}

/** Fingers as a concrete picture of a count. Each group in a story gets its
 *  own hand and its own color, so the picture matches the words. */
export function Fingers({ left, right = 0, toneLeft = "a", toneRight = "b", gone = 0, countAlong = false, numbered, ring = false, ghostOn }: FingersProps) {
  const l = Math.max(0, Math.min(5, Math.round(left)));
  const r = Math.max(0, Math.min(5, Math.round(right)));
  const goneR = ghostOn ? (ghostOn === "right" ? 1 : 0) : Math.min(r, gone);
  const goneL = ghostOn ? (ghostOn === "left" ? 1 : 0) : Math.min(l, gone - goneR);
  const stillUp = l + r - goneL - goneR;
  const counted = useCountAlong(countAlong, stillUp);
  const labelCount = countAlong ? counted : (numbered ?? 0);

  const labelsFor = (raised: number, goneHere: number, first: number) =>
    Array.from({ length: 5 }, (_, i) => {
      if (i >= raised - goneHere) return null;
      const value = first + i + 1;
      return value <= labelCount ? value : null;
    });

  const width = HAND_W * 2 + 20;
  const height = HAND_H + LABEL_H;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${stillUp} finger${stillUp === 1 ? "" : "s"} up`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      <Hand raised={l} gone={goneL} labels={labelsFor(l, goneL, 0)} color={toneColor(toneLeft)} x={0} ring={ring} />
      <Hand raised={r} gone={goneR} labels={labelsFor(r, goneR, l - goneL)} color={toneColor(toneRight)} x={HAND_W + 20} ring={ring} />
    </svg>
  );
}
