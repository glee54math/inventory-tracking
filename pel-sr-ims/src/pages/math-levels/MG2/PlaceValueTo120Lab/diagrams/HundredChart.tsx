import { palette, diagramFont } from "../../../shared/lib/palette";

const COLS = 10;
const CELL = 30;
const PAD = 14;

const toneColor = (tone?: "a" | "b" | "c" | "good") =>
  tone === "b" ? palette.b : tone === "c" ? palette.c : tone === "good" ? palette.good : palette.a;

export interface HundredChartMark {
  n: number;
  tone?: "a" | "b" | "c" | "good";
}

export interface HundredChartProps {
  /** Highest number the grid goes up to — this lab always uses 120 (10 cols x 12
   *  rows), not the traditional 100-chart, since 1.NBT.1 extends the count
   *  sequence past 100. Kept configurable only so a future caller isn't forced
   *  into exactly 120 if it never needs the top two rows. */
  max?: number;
  /** Specific cells to tint, e.g. the student's current count-forward position,
   *  or the two numbers being compared. Later entries paint over earlier ones
   *  if the same cell appears twice. */
  marks?: HundredChartMark[];
  /**
   * Cells with n > upTo render faint/greyed — "not counted yet". Defaults to
   * `max` (nothing dimmed). Used by Counting to 120's Explore so the chart
   * fills in as the student counts forward, instead of showing the whole
   * grid at once.
   */
  upTo?: number;
  onCellClick?: (n: number) => void;
  size?: number;
}

/**
 * A 10-wide, 12-row number grid, 1-120 — the single shared Explore diagram
 * for this lab's counting (Unit 1), comparing (Unit 3), and tens-more/less
 * (Unit 4) units. Every column holds one fixed ones-digit (column c holds
 * every number ending in c, wrapping 10 -> ones-digit 0), and every row
 * holds one fixed tens-digit — so "crossing a decade" is visually "wrapping
 * to the next row," and "+-10" is visually "straight up/down one row, same
 * column," with no extra geometry needed to make either idea legible.
 *
 * Lab-local for now, not promoted to shared/diagrams/ — see this lab's
 * build report for the promotion case (a hundred/120-chart is a strong
 * candidate once a second lab needs one; several other labs are mid-build
 * in parallel right now, so shared/ stays untouched this round).
 */
export function HundredChart({ max = 120, marks, upTo, onCellClick }: HundredChartProps) {
  const rows = Math.ceil(max / COLS);
  const width = COLS * CELL + PAD * 2;
  const height = rows * CELL + PAD * 2;
  const dimAfter = upTo ?? max;
  const markByN = new Map<number, "a" | "b" | "c" | "good">();
  for (const m of marks ?? []) markByN.set(m.n, m.tone ?? "a");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`A number grid from 1 to ${max}, ten per row`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        const x = PAD + col * CELL;
        const y = PAD + row * CELL;
        const mark = markByN.get(n);
        const dim = n > dimAfter;
        const fill = mark ? toneColor(mark) : palette.paper;
        const textColor = mark ? "var(--on-q, #ffffff)" : dim ? palette.muted : palette.ink;
        return (
          <g
            key={n}
            opacity={dim && !mark ? 0.3 : 1}
            style={onCellClick ? { cursor: "pointer" } : undefined}
            onClick={onCellClick ? () => onCellClick(n) : undefined}
          >
            <rect x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2} rx={5} fill={fill} stroke={palette.line} strokeWidth={1} />
            <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={mark ? 800 : 500} fill={textColor}>
              {n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
