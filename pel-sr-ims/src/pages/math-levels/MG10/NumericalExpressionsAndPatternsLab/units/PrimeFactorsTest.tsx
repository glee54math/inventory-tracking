import { choice, factorsStep, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { pick, shuffle } from "../../../shared/lib/math";
import { ALL_PRIMES, factorPairsNoOne, LONG, LONG_MANY, LOOK_PRIME, MANY_TREES, PRIMES, primeFactors, reordered, SHORT, timesText } from "../lib/primes";
import { judgeStep } from "../lib/primeSteps";

// Self-contained: never imports the paired PrimeFactors.tsx.
// Number pools (lib/primes.ts) don't overlap, so two questions on the same
// skill never come out the same.

type Diff = TestQuestion["difficulty"];

/** Type the prime factors (any order). A prime number is written as just itself. */
export function primeFactorsQuestion(difficulty: Diff, pool: readonly number[]): TestQuestion[] {
  const n = pick(pool);
  return [
    {
      visual: null,
      difficulty,
      step: factorsStep(
        {
          prompt: `Write ${n} as a product of prime factors.`,
          hint: "Start with any factor pair. Keep breaking numbers that are not prime.",
          explain: primeFactors(n).length === 1 ? `${n} is prime. Its only factors are 1 and ${n}, so you write just ${n}.` : `${n} = ${timesText(primeFactors(n))}. Every factor is prime.`,
        },
        n
      ),
    },
  ];
}

/**
 * Which number is prime? One prime and two look-alike composites (odd, not
 * ending in 5). Half the time it is turned around (round 1, C1-08): which
 * number is NOT prime? One look-alike among two primes.
 */
export function whichPrimeQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const notAsk = Math.random() < 0.5;
  const p = pick(PRIMES);
  const comp = pick(LOOK_PRIME);
  const third = notAsk ? pick(PRIMES.filter((x) => x !== p)) : pick(LOOK_PRIME.filter((x) => x !== comp));
  const shown = [p, comp, third];
  const right = notAsk ? comp : p;
  const primes = shown.filter((x) => ALL_PRIMES.includes(x));
  const composites = shown.filter((x) => !ALL_PRIMES.includes(x));
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: notAsk ? "Which number is NOT prime?" : "Which number is prime?",
          hint: "Try dividing each number by 3 and by 7.",
          explain: `${primes.join(" and ")} ${primes.length > 1 ? "have" : "has"} only the factors 1 and ${primes.length > 1 ? "themselves" : "itself"}. ${composites
            .map((o) => `${o} = ${timesText(factorPairsNoOne(o)[0])}`)
            .join(" and ")}.`,
        },
        String(right),
        // "prime": odd numbers that "look" prime but have a factor pair. "NOT prime": the two real primes.
        shown.filter((x) => x !== right).map(String)
      ),
    },
  ];
}

/** Start a factor tree: any factor pair other than 1 × n. */
export function factorPairQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const n = pick(MANY_TREES);
  return [
    {
      visual: null,
      difficulty,
      step: factorsStep(
        {
          prompt: `Start a factor tree for ${n}. Type a factor pair. Don't use 1.`,
          hint: `Which small numbers divide ${n} evenly? Try 2, 3 and 5.`,
          explain: `Any of these works: ${factorPairsNoOne(n).map(timesText).join(", ")}.`,
        },
        n,
        { pair: true }
      ),
    },
  ];
}

/**
 * Two different starting pairs: where do the trees end? Two forms, so the
 * right choice's wording isn't fixed (round 1, C1-19): "where will both
 * trees end?", or "Mia's tree ends with these primes; what does Leo's end
 * with?" (the answer is a list of primes, against Leo's starting pair and a
 * different set of primes).
 */
