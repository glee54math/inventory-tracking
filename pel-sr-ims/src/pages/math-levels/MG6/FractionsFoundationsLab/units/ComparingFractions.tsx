import { useEffect, useState } from "react";
import { FractionBar } from "../diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingFractionsTest } from "./ComparingFractionsTest";

// Own local copy of the lab-wide denominator set — see
// FractionsOnANumberLine.tsx's comment on why every unit file keeps its own.
const DENOMS = [2, 3, 4, 6, 8] as const;
const SYMBOLS = ["<", ">", "="];

/** The one symbol-picking function shared by Explore's live readout and
 *  every Practice step's correct answer, so they can never disagree. */
export function compareSymbol(n1: number, d1: number, n2: number, d2: number): "<" | ">" | "=" {
  const a = n1 * d2;
  const b = n2 * d1;
  return a < b ? "<" : a > b ? ">" : "=";
}

/** Two distinct proper fractions with one shared denominator (d ≥ 3, so two
 *  different proper numerators exist). */
function sameDenomPair(): { n1: number; n2: number; d: number } {
  const d = pick(DENOMS.filter((x) => x >= 3));
  const n1 = randInt(1, d - 1);
  let n2 = randInt(1, d - 1);
  while (n2 === n1) n2 = randInt(1, d - 1);
  return { n1, n2, d };
}

/** Two proper fractions with one shared numerator and two different
 *  denominators from the set — the numerator must be < BOTH denominators. */
function sameNumPair(): { n: number; d1: number; d2: number } {
  const d1 = pick(DENOMS);
  let d2 = pick(DENOMS);
  while (d2 === d1) d2 = pick(DENOMS);
  const n = randInt(1, Math.min(d1, d2) - 1);
  return { n, d1, d2 };
}

const BIG_W = 320;

/** Width for the SMALL whole in the different-wholes trap, chosen so the
 *  smaller fraction (drawn on the big whole) shows MORE shaded area than the
 *  larger fraction (drawn on the small whole) — the picture actively
 *  misleads, which is the point of the trap. */
