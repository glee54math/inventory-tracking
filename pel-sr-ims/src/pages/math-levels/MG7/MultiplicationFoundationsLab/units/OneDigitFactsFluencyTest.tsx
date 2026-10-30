import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies — see WhatMultiplicationMeansTest.tsx's comment on why
// *Test.tsx files never import from their paired unit file.
export const ANCHOR_FACTORS = [0, 1, 2, 5, 10];
export const HARD_FACTORS = [6, 7, 8, 9];
const ANCHOR_STRATEGY: Record<number, string> = {
  0: "Anything times 0 is 0.",
  1: "Anything times 1 stays the same.",
  2: "Double the other number.",
  5: "Half of multiplying by 10.",
  10: "Just add a zero to the other number.",
};

/** Two different factors from 6-9 (no squares) — the hardest, most-forgotten facts. */
export function hardPair(): [number, number] {
  const a = pick(HARD_FACTORS);
  let b = pick(HARD_FACTORS);
  while (b === a) b = pick(HARD_FACTORS);
  return [a, b];
}

/** Near-miss (adjacent-fact) products of a × b: one more/less group of
 *  either factor. Every one differs from a × b itself (a, b ≥ 1), and the
 *  "one more group of a" vs "one more group of b" pair only coincide when
 *  a === b, which hardPair() excludes — deduped anyway for safety. */
export function nearMissProducts(a: number, b: number): number[] {
  const p = a * b;
  return Array.from(new Set([a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b])).filter((v) => v !== p && v > 0);
}

// Q1 — easy: anchor fact (0, 1, 2, 5, 10)
export function anchorFactQuestion(): TestQuestion[] {
  const anchor = pick(ANCHOR_FACTORS);
  const other = randInt(0, 9);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${anchor} × ${other}?`, hint: ANCHOR_STRATEGY[anchor], explain: `${anchor} × ${other} = ${anchor * other}.`, answer: anchor * other },
    },
  ];
}

// Q2 — easy: doubling fact (3, 4)
export function doublingFactQuestion(): TestQuestion[] {
  const f = pick([3, 4]);
  const other = randInt(2, 9);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `What is ${f} × ${other}?`,
        hint: f === 4 ? "Double, then double again." : "Double, then add one more group.",
        explain: `${f} × ${other} = ${f * other}.`,
        answer: f * other,
      },
    },
  ];
}

// Q3 — medium: hard fact (6-9, not a square)
export function hardFactQuestion(): TestQuestion[] {
  const [a, b] = hardPair();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${a} × ${b}?`, hint: `One less group: ${a} × ${b - 1} = ${a * (b - 1)}. Add one more ${a}.`, explain: `${a} × ${b} = ${a * b}.`, answer: a * b },
    },
  ];
}

// Q4 — medium: square fact
export function squareFactQuestion(): TestQuestion[] {
  const n = randInt(2, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is ${n} × ${n}?`, hint: `${n} groups of ${n}.`, explain: `${n} × ${n} = ${n * n}.`, answer: n * n },
    },
  ];
}

// Q5 — hard, choice: hard fact with near-miss distractors.
// MISCONCEPTION TARGETED: adjacent-fact collisions (e.g. 6 × 7 = 42 vs.
// 6 × 8 = 48) — every distractor is the product of a neighboring fact, one
// group more or less, never a random wrong number.
export function hardFactNearMissChoiceQuestion(): TestQuestion[] {
  const [a, b] = hardPair();
  const distractors = pick([0, 1]) === 0 ? nearMissProducts(a, b).slice(0, 3) : nearMissProducts(a, b).slice(-3);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `${a} × ${b} = ?`, hint: `Careful — the neighboring facts are close. ${a} × ${b - 1} = ${a * (b - 1)}; add one more ${a}.`, explain: `${a} × ${b} = ${a * b}. The other choices are the answers to NEIGHBORING facts.` },
        String(a * b),
        distractors.map(String)
      ),
    },
  ];
}

// Q6 — medium, choice: which fact gives this product?
// MISCONCEPTION TARGETED: adjacent-fact confusion run backwards — the
// distractor facts are one group away (a × (b+1), (a+1) × b), so their
// products are always different from the target, but they LOOK almost right.
export function whichFactQuestion(): TestQuestion[] {
  const [a, b] = hardPair();
  const p = a * b;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Which fact equals ${p}?`, hint: "Check each one — two of them are neighbors of the right fact.", explain: `${a} × ${b} = ${p}. ${a} × ${b + 1} = ${a * (b + 1)} and ${a + 1} × ${b} = ${(a + 1) * b}.` },
        `${a} × ${b}`,
        [`${a} × ${b + 1}`, `${a + 1} × ${b}`]
      ),
    },
  ];
}

