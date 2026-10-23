import { useState } from "react";
import { SimplifyBeforeAfter } from "../diagrams";
// Promoted to shared/diagrams/ (2026-10-23) once a third real consumer
// showed up (MM1/ExponentsAndExpressionsLab) — now imported from there
// instead of reaching across into MG11/MultDivFractionLab/diagrams/.
import { FactorRectangle } from "../../../shared/diagrams";
import { gcd, lcm, randInt, simplify } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Frac, Quotient, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { simplifyingFractionsTest } from "./SimplifyingFractionsTest";

/** A coprime pair [m, n], m < n, both in [1, 9] — a proper fraction already
 *  in lowest terms, which g*m / g*n then scales up by a chosen GCF. */
function properCoprimePair(): [number, number] {
  let m: number, n: number;
  do {
    n = randInt(3, 9);
    m = randInt(1, n - 1);
  } while (gcd(m, n) !== 1);
  return [m, n];
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [num, setNum] = useState(8);
  const [den, setDen] = useState(12);
  const g = gcd(num, den);
  const [sm, sd] = simplify(num, den);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="controls">
        <Stepper label="Numerator" value={num} min={1} max={48} onChange={setNum} tone="a" />
        <Stepper label="Denominator" value={den} min={2} max={48} onChange={setDen} tone="b" />
      </div>
      <p>
        GCF({num}, {den}) = <b>{g}</b>
      </p>
      <SimplifyBeforeAfter num={num} den={den} simpleNum={sm} simpleDen={sd} />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <FactorRectangle rows={g} cols={num / g} label={`numerator: ${num} = ${g} × ${num / g}`} />
        <FactorRectangle rows={g} cols={den / g} label={`denominator: ${den} = ${g} × ${den / g}`} />
      </div>
      <p className="muted small">
        The same {g} rows show up in both rectangles — that's exactly why {g} divides evenly into both numbers, and why dividing both by {g} shrinks
        the fraction to {sm}/{sd} without changing its value.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — simplify a fraction
// ============================================================================

/**
 * Generates both the "it reduces" and "it's already simplest" cases, biased
 * toward the first since that's the main skill — but the second case shows
 * up regularly (and can be targeted directly via targetBucket) so the
 * determination question genuinely has two possible answers, not "yes"
 * every time.
 */
function simplifyProblem(targetBucket?: string): Problem {
  const wantsSimplest = targetBucket ? targetBucket === "already-simplest" : randInt(1, 10) <= 3;
  const g = wantsSimplest ? 1 : randInt(2, 6);
  const [m, n] = properCoprimePair();
  const num = g * m;
  const den = g * n;

  if (g === 1) {
    return {
      title: "Already simplified?",
      story: (
        <>
          Simplify <Frac n={num} d={den} /> if possible.
        </>
      ),
      bucket: "already-simplest",
      visual: (done: number) => (done >= 2 ? <SimplifyBeforeAfter num={num} den={den} simpleNum={num} simpleDen={den} /> : <Frac n={num} d={den} />),
      steps: [
        choice(
          {
            prompt: `Do ${num} and ${den} share a common factor besides 1?`,
            hint: `List a few factors of ${num} and of ${den} — do any (besides 1) show up in both lists?`,
            explain: `${num} and ${den} share no common factor besides 1.`,
          },
          "No — they share no common factor besides 1",
          ["Yes — they share another common factor"]
        ),
        {
          kind: "number",
          frac: true,
          fracRequired: true,
          fracAnswer: [num, den],
          prompt: `Write ${num}/${den} in simplest form.`,
          hint: "If there's no common factor besides 1, the fraction is already as simple as it gets.",
          explain: `${num} and ${den} have no common factor besides 1, so ${num}/${den} is already in simplest form — there's nothing to divide.`,
          answer: num / den,
        },
      ],
      wrapUp: (
        <>
          <Frac n={num} d={den} /> is already in simplest form.
        </>
      ),
    };
  }

  // A common MULTIPLE of num/den, deliberately offered as a wrong "factor"
  // option — this is the GCF/LCM confusion documented as one of the most
  // common simplifying mistakes, targeted directly rather than left to a
  // generic wrong number. A second distractor is guarded to never
  // accidentally also be a valid common factor (or collide with g or the
  // multiple itself), so exactly one option is ever defensibly correct.
  const commonMultiple = lcm(num, den);
  let wrongFactor = g + 1;
  while (wrongFactor === g || wrongFactor === commonMultiple || (num % wrongFactor === 0 && den % wrongFactor === 0)) {
    wrongFactor = randInt(2, Math.max(4, g * 2));
  }

  return {
    title: "Simplify the fraction",
    story: (
      <>
        Simplify <Frac n={num} d={den} />.
      </>
    ),
    bucket: "reduces",
    visual: (done: number) => (done >= 3 ? <SimplifyBeforeAfter num={num} den={den} simpleNum={m} simpleDen={n} /> : <Frac n={num} d={den} />),
    steps: [
      choice(
        {
          prompt: `Which of these divides evenly into BOTH ${num} and ${den}?`,
          hint: `A FACTOR divides INTO a number with nothing left over; a MULTIPLE is what you'd get by multiplying a number UP. Try dividing ${num} and ${den} by each option and see what has no remainder.`,
          explain: `${g} divides evenly into both ${num} and ${den}, with nothing left over — that's what makes it a common FACTOR. (${commonMultiple} is a common MULTIPLE of ${num} and ${den}, not a factor — you'd reach it by multiplying up, not dividing down.)`,
        },
        String(g),
        [String(commonMultiple), String(wrongFactor)]
      ),
      {
        kind: "number",
        prompt: `What is the GCF of ${num} and ${den}?`,
        hint: "The GCF is the LARGEST number that divides evenly into both.",
        explain: `${num} = ${g} × ${m} and ${den} = ${g} × ${n} — ${g} is the largest shared factor.`,
        answer: g,
      },
      {
        kind: "ratio",
        tones: "none",
        labels: ["new numerator", "new denominator"],
        prompt: `Now actually divide: ${num} ÷ ${g} and ${den} ÷ ${g}. What do you get?`,
        hint: `${num} ÷ ${g} = ?, and ${den} ÷ ${g} = ?`,
        explain: `${num} ÷ ${g} = ${m}, and ${den} ÷ ${g} = ${n}.`,
        answer: [m, n],
      },
      choice(
        {
          prompt: `After dividing, do ${m} and ${n} share a common factor besides 1?`,
          hint: "If they did, that factor would've been part of the GCF too.",
          explain: `${m} and ${n} share no common factor besides 1 — that's how you know ${g} really was the GREATEST common factor, not just a common factor.`,
        },
        "No — they share no common factor besides 1",
        ["Yes — they share another common factor"]
      ),
      {
        kind: "number",
        frac: true,
        fracRequired: true,
        fracAnswer: [m, n],
        prompt: `Write ${num}/${den} in simplest form.`,
        hint: "Use the numerator and denominator you just divided.",
        explain: (
          <>
            <Frac n={num} d={den} /> ÷ {g} on top and bottom = <Quotient n={m} d={n} />.
          </>
        ),
        answer: m / n,
      },
    ],
    wrapUp: (
      <>
        <Frac n={num} d={den} /> simplifies to <Frac n={m} d={n} />.
      </>
    ),
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <SimplifyBeforeAfter num={6} den={8} simpleNum={3} simpleDen={4} width={220} topHeight={40} />;
}

export const simplifyingFractions: Unit = {
  id: "simplifyingFractions",
  title: "Simplifying Fractions",
  goal: "Find the GCF of a numerator and denominator, divide both by it, and recognize when a fraction is already in simplest form.",
  standard: "4.NF.1",
  keyIdea: (
    <>
      <p>A fraction is in simplest form when its numerator and denominator share no common factor besides 1.</p>
      <p>To simplify: find the GCF of the numerator and denominator, then actually divide both by it — finding the GCF alone isn't the whole job.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiredBuckets: ["reduces", "already-simplest"],
  problems: [{ label: "Simplify", make: simplifyProblem, buckets: ["reduces", "already-simplest"] }],
  test: simplifyingFractionsTest,
};
