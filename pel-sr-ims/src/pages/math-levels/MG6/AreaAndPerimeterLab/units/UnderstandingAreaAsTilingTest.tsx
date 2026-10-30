import { TilingGrid } from "../diagrams/TilingGrid";
import { cellsWithNotch, countArea } from "../lib/grid";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies of UnderstandingAreaAsTiling.tsx's helpers — not an
// import, same "every *Test.tsx keeps its own local data" convention noted
// throughout this codebase (a *Test.tsx importing back from its paired unit
// file threw a real circular-import bug once — see MATH_TSX_STYLE_GUIDE.txt
// section 11 and MG9's ConversionsTest.tsx comment for the history).
function randomNotch(rows: number, cols: number) {
  const nh = randInt(1, Math.max(1, rows - 2));
  const nw = randInt(1, Math.max(1, cols - 2));
  const r0 = Math.random() < 0.5 ? 0 : rows - nh;
  const c0 = Math.random() < 0.5 ? 0 : cols - nw;
  return { r0, r1: r0 + nh, c0, c1: c0 + nw };
}

function twoFactorPairs(area: number, lo = 2, hi = 9): [[number, number], [number, number]] | null {
  const pairs: [number, number][] = [];
  for (let a = lo; a <= hi; a++) {
    if (area % a !== 0) continue;
    const b = area / a;
    if (b < lo || b > hi) continue;
    if (!pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) pairs.push([a, b]);
  }
  if (pairs.length < 2) return null;
  const shuffled = shuffle(pairs);
  return [shuffled[0], shuffled[1]];
}

const COMPARE_AREAS = [12, 16, 18, 20, 24, 30, 36, 40];

// Q1, Q2 — full-grid counting
function fullGridQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const rows = randInt(3, difficulty === "easy" ? 5 : 8);
    const cols = randInt(3, difficulty === "easy" ? 6 : 9);
    const area = rows * cols;
    return [
      {
        visual: <TilingGrid rows={rows} cols={cols} mode="full" dimLabels />,
        difficulty,
        step: {
          kind: "number",
          prompt: "How many unit squares does it take to cover this shape?",
          hint: "Count every square — a row at a time is faster than one by one.",
          explain: `${rows} rows × ${cols} columns = ${area} unit squares.`,
          answer: area,
        },
      },
    ];
  };
}

// Q3, Q4 — partial-grid counting (mental extension)
function partialGridQuestion(): TestQuestion[] {
  const rows = randInt(3, 7);
  const cols = randInt(3, 8);
  const area = rows * cols;
  return [
    {
      visual: <TilingGrid rows={rows} cols={cols} mode="edges-only" dimLabels />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: "Only some grid lines are drawn. How many unit squares would cover this whole shape?",
        hint: `Extend the ${rows}-row, ${cols}-column grid mentally, then count.`,
        explain: `${rows} × ${cols} = ${area} unit squares.`,
        answer: area,
      },
    },
  ];
}

// Q5 — choice, area vs. perimeter conflation on one fixed-shape fully tiled
// rectangle: the misconception-targeted distractor is the PERIMETER count,
// not the area.
function areaNotPerimeterQuestion(): TestQuestion[] {
  // 4 × 4 and 3 × 6 have area === perimeter (16, 18) — the perimeter
  // distractor would collide with the correct answer, so reroll those
  // (caught by the brute-force verification script).
  let rows = randInt(3, 6);
  let cols = randInt(3, 7);
  while (rows * cols === 2 * rows + 2 * cols) {
    rows = randInt(3, 6);
    cols = randInt(3, 7);
  }
  const area = rows * cols;
  const perimeter = 2 * rows + 2 * cols;
  return [
    {
      visual: <TilingGrid rows={rows} cols={cols} mode="full" dimLabels />,
      difficulty: "medium",
      step: choice(
        {
          prompt: "What is the AREA of this shape — the number of unit squares that cover it?",
          hint: "Area counts the squares INSIDE the shape, not the edges around its border.",
          explain: `The area is ${area} unit squares (${rows} × ${cols}). ${perimeter} would be the PERIMETER — the distance around the border — not the area.`,
        },
        String(area),
        [String(perimeter)]
      ),
    },
  ];
}

