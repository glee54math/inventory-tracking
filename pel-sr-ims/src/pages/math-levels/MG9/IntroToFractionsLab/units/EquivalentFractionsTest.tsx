import { EquivalentBars, FractionBar } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import { Frac } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

// Own local copy — see FractionFormsTest.tsx's comment on why *Test.tsx files
// never import generators back from their paired main unit file.
function baseFraction(): [number, number] {
  const d = randInt(2, 6);
  const n = randInt(1, d - 1);
  return [n, d];
}

// Q1, Q4 — visual, find the missing numerator
function missingNumeratorQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const [n, d] = baseFraction();
    const k = difficulty === "easy" ? randInt(2, 3) : randInt(3, 5);
    const D = d * k;
    return [
      {
        visual: <EquivalentBars n={n} d={d} k={k} />,
        difficulty,
        step: {
          kind: "number",
          prompt: <>?/{D} is equivalent to <Frac n={n} d={d} />. What's the missing numerator?</>,
          hint: `${D} ÷ ${d} = ${k}, so multiply the numerator by ${k} too.`,
          explain: `${n} × ${k} = ${n * k}.`,
          answer: n * k,
        },
      },
    ];
  };
}

// Q2, Q5 — visual, find the missing denominator
function missingDenominatorQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const [n, d] = baseFraction();
    const k = difficulty === "easy" ? randInt(2, 3) : randInt(3, 5);
    const N = n * k;
    return [
      {
        visual: <EquivalentBars n={n} d={d} k={k} />,
        difficulty,
        step: {
          kind: "number",
          prompt: <>{N}/? is equivalent to <Frac n={n} d={d} />. What's the missing denominator?</>,
          hint: `${N} ÷ ${n} = ${k}, so multiply the denominator by ${k} too.`,
          explain: `${d} × ${k} = ${d * k}.`,
          answer: d * k,
        },
      },
    ];
  };
}

// Q3, Q7 — visual/text, spot the equivalent
function spotEquivalentQuestion(hasVisual: boolean, difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const [n, d] = baseFraction();
    const k = randInt(2, 5);
    const correct = `${n * k}/${d * k}`;
    const addedInstead = `${n + k}/${d + k}`;
    const scaledWrong = `${n * k + 1}/${d * k}`;
    return [
      {
        visual: hasVisual ? <FractionBar numerator={n} denominator={d} /> : null,
        difficulty,
        step: choice(
          {
            prompt: <>Which fraction is equivalent to <Frac n={n} d={d} />?</>,
            hint: "Equivalent fractions come from multiplying both the numerator AND denominator by the same number — not adding the same number to both.",
            explain: `${n} × ${k} = ${n * k} and ${d} × ${k} = ${d * k}, so ${correct} is equivalent. ${addedInstead} comes from ADDING ${k} to both instead of multiplying.`,
          },
          correct,
          [addedInstead, scaledWrong]
        ),
      },
    ];
  };
}

// Q6, Q10 — text, build an equivalent fraction
function buildEquivalentQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const [n, d] = baseFraction();
    const k = difficulty === "medium" ? randInt(2, 4) : randInt(5, 7);
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "ratio",
          tones: "none",
          labels: ["numerator", "denominator"],
          prompt: <>Multiply both the numerator and denominator of <Frac n={n} d={d} /> by {k}.</>,
          hint: `${n} × ${k} = ?, and ${d} × ${k} = ?`,
          explain: `${n} × ${k} = ${n * k}, and ${d} × ${k} = ${d * k}.`,
          answer: [n * k, d * k],
        },
      },
    ];
  };
}

// Q8 — choice, find the one that does NOT belong
function notEquivalentQuestion(): TestQuestion[] {
  const [n, d] = baseFraction();
  const k1 = randInt(2, 3);
  const k2 = randInt(4, 5);
  const correctOdd = `${n * k1 + 1}/${d * k1}`; // the fraction that's NOT equivalent
  const equivA = `${n * k1}/${d * k1}`;
  const equivB = `${n * k2}/${d * k2}`;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>Three of these are equal to <Frac n={n} d={d} /> — which one is NOT?</>,
          hint: "Check each one: does dividing the numerator by the denominator give the same value as the original?",
          explain: `${equivA} and ${equivB} both come from multiplying ${n}/${d} by a whole number on top and bottom. ${correctOdd} doesn't match that pattern.`,
        },
        correctOdd,
        [equivA, equivB]
      ),
    },
  ];
}

// Q9 — choice, conceptual: what does "equivalent" actually mean
function conceptQuestion(): TestQuestion[] {
  const [n, d] = baseFraction();
  const k = randInt(2, 5);
  return [
    {
      visual: <EquivalentBars n={n} d={d} k={k} />,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>What's true about <Frac n={n} d={d} /> and <Frac n={n * k} d={d * k} />?</>,
          hint: "Look at where each one would land on a number line.",
          explain: "Equivalent fractions name the exact same point on the number line — they're the same number, written two different ways.",
        },
        "They're the same number — they land on the exact same point on a number line",
        [`${n * k}/${d * k} is a bit bigger, since the numbers are bigger`, "They're close in value, but not exactly equal"]
      ),
    },
  ];
}

export const equivalentFractionsTest: Unit["test"] = {
  questions: [
    missingNumeratorQuestion("easy"),
    missingDenominatorQuestion("easy"),
    spotEquivalentQuestion(true, "easy"),
    missingNumeratorQuestion("medium"),
    missingDenominatorQuestion("medium"),
    buildEquivalentQuestion("medium"),
    spotEquivalentQuestion(false, "medium"),
    notEquivalentQuestion,
    conceptQuestion,
    buildEquivalentQuestion("hard"),
  ],
  passScore: 9,
};
