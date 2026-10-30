import { EqualGroups } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Even Numbers as Equal Addends ----------
// 10 questions from 10 generators. Self-contained (no import from
// EvenNumbersAsEqualAddends.tsx, and that file never imports back from
// here) — same convention as every other *Test.tsx in this app.

/** Small even number, find half. */
export const smallHalfNumberQuestion = (): TestQuestion[] => {
  const n = randInt(1, 5) * 2; // 2..10
  const half = n / 2;
  return [
    {
      visual: <EqualGroups groupA={half} groupB={half} sameColor />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is half of ${n}?`, hint: "Split it into two equal groups.", explain: `Half of ${n} is ${half}.`, answer: half },
    },
  ];
};

/** Small even number, write the full equal-addends equation. */
export const smallEqualAddendsRatioQuestion = (): TestQuestion[] => {
  const n = randInt(1, 5) * 2;
  const half = n / 2;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "ratio", prompt: `Write ${n} as two equal addends.`, hint: "Both boxes need the same number.", explain: `${n} = ${half} + ${half}.`, answer: [half, half], labels: ["first addend", "second addend"], tones: "none", frame: [`${n} = `, "+", ""] },
    },
  ];
};

/** Larger even number, find half — hard edge of the bucket (20). */
export const largerHalfNumberQuestion = (): TestQuestion[] => {
  const n = randInt(6, 10) * 2; // 12..20
  const half = n / 2;
  return [
    {
      visual: <EqualGroups groupA={half} groupB={half} sameColor />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is half of ${n}?`, hint: "Split it into two equal groups.", explain: `Half of ${n} is ${half}.`, answer: half },
    },
  ];
};

/** Larger even number, write the full equal-addends equation. */
export const largerEqualAddendsRatioQuestion = (): TestQuestion[] => {
  const n = randInt(6, 10) * 2;
  const half = n / 2;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "ratio", prompt: `Write ${n} as two equal addends.`, hint: `Half of ${n} is ${half}.`, explain: `${n} = ${half} + ${half}.`, answer: [half, half], labels: ["first addend", "second addend"], tones: "none", frame: [`${n} = `, "+", ""] },
    },
  ];
};

/** Invalid equal-addends trap: sums correctly but addends differ. */
export const invalidEqualAddendsChoiceQuestion = (): TestQuestion[] => {
  const n = randInt(3, 10) * 2; // 6..20
  let a = randInt(1, n - 1);
  while (a === n - a) a = randInt(1, n - 1);
  const b = n - a;
  return [
    {
      visual: <EqualGroups groupA={a} groupB={b} sameColor={false} />,
      difficulty: "medium",
      step: choice(
        { prompt: `Is ${n} = ${a} + ${b} an example of equal addends?`, hint: `Check whether ${a} and ${b} are the SAME number.`, explain: `${a} ≠ ${b} — this sums correctly but isn't equal addends.` },
        "No",
        ["Yes"] // misconception: any addends that sum to the target count as "equal addends"
      ),
    },
  ];
};

/** Invalid equal-addends trap, fix it: write the real equal-addends form. */
export const invalidEqualAddendsFixQuestion = (): TestQuestion[] => {
  const n = randInt(3, 10) * 2;
  const half = n / 2;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "ratio", prompt: `Someone wrote an incorrect equal-addends equation for ${n}. Write the CORRECT one.`, hint: `Half of ${n} is ${half}.`, explain: `${n} = ${half} + ${half}.`, answer: [half, half], labels: ["first addend", "second addend"], tones: "none", frame: [`${n} = `, "+", ""] },
    },
  ];
};

/** Odd number trap: cannot be split into two equal whole-number addends. */
export const oddNumberImpossibleChoiceQuestion = (): TestQuestion[] => {
  const m = randInt(1, 9) * 2 + 1; // 3..19
  const lo = Math.floor(m / 2);
  const hi = Math.ceil(m / 2);
  return [
    {
      visual: <EqualGroups groupA={lo} groupB={hi} sameColor={false} />,
      difficulty: "medium",
      step: choice(
        { prompt: `Can ${m} be split into two EQUAL whole-number addends?`, hint: `${m} is odd — try splitting it in half.`, explain: `${m} only splits into ${lo} + ${hi}, which aren't equal.` },
        "No",
        ["Yes"]
      ),
    },
  ];
};

/** Odd number trap, name the closest (unequal) split. */
export const oddNumberClosestSplitQuestion = (): TestQuestion[] => {
  const m = randInt(1, 9) * 2 + 1;
  const lo = Math.floor(m / 2);
  const hi = Math.ceil(m / 2);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `${m} is odd. The closest split is ${lo} + ___. What's the other part?`, hint: `${lo} + ${hi} = ${m}.`, explain: `The closest split is ${lo} + ${hi} — still not equal.`, answer: hi },
    },
  ];
};

/** Generalization / true-false trap: NOT every number splits into two
 *  equal whole-number addends. */
export const everyNumberTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: every whole number can be written as two equal whole-number addends.", hint: "Try it with an odd number like 9.", explain: "False — odd numbers always leave one left over, no matter how you split them." },
        "False",
        ["True"] // misconception: assuming equal-addends always works
      ),
    },
  ];
};

/** Vocabulary trap: what equal addends actually requires. */
export const whatAreEqualAddendsChoiceQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "What makes two addends \"equal addends\" for a number?", hint: "It's not just about summing to the right total.", explain: "Equal addends must be the SAME number as each other AND add up to the target." },
        "They are the exact SAME number as each other, AND together they add up to the target",
        ["They add up to the number — any two addends that work"] // misconception: sum alone is enough
      ),
    },
  ];
};

export const evenNumbersAsEqualAddendsTest: Unit["test"] = {
  questions: [
    smallHalfNumberQuestion,
    smallEqualAddendsRatioQuestion,
    largerHalfNumberQuestion,
    largerEqualAddendsRatioQuestion,
    invalidEqualAddendsChoiceQuestion,
    invalidEqualAddendsFixQuestion,
    oddNumberImpossibleChoiceQuestion,
    oddNumberClosestSplitQuestion,
    everyNumberTrueFalseQuestion,
    whatAreEqualAddendsChoiceQuestion,
  ],
  passScore: 9,
};
