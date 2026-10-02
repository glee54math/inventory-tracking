export type Level = 1 | 2 | 3;

/** Operator chosen in the circle. Empty string means nothing chosen yet. */
export type Op = "" | "+" | "−";

/**
 * How the story relates the two people. A's amount is always given.
 * 1: B has d fewer than A     → B = n − d
 * 2: B has d more than A      → B = n + d
 * 3: A has d more than B      → B = n − d  (tricky wording)
 * 4: A has d fewer than B     → B = n + d  (tricky wording)
 */
export type RelationType = 1 | 2 | 3 | 4;

export interface Problem {
  A: string;
  B: string;
  item: string;
  type: RelationType;
  n: number; // A's amount
  d: number; // the difference
  bVal: number; // B's amount (answer to part a)
  total: number; // answer to part b
  op: "+" | "−"; // correct operation for part a
  story: string;
}

export type Field = "x" | "y" | "r" | "s";

/** x (op) y = r, then the sentence answer s. */
export interface PartValues {
  x: string;
  y: string;
  r: string;
  s: string;
  op: Op;
}

export interface CheckResult {
  ok: boolean;
  message: string;
  wrong: Field[];
}

export interface Feedback {
  message: string;
  good: boolean;
}

export const EMPTY_PART: PartValues = { x: "", y: "", r: "", s: "", op: "" };
