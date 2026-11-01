// Lab-local money scenario generators for Unit 3 — pure data, all amounts in
// WHOLE CENTS (never floating dollars), shared by MoneyWordProblems.tsx and
// MoneyWordProblemsTest.tsx. Leaf module: no unit <-> Test import cycle.

import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { quarterPrice } from "./measures";
import { NAMES } from "./wordProblems";

export interface Item {
  one: string;
  many: string;
}

export const ITEMS: Item[] = [
  { one: "notebook", many: "notebooks" },
  { one: "pencil box", many: "pencil boxes" },
  { one: "water bottle", many: "water bottles" },
  { one: "comic book", many: "comic books" },
  { one: "sticker pack", many: "sticker packs" },
  { one: "yo-yo", many: "yo-yos" },
  { one: "puzzle", many: "puzzles" },
  { one: "toy car", many: "toy cars" },
  { one: "jump rope", many: "jump ropes" },
  { one: "paint set", many: "paint sets" },
];

const BILLS = [500, 1000, 2000, 5000, 10000];
/** The smallest common bill that is MORE than the total (so there is change). */
export const billOver = (cents: number): number => BILLS.find((b) => b > cents) ?? Math.ceil((cents + 1) / 10000) * 10000;

export interface WholeDollarScenario {
  name: string;
  item: Item;
  priceCents: number;
  qty: number;
  totalCents: number;
  billCents: number;
  changeCents: number;
}

export function wholeDollarScenario(): WholeDollarScenario {
  const priceCents = randInt(2, 15) * 100;
  const qty = randInt(2, 6);
  const totalCents = priceCents * qty;
  const billCents = billOver(totalCents);
  return { name: pick(NAMES), item: pick(ITEMS), priceCents, qty, totalCents, billCents, changeCents: billCents - totalCents };
}

export interface CentsScenario {
  name: string;
  items: [Item, Item];
  prices: [number, number];
  totalCents: number;
  billCents: number;
  changeCents: number;
}

/** Two prices with real cents (multiples of 5, never whole dollars). `hard`
 *  forces the cents to carry past a dollar when added (e.g. $3.65 + $2.80)
 *  AND the change to need a borrow (bill − total always has nonzero cents). */
export function centsScenario(hard = Math.random() < 0.5): CentsScenario {
  for (;;) {
    const p1 = randInt(21, 199) * 5;
    const p2 = randInt(21, 199) * 5;
    if (p1 % 100 === 0 || p2 % 100 === 0) continue;
    const carries = (p1 % 100) + (p2 % 100) >= 100;
    if (hard !== carries) continue;
    const totalCents = p1 + p2;
    if (totalCents % 100 === 0) continue;
    const [a, b] = shuffle(ITEMS);
    const billCents = billOver(totalCents);
    return { name: pick(NAMES), items: [a, b], prices: [p1, p2], totalCents, billCents, changeCents: billCents - totalCents };
  }
}

export interface MultiItemScenario {
  name: string;
  lines: { item: Item; qty: number; eachCents: number }[];
  totalCents: number;
  billCents: number;
  changeCents: number;
}

/** One item bought several times plus one or two single items, all priced
 *  from the quarter-dollar pool. */
export function multiItemScenario(): MultiItemScenario {
  const [a, b, c] = shuffle(ITEMS);
  const lines = [
    { item: a, qty: randInt(2, 4), eachCents: quarterPrice(75, 600) },
    { item: b, qty: 1, eachCents: quarterPrice(100, 975) },
    ...(Math.random() < 0.5 ? [{ item: c, qty: 1, eachCents: quarterPrice(75, 975) }] : []),
  ];
  const totalCents = lines.reduce((s, l) => s + l.qty * l.eachCents, 0);
  const billCents = billOver(totalCents);
  return { name: pick(NAMES), lines, totalCents, billCents, changeCents: billCents - totalCents };
}

export interface HowManyScenario {
  name: string;
  item: Item;
  priceCents: number;
  budgetCents: number;
  count: number;
  costCents: number;
  leftCents: number;
}

/** "How many can I buy?" — division with a remainder that must be read as
 *  MONEY LEFT OVER. Price from the quarter pool (terminates to the cent);
 *  budget whole dollars; always ≥ 2 items, a nonzero leftover smaller than
 *  the price, and leftover ≠ price − leftover (so the "how much more for
 *  one more" distractor can never equal the true leftover). */
export function howManyScenario(): HowManyScenario {
  for (;;) {
    const priceCents = quarterPrice(125, 975);
    const budgetCents = randInt(10, 50) * 100;
    const count = Math.floor(budgetCents / priceCents);
    const leftCents = budgetCents - count * priceCents;
    if (count < 2 || leftCents === 0 || leftCents * 2 === priceCents) continue;
    return { name: pick(NAMES), item: pick(ITEMS), priceCents, budgetCents, count, costCents: count * priceCents, leftCents };
  }
}
