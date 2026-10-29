import { useEffect, useState } from "react";
import { BaseTenBlocks } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import type { Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { addingTwoDigitOneDigitTest } from "./AddingTwoDigitOneDigitTest";

// ============================================================================
// SHARED BREAKDOWN — the one function both Explore's diagram AND Practice's
// step-checking use, so the pictured intermediate state (loose ones before
// bundling) and the graded answer can never disagree with each other.
// ============================================================================

export interface RegroupBreakdown {
  tens: number;
  ones: number;
  sumOnes: number; // can exceed 9 — the un-bundled intermediate state
  regrouped: boolean;
  newTens: number;
  newOnes: number;
  total: number;
}

export function regroupBreakdown(twoDigit: number, add: number): RegroupBreakdown {
  const tens = Math.floor(twoDigit / 10);
  const ones = twoDigit % 10;
  const sumOnes = ones + add;
  const regrouped = sumOnes > 9;
  const newOnes = sumOnes % 10;
  const newTens = tens + Math.floor(sumOnes / 10);
  return { tens, ones, sumOnes, regrouped, newTens, newOnes, total: twoDigit + add };
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary / baseline: no regrouping needed. */
function NoRegroupBaselineQuestion({ onComplete }: { onComplete?: () => void }) {
  const [val, setVal] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = val === "39";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What is 34 + 5?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={val} onChange={(e) => setVal(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="39">39</option>
          <option value="84">84</option>
          <option value="30">30</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 34 + 5 = 39. The ones (4 + 5 = 9) fit without needing a new ten." : "Not quite — add the ones first: 4 + 5 = 9. That's still under 10, so just put 9 in the ones place: 39."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated + the exact named misconception, paired with WHY. */
function RegroupHardCaseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [val, setVal] = useState("");
  const [why, setWhy] = useState("");
  const [checked, setChecked] = useState(false);
  const valOk = val === "43";
  const whyOk = why === "bundle";
  const ok = valOk && whyOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> What is 38 + 5?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Answer:{" "}
          <select className="answer" value={val} onChange={(e) => setVal(e.target.value)} style={fieldOk(valOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="43">43</option>
            <option value="33">33</option>
            <option value="38">38</option>
          </select>
        </label>
        <label>
          Why?{" "}
          <select className="answer" value={why} onChange={(e) => setWhy(e.target.value)} style={fieldOk(whyOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="bundle">8 + 5 = 13 ones — that's more than 9, so bundle 10 into a new ten</option>
            <option value="ignore">8 + 5 = 13, but just write the 3 and ignore the extra ten</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 38 + 5 = 43. 8 + 5 = 13 ones, which is 1 new ten and 3 leftover ones. That new ten gets ADDED to the tens digit: 3 + 1 = 4 tens."
            : "Not quite — 8 + 5 = 13 ones. 13 is more than a single digit can hold, so bundle 10 of them into a brand new ten (making 4 tens total) and keep the 3 leftover ones: 43, NOT 33 (33 forgets to add that new ten in)."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false: the regrouping rule itself. */
function RegroupRuleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: whenever the ones digits add up to MORE than 9, you need to bundle 10 of them into a new ten and add 1 to the tens digit.
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
            ? "Correct — every time the ones sum passes 9, exactly 10 of them become a brand new ten, and that new ten is added onto the tens digit."
            : "Not quite — check 38+5 (13 ones -> a new ten) and 47+6 (13 ones -> a new ten again). Every time the ones sum passes 9, you bundle a new ten."}
        </p>
      )}
    </div>
  );
}

/** A second full worked regrouping example, produced step by step. */
function SecondRegroupExampleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [sumOnes, setSumOnes] = useState("");
  const [newTens, setNewTens] = useState("");
  const [total, setTotal] = useState("");
  const [checked, setChecked] = useState(false);
  const sumOk = sumOnes === "13";
  const tensOk = newTens === "5";
  const totalOk = total === "53";
  const ok = sumOk && tensOk && totalOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  const selectRow = (label: string, value: string, setValue: (v: string) => void, isOk: boolean, options: string[]) => (
    <label>
      {label}:{" "}
      <select className="answer" value={value} onChange={(e) => setValue(e.target.value)} style={fieldOk(isOk, checked)}>
        <option value="" disabled>
          choose
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Work through 47 + 6, one piece at a time.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        {selectRow("Ones: 7 + 6 =", sumOnes, setSumOnes, sumOk, ["11", "12", "13"])}
        {selectRow("New tens digit (4 + 1) =", newTens, setNewTens, tensOk, ["4", "5", "6"])}
        {selectRow("Final answer", total, setTotal, totalOk, ["43", "53", "413"])}
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 7 + 6 = 13 ones, which bundles into 1 new ten + 3 ones. 4 tens + 1 new ten = 5 tens. 47 + 6 = 53."
            : "Not quite — 7 + 6 = 13 ones. Bundle 10 of them into a new ten (4 tens become 5 tens), keeping 3 leftover ones: 47 + 6 = 53."}
        </p>
      )}
    </div>
  );
}

function AddingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ baseline: false, hardCase: false, rule: false, secondExample: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure regrouping makes sense before you try practice problems.</p>
      <NoRegroupBaselineQuestion onComplete={mark("baseline")} />
      <RegroupHardCaseQuestion onComplete={mark("hardCase")} />
      <RegroupRuleQuestion onComplete={mark("rule")} />
      <SecondRegroupExampleQuestion onComplete={mark("secondExample")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [start, setStart] = useState(38);
  const [add, setAdd] = useState(5);
  const [stage, setStage] = useState<"start" | "added" | "bundled">("start");
  const b = regroupBreakdown(start, add);

  const setStartNum = (v: number) => {
    setStart(v);
    setStage("start");
  };
  const setAddNum = (v: number) => {
    setAdd(v);
    setStage("start");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Starting number" value={start} min={10} max={89} step={1} onChange={setStartNum} tone="a" />
        <Stepper label="Add" value={add} min={1} max={9} step={1} onChange={setAddNum} tone="b" />
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
      {(introActive || showCheck) && <AddingCheckForUnderstanding onComplete={onIntroDone} />}

      {stage === "start" && (
        <>
          <BaseTenBlocks tens={b.tens} ones={b.ones} tenTone="a" oneTone="b" />
          <button className="btn primary" onClick={() => setStage("added")}>
            Add {add} more ones
          </button>
        </>
      )}
      {stage === "added" && (
        <>
          <BaseTenBlocks tens={b.tens} ones={b.sumOnes} tenTone="a" oneTone="b" flagOverflow />
          {b.regrouped ? (
            <>
              <p className="feedback good">
                {b.ones} + {add} = {b.sumOnes} ones — too many for one digit! Bundle 10 of them into a new ten.
              </p>
              <button className="btn primary" onClick={() => setStage("bundled")}>
                Bundle 10 ones into a new ten
              </button>
            </>
          ) : (
            <button className="btn primary" onClick={() => setStage("bundled")}>
              See the final number
            </button>
          )}
        </>
      )}
      {stage === "bundled" && (
        <>
          <BaseTenBlocks tens={b.newTens} ones={b.newOnes} tenTone="a" oneTone="b" />
          <p style={{ fontWeight: 800, fontSize: 20 }}>
            {start} + {add} = {b.total}
          </p>
        </>
      )}
      <p className="muted small">
        {b.regrouped
          ? "Adding the ones can make MORE than 9 loose ones — that's always exactly enough to bundle one brand new ten, which gets added onto the tens digit."
          : "Here the ones fit under 10, so no bundling is needed — just add the ones and keep the tens digit as it was."}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "noRegroup" | "regroup";
const BUCKETS: Bucket[] = ["noRegroup", "regroup"];

function addingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "regroup") {
    // Reject-sample for a genuine ones-sum-over-9 case.
    let tens: number, ones: number, add: number, b: RegroupBreakdown;
    do {
      tens = randInt(1, 8);
      ones = randInt(1, 9);
      add = randInt(1, 9);
      b = regroupBreakdown(tens * 10 + ones, add);
    } while (!b.regrouped);
    const n = tens * 10 + ones;
    return {
      title: "Adding with regrouping",
      bucket,
      story: `What is ${n} + ${add}?`,
      visual: (done) => <BaseTenBlocks tens={done >= 2 ? b.newTens : b.tens} ones={done >= 2 ? b.newOnes : done >= 1 ? b.sumOnes : b.ones} tenTone="a" oneTone="b" flagOverflow={done === 1} />,
      steps: [
        { kind: "number", prompt: `${ones} + ${add} = how many ones?`, hint: "Add just the ones digits.", explain: `${ones} + ${add} = ${b.sumOnes}.`, answer: b.sumOnes },
        { kind: "number", prompt: `${b.sumOnes} ones is too many for one digit. After bundling a new ten, what's the new tens digit?`, hint: "Add 1 new ten onto the old tens digit.", explain: `${tens} + 1 = ${b.newTens}.`, answer: b.newTens },
        { kind: "number", prompt: `${n} + ${add} = ?`, hint: "Put the new tens digit together with the leftover ones.", explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
      ],
      wrapUp: `${n} + ${add} = ${b.total} — bundling a new ten along the way.`,
    };
  }

  // noRegroup — ones sum stays under 10.
  let tens: number, ones: number, add: number, b: RegroupBreakdown;
  do {
    tens = randInt(1, 8);
    ones = randInt(0, 8);
    add = randInt(1, 9);
    b = regroupBreakdown(tens * 10 + ones, add);
  } while (b.regrouped);
  const n = tens * 10 + ones;
  return {
    title: "Adding a one-digit number",
    bucket,
    story: `What is ${n} + ${add}?`,
    visual: (done) => <BaseTenBlocks tens={b.tens} ones={done >= 1 ? b.sumOnes : b.ones} tenTone="a" oneTone="b" />,
    steps: [
      { kind: "number", prompt: `${ones} + ${add} = how many ones?`, hint: "Add just the ones digits.", explain: `${ones} + ${add} = ${b.sumOnes}.`, answer: b.sumOnes },
      { kind: "number", prompt: `${n} + ${add} = ?`, hint: "The tens digit stays the same — no bundling needed here.", explain: `${n} + ${add} = ${b.total}.`, answer: b.total },
    ],
    wrapUp: `${n} + ${add} = ${b.total} — no new ten needed.`,
  };
}

export const addingTwoDigitOneDigit: Unit = {
  id: "addingTwoDigitOneDigit",
  title: "Adding a 2-Digit and a 1-Digit Number",
  goal: "Add a two-digit number and a one-digit number, bundling a new ten whenever the ones add up to more than 9.",
  standard: "1.NBT.4",
  keyIdea: (
    <>
      <p>Add the ones digits first. If they add up to 9 or less, just write that total in the ones place — nothing else changes.</p>
      <p>If the ones add up to MORE than 9, bundle 10 of them into a brand new ten, and add that new ten onto the tens digit.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoned through via the ones-sum-and-bundle strategy each time, not a
  // memorized fact.
  problems: [{ label: "Adding Ones", make: addingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: addingTwoDigitOneDigitTest,
};
