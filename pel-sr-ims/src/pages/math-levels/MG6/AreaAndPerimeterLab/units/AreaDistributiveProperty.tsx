import { useEffect, useState } from "react";
import { RectanglePieces } from "../diagrams/RectanglePieces";
import { pieceArea, splitRectangleAt, type AreaPiece } from "../lib/grid";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { areaDistributivePropertyTest } from "./AreaDistributivePropertyTest";

// Note on the grade-6 thread: MM1/ExponentsAndExpressionsLab's "Equivalent
// Expressions via Properties" unit later writes this same idea symbolically
// as a(b + c) = ab + ac, using shared/diagrams/FactorRectangle's `splitCols`
// (rows kept whole, columns split). This unit deliberately uses the SAME
// orientation — the rows (height) stay whole and the cut splits the columns
// (width) — so the grade-3 picture and the grade-6 picture match.

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1 — vocabulary-level: what the cut actually does to the area. */
function SplitKeepsAreaQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const CORRECT = "The total area stays the same — it's just split into two parts";
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> You cut a 6 × 7 rectangle into a 6 × 5 piece and a 6 × 2 piece. What happens to the total area?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)}>
          <option value="" disabled>
            choose
          </option>
          <option value={CORRECT}>{CORRECT}</option>
          <option value="The total area gets bigger, because there are more pieces">The total area gets bigger, because there are more pieces</option>
          <option value="The total area gets smaller, because you cut it">The total area gets smaller, because you cut it</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — no unit squares are added or thrown away: 6 × 5 + 6 × 2 = 30 + 12 = 42 = 6 × 7." : "Not quite — cutting doesn't add or remove any unit squares. Every square is still there, just in one of two pieces."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the plan's "wrong dimension" misconception: both pieces keep the
 *  FULL height; a multi-part dropdown so the student fills in each piece's
 *  two side lengths rather than picking one trivia answer. */
function CarryFullHeightQuestion({ onComplete }: { onComplete?: () => void }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = a === "4" && b === "4";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> A 4 × 9 rectangle (4 rows tall, 9 columns wide) is cut into a left piece 6 columns wide and a right piece 3 columns wide. How tall is each piece?
      </p>
      <RectanglePieces pieces={splitRectangleAt(4, 9, 6).map((p) => ({ ...p, label: "?" }))} cellPx={24} showGrid />
      <p>
        Left piece: <select className="answer" value={a} onChange={(e) => setA(e.target.value)}>
          <option value="" disabled>?</option>
          {["2", "3", "4", "6"].map((v) => <option key={v} value={v}>{v} rows tall</option>)}
        </select>{" "}
        Right piece: <select className="answer" value={b} onChange={(e) => setB(e.target.value)}>
          <option value="" disabled>?</option>
          {["1", "2", "3", "4"].map((v) => <option key={v} value={v}>{v} rows tall</option>)}
        </select>
      </p>
      <div className="control-row">
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the cut only splits the WIDTH. Both pieces are still the full 4 rows tall: 4 × 6 + 4 × 3 = 24 + 12 = 36 = 4 × 9."
            : "Not quite — a straight up-and-down cut splits only the width. Each piece still stretches the full height of the original rectangle."}
        </p>
      )}
    </div>
  );
}

/** Q3 — true/false generalization: ANY split of the same rectangle gives
 *  the same total, not just one lucky split. */
function AlwaysTrueQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"" | "true" | "false">("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: Maria splits a 5 × 8 rectangle into 5 × 4 + 5 × 4. Jon splits the same rectangle into 5 × 7 + 5 × 1. They will get the same total area.
      </p>
      <div className="control-row">
        <button className={`btn ghost ${picked === "true" ? "pressed" : ""}`} type="button" onClick={() => setPicked("true")}>True</button>
        <button className={`btn ghost ${picked === "false" ? "pressed" : ""}`} type="button" onClick={() => setPicked("false")}>False</button>
        <button className="btn primary" type="button" disabled={!picked} onClick={() => setChecked(true)}>Check Answer</button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "True — 20 + 20 = 40 and 35 + 5 = 40. Splitting works no matter where you cut, because every unit square still gets counted exactly once."
            : "Not quite — check it: 5 × 4 + 5 × 4 = 40, and 5 × 7 + 5 × 1 = 40. It's always the same, wherever the cut goes."}
        </p>
      )}
    </div>
  );
}

