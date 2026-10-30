import { useEffect, useState } from "react";
import { ArrayGrid } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { rectangularArraysFindingTotalTest } from "./RectangularArraysFindingTotalTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions targeting the plan's named misconceptions:
// double-counting or skipping a row/column while reading the grid, and not
// recognizing that swapping which dimension is called "rows" doesn't change
// the total.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary question a rote total-counting drill never asks directly:
 *  which direction rows and columns actually run. */
function RowsAndColumnsDirectionQuestion({ onComplete }: { onComplete?: () => void }) {
  const [rowDir, setRowDir] = useState("");
  const [colDir, setColDir] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [rowDir, colDir].every((v) => String(v).trim() !== "");
  const ok1 = rowDir === "across";
  const ok2 = colDir === "updown";
  const ok = ok1 && ok2;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> In a rectangular array, which direction do ROWS go, and which direction do COLUMNS go?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Rows go:{" "}
          <select className="answer" value={rowDir} onChange={(e) => setRowDir(e.target.value)} style={fieldOk(ok1, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="across">Across (left to right)</option>
            <option value="updown">Up and down</option>
          </select>
        </label>
        <label>
          Columns go:{" "}
          <select className="answer" value={colDir} onChange={(e) => setColDir(e.target.value)} style={fieldOk(ok2, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="across">Across (left to right)</option>
            <option value="updown">Up and down</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — rows run across, columns run up and down." : "Not quite — ROWS run across (left to right); COLUMNS run up and down."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated adjacent concept: adding by rows and adding by
 *  columns both appear in one question, for the same array. */
function BothMethodsWorkQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "both";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> An array has 4 rows and 3 columns. Is the total found by adding 3 four times (3+3+3+3), by adding 4 three times (4+4+4), or by
        both?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="rows">Only 3+3+3+3</option>
          <option value="cols">Only 4+4+4</option>
          <option value="both">Both give the same total</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — both 3+3+3+3 (adding by rows) and 4+4+4 (adding by columns) total 12. Either way of adding the same array gives the same answer."
            : "Not quite — BOTH work. Adding by rows (3+3+3+3) and adding by columns (4+4+4) both total 12, since it's the same array either way."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: renaming rows/columns never changes
 *  the total. */
function RenamingDoesNotChangeTotalQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: if you call the rows "columns" and the columns "rows" instead, the array's total changes.
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
            ? "Correct — false. Swapping which dimension you call rows vs. columns never changes how many objects are actually in the array."
            : "Not quite — it's false. The array itself doesn't change just because you swap which dimension you call rows vs. columns."}
        </p>
      )}
    </div>
  );
}

/** Multi-part question targeting double-counting/skipping a row directly:
 *  fill in the running totals row by row. */
function RunningRowTotalsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [second, third].every((v) => String(v).trim() !== "");
  const ok1 = second === "8";
  const ok2 = third === "12";
  const ok = ok1 && ok2;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> A 3-row by 4-column array is counted row by row, keeping a running total: after row 1, the total is 4. Fill in the running
        total after row 2 and after row 3.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <span>4, </span>
        <label>
          After row 2:{" "}
          <select className="answer" value={second} onChange={(e) => setSecond(e.target.value)} style={fieldOk(ok1, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </label>
        <label>
          After row 3:{" "}
          <select className="answer" value={third} onChange={(e) => setThird(e.target.value)} style={fieldOk(ok2, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 4, 8, 12. Each new row adds exactly 4 more — skipping or double-counting a row would throw off every total after it."
            : "Not quite — each row adds exactly 4 more: 4, then 8, then 12. Double-counting or skipping a row changes every total that follows."}
        </p>
      )}
    </div>
  );
}

function ArrayTotalsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ direction: false, both: false, rename: false, running: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure reading rows and columns carefully makes sense before you try practice problems.</p>
      <RowsAndColumnsDirectionQuestion onComplete={mark("direction")} />
      <BothMethodsWorkQuestion onComplete={mark("both")} />
      <RenamingDoesNotChangeTotalQuestion onComplete={mark("rename")} />
      <RunningRowTotalsQuestion onComplete={mark("running")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(3);
  const [groupBy, setGroupBy] = useState<"row" | "col" | "none">("none");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Rows" value={rows} min={1} max={5} step={1} onChange={setRows} tone="a" />
        <Stepper label="Columns" value={cols} min={1} max={5} step={1} onChange={setCols} tone="b" />
        <Segmented
          label="Add by"
          value={groupBy}
          onChange={setGroupBy}
          options={[
            { id: "none", label: "Just look" },
            { id: "row", label: "Rows" },
            { id: "col", label: "Columns" },
          ]}
        />
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
      {(introActive || showCheck) && <ArrayTotalsCheckForUnderstanding onComplete={onIntroDone} />}

      <ArrayGrid rows={rows} cols={cols} tone="a" groupBy={groupBy} />
      <p className="muted small">
        {groupBy === "row" && `Adding by rows: ${cols} + ${cols}${rows > 2 ? " + ..." : rows === 2 ? "" : ""} (${rows} rows of ${cols}) = ${rows * cols}.`}
        {groupBy === "col" && `Adding by columns: ${rows} + ${rows}${cols > 2 ? " + ..." : cols === 2 ? "" : ""} (${cols} columns of ${rows}) = ${rows * cols}.`}
        {groupBy === "none" && `This array has ${rows} rows and ${cols} columns — ${rows * cols} objects total. Try "Rows" or "Columns" above to see how adding by each one works.`}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "smallArray" | "largerArray" | "rowsVsCols" | "orientationSwap";
const BUCKETS: Bucket[] = ["smallArray", "largerArray", "rowsVsCols", "orientationSwap"];

function arrayTotalProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "smallArray") {
    const [rows, cols] = pick([[2, 2], [2, 3], [3, 2]] as const);
    const total = rows * cols;
    return {
      title: "Array Total",
      bucket,
      story: `How many objects are in this array?`,
      visual: (done) => <ArrayGrid rows={rows} cols={cols} tone="a" groupBy={done >= 1 ? "row" : "none"} />,
      steps: [
        { kind: "number", prompt: `Add by rows. If each row has ${cols}, what's the running total after all ${rows} rows?`, hint: `Add ${cols} a total of ${rows} times.`, explain: `${Array(rows).fill(cols).join(" + ")} = ${total}.`, answer: total },
        { kind: "number", prompt: `So what's the total number of objects in the array?`, hint: "Same total as the step above.", explain: `The array has ${total} objects.`, answer: total },
      ],
      wrapUp: `${rows} rows of ${cols} make ${total} objects total.`,
    };
  }

  if (bucket === "largerArray") {
    const [rows, cols] = pick([[4, 5], [5, 4], [5, 5]] as const);
    const total = rows * cols;
    return {
      title: "Array Total",
      bucket,
      story: `How many objects are in this larger array?`,
      visual: (done) => <ArrayGrid rows={rows} cols={cols} tone="b" groupBy={done >= 1 ? "row" : "none"} />,
      steps: [
        { kind: "number", prompt: `Add by rows, 2 rows at a time. After the first 2 rows (each with ${cols}), what's the running total?`, hint: `${cols} + ${cols} = ?`, explain: `${cols} + ${cols} = ${cols * 2}.`, answer: cols * 2 },
        { kind: "number", prompt: `Now add the rest of the rows. What's the total number of objects in the whole array?`, hint: `There are ${rows} rows of ${cols} in all.`, explain: `${rows} rows of ${cols} = ${total}.`, answer: total },
      ],
      wrapUp: `${rows} rows of ${cols} make ${total} objects total.`,
    };
  }

  if (bucket === "rowsVsCols") {
    const rows = randInt(2, 5);
    const cols = randInt(2, 5);
    const total = rows * cols;
    return {
      title: "Array Total — two ways",
      bucket,
      story: `Find this array's total by adding ROWS, then check it by adding COLUMNS instead.`,
      visual: (done) => <ArrayGrid rows={rows} cols={cols} tone="a" groupBy={done === 0 ? "row" : done === 1 ? "col" : "none"} />,
      steps: [
        { kind: "number", prompt: `Add by ROWS: what's the total?`, hint: `${rows} rows of ${cols} each.`, explain: `${rows} rows of ${cols} = ${total}.`, answer: total },
        { kind: "number", prompt: `Now add by COLUMNS instead: what's the total?`, hint: `${cols} columns of ${rows} each.`, explain: `${cols} columns of ${rows} = ${total}.`, answer: total },
        choice({ prompt: "Do the two methods give the same total?", hint: "It's the exact same array either way.", explain: "Yes — adding by rows or by columns always gives the same total for the same array." }, "Yes", ["No"]),
      ],
      wrapUp: `Whether you add by rows or by columns, this array totals ${total}.`,
    };
  }

  // orientationSwap — the same number of objects, shown rotated.
  const rows = randInt(2, 5);
  let cols = randInt(2, 5);
  while (cols === rows) cols = randInt(2, 5);
  const total = rows * cols;
  return {
    title: "Array Total — rotated",
    bucket,
    story: `This array has ${rows} rows of ${cols}. Then the SAME objects are shown rotated, as ${cols} rows of ${rows}.`,
    visual: (done) => (done < 2 ? <ArrayGrid rows={rows} cols={cols} tone="a" groupBy="none" /> : <ArrayGrid rows={cols} cols={rows} tone="c" groupBy="none" />),
    steps: [
      { kind: "number", prompt: `This array has ${rows} rows of ${cols}. What's the total?`, hint: `${rows} rows of ${cols} each.`, explain: `${rows} rows of ${cols} = ${total}.`, answer: total },
      { kind: "number", prompt: `The SAME objects are rearranged as ${cols} rows of ${rows}. What's the total now?`, hint: "Rotating the array doesn't change how many objects there are.", explain: `${cols} rows of ${rows} is still ${total}.`, answer: total },
      choice({ prompt: "Does flipping which dimension is rows and which is columns change the total?", hint: "Same objects, just turned.", explain: "No — rotating the array never changes the total." }, "No", ["Yes"]),
    ],
    wrapUp: `${rows} rows of ${cols}, or ${cols} rows of ${rows} — either way, it's ${total} objects.`,
  };
}

export const rectangularArraysFindingTotal: Unit = {
  id: "rectangularArraysFindingTotal",
  title: "Rectangular Arrays — Finding the Total",
  goal: "Count the total number of objects in a grid arranged in equal rows and columns, by adding.",
  standard: "2.OA.4",
  keyIdea: (
    <>
      <p>A rectangular array's total can be found by adding its rows together, or by adding its columns together — either way gives the same answer.</p>
      <p>Rotating which dimension you call "rows" and which you call "columns" never changes how many objects are actually there.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Array Totals", make: arrayTotalProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: rectangularArraysFindingTotalTest,
};
