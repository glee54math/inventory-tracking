import { FracLinePlot } from "../diagrams";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import { pick } from "../../../shared/lib/math";
import type { Unit } from "../../../shared/units/types";
import { countAt, eighthsLowest, eighthsText, makePlot, mixedText, pickDistractors, plotValues, type PlotDen, type PlotSpec } from "../lib/fractions";
import { amountStep } from "../lib/steps";
import { PLOT_CONTEXTS, type PlotContext } from "../lib/words";

// Self-contained: never imports the paired FractionLinePlots.tsx. Every plot
// here uses denominators 2, 4 or 8 ONLY (makePlot draws from PLOT_DENS).

type Diff = TestQuestion["difficulty"];
const plural = (u: string) => (u === "inch" ? "inches" : `${u}s`);
const unitWord = (pieces: number, d: number, c: PlotContext) => (pieces <= d ? c.unit : plural(c.unit));
const Plot = ({ s, c, highlight }: { s: PlotSpec; c: PlotContext; highlight?: number }) => (
  <FracLinePlot den={s.den} minWhole={s.minWhole} maxWhole={s.maxWhole} data={s.data} unit={plural(c.unit)} highlight={highlight} />
);

/** A plot plus one value that has at least `min` dots and is not a whole number. */
export function plotWithStack(min: number, den?: PlotDen): { s: PlotSpec; v: number } {
  const s = makePlot(den);
  const candidates = plotValues(s.data).filter((v) => v % 8 !== 0);
  const v = candidates.length > 0 ? pick(candidates) : s.data.find((x) => x % 8 !== 0) ?? s.minWhole * 8 + 8 / s.den;
  while (countAt(s.data, v) < min) s.data.push(v);
  return { s, v };
}

/** Q1 — how many measurements at one value. */
export function countAtQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const s = makePlot();
  const c = pick(PLOT_CONTEXTS);
  const v = pick(s.data);
  return [
    {
      visual: <Plot s={s} c={c} highlight={v} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `${c.intro} How many ${c.things} measured ${eighthsText(v)} ${unitWord(v, 8, c)}?`,
        hint: `Count the dots stacked above ${eighthsText(v)}. (The answer is a count, not a length.)`,
        explain: `There ${countAt(s.data, v) === 1 ? "is 1 dot" : `are ${countAt(s.data, v)} dots`} above ${eighthsText(v)}.`,
        answer: countAt(s.data, v),
      },
    },
  ];
}

/** Q2 — how many measurements MORE than a value. */
export function countMoreThanQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const s = makePlot();
  const c = pick(PLOT_CONTEXTS);
  const vals = plotValues(s.data);
  const v = pick(vals.length > 1 ? vals.slice(0, -1) : vals);
  const n = s.data.filter((x) => x > v).length;
  return [
    {
      visual: <Plot s={s} c={c} highlight={v} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `${c.intro} How many ${c.things} measured MORE than ${eighthsText(v)} ${unitWord(v, 8, c)}?`,
        hint: `Count every dot to the RIGHT of ${eighthsText(v)} — not the dots on ${eighthsText(v)} itself.`,
        explain: `${n} dots sit to the right of ${eighthsText(v)}.`,
        answer: n,
      },
    },
  ];
}

/** Q3 — total of the measurements at one value (c × v, written in v's own lowest-terms denominator). */
export function totalAtTickQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { s, v } = plotWithStack(2);
  const c = pick(PLOT_CONTEXTS);
  const k = countAt(s.data, v);
  const { n, d } = eighthsLowest(v);
  return [
    {
      visual: <Plot s={s} c={c} highlight={v} />,
      difficulty,
      step: amountStep(
        {
          prompt: `${c.intro} What is the TOTAL ${c.measure} of all the ${c.things} that measured ${eighthsText(v)} ${unitWord(v, 8, c)}?`,
          hint: `There are ${k} dots at ${eighthsText(v)}. Add ${eighthsText(v)} that many times (or multiply).`,
          explain: `${k} × ${n}/${d} = ${k * n}/${d} = ${mixedText(k * n, d)}.`,
        },
        k * n,
        d,
        unitWord(k * n, d, c)
      ),
    },
  ];
}

