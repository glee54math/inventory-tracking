import { useEffect, useState, type CSSProperties } from "react";
import { EqualGroups } from "../diagrams";
import { FactorRectangle } from "../../../shared/diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { multiplicationWordProblemsTest } from "./MultiplicationWordProblemsTest";

// Named kids + nouns for story text — kept small and generic (not tied to
// WordProblemData.ts's older template pipeline, which is a different,
// unrelated architecture from this lab's Unit/Problem/Step engine).
const KIDS = ["Maya", "Jo", "Diego", "Priya", "Sam", "Lena"];
const GROUP_NOUNS: [string, string][] = [
  ["bags", "apples"],
  ["boxes", "crayons"],
  ["baskets", "eggs"],
  ["shelves", "books"],
  ["tables", "chairs"],
];
const MEASURE_UNITS: [string, string][] = [
  ["jump rope", "feet"],
  ["ribbon", "inches"],
  ["garden hose", "feet"],
  ["board", "inches"],
];

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * 4 fixed (non-randomized) questions. Q1 is the core misconception named in
 * the plan — defaulting to addition because "equal groups" sounds additive.
 * Q2 drills picking the wrong factor as "number of groups" from wording.
 * Q3 is the measurement-quantity variant (same structure, easy to miss that
 * it's still multiplication). Q4 is the informal multiplicative-compare
 * phrasing ("times as many").
 */
function WordProblemsCheck({ onComplete }: { onComplete?: () => void }) {
  const [q1, setQ1] = useState<string | null>(null);
  const q1Done = q1 === "4 × 6";

  const [q2, setQ2] = useState<number | null>(null);
  const q2Done = q2 === 5;

  const [q3, setQ3] = useState<string | null>(null);
  const q3Done = q3 === "3 × 7";

  const [q4, setQ4] = useState<string | null>(null);
  const q4Done = q4 === "4 × 3";

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
    cursor: correct && checked ? "default" : "pointer",
  });

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure you can spot multiplication inside a word problem before you try practice problems.</p>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>1.</b> A farmer has 4 rows of corn, with 6 plants in each row. Which equation finds the total number of plants?
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["4 × 6", "4 + 6", "6 − 4"].map((opt) => (
            <button key={opt} type="button" disabled={q1Done} style={pickStyle(q1 === opt, opt === "4 × 6", q1 !== null)} onClick={() => setQ1(opt)}>
              {opt}
            </button>
          ))}
        </div>
        {q1 !== null && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done
              ? "Right — equal groups (4 rows of 6) means multiply, even though the word \"groups\" can sound like it might mean adding them up."
              : "It's tempting to add the two numbers, but \"4 rows of 6\" is 4 equal groups, each with 6 — that calls for multiplication."}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>2.</b> A store has 5 shelves, with 9 toys on each shelf. Which number is the "number of groups"?
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {[5, 9].map((n) => (
            <button key={n} type="button" disabled={q2Done} style={pickStyle(q2 === n, n === 5, q2 !== null)} onClick={() => setQ2(n)}>
              {n}
            </button>
          ))}
        </div>
        {q2 !== null && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done ? "Right — 5 shelves is the number of groups; 9 toys is the size of each group." : 'The number of "groups" is the one right before the word "shelves," not the one describing what\'s ON them.'}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>3.</b> Each jump rope is 3 feet long. How many feet of rope are needed for 7 jump ropes? Which equation finds the answer?
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["3 × 7", "3 + 7", "7 − 3"].map((opt) => (
            <button key={opt} type="button" disabled={q3Done} style={pickStyle(q3 === opt, opt === "3 × 7", q3 !== null)} onClick={() => setQ3(opt)}>
              {opt}
            </button>
          ))}
        </div>
        {q3 !== null && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done
              ? "Right — measuring 7 equal lengths of 3 feet each is still equal groups, just measured in feet instead of counted in objects."
              : "This is still equal groups — 7 ropes, each the same length — just measured in feet instead of counted as separate objects."}
          </p>
        )}
      </div>

      <div>
        <p>
          <b>4.</b> Maya has 3 stickers. Jo has 4 times as many as Maya. Which equation finds how many stickers Jo has?
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["4 × 3", "4 + 3", "4 − 3"].map((opt) => (
            <button key={opt} type="button" disabled={q4Done} style={pickStyle(q4 === opt, opt === "4 × 3", q4 !== null)} onClick={() => setQ4(opt)}>
              {opt}
            </button>
          ))}
        </div>
        {q4 !== null && (
          <p className={`feedback ${q4Done ? "good" : "bad"}`} role="alert">
            {q4Done
              ? "Right — \"4 times as many\" means 4 equal groups the size of Maya's amount: 4 × 3."
              : '"Times as many" is a multiplication clue, not an addition or subtraction one.'}
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
      {(introActive || showCheck) && <WordProblemsCheck onComplete={onIntroDone} />}
      <p>Word problems hide multiplication inside everyday language. Four kinds show up again and again:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p>
          <b>Equal groups:</b> "4 bags with 6 apples each" — <EqualGroups groups={4} size={6} tone="a" showTotal />
        </p>
        <p>
          <b>Arrays / area:</b> "a garden with 5 rows of 8 plants" — <FactorRectangle rows={5} cols={8} />
        </p>
        <p>
          <b>Measurement:</b> "each jump rope is 3 feet; how much rope for 7 ropes?" — same shape as equal groups, just measured in feet.
        </p>
        <p>
          <b>Multiplicative compare:</b> "Jo has 4 times as many stickers as Maya, who has 3" — <EqualGroups groups={4} size={3} tone="c" showTotal />
        </p>
      </div>
      <p className="muted small">
        In every case, look for the "groups" word (rows, bags, times as many, each) and the "size" word (plants per row, apples per bag, how many Maya has) — then multiply.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — equal groups
// ============================================================================

function equalGroupsWordProblem(): Problem {
  const name = pick(KIDS);
  const [groupNoun, itemNoun] = pick(GROUP_NOUNS);
  const groups = randInt(3, 9);
  const size = randInt(3, 9);
  const total = groups * size;

  return {
    title: "Equal groups word problem",
    bucket: "equalGroups",
    story: `${name} has ${groups} ${groupNoun}, with ${size} ${itemNoun} in each. How many ${itemNoun} does ${name} have in all?`,
    visual: (done: number) => <EqualGroups groups={groups} size={size} tone="a" revealGroups={done >= 1 ? groups : 0} showTotal />,
    steps: [
      choice(
        {
          prompt: "Which equation finds the total?",
          hint: `${groups} equal groups of ${size} each — multiply.`,
          explain: `${groups} ${groupNoun} of ${size} ${itemNoun} each is ${groups} × ${size}, not addition.`,
        },
        `${groups} × ${size}`,
        [`${groups} + ${size}`, `${size} − ${groups}`]
      ),
      {
        kind: "number",
        prompt: `How many ${itemNoun} in all?`,
        hint: `${groups} × ${size} = ?`,
        explain: `${groups} × ${size} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: `${name} has ${groups} × ${size} = ${total} ${itemNoun}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — arrays / area
// ============================================================================

function arrayWordProblem(): Problem {
  const rows = randInt(3, 9);
  const cols = randInt(3, 9);
  const total = rows * cols;
  const scene = pick([
    { place: "garden", rowWord: "rows", itemWord: "plants" },
    { place: "theater", rowWord: "rows", itemWord: "seats" },
    { place: "parking lot", rowWord: "rows", itemWord: "parking spaces" },
  ]);

  return {
    title: "Array / area word problem",
    bucket: "arraysArea",
    story: `A ${scene.place} has ${rows} ${scene.rowWord} of ${scene.itemWord}, with ${cols} in each row. How many ${scene.itemWord} are there in all?`,
    visual: () => <FactorRectangle rows={rows} cols={cols} />,
    steps: [
      choice(
        {
          prompt: "Which equation finds the total?",
          hint: `${rows} rows, ${cols} in each row — multiply.`,
          explain: `${rows} rows of ${cols} is ${rows} × ${cols}.`,
        },
        `${rows} × ${cols}`,
        [`${rows} + ${cols}`, `${cols} − ${rows}`]
      ),
      {
        kind: "number",
        prompt: `How many ${scene.itemWord} in all?`,
        hint: `${rows} × ${cols} = ?`,
        explain: `${rows} × ${cols} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: `The ${scene.place} has ${rows} × ${cols} = ${total} ${scene.itemWord}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — measurement quantities
// ============================================================================

function measurementWordProblem(): Problem {
  const [item, unit] = pick(MEASURE_UNITS);
  const length = randInt(2, 9);
  const count = randInt(3, 9);
  const total = length * count;

  return {
    title: "Measurement word problem",
    bucket: "measurement",
    story: `Each ${item} is ${length} ${unit} long. How many ${unit} of material are needed to make ${count} of them?`,
    visual: (done: number) => <EqualGroups groups={count} size={length} tone="b" revealGroups={done >= 1 ? count : 0} showTotal />,
    steps: [
      choice(
        {
          prompt: "Which equation finds the total length?",
          hint: `${count} equal lengths of ${length} ${unit} each — multiply.`,
          explain: `${count} items of ${length} ${unit} each is ${count} × ${length}, the same structure as equal groups, just measured instead of counted.`,
        },
        `${count} × ${length}`,
        [`${count} + ${length}`, `${length} − ${count}`]
      ),
      {
        kind: "number",
        prompt: `How many ${unit} in all?`,
        hint: `${count} × ${length} = ?`,
        explain: `${count} × ${length} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: `${count} × ${length} = ${total} ${unit}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — multiplicative compare (informal "times as many")
// ============================================================================

function compareWordProblem(): Problem {
  const [name1, name2] = (() => {
    const a = pick(KIDS);
    let b = pick(KIDS);
    while (b === a) b = pick(KIDS);
    return [a, b];
  })();
  const [, itemNoun] = pick(GROUP_NOUNS);
  const base = randInt(2, 6);
  const times = randInt(2, 6);
  const total = base * times;

  return {
    title: "Multiplicative compare",
    bucket: "multiplicativeCompare",
    story: `${name1} has ${base} ${itemNoun}. ${name2} has ${times} times as many ${itemNoun} as ${name1}. How many ${itemNoun} does ${name2} have?`,
    visual: (done: number) => <EqualGroups groups={times} size={base} tone="c" revealGroups={done >= 1 ? times : 0} showTotal />,
    steps: [
      choice(
        {
          prompt: `Which equation finds how many ${itemNoun} ${name2} has?`,
          hint: `"${times} times as many" means ${times} equal groups the size of ${name1}'s amount.`,
          explain: `"${times} times as many as ${base}" is ${times} × ${base}, not addition or subtraction.`,
        },
        `${times} × ${base}`,
        [`${times} + ${base}`, `${times} − ${base}`]
      ),
      {
        kind: "number",
        prompt: `How many ${itemNoun} does ${name2} have?`,
        hint: `${times} × ${base} = ?`,
        explain: `${times} × ${base} = ${total}.`,
        answer: total,
      },
    ],
    wrapUp: `${name2} has ${times} × ${base} = ${total} ${itemNoun}.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <EqualGroups groups={4} size={3} tone="c" showTotal />;
}

export const multiplicationWordProblems: Unit = {
  id: "multiplicationWordProblems",
  title: "Multiplication Word Problems",
  goal: "Read a word problem about equal groups, arrays, measurement quantities, or comparing amounts, and write and solve the multiplication equation it describes.",
  standard: "3.OA.3",
  keyIdea: (
    <>
      <p>Look for a "groups" clue (rows, bags, each, times as many) and a "size" clue — then multiply, even when the wording doesn't say "multiply."</p>
      <p>Measurement problems ("3 feet each, for 7 ropes") and compare problems ("4 times as many") use the same equal-groups structure as counting objects.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [
    { label: "Equal Groups", make: equalGroupsWordProblem },
    { label: "Arrays / Area", make: arrayWordProblem },
    { label: "Measurement", make: measurementWordProblem },
    { label: "Compare", make: compareWordProblem },
  ],
  requiredBuckets: ["equalGroups", "arraysArea", "measurement", "multiplicativeCompare"],
  test: multiplicationWordProblemsTest,
};
