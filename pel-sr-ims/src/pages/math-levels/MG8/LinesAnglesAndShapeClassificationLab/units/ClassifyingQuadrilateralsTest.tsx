import { pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { QUAD_RULE, type QuadCategory } from "../lib/geometry";
import { catList, makeQuad, NAME_CHOICES, nameText, wrongCatLists, type QuadKind } from "../lib/unit4Gen";
import { QuadDrawing } from "../diagrams/Unit4Figures";

// ---------- end-of-unit test: Classifying Quadrilaterals ----------
// 10 single-question generators; imports lib/ + diagrams/ only.

type Diff = TestQuestion["difficulty"];

/** Q1: which rule is true of EVERY [category]? */
export const ruleQuestion = (cat: QuadCategory, difficulty: Diff): TestQuestion[] => {
  // Only rules that are NOT always true of `cat` (e.g. "2 pairs of parallel
  // sides" IS true of every rectangle, so it can't be a rectangle distractor).
  // rectangle <-> rhombus is the classic swap; trapezoid vs parallelogram is
  // the "1 pair vs 2 pairs" mix-up.
  const FALSE_FOR: Record<QuadCategory, QuadCategory[]> = {
    rectangle: ["rhombus", "trapezoid", "square"],
    rhombus: ["rectangle", "trapezoid", "square"],
    trapezoid: ["parallelogram", "rectangle", "rhombus"],
    parallelogram: ["trapezoid", "rectangle", "rhombus"],
    square: ["trapezoid"],
  };
  const distractors = FALSE_FOR[cat].map((c) => QUAD_RULE[c]);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Which of these is true of EVERY ${cat}?`,
          hint: "Think about the one thing that makes a shape belong to that category.",
          explain: `Every ${cat} has ${QUAD_RULE[cat]} — that's what makes it a ${cat}.`,
        },
        QUAD_RULE[cat],
        distractors
      ),
    },
  ];
};

const IMPLIED: { rule: string; answer: QuadCategory; wrong: QuadCategory[] }[] = [
  { rule: "4 right angles", answer: "rectangle", wrong: ["rhombus", "trapezoid"] },
  { rule: "4 sides that are all the same length", answer: "rhombus", wrong: ["rectangle", "trapezoid"] },
  { rule: "exactly 1 pair of parallel sides", answer: "trapezoid", wrong: ["parallelogram", "rectangle"] },
];

/** Q2: reverse direction — given a rule, which name MUST the shape have? */
export const ruleToNameQuestion = (difficulty: Diff): TestQuestion[] => {
  const r = pick(IMPLIED);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `A quadrilateral has ${r.rule}. Which name MUST it have?`,
          hint: "Match the rule to the category it defines.",
          explain: `Any quadrilateral with ${r.rule} is a ${r.answer}.`,
        },
        r.answer,
        // the swapped rule (rectangle <-> rhombus) / the "1 pair vs 2 pairs" mix-up
        r.wrong
      ),
    },
  ];
};

/** Q3-4: best (most specific) name of a one-category shape. */
export const oneNameQuestion = (kind: "trapezoid" | "parallelogram", difficulty: Diff): TestQuestion[] => {
  const q = makeQuad(kind);
  return [
    {
      visual: <QuadDrawing pts={q.pts} />,
      difficulty,
      step: choice(
        {
          prompt: "Which special name fits this shape?",
          hint: "Count its pairs of parallel sides (use the grid), its right angles (little squares), and its equal sides (tick marks).",
          explain: kind === "trapezoid" ? "It has exactly 1 pair of parallel sides — a trapezoid." : "It has 2 pairs of parallel sides but no right angles and not 4 equal sides — a parallelogram.",
        },
        kind,
        // rectangle/rhombus = over-applying a more specific name; trapezoid<->parallelogram = miscounting pairs
        NAME_CHOICES.filter((n) => n !== kind && n !== "square").map(nameText)
      ),
    },
  ];
};

