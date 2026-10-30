import { useEffect, useState } from "react";
import { HundredChart } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { tenMoreTenLessTest } from "./TenMoreTenLessTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary / baseline: 10 more, no rollover. */
function TenMoreBaselineQuestion({ onComplete }: { onComplete?: () => void }) {
  const [val, setVal] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = val === "33";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What is 10 more than 23?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={val} onChange={(e) => setVal(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="33">33</option>
          <option value="24">24</option>
          <option value="32">32</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 10 more than 23 is 33. Only the TENS digit changed (2 -> 3); the ones digit (3) stayed exactly the same."
            : "Not quite — adding 10 only changes the tens digit. 23's ones digit (3) never moves: 10 more than 23 is 33."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated + WHY: 10 LESS, crossing all the way down to a
 *  single-digit number — the hardest case, paired with a reasoning check. */
function TenLessCrossingQuestion({ onComplete }: { onComplete?: () => void }) {
  const [val, setVal] = useState("");
  const [why, setWhy] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [val, why].every((v) => String(v).trim() !== "");
  const valOk = val === "2";
  const whyOk = why === "digit";
  const ok = valOk && whyOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> What is 10 less than 12?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Answer:{" "}
          <select className="answer" value={val} onChange={(e) => setVal(e.target.value)} style={fieldOk(valOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="2">2</option>
            <option value="11">11</option>
            <option value="22">22</option>
          </select>
        </label>
        <label>
          How did you get it?{" "}
          <select className="answer" value={why} onChange={(e) => setWhy(e.target.value)} style={fieldOk(whyOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="digit">Just changed the tens digit from 1 to 0 — no need to recount</option>
            <option value="recount">Counted backward one at a time from 12: 11, 10, 9...</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 10 less than 12 is 2. The tens digit dropped from 1 to 0 (so it disappears), and the ones digit (2) never changed. No recounting needed!"
            : "Not quite — 10 less than 12 is 2: the tens digit drops from 1 to 0, leaving just the ones digit. You never need to recount by ones to find 10 more or 10 less."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false: does +-10 EVER touch the ones digit? */
function OnesNeverChangeQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: adding or subtracting 10 from a two-digit number ALWAYS changes only the tens digit — the ones digit never changes.
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
            ? "Correct — always true. Moving by exactly 10 only ever changes the tens digit, whether you're adding or subtracting, no matter the starting number."
            : "Not quite — try a few: 23+10=33, 45-10=35, 12-10=2. The ones digit is identical every single time; only the tens digit moves."}
        </p>
      )}
    </div>
  );
}

/** A multiple-of-ten check, reinforcing that the same rule scales up. */
function SubtractMultipleOfTenQuestion({ onComplete }: { onComplete?: () => void }) {
  const [val, setVal] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = val === "40";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> What is 70 minus 30?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={val} onChange={(e) => setVal(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="40">40</option>
          <option value="100">100</option>
          <option value="4">4</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 70 - 30 = 40. 7 tens take away 3 tens leaves 4 tens, with 0 ones the whole time."
            : "Not quite — think of it as tens: 7 tens take away 3 tens leaves 4 tens, which is 40."}
        </p>
      )}
    </div>
  );
}

function TenMoreTenLessCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ baseline: false, crossing: false, generalization: false, multiple: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure moving by tens makes sense before you try practice problems.</p>
      <TenMoreBaselineQuestion onComplete={mark("baseline")} />
      <TenLessCrossingQuestion onComplete={mark("crossing")} />
      <OnesNeverChangeQuestion onComplete={mark("generalization")} />
      <SubtractMultipleOfTenQuestion onComplete={mark("multiple")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [start, setStart] = useState(23);
  const [tensMove, setTensMove] = useState(1);
  const result = start + tensMove * 10;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Start at" value={start} min={1} max={99} step={1} onChange={setStart} tone="a" />
        <Stepper label="Move by tens" value={tensMove} min={-3} max={3} step={1} onChange={setTensMove} tone="b" />
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
      {(introActive || showCheck) && <TenMoreTenLessCheckForUnderstanding onComplete={onIntroDone} />}

      <div style={{ fontWeight: 800, fontSize: 24 }}>
        {start} {tensMove >= 0 ? "+" : "-"} {Math.abs(tensMove) * 10} = {result >= 1 && result <= 120 ? result : "?"}
      </div>
      {result >= 1 && result <= 120 && <HundredChart marks={[{ n: start, tone: "a" }, { n: result, tone: "b" }]} />}
      <p className="muted small">
        Moving by tens always lands you in the SAME column (the ones digit never changes) — just a different row, straight up or straight down. That's true
        even when the tens digit drops all the way to 0.
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "tenMoreNoRollover" | "tenLessCrossing" | "addMultipleOfTen" | "subtractMultipleOfTen";
const BUCKETS: Bucket[] = ["tenMoreNoRollover", "tenLessCrossing", "addMultipleOfTen", "subtractMultipleOfTen"];

function tenMoreLessProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "tenMoreNoRollover") {
    const n = randInt(10, 88);
    const result = n + 10;
    return {
      title: "10 more",
      bucket,
      story: `What is 10 more than ${n}?`,
      visual: () => <HundredChart marks={[{ n, tone: "a" }, { n: result, tone: "b" }]} />,
      steps: [
        { kind: "number", prompt: `10 more than ${n} is what number?`, hint: "Only the tens digit changes.", explain: `${n} + 10 = ${result}.`, answer: result },
        choice({ prompt: "Which digit changed?", hint: "The ones digit never moves when you add exactly 10.", explain: "Only the tens digit changed." }, "Only the tens digit", ["Only the ones digit", "Both digits"]),
      ],
      wrapUp: `${n} + 10 = ${result}.`,
    };
  }

  if (bucket === "tenLessCrossing") {
    // Guarantees a start in the teens/low 20s so 10-less either drops the
    // tens digit to 0 (a single-digit result) or lands just above it.
    const n = randInt(11, 23);
    const result = n - 10;
    return {
      title: "10 less",
      bucket,
      story: `What is 10 less than ${n}?`,
      visual: () => <HundredChart marks={[{ n, tone: "a" }, { n: result, tone: "b" }]} />,
      steps: [
        { kind: "number", prompt: `10 less than ${n} is what number?`, hint: "Just change the tens digit — no need to recount by ones.", explain: `${n} - 10 = ${result}.`, answer: result },
        choice(
          { prompt: "How should you find it?", hint: "Recounting works, but it's slow and easy to mess up.", explain: "Just drop the tens digit by 1 (or to 0) — no recounting needed." },
          "Change the tens digit directly",
          ["Count backward by ones from the start"]
        ),
      ],
      wrapUp: `${n} - 10 = ${result}.`,
    };
  }

  if (bucket === "addMultipleOfTen") {
    const n = randInt(10, 79);
    const addTens = randInt(1, Math.min(2, Math.floor((99 - n) / 10)) || 1);
    const add = addTens * 10;
    const result = n + add;
    return {
      title: "Adding a multiple of ten",
      bucket,
      story: `What is ${n} + ${add}?`,
      visual: () => <HundredChart marks={[{ n, tone: "a" }, { n: result, tone: "b" }]} />,
      steps: [
        { kind: "number", prompt: `How many tens is ${add}?`, hint: "Count by tens: 10, 20, 30...", explain: `${add} is ${addTens} ten${addTens === 1 ? "" : "s"}.`, answer: addTens },
        { kind: "number", prompt: `${n} + ${add} = ?`, hint: "Add whole tens to the tens digit; the ones digit stays put.", explain: `${n} + ${add} = ${result}.`, answer: result },
      ],
      wrapUp: `${n} + ${add} = ${result}.`,
    };
  }

  // subtractMultipleOfTen — including both the exact-decade landing (e.g.
  // 70-30=40) and the mid-decade case (e.g. 45-20=25, tens change but ones
  // stay put — the case that actually tests not brute-counting).
  const subTens = randInt(1, 7); // sub = 10-70
  const sub = subTens * 10;
  const extraTens = randInt(1, 9 - subTens); // keeps the result's tens digit 1-8
  const midDecade = Math.random() < 0.5;
  const ones = midDecade ? randInt(1, 9) : 0;
  const finalN = (subTens + extraTens) * 10 + ones;
  const finalResult = finalN - sub;
  return {
    title: "Subtracting a multiple of ten",
    bucket,
    story: `What is ${finalN} - ${sub}?`,
    visual: () => <HundredChart marks={[{ n: finalN, tone: "a" }, { n: finalResult, tone: "b" }]} />,
    steps: [
      { kind: "number", prompt: `How many tens is ${sub}?`, hint: "Count by tens.", explain: `${sub} is ${subTens} ten${subTens === 1 ? "" : "s"}.`, answer: subTens },
      { kind: "number", prompt: `${finalN} - ${sub} = ?`, hint: "Subtract whole tens from the tens digit; the ones digit stays put.", explain: `${finalN} - ${sub} = ${finalResult}.`, answer: finalResult },
    ],
    wrapUp: `${finalN} - ${sub} = ${finalResult}.`,
  };
}

export const tenMoreTenLess: Unit = {
  id: "tenMoreTenLess",
  title: "Ten More, Ten Less, and Multiples of Ten",
  goal: "Quickly find 10 more or 10 less than a number, and add or subtract a multiple of ten.",
  standard: "1.NBT.5, 1.NBT.6",
  keyIdea: (
    <>
      <p>Adding or subtracting 10 only ever changes the tens digit — the ones digit never moves. No need to recount by ones.</p>
      <p>The same idea scales up: adding or subtracting any multiple of ten (20, 30...) just moves the tens digit by that many tens.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoned through via place value each time, not a memorized fact.
  problems: [{ label: "Moving by Tens", make: tenMoreLessProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: tenMoreTenLessTest,
};
