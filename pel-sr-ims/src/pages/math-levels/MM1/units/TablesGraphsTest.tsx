import React from "react";
import { CoordinatePlane, RatioTable } from "../diagrams";
import type { RatioTableCell } from "../diagrams";
import { palette } from "../../shared/lib/palette";
import { gcd, lcm, randInt } from "../../shared/lib/math";
import { choice, type TestQuestion } from "../../shared/engine/types";
import { QA, QB, niceMax, niceStep } from "../../shared/engine/controls";
import type { Unit } from "../../shared/units/types";

// ---------- end-of-unit test: Tables & graphs ----------
// 10 questions from 9 generators (trail mix produces a non-leading pair that
// shares one scenario's randomized numbers, restated in full in each question's
// own prompt). Broadly mirrors RatioLanguageTest.tsx/UnitRateTest.tsx's shape —
// 2 colored, 3 easy/4 medium/3 hard, final 3 are multiple-choice "sentence"
// questions — but with 3 diagrams instead of the usual max 2: this unit's whole
// subject IS tables and graphs, so diagrams aren't incidental here the way they
// were in the other two units. RatioTable and CoordinatePlane both print their
// own column/axis labels directly, so the diagram questions here don't need a
// separate legend.

// Q1 — lemonade table: diagram + QA/QB color. Easy: read a missing cell using the shown ×k scale.
const lemonadeTableQuestion = (): TestQuestion[] => {
  const baseA = randInt(2, 4); // lemon scoops
  const baseB = randInt(3, 6); // cups of water
  const askB = Math.random() < 0.5;
  const rows: RatioTableCell[][] = [1, 2, 3, 4].map((k) => [{ value: baseA * k, missing: !askB && k === 4 }, { value: baseB * k, missing: askB && k === 4 }]);
  const Missing = askB ? QB : QA;
  const missingLabel = askB ? "cups of water" : "lemon scoops";
  return [
    {
      visual: (
        <RatioTable
          columns={[
            { label: "lemon scoops", color: palette.a },
            { label: "cups of water", color: palette.b },
          ]}
          rows={rows}
          scales={[1, 2, 3, 4]}
        />
      ),
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: (
          <>
            Using the ×4 scale shown, what is the missing <Missing>{missingLabel}</Missing> value in row 4?
          </>
        ),
        answer: askB ? baseB * 4 : baseA * 4,
        hint: "Multiply row 1's value by 4.",
        explain: askB ? `${baseB} × 4 = ${baseB * 4}.` : `${baseA} × 4 = ${baseA * 4}.`,
      },
    },
  ];
};

// Q2 — graphed line: diagram, no color. Hard: extrapolate past the plotted points using the slope.
const graphedLineQuestion = (): TestQuestion[] => {
  let p = randInt(2, 4);
  let q = randInt(3, 6);
  while (gcd(p, q) !== 1) {
    p = randInt(2, 4);
    q = randInt(3, 6);
  }
  const k3 = randInt(5, 7);
  const shownKs = [1, 2];
  const xMaxRaw = p * k3;
  const yMaxRaw = q * k3;
  const xs = niceStep(xMaxRaw, 8);
  const ys = niceStep(yMaxRaw, 8);
  return [
    {
      visual: (
        <CoordinatePlane
          xMax={niceMax(xMaxRaw, xs)}
          yMax={niceMax(yMaxRaw, ys)}
          xStep={xs}
          yStep={ys}
          xLabel="x"
          yLabel="y"
          points={shownKs.map((k) => ({ x: p * k, y: q * k, color: palette.muted, showLabel: true }))}
          lines={[{ slope: q / p, color: palette.muted, dashed: true }]}
        />
      ),
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: <>The dashed line shows a ratio. If x = {p * k3}, what should y be to stay on the line?</>,
        answer: q * k3,
        hint: `Find the ratio from the two plotted points (x:y = ${p}:${q}), then scale it up to x = ${p * k3}.`,
        explain: `${p * k3} ÷ ${p} = ${k3}, so y = ${q} × ${k3} = ${q * k3}.`,
      },
    },
  ];
};

