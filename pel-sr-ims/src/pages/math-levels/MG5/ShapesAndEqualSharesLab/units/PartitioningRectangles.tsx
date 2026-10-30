import { useEffect, useState } from "react";
import { PartitionGrid } from "../diagrams/PartitionGrid";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { partitioningRectanglesTest } from "./PartitioningRectanglesTest";

function fieldStyle(ok: boolean, checked: boolean) {
  if (!checked) return {};
  return ok ? { borderColor: "var(--good)", background: "var(--good-soft)" } : { borderColor: "var(--bad)", background: "var(--bad-soft)" };
}

/** A repeated-addition expression string, e.g. "4 + 4 + 4". */
function repeatedAdd(perRow: number, rows: number): string {
  return Array.from({ length: rows }, () => perRow).join(" + ");
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1 — vocabulary: rows, columns, and the total via a two-blank sentence. */
function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [rowsVal, setRowsVal] = useState("");
  const [totalVal, setTotalVal] = useState("");
  const [checked, setChecked] = useState(false);
  const okRows = rowsVal === "3";
  const okTotal = totalVal === "12";
  const ok = okRows && okTotal;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> This rectangle is split into equal rows and columns of same-size squares:
      </p>
      <PartitionGrid rows={3} cols={4} width={140} height={110} label="A rectangle split into 3 rows and 4 columns of equal squares" />
      <p>
        It has{" "}
        <select className="answer" style={{ width: 60, ...fieldStyle(okRows, checked) }} value={rowsVal} onChange={(e) => setRowsVal(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>{" "}
        rows, each with 4 squares, so the total number of squares is{" "}
        <select className="answer" style={{ width: 70, ...fieldStyle(okTotal, checked) }} value={totalVal} onChange={(e) => setTotalVal(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="7">7</option>
          <option value="12">12</option>
        </select>
        .
      </p>
      <button className="btn primary" type="button" onClick={() => setChecked(true)}>
        Check Answer
      </button>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Right — 3 rows of 4: 4 + 4 + 4 = 12 squares total." : "Not quite — count the rows, then add each row's 4 squares together."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the required uneven-squares trap: looks partitioned, isn't equal. */
function UnevenTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["No — the pieces are different sizes.", "Yes — it's split into a grid."];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Look at this rectangle:
      </p>
      <PartitionGrid rows={3} cols={4} uneven unevenVariant={0} width={140} height={110} label="A rectangle split into a grid, but the pieces are not equal size" />
      <p>Are these really equal-size squares, like a proper rows-and-columns partition needs?</p>
      <div className="choices" role="group">
        {options.map((o, i) => (
          <button key={i} className="choice" onClick={() => setPicked(i)} disabled={ok} style={fieldStyle(i === 0, picked === i)}>
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Right — the pieces are clearly different sizes, so this isn't really partitioned into equal squares yet." : "Look closely — compare the widths and heights of a few different pieces."}
        </p>
      )}
    </div>
  );
}

/** Q3 — the required border-miscount trap. */
function BorderMiscountQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["No — you have to count every square in the whole grid, not just the edge.", "Yes — the edge squares are all that matter."];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> This rectangle is split into 3 rows and 4 columns of equal squares:
      </p>
      <PartitionGrid rows={3} cols={4} width={140} height={110} label="A rectangle split into 3 rows and 4 columns of equal squares" />
      <p>Someone counted only the squares around the outside edge and said there are 10 squares total. Is that the right way to count the total?</p>
      <div className="choices" role="group">
        {options.map((o, i) => (
          <button key={i} className="choice" onClick={() => setPicked(i)} disabled={ok} style={fieldStyle(i === 0, picked === i)}>
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Right — the middle square(s) count too! The real total is all 3 rows × 4, counted by adding every row: 4 + 4 + 4 = 12." : "Not quite — this grid has an inside square too, not just an edge. Count every row fully."}
        </p>
      )}
    </div>
  );
}

/** Q4 — generalization / true-false: total = sum of every row's count. */
function AddRowsTrueFalseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"true" | "false" | null>(null);
  const ok = picked === "true";
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or False: if every row of a partitioned rectangle has the same number of equal squares, you can find the total by adding up every row's
        count.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        {(["true", "false"] as const).map((v) => (
          <button key={v} type="button" className="choice" disabled={ok} onClick={() => setPicked(v)} style={fieldStyle(v === "true", picked === v)}>
            {v === "true" ? "True" : "False"}
          </button>
        ))}
      </div>
      {picked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "True — adding every row's count together (repeated addition) always gives the total number of squares."
            : "Not quite — think about a 3-row, 4-column grid: 4 + 4 + 4 does give the right total, 12."}
        </p>
      )}
    </div>
  );
}

function PartitioningCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ q1: false, q2: false, q3: false, q4: false });
  const allDone = done.q1 && done.q2 && done.q3 && done.q4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure partitioning and counting squares makes sense before you try practice problems.</p>
      <VocabQuestion onComplete={() => setDone((d) => ({ ...d, q1: true }))} />
      <UnevenTrapQuestion onComplete={() => setDone((d) => ({ ...d, q2: true }))} />
      <BorderMiscountQuestion onComplete={() => setDone((d) => ({ ...d, q3: true }))} />
      <AddRowsTrueFalseQuestion onComplete={() => setDone((d) => ({ ...d, q4: true }))} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [uneven, setUneven] = useState<"equal" | "uneven">("equal");

  const total = rows * cols;

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
      {(introActive || showCheck) && <PartitioningCheck onComplete={onIntroDone} />}
      <div className="control-row">
        <Stepper label="Rows" value={rows} min={2} max={6} step={1} onChange={setRows} tone="a" />
        <Stepper label="Columns" value={cols} min={2} max={6} step={1} onChange={setCols} tone="b" />
      </div>
      <Segmented label="Equal squares?" value={uneven} onChange={setUneven} options={[{ id: "equal", label: "Equal squares" }, { id: "uneven", label: "Uneven (trap)" }]} />
      <PartitionGrid rows={rows} cols={cols} uneven={uneven === "uneven"} width={220} height={160} />
      <p className="muted small">
        {uneven === "equal"
          ? `This rectangle is split into ${rows} equal rows and ${cols} equal columns. Add each row's ${cols} squares: ${repeatedAdd(cols, rows)} = ${total} squares total.`
          : `This grid LOOKS partitioned, but the pieces aren't actually the same size — so we can't count it as a clean ${rows}-row by ${cols}-column grid of equal squares.`}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE — one ProblemType per bucket
// ============================================================================

function partitionCountProblem(): Problem {
  const rows = randInt(2, 5);
  const cols = randInt(2, 5);
  const total = rows * cols;

  return {
    title: "Partition and count",
    bucket: "partition-count",
    story: `A rectangle is split into ${rows} equal rows and ${cols} equal columns of same-size squares.`,
    visual: () => <PartitionGrid rows={rows} cols={cols} width={180} height={130} />,
    steps: [
      { kind: "number", prompt: "How many squares are in each row?", hint: "Count across one row.", explain: `Each row has ${cols} squares — that's the column count.`, answer: cols },
      {
        kind: "number",
        prompt: `Add ${cols} a total of ${rows} times (${repeatedAdd(cols, rows)}). What's the total number of squares?`,
        hint: "Add the rows one at a time.",
        explain: `${repeatedAdd(cols, rows)} = ${total} squares total.`,
        answer: total,
      },
    ],
    wrapUp: `${rows} rows of ${cols}: ${repeatedAdd(cols, rows)} = ${total} squares.`,
  };
}

