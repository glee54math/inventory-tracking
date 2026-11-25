import type { ReactNode } from "react";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { itemColors } from "../../../shared/lib/palette";
import { pictureChoice, type ChoiceStep } from "../../../shared/engine/types";
import type { BinItem, BinSpec, DescribeWord, ItemShape, ScaleObject, ScaleSide } from "../diagrams";

// ============================================================================
// Data and small builders used by BOTH the unit files and their *Test files.
// A neutral module (like MK1's groupWords.tsx): it imports neither, so a Test
// never imports from its unit and no circular import can form.
// ============================================================================

type StepBase = Parameters<typeof pictureChoice>[0];

// ---------- Unit 1: objects children agree on (review decision D1) ----------

export interface MeasureObject {
  name: string;
  glyph: string;
  length: "long" | "short";
  weight: "heavy" | "light";
}

export const OBJECTS: MeasureObject[] = [
  { name: "train", glyph: "🚂", length: "long", weight: "heavy" },
  { name: "crocodile", glyph: "🐊", length: "long", weight: "heavy" },
  { name: "log", glyph: "🪵", length: "long", weight: "heavy" },
  { name: "snake", glyph: "🐍", length: "long", weight: "light" },
  { name: "scarf", glyph: "🧣", length: "long", weight: "light" },
  { name: "string", glyph: "🧵", length: "long", weight: "light" },
  { name: "rock", glyph: "🪨", length: "short", weight: "heavy" },
  { name: "brick", glyph: "🧱", length: "short", weight: "heavy" },
  { name: "hammer", glyph: "🔨", length: "short", weight: "heavy" },
  { name: "feather", glyph: "🪶", length: "short", weight: "light" },
  { name: "leaf", glyph: "🍃", length: "short", weight: "light" },
  { name: "butterfly", glyph: "🦋", length: "short", weight: "light" },
];

/** How many blocks to draw under an object, so the picture shows long or short. */
export const blocksFor = (o: MeasureObject) => (o.length === "long" ? randInt(5, 8) : randInt(1, 2));

/** Blocks to set against an object on a scale. The lab teaches that a rock
 *  balances 5 blocks and a hammer 4, so those two only meet fewer (C2-46). */
export const scaleBlocksFor = (o: MeasureObject) => (o.name === "rock" || o.name === "hammer" ? randInt(2, 3) : randInt(2, 5));

interface SizePair {
  big: { name: string; glyph: string };
  small: { name: string; glyph: string };
  heavier: "big" | "small";
}

/** Pairs both ways, so neither "the big one" nor "the small one" always wins (C2-41). */
const SIZE_PAIRS: SizePair[] = [
  { big: { name: "balloon", glyph: "🎈" }, small: { name: "rock", glyph: "🪨" }, heavier: "small" },
  { big: { name: "teddy bear", glyph: "🧸" }, small: { name: "hammer", glyph: "🔨" }, heavier: "small" },
  { big: { name: "kite", glyph: "🪁" }, small: { name: "brick", glyph: "🧱" }, heavier: "small" },
  { big: { name: "log", glyph: "🪵" }, small: { name: "leaf", glyph: "🍃" }, heavier: "big" },
  { big: { name: "train", glyph: "🚂" }, small: { name: "feather", glyph: "🪶" }, heavier: "big" },
  { big: { name: "crocodile", glyph: "🐊" }, small: { name: "butterfly", glyph: "🦋" }, heavier: "big" },
];

export interface SizePairScale {
  leftObject: ScaleObject;
  rightObject: ScaleObject;
  down: ScaleSide;
  heavy: string;
  light: string;
}

/** A big and a small object on a scale. The big one is heavier in half of the draws. */
export function sizePairScale(): SizePairScale {
  const heavier = Math.random() < 0.5 ? "big" : "small";
  const pair = pick(SIZE_PAIRS.filter((p) => p.heavier === heavier));
  const bigObject: ScaleObject = { ...pair.big, big: true };
  const smallObject: ScaleObject = { ...pair.small };
  const bigLeft = Math.random() < 0.5;
  return {
    leftObject: bigLeft ? bigObject : smallObject,
    rightObject: bigLeft ? smallObject : bigObject,
    down: (heavier === "big") === bigLeft ? "left" : "right",
    heavy: heavier === "big" ? pair.big.name : pair.small.name,
    light: heavier === "big" ? pair.small.name : pair.big.name,
  };
}

