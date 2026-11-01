import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { PRIMES_TO_20, smallestFactor } from "../lib/numberTheory";

// Self-contained: never imports from PrimeComposite.tsx (see FactorPairsTest.tsx).

/** Odd composites that don't end in 5 — they "look" prime. */
export const LOOKS_PRIME = [21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93];
/** A large prime next to a similar-looking large composite. */
export const LARGE_PAIRS: [number, number][] = [
  [89, 91],
  [97, 91],
  [53, 51],
  [59, 57],
  [67, 69],
  [71, 69],
  [79, 77],
  [73, 77],
  [83, 87],
  [89, 87],
  [97, 93],
];
const SMALL_PRIMES = [3, 5, 7, 11, 13, 17, 19];

// Q1 — easy, choice: the special case of 1
export function oneQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        { prompt: "Is 1 prime, composite, or neither?", hint: "How many different factors does 1 have? A prime needs exactly two.", explain: "Neither — 1 has only one factor (itself). A prime has exactly two factors; a composite has more than two." },
        "Neither",
        [
          "Prime", // MISCONCEPTION: "1 can only be divided by 1 and itself, so it's prime"
          "Composite",
        ]
      ),
    },
  ];
}

// Q2 — easy, choice: the special case of 2
export function twoQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        { prompt: "Is 2 prime, composite, or neither?", hint: "List 2's factors.", explain: "Prime — 2's only factors are 1 and 2. It's the only even prime." },
        "Prime — its only factors are 1 and 2",
        [
          "Composite — it's even", // MISCONCEPTION: even = composite
          "Neither — it's too small",
        ]
      ),
    },
  ];
}

// Q3 — easy, choice: spot a small prime
export function whichSmallPrimeQuestion(): TestQuestion[] {
  const p = pick(SMALL_PRIMES);
  const oddComp = pick([9, 15, 21]);
  const even = pick([4, 6, 8, 10]);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        { prompt: "Which number is prime?", hint: "A prime has exactly one factor pair: 1 × itself.", explain: `${p} has only 1 × ${p}. ${oddComp} and ${even} have more pairs, and 1 is neither prime nor composite.` },
        String(p),
        [
          "1", // MISCONCEPTION: 1 is prime
          String(oddComp), // MISCONCEPTION: odd = prime
          String(even),
        ]
      ),
    },
  ];
}

// Q4 — medium: the missing factor that proves a "prime-looking" number composite
export function proveCompositeQuestion(): TestQuestion[] {
  const n = pick(LOOKS_PRIME);
  const a = smallestFactor(n);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: { kind: "number", prompt: `${n} looks prime, but ${n} = ${a} × ___. Fill in the missing factor.`, hint: `${n} ÷ ${a} = ?`, explain: `${n} = ${a} × ${n / a}, so ${n} has a second factor pair — it's composite.`, answer: n / a },
    },
  ];
}

// Q5 — medium, choice: a composite that looks prime
export function looksPrimeQuestion(): TestQuestion[] {
  const n = pick(LOOKS_PRIME);
  const a = smallestFactor(n);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Is ${n} prime or composite?`, hint: `Try dividing ${n} by 3, then by 7.`, explain: `Composite — ${n} = ${a} × ${n / a}. Being odd doesn't make a number prime.` },
        `Composite — ${n} = ${a} × ${n / a}`,
        [
          "Prime — it's odd and doesn't end in 5", // MISCONCEPTION: odd = prime
          "Prime — it isn't even, so it can't be split into a pair", // MISCONCEPTION: only even numbers have pairs
        ]
      ),
    },
  ];
}

// Q6 — medium, choice: which of these (from 1-20) is NOT prime?
export function notPrimeTo20Question(): TestQuestion[] {
  const odd = pick([1, 9, 15]);
  const primes = shuffle(PRIMES_TO_20).slice(0, 3);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: "Which of these is NOT a prime number?", hint: "The primes up to 20 are 2, 3, 5, 7, 11, 13, 17, 19.", explain: odd === 1 ? "1 is not prime — it's neither prime nor composite." : `${odd} = 3 × ${odd / 3}, so it's composite.` },
        String(odd),
        // Distractors are real primes — tempting ones: 2 (even), 11-19 (two digits)
        primes.map(String)
      ),
    },
  ];
}

// Q7 — hard, choice: a large prime next to a large composite
export function largePairQuestion(): TestQuestion[] {
  const [p, c] = pick(LARGE_PAIRS);
  const a = smallestFactor(c);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Which of these numbers is prime: ${Math.min(p, c)} or ${Math.max(p, c)}?`, hint: "Try dividing each one by 2, 3, 5, and 7.", explain: `${p} is prime (none of 2, 3, 5, 7 go in evenly). ${c} = ${a} × ${c / a}, so it's composite.` },
        String(p),
        [
          String(c),
          "Both — they're big odd numbers", // MISCONCEPTION: big odd number = prime
          "Neither — big numbers are always composite", // MISCONCEPTION: big = composite
        ]
      ),
    },
  ];
}

// Q8 — hard, choice: how to check a number up to 100
export function howToCheckQuestion(): TestQuestion[] {
  const [p] = pick(LARGE_PAIRS);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `What is a good way to check whether ${p} is prime?`, hint: "Every number up to 100 that has a second factor pair can be divided by 2, 3, 5, or 7.", explain: `Try 2, 3, 5, and 7. None go into ${p} evenly, so ${p} is prime. (11 × 11 = 121 is already past 100, so for numbers up to 100 those four checks are enough.)` },
        "Try dividing by 2, 3, 5, and 7 — if none go in evenly, it's prime",
        [
          "Check if it's odd — odd numbers are prime", // MISCONCEPTION: odd = prime
          "Check if it ends in 1, 3, 7, or 9 — those are prime", // MISCONCEPTION: last digit decides
          "Try dividing by 2 and 5 only", // MISCONCEPTION: only the "easy" divisors matter
        ]
      ),
    },
  ];
}

// Q9 — hard, choice: a multiple of a prime is composite
export function multipleOfPrimeQuestion(): TestQuestion[] {
  const k = pick([2, 3]);
  const p = pick([5, 7, 11, 13, 17, 19, 23, 29, 31].filter((x) => k * x <= 100));
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `${p} is prime. Is ${k} × ${p} = ${k * p} prime or composite?`, hint: `Does ${k * p} have a factor pair besides 1 × ${k * p}?`, explain: `Composite — ${k * p} has the factor pair ${k} × ${p}, so it has more than one pair.` },
        `Composite — it has the factor pair ${k} × ${p}`,
        [
          `Prime — it's made from the prime ${p}`, // MISCONCEPTION: a multiple of a prime is prime
          "Neither",
        ]
      ),
    },
  ];
}

// Q10 — hard: the memorized list — how many primes up to 20?
export function countPrimesTo20Question(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: { kind: "number", prompt: "How many prime numbers are there from 1 to 20?", hint: "List them: 2, 3, 5, ... Remember 1 is not prime.", explain: "8: 2, 3, 5, 7, 11, 13, 17, 19. (1 doesn't count — it's neither.)", answer: 8 },
    },
  ];
}

export const primeCompositeTest: Unit["test"] = {
  questions: [oneQuestion, twoQuestion, whichSmallPrimeQuestion, proveCompositeQuestion, looksPrimeQuestion, notPrimeTo20Question, largePairQuestion, howToCheckQuestion, multipleOfPrimeQuestion, countPrimesTo20Question],
  passScore: 9,
};
