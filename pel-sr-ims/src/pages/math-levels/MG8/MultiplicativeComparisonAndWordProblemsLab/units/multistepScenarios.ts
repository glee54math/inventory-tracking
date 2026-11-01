import { pick, randInt } from "../../../shared/lib/math";

// ============================================================================
// Multistep word-problem scenarios for Unit 3 (4.OA.3). A leaf module with no
// imports from any unit/Test file, so both MultistepWordProblems.tsx and
// MultistepWordProblemsTest.tsx can build from ONE function per scenario —
// the story text, every intermediate value, the letter equation, and the
// misconception distractors are all computed in one place, so a story and
// its graded answers can never silently disagree.
//
// Every scenario is built BACKWARD from its answer (e.g. dividend = each ×
// groups + kept), so every division comes out even.
// ============================================================================

export type MultistepKind = "addThenMultiply" | "subtractThenDivide" | "multiplyThenSubtract" | "multiplyThenAdd" | "divideThenAdd" | "twoProducts";

export interface WorkStep {
  /** e.g. "12 + 9" */
  expr: string;
  value: number;
}

export interface Multistep {
  kind: MultistepKind;
  story: string;
  /** The letter for the unknown. */
  letter: string;
  /** "the number of marbles in all" — what the letter stands for. */
  unknownDesc: string;
  /** Question asking for just the first step's value, in words. */
  step1Q: string;
  /** What the first step's value MEANS in the story. */
  step1Meaning: string;
  /** A plausible wrong meaning for it (misreads which quantity it counts). */
  step1WrongMeaning: string;
  work: WorkStep[];
  final: number;
  /** e.g. "m = (12 + 9) × 4" */
  equation: string;
  /** Wrong equation built from ONLY the last two numbers in the story. */
  lastTwoEquation: string;
  /** Wrong equation with a wrong operation or wrong order. */
  wrongOpEquation: string;
  /** The value you'd get from only the last two numbers (for distractors). */
  lastTwoValue: number;
  prefix?: string;
  suffix?: string;
}

const NAMES = ["Maya", "Diego", "Priya", "Jamal", "Lena", "Omar", "Sofia", "Caleb", "Ava", "Noah"];

export function addThenMultiply(): Multistep {
  const g = randInt(3, 9);
  const a = randInt(6, 30);
  const b = randInt(5, 30);
  const one = a + b;
  const final = one * g;
  const ctx = pick([
    { group: "bags", thing1: "red marbles", thing2: "blue marbles", all: "marbles" },
    { group: "teams", thing1: "girls", thing2: "boys", all: "players" },
    { group: "shelves", thing1: "picture books", thing2: "chapter books", all: "books" },
  ]);
  return {
    kind: "addThenMultiply",
    story: `There are ${g} ${ctx.group}. Each one has ${a} ${ctx.thing1} and ${b} ${ctx.thing2}. How many ${ctx.all} are there in all?`,
    letter: "m",
    unknownDesc: `the number of ${ctx.all} in all`,
    step1Q: `How many ${ctx.all} are in ONE of the ${ctx.group}?`,
    step1Meaning: `The number of ${ctx.all} in one of the ${ctx.group}`,
    step1WrongMeaning: `The number of ${ctx.all} in all ${g} ${ctx.group}`,
    work: [
      { expr: `${a} + ${b}`, value: one },
      { expr: `${one} × ${g}`, value: final },
    ],
    final,
    equation: `m = (${a} + ${b}) × ${g}`,
    // Misconception: only using the last two numbers read (a and b) — stops at one group.
    lastTwoEquation: `m = ${a} + ${b}`,
    // Misconception: adding the number of groups instead of multiplying.
    wrongOpEquation: `m = ${a} + ${b} + ${g}`,
    lastTwoValue: a + b,
    suffix: ctx.all,
  };
}

