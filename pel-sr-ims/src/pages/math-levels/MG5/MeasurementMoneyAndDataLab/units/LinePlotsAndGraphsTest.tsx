import { LinePlot, PictureGraph, BarGraph, type GraphCategory } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Line Plots and Picture/Bar Graphs ----------
// Self-contained (no import from LinePlotsAndGraphs.tsx).

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

function randomCategories(): GraphCategory[] {
  const set = shuffle(CATEGORY_SETS)[0];
  const tones: ("a" | "b" | "c")[] = ["a", "b", "c"];
  return set.map((c, i) => ({ ...c, count: randInt(2, 9), tone: tones[i % tones.length] }));
}

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

export const generatePlotQuestion = (): TestQuestion[] => {
  const { values } = randomPlotData();
  // Drawn from the values ACTUALLY present — see LinePlotsAndGraphs.tsx's
  // generatePlotProblem for why (never ask about an in-range value that
  // happens to occur zero times).
  const targetValue = values[randInt(0, values.length - 1)];
  const targetCount = values.filter((v) => v === targetValue).length;
  const sorted = shuffle(values);
  return [
    {
      visual: (
        <div className="digital-display" style={{ fontSize: 16 }}>
          Measurements: {sorted.join(", ")}
        </div>
      ),
      difficulty: "medium",
      step: { kind: "number", prompt: `A class measured these pencils (in inches). How many measured exactly ${targetValue} inches?`, hint: "Count how many times that number appears in the list.", explain: `${targetValue} appears ${targetCount} time${targetCount === 1 ? "" : "s"}.`, answer: targetCount },
    },
  ];
};

/** THE core misconception: stacked ×'s above one value are multiple data points. */
export const stackedMarksQuestion = (): TestQuestion[] => {
  const n = randInt(2, 4);
  const values = Array.from({ length: n }, () => 5);
  return [
    {
      visual: <LinePlot values={values} min={4} max={6} />,
      difficulty: "medium",
      step: choice(
        { prompt: "How many measurements of 5 inches does this line plot show?", hint: "Count the ×'s stacked above the 5, not just whether there's a mark there.", explain: `There are ${n} ×'s stacked above 5, so ${n} measurements.` },
        `${n}`,
        ["1", "0"]
      ),
    },
  ];
};

export const readLinePlotQuestion = (): TestQuestion[] => {
  const { values, min, max } = randomPlotData();
  const vals = Array.from(new Set(values)).sort((a, b) => a - b);
  if (vals.length < 2) return readLinePlotQuestion();
  const [valA, valB] = shuffle(vals).slice(0, 2);
  const countA = values.filter((v) => v === valA).length;
  const countB = values.filter((v) => v === valB).length;
  const bigger = countA >= countB ? valA : valB;
  const other = bigger === valA ? valB : valA;
  const diff = Math.abs(countA - countB);
  return [
    {
      visual: <LinePlot values={values} min={min} max={max} tone="b" />,
      difficulty: "hard",
      step: { kind: "number", prompt: `How many MORE measurements are there at ${bigger} inches than at ${other} inches?`, hint: "Count each stack, then subtract.", explain: `The difference is ${diff}.`, answer: diff },
    },
  ];
};

export const readPictureGraphQuestion = (): TestQuestion[] => {
  const categories = randomCategories();
  const target = categories[randInt(0, categories.length - 1)];
  return [
    {
      visual: <PictureGraph categories={categories} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `How many ${target.label.toLowerCase()} are shown?`, hint: `Count the ${target.glyph} in that row.`, explain: `There are ${target.count}.`, answer: target.count },
    },
  ];
};

export const readBarGraphQuestion = (): TestQuestion[] => {
  const categories = randomCategories();
  const target = categories[randInt(0, categories.length - 1)];
  return [
    {
      visual: <BarGraph categories={categories} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `How many ${target.label.toLowerCase()} are shown?`, hint: "Read that bar's height against the gridlines.", explain: `The ${target.label} bar shows ${target.count}.`, answer: target.count },
    },
  ];
};

export const putTogetherQuestion = (): TestQuestion[] => {
  const categories = randomCategories();
  const [a, b] = shuffle(categories).slice(0, 2);
  const total = a.count + b.count;
  return [
    {
      visual: <BarGraph categories={categories} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `How many ${a.label.toLowerCase()} and ${b.label.toLowerCase()} are there combined?`, hint: `Add: ${a.count} + ${b.count}.`, explain: `${a.count} + ${b.count} = ${total}.`, answer: total },
    },
  ];
};

export const compareBarQuestion = (): TestQuestion[] => {
  const categories = randomCategories();
  let [a, b] = shuffle(categories).slice(0, 2);
  while (a.count === b.count) {
    [a, b] = shuffle(categories).slice(0, 2);
  }
  const bigger = a.count > b.count ? a : b;
  const smaller = a.count > b.count ? b : a;
  const diff = bigger.count - smaller.count;
  return [
    {
      visual: <BarGraph categories={categories} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `How many MORE ${bigger.label.toLowerCase()} are there than ${smaller.label.toLowerCase()}?`, hint: `Subtract: ${bigger.count} − ${smaller.count}.`, explain: `${bigger.count} − ${smaller.count} = ${diff}.`, answer: diff },
    },
  ];
};

/** Bar-graph gridline-scale misconception. */
export const gridlineQuestion = (): TestQuestion[] => {
  const categories: GraphCategory[] = [{ glyph: "⚽", label: "Soccer", count: 8, tone: "a" }];
  return [
    {
      visual: <BarGraph categories={categories} tickStep={2} />,
      difficulty: "hard",
      step: choice(
        { prompt: "These gridlines count by 2 (0, 2, 4, 6, 8). The bar's top lines up with the 4th gridline. How tall is the bar?", hint: "Read the gridline's own label, not just how many lines you passed.", explain: "The 4th gridline up is labeled 8." },
        "8",
        ["4"]
      ),
    },
  ];
};

export const linePlotsAndGraphsTest: Unit["test"] = {
  questions: [
    () => generatePlotQuestion(),
    () => stackedMarksQuestion(),
    () => readLinePlotQuestion(),
    () => readPictureGraphQuestion(),
    () => readPictureGraphQuestion(),
    () => readBarGraphQuestion(),
    () => putTogetherQuestion(),
    () => compareBarQuestion(),
    () => compareBarQuestion(),
    () => gridlineQuestion(),
  ],
  passScore: 9,
};
