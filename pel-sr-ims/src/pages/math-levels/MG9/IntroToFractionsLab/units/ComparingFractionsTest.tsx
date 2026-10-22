import { FractionBar, NumberLine } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import { Frac } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

// Own local copies — see FractionFormsTest.tsx's comment on why *Test.tsx
// files never import generators back from their paired main unit file.
function properFraction(maxD = 9): [number, number] {
  const d = randInt(2, maxD);
  const n = randInt(1, d - 1);
  return [n, d];
}
function sameDenomPair(): { n1: number; n2: number; d: number } {
  const d = randInt(3, 10);
  const n1 = randInt(1, d - 1);
  let n2 = randInt(1, d - 1);
  while (n2 === n1) n2 = randInt(1, d - 1);
  return { n1, n2, d };
}
function sameNumPair(): { n: number; d1: number; d2: number } {
  const n = randInt(1, 5);
  const d1 = randInt(n + 1, n + 6);
  let d2 = randInt(n + 1, n + 6);
  while (d2 === d1) d2 = randInt(n + 1, n + 6);
  return { n, d1, d2 };
}
function crossPair(): { n1: number; d1: number; n2: number; d2: number } {
  const [n1, d1] = properFraction(8);
  let [n2, d2] = properFraction(8);
  while (d1 === d2 || n1 / d1 === n2 / d2) [n2, d2] = properFraction(8);
  return { n1, d1, n2, d2 };
}

// Q1, Q3 — visual/text, same denominator
function sameDenomQuestion(difficulty: "easy" | "medium", hasVisual: boolean): () => TestQuestion[] {
  return () => {
    const { n1, n2, d } = sameDenomPair();
    const aBigger = n1 > n2;
    return [
      {
        visual: hasVisual ? (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <FractionBar numerator={n1} denominator={d} width={140} />
            <FractionBar numerator={n2} denominator={d} width={140} />
          </div>
        ) : null,
        difficulty,
        step: choice(
          {
            prompt: <>Which is bigger: <Frac n={n1} d={d} /> or <Frac n={n2} d={d} />?</>,
            hint: "Same-size pieces — just compare how many are shaded.",
            explain: `Both are cut into ${d} equal pieces, so whichever has more shaded is bigger.`,
          },
          aBigger ? `${n1}/${d} is bigger` : `${n2}/${d} is bigger`,
          [aBigger ? `${n2}/${d} is bigger` : `${n1}/${d} is bigger`, "They're equal"]
        ),
      },
    ];
  };
}

// Q2, Q4 — visual/text, same numerator
function sameNumQuestion(difficulty: "easy" | "medium", hasVisual: boolean): () => TestQuestion[] {
  return () => {
    const { n, d1, d2 } = sameNumPair();
    const aBigger = d1 < d2;
    const fewer = Math.min(d1, d2);
    const more = Math.max(d1, d2);
    return [
      {
        visual: hasVisual ? (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <FractionBar numerator={n} denominator={d1} width={140} />
            <FractionBar numerator={n} denominator={d2} width={140} />
          </div>
        ) : null,
        difficulty,
        step: choice(
          {
            prompt: <>Which is bigger: <Frac n={n} d={d1} /> or <Frac n={n} d={d2} />?</>,
            hint: "Cutting a whole into more pieces makes each piece smaller.",
            explain: `Both have ${n} pieces shaded, but cutting into only ${fewer} pieces (instead of ${more}) makes each piece bigger.`,
          },
          aBigger ? `${n}/${d1} is bigger` : `${n}/${d2} is bigger`,
          [aBigger ? `${n}/${d2} is bigger` : `${n}/${d1} is bigger`, "They're equal"]
        ),
      },
    ];
  };
}

