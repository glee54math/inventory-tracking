import React from "react";
import { ConversionChain, DoubleNumberLine, RatioTable } from "../diagrams";
import type { RatioTableCell } from "../diagrams";
import { palette } from "../../shared/lib/palette";
import { fracText, pick, randInt, simplify } from "../../shared/lib/math";
import { choice, type TestQuestion } from "../../shared/engine/types";
import { QA, QB } from "../../shared/engine/controls";
import type { Unit } from "../../shared/units/types";

// Own local copy of Conversions.tsx's conversion-facts table, not an import —
// every other MM1 *Test.tsx keeps its own local data rather than importing
// from its main unit file (see MATH_TSX_STYLE_GUIDE.txt section 7's "known
// duplication" convention), and here it's load-bearing: Conversions.tsx
// imports conversionsTest from this file, so importing `conversions` back
// from Conversions.tsx would be a circular import — which threw during
// module evaluation in dev (surfaced as a blanket "Level MM1 not found",
// since LevelsPage.tsx's dynamic import() silently swallows any load error).
interface Conv {
  id: string;
  big: string;
  bigs: string;
  bigAb: string;
  small: string;
  smalls: string;
  smallAb: string;
  f: number;
}

const conversions: Conv[] = [
  { id: "ft-in", big: "foot", bigs: "feet", bigAb: "ft", small: "inch", smalls: "inches", smallAb: "in", f: 12 },
  { id: "yd-ft", big: "yard", bigs: "yards", bigAb: "yd", small: "foot", smalls: "feet", smallAb: "ft", f: 3 },
  { id: "hr-min", big: "hour", bigs: "hours", bigAb: "hr", small: "minute", smalls: "minutes", smallAb: "min", f: 60 },
  { id: "gal-qt", big: "gallon", bigs: "gallons", bigAb: "gal", small: "quart", smalls: "quarts", smallAb: "qt", f: 4 },
  { id: "lb-oz", big: "pound", bigs: "pounds", bigAb: "lb", small: "ounce", smalls: "ounces", smallAb: "oz", f: 16 },
  { id: "m-cm", big: "meter", bigs: "meters", bigAb: "m", small: "centimeter", smalls: "centimeters", smallAb: "cm", f: 100 },
  { id: "kg-g", big: "kilogram", bigs: "kilograms", bigAb: "kg", small: "gram", smalls: "grams", smallAb: "g", f: 1000 },
  { id: "day-hr", big: "day", bigs: "days", bigAb: "d", small: "hour", smalls: "hours", smallAb: "hr", f: 24 },
];

// Only these three pairs are actual LENGTH units — questions worded around a
// physical length ("a fence is ___ long") must restrict pick() to this
// subset, or a volume/weight/time pair (e.g. "a fence is 2 gallons long")
// produces a nonsensical story. Questions with no physical-length noun in
// their wording (e.g. "how many X are in Y Z?") are fine pulling from the
// full `conversions` pool regardless of unit type.
const LENGTH_IDS = ["ft-in", "yd-ft", "m-cm"];
const pickLength = (): Conv => conversions.find((c) => c.id === pick(LENGTH_IDS))!;

// ---------- end-of-unit test: Converting units ----------
// 10 questions from 9 generators (the fence-length pair shares one scenario's
// randomized numbers, restated in full in each question's own prompt).
// Broadly mirrors TablesGraphsTest.tsx's shape — 3 diagrams instead of the
// usual 2, since this unit's whole subject IS converting between
// represented-as-diagrams units, so diagrams aren't incidental here either —
// 3/4/3 easy/medium/hard, final 3 are multiple-choice "sentence" questions.
// QA/QB color coding is reserved for the first 4 questions only (Q1 and the
// Q3/Q4 pair), same as every other MM1 unit test. ConversionChain and
// DoubleNumberLine both print their own labels directly, so the diagram
// questions here don't need a separate legend.
//
// Crucially, the final MC block tests the SAME "multiply vs. divide, and
// why" conceptual framing the practice problems were deliberately rewritten
// to use (see bigToSmallProblem/smallToBigProblem in Conversions.tsx) rather
// than the fraction-cancellation "which fraction should you multiply by"
// phrasing those problems used to have — these 5th graders haven't learned
// formal dimensional analysis, so the test shouldn't quietly test it either.
//
// The two rate×time questions (Q6, Q7) reuse rateTimeProblem's own
// terminating-decimal discipline: Q7's minute pool is filtered so the final
// distance is always a whole number, and Q6's fraction answer uses the same
// frac/fracRequired engine flags (never accepts a decimal like "0.33" where
// an exact fraction is expected) — see shared/engine/types.ts's
// NumberStep.fracRequired.

