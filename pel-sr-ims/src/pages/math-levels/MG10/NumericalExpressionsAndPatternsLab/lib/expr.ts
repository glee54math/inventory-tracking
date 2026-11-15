// Numerical expressions with grouping symbols (5.OA.1-2). ONE model drives the
// pictures (ExprView, WorkLines), the graded answers and the named mistakes,
// so a picture and a checked answer can never disagree.
//
// Grade 5 rule used everywhere in this lab: every expression with two or more
// operations shows its first step with grouping symbols. Nothing relies on
// "multiply before add" (that order-of-operations convention is 6th grade,
// 6.EE.2c), so the only order a student needs is "inside first".
// Imported by units AND Tests (never a unit <-> Test cycle).

import { pick, randInt } from "../../../shared/lib/math";

export type Op = "+" | "−" | "×" | "÷";
export type Sym = "paren" | "bracket" | "brace";
export type Expr = { kind: "num"; v: number } | { kind: "op"; op: Op; l: Expr; r: Expr; sym?: Sym };
/** Path to a node: "l"/"r" turns from the root. */
export type Path = ("l" | "r")[];

export const num = (v: number): Expr => ({ kind: "num", v });
export const bin = (op: Op, l: Expr | number, r: Expr | number, sym?: Sym): Expr => ({
  kind: "op",
  op,
  l: typeof l === "number" ? num(l) : l,
  r: typeof r === "number" ? num(r) : r,
  sym,
});

export const OPEN: Record<Sym, string> = { paren: "(", bracket: "[", brace: "{" };
export const CLOSE: Record<Sym, string> = { paren: ")", bracket: "]", brace: "}" };
export const SYM_NAME: Record<Sym, string> = { paren: "parentheses", bracket: "brackets", brace: "braces" };
export const SYM_LABEL: Record<Sym, string> = { paren: "parentheses ( )", bracket: "brackets [ ]", brace: "braces { }" };

export const fmtNum = (v: number): string => v.toLocaleString("en-US");

const apply = (op: Op, a: number, b: number): number => (op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : a / b);

/** The value (may be a fraction or negative for a bad draw; see `isWhole`). */
export const evalExpr = (e: Expr): number => (e.kind === "num" ? e.v : apply(e.op, evalExpr(e.l), evalExpr(e.r)));

/** True when every step comes out to a whole number, 0 or more (no remainders, no negatives). */
export const isWhole = (e: Expr): boolean => {
  if (e.kind === "num") return Number.isInteger(e.v) && e.v >= 0;
  if (!isWhole(e.l) || !isWhole(e.r)) return false;
  const r = evalExpr(e.r);
  if (e.op === "÷" && r === 0) return false;
  const v = evalExpr(e);
  return Number.isInteger(v) && v >= 0;
};

/** Largest value any step reaches (keeps generated numbers friendly). */
export const maxStep = (e: Expr): number => (e.kind === "num" ? e.v : Math.max(maxStep(e.l), maxStep(e.r), evalExpr(e)));

/** Plain text, e.g. "2 × [(5 + 3) − 2]". */
export const exprText = (e: Expr): string => {
  if (e.kind === "num") return fmtNum(e.v);
  const inner = `${exprText(e.l)} ${e.op} ${exprText(e.r)}`;
  return e.sym ? `${OPEN[e.sym]}${inner}${CLOSE[e.sym]}` : inner;
};

export const nodeAt = (e: Expr, path: Path): Expr => path.reduce<Expr>((n, t) => (n.kind === "op" ? n[t] : n), e);

/** How many grouping layers are nested, e.g. {[( )]} -> 3, (3 + 2) × (4 − 1) -> 1. */
export const depth = (e: Expr): number => (e.kind === "num" ? 0 : (e.sym ? 1 : 0) + Math.max(depth(e.l), depth(e.r)));

/** The outermost grouping symbol (the one around the most), or null for none. */
export const outermost = (e: Expr): Sym | null => {
  if (e.kind === "num") return null;
  if (e.sym) return e.sym;
  const a = outermost(e.l);
  const b = outermost(e.r);
  const rank = (s: Sym | null) => (s === "brace" ? 3 : s === "bracket" ? 2 : s === "paren" ? 1 : 0);
  return rank(a) >= rank(b) ? a : b;
};

