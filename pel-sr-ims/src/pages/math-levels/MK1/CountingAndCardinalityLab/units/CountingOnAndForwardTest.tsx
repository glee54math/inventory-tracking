import { CounterGroup, TenGroups } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Counting On and Counting Forward ----------
// 10 questions from 9 generators. Self-contained (no import from
// CountingOnAndForward.tsx, and that file never imports back from here) —
// same convention as every other *Test.tsx in this app, since the unit file
// already imports this file's `countingOnAndForwardTest` export, and an
// import the other way would be a circular import that throws at
// module-eval time (silently surfacing as "Level not found").

const decadeLabel = (n: number) => `the ${Math.floor(n / 10) * 10}s`;

/** Successor within a short, line-of-dots range. */
export const successorShortQuestion = (): TestQuestion[] => {
  const before = randInt(2, 15);
  const after = before + 1;
  return [
    {
      visual: <CounterGroup count={before} arrangement="line" tone="a" seed={before} />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `Count the dots: there are ${before}. What number comes right after ${before}?`,
        hint: "Count one more than the dots shown.",
        explain: `${before} + 1 = ${after}.`,
        answer: after,
      },
    },
  ];
};

/** Successor in the long (bundled-tens) range. */
export const successorLongQuestion = (): TestQuestion[] => {
  const before = randInt(21, 98);
  const after = before + 1;
  return [
    {
      visual: <TenGroups value={before} tone="a" />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `What number comes right after ${before}?`,
        hint: "Count one more.",
        explain: `${before} + 1 = ${after}.`,
        answer: after,
      },
    },
  ];
};

/** Counting-by-tens successor. */
export const tensNextQuestion = (difficulty: "easy" | "medium" = "easy"): TestQuestion[] => {
  const t = randInt(0, 9);
  const prevVal = t * 10;
  const nextVal = (t + 1) * 10;
  return [
    {
      visual: <TenGroups value={prevVal} tone="b" />,
      difficulty,
      step: {
        kind: "number",
        prompt: `Counting by tens, what comes right after ${prevVal}?`,
        hint: "Each jump adds one whole group of ten.",
        explain: `${prevVal} + 10 = ${nextVal}.`,
        answer: nextVal,
      },
    },
  ];
};

/** Decade-crossing successor, asked as "which ten did you just enter" — the
 *  distractor is the SAME decade the student started in, targeting the
 *  specific misconception of not recognizing a new ten has started. */
export const decadeCrossChoiceQuestion = (): TestQuestion[] => {
  const d = randInt(1, 8);
  const startNum = d * 10 + 9;
  const next = startNum + 1;
  const prevLabel = decadeLabel(startNum);
  const nextLabel = decadeLabel(next);
  return [
    {
      visual: <TenGroups value={startNum} tone="c" />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${startNum} to ${next} — which ten did you just start?`,
          hint: "A number ending in 9 is the LAST number of its ten.",
          explain: `${next} starts ${nextLabel}, right after finishing ${prevLabel}.`,
        },
        nextLabel,
        [prevLabel] // misconception: thinking the new decade hasn't started yet
      ),
    },
  ];
};

/** Decade-crossing successor, typed as a bare number — tests actually
 *  producing the digits across the boundary, not just recognizing the
 *  decade name. Deliberately includes the ...->100 top edge sometimes. */
export const decadeCrossNumberQuestion = (): TestQuestion[] => {
  const d = randInt(1, 9);
  const startNum = d * 10 + 9;
  const next = startNum + 1;
  return [
    {
      visual: <TenGroups value={startNum} tone="c" />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `What number comes right after ${startNum}?`,
        hint: "This crosses into a brand new ten — don't repeat the ten you're leaving.",
        explain: `${startNum} + 1 = ${next}.`,
        answer: next,
      },
    },
  ];
};

/** Reverse-direction: one LESS than a given number, instead of the usual
 *  "what comes next." */
export const oneLessQuestion = (): TestQuestion[] => {
  const n = randInt(11, 99);
  const less = n - 1;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `What number is one LESS than ${n}?`,
        hint: "One less means counting backward one step, not forward.",
        explain: `One less than ${n} is ${less}.`,
        answer: less,
      },
    },
  ];
};

/** Generalization / true-false trap: does the decade-crossing rule always hold? */
export const decadeAlwaysTrueQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: every time you count from a number ending in 9 to the very next number, you always land in a brand new ten.",
          hint: "Check a few: 19→20, 39→40, 59→60. Does it ever fail?",
          explain: "Always true — every ten has exactly ten numbers in it, so the number right after one ending in 9 always starts the next ten.",
        },
        "True",
        ["False"] // misconception: thinking 29→30 was a one-off coincidence, not a rule
      ),
    },
  ];
};

/** Reasoning about tens as GROUPS, not just a counting sequence. */
export const tensGroupCountQuestion = (): TestQuestion[] => {
  const t = randInt(2, 9);
  const val = t * 10;
  return [
    {
      visual: <TenGroups value={val} tone="b" />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `How many groups of ten is ${val}?`,
        hint: "Count the bundles, not the dots inside them.",
        explain: `${val} is made of ${t} groups of ten.`,
        answer: t,
      },
    },
  ];
};

/** Full-sequence recognition: pick the correctly-counted run from three
 *  plausible-looking sequences, each a different common mistake. */
export const sequenceChoiceQuestion = (): TestQuestion[] => {
  const start = randInt(2, 8) * 10 - 2; // ends in 8, so the run crosses a decade: e.g. 38
  const correct = `${start}, ${start + 1}, ${start + 2}, ${start + 3}`;
  const skipsOne = `${start}, ${start + 2}, ${start + 3}, ${start + 4}`; // misconception: skip-counting by 2 instead of 1
  const decade = Math.floor(start / 10) * 10;
  const garbledDecade = `${start}, ${start + 1}, ${decade + 20}, ${decade + 21}`; // misconception: jumps an extra whole ten at the boundary
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `Which sequence correctly counts forward four numbers, starting at ${start}?`,
          hint: "Count one at a time — nothing should ever be skipped or jump by more than one.",
          explain: `${correct} — each number is exactly one more than the last, including the crossing into a new ten.`,
        },
        correct,
        [skipsOne, garbledDecade]
      ),
    },
  ];
};

export const countingOnAndForwardTest: Unit["test"] = {
  questions: [
    successorShortQuestion,
    successorLongQuestion,
    () => tensNextQuestion("easy"),
    () => tensNextQuestion("medium"),
    decadeCrossChoiceQuestion,
    decadeCrossNumberQuestion,
    oneLessQuestion,
    decadeAlwaysTrueQuestion,
    tensGroupCountQuestion,
    sequenceChoiceQuestion,
  ],
  passScore: 9,
};
