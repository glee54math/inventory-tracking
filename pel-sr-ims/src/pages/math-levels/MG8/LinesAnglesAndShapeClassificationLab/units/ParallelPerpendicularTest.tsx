import { pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { makeSideFigure, makeTwoLines, parallelPartner, perpAskable, perpPartner, type FigKind, type LinesBand } from "../lib/unit2Gen";
import { sideName } from "../lib/geometry";
import { SideFigureDrawing, TwoLinesDrawing } from "../diagrams/Unit2Figures";

// ---------- end-of-unit test: Parallel & Perpendicular Lines ----------
// 10 single-question generators; imports lib/ + diagrams/ only (never the
// unit file). All choice/number steps — no drag widgets in a no-feedback test.

type Diff = TestQuestion["difficulty"];

const REL_CHOICES = ["parallel", "perpendicular", "neither"];

/** Q1-5: what is the relationship between the blue line and the orange line? */
export const relationQuestion = (band: LinesBand, difficulty: Diff): TestQuestion[] => {
  const s = makeTwoLines(band);
  const answer = s.relation;
  return [
    {
      visual: <TwoLinesDrawing s={s} />,
      difficulty,
      step: choice(
        {
          prompt: "The blue line and the orange line are… (remember: lines keep going forever past their arrows)",
          hint: "Parallel lines never meet, even if you extend them. Perpendicular lines cross at a square corner.",
          explain:
            band === "parallel"
              ? "They run in exactly the same direction with the same gap all the way along, so they never meet — parallel."
              : band === "perpendicular"
                ? "They cross at an exact square corner — perpendicular."
                : band === "meetLater"
                  ? "They don't touch in the picture, but they're heading toward each other — keep going and they WILL meet. Not parallel, and they don't meet at a square corner, so neither."
                  : "They cross, but not at a square corner — so they're not perpendicular, and lines that cross can't be parallel. Neither.",
        },
        answer,
        // "parallel" on a meet-later pair = "not touching yet means parallel";
        // "perpendicular" on an oblique pair = "any crossing is perpendicular".
        REL_CHOICES.filter((c) => c !== answer)
      ),
    },
  ];
};

/** Q6: vocabulary — both terms live in the choices so neither can be pattern-matched. */
export const vocabQuestion = (which: "parallel" | "perpendicular", difficulty: Diff): TestQuestion[] => {
  const PAR = "Lines that never meet, no matter how far they go";
  const PERP = "Lines that cross and make a square corner (right angle)";
  const SLANT = "Lines that cross at a slant";
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `What are ${which} lines?`,
          hint: "One word means \"never meet,\" the other means \"cross at a square corner.\"",
          explain: which === "parallel" ? "Parallel lines never meet — same direction, same gap forever." : "Perpendicular lines cross at a right angle (a square corner).",
        },
        which === "parallel" ? PAR : PERP,
        // swapping the two terms is the classic mix-up; "at a slant" is "any crossing counts"
        which === "parallel" ? [PERP, SLANT] : [PAR, SLANT]
      ),
    },
  ];
};

/** Q7: in a labeled shape, which side is parallel to side XY? */
export const figureParallelQuestion = (kind: FigKind, difficulty: Diff): TestQuestion[] => {
  const f = makeSideFigure(kind);
  const i = pick([0, 1, 2, 3]);
  const partner = parallelPartner(f, i);
  const others = [0, 1, 2, 3].filter((j) => j !== i).map((j) => `side ${sideName(f.letters, j)}`);
  const NONE = "no side — none are parallel to it";
  const correct = partner === null ? NONE : `side ${sideName(f.letters, partner)}`;
  return [
    {
      visual: <SideFigureDrawing f={f} highlight={[i]} />,
      difficulty,
      step: choice(
        {
          prompt: `Which side is parallel to side ${sideName(f.letters, i)} (the thick blue side)?`,
          hint: "Parallel sides run in the same direction — count the grid steps along each side.",
          explain: partner === null ? `No side runs in the same direction as ${sideName(f.letters, i)}, so none is parallel to it.` : `Side ${sideName(f.letters, partner)} runs the same direction as ${sideName(f.letters, i)} — they would never meet.`,
        },
        correct,
        // the touching sides are tempting because they're nearby; "none" catches over-claiming
        [...others, NONE].filter((c) => c !== correct)
      ),
    },
  ];
};

/** Q8: in a labeled shape, which side is perpendicular to side XY? */
export const figurePerpQuestion = (kind: FigKind, difficulty: Diff): TestQuestion[] => {
  const f = makeSideFigure(kind);
  const i = pick(perpAskable(f));
  const partner = perpPartner(f, i);
  const others = [0, 1, 2, 3].filter((j) => j !== i).map((j) => `side ${sideName(f.letters, j)}`);
  const NONE = "no side — none make a square corner with it";
  const correct = partner === null ? NONE : `side ${sideName(f.letters, partner)}`;
  return [
    {
      visual: <SideFigureDrawing f={f} highlight={[i]} />,
      difficulty,
      step: choice(
        {
          prompt: `Which side is perpendicular to side ${sideName(f.letters, i)} (the thick blue side)?`,
          hint: "Perpendicular sides meet at a square corner.",
          explain: partner === null ? `Neither side touching ${sideName(f.letters, i)} meets it at a square corner.` : `Side ${sideName(f.letters, partner)} meets ${sideName(f.letters, i)} at a square corner — perpendicular.`,
        },
        correct,
        // a side that merely touches it (at a slant) is the "touching = perpendicular" trap
        [...others, NONE].filter((c) => c !== correct)
      ),
    },
  ];
};

/** Q9: how many pairs of parallel sides? (typed) */
export const parallelPairsQuestion = (kind: FigKind, difficulty: Diff): TestQuestion[] => {
  const f = makeSideFigure(kind);
  return [
    {
      visual: <SideFigureDrawing f={f} />,
      difficulty,
      step: {
        kind: "number",
        prompt: "How many pairs of parallel sides does this shape have?",
        hint: "Check the two pairs of opposite sides. Does each pair run the same direction?",
        explain: `${f.parallelPairs} pair${f.parallelPairs === 1 ? "" : "s"}.`,
        answer: f.parallelPairs,
      },
    },
  ];
};

/** Q10: true/false trap — not touching in the picture doesn't mean parallel. */
export const notTouchingTrapQuestion = (difficulty: Diff): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: choice(
      {
        prompt: "True or False: if two lines don't touch in a drawing, they must be parallel.",
        hint: "Lines keep going past the edge of the drawing.",
        explain: "False — they might meet just off the page. Parallel means they would NEVER meet, however far you extend them.",
      },
      "False",
      ["True"]
    ),
  },
];

export const parallelPerpendicularTest: Unit["test"] = {
  questions: [
    () => relationQuestion("parallel", "easy"),
    () => relationQuestion("perpendicular", "easy"),
    () => relationQuestion("meetLater", "hard"),
    () => relationQuestion("oblique", "medium"),
    () => relationQuestion("nearPerp", "hard"),
    () => vocabQuestion(pick(["parallel", "perpendicular"] as const), "easy"),
    () => figureParallelQuestion(pick(["trapezoid", "rightTrapezoid", "parallelogram"] as FigKind[]), "medium"),
    () => figurePerpQuestion(pick(["rightTrapezoid", "oneRight"] as FigKind[]), "hard"),
    () => parallelPairsQuestion(pick(["trapezoid", "parallelogram", "oneRight", "rectangle"] as FigKind[]), "medium"),
    () => notTouchingTrapQuestion("medium"),
  ],
  passScore: 9,
};
