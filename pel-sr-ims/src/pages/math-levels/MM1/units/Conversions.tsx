import React, { useState } from "react";
import { ConversionChain, DoubleNumberLine, RatioTable } from "../diagrams";
import { palette } from "../lib/palette";
import { fmt, pick, randInt } from "../lib/math";
import { choice, type Problem } from "../engine/types";
import { QA, QB, Says, Stepper } from "../engine/controls";
import type { Unit } from "./types";

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

export const conversions: Conv[] = [
  { id: "ft-in", big: "foot", bigs: "feet", bigAb: "ft", small: "inch", smalls: "inches", smallAb: "in", f: 12 },
  { id: "yd-ft", big: "yard", bigs: "yards", bigAb: "yd", small: "foot", smalls: "feet", smallAb: "ft", f: 3 },
  { id: "hr-min", big: "hour", bigs: "hours", bigAb: "hr", small: "minute", smalls: "minutes", smallAb: "min", f: 60 },
  { id: "gal-qt", big: "gallon", bigs: "gallons", bigAb: "gal", small: "quart", smalls: "quarts", smallAb: "qt", f: 4 },
  { id: "lb-oz", big: "pound", bigs: "pounds", bigAb: "lb", small: "ounce", smalls: "ounces", smallAb: "oz", f: 16 },
  { id: "m-cm", big: "meter", bigs: "meters", bigAb: "m", small: "centimeter", smalls: "centimeters", smallAb: "cm", f: 100 },
  { id: "kg-g", big: "kilogram", bigs: "kilograms", bigAb: "kg", small: "gram", smalls: "grams", smallAb: "g", f: 1000 },
  { id: "day-hr", big: "day", bigs: "days", bigAb: "d", small: "hour", smalls: "hours", smallAb: "hr", f: 24 },
];

function Explore() {
  const [id, setId] = useState("ft-in");
  const [v, setV] = useState(3);
  const [toBig, setToBig] = useState(false);
  const c = conversions.find((x) => x.id === id)!;
  const amount = toBig ? v * c.f : v; // what we start with
  const result = toBig ? v : v * c.f;

  return (
    <div className="explore">
      <div className="controls">
        <label className="select">
          <span className="stepper-label">Units</span>
          <select value={id} onChange={(e) => setId(e.target.value)}>
            {conversions.map((x) => (
              <option key={x.id} value={x.id}>
                {x.bigs} and {x.smalls}
              </option>
            ))}
          </select>
        </label>
        <div className="control-row">
          <Stepper tone="a" label={c.bigs} value={v} min={1} max={10} onChange={setV} />
          <button className="btn ghost" onClick={() => setToBig((t) => !t)}>
            Convert {toBig ? `${c.bigs} → ${c.smalls}` : `${c.smalls} → ${c.bigs}`} instead
          </button>
        </div>
      </div>
      <div className="stage">
        {toBig ? (
          <ConversionChain
            start={{ value: amount, unit: c.smallAb, color: palette.b }}
            factors={[{ num: { value: 1, unit: c.bigAb, color: palette.a }, den: { value: c.f, unit: c.smallAb, color: palette.b } }]}
            result={{ value: fmt(result), unit: c.bigAb }}
          />
        ) : (
          <ConversionChain
            start={{ value: amount, unit: c.bigAb, color: palette.a }}
            factors={[{ num: { value: c.f, unit: c.smallAb, color: palette.b }, den: { value: 1, unit: c.bigAb, color: palette.a } }]}
            result={{ value: fmt(result), unit: c.smallAb }}
          />
        )}
        <DoubleNumberLine
          top={{ label: c.bigs, color: palette.a }}
          bottom={{ label: c.smalls, color: palette.b }}
          pairs={Array.from({ length: Math.min(v, 6) + 1 }, (_, i) => ({ top: i, bottom: i * c.f, highlight: i === 1 })).concat(v > 6 ? [{ top: v, bottom: v * c.f, highlight: false }] : [])}
          maxBottom={v * c.f}
        />
        <RatioTable
          compact
          columns={[
            { label: c.bigs, color: palette.a },
            { label: c.smalls, color: palette.b },
          ]}
          rows={[1, 2, 3, v].filter((n, i, arr) => arr.indexOf(n) === i).sort((x, y) => x - y).map((n) => [{ value: n, highlight: n === v }, { value: n * c.f, highlight: n === v }])}
        />
      </div>
      <div className="sayings">
        <Says>
          The ratio is <QA>1 {c.big}</QA> to <QB>{c.f} {c.smalls}</QB>, so {c.f} {c.smalls} per {c.big}.
        </Says>
        <Says>
          {toBig
            ? `Going to a bigger unit, you need fewer of them: divide by ${c.f}.`
            : `Going to a smaller unit, you need more of them: multiply by ${c.f}.`}{" "}
          Pick the fraction that puts the unit you're getting rid of on the bottom, so it cancels.
        </Says>
      </div>
    </div>
  );
}

