import { useState } from "react";
import { FractionBar, PieceBars, type PieceSegment } from "../diagrams";
import { choice, numberBlank, sentence, type Problem } from "../../../shared/engine/types";
import { Frac, Stepper } from "../../../shared/engine/controls";
import { pick } from "../../../shared/lib/math";
import type { Unit } from "../../../shared/units/types";
import { mixedText, nonUnitTimesParams, unitTimesParams, wholeProductParams, wordTimesParams } from "../lib/fractions";
import { amountStep } from "../lib/steps";
import { fillName, NAMES, TIMES_CONTEXTS, unitFor } from "../lib/words";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "./cfu";
import { multiplyFractionByWholeTest } from "./MultiplyFractionByWholeTest";

/** One colored run per copy, alternating colors, so the n copies stay visible
 *  inside the combined bars. */
const copiesSegments = (n: number, a: number): PieceSegment[] => Array.from({ length: n }, (_, i) => ({ count: a, tone: i % 2 === 0 ? "a" : "b" }));

function Copies({ n, a, d, width = 110 }: { n: number; a: number; d: number; width?: number }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Array.from({ length: n }, (_, i) => (
        <FractionBar key={i} numerator={a} denominator={d} width={width} height={34} />
      ))}
    </div>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 vocabulary: a/b is a copies of 1/b (4.NF.4a). Q2 the plan's own
 * connection question — 3 × 2/5 is 6 × 1/5 — with the multiply-the-
 * denominator answer (6/15) as bait. Q3 the generalization trap: "the
 * answer is always a fraction" (4 × 3/4 = 3). Q4 setting up a story.
 */
function MultiplyCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
      <div className="align-stack-wrap">
        <p>
          <b>1.</b> Here is <Frac n={2} d={5} />:
        </p>
        <PieceBars den={5} segments={[{ count: 2, tone: "a" }]} cuts={[1]} unitLabels barWidth={220} />
        <DropdownQuestion
          blanks={[
            { options: ["2", "5", "7"], correct: "2", label: "How many copies" },
            { options: ["1/2", "1/5", "2/5"], correct: "1/5", label: "Of which unit fraction" },
          ]}
          render={([a, b]) => (
            <>
              <Frac n={2} d={5} /> = {a} × {b}
            </>
          )}
          good="Correct — 2/5 is 2 copies of the unit fraction 1/5: 2/5 = 2 × 1/5."
          bad="Not quite. The pieces are fifths — what's one piece called, and how many of them are shaded?"
          onDone={mark(0)}
        />
      </div>
      <div className="align-stack-wrap">
        <p>
          <b>2.</b> Here is 3 × <Frac n={2} d={5} /> — three copies of <Frac n={2} d={5} />:
        </p>
        <Copies n={3} a={2} d={5} />
        <DropdownQuestion
          blanks={[
            { options: ["3", "5", "6"], correct: "6", label: "How many fifths" },
            { options: ["6/15", "6/5", "5/6"], correct: "6/5", label: "The product" },
          ]}
          render={([a, b]) => (
            <>
              3 × <Frac n={2} d={5} /> is the same as {a} × <Frac n={1} d={5} />, which is {b}.
            </>
          )}
          good="Correct — 3 copies of 2 fifths is 6 fifths: 3 × 2/5 = 6 × 1/5 = 6/5. The pieces are still fifths, so it isn't 6/15."
          bad="Not quite. Count every shaded piece across all three bars. Did the pieces get smaller (fifteenths), or are they still fifths?"
          onDone={mark(1)}
        />
      </div>
      <div className="align-stack-wrap">
        <p>
          <b>3.</b> True or false: when you multiply a fraction by a whole number, the answer is always still a fraction — never a whole number.
        </p>
        <DropdownQuestion
          blanks={[{ options: ["True", "False"], correct: "False", label: "True or false" }]}
          render={([a]) => <>That statement is {a}.</>}
          good="Correct — false! 4 × 3/4 = 12/4 = 3 exactly. When the pieces fill whole bars with none left over, the product is a whole number."
          bad="Not quite — try 4 × 3/4: that's 12 fourths. How many whole bars do 12 fourths fill?"
          onDone={mark(2)}
        />
      </div>
      <div className="align-stack-wrap">
        <p>
          <b>4.</b> "Each lap is <Frac n={3} d={4} /> mile. Kim runs 5 laps. How far does she run?"
        </p>
        <DropdownQuestion
          blanks={[{ options: ["5 + 3/4", "5 × 3/4", "5 × 4/3"], correct: "5 × 3/4", label: "Expression" }]}
          render={([a]) => <>The expression that solves it is {a}.</>}
          good="Correct — 5 equal laps of 3/4 mile: 5 × 3/4 = 15/4 = 3 3/4 miles."
          bad="Not quite — the same distance happens 5 times. Which operation means 'the same amount, 5 times'?"
          onDone={mark(3)}
        />
      </div>
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [n, setN] = useState(3);
  const [a, setA] = useState(2);
  const [d, setD] = useState(5);
  const aa = Math.min(a, d);
  const p = n * aa;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
      {(introActive || showCheck) && <MultiplyCheck onComplete={onIntroDone} />}
      <p>
        <Frac n={aa} d={d} /> is {aa} copies of <Frac n={1} d={d} />. So {n} × <Frac n={aa} d={d} /> is {n} copies of that — {n} × {aa} = {p} copies of{" "}
        <Frac n={1} d={d} />.
      </p>
      <div className="control-row">
        <Stepper label="How many copies" value={n} min={1} max={10} onChange={setN} tone="c" />
        <Stepper label="Numerator" value={aa} min={1} max={d} onChange={setA} tone="a" />
        <Stepper label="Denominator" value={d} min={2} max={10} onChange={setD} tone="b" />
      </div>
      <p className="muted small" style={{ marginBottom: -8 }}>
        {n} separate copies:
      </p>
      <Copies n={n} a={aa} d={d} width={100} />
      <p className="muted small" style={{ marginBottom: -8 }}>
        The same pieces, packed into whole bars (colors show each copy):
      </p>
      <PieceBars den={d} segments={copiesSegments(n, aa)} barWidth={180} />
      <p className="says" style={{ fontSize: 18 }}>
        {n} × <Frac n={aa} d={d} /> = {p} × <Frac n={1} d={d} /> = <Frac n={p} d={d} />
        {p >= d && <> = {mixedText(p, d)}</>}
        {p >= d && p % d === 0 && <span className="muted small"> — a whole number!</span>}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

