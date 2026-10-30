import { useEffect, useState } from "react";
import { randInt, pick } from "../../../shared/lib/math";
import { allFilled } from "../../../shared/lib/answerChecks";
import { customStep, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { PlaceValueBlocks } from "../diagrams/PlaceValueBlocks";
import { addSubWithin1000Test } from "./AddingAndSubtractingWithin1000Test";

// ============================================================================
// ALGORITHM BREAKDOWN — the ONE function shared by the widget's render AND
// its own checking logic (see MATH_TSX_STYLE_GUIDE.txt's "algorithm-
// intermediate-state diagrams" guidance), so the picture and the grading can
// never disagree. Column order is ones-first internally (easiest to carry/
// borrow left-to-right through), reversed to most-significant-first only for
// display/indexing in the widget below.
// ============================================================================

export interface OpBreakdown {
  /** Result digits, most-significant digit first. */
  digitsMSB: number[];
  /** [intoTens, intoHundreds] — 1 if that column carried (addition) or
   *  borrowed (subtraction), 0 otherwise. A 3rd entry (into thousands) is
   *  tracked internally but never surfaced as a checked input — every
   *  generator below keeps sums at or under 999, so it's always 0. */
  marks: number[];
  result: number;
}

export const addBreakdown = (a: number, b: number): OpBreakdown => {
  const ad = String(a).padStart(3, "0").split("").map(Number).reverse();
  const bd = String(b).padStart(3, "0").split("").map(Number).reverse();
  const digits: number[] = [];
  const marks: number[] = [];
  let carry = 0;
  for (let i = 0; i < 3; i++) {
    const sum = ad[i] + bd[i] + carry;
    digits.push(sum % 10);
    carry = sum >= 10 ? 1 : 0;
    marks.push(carry);
  }
  if (carry) digits.push(carry);
  return { digitsMSB: [...digits].reverse(), marks, result: a + b };
};

export const subBreakdown = (a: number, b: number): OpBreakdown => {
  const ad = String(a).padStart(3, "0").split("").map(Number).reverse();
  const bd = String(b).padStart(3, "0").split("").map(Number).reverse();
  const digits: number[] = [];
  const marks: number[] = [];
  let borrow = 0;
  for (let i = 0; i < 3; i++) {
    let top = ad[i] - borrow;
    if (top < bd[i]) {
      top += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    digits.push(top - bd[i]);
    marks.push(borrow);
  }
  return { digitsMSB: [...digits].reverse(), marks, result: a - b };
};

// ============================================================================
// VERTICAL ALGORITHM WIDGET — a CustomStep (shared/engine/types.ts's escape
// hatch for a self-validating widget), not a run of NumberSteps, since this
// problem needs one checked box PER DIGIT of the result AND per regroup mark
// (the carry/borrow itself), not just one box for the final answer. Self-
// contained: grades itself against addBreakdown/subBreakdown above and only
// calls onDone once every box is correct.
// ============================================================================

function VerticalOpWidget({ a, b, op, onDone }: { a: number; b: number; op: "add" | "sub"; onDone: () => void }) {
  const breakdown = op === "add" ? addBreakdown(a, b) : subBreakdown(a, b);
  const totalCols = Math.max(3, breakdown.digitsMSB.length);
  const [digitVals, setDigitVals] = useState<string[]>(() => Array(breakdown.digitsMSB.length).fill(""));
  const [mark1, setMark1] = useState(""); // into tens (add) / borrowed from tens (sub)
  const [mark2, setMark2] = useState(""); // into hundreds (add) / borrowed from hundreds (sub)
  const [checked, setChecked] = useState(false);

  const digitsOk = digitVals.every((v, i) => v === String(breakdown.digitsMSB[i]));
  const mark1Ok = mark1 === String(breakdown.marks[0]);
  const mark2Ok = mark2 === String(breakdown.marks[1]);
  const allOk = digitsOk && mark1Ok && mark2Ok;
  const filled = allFilled(mark1, mark2, ...digitVals);

  useEffect(() => {
    if (checked && allOk) onDone();
  }, [checked, allOk, onDone]);

  const tensColIdx = totalCols - 2;
  const hundredsColIdx = totalCols - 3;

  const renderRow = (value: number, opSymbol?: string) => {
    const text = String(value).padStart(totalCols, " ");
    return (
      <div className="vreg-row">
        <span className="vreg-opcell">{opSymbol ?? ""}</span>
        <div className="align-row">
          {text.split("").map((ch, i) => (
            <span key={i} className="align-slot align-slot-static">
              {ch === " " ? "" : ch}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const markBox = (value: string, setValue: (v: string) => void, ok: boolean, label: string) => (
    <input
      className={`align-slot vreg-mark-input ${checked ? (ok ? "ok" : "bad") : ""}`}
      inputMode="numeric"
      maxLength={1}
      aria-label={label}
      value={value}
      onChange={(e) => {
        setValue(e.target.value.replace(/[^01]/g, "").slice(-1));
        setChecked(false);
      }}
    />
  );

  const markLabel = op === "add" ? "carried into" : "borrowed from";

  return (
    <div className="vreg-widget">
      <div className="vreg-row">
        <span className="vreg-opcell" />
        <div className="align-row">
          {Array.from({ length: totalCols }, (_, i) => {
            if (i === hundredsColIdx && hundredsColIdx >= 0) return <span key={i}>{markBox(mark2, setMark2, mark2Ok, `${markLabel} the hundreds column`)}</span>;
            if (i === tensColIdx) return <span key={i}>{markBox(mark1, setMark1, mark1Ok, `${markLabel} the tens column`)}</span>;
            return <span key={i} className="align-slot" />;
          })}
        </div>
      </div>
      {renderRow(a)}
      {renderRow(b, op === "add" ? "+" : "−")}
      <div className="vreg-row">
        <span className="vreg-opcell" />
        <div className="align-rule" style={{ width: `${totalCols * 1.1}em` }} />
      </div>
      <div className="vreg-row">
        <span className="vreg-opcell" />
        <div className="align-row">
          {breakdown.digitsMSB.map((_, i) => (
            <input
              key={i}
              className={`align-slot align-slot-input ${checked ? (digitVals[i] === String(breakdown.digitsMSB[i]) ? "ok" : "bad") : ""}`}
              inputMode="numeric"
              maxLength={1}
              aria-label={`result digit ${i + 1}`}
              value={digitVals[i]}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "").slice(-1);
                setDigitVals((arr) => arr.map((x, k) => (k === i ? v : x)));
                setChecked(false);
              }}
            />
          ))}
        </div>
      </div>
      <button type="button" className="btn primary" style={{ marginTop: 10 }} disabled={!filled} onClick={() => setChecked(true)}>
        Check
      </button>
      {checked && filled && !allOk && (
        <p className="feedback bad" role="alert">
          Not yet — check the small {op === "add" ? "carry" : "borrow"} boxes first (0 if that column didn't need to regroup, 1 if it did), then each result digit.
        </p>
      )}
    </div>
  );
}

// ============================================================================
// GENERATORS
// ============================================================================

export const ADDSUB_BUCKETS = ["addNoRegroup", "addSingleRegroup", "addDoubleRegroup", "subNoRegroup", "subSingleBorrow", "subDoubleBorrow"] as const;
export type AddSubBucket = (typeof ADDSUB_BUCKETS)[number];

const randAddNoRegroup = (): { a: number; b: number } => {
  let a = 0, b = 0, ok = false;
  do {
    const o1 = randInt(0, 9), o2 = randInt(0, 9);
    const t1 = randInt(0, 9), t2 = randInt(0, 9);
    const h1 = randInt(1, 9), h2 = randInt(0, 9);
    ok = o1 + o2 < 10 && t1 + t2 < 10 && h1 + h2 < 10;
    if (ok) {
      a = h1 * 100 + t1 * 10 + o1;
      b = h2 * 100 + t2 * 10 + o2;
    }
  } while (!ok);
  return { a, b };
};

const randAddSingleRegroup = (): { a: number; b: number } => {
  const onesRegroup = Math.random() < 0.5;
  let a = 0, b = 0, ok = false;
  do {
    const o1 = randInt(0, 9), o2 = randInt(0, 9);
    const t1 = randInt(0, 9), t2 = randInt(0, 9);
    const h1 = randInt(1, 9), h2 = randInt(0, 9);
    const onesCarry = o1 + o2 >= 10 ? 1 : 0;
    const tensCarry = t1 + t2 + onesCarry >= 10 ? 1 : 0;
    const noOverflow = h1 + h2 + tensCarry <= 9;
    ok = noOverflow && ((onesRegroup && onesCarry === 1 && tensCarry === 0) || (!onesRegroup && onesCarry === 0 && tensCarry === 1));
    if (ok) {
      a = h1 * 100 + t1 * 10 + o1;
      b = h2 * 100 + t2 * 10 + o2;
    }
  } while (!ok);
  return { a, b };
};

const randAddDoubleRegroup = (): { a: number; b: number } => {
  let a = 0, b = 0, ok = false;
  do {
    const o1 = randInt(0, 9), o2 = randInt(0, 9);
    const t1 = randInt(0, 9), t2 = randInt(0, 9);
    const h1 = randInt(1, 8), h2 = randInt(0, 8);
    const onesCarry = o1 + o2 >= 10 ? 1 : 0;
    const tensCarry = t1 + t2 + onesCarry >= 10 ? 1 : 0;
    const noOverflow = h1 + h2 + tensCarry <= 9;
    ok = noOverflow && onesCarry === 1 && tensCarry === 1;
    if (ok) {
      a = h1 * 100 + t1 * 10 + o1;
      b = h2 * 100 + t2 * 10 + o2;
    }
  } while (!ok);
  return { a, b };
};

const randSubNoRegroup = (): { a: number; b: number } => {
  const ha = randInt(1, 9);
  const ta = randInt(0, 9);
  const oa = randInt(0, 9);
  const hb = randInt(0, ha);
  const tb = randInt(0, ta);
  const ob = randInt(0, oa);
  return { a: ha * 100 + ta * 10 + oa, b: hb * 100 + tb * 10 + ob };
};

const randSubSingleBorrow = (): { a: number; b: number } => {
  const onesBorrow = Math.random() < 0.5;
  let a = 0, b = 0, ok = false;
  do {
    const ha = randInt(1, 9);
    const ta = randInt(0, 9);
    const oa = randInt(0, 9);
    const hb = randInt(0, ha);
    const tb = randInt(0, 9);
    const ob = randInt(0, 9);
    const ones0 = oa < ob ? 1 : 0;
    const tensTop = ta - ones0;
    const tens0 = tensTop < tb ? 1 : 0;
    const hundredsTop = ha - tens0;
    const noUnderflow = hundredsTop >= hb;
    ok = noUnderflow && ((onesBorrow && ones0 === 1 && tens0 === 0) || (!onesBorrow && ones0 === 0 && tens0 === 1));
    if (ok) {
      a = ha * 100 + ta * 10 + oa;
      b = hb * 100 + tb * 10 + ob;
    }
  } while (!ok);
  return { a, b };
};

/**
 * Forces BOTH the ones->tens AND tens->hundreds regroup to happen in the same
 * problem. Half the draws also force the tens digit of `a` to 0 — the
 * "borrow-through-zero" sub-case (e.g. 500 - 237) the plan deliberately names
 * as the single hardest edge case in this unit, since a tens digit of 0 means
 * that column must ALSO borrow from the hundreds just to have anything to
 * lend the ones column, not just pass along a borrow of its own.
 */
const randSubDoubleBorrow = (): { a: number; b: number } => {
  const throughZero = Math.random() < 0.5;
  const ha = randInt(2, 9);
  const ta = throughZero ? 0 : randInt(0, 9);
  const oa = randInt(0, 8);
  const ob = randInt(oa + 1, 9); // forces the ones column to borrow
  const tb = throughZero ? randInt(0, 9) : randInt(ta, 9); // forces the tens column to borrow too
  const hb = randInt(0, ha - 1); // leaves enough in the hundreds column after it lends one
  return { a: ha * 100 + ta * 10 + oa, b: hb * 100 + tb * 10 + ob };
};

const genForBucket = (bucket: AddSubBucket): { a: number; b: number; op: "add" | "sub" } => {
  switch (bucket) {
    case "addNoRegroup":
      return { ...randAddNoRegroup(), op: "add" };
    case "addSingleRegroup":
      return { ...randAddSingleRegroup(), op: "add" };
    case "addDoubleRegroup":
      return { ...randAddDoubleRegroup(), op: "add" };
    case "subNoRegroup":
      return { ...randSubNoRegroup(), op: "sub" };
    case "subSingleBorrow":
      return { ...randSubSingleBorrow(), op: "sub" };
    case "subDoubleBorrow":
      return { ...randSubDoubleBorrow(), op: "sub" };
  }
};

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * 4 fixed questions: vocabulary (Q1), the commonly-conflated carry-vs-borrow
 * direction (Q2), a required walkthrough of a fixed borrow-through-zero
 * subtraction using the SAME widget Practice uses (Q3 — per the plan, this
 * gate must specifically confirm the student can walk through a
 * double-regroup/borrow-through-zero case, not just answer about it), and a
 * generalization true/false trap (Q4).
 */
function AddSubGate({ onComplete }: { onComplete?: () => void }) {
  const [q1, setQ1] = useState("");
  const q1Done = q1 === "bundle";

  const [q2, setQ2] = useState("");
  const q2Done = q2 === "match";

  const [q3Done, setQ3Done] = useState(false);

  const [q4, setQ4] = useState("");
  const q4Done = q4 === "false";

  const allDone = q1Done && q2Done && q3Done && q4Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure regrouping makes sense before you try practice problems.</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> What does it mean to "regroup" 10 ones into 1 ten (or 10 tens into 1 hundred)?
        </p>
        <select className="answer" aria-label="what regrouping means" value={q1} onChange={(e) => setQ1(e.target.value)}>
          <option value="" disabled>
            choose
          </option>
          <option value="bundle">Bundle 10 of the smaller place value together to make 1 of the next bigger place value</option>
          <option value="restart">Start the whole problem over because something went wrong</option>
        </select>
        {q1 && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done ? "Right — 10 ones really do equal exactly 1 ten, so bundling them is always a fair trade." : "Not quite — regrouping isn't a sign of a mistake, it's a normal trade of 10 smaller units for 1 bigger one."}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> "Carrying" and "borrowing" both move a ten between columns. Which statement matches each term to its direction?
        </p>
        <select className="answer" aria-label="carry vs borrow direction" value={q2} onChange={(e) => setQ2(e.target.value)}>
          <option value="" disabled>
            choose
          </option>
          <option value="match">Carrying moves a group UP into the next column while adding; borrowing moves a group DOWN from the next column while subtracting</option>
          <option value="swap">Carrying and borrowing both always move a group from left to right, regardless of the operation</option>
        </select>
        {q2 && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done
              ? "Right — adding, a full group of 10 moves UP a column (carry); subtracting, you move a group DOWN from the next column to have enough to subtract (borrow)."
              : "Not quite — carrying and borrowing happen for different reasons (too much vs. not enough) and move in opposite directions."}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> Try the hardest case: solve 500 − 237. Notice the tens digit of 500 is 0 — there's nothing to borrow from there until it borrows from the hundreds first.
        </p>
        <VerticalOpWidget a={500} b={237} op="sub" onDone={() => setQ3Done(true)} />
        {q3Done && <p className="feedback good" role="alert">Right — 500 − 237 = 263. When the tens digit is 0, it has to borrow from the hundreds BEFORE it can lend anything to the ones.</p>}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>4.</b> True or False:{" "}
          <select className="answer" aria-label="true or false" value={q4} onChange={(e) => setQ4(e.target.value)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>{" "}
          — If a subtraction problem's tens digit is 0, you can just skip that column since there's nothing there to borrow.
        </p>
        {q4 && (
          <p className={`feedback ${q4Done ? "good" : "bad"}`} role="alert">
            {q4Done
              ? "False — like you just saw in 500 − 237, a 0 in the tens place means it has to borrow from the hundreds column first, not get skipped."
              : "Think back to question 3 — did the tens column of 500 get skipped?"}
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
  const [a, setA] = useState(347);
  const [b, setB] = useState(286);
  const [op, setOp] = useState<"add" | "sub">("add");

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
      {(introActive || showCheck) && <AddSubGate onComplete={onIntroDone} />}
      <div className="control-row">
        <label className="select">
          <span className="stepper-label">Operation</span>
          <select className="answer" value={op} onChange={(e) => setOp(e.target.value as "add" | "sub")}>
            <option value="add">Add</option>
            <option value="sub">Subtract</option>
          </select>
        </label>
      </div>
      <div className="control-row">
        <label className="select">
          <span className="stepper-label">First number</span>
          <input className="answer" inputMode="numeric" value={a} onChange={(e) => setA(Math.max(0, Math.min(999, Number(e.target.value.replace(/\D/g, "")) || 0)))} />
        </label>
        <label className="select">
          <span className="stepper-label">{op === "add" ? "Second number" : "Subtract"}</span>
          <input
            className="answer"
            inputMode="numeric"
            value={b}
            onChange={(e) => setB(Math.max(0, Math.min(op === "sub" ? a : 999, Number(e.target.value.replace(/\D/g, "")) || 0)))}
          />
        </label>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <PlaceValueBlocks hundreds={Math.floor(a / 100)} tens={Math.floor((a % 100) / 10)} ones={a % 10} tone="a" caption={`${a}`} />
        <div className="muted small center">{op === "add" ? "+" : "−"}</div>
        <PlaceValueBlocks hundreds={Math.floor(b / 100)} tens={Math.floor((b % 100) / 10)} ones={b % 10} tone="b" caption={`${b}`} />
      </div>
      <p className="muted small">
        {op === "add"
          ? `${a} + ${b} = ${a + b}. Look at the blocks above — when one place has 10 or more, it bundles into the next place up.`
          : `${a} − ${b} = ${Math.max(0, a - b)}. Look at the blocks above — when a place doesn't have enough, it borrows a bundle from the next place up.`}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE
// ============================================================================

function makeAddSubProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as AddSubBucket) ?? pick(ADDSUB_BUCKETS);
  const { a, b, op } = genForBucket(bucket);
  const breakdown = op === "add" ? addBreakdown(a, b) : subBreakdown(a, b);
  const result = breakdown.result;
  const regroups = breakdown.marks[0] + breakdown.marks[1];
  const symbol = op === "add" ? "+" : "−";

  return {
    title: op === "add" ? "Add within 1000" : "Subtract within 1000",
    bucket,
    story: `${a} ${symbol} ${b} = ?`,
    visual: (done: number) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <PlaceValueBlocks hundreds={Math.floor(a / 100)} tens={Math.floor((a % 100) / 10)} ones={a % 10} tone="a" caption={`${a}`} />
        <div className="muted small center">{symbol}</div>
        <PlaceValueBlocks hundreds={Math.floor(b / 100)} tens={Math.floor((b % 100) / 10)} ones={b % 10} tone="b" caption={`${b}`} />
        {done >= 1 && (
          <>
            <div className="muted small center">=</div>
            <PlaceValueBlocks hundreds={Math.floor(result / 100)} tens={Math.floor((result % 100) / 10)} ones={result % 10} tone="c" caption={`${result}`} />
          </>
        )}
      </div>
    ),
    steps: [
      customStep(
        {
          prompt: `Solve ${a} ${symbol} ${b} using the written ${op === "add" ? "addition" : "subtraction"} algorithm. Fill in every digit box, and the small ${
            op === "add" ? "carry" : "borrow"
          } boxes above the columns (use 0 when a column doesn't need to regroup).`,
          hint:
            op === "add"
              ? "Add the ones first. If that sum is 10 or more, write 1 in the small carry box above the tens column and carry that 1 into the tens column's own sum."
              : "Subtract the ones first. If the top digit is smaller than the bottom digit, borrow 1 ten from the next column — write 1 in the small borrow box above that column, and remember it reduces that column's own top digit by 1 too.",
          explain: `${a} ${symbol} ${b} = ${result}.`,
        },
        (onDone) => <VerticalOpWidget a={a} b={b} op={op} onDone={onDone} />,
        String(result)
      ),
      {
        kind: "number",
        prompt: `How many times did you have to ${op === "add" ? "carry a ten" : "borrow from the next place"} while solving this?`,
        hint: "Count the small boxes where you wrote a 1, not a 0.",
        explain:
          regroups === 0
            ? "No regrouping was needed here — every column's digits already fit without carrying or borrowing."
            : `You had to regroup ${regroups} time${regroups === 1 ? "" : "s"}.`,
        answer: regroups,
      },
    ],
    wrapUp: `${a} ${symbol} ${b} = ${result}.`,
  };
}

export const addSubWithin1000: Unit = {
  id: "addSubWithin1000",
  title: "Adding and Subtracting Within 1000",
  goal: "Add and subtract any two numbers up to 1000, using place value to keep track of hundreds, tens, and ones.",
  standard: "3.NBT.2",
  keyIdea: (
    <>
      <p>Line numbers up by place value — hundreds with hundreds, tens with tens, ones with ones — then work one column at a time, starting from the ones.</p>
      <p>When a column has too much (adding) or too little (subtracting), it regroups with its neighbor: 10 ones trade for 1 ten, and 10 tens trade for 1 hundred, in either direction.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Add & Subtract", make: makeAddSubProblem, buckets: [...ADDSUB_BUCKETS] }],
  requiredBuckets: [...ADDSUB_BUCKETS],
  test: addSubWithin1000Test,
};
