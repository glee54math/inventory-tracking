import { useEffect, useState } from "react";
import {
  CutLineRect,
  GridPartition,
  NONCONGRUENT_TEMPLATES,
  oneStripShaded,
  regionCounts,
  rotateGrid90,
  stripRegions,
  templateToCellRegion,
  templateToSkewedCellRegion,
} from "../diagrams/AreaPartition";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Frac, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { partitioningEqualAreasTest } from "./PartitioningEqualAreasTest";

const STRIP_BS = [2, 3, 4, 6, 8];
const REVERSE_BS = [3, 4, 5, 6, 8];

function fieldStyle(ok: boolean, checked: boolean) {
  if (!checked) return {};
  return ok ? { borderColor: "var(--good)", background: "var(--good-soft)" } : { borderColor: "var(--bad)", background: "var(--bad-soft)" };
}

/** A rectangle cut into 4 visibly UNEQUAL pieces (2, 2, 2, and 6 unit
 *  squares) — the CFU's required non-example. */
const UNEQUAL_FOUR = { rows: 2, cols: 6, cellRegion: [0, 1, 2, 3, 3, 3, 0, 1, 2, 3, 3, 3] };

/** One of the hand-authored non-congruent templates, randomly rotated for
 *  visual variety. `skewed` hands one cell across so the parts are UNequal. */
function randomTemplate(skewed: boolean) {
  const t = pick(NONCONGRUENT_TEMPLATES);
  let g = { rows: t.rows, cols: t.cols, cellRegion: skewed ? templateToSkewedCellRegion(t) : templateToCellRegion(t) };
  const turns = randInt(0, 3);
  for (let i = 0; i < turns; i++) g = rotateGrid90(g.rows, g.cols, g.cellRegion);
  return g;
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1 — vocabulary: one of b equal parts is 1/b. */
function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["1/4 (one fourth)", "1/2 (one half)", "4"];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> This rectangle is cut into 4 EQUAL parts. What fraction of the whole is ONE part?
      </p>
      <GridPartition rows={2} cols={4} cellRegion={stripRegions(2, 4, 4, "v")} width={160} />
      <div className="choices" role="group">
        {options.map((o, i) => (
          <button key={i} className="choice" onClick={() => setPicked(i)} disabled={ok} style={fieldStyle(i === 0, picked === i)}>
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Right — when a whole is cut into 4 equal parts, each part is 1/4. The bottom number tells how many equal parts make the whole."
            : "Not quite — one part out of 4 equal parts is written with a 1 on top and the number of equal parts on the bottom."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the plan's required non-example: 4 visibly UNEQUAL pieces, count and
 *  equal-area judged in the SAME sentence so it can't be answered by
 *  counting alone. */
function UnequalNonExampleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [countVal, setCountVal] = useState("");
  const [sizeVal, setSizeVal] = useState("");
  const [checked, setChecked] = useState(false);
  const okCount = countVal === "4";
  const okSize = sizeVal === "not-fourths";
  const ok = okCount && okSize;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Look at this rectangle:
      </p>
      <GridPartition {...UNEQUAL_FOUR} width={210} />
      <p>
        It has{" "}
        <select className="answer" style={{ width: 70, ...fieldStyle(okCount, checked) }} value={countVal} onChange={(e) => setCountVal(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="6">6</option>
        </select>{" "}
        pieces, and{" "}
        <select className="answer" style={{ width: 330, ...fieldStyle(okSize, checked) }} value={sizeVal} onChange={(e) => setSizeVal(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="not-fourths">they're NOT equal in area, so they are NOT fourths</option>
          <option value="fourths">there are 4 of them, so each one is 1/4</option>
        </select>
        .
      </p>
      <button className="btn primary" type="button" onClick={() => setChecked(true)}>
        Check Answer
      </button>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Right — the last piece covers 6 unit squares and the others only 2. Having 4 pieces isn't enough; they must have EQUAL area to be fourths."
            : "Count the unit squares inside each piece. Do all 4 pieces cover the same amount?"}
        </p>
      )}
    </div>
  );
}

/** Q3 — equal area does NOT require the same shape. */
function DifferentShapeQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["Yes — each covers 8 unit squares, so they're equal in area.", "No — they're different shapes, so they can't be equal."];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> The blue part and the orange part are different shapes. Are they equal in area?
      </p>
      <GridPartition rows={4} cols={4} cellRegion={templateToCellRegion(NONCONGRUENT_TEMPLATES[0])} width={150} />
      <div className="choices" role="group">
        {options.map((o, i) => (
          <button key={i} className="choice" onClick={() => setPicked(i)} disabled={ok} style={fieldStyle(i === 0, picked === i)}>
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Right — area is how much space a part covers. Same number of unit squares means same area, even if the shapes are different. Each part is 1/2." : "Count the unit squares in each part before deciding. Does the shape matter, or how much it covers?"}
        </p>
      )}
    </div>
  );
}

/** Q4 — generalization trap: "N pieces means each is 1/N". */
function CountTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"true" | "false" | null>(null);
  const ok = picked === "false";
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or False: if you cut a shape into 5 pieces, each piece is always 1/5 of the whole.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        {(["true", "false"] as const).map((v) => (
          <button key={v} type="button" className="choice" disabled={ok} onClick={() => setPicked(v)} style={fieldStyle(v === "false", picked === v)}>
            {v === "true" ? "True" : "False"}
          </button>
        ))}
      </div>
      {picked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "False — each piece is 1/5 only if all 5 pieces have EQUAL area. 5 uneven pieces aren't fifths." : "Think back to question 2. Does the number of pieces alone tell you the fraction?"}
        </p>
      )}
    </div>
  );
}

function PartitioningCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ q1: false, q2: false, q3: false, q4: false });
  const allDone = done.q1 && done.q2 && done.q3 && done.q4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure "equal parts" and fractions like 1/4 make sense before you try practice problems.</p>
      <VocabQuestion onComplete={() => setDone((d) => ({ ...d, q1: true }))} />
      <UnequalNonExampleQuestion onComplete={() => setDone((d) => ({ ...d, q2: true }))} />
      <DifferentShapeQuestion onComplete={() => setDone((d) => ({ ...d, q3: true }))} />
      <CountTrapQuestion onComplete={() => setDone((d) => ({ ...d, q4: true }))} />
    </div>
  );
}

// ============================================================================
// EXPLORE — drag cut lines yourself, then compare same-shape vs
// different-shape equal parts on a unit-square grid.
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [b, setB] = useState(4);
  const [mode, setMode] = useState<"same" | "different">("same");
  const grid = mode === "same" ? { rows: 4, cols: 4, cellRegion: stripRegions(4, 4, 2, "v") } : { rows: 4, cols: 4, cellRegion: templateToCellRegion(NONCONGRUENT_TEMPLATES[0]) };
  const counts = regionCounts(grid.cellRegion);

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
      {(introActive || showCheck) && <PartitioningCheck onComplete={onIntroDone} />}
      <h3 style={{ margin: 0 }}>Cut it yourself</h3>
      <div className="control-row">
        <Stepper label="Pieces" value={b} min={2} max={6} onChange={setB} tone="a" />
      </div>
      <CutLineRect key={b} b={b} />
      <h3 style={{ margin: 0 }}>Same area, different shape?</h3>
      <Segmented
        label="Parts"
        value={mode}
        onChange={setMode}
        options={[
          { id: "same", label: "Same shape" },
          { id: "different", label: "Different shapes" },
        ]}
      />
      <GridPartition rows={grid.rows} cols={grid.cols} cellRegion={grid.cellRegion} width={170} />
      <p className="muted small">
        Blue: {counts[0]} unit squares · Orange: {counts[1]} unit squares. {mode === "same" ? "Two matching halves — " : "Different shapes, but they cover the same number of squares — "}
        so each part is <Frac n={1} d={2} /> of the whole either way. Equal AREA is what counts, not equal shape.
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE — one ProblemType per bucket
// ============================================================================

const fracStep = (b: number, prompt: string, explain: string) => ({
  kind: "number" as const,
  prompt,
  hint: `One of ${b} equal parts: 1 on top, ${b} (the number of equal parts) on the bottom.`,
  explain,
  answer: 1 / b,
  frac: true,
  fracAnswer: [1, b] as [number, number],
  fracRequired: true,
});

