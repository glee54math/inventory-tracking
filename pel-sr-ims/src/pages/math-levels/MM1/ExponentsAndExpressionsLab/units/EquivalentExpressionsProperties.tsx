import { useEffect, useState, type CSSProperties } from "react";
import { FactorRectangle } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { equivalentExpressionsPropertiesTest } from "./EquivalentExpressionsPropertiesTest";
import { toSuperscript } from "./formatExponent";

const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1: vocabulary — "like terms". */
function LikeTermsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "3x and 5x";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Look at 3x, 3y, 5x, and 7. Which pair are "like terms"?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="3x and 5x">3x and 5x</option>
          <option value="3x and 3y">3x and 3y</option>
          <option value="3y and 7">3y and 7</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — like terms have the exact same variable (both x), so their coefficients can be combined: 3x and 5x. 3x and 3y have DIFFERENT variables, so they can't be combined even though the coefficients match."
            : "Not quite — like terms need the SAME variable, not the same coefficient. Which two both have an x?"}
        </p>
      )}
    </div>
  );
}

/** Q2: distribute (expand) vs. factor (contract) direction, and the vocabulary for each. */
function ExpandVsFactorQuestion({ onComplete }: { onComplete?: () => void }) {
  const [samePick, setSamePick] = useState("");
  const [formPick, setFormPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [samePick, formPick].every((v) => String(v).trim() !== "");
  const sameOk = samePick === "4x+12";
  const formOk = formPick === "factored form";
  const ok = sameOk && formOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Look at 4(x+3).
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          The same expression, written another way:{" "}
          <select className="answer" value={samePick} onChange={(e) => setSamePick(e.target.value)} style={fieldStyle(sameOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4x+12">4x + 12</option>
            <option value="4x+3">4x + 3</option>
          </select>
        </label>
        <label>
          4(x+3) itself is already in:{" "}
          <select className="answer" value={formPick} onChange={(e) => setFormPick(e.target.value)} style={fieldStyle(formOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="factored form">factored form</option>
            <option value="expanded form">expanded form</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — distributing the 4 to BOTH terms gives 4x + 12, not 4x + 3 (that forgets to multiply the 3 by 4). And 4(x+3) is already factored form — a product of two factors."
            : "Not quite — the 4 has to multiply EVERY term inside the parentheses, including the 3. And 4(x+3) is written as a product already, which is what 'factored form' means."}
        </p>
      )}
    </div>
  );
}

/** Q3: generalization/true-false trap — y+y+y is NOT y³. */
function RepeatedAddVsMultiplyTrap({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "False";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: y + y + y always equals y³.
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
            ? "Correct — False. y + y + y is repeated ADDITION, which equals 3y. y³ is repeated MULTIPLICATION (y × y × y), a completely different operation. They're only equal for y = 0 or y = 3 by coincidence, not in general."
            : "Not quite — try y = 2. y + y + y = 6, but y³ = 8. Adding y to itself 3 times (3y) is not the same as multiplying y by itself 3 times (y³)."}
        </p>
      )}
    </div>
  );
}

