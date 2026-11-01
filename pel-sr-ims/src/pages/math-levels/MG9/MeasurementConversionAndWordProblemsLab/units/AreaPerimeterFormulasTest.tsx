import { RectPlot } from "../diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { rectOk, sameAreaPair, samePerimeterPair, uniq } from "../lib/measures";

// ---------- end-of-unit test: Area & Perimeter Formulas in Context ----------
// 10 questions. Rectangle helpers come from ../lib/measures (leaf module) —
// never from AreaPerimeterFormulas.tsx, which imports this file.

const LEN_UNITS = ["ft", "m", "yd", "cm", "in"] as const;

/** l × w with l ≠ w and area ≠ perimeter (so the wrong formula is always a
 *  different number). `big` = two-digit sides (2-digit × 2-digit area). */
export function rect(big = false): [number, number] {
  for (;;) {
    const l = big ? randInt(12, 25) : randInt(3, 12);
    const w = big ? randInt(11, 15) : randInt(2, 9);
    if (rectOk(l, w) && l > w) return [l, w];
  }
}

// Q1, Q3 — area from length and width.
export function areaQuestion(difficulty: "easy" | "hard"): () => TestQuestion[] {
  return () => {
    const [l, w] = rect(difficulty === "hard");
    const u = pick(LEN_UNITS);
    const thing = pick(["rug", "garden", "classroom floor", "poster", "patio"]);
    return [
      {
        visual: difficulty === "easy" ? <RectPlot l={l} w={w} unit={u} /> : null,
        difficulty,
        step: {
          kind: "number",
          prompt: difficulty === "easy" ? `This rectangle is ${l} ${u} long and ${w} ${u} wide. What is its area?` : `A rectangular ${thing} is ${l} ${u} long and ${w} ${u} wide. What is its area?`,
          suffix: `sq ${u}`,
          hint: "Area = length × width.",
          explain: `${l} × ${w} = ${l * w} square ${u}.`,
          answer: l * w,
        },
      },
    ];
  };
}

// Q2 — perimeter from length and width. Easy.
export function perimeterQuestion(): TestQuestion[] {
  const [l, w] = rect();
  const u = pick(LEN_UNITS);
  return [
    {
      visual: <RectPlot l={l} w={w} unit={u} fill={false} trace />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `This rectangle is ${l} ${u} long and ${w} ${u} wide. What is its perimeter?`,
        suffix: u,
        hint: "Perimeter = 2 × length + 2 × width.",
        explain: `2 × ${l} + 2 × ${w} = ${2 * l} + ${2 * w} = ${2 * (l + w)} ${u}.`,
        answer: 2 * (l + w),
      },
    },
  ];
}

// Q4 — which formula does the story need? Distractors: area (wrong
// formula), l + w (only two sides), 2l + w (one side forgotten).
export function areaOrPerimeterChoiceQuestion(): TestQuestion[] {
  const [l, w] = rect();
  const askArea = Math.random() < 0.5;
  const area = l * w;
  const per = 2 * (l + w);
  const correct = String(askArea ? area : per);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: askArea
            ? `How many square feet of carpet cover a floor ${l} ft by ${w} ft?`
            : `How many feet of fence go all the way around a yard ${l} ft by ${w} ft?`,
          hint: askArea ? "Covering the inside → area." : "Going around the outside → perimeter.",
          explain: askArea ? `Carpet covers the inside: ${l} × ${w} = ${area}.` : `Fence goes around: 2 × ${l} + 2 × ${w} = ${per}.`,
        },
        correct,
        uniq(
          [
            String(askArea ? per : area), // wrong formula
            String(l + w), // only two sides
            String(2 * l + w), // a side forgotten (half-remembered perimeter formula)
          ],
          correct
        )
      ),
    },
  ];
}

// Q5 — missing side from AREA (divide). Medium.
export function missingFromAreaQuestion(): TestQuestion[] {
  const known = randInt(3, 9);
  const missing = randInt(6, 25);
  const A = known * missing;
  const u = pick(LEN_UNITS);
  return [
    {
      visual: <RectPlot l={null} w={known} drawL={missing} unit={u} inside={`Area = ${A} sq ${u}`} />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `This rectangle's AREA is ${A} square ${u}. One side is ${known} ${u}. How long is the other side?`,
        suffix: u,
        hint: `${known} × ? = ${A}. Undo the multiplying: divide.`,
        explain: `${A} ÷ ${known} = ${missing} ${u}.`,
        answer: missing,
      },
    },
  ];
}

// Q6 — missing side from PERIMETER (subtract two lengths, halve). Hard.
export function missingFromPerimeterQuestion(): TestQuestion[] {
  const l = randInt(8, 30);
  const w = randInt(3, l - 1);
  const P = 2 * (l + w);
  const u = pick(LEN_UNITS);
  return [
    {
      visual: <RectPlot l={l} w={null} drawW={w} unit={u} fill={false} trace inside={`Perimeter = ${P} ${u}`} />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `This rectangle's PERIMETER is ${P} ${u}. Its length is ${l} ${u}. What is its width?`,
        suffix: u,
        hint: `The two lengths use ${2 * l}. The two widths share what's left.`,
        explain: `${P} − ${2 * l} = ${P - 2 * l}, and ${P - 2 * l} ÷ 2 = ${w} ${u}.`,
        answer: w,
      },
    },
  ];
}