// Q5, Q8 — visual, cross-multiply (ratio step: both products at once)
function crossRatioQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const { n1, d1, n2, d2 } = crossPair();
    const productA = n1 * d2;
    const productB = n2 * d1;
    return [
      {
        visual: <NumberLine min={0} max={1} points={[]} />,
        difficulty,
        step: {
          kind: "ratio",
          tones: "none",
          labels: [`${n1} × ${d2}`, `${n2} × ${d1}`],
          prompt: <>Cross-multiply the diagonals of <Frac n={n1} d={d1} /> and <Frac n={n2} d={d2} />: what is {n1} × {d2}, and what is {n2} × {d1}?</>,
          hint: "Multiply straight across each diagonal pair.",
          explain: `${n1} × ${d2} = ${productA}, and ${n2} × ${d1} = ${productB}.`,
          answer: [productA, productB],
        },
      },
    ];
  };
}

// Q6, Q10 — text, cross-multiply (choice: which is bigger)
function crossChoiceQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const { n1, d1, n2, d2 } = crossPair();
    const productA = n1 * d2;
    const productB = n2 * d1;
    const aBigger = productA > productB;
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: <>Which is bigger: <Frac n={n1} d={d1} /> or <Frac n={n2} d={d2} />?</>,
            hint: `Cross-multiply: compare ${n1} × ${d2} to ${n2} × ${d1}.`,
            explain: `${n1} × ${d2} = ${productA} and ${n2} × ${d1} = ${productB}, so ${aBigger ? `${n1}/${d1}` : `${n2}/${d2}`} is bigger.`,
          },
          aBigger ? `${n1}/${d1} is bigger` : `${n2}/${d2} is bigger`,
          [aBigger ? `${n2}/${d2} is bigger` : `${n1}/${d1} is bigger`, "They're equal"]
        ),
      },
    ];
  };
}

// Q7 — visual, benchmark reasoning
function benchmarkQuestion(): TestQuestion[] {
  const d1 = randInt(5, 9);
  const n1 = randInt(1, Math.floor(d1 / 2) - 1 >= 1 ? Math.floor(d1 / 2) - 1 : 1); // well under 1/2
  const d2 = randInt(5, 9);
  const n2 = randInt(Math.ceil(d2 / 2) + 1, d2 - 1); // well over 1/2
  return [
    {
      visual: <NumberLine min={0} max={1} points={[{ value: 0.5, label: "1/2", tone: "c" }]} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: <>Which is bigger: <Frac n={n1} d={d1} /> or <Frac n={n2} d={d2} />?</>,
          hint: "Compare each one to the benchmark 1/2 — no cross-multiplying needed.",
          explain: `${n1}/${d1} is less than 1/2 (${n1} is less than half of ${d1}), and ${n2}/${d2} is more than 1/2 (${n2} is more than half of ${d2}) — so ${n2}/${d2} is bigger without any multiplying.`,
        },
        `${n2}/${d2} is bigger`,
        [`${n1}/${d1} is bigger`, "They're equal"]
      ),
    },
  ];
}

// Q9 — choice, conceptual
function conceptQuestion(): TestQuestion[] {
  const { n, d1, d2 } = sameNumPair();
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>Two fractions have the same numerator, {n}. What determines which one is bigger?</>,
          hint: "Think about piece size, not piece count.",
          explain: "With the numerator fixed, the fraction with the SMALLER denominator is bigger — fewer pieces in the whole means each piece is bigger.",
        },
        "Whichever has the smaller denominator — fewer, bigger pieces",
        ["Whichever has the bigger denominator — more pieces means more", `It depends on whether ${d1} or ${d2} is a multiple of the other`]
      ),
    },
  ];
}

export const comparingFractionsTest: Unit["test"] = {
  questions: [
    sameDenomQuestion("easy", true),
    sameNumQuestion("easy", true),
    sameDenomQuestion("easy", false),
    sameNumQuestion("medium", true),
    crossRatioQuestion("medium"),
    crossChoiceQuestion("medium"),
    benchmarkQuestion,
    crossRatioQuestion("hard"),
    conceptQuestion,
    crossChoiceQuestion("hard"),
  ],
  passScore: 9,
};
