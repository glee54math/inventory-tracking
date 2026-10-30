import { palette } from "../../../shared/lib/palette";

// ============================================================================
// A rectangle partitioned into rows x columns of squares, for Unit 2
// (2.G.2). Checked shared/diagrams/ first — nothing there draws a literal
// rows/columns equal-square grid. A sibling agent is building
// EvenOddAndArraysLab (also Grade 2, also slot MG5) concurrently with a
// visually similar rows/columns array diagram for its own Units 3-4 — since
// both labs are being authored at the same time, this is a one-off
// lab-local build rather than any attempt to share a live component; flagged
// as a future shared/diagrams promotion candidate once both labs exist (the
// "promote on the second real consumer" convention), not promoted this round.
//
// GRID_META-style logic lives directly in this file's own helpers (rowTotals/
// isEvenGrid) so the picture and the "how many squares"/"are these really
// equal squares" questions asked about it can never silently disagree.
// ============================================================================

const PIECE_STROKE = palette.ink;

/** Hand-authored "looks partitioned but isn't actually equal squares"
 *  column/row weight patterns — a fixed small set (never randomly generated
 *  at render time), same convention as ShapeTile's JITTER patterns. Index 0
 *  is reserved for "equal" (all weights 1) and is never selected by
 *  `unevenVariant` (callers asking for uneven pass variant 1 or 2). */
const UNEVEN_COL_WEIGHTS = [
  [1, 1.6, 0.7, 1.3],
  [1.5, 0.6, 1, 1.4, 0.8],
  [0.8, 1.7, 1, 0.9],
];
const UNEVEN_ROW_WEIGHTS = [
  [1, 1.5, 0.7],
  [1.4, 0.8, 1.3, 0.6],
  [0.7, 1.6, 1],
];

function weightsFor(n: number, uneven: boolean, variant: number, table: number[][]): number[] {
  if (!uneven) return Array.from({ length: n }, () => 1);
  const pattern = table[((variant % table.length) + table.length) % table.length];
  // Resample/trim the hand-authored pattern to length n via modulo indexing,
  // so the same small fixed table covers any row/column count this unit asks for.
  return Array.from({ length: n }, (_, i) => pattern[i % pattern.length]);
}

function cumulative(weights: number[], total: number): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const cuts = [0];
  for (const w of weights) {
    acc += (w / sum) * total;
    cuts.push(acc);
  }
  return cuts;
}

/** True when every column has the same width AND every row has the same
 *  height (within float tolerance) — the single source of truth for
 *  "are these really equal-size squares," read by Practice/Test/CFU
 *  generators, never a separately hand-typed true/false flag. */
export function isEvenGrid(uneven: boolean): boolean {
  return !uneven;
}

export interface PartitionGridProps {
  rows: number;
  cols: number;
  width?: number;
  height?: number;
  /** When true, draws visibly uneven cell sizes instead of a true equal-size
   *  grid — Unit 2's "looks partitioned but isn't actually equal squares" trap. */
  uneven?: boolean;
  /** Which hand-authored uneven pattern to use (ignored when uneven=false). */
  unevenVariant?: number;
  /** Tints one row (0-indexed) a second color — used by the "add across
   *  rows" bucket's progressive reveal and by CFU emphasis. */
  highlightRow?: number;
  /** Only show this many rows (progressive reveal for a multi-step problem);
   *  omit/undefined to show every row. */
  revealRows?: number;
  label?: string;
}

export function PartitionGrid({ rows, cols, width = 160, height = 120, uneven = false, unevenVariant = 1, highlightRow, revealRows, label }: PartitionGridProps) {
  const colWeights = weightsFor(cols, uneven, unevenVariant, UNEVEN_COL_WEIGHTS);
  const rowWeights = weightsFor(rows, uneven, unevenVariant, UNEVEN_ROW_WEIGHTS);
  const colCuts = cumulative(colWeights, width);
  const rowCuts = cumulative(rowWeights, height);
  const shownRows = revealRows ?? rows;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      style={{ maxWidth: "100%" }}
      role="img"
      aria-label={label ?? `A rectangle split into ${rows} rows and ${cols} columns${uneven ? ", not actually equal-size squares" : " of equal-size squares"}`}
    >
      <rect x={0} y={0} width={width} height={height} fill={palette.paper} stroke={PIECE_STROKE} strokeWidth={2.5} />
      {Array.from({ length: shownRows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const x = colCuts[c];
          const y = rowCuts[r];
          const w = colCuts[c + 1] - x;
          const h = rowCuts[r + 1] - y;
          const highlighted = highlightRow !== undefined && r === highlightRow;
          return <rect key={`${r}-${c}`} x={x} y={y} width={w} height={h} fill={highlighted ? palette.bSoft : palette.aSoft} stroke={PIECE_STROKE} strokeWidth={1.5} />;
        })
      )}
    </svg>
  );
}