export interface SideCountScene {
  left: number;
  right: number;
  ask: "down" | "up";
  askSide: ScaleSide;
  answer: number;
}

/** Blocks on both sides, different counts: count the side that went down or up (D11). */
export function sideCountScene(): SideCountScene {
  const [left, right] = weightPair(false);
  const ask = Math.random() < 0.5 ? "down" : "up";
  const askSide: ScaleSide = (ask === "down") === (left > right) ? "left" : "right";
  return { left, right, ask, askSide, answer: askSide === "left" ? left : right };
}

export const WORD_LIST: DescribeWord[] = ["long", "short", "tall", "heavy", "light"];
export const isLengthWord = (w: DescribeWord) => w === "long" || w === "short" || w === "tall";

/** What each word looks like. Explore, the Practice wrap-up and the Test results all use these. */
export const WORD_LINES: Record<DescribeWord, string> = {
  long: "Long tells how long.",
  short: "Short is a few blocks.",
  tall: "Tall is long, standing up.",
  heavy: "Heavy tells how heavy.",
  light: "Light goes up on the scale.",
};

// ---------- counting words ----------

/** "1, 2, 3, 4": every number from 1 to `n`. */
export const countUp = (n: number) => Array.from({ length: n }, (_, i) => i + 1).join(", ");
export const blocksWord = (n: number) => `${n} block${n === 1 ? "" : "s"}`;
/** The spoken count of ringed extras: one extra is said differently from many. */
export const countExtrasLine = (n: number) => (n === 1 ? "Count the extra one: 1." : `Count the extras: ${countUp(n)}.`);

// ---------- Unit 2: rods and scale sides ----------

export type Rod = "A" | "B";
export type Side = "blue" | "orange";

export const rodName = (r: Rod) => (
  <span style={{ color: r === "A" ? "var(--qa)" : "var(--qb)", fontWeight: 800 }}>Rod {r}</span>
);
export const sideName = (s: Side) => (
  <span style={{ color: s === "blue" ? "var(--qc)" : "var(--qb)", fontWeight: 800 }}>{s === "blue" ? "Blue side" : "Orange side"}</span>
);
export const sideText = (s: Side) => (s === "blue" ? "Blue side" : "Orange side");
export const otherSide = (s: Side): Side => (s === "blue" ? "orange" : "blue");

/** A two-button rod pick with each button in its rod's color. */
export const rodChoice = (base: StepBase, answer: Rod): ChoiceStep => {
  const order = shuffle<Rod>(["A", "B"]);
  return pictureChoice(base, order.map((r) => [`Rod ${r}`, rodName(r)] as [string, ReactNode]), order.indexOf(answer));
};

/** A two-button side pick with each button in its pan's color. */
export const sideChoice = (base: StepBase, answer: Side): ChoiceStep => {
  const order = shuffle<Side>(["blue", "orange"]);
  return pictureChoice(base, order.map((s) => [sideText(s), sideName(s)] as [string, ReactNode]), order.indexOf(answer));
};