// Q7 — hard: use a square fact as an anchor for its neighbor
export function squareAnchorQuestion(): TestQuestion[] {
  const n = randInt(2, 9);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `You know ${n} × ${n} = ${n * n}. Use it to find ${n} × ${n + 1}.`,
        hint: `${n} × ${n + 1} is one more group of ${n} than ${n} × ${n}.`,
        explain: `${n * n} + ${n} = ${n * (n + 1)}.`,
        answer: n * (n + 1),
      },
    },
  ];
}

// Q8 — medium, choice: which strategy matches an anchor factor
// MISCONCEPTION TARGETED: mixing up the ×5 and ×10 shortcuts (or ×0 vs ×1) —
// distractors are the OTHER anchors' strategies.
export function anchorStrategyQuestion(): TestQuestion[] {
  const anchor = pick(ANCHOR_FACTORS);
  const others = ANCHOR_FACTORS.filter((a) => a !== anchor);
  const distractors = [others[randInt(0, others.length - 1)]];
  while (distractors.length < 2) {
    const d = others[randInt(0, others.length - 1)];
    if (!distractors.includes(d)) distractors.push(d);
  }
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Which strategy works for multiplying by ${anchor}?`, hint: `Try it on a small example: ${anchor} × 3.`, explain: `For ×${anchor}: ${ANCHOR_STRATEGY[anchor]}` },
        ANCHOR_STRATEGY[anchor],
        distractors.map((d) => ANCHOR_STRATEGY[d])
      ),
    },
  ];
}

// Q9 — hard: two adjacent facts at once (ratio-style two-box step)
export function adjacentPairQuestion(): TestQuestion[] {
  const a = randInt(6, 9);
  const b = randInt(5, 8);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "ratio",
        tones: "none",
        labels: [`${a} × ${b}`, `${a} × ${b + 1}`],
        frame: ["", "and", ""],
        prompt: `Find both: ${a} × ${b} and ${a} × ${b + 1}.`,
        hint: `They're exactly ${a} apart.`,
        explain: `${a} × ${b} = ${a * b}, and ${a} × ${b + 1} = ${a * (b + 1)} — ${a} more.`,
        answer: [a * b, a * (b + 1)],
      },
    },
  ];
}

// Q10 — hard, choice: catch a friend's near-miss mistake
// MISCONCEPTION TARGETED: the classic adjacent-fact swap (e.g. "7 × 8 = 54",
// which is really 6 × 9). The friend's claimed answer is always a neighboring
// fact's product.
export function catchTheMistakeQuestion(): TestQuestion[] {
  const [a, b] = hardPair();
  const claimed = pick(nearMissProducts(a, b));
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `A friend says ${a} × ${b} = ${claimed}. Are they right?`, hint: `Work it out: ${a} × ${b - 1} = ${a * (b - 1)}, plus one more ${a}.`, explain: `${a} × ${b} = ${a * b}, not ${claimed} — ${claimed} is the answer to a neighboring fact.` },
        `No — ${a} × ${b} = ${a * b}`,
        ["Yes, that's right", `No — ${a} × ${b} = ${a * b + 1}`]
      ),
    },
  ];
}

export const oneDigitFactsFluencyTest: Unit["test"] = {
  questions: [
    anchorFactQuestion,
    doublingFactQuestion,
    hardFactQuestion,
    squareFactQuestion,
    hardFactNearMissChoiceQuestion,
    whichFactQuestion,
    squareAnchorQuestion,
    anchorStrategyQuestion,
    adjacentPairQuestion,
    catchTheMistakeQuestion,
  ],
  passScore: 9,
};