export function sameEndQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const n = pick(MANY_TREES);
  const [p1, p2] = shuffle(factorPairsNoOne(n)).slice(0, 2);
  const f = primeFactors(n);
  const primes = timesText(f);
  if (Math.random() < 0.5) {
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `Mia starts a factor tree for ${n} with ${timesText(p1)}. Leo starts with ${timesText(p2)}. Where will their trees end?`,
            hint: "Finish both trees in your head, or on paper.",
            explain: `Every factor tree for ${n} ends with the same primes: ${primes}.`,
          },
          `Both end with ${primes}.`,
          [
            `Mia ends with ${timesText(p1)}, and Leo ends with ${timesText(p2)}.`, // stops at the starting pair
            "They end with different primes, because they started differently.", // the "different start, different answer" misconception
          ]
        ),
      },
    ];
  }
  // Different primes: swap one prime for another small prime (a different set, same count).
  const i = f.length - 1;
  const other = timesText(f.map((x, k) => (k === i ? (x === 2 ? 3 : 2) : x)).sort((a, b) => a - b));
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Mia starts a factor tree for ${n} with ${timesText(p1)}. Her tree ends with ${primes}. Leo starts with ${timesText(p2)}. What does Leo's tree end with?`,
          hint: "Finish Leo's tree in your head, or on paper.",
          explain: `Every factor tree for ${n} ends with the same primes: ${primes}.`,
        },
        primes,
        [
          timesText(p2), // stops at the starting pair
          other, // the "different start, different primes" misconception
        ]
      ),
    },
  ];
}

/** Judge someone's answer: same primes in another order / a factor that isn't prime / the wrong product. */
export function judgeQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  return [{ visual: null, difficulty, step: judgeStep(pick(MANY_TREES)) }];
}

/** Backward: which number has these prime factors? */
export function backwardQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const n = pick([...LONG, ...MANY_TREES]);
  const f = reordered(n);
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `Which number is ${timesText(f)}?`,
        hint: "Multiply two at a time.",
        explain: `${timesText(f)} = ${n}.`,
        answer: n,
      },
    },
  ];
}

/**
 * Kim's prime factorization: half the time a factor pair with a factor that
 * is not prime, half the time the right primes in another order (round 1,
 * C1-19), so "Nothing is wrong." is sometimes the answer. Both forms ask
 * "Is anything wrong?" (round 2, E2-21), so the question doesn't assume a mistake.
 */
export function notFinishedQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const n = pick(MANY_TREES);
  const nothing = "Nothing is wrong.";
  if (Math.random() < 0.5) {
    const claim = reordered(n);
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: `Kim says the prime factorization of ${n} is ${timesText(claim)}. Is anything wrong?`,
            hint: "Check each factor. Is it prime? Do they multiply to the number?",
            explain: `Every factor is prime, and ${timesText(claim)} = ${n}. The order doesn't matter, so nothing is wrong.`,
          },
          nothing,
          [
            "The primes are in the wrong order.", // thinks the order matters
            `${timesText(claim)} does not equal ${n}.`, // doesn't check the product
          ]
        ),
      },
    ];
  }
  const pair = pick(factorPairsNoOne(n).filter(([a, b]) => !ALL_PRIMES.includes(a) || !ALL_PRIMES.includes(b)));
  const bad = ALL_PRIMES.includes(pair[1]) ? pair[0] : pair[1];
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Kim says the prime factorization of ${n} is ${timesText(pair)}. Is anything wrong?`,
          hint: "Check each factor. Is it prime? Do they multiply to the number?",
          explain: `${bad} is not prime, so Kim is not done. ${n} = ${timesText(primeFactors(n))}.`,
        },
        `${bad} is not prime. Kim needs to split it into primes.`,
        [
          `${timesText(pair)} does not equal ${n}.`, // checks only the product
          nothing, // any factor pair counts as "the" answer
        ]
      ),
    },
  ];
}

export const primeFactorsTest: Unit["test"] = {
  questions: [
    () => primeFactorsQuestion("easy", SHORT),
    () => primeFactorsQuestion("hard", LONG_MANY),
    () => primeFactorsQuestion("medium", LONG.filter((x) => !LONG_MANY.includes(x))),
    () => primeFactorsQuestion("medium", PRIMES),
    () => whichPrimeQuestion("medium"),
    () => factorPairQuestion("easy"),
    () => sameEndQuestion("medium"),
    () => judgeQuestion("hard"),
    () => backwardQuestion("medium"),
    () => notFinishedQuestion("medium"),
  ],
  passScore: 9,
};

