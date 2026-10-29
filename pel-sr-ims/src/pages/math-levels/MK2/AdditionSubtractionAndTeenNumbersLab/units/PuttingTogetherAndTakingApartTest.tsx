import { SplitGroup, Fingers } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Putting Together and Taking Apart ----------
// 10 questions from 10 generators. Self-contained — no import from
// PuttingTogetherAndTakingApart.tsx, and that file never imports back from
// here, since the unit file already imports this file's test export; an
// import the other way would be a circular import that throws at
// module-eval time (silently surfacing as "Level not found" via the level
// loader's dynamic import()).

/** Addition, result unknown — concrete join. */
export const addToResultQuestion = (): TestQuestion[] => {
  const a = randInt(1, 8);
  const b = randInt(1, Math.min(9, 10 - a));
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `${a} ducks are swimming. ${b} more ducks swim over to join them. How many ducks are there now?`, hint: "Count every duck, both colors.", explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** Addition reverse-direction: given the total and one join amount, find the starting part. */
export const addToStartUnknownQuestion = (): TestQuestion[] => {
  const a = randInt(1, 7);
  const b = randInt(1, Math.min(8, 10 - a));
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${b} more birds joined a group, making ${total} birds in all. How many birds were there before the ${b} joined?`, hint: "Subtract the joining part from the total.", explain: `${total} − ${b} = ${a}, so there were ${a} to start.`, answer: a },
    },
  ];
};

/** Subtraction, result unknown — concrete take-apart. */
export const takeFromResultQuestion = (): TestQuestion[] => {
  const total = randInt(2, 10);
  const b = randInt(1, total - 1);
  const a = total - b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `There are ${total} cookies. ${b} of them get eaten. How many cookies are left?`, hint: "Count only the color that's still there.", explain: `${total} − ${b} = ${a}.`, answer: a },
    },
  ];
};

/** Subtraction reverse-direction: given what's left and what was taken, find the start. */
export const takeFromStartUnknownQuestion = (): TestQuestion[] => {
  const total = randInt(2, 10);
  const b = randInt(1, total - 1);
  const a = total - b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${b} balloons popped, leaving ${a} balloons. How many balloons were there before any popped?`, hint: "Add the part that's gone back to the part that's left.", explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** Fingers modality — joining. */
export const fingersJoinQuestion = (): TestQuestion[] => {
  const a = randInt(1, 5);
  const b = randInt(1, Math.min(5, 10 - a));
  const total = a + b;
  return [
    {
      visual: <Fingers count={total} tone="c" />,
      difficulty: "easy",
      step: { kind: "number", prompt: `Hold up ${a} fingers on one hand and ${b} fingers on the other. How many fingers are up in all?`, hint: "Count every raised finger on both hands.", explain: `${a} + ${b} = ${total}.`, answer: total },
    },
  ];
};

/** Fingers modality — taking apart. */
export const fingersApartQuestion = (): TestQuestion[] => {
  const total = randInt(2, 10);
  const b = randInt(1, total - 1);
  const a = total - b;
  return [
    {
      visual: <Fingers count={a} tone="c" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${total} fingers are up. ${b} of them go down. How many fingers are still up?`, hint: "Start with the total and take away the ones that went down.", explain: `${total} − ${b} = ${a}.`, answer: a },
    },
  ];
};

/** Symbolic translation — pick the equation that matches a joining scene. */
export const equationJoinChoiceQuestion = (): TestQuestion[] => {
  const a = randInt(1, 8);
  const b = randInt(1, Math.min(9, 10 - a));
  const total = a + b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: `${a} fish are in a pond. ${b} more fish swim in. Which number sentence matches this story?`, hint: "The two groups are joining — that's +.", explain: `${a} + ${b} = ${total}.` },
        `${a} + ${b} = ${total}`,
        [`${total} + ${b} = ${a}`, `${a} − ${b} = ${total}`] // misconceptions: total placed on the wrong side; wrong operation chosen
      ),
    },
  ];
};

/** Symbolic translation — pick the equation that matches a take-apart scene. */
export const equationApartChoiceQuestion = (): TestQuestion[] => {
  const total = randInt(2, 10);
  const b = randInt(1, total - 1);
  const a = total - b;
  return [
    {
      visual: <SplitGroup total={total} partA={a} toneA="a" toneB="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: `${total} fish are in a pond. ${b} of them swim away. Which number sentence matches this story?`, hint: "A part is leaving the whole — that's −.", explain: `${total} − ${b} = ${a}.` },
        `${total} − ${b} = ${a}`,
        [`${a} − ${b} = ${total}`, `${total} + ${b} = ${a}`] // misconceptions: operand order swapped; wrong operation chosen
      ),
    },
  ];
};

/** Vocabulary / symbol meaning, asked directly (not just "what's the answer"). */
export const symbolMeaningQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: "In a number sentence like 4 + 3 = 7, what does the + symbol tell you to do?", hint: "Think about what happens to the two groups.", explain: "The + symbol means two groups are joining together." },
        "Put groups together",
        ["Take a group apart", "Compare two groups"] // misconceptions: confusing + with subtraction or with comparison
      ),
    },
  ];
};

/** Generalization / false trap: can taking away ever make a group bigger? */
export const takeAwayNeverBiggerQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: taking objects away from a group can sometimes make the group bigger.",
          hint: "Try it with real objects — does taking any away ever add more?",
          explain: "False — taking away always leaves the same amount or fewer, never more.",
        },
        "False",
        ["True"] // misconception: not recognizing subtraction's direction is always non-increasing
      ),
    },
  ];
};

export const puttingTogetherAndTakingApartTest: Unit["test"] = {
  questions: [
    addToResultQuestion,
    addToStartUnknownQuestion,
    takeFromResultQuestion,
    takeFromStartUnknownQuestion,
    fingersJoinQuestion,
    fingersApartQuestion,
    equationJoinChoiceQuestion,
    equationApartChoiceQuestion,
    symbolMeaningQuestion,
    takeAwayNeverBiggerQuestion,
  ],
  passScore: 9,
};
