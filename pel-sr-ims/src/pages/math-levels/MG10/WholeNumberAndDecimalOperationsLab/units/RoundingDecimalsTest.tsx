import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { randInt } from "../../../shared/lib/math";
import { decText, digitsOf, nearestText, roundAt, roundCase, showDec, twoPlacesCase, type Dec, type Places, type RoundBucket, type RoundCase } from "../lib/decimals";
import { roundStep } from "../lib/steps";

// Self-contained: never imports the paired RoundingDecimals.tsx. No number
// lines or charts: the Test gives no picture (Practice shows them only as help).

type Diff = TestQuestion["difficulty"];

/** A roundCase from the bucket, redrawn until it matches `ok`. */
function caseWhere(bucket: RoundBucket, ok: (c: RoundCase) => boolean): RoundCase {
  for (let i = 0; i < 5000; i++) {
    const c = roundCase(bucket);
    if (ok(c)) return c;
  }
  return roundCase(bucket);
}

const q = (difficulty: Diff, c: RoundCase): TestQuestion[] => [{ visual: null, difficulty, step: roundStep(c.x, c.p) }];

/** Q1/Q2/Q8 — round down / up, at tenths or hundredths (Q1, Q2) or to a whole number (Q8). */
export function roundQuestion(difficulty: Diff, bucket: "down" | "up", whole = false): TestQuestion[] {
  return q(difficulty, caseWhere(bucket, (c) => (whole ? c.p === 0 : c.p > 0)));
}

/** Q3 — exactly halfway (2.45 to tenths, 3.125 to hundredths): rounds up. */
export function halfwayQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const p: Places = Math.random() < 0.5 ? 1 : 2;
  const w = randInt(0, 9);
  const head = Array.from({ length: p }, () => randInt(0, 8)); // no 9 at the place: no carry here
  const ds = [...head, 5, 0, 0].slice(0, 3);
  const x: Dec = { t: w * 1000 + ds[0] * 100 + ds[1] * 10 + ds[2], p: (p + 1) as Places };
  return [{ visual: null, difficulty, step: roundStep(x, p) }];
}

/** Q4/Q5 — the carry: one 9 at tenths (4.97 -> 5.0), or two 9s at hundredths (2.996 -> 3.00). */
export function carryQuestion(difficulty: Diff, double: boolean): TestQuestion[] {
  return q(
    difficulty,
    caseWhere("carry", (c) => {
      if (!double) return c.p === 1;
      const { d } = digitsOf(c.x.t);
      return c.p === 2 && d[0] === 9;
    })
  );
}

/** Q6 — nothing to round (3.40 to tenths). */
export function exactQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  return q(difficulty, caseWhere("exact", (c) => c.p > 0));
}

/** Q7 — only the next digit decides: 5.749 to tenths is 5.7, not 5.8. */
export function nextOnlyQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const w = randInt(1, 9);
  const a = randInt(0, 8);
  const x: Dec = { t: w * 1000 + a * 100 + 40 + randInt(5, 9), p: 3 };
  const r = roundAt(x.t, 1).r;
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Round ${showDec(x)} to the nearest tenth.`,
          hint: "Which digit is just to the right of the tenths place?",
          explain: `The hundredths digit is 4, which is less than 5. ${showDec(x)} rounds down to ${decText(r, 1)}.`,
        },
        decText(r, 1),
        [
          decText(r + 100, 1), // rounded the 9 first, then the 4 (two roundings)
          decText(roundAt(x.t, 2).r, 2), // rounded to hundredths instead
          decText(Math.floor(x.t / 10) * 10, 2), // just dropped the last digit
        ]
      ),
    },
  ];
}

/**
 * Q9 — one number rounded to two places: two questions, each a roundStep
 * (round 2, C2-03), so the written places are graded as in Practice (4.30,
 * not 4.3). Each prompt says to write every place (writeEveryPlace).
 */
export function twoPlacesQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { t, places } = twoPlacesCase();
  const [a, b] = [...places].sort();
  const x: Dec = { t, p: 3 };
  return [
    { visual: null, difficulty, step: roundStep(x, a, `Round ${showDec(x)} to ${nearestText(a)}.`) },
    { visual: null, difficulty, step: roundStep(x, b, `Now round the same number, ${showDec(x)}, to ${nearestText(b)}.`) },
  ];
}

/** Q10 — which number rounds to this tenth? The wrong ones miss it on each side. */
export function whichRoundsQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  for (;;) {
    const T = randInt(11, 98) * 100; // 1.1 .. 9.8
    const right: Dec = Math.random() < 0.5 ? { t: T - randInt(1, 4) * 10, p: 2 } : { t: T + randInt(10, 49), p: 3 };
    if (right.p === 3 && right.t % 10 === 0) continue;
    const wrong: Dec[] = [
      { t: T + 50, p: 2 }, // exactly halfway above: rounds UP, past T (thinks halfway rounds down)
      { t: T - 50 - randInt(1, 9), p: 3 }, // like 4.249: the 4 decides, not the 9 (rounds down, below T)
      { t: T + 100 + randInt(1, 4) * 10, p: 2 }, // the right digits one tenth too far
    ];
    if (wrong.some((w) => roundAt(w.t, 1).r === T) || roundAt(right.t, 1).r !== T) continue;
    if (wrong.some((w) => w.t % 1000 === 0 || w.t < 1000)) continue;
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `Round to the nearest tenth. Which number rounds to ${decText(T, 1)}?`,
            hint: "Round each one: look at its hundredths digit.",
            explain: `${showDec(right)} rounds to ${decText(T, 1)}. ${wrong.map((w) => `${showDec(w)} rounds to ${decText(roundAt(w.t, 1).r, 1)}`).join(". ")}.`,
          },
          showDec(right),
          wrong.map(showDec)
        ),
      },
    ];
  }
}

/** Hand-maintained: 10 generators, Q9 gives two questions (shown in the test badge). */
export const ROUNDING_TEST_TOTAL = 11;

export const roundingTest: NonNullable<Unit["test"]> = {
  questions: [
    () => roundQuestion("easy", "down"),
    () => roundQuestion("easy", "up"),
    () => halfwayQuestion("medium"),
    () => carryQuestion("medium", false),
    () => carryQuestion("hard", true),
    () => exactQuestion("medium"),
    () => nextOnlyQuestion("hard"),
    () => roundQuestion("medium", Math.random() < 0.5 ? "down" : "up", true),
    () => twoPlacesQuestion("medium"),
    () => whichRoundsQuestion("hard"),
  ],
  // 11 questions (Q9 is two). 10 of 11 keeps the 90% bar of the old 9 of 10.
  passScore: 10,
};
