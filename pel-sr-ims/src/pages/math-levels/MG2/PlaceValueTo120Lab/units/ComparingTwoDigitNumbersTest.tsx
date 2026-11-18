import { BlocksPair, HundredChart } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { onesW, tensW } from "./words";

// ---------- end-of-unit test: Comparing Two-Digit Numbers ----------
// 10 questions from 10 generators. Self-contained — same no-circular-import
// convention as every other *Test.tsx in this app.

const symbolFor = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");
const SIGNS = ["<", ">", "="];
const symbolChoice = (a: number, b: number, hint: string) => {
  const sym = symbolFor(a, b);
  return choice({ prompt: `${a} ☐ ${b}. What goes in the box?`, hint, explain: `${a} ${sym} ${b}.` }, sym, SIGNS.filter((s) => s !== sym));
};

/** Different tens digit — decided by tens alone. */
export const diffTensChoiceQuestion = (): TestQuestion[] => {
  let ta: number, tb: number;
  do {
    ta = randInt(1, 9);
    tb = randInt(1, 9);
  } while (ta === tb);
  const a = ta * 10 + randInt(0, 9);
  const b = tb * 10 + randInt(0, 9);
  return [{ visual: <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />, difficulty: "easy", step: symbolChoice(a, b, "More tens is bigger.") }];
};

/** Identifying the tens digit itself — a direct prerequisite check. */
export const tensDigitIdQuestion = (): TestQuestion[] => {
  const tens = randInt(1, 9);
  const n = tens * 10 + randInt(0, 9);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `How many tens are in ${n}?`, hint: "Count the tens.", explain: `${n} has ${tensW(tens)}.`, answer: tens },
    },
  ];
};

/** Same tens digit, different ones — tests checking ones only after tens match. */
export const sameTensDiffOnesChoiceQuestion = (): TestQuestion[] => {
  const tens = randInt(1, 9);
  let o1: number, o2: number;
  do {
    o1 = randInt(0, 9);
    o2 = randInt(0, 9);
  } while (o1 === o2);
  const a = tens * 10 + o1;
  const b = tens * 10 + o2;
  return [{ visual: <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />, difficulty: "medium", step: symbolChoice(a, b, "The tens are the same. Look at the ones.") }];
};

/** Tens first, then the ones (review E1-25: the right answer and the trap no
 *  longer start with the same words, and the stem doesn't say "first"). */
export const tensFirstWhyQuestion = (): TestQuestion[] => {
  const tens = randInt(1, 9);
  let o1: number, o2: number;
  do {
    o1 = randInt(0, 9);
    o2 = randInt(0, 9);
  } while (o1 === o2);
  const a = tens * 10 + o1;
  const b = tens * 10 + o2;
  return [
    {
      visual: <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />,
      difficulty: "hard",
      step: choice(
        { prompt: `${a} and ${b} both have ${tensW(tens)}. What do you look at next?`, hint: "The tens are the same. Look at the ones.", explain: "The tens are the same. The ones decide." },
        "The ones",
        ["The tens"] // misconception: comparing the tens again when they are the same
      ),
    },
  ];
};

/** Equal numbers, with place value (review C2-29): "4 tens and 7 ones ☐ 47",
 *  the blocks drawn beside the number, as in Practice's "Sticks and cubes".
 *  Half the time (review C3-42) the blocks don't match (tens and ones swapped, or 1 ten off),
 *  so the answer isn't always "=". */
export const equalTrapQuestion = (): TestQuestion[] => {
  const n = randInt(11, 99);
  const t = Math.floor(n / 10);
  const o = n % 10;
  let blocks = n;
  if (Math.random() < 1 / 2) {
    // misconception: tens and ones swapped still "look the same"
    blocks = o >= 1 && o !== t ? o * 10 + t : t === 9 ? n - 10 : n + 10;
  }
  const sym = symbolFor(blocks, n);
  const words = `${tensW(Math.floor(blocks / 10))} and ${onesW(blocks % 10)}`;
  return [
    {
      visual: <BlocksPair a={blocks} b={n} middle="box" blocksVsNumber />,
      difficulty: "medium",
      step: choice(
        { prompt: `${words} ☐ ${n}. What goes in the box?`, hint: "Count the sticks by tens. Then the cubes.", explain: `${words} is ${blocks}. ${blocks} ${sym} ${n}.` },
        sym,
        SIGNS.filter((s) => s !== sym)
      ),
    },
  ];
};

