import { palette, diagramFont } from "../../../shared/lib/palette";

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);
const ptsAttr = (pts: [number, number][]) => pts.map((p) => p.join(",")).join(" ");

export interface ComposeRecipe {
  id: string;
  resultLabel: string;
  pieceLabel: string;
  /** Faint outline of the big target shape, shown before every slot is filled. */
  outlineHint: [number, number][];
  /** One polygon per slot, in the big shape's own coordinates — filled in,
   *  in order, as pieces are placed. */
  slots: [number, number][][];
  /** One polygon per tray piece (same length as `slots`), positioned off to
   *  the side, in CLICK order — tray[i] is removed once `placed > i`. */
  tray: [number, number][][];
}

/** Two congruent right triangles, split along a square's own diagonal —
 *  the classic single-target "2 triangles make 1 square" composition. */
export const RECIPE_TRIANGLES_TO_SQUARE: ComposeRecipe = {
  id: "trianglesToSquare",
  resultLabel: "Square",
  pieceLabel: "Triangle",
  outlineHint: [
    [55, 45],
    [165, 45],
    [165, 155],
    [55, 155],
  ],
  slots: [
    [
      [55, 45],
      [165, 45],
      [55, 155],
    ],
    [
      [165, 45],
      [165, 155],
      [55, 155],
    ],
  ],
  tray: [
    [
      [225, 50],
      [260, 50],
      [225, 85],
    ],
    [
      [225, 115],
      [260, 115],
      [225, 150],
    ],
  ],
};

/** Two congruent small squares, side by side — "2 squares make 1 rectangle." */
export const RECIPE_SQUARES_TO_RECTANGLE: ComposeRecipe = {
  id: "squaresToRectangle",
  resultLabel: "Rectangle",
  pieceLabel: "Square",
  outlineHint: [
    [40, 60],
    [180, 60],
    [180, 140],
    [40, 140],
  ],
  slots: [
    [
      [40, 60],
      [110, 60],
      [110, 140],
      [40, 140],
    ],
    [
      [110, 60],
      [180, 60],
      [180, 140],
      [110, 140],
    ],
  ],
  tray: [
    [
      [225, 50],
      [260, 50],
      [260, 85],
      [225, 85],
    ],
    [
      [225, 110],
      [260, 110],
      [260, 145],
      [225, 145],
    ],
  ],
};

export const COMPOSE_RECIPES: ComposeRecipe[] = [RECIPE_TRIANGLES_TO_SQUARE, RECIPE_SQUARES_TO_RECTANGLE];

export interface ComposeSingleProps {
  recipe: ComposeRecipe;
  /** How many slots/tray pieces have been placed so far, in order. */
  placed: number;
  onPlace?: () => void;
  tone?: "a" | "b" | "c";
}

/** Click-to-place composition sandbox: click any remaining tray piece to
 *  drop it into the next open slot of the target outline — used for both
 *  K.G.6 recipes above (which specific recipe to show is randomized by the
 *  caller, not by this component). */
export function ComposeSingle({ recipe, placed, onPlace, tone = "a" }: ComposeSingleProps) {
  const color = toneColor(tone);
  const done = placed >= recipe.slots.length;
  const interactive = !!onPlace;
  return (
    <svg
      viewBox="0 0 280 200"
      role="img"
      aria-label={`a ${recipe.pieceLabel.toLowerCase()} tray and a target outline to fill`}
      style={{ display: "block", width: "100%", maxWidth: 280, height: "auto", fontFamily: diagramFont }}
    >
      <polygon points={ptsAttr(recipe.outlineHint)} fill="none" stroke={palette.line} strokeWidth={3} strokeDasharray={done ? undefined : "6 6"} />
      {recipe.slots.map((slot, i) => i < placed && <polygon key={`slot${i}`} points={ptsAttr(slot)} fill={color} stroke={palette.ink} strokeWidth={2} />)}
      {recipe.tray.map(
        (piece, i) =>
          i >= placed && (
            <polygon
              key={`tray${i}`}
              points={ptsAttr(piece)}
              fill={palette.c}
              stroke={palette.ink}
              strokeWidth={2}
              style={interactive ? { cursor: "pointer" } : undefined}
              onClick={interactive ? onPlace : undefined}
            />
          )
      )}
    </svg>
  );
}

export interface ComposeOpenStripProps {
  targetLength: number;
  /** Lengths (1 = a unit square piece, 2 = a domino piece) placed so far, in order. */
  placedLengths: number[];
  tone?: "a" | "b" | "c";
}

/** A strip of fixed total length, filled with a student-chosen mix of
 *  length-1 ("square") and length-2 ("domino") pieces — the open-ended
 *  composition sandbox: many different piece combinations fill the exact
 *  same strip, which is the point (K.G.6's "more than one valid
 *  arrangement" bucket). Purely a display of whatever `placedLengths` the
 *  caller already has (same controlled-component pattern as every other
 *  diagram here) — the caller owns the tray buttons that add/remove pieces. */
export function ComposeOpenStrip({ targetLength, placedLengths, tone = "a" }: ComposeOpenStripProps) {
  const unit = 26;
  const total = targetLength * unit;
  const color = toneColor(tone);
  let x = 10;
  const usedLen = placedLengths.reduce((a, b) => a + b, 0);
  const pieces = placedLengths.map((len, i) => {
    const w = len * unit - 3;
    const el = <rect key={i} x={x} y={60} width={w} height={54} fill={len === 1 ? color : palette.c} stroke={palette.ink} strokeWidth={2} />;
    x += len * unit;
    return el;
  });
  return (
    <svg
      viewBox={`0 0 ${Math.max(total + 20, 220)} 150`}
      role="img"
      aria-label={`a strip to fill exactly, ${usedLen} of ${targetLength} units filled so far`}
      style={{ display: "block", width: "100%", maxWidth: 320, height: "auto", fontFamily: diagramFont }}
    >
      <rect x={10} y={60} width={total} height={54} fill="none" stroke={palette.line} strokeWidth={3} strokeDasharray="6 6" />
      {pieces}
      <text x={10} y={135} fontSize={14} fill={palette.muted}>
        {usedLen} of {targetLength} units filled
      </text>
    </svg>
  );
}
