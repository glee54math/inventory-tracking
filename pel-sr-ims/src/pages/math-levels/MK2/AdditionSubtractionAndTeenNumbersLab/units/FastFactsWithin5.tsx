import { useState } from "react";
import { SplitGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { fastFactsWithin5Test } from "./FastFactsWithin5Test";

// ============================================================================
// EXPLORE
// ============================================================================
// No Check-for-Understanding gate (per this unit's plan) — this is fluency
// PRACTICE on concepts already gated in Unit 1 (modeling add/subtract) and
// Unit 3 (decomposing), not a new concept.

type Mode = "add" | "sub" | "doubles" | "missing";

function Explore() {
  const [mode, setMode] = useState<Mode>("add");
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const maxB = mode === "add" || mode === "missing" ? Math.max(0, 5 - a) : 5;

  const total = mode === "doubles" ? a + a : a + b;
  const diff = mode === "sub" ? a - Math.min(b, a) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="Fact type"
          value={mode}
          onChange={setMode}
          options={[
            { id: "add", label: "Addition" },
            { id: "sub", label: "Subtraction" },
            { id: "doubles", label: "Doubles" },
            { id: "missing", label: "Missing addend" },
          ]}
        />
      </div>
      {mode !== "doubles" && (
        <div className="control-row">
          <Stepper label={mode === "sub" ? "Start" : mode === "missing" ? "Known part" : "First number"} value={a} min={mode === "sub" ? 1 : 0} max={5} step={1} onChange={setA} tone="a" />
          {mode !== "missing" && <Stepper label="Second number" value={b} min={0} max={maxB} step={1} onChange={setB} tone="b" />}
        </div>
      )}
      {mode === "doubles" && (
        <div className="control-row">
          <Stepper label="Number" value={a} min={1} max={2} step={1} onChange={setA} tone="a" />
        </div>
      )}

      {mode === "add" && (
        <>
          <SplitGroup total={total} partA={a} toneA="a" toneB="b" />
          <p className="feedback good">{a} + {b} = {total}. Try to just KNOW this fact instantly, without counting each dot one at a time.</p>
        </>
      )}
      {mode === "sub" && (
        <>
          <SplitGroup total={a} partA={diff} toneA="a" toneB="b" />
          <p className="feedback good">{a} − {Math.min(b, a)} = {diff}.</p>
        </>
      )}
      {mode === "doubles" && (
        <>
          <SplitGroup total={a + a} partA={a} toneA="a" toneB="a" showDivider={false} />
          <p className="feedback good">{a} + {a} = {a + a} — a "doubles" fact, where both parts are the exact same number.</p>
        </>
      )}
      {mode === "missing" && (
        <>
          <SplitGroup total={5} partA={a} toneA="a" toneB="b" />
          <p className="feedback good">{a} + ? = 5. The missing number is {5 - a}.</p>
        </>
      )}
      <p className="muted small">
        Every fact here has an answer of 5 or less. The goal of this unit is SPEED — recognizing the answer instantly, the same way you already know
        your age without counting it out on your fingers.
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "additionWithin5" | "subtractionWithin5" | "doublesWithin5" | "missingAddendWithin5";
const BUCKETS: Bucket[] = ["additionWithin5", "subtractionWithin5", "doublesWithin5", "missingAddendWithin5"];

function fastFactsProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "additionWithin5") {
    const a = randInt(0, 5);
    const b = randInt(0, 5 - a);
    const sum = a + b;
    const isDoubles = a === b;
    return {
      title: "Fast fact: addition",
      bucket,
      story: `What is ${a} + ${b}?`,
      visual: () => <SplitGroup total={sum} partA={a} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "You should know this fact without counting it out.", explain: `${a} + ${b} = ${sum}.`, answer: sum },
        choice(
          { prompt: `Is ${a} + ${b} a "doubles" fact (both numbers the same)?`, hint: "A doubles fact has the exact same number added to itself.", explain: isDoubles ? `Yes — ${a} and ${b} are the same number.` : `No — ${a} and ${b} are different numbers.` },
          isDoubles ? "Yes" : "No",
          [isDoubles ? "No" : "Yes"]
        ),
      ],
      wrapUp: `${a} + ${b} = ${sum}.`,
    };
  }

  if (bucket === "subtractionWithin5") {
    const minuend = randInt(1, 5);
    const b = randInt(0, minuend);
    const diff = minuend - b;
    return {
      title: "Fast fact: subtraction",
      bucket,
      story: `What is ${minuend} − ${b}?`,
      visual: () => <SplitGroup total={minuend} partA={diff} toneA="a" toneB="b" />,
      steps: [
        { kind: "number", prompt: `What is ${minuend} − ${b}?`, hint: "You should know this fact without counting it out.", explain: `${minuend} − ${b} = ${diff}.`, answer: diff },
        choice(
          { prompt: "Which addition fact matches this subtraction fact?", hint: "Subtraction and addition facts come in families — the difference plus the amount subtracted gives back the start.", explain: `${b} + ${diff} = ${minuend}, so ${minuend} − ${b} = ${diff}.` },
          `${b} + ${diff} = ${minuend}`,
          [`${minuend} + ${b} = ${diff}`] // misconception: adding the wrong two numbers in the fact family
        ),
      ],
      wrapUp: `${minuend} − ${b} = ${diff}.`,
    };
  }

  if (bucket === "doublesWithin5") {
    const n = randInt(1, 2); // 3+3=6 exceeds 5, so only 1+1 and 2+2 fit "within 5"
    const sum = n + n;
    return {
      title: "Fast fact: doubles",
      bucket,
      story: `What is ${n} + ${n}?`,
      visual: () => <SplitGroup total={sum} partA={n} toneA="a" toneB="a" showDivider={false} />,
      steps: [
        { kind: "number", prompt: `What is ${n} + ${n}?`, hint: "A doubles fact — both parts are the same.", explain: `${n} + ${n} = ${sum}.`, answer: sum },
        { kind: "number", prompt: `What is one MORE than ${sum} (that is, ${n} + ${n} + 1)?`, hint: "Add one more to the doubles fact you just found.", explain: `${sum} + 1 = ${sum + 1}.`, answer: sum + 1 },
      ],
      wrapUp: `${n} + ${n} = ${sum}.`,
    };
  }

  // missingAddendWithin5 — same fact family, different unknown position.
  const sum = randInt(1, 5);
  const a = randInt(0, sum);
  const missing = sum - a;
  return {
    title: "Fast fact: missing addend",
    bucket,
    story: `${a} + ? = ${sum}.`,
    visual: () => <SplitGroup total={sum} partA={a} toneA="a" toneB="b" />,
    steps: [
      { kind: "number", prompt: `${a} + ? = ${sum}. What number is missing?`, hint: "What number joins with the first one to reach the total?", explain: `${a} + ${missing} = ${sum}.`, answer: missing },
      choice(
        { prompt: "Which number sentence also shows this fact?", hint: "Addition facts work in either order.", explain: `${missing} + ${a} = ${sum}, same as ${a} + ${missing} = ${sum}.` },
        `${missing} + ${a} = ${sum}`,
        [`${sum} + ${a} = ${missing}`] // misconception: placing the total in the wrong position
      ),
    ],
    wrapUp: `${a} + ${missing} = ${sum}.`,
  };
}

