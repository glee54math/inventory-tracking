import { MixedBars, MixedNumberBars } from "../diagrams";
import { choice, fractionStep, numberBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { pick } from "../../../shared/lib/math";
import { mixedAddDiagnose, mixedBreakdown, mixedRaw, mixedSubDiagnose, signOf, simplestText, twoPeople, u4Params, type U4Bucket, type U4Params } from "../lib/fractions";

// Self-contained: never imports the paired MixedNumbers.tsx.

type Diff = TestQuestion["difficulty"];
const text = (p: U4Params) => `${mixedRaw(p.w1, p.n1, p.d1)} ${signOf(p.op)} ${mixedRaw(p.w2, p.n2, p.d2)}`;

/** Q1-Q5 — compute in simplest form, one per bucket (separate pools). */
export function mixedComputeQuestion(difficulty: Diff, bucket: U4Bucket, withPicture = false): TestQuestion[] {
  const p = u4Params(bucket);
  const m = mixedBreakdown(p);
  const ans = simplestText(m.total, m.L);
  return [
    {
      visual: withPicture ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <MixedNumberBars wholes={p.w1} num={p.n1} den={p.d1} tone="a" barWidth={100} height={32} />
          <MixedNumberBars wholes={p.w2} num={p.n2} den={p.d2} tone="b" barWidth={100} height={32} />
        </div>
      ) : null,
      difficulty,
      step: fractionStep(
        {
          prompt: `${text(p)} = ? Write it in simplest form.`,
          hint: "Rewrite the fraction parts with the LCD. Borrow 1 whole or carry 1 whole if you need to.",
          explain:
            p.op === "add"
              ? `${mixedRaw(p.w1, m.a, m.L)} + ${mixedRaw(p.w2, m.b, m.L)} = ${mixedRaw(m.rw, m.rn, m.L)} = ${ans}.`
              : `${m.borrow ? `Borrow: ${mixedRaw(p.w1, m.a, m.L)} = ${mixedRaw(m.bw, m.ba, m.L)}. ` : ""}${mixedRaw(m.bw, m.ba, m.L)} − ${mixedRaw(p.w2, m.b, m.L)} = ${ans}.`,
        },
        m.total,
        m.L,
        { mixed: true, simplest: true, diagnose: p.op === "add" ? mixedAddDiagnose(p.w1, p.n1, p.d1, p.w2, p.n2, p.d2) : mixedSubDiagnose(p.w1, p.n1, p.d1, p.w2, p.n2, p.d2) }
      ),
    },
  ];
}

/** Q6 — the borrow rewrite itself, typed. */
export function borrowRewriteQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const p = u4Params("subBorrow");
  const m = mixedBreakdown(p);
  return [
    {
      visual: <MixedBars wholes={p.w1} num={m.a} den={m.L} barWidth={100} height={32} />,
      difficulty,
      step: sentence(
        {
          prompt: `Borrow 1 whole from ${mixedRaw(p.w1, m.a, m.L)}. What do you get?`,
          hint: `1 whole = ${m.L}/${m.L}.`,
          explain: `${mixedRaw(p.w1, m.a, m.L)} = ${m.bw} + ${m.L}/${m.L} + ${m.a}/${m.L} = ${mixedRaw(m.bw, m.ba, m.L)}.`,
        },
        `${mixedRaw(p.w1, m.a, m.L)} = `,
        numberBlank(m.bw),
        " ",
        numberBlank(m.ba),
        "",
        [undefined, m.L]
      ),
    },
  ];
}

/** Q7 — which subtraction needs borrowing? (decided after the LCD, not by the size of the numbers). */
export function needsBorrowQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  for (let guard = 0; guard < 500; guard++) {
    const yes = u4Params("subBorrow");
    const no = u4Params("subNoBorrow");
    // The "no" problem has a bigger second numerator, so it LOOKS like it needs borrowing.
    if (no.n2 <= no.n1) continue;
    const plain = u4Params("subNoBorrow");
    if (text(plain) === text(no)) continue;
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: "Which problem needs borrowing?",
            hint: "Rewrite each pair of fraction parts with the LCD. Is the first fraction smaller?",
            explain: `In ${text(yes)}, the first fraction part is smaller than the second one, so you borrow.`,
          },
          text(yes),
          [
            text(no), // bigger second NUMERATOR, but the first fraction is bigger after the LCD
            text(plain), // no borrowing needed
          ]
        ),
      },
    ];
  }
  return needsBorrowQuestion(difficulty);
}

