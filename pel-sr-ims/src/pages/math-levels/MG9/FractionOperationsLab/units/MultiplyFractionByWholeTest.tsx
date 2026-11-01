import { FractionBar } from "../diagrams";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import { Frac } from "../../../shared/engine/controls";
import { pick, randInt } from "../../../shared/lib/math";
import type { Unit } from "../../../shared/units/types";
import { mixedText, nonUnitTimesParams, pickDistractors, unitTimesParams, wholeProductParams, wordTimesParams } from "../lib/fractions";
import { amountStep } from "../lib/steps";
import { fillName, NAMES, TIMES_CONTEXTS, unitFor } from "../lib/words";

// Self-contained: never imports the paired MultiplyFractionByWhole.tsx.

type Diff = TestQuestion["difficulty"];
const repeatSum = (term: string, times: number) => Array.from({ length: times }, () => term).join(" + ");

/** Q1 — n × 1/d as a numerator. */
export function unitTimesQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const { n, d } = unitTimesParams();
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        suffix: `/${d}`,
        prompt: (
          <>
            {n} × <Frac n={1} d={d} /> = ? (Type the numerator.)
          </>
        ),
        hint: `${n} copies of 1/${d}.`,
        explain: `${n} × 1/${d} = ${repeatSum(`1/${d}`, Math.min(n, 4))}${n > 4 ? " + …" : ""} = ${n}/${d}.`,
        answer: n,
      },
    },
  ];
}

/** Q2 — which repeated addition matches n × a/d. */
export function repeatedAdditionQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const n = randInt(3, 5);
  const d = randInt(3, 10);
  const a = randInt(2, d - 1);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: (
            <>
              Which addition means the same as {n} × <Frac n={a} d={d} />?
            </>
          ),
          hint: `${n} × something means ${n} copies of it.`,
          explain: `${n} × ${a}/${d} is ${n} copies of ${a}/${d}: ${repeatSum(`${a}/${d}`, n)}.`,
        },
        repeatSum(`${a}/${d}`, n),
        [
          repeatSum(`1/${d}`, n), // dropped the numerator: n copies of 1/d
          repeatSum(`${a}/${d}`, n - 1), // one copy short
        ]
      ),
    },
  ];
}

/** Q3 — 4.NF.4b: n × a/d = (n × a) × 1/d. */
export function copiesOfUnitQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { n, a, d } = nonUnitTimesParams();
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Array.from({ length: n }, (_, i) => (
            <FractionBar key={i} numerator={a} denominator={d} width={110} height={34} />
          ))}
        </div>
      ),
      difficulty,
      step: {
        kind: "number",
        prompt: (
          <>
            {n} × <Frac n={a} d={d} /> = ? × <Frac n={1} d={d} />
          </>
        ),
        hint: `Each ${a}/${d} is ${a} pieces of 1/${d}. How many pieces in ${n} copies?`,
        explain: `${n} copies × ${a} pieces = ${n * a} pieces of 1/${d}.`,
        answer: n * a,
      },
    },
  ];
}

/** Q4 — n × a/d as a numerator over d (may be improper). */
export function nonUnitNumeratorQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { n, a, d } = nonUnitTimesParams();
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        suffix: `/${d}`,
        prompt: (
          <>
            {n} × <Frac n={a} d={d} /> = ? (Type the numerator — keep the denominator {d}.)
          </>
        ),
        hint: `Multiply the numerator by ${n}. The piece size stays 1/${d}.`,
        explain: `${n} × ${a} = ${n * a}, so ${n * a}/${d}.`,
        answer: n * a,
      },
    },
  ];
}

/** Q5 — n × a/d finished as a mixed number. */
export function nonUnitMixedQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const { n, a, d } = nonUnitTimesParams();
  const p = n * a;
  return [
    {
      visual: null,
      difficulty,
      step: amountStep(
        {
          prompt: (
            <>
              {n} × <Frac n={a} d={d} /> = ?
            </>
          ),
          hint: `${n} × ${a} = ${p} pieces of 1/${d}. How many wholes is that?`,
          explain: `${p}/${d} = ${mixedText(p, d)}.`,
        },
        p,
        d
      ),
    },
  ];
}

