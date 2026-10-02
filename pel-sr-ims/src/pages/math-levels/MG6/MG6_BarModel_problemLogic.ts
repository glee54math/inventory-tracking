import type {
  CheckResult,
  Field,
  Level,
  Op,
  PartValues,
  Problem,
  RelationType,
} from "./MG6_BarModel_types";

const PEOPLE: [string, string][] = [
  ["Lily", "Peter"],
  ["Maya", "Noah"],
  ["Ava", "Leo"],
  ["Sofia", "Ethan"],
  ["Grace", "Ryan"],
  ["Mia", "Lucas"],
  ["Zoe", "Owen"],
  ["Emma", "Kai"],
];

const ITEMS = [
  "stamps",
  "stickers",
  "marbles",
  "baseball cards",
  "seashells",
  "beads",
  "comic books",
  "pencils",
];

const TYPES_BY_LEVEL: Record<Level, RelationType[]> = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3, 4],
};

const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = <T,>(arr: readonly T[]): T => arr[rnd(0, arr.length - 1)];

export function makeProblem(level: Level): Problem {
  const pair = pick(PEOPLE);
  const [A, B] = Math.random() < 0.5 ? pair : [pair[1], pair[0]];
  const item = pick(ITEMS);
  const type = pick(TYPES_BY_LEVEL[level]);

  const n = rnd(42, 98);
  let d = rnd(11, 38);
  if (n - d < 12) d = n - 12;

  const bVal = type === 1 || type === 3 ? n - d : n + d;

  const story =
    type === 1
      ? `${A} has ${n} ${item}. ${B} has ${d} fewer ${item} than ${A}.`
      : type === 2
        ? `${A} has ${n} ${item}. ${B} has ${d} more ${item} than ${A}.`
        : type === 3
          ? `${A} has ${n} ${item}. ${A} has ${d} more ${item} than ${B}.`
          : `${A} has ${n} ${item}. ${A} has ${d} fewer ${item} than ${B}.`;

  return { A, B, item, type, n, d, bVal, total: n + bVal, op: bVal < n ? "−" : "+", story };
}

export function nextOp(op: Op): Op {
  return op === "" ? "+" : op === "+" ? "−" : "";
}

export function opHint(p: Problem): string {
  const { A, B, type } = p;
  switch (type) {
    case 1:
      return `${B} has fewer, so ${B}'s bar is shorter. Take the difference away.`;
    case 2:
      return `${B} has more, so ${B}'s bar is longer. Add the difference on.`;
    case 3:
      return `Careful! ${A} has more, which means ${B} has less. ${B}'s bar is the shorter one.`;
    case 4:
      return `Careful! ${A} has fewer, which means ${B} has more. ${B}'s bar is the longer one.`;
  }
}

const toNum = (v: string) => (v.trim() === "" ? NaN : Number(v));
const fail = (message: string, wrong: Field[] = []): CheckResult => ({ ok: false, message, wrong });

function parse(v: PartValues) {
  return { x: toNum(v.x), y: toNum(v.y), r: toNum(v.r), s: toNum(v.s) };
}

export function checkPartA(p: Problem, v: PartValues): CheckResult {
  const { x, y, r, s } = parse(v);
  if ([x, y, r, s].some(Number.isNaN) || !v.op) {
    return fail("Fill in every blank, including the circle.");
  }
  if (v.op !== p.op) return fail(opHint(p));

  const setOk = (x === p.n && y === p.d) || (p.op === "+" && x === p.d && y === p.n);
  if (!setOk) {
    if (p.op === "−" && x === p.d && y === p.n) {
      return fail(`When you subtract, start with the bigger number: ${p.n}.`, ["x", "y"]);
    }
    return fail(`Use the two numbers from the story: ${p.n} and ${p.d}.`, ["x", "y"]);
  }
  if (r !== p.bVal) {
    return fail(
      p.op === "−"
        ? "Right setup! Recheck your subtraction — do you need to regroup?"
        : "Right setup! Recheck your addition — did you carry?",
      ["r"],
    );
  }
  if (s !== r) return fail("Your sentence should match your answer.", ["s"]);

  return { ok: true, message: `Yes! ${p.B} has ${p.bVal} ${p.item}.`, wrong: [] };
}

export function checkPartB(p: Problem, v: PartValues): CheckResult {
  const { x, y, r, s } = parse(v);
  if ([x, y, r, s].some(Number.isNaN) || !v.op) {
    return fail("Fill in every blank, including the circle.");
  }
  if (v.op !== "+") {
    return fail('"Altogether" means put both bars together. Which operation joins them?');
  }
  const setOk = (x === p.n && y === p.bVal) || (x === p.bVal && y === p.n);
  if (!setOk) {
    if (x === p.d || y === p.d) {
      return fail(
        `${p.d} is the difference, not anyone's total. Use ${p.A}'s and ${p.B}'s amounts.`,
        ["x", "y"],
      );
    }
    return fail(`Add ${p.A}'s amount and ${p.B}'s amount from the bars.`, ["x", "y"]);
  }
  if (r !== p.total) return fail("Right setup! Recheck your addition — did you carry?", ["r"]);
  if (s !== r) return fail("Your sentence should match your answer.", ["s"]);

  return { ok: true, message: "", wrong: [] };
}

export function solutionA(p: Problem): PartValues {
  const v = String(p.bVal);
  return { x: String(p.n), y: String(p.d), r: v, s: v, op: p.op };
}

export function solutionB(p: Problem): PartValues {
  const v = String(p.total);
  return { x: String(p.n), y: String(p.bVal), r: v, s: v, op: "+" };
}
