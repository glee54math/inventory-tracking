import { palette, diagramFont } from "../../../shared/lib/palette";

const CLUSTER_W = 140;
const HEIGHT = 170;
const R = 11;

/** Pure layout for one cluster of counters, independent of PairCounters.tsx —
 *  this diagram never needs to show index-order pairing lines, just two
 *  clean side-by-side piles, so it keeps its own simpler grid layout rather
 *  than sharing layoutPositions(). */
function clusterPositions(count: number): { x: number; y: number }[] {
  if (count <= 0) return [];
  const cols = Math.min(4, Math.ceil(Math.sqrt(count)));
  const rows = Math.ceil(count / cols);
  const gap = 30;
  const pts: { x: number; y: number }[] = [];
  const totalH = gap * (rows - 1);
  const startY = (HEIGHT - totalH) / 2;
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const inRow = Math.min(cols, count - r * cols);
    const rowTotalW = gap * (inRow - 1);
    const rowStartX = (CLUSTER_W - rowTotalW) / 2;
    pts.push({ x: rowStartX + c * gap, y: startY + r * gap });
  }
  return pts;
}

export interface EqualGroupsProps {
  groupA: number;
  groupB: number;
  /** Tints both clusters the SAME tone when true (the equal-addends case,
   *  where the whole point is that the two groups are identical) — the two
   *  clusters get distinct colors otherwise (used for the invalid-equation
   *  trap bucket, where the two addends genuinely differ and shouldn't look
   *  like a matched pair). */
  sameColor?: boolean;
}

/** Two clusters of counters side by side with a "+" between them — the
 *  concrete stand-in for "an even number written as two addends," used by
 *  Unit 2 for both the valid equal-addends case and the unequal-addends
 *  trap case. */
export function EqualGroups({ groupA, groupB, sameColor = true }: EqualGroupsProps) {
  const ptsA = clusterPositions(groupA);
  const ptsB = clusterPositions(groupB);
  const colorA = palette.a;
  const colorB = sameColor ? palette.a : palette.b;
  const width = CLUSTER_W * 2 + 50;
  return (
    <svg
      viewBox={`0 0 ${width} ${HEIGHT}`}
      role="img"
      aria-label={`a group of ${groupA} and a group of ${groupB}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {ptsA.map((p, i) => (
        <circle key={`a${i}`} cx={p.x} cy={p.y} r={R} fill={colorA} stroke={palette.paper} strokeWidth={2} />
      ))}
      <text x={CLUSTER_W + 25} y={HEIGHT / 2 + 8} textAnchor="middle" fontSize={26} fontWeight={800} fill={palette.muted}>
        +
      </text>
      {ptsB.map((p, i) => (
        <circle key={`b${i}`} cx={CLUSTER_W + 50 + p.x} cy={p.y} r={R} fill={colorB} stroke={palette.paper} strokeWidth={2} />
      ))}
    </svg>
  );
}
