import { MixedNumberBars, PieceBars } from "../diagrams";
import { choice, numberBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import { Frac } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { addProperParams, addRegroupParams, mixedAdd, mixedBorrowParams, mixedNoRegroupParams, mixedSubtract, mixedText, pickDistractors, pieceWord, subProperParams } from "../lib/fractions";
import { amountStep } from "../lib/steps";

// Self-contained: never imports the paired AddSubtractFractions.tsx.

type Diff = TestQuestion["difficulty"];
const M = ({ w, n, d }: { w: number; n: number; d: number }) => (
  <span style={{ whiteSpace: "nowrap" }}>
    {w} <Frac n={n} d={d} />
  </span>
);

/** Q1 — add two proper fractions, sum stays proper. */
export function addProperQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const { n1, n2, d } = addProperParams();
  return [
    {
      visual: <PieceBars den={d} segments={[{ count: n1, tone: "a" }, { count: n2, tone: "b" }]} barWidth={240} />,
      difficulty,
      step: amountStep(
        {
          prompt: (
            <>
              <Frac n={n1} d={d} /> + <Frac n={n2} d={d} /> = ?
            </>
          ),
          hint: "Same-size pieces — just count them all.",
          explain: `${n1} + ${n2} = ${n1 + n2} pieces of 1/${d}, so the sum is ${n1 + n2}/${d}.`,
        },
        n1 + n2,
        d
      ),
    },
  ];
}

/** Q2 — the add-the-denominators trap, as a choice. */
export function addDenominatorTrapQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  let p = addProperParams();
  while (p.n1 === p.n2) p = addProperParams();
  const { n1, n2, d } = p;
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: (
            <>
              What is <Frac n={n1} d={d} /> + <Frac n={n2} d={d} />?
            </>
          ),
          hint: "Does putting pieces together change how big each piece is?",
          explain: `Add the numerators (how many pieces) and keep the denominator (the piece size): ${n1 + n2}/${d}.`,
        },
        `${n1 + n2}/${d}`,
        [
          `${n1 + n2}/${2 * d}`, // added the denominators too
          `${Math.abs(n1 - n2)}/${d}`, // subtracted instead of adding
        ]
      ),
    },
  ];
}

/** Q3 — improper sum, finish as a mixed number. */
export function addRegroupQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { n1, n2, d } = addRegroupParams();
  const s = n1 + n2;
  return [
    {
      visual: <PieceBars den={d} segments={[{ count: n1, tone: "a" }, { count: n2, tone: "b" }]} barWidth={200} />,
      difficulty,
      step: amountStep(
        {
          prompt: (
            <>
              <Frac n={n1} d={d} /> + <Frac n={n2} d={d} /> = ?
            </>
          ),
          hint: `${n1} + ${n2} = ${s} pieces. ${d} of them fill one whole.`,
          explain: `${s}/${d} = ${d}/${d} + ${s - d}/${d} = ${mixedText(s, d)}.`,
        },
        s,
        d
      ),
    },
  ];
}

/** Q4 — subtract two proper fractions. */
export function subProperQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const { n1, n2, d } = subProperParams();
  return [
    {
      visual: null,
      difficulty,
      step: amountStep(
        {
          prompt: (
            <>
              <Frac n={n1} d={d} /> − <Frac n={n2} d={d} /> = ?
            </>
          ),
          hint: `Start with ${n1} pieces and take ${n2} away.`,
          explain: `${n1} − ${n2} = ${n1 - n2}, and the pieces are still ${pieceWord(d)}: ${n1 - n2}/${d}.`,
        },
        n1 - n2,
        d
      ),
    },
  ];
}

/** Q5/Q6 — mixed ± mixed, no regrouping. */
export function mixedNoRegroupQuestion(op: "add" | "sub", difficulty: Diff = "medium"): TestQuestion[] {
  const { w1, n1, w2, n2, d } = mixedNoRegroupParams(op);
  const r = op === "add" ? mixedAdd(w1, n1, w2, n2, d) : mixedSubtract(w1, n1, w2, n2, d);
  const sign = op === "add" ? "+" : "−";
  return [
    {
      visual: null,
      difficulty,
      step: amountStep(
        {
          prompt: (
            <>
              <M w={w1} n={n1} d={d} /> {sign} <M w={w2} n={n2} d={d} /> = ?
            </>
          ),
          hint: `Do the whole numbers (${w1} ${sign} ${w2}), then the fractions (${n1}/${d} ${sign} ${n2}/${d}).`,
          explain: `${w1} ${sign} ${w2} = ${r.resultWhole}, and ${n1}/${d} ${sign} ${n2}/${d} = ${r.resultNum}/${d}: ${mixedText(r.resultWhole * d + r.resultNum, d)}.`,
        },
        r.resultWhole * d + r.resultNum,
        d
      ),
    },
  ];
}

