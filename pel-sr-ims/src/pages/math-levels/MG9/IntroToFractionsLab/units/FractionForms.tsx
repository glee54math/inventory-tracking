import { useState } from "react";
import { FractionBar, FractionCircle, FractionNumberLine, WholePlusPartBar, WholePlusPartCircles } from "../diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Frac, QA, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { fractionFormsTest } from "./FractionFormsTest";
import { MathText } from "../../../shared/components/MathText";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";

/** A proper fraction: numerator < denominator. */
function properFraction(): [number, number] {
  const d = randInt(2, 9);
  const n = randInt(1, d - 1);
  return [n, d];
}

/** An improper fraction: numerator > denominator, so it's worth more than one
 *  whole. Never a whole-number multiple of d (8/4, 9/3): those have nothing
 *  left over, so "write it as a mixed number" would come out as "2 0/4". */
function improperFraction(): [number, number] {
  const d = randInt(2, 8);
  let n = randInt(d + 1, d * 4);
  while (n % d === 0) n = randInt(d + 1, d * 4);
  return [n, d];
}

/** A mixed number's parts — a nonzero whole part plus a nonzero leftover,
 *  so it reads as a genuine mixed number (not secretly a plain whole). */
function mixedParts(): { whole: number; leftover: number; den: number } {
  const den = randInt(2, 8);
  const whole = randInt(1, 4);
  const leftover = randInt(1, den - 1);
  return { whole, leftover, den };
}

// ============================================================================
// CHECK FOR UNDERSTANDING — fixed questions, gate before Practice unlocks
// ============================================================================

/**
 * Q1 vocabulary, with the two commonly swapped words in one question (the
 * denominator says how many parts make a whole; the numerator counts the
 * shaded ones). Q2 improper -> mixed, typed boxes under the picture. Q3
 * mixed -> improper, typed. Q4 the boundary trap: n/n is NOT proper (it is
 * exactly one whole), plus a typed "equal to 1 whole". 3 of 4 questions are
 * typed (fill-in rule). Carried forward: Q1/Q2/Q3 -> every Practice type and
 * Test Q4-Q9; Q4 -> the Practice "Classify" improper case (n/n sometimes)
 * and Test Q10.
 */
function FormsCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  const PARTS = ["numerator", "denominator"];
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>

        <div className="align-stack-wrap">
          <p>
            <b>1.</b> This bar shows <Frac n={3} d={8} />.
          </p>
          <FractionBar numerator={3} denominator={8} width={240} />
          <DropdownQuestion
            blanks={[
              { options: PARTS, correct: "denominator", label: "Which number tells how many equal parts make one whole" },
              { options: PARTS, correct: "numerator", label: "Which number tells how many parts are shaded" },
            ]}
            render={([a, b]) => (
              <>
                In <Frac n={3} d={8} />, the {a} tells how many equal parts make one whole. The {b} tells how many parts are shaded.
              </>
            )}
            good="Yes. The denominator, 8, tells how many parts make the whole. The numerator, 3, counts the shaded parts."
            bad="Not quite. Count all the parts in the bar. Which number in 3/8 matches that count?"
            onDone={mark(0)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Here is <Frac n={9} d={4} />.
          </p>
          <WholePlusPartBar whole={2} leftoverNum={1} den={4} />
          <DropdownQuestion
            blanks={[
              { correct: "2", label: "How many whole bars are full" },
              { correct: "1", label: "How many fourths are left over" },
              { correct: "2 1/4", label: "9/4 as a mixed number", mixedFraction: true, accept: (raw) => raw.replace(/\s+/g, " ").trim() === "2 1/4" },
            ]}
            render={([a, b, c]) => (
              <>
                <Frac n={9} d={4} /> fills {a} whole bars. There is {b} fourth left over. So <Frac n={9} d={4} /> = {c}
              </>
            )}
            good="Yes. 8 fourths fill 2 whole bars, and 1 fourth is left over. 9/4 = 2 1/4."
            bad="Not quite. Count the full bars first. Then count the shaded parts in the last bar. Write the mixed number with both."
            onDone={mark(1)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Here is <MathText>2 2/3</MathText>.
          </p>
          <WholePlusPartBar whole={2} leftoverNum={2} den={3} />
          <DropdownQuestion
            blanks={[
              { correct: "3", label: "Thirds in one whole" },
              { correct: "6", label: "Thirds in 2 wholes" },
              { correct: "8", label: "Numerator of the improper fraction" },
            ]}
            render={([a, b, c]) => (
              <>
                One whole bar has {a} thirds. So 2 wholes are {b} thirds. That means <MathText>2 2/3</MathText> = <Frac n={c} d={3} />
              </>
            )}
            good="Yes. 2 × 3 = 6 thirds, plus 2 more thirds makes 8 thirds. 2 2/3 = 8/3."
            bad="Not quite. Count the parts in one full bar. Then count every shaded part in all the bars."
            onDone={mark(2)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Here is <Frac n={6} d={6} />.
          </p>
          <FractionBar numerator={6} denominator={6} width={240} />
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "True or false" },
              { correct: "1", label: "How many wholes 6/6 is equal to" },
            ]}
            render={([a, b]) => (
              <>
                True or false: <Frac n={6} d={6} /> is a proper fraction. {a} <Frac n={6} d={6} /> is equal to {b} whole.
              </>
            )}
            good="Yes, it is false. A proper fraction is less than 1 whole. 6/6 fills the whole bar, so it is improper."
            bad="Not quite. Is the bar partly shaded or full? A proper fraction is less than 1 whole."
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

