import { palette } from "../../../shared/lib/palette";

// ============================================================================
// Partitioning a circle or square into equal (or deliberately UNequal) shares.
// Checked shared/diagrams/ first per this build's guardrails — FractionBar
// there shades a 1-D strip of a fraction's numerator/denominator, which is a
// different idea (a bar model for a numeric fraction) from literally cutting
// a 2-D shape into pieces of varying equal/unequal area, so this is a new,
// lab-local component (first consumer), not a duplicate of something shared.
//
// PARTITION_META is the single table BOTH the renderer below AND every
// Practice/Test/CFU generator in PartitioningShapes.tsx reads for
// "how many pieces" / "are they equal" — so the picture and the question
// being asked about it can never silently disagree.
// ============================================================================

export type PartitionShape = "circle" | "square";
export type SharePattern = "halves-equal" | "halves-unequal" | "fourths-equal" | "fourths-unequal";
/** Only meaningful for shape="square" + pattern="fourths-equal" — the two
 *  genuinely different valid ways to cut a square into 4 equal pieces that
 *  Unit 3's plan explicitly calls for (a plus-cut of 4 small squares vs an
 *  X-cut of 4 triangles), so "fourths" reads as "4 equal pieces," not "one
 *  specific picture." Ignored everywhere else (a circle's 4 equal wedges
 *  look the same regardless of starting angle, so there's no second
 *  "pattern" to contrast there — only a cosmetic rotation). */
export type SquareCutStyle = "plus" | "x";

export interface PartitionMeta {
  pieceCount: number;
  equal: boolean;
  shareName: "half" | "fourth";
}

