import { useState } from "react";
import { EquivalentBars, FractionBar, NumberLine } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Frac, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { equivalentFractionsTest } from "./EquivalentFractionsTest";
import { MathText } from "../../../shared/components/MathText";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";

/** A small proper fraction, denominator in [2,6] — small enough that the
 *  rescaled EquivalentBars bottom tier (denominator × k, k up to 6) still
 *  renders readable cells. */
function baseFraction(): [number, number] {
  const d = randInt(2, 6);
  const n = randInt(1, d - 1);
  return [n, d];
}

// ============================================================================
// CHECK FOR UNDERSTANDING — fixed questions, gate before Practice unlocks
// ============================================================================

/**
 * Q1 typed: re-cut 2/3 into sixths and write the new fraction (the picture
 * is two plain bars, so the student counts and multiplies). Q2 the classic
 * trap (adding the same number to top and bottom), then typed: multiply
 * instead. Q3 vocabulary ("equivalent") plus the "bigger numbers means a
 * bigger fraction" confusion, then a typed multiplier. Q4 true/false plus a
 * typed missing denominator. Every question has a typed box (fill-in rule).
 * Carried forward: Q1/Q3 -> "Build an equivalent fraction" and "Spot the
 * equivalent" (typed multiplier); Q2 -> "Spot the equivalent" (the added-
 * instead distractor) and Test Q3/Q7; Q4 -> "Find the missing number"
 * (numer-known bucket) and Test Q2/Q5.
 */
function EquivalentCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>

        <div className="align-stack-wrap">
          <p>
            <b>1.</b> The top bar shows <Frac n={2} d={3} />. The bottom bar is the same bar, cut into smaller pieces.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <FractionBar numerator={2} denominator={3} width={240} />
            <FractionBar numerator={4} denominator={6} width={240} />
          </div>
          <DropdownQuestion
            blanks={[
              { correct: "2", label: "Pieces each third is cut into" },
              { correct: "4", label: "New numerator" },
              { correct: "6", label: "New denominator" },
            ]}
            render={([a, b, c]) => (
              <>
                Each third is cut into {a} pieces. So <Frac n={2} d={3} /> = <Frac n={b} d={c} />
              </>
            )}
            good="Yes. Each third became 2 pieces. 2 × 2 = 4 and 3 × 2 = 6, so 2/3 = 4/6."
            bad="Not quite. Count the pieces under one third. Then count all the pieces, and the shaded ones."
            onDone={mark(0)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Sam adds 2 to the top and the bottom of <Frac n={1} d={3} />. He gets <Frac n={3} d={5} />.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <FractionBar numerator={1} denominator={3} width={240} />
            <FractionBar numerator={3} denominator={5} width={240} />
          </div>
          <DropdownQuestion
            blanks={[
              { options: ["Yes", "No"], correct: "No", label: "Is 3/5 equal to 1/3" },
              { correct: "2", label: "Missing numerator" },
            ]}
            render={([a, b]) => (
              <>
                Is <Frac n={3} d={5} /> equal to <Frac n={1} d={3} />? {a} Multiply instead: <Frac n={1} d={3} /> = <Frac n={b} d={6} />
              </>
            )}
            good="Right. 1/3 is less than half, but 3/5 is more than half. Adding changes the amount. 1 × 2 = 2 and 3 × 2 = 6, so 1/3 = 2/6."
            bad="Not quite. Look at the two bars. Is the same amount shaded? For the box, multiply the top and bottom by the same number."
            onDone={mark(1)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>3.</b> <Frac n={3} d={4} /> and <Frac n={9} d={12} /> shade the same amount of a bar.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["equivalent", "improper"], correct: "equivalent", label: "What these fractions are called" },
              { options: ["the same size as", "bigger than", "smaller than"], correct: "the same size as", label: "How 9/12 compares to 3/4" },
              { correct: "3", label: "The number both were multiplied by" },
            ]}
            render={([a, b, c]) => (
              <>
                <Frac n={3} d={4} /> and <Frac n={9} d={12} /> are {a} fractions. <Frac n={9} d={12} /> has bigger numbers, but it is {b}{" "}
                <Frac n={3} d={4} />. You get <Frac n={9} d={12} /> by multiplying the top and bottom of <Frac n={3} d={4} /> by {c}.
              </>
            )}
            good="Yes. Equivalent fractions are the same amount. Bigger numbers just mean more, smaller pieces. 3 × 3 = 9 and 4 × 3 = 12."
            bad="Not quite. Equivalent means the same amount. For the box: 3 × what = 9? Does 4 × that number give 12?"
            onDone={mark(2)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>4.</b> True or false: <Frac n={2} d={5} /> = <Frac n={4} d={10} />, because the top and the bottom were both multiplied by 2.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "True", label: "True or false" },
              { correct: "10", label: "Missing denominator" },
            ]}
            render={([a, b]) => (
              <>
                That is {a}. Now find the missing denominator: <Frac n={1} d={2} /> = <Frac n={5} d={b} />
              </>
            )}
            good="Yes. 2 × 2 = 4 and 5 × 2 = 10, so it is true. For 1/2: the top went from 1 to 5, so multiply by 5. 2 × 5 = 10."
            bad="Not quite. Check the first part: is 2 × 2 = 4, and is 5 × 2 = 10? For the box: 1 × 5 = 5, so multiply the bottom by 5 too."
            onDone={mark(3)}
          />
        </div>
      </div>
    </MathText>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [[n, d]] = useState(baseFraction);
  const [k, setK] = useState(2);

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          Multiply the numerator AND the denominator by the same number. The value does not change. The same amount is just cut into more, smaller
          pieces. Try different numbers below.
        </p>
        <div className="controls">
          <Stepper label="Multiply both by" value={k} min={2} max={6} onChange={setK} tone="c" />
        </div>
        <EquivalentBars n={n} d={d} k={k} />
        <p className="muted small">
          <Frac n={n} d={d} /> and <Frac n={n * k} d={d * k} /> shade the same amount of the bar. On a number line, they are the same point. They are
          the same number, written two ways.
        </p>
        <NumberLine min={0} max={1} points={[{ value: n / d, label: `${n}/${d}`, tone: "a" }]} minorTicksPerUnit={d} />
        {/* Below the picture, so students explore first, then check. */}
        {(introActive || showCheck) && <EquivalentCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — find the missing number
// ============================================================================

// Two typed steps: first find the multiplier, then use it. The prompt no
// longer says "it was multiplied by k" (the Test asks with no such help, so
// Practice must not always give it either). The EquivalentBars picture shows
// the answer in its caption, so it appears only once both steps are done.
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
          <Frac n="?" d={D} /> is equivalent to <Frac n={n} d={d} />. What's the missing numerator?
        </>
      ),
      bucket: "denom-known",
      visual: (done: number) => (done >= 2 ? <EquivalentBars n={n} d={d} k={k} /> : <FractionBar numerator={n} denominator={d} />),
      steps: [
        {
          kind: "number",
          prompt: `The denominator went from ${d} to ${D}. What was it multiplied by?`,
          hint: `${d} × ? = ${D}`,
          explain: `${d} × ${k} = ${D}.`,
          answer: k,
        },
        {
          kind: "number",
          prompt: "What is the missing numerator?",
          hint: `Multiply the numerator ${n} by ${k} too.`,
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
        <Frac n={N} d="?" /> is equivalent to <Frac n={n} d={d} />. What's the missing denominator?
      </>
    ),
    bucket: "numer-known",
    visual: (done: number) => (done >= 2 ? <EquivalentBars n={n} d={d} k={k} /> : <FractionBar numerator={n} denominator={d} />),
    steps: [
      {
        kind: "number",
        prompt: `The numerator went from ${n} to ${N}. What was it multiplied by?`,
        hint: `${n} × ? = ${N}`,
        explain: `${n} × ${k} = ${N}.`,
        answer: k,
      },
      {
        kind: "number",
        prompt: "What is the missing denominator?",
        hint: `Multiply the denominator ${d} by ${k} too.`,
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
          hint: "Multiply the numerator AND the denominator by the same number. Adding the same number to both does not work.",
          // No multiplier here: the next step asks for it.
          explain: `${correct} is equivalent. ${addedInstead} comes from adding the same number to the top and bottom. Adding changes the value.`,
        },
        correct,
        [addedInstead, scaledWrong]
      ),
      {
        kind: "number",
        prompt: `What were the top and bottom of ${n}/${d} multiplied by to get ${correct}?`,
        hint: `${n} × ? = ${n * k}. Check that ${d} × the same number = ${d * k}.`,
        explain: `${n} × ${k} = ${n * k} and ${d} × ${k} = ${d * k}.`,
        answer: k,
      },
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

// Step 2 used to ask "Does this change the value?" — always "No", so it could
// be passed by tapping the same button every time. It now asks for a second
// equivalent fraction with a different multiplier (typed).
function buildEquivalentProblem(): Problem {
  const [n, d] = baseFraction();
  const k = randInt(2, 5);
  let k2 = randInt(2, 5);
  while (k2 === k) k2 = randInt(2, 5);
  const D2 = d * k2;

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
      {
        kind: "number",
        overDen: D2,
        prompt: `Now write another fraction equal to ${n}/${d}. This one has denominator ${D2}.`,
        hint: `${d} × ? = ${D2}. Multiply ${n} by the same number.`,
        explain: `${d} × ${k2} = ${D2}, and ${n} × ${k2} = ${n * k2}. So ${n}/${d} = ${n * k2}/${D2}.`,
        answer: n * k2,
      },
    ],
    wrapUp: (
      <>
        <Frac n={n} d={d} /> = <Frac n={n * k} d={d * k} /> = <Frac n={n * k2} d={D2} />.
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
  requiresIntro: true,
  preview: Preview,
  problems: [
    { label: "Find the missing number", make: missingNumberProblem, buckets: ["denom-known", "numer-known"] },
    { label: "Spot the equivalent", make: spotEquivalentProblem },
    { label: "Build an equivalent fraction", make: buildEquivalentProblem },
  ],
  test: equivalentFractionsTest,
};
