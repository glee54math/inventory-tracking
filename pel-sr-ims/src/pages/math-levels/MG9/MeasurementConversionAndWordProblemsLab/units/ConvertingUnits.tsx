import { useState } from "react";
import { ConversionTable, UnitBar } from "../diagrams";
import { fmt, pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { QA, QB, Says, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CONVS, FAMILIES, barPieces, bigWord, convById, leftoverSmall, pickConv, type Conv, type Family } from "../lib/measures";
import { CfuToggle, CheckForUnderstanding, type CfuQuestion } from "./cfu";
import { convertingUnitsTest } from "./ConvertingUnitsTest";

/** A memory hook for each fact — the prefix meaning for metric pairs, and an
 *  explicit "this one is NOT a ten" warning for the two irregular factors. */
const factHint = (c: Conv): string => {
  if (c.id === "m-cm") return "Centi- means one hundredth: it takes 100 centimeters to make a meter.";
  if (c.f === 1000) return c.id === "l-ml" ? "Milli- means one thousandth: it takes 1,000 milliliters to make a liter." : "Kilo- means one thousand.";
  if (c.f === 16) return "This is the one fact that isn't a 10, 100 or 1,000 — it's 16.";
  return "Think of a clock: 60 of the smaller unit make the bigger one.";
};

// ============================================================================
// CHECK FOR UNDERSTANDING — required gate, re-shown every 20 solved problems
// (reintroEverySolved) because these factors are meant to be memorized.
// ============================================================================

const CFU: CfuQuestion[] = [
  // Vocabulary a rote drill never asks: what the metric prefixes MEAN.
  {
    rows: [
      ["Kilo- (as in kilometer and kilogram) means", { kind: "select", label: "meaning of kilo", options: ["one hundred", "one thousand", "one tenth"], correct: 1 }, "."],
      ["Centi- (as in centimeter) means", { kind: "select", label: "meaning of centi", options: ["one thousandth — 1,000 fit in a meter", "one hundred meters", "one hundredth — 100 fit in a meter"], correct: 2 }, "."],
      ["Milli- (as in milliliter) means", { kind: "select", label: "meaning of milli", options: ["one thousandth — 1,000 fit in a liter", "one hundredth — 100 fit in a liter", "one thousand liters"], correct: 0 }, "."],
    ],
    good: "Right — kilo = 1,000, so 1 km = 1,000 m and 1 kg = 1,000 g. Centi = one hundredth, so 100 cm = 1 m. Milli = one thousandth, so 1,000 mL = 1 L.",
    bad: "Not quite. A kilometer is a LONG way (1,000 meters). A centimeter is tiny — 100 of them make a meter. A milliliter is tinier still — 1,000 of them fill a liter.",
  },
  // Commonly conflated: the size of the UNIT vs the size of the NUMBER.
  {
    rows: [
      ["Maya says 3 km is shorter than 800 m, because 3 is less than 800."],
      ["3 km =", { kind: "number", label: "3 km in meters", answer: 3000 }, "m. So the longer distance is", { kind: "select", label: "longer distance", options: ["800 m", "3 km", "they're the same"], correct: 1 }, "."],
      ["Maya's mistake was", { kind: "select", label: "Maya's mistake", options: ["adding instead of multiplying", "comparing the numbers without looking at the units", "nothing — she's right"], correct: 1 }, "."],
    ],
    good: "Right — 3 km = 3,000 m, way more than 800 m. A bigger unit can have a smaller number and still be more. Compare in the SAME unit.",
    bad: (v) =>
      v[0].trim() === "3"
        ? "3 km is 3 × 1,000 = 3,000 meters — the number changes when the unit changes."
        : v[0].replace(/,/g, "").trim() === "300"
          ? "1 km is 1,000 m (not 100), so 3 km = 3,000 m."
          : "Not quite. 1 km = 1,000 m, so 3 km = 3,000 m — much longer than 800 m, even though 3 is a smaller number than 800.",
  },
  // The plan's core trap: big → small means MULTIPLY (students often divide).
  {
    rows: [
      ["To change 5 kilograms into grams, you should", { kind: "select", label: "operation", options: ["divide by 1,000", "multiply by 1,000", "add 1,000"], correct: 1 }, ","],
      ["because a gram is", { kind: "select", label: "why", options: ["a bigger unit, so you need fewer of them", "a smaller unit, so you need more of them"], correct: 1 }, "."],
      ["5 kg =", { kind: "number", label: "5 kg in grams", answer: 5000 }, "g"],
    ],
    good: "Right — going to a SMALLER unit means you need MORE of them, so you multiply: 5 × 1,000 = 5,000 g.",
    bad: "Not quite — a gram is tiny (about one paper clip), so it takes MORE grams than kilograms to weigh the same thing. More of them → multiply: 5 × 1,000 = 5,000 g.",
  },
  // Generalization trap: "every conversion is 10, 100 or 1,000" — false.
  {
    rows: [
      ["True or false: every conversion in this unit uses 10, 100, or 1,000.", { kind: "select", label: "true or false", options: ["True", "False"], correct: 1 }],
      ["1 pound =", { kind: "number", label: "ounces in a pound", answer: 16, width: 60 }, "ounces, and 1 hour =", { kind: "number", label: "minutes in an hour", answer: 60, width: 60 }, "minutes."],
    ],
    good: "False — pounds use 16 and time uses 60. Those are the two facts most worth memorizing, because the \"just add zeros\" trick doesn't work for them.",
    bad: (v) =>
      v[2].trim() === "100"
        ? "An hour is 60 minutes (like a clock), not 100 — time doesn't work in tens."
        : v[1].trim() === "10" || v[1].trim() === "100"
          ? "1 pound = 16 ounces — not a \"tens\" number at all."
          : "Not quite. 1 pound = 16 ounces and 1 hour = 60 minutes — so the statement is false.",
  },
];

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [id, setId] = useState("kg-g");
  const [count, setCount] = useState(3);
  const [extra, setExtra] = useState(0);
  const c = convById(id);
  const [, each] = barPieces(c.f);
  const safeExtra = Math.min(extra, c.f - each);
  const total = count * c.f + safeExtra;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}

      <div className="control-row">
        <label className="select">
          <span className="stepper-label">Units</span>
          <select
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setExtra(0);
            }}
          >
            {CONVS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.bigs} and {x.smalls}
              </option>
            ))}
          </select>
        </label>
        <Stepper label={c.bigs} value={count} min={1} max={10} onChange={setCount} tone="a" />
        <Stepper label={`extra ${c.smalls}`} value={safeExtra} min={0} max={c.f - each} step={each} onChange={setExtra} tone="b" />
      </div>

      <UnitBar conv={c} showFact />
      <Says>
        <QA>1 {c.big}</QA> is {c.bigLike}. <QB>1 {c.small}</QB> is {c.smallLike}. It takes <b>{fmt(c.f)}</b> {c.smalls} to make one {c.big}.
      </Says>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        <ConversionTable
          leftHead={c.bigs}
          rightHead={c.smalls}
          rows={Array.from({ length: count }, (_, i) => ({ left: String(i + 1), right: fmt((i + 1) * c.f), highlight: i + 1 === count }))}
        />
        <div style={{ flex: "1 1 260px" }}>
          <Says>
            Going to a <b>smaller</b> unit, you need <b>more</b> of them — so <b>multiply</b>: {count} × {fmt(c.f)} = {fmt(count * c.f)} {c.smalls}.
          </Says>
          {safeExtra > 0 && (
            <Says>
              {count} {bigWord(c, count)} {safeExtra} {c.smalls} = {fmt(count * c.f)} + {safeExtra} = <b>{fmt(total)}</b> {c.smalls}.
            </Says>
          )}
          <Says>Each row of the table goes up by {fmt(c.f)} — the same as multiplying the left number by {fmt(c.f)}.</Says>
        </div>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <CheckForUnderstanding title="Check for understanding: which unit is bigger, and do you multiply or divide?" questions={CFU} onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = Family | "table";
