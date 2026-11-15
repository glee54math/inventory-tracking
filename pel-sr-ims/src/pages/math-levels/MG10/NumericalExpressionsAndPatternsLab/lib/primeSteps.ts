// Unit 4 step builders shared by PrimeFactors.tsx AND its Test (never a
// unit <-> Test cycle).

import { choice, type ChoiceStep } from "../../../shared/engine/types";
import { pick, randInt } from "../../../shared/lib/math";
import { factorPairsNoOne, isPrime, primeFactors, reordered, timesText } from "./primes";

export const JUDGE_SAME = "Yes. Same primes, in a different order.";
export const JUDGE_NOT_PRIME = "No. Not every factor is prime.";
export const JUDGE_PRODUCT = "No. The factors don't multiply to the number.";
export const JUDGE_ALWAYS_DIFFERENT = "No. A different starting pair gives different primes.";

/**
 * Someone's answer for n, judged. The right choice is drawn evenly from three
 * cases (same primes reordered / a factor that is not prime / primes with the
 * wrong product). The fourth choice, "a different start gives different
 * primes", is the uniqueness misconception and is never right.
 */
export const judgeStep = (n: number): ChoiceStep => {
  const kind = pick<"same" | "notPrime" | "product">(["same", "notPrime", "product"]);
  const f = primeFactors(n);
  let claim: number[];
  let explain: string;
  if (kind === "same") {
    claim = reordered(n);
    explain = `${timesText(claim)} has the same primes as ${timesText(f)}. Order doesn't matter.`;
  } else if (kind === "notPrime") {
    // Stop one split early: keep one composite factor.
    const pair = pick(factorPairsNoOne(n).filter(([a, b]) => !isPrime(a) || !isPrime(b)));
    const comp = isPrime(pair[1]) ? pair[0] : pair[1];
    const other = comp === pair[0] ? pair[1] : pair[0];
    claim = [...(isPrime(other) ? [other] : primeFactors(other)), comp];
    explain = `${comp} is not prime, so the tree is not finished. ${n} = ${timesText(f)}.`;
  } else {
    // Swap one prime for a different prime: all prime, wrong product.
    const i = randInt(0, f.length - 1);
    const swap = pick([2, 3, 5, 7].filter((p) => p !== f[i]));
    claim = f.map((x, k) => (k === i ? swap : x));
    explain = `${timesText(claim)} = ${claim.reduce((a, b) => a * b, 1)}, not ${n}. ${n} = ${timesText(f)}.`;
  }
  const who = pick(["Ava", "Jay", "Rosa", "Max"]);
  return choice(
    {
      prompt: `${who} says the prime factorization of ${n} is ${timesText(claim)}. Is ${who} right?`,
      hint: "Check two things: is every factor prime, and do they multiply to the number?",
      explain,
    },
    kind === "same" ? JUDGE_SAME : kind === "notPrime" ? JUDGE_NOT_PRIME : JUDGE_PRODUCT,
    [JUDGE_SAME, JUDGE_NOT_PRIME, JUDGE_PRODUCT, JUDGE_ALWAYS_DIFFERENT]
  );
};
