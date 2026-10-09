import React, { useState } from "react";
import { ConversionChain, DoubleNumberLine, RatioTable } from "../diagrams";
import { palette } from "../../shared/lib/palette";
import { fmt, fracText, gcd, pick, randInt, shuffle, simplify } from "../../shared/lib/math";
import { choice, type Problem } from "../../shared/engine/types";
import { QA, QB, Says, Stepper } from "../../shared/engine/controls";
import type { Unit } from "../../shared/units/types";
import { conversionsTest } from "./ConversionsTest";

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

// Conversion facts worth drilling before Practice unlocks — deliberately
// excludes hr-min (60) and day-hr (24), which students already know cold by
// 5th grade and don't need a forced check on. See Unit.requiresIntro /
// reintroEverySolved below: the gate re-picks 3 of these at random each time
// it's shown (first visit, and again periodically), so a single pass doesn't
// let a student get away with only ever proving the same one or two facts.
const DRILL_IDS = ["ft-in", "yd-ft", "gal-qt", "lb-oz", "m-cm", "kg-g"];
const DRILL_COUNT = 3;

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [id, setId] = useState("ft-in");
  const [v, setV] = useState(3);
  const [toBig, setToBig] = useState(false);
  const c = conversions.find((x) => x.id === id)!;
  const amount = toBig ? v * c.f : v; // what we start with
  const result = toBig ? v : v * c.f;

  // Required guided drill: confirm DRILL_COUNT randomly-picked "must memorize"
  // conversion facts before Practice unlocks (or re-unlocks — see
  // reintroEverySolved on the unitConversion export below). Each stage asks
  // for the bare fact (1 {big} = ? {smalls}), not a scaled multiple, since
  // that's literally what we want memorized — same anchor-statement idea as
  // Percent.tsx's "1 block = 10%" intro, generalized to a rotating fact pool.
  const [drillIds] = useState(() => shuffle(DRILL_IDS).slice(0, DRILL_COUNT));
  const [drillStage, setDrillStage] = useState(0);
  const [introCompleted, setIntroCompleted] = useState(false);
  const [introInput, setIntroInput] = useState("");
  const [introWrong, setIntroWrong] = useState(false);
  const showIntro = introActive && !introCompleted;
  const drillTarget = conversions.find((x) => x.id === drillIds[drillStage])!;
  const drillReady = id === drillTarget.id;

  const checkIntro = () => {
    const val = Number(introInput);
    if (Number.isFinite(val) && val === drillTarget.f) {
      setIntroWrong(false);
      setIntroInput("");
      if (drillStage < drillIds.length - 1) {
        setDrillStage((s) => s + 1);
      } else {
        setIntroCompleted(true);
        onIntroDone?.();
      }
    } else {
      setIntroWrong(true);
    }
  };

  return (
    <div className="explore">
      {showIntro && (
        <div className="intro-gate">
          <p className="intro-gate-title">Before you practice: let's lock in a few conversion facts.</p>
          {drillReady ? (
            <>
              <p>
                1 {drillTarget.big} = ___ {drillTarget.smalls}
              </p>
              <div className="control-row">
                <input
                  className="answer"
                  inputMode="decimal"
                  autoComplete="off"
                  value={introInput}
                  onChange={(e) => setIntroInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkIntro()}
                  aria-label={`1 ${drillTarget.big} equals how many ${drillTarget.smalls}`}
                />
                <button className="btn primary" onClick={checkIntro}>
                  Check
                </button>
              </div>
              {introWrong && (
                <p className="feedback bad" role="alert">
                  Not quite. Use the diagrams below to find it.
                </p>
              )}
            </>
          ) : (
            <p>
              Select <b>{drillTarget.bigs} & {drillTarget.smalls}</b> from the dropdown below to continue.
            </p>
          )}
          <p className="muted small">
            Fact {drillStage + 1} of {drillIds.length}.
          </p>
        </div>
      )}
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
        {
          prompt: (
            <>
              Going from {c.bigs} to {c.smalls} is going to a <b>smaller</b> unit. Should you multiply or divide by {c.f}?
            </>
          ),
          hint: `A smaller unit means you need MORE of them to describe the same amount.`,
          explain: `Going to a smaller unit, you need more of them: multiply by ${c.f}.`,
        },
        `Multiply by ${c.f}`,
        [`Divide by ${c.f}`]
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
        {
          prompt: (
            <>
              Going from {c.smalls} to {c.bigs} is going to a <b>bigger</b> unit. Should you multiply or divide by {c.f}?
            </>
          ),
          hint: `A bigger unit means you need FEWER of them to describe the same amount.`,
          explain: `Going to a bigger unit, you need fewer of them: divide by ${c.f}.`,
        },
        `Divide by ${c.f}`,
        [`Multiply by ${c.f}`]
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
  const [hrsNum, hrsDen] = simplify(m, 60);
  const hrsFrac = fracText(m, 60);
  const hrsWord = hrs <= 1 ? "hour" : "hours";
  const g = gcd(m, 60);
  return {
    title: "Units in a rate problem",
    story: (
      <>
        A bus travels at <QA>{r} miles per hour</QA>. How far does it go in <QB>{m} minutes</QB>?
      </>
    ),
    visual: (done) => (
      <>
        <ConversionChain
          start={{ value: m, unit: "min", color: palette.b, simplifiedValue: done >= 2 ? hrsNum : undefined }}
          factors={[
            ...(done >= 1
              ? [{ num: { value: 1, unit: "hr" }, den: { value: 60, unit: "min", color: palette.b, simplifiedValue: done >= 2 ? hrsDen : undefined } }]
              : []),
            ...(done >= 2 ? [{ num: { value: r, unit: "mi", color: palette.a }, den: { value: 1, unit: "hr" } }] : []),
          ]}
          result={{ value: done >= 3 ? fmt(d) : "?", unit: done >= 2 ? "mi" : "" }}
        />
        {done >= 2 && (
          <Says>
            {m}/{g} = {hrsNum} and 60/{g} = {hrsDen}.
          </Says>
        )}
      </>
    ),
    steps: [
      choice(
        { prompt: "The rate uses hours but the time is in minutes. What should you do first?", hint: "The units have to match before you multiply.", explain: "Change minutes to hours so the hours in the rate can cancel." },
        `Change ${m} minutes into hours`,
        [`Multiply ${r} × ${m} right away`, `Divide ${m} by ${r}`]
      ),
      {
        kind: "number",
        frac: true,
        fracRequired: true,
        fracAnswer: [hrsNum, hrsDen],
        prompt: <>{m} minutes is how many hours? Write your answer as a simplified fraction.</>,
        answer: hrs,
        suffix: hrsWord,
        hint: `60 minutes = 1 hour, so write ${m}/60 as a fraction, then simplify it.`,
        explain: `${m}/60 simplifies to ${hrsFrac} ${hrsWord}. The minutes cancel.`,
      },
      {
        kind: "number",
        prompt: <>Now multiply the rate by the time. How many miles?</>,
        answer: d,
        suffix: "miles",
        hint: `${r} × ${hrsFrac}`,
        explain: `${r} mi/hr × ${hrsFrac} hr = ${fmt(d)} mi. The hours cancel, leaving miles.`,
      },
    ],
    wrapUp: (
      <>
        Write the units with the numbers. When a unit is on top and bottom, it cancels — that tells you the answer is in miles.
      </>
    ),
  };
};

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return <ConversionChain start={{ value: 3, unit: "ft", color: palette.a }} factors={[{ num: { value: 12, unit: "in" }, den: { value: 1, unit: "ft" } }]} result={{ value: 36, unit: "in" }} />;
}

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
  requiresIntro: true,
  // Re-show the drill every 20 solved problems, not just once — these are
  // facts meant to be memorized long-term, not just proven usable one time.
  reintroEverySolved: 20,
  preview: Preview,
  problems: [
    { label: "Big to small", make: bigToSmallProblem },
    { label: "Small to big", make: smallToBigProblem },
    { label: "Rate × time", make: rateTimeProblem },
  ],
  test: conversionsTest,
};
