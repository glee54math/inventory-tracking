import { BenchmarkLine } from "../diagrams";
import { choice, fractionStep, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { pick } from "../../../shared/lib/math";
import {
  benchFrac,
  benchmarkHalves,
  claimDraw,
  claimFor,
  combine,
  estimateChoices,
  halvesText,
  mixedAddDiagnose,
  mixedBreakdown,
  mixedRaw,
  mixedSubDiagnose,
  resultDiagnose,
  signOf,
  simplestText,
  twoPeople,
  u5Mixed,
  u5Pair,
} from "../lib/fractions";
import { makeStory, type StoryKind } from "../lib/stories";

// Self-contained: never imports the paired WordProblems.tsx.

type Diff = TestQuestion["difficulty"];
const BENCH = ["0", "1/2", "1"];

/** Q1/Q2 — closest benchmark. `low` picks fractions from a separate pool (denominators 2-6 vs 8-12). */
export function closestBenchmarkQuestion(difficulty: Diff, low: boolean, withLine = false): TestQuestion[] {
  const [n, d] = benchFrac(low ? [3, 4, 5, 6] : [8, 10, 12]);
  const h = benchmarkHalves(n, d);
  return [
    {
      visual: withLine ? <BenchmarkLine max={1} points={[{ value: n / d, label: `${n}/${d}`, tone: "a" }]} /> : null,
      difficulty,
      step: {
        kind: "choice",
        prompt: `Which benchmark is ${n}/${d} closest to?`,
        hint: "Is the top tiny, about half, or almost all of the bottom?",
        explain: `${n}/${d} is closest to ${halvesText(h)}.`,
        // Fixed order 0, 1/2, 1 (like the number line). Wrong picks: 1/2 for any small
        // fraction with a big denominator, or 1 for any fraction with a big top.
        choices: BENCH,
        correct: h,
      },
    },
  ];
}

/** Q3 — estimate a sum or difference from benchmarks. */
export function estimateQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const op = pick(["add", "sub"] as const);
  const { n1, d1, n2, d2 } = u5Pair(op);
  const h1 = benchmarkHalves(n1, d1);
  const h2 = benchmarkHalves(n2, d2);
  const est = op === "add" ? h1 + h2 : h1 - h2;
  const options = estimateChoices(est); // random window, so draw it once
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "choice",
        prompt: `About how much is ${n1}/${d1} ${signOf(op)} ${n2}/${d2}? Use benchmarks.`,
        hint: "Round each fraction to 0, 1/2, or 1.",
        explain: `${n1}/${d1} is close to ${halvesText(h1)} and ${n2}/${d2} is close to ${halvesText(h2)}. ${halvesText(h1)} ${signOf(op)} ${halvesText(h2)} = ${halvesText(est)}.`,
        // In number order. The neighbors are one fraction rounded the wrong way (off by 1/2).
        choices: options,
        correct: options.indexOf(halvesText(est)),
      },
    },
  ];
}

/** Q4 — is a claimed answer sensible? The verdict is picked first (1 in 3 each), so "Yes" can't be guessed. */
export function sensibleQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { p, claim } = claimDraw();
  const est = benchmarkHalves(p.n1, p.d1) + benchmarkHalves(p.n2, p.d2);
  const [person] = twoPeople();
  const order = ["ok", "small", "big"] as const;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "choice",
        prompt: `${person.name} says ${p.n1}/${p.d1} + ${p.n2}/${p.d2} = ${claim.n}/${claim.d}. Use benchmarks. Does that make sense?`,
        hint: "Estimate the sum first. Then compare.",
        explain: `The estimate is ${halvesText(est)}. ${claim.n}/${claim.d} is ${claim.verdict === "ok" ? "close to it, so it makes sense" : claim.verdict === "small" ? "much less, so it is wrong" : "much more, so it is wrong"}.`,
        // Distractors: judging by how the numbers look instead of the estimate.
        choices: ["Yes. It is close to the estimate.", "No. It is too small.", "No. It is too big."],
        correct: order.indexOf(claim.verdict),
      },
    },
  ];
}

