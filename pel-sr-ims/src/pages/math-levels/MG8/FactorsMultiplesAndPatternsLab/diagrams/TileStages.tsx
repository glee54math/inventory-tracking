import { palette } from "../../../shared/lib/palette";
import { stageTiles } from "../lib/numberTheory";

export interface TileStagesProps {
  /** Tiles in stage 1 (drawn as one column in the first colour). */
  start: number;
  /** Tiles added every stage (each stage adds one more column in the second colour). */
  add: number;
  /** Which stage numbers to draw, e.g. [1, 2, 3]. */
  stages: number[];
  /** Print each stage's tile count under it. */
  showCounts?: boolean;
  width?: number;
}

const T = 16;
const GAP_STAGE = 30;

/**
 * A growing shape pattern: stage s = one column of `start` tiles plus (s − 1)
 * columns of `add` tiles. Keeping each stage's new tiles as their own
 * coloured column makes "it gains `add` tiles every stage" visible, which is
 * exactly the matching number pattern's rule. Tile counts come from
 * stageTiles(), the same function the answer checks use.
 */
export function TileStages({ start, add, stages, showCounts = false, width = 520 }: TileStagesProps) {
  const colH = Math.max(start, add);
  const stageW = (s: number) => s * T;
  let cursor = 6;
  const xs = stages.map((s) => {
    const x = cursor;
    cursor += stageW(s) + GAP_STAGE;
    return x;
  });
  const w = Math.max(cursor - GAP_STAGE + 6, 120);
  const top = 8;
  const floor = top + colH * T;
  const h = floor + (showCounts ? 44 : 26);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={Math.min(width, w * 1.6)} style={{ maxWidth: "100%" }} role="img" aria-label={`Shape pattern: ${stages.map((s) => `stage ${s} has ${stageTiles(start, add, s)} tiles`).join(", ")}`}>
      {stages.map((s, si) => {
        const x0 = xs[si];
        const tiles: { x: number; y: number; first: boolean }[] = [];
        for (let r = 0; r < start; r++) tiles.push({ x: x0, y: floor - (r + 1) * T, first: true });
        for (let c = 1; c < s; c++) for (let r = 0; r < add; r++) tiles.push({ x: x0 + c * T, y: floor - (r + 1) * T, first: false });
        return (
          <g key={s}>
            {tiles.map((t, i) => (
              <rect key={i} x={t.x} y={t.y} width={T - 1} height={T - 1} rx={2} style={{ fill: t.first ? palette.a : palette.b, stroke: palette.paper, strokeWidth: 1 }} />
            ))}
            <text x={x0 + stageW(s) / 2} y={floor + 17} textAnchor="middle" style={{ fill: palette.ink, fontSize: 12, fontWeight: 700 }}>
              Stage {s}
            </text>
            {showCounts && (
              <text x={x0 + stageW(s) / 2} y={floor + 34} textAnchor="middle" style={{ fill: palette.muted, fontSize: 12 }}>
                {stageTiles(start, add, s)} tiles
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
