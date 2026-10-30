import { useEffect, useState, type CSSProperties } from "react";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { identifyingEquivalentExpressionsTest } from "./IdentifyingEquivalentExpressionsTest";
import { answerBorder } from "../../../shared/lib/answerChecks";

interface LinearExpr {
  coeffX: number;
  constant: number;
  display: string;
}

/** The ONE evaluation function every diagram, CFU question, and Practice
 *  step in this unit reads from — so a prompt's own stated value and its
 *  graded answer can never silently disagree. */
const evaluateLinear = (e: LinearExpr, x: number): number => e.coeffX * x + e.constant;

const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** A small side-by-side table of two expressions' values at the given
 *  x-values — the shared "verify with substitution" visual used by Explore,
 *  CFU, and Practice alike. */
function EvalTable({ exprA, exprB, xValues }: { exprA: LinearExpr; exprB: LinearExpr; xValues: number[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", fontSize: 15 }}>
        <thead>
          <tr>
            <th style={{ padding: "4px 12px", textAlign: "left" }}>x</th>
            <th style={{ padding: "4px 12px", textAlign: "left", color: "var(--qa-text)" }}>{exprA.display}</th>
            <th style={{ padding: "4px 12px", textAlign: "left", color: "var(--qb-text)" }}>{exprB.display}</th>
          </tr>
        </thead>
        <tbody>
          {xValues.map((x) => {
            const vA = evaluateLinear(exprA, x);
            const vB = evaluateLinear(exprB, x);
            return (
              <tr key={x}>
                <td style={{ padding: "4px 12px", fontWeight: 700 }}>{x}</td>
                <td style={{ padding: "4px 12px" }}>{vA}</td>
                <td style={{ padding: "4px 12px", color: vA === vB ? "var(--good)" : "var(--bad)" }}>{vB}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1: vocabulary — what "equivalent" means. */
function EquivalentVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "same value for every value of the variable";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What does it mean for two expressions to be "equivalent"?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="same value for every value of the variable">they have the same value for EVERY value of the variable</option>
          <option value="they look similar">they look similar</option>
          <option value="same value for one value">they have the same value for one value of the variable</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — equivalent expressions must match for EVERY possible value of the variable, not just one, and not just by looking alike."
            : "Not quite — looking similar, or matching at just one value, isn't enough. Equivalent means equal for every value of the variable."}
        </p>
      )}
    </div>
  );
}

/** Q2: the classic look-alike trap, verified with real substitution. */
function LookalikeTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const exprA: LinearExpr = { coeffX: 2, constant: 6, display: "2(x+3)" };
  const exprB: LinearExpr = { coeffX: 2, constant: 3, display: "2x+3" };
  const [vAPick, setVAPick] = useState("");
  const [vBPick, setVBPick] = useState("");
  const [equivPick, setEquivPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [vAPick, vBPick, equivPick].every((v) => String(v).trim() !== "");
  const vAOk = Number(vAPick) === evaluateLinear(exprA, 5);
  const vBOk = Number(vBPick) === evaluateLinear(exprB, 5);
  const equivOk = equivPick === "No";
  const ok = vAOk && vBOk && equivOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Is 2(x+3) equivalent to 2x+3? Check by substituting x = 5 into both.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          2(x+3) at x=5:{" "}
          <input className="answer" style={{ width: 55, ...answerBorder(vAOk, checked) }} inputMode="numeric" value={vAPick} onChange={(e) => setVAPick(e.target.value)} />
        </label>
        <label>
          2x+3 at x=5:{" "}
          <input className="answer" style={{ width: 55, ...answerBorder(vBOk, checked) }} inputMode="numeric" value={vBPick} onChange={(e) => setVBPick(e.target.value)} />
        </label>
      </div>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Equivalent?{" "}
          <select className="answer" value={equivPick} onChange={(e) => setEquivPick(e.target.value)} style={fieldStyle(equivOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? `Correct — 2(x+3) at x=5 is ${evaluateLinear(exprA, 5)}, but 2x+3 at x=5 is only ${evaluateLinear(exprB, 5)}. Different values, so they're NOT equivalent — 2x+3 forgot to distribute the 2 to the 3.`
            : `Not quite — compute each expression carefully at x=5, then compare. 2(x+3) means 2 times the WHOLE sum (x+3).`}
        </p>
      )}
    </div>
  );
}