/** Q5-Q7 — a one-step story with unlike denominators, typed in simplest form. */
export function storyQuestion(difficulty: Diff, kind: StoryKind): TestQuestion[] {
  const op = kind === "total" ? "add" : "sub";
  const { n1, d1, n2, d2 } = u5Pair(op);
  const story = makeStory(kind, { w: 0, n: n1, d: d1 }, { w: 0, n: n2, d: d2 });
  const { L, a, b, r } = combine(op, n1, d1, n2, d2);
  return [
    {
      visual: null,
      difficulty,
      step: fractionStep(
        {
          prompt: `${story.text} Write the answer in simplest form.`,
          hint: `${op === "add" ? "Add" : "Subtract"} the two amounts. Use the LCD.`,
          explain: `${n1}/${d1} ${signOf(op)} ${n2}/${d2} = ${a}/${L} ${signOf(op)} ${b}/${L} = ${simplestText(r, L)}.`,
        },
        r,
        L,
        { mixed: true, simplest: true, diagnose: resultDiagnose(op, n1, d1, n2, d2) }
      ),
    },
  ];
}

/** Q8/Q9 — a mixed-number story (recipes, boards, hikes), typed in simplest form. */
export function mixedStoryQuestion(difficulty: Diff, op: "add" | "sub"): TestQuestion[] {
  const p = u5Mixed(op);
  const kind: StoryKind = op === "add" ? "total" : pick(["left", "compare"] as StoryKind[]);
  const story = makeStory(kind, { w: p.w1, n: p.n1, d: p.d1 }, { w: p.w2, n: p.n2, d: p.d2 });
  const m = mixedBreakdown(p);
  return [
    {
      visual: null,
      difficulty,
      step: fractionStep(
        {
          prompt: `${story.text} Write the answer in simplest form.`,
          hint: op === "add" ? "Add the wholes and the fractions. Carry 1 whole if the fraction parts make 1 whole or more." : "Borrow 1 whole when the first fraction part is smaller.",
          explain: `${mixedRaw(p.w1, p.n1, p.d1)} ${signOf(op)} ${mixedRaw(p.w2, p.n2, p.d2)} = ${simplestText(m.total, m.L)}.`,
        },
        m.total,
        m.L,
        { mixed: true, simplest: true, diagnose: op === "add" ? mixedAddDiagnose(p.w1, p.n1, p.d1, p.w2, p.n2, p.d2) : mixedSubDiagnose(p.w1, p.n1, p.d1, p.w2, p.n2, p.d2) }
      ),
    },
  ];
}

/** Q10 — a sum must be more than each part (the add-across check), as a choice. */
export function biggerThanPartsQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  for (let guard = 0; guard < 500; guard++) {
    const p = u5Pair("add");
    const across = claimFor(p, "addAcross");
    if (!across) continue;
    const { L, r } = combine("add", p.n1, p.d1, p.n2, p.d2);
    const right = simplestText(r, L);
    const big = p.n1 * p.d2 >= p.n2 * p.d1 ? `${p.n1}/${p.d1}` : `${p.n2}/${p.d2}`;
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `${p.n1}/${p.d1} + ${p.n2}/${p.d2}: which answer makes sense?`,
            hint: `The sum must be more than ${big}.`,
            explain: `${right} is more than ${big} and close to the estimate. ${across.n}/${across.d} is less than ${big}, so it can't be the sum.`,
          },
          right,
          [
            `${across.n}/${across.d}`, // added across: smaller than one of its own parts
            big, // thinks the sum can equal its bigger part
          ]
        ),
      },
    ];
  }
  return biggerThanPartsQuestion(difficulty);
}

export const wordProblemsTest: NonNullable<Unit["test"]> = {
  questions: [
    () => closestBenchmarkQuestion("easy", true, true),
    () => closestBenchmarkQuestion("easy", false),
    () => estimateQuestion("medium"),
    () => sensibleQuestion("medium"),
    () => storyQuestion("medium", "total"),
    () => storyQuestion("medium", "left"),
    () => storyQuestion("hard", pick(["compare", "moreNeeded"] as StoryKind[])),
    () => mixedStoryQuestion("hard", "add"),
    () => mixedStoryQuestion("hard", "sub"),
    () => biggerThanPartsQuestion("hard"),
  ],
  passScore: 9,
};
