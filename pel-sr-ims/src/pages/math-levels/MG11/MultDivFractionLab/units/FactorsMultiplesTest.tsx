import { FactorRectangle, MultiplesLine } from "../diagrams";
import { gcd, lcm, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

function coprimePair(): [number, number] {
  let m: number, n: number;
  do {
    m = randInt(2, 9);
    n = randInt(2, 9);
  } while (gcd(m, n) !== 1 || m === n);
  return [m, n];
}

function gcfQuestion(visual: boolean): TestQuestion[] {
  const g = randInt(2, 12);
  const [m, n] = coprimePair();
  const a = g * m;
  const b = g * n;
  return [
    {
      visual: visual ? <FactorRectangle rows={g} cols={m} label={`${a} = ${g} × ${m}`} /> : null,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is the GCF of ${a} and ${b}?`, hint: "Find the largest number that divides evenly into both.", explain: `${a} = ${g}×${m}, ${b} = ${g}×${n} — GCF is ${g}.`, answer: g },
    },
  ];
}

function lcmQuestion(visual: boolean): TestQuestion[] {
  let a: number, b: number;
  do {
    a = randInt(2, 12);
    b = randInt(2, 12);
  } while (a === b);
  const L = lcm(a, b);
  return [
    {
      visual: visual ? <MultiplesLine a={a} b={b} upTo={L} /> : null,
      difficulty: "medium",
      step: { kind: "number", prompt: `What is the LCM of ${a} and ${b}?`, hint: "List multiples of each until one matches.", explain: `The LCM of ${a} and ${b} is ${L}.`, answer: L },
    },
  ];
}

function distributiveQuestion(visual: boolean): TestQuestion[] {
  const g = randInt(2, 12);
  const [m, n] = coprimePair();
  const a = g * m;
  const b = g * n;
  return [
    {
      visual: visual ? <FactorRectangle rows={g} cols={m + n} splitCols={[m, n]} /> : null,
      difficulty: "hard",
      step: {
        kind: "ratio",
        tones: "none",
        labels: ["first term", "second term"],
        frame: ["(", "+", ")"],
        prompt: `Use the distributive property: ${a} + ${b} = ${g} × (___ + ___). Divide each addend by the GCF (${g}).`,
        hint: `${a} ÷ ${g} = ?, and ${b} ÷ ${g} = ?`,
        explain: `${a} ÷ ${g} = ${m}, and ${b} ÷ ${g} = ${n}, so ${a} + ${b} = ${g} × (${m} + ${n}).`,
        answer: [m, n],
      },
    },
  ];
}

function correctRewriteChoiceQuestion(): TestQuestion[] {
  const g = randInt(2, 12);
  const [m, n] = coprimePair();
  const a = g * m;
  const b = g * n;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Which expression correctly rewrites ${a} + ${b} using the distributive property?`, hint: "The GCF multiplies the sum of the two reduced terms.", explain: `${a} + ${b} = ${g} × (${m} + ${n}).` },
        `${g} × (${m} + ${n})`,
        [`${m} × (${g} + ${n})`, `${g} + (${m} × ${n})`]
      ),
    },
  ];
}

function invalidSplitChoiceQuestion(): TestQuestion[] {
  const g = randInt(2, 12);
  const [m, n] = coprimePair();
  const a = g * m;
  const b = g * n;
  const wrongFactor = g + 1;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Which of these is NOT a valid common-factor split of ${a} + ${b}?`, hint: `Check: does the factor actually divide evenly into both ${a} and ${b}?`, explain: `${wrongFactor} doesn't divide evenly into both ${a} and ${b}, so it can't be factored out of both terms.` },
        `${wrongFactor} × (${a}/${wrongFactor} + ${b}/${wrongFactor})`,
        [`${g} × (${m} + ${n})`, `1 × (${a} + ${b})`]
      ),
    },
  ];
}

export const factorsMultiplesTest: Unit["test"] = {
  questions: [
    () => gcfQuestion(true),
    () => lcmQuestion(true),
    () => distributiveQuestion(true),
    () => gcfQuestion(true),
    () => gcfQuestion(false),
    () => lcmQuestion(false),
    () => distributiveQuestion(false),
    () => gcfQuestion(false),
    correctRewriteChoiceQuestion,
    invalidSplitChoiceQuestion,
  ],
  passScore: 9,
};
