import { useEffect, useState } from "react";
import { ScaledBarChart, ScaledPictureGraph, type BarCategory, type PictureCategory } from "../diagrams";
import { randInt, pick, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { scaledGraphsTest } from "./ScaledGraphsTest";

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});
const TONES = ["a", "b", "c"] as const;

interface Theme {
  title: string;
  cats: { label: string; glyph: string }[];
}
const THEMES: Theme[] = [
  { title: "Favorite fruit", cats: [{ label: "Apples", glyph: "🍎" }, { label: "Bananas", glyph: "🍌" }, { label: "Grapes", glyph: "🍇" }] },
  { title: "Pets owned", cats: [{ label: "Cats", glyph: "🐱" }, { label: "Dogs", glyph: "🐶" }, { label: "Fish", glyph: "🐟" }] },
  { title: "Books read", cats: [{ label: "Ana", glyph: "📕" }, { label: "Ben", glyph: "📗" }, { label: "Cy", glyph: "📘" }] },
  { title: "Balls in the gym", cats: [{ label: "Soccer", glyph: "⚽" }, { label: "Basket", glyph: "🏀" }, { label: "Tennis", glyph: "🎾" }] },
];

/** Scale + minor-gridline spacing + value ceiling, chosen together so a
 *  bar's height is always exactly countable from the lines actually drawn
 *  (see ScaledBarChart's doc comment). */
interface ScaleSpec {
  scale: number;
  minorStep: number;
  maxValue: number;
}
const SCALE_SPECS: ScaleSpec[] = [
  { scale: 2, minorStep: 1, maxValue: 20 },
  { scale: 5, minorStep: 1, maxValue: 30 },
  { scale: 10, minorStep: 5, maxValue: 70 },
];
const axisMaxFor = (values: number[], scale: number) => (Math.floor(Math.max(...values) / scale) + 1) * scale;
/** A value sitting exactly on a labeled gridline (a multiple of the scale), at least 1 line up. */
const onGridValue = (s: ScaleSpec) => randInt(1, Math.floor(s.maxValue / s.scale)) * s.scale;
/** A value landing BETWEEN two labeled gridlines but on a drawn minor line. */
function betweenValue(s: ScaleSpec): number {
  let v = randInt(1, s.maxValue / s.minorStep) * s.minorStep;
  while (v % s.scale === 0) v = randInt(1, s.maxValue / s.minorStep) * s.minorStep;
  return v;
}
const barCats = (theme: Theme, values: number[]): BarCategory[] => theme.cats.map((c, i) => ({ label: c.label, value: values[i], tone: TONES[i] }));

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const CFU_CATS: BarCategory[] = [
  { label: "Apples", value: 15, tone: "a" },
  { label: "Bananas", value: 25, tone: "b" },
  { label: "Grapes", value: 10, tone: "c" },
];

/** Vocabulary: what a picture-graph key means. */
function KeyMeaningQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "five";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> This picture graph's key says "each icon = 5."
      </p>
      <ScaledPictureGraph keyValue={5} categories={[{ label: "Cats", glyph: "🐱", value: 15 }, { label: "Dogs", glyph: "🐶", value: 10 }]} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What does ONE 🐱 stand for?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="one">1 cat</option>
            <option value="five">5 cats</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the key tells you every icon stands for 5 real cats. So 3 cat icons means 3 × 5 = 15 cats."
            : "Not quite — on a SCALED graph one icon isn't one item. The key says each icon = 5, so one 🐱 stands for 5 cats, and 3 icons means 15."}
        </p>
      )}
    </div>
  );
}

/** REQUIRED: reading a gridline position as the literal count. */
function GridlineCountQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "15";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> The Apples bar reaches labeled line 3. Lena says, "So 3 people picked apples."
      </p>
      <ScaledBarChart categories={CFU_CATS} scale={5} axisMax={30} keyMode />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many people really picked apples?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="3">3 — the bar reaches line 3</option>
            <option value="15">15 — line 3, and each line is worth 5, so 3 × 5</option>
            <option value="8">8 — 3 + 5</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — Lena read the LINE NUMBER as the count. The key says each line is worth 5, so line 3 means 3 × 5 = 15 people."
            : "Not quite — \"3\" is only which line the bar reaches. The key says each line is worth 5, so you multiply: 3 × 5 = 15 people picked apples."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated: what half an icon is worth. */
function HalfIconQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "10";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Here each icon = 4 books. Ben's row has 2 whole icons and a HALF icon.
      </p>
      <ScaledPictureGraph keyValue={4} categories={[{ label: "Ana", glyph: "📕", value: 12 }, { label: "Ben", glyph: "📗", value: 10 }]} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How many books did Ben read?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="9">9 — 2 icons is 8, and a half icon is just 1 more</option>
            <option value="10">10 — 2 icons is 8, and half an icon is half of 4, which is 2</option>
            <option value="3">3 — 2 icons plus 1 half icon</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — in this lab, half an icon always means half the key's value. Half of 4 is 2, so Ben read 8 + 2 = 10 books."
            : "Not quite — half an icon is worth HALF of what a whole icon is worth. A whole icon is 4, so half is 2: 4 + 4 + 2 = 10 books."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap. */
function GridlineTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or false: on any bar graph, counting how many lines tall a bar is always tells you how many items it shows — you never need to
        look at the key.
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
            ? "Correct — that only works when each line is worth exactly 1. On a scaled graph you always check the key and multiply, like Lena's apples (line 3 × 5 = 15)."
            : "Not quite — remember Lena's apples: the bar was 3 lines tall but showed 15, because each line was worth 5. Always check the key first."}
        </p>
      )}
    </div>
  );
}

function GraphsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ key: false, gridline: false, half: false, trap: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure reading a scaled graph makes sense before you try practice problems.</p>
      <KeyMeaningQuestion onComplete={mark("key")} />
      <GridlineCountQuestion onComplete={mark("gridline")} />
      <HalfIconQuestion onComplete={mark("half")} />
      <GridlineTrapQuestion onComplete={mark("trap")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [key, setKey] = useState<"2" | "4" | "10">("4");
  const k = Number(key);
  const [counts, setCounts] = useState<number[]>([3, 5, 2]); // in HALF-icon units, so every value is a multiple of key/2
  const theme = THEMES[0];
  const values = counts.map((c) => (c * k) / 2);
  const pictureCats: PictureCategory[] = theme.cats.map((c, i) => ({ label: c.label, glyph: c.glyph, value: values[i], tone: TONES[i] }));
  const axisMax = Math.max(k * 6, axisMaxFor(values, k));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="Key: each icon / line is worth"
          value={key}
          onChange={setKey}
          options={[{ id: "2", label: "2" }, { id: "4", label: "4" }, { id: "10", label: "10" }]}
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
      {(introActive || showCheck) && <GraphsCheckForUnderstanding onComplete={onIntroDone} />}

      <div className="control-row">
        {theme.cats.map((c, i) => (
          <Stepper
            key={c.label}
            label={`${c.label} (${values[i]})`}
            value={counts[i] / 2}
            min={0}
            max={6}
            step={0.5}
            onChange={(v) => setCounts((arr) => arr.map((x, j) => (j === i ? Math.round(v * 2) : x)))}
            tone={TONES[i]}
          />
        ))}
      </div>
      <p className="muted small">Each stepper counts ICONS (half an icon at a time). Watch both graphs show the same numbers two different ways.</p>
      <div className="control-row" style={{ alignItems: "flex-start" }}>
        <ScaledPictureGraph keyValue={k} categories={pictureCats} />
        <ScaledBarChart categories={barCats(theme, values)} scale={k} axisMax={axisMax} keyMode minorStep={k === 10 ? 5 : 1} />
      </div>
      <p className="feedback good" style={{ minHeight: 24 }}>
        {theme.cats.map((c, i) => `${c.label}: ${counts[i] / 2} icons × ${k} = ${values[i]}`).join(" · ")}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "readAtGridline" | "readBetween" | "compareOneStep" | "compareTwoStep" | "pictureGraph";
const BUCKETS: Bucket[] = ["readAtGridline", "readBetween", "compareOneStep", "compareTwoStep", "pictureGraph"];

function readAtGridlineProblem(): Problem {
  const theme = pick(THEMES);
  const spec = pick(SCALE_SPECS);
  const values = [onGridValue(spec), onGridValue(spec), onGridValue(spec)];
  const idx = randInt(0, 2);
  const v = values[idx];
  const lines = v / spec.scale;
  const label = theme.cats[idx].label;
  const axisMax = axisMaxFor(values, spec.scale);
  return {
    title: "Read a scaled bar",
    bucket: "readAtGridline",
    story: `${theme.title}. Read the key before you read the bars.`,
    visual: () => <ScaledBarChart categories={barCats(theme, values)} scale={spec.scale} axisMax={axisMax} keyMode minorStep={spec.minorStep} />,
    steps: [
      { kind: "number", prompt: `Which labeled line does the ${label} bar reach?`, hint: "Follow the top of the bar across to the line number on the left.", explain: `The ${label} bar reaches line ${lines}.`, answer: lines },
      {
        kind: "number",
        prompt: `So how many is ${label}, really?`,
        hint: `If you're thinking "${lines}," that's only the line number. The key says each line = ${spec.scale}, so multiply: ${lines} × ${spec.scale}.`,
        explain: `${lines} lines × ${spec.scale} each = ${v}.`,
        answer: v,
      },
    ],
    wrapUp: `${label}: line ${lines} × ${spec.scale} = ${v}.`,
  };
}

function readBetweenProblem(): Problem {
  const theme = pick(THEMES);
  const spec = pick(SCALE_SPECS);
  const idx = randInt(0, 2);
  const values = [0, 1, 2].map((i) => (i === idx ? betweenValue(spec) : randInt(1, spec.maxValue / spec.minorStep) * spec.minorStep));
  const v = values[idx];
  const lower = Math.floor(v / spec.scale) * spec.scale;
  const upper = lower + spec.scale;
  const label = theme.cats[idx].label;
  const axisMax = axisMaxFor(values, spec.scale);
  return {
    title: "Read a bar between the lines",
    bucket: "readBetween",
    story: `${theme.title}. The ${label} bar stops BETWEEN two labeled lines.`,
    visual: () => <ScaledBarChart categories={barCats(theme, values)} scale={spec.scale} axisMax={axisMax} minorStep={spec.minorStep} />,
    steps: [
      {
        kind: "ratio",
        prompt: `The ${label} bar is between which two labeled lines?`,
        hint: "Find the labeled line just below the top of the bar and the one just above it.",
        explain: `It's between ${lower} and ${upper}.`,
        answer: [lower, upper],
        labels: ["line below", "line above"],
        frame: ["between ", " and ", ""],
        tones: "none",
      },
      {
        kind: "number",
        prompt: `What is the ${label} bar's exact value?`,
        hint: `Each light unlabeled line is worth ${spec.minorStep}. Start at ${lower} and count up the light lines.`,
        explain: `${lower} + ${v - lower} = ${v}.`,
        answer: v,
      },
    ],
    wrapUp: `${label} = ${v}, between the ${lower} and ${upper} lines.`,
  };
}

function compareOneStepProblem(): Problem {
  const theme = pick(THEMES);
  const spec = pick(SCALE_SPECS);
  const values = [onGridValue(spec), onGridValue(spec), onGridValue(spec)];
  while (values[0] === values[1]) values[1] = onGridValue(spec);
  const [i, j] = shuffle([0, 1]);
  const askMore = Math.random() < 0.5;
  const big = values[i] > values[j] ? i : j;
  const small = big === i ? j : i;
  const diff = values[big] - values[small];
  const axisMax = axisMaxFor(values, spec.scale);
  const [first, second] = askMore ? [big, small] : [small, big];
  return {
    title: "How many more or fewer?",
    bucket: "compareOneStep",
    story: theme.title + ".",
    visual: () => <ScaledBarChart categories={barCats(theme, values)} scale={spec.scale} axisMax={axisMax} minorStep={spec.minorStep} />,
    steps: [
      { kind: "number", prompt: `How many is ${theme.cats[big].label}?`, hint: "Read the labeled line the bar reaches.", explain: `${theme.cats[big].label} = ${values[big]}.`, answer: values[big] },
      {
        kind: "number",
        prompt: `How many ${askMore ? "MORE" : "FEWER"} is ${theme.cats[first].label} than ${theme.cats[second].label}?`,
        hint: `Subtract the two VALUES (not the number of lines between the bars — that would give ${diff / spec.scale}, which skips multiplying by ${spec.scale}).`,
        explain: `${values[big]} − ${values[small]} = ${diff}.`,
        answer: diff,
      },
    ],
    wrapUp: `${theme.cats[big].label} has ${diff} more than ${theme.cats[small].label}.`,
  };
}

function compareTwoStepProblem(): Problem {
  const theme = pick(THEMES);
  const spec = pick(SCALE_SPECS);
  let values = [onGridValue(spec), onGridValue(spec), onGridValue(spec)];
  while (values[0] + values[1] === values[2]) values = [onGridValue(spec), onGridValue(spec), onGridValue(spec)];
  const [a, b, c] = theme.cats.map((x) => x.label);
  const combined = values[0] + values[1];
  const diff = Math.abs(combined - values[2]);
  const moreOrFewer = combined > values[2] ? "MORE" : "FEWER";
  const axisMax = axisMaxFor(values, spec.scale);
  return {
    title: "Two-step comparison",
    bucket: "compareTwoStep",
    story: theme.title + ".",
    visual: () => <ScaledBarChart categories={barCats(theme, values)} scale={spec.scale} axisMax={axisMax} minorStep={spec.minorStep} />,
    steps: [
      { kind: "number", prompt: `How many are ${a} and ${b} together?`, hint: "Read both bars, then add.", explain: `${values[0]} + ${values[1]} = ${combined}.`, answer: combined },
      {
        kind: "number",
        prompt: `How many ${moreOrFewer} are ${a} and ${b} together than ${c}?`,
        hint: `Compare your total (${combined}) to ${c}'s value — subtract the smaller from the bigger.`,
        explain: `${Math.max(combined, values[2])} − ${Math.min(combined, values[2])} = ${diff}.`,
        answer: diff,
      },
    ],
    wrapUp: `${a} + ${b} = ${combined}, which is ${diff} ${moreOrFewer.toLowerCase()} than ${c} (${values[2]}).`,
  };
}

const PICTURE_KEYS = [2, 4, 10];
/** A picture-graph value: a multiple of key/2 (the half-icon convention),
 *  1 to 6 icons' worth. `forceHalf` makes it land on a half icon. */
function pictureValue(key: number, forceHalf: boolean): number {
  // forceHalf: an odd number of half-icons, 3..11 (1½ to 5½ icons — always at least one whole icon).
  const halves = forceHalf ? randInt(1, 5) * 2 + 1 : randInt(2, 12);
  return (halves * key) / 2;
}

function pictureGraphProblem(): Problem {
  const theme = pick(THEMES);
  const key = pick(PICTURE_KEYS);
  const target = pictureValue(key, true);
  const others = [pictureValue(key, Math.random() < 0.5), pictureValue(key, Math.random() < 0.5)];
  const shown: PictureCategory[] = [1, 2].map((i, k) => ({ label: theme.cats[i].label, glyph: theme.cats[i].glyph, value: others[k] }));
  const fullIcons = Math.floor(target / key);
  const readIdx = randInt(0, 1);
  const read = shown[readIdx];
  const t = theme.cats[0];
  return {
    title: "Complete the picture graph",
    bucket: "pictureGraph",
    story: `${theme.title}: the ${t.label} row is missing. ${t.label} has ${target}. Each icon = ${key}.`,
    visual: () => <ScaledPictureGraph keyValue={key} categories={shown} />,
    steps: [
      {
        kind: "number",
        prompt: `How many WHOLE ${t.glyph} icons go in the ${t.label} row?`,
        hint: `How many groups of ${key} fit into ${target}?`,
        explain: `${fullIcons} whole icons make ${fullIcons * key}.`,
        answer: fullIcons,
      },
      choice(
        {
          prompt: `${target} − ${fullIcons * key} = ${key / 2} is left over. What do you draw for it?`,
          hint: `Half an icon always stands for half the key: half of ${key} is ${key / 2}.`,
          explain: `Half an icon — it stands for ${key / 2}, exactly half of ${key}.`,
        },
        "Half an icon",
        ["A whole icon", "Nothing — leftovers don't get drawn"]
      ),
      {
        kind: "number",
        prompt: `Now read the ${read.label} row. How many is ${read.label}?`,
        hint: `Multiply the whole icons by ${key}, and add ${key / 2} for a half icon.`,
        explain: `${read.label} = ${read.value}.`,
        answer: read.value,
      },
    ],
    wrapUp: `${t.label}: ${fullIcons} whole icons + a half icon = ${target}.`,
  };
}

function graphsProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "readAtGridline") return readAtGridlineProblem();
  if (bucket === "readBetween") return readBetweenProblem();
  if (bucket === "compareOneStep") return compareOneStepProblem();
  if (bucket === "compareTwoStep") return compareTwoStepProblem();
  return pictureGraphProblem();
}

export const scaledGraphs: Unit = {
  id: "scaledGraphs",
  title: "Scaled Picture Graphs and Bar Graphs",
  goal: "Read and draw graphs where one picture or one line stands for more than one item, and answer how-many-more/fewer questions.",
  standard: "3.MD.3",
  keyIdea: (
    <>
      <p>Always read the KEY first. If each line or icon is worth 5, a bar reaching line 3 shows 3 × 5 = 15 — not 3.</p>
      <p>Half an icon stands for half the key. For "how many more," subtract the two VALUES, not the number of lines between the bars.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Scaled Graphs", make: graphsProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: scaledGraphsTest,
};
