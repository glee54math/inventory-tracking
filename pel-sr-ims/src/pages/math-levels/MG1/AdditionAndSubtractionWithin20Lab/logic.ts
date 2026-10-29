// Pure decomposition helpers shared between a unit's diagram-render logic and
// its step-checking/answer logic, so the picture and the grading can never
// silently drift apart (see MATH_TSX_STYLE_GUIDE.txt / this lab's own Explore
// sections, which compute the SAME intermediate state they draw).

/**
 * Make-ten breakdown for `a + b`, where `a` is the near-ten addend (8 or 9
 * for Unit 2's small-gap bucket, 6 or 7 for its larger-gap bucket). Breaks
 * `b` into exactly enough to fill `a` up to 10 (`addToA`), plus whatever's
 * left over (`remainder`) — e.g. 9 + 4: gap is 1, so addToA = 1, remainder =
 * 3, and the final answer is ten + remainder = 13. Works the same way
 * regardless of how big the gap is, which is what makes it reusable across
 * both of Unit 2's addition buckets.
 */
export function makeTenBreakdown(a: number, b: number): { gap: number; addToA: number; remainder: number; ten: number; total: number } {
  const gap = Math.max(0, 10 - a);
  const addToA = Math.min(gap, b);
  const remainder = b - addToA;
  return { gap, addToA, remainder, ten: a + addToA, total: a + b };
}

/**
 * "Think addition back through ten" breakdown for `start - sub` (start is
 * 11-19, so it always has a ten to bridge through): first subtract just
 * enough to land exactly on the ten below `start` (`toTen`), then subtract
 * whatever's left (`remainder`) — e.g. 13 - 5: toTen = 3 (13 - 3 = 10),
 * remainder = 2, final answer = 10 - 2 = 8.
 */
export function subtractThroughTenBreakdown(start: number, sub: number): { toTen: number; remainder: number; ten: number; total: number } {
  const distanceToTen = start % 10 === 0 ? 10 : start % 10;
  const toTen = Math.min(distanceToTen, sub);
  const remainder = sub - toTen;
  const ten = start - toTen;
  return { toTen, remainder, ten, total: start - sub };
}