export function subtractThenDivide(): Multistep {
  let g = 0;
  let each = 0;
  let k = 0;
  do {
    g = randInt(3, 9);
    each = randInt(6, 25);
    k = randInt(2, 20);
  } while (k * g === each); // keep the last-two-numbers trap from landing on the real answer
  const total = each * g + k;
  const name = pick(NAMES);
  const ctx = pick([
    { stuff: "stickers", to: "friends" },
    { stuff: "crayons", to: "tables" },
    { stuff: "baseball cards", to: "cousins" },
  ]);
  return {
    kind: "subtractThenDivide",
    story: `${name} has ${total} ${ctx.stuff}. ${name} keeps ${k} and shares the rest equally among ${g} ${ctx.to}. How many ${ctx.stuff} does each of the ${ctx.to} get?`,
    letter: "s",
    unknownDesc: `the number of ${ctx.stuff} each of the ${ctx.to} gets`,
    step1Q: `How many ${ctx.stuff} are left to share after ${name} keeps ${k}?`,
    step1Meaning: `The ${ctx.stuff} left to share after ${name} keeps some`,
    step1WrongMeaning: `The ${ctx.stuff} each of the ${ctx.to} gets`,
    work: [
      { expr: `${total} − ${k}`, value: total - k },
      { expr: `${total - k} ÷ ${g}`, value: each },
    ],
    final: each,
    equation: `s = (${total} − ${k}) ÷ ${g}`,
    // Misconception: only using the last two numbers read (k and g).
    lastTwoEquation: `s = ${k} × ${g}`,
    // Misconception: doing the steps in the wrong order (share first, then take away).
    wrongOpEquation: `s = ${total} ÷ ${g} − ${k}`,
    lastTwoValue: k * g,
    suffix: ctx.stuff,
  };
}

export function multiplyThenSubtract(): Multistep {
  const bill = pick([50, 100]);
  let p = 0;
  let q = 0;
  do {
    p = randInt(4, 15);
    q = randInt(2, 9);
  } while (p * q >= bill || p * q < bill / 3);
  const name = pick(NAMES);
  const thing = pick(["movie tickets", "museum passes", "pizza slices", "notebooks"]);
  const cost = p * q;
  return {
    kind: "multiplyThenSubtract",
    story: `${thing[0].toUpperCase() + thing.slice(1)} cost $${p} each. ${name} buys ${q} of them and pays with a $${bill} bill. How much change does ${name} get?`,
    letter: "c",
    unknownDesc: `${name}'s change in dollars`,
    step1Q: `How much do the ${q} ${thing} cost altogether?`,
    step1Meaning: `The total cost of the ${q} ${thing}`,
    step1WrongMeaning: `The change ${name} gets back`,
    work: [
      { expr: `${q} × ${p}`, value: cost },
      { expr: `${bill} − ${cost}`, value: bill - cost },
    ],
    final: bill - cost,
    equation: `c = ${bill} − ${q} × ${p}`,
    // Misconception: only the last two numbers read (q and the bill).
    lastTwoEquation: `c = ${bill} − ${q}`,
    // Misconception: adding the cost to the bill instead of subtracting.
    wrongOpEquation: `c = ${bill} + ${q} × ${p}`,
    lastTwoValue: bill - q,
    prefix: "$",
  };
}

/** `per` is always two-digit (12-48) — the case Unit 3's reasonableness
 *  bucket estimates by rounding to the nearest ten. */
export function multiplyThenAdd(): Multistep {
  const q = randInt(3, 9);
  const per = randInt(12, 48);
  const extra = randInt(11, 49);
  const name = pick(NAMES);
  const ctx = pick([
    { box: "boxes", item: "crayons" },
    { box: "packs", item: "pencils" },
    { box: "bags", item: "apples" },
  ]);
  const prod = q * per;
  return {
    kind: "multiplyThenAdd",
    story: `${name} has ${q} ${ctx.box} with ${per} ${ctx.item} in each, plus ${extra} loose ${ctx.item}. How many ${ctx.item} does ${name} have in all?`,
    letter: "n",
    unknownDesc: `the number of ${ctx.item} in all`,
    step1Q: `How many ${ctx.item} are in the ${q} ${ctx.box}?`,
    step1Meaning: `The ${ctx.item} inside the ${ctx.box} (not counting the loose ones)`,
    step1WrongMeaning: `All of ${name}'s ${ctx.item}, loose ones included`,
    work: [
      { expr: `${q} × ${per}`, value: prod },
      { expr: `${prod} + ${extra}`, value: prod + extra },
    ],
    final: prod + extra,
    equation: `n = ${q} × ${per} + ${extra}`,
    // Misconception: only the last two numbers read.
    lastTwoEquation: `n = ${per} + ${extra}`,
    // Misconception: multiplying the loose ones too.
    wrongOpEquation: `n = ${q} × (${per} + ${extra})`,
    lastTwoValue: per + extra,
    suffix: ctx.item,
  };
}

