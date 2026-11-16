import { useState } from "react";
import { FractionBar, NumberLine } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, numberBlank, sentence, type Problem } from "../../../shared/engine/types";
import { Frac, Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingFractionsTest } from "./ComparingFractionsTest";
import { MathText } from "../../../shared/components/MathText";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";

function properFraction(maxD = 9): [number, number] {
  const d = randInt(2, maxD);
  const n = randInt(1, d - 1);
  return [n, d];
}

/** Two distinct proper fractions sharing one denominator. */
function sameDenomPair(): { n1: number; n2: number; d: number } {
  const d = randInt(3, 10);
  const n1 = randInt(1, d - 1);
  let n2 = randInt(1, d - 1);
  while (n2 === n1) n2 = randInt(1, d - 1);
  return { n1, n2, d };
}

/** Two distinct proper fractions sharing one numerator. */
function sameNumPair(): { n: number; d1: number; d2: number } {
  const n = randInt(1, 5);
  const d1 = randInt(n + 1, n + 6);
  let d2 = randInt(n + 1, n + 6);
  while (d2 === d1) d2 = randInt(n + 1, n + 6);
  return { n, d1, d2 };
}

/** Two proper fractions with nothing in common — neither denominator nor
 *  value may match, so cross-multiplying is the only way through. */
function crossPair(): { n1: number; d1: number; n2: number; d2: number } {
  const [n1, d1] = properFraction(8);
  let [n2, d2] = properFraction(8);
  while (d1 === d2 || n1 / d1 === n2 / d2) [n2, d2] = properFraction(8);
  return { n1, d1, n2, d2 };
}

const SIGNS = [">", "<", "="];

// ============================================================================
// CHECK FOR UNDERSTANDING — fixed questions, gate before Practice unlocks
// ============================================================================

/**
 * Q1 same denominator: count the extra pieces (typed) and pick the sign.
 * Q2 the classic same-numerator mistake ("8 is bigger than 4, so 1/8 is
 * bigger"), with a typed "how many eighths make one fourth". Q3 benchmark
 * 1/2, with typed halves. Q4 a true/false generalization trap ("the bigger
 * denominator is always smaller") with a typed common-denominator
 * counterexample. Every question has a typed box (fill-in rule).
 * Carried forward: Q1 -> "Same denominator" (typed "how many more"), Test
 * Q1/Q3; Q2 -> "Same numerator", Test Q2/Q4/Q9; Q3 -> Test Q7; Q4 ->
 * "Same numerator" (typed common denominator) and "Different everything".
 */
function ComparingCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  const SIDE = ["less than", "more than"];
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>

        <div className="align-stack-wrap">
          <p>
            <b>1.</b> The bars show <Frac n={3} d={8} /> and <Frac n={5} d={8} />.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <FractionBar numerator={3} denominator={8} width={240} />
            <FractionBar numerator={5} denominator={8} width={240} />
          </div>
          <DropdownQuestion
            blanks={[
              { correct: "2", label: "How many more shaded pieces 5/8 has" },
              { options: SIGNS, correct: ">", label: "Comparison sign" },
            ]}
            render={([a, b]) => (
              <>
                The pieces are the same size. <Frac n={5} d={8} /> has {a} more shaded pieces. So <Frac n={5} d={8} /> {b} <Frac n={3} d={8} />
              </>
            )}
            good="Yes. Same-size pieces, so more pieces is more. 5 − 3 = 2, and 5/8 > 3/8."
            bad="Not quite. Count the shaded pieces in each bar. The bar with more shaded pieces is the bigger fraction."
            onDone={mark(0)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Mia says <Frac n={1} d={8} /> is bigger than <Frac n={1} d={4} />, because 8 is bigger than 4.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <FractionBar numerator={1} denominator={4} width={240} />
            <FractionBar numerator={1} denominator={8} width={240} />
          </div>
          <DropdownQuestion
            blanks={[
              { options: ["Yes", "No"], correct: "No", label: "Is Mia right" },
              { correct: "2", label: "Eighths in one fourth" },
              { options: SIGNS, correct: ">", label: "Comparison sign" },
            ]}
            render={([a, b, c]) => (
              <>
                Is Mia right? {a} It takes {b} eighths to make one fourth. So <Frac n={1} d={4} /> {c} <Frac n={1} d={8} />
              </>
            )}
            good="Right. Cutting a whole into 8 pieces makes smaller pieces than cutting it into 4. 2 eighths fill one fourth, so 1/4 > 1/8."
            bad="Not quite. Look at the bars. Which shaded piece is bigger? How many eighths fit under one fourth?"
            onDone={mark(1)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Compare <Frac n={3} d={8} /> and <Frac n={4} d={6} /> with the benchmark <Frac n={1} d={2} />.
          </p>
          <NumberLine min={0} max={1} points={[{ value: 0.5, label: "1/2", tone: "c" }]} minorTicksPerUnit={2} />
          <DropdownQuestion
            blanks={[
              { correct: "4", label: "Half of 8" },
              { options: SIDE, correct: "less than", label: "3/8 compared to 1/2" },
              { correct: "3", label: "Half of 6" },
              { options: SIDE, correct: "more than", label: "4/6 compared to 1/2" },
            ]}
            render={([a, b, c, d]) => (
              <>
                Half of 8 is {a}, so <Frac n={3} d={8} /> is {b} <Frac n={1} d={2} />. Half of 6 is {c}, so <Frac n={4} d={6} /> is {d}{" "}
                <Frac n={1} d={2} />.
              </>
            )}
            good="Yes. 3/8 is less than half and 4/6 is more than half, so 4/6 is bigger."
            bad="Not quite. Find half of each denominator. Is the numerator less than that half, or more?"
            onDone={mark(2)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>4.</b> True or false: the fraction with the bigger denominator is always the smaller fraction.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "True or false" },
              { correct: "8", label: "2/3 in twelfths" },
              { correct: "9", label: "3/4 in twelfths" },
            ]}
            render={([a, b, c]) => (
              <>
                That is {a}. Check with <Frac n={2} d={3} /> and <Frac n={3} d={4} />. Rename both as twelfths: <Frac n={2} d={3} /> = <Frac n={b} d={12} /> and{" "}
                <Frac n={3} d={4} /> = <Frac n={c} d={12} />
              </>
            )}
            good="Right, it is false. 3/4 has the bigger denominator, but 9/12 > 8/12, so 3/4 is bigger. The rule only works when the numerators are the same. (8 = 2 × 4 and 9 = 3 × 3 are also the cross products.)"
            bad="Not quite. For 2/3, multiply the top and bottom by 4. For 3/4, multiply the top and bottom by 3. Then compare."
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

