// Grading behind the shared "buildExpr" Step kind (shared/engine/types.ts):
// a three-number expression with one pair of parentheses that the student
// builds (5.OA.2, "write simple expressions"). Added for
// MG10_NumericalExpressionsAndPatternsLab. Pure functions only, so Practice
// and the Test grade a built expression in exactly one way.

import type { BuiltExpr } from "../engine/types";

export const BUILD_SIGNS = ["+", "−", "×", "÷"];

/** inputs: [group, a, sign 1, b, sign 2, c]. Missing parts come back as "". */
export const builtParts = (inputs: readonly string[]): string[] => Array.from({ length: 6 }, (_, i) => (inputs[i] ?? "").trim());

/** Every part filled in (Check waits for this). */
export const builtFilled = (inputs: readonly string[]): boolean => builtParts(inputs).every((p) => p !== "");

/** The student's build, or null when a part is missing or a number box isn't a whole number. */
export const parseBuilt = (inputs: readonly string[]): BuiltExpr | null => {
  const [g, a, o1, b, o2, c] = builtParts(inputs);
  if (g !== "left" && g !== "right") return null;
  if (![a, b, c].every((x) => /^\d+$/.test(x)) || !o1 || !o2) return null;
  return { group: g, nums: [Number(a), Number(b), Number(c)], ops: [o1, o2] };
};

/** "(8 + 7) × 2" or "2 × (8 + 7)"; blanks show as "?". */
export const builtText = (e: { group: string; nums: readonly (number | string)[]; ops: readonly string[] }): string => {
  const [a, b, c] = e.nums.map((n) => (n === "" ? "?" : typeof n === "number" ? n.toLocaleString("en-US") : n));
  const [o1, o2] = e.ops.map((o) => o || "?");
  return e.group === "right" ? `${a} ${o1} (${b} ${o2} ${c})` : `(${a} ${o1} ${b}) ${o2} ${c}`;
};

/** The student's inputs as text, for an answer review. */
export const builtInputText = (inputs: readonly string[]): string => {
  const [g, a, o1, b, o2, c] = builtParts(inputs);
  return builtText({ group: g === "right" ? "right" : "left", nums: [a, b, c], ops: [o1, o2] });
};

const COMMUTES = new Set(["+", "×"]);

/** A canonical string for the tree: the two sides of a + or × are sorted, so either order matches. */
const canon = (e: BuiltExpr): string => {
  const [a, b, c] = e.nums.map(String);
  const node = (op: string, l: string, r: string) => (COMMUTES.has(op) ? `${op}[${[l, r].sort().join("|")}]` : `${op}[${l}|${r}]`);
  return e.group === "left" ? node(e.ops[1], node(e.ops[0], a, b), c) : node(e.ops[0], a, node(e.ops[1], b, c));
};

/** Same grouping, numbers and signs, with either order on the two sides of a + or a ×. */
export const sameBuilt = (x: BuiltExpr, y: BuiltExpr): boolean => canon(x) === canon(y);

const sortedNums = (e: BuiltExpr) => [...e.nums].sort((p, q) => p - q).join(",");
const sortedOps = (e: BuiltExpr) => [...e.ops].sort().join(",");

/**
 * Grades a build. Named messages, most specific first: the step's own
 * `diagnose`, then wrong numbers, wrong signs, and the right parts grouped
 * the wrong way.
 */
export const checkBuilt = (
  answer: BuiltExpr,
  inputs: readonly string[],
  diagnose?: (built: BuiltExpr) => string | null
): { ok: boolean; msg: string } => {
  const parts = builtParts(inputs);
  if (parts[0] === "") return { ok: false, msg: "Tap where the parentheses go." };
  if (parts.some((p) => p === "")) return { ok: false, msg: "Fill in every number and every sign." };
  const built = parseBuilt(inputs);
  if (!built) return { ok: false, msg: "Type one whole number in each box." };
  if (sameBuilt(built, answer)) return { ok: true, msg: "" };
  const named = diagnose?.(built);
  if (named) return { ok: false, msg: named };
  if (sortedNums(built) !== sortedNums(answer)) return { ok: false, msg: "Check the numbers. Use the numbers the words give you." };
  if (sortedOps(built) !== sortedOps(answer)) return { ok: false, msg: "Check the signs. Which words tell you to add, subtract, multiply or divide?" };
  const regrouped: BuiltExpr = { ...built, group: built.group === "left" ? "right" : "left" };
  if (sameBuilt(regrouped, answer)) return { ok: false, msg: "The numbers and signs are right. Put the parentheses around the step the words say to do first." };
  return { ok: false, msg: "The numbers and signs are right, but not in the right places. Read the words again. Which step comes first, and which number does it start with?" };
};
