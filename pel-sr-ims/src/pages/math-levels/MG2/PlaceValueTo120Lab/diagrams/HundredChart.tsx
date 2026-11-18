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
   *  sequence past 100. A smaller `max` (with `min`) draws just a few rows. */
  max?: number;
  /**
   * Optional first number of the grid (1, 11, 21, ... — the start of a row).
   * Default 1. Lets a CFU picture show just the rows it asks about (e.g. 81-110)
   * at a bigger size. Added round 1 (review fix C1-02).
   */
  min?: number;
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
  /**
   * Optional: cells after `upTo` are drawn as empty boxes with NO number, so a
   * "what comes next?" question can't be answered by reading the next cell.
   * Tests always use it; Practice uses it until a wrong try (the faint numbers
   * then come back as help). Added round 1 (review fix C1-11).
   */
  hideAfter?: boolean;
  /**
   * Optional: draw a hop arrow from one cell to another (the next cell for
   * "what comes next", straight down/up a row for 10 more / 10 less). Help
   * only — never drawn before a wrong try. Added round 1 (C1-06 / C1-22).
   */
  hop?: { from: number; to: number };
  /** Optional: this cell shows a "?" (its number hidden) — where the answer goes. */
  ask?: number;
  /**
   * Optional: these cells are drawn as empty boxes with no number, wherever
   * they are (e.g. the cell before the start, while "one less" is asked).
   * Review C2-36.
   */
  hide?: number[];
  onCellClick?: (n: number) => void;
  size?: number;
}

/**
 * A 10-wide, 12-row number grid, 1-120 — the single shared Explore diagram
 * for this lab's counting (Unit 1), comparing (Unit 3), and tens-more/less
 * (Unit 4) units. Every column holds one fixed ones-digit (column c holds
 * every number ending in c, wrapping 10 -> ones-digit 0), so "+-10" is
 * visually "straight up/down one row, same column," with no extra geometry
 * needed to make it legible. (Row breaks fall after 10, 20, 30…, so 20 sits
 * at the END of the 11-20 row; text must not say a new ten "starts a row".)
 *
 * Lab-local for now, not promoted to shared/diagrams/ — see this lab's
 * build report for the promotion case.
 */
export function HundredChart({ max = 120, min = 1, marks, upTo, hideAfter, hop, ask, hide, onCellClick }: HundredChartProps) {
  const first = Math.max(1, min);
  const count = max - first + 1;
  const rows = Math.ceil(count / COLS);
  const width = COLS * CELL + PAD * 2;
  const height = rows * CELL + PAD * 2;
  const dimAfter = upTo ?? max;
  const markByN = new Map<number, "a" | "b" | "c" | "good">();
  for (const m of marks ?? []) markByN.set(m.n, m.tone ?? "a");
  const center = (n: number) => {
    const i = n - first;
    return { x: PAD + (i % COLS) * CELL + CELL / 2, y: PAD + Math.floor(i / COLS) * CELL + CELL / 2 };
  };
  const inGrid = (n: number) => n >= first && n <= max;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`A number grid from ${first} to ${max}, ten per row`}
      style={{ display: "block", width: "100%", maxWidth: Math.round(width * (rows <= 4 ? 1.6 : 1)), height: "auto", fontFamily: diagramFont }}
    >
      <defs>
        <marker id="pv120-hop-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: palette.c }} />
        </marker>
      </defs>
      {Array.from({ length: count }, (_, i) => {
        const n = first + i;
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        const x = PAD + col * CELL;
        const y = PAD + row * CELL;
        const isAsk = ask === n;
        const mark = isAsk ? undefined : markByN.get(n);
        const after = n > dimAfter;
        const hidden = (after && hideAfter && !mark) || isAsk || (!mark && !!hide?.includes(n));
        const fill = mark ? toneColor(mark) : palette.paper;
        const textColor = mark ? "var(--on-q, #ffffff)" : after ? palette.muted : palette.ink;
        return (
          <g
            key={n}
            opacity={after && !mark && !isAsk && !hideAfter ? 0.3 : 1}
            style={onCellClick ? { cursor: "pointer" } : undefined}
            onClick={onCellClick ? () => onCellClick(n) : undefined}
          >
            <rect
              x={x + 1}
              y={y + 1}
              width={CELL - 2}
              height={CELL - 2}
              rx={5}
              style={{ fill: isAsk ? palette.bSoft : fill, stroke: isAsk ? palette.b : palette.line }}
              strokeWidth={isAsk ? 2.5 : 1}
            />
            {isAsk ? (
              <text x={x + CELL / 2} y={y + CELL / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={900} style={{ fill: palette.b }}>
                ?
              </text>
            ) : (
              !hidden && (
                <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={mark ? 800 : 500} style={{ fill: textColor }}>
                  {n}
                </text>
              )
            )}
          </g>
        );
      })}
      {hop && inGrid(hop.from) && inGrid(hop.to) && hop.from !== hop.to && (() => {
        const a = center(hop.from);
        const b = center(hop.to);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy);
        // Start and stop at the cell edges, bending a little so the arrow
        // doesn't hide the numbers it passes over.
        const ux = dx / len;
        const uy = dy / len;
        const sx = a.x + ux * 9;
        const sy = a.y + uy * 9;
        const ex = b.x - ux * 11;
        const ey = b.y - uy * 11;
        const bend = Math.min(18, len / 3);
        const cx = (sx + ex) / 2 + uy * bend;
        const cy = (sy + ey) / 2 - ux * bend;
        return <path d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`} fill="none" style={{ stroke: palette.c }} strokeWidth={3} markerEnd="url(#pv120-hop-head)" />;
      })()}
    </svg>
  );
}
