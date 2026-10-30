import { useState } from "react";
import { FactFamilyTriangle } from "../diagrams/FactFamily";
import { EqualGroups } from "../diagrams/EqualGroups";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { FixedCFU, type CfuQuestion } from "./cfu";
import { unknownFactorTest } from "./UnknownFactorTest";

export const UNKNOWN_FACTOR_BUCKETS = ["deriveBoth", "findUnknownFactor", "squareFact", "noWholeNumberPartner"];

// ============================================================================
// A brief, self-contained one-digit-fact refresher — this lab's Units 2/3
// lean on one-digit multiplication facts as a prerequisite (per the plan),
// but a sibling build (MultiplicationFoundationsLab, same MG7 slot) might not
// have finished yet in this concurrent round. Rather than assume those facts
// are already solid, this small reference table is embedded directly in
// Explore so a student can check any fact 2-9 x 2-9 on the spot.
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
// EXPLORE
// ============================================================================

function FactFamilyExplore() {
  const [a, setA] = useState(6);
  const [b, setB] = useState(7);
  const c = a * b;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Factor A" value={a} min={2} max={9} onChange={setA} tone="a" />
        <Stepper label="Factor B" value={b} min={2} max={9} onChange={setB} tone="b" />
      </div>
      <FactFamilyTriangle a={a} b={b} c={c} tone="a" />
      <p className="muted small">
        Every multiplication fact is also two division facts (or just one, when the two factors match) — think of division as "what's the
        missing factor?"
      </p>
      <FactsReference />
    </div>
  );
}

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    kind: "choice",
    prompt: <>If 6 × 7 = 42, which pair of division facts come from that same fact family?</>,
    choices: ["42 ÷ 6 = 7 and 42 ÷ 7 = 6", "42 ÷ 6 = 8 and 42 ÷ 7 = 5", "6 ÷ 42 = 7 and 7 ÷ 42 = 6"],
    correct: 0,
    correctExplain: "Right — the same three numbers (6, 7, 42) relate both ways: 42 ÷ 6 = 7 and 42 ÷ 7 = 6.",
    wrongExplain: "Not quite — a fact family always uses the SAME three numbers as the multiplication fact it came from.",
  },
  {
    kind: "choice",
    prompt: <>True or False: Multiplication facts and division facts are two totally separate things you have to memorize on their own.</>,
    choices: ["True", "False"],
    correct: 1,
    correctExplain: "False — a division fact is just a multiplication fact with a different number missing. Knowing one helps you find the other.",
    wrongExplain: "Think about the fact family triangle — does knowing 6 × 7 = 42 help you with 42 ÷ 7 too?",
  },
  {
    kind: "choice",
    prompt: <>6 × 6 = 36 is a square fact (both factors are the same). How many DIFFERENT division facts does this one multiplication fact make?</>,
    choices: ["1", "2"],
    correct: 0,
    correctExplain: "Right — since both factors are 6, there's only one way to write it: 36 ÷ 6 = 6. A square fact only makes one division fact, not two.",
    wrongExplain: "Try writing out 36 ÷ 6 = ? both ways — do you actually get two different equations, or the same one twice?",
  },
  {
    kind: "choice",
    prompt: <>True or False: Every division problem has a whole-number "missing factor" partner — for example, 25 ÷ 4 should have one.</>,
    choices: ["True", "False"],
    correct: 1,
    correctExplain: "False — there's no whole number you can multiply by 4 to get exactly 25 (4×6=24, 4×7=28), so 25 ÷ 4 has no whole-number unknown-factor partner. It leaves a remainder instead.",
    wrongExplain: "Try it: is there a whole number that, times 4, equals exactly 25?",
  },
];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && (
        <button type="button" className="btn ghost" style={{ width: "fit-content" }} onClick={() => setShowCheck((v) => !v)}>
          Quick Check
        </button>
      )}
      {(introActive || showCheck) && <FixedCFU title="Quick check: division as a missing factor." questions={CFU_QUESTIONS} onComplete={onIntroDone} />}
      <FactFamilyExplore />
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — unknownFactor
// ============================================================================