/** Q4 — total, as a choice with the classic count-plus-value trap. */
export function totalTrapChoiceQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const { s, v } = plotWithStack(2);
  const c = pick(PLOT_CONTEXTS);
  const k = countAt(s.data, v);
  const { n, d } = eighthsLowest(v);
  const correct = mixedText(k * n, d);
  return [
    {
      visual: <Plot s={s} c={c} highlight={v} />,
      difficulty,
      step: choice(
        {
          prompt: `${c.intro} What is the total ${c.measure} of the ${c.things} at ${eighthsText(v)} ${unitWord(v, 8, c)}?`,
          hint: "Each dot is one measurement of that size. Add them all up.",
          explain: `${k} dots × ${n}/${d} each = ${k * n}/${d} = ${correct}.`,
        },
        correct,
        pickDistractors(correct, [
          mixedText(k * d + n, d), // wrote the count next to the value ("k and n/d")
          mixedText(n, d), // gave one measurement, forgot to add the others
          mixedText(k * n + 1, d), // miscounted by one piece
        ])
      ),
    },
  ];
}

/** Q5 — longest value (not the tallest stack). */
export function longestQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const s = makePlot();
  const c = pick(PLOT_CONTEXTS);
  const vals = plotValues(s.data);
  const max = vals[vals.length - 1];
  const mode = vals.reduce((best, v) => (countAt(s.data, v) > countAt(s.data, best) ? v : best), vals[0]);
  const correct = eighthsText(max);
  return [
    {
      visual: <Plot s={s} c={c} />,
      difficulty,
      step: choice(
        {
          prompt: `${c.intro} What did the ${c.most} one measure?`,
          hint: "The biggest measurement is the dot farthest to the RIGHT — not the tallest stack.",
          explain: `The farthest-right dot is at ${correct}.`,
        },
        correct,
        pickDistractors(correct, [
          eighthsText(mode), // picked the tallest stack (most common), not the biggest value
          eighthsText(vals[0]), // picked the smallest
          eighthsText(s.maxWhole * 8), // read the end of the axis, not a dot
          ...vals.map(eighthsText),
        ])
      ),
    },
  ];
}

/** Q6 / Q7 — difference between the biggest and smallest measurement, in the plot's denominator. */
export function differenceQuestion(difficulty: Diff = "medium", den?: PlotDen, overOne = false): TestQuestion[] {
  let s = makePlot(den);
  for (let tries = 0; overOne && tries < 50; tries++) {
    const vals = plotValues(s.data);
    if (vals[vals.length - 1] - vals[0] > 8 && (vals[vals.length - 1] - vals[0]) % 8 !== 0) break;
    s = makePlot(den);
  }
  const c = pick(PLOT_CONTEXTS);
  const vals = plotValues(s.data);
  const max = vals[vals.length - 1];
  const min = vals[0];
  const step = 8 / s.den;
  const pieces = (max - min) / step;
  return [
    {
      visual: <Plot s={s} c={c} />,
      difficulty,
      step: amountStep(
        {
          prompt: `${c.intro} How much bigger is the ${c.most} measurement than the ${c.least}? (Use ${s.den === 2 ? "halves" : s.den === 4 ? "fourths" : "eighths"}, like the plot.)`,
          hint: `Biggest ${eighthsText(max)}, smallest ${eighthsText(min)}. Write both in ${s.den === 2 ? "halves" : s.den === 4 ? "fourths" : "eighths"} — or count the tick jumps between them.`,
          explain: `${mixedText(max / step, s.den)} − ${mixedText(min / step, s.den)} = ${mixedText(pieces, s.den)}.`,
        },
        pieces,
        s.den,
        unitWord(pieces, s.den, c)
      ),
    },
  ];
}

