import { FractionBar, WholePlusPartBar } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import { Frac, QA } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

// Own local copies of FractionForms.tsx's generators — not an import, same
// "every *Test.tsx keeps its own local data" convention noted throughout
// this codebase (see e.g. ConversionsTest.tsx / FractionDivisionTest.tsx) —
// a *Test.tsx importing back from its paired main unit file threw a real
// circular-import bug once (silent ReferenceError in the browser's native
// import(), invisible to tsc/vite build/ssrLoadModule).
function properFraction(): [number, number] {
  const d = randInt(2, 9);
  const n = randInt(1, d - 1);
  return [n, d];
}
function improperFraction(): [number, number] {
  const d = randInt(2, 8);
  const n = randInt(d + 1, d * 4);
  return [n, d];
}
function mixedParts(): { whole: number; leftover: number; den: number } {
  const den = randInt(2, 8);
  const whole = randInt(1, 4);
  const leftover = randInt(1, den - 1);
  return { whole, leftover, den };
}

const PROPER = "Proper fraction — the numerator is less than the denominator, so it's worth less than one whole";
const IMPROPER = "Improper fraction — the numerator is greater than or equal to the denominator, so it's worth one whole or more";
const MIXED = "Mixed number — a whole number written together with a proper fraction";

// Q1 — visual, classify a proper fraction
function classifyProperQuestion(): TestQuestion[] {
  const [n, d] = properFraction();
  return [
    {
      visual: <FractionBar numerator={n} denominator={d} />,
      difficulty: "easy",
      step: choice(
        { prompt: <>Is <QA><Frac n={n} d={d} /></QA> a proper fraction, an improper fraction, or a mixed number?</>, hint: `Compare ${n} to ${d}.`, explain: `${n} is less than ${d}, so this is a proper fraction.` },
        PROPER,
        [IMPROPER, MIXED]
      ),
    },
  ];
}

// Q2 — visual, classify an improper fraction
function classifyImproperQuestion(): TestQuestion[] {
  const [n, d] = improperFraction();
  return [
    {
      visual: <FractionBar numerator={d} denominator={d} label={`${n}/${d} needs more than one bar`} />,
      difficulty: "easy",
      step: choice(
        { prompt: <>Is <QA><Frac n={n} d={d} /></QA> a proper fraction, an improper fraction, or a mixed number?</>, hint: `Compare ${n} to ${d}.`, explain: `${n} is greater than ${d}, so this is an improper fraction.` },
        IMPROPER,
        [PROPER, MIXED]
      ),
    },
  ];
}

// Q3 — visual, classify a mixed number
function classifyMixedQuestion(): TestQuestion[] {
  const { whole, leftover, den } = mixedParts();
  return [
    {
      visual: <WholePlusPartBar whole={whole} leftoverNum={leftover} den={den} />,
      difficulty: "easy",
      step: choice(
        {
          prompt: (
            <>
              Is <QA>{whole} {leftover}/{den}</QA> a proper fraction, an improper fraction, or a mixed number?
            </>
          ),
          hint: "It's written as a whole number together with a fraction.",
          explain: "A whole number written next to a fraction is a mixed number.",
        },
        MIXED,
        [PROPER, IMPROPER]
      ),
    },
  ];
}

// Q4, Q5, Q8 — visual, improper → mixed (two values at once via a ratio step)
function improperToMixedQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const [num, den] = improperFraction();
    const whole = Math.floor(num / den);
    const leftover = num % den;
    return [
      {
        visual: <Frac n={num} d={den} />,
        difficulty,
        step: {
          kind: "ratio",
          tones: "none",
          labels: ["whole number", "leftover numerator"],
          prompt: <>Write <Frac n={num} d={den} /> as a mixed number: how many whole groups of {den}, and what's left over?</>,
          hint: `${den} × what is the biggest multiple of ${den} that's still ≤ ${num}? What's left after that?`,
          explain: `${den} fits into ${num} exactly ${whole} times, with ${leftover} left over.`,
          answer: [whole, leftover],
        },
      },
    ];
  };
}

// Q6, Q7 — text, mixed → improper (numerator only, denominator stays the same)
function mixedToImproperQuestion(): TestQuestion[] {
  const { whole, leftover, den } = mixedParts();
  const num = whole * den + leftover;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        suffix: `/${den}`,
        prompt: (
          <>
            Write {whole} {leftover}/{den} as an improper fraction. The denominator stays {den} — what's the numerator?
          </>
        ),
        hint: `${whole} × ${den} = ?, then add ${leftover}.`,
        explain: `${whole} × ${den} = ${whole * den}, and ${whole * den} + ${leftover} = ${num}.`,
        answer: num,
      },
    },
  ];
}

// Q9 — choice, pick the equivalent improper fraction for a given mixed number
function pickEquivalentQuestion(): TestQuestion[] {
  const { whole, leftover, den } = mixedParts();
  const num = whole * den + leftover;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: (
            <>
              Which improper fraction equals {whole} {leftover}/{den}?
            </>
          ),
          hint: `${whole} × ${den} + ${leftover} = ?`,
          explain: `${whole} wholes is ${whole * den}/${den}; adding the leftover ${leftover}/${den} gives ${num}/${den}.`,
        },
        `${num}/${den}`,
        [`${whole + leftover}/${den}`, `${num}/${den + whole}`]
      ),
    },
  ];
}

// Q10 — choice, the boundary case: numerator exactly equal to denominator
function boundaryCaseQuestion(): TestQuestion[] {
  const d = randInt(2, 9);
  return [
    {
      visual: <FractionBar numerator={d} denominator={d} />,
      difficulty: "hard",
      step: choice(
        {
          prompt: (
            <>
              Is <QA><Frac n={d} d={d} /></QA> a proper fraction or an improper fraction?
            </>
          ),
          hint: "Proper means strictly less than one whole — is this fraction less than a whole, or exactly a whole?",
          explain: `${d}/${d} equals exactly one whole — since the numerator isn't LESS than the denominator, it's improper, even though it simplifies to a whole number.`,
        },
        "Improper fraction — the numerator equals the denominator, so it's worth exactly one whole",
        ["Proper fraction — it simplifies to a whole number, so it doesn't count as improper"]
      ),
    },
  ];
}

export const fractionFormsTest: Unit["test"] = {
  questions: [
    classifyProperQuestion,
    classifyImproperQuestion,
    classifyMixedQuestion,
    improperToMixedQuestion("medium"),
    improperToMixedQuestion("medium"),
    mixedToImproperQuestion,
    mixedToImproperQuestion,
    improperToMixedQuestion("hard"),
    pickEquivalentQuestion,
    boundaryCaseQuestion,
  ],
  passScore: 9,
};