/** Q4: factoring out the GCF, multi-part. */
function FactorGCFQuestion({ onComplete }: { onComplete?: () => void }) {
  const [gcfPick, setGcfPick] = useState("");
  const [formPick, setFormPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [gcfPick, formPick].every((v) => String(v).trim() !== "");
  const gcfOk = gcfPick === "4";
  const formOk = formPick === "4(3x+2)";
  const ok = gcfOk && formOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Factor 12x + 8 by pulling out the GCF.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          GCF of 12 and 8:{" "}
          <select className="answer" value={gcfPick} onChange={(e) => setGcfPick(e.target.value)} style={fieldStyle(gcfOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4">4</option>
            <option value="2">2</option>
          </select>
        </label>
        <label>
          Factored form:{" "}
          <select className="answer" value={formPick} onChange={(e) => setFormPick(e.target.value)} style={fieldStyle(formOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4(3x+2)">4(3x+2)</option>
            <option value="4(3x+8)">4(3x+8)</option>
            <option value="2(6x+4)">2(6x+4)</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the GCF of 12 and 8 is 4: 12x + 8 = 4(3x + 2). (2(6x+4) is also technically true, but 2 isn't the GREATEST common factor, so it's not fully factored.)"
            : "Not quite — the GCF has to divide evenly into BOTH 12 and 8. Dividing both terms by the GCF gives the factored form."}
        </p>
      )}
    </div>
  );
}

function PropertiesCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ likeTerms: false, expandVsFactor: false, repeatedAddTrap: false, factorGCF: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's connect a few ideas before you try practice problems.</p>
      <LikeTermsQuestion onComplete={mark("likeTerms")} />
      <ExpandVsFactorQuestion onComplete={mark("expandVsFactor")} />
      <RepeatedAddVsMultiplyTrap onComplete={mark("repeatedAddTrap")} />
      <FactorGCFQuestion onComplete={mark("factorGCF")} />
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
  const [b, setB] = useState(4);
  const [c, setC] = useState(2);
  const ab = a * b;
  const ac = a * c;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="a" value={a} min={2} max={6} step={1} onChange={setA} tone="a" />
        <Stepper label="b" value={b} min={1} max={9} step={1} onChange={setB} tone="b" />
        <Stepper label="c" value={c} min={1} max={9} step={1} onChange={setC} tone="c" />
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
      {(introActive || showCheck) && <PropertiesCheckForUnderstanding onComplete={onIntroDone} />}
      <div style={{ fontSize: 22, fontWeight: 700 }}>
        {a}(x+{b}) = {a}x + {ab}
      </div>
      <FactorRectangle rows={a} cols={b + c} splitCols={[b, c]} label={`${a} by ${b + c}`} />
      <p className="muted small">
        The rectangle shows {a} × ({b}+{c}) split into {a} × {b} and {a} × {c} — the same area either way. Distributing {a} across (x+{b})
        works the same way: {a} multiplies EVERY term inside the parentheses, not just the first one.
      </p>
      <div style={{ fontSize: 18 }}>
        Going the other direction (factoring): {ab} + {ac} = {a}({b}+{c}) — pulling {a} back out as the greatest common factor.
      </div>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — equivalent expressions via properties
// ============================================================================

type Bucket = "distribute-expand" | "distribute-factor" | "combine-basic" | "combine-with-coeffs" | "mixed";
const BUCKETS: Bucket[] = ["distribute-expand", "distribute-factor", "combine-basic", "combine-with-coeffs", "mixed"];

function propertiesProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "distribute-expand") {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const ab = a * b;
    return {
      title: "Distributing to expand",
      bucket,
      story: `Rewrite ${a}(x+${b}) as an equivalent expression with no parentheses.`,
      visual: (done: number) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 22, fontWeight: 700 }}>
          <div>
            {a}(x+{b})
          </div>
          {done >= 1 && (
            <div>
              {a}x + {a} × {b}
            </div>
          )}
          {done >= 2 && <div style={{ color: "var(--good)" }}>{a}x + {ab}</div>}
        </div>
      ),
      steps: [
        { kind: "number", prompt: `What is ${a} × ${b}?`, hint: "Multiply the outside factor by the number inside the parentheses.", explain: `${a} × ${b} = ${ab}.`, answer: ab },
        choice(
          { prompt: `Which expression equals ${a}(x+${b})?`, hint: `The ${a} multiplies BOTH x and ${b} — not just one of them.`, explain: `${a}(x+${b}) = ${a}x + ${ab}, since ${a} distributes to every term inside.` },
          `${a}x+${ab}`,
          [`${a}x+${b}`]
        ),
      ],
      wrapUp: `${a}(x+${b}) = ${a}x + ${ab}.`,
    };
  }

  if (bucket === "distribute-factor") {
    const m = randInt(2, 6);
    let n = randInt(2, 6);
    while (n === m) n = randInt(2, 6);
    const g = randInt(2, 6);
    const A = g * m;
    const B = g * n;
    return {
      title: "Factoring out the GCF",
      bucket,
      story: `Factor ${A}x + ${B} by pulling out the greatest common factor.`,
      visual: (done: number) => <FactorRectangle rows={g} cols={m + n} splitCols={done >= 1 ? [m, n] : undefined} label={`${A}x + ${B}`} />,
      steps: [
        { kind: "number", prompt: `What is the GCF of ${A} and ${B}?`, hint: "Find the largest number that divides evenly into both.", explain: `The GCF of ${A} and ${B} is ${g}.`, answer: g },
        choice(
          { prompt: `What is the fully factored form?`, hint: `Divide BOTH ${A} and ${B} by ${g}.`, explain: `${A}x + ${B} = ${g}(${m}x + ${n}).` },
          `${g}(${m}x+${n})`,
          [`${g}(${m}x+${B})`]
        ),
      ],
      wrapUp: `${A}x + ${B} = ${g}(${m}x + ${n}).`,
    };
  }

  if (bucket === "combine-basic") {
    const n = randInt(3, 6);
    const expr = Array.from({ length: n }, () => "y").join(" + ");
    return {
      title: "Combining like terms",
      bucket,
      story: `Simplify ${expr}.`,
      visual: (done: number) => (
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: n }, (_, i) => (
            <span
              key={i}
              style={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                borderRadius: "var(--radius-sm)",
                border: "2px solid var(--qa)",
                background: done >= 1 ? "var(--qa-soft)" : "var(--card)",
                color: "var(--qa-text)",
                fontWeight: 700,
              }}
            >
              y
            </span>
          ))}
        </div>
      ),
      steps: [
        { kind: "number", prompt: "How many y's are being added together?", hint: "Count each y in the expression.", explain: `There are ${n} copies of y.`, answer: n },
        choice(
          { prompt: `So what is ${expr} simplified?`, hint: "This is repeated ADDITION, not repeated multiplication.", explain: `${n} copies of y added together is ${n}y — not y${toSuperscript(n)}, which would mean multiplying y by itself.` },
          `${n}y`,
          [`y${toSuperscript(n)}`]
        ),
      ],
      wrapUp: `${expr} = ${n}y.`,
    };
  }

  if (bucket === "combine-with-coeffs") {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const sum = a + b;
    return {
      title: "Combining like terms with coefficients",
      bucket,
      story: `Simplify ${a}y + ${b}y.`,
      visual: () => (
        <div style={{ fontSize: 22, fontWeight: 700, display: "flex", flexDirection: "column", gap: 6 }}>
          <div>
            <span style={{ color: "var(--qa-text)" }}>{a}y</span> + <span style={{ color: "var(--qb-text)" }}>{b}y</span>
          </div>
        </div>
      ),
      steps: [
        { kind: "number", prompt: `${a}y + ${b}y — what is the combined coefficient of y?`, hint: `Add the coefficients: ${a} + ${b}.`, explain: `${a} + ${b} = ${sum}, so ${a}y + ${b}y = ${sum}y.`, answer: sum },
      ],
      wrapUp: `${a}y + ${b}y = ${sum}y.`,
    };
  }

  // mixed
  const a = randInt(2, 6);
  const b = randInt(2, 9);
  const c = randInt(1, 6);
  const ab = a * b;
  const combinedCoeff = a + c;
  return {
    title: "Distribute, then combine like terms",
    bucket,
    story: `Simplify ${a}(x+${b}) + ${c}x.`,
    visual: (done: number) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 20, fontWeight: 700 }}>
        <div>
          {a}(x+{b}) + {c}x
        </div>
        {done >= 1 && <div>{a}x + {ab} + {c}x</div>}
        {done >= 2 && <div style={{ color: "var(--good)" }}>{combinedCoeff}x + {ab}</div>}
      </div>
    ),
    steps: [
      { kind: "number", prompt: `First, distribute: ${a}(x+${b}) = ${a}x + ?`, hint: `Multiply ${a} by ${b}.`, explain: `${a}(x+${b}) = ${a}x + ${ab}.`, answer: ab },
      { kind: "number", prompt: `Now combine the x-terms: ${a}x + ${c}x = ?x. What's the coefficient?`, hint: `Add ${a} + ${c}.`, explain: `${a}x + ${c}x = ${combinedCoeff}x.`, answer: combinedCoeff },
    ],
    wrapUp: `${a}(x+${b}) + ${c}x = ${combinedCoeff}x + ${ab}.`,
  };
}

export const equivalentExpressionsProperties: Unit = {
  id: "equivalentExpressionsProperties",
  title: "Equivalent Expressions via Properties",
  goal: "Use the distributive property and other properties of operations to generate equivalent expressions.",
  standard: "6.EE.3",
  keyIdea: (
    <>
      <p>
        The distributive property works both ways: a(b+x) = ab + ax (expanding), and ab + ac = a(b+c) (factoring out the GCF).
      </p>
      <p>Like terms (same variable) can be combined by adding their coefficients — but y+y+y = 3y, NOT y³. Adding and multiplying are different operations.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Equivalent Expressions", make: propertiesProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: equivalentExpressionsPropertiesTest,
};
