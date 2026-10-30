import { useEffect, useState } from "react";
import { NumberLine } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { fractionsOnANumberLineTest } from "./FractionsOnANumberLineTest";

// Own local copy of the lab-wide denominator set — every unit file keeps its
// own copy rather than importing it from a sibling unit file, same
// no-cross-unit-import convention as every *Test.tsx in this app (see
// WhatAFractionIsTest.tsx's comment). Keep in sync with WhatAFractionIs.tsx's
// own DENOMS if this set is ever revisited.
const DENOMS = [2, 3, 4, 6, 8] as const;

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * Three fixed questions. Q1 is the direct conceptual leap this whole unit is
 * about (a fraction isn't just "parts of a shape" anymore — it's a point,
 * same as any whole number). Q2 is a hands-on drag check (same pattern as
 * MM1_NegativeNumbersLab's PositiveNegativePreCheck) proving the student can
 * actually place a fraction, not just recognize the idea in words. Q3 checks
 * the "partition it yourself" skill the harder Practice bucket needs: given
 * no ticks at all, how many equal parts does showing fourths even require?
 */
function FractionNumberLineCheck({ onComplete }: { onComplete?: () => void }) {
  const [q1, setQ1] = useState<string | null>(null);
  const q1Done = q1 === "same";

  const dragTarget = 0.75;
  const [q2Value, setQ2Value] = useState(0);
  const q2Done = q2Value === dragTarget;

  const [q3, setQ3] = useState<number | null>(null);
  const q3Done = q3 === 4;

  const allDone = q1Done && q2Done && q3Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure a fraction can be a point before you try practice problems.</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> A whole number like 2 is a point on the number line. What about a fraction, like 3/4?
        </p>
        <div className="control-row">
          {[
            { id: "same", label: "It's also a point on the number line, same as any whole number" },
            { id: "diff", label: "It's only ever a picture of parts of a shape, never a point" },
          ].map((opt) => (
            <button key={opt.id} type="button" className={`btn ghost ${q1 === opt.id ? "pressed" : ""}`} disabled={q1Done} onClick={() => setQ1(opt.id)}>
              {opt.label}
            </button>
          ))}
        </div>
        {q1 && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done
              ? "Correct — every fraction sits at exactly one spot on the number line, just like every whole number does."
              : "Not quite — a fraction can be drawn as parts of a shape AND as a single point on the number line. Try again."}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> Drag the dot to 3/4.
        </p>
        <NumberLine min={0} max={1} minorTicksPerUnit={4} snapDenominator={4} points={[{ value: q2Value, label: q2Done ? "3/4" : undefined, tone: q2Done ? "a" : "b", onChange: q2Done ? undefined : setQ2Value }]} />
        {q2Done && (
          <p className="feedback good" role="alert">
            Correct — 3/4 is three of the four equal parts past 0.
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> This number line has no tick marks yet. To show fourths, into how many equal parts should the space between 0 and 1 be split?
        </p>
        <NumberLine min={0} max={1} points={[]} />
        <div className="control-row">
          {[3, 4, 5].map((n) => (
            <button key={n} type="button" className={`btn ghost ${q3 === n ? "pressed" : ""}`} disabled={q3Done} onClick={() => setQ3(n)}>
              {n}
            </button>
          ))}
        </div>
        {q3 !== null && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done ? "Correct — fourths means 4 equal parts between 0 and 1." : "Not quite — look at the word \"fourths.\" How many equal parts does that name?"}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [den, setDen] = useState(4);
  const [value, setValue] = useState(0);
  const snapped = Math.round(value * den);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && (
        <button
          type="button"
          className="btn ghost"
          style={{ width: "fit-content", ...(showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
          onClick={() => setShowCheck((v) => !v)}
        >
          Quick Check
        </button>
      )}
      {(introActive || showCheck) && <FractionNumberLineCheck onComplete={onIntroDone} />}
      <p>A fraction isn't just part of a shape — it's a point on the number line, exactly like a whole number. Drag the dot and watch its name change.</p>
      <Segmented label="Split each whole into" value={String(den)} onChange={(v) => setDen(Number(v))} options={DENOMS.map((d) => ({ id: String(d), label: `${d} parts` }))} />
      <div className="control-row">
        <Stepper label="Value" value={value} min={0} max={2} step={1 / den} onChange={setValue} tone="a" />
      </div>
      <NumberLine min={0} max={2} minorTicksPerUnit={den} snapDenominator={den} points={[{ value, label: `${snapped}/${den}`, tone: "a", onChange: setValue }]} />
      <p className="muted small">Drag the dot past 1 — the same equal-size parts keep going, so a fraction like {den + 1}/{den} is just one more part past a whole.</p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — identify a unit fraction on a pre-partitioned line
// ============================================================================

function identifyUnitProblem(): Problem {
  const d = DENOMS[randInt(0, DENOMS.length - 1)];
  return {
    title: "Reading a fraction on the number line",
    bucket: "identify-unit",
    story: "",
    visual: () => <NumberLine min={0} max={1} minorTicksPerUnit={d} points={[{ value: 1 / d, tone: "a" }]} />,
    steps: [
      {
        kind: "number",
        prompt: "Into how many equal parts is the space between 0 and 1 split?",
        hint: "Count the spaces between tick marks from 0 to 1, not the tick marks themselves.",
        explain: `${d} equal parts — that's the denominator.`,
        answer: d,
      },
      choice(
        {
          prompt: "Which fraction is marked?",
          hint: `The line between 0 and 1 is split into ${d} equal parts — count how many parts from 0 the dot is.`,
          explain: `The dot is 1 part out of ${d} equal parts from 0, so it's 1/${d}.`,
        },
        `1/${d}`,
        // Off-by-one numerator, and counting from the 1 end (or picking the 0 tick).
        [`2/${d}`, d > 3 ? `${d - 1}/${d}` : `0/${d}`]
      ),
    ],
    wrapUp: `The marked point is 1/${d}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — identify a non-unit fraction on a pre-partitioned line
// ============================================================================

function identifyNonUnitProblem(): Problem {
  const d = DENOMS.filter((x) => x >= 3)[randInt(0, DENOMS.filter((x) => x >= 3).length - 1)];
  const a = randInt(2, d - 1);
  return {
    title: "Reading a fraction on the number line",
    bucket: "identify-nonunit",
    story: "",
    visual: () => <NumberLine min={0} max={1} minorTicksPerUnit={d} points={[{ value: a / d, tone: "a" }]} />,
    steps: [
      {
        kind: "number",
        prompt: "Into how many equal parts is the space between 0 and 1 split?",
        hint: "Count the spaces between tick marks from 0 to 1, not the tick marks themselves.",
        explain: `${d} equal parts — that's the denominator.`,
        answer: d,
      },
      choice(
        {
          prompt: "Which fraction is marked?",
          hint: `The line between 0 and 1 is split into ${d} equal parts — count how many parts from 0 the dot is.`,
          explain: `The dot is ${a} parts out of ${d} equal parts from 0, so it's ${a}/${d}.`,
        },
        `${a}/${d}`,
        [`${a - 1}/${d}`, `${a + 1}/${d}`]
      ),
    ],
    wrapUp: `The marked point is ${a}/${d}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — partition an unmarked line, then place a fraction
// ============================================================================

function partitionThenPlaceProblem(): Problem {
  const d = DENOMS[randInt(0, DENOMS.length - 1)];
  const a = randInt(1, d - 1);
  const wordFor: Record<number, string> = { 2: "halves", 3: "thirds", 4: "fourths", 6: "sixths", 8: "eighths" };

  return {
    title: "Placing a fraction on a blank line",
    bucket: "partition-then-place",
    story: `Place ${a}/${d} on the number line between 0 and 1.`,
    visual: (done: number) => {
      if (done >= 2) return <NumberLine min={0} max={1} minorTicksPerUnit={d} points={[{ value: a / d, label: `${a}/${d}`, tone: "a" }]} />;
      if (done >= 1) return <NumberLine min={0} max={1} minorTicksPerUnit={d} points={[]} />;
      return <NumberLine min={0} max={1} points={[]} />;
    },
    steps: [
      {
        kind: "number",
        prompt: `To show ${wordFor[d]}, into how many equal parts should the line between 0 and 1 be split?`,
        hint: `The denominator, ${d}, tells you how many equal parts.`,
        explain: `${wordFor[d]} means ${d} equal parts between 0 and 1.`,
        answer: d,
      },
      {
        kind: "number",
        prompt: `Starting at 0, which equal part (tick number) is ${a}/${d}?`,
        hint: `The numerator, ${a}, tells you how many parts from 0.`,
        explain: `${a}/${d} is ${a} equal parts past 0.`,
        answer: a,
      },
    ],
    wrapUp: `${a}/${d} sits at the ${a}${a === 1 ? "st" : a === 2 ? "nd" : a === 3 ? "rd" : "th"} tick out of ${d} equal parts.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — fractions greater than 1, past the first whole
// ============================================================================

function beyondOneProblem(): Problem {
  const d = DENOMS[randInt(0, DENOMS.length - 1)];
  const leftover = randInt(1, d - 1);
  const num = d + leftover;
  return {
    title: "Reading a fraction greater than 1",
    bucket: "beyond-one",
    story: "",
    visual: () => <NumberLine min={0} max={2} minorTicksPerUnit={d} points={[{ value: num / d, tone: "a" }]} />,
    steps: [
      {
        kind: "number",
        prompt: "Into how many equal parts is EACH whole (0 to 1, and 1 to 2) split?",
        hint: "Count the spaces between ticks from 0 to 1.",
        explain: `${d} equal parts in each whole — the same size keeps going past 1.`,
        answer: d,
      },
      {
        kind: "number",
        prompt: "Counting from 0, how many equal parts is it to the dot — including the ones before 1?",
        hint: `A whole is ${d} parts; count on from there.`,
        explain: `${d} parts to reach 1, plus ${leftover} more = ${num} parts.`,
        answer: num,
      },
      choice(
        {
          prompt: "Which fraction names the marked point?",
          hint: "Count every equal part from 0, including the ones past the first whole.",
          explain: `The dot is ${num} equal parts past 0 (one full whole of ${d} parts, plus ${leftover} more), so it's ${num}/${d}.`,
        },
        `${num}/${d}`,
        // Forgetting the whole already passed (just the leftover part), and an
        // off-by-one count past it.
        [`${leftover}/${d}`, `${num + 1}/${d}`]
      ),
    ],
    wrapUp: `The marked point is ${num}/${d} — one whole (${d}/${d}) plus ${leftover} more.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <NumberLine min={0} max={1} minorTicksPerUnit={4} points={[{ value: 0.75, label: "3/4", tone: "a" }]} />;
}

export const fractionsOnANumberLine: Unit = {
  id: "fractionsOnANumberLine",
  title: "Fractions on a Number Line",
  goal: "Find and place a fraction like 1/4 or 3/4 at its correct point on a number line between 0 and 1 (or beyond).",
  standard: "3.NF.2a-b",
  keyIdea: (
    <>
      <p>A fraction is a point on the number line, exactly like a whole number — not just a picture of parts of a shape.</p>
      <p>Splitting the line between 0 and 1 into b equal parts and counting a of them from 0 lands you at a/b.</p>
      <p>The same equal-size parts keep going past 1 — a fraction can be greater than 1, like 5/4.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["identify-unit", "identify-nonunit", "partition-then-place", "beyond-one"],
  problems: [
    { label: "Read a unit fraction", make: identifyUnitProblem, buckets: ["identify-unit"] },
    { label: "Read a fraction", make: identifyNonUnitProblem, buckets: ["identify-nonunit"] },
    { label: "Place it yourself", make: partitionThenPlaceProblem, buckets: ["partition-then-place"] },
    { label: "Past one whole", make: beyondOneProblem, buckets: ["beyond-one"] },
  ],
  test: fractionsOnANumberLineTest,
};
