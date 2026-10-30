import { NumberLine } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, numberBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Rounding to the Nearest Hundred ----------
// Self-contained — does NOT import from RoundingToNearestHundred.tsx, same
// no-cross-import convention as every other *Test.tsx in this app.

const roundToNearest = (n: number, unit: number): number => Math.floor(n / unit + 0.5) * unit;

const randClearHundred = (): number => {
  let n: number;
  do {
    n = randInt(110, 849);
  } while (n % 100 === 50);
  return n;
};
const randMidpointHundred = (): number => randInt(1, 9) * 100 + 50;
const randBoundaryHundred = (): number => 900 + randInt(51, 99);

export const roundHundredQuestion = (n: number, difficulty: "easy" | "medium" | "hard"): TestQuestion[] => {
  const lower = Math.floor(n / 100) * 100;
  const upper = lower + 100;
  const rounded = roundToNearest(n, 100);
  const isMid = n % 100 === 50;
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
        prompt: `Round ${n} to the nearest hundred.`,
        hint: isMid ? "Exactly halfway numbers round UP by the rounding rule." : `Compare how far ${n} is from ${lower} versus ${upper}.`,
        explain: isMid ? `${n} is exactly halfway, so it rounds up to ${rounded}.` : `${n} is closer to ${rounded}.`,
        answer: rounded,
      },
    },
  ];
};

export const clearHundredQuestion = (): TestQuestion[] => roundHundredQuestion(randClearHundred(), "easy");
export const clearHundredQuestion2 = (): TestQuestion[] => roundHundredQuestion(randClearHundred(), "medium");
export const midpointHundredQuestion = (): TestQuestion[] => roundHundredQuestion(randMidpointHundred(), "medium");
export const midpointHundredQuestion2 = (): TestQuestion[] => roundHundredQuestion(randMidpointHundred(), "hard");
export const boundaryHundredQuestion = (): TestQuestion[] => roundHundredQuestion(randBoundaryHundred(), "hard");
export const boundaryHundredQuestion2 = (): TestQuestion[] => roundHundredQuestion(randBoundaryHundred(), "hard");

/** The mixed-discrimination case, required by the plan: the SAME number
 *  rounded two different ways, both typed in on one sentence question so a
 *  student can't just answer one and have it silently reused for the other. */
export const mixedDiscriminationQuestion = (): TestQuestion[] => {
  let n: number;
  let r10: number;
  let r100: number;
  do {
    n = randInt(115, 884);
    r10 = Math.floor(n / 10 + 0.5) * 10;
    r100 = roundToNearest(n, 100);
  } while (r10 === r100 || n % 10 === 0 || n % 100 === 0);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: sentence(
        {
          prompt: `Round ${n} two different ways.`,
          hint: "Work out each one separately — they don't have to match.",
          explain: `${n} rounds to ${r10} to the nearest ten, and ${r100} to the nearest hundred — different landmarks, different answers.`,
        },
        `Rounded to the nearest ten, ${n} is `,
        numberBlank(r10),
        `. Rounded to the nearest hundred, it's `,
        numberBlank(r100),
        "."
      ),
    },
  ];
};

export const vocabHundredQuestion = (): TestQuestion[] => {
  const n = randClearHundred();
  const lower = Math.floor(n / 100) * 100;
  const upper = lower + 100;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        {
          prompt: `What does it mean to round ${n} to the nearest hundred?`,
          hint: "Think about distance on a number line, not just a shortcut.",
          explain: `Rounding means deciding whether ${n} is closer to ${lower} or ${upper}.`,
        },
        `Decide whether ${n} is closer to ${lower} or ${upper}`,
        [
          // Misconception: mechanical digit-zeroing with no reference to actual closeness.
          `Just change the tens and ones digits of ${n} to 0`,
          `Always round ${n} up, since bigger numbers are easier to work with`,
        ]
      ),
    },
  ];
};

export const midpointTrueFalseHundredQuestion = (): TestQuestion[] => {
  const n = randMidpointHundred();
  const lower = n - 50;
  const upper = n + 50;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `True or False: Since ${n} is exactly halfway between ${lower} and ${upper}, it could correctly round to either one.`,
          hint: "What does the rounding rule say to do with an exact tie?",
          explain: `False — an exact halfway number like ${n} always rounds UP, to ${upper}.`,
        },
        "False",
        ["True"]
      ),
    },
  ];
};

/** The "zero the last two digits" shortcut breaking at the thousand-boundary
 *  crossing — same shortcut-trap shape as the nearest-ten test, scaled up. */
export const shortcutTrapHundredQuestion = (): TestQuestion[] => {
  const n = randBoundaryHundred();
  const lower = Math.floor(n / 100) * 100;
  const upper = lower + 100;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `A student rounds ${n} to the nearest hundred by just changing the tens and ones digits to 0, getting ${lower}. What's wrong?`,
          hint: `Compare ${n} to ${lower} and to ${upper} — which is it actually closer to?`,
          explain: `${n} is closer to ${upper}, not ${lower} — zeroing the last two digits misses that rounding up here also changes the thousands digit.`,
        },
        `${n} is closer to ${upper}, not ${lower} — the thousands digit changes too`,
        [`Nothing — ${lower} is correct`, `You can't round past 999`]
      ),
    },
  ];
};

export const roundingNearestHundredTest: Unit["test"] = {
  questions: [
    clearHundredQuestion,
    clearHundredQuestion2,
    midpointHundredQuestion,
    midpointHundredQuestion2,
    boundaryHundredQuestion,
    boundaryHundredQuestion2,
    mixedDiscriminationQuestion,
    vocabHundredQuestion,
    midpointTrueFalseHundredQuestion,
    shortcutTrapHundredQuestion,
  ],
  passScore: 9,
};