type Frame = "same-denom" | "same-num" | "cross";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [frame, setFrame] = useState<Frame>("same-denom");
  const [{ n1, n2, d }] = useState(sameDenomPair);
  const [{ n, d1, d2 }] = useState(sameNumPair);
  const [cross] = useState(crossPair);

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          Before comparing two fractions, it helps to know where they sit against a few benchmarks: 0, 1/2, and 1.
        </p>
        <NumberLine min={0} max={1} points={[{ value: 0.5, label: "1/2", tone: "c" }]} minorTicksPerUnit={4} />
        <Segmented label="Comparison" value={frame} onChange={setFrame} options={[
          { id: "same-denom", label: "Same denominator" },
          { id: "same-num", label: "Same numerator" },
          { id: "cross", label: "Different everything" },
        ]} />
        {frame === "same-denom" && (
          <>
            <p>
              Same denominator — same-size pieces. Just compare how many are shaded: <Frac n={n1} d={d} /> vs <Frac n={n2} d={d} />.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <FractionBar numerator={n1} denominator={d} width={160} />
              <FractionBar numerator={n2} denominator={d} width={160} />
            </div>
          </>
        )}
        {frame === "same-num" && (
          <>
            <p>
              Same numerator — the SAME number of pieces shaded, but cutting a whole into more pieces makes each piece smaller. Fewer, bigger pieces
              wins: <Frac n={n} d={d1} /> vs <Frac n={n} d={d2} />.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <FractionBar numerator={n} denominator={d1} width={160} />
              <FractionBar numerator={n} denominator={d2} width={160} />
            </div>
          </>
        )}
        {frame === "cross" && (
          <>
            <p>
              Nothing matches — the number line settles it: whichever point is further right is bigger. A benchmark can help too — is each one closer to
              0, 1/2, or 1?
            </p>
            <NumberLine
              min={0}
              max={1}
              points={[
                { value: cross.n1 / cross.d1, label: `${cross.n1}/${cross.d1}`, tone: "a" },
                { value: cross.n2 / cross.d2, label: `${cross.n2}/${cross.d2}`, tone: "b" },
              ]}
              minorTicksPerUnit={cross.d1 === cross.d2 ? cross.d1 : undefined}
            />
            {/* The common-denominator way, which is also where cross-multiplying
                comes from (the new numerators ARE the cross products). Practice
                asks for this in "Same numerator" and "Different everything". */}
            <p>
              Or give both the same denominator. Multiply each fraction's top and bottom by the other denominator:{" "}
              <Frac n={cross.n1} d={cross.d1} /> = <Frac n={cross.n1 * cross.d2} d={cross.d1 * cross.d2} /> and <Frac n={cross.n2} d={cross.d2} /> ={" "}
              <Frac n={cross.n2 * cross.d1} d={cross.d1 * cross.d2} />. Now the pieces are the same size, so compare the numerators.
            </p>
            <p className="muted small">
              The new numerators, {cross.n1 * cross.d2} and {cross.n2 * cross.d1}, are the cross products: {cross.n1} × {cross.d2} and {cross.n2} × {cross.d1}.
            </p>
          </>
        )}
        {/* Below the picture, so students explore first, then check. */}
        {(introActive || showCheck) && <ComparingCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — same denominator
// ============================================================================

function sameDenomProblem(): Problem {
  const { n1, n2, d } = sameDenomPair();
  const aBigger = n1 > n2;
  const aLabel = `${n1}/${d} is bigger`;
  const bLabel = `${n2}/${d} is bigger`;

  return {
    title: "Comparing fractions — same denominator",
    story: (
      <>
        Which is bigger: <Frac n={n1} d={d} /> or <Frac n={n2} d={d} />?
      </>
    ),
    bucket: "same-denom",
    visual: () => (
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <FractionBar numerator={n1} denominator={d} width={160} />
        <FractionBar numerator={n2} denominator={d} width={160} />
      </div>
    ),
    steps: [
      choice(
        {
          prompt: "When the denominators are the same, which fraction is bigger?",
          hint: "Same-size pieces — just compare how many are shaded.",
          explain: `Both are cut into ${d} equal pieces, so whichever has more shaded is bigger.`,
        },
        aBigger ? aLabel : bLabel,
        [aBigger ? bLabel : aLabel, "They're equal"]
      ),
      {
        kind: "number",
        prompt: `How many more 1/${d} pieces does the bigger fraction have?`,
        hint: `Subtract the numerators: ${Math.max(n1, n2)} − ${Math.min(n1, n2)}.`,
        explain: `${Math.max(n1, n2)} − ${Math.min(n1, n2)} = ${Math.abs(n1 - n2)}.`,
        answer: Math.abs(n1 - n2),
      },
    ],
    wrapUp: (
      <>
        <Frac n={n1} d={d} /> {aBigger ? ">" : "<"} <Frac n={n2} d={d} />.
      </>
    ),
  };
}

// ============================================================================
// PROBLEM TYPE 2 — same numerator
// ============================================================================

function sameNumProblem(): Problem {
  const { n, d1, d2 } = sameNumPair();
  const aBigger = d1 < d2;
  const aLabel = `${n}/${d1} is bigger`;
  const bLabel = `${n}/${d2} is bigger`;
  const fewer = Math.min(d1, d2);
  const more = Math.max(d1, d2);
  const D = d1 * d2;

  return {
    title: "Comparing fractions — same numerator",
    story: (
      <>
        Which is bigger: <Frac n={n} d={d1} /> or <Frac n={n} d={d2} />?
      </>
    ),
    bucket: "same-num",
    visual: () => (
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <FractionBar numerator={n} denominator={d1} width={160} />
        <FractionBar numerator={n} denominator={d2} width={160} />
      </div>
    ),
    steps: [
      choice(
        {
          prompt: "When the numerators are the same, which fraction is bigger — the one cut into more pieces, or fewer pieces?",
          hint: "Cutting a whole into more pieces makes each piece smaller.",
          explain: `Both have ${n} pieces shaded, but cutting into only ${fewer} pieces (instead of ${more}) makes each piece bigger — fewer, bigger pieces wins.`,
        },
        aBigger ? aLabel : bLabel,
        [aBigger ? bLabel : aLabel, "They're equal"]
      ),
      // Typed check of the same comparison with a common denominator (the
      // CFU Q4 method), so a clean solve needs more than a 1-in-3 pick.
      sentence(
        {
          prompt: `Check it: give both fractions the same denominator, ${D}.`,
          hint: `Multiply the top and bottom of ${n}/${d1} by ${d2}. Multiply the top and bottom of ${n}/${d2} by ${d1}.`,
          explain: `${n} × ${d2} = ${n * d2} and ${n} × ${d1} = ${n * d1}. ${Math.max(n * d1, n * d2)} > ${Math.min(n * d1, n * d2)}, so ${n}/${fewer} is bigger.`,
        },
        `${n}/${d1} = `,
        numberBlank(n * d2),
        ` and ${n}/${d2} = `,
        numberBlank(n * d1),
        "",
        [D, D]
      ),
    ],
    wrapUp: (
      <>
        <Frac n={n} d={d1} /> {aBigger ? ">" : "<"} <Frac n={n} d={d2} />.
      </>
    ),
  };
}

// ============================================================================
// PROBLEM TYPE 3 — different everything (cross-multiply)
// ============================================================================

function crossProblem(): Problem {
  const { n1, d1, n2, d2 } = crossPair();
  const productA = n1 * d2;
  const productB = n2 * d1;
  const aBigger = productA > productB;
  const aLabel = `${n1}/${d1} is bigger`;
  const bLabel = `${n2}/${d2} is bigger`;

  return {
    title: "Comparing fractions — different denominators",
    story: (
      <>
        Which is bigger: <Frac n={n1} d={d1} /> or <Frac n={n2} d={d2} />?
      </>
    ),
    bucket: "cross",
    visual: (done: number) =>
      done >= 2 ? (
        <NumberLine
          min={0}
          max={1}
          points={[
            { value: n1 / d1, label: `${n1}/${d1}`, tone: "a" },
            { value: n2 / d2, label: `${n2}/${d2}`, tone: "b" },
          ]}
        />
      ) : (
        <NumberLine min={0} max={1} points={[]} />
      ),
    steps: [
      {
        kind: "ratio",
        tones: "none",
        labels: [`${n1} × ${d2}`, `${n2} × ${d1}`],
        prompt: `Cross-multiply the diagonals: what is ${n1} × ${d2}, and what is ${n2} × ${d1}?`,
        hint: "Multiply straight across each diagonal pair.",
        explain: `${n1} × ${d2} = ${productA}, and ${n2} × ${d1} = ${productB}.`,
        answer: [productA, productB],
      },
      choice(
        {
          prompt: "Which fraction is bigger?",
          hint: "The fraction paired with the BIGGER cross product is the bigger fraction.",
          explain: `${aBigger ? productA : productB} > ${aBigger ? productB : productA}, so ${aBigger ? `${n1}/${d1}` : `${n2}/${d2}`} is bigger.`,
        },
        aBigger ? aLabel : bLabel,
        [aBigger ? bLabel : aLabel, "They're equal"]
      ),
    ],
    wrapUp: (
      <>
        <Frac n={n1} d={d1} /> {aBigger ? ">" : "<"} <Frac n={n2} d={d2} />.
      </>
    ),
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <FractionBar numerator={2} denominator={3} width={140} />
      <FractionBar numerator={3} denominator={4} width={140} />
    </div>
  );
}

export const comparingFractions: Unit = {
  id: "comparingFractions",
  title: "Comparing Fractions",
  goal: "Compare two fractions using same denominators, same numerators, benchmarks, and cross-multiplying.",
  standard: "4.NF.2",
  keyIdea: (
    <>
      <p>Same denominator: compare the numerators directly — more shaded pieces is bigger.</p>
      <p>Same numerator: fewer, bigger pieces wins — more pieces in a whole means each piece is smaller.</p>
      <p>Different everything: rename both with the same denominator (cross-multiplying is the shortcut), or compare each to a benchmark like 1/2.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["same-denom", "same-num", "cross"],
  problems: [
    { label: "Same denominator", make: sameDenomProblem, buckets: ["same-denom"] },
    { label: "Same numerator", make: sameNumProblem, buckets: ["same-num"] },
    { label: "Different everything", make: crossProblem, buckets: ["cross"] },
  ],
  test: comparingFractionsTest,
};
