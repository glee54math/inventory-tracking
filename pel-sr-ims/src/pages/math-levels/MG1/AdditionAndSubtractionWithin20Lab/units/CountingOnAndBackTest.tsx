import { NumberLine } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, numberBlank, type SentenceStep, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Counting On and Counting Back ----------
// 10 questions from 10 generators. Self-contained (no import from
// CountingOnAndBack.tsx, and that file never imports back from here) — same
// convention as every other *Test.tsx in this app, since the unit file
// already imports this file's `countingOnAndBackTest` export, and an import
// the other way would be a circular import that throws at module-eval time
// (silently surfacing as "Level not found").

/** Direct count-on, larger addend shown first — the baseline case. */
export const countOnLargerNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(5, 17);
    b = randInt(1, 9);
  } while (a + b > 20 || a < b);
  return [
    {
      visual: <NumberLine min={0} max={20} points={[{ value: a, label: "start", tone: "a" }]} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `${a} + ${b}. Count on from ${a}. What is the total?`, hint: `Start at ${a}, count on ${b} more.`, explain: `${a} + ${b} = ${a + b}.`, answer: a + b },
    },
  ];
};

/** Start-from-known-number vs. starting over from 1 — the first named misconception. */
export const startFromKnownChoiceQuestion = (): TestQuestion[] => {
  // b is smaller than a, so "start at a" is also "start at the bigger number".
  const a = randInt(6, 15);
  const b = randInt(1, Math.min(a - 1, 20 - a, 9));
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        { prompt: `${a} + ${b}. Count on. Where do you start?`, hint: "Don't start at 1. Count on.", explain: `Start at ${a}. Then count on ${b}.` },
        String(a),
        ["1"] // misconception: starting over from 1
      ),
    },
  ];
};

/** Smaller addend shown first — tests NOT defaulting to the first number.
 *  Its own pool (bigger number 6–9), apart from countOnOrderRuleQuestion's teens. */
export const countOnSmallFirstChoiceQuestion = (): TestQuestion[] => {
  const big = randInt(6, 9);
  const small = randInt(1, big - 1);
  return [
    {
      visual: <NumberLine min={0} max={20} points={[{ value: small, label: String(small), tone: "b" }, { value: big, label: String(big), tone: "a" }]} />,
      difficulty: "medium",
      step: choice(
        { prompt: `${small} + ${big}. Which number do you start at?`, hint: "Start at the bigger number.", explain: `Start at ${big}. It is bigger. You count less.` },
        String(big),
        [String(small)] // misconception: always starting from the first number written
      ),
    },
  ];
};

/** Smaller addend shown first, graded as a typed total — confirms the right
 *  answer is reached even when the ordering trick is in play. */
