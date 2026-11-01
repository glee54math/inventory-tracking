import { useState } from "react";
import { pick } from "../../../shared/lib/math";
import { choice, type Problem, type Step } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { FoldChecker, SymmetryFigure, type FoldShape } from "../diagrams/Symmetry";
import { candidateFolds, FOLD_DIR_LABEL, foldDir, orient, symmetryLines, type FoldDir, type FoldLine, type Pt } from "../lib/geometry";
import { makeSymShape, nearMissLine, SYM_POOL, type SymGroup } from "../lib/unit5Gen";
import { CfuToggle, DropdownCFU, type CfuQuestion } from "./cfu";
import { linesOfSymmetryTest } from "./LinesOfSymmetryTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const RECT: Pt[] = [
  [1, 1],
  [7, 1],
  [7, 4],
  [1, 4],
];
const RECT_DIAG: FoldLine = { a: [8, 5], d: [6, 3] };
const SQUARE: Pt[] = [
  [1, 1],
  [5, 1],
  [5, 5],
  [1, 5],
];
const PARA: Pt[] = [
  [1, 1],
  [6, 1],
  [8, 4],
  [3, 4],
];
const COUNTS = ["0", "1", "2", "4"];

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    prompt: "New words: line of symmetry.",
    boxes: [
      {
        label: "A line of symmetry is a line where…",
        choices: ["you can fold the shape on it and the two halves match exactly", "it goes through the middle of the shape", "it cuts the shape into two pieces"],
        correct: 0,
      },
      { label: "A shape that has a line of symmetry is called…", choices: ["line-symmetric", "parallel", "perpendicular"], correct: 0 },
    ],
    good: "Yes! It's all about the FOLD: fold on the line and both halves land exactly on each other. A shape with at least one such line is line-symmetric.",
    bad: "Not quite — lots of lines go through the middle or cut a shape in two. A line of symmetry is special: fold on it and the two halves match EXACTLY. Shapes that have one are called line-symmetric.",
  },
  {
    prompt: "Here's a rectangle with a dashed corner-to-corner line.",
    visual: <SymmetryFigure pts={RECT} cols={8} rows={5} dashed={RECT_DIAG} cell={26} />,
    boxes: [
      { label: "Does the dashed line go through the middle of the rectangle?", choices: ["Yes", "No"], correct: 0 },
      { label: "If you fold on it, do the two halves match exactly?", choices: ["Yes", "No"], correct: 1 },
      { label: "So is it a line of symmetry?", choices: ["Yes", "No"], correct: 1 },
    ],
    good: "Exactly! It DOES go through the middle — but fold it and the corners hang over the edges. Through the middle is not enough; the halves must match.",
    bad: "Not quite — it does pass through the middle, but picture folding the top-right corner over the dashed line: it lands outside the rectangle. The halves don't match, so it is NOT a line of symmetry.",
  },
  {
    prompt: "Count the lines of symmetry.",
    visual: (
      <div className="lasc-row">
        <div className="lasc-tile">
          <SymmetryFigure pts={SQUARE} cols={6} rows={6} cell={22} />
          <b>square</b>
        </div>
        <div className="lasc-tile">
          <SymmetryFigure pts={RECT} cols={8} rows={5} cell={22} />
          <b>rectangle (not a square)</b>
        </div>
      </div>
    ),
    boxes: [
      { label: "The square has this many lines of symmetry:", choices: COUNTS, correct: 3 },
      { label: "The rectangle has this many:", choices: COUNTS, correct: 2 },
    ],
    good: "Right! A square folds into matching halves 4 ways: up-down, across, and both corner-to-corner lines. A long rectangle only folds 2 ways — its corner-to-corner lines don't work.",
    bad: "Not quite — try every fold: up-down, across, and the two slanted corner-to-corner folds. All four work for the square; only up-down and across work for the long rectangle.",
  },
  {
    prompt: "Some shapes have NO line of symmetry.",
    visual: <SymmetryFigure pts={PARA} cols={9} rows={5} cell={24} />,
    boxes: [
      { label: "How many lines of symmetry does this slanted parallelogram have?", choices: COUNTS, correct: 0 },
      { label: "True or false: every shape has at least one line of symmetry.", choices: ["True", "False"], correct: 1 },
    ],
    good: "Correct! Fold it any way — up-down, across, corner to corner — and the slanted ends never line up. Zero lines of symmetry is a real answer.",
    bad: "Not quite — try folding it up-down: the slanted ends point opposite ways, so they don't match. Across or corner-to-corner doesn't work either. This shape has NO line of symmetry, so not every shape has one.",
  },
];

