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
import { MathText } from "../../../shared/components/MathText";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";

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

/** Smallest prime factor of g (g >= 2). */
function smallestPrime(g: number): number {
  for (let p = 2; p * p <= g; p++) if (g % p === 0) return p;
  return g;
}

// ============================================================================
// CHECK FOR UNDERSTANDING — fixed questions, gate before Practice unlocks
// ============================================================================

/**
 * Q1 vocabulary, with the commonly confused pair in one question: a common
 * FACTOR (typed) vs a common MULTIPLE (picked). Q2 typed: divide the top and
 * bottom by a common factor. Q3 the trap: dividing by a common factor that
 * isn't the greatest one leaves a fraction that still simplifies (typed).
 * Q4 true/false: simplifying does not change the amount, plus a typed
 * denominator. Every question has a typed box (fill-in rule).
 * Carried forward: Q1 -> Practice "Which divides evenly into both" (the
 * common-multiple distractor) and Test Q9; Q2/Q3 -> the GCF + divide +
 * simplest-form steps and Test Q1/Q4/Q7/Q8/Q10; Q4 -> keyIdea + Test Q3/Q6.
 */
function SimplifyCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>

        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Factors and multiples of 12 and 18.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "6", label: "The missing common factor" },
              { options: ["factor", "multiple"], correct: "multiple", label: "What 36 is" },
            ]}
            render={([a, b]) => (
              <>
                The common factors of 12 and 18 are 1, 2, 3, and {a}. The number 36 is a common {b} of 12 and 18.
              </>
            )}
            good="Yes. 6 divides both 12 and 18 with nothing left over, so 6 is a common factor. 36 = 12 × 3 = 18 × 2, so 36 is a common multiple."
            bad="Not quite. A factor divides into a number with nothing left over. A multiple is what you get when you multiply a number."
            onDone={mark(0)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Simplify <Frac n={6} d={8} />.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "2", label: "Number that divides both 6 and 8" },
              { correct: "3", label: "New numerator" },
              { correct: "4", label: "New denominator" },
            ]}
            render={([a, b, c]) => (
              <>
                You can divide both 6 and 8 by {a}. So <Frac n={6} d={8} /> = <Frac n={b} d={c} />
              </>
            )}
            good="Yes. 6 ÷ 2 = 3 and 8 ÷ 2 = 4, so 6/8 = 3/4."
            bad="Not quite. Find a number bigger than 1 that divides both 6 and 8. Then divide the top and the bottom by it."
            onDone={mark(1)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Leo divides the top and the bottom of <Frac n={12} d={18} /> by 2. He gets <Frac n={6} d={9} />.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["Yes", "No"], correct: "No", label: "Is 6/9 in simplest form" },
              { correct: "3", label: "Number that still divides 6 and 9" },
              { correct: "2", label: "Simplest numerator" },
              { correct: "3", label: "Simplest denominator" },
            ]}
            render={([a, b, c, d]) => (
              <>
                Is <Frac n={6} d={9} /> in simplest form? {a} You can still divide both 6 and 9 by {b}. So <Frac n={12} d={18} /> = <Frac n={c} d={d} /> in
                simplest form.
              </>
            )}
            good="Right. 2 was a common factor, but not the greatest one. The GCF of 12 and 18 is 6. 12 ÷ 6 = 2 and 18 ÷ 6 = 3."
            bad="Not quite. Look for a number bigger than 1 that divides both 6 and 9. If there is one, the fraction is not in simplest form yet."
            onDone={mark(2)}
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>4.</b> True or false: simplifying <Frac n={4} d={12} /> makes it a smaller amount.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "True or false" },
              { correct: "3", label: "Missing denominator" },
            ]}
            render={([a, b]) => (
              <>
                That is {a}. <Frac n={4} d={12} /> = <Frac n={1} d={b} />
              </>
            )}
            good="Right, it is false. 4/12 and 1/3 are the same amount. Dividing the top and bottom by the same number never changes the value."
            bad="Not quite. Simplifying divides the top and the bottom by the same number. Does that change the amount? For the box: 12 ÷ 4 = ?"
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

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [num, setNum] = useState(8);
  const [den, setDen] = useState(12);
  const g = gcd(num, den);
  const [sm, sd] = simplify(num, den);

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          <b>GCF</b> means greatest common factor. It is the biggest number that divides both the numerator and the denominator.
        </p>
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
        {/* Below the picture, so students explore first, then check. */}
        {(introActive || showCheck) && <SimplifyCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — simplify a fraction
// ============================================================================

/**
 * Both cases start the same way ("Simplify n/d, if you can." then "Do they
 * share a common factor besides 1?"), so the story no longer tells which
 * case it is. The two buckets are equally likely, so Yes and No are each
 * right about half the time. (The old "reduces" case also ended with "After
 * dividing, do m and n share a common factor?", which was always "No".)
 */
function simplifyProblem(targetBucket?: string): Problem {
  const wantsSimplest = targetBucket ? targetBucket === "already-simplest" : randInt(1, 2) === 1;
  const g = wantsSimplest ? 1 : randInt(2, 6);
  const [m, n] = properCoprimePair();
  const num = g * m;
  const den = g * n;
  const YES = "Yes — they share another common factor";
  const NO = "No — they share no common factor besides 1";
  const story = (
    <>
      Simplify <Frac n={num} d={den} />, if you can.
    </>
  );

  if (g === 1) {
    return {
      title: "Simplify the fraction",
      story,
      bucket: "already-simplest",
      visual: (done: number) => (done >= 3 ? <SimplifyBeforeAfter num={num} den={den} simpleNum={num} simpleDen={den} /> : <Frac n={num} d={den} />),
      steps: [
        choice(
          {
            prompt: `Do ${num} and ${den} share a common factor besides 1?`,
            hint: `List the factors of ${num} and of ${den}. Is any number besides 1 in both lists?`,
            explain: `${num} and ${den} share no common factor besides 1.`,
          },
          NO,
          [YES]
        ),
        {
          kind: "number",
          prompt: `What is the GCF of ${num} and ${den}?`,
          hint: "The GCF is the biggest number that divides both. You just found that they share no factor besides 1.",
          explain: `The only common factor is 1, so the GCF is 1.`,
          answer: 1,
        },
        {
          kind: "number",
          frac: true,
          fracRequired: true,
          fracAnswer: [num, den],
          prompt: `Write ${num}/${den} in simplest form.`,
          hint: "If the GCF is 1, the fraction is already as simple as it gets.",
          explain: `The GCF is 1, so ${num}/${den} is already in simplest form. There is nothing to divide.`,
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

  // The "divides evenly into both" pick: the right option is a common factor
  // (the smallest prime factor of the GCF — so when the GCF is composite it
  // is NOT the GCF, and the next step can't be answered by copying it). A
  // common MULTIPLE is offered as a wrong "factor" option — the GCF/LCM
  // confusion, one of the most common simplifying mistakes. The other wrong
  // option is guarded to never also divide both numbers.
  const factorPick = smallestPrime(g);
  const commonMultiple = lcm(num, den);
  let wrongFactor = factorPick + 1;
  while (wrongFactor === factorPick || wrongFactor === commonMultiple || (num % wrongFactor === 0 && den % wrongFactor === 0)) {
    wrongFactor = randInt(2, Math.max(4, g * 2));
  }

  return {
    title: "Simplify the fraction",
    story,
    bucket: "reduces",
    visual: (done: number) => (done >= 4 ? <SimplifyBeforeAfter num={num} den={den} simpleNum={m} simpleDen={n} /> : <Frac n={num} d={den} />),
    steps: [
      choice(
        {
          prompt: `Do ${num} and ${den} share a common factor besides 1?`,
          hint: `List the factors of ${num} and of ${den}. Is any number besides 1 in both lists?`,
          explain: `Yes. ${num} and ${den} share a common factor besides 1, so you can simplify this fraction.`,
        },
        YES,
        [NO]
      ),
      choice(
        {
          prompt: `Which of these divides evenly into BOTH ${num} and ${den}?`,
          hint: `A FACTOR divides INTO a number with nothing left over. A MULTIPLE is what you get by multiplying. Try dividing ${num} and ${den} by each option.`,
          explain: `${factorPick} divides evenly into both ${num} and ${den}, with nothing left over. That makes it a common FACTOR. (${commonMultiple} is a common MULTIPLE of ${num} and ${den}, not a factor.)`,
        },
        String(factorPick),
        [String(commonMultiple), String(wrongFactor)]
      ),
      {
        kind: "number",
        prompt: `What is the GCF of ${num} and ${den}?`,
        hint: "The GCF is the BIGGEST number that divides evenly into both. Try numbers bigger than the one you just picked.",
        explain: `${num} = ${g} × ${m} and ${den} = ${g} × ${n}. ${g} is the biggest shared factor.`,
        answer: g,
      },
      {
        kind: "ratio",
        tones: "none",
        labels: ["new numerator", "new denominator"],
        prompt: `Now divide: ${num} ÷ ${g} and ${den} ÷ ${g}. What do you get?`,
        hint: `${num} ÷ ${g} = ?, and ${den} ÷ ${g} = ?`,
        explain: `${num} ÷ ${g} = ${m}, and ${den} ÷ ${g} = ${n}. ${m} and ${n} share no factor besides 1, so ${g} really was the greatest common factor.`,
        answer: [m, n],
      },
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
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["reduces", "already-simplest"],
  problems: [{ label: "Simplify", make: simplifyProblem, buckets: ["reduces", "already-simplest"] }],
  test: simplifyingFractionsTest,
};