function smallWholeWidth(smallFrac: number, bigFrac: number): number {
  return Math.max(70, Math.round((BIG_W * smallFrac * 0.7) / bigFrac));
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * Four fixed questions. Q1 (two dropdowns, one sentence) is the named
 * misconception from the standard itself: more pieces means SMALLER pieces,
 * so 1/6 < 1/3. Q2 is the same-whole requirement, using a big-whole/small-
 * whole picture where the shaded areas mislead. Q3 is the true/false
 * generalization trap ("bigger denominator = bigger fraction"). Q4 forces
 * the "=" symbol instead of defaulting to < or >.
 */
function ComparingCheck({ onComplete }: { onComplete?: () => void }) {
  const [pieces, setPieces] = useState("");
  const [which, setWhich] = useState("");
  const [q1Checked, setQ1Checked] = useState(false);
  const q1Filled = allFilled(pieces, which);
  const q1Done = q1Checked && pieces === "smaller" && which === "less";

  const [q2, setQ2] = useState<string | null>(null);
  const q2Done = q2 === "no";

  const [q3, setQ3] = useState<string | null>(null);
  const q3Done = q3 === "false";

  const [q4, setQ4] = useState<string | null>(null);
  const q4Done = q4 === "=";

  const allDone = q1Done && q2Done && q3Done && q4Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure comparing fractions makes sense before you try practice problems.</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> Compare 1/3 and 1/6, each on the same-size whole:
        </p>
        <div className="control-row">
          <FractionBar numerator={1} denominator={3} width={200} label="1/3" />
          <FractionBar numerator={1} denominator={6} width={200} label="1/6" />
        </div>
        <p>
          A whole cut into 6 parts has{" "}
          <select className="answer" value={pieces} onChange={(e) => setPieces(e.target.value)} aria-label="Bigger or smaller pieces" disabled={q1Done} style={answerBorder(pieces === "smaller", q1Checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="bigger">bigger</option>
            <option value="smaller">smaller</option>
          </select>{" "}
          pieces than a whole cut into 3 parts, so 1/6 is{" "}
          <select className="answer" value={which} onChange={(e) => setWhich(e.target.value)} aria-label="Greater or less" disabled={q1Done} style={answerBorder(which === "less", q1Checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="greater">greater than</option>
            <option value="less">less than</option>
          </select>{" "}
          1/3.
          <button className="btn primary" type="button" style={{ marginLeft: 10 }} disabled={q1Done || !q1Filled} onClick={() => setQ1Checked(true)}>
            Check Answer
          </button>
        </p>
        {q1Checked && q1Filled && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done
              ? "Correct — more pieces means each piece is smaller, so 1/6 < 1/3, even though 6 is bigger than 3."
              : "Not quite — look at the bars. Which single shaded piece is bigger? Try again."}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> Maya says 1/4 of the big bar is more than 1/2 of the small bar, so 1/4 &gt; 1/2.
        </p>
        <div className="control-row">
          <FractionBar numerator={1} denominator={4} width={BIG_W} label="1/4 of a BIG whole" />
          <FractionBar numerator={1} denominator={2} width={110} label="1/2 of a small whole" />
        </div>
        <p>Is it fair to compare these two pictures to decide which fraction is bigger?</p>
        <div className="control-row">
          {[
            { id: "no", label: "No — the two wholes aren't the same size" },
            { id: "yes", label: "Yes — the bigger shaded part is the bigger fraction" },
          ].map((opt) => (
            <button key={opt.id} type="button" className={`btn ghost ${q2 === opt.id ? "pressed" : ""}`} disabled={q2Done} onClick={() => setQ2(opt.id)}>
              {opt.label}
            </button>
          ))}
        </div>
        {q2 && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done
              ? "Correct — fractions can only be compared this way when they're parts of the SAME-size whole. On the same whole, 1/4 < 1/2."
              : "Not quite — look at the two wholes themselves. Are they the same size?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> True or False: A fraction with a bigger denominator is always the bigger fraction.
        </p>
        <div className="control-row">
          {[
            { id: "false", label: "False" },
            { id: "true", label: "True" },
          ].map((opt) => (
            <button key={opt.id} type="button" className={`btn ghost ${q3 === opt.id ? "pressed" : ""}`} disabled={q3Done} onClick={() => setQ3(opt.id)}>
              {opt.label}
            </button>
          ))}
        </div>
        {q3 && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done ? "Correct — think of 1/3 and 1/6 from question 1: the bigger denominator made the SMALLER fraction." : "Not quite — remember question 1. Is it always true?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>4.</b> Which symbol goes in the blank? 4/8 ___ 4/8
        </p>
        <div className="control-row">
          {SYMBOLS.map((s) => (
            <button key={s} type="button" className={`btn ghost ${q4 === s ? "pressed" : ""}`} disabled={q4Done} onClick={() => setQ4(s)}>
              {s}
            </button>
          ))}
        </div>
        {q4 && (
          <p className={`feedback ${q4Done ? "good" : "bad"}`} role="alert">
            {q4Done ? "Correct — same numerator and same denominator means the same amount, so they're equal." : "Not quite — is either one actually bigger?"}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

type Mode = "same-denom" | "same-num";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<Mode>("same-denom");
  // Same-denominator sandbox
  const [d, setD] = useState(8);
  const [n1, setN1] = useState(3);
  const [n2, setN2] = useState(5);
  // Same-numerator sandbox
  const [n, setN] = useState(1);
  const [d1, setD1] = useState(3);
  const [d2, setD2] = useState(6);

  const [an, ad, bn, bd] = mode === "same-denom" ? [Math.min(n1, d), d, Math.min(n2, d), d] : [Math.min(n, d1), d1, Math.min(n, d2), d2];
  const sym = compareSymbol(an, ad, bn, bd);

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
      {(introActive || showCheck) && <ComparingCheck onComplete={onIntroDone} />}
      <p>Two fractions of the SAME-size whole can be compared by looking at the pieces — as long as they share a top number or a bottom number.</p>
      <Segmented
        label="Compare"
        value={mode}
        onChange={setMode}
        options={[
          { id: "same-denom", label: "Same bottom number" },
          { id: "same-num", label: "Same top number" },
        ]}
      />
      {mode === "same-denom" ? (
        <>
          <Segmented label="Denominator" value={String(d)} onChange={(v) => setD(Number(v))} options={DENOMS.map((x) => ({ id: String(x), label: String(x) }))} />
          <div className="control-row">
            <Stepper label="First numerator" value={Math.min(n1, d)} min={0} max={d} onChange={setN1} tone="a" />
            <Stepper label="Second numerator" value={Math.min(n2, d)} min={0} max={d} onChange={setN2} tone="c" />
          </div>
        </>
      ) : (
        <>
          <div className="control-row">
            <Stepper label="Shared numerator" value={n} min={1} max={2} onChange={setN} tone="b" />
          </div>
          <div className="control-row">
            <Segmented label="First denominator" value={String(d1)} onChange={(v) => setD1(Number(v))} options={DENOMS.map((x) => ({ id: String(x), label: String(x) }))} />
            <Segmented label="Second denominator" value={String(d2)} onChange={(v) => setD2(Number(v))} options={DENOMS.map((x) => ({ id: String(x), label: String(x) }))} />
          </div>
        </>
      )}
      <div className="control-row">
        <FractionBar numerator={an} denominator={ad} width={240} label={`${an}/${ad}`} />
        <FractionBar numerator={bn} denominator={bd} width={240} label={`${bn}/${bd}`} />
      </div>
      <p className="says">
        {an}/{ad} {sym} {bn}/{bd}
      </p>
      <p className="muted small">
        {mode === "same-denom"
          ? "Same bottom number means same-size pieces — more pieces shaded is more."
          : "Same top number means the same COUNT of pieces — but a whole cut into more parts has smaller pieces, so the bigger bottom number makes the smaller fraction."}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — same denominator
// ============================================================================

function sameDenomProblem(): Problem {
  const { n1, n2, d } = sameDenomPair();
  const sym = compareSymbol(n1, d, n2, d);
  const more = Math.max(n1, n2);
  return {
    title: "Same denominator",
    bucket: "same-denom",
    story: `Compare ${n1}/${d} and ${n2}/${d}.`,
    visual: () => (
      <div className="control-row">
        <FractionBar numerator={n1} denominator={d} width={200} label={`${n1}/${d}`} />
        <FractionBar numerator={n2} denominator={d} width={200} label={`${n2}/${d}`} />
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `Both wholes are cut into ${d} equal pieces, so the pieces are the same size. Which fraction has more pieces shaded?`,
          hint: "Same-size pieces — just compare the top numbers.",
          explain: `${more}/${d} has ${more} pieces shaded, the most.`,
        },
        `${more}/${d}`,
        [`${Math.min(n1, n2)}/${d}`, "They have the same number shaded"]
      ),
      choice(
        {
          prompt: `Which symbol goes in the blank? ${n1}/${d} ___ ${n2}/${d}`,
          hint: "The symbol's open side faces the bigger fraction.",
          explain: `${n1}/${d} ${sym} ${n2}/${d}.`,
        },
        sym,
        SYMBOLS
      ),
    ],
    wrapUp: `${n1}/${d} ${sym} ${n2}/${d}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — same numerator (the counterintuitive case)
// ============================================================================

function sameNumProblem(): Problem {
  const { n, d1, d2 } = sameNumPair();
  const sym = compareSymbol(n, d1, n, d2);
  const fewer = Math.min(d1, d2);
  const moreParts = Math.max(d1, d2);
  return {
    title: "Same numerator",
    bucket: "same-num",
    story: `Compare ${n}/${d1} and ${n}/${d2}.`,
    visual: () => (
      <div className="control-row">
        <FractionBar numerator={n} denominator={d1} width={200} label={`${n}/${d1}`} />
        <FractionBar numerator={n} denominator={d2} width={200} label={`${n}/${d2}`} />
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `Both have ${n} piece${n === 1 ? "" : "s"} shaded. Which whole has the BIGGER pieces?`,
          hint: "Cutting the same whole into more parts makes each part smaller.",
          explain: `Cutting into ${fewer} parts makes bigger pieces than cutting into ${moreParts}.`,
        },
        `The one cut into ${fewer} parts`,
        // The "bigger number = bigger piece" whole-number intuition.
        [`The one cut into ${moreParts} parts`, "The pieces are the same size"]
      ),
      choice(
        {
          prompt: `Which symbol goes in the blank? ${n}/${d1} ___ ${n}/${d2}`,
          hint: "Same number of pieces — the one with bigger pieces is bigger.",
          explain: `${n}/${d1} ${sym} ${n}/${d2} — fewer, bigger pieces wins.`,
        },
        sym,
        SYMBOLS
      ),
    ],
    wrapUp: `${n}/${d1} ${sym} ${n}/${d2}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — trap: different-size wholes
// ============================================================================

/** A same-numerator or same-denominator pair a < b, rerolled until putting
 *  `a` on the big whole really does shade MORE area than `b` on the small
 *  whole (the width clamp in smallWholeWidth can otherwise undo that for a
 *  lopsided pair like 1/8 vs 7/8). Exported for the brute-force check. */
export function diffWholePair(): { a: [number, number]; b: [number, number]; smallW: number } {
  for (;;) {
    let a: [number, number];
    let b: [number, number];
    if (Math.random() < 0.5) {
      const { n, d1, d2 } = sameNumPair();
      const [big, small] = d1 > d2 ? [d1, d2] : [d2, d1];
      a = [n, big];
      b = [n, small];
    } else {
      const { n1, n2, d } = sameDenomPair();
      a = [Math.min(n1, n2), d];
      b = [Math.max(n1, n2), d];
    }
    const fa = a[0] / a[1];
    const fb = b[0] / b[1];
    const smallW = smallWholeWidth(fa, fb);
    if (fa * BIG_W > fb * smallW) return { a, b, smallW };
  }
}

function diffWholeProblem(): Problem {
  // The SMALLER fraction goes on the BIG whole so the picture misleads.
  const { a, b, smallW } = diffWholePair();
  return {
    title: "Is this comparison fair?",
    bucket: "diff-whole",
    story: `Sam says ${a[0]}/${a[1]} is bigger than ${b[0]}/${b[1]}, because its shaded part looks bigger.`,
    visual: () => (
      <div className="control-row">
        <FractionBar numerator={a[0]} denominator={a[1]} width={BIG_W} label={`${a[0]}/${a[1]} of a BIG whole`} />
        <FractionBar numerator={b[0]} denominator={b[1]} width={smallW} label={`${b[0]}/${b[1]}`} />
      </div>
    ),
    steps: [
      choice(
        {
          prompt: "Is it fair to compare these two pictures to decide which fraction is bigger?",
          hint: "Look at the two wholes themselves, not the shaded parts.",
          explain: "No — fractions can only be compared this way when they're parts of the same-size whole.",
        },
        "No — the two wholes aren't the same size",
        ["Yes — the bigger shaded part is the bigger fraction", "Yes — as long as both are split into equal parts"]
      ),
      choice(
        {
          prompt: `On the SAME-size whole, which symbol goes in the blank? ${a[0]}/${a[1]} ___ ${b[0]}/${b[1]}`,
          hint: a[1] === b[1] ? "Same denominator — compare the top numbers." : "Same numerator — the one with bigger pieces is bigger.",
          explain: `On the same whole, ${a[0]}/${a[1]} < ${b[0]}/${b[1]} — Sam was fooled by the different-size wholes.`,
        },
        "<",
        SYMBOLS
      ),
    ],
    wrapUp: `${a[0]}/${a[1]} < ${b[0]}/${b[1]} — but only when both are parts of the same-size whole.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — the equal case
// ============================================================================

function equalProblem(): Problem {
  const d = pick(DENOMS);
  const n = randInt(1, d - 1);
  return {
    title: "Equal fractions",
    bucket: "equal",
    story: `Compare ${n}/${d} and ${n}/${d}.`,
    visual: () => (
      <div className="control-row">
        <FractionBar numerator={n} denominator={d} width={200} label={`${n}/${d}`} />
        <FractionBar numerator={n} denominator={d} width={200} label={`${n}/${d}`} />
      </div>
    ),
    steps: [
      choice(
        {
          prompt: "What do you notice about these two fractions?",
          hint: "Compare both the top numbers and the bottom numbers.",
          explain: "Same numerator AND same denominator — the exact same amount.",
        },
        "Same top number AND same bottom number",
        ["Same top number, but different bottom numbers", "Same bottom number, but different top numbers"]
      ),
      choice(
        {
          prompt: `Which symbol goes in the blank? ${n}/${d} ___ ${n}/${d}`,
          hint: "Is either one actually bigger?",
          explain: `${n}/${d} = ${n}/${d}.`,
        },
        "=",
        SYMBOLS
      ),
    ],
    wrapUp: `${n}/${d} = ${n}/${d}.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FractionBar numerator={1} denominator={3} width={200} />
      <FractionBar numerator={1} denominator={6} width={200} />
    </div>
  );
}

export const comparingFractions: Unit = {
  id: "comparingFractions",
  title: "Comparing Fractions",
  goal: "Compare two fractions that share the same top number or the same bottom number, tell which is greater, and explain why using a picture.",
  standard: "3.NF.3d",
  keyIdea: (
    <>
      <p>Same bottom number: the pieces are the same size, so more pieces shaded is greater — 5/8 &gt; 3/8.</p>
      <p>Same top number: the whole cut into MORE parts has SMALLER pieces, so 1/6 &lt; 1/3.</p>
      <p>This only works when both fractions are parts of the same-size whole.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["same-denom", "same-num", "diff-whole", "equal"],
  problems: [
    { label: "Same bottom number", make: sameDenomProblem, buckets: ["same-denom"] },
    { label: "Same top number", make: sameNumProblem, buckets: ["same-num"] },
    { label: "Same-size whole?", make: diffWholeProblem, buckets: ["diff-whole"] },
    { label: "Equal fractions", make: equalProblem, buckets: ["equal"] },
  ],
  test: comparingFractionsTest,
};
