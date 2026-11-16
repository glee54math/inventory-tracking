import { useState } from "react";
import { pointing, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { MathText } from "../../../shared/components/MathText";
import { lookHereSpot } from "../../../shared/lib/lookHere";
import { pick } from "../../../shared/lib/math";
import { DecimalBars, PlaceChart, ThousandthPicture } from "../diagrams";
import {
  COMPARE_BUCKETS,
  compareSymbol,
  comparePair,
  decName,
  decText,
  expandedDec,
  expandedText,
  nameDec,
  shortExpandedText,
  showDec,
  type CompareBucket,
  type Dec,
  type Places,
} from "../lib/decimals";
import { decToNameStep, expandedFillStep, expandedToDecStep, nameToDecStep, signStep, thousandthsStep } from "../lib/steps";
import { readingComparingTest } from "./ReadingComparingDecimalsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const exactly = (want: string) => (raw: string) => raw.trim() === want;
const sameValue = (want: number) => (raw: string) => raw.trim() !== "" && /^\d*\.?\d*$/.test(raw.trim()) && Math.abs(Number(raw) - want) < 1e-9;

/**
 * Q1 vocabulary + typed: name the thousandths place; write a number name with a 0 inside (4.026, not 4.26).
 * Q2 typed: expanded form with the parts mixed up -> decimal (6.305; 8.04 with an empty tenths place).
 * Q3 typed + pick: 0.45 vs 0.5 as thousandths (the "longer looks bigger" trap, named).
 * Q4 true/false generalization: more digits is NOT always bigger; 0.5 = 0.500.
 */
function DecimalsCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Answer both parts.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["tenths", "hundredths", "thousandths"], correct: "thousandths", label: "Place of the 4 in 7.264", part: "a", exploreTarget: { target: "u1-chart", label: "Build a decimal: the place chart" } },
              { correct: "4.026", label: "Four and twenty-six thousandths as a decimal", width: 90, accept: exactly("4.026"), part: "b", exploreTarget: { target: "u1-read", label: "Build a decimal: how to read a decimal" } },
            ]}
            render={([a, b]) => (
              <>
                a. In 7.264, the 4 is in the {a} place.
                <br />
                b. Write "four and twenty-six thousandths" as a decimal: {b}
              </>
            )}
            good="Yes. The third digit after the point is the thousandths place. Twenty-six thousandths needs three digits: 4.026."
            bad={(oks, vals) =>
              !oks[0]
                ? "Count the digits after the point: tenths, hundredths, thousandths."
                : vals[1].trim() === "4.26"
                  ? "4.26 is twenty-six hundredths. Thousandths need three digits after the point."
                  : "Thousandths need three digits after the point. Put a 0 in any empty place."
            }
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> The parts of each number are mixed up. Write each number as a decimal.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "6.305", label: "5 × 1/1000 + 6 + 3 × 1/10 as a decimal", width: 90, accept: sameValue(6.305) },
              { correct: "8.04", label: "4 × 1/100 + 8 as a decimal", width: 90, accept: sameValue(8.04) },
            ]}
            render={([a, b]) => (
              <>
                5 × 1/1000 + 6 + 3 × 1/10 = {a}
                <br />4 × 1/100 + 8 = {b}
              </>
            )}
            good="Right. Each digit goes in its own place: 6.305 has 3 tenths, 0 hundredths and 5 thousandths. 8.04 has 0 tenths and 4 hundredths."
            bad={(_oks, vals) => {
              const a = vals[0].trim();
              const b = vals[1].trim();
              if (a === "5.63" || a === "5.063" || a === "5.36" || a === "6.53" || a === "6.503") return "Don't copy the digits in the order you see them. 1/10 means tenths, 1/100 means hundredths, 1/1000 means thousandths.";
              if (a === "6.35" || b === "8.4") return "One place has nothing in it. Write a 0 in that place, so each digit stays in its own place.";
              return "Find the tenths, the hundredths and the thousandths. If a place has none, write a 0 there.";
            }}
            exploreTarget={{ target: "u1-forms", label: "Build a decimal: expanded form" }}
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Mia says 0.45 is greater than 0.5, because 45 is greater than 5. Write both with three digits after the point.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "450", label: "0.45 in thousandths", width: 70, part: "Thousandths", exploreTarget: { target: "u1-fill", label: "Compare two decimals: the \"Fill empty places with 0\" button" } },
              { correct: "500", label: "0.5 in thousandths", width: 70, part: "Thousandths", exploreTarget: { target: "u1-fill", label: "Compare two decimals: the \"Fill empty places with 0\" button" } },
              { options: ["0.45", "0.5"], correct: "0.5", label: "The greater number", part: "Greater number", exploreTarget: { target: "u1-bars", label: "Compare two decimals: the bars" } },
            ]}
            render={([a, b, c]) => (
              <>
                0.45 is {a} thousandths. 0.5 is {b} thousandths. The greater number is {c}.
              </>
            )}
            good="Yes. 0.45 = 0.450 and 0.5 = 0.500. 500 thousandths is more than 450 thousandths, so 0.5 is greater. Mia is wrong."
            bad={(oks, vals) =>
              vals[0].trim() === "45" || vals[1].trim() === "5"
                ? "Add 0s to the end first, so each number has three digits after the point. Then read those digits."
                : !oks[2]
                  ? "Compare the two numbers of thousandths you wrote."
                  : "Add 0s to the end until there are three digits after the point. Then read them."
            }
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> True or false?
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "More digits after the point is always greater", part: "First sentence", exploreTarget: { target: "u1-bars", label: "Compare two decimals: the bars" } },
              { options: ["True", "False"], correct: "True", label: "0.5 and 0.500 are equal", part: "Second sentence", exploreTarget: { target: "u1-fill", label: "Compare two decimals: the \"Fill empty places with 0\" button" } },
            ]}
            render={([a, b]) => (
              <>
                A decimal with more digits after the point is always greater. {a}
                <br />
                0.5 and 0.500 are equal. {b}
              </>
            )}
            good="Correct. 0.499 has more digits than 0.5, but it is smaller. And 0s at the end don't change a decimal: 0.5 = 0.500."
            bad="Look back at question 3. Which number had more digits? Which one was greater?"
            onDone={mark(3)}
          />
        </div>
      </div>
    </MathText>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

