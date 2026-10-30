import { useEffect, useState } from "react";
import { NumberLine } from "../../../shared/diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";
import { type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { roundingNearestHundredTest } from "./RoundingToNearestHundredTest";

const roundToNearest = (n: number, unit: number): number => Math.floor(n / unit + 0.5) * unit;

export const HUNDRED_BUCKETS = ["clear", "midpoint", "boundary", "mixedDiscrimination"] as const;
export type HundredBucket = (typeof HUNDRED_BUCKETS)[number];

/** Clearly closer to one hundred than the other — kept out of the 900s decade
 *  (reserved for `boundary` below) and off exact midpoints. */
const randClearHundred = (): number => {
  let n: number;
  do {
    n = randInt(110, 849);
  } while (n % 100 === 50);
  return n;
};

/** Exactly halfway between two hundreds (ends in 50) — the nearest-100 analog
 *  of nearest-10's midpoint case. */
const randMidpointHundred = (): number => randInt(1, 9) * 100 + 50;

/** Forces the thousand-boundary crossing: a number in the 900s decade whose
 *  last two digits are 51-99 (never an exact midpoint), so it unambiguously
 *  rounds UP past 1000 — the plan's explicitly-included in-range endpoint
 *  (960 -> 1000 is a legitimate in-range result, not capped). */
const randBoundaryHundred = (): number => 900 + randInt(51, 99);

const randForBucket = (bucket: HundredBucket): number =>
  bucket === "clear" ? randClearHundred() : bucket === "midpoint" ? randMidpointHundred() : randBoundaryHundred();

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * 4 fixed comprehension questions: a basic/vocabulary case (Q1), the midpoint
 * edge case (Q2), the thousand-boundary crossing via a 2-part dropdown (Q3),
 * and — per the plan's explicit requirement — the nearest-ten-vs-nearest-
 * hundred mixed discrimination case (Q4), since students who master nearest-
 * ten rounding often misapply the same digit-position habit here without
 * re-deriving it from the (bigger) number line.
 */
function RoundingHundredGate({ onComplete }: { onComplete?: () => void }) {
  const [q1, setQ1] = useState<number | null>(null);
  const q1Done = q1 === 300;

  const [q2, setQ2] = useState<number | null>(null);
  const q2Done = q2 === 400;

  const [q3a, setQ3a] = useState<string>("");
  const [q3b, setQ3b] = useState<string>("");
  const [q3Checked, setQ3Checked] = useState(false);
  const q3Filled = allFilled(q3a, q3b);
  const q3Done = q3Checked && q3a === "1000" && q3b === "closer1000";

  const [q4a, setQ4a] = useState<string>("");
  const [q4b, setQ4b] = useState<string>("");
  const [q4Checked, setQ4Checked] = useState(false);
  const q4Filled = allFilled(q4a, q4b);
  const q4Done = q4Checked && q4a === "650" && q4b === "600";

  const allDone = q1Done && q2Done && q3Done && q4Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: rounding to the nearest hundred uses the SAME idea as nearest ten — just bigger landmarks.</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> Which hundred is 340 closer to?
        </p>
        <NumberLine
          min={300}
          max={400}
          points={[
            { value: 340, label: "340", tone: "a" },
            { value: 300, label: "300", tone: q1 === 300 ? "c" : "b" },
            { value: 400, label: "400", tone: q1 === 400 ? "c" : "b" },
          ]}
        />
        <div className="control-row">
          <button type="button" className="btn ghost" disabled={q1Done} onClick={() => setQ1(300)}>
            300
          </button>
          <button type="button" className="btn ghost" disabled={q1Done} onClick={() => setQ1(400)}>
            400
          </button>
        </div>
        {q1 !== null && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done ? "Right — 340 is only 40 away from 300, but 60 away from 400." : "Not quite — count the distance to each hundred, then try again."}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> 350 is exactly halfway between 300 and 400. Which way do we round?
        </p>
        <div className="control-row">
          <button type="button" className="btn ghost" disabled={q2Done} onClick={() => setQ2(300)}>
            Round down to 300
          </button>
          <button type="button" className="btn ghost" disabled={q2Done} onClick={() => setQ2(400)}>
            Round up to 400
          </button>
        </div>
        {q2 !== null && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done ? "Right — exactly halfway always rounds UP, same rule as nearest ten." : "Not quite — what did the rounding rule say to do with an exact tie?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> Round 960 to the nearest hundred:{" "}
          <select className="answer" aria-label="rounded result" value={q3a} onChange={(e) => setQ3a(e.target.value)} disabled={q3Done} style={answerBorder(q3a === "1000", q3Checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="900">900</option>
            <option value="1000">1000</option>
          </select>
          , because 960 is{" "}
          <select className="answer" aria-label="reasoning" value={q3b} onChange={(e) => setQ3b(e.target.value)} disabled={q3Done} style={answerBorder(q3b === "closer1000", q3Checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="closer900">closer to 900</option>
            <option value="closer1000">closer to 1000, the next thousand</option>
          </select>
          .
        </p>
        <div className="control-row">
          <button className="btn primary" type="button" disabled={q3Done || !q3Filled} onClick={() => setQ3Checked(true)}>
            Check Answer
          </button>
        </div>
        {q3Checked && q3Filled && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done
              ? "Right — 960 rounds up to 1000. Rounding to the nearest hundred can cross into the next thousand, same as rounding to the nearest ten could cross a hundred."
              : "Not quite yet — is 960 closer to 900 or to 1000?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>4.</b> Round 647: to the nearest ten it's{" "}
          <select className="answer" aria-label="nearest ten" value={q4a} onChange={(e) => setQ4a(e.target.value)} disabled={q4Done} style={answerBorder(q4a === "650", q4Checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="640">640</option>
            <option value="650">650</option>
          </select>
          , and to the nearest hundred it's{" "}
          <select className="answer" aria-label="nearest hundred" value={q4b} onChange={(e) => setQ4b(e.target.value)} disabled={q4Done} style={answerBorder(q4b === "600", q4Checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="600">600</option>
            <option value="700">700</option>
          </select>
          .
        </p>
        <div className="control-row">
          <button className="btn primary" type="button" disabled={q4Done || !q4Filled} onClick={() => setQ4Checked(true)}>
            Check Answer
          </button>
        </div>
        {q4Checked && q4Filled && (
          <p className={`feedback ${q4Done ? "good" : "bad"}`} role="alert">
            {q4Done
              ? "Right — the same number, 647, rounds differently depending on which landmark the question is actually asking about. Always check which one it is."
              : "Not quite yet — figure out each one separately; they don't have to match."}
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
  const [value, setValue] = useState(340);
  const lower = Math.floor(value / 100) * 100;
  const upper = lower + 100;
  const rounded = roundToNearest(value, 100);
  const isMid = value % 100 === 50;

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
      {(introActive || showCheck) && <RoundingHundredGate onComplete={onIntroDone} />}
      <div className="control-row">
        <Stepper label="Number" value={value} min={0} max={999} step={1} onChange={setValue} tone="a" />
      </div>
      <NumberLine
        min={lower}
        max={upper}
        points={[
          { value, label: String(value), tone: "a", onChange: setValue },
          { value: lower, label: String(lower), tone: "b" },
          { value: upper, label: String(upper), tone: "c" },
        ]}
      />
      <p className="muted small">
        {value} is {Math.abs(value - lower)} away from {lower}, and {Math.abs(upper - value)} away from {upper}.{" "}
        {isMid ? `Exactly halfway — by the rounding rule, ${value} rounds UP to ${rounded}.` : `So ${value} rounds to ${rounded}.`}
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE
// ============================================================================

function makeRoundHundredProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as HundredBucket) ?? pick(HUNDRED_BUCKETS);

  if (bucket === "mixedDiscrimination") {
    // Avoid landing on a number whose nearest-ten and nearest-hundred answers
    // happen to coincide (e.g. a round-numbered hundred itself) — the whole
    // point of this bucket is forcing two genuinely different computations.
    let n: number;
    let r10: number;
    let r100: number;
    do {
      n = randInt(115, 884);
      r10 = roundToNearest(n, 10);
      r100 = roundToNearest(n, 100);
    } while (r10 === r100 || n % 10 === 0 || n % 100 === 0);
    const tenLower = Math.floor(n / 10) * 10;
    const tenUpper = tenLower + 10;
    const hundredLower = Math.floor(n / 100) * 100;
    const hundredUpper = hundredLower + 100;
    return {
      title: "Which landmark? Nearest ten vs. nearest hundred",
      bucket,
      story: `Round ${n} two different ways: to the nearest ten, and to the nearest hundred.`,
      visual: (done: number) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div className="muted small">Nearest ten</div>
            <NumberLine min={tenLower} max={tenUpper} points={[{ value: n, label: String(n), tone: "a" }, ...(done >= 1 ? [{ value: r10, label: String(r10), tone: "c" as const }] : [])]} />
          </div>
          <div>
            <div className="muted small">Nearest hundred</div>
            <NumberLine
              min={hundredLower}
              max={hundredUpper}
              points={[{ value: n, label: String(n), tone: "a" }, ...(done >= 2 ? [{ value: r100, label: String(r100), tone: "c" as const }] : [])]}
            />
          </div>
        </div>
      ),
      steps: [
        {
          kind: "number",
          prompt: `Round ${n} to the nearest ten.`,
          hint: `Which ten, ${tenLower} or ${tenUpper}, is ${n} closer to?`,
          explain: `${n} rounds to ${r10} when rounding to the nearest ten.`,
          answer: r10,
        },
        {
          kind: "number",
          prompt: `Now round ${n} to the nearest hundred.`,
          hint: `Which hundred, ${hundredLower} or ${hundredUpper}, is ${n} closer to? This is a totally separate question from the one above.`,
          explain: `${n} rounds to ${r100} when rounding to the nearest hundred.`,
          answer: r100,
        },
        {
          kind: "number",
          prompt: `Those two answers are different numbers. What is the difference between them (the bigger one minus the smaller)?`,
          hint: `${Math.max(r10, r100)} − ${Math.min(r10, r100)} = ?`,
          explain: `Rounding the SAME number ${n} two different ways gave two different results, ${r10} and ${r100} — always check which landmark a question is actually asking for.`,
          answer: Math.abs(r10 - r100),
        },
      ],
      wrapUp: `${n} rounds to ${r10} (nearest ten) and ${r100} (nearest hundred) — reading which landmark is asked for matters.`,
    };
  }

  const n = randForBucket(bucket);
  const lower = Math.floor(n / 100) * 100;
  const upper = lower + 100;
  const rounded = roundToNearest(n, 100);
  const isMid = n % 100 === 50;

  return {
    title: "Round to the nearest hundred",
    bucket,
    story: `Round ${n} to the nearest hundred.`,
    visual: (done: number) => (
      <NumberLine
        min={lower}
        max={upper}
        points={[
          { value: n, label: String(n), tone: "a" },
          ...(done >= 1 ? [{ value: lower, label: String(lower), tone: "b" as const }] : []),
          ...(done >= 2 ? [{ value: upper, label: String(upper), tone: "c" as const }] : []),
        ]}
      />
    ),
    steps: [
      {
        kind: "number",
        prompt: `What hundred is just below (or equal to) ${n}?`,
        hint: "Cover up the tens and ones digits — what's left (times 100) is the hundred below it.",
        explain: `${lower} is the hundred just below ${n}.`,
        answer: lower,
      },
      {
        kind: "number",
        prompt: `What hundred is just above ${lower}?`,
        hint: "The next hundred up is always 100 more.",
        explain: `${upper} is the next hundred after ${lower}.`,
        answer: upper,
      },
      {
        kind: "number",
        prompt: isMid
          ? `${n} is exactly halfway between ${lower} and ${upper}. By the rounding rule, which way do we round?`
          : `Which of ${lower} or ${upper} is ${n} actually closer to?`,
        hint: isMid
          ? "A number exactly in the middle doesn't lean closer to either side — the rule says round UP."
          : n - lower < upper - n
          ? `${n} is only ${n - lower} away from ${lower}, but ${upper - n} away from ${upper}.`
          : `${n} is only ${upper - n} away from ${upper}, but ${n - lower} away from ${lower}.`,
        explain: isMid ? `${n} rounds up to ${rounded} — exactly-halfway numbers always round up.` : `${n} is closer to ${rounded}, so it rounds to ${rounded}.`,
        answer: rounded,
      },
    ],
    wrapUp: `${n} rounds to ${rounded}.`,
  };
}

export const roundingNearestHundred: Unit = {
  id: "roundingNearestHundred",
  title: "Rounding to the Nearest Hundred",
  goal: "Round any whole number to the nearest hundred and explain why, using the same number-line idea as rounding to the nearest ten.",
  standard: "3.NBT.1",
  keyIdea: (
    <>
      <p>Rounding to the nearest hundred uses the exact same idea as rounding to the nearest ten — just the landmarks are hundreds instead of tens.</p>
      <p>The same number can round differently depending on which landmark a question asks about, so always check: nearest ten, or nearest hundred?</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Round to the Nearest Hundred", make: makeRoundHundredProblem, buckets: [...HUNDRED_BUCKETS] }],
  requiredBuckets: [...HUNDRED_BUCKETS],
  test: roundingNearestHundredTest,
};