export function divideThenAdd(): Multistep {
  let g = 0;
  let each = 0;
  do {
    g = randInt(3, 9);
    each = randInt(5, 24);
  } while (each === g); // else g + more (the last-two-numbers trap) equals the real answer
  const more = randInt(2, 15);
  const total = each * g;
  const ctx = pick([
    { stuff: "cards", people: "friends", giver: "a teacher" },
    { stuff: "beads", people: "kids", giver: "the art club" },
    { stuff: "seeds", people: "gardeners", giver: "the store" },
  ]);
  return {
    kind: "divideThenAdd",
    story: `${total} ${ctx.stuff} are shared equally among ${g} ${ctx.people}. Then each of them gets ${more} more ${ctx.stuff} from ${ctx.giver}. How many ${ctx.stuff} does each of the ${ctx.people} have now?`,
    letter: "e",
    unknownDesc: `the number of ${ctx.stuff} each of the ${ctx.people} has now`,
    step1Q: `How many ${ctx.stuff} does each of the ${ctx.people} get from the first sharing?`,
    step1Meaning: `What each of the ${ctx.people} gets from the first sharing`,
    step1WrongMeaning: `What all ${g} ${ctx.people} have together at the end`,
    work: [
      { expr: `${total} ÷ ${g}`, value: each },
      { expr: `${each} + ${more}`, value: each + more },
    ],
    final: each + more,
    equation: `e = ${total} ÷ ${g} + ${more}`,
    // Misconception: only the last two numbers read.
    lastTwoEquation: `e = ${g} + ${more}`,
    // Misconception: adding the extra before sharing (changes the meaning).
    wrongOpEquation: `e = (${total} + ${more}) ÷ ${g}`,
    lastTwoValue: g + more,
    suffix: ctx.stuff,
  };
}

/** The three-operation case: two products, then a sum. */
export function twoProducts(): Multistep {
  const q1 = randInt(2, 9);
  const p1 = randInt(6, 24);
  const q2 = randInt(2, 9);
  const p2 = randInt(6, 24);
  const name = pick(NAMES);
  const [a, b] = pick([
    ["pencils", "erasers"],
    ["red beads", "blue beads"],
    ["juice boxes", "water bottles"],
  ]);
  const t1 = q1 * p1;
  const t2 = q2 * p2;
  return {
    kind: "twoProducts",
    story: `${name} buys ${q1} packs of ${p1} ${a} and ${q2} packs of ${p2} ${b}. How many items does ${name} buy in all?`,
    letter: "t",
    unknownDesc: "the number of items in all",
    step1Q: `How many ${a} does ${name} buy?`,
    step1Meaning: `The number of ${a} only`,
    step1WrongMeaning: "The number of items in all",
    work: [
      { expr: `${q1} × ${p1}`, value: t1 },
      { expr: `${q2} × ${p2}`, value: t2 },
      { expr: `${t1} + ${t2}`, value: t1 + t2 },
    ],
    final: t1 + t2,
    equation: `t = ${q1} × ${p1} + ${q2} × ${p2}`,
    // Misconception: only the last two numbers read.
    lastTwoEquation: `t = ${q2} × ${p2}`,
    // Misconception: adding everything instead of multiplying packs by pack size.
    wrongOpEquation: `t = ${q1} + ${p1} + ${q2} + ${p2}`,
    lastTwoValue: t2,
    suffix: "items",
  };
}

export const MAKERS: Record<MultistepKind, () => Multistep> = {
  addThenMultiply,
  subtractThenDivide,
  multiplyThenSubtract,
  multiplyThenAdd,
  divideThenAdd,
  twoProducts,
};

/** Round to the nearest ten (5 rounds up). */
export const roundTen = (n: number) => Math.round(n / 10) * 10;

export interface ReasonableCase {
  m: Multistep;
  q: number;
  per: number;
  extra: number;
  estimate: number;
  /** The "slipped a place value" answer: the product came out 10 times too big. */
  slip: number;
}

/** Built on multiplyThenAdd (q × per + extra, per and extra two-digit). */
export function reasonableCase(): ReasonableCase {
  const m = multiplyThenAdd();
  const [q, per] = m.work[0].expr.split(" × ").map(Number);
  const extra = m.final - q * per;
  return { m, q, per, extra, estimate: q * roundTen(per) + roundTen(extra), slip: q * per * 10 + extra };
}