// Q1 — fence (big → small): diagram + QA/QB color. Easy: read the factor off the chain, then scale it up.
const fenceSmallerQuestion = (): TestQuestion[] => {
  const c = pick(conversions);
  const v = randInt(2, 9);
  return [
    {
      visual: (
        <ConversionChain
          start={{ value: v, unit: c.bigAb, color: palette.a }}
          factors={[{ num: { value: c.f, unit: c.smallAb, color: palette.b }, den: { value: 1, unit: c.bigAb, color: palette.a } }]}
          result={{ value: "?", unit: c.smallAb }}
        />
      ),
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: (
          <>
            How many <QB>{c.smalls}</QB> are in <QA>{v} {c.bigs}</QA>?
          </>
        ),
        answer: v * c.f,
        suffix: c.smalls,
        hint: `1 ${c.big} = ${c.f} ${c.smalls}, so multiply by ${c.f}.`,
        explain: `${v} × ${c.f} = ${v * c.f} ${c.smalls}.`,
      },
    },
  ];
};

// Q2 — ribbon (small → big): diagram, no color. Medium: read a missing top value off the number line.
const ribbonBiggerQuestion = (): TestQuestion[] => {
  const c = pick(conversions);
  const v = randInt(2, 9);
  const s = v * c.f;
  return [
    {
      visual: (
        <DoubleNumberLine
          top={{ label: c.bigs, color: palette.a }}
          bottom={{ label: c.smalls, color: palette.b }}
          pairs={[
            { top: 0, bottom: 0 },
            { top: 1, bottom: c.f, highlight: true },
            { top: v, bottom: s, hideTop: true },
          ]}
        />
      ),
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `How many ${c.bigs} are in ${s} ${c.smalls}?`,
        answer: v,
        suffix: c.bigs,
        hint: `${s} ÷ ${c.f}`,
        explain: `${s} ÷ ${c.f} = ${v} ${c.bigs}.`,
      },
    },
  ];
};

// Q3/Q4 — fence length: no diagram, color text. Easy convert it, then medium identify the factor used.
const fenceLengthQuestions = (): TestQuestion[] => {
  const c = pickLength();
  const v = randInt(2, 9);
  const s = v * c.f;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: (
          <>
            A fence is <QA>{v} {c.bigs}</QA> long. How many <QB>{c.smalls}</QB> is that?
          </>
        ),
        answer: s,
        suffix: c.smalls,
        hint: `${v} × ${c.f}`,
        explain: `${v} × ${c.f} = ${s} ${c.smalls}.`,
      },
    },
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: (
          <>
            That same fence is <QA>{v} {c.bigs}</QA>, or <QB>{s} {c.smalls}</QB>. What number did you multiply {v} by to get {s}?
          </>
        ),
        answer: c.f,
        hint: `${s} ÷ ${v}`,
        explain: `${s} ÷ ${v} = ${c.f} — that's the conversion factor, 1 ${c.big} = ${c.f} ${c.smalls}.`,
      },
    },
  ];
};

// Q5 — ratio table: diagram, no color. Medium: continue the table's pattern to a new row.
const tableQuestion = (): TestQuestion[] => {
  const c = pick(conversions);
  const n = randInt(4, 9);
  const rows: RatioTableCell[][] = [1, 2, 3, n]
    .filter((x, i, arr) => arr.indexOf(x) === i)
    .sort((a, b) => a - b)
    .map((row) => (row === n ? [{ value: row, highlight: true }, { missing: true, highlight: true }] : [{ value: row }, { value: row * c.f }]));
  return [
    {
      visual: (
        <RatioTable
          columns={[
            { label: c.bigs, color: palette.a },
            { label: c.smalls, color: palette.b },
          ]}
          rows={rows}
        />
      ),
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `Using the table's pattern, how many ${c.smalls} equal ${n} ${c.bigs}?`,
        answer: n * c.f,
        suffix: c.smalls,
        hint: `${n} × ${c.f}`,
        explain: `${n} × ${c.f} = ${n * c.f} ${c.smalls}, continuing the table's pattern.`,
      },
    },
  ];
};

// Q6 — minutes to hours as a fraction: no diagram, no color. Hard: same frac/fracRequired
// discipline as rateTimeProblem's own hours step — a decimal like "0.33" is rejected outright.
const minutesToHoursQuestion = (): TestQuestion[] => {
  const m = pick([15, 20, 30, 45, 90, 120, 150]);
  const hrs = m / 60;
  const [num, den] = simplify(m, 60);
  const word = hrs <= 1 ? "hour" : "hours";
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        frac: true,
        fracRequired: true,
        fracAnswer: [num, den],
        prompt: `${m} minutes is how many hours? Write your answer as a simplified fraction.`,
        answer: hrs,
        suffix: word,
        hint: `Write ${m}/60 as a fraction, then simplify it.`,
        explain: `${m}/60 simplifies to ${fracText(m, 60)} ${word}.`,
      },
    },
  ];
};