/** Compare presets: each is a trap from the plan (fewer digits bigger, 0.5 vs 0.499, equal). */
const PAIRS: { id: string; a: Dec; b: Dec }[] = [
  { id: "1", a: { t: 450, p: 2 }, b: { t: 500, p: 1 } },
  { id: "2", a: { t: 500, p: 1 }, b: { t: 499, p: 3 } },
  { id: "3", a: { t: 450, p: 2 }, b: { t: 452, p: 3 } },
  { id: "4", a: { t: 3042, p: 3 }, b: { t: 3024, p: 3 } },
  { id: "5", a: { t: 700, p: 1 }, b: { t: 700, p: 3 } },
];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  // Part 1: build a decimal digit by digit.
  // Whole part up to 999 (round 2, C2-04): hundreds, tens and ones steppers.
  const [hu, setHu] = useState(0);
  const [te, setTe] = useState(0);
  const [on, setOn] = useState(3);
  const w = hu * 100 + te * 10 + on;
  const [d1, setD1] = useState(0);
  const [d2, setD2] = useState(4);
  const [d3, setD3] = useState(2);
  const [p, setP] = useState<Places>(3);
  const ds = [d1, d2, d3].map((x, i) => (i < p ? x : 0));
  const t = w * 1000 + ds[0] * 100 + ds[1] * 10 + ds[2];
  // Part 2: compare.
  const [pairId, setPairId] = useState("1");
  const [fill, setFill] = useState(false);
  const pair = PAIRS.find((x) => x.id === pairId)!;
  const pw = Math.floor(pair.a.t / 1000);
  const sym = compareSymbol(pair.a.t, pair.b.t);

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>Tenths and hundredths are the first two places after the point. The next place to the right is the <b>thousandths</b> place. 10 thousandths make 1 hundredth.</p>
        <ThousandthPicture />
        <h3 className="explore-head">Build a decimal</h3>
        <div className="control-row">
          <Stepper label="Hundreds" value={hu} min={0} max={9} onChange={setHu} />
          <Stepper label="Tens" value={te} min={0} max={9} onChange={setTe} />
          <Stepper label="Ones" value={on} min={0} max={9} onChange={setOn} />
          <Stepper label="Tenths" value={d1} min={0} max={9} onChange={setD1} />
          {p >= 2 && <Stepper label="Hundredths" value={d2} min={0} max={9} onChange={setD2} />}
          {p >= 3 && <Stepper label="Thousandths" value={d3} min={0} max={9} onChange={setD3} />}
        </div>
        <Segmented
          label="Digits after the point"
          value={String(p)}
          onChange={(v) => setP(Number(v) as Places)}
          options={[
            { id: "1", label: "1 digit" },
            { id: "2", label: "2 digits" },
            { id: "3", label: "3 digits" },
          ]}
        />
        <div {...lookHereSpot("u1-chart")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <PlaceChart rows={[{ t, p, tone: "a" }]} />
          <p className="muted small" data-look-here-key>
            Count the places after the point: tenths, then hundredths, then thousandths.
          </p>
        </div>
        <div className="dec-forms" {...lookHereSpot("u1-forms")}>
          <p>
            <span className="muted small">Decimal</span> <b className="dec-big">{decText(t, p)}</b>
          </p>
          <p>
            <span className="muted small">Number name</span> <b>{decName(t, p)}</b>
          </p>
          <p data-look-here-key>
            <span className="muted small">Expanded form</span> <b>{expandedText(t, p)}</b>
          </p>
          <p className="muted small">One thousandth is 1/1000. Whole numbers go by place too: 347 = 3 × 100 + 4 × 10 + 7 × 1.</p>
        </div>
        <div {...lookHereSpot("u1-read")}>
        <p className="muted small">To read a decimal:</p>
        <ol className="muted small" style={{ margin: 0 }}>
          <li>Say the whole number.</li>
          <li>Say "and."</li>
          <li>Read the digits after the point as one number.</li>
          <li>Say the place of the last digit.</li>
        </ol>
        <p className="muted small" data-look-here-key>
          A 0 inside still holds its place: 3.042 is three and forty-two thousandths.
        </p>
        </div>

        <h3 className="explore-head">Compare two decimals</h3>
        <p>Which is greater? Pick a pair. Then fill the empty places with 0s.</p>
        <Segmented label="Pair" value={pairId} onChange={setPairId} options={PAIRS.map((x) => ({ id: x.id, label: `${showDec(x.a)} and ${showDec(x.b)}` }))} />
        <div {...lookHereSpot("u1-fill")} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <PlaceChart
          rows={[
            { ...pair.a, tone: "a" },
            { ...pair.b, tone: "b" },
          ]}
          fill={fill}
        />
        <div className="control-row" data-look-here-key>
          <button type="button" className={`btn ghost${fill ? " pressed" : ""}`} onClick={() => setFill((v) => !v)}>
            {fill ? "Hide the 0s" : "Fill empty places with 0"}
          </button>
        </div>
        {fill && (
          <p className="says">
            {showDec(pair.a)} = {decText(pair.a.t, 3)}, which is {pw > 0 ? `${pw} and ` : ""}
            {pair.a.t % 1000} thousandths. {showDec(pair.b)} = {decText(pair.b.t, 3)}, which is {pw > 0 ? `${pw} and ` : ""}
            {pair.b.t % 1000} thousandths. So {showDec(pair.a)} {sym} {showDec(pair.b)}.
          </p>
        )}
        </div>
        <div {...lookHereSpot("u1-bars")} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <DecimalBars
          w={pw}
          rows={[
            { ...pair.a, tone: "a" },
            { ...pair.b, tone: "b" },
          ]}
        />
        <p className="muted small" data-look-here-key>
          The longer bar is the greater number. The number of digits doesn't matter. Line the digits up by place, then compare from the left.
        </p>
        </div>
        {(introActive || showCheck) && <DecimalsCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

export const U1_BUCKETS = ["words", "expanded", ...COMPARE_BUCKETS];

/** Number name -> decimal, then a different decimal -> its name (both directions). */
function wordsProblem(): Problem {
  const a = nameDec();
  let b = nameDec();
  while (b.t === a.t) b = nameDec();
  return {
    title: "Number names",
    bucket: "words",
    story: <>Read and write decimals.</>,
    // The chart only comes in as help (the Test shows none), with the earlier answer once it's done.
    visual: (done, help) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {done >= 1 ? <PlaceChart rows={[{ ...a, tone: "a" }]} /> : pointing(help, 0) ? <PlaceChart rows={[{ t: Math.floor(a.t / 1000) * 1000, p: 0 }]} /> : null}
        {(done >= 2 || pointing(help, 1)) && <PlaceChart rows={[{ ...b, tone: "b" }]} />}
      </div>
    ),
    steps: [nameToDecStep(a), decToNameStep(b)],
    wrapUp: (
      <>
        {showDec(a)} is read "{decName(a.t, a.p)}," and {showDec(b)} is read "{decName(b.t, b.p)}."
      </>
    ),
  };
}

/** Decimal -> expanded form (type the digits), then a short expanded form with a missing place -> decimal. */
function expandedProblem(): Problem {
  const a = expandedDec();
  let b = expandedDec();
  // The reverse direction always has a place with nothing in it (a 0 digit), its hard edge.
  for (let i = 0; i < 50 && (b === a || !/0/.test(decText(b, 3).split(".")[1])); i++) b = expandedDec();
  const bText = shortExpandedText(b);
  return {
    title: "Expanded form",
    bucket: "expanded",
    story: <>Write each place's value.</>,
    visual: (done, help) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(done >= 1 || pointing(help, 0)) && <PlaceChart rows={[{ t: a, p: 3, tone: "a" }]} />}
        {/* Help on step 2: an empty chart to fill in, never the number itself. */}
        {done >= 2 ? <PlaceChart rows={[{ t: b, p: 3, tone: "b" }]} /> : pointing(help, 1) ? <PlaceChart rows={[{ t: Math.floor(b / 1000) * 1000, p: 0 }]} /> : null}
      </div>
    ),
    steps: [expandedFillStep(a), expandedToDecStep(b, bText)],
    wrapUp: (
      <>
        {decText(a, 3)} = {expandedText(a)}. And {bText} = {decText(b, 3)}: the empty place gets a 0.
      </>
    ),
  };
}

