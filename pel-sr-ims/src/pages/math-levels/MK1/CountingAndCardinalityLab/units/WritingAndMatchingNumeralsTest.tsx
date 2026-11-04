import { BigDigit, CounterGroup } from "../diagrams";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { choice, pictureChoice, type TestQuestion } from "../../../shared/engine/types";
import { thereAre } from "./words";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Writing and Matching Numerals ----------
// 10 questions from 10 generators. Self-contained — local copy of the
// number-word table instead of importing it from WritingAndMatchingNumerals.tsx,
// since that file already imports this file's test export (see
// MATH_TSX_STYLE_GUIDE.txt / this lab's own CountingOnAndForwardTest.tsx for
// why a reverse import would be a circular-import crash).
const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];

/** Numeral production from the number word, small range. */
export const writeFromWordSmallQuestion = (): TestQuestion[] => {
  const n = randInt(0, 10);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `Write the numeral for the number word "${NUMBER_WORDS[n]}".`, hint: "Think of the symbol, not the word.", explain: `"${NUMBER_WORDS[n]}" is written as the numeral ${n}.`, answer: n },
    },
  ];
};

/** Numeral production from the number word, teen range (the harder word forms). */
export const writeFromWordTeenQuestion = (): TestQuestion[] => {
  const n = randInt(11, 19);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `Write the numeral for the number word "${NUMBER_WORDS[n]}".`, hint: "Teen numbers are written as two digits.", explain: `"${NUMBER_WORDS[n]}" is written as the numeral ${n}.`, answer: n },
    },
  ];
};

/** Numeral production matching a shown picture-count, small range. */
export const writeFromPictureSmallQuestion = (): TestQuestion[] => {
  const n = randInt(2, 10);
  return [
    {
      visual: <CounterGroup count={n} arrangement="line" tone="a" seed={n * 3 + 1} />,
      difficulty: "easy",
      step: { kind: "number", prompt: "How many counters are there? Write the numeral.", hint: "Count each one exactly once.", explain: `There are ${n} counters — the numeral is ${n}.`, answer: n },
    },
  ];
};

/** Numeral production matching a shown picture-count, 11-20. Lined up in rows
 *  of 10, not scattered: K.CC.5 only asks for scattered groups up to 10. */
export const writeFromPictureLargeQuestion = (): TestQuestion[] => {
  const n = randInt(11, 20);
  return [
    {
      visual: <CounterGroup count={n} arrangement={pick(["line", "array"] as const)} tone="b" seed={n * 11 + 2} />,
      difficulty: "medium",
      step: { kind: "number", prompt: "How many counters are there? Write the numeral.", hint: "Count carefully. Count each one once.", explain: `There are ${n} counters. The numeral is ${n}.`, answer: n },
    },
  ];
};

const LOOKALIKE_SETS: [string, string][] = [["6", "9"], ["1", "7"], ["2", "5"]];

/** Select the numeral matching a count, among a visually similar distractor.
 *  `sets` lets the test's two look-alike questions draw from different pairs,
 *  so they can never come out the same. */
const lookalikeQuestion = (sets: [string, string][], seedSalt: number): TestQuestion[] => {
  const [a, b] = pick(sets);
  const showA = Math.random() < 0.5;
  const target = showA ? a : b;
  const other = showA ? b : a;
  const n = Number(target);
  return [
    {
      visual: <CounterGroup count={n} arrangement="scatter" tone="c" seed={n * 19 + seedSalt} />,
      difficulty: "medium",
      step: withBigDigits(
        choice(
          { prompt: "Which numeral tells how many counters there are?", hint: "Count carefully, then match.", explain: `${thereAre(n)} We write ${target}, not ${other}.` },
          target,
          [other] // misconception: confusing visually similar numerals instead of counting
        )
      ),
    },
  ];
};