/** Q3: generalization/true-false trap — checking one value isn't proof. */
function CheckOneValueTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "False";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: if two expressions give the same value when x = 2, that proves they're equivalent for every x.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — False. For example, 3x+5 and 5x+3 both equal 8 when x=1, but they're NOT equivalent — try x=2: 3(2)+5=11, while 5(2)+3=13. Matching at one value can be coincidence."
            : "Not quite — try 3x+5 and 5x+3 at x=1: both equal 8! But at x=2 they disagree. Matching at ONE value doesn't prove they're always equal."}
        </p>
      )}
    </div>
  );
}

/** Q4: the right strategy — substitute a couple of DIFFERENT values. */
function VerificationStrategyQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "substituteFewValues";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> To check whether two expressions are equivalent, what's a good strategy?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="substituteFewValues">substitute a couple of different x-values into both and compare</option>
          <option value="justCheckX">just check that both use the same variable</option>
          <option value="assumeAlike">assume they're equivalent if they look alike</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — substituting a couple of different values is a quick, reliable check. One match could be coincidence, but if even one value disagrees, they're definitely not equivalent."
            : "Not quite — looking alike or sharing a variable doesn't prove anything. Substitute a couple of different values and compare the results."}
        </p>
      )}
    </div>
  );
}

function IdentifyingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, lookalike: false, oneValueTrap: false, strategy: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's connect a few ideas before you try practice problems.</p>
      <EquivalentVocabQuestion onComplete={mark("vocab")} />
      <LookalikeTrapQuestion onComplete={mark("lookalike")} />
      <CheckOneValueTrapQuestion onComplete={mark("oneValueTrap")} />
      <VerificationStrategyQuestion onComplete={mark("strategy")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const exprA: LinearExpr = { coeffX: a, constant: a * b, display: `${a}(x+${b})` };
  const exprB: LinearExpr = { coeffX: a, constant: a * b, display: `${a}x+${a * b}` };
  const exprCLookalike: LinearExpr = { coeffX: a, constant: b, display: `${a}x+${b}` };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="a" value={a} min={2} max={6} step={1} onChange={setA} tone="a" />
        <Stepper label="b" value={b} min={1} max={9} step={1} onChange={setB} tone="b" />
        {!introActive && (
          <button
            type="button"
            className="btn ghost"
            style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined}
            onClick={() => setShowCheck((v) => !v)}
          >
            Check for Understanding
          </button>
        )}
      </div>
      {(introActive || showCheck) && <IdentifyingCheckForUnderstanding onComplete={onIntroDone} />}
      <p className="muted small">
        {exprA.display} and {exprB.display} ARE equivalent — distributing {a} correctly keeps every value the same:
      </p>
      <EvalTable exprA={exprA} exprB={exprB} xValues={[1, 2, 3, 4]} />
      <p className="muted small">
        But {exprA.display} and {exprCLookalike.display} are NOT equivalent — {exprCLookalike.display} forgot to multiply the {b} by {a}:
      </p>
      <EvalTable exprA={exprA} exprB={exprCLookalike} xValues={[1, 2, 3, 4]} />
      <p className="muted small">
        Change a and b above — the first table always stays equal at every row, but the second table disagrees as soon as x changes, since the
        two expressions are genuinely different.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — identifying equivalent expressions
// ============================================================================

type Bucket = "equiv-distributive" | "equiv-combine" | "nonequiv-lookalike" | "nonequiv-one-value-trap" | "verify-two-values";
const BUCKETS: Bucket[] = ["equiv-distributive", "equiv-combine", "nonequiv-lookalike", "nonequiv-one-value-trap", "verify-two-values"];

function equivalenceProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "equiv-distributive") {
    const a = randInt(2, 6);
    const b = randInt(2, 9);
    const exprA: LinearExpr = { coeffX: a, constant: a * b, display: `${a}(x+${b})` };
    const exprB: LinearExpr = { coeffX: a, constant: a * b, display: `${a}x+${a * b}` };
    const x = randInt(2, 8);
    return {
      title: "Checking equivalence — distributive property",
      bucket,
      story: `Are ${exprA.display} and ${exprB.display} equivalent?`,
      visual: (done: number) => <EvalTable exprA={exprA} exprB={exprB} xValues={done >= 2 ? [x] : []} />,
      steps: [
        { kind: "number", prompt: `What is ${exprA.display} when x = ${x}?`, hint: `Multiply ${a} by (${x}+${b}) first.`, explain: `${exprA.display} at x=${x} is ${evaluateLinear(exprA, x)}.`, answer: evaluateLinear(exprA, x) },
        { kind: "number", prompt: `What is ${exprB.display} when x = ${x}?`, hint: `Substitute x=${x} directly.`, explain: `${exprB.display} at x=${x} is ${evaluateLinear(exprB, x)}.`, answer: evaluateLinear(exprB, x) },
        choice(
          { prompt: "Are these two expressions equivalent?", hint: "Does distributing correctly ever change the value, for any x?", explain: "Yes — distributing the GCF correctly always produces an equivalent expression, for every x." },
          "Yes, equivalent",
          ["No, not equivalent"]
        ),
      ],
      wrapUp: `${exprA.display} = ${exprB.display} for every x — they're equivalent.`,
    };
  }

  if (bucket === "equiv-combine") {
    const a = randInt(2, 6);
    const c = randInt(2, 6);
    const exprA: LinearExpr = { coeffX: a + c, constant: 0, display: `${a}x+${c}x` };
    const exprB: LinearExpr = { coeffX: a + c, constant: 0, display: `${a + c}x` };
    const x = randInt(2, 8);
    return {
      title: "Checking equivalence — combining like terms",
      bucket,
      story: `Are ${exprA.display} and ${exprB.display} equivalent?`,
      visual: (done: number) => <EvalTable exprA={exprA} exprB={exprB} xValues={done >= 2 ? [x] : []} />,
      steps: [
        { kind: "number", prompt: `What is ${exprA.display} when x = ${x}?`, hint: `Add ${a}(${x}) + ${c}(${x}).`, explain: `${exprA.display} at x=${x} is ${evaluateLinear(exprA, x)}.`, answer: evaluateLinear(exprA, x) },
        { kind: "number", prompt: `What is ${exprB.display} when x = ${x}?`, hint: `Multiply ${a + c} by ${x}.`, explain: `${exprB.display} at x=${x} is ${evaluateLinear(exprB, x)}.`, answer: evaluateLinear(exprB, x) },
        choice(
          { prompt: "Are these two expressions equivalent?", hint: "Does combining like terms correctly ever change the value, for any x?", explain: "Yes — combining like terms correctly always produces an equivalent expression." },
          "Yes, equivalent",
          ["No, not equivalent"]
        ),
      ],
      wrapUp: `${exprA.display} = ${exprB.display} for every x — they're equivalent.`,
    };
  }

  if (bucket === "nonequiv-lookalike") {
    const a = randInt(2, 6);
    const b = randInt(2, 9);
    const exprA: LinearExpr = { coeffX: a, constant: a * b, display: `${a}(x+${b})` };
    const exprB: LinearExpr = { coeffX: a, constant: b, display: `${a}x+${b}` };
    return {
      title: "Checking equivalence — a look-alike trap",
      bucket,
      story: `Are ${exprA.display} and ${exprB.display} equivalent?`,
      visual: (done: number) => <EvalTable exprA={exprA} exprB={exprB} xValues={done >= 2 ? [0] : []} />,
      steps: [
        { kind: "number", prompt: `What is ${exprA.display} when x = 0?`, hint: `${a} × (0+${b}).`, explain: `${exprA.display} at x=0 is ${evaluateLinear(exprA, 0)}.`, answer: evaluateLinear(exprA, 0) },
        { kind: "number", prompt: `What is ${exprB.display} when x = 0?`, hint: `${a}(0) + ${b}.`, explain: `${exprB.display} at x=0 is ${evaluateLinear(exprB, 0)}.`, answer: evaluateLinear(exprB, 0) },
        choice(
          { prompt: "Are these two expressions equivalent?", hint: "Compare the two values you just found.", explain: `No — ${exprB.display} forgot to multiply the ${b} by ${a}, so it's missing part of the distribution.` },
          "No, not equivalent",
          ["Yes, equivalent"]
        ),
      ],
      wrapUp: `${exprA.display} and ${exprB.display} disagree at x=0 — they are NOT equivalent.`,
    };
  }

  if (bucket === "nonequiv-one-value-trap") {
    const a = randInt(2, 9);
    let b = randInt(2, 9);
    while (b === a) b = randInt(2, 9);
    const exprA: LinearExpr = { coeffX: a, constant: b, display: `${a}x+${b}` };
    const exprB: LinearExpr = { coeffX: b, constant: a, display: `${b}x+${a}` };
    return {
      title: "Checking equivalence — a coincidence at one value",
      bucket,
      story: `At x=1, ${exprA.display} and ${exprB.display} both equal ${evaluateLinear(exprA, 1)} — but does that mean they're equivalent for every x?`,
      visual: (done: number) => <EvalTable exprA={exprA} exprB={exprB} xValues={done >= 2 ? [1, 2] : [1]} />,
      steps: [
        { kind: "number", prompt: `Try a second value: what is ${exprA.display} when x = 2?`, hint: `${a}(2)+${b}.`, explain: `${exprA.display} at x=2 is ${evaluateLinear(exprA, 2)}.`, answer: evaluateLinear(exprA, 2) },
        { kind: "number", prompt: `What is ${exprB.display} when x = 2?`, hint: `${b}(2)+${a}.`, explain: `${exprB.display} at x=2 is ${evaluateLinear(exprB, 2)}.`, answer: evaluateLinear(exprB, 2) },
        choice(
          { prompt: "Are these two expressions equivalent for every x?", hint: "They matched at x=1 — did they also match at x=2?", explain: `No — they only matched at x=1 by coincidence (that's where ax+b = bx+a always happens when a≠b). At x=2 they disagree.` },
          "No, not equivalent",
          ["Yes, equivalent"]
        ),
      ],
      wrapUp: `${exprA.display} and ${exprB.display} matched only at x=1 — checking a second value (x=2) proves they're NOT equivalent.`,
    };
  }

  // verify-two-values
  const equivalent = Math.random() < 0.5;
  let exprA: LinearExpr;
  let exprB: LinearExpr;
  if (equivalent) {
    const a = randInt(2, 6);
    const c = randInt(2, 6);
    exprA = { coeffX: a + c, constant: 0, display: `${a}x+${c}x` };
    exprB = { coeffX: a + c, constant: 0, display: `${a + c}x` };
  } else {
    const a = randInt(2, 6);
    const b = randInt(2, 9);
    exprA = { coeffX: a, constant: a * b, display: `${a}(x+${b})` };
    exprB = { coeffX: a, constant: b, display: `${a}x+${b}` };
  }
  const x1 = 1;
  const x2 = 3;
  const vA1 = evaluateLinear(exprA, x1);
  const vA2 = evaluateLinear(exprA, x2);
  return {
    title: "Verifying equivalence with two values",
    bucket,
    story: `Are ${exprA.display} and ${exprB.display} equivalent? ${exprA.display} is already evaluated for you below — find ${exprB.display}'s value at each x and compare.`,
    visual: (done: number) => <EvalTable exprA={exprA} exprB={exprB} xValues={done >= 2 ? [x1, x2] : [x1]} />,
    steps: [
      { kind: "number", prompt: `What is ${exprB.display} when x = ${x1}? (Compare to ${exprA.display} = ${vA1}.)`, hint: "Substitute and compute.", explain: `${exprB.display} at x=${x1} is ${evaluateLinear(exprB, x1)}.`, answer: evaluateLinear(exprB, x1) },
      { kind: "number", prompt: `What is ${exprB.display} when x = ${x2}? (Compare to ${exprA.display} = ${vA2}.)`, hint: "Substitute and compute.", explain: `${exprB.display} at x=${x2} is ${evaluateLinear(exprB, x2)}.`, answer: evaluateLinear(exprB, x2) },
      choice(
        {
          prompt: "Based on both checks, are these two expressions equivalent?",
          hint: "One match could be coincidence — do BOTH checks agree?",
          explain: equivalent ? "Yes — both checks agree, consistent with these being truly equivalent." : "No — the two checks disagree at at least one value, so they are NOT equivalent.",
        },
        equivalent ? "Yes, equivalent" : "No, not equivalent",
        [equivalent ? "No, not equivalent" : "Yes, equivalent"]
      ),
    ],
    wrapUp: equivalent ? `${exprA.display} = ${exprB.display} for every x checked — equivalent.` : `${exprA.display} and ${exprB.display} disagree at x=${x2} — not equivalent.`,
  };
}

export const identifyingEquivalentExpressions: Unit = {
  id: "identifyingEquivalentExpressions",
  title: "Identifying Equivalent Expressions",
  goal: "Determine whether two expressions are equivalent by reasoning about structure, not just by plugging in one convenient number.",
  standard: "6.EE.4",
  keyIdea: (
    <>
      <p>Equivalent expressions give the SAME value for every value of the variable — not just one that happens to match.</p>
      <p>Checking one value can be misleading (two different expressions can coincidentally agree at a single x) — check at least two different values before concluding they're equivalent.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Equivalent Expressions", make: equivalenceProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: identifyingEquivalentExpressionsTest,
};
