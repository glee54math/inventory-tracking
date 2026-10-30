import { useEffect, useState } from "react";
import { NumberLine } from "../../../shared/diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { roundingNearestTenTest } from "./RoundingToNearestTenTest";

/** Round-half-up to the nearest multiple of `unit` — the convention taught
 *  here: an exactly-halfway number always rounds UP, not "either way." */
export const roundToNearest = (n: number, unit: number): number => Math.floor(n / unit + 0.5) * unit;

/** True when rounding `n` to the nearest ten crosses into the next hundred
 *  (e.g. 96 -> 100, 395 -> 400) — the tens-digit-is-9 case where a student
 *  doing pure "change the last digit" habit gets the hundreds digit wrong too. */
export const crossesHundred = (n: number): boolean => (Math.floor(n / 10) * 10) % 100 === 90;

export const TEN_BUCKETS = ["clear", "midpoint", "boundary", "threeDigit"] as const;
export type TenBucket = (typeof TEN_BUCKETS)[number];

/** A 2-digit number clearly closer to one ten than the other (not a midpoint,
 *  not a hundred-boundary crossing — those are their own dedicated buckets). */
export const randClearTen = (): number => {
  let n: number;
  do {
    n = randInt(11, 98);
  } while (n % 10 === 5 || crossesHundred(n));
  return n;
};

/** Same "clearly closer, not a boundary/midpoint" shape as randClearTen, but
 *  forced into the 3-digit range — its own bucket since the standard's scope
 *  is explicitly "whole numbers," not just 2-digit ones. */
export const randThreeDigitTen = (): number => {
  let n: number;
  do {
    n = randInt(101, 988);
  } while (n % 10 === 5 || crossesHundred(n));
  return n;
};

/** Exactly halfway between two tens (ends in 5) — the genuine edge case
 *  where "closer" has no answer and the round-up convention is the only
 *  thing that decides it. */
export const randMidpointTen = (): number => randInt(1, 98) * 10 + 5;

/** Forces a hundred-boundary crossing: picks a hundred, then a number in its
 *  last ten (90-99) with ones digit 6-9 so it's unambiguously (not a
 *  midpoint) rounding UP into the next hundred. */
export const randBoundaryTen = (): number => randInt(0, 9) * 100 + 90 + randInt(6, 9);

