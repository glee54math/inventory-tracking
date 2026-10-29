import { palette, diagramFont } from "../../../shared/lib/palette";

export type TileMode = "clean" | "gapped" | "overlap";

export interface TileLayout {
  /** How many tiles are actually drawn — equals `length` for "clean", fewer
   *  than `length` for "gapped" (gaps waste room, so fewer tiles than the
   *  true length were needed to span it), more than `length` for "overlap"
   *  (each overlap wastes coverage, so more tiles than the true length were
   *  needed). */
  tilesShown: number;
  /** Pixel gap between adjacent tiles ("gapped") or pixel overlap amount
   *  ("overlap") — whichever is relevant; 0 for "clean". Computed so the
   *  tiles' total drawn span always exactly equals the object's own true
   *  pixel span (length * unitPx), which is what makes the flawed attempt
   *  look plausible at a glance instead of obviously wrong. */
  spacingPx: number;
}

/**
 * The ONE function that derives how many tiles get drawn and how far apart,
 * for a given true `length` and `mode` — both UnitRuler's rendering and
 * MeasuringWithUnits.tsx's "how many tiles would it actually take" correct
 * answer are always `length` itself, never re-derived independently of this
 * function, so a flawed-measurement diagram and its graded answer can never
 * silently disagree about what the true length is.
 */
export function tileLayout(length: number, mode: TileMode, miscount: number): TileLayout {
  if (mode === "clean") return { tilesShown: length, spacingPx: 0 };
  if (mode === "gapped") {
    const tilesShown = Math.max(2, length - miscount);
    // (tilesShown - 1) gaps must absorb the extra (length - tilesShown) units
    // of room, spread evenly, so the gapped row's total span still matches
    // the object's true span exactly.
    const gapUnits = (length - tilesShown) / (tilesShown - 1);
    return { tilesShown, spacingPx: gapUnits };
  }
  // overlap
  const tilesShown = length + miscount;
  const overlapUnits = (tilesShown - length) / (tilesShown - 1);
  return { tilesShown, spacingPx: overlapUnits };
}

export interface UnitRulerProps {
  /** True length, whole units — always an integer by construction (1.MD.2
   *  stops at whole-number-of-units lengths; a landing-between-marks /
   *  fractional case is out of scope, a 3rd-grade skill — see
   *  MeasuringWithUnits.tsx's scope-boundary note). */
  length: number;
  mode: TileMode;
  /** Only meaningful for "gapped"/"overlap" — how many tiles the flawed
   *  attempt is short (gapped) or over (overlap) by. Ignored for "clean". */
  miscount?: number;
  tone?: "a" | "b" | "c";
}

const UNIT_PX = 30;
const PAD = 14;
const TILE_H = 44;
const OBJECT_Y = 0;
const TILE_Y = 54;

/**
 * Draws the true object as a solid bar of exact length `length` (in whole
 * units), with a row of individual unit tiles overlaid beneath it — laid
 * cleanly (one tile per unit, touching, no gaps/overlaps), gapped (fewer
 * tiles than the true length, spaced apart so the row still spans the same
 * total distance), or overlapping (more tiles than the true length,
 * overlapping so the row still spans the same total distance). The object
 * bar's pixel span and the tile row's pixel span are ALWAYS equal — only
 * how that span got divided into tiles differs — so a student can see the
 * gap/overlap mismatch directly: the object didn't change size, but the
 * number of tiles it took to cover it did.
 */
export function UnitRuler({ length, mode, miscount = 1, tone = "a" }: UnitRulerProps) {
  const { tilesShown, spacingPx: spacingUnits } = tileLayout(length, mode, miscount);
  const totalSpan = length * UNIT_PX;
  const width = PAD * 2 + totalSpan;
  const height = TILE_Y + TILE_H + 10;
  const fill = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;

  // Tile widths/positions: each tile is UNIT_PX wide for "clean"/"gapped"
  // (gaps shrink the space BETWEEN tiles, not the tiles themselves) — for
  // "overlap", each tile is still UNIT_PX wide, but adjacent tiles are drawn
  // shifted left by the overlap amount so they visibly cover common ground.
  const tileX: number[] = [];
  if (mode === "overlap") {
    const overlapPx = spacingUnits * UNIT_PX;
    for (let i = 0; i < tilesShown; i++) tileX.push(i * (UNIT_PX - overlapPx));
  } else {
    const gapPx = spacingUnits * UNIT_PX;
    for (let i = 0; i < tilesShown; i++) tileX.push(i * (UNIT_PX + gapPx));
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`An object ${length} units long, with ${tilesShown} tiles laid ${mode === "clean" ? "end to end with no gaps or overlaps" : mode === "gapped" ? "with gaps between them" : "overlapping each other"}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      <rect x={PAD} y={OBJECT_Y + 8} width={totalSpan} height={28} rx={6} fill={fill} opacity={0.22} stroke={fill} strokeWidth={2} />
      {tileX.map((x, i) => (
        <g key={i}>
          <rect
            x={PAD + x}
            y={TILE_Y}
            width={UNIT_PX - 3}
            height={TILE_H}
            rx={4}
            fill={palette.paper}
            stroke={fill}
            strokeWidth={2.5}
          />
          <text x={PAD + x + (UNIT_PX - 3) / 2} y={TILE_Y + TILE_H / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={palette.muted}>
            {i + 1}
          </text>
        </g>
      ))}
      <line x1={PAD} y1={TILE_Y - 6} x2={PAD} y2={TILE_Y + TILE_H + 6} stroke={palette.line} strokeDasharray="3 3" />
      <line x1={PAD + totalSpan} y1={TILE_Y - 6} x2={PAD + totalSpan} y2={TILE_Y + TILE_H + 6} stroke={palette.line} strokeDasharray="3 3" />
    </svg>
  );
}