function compareProblem(bucket: CompareBucket): Problem {
  const pair = comparePair(bucket);
  const rows = [
    { ...pair.a, tone: "a" as const },
    { ...pair.b, tone: "b" as const },
  ];
  return {
    title: "Compare decimals",
    bucket,
    story: (
      <>
        Compare <b className="qa-text">{showDec(pair.a)}</b> and <b className="qb-text">{showDec(pair.b)}</b>.
      </>
    ),
    // No chart by default (the Test shows none). Step 1 help: the chart lined
    // up with the empty places still empty (the filled 0s would be the typed
    // answer); the 0s fill in on the second wrong try, in Show me, or once
    // step 1 is done (C1-02).
    visual: (done, help) =>
      done >= 1 || pointing(help, 0) || pointing(help, 1) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PlaceChart rows={rows} fill={done >= 1 || (!!help && help.step === 0 && (help.wrong >= 2 || help.showMe))} />
          {(done >= 2 || pointing(help, 1)) && <DecimalBars w={pair.w} rows={rows} />}
        </div>
      ) : null,
    steps: [thousandthsStep(pair), signStep(pair)],
    wrapUp: (
      <>
        {showDec(pair.a)} {compareSymbol(pair.a.t, pair.b.t)} {showDec(pair.b)}. Line the digits up by place, then compare. The number of digits doesn't decide.
      </>
    ),
  };
}