// Q3/Q4 — trail mix: no diagram, color text. Easy scale forward, then medium find the scale factor.
const trailMixQuestions = (): TestQuestion[] => {
  const p = randInt(1, 3); // cups of nuts
  let q = randInt(2, 5); // cups of raisins
  while (q === p) q = randInt(2, 5);
  const scaleK = randInt(3, 5);
  const scaleK2 = randInt(3, 5);
  const nutsFirst = Math.random() < 0.5;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: (
          <>
            A trail mix recipe uses <QA>{p} cups of nuts</QA> for every <QB>{q} cups of raisins</QB>. If you make {scaleK} times the recipe, how many cups of {nutsFirst ? "nuts" : "raisins"} will you need?
          </>
        ),
        answer: nutsFirst ? p * scaleK : q * scaleK,
        suffix: "cups",
        hint: `Multiply by ${scaleK}.`,
        explain: nutsFirst ? `${p} × ${scaleK} = ${p * scaleK}.` : `${q} × ${scaleK} = ${q * scaleK}.`,
      },
    },
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: nutsFirst ? (
          <>A trail mix recipe uses {p} cups of nuts for every {q} cups of raisins. What scale factor turns {q} cups of raisins into {q * scaleK2} cups?</>
        ) : (
          <>A trail mix recipe uses {p} cups of nuts for every {q} cups of raisins. What scale factor turns {p} cups of nuts into {p * scaleK2} cups?</>
        ),
        answer: scaleK2,
        hint: nutsFirst ? `${q} × ? = ${q * scaleK2}.` : `${p} × ? = ${p * scaleK2}.`,
        explain: `× ${scaleK2}.`,
      },
    },
  ];
};

// Q5 — solve the proportion: no diagram, no color. Medium: given one column's target, find the other.
const proportionQuestion = (): TestQuestion[] => {
  let p = randInt(2, 5);
  let q = randInt(2, 6);
  while (gcd(p, q) !== 1) {
    p = randInt(2, 5);
    q = randInt(2, 6);
  }
  const k = randInt(4, 7);
  const targetQ = q * k;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: <>A garden mix uses {p} cups of compost for every {q} cups of soil. If a larger batch uses {targetQ} cups of soil, how many cups of compost does it use?</>,
        answer: p * k,
        hint: `${targetQ} ÷ ${q} = ${k}, so multiply ${p} by ${k} too.`,
        explain: `${targetQ} ÷ ${q} = ${k}, so ${p} × ${k} = ${p * k}.`,
      },
    },
  ];
};

// Q6 — next row: diagram, no color. Easy: continue a table's pattern to a later row.
const nextRowQuestion = (): TestQuestion[] => {
  const p = randInt(2, 4);
  let q = randInt(3, 6);
  while (q === p) q = randInt(3, 6);
  const rowN = randInt(4, 6);
  return [
    {
      visual: (
        <RatioTable
          columns={[
            { label: "A", color: palette.ink },
            { label: "B", color: palette.ink },
          ]}
          rows={[
            [{ value: p }, { value: q }],
            [{ value: "..." }, { value: "..." }],
            [
              { missing: true, highlight: true },
              { missing: true, highlight: true },
            ],
          ]}
        />
      ),
      difficulty: "easy",
      step: {
        kind: "ratio",
        prompt: <>The table shows row 1 of a ratio pattern. What is row {rowN} (marked with a ?)? You don't need to simplify this one.</>,
        answer: [rowN * p, rowN * q],
        tones: "none",
        equivalentHint: `That's an equivalent ratio, but this question wants ${rowN * p}:${rowN * q} as row ${rowN}, not reduced.`,
        hint: `Multiply ${p} and ${q} each by ${rowN}.`,
        explain: `${rowN * p}:${rowN * q}.`,
      },
    },
  ];
};

// Q7 — simplify the base ratio: no diagram, no color. Medium: reduce a table's starting row.
const simplifyBaseQuestion = (): TestQuestion[] => {
  let p = randInt(2, 5);
  let q = randInt(2, 6);
  while (gcd(p, q) !== 1) {
    p = randInt(2, 5);
    q = randInt(2, 6);
  }
  const g = randInt(2, 4);
  const m = p * g;
  const n = q * g;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "ratio",
        prompt: <>A ratio table begins with the row {m}:{n}. What is the simplest form of this ratio — the smallest whole numbers that could start this same table?</>,
        answer: [p, q],
        tones: "none",
        equivalentHint: `${m}:${n} is correct but not simplest form — divide both numbers by their greatest common factor.`,
        hint: `Find the biggest number that divides both ${m} and ${n}.`,
        explain: `${m} and ${n} both divide by ${g}, giving ${p}:${q}.`,
      },
    },
  ];
};

