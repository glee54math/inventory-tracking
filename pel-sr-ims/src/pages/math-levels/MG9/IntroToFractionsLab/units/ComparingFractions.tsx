import { useState } from "react";
import { FractionBar, NumberLine } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Frac, Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingFractionsTest } from "./ComparingFractionsTest";

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

// ============================================================================
// EXPLORE
// ============================================================================

type Frame = "same-denom" | "same-num" | "cross";

function Explore() {
  const [frame, setFrame] = useState<Frame>("same-denom");
  const [{ n1, n2, d }] = useState(sameDenomPair);
  const [{ n, d1, d2 }] = useState(sameNumPair);
  const [cross] = useState(crossPair);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
        </>
      )}
    </div>
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
      <p>Different everything: cross-multiply, or compare each to a benchmark like 1/2.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiredBuckets: ["same-denom", "same-num", "cross"],
  problems: [
    { label: "Same denominator", make: sameDenomProblem, buckets: ["same-denom"] },
    { label: "Same numerator", make: sameNumProblem, buckets: ["same-num"] },
    { label: "Different everything", make: crossProblem, buckets: ["cross"] },
  ],
  test: comparingFractionsTest,
};
