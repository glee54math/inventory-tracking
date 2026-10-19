import { useState } from "react";
import { NumberLine } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";

const RANGE = 20;

const randNonzero = (range: number): number => {
  let v: number;
  do {
    v = randInt(-range, range);
  } while (v === 0);
  return v;
};

const randDistinctPair = (range: number): [number, number] => {
  const a = randNonzero(range);
  let b = randNonzero(range);
  while (b === a) b = randNonzero(range);
  return [a, b];
};

/** Two DISTINCT positive integers in [min, max] — used wherever a bucket
 *  needs two values that stay distinct even after a sign/transform is
 *  applied to both (drawing a plain distinct pair and THEN transforming,
 *  e.g. via -Math.abs(), can silently collapse two different inputs to the
 *  same output — e.g. 10 and -10 both become -10 after negating the
 *  magnitude). Building the pair from already-distinct magnitudes avoids that. */
const randDistinctPositive = (min: number, max: number): [number, number] => {
  const a = randInt(min, max);
  let b = randInt(min, max);
  while (b === a) b = randInt(min, max);
  return [a, b];
};

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [a, setA] = useState(-3);
  const [b, setB] = useState(-7);
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="controls">
        <Stepper label="First number" value={a} min={-RANGE} max={RANGE} step={1} onChange={setA} tone="a" />
        <Stepper label="Second number" value={b} min={-RANGE} max={RANGE} step={1} onChange={setB} tone="b" />
      </div>
      <NumberLine min={-RANGE} max={RANGE} points={[{ value: a, label: String(a), tone: "a" }, { value: b, label: String(b), tone: "b" }]} />
      {a === b ? (
        <p className="muted small">Those are equal — try changing one of them.</p>
      ) : (
        <p className="muted small">
          {bigger} is to the right of {smaller} on the number line, so {bigger} &gt; {smaller}. And no matter the sign: |{a}| = {Math.abs(a)},
          |{b}| = {Math.abs(b)} — absolute value is just the distance from 0, always zero or positive.
        </p>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — comparing, ordering & absolute value
// ============================================================================

type Bucket = "inequality" | "real-world-order" | "absolute-value" | "magnitude-vs-order";
const BUCKETS: Bucket[] = ["inequality", "real-world-order", "absolute-value", "magnitude-vs-order"];

function comparingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "inequality") {
    const [a, b] = randDistinctPair(RANGE);
    const bigger = Math.max(a, b);
    const smaller = Math.min(a, b);
    return {
      title: "Comparing integers",
      bucket,
      story: `Which is greater: ${a} or ${b}?`,
      visual: () => <NumberLine min={-RANGE} max={RANGE} points={[{ value: a, label: String(a), tone: "a" }, { value: b, label: String(b), tone: "b" }]} />,
      steps: [
        choice(
          { prompt: `Which is greater, ${a} or ${b}?`, hint: "On a number line, numbers further right are greater.", explain: `${bigger} is farther right on the number line, so ${bigger} > ${smaller}.` },
          String(bigger),
          [String(smaller)]
        ),
        choice(
          {
            prompt: `${bigger} > ${smaller} — what does that mean on the number line?`,
            hint: "The greater number is the one closer to the right.",
            explain: `${bigger} > ${smaller} means ${bigger} is located to the right of ${smaller} on the number line.`,
          },
          `${bigger} is to the right of ${smaller}`,
          [`${bigger} is to the left of ${smaller}`]
        ),
      ],
      wrapUp: `${bigger} > ${smaller}.`,
    };
  }

  if (bucket === "real-world-order") {
    const [magA, magB] = randDistinctPositive(1, 20); // classic case: two negative temperatures
    const a = -magA;
    const b = -magB;
    const warmer = Math.max(a, b);
    const colder = Math.min(a, b);
    return {
      title: "Ordering in real life",
      bucket,
      story: `It is ${a}°C in one city and ${b}°C in another.`,
      visual: () => <NumberLine min={-25} max={5} points={[{ value: a, label: `${a}°C`, tone: "a" }, { value: b, label: `${b}°C`, tone: "b" }]} />,
      steps: [
        choice(
          { prompt: "Which city is warmer?", hint: "Warmer means a greater temperature — farther right on the number line.", explain: `${warmer}°C is warmer than ${colder}°C.` },
          `${warmer}°C`,
          [`${colder}°C`]
        ),
        choice(
          {
            prompt: "Which inequality correctly compares them?",
            hint: "The warmer temperature is the greater number.",
            explain: `${warmer}°C > ${colder}°C, since ${warmer} is to the right of ${colder} on the number line.`,
          },
          `${warmer}°C > ${colder}°C`,
          [`${warmer}°C < ${colder}°C`]
        ),
      ],
      wrapUp: `${warmer}°C > ${colder}°C — ${warmer}°C is warmer.`,
    };
  }

  if (bucket === "absolute-value") {
    const n = randNonzero(RANGE + 10);
    return {
      title: "Absolute value",
      bucket,
      story: `What is |${n}|?`,
      visual: () => <NumberLine min={-(RANGE + 10)} max={RANGE + 10} points={[{ value: n, tone: "a" }]} />,
      steps: [
        {
          kind: "number",
          prompt: `What is |${n}|?`,
          hint: "Absolute value is the distance from 0 — always zero or positive, never negative.",
          explain: `|${n}| = ${Math.abs(n)}, the distance from 0 to ${n}.`,
          answer: Math.abs(n),
        },
      ],
      wrapUp: `|${n}| = ${Math.abs(n)}.`,
    };
  }

  // magnitude-vs-order: the classic "a smaller (more negative) balance means a BIGGER debt" case
  const [debtA, debtB] = randDistinctPositive(5, 50);
  const balanceA = -debtA;
  const balanceB = -debtB;
  const smallerBalance = Math.min(balanceA, balanceB);
  const biggerDebt = Math.max(debtA, debtB);
  const whichAccount = smallerBalance === balanceA ? "A" : "B";
  return {
    title: "Balance size vs. debt size",
    bucket,
    story: `Account A has a balance of ${balanceA} dollars. Account B has a balance of ${balanceB} dollars.`,
    visual: () => (
      <NumberLine min={-60} max={10} points={[{ value: balanceA, label: "A", tone: "a" }, { value: balanceB, label: "B", tone: "b" }]} />
    ),
    steps: [
      choice(
        {
          prompt: "Which account has the SMALLER balance (further in debt)?",
          hint: "A smaller (more negative) balance means more money owed, even though the number itself is \"less.\"",
          explain: `${smallerBalance} is less than the other balance, so Account ${whichAccount} owes more — a smaller balance is a bigger debt.`,
        },
        `Account ${whichAccount}`,
        [`Account ${whichAccount === "A" ? "B" : "A"}`]
      ),
      {
        kind: "number",
        prompt: "What is the size of that bigger debt, in dollars?",
        hint: "The debt size is the absolute value of the (negative) balance.",
        explain: `The smaller balance is the bigger debt: |${smallerBalance}| = ${biggerDebt} dollars.`,
        answer: biggerDebt,
      },
    ],
    wrapUp: `The account with the smaller (more negative) balance owes the bigger debt: $${biggerDebt}.`,
  };
}

export const comparingOrdering: Unit = {
  id: "comparingOrdering",
  title: "Comparing, Ordering & Absolute Value",
  goal: "Compare and order rational numbers using a number line, interpret real-world order statements, and understand absolute value as distance from 0.",
  standard: "6.NS.7",
  keyIdea: (
    <>
      <p>A number is greater than another if it's farther right on the number line — even when both are negative, e.g. −3 &gt; −7.</p>
      <p>Absolute value is distance from 0, always zero or positive — so a smaller (more negative) number can still mean a BIGGER debt or distance.</p>
    </>
  ),
  Explore,
  problems: [{ label: "Compare & Order", make: comparingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
};
