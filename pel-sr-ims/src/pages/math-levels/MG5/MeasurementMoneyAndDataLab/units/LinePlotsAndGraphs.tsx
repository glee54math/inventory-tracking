import { useEffect, useState } from "react";
import { LinePlot, PictureGraph, BarGraph, type GraphCategory } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper, Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { linePlotsAndGraphsTest } from "./LinePlotsAndGraphsTest";

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

const CATEGORY_SETS: { glyph: string; label: string }[][] = [
  [
    { glyph: "🐶", label: "Dogs" },
    { glyph: "🐱", label: "Cats" },
    { glyph: "🐠", label: "Fish" },
    { glyph: "🐦", label: "Birds" },
  ],
  [
    { glyph: "🍎", label: "Apples" },
    { glyph: "🍌", label: "Bananas" },
    { glyph: "🍇", label: "Grapes" },
  ],
  [
    { glyph: "⚽", label: "Soccer" },
    { glyph: "🏀", label: "Basketball" },
    { glyph: "⚾", label: "Baseball" },
    { glyph: "🎾", label: "Tennis" },
  ],
];

function randomCategories(n?: number): GraphCategory[] {
  const set = shuffle(CATEGORY_SETS)[0];
  const picked = set.slice(0, n ?? set.length);
  const tones: ("a" | "b" | "c")[] = ["a", "b", "c"];
  return picked.map((c, i) => ({ ...c, count: randInt(2, 9), tone: tones[i % tones.length] }));
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "one";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> On a line plot, each × above a number stands for how many measurements?
      </p>
      <LinePlot values={[4, 5, 5]} min={3} max={6} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="one">Exactly one measurement</option>
          <option value="all">All of the measurements at once</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — every × is its own separate measurement." : "Not quite — each × is its OWN measurement. Several ×'s stacked above the same number means several separate measurements landed on that same value."}
        </p>
      )}
    </div>
  );
}

/** THE core misconception: stacked ×'s above one value are MULTIPLE data
 *  points, not a single one. */
function StackedMarksQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "three";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Three pencils were each measured at exactly 4 inches.
      </p>
      <LinePlot values={[4, 4, 4]} min={3} max={6} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many ×'s should be stacked above the 4?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="one">Just one × — they're all the same length, so they count as one mark</option>
            <option value="three">Three ×'s — one for each pencil that measured 4 inches</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — each pencil gets its OWN ×, even if several pencils share the same length. Three pencils at 4 inches means three stacked ×'s, not one."
            : "Not quite — each pencil is a separate measurement and needs its own ×, even though they're all the same length. Three pencils at 4 inches means three stacked ×'s above the 4."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap, restating the stacked-marks misconception. */
function StackedTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: if three ×'s are stacked above the number 4, that only counts as ONE measurement of 4 inches.
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
            ? "Correct — three stacked ×'s means THREE separate measurements of 4 inches, not one."
            : "Not quite — each × is its own measurement. Three stacked ×'s above the 4 means three separate measurements of 4 inches."}
        </p>
      )}
    </div>
  );
}

/** The bar-graph misconception: read the gridline LABEL, not just a raw
 *  count of gridlines. */
function GridlineQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "6";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  const categories: GraphCategory[] = [{ glyph: "⚽", label: "Soccer", count: 6, tone: "a" }];
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> This bar graph's gridlines are labeled 0, 2, 4, 6, 8 — they go up by 2 each time, not by 1.
      </p>
      <BarGraph categories={categories} tickStep={2} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          The bar's top lines up with the 3rd gridline. How tall is the bar?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3">3 — it's the 3rd gridline up</option>
            <option value="6">6 — read the NUMBER the gridline is labeled with</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — since these gridlines count by 2, the 3rd one up is labeled 6, not 3. Always read the LABEL, not just how many lines you passed."
            : "Not quite — these gridlines count by 2 (0, 2, 4, 6...), so the 3rd gridline up is labeled 6. Counting \"1, 2, 3 gridlines\" gives the wrong number when the scale isn't by 1."}
        </p>
      )}
    </div>
  );
}

function DataCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, stacked: false, trap: false, gridline: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure reading plots and graphs makes sense before you try practice problems.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <StackedMarksQuestion onComplete={mark("stacked")} />
      <StackedTrapQuestion onComplete={mark("trap")} />
      <GridlineQuestion onComplete={mark("gridline")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

const PLOT_VALUES = [4, 5, 6, 7, 8, 9];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"plot" | "graph">("plot");
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [graphMode, setGraphMode] = useState<"picture" | "bar">("picture");
  const [categories, setCategories] = useState<GraphCategory[]>(() => randomCategories(3));

  const values = PLOT_VALUES.flatMap((v) => Array.from({ length: counts[v] ?? 0 }, () => v));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="What to explore"
          value={mode}
          onChange={setMode}
          options={[
            { id: "plot", label: "Line Plot" },
            { id: "graph", label: "Picture/Bar Graph" },
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
      {(introActive || showCheck) && <DataCheckForUnderstanding onComplete={onIntroDone} />}

      {mode === "plot" ? (
        <>
          <p className="muted small">Pretend each stepper is a pencil you measured. Raise a value's count and watch its ×'s stack up.</p>
          <div className="control-row">
            {PLOT_VALUES.map((v) => (
              <Stepper key={v} label={`${v} in`} value={counts[v] ?? 0} min={0} max={5} onChange={(n) => setCounts((c) => ({ ...c, [v]: n }))} tone="a" />
            ))}
          </div>
          <LinePlot values={values.length ? values : [PLOT_VALUES[0]]} min={PLOT_VALUES[0]} max={PLOT_VALUES[PLOT_VALUES.length - 1]} unitLabel="pencil length (inches)" />
        </>
      ) : (
        <>
          <div className="control-row">
            <Segmented label="Graph type" value={graphMode} onChange={setGraphMode} options={[{ id: "picture", label: "Picture Graph" }, { id: "bar", label: "Bar Graph" }]} />
            <button className="btn ghost" onClick={() => setCategories(randomCategories(3))}>
              New categories
            </button>
          </div>
          <div className="control-row">
            {categories.map((c, i) => (
              <Stepper key={c.label} label={`${c.glyph} ${c.label}`} value={c.count} min={0} max={9} onChange={(n) => setCategories((cs) => cs.map((x, k) => (k === i ? { ...x, count: n } : x)))} tone="a" />
            ))}
          </div>
          {graphMode === "picture" ? <PictureGraph categories={categories} /> : <BarGraph categories={categories} />}
        </>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "generatePlotData" | "readLinePlot" | "readPictureGraph" | "readBarGraph" | "putTogetherBarGraph" | "compareBarGraph";
const BUCKETS: Bucket[] = ["generatePlotData", "readLinePlot", "readPictureGraph", "readBarGraph", "putTogetherBarGraph", "compareBarGraph"];

function randomPlotData(): { values: number[]; min: number; max: number } {
  const min = randInt(3, 6);
  const max = min + randInt(3, 4);
  const values: number[] = [];
  for (let v = min; v <= max; v++) {
    const n = randInt(0, 3);
    for (let i = 0; i < n; i++) values.push(v);
  }
  if (values.length < 3) return randomPlotData();
  return { values, min, max };
}

function generatePlotProblem(): Problem {
  const { values, min, max } = randomPlotData();
  // Drawn from the values ACTUALLY present (never an in-range value that
  // happens to have zero occurrences) — asking "how many measured X" when
  // X never appears in the list at all is confusing for a first encounter,
  // even though 0 would technically be a correct answer.
  const targetValue = values[randInt(0, values.length - 1)];
  const targetCount = values.filter((v) => v === targetValue).length;
  const sorted = shuffle(values);
  return {
    title: "Build the line plot from data",
    bucket: "generatePlotData",
    story: `A class measured some pencils (in inches): ${sorted.join(", ")}.`,
    visual: (done) =>
      done < 1 ? (
        <div className="digital-display" style={{ fontSize: 18 }}>
          Raw measurements: {sorted.join(", ")}
        </div>
      ) : (
        <LinePlot values={values} min={min} max={max} unitLabel="pencil length (inches)" />
      ),
    steps: [
      { kind: "number", prompt: `How many pencils measured exactly ${targetValue} inches?`, hint: "Count how many times that number appears in the list.", explain: `${targetValue} appears ${targetCount} time${targetCount === 1 ? "" : "s"} in the list.`, answer: targetCount },
      { kind: "number", prompt: "How many pencils were measured in all?", hint: "Count every number in the list.", explain: `There are ${values.length} measurements in all.`, answer: values.length },
    ],
    wrapUp: `Once plotted, each measurement becomes its own × — ${targetCount} ×'s stack above ${targetValue}.`,
  };
}

function readLinePlotProblem(): Problem {
  const { values, min, max } = randomPlotData();
  const vals = Array.from(new Set(values)).sort((a, b) => a - b);
  if (vals.length < 2) return readLinePlotProblem();
  const [valA, valB] = shuffle(vals).slice(0, 2);
  const countA = values.filter((v) => v === valA).length;
  const countB = values.filter((v) => v === valB).length;
  const bigger = countA >= countB ? valA : valB;
  const biggerCount = Math.max(countA, countB);
  const smallerCount = Math.min(countA, countB);
  const diff = biggerCount - smallerCount;
  return {
    title: "Read the line plot",
    bucket: "readLinePlot",
    story: "This line plot shows a class's pencil-length measurements.",
    visual: () => <LinePlot values={values} min={min} max={max} unitLabel="pencil length (inches)" tone="b" />,
    steps: [
      { kind: "number", prompt: `How many pencils measured ${bigger} inches?`, hint: "Count the ×'s stacked above that number.", explain: `${biggerCount} pencils measured ${bigger} inches.`, answer: biggerCount },
      { kind: "number", prompt: `How many MORE pencils measured ${bigger} inches than measured ${bigger === valA ? valB : valA} inches?`, hint: "Subtract the smaller stack's count from the bigger stack's count.", explain: `${biggerCount} − ${smallerCount} = ${diff}.`, answer: diff },
    ],
    wrapUp: `${biggerCount} pencils measured ${bigger} inches — ${diff} more than the other value you checked.`,
  };
}

function readPictureGraphProblem(): Problem {
  const categories = randomCategories();
  const target = categories[randInt(0, categories.length - 1)];
  return {
    title: "Read the picture graph",
    bucket: "readPictureGraph",
    story: "This picture graph shows how many of each kind were counted.",
    visual: () => <PictureGraph categories={categories} />,
    steps: [{ kind: "number", prompt: `How many ${target.label.toLowerCase()} are shown?`, hint: `Count the ${target.glyph} in the ${target.label} row.`, explain: `There are ${target.count} ${target.label.toLowerCase()}.`, answer: target.count }],
    wrapUp: `There are ${target.count} ${target.label.toLowerCase()}.`,
  };
}

function readBarGraphProblem(): Problem {
  const categories = randomCategories();
  const target = categories[randInt(0, categories.length - 1)];
  return {
    title: "Read the bar graph",
    bucket: "readBarGraph",
    story: "This bar graph shows how many of each kind were counted.",
    visual: () => <BarGraph categories={categories} />,
    steps: [{ kind: "number", prompt: `How many ${target.label.toLowerCase()} are shown?`, hint: "Find that bar and read its height against the gridlines.", explain: `The ${target.label} bar shows ${target.count}.`, answer: target.count }],
    wrapUp: `${target.count} ${target.label.toLowerCase()} were counted.`,
  };
}

function putTogetherBarGraphProblem(): Problem {
  const categories = randomCategories();
  const [a, b] = shuffle(categories).slice(0, 2);
  const total = a.count + b.count;
  return {
    title: "Combine two categories",
    bucket: "putTogetherBarGraph",
    story: `How many ${a.label.toLowerCase()} and ${b.label.toLowerCase()} are there TOGETHER?`,
    visual: () => <BarGraph categories={categories} />,
    steps: [{ kind: "number", prompt: `How many ${a.label.toLowerCase()} and ${b.label.toLowerCase()} are there combined?`, hint: `Add the two bars: ${a.count} + ${b.count}.`, explain: `${a.count} + ${b.count} = ${total}.`, answer: total }],
    wrapUp: `${a.label} and ${b.label} together make ${total}.`,
  };
}

function compareBarGraphProblem(): Problem {
  const categories = randomCategories();
  let [a, b] = shuffle(categories).slice(0, 2);
  while (a.count === b.count) {
    [a, b] = shuffle(categories).slice(0, 2);
  }
  const bigger = a.count > b.count ? a : b;
  const smaller = a.count > b.count ? b : a;
  const diff = bigger.count - smaller.count;
  return {
    title: "Compare two categories",
    bucket: "compareBarGraph",
    story: `How many MORE ${bigger.label.toLowerCase()} are there than ${smaller.label.toLowerCase()}?`,
    visual: () => <BarGraph categories={categories} />,
    steps: [
      choice({ prompt: `Which has more: ${bigger.label.toLowerCase()} or ${smaller.label.toLowerCase()}?`, hint: "Compare the two bars' heights.", explain: `${bigger.label} has more (${bigger.count} vs ${smaller.count}).` }, bigger.label, [smaller.label]),
      { kind: "number", prompt: `How many MORE ${bigger.label.toLowerCase()} are there than ${smaller.label.toLowerCase()}?`, hint: `Subtract: ${bigger.count} − ${smaller.count}.`, explain: `${bigger.count} − ${smaller.count} = ${diff}.`, answer: diff },
    ],
    wrapUp: `There are ${diff} more ${bigger.label.toLowerCase()} than ${smaller.label.toLowerCase()}.`,
  };
}

function dataProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "generatePlotData") return generatePlotProblem();
  if (bucket === "readLinePlot") return readLinePlotProblem();
  if (bucket === "readPictureGraph") return readPictureGraphProblem();
  if (bucket === "readBarGraph") return readBarGraphProblem();
  if (bucket === "putTogetherBarGraph") return putTogetherBarGraphProblem();
  return compareBarGraphProblem();
}

export const linePlotsAndGraphs: Unit = {
  id: "linePlotsAndGraphs",
  title: "Line Plots and Picture/Bar Graphs",
  goal: "Turn measurement data into a line plot, and read and solve problems from picture graphs and bar graphs.",
  standard: "2.MD.9, 2.MD.10",
  keyIdea: (
    <>
      <p>Every × on a line plot is its own measurement — several stacked ×'s mean several measurements shared that same value.</p>
      <p>On a bar graph, always read the gridline's LABEL, not just how many lines you passed.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [
    { label: "Line Plot", make: (b) => (b === "generatePlotData" ? generatePlotProblem() : readLinePlotProblem()), buckets: ["generatePlotData", "readLinePlot"] },
    { label: "Picture Graph", make: readPictureGraphProblem, buckets: ["readPictureGraph"] },
    { label: "Bar Graph", make: dataProblem, buckets: ["readBarGraph", "putTogetherBarGraph", "compareBarGraph"] },
  ],
  requiredBuckets: BUCKETS,
  test: linePlotsAndGraphsTest,
};
