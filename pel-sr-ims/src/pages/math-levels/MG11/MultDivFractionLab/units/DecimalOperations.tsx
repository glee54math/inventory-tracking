import { useState } from "react";
import { DivisionLadder, PlaceValueColumns, computeLongDivision } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem, type Step } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { decimalOperationsTest } from "./DecimalOperationsTest";

const round2 = (n: number) => Math.round(n * 100) / 100;
const randMoney2 = (min: number, max: number) => randInt(min * 100, max * 100) / 100; // 2 decimal places
const randMoney1 = (min: number, max: number) => randInt(min * 10, max * 10) / 10; // 1 decimal place
const decimalPlaces = (n: number) => (String(n).split(".")[1] ?? "").length;

/** Shared with LongDivision.tsx's own copy — small and self-contained per this
 *  package's own units, same convention MM1 uses for its unit-local helpers. */
function cycleSteps(dividend: number, divisor: number): Step[] {
  const { cycles } = computeLongDivision(dividend, divisor);
  return cycles.map((c, i) => ({
    kind: "ratio",
    tones: "none",
    labels: ["digit", "remainder so far"],
    frame: ["", "R", ""],
    prompt: i === 0 ? "What's the first digit of the quotient, and the remainder after this step?" : "Bring down the next digit. What's the next quotient digit, and the remainder after this step?",
    hint: `${c.current} ÷ ${divisor} — how many times does ${divisor} go into ${c.current}?`,
    explain: `${divisor} × ${c.qDigit} = ${c.product}, and ${c.current} − ${c.product} = ${c.remainder}.`,
    answer: [c.qDigit, c.remainder],
  }));
}

// ============================================================================
// EXPLORE
// ============================================================================

type Op = "add" | "subtract" | "multiply" | "divide";

