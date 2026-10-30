import { useEffect, useState } from "react";
import { FractionBar, NumberLine } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { fractionsEqualToWholeNumbersTest } from "./FractionsEqualToWholeNumbersTest";

// Own local copy of the lab-wide denominator set — see
// FractionsOnANumberLine.tsx's comment on why every unit file keeps its own.
const DENOMS = [2, 3, 4, 6, 8] as const;

/** `whole` full bars, side by side — the literal picture behind "a fraction
 *  can BE a whole number": `whole * den` shaded parts, counted across
 *  `whole` completely-shaded bars of denominator `den`, is the same amount
 *  as the plain whole number `whole`. */
function WholeBars({ whole, den }: { whole: number; den: number }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {Array.from({ length: whole }, (_, i) => (
        <FractionBar key={i} numerator={den} denominator={den} width={90} />
      ))}
    </div>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * Four fixed questions, all directly targeting this unit's named
 * misconception: assuming numerator ≥ denominator automatically means "equals
 * a whole number" (it only does when the numerator is an exact MULTIPLE of
 * the denominator). Q1 is the vocabulary/rule question; Q2 is the trap case
 * itself (5/4); Q3 is the reverse/production direction (write a whole number
 * AS a fraction, reusing the Stepper+Check pattern MG9_IntroToFractionsLab's
 * own gated Explore drill uses); Q4 is the explicit true/false generalization
 * trap.
 */
