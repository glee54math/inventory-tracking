/**
 * Module Test stars (0–5) from a raw score, the one rule for every lab
 * (Mr. Lee, 2026-11-23). Compares whole numbers so rounding can't move a cutoff.
 *
 *   5: over 90%
 *   4: over 80%, up to 90%
 *   3: over 70%, up to 80%
 *   2: over 60%, up to 70%
 *   1: one third up to 60%
 *   0: below one third
 *
 * A 10-question test has too few questions for those bands, so it gets its own
 * more lenient ones: 9–10 = 5, 8 = 4, 7 = 3, 6 = 2, 3–5 = 1, 0–2 = 0.
 */
export function moduleStars(score: number, total: number): number {
  if (total === 10) {
    if (score >= 9) return 5;
    if (score >= 6) return score - 4;
    return score >= 3 ? 1 : 0;
  }
  if (score * 10 > total * 9) return 5;
  if (score * 10 > total * 8) return 4;
  if (score * 10 > total * 7) return 3;
  if (score * 10 > total * 6) return 2;
  return score * 3 >= total ? 1 : 0;
}
