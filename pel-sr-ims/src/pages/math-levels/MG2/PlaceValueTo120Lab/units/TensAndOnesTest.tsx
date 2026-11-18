import { BaseTenBlocks } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, numberBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { onesW, tensW } from "./words";

// ---------- end-of-unit test: Tens and Ones ----------
// 10 questions from 10 generators. Self-contained — same no-circular-import
// convention as every other *Test.tsx in this app (words.ts imports nothing
// from either side). Pictures show the sticks and cubes only, no number labels.

const blocks = (tens: number, ones: number) => <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" />;

/** "How many tens? ☐  How many ones? ☐" — the label comes BEFORE each box, so
 *  no word after a box has to agree with its answer ("☐ ten" gave away the 1,
 *  review E2-38). */
const tensOnesSentence = (n: number, tens: number, ones: number, hint: string) =>
  sentence({ prompt: `${n}. How many tens and ones?`, hint, explain: `${n} is ${tensW(tens)} and ${onesW(ones)}.` }, "How many tens? ", numberBlank(tens), "  How many ones? ", numberBlank(ones), "");

/** Standard case: a regular two-digit number, both blanks in one sentence step. */
export const standardSentenceQuestion = (): TestQuestion[] => {
  const tens = randInt(2, 9);
  let ones: number;
  do {
    ones = randInt(1, 9);
  } while (ones === tens);
  const n = tens * 10 + ones;
  return [{ visual: blocks(tens, ones), difficulty: "easy", step: tensOnesSentence(n, tens, ones, "Count the sticks. Count the cubes.") }];
};

/** Teen number: the name doesn't say "ten," but it still has 1 ten. */
export const teenSentenceQuestion = (): TestQuestion[] => {
  const ones = randInt(2, 9);
  const n = 10 + ones;
  return [{ visual: blocks(1, ones), difficulty: "medium", step: tensOnesSentence(n, 1, ones, "A stick is a ten.") }];
};

/** Special case: exactly 10 — "0 ones" must be an available, correct answer. */
export const exactlyTenQuestion = (): TestQuestion[] => {
  return [{ visual: blocks(1, 0), difficulty: "easy", step: tensOnesSentence(10, 1, 0, "Count the cubes.") }];
};

/** Special case: a number like 70 — again, 0 ones is the real, correct answer. */
export const exactDecadeQuestion = (): TestQuestion[] => {
  const tens = randInt(2, 9);
  const n = tens * 10;
  return [{ visual: blocks(tens, 0), difficulty: "medium", step: tensOnesSentence(n, tens, 0, "Count the cubes.") }];
};

/** Reverse direction: given tens/ones counts, name the number. */
export const reverseBuildQuestion = (): TestQuestion[] => {
  const tens = randInt(2, 9);
  const ones = randInt(1, 9);
  const n = tens * 10 + ones;
  return [
    {
      visual: blocks(tens, ones),
      difficulty: "medium",
      step: { kind: "number", prompt: `${tensW(tens)} and ${onesW(ones)} is what number?`, hint: "Write the tens first.", explain: `${tensW(tens)} and ${onesW(ones)} is ${n}.`, answer: n },
    },
  ];
};

/** Reverse direction at the teen edge: 1 ten plus some ones, named as a number. */
export const reverseTeenQuestion = (): TestQuestion[] => {
  const ones = randInt(1, 9);
  const n = 10 + ones;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `1 ten and ${onesW(ones)} is what number?`, hint: "1 ten and some ones is a teen number.", explain: `1 ten and ${onesW(ones)} is ${n}.`, answer: n },
    },
  ];
};

/** Reverse direction, as a choice — distractors: the digits swapped, and the
 *  two digits added (counting each stick as 1). */
export const reverseDigitSwapChoiceQuestion = (): TestQuestion[] => {
  let tens: number, ones: number;
  do {
    tens = randInt(2, 9);
    ones = randInt(1, 9);
  } while (tens === ones);
  const n = tens * 10 + ones;
  const swapped = ones * 10 + tens;
  return [
    {
      visual: blocks(tens, ones),
      difficulty: "hard",
      step: choice(
        { prompt: `${tensW(tens)} and ${onesW(ones)} is which number?`, hint: "Write the tens first.", explain: `${tensW(tens)} and ${onesW(ones)} is ${n}.` },
        String(n),
        [String(swapped), String(tens + ones)] // misconceptions: digits in the wrong order; each stick counted as 1
      ),
    },
  ];
};

/** 0 ones in a number like 50 (replaces the old true/false item, review C1-08 / E1-03). */
export const zeroOnesQuestion = (): TestQuestion[] => {
  const tens = randInt(2, 9);
  const n = tens * 10;
  return [
    {
      visual: blocks(tens, 0),
      difficulty: "hard",
      step: { kind: "number", prompt: `How many ones are in ${n}?`, hint: "Count the cubes.", explain: `${n} is ${tensW(tens)} and 0 ones.`, answer: 0 },
    },
  ];
};

/** Choice question with the digit-swap distractor framed the other way:
 *  given the number, pick its correct tens and ones. */
export const standardChoiceQuestion = (): TestQuestion[] => {
  let tens: number, ones: number;
  do {
    tens = randInt(2, 9);
    ones = randInt(1, 9);
  } while (tens === ones);
  const n = tens * 10 + ones;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Which one is ${n}?`, hint: "Count the sticks first.", explain: `${n} is ${tensW(tens)} and ${onesW(ones)}.` },
        `${tensW(tens)} and ${onesW(ones)}`,
        [`${tensW(ones)} and ${onesW(tens)}`] // misconception: swapping which digit is tens vs ones
      ),
    },
  ];
};

/** 11 is still 1 ten and some ones, though "eleven" doesn't say "ten"
 *  (replaces the old true/false item, review C1-08 / E1-22). */
export const elevenOnesQuestion = (): TestQuestion[] => {
  return [
    {
      visual: blocks(1, 1),
      difficulty: "hard",
      step: { kind: "number", prompt: "11 is 1 ten and how many ones?", hint: "Count the cubes.", explain: "11 is 1 ten and 1 one.", answer: 1 },
    },
  ];
};

export const tensAndOnesTest: Unit["test"] = {
  questions: [
    standardSentenceQuestion,
    teenSentenceQuestion,
    exactlyTenQuestion,
    exactDecadeQuestion,
    reverseBuildQuestion,
    reverseTeenQuestion,
    reverseDigitSwapChoiceQuestion,
    zeroOnesQuestion,
    standardChoiceQuestion,
    elevenOnesQuestion,
  ],
  passScore: 9,
};