function WholeNumberFractionsCheck({ onComplete }: { onComplete?: () => void }) {
  const [q1, setQ1] = useState("");
  const [q1Checked, setQ1Checked] = useState(false);
  const q1Done = q1Checked && q1 === "multiple";

  const [q2, setQ2] = useState<string | null>(null);
  const q2Done = q2 === "no";

  const [numerator, setNumerator] = useState(0);
  const [q3Checked, setQ3Checked] = useState(false);
  const q3Done = q3Checked && numerator === 8;

  const [q4, setQ4] = useState<string | null>(null);
  const q4Done = q4 === "false";

  const allDone = q1Done && q2Done && q3Done && q4Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure you can spot a whole number hiding in a fraction before you try practice problems.</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> A fraction equals a whole number exactly when the numerator is{" "}
          <select className="answer" value={q1} onChange={(e) => setQ1(e.target.value)} aria-label="When a fraction equals a whole number" disabled={q1Done}>
            <option value="" disabled>
              choose
            </option>
            <option value="multiple">a multiple of the denominator</option>
            <option value="bigger">bigger than the denominator</option>
            <option value="smaller">smaller than the denominator</option>
          </select>{" "}
          of the denominator.
          <button className="btn primary" type="button" style={{ marginLeft: 10 }} disabled={q1Done} onClick={() => setQ1Checked(true)}>
            Check Answer
          </button>
        </p>
        {q1Checked && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done
              ? "Correct — the denominator has to divide evenly into the numerator, with nothing left over."
              : "Not quite — \"bigger than\" alone isn't enough. Think about 5/4: 5 is bigger than 4, but 4 doesn't divide evenly into 5. Try again."}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> Is 5/4 equal to a whole number?
        </p>
        <div className="control-row">
          {[
            { id: "no", label: "No — 4 doesn't divide evenly into 5" },
            { id: "yes", label: "Yes — the numerator is bigger than the denominator" },
          ].map((opt) => (
            <button key={opt.id} type="button" className={`btn ghost ${q2 === opt.id ? "pressed" : ""}`} disabled={q2Done} onClick={() => setQ2(opt.id)}>
              {opt.label}
            </button>
          ))}
        </div>
        {q2 && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done
              ? "Correct — 5/4 is 1 whole plus 1/4 left over. Since there's a leftover, it's NOT a whole number."
              : "Not quite — a bigger numerator isn't enough by itself. Does 4 divide evenly into 5, with nothing left over?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> Use the stepper to find the numerator of a fraction with denominator 4 that equals the whole number 2.
        </p>
        <div className="control-row">
          <Stepper label="Numerator" value={numerator} min={0} max={16} onChange={(v) => { setNumerator(v); setQ3Checked(false); }} tone="b" />
        </div>
        <WholeBars whole={Math.floor(numerator / 4)} den={4} />
        <button className="btn primary" type="button" disabled={q3Done} onClick={() => setQ3Checked(true)}>
          Check my work
        </button>
        {q3Checked && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done ? "Correct — 8/4 = 2, since 4 goes into 8 exactly 2 times." : "Not quite — how many groups of 4 make 2 wholes? Try a different numerator."}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>4.</b> True or False: Any fraction where the numerator is bigger than the denominator equals a whole number.
        </p>
        <div className="control-row">
          {[
            { id: "false", label: "False" },
            { id: "true", label: "True" },
          ].map((opt) => (
            <button key={opt.id} type="button" className={`btn ghost ${q4 === opt.id ? "pressed" : ""}`} disabled={q4Done} onClick={() => setQ4(opt.id)}>
              {opt.label}
            </button>
          ))}
        </div>
        {q4 && (
          <p className={`feedback ${q4Done ? "good" : "bad"}`} role="alert">
            {q4Done
              ? "Correct — think of 5/4 or 7/8: numerator bigger than denominator, but NOT a whole number, because there's a leftover."
              : "Not quite — remember 5/4 from question 2. Is it always true?"}
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
  const [whole, setWhole] = useState(1);
  const numerator = whole * den;

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
      {(introActive || showCheck) && <WholeNumberFractionsCheck onComplete={onIntroDone} />}
      <p>
        Some fractions are secretly whole numbers in disguise — when the numerator is an exact multiple of the denominator, every part gets used up
        in complete wholes, with nothing left over.
      </p>
      <Segmented label="Denominator" value={String(den)} onChange={(v) => setDen(Number(v))} options={DENOMS.map((d) => ({ id: String(d), label: String(d) }))} />
      <div className="control-row">
        <Stepper label="Whole number" value={whole} min={1} max={3} onChange={setWhole} tone="a" />
      </div>
      <WholeBars whole={whole} den={den} />
      <NumberLine min={0} max={4} minorTicksPerUnit={den} points={[{ value: whole, label: `${numerator}/${den}`, tone: "a" }]} />
      <p className="muted small">
        {numerator}/{den} = {whole} — every one of the {whole} whole{whole === 1 ? "" : "s"} is fully shaded, nothing left over.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — a/b = 1 (numerator equals denominator)
// ============================================================================

function selfEqualProblem(): Problem {
  const d = DENOMS[randInt(0, DENOMS.length - 1)];
  return {
    title: "A fraction equal to 1 whole",
    bucket: "selfequal",
    story: "",
    visual: () => <FractionBar numerator={d} denominator={d} />,
    steps: [
      {
        kind: "number",
        prompt: "How many of the equal parts are shaded?",
        hint: "Count the colored parts.",
        explain: `All ${d} of them — so this is ${d}/${d}.`,
        answer: d,
      },
      {
        kind: "number",
        prompt: `Every one of the ${d} equal parts is shaded. What whole number does ${d}/${d} equal?`,
        hint: "A fully-shaded bar is one complete whole.",
        explain: `${d}/${d} = 1 — all ${d} parts together make exactly one whole.`,
        answer: 1,
      },
    ],
    wrapUp: `${d}/${d} = 1.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — a/b equal to a whole number greater than 1
// ============================================================================

function wholeMultipleProblem(): Problem {
  const d = DENOMS[randInt(0, DENOMS.length - 1)];
  const whole = randInt(2, 3);
  const numerator = whole * d;
  return {
    title: "A fraction equal to a bigger whole number",
    bucket: "wholemultiple",
    story: "",
    visual: () => <WholeBars whole={whole} den={d} />,
    steps: [
      {
        kind: "number",
        prompt: `Each bar has ${d} equal parts. How many parts are shaded in ALL the bars together?`,
        hint: `Count every shaded part, or add ${d} for each bar.`,
        explain: `${whole} bars × ${d} parts = ${numerator} parts, so this is ${numerator}/${d}.`,
        answer: numerator,
      },
      {
        kind: "number",
        prompt: `${whole} completely-shaded bars of ${d} equal parts each. What whole number does ${numerator}/${d} equal?`,
        hint: `How many groups of ${d} fit in ${numerator}?`,
        explain: `${d} divides evenly into ${numerator} exactly ${whole} times, so ${numerator}/${d} = ${whole}.`,
        answer: whole,
      },
    ],
    wrapUp: `${numerator}/${d} = ${whole}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — write a whole number as a fraction (reverse direction)
// ============================================================================

function writeWholeProblem(): Problem {
  const d = DENOMS[randInt(0, DENOMS.length - 1)];
  const whole = randInt(1, 3);
  const numerator = whole * d;
  return {
    title: "Writing a whole number as a fraction",
    bucket: "writewhole",
    story: `Write the whole number ${whole} as a fraction with denominator ${d}.`,
    visual: (done: number) => (done >= 1 ? <WholeBars whole={whole} den={d} /> : <p className="muted small">{whole} whole{whole === 1 ? "" : "s"}, denominator {d}</p>),
    steps: [
      {
        kind: "number",
        prompt: `What's the numerator, so that numerator/${d} = ${whole}?`,
        hint: `${whole} groups of ${d} is how many parts in all?`,
        explain: `${whole} × ${d} = ${numerator}, so ${whole} = ${numerator}/${d}.`,
        answer: numerator,
      },
      choice(
        {
          prompt: `So which fraction is the same as the whole number ${whole}?`,
          hint: `The numerator is the total parts; the denominator stays ${d}.`,
          explain: `${whole} = ${numerator}/${d}.`,
        },
        `${numerator}/${d}`,
        // Writing the whole number itself on top; one whole too many.
        [`${whole}/${d}`, `${numerator + d}/${d}`]
      ),
    ],
    wrapUp: `${whole} = ${numerator}/${d}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — non-example / trap: close to, but not, a whole number
// ============================================================================

function notWholeTrapProblem(): Problem {
  const d = DENOMS[randInt(0, DENOMS.length - 1)];
  const leftover = randInt(1, d - 1);
  const numerator = d + leftover;
  return {
    title: "Is this a whole number?",
    bucket: "trap-notwhole",
    story: "",
    visual: () => <NumberLine min={0} max={2} minorTicksPerUnit={d} points={[{ value: numerator / d, tone: "a" }]} />,
    steps: [
      {
        kind: "number",
        prompt: `How many full wholes of ${d} parts fit in ${numerator} parts?`,
        hint: `How many groups of ${d} can you make from ${numerator}?`,
        explain: `1 full whole of ${d} parts.`,
        answer: 1,
      },
      {
        kind: "number",
        prompt: "How many parts are left over after that?",
        hint: `${numerator} − ${d} = ?`,
        explain: `${numerator} − ${d} = ${leftover} left over.`,
        answer: leftover,
      },
      choice(
        {
          prompt: `Is ${numerator}/${d} equal to a whole number?`,
          hint: `Does ${d} divide evenly into ${numerator}, with nothing left over?`,
          explain: `${d} goes into ${numerator} one whole time, with ${leftover} left over — since there's a leftover, ${numerator}/${d} is NOT a whole number.`,
        },
        "No",
        ["Yes"]
      ),
    ],
    wrapUp: `${numerator}/${d} is not a whole number — it's 1 whole plus ${leftover}/${d} left over.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <WholeBars whole={2} den={3} />;
}

export const fractionsEqualToWholeNumbers: Unit = {
  id: "fractionsEqualToWholeNumbers",
  title: "Fractions Equal to Whole Numbers",
  goal: "Recognize when a fraction is actually the same amount as a whole number (like 4/4 = 1, or 6/3 = 2), and write whole numbers as fractions.",
  standard: "3.NF.3c",
  keyIdea: (
    <>
      <p>A fraction equals a whole number exactly when the numerator is a multiple of the denominator — every part fits into complete wholes, nothing left over.</p>
      <p>A numerator bigger than the denominator ISN'T automatically a whole number — 5/4 is bigger than 1 whole, but not equal to one.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["selfequal", "wholemultiple", "writewhole", "trap-notwhole"],
  problems: [
    { label: "Equal to 1", make: selfEqualProblem, buckets: ["selfequal"] },
    { label: "Equal to a bigger whole", make: wholeMultipleProblem, buckets: ["wholemultiple"] },
    { label: "Write a whole number", make: writeWholeProblem, buckets: ["writewhole"] },
    { label: "Is it a whole number?", make: notWholeTrapProblem, buckets: ["trap-notwhole"] },
  ],
  test: fractionsEqualToWholeNumbersTest,
};