export const fastFactsWithin5: Unit = {
  id: "fastFactsWithin5",
  title: "Fast Facts Within 5",
  goal: "Quickly add or subtract any two numbers when the answer is 5 or less, without counting it out.",
  standard: "K.OA.5",
  keyIdea: (
    <>
      <p>Every fact in this unit has an answer of 5 or less — the goal is SPEED, instantly knowing the answer instead of counting it out every time.</p>
      <p>Doubles facts (1+1, 2+2) and missing-addend facts (2 + ? = 5) are the same ideas you already know, just asked a different way.</p>
    </>
  ),
  Explore,
  // No required intro: this is fluency practice directly on concepts already
  // gated in Unit 1 (modeling add/subtract) and Unit 3 (decomposing), with no
  // new concept of its own. The plan calls for periodic re-checking since
  // K.OA.5's "fluently" specifically means memorized/automatic recall, not
  // re-derivation — but Unit.reintroEverySolved is only meaningful alongside
  // requiresIntro: true (see shared/units/types.ts's own doc comment; when
  // requiresIntro is false, UnitView's introSatisfied short-circuits to
  // always-true, so reintroEverySolved would be silently inert dead code,
  // not actually re-gate anything). Rather than set a field that does
  // nothing, this was left off — enabling real periodic re-checking without
  // an initial required gate would need an engine change to UnitView's
  // gating logic, out of scope for this lab's own folder. Documented as an
  // autonomous decision in the build report.
  problems: [{ label: "Fast Facts", make: fastFactsProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: fastFactsWithin5Test,
};