/** Digit-reversed near-miss. */
export const reversedDigitsChoiceQuestion = (): TestQuestion[] => {
  let t: number, o: number;
  do {
    t = randInt(1, 9);
    o = randInt(1, 9);
  } while (t === o);
  const a = t * 10 + o;
  const b = o * 10 + t;
  return [{ visual: <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />, difficulty: "hard", step: symbolChoice(a, b, "Look at the tens of each number.") }];
};

/** Tens and ones swapped: which is bigger? (Replaces the old true/false item,
 *  review C1-08 / E1-03.) The two numbers are listed in a random order. */
export const reversedDigitsBiggerQuestion = (): TestQuestion[] => {
  let t: number, o: number;
  do {
    t = randInt(1, 9);
    o = randInt(1, 9);
  } while (t === o);
  const [x, y] = shuffle([t * 10 + o, o * 10 + t]);
  const big = Math.max(x, y);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Which is bigger, ${x} or ${y}?`, hint: "Look at the tens.", explain: `${big} has more tens.` },
        String(big),
        [String(Math.min(x, y))] // misconception: same digits, so it doesn't matter / ones first
      ),
    },
  ];
};

/** The symbol, checked with a picture (review C1-18 / E1-26, decision 2):
 *  the two numbers as sticks and cubes with a box between them. */
export const symbolPictureQuestion = (): TestQuestion[] => {
  let ta: number, tb: number;
  do {
    ta = randInt(1, 9);
    tb = randInt(1, 9);
  } while (ta === tb);
  const a = ta * 10 + randInt(0, 9);
  const b = tb * 10 + randInt(0, 9);
  return [{ visual: <BlocksPair a={a} b={b} middle="box" />, difficulty: "easy", step: symbolChoice(a, b, "The open side faces the bigger number.") }];
};

/** Tens first, typed: the number with the bigger ones digit is the smaller
 *  number (e.g. 39 and 41). Replaces the old true/false "always check the
 *  tens first" item (review C1-08). */
export const tensBeatOnesQuestion = (): TestQuestion[] => {
  const t = randInt(1, 8);
  const small = t * 10 + randInt(6, 9);
  const big = (t + 1) * 10 + randInt(0, 3);
  const [x, y] = shuffle([small, big]);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `${x} and ${y}. Type the bigger number.`, hint: "Look at the tens first.", explain: `${big} has more tens.`, answer: big },
    },
  ];
};

/** Pick-the-biggest among three numbers sharing the same tens digit — forces
 *  a full ones-digit comparison across three options, not just a pair. The
 *  numbers are listed in a random order (review C2-33: the biggest used to be
 *  always last); choice() shuffles the buttons. */
export const pickBiggestSameTensQuestion = (): TestQuestion[] => {
  const tens = randInt(1, 9);
  const onesSet = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
  const nums = onesSet.map((o) => tens * 10 + o);
  const biggest = Math.max(...nums);
  const others = nums.filter((x) => x !== biggest);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Which is biggest: ${nums.join(", ")}?`, hint: "The tens are the same. Look at the ones.", explain: `${biggest} has the most ones.` },
        String(biggest),
        others.map(String)
      ),
    },
  ];
};

export const comparingTwoDigitNumbersTest: Unit["test"] = {
  questions: [
    diffTensChoiceQuestion,
    tensDigitIdQuestion,
    sameTensDiffOnesChoiceQuestion,
    tensFirstWhyQuestion,
    equalTrapQuestion,
    reversedDigitsChoiceQuestion,
    reversedDigitsBiggerQuestion,
    symbolPictureQuestion,
    tensBeatOnesQuestion,
    pickBiggestSameTensQuestion,
  ],
  passScore: 9,
};
