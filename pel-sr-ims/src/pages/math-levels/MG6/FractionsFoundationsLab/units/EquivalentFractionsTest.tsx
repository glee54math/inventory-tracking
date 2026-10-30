import { EquivalentBars, StackedNumberLines } from "../diagrams";
import { pick } from "../../../shared/lib/math";
import { choice, selectBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies — see WhatAFractionIsTest.tsx's comment on why *Test.tsx
// files never import back from their paired main unit file. Keep in sync
// with EquivalentFractions.tsx's EQUIVALENT_PAIRS / NEAR_MISS_PAIRS.
const EQUIVALENT_PAIRS: [number, number, number, number][] = [
  [1, 2, 2, 4],
  [1, 2, 3, 6],
  [1, 2, 4, 8],
  [1, 3, 2, 6],
  [1, 4, 2, 8],
  [2, 3, 4, 6],
  [3, 4, 6, 8],
  [2, 4, 4, 8],
];
const NEAR_MISS_PAIRS: [number, number, number, number][] = [
  [1, 3, 2, 4],
  [1, 2, 2, 6],
  [2, 3, 3, 6],
  [1, 4, 2, 6],
  [3, 4, 4, 6],
  [1, 2, 3, 8],
  [2, 4, 3, 8],
  [1, 3, 3, 8],
];

// Q1, Q6 — recognize a true pair from two bars (choice, visual)
export function recognizeQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const [n1, d1, n2, d2] = pick(EQUIVALENT_PAIRS);
    return [
      {
        visual: <EquivalentBars n1={n1} d1={d1} n2={n2} d2={d2} />,
        difficulty,
        step: choice(
          {
            prompt: `Are ${n1}/${d1} and ${n2}/${d2} equivalent?`,
            hint: "Compare how much of each bar is shaded, not how many pieces each is split into.",
            explain: `${n1}/${d1} and ${n2}/${d2} shade the exact same amount — they're equivalent.`,
          },
          "Yes — they line up to the exact same amount",
          // "Different piece count = different amount" misconception.
          ["No — they're split into a different number of pieces, so they can't be the same"]
        ),
      },
    ];
  };
}

// Q2, Q7 — generate a missing numerator (number step)
export function generateQuestion(difficulty: "easy" | "hard", withVisual: boolean): () => TestQuestion[] {
  return () => {
    const [n1, d1, n2, d2] = pick(EQUIVALENT_PAIRS);
    return [
      {
        visual: withVisual ? <EquivalentBars n1={n1} d1={d1} n2={0} d2={d2} /> : null,
        difficulty,
        step: {
          kind: "number",
          prompt: `${n1}/${d1} = ?/${d2}. What's the missing numerator?`,
          hint: `How many of the ${d2} smaller pieces cover the same amount as ${n1}/${d1}?`,
          explain: `${n1}/${d1} = ${n2}/${d2} — the same amount, cut into ${d2} pieces instead of ${d1}.`,
          answer: n2,
        },
      },
    ];
  };
}

// Q3, Q8 — near-miss trap (choice, visual)
export function nonExampleQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const [n1, d1, n2, d2] = pick(NEAR_MISS_PAIRS);
    return [
      {
        visual: <EquivalentBars n1={n1} d1={d1} n2={n2} d2={d2} />,
        difficulty,
        step: choice(
          {
            prompt: `Are ${n1}/${d1} and ${n2}/${d2} equivalent?`,
            hint: "Compare the shaded widths carefully — do they really match?",
            explain: `${n1}/${d1} and ${n2}/${d2} shade different amounts — NOT equivalent, even though both are simple fractions.`,
          },
          "No — they don't line up to the same amount",
          // "Both look simple, so they must match" misconception.
          ["Yes — they're both simple fractions, so they must match"]
        ),
      },
    ];
  };
}

// Q4 — explain via the number line (choice, visual)
export function explainQuestion(): TestQuestion[] {
  const [n1, d1, n2, d2] = pick(EQUIVALENT_PAIRS);
  return [
    {
      visual: <StackedNumberLines n1={n1} d1={d1} n2={n2} d2={d2} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Why are ${n1}/${d1} and ${n2}/${d2} equivalent?`,
          hint: "Look at where each one lands on the number line.",
          explain: "They land on the exact same point on the number line — same amount, different number of pieces.",
        },
        "They land on the exact same point on the number line",
        // Additive-pattern misconception; and a surface-feature (color) non-reason.
        [`Because ${n1} + ${d1} equals ${n2} + ${d2}`, "Because they're both shaded in the same color"]
      ),
    },
  ];
}

// Q5 — which of three is equivalent (choice, no visual)
export function pickEquivalentQuestion(): TestQuestion[] {
  const [n1, d1, n2, d2] = pick(EQUIVALENT_PAIRS);
  // Distractors keep d2 but shift the numerator by one — a near-miss on the same bar.
  const distractors = [n2 - 1, n2 + 1].filter((n) => n >= 1 && n <= d2).map((n) => `${n}/${d2}`);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Which fraction is equivalent to ${n1}/${d1}?`,
          hint: "Picture both on a number line — which one lands on the same point?",
          explain: `${n1}/${d1} = ${n2}/${d2}.`,
        },
        `${n2}/${d2}`,
        distractors
      ),
    },
  ];
}

// Q9 — reasoning sentence (two dropdowns)
function reasoningSentenceQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: sentence(
        {
          prompt: "Fill in both blanks about equivalent fractions.",
          hint: "Think about where 1/2 and 2/4 land on the number line.",
          explain: "Equivalent fractions name the same point on the number line, even when the wholes are cut into different numbers of pieces.",
        },
        "Two fractions are equivalent when they ",
        selectBlank("land on the same point on the number line", ["have the same numerator", "are both simple fractions"]),
        ", even if they're cut into ",
        selectBlank("a different number of pieces", ["the same number of pieces", "different-size wholes"]),
        "."
      ),
    },
  ];
}

export const equivalentFractionsTest: Unit["test"] = {
  questions: [
    recognizeQuestion("easy"),
    generateQuestion("easy", true),
    nonExampleQuestion("medium"),
    explainQuestion,
    pickEquivalentQuestion,
    recognizeQuestion("medium"),
    generateQuestion("hard", false),
    nonExampleQuestion("hard"),
    reasoningSentenceQuestion,
    () => generateQuestion("hard", false)(),
  ],
  passScore: 9,
};
