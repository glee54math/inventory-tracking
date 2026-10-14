// modules/Area.tsx — area of triangles, special quadrilaterals and polygons.
import React, { useMemo, useState } from "react";
import { clamp, randInt } from "../lib/math";
import { CompositeFig, HouseFig, ParallelogramFig, RectangleFig, ShapeIcon, TrapezoidFig, TriangleFig } from "../shapes/area";
import { Num, Segmented, Slider, type Step, StepSolver, Stars, Toggle, Workbench } from "../components/ui";
import type { UnitProgress } from "../../../../../hooks/useModuleProgress";

/** Area tracks mastery per shape, not per tab — 3 stars is "mastered" here,
 *  distinct from the sitewide 5-star convention every other tab uses. */
export const AREA_SHAPE_MASTERY_GOAL = 3;
export const areaProgressKey = (id: ShapeId): string => `area-${id}`;

export type Problem = {
  key: number;
  intro: React.ReactNode;
  steps: Step[];
  figure: (focus: string[], stepIdx: number) => React.ReactNode;
};

type ShapeId = "rect" | "right" | "tri" | "para" | "trap" | "comp" | "house";
type Params = Record<string, number>;

type ShapeSpec = {
  name: string;
  icon: { x: number; y: number }[];
  sliders: { key: string; label: string; min: number; max: number }[];
  defaults: Params;
  normalize: (p: Params) => Params;
  render: (p: Params, how: boolean) => React.ReactNode;
  howLabel: string;
  formula: (p: Params) => { lines: React.ReactNode[]; area: number };
  idea: string;
  gen: () => Omit<Problem, "key">;
};

const SQ = "sq units";
const half = (n: number) => n / 2;