function Preview() {
  return (
    <PlaceChart
      rows={[
        { t: 450, p: 2, tone: "a" },
        { t: 500, p: 1, tone: "b" },
      ]}
      fill
    />
  );
}

export const readingComparingDecimals: Unit = {
  id: "readingComparingDecimals",
  title: "Reading, Writing and Comparing Decimals",
  goal: "Read and write decimals to thousandths as numbers, number names and expanded form. Compare two decimals, even when one has more digits.",
  standard: "5.NBT.3a-b",
  keyIdea: (
    <>
      <p>The third place after the point is the thousandths place. 3.042 is three and forty-two thousandths, or 3 + 0 × 1/10 + 4 × 1/100 + 2 × 1/1000.</p>
      <p>To compare, line the digits up by place. Fill empty places with 0s: 0.5 = 0.500. Then compare from the left.</p>
      <p>Having more digits does not make a decimal greater. 0.45 = 0.450, which is less than 0.500, so 0.45 &lt; 0.5.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: U1_BUCKETS,
  problems: [
    { label: "Number names", make: () => wordsProblem(), buckets: ["words"] },
    { label: "Expanded form", make: () => expandedProblem(), buckets: ["expanded"] },
    { label: "Compare", make: (b) => compareProblem((b as CompareBucket) ?? pick(COMPARE_BUCKETS)), buckets: [...COMPARE_BUCKETS] },
  ],
  test: readingComparingTest,
};