/**
 * The next part to work out: the deepest operation whose two sides are both
 * plain numbers ("inside first"); a tie goes to the left one.
 */
export const nextPath = (e: Expr): Path | null => {
  let best: { path: Path; d: number } | null = null;
  const walk = (n: Expr, path: Path, d: number) => {
    if (n.kind === "num") return;
    const dd = d + (n.sym ? 1 : 0);
    if (n.l.kind === "num" && n.r.kind === "num") {
      if (!best || dd > best.d) best = { path, d: dd };
      return;
    }
    walk(n.l, [...path, "l"], dd);
    walk(n.r, [...path, "r"], dd);
  };
  walk(e, [], 0);
  return (best as { path: Path; d: number } | null)?.path ?? null;
};

const replaceAt = (e: Expr, path: Path, sub: Expr): Expr => {
  if (path.length === 0) return sub;
  if (e.kind === "num") return e;
  const [t, ...rest] = path;
  return { ...e, [t]: replaceAt(e[t], rest, sub) };
};

/** One step of work: the next part becomes its value. */
export const reduceOnce = (e: Expr): Expr => {
  const p = nextPath(e);
  if (!p) return e;
  return replaceAt(e, p, num(evalExpr(nodeAt(e, p))));
};

/** Every line of the work, from the expression itself down to its value. */
export const workSteps = (e: Expr): Expr[] => {
  const out = [e];
  let cur = e;
  while (cur.kind === "op") {
    cur = reduceOnce(cur);
    out.push(cur);
  }
  return out;
};

/** The first part worked out, as text: "(5 + 3)" or "5 + 3" when it has no symbols. */
export const firstPartText = (e: Expr): string => {
  const p = nextPath(e);
  return p ? exprText(nodeAt(e, p)) : exprText(e);
};

/**
 * The value a student gets by IGNORING the grouping symbols and working
 * left to right (the misconception this lab targets), or null when that
 * doesn't give a whole number.
 */
export const leftToRight = (e: Expr): number | null => {
  const toks: (number | Op)[] = [];
  const flat = (n: Expr) => {
    if (n.kind === "num") toks.push(n.v);
    else {
      flat(n.l);
      toks.push(n.op);
      flat(n.r);
    }
  };
  flat(e);
  let v = toks[0] as number;
  for (let i = 1; i < toks.length; i += 2) {
    const r = toks[i + 1] as number;
    const op = toks[i] as Op;
    if (op === "÷" && r === 0) return null;
    v = apply(op, v, r);
  }
  return Number.isInteger(v) && v >= 0 ? v : null;
};

/** Three numbers, two operations: (a o1 b) o2 c ("left") or a o1 (b o2 c) ("right"). */
export const grouped = (a: number, o1: Op, b: number, o2: Op, c: number, side: "left" | "right"): Expr =>
  side === "left" ? bin(o2, bin(o1, a, b, "paren"), c) : bin(o1, a, bin(o2, b, c, "paren"));

/** Draw until `ok` (rejection sampling; every generator here lands fast). */
export function draw<T>(make: () => T, ok: (t: T) => boolean, tries = 4000): T {
  for (let i = 0; i < tries; i++) {
    const t = make();
    if (ok(t)) return t;
  }
  throw new Error("draw: no value found");
}

// ---------- Unit 1 / Unit 3: three numbers, two operations ----------

export interface ThreeNums {
  a: number;
  b: number;
  c: number;
  o1: Op;
  o2: Op;
}

/** Friendly numbers for an operation's right side. */
const small = () => randInt(2, 9);

/**
 * Unit 1 "+ and ×" expressions where moving the parentheses changes the value.
 * `side` = where the parentheses go in the expression the student works out.
 */
