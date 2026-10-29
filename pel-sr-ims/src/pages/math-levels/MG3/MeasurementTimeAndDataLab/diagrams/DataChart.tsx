import { palette, diagramFont } from "../../../shared/lib/palette";

export interface Category {
  label: string;
  glyph: string; // a single emoji representing one item of this category
  count: number;
  tone?: "a" | "b" | "c";
}

const toneFill = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);
const ROW_H = 40;
const ICON = 26;
const LABEL_W = 92;
const PAD = 10;

/** A simple picture graph: one row per category, with `count` copies of
 *  that category's glyph laid left to right — the concrete, countable
 *  stand-in a first grader reads directly (never just a bare bar height),
 *  for up to 3 categories. Every row shares the same icon size/spacing, so
 *  comparing row LENGTHS by eye already previews the comparison the
 *  questions ask the student to compute exactly. */
export function DataChart({ categories, maxCount }: { categories: Category[]; maxCount?: number }) {
  const cap = maxCount ?? Math.max(...categories.map((c) => c.count), 1);
  const width = LABEL_W + PAD * 2 + cap * ICON;
  const height = categories.length * ROW_H + PAD;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={categories.map((c) => `${c.label}: ${c.count}`).join(", ")}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {categories.map((c, row) => {
        const y = row * ROW_H + ROW_H / 2;
        return (
          <g key={c.label}>
            <text x={LABEL_W - 8} y={y + 5} textAnchor="end" fontSize={14} fontWeight={700} fill={toneFill(c.tone)}>
              {c.label}
            </text>
            <line x1={LABEL_W} y1={y} x2={width} y2={y} stroke={palette.line} strokeWidth={1} />
            {Array.from({ length: c.count }, (_, i) => (
              <text key={i} x={LABEL_W + PAD + i * ICON + ICON / 2} y={y + 8} textAnchor="middle" fontSize={ICON * 0.8}>
                {c.glyph}
              </text>
            ))}
            {c.count === 0 && (
              <text x={LABEL_W + PAD} y={y + 5} fontSize={12} fill={palette.muted}>
                (none)
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Deterministic PRNG (mulberry32) — a scattered mixed group must stay put
 *  across re-renders, so this is seeded from the problem's own data, never
 *  Math.random(). Same technique as MK1's CounterGroup scatter layout. */
function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface MixedItem {
  glyph: string;
  tone?: "a" | "b" | "c";
}

const SCATTER_W = 300;
const SCATTER_H = 170;
const SCATTER_PAD = 24;
const SCATTER_R = 16;

/** A scattered, uncategorized mixed group — the raw data Unit 4's
 *  "sort into categories" bucket hands the student before any chart exists
 *  at all, so sorting-by-eye (not reading a pre-built graph) is the actual
 *  skill that bucket practices. Optionally click-to-sort interactive
 *  (Explore only, same `sortedIndices`/`onToggle` pattern as MK1's
 *  CounterGroup click-to-count mode): each item can be clicked exactly once
 *  to send it to its own category's tally, fading once sorted. A static
 *  display (Practice/Test visuals) omits both. */
export function MixedScatter({ items, seed, sortedIndices, onToggle }: { items: MixedItem[]; seed: number; sortedIndices?: number[]; onToggle?: (index: number) => void }) {
  const rand = mulberry32(seed);
  const pts: { x: number; y: number }[] = [];
  let attempts = 0;
  while (pts.length < items.length && attempts < items.length * 60) {
    attempts++;
    const x = SCATTER_PAD + rand() * (SCATTER_W - 2 * SCATTER_PAD);
    const y = SCATTER_PAD + rand() * (SCATTER_H - 2 * SCATTER_PAD);
    if (pts.every((p) => Math.hypot(p.x - x, p.y - y) > SCATTER_R * 2 + 6)) pts.push({ x, y });
  }
  while (pts.length < items.length) pts.push({ x: SCATTER_PAD + rand() * (SCATTER_W - 2 * SCATTER_PAD), y: SCATTER_PAD + rand() * (SCATTER_H - 2 * SCATTER_PAD) });
  const interactive = !!onToggle;

  return (
    <svg
      viewBox={`0 0 ${SCATTER_W} ${SCATTER_H}`}
      role="img"
      aria-label={`A mixed group of ${items.length} items to sort by type${interactive ? ", click each one to sort it" : ""}`}
      style={{ display: "block", width: "100%", maxWidth: SCATTER_W, height: "auto", fontFamily: diagramFont }}
    >
      {items.map((it, i) => {
        const sorted = !!sortedIndices?.includes(i);
        return (
          <text
            key={i}
            x={pts[i].x}
            y={pts[i].y + SCATTER_R * 0.6}
            textAnchor="middle"
            fontSize={SCATTER_R * 1.7}
            opacity={sorted ? 0.25 : 1}
            style={interactive && !sorted ? { cursor: "pointer" } : undefined}
            onClick={interactive && !sorted ? () => onToggle!(i) : undefined}
          >
            {it.glyph}
          </text>
        );
      })}
    </svg>
  );
}
