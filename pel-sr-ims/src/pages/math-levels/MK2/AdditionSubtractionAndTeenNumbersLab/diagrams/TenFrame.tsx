import { palette, diagramFont } from "../../../shared/lib/palette";

const COLS = 5;
const CELL = 42;
const R = 14;
const PAD = 14;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

export interface TenFrameProps {
  /** 0-10 cells filled, in order, in `tone`. */
  filled: number;
  tone?: "a" | "b" | "c";
  /** More cells filled right after `filled`, in `fillBTone`. filled + fillB is at most 10. */
  fillB?: number;
  fillBTone?: "a" | "b" | "c";
  /** Extra dots (in `fillBTone`) just outside the frame, for a pair that goes past 10. */
  overflow?: number;
  /** Ring the empty boxes, to point at them after a wrong try. Prints no number. */
  ringEmpty?: boolean;
  /** Number the cells from this index (0-based). */
  numberFrom?: number;
  /** How many cells get a number. */
  numberCount?: number;
  /** The number before the first label: 0 counts 1, 2, 3; 10 counts 11, 12. */
  numberBase?: number;
}

/** The standard ten-frame: 2 rows of 5, filled left to right, then top to
 *  bottom. Empty boxes stay visible, so they show how many more make 10. */
export function TenFrame({ filled, tone, fillB, fillBTone, overflow, ringEmpty = false, numberFrom = 0, numberCount = 0, numberBase = 0 }: TenFrameProps) {
  const f = Math.max(0, Math.min(10, Math.round(filled)));
  const fb = Math.max(0, Math.min(10 - f, Math.round(fillB ?? 0)));
  const color = toneColor(tone);
  const colorB = toneColor(fillBTone ?? "b");
  const extra = Math.max(0, Math.min(10, Math.round(overflow ?? 0)));
  const frameW = COLS * CELL + PAD * 2;
  const extraCols = Math.ceil(extra / 2);
  const width = frameW + (extra ? extraCols * CELL + 8 : 0);
  const height = 2 * CELL + PAD * 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`A ten frame with ${f + fb} of 10 boxes filled${extra ? `, plus ${extra} more outside` : ""}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {Array.from({ length: 10 }, (_, i) => {
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        const x = PAD + col * CELL;
        const y = PAD + row * CELL;
        const cx = x + CELL / 2;
        const cy = y + CELL / 2;
        const inA = i < f;
        const inB = i >= f && i < f + fb;
        const labelled = (inA || inB) && i >= numberFrom && i < numberFrom + numberCount;
        return (
          <g key={i}>
            <rect
              x={x + 2}
              y={y + 2}
              width={CELL - 4}
              height={CELL - 4}
              rx={6}
              fill="none"
              stroke={ringEmpty && !inA && !inB ? palette.c : palette.line}
              strokeWidth={ringEmpty && !inA && !inB ? 3 : 1.5}
            />
            {(inA || inB) && <circle cx={cx} cy={cy} r={R} fill={inA ? color : colorB} stroke={palette.paper} strokeWidth={2} />}
            {labelled && (
              <text x={cx} y={cy + 5} textAnchor="middle" fontSize={14} fontWeight={800} fill="#ffffff">
                {numberBase + (i - numberFrom) + 1}
              </text>
            )}
          </g>
        );
      })}
      {Array.from({ length: extra }, (_, i) => (
        <circle
          key={`x${i}`}
          cx={frameW + 8 + Math.floor(i / 2) * CELL + CELL / 2 - PAD / 2}
          cy={PAD + (i % 2) * CELL + CELL / 2}
          r={R}
          fill={colorB}
          stroke={palette.paper}
          strokeWidth={2}
        />
      ))}
    </svg>
  );
}
