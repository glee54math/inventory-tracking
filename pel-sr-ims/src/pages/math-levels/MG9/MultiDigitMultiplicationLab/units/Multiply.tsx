import { useMemo, useState } from "react";
import { randInt } from "../../../shared/lib/math";
import { verticalMultiply, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import { StepProblem } from "../../../shared/engine/StepProblem";
import type { Unit } from "../../../shared/units/types";

type Digits = 2 | 3 | 4;

// "Carry" here covers BOTH places multi-digit multiplication can regroup:
// multiplying a digit of the top number by a digit of the bottom number
// (and having to carry into the next place), and adding the shifted partial
// products back together (and having to carry there too). "No carry" is the
// baseline — isolating the mechanical steps without that extra bookkeeping.
// Each digit tier gets its OWN pair of bucket names (e.g. "2x2-carry", not
// just "carry") so covering the easy tier's carry case can never stand in
// for covering the hardest tier's — see buildBuckets() below.
const tierLabel = (digits: Digits): string => `${digits}x${digits}`;
const buildBuckets = (digits: Digits): string[] => [`${tierLabel(digits)}-no-carry`, `${tierLabel(digits)}-carry`];

const BUCKETS_2X2 = buildBuckets(2);
const BUCKETS_3X3 = buildBuckets(3);
const BUCKETS_4X4 = buildBuckets(4);

/** True if long-multiplying by the single digit `d` ever carries into the
 *  next place at any step — not just whether the final product has more
 *  digits than the input (a carry can be fully absorbed without growing the
 *  digit count, e.g. 23 × 4: 3×4=12 carries, but 23×4=92 is still 2 digits). */
function singleDigitMultiplyCarries(digits: number[], d: number): boolean {
  let carry = 0;
  for (const digit of digits) {
    const prod = digit * d + carry;
    if (prod >= 10) return true;
    carry = Math.floor(prod / 10); // always 0 here, given the check above
  }
  return false;
}

/** True if column-adding the (already place-shifted) partial products ever
 *  carries into the next column. */
function additionCarries(partials: number[]): boolean {
  const columns = partials.map((p) => String(p).split("").reverse().map(Number));
  const width = Math.max(...columns.map((c) => c.length));
  let carry = 0;
  for (let col = 0; col < width; col++) {
    const sum = carry + columns.reduce((total, c) => total + (c[col] ?? 0), 0);
    if (sum >= 10) return true;
    carry = Math.floor(sum / 10); // always 0 here, given the check above
  }
  return false;
}

function hasCarry(a: number, b: number): boolean {
  const aDigits = String(a).split("").map(Number);
  const bDigits = String(b).split("").map(Number);
  const partials = bDigits
    .slice()
    .reverse()
    .map((d, i) => a * d * Math.pow(10, i));
  return bDigits.some((d) => singleDigitMultiplyCarries(aDigits, d)) || additionCarries(partials);
}

/** Builds the actual Problem from two already-chosen factors — shared by
 *  both the randomized Practice generator (below) and Explore's free-play
 *  sandbox, so a student exploring their own numbers gets the exact same
 *  step, check, and wrap-up as Practice would give them. */
function buildMultiplyProblem(a: number, b: number, bucket?: string): Problem {
  const product = a * b;
  return {
    title: "Multiplying multi-digit numbers",
    bucket,
    story: `Multiply ${a} × ${b}.`,
    visual: (done: number) =>
      done < 1 ? (
        <p className="muted small">Multiply the standard way: one partial product per digit, then add them up.</p>
      ) : (
        <p className="muted small">
          {a} × {b} = {product}
        </p>
      ),
    steps: [
      verticalMultiply(
        {
          prompt: `Multiply ${a} × ${b} the standard way: one partial product per digit of ${b}, then add them up.`,
          hint: `Multiply ${a} by each digit of ${b} separately — ones digit first, then tens, and so on — writing each partial product one place further left, then add them all together.`,
          explain: `${a} × ${b} = ${product}.`,
        },
        a,
        b
      ),
    ],
    wrapUp: `${a} × ${b} = ${product}.`,
  };
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [a, setA] = useState(23);
  const [b, setB] = useState(45);
  const [seed, setSeed] = useState(0);
  const problem = useMemo(
    () => buildMultiplyProblem(a, b),
    // seed forces a fresh problem (same a/b, reset step state) on "Next"
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [a, b, seed]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="controls">
        <Stepper label="First number" value={a} min={10} max={9999} step={1} onChange={setA} tone="a" />
        <Stepper label="Second number" value={b} min={10} max={9999} step={1} onChange={setB} tone="b" />
      </div>
      <StepProblem key={`${a}-${b}-${seed}`} problem={problem} onNext={() => setSeed((s) => s + 1)} />
      <p className="muted small">Try editing the two numbers above, then multiply them the standard way yourself.</p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES — one per digit tier
// ============================================================================

function multiplyProblem(digits: Digits, targetBucket?: string): Problem {
  const tier = tierLabel(digits);
  const wantCarry = targetBucket === `${tier}-carry` ? true : targetBucket === `${tier}-no-carry` ? false : undefined;
  const lo = Math.pow(10, digits - 1);
  const hi = Math.pow(10, digits) - 1;

  let a = 0;
  let b = 0;
  let carries = false;
  let tries = 0;
  do {
    a = randInt(lo, hi);
    b = randInt(lo, hi);
    carries = hasCarry(a, b);
    tries++;
    // Rerolling (not hand-deriving which number pairs carry) until the
    // generated pair actually has the shape the target bucket asks for —
    // same rejection-sampling approach as every other bucketed unit in this
    // app. Unlike those, the cap here is doing real work, not just guarding
    // against a malformed bucket string: "no carry anywhere" for two full
    // 4-digit numbers is genuinely rare (~1 in 1000, confirmed by
    // simulation), so a smaller cap like 2000 left ~24% of 4x4-no-carry
    // requests silently falling back to whatever (mislabeled) draw was last
    // rolled. 20,000 tries converges every time in testing and still only
    // costs ~1ms even in the worst case.
  } while (tries < 20000 && wantCarry !== undefined && carries !== wantCarry);

  const bucket = `${tier}-${carries ? "carry" : "no-carry"}`;
  return buildMultiplyProblem(a, b, bucket);
}

export const multiply: Unit = {
  id: "multiply",
  title: "Multiplying Multi-Digit Numbers",
  goal: "Fluently multiply multi-digit whole numbers using the standard algorithm, from 2-digit by 2-digit up through 4-digit by 4-digit.",
  standard: "5.NBT.5",
  keyIdea: (
    <>
      <p>Multiply one digit at a time: multiply the top number by each digit of the bottom number separately, shifting each partial product one place to the left.</p>
      <p>Add the partial products together for the final answer — carry whenever a column totals 10 or more, same as regular addition.</p>
    </>
  ),
  Explore,
  problems: [
    { label: "2×2 Digit", make: (b) => multiplyProblem(2, b), buckets: BUCKETS_2X2 },
    { label: "3×3 Digit", make: (b) => multiplyProblem(3, b), buckets: BUCKETS_3X3 },
    { label: "4×4 Digit", make: (b) => multiplyProblem(4, b), buckets: BUCKETS_4X4 },
  ],
  // See decimalOperations'/the division units' own requiredBuckets for the
  // same pattern — a mastery star now requires a clean solve covering every
  // one of these 6 (tier × carry-or-not) scenario-classes at least once.
  requiredBuckets: [...BUCKETS_2X2, ...BUCKETS_3X3, ...BUCKETS_4X4],
};
