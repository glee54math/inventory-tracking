import { palette } from "../../../shared/lib/palette";
import { MathText } from "../../../shared/components/MathText";

export type GridTone = "a" | "b" | "c";

/** One colored run of hundredths squares, e.g. { count: 30, tone: "a" }. */
export interface GridSegment {
  count: number;
  tone: GridTone;
}

const toneFill = (t: GridTone) => (t === "b" ? palette.b : t === "c" ? palette.c : palette.a);

/**
 * Lays colored runs of hundredths out across as many 10×10 grids as they
 * need (one grid = one whole), filling COLUMN by column — so one full column
 * is exactly one tenth, which is the whole point of the picture. This single
 * function decides which cell gets which color for every grid this lab draws
 * (Explore, Practice, Test, CFU), so a picture can never disagree with the
 * number it is drawn from. Always returns at least one grid.
 */
export function gridCells(segments: GridSegment[]): (GridTone | null)[][] {
  const flat: GridTone[] = segments.flatMap((s) => Array.from({ length: Math.max(0, s.count) }, () => s.tone));
  const grids = Math.max(1, Math.ceil(flat.length / 100));
  return Array.from({ length: grids }, (_, g) => Array.from({ length: 100 }, (_, k) => flat[g * 100 + k] ?? null));
}

export interface HundredthsGridProps {
  /** 100 entries, column-major (index k -> column floor(k/10), row k%10). */
  cells: (GridTone | null)[];
  size?: number;
  /** Draw only the 10 column strips (the "tenths view"), no row lines. */
  tenthsOnly?: boolean;
}

/** One whole as a 10×10 square. */
export function HundredthsGrid({ cells, size = 150, tenthsOnly = false }: HundredthsGridProps) {
  const c = size / 10;
  const shaded = cells.filter(Boolean).length;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} style={{ maxWidth: "100%", display: "block" }} role="img" aria-label={`${shaded} of 100 squares shaded`}>
      {cells.map((t, k) => {
        const col = Math.floor(k / 10);
        const row = k % 10;
        return (
          <rect
            key={k}
            x={col * c}
            y={row * c}
            width={c}
            height={c}
            style={{ fill: t ? toneFill(t) : palette.paper, fillOpacity: t ? 0.85 : 1, stroke: tenthsOnly ? "none" : palette.line, strokeWidth: 0.75 }}
          />
        );
      })}
      {/* Column (tenth) dividers are always drawn, a little heavier than the
          hundredths lines, so a tenth strip still reads as one piece. */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={(i + 1) * c} y1={0} x2={(i + 1) * c} y2={size} style={{ stroke: palette.ink, strokeWidth: 1.2, strokeOpacity: 0.55 }} />
      ))}
      <rect x={0} y={0} width={size} height={size} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
    </svg>
  );
}

export interface GridRowProps {
  segments: GridSegment[];
  size?: number;
  tenthsOnly?: boolean;
  /** Plain-text caption under the whole row (HTML, so it wraps — never clips). */
  caption?: string;
}

/** Enough grids (wholes) side by side to hold every segment. */
export function GridRow({ segments, size = 150, tenthsOnly, caption }: GridRowProps) {
  const grids = gridCells(segments);
  return (
    <figure className="dec-grid-row">
      <div className="dec-grid-wrap">
        {grids.map((cells, i) => (
          <HundredthsGrid key={i} cells={cells} size={size} tenthsOnly={tenthsOnly} />
        ))}
      </div>
      {caption && (
        <figcaption className="muted small">
          <MathText>{caption}</MathText>
        </figcaption>
      )}
    </figure>
  );
}
