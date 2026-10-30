import { useEffect, useState } from "react";
import { ArrayGrid } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { arraysAsEqualAddendEquationsTest } from "./ArraysAsEqualAddendEquationsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions targeting the plan's named misconception:
// flipping which array dimension becomes the addend's SIZE versus the
// NUMBER of addends — both numbers come from the same array, so it's an
// easy error to make confidently.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary question a rote "just write the equation" drill never asks
 *  directly: what each number in a repeated-addition equation represents. */
function WhatEachNumberMeansQuestion({ onComplete }: { onComplete?: () => void }) {
  const [repeated, setRepeated] = useState("");
  const [times, setTimes] = useState("");
  const [checked, setChecked] = useState(false);
  const ok1 = repeated === "size";
  const ok2 = times === "count";
  const ok = ok1 && ok2;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> In the equation 3 + 3 + 3 + 3 for an array: what does the repeated number (3) represent? What does the number of times it
        repeats (4) represent?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          The 3 is:{" "}
          <select className="answer" value={repeated} onChange={(e) => setRepeated(e.target.value)} style={fieldOk(ok1, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="size">The size of each row or column</option>
            <option value="count">How many rows or columns there are</option>
          </select>
        </label>
        <label>
          The 4 is:{" "}
          <select className="answer" value={times} onChange={(e) => setTimes(e.target.value)} style={fieldOk(ok2, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="size">The size of each row or column</option>
            <option value="count">How many rows or columns there are</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the repeated number is the SIZE of each group; how many times it repeats is the NUMBER of groups. It's easy to flip these."
            : "Not quite — the repeated number (3) is the SIZE of each group; the number of times it repeats (4) is how MANY groups there are."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated adjacent concept: adding by rows and adding by
 *  columns each produce a DIFFERENT equation for the SAME array. */
function RowEquationVsColumnEquationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [rowEq, setRowEq] = useState("");
  const [colEq, setColEq] = useState("");
  const [checked, setChecked] = useState(false);
  const ok1 = rowEq === "3333";
  const ok2 = colEq === "444";
  const ok = ok1 && ok2;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> An array has 4 rows and 3 columns. Which equation adds it by ROWS? Which equation adds it by COLUMNS?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          By rows:{" "}
          <select className="answer" value={rowEq} onChange={(e) => setRowEq(e.target.value)} style={fieldOk(ok1, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3333">3 + 3 + 3 + 3</option>
            <option value="444">4 + 4 + 4</option>
          </select>
        </label>
        <label>
          By columns:{" "}
          <select className="answer" value={colEq} onChange={(e) => setColEq(e.target.value)} style={fieldOk(ok2, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3333">3 + 3 + 3 + 3</option>
            <option value="444">4 + 4 + 4</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — adding by rows means 4 groups of size 3 (3+3+3+3); adding by columns means 3 groups of size 4 (4+4+4)."
            : "Not quite — by ROWS: 4 groups of size 3, so 3+3+3+3. By COLUMNS: 3 groups of size 4, so 4+4+4."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap, exactly as the plan describes: do
 *  3+3+3+3 and 4+4+4 contradict each other, or can both describe the SAME
 *  array? */
function BothEquationsSameArrayQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: 3 + 3 + 3 + 3 and 4 + 4 + 4 could BOTH be correct equations for the same array.
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
            ? "Correct — true. A 4-row, 3-column array adds to 3+3+3+3 by rows AND 4+4+4 by columns — same array, both equations, same total of 12."
            : "Not quite — it's true. A 4-row, 3-column array gives 3+3+3+3 added by rows and 4+4+4 added by columns — both describe the exact same array."}
        </p>
      )}
    </div>
  );
}

/** Multi-part reverse-direction question: given an equation, reconstruct
 *  the array's dimensions and total. */
function ReverseFromEquationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [rowsAns, setRowsAns] = useState("");
  const [totalAns, setTotalAns] = useState("");
  const [checked, setChecked] = useState(false);
  const ok1 = rowsAns === "3";
  const ok2 = totalAns === "12";
  const ok = ok1 && ok2;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> An array's equation is 4 + 4 + 4 (three 4's added). How many groups of 4 are there? What's the total?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Number of groups:{" "}
          <select className="answer" value={rowsAns} onChange={(e) => setRowsAns(e.target.value)} style={fieldOk(ok1, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="4">4</option>
            <option value="3">3</option>
          </select>
        </label>
        <label>
          Total:{" "}
          <select className="answer" value={totalAns} onChange={(e) => setTotalAns(e.target.value)} style={fieldOk(ok2, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="7">7</option>
            <option value="12">12</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the number is repeated 3 times, so there are 3 groups of 4, totaling 12. The number of TERMS tells you the group count, not the group size."
            : "Not quite — 4 + 4 + 4 has 3 terms, so there are 3 groups of 4 — not 4 groups. 3 groups of 4 = 12 total."}
        </p>
      )}
    </div>
  );
}

function ArrayEquationsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ meaning: false, rowCol: false, both: false, reverse: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure you can tell a group's SIZE apart from how MANY groups there are before you try practice problems.</p>
      <WhatEachNumberMeansQuestion onComplete={mark("meaning")} />
      <RowEquationVsColumnEquationQuestion onComplete={mark("rowCol")} />
      <BothEquationsSameArrayQuestion onComplete={mark("both")} />
      <ReverseFromEquationQuestion onComplete={mark("reverse")} />
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
  const [groupBy, setGroupBy] = useState<"row" | "col">("row");

  const addend = groupBy === "row" ? cols : rows;
  const count = groupBy === "row" ? rows : cols;
  const equation = Array(count).fill(addend).join(" + ");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Rows" value={rows} min={2} max={5} step={1} onChange={setRows} tone="a" />
        <Stepper label="Columns" value={cols} min={2} max={5} step={1} onChange={setCols} tone="b" />
        <Segmented label="Add by" value={groupBy} onChange={setGroupBy} options={[{ id: "row", label: "Rows" }, { id: "col", label: "Columns" }]} />
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
      {(introActive || showCheck) && <ArrayEquationsCheckForUnderstanding onComplete={onIntroDone} />}

      <ArrayGrid rows={rows} cols={cols} tone="a" groupBy={groupBy} />
      <p className="muted small">
        Adding by {groupBy === "row" ? "rows" : "columns"}: {equation} = {rows * cols}. The repeated number ({addend}) is the SIZE of each group;
        it repeats {count} times because that's how MANY groups there are.
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "addByRows" | "addByCols" | "reverseFromEquation" | "trueFalseFlip";
const BUCKETS: Bucket[] = ["addByRows", "addByCols", "reverseFromEquation", "trueFalseFlip"];

/** rows !== cols always, so addend-size and addend-count are genuinely
 *  distinguishable numbers — a square array would make the two trivially
 *  identical and defeat the point of this unit's buckets. */
function randomNonSquareArray(): [number, number] {
  const rows = randInt(2, 5);
  let cols = randInt(2, 5);
  while (cols === rows) cols = randInt(2, 5);
  return [rows, cols];
}

function arrayEquationProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  const [rows, cols] = randomNonSquareArray();
  const total = rows * cols;

  if (bucket === "addByRows") {
    return {
      title: "Write the Equation — by Rows",
      bucket,
      story: `Write this array's total as a sum of equal addends, adding by ROWS.`,
      visual: () => <ArrayGrid rows={rows} cols={cols} tone="a" groupBy="row" />,
      steps: [
        { kind: "number", prompt: "Adding by rows, what number do you add, over and over (the size of ONE row)?", hint: "Each row has the same number of objects.", explain: `Each row has ${cols}.`, answer: cols },
        { kind: "number", prompt: "How many times do you add that number (how many rows)?", hint: "Count the rows.", explain: `There are ${rows} rows.`, answer: rows },
        { kind: "number", prompt: "What's the total?", hint: `Add ${cols} a total of ${rows} times.`, explain: `${Array(rows).fill(cols).join(" + ")} = ${total}.`, answer: total },
      ],
      wrapUp: `By rows: ${Array(rows).fill(cols).join(" + ")} = ${total}.`,
    };
  }

  if (bucket === "addByCols") {
    return {
      title: "Write the Equation — by Columns",
      bucket,
      story: `Write this array's total as a sum of equal addends, adding by COLUMNS.`,
      visual: () => <ArrayGrid rows={rows} cols={cols} tone="b" groupBy="col" />,
      steps: [
        { kind: "number", prompt: "Adding by columns, what number do you add, over and over (the size of ONE column)?", hint: "Each column has the same number of objects.", explain: `Each column has ${rows}.`, answer: rows },
        { kind: "number", prompt: "How many times do you add that number (how many columns)?", hint: "Count the columns.", explain: `There are ${cols} columns.`, answer: cols },
        { kind: "number", prompt: "What's the total?", hint: `Add ${rows} a total of ${cols} times.`, explain: `${Array(cols).fill(rows).join(" + ")} = ${total}.`, answer: total },
      ],
      wrapUp: `By columns: ${Array(cols).fill(rows).join(" + ")} = ${total}.`,
    };
  }

  if (bucket === "reverseFromEquation") {
    // Given an equation, reconstruct the array: how many groups, how big is
    // each group, and the total — the reverse direction from the other
    // buckets (equation -> array, not array -> equation).
    const addend = cols;
    const count = rows;
    return {
      title: "Reconstruct the Array",
      bucket,
      story: `An array's equation is ${Array(count).fill(addend).join(" + ")} (${addend} added ${count} times).`,
      visual: (done) => <ArrayGrid rows={done >= 2 ? rows : 1} cols={cols} tone="c" groupBy={done >= 2 ? "row" : "none"} />,
      steps: [
        { kind: "number", prompt: "How many groups are being added (how many terms in the equation)?", hint: `Count the number of ${addend}'s.`, explain: `There are ${count} groups.`, answer: count },
        { kind: "number", prompt: "How many objects are in each group?", hint: "That's the repeated number itself.", explain: `Each group has ${addend}.`, answer: addend },
        { kind: "number", prompt: "What's the total?", hint: `Add ${addend} a total of ${count} times.`, explain: `${Array(count).fill(addend).join(" + ")} = ${total}.`, answer: total },
      ],
      wrapUp: `${Array(count).fill(addend).join(" + ")} = ${total} — ${count} groups of ${addend}, arranged as a ${count}-row by ${addend}-column array.`,
    };
  }

  // trueFalseFlip — which equation adds by rows, which by columns, and
  // confirming both can describe the same array.
  const rowEq = Array(rows).fill(cols).join(" + ");
  const colEq = Array(cols).fill(rows).join(" + ");
  return {
    title: "Rows or Columns — Which Equation?",
    bucket,
    story: `This array can be added two ways. Which equation adds it by ROWS? Which adds it by COLUMNS?`,
    visual: (done) => <ArrayGrid rows={rows} cols={cols} tone="a" groupBy={done === 0 ? "row" : done === 1 ? "col" : "none"} />,
    steps: [
      choice({ prompt: "Which equation adds this array by ROWS?", hint: `There are ${rows} rows, each of size ${cols}.`, explain: `By rows: ${rowEq}.` }, rowEq, [colEq]),
      choice({ prompt: "Which equation adds this array by COLUMNS?", hint: `There are ${cols} columns, each of size ${rows}.`, explain: `By columns: ${colEq}.` }, colEq, [rowEq]),
      choice({ prompt: "True or false: both equations can correctly describe this same array.", hint: "One adds by rows, the other by columns — same array either way.", explain: "True — they're two correct ways of adding the exact same array." }, "True", ["False"]),
    ],
    wrapUp: `By rows: ${rowEq}. By columns: ${colEq}. Both equal ${total} — both describe this same array.`,
  };
}

export const arraysAsEqualAddendEquations: Unit = {
  id: "arraysAsEqualAddendEquations",
  title: "Arrays as Equal-Addend Equations",
  goal: "Write an array's total as a sum of equal addends, like 4 rows of 3 as 3 + 3 + 3 + 3.",
  standard: "2.OA.4",
  keyIdea: (
    <>
      <p>Adding an array by rows gives a different-looking (but equally correct) equation than adding it by columns.</p>
      <p>The repeated number is the SIZE of each group; how many times it repeats is the NUMBER of groups — it's easy to flip these, since both numbers come from the same array.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Array Equations", make: arrayEquationProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: arraysAsEqualAddendEquationsTest,
};
