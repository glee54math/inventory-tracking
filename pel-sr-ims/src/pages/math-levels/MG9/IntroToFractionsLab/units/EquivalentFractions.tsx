import { useState } from "react";
import { EquivalentBars, FractionBar, NumberLine } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Frac, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { equivalentFractionsTest } from "./EquivalentFractionsTest";

/** A small proper fraction, denominator in [2,6] — small enough that the
 *  rescaled EquivalentBars bottom tier (denominator × k, k up to 6) still
 *  renders readable cells. */
function baseFraction(): [number, number] {
  const d = randInt(2, 6);
  const n = randInt(1, d - 1);
  return [n, d];
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [[n, d]] = useState(baseFraction);
  const [k, setK] = useState(2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p>
        Multiplying (or dividing) the numerator AND denominator of a fraction by the same number never changes its value — it just cuts the same
        amount into a different number of pieces. Try different multipliers below.
      </p>
      <div className="controls">
        <Stepper label="Multiply both by" value={k} min={2} max={6} onChange={setK} tone="c" />
      </div>
      <EquivalentBars n={n} d={d} k={k} />
      <p className="muted small">
        <Frac n={n} d={d} /> and <Frac n={n * k} d={d * k} /> land on the exact same point — they're the same number, just written two ways.
      </p>
      <NumberLine min={0} max={1} points={[{ value: n / d, label: `${n}/${d}`, tone: "a" }]} minorTicksPerUnit={d} />
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — find the missing number
// ============================================================================

function missingNumberProblem(targetBucket?: string): Problem {
  const [n, d] = baseFraction();
  const k = randInt(2, 5);
  const wantsDenomKnown = targetBucket ? targetBucket === "denom-known" : Math.random() < 0.5;

  if (wantsDenomKnown) {
    const D = d * k;
    return {
      title: "Find the missing numerator",
      story: (
        <>
          ?/{D} is equivalent to <Frac n={n} d={d} />. What's the missing numerator?
        </>
      ),
      bucket: "denom-known",
      visual: (done: number) => (done >= 1 ? <EquivalentBars n={n} d={d} k={k} /> : <Frac n={n} d={d} />),
      steps: [
        {
          kind: "number",
          prompt: `The denominator went from ${d} to ${D} — it was multiplied by ${k}. Do the same to the numerator: ${n} × ${k} = ?`,
          hint: `${D} ÷ ${d} = ${k}, so multiply the numerator by ${k} too.`,
          explain: `${n} × ${k} = ${n * k}.`,
          answer: n * k,
        },
      ],
      wrapUp: (
        <>
          <Frac n={n} d={d} /> = <Frac n={n * k} d={D} />.
        </>
      ),
    };
  }

  const N = n * k;
  return {
    title: "Find the missing denominator",
    story: (
      <>
        {N}/? is equivalent to <Frac n={n} d={d} />. What's the missing denominator?
      </>
    ),
    bucket: "numer-known",
    visual: (done: number) => (done >= 1 ? <EquivalentBars n={n} d={d} k={k} /> : <Frac n={n} d={d} />),
    steps: [
      {
        kind: "number",
        prompt: `The numerator went from ${n} to ${N} — it was multiplied by ${k}. Do the same to the denominator: ${d} × ${k} = ?`,
        hint: `${N} ÷ ${n} = ${k}, so multiply the denominator by ${k} too.`,
        explain: `${d} × ${k} = ${d * k}.`,
        answer: d * k,
      },
    ],
    wrapUp: (
      <>
        <Frac n={n} d={d} /> = <Frac n={N} d={d * k} />.
      </>
    ),
  };
}

// ============================================================================
// PROBLEM TYPE 2 — spot the equivalent
// ============================================================================

function spotEquivalentProblem(): Problem {
  const [n, d] = baseFraction();
  const k = randInt(2, 5);
  const correct = `${n * k}/${d * k}`;
  // The classic wrong strategy — adding k to both instead of multiplying —
  // deliberately included as a distractor, not a random wrong number.
  const addedInstead = `${n + k}/${d + k}`;
  const scaledWrong = `${n * k + 1}/${d * k}`;

  return {
    title: "Spot the equivalent fraction",
    story: (
      <>
        Which fraction is equivalent to <Frac n={n} d={d} />?
      </>
    ),
    visual: () => <FractionBar numerator={n} denominator={d} />,
    steps: [
      choice(
        {
          prompt: `Which of these equals ${n}/${d}?`,
          hint: "Equivalent fractions come from multiplying both the numerator AND denominator by the same number — not adding the same number to both.",
          explain: `${n} × ${k} = ${n * k} and ${d} × ${k} = ${d * k}, so ${correct} is equivalent. ${addedInstead} comes from ADDING ${k} to both instead of multiplying — that changes the value.`,
        },
        correct,
        [addedInstead, scaledWrong]
      ),
    ],
    wrapUp: (
      <>
        <Frac n={n} d={d} /> = {correct}.
      </>
    ),
  };
}

// ============================================================================
// PROBLEM TYPE 3 — build an equivalent fraction
// ============================================================================

function buildEquivalentProblem(): Problem {
  const [n, d] = baseFraction();
  const k = randInt(2, 5);

  return {
    title: "Build an equivalent fraction",
    story: (
      <>
        Multiply <Frac n={n} d={d} /> by {k} — both the numerator and the denominator.
      </>
    ),
    visual: (done: number) => (done >= 1 ? <EquivalentBars n={n} d={d} k={k} /> : <Frac n={n} d={d} />),
    steps: [
      {
        kind: "ratio",
        tones: "none",
        labels: ["numerator", "denominator"],
        prompt: `Multiply both the numerator and denominator of ${n}/${d} by ${k}.`,
        hint: `${n} × ${k} = ?, and ${d} × ${k} = ?`,
        explain: `${n} × ${k} = ${n * k}, and ${d} × ${k} = ${d * k}.`,
        answer: [n * k, d * k],
      },
      choice(
        { prompt: "Does this change the value of the fraction?", hint: "Think about what the diagram showed.", explain: "Multiplying both numerator and denominator by the same number cuts the pieces smaller but shades the exact same amount — the value stays the same." },
        "No — it's the same amount, just cut into more, smaller pieces",
        ["Yes — the new fraction is bigger", "Yes — the new fraction is smaller"]
      ),
    ],
    wrapUp: (
      <>
        <Frac n={n} d={d} /> = <Frac n={n * k} d={d * k} />.
      </>
    ),
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <EquivalentBars n={1} d={2} k={3} width={220} topHeight={40} />;
}

export const equivalentFractions: Unit = {
  id: "equivalentFractions",
  title: "Equivalent Fractions",
  goal: "Recognize and build equivalent fractions by multiplying (or dividing) the numerator and denominator by the same number.",
  standard: "4.NF.1",
  keyIdea: (
    <>
      <p>Two fractions are equivalent when they name the same point on the number line, even if they're written with different numbers.</p>
      <p>Multiplying (or dividing) a fraction's numerator and denominator by the same nonzero number never changes its value.</p>
    </>
  ),
  Explore,
  preview: Preview,
  problems: [
    { label: "Find the missing number", make: missingNumberProblem, buckets: ["denom-known", "numer-known"] },
    { label: "Spot the equivalent", make: spotEquivalentProblem },
    { label: "Build an equivalent fraction", make: buildEquivalentProblem },
  ],
  test: equivalentFractionsTest,
};
