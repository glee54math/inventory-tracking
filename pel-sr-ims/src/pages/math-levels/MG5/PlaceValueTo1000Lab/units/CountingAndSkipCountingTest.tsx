import { CountingTrack } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { buildSequence } from "../logic";

// ---------- end-of-unit test: Counting and Skip-Counting to 1000 ----------
// 10 single-question generators across all 6 buckets. Self-contained (does
// NOT import from CountingAndSkipCounting.tsx) — only from the sibling
// logic.ts module.

/** count1, easy: free-typed "what comes next," crossing a hundred boundary. */
export const count1Question = (): TestQuestion[] => {
  const k = randInt(1, 9);
  const offset = randInt(1, 2);
  const start = k * 100 - offset;
  const seq = buildSequence(start, 1, 3);
  return [
    {
      visual: <CountingTrack sequence={seq} knownCount={2} tone="a" markHundredChange />,
      difficulty: "easy",
      step: { kind: "number", prompt: `Counting by ones: ${seq[0]}, ${seq[1]}, ___?`, hint: "Add 1.", explain: `${seq[1]} + 1 = ${seq[2]}.`, answer: seq[2] },
    },
  ];
};

/** count1, medium: choice question whose wrong answer is literally the
 *  comma-reset mistake named in Explore's Check for Understanding. */
export const count1ChoiceQuestion = (): TestQuestion[] => {
  const k = randInt(2, 9);
  const n = k * 100 - 1; // ends in 99
  const correct = k * 100;
  const commaResetMistake = `${k - 1},100`; // treats crossing a hundred as starting a new digit group
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Counting by ones: ${n - 1}, ${n}, ___?`, hint: "It's always just +1.", explain: `${n} + 1 = ${correct} — written the normal way, no comma.` },
        String(correct),
        [commaResetMistake, String(n)] // the comma-reset mistake; or forgetting to count forward at all
      ),
    },
  ];
};

/** skip2, medium: free-typed, crossing a hundred boundary by 2s. */
export const skip2Question = (): TestQuestion[] => {
  const k = randInt(1, 9);
  const m = randInt(1, 3);
  const start = k * 100 - 2 * m;
  const seq = buildSequence(start, 2, 3);
  return [
    {
      visual: <CountingTrack sequence={seq} knownCount={2} tone="a" markHundredChange />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Skip-counting by 2s: ${seq[0]}, ${seq[1]}, ___?`, hint: "Add 2.", explain: `${seq[1]} + 2 = ${seq[2]}.`, answer: seq[2] },
    },
  ];
};

/** skip2, hard: choice question with an off-by-one distractor (skipped by 1
 *  instead of 2) and a "forgot to move at all" distractor. */
export const skip2ChoiceQuestion = (): TestQuestion[] => {
  const k = randInt(1, 9);
  const m = randInt(1, 3);
  const start = k * 100 - 2 * m;
  const seq = buildSequence(start, 2, 3);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Skip-counting by 2s: ${seq[0]}, ${seq[1]}, ___?`, hint: "Add 2, not 1.", explain: `${seq[1]} + 2 = ${seq[2]}.` },
        String(seq[2]),
        [String(seq[1] + 1), String(seq[1])] // skipped by 1 instead of 2; or didn't move at all
      ),
    },
  ];
};

/** skip5, medium: free-typed, crossing a landmark by 5s. */
export const skip5Question = (): TestQuestion[] => {
  const k = randInt(1, 9);
  const m = randInt(1, 2);
  const start = k * 100 - 5 * m;
  const seq = buildSequence(start, 5, 3);
  return [
    {
      visual: <CountingTrack sequence={seq} knownCount={2} tone="a" markHundredChange />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Skip-counting by 5s: ${seq[0]}, ${seq[1]}, ___?`, hint: "Add 5.", explain: `${seq[1]} + 5 = ${seq[2]}.`, answer: seq[2] },
    },
  ];
};

