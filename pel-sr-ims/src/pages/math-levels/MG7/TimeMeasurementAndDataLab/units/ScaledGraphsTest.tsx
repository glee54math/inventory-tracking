import { ScaledBarChart, ScaledPictureGraph, type BarCategory, type PictureCategory } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Scaled Picture Graphs and Bar Graphs ----------
// 10 single-question generators, self-contained (not imported from
// ScaledGraphs.tsx — avoids a unit<->test circular import). Configs below are
// duplicated verbatim from ScaledGraphs.tsx.

const TONES = ["a", "b", "c"] as const;
interface Theme {
  title: string;
  cats: { label: string; glyph: string }[];
}
export const THEMES: Theme[] = [
  { title: "Favorite fruit", cats: [{ label: "Apples", glyph: "🍎" }, { label: "Bananas", glyph: "🍌" }, { label: "Grapes", glyph: "🍇" }] },
  { title: "Pets owned", cats: [{ label: "Cats", glyph: "🐱" }, { label: "Dogs", glyph: "🐶" }, { label: "Fish", glyph: "🐟" }] },
  { title: "Books read", cats: [{ label: "Ana", glyph: "📕" }, { label: "Ben", glyph: "📗" }, { label: "Cy", glyph: "📘" }] },
  { title: "Balls in the gym", cats: [{ label: "Soccer", glyph: "⚽" }, { label: "Basket", glyph: "🏀" }, { label: "Tennis", glyph: "🎾" }] },
];
interface ScaleSpec {
  scale: number;
  minorStep: number;
  maxValue: number;
}
export const SCALE_SPECS: ScaleSpec[] = [
  { scale: 2, minorStep: 1, maxValue: 20 },
  { scale: 5, minorStep: 1, maxValue: 30 },
  { scale: 10, minorStep: 5, maxValue: 70 },
];
const axisMaxFor = (values: number[], scale: number) => (Math.floor(Math.max(...values) / scale) + 1) * scale;
const onGridValue = (s: ScaleSpec) => randInt(1, Math.floor(s.maxValue / s.scale)) * s.scale;
function betweenValue(s: ScaleSpec): number {
  let v = randInt(1, s.maxValue / s.minorStep) * s.minorStep;
  while (v % s.scale === 0) v = randInt(1, s.maxValue / s.minorStep) * s.minorStep;
  return v;
}
const barCats = (theme: Theme, values: number[]): BarCategory[] => theme.cats.map((c, i) => ({ label: c.label, value: values[i], tone: TONES[i] }));
const PICTURE_KEYS = [2, 4, 10];

/** Bar on a labeled line, key-mode axis. Distractor #1 is the line number
 *  itself — the headline misconception (reading position as count). */
export const readGridlineQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const theme = pick(THEMES);
  // Lines >= 2 so (lines + scale) can never equal lines × scale (only at lines = scale = 2).
  const spec = pick(SCALE_SPECS);
  let values = [onGridValue(spec), onGridValue(spec), onGridValue(spec)];
  const idx = randInt(0, 2);
  while (values[idx] / spec.scale < 2 || (values[idx] / spec.scale === 2 && spec.scale === 2)) values = [onGridValue(spec), onGridValue(spec), onGridValue(spec)];
  const v = values[idx];
  const lines = v / spec.scale;
  return [
    {
      visual: <ScaledBarChart categories={barCats(theme, values)} scale={spec.scale} axisMax={axisMaxFor(values, spec.scale)} keyMode minorStep={spec.minorStep} />,
      difficulty,
      step: choice(
        { prompt: `How many is ${theme.cats[idx].label}?`, hint: "Check the key, then multiply the line number by it.", explain: `Line ${lines} × ${spec.scale} = ${v}.` },
        String(v),
        [
          String(lines), // read the line number as the count (headline misconception)
          String(lines + spec.scale), // added the key instead of multiplying
        ]
      ),
    },
  ];
};

/** Bar between two labeled lines (free-typed). */
export const readBetweenQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const theme = pick(THEMES);
  const spec = pick(SCALE_SPECS);
  const idx = randInt(0, 2);
  const values = [0, 1, 2].map((i) => (i === idx ? betweenValue(spec) : randInt(1, spec.maxValue / spec.minorStep) * spec.minorStep));
  const v = values[idx];
  const lower = Math.floor(v / spec.scale) * spec.scale;
  return [
    {
      visual: <ScaledBarChart categories={barCats(theme, values)} scale={spec.scale} axisMax={axisMaxFor(values, spec.scale)} minorStep={spec.minorStep} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `The ${theme.cats[idx].label} bar stops between two labeled lines. What is its exact value?`,
        hint: `Each light line is worth ${spec.minorStep}. Start at the labeled line below and count up.`,
        explain: `${lower} + ${v - lower} = ${v}.`,
        answer: v,
      },
    },
  ];
};

