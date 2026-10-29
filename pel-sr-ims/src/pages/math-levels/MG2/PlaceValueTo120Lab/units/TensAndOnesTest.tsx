import { BaseTenBlocks } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, numberBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Tens and Ones ----------
// 10 questions from 10 generators. Self-contained — same no-circular-import
// convention as every other *Test.tsx in this app.

/** Standard case: a regular two-digit number, both blanks in one sentence step. */
export const standardSentenceQuestion = (): TestQuestion[] => {
  const tens = randInt(2, 9);
  let ones: number;
  do {
    ones = randInt(0, 9);
  } while (ones === 0 || ones === tens);
  const n = tens * 10 + ones;
  return [
    {
      visual: <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" />,
      difficulty: "easy",
      step: sentence(
        { prompt: `${n} = ___ tens + ___ ones.`, hint: "The first digit is tens, the second digit is ones.", explain: `${n} is ${tens} tens and ${ones} ones.` },
        "",
        numberBlank(tens),
        " tens + ",
        numberBlank(ones),
        " ones."
      ),
    },
  ];
};

/** Teen number: the commonly-conflated case — the English name doesn't
 *  obviously say "ten," but the decomposition rule still applies. */
export const teenSentenceQuestion = (): TestQuestion[] => {
  const ones = randInt(1, 9);
  const n = 10 + ones;
  return [
    {
      visual: <BaseTenBlocks tens={1} ones={ones} tenTone="a" oneTone="b" />,
      difficulty: "medium",
      step: sentence(
        { prompt: `${n} = ___ ten + ___ ones.`, hint: "Every teen number has exactly 1 bundled ten hiding inside it, even though its name doesn't say \"ten.\"", explain: `${n} is 1 ten and ${ones} ones.` },
        "",
        numberBlank(1),
        " ten + ",
        numberBlank(ones),
        " ones."
      ),
    },
  ];
};

/** Special case: exactly 10 — "0 ones" must be an available, correct answer. */
export const exactlyTenQuestion = (): TestQuestion[] => {
  return [
    {
      visual: <BaseTenBlocks tens={1} ones={0} tenTone="a" oneTone="b" />,
      difficulty: "easy",
      step: sentence(
        { prompt: "10 = ___ ten + ___ ones.", hint: "Count the loose ones-cubes — there aren't any.", explain: "10 is 1 ten and 0 ones — every single one is already bundled." },
        "",
        numberBlank(1),
        " ten + ",
        numberBlank(0),
        " ones."
      ),
    },
  ];
};

/** Special case: an exact decade — again, 0 ones is the real, correct answer. */
export const exactDecadeQuestion = (): TestQuestion[] => {
  const tens = randInt(2, 9);
  const n = tens * 10;
  return [
    {
      visual: <BaseTenBlocks tens={tens} ones={0} tenTone="a" oneTone="b" />,
      difficulty: "medium",
      step: sentence(
        { prompt: `${n} = ___ tens + ___ ones.`, hint: "There are no loose ones-cubes shown — that's 0 ones, not \"no answer.\"", explain: `${n} is ${tens} tens and 0 ones.` },
        "",
        numberBlank(tens),
        " tens + ",
        numberBlank(0),
        " ones."
      ),
    },
  ];
};

/** Reverse direction: given tens/ones counts, name the number. */
export const reverseBuildQuestion = (): TestQuestion[] => {
  const tens = randInt(2, 9);
  const ones = randInt(1, 9);
  const n = tens * 10 + ones;
  return [
    {
      visual: <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${tens} tens and ${ones} ones is what number?`, hint: "Tens digit first, then ones digit.", explain: `${tens} tens and ${ones} ones is ${n}.`, answer: n },
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
      step: { kind: "number", prompt: `1 ten and ${ones} ones is what number?`, hint: "1 ten and some more ones is a teen number.", explain: `1 ten and ${ones} ones is ${n}.`, answer: n },
    },
  ];
};

/** Reverse direction, as a choice — distractor is the digits swapped (tens
 *  and ones reversed), the specific near-miss this unit's digit-order
 *  misconception targets. */
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
      visual: <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" />,
      difficulty: "hard",
      step: choice(
        { prompt: `${tens} tens and ${ones} ones is which number?`, hint: "Tens go in the FIRST (left) spot, ones go in the SECOND (right) spot.", explain: `${tens} tens and ${ones} ones is ${n}, not ${swapped}.` },
        String(n),
        [String(swapped)] // misconception: writing the digits in the wrong order
      ),
    },
  ];
};

/** Generalization / true-false: is 0 ones real information, not "nothing to report"? */
export const zeroOnesTrueFalseQuestion = (): TestQuestion[] => {
  const tens = randInt(2, 9);
  const n = tens * 10;
  return [
    {
      visual: <BaseTenBlocks tens={tens} ones={0} tenTone="a" oneTone="b" />,
      difficulty: "hard",
      step: choice(
        { prompt: `True or false: ${n}'s ones digit (0) is real information — it means there are exactly 0 loose ones, not that ${n} has no ones amount at all.`, hint: "Check the blocks: every single one is bundled, which is a fact worth reporting, not a blank.", explain: `True — ${n} is ${tens} tens and 0 ones; the 0 is telling you something, not skipping a question.` },
        "True",
        ["False"]
      ),
    },
  ];
};

/** Choice question with the digit-swap distractor framed the other way:
 *  given the number, pick its correct decomposition. */
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
        { prompt: `Which is correct for ${n}?`, hint: "The FIRST digit is tens, the SECOND digit is ones.", explain: `${n} is ${tens} tens and ${ones} ones.` },
        `${tens} tens and ${ones} ones`,
        [`${ones} tens and ${tens} ones`] // misconception: swapping which digit is tens vs ones
      ),
    },
  ];
};

/** Generalization / true-false: does the "1 ten and some ones" rule apply to
 *  EVERY teen number, not just a couple of examples? */
export const teenGeneralizationQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: every single teen number (11 through 19) is 1 ten and some ones, even the ones whose names don't sound like it, like \"eleven\" or \"twelve.\"", hint: "Build 11 and 12 out of blocks — do they really look any different from 14 or 17?", explain: "True — every teen number is built from exactly 1 bundled ten plus some loose ones, no matter what its name sounds like." },
        "True",
        ["False"]
      ),
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
    zeroOnesTrueFalseQuestion,
    standardChoiceQuestion,
    teenGeneralizationQuestion,
  ],
  passScore: 9,
};
