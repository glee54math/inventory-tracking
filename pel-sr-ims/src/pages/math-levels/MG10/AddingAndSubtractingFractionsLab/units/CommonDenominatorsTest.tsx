import { MultiplesList } from "../diagrams";
import { choice, fractionStep, numberBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import { Frac } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { pick } from "../../../shared/lib/math";
import { COPRIME_PAIRS, lcd, lcdDiagnose, mixedRaw, NAMED_SHARED_PAIRS, pairOf, pieceWord, properNum, sameValue, twoPeople, type PairKind } from "../lib/fractions";

// Self-contained: never imports the paired CommonDenominators.tsx.

type Diff = TestQuestion["difficulty"];

/** Q1-Q3 — type the LCD; one pair kind each (separate pools). Any other common denominator is wrong. */
export function lcdQuestion(difficulty: Diff, kind: PairKind, withList = false): TestQuestion[] {
  const [a, b] = pairOf(kind);
  const L = lcd(a, b);
  return [
    {
      visual: withList ? <MultiplesList a={a} b={b} /> : null,
      difficulty,
      step: {
        kind: "number",
        prompt: `What is the LCD of ${a} and ${b}?`,
        hint: `Find the smallest number both ${a} and ${b} go into.`,
        explain: L === a * b ? `${L} is the first number both go into.` : `${L} is the first number both go into. ${a} × ${b} = ${a * b} is a common denominator, but not the least.`,
        answer: L,
        diagnose: lcdDiagnose(a, b),
      },
    },
  ];
}

/** Q4 — "24 is a common denominator but not the LCD" (vocabulary conflation). */
export function notLeastQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const [a, b] = pick(NAMED_SHARED_PAIRS);
  const L = lcd(a, b);
  const P = a * b;
  const [p] = twoPeople();
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${p.name} uses ${P} as the denominator for ${properNum(a)}/${a} + ${properNum(b)}/${b}. Which is true?`,
          hint: `Do ${a} and ${b} both go into ${P}? Is there a smaller number they both go into?`,
          explain: `Both go into ${P}, so it is a common denominator. But ${L} is smaller, so ${L} is the LCD.`,
        },
        `${P} is a common denominator, but the LCD is ${L}.`,
        [
          `${P} is the LCD.`, // thinks "common denominator" and "LCD" mean the same thing
          `${P} is not a common denominator.`, // thinks only the least one counts as common
        ]
      ),
    },
  ];
}

/** Q5 — for which pair is the LCD less than the product? */
export function smallerThanProductQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const [a, b] = pick(NAMED_SHARED_PAIRS);
  const others = [...COPRIME_PAIRS].sort(() => Math.random() - 0.5).slice(0, 2);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: "Multiply the two denominators in each pair. For which pair is the LCD smaller than that?",
          hint: "Look for two denominators that share a factor bigger than 1.",
          explain: `${a} and ${b} share a factor, so the LCD is ${lcd(a, b)}, less than ${a} × ${b} = ${a * b}. Pairs with no common factor have the product as the LCD.`,
        },
        `${a} and ${b}`,
        others.map(([x, y]) => `${x} and ${y}`) // pairs with no shared factor: the product IS the LCD (misconception: any pair has a smaller one)
      ),
    },
  ];
}

/** Q6 — rewrite one fraction with a given denominator. */
export function rewriteOneQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const [d1, d2] = pairOf(pick(["shared", "multiple"] as PairKind[]));
  const L = lcd(d1, d2);
  const n = properNum(d1);
  return [
    {
      visual: null,
      difficulty,
      step: fractionStep(
        {
          prompt: (
            <>
              The LCD is {L}. <Frac n={n} d={d1} /> = ?/{L}
            </>
          ),
          hint: `${d1} × ${L / d1} = ${L}. Multiply the top by ${L / d1} too.`,
          explain: `${n} × ${L / d1} = ${(n * L) / d1}, so ${n}/${d1} = ${(n * L) / d1}/${L}.`,
        },
        (n * L) / d1,
        L,
        { den: L }
      ),
    },
  ];
}

/** Q7/Q8 — rewrite both (fractions, or mixed numbers whose wholes don't change). */
export function rewriteBothQuestion(difficulty: Diff, mixedNumbers = false): TestQuestion[] {
  let [d1, d2] = pairOf(pick(["shared", "coprime"] as PairKind[]));
  let n1 = properNum(d1);
  let n2 = properNum(d2);
  while (sameValue(n1, d1, n2, d2)) {
    [d1, d2] = pairOf("shared");
    n1 = properNum(d1);
    n2 = properNum(d2);
  }
  const L = lcd(d1, d2);
  const w1 = mixedNumbers ? pick([1, 2, 3, 4]) : 0;
  const w2 = mixedNumbers ? pick([2, 3, 5, 6]) : 0;
  const lead = (w: number) => (w ? `${w} ` : "");
  return [
    {
      visual: null,
      difficulty,
      step: sentence(
        {
          prompt: `Rewrite ${mixedRaw(w1, n1, d1)} and ${mixedRaw(w2, n2, d2)} with the LCD, ${L}.`,
          hint: `What do you multiply each bottom by to get ${L}? Multiply its top by the same number.`,
          explain: `${n1}/${d1} = ${(n1 * L) / d1}/${L} and ${n2}/${d2} = ${(n2 * L) / d2}/${L}.${mixedNumbers ? " The whole numbers stay the same." : ""}`,
        },
        `${lead(w1)}${n1}/${d1} = ${lead(w1)}`,
        numberBlank((n1 * L) / d1),
        `   and   ${lead(w2)}${n2}/${d2} = ${lead(w2)}`,
        numberBlank((n2 * L) / d2),
        "",
        [L, L]
      ),
    },
  ];
}

/** Q9 — compare two fractions using a common denominator. */
export function compareQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  // Pairs where the fraction with the BIGGER numbers is the SMALLER fraction half the time.
  for (let guard = 0; guard < 200; guard++) {
    const [d1, d2] = pairOf(pick(["shared", "coprime"] as PairKind[]));
    const n1 = properNum(d1);
    const n2 = properNum(d2);
    if (sameValue(n1, d1, n2, d2)) continue;
    const L = lcd(d1, d2);
    const a = (n1 * L) / d1;
    const b = (n2 * L) / d2;
    const bigger = a > b ? `${n1}/${d1}` : `${n2}/${d2}`;
    const smaller = a > b ? `${n2}/${d2}` : `${n1}/${d1}`;
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `Which is bigger, ${n1}/${d1} or ${n2}/${d2}?`,
            hint: "Rewrite both with the LCD. Then compare the tops.",
            explain: `${n1}/${d1} = ${a}/${L} and ${n2}/${d2} = ${b}/${L}. ${Math.max(a, b)}/${L} is bigger.`,
          },
          bigger,
          [
            smaller, // picked by bigger-looking numbers, or by guessing
            "They are equal", // both look "one or two pieces short" of a whole
          ]
        ),
      },
    ];
  }
  return compareQuestion(difficulty);
}

/** Q10 — HOW to rewrite: multiply top AND bottom by the same number. */
export function howToRewriteQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const d = pick([3, 4, 5, 6]);
  const k = pick([2, 3, 4]);
  const n = properNum(d);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `How do you rewrite ${n}/${d} in ${pieceWord(d * k)}?`,
          hint: `${d} × ? = ${d * k}`,
          explain: `Multiply the top and bottom by ${k}: ${n}/${d} = ${n * k}/${d * k}. That keeps the same amount.`,
        },
        `Multiply the top and bottom by ${k}.`,
        [
          `Multiply only the bottom by ${k}.`, // changes the size of the fraction
          `Add ${d * k - d} to the top and bottom.`, // additive thinking
        ]
      ),
    },
  ];
}

export const commonDenominatorsTest: NonNullable<Unit["test"]> = {
  questions: [
    () => lcdQuestion("easy", "multiple", true),
    () => lcdQuestion("medium", "coprime"),
    () => lcdQuestion("hard", "shared"),
    () => notLeastQuestion("medium"),
    () => smallerThanProductQuestion("hard"),
    () => rewriteOneQuestion("easy"),
    () => rewriteBothQuestion("medium"),
    () => rewriteBothQuestion("medium", true),
    () => compareQuestion("hard"),
    () => howToRewriteQuestion("medium"),
  ],
  passScore: 9,
};
