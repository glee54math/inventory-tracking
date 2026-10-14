// modules/WordProblems.tsx — real-world problems broken into steps.
// Each problem: read → decide what's being asked → compute in small steps → pick the unit.
import React, { useState } from "react";
import { CompositeFig, TrapezoidFig, TriangleFig } from "../shapes/area";
import { PrismFig, Solid3D, boxFaces, boxLabels, triPrismFaces, triPrismLabels } from "../shapes/solids";
import { CoordinatePlane } from "../shapes/coordinate";
import { type Step, StepSolver, Workbench } from "../components/ui";

export type WordProblem = {
  id: string;
  title: string;
  topic: string;
  story: React.ReactNode;
  figure: (focus: string[], stepIdx: number) => React.ReactNode;
  steps: Step[];
};

const ASK = ["Area", "Perimeter", "Volume", "Surface area"];
const asks = (answer: string, why: string): Step => ({
  prompt: "First, what is the question asking you to find?", answer, choices: ASK, explain: why,
  mistakes: [
    { value: "Perimeter", msg: "Perimeter is the distance around the edge. Is that what's being covered or filled here?" },
    { value: "Volume", msg: "Volume is the space inside a 3D object — how much it holds." },
    { value: "Surface area", msg: "Surface area covers every outside face of a 3D object." },
    { value: "Area", msg: "Area covers a flat surface. Re-read the question." },
  ].filter((m) => m.value !== answer),
});
const unitStep = (answer: string, choices: string[], why: string): Step => ({
  prompt: "Which unit goes with your answer?", answer, choices, explain: why,
});