// The final 3 questions are all multiple-choice "sentence" questions, each
// testing one distinct tables-and-graphs skill: continuing a pattern,
// recognizing an equivalent pair, and comparing two rates via a common multiple.

// Q8 — pattern continuation: no diagram, no color, multiple choice. Medium: continue a table's pattern.
const patternContinuationQuestion = (): TestQuestion[] => {
  const p = randInt(2, 4);
  let q = randInt(3, 6);
  while (q === p) q = randInt(3, 6);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: (
            <>
              A ratio table begins {p}:{q}, {2 * p}:{2 * q}, {3 * p}:{3 * q}. Which row correctly continues this pattern?
            </>
          ),
          hint: "Multiply both numbers by the same next whole number — don't add.",
          explain: `Row 4 is the row-1 ratio scaled by 4: ${4 * p}:${4 * q}.`,
        },
        `${4 * p}:${4 * q}`,
        [`${3 * p + q}:${3 * q + p}`, `${4 * p}:${3 * q}`, `${5 * p}:${4 * q}`]
      ),
    },
  ];
};

// Q9 — equivalent or not: no diagram, no color, multiple choice. Hard: recognize a pair that belongs in the table.
const equivalentOrNotQuestion = (): TestQuestion[] => {
  let p = randInt(2, 5);
  let q = randInt(3, 7);
  while (gcd(p, q) !== 1) {
    p = randInt(2, 5);
    q = randInt(3, 7);
  }
  const k = randInt(4, 6);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>A ratio table is built from the ratio {p}:{q}. Which pair of numbers is also equivalent to this ratio?</>,
          hint: `Every pair must simplify back to ${p}:${q}.`,
          explain: `${p * k}:${q * k} simplifies back to ${p}:${q}, so it's equivalent.`,
        },
        `${p * k}:${q * k}`,
        [`${p * k + 1}:${q * k}`, `${q * k}:${p * k}`, `${p * k}:${q * k + p}`]
      ),
    },
  ];
};

// Q10 — faster rate: no diagram, no color, multiple choice. Hard: compare two rates via a common multiple,
// the same method compareProblem() uses in practice mode (scale both to the LCM, then compare).
const fasterRateQuestion = (): TestQuestion[] => {
  const b1 = randInt(2, 5);
  let b2 = randInt(2, 5);
  while (b1 === b2) b2 = randInt(2, 5);
  const L = lcm(b1, b2);
  let a1 = randInt(1, b1 + 2);
  let a2 = randInt(1, b2 + 2);
  while (a1 * b2 === a2 * b1) {
    a1 = randInt(1, b1 + 2);
    a2 = randInt(1, b2 + 2);
  }
  const s1 = (a1 * L) / b1;
  const s2 = (a2 * L) / b2;
  const stronger = s1 > s2 ? "Team A" : "Team B";
  const weaker = s1 > s2 ? "Team B" : "Team A";
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>Team A inflates {a1} balloons every {b1} minutes. Team B inflates {a2} balloons every {b2} minutes. Which sentence correctly compares their speeds?</>,
          hint: `Scale both rates to the same number of minutes (${L}), then compare.`,
          explain: `In ${L} minutes, Team A inflates ${s1} balloons and Team B inflates ${s2}, so ${stronger} is faster.`,
        },
        `${stronger} inflates more balloons per minute.`,
        [`${weaker} inflates more balloons per minute.`, "They inflate balloons at the same rate.", "It's impossible to compare without knowing the total time."]
      ),
    },
  ];
};

export const tablesGraphsTest: Unit["test"] = {
  questions: [lemonadeTableQuestion, graphedLineQuestion, trailMixQuestions, proportionQuestion, nextRowQuestion, simplifyBaseQuestion, patternContinuationQuestion, equivalentOrNotQuestion, fasterRateQuestion],
  passScore: 9,
};