/**
 * The student converts one generated improper fraction into its whole +
 * leftover parts themselves, watching the decomposed-bar picture update live
 * as they adjust two Steppers — concrete manipulation first (IES
 * recommendation #1), with the number line making the point that the
 * fraction and the mixed number are the exact same NUMBER, just two ways of
 * naming it (IES recommendation #2). The gate before Practice is the fixed
 * FormsCheck below the picture (one-time gate, no reintroEverySolved — this
 * is concept building, not a fact that decays).
 */
function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [[num, den]] = useState(improperFraction);
  const correctWhole = Math.floor(num / den);
  const correctLeftover = num % den;

  const [whole, setWhole] = useState(0);
  const [leftover, setLeftover] = useState(0);
  const [checked, setChecked] = useState(false);
  const ok = whole === correctWhole && leftover === correctLeftover;

  // Self-check dropdown for the opening sentence — num/den always comes from
  // improperFraction(), so "improper" is always correct here, but making the
  // student pick rather than just reading "is an improper fraction" off the
  // page is the point. The reason sentence shows only after the right pick,
  // so it can't give the answer away.
  const [formGuess, setFormGuess] = useState("");

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        {/* Fixed, non-randomized anchor pictures — the pizza-slice model most
            students already have an informal sense of (IES recommendation #1:
            build on that before the abstract rule). Two examples: an ordinary
            proper fraction, and the improper/mixed pair the rest of this unit
            is about — shown as ONE picture read two ways. */}
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          <div>
            <FractionCircle numerator={3} denominator={4} radius={52} showNumbers />
            <p className="muted small" style={{ maxWidth: 160 }}>
              <Frac n={3} d={4} /> — a proper fraction: 3 of the 4 equal slices are shaded.
            </p>
          </div>
          <div>
            <WholePlusPartCircles whole={1} leftoverNum={1} den={3} radius={48} />
            <p className="muted small" style={{ maxWidth: 260 }}>
              <Frac n={4} d={3} /> = 1 <Frac n={1} d={3} /> — the same picture, read two ways: 4 shaded thirds in all, or 1 whole pizza plus 1/3 of another.
            </p>
          </div>
        </div>
        <p>
          <Frac n={num} d={den} /> is{" "}
          <select className="answer" value={formGuess} onChange={(e) => setFormGuess(e.target.value)} aria-label="Is this a proper fraction, an improper fraction, or a mixed number?">
            <option value="" disabled>
              choose one
            </option>
            <option value="proper">a proper fraction</option>
            <option value="improper">an improper fraction</option>
            <option value="mixed">a mixed number</option>
          </select>
          {formGuess && (
            <b style={{ color: formGuess === "improper" ? "var(--good)" : "var(--bad)", marginLeft: 8 }}>
              {formGuess === "improper" ? "✓" : "Not quite — compare the numerator to the denominator."}
            </b>
          )}
          .{formGuess === "improper" && <> Its numerator is bigger than its denominator, so it is worth more than one whole.</>}
        </p>
        <p>
          Every improper fraction can also be written as a <b>mixed number</b>: a whole number plus a proper fraction.
        </p>
        {/* Two number lines, same tick positions, two label conventions — the
            "same number, two names" idea made spatial: every 1/den tick is
            labeled, first as a raw improper fraction (never simplified, so
            den/den reads "6/6" not "1"), then as a mixed number (whole numbers
            bare, the rest as whole + leftover/den). */}
        <p className="muted small" style={{ marginBottom: -8 }}>
          As an improper fraction:
        </p>
        <FractionNumberLine denominator={den} numerator={num} labelStyle="fraction" />
        <p className="muted small" style={{ marginBottom: -8 }}>
          The same points, as mixed numbers:
        </p>
        <FractionNumberLine denominator={den} numerator={num} labelStyle="mixed" />
        <div className="align-drill">
          <p className="intro-gate-title">
            Try it: write <Frac n={num} d={den} /> as a mixed number. How many whole groups of {den}? How many are left over?
          </p>
          <div className="controls">
            <Stepper label="Whole groups" value={whole} min={0} max={correctWhole + 2} onChange={setWhole} tone="a" />
            <Stepper label="Leftover numerator" value={leftover} min={0} max={den - 1} onChange={setLeftover} tone="b" />
          </div>
          <WholePlusPartBar whole={whole} leftoverNum={leftover} den={den} />
          <button className="btn primary" onClick={() => setChecked(true)}>
            Check my work
          </button>
          {checked && (
            <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
              {ok
                ? `Exactly — ${num}/${den} = ${correctWhole} ${correctLeftover}/${den}. Same number, two names.`
                : `Not quite. Count by ${den}s toward ${num}. How many ${den}s fit? How many are left?`}
            </p>
          )}
        </div>
        {/* Below the picture, so students explore first, then check. */}
        {(introActive || showCheck) && <FormsCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — classify the form
// ============================================================================

// The picture appears once both steps are done: it would show the answer to
// the typed step (how many parts / whole bars) before the student works it out.
function classifyProblem(): Problem {
  const kind = pick(["proper", "improper", "mixed"] as const);
  const PROPER = "Proper fraction — the numerator is less than the denominator, so it's worth less than one whole";
  const IMPROPER = "Improper fraction — the numerator is greater than or equal to the denominator, so it's worth one whole or more";
  const MIXED = "Mixed number — a whole number written together with a proper fraction";

  if (kind === "proper") {
    const [n, d] = properFraction();
    return {
      title: "Classifying fractions",
      story: "",
      visual: (done: number) => (done >= 2 ? <FractionBar numerator={n} denominator={d} /> : null),
      steps: [
        choice(
          { prompt: <>Is <QA><Frac n={n} d={d} /></QA> a proper fraction, an improper fraction, or a mixed number?</>, hint: `Compare ${n} to ${d} — which is bigger?`, explain: `${n} is less than ${d}, so this is a proper fraction.` },
          PROPER,
          [IMPROPER, MIXED]
        ),
        {
          kind: "number",
          prompt: `How many more 1/${d} parts would make one whole?`,
          hint: `One whole is ${d}/${d}. You have ${n}/${d}.`,
          explain: `${d} − ${n} = ${d - n}. ${n}/${d} + ${d - n}/${d} = ${d}/${d}, one whole.`,
          answer: d - n,
        },
      ],
      wrapUp: <><Frac n={n} d={d} /> is a proper fraction.</>,
    };
  }
  if (kind === "improper") {
    // About 1 in 4 is the boundary case n/n (exactly one whole) — the CFU's
    // true/false trap, carried into Practice.
    const [n, d] = Math.random() < 0.25 ? (() => {
      const dd = randInt(2, 9);
      return [dd, dd] as [number, number];
    })() : improperFraction();
    const wholes = Math.floor(n / d);
    return {
      title: "Classifying fractions",
      story: "",
      visual: (done: number) => (done >= 2 ? <WholePlusPartBar whole={wholes} leftoverNum={n % d} den={d} /> : null),
      steps: [
        choice(
          {
            prompt: <>Is <QA><Frac n={n} d={d} /></QA> a proper fraction, an improper fraction, or a mixed number?</>,
            hint: `Compare ${n} to ${d} — which is bigger, or are they the same?`,
            explain: n === d ? `${n} is equal to ${d}, so this is exactly one whole. That makes it an improper fraction.` : `${n} is greater than ${d}, so this is an improper fraction.`,
          },
          IMPROPER,
          [PROPER, MIXED]
        ),
        {
          kind: "number",
          prompt: <>How many whole bars does <Frac n={n} d={d} /> fill all the way?</>,
          hint: `Each whole bar holds ${d} parts. Count by ${d}s up to ${n} without going over.`,
          explain: n % d === 0 ? `${n} ÷ ${d} = ${wholes}, so it fills ${wholes} whole bar${wholes === 1 ? "" : "s"} exactly.` : `${d} × ${wholes} = ${wholes * d}, and ${n % d} more parts don't fill another bar. So ${wholes} whole bar${wholes === 1 ? "" : "s"}.`,
          answer: wholes,
        },
      ],
      wrapUp: <><Frac n={n} d={d} /> is an improper fraction.</>,
    };
  }
  const { whole, leftover, den } = mixedParts();
  const total = whole * den + leftover;
  return {
    title: "Classifying fractions",
    story: "",
    visual: (done: number) => (done >= 2 ? <WholePlusPartBar whole={whole} leftoverNum={leftover} den={den} /> : null),
    steps: [
      choice(
        {
          prompt: (
            <>
              Is <QA>
                <MathText>
                  {whole} {leftover}/{den}
                </MathText>
              </QA> a proper fraction, an improper fraction, or a mixed number?
            </>
          ),
          hint: "Look at the number. Is there a whole number in front of the fraction?",
          explain: "A whole number written next to a fraction is a mixed number.",
        },
        MIXED,
        [PROPER, IMPROPER]
      ),
      {
        kind: "number",
        prompt: `How many 1/${den} parts make ${whole} ${leftover}/${den}?`,
        hint: `Each whole is ${den} parts. ${whole} × ${den} = ?, then add ${leftover}.`,
        explain: `${whole} × ${den} = ${whole * den}, and ${whole * den} + ${leftover} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: (
      <>
        {whole} {leftover}/{den} is a mixed number.
      </>
    ),
  };
}

// ============================================================================
// PROBLEM TYPE 2 — improper to mixed
// ============================================================================

function improperToMixedProblem(): Problem {
  const [num, den] = improperFraction();
  const whole = Math.floor(num / den);
  const leftover = num % den;

  return {
    title: "Improper to mixed",
    story: <>Write <Frac n={num} d={den} /> as a mixed number.</>,
    visual: (done: number) => (done >= 2 ? <WholePlusPartBar whole={whole} leftoverNum={leftover} den={den} /> : <Frac n={num} d={den} />),
    steps: [
      {
        kind: "number",
        prompt: `How many whole groups of ${den} fit in ${num}?`,
        hint: `Count by ${den}s up to ${num} without going over. How many ${den}s did you count?`,
        explain: `${den} fits into ${num} exactly ${whole} whole times (${den} × ${whole} = ${whole * den}).`,
        answer: whole,
      },
      {
        kind: "number",
        prompt: `What's left over, out of ${num}?`,
        hint: `${num} − (${den} × ${whole}) = ?`,
        explain: `${num} − ${whole * den} = ${leftover}.`,
        answer: leftover,
      },
      choice(
        {
          prompt: (
            <>
              So <Frac n={num} d={den} /> as a mixed number is:
            </>
          ),
          hint: "Whole groups, then the leftover over the same denominator.",
          explain: `${whole} whole groups, with ${leftover}/${den} left over.`,
        },
        `${whole} ${leftover}/${den}`,
        [`${leftover} ${whole}/${den}`, `${whole} ${den}/${leftover}`]
      ),
    ],
    wrapUp: (
      <>
        <Frac n={num} d={den} /> = {whole} {leftover}/{den}.
      </>
    ),
  };
}

// ============================================================================
// PROBLEM TYPE 3 — mixed to improper
// ============================================================================

function mixedToImproperProblem(): Problem {
  const { whole, leftover, den } = mixedParts();
  const num = whole * den + leftover;

  return {
    title: "Mixed to improper",
    story: (
      <>
        Write {whole} {leftover}/{den} as an improper fraction.
      </>
    ),
    visual: (done: number) => (done >= 2 ? <Frac n={num} d={den} /> : <WholePlusPartBar whole={whole} leftoverNum={leftover} den={den} />),
    steps: [
      {
        kind: "number",
        prompt: `Each whole is ${den} parts. How many parts are in just the whole-number part, ${whole}?`,
        hint: `${whole} × ${den} = ?`,
        explain: `${whole} wholes × ${den} parts each = ${whole * den} parts.`,
        answer: whole * den,
      },
      {
        kind: "number",
        prompt: `Add the leftover numerator, ${leftover}. What's the final improper numerator?`,
        hint: `${whole * den} + ${leftover} = ?`,
        explain: `${whole * den} + ${leftover} = ${num}.`,
        answer: num,
      },
    ],
    wrapUp: (
      <>
        {whole} {leftover}/{den} = <Frac n={num} d={den} />.
      </>
    ),
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <WholePlusPartBar whole={2} leftoverNum={1} den={3} />;
}

export const fractionForms: Unit = {
  id: "fractionForms",
  title: "What Is a Fraction and Its Forms",
  goal: "Recognize proper fractions, improper fractions, and mixed numbers, and convert between improper fractions and mixed numbers.",
  standard: "4.NF.3",
  keyIdea: (
    <>
      <p>A proper fraction is worth less than one whole (numerator &lt; denominator); an improper fraction is worth one whole or more (numerator ≥ denominator).</p>
      <p>A mixed number writes the same value as a whole number plus a proper fraction — 7/3 and 2 1/3 are the same number.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [
    { label: "Classify the form", make: classifyProblem },
    { label: "Improper → mixed", make: improperToMixedProblem },
    { label: "Mixed → improper", make: mixedToImproperProblem },
  ],
  test: fractionFormsTest,
};
