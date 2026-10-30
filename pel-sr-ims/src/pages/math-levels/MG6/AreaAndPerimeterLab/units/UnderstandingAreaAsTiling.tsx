import { useEffect, useState } from "react";
import { TilingGrid } from "../diagrams/TilingGrid";
import { cellsFromRect, cellsWithNotch, countArea, type CellGrid } from "../lib/grid";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper, Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { understandingAreaAsTilingTest } from "./UnderstandingAreaAsTilingTest";
import { answerBorder } from "../../../shared/lib/answerChecks";

/** A notch that removes a corner or edge bite from a rows x cols rectangle,
 *  small enough that a real rectilinear shape (not the whole rectangle, not
 *  nothing) is left — shared by Explore's rectilinear example and the
 *  rectilinear practice/test bucket. */
function randomNotch(rows: number, cols: number) {
  const nh = randInt(1, Math.max(1, rows - 2));
  const nw = randInt(1, Math.max(1, cols - 2));
  const r0 = Math.random() < 0.5 ? 0 : rows - nh;
  const c0 = Math.random() < 0.5 ? 0 : cols - nw;
  return { r0, r1: r0 + nh, c0, c1: c0 + nw };
}

/** Two unordered factor pairs of `area` with both factors inside [lo, hi] —
 *  used by the "compare two different-shaped figures" bucket so Shape A and
 *  Shape B are genuinely different rectangles that still tile to the same
 *  area. Returns null if `area` doesn't have two such pairs. */
function twoFactorPairs(area: number, lo = 2, hi = 9): [[number, number], [number, number]] | null {
  const pairs: [number, number][] = [];
  for (let a = lo; a <= hi; a++) {
    if (area % a !== 0) continue;
    const b = area / a;
    if (b < lo || b > hi) continue;
    if (!pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) pairs.push([a, b]);
  }
  if (pairs.length < 2) return null;
  const shuffled = shuffle(pairs);
  return [shuffled[0], shuffled[1]];
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1 — vocabulary: what "area" actually means, with "distance around the
 *  edge" (perimeter) as the named-misconception distractor. */
function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "The number of unit squares it takes to cover the shape, with no gaps or overlaps";
  const OPTIONS = [CORRECT, "The distance you'd walk if you traced all the way around its outside edge", "The number of corners the shape has"];
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What is the <b>area</b> of a shape?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)}>
          <option value="" disabled>
            choose
          </option>
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — area is about covering the inside, one unit square at a time." : "Not quite — that description is for PERIMETER, not area. Area is about covering the inside."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the plan's mandatory back-to-back contrast: the SAME fixed shape,
 *  asked both ways in one card, so area and perimeter can't be conflated. */
function AreaVsPerimeterQuestion({ onComplete }: { onComplete?: () => void }) {
  const rows = 3;
  const cols = 4;
  const cells = cellsFromRect(rows, cols);
  const area = countArea(cells);
  const perimeter = 2 * rows + 2 * cols;
  const [areaGuess, setAreaGuess] = useState("");
  const [perimGuess, setPerimGuess] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [areaGuess, perimGuess].every((v) => String(v).trim() !== "");
  const okArea = Number(areaGuess) === area;
  const okPerim = Number(perimGuess) === perimeter;
  const ok = okArea && okPerim;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Look at this same shape for both questions below.
      </p>
      <TilingGrid rows={rows} cols={cols} mode="full" dimLabels />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many unit squares <b>cover</b> this shape (its area)?{" "}
          <input className="answer" style={{ width: 55, ...answerBorder(okArea, checked) }} inputMode="numeric" autoComplete="off" value={areaGuess} onChange={(e) => setAreaGuess(e.target.value)} />
        </label>
      </div>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many unit-square edges <b>trace around</b> its outside border (its perimeter)?{" "}
          <input className="answer" style={{ width: 55, ...answerBorder(okPerim, checked) }} inputMode="numeric" autoComplete="off" value={perimGuess} onChange={(e) => setPerimGuess(e.target.value)} />
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? `Correct — ${area} unit squares cover the inside (area), but only ${perimeter} unit edges trace the border (perimeter). They're different questions about the same shape!`
            : `Not yet — covering the INSIDE (area) is ${area} squares; tracing the OUTSIDE border (perimeter) is ${perimeter} edges. Recount each one separately.`}
        </p>
      )}
    </div>
  );
}

