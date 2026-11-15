// Story and word templates for Unit 1 (why parentheses) and Unit 3 (words <->
// expressions). Imported by units AND Tests (never a unit <-> Test cycle).

import { pick, randInt } from "../../../shared/lib/math";
import { bin, evalExpr, exprText, type Expr } from "./expr";
import type { ItemColorName } from "../diagrams/GroupsPicture";

// ---------- Unit 1: "in each group" vs "one extra" stories ----------

export interface Scene {
  /** "lunch bags" */
  groups: string;
  /** "bag" */
  group: string;
  item1: string;
  item2: string;
  /** "packs" (present tense) */
  verb: string;
  /** where the extras go */
  extraSpot: string;
  /** a short name for that place, for the picture's label ("table") */
  spotLabel: string;
  /** "in" (a bag, a box) or "on" (a plate) */
  prep: "in" | "on";
  /** Dot colors in the picture (diagrams/GroupsPicture.tsx). */
  color1: ItemColorName;
  color2: ItemColorName;
}

export const SCENES: Scene[] = [
  { groups: "lunch bags", group: "bag", item1: "apples", item2: "oranges", verb: "packs", extraSpot: "on the table", spotLabel: "table", prep: "in", color1: "red", color2: "orange" },
  { groups: "pencil boxes", group: "box", item1: "pencils", item2: "erasers", verb: "fills", extraSpot: "on the teacher's desk", spotLabel: "desk", prep: "in", color1: "yellow", color2: "purple" },
  { groups: "plates", group: "plate", item1: "pancakes", item2: "strawberries", verb: "sets out", extraSpot: "in a bowl", spotLabel: "bowl", prep: "on", color1: "yellow", color2: "red" },
  { groups: "gift bags", group: "bag", item1: "stickers", item2: "bookmarks", verb: "makes", extraSpot: "in the prize box", spotLabel: "prize box", prep: "in", color1: "blue", color2: "green" },
];

export const NAMES: { name: string; they: "She" | "He" }[] = [
  { name: "Mia", they: "She" },
  { name: "Leo", they: "He" },
  { name: "Ana", they: "She" },
  { name: "Sam", they: "He" },
  { name: "Kim", they: "She" },
  { name: "Ben", they: "He" },
];

export type StoryKind = "each" | "extra";

export interface FruitStory {
  kind: StoryKind;
  scene: Scene;
  who: (typeof NAMES)[number];
  n: number;
  a: number;
  b: number;
  /** The story, without the question. */
  text: string;
  question: string;
  /** The matching expression, as written on the right choice. */
  right: Expr;
  /** The other two choices: the other story kind, and "a + (b × n)". */
  wrong: Expr[];
}

/**
 * kind "each": every group gets a of item1 AND b of item2  -> (a + b) × n.
 * kind "extra": every group gets a of item1, plus b of item2 just once -> (n × a) + b.
 * The written order of each expression is mixed (n × (a + b) or (a + b) × n),
 * so a choice's position or shape never decides it.
 */
export const fruitStory = (kind: StoryKind): FruitStory => {
  const scene = pick(SCENES);
  const who = pick(NAMES);
  const n = randInt(3, 7);
  const a = randInt(2, 6);
  // 2 or more of each item, so every noun is plural ("2 oranges", never "1 oranges").
  let b = randInt(2, 5);
  while (b === a) b = randInt(2, 5);
  const each = Math.random() < 0.5 ? bin("×", bin("+", a, b, "paren"), n) : bin("×", n, bin("+", a, b, "paren"));
  const extra = Math.random() < 0.5 ? bin("+", bin("×", n, a, "paren"), b) : bin("+", b, bin("×", n, a, "paren"));
  const across = bin("+", a, bin("×", b, n, "paren"));
  const text =
    kind === "each"
      ? pick([
          `${who.name} ${scene.verb} ${n} ${scene.groups}. Each ${scene.group} gets ${a} ${scene.item1} and ${b} ${scene.item2}.`,
          `${who.name} ${scene.verb} ${n} ${scene.groups}. ${who.they} puts ${b} ${scene.item2} and ${a} ${scene.item1} ${scene.prep} each ${scene.group}.`,
        ])
      : pick([
          `${who.name} ${scene.verb} ${n} ${scene.groups} with ${a} ${scene.item1} ${scene.prep} each. ${who.they} also puts ${b} ${scene.item2} ${scene.extraSpot}.`,
          `${who.name} puts ${b} ${scene.item2} ${scene.extraSpot}. Then ${who.they.toLowerCase()} ${scene.verb} ${n} ${scene.groups} with ${a} ${scene.item1} ${scene.prep} each.`,
        ]);
  return {
    kind,
    scene,
    who,
    n,
    a,
    b,
    text,
    question: `How many ${scene.item1} and ${scene.item2} are there in all?`,
    right: kind === "each" ? each : extra,
    wrong: kind === "each" ? [extra, across] : [each, across],
  };
};

export const storyValue = (s: FruitStory): number => evalExpr(s.right);

// ---------- Unit 3: words <-> expressions ----------

export interface WordsTemplate {
  id: string;
  /** "Add 8 and 7, then multiply by 2." */
  words: string;
  expr: Expr;
  /** Expressions a student builds by misreading the words (right one excluded). */
  traps: { expr: Expr; why: string }[];
  /** Descriptions that DON'T match `expr`, for the expression -> words direction. */
  wrongWords: string[];
}