export const SHAPES: Record<ShapeId, ShapeSpec> = {
  rect: {
    name: "Rectangle",
    icon: [{ x: 3, y: 4 }, { x: 29, y: 4 }, { x: 29, y: 20 }, { x: 3, y: 20 }],
    sliders: [{ key: "b", label: "Base", min: 1, max: 10 }, { key: "h", label: "Height", min: 1, max: 8 }],
    defaults: { b: 6, h: 4 },
    normalize: (p) => p,
    render: (p) => <RectangleFig b={p.b} h={p.h} />,
    howLabel: "Show rows",
    idea: "Count the unit squares: rows × squares in each row. That's base × height.",
    formula: (p) => ({ lines: [<>A = b × h</>, <>A = {p.b} × {p.h}</>], area: p.b * p.h }),
    gen: () => {
      const b = randInt(3, 10), h = randInt(2, 8);
      // Randomize which direction the counting starts from, so students learn
      // to read the grid either way — not just "always count the bottom row".
      const vertical = Math.random() < 0.5;
      const steps: Step[] = vertical
        ? [
            { prompt: "How many unit squares are in the left column?", answer: h, focus: ["col"], hint: "The left column is as tall as the height." },
            { prompt: "How many columns are there?", answer: b, focus: ["b"], hint: "Count across the bottom — that's the base." },
            { prompt: `So the area is ${h} squares × ${b} columns = ?`, answer: b * h, unit: SQ, explain: <>That's why <b>A = base × height</b>.</> },
          ]
        : [
            { prompt: "How many unit squares are in the bottom row?", answer: b, focus: ["row"], hint: "The bottom row is as long as the base." },
            { prompt: "How many rows are there?", answer: h, focus: ["h"], hint: "Count up the left side — that's the height." },
            { prompt: `So the area is ${b} squares × ${h} rows = ?`, answer: b * h, unit: SQ, explain: <>That's why <b>A = base × height</b>.</> },
          ];
      return {
        intro: <>Find the area of the rectangle. Each grid square is 1 square unit.</>,
        figure: (focus) => <RectangleFig b={b} h={h} focus={focus} />,
        steps,
      };
    },
  },
  right: {
    name: "Right triangle",
    icon: [{ x: 4, y: 3 }, { x: 4, y: 21 }, { x: 28, y: 21 }],
    sliders: [{ key: "b", label: "Base", min: 1, max: 10 }, { key: "h", label: "Height", min: 1, max: 8 }],
    defaults: { b: 6, h: 4 },
    normalize: (p) => p,
    render: (p, how) => <TriangleFig b={p.b} h={p.h} apex={0} showBox={how} focus={how ? ["tri"] : []} />,
    howLabel: "Show the rectangle",
    idea: "Two copies of a right triangle make a rectangle. So the triangle is half of base × height.",
    formula: (p) => ({ lines: [<>A = ½ × b × h</>, <>A = ½ × {p.b} × {p.h}</>], area: half(p.b * p.h) }),
    gen: () => {
      const b = randInt(2, 10), h = randInt(2, 8);
      return {
        intro: <>Find the area of this right triangle.</>,
        figure: (focus) => <TriangleFig b={b} h={h} apex={0} showBox focus={focus} />,
        steps: [
          {
            prompt: <>Picture the dashed rectangle around the triangle. What is its area? (base × height)</>,
            answer: b * h, unit: SQ, focus: ["box"], hint: `${b} × ${h}`,
          },
          {
            prompt: "The diagonal cuts that rectangle into 2 matching triangles. What is the area of one triangle?",
            answer: half(b * h), unit: SQ, focus: ["tri"],
            mistakes: [{ value: b * h, msg: "That's the whole rectangle. The triangle is only half of it." }],
            hint: `Divide the rectangle's area by 2: ${b * h} ÷ 2`,
            explain: <>A = ½ × {b} × {h} = <Num value={half(b * h)} /></>,
          },
        ],
      };
    },
  },
  tri: {
    name: "Any triangle",
    icon: [{ x: 3, y: 21 }, { x: 29, y: 21 }, { x: 12, y: 3 }],
    sliders: [
      { key: "b", label: "Base", min: 2, max: 10 },
      { key: "h", label: "Height", min: 1, max: 8 },
      { key: "apex", label: "Top point", min: 1, max: 9 },
    ],
    defaults: { b: 8, h: 5, apex: 3 },
    normalize: (p) => ({ ...p, apex: clamp(p.apex, 1, p.b - 1) }),
    render: (p, how) => <TriangleFig b={p.b} h={p.h} apex={p.apex} showBox={how} />,
    howLabel: "Split into right triangles",
    idea: "The height splits any triangle into two right triangles. Each is half of its own rectangle, so the whole triangle is half of base × height.",
    formula: (p) => ({ lines: [<>A = ½ × b × h</>, <>A = ½ × {p.b} × {p.h}</>], area: half(p.b * p.h) }),
    gen: () => {
      const b = randInt(5, 10), a = randInt(1, b - 2), h = randInt(2, 8);
      const direct = half(b * h);
      const correct = "Splitting a shape into pieces and adding their areas always matches the area of the whole shape.";
      return {
        intro: <>Find the area by splitting the triangle along its height (the dashed line), then check it with the direct formula.</>,
        figure: (focus, i) => <TriangleFig b={b} h={h} apex={a} showBox splitLabels rightKnown={i > 0} focus={focus} />,
        steps: [
          { prompt: `The whole base is ${b}. The left piece is ${a}. How long is the right piece?`, answer: b - a, focus: ["rightBase"], hint: `${b} − ${a}` },
          {
            prompt: "Area of the left piece. Fill in its base and height, then its area:", answer: half(a * h), unit: SQ, focus: ["left"],
            blanks: { prefix: "½ ×", labels: ["base", "height", "area"], values: [a, h, half(a * h)] },
          },
          {
            prompt: "Area of the right piece. Fill in its base and height, then its area:", answer: half((b - a) * h), unit: SQ, focus: ["right"],
            blanks: { prefix: "½ ×", labels: ["base", "height", "area"], values: [b - a, h, half((b - a) * h)] },
          },
          {
            prompt: "Add the two pieces. Total area = ?", answer: direct, unit: SQ, focus: ["tri"],
            explain: <>Nice — now let's double-check that a different way.</>,
          },
          {
            prompt: `Find that same area directly, using the whole triangle: ½ × ${b} × ${h} = ?`, answer: direct, unit: SQ, focus: ["tri"],
            hint: `½ × ${b} × ${h}`,
            explain: <>Both methods give <Num value={direct} /> square units.</>,
          },
          {
            prompt: "Both methods gave the same area. Which statement explains why?",
            answer: correct,
            choices: [
              correct,
              "It's a coincidence that the two methods matched for this triangle.",
              "The split method only works when the two pieces are equal in size.",
            ],
            mistakes: [
              { value: "It's a coincidence that the two methods matched for this triangle.", msg: "Not a coincidence — try this with any base and height and the two methods will always agree." },
              { value: "The split method only works when the two pieces are equal in size.", msg: "The pieces don't need to be equal — splitting anywhere along the height still works, as long as you add both pieces." },
            ],
            explain: "That's why you can always pick whichever method is easier: the direct formula, or splitting into shapes you already know.",
          },
        ],
      };
    },
  },
  para: {
    name: "Parallelogram",
    icon: [{ x: 9, y: 3 }, { x: 30, y: 3 }, { x: 23, y: 21 }, { x: 2, y: 21 }],
    sliders: [
      { key: "b", label: "Base", min: 2, max: 9 },
      { key: "h", label: "Height", min: 1, max: 7 },
      { key: "slant", label: "Lean", min: 1, max: 4 },
    ],
    defaults: { b: 6, h: 4, slant: 2 },
    normalize: (p) => p,
    render: (p, how) => <ParallelogramFig b={p.b} h={p.h} slant={p.slant} showCut moved={how} />,
    howLabel: "Slide the triangle",
    idea: "Cut the triangle off one end and slide it to the other end. Now it's a rectangle with the same base and height.",
    formula: (p) => ({ lines: [<>A = b × h</>, <>A = {p.b} × {p.h}</>], area: p.b * p.h }),
    gen: () => {
      const b = randInt(3, 9), h = randInt(2, 7), s = randInt(1, 3);
      return {
        intro: <>Find the area of the parallelogram.</>,
        figure: (focus, i) => <ParallelogramFig b={b} h={h} slant={s} showCut moved={i >= 1} focus={focus} />,
        steps: [
          {
            prompt: "Cut off the gold triangle and slide it to the right end. What shape do you get?",
            answer: "Rectangle", choices: ["Triangle", "Rectangle", "Trapezoid"],
            explain: "The slanted ends now line up straight.",
          },
          {
            prompt: `The rectangle is ${b} wide and ${h} tall. What is its area?`, answer: b * h, unit: SQ, focus: ["rect"],
            mistakes: [{ value: half(b * h), msg: "No halving here — nothing was cut in half. The whole rectangle counts." }, { value: (b + s) * h, msg: "Use the base only, not the full width with the lean." }],
            explain: <>Parallelogram area = base × height = {b} × {h}.</>,
          },
        ],
      };
    },
  },
  trap: {
    name: "Trapezoid",
    icon: [{ x: 9, y: 3 }, { x: 22, y: 3 }, { x: 30, y: 21 }, { x: 2, y: 21 }],
    sliders: [
      { key: "b1", label: "Bottom base", min: 3, max: 12 },
      { key: "b2", label: "Top base", min: 1, max: 11 },
      { key: "h", label: "Height", min: 1, max: 7 },
      { key: "offset", label: "Shift top", min: 0, max: 8 },
    ],
    defaults: { b1: 9, b2: 5, h: 4, offset: 2 },
    normalize: (p) => {
      const b2 = clamp(p.b2, 1, p.b1 - 1);
      return { ...p, b2, offset: clamp(p.offset, 0, p.b1 - b2) };
    },
    render: (p, how) => <TrapezoidFig b1={p.b1} b2={p.b2} h={p.h} offset={p.offset} split={how} />,
    howLabel: "Split with a diagonal",
    idea: "A diagonal splits a trapezoid into two triangles with the same height. Add the two triangle areas.",
    formula: (p) => ({
      lines: [<>A = ½·b₁·h + ½·b₂·h</>, <>A = ½·{p.b1}·{p.h} + ½·{p.b2}·{p.h}</>],
      area: half(p.b1 * p.h) + half(p.b2 * p.h),
    }),
    gen: () => {
      const b1 = randInt(6, 12), b2 = randInt(2, b1 - 2), h = randInt(2, 7), off = randInt(0, b1 - b2);
      return {
        intro: <>Find the area of the trapezoid by splitting it into two triangles.</>,
        figure: (focus) => <TrapezoidFig b1={b1} b2={b2} h={h} offset={off} split focus={focus} />,
        steps: [
          { prompt: `Top triangle (gold): base ${b2}, height ${h}. Area = ?`, answer: half(b2 * h), unit: SQ, focus: ["t1"], hint: `½ × ${b2} × ${h}` },
          { prompt: `Bottom triangle (blue): base ${b1}, height ${h}. Area = ?`, answer: half(b1 * h), unit: SQ, focus: ["t2"], hint: `½ × ${b1} × ${h}` },
          {
            prompt: "Add them. Area of the trapezoid = ?", answer: half(b1 * h) + half(b2 * h), unit: SQ, focus: ["t1", "t2"],
            explain: <>Same as ½ × ({b1} + {b2}) × {h}.</>,
          },
        ],
      };
    },
  },
  comp: {
    name: "L-shape",
    icon: [{ x: 3, y: 3 }, { x: 14, y: 3 }, { x: 14, y: 12 }, { x: 29, y: 12 }, { x: 29, y: 21 }, { x: 3, y: 21 }],
    sliders: [
      { key: "W", label: "Width", min: 4, max: 11 },
      { key: "H", label: "Height", min: 3, max: 9 },
      { key: "cw", label: "Notch width", min: 1, max: 9 },
      { key: "ch", label: "Notch height", min: 1, max: 8 },
    ],
    defaults: { W: 9, H: 7, cw: 4, ch: 3 },
    normalize: (p) => ({ ...p, cw: clamp(p.cw, 1, p.W - 1), ch: clamp(p.ch, 1, p.H - 1) }),
    render: (p, how) => <CompositeFig W={p.W} H={p.H} cw={p.cw} ch={p.ch} split={how} known={how ? ["top", "right"] : []} />,
    howLabel: "Split into rectangles",
    idea: "Break the shape into rectangles you know. Find any missing side lengths, then add the areas.",
    formula: (p) => ({
      lines: [<>A = A + B</>, <>A = {p.W - p.cw}×{p.H} + {p.cw}×{p.H - p.ch}</>],
      area: (p.W - p.cw) * p.H + p.cw * (p.H - p.ch),
    }),
    gen: () => {
      const W = randInt(6, 11), H = randInt(5, 9), cw = randInt(2, W - 3), ch = randInt(2, H - 2);
      const a = (W - cw) * H, b = cw * (H - ch);
      return {
        intro: <>Find the area of the L-shaped figure. Split it into rectangles A and B.</>,
        figure: (focus, i) => (
          <CompositeFig W={W} H={H} cw={cw} ch={ch} split focus={focus}
            known={[...(i > 0 ? ["top" as const] : []), ...(i > 2 ? ["right" as const] : [])]} />
        ),
        steps: [
          { prompt: `Find the missing top side. The whole bottom is ${W} and the notch is ${cw}.`, answer: W - cw, focus: ["top"], hint: `${W} − ${cw}` },
          { prompt: `Rectangle A is ${W - cw} wide and ${H} tall. Area of A = ?`, answer: a, unit: SQ, focus: ["A"] },
          { prompt: `Find the missing right side. The whole left side is ${H} and the notch is ${ch}.`, answer: H - ch, focus: ["right"], hint: `${H} − ${ch}` },
          { prompt: `Rectangle B is ${cw} wide and ${H - ch} tall. Area of B = ?`, answer: b, unit: SQ, focus: ["B"] },
          { prompt: "Total area = A + B = ?", answer: a + b, unit: SQ, focus: ["A", "B"], mistakes: [{ value: W * H, msg: "That's the big rectangle including the missing notch. Add A + B instead." }] },
        ],
      };
    },
  },
  house: {
    name: "Pentagon",
    icon: [{ x: 4, y: 11 }, { x: 16, y: 2 }, { x: 28, y: 11 }, { x: 28, y: 22 }, { x: 4, y: 22 }],
    sliders: [
      { key: "W", label: "Width", min: 2, max: 10 },
      { key: "wall", label: "Wall height", min: 1, max: 7 },
      { key: "roof", label: "Roof height", min: 1, max: 5 },
    ],
    defaults: { W: 6, wall: 4, roof: 3 },
    normalize: (p) => p,
    render: (p, how) => <HouseFig W={p.W} wall={p.wall} roof={p.roof} split={how} />,
    howLabel: "Split into rectangle + triangle",
    idea: "This pentagon is a rectangle with a triangle on top. Find each area and add.",
    formula: (p) => ({ lines: [<>A = W×wall + ½×W×roof</>, <>A = {p.W}×{p.wall} + ½×{p.W}×{p.roof}</>], area: p.W * p.wall + half(p.W * p.roof) }),
    gen: () => {
      const W = randInt(2, 5) * 2, wall = randInt(3, 7), roof = randInt(2, 5);
      return {
        intro: <>Find the area of the pentagon. It's made of a rectangle and a triangle.</>,
        figure: (focus) => <HouseFig W={W} wall={wall} roof={roof} split focus={focus} />,
        steps: [
          { prompt: `Rectangle: ${W} × ${wall} = ?`, answer: W * wall, unit: SQ, focus: ["rect"] },
          { prompt: `Triangle roof: ½ × ${W} × ${roof} = ?`, answer: half(W * roof), unit: SQ, focus: ["roof"], mistakes: [{ value: W * roof, msg: "Remember the ½ — a triangle is half of its rectangle." }] },
          { prompt: "Total area = ?", answer: W * wall + half(W * roof), unit: SQ, focus: ["rect", "roof"] },
        ],
      };
    },
  },
};

let counter = 0;
export const makeProblem = (gen: () => Omit<Problem, "key">): Problem => ({ key: ++counter, ...gen() });

export function AreaModule({
  onSolved,
  progress,
}: {
  onSolved: (clean: boolean, shapeId: ShapeId) => void;
  progress: Record<string, UnitProgress>;
}) {
  const [shape, setShape] = useState<ShapeId>("right");
  const [mode, setMode] = useState<"explore" | "practice">("explore");
  const [params, setParams] = useState<Record<ShapeId, Params>>(() =>
    Object.fromEntries(Object.entries(SHAPES).map(([k, s]) => [k, s.defaults])) as Record<ShapeId, Params>);
  const [how, setHow] = useState(false);
  const [problem, setProblem] = useState<Problem>(() => makeProblem(SHAPES.right.gen));
  const [stepIdx, setStepIdx] = useState(0);

  const spec = SHAPES[shape];
  const p = spec.normalize(params[shape]);
  const f = spec.formula(p);
  const focus = problem.steps[stepIdx]?.focus ?? [];

  const choose = (id: ShapeId) => {
    setShape(id); setHow(false); setStepIdx(0);
    setProblem(makeProblem(SHAPES[id].gen));
  };
  const next = () => { setStepIdx(0); setProblem(makeProblem(spec.gen)); };

  const picker = useMemo(() => (
    <div className="shape-picker" role="tablist" aria-label="Shape">
      {(Object.keys(SHAPES) as ShapeId[]).map((id) => (
        <button key={id} role="tab" aria-selected={shape === id} className={"shape-chip" + (shape === id ? " on" : "")} onClick={() => choose(id)}>
          <ShapeIcon points={SHAPES[id].icon} />
          <span>{SHAPES[id].name}</span>
          <Stars n={progress[areaProgressKey(id)]?.clean ?? 0} max={AREA_SHAPE_MASTERY_GOAL} label={`${SHAPES[id].name} mastery`} />
        </button>
      ))}
    </div>
  ), [shape, progress]);

  return (
    <section>
      <div className="module-head">
        <div>
          <h2>Area</h2>
          <p className="lede">Find the area of triangles, quadrilaterals and polygons by splitting them into shapes you already know.</p>
        </div>
        <Segmented label="Mode" value={mode} onChange={(m) => { setMode(m); setStepIdx(0); }}
          options={[{ id: "explore", label: "Explore" }, { id: "practice", label: "Practice" }]} />
      </div>
      {picker}
      {mode === "explore" ? (
        <Workbench figure={spec.render(p, how)} caption={spec.idea}>
          <div className="controls">
            {spec.sliders.map((s) => (
              <Slider key={s.key} label={s.label} min={s.min} max={s.max} value={p[s.key]}
                onChange={(v) => setParams((all) => ({ ...all, [shape]: { ...all[shape], [s.key]: v } }))} />
            ))}
            <Toggle label={spec.howLabel} on={how} onChange={setHow} />
          </div>
          <div className="formula-card">
            {f.lines.map((l, i) => <div key={i} className="formula-line">{l}</div>)}
            <div className="formula-line result">A = <Num value={f.area} /> <span className="unit">square units</span></div>
          </div>
        </Workbench>
      ) : (
        <Workbench figure={problem.figure(focus, stepIdx)} caption={problem.intro}>
          <StepSolver key={problem.key} steps={problem.steps} onStepChange={setStepIdx} onComplete={(clean) => onSolved(clean, shape)} onNext={next} />
        </Workbench>
      )}
    </section>
  );
}

