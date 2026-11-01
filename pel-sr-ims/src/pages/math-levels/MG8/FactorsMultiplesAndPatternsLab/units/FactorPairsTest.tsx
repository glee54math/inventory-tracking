import { pick, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { factorPairs, factorsOf, lastCheck } from "../lib/numberTheory";

// Self-contained: never imports from FactorPairs.tsx (that file imports this
// one's test object, so the reverse import would be a module-eval cycle).
// Shared math comes from ../lib/numberTheory, which is not the paired unit.

/** Non-square numbers under 80 with 4+ factor pairs (easy to miss one). */
export const MANY_PAIRS = [24, 30, 40, 42, 48, 54, 56, 60, 66, 70, 72, 78];
export const SQUARES = [16, 36, 49, 64, 81, 100];
export const NEAR_TOP = [80, 84, 88, 90, 96];
export const BIG_PRIMES = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
/** Odd composites that don't end in 5 — they "look" like they have one pair. */
export const LOOKS_PRIME = [21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93];

const pairText = ([a, b]: [number, number]) => `${a} × ${b}`;

// Q1 — easy: the missing partner in a factor pair
export function missingFactorQuestion(): TestQuestion[] {
  const n = pick(MANY_PAIRS);
  const [a, b] = pick(factorPairs(n).slice(1));
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `${a} × ___ = ${n}. What number makes a factor pair with ${a}?`, hint: `${n} ÷ ${a} = ?`, explain: `${a} × ${b} = ${n}, so ${a} and ${b} are a factor pair of ${n}.`, answer: b },
    },
  ];
}

// Q2 — easy, choice: spot a real factor pair.
export function whichPairQuestion(): TestQuestion[] {
  const n = pick(MANY_PAIRS);
  const [a, b] = pick(factorPairs(n).slice(1));
  // MISCONCEPTION: two numbers that ADD to n (factor pair confused with addends).
  let s = 2;
  while (s * (n - s) === n || n - s === s) s++;
  const sumTrap = `${s} × ${n - s}`;
  // MISCONCEPTION: one group too many/few — product is n ± a, not n.
  const offByGroup = `${a} × ${b + 1}`;
  const offByGroup2 = `${a + 1} × ${b}`;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        { prompt: `Which is a factor pair of ${n}?`, hint: "Multiply each pair. Which one makes exactly the number?", explain: `${a} × ${b} = ${n}. (${s} + ${n - s} = ${n}, but factor pairs MULTIPLY to the number.)` },
        `${a} × ${b}`,
        [sumTrap, offByGroup, offByGroup2]
      ),
    },
  ];
}

// Q3 — medium: count the pairs of a number with many
export function countPairsQuestion(pool: number[] = MANY_PAIRS): () => TestQuestion[] {
  return () => {
    const n = pick(pool);
    const pairs = factorPairs(n);
    return [
      {
        visual: null,
        difficulty: "medium",
        step: { kind: "number", prompt: `How many factor pairs does ${n} have?`, hint: `Try 1, 2, 3, ... in order. Stop once the number you try, times itself, is bigger than ${n}.`, explain: `${pairs.map(pairText).join(", ")}: ${pairs.length} pairs.`, answer: pairs.length },
      },
    ];
  };
}

// Q4 — medium, choice: "did they find them all?" (an easily-missed middle pair)
export function foundAllQuestion(): TestQuestion[] {
  const n = pick(MANY_PAIRS);
  const pairs = factorPairs(n);
  const missIdx = 1 + Math.floor(Math.random() * (pairs.length - 1));
  const missed = pairs[missIdx];
  const listed = pairs.filter((_, i) => i !== missIdx);
  const flipped = pick(listed.slice(1)); // a pair already listed, written backwards
  // near-miss product (n + 1 or n - 1) that sounds like a pair
  let near: [number, number] = [3, Math.floor(n / 3) + 1];
  for (const m of [n + 1, n - 1, n + 2, n - 2]) {
    const p = factorPairs(m).find(([x]) => x > 1 && x !== missed[0]);
    if (p) {
      near = p;
      break;
    }
  }
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        { prompt: `Sam wrote these factor pairs of ${n}: ${listed.map(pairText).join(", ")}. Did Sam find every pair?`, hint: `Check 1, 2, 3, 4, ... in order — does each one go into ${n} evenly?`, explain: `Sam missed ${pairText(missed)}. Checking every number in order is how you make sure none get skipped.` },
        `No — Sam missed ${pairText(missed)}`,
        [
          "Yes — that's every pair", // MISCONCEPTION: stopping without a systematic check
          `No — Sam missed ${flipped[1]} × ${flipped[0]}`, // MISCONCEPTION: a flipped pair counts as new
          `No — Sam missed ${pairText(near)}`, // MISCONCEPTION: a near-miss pair whose product is n ± 1 or 2, not n
        ]
      ),
    },
  ];
}

