import { palette, diagramFont } from "../../../shared/lib/palette";

export type Tone = "a" | "b" | "c";

const toneColor = (tone?: Tone) => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

const CELL = 34;
const GAP = 6;
const COLS = 5;
const PAD = 8;
const FRAME_W = COLS * CELL + (COLS - 1) * GAP + PAD * 2;
const FRAME_H = 2 * CELL + GAP + PAD * 2;

/**
 * One 10-cell frame (2 rows of 5) — the building block TenFrameGroup below
 * composes into a 0-20 display. Lab-local duplicate of
 * MG1/AdditionAndSubtractionWithin20Lab/diagrams/TenFrame.tsx (same
 * copy-don't-share convention as every other skill file in this app — see
 * MATH_TSX_STYLE_GUIDE.txt section 7/10); this is the SECOND lab that needs
 * this exact shape, which is this codebase's own trigger to consider
 * promoting to shared/diagrams/ on a future round with broader scope (not
 * done here — this build was scope-locked to MG5's own folder).
 */
function TenFrame({ filled, tone, splitAt, tone2 }: { filled: number; tone?: Tone; splitAt?: number; tone2?: Tone }) {
  const f = Math.max(0, Math.min(10, Math.round(filled)));
  const color = toneColor(tone);
  const color2 = toneColor(tone2 ?? tone);
  const cellAt = (i: number) => ({ x: PAD + (i % COLS) * (CELL + GAP), y: PAD + Math.floor(i / COLS) * (CELL + GAP) });
  return (
    <svg
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      role="img"
      aria-label={`Ten frame, ${f} of 10 filled`}
      style={{ display: "block", width: "100%", maxWidth: FRAME_W, height: "auto", fontFamily: diagramFont }}
    >
      {Array.from({ length: 10 }, (_, i) => {
        const { x, y } = cellAt(i);
        const isFilled = i < f;
        const isSplit = splitAt !== undefined && isFilled && i >= splitAt;
        return <rect key={i} x={x} y={y} width={CELL} height={CELL} rx={6} fill={isFilled ? (isSplit ? color2 : color) : "none"} stroke={palette.line} strokeWidth={1.5} />;
      })}
    </svg>
  );
}

export interface TenFrameGroupProps {
  /** 0-20. Values above 20 are clamped — Unit 1 never counts that high. */
  value: number;
  tone?: Tone;
  /** Cells from this index on (0-based, across BOTH frames in reading order)
   *  render in `tone2` instead of `tone` — used for make-ten decomposition
   *  and fact-family part-shading. */
  splitAt?: number;
  tone2?: Tone;
}

/** A count from 0-20 shown as one or two ten-frames — the concrete stand-in
 *  Unit 1 (Within-20 Fluency) leans on instead of a bare numeral. */
export function TenFrameGroup({ value, tone, splitAt, tone2 }: TenFrameGroupProps) {
  const v = Math.max(0, Math.min(20, Math.round(value)));
  const firstCount = Math.min(10, v);
  const secondCount = Math.max(0, v - 10);
  const splitFirst = splitAt;
  const splitSecond = splitAt !== undefined ? Math.max(0, splitAt - 10) : undefined;
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }} role="img" aria-label={`${v} shown on ten frame${v > 10 ? "s" : ""}`}>
      <TenFrame filled={firstCount} tone={tone} splitAt={splitFirst} tone2={tone2} />
      {v > 10 && <TenFrame filled={secondCount} tone={tone} splitAt={splitSecond} tone2={tone2} />}
    </div>
  );
}