export const countOnSmallFirstNumberQuestion = (): TestQuestion[] => {
  let big = 0;
  let small = 0;
  do {
    big = randInt(6, 17);
    small = randInt(1, 9);
  } while (big + small > 20 || small >= big);
  const total = big + small;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is ${small} + ${big}?`, hint: "Start at the bigger number.", explain: `${small} + ${big} = ${total}.`, answer: total },
    },
  ];
};

/** "Start at the bigger number" on one new example (no true/false rule
 *  statement): a small number first, a teen second. Its own pool, apart from
 *  countOnSmallFirstChoiceQuestion's 6–9. */
export const countOnOrderRuleQuestion = (): TestQuestion[] => {
  const big = randInt(10, 16);
  const small = randInt(2, Math.min(4, 20 - big));
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `${small} + ${big}. Which number do you start at?`, hint: "Start at the bigger number.", explain: `Start at ${big}. It is bigger. You count less.` },
        String(big),
        [String(small)] // misconception: starting with whichever number is written first
      ),
    },
  ];
};

/** Direct count-back, no decade crossing — isolates the mechanics. */
export const countBackSimpleNumberQuestion = (): TestQuestion[] => {
  let start = 0;
  let sub = 0;
  do {
    start = randInt(5, 20);
    sub = randInt(1, 4);
  } while (start - sub < 0 || Math.floor(start / 10) !== Math.floor((start - sub) / 10));
  return [
    {
      visual: <NumberLine min={0} max={20} points={[{ value: start, label: "start", tone: "c" }]} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `${start} − ${sub}. Count back from ${start}. What is left?`, hint: `Count back ${sub} ${sub === 1 ? "time" : "times"} from ${start}.`, explain: `${start} − ${sub} = ${start - sub}.`, answer: start - sub },
    },
  ];
};

/** Off-by-one in count-back — the SECOND named misconception, asked
 *  directly. Its own pool: the count stays in one ten (countBackSayNumbersQuestion
 *  asks the same thing going below 10). */
export const countBackHowManyTimesChoiceQuestion = (): TestQuestion[] => {
  let sub = 0;
  let start = 0;
  do {
    sub = randInt(2, 8);
    start = randInt(sub + 2, 20);
  } while (Math.floor(start / 10) !== Math.floor((start - sub) / 10));
  const distractors = [String(sub - 1), String(sub + 1)].filter((d) => Number(d) >= 1 && Number(d) <= 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `${start} − ${sub}. How many times do you count back?`, hint: "Hop back once for each one you take away.", explain: `Take away ${sub}. Count back ${sub} times.` },
        String(sub),
        distractors
      ),
    },
  ];
};

/** Decade-crossing count-back — the hard bucket, graded as a typed answer. */
export const countBackCrossNumberQuestion = (): TestQuestion[] => {
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 19);
    sub = randInt(2, 9);
  } while (start - sub < 0 || start - sub >= 10);
  return [
    {
      visual: <NumberLine min={0} max={20} points={[{ value: start, label: "start", tone: "c" }]} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `Count back to find ${start} − ${sub}. You will go below 10.`, hint: `Count back ${sub} times from ${start}.`, explain: `${start} − ${sub} = ${start - sub}.`, answer: start - sub },
    },
  ];
};

/** Full-sequence recognition for a decade-crossing count-back — the
 *  distractor is one count too short (the off-by-one mistake, concretely). */
export const countBackCrossSequenceChoiceQuestion = (): TestQuestion[] => {
  const sub = randInt(3, 5);
  let s = randInt(11, 19);
  while (s - sub >= 10 || s - sub < 0) s = randInt(11, 19);
  const seq: number[] = [];
  for (let i = 1; i <= sub; i++) seq.push(s - i);
  const correct = seq.join(", ");
  const oneShort = seq.slice(0, sub - 1).join(", "); // misconception: stopping one count too early
  const oneLong = [...seq, s - sub - 1].join(", "); // misconception: counting back one extra time
  return [
    {
      visual: <NumberLine min={0} max={20} points={[{ value: s, label: "start", tone: "c" }]} />,
      difficulty: "hard",
      step: choice(
        { prompt: `${s} − ${sub}. Count back. Which numbers do you say?`, hint: "Count back one at a time.", explain: `${correct}. That is ${sub} numbers. You land on ${s - sub}.` },
        correct,
        [oneShort, oneLong]
      ),
    },
  ];
};

/** Count back below 10 and say every number, typed (C2-08: replaces a second
 *  "How many times do you count back?" pick). One box per number said, as in
 *  Practice, so stopping one short or saying the start is the off-by-one. */
export const countBackSayNumbersQuestion = (): TestQuestion[] => {
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 16);
    sub = randInt(2, 6);
  } while (start - sub >= 10);
  const nums = Array.from({ length: sub }, (_, k) => start - (k + 1));
  const blanks = nums.map((n) => numberBlank(n));
  const step: SentenceStep = {
    kind: "sentence",
    prompt: `Count back ${sub} from ${start}. Say the numbers.`,
    hint: "Count back one at a time.",
    explain: `${nums.join(", ")}. You land on ${start - sub}.`,
    parts: ["", ", ", nums.length > 2 ? ", " : ""],
    blanks: [blanks[0], blanks[1]],
    more: blanks.slice(2).map((b, k) => ({ blank: b, after: k + 3 < nums.length ? ", " : "" })),
  };
  return [{ visual: <NumberLine min={0} max={20} points={[{ value: start, label: "start", tone: "c" }]} />, difficulty: "hard", step }];
};

export const countingOnAndBackTest: Unit["test"] = {
  questions: [
    countOnLargerNumberQuestion,
    startFromKnownChoiceQuestion,
    countOnSmallFirstChoiceQuestion,
    countOnSmallFirstNumberQuestion,
    countOnOrderRuleQuestion,
    countBackSimpleNumberQuestion,
    countBackHowManyTimesChoiceQuestion,
    countBackCrossNumberQuestion,
    countBackCrossSequenceChoiceQuestion,
    countBackSayNumbersQuestion,
  ],
  passScore: 9,
};
