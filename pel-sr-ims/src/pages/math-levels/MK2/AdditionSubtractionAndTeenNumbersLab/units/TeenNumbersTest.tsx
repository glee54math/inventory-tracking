import { TenAndOnes } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Teen Numbers as Ten Plus More ----------
// 10 questions from 10 generators. Self-contained — no import from
// TeenNumbers.tsx, and that file never imports back from here.

const NUMBER_WORDS: Record<number, string> = {
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
  16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen",
};

/** Compose a teen number from a ten-group plus extra ones. */
export const composeTeenQuestion = (): TestQuestion[] => {
  const ones = randInt(1, 9);
  const teen = 10 + ones;
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `1 full group of ten and ${ones} more loose ones. What number is this?`, hint: "A full ten-group plus some extra ones.", explain: `10 + ${ones} = ${teen}.`, answer: teen },
    },
  ];
};

/** Decompose a given teen number into a ten-group and extra ones. */
export const decomposeTeenQuestion = (): TestQuestion[] => {
  const teen = randInt(11, 19);
  const ones = teen - 10;
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${teen} is made of 1 ten-group and how many more ones?`, hint: "Take away the ten-group — what's left over?", explain: `${teen} − 10 = ${ones}.`, answer: ones },
    },
  ];
};

/** Decompose, asked the other way: given the ones, find the ten-group's size. */
export const decomposeTeenTensQuestion = (): TestQuestion[] => {
  const teen = randInt(11, 19);
  const ones = teen - 10;
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${teen} has ${ones} extra ones. How many objects are in the ten-group part?`, hint: "The ten-group is always exactly ten objects.", explain: `The ten-group always has exactly 10 objects, regardless of the teen number.`, answer: 10 },
    },
  ];
};

/** Vocabulary / conflation: how many tens are in a teen number's name? */
export const howManyTensQuestion = (): TestQuestion[] => {
  const teen = randInt(11, 19);
  const ones = teen - 10;
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "medium",
      step: choice(
        { prompt: `When you say "${NUMBER_WORDS[teen]}," how many TENS are in that number?`, hint: "Every teen number has exactly one ten-group.", explain: `"${NUMBER_WORDS[teen]}" has exactly 1 ten.` },
        "1",
        ["0", String(teen)] // misconceptions: recognizing no ten-group at all; treating the whole numeral as an undifferentiated count
      ),
    },
  ];
};

/** Vocabulary / conflation: digit-meaning question, both digits in one question. */
export const digitMeaningQuestion = (): TestQuestion[] => {
  const teen = randInt(11, 19);
  const ones = teen - 10;
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "hard",
      step: choice(
        { prompt: `In the number ${teen}, what does the FIRST digit (the "1") stand for?`, hint: "It's never a single object by itself.", explain: `The "1" in ${teen} always stands for one whole group of ten, not one single object.` },
        "A whole group of ten",
        ["One single object"] // misconception: treating the tens digit of a teen numeral as just another ones-digit
      ),
    },
  ];
};

/** Generalization: does the ten-plus-more structure hold for every teen number? */
export const everyTeenTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: every number from 11 to 19 is made of exactly one group of ten, plus some extra ones.",
          hint: "Check a few: 11, 15, 19...",
          explain: "True — 11 is ten + 1 all the way through 19, which is ten + 9. Every one of them follows the same pattern.",
        },
        "True",
        ["False"] // misconception: doubting the pattern holds for every teen number
      ),
    },
  ];
};

/** Equation record — the direct digit-swap trap (e.g. writing 31 instead of 13). */
export const digitSwapTrapQuestion = (): TestQuestion[] => {
  const teen = randInt(12, 19); // excludes 11, where the digit-swap distractor collapses to 11 itself
  const ones = teen - 10;
  const swapped = Number(`${ones}${1}`);
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "hard",
      step: choice(
        { prompt: "10 objects are bundled into a ten-group, and " + ones + " more ones are added. Which equation is written correctly?", hint: "Watch out for the digits written backwards.", explain: `10 + ${ones} = ${teen}, NOT ${swapped} — writing the digits backwards is a common teen-number mix-up.` },
        `10 + ${ones} = ${teen}`,
        [`10 + ${ones} = ${swapped}`] // misconception: digit-reversal when writing the teen numeral
      ),
    },
  ];
};

/** Equation record — "forgot the ten" distractor. */
export const forgotTheTenTrapQuestion = (): TestQuestion[] => {
  const teen = randInt(11, 19);
  const ones = teen - 10;
  return [
    {
      visual: <TenAndOnes tens={1} ones={ones} />,
      difficulty: "medium",
      step: choice(
        { prompt: "1 ten-group and " + ones + " more ones. Which equation correctly records this?", hint: "Don't forget to include the ten-group in the equation.", explain: `10 + ${ones} = ${teen} — leaving the 10 out entirely would be forgetting the whole ten-group.` },
        `10 + ${ones} = ${teen}`,
        [`${ones} = ${teen}`] // misconception: dropping the ten-group from the equation entirely
      ),
    },
  ];
};

/** Reading a teen number word and recovering its ones count — ties naming to structure. */
export const wordToOnesQuestion = (): TestQuestion[] => {
  const teen = randInt(11, 19);
  const ones = teen - 10;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `"${NUMBER_WORDS[teen]}" is 1 ten plus how many ones?`, hint: "Subtract the ten-group from the whole number.", explain: `${teen} − 10 = ${ones}.`, answer: ones },
    },
  ];
};

/** The boundary case: 10 itself has zero extra ones (sets up what "extra" means). */
export const tenHasZeroOnesQuestion = (): TestQuestion[] => {
  return [
    {
      visual: <TenAndOnes tens={1} ones={0} />,
      difficulty: "easy",
      step: { kind: "number", prompt: "10 is 1 ten-group plus how many extra ones?", hint: "A ten-group by itself, with nothing extra.", explain: "10 = 10 + 0 — no extra ones at all.", answer: 0 },
    },
  ];
};

export const teenNumbersTest: Unit["test"] = {
  questions: [
    composeTeenQuestion,
    decomposeTeenQuestion,
    decomposeTeenTensQuestion,
    howManyTensQuestion,
    digitMeaningQuestion,
    everyTeenTrueFalseQuestion,
    digitSwapTrapQuestion,
    forgotTheTenTrapQuestion,
    wordToOnesQuestion,
    tenHasZeroOnesQuestion,
  ],
  passScore: 9,
};
