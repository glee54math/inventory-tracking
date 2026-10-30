import { PolygonOutline } from "../diagrams/PolygonOutline";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies of Perimeter.tsx's helpers — no import from the unit file
// (circular-import convention used by every *Test.tsx in this app).
const UNITS = ["cm", "in", "ft", "m"] as const;

function polygonSides(n: number): number[] {
  for (;;) {
    const s = Array.from({ length: n }, () => randInt(2, 12));
    const total = s.reduce((a, b) => a + b, 0);
    if (Math.max(...s) < total - Math.max(...s)) return s;
  }
}

function samePerimeterPair(): [[number, number], [number, number]] {
  const half = randInt(8, 14);
  const ws = shuffle(Array.from({ length: Math.floor((half - 1) / 2) }, (_, i) => i + 1).filter((w) => w >= 2 && half - w <= 12));
  const [w1, w2] = ws;
  return [
    [half - w1, w1],
    [half - w2, w2],
  ];
}

function sameAreaPair(): [[number, number], [number, number]] {
  for (;;) {
    const area = pick([12, 16, 18, 20, 24, 30, 36]);
    const pairs: [number, number][] = [];
    for (let w = 1; w * w <= area; w++) if (area % w === 0 && area / w <= 12) pairs.push([area / w, w]);
    if (pairs.length >= 2) {
      const [a, b] = shuffle(pairs);
      return [a, b];
    }
  }
}

/** A rectangle whose area and perimeter are different numbers (rules out
 *  e.g. 4 × 4 and 3 × 6, where both equal 16 / 18 — those would make an
 *  area-vs-perimeter question unanswerable by its own distractors). */
function distinctRect(): [number, number] {
  for (;;) {
    const l = randInt(3, 10);
    const w = randInt(2, 9);
    if (w !== l && l * w !== 2 * (l + w) && l * w !== l + w) return [l, w];
  }
}

// Q1 — polygon sum
function polygonSumQuestion(): TestQuestion[] {
  const n = randInt(3, 6);
  const sides = polygonSides(n);
  const unit = pick(UNITS);
  const p = sides.reduce((a, b) => a + b, 0);
  return [
    {
      visual: <PolygonOutline sides={sides} unit={unit} />,
      difficulty: "easy",
      step: { kind: "number", suffix: unit, prompt: "What is the perimeter of this shape?", hint: "Add every side.", explain: `${sides.join(" + ")} = ${p}.`, answer: p },
    },
  ];
}

// Q2, Q3 — rectangle from length and width only
function rectangleShortcutQuestion(difficulty: "easy" | "medium"): () => TestQuestion[] {
  return () => {
    const [l, w] = distinctRect();
    const unit = pick(UNITS);
    return [
      {
        visual: <PolygonOutline sides={[l, w, l, w]} rectangle hideLabels={[2, 3]} unit={unit} />,
        difficulty,
        step: {
          kind: "number",
          suffix: unit,
          prompt: `A rectangle is ${l} ${unit} long and ${w} ${unit} wide. What is its perimeter?`,
          hint: `2 × ${l} + 2 × ${w}`,
          explain: `2 × ${l} + 2 × ${w} = ${2 * (l + w)}.`,
          answer: 2 * (l + w),
        },
      },
    ];
  };
}

// Q4 — choice, rectangle perimeter with the two named mistakes as
// distractors: multiplying (area) and adding only two sides.
function perimeterNotAreaQuestion(): TestQuestion[] {
  const [l, w] = distinctRect();
  return [
    {
      visual: <PolygonOutline sides={[l, w, l, w]} rectangle hideLabels={[2, 3]} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `What is the PERIMETER of a ${l} by ${w} rectangle?`,
          hint: "Go all the way around: four sides.",
          explain: `${l} + ${w} + ${l} + ${w} = ${2 * (l + w)}. (${l * w} is the area; ${l + w} only covers two sides.)`,
        },
        String(2 * (l + w)),
        [String(l * w), String(l + w)]
      ),
    },
  ];
}

// Q5, Q6 — missing side
function missingSideQuestion(difficulty: "medium" | "hard"): () => TestQuestion[] {
  return () => {
    const n = difficulty === "medium" ? 4 : randInt(5, 6);
    const sides = polygonSides(n);
    const unit = pick(UNITS);
    const p = sides.reduce((a, b) => a + b, 0);
    const idx = randInt(0, n - 1);
    return [
      {
        visual: <PolygonOutline sides={sides.map((s, i) => (i === idx ? null : s))} unit={unit} />,
        difficulty,
        step: {
          kind: "number",
          suffix: unit,
          prompt: `The perimeter of this shape is ${p} ${unit}. How long is the missing side?`,
          hint: "Add the sides you can see, then subtract from the perimeter.",
          explain: `${p} − ${p - sides[idx]} = ${sides[idx]}.`,
          answer: sides[idx],
        },
      },
    ];
  };
}