function SymmetryCheck({ onComplete }: { onComplete?: () => void }) {
  return <DropdownCFU title="Check for Understanding: a line of symmetry must make the halves MATCH — not just go through the middle." questions={CFU_QUESTIONS} onComplete={onComplete} />;
}

// ============================================================================
// EXPLORE — the fold checker
// ============================================================================

const EXPLORE_NAMES = ["isosceles triangle", "rectangle", "square", "kite", "parallelogram", "L shape", "plus sign"];
const EXPLORE_SHAPES: FoldShape[] = EXPLORE_NAMES.map((name) => {
  const b = SYM_POOL.find((s) => s.name === name)!;
  const { pts, w, h } = orient(b.pts, 0, 1);
  return { label: name, pts, cols: w + 2, rows: h + 2, lines: symmetryLines(pts), tries: candidateFolds(pts) };
});

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [which, setWhich] = useState(EXPLORE_NAMES[0]);
  const shape = EXPLORE_SHAPES[EXPLORE_NAMES.indexOf(which)];
  return (
    <div className="lasc-stack">
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
      {(introActive || showCheck) && <SymmetryCheck onComplete={onIntroDone} />}
      <div className="lasc-card">
        <h3 className="lasc-h">Fold it and see</h3>
        <p className="muted small">
          A <b>line of symmetry</b> is a fold line where both halves match exactly. Pick a shape and a fold line, then press <b>Fold it!</b> A green outline means a perfect match; red means
          parts stick out. Every fold line here goes through the middle — but only some of them work.
        </p>
        <Segmented label="Shape" value={which} onChange={setWhich} options={EXPLORE_NAMES.map((n) => ({ id: n, label: n[0].toUpperCase() + n.slice(1) }))} />
        <FoldChecker key={which} shape={shape} />
        <p className="muted small">
          A <b>circle</b> is special: EVERY line through its center is a line of symmetry — it has more than you could ever count.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

const DIR_CHOICES = (Object.keys(FOLD_DIR_LABEL) as FoldDir[]).map((d) => FOLD_DIR_LABEL[d]);

function symProblem(target?: string): Problem {
  const bucket = target === "one-line" || target === "many-lines" || target === "no-lines" ? target : pick(["one-line", "many-lines", "no-lines"]);
  const group: SymGroup = bucket === "one-line" ? "one" : bucket === "many-lines" ? "many" : "none";
  const s = makeSymShape(group);
  const n = s.lines.length;
  const real = n > 0;
  const dashed = real ? pick(s.lines) : nearMissLine(s);
  const steps: Step[] = [
    choice(
      {
        prompt: "Is the dashed line a line of symmetry?",
        hint: "Picture folding on the dashed line. Would every part land on another part?",
        explain: real ? "Yes — fold on it and the halves match (see the green outline)." : "No — fold on it and parts stick out (see the red outline).",
      },
      real ? "Yes" : "No",
      [real ? "No" : "Yes"]
    ),
    {
      kind: "number",
      prompt: "How many lines of symmetry does this shape have in all? (Type 0 if none.)",
      hint: "Try up-down, across, and both slanted folds.",
      explain: n === 0 ? "None — no fold makes the halves match." : `${n} (shown in green).`,
      answer: n,
    },
  ];
  if (group === "one") {
    const dir = foldDir(s.lines[0]);
    steps.push(choice({ prompt: "Which way does its line of symmetry go?", hint: "Look at the green line.", explain: `It goes ${FOLD_DIR_LABEL[dir]}.` }, FOLD_DIR_LABEL[dir], DIR_CHOICES.filter((d) => d !== FOLD_DIR_LABEL[dir])));
  } else {
    steps.push(
      choice(
        {
          prompt: group === "many" ? "True or False: EVERY line through the middle of this shape is a line of symmetry." : "True or False: every shape has at least one line of symmetry.",
          hint: group === "many" ? "Is there a line through the middle that ISN'T green?" : "Look at this shape.",
          explain: group === "many" ? "False — only the green lines work. Plenty of other lines through the middle don't." : "False — this shape has none.",
        },
        "False",
        ["True"]
      )
    );
  }
  return {
    title: "Lines of symmetry",
    bucket,
    story: `Here is a ${s.name} with a dashed line through it.`,
    visual: (done) => <SymmetryFigure pts={s.pts} cols={s.cols} rows={s.rows} dashed={dashed} showFold={done >= 1} allLines={done >= 2 ? s.lines : undefined} />,
    steps,
    wrapUp: n === 0 ? `This ${s.name} has no lines of symmetry.` : `This ${s.name} has ${n} line${n === 1 ? "" : "s"} of symmetry.`,
  };
}

function nearMissProblem(): Problem {
  const s = makeSymShape(pick(["one", "many"] as SymGroup[]), { nearMiss: true });
  const line = nearMissLine(s);
  const n = s.lines.length;
  return {
    title: "Through the middle… but does it fold?",
    bucket: "near-miss-line",
    story: `This ${s.name} has a dashed line through it. It looks like it might be a line of symmetry.`,
    visual: (done) => <SymmetryFigure pts={s.pts} cols={s.cols} rows={s.rows} dashed={line} showFold={done >= 2} allLines={done >= 3 ? s.lines : undefined} />,
    steps: [
      choice({ prompt: "Does the dashed line go through the middle of the shape?", hint: "Look at where it crosses.", explain: "Yes — it passes right through the middle." }, "Yes", ["No"]),
      choice(
        {
          prompt: "If you folded the shape on the dashed line, would the two halves match exactly?",
          hint: "Picture one corner flipping over the line. Where would it land?",
          explain: "No — the red outline shows where the folded half lands: parts stick out. Through the middle isn't enough.",
        },
        "No",
        ["Yes"]
      ),
      {
        kind: "number",
        prompt: "So how many lines of symmetry does this shape REALLY have?",
        hint: "Try the other folds: up-down, across, slanted.",
        explain: `${n} (shown in green).`,
        answer: n,
      },
    ],
    wrapUp: `The dashed line looked central, but only the ${n} green line${n === 1 ? "" : "s"} truly fold the ${s.name} into matching halves.`,
  };
}

function Preview() {
  return <SymmetryFigure pts={RECT} cols={8} rows={5} dashed={RECT_DIAG} showFold cell={20} />;
}

export const linesOfSymmetry: Unit = {
  id: "linesOfSymmetry",
  title: "Lines of Symmetry",
  goal: "I can find a line of symmetry in a shape — a line where, if you folded the shape along it, both sides would match exactly — and tell which shapes have one (or more than one).",
  standard: "4.G.3",
  keyIdea: (
    <>
      <p>
        A <b>line of symmetry</b> is a fold line where the two halves match exactly. Some shapes have one, some have several (a square has 4), and some have NONE.
      </p>
      <p>Going through the middle isn't enough — a rectangle's corner-to-corner line passes through the middle, but the halves don't match. Always check the fold.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "How many lines?", make: symProblem, buckets: ["one-line", "many-lines", "no-lines"] },
    { label: "Near-miss lines", make: nearMissProblem, buckets: ["near-miss-line"] },
  ],
  requiredBuckets: ["one-line", "many-lines", "no-lines", "near-miss-line"],
  test: linesOfSymmetryTest,
};
