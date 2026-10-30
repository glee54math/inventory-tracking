import { useEffect, useState, type CSSProperties } from "react";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { oneDigitFactsFluencyTest } from "./OneDigitFactsFluencyTest";

type Category = "anchor" | "doubling" | "hard" | "squares";

const ANCHOR_FACTORS = [0, 1, 2, 5, 10];
const HARD_FACTORS = [6, 7, 8, 9];

const ANCHOR_STRATEGY: Record<number, string> = {
  0: "Anything times 0 is 0.",
  1: "Anything times 1 stays the same.",
  2: "Double the other number.",
  5: "Half of multiplying by 10.",
  10: "Just add a zero to the other number.",
};

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * 4 fixed (non-randomized) questions, confirming the student has at least
 * one derivation STRATEGY for the hard facts before leaning on pure drill —
 * exactly what the plan asks this unit's CFU to check. Q1 is the core
 * "how would you figure it out" strategy check; Q2 is the near-miss
 * collision check (6×7 vs 6×8); Q3 is the square-fact-as-anchor strategy;
 * Q4 confirms the ×10 anchor strategy directly.
 */
function FactsFluencyCheck({ onComplete }: { onComplete?: () => void }) {
  const [q1, setQ1] = useState<string | null>(null);
  const Q1_RIGHT = "Use 7 × 7 = 49, a fact you already know, then add one more 7: 49 + 7 = 56.";
  const q1Done = q1 === Q1_RIGHT;

  const [q2, setQ2] = useState<"true" | "false" | null>(null);
  const q2Done = q2 === "false";

  const [q3, setQ3] = useState<string | null>(null);
  const Q3_RIGHT = "Add one more 8: 64 + 8 = 72.";
  const q3Done = q3 === Q3_RIGHT;

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
    textAlign: "left",
    cursor: correct && checked ? "default" : "pointer",
  });

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: before you drill facts, make sure you have at least one way to figure out a fact you forget.</p>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>1.</b> If you forget 7 × 8, how could you quickly figure it out from a fact you already know?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          {[Q1_RIGHT, "Guess a number close to 50.", "Count by 1s from 0 up to 56."].map((opt) => (
            <button key={opt} type="button" disabled={q1Done} style={pickStyle(q1 === opt, opt === Q1_RIGHT, q1 !== null)} onClick={() => setQ1(opt)}>
              {opt}
            </button>
          ))}
        </div>
        {q1 !== null && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done ? "Right — a square fact you already know (7×7=49) plus one more group gets you there fast." : "Counting or guessing is slow and risky — is there a fact you already know that's close to this one?"}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>2.</b> True or False: 6 × 7 and 6 × 8 have the same product.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {(["true", "false"] as const).map((v) => (
            <button key={v} type="button" disabled={q2Done} style={pickStyle(q2 === v, v === "false", q2 !== null)} onClick={() => setQ2(v)}>
              {v === "true" ? "True" : "False"}
            </button>
          ))}
        </div>
        {q2 !== null && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done ? "False — 6 × 7 = 42 and 6 × 8 = 48. They're close, which is exactly why it's easy to mix them up." : "Compute both: 6 × 7 and 6 × 8. Are they really the same?"}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>3.</b> You already know 8 × 8 = 64. What's a fast way to find 8 × 9 from that?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          {[Q3_RIGHT, "Multiply 64 by 9.", "It has nothing to do with 8 × 8."].map((opt) => (
            <button key={opt} type="button" disabled={q3Done} style={pickStyle(q3 === opt, opt === Q3_RIGHT, q3 !== null)} onClick={() => setQ3(opt)}>
              {opt}
            </button>
          ))}
        </div>
        {q3 !== null && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done ? "Right — square facts are great anchors: one more group of 8 gets you from 8×8 to 8×9." : "8 × 9 is just one more group of 8 than 8 × 8 — what's 64 plus one more 8?"}
          </p>
        )}
      </div>

      <div>
        <p>
          <b>4.</b> True or False: to multiply any one-digit number by 10, you can just put a zero on the end.
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
            {q4Done ? "True — 6 × 10 = 60, 9 × 10 = 90, and so on. ×10 is one of your fastest anchor facts." : "Try it: 6 × 10. Isn't that just 6 with a zero on the end?"}
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
  const [category, setCategory] = useState<Category>("anchor");
  const [anchor, setAnchor] = useState(10);
  const [other, setOther] = useState(6);
  const [small, setSmall] = useState(4);
  const [smallOther, setSmallOther] = useState(6);
  const [hardA, setHardA] = useState(7);
  const [hardB, setHardB] = useState(8);
  const [n, setN] = useState(7);

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
      {(introActive || showCheck) && <FactsFluencyCheck onComplete={onIntroDone} />}
      <Segmented
        label="Fact family"
        value={category}
        onChange={setCategory}
        options={[
          { id: "anchor", label: "0, 1, 2, 5, 10" },
          { id: "doubling", label: "3, 4" },
          { id: "hard", label: "6, 7, 8, 9" },
          { id: "squares", label: "Squares" },
        ]}
      />

      {category === "anchor" && (
        <>
          <div className="control-row">
            <Segmented label="Anchor" value={String(anchor)} onChange={(v) => setAnchor(Number(v))} options={ANCHOR_FACTORS.map((a) => ({ id: String(a), label: String(a) }))} />
            <Stepper label="Other factor" value={other} min={0} max={9} onChange={setOther} tone="b" />
          </div>
          <p style={{ fontSize: 22, fontWeight: 700 }}>
            {anchor} × {other} = {anchor * other}
          </p>
          <p className="muted small">Strategy: {ANCHOR_STRATEGY[anchor]}</p>
        </>
      )}

      {category === "doubling" && (
        <>
          <div className="control-row">
            <Segmented label="Factor" value={String(small)} onChange={(v) => setSmall(Number(v))} options={[{ id: "3", label: "3" }, { id: "4", label: "4" }]} />
            <Stepper label="Other factor" value={smallOther} min={0} max={9} onChange={setSmallOther} tone="b" />
          </div>
          <p style={{ fontSize: 22, fontWeight: 700 }}>
            {small} × {smallOther} = {small * smallOther}
          </p>
          <p className="muted small">
            {small === 4
              ? `Strategy: double ${smallOther}, then double again — ${smallOther} × 2 = ${smallOther * 2}, then × 2 again = ${smallOther * 4}.`
              : `Strategy: double ${smallOther}, then add one more ${smallOther} — ${smallOther} × 2 = ${smallOther * 2}, then + ${smallOther} = ${smallOther * 3}.`}
          </p>
        </>
      )}

      {category === "hard" && (
        <>
          <div className="control-row">
            <Stepper label="First factor" value={hardA} min={6} max={9} onChange={setHardA} tone="a" />
            <Stepper label="Second factor" value={hardB} min={6} max={9} onChange={setHardB} tone="b" />
          </div>
          <p style={{ fontSize: 22, fontWeight: 700 }}>
            {hardA} × {hardB} = {hardA * hardB}
          </p>
          <p className="muted small">
            Strategy: one less group is {hardA} × {hardB - 1} = {hardA * (hardB - 1)}, then add {hardA} more to get {hardA * hardB}.
          </p>
        </>
      )}

      {category === "squares" && (
        <>
          <div className="control-row">
            <Stepper label="Number" value={n} min={2} max={9} onChange={setN} tone="a" />
          </div>
          <p style={{ fontSize: 22, fontWeight: 700 }}>
            {n} × {n} = {n * n}
          </p>
          <p className="muted small">
            Square facts make great anchors: {n} × {n + 1} = {n * n} + {n} = {n * (n + 1)}.
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — anchor facts: 0, 1, 2, 5, 10
// ============================================================================

function anchorProblem(): Problem {
  const anchor = pick(ANCHOR_FACTORS);
  const other = randInt(0, 9);
  const total = anchor * other;
  const strategyOptions = ANCHOR_FACTORS.filter((a) => a !== anchor).slice(0, 2);

  return {
    title: "Anchor facts",
    bucket: "anchor0125_10",
    story: `What is ${anchor} × ${other}?`,
    visual: () => null,
    steps: [
      {
        kind: "number",
        prompt: `What is ${anchor} × ${other}?`,
        hint: ANCHOR_STRATEGY[anchor],
        explain: `${anchor} × ${other} = ${total}.`,
        answer: total,
      },
      choice(
        {
          prompt: `Which strategy matches multiplying by ${anchor}?`,
          hint: "Think about what makes this anchor fact fast.",
          explain: `For ×${anchor}: ${ANCHOR_STRATEGY[anchor]}`,
        },
        ANCHOR_STRATEGY[anchor],
        strategyOptions.map((a) => ANCHOR_STRATEGY[a])
      ),
    ],
    wrapUp: `${anchor} × ${other} = ${total}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — doubling facts: 3, 4
// ============================================================================

function doublingProblem(): Problem {
  const factor = pick([3, 4]);
  const other = randInt(0, 9);
  const total = factor * other;
  const doubled = other * 2;

  return {
    title: "Doubling facts",
    bucket: "anchor34",
    story: `What is ${factor} × ${other}?`,
    visual: () => null,
    steps:
      factor === 4
        ? [
            { kind: "number" as const, prompt: `First, double ${other}: what is ${other} × 2?`, hint: "Double it.", explain: `${other} × 2 = ${doubled}.`, answer: doubled },
            { kind: "number" as const, prompt: `Now double again: what is ${doubled} × 2? That's ${factor} × ${other}.`, hint: "Double the doubled number.", explain: `${doubled} × 2 = ${total}, so ${factor} × ${other} = ${total}.`, answer: total },
          ]
        : [
            { kind: "number" as const, prompt: `First, double ${other}: what is ${other} × 2?`, hint: "Double it.", explain: `${other} × 2 = ${doubled}.`, answer: doubled },
            { kind: "number" as const, prompt: `Now add one more ${other}: ${doubled} + ${other}? That's ${factor} × ${other}.`, hint: `${doubled} + ${other} = ?`, explain: `${doubled} + ${other} = ${total}, so ${factor} × ${other} = ${total}.`, answer: total },
          ],
    wrapUp: `${factor} × ${other} = ${total}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — hard facts: 6, 7, 8, 9 (excluding squares)
// ============================================================================

function hardFactProblem(): Problem {
  const a = pick(HARD_FACTORS);
  let b = pick(HARD_FACTORS);
  while (b === a) b = pick(HARD_FACTORS);
  const total = a * b;
  const oneLess = a * (b - 1);

  return {
    title: "Hard facts (6-9)",
    bucket: "hard6789",
    story: `What is ${a} × ${b}?`,
    visual: () => null,
    steps: [
      {
        kind: "number",
        prompt: `Not sure? First find one less group: ${a} × ${b - 1} = ?`,
        hint: "One fewer group than the target fact.",
        explain: `${a} × ${b - 1} = ${oneLess}.`,
        answer: oneLess,
      },
      {
        kind: "number",
        prompt: `Now add one more group of ${a}: ${oneLess} + ${a} = ${a} × ${b}. What is it?`,
        hint: `${oneLess} + ${a} = ?`,
        explain: `${oneLess} + ${a} = ${total}, so ${a} × ${b} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: `${a} × ${b} = ${total}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — square facts
// ============================================================================

function squareProblem(): Problem {
  const n = randInt(2, 9);
  const square = n * n;
  const neighbor = n * (n + 1);

  return {
    title: "Square facts",
    bucket: "squares",
    story: `What is ${n} × ${n}?`,
    visual: () => null,
    steps: [
      {
        kind: "number",
        prompt: `What is ${n} × ${n}?`,
        hint: `${n} groups of ${n}.`,
        explain: `${n} × ${n} = ${square}.`,
        answer: square,
      },
      {
        kind: "number",
        prompt: `Square facts are great anchors. Using ${n} × ${n} = ${square}, what is ${n} × ${n + 1}?`,
        hint: `${square} + ${n} = ?`,
        explain: `${n} × ${n + 1} = ${square} + ${n} = ${neighbor}.`,
        answer: neighbor,
      },
    ],
    wrapUp: `${n} × ${n} = ${square}, and ${n} × ${n + 1} = ${neighbor}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 5 — near-miss fact confusion (e.g. 6×7 vs 6×8)
// ============================================================================

function nearMissProblem(): Problem {
  const a = randInt(2, 9);
  const b = randInt(2, 8);
  const b2 = b + 1;
  const p1 = a * b;
  const p2 = a * b2;

  return {
    title: "Near-miss facts",
    bucket: "nearMiss",
    story: `Compare ${a} × ${b} and ${a} × ${b2}.`,
    visual: () => null,
    steps: [
      { kind: "number", prompt: `What is ${a} × ${b}?`, hint: "Multiply.", explain: `${a} × ${b} = ${p1}.`, answer: p1 },
      { kind: "number", prompt: `What is ${a} × ${b2}?`, hint: "Multiply.", explain: `${a} × ${b2} = ${p2}.`, answer: p2 },
      choice(
        {
          prompt: `Which is bigger: ${a} × ${b} or ${a} × ${b2}?`,
          hint: "Compare the two products you just found.",
          explain: `${a} × ${b2} = ${p2} is ${a} more than ${a} × ${b} = ${p1}, since ${b2} is one more group of ${a}.`,
        },
        `${a} × ${b2}`,
        [`${a} × ${b}`, "They are equal"]
      ),
    ],
    wrapUp: `${a} × ${b} = ${p1} and ${a} × ${b2} = ${p2} — easy to mix up since they're only ${a} apart.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <div style={{ fontSize: 28, fontWeight: 700, textAlign: "center" }}>7 × 8 = 56</div>;
}

export const oneDigitFactsFluency: Unit = {
  id: "oneDigitFactsFluency",
  title: "One-Digit Multiplication Facts (Fluency)",
  goal: "Quickly recall the product of any two one-digit numbers without needing to count or draw a picture.",
  standard: "3.OA.7a",
  keyIdea: (
    <>
      <p>Anchor facts (×0, ×1, ×2, ×5, ×10) are the fastest. Doubling gets you ×3 and ×4. Square facts (n×n) are strong anchors for their neighbors.</p>
      <p>The hardest facts are 6, 7, 8, 9 together — use a nearby fact you already know (a square, or one group more or less) instead of counting.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // The one unit in this lab where reintroEverySolved applies: 3.OA.7
  // explicitly calls for knowing every one-digit product from memory by
  // end of grade, and a fact drilled correctly once can still fade months
  // later without periodic re-surfacing — same reasoning as MM1's
  // Conversions unit (shared/units/types.ts's own doc comment on this
  // field). 20 solved problems between re-checks matches that precedent.
  reintroEverySolved: 20,
  preview: Preview,
  problems: [
    { label: "0, 1, 2, 5, 10", make: anchorProblem },
    { label: "3, 4", make: doublingProblem },
    { label: "6, 7, 8, 9", make: hardFactProblem },
    { label: "Squares", make: squareProblem },
    { label: "Near-Miss Check", make: nearMissProblem },
  ],
  requiredBuckets: ["anchor0125_10", "anchor34", "hard6789", "squares", "nearMiss"],
  test: oneDigitFactsFluencyTest,
};