/** Q4 — explain WHY in the student's own words, built as a two-blank
 *  sentence (dropdowns) rather than free text so it's gradeable. */
function ExplainWhyQuestion({ onComplete }: { onComplete?: () => void }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = a === "counted once" && b === "add";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Finish the explanation: splitting and adding gives the same answer as multiplying the whole rectangle, because every unit square is{" "}
        <select className="answer" value={a} onChange={(e) => setA(e.target.value)}>
          <option value="" disabled>choose</option>
          <option value="counted once">still counted exactly once</option>
          <option value="counted twice">counted twice, once in each piece</option>
          <option value="thrown away">thrown away along the cut</option>
        </select>
        , so we{" "}
        <select className="answer" value={b} onChange={(e) => setB(e.target.value)}>
          <option value="" disabled>choose</option>
          <option value="add">add the two pieces' areas</option>
          <option value="multiply">multiply the two pieces' areas</option>
        </select>
        .
      </p>
      <div className="control-row">
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>Check Answer</button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Exactly — each square lands in exactly one piece, so adding the pieces gives back the whole." : "Not quite — think about one unit square. After the cut, how many pieces is it in? And to combine two pieces' areas, do we add or multiply?"}
        </p>
      )}
    </div>
  );
}

function CheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ keeps: false, height: false, always: false, why: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill" style={{ display: "grid", gap: 18 }}>
      <p className="intro-gate-title">Check for understanding: does splitting a rectangle always keep the same area?</p>
      <SplitKeepsAreaQuestion onComplete={mark("keeps")} />
      <CarryFullHeightQuestion onComplete={mark("height")} />
      <AlwaysTrueQuestion onComplete={mark("always")} />
      <ExplainWhyQuestion onComplete={mark("why")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(8);
  const [splitAt, setSplitAt] = useState(5);
  const safeSplit = Math.min(Math.max(1, splitAt), cols - 1);
  const pieces = splitRectangleAt(rows, cols, safeSplit);
  const [left, right] = pieces;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="rows (height)" value={rows} min={2} max={9} onChange={setRows} tone="a" />
        <Stepper label="columns (width)" value={cols} min={3} max={12} onChange={(v) => { setCols(v); setSplitAt((s) => Math.min(s, v - 1)); }} tone="b" />
        <Stepper label="cut after column" value={safeSplit} min={1} max={cols - 1} onChange={setSplitAt} tone="c" />
        {!introActive && (
          <button type="button" className={`btn ghost ${showCheck ? "pressed" : ""}`} onClick={() => setShowCheck((v) => !v)}>
            Check for Understanding
          </button>
        )}
      </div>
      <p className="muted small">Drag the purple handle (or use the stepper) to move the cut. Watch the two parts change — but the total never does.</p>
      <RectanglePieces pieces={pieces} cellPx={30} showGrid drag={{ value: safeSplit, min: 1, max: cols - 1, onChange: setSplitAt }} />
      <p className="says">
        {rows} × {cols} = {rows} × {left.w} + {rows} × {right.w} → {rows * cols} = {pieceArea(left)} + {pieceArea(right)}
      </p>
      {(introActive || showCheck) && <CheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — splitting a rectangle (distributive property)
// ============================================================================

type Bucket = "splitGiven" | "chooseSplit" | "twoSplits" | "joinedRectangles";
const BUCKETS: Bucket[] = ["splitGiven", "chooseSplit", "twoSplits", "joinedRectangles"];

function distributiveProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);

  if (bucket === "splitGiven") {
    const rows = randInt(3, 9);
    const cols = randInt(5, 12);
    const splitAt = randInt(2, cols - 2);
    const [a, b] = splitRectangleAt(rows, cols, splitAt);
    return {
      title: "Add the two parts",
      bucket,
      story: `This ${rows} × ${cols} rectangle has been cut into two parts.`,
      visual: (done: number) => (
        <RectanglePieces
          pieces={[{ ...a, label: done >= 1 ? undefined : `${rows} × ${a.w}` }, { ...b, label: done >= 2 ? undefined : `${rows} × ${b.w}` }]}
          cellPx={26}
          showGrid
        />
      ),
      steps: [
        {
          kind: "number",
          prompt: `What is the area of the left part (${rows} × ${a.w})?`,
          hint: `The left part is still the full ${rows} rows tall and ${a.w} columns wide.`,
          explain: `${rows} × ${a.w} = ${pieceArea(a)}.`,
          answer: pieceArea(a),
        },
        {
          kind: "number",
          prompt: `What is the area of the right part (${rows} × ${b.w})?`,
          hint: `The right part is ALSO the full ${rows} rows tall — only its width changed.`,
          explain: `${rows} × ${b.w} = ${pieceArea(b)}.`,
          answer: pieceArea(b),
        },
        {
          kind: "number",
          prompt: "What is the total area of the whole rectangle?",
          hint: `${pieceArea(a)} + ${pieceArea(b)} = ?`,
          explain: `${pieceArea(a)} + ${pieceArea(b)} = ${rows * cols}, the same as ${rows} × ${cols}.`,
          answer: rows * cols,
        },
      ],
      wrapUp: `${rows} × ${cols} = ${rows} × ${a.w} + ${rows} × ${b.w} = ${pieceArea(a)} + ${pieceArea(b)} = ${rows * cols}.`,
    };
  }

  if (bucket === "chooseSplit") {
    // Whole fact with a width of 6-9, split into 5 + (width-5): "friendly" 5s.
    const cols = randInt(6, 9);
    const rest = cols - 5;
    // rows can't be 5 or `rest`, or a named-mistake distractor below would
    // render as the exact same text as the correct split.
    let rows = randInt(3, 9);
    while (rows === 5 || rows === rest) rows = randInt(3, 9);
    const [a, b] = splitRectangleAt(rows, cols, 5);
    return {
      title: "Choose a friendly split",
      bucket,
      story: `${rows} × ${cols} is tricky. Split the ${cols} columns into 5 and ${rest} to make two friendlier facts.`,
      visual: (done: number) => (done >= 1 ? <RectanglePieces pieces={[a, b]} cellPx={26} showGrid /> : <RectanglePieces pieces={[{ x: 0, y: 0, w: cols, h: rows, tone: "a", label: `${rows} × ${cols}` }]} cellPx={26} showGrid />),
      steps: [
        choice(
          {
            prompt: `Which split matches ${rows} × ${cols}?`,
            hint: `Both parts keep all ${rows} rows. Only the ${cols} columns get split into 5 + ${rest}.`,
            explain: `${rows} × ${cols} = ${rows} × 5 + ${rows} × ${rest}, since 5 + ${rest} = ${cols}.`,
          },
          `${rows} × 5 + ${rows} × ${rest}`,
          // Named mistake: the second part loses the full height (uses the
          // leftover width as BOTH dimensions).
          [`${rows} × 5 + ${rest} × ${rest}`, `${rows} × 5 + 5 × ${rest}`]
        ),
        {
          kind: "ratio",
          tones: ["a", "b"],
          labels: [`${rows} × 5`, `${rows} × ${rest}`],
          prompt: "Find each part's area.",
          hint: `${rows} × 5 = ? and ${rows} × ${rest} = ?`,
          explain: `${rows} × 5 = ${rows * 5} and ${rows} × ${rest} = ${rows * rest}.`,
          answer: [rows * 5, rows * rest],
        },
        {
          kind: "number",
          prompt: `So what is ${rows} × ${cols}?`,
          hint: `${rows * 5} + ${rows * rest} = ?`,
          explain: `${rows * 5} + ${rows * rest} = ${rows * cols}.`,
          answer: rows * cols,
        },
      ],
      wrapUp: `${rows} × ${cols} = ${rows * 5} + ${rows * rest} = ${rows * cols}.`,
    };
  }

  if (bucket === "twoSplits") {
    const rows = randInt(3, 8);
    const cols = randInt(6, 12);
    const s1 = randInt(1, cols - 1);
    let s2 = randInt(1, cols - 1);
    while (s2 === s1 || s2 === cols - s1) s2 = randInt(1, cols - 1);
    const [a1, b1] = splitRectangleAt(rows, cols, s1);
    const [a2, b2] = splitRectangleAt(rows, cols, s2);
    return {
      title: "Two different splits",
      bucket,
      story: `Two students split the same ${rows} × ${cols} rectangle in different places.`,
      visual: () => (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <RectanglePieces pieces={[a1, b1]} cellPx={20} caption="Split 1" />
          <RectanglePieces pieces={[a2, b2]} cellPx={20} caption="Split 2" />
        </div>
      ),
      steps: [
        {
          kind: "ratio",
          tones: "none",
          labels: ["Split 1 total", "Split 2 total"],
          prompt: "Add each split's two parts. What total does each split give?",
          hint: `Split 1: ${pieceArea(a1)} + ${pieceArea(b1)}. Split 2: ${pieceArea(a2)} + ${pieceArea(b2)}.`,
          explain: `Split 1: ${pieceArea(a1)} + ${pieceArea(b1)} = ${rows * cols}. Split 2: ${pieceArea(a2)} + ${pieceArea(b2)} = ${rows * cols}.`,
          answer: [rows * cols, rows * cols],
        },
        choice(
          {
            prompt: "Will EVERY way of splitting this rectangle with one straight cut give that same total?",
            hint: "Does a cut ever add or remove unit squares?",
            explain: `Yes — every split gives ${rows * cols}, because each unit square is still counted exactly once.`,
          },
          "Yes — every split gives the same total",
          ["No — it only worked for these two splits", "No — the split with bigger pieces gives more"]
        ),
      ],
      wrapUp: `Any split of a ${rows} × ${cols} rectangle adds back up to ${rows * cols}.`,
    };
  }

  // joinedRectangles — two rectangles of DIFFERENT heights sharing a base
  // (bridge to Unit 4): no single "rows × cols" fact covers the whole shape.
  const h1 = randInt(4, 8);
  let h2 = randInt(2, 7);
  while (h2 === h1) h2 = randInt(2, 7);
  const w1 = randInt(2, 6);
  const w2 = randInt(2, 6);
  const top = Math.max(h1, h2);
  const pieces: AreaPiece[] = [
    { x: 0, y: top - h1, w: w1, h: h1, tone: "a" },
    { x: w1, y: top - h2, w: w2, h: h2, tone: "b" },
  ];
  const total = h1 * w1 + h2 * w2;
  return {
    title: "Two joined rectangles",
    bucket,
    story: `This shape is a ${h1}-tall rectangle (${w1} wide) joined to a ${h2}-tall rectangle (${w2} wide).`,
    visual: () => <RectanglePieces pieces={pieces} cellPx={24} showGrid />,
    steps: [
      {
        kind: "ratio",
        tones: ["a", "b"],
        labels: ["left rectangle", "right rectangle"],
        prompt: "Find the area of each rectangle.",
        hint: `Left: ${h1} × ${w1}. Right: ${h2} × ${w2} — use each rectangle's OWN height.`,
        explain: `Left: ${h1} × ${w1} = ${h1 * w1}. Right: ${h2} × ${w2} = ${h2 * w2}.`,
        answer: [h1 * w1, h2 * w2],
      },
      {
        kind: "number",
        prompt: "What is the area of the whole shape?",
        hint: `${h1 * w1} + ${h2 * w2} = ?`,
        explain: `${h1 * w1} + ${h2 * w2} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: `${h1} × ${w1} + ${h2} × ${w2} = ${total} square units.`,
  };
}

function Preview() {
  return <RectanglePieces pieces={splitRectangleAt(4, 7, 5)} cellPx={20} showGrid />;
}

export const areaDistributiveProperty: Unit = {
  id: "areaDistributiveProperty",
  title: "Area and the Distributive Property",
  goal: "Split a rectangle into two smaller rectangles with one straight cut, and show that multiplying the whole gives the same area as adding the two parts.",
  standard: "3.MD.7c",
  keyIdea: (
    <>
      <p>Cut a rectangle with one straight line and both pieces keep the full height: 6 × 8 = 6 × 5 + 6 × 3.</p>
      <p>This always works, wherever you cut — every unit square is still counted exactly once.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Splitting rectangles", make: distributiveProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: areaDistributivePropertyTest,
};
