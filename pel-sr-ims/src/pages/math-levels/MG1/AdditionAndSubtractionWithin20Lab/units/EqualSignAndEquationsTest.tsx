import { TenFrameGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Equal Sign and Number Sentences ----------
// 10 questions from 10 generators. Self-contained (no import from
// EqualSignAndEquations.tsx, and that file never imports back from here) —
// same convention as every other *Test.tsx in this app, since the unit file
// already imports this file's `equalSignAndEquationsTest` export, and an
// import the other way would be a circular import that throws at
// module-eval time (silently surfacing as "Level not found").
// Pictures show only the numbers given (no totals, no colored missing part).

/** "Is this true?" with the number sentence spoken as "the same as" (E1-29). */
const isItTrue = (eq: string) => <span data-tts-say={`Is ${eq.replace(" = ", " the same as ").replace(/\+/g, "plus").replace(/−/g, "minus")}?`}>{`${eq}. Is it true?`}</span>;
const YES = "Yes, true";
const NO = "No, false";

/** Two given numbers on their own ten-frames. */
const pair = (a: number, b: number) => (
  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
    <TenFrameGroup value={a} tone="a" />
    <TenFrameGroup value={b} tone="b" />
  </div>
);

/** A number from lo..hi that isn't in `avoid`. */
function otherThan(lo: number, hi: number, avoid: number[]): number {
  const pool = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((n) => !avoid.includes(n));
  return pool[randInt(0, pool.length - 1)];
}

export const equalSignMeaningChoiceQuestion = (): TestQuestion[] => [
  {
    visual: null,
    difficulty: "easy",
    step: choice(
      { prompt: "What does = mean?", hint: "= means the same as.", explain: "= means both sides are the same amount." },
      "Both sides are the same amount",
      ["The answer comes next"] // misconception: = means "the answer goes next"
    ),
  },
];

/** ☐ = A + B — the box comes first. */
export const unknownOnLeftNumberQuestion = (): TestQuestion[] => {
  const a = randInt(1, 11);
  const b = randInt(1, Math.min(9, 20 - a));
  const total = a + b;
  return [
    {
      visual: pair(a, b),
      difficulty: "medium",
      step: { kind: "number", prompt: `☐ = ${a} + ${b}. What number goes in the box?`, hint: "The box can come first.", explain: `${a} + ${b} = ${total}, so ☐ = ${total}.`, answer: total },
    },
  ];
};

/** A + B = C + ☐ — adding on both sides. */
export const operationBothSidesNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } while (a + b > 18);
  const total = a + b;
  const c = otherThan(1, total - 1, [a, b]);
  const d = total - c;
  return [
    {
      visual: pair(a, b),
      difficulty: "hard",
      step: { kind: "number", prompt: `${a} + ${b} = ${c} + ☐. What number goes in the box?`, hint: "Add up the first side. Make the other side match.", explain: `${a} + ${b} = ${total}. ${total} − ${c} = ${d}.`, answer: d },
    },
  ];
};

/** The "backwards" trap, with the total first — a direct "is it true?" check. */
export const backwardsEquationTrueFalseQuestion = (): TestQuestion[] => {
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const total = a + b;
  return [
    {
      visual: pair(a, b),
      difficulty: "medium",
      step: choice(
        { prompt: isItTrue(`${total} = ${a} + ${b}`), hint: "The total can come first. Do both sides match?", explain: `${a} + ${b} = ${total}. It is true, with the total first.` },
        YES,
        [NO] // misconception: rejecting a true number sentence because the total comes first
      ),
    },
  ];
};

/** Needs no adding at all — just what = means. */
export const trivialTrueFalseQuestion = (): TestQuestion[] => {
  const n = randInt(1, 20);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        { prompt: isItTrue(`${n} = ${n}`), hint: "Look at both sides. Are they the same?", explain: `${n} is the same as ${n}. It is true.` },
        YES,
        [NO] // misconception: thinking there must be adding to do
      ),
    },
  ];
};

