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
  /** Additional cells filled right after `filled`, in `fillBTone` — e.g. the
   *  "partner for 10" complement, so a single frame visually shows a number
   *  AND how many more it takes to reach 10 in one picture. filled + fillB
   *  must not exceed 10. */
  fillB?: number;
  fillBTone?: "a" | "b" | "c";
}

/** The standard 2-row-of-5 "ten frame," filled left-to-right then top-to-
 *  bottom — the one fixed, memorizable shape behind both Making 10 (filled +
 *  complement in a second tone) and Teen Numbers (one full frame = "the
 *  ten"). Capped at exactly 10 cells, unlike MK1's TenGroups (which bundles
 *  any count 0-100 into repeated ten-blocks) — this lab only ever needs a
 *  SINGLE frame, so a simpler, fixed-size component was clearer than reusing
 *  TenGroups' repeating-block layout for a case that never repeats. */
export function TenFrame({ filled, tone, fillB, fillBTone }: TenFrameProps) {
  const f = Math.max(0, Math.min(10, Math.round(filled)));
  const fb = Math.max(0, Math.min(10 - f, Math.round(fillB ?? 0)));
  const color = toneColor(tone);
  const colorB = toneColor(fillBTone ?? "b");
  const width = COLS * CELL + PAD * 2;
  const height = 2 * CELL + PAD * 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`A ten frame with ${f} filled${fb ? ` and ${fb} more highlighted` : ""}, out of 10 cells`}
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
        return (
          <g key={i}>
            <rect x={x + 2} y={y + 2} width={CELL - 4} height={CELL - 4} rx={6} fill="none" stroke={palette.line} strokeWidth={1.5} />
            {(inA || inB) && <circle cx={cx} cy={cy} r={R} fill={inA ? color : colorB} stroke={palette.paper} strokeWidth={2} />}
          </g>
        );
      })}
    </svg>
  );
}