/** Q7 — the unbundling step itself: rewrite the first number. */
export function mixedUnbundleQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { w1, n1, w2, n2, d } = mixedBorrowParams(1);
  const b = mixedSubtract(w1, n1, w2, n2, d);
  return [
    {
      visual: <MixedNumberBars wholes={w1} num={n1} den={d} />,
      difficulty,
      step: sentence(
        {
          prompt: (
            <>
              To find <M w={w1} n={n1} d={d} /> − <M w={w2} n={n2} d={d} />, first unbundle one whole of <M w={w1} n={n1} d={d} /> into {d}/{d}. What do you get?
            </>
          ),
          hint: `One whole becomes ${d} pieces. Add them to the ${n1} loose pieces; one fewer whole is left.`,
          explain: `${w1} ${n1}/${d} = ${b.regroupedWhole} + ${d}/${d} + ${n1}/${d} = ${b.regroupedWhole} ${b.regroupedNum}/${d}.`,
        },
        `${w1} ${n1}/${d} = `,
        numberBlank(b.regroupedWhole),
        " ",
        numberBlank(b.regroupedNum),
        `/${d}`
      ),
    },
  ];
}

/** Q8/Q10 — full borrow subtraction. */
export function mixedBorrowQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const { w1, n1, w2, n2, d } = mixedBorrowParams(1);
  const b = mixedSubtract(w1, n1, w2, n2, d);
  return [
    {
      visual: null,
      difficulty,
      step: amountStep(
        {
          prompt: (
            <>
              <M w={w1} n={n1} d={d} /> − <M w={w2} n={n2} d={d} /> = ?
            </>
          ),
          hint: `${n1}/${d} is less than ${n2}/${d}, so unbundle one whole first.`,
          explain: `${w1} ${n1}/${d} = ${b.regroupedWhole} ${b.regroupedNum}/${d}. Then ${b.regroupedWhole} − ${w2} = ${b.resultWhole} and ${b.regroupedNum}/${d} − ${n2}/${d} = ${b.resultNum}/${d}.`,
        },
        b.resultWhole * d + b.resultNum,
        d
      ),
    },
  ];
}

/** Q9 — the flip trap: subtracting the smaller fraction from the bigger one. */
export function borrowFlipTrapQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const { w1, n1, w2, n2, d } = mixedBorrowParams(1);
  const b = mixedSubtract(w1, n1, w2, n2, d);
  const correct = mixedText(b.resultWhole * d + b.resultNum, d);
  const distractors = pickDistractors(correct, [
    mixedText((w1 - w2) * d + (n2 - n1), d), // flipped: did n2 − n1 to avoid borrowing
    mixedText((w1 - w2) * d + b.resultNum, d), // unbundled a whole but forgot to take it away from the wholes
    mixedText((w1 - w2) * d + n1, d), // ignored the fraction being subtracted
    mixedText((w1 - w2 + 1) * d + b.resultNum, d), // wholes off by one the other way
  ]);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: (
            <>
              What is <M w={w1} n={n1} d={d} /> − <M w={w2} n={n2} d={d} />?
            </>
          ),
          hint: "Check by adding your answer back to the number you subtracted.",
          explain: `Unbundle: ${w1} ${n1}/${d} = ${b.regroupedWhole} ${b.regroupedNum}/${d}. Then subtract: ${correct}. Flipping to ${n2} − ${n1} gives a number that doesn't add back correctly.`,
        },
        correct,
        distractors
      ),
    },
  ];
}

export const addSubtractFractionsTest: Unit["test"] = {
  questions: [
    () => addProperQuestion("easy"),
    () => addDenominatorTrapQuestion("medium"),
    () => addRegroupQuestion("medium"),
    () => subProperQuestion("easy"),
    () => mixedNoRegroupQuestion("add", "medium"),
    () => mixedNoRegroupQuestion("sub", "medium"),
    () => mixedUnbundleQuestion("medium"),
    () => mixedBorrowQuestion("hard"),
    () => borrowFlipTrapQuestion("hard"),
    () => mixedBorrowQuestion("hard"),
  ],
  passScore: 9,
};