function makeDeriveBothProblem(): Problem {
  const a = randInt(2, 9);
  let b = randInt(2, 9);
  while (a === b) b = randInt(2, 9); // distinct factors, so two genuinely different division facts exist
  const c = a * b;
  return {
    title: "One fact, two division facts",
    bucket: "deriveBoth",
    story: `You know ${a} × ${b} = ${c}. Use that same fact family to find both division facts.`,
    visual: (done) => <FactFamilyTriangle a={a} b={b} c={c} unknown={done < 1 ? "b" : done < 2 ? "a" : "none"} tone="a" />,
    steps: [
      {
        kind: "number",
        prompt: `${c} ÷ ${a} = ?`,
        hint: `Think: ${a} × ? = ${c}.`,
        explain: `${c} ÷ ${a} = ${b}, since ${a} × ${b} = ${c}.`,
        answer: b,
      },
      {
        kind: "number",
        prompt: `${c} ÷ ${b} = ?`,
        hint: `Think: ${b} × ? = ${c}.`,
        explain: `${c} ÷ ${b} = ${a}, since ${b} × ${a} = ${c}.`,
        answer: a,
      },
    ],
    wrapUp: `${a} × ${b} = ${c} gives both ${c} ÷ ${a} = ${b} and ${c} ÷ ${b} = ${a}.`,
  };
}

function makeFindUnknownFactorProblem(): Problem {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = a * b;
  const missingFirst = Math.random() < 0.5;
  return {
    title: "Find the missing factor",
    bucket: "findUnknownFactor",
    story: missingFirst ? `? × ${b} = ${c}, so ${c} ÷ ${b} = ?` : `${a} × ? = ${c}, so ${c} ÷ ${a} = ?`,
    visual: (done) => <FactFamilyTriangle a={a} b={b} c={c} unknown={done < 1 ? (missingFirst ? "a" : "b") : "none"} tone="b" />,
    steps: [
      {
        kind: "number",
        prompt: missingFirst ? `? × ${b} = ${c}. What number goes in the blank?` : `${a} × ? = ${c}. What number goes in the blank?`,
        hint: missingFirst ? `${c} ÷ ${b} is the same question.` : `${c} ÷ ${a} is the same question.`,
        explain: missingFirst ? `${a} × ${b} = ${c}, so the missing factor is ${a}.` : `${a} × ${b} = ${c}, so the missing factor is ${b}.`,
        answer: missingFirst ? a : b,
      },
      choice(
        {
          prompt: `Which division fact asks the exact same question?`,
          hint: "Divide the product by the factor you already know.",
          explain: missingFirst ? `${c} ÷ ${b} = ${a} — the same fact family, written as division.` : `${c} ÷ ${a} = ${b} — the same fact family, written as division.`,
        },
        missingFirst ? `${c} ÷ ${b} = ${a}` : `${c} ÷ ${a} = ${b}`,
        // Named mistake: dividing the known factor by the product (backwards),
        // and multiplying the two given numbers instead of dividing.
        missingFirst ? [`${b} ÷ ${c} = ${a}`, `${c} × ${b} = ${c * b}`] : [`${a} ÷ ${c} = ${b}`, `${c} × ${a} = ${c * a}`]
      ),
    ],
    wrapUp: `The missing factor is ${missingFirst ? a : b} — finding a missing factor IS division.`,
  };
}

function makeSquareFactProblem(): Problem {
  const a = randInt(2, 9);
  const c = a * a;
  return {
    title: "Square facts: only one partner",
    bucket: "squareFact",
    story: `${a} × ${a} = ${c}. Since both factors are the same, this fact family only makes ONE division fact.`,
    visual: (done) => <FactFamilyTriangle a={a} b={a} c={c} unknown={done < 1 ? "a" : "none"} tone="c" />,
    steps: [
      {
        kind: "number",
        prompt: `${c} ÷ ${a} = ?`,
        hint: `Think: ${a} × ? = ${c}.`,
        explain: `${c} ÷ ${a} = ${a}.`,
        answer: a,
      },
      choice(
        {
          prompt: `How many DIFFERENT division facts does ${a} × ${a} = ${c} create?`,
          hint: "Try writing the division fact both ways — do you get two different equations?",
          explain: `Only 1 — since both factors are ${a}, ${c} ÷ ${a} = ${a} is the only division fact, not two.`,
        },
        "1",
        ["2", "0"]
      ),
    ],
    wrapUp: `${a} × ${a} = ${c} makes just one division fact: ${c} ÷ ${a} = ${a}.`,
  };
}

