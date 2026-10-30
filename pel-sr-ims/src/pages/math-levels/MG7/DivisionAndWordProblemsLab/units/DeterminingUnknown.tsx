import { useState } from "react";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { FixedCFU, type CfuQuestion } from "./cfu";
import { determiningUnknownTest } from "./DeterminingUnknownTest";

export const DETERMINING_UNKNOWN_BUCKETS = ["unknownProduct", "unknownFactorSecond", "unknownFactorFirst", "unknownDivision", "nonStandardForm"];

// ============================================================================
// EXPLORE
// ============================================================================

function EquationExplore() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c = a * b;
  const [blank, setBlank] = useState<"a" | "b" | "c">("c");
  const render = (slot: "a" | "b" | "c", val: number) => (blank === slot ? "?" : String(val));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="a" value={a} min={2} max={9} onChange={setA} tone="a" />
        <Stepper label="b" value={b} min={2} max={9} onChange={setB} tone="b" />
      </div>
      <div className="control-row" style={{ flexWrap: "wrap" }}>
        {(["a", "b", "c"] as const).map((slot) => (
          <button key={slot} type="button" className={`choice${blank === slot ? " on" : ""}`} onClick={() => setBlank(slot)}>
            Blank out {slot === "c" ? "the product" : `factor ${slot}`}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 26, fontWeight: 700, textAlign: "center", fontFamily: "'Courier New', monospace" }}>
        {render("a", a)} × {render("b", b)} = {render("c", c)}
      </p>
      <p className="muted small">
        No matter which number is missing, the relationship between a, b, and c never changes — you can always find the blank using the
        other two.
      </p>
    </div>
  );
}

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    kind: "sentence",
    before: "In 12 = ? × 4, the missing number is a",
    blank1: { choices: ["factor", "product", "quotient"], correct: 0 },
    mid: ", and it equals",
    blank2: { choices: ["3", "4", "48"], correct: 0 },
    after: ".",
    correctExplain: "Right — it's one of the two numbers being multiplied (a factor), and 3 × 4 = 12, so it's 3. The product, 12, is already given — it just happens to be on the left.",
  },
  {
    kind: "choice",
    prompt: <>What is the missing number in "? × 4 = 12"?</>,
    choices: ["3", "48", "8"],
    correct: 0,
    correctExplain: "Right — 3 × 4 = 12.",
    wrongExplain: "Remember, the unknown can be in the FIRST position too — think 12 ÷ 4 to find it.",
  },
  {
    kind: "choice",
    prompt: <>True or False: The answer to an equation always comes right after the equals sign, like in "3 × 4 = ?".</>,
    choices: ["True", "False"],
    correct: 1,
    correctExplain: 'False — an equation can be written "12 = 3 × ?" with the unknown on the left side of the equals sign, and it still works the same way.',
    wrongExplain: 'Try solving "12 = 3 × ?" — is the missing number still 4, even though it comes before the equals sign?',
  },
  {
    kind: "choice",
    prompt: <>What is the missing number in "24 ÷ ? = 6"?</>,
    choices: ["4", "144", "30"],
    correct: 0,
    correctExplain: "Right — 24 ÷ 4 = 6, so the missing divisor is 4.",
    wrongExplain: "Think: what number times 6 gives 24?",
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
      {(introActive || showCheck) && <FixedCFU title="Quick check: the unknown can be anywhere." questions={CFU_QUESTIONS} onComplete={onIntroDone} />}
      <EquationExplore />
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — determiningUnknown
// ============================================================================

/**
 * Second step shared by every bucket whose first step is a single blank:
 * "which multiplication fact checks your answer?" — reinforces that every
 * one of these equations, whatever its shape, is the same three-number
 * relationship. Distractors are named mistakes: ADDING the two factors
 * instead of multiplying, and multiplying the product by a factor (treating
 * the biggest number as something to multiply again rather than as the
 * product).
 */
function checkFact(f1: number, f2: number, product: number) {
  return choice(
    {
      prompt: "Which multiplication fact checks your answer?",
      hint: "Put your answer back in — the two factors multiplied should give the product.",
      explain: `${f1} × ${f2} = ${product} — all three numbers fit, so the answer checks out.`,
    },
    `${f1} × ${f2} = ${product}`,
    [`${f1} + ${f2} = ${f1 + f2}`, `${product} × ${f1} = ${product * f1}`]
  );
}

function makeUnknownProductProblem(): Problem {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = a * b;
  return {
    title: "Find the product",
    bucket: "unknownProduct",
    story: `${a} × ${b} = ?`,
    visual: () => null,
    steps: [{ kind: "number", prompt: `${a} × ${b} = ?`, hint: "Multiply the two factors.", explain: `${a} × ${b} = ${c}.`, answer: c }, checkFact(a, b, c)],
    wrapUp: `${a} × ${b} = ${c}.`,
  };
}

function makeUnknownFactorSecondProblem(): Problem {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = a * b;
  return {
    title: "Find the second factor",
    bucket: "unknownFactorSecond",
    story: `${a} × ? = ${c}`,
    visual: () => null,
    steps: [
      { kind: "number", prompt: `${a} × ? = ${c}`, hint: `Think: ${c} ÷ ${a}.`, explain: `${a} × ${b} = ${c}, so the missing factor is ${b}.`, answer: b },
      choice(
        { prompt: "Which operation did you use to find the missing factor?", hint: "You had the product and one factor.", explain: `Dividing the product by the known factor (${c} ÷ ${a}) finds the missing one.` },
        "Division",
        ["Multiplication", "Addition"]
      ),
    ],
    wrapUp: `${a} × ${b} = ${c}.`,
  };
}

function makeUnknownFactorFirstProblem(): Problem {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = a * b;
  return {
    title: "Find the first factor",
    bucket: "unknownFactorFirst",
    story: `? × ${b} = ${c}`,
    visual: () => null,
    steps: [
      { kind: "number", prompt: `? × ${b} = ${c}`, hint: `Think: ${c} ÷ ${b}.`, explain: `${a} × ${b} = ${c}, so the missing factor is ${a}.`, answer: a },
      choice(
        { prompt: "Does it matter that the unknown is in the FIRST position this time, instead of the second?", hint: "Try the same division either way.", explain: "No — the unknown factor is found the same way (dividing the product by the known factor) no matter which position it's in." },
        "No — the method is exactly the same either way",
        ["Yes — a first-position unknown needs a different method"]
      ),
    ],
    wrapUp: `${a} × ${b} = ${c}.`,
  };
}

function makeUnknownDivisionProblem(): Problem {
  const divisorUnknown = Math.random() < 0.5;
  const b = randInt(2, 9);
  const q = randInt(2, 9);
  const dividend = b * q;
  if (divisorUnknown) {
    return {
      title: "Find the missing divisor",
      bucket: "unknownDivision",
      story: `${dividend} ÷ ? = ${q}`,
      visual: () => null,
      steps: [{ kind: "number", prompt: `${dividend} ÷ ? = ${q}`, hint: `Think: ${dividend} ÷ ${q}.`, explain: `${dividend} ÷ ${b} = ${q}, so the missing divisor is ${b}.`, answer: b }, checkFact(b, q, dividend)],
      wrapUp: `${dividend} ÷ ${b} = ${q}.`,
    };
  }
  return {
    title: "Find the missing dividend",
    bucket: "unknownDivision",
    story: `? ÷ ${b} = ${q}`,
    visual: () => null,
    steps: [{ kind: "number", prompt: `? ÷ ${b} = ${q}`, hint: `Think: ${b} × ${q}.`, explain: `${dividend} ÷ ${b} = ${q}, so the missing dividend is ${dividend}.`, answer: dividend }, checkFact(b, q, dividend)],
    wrapUp: `${dividend} ÷ ${b} = ${q}.`,
  };
}

/** Non-standard equation forms: unknown on the left of "=", or product-first
 *  ordering — breaks the "the answer always comes right after =" misconception. */
function makeNonStandardFormProblem(): Problem {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = a * b;
  const form = pick(["productLeft", "factorLeftMult", "quotientLeftDiv"] as const);
  if (form === "productLeft") {
    return {
      title: "The unknown can come first",
      bucket: "nonStandardForm",
      story: `? = ${a} × ${b}`,
      visual: () => null,
      steps: [{ kind: "number", prompt: `? = ${a} × ${b}`, hint: "Multiply, even though the blank comes first.", explain: `${a} × ${b} = ${c}, so the missing number is ${c}.`, answer: c }, checkFact(a, b, c)],
      wrapUp: `${c} = ${a} × ${b}.`,
    };
  }
  if (form === "factorLeftMult") {
    return {
      title: "The unknown can come first",
      bucket: "nonStandardForm",
      story: `${c} = ${a} × ?`,
      visual: () => null,
      steps: [{ kind: "number", prompt: `${c} = ${a} × ?`, hint: `Think: ${c} ÷ ${a}, even though the product is written first.`, explain: `${a} × ${b} = ${c}, so the missing factor is ${b}.`, answer: b }, checkFact(a, b, c)],
      wrapUp: `${c} = ${a} × ${b}.`,
    };
  }
  return {
    title: "The unknown can come first",
    bucket: "nonStandardForm",
    story: `${b} = ${c} ÷ ?`,
    visual: () => null,
    steps: [{ kind: "number", prompt: `${b} = ${c} ÷ ?`, hint: `Think: ${c} ÷ ${b}, even though it's written with the quotient first.`, explain: `${c} ÷ ${a} = ${b}, so the missing divisor is ${a}.`, answer: a }, checkFact(a, b, c)],
    wrapUp: `${b} = ${c} ÷ ${a}.`,
  };
}

function determiningUnknownProblem(targetBucket?: string): Problem {
  const bucket = targetBucket ?? pick(DETERMINING_UNKNOWN_BUCKETS);
  switch (bucket) {
    case "unknownProduct":
      return makeUnknownProductProblem();
    case "unknownFactorSecond":
      return makeUnknownFactorSecondProblem();
    case "unknownFactorFirst":
      return makeUnknownFactorFirstProblem();
    case "unknownDivision":
      return makeUnknownDivisionProblem();
    default:
      return makeNonStandardFormProblem();
  }
}

export const determiningUnknown: Unit = {
  id: "determiningUnknown",
  title: "Determining the Unknown",
  goal: "You will be able to find the missing number in a multiplication or division equation, no matter which position it's in.",
  standard: "3.OA.4",
  keyIdea: (
    <>
      <p>A multiplication or division equation always relates three numbers. No matter which one is missing — and no matter which side of the equals sign it's on — you can find it from the other two.</p>
      <p>"? × 4 = 12" and "12 = ? × 4" ask for the exact same missing number: 3.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Find the Unknown", make: determiningUnknownProblem, buckets: DETERMINING_UNKNOWN_BUCKETS }],
  requiredBuckets: DETERMINING_UNKNOWN_BUCKETS,
  test: determiningUnknownTest,
};
