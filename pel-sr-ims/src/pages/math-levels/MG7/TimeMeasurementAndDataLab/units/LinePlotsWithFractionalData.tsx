import { useEffect, useState } from "react";
import { InchRuler, LinePlot, inchText } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { linePlotsWithFractionalDataTest } from "./LinePlotsWithFractionalDataTest";

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

const OBJECTS = [
  { name: "crayon", glyph: "🖍️" },
  { name: "leaf", glyph: "🍃" },
  { name: "eraser", glyph: "🧽" },
  { name: "key", glyph: "🔑" },
  { name: "shell", glyph: "🐚" },
];

/** A random quarter-inch position in [minWhole, minWhole + 2]. */
const randomQuarter = (minWhole: number) => minWhole + randInt(0, 8) / 4;
/** A quarter-inch position that is a TRUE quarter mark (x 1/4 or x 3/4), never a whole or half. */
const randomTrueQuarter = (minWhole: number) => minWhole + pick([1, 3, 5, 7]) / 4;
/** A small offset (|offset| <= 0.1 in) so a measured object doesn't sit exactly on a tick. */
const randomOffset = () => (randInt(-8, 8) / 100);

/** Random line-plot data: `n` quarter-inch measurements in [minWhole, minWhole+2]. */
function randomData(minWhole: number, n: number): number[] {
  return Array.from({ length: n }, () => randomQuarter(minWhole));
}
const countAt = (data: number[], v: number) => data.filter((d) => d === v).length;

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const CFU_DATA = [2, 2.25, 2.25, 2.5, 2.5, 2.5, 2.5, 3, 3.25, 3.75, 3.75, 4];

/** Vocabulary: one dot = one measurement. */
function DotMeaningQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "one";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> A class measured some crayons and made this line plot.
      </p>
      <LinePlot minWhole={2} maxWhole={4} data={CFU_DATA} tone="a" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What does each dot stand for?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="one">One crayon that was measured — placed above its length</option>
            <option value="inch">One inch of length</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — every dot is one measured crayon, stacked above the length it measured. Taller stacks mean more crayons had that length."
            : "Not quite — each dot is one crayon that was measured, placed above that crayon's length. The number line itself shows the inches."}
        </p>
      )}
    </div>
  );
}

/** REQUIRED: quarter-mark placement, not rounding to a whole or half. */
function QuarterPlacementQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "quarter";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> A new crayon measures 3 1/4 inches. Where does its dot go?
      </p>
      <LinePlot minWhole={2} maxWhole={4} data={[]} tone="b" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Place it...{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="whole">Above the tall "3" tick — round to the nearest whole inch</option>
            <option value="half">Above the medium tick halfway between 3 and 4</option>
            <option value="quarter">Above the FIRST short tick after 3 — exactly 3 1/4</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — between 3 and 4 there are three ticks: short (3 1/4), medium (3 1/2), short (3 3/4). The dot goes exactly at 3 1/4, not rounded to a labeled number."
            : "Not quite — the plot is marked in quarter inches, so don't round. Between 3 and 4: the first short tick is 3 1/4, the medium tick is 3 1/2, the next short tick is 3 3/4."}
        </p>
      )}
    </div>
  );
}

/** REQUIRED: frequency (how many dots) vs. the value itself. */
function FrequencyVsValueQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "4";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Same line plot as question 1. Theo is asked "How many crayons measured 2 1/2 inches?" and answers "2 1/2."
      </p>
      <LinePlot minWhole={2} maxWhole={4} data={CFU_DATA} tone="c" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What's the right answer?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="2.5">2 1/2 — that's the length</option>
            <option value="4">4 — count the dots stacked above 2 1/2</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — Theo repeated the LENGTH. \"How many crayons\" asks for a count: there are 4 dots above 2 1/2, so 4 crayons."
            : "Not quite — 2 1/2 is the length being asked about, not how many. Count the dots stacked above 2 1/2: there are 4, so 4 crayons."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap. */
function RoundingTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or false: since only the whole numbers are labeled on a line plot, it's fine to put a 3 3/4-inch measurement above the 4.
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
            ? "Correct — unlabeled ticks are still real positions. 3 3/4 goes on the short tick just before 4, not on the 4 itself."
            : "Not quite — the unlabeled ticks still count. 3 3/4 has its own tick (the short one just before 4); moving it to 4 changes the data."}
        </p>
      )}
    </div>
  );
}

function LinePlotCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ dot: false, quarter: false, freq: false, trap: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure line plots make sense before you try practice problems.</p>
      <DotMeaningQuestion onComplete={mark("dot")} />
      <QuarterPlacementQuestion onComplete={mark("quarter")} />
      <FrequencyVsValueQuestion onComplete={mark("freq")} />
      <RoundingTrapQuestion onComplete={mark("trap")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [len, setLen] = useState(2.75);
  const [data, setData] = useState<number[]>([2.5, 3, 3.25]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Crayon length (in)" value={len} min={2} max={4} step={0.25} onChange={setLen} tone="a" />
        <button className="btn primary" type="button" onClick={() => setData((d) => [...d, len])}>
          Add a dot at {inchText(len)}"
        </button>
        <button className="btn ghost" type="button" onClick={() => setData([])}>
          Clear plot
        </button>
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
      {(introActive || showCheck) && <LinePlotCheckForUnderstanding onComplete={onIntroDone} />}

      <InchRuler maxInches={4} lengthQuarter={len} glyph="🖍️" tone="a" />
      <LinePlot minWhole={2} maxWhole={4} data={data} tone="b" />
      <p className="feedback good" style={{ minHeight: 24 }}>
        This crayon is {inchText(len)} inches. The plot has {data.length} measurement{data.length === 1 ? "" : "s"}
        {data.length > 0 ? `; ${countAt(data, len)} of them at ${inchText(len)}".` : "."}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "measureAndPlace" | "readFrequency" | "readComparison" | "quarterMark";
const BUCKETS: Bucket[] = ["measureAndPlace", "readFrequency", "readComparison", "quarterMark"];

/** Choice labels for "which tick does v go on" — used by both measure and quarter buckets. */
function tickChoice(v: number): { correct: string; distractors: string[] } {
  const label = (x: number) => `Above ${inchText(x)}`;
  const distractors = new Set<string>([label(Math.round(v)), label(Math.floor(v * 2) / 2), label(Math.ceil(v * 2) / 2)]);
  distractors.delete(label(v));
  // A whole or half v has no "rounded" neighbor distinct from itself, so fall
  // back to the adjacent quarter ticks (always distinct from v).
  if (distractors.size < 2) {
    distractors.add(label(v - 0.25));
    distractors.add(label(v + 0.25));
  }
  return { correct: label(v), distractors: [...distractors] };
}

function measureAndPlaceProblem(): Problem {
  const obj = pick(OBJECTS);
  const len = 1 + randInt(1, 15) / 4; // 1 1/4 .. 4 3/4
  const offset = randomOffset();
  const { correct, distractors } = tickChoice(len);
  return {
    title: "Measure, then plot",
    bucket: "measureAndPlace",
    story: `Measure the ${obj.name} to the nearest quarter inch.`,
    visual: () => <InchRuler maxInches={5} lengthQuarter={len} offset={offset} glyph={obj.glyph} tone="a" />,
    steps: [
      {
        kind: "number",
        prompt: `How long is the ${obj.name}, to the nearest 1/4 inch? (Type like 2 1/4.)`,
        hint: "Find the tick mark closest to the end of the object. Short ticks are quarters, medium ticks are halves.",
        explain: `The ${obj.name} is about ${inchText(len)} inches.`,
        answer: len,
        suffix: "in",
      },
      choice(
        { prompt: "Where does its dot go on a line plot marked in quarter inches?", hint: "Use the exact quarter mark — don't round to a whole or half.", explain: `Exactly above ${inchText(len)}.` },
        correct,
        distractors
      ),
    ],
    wrapUp: `${obj.name}: ${inchText(len)} inches — one dot above ${inchText(len)}.`,
  };
}

function readFrequencyProblem(): Problem {
  const minWhole = randInt(1, 4);
  const data = randomData(minWhole, randInt(8, 14));
  const v = pick(data);
  const n = countAt(data, v);
  const obj = pick(OBJECTS);
  return {
    title: "How many at one length?",
    bucket: "readFrequency",
    story: `A class measured ${data.length} ${obj.name}s.`,
    visual: () => <LinePlot minWhole={minWhole} maxWhole={minWhole + 2} data={data} tone="a" />,
    steps: [
      {
        kind: "number",
        prompt: `How many ${obj.name}s measured ${inchText(v)} inches?`,
        hint: `Count the dots stacked above ${inchText(v)}. (Answering "${inchText(v)}" repeats the length, not how many.)`,
        explain: `There are ${n} dot${n === 1 ? "" : "s"} above ${inchText(v)}.`,
        answer: n,
      },
      { kind: "number", prompt: `How many ${obj.name}s were measured in all?`, hint: "Count every dot on the plot.", explain: `${data.length} dots, so ${data.length} ${obj.name}s.`, answer: data.length },
    ],
    wrapUp: `${n} of the ${data.length} ${obj.name}s measured ${inchText(v)} inches.`,
  };
}

function readComparisonProblem(): Problem {
  const minWhole = randInt(1, 4);
  let data = randomData(minWhole, randInt(9, 14));
  let values = [...new Set(data)];
  // Need two values with different (nonzero) counts to compare.
  while (values.length < 2 || new Set(values.map((v) => countAt(data, v))).size < 2) {
    data = randomData(minWhole, randInt(9, 14));
    values = [...new Set(data)];
  }
  let a = pick(values);
  let b = pick(values);
  while (countAt(data, a) === countAt(data, b)) {
    a = pick(values);
    b = pick(values);
  }
  if (countAt(data, a) < countAt(data, b)) [a, b] = [b, a];
  const diff = countAt(data, a) - countAt(data, b);
  const obj = pick(OBJECTS);
  return {
    title: "Compare two lengths",
    bucket: "readComparison",
    story: `A class measured ${data.length} ${obj.name}s.`,
    visual: () => <LinePlot minWhole={minWhole} maxWhole={minWhole + 2} data={data} tone="b" />,
    steps: [
      { kind: "number", prompt: `How many measured ${inchText(a)} inches?`, hint: `Count the dots above ${inchText(a)}.`, explain: `${countAt(data, a)}.`, answer: countAt(data, a) },
      {
        kind: "number",
        prompt: `How many MORE ${obj.name}s measured ${inchText(a)} inches than ${inchText(b)} inches?`,
        hint: "Subtract the two dot COUNTS — not the two lengths.",
        explain: `${countAt(data, a)} − ${countAt(data, b)} = ${diff}.`,
        answer: diff,
      },
    ],
    wrapUp: `${diff} more ${obj.name}s measured ${inchText(a)}" than ${inchText(b)}".`,
  };
}

function quarterMarkProblem(): Problem {
  const minWhole = randInt(1, 4);
  const v = randomTrueQuarter(minWhole);
  const data = [...randomData(minWhole, randInt(6, 10)), v, v]; // guarantee the asked quarter mark has dots
  const n = countAt(data, v);
  const { correct, distractors } = tickChoice(v);
  const whole = Math.floor(v);
  const isFirst = v - whole === 0.25;
  return {
    title: "Find the quarter mark",
    bucket: "quarterMark",
    story: `This line plot is marked in whole, half, AND quarter inches.`,
    visual: () => <LinePlot minWhole={minWhole} maxWhole={minWhole + 2} data={data} tone="c" />,
    steps: [
      choice(
        {
          prompt: `Which tick is ${inchText(v)}?`,
          hint: `After ${whole}: short tick = ${whole} 1/4, medium tick = ${whole} 1/2, short tick = ${whole} 3/4.`,
          explain: `${inchText(v)} is the ${isFirst ? "first" : "second"} short tick after ${whole}.`,
        },
        correct,
        distractors
      ),
      {
        kind: "number",
        prompt: `How many measurements are at exactly ${inchText(v)} inches?`,
        hint: `Count only the dots on the ${inchText(v)} tick — not the ones on ${whole} or ${whole} 1/2 next to it.`,
        explain: `${n} dots sit at ${inchText(v)}.`,
        answer: n,
      },
    ],
    wrapUp: `${n} measurements at exactly ${inchText(v)} inches.`,
  };
}

function linePlotProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "measureAndPlace") return measureAndPlaceProblem();
  if (bucket === "readFrequency") return readFrequencyProblem();
  if (bucket === "readComparison") return readComparisonProblem();
  return quarterMarkProblem();
}

export const linePlotsWithFractionalData: Unit = {
  id: "linePlotsWithFractionalData",
  title: "Line Plots with Fractional Measurement Data",
  goal: "Measure objects to the nearest quarter inch, show the data as dots on a line plot, and answer questions from the plot.",
  standard: "3.MD.4",
  keyIdea: (
    <>
      <p>Between two whole inches: short tick = 1/4, medium tick = 1/2, short tick = 3/4. Put each dot on its exact tick — don't round.</p>
      <p>Each dot is one measured object. "How many" questions count dots; they never answer with the length itself.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Line Plots", make: linePlotProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: linePlotsWithFractionalDataTest,
};