export const plusTimes = (side: "left" | "right", ops?: [Op, Op]): { t: ThreeNums; e: Expr; moved: Expr } =>
  draw(
    () => {
      const [o1, o2] =
        ops ??
        pick<[Op, Op]>([
          ["+", "×"],
          ["×", "+"],
        ]);
      const t: ThreeNums = { a: small(), b: small(), c: small(), o1, o2 };
      const e = grouped(t.a, o1, t.b, o2, t.c, side);
      const moved = grouped(t.a, o1, t.b, o2, t.c, side === "left" ? "right" : "left");
      return { t, e, moved };
    },
    ({ e, moved }) => evalExpr(e) !== evalExpr(moved) && maxStep(e) <= 120 && maxStep(moved) <= 120
  );

/**
 * Unit 1 bucket (d): the parentheses go around a subtraction or a division.
 * Both groupings come out to whole numbers and different values.
 */
export const subDiv = (innerOp?: "−" | "÷"): { t: ThreeNums; e: Expr; moved: Expr; side: "left" | "right" } =>
  draw(
    () => {
      const inner: Op = innerOp ?? pick<Op>(["−", "÷"]);
      const outer: Op = pick<Op>(inner === "÷" ? ["+", "−", "×"] : ["+", "×", "÷", "−"]);
      const side = pick<"left" | "right">(["left", "right"]);
      const [o1, o2] = side === "left" ? [inner, outer] : [outer, inner];
      let a: number, b: number, c: number;
      if (side === "left") {
        // (a inner b) outer c
        b = randInt(2, 9);
        a = inner === "÷" ? b * randInt(2, 9) : randInt(b + 2, 30);
        c = randInt(2, 9);
      } else {
        // a outer (b inner c)
        c = randInt(2, 9);
        b = inner === "÷" ? c * randInt(2, 9) : randInt(c + 2, 20);
        a = outer === "÷" ? randInt(2, 60) : randInt(2, 30);
      }
      const t: ThreeNums = { a, b, c, o1, o2 };
      const e = grouped(a, o1, b, o2, c, side);
      const moved = grouped(a, o1, b, o2, c, side === "left" ? "right" : "left");
      return { t, e, moved, side };
    },
    ({ e, moved }) => isWhole(e) && isWhole(moved) && evalExpr(e) !== evalExpr(moved) && maxStep(e) <= 150 && maxStep(moved) <= 150
  );

/**
 * Unit 3 bucket (d): same three numbers, parentheses moved. `change` = whether the value changes.
 * The pools break the surface rule "both + or both × means no change, any
 * other signs mean a change" (round 1, C1-01): (a + b) − c and (a × b) ÷ c
 * (b ÷ c whole) stay the same, and (a ÷ b) × c changes.
 */
export const moveParens = (change: boolean): { e: Expr; moved: Expr; t: ThreeNums } =>
  draw(
    () => {
      const ops: [Op, Op] = change
        ? pick<[Op, Op]>([
            ["+", "×"],
            ["×", "+"],
            ["−", "−"],
            ["−", "+"],
            ["÷", "×"],
          ])
        : pick<[Op, Op]>([
            ["+", "+"],
            ["×", "×"],
            ["+", "−"],
            ["×", "÷"],
          ]);
      const key = ops.join("");
      const t: ThreeNums = { a: randInt(2, ops[0] === "−" ? 30 : 9), b: randInt(2, 9), c: randInt(2, 9), o1: ops[0], o2: ops[1] };
      if (key === "++") {
        t.a = randInt(5, 40);
        t.b = randInt(5, 40);
        t.c = randInt(5, 40);
      } else if (key === "+−") {
        // (a + b) − c = a + (b − c): b − c must be a whole number.
        t.a = randInt(5, 40);
        t.c = randInt(2, 12);
        t.b = t.c + randInt(1, 20);
      } else if (key === "×÷") {
        // (a × b) ÷ c = a × (b ÷ c): b ÷ c must be a whole number.
        t.c = randInt(2, 5);
        t.b = t.c * randInt(1, 4);
      } else if (key === "÷×") {
        // (a ÷ b) × c vs a ÷ (b × c): both whole, so a is a multiple of b × c.
        t.b = randInt(2, 4);
        t.c = randInt(2, 4);
        t.a = t.b * t.c * randInt(1, 4);
      }
      return { t, e: grouped(t.a, t.o1, t.b, t.o2, t.c, "left"), moved: grouped(t.a, t.o1, t.b, t.o2, t.c, "right") };
    },
    ({ e, moved }) => isWhole(e) && isWhole(moved) && (evalExpr(e) !== evalExpr(moved)) === change && maxStep(e) <= 150 && maxStep(moved) <= 150
  );

