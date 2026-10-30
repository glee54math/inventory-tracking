import { useEffect, useState, type CSSProperties } from "react";
import { MultTable } from "../diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { patternsInTheTableTest } from "./PatternsInTheTableTest";

type ExploreMode = "line" | "evenOdd" | "nines" | "mirror";

// The "it just looks like it" non-explanation — the core misconception the
// plan names for this unit (treating a pattern as coincidence/magic instead
// of explaining it with a property). Used as a distractor throughout.
const LOOKS_LIKE_IT = "Because it looks like the pattern keeps going";

/** Parity explanation shared by the even/odd problem's render text and its
 *  graded "why" step, so the two can never disagree. */
function parityReason(a: number, b: number): string {
  if (a % 2 === 0) return `${a} is even, so ${a} × ${b} is always even`;
  if (b % 2 === 0) return `${b} is even, so ${a} × ${b} is always even`;
  return `Both ${a} and ${b} are odd, and odd × odd is always odd`;
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * 4 fixed questions. Q1 is the vocabulary/observation check (an even column
 * is all even); Q2 is the core misconception named in the plan — the 9s
 * pattern as "magic" instead of explained (9 = 10 − 1); Q3 ties the
 * diagonal symmetry back to Unit 2's commutative property as its
 * EXPLANATION; Q4 is the predict-and-justify generalization trap ("it looks
 * like it" is offered as a tempting non-reason).
 */
function PatternsCheck({ onComplete }: { onComplete?: () => void }) {
  const [q1, setQ1] = useState<string | null>(null);
  const q1Done = q1 === "always even";

  const Q2_RIGHT = "Each step adds 9, which is 10 − 1: the tens go up by 1 and the ones go down by 1";
  const [q2, setQ2] = useState<string | null>(null);
  const q2Done = q2 === Q2_RIGHT;

  const Q3_RIGHT = "Because 3 × 7 = 7 × 3 — the order of the factors doesn't change the product";
  const [q3, setQ3] = useState<string | null>(null);
  const q3Done = q3 === Q3_RIGHT;

  const Q4_RIGHT = "Yes — each step is one more group of 6, so it always adds 6";
  const [q4, setQ4] = useState<string | null>(null);
  const q4Done = q4 === Q4_RIGHT;

  const allDone = q1Done && q2Done && q3Done && q4Done;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  const pickStyle = (selected: boolean, correct: boolean, checked: boolean): CSSProperties => ({
    padding: "8px 14px",
    borderRadius: "var(--radius-sm)",
    border: `2px solid ${!checked || !selected ? "var(--line)" : correct ? "var(--good)" : "var(--bad)"}`,
    background: !checked || !selected ? "var(--card)" : correct ? "var(--good-soft)" : "var(--bad-soft)",
    fontWeight: 600,
    textAlign: "left",
    cursor: correct && checked ? "default" : "pointer",
  });

  const options = (opts: string[], value: string | null, set: (v: string) => void, right: string, done: boolean) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      {opts.map((opt) => (
        <button key={opt} type="button" disabled={done} style={pickStyle(value === opt, opt === right, value !== null)} onClick={() => set(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: patterns in the table always have a reason — let's make sure you can explain them.</p>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>1.</b> Every number in the 4s column (4, 8, 12, 16, ...) is ___.
        </p>
        {options(["always even", "always odd", "sometimes even, sometimes odd"], q1, setQ1, "always even", q1Done)}
        {q1 !== null && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done ? "Right — 4 is even, so any number of groups of 4 is even." : "Look at the column: 4, 8, 12, 16, 20 ... is any of them odd?"}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>2.</b> The 9s column goes 9, 18, 27, 36, 45 ... — the ones digit goes down by 1 each time. Why?
        </p>
        {options([Q2_RIGHT, "9 is just a magic number", "It's a coincidence"], q2, setQ2, Q2_RIGHT, q2Done)}
        {q2 !== null && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done ? "Right — adding 9 is the same as adding 10 and taking 1 away. No magic needed." : "Patterns always have a reason. Adding 9 is like adding 10, then taking away 1 — what does that do to the digits?"}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>3.</b> 3 × 7 and 7 × 3 are both 21, so the table looks the same on both sides of its diagonal. Why?
        </p>
        {options([Q3_RIGHT, "Because multiplying three numbers can be regrouped", "It's a coincidence for just these two"], q3, setQ3, Q3_RIGHT, q3Done)}
        {q3 !== null && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done ? "Right — that's the commutative property from Unit 2, and it works for EVERY pair, so the whole table mirrors itself." : "Think back to Unit 2: what happens when you swap the order of two factors?"}
          </p>
        )}
      </div>

      <div>
        <p>
          <b>4.</b> The 6s column goes 6, 12, 18, 24 ... Will it keep adding 6 forever, even past the edge of the table?
        </p>
        {options([Q4_RIGHT, `Yes — ${LOOKS_LIKE_IT.toLowerCase()}`, "No — patterns stop after 9 rows"], q4, setQ4, Q4_RIGHT, q4Done)}
        {q4 !== null && (
          <p className={`feedback ${q4Done ? "good" : "bad"}`} role="alert">
            {q4Done ? "Right — \"it looks like it\" isn't a reason. One more group of 6 is ALWAYS 6 more." : "Look for a reason, not just a guess: what does moving one step down the 6s column add?"}
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
  const [mode, setMode] = useState<ExploreMode>("line");
  const [line, setLine] = useState(5);
  const [parity, setParity] = useState<"even" | "odd">("even");
  const [ma, setMa] = useState(3);
  const [mb, setMb] = useState(7);

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
      {(introActive || showCheck) && <PatternsCheck onComplete={onIntroDone} />}
      <Segmented
        label="Pattern"
        value={mode}
        onChange={setMode}
        options={[
          { id: "line", label: "Skip-Counting" },
          { id: "evenOdd", label: "Even / Odd" },
          { id: "nines", label: "The 9s" },
          { id: "mirror", label: "Mirror" },
        ]}
      />

      {mode === "line" && (
        <>
          <div className="control-row">
            <Stepper label="Column" value={line} min={1} max={9} onChange={setLine} tone="a" />
          </div>
          <MultTable highlightCol={line} />
          <p className="muted small">
            The {line}s column: {Array.from({ length: 9 }, (_, i) => line * (i + 1)).join(", ")}. Each step down adds {line}, because each step is one more group of {line}.
          </p>
        </>
      )}

      {mode === "evenOdd" && (
        <>
          <Segmented label="Shade" value={parity} onChange={setParity} options={[{ id: "even", label: "Even products" }, { id: "odd", label: "Odd products" }]} />
          <MultTable parityHighlight={parity} />
          <p className="muted small">
            {parity === "even"
              ? "Every row and column with an EVEN factor (2, 4, 6, 8) is shaded all the way across: an even number of anything, or any number of groups of an even number, is even."
              : "Odd products only show up where BOTH factors are odd (1, 3, 5, 7, 9) — odd × odd is the only way to get odd."}
          </p>
        </>
      )}

      {mode === "nines" && (
        <>
          <MultTable highlightCol={9} />
          <p className="muted small">
            9, 18, 27, 36, 45, 54, 63, 72, 81: the tens digit goes up by 1 and the ones digit goes down by 1 each step, because adding 9 = adding 10 and taking away 1. The two digits always add up to 9.
          </p>
        </>
      )}

      {mode === "mirror" && (
        <>
          <div className="control-row">
            <Stepper label="Row" value={ma} min={1} max={9} onChange={setMa} tone="a" />
            <Stepper label="Column" value={mb} min={1} max={9} onChange={setMb} tone="b" />
          </div>
          <MultTable mirrorPair={[ma, mb]} />
          <p className="muted small">
            {ma} × {mb} = {ma * mb} and {mb} × {ma} = {mb * ma}: the two shaded cells are mirror images across the diagonal. That's the commutative property — it's why the whole table mirrors itself.
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — even/odd patterns
// ============================================================================

function evenOddProblem(): Problem {
  // Half the time force odd × odd so the "odd" hard edge is reliably reached,
  // not just the far-more-common even case.
  const odds = [1, 3, 5, 7, 9];
  const oddCase = Math.random() < 0.5;
  const a = oddCase ? pick(odds) : pick([2, 4, 6, 8]);
  const b = oddCase ? pick(odds) : randInt(1, 9);
  const even = (a * b) % 2 === 0;
  const reason = parityReason(a, b);
  const wrongReason = even ? "Both factors are odd, and odd × odd is always odd" : "One factor is even, so the product is always even";

  return {
    title: "Even and odd",
    bucket: "evenOdd",
    story: `Look at ${a} × ${b} in the table.`,
    visual: () => <MultTable highlightRow={a} parityHighlight={even ? "even" : "odd"} />,
    steps: [
      choice(
        { prompt: `Is ${a} × ${b} even or odd — without multiplying?`, hint: "Is either factor even?", explain: `${a} × ${b} = ${a * b}, which is ${even ? "even" : "odd"}.` },
        even ? "Even" : "Odd",
        [even ? "Odd" : "Even"]
      ),
      choice(
        { prompt: "Why?", hint: "Look at each factor: even or odd?", explain: `${reason}.` },
        reason,
        [wrongReason, LOOKS_LIKE_IT]
      ),
    ],
    wrapUp: `${a} × ${b} = ${a * b} — ${reason}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — skip-counting in one column
// ============================================================================

function skipCountingProblem(): Problem {
  const k = randInt(2, 9);
  const start = randInt(1, 5);
  const seq = [k * start, k * (start + 1), k * (start + 2)];
  const next = k * (start + 3);

  return {
    title: "Skip-counting",
    bucket: "skipCounting",
    story: `The ${k}s column goes ${seq.join(", ")}, ...`,
    visual: () => <MultTable highlightCol={k} />,
    steps: [
      { kind: "number", prompt: "How much is added each step?", hint: `${seq[1]} − ${seq[0]} = ?`, explain: `Each step adds ${k} — one more group of ${k}.`, answer: k },
      { kind: "number", prompt: "What number comes next?", hint: `${seq[2]} + ${k} = ?`, explain: `${seq[2]} + ${k} = ${next}, which is ${k} × ${start + 3}.`, answer: next },
    ],
    wrapUp: `${seq.join(", ")}, ${next}: each step is one more group of ${k}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — the 9s column
// ============================================================================

function ninesProblem(): Problem {
  const n = randInt(2, 9);
  const p = 9 * n;
  const tens = Math.floor(p / 10);
  const ones = p % 10;
  return {
    title: "The 9s pattern",
    bucket: "ninesPattern",
    story: `Look at 9 × ${n} in the 9s column.`,
    visual: () => <MultTable highlightCol={9} />,
    steps: [
      { kind: "number", prompt: `What is 9 × ${n}?`, hint: `10 × ${n} = ${10 * n}, then take away ${n}.`, explain: `9 × ${n} = ${p}.`, answer: p },
      { kind: "number", prompt: `Add the two digits of ${p}: ${tens} + ${ones} = ?`, hint: "Add the tens digit and the ones digit.", explain: `${tens} + ${ones} = 9 — true for every 9s fact from 9 × 1 to 9 × 10.`, answer: 9 },
      choice(
        { prompt: "Why does the ones digit go DOWN by 1 each step down the 9s column?", hint: "Adding 9 is the same as adding 10 and then…?", explain: "Adding 9 = adding 10, then taking 1 away: the tens digit goes up 1 and the ones digit goes down 1." },
        "Adding 9 is adding 10 and taking away 1",
        ["9 is a magic number", LOOKS_LIKE_IT]
      ),
    ],
    wrapUp: `9 × ${n} = ${p}, and ${tens} + ${ones} = 9.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — symmetry across the diagonal
// ============================================================================

function symmetryProblem(): Problem {
  const a = randInt(2, 9);
  let b = randInt(2, 9);
  while (b === a) b = randInt(2, 9);
  return {
    title: "Mirror across the diagonal",
    bucket: "diagonalSymmetry",
    story: `Find ${a} × ${b} and ${b} × ${a} in the table.`,
    visual: (done: number) => <MultTable mirrorPair={done >= 1 ? [a, b] : undefined} highlightRow={done >= 1 ? undefined : a} />,
    steps: [
      { kind: "number", prompt: `What is ${a} × ${b}?`, hint: "Multiply.", explain: `${a} × ${b} = ${a * b}.`, answer: a * b },
      { kind: "number", prompt: `What is ${b} × ${a}?`, hint: "Find the mirror cell across the diagonal.", explain: `${b} × ${a} = ${a * b}.`, answer: a * b },
      choice(
        { prompt: "Why do the two mirror cells always match?", hint: "Think back to Unit 2.", explain: "Swapping the order of two factors never changes the product (the commutative property) — so every cell matches its mirror." },
        "Because swapping the order of the factors doesn't change the product",
        ["Because you can regroup three factors", "It's a coincidence for these two numbers"]
      ),
    ],
    wrapUp: `${a} × ${b} = ${b} × ${a} = ${a * b}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 5 — explain-why generalization past the table's edge
// ============================================================================

interface WhyScenario {
  story: string;
  question: string;
  answer: string;
  wrongAnswer: string;
  reason: string;
  wrongReason: string;
  highlightCol?: number;
}

function whyScenario(): WhyScenario {
  const kind = pick(["evenRow", "oddOdd", "tens"] as const);
  if (kind === "evenRow") {
    const e = pick([2, 4, 6, 8]);
    const m = randInt(11, 19);
    return {
      story: `In the ${e}s column, every product in the table is even.`,
      question: `Will ${e} × ${m} — past the edge of the table — also be even?`,
      answer: "Yes",
      wrongAnswer: "No",
      reason: `${e} is even, so any number of groups of ${e} is even`,
      wrongReason: "The pattern only holds inside the table",
      highlightCol: e,
    };
  }
  if (kind === "oddOdd") {
    const a = pick([3, 5, 7, 9]);
    const m = pick([11, 13, 15, 17, 19]);
    return {
      story: `In the table, ${a} × 1, ${a} × 3, ${a} × 5 ... are all odd.`,
      question: `Will ${a} × ${m} be odd?`,
      answer: "Yes",
      wrongAnswer: "No",
      reason: "Both factors are odd, and odd × odd is always odd",
      wrongReason: "Big products are always even",
      highlightCol: a,
    };
  }
  const m = randInt(11, 19);
  return {
    story: "Every product in the 10s pattern (10, 20, 30, ...) ends in 0.",
    question: `Will 10 × ${m} end in 0?`,
    answer: "Yes",
    wrongAnswer: "No",
    reason: `10 × ${m} is ${m} tens, and a number of tens always ends in 0`,
    wrongReason: "Only products up to 90 end in 0",
  };
}

function explainWhyProblem(): Problem {
  const s = whyScenario();
  return {
    title: "Will the pattern continue?",
    bucket: "explainWhy",
    story: s.story,
    visual: () => <MultTable highlightCol={s.highlightCol} />,
    steps: [
      choice({ prompt: s.question, hint: "Think about WHY the pattern happens, not just what it looks like.", explain: `${s.answer} — ${s.reason}.` }, s.answer, [s.wrongAnswer]),
      choice({ prompt: "Which is the best reason?", hint: "A good reason uses what the factors are, not just how the pattern looks.", explain: `${s.reason}.` }, s.reason, [LOOKS_LIKE_IT, s.wrongReason]),
    ],
    wrapUp: `${s.answer} — ${s.reason}. A pattern you can explain with a property will always continue.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <MultTable max={6} mirrorPair={[2, 5]} />;
}

export const patternsInTheTable: Unit = {
  id: "patternsInTheTable",
  title: "Patterns in the Multiplication Table",
  goal: "Spot and explain patterns in the multiplication table, like why every column for an even number is all even, or why the 9s column counts down by one in the ones place.",
  standard: "3.OA.9",
  keyIdea: (
    <>
      <p>Patterns in the table always have a reason. An even factor makes the product even. Each step down a column adds one more group. 9 = 10 − 1 explains the 9s.</p>
      <p>The table mirrors itself across the diagonal because a × b = b × a. A pattern you can explain with a property keeps going forever — past the edge of the table.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [
    { label: "Even / Odd", make: evenOddProblem },
    { label: "Skip-Counting", make: skipCountingProblem },
    { label: "The 9s", make: ninesProblem },
    { label: "Mirror", make: symmetryProblem },
    { label: "Explain Why", make: explainWhyProblem },
  ],
  requiredBuckets: ["evenOdd", "skipCounting", "ninesPattern", "diagonalSymmetry", "explainWhy"],
  test: patternsInTheTableTest,
};