/** Deliberately false — tests actually checking rather than assuming. */
export const deliberateFalseQuestion = (): TestQuestion[] => {
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const trueTotal = a + b;
  const wrongTotal = trueTotal + [-2, -1, 1, 2][randInt(0, 3)];
  return [
    {
      visual: pair(a, b),
      difficulty: "medium",
      step: choice(
        { prompt: isItTrue(`${a} + ${b} = ${wrongTotal}`), hint: "Add it up. Is it really true?", explain: `${a} + ${b} = ${trueTotal}, not ${wrongTotal}. It is false.` },
        NO,
        [YES] // misconception: a written number sentence must be true
      ),
    },
  ];
};

/** Adding on both sides, or a take-away sentence, to judge (1.OA.7); true or false, decided first. */
export const bothSidesTrueFalseQuestion = (): TestQuestion[] => {
  const isTrue = Math.random() < 0.5;
  let eq = "";
  let explain = "";
  if (Math.random() < 0.5) {
    const a = randInt(1, 9);
    const b = randInt(1, 9);
    const t = a + b;
    // A false other side is off by one, and at most 18 so it splits into two numbers of 9 or less.
    const near = [t - 1, t + 1].filter((w) => w <= 18);
    const other = isTrue ? t : near[randInt(0, near.length - 1)];
    const c = randInt(Math.max(0, other - 9), Math.min(9, other));
    eq = `${a} + ${b} = ${c} + ${other - c}`;
    explain = isTrue ? `Both sides are ${t}. It is true.` : `${a} + ${b} = ${t}. ${c} + ${other - c} = ${other}. It is false.`;
  } else {
    const a = randInt(5, 20);
    const b = randInt(1, Math.min(9, a - 1));
    const t = a - b;
    const shown = isTrue ? t : t + (t < 20 ? 1 : -1);
    eq = `${shown} = ${a} − ${b}`;
    explain = isTrue ? `${a} − ${b} = ${t}. It is true.` : `${a} − ${b} = ${t}, not ${shown}. It is false.`;
  }
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice({ prompt: isItTrue(eq), hint: "Find each side. Do they match?", explain }, isTrue ? YES : NO, [isTrue ? NO : YES]),
    },
  ];
};

/** ☐ + B = C — the box is the FIRST number. */
export const findUnknownFirstAddendNumberQuestion = (): TestQuestion[] => {
  const b = randInt(1, 15);
  const unknown = randInt(1, Math.min(9, 20 - b));
  const c = b + unknown;
  return [
    {
      visual: <TenFrameGroup value={c} tone="a" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `☐ + ${b} = ${c}. What number goes in the box?`, hint: "The box is the first number, not the total.", explain: `${c} − ${b} = ${unknown}.`, answer: unknown },
    },
  ];
};

/** A + ☐ = C — the box is the SECOND number. */
export const findUnknownSecondAddendNumberQuestion = (): TestQuestion[] => {
  const a = randInt(1, 15);
  const unknown = randInt(1, Math.min(9, 20 - a));
  const c = a + unknown;
  return [
    {
      visual: <TenFrameGroup value={c} tone="a" />,
      difficulty: "medium",
      step: { kind: "number", prompt: `${a} + ☐ = ${c}. What number goes in the box?`, hint: "The box is the second number, not the total.", explain: `${c} − ${a} = ${unknown}.`, answer: unknown },
    },
  ];
};

/** A − ☐ = C — the box is the number you take away. */
export const findUnknownSubtractionNumberQuestion = (): TestQuestion[] => {
  const a = randInt(5, 19);
  const unknown = randInt(1, Math.min(9, a));
  const c = a - unknown;
  return [
    {
      visual: <TenFrameGroup value={a} tone="c" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `${a} − ☐ = ${c}. What number goes in the box?`, hint: "The box is the number you take away.", explain: `${a} − ${c} = ${unknown}.`, answer: unknown },
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
    bothSidesTrueFalseQuestion,
    findUnknownFirstAddendNumberQuestion,
    findUnknownSecondAddendNumberQuestion,
    findUnknownSubtractionNumberQuestion,
  ],
  passScore: 9,
};
