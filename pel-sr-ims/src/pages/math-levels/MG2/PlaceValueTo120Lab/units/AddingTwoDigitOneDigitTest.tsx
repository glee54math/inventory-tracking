import { BaseTenBlocks } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, numberBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Adding a 2-Digit and a 1-Digit Number ----------
// 10 questions from 10 generators. Self-contained (no import from
// AddingTwoDigitOneDigit.tsx, and that file never imports back from here) —
// same convention as every other *Test.tsx in this app, since the unit file
// already imports this file's `addingTwoDigitOneDigitTest` export, and an
// import the other way would be a circular import that throws at
// module-eval time (silently surfacing as "Level not found" — see MM1
// Ratio Lab's ConversionsTest.tsx bug writeup in VISUAL_COMPONENT_TODO.txt).
// regroupBreakdown is therefore duplicated here verbatim, not imported.

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
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "Add the ones first; they fit under 10, so nothing else changes.", explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
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
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: "Add the ones digits.", explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
    },
  ];
};

/** Standard regrouping case, typed. */
export const regroupStandardQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = regroupPair();
  const n = tens * 10 + ones;
  return [
    {
      visual: <BaseTenBlocks tens={tens} ones={b.sumOnes} tenTone="a" oneTone="b" flagOverflow />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: `${ones} + ${add} = ${b.sumOnes} ones — bundle 10 into a new ten.`, explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
    },
  ];
};

/** Regrouping edge case: the ones sum lands exactly on 10 — a round decade
 *  result (newOnes = 0), easy to doubt since there's "nothing left over." */
export const regroupRoundTenQuestion = (): TestQuestion[] => {
  const tens = randInt(1, 8);
  const ones = randInt(1, 9);
  const add = 10 - ones;
  const n = tens * 10 + ones;
  const b = regroupBreakdown(n, add);
  return [
    {
      visual: <BaseTenBlocks tens={tens} ones={10} tenTone="a" oneTone="b" flagOverflow />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: `${ones} + ${add} = 10 ones exactly — that's 1 whole new ten and 0 leftover ones.`, explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
    },
  ];
};

/** Choice question with the EXACT named misconception as the distractor:
 *  forgetting to carry the new ten. */
export const forgotCarryChoiceQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = regroupPair();
  const n = tens * 10 + ones;
  const forgotCarry = tens * 10 + b.newOnes; // wrote the leftover ones but never added the new ten
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `What is ${n} + ${add}?`, hint: `${ones} + ${add} = ${b.sumOnes} ones. Don't forget: that extra ten needs to be ADDED to the tens digit.`, explain: `${n} + ${add} = ${b.total}, not ${forgotCarry} — the new ten from bundling has to be added onto the tens digit.` },
        String(b.total),
        [String(forgotCarry)] // misconception: forgetting to carry the new ten into the tens digit
      ),
    },
  ];
};

/** Generalization / true-false: the regrouping rule itself. */
export const regroupRuleTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: whenever the ones digits add up to more than 9, exactly 10 of them bundle into a new ten, which gets added onto the tens digit.", hint: "This is true no matter which two numbers you're adding.", explain: "True — this rule never changes, no matter the specific numbers." },
        "True",
        ["False"]
      ),
    },
  ];
};

/** WHY reasoning check, separate from the computed answer. */
export const regroupWhyQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = regroupPair();
  const n = tens * 10 + ones;
  return [
    {
      visual: <BaseTenBlocks tens={tens} ones={b.sumOnes} tenTone="a" oneTone="b" flagOverflow />,
      difficulty: "medium",
      step: choice(
        { prompt: `For ${n} + ${add}, why do you need to bundle a new ten?`, hint: `${ones} + ${add} = ${b.sumOnes}.`, explain: `${b.sumOnes} ones is more than a single digit can hold, so exactly 10 of them become 1 new ten.` },
        `Because the ones (${ones} + ${add} = ${b.sumOnes}) add up to more than 9`,
        ["Because the tens digit is too small", "Because the final answer has three digits"]
      ),
    },
  ];
};

/** Multi-part production: the full regrouping breakdown, one piece at a time. */
export const regroupSentenceProductionQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = regroupPair();
  const n = tens * 10 + ones;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: sentence(
        { prompt: `For ${n} + ${add}: the ones add up to ___, and the final answer is ___.`, hint: `${ones} + ${add} = ${b.sumOnes}, which bundles into ${b.newTens} tens and ${b.newOnes} ones.`, explain: `${ones} + ${add} = ${b.sumOnes} ones; after bundling, ${n} + ${add} = ${b.total}.` },
        "",
        numberBlank(b.sumOnes),
        ", and the final answer is ",
        numberBlank(b.total),
        "."
      ),
    },
  ];
};

/** No regrouping, but as a choice — distractor adds the one-digit number to
 *  the TENS place by mistake instead of the ones place. */
export const noRegroupChoiceQuestion = (): TestQuestion[] => {
  const { tens, ones, add, b } = noRegroupPair();
  const n = tens * 10 + ones;
  const wrongPlaceDistractor = (tens + add) * 10 + ones; // misconception: added to the tens digit instead of the ones digit
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `What is ${n} + ${add}?`, hint: "The one-digit number always adds onto the ONES place, never the tens place.", explain: `${n} + ${add} = ${b.total}. Adding ${add} to the tens digit instead would be a mistake.` },
        String(b.total),
        [String(wrongPlaceDistractor)]
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
      step: { kind: "number", prompt: `What is ${n} + ${add}?`, hint: `${ones} + ${add} = ${b.sumOnes} ones — bundle a new ten.`, explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
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
    regroupRuleTrueFalseQuestion,
    regroupWhyQuestion,
    regroupSentenceProductionQuestion,
    noRegroupChoiceQuestion,
    regroupSecondQuestion,
  ],
  passScore: 9,
};
