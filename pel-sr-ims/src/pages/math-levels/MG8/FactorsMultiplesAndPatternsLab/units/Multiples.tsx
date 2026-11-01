import { useState } from "react";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { HundredGrid } from "../diagrams";
import { distanceToMultiple } from "../lib/numberTheory";
import { CfuToggle, FixedCheck, type CfuQuestion } from "./cfu";
import { multiplesTest } from "./MultiplesTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Factor and multiple are the plan's named conflation, so 3 of 4 questions
 * put BOTH words in the same question: Q1 is the plan's exact "6 is a ___ of
 * 24, 24 is a ___ of 6"; Q2 is the near-miss "is 56 a multiple of 6?" with
 * the remainder typed (division, not eyeballing); Q3 contrasts how MANY
 * factors vs multiples a number has (a short list vs never-ending); Q4 is a
 * two-part true/false generalization (multiples of 5 end in 0/5 — true;
 * multiples of 3 are odd — false, counterexample 6).
 */
const CHECK: CfuQuestion[] = [
  {
    kind: "blanks",
    parts: ["6 is a ", " of 24, and 24 is a ", " of 6."],
    blanks: [
      { kind: "select", choices: ["factor", "multiple"], correct: "factor" },
      { kind: "select", choices: ["factor", "multiple"], correct: "multiple" },
    ],
    right: "Right — 6 divides INTO 24 (factor), and you reach 24 by multiplying 6 UP: 6 × 4 (multiple).",
    wrong: "Not quite — a factor divides INTO a number. A multiple is what you get by multiplying UP. Which way does 6 go to get to 24?",
  },
  {
    kind: "blanks",
    prompt: "Is 56 a multiple of 6?",
    parts: ["56 ÷ 6 = 9 with ", " left over, so 56 ", " a multiple of 6."],
    blanks: [
      { kind: "number", answer: 2 },
      { kind: "select", choices: ["is", "is not"], correct: "is not" },
    ],
    right: "Right — 6 × 9 = 54, and 56 is 2 more. Close to a multiple isn't the same as being one.",
    wrong: "Not quite — 6 × 9 = 54. How far is 54 from 56? If anything is left over, it isn't a multiple.",
  },
  {
    kind: "blanks",
    parts: ["7 has ", " factors, but ", " multiples."],
    blanks: [
      { kind: "select", choices: ["only 2", "never-ending", "exactly 7"], correct: "only 2" },
      { kind: "select", choices: ["only 2", "never-ending", "exactly 7"], correct: "never-ending" },
    ],
    right: "Right — 7's factors are just 1 and 7. Its multiples (7, 14, 21, 28, ...) go on forever.",
    wrong: "Not quite — list the factors of 7 (what divides into 7?). Then list multiples: 7, 14, 21, ... do they ever stop?",
  },
  {
    kind: "blanks",
    parts: ["“Every multiple of 5 ends in 0 or 5” is ", ". “Every multiple of 3 is odd” is ", "."],
    blanks: [
      { kind: "select", choices: ["true", "false"], correct: "true" },
      { kind: "select", choices: ["true", "false"], correct: "false" },
    ],
    right: "Right — 5, 10, 15, 20 ... always end in 5 or 0. But 3 × 2 = 6 is even, so not every multiple of 3 is odd.",
    wrong: "Not quite — list a few of each: 5, 10, 15, 20, 25 ... and 3, 6, 9, 12 ... Is 6 odd?",
  },
];

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [k, setK] = useState(6);
  const [n, setN] = useState(56);
  const [shade, setShade] = useState(true);
  const q = Math.floor(n / k);
  const r = n % k;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
      {(introActive || showCheck) && <FixedCheck title="Check for Understanding: factors vs. multiples" questions={CHECK} onComplete={onIntroDone} />}

      <div className="control-row">
        <Stepper label="Multiples of" value={k} min={2} max={10} onChange={setK} tone="a" />
        <Stepper label="Is this a multiple?" value={n} min={1} max={100} onChange={setN} tone="b" />
        <button type="button" className={`btn ghost ${shade ? "pressed" : ""}`} onClick={() => setShade((v) => !v)}>
          {shade ? "Hide multiples" : "Show multiples"}
        </button>
      </div>
      <p className="muted small">Tip: click any number on the chart to ask about it.</p>
      <HundredGrid multiplesOf={shade ? k : undefined} target={n} onCellClick={setN} />
      <p className="says">
        {n} ÷ {k} = {q}
        {r > 0 ? ` with ${r} left over` : " with nothing left over"}.{" "}
        {r === 0 ? (
          <>
            So <b>{n} is a multiple of {k}</b> ({k} × {q} = {n}), and <b>{k} is a factor of {n}</b>.
          </>
        ) : (
          <>
            So <b>{n} is NOT a multiple of {k}</b>. The closest multiples are {k * q} and {k * (q + 1)}
            {distanceToMultiple(n, k) <= 2 ? " — close, but close doesn't count" : ""}.
          </>
        )}
      </p>
      {k >= 7 && k <= 9 && <p className="muted small">The {k}s don't line up in neat columns like 2, 5, and 10 do — that's why they're harder to remember. Dividing always works.</p>}
    </div>
  );
}

// ============================================================================
// PRACTICE — one type, four buckets
// ============================================================================

type MultBucket = "clearYes" | "clearNo" | "nearMiss" | "hardK";
const BUCKETS: MultBucket[] = ["clearYes", "clearNo", "nearMiss", "hardK"];