// Q7 — rate × time, full distance: no diagram, no color. Medium: the end-to-end computation,
// same minute-pool filter as rateTimeProblem so the distance always comes out whole.
const rateDistanceQuestion = (): TestQuestion[] => {
  const r = pick([30, 40, 48, 50, 60]);
  const m = pick([15, 20, 30, 45, 90, 120, 150].filter((x) => (r * x) % 60 === 0));
  const d = (r * m) / 60;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `A car travels at ${r} miles per hour. How far does it go in ${m} minutes?`,
        answer: d,
        suffix: "miles",
        hint: `First change ${m} minutes into hours, then multiply by ${r}.`,
        explain: `${m} minutes = ${fracText(m, 60)} hours. ${r} × ${fracText(m, 60)} = ${d} miles.`,
      },
    },
  ];
};

// The final 3 questions are multiple-choice "sentence" questions testing the same
// multiply-vs-divide conceptual reasoning the practice problems use — never the
// fraction-cancellation phrasing those problems were deliberately moved away from.

// Q8 — smaller unit: no diagram, no color, multiple choice. Hard: multiply, and why.
const smallerUnitReasoningQuestion = (): TestQuestion[] => {
  const c = pick(conversions);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `Which sentence correctly describes converting ${c.bigs} to ${c.smalls} (a smaller unit)?`,
          hint: "A smaller unit means you need MORE of them to describe the same amount.",
          explain: `Going to a smaller unit, you need more of them: multiply by ${c.f}.`,
        },
        `You multiply by ${c.f}, because a smaller unit needs a bigger number.`,
        [`You divide by ${c.f}, because a smaller unit needs a bigger number.`, `You multiply by ${c.f}, because a smaller unit needs a smaller number.`]
      ),
    },
  ];
};

// Q9 — bigger unit: no diagram, no color, multiple choice. Hard: divide, and why.
const biggerUnitReasoningQuestion = (): TestQuestion[] => {
  const c = pick(conversions);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `Which sentence correctly describes converting ${c.smalls} to ${c.bigs} (a bigger unit)?`,
          hint: "A bigger unit means you need FEWER of them to describe the same amount.",
          explain: `Going to a bigger unit, you need fewer of them: divide by ${c.f}.`,
        },
        `You divide by ${c.f}, because a bigger unit needs a smaller number.`,
        [`You multiply by ${c.f}, because a bigger unit needs a smaller number.`, `You divide by ${c.f}, because a bigger unit needs a bigger number.`]
      ),
    },
  ];
};

// Q10 — which conversion is correct: no diagram, no color, multiple choice. Easy: recognize the
// correctly-computed conversion. Distractors are arithmetic mistakes (added instead of multiplied,
// forgot to scale, divided instead of multiplied) — never a formatting trap.
const correctConversionQuestion = (): TestQuestion[] => {
  const c = pickLength();
  let v = randInt(2, 9);
  // Avoid v where the "divided instead of multiplied" distractor accidentally
  // lands on the same number as the "forgot to scale" distractor (happens
  // when v === f*f, e.g. yd-ft's f=3 with v=9 — both would show "3").
  while (Math.round((v / c.f) * 100) / 100 === c.f) {
    v = randInt(2, 9);
  }
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        {
          prompt: `A ribbon is ${v} ${c.bigs} long. Which of these correctly converts it to ${c.smalls}?`,
          hint: `Multiply ${v} by ${c.f}.`,
          explain: `${v} × ${c.f} = ${v * c.f} ${c.smalls}.`,
        },
        `${v} ${c.bigs} = ${v * c.f} ${c.smalls}`,
        [`${v} ${c.bigs} = ${v + c.f} ${c.smalls}`, `${v} ${c.bigs} = ${c.f} ${c.smalls}`, `${v} ${c.bigs} = ${Math.round((v / c.f) * 100) / 100} ${c.smalls}`]
      ),
    },
  ];
};

export const conversionsTest: Unit["test"] = {
  questions: [
    fenceSmallerQuestion,
    ribbonBiggerQuestion,
    fenceLengthQuestions,
    tableQuestion,
    minutesToHoursQuestion,
    rateDistanceQuestion,
    smallerUnitReasoningQuestion,
    biggerUnitReasoningQuestion,
    correctConversionQuestion,
  ],
  passScore: 9,
};
