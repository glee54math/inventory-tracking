import { useEffect, useState } from "react";
import { PlaceValueColumns, BaseTenBlocks } from "../diagrams";
import { buildAddColumns, buildSubColumns, borrowsThroughZero, regroupCount, type ColumnBreakdown } from "../logic";
import { randInt } from "../../../shared/lib/math";
import type { Problem } from "../../../shared/engine/types";
import { Stepper, Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { addSubtractWithin1000Test } from "./AddSubtractWithin1000Test";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions. Target (per the approved plan): borrowing
// through a zero in the tens place is the hardest, most-specific
// misconception point in this unit (you cannot borrow a ten from a tens
// place that holds a 0 — you must reach into the hundreds place first).

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function WhyCantBorrowQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "zero";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> In 403 − 158, why can't you borrow a ten directly from the tens place to help the ones place?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="zero">The tens digit is 0 — there's no ten there to lend</option>
          <option value="toobig">403 is too big a number to borrow in</option>
          <option value="noneed">You don't actually need to borrow at all</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — the tens place holds a 0, so there's nothing there yet to lend to the ones place." : "Not quite — the tens digit of 403 is 0. You can't lend a ten from a place that doesn't have one."}
        </p>
      )}
    </div>
  );
}

function WhereFirstQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "hundreds";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Since the tens place in 403 has nothing to lend, what do you do first?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="hundreds">Borrow a hundred from the hundreds place, giving the tens place 10 tens to work with</option>
          <option value="skip">Skip the tens place and borrow straight from the ones</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — borrowing a hundred from the hundreds place gives the tens place 10 tens. It can then lend one of those tens to the ones place." : "Not quite — you first borrow from the hundreds place, which gives the tens place something to work with (and then lend)."}
        </p>
      )}
    </div>
  );
}

function CannotSubtractAtAllTrueFalseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: if the tens digit is 0, you can't subtract at all.
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
          {ok ? "Correct — false. You just have to borrow from the hundreds place first, so the tens place has something to work with." : "Not quite — false is right. A zero in the tens place just means you borrow from the hundreds place first."}
        </p>
      )}
    </div>
  );
}

function WorkedExampleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [hundreds, setHundreds] = useState("");
  const [tens, setTens] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [hundreds, tens].every((v) => String(v).trim() !== "");
  const ok = hundreds === "2" && tens === "9";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> After borrowing from the hundreds place in 403 − 158, the hundreds digit becomes ___ and the tens digit becomes ___.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={hundreds} onChange={(e) => setHundreds(e.target.value)} style={fieldOk(hundreds === "2", checked)}>
          <option value="" disabled>
            hundreds?
          </option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
        </select>
        <select className="answer" value={tens} onChange={(e) => setTens(e.target.value)} style={fieldOk(tens === "9", checked)}>
          <option value="" disabled>
            tens?
          </option>
          <option value="0">0</option>
          <option value="10">10</option>
          <option value="9">9</option>
        </select>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — the hundreds digit drops from 4 to 2 (one hundred given to the tens place). The tens place then lends one of its 10 tens to the ones place, leaving 9." : "Not quite — borrowing a hundred from the 4 leaves 2 in the hundreds place (it passed through a temporary 3-becomes-10-tens state), and after the tens place lends one ten to the ones place, it's left with 9."}
        </p>
      )}
    </div>
  );
}

