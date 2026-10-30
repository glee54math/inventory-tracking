import { RectanglePieces } from "../diagrams/RectanglePieces";
import { lShapeNotes, makeLShape, pieceArea, totalArea, type AreaPiece, type LShape } from "../lib/grid";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies of CompositeRectilinearAreas.tsx's shape helpers — no
// import from the unit file (circular-import convention). lib/grid.ts is
// the shared leaf module that keeps the geometry identical in both.
function randomLShape(): LShape {
  const W = randInt(5, 10);
  const H = randInt(4, 9);
  const nw = randInt(2, W - 2);
  const nh = randInt(2, H - 2);
  return makeLShape(W, H, nw, nh);
}

function randomStaircase(): AreaPiece[] {
  const h3 = randInt(2, 4);
  const h2 = h3 + randInt(1, 2);
  const h1 = h2 + randInt(1, 3);
  const w = [randInt(2, 4), randInt(2, 4), randInt(2, 4)];
  const tones = ["a", "b", "c"] as const;
  const hs = [h1, h2, h3];
  let x = 0;
  return hs.map((h, i) => {
    const p: AreaPiece = { x, y: h1 - h, w: w[i], h, tone: tones[i] };
    x += w[i];
    return p;
  });
}

// Q1, Q2 — L-shape by decomposition
function lShapeQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const s = randomLShape();
    return [
      {
        visual: <RectanglePieces pieces={s.pieces} notes={lShapeNotes(s)} cellPx={22} showGrid={difficulty === "easy"} />,
        difficulty,
        step: {
          kind: "number",
          prompt: "This L-shape is split into two rectangles. What is its total area?",
          hint: "Find each rectangle's area (using its OWN height and width), then add.",
          explain: `${pieceArea(s.pieces[0])} + ${pieceArea(s.pieces[1])} = ${s.area}.`,
          answer: s.area,
        },
      },
    ];
  };
}

// Q3 — choice: the conflated "add the perimeters" misconception, plus the
// reused-height mistake as a second named distractor.
function additiveChoiceQuestion(): TestQuestion[] {
  const s = randomLShape();
  const [a, b] = s.pieces;
  const perimSum = 2 * (a.w + a.h) + 2 * (b.w + b.h);
  const reusedHeight = pieceArea(a) + b.w * s.H;
  // The two named-mistake values can coincide with each other (or, rarely,
  // with the answer) — dedupe so the choice list never shows a repeat
  // (caught by the brute-force verification script).
  const distractors = [...new Set([perimSum, reusedHeight])].filter((v) => v !== s.area).map(String);
  return [
    {
      visual: <RectanglePieces pieces={s.pieces} notes={lShapeNotes(s)} cellPx={22} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: "What is the area of this L-shape?",
          hint: "Add the two pieces' AREAS, and use each piece's own height.",
          explain: `${pieceArea(a)} + ${pieceArea(b)} = ${s.area}. (${perimSum} adds the pieces' perimeters; ${reusedHeight} wrongly gives the orange piece the full height ${s.H}.)`,
        },
        String(s.area),
        distractors
      ),
    },
  ];
}

// Q4, Q5 — three-or-more rectangles (staircase)
function staircaseQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const pieces = randomStaircase();
    const total = totalArea(pieces);
    return [
      {
        visual: <RectanglePieces pieces={pieces.map((p) => ({ ...p, label: `${p.h} × ${p.w}` }))} cellPx={22} showGrid={difficulty === "medium"} />,
        difficulty,
        step: {
          kind: "number",
          prompt: "This staircase is made of three rectangles. What is its total area?",
          hint: "Find each rectangle's area, then add all three.",
          explain: `${pieces.map((p) => pieceArea(p)).join(" + ")} = ${total}.`,
          answer: total,
        },
      },
    ];
  };
}