/**
 * Word order and operation order don't match in these ("add 8 and 7, then
 * multiply by 2" is 2 × (8 + 7)), which is the 5.OA.2 skill. "Subtract b
 * from a" is the order trap. Every expression keeps its first step in
 * parentheses (grade 5: no "multiply first" rule).
 */
export const WORDS_IDS = ["addTimes", "subTimes", "timesAdd", "addDivide", "timesSub", "addDouble"];

export const wordsTemplate = (id?: string): WordsTemplate => {
  const pickId = id ?? pick(WORDS_IDS);
  // Three different numbers, so no two choices can read the same.
  const k = randInt(2, 5);
  let b = randInt(2, 9);
  while (b === k) b = randInt(2, 9);
  let a = randInt(4, 15);
  while (a === b || a === k) a = randInt(4, 15);
  switch (pickId) {
    case "addTimes":
      return {
        id: pickId,
        words: `Add ${a} and ${b}, then multiply by ${k}.`,
        expr: Math.random() < 0.5 ? bin("×", k, bin("+", a, b, "paren")) : bin("×", bin("+", a, b, "paren"), k),
        traps: [
          { expr: bin("+", bin("×", k, a, "paren"), b), why: "multiplies first" }, // reads the numbers in order, wrong first step
          { expr: bin("+", a, bin("×", b, k, "paren")), why: "multiplies only one number" },
        ],
        wrongWords: [`Multiply ${b} by ${k}, then add ${a}.`, `Multiply ${a} by ${k}, then add ${b}.`],
      };
    case "addDouble":
      return {
        id: pickId,
        words: `Add ${a} and ${b}, then double it.`,
        expr: bin("×", 2, bin("+", a, b, "paren")),
        traps: [
          { expr: bin("+", bin("×", 2, a, "paren"), b), why: "doubles only the first number" },
          { expr: bin("+", a, bin("×", b, 2, "paren")), why: "doubles only the second number" },
        ],
        wrongWords: [`Double ${b}, then add ${a}.`, `Add ${a}, ${b} and 2.`],
      };
    case "subTimes": {
      const big = a + b + randInt(1, 6);
      return {
        id: pickId,
        words: `Subtract ${b} from ${big}, then multiply by ${k}.`,
        expr: Math.random() < 0.5 ? bin("×", k, bin("−", big, b, "paren")) : bin("×", bin("−", big, b, "paren"), k),
        traps: [
          { expr: bin("−", bin("×", k, big, "paren"), b), why: "multiplies first" },
          { expr: bin("−", big, bin("×", b, k, "paren")), why: "multiplies only one number" },
        ],
        wrongWords: [`Multiply ${b} by ${k}, then subtract it from ${big}.`, `Subtract ${big} from ${b}, then multiply by ${k}.`],
      };
    }
    case "timesAdd":
      return {
        id: pickId,
        words: `Multiply ${b} by ${k}, then add ${a}.`,
        expr: Math.random() < 0.5 ? bin("+", bin("×", b, k, "paren"), a) : bin("+", a, bin("×", b, k, "paren")),
        traps: [
          { expr: bin("×", b, bin("+", k, a, "paren")), why: "adds first" },
          { expr: bin("×", bin("+", a, b, "paren"), k), why: "adds the wrong numbers first" },
        ],
        wrongWords: [`Add ${k} and ${a}, then multiply by ${b}.`, `Add ${a} and ${b}, then multiply by ${k}.`],
      };
    case "timesSub": {
      let c = randInt(1, k - 1);
      while (c === b && k > 2) c = randInt(1, k - 1);
      return {
        id: pickId,
        words: `Multiply ${b} by ${k}, then subtract ${c}.`,
        expr: bin("−", bin("×", b, k, "paren"), c),
        traps: [
          { expr: bin("×", b, bin("−", k, c, "paren")), why: "subtracts first" },
          { expr: bin("−", bin("×", b, c, "paren"), k), why: "mixes up the numbers" },
        ],
        wrongWords: [`Subtract ${c} from ${k}, then multiply by ${b}.`, `Multiply ${b} by ${c}, then subtract ${k}.`],
      };
    }
    default: {
      // addDivide: (a + b) ÷ k, built so it divides evenly
      const q = randInt(2, 9);
      const k2 = randInt(2, 5);
      const s = q * k2;
      let a2 = randInt(1, s - 1);
      while (a2 === s - a2 || a2 === k2 || s - a2 === k2) a2 = randInt(1, s - 1);
      const b2 = s - a2;
      return {
        id: "addDivide",
        words: `Add ${a2} and ${b2}, then divide by ${k2}.`,
        expr: bin("÷", bin("+", a2, b2, "paren"), k2),
        traps: [
          { expr: bin("+", a2, bin("÷", b2, k2, "paren")), why: "divides only one number" },
          { expr: bin("×", bin("+", a2, b2, "paren"), k2), why: "multiplies instead of dividing" },
        ],
        wrongWords: [`Divide ${b2} by ${k2}, then add ${a2}.`, `Add ${a2} and ${b2}, then multiply by ${k2}.`],
      };
    }
  }
};

export const wordsChoices = (t: WordsTemplate): { right: string; wrong: string[] } => ({
  right: exprText(t.expr),
  wrong: t.traps.map((x) => exprText(x.expr)).filter((s) => s !== exprText(t.expr)),
});

// ---------- Unit 3: big numbers, compare without working it out ----------

export const bigPair = (): { A: number; B: number } => ({ A: randInt(1200, 49999), B: randInt(120, 999) });
