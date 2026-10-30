import { useEffect, useState } from "react";
import { EqualGroups } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { evenNumbersAsEqualAddendsTest } from "./EvenNumbersAsEqualAddendsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions targeting the plan's two named misconceptions:
// (1) thinking ANY two addends that sum to the target count as "equal
// addends" (ignoring that both addends must be identical), and (2) trying to
// force an odd number into two equal whole-number addends.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary question a rote "sum to the target" drill never asks
 *  directly: what EQUAL addends actually requires. */
function WhatAreEqualAddendsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "both";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What makes two addends "equal addends" for a number?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="sum">They add up to the number — any two addends that work</option>
          <option value="both">They are the exact SAME number as each other, AND together they add up to the target</option>
          <option value="bigger">One of them has to be bigger than the other</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — equal addends must be the exact same number as each other, not just any two numbers that happen to add to the target."
            : "Not quite — equal addends must be the SAME number as each other AND add up to the target. Just summing to the right total isn't enough on its own."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated adjacent concept: a wrong example and a right example
 *  for the SAME number, side by side. */
function RightAndWrongExampleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [wrongOk, setWrongOk] = useState("");
  const [rightOk, setRightOk] = useState("");
  const [checked, setChecked] = useState(false);
  const ok1 = wrongOk === "no";
  const ok2 = rightOk === "yes";
  const ok = ok1 && ok2;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> For the number 14: is "14 = 6 + 8" an example of equal addends? Is "14 = 7 + 7" an example of equal addends?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          14 = 6 + 8:{" "}
          <select className="answer" value={wrongOk} onChange={(e) => setWrongOk(e.target.value)} style={fieldOk(ok1, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes, equal addends</option>
            <option value="no">No, not equal addends</option>
          </select>
        </label>
        <label>
          14 = 7 + 7:{" "}
          <select className="answer" value={rightOk} onChange={(e) => setRightOk(e.target.value)} style={fieldOk(ok2, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes, equal addends</option>
            <option value="no">No, not equal addends</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 6 + 8 sums to 14 but the addends aren't the same, so it's NOT equal addends. 7 + 7 sums to 14 AND both addends match, so it IS."
            : "Not quite — 6 + 8 = 14 is true, but 6 ≠ 8, so it's not equal addends. 7 + 7 = 14 with matching addends IS equal addends."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: NOT every number can be split into two
 *  equal whole-number addends — the plan's explicit odd-number trap. */
function EveryNumberTrueFalseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: every whole number can be written as two equal whole-number addends.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — false. Odd numbers (like 9) can't be split into two equal whole-number addends — there's always one left over."
            : "Not quite — it's false. Only EVEN numbers can be split into two equal whole-number addends. Odd numbers always have one left over."}
        </p>
      )}
    </div>
  );
}

/** Multi-part question: walks through WHY an odd number fails, then checks
 *  the generalization explicitly. */
function OddNumberAttemptQuestion({ onComplete }: { onComplete?: () => void }) {
  const [attempt, setAttempt] = useState("");
  const [canEvery, setCanEvery] = useState("");
  const [checked, setChecked] = useState(false);
  const ok1 = attempt === "unequal";
  const ok2 = canEvery === "no";
  const ok = ok1 && ok2;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> 9 is odd. If you try to split 9 into two EQUAL whole-number addends, what happens? So can every odd number be written as two
        equal whole-number addends?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Trying to split 9 evenly:{" "}
          <select className="answer" value={attempt} onChange={(e) => setAttempt(e.target.value)} style={fieldOk(ok1, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="unequal">It's impossible — the closest you get is 4 + 5, which aren't equal</option>
            <option value="works">It works evenly as 4.5 + 4.5</option>
          </select>
        </label>
        <label>
          Every odd number:{" "}
          <select className="answer" value={canEvery} onChange={(e) => setCanEvery(e.target.value)} style={fieldOk(ok2, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes, always possible</option>
            <option value="no">No, never possible</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 9 can only split into 4 + 5, which aren't equal whole numbers. No odd number can ever be written as two equal whole-number addends."
            : "Not quite — 9 only splits into 4 + 5, and those aren't equal. That's true of every odd number: it's never possible with whole numbers."}
        </p>
      )}
    </div>
  );
}

function EqualAddendsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ what: false, example: false, every: false, odd: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's pin down exactly what "equal addends" means before you try practice problems.</p>
      <WhatAreEqualAddendsQuestion onComplete={mark("what")} />
      <RightAndWrongExampleQuestion onComplete={mark("example")} />
      <EveryNumberTrueFalseQuestion onComplete={mark("every")} />
      <OddNumberAttemptQuestion onComplete={mark("odd")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [n, setN] = useState(14);
  const half = n / 2;
  const isEven = n % 2 === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Pick a number" value={n} min={1} max={20} step={1} onChange={setN} tone="a" />
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
      {(introActive || showCheck) && <EqualAddendsCheckForUnderstanding onComplete={onIntroDone} />}

      {isEven ? (
        <>
          <EqualGroups groupA={half} groupB={n - half} sameColor />
          <p className="muted small">
            {n} splits evenly into two groups of {half}: {n} = {half} + {half}.
          </p>
        </>
      ) : (
        <>
          <EqualGroups groupA={Math.floor(n / 2)} groupB={Math.ceil(n / 2)} sameColor={false} />
          <p className="muted small">
            {n} is odd — the closest split is {Math.floor(n / 2)} + {Math.ceil(n / 2)}, and those two groups are NOT the same size. No odd number
            can be written as two equal whole-number addends.
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "smallEvenSplit" | "largerEvenSplit" | "invalidEqualAddendsTrap" | "oddNumberTrap";
const BUCKETS: Bucket[] = ["smallEvenSplit", "largerEvenSplit", "invalidEqualAddendsTrap", "oddNumberTrap"];

function equalAddendsProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "smallEvenSplit" || bucket === "largerEvenSplit") {
    const n = bucket === "smallEvenSplit" ? randInt(1, 5) * 2 : randInt(6, 10) * 2; // 2-10 or 12-20
    const half = n / 2;
    return {
      title: "Equal Addends",
      bucket,
      story: `Write ${n} as two EQUAL addends.`,
      visual: (done) => <EqualGroups groupA={half} groupB={half} sameColor={done >= 1} />,
      steps: [
        { kind: "number", prompt: `What is half of ${n}?`, hint: `Split ${n} evenly into two groups.`, explain: `Half of ${n} is ${half}.`, answer: half },
        { kind: "ratio", prompt: `Write ${n} as two equal addends.`, hint: "Both boxes need the same number.", explain: `${n} = ${half} + ${half}.`, answer: [half, half], labels: ["first addend", "second addend"], tones: "none", frame: [`${n} = `, "+", ""] },
      ],
      wrapUp: `${n} = ${half} + ${half} — two equal addends.`,
    };
  }

  if (bucket === "invalidEqualAddendsTrap") {
    // An even number split into two DIFFERENT addends that still sum
    // correctly — tests the "any addends that sum to it" misconception.
    const n = randInt(3, 10) * 2; // 6..20
    let a = randInt(1, n - 1);
    while (a === n - a) a = randInt(1, n - 1); // force a genuinely unequal split
    const b = n - a;
    const half = n / 2;
    return {
      title: "Equal Addends — is this one right?",
      bucket,
      story: `Someone wrote ${n} = ${a} + ${b}. Is that equal addends? If not, what should it be?`,
      visual: (done) => <EqualGroups groupA={done >= 1 ? half : a} groupB={done >= 1 ? half : b} sameColor={done >= 1} />,
      steps: [
        choice(
          { prompt: `Is ${n} = ${a} + ${b} an example of equal addends?`, hint: `Check whether ${a} and ${b} are the SAME number.`, explain: `${a} ≠ ${b}, so this sums correctly but isn't equal addends.` },
          "No",
          ["Yes"]
        ),
        { kind: "ratio", prompt: `Write ${n} as two addends that ARE equal.`, hint: `Half of ${n} is ${half}.`, explain: `${n} = ${half} + ${half}.`, answer: [half, half], labels: ["first addend", "second addend"], tones: "none", frame: [`${n} = `, "+", ""] },
      ],
      wrapUp: `${n} = ${a} + ${b} sums correctly, but the real equal-addends form is ${n} = ${half} + ${half}.`,
    };
  }

  // oddNumberTrap — an odd number cannot be split into two equal whole addends.
  const m = randInt(1, 9) * 2 + 1; // 3..19, odd
  const lo = Math.floor(m / 2);
  const hi = Math.ceil(m / 2);
  return {
    title: "Equal Addends — can this be done?",
    bucket,
    story: `Can ${m} be written as two EQUAL whole-number addends?`,
    visual: () => <EqualGroups groupA={lo} groupB={hi} sameColor={false} />,
    steps: [
      choice(
        { prompt: `Can ${m} be split into two EQUAL whole-number addends?`, hint: `${m} is odd — try splitting it in half.`, explain: `${m} only splits into ${lo} + ${hi}, which aren't equal — it's impossible.` },
        "No",
        ["Yes"]
      ),
      { kind: "number", prompt: `${m} is odd, so it splits as closely as possible into ${lo} + ___. What's the other (bigger) part?`, hint: `${lo} + ${hi} = ${m}.`, explain: `The closest split is ${lo} + ${hi} — still not equal.`, answer: hi },
    ],
    wrapUp: `${m} is odd, so it CANNOT be written as two equal whole-number addends — the closest you get is ${lo} + ${hi}.`,
  };
}

export const evenNumbersAsEqualAddends: Unit = {
  id: "evenNumbersAsEqualAddends",
  title: "Even Numbers as Equal Addends",
  goal: "Write an even number as two equal addends added together, like 14 = 7 + 7.",
  standard: "2.OA.3",
  keyIdea: (
    <>
      <p>Equal addends means the SAME number added to itself — not just any two numbers that sum to the target.</p>
      <p>Only EVEN numbers can be written as two equal whole-number addends. An odd number always leaves the two halves uneven.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Equal Addends", make: equalAddendsProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: evenNumbersAsEqualAddendsTest,
};