// Q6, Q7 — rectilinear (non-rectangular) counting
function rectilinearQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const rows = randInt(4, difficulty === "medium" ? 6 : 7);
    const cols = randInt(4, difficulty === "medium" ? 6 : 7);
    const notch = randomNotch(rows, cols);
    const cells = cellsWithNotch(rows, cols, notch);
    const area = countArea(cells);
    return [
      {
        visual: <TilingGrid rows={rows} cols={cols} cells={cells} mode="full" />,
        difficulty,
        step: {
          kind: "number",
          prompt: "This shape isn't a plain rectangle. How many unit squares actually cover it?",
          hint: "Count only the shaded squares — skip the missing corner.",
          explain: `${area} unit squares cover this shape (the full rectangle would have been ${rows * cols}).`,
          answer: area,
        },
      },
    ];
  };
}

// Q8 — choice: two different-shaped rectangles, same area. Misconception-
// targeted distractors: assuming whichever shape LOOKS bigger has more area.
function sameAreaChoiceQuestion(): TestQuestion[] {
  let areaChoice = pick(COMPARE_AREAS);
  let factorPairs = twoFactorPairs(areaChoice);
  while (!factorPairs) {
    areaChoice = pick(COMPARE_AREAS);
    factorPairs = twoFactorPairs(areaChoice);
  }
  const [[r1, c1], [r2, c2]] = factorPairs;
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <TilingGrid rows={r1} cols={c1} mode="full" caption={`Shape A: ${r1} × ${c1}`} />
          <TilingGrid rows={r2} cols={c2} mode="full" caption={`Shape B: ${r2} × ${c2}`} />
        </div>
      ),
      difficulty: "hard",
      step: choice(
        {
          prompt: "Do Shape A and Shape B have the same area?",
          hint: "Multiply each shape's rows by its columns and compare.",
          explain: `Shape A: ${r1} × ${c1} = ${r1 * c1}. Shape B: ${r2} × ${c2} = ${r2 * c2}. They're equal, even though the shapes look different.`,
        },
        "Yes — they have the same area",
        [`No — Shape A has more area`, `No — Shape B has more area`]
      ),
    },
  ];
}

// Q9 — ratio-style: compute both shapes' areas directly (reinforces the
// skill the choice question above only tests indirectly).
function compareAreasNumberQuestion(): TestQuestion[] {
  let areaChoice = pick(COMPARE_AREAS);
  let factorPairs = twoFactorPairs(areaChoice);
  while (!factorPairs) {
    areaChoice = pick(COMPARE_AREAS);
    factorPairs = twoFactorPairs(areaChoice);
  }
  const [[r1, c1], [r2, c2]] = factorPairs;
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <TilingGrid rows={r1} cols={c1} mode="full" caption={`Shape A: ${r1} × ${c1}`} />
          <TilingGrid rows={r2} cols={c2} mode="full" caption={`Shape B: ${r2} × ${c2}`} />
        </div>
      ),
      difficulty: "hard",
      step: {
        kind: "ratio",
        tones: "none",
        labels: ["Shape A's area", "Shape B's area"],
        prompt: "What is the area of Shape A, and what is the area of Shape B?",
        hint: "Count or multiply each shape's rows by its columns separately.",
        explain: `Shape A: ${r1} × ${c1} = ${r1 * c1}. Shape B: ${r2} × ${c2} = ${r2 * c2}.`,
        answer: [r1 * c1, r2 * c2],
      },
    },
  ];
}

// Q10 — true/false generalization trap: a square and a non-square rectangle
// built from the SAME number of unit squares don't have to look the same —
// extends the plan's "shapes can look different but have equal area" idea
// to its converse (equal area doesn't force the same shape).
function sameShapeTrapQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or False: if two rectangles are built from the same number of unit squares, they must look exactly the same (same number of rows and columns).",
          hint: "Think about Shape A and Shape B from practice — same area, 3 × 8 versus 4 × 6.",
          explain: "False — the same area (like 24 square units) can come from more than one rectangle shape: 3 × 8, 4 × 6, 2 × 12, and more all equal 24.",
        },
        "False — the same area can come from more than one rectangle shape",
        ["True — equal area always means the exact same rows and columns"]
      ),
    },
  ];
}

export const understandingAreaAsTilingTest: Unit["test"] = {
  questions: [
    fullGridQuestion("easy"),
    fullGridQuestion("easy"),
    partialGridQuestion,
    partialGridQuestion,
    areaNotPerimeterQuestion,
    rectilinearQuestion("medium"),
    rectilinearQuestion("hard"),
    sameAreaChoiceQuestion,
    compareAreasNumberQuestion,
    sameShapeTrapQuestion,
  ],
  passScore: 9,
};

// Generators re-exported for the cumulative Module Test.
export { fullGridQuestion, partialGridQuestion, areaNotPerimeterQuestion, rectilinearQuestion, sameAreaChoiceQuestion, compareAreasNumberQuestion, sameShapeTrapQuestion };
