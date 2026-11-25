// Small word helpers shared by this lab's units and Tests. Kept apart from the
// unit files so a *Test.tsx never has to import from its unit (that would be a
// circular import).

/** "1 duck" / "3 ducks". */
export const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** "1 flies" / "3 fly": a verb that agrees with a number. */
export const verb = (n: number, one: string, many: string) => (n === 1 ? one : many);

/** "There is 1 duck." / "There are 3 ducks." */
export const thereAre = (n: number, one: string, many: string) => `There ${n === 1 ? "is" : "are"} ${count(n, one, many)}.`;

/** "1 is" / "3 are", for "3 are blue. 1 is orange." */
export const nIs = (n: number) => `${n} ${n === 1 ? "is" : "are"}`;

/** "fourteen" to "Fourteen", for a word that starts a sentence. */
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * The number to add in a wrong "plus" choice for a take-away story. Normally
 * the story's own number; when that would pass 10, a smaller one that stays in range.
 */
export const plusTrap = (start: number, change: number) => (start + change <= 10 ? change : Math.min(1, 10 - start));

/** How a student's own "total = p + q" is judged. Only "ok" passes. */
export type OwnWayResult = "ok" | "zero" | "repeat" | "wrong";
export const judgeOwnWay = (total: number, used: [number, number][], p: number, q: number): OwnWayResult => {
  if (p === 0 || q === 0) return "zero";
  if (p + q !== total) return "wrong";
  return used.some(([a, b]) => (a === p && b === q) || (a === q && b === p)) ? "repeat" : "ok";
};

/**
 * What "write another way" remembers for one problem. A 0 or a repeat doesn't
 * count as a miss the first time; the next one does, so help can open.
 * `missed` tells the hint to talk about the new row.
 */
export interface OwnWayHelp {
  missed: boolean;
  notCounted: number;
  listeners: Set<() => void>;
}
export const newOwnWayHelp = (): OwnWayHelp => ({ missed: false, notCounted: 0, listeners: new Set() });
export const markOwnWayMissed = (help: OwnWayHelp) => {
  if (help.missed) return;
  help.missed = true;
  help.listeners.forEach((listener) => listener());
};

/** The line for a try that doesn't pass, and whether it counts as a miss. */
export const ownWayReply = (total: number, result: Exclude<OwnWayResult, "ok">, p: number, q: number, notCountedBefore: number): { text: string; good: boolean; miss: boolean } => {
  if (result === "wrong") return { text: `That makes ${p + q}. Make ${total}.`, good: false, miss: true };
  const miss = notCountedBefore >= 1;
  if (result === "repeat") return { text: `Yes, that makes ${total}. Use new numbers.`, good: true, miss };
  return p + q === total ? { text: `Yes, that makes ${total}. No 0 this time.`, good: true, miss } : { text: `No 0 this time. Make ${total}.`, good: false, miss };
};

/** "1, 2, 3" */
export const countList = (from: number, to: number) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i).join(", ");

/** A first part from 1 to total - 1 that isn't one of the numbers in `avoid`. */
export const otherPart = (total: number, avoid: number[], rand: (lo: number, hi: number) => number): number => {
  const options: number[] = [];
  for (let x = 1; x < total; x++) if (!avoid.includes(x)) options.push(x);
  return options[rand(0, options.length - 1)];
};

/** "Is `total` also x and y?" True about half the time; a false pair misses by 1. */
export const alsoPair = (total: number, avoid: number[], rand: (lo: number, hi: number) => number): { x: number; y: number; isTrue: boolean } => {
  const x = otherPart(total, avoid, rand);
  const isTrue = Math.random() < 0.5;
  const right = total - x;
  return { x, y: isTrue ? right : right > 1 && Math.random() < 0.5 ? right - 1 : right + 1, isTrue };
};

export const ITEM_WORDS = {
  stickers: "sticker",
  crayons: "crayon",
  marbles: "marble",
  crackers: "cracker",
  balloons: "balloon",
  blocks: "block",
} as const;
export type ItemWord = keyof typeof ITEM_WORDS;

export const NUMBER_WORDS: Record<number, string> = {
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
};
