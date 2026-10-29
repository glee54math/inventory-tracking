import { NumberLine } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
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
      step: { kind: "number", prompt: `Count on from ${a}: what is ${a} + ${b}?`, hint: `Start at ${a}, count on ${b} more.`, explain: `${a} + ${b} = ${a + b}.`, answer: a + b },
    },
  ];
};

/** Start-from-known-number vs. starting over from 1 — the first named misconception. */
export const startFromKnownChoiceQuestion = (): TestQuestion[] => {
  const a = randInt(6, 15);
  const b = randInt(1, 9 - (a % 9 === 0 ? 1 : 0));
  const safeB = Math.min(b, 20 - a) || 1;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        { prompt: `To add ${a} + ${safeB} by counting on, where should you START counting?`, hint: "Start from the number you already know — don't start over from the beginning.", explain: `Start at ${a}, then count on ${safeB} more — no need to start from 1.` },
        String(a),
        ["1"]
      ),
    },
  ];
};

/** Smaller addend shown first — tests NOT defaulting to the first number. */
export const countOnSmallFirstChoiceQuestion = (): TestQuestion[] => {
  let big = 0;
  let small = 0;
  do {
    big = randInt(6, 17);
    small = randInt(1, 9);
  } while (big + small > 20 || small >= big);
  return [
    {
      visual: <NumberLine min={0} max={20} points={[{ value: small, label: String(small), tone: "b" }, { value: big, label: String(big), tone: "a" }]} />,
      difficulty: "medium",
      step: choice(
        { prompt: `${small} + ${big} — which number should you start counting on from?`, hint: "The order they're written in doesn't matter — start from the BIGGER number.", explain: `Start at ${big} (the bigger number), even though ${small} was written first — fewer counts that way.` },
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
      step: { kind: "number", prompt: `What is ${small} + ${big}?`, hint: `Start counting on from ${big} (the bigger number), not ${small}.`, explain: `${small} + ${big} = ${total}.`, answer: total },
    },
  ];
};

/** True/false generalization: always start from the bigger number when counting on, regardless of written order. */
export const countOnOrderRuleQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: "True or false: when counting on to add two numbers, you should always start from the BIGGER number, even if it's written second.", hint: "Check an example: 4 + 9. Is starting at 9 still the smart move?", explain: "Always true — starting from the bigger number means fewer counts, no matter which order the numbers are written in." },
        "True",
        ["False"] // misconception: thinking you must start with whichever number is written first
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
      step: { kind: "number", prompt: `Count back from ${start}: what is ${start} − ${sub}?`, hint: `Count back ${sub} times from ${start}.`, explain: `${start} − ${sub} = ${start - sub}.`, answer: start - sub },
    },
  ];
};

/** Off-by-one in count-back — the SECOND named misconception, asked directly. */
export const countBackHowManyTimesChoiceQuestion = (): TestQuestion[] => {
  const sub = randInt(2, 8);
  const start = randInt(sub + 2, 20);
  const distractors = [String(sub - 1), String(sub + 1)].filter((d) => Number(d) >= 1 && Number(d) <= 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `To find ${start} − ${sub} by counting back, how many TOTAL times should you count back?`, hint: "The number of counts back always matches the number you're subtracting.", explain: `Subtracting ${sub} means counting back exactly ${sub} times — not one more, not one less.` },
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
      step: { kind: "number", prompt: `Count back from ${start}, crossing out of the teens: what is ${start} − ${sub}?`, hint: `Count back ${sub} times total from ${start}.`, explain: `${start} − ${sub} = ${start - sub}.`, answer: start - sub },
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
        { prompt: `Counting back from ${s} to subtract ${sub}, which sequence of numbers do you say?`, hint: "Count back exactly one number at a time, exactly the number of times you're subtracting.", explain: `${correct} — exactly ${sub} counts back, landing on ${s - sub}.` },
        correct,
        [oneShort, oneLong]
      ),
    },
  ];
};

/** True/false generalization: the count-back-matches-subtrahend rule holds
 *  even across a decade boundary, not just within one ten. */
export const countBackRuleQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: the number of times you count back to subtract always matches the number you're subtracting — even when you cross from the teens into single digits.", hint: "Try 13 − 4: does it still take exactly 4 counts back, even though you cross below 10?", explain: "Always true — crossing a boundary doesn't change the rule. Subtracting 4 always means counting back exactly 4 times." },
        "True",
        ["False"] // misconception: thinking crossing into single digits needs an extra (or one fewer) count
      ),
    },
  ];
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
    countBackRuleQuestion,
  ],
  passScore: 9,
};