// Q5 — medium: count the pairs of a perfect square (middle pair counted once)
export function squareCountQuestion(): TestQuestion[] {
  const n = pick(SQUARES);
  const pairs = factorPairs(n);
  const r = Math.sqrt(n);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `How many factor pairs does ${n} have?`,
        hint: `Don't forget ${r} × ${r} — a number times itself is a pair too.`,
        explain: `${pairs.map(pairText).join(", ")}: ${pairs.length} pairs. ${r} × ${r} is one pair, even though it only uses one number.`,
        answer: pairs.length,
      },
    },
  ];
}

// Q6 — hard, choice: the full factor list of a perfect square
export function allFactorsSquareQuestion(): TestQuestion[] {
  const n = pick([16, 36, 64, 100]);
  const r = Math.sqrt(n);
  const f = factorsOf(n);
  const nonFactor = [3, 6, 7, 8, 9, 12, 15].find((x) => n % x !== 0 && x < n / 2 && !f.includes(x)) ?? 7;
  const withExtra = [...f, nonFactor].sort((x, y) => x - y);
  const doubled = [...f.slice(0, f.indexOf(r) + 1), r, ...f.slice(f.indexOf(r) + 1)];
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Which list shows ALL the factors of ${n}, with none repeated?`, hint: `Find every factor pair first. ${r} × ${r} = ${n} — how many times should ${r} be listed?`, explain: `${f.join(", ")}. ${r} pairs with itself, so it's listed once.` },
        f.join(", "),
        [
          doubled.join(", "), // MISCONCEPTION: double-counting the square's middle factor
          f.filter((x) => x !== r).join(", "), // MISCONCEPTION: forgetting r × r is a pair
          withExtra.join(", "), // MISCONCEPTION: a non-factor slipped in (no systematic check)
        ]
      ),
    },
  ];
}

// Q7 — medium, choice: when can you stop checking?
export function stopCheckingQuestion(): TestQuestion[] {
  let n = 80 + Math.floor(Math.random() * 20);
  if (Number.isInteger(Math.sqrt(n))) n += 1;
  const r = lastCheck(n);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `You check 1, 2, 3, 4, ... in order to find every factor pair of ${n}. What is the biggest number you need to try?`,
          hint: `Stop once the number you try, times itself, is bigger than ${n}.`,
          explain: `${r} × ${r} = ${r * r} is not more than ${n}, but ${r + 1} × ${r + 1} = ${(r + 1) * (r + 1)} is. Any pair past ${r} would just be a flipped pair you already found.`,
        },
        String(r),
        [
          String(Math.floor(n / 2)), // MISCONCEPTION: "check up to half"
          String(n), // MISCONCEPTION: "check every number up to n"
          String(r + 1), // MISCONCEPTION: one past the stopping point
        ]
      ),
    },
  ];
}

// Q8 — hard: count pairs near the top of 1-100
export function nearTopCountQuestion(): TestQuestion[] {
  return countPairsQuestion(NEAR_TOP)().map((q) => ({ ...q, difficulty: "hard" as const }));
}

// Q9 — hard, choice: which number has exactly one factor pair?
export function onePairQuestion(): TestQuestion[] {
  const p = pick(BIG_PRIMES);
  const others = shuffle(LOOKS_PRIME).slice(0, 3);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "Which number has only ONE factor pair (1 × itself)?", hint: "Try dividing each one by 3 and by 7.", explain: `${p} has only 1 × ${p}. ${others.map((o) => `${o} = ${factorPairs(o)[1][0]} × ${factorPairs(o)[1][1]}`).join(", ")}.` },
        String(p),
        // MISCONCEPTION: odd numbers that don't end in 5 "must" have only one pair
        others.map(String)
      ),
    },
  ];
}

// Q10 — hard, choice: bigger number ≠ more factor pairs
export function biggerMoreQuestion(): TestQuestion[] {
  const p = pick([83, 89, 97]);
  const c = pick([24, 30, 36, 40, 42, 48]);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `Which number has MORE factor pairs: ${p} or ${c}?`, hint: `Find the pairs of each. Does ${p} have any besides 1 × ${p}?`, explain: `${c} has ${factorPairs(c).length} pairs; ${p} has only 1 × ${p}. A bigger number does NOT always have more factor pairs.` },
        String(c),
        [
          String(p), // MISCONCEPTION: bigger number = more factor pairs
          "They have the same number of pairs",
        ]
      ),
    },
  ];
}

export const factorPairsTest: Unit["test"] = {
  questions: [missingFactorQuestion, whichPairQuestion, countPairsQuestion(), foundAllQuestion, squareCountQuestion, allFactorsSquareQuestion, stopCheckingQuestion, nearTopCountQuestion, onePairQuestion, biggerMoreQuestion],
  passScore: 9,
};
