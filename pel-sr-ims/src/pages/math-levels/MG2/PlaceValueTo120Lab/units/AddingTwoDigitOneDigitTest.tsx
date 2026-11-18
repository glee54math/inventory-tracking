import { BaseTenBlocks } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, numberBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { onesW } from "./words";

// ---------- end-of-unit test: Adding Ones to a Number ----------
// 10 questions from 10 generators. Self-contained (no import from
// AddingTwoDigitOneDigit.tsx, and that file never imports back from here) —
// same convention as every other *Test.tsx in this app, since the unit file
// already imports this file's `addingTwoDigitOneDigitTest` export, and an
// import the other way would be a circular import that throws at
// module-eval time (silently surfacing as "Level not found" — see MM1
// Ratio Lab's ConversionsTest.tsx bug writeup in VISUAL_COMPONENT_TODO.txt).
// regroupBreakdown is therefore duplicated here verbatim, not imported.
// Pictures show only the starting sticks and cubes, never the ones already
// added (review C1-26).

export interface RegroupBreakdown {
  tens: number;
  ones: number;
  sumOnes: number;
  regrouped: boolean;
  newTens: number;
  newOnes: number;
  total: number;
}

function regroupBreakdown(twoDigit: number, add: number): RegroupBreakdown {
  const tens = Math.floor(twoDigit / 10);
  const ones = twoDigit % 10;
  const sumOnes = ones + add;
  const regrouped = sumOnes > 9;
  const newOnes = sumOnes % 10;
  const newTens = tens + Math.floor(sumOnes / 10);
  return { tens, ones, sumOnes, regrouped, newTens, newOnes, total: twoDigit + add };
}

const noRegroupPair = (): { tens: number; ones: number; add: number; b: RegroupBreakdown } => {
  let tens: number, ones: number, add: number, b: RegroupBreakdown;
  do {
    tens = randInt(1, 8);
    ones = randInt(0, 8);
    add = randInt(1, 9);
    b = regroupBreakdown(tens * 10 + ones, add);
  } while (b.regrouped);
  return { tens, ones, add, b };
};

const regroupPair = (): { tens: number; ones: number; add: number; b: RegroupBreakdown } => {
  let tens: number, ones: number, add: number, b: RegroupBreakdown;
  do {
    tens = randInt(1, 8);
    ones = randInt(1, 9);
    add = randInt(1, 9);
    b = regroupBreakdown(tens * 10 + ones, add);
  } while (!b.regrouped);
  return { tens, ones, add, b };
};

/** No regrouping, lower range. */
export const noRegroupEasyQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = noRegroupPair();
  const n = tens * 10 + ones;
  return [
    {
      visual: <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "Add the ones first.", explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
    },
  ];
};

/** No regrouping, a second independent instance. */
export const noRegroupSecondQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = noRegroupPair();
  const n = tens * 10 + ones;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "Add the ones first.", explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
    },
  ];
};

/** Standard regrouping case, typed. */
export const regroupStandardQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = regroupPair();
  const n = tens * 10 + ones;
  return [
    {
      visual: <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "10 or more ones? Make a new ten.", explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
    },
  ];
};

/** Make-a-new-ten edge case: the ones make exactly 10 — the answer ends in 0
 *  (newOnes = 0), easy to doubt since there's "nothing left over." */
export const regroupRoundTenQuestion = (): TestQuestion[] => {
  const tens = randInt(1, 8);
  const ones = randInt(1, 9);
  const add = 10 - ones;
  const n = tens * 10 + ones;
  const b = regroupBreakdown(n, add);
  return [
    {
      visual: <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "10 ones make a new ten.", explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
    },
  ];
};

/** Choice question with the EXACT named misconception as the distractor:
 *  forgetting to add the new ten. */
export const forgotCarryChoiceQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = regroupPair();
  const n = tens * 10 + ones;
  const forgotCarry = tens * 10 + b.newOnes; // wrote the leftover ones but never added the new ten
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `What is ${n} + ${add}?`, hint: "Make a new ten. Add it to the tens.", explain: `${n} + ${add} = ${b.total}. Add the new ten to the tens.` },
        String(b.total),
        [
          String(forgotCarry), // misconception: forgetting to add the new ten to the tens
          String(b.total - 1), // misconception: counting on, starting the count on n itself (one short); review C2-39
        ]
      ),
    },
  ];
};

