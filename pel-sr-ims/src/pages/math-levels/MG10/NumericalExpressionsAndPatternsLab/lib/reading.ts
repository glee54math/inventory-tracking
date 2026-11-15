// Unit 3 step builders (read an expression without working it out), shared by
// ReadingExpressions.tsx AND its Test (never a unit <-> Test cycle). The size
// questions use numbers too big to want to work out (5.OA.2: "interpret
// numerical expressions without evaluating them"). One word for size
// comparisons: "larger" (round 1, E1-10).

import { choice, type BuildExprStep, type BuiltExpr, type ChoiceStep, type NumberStep } from "../../../shared/engine/types";
import { pick, randInt } from "../../../shared/lib/math";
import { evalExpr, exprText, fmtNum, moveParens, type Expr } from "./expr";
import { bigPair, type WordsTemplate } from "./stories";
import { workText } from "./steps";
import type { BarRow } from "../diagrams/TimesBars";

/** "k × (A + B) is __ times as large as A + B." — typing the big value is named. */
export const timesStep = (variant: "plain" | "ratio"): { step: NumberStep; k: number; group: string } => {
  const { A, B } = bigPair();
  const sub = Math.random() < 0.3;
  const group = sub ? `${fmtNum(A)} − ${fmtNum(B)}` : `${fmtNum(A)} + ${fmtNum(B)}`;
  const value = sub ? A - B : A + B;
  if (variant === "plain") {
    const k = randInt(2, 6);
    const big = Math.random() < 0.5 ? `${k} × (${group})` : `(${group}) × ${k}`;
    return {
      k,
      group,
      step: {
        kind: "number",
        // A sentence frame with the blank in it, not "X is how many times as large as Y?" (round 2, E2-25).
        prompt: "Fill in the blank. Don't work it out.",
        prefix: `${big} is `,
        suffix: `times as large as ${group}.`,
        hint: `Don't work it out. How many copies of (${group}) are there?`,
        explain: `${big} is ${k} copies of ${group}, so it is ${k} times as large. No need to work out ${group}.`,
        answer: k,
        diagnose: (x) => (x === value * k || x === value ? "That's a value you worked out. The blank asks how many TIMES as large. Count the copies instead." : null),
      },
    };
  }
  const k = randInt(2, 4);
  const j = randInt(2, 3);
  return {
    k,
    group,
    step: {
      kind: "number",
      prompt: "Fill in the blank. Don't work it out.",
      prefix: `${k * j} × (${group}) is `,
      suffix: `times as large as ${j} × (${group}).`,
      hint: `Both have the same group. How many times as large is ${k * j} as ${j}?`,
      explain: `${k * j} copies of the group is ${k} times as large as ${j} copies, because ${j} × ${k} = ${k * j}.`,
      answer: k,
      diagnose: (x) => (x === k * j - j ? `${k * j} is ${x} MORE than ${j}. How many TIMES as large is it?` : x === k * j ? `Compare it with ${j} copies, not with 1 copy.` : null),
    },
  };
};

/**
 * "Which is larger?" without working it out, plus the bars that show the two
 * sizes (drawn as help after a wrong pick, round 1 C1-24). The answer
 * (first / second / equal) is drawn first, evenly. The un-equal ones compare
 * more copies of the same group, the same copies of a larger group, or a
 * group against that group ÷ k (round 1, C1-05).
 */
export const largerCompare = (): { step: ChoiceStep; rows: [BarRow, BarRow] } => {
  const { A, B } = bigPair();
  const want = pick<"first" | "second" | "equal">(["first", "second", "equal"]);
  const k = randInt(2, 6);
  const g = `${fmtNum(A)} + ${fmtNum(B)}`;
  let x: string;
  let y: string;
  let why: string;
  let rows: [BarRow, BarRow];
  if (want === "equal") {
    x = `${k} × (${g})`;
    y = pick([`(${fmtNum(B)} + ${fmtNum(A)}) × ${k}`, `(${g}) × ${k}`]);
    why = "Both are the same two numbers added, then multiplied by the same number. Order doesn't change a sum or a product.";
    rows = [
      { label: x, k, text: g },
      { label: y, k, text: g },
    ];
  } else {
    const form = pick(["copies", "addend", "divide"]);
    let big: BarRow;
    let small: BarRow;
    if (form === "copies") {
      const j = randInt(2, 6);
      const m = j === k ? k + 1 : j;
      const [hi, lo] = m > k ? [m, k] : [k, m];
      big = { label: `${hi} × (${g})`, k: hi, text: g };
      small = { label: `${lo} × (${g})`, k: lo, text: g };
      why = `Both use the same group. ${hi} copies is larger than ${lo} copies.`;
    } else if (form === "addend") {
      const C = B + randInt(5, 90);
      const g2 = `${fmtNum(A)} + ${fmtNum(C)}`;
      // The larger group's bar is drawn a little wider (the bars show which is larger, not the exact sizes).
      big = { label: `${k} × (${g2})`, k, text: g2, scale: 1.2 };
      small = { label: `${k} × (${g})`, k, text: g };
      why = `Both multiply by ${k}. ${g2} is larger than ${g}, because ${fmtNum(C)} is larger than ${fmtNum(B)}.`;
    } else {
      // ÷ k splits the group into k equal parts, so one part is smaller than the whole group.
      big = { label: g, k: 1, text: g, tone: "a", parts: k };
      small = { label: `(${g}) ÷ ${k}`, k: 1, text: "", scale: 1 / k };
      why = `Dividing by ${k} splits ${g} into ${k} equal parts. One part is smaller than the whole group.`;
    }
    [x, y] = want === "first" ? [big.label, small.label] : [small.label, big.label];
    rows = want === "first" ? [big, small] : [small, big];
  }
  const step = choice(
    {
      prompt: `Without working them out: which is larger? First: ${x}. Second: ${y}.`,
      hint: "Compare the parts. What is the same? What is different?",
      explain: why,
    },
    want === "first" ? "the first one" : want === "second" ? "the second one" : "They are equal.",
    ["the first one", "the second one", "They are equal."]
  );
  return { step, rows };
};