function unitTimesProblem(): Problem {
  const { n, d } = unitTimesParams();
  return {
    title: "Copies of a unit fraction",
    bucket: "unitTimes",
    story: (
      <>
        Find {n} × <Frac n={1} d={d} />.
      </>
    ),
    visual: (done) => <PieceBars den={d} segments={done >= 1 ? copiesSegments(n, 1) : []} minWholes={Math.ceil(n / d)} unitLabels={done >= 1} barWidth={200} />,
    steps: [
      {
        kind: "number",
        prompt: (
          <>
            {n} × <Frac n={1} d={d} /> means adding <Frac n={1} d={d} /> how many times?
          </>
        ),
        hint: "The whole number counts the copies.",
        explain: `${n} times: ${Array.from({ length: Math.min(n, 4) }, () => `1/${d}`).join(" + ")}${n > 4 ? " + …" : ""}.`,
        answer: n,
      },
      { kind: "number", suffix: `/${d}`, prompt: `So ${n} × 1/${d} = ?`, hint: `${n} pieces of 1/${d}.`, explain: `${n}/${d}.`, answer: n },
      n > d
        ? sentence(
            { prompt: `Write ${n}/${d} as a mixed number.`, hint: `${d} pieces fill one whole.`, explain: `${n}/${d} = ${mixedText(n, d)}.` },
            `${n}/${d} = `,
            numberBlank(Math.floor(n / d)),
            " ",
            numberBlank(n % d),
            `/${d}`
          )
        : { kind: "number", prompt: `How many more 1/${d} pieces would make one whole?`, hint: `One whole is ${d}/${d}.`, explain: `${d} − ${n} = ${d - n}.`, answer: d - n },
    ],
    wrapUp: (
      <>
        {n} × <Frac n={1} d={d} /> = <Frac n={n} d={d} />
        {n > d && <> = {mixedText(n, d)}</>}.
      </>
    ),
  };
}

function nonUnitTimesProblem(): Problem {
  const { n, a, d } = nonUnitTimesParams();
  const p = n * a;
  return {
    title: "Whole number × fraction",
    bucket: "nonUnitTimes",
    story: (
      <>
        Find {n} × <Frac n={a} d={d} />.
      </>
    ),
    visual: (done) => (done >= 1 ? <PieceBars den={d} segments={copiesSegments(n, a)} barWidth={180} /> : <Copies n={n} a={a} d={d} />),
    steps: [
      {
        kind: "number",
        prompt: (
          <>
            <Frac n={a} d={d} /> is {a} copies of <Frac n={1} d={d} />. So {n} × <Frac n={a} d={d} /> is how many copies of <Frac n={1} d={d} />?
          </>
        ),
        hint: `${n} groups of ${a} pieces.`,
        explain: `${n} × ${a} = ${p}, so ${n} × ${a}/${d} = ${p} × 1/${d} = ${p}/${d}.`,
        answer: p,
      },
      choice(
        {
          prompt: (
            <>
              Pat says {n} × <Frac n={a} d={d} /> = <Frac n={p} d={n * d} />. What did Pat do wrong?
            </>
          ),
          hint: "What happens to the size of the pieces if you change the denominator?",
          explain: `Pat multiplied the denominator too — that makes the pieces smaller, and ${p}/${n * d} is just ${a}/${d} again. You only have MORE copies of the same-size pieces.`,
        },
        "Pat multiplied the denominator too — the pieces don't get smaller",
        ["Pat should have added the numerator and the whole number", "Nothing — Pat is right"]
      ),
      amountStep({ prompt: `Write ${p}/${d} as a mixed number.`, hint: `How many groups of ${d} fit in ${p}?`, explain: `${p}/${d} = ${mixedText(p, d)}.` }, p, d),
    ],
    wrapUp: (
      <>
        {n} × <Frac n={a} d={d} /> = <Frac n={p} d={d} /> = {mixedText(p, d)}.
      </>
    ),
  };
}

