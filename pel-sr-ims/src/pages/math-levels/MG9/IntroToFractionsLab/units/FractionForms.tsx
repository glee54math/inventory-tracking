import { useState } from "react";
import { FractionBar, FractionCircle, FractionNumberLine, WholePlusPartBar, WholePlusPartCircles } from "../diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Frac, QA, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { fractionFormsTest } from "./FractionFormsTest";

/** A proper fraction: numerator < denominator. */
function properFraction(): [number, number] {
  const d = randInt(2, 9);
  const n = randInt(1, d - 1);
  return [n, d];
}

/** An improper fraction: numerator > denominator, so it's worth at least one whole. */
function improperFraction(): [number, number] {
  const d = randInt(2, 8);
  const n = randInt(d + 1, d * 4);
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
// EXPLORE
// ============================================================================

/**
 * The one gated unit in this module (Unit.requiresIntro — see export below):
 * before Practice unlocks, the student converts one generated improper
 * fraction into its whole + leftover parts themselves, watching both the
 * decomposed-bar picture and the number line update live as they adjust two
 * Steppers — concrete manipulation first (IES recommendation #1), with the
 * number line making the point that the fraction and the mixed number are
 * the exact same NUMBER, just two ways of naming it (IES recommendation #2).
 * One-time gate only (no reintroEverySolved) — this is vocabulary/concept
 * building, not a procedural fact that decays over time.
 */
function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
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
  // page is the whole point (same reasoning as the gated whole/leftover task
  // below, just lower-stakes — no Check button, immediate inline feedback).
  const [formGuess, setFormGuess] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Fixed, non-randomized anchor pictures — the pizza-slice model most
          students already have an informal sense of (IES recommendation #1:
          build on that before the abstract rule). Two examples: an ordinary
          proper fraction, and the improper/mixed pair the rest of this unit
          is about — shown as ONE picture read two ways, same idea
          WholePlusPartBar/WholePlusPartCircles both lean on throughout this
          unit, just with the more familiar circle instead of a bar first. */}
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
        . Its numerator is bigger than its denominator, so it's worth more than one whole. Every improper fraction can also be written as a{" "}
        <b>mixed number</b>: a whole number plus a proper fraction.
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
      {introActive && (
        <div className="align-drill">
          <p className="intro-gate-title">
            Convert <Frac n={num} d={den} /> into a mixed number: how many whole groups of {den}, and what's left over?
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
                : `Not quite — ${den} goes into ${num} some whole number of times, with a bit left over. Try again.`}
            </p>
          )}
          {checked && ok && onIntroDone && (
            <button className="btn primary" onClick={onIntroDone}>
              Continue
            </button>
          )}
        </div>
      )}
      {!introActive && <WholePlusPartBar whole={correctWhole} leftoverNum={correctLeftover} den={den} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — classify the form
// ============================================================================

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
      visual: () => <FractionBar numerator={n} denominator={d} />,
      steps: [
        choice(
          { prompt: <>Is <QA><Frac n={n} d={d} /></QA> a proper fraction, an improper fraction, or a mixed number?</>, hint: `Compare ${n} to ${d} — which is bigger?`, explain: `${n} is less than ${d}, so this is a proper fraction.` },
          PROPER,
          [IMPROPER, MIXED]
        ),
      ],
      wrapUp: <><Frac n={n} d={d} /> is a proper fraction.</>,
    };
  }
  if (kind === "improper") {
    const [n, d] = improperFraction();
    return {
      title: "Classifying fractions",
      story: "",
      visual: () => <FractionBar numerator={d} denominator={d} label={`${n}/${d} needs more than one bar`} />,
      steps: [
        choice(
          { prompt: <>Is <QA><Frac n={n} d={d} /></QA> a proper fraction, an improper fraction, or a mixed number?</>, hint: `Compare ${n} to ${d} — which is bigger?`, explain: `${n} is greater than ${d}, so this is an improper fraction.` },
          IMPROPER,
          [PROPER, MIXED]
        ),
      ],
      wrapUp: <><Frac n={n} d={d} /> is an improper fraction.</>,
    };
  }
  const { whole, leftover, den } = mixedParts();
  return {
    title: "Classifying fractions",
    story: "",
    visual: () => <WholePlusPartBar whole={whole} leftoverNum={leftover} den={den} />,
    steps: [
      choice(
        {
          prompt: (
            <>
              Is <QA>{whole} {leftover}/{den}</QA> a proper fraction, an improper fraction, or a mixed number?
            </>
          ),
          hint: "It's written as a whole number together with a fraction.",
          explain: "A whole number written next to a fraction is a mixed number.",
        },
        MIXED,
        [PROPER, IMPROPER]
      ),
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
        hint: `${den} × what is the biggest multiple of ${den} that's still ≤ ${num}?`,
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
        [`${leftover} ${whole}/${den}`, `${whole} ${den}/${leftover || 1}`]
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