/** Show a choice's numerals as big digits in the buttons. */
const withBigDigits = <T extends { choices: string[]; display?: unknown }>(step: T): T => ({ ...step, display: step.choices.map((c) => <BigDigit key={c} d={c} size={48} />) });

/** First look-alike question: the classic 6/9 flip. */
export const recognizeLookalikeQuestion = (): TestQuestion[] => lookalikeQuestion([LOOKALIKE_SETS[0]], 4);

/** Second look-alike question: 1/7 or 2/5, never the first question's pair. */
export const recognizeLookalikeQuestion2 = (): TestQuestion[] => lookalikeQuestion(LOOKALIKE_SETS.slice(1), 11);

// Digits that change shape when mirrored, split in two so the test's two
// "written the right way" questions never show the same digit.
const MIRROR_DIGITS_A = ["2", "3", "4", "5"];
const MIRROR_DIGITS_B = ["6", "7", "9"];

/** Pick the correctly-oriented (non-mirrored) numeral. The two numerals are
 *  the buttons, so no "left/right" words are needed. */
const reversedQuestion = (digits: string[]): TestQuestion[] => {
  const digit = pick(digits);
  // misconception: not recognizing the backwards (mirrored) form
  const opts = shuffle([
    { right: true, pic: <BigDigit d={digit} size={56} /> },
    { right: false, pic: <BigDigit d={digit} size={56} mirrored /> },
  ]);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: pictureChoice(
        { prompt: `Tap the ${digit} that is written the right way.`, hint: "One of them is backwards.", explain: `The other one is a backwards ${digit}.` },
        [
          ["the first one", opts[0].pic],
          ["the second one", opts[1].pic],
        ],
        opts.findIndex((o) => o.right)
      ),
    },
  ];
};

/** Generalization / false trap, same idea as the unit's own CFU — not every
 *  look-alike pair is actually a flip of the other. */
export const flipGeneralizationQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: every pair of numerals people mix up (like 6 and 9, or 2 and 5) turns into the other one when you turn it upside down.",
          hint: "Turn a 6 upside down. Now turn a 2 upside down. Does it look like 5?",
          explain: "False. Turn 6 upside down and it looks like 9. But turn 2 upside down and it does not look like 5. 1 and 7 don't turn into each other either.",
        },
        "False",
        ["True"] // misconception: assuming every look-alike pair is a rotational flip
      ),
    },
  ];
};

/** Reverse-direction reasoning layered on top of numeral production. */
export const oneMoreNumeralQuestion = (): TestQuestion[] => {
  const n = randInt(0, 19);
  const next = n + 1;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What numeral is one MORE than the number word "${NUMBER_WORDS[n]}"?`, hint: "First think of the numeral for the word, then count one more.", explain: `"${NUMBER_WORDS[n]}" is ${n}, and one more than ${n} is ${next}.`, answer: next },
    },
  ];
};

export const reversedPairQuestion = (): TestQuestion[] => reversedQuestion(MIRROR_DIGITS_A);
export const reversedPairQuestion2 = (): TestQuestion[] => reversedQuestion(MIRROR_DIGITS_B);

/** Full-pool versions for tests that ask each of these only once (ModuleTest). */
export const anyLookalikeQuestion = (): TestQuestion[] => lookalikeQuestion(LOOKALIKE_SETS, 4);
export const anyReversedPairQuestion = (): TestQuestion[] => reversedQuestion([...MIRROR_DIGITS_A, ...MIRROR_DIGITS_B]);

export const writingAndMatchingNumeralsTest: Unit["test"] = {
  questions: [
    writeFromWordSmallQuestion,
    writeFromWordTeenQuestion,
    writeFromPictureSmallQuestion,
    writeFromPictureLargeQuestion,
    recognizeLookalikeQuestion,
    recognizeLookalikeQuestion2,
    reversedPairQuestion,
    flipGeneralizationQuestion,
    oneMoreNumeralQuestion,
    reversedPairQuestion2,
  ],
  passScore: 9,
};
