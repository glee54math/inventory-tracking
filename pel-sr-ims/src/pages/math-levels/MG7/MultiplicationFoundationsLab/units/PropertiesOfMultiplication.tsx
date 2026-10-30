import { useEffect, useState, type CSSProperties } from "react";
import { FactorRectangle } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { propertiesOfMultiplicationTest } from "./PropertiesOfMultiplicationTest";

type PropertyMode = "commutative" | "associative" | "distributive";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * 4 fixed (non-randomized) questions. Q1 is the "only works for the one
 * split shown" misconception, named directly in the plan; Q2 distinguishes
 * commutative from associative (also named in the plan); Q3 confirms
 * commutative reasoning directly; Q4 is the true/false generalization to an
 * unseen pair.
 */
function PropertiesCheck({ onComplete }: { onComplete?: () => void }) {
  const [q1, setQ1] = useState<"true" | "false" | null>(null);
  const q1Done = q1 === "true";

  const PROPS = ["Commutative", "Associative", "Distributive"] as const;
  const [q2, setQ2] = useState<string | null>(null);
  const q2Done = q2 === "Associative";

  const [q3, setQ3] = useState<"true" | "false" | null>(null);
  const q3Done = q3 === "true";

  const [q4, setQ4] = useState<"true" | "false" | null>(null);
  const q4Done = q4 === "true";

  const allDone = q1Done && q2Done && q3Done && q4Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  const pickStyle = (selected: boolean, correct: boolean, checked: boolean): CSSProperties => ({
    padding: "8px 14px",
    borderRadius: "var(--radius-sm)",
    border: `2px solid ${!checked || !selected ? "var(--line)" : correct ? "var(--good)" : "var(--bad)"}`,
    background: !checked || !selected ? "var(--card)" : correct ? "var(--good-soft)" : "var(--bad-soft)",
    fontWeight: 600,
    cursor: correct && checked ? "default" : "pointer",
  });

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: these tricks always work, not just for the one example shown.</p>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>1.</b> You can split 6 × 7 into 6 × 5 + 6 × 2 to make it easier. True or False: you could ALSO split it into 6 × 4 + 6 × 3 instead, and still get the right answer?
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {(["true", "false"] as const).map((v) => (
            <button key={v} type="button" disabled={q1Done} style={pickStyle(q1 === v, v === "true", q1 !== null)} onClick={() => setQ1(v)}>
              {v === "true" ? "True" : "False"}
            </button>
          ))}
        </div>
        {q1 !== null && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done
              ? "True — 6 × 4 + 6 × 3 = 24 + 18 = 42, same as 6 × 7. ANY split of the 7 works, not just one."
              : "Check it: 6 × 4 + 6 × 3 = 24 + 18. Does that equal 6 × 7 = 42?"}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>2.</b> "3 × (4 × 5) = (3 × 4) × 5" — regrouping three factors without changing the order — is an example of which property?
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {PROPS.map((p) => (
            <button key={p} type="button" disabled={q2Done} style={pickStyle(q2 === p, p === "Associative", q2 !== null)} onClick={() => setQ2(p)}>
              {p}
            </button>
          ))}
        </div>
        {q2 !== null && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done
              ? "Right — regrouping (not reordering) three factors is the associative property."
              : "Commutative reorders two factors; associative regroups three; distributive splits one factor apart. Which one is this?"}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>3.</b> True or False: 4 × 9 and 9 × 4 give the same product, just with the factors in a different order.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {(["true", "false"] as const).map((v) => (
            <button key={v} type="button" disabled={q3Done} style={pickStyle(q3 === v, v === "true", q3 !== null)} onClick={() => setQ3(v)}>
              {v === "true" ? "True" : "False"}
            </button>
          ))}
        </div>
        {q3 !== null && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done ? "True — 4 × 9 = 36 and 9 × 4 = 36. Swapping the order of the factors never changes the product." : "Try computing both: 4 × 9 and 9 × 4."}
          </p>
        )}
      </div>

      <div>
        <p>
          <b>4.</b> True or False: since 6 × 7 can be split into 6 × 5 + 6 × 2, a completely different pair like 8 × 9 can ALSO be split apart the same way (for example, 8 × 9 = 8 × 4 + 8 × 5).
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {(["true", "false"] as const).map((v) => (
            <button key={v} type="button" disabled={q4Done} style={pickStyle(q4 === v, v === "true", q4 !== null)} onClick={() => setQ4(v)}>
              {v === "true" ? "True" : "False"}
            </button>
          ))}
        </div>
        {q4 !== null && (
          <p className={`feedback ${q4Done ? "good" : "bad"}`} role="alert">
            {q4Done
              ? "True — the distributive property works for ANY multiplication, not just 6 × 7. Check: 8 × 4 + 8 × 5 = 32 + 40 = 72 = 8 × 9."
              : "Try it: 8 × 4 + 8 × 5 = 32 + 40. Does that equal 8 × 9 = 72?"}
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
  const [mode, setMode] = useState<PropertyMode>("commutative");

  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(6);

  const [fa, setFa] = useState(2);
  const [fb, setFb] = useState(3);
  const [fc, setFc] = useState(4);

  const [da, setDa] = useState(6);
  const [db, setDb] = useState(8);
  const [split, setSplit] = useState(5);
  const splitClamped = Math.min(Math.max(1, split), db - 1);

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
      {(introActive || showCheck) && <PropertiesCheck onComplete={onIntroDone} />}
      <Segmented
        label="Property"
        value={mode}
        onChange={setMode}
        options={[
          { id: "commutative", label: "Order (Commutative)" },
          { id: "associative", label: "Grouping (Associative)" },
          { id: "distributive", label: "Breaking Apart (Distributive)" },
        ]}
      />

      {mode === "commutative" && (
        <>
          <div className="control-row">
            <Stepper label="Rows" value={rows} min={2} max={9} onChange={setRows} tone="a" />
            <Stepper label="Columns" value={cols} min={2} max={9} onChange={setCols} tone="b" />
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
            <FactorRectangle rows={rows} cols={cols} label={`${rows} × ${cols}`} />
            <FactorRectangle rows={cols} cols={rows} label={`${cols} × ${rows}`} />
          </div>
          <p className="muted small">
            {rows} × {cols} = {rows * cols}, and {cols} × {rows} = {cols * rows}. Same total, two rectangles that are just rotated 90° from each other — swapping the order of the factors never changes the product.
          </p>
        </>
      )}

      {mode === "associative" && (
        <>
          <div className="control-row">
            <Stepper label="First" value={fa} min={2} max={6} onChange={setFa} tone="a" />
            <Stepper label="Second" value={fb} min={2} max={6} onChange={setFb} tone="b" />
            <Stepper label="Third" value={fc} min={2} max={6} onChange={setFc} tone="c" />
          </div>
          <p>
            Group the first two: ({fa} × {fb}) × {fc} = {fa * fb} × {fc} = {fa * fb * fc}.
          </p>
          <p>
            Group the last two instead: {fa} × ({fb} × {fc}) = {fa} × {fb * fc} = {fa * (fb * fc)}.
          </p>
          <p className="muted small">Either way you group three factors, you get the same final product — only which TWO you multiply first changes, not the order of the factors themselves.</p>
        </>
      )}

      {mode === "distributive" && (
        <>
          <div className="control-row">
            <Stepper label="Rows" value={da} min={2} max={9} onChange={setDa} tone="a" />
            <Stepper label="Columns" value={db} min={3} max={9} onChange={setDb} tone="b" />
            <Stepper label="Split columns at" value={splitClamped} min={1} max={db - 1} onChange={setSplit} tone="c" />
          </div>
          <FactorRectangle rows={da} cols={db} splitCols={[splitClamped, db - splitClamped]} />
          <p className="muted small">
            {da} × {db} = {da} × {splitClamped} + {da} × {db - splitClamped} = {da * splitClamped} + {da * (db - splitClamped)} = {da * db}. Try dragging the split to a different spot — it still works, because ANY split of {db} adds back up to {db}.
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — commutative property
// ============================================================================

function commutativeProblem(): Problem {
  const rows = randInt(2, 9);
  let cols = randInt(2, 9);
  while (cols === rows) cols = randInt(2, 9);
  const total = rows * cols;

  return {
    title: "Same total, rotated array",
    bucket: "commutative",
    story: `An array has ${rows} rows and ${cols} columns.`,
    visual: (done: number) => (
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <FactorRectangle rows={rows} cols={cols} label={`${rows} × ${cols}`} />
        {done >= 1 && <FactorRectangle rows={cols} cols={rows} label={`${cols} × ${rows}`} />}
      </div>
    ),
    steps: [
      {
        kind: "number",
        prompt: `What is ${rows} × ${cols}?`,
        hint: "Multiply rows by columns.",
        explain: `${rows} × ${cols} = ${total}.`,
        answer: total,
      },
      {
        kind: "number",
        prompt: `Now rotate it: what is ${cols} × ${rows}?`,
        hint: "Swapping the order of the factors doesn't change the product.",
        explain: `${cols} × ${rows} = ${total} too.`,
        answer: total,
      },
      choice(
        {
          prompt: "True or False: swapping the order of the two factors changes the product.",
          hint: "You just computed both orders above.",
          explain: `False — ${rows} × ${cols} and ${cols} × ${rows} both equal ${total}.`,
        },
        "False — the product stays the same either way",
        ["True — swapping the order changes the product"]
      ),
    ],
    wrapUp: `${rows} × ${cols} = ${cols} × ${rows} = ${total} — the commutative property.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — associative property
// ============================================================================

function associativeProblem(): Problem {
  const a = randInt(2, 6);
  const b = randInt(2, 6);
  const c = randInt(2, 6);
  const bc = b * c;
  const total = a * bc;

  return {
    title: "Grouping three factors",
    bucket: "associative",
    story: `Find ${a} × ${b} × ${c} by grouping the last two factors first.`,
    visual: () => null,
    steps: [
      {
        kind: "number",
        prompt: `First, what is ${b} × ${c}?`,
        hint: "Multiply the second and third factors together first.",
        explain: `${b} × ${c} = ${bc}.`,
        answer: bc,
      },
      {
        kind: "number",
        prompt: `Now multiply: ${a} × (${b} × ${c}) = ${a} × ${bc} = ?`,
        hint: `${a} × ${bc} = ?`,
        explain: `${a} × ${bc} = ${total}.`,
        answer: total,
      },
      choice(
        {
          prompt: `If you had instead grouped it as (${a} × ${b}) × ${c}, would the final answer change?`,
          hint: "Regrouping which two factors you multiply first never changes the final product.",
          explain: `No — (${a} × ${b}) × ${c} = ${a * b} × ${c} = ${total} too, the same final answer.`,
        },
        "No — regrouping the factors doesn't change the product",
        ["Yes — you'd get a different final answer"]
      ),
    ],
    wrapUp: `${a} × ${b} × ${c} = ${total}, no matter which two factors you group first.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — distributive property
// ============================================================================

function distributiveProblem(): Problem {
  const a = randInt(3, 9);
  const b = randInt(6, 9);
  const part1 = randInt(1, b - 1);
  const part2 = b - part1;
  const total = a * b;

  return {
    title: "Break it apart",
    bucket: "distributive",
    story: `Find ${a} × ${b} by splitting ${b} into ${part1} + ${part2}.`,
    visual: () => <FactorRectangle rows={a} cols={b} splitCols={[part1, part2]} />,
    steps: [
      {
        kind: "number",
        prompt: `What is ${a} × ${part1}?`,
        hint: "Multiply the first part.",
        explain: `${a} × ${part1} = ${a * part1}.`,
        answer: a * part1,
      },
      {
        kind: "number",
        prompt: `What is ${a} × ${part2}?`,
        hint: "Multiply the second part.",
        explain: `${a} × ${part2} = ${a * part2}.`,
        answer: a * part2,
      },
      {
        kind: "number",
        prompt: `Add the two parts together: what is ${a} × ${b}?`,
        hint: `${a * part1} + ${a * part2} = ?`,
        explain: `${a * part1} + ${a * part2} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: `${a} × ${b} = ${a} × ${part1} + ${a} × ${part2} = ${total}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — true/false generalization to a new, unseen pair
// ============================================================================

function trueFalseGeneralizationProblem(): Problem {
  const a = randInt(3, 9);
  const b = randInt(6, 9);
  const part1 = randInt(1, b - 1);
  const part2 = b - part1;
  const total = a * b;

  return {
    title: "Does the trick always work?",
    bucket: "trueFalseGeneralization",
    story: `You already saw that 6 × 7 = 6 × 5 + 6 × 2. Does the same idea work for ${a} × ${b}, split as ${a} × ${part1} + ${a} × ${part2}?`,
    visual: () => <FactorRectangle rows={a} cols={b} splitCols={[part1, part2]} />,
    steps: [
      choice(
        {
          prompt: `True or False: ${a} × ${part1} + ${a} × ${part2} equals ${a} × ${b}?`,
          hint: `${part1} + ${part2} = ${b}, so splitting ${b} into those two parts doesn't change the total.`,
          explain: "True — you can split either factor into ANY two parts that add back up, and multiplying each part separately then adding still gives the same total.",
        },
        "True — any valid split of the factor works, not just one specific split",
        ["False — this only works for the exact split 6 × 5 + 6 × 2 you saw before"]
      ),
      {
        kind: "number",
        prompt: `Prove it: what is ${a} × ${part1} + ${a} × ${part2}?`,
        hint: `${a} × ${part1} = ?, and ${a} × ${part2} = ?`,
        explain: `${a} × ${part1} = ${a * part1}, and ${a} × ${part2} = ${a * part2}. ${a * part1} + ${a * part2} = ${total}, which matches ${a} × ${b}.`,
        answer: total,
      },
    ],
    wrapUp: `${a} × ${b} = ${a} × ${part1} + ${a} × ${part2} = ${total} — the distributive property works for any split, not just one.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <FactorRectangle rows={6} cols={9} splitCols={[5, 4]} />;
}

export const propertiesOfMultiplication: Unit = {
  id: "propertiesOfMultiplication",
  title: "Properties of Multiplication",
  goal: "Use the order of factors, the grouping of factors, and breaking a factor apart to make multiplication easier, and explain why these tricks always work.",
  standard: "3.OA.5",
  keyIdea: (
    <>
      <p>Order doesn't matter: a × b = b × a (commutative). Grouping doesn't matter: (a × b) × c = a × (b × c) (associative).</p>
      <p>You can break one factor apart into two pieces, multiply each piece, then add — and still get the same total (distributive). This works for ANY valid split, not just one.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [
    { label: "Order (Commutative)", make: commutativeProblem },
    { label: "Grouping (Associative)", make: associativeProblem },
    { label: "Break Apart (Distributive)", make: distributiveProblem },
    { label: "Does it Always Work?", make: trueFalseGeneralizationProblem },
  ],
  requiredBuckets: ["commutative", "associative", "distributive", "trueFalseGeneralization"],
  test: propertiesOfMultiplicationTest,
};