function addAcrossRowsProblem(): Problem {
  const rows = randInt(2, 5);
  const cols = randInt(2, 5);
  const total = rows * cols;

  return {
    title: "Add up the rows",
    bucket: "add-across-rows",
    story: `This rectangle is ALREADY partitioned into equal rows and columns of same-size squares.`,
    visual: (done: number) => <PartitionGrid rows={rows} cols={cols} highlightRow={Math.min(rows - 1, done)} width={180} height={130} />,
    steps: [
      { kind: "number", prompt: "How many squares does each row have?", hint: "Count any one full row.", explain: `Every row has ${cols} squares.`, answer: cols },
      {
        kind: "number",
        prompt: `Now add up all ${rows} rows: ${repeatedAdd(cols, rows)}. What's the total?`,
        hint: "Add one row at a time, keeping a running total.",
        explain: `${repeatedAdd(cols, rows)} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: `Adding every row (${repeatedAdd(cols, rows)}) gives ${total} squares total.`,
  };
}

function unevenTrapProblem(): Problem {
  const rows = randInt(2, 4);
  const cols = randInt(3, 5);
  const variant = randInt(0, 2);

  return {
    title: "Is this really partitioned into equal squares?",
    bucket: "uneven-trap",
    story: `This rectangle is split into a grid of pieces.`,
    visual: () => <PartitionGrid rows={rows} cols={cols} uneven unevenVariant={variant} width={180} height={130} />,
    steps: [
      choice(
        { prompt: "Are all the pieces the same size?", hint: "Compare a few pieces' widths and heights.", explain: "No — the pieces are clearly different sizes." },
        "No",
        ["Yes"]
      ),
      choice(
        { prompt: "So is this a proper rows-and-columns partition into equal squares?", hint: "A real partition needs every piece to be the same size, not just arranged in a grid pattern.", explain: "No — even though it's arranged in rows and columns, the pieces aren't equal size, so it's not a true partition into equal squares yet." },
        "No — the pieces have to be equal size, and these aren't.",
        ["Yes — it's arranged in a grid, so that's enough."]
      ),
    ],
    wrapUp: "Being arranged in a grid pattern isn't enough — every piece has to be the same size to count as a true partition into equal squares.",
  };
}

function reverseProblem(): Problem {
  const perRow = randInt(2, 6);
  const rows = randInt(2, 5);
  const total = perRow * rows;

  return {
    title: "Find the missing count",
    bucket: "reverse",
    story: `A rectangle is split into equal rows of ${perRow} squares each. The whole rectangle has ${total} squares total.`,
    visual: () => <PartitionGrid rows={1} cols={perRow} width={140} height={60} label={`One row of ${perRow} squares`} />,
    steps: [
      {
        kind: "number",
        prompt: `Keep adding ${perRow} until you reach ${total}. How many rows does that take?`,
        hint: `Count by ${perRow}s: ${repeatedAdd(perRow, rows)} — how many ${perRow}s is that?`,
        explain: `${repeatedAdd(perRow, rows)} = ${total}, and that's ${rows} rows of ${perRow}.`,
        answer: rows,
      },
    ],
    wrapUp: `It takes ${rows} rows of ${perRow} to reach ${total} squares total.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <PartitionGrid rows={3} cols={4} width={140} height={110} />;
}

export const partitioningRectangles: Unit = {
  id: "partitioningRectangles",
  title: "Partitioning Rectangles into Rows and Columns",
  goal: "Split a rectangle into equal-size square rows and columns, then count the total squares by adding across rows.",
  standard: "2.G.2",
  keyIdea: (
    <>
      <p>Splitting a rectangle into rows and columns of SAME-SIZE squares lets you count the total by adding up how many squares are in each row.</p>
      <p>Pieces arranged in a grid pattern aren't a true partition unless every piece is actually the same size — and the total needs every row counted, not just the edge.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "Partition and count", make: partitionCountProblem, buckets: ["partition-count"] },
    { label: "Add up the rows", make: addAcrossRowsProblem, buckets: ["add-across-rows"] },
    { label: "Equal squares?", make: unevenTrapProblem, buckets: ["uneven-trap"] },
    { label: "Find the missing count", make: reverseProblem, buckets: ["reverse"] },
  ],
  requiredBuckets: ["partition-count", "add-across-rows", "uneven-trap", "reverse"],
  test: partitioningRectanglesTest,
};
