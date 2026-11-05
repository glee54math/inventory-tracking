import { useState } from "react";
import { pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { QuadDrawing } from "../diagrams/Unit4Figures";
import { QuadSorter } from "../diagrams/QuadSorter";
import { QUAD_RULE, type Pt, type QuadCategory } from "../lib/geometry";
import { catList, makeQuad, NAME_CHOICES, nameText, wrongCatLists, type QuadKind } from "../lib/unit4Gen";
import { CfuToggle, DropdownCFU, type CfuQuestion } from "./cfu";
import { classifyingQuadrilateralsTest } from "./ClassifyingQuadrilateralsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const NAMES5 = ["parallelogram", "rectangle", "rhombus", "square", "trapezoid"];
const YN = ["Yes", "No"];
const CFU_RHOMBUS: Pt[] = [
  [4, 1],
  [7, 5],
  [4, 9],
  [1, 5],
];
const CFU_IRREG: Pt[] = [
  [1, 2],
  [6, 1],
  [8, 6],
  [2, 5],
];

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    prompt: "Each special quadrilateral has a rule. Match the rule to the name.",
    boxes: [
      { label: "4 right angles:", choices: NAMES5, correct: 1 },
      { label: "4 sides all the same length:", choices: NAMES5, correct: 2 },
      { label: "Exactly 1 pair of parallel sides:", choices: NAMES5, correct: 4 },
    ],
    good: "Yes! Rectangle = 4 right angles. Rhombus = 4 equal sides. Trapezoid = exactly 1 pair of parallel sides. (Parallelogram = 2 pairs; square = 4 right angles AND 4 equal sides.)",
    bad: "Not quite — a rectangle's rule is about its ANGLES (all square corners). A rhombus's rule is about its SIDES (all equal). A trapezoid has just one pair of parallel sides.",
  },
  {
    prompt: "A square has 4 right angles and 4 equal sides. Answer these two IN ORDER.",
    boxes: [
      { label: "First: is every square a rectangle?", choices: YN, correct: 0 },
      { label: "Now the reverse: is every rectangle a square?", choices: YN, correct: 1 },
    ],
    good: "Exactly! Every square has 4 right angles, so every square IS a rectangle. But a long, thin rectangle doesn't have 4 equal sides — so not every rectangle is a square. The direction matters!",
    bad: "Not quite — check each one against the rule. The rectangle rule is \"4 right angles\": does a square have that? Then flip it: does every rectangle have 4 EQUAL sides? Picture a long, thin rectangle.",
  },
  {
    prompt: "This shape has 4 equal sides (see the tick marks) but no square corners.",
    visual: <QuadDrawing pts={CFU_RHOMBUS} cell={24} />,
    boxes: [
      { label: "Is it a parallelogram?", choices: YN, correct: 0 },
      { label: "Is it a rectangle?", choices: YN, correct: 1 },
      { label: "Is it a square?", choices: YN, correct: 1 },
    ],
    good: "Right! It's a rhombus, and its opposite sides are parallel, so it's ALSO a parallelogram. But with no right angles it isn't a rectangle — or a square.",
    bad: "Not quite — check each rule separately. Opposite sides parallel? (That's parallelogram.) 4 right angles? (That's rectangle — and a square needs it too.)",
  },
  {
    prompt: "Not every quadrilateral gets a special name.",
    visual: <QuadDrawing pts={CFU_IRREG} cell={24} />,
    boxes: [
      { label: "How many pairs of parallel sides does it have?", choices: ["0", "1", "2"], correct: 0 },
      { label: "Which special name fits?", choices: [...NAMES5, "none — it's just a quadrilateral"], correct: 5 },
    ],
    good: "Correct! No sides are parallel, no right angles, no equal sides — none of the five special names fit. It's still a quadrilateral (4 straight sides); it just isn't a special one.",
    bad: "Not quite — check the opposite sides against the grid: neither pair runs the same direction. With no parallel sides, no right angles and no equal sides, none of the special names fit.",
  },
];