/** Q8 — place a measurement given in a non-lowest form (e.g. 2/4 on a plot labeled 1/2). */
export function placeDotQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const den = pick([4, 8] as const);
  const s = makePlot(den);
  const c = pick(PLOT_CONTEXTS);
  const step = 8 / den;
  const ticks = plotValues(s.data);
  // prefer a value whose lowest-terms form is NOT how it's written below
  const tricky = ticks.filter((v) => v % 8 !== 0 && eighthsLowest(v % 8).d < den);
  const v = pick(tricky.length > 0 ? tricky : ticks);
  const w = Math.floor(v / 8);
  const r = (v % 8) / step;
  const written = r === 0 ? String(w) : w === 0 ? `${r}/${den}` : `${w} ${r}/${den}`;
  const k = countAt(s.data, v);
  return [
    {
      visual: <Plot s={s} c={c} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `${c.intro} One more measurement is ${written} ${unitWord(v, 8, c)}. After you plot it, how many dots will be above that spot?`,
        hint: `${written} = ${eighthsText(v)}. Find that tick, count its dots, then add the new one.`,
        explain: `${written} is the same as ${eighthsText(v)}. It has ${k} dot${k === 1 ? "" : "s"} now, so ${k + 1} after adding one.`,
        answer: k + 1,
      },
    },
  ];
}

const listText = (data: number[]) => data.map(eighthsText).join(", ");

/** Q9 — "make the plot" from a raw list, then read one stack. */
export function buildFromListQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const s = makePlot(undefined, 8);
  const c = pick(PLOT_CONTEXTS);
  const v = pick(s.data);
  const k = countAt(s.data, v);
  return [
    {
      visual: <FracLinePlot den={s.den} minWhole={s.minWhole} maxWhole={s.maxWhole} data={[]} unit={plural(c.unit)} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `${c.intro} The measurements were: ${listText(s.data)}. If you plot all of them on this line plot, how many dots go above ${eighthsText(v)}?`,
        hint: `One dot per measurement. Count how many times ${eighthsText(v)} shows up in the list.`,
        explain: `${eighthsText(v)} appears ${k} time${k === 1 ? "" : "s"}, so ${k} dot${k === 1 ? "" : "s"}.`,
        answer: k,
      },
    },
  ];
}

/** Q10 — which tick will have the tallest stack once the list is plotted. */
export function buildTallestQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  let s = makePlot(undefined, 9);
  const modeOf = (sp: PlotSpec) => {
    const vals = plotValues(sp.data);
    const top = Math.max(...vals.map((v) => countAt(sp.data, v)));
    const winners = vals.filter((v) => countAt(sp.data, v) === top);
    return winners.length === 1 ? winners[0] : null;
  };
  while (modeOf(s) === null) s = makePlot(undefined, 9);
  const mode = modeOf(s)!;
  const c = pick(PLOT_CONTEXTS);
  const vals = plotValues(s.data);
  const correct = eighthsText(mode);
  return [
    {
      visual: <FracLinePlot den={s.den} minWhole={s.minWhole} maxWhole={s.maxWhole} data={[]} unit={plural(c.unit)} />,
      difficulty,
      step: choice(
        {
          prompt: `${c.intro} The measurements were: ${listText(s.data)}. Once they're all plotted, which spot has the TALLEST stack of dots?`,
          hint: "The tallest stack is the measurement that appears the most times — not the biggest number.",
          explain: `${correct} appears ${countAt(s.data, mode)} times — more than any other measurement.`,
        },
        correct,
        pickDistractors(correct, [
          eighthsText(vals[vals.length - 1]), // picked the biggest value, not the most frequent
          eighthsText(s.data[0]), // picked the first one in the list
          ...vals.map(eighthsText),
        ])
      ),
    },
  ];
}

export const fractionLinePlotsTest: Unit["test"] = {
  questions: [
    () => countAtQuestion("easy"),
    () => countMoreThanQuestion("medium"),
    () => totalAtTickQuestion("medium"),
    () => totalTrapChoiceQuestion("hard"),
    () => longestQuestion("medium"),
    () => differenceQuestion("medium", 8),
    () => differenceQuestion("hard", 4, true),
    () => placeDotQuestion("hard"),
    () => buildFromListQuestion("medium"),
    () => buildTallestQuestion("hard"),
  ],
  passScore: 9,
};