/** Q3 — generalization/true-false trap: bigger-LOOKING does not mean
 *  bigger area; area only ever comes from counting unit squares. */
function BiggerLookingTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"true" | "false" | "">("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: a shape that looks bigger or longer on the page always has more area than a shape that looks smaller.
      </p>
      <div className="control-row">
        <button className={`btn ghost ${picked === "true" ? "pressed" : ""}`} type="button" onClick={() => setPicked("true")}>
          True
        </button>
        <button className={`btn ghost ${picked === "false" ? "pressed" : ""}`} type="button" onClick={() => setPicked("false")}>
          False
        </button>
        <button className="btn primary" type="button" onClick={() => setChecked(true)} disabled={!picked}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "False — area only comes from actually counting unit squares. A long, thin shape can look big but cover fewer squares than a short, wide one."
            : "Not quite — looks can be deceiving! A shape that looks bigger can still have LESS area. You have to count the unit squares to be sure."}
        </p>
      )}
    </div>
  );
}

/** Q4 — direct application: count unit squares on a fixed rectilinear
 *  (non-rectangular) outline, so the gate also certifies the skill itself,
 *  not just vocabulary. */
function RectilinearCountQuestion({ onComplete }: { onComplete?: () => void }) {
  const rows = 4;
  const cols = 4;
  const cells = cellsWithNotch(rows, cols, { r0: 0, r1: 2, c0: 2, c1: 4 });
  const area = countArea(cells);
  const [guess, setGuess] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = Number(guess) === area;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> This shape isn't a plain rectangle — count the unit squares that actually cover it.
      </p>
      <TilingGrid rows={rows} cols={cols} cells={cells} mode="full" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <input className="answer" style={{ width: 55 }} inputMode="numeric" autoComplete="off" value={guess} onChange={(e) => setGuess(e.target.value)} />
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? `Correct — ${area} unit squares cover this shape. A missing corner just means fewer squares to count there.` : `Not yet — count only the squares that are actually shaded, one at a time.`}
        </p>
      )}
    </div>
  );
}

function CheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, contrast: false, trap: false, rectilinear: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill" style={{ display: "grid", gap: 18 }}>
      <p className="intro-gate-title">Check for understanding: let's make sure "area" and "perimeter" aren't getting mixed up before practice.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <AreaVsPerimeterQuestion onComplete={mark("contrast")} />
      <BiggerLookingTrapQuestion onComplete={mark("trap")} />
      <RectilinearCountQuestion onComplete={mark("rectilinear")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

type ExploreMode = "tile" | "partial" | "compare" | "rectilinear";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<ExploreMode>("tile");
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(5);
  const [revealRows, setRevealRows] = useState(1);
  const area = rows * cols;

  const notch = randomNotch(rows, cols);
  const rectilinearCells: CellGrid = cellsWithNotch(rows, cols, notch);
  const rectilinearArea = countArea(rectilinearCells);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="What to explore"
          value={mode}
          onChange={(v) => setMode(v as ExploreMode)}
          options={[
            { id: "tile", label: "Lay down tiles" },
            { id: "partial", label: "Partial grid" },
            { id: "compare", label: "Compare shapes" },
            { id: "rectilinear", label: "Non-rectangle shape" },
          ]}
        />
      </div>
      {mode !== "compare" && (
        <div className="control-row">
          <Stepper label="rows" value={rows} min={2} max={9} onChange={(v) => { setRows(v); setRevealRows(1); }} tone="a" />
          <Stepper label="columns" value={cols} min={2} max={9} onChange={(v) => { setCols(v); setRevealRows(1); }} tone="b" />
          {!introActive && (
            <button type="button" className={`btn ghost ${showCheck ? "pressed" : ""}`} onClick={() => setShowCheck((v) => !v)}>
              Check for Understanding
            </button>
          )}
        </div>
      )}

      {mode === "tile" && (
        <>
          <p className="muted small">Click "Lay down next row" to tile this rectangle one row at a time, the same way you'd cover it with real unit squares.</p>
          <TilingGrid rows={rows} cols={cols} revealRows={revealRows} mode="full" dimLabels />
          <div className="control-row">
            <button className="btn primary" disabled={revealRows >= rows} onClick={() => setRevealRows((r) => Math.min(rows, r + 1))}>
              Lay down next row
            </button>
            <button className="btn ghost" disabled={revealRows <= 1} onClick={() => setRevealRows(1)}>
              Start over
            </button>
          </div>
          <p className="muted small">
            {revealRows < rows
              ? `${revealRows} of ${rows} rows tiled so far — ${revealRows * cols} unit squares placed.`
              : `All ${rows} rows tiled: ${rows} × ${cols} = ${area} unit squares cover this rectangle.`}
          </p>
        </>
      )}

      {mode === "partial" && (
        <>
          <p className="muted small">Only the tick marks along the top and left are drawn — picture the rest of the grid lines continuing, then count every unit square.</p>
          <TilingGrid rows={rows} cols={cols} mode="edges-only" dimLabels />
          <p className="muted small">{rows} rows × {cols} columns = {area} unit squares in all.</p>
        </>
      )}

      {mode === "rectilinear" && (
        <>
          <p className="muted small">This shape has a bite taken out of it — it's still made of whole unit squares, just not a plain rectangle.</p>
          <TilingGrid rows={rows} cols={cols} cells={rectilinearCells} mode="full" />
          <p className="muted small">{rectilinearArea} unit squares actually cover this shape (out of {area} in the full rectangle).</p>
        </>
      )}

      {mode === "compare" && (
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div>
            <TilingGrid rows={3} cols={8} mode="full" caption="Shape A: 3 × 8" />
          </div>
          <div>
            <TilingGrid rows={4} cols={6} mode="full" caption="Shape B: 4 × 6" />
          </div>
          <p className="muted small" style={{ flex: "1 1 220px" }}>
            Shape A and Shape B look different — one is long and thin, the other is shorter and wider — but count their unit squares: both are 3 × 8 = 24 and 4 × 6 = 24. Same area, different shape.
          </p>
        </div>
      )}

      {(introActive || showCheck) && mode !== "compare" && <CheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — counting unit squares
// ============================================================================

type Bucket = "fullGrid" | "partialGrid" | "compareShapes" | "rectilinear";
const BUCKETS: Bucket[] = ["fullGrid", "partialGrid", "compareShapes", "rectilinear"];
const COMPARE_AREAS = [12, 16, 18, 20, 24, 30, 36, 40];

function tilingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);

  if (bucket === "fullGrid") {
    const rows = randInt(3, 8);
    const cols = randInt(3, 9);
    const area = rows * cols;
    return {
      title: "Counting unit squares",
      bucket,
      story: "This shape is tiled with unit squares, with no gaps or overlaps.",
      visual: () => <TilingGrid rows={rows} cols={cols} mode="full" dimLabels />,
      steps: [
        {
          kind: "number",
          prompt: "How many unit squares does it take to cover this shape?",
          hint: "Count every square — you can count row by row, or count one whole row and repeat it.",
          explain: `There are ${rows} rows of ${cols} squares each: ${rows} × ${cols} = ${area} unit squares.`,
          answer: area,
        },
      ],
      wrapUp: `The area is ${area} square units.`,
    };
  }

  if (bucket === "partialGrid") {
    const rows = randInt(3, 7);
    const cols = randInt(3, 8);
    const area = rows * cols;
    return {
      title: "Counting with a partial grid",
      bucket,
      story: "Only some of the grid lines are drawn in. Picture the rest of the rows and columns continuing before you count.",
      visual: () => <TilingGrid rows={rows} cols={cols} mode="edges-only" dimLabels />,
      steps: [
        {
          kind: "number",
          prompt: "How many unit squares would it take to cover this whole shape?",
          hint: `The tick marks show ${rows} rows and ${cols} columns — extend the grid lines mentally, then count.`,
          explain: `${rows} rows × ${cols} columns = ${area} unit squares.`,
          answer: area,
        },
      ],
      wrapUp: `${rows} × ${cols} = ${area} square units.`,
    };
  }

  if (bucket === "rectilinear") {
    const rows = randInt(4, 7);
    const cols = randInt(4, 7);
    const notch = randomNotch(rows, cols);
    const cells = cellsWithNotch(rows, cols, notch);
    const area = countArea(cells);
    return {
      title: "Counting a non-rectangular shape",
      bucket,
      story: "This shape is made of whole unit squares, but it isn't a plain rectangle.",
      visual: () => <TilingGrid rows={rows} cols={cols} cells={cells} mode="full" />,
      steps: [
        {
          kind: "number",
          prompt: "How many unit squares cover this shape?",
          hint: "Count only the shaded squares — skip the missing corner.",
          explain: `${area} unit squares actually cover this shape (the full rectangle would have been ${rows * cols}).`,
          answer: area,
        },
      ],
      wrapUp: `This shape's area is ${area} square units.`,
    };
  }

  // compareShapes
  let areaChoice = pick(COMPARE_AREAS);
  let factorPairs = twoFactorPairs(areaChoice);
  while (!factorPairs) {
    areaChoice = pick(COMPARE_AREAS);
    factorPairs = twoFactorPairs(areaChoice);
  }
  const [[r1, c1], [r2, c2]] = factorPairs;
  return {
    title: "Comparing two shapes' areas",
    bucket,
    story: "Shape A and Shape B are each tiled with unit squares.",
    visual: () => (
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <TilingGrid rows={r1} cols={c1} mode="full" caption={`Shape A: ${r1} × ${c1}`} />
        <TilingGrid rows={r2} cols={c2} mode="full" caption={`Shape B: ${r2} × ${c2}`} />
      </div>
    ),
    steps: [
      {
        kind: "ratio",
        tones: "none",
        labels: ["Shape A's area", "Shape B's area"],
        prompt: "What is the area of Shape A, and what is the area of Shape B?",
        hint: `Count (or multiply) each shape's rows by its columns separately.`,
        explain: `Shape A: ${r1} × ${c1} = ${r1 * c1}. Shape B: ${r2} × ${c2} = ${r2 * c2}.`,
        answer: [r1 * c1, r2 * c2],
      },
      choice(
        {
          prompt: "Even though Shape A and Shape B look different, do they have the same area?",
          hint: "Compare the two areas you just found.",
          explain: `${r1 * c1} = ${r2 * c2} — even though the shapes look different, they're built from the same number of unit squares, so they have the same area.`,
        },
        "Yes — they have the same area",
        ["No — Shape A has more area", "No — Shape B has more area"]
      ),
    ],
    wrapUp: `Shape A (${r1} × ${c1}) and Shape B (${r2} × ${c2}) both have an area of ${r1 * c1} square units.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <TilingGrid rows={3} cols={4} mode="full" />;
}

export const understandingAreaAsTiling: Unit = {
  id: "understandingAreaAsTiling",
  title: "Understanding Area as Tiling",
  goal: "Understand that area is the number of same-size unit squares it takes to cover a shape with no gaps or overlaps, and count unit squares to find area.",
  standard: "3.MD.5a-b, 3.MD.6",
  keyIdea: (
    <>
      <p>Area is how many unit squares it takes to COVER a shape — not the same as perimeter, which is the distance around its OUTSIDE border.</p>
      <p>Shapes that look different can still have the same area, as long as they're built from the same number of unit squares.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Counting unit squares", make: tilingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: understandingAreaAsTilingTest,
};