function Within1000CheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ why: false, where: false, trueFalse: false, worked: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure these ideas are clear before you try practice problems.</p>
      <WhyCantBorrowQuestion onComplete={mark("why")} />
      <WhereFirstQuestion onComplete={mark("where")} />
      <CannotSubtractAtAllTrueFalseQuestion onComplete={mark("trueFalse")} />
      <WorkedExampleQuestion onComplete={mark("worked")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [op, setOp] = useState<"add" | "subtract">("add");
  const [a, setA] = useState(287);
  const [b, setB] = useState(398);
  const [sub, setSub] = useState(403);
  const [subAmt, setSubAmt] = useState(158);

  const addBreakdown: ColumnBreakdown = buildAddColumns([a, b], 3);
  const subBreakdown: ColumnBreakdown = buildSubColumns(sub, subAmt, 3);
  const hundredsDigit = Math.floor((op === "add" ? a + b : sub) / 100) % 10;
  const tensDigit = Math.floor((op === "add" ? a + b : sub) / 10) % 10;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented label="Operation" value={op} onChange={setOp} options={[{ id: "add", label: "Addition" }, { id: "subtract", label: "Subtraction" }]} />
        {!introActive && (
          <button type="button" className="btn ghost" style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined} onClick={() => setShowCheck((v) => !v)}>
            Check for Understanding
          </button>
        )}
      </div>
      {(introActive || showCheck) && <Within1000CheckForUnderstanding onComplete={onIntroDone} />}

      {op === "add" ? (
        <>
          <div className="control-row">
            <Stepper label="First number" value={a} min={100} max={899} step={1} onChange={setA} tone="a" />
            <Stepper label="Second number" value={b} min={100} max={899} step={1} onChange={setB} tone="b" />
          </div>
          <BaseTenBlocks hundreds={Math.floor(a / 100) % 10} tens={Math.floor(a / 10) % 10} ones={a % 10} />
          <PlaceValueColumns breakdown={addBreakdown} revealCols={addBreakdown.numCols} />
          <p className="muted small">
            {a} + {b} = {addBreakdown.total}. {regroupCount(addBreakdown) === 0 ? "No regrouping needed here." : regroupCount(addBreakdown) === 1 ? "One column regroups into the next." : "Both the ones and tens columns regroup here."}
          </p>
        </>
      ) : (
        <>
          <div className="control-row">
            <Stepper label="Start" value={sub} min={101} max={999} step={1} onChange={setSub} tone="c" />
            <Stepper label="Subtract" value={subAmt} min={1} max={sub - 1} step={1} onChange={setSubAmt} tone="b" />
          </div>
          <BaseTenBlocks hundreds={hundredsDigit} tens={tensDigit} ones={sub % 10} />
          <PlaceValueColumns breakdown={subBreakdown} revealCols={subBreakdown.numCols} />
          <p className="muted small">
            {sub} − {subAmt} = {subBreakdown.total}.{" "}
            {borrowsThroughZero(subBreakdown)
              ? "The tens place starts at 0, so it has to borrow from the hundreds place BEFORE it can lend a ten to the ones place."
              : subBreakdown.carry.slice(0, 2).some((c) => c > 0)
                ? "One place borrows from the next."
                : "No borrowing needed here."}
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "addNoRegroup" | "addSingleRegroup" | "addDoubleRegroup" | "subNoRegroup" | "subSingleBorrow" | "subBorrowThroughZero" | "estimateReasonable";
const BUCKETS: Bucket[] = ["addNoRegroup", "addSingleRegroup", "addDoubleRegroup", "subNoRegroup", "subSingleBorrow", "subBorrowThroughZero", "estimateReasonable"];

function addSteps(breakdown: ColumnBreakdown, a: number, b: number): Problem["steps"] {
  return [
    {
      kind: "ratio",
      prompt: `Add the ones column: ${breakdown.digitsByOperand[0][0]} + ${breakdown.digitsByOperand[1][0]} = ${breakdown.digitsByOperand[0][0] + breakdown.digitsByOperand[1][0]}. What digit do you write, and what do you carry to the tens column?`,
      hint: "The digit you write is the ones digit of that sum.",
      explain: `Write ${breakdown.resultDigits[0]}, carry ${breakdown.carry[0]}.`,
      answer: [breakdown.resultDigits[0], breakdown.carry[0]],
      labels: ["ones digit", "carry to tens"],
      tones: "none",
    },
    {
      kind: "ratio",
      prompt: `Now the tens column: ${breakdown.digitsByOperand[0][1]} + ${breakdown.digitsByOperand[1][1]}${breakdown.carry[0] > 0 ? ` + ${breakdown.carry[0]} carried` : ""} = ${breakdown.digitsByOperand[0][1] + breakdown.digitsByOperand[1][1] + breakdown.carry[0]}. What digit do you write, and what do you carry to the hundreds column?`,
      hint: "Include the carry from the ones column.",
      explain: `Write ${breakdown.resultDigits[1]}, carry ${breakdown.carry[1]}.`,
      answer: [breakdown.resultDigits[1], breakdown.carry[1]],
      labels: ["tens digit", "carry to hundreds"],
      tones: "none",
    },
    { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "Put the digits you found together.", explain: `${a} + ${b} = ${breakdown.total}.`, answer: breakdown.total },
  ];
}

function subSteps(breakdown: ColumnBreakdown, a: number, b: number): Problem["steps"] {
  const throughZero = borrowsThroughZero(breakdown);
  return [
    {
      kind: "ratio",
      prompt: `Look at the ones column: ${breakdown.digitsByOperand[0][0]} − ${breakdown.digitsByOperand[1][0]}. Do you need to borrow from the tens column, and what's the ones digit of the answer?`,
      hint: "If the top digit is smaller than the bottom digit, you need to borrow.",
      explain: `Ones digit: ${breakdown.resultDigits[0]}, borrow needed: ${breakdown.carry[0]}.`,
      answer: [breakdown.resultDigits[0], breakdown.carry[0]],
      labels: ["ones digit", "borrowed from tens (0 or 1)"],
      tones: "none",
    },
    {
      kind: "ratio",
      prompt: throughZero
        ? `The tens digit here is 0, so it has to borrow from the hundreds place FIRST before it can lend anything to the ones place. After that, what's the tens digit of the answer, and does it still need to borrow from the hundreds column?`
        : `Now the tens column: ${breakdown.digitsByOperand[0][1]}${breakdown.carry[0] > 0 ? " (after lending a ten to the ones column)" : ""} − ${breakdown.digitsByOperand[1][1]}. What's the tens digit of the answer, and does it need to borrow from the hundreds column?`,
      hint: throughZero ? "Borrowing from the hundreds place turns the tens digit into 10 (temporarily) before it lends one away." : "Subtract the bottom tens digit, minus 1 if the ones column borrowed.",
      explain: `Tens digit: ${breakdown.resultDigits[1]}, borrow from hundreds: ${breakdown.carry[1]}.`,
      answer: [breakdown.resultDigits[1], breakdown.carry[1]],
      labels: ["tens digit", "borrowed from hundreds (0 or 1)"],
      tones: "none",
    },
    { kind: "number", prompt: `What is ${a} − ${b}?`, hint: "Put the digits you found together.", explain: `${a} − ${b} = ${breakdown.total}.`, answer: breakdown.total },
  ];
}

function addProblem(a: number, b: number, bucket: Bucket): Problem {
  const breakdown = buildAddColumns([a, b], 3);
  return {
    title: "Adding within 1000",
    bucket,
    story: `Add: ${a} + ${b}`,
    visual: (done) => <PlaceValueColumns breakdown={breakdown} revealCols={done} />,
    steps: addSteps(breakdown, a, b),
    wrapUp: `${a} + ${b} = ${breakdown.total}.`,
  };
}

function subProblem(a: number, b: number, bucket: Bucket): Problem {
  const breakdown = buildSubColumns(a, b, 3);
  return {
    title: "Subtracting within 1000",
    bucket,
    story: `Subtract: ${a} − ${b}`,
    visual: (done) => <PlaceValueColumns breakdown={breakdown} revealCols={done} />,
    steps: subSteps(breakdown, a, b),
    wrapUp: `${a} − ${b} = ${breakdown.total}.`,
  };
}

function addNoRegroupProblem(): Problem {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(100, 800);
    b = randInt(100, 199);
    breakdown = buildAddColumns([a, b], 3);
  } while (regroupCount(breakdown) !== 0 || breakdown.total >= 1000);
  return addProblem(a, b, "addNoRegroup");
}

function addSingleRegroupProblem(): Problem {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(100, 800);
    b = randInt(100, 199);
    breakdown = buildAddColumns([a, b], 3);
  } while (regroupCount(breakdown) !== 1 || breakdown.total >= 1000);
  return addProblem(a, b, "addSingleRegroup");
}

