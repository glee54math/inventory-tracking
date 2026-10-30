// Pure math helpers shared between a unit's diagram-render logic and its
// step-checking/answer logic, so the picture and the grading can never
// silently drift apart (see MATH_TSX_STYLE_GUIDE.txt / every other lab's own
// logic.ts, e.g. MG1/AdditionAndSubtractionWithin20Lab/logic.ts).

/**
 * Column-by-column breakdown of a written addition or subtraction, in
 * ones-first order (index 0 = ones, index 1 = tens, ...) so the math is easy
 * to write — diagrams.PlaceValueColumns reverses the order itself when it
 * renders left-to-right. Shared shape for BOTH operations and for 2-4
 * operands, so Unit 2 (up to four two-digit addends) and Unit 3 (two 3-digit
 * numbers, add or subtract) can both drive their diagram and their step
 * checking off the exact same breakdown object.
 */
export interface ColumnBreakdown {
  /** As written, top row first. */
  operands: number[];
  operation: "add" | "subtract";
  /** Number of place-value columns needed (ones=0 ... ), sized to fit every
   *  operand AND the total/difference, so no digit is ever cut off. */
  numCols: number;
  /** digitsByOperand[operandIndex][col]. */
  digitsByOperand: number[][];
  /** Final digit written in each column, ones-first. */
  resultDigits: number[];
  /**
   * Addition: the carry OUT of column `col` into column `col + 1` (0 if
   * none — explicitly tracked per column, not assumed to ever be "just 1",
   * since stacking 3-4 addends can carry 2 or 3).
   * Subtraction: 1 if column `col` had to borrow FROM column `col + 1` to
   * complete its own subtraction, else 0.
   */
  carry: number[];
  total: number;
}

/** Addition breakdown for 2-4 addends (Unit 2's up-to-four-two-digit-numbers,
 *  also usable for Unit 3's 3-digit addition). `minCols` pads the display
 *  with leading zero columns (e.g. a hundreds column that's always 0) so
 *  every problem in a unit shows the same number of columns regardless of
 *  whether that particular instance happened to need them — Unit 2 always
 *  passes 3 so every bucket's diagram and step sequence has the same shape. */
export function buildAddColumns(addends: number[], minCols = 2): ColumnBreakdown {
  const total = addends.reduce((a, b) => a + b, 0);
  const numCols = Math.max(minCols, ...addends.map((n) => String(n).length), String(total).length);
  const digitsByOperand = addends.map((n) => Array.from({ length: numCols }, (_, col) => Math.floor(n / 10 ** col) % 10));
  const resultDigits: number[] = [];
  const carry: number[] = [];
  let carryIn = 0;
  for (let col = 0; col < numCols; col++) {
    const colSum = addends.reduce((s, n) => s + (Math.floor(n / 10 ** col) % 10), 0) + carryIn;
    resultDigits.push(colSum % 10);
    carryIn = Math.floor(colSum / 10);
    carry.push(carryIn);
  }
  return { operands: addends, operation: "add", numCols, digitsByOperand, resultDigits, carry, total };
}

/** Subtraction breakdown for two numbers, `a - b` with `a >= b` — correctly
 *  cascades a borrow through a zero digit (e.g. 403 - 158: the ones column's
 *  borrow request lands on a tens digit of 0, which must itself borrow from
 *  the hundreds place before it can lend anything to the ones column) since
 *  this walks real digit arithmetic column by column rather than
 *  special-casing the zero. `minCols` — see buildAddColumns' doc comment. */
export function buildSubColumns(a: number, b: number, minCols = 2): ColumnBreakdown {
  const numCols = Math.max(minCols, String(a).length, String(b).length);
  const digitsA = Array.from({ length: numCols }, (_, col) => Math.floor(a / 10 ** col) % 10);
  const digitsB = Array.from({ length: numCols }, (_, col) => Math.floor(b / 10 ** col) % 10);
  const resultDigits: number[] = [];
  const carry: number[] = [];
  let borrowIn = 0;
  for (let col = 0; col < numCols; col++) {
    let d = digitsA[col] - borrowIn - digitsB[col];
    let borrowOut = 0;
    if (d < 0) {
      d += 10;
      borrowOut = 1;
    }
    resultDigits.push(d);
    carry.push(borrowOut);
    borrowIn = borrowOut;
  }
  return { operands: [a, b], operation: "subtract", numCols, digitsByOperand: [digitsA, digitsB], resultDigits, carry, total: a - b };
}

/** True when the tens column (index 1) had to borrow from the hundreds place
 *  (carry[1] === 1) AND its own original digit was 0 — the specific "borrow
 *  through a zero" case Unit 3's plan flags as the hardest, most-specific
 *  misconception point (you can't lend a ten from a tens place that holds a
 *  0, so you must reach into the hundreds place first). */
export function borrowsThroughZero(b: ColumnBreakdown): boolean {
  return b.operation === "subtract" && b.numCols > 2 && b.carry[1] === 1 && b.digitsByOperand[0][1] === 0;
}

/** How many columns actually carried/borrowed — used to classify a problem
 *  into its bucket (no-regroup / single-regroup / double-regroup). */
export function regroupCount(b: ColumnBreakdown): number {
  // Only the ones/tens columns' carries count as "a regroup happened" for our
  // bucket definitions — a carry OUT of the most significant column just
  // means the total grew a new digit, not a regroup within the range tested.
  return b.carry.slice(0, b.numCols - 1).filter((c) => c > 0).length;
}

/**
 * Mental math ±10/±100 breakdown: which digit places change, and whether a
 * hundred (or thousand, at the 900+100/100-100 edges) boundary gets crossed.
 * Digits are returned MOST-significant-first (reading order) since this is
 * only ever used for display, unlike ColumnBreakdown's ones-first math
 * arrays. `before`/`after` are padded to the same length so a boundary
 * crossing that grows (900+100=1000) or shrinks (100-100=0) a digit is still
 * directly comparable position-by-position.
 */
export interface TenHundredShift {
  n: number;
  delta: 10 | -10 | 100 | -100;
  result: number;
  before: number[];
  after: number[];
  /** True when a column OTHER than the one `delta` directly targets also
   *  changed — e.g. 290 + 10 changes both the tens digit (9->0) AND the
   *  hundreds digit (2->3), not just the tens digit alone. */
  rippled: boolean;
}

export function tenHundredShift(n: number, delta: 10 | -10 | 100 | -100): TenHundredShift {
  const result = n + delta;
  const len = Math.max(3, String(n).length, String(result).length);
  const digitsOf = (x: number): number[] => String(Math.abs(x)).padStart(len, "0").split("").map(Number);
  const before = digitsOf(n);
  const after = digitsOf(result);
  // Which single place `delta` directly targets, counting from the right:
  // ±10 -> the tens place (index len-2 from the left); ±100 -> the hundreds
  // place (index len-3). Any OTHER place that also changed means the change
  // rippled past the place it started in.
  const directIdxFromRight = Math.abs(delta) === 10 ? 1 : 2;
  const rippled = before.some((d, i) => {
    const idxFromRight = len - 1 - i;
    return idxFromRight !== directIdxFromRight && d !== after[i];
  });
  return { n, delta, result, before, after, rippled };
}
