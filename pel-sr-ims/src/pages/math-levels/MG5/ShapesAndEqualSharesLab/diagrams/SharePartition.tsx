import { palette } from "../../../shared/lib/palette";

// ============================================================================
// Partitioning a circle or RECTANGLE (not square — this lab's plan is
// explicit that the whole should be a genuine rectangle, not a square) into
// 2, 3, or 4 equal (or deliberately unequal) shares, for Unit 3 (2.G.3).
//
// Checked shared/diagrams/ (FractionBar shades a 1-D numeric-fraction bar,
// a different idea from literally cutting a 2-D shape) and
// MG4/ShapesAndFractionsIntroLab/diagrams/ShapePartition.tsx (the direct
// sibling precedent for 1.G.3 — halves/fourths of a circle or SQUARE only,
// no thirds) first. This is a new, lab-local file rather than a duplicate:
// it adds thirds (new at Grade 2) and swaps the square for a genuine
// rectangle specifically so a "different cutting pattern, same equal
// shares" example (stripesV vs stripesH, or a straight cut vs a diagonal
// cut for halves) can show pieces that are visibly DIFFERENT SHAPES (e.g.
// two triangles vs two sub-rectangles) while still being equal-area halves
// of the identical whole — the plan's explicit "equal shares of identical
// wholes need not have the same shape" requirement, which a square's own
// symmetry would hide.
//
// PARTITION_META is the single table BOTH the renderer below AND every
// Practice/Test/CFU generator in this lab's Unit 3 reads for "how many
// pieces" / "are they equal" / "what do we call one piece," so the picture
// and the question asked about it can never silently disagree.
// ============================================================================

export type ShareShape = "circle" | "rectangle";
export type SharePattern = "halves-equal" | "halves-unequal" | "thirds-equal" | "thirds-unequal" | "fourths-equal" | "fourths-unequal";
/** Rectangle-only; ignored for circle. "diag" is only valid for halves (2
 *  pieces) — it's the deliberately-different-shaped-pieces cut described
 *  above. "stripesV"/"stripesH" are the two genuinely different-LOOKING
 *  equal cuts available at any piece count. */
export type RectCutStyle = "stripesV" | "stripesH" | "diag";

export interface PartitionMeta {
  pieceCount: number;
  equal: boolean;
  shareName: "half" | "third" | "fourth";
}

export const PARTITION_META: Record<SharePattern, PartitionMeta> = {
  "halves-equal": { pieceCount: 2, equal: true, shareName: "half" },
  "halves-unequal": { pieceCount: 2, equal: false, shareName: "half" },
  "thirds-equal": { pieceCount: 3, equal: true, shareName: "third" },
  "thirds-unequal": { pieceCount: 3, equal: false, shareName: "third" },
  "fourths-equal": { pieceCount: 4, equal: true, shareName: "fourth" },
  "fourths-unequal": { pieceCount: 4, equal: false, shareName: "fourth" },
};

const PIECE_FILLS = [palette.aSoft, palette.bSoft, palette.cSoft, palette.bSoft];

