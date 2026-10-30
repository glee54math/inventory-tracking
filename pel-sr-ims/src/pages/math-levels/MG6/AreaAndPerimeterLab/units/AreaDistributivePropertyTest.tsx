import { RectanglePieces } from "../diagrams/RectanglePieces";
import { pieceArea, splitRectangleAt, type AreaPiece } from "../lib/grid";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Self-contained — no import from AreaDistributiveProperty.tsx (that file
// imports this one; importing back would be a circular import). lib/grid.ts
// is a leaf module both files share safely.

// Q1, Q2 — given split: total area
function splitTotalQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const rows = randInt(3, difficulty === "easy" ? 6 : 9);
    const cols = randInt(5, difficulty === "easy" ? 9 : 12);
    const splitAt = randInt(2, cols - 2);
    const [a, b] = splitRectangleAt(rows, cols, splitAt);
    return [
      {
        visual: <RectanglePieces pieces={[{ ...a, label: `${rows} × ${a.w}` }, { ...b, label: `${rows} × ${b.w}` }]} cellPx={24} showGrid />,
        difficulty,
        step: {
          kind: "number",
          prompt: `Find each part's area, then add. What is the total area of this ${rows} × ${cols} rectangle?`,
          hint: `${rows} × ${a.w} + ${rows} × ${b.w}`,
          explain: `${pieceArea(a)} + ${pieceArea(b)} = ${rows * cols}.`,
          answer: rows * cols,
        },
      },
    ];
  };
}

// Q3 — one part's area, where the named mistake is using the wrong height
function onePartQuestion(): TestQuestion[] {
  const rows = randInt(3, 8);
  const cols = randInt(6, 11);
  const splitAt = randInt(2, cols - 2);
  const [a, b] = splitRectangleAt(rows, cols, splitAt);
  return [
    {
      visual: <RectanglePieces pieces={[{ ...a, label: `${rows} × ${a.w}` }, { ...b, label: "?" }]} cellPx={24} showGrid />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `The ${rows} × ${cols} rectangle is cut after column ${a.w}. What is the area of the RIGHT part?`,
        hint: `The right part is ${b.w} columns wide — and still the full ${rows} rows tall.`,
        explain: `${rows} × ${b.w} = ${pieceArea(b)}.`,
        answer: pieceArea(b),
      },
    },
  ];
}

// Q4 — choice: which split matches the fact. Distractors carry the
// "wrong dimension" mistake (the second part loses the full height).
function matchSplitQuestion(): TestQuestion[] {
  const cols = randInt(6, 9);
  const rest = cols - 5;
  let rows = randInt(3, 9);
  while (rows === 5 || rows === rest) rows = randInt(3, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `Which of these equals ${rows} × ${cols}?`,
          hint: `Split ${cols} into 5 + ${rest}; both parts keep the ${rows}.`,
          explain: `${rows} × ${cols} = ${rows} × 5 + ${rows} × ${rest}.`,
        },
        `${rows} × 5 + ${rows} × ${rest}`,
        [
          `${rows} × 5 + ${rest} × ${rest}`, // second part lost the full height
          `${rows} × 5 + 5 × ${rest}`, // reused the first part's width as a height
          `${rows} + 5 × ${rest}`, // dropped the multiplication on one part
        ]
      ),
    },
  ];
}

// Q5, Q6 — friendly split, numeric
function friendlySplitQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const rows = randInt(4, 9);
    const cols = randInt(6, 9);
    const [a, b] = splitRectangleAt(rows, cols, 5);
    return [
      {
        visual: <RectanglePieces pieces={[a, { ...b, label: `${rows} × ${b.w}` }]} cellPx={22} showGrid />,
        difficulty,
        step: {
          kind: "number",
          prompt: `Use the split ${rows} × 5 + ${rows} × ${b.w} to find ${rows} × ${cols}.`,
          hint: `${rows * 5} + ${rows} × ${b.w} = ?`,
          explain: `${rows * 5} + ${pieceArea(b)} = ${rows * cols}.`,
          answer: rows * cols,
        },
      },
    ];
  };
}

