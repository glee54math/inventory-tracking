// Number pools for Unit 4 (5.OA.2.1: whole numbers 2-50 as products of
// primes). The pools don't overlap, so two Test questions on the same skill
// never come out the same. The prime math itself is shared
// (shared/lib/factors.ts), the same code that grades the answers.
// Imported by units AND Tests (never a unit <-> Test cycle).

import { pick, shuffle } from "../../../shared/lib/math";
import { factorPairsNoOne, isPrime, primeFactors, timesText } from "../../../shared/lib/factors";

export { factorPairsNoOne, isPrime, primeFactors, timesText };

/** (a) short: 2 or 3 small prime factors, one way to start the tree. */
export const SHORT = [6, 8, 9, 10, 14, 15, 21, 25, 27, 35, 49];
/** (b) prime numbers: the trap is forcing a factorization. */
export const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
/** (c) long: 4 or more factors, a factor used 3 or more times, or a prime of 11 or more. */
export const LONG = [16, 22, 26, 28, 32, 33, 34, 38, 39, 40, 44, 45, 46, 48, 50];
/** The hardest end of LONG: 4 or 5 prime factors. */
export const LONG_MANY = [16, 32, 40, 48];
/** (d) many trees: two or more different starting pairs. */
export const MANY_TREES = [12, 18, 20, 24, 30, 36, 42];

/**
 * Composite numbers that look prime to a 5th grader (odd, not ending in 5).
 * This is every such number from 2 to 50, so the pool can't grow inside the
 * unit's range (round 1, C1-08); "Which number is NOT prime?" and the typed
 * factor-pair step make the pick need real work instead.
 */
export const LOOK_PRIME = [9, 21, 27, 33, 39, 49];

/** Numbers 2-50 that are prime. */
export const ALL_PRIMES = Array.from({ length: 49 }, (_, i) => i + 2).filter(isPrime);

export const pickOther = (pool: readonly number[], not: number): number => pick(pool.filter((x) => x !== not));

/** A factor tree for n: starting pair `first` (or the most even pair), then the most even pair at each step. */
export interface TreeNode {
  v: number;
  kids?: [TreeNode, TreeNode];
}

const evenPair = (n: number): [number, number] | null => {
  const pairs = factorPairsNoOne(n);
  return pairs.length ? pairs[pairs.length - 1] : null;
};

export const factorTree = (n: number, first?: [number, number]): TreeNode => {
  const pair = first ?? evenPair(n);
  if (!pair) return { v: n };
  return { v: n, kids: [factorTree(pair[0]), factorTree(pair[1])] };
};

/** The bottom of a tree (its primes), left to right. */
export const leaves = (t: TreeNode): number[] => (t.kids ? [...leaves(t.kids[0]), ...leaves(t.kids[1])] : [t.v]);

/** Same numbers, any order. */
export const sameMultiset = (a: readonly number[], b: readonly number[]): boolean => a.length === b.length && [...a].sort((x, y) => x - y).join(",") === [...b].sort((x, y) => x - y).join(",");

/** The prime factors in a mixed-up (but not sorted) order, for "is this the same?" claims. */
export const reordered = (n: number): number[] => {
  const f = primeFactors(n);
  for (let i = 0; i < 20; i++) {
    const s = shuffle(f);
    if (s.join(",") !== f.join(",")) return s;
  }
  return [...f].reverse();
};

/** Exactly two prime factors (e.g. 35 = 5 × 7): its first split is already the whole answer. */
export const twoPrimes = (n: number): boolean => primeFactors(n).length === 2;

/** The smallest prime that divides n evenly. */
export const smallestPrime = (n: number): number => primeFactors(n)[0];

/**
 * The help picture for a "write n as primes" step after a wrong try (round 1,
 * C1-06): the first split, drawn without circles, only when at least one of
 * its two numbers is not prime (so the split is not the whole answer).
 * Null when the first split would show the answer: show a text cue instead.
 */
export const helpSplit = (n: number): TreeNode | null => {
  const t = factorTree(n);
  if (!t.kids) return null;
  return t.kids.some((k) => !isPrime(k.v)) ? { v: n, kids: [{ v: t.kids[0].v }, { v: t.kids[1].v }] } : null;
};

/** A tree that is just n split into the given pair (no further splits). */
export const pairTree = (n: number, pair: [number, number]): TreeNode => ({ v: n, kids: [{ v: pair[0] }, { v: pair[1] }] });
