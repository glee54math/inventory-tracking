import { gcd, lcm, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import { Frac, Quotient } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

// Own local copy — see FractionFormsTest.tsx's comment on why *Test.tsx
// files never import generators back from their paired main unit file.
function properCoprimePair(): [number, number] {
  let m: number, n: number;
  do {
    n = randInt(3, 9);
    m = randInt(1, n - 1);
  } while (gcd(m, n) !== 1);
  return [m, n];
}

function reducingPair(gRange: [number, number]): { num: number; den: number; g: number; m: number; n: number } {
  const [m, n] = properCoprimePair();
  const g = randInt(gRange[0], gRange[1]);
  return { num: g * m, den: g * n, g, m, n };
}

// Q1, Q4, Q8 — visual, write in simplest form (the core graded skill)
function simplifyQuestion(difficulty: "easy" | "medium" | "hard", gRange: [number, number]): () => TestQuestion[] {
  return () => {
    const { num, den, m, n } = reducingPair(gRange);
    return [
      {
        visual: <Frac n={num} d={den} />,
        difficulty,
        step: {
          kind: "number",
          frac: true,
          fracRequired: true,
          fracAnswer: [m, n],
          prompt: <>Write <Frac n={num} d={den} /> in simplest form.</>,
          hint: "Find the GCF of the numerator and denominator, then divide both by it.",
          explain: <>Dividing <Frac n={num} d={den} /> by their GCF gives <Quotient n={m} d={n} />.</>,
          answer: m / n,
        },
      },
    ];
  };
}

// Q2, Q5 — text, find the GCF
function findGcfQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const { num, den, g, m, n } = reducingPair([2, 6]);
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "number",
          prompt: `What is the GCF of ${num} and ${den}?`,
          hint: "The GCF is the largest number that divides evenly into both.",
          explain: `${num} = ${g} × ${m} and ${den} = ${g} × ${n} — ${g} is the largest shared factor.`,
          answer: g,
        },
      },
    ];
  };
}

// Q3, Q6 — text, already simplest?
function alreadySimplestQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const [m, n] = properCoprimePair();
    return [
      {
        visual: <Frac n={m} d={n} />,
        difficulty,
        step: choice(
          {
            prompt: `Do ${m} and ${n} share a common factor besides 1?`,
            hint: `List a few factors of ${m} and of ${n} — do any match, besides 1?`,
            explain: `${m} and ${n} share no common factor besides 1, so ${m}/${n} is already in simplest form.`,
          },
          "No — they share no common factor besides 1",
          ["Yes — they share another common factor"]
        ),
      },
    ];
  };
}

// Q7, Q10 — text, divide both by the GCF (ratio step)
function divideByGcfQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const { num, den, g, m, n } = reducingPair(difficulty === "medium" ? [2, 5] : [6, 9]);
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "ratio",
          tones: "none",
          labels: ["new numerator", "new denominator"],
          prompt: <>The GCF of <Frac n={num} d={den} /> is {g}. Divide both the numerator and denominator by {g}.</>,
          hint: `${num} ÷ ${g} = ?, and ${den} ÷ ${g} = ?`,
          explain: `${num} ÷ ${g} = ${m}, and ${den} ÷ ${g} = ${n}.`,
          answer: [m, n],
        },
      },
    ];
  };
}

// Q9 — choice, the GCF/LCM distractor question
function whichDividesQuestion(): TestQuestion[] {
  const { num, den, g } = reducingPair([2, 6]);
  const commonMultiple = lcm(num, den);
  let wrongFactor = g + 1;
  while (wrongFactor === g || wrongFactor === commonMultiple || (num % wrongFactor === 0 && den % wrongFactor === 0)) {
    wrongFactor = randInt(2, Math.max(4, g * 2));
  }
  return [
    {
      visual: <Frac n={num} d={den} />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `Which of these divides evenly into BOTH ${num} and ${den}?`,
          hint: "A factor divides INTO a number with nothing left over; a multiple is what you'd get by multiplying UP.",
          explain: `${g} divides evenly into both ${num} and ${den} — that's a common FACTOR. ${commonMultiple} is a common MULTIPLE of ${num} and ${den}, not a factor.`,
        },
        String(g),
        [String(commonMultiple), String(wrongFactor)]
      ),
    },
  ];
}

export const simplifyingFractionsTest: Unit["test"] = {
  questions: [
    simplifyQuestion("easy", [2, 4]),
    findGcfQuestion("easy"),
    alreadySimplestQuestion("easy"),
    simplifyQuestion("medium", [2, 5]),
    findGcfQuestion("medium"),
    alreadySimplestQuestion("medium"),
    divideByGcfQuestion("medium"),
    simplifyQuestion("hard", [5, 9]),
    whichDividesQuestion,
    divideByGcfQuestion("hard"),
  ],
  passScore: 9,
};
