import { NumberLine } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Rounding to the Nearest Ten ----------
// Self-contained — does NOT import from RoundingToNearestTen.tsx (that would
// create a circular import once ModuleTest.tsx reuses these generators), same
// convention as every other *Test.tsx in this app. Every helper/generator
// below is its own copy.

const roundToNearest = (n: number, unit: number): number => Math.floor(n / unit + 0.5) * unit;
const crossesHundred = (n: number): boolean => (Math.floor(n / 10) * 10) % 100 === 90;

const randClearTwoDigit = (): number => {
  let n: number;
  do {
    n = randInt(11, 98);
  } while (n % 10 === 5 || crossesHundred(n));
  return n;
};
const randClearThreeDigit = (): number => {
  let n: number;
  do {
    n = randInt(101, 988);
  } while (n % 10 === 5 || crossesHundred(n));
  return n;
};
const randMidpoint = (digits: "two" | "three"): number => (digits === "two" ? randInt(1, 8) * 10 + 5 : randInt(10, 98) * 10 + 5);
const randBoundary = (): number => randInt(0, 9) * 100 + 90 + randInt(6, 9);

/** A plain "round this number" question, visualized on a number line showing
 *  the two surrounding tens. Exported so ModuleTest.tsx can draw the same
 *  question shapes with fresh random numbers. */
export const roundTenQuestion = (n: number, difficulty: "easy" | "medium" | "hard"): TestQuestion[] => {
  const lower = Math.floor(n / 10) * 10;
  const upper = lower + 10;
  const rounded = roundToNearest(n, 10);
  const isMid = n % 10 === 5;
  return [
    {
      visual: (
        <NumberLine
          min={lower}
          max={upper}
          points={[
            { value: n, label: String(n), tone: "a" },
            { value: lower, label: String(lower), tone: "b" },
            { value: upper, label: String(upper), tone: "c" },
          ]}
        />
      ),
      difficulty,
      step: {
        kind: "number",
        prompt: `Round ${n} to the nearest ten.`,
        hint: isMid ? "Exactly halfway numbers round UP by the rounding rule." : `Compare how far ${n} is from ${lower} versus ${upper}.`,
        explain: isMid ? `${n} is exactly halfway, so it rounds up to ${rounded}.` : `${n} is closer to ${rounded}.`,
        answer: rounded,
      },
    },
  ];
};

export const twoDigitClearQuestion = (): TestQuestion[] => roundTenQuestion(randClearTwoDigit(), "easy");
export const threeDigitClearQuestion = (): TestQuestion[] => roundTenQuestion(randClearThreeDigit(), "medium");
export const midpointTwoDigitQuestion = (): TestQuestion[] => roundTenQuestion(randMidpoint("two"), "medium");
export const midpointThreeDigitQuestion = (): TestQuestion[] => roundTenQuestion(randMidpoint("three"), "hard");
export const boundaryQuestion = (): TestQuestion[] => roundTenQuestion(randBoundary(), "hard");
export const boundaryQuestion2 = (): TestQuestion[] => roundTenQuestion(randBoundary(), "hard");
export const threeDigitApplicationQuestion = (): TestQuestion[] => roundTenQuestion(randClearThreeDigit(), "medium");

/** Vocabulary: what rounding actually means, not just the shortcut result. */
export const vocabQuestion = (): TestQuestion[] => {
  const n = randClearTwoDigit();
  const lower = Math.floor(n / 10) * 10;
  const upper = lower + 10;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        {
          prompt: `What does it mean to round ${n} to the nearest ten?`,
          hint: "Think about distance on a number line, not just a shortcut.",
          explain: `Rounding means deciding whether ${n} is closer to ${lower} or ${upper}.`,
        },
        `Decide whether ${n} is closer to ${lower} or ${upper}`,
        [
          // Misconception: treats rounding as a blind mechanical rule ("change
          // the last digit") with no reference to actual closeness at all.
          `Just change the ones digit of ${n} to 0`,
          // Misconception: confuses rounding with "always round up to make it bigger."
          `Always make ${n} bigger so it's easier to work with`,
        ]
      ),
    },
  ];
};

/** The classic midpoint misconception, stated as a direct true/false trap. */
export const midpointTrueFalseQuestion = (): TestQuestion[] => {
  const n = randMidpoint("two");
  const lower = n - 5;
  const upper = n + 5;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `True or False: Since ${n} is exactly halfway between ${lower} and ${upper}, it could correctly round to either one.`,
          hint: "What does the rounding rule say to do with an exact tie?",
          explain: `False — by the rounding rule, an exact halfway number like ${n} always rounds UP, to ${upper}, not either one.`,
        },
        "False",
        // Misconception this directly targets: believing a midpoint has no
        // single correct rounded value.
        ["True"]
      ),
    },
  ];
};

/** The "just change the last digit" shortcut breaking at a hundred-boundary
 *  crossing — the generalization trap the brief calls for, tied to a concrete
 *  wrong answer a student following that shortcut would actually produce. */
export const shortcutTrapQuestion = (): TestQuestion[] => {
  const n = randBoundary();
  const lower = Math.floor(n / 10) * 10;
  const upper = lower + 10;
  const wrongShortcutAnswer = lower; // the "just zero the ones digit" wrong result
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `A student rounds ${n} to the nearest ten by just changing the ones digit to 0, getting ${wrongShortcutAnswer}. What's wrong?`,
          hint: `Compare ${n} to ${lower} and to ${upper} — which is it actually closer to?`,
          explain: `${n} is closer to ${upper}, not ${lower} — "just zero the ones digit" misses that rounding up here also changes the hundreds digit.`,
        },
        `${n} is closer to ${upper}, not ${lower} — the hundreds digit changes too`,
        [
          `Nothing — ${wrongShortcutAnswer} is correct`,
          // Misconception: assumes 3-digit numbers can't be rounded at all.
          `You can't round a number with 3 digits`,
        ]
      ),
    },
  ];
};

export const roundingNearestTenTest: Unit["test"] = {
  questions: [
    twoDigitClearQuestion,
    threeDigitClearQuestion,
    midpointTwoDigitQuestion,
    midpointThreeDigitQuestion,
    boundaryQuestion,
    boundaryQuestion2,
    threeDigitApplicationQuestion,
    vocabQuestion,
    midpointTrueFalseQuestion,
    shortcutTrapQuestion,
  ],
  passScore: 9,
};
