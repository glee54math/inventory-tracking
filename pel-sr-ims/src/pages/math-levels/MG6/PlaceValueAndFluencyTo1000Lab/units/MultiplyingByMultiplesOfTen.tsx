import { useEffect, useState, type CSSProperties } from "react";
import { randInt, pick } from "../../../shared/lib/math";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";
import { type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { TensGroupArray } from "../diagrams/PlaceValueBlocks";
import { multiplyMultiplesOfTenTest } from "./MultiplyingByMultiplesOfTenTest";

export const MULT10_BUCKETS = ["byTen", "easyFact", "hardFact", "reverse"] as const;
export type Mult10Bucket = (typeof MULT10_BUCKETS)[number];

/** "Easy" one-digit facts: an anchor factor of 2 or 5, or both factors 5 or under
 *  (and never a ×1, which is the byTen bucket's job). "Hard" facts: both factors
 *  6-9 — the hardest one-digit-fact band, deliberately its own bucket per the plan. */
export const isHardFact = (a: number, m: number): boolean => a >= 6 && m >= 6;
export const isEasyFact = (a: number, m: number): boolean => a >= 2 && m >= 2 && !isHardFact(a, m) && (a === 2 || a === 5 || m === 2 || m === 5 || (a <= 5 && m <= 5));

export const randEasyFact = (): [number, number] => {
  let a: number, m: number;
  do {
    a = randInt(2, 9);
    m = randInt(2, 9);
  } while (!isEasyFact(a, m));
  return [a, m];
};
export const randHardFact = (): [number, number] => [randInt(6, 9), randInt(6, 9)];

// ============================================================================
// ONE-DIGIT FACTS REFRESHER — self-contained, since Grade 3's
// MultiplicationFoundationsLab (the intended source of these facts) is being
// built concurrently elsewhere and can't be assumed finished. Reference only:
// not graded, not part of the gate.
// ============================================================================

function FactsRefresher() {
  const nums = [2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="pvf-facts">
      <p className="small muted" style={{ marginBottom: 6 }}>
        Every strategy in this unit starts from a one-digit fact. The shaded facts (both numbers 6 or more) are the hardest ones — worth an extra look.
      </p>
      <table className="pvf-facts-table">
        <thead>
          <tr>
            <th>×</th>
            {nums.map((n) => (
              <th key={n}>{n}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nums.map((r) => (
            <tr key={r}>
              <th>{r}</th>
              {nums.map((c) => (
                <td key={c} className={isHardFact(r, c) ? "hard" : ""}>
                  {r * c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * 4 fixed questions: place-value vocabulary as a 2-part dropdown (Q1), explain
 * WHY the shortcut works rather than just producing the answer (Q2 — the
 * plan's explicit requirement), the 6×50=300 vs. 6×5=30 zero-count error (Q3,
 * also named in the plan), and a generalization trap (Q4: the strategy isn't
 * limited to small/easy facts).
 */
function Mult10Gate({ onComplete }: { onComplete?: () => void }) {
  const [q1a, setQ1a] = useState("");
  const [q1b, setQ1b] = useState("");
  const [q1Checked, setQ1Checked] = useState(false);
  const q1Filled = allFilled(q1a, q1b);
  const q1Done = q1Checked && q1a === "tens" && q1b === "tens";
  const [q2, setQ2] = useState("");
  const q2Done = q2 === "place";
  const [q3, setQ3] = useState("");
  const q3Done = q3 === "300";
  const [q4, setQ4] = useState("");
  const q4Done = q4 === "false";

  const allDone = q1Done && q2Done && q3Done && q4Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  // `border` (optional) gives this one box its own green/red outline after a Check.
  const sel = (value: string, set: (v: string) => void, label: string, options: [string, string][], border?: CSSProperties, disabled?: boolean) => (
    <select className="answer" aria-label={label} value={value} onChange={(e) => set(e.target.value)} style={border} disabled={disabled}>
      <option value="" disabled>
        choose
      </option>
      {options.map(([v, t]) => (
        <option key={v} value={v}>
          {t}
        </option>
      ))}
    </select>
  );

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure you know WHY multiplying by a multiple of ten works, not just the shortcut.</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> 7 × 80 is the same as 7 × 8{" "}
          {sel(q1a, setQ1a, "first unit", [["ones", "ones"], ["tens", "tens"]], answerBorder(q1a === "tens", q1Checked), q1Done)}, which is 56{" "}
          {sel(q1b, setQ1b, "second unit", [["ones", "ones"], ["tens", "tens"]], answerBorder(q1b === "tens", q1Checked), q1Done)} — so 7 × 80 = 560.
        </p>
        <div className="control-row">
          <button className="btn primary" type="button" disabled={q1Done || !q1Filled} onClick={() => setQ1Checked(true)}>
            Check Answer
          </button>
        </div>
        {q1Checked && q1Filled && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done ? "Right — 80 is 8 tens, so 7 × 80 is 56 tens, and 56 tens is 560." : "Not quite — how many tens are in 80?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> Why does 6 × 70 = 420?{" "}
          {sel(q2, setQ2, "why 6 times 70 is 420", [
            ["zero", "Because you always just stick a zero on the end"],
            ["place", "Because 70 is 7 tens, so 6 × 70 = 6 × 7 tens = 42 tens = 420"],
            ["split", "Because you do 6 × 7 and then 6 × 0 and put them together"],
          ])}
        </p>
        {q2 && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done
              ? "Right — the \"zero on the end\" is just what 42 TENS looks like when you write it as a number."
              : "That gets the right number, but doesn't explain it. What does the 7 in 70 actually stand for?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> 6 × 5 = 30. So 6 × 50 = {sel(q3, setQ3, "6 times 50", [["30", "30"], ["300", "300"], ["3000", "3000"]])}
        </p>
        {q3 && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done
              ? "Right — 6 × 50 is 6 × 5 tens = 30 tens = 300. The fact 6 × 5 already ends in 0, and that's a different zero from the one 50 brings."
              : q3 === "30"
              ? "That's 6 × 5. But 50 is 5 TENS, so the answer is 30 tens — how much is that?"
              : "Too many zeros — 6 × 50 is 30 tens. How much is 30 tens?"}
          </p>
        )}
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>4.</b> True or False: {sel(q4, setQ4, "true or false", [["true", "True"], ["false", "False"]])} — This strategy only works with small, easy facts like 2 × 30 or 3 × 40, not with something like 8 × 90.
        </p>
        {q4 && (
          <p className={`feedback ${q4Done ? "good" : "bad"}`} role="alert">
            {q4Done ? "False — 8 × 90 = 8 × 9 tens = 72 tens = 720. It works for every one-digit fact." : "Try it: 8 × 90 is 8 × 9 tens. Does that work?"}
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
  const [showFacts, setShowFacts] = useState(false);
  const [groups, setGroups] = useState(6);
  const [tensEach, setTensEach] = useState(7);
  const product = groups * tensEach;

  const toggleStyle = (on: boolean) => ({ width: "fit-content", ...(on ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        {!introActive && (
          <button type="button" className="btn ghost" style={toggleStyle(showCheck)} onClick={() => setShowCheck((v) => !v)}>
            Quick Check
          </button>
        )}
        <button type="button" className="btn ghost" style={toggleStyle(showFacts)} onClick={() => setShowFacts((v) => !v)}>
          One-digit facts refresher
        </button>
      </div>
      {showFacts && <FactsRefresher />}
      {(introActive || showCheck) && <Mult10Gate onComplete={onIntroDone} />}
      <div className="control-row">
        <Stepper label="Groups" value={groups} min={1} max={9} onChange={setGroups} tone="a" />
        <Stepper label="Tens in each group" value={tensEach} min={1} max={9} onChange={setTensEach} tone="b" />
      </div>
      <TensGroupArray groups={groups} perGroup={tensEach} tone="a" caption={`${groups} × ${tensEach} = ${product} tens`} />
      <p className="muted small">
        {groups} × {tensEach * 10} means {groups} groups of {tensEach} tens. That's {groups} × {tensEach} = {product} tens in all, and {product} tens is {product * 10}. So{" "}
        <b>
          {groups} × {tensEach * 10} = {product * 10}
        </b>
        .
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE
// ============================================================================

function makeMult10Problem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Mult10Bucket) ?? pick(MULT10_BUCKETS);

  if (bucket === "byTen") {
    const a = randInt(2, 9);
    return {
      title: "Multiply by 10",
      bucket,
      story: `${a} × 10 = ?`,
      visual: (done: number) => <TensGroupArray groups={a} perGroup={1} tone="a" caption={done >= 1 ? `${a} tens` : undefined} />,
      steps: [
        {
          kind: "number",
          prompt: `${a} × 10 means ${a} groups of 10. How many tens is that?`,
          hint: "Count the ten-chips in the picture — one per group.",
          explain: `${a} groups of 10 is ${a} tens.`,
          answer: a,
          suffix: "tens",
        },
        {
          kind: "number",
          prompt: `So what is ${a} × 10?`,
          hint: `${a} tens is the same number as writing ${a} in the tens place, with 0 ones.`,
          explain: `${a} tens = ${a * 10}, so ${a} × 10 = ${a * 10}.`,
          answer: a * 10,
        },
      ],
      wrapUp: `${a} × 10 = ${a} tens = ${a * 10}.`,
    };
  }

  // reverse draws from both fact bands (50/50) so missing-factor work also hits the hard facts.
  const [a, m] = bucket === "hardFact" || (bucket === "reverse" && Math.random() < 0.5) ? randHardFact() : randEasyFact();
  const fact = a * m;

  if (bucket === "reverse") {
    const product = fact * 10;
    return {
      title: "Find the missing multiple of ten",
      bucket,
      story: `${a} × ___ = ${product}. The missing number is a multiple of ten.`,
      visual: (done: number) =>
        done >= 2 ? <TensGroupArray groups={a} perGroup={m} tone="a" caption={`${a} × ${m} = ${fact} tens`} /> : <p className="muted small">{product} = {fact} tens</p>,
      steps: [
        {
          kind: "number",
          prompt: `First, ${product} is how many tens?`,
          hint: `Every 10 is one ten — so ${product} is the number without its final 0, counted in tens.`,
          explain: `${product} = ${fact} tens.`,
          answer: fact,
          suffix: "tens",
        },
        {
          kind: "number",
          prompt: `${a} × ___ = ${fact}. What one-digit number goes in the blank?`,
          hint: `Which one-digit fact with ${a} makes ${fact}? Check the facts refresher in Explore if you need it.`,
          explain: `${a} × ${m} = ${fact}.`,
          answer: m,
        },
        {
          kind: "number",
          prompt: `So ${a} × ___ = ${product}. What's the missing multiple of ten?`,
          hint: `You need ${m} TENS in each group, not ${m} ones.`,
          explain: `${a} × ${m * 10} = ${a} × ${m} tens = ${fact} tens = ${product}.`,
          answer: m * 10,
        },
      ],
      wrapUp: `${a} × ${m * 10} = ${product}.`,
    };
  }

  const big = m * 10;
  return {
    title: "Multiply by a multiple of ten",
    bucket,
    story: `${a} × ${big} = ?`,
    visual: (done: number) => <TensGroupArray groups={a} perGroup={m} tone="a" caption={done >= 2 ? `${fact} tens` : `${a} groups of ${m} tens`} />,
    steps: [
      {
        kind: "number",
        prompt: `Start with the one-digit fact: ${a} × ${m} = ?`,
        hint: bucket === "hardFact" ? "This is one of the harder facts — the refresher table in Explore has it if you need to check." : `Count by ${a}s, ${m} times.`,
        explain: `${a} × ${m} = ${fact}.`,
        answer: fact,
      },
      {
        kind: "number",
        prompt: `${big} is ${m} tens. So ${a} × ${big} = ${a} × ${m} tens = how many tens?`,
        hint: `Same fact as step 1 — just counting tens instead of ones.`,
        explain: `${a} × ${m} tens = ${fact} tens.`,
        answer: fact,
        suffix: "tens",
      },
      {
        kind: "number",
        prompt: `${fact} tens is what number? So ${a} × ${big} = ?`,
        hint: `${fact} tens is ${fact} groups of ten. Watch your zeros: ${fact} is the number of tens, not the answer.`,
        explain: `${fact} tens = ${fact * 10}, so ${a} × ${big} = ${fact * 10}.`,
        answer: fact * 10,
      },
    ],
    wrapUp: `${a} × ${big} = ${a} × ${m} tens = ${fact} tens = ${fact * 10}.`,
  };
}

export const multiplyMultiplesOfTen: Unit = {
  id: "multiplyMultiplesOfTen",
  title: "Multiplying by Multiples of Ten",
  goal: "Multiply any one-digit number by a multiple of 10 (like 6 × 70) by using what you know about 6 × 7 and place value.",
  standard: "3.NBT.3",
  keyIdea: (
    <>
      <p>A multiple of ten counts tens: 70 is 7 tens. So 6 × 70 is 6 groups of 7 tens — that's 6 × 7 = 42 tens.</p>
      <p>42 tens is 420. The 0 at the end isn't magic — it's just how 42 tens looks when written as a number.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Multiples of Ten", make: makeMult10Problem, buckets: [...MULT10_BUCKETS] }],
  requiredBuckets: [...MULT10_BUCKETS],
  test: multiplyMultiplesOfTenTest,
};