// Q7 — missing rectangle width from perimeter (uses the shortcut backwards)
function missingRectangleSideQuestion(): TestQuestion[] {
  const [l, w] = distinctRect();
  const p = 2 * (l + w);
  return [
    {
      visual: <PolygonOutline sides={[l, null, l, null]} rectangle />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `A rectangle has a perimeter of ${p}. Its length is ${l}. What is its width?`,
        hint: `The two lengths use up 2 × ${l} = ${2 * l}. The two widths share what's left.`,
        explain: `${p} − ${2 * l} = ${p - 2 * l}, and ${p - 2 * l} ÷ 2 = ${w}.`,
        answer: w,
      },
    },
  ];
}

// Q8 — same perimeter, different area (ratio of the two areas)
function samePerimeterQuestion(): TestQuestion[] {
  const [[l1, w1], [l2, w2]] = samePerimeterPair();
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <PolygonOutline sides={[l1, w1, l1, w1]} rectangle hideLabels={[2, 3]} size={160} caption="A" />
          <PolygonOutline sides={[l2, w2, l2, w2]} rectangle hideLabels={[2, 3]} size={160} caption="B" />
        </div>
      ),
      difficulty: "hard",
      step: {
        kind: "ratio",
        tones: "none",
        labels: ["A's area", "B's area"],
        prompt: `Both rectangles have a perimeter of ${2 * (l1 + w1)}. What is each one's area?`,
        hint: `${l1} × ${w1}, and ${l2} × ${w2}.`,
        explain: `A: ${l1 * w1}. B: ${l2 * w2}. Same perimeter, different areas.`,
        answer: [l1 * w1, l2 * w2],
      },
    },
  ];
}

// Q9 — same area, different perimeter. Distractor "neither" targets the
// "same area means same perimeter" misconception.
function sameAreaQuestion(): TestQuestion[] {
  const [[l1, w1], [l2, w2]] = sameAreaPair();
  const p1 = 2 * (l1 + w1);
  const p2 = 2 * (l2 + w2);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <PolygonOutline sides={[l1, w1, l1, w1]} rectangle hideLabels={[2, 3]} size={160} caption="A" />
          <PolygonOutline sides={[l2, w2, l2, w2]} rectangle hideLabels={[2, 3]} size={160} caption="B" />
        </div>
      ),
      difficulty: "hard",
      step: choice(
        {
          prompt: `Both rectangles have an area of ${l1 * w1}. Which one has the LONGER perimeter?`,
          hint: `Find 2 × length + 2 × width for each.`,
          explain: `A: ${p1}. B: ${p2}. Equal areas can have different perimeters.`,
        },
        p1 > p2 ? "Rectangle A" : "Rectangle B",
        [p1 > p2 ? "Rectangle B" : "Rectangle A", "Neither — same area means the same perimeter"]
      ),
    },
  ];
}

// Q10 — discrimination: same two numbers, the student must decide which
// quantity a real-world question asks for. The wrong-operation answer is a
// numeric distractor, guaranteed distinct by distinctRect().
function discriminateQuestion(): TestQuestion[] {
  const [l, w] = distinctRect();
  const askArea = Math.random() < 0.5;
  const area = l * w;
  const per = 2 * (l + w);
  return [
    {
      visual: <PolygonOutline sides={[l, w, l, w]} rectangle hideLabels={[2, 3]} unit="ft" />,
      difficulty: "hard",
      step: choice(
        {
          prompt: askArea
            ? `How many square feet of grass seed are needed to cover a yard ${l} ft by ${w} ft?`
            : `How many feet of fence are needed to go all the way around a yard ${l} ft by ${w} ft?`,
          hint: askArea ? "Covering the inside — area." : "Going around the outside — perimeter.",
          explain: askArea ? `Covering is area: ${l} × ${w} = ${area}. (${per} would be the fence.)` : `Going around is perimeter: 2 × ${l} + 2 × ${w} = ${per}. (${area} would be the grass.)`,
        },
        String(askArea ? area : per),
        [String(askArea ? per : area), String(l + w)]
      ),
    },
  ];
}

export const perimeterTest: Unit["test"] = {
  questions: [
    polygonSumQuestion,
    rectangleShortcutQuestion("easy"),
    rectangleShortcutQuestion("medium"),
    perimeterNotAreaQuestion,
    missingSideQuestion("medium"),
    missingSideQuestion("hard"),
    missingRectangleSideQuestion,
    samePerimeterQuestion,
    sameAreaQuestion,
    discriminateQuestion,
  ],
  passScore: 9,
};

// Generators re-exported for the cumulative Module Test.
export { polygonSumQuestion, rectangleShortcutQuestion, perimeterNotAreaQuestion, missingSideQuestion, missingRectangleSideQuestion, samePerimeterQuestion, sameAreaQuestion, discriminateQuestion };