interface Piece {
  points?: string;
  path?: string;
  fill: string;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Circle pieces as pie wedges from the center — the ONE geometric routine
 *  for every circle pattern; only `fractions` changes between piece counts
 *  and equal/unequal. */
function circleWedges(cx: number, cy: number, r: number, fractions: number[], startDeg = -90): Piece[] {
  const pt = (deg: number) => ({ x: cx + r * Math.cos(toRad(deg)), y: cy + r * Math.sin(toRad(deg)) });
  let angle = startDeg;
  return fractions.map((frac, i) => {
    const sweepDeg = frac * 360;
    const p0 = pt(angle);
    const p1 = pt(angle + sweepDeg);
    const largeArc = sweepDeg > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
    angle += sweepDeg;
    return { path, fill: PIECE_FILLS[i % PIECE_FILLS.length] };
  });
}

/** Rectangle pieces — vertical stripes, horizontal stripes, or (halves
 *  only) a single diagonal cut into two triangles. `fractions` gives each
 *  piece's share of the whole (summing to 1); omit for a true equal cut. */
function rectPieces(x: number, y: number, w: number, h: number, pieceCount: number, cutStyle: RectCutStyle, fractions?: number[]): Piece[] {
  if (cutStyle === "diag" && pieceCount === 2) {
    return [
      { points: `${x},${y} ${x + w},${y} ${x},${y + h}`, fill: PIECE_FILLS[0] },
      { points: `${x + w},${y} ${x + w},${y + h} ${x},${y + h}`, fill: PIECE_FILLS[1] },
    ];
  }
  const fracs = fractions ?? Array.from({ length: pieceCount }, () => 1 / pieceCount);
  if (cutStyle === "stripesH") {
    let cy = y;
    return fracs.map((f, i) => {
      const hh = h * f;
      const piece: Piece = { points: `${x},${cy} ${x + w},${cy} ${x + w},${cy + hh} ${x},${cy + hh}`, fill: PIECE_FILLS[i % PIECE_FILLS.length] };
      cy += hh;
      return piece;
    });
  }
  // stripesV (also the fallback for an unsupported diag+pieceCount!==2 combo)
  let cx = x;
  return fracs.map((f, i) => {
    const ww = w * f;
    const piece: Piece = { points: `${cx},${y} ${cx + ww},${y} ${cx + ww},${y + h} ${cx},${y + h}`, fill: PIECE_FILLS[i % PIECE_FILLS.length] };
    cx += ww;
    return piece;
  });
}

/** A clearly-unequal set of fractions for `pieceCount` pieces, summing to 1,
 *  with no piece within 8 percentage points of the true equal share — so
 *  "are these the same size" always has an unambiguous visual answer. */
export function unequalFractions(pieceCount: number, skew = 0.22): number[] {
  if (pieceCount === 2) return [0.5 - skew, 0.5 + skew];
  if (pieceCount === 3) return [1 / 3 - skew, 1 / 3, 1 / 3 + skew];
  return [0.25 - skew, 0.25 - skew * 0.4, 0.25 + skew * 0.4, 0.25 + skew];
}

export interface SharePartitionProps {
  shape: ShareShape;
  pattern: SharePattern;
  /** Rectangle-only; ignored for circle. Defaults to "stripesV". */
  cutStyle?: RectCutStyle;
  /** Circle-only cosmetic rotation (degrees); ignored for rectangle. */
  startDeg?: number;
  /** Required for an "-unequal" pattern (use unequalFractions()); ignored
   *  for an "-equal" pattern, which always draws a true equal cut. */
  fractions?: number[];
  width?: number;
  height?: number;
  label?: string;
}

export function SharePartition({ shape, pattern, cutStyle = "stripesV", startDeg = -90, fractions, width = 150, height = 110, label }: SharePartitionProps) {
  const meta = PARTITION_META[pattern];
  const pad = 8;
  let pieces: Piece[];

  if (shape === "circle") {
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const r = size / 2 - pad;
    const fracs = meta.equal ? Array.from({ length: meta.pieceCount }, () => 1 / meta.pieceCount) : fractions ?? unequalFractions(meta.pieceCount);
    pieces = circleWedges(cx, cy, r, fracs, startDeg);
  } else {
    const w = width - pad * 2;
    const h = height - pad * 2;
    const x = pad;
    const y = pad;
    const fracs = meta.equal ? undefined : fractions ?? unequalFractions(meta.pieceCount);
    pieces = rectPieces(x, y, w, h, meta.pieceCount, meta.equal && cutStyle === "diag" && meta.pieceCount !== 2 ? "stripesV" : cutStyle, fracs);
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      style={{ maxWidth: "100%" }}
      role="img"
      aria-label={label ?? `A ${shape} cut into ${meta.pieceCount} ${meta.equal ? "equal" : "unequal"} pieces`}
    >
      {pieces.map((p, i) =>
        p.points ? (
          <polygon key={i} points={p.points} style={{ fill: p.fill, stroke: palette.ink, strokeWidth: 2 }} />
        ) : (
          <path key={i} d={p.path} style={{ fill: p.fill, stroke: palette.ink, strokeWidth: 2 }} />
        )
      )}
    </svg>
  );
}