function obviousStripProblem(): Problem {
  const b = pick(STRIP_BS);
  const orientation = pick(["v", "h"] as const);
  const rows = orientation === "v" ? 2 : b;
  const cols = orientation === "v" ? b : 2;
  const cellRegion = stripRegions(rows, cols, b, orientation);
  return {
    title: "Equal strips",
    bucket: "obvious-strip",
    story: `This rectangle is cut into strips.`,
    visual: () => <GridPartition rows={rows} cols={cols} cellRegion={cellRegion} width={cols * Math.min(40, 240 / Math.max(rows, cols))} />,
    steps: [
      {
        kind: "number",
        prompt: "How many equal parts is the whole cut into?",
        hint: "Count the strips, and check each covers the same number of unit squares.",
        explain: `${b} equal parts, each covering 2 unit squares.`,
        answer: b,
      },
      fracStep(b, "What fraction of the whole is ONE part? (Type it like 1/3.)", `Each part is 1/${b} of the whole.`),
    ],
    wrapUp: `${b} equal parts, so each part is 1/${b}.`,
  };
}

function equalNonCongruentProblem(): Problem {
  const g = randomTemplate(false);
  const [blue, orange] = regionCounts(g.cellRegion);
  return {
    title: "Different shapes, same area?",
    bucket: "equal-noncongruent",
    story: "This rectangle is cut into a blue part and an orange part. They're different shapes.",
    visual: () => <GridPartition rows={g.rows} cols={g.cols} cellRegion={g.cellRegion} width={Math.min(200, 36 * g.cols)} />,
    steps: [
      { kind: "number", prompt: "How many unit squares does the BLUE part cover?", hint: "Count every square inside the blue part.", explain: `The blue part covers ${blue} unit squares.`, answer: blue },
      { kind: "number", prompt: "How many unit squares does the ORANGE part cover?", hint: "Count every square inside the orange part.", explain: `The orange part covers ${orange} unit squares.`, answer: orange },
      choice(
        {
          prompt: "So what fraction of the whole is each part?",
          hint: "Same number of squares means same area. How many equal-area parts make the whole?",
          explain: `Both parts cover ${blue} squares, so they're equal in area: each is 1/2, even though the shapes are different.`,
        },
        "Each part is 1/2 — they have equal area.",
        // Named mistake: "different shape means not equal parts".
        ["They can't be halves, because they're different shapes.", "The bigger-looking part is 1/2 and the other is less."]
      ),
    ],
    wrapUp: "Equal area doesn't need the same shape. Two parts that cover the same amount are each 1/2.",
  };
}

function judgeProblem(): Problem {
  const equal = Math.random() < 0.5;
  const g = randomTemplate(!equal);
  const [blue, orange] = regionCounts(g.cellRegion);
  const verdict = equal ? "Yes — equal area, so each part is 1/2." : "No — they cover different amounts, so neither part is 1/2.";
  return {
    title: "Are these really halves?",
    bucket: "judge-partition",
    story: "Someone says this rectangle is cut into halves.",
    visual: () => <GridPartition rows={g.rows} cols={g.cols} cellRegion={g.cellRegion} width={Math.min(200, 36 * g.cols)} />,
    steps: [
      { kind: "number", prompt: "How many unit squares does the BLUE part cover?", hint: "Count carefully. These shapes can be tricky.", explain: `Blue covers ${blue} unit squares.`, answer: blue },
      { kind: "number", prompt: "How many unit squares does the ORANGE part cover?", hint: "Count every square inside the orange part.", explain: `Orange covers ${orange} unit squares.`, answer: orange },
      choice(
        {
          prompt: "Are they right — is each part 1/2 of the whole?",
          hint: "Compare your two counts, not how the shapes look.",
          explain: equal ? `${blue} = ${orange}, so the parts are equal in area. Each is 1/2, even though they look different.` : `${blue} and ${orange} aren't equal, so these aren't halves, even though they look close.`,
        },
        verdict,
        // Named mistake: "2 pieces means halves" regardless of area.
        [equal ? "No — they cover different amounts, so neither part is 1/2." : "Yes — equal area, so each part is 1/2.", "Yes — there are 2 pieces, so each one is 1/2."]
      ),
    ],
    wrapUp: equal ? "Different shapes, same area: these really are halves." : "Close isn't equal. Halves must cover exactly the same area.",
  };
}