const CONVERT_BUCKETS: Family[] = FAMILIES;
const BUCKETS: Bucket[] = [...FAMILIES, "table"];
type Dir = "toSmall" | "mixed" | "toBig";

/** One conversion, randomizing WHICH path it demonstrates (big → small,
 *  a mixed measure like "3 lb 5 oz" → small, or small → big), not just the
 *  numbers. Always 3 steps: the memorized fact, multiply-or-divide, compute. */
function conversionProblem(family: Family): Problem {
  const c = pickConv(family);
  const dir: Dir = pick(["toSmall", "mixed", "toBig"] as const);
  const v = randInt(2, 9);
  const r = dir === "mixed" ? leftoverSmall(c.f) : 0;
  const answer = dir === "toBig" ? v : v * c.f + r;
  const f = fmt(c.f);
  const startText = dir === "toBig" ? `${fmt(v * c.f)} ${c.smalls}` : dir === "mixed" ? `${v} ${c.bigs} ${r} ${r === 1 ? c.small : c.smalls}` : `${v} ${c.bigs}`;
  const targetUnit = dir === "toBig" ? c.bigs : c.smalls;

  const rows =
    dir === "toBig"
      ? (done: number) => [
          { left: "1", right: done >= 1 ? f : null },
          { left: String(v), right: fmt(v * c.f), leftHidden: done < 3, highlight: true },
        ]
      : dir === "mixed"
        ? (done: number) => [
            { left: "1", right: done >= 1 ? f : null },
            { left: `${v} ${c.bigAb} ${r} ${c.smallAb}`, right: done >= 3 ? fmt(answer) : null, highlight: true },
          ]
        : (done: number) => [
            { left: "1", right: done >= 1 ? f : null },
            { left: String(v), right: done >= 3 ? fmt(answer) : null, highlight: true },
          ];

  return {
    title: dir === "toBig" ? "Convert to the bigger unit" : "Convert to the smaller unit",
    bucket: family,
    story: (
      <>
        How many {targetUnit} is <b>{startText}</b>?
      </>
    ),
    visual: (done) => (
      <div style={{ display: "grid", gap: 12 }}>
        <UnitBar conv={c} showFact={done >= 1} />
        <ConversionTable leftHead={c.bigs} rightHead={c.smalls} rows={rows(done)} />
      </div>
    ),
    steps: [
      {
        kind: "number",
        prompt: (
          <>
            First the fact: 1 <QA>{c.big}</QA> = how many <QB>{c.smalls}</QB>?
          </>
        ),
        suffix: c.smallAb,
        hint: factHint(c),
        explain: `1 ${c.big} = ${f} ${c.smalls}. A ${c.big} is ${c.bigLike}; a ${c.small} is ${c.smallLike}.`,
        answer: c.f,
      },
      dir === "toBig"
        ? choice(
            {
              prompt: `You're going from ${c.smalls} to ${c.bigs} — a BIGGER unit. What should you do with ${f}?`,
              hint: "A bigger unit means you need FEWER of them.",
              explain: `Bigger unit, fewer of them: divide by ${f}.`,
            },
            `Divide by ${f} — a bigger unit means fewer of them`,
            [`Multiply by ${f} — a bigger unit means more of them`, `Subtract ${f}`]
          )
        : choice(
            {
              prompt: `You're going from ${c.bigs} to ${c.smalls} — a SMALLER unit. What should you do with ${f}?`,
              hint: "A smaller unit means you need MORE of them.",
              explain: `Smaller unit, more of them: multiply by ${f}.`,
            },
            `Multiply by ${f} — a smaller unit means more of them`,
            [`Divide by ${f} — a smaller unit means fewer of them`, `Add ${f}`]
          ),
      {
        kind: "number",
        prompt: `So ${startText} = how many ${targetUnit}?`,
        suffix: dir === "toBig" ? c.bigAb : c.smallAb,
        hint: dir === "toBig" ? `${fmt(v * c.f)} ÷ ${f}` : dir === "mixed" ? `${v} × ${f} = ${fmt(v * c.f)}, then add the extra ${r}.` : `${v} × ${f}`,
        explain:
          dir === "toBig"
            ? `${fmt(v * c.f)} ÷ ${f} = ${v} ${c.bigs}. Bigger unit, smaller number.`
            : dir === "mixed"
              ? `${v} × ${f} = ${fmt(v * c.f)}, and ${fmt(v * c.f)} + ${r} = ${fmt(answer)} ${c.smalls}.`
              : `${v} × ${f} = ${fmt(answer)} ${c.smalls}. Smaller unit, bigger number.`,
        answer,
      },
    ],
    wrapUp: `${startText} = ${fmt(answer)} ${targetUnit}.`,
  };
}