function makeNoWholeNumberPartnerProblem(): Problem {
  const divisor = randInt(3, 9);
  let dividend = 0;
  let remainder = 0;
  do {
    dividend = randInt(divisor + 1, divisor * 9 + divisor - 1);
    remainder = dividend % divisor;
  } while (remainder === 0);
  const lowerMultiple = dividend - remainder;
  const lowerFactor = lowerMultiple / divisor;
  const upperFactor = lowerFactor + 1;
  const upperMultiple = upperFactor * divisor;
  return {
    title: "When there's no whole-number partner",
    bucket: "noWholeNumberPartner",
    story: `Is there a whole number you can multiply by ${divisor} to get exactly ${dividend}?`,
    visual: (done) =>
      // The grouped picture (with its "N left over" caption) only appears once
      // both steps are done, so it can't give the remainder step away.
      done < 2 ? (
        <p className="muted small">
          {divisor} × {lowerFactor} = {lowerMultiple}, and {divisor} × {upperFactor} = {upperMultiple} — {dividend} falls between them.
        </p>
      ) : (
        <EqualGroups total={dividend} groups={lowerFactor} layout="boxes" tone="b" leftover={remainder} groupWord="group" itemWord="item" />
      ),
    steps: [
      choice(
        {
          prompt: `Does ${dividend} ÷ ${divisor} have a whole-number "missing factor" partner?`,
          hint: `Check nearby multiples of ${divisor}: ${lowerMultiple} and ${upperMultiple}.`,
          explain: `No — ${divisor} × ${lowerFactor} = ${lowerMultiple} and ${divisor} × ${upperFactor} = ${upperMultiple}, and ${dividend} is between them, not equal to either. There's a remainder of ${remainder}.`,
        },
        "No — no whole number times " + divisor + " equals exactly " + dividend,
        [`Yes — ${lowerFactor} × ${divisor} = ${dividend}`, "Yes — every division problem has one"]
      ),
      {
        kind: "number",
        prompt: `${divisor} × ${lowerFactor} = ${lowerMultiple} is the closest fact that doesn't go over. How many are left over from ${dividend}?`,
        hint: `${dividend} − ${lowerMultiple} = ?`,
        explain: `${dividend} − ${lowerMultiple} = ${remainder} left over — that's why ${dividend} ÷ ${divisor} isn't a whole-number fact.`,
        answer: remainder,
      },
    ],
    wrapUp: `${dividend} ÷ ${divisor} has no whole-number unknown-factor partner — it leaves a remainder of ${remainder}.`,
  };
}

function unknownFactorProblem(targetBucket?: string): Problem {
  const bucket = targetBucket ?? pick(UNKNOWN_FACTOR_BUCKETS);
  switch (bucket) {
    case "deriveBoth":
      return makeDeriveBothProblem();
    case "findUnknownFactor":
      return makeFindUnknownFactorProblem();
    case "squareFact":
      return makeSquareFactProblem();
    default:
      return makeNoWholeNumberPartnerProblem();
  }
}

function Preview() {
  return <FactFamilyTriangle a={6} b={7} c={42} tone="a" />;
}

export const unknownFactor: Unit = {
  id: "unknownFactor",
  title: "Division as an Unknown-Factor Problem",
  goal: "You will be able to solve a division fact by thinking 'what number times the divisor gives me the dividend?' using a fact family.",
  standard: "3.OA.6",
  keyIdea: (
    <>
      <p>Division and multiplication are the same relationship, viewed two ways: 4 × 7 = 28, so 28 ÷ 7 = 4 and 28 ÷ 4 = 7.</p>
      <p>A square fact (like 6 × 6 = 36) only makes ONE division fact, not two — and some division problems (like 25 ÷ 4) have no whole-number missing-factor partner at all.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [{ label: "Missing Factor", make: unknownFactorProblem, buckets: UNKNOWN_FACTOR_BUCKETS }],
  requiredBuckets: UNKNOWN_FACTOR_BUCKETS,
  test: unknownFactorTest,
};