export const WORD_PROBLEMS: WordProblem[] = [
  {
    id: "sod", title: "Sod for the yard", topic: "Area",
    story: <>Maya is covering her L-shaped backyard with sod. The yard is 12 ft across the bottom and 9 ft tall. A 5 ft by 4 ft patio corner doesn't get sod. How many square feet of sod does she need?</>,
    figure: (focus, i) => <CompositeFig W={12} H={9} cw={5} ch={4} unit="ft" split={i >= 1} focus={focus} known={[...(i > 1 ? ["top" as const] : []), ...(i > 3 ? ["right" as const] : [])]} />,
    steps: [
      asks("Area", "Sod covers a flat surface, so we need area."),
      { prompt: "Split the yard into rectangles A and B. How wide is the top edge of A?", answer: 7, unit: "ft", focus: ["top"], hint: "12 − 5" },
      { prompt: "Rectangle A is 7 ft by 9 ft. Its area?", answer: 63, unit: "sq ft", focus: ["A"] },
      { prompt: "How tall is the right edge of B?", answer: 5, unit: "ft", focus: ["right"], hint: "9 − 4" },
      { prompt: "Rectangle B is 5 ft by 5 ft. Its area?", answer: 25, unit: "sq ft", focus: ["B"] },
      { prompt: "Total sod needed = A + B = ?", answer: 88, focus: ["A", "B"], mistakes: [{ value: 108, msg: "That's 12 × 9, which includes the patio. Use A + B." }] },
      unitStep("square feet", ["feet", "square feet", "cubic feet"], "Area is measured in square units."),
    ],
  },
  {
    id: "sail", title: "Sailboat sail", topic: "Area",
    story: <>A sail is shaped like a right triangle. It is 6 ft along the bottom and 10 ft tall. How much fabric is in the sail?</>,
    figure: (focus) => <TriangleFig b={6} h={10} apex={0} showBox unit="ft" focus={focus} grid={false} />,
    steps: [
      asks("Area", "Fabric covers a flat shape — that's area."),
      { prompt: "Imagine the rectangle around the sail. Its area?", answer: 60, unit: "sq ft", focus: ["box"], hint: "6 × 10" },
      { prompt: "The sail is half of that rectangle. Fabric needed?", answer: 30, unit: "sq ft", focus: ["tri"], mistakes: [{ value: 60, msg: "That's the whole rectangle. The sail is half." }] },
      unitStep("square feet", ["feet", "square feet", "cubic feet"], "Fabric covers area, so square feet."),
    ],
  },
  {
    id: "patio", title: "Trapezoid patio", topic: "Area",
    story: <>A patio is a trapezoid. The long side is 14 ft, the short side is 8 ft, and they are 6 ft apart. How many square feet of tile are needed?</>,
    figure: (focus) => <TrapezoidFig b1={14} b2={8} h={6} offset={3} split unit="ft" focus={focus} grid={false} />,
    steps: [
      asks("Area", "Tile covers a flat floor."),
      { prompt: "Top triangle: base 8 ft, height 6 ft. Area?", answer: 24, unit: "sq ft", focus: ["t1"], hint: "½ × 8 × 6" },
      { prompt: "Bottom triangle: base 14 ft, height 6 ft. Area?", answer: 42, unit: "sq ft", focus: ["t2"], hint: "½ × 14 × 6" },
      { prompt: "Total tile needed?", answer: 66, focus: ["t1", "t2"] },
      unitStep("square feet", ["feet", "square feet", "cubic feet"], "Area uses square units."),
    ],
  },
  {
    id: "tank", title: "Fish tank", topic: "Volume",
    story: <>A fish tank is 2½ ft long, 1½ ft wide and 2 ft tall. How much water fills it completely?</>,
    figure: (_f, i) => <PrismFig l={2.5} w={1.5} h={2} grid={false} highlightTop={i === 1} unit=" ft" />,
    steps: [
      asks("Volume", "\"How much fills it\" means the space inside: volume."),
      { prompt: "Base area B = 2½ × 1½ = ?", answer: 3.75, unit: "sq ft", hint: "5/2 × 3/2 = 15/4", explain: "That's 3¾ square feet." },
      { prompt: "Volume V = B × h = 3¾ × 2 = ?", answer: 7.5, hint: "15/4 × 2 = 30/4" },
      unitStep("cubic feet", ["feet", "square feet", "cubic feet"], "Volume is measured in cubic units."),
    ],
  },
  {
    id: "cubes", title: "Packing cubes", topic: "Volume",
    story: <>A shipping box is 2 ft long, 1½ ft wide and 1 ft tall. It's packed with cubes that are ½ ft on each edge. How many cubes fit, and what is the box's volume?</>,
    figure: (_f, i) => <PrismFig l={2} w={1.5} h={1} d={2} layers={i < 3 ? 1 : 2} unit=" ft" />,
    steps: [
      { prompt: "How many ½-ft cubes fit along the 2 ft length?", answer: 4, hint: "How many halves are in 2?" },
      { prompt: "How many fit along the 1½ ft width?", answer: 3, hint: "How many halves are in 1½?" },
      { prompt: "How many layers fit in the 1 ft height?", answer: 2 },
      { prompt: "How many cubes in all?", answer: 24, hint: "4 × 3 × 2" },
      { prompt: "Each cube is ½ × ½ × ½. Volume of one cube?", answer: 1 / 8, unit: "cu ft" },
      { prompt: "Volume of the box = 24 × ⅛ = ?", answer: 3, unit: "cu ft", explain: "Check: 2 × 1½ × 1 = 3. It matches!" },
    ],
  },
  {
    id: "gift", title: "Wrapping a gift", topic: "Surface area",
    story: <>A gift box is 10 in long, 6 in wide and 4 in tall. What is the least amount of wrapping paper that covers it?</>,
    figure: (focus) => <Solid3D faces={boxFaces(10, 6, 4)} labels={boxLabels(10, 6, 4, " in")} highlight={focus} />,
    steps: [
      asks("Surface area", "Paper covers every outside face of the box."),
      { prompt: "Top + bottom (each 10 × 6) = ?", answer: 120, unit: "sq in", focus: ["top", "bottom"] },
      { prompt: "Front + back (each 10 × 4) = ?", answer: 80, unit: "sq in", focus: ["front", "back"] },
      { prompt: "Left + right sides (each 6 × 4) = ?", answer: 48, unit: "sq in", focus: ["left", "right"] },
      { prompt: "Total paper needed?", answer: 248, focus: ["top", "bottom", "front", "back", "left", "right"], mistakes: [{ value: 240, msg: "240 is 10 × 6 × 4, the volume. Add the faces instead." }] },
      unitStep("square inches", ["inches", "square inches", "cubic inches"], "Covering a surface is area, so square inches."),
    ],
  },
  {
    id: "tent", title: "Tent fabric", topic: "Surface area",
    story: <>A tent is a triangular prism 8 ft long. Each triangle end has a 6 ft base, is 4 ft tall, and has 5 ft slanted sides. The tent has a floor. How much fabric does the whole tent use?</>,
    figure: (focus) => <Solid3D faces={triPrismFaces(6, 4, 8)} labels={triPrismLabels(6, 4, 8, 5, " ft")} highlight={focus} />,
    steps: [
      asks("Surface area", "Fabric covers every face: two ends, the floor and two sloped sides."),
      { prompt: "One triangle end: ½ × 6 × 4 = ?", answer: 12, unit: "sq ft", focus: ["triF"] },
      { prompt: "Both ends together?", answer: 24, unit: "sq ft", focus: ["triF", "triB"] },
      { prompt: "Floor: 6 × 8 = ?", answer: 48, unit: "sq ft", focus: ["base"] },
      { prompt: "Two sloped sides, each 5 × 8. Together?", answer: 80, unit: "sq ft", focus: ["slantL", "slantR"] },
      { prompt: "Total fabric?", answer: 152, focus: ["triF", "triB", "base", "slantL", "slantR"] },
      unitStep("square feet", ["feet", "square feet", "cubic feet"], "Fabric covers surfaces: square feet."),
    ],
  },
  {
    id: "fence", title: "Fencing the playground", topic: "Coordinates",
    story: <>On a park map, each grid unit is 10 meters. The playground's corners are at A(−4, 3), B(5, 3), C(5, −2) and D(−4, −2). How many meters of fence go around it?</>,
    figure: (focus, i) => {
      const A = { x: -4, y: 3, label: "A" }, B = { x: 5, y: 3, label: "B" }, C = { x: 5, y: -2, label: "C" }, D = { x: -4, y: -2, label: "D" };
      return (
        <CoordinatePlane points={[A, B, C, D]} polygon={[A, B, C, D]} polygonColor="teal"
          segments={[{ a: A, b: B, highlight: focus.includes("AB"), label: i > 1 ? "9" : undefined }, { a: B, b: C, highlight: focus.includes("BC"), label: i > 2 ? "5" : undefined }]} />
      );
    },
    steps: [
      asks("Perimeter", "A fence goes around the edge — that's perimeter."),
      { prompt: "A and B share y = 3. Length of AB in grid units?", answer: 9, focus: ["AB"], hint: "From −4 to 0 is 4 units, then 0 to 5 is 5 more.", mistakes: [{ value: 1, msg: "−4 and 5 are on opposite sides of 0. Add 4 + 5." }] },
      { prompt: "B and C share x = 5. Length of BC in grid units?", answer: 5, focus: ["BC"], hint: "From 3 down to 0 is 3, then down to −2 is 2 more.", mistakes: [{ value: 1, msg: "3 and −2 are on opposite sides of 0. Add 3 + 2." }] },
      { prompt: "Perimeter in grid units (all four sides)?", answer: 28, hint: "9 + 5 + 9 + 5", mistakes: [{ value: 45, msg: "That's the area. Fence goes around, so add the sides." }] },
      { prompt: "Each unit is 10 m. Meters of fence?", answer: 280, unit: "m" },
    ],
  },
];