/** "Build the two-column table" — tests the PATTERN (row 1, rows 2 and 3,
 *  then skip ahead to a far row), not one single lookup. */
function tableProblem(): Problem {
  const c = pick(CONVS);
  const n = randInt(5, 12);
  const f = fmt(c.f);
  return {
    title: "Build a conversion table",
    bucket: "table",
    story: (
      <>
        Fill in this table of <QA>{c.bigs}</QA> and <QB>{c.smalls}</QB>.
      </>
    ),
    visual: (done) => (
      <div style={{ display: "grid", gap: 12 }}>
        <UnitBar conv={c} showFact={done >= 1} />
        <ConversionTable
          leftHead={c.bigs}
          rightHead={c.smalls}
          rows={[
            { left: "1", right: done >= 1 ? f : null, highlight: done === 0 },
            { left: "2", right: done >= 2 ? fmt(2 * c.f) : null, highlight: done === 1 },
            { left: "3", right: done >= 2 ? fmt(3 * c.f) : null, highlight: done === 1 },
            { left: String(n), right: done >= 3 ? fmt(n * c.f) : null, highlight: done === 2 },
          ]}
        />
      </div>
    ),
    steps: [
      {
        kind: "number",
        prompt: `Row 1: 1 ${c.big} = how many ${c.smalls}?`,
        suffix: c.smallAb,
        hint: factHint(c),
        explain: `1 ${c.big} = ${f} ${c.smalls}.`,
        answer: c.f,
      },
      {
        kind: "ratio",
        tones: "none",
        frame: ["", "and", ""],
        labels: [`2 ${c.bigAb}`, `3 ${c.bigAb}`],
        prompt: `Rows 2 and 3: how many ${c.smalls} are 2 ${c.bigs}, and 3 ${c.bigs}?`,
        hint: `2 × ${f}, and 3 × ${f}.`,
        explain: `2 × ${f} = ${fmt(2 * c.f)} and 3 × ${f} = ${fmt(3 * c.f)}. Each row goes up by ${f}.`,
        equivalentHint: `Each box is its own row: 2 × ${f}, then 3 × ${f}.`,
        answer: [2 * c.f, 3 * c.f],
      },
      {
        kind: "number",
        prompt: `Skip ahead: ${n} ${c.bigs} = how many ${c.smalls}?`,
        suffix: c.smallAb,
        hint: `You don't need every row in between — just ${n} × ${f}.`,
        explain: `${n} × ${f} = ${fmt(n * c.f)} ${c.smalls}.`,
        answer: n * c.f,
      },
    ],
    wrapUp: `The rule for every row: ${c.smalls} = ${c.bigs} × ${f}.`,
  };
}