const bigToSmallProblem = (): Problem => {
  const c = pick(conversions);
  const v = randInt(2, 9);
  const right = `${c.f} ${c.smallAb} / 1 ${c.bigAb}`;
  return {
    title: "Convert to a smaller unit",
    story: (
      <>
        How many {c.smalls} are in <QA>
          {v} {c.bigs}
        </QA>
        ?
      </>
    ),
    visual: (done) => (
      <>
        <ConversionChain
          start={{ value: v, unit: c.bigAb, color: palette.a }}
          factors={done >= 2 ? [{ num: { value: c.f, unit: c.smallAb, color: palette.b }, den: { value: 1, unit: c.bigAb, color: palette.a } }] : []}
          result={{ value: done >= 3 ? fmt(v * c.f) : "?", unit: c.smallAb }}
        />
        <DoubleNumberLine
          top={{ label: c.bigs, color: palette.a }}
          bottom={{ label: c.smalls, color: palette.b }}
          pairs={[
            { top: 0, bottom: 0 },
            { top: 1, bottom: c.f, hideBottom: done < 1, highlight: done === 0 },
            { top: v, bottom: v * c.f, hideBottom: done < 3, highlight: done >= 1 },
          ]}
        />
      </>
    ),
    steps: [
      {
        kind: "number",
        prompt: (
          <>
            How many <QB>{c.smalls}</QB> are in 1 <QA>{c.big}</QA>?
          </>
        ),
        answer: c.f,
        suffix: c.smalls,
        hint: `This is a fact to remember: 1 ${c.big} = ? ${c.smalls}.`,
        explain: `1 ${c.big} = ${c.f} ${c.smalls}. That's the ratio ${c.f}:1, or ${c.f} ${c.smalls} per ${c.big}.`,
      },
      choice(
        { prompt: <>Which fraction should you multiply by so that {c.bigs} cancel?</>, hint: `Put ${c.bigAb} on the bottom so it cancels with the ${c.bigAb} on top.`, explain: `Multiplying by ${c.f} ${c.smallAb} / 1 ${c.bigAb} is multiplying by 1 — the amount stays the same, only the unit changes.` },
        right,
        [`1 ${c.bigAb} / ${c.f} ${c.smallAb}`]
      ),
      {
        kind: "number",
        prompt: (
          <>
            So {v} {c.bigs} = how many {c.smalls}?
          </>
        ),
        answer: v * c.f,
        suffix: c.smalls,
        hint: `${v} × ${c.f}`,
        explain: `${v} × ${c.f} = ${v * c.f} ${c.smalls}. A smaller unit means a bigger number.`,
      },
    ],
    wrapUp: (
      <>
        {v} {c.bigs} = {v * c.f} {c.smalls}.
      </>
    ),
  };
};

