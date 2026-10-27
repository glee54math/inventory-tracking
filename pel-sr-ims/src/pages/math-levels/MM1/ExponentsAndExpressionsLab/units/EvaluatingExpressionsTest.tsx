import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Evaluating Expressions & Order of Operations ----------
// 14 single-question generators across the 9 Practice buckets: plain
// substitution, substitution with an exponent, multi-step order of
// operations with no parentheses, real-world formula substitution (V=s³,
// A=6s², including a fractional s=1/2 case the plan specifically calls
// for), substituting multiple variables at once, parentheses-first,
// division ranking with multiplication, same-rank left-to-right chains, and
// a hardest-tier question combining parentheses + exponent + multiply +
// divide + subtract. Self-contained — no import from EvaluatingExpressions.tsx
// (see ExponentsTest.tsx's comment).

/** 3(a) substitute into a simple expression, no exponent. */
export const simpleSubQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const a = randInt(2, 9);
  const b = randInt(1, 20);
  const x = randInt(2, 12);
  const value = a * x + b;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `Evaluate ${a}x + ${b} when x = ${x}.`,
        hint: `Substitute ${x} for x first: ${a}(${x}) + ${b}.`,
        explain: `${a}(${x}) + ${b} = ${a * x} + ${b} = ${value}.`,
        answer: value,
      },
    },
  ];
};

/** 3(b) substitute into an expression with an exponent present. */
export const subWithExponentQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const b = randInt(1, 10);
  const x = randInt(2, 8);
  const square = x * x;
  const value = square + b;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `Evaluate x² + ${b} when x = ${x}.`,
        hint: `Substitute first: ${x}² + ${b}. Evaluate the exponent before adding.`,
        explain: `${x}² = ${square}, so ${square} + ${b} = ${value}.`,
        answer: value,
      },
    },
  ];
};

/** 3(c) multi-step order of operations, no parentheses, numeric only. */
export const multiStepQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const a = randInt(2, 9);
  const b = randInt(2, 6);
  const c = randInt(1, 15);
  const square = b * b;
  const product = a * square;
  const total = product + c;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `Evaluate ${c} + ${a} × ${b}².`,
        hint: `Exponent first (${b}² = ${square}), then multiply by ${a}, then add ${c}.`,
        explain: `${b}² = ${square}; ${a} × ${square} = ${product}; ${c} + ${product} = ${total}.`,
        answer: total,
      },
    },
  ];
};

/** 3(d) real-world formula substitution — V = s³ and A = 6s², including a
 *  fractional s = 1/2 case. */
export const formulaQuestion = (kind: "volume" | "surfaceArea", sIsFraction: boolean, difficulty: "medium" | "hard"): TestQuestion[] => {
  if (sIsFraction) {
    if (kind === "volume") {
      return [
        {
          visual: null,
          difficulty,
          step: {
            kind: "number",
            prompt: `A cube has side length s = 1/2. Using V = s³, what is the cube's volume?`,
            hint: `(1/2)³ = (1/2) × (1/2) × (1/2).`,
            explain: `V = s³ = (1/2)³ = 1/8.`,
            answer: 1 / 8,
            frac: true,
            fracAnswer: [1, 8],
          },
        },
      ];
    }
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "number",
          prompt: `A cube has side length s = 1/2. Using A = 6s², what is the cube's total surface area?`,
          hint: `First find s² = (1/2)² = 1/4, then multiply by 6.`,
          explain: `A = 6s² = 6 × 1/4 = 3/2.`,
          answer: 1.5,
          frac: true,
          fracAnswer: [3, 2],
        },
      },
    ];
  }
  const s = randInt(2, 6);
  if (kind === "volume") {
    const value = s * s * s;
    return [
      {
        visual: null,
        difficulty,
        step: { kind: "number", prompt: `A cube has side length s = ${s}. Using V = s³, what is the cube's volume?`, hint: `s³ = ${s} × ${s} × ${s}.`, explain: `V = s³ = ${s}³ = ${value}.`, answer: value },
      },
    ];
  }
  const value = 6 * s * s;
  return [
    {
      visual: null,
      difficulty,
      step: { kind: "number", prompt: `A cube has side length s = ${s}. Using A = 6s², what is the cube's total surface area?`, hint: `s² = ${s * s}, then multiply by 6.`, explain: `A = 6s² = 6 × ${s * s} = ${value}.`, answer: value },
    },
  ];
};