function addDoubleRegroupProblem(): Problem {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(100, 700);
    b = randInt(100, 299);
    breakdown = buildAddColumns([a, b], 3);
  } while (regroupCount(breakdown) !== 2 || breakdown.total >= 1000);
  return addProblem(a, b, "addDoubleRegroup");
}

function subNoRegroupProblem(): Problem {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(200, 899);
    b = randInt(100, a - 1);
    breakdown = buildSubColumns(a, b, 3);
  } while (breakdown.carry[0] !== 0 || breakdown.carry[1] !== 0);
  return subProblem(a, b, "subNoRegroup");
}

function subSingleBorrowProblem(): Problem {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(200, 899);
    b = randInt(100, a - 1);
    breakdown = buildSubColumns(a, b, 3);
  } while (breakdown.carry[0] + breakdown.carry[1] !== 1);
  return subProblem(a, b, "subSingleBorrow");
}

function subBorrowThroughZeroProblem(): Problem {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    // Force a 0 tens digit on the minuend, so the tens place MUST borrow
    // through to the hundreds place before it can lend to the ones place.
    const hundreds = randInt(2, 9);
    const ones = randInt(0, 9);
    a = hundreds * 100 + ones;
    b = randInt(100, a - 1);
    breakdown = buildSubColumns(a, b, 3);
  } while (!borrowsThroughZero(breakdown));
  return subProblem(a, b, "subBorrowThroughZero");
}