/** skip10, medium: free-typed, crossing a hundred boundary by 10s. */
export const skip10Question = (): TestQuestion[] => {
  const k = randInt(1, 9);
  const m = randInt(1, 3);
  const start = k * 100 - 10 * m;
  const seq = buildSequence(start, 10, 3);
  return [
    {
      visual: <CountingTrack sequence={seq} knownCount={2} tone="a" markHundredChange />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Skip-counting by 10s: ${seq[0]}, ${seq[1]}, ___?`, hint: "Add 10.", explain: `${seq[1]} + 10 = ${seq[2]}.`, answer: seq[2] },
    },
  ];
};

/** skip10, hard: choice question whose wrong answers are "forgot to cross
 *  the hundred" (just added 10 within the same hundred's tens digit, wrapping
 *  wrong) and "jumped a whole hundred instead of 10." */
export const skip10ChoiceQuestion = (): TestQuestion[] => {
  const k = randInt(2, 9);
  const m = randInt(1, 3);
  const start = k * 100 - 10 * m;
  const seq = buildSequence(start, 10, 3);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Skip-counting by 10s: ${seq[0]}, ${seq[1]}, ___?`, hint: "Add exactly 10 to the last number.", explain: `${seq[1]} + 10 = ${seq[2]}.` },
        String(seq[2]),
        [String(seq[2] + 90), String(seq[1])].filter((d) => d !== String(seq[2])) // jumped a whole hundred instead of 10; or didn't move at all
      ),
    },
  ];
};

/** skip100, medium: free-typed, counting by hundreds toward 1000. */
export const skip100Question = (): TestQuestion[] => {
  const start = randInt(0, 6) * 100;
  const seq = buildSequence(start, 100, 3);
  return [
    {
      visual: <CountingTrack sequence={seq} knownCount={2} tone="a" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `Skip-counting by 100s: ${seq[0]}, ${seq[1]}, ___?`, hint: "Add 100.", explain: `${seq[1]} + 100 = ${seq[2]}.`, answer: seq[2] },
    },
  ];
};

/** skip100, hard: the 1000-endpoint case specifically — 1000 is treated as
 *  an in-range value for THIS unit, per the plan's own carve-out. */
export const skip100EndpointQuestion = (): TestQuestion[] => {
  const seq = buildSequence(600, 100, 5); // 600,700,800,900,1000
  return [
    {
      visual: <CountingTrack sequence={seq} knownCount={4} tone="a" />,
      difficulty: "hard",
      step: choice(
        { prompt: `Skip-counting by 100s: 600, 700, 800, 900, ___?`, hint: "One more jump of 100 after 900.", explain: "900 + 100 = 1000 — the sequence's last stop." },
        "1000",
        ["900", "1,100"] // stopped one jump short; or jumped past the correct endpoint
      ),
    },
  ];
};

/** offsetStart, hard: free-typed, starting from a number that's NOT a
 *  multiple of the skip amount. */
export const offsetStartQuestion = (): TestQuestion[] => {
  const step = ([2, 5, 10] as const)[randInt(0, 2)];
  let start: number;
  do {
    start = randInt(1, 900);
  } while (start % step === 0);
  const seq = buildSequence(start, step, 3);
  return [
    {
      visual: <CountingTrack sequence={seq} knownCount={2} tone="a" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `Skip-counting by ${step}s: ${seq[0]}, ${seq[1]}, ___?`, hint: `Add ${step}, even though ${start} itself isn't a multiple of ${step}.`, explain: `${seq[1]} + ${step} = ${seq[2]}.`, answer: seq[2] },
    },
  ];
};

export const countingAndSkipCountingTest: Unit["test"] = {
  questions: [
    count1Question,
    count1ChoiceQuestion,
    skip2Question,
    skip2ChoiceQuestion,
    skip5Question,
    skip10Question,
    skip10ChoiceQuestion,
    skip100Question,
    skip100EndpointQuestion,
    offsetStartQuestion,
  ],
  passScore: 9,
};