// Q7 — two different splits compared (numeric totals)
function twoSplitsQuestion(): TestQuestion[] {
  const rows = randInt(3, 8);
  const cols = randInt(6, 12);
  const s1 = randInt(1, cols - 1);
  let s2 = randInt(1, cols - 1);
  while (s2 === s1 || s2 === cols - s1) s2 = randInt(1, cols - 1);
  const [a1, b1] = splitRectangleAt(rows, cols, s1);
  const [a2, b2] = splitRectangleAt(rows, cols, s2);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <RectanglePieces pieces={[a1, b1]} cellPx={18} caption="Split 1" />
          <RectanglePieces pieces={[a2, b2]} cellPx={18} caption="Split 2" />
        </div>
      ),
      difficulty: "hard",
      step: {
        kind: "ratio",
        tones: "none",
        labels: ["Split 1 total", "Split 2 total"],
        prompt: "What total area does each split give?",
        hint: "Add each split's two labeled parts.",
        explain: `Both are ${rows * cols} — the same rectangle, split differently.`,
        answer: [rows * cols, rows * cols],
      },
    },
  ];
}

// Q8 — true/false generalization. Distractors: "only sometimes" (one-off
// trick misconception) and "bigger pieces give more" (size misconception).
function alwaysTrueQuestion(): TestQuestion[] {
  const rows = randInt(3, 8);
  const cols = randInt(7, 12);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `True or False: no matter where you make one straight cut across a ${rows} × ${cols} rectangle, the two parts always add up to ${rows * cols}.`,
          hint: "Does cutting ever add or remove a unit square?",
          explain: "True — every unit square ends up in exactly one part, so the parts always add back up to the whole.",
        },
        "True — it works for every cut",
        ["False — it only works for some cuts", "False — a cut near the middle gives a bigger total"]
      ),
    },
  ];
}

// Q9 — two joined rectangles of different heights (bridge to Unit 4)
function joinedRectanglesQuestion(): TestQuestion[] {
  const h1 = randInt(4, 8);
  let h2 = randInt(2, 7);
  while (h2 === h1) h2 = randInt(2, 7);
  const w1 = randInt(2, 6);
  const w2 = randInt(2, 6);
  const top = Math.max(h1, h2);
  const pieces: AreaPiece[] = [
    { x: 0, y: top - h1, w: w1, h: h1, tone: "a" },
    { x: w1, y: top - h2, w: w2, h: h2, tone: "b" },
  ];
  return [
    {
      visual: <RectanglePieces pieces={pieces} cellPx={22} showGrid />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: "This shape is two rectangles joined together. What is its total area?",
        hint: `Use each rectangle's OWN height: ${h1} × ${w1} + ${h2} × ${w2}.`,
        explain: `${h1 * w1} + ${h2 * w2} = ${h1 * w1 + h2 * w2}.`,
        answer: h1 * w1 + h2 * w2,
      },
    },
  ];
}

// Q10 — choice: why splitting works. Distractors: double-counting and
// "multiply the parts" (the operation confusion).
function whyItWorksQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "Why does adding the two parts' areas give the same answer as multiplying the whole rectangle?",
          hint: "Think about where one single unit square ends up after the cut.",
          explain: "Each unit square lands in exactly one part, so adding the parts counts every square exactly once — the same as the whole.",
        },
        "Every unit square ends up in exactly one part, so each is counted once",
        ["The squares on the cut line get counted twice, which evens out", "You multiply the two parts' areas together, which gives the whole"]
      ),
    },
  ];
}

export const areaDistributivePropertyTest: Unit["test"] = {
  questions: [
    splitTotalQuestion("easy"),
    splitTotalQuestion("medium"),
    onePartQuestion,
    matchSplitQuestion,
    friendlySplitQuestion("medium"),
    friendlySplitQuestion("hard"),
    twoSplitsQuestion,
    alwaysTrueQuestion,
    joinedRectanglesQuestion,
    whyItWorksQuestion,
  ],
  passScore: 9,
};

// Generators re-exported for the cumulative Module Test.
export { splitTotalQuestion, onePartQuestion, matchSplitQuestion, friendlySplitQuestion, twoSplitsQuestion, alwaysTrueQuestion, joinedRectanglesQuestion, whyItWorksQuestion };