/** Q5-6: list EVERY category a multi-category shape belongs to. */
export const allNamesQuestion = (kind: "square" | "rectangle" | "rhombus", difficulty: Diff): TestQuestion[] => {
  const q = makeQuad(kind);
  const correct = catList(q.cats);
  return [
    {
      visual: <QuadDrawing pts={q.pts} />,
      difficulty,
      step: choice(
        {
          prompt: "Which list names EVERY category this shape belongs to?",
          hint: "A shape can belong to more than one category. Check each rule.",
          explain: `This ${kind} belongs to all of these: ${correct}. A more specific shape still follows every more general rule.`,
        },
        correct,
        // "only a square" = categories are exclusive boxes (the unit's misconception)
        wrongCatLists(q.cats, kind)
      ),
    },
  ];
};

const STATEMENTS: { s: string; truth: boolean; why: string }[] = [
  { s: "Every square is a rectangle.", truth: true, why: "A square has 4 right angles — that's the whole rectangle rule." },
  { s: "Every rectangle is a square.", truth: false, why: "A rectangle only needs 4 right angles; a long, thin rectangle doesn't have 4 equal sides." },
  { s: "Every square is a rhombus.", truth: true, why: "A square has 4 equal sides — that's the whole rhombus rule." },
  { s: "Every rhombus is a square.", truth: false, why: "A slanted rhombus has 4 equal sides but no right angles." },
  { s: "Every rectangle is a parallelogram.", truth: true, why: "A rectangle's opposite sides are always parallel — 2 pairs." },
  { s: "Every parallelogram is a rectangle.", truth: false, why: "A slanted parallelogram has no right angles." },
];

/** Q7-8: true/false about the hierarchy — `direction` picks a TRUE ("every
 *  square is a rectangle") or a FALSE reverse ("every rectangle is a square"). */
export const hierarchyQuestion = (truth: boolean, difficulty: Diff): TestQuestion[] => {
  const st = pick(STATEMENTS.filter((x) => x.truth === truth));
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        { prompt: `True or False: ${st.s}`, hint: "Does the first shape ALWAYS follow the second shape's rule?", explain: `${truth ? "True" : "False"} — ${st.why}` },
        truth ? "True" : "False",
        // flipping the direction of the inclusion is the trap
        [truth ? "False" : "True"]
      ),
    },
  ];
};

/** Q9: a non-example — fits none of the five names. */
export const noneQuestion = (difficulty: Diff): TestQuestion[] => {
  const q = makeQuad(pick(["kite", "irregular"] as QuadKind[]));
  return [
    {
      visual: <QuadDrawing pts={q.pts} />,
      difficulty,
      step: choice(
        {
          prompt: "Which special name fits this shape?",
          hint: "Check every rule. It's fine if none of them fit!",
          explain: `It has no parallel sides${q.kind === "kite" ? " (its equal sides are next to each other, not opposite)" : ""}, so none of the five special names fit — it's just a quadrilateral.`,
        },
        nameText("none"),
        // a kite's 2 pairs of equal sides tempt "rhombus"; any 4-sided shape tempts "trapezoid"
        ["rhombus", "trapezoid", "parallelogram"]
      ),
    },
  ];
};

/** Q10: count pairs of parallel sides (typed). */
export const parallelPairsQuadQuestion = (difficulty: Diff): TestQuestion[] => {
  const q = makeQuad(pick(["trapezoid", "parallelogram", "kite", "rhombus", "irregular"] as QuadKind[]));
  return [
    {
      visual: <QuadDrawing pts={q.pts} />,
      difficulty,
      step: {
        kind: "number",
        prompt: "How many pairs of parallel sides does this shape have?",
        hint: "Check both pairs of opposite sides against the grid.",
        explain: `${q.parallelPairs} pair${q.parallelPairs === 1 ? "" : "s"}.`,
        answer: q.parallelPairs,
      },
    },
  ];
};

export const classifyingQuadrilateralsTest: Unit["test"] = {
  questions: [
    () => ruleQuestion(pick(["rectangle", "rhombus", "trapezoid", "parallelogram"] as QuadCategory[]), "easy"),
    () => ruleToNameQuestion("medium"),
    () => oneNameQuestion("trapezoid", "medium"),
    () => oneNameQuestion("parallelogram", "medium"),
    () => allNamesQuestion("square", "hard"),
    () => allNamesQuestion(pick(["rectangle", "rhombus"] as const), "hard"),
    () => hierarchyQuestion(true, "medium"),
    () => hierarchyQuestion(false, "hard"),
    () => noneQuestion("hard"),
    () => parallelPairsQuadQuestion("medium"),
  ],
  passScore: 9,
};
