import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { FOLD_DIR_LABEL, foldDir, type FoldLine, type Pt } from "../lib/geometry";
import { makeSymShape, nearMissLine, type SymGroup } from "../lib/unit5Gen";
import { SymmetryFigure } from "../diagrams/Symmetry";

// ---------- end-of-unit test: Lines of Symmetry ----------
// 10 single-question generators; imports lib/ + diagrams/ only. The fold
// checker is Explore-only — the test asks about pictured shapes and dashed
// lines with typed counts / choices, so a wrong student can always submit.

type Diff = TestQuestion["difficulty"];

/** Q1-3: how many lines of symmetry? (typed) */
export const countLinesQuestion = (group: SymGroup, difficulty: Diff): TestQuestion[] => {
  const s = makeSymShape(group);
  const n = s.lines.length;
  return [
    {
      visual: <SymmetryFigure pts={s.pts} cols={s.cols} rows={s.rows} />,
      difficulty,
      step: {
        kind: "number",
        prompt: "How many lines of symmetry does this shape have? (Type 0 if it has none.)",
        hint: "Imagine folding it: up-down, side-to-side, and slanted. Count only folds where both halves match exactly.",
        explain: n === 0 ? `None — this ${s.name} has no fold where both halves match.` : `${n} — this ${s.name} folds into matching halves along ${n === 1 ? "one line" : `${n} different lines`}.`,
        answer: n,
      },
    },
  ];
};

/** Q4-5: is the dashed line a line of symmetry? `real` = a true line, else a near-miss through the middle. */
export const isLineQuestion = (real: boolean, difficulty: Diff): TestQuestion[] => {
  const s = makeSymShape(real ? pick(["one", "many"] as SymGroup[]) : pick(["one", "many", "none"] as SymGroup[]), { nearMiss: !real });
  const line: FoldLine = real ? pick(s.lines) : nearMissLine(s);
  return [
    {
      visual: <SymmetryFigure pts={s.pts} cols={s.cols} rows={s.rows} dashed={line} />,
      difficulty,
      step: choice(
        {
          prompt: "Is the dashed line a line of symmetry?",
          hint: "Picture folding the shape on the dashed line. Would every part land exactly on another part?",
          explain: real ? "Yes — fold on it and the two halves land exactly on each other." : "No — it goes through the middle, but folding on it leaves parts sticking out. The halves don't match.",
        },
        real ? "Yes — the halves would match exactly" : "No — the halves would not match",
        // near-miss: "it goes through the middle, so yes" is the named misconception
        real ? ["No — the halves would not match"] : ["Yes — the halves would match exactly", "Yes — it goes through the middle"]
      ),
    },
  ];
};

/** Q6: the classic — a non-square rectangle and its corner-to-corner diagonal. */
export const rectangleDiagonalQuestion = (difficulty: Diff): TestQuestion[] => {
  const w = randInt(5, 8);
  const h = pick([2, 3, 4]);
  const pts: Pt[] = [
    [1, 1],
    [1 + w, 1],
    [1 + w, 1 + h],
    [1, 1 + h],
  ];
  // corner-to-corner line, anchored at the rectangle's center (doubled coords)
  const diag: FoldLine = { a: [2 + w, 2 + h], d: pick([[w, h], [w, -h]] as Pt[]) };
  return [
    {
      visual: <SymmetryFigure pts={pts} cols={w + 2} rows={h + 2} dashed={diag} />,
      difficulty,
      step: choice(
        {
          prompt: "This rectangle is folded along the dashed corner-to-corner line. Is that line a line of symmetry?",
          hint: "Picture the top corner flipping over. Where would it land?",
          explain: "No — the corners would hang over the edges. A non-square rectangle has just 2 lines of symmetry: straight up-and-down and straight across through the middle.",
        },
        "No",
        // "Yes" = "corner to corner through the middle must split it evenly"
        ["Yes"]
      ),
    },
  ];
};

/** Q7: which of three shapes has NO line of symmetry? */
export const whichHasNoneQuestion = (difficulty: Diff): TestQuestion[] => {
  const shapes = shuffle([makeSymShape("none"), makeSymShape("one"), makeSymShape("many")]);
  const letters = ["A", "B", "C"];
  const idx = shapes.findIndex((s) => s.group === "none");
  return [
    {
      visual: (
        <div className="lasc-row">
          {shapes.map((s, i) => (
            <div key={i} className="lasc-tile">
              <SymmetryFigure pts={s.pts} cols={s.cols} rows={s.rows} cell={18} />
              <b>Shape {letters[i]}</b>
            </div>
          ))}
        </div>
      ),
      difficulty,
      step: choice(
        {
          prompt: "Which shape has NO line of symmetry?",
          hint: "For each shape, look for any fold where both halves match.",
          explain: `Shape ${letters[idx]} (a ${shapes[idx].name}) has no matching fold. The other two each have at least one.`,
        },
        `Shape ${letters[idx]}`,
        // the other shapes each have a real line — picking one means missing it
        letters.filter((_, i) => i !== idx).map((l) => `Shape ${l}`)
      ),
    },
  ];
};

/** Q8: which way does a one-line shape's line of symmetry go? */
export const directionQuestion = (difficulty: Diff): TestQuestion[] => {
  const s = makeSymShape("one");
  const dir = foldDir(s.lines[0]);
  return [
    {
      visual: <SymmetryFigure pts={s.pts} cols={s.cols} rows={s.rows} />,
      difficulty,
      step: choice(
        {
          prompt: "This shape has exactly one line of symmetry. Which way does it go?",
          hint: "Find the fold where one half is the mirror image of the other.",
          explain: `Its line of symmetry goes ${FOLD_DIR_LABEL[dir]}.`,
        },
        FOLD_DIR_LABEL[dir],
        // the other directions; "sideways vs up-down" mix-ups are the common slip
        (Object.keys(FOLD_DIR_LABEL) as (keyof typeof FOLD_DIR_LABEL)[]).filter((d) => d !== dir).map((d) => FOLD_DIR_LABEL[d])
      ),
    },
  ];
};

/** Q9: vocabulary. */
export const symVocabQuestion = (difficulty: Diff): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: choice(
      {
        prompt: "What is a line of symmetry?",
        hint: "Think about folding paper.",
        explain: "A line of symmetry is a fold line where the two halves match exactly.",
      },
      "A line you can fold a shape along so the two halves match exactly",
      // "through the middle" and "two pieces" are the near-miss definitions students give
      ["Any line that goes through the middle of a shape", "Any line that cuts a shape into two pieces"]
    ),
  },
];

/** Q10: true/false trap. */
export const middleTrapQuestion = (difficulty: Diff): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: choice(
      {
        prompt: "True or False: any line through the middle of a shape is a line of symmetry.",
        hint: "Think of a rectangle and its corner-to-corner line.",
        explain: "False — a rectangle's corner-to-corner line goes through the middle, but the halves don't match when you fold. Only some lines through the middle work (and some shapes have none at all).",
      },
      "False",
      ["True"]
    ),
  },
];

export const linesOfSymmetryTest: Unit["test"] = {
  questions: [
    () => countLinesQuestion("one", "easy"),
    () => countLinesQuestion("many", "medium"),
    () => countLinesQuestion("none", "medium"),
    () => isLineQuestion(true, "easy"),
    () => isLineQuestion(false, "hard"),
    () => rectangleDiagonalQuestion("hard"),
    () => whichHasNoneQuestion("medium"),
    () => directionQuestion("medium"),
    () => symVocabQuestion("easy"),
    () => middleTrapQuestion("hard"),
  ],
  passScore: 9,
};