const randForBucket = (bucket: TenBucket): number =>
  bucket === "clear" ? randClearTen() : bucket === "midpoint" ? randMidpointTen() : bucket === "boundary" ? randBoundaryTen() : randThreeDigitTen();

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * 4 fixed (non-randomized) comprehension questions — every student sees the
 * exact same set, same convention as every other gated Explore in this app
 * (e.g. MM1/NegativeNumbersLab's PositiveNegativePreCheck): a basic/vocabulary
 * case (Q1), the midpoint edge case (Q2), the hundred-boundary-crossing case
 * via a 2-blank dropdown (Q3), and a generalization true/false trap (Q4) —
 * exactly the 4 question types the build brief calls for.
 */
function RoundingTenGate({ onComplete }: { onComplete?: () => void }) {
  const [q1, setQ1] = useState<number | null>(null);
  const q1Done = q1 === 40;

  const [q2, setQ2] = useState<number | null>(null);
  const q2Done = q2 === 50;

  const [q3a, setQ3a] = useState("");
  const [q3b, setQ3b] = useState("");
  const q3Done = q3a === "0" && q3b === "cross";

  const [q4, setQ4] = useState("");
  const q4Done = q4 === "false";

  const allDone = q1Done && q2Done && q3Done && q4Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure rounding to the nearest ten makes sense before you try practice problems.</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> Which ten is 43 closer to?
        </p>
        <NumberLine
          min={40}
          max={50}
          points={[
            { value: 43, label: "43", tone: "a" },
            { value: 40, label: "40", tone: "b" },
            { value: 50, label: "50", tone: "c" },
          ]}
        />
        <div className="control-row">
          <button type="button" className="btn ghost" disabled={q1Done} onClick={() => setQ1(40)}>
            40
          </button>
          <button type="button" className="btn ghost" disabled={q1Done} onClick={() => setQ1(50)}>
            50
          </button>
        </div>
        {q1 !== null && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done ? "Right — 43 is only 3 away from 40, but 7 away from 50." : "Not quite — count how far 43 is from each ten, then try again."}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> 45 is exactly halfway between 40 and 50. By the rounding rule, which way do we round?
        </p>
        <div className="control-row">
          <button type="button" className="btn ghost" disabled={q2Done} onClick={() => setQ2(40)}>
            Round down to 40
          </button>
          <button type="button" className="btn ghost" disabled={q2Done} onClick={() => setQ2(50)}>
            Round up to 50
          </button>
        </div>
        {q2 !== null && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done
              ? "Right — exactly-halfway numbers aren't closer to either side, so the rule says round UP."
              : "Not quite — 45 isn't closer to either ten, so closeness can't decide it. What's the rule for exact ties?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> Round 96 to the nearest ten: the ones digit becomes{" "}
          <select className="answer" aria-label="ones digit" value={q3a} onChange={(e) => setQ3a(e.target.value)}>
            <option value="" disabled>
              choose
            </option>
            <option value="0">0</option>
            <option value="6">6</option>
          </select>
          , and the tens digit{" "}
          <select className="answer" aria-label="what happens to the tens and hundreds digits" value={q3b} onChange={(e) => setQ3b(e.target.value)}>
            <option value="" disabled>
              choose
            </option>
            <option value="stay">stays a 9</option>
            <option value="cross">changes to a 0, and the hundreds digit becomes one more</option>
          </select>
          .
        </p>
        {(q3a || q3b) && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done
              ? "Right — 96 rounds up to 100. Crossing a ten can also change the hundreds digit, not just the ones digit."
              : "Not quite yet — 96 is closer to which hundred-numbered ten, 90 or 100?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>4.</b> True or False:{" "}
          <select className="answer" aria-label="true or false" value={q4} onChange={(e) => setQ4(e.target.value)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>{" "}
          — Rounding to the nearest ten always means just changing the ones digit to 0; nothing else ever changes.
        </p>
        {q4 && (
          <p className={`feedback ${q4Done ? "good" : "bad"}`} role="alert">
            {q4Done
              ? "False — like you just saw with 96, rounding up across a hundred (like 96 -> 100) changes more than just the ones digit."
              : "Think back to question 3: did only the ones digit change there?"}
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
  const [value, setValue] = useState(43);
  const lower = Math.floor(value / 10) * 10;
  const upper = lower + 10;
  const rounded = roundToNearest(value, 10);
  const isMid = value % 10 === 5;

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
      {(introActive || showCheck) && <RoundingTenGate onComplete={onIntroDone} />}
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

function makeRoundTenProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as TenBucket) ?? pick(TEN_BUCKETS);
  const n = randForBucket(bucket);
  const lower = Math.floor(n / 10) * 10;
  const upper = lower + 10;
  const rounded = roundToNearest(n, 10);
  const isMid = n % 10 === 5;

  return {
    title: "Round to the nearest ten",
    bucket,
    story: `Round ${n} to the nearest ten.`,
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
        prompt: `What ten is just below (or equal to) ${n}?`,
        hint: "Cover up the ones digit — what's left is the ten below it.",
        explain: `${lower} is the ten just below ${n}.`,
        answer: lower,
      },
      {
        kind: "number",
        prompt: `What ten is just above ${lower}?`,
        hint: "The next ten up is always 10 more.",
        explain: `${upper} is the next ten after ${lower}.`,
        answer: upper,
      },
      {
        kind: "number",
        prompt: isMid
          ? `${n} is exactly halfway between ${lower} and ${upper}. By the rounding rule, which way do we round?`
          : `Which of ${lower} or ${upper} is ${n} actually closer to?`,
        hint: isMid
          ? "A number exactly in the middle doesn't lean closer to either side — the rule says round UP when that happens."
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

export const roundingNearestTen: Unit = {
  id: "roundingNearestTen",
  title: "Rounding to the Nearest Ten",
  goal: "Round any whole number to the nearest ten and explain why, using a number line to see which ten it's closer to.",
  standard: "3.NBT.1",
  keyIdea: (
    <>
      <p>Every number sits between two tens on the number line. Rounding means deciding which of those two tens it's actually closer to.</p>
      <p>When a number sits exactly halfway between two tens (it ends in 5), there's no "closer" side — by the rounding rule, it always rounds UP.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Round to the Nearest Ten", make: makeRoundTenProblem, buckets: [...TEN_BUCKETS] }],
  requiredBuckets: [...TEN_BUCKETS],
  test: roundingNearestTenTest,
};
