import { FractionBar, UnequalPartsBar } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, selectBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies — *Test.tsx files never import generators back from their
// paired main unit file (see FractionForms-style convention across this app;
// doing so creates a circular import that silently breaks the level at
// runtime — see MATH_TSX_STYLE_GUIDE.txt / MM1_RatioLab's ConversionsTest fix).
const DENOMS = [2, 3, 4, 6, 8] as const;

function unequalSegments(d: number): number[] {
  const segments = Array.from({ length: d }, () => 1);
  const idx = randInt(0, d - 1);
  segments[idx] = 2.2;
  let idx2 = randInt(0, d - 1);
  while (idx2 === idx) idx2 = randInt(0, d - 1);
  segments[idx2] = 0.5;
  return segments;
}

// Q1, Q5 — unit fraction naming (choice)
export function unitFractionQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const d = DENOMS[randInt(0, DENOMS.length - 1)];
    return [
      {
        visual: <FractionBar numerator={1} denominator={d} />,
        difficulty,
        step: choice(
          {
            prompt: "Which fraction does this picture show?",
            hint: "Count the equal parts (bottom), then how many are shaded (top).",
            explain: `1 part out of ${d} equal parts is shaded, so this shows 1/${d}.`,
          },
          `1/${d}`,
          // "d/1" swaps numerator/denominator (the named vocabulary mix-up); "(d-1)/d"
          // names the UNSHADED parts instead (2/2 for halves, where that would collide).
          [`${d}/1`, d > 2 ? `${d - 1}/${d}` : `2/2`]
        ),
      },
    ];
  };
}

// Q2 — non-unit fraction naming (choice, visual)
export function nonUnitFractionQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const d = [3, 4, 6, 8][randInt(0, 3)];
    const a = randInt(2, d - 1);
    return [
      {
        visual: <FractionBar numerator={a} denominator={d} />,
        difficulty,
        step: choice(
          {
            prompt: "Which fraction does this picture show?",
            hint: "Count the equal parts (bottom) and the shaded parts (top).",
            explain: `${a} parts out of ${d} equal parts are shaded, so this shows ${a}/${d}.`,
          },
          `${a}/${d}`,
          // "d/a" swaps numerator/denominator; "(a-1)/d" undercounts the shaded parts by one.
          [`${d}/${a}`, `${a - 1}/${d}`]
        ),
      },
    ];
  };
}

// Q6 — non-unit fraction naming, text-only (no picture)
export function nonUnitTextQuestion(): TestQuestion[] {
  const d = [3, 4, 6, 8][randInt(0, 3)];
  const a = randInt(2, d - 1);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `A whole is split into ${d} equal parts, and ${a} of them are shaded. What fraction is shown?`,
          hint: "The bottom number is the total equal parts; the top number is how many are shaded.",
          explain: `${a} of ${d} equal parts shaded is ${a}/${d}.`,
        },
        `${a}/${d}`,
        [`${d}/${a}`, `${a + 1}/${d}`]
      ),
    },
  ];
}

// Q3, Q10 — build/shade a fraction (number step)
export function buildFractionQuestion(difficulty: "easy" | "hard"): () => TestQuestion[] {
  return () => {
    const d = DENOMS[randInt(0, DENOMS.length - 1)];
    const a = randInt(1, d - 1);
    return [
      {
        visual: <FractionBar numerator={0} denominator={d} label={`Show ${a}/${d}`} />,
        difficulty,
        step: {
          kind: "number",
          prompt: `The bar is split into ${d} equal parts. How many should you shade to show ${a}/${d}?`,
          hint: `The top number, ${a}, tells you how many parts to shade.`,
          explain: `${a}/${d} means ${a} of the ${d} equal parts are shaded.`,
          answer: a,
        },
      },
    ];
  };
}

// Q4, Q7 — equal-parts trap (choice, visual)
export function trapQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const d = DENOMS[randInt(0, DENOMS.length - 1)];
    const segments = unequalSegments(d);
    const a = randInt(1, d - 1);
    const shadedIndices = Array.from({ length: a }, (_, i) => i);
    return [
      {
        visual: <UnequalPartsBar segments={segments} shadedIndices={shadedIndices} />,
        difficulty,
        step: choice(
          {
            prompt: `This whole is split into ${d} parts, and ${a} are shaded. Does this picture correctly show ${a}/${d}?`,
            hint: "Look closely at the SIZE of each part, not just how many are shaded.",
            explain: `No — the ${d} parts aren't all the same size, so this picture doesn't show a valid fraction. A fraction's parts must be equal size.`,
          },
          "No — the parts aren't all the same size",
          // The "shaded count matches" trap, and a second distractor that tries to
          // excuse the mismatch by appealing to adjacency instead of size.
          [`Yes — ${a} of the ${d} parts are shaded, so it's ${a}/${d}`, "Yes, as long as the shaded parts are next to each other"]
        ),
      },
    ];
  };
}

// Q8 — vocabulary, two-part dropdown sentence
export function vocabularySentenceQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: sentence(
        {
          prompt: "Fill in both blanks about what a fraction's two numbers mean.",
          hint: "The bottom number is about splitting the whole; the top number is about how many of those parts are counted.",
          explain: "The bottom number (denominator) is how many equal parts the whole is split into; the top number (numerator) is how many of those parts are shaded.",
        },
        "In a fraction, the bottom number tells you ",
        selectBlank("how many equal parts the whole is split into", ["how many parts are shaded", "how many wholes there are"]),
        ", and the top number tells you ",
        selectBlank("how many of those equal parts are shaded", ["how many equal parts the whole is split into", "the size of the whole"]),
        "."
      ),
    },
  ];
}

// Q9 — generalization/true-false trap (choice, no visual)
export function generalizationTrapQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or False: As long as you shade some parts of a shape, you can call the shaded amount a fraction.",
          hint: "Think about the unequal-parts picture — does shading some parts always count?",
          explain: "False — the shape has to be split into EQUAL parts first. Shading some unequal parts doesn't name a fraction.",
        },
        "False",
        ["True"]
      ),
    },
  ];
}

export const whatAFractionIsTest: Unit["test"] = {
  questions: [
    unitFractionQuestion("easy"),
    nonUnitFractionQuestion("easy"),
    buildFractionQuestion("easy"),
    trapQuestion("medium"),
    unitFractionQuestion("medium"),
    nonUnitTextQuestion,
    trapQuestion("hard"),
    vocabularySentenceQuestion,
    generalizationTrapQuestion,
    buildFractionQuestion("hard"),
  ],
  passScore: 9,
};
