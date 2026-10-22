import { useState } from "react";
import { NumberLine } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { numberLineUnitTest } from "./NumberLineUnitTest";

const RANGE = 15;

/** Draws a nonzero integer in [-range, range] — 0 has no opposite worth
 *  asking about and no meaningful "which side" to read. */
const randNonzero = (range: number): number => {
  let v: number;
  do {
    v = randInt(-range, range);
  } while (v === 0);
  return v;
};

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [value, setValue] = useState(4);
  const opposite = -value;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Number" value={value} min={-RANGE} max={RANGE} step={1} onChange={setValue} tone="a" />
      </div>
      <NumberLine
        min={-RANGE}
        max={RANGE}
        points={
          value === 0
            ? [{ value: 0, tone: "a", onChange: setValue }]
            : [{ value, label: String(value), tone: "a", onChange: setValue }, { value: opposite, label: String(opposite), tone: "c" }]
        }
      />
      <p className="muted small">
        {value === 0
          ? "0 is its own opposite — it's exactly in the middle, not on either side."
          : `${value} and ${opposite} are opposites: the same distance from 0, on opposite sides. The opposite of the opposite of a number is the number itself — e.g. −(−${Math.abs(value)}) = ${Math.abs(value)}.`}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — number line
// ============================================================================

function numberLineProblem(targetBucket?: string): Problem {
  const bucket = targetBucket ?? (["read-negative", "read-positive", "opposite"] as const)[randInt(0, 2)];

  if (bucket === "opposite") {
    const n = randNonzero(RANGE);
    const opposite = -n;
    const distance = 2 * Math.abs(n);
    return {
      title: "Opposites on the number line",
      bucket,
      story: `What is the opposite of ${n}?`,
      visual: (done: number) => (
        <NumberLine min={-RANGE} max={RANGE} points={[{ value: n, label: String(n), tone: "a" }, ...(done >= 1 ? [{ value: opposite, label: String(opposite), tone: "c" as const }] : [])]} />
      ),
      steps: [
        {
          kind: "number",
          prompt: `What is the opposite of ${n}?`,
          hint: "Opposites are the same distance from 0, but on the other side of it.",
          explain: `The opposite of ${n} is ${opposite} — the same distance from 0, on the other side.`,
          answer: opposite,
        },
        {
          kind: "number",
          prompt: `Now what is the opposite of ${opposite}?`,
          hint: "The opposite of the opposite of a number is the number itself.",
          explain: `The opposite of ${opposite} is ${n} — opposite-of-opposite brings you right back to where you started.`,
          answer: n,
        },
        {
          kind: "number",
          prompt: `What is the distance between ${n} and ${opposite}?`,
          hint: `${n} and ${opposite} are each ${Math.abs(n)} away from 0, on opposite sides — add both distances together.`,
          explain: `${n} to 0 is ${Math.abs(n)}, and 0 to ${opposite} is another ${Math.abs(n)}, so the total distance is ${Math.abs(n)} + ${Math.abs(n)} = ${distance}.`,
          answer: distance,
        },
      ],
      wrapUp: `The opposite of ${n} is ${opposite}, the opposite of ${opposite} is ${n} again, and the distance between ${n} and ${opposite} is ${distance}.`,
    };
  }

  const isNegative = bucket === "read-negative";
  const value = isNegative ? -randInt(1, RANGE) : randInt(1, RANGE);
  const opposite = -value;
  const distance = 2 * Math.abs(value);
  return {
    title: "Reading the number line",
    bucket,
    story: "What number is marked on the number line?",
    // The marked point stays unlabeled until it's actually been answered
    // (step 1 IS "what number is this" — labeling it early would give the
    // answer away); its opposite only appears once THAT question (step 2)
    // is answered, for the same reason.
    visual: (done: number) => (
      <NumberLine
        min={-RANGE}
        max={RANGE}
        points={[
          { value, label: done >= 1 ? String(value) : undefined, tone: "a" },
          ...(done >= 2 ? [{ value: opposite, label: String(opposite), tone: "c" as const }] : []),
        ]}
      />
    ),
    steps: [
      {
        kind: "number",
        prompt: "What number is marked on the number line?",
        hint: "Count the tick marks from 0 — count left for negative, right for positive.",
        explain: `The marked point is ${value}.`,
        answer: value,
      },
      {
        kind: "number",
        prompt: `What is the opposite of ${value}?`,
        hint: "Opposites are the same distance from 0, but on the other side of it.",
        explain: `The opposite of ${value} is ${opposite} — the same distance from 0, on the other side.`,
        answer: opposite,
      },
      {
        kind: "number",
        prompt: `What is the distance between ${value} and its opposite, ${opposite}?`,
        hint: `${value} and ${opposite} are each ${Math.abs(value)} away from 0, on opposite sides — add both distances together.`,
        explain: `${value} to 0 is ${Math.abs(value)}, and 0 to ${opposite} is another ${Math.abs(value)}, so the total distance is ${Math.abs(value)} + ${Math.abs(value)} = ${distance}.`,
        answer: distance,
      },
    ],
    wrapUp: `The marked point is ${value}. Its opposite is ${opposite}, and the distance between them is ${distance}.`,
  };
}

export const numberLineUnit: Unit = {
  id: "numberLine",
  title: "The Number Line with Negatives",
  goal: "Find and position integers on a number line, and understand that a number and its opposite are the same distance from 0 on opposite sides.",
  standard: "6.NS.6",
  keyIdea: (
    <>
      <p>Every point on the number line is a number. Negative numbers sit to the left of 0; positive numbers sit to the right.</p>
      <p>A number and its opposite are the same distance from 0, on opposite sides — and the opposite of the opposite of a number is the number itself (0 is its own opposite).</p>
    </>
  ),
  Explore,
  problems: [{ label: "Number Line", make: numberLineProblem, buckets: ["read-negative", "read-positive", "opposite"] }],
  requiredBuckets: ["read-negative", "read-positive", "opposite"],
  test: numberLineUnitTest,
};
