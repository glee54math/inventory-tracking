import { pick } from "../../../shared/lib/math";

// ============================================================================
// Word-problem contexts for Unit 2 (multiplicative vs additive comparison).
// A plain data/phrasing module with NO imports from any unit or Test file, so
// both MultVsAddComparison.tsx and MultVsAddComparisonTest.tsx can import it
// without creating the unit ↔ Test circular import the brief warns about
// (the cycle needs the two files to import EACH OTHER; a third leaf module
// imported by both can't form one). Kept as one source of truth instead of a
// verbatim copy in the Test file because these are ~60 lines of phrasing
// templates, not a "small data table."
//
// Three kinds, matching 4.OA.2's own examples: counting objects, lengths,
// and prices.
// ============================================================================

export interface CompareCtx {
  kind: "count" | "length" | "money";
  /** Short labels for the bar diagram (≤ 8 chars). */
  aLabel: string;
  bLabel: string;
  /** "12 stickers" / "12 inches" / "$12". */
  amt: (n: number) => string;
  /** For NumberStep display. */
  prefix?: string;
  suffix?: string;
  aHas: (n: number) => string;
  bHas: (n: number) => string;
  bTimes: (t: number) => string;
  bMore: (d: number) => string;
  /** "B has {big}. That is {t} times as many as A has." */
  bIsTimesOfA: (big: number, t: number) => string;
  qB: string;
  qA: string;
  qTimes: string;
  qMore: string;
}

const NAMES = ["Maria", "Jo", "Ben", "Kim", "Omar", "Lena", "Priya", "Diego", "Tia", "Raj", "Sam", "Ana"];
const NOUNS = ["stickers", "marbles", "shells", "cards", "stamps", "beads"];
const RIBBONS: [string, string][] = [
  ["red", "blue"],
  ["green", "yellow"],
  ["purple", "orange"],
];
// [cheaper item, pricier item, short bar label for each]
const PRICES: [string, string, string, string][] = [
  ["pen", "backpack", "pen", "backpack"],
  ["bookmark", "book", "bookmark", "book"],
  ["sticker pack", "board game", "stickers", "game"],
  ["juice box", "lunch box", "juice", "lunchbox"],
];

function countCtx(): CompareCtx {
  const a = pick(NAMES);
  let b = pick(NAMES);
  while (b === a) b = pick(NAMES);
  const noun = pick(NOUNS);
  return {
    kind: "count",
    aLabel: a,
    bLabel: b,
    amt: (n) => `${n} ${noun}`,
    suffix: noun,
    aHas: (n) => `${a} has ${n} ${noun}.`,
    bHas: (n) => `${b} has ${n} ${noun}.`,
    bTimes: (t) => `${b} has ${t} times as many ${noun} as ${a}.`,
    bMore: (d) => `${b} has ${d} more ${noun} than ${a}.`,
    bIsTimesOfA: (big, t) => `${b} has ${big} ${noun}. That is ${t} times as many as ${a} has.`,
    qB: `How many ${noun} does ${b} have?`,
    qA: `How many ${noun} does ${a} have?`,
    qTimes: `How many times as many ${noun} does ${b} have as ${a}?`,
    qMore: `How many more ${noun} does ${b} have than ${a}?`,
  };
}

function lengthCtx(): CompareCtx {
  const [ca, cb] = pick(RIBBONS);
  return {
    kind: "length",
    aLabel: ca,
    bLabel: cb,
    amt: (n) => `${n} inches`,
    suffix: "inches",
    aHas: (n) => `The ${ca} ribbon is ${n} inches long.`,
    bHas: (n) => `The ${cb} ribbon is ${n} inches long.`,
    bTimes: (t) => `The ${cb} ribbon is ${t} times as long as the ${ca} ribbon.`,
    bMore: (d) => `The ${cb} ribbon is ${d} inches longer than the ${ca} ribbon.`,
    bIsTimesOfA: (big, t) => `The ${cb} ribbon is ${big} inches long. That is ${t} times as long as the ${ca} ribbon.`,
    qB: `How long is the ${cb} ribbon?`,
    qA: `How long is the ${ca} ribbon?`,
    qTimes: `How many times as long as the ${ca} ribbon is the ${cb} ribbon?`,
    qMore: `How many inches longer is the ${cb} ribbon than the ${ca} ribbon?`,
  };
}

function moneyCtx(): CompareCtx {
  const [ia, ib, la, lb] = pick(PRICES);
  return {
    kind: "money",
    aLabel: la,
    bLabel: lb,
    amt: (n) => `$${n}`,
    prefix: "$",
    aHas: (n) => `A ${ia} costs $${n}.`,
    bHas: (n) => `A ${ib} costs $${n}.`,
    bTimes: (t) => `A ${ib} costs ${t} times as much as the ${ia}.`,
    bMore: (d) => `A ${ib} costs $${d} more than the ${ia}.`,
    bIsTimesOfA: (big, t) => `A ${ib} costs $${big}. That is ${t} times as much as a ${ia}.`,
    qB: `How much does the ${ib} cost?`,
    qA: `How much does the ${ia} cost?`,
    qTimes: `How many times as much as the ${ia} does the ${ib} cost?`,
    qMore: `How much more does the ${ib} cost than the ${ia}?`,
  };
}

/** A random context of a random kind (or the requested kind). */
export function makeCtx(kind?: CompareCtx["kind"]): CompareCtx {
  const k = kind ?? pick(["count", "length", "money"] as const);
  return k === "count" ? countCtx() : k === "length" ? lengthCtx() : moneyCtx();
}
