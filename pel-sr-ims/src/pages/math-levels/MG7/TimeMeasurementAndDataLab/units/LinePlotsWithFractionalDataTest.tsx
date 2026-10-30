import { InchRuler, LinePlot, inchText } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Line Plots with Fractional Measurement Data ----------
// 10 single-question generators, self-contained (not imported from
// LinePlotsWithFractionalData.tsx — avoids a unit<->test circular import).

const OBJECTS = [
  { name: "crayon", glyph: "🖍️" },
  { name: "leaf", glyph: "🍃" },
  { name: "eraser", glyph: "🧽" },
  { name: "key", glyph: "🔑" },
  { name: "shell", glyph: "🐚" },
];
const randomQuarter = (minWhole: number) => minWhole + randInt(0, 8) / 4;
const randomTrueQuarter = (minWhole: number) => minWhole + pick([1, 3, 5, 7]) / 4;
const randomOffset = () => randInt(-8, 8) / 100;
const randomData = (minWhole: number, n: number) => Array.from({ length: n }, () => randomQuarter(minWhole));
const countAt = (data: number[], v: number) => data.filter((d) => d === v).length;

/** Measure an object on a quarter-inch ruler (free-typed). */
export const measureQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const obj = pick(OBJECTS);
  const len = 1 + randInt(1, 15) / 4;
  const offset = randomOffset();
  return [
    {
      visual: <InchRuler maxInches={5} lengthQuarter={len} offset={offset} glyph={obj.glyph} tone="a" />,
      difficulty,
      step: {
        kind: "number",
        prompt: `How long is the ${obj.name}, to the nearest 1/4 inch? (Type like 2 1/4.)`,
        hint: "Short ticks are quarters, medium ticks are halves.",
        explain: `About ${inchText(len)} inches.`,
        answer: len,
        suffix: "in",
      },
    },
  ];
};

/** Place a true-quarter measurement. Distractors: rounded to the nearest
 *  whole inch, and rounded to a neighboring half inch — both the "attend
 *  only to the labeled/bigger ticks" misconception. */
export const placeQuarterQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const minWhole = randInt(1, 4);
  const v = randomTrueQuarter(minWhole);
  const label = (x: number) => `Above ${inchText(x)}`;
  return [
    {
      visual: <LinePlot minWhole={minWhole} maxWhole={minWhole + 2} data={[]} tone="b" />,
      difficulty,
      step: choice(
        { prompt: `A shell measures ${inchText(v)} inches. Where does its dot go?`, hint: "Use the exact quarter tick — don't round.", explain: `Exactly above ${inchText(v)}.` },
        label(v),
        [
          label(Math.round(v)), // rounded to the nearest whole inch
          label(Math.floor(v) + 0.5), // rounded to the half-inch tick
        ]
      ),
    },
  ];
};

/** Frequency at one value. Distractor #1 is the VALUE itself (the
 *  frequency-vs-value mix-up); #2 is the total number of dots. */
export const frequencyQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const minWhole = randInt(1, 4);
  const data = randomData(minWhole, randInt(8, 14));
  const v = pick(data);
  const n = countAt(data, v);
  return [
    {
      visual: <LinePlot minWhole={minWhole} maxWhole={minWhole + 2} data={data} tone="a" />,
      difficulty,
      step: choice(
        { prompt: `How many objects measured ${inchText(v)} inches?`, hint: "Count the dots stacked above that tick.", explain: `${n} dot${n === 1 ? "" : "s"} above ${inchText(v)}.` },
        String(n),
        [
          inchText(v), // answered with the length, not the count
          String(data.length), // gave the total number of dots
        ]
      ),
    },
  ];
};

/** Total measured (free-typed). */
export const totalQuestion = (): TestQuestion[] => {
  const minWhole = randInt(1, 4);
  const data = randomData(minWhole, randInt(8, 15));
  return [
    {
      visual: <LinePlot minWhole={minWhole} maxWhole={minWhole + 2} data={data} tone="c" />,
      difficulty: "easy",
      step: { kind: "number", prompt: "How many objects were measured in all?", hint: "Count every dot.", explain: `${data.length} dots, so ${data.length} objects.`, answer: data.length },
    },
  ];
};

/** "How many more" between two values (free-typed). */
export const comparisonQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const minWhole = randInt(1, 4);
  let data = randomData(minWhole, randInt(9, 14));
  let values = [...new Set(data)];
  while (new Set(values.map((v) => countAt(data, v))).size < 2) {
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
  return [
    {
      visual: <LinePlot minWhole={minWhole} maxWhole={minWhole + 2} data={data} tone="b" />,
      difficulty,
      step: {
        kind: "number",
        prompt: `How many MORE objects measured ${inchText(a)} inches than ${inchText(b)} inches?`,
        hint: "Subtract the two dot counts — not the two lengths.",
        explain: `${countAt(data, a)} − ${countAt(data, b)} = ${diff}.`,
        answer: diff,
      },
    },
  ];
};

/** Frequency at a true quarter mark on a whole/half/quarter axis (free-typed). */
export const quarterFrequencyQuestion = (difficulty: "hard"): TestQuestion[] => {
  const minWhole = randInt(1, 4);
  const v = randomTrueQuarter(minWhole);
  const data = [...randomData(minWhole, randInt(6, 10)), v];
  const n = countAt(data, v);
  return [
    {
      visual: <LinePlot minWhole={minWhole} maxWhole={minWhole + 2} data={data} tone="c" />,
      difficulty,
      step: {
        kind: "number",
        prompt: `How many measurements are at exactly ${inchText(v)} inches?`,
        hint: `After ${Math.floor(v)}: short tick = 1/4, medium = 1/2, short = 3/4. Count only that tick's dots.`,
        explain: `${n} dot${n === 1 ? "" : "s"} at ${inchText(v)}.`,
        answer: n,
      },
    },
  ];
};

export const linePlotsWithFractionalDataTest: Unit["test"] = {
  questions: [
    () => measureQuestion("medium"),
    () => measureQuestion("hard"),
    () => placeQuarterQuestion("medium"),
    () => placeQuarterQuestion("hard"),
    () => frequencyQuestion("easy"),
    () => totalQuestion(),
    () => comparisonQuestion("medium"),
    () => comparisonQuestion("hard"),
    () => quarterFrequencyQuestion("hard"),
    () => quarterFrequencyQuestion("hard"),
  ],
  passScore: 9,
};
