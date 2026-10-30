import { useEffect, useState, type CSSProperties } from "react";
import { EqualGroups } from "../diagrams";
import { FactorRectangle } from "../../../shared/diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { whatMultiplicationMeansTest } from "./WhatMultiplicationMeansTest";

type Mode = "groups" | "array";

// Shared noun pairs for scenario text — group-noun first, item-noun second
// (e.g. "4 baskets, with 6 apples in each"). Duplicated verbatim in the
// paired *Test.tsx file rather than imported, per this app's convention
// that a unit file and its Test file never import from each other (a
// circular import threw a real "Level not found" bug once — see
// MATH_TSX_STYLE_GUIDE.txt / VISUAL_COMPONENT_TODO.txt's MG2 entry).
const NOUN_PAIRS: [string, string][] = [
  ["boxes", "toys"],
  ["bags", "marbles"],
  ["shelves", "books"],
  ["jars", "buttons"],
  ["baskets", "apples"],
  ["crates", "oranges"],
];

/** Two distinct 2-9 integers — several of this unit's pictures depend on the
 *  two factors being visually different sizes, or the "swap them" question
 *  would be trivially the same picture both ways. */
function distinctFactors(): [number, number] {
  const a = randInt(2, 9);
  let b = randInt(2, 9);
  while (b === a) b = randInt(2, 9);
  return [a, b];
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * 4 fixed (non-randomized) questions — every student sees the same ones.
 * Q1 + Q2 are the "commonly-conflated-concept" pair the plan calls out
 * (3×4 vs 4×3 look different even though the total is the same; rows vs.
 * columns in an array); Q3 is the true/false generalization trap; Q4 is
 * the vocabulary check (what each number in "groups of" language names).
 * Generalizes MK1/MK4's "embed two renderings directly in a prompt, use
 * positional labels as the choices" technique from mirrored text/images to
 * full EqualGroups diagrams.
 */
function WhatMultiplicationMeansCheck({ onComplete }: { onComplete?: () => void }) {
  const [swapped] = useState(() => Math.random() < 0.5);
  const leftIsCorrect = !swapped; // "Picture A" (left) = 3 groups of 4 when not swapped
  const [q1, setQ1] = useState<"A" | "B" | null>(null);
  const q1Done = q1 !== null && q1 === (leftIsCorrect ? "A" : "B");

  const [q2, setQ2] = useState<number | null>(null);
  const q2Done = q2 === 5;

  const [q3, setQ3] = useState<"true" | "false" | null>(null);
  const q3Done = q3 === "false";

  const Q4_RIGHT = "how many are in each group";
  const [q4Options] = useState(() => {
    const opts = [Q4_RIGHT, "how many groups there are", "the total number of items"];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  });
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
    cursor: correct && checked ? "default" : "pointer",
  });

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure "3 × 4" and "4 × 3" are clear before you try practice problems.</p>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>1.</b> Which picture shows <b>3 groups of 4</b>?
        </p>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <EqualGroups groups={leftIsCorrect ? 3 : 4} size={leftIsCorrect ? 4 : 3} tone="a" hideCaption />
            <button type="button" disabled={q1Done} style={pickStyle(q1 === "A", leftIsCorrect, q1 !== null)} onClick={() => setQ1("A")}>
              Picture A
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <EqualGroups groups={leftIsCorrect ? 4 : 3} size={leftIsCorrect ? 3 : 4} tone="b" hideCaption />
            <button type="button" disabled={q1Done} style={pickStyle(q1 === "B", !leftIsCorrect, q1 !== null)} onClick={() => setQ1("B")}>
              Picture B
            </button>
          </div>
        </div>
        {q1 !== null && (
          <p className={`feedback ${q1Done ? "good" : "bad"}`} role="alert">
            {q1Done ? "Right — 3 groups of 4 means 3 separate groups, each holding 4." : "Not quite — count how many SEPARATE groups there are, then how many are in each one."}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>2.</b> A garden has 5 rows of plants, with 8 plants in each row. Which number is the number of rows?
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {[5, 8].map((n) => (
            <button key={n} type="button" disabled={q2Done} style={pickStyle(q2 === n, n === 5, q2 !== null)} onClick={() => setQ2(n)}>
              {n}
            </button>
          ))}
        </div>
        {q2 !== null && (
          <p className={`feedback ${q2Done ? "good" : "bad"}`} role="alert">
            {q2Done ? 'Right — 5 rows, with 8 plants in each row.' : 'Not quite — "rows" is the first number named in "5 rows of 8."'}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p>
          <b>3.</b> True or False: since 3 × 4 and 4 × 3 both equal 12, they always draw the exact same picture.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {(["true", "false"] as const).map((v) => (
            <button key={v} type="button" disabled={q3Done} style={pickStyle(q3 === v, v === "false", q3 !== null)} onClick={() => setQ3(v)}>
              {v === "true" ? "True" : "False"}
            </button>
          ))}
        </div>
        {q3 !== null && (
          <p className={`feedback ${q3Done ? "good" : "bad"}`} role="alert">
            {q3Done
              ? "False — same TOTAL, but 3 groups of 4 and 4 groups of 3 are different pictures (compare Question 1!)."
              : "Think back to Question 1 — were Picture A and Picture B the same picture?"}
          </p>
        )}
      </div>

      <div>
        <p>
          <b>4.</b> In "3 groups of 4," what does the <b>4</b> tell you?
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {q4Options.map((opt) => (
            <button key={opt} type="button" disabled={q4Done} style={pickStyle(q4 === opt, opt === Q4_RIGHT, q4 !== null)} onClick={() => setQ4(opt)}>
              {opt}
            </button>
          ))}
        </div>
        {q4 !== null && (
          <p className={`feedback ${q4Done ? "good" : "bad"}`} role="alert">
            {q4Done ? "Right — the second number is the size of each group." : 'Not quite — look at which number is "groups" and which is "of."'}
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
  const [mode, setMode] = useState<Mode>("groups");
  const [groups, setGroups] = useState(3);
  const [size, setSize] = useState(4);
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(6);
  const total = mode === "groups" ? groups * size : rows * cols;

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
      {(introActive || showCheck) && <WhatMultiplicationMeansCheck onComplete={onIntroDone} />}
      <Segmented label="Picture" value={mode} onChange={setMode} options={[{ id: "groups", label: "Equal Groups" }, { id: "array", label: "Array" }]} />
      {mode === "groups" ? (
        <>
          <div className="control-row">
            <Stepper label="Number of groups" value={groups} min={1} max={9} onChange={setGroups} tone="a" />
            <Stepper label="Size of each group" value={size} min={1} max={9} onChange={setSize} tone="b" />
          </div>
          <EqualGroups groups={groups} size={size} tone="a" showTotal />
          <p className="muted small">
            {groups} groups of {size} = {groups} × {size} = {total}. The first factor ({groups}) is how many groups; the second ({size}) is how many are in EACH group.
          </p>
        </>
      ) : (
        <>
          <div className="control-row">
            <Stepper label="Rows" value={rows} min={1} max={9} onChange={setRows} tone="a" />
            <Stepper label="Columns" value={cols} min={1} max={9} onChange={setCols} tone="b" />
          </div>
          <FactorRectangle rows={rows} cols={cols} />
          <p className="muted small">
            {rows} rows of {cols} columns = {rows} × {cols} = {total}. Try changing rows and columns to the same two numbers swapped — the picture turns 90°, but the total stays the same.
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — equal groups, unknown product
// ============================================================================

function equalGroupsProblem(): Problem {
  const [groups, size] = distinctFactors();
  const total = groups * size;
  return {
    title: "Equal groups",
    bucket: "equalGroups",
    story: `There are ${groups} groups, with ${size} items in each group.`,
    visual: (done: number) => <EqualGroups groups={groups} size={size} tone="a" revealGroups={done >= 1 ? groups : 0} showTotal />,
    steps: [
      {
        kind: "number",
        prompt: "How many items are there in all?",
        hint: `${groups} groups of ${size} — count every dot, or multiply.`,
        explain: `${groups} × ${size} = ${total}.`,
        answer: total,
      },
      choice(
        {
          prompt: `Which number in "${groups} × ${size}" tells you the SIZE of each group?`,
          hint: `"${groups} groups OF ${size}" — which number comes right after "of"?`,
          explain: `${size} is the size of each group; ${groups} is how many groups there are.`,
        },
        String(size),
        [String(groups)]
      ),
    ],
    wrapUp: `${groups} groups of ${size} = ${total}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — arrays / area, unknown product
// ============================================================================

function arrayProblem(): Problem {
  const [rows, cols] = distinctFactors();
  const total = rows * cols;
  return {
    title: "Arrays",
    bucket: "array",
    story: `An array has ${rows} rows and ${cols} columns.`,
    visual: () => <FactorRectangle rows={rows} cols={cols} />,
    steps: [
      {
        kind: "number",
        prompt: "How many items are in this array?",
        hint: `${rows} rows, each with ${cols} — multiply.`,
        explain: `${rows} × ${cols} = ${total}.`,
        answer: total,
      },
      choice(
        {
          prompt: "Which number is the number of ROWS?",
          hint: `Rows go across the array; this one has ${rows} of them.`,
          explain: `${rows} is the number of rows; ${cols} is the number of columns.`,
        },
        String(rows),
        [String(cols)]
      ),
    ],
    wrapUp: `${rows} rows × ${cols} columns = ${total}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — reverse direction: given product + one factor, match the picture
// ============================================================================

function reverseProblem(): Problem {
  const [groups, size] = distinctFactors();
  const total = groups * size;
  const swapped = Math.random() < 0.5;

  return {
    title: "Match the picture",
    bucket: "reverse",
    story: `${groups} plates have ${size} cookies on each plate.`,
    visual: (done: number) => (done >= 1 ? <EqualGroups groups={groups} size={size} tone="a" showTotal /> : null),
    steps: [
      {
        kind: "number",
        prompt: "How many cookies are there in all?",
        hint: `${groups} plates, ${size} cookies each.`,
        explain: `${groups} × ${size} = ${total}.`,
        answer: total,
      },
      {
        kind: "choice",
        prompt: (
          <>
            Which picture actually shows "{groups} plates of {size} cookies"?
            <div style={{ display: "flex", gap: 20, marginTop: 10, flexWrap: "wrap" }}>
              <EqualGroups groups={swapped ? size : groups} size={swapped ? groups : size} tone="b" hideCaption />
              <EqualGroups groups={swapped ? groups : size} size={swapped ? size : groups} tone="c" hideCaption />
            </div>
          </>
        ),
        hint: `Count the SEPARATE groups in each picture — which one has exactly ${groups} groups?`,
        explain: `The matching picture has ${groups} separate groups, each with ${size} — not ${size} groups of ${groups}, even though the total is the same.`,
        choices: ["Left picture", "Right picture"],
        correct: swapped ? 0 : 1,
      },
    ],
    wrapUp: `${groups} plates of ${size} cookies = ${total} cookies total — and the matching picture is the one with exactly ${groups} separate groups.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — translate: picture <-> equation, both directions
// ============================================================================

function translateProblem(): Problem {
  const [groups, size] = distinctFactors();
  const total = groups * size;
  const [groupNoun, itemNoun] = pick(NOUN_PAIRS);

  return {
    title: "Picture to equation, and back",
    bucket: "translate",
    story: `${groups} ${groupNoun}, with ${size} ${itemNoun} in each.`,
    visual: (done: number) => <EqualGroups groups={groups} size={size} tone="a" showTotal={done >= 2} />,
    steps: [
      choice(
        {
          prompt: `Which equation matches "${groups} ${groupNoun}, with ${size} ${itemNoun} in each"?`,
          hint: `Say it out loud: "${groups} ${groupNoun} OF ${size} ${itemNoun}."`,
          explain: `"${groups} ${groupNoun} of ${size} ${itemNoun}" is ${groups} × ${size}.`,
        },
        `${groups} × ${size}`,
        [`${size} × ${groups}`, `${groups} + ${size}`]
      ),
      {
        kind: "number",
        prompt: `How many ${itemNoun} are there in all?`,
        hint: `${groups} × ${size} = ?`,
        explain: `${groups} × ${size} = ${total}.`,
        answer: total,
      },
      choice(
        {
          prompt: `If someone wrote the equation "${size} × ${groups} = ${total}" instead, what would that picture show?`,
          hint: 'Flip which number is the "groups" word.',
          explain: `"${size} × ${groups}" would show ${size} ${groupNoun}, with ${groups} ${itemNoun} in each — a DIFFERENT arrangement with the same total.`,
        },
        `${size} ${groupNoun}, with ${groups} ${itemNoun} in each`,
        [`${groups} ${groupNoun}, with ${size} ${itemNoun} in each`, `one group with ${total} ${itemNoun}`]
      ),
    ],
    wrapUp: `${groups} ${groupNoun} of ${size} ${itemNoun} = ${groups} × ${size} = ${total}.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <EqualGroups groups={3} size={4} tone="a" showTotal />;
}

export const whatMultiplicationMeans: Unit = {
  id: "whatMultiplicationMeans",
  title: "What Multiplication Means",
  goal: "Look at a picture of equal groups or an array and write the multiplication fact it shows, and explain what each number in \"3 × 4\" means.",
  standard: "3.OA.1",
  keyIdea: (
    <>
      <p>"3 × 4" means 3 groups of 4 — 3 separate groups, each holding 4. "4 × 3" means 4 groups of 3: a DIFFERENT picture, even though both equal 12.</p>
      <p>In an array, the first number is rows, the second is columns. Rotating an array swaps rows and columns but keeps the same total.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [
    { label: "Equal Groups", make: equalGroupsProblem },
    { label: "Arrays", make: arrayProblem },
    { label: "Match the Picture", make: reverseProblem },
    { label: "Picture ↔ Equation", make: translateProblem },
  ],
  requiredBuckets: ["equalGroups", "array", "reverse", "translate"],
  test: whatMultiplicationMeansTest,
};
