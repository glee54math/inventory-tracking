import { useState } from "react";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { factFluencyTest } from "./FactFluencyTest";

export const FACT_FLUENCY_BUCKETS = ["easyAnchors", "midDivisors", "hardDivisors", "squareDerived", "nearMiss"];

// Divisor pools per bucket. NOTE on the plan's "Dividing by 0, 1, 2, 5, 10"
// wording for the easy-anchors bucket: division by 0 is mathematically
// undefined (there's no whole-number quotient for anything ÷ 0), unlike
// multiplication by 0, which Multiplication Foundations' mirrored
// easy-factor bucket can legitimately include. Built as {1, 2, 5, 10} here,
// dropping 0 — see this lab's build report for the full reasoning.
const EASY_DIVISORS = [1, 2, 5, 10];
const MID_DIVISORS = [3, 4];
const HARD_DIVISORS = [6, 7, 8, 9];

// ============================================================================
// A brief, self-contained one-digit-fact refresher (duplicated from
// UnknownFactor.tsx rather than cross-imported between sibling unit files —
// same "near-verbatim local duplicate" convention MK1/MK2 established for
// small reused pieces within one lab; see MATH_TSX_STYLE_GUIDE.txt section 10).
// ============================================================================

function FactsReference() {
  const [open, setOpen] = useState(false);
  const rows = [2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div>
      <button type="button" className="btn ghost" style={{ width: "fit-content" }} onClick={() => setOpen((v) => !v)}>
        {open ? "Hide" : "Show"} multiplication facts reference
      </button>
      {open && (
        <div style={{ overflowX: "auto", marginTop: 8 }}>
          <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: 4 }}>×</th>
                {rows.map((c) => (
                  <th key={c} style={{ padding: 4, border: "1px solid var(--line)" }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r}>
                  <th style={{ padding: 4, border: "1px solid var(--line)" }}>{r}</th>
                  {rows.map((c) => (
                    <td key={c} style={{ padding: 4, border: "1px solid var(--line)", textAlign: "center" }}>
                      {r * c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXPLORE — no required intro (pure extended practice on a strategy already
// taught in Unit 2, using facts the prerequisite lab should have covered —
// per the plan). Free-play quick-fact drill plus the same facts reference.
// ============================================================================

function Explore() {
  const [divisor, setDivisor] = useState(7);
  const [quotient, setQuotient] = useState(6);
  const dividend = divisor * quotient;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Divisor" value={divisor} min={1} max={10} onChange={setDivisor} tone="a" />
        <Stepper label="Quotient" value={quotient} min={1} max={10} onChange={setQuotient} tone="b" />
      </div>
      <p style={{ fontSize: 24, fontWeight: 700, textAlign: "center" }}>
        {dividend} ÷ {divisor} = {quotient}
      </p>
      <p className="muted small">
        Drag either number — notice the fact stays true as long as divisor × quotient always equals the dividend shown above.
      </p>
      <FactsReference />
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — factFluency
// ============================================================================

function makeEasyAnchorProblem(): Problem {
  const divisor = pick(EASY_DIVISORS);
  const quotient = randInt(2, 10);
  const dividend = divisor * quotient;
  return {
    title: "Quick facts: dividing by 1, 2, 5, or 10",
    bucket: "easyAnchors",
    story: `${dividend} ÷ ${divisor} = ?`,
    visual: () => null,
    steps: [
      {
        kind: "number",
        prompt: `${dividend} ÷ ${divisor} = ?`,
        hint: `Think: ${divisor} × ? = ${dividend}.`,
        explain: `${dividend} ÷ ${divisor} = ${quotient}.`,
        answer: quotient,
      },
    ],
    wrapUp: `${dividend} ÷ ${divisor} = ${quotient}.`,
  };
}

function makeMidDivisorProblem(): Problem {
  const divisor = pick(MID_DIVISORS);
  const quotient = randInt(2, 9);
  const dividend = divisor * quotient;
  return {
    title: "Quick facts: dividing by 3 or 4",
    bucket: "midDivisors",
    story: `${dividend} ÷ ${divisor} = ?`,
    visual: () => null,
    steps: [
      {
        kind: "number",
        prompt: `${dividend} ÷ ${divisor} = ?`,
        hint: `Think: ${divisor} × ? = ${dividend}.`,
        explain: `${dividend} ÷ ${divisor} = ${quotient}.`,
        answer: quotient,
      },
    ],
    wrapUp: `${dividend} ÷ ${divisor} = ${quotient}.`,
  };
}

function makeHardDivisorProblem(): Problem {
  const divisor = pick(HARD_DIVISORS);
  let quotient = randInt(2, 9);
  while (quotient === divisor) quotient = randInt(2, 9); // excludes perfect-square cases — their own bucket
  const dividend = divisor * quotient;
  return {
    title: "Quick facts: dividing by 6, 7, 8, or 9",
    bucket: "hardDivisors",
    story: `${dividend} ÷ ${divisor} = ?`,
    visual: () => null,
    steps: [
      {
        kind: "number",
        prompt: `${dividend} ÷ ${divisor} = ?`,
        hint: `Think: ${divisor} × ? = ${dividend}.`,
        explain: `${dividend} ÷ ${divisor} = ${quotient}.`,
        answer: quotient,
      },
    ],
    wrapUp: `${dividend} ÷ ${divisor} = ${quotient}.`,
  };
}

function makeSquareDerivedProblem(): Problem {
  const n = randInt(2, 10);
  const dividend = n * n;
  return {
    title: "Square facts",
    bucket: "squareDerived",
    story: `${dividend} ÷ ${n} = ?`,
    visual: () => null,
    steps: [
      {
        kind: "number",
        prompt: `${dividend} ÷ ${n} = ?`,
        hint: `Think: ${n} × ? = ${dividend}. This one's a square fact — both numbers are the same.`,
        explain: `${dividend} ÷ ${n} = ${n}, since ${n} × ${n} = ${dividend}.`,
        answer: n,
      },
    ],
    wrapUp: `${dividend} ÷ ${n} = ${n}.`,
  };
}

/** Near-miss confusion check: distinguishing a SWAPPED fact (same dividend,
 *  divisor/quotient roles traded) from an ADJACENT, genuinely different fact
 *  (same divisor, one group more or fewer) — per the plan's own example
 *  (48÷6=8 vs 48÷8=6, vs 42÷6=7). */
function makeNearMissProblem(): Problem {
  const divisor = randInt(3, 9);
  let quotient = randInt(3, 9);
  while (quotient === divisor) quotient = randInt(3, 9);
  const dividend = divisor * quotient;
  const adjQuotient = quotient - 1;
  const adjDividend = dividend - divisor;
  return {
    title: "Near-miss facts: don't mix them up",
    bucket: "nearMiss",
    story: `${dividend} ÷ ${divisor} = ?`,
    visual: () => null,
    steps: [
      {
        kind: "number",
        prompt: `${dividend} ÷ ${divisor} = ?`,
        hint: `Think: ${divisor} × ? = ${dividend}.`,
        explain: `${dividend} ÷ ${divisor} = ${quotient}.`,
        answer: quotient,
      },
      choice(
        {
          prompt: `Which of these is ALSO a true fact, with the divisor and quotient swapped?`,
          hint: `${dividend} ÷ ${divisor} = ${quotient} means ${divisor} × ${quotient} = ${dividend} — what's the other way to write that as a division fact?`,
          explain: `${dividend} ÷ ${quotient} = ${divisor} is the swapped version — same dividend, same two numbers, just trading which one is the divisor.`,
        },
        `${dividend} ÷ ${quotient} = ${divisor}`,
        [`${dividend} ÷ ${divisor} = ${divisor}`, `${adjDividend} ÷ ${divisor} = ${adjQuotient}`]
      ),
    ],
    wrapUp: `${dividend} ÷ ${divisor} = ${quotient}, and swapped, ${dividend} ÷ ${quotient} = ${divisor} — but ${adjDividend} ÷ ${divisor} = ${adjQuotient} is a totally different, adjacent fact, not the same one rearranged.`,
  };
}

function factFluencyProblem(targetBucket?: string): Problem {
  const bucket = targetBucket ?? pick(FACT_FLUENCY_BUCKETS);
  switch (bucket) {
    case "easyAnchors":
      return makeEasyAnchorProblem();
    case "midDivisors":
      return makeMidDivisorProblem();
    case "hardDivisors":
      return makeHardDivisorProblem();
    case "squareDerived":
      return makeSquareDerivedProblem();
    default:
      return makeNearMissProblem();
  }
}

export const factFluency: Unit = {
  id: "factFluency",
  title: "Division Fact Fluency",
  goal: "You will be able to quickly divide any two numbers within 100 by using the multiplication facts you know.",
  standard: "3.OA.7b",
  keyIdea: (
    <>
      <p>The faster way to divide is to think of the matching multiplication fact: for 56 ÷ 7, ask "7 times what equals 56?"</p>
      <p>Watch out for near-miss facts that use the same numbers in a different way — 48 ÷ 6 = 8 is not the same fact as 48 ÷ 8 = 6, even though both are true.</p>
    </>
  ),
  Explore,
  // No required intro — per the plan, this unit is pure extended practice on
  // the unknown-factor strategy Unit 2 already taught, not a new concept.
  // reintroEverySolved was considered (the plan calls fact fluency a
  // memorization target worth periodically re-checking) but is only ever
  // meaningful alongside requiresIntro: true — with requiresIntro left
  // false, UnitView's introSatisfied short-circuits to always-true and the
  // field would be silently inert dead code. Same resolution
  // MK2_AdditionSubtractionAndTeenNumbersLab's build already established for
  // this exact engine conflict (see MATH_TSX_STYLE_GUIDE.txt's note on it) —
  // omitted rather than set.
  problems: [{ label: "Quick Facts", make: factFluencyProblem, buckets: FACT_FLUENCY_BUCKETS }],
  requiredBuckets: FACT_FLUENCY_BUCKETS,
  test: factFluencyTest,
};
