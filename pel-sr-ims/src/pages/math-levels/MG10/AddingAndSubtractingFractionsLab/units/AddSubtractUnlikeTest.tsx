import { RecutBars } from "../diagrams";
import { choice, fractionStep, type TestQuestion } from "../../../shared/engine/types";
import { Frac } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { pick } from "../../../shared/lib/math";
import { combine, gcd, lcdDiagnose, NAMED_SHARED_PAIRS, properNum, resultDiagnose, signOf, simplestText, twoPeople, u3Params, type U3Bucket } from "../lib/fractions";

// Self-contained: never imports the paired AddSubtractUnlike.tsx.

type Diff = TestQuestion["difficulty"];

/** Q1-Q6 — compute a sum or difference in simplest form, one per bucket (separate pools). */
export function computeQuestion(difficulty: Diff, bucket: U3Bucket, withPicture = false): TestQuestion[] {
  const { op, n1, d1, n2, d2 } = u3Params(bucket);
  const { L, a, b, r } = combine(op, n1, d1, n2, d2);
  const sign = signOf(op);
  const ans = simplestText(r, L);
  return [
    {
      visual: withPicture ? <RecutBars n1={n1} d1={d1} n2={n2} d2={d2} op={op} /> : null,
      difficulty,
      step: fractionStep(
        {
          prompt: (
            <>
              <Frac n={n1} d={d1} /> {sign} <Frac n={n2} d={d2} /> = ? Write it in simplest form.
            </>
          ),
          hint: "Find the LCD and rewrite both first.",
          explain: `The LCD is ${L}. ${a}/${L} ${sign} ${b}/${L} = ${r}/${L}${ans !== `${r}/${L}` ? ` = ${ans}` : ""}.`,
        },
        r,
        L,
        { mixed: true, simplest: true, diagnose: resultDiagnose(op, n1, d1, n2, d2) }
      ),
    },
  ];
}

/** Q7 — pick the simplest-form sum; one distractor is EQUAL but not simplified. */
export function simplestChoiceQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { op, n1, d1, n2, d2 } = u3Params(pick(["addSimplify", "subSimplify"] as U3Bucket[]));
  const { L, a, b, r } = combine(op, n1, d1, n2, d2);
  const sign = signOf(op);
  const right = simplestText(r, L);
  // The second distractor is a named mistake that a student can't throw out at
  // a glance (no 0 on top, no improper "4/2" in a simplest-form question).
  const tn = Math.abs(n1 - n2);
  const td = Math.abs(d1 - d2);
  const traps: [number, number][] =
    op === "add"
      ? [[n1 + n2, d1 + d2]] // added across (tops + tops, bottoms + bottoms)
      : [
          ...(tn > 0 && td > 0 && tn < td ? [[tn, td] as [number, number]] : []), // subtracted across
          ...(n1 > n2 ? [[n1 - n2, L] as [number, number]] : []), // subtracted the old tops, over the LCD
          [a + b, L], // added instead of subtracting
        ];
  const [trapN, trapD] = traps.find(([n, d]) => n * L !== r * d) ?? traps[traps.length - 1];
  const trap = op === "add" ? `${trapN}/${trapD}` : simplestText(trapN, trapD);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `What is ${n1}/${d1} ${sign} ${n2}/${d2} in simplest form?`,
          hint: "Find the answer over the LCD. Then divide the top and bottom by any common factor.",
          explain: `${r}/${L} = ${simplestText(r, L)}: divide the top and bottom by ${gcd(r, L)}.`,
        },
        right,
        [
          `${r}/${L}`, // equal, but not in simplest form
          trap, // a named mistake: across, the old tops, or the wrong operation
        ]
      ),
    },
  ];
}

/** Q8 — an improper sum must be finished as a mixed number. */
export function improperChoiceQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { n1, d1, n2, d2 } = u3Params("addMixed");
  const { L, r } = combine("add", n1, d1, n2, d2);
  const g = gcd(r, L);
  const sn = r / g;
  const sd = L / g;
  const [p] = twoPeople();
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${p.name} found ${n1}/${d1} + ${n2}/${d2} = ${r}/${L}. What is the answer in simplest form?`,
          hint: `${L}/${L} is 1 whole. How much is left?`,
          explain: `${r}/${L} = ${simplestText(r, L)}. Each ${L}/${L} is 1 whole. Write the rest as a fraction in simplest form.`,
        },
        simplestText(r, L),
        [
          `${r}/${L}`, // thinks an improper fraction is finished
          `1 ${sn}/${sd}`, // put a 1 in front but copied the whole top
        ]
      ),
    },
  ];
}

/** Q9 — the LCD for a sum where multiplying the denominators is NOT the least. */
export function sumLcdQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const [x, y] = pick(NAMED_SHARED_PAIRS);
  const [d1, d2] = Math.random() < 0.5 ? [x, y] : [y, x];
  const n1 = properNum(d1);
  const n2 = properNum(d2);
  const L = (d1 * d2) / gcd(d1, d2);
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `To add ${n1}/${d1} + ${n2}/${d2}, what LCD should you use?`,
        hint: `Find the smallest number both ${d1} and ${d2} go into.`,
        explain: `${L}. ${d1} × ${d2} = ${d1 * d2} also works, but it is not the least.`,
        answer: L,
        diagnose: lcdDiagnose(d1, d2),
      },
    },
  ];
}

/** Q10 — subtracting across: what went wrong. */
export function subtractAcrossQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  for (let guard = 0; guard < 200; guard++) {
    const { n1, d1, n2, d2 } = u3Params(pick(["subPlain", "subSimplify"] as U3Bucket[]));
    if (d1 <= d2 || n1 <= n2) continue;
    const [p] = twoPeople();
    const { L, r } = combine("sub", n1, d1, n2, d2);
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `${p.name} says ${n1}/${d1} − ${n2}/${d2} = ${n1 - n2}/${d1 - d2}. What went wrong?`,
            hint: "Were the pieces the same size?",
            explain: `${p.name} subtracted across. First rewrite with the LCD, ${L}. The answer is ${simplestText(r, L)}.`,
          },
          `${p.name} subtracted across, but the pieces were different sizes.`,
          [
            `The answer is right. It only needs to be in simplest form.`, // treats a wrong value as only a simplest-form problem
            `${p.name} should have added instead.`, // switches the operation
          ]
        ),
      },
    ];
  }
  return subtractAcrossQuestion(difficulty);
}

export const addSubtractUnlikeTest: NonNullable<Unit["test"]> = {
  questions: [
    () => computeQuestion("easy", "addPlain", true),
    () => computeQuestion("medium", "addSimplify"),
    () => computeQuestion("hard", "addMixed"),
    () => computeQuestion("easy", "subPlain"),
    () => computeQuestion("medium", "subSimplify"),
    () => computeQuestion("hard", "subWhole"),
    () => simplestChoiceQuestion("medium"),
    () => improperChoiceQuestion("medium"),
    () => sumLcdQuestion("medium"),
    () => subtractAcrossQuestion("hard"),
  ],
  passScore: 9,
};
