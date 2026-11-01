import { pick, randInt } from "../../../shared/lib/math";

// ============================================================================
// Remainder scenarios for Unit 4 (4.OA.3, interpreting remainders). Leaf
// module (no unit/Test imports) shared by InterpretingRemainders.tsx and its
// Test, so the story, the division fact, and all three framings' answers
// come from ONE builder. Dividend is built as divisor × quotient + remainder
// (never a random dividend hoping for a remainder), remainder always ≥ 1.
// ============================================================================

export type Framing = "full" | "needed" | "left";

export interface RemainderCtx {
  setup: (n: number, d: number) => string;
  item: string; // plural
  group: [string, string]; // singular, plural
  q: Record<Framing, string>;
}

const CTXS: RemainderCtx[] = [
  {
    setup: (n, d) => `${n} students are going on a field trip. Each van holds ${d} students.`,
    item: "students",
    group: ["van", "vans"],
    q: {
      full: "How many vans can be completely filled?",
      needed: "How many vans are needed so every student gets a ride?",
      left: "After filling as many vans as possible, how many students are left over?",
    },
  },
  {
    setup: (n, d) => `A bakery has ${n} cookies. Each box holds ${d} cookies.`,
    item: "cookies",
    group: ["box", "boxes"],
    q: {
      full: "How many boxes can be filled all the way?",
      needed: "How many boxes are needed to pack every cookie?",
      left: "After filling as many boxes as possible, how many cookies are left over?",
    },
  },
  {
    setup: (n, d) => `${n} guests are coming to a party. Each table seats ${d} guests.`,
    item: "guests",
    group: ["table", "tables"],
    q: {
      full: "How many tables will be completely full?",
      needed: "How many tables are needed so every guest has a seat?",
      left: "After filling as many tables as possible, how many guests are left over?",
    },
  },
  {
    setup: (n, d) => `Ana has ${n} stickers. Each page of her album holds ${d} stickers.`,
    item: "stickers",
    group: ["page", "pages"],
    q: {
      full: "How many pages can Ana fill completely?",
      needed: "How many pages does Ana need to hold all of her stickers?",
      left: "After filling as many pages as possible, how many stickers are left over?",
    },
  },
];

export interface RemainderCase {
  ctx: RemainderCtx;
  n: number;
  d: number;
  q: number;
  r: number;
  answer: Record<Framing, number>;
}

export interface RemainderOpts {
  /** Force a 3-digit dividend. */
  big?: boolean;
  /** Force remainder 1 (the "even ONE left needs another group" edge). */
  rOne?: boolean;
  /** Force remainder = divisor − 1 (the biggest possible remainder). */
  rMax?: boolean;
}

/** d 3-9, q 4-30, r 1..d-1; r is never equal to q or q + 1, so the three
 *  framings' answers are always three DIFFERENT numbers (otherwise a "drop
 *  the remainder" answer could accidentally equal the "remainder" answer). */
export function remainderCase(opts: RemainderOpts = {}): RemainderCase {
  let d = 0;
  let q = 0;
  let r = 0;
  let n = 0;
  do {
    d = randInt(3, 9);
    q = randInt(4, 30);
    r = opts.rOne ? 1 : opts.rMax ? d - 1 : randInt(1, d - 1);
    n = d * q + r;
  } while (r === q || r === q + 1 || (opts.big && n < 100));
  return { ctx: pick(CTXS), n, d, q, r, answer: { full: q, needed: q + 1, left: r } };
}

export const ALL_FRAMINGS: Framing[] = ["full", "needed", "left"];

/** The three "what do I do with the remainder" choices, phrased for this case. */
export function actionText(c: RemainderCase): Record<Framing, string> {
  const [one] = c.ctx.group;
  return {
    full: `Drop it — the ${c.r} left over can't fill another ${one}`,
    needed: `Add one more ${one} for the ${c.r} left over`,
    left: `The remainder, ${c.r}, IS the answer`,
  };
}

/** Answer with its unit word, e.g. "16 vans" / "4 students". */
export function answerWithUnit(c: RemainderCase, f: Framing): string {
  const v = c.answer[f];
  const [one, many] = c.ctx.group;
  return f === "left" ? `${v} ${c.ctx.item}` : `${v} ${v === 1 ? one : many}`;
}