/** "Which is larger?" alone (the Test shows no bars). */
export const largerStep = (): ChoiceStep => largerCompare().step;

/**
 * "Would moving the parentheses change the value?" for one expression. Yes/No
 * drawn evenly, on its own: Practice no longer forces the opposite of its
 * steps 1-2, which made step 3 predictable (round 3, C3-01). Returns Ty's two
 * expressions too, so the picture can draw them (round 2, C2-04).
 */
export const changeCompare = (change: boolean = Math.random() < 0.5): { step: ChoiceStep; e: Expr; moved: Expr } => {
  const { e, moved } = moveParens(change);
  const step = choice(
    {
      prompt: `Ty moves the parentheses in ${exprText(e)}. He gets ${exprText(moved)}. Does the value change?`,
      // Find both values: the signs alone don't decide it (round 1, C1-01).
      hint: "Find the value both ways. Are they the same?",
      explain: change ? `Yes. ${workText(e)}, but ${workText(moved)}.` : `No. ${workText(e)}, and ${workText(moved)}. Both equal ${fmtNum(evalExpr(e))}.`,
    },
    change ? "Yes, it changes." : "No, it stays the same.",
    [change ? "No, it stays the same." : "Yes, it changes."]
  );
  return { step, e, moved };
};

export const changeStep = (): ChoiceStep => changeCompare().step;

/** A words template's expression as the parts a student builds (three numbers, two signs, one pair of parentheses). */
export const toBuilt = (e: Expr): BuiltExpr => {
  if (e.kind !== "op") throw new Error("toBuilt: not an expression");
  const n = (x: Expr) => (x.kind === "num" ? x.v : NaN);
  if (e.l.kind === "op") return { group: "left", nums: [n(e.l.l), n(e.l.r), n(e.r)], ops: [e.l.op, e.op] };
  if (e.r.kind === "op") return { group: "right", nums: [n(e.l), n(e.r.l), n(e.r.r)], ops: [e.op, e.r.op] };
  throw new Error("toBuilt: no group");
};

/**
 * For "add a and b, then double it" (answer numbers [2, a, b]): true when the
 * built numbers are wrong because of the 2, i.e. there are fewer 2s than the
 * answer has, or a and b are both there but the third number isn't 2.
 */
const missesTheTwo = (want: readonly number[], got: readonly number[]): boolean => {
  const key = (xs: readonly number[]) => [...xs].sort((p, q) => p - q).join(",");
  if (key(want) === key(got)) return false;
  const twos = (xs: readonly number[]) => xs.filter((x) => x === 2).length;
  if (twos(got) < twos(want)) return true;
  const rest = [...got];
  for (const x of want.slice(1)) {
    const i = rest.indexOf(x);
    if (i < 0) return false;
    rest.splice(i, 1);
  }
  return rest[0] !== 2;
};

/**
 * Write the expression yourself (round 1, C1-02; 5.OA.2 "write"): tap where
 * the parentheses go, type the numbers, tap the signs. Graded by structure,
 * so 2 × (8 + 7) and (7 + 8) × 2 both count. A "subtract b from a" turned
 * around is named.
 */
export const buildStep = (t: WordsTemplate, prompt?: string): BuildExprStep => {
  const m = t.words.match(/^Subtract (\d+) from (\d+)/);
  const answer = toBuilt(t.expr);
  return {
    kind: "buildExpr",
    prompt: prompt ?? `Write an expression for these words: ${t.words}`,
    // "write", not "add": the last step may be ×, ÷, + or − (round 2, E2-22).
    hint: "Which step do the words say to do first? Put the parentheses around it. Then write the last step outside them.",
    explain: `The first step goes in parentheses: ${exprText(t.expr)}.`,
    answer,
    diagnose: (b) => {
      // "Double it" has no 2 in the words (round 2, E2-23): a missing or wrong 2 gets its own message.
      if (t.id === "addDouble") {
        if (missesTheTwo(answer.nums, b.nums)) return '"Double it" means multiply by 2.';
        // The 2 is the number outside the parentheses, but its sign isn't × (round 3, E3-37).
        const [outside, outsideOp] = b.group === "left" ? [b.nums[2], b.ops[1]] : [b.nums[0], b.ops[0]];
        if (outside === 2 && outsideOp !== "×") return '"Double it" means multiply by 2.';
      }
      if (!m) return null;
      const [small, large] = [Number(m[1]), Number(m[2])];
      // The group's subtraction, written the other way round: small − large.
      const [x, y] = b.group === "left" ? [b.nums[0], b.nums[1]] : [b.nums[1], b.nums[2]];
      const op = b.group === "left" ? b.ops[0] : b.ops[1];
      return op === "−" && x === small && y === large ? `"Subtract ${small} from ${large}" starts with ${large}. Write ${large} first.` : null;
    },
  };
};
