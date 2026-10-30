import { PlaceValueColumns } from "../diagrams";
import { buildAddColumns, regroupCount, type ColumnBreakdown } from "../logic";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Adding Up to Four Two-Digit Numbers ----------
// 10 questions from 10 generators. Self-contained (no import from
// AddingFourTwoDigitNumbers.tsx, and that file never imports back from here).

export const twoAddendsNoRegroupNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(10, 89);
    b = randInt(10, 89);
    breakdown = buildAddColumns([a, b], 3);
  } while (breakdown.carry[0] !== 0 || breakdown.carry[1] !== 0);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "No carrying needed here.", explain: `${a} + ${b} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

export const twoAddendsOneRegroupNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(10, 99);
    b = randInt(10, 99);
    breakdown = buildAddColumns([a, b], 3);
  } while (regroupCount(breakdown) !== 1);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "One column needs to carry.", explain: `${a} + ${b} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

/** Misconception distractor: assuming the carry can never be more than 1,
 *  even with 3+ addends. Digits are drawn from 7-9 so their sum is always
 *  20-27 — the carry is always exactly 2, so the "carry 1" distractor is
 *  always genuinely wrong (never accidentally equal to the correct choice,
 *  which a smaller digit range could let happen whenever the true carry
 *  landed on 1 — the `choice()` helper would silently drop that duplicate,
 *  leaving only 2 choices instead of 3). */
export const carryDigitChoiceQuestion = (): TestQuestion[] => {
  const digits = [randInt(7, 9), randInt(7, 9), randInt(7, 9)];
  const sum = digits.reduce((a, b) => a + b, 0); // 21-27
  const correctDigit = sum % 10;
  const correctCarry = Math.floor(sum / 10);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `The ones column of ${digits.join(" + ")} adds up to ${sum}. What do you write, and what do you carry?`, hint: "The digit you write is the ones digit; everything else carries.", explain: `${sum}: write ${correctDigit}, carry ${correctCarry}.` },
        `Write ${correctDigit}, carry ${correctCarry}`,
        [`Write ${correctDigit}, carry 1`, `Write ${sum}, carry 0`] // misconception: assuming the carry is always 1, or never splitting the sum at all
      ),
    },
  ];
};

export const threeAddendsSingleCarryNumberQuestion = (): TestQuestion[] => {
  let addends: number[] = [];
  let breakdown: ColumnBreakdown;
  do {
    addends = Array.from({ length: 3 }, () => randInt(10, 89));
    breakdown = buildAddColumns(addends, 3);
  } while (breakdown.carry[0] > 1);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${addends.join(" + ")}?`, hint: "Add the ones column first, then the tens.", explain: `${addends.join(" + ")} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

export const fourAddendsDoubleCarryNumberQuestion = (): TestQuestion[] => {
  let addends: number[] = [];
  let breakdown: ColumnBreakdown;
  do {
    addends = Array.from({ length: 4 }, () => randInt(10, 99));
    breakdown = buildAddColumns(addends, 3);
  } while (breakdown.carry[0] < 2);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${addends.join(" + ")}?`, hint: "The ones column adds up to 20 or more here — carry every ten it's worth.", explain: `${addends.join(" + ")} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

/** True/false trap, restated with fresh wording from the CFU. */
export const carryMoreThanOneTrueFalseChoiceQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: no matter how many two-digit numbers you add, a column's carry is always exactly 1.",
          hint: "Try adding four 9's in the ones column: 9+9+9+9 = 36.",
          explain: "False — with three or four addends, a column's sum can be 20-39 or more, which carries 2 or even 3, not just 1.",
        },
        "False",
        ["True"] // misconception: generalizing the two-addend "carry is at most 1" rule to any number of addends
      ),
    },
  ];
};

/** Distinguishing the digit written below the line from the carried digit.
 *  Rerolls if the written digit and the carried digit happen to be the same
 *  number (e.g. sum=22 -> digit 2, carry 2) — `choice()` would otherwise
 *  silently drop that duplicate distractor, leaving only 2 choices. */
export const whichDigitBelowLineChoiceQuestion = (): TestQuestion[] => {
  let digits: number[] = [];
  let sum = 0;
  do {
    digits = [randInt(6, 9), randInt(6, 9), randInt(6, 9)];
    sum = digits.reduce((a, b) => a + b, 0); // 18-27
  } while (sum % 10 === Math.floor(sum / 10) || sum % 10 === sum);
  const correctDigit = sum % 10;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `A column's digits add up to ${sum}. Which single digit goes below the line in THAT column?`, hint: "Only the ones digit of the sum stays in this column.", explain: `${sum} splits into ${correctDigit} (stays here) and ${Math.floor(sum / 10)} (carries to the next column).` },
        String(correctDigit),
        [String(sum), String(Math.floor(sum / 10))] // misconceptions: writing the whole sum, or writing the carry instead of the digit
      ),
    },
  ];
};

export const threeOrFourAddendsCarryRatioQuestion = (): TestQuestion[] => {
  const n = randInt(0, 1) === 0 ? 3 : 4;
  let addends: number[] = [];
  let breakdown: ColumnBreakdown;
  do {
    addends = Array.from({ length: n }, () => randInt(10, 99));
    breakdown = buildAddColumns(addends, 3);
  } while (breakdown.carry[0] < 2);
  const onesSum = breakdown.digitsByOperand.reduce((s, d) => s + d[0], 0);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={1} />,
      difficulty: "hard",
      step: {
        kind: "ratio",
        prompt: `The ones column of ${addends.join(" + ")} adds up to ${onesSum}. What digit do you write, and what do you carry to the tens column?`,
        hint: "The carry can be more than 1 with this many addends.",
        explain: `Write ${breakdown.resultDigits[0]}, carry ${breakdown.carry[0]}.`,
        answer: [breakdown.resultDigits[0], breakdown.carry[0]],
        labels: ["ones digit", "carry to tens"],
        tones: "none",
      },
    },
  ];
};

export const fourAddendsTotalNumberQuestion = (): TestQuestion[] => {
  let addends: number[] = [];
  let breakdown: ColumnBreakdown;
  do {
    addends = Array.from({ length: 4 }, () => randInt(10, 99));
    breakdown = buildAddColumns(addends, 3);
  } while (regroupCount(breakdown) < 2);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${addends.join(" + ")}?`, hint: "Work one column at a time, carrying as far as each sum needs.", explain: `${addends.join(" + ")} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

export const onesColumnSumNumberQuestion = (): TestQuestion[] => {
  const n = randInt(0, 1) === 0 ? 3 : 4;
  const digits = Array.from({ length: n }, () => randInt(3, 9));
  const sum = digits.reduce((a, b) => a + b, 0);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${digits.join(" + ")}?`, hint: "This is just the ones column by itself.", explain: `${digits.join(" + ")} = ${sum}.`, answer: sum },
    },
  ];
};

export const addingFourTwoDigitNumbersTest: Unit["test"] = {
  questions: [
    twoAddendsNoRegroupNumberQuestion,
    twoAddendsOneRegroupNumberQuestion,
    carryDigitChoiceQuestion,
    threeAddendsSingleCarryNumberQuestion,
    fourAddendsDoubleCarryNumberQuestion,
    carryMoreThanOneTrueFalseChoiceQuestion,
    whichDigitBelowLineChoiceQuestion,
    threeOrFourAddendsCarryRatioQuestion,
    fourAddendsTotalNumberQuestion,
    onesColumnSumNumberQuestion,
  ],
  passScore: 9,
};