function reverseProblem(): Problem {
  const b = pick(REVERSE_BS);
  const thick = pick([2, 3]);
  const orientation = pick(["v", "h"] as const);
  const rows = orientation === "v" ? thick : b;
  const cols = orientation === "v" ? b : thick;
  const cellRegion = oneStripShaded(rows, cols, b, orientation);
  const total = rows * cols;
  const stated = Math.random() < 0.5;
  const visual = () => <GridPartition rows={rows} cols={cols} cellRegion={cellRegion} width={cols * Math.min(36, 240 / Math.max(rows, cols))} />;

  if (stated) {
    return {
      title: "Work backward from the fraction",
      bucket: "reverse-direction",
      story: `The shaded part is 1/${b} of the whole rectangle. The other parts aren't drawn yet.`,
      visual,
      steps: [
        {
          kind: "number",
          prompt: `If the shaded part is 1/${b}, how many equal parts make up the whole?`,
          hint: "The bottom number of a unit fraction tells how many equal parts make the whole.",
          explain: `1/${b} means one of ${b} equal parts.`,
          answer: b,
        },
        {
          kind: "number",
          prompt: "How many unit squares should EACH of the other parts cover?",
          hint: "Equal parts all cover the same area as the shaded one.",
          explain: `Every equal part covers ${thick} unit squares, the same as the shaded part.`,
          answer: thick,
        },
        {
          kind: "number",
          prompt: "How many unit squares are in the whole rectangle?",
          hint: `${b} parts, each covering ${thick} squares.`,
          explain: `${b} parts × ${thick} squares = ${total} unit squares.`,
          answer: total,
        },
      ],
      wrapUp: `1/${b} means ${b} equal parts. Completing the whole takes ${b - 1} more parts like the shaded one.`,
    };
  }
  return {
    title: "How many equal parts?",
    bucket: "reverse-direction",
    story: "The shaded part is one of several EQUAL parts that make up the whole. Only one is drawn.",
    visual,
    steps: [
      { kind: "number", prompt: "How many unit squares are in the whole rectangle?", hint: "Count every square, shaded or not.", explain: `The whole has ${total} unit squares.`, answer: total },
      {
        kind: "number",
        prompt: "How many parts the same size as the shaded part would make the whole?",
        hint: `The shaded part covers ${thick} squares. How many groups of ${thick} make ${total}?`,
        explain: `${total} squares ÷ ${thick} squares per part = ${b} equal parts.`,
        answer: b,
      },
      fracStep(b, "So what fraction of the whole is the shaded part? (Type it like 1/3.)", `One of ${b} equal parts is 1/${b}.`),
    ],
    wrapUp: `The whole is ${b} equal parts, so the shaded part is 1/${b}.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <GridPartition rows={2} cols={4} cellRegion={stripRegions(2, 4, 4, "v")} width={110} />
      <GridPartition rows={4} cols={4} cellRegion={templateToCellRegion(NONCONGRUENT_TEMPLATES[0])} width={80} />
    </div>
  );
}

export const partitioningEqualAreas: Unit = {
  id: "partitioningEqualAreas",
  title: "Partitioning into Equal Areas and Unit Fractions",
  goal: "Split a shape into parts that all have the same area, and name one part with a unit fraction like 1/4.",
  standard: "3.G.2",
  keyIdea: (
    <>
      <p>
        When a whole is cut into <b>b</b> parts that all have the SAME AREA, each part is <Frac n={1} d="b" /> of the whole. For example, 4 equal parts means each part is <Frac n={1} d={4} />.
      </p>
      <p>Equal area means each part covers the same amount of space. It does NOT mean the parts have the same shape, and cutting into 4 uneven pieces does NOT make fourths.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "Equal strips", make: obviousStripProblem, buckets: ["obvious-strip"] },
    { label: "Different shapes", make: equalNonCongruentProblem, buckets: ["equal-noncongruent"] },
    { label: "Really halves?", make: judgeProblem, buckets: ["judge-partition"] },
    { label: "Work backward", make: reverseProblem, buckets: ["reverse-direction"] },
  ],
  requiredBuckets: ["obvious-strip", "equal-noncongruent", "judge-partition", "reverse-direction"],
  test: partitioningEqualAreasTest,
};
