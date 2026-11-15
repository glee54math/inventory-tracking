import { palette } from "../../../shared/lib/palette";
import { isPrime, type TreeNode } from "../lib/primes";

// A factor tree (Unit 4): each number splits into a factor pair below it until
// only primes are left; primes are circled, the standard way. `levels` limits
// how far down the tree is drawn (1 = just the top number), so Practice can
// show only the first split after a wrong try. Built from lib/primes.ts
// factorTree(), the same tree the explanations describe.

const LEAF_W = 50;
const LEVEL_H = 62;

interface Placed {
  v: number;
  x: number;
  y: number;
  kids: Placed[];
}

const countLeaves = (t: TreeNode, levels: number, d = 1): number => (t.kids && d < levels ? countLeaves(t.kids[0], levels, d + 1) + countLeaves(t.kids[1], levels, d + 1) : 1);
const treeDepth = (t: TreeNode, levels: number, d = 1): number => (t.kids && d < levels ? Math.max(treeDepth(t.kids[0], levels, d + 1), treeDepth(t.kids[1], levels, d + 1)) : d);

function place(t: TreeNode, left: number, d: number, levels: number): Placed {
  if (!t.kids || d >= levels) return { v: t.v, x: left + LEAF_W / 2, y: 26 + (d - 1) * LEVEL_H, kids: [] };
  const w0 = countLeaves(t.kids[0], levels, d + 1) * LEAF_W;
  const a = place(t.kids[0], left, d + 1, levels);
  const b = place(t.kids[1], left + w0, d + 1, levels);
  return { v: t.v, x: (a.x + b.x) / 2, y: 26 + (d - 1) * LEVEL_H, kids: [a, b] };
}

function Draw({ p, ring }: { p: Placed; ring: boolean }) {
  const prime = isPrime(p.v) && p.kids.length === 0;
  return (
    <g>
      {p.kids.map((k, i) => (
        <line key={i} x1={p.x} y1={p.y + 14} x2={k.x} y2={k.y - 16} style={{ stroke: palette.muted, strokeWidth: 2 }} />
      ))}
      {prime && ring && <circle cx={p.x} cy={p.y} r={18} style={{ fill: palette.cSoft, stroke: palette.c, strokeWidth: 2.5 }} />}
      <text x={p.x} y={p.y + 7} textAnchor="middle" style={{ fill: palette.ink, fontSize: 20, fontWeight: 700 }}>
        {p.v}
      </text>
      {p.kids.map((k, i) => (
        <Draw key={i} p={k} ring={ring} />
      ))}
    </g>
  );
}

export interface FactorTreeProps {
  tree: TreeNode;
  /** Rows to draw (default: all). */
  levels?: number;
  /** Circle the primes at the bottom (default true). */
  ringPrimes?: boolean;
  caption?: string;
}

export function FactorTree({ tree, levels = 99, ringPrimes = true, caption }: FactorTreeProps) {
  const w = Math.max(120, countLeaves(tree, levels) * LEAF_W + 10);
  const h = treeDepth(tree, levels) * LEVEL_H;
  const root = place(tree, 5, 1, levels);
  return (
    <figure className="factor-tree" style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} style={{ maxWidth: "100%" }} role="img" aria-label={`Factor tree for ${tree.v}`}>
        <Draw p={root} ring={ringPrimes} />
      </svg>
      {caption && <figcaption className="muted small">{caption}</figcaption>}
    </figure>
  );
}