/** 3(e) multiple variables substituted at once. */
export const multiVariableQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const a = randInt(2, 8);
  const b = randInt(2, 8);
  const x = randInt(2, 10);
  const y = randInt(2, 10);
  const value = a * x + b * y;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `Evaluate ${a}x + ${b}y when x = ${x} and y = ${y}.`,
        hint: `Substitute both values first: ${a}(${x}) + ${b}(${y}).`,
        explain: `${a}(${x}) = ${a * x}; ${b}(${y}) = ${b * y}; ${a * x} + ${b * y} = ${value}.`,
        answer: value,
      },
    },
  ];
};

/** The order-of-operations trap, as a standalone true/false question. */
export const leftToRightTrapQuestion = (): TestQuestion[] => [
  {
    visual: null,
    difficulty: "hard",
    step: choice(
      {
        prompt: `True or False: 3 + 4 × 2 should be evaluated strictly left to right (add first, then multiply).`,
        hint: `3 + 4 × 2 — does multiplication outrank addition, regardless of which comes first in the expression?`,
        explain: `False — multiplication is always done before addition, no matter the order they're written in: 3 + 4 × 2 = 3 + 8 = 11, not (3+4) × 2 = 14.`,
      },
      "False",
      ["True"]
    ),
  },
];

/** 3(f) parentheses are simplified before anything outside them. */
export const parensBasicQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = randInt(2, 12);
  const sum = a + b;
  const total = sum * c;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `Evaluate (${a} + ${b}) × ${c}.`,
        hint: `Parentheses are always simplified first: ${a} + ${b} = ${sum}, then multiply by ${c}.`,
        explain: `${a} + ${b} = ${sum}; ${sum} × ${c} = ${total}.`,
        answer: total,
      },
    },
  ];
};

/** 3(g) division ranks with multiplication, not addition. */
export const divisionComboQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const c = randInt(2, 6);
  const q = randInt(2, 9);
  const b = c * q;
  const a = randInt(1, 20);
  const total = a + q;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `Evaluate ${a} + ${b} ÷ ${c}.`,
        hint: `Division ranks with multiplication — it happens before addition: ${b} ÷ ${c} = ${q}.`,
        explain: `${b} ÷ ${c} = ${q}; ${a} + ${q} = ${total}.`,
        answer: total,
      },
    },
  ];
};

/** 3(h) multiplication and division are equal rank — resolved left to right. */
export const multDivChainQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const b = randInt(2, 6);
  const m = randInt(2, 6);
  const a = b * m;
  const c = randInt(2, 9);
  const quotient = m;
  const total = quotient * c;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `Evaluate ${a} ÷ ${b} × ${c}.`,
        hint: `Division and multiplication rank equally — work left to right: ${a} ÷ ${b} = ${quotient} first.`,
        explain: `${a} ÷ ${b} = ${quotient}; ${quotient} × ${c} = ${total}.`,
        answer: total,
      },
    },
  ];
};

/** 3(i) hardest tier — parentheses, exponent, multiply, divide, AND subtract in one expression. */
export const fullPemdasQuestion = (): TestQuestion[] => {
  const a = randInt(2, 6);
  const b = randInt(2, 6);
  const c = randInt(2, 6);
  const sum = b + c;
  const sq = sum * sum;
  const product = a * sq;
  const e = randInt(2, 6);
  const k = randInt(2, 9);
  const d = e * k;
  const quotient = k;
  const total = product - quotient;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `Evaluate ${a} × (${b} + ${c})² − ${d} ÷ ${e}.`,
        hint: `Parentheses first (${b}+${c}=${sum}), then the exponent (${sum}²=${sq}), then multiply (${a}×${sq}=${product}) and divide (${d}÷${e}=${quotient}), then subtract.`,
        explain: `${b} + ${c} = ${sum}; ${sum}² = ${sq}; ${a} × ${sq} = ${product}; ${d} ÷ ${e} = ${quotient}; ${product} − ${quotient} = ${total}.`,
        answer: total,
      },
    },
  ];
};

export const evaluatingExpressionsTest: Unit["test"] = {
  questions: [
    () => simpleSubQuestion("easy"),
    () => simpleSubQuestion("medium"),
    () => subWithExponentQuestion("medium"),
    () => subWithExponentQuestion("hard"),
    () => multiStepQuestion("medium"),
    () => multiStepQuestion("hard"),
    () => formulaQuestion("volume", false, "medium"),
    () => formulaQuestion("surfaceArea", true, "hard"), // the fractional s=1/2 case, as required
    () => multiVariableQuestion("medium"),
    leftToRightTrapQuestion,
    () => parensBasicQuestion("medium"),
    () => divisionComboQuestion("medium"),
    () => multDivChainQuestion("hard"),
    fullPemdasQuestion,
  ],
  passScore: 13,
};