// ---------- Unit 2: nested grouping ----------

const OPS: Op[] = ["+", "−", "×", "÷"];
const friendly = (op: Op) => (op === "×" ? randInt(2, 6) : op === "÷" ? randInt(2, 5) : randInt(1, 9));

/** Wrap a group with one more layer: [inner op k] or [k op inner]. */
const wrap = (inner: Expr, sym: Sym): Expr => {
  const op = pick(OPS);
  const k = friendly(op);
  return Math.random() < 0.5 || op === "÷" || op === "−" ? bin(op, inner, k, sym) : bin(op, k, inner, sym);
};

/** One layer's starting group "(a op b)". */
const core = (): Expr => {
  const op = pick<Op>(["+", "−", "+", "×"]);
  const b = friendly(op);
  const a = op === "−" ? randInt(b + 1, b + 12) : friendly(op);
  return bin(op, a, b, "paren");
};

/** The outside step (no symbols): expr op k or k op expr. */
const outside = (inner: Expr, ops: readonly Op[] = OPS): Expr => {
  const op = pick(ops);
  const k = friendly(op);
  return Math.random() < 0.5 || op === "÷" || op === "−" ? bin(op, inner, k) : bin(op, k, inner);
};

const niceNested = (e: Expr, cap: number) => isWhole(e) && maxStep(e) <= cap && leftToRight(e) !== evalExpr(e);

/** Two layers: k × [(a + b) − c] and friends. */
export const twoLayer = (outerOps?: readonly Op[]): Expr => draw(() => outside(wrap(core(), "bracket"), outerOps), (e) => niceNested(e, 120));

/** Three layers with all three symbols: {k × [(a + b) − c]} + d and friends. */
export const threeLayer = (): Expr => draw(() => outside(wrap(wrap(core(), "bracket"), "brace")), (e) => niceNested(e, 200));

/** One layer: (a + b) × c and friends. */
export const oneLayer = (): Expr => draw(() => outside(core()), (e) => niceNested(e, 100));

/** Two separate groups joined by an operation: (3 + 2) × (4 − 1). */
export const twoGroups = (): Expr =>
  draw(
    () => bin(pick<Op>(["×", "+", "−", "×"]), core(), core()),
    (e) => niceNested(e, 120) && leftToRight(e) !== null
  );

/**
 * The "collapsed" reading of two groups: [(a o1 b) o2 c] o3 d — the
 * same numbers worked as one long group (Unit 2's twoGroups follow-up).
 */
export const collapsed = (e: Expr): Expr | null => {
  if (e.kind !== "op" || e.l.kind !== "op" || e.r.kind !== "op" || e.l.l.kind !== "num" || e.l.r.kind !== "num" || e.r.l.kind !== "num" || e.r.r.kind !== "num") return null;
  return bin(e.r.op, bin(e.op, bin(e.l.op, e.l.l.v, e.l.r.v, "paren"), e.r.l.v, "bracket"), e.r.r.v);
};

/** Path to the first group drawn with `sym` (searching from the outside in), or null. */
export const groupPath = (e: Expr, sym: Sym): Path | null => {
  let found: Path | null = null;
  const walk = (n: Expr, path: Path) => {
    if (found || n.kind === "num") return;
    if (n.sym === sym) {
      found = path;
      return;
    }
    walk(n.l, [...path, "l"]);
    walk(n.r, [...path, "r"]);
  };
  walk(e, []);
  return found;
};

/** The middle layer of a three-layer expression: the [ ] group, or null. */
export const bracketPath = (e: Expr): Path | null => groupPath(e, "bracket");

/** A group written out with its marks, e.g. "[(5 + 3) − 2]", or null when there is no such group. */
export const groupText = (e: Expr, sym: Sym): string | null => {
  const p = groupPath(e, sym);
  return p ? exprText(nodeAt(e, p)) : null;
};