function wordSetupProblem(): Problem {
  const { n, a, d } = wordTimesParams();
  const c = pick(TIMES_CONTEXTS);
  const name = pick(NAMES);
  const p = n * a;
  return {
    title: "Multiplication story",
    bucket: "wordSetup",
    story: `${fillName(c.each, name)} ${a}/${d} ${c.one}. ${fillName(c.story, name, n)} ${fillName(c.question, name)}`,
    visual: (done) => (done >= 1 ? <Copies n={n} a={a} d={d} width={90} /> : <FractionBar numerator={a} denominator={d} width={140} height={34} />),
    steps: [
      choice(
        { prompt: "Which expression solves the story?", hint: `The same ${a}/${d} happens ${n} times.`, explain: `${n} equal amounts of ${a}/${d}: ${n} × ${a}/${d}.` },
        `${n} × ${a}/${d}`,
        [
          `${n} + ${a}/${d}`, // added instead of multiplying
          `${n} × ${d}/${a}`, // flipped the fraction
        ]
      ),
      amountStep({ prompt: "Solve it.", hint: `${n} × ${a} = ${p} pieces of 1/${d}.`, explain: `${n} × ${a}/${d} = ${p}/${d} = ${mixedText(p, d)}.` }, p, d, unitFor(p, d, c)),
    ],
    wrapUp: `${n} × ${a}/${d} = ${mixedText(p, d)} ${unitFor(p, d, c)}.`,
  };
}

function wholeProductProblem(): Problem {
  const { n, a, d } = wholeProductParams();
  const p = n * a;
  return {
    title: "A product that's a whole number",
    bucket: "wholeProduct",
    story: (
      <>
        Find {n} × <Frac n={a} d={d} />.
      </>
    ),
    visual: (done) => (done >= 1 ? <PieceBars den={d} segments={copiesSegments(n, a)} barWidth={180} /> : <Copies n={n} a={a} d={d} width={90} />),
    steps: [
      { kind: "number", suffix: `/${d}`, prompt: `${n} × ${a}/${d} = ?`, hint: `${n} × ${a} = ?`, explain: `${p}/${d}.`, answer: p },
      { kind: "number", prompt: `${p}/${d} fills how many whole bars exactly?`, hint: `${d} pieces fill one bar.`, explain: `${p} ÷ ${d} = ${p / d}, with nothing left over.`, answer: p / d },
      choice(
        { prompt: "True or false: multiplying a fraction by a whole number always gives a fraction, never a whole number.", hint: "Look at what you just found.", explain: `False — ${n} × ${a}/${d} = ${p / d}.` },
        "False",
        ["True"]
      ),
    ],
    wrapUp: (
      <>
        {n} × <Frac n={a} d={d} /> = <Frac n={p} d={d} /> = {p / d}.
      </>
    ),
  };
}

function Preview() {
  return <PieceBars den={5} segments={copiesSegments(3, 2)} barWidth={110} height={36} />;
}

const BUCKETS = ["unitTimes", "nonUnitTimes", "wordSetup", "wholeProduct"];

export const multiplyFractionByWhole: Unit = {
  id: "multiplyFractionByWhole",
  title: "Multiplying a Fraction by a Whole Number",
  goal: "See a/b as a copies of 1/b, and multiply a fraction by a whole number — in number problems and stories.",
  standard: "4.NF.4a-c",
  keyIdea: (
    <>
      <p>
        <Frac n={2} d={5} /> = 2 × <Frac n={1} d={5} />. So 3 × <Frac n={2} d={5} /> = 6 × <Frac n={1} d={5} /> = <Frac n={6} d={5} /> = 1 <Frac n={1} d={5} />.
      </p>
      <p>Multiply the numerator by the whole number; the denominator (piece size) stays the same. Sometimes the answer is a whole number: 4 × 3/4 = 3.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: BUCKETS,
  problems: [
    { label: "n × 1/b", make: unitTimesProblem, buckets: ["unitTimes"] },
    { label: "n × a/b", make: nonUnitTimesProblem, buckets: ["nonUnitTimes"] },
    { label: "Stories", make: wordSetupProblem, buckets: ["wordSetup"] },
    { label: "Whole-number answers", make: wholeProductProblem, buckets: ["wholeProduct"] },
  ],
  test: multiplyFractionByWholeTest,
};