// Q6, Q7 — subtraction approach
function subtractQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const s = randomLShape();
    return [
      {
        visual: (
          <RectanglePieces
            pieces={s.pieces.map((p) => ({ ...p, label: "" }))}
            bounding={{ w: s.W, h: s.H }}
            notch={s.notch}
            notes={lShapeNotes(s, ["topLeft", "notchDepth", "notchWidth", "right"])}
            cellPx={22}
          />
        ),
        difficulty,
        step: {
          kind: "number",
          prompt: `A ${s.W} × ${s.H} rectangle has a ${s.nw} × ${s.nh} corner cut out. What is the area of the shape that's left?`,
          hint: `${s.W} × ${s.H} − ${s.nw} × ${s.nh}`,
          explain: `${s.W * s.H} − ${s.nw * s.nh} = ${s.area}.`,
          answer: s.area,
        },
      },
    ];
  };
}

// Q8 — missing dimension: one side length must be derived by subtraction
function missingSideQuestion(): TestQuestion[] {
  const s = randomLShape();
  return [
    {
      visual: <RectanglePieces pieces={[s.pieces[0], { ...s.pieces[1], label: "?" }]} notes={lShapeNotes(s, ["notchWidth", "right"])} cellPx={22} />,
      difficulty: "hard",
      step: {
        kind: "ratio",
        tones: "none",
        labels: ["orange width", "orange height"],
        frame: ["", " by ", ""],
        prompt: "The orange piece's sides aren't labeled. How wide and how tall is it?",
        hint: `Width: ${s.W} − ${s.W - s.nw}. Height: ${s.H} − ${s.nh} (not ${s.H}).`,
        explain: `Width ${s.W} − ${s.W - s.nw} = ${s.nw}; height ${s.H} − ${s.nh} = ${s.H - s.nh}.`,
        answer: [s.nw, s.H - s.nh],
      },
    },
  ];
}

// Q9 — missing dimension, full area
function missingSideAreaQuestion(): TestQuestion[] {
  const s = randomLShape();
  return [
    {
      visual: <RectanglePieces pieces={[s.pieces[0], { ...s.pieces[1], label: "?" }]} notes={lShapeNotes(s, ["notchWidth", "right"])} cellPx={22} />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: "Figure out the orange piece's missing sides, then find the area of the whole shape.",
        hint: `Orange: (${s.H} − ${s.nh}) tall and (${s.W} − ${s.W - s.nw}) wide. Then add the blue piece.`,
        explain: `Blue ${pieceArea(s.pieces[0])} + orange ${pieceArea(s.pieces[1])} = ${s.area}.`,
        answer: s.area,
      },
    },
  ];
}

// Q10 — choice: add or subtract the missing corner? Distractor is the named
// "added the missing piece instead of removing it" mistake.
function addOrSubtractQuestion(): TestQuestion[] {
  const s = randomLShape();
  const big = s.W * s.H;
  const cut = s.nw * s.nh;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `A ${s.W} × ${s.H} rectangle has a ${s.nw} × ${s.nh} corner missing. Which calculation gives the shape's area?`,
          hint: "The corner is NOT part of the shape.",
          explain: `${big} − ${cut} = ${s.area}: start with the whole rectangle and take away what's missing.`,
        },
        `${big} − ${cut} = ${s.area}`,
        [
          `${big} + ${cut} = ${big + cut}`, // added the missing piece instead of removing it
          `${s.W} × ${s.H} = ${big}`, // forgot to take the corner away at all
        ]
      ),
    },
  ];
}

export const compositeRectilinearAreasTest: Unit["test"] = {
  questions: [
    lShapeQuestion("easy"),
    lShapeQuestion("medium"),
    additiveChoiceQuestion,
    staircaseQuestion("medium"),
    staircaseQuestion("hard"),
    subtractQuestion("medium"),
    subtractQuestion("hard"),
    missingSideQuestion,
    missingSideAreaQuestion,
    addOrSubtractQuestion,
  ],
  passScore: 9,
};

// Generators re-exported for the cumulative Module Test.
export { lShapeQuestion, additiveChoiceQuestion, staircaseQuestion, subtractQuestion, missingSideQuestion, missingSideAreaQuestion, addOrSubtractQuestion };
