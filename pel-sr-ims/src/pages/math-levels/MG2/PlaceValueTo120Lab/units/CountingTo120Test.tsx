import { HundredChart } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Counting to 120 ----------
// 10 questions from 10 generators. Self-contained (no import from
// CountingTo120.tsx, and that file never imports back from here) — same
// convention as every other *Test.tsx in this app, since an import the
// other way would be a circular import that throws at module-eval time.

/** Successor starting right from the baseline (counting from 1). */
export const successorFrom1Question = (): TestQuestion[] => {
  const n = randInt(1, 8);
  const after = n + 1;
  return [
    {
      visual: <HundredChart marks={[{ n, tone: "a" }]} upTo={n} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `Counting from 1: what number comes right after ${n}?`, hint: "Count one more.", explain: `${n} + 1 = ${after}.`, answer: after },
    },
  ];
};

/** Successor starting from any mid-range number, not a decade boundary. */
export const successorMidQuestion = (): TestQuestion[] => {
  let n: number;
  do {
    n = randInt(21, 96);
  } while (n % 10 === 0 || n % 10 === 9);
  const after = n + 1;
  return [
    {
      visual: <HundredChart marks={[{ n, tone: "a" }]} upTo={n} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What number comes right after ${n}?`, hint: "Count one more.", explain: `${n} + 1 = ${after}.`, answer: after },
    },
  ];
};

/** Decade-crossing, asked as "which ten" — distractor is the decade the
 *  student is LEAVING, targeting the misconception of not recognizing a new
 *  ten has started. */
export const decadeCrossChoiceQuestion = (): TestQuestion[] => {
  const d = randInt(1, 8);
  const start = d * 10 + 8;
  const next2 = start + 2;
  return [
    {
      visual: <HundredChart marks={[{ n: start, tone: "a" }]} upTo={start} />,
      difficulty: "medium",
      step: choice(
        { prompt: `Counting forward from ${start}, you land on ${next2}. Which ten is ${next2} in?`, hint: "A number ending in 9 is the LAST number of its ten.", explain: `${next2} is in the ${(d + 1) * 10}s — right after finishing the ${d * 10}s.` },
        `the ${(d + 1) * 10}s`,
        [`the ${d * 10}s`] // misconception: thinking the new decade hasn't started yet
      ),
    },
  ];
};

/** Decade-crossing, typed as a bare number — tests actually producing the
 *  digits across the boundary, below 100. */
export const decadeCrossNumberQuestion = (): TestQuestion[] => {
  const d = randInt(1, 8);
  const start = d * 10 + 8;
  const next = start + 1;
  return [
    {
      visual: <HundredChart marks={[{ n: start, tone: "a" }]} upTo={start} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What number comes right after ${start}?`, hint: "This crosses into a brand new ten.", explain: `${start} + 1 = ${next}.`, answer: next },
    },
  ];
};

/** The 99 -> 100 transition, as a choice — distractors are the two classic
 *  wrong "number names" for 100. */
export const cross100ChoiceQuestion = (): TestQuestion[] => {
  return [
    {
      visual: <HundredChart marks={[{ n: 99, tone: "a" }]} upTo={99} />,
      difficulty: "hard",
      step: choice(
        { prompt: "What number comes right after 99?", hint: "99 is the very last 2-digit number.", explain: "After 99 comes 100 — a brand new, third digit appears." },
        "100",
        ["ninety-ten", "ninety-eleven"] // the two classic wrong names for 100
      ),
    },
  ];
};

/** The 99 -> 100 -> 101 transition, typed — the hardest reachable case,
 *  always anchored right at the boundary. */
export const cross100NumberQuestion = (): TestQuestion[] => {
  const start = randInt(98, 99);
  const next = start + 1;
  return [
    {
      visual: <HundredChart marks={[{ n: start, tone: "a" }]} upTo={start} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What number comes right after ${start}?`, hint: "Don't repeat the 90s — you need a new, third digit here.", explain: `${start} + 1 = ${next}.`, answer: next },
    },
  ];
};

/** Reading/naming a number already past 100. */
export const range100to120Question = (): TestQuestion[] => {
  const n = randInt(100, 119);
  const next = n + 1;
  return [
    {
      visual: <HundredChart marks={[{ n, tone: "a" }]} upTo={n} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `What number comes right after ${n}?`, hint: "Counting past 100 works exactly the same as counting past any other number.", explain: `${n} + 1 = ${next}.`, answer: next },
    },
  ];
};

/** Reverse-direction: one LESS than a given number, anywhere in the 1-120 range. */
export const oneLessQuestion = (): TestQuestion[] => {
  const n = randInt(11, 120);
  const less = n - 1;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What number is one LESS than ${n}?`, hint: "One less means counting backward one step, not forward.", explain: `One less than ${n} is ${less}.`, answer: less },
    },
  ];
};

/** Generalization / true-false trap: does the "pattern repeats every decade"
 *  rule keep holding past 100, or was 99->100 a special exception? */
export const patternRepeatsTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: the \"count the ones, then start a new ten\" pattern keeps working exactly the same way, even past 100 (like 109 -> 110).",
          hint: "Check it: 29->30, 59->60, 109->110. Does it ever actually break?",
          explain: "Always true — the pattern never breaks, not even at 100. 109 -> 110 follows the exact same rule as 29 -> 30.",
        },
        "True",
        ["False"] // misconception: thinking the pattern changes or stops once you're past 100
      ),
    },
  ];
};

/** New TEN vs. new HUNDRED — the specific conflation this unit's CFU drills,
 *  with randomized numbers so the test doesn't just repeat the CFU verbatim. */
export const tenVsHundredChoiceQuestion = (): TestQuestion[] => {
  const n = randInt(101, 108);
  return [
    {
      visual: <HundredChart marks={[{ n, tone: "a" }]} upTo={n} />,
      difficulty: "hard",
      step: choice(
        { prompt: `Counting from ${n}, you reach ${Math.floor(n / 10) * 10 + 9} and then the next number. Is that next number a new TEN, or a new HUNDRED?`, hint: "A new hundred only starts at 200 — everything from 100-199 is the SAME hundred.", explain: "It's a new ten. You stay inside the 100s hundred all the way from 100 to 199." },
        "A new ten (still the same hundred)",
        ["A new hundred"] // misconception: treating every decade-crossing past 100 as a new hundred
      ),
    },
  ];
};

export const countingTo120Test: Unit["test"] = {
  questions: [
    successorFrom1Question,
    successorMidQuestion,
    decadeCrossChoiceQuestion,
    decadeCrossNumberQuestion,
    cross100ChoiceQuestion,
    cross100NumberQuestion,
    range100to120Question,
    oneLessQuestion,
    patternRepeatsTrueFalseQuestion,
    tenVsHundredChoiceQuestion,
  ],
  passScore: 9,
};
