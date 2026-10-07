import { useState } from "react";
import { FactorRectangle, MultiplesLine } from "../diagrams";
import { gcd, lcm, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { factorsMultiplesTest } from "./FactorsMultiplesTest";

/** A coprime pair [m, n] with m,n in [2,9] — used so g*m and g*n have no
 *  leftover common factor once the shared factor g is divided out. */
function coprimePair(): [number, number] {
  let m: number, n: number;
  do {
    m = randInt(2, 9);
    n = randInt(2, 9);
  } while (gcd(m, n) !== 1 || m === n);
  return [m, n];
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [a, setA] = useState(36);
  const [b, setB] = useState(24);
  const g = gcd(a, b);
  const l = lcm(Math.min(a, 12), Math.min(b, 12));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="controls">
        <Stepper label="First number" value={a} min={4} max={100} onChange={setA} tone="a" />
        <Stepper label="Second number" value={b} min={4} max={100} onChange={setB} tone="b" />
      </div>
      <p>
        GCF({a}, {b}) = <b>{g}</b>
      </p>
      <FactorRectangle rows={g} cols={a / g} label={`${a} = ${g} × ${a / g}`} />
      {a / g !== b / g && <FactorRectangle rows={g} cols={b / g} label={`${b} = ${g} × ${b / g}`} />}
      {a <= 12 && b <= 12 && (
        <>
          <p>
            LCM({a}, {b}) = <b>{l}</b>
          </p>
          <MultiplesLine a={a} b={b} upTo={l} />
        </>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — find the GCF
// ============================================================================

function gcfProblem(): Problem {
  const g = randInt(2, 12);
  const [m, n] = coprimePair();
  const a = g * m;
  const b = g * n;

  return {
    title: "Finding the GCF",
    story: `What is the greatest common factor (GCF) of ${a} and ${b}?`,
    visual: () => <FactorRectangle rows={g} cols={m} label={`${a} = ${g} × ${m}`} />,
    steps: [
      choice(
        { prompt: `Which of these divides evenly into BOTH ${a} and ${b}?`, hint: "Try dividing both numbers by each option.", explain: `${g} divides evenly into both ${a} and ${b}.` },
        String(g),
        [String(g + 1), String(Math.max(2, g - 1))]
      ),
      {
        kind: "number",
        prompt: `What is the greatest common factor of ${a} and ${b}?`,
        hint: "The GCF is the largest number that divides evenly into both.",
        explain: `${a} = ${g} × ${m} and ${b} = ${g} × ${n} — ${g} is the largest shared factor.`,
        answer: g,
      },
      choice(
        { prompt: `After dividing both numbers by ${g}, do the results (${m} and ${n}) share any common factor besides 1?`, hint: "If they did, that factor would've been part of the GCF too.", explain: `${m} and ${n} share no common factor besides 1 — that's how you know ${g} is the GREATEST common factor, not just a common factor.` },
        "No — they share no common factor besides 1",
        ["Yes — they share another common factor"]
      ),
    ],
    wrapUp: `The GCF of ${a} and ${b} is ${g}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — find the LCM
// ============================================================================

function lcmProblem(): Problem {
  let a: number, b: number;
  do {
    a = randInt(2, 12);
    b = randInt(2, 12);
  } while (a === b);
  const L = lcm(a, b);

  return {
    title: "Finding the LCM",
    story: `What is the least common multiple (LCM) of ${a} and ${b}?`,
    visual: () => <MultiplesLine a={a} b={b} upTo={L} />,
    steps: [
      {
        kind: "number",
        prompt: `What is the least common multiple of ${a} and ${b}?`,
        hint: `List multiples of ${a} and multiples of ${b} until you find one they share.`,
        explain: `The smallest number that's a multiple of both ${a} and ${b} is ${L}.`,
        answer: L,
      },
      choice(
        { prompt: `Which of these is ALSO a common multiple of ${a} and ${b} (just not the smallest one)?`, hint: "Every multiple of the LCM is also a common multiple.", explain: `${2 * L} is a multiple of the LCM ${L}, so it's also a common multiple of ${a} and ${b}.` },
        String(2 * L),
        [String(L + 1), String(Math.max(1, L - 1))]
      ),
    ],
    wrapUp: `The LCM of ${a} and ${b} is ${L}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — the distributive rewrite
// ============================================================================

function distributiveProblem(): Problem {
  const g = randInt(2, 12);
  const [m, n] = coprimePair();
  const a = g * m;
  const b = g * n;

  return {
    title: "Rewriting with the distributive property",
    story: `Use the distributive property to express ${a} + ${b} as a common factor times a sum of two numbers with no common factor.`,
    visual: (done: number) => <FactorRectangle rows={g} cols={m + n} splitCols={done >= 2 ? [m, n] : undefined} />,
    steps: [
      {
        kind: "number",
        prompt: `What is the GCF of ${a} and ${b}?`,
        hint: "Find the largest number that divides evenly into both addends.",
        explain: `${a} = ${g} × ${m} and ${b} = ${g} × ${n}, so the GCF is ${g}.`,
        answer: g,
      },
      {
        kind: "ratio",
        tones: "none",
        labels: ["first term", "second term"],
        frame: ["(", "+", ")"],
        prompt: `Divide each addend by the GCF: ${a} ÷ ${g} and ${b} ÷ ${g}.`,
        hint: `${a} ÷ ${g} = ?, and ${b} ÷ ${g} = ?`,
        explain: `${a} ÷ ${g} = ${m}, and ${b} ÷ ${g} = ${n}.`,
        answer: [m, n],
      },
      choice(
        { prompt: `Do ${m} and ${n} share any common factor besides 1?`, hint: "If they did, the GCF you found wouldn't have been the GREATEST common factor.", explain: `${m} and ${n} share no common factor besides 1, confirming ${g} really is the GCF.` },
        "No — they share no common factor besides 1",
        ["Yes — they share another common factor"]
      ),
      choice(
        { prompt: `Which expression correctly rewrites ${a} + ${b}?`, hint: "The GCF goes outside the parentheses, multiplying the sum of the two reduced terms.", explain: `${a} + ${b} = ${g} × (${m} + ${n}).` },
        `${g} × (${m} + ${n})`,
        [`${m} × (${g} + ${n})`, `${g} + (${m} × ${n})`]
      ),
    ],
    wrapUp: `${a} + ${b} = ${g} × (${m} + ${n}).`,
  };
}

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return <FactorRectangle rows={4} cols={7} label="28 = 4 × 7" width={220} height={110} />;
}

export const factorsMultiples: Unit = {
  id: "factorsMultiples",
  title: "Factors, Multiples & the Distributive Property",
  goal: "Find the GCF of two numbers up to 100, the LCM of two numbers up to 12, and use the distributive property to factor a sum.",
  standard: "6.NS.4",
  keyIdea: (
    <>
      <p>The greatest common factor (GCF) of two numbers is the largest number that divides evenly into both.</p>
      <p>The least common multiple (LCM) is the smallest number that's a multiple of both.</p>
      <p>Any sum with a common factor can be rewritten using the distributive property: 36 + 8 = 4 × (9 + 2).</p>
    </>
  ),
  Explore,
  preview: Preview,
  problems: [
    { label: "Find the GCF", make: gcfProblem },
    { label: "Find the LCM", make: lcmProblem },
    { label: "Distributive rewrite", make: distributiveProblem },
  ],
  test: factorsMultiplesTest,
};