export const PARTITION_META: Record<SharePattern, PartitionMeta> = {
  "halves-equal": { pieceCount: 2, equal: true, shareName: "half" },
  "halves-unequal": { pieceCount: 2, equal: false, shareName: "half" },
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

/**
 * Circle pieces as pie wedges from the center — the ONE geometric routine
 * used for all 4 circle patterns; only `fractions` (how much of the full
 * circle each wedge takes) changes between "halves"/"fourths" and
 * "equal"/"unequal". Equal wedges happen to line up into a single straight
 * cut (2 equal wedges = one diameter; 4 equal wedges = a plus or X,
 * depending on `startDeg`), so this one function already produces the
 * "ordinary-looking" cut for the equal cases for free.
 */
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

/** Square pieces — each named pattern gets its own small, explicit geometry
 *  (matching this codebase's convention of hand-drawing a fixed small set of
 *  diagrams rather than a fully general polygon-clipping engine). */
function squarePieces(x: number, y: number, size: number, pattern: SharePattern, cutStyle: SquareCutStyle, orientation: "v" | "h" | "diag", unequalFractions: number[]): Piece[] {
  const x2 = x + size;
  const y2 = y + size;
  const mid = x + size / 2;
  const midY = y + size / 2;

  if (pattern === "halves-equal" || pattern === "halves-unequal") {
    const frac = pattern === "halves-equal" ? 0.5 : unequalFractions[0];
    if (orientation === "diag") {
      // Equal halves only ever use the true diagonal here (an "unequal
      // diagonal" cut wouldn't read as a single clean line a 1st grader
      // would recognize as a cut at all), so halves-unequal never reaches
      // this branch — see makeSquareOrientation below.
      return [
        { points: `${x},${y} ${x2},${y} ${x2},${y2}`, fill: PIECE_FILLS[0] },
        { points: `${x},${y} ${x2},${y2} ${x},${y2}`, fill: PIECE_FILLS[1] },
      ];
    }
    if (orientation === "v") {
      const cut = x + size * frac;
      return [
        { points: `${x},${y} ${cut},${y} ${cut},${y2} ${x},${y2}`, fill: PIECE_FILLS[0] },
        { points: `${cut},${y} ${x2},${y} ${x2},${y2} ${cut},${y2}`, fill: PIECE_FILLS[1] },
      ];
    }
    const cutY = y + size * frac;
    return [
      { points: `${x},${y} ${x2},${y} ${x2},${cutY} ${x},${cutY}`, fill: PIECE_FILLS[0] },
      { points: `${x},${cutY} ${x2},${cutY} ${x2},${y2} ${x},${y2}`, fill: PIECE_FILLS[1] },
    ];
  }

  // fourths-equal / fourths-unequal
  if (pattern === "fourths-equal" && cutStyle === "x") {
    const c = { x: mid, y: midY };
    return [
      { points: `${c.x},${c.y} ${x},${y} ${x2},${y}`, fill: PIECE_FILLS[0] }, // top
      { points: `${c.x},${c.y} ${x2},${y} ${x2},${y2}`, fill: PIECE_FILLS[1] }, // right
      { points: `${c.x},${c.y} ${x2},${y2} ${x},${y2}`, fill: PIECE_FILLS[2] }, // bottom
      { points: `${c.x},${c.y} ${x},${y2} ${x},${y}`, fill: PIECE_FILLS[3] }, // left
    ];
  }
  // plus-cut (equal) or an off-center plus-cut (unequal)
  const vFrac = pattern === "fourths-equal" ? 0.5 : unequalFractions[0];
  const hFrac = pattern === "fourths-equal" ? 0.5 : unequalFractions[1];
  const vx = x + size * vFrac;
  const hy = y + size * hFrac;
  return [
    { points: `${x},${y} ${vx},${y} ${vx},${hy} ${x},${hy}`, fill: PIECE_FILLS[0] },
    { points: `${vx},${y} ${x2},${y} ${x2},${hy} ${vx},${hy}`, fill: PIECE_FILLS[1] },
    { points: `${vx},${hy} ${x2},${hy} ${x2},${y2} ${vx},${y2}`, fill: PIECE_FILLS[2] },
    { points: `${x},${hy} ${vx},${hy} ${vx},${y2} ${x},${y2}`, fill: PIECE_FILLS[3] },
  ];
}

export interface ShapePartitionProps {
  shape: PartitionShape;
  pattern: SharePattern;
  /** Square-only; ignored for circle. Defaults to "plus". */
  cutStyle?: SquareCutStyle;
  /** Square halves only: "v" | "h" | "diag". Circle halves/fourths: a start
   *  angle in degrees (purely cosmetic rotation of the wedges). Defaults
   *  pick something reasonable per shape/pattern when omitted. */
  orientation?: "v" | "h" | "diag" | number;
  /** For an "-unequal" pattern, how uneven the pieces are — one fraction per
   *  piece for halves (length 1, the first piece's share; must be != 0.5),
   *  or [vFrac, hFrac] for a square fourths-unequal plus-cut, or a full
   *  fractions array (any length, summing to 1) for a circle. Each caller
   *  supplies its own so Practice/Test can randomize "how unequal" while
   *  this component only ever draws whatever it's given. */
  unequalFractions?: number[];
  width?: number;
  height?: number;
  label?: string;
}

export function ShapePartition({ shape, pattern, cutStyle = "plus", orientation, unequalFractions, width = 130, height = 130, label }: ShapePartitionProps) {
  const meta = PARTITION_META[pattern];
  const pad = 8;
  let pieces: Piece[];

  if (shape === "circle") {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) / 2 - pad;
    const startDeg = typeof orientation === "number" ? orientation : -90;
    const fractions =
      pattern === "halves-equal"
        ? [0.5, 0.5]
        : pattern === "fourths-equal"
          ? [0.25, 0.25, 0.25, 0.25]
          : unequalFractions ?? (meta.pieceCount === 2 ? [0.28, 0.72] : [0.1, 0.4, 0.15, 0.35]);
    pieces = circleWedges(cx, cy, r, fractions, startDeg);
  } else {
    const size = Math.min(width, height) - pad * 2;
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    const vhOrientation = (orientation === "v" || orientation === "h" || orientation === "diag" ? orientation : "v") as "v" | "h" | "diag";
    const unequal = unequalFractions ?? (meta.pieceCount === 2 ? [0.3] : [0.3, 0.65]);
    pieces = squarePieces(x, y, size, pattern, cutStyle, pattern === "halves-unequal" ? (vhOrientation === "diag" ? "v" : vhOrientation) : vhOrientation, unequal);
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={label ?? `A ${shape} cut into ${meta.pieceCount} ${meta.equal ? "equal" : "unequal"} pieces`}>
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