// Review D6: a bucket's two clean solves must include a near-tie. The shell
// passes in this unit's clean counts before each draw; the draw after a
// bucket's first clean solve is always a near-tie.
let cleanCounts: Record<string, number> = {};
// `retrying` = this draw is a "Try one like it", so a bucket with two kinds of
// problem must repeat the kind the student just had.
let retrying = false;
export const noteCleanCounts = (counts: Record<string, number>, isRetry = false) => {
  cleanCounts = counts;
  retrying = isRetry;
};
const lastKinds: Record<string, string> = {};
/** For a bucket with two kinds of problem: a new kind, or the same kind again on a retry. */
const drawKind = <T extends string>(bucket: string, kinds: T[]): T => {
  if (!retrying || !lastKinds[bucket]) lastKinds[bucket] = pick(kinds);
  return lastKinds[bucket] as T;
};
/** Unit 3's compare bucket: two groups or three. */
export const compareKind = () => drawKind<"two" | "three">("compareCategories", ["two", "three"]);
/** Unit 1's weight bucket: one object against blocks, or a big and a small object. */
export const weightKind = () => drawKind<"object" | "pair">("weightSingle", ["object", "pair"]);
/** Unit 3's count bucket: groups already sorted, or a mixed set to count by shape. */
export const countKind = () => drawKind<"sorted" | "mixed">("countCategory", ["sorted", "mixed"]);
export const wantNearTie = (bucket: string) => (cleanCounts[bucket] ?? 0) === 1 || Math.random() < 0.4;

/** Two different rod lengths in 2 to 9: 1 apart (near-tie) or 3 to 5 apart. */
export function rodPair(near: boolean): [number, number] {
  const d = near ? 1 : randInt(3, 5);
  const s = randInt(2, 9 - d);
  return Math.random() < 0.5 ? [s, s + d] : [s + d, s];
}

/** Two different block counts in 1 to 8: 1 apart (near-tie) or 2 to 4 apart. */
export function weightPair(near: boolean): [number, number] {
  const d = near ? 1 : randInt(2, 4);
  const s = randInt(1, 8 - d);
  return Math.random() < 0.5 ? [s, s + d] : [s + d, s];
}

export interface OffsetRods {
  a: number;
  b: number;
  offA: number;
  offB: number;
  /** The shorter rod reaches farther: the "look at the far end" mistake gets it wrong. */
  trap: boolean;
}

/** Rods that start in different places. The trap comes first, in 60% of draws (review C1-22). */
export function offsetRods(near: boolean, forceTrap?: boolean): OffsetRods {
  const [a, b] = rodPair(near);
  const trap = forceTrap ?? Math.random() < 0.6;
  const gap = Math.abs(a - b);
  // Trap: push the SHORTER rod past the longer one's end. Otherwise push the longer rod.
  const shift = trap ? gap + randInt(1, 2) : randInt(1, 3);
  const moveA = trap ? a < b : a > b;
  return { a, b, offA: moveA ? shift : 0, offB: moveA ? 0 : shift, trap };
}

// ---------- Unit 3: groups with both a color and a shape ----------

export const COLOR_OF: Record<string, string> = {
  Red: itemColors.red.main,
  Green: itemColors.green.main,
  Yellow: itemColors.yellow.main,
};
export const SHAPE_OF: Record<string, ItemShape> = { Circles: "circle", Squares: "square", Triangles: "triangle" };
export const COLOR_GROUPS = ["Red", "Green", "Yellow"];
export const SHAPE_GROUPS = ["Circles", "Squares", "Triangles"];
const ALL_SHAPES: ItemShape[] = ["circle", "square", "triangle"];
const ALL_COLORS = [itemColors.red.main, itemColors.green.main, itemColors.yellow.main];

export type SortRule = "color" | "shape";
export const groupsFor = (rule: SortRule) => (rule === "color" ? COLOR_GROUPS : SHAPE_GROUPS);

let uid = 0;
const nextId = () => `mk3-item-${uid++}`;

/** One item in group `name`: the sort rule fixes one attribute; the other varies. */
export const itemIn = (name: string): BinItem =>
  name in COLOR_OF ? { id: nextId(), shape: pick(ALL_SHAPES), color: COLOR_OF[name] } : { id: nextId(), shape: SHAPE_OF[name], color: pick(ALL_COLORS) };

export const makeGroups = (names: string[], counts: number[]): BinItem[][] => names.map((n, i) => Array.from({ length: counts[i] }, () => itemIn(n)));

/** Makes sure at least one group visibly mixes the attribute we are NOT sorting by,
 *  so "color or shape?" has one answer (C2-48). Every group needs 2 or more items. */