function QuadsCheck({ onComplete }: { onComplete?: () => void }) {
  return <DropdownCFU title="Check for Understanding: special quadrilaterals can belong to more than one family — but only in one direction." questions={CFU_QUESTIONS} onComplete={onComplete} />;
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  return (
    <div className="lasc-stack">
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
      <div className="lasc-card">
        <h3 className="lasc-h">Drag the corners — watch the family tree</h3>
        <p className="muted small">
          Little squares mark right angles; matching tick marks show equal sides; use the grid to spot parallel sides. Every family whose rule your shape follows lights up — a square lights up
          FOUR boxes (plus "quadrilateral").
        </p>
        <QuadSorter />
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <QuadsCheck onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

const RULE_SWAP: Record<QuadCategory, QuadCategory[]> = {
  rectangle: ["rhombus", "trapezoid"],
  rhombus: ["rectangle", "trapezoid"],
  trapezoid: ["parallelogram", "rhombus"],
  parallelogram: ["trapezoid", "rectangle"],
  square: ["trapezoid", "parallelogram"],
};

function attributesProblem(): Problem {
  // (square is left out of step 1: every OTHER rule except trapezoid is also true of
  // every square, so it has no fair "always true" distractor set)
  const c1 = pick(["rectangle", "rhombus", "trapezoid", "parallelogram"] as QuadCategory[]);
  const c2 = pick((["rectangle", "rhombus", "trapezoid"] as QuadCategory[]).filter((c) => c !== c1));
  return {
    title: "What makes it that shape?",
    bucket: "attributes",
    story: "Every special quadrilateral has a rule it ALWAYS follows.",
    visual: () => null,
    steps: [
      choice(
        { prompt: `Which is true of EVERY ${c1}?`, hint: "Think of the one rule that defines it.", explain: `Every ${c1} has ${QUAD_RULE[c1]}.` },
        QUAD_RULE[c1],
        RULE_SWAP[c1].map((c) => QUAD_RULE[c])
      ),
      choice(
        { prompt: `Now the other way: a quadrilateral has ${QUAD_RULE[c2]}. Which name MUST it have?`, hint: "Match the rule to its name.", explain: `${QUAD_RULE[c2]} → ${c2}.` },
        c2,
        RULE_SWAP[c2]
      ),
    ],
    wrapUp: `${c1[0].toUpperCase() + c1.slice(1)}: ${QUAD_RULE[c1]}. ${c2[0].toUpperCase() + c2.slice(1)}: ${QUAD_RULE[c2]}.`,
  };
}

function oneCategoryProblem(): Problem {
  const kind = pick(["trapezoid", "parallelogram"] as const);
  const q = makeQuad(kind);
  return {
    title: "Which special name?",
    bucket: "one-category",
    story: "Use the grid for parallel sides, the little squares for right angles, and the tick marks for equal sides.",
    visual: () => <QuadDrawing pts={q.pts} />,
    steps: [
      { kind: "number", prompt: "How many pairs of parallel sides does it have?", hint: "Check both pairs of opposite sides.", explain: `${q.parallelPairs}.`, answer: q.parallelPairs },
      { kind: "number", prompt: "How many right angles does it have?", hint: "Look for little squares in the corners.", explain: `${q.rightAngles}.`, answer: q.rightAngles },
      choice(
        {
          prompt: "Which special name fits it?",
          hint: "1 pair of parallel sides → trapezoid. 2 pairs → parallelogram (and check for more).",
          explain: kind === "trapezoid" ? "Exactly 1 pair of parallel sides — a trapezoid, and nothing more." : "2 pairs of parallel sides, no right angles, sides not all equal — just a parallelogram.",
        },
        kind,
        NAME_CHOICES.filter((n) => n !== kind && n !== "square").map(nameText)
      ),
    ],
    wrapUp: `This shape fits exactly one special name: ${kind}.`,
  };
}

const TF_FOR: Record<"square" | "rectangle" | "rhombus", { s: string; truth: boolean; why: string }[]> = {
  square: [
    { s: "Every square is a rectangle.", truth: true, why: "A square has 4 right angles." },
    { s: "Every square is a rhombus.", truth: true, why: "A square has 4 equal sides." },
  ],
  rectangle: [
    { s: "Every rectangle is a square.", truth: false, why: "A long, thin rectangle doesn't have 4 equal sides." },
    { s: "Every rectangle is a parallelogram.", truth: true, why: "A rectangle always has 2 pairs of parallel sides." },
  ],
  rhombus: [
    { s: "Every rhombus is a square.", truth: false, why: "A slanted rhombus has no right angles." },
    { s: "Every rhombus is a parallelogram.", truth: true, why: "A rhombus always has 2 pairs of parallel sides." },
  ],
};

function multiCategoryProblem(): Problem {
  const kind = pick(["square", "rectangle", "rhombus"] as const);
  const q = makeQuad(kind);
  const tf = pick(TF_FOR[kind]);
  const correct = catList(q.cats);
  return {
    title: "More than one name",
    bucket: "multi-category",
    story: "Some shapes belong to SEVERAL families at once.",
    visual: () => <QuadDrawing pts={q.pts} />,
    steps: [
      { kind: "number", prompt: "How many right angles does it have?", hint: "Count the little squares.", explain: `${q.rightAngles}.`, answer: q.rightAngles },
      choice(
        { prompt: "Which list names EVERY family this shape belongs to?", hint: "Check every rule: 2 pairs parallel? 4 right angles? 4 equal sides?", explain: `It follows the rules for: ${correct}.` },
        correct,
        wrongCatLists(q.cats, kind)
      ),
      choice({ prompt: `True or False: ${tf.s}`, hint: "Does the first shape ALWAYS follow the second one's rule?", explain: `${tf.truth ? "True" : "False"} — ${tf.why}` }, tf.truth ? "True" : "False", [tf.truth ? "False" : "True"]),
    ],
    wrapUp: `This ${kind} is a ${correct} — all at once.`,
  };
}

function noneProblem(): Problem {
  const q = makeQuad(pick(["kite", "irregular"] as QuadKind[]));
  return {
    title: "Any special name?",
    bucket: "none",
    story: "Check this quadrilateral against every rule.",
    visual: () => <QuadDrawing pts={q.pts} />,
    steps: [
      { kind: "number", prompt: "How many pairs of parallel sides does it have?", hint: "Check both pairs of opposite sides.", explain: `${q.parallelPairs} — no sides run the same direction.`, answer: q.parallelPairs },
      { kind: "number", prompt: "How many right angles does it have?", hint: "Look for little squares.", explain: `${q.rightAngles}.`, answer: q.rightAngles },
      choice(
        {
          prompt: "Which special name fits?",
          hint: "If no rule fits, no special name fits.",
          explain: q.kind === "kite" ? "Its equal sides are NEXT to each other, not opposite, and nothing is parallel — so no special name. Just a quadrilateral." : "No parallel sides, no right angles, no equal sides — just a quadrilateral.",
        },
        nameText("none"),
        ["rhombus", "trapezoid", "parallelogram"]
      ),
    ],
    wrapUp: "It's a quadrilateral, but none of the five special names fit — and that's a perfectly good answer.",
  };
}

function Preview() {
  return <QuadDrawing pts={CFU_RHOMBUS} cell={18} />;
}

export const classifyingQuadrilaterals: Unit = {
  id: "classifyingQuadrilaterals",
  title: "Classifying Quadrilaterals",
  goal: "I can sort quadrilaterals into categories (rhombus, square, rectangle, parallelogram, trapezoid) based on their sides and angles, and understand that some shapes belong to more than one category.",
  standard: "4.G.2",
  keyIdea: (
    <>
      <p>
        <b>Parallelogram</b>: 2 pairs of parallel sides. <b>Trapezoid</b>: exactly 1 pair. <b>Rectangle</b>: 4 right angles. <b>Rhombus</b>: 4 equal sides. <b>Square</b>: 4 right angles AND 4
        equal sides.
      </p>
      <p>A shape gets EVERY name whose rule it follows: every square is a rectangle and a rhombus — but not every rectangle is a square.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "Rules", make: attributesProblem, buckets: ["attributes"] },
    { label: "One name", make: oneCategoryProblem, buckets: ["one-category"] },
    { label: "Many names", make: multiCategoryProblem, buckets: ["multi-category"] },
    { label: "No special name", make: noneProblem, buckets: ["none"] },
  ],
  requiredBuckets: ["attributes", "one-category", "multi-category", "none"],
  test: classifyingQuadrilateralsTest,
};