const smallToBigProblem = (): Problem => {
  const c = pick(conversions);
  const v = randInt(2, 9);
  const s = v * c.f;
  return {
    title: "Convert to a bigger unit",
    story: (
      <>
        How many {c.bigs} are in <QB>
          {s} {c.smalls}
        </QB>
        ?
      </>
    ),
    visual: (done) => (
      <>
        <ConversionChain
          start={{ value: s, unit: c.smallAb, color: palette.b }}
          factors={done >= 2 ? [{ num: { value: 1, unit: c.bigAb, color: palette.a }, den: { value: c.f, unit: c.smallAb, color: palette.b } }] : []}
          result={{ value: done >= 3 ? fmt(v) : "?", unit: c.bigAb }}
        />
        <DoubleNumberLine
          top={{ label: c.bigs, color: palette.a }}
          bottom={{ label: c.smalls, color: palette.b }}
          pairs={[
            { top: 0, bottom: 0 },
            { top: 1, bottom: c.f, hideBottom: done < 1, highlight: done === 0 },
            { top: v, bottom: s, hideTop: done < 3, highlight: done >= 1 },
          ]}
        />
      </>
    ),
    steps: [
      {
        kind: "number",
        prompt: (
          <>
            How many <QB>{c.smalls}</QB> make 1 <QA>{c.big}</QA>?
          </>
        ),
        answer: c.f,
        suffix: c.smalls,
        hint: `1 ${c.big} = ? ${c.smalls}`,
        explain: `${c.f} ${c.smalls} = 1 ${c.big}.`,
      },
      choice(
        { prompt: <>Which fraction should you multiply by so that {c.smalls} cancel?</>, hint: `${c.smallAb} must go on the bottom.`, explain: `With ${c.smallAb} on the bottom, the ${c.smallAb} cancel and ${c.bigAb} is left.` },
        `1 ${c.bigAb} / ${c.f} ${c.smallAb}`,
        [`${c.f} ${c.smallAb} / 1 ${c.bigAb}`]
      ),
      {
        kind: "number",
        prompt: (
          <>
            So {s} {c.smalls} = how many {c.bigs}?
          </>
        ),
        answer: v,
        suffix: c.bigs,
        hint: `${s} ÷ ${c.f}`,
        explain: `${s} ÷ ${c.f} = ${v}. A bigger unit means a smaller number.`,
      },
    ],
    wrapUp: (
      <>
        {s} {c.smalls} = {v} {c.bigs}.
      </>
    ),
  };
};

const rateTimeProblem = (): Problem => {
  const r = pick([30, 40, 48, 50, 60]);
  const m = pick([15, 20, 30, 45, 90, 120, 150].filter((x) => (r * x) % 60 === 0));
  const hrs = m / 60;
  const d = (r * m) / 60;
  return {
    title: "Units in a rate problem",
    story: (
      <>
        A bus travels at <QA>{r} miles per hour</QA>. How far does it go in <QB>{m} minutes</QB>?
      </>
    ),
    visual: (done) => (
      <ConversionChain
        start={{ value: m, unit: "min", color: palette.b }}
        factors={[
          ...(done >= 1 ? [{ num: { value: 1, unit: "hr" }, den: { value: 60, unit: "min", color: palette.b } }] : []),
          ...(done >= 2 ? [{ num: { value: r, unit: "mi", color: palette.a }, den: { value: 1, unit: "hr" } }] : []),
        ]}
        result={{ value: done >= 3 ? fmt(d) : "?", unit: done >= 2 ? "mi" : "" }}
      />
    ),
    steps: [
      choice(
        { prompt: "The rate uses hours but the time is in minutes. What should you do first?", hint: "The units have to match before you multiply.", explain: "Change minutes to hours so the hours in the rate can cancel." },
        `Change ${m} minutes into hours`,
        [`Multiply ${r} × ${m} right away`, `Divide ${m} by ${r}`]
      ),
      {
        kind: "number",
        prompt: <>{m} minutes is how many hours? (Fractions or decimals are fine.)</>,
        answer: hrs,
        suffix: "hours",
        hint: `60 minutes = 1 hour, so divide ${m} by 60.`,
        explain: `${m} ÷ 60 = ${fmt(hrs)} hours. The minutes cancel.`,
      },
      {
        kind: "number",
        prompt: <>Now multiply the rate by the time. How many miles?</>,
        answer: d,
        suffix: "miles",
        hint: `${r} × ${fmt(hrs)}`,
        explain: `${r} mi/hr × ${fmt(hrs)} hr = ${fmt(d)} mi. The hours cancel, leaving miles.`,
      },
    ],
    wrapUp: (
      <>
        Write the units with the numbers. When a unit is on top and bottom, it cancels — that tells you the answer is in miles.
      </>
    ),
  };
};

export const unitConversion: Unit = {
  id: "conversion",
  title: "Converting units",
  goal: "Use ratios to change units, and keep track of units when you multiply or divide",
  standard: "6.RP.A.3d",
  keyIdea: (
    <>
      <p>
        A unit fact is a ratio: <QA>1 foot</QA> to <QB>12 inches</QB>. To convert, multiply by a fraction equal to 1, like 12 in / 1 ft, chosen so the old unit cancels.
      </p>
      <p>3 ft × 12 in / 1 ft = 36 in. Feet are on top and bottom, so they cancel.</p>
    </>
  ),
  Explore,
  problems: [
    { label: "Big to small", make: bigToSmallProblem },
    { label: "Small to big", make: smallToBigProblem },
    { label: "Rate × time", make: rateTimeProblem },
  ],
};
