import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { noRepeats } from "./labHelp";

// ---------- end-of-unit test: Fast Facts Within 5 ----------
// 10 questions from 10 generators. Self-contained: no import from
// FastFactsWithin5.tsx. A fluency test shows the fact alone, with no dots.

const fact = (text: string, answer: number, difficulty: TestQuestion["difficulty"], explain: string): TestQuestion[] => [
  { visual: null, difficulty, step: { kind: "number", prompt: text, hint: "Try to know it.", explain, answer } },
];

/** Addition fact within 5. */
export const additionFactQuestion = (): TestQuestion[] => {
  const a = randInt(0, 5);
  const b = randInt(0, 5 - a);
  return fact(`${a} + ${b} = ☐. What goes in the box?`, a + b, "easy", `${a} + ${b} = ${a + b}.`);
};

/** A second addition fact, always two different numbers. */
export const additionFactNonDoublesQuestion = (): TestQuestion[] => {
  const a = randInt(0, 4);
  let b = randInt(0, 5 - a);
  while (b === a) b = randInt(0, 5 - a);
  return fact(`${a} + ${b} = ☐. What goes in the box?`, a + b, "easy", `${a} + ${b} = ${a + b}.`);
};

/** Take-away fact within 5. */
export const subtractionFactQuestion = (): TestQuestion[] => {
  const start = randInt(1, 5);
  const b = randInt(0, start);
  return fact(`${start} − ${b} = ☐. What goes in the box?`, start - b, "easy", `${start} − ${b} = ${start - b}.`);
};

/** A second take-away fact (replaces the fact-family item). */
export const subtractionSecondFactQuestion = (): TestQuestion[] => {
  const start = randInt(2, 5);
  const b = randInt(1, start - 1);
  return fact(`${start} − ${b} = ☐. What goes in the box?`, start - b, "medium", `${start} − ${b} = ${start - b}.`);
};

/** Doubles: 1 + 1 or 2 + 2. */
export const doublesFactQuestion = (): TestQuestion[] => {
  const n = randInt(1, 2);
  return fact(`${n} + ${n} = ☐. What goes in the box?`, n + n, "easy", `${n} + ${n} = ${n + n}.`);
};

/** Are the two numbers the same? Yes or No, about half the time each. */
export const sameNumbersQuestion = (): TestQuestion[] => {
  const same = Math.random() < 0.5;
  const a = same ? randInt(1, 2) : randInt(0, 4);
  let b = same ? a : randInt(0, 5 - a);
  while (!same && b === a) b = randInt(0, 5 - a);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `${a} + ${b}. Are the two numbers the same?`, hint: "Look at both numbers.", explain: same ? `Yes. ${a} and ${b} are the same.` : `No. ${a} and ${b} are not the same.` },
        same ? "Yes" : "No",
        [same ? "No" : "Yes"] // misconception: not checking both numbers
      ),
    },
  ];
};

/** Missing number within 5. */
export const missingAddendQuestion = (): TestQuestion[] => {
  const sum = randInt(1, 5);
  const a = randInt(0, sum);
  return fact(`${a} + ☐ = ${sum}. What goes in the box?`, sum - a, "medium", `${a} + ${sum - a} = ${sum}.`);
};

/** Missing number that makes 5 (the Module Test's slot). */
export const missingToFiveQuestion = (): TestQuestion[] => {
  const a = randInt(1, 4);
  return fact(`${a} + ☐ = 5. What goes in the box?`, 5 - a, "hard", `${a} + ${5 - a} = 5.`);
};

/** Adding 0 changes nothing. */
export const zeroFactQuestion = (): TestQuestion[] => {
  const n = randInt(1, 5);
  return fact(`${n} + 0 = ☐. What goes in the box?`, n, "easy", `${n} + 0 = ${n}.`);
};

/** Take away all of them. No picture. */
export const subtractAllQuestion = (): TestQuestion[] => {
  const n = randInt(1, 5);
  return fact(`${n} − ${n} = ☐. What goes in the box?`, 0, "medium", `${n} − ${n} = 0.`);
};

export const fastFactsWithin5Test: Unit["test"] = {
  questions: noRepeats([
    additionFactQuestion,
    additionFactNonDoublesQuestion,
    subtractionFactQuestion,
    subtractionSecondFactQuestion,
    doublesFactQuestion,
    sameNumbersQuestion,
    missingAddendQuestion,
    missingToFiveQuestion,
    zeroFactQuestion,
    subtractAllQuestion,
  ]),
  passScore: 9,
};