// Q7 — area 'undo', choice. Distractors: the PERIMETER undo ((A − 2s) ÷ 2,
// the plan's core confusion), subtracting instead of dividing, multiplying.
export function missingAreaChoiceQuestion(): TestQuestion[] {
  const s = randInt(3, 8);
  const w = randInt(4, 12);
  const A = s * w;
  const correct = String(w);
  const perUndo = (A - 2 * s) / 2;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `A rectangle has an AREA of ${A} square units, and one side is ${s} units. How long is the other side?`,
          hint: "Area = length × width, so undo it by dividing.",
          explain: `${s} × ? = ${A}, so ? = ${A} ÷ ${s} = ${w}. (Halving after subtracting is what you'd do for PERIMETER.)`,
        },
        correct,
        uniq(
          [
            ...(Number.isInteger(perUndo) && perUndo > 0 ? [String(perUndo)] : []), // perimeter's undo
            String(A - s), // subtracted instead of divided
            String(A * s), // multiplied again
          ],
          correct
        )
      ),
    },
  ];
}

// Q8 — perimeter 'undo', choice. Distractors: forgot to halve (P − 2l),
// subtracted only one length (P − l), halved but never subtracted (P ÷ 2).
export function missingPerimeterChoiceQuestion(): TestQuestion[] {
  const [l, w] = rect();
  const P = 2 * (l + w);
  const correct = String(w);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `A rectangle has a PERIMETER of ${P} units and a length of ${l} units. What is its width?`,
          hint: "Two lengths AND two widths go around.",
          explain: `${P} − 2 × ${l} = ${P - 2 * l}, shared by two widths: ${P - 2 * l} ÷ 2 = ${w}.`,
        },
        correct,
        uniq(
          [
            String(P - 2 * l), // forgot to halve
            String(P - l), // subtracted only one length
            String(P / 2), // halved, never subtracted
          ],
          correct
        )
      ),
    },
  ];
}

// Q9 — same perimeter, different area (two boxes). Hard.
export function samePerimeterQuestion(): TestQuestion[] {
  const [[l1, w1], [l2, w2]] = samePerimeterPair();
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <RectPlot l={l1} w={w1} unit="m" caption="Pen A" maxW={260} />
          <RectPlot l={l2} w={w2} unit="m" caption="Pen B" maxW={260} />
        </div>
      ),
      difficulty: "hard",
      step: {
        kind: "ratio",
        tones: "none",
        frame: ["A:", "B:", "sq m"],
        labels: ["A's area", "B's area"],
        prompt: `Both dog pens use ${2 * (l1 + w1)} m of fence. What is the area of each pen?`,
        hint: `${l1} × ${w1}, and ${l2} × ${w2}.`,
        explain: `A: ${l1 * w1} sq m. B: ${l2 * w2} sq m. Same fence, different amount of room.`,
        answer: [l1 * w1, l2 * w2],
      },
    },
  ];
}

// Q10 — same area, which has the longer perimeter? Distractor "Neither"
// targets "same area means same perimeter."
export function sameAreaChoiceQuestion(): TestQuestion[] {
  const [[l1, w1], [l2, w2]] = sameAreaPair();
  const p1 = 2 * (l1 + w1);
  const p2 = 2 * (l2 + w2);
  return [
    {
      visual: (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <RectPlot l={l1} w={w1} unit="ft" caption="Garden A" maxW={260} />
          <RectPlot l={l2} w={w2} unit="ft" caption="Garden B" maxW={260} />
        </div>
      ),
      difficulty: "hard",
      step: choice(
        {
          prompt: `Both gardens cover ${l1 * w1} square feet. Which needs MORE fence to go around it?`,
          hint: "Find 2 × length + 2 × width for each.",
          explain: `A: ${p1} ft. B: ${p2} ft. Equal areas can have different perimeters.`,
        },
        p1 > p2 ? "Garden A" : "Garden B",
        [p1 > p2 ? "Garden B" : "Garden A", "Neither — same area means the same fence"]
      ),
    },
  ];
}

export const areaPerimeterFormulasTest: Unit["test"] = {
  questions: [
    areaQuestion("easy"),
    perimeterQuestion,
    areaQuestion("hard"),
    areaOrPerimeterChoiceQuestion,
    missingFromAreaQuestion,
    missingFromPerimeterQuestion,
    missingAreaChoiceQuestion,
    missingPerimeterChoiceQuestion,
    samePerimeterQuestion,
    sameAreaChoiceQuestion,
  ],
  passScore: 9,
};