function convertMake(targetBucket?: string): Problem {
  const fam = (CONVERT_BUCKETS as string[]).includes(targetBucket ?? "") ? (targetBucket as Family) : pick(CONVERT_BUCKETS);
  return conversionProblem(fam);
}

function Preview() {
  return <UnitBar conv={convById("kg-g")} showFact />;
}

export const convertingUnits: Unit = {
  id: "convertingUnits",
  title: "Comparing & Converting Measurement Units",
  goal: "I can tell how many of a smaller unit fit into a bigger one, and use that to convert measurements of length, mass, capacity, weight, and time.",
  standard: "4.MD.1",
  keyIdea: (
    <>
      <p>
        A bigger unit holds lots of a smaller unit: 1 km = 1,000 m, 1 m = 100 cm, 1 kg = 1,000 g, 1 L = 1,000 mL, 1 lb = 16 oz, 1 hr = 60 min, 1 min = 60 sec.
      </p>
      <p>Going to a SMALLER unit means you need MORE of them, so you multiply: 3 kg = 3 × 1,000 = 3,000 g.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Conversion factors are memorized facts (same call as MM1_RatioLab's
  // Conversion unit): re-show the check every 20 solved problems.
  reintroEverySolved: 20,
  preview: Preview,
  problems: [
    { label: "Convert", make: convertMake, buckets: CONVERT_BUCKETS },
    { label: "Build a table", make: () => tableProblem(), buckets: ["table"] },
  ],
  requiredBuckets: BUCKETS,
  test: convertingUnitsTest,
};