export function mixOtherAttribute(groups: BinItem[][], rule: SortRule) {
  const other = (it: BinItem) => (rule === "color" ? it.shape : it.color);
  if (groups.some((g) => new Set(g.map(other)).size > 1)) return;
  const g = groups[0];
  g[1] = rule === "color" ? { ...g[1], shape: pick(ALL_SHAPES.filter((s) => s !== g[0].shape)) } : { ...g[1], color: pick(ALL_COLORS.filter((c) => c !== g[0].color)) };
}

/** A group's name inside a sentence: "the circles", but "Red". */
export const groupPhrase = (name: string) => (name in SHAPE_OF ? `the ${name.toLowerCase()}` : name);
/** "The circles have 5." / "Red has 5." */
export const groupHas = (name: string, rest: string) => (name in SHAPE_OF ? `The ${name.toLowerCase()} have ${rest}` : `${name} has ${rest}`);

/** A count line: "1 triangle." / "3 triangles." / "Red has 3." */
export const countLine = (name: string, n: number) => (name in SHAPE_OF ? `${n} ${SHAPE_OF[name]}${n === 1 ? "" : "s"}.` : groupHas(name, `${n}.`));

export interface MixedShapeSet {
  /** Every item, in mixed order. */
  items: BinItem[];
  /** The same items sorted by shape, in SHAPE_GROUPS order. */
  groups: BinItem[][];
}

/** 3 to 10 unsorted items in all three shapes. Colors repeat across shapes, so color tempts. */
export function mixedShapeSet(): MixedShapeSet {
  const a = randInt(2, 5);
  const b = randInt(1, 3);
  const c = randInt(1, Math.min(3, 10 - a - b));
  const counts = shuffle([a, b, c]);
  const groups = SHAPE_GROUPS.map((name, s) => {
    const colors = shuffle(ALL_COLORS);
    return Array.from({ length: counts[s] }, (_, i): BinItem => ({ id: nextId(), shape: SHAPE_OF[name], color: colors[i % 3] }));
  });
  return { items: shuffle(groups.flat()), groups };
}

/** A bin with its count hidden and, for shape groups, a shape beside its name. */
export const bin = (label: string, items: BinItem[]): BinSpec => ({ label, items, hideCount: true, icon: SHAPE_OF[label] });

const ShapeMark = ({ shape }: { shape: ItemShape }) => (
  <svg viewBox="-12 -12 24 24" width={22} height={22} aria-hidden style={{ flex: "none" }}>
    {shape === "circle" && <circle r={10} fill="currentColor" />}
    {shape === "square" && <rect x={-10} y={-10} width={20} height={20} rx={3} fill="currentColor" />}
    {shape === "triangle" && <polygon points="0,-11 11,9 -11,9" fill="currentColor" />}
  </svg>
);

/** A group's name for a button: in its color, or with its shape beside it. */
export const groupLabel = (name: string): ReactNode => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 800, color: COLOR_OF[name] }}>
    {SHAPE_OF[name] && <ShapeMark shape={SHAPE_OF[name]} />}
    {name}
  </span>
);

/** A shape word for a prompt, with one neutral shape beside it. It names the shape and never shows a count (C3-52).
 *  `end` stays in the word's text so the voice keeps the question mark. */
export const shapeWord = (name: string, end = ""): ReactNode => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", verticalAlign: "bottom" }}>
    <ShapeMark shape={SHAPE_OF[name]} />
    {`${name.toLowerCase()}${end}`}
  </span>
);

/** A pick of a group, showing every group offered, in shuffled order. */
export const groupChoice = (base: StepBase, names: string[], answer: string): ChoiceStep => {
  const order = shuffle(names);
  return pictureChoice(base, order.map((n) => [n, groupLabel(n)] as [string, ReactNode]), order.indexOf(answer));
};

/** Three different counts in 2 to 10, so "most" and "fewest" each have one answer. */
export function threeCounts(): [number, number, number] {
  const out = shuffle(Array.from({ length: 9 }, (_, i) => i + 2)).slice(0, 3);
  return [out[0], out[1], out[2]];
}