/** Q8 — the right answer against the two named borrowing mistakes. */
export function borrowMistakeQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  for (let guard = 0; guard < 500; guard++) {
    const p = u4Params("subBorrow");
    const m = mixedBreakdown(p);
    const flipped = (p.w1 - p.w2) * m.L + (m.b - m.a);
    const forgot = (p.w1 - p.w2) * m.L + (m.a + m.L - m.b);
    if (flipped === m.total || forgot === m.total || flipped === forgot) continue;
    const [person] = twoPeople();
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `${person.name} works on ${text(p)}. Which answer is right?`,
            hint: "Rewrite with the LCD. Is the first fraction too small? Then borrow.",
            explain: `${mixedRaw(p.w1, m.a, m.L)} = ${mixedRaw(m.bw, m.ba, m.L)} after borrowing. Then ${mixedRaw(m.bw, m.ba, m.L)} − ${mixedRaw(p.w2, m.b, m.L)} = ${simplestText(m.total, m.L)}.`,
          },
          simplestText(m.total, m.L),
          [
            simplestText(flipped, m.L), // switched the fractions instead of borrowing
            simplestText(forgot, m.L), // borrowed, but never took the 1 away from the whole number
          ]
        ),
      },
    ];
  }
  return borrowMistakeQuestion(difficulty);
}

/** Q9 — carrying: a fraction part of 1 or more must become a whole. */
export function carryQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const p = u4Params("addCarry");
  const m = mixedBreakdown(p);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${text(p)} = ${mixedRaw(m.rw, m.rn, m.L)}. What is it in simplest form?`,
          hint: `${m.L}/${m.L} is 1 whole. Carry it to the whole number.`,
          explain: `${m.rn}/${m.L} = 1 ${m.rn - m.L}/${m.L}, so ${mixedRaw(m.rw, m.rn, m.L)} = ${simplestText(m.total, m.L)}.`,
        },
        simplestText(m.total, m.L),
        [
          mixedRaw(m.rw, m.rn, m.L), // thinks a fraction part bigger than 1 is finished
          m.rn - m.L === 0 ? `${m.rw}` : `${m.rw} ${simplestText(m.rn - m.L, m.L)}`, // took the whole out of the fraction but dropped it
        ]
      ),
    },
  ];
}

/** Q10 — what borrowing does to the first number. */
export function borrowMeaningQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const d = pick([3, 4, 5, 6, 8]);
  const w = pick([3, 4, 5, 6]);
  const n = pick([1, 2].filter((x) => x < d));
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `You borrow 1 whole from ${w} ${n}/${d}. How do you write ${w} ${n}/${d} now?`,
          hint: `1 whole = ${d}/${d}. Take it from ${w}, then add it to the ${n}/${d}.`,
          explain: `${w} ${n}/${d} = ${w - 1} + ${d}/${d} + ${n}/${d} = ${w - 1} ${n + d}/${d}.`,
        },
        `${w - 1} ${n + d}/${d}`,
        [
          `${w} ${n + d}/${d}`, // added the pieces but didn't take 1 from the whole
          `${w - 1} ${n}/${d}`, // took 1 from the whole but didn't add the pieces
        ]
      ),
    },
  ];
}

export const mixedNumbersTest: NonNullable<Unit["test"]> = {
  questions: [
    () => mixedComputeQuestion("easy", "addNoCarry", true),
    () => mixedComputeQuestion("medium", "addCarry"),
    () => mixedComputeQuestion("easy", "subNoBorrow"),
    () => mixedComputeQuestion("hard", "subBorrow"),
    () => mixedComputeQuestion("medium", "subFromWhole"),
    () => borrowRewriteQuestion("medium"),
    () => needsBorrowQuestion("hard"),
    () => borrowMistakeQuestion("hard"),
    () => carryQuestion("medium"),
    () => borrowMeaningQuestion("easy"),
  ],
  passScore: 9,
};