/** One-step "how many more." Distractor #1: the number of LINES between the
 *  bars (forgot to multiply by the scale); #2: the bigger value alone
 *  (answered "how many" instead of "how many more"). */
export const compareOneStepQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const theme = pick(THEMES);
  const spec = pick(SCALE_SPECS);
  const values = [onGridValue(spec), onGridValue(spec), onGridValue(spec)];
  while (values[0] === values[1]) values[1] = onGridValue(spec);
  const [big, small] = values[0] > values[1] ? [0, 1] : [1, 0];
  const diff = values[big] - values[small];
  return [
    {
      visual: <ScaledBarChart categories={barCats(theme, values)} scale={spec.scale} axisMax={axisMaxFor(values, spec.scale)} minorStep={spec.minorStep} />,
      difficulty,
      step: choice(
        {
          prompt: `How many MORE is ${theme.cats[big].label} than ${theme.cats[small].label}?`,
          hint: "Read both values, then subtract.",
          explain: `${values[big]} − ${values[small]} = ${diff}.`,
        },
        String(diff),
        [
          String(diff / spec.scale), // counted lines between bars, didn't apply the scale
          String(values[big]), // gave the bigger amount, not the difference
        ]
      ),
    },
  ];
};

/** Two-step: combine two, compare to a third (free-typed). */
export const compareTwoStepQuestion = (difficulty: "hard"): TestQuestion[] => {
  const theme = pick(THEMES);
  const spec = pick(SCALE_SPECS);
  let values = [onGridValue(spec), onGridValue(spec), onGridValue(spec)];
  while (values[0] + values[1] === values[2]) values = [onGridValue(spec), onGridValue(spec), onGridValue(spec)];
  const combined = values[0] + values[1];
  const diff = Math.abs(combined - values[2]);
  const word = combined > values[2] ? "MORE" : "FEWER";
  const [a, b, c] = theme.cats.map((x) => x.label);
  return [
    {
      visual: <ScaledBarChart categories={barCats(theme, values)} scale={spec.scale} axisMax={axisMaxFor(values, spec.scale)} minorStep={spec.minorStep} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `How many ${word} are ${a} and ${b} together than ${c}?`,
        hint: `First add ${a} and ${b}, then compare that total to ${c}.`,
        explain: `${values[0]} + ${values[1]} = ${combined}; the difference from ${values[2]} is ${diff}.`,
        answer: diff,
      },
    },
  ];
};

/** Reading a picture-graph row that ends in a half icon. Distractor #1:
 *  treated the half icon as worth 1 item; #2: counted icons, ignoring the key. */
export const readPictureHalfQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const theme = pick(THEMES);
  const key = pick(PICTURE_KEYS);
  const full = randInt(1, 5);
  const v = full * key + key / 2;
  const cats: PictureCategory[] = [
    { label: theme.cats[0].label, glyph: theme.cats[0].glyph, value: v },
    { label: theme.cats[1].label, glyph: theme.cats[1].glyph, value: randInt(1, 5) * key },
  ];
  const halfAsOne = full * key + 1;
  return [
    {
      visual: <ScaledPictureGraph keyValue={key} categories={cats} />,
      difficulty,
      step: choice(
        { prompt: `How many is ${theme.cats[0].label}?`, hint: `Whole icons × ${key}, plus half of ${key} for the half icon.`, explain: `${full} × ${key} + ${key / 2} = ${v}.` },
        String(v),
        [
          ...(halfAsOne !== v ? [String(halfAsOne)] : []), // half icon read as "1 more" (equal to v when key = 2, so dropped then)
          `${full + 1}`, // counted icons, ignored the key
        ]
      ),
    },
  ];
};

/** Drawing: how many whole icons for a count with a half-icon remainder. */
export const drawPictureQuestion = (difficulty: "medium"): TestQuestion[] => {
  const key = pick(PICTURE_KEYS);
  const full = randInt(1, 5);
  const v = full * key + key / 2;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `In a picture graph where each icon = ${key}, a row needs to show ${v}. How many WHOLE icons do you draw (before the half icon)?`,
        hint: `How many full groups of ${key} fit into ${v}?`,
        explain: `${full} whole icons make ${full * key}, and a half icon adds ${key / 2}: ${v}.`,
        answer: full,
      },
    },
  ];
};

export const scaledGraphsTest: Unit["test"] = {
  questions: [
    () => readGridlineQuestion("easy"),
    () => readGridlineQuestion("medium"),
    () => readBetweenQuestion("medium"),
    () => readBetweenQuestion("hard"),
    () => compareOneStepQuestion("medium"),
    () => compareOneStepQuestion("hard"),
    () => compareTwoStepQuestion("hard"),
    () => compareTwoStepQuestion("hard"),
    () => readPictureHalfQuestion("medium"),
    () => drawPictureQuestion("medium"),
  ],
  passScore: 9,
};