export function WordProblemsModule({ onSolved }: { onSolved: () => void }) {
  const [id, setId] = useState(WORD_PROBLEMS[0].id);
  const [stepIdx, setStepIdx] = useState(0);
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const wp = WORD_PROBLEMS.find((w) => w.id === id)!;
  const i = WORD_PROBLEMS.indexOf(wp);
  const focus = wp.steps[stepIdx]?.focus ?? [];
  const nextWp = WORD_PROBLEMS[(i + 1) % WORD_PROBLEMS.length];

  return (
    <section>
      <div className="module-head">
        <div>
          <h2>Word problems</h2>
          <p className="lede">Real situations, one step at a time. Decide what's being asked before you calculate.</p>
        </div>
      </div>
      <div className="shape-picker">
        {WORD_PROBLEMS.map((w) => (
          <button key={w.id} className={"shape-chip" + (w.id === id ? " on" : "")} aria-pressed={w.id === id} onClick={() => { setId(w.id); setStepIdx(0); }}>
            {solved[w.id] && <span className="chip-check" aria-label="solved">✓</span>}
            <span>{w.title}</span>
            <span className="chip-topic">{w.topic}</span>
          </button>
        ))}
      </div>
      <Workbench figure={wp.figure(focus, stepIdx)}>
        <div className="story">{wp.story}</div>
        <StepSolver key={wp.id} steps={wp.steps} onStepChange={setStepIdx}
          onComplete={() => { setSolved((s) => ({ ...s, [wp.id]: true })); onSolved(); }}
          onNext={() => { setId(nextWp.id); setStepIdx(0); }} nextLabel={`Next: ${nextWp.title}`} />
      </Workbench>
    </section>
  );
}