/** A make-a-new-ten sum, typed, with no picture (replaces the old
 *  true/false "regrouping rule" item, review C1-08 / E1-03). */
export const newTenTypedQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = regroupPair();
  const n = tens * 10 + ones;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "10 or more ones? Make a new ten.", explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
    },
  ];
};

/** "There are 9 ones" / "There is 1 one". */
const thereAre = (k: number) => `There ${k === 1 ? "is" : "are"} ${onesW(k)}`;

/** WHY reasoning check, separate from the computed answer. */
export const regroupWhyQuestion = (): TestQuestion[] => {
  // Review E3-50: "There are 15 ones", not "The ones make 15" ("make" is kept
  // for "make a new ten"). Redrawn when the ones add to exactly 10 (no
  // "There are 0 ones") or when add equals the cubes drawn (then "There are 6
  // ones" would be true of the picture).
  let p = regroupPair();
  while (p.b.sumOnes === 10 || p.add === p.ones) p = regroupPair();
  const { tens, ones, add, b } = p;
  const n = tens * 10 + ones;
  return [
    {
      visual: <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" />,
      difficulty: "medium",
      // Choices about the same length, so the longest isn't the giveaway (review
      // E1-34). Every choice has a number, and every wrong one is false (review
      // C2-40 / C2-30: no "3 digits" choice).
      step: choice(
        { prompt: `${n} + ${add}. Why do you make a new ten?`, hint: "Add the ones first.", explain: `There are ${b.sumOnes} ones. 10 of them make a new ten.` },
        `There are ${b.sumOnes} ones`,
        [
          thereAre(add), // misconception: counting only the added ones
          thereAre(b.sumOnes - 10), // misconception: reading the ones of the answer
        ]
      ),
    },
  ];
};

/** Two parts, two short questions with a box each (review E1-34): how many
 *  ones, then the answer. The first box is built from the numbers, "8 + 5 =
 *  ☐ ones.", so 3 (the ones in 43) can't also be read as right (review C2-31). */
export const regroupSentenceProductionQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = regroupPair();
  const n = tens * 10 + ones;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: sentence(
        { prompt: `${n} + ${add}`, hint: "Add the ones first. Then make a new ten.", explain: `${ones} + ${add} = ${b.sumOnes} ones. ${n} + ${add} = ${b.total}.` },
        `${ones} + ${add} = `,
        numberBlank(b.sumOnes),
        ` ones.  What is ${n} + ${add}? `,
        numberBlank(b.total),
        ""
      ),
    },
  ];
};

/** No regrouping, but as a choice — distractor adds the one-digit number to
 *  the TENS place by mistake instead of the ones place. Review C2-39: drawn so
 *  that distractor stays under 100 (tens + add ≤ 9), plus a one-off third. */
export const noRegroupChoiceQuestion = (): TestQuestion[] => {
  let p = noRegroupPair();
  while (p.tens + p.add > 9) p = noRegroupPair();
  const { tens, ones, add, b } = p;
  const n = tens * 10 + ones;
  const wrongPlaceDistractor = (tens + add) * 10 + ones; // misconception: added to the tens instead of the ones
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `What is ${n} + ${add}?`, hint: "Add the ones to the ones.", explain: `${n} + ${add} = ${b.total}.` },
        String(b.total),
        [
          String(wrongPlaceDistractor),
          String(b.total - 1), // misconception: counting on, starting the count on n itself (one short)
        ]
      ),
    },
  ];
};

/** A second independent regrouping instance, typed. */
export const regroupSecondQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = regroupPair();
  const n = tens * 10 + ones;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "10 or more ones? Make a new ten.", explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
    },
  ];
};

export const addingTwoDigitOneDigitTest: Unit["test"] = {
  questions: [
    noRegroupEasyQuestion,
    noRegroupSecondQuestion,
    regroupStandardQuestion,
    regroupRoundTenQuestion,
    forgotCarryChoiceQuestion,
    newTenTypedQuestion,
    regroupWhyQuestion,
    regroupSentenceProductionQuestion,
    noRegroupChoiceQuestion,
    regroupSecondQuestion,
  ],
  passScore: 9,
};