function drawCase(bucket: MultBucket): { k: number; n: number } {
  for (;;) {
    if (bucket === "clearYes") {
      const k = pick([2, 3, 4, 5, 6, 10]);
      return { k, n: k * randInt(2, Math.floor(100 / k)) };
    }
    if (bucket === "hardK") {
      const k = pick([7, 8, 9]);
      if (Math.random() < 0.5) return { k, n: k * randInt(2, Math.floor(100 / k)) };
      const n = randInt(k + 1, 100);
      const d = distanceToMultiple(n, k);
      if (d === 1 || d === 2) return { k, n };
      continue;
    }
    const k = bucket === "clearNo" ? pick([6, 10]) : pick([3, 4, 6]);
    const n = randInt(k + 1, 100);
    const d = distanceToMultiple(n, k);
    if (bucket === "clearNo" ? d >= 3 : d === 1 || d === 2) return { k, n };
  }
}

function multipleProblem(target?: string): Problem {
  const bucket: MultBucket = BUCKETS.includes(target as MultBucket) ? (target as MultBucket) : pick(BUCKETS);
  const { k, n } = drawCase(bucket);
  const q = Math.floor(n / k);
  const r = n % k;
  const yes = r === 0;
  const closest = Math.abs(n - k * q) <= Math.abs(k * (q + 1) - n) ? k * q : k * (q + 1);

  return {
    title: "Is it a multiple?",
    bucket,
    story: (
      <>
        Is <b>{n}</b> a multiple of <b>{k}</b>? Don't guess — divide and check what's left over.
      </>
    ),
    visual: (done) => <HundredGrid multiplesOf={done >= 1 ? k : undefined} target={n} width={340} />,
    steps: [
      {
        kind: "ratio",
        prompt: `Divide: ${n} ÷ ${k}. How many groups of ${k}, and how many left over?`,
        hint: `Skip-count by ${k}: what's the biggest multiple of ${k} that is ${n} or less?`,
        explain: `${k} × ${q} = ${k * q}, and ${n} − ${k * q} = ${r}. So ${n} ÷ ${k} = ${q} with ${r} left over.`,
        answer: [q, r],
        labels: ["groups", "left over"],
        frame: [`${n} ÷ ${k} =`, "R", ""],
        tones: "none",
        equivalentHint: `Check again: how many whole groups of ${k} fit into ${n}, and what's left?`,
      },
      choice(
        { prompt: `So, is ${n} a multiple of ${k}?`, hint: "A multiple has NOTHING left over.", explain: yes ? `Yes — ${k} × ${q} = ${n} exactly.` : `No — there are ${r} left over.` },
        yes ? `Yes — ${k} × ${q} = ${n}, nothing left over` : `No — ${r} left over means it's not a multiple`,
        yes
          ? [
              `No — ${n} isn't in the ${k}s times table`, // MISCONCEPTION: multiples stop at 10 × k
              n % 10 !== k % 10 ? `No — ${n} doesn't end in ${k % 10}` : `No — ${n} is too big`, // MISCONCEPTION: last digit decides
            ]
          : [
              `Yes — ${n} is close to ${closest}`, // MISCONCEPTION: close enough
              "Yes — it's a whole number, so it works", // MISCONCEPTION: any whole number is a multiple
            ]
      ),
      yes
        ? choice(
            { prompt: "So which of these is ALSO true?", hint: "A factor divides INTO a number. A multiple is what you reach by multiplying UP.", explain: `${n} is a multiple of ${k}, so ${k} is a factor of ${n}.` },
            `${k} is a factor of ${n}`,
            [
              `${n} is a factor of ${k}`, // MISCONCEPTION: factor/multiple swapped
              `${k} is a multiple of ${n}`, // MISCONCEPTION: factor/multiple swapped
            ]
          )
        : {
            kind: "number",
            prompt: `What is the next multiple of ${k} after ${n}?`,
            hint: `${k} × ${q} = ${k * q}. Add one more ${k}.`,
            explain: `${k} × ${q + 1} = ${k * (q + 1)}.`,
            answer: k * (q + 1),
          },
    ],
    wrapUp: yes ? `${n} ÷ ${k} = ${q} with nothing left over: ${n} is a multiple of ${k}, and ${k} is a factor of ${n}.` : `${n} ÷ ${k} = ${q} R ${r}: ${n} is not a multiple of ${k}. The next one is ${k * (q + 1)}.`,
  };
}

function Preview() {
  return <HundredGrid multiplesOf={7} target={56} width={260} />;
}

export const multiplesUnit: Unit = {
  id: "multiples",
  title: "Multiples: Is It a Multiple Of...?",
  goal: "Find multiples of a number, and decide whether a number from 1 to 100 is a multiple of a one-digit number.",
  standard: "4.OA.4",
  keyIdea: (
    <>
      <p>
        The <b>multiples</b> of 6 are 6, 12, 18, 24, ... — what you get by multiplying 6 by 1, 2, 3, 4, ... They never stop. A <b>factor</b> divides INTO a number; a <b>multiple</b> is reached by multiplying UP. 6 is a factor of 24, and 24 is a multiple of 6.
      </p>
      <p>To check if 56 is a multiple of 6, divide: 56 ÷ 6 = 9 with 2 left over. Something left over means NO — even though 56 is close to 54.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Is It a Multiple?", make: multipleProblem, buckets: [...BUCKETS] }],
  requiredBuckets: [...BUCKETS],
  test: multiplesTest,
};
