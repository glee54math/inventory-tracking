import { TilingGrid } from "../diagrams/TilingGrid";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies of AreaMultiplyingSideLengths.tsx's data — not an import,
// same "every *Test.tsx keeps its own local data" convention this codebase
// uses to avoid a *Test.tsx <-> unit-file circular import.
const RUG_ITEMS = ["rug", "tile floor", "garden bed", "bulletin board", "poster"] as const;

// Q1, Q2 — direct multiply
function directMultiplyQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const length = randInt(3, difficulty === "easy" ? 6 : 9);
    const width = randInt(3, difficulty === "easy" ? 6 : 9);
    const area = length * width;
    return [
      {
        visual: <TilingGrid rows={length} cols={width} mode="full" dimLabels />,
        difficulty,
        step: {
          kind: "number",
          prompt: `A rectangle has a length of ${length} and a width of ${width}. What is its area?`,
          hint: `${length} × ${width} = ?`,
          explain: `${length} × ${width} = ${area} square units.`,
          answer: area,
        },
      },
    ];
  };
}

// Q3 — choice, the named misconception: multiply for area, not add
function multiplyNotAddQuestion(): TestQuestion[] {
  // Reroll rectangles whose area equals their perimeter (4 × 4, 6 × 3), or
  // the perimeter distractor would collide with the correct answer.
  let length = randInt(4, 9);
  let width = randInt(3, 8);
  while (length * width === 2 * length + 2 * width) {
    length = randInt(4, 9);
    width = randInt(3, 8);
  }
  const area = length * width;
  const perimeter = 2 * length + 2 * width;
  return [
    {
      visual: <TilingGrid rows={length} cols={width} mode="full" dimLabels />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `This rectangle is ${length} by ${width}. What is its AREA?`,
          hint: "Area multiplies the two side lengths — it doesn't add them.",
          explain: `Area = ${length} × ${width} = ${area}. (${perimeter} would be the perimeter — ${length} + ${width} + ${length} + ${width} — not the area.)`,
        },
        String(area),
        [String(perimeter), String(length + width)]
      ),
    },
  ];
}

// Q4, Q5 — missing side (unknown-factor / division)
function missingSideQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const known = randInt(3, 9);
    const other = randInt(3, difficulty === "hard" ? 9 : 7);
    const area = known * other;
    return [
      {
        visual: <TilingGrid rows={known} cols={other} mode="edges-only" dimLabels />,
        difficulty,
        step: {
          kind: "number",
          prompt: `A rectangle has an area of ${area} square units. One side is ${known} units. What is the other side?`,
          hint: `${known} × what = ${area}? Divide: ${area} ÷ ${known} = ?`,
          explain: `${area} ÷ ${known} = ${other}.`,
          answer: other,
        },
      },
    ];
  };
}

// Q6 — choice, division-as-inverse named directly
function inverseOperationQuestion(): TestQuestion[] {
  const known = randInt(4, 8);
  const other = randInt(4, 8);
  const area = known * other;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `A rectangle's area is ${area} and one side is ${known}. What operation finds the other side?`,
          hint: "Which operation undoes multiplication?",
          explain: `Division undoes multiplication: ${area} ÷ ${known} = ${other}.`,
        },
        "Divide the area by the known side",
        ["Subtract the known side from the area", "Multiply the area by the known side"]
      ),
    },
  ];
}

// Q7, Q8 — real-world word problems
function wordProblemQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const item = pick(RUG_ITEMS);
    const length = randInt(4, 10);
    const width = randInt(3, 8);
    const area = length * width;
    return [
      {
        visual: <TilingGrid rows={length} cols={width} mode="edges-only" dimLabels />,
        difficulty,
        step: {
          kind: "number",
          prompt: `A ${item} is ${length} feet long and ${width} feet wide. How many square feet of floor space does it cover?`,
          hint: `${length} × ${width} = ?`,
          explain: `${length} × ${width} = ${area} square feet.`,
          answer: area,
        },
      },
    ];
  };
}

// Q9 — verify-by-tiling: judge a claimed product against the actual tiled count
function verifyTilingQuestion(): TestQuestion[] {
  const rows = randInt(3, 7);
  const cols = randInt(3, 7);
  const correctProduct = rows * cols;
  const candidates = [-2, -1, 1, 2].filter((d) => correctProduct + d > 0);
  const wrongProduct = correctProduct + pick(candidates);
  const claimedIsRight = Math.random() < 0.5;
  const claimed = claimedIsRight ? correctProduct : wrongProduct;
  return [
    {
      visual: <TilingGrid rows={rows} cols={cols} mode="full" dimLabels />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `A classmate says this ${rows} × ${cols} rectangle has an area of ${claimed} square units. Are they correct?`,
          hint: `${rows} × ${cols} = ?`,
          explain: claimedIsRight ? `Yes — ${rows} × ${cols} = ${correctProduct}, which matches.` : `No — ${rows} × ${cols} = ${correctProduct}, not ${claimed}.`,
        },
        claimedIsRight ? "Yes, that's correct" : "No, that's not correct",
        [claimedIsRight ? "No, that's not correct" : "Yes, that's correct"]
      ),
    },
  ];
}

// Q10 — hard missing-side word problem, combines the real-world framing
// with the division-as-inverse skill
function missingSideWordQuestion(): TestQuestion[] {
  const width = randInt(4, 9);
  const length = randInt(4, 9);
  const area = width * length;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `A garden bed covers ${area} square feet. It is ${width} feet wide. How long is it?`,
        hint: `${width} × what = ${area}? Divide: ${area} ÷ ${width} = ?`,
        explain: `${area} ÷ ${width} = ${length} feet.`,
        answer: length,
      },
    },
  ];
}

export const areaMultiplyingSideLengthsTest: Unit["test"] = {
  questions: [
    directMultiplyQuestion("easy"),
    directMultiplyQuestion("easy"),
    multiplyNotAddQuestion,
    missingSideQuestion("medium"),
    missingSideQuestion("medium"),
    inverseOperationQuestion,
    wordProblemQuestion("medium"),
    wordProblemQuestion("hard"),
    verifyTilingQuestion,
    missingSideWordQuestion,
  ],
  passScore: 9,
};

// Generators re-exported for the cumulative Module Test.
export { directMultiplyQuestion, multiplyNotAddQuestion, missingSideQuestion, inverseOperationQuestion, wordProblemQuestion, verifyTilingQuestion, missingSideWordQuestion };