/** Round each number to the nearest hundred, then judge whether a given
 *  computed answer is reasonable — sometimes the answer IS right, sometimes
 *  it's a plausible wrong answer (a missed hundred-carry), so "always say
 *  reasonable" or "always say unreasonable" can't be a shortcut. `a`/`b` are
 *  built as a round hundred plus a SMALL offset (at most 20, well under half
 *  the 100-rounding unit) so the true total is always within 40 of the
 *  estimate, and a 100-off wrong answer is always more than 60 away from it
 *  — the two cases can never land on the same side of a fixed threshold by
 *  chance, unlike a threshold chosen without that margin guaranteed. */
function estimateReasonableProblem(): Problem {
  const a = randInt(2, 6) * 100 + randInt(-20, 20);
  const b = randInt(2, 3) * 100 + randInt(-20, 20);
  const total = a + b;
  const roundA = Math.round(a / 100) * 100;
  const roundB = Math.round(b / 100) * 100;
  const estimate = roundA + roundB;
  const giveWrong = Math.random() < 0.5;
  // A plausible wrong answer: forgot to carry a hundred (100 too small).
  const shown = giveWrong ? total - 100 : total;
  const reasonable = Math.abs(shown - estimate) <= 50;
  return {
    title: "Is this answer reasonable?",
    bucket: "estimateReasonable",
    story: `${a} + ${b} is computed as ${shown}. First estimate, then judge.`,
    visual: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span>
          Round: {a} → {roundA}, {b} → {roundB}
        </span>
        <span>
          Estimate: {roundA} + {roundB} = {estimate}
        </span>
      </div>
    ),
    steps: [
      { kind: "number", prompt: `Round ${a} and ${b} to the nearest hundred, then add. What's the estimate?`, hint: "Round each number first, then add the rounded numbers.", explain: `${roundA} + ${roundB} = ${estimate}.`, answer: estimate },
      {
        kind: "choice",
        prompt: `A computed answer for ${a} + ${b} is ${shown}. Based on your estimate of ${estimate}, is ${shown} reasonable?`,
        hint: "A reasonable answer should be close to the estimate.",
        explain: reasonable ? `${shown} is close to the estimate of ${estimate}, so it's reasonable.` : `${shown} is far from the estimate of ${estimate} — that's a sign something went wrong (the real answer is ${total}).`,
        choices: ["Yes, that's reasonable", "No, that's not reasonable"],
        correct: reasonable ? 0 : 1,
      },
    ],
    wrapUp: `${a} + ${b} = ${total}. ${reasonable ? `${shown} was indeed close to it.` : `${shown} was NOT close to the real answer — a good estimate catches mistakes like this.`}`,
  };
}

function within1000Problem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "addNoRegroup") return addNoRegroupProblem();
  if (bucket === "addSingleRegroup") return addSingleRegroupProblem();
  if (bucket === "addDoubleRegroup") return addDoubleRegroupProblem();
  if (bucket === "subNoRegroup") return subNoRegroupProblem();
  if (bucket === "subSingleBorrow") return subSingleBorrowProblem();
  if (bucket === "subBorrowThroughZero") return subBorrowThroughZeroProblem();
  return estimateReasonableProblem();
}

export const addSubtractWithin1000: Unit = {
  id: "addSubtractWithin1000",
  title: "Adding and Subtracting Within 1000",
  goal: "Add and subtract 3-digit numbers using drawings or models, and check whether an answer is reasonable.",
  standard: "2.NBT.7, 2.NBT.7.1",
  keyIdea: (
    <>
      <p>Work one column at a time, just like with two-digit numbers — the new part is a hundreds column, and a borrow that has to pass THROUGH a zero in the tens place.</p>
      <p>Before trusting a computed answer, round and estimate — a good estimate catches a wrong answer even without redoing the whole problem.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Within 1000", make: within1000Problem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: addSubtractWithin1000Test,
};
