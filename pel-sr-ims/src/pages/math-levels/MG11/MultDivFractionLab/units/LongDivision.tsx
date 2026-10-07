import { useState } from "react";
import { DivisionLadder, computeLongDivision } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem, type Step } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { longDivisionTest } from "./LongDivisionTest";

/** One RatioStep per long-division cycle (digit + running remainder), reusing
 *  the exact same computeLongDivision() the diagram uses, so the step answers
 *  and the diagram always agree. */
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

function Explore() {
  const [dividend, setDividend] = useState(144);
  const [divisor, setDivisor] = useState(6);
  const [done, setDone] = useState(0);
  const { cycles, quotient, remainder } = computeLongDivision(dividend, divisor);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="controls">
        <Stepper label="Dividend" value={dividend} min={100} max={999} step={1} onChange={(v: number) => { setDividend(v); setDone(0); }} tone="a" />
        <Stepper label="Divisor" value={divisor} min={2} max={25} onChange={(v: number) => { setDivisor(v); setDone(0); }} tone="b" />
      </div>
      <DivisionLadder dividend={dividend} divisor={divisor} done={done} />
      <div className="controls">
        <button className="btn ghost" disabled={done <= 0} onClick={() => setDone((d) => Math.max(0, d - 1))}>
          ← Back a step
        </button>
        <button className="btn primary" disabled={done >= cycles.length} onClick={() => setDone((d) => Math.min(cycles.length, d + 1))}>
          Next step →
        </button>
      </div>
      {done >= cycles.length && (
        <p className="muted">
          {dividend} ÷ {divisor} = {quotient}
          {remainder > 0 ? ` R${remainder}` : ""}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — no remainder
// ============================================================================

function noRemainderProblem(): Problem {
  const divisor = randInt(2, 9);
  const quotient = randInt(10, 89);
  const dividend = divisor * quotient;
  const cycles = cycleSteps(dividend, divisor);

  return {
    title: "Packing boxes evenly",
    story: `${dividend} apples are packed into boxes of ${divisor}. How many boxes are filled?`,
    visual: (done: number) => <DivisionLadder dividend={dividend} divisor={divisor} done={Math.min(done, cycles.length)} />,
    steps: [
      ...cycles,
      {
        kind: "number",
        suffix: "boxes",
        prompt: `How many boxes get filled?`,
        hint: "This is the quotient — no apples are left over.",
        explain: `${dividend} ÷ ${divisor} = ${quotient} exactly, with no remainder.`,
        answer: quotient,
      },
    ],
    wrapUp: `${quotient} boxes are filled, with no apples left over.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — with remainder
// ============================================================================

function withRemainderProblem(): Problem {
  const divisor = randInt(2, 9);
  const quotient = randInt(10, 89);
  const remainder = randInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;
  const cycles = cycleSteps(dividend, divisor);

  return {
    title: "Sharing with leftovers",
    story: `${dividend} stickers are shared equally among ${divisor} kids. How many stickers does each kid get, and how many are left over?`,
    visual: (done: number) => <DivisionLadder dividend={dividend} divisor={divisor} done={Math.min(done, cycles.length)} />,
    steps: [
      ...cycles,
      {
        kind: "ratio",
        tones: "none",
        labels: ["stickers each", "leftover stickers"],
        frame: ["", "R", ""],
        prompt: "What's the final quotient and remainder?",
        hint: "This should match your last cycle's digit and remainder.",
        explain: `${dividend} ÷ ${divisor} = ${quotient} R${remainder}.`,
        answer: [quotient, remainder],
      },
      choice(
        {
          prompt: `What do the ${remainder} leftover sticker${remainder === 1 ? "" : "s"} mean?`,
          hint: "The remainder is what's left after giving every kid an equal share — it can't be split evenly among them.",
          explain: "A remainder is the amount left over once nothing more can be split evenly.",
        },
        `${remainder} sticker${remainder === 1 ? "" : "s"} can't be split evenly and are left over`,
        [`Each kid actually gets ${remainder} more stickers`, "The division was done incorrectly"]
      ),
    ],
    wrapUp: `Each kid gets ${quotient} stickers, with ${remainder} left over.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — two-digit divisor
// ============================================================================

function twoDigitDivisorProblem(): Problem {
  const divisor = randInt(11, 30);
  const quotient = randInt(Math.ceil(100 / divisor), Math.floor(999 / divisor));
  const remainder = randInt(0, divisor - 1);
  const dividend = divisor * quotient + remainder;
  const cycles = cycleSteps(dividend, divisor);

  return {
    title: "Packing with a bigger box size",
    story: `A school orders ${dividend} pencils, packed ${divisor} to a box. How many full boxes are there, and how many pencils are left over?`,
    visual: (done: number) => <DivisionLadder dividend={dividend} divisor={divisor} done={Math.min(done, cycles.length)} />,
    steps: [
      ...cycles,
      {
        kind: "ratio",
        tones: "none",
        labels: ["full boxes", "leftover pencils"],
        frame: ["", "R", ""],
        prompt: "What's the final quotient and remainder?",
        hint: "This should match your last cycle's digit and remainder.",
        explain: `${dividend} ÷ ${divisor} = ${quotient}${remainder > 0 ? ` R${remainder}` : ""}.`,
        answer: [quotient, remainder],
      },
    ],
    wrapUp: remainder > 0 ? `There are ${quotient} full boxes, with ${remainder} pencils left over.` : `There are ${quotient} full boxes, with none left over.`,
  };
}

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return <DivisionLadder dividend={144} divisor={6} done={0} />;
}

export const longDivision: Unit = {
  id: "longDivision",
  title: "Long Division",
  goal: "Fluently divide multi-digit whole numbers using the standard algorithm, with and without a remainder.",
  standard: "6.NS.2",
  keyIdea: (
    <>
      <p>Long division works one digit at a time: bring down a digit, find how many times the divisor fits, multiply, subtract, and repeat.</p>
      <p>If anything is left over at the very end, that's the remainder.</p>
    </>
  ),
  Explore,
  preview: Preview,
  problems: [
    { label: "No remainder", make: noRemainderProblem },
    { label: "With remainder", make: withRemainderProblem },
    { label: "2-digit divisor", make: twoDigitDivisorProblem },
  ],
  test: longDivisionTest,
};