/** Q6 — the multiply-the-denominator-too trap. */
export function denominatorTrapQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const n = randInt(2, 5);
  const d = randInt(3, 10);
  const a = randInt(1, d - 1);
  const correct = `${n * a}/${d}`;
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: (
            <>
              What is {n} × <Frac n={a} d={d} />?
            </>
          ),
          hint: "You have more copies of the same-size pieces — does the piece size change?",
          explain: `${n} × ${a}/${d} = ${n * a}/${d}. Only the number of pieces grows; they're still 1/${d} each.`,
        },
        correct,
        pickDistractors(correct, [
          `${n * a}/${n * d}`, // multiplied the denominator too (that's just a/d again)
          `${n + a}/${d}`, // added the whole number instead of multiplying
          `${a}/${n * d}`, // multiplied only the denominator
        ])
      ),
    },
  ];
}

/** Q7 — set up the expression from a story. */
export function wordSetupQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const { n, a, d } = wordTimesParams();
  const c = pick(TIMES_CONTEXTS);
  const name = pick(NAMES);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${fillName(c.each, name)} ${a}/${d} ${c.one}. ${fillName(c.story, name, n)} ${fillName(c.question, name)} Which expression solves it?`,
          hint: `The same amount, ${n} times.`,
          explain: `${n} equal amounts of ${a}/${d}: ${n} × ${a}/${d}.`,
        },
        `${n} × ${a}/${d}`,
        [
          `${n} + ${a}/${d}`, // added instead of multiplying
          `${n} × ${d}/${a}`, // flipped the fraction (numerator and denominator swapped)
        ]
      ),
    },
  ];
}

/** Q8 — solve a whole × fraction story. */
export function wordComputeQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { n, a, d } = wordTimesParams();
  const c = pick(TIMES_CONTEXTS);
  const name = pick(NAMES);
  const p = n * a;
  return [
    {
      visual: null,
      difficulty,
      step: amountStep(
        {
          prompt: `${fillName(c.each, name)} ${a}/${d} ${c.one}. ${fillName(c.story, name, n)} ${fillName(c.question, name)}`,
          hint: `${n} × ${a}/${d} = ${p}/${d}. Rewrite if it's a whole number or more than one whole.`,
          explain: `${n} × ${a}/${d} = ${p}/${d} = ${mixedText(p, d)} ${unitFor(p, d, c)}.`,
        },
        p,
        d,
        unitFor(p, d, c)
      ),
    },
  ];
}

/** Q9 — product that comes out to a whole number. */
export function wholeProductQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { n, a, d } = wholeProductParams();
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: (
          <>
            {n} × <Frac n={a} d={d} /> = ? (Write your answer as simply as you can.)
          </>
        ),
        hint: `${n} × ${a} = ${n * a} pieces of 1/${d}. How many wholes is that exactly?`,
        explain: `${n * a}/${d} = ${(n * a) / d} — exactly ${(n * a) / d} whole${(n * a) / d === 1 ? "" : "s"}, nothing left over.`,
        answer: (n * a) / d,
      },
    },
  ];
}

/** Q10 — which product is a whole number (exactly one is). */
export function whichIsWholeQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const w = wholeProductParams();
  const others: string[] = [];
  const seen = new Set([`${w.n} × ${w.a}/${w.d}`]);
  while (others.length < 2) {
    const o = nonUnitTimesParams();
    const key = `${o.n} × ${o.a}/${o.d}`;
    if (!seen.has(key)) {
      seen.add(key);
      others.push(key);
    }
  }
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: "Which product is a WHOLE number?",
          hint: "Multiply the numerators. Is the new numerator a multiple of the denominator?",
          explain: `${w.n} × ${w.a}/${w.d} = ${w.n * w.a}/${w.d} = ${(w.n * w.a) / w.d}. The others leave pieces left over.`,
        },
        `${w.n} × ${w.a}/${w.d}`,
        others // both always leave a non-zero remainder (nonUnitTimesParams never lands on a whole)
      ),
    },
  ];
}

export const multiplyFractionByWholeTest: Unit["test"] = {
  questions: [
    () => unitTimesQuestion("easy"),
    () => repeatedAdditionQuestion("easy"),
    () => copiesOfUnitQuestion("medium"),
    () => nonUnitNumeratorQuestion("medium"),
    () => denominatorTrapQuestion("medium"),
    () => nonUnitMixedQuestion("hard"),
    () => wordSetupQuestion("easy"),
    () => wordComputeQuestion("medium"),
    () => wholeProductQuestion("medium"),
    () => whichIsWholeQuestion("hard"),
  ],
  passScore: 9,
};