function Explore() {
  const [op, setOp] = useState<Op>("add");
  const [top, setTop] = useState(23.4);
  const [bottom, setBottom] = useState(8.15);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Segmented
        label="Operation"
        value={op}
        onChange={setOp}
        options={[
          { id: "add", label: "Add" },
          { id: "subtract", label: "Subtract" },
          { id: "multiply", label: "Multiply" },
          { id: "divide", label: "Divide" },
        ]}
      />
      {op === "divide" ? (
        <DivisionLadder dividend={Math.round(top * 10)} divisor={Math.round(bottom * 10)} done={99} />
      ) : (
        <PlaceValueColumns operation={op} top={top} bottom={bottom} done={1} />
      )}
      <p className="muted small">
        Try editing the two decimal numbers below to see how {op === "divide" ? "shifting the decimal point" : "lining up the decimal point"} changes the layout.
      </p>
      <div className="controls">
        <label>
          First number{" "}
          <input className="answer" style={{ width: 80 }} value={top} onChange={(e) => { const v = Number(e.target.value); if (!isNaN(v)) setTop(v); }} />
        </label>
        <label>
          Second number{" "}
          <input className="answer" style={{ width: 80 }} value={bottom} onChange={(e) => { const v = Number(e.target.value); if (!isNaN(v)) setBottom(v); }} />
        </label>
      </div>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — addition
// ============================================================================

function addProblem(): Problem {
  const a = randMoney2(1, 60);
  const b = randMoney1(1, 25);
  const sum = round2(a + b);
  return {
    title: "Adding decimals",
    story: `Add ${a} + ${b}.`,
    visual: (done: number) => <PlaceValueColumns operation="add" top={a} bottom={b} done={done} />,
    steps: [
      choice(
        { prompt: "To add decimals using the standard algorithm, what must you do first?", hint: "Think about why you can't just add digit-by-digit from the right without this step.", explain: "Lining up the decimal points lines up each place value (ones with ones, tenths with tenths, and so on)." },
        "Line up the decimal points",
        ["Line up the digits on the right, ignoring the decimal point", "Round both numbers to whole numbers first"]
      ),
      {
        kind: "number",
        prompt: `What is ${a} + ${b}?`,
        hint: "Add each column, carrying when a column totals 10 or more — just like whole-number addition.",
        explain: `${a} + ${b} = ${sum}.`,
        answer: sum,
      },
    ],
    wrapUp: `${a} + ${b} = ${sum}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — subtraction
// ============================================================================

function subtractProblem(): Problem {
  const a = randMoney2(20, 90);
  let b = randMoney1(1, Math.max(1, Math.floor(a) - 1));
  if (b >= a) b = round2(a / 2);
  const diff = round2(a - b);
  return {
    title: "Subtracting decimals",
    story: `Subtract ${a} − ${b}.`,
    visual: (done: number) => <PlaceValueColumns operation="subtract" top={a} bottom={b} done={done} />,
    steps: [
      choice(
        { prompt: "What's the first step, just like with addition?", hint: "Same first move as decimal addition.", explain: "Lining up the decimal points keeps each place value aligned." },
        "Line up the decimal points",
        ["Subtract the whole-number parts only", "Round both numbers first"]
      ),
      {
        kind: "number",
        prompt: `What is ${a} − ${b}?`,
        hint: "Borrow across columns (and across the decimal point if needed) just like whole-number subtraction.",
        explain: `${a} − ${b} = ${diff}.`,
        answer: diff,
      },
    ],
    wrapUp: `${a} − ${b} = ${diff}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — multiplication
// ============================================================================

function multiplyProblem(): Problem {
  const a = randMoney1(2, 40);
  const b = randMoney1(2, 9);
  const wholeA = Math.round(a * 10);
  const wholeB = Math.round(b * 10);
  const wholeProduct = wholeA * wholeB;
  const totalPlaces = decimalPlaces(a) + decimalPlaces(b);
  const product = round2(a * b);
  return {
    title: "Multiplying decimals",
    story: `Multiply ${a} × ${b}.`,
    visual: (done: number) => <PlaceValueColumns operation="multiply" top={a} bottom={b} done={done >= 2 ? 1 : 0} />,
    steps: [
      {
        kind: "number",
        prompt: `Ignore the decimal points for a moment. What is ${wholeA} × ${wholeB}?`,
        hint: "Multiply as if both numbers were whole numbers.",
        explain: `${wholeA} × ${wholeB} = ${wholeProduct}.`,
        answer: wholeProduct,
      },
      {
        kind: "number",
        prompt: `${a} has ${decimalPlaces(a)} decimal place${decimalPlaces(a) === 1 ? "" : "s"}, and ${b} has ${decimalPlaces(b)} — that's ${totalPlaces} total. Counting from the right of ${wholeProduct}, place the decimal point. What's the final product?`,
        hint: `Count ${totalPlaces} digit${totalPlaces === 1 ? "" : "s"} from the right of ${wholeProduct} and put the decimal point there.`,
        explain: `${a} × ${b} = ${product}.`,
        answer: product,
      },
    ],
    wrapUp: `${a} × ${b} = ${product}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — division
// ============================================================================

function divideProblem(): Problem {
  const divisor = randMoney1(1, 9);
  const quotient = randInt(3, 40);
  const dividend = round2(divisor * quotient);
  const shiftedDivisor = Math.round(divisor * 10);
  const shiftedDividend = Math.round(dividend * 10);
  const cycles = cycleSteps(shiftedDividend, shiftedDivisor);

  return {
    title: "Dividing decimals",
    story: `Divide ${dividend} ÷ ${divisor}.`,
    visual: (done: number) => <DivisionLadder dividend={shiftedDividend} divisor={shiftedDivisor} done={Math.min(Math.max(done - 2, 0), cycles.length)} />,
    steps: [
      choice(
        { prompt: "To divide by a decimal, what should you do first?", hint: "You need the divisor to become a whole number before doing long division.", explain: "Multiplying both numbers by the same power of 10 keeps the value of the division the same, but makes the divisor a whole number." },
        "Multiply both the divisor and the dividend by the same power of 10",
        ["Round the divisor to the nearest whole number", "Divide the whole-number parts only"]
      ),
      {
        kind: "ratio",
        tones: "none",
        labels: ["new dividend", "new divisor"],
        frame: ["", "÷", ""],
        prompt: `${divisor} has ${decimalPlaces(divisor)} decimal place. Multiply both numbers by 10. What's the new dividend and new divisor?`,
        hint: `${dividend} × 10 and ${divisor} × 10.`,
        explain: `${dividend} × 10 = ${shiftedDividend}, and ${divisor} × 10 = ${shiftedDivisor}.`,
        answer: [shiftedDividend, shiftedDivisor],
      },
      ...cycles,
      {
        kind: "number",
        prompt: `What's the final quotient?`,
        hint: "This should match your last cycle's digit.",
        explain: `${shiftedDividend} ÷ ${shiftedDivisor} = ${quotient}, so ${dividend} ÷ ${divisor} = ${quotient} too.`,
        answer: quotient,
      },
    ],
    wrapUp: `${dividend} ÷ ${divisor} = ${quotient}.`,
  };
}

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return <PlaceValueColumns operation="add" top={12.5} bottom={3.25} done={1} />;
}

export const decimalOperations: Unit = {
  id: "decimalOperations",
  title: "Decimal Operations",
  goal: "Fluently add, subtract, multiply, and divide multi-digit decimals using the standard algorithm for each operation.",
  standard: "6.NS.3",
  keyIdea: (
    <>
      <p>Adding and subtracting decimals: line up the decimal points first, then work column by column.</p>
      <p>Multiplying decimals: multiply as whole numbers, then count total decimal places to place the point.</p>
      <p>Dividing decimals: multiply both numbers by a power of 10 until the divisor is a whole number, then divide as usual.</p>
    </>
  ),
  Explore,
  preview: Preview,
  problems: [
    { label: "Add", make: addProblem },
    { label: "Subtract", make: subtractProblem },
    { label: "Multiply", make: multiplyProblem },
    { label: "Divide", make: divideProblem },
  ],
  test: decimalOperationsTest,
};
