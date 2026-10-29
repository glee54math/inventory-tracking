import { TenFrameGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Equal Sign and Equations ----------
// 10 questions from 10 generators. Self-contained (no import from
// EqualSignAndEquations.tsx, and that file never imports back from here) —
// same convention as every other *Test.tsx in this app, since the unit file
// already imports this file's `equalSignAndEquationsTest` export, and an
// import the other way would be a circular import that throws at
// module-eval time (silently surfacing as "Level not found").

export const equalSignMeaningChoiceQuestion = (): TestQuestion[] => [
  {
    visual: null,
    difficulty: "easy",
    step: choice(
      { prompt: 'What does the "=" sign mean?', hint: "Think of a balance scale.", explain: '"=" means both sides have the exact same amount — not "the answer comes next."' },
      "Both sides equal the same amount",
      ['"The answer comes right after this"']
    ),
  },
];

/** ☐ = A + B — the "answer slot" is on the left. */
export const unknownOnLeftNumberQuestion = (): TestQuestion[] => {
  const a = randInt(1, 12);
  const b = randInt(1, 9);
  const total = Math.min(20, a + b);
  return [
    {
      visual: <TenFrameGroup value={total} tone="a" splitAt={a} tone2="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `☐ = ${a} + ${b}. What number goes in the blank?`, hint: "The blank being on the left doesn't change the math.", explain: `${a} + ${b} = ${total}, so ☐ = ${total}.`, answer: total },
    },
  ];
};

/** A + B = C + ☐ — an operation on BOTH sides. */
export const operationBothSidesNumberQuestion = (): TestQuestion[] => {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const total = Math.min(20, a + b);
  const c = randInt(1, Math.max(1, total - 1));
  const d = total - c;
  return [
    {
      visual: <TenFrameGroup value={total} tone="a" splitAt={a} tone2="b" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `${a} + ${b} = ${c} + ☐. What number goes in the blank?`, hint: `First find ${a} + ${b}, then figure out what plus ${c} gives the same total.`, explain: `${a} + ${b} = ${total}. ${total} − ${c} = ${d}.`, answer: d },
    },
  ];
};

/** The "backwards" trap, with the sum on the LEFT — a direct true/false check. */
export const backwardsEquationTrueFalseQuestion = (): TestQuestion[] => {
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const total = Math.min(20, a + b);
  return [
    {
      visual: <TenFrameGroup value={total} tone="a" splitAt={a} tone2="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: `Is ${total} = ${a} + ${b} true or false?`, hint: "It doesn't matter that the sum is written on the right of the number — just check that both sides match.", explain: `${a} + ${b} = ${total}, which matches the left side — true, even though it's "backwards" from the usual order.` },
        "True",
        ["False"] // misconception: rejecting a true equation just because it looks "backwards"
      ),
    },
  ];
};

/** Requires NO computation — just the equal-sign concept. */
export const trivialTrueFalseQuestion = (): TestQuestion[] => {
  const n = randInt(1, 20);
  return [
    {
      visual: <TenFrameGroup value={n} tone="a" />,
      difficulty: "easy",
      step: choice(
        { prompt: `Is ${n} = ${n} true or false?`, hint: "There's nothing to compute — look at both sides as they are.", explain: `${n} is ${n} — no computation needed, it's simply true.` },
        "True",
        ["False"] // misconception: assuming computation is always required to decide
      ),
    },
  ];
};

/** Deliberately false — tests actually checking rather than assuming. */
export const deliberateFalseQuestion = (): TestQuestion[] => {
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const trueTotal = a + b;
  let wrongTotal = trueTotal;
  while (wrongTotal === trueTotal) wrongTotal = Math.max(0, trueTotal + [-2, -1, 1, 2][randInt(0, 3)]);
  return [
    {
      visual: <TenFrameGroup value={Math.min(20, trueTotal)} tone="a" splitAt={a} tone2="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: `Is ${a} + ${b} = ${wrongTotal} true or false?`, hint: "Add the left side yourself — don't assume it's right just because it's written down.", explain: `${a} + ${b} = ${trueTotal}, not ${wrongTotal} — false.` },
        "False",
        ["True"] // misconception: assuming a written equation must be true
      ),
    },
  ];
};

/** Genuinely true, but requires actual computation — contrast with the trivial case. */
export const genuineTrueComputedQuestion = (): TestQuestion[] => {
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const total = a + b;
  return [
    {
      visual: <TenFrameGroup value={Math.min(20, total)} tone="a" splitAt={a} tone2="b" />,
      difficulty: "medium",
      step: choice(
        { prompt: `Is ${a} + ${b} = ${total} true or false?`, hint: "Add the left side and compare it to the right side.", explain: `${a} + ${b} = ${total}, which matches — true.` },
        "True",
        ["False"]
      ),
    },
  ];
};

/** ☐ + B = C — unknown is the FIRST addend. */
export const findUnknownFirstAddendNumberQuestion = (): TestQuestion[] => {
  const b = randInt(1, 15);
  const c = Math.min(20, b + randInt(1, 9));
  const unknown = c - b;
  return [
    {
      visual: <TenFrameGroup value={c} tone="a" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `☐ + ${b} = ${c}. What number goes in the blank?`, hint: "The blank is the very first thing — not the total.", explain: `${c} − ${b} = ${unknown}.`, answer: unknown },
    },
  ];
};

/** A + ☐ = C — unknown is the SECOND addend. */
export const findUnknownSecondAddendNumberQuestion = (): TestQuestion[] => {
  const a = randInt(1, 15);
  const c = Math.min(20, a + randInt(1, 9));
  const unknown = c - a;
  return [
    {
      visual: <TenFrameGroup value={c} tone="a" splitAt={a} tone2="b" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${a} + ☐ = ${c}. What number goes in the blank?`, hint: "The blank is the second addend — not the total.", explain: `${c} − ${a} = ${unknown}.`, answer: unknown },
    },
  ];
};

/** A - ☐ = C — unknown is the amount subtracted. */
export const findUnknownSubtractionNumberQuestion = (): TestQuestion[] => {
  const a = randInt(5, 19);
  const c = randInt(0, a - 1);
  const unknown = a - c;
  return [
    {
      visual: <TenFrameGroup value={a} tone="c" splitAt={c} tone2="b" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `${a} − ☐ = ${c}. What number goes in the blank?`, hint: "The blank is the amount being subtracted — not the final result.", explain: `${a} − ${c} = ${unknown}.`, answer: unknown },
    },
  ];
};

export const equalSignAndEquationsTest: Unit["test"] = {
  questions: [
    equalSignMeaningChoiceQuestion,
    unknownOnLeftNumberQuestion,
    operationBothSidesNumberQuestion,
    backwardsEquationTrueFalseQuestion,
    trivialTrueFalseQuestion,
    deliberateFalseQuestion,
    genuineTrueComputedQuestion,
    findUnknownFirstAddendNumberQuestion,
    findUnknownSecondAddendNumberQuestion,
    findUnknownSubtractionNumberQuestion,
  ],
  passScore: 9,
};
