import { useEffect, useState } from "react";
import { FractionBar, PartsCircle, UnequalPartsBar } from "../diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { whatAFractionIsTest } from "./WhatAFractionIsTest";

/** The only denominators this whole lab ever uses — 3.NF's own narrower set,
 *  and the hard scope line against MG9_IntroToFractionsLab (which ranges up
 *  to 9+ and handles improper/mixed forms this lab never touches). Every
 *  generator in every unit of FractionsFoundationsLab draws from this same
 *  array, or a filtered slice of it. */
export const DENOMS = [2, 3, 4, 6, 8] as const;

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * Three fixed (non-randomized) questions every student sees identically —
 * same convention as MM1_NegativeNumbersLab's PositiveNegativePreCheck:
 * Q1 is the vocabulary question (what the top/bottom numbers each mean),
 * built as ONE two-part dropdown sentence rather than two separate
 * single-pick questions, per the build brief's preference. Q2 is the
 * commonly-conflated-concept question for THIS unit specifically: a picture
 * with unequal-size parts, some shaded, where "the shaded count matches"
 * is a trap — equal-size parts is the actual rule. Q3 is the
 * generalization/true-false trap: "shading some parts" alone isn't enough
 * to call a picture a fraction.
 */
function WhatIsAFractionCheck({ onComplete }: { onComplete?: () => void }) {
  const [bottomGuess, setBottomGuess] = useState("");
  const [topGuess, setTopGuess] = useState("");
  const [q1Checked, setQ1Checked] = useState(false);
  const q1Done = q1Checked && bottomGuess === "parts" && topGuess === "shaded";

  const [q2, setQ2] = useState<string | null>(null);
  const q2Done = q2 === "no";

  const [q3, setQ3] = useState<string | null>(null);
  const q3Done = q3 === "false";

  const allDone = q1Done && q2Done && q3Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure "fraction" makes sense before you try practice problems.</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> Look at this picture of <FractionBar numerator={3} denominator={4} width={180} />
        </p>
        <p>
          In the fraction 3/4, the bottom number (4) tells you{" "}
          <select className="answer" value={bottomGuess} onChange={(e) => setBottomGuess(e.target.value)} aria-label="What the bottom number means" disabled={q1Done}>
            <option value="" disabled>
              choose
            </option>
            <option value="parts">how many equal parts the whole is split into</option>
            <option value="shaded">how many parts are shaded</option>
            <option value="biggest">the biggest number you're allowed to shade</option>
          </select>
          , and the top number (3) tells you{" "}
          <select className="answer" value={topGuess} onChange={(e) => setTopGuess(e.target.value)} aria-label="What the top number means" disabled={q1Done}>
            <option value="" disabled>
              choose
            </option>
            <option value="shaded">how many of those equal parts are shaded</option>
            <option value="parts">how many equal parts the whole is split into</option>
            <option value="wholes">how many whole pizzas there are</option>
          </select>
          .
          <button className="btn primary" type="button" style={{ marginLeft: 10 }} disabled={q1Done} onClick={() => setQ1Checked(true)}>
            Check Answer
          </button>
        </p>
        {q1Checked && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done
              ? "Correct — the bottom number (denominator) is how many equal parts the whole is split into; the top number (numerator) is how many of those parts are shaded."
              : "Not quite — the bottom number is about the SPLITTING of the whole; the top number is about how many of those parts are SHADED. Try again."}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> This whole is split into 4 parts, and 1 is shaded:
        </p>
        <UnequalPartsBar segments={[1, 2.6, 0.6, 1.4]} shadedIndices={[0]} label="1 of 4 parts shaded — but are the parts equal?" />
        <p>Does this picture correctly show 1/4?</p>
        <div className="control-row">
          {[
            { id: "no", label: "No — the 4 parts aren't the same size" },
            { id: "yes", label: "Yes — 1 out of 4 parts is shaded, so it's 1/4" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`btn ghost ${q2 === opt.id ? "pressed" : ""}`}
              disabled={q2Done}
              onClick={() => setQ2(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {q2 && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done
              ? "Correct — a fraction's parts must all be the SAME size. Here they aren't, so this picture doesn't show a true fraction, no matter how many are shaded."
              : "Not quite — look at the sizes of the 4 parts, not just how many are colored in. Are they really all the same size?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> True or False: As long as you shade <i>some</i> parts of a shape, you can call the shaded amount a fraction.
        </p>
        <div className="control-row">
          {[
            { id: "false", label: "False" },
            { id: "true", label: "True" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`btn ghost ${q3 === opt.id ? "pressed" : ""}`}
              disabled={q3Done}
              onClick={() => setQ3(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {q3 && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done
              ? "Correct — the shape has to be split into EQUAL parts first. Shading some unequal parts doesn't name a fraction."
              : "Not quite — think back to question 2. Shading some parts isn't enough by itself."}
          </p>
        )}
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
  const [den, setDen] = useState<number>(4);
  const [num, setNum] = useState<number>(1);
  const [showUnequal, setShowUnequal] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && (
        <button
          type="button"
          className="btn ghost"
          style={{ width: "fit-content", ...(showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
          onClick={() => setShowCheck((v) => !v)}
        >
          Quick Check
        </button>
      )}
      {(introActive || showCheck) && <WhatIsAFractionCheck onComplete={onIntroDone} />}
      <p>
        A fraction names an amount by splitting a whole into <b>equal-size</b> parts, then counting how many of those parts you have. Try different
        splits and shading below.
      </p>
      <Segmented label="Split the whole into" value={String(den)} onChange={(v) => { const d = Number(v); setDen(d); if (num > d) setNum(d); }} options={DENOMS.map((d) => ({ id: String(d), label: `${d} parts` }))} />
      <div className="control-row">
        <Stepper label="Parts shaded" value={num} min={0} max={den} onChange={setNum} tone="a" />
      </div>
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-end" }}>
        <FractionBar numerator={num} denominator={den} label={num === 0 ? `0 of ${den} shaded` : `${num}/${den}`} />
        <PartsCircle numerator={num} denominator={den} showNumbers label={num === 0 ? `0 of ${den} shaded` : `${num}/${den}`} />
      </div>
      <button type="button" className="btn ghost" style={{ width: "fit-content" }} onClick={() => setShowUnequal((v) => !v)}>
        {showUnequal ? "Hide the unequal-parts example" : "What if the parts AREN'T equal?"}
      </button>
      {showUnequal && (
        <div>
          <UnequalPartsBar segments={[1, 2, 0.5, 1.5].slice(0, den)} shadedIndices={Array.from({ length: Math.min(num, den) }, (_, i) => i)} label="Same count shaded, but the parts are different sizes — NOT a valid fraction picture" />
          <p className="muted small">Compare the width of each part above — they're not the same, so this picture can't be named as a fraction the normal way.</p>
        </div>
      )}
    </div>
  );
}

// Shared first steps: count the equal parts (denominator), then the shaded
// ones (numerator), BEFORE naming the fraction — so the vocabulary from the
// CFU is exercised on every picture rather than skipped by pattern-matching.
const countPartsStep = (d: number) => ({
  kind: "number" as const,
  prompt: "How many equal parts is the whole split into?",
  hint: "Count every part, shaded or not.",
  explain: `${d} equal parts — that's the bottom number (denominator).`,
  answer: d,
});
const countShadedStep = (a: number) => ({
  kind: "number" as const,
  prompt: "How many of those parts are shaded?",
  hint: "Count only the colored parts.",
  explain: `${a} shaded — that's the top number (numerator).`,
  answer: a,
});

// ============================================================================
// PROBLEM TYPE 1 — name a unit fraction (1/b)
// ============================================================================

function unitFractionProblem(): Problem {
  const d = pick(DENOMS);
  return {
    title: "Naming a fraction",
    bucket: "unit",
    story: "",
    visual: () => <FractionBar numerator={1} denominator={d} />,
    steps: [
      countPartsStep(d),
      countShadedStep(1),
      choice(
        {
          prompt: "Which fraction does this picture show?",
          hint: "Count the equal parts (the bottom number), then how many are shaded (the top number).",
          explain: `1 part out of ${d} equal parts is shaded, so this shows 1/${d}.`,
        },
        `1/${d}`,
        [`${d}/1`, d > 2 ? `${d - 1}/${d}` : `2/2`]
      ),
    ],
    wrapUp: `This picture shows 1/${d}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — name a non-unit fraction (a/b, a > 1)
// ============================================================================

function nonUnitFractionProblem(): Problem {
  const d = pick(DENOMS.filter((x) => x >= 3));
  const a = randInt(2, d - 1);
  return {
    title: "Naming a fraction",
    bucket: "nonunit",
    story: "",
    visual: () => <FractionBar numerator={a} denominator={d} />,
    steps: [
      countPartsStep(d),
      countShadedStep(a),
      choice(
        {
          prompt: "Which fraction does this picture show?",
          hint: "Count the equal parts (bottom number) and the shaded parts (top number).",
          explain: `${a} parts out of ${d} equal parts are shaded, so this shows ${a}/${d}.`,
        },
        `${a}/${d}`,
        [`${d}/${a}`, `${a - 1}/${d}`]
      ),
    ],
    wrapUp: `This picture shows ${a}/${d}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — build/shade a fraction (reverse direction)
// ============================================================================

function buildFractionProblem(): Problem {
  const d = pick(DENOMS);
  const a = randInt(1, d - 1);
  return {
    title: "Shading a fraction",
    bucket: "build",
    story: `Show ${a}/${d} by shading the right number of equal parts.`,
    visual: (done: number) => <FractionBar numerator={done >= 2 ? a : 0} denominator={d} />,
    steps: [
      {
        kind: "number",
        prompt: `Which number in ${a}/${d} tells you how many equal parts the whole is split into?`,
        hint: "It's the bottom number (denominator).",
        explain: `The bottom number, ${d}, so the bar is split into ${d} equal parts.`,
        answer: d,
      },
      {
        kind: "number",
        prompt: `The bar is split into ${d} equal parts. How many should you shade to show ${a}/${d}?`,
        hint: `The top number, ${a}, tells you how many parts to shade.`,
        explain: `${a}/${d} means ${a} of the ${d} equal parts are shaded.`,
        answer: a,
      },
    ],
    wrapUp: `${a}/${d} means ${a} of the ${d} equal parts shaded.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — non-example / trap: unequal parts
// ============================================================================

function unequalPartsTrapProblem(): Problem {
  const d = pick(DENOMS);
  const segments = Array.from({ length: d }, () => 1);
  const idx = randInt(0, d - 1);
  segments[idx] = 2.2;
  let idx2 = randInt(0, d - 1);
  while (idx2 === idx) idx2 = randInt(0, d - 1);
  segments[idx2] = 0.5;
  const a = randInt(1, d - 1);
  const shadedIndices = Array.from({ length: a }, (_, i) => i);

  return {
    title: "Is this a valid fraction picture?",
    bucket: "trap",
    story: "",
    visual: () => <UnequalPartsBar segments={segments} shadedIndices={shadedIndices} />,
    steps: [
      choice(
        {
          prompt: "Look at the widths of the parts. Are all the parts the same size?",
          hint: "Compare the widest part to the narrowest part.",
          explain: "No — some parts are wider than others.",
        },
        "No — some parts are bigger than others",
        ["Yes — they're all the same size"]
      ),
      choice(
        {
          prompt: `This whole is split into ${d} parts, and ${a} are shaded. Does this picture correctly show ${a}/${d}?`,
          hint: "Look closely at the SIZE of each part, not just how many are shaded.",
          explain: `No — the ${d} parts aren't all the same size, so this picture doesn't show a valid fraction. A fraction's parts must be equal size.`,
        },
        "No — the parts aren't all the same size",
        [`Yes — ${a} of the ${d} parts are shaded, so it's ${a}/${d}`, "Yes, as long as the shaded parts are next to each other"]
      ),
    ],
    wrapUp: `Not a valid ${a}/${d} picture — the parts must be equal size first.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <FractionBar numerator={3} denominator={4} width={160} />;
}

export const whatAFractionIs: Unit = {
  id: "whatAFractionIs",
  title: "What a Fraction Is",
  goal: "Look at a shape split into equal parts and name the fraction for one part (like 1/4) or several parts (like 3/4), and explain what the top and bottom numbers each mean.",
  standard: "3.NF.1",
  keyIdea: (
    <>
      <p>A fraction splits a whole into equal-size parts, then counts how many of those parts you have.</p>
      <p>The bottom number (denominator) says how many equal parts the whole is split into. The top number (numerator) says how many of those parts are counted.</p>
      <p>The parts MUST be equal size — a picture with unequal parts, even with some shaded, doesn't show a true fraction.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["unit", "nonunit", "build", "trap"],
  problems: [
    { label: "Name it (1/b)", make: unitFractionProblem, buckets: ["unit"] },
    { label: "Name it (a/b)", make: nonUnitFractionProblem, buckets: ["nonunit"] },
    { label: "Shade a fraction", make: buildFractionProblem, buckets: ["build"] },
    { label: "Equal parts check", make: unequalPartsTrapProblem, buckets: ["trap"] },
  ],
  test: whatAFractionIsTest,
};
