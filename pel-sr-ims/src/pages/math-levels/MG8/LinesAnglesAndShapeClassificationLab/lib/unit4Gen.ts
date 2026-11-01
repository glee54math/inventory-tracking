import { pick, randInt } from "../../../shared/lib/math";
import { d4, quadBestName, quadCategories, quadInfo, type Pt, type QuadCategory } from "./geometry";

// ============================================================================
// Unit 4 (Classifying Quadrilaterals) generators, shared by Practice and Test.
// Each kind is BUILT from integer side vectors, then checked with
// quadBestName()/quadCategories() — exact integer classification (MG7
// QuadrilateralsAndPartitioningLab's QuadBuilder precedent) — and rejected if
// it accidentally lands somewhere else (e.g. a "rhombus" whose corners happen
// to be square).
// ============================================================================

export type QuadKind = "square" | "rectangle" | "rhombus" | "parallelogram" | "trapezoid" | "kite" | "irregular";

function parallelogramFrom(u: Pt, v: Pt): Pt[] {
  return [
    [0, 0],
    u,
    [u[0] + v[0], u[1] + v[1]],
    v,
  ];
}

function base(kind: QuadKind): Pt[] {
  switch (kind) {
    case "square": {
      if (Math.random() < 0.5) {
        const s = randInt(3, 6);
        return parallelogramFrom([s, 0], [0, s]);
      }
      const a = randInt(2, 4);
      const b = randInt(1, 3);
      return parallelogramFrom([a, b], [-b, a]);
    }
    case "rectangle": {
      if (Math.random() < 0.6) return parallelogramFrom([randInt(3, 8), 0], [0, randInt(2, 5)]);
      const m = randInt(1, 3);
      const n = randInt(1, 2);
      return parallelogramFrom([2 * m, m], [-n, 2 * n]);
    }
    case "rhombus": {
      const r = randInt(0, 2);
      if (r === 0) {
        const w = randInt(2, 4);
        const h = randInt(2, 5);
        return [
          [0, h],
          [w, 0],
          [2 * w, h],
          [w, 2 * h],
        ];
      }
      if (r === 1) {
        const a = randInt(1, 4);
        const b = randInt(1, 4);
        return parallelogramFrom([a, b], [b, a]);
      }
      return parallelogramFrom([5, 0], pick([[3, 4], [-3, 4], [4, 3], [-4, 3]] as Pt[]));
    }
    case "parallelogram":
      return parallelogramFrom([randInt(3, 7), 0], [pick([-3, -2, -1, 1, 2, 3]), randInt(2, 5)]);
    case "trapezoid": {
      const top = randInt(1, 4);
      const l = randInt(0, 3);
      const r = randInt(0, 3);
      const h = randInt(2, 5);
      return [
        [l, 0],
        [l + top, 0],
        [l + top + r, h],
        [0, h],
      ];
    }
    case "kite": {
      const w = randInt(2, 4);
      const k = randInt(1, 3);
      const H = randInt(k + 2, 8);
      return [
        [w, 0],
        [2 * w, k],
        [w, H],
        [0, k],
      ];
    }
    case "irregular":
      return Array.from({ length: 4 }, (_, i) => [randInt(0, 3) + (i === 1 || i === 2 ? 4 : 0), randInt(0, 2) + (i >= 2 ? 3 : 0)] as Pt);
  }
}

export interface QuadSpec {
  kind: QuadKind;
  pts: Pt[];
  cats: QuadCategory[];
  best: QuadCategory | "quadrilateral";
  parallelPairs: number;
  rightAngles: number;
}

export function makeQuad(kind: QuadKind): QuadSpec {
  for (;;) {
    const b = base(kind);
    const k = randInt(0, 7);
    const t = b.map((p) => d4(p, k));
    const minX = Math.min(...t.map((p) => p[0]));
    const minY = Math.min(...t.map((p) => p[1]));
    const pts = t.map((p) => [p[0] - minX + 1, p[1] - minY + 1] as Pt);
    const info = quadInfo(pts);
    if (!info.convex) continue;
    if (Math.max(...pts.map((p) => p[0])) > 10 || Math.max(...pts.map((p) => p[1])) > 9) continue;
    // every side at least 2 units so marks have room
    if (info.sideSq.some((s) => s < 4)) continue;
    const best = quadBestName(pts);
    const want = kind === "kite" || kind === "irregular" ? "quadrilateral" : kind;
    if (best !== want) continue;
    if (kind === "kite" && info.maxEqualSides !== 2) continue; // a real kite: 2 pairs of equal neighbors, no parallel
    if (kind === "irregular" && (info.rightAngles > 0 || info.maxEqualSides > 1)) continue;
    return { kind, pts, cats: quadCategories(pts), best, parallelPairs: info.parallelPairs, rightAngles: info.rightAngles };
  }
}

const ORDER: QuadCategory[] = ["parallelogram", "trapezoid", "rectangle", "rhombus", "square"];

/** "parallelogram, rectangle, rhombus, and square" */
export function catList(cats: QuadCategory[]): string {
  const c = ORDER.filter((x) => cats.includes(x)).map((x) => `${x}`);
  if (c.length === 0) return "none of the five special names";
  if (c.length === 1) return `only a ${c[0]}`;
  if (c.length === 2) return `${c[0]} and ${c[1]}`;
  return `${c.slice(0, -1).join(", ")}, and ${c[c.length - 1]}`;
}

/** Wrong category lists for a multi-category shape: just the most specific
 *  name (the "boxes are exclusive" misconception), one parent dropped, and one
 *  category that doesn't fit added. */
export function wrongCatLists(cats: QuadCategory[], best: QuadCategory): string[] {
  const out = new Set<string>();
  out.add(catList([best]));
  if (cats.length >= 2) out.add(catList(cats.filter((c) => c === best || c !== "parallelogram")));
  const extra = (["rhombus", "rectangle", "trapezoid"] as QuadCategory[]).find((c) => !cats.includes(c));
  if (extra) out.add(catList([...cats, extra]));
  out.delete(catList(cats));
  return [...out];
}

export const NAME_CHOICES: (QuadCategory | "none")[] = ["parallelogram", "rectangle", "rhombus", "square", "trapezoid", "none"];
export const NONE_NAME = "none of the five — just a quadrilateral";
export const nameText = (n: QuadCategory | "none" | "quadrilateral"): string => (n === "none" || n === "quadrilateral" ? NONE_NAME : n);
