// modules/Coordinate.tsx — polygons in the coordinate plane; side lengths from coordinates.
import React, { useState } from "react";
import { pick, randInt } from "../lib/math";
import { CoordinatePlane, type PlanePoint, type PlaneSegment } from "../shapes/coordinate";
import { Segmented, type Step, StepSolver, Workbench } from "../components/ui";

type V = { label: string; x: number; y: number };
type SegSpec = { id: string; a: V; b: V; len: number; revealAt: number };
type CoordProblem = { key: number; intro: React.ReactNode; vertices: V[]; segments: SegSpec[]; steps: Step[] };

const pt = (v: V) => `${v.label}(${v.x}, ${v.y})`;

/** Explains the distance between two numbers on the same line, the way a 6th grader counts it. */
function distanceHelp(p: number, q: number, axis: "x" | "y") {
  const lo = Math.min(p, q), hi = Math.max(p, q);
  if (lo < 0 && hi > 0) {
    return {
      hint: `The ${axis}-coordinates are ${p} and ${q}. They're on opposite sides of 0: ${Math.abs(lo)} units to 0, then ${hi} more. Add them.`,
      mistakes: [{ value: Math.abs(Math.abs(hi) - Math.abs(lo)), msg: "The points are on opposite sides of the axis, so add the distances to 0 instead of subtracting." }],
    };
  }
  return {
    hint: `The ${axis}-coordinates are ${p} and ${q}. Same side of 0, so subtract: ${Math.abs(hi) > Math.abs(lo) ? `${Math.abs(hi)} − ${Math.abs(lo)}` : `${Math.abs(lo)} − ${Math.abs(hi)}`}.`,
    mistakes: [{ value: Math.abs(lo) + Math.abs(hi), msg: "Both points are on the same side of 0, so subtract instead of adding." }],
  };
}

function sharedStep(a: V, b: V): Step {
  const sameY = a.y === b.y;
  return {
    prompt: <>Look at {pt(a)} and {pt(b)}. Which coordinate is the same?</>,
    answer: sameY ? "The y (second number)" : "The x (first number)",
    choices: ["The x (first number)", "The y (second number)"],
    focus: [a.label + b.label],
    explain: sameY ? "So the segment is horizontal. Its length is the distance between the x-coordinates." : "So the segment is vertical. Its length is the distance between the y-coordinates.",
  };
}

function lengthStep(a: V, b: V, unitWord = "units"): Step {
  const sameY = a.y === b.y;
  const h = sameY ? distanceHelp(a.x, b.x, "x") : distanceHelp(a.y, b.y, "y");
  return {
    prompt: <>How long is side {a.label}{b.label}?</>,
    answer: sameY ? Math.abs(a.x - b.x) : Math.abs(a.y - b.y),
    unit: unitWord, focus: [a.label + b.label], hint: h.hint, mistakes: h.mistakes,
  };
}

function randomBox() {
  const x1 = randInt(-6, 2), x2 = randInt(x1 + 2, 6);
  const y1 = randInt(-1, 6), y2 = randInt(-6, y1 - 2);
  return Math.random() < 0.5 ? { x1, x2, y1, y2 } : { x1: -x2, x2: -x1, y1: -y2, y2: -y1 };
}

let counter = 0;
function genCoord(): CoordProblem {
  const kind = pick(["rectArea", "rectPerim", "tri", "park"] as const);
  const { x1, x2, y1, y2 } = randomBox();
  const W = x2 - x1, H = y1 - y2;
  if (kind === "tri") {
    const A = { label: "A", x: x1, y: y1 }, B = { label: "B", x: x2, y: y1 }, C = { label: "C", x: x1, y: y2 };
    return {
      key: ++counter,
      intro: <>Plot the right triangle with vertices {pt(A)}, {pt(B)} and {pt(C)}, then find its area.</>,
      vertices: [A, B, C],
      segments: [{ id: "AB", a: A, b: B, len: W, revealAt: 1 }, { id: "AC", a: A, b: C, len: H, revealAt: 2 }],
      steps: [
        sharedStep(A, B), lengthStep(A, B), lengthStep(A, C),
        { prompt: "AB and AC are the base and height. Area = ½ × base × height = ?", answer: (W * H) / 2, unit: "sq units", mistakes: [{ value: W * H, msg: "That's the full rectangle. A triangle is half of it." }] },
      ],
    };
  }
  const A = { label: "A", x: x1, y: y1 }, B = { label: "B", x: x2, y: y1 }, C = { label: "C", x: x2, y: y2 }, D = { label: "D", x: x1, y: y2 };
  const segments = [{ id: "AB", a: A, b: B, len: W, revealAt: 1 }, { id: "BC", a: B, b: C, len: H, revealAt: 2 }];
  if (kind === "park") {
    return {
      key: ++counter,
      intro: <>A map of a park uses a grid where each unit is 10 meters. The playground has corners at {pt(A)}, {pt(B)}, {pt(C)} and {pt(D)}. How many meters of fence go all the way around it?</>,
      vertices: [A, B, C, D], segments,
      steps: [
        sharedStep(A, B), lengthStep(A, B, "grid units"), lengthStep(B, C, "grid units"),
        { prompt: "Perimeter in grid units: add all four sides (two long, two short).", answer: 2 * (W + H), unit: "grid units", hint: `${W} + ${H} + ${W} + ${H}`, mistakes: [{ value: W * H, msg: "That's the area. Fence goes around the edge — add the sides." }, { value: W + H, msg: "That's only two sides. A rectangle has four." }] },
        { prompt: "Each grid unit is 10 meters. How many meters of fence?", answer: 20 * (W + H), unit: "meters", hint: `${2 * (W + H)} × 10` },
      ],
    };
  }
  return {
    key: ++counter,
    intro: <>Plot the rectangle with vertices {pt(A)}, {pt(B)}, {pt(C)} and {pt(D)}. Then find its {kind === "rectArea" ? "area" : "perimeter"}.</>,
    vertices: [A, B, C, D], segments,
    steps: [
      sharedStep(A, B), lengthStep(A, B), lengthStep(B, C),
      kind === "rectArea"
        ? { prompt: "Area = length × width = ?", answer: W * H, unit: "sq units" }
        : { prompt: "Perimeter = add all four sides = ?", answer: 2 * (W + H), unit: "units", hint: `${W} + ${H} + ${W} + ${H}`, mistakes: [{ value: W * H, msg: "That's the area. Perimeter is the distance around." }] },
    ],
  };
}

/* ---------- Free drawing ---------- */
function FreeDraw() {
  const [pts, setPts] = useState<V[]>([]);
  const [closed, setClosed] = useState(false);
  const labels = "ABCDEFGH";
  const add = (x: number, y: number) => {
    if (closed || pts.length >= 8 || pts.some((p) => p.x === x && p.y === y)) return;
    setPts([...pts, { label: labels[pts.length], x, y }]);
  };
  const sides: PlaneSegment[] = [];
  const n = pts.length;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const straight = a.x === b.x || a.y === b.y;
    sides.push({ a, b, color: straight ? "teal" : "ink", label: straight ? String(Math.abs(a.x - b.x) + Math.abs(a.y - b.y)) : undefined });
  }
  return (
    <Workbench
      figure={<CoordinatePlane onPick={add} points={pts.map((p) => ({ ...p, label: p.label }))} polygon={closed ? pts : undefined} segments={sides} />}
      caption="Click grid points to place vertices. Sides that are perfectly horizontal or vertical show their length."
    >
      <div className="vertex-list">
        {pts.length === 0 && <p className="muted">Click anywhere on the grid to place vertex A.</p>}
        {pts.map((p) => <span key={p.label} className="vertex-tag">{pt(p)}</span>)}
      </div>
      <div className="button-row">
        <button className="btn primary" disabled={pts.length < 3 || closed} onClick={() => setClosed(true)}>Close the polygon</button>
        <button className="btn" disabled={!pts.length} onClick={() => { setPts(closed ? pts : pts.slice(0, -1)); setClosed(false); }}>Undo</button>
        <button className="btn" disabled={!pts.length} onClick={() => { setPts([]); setClosed(false); }}>Clear</button>
      </div>
      <div className="tip-card">
        <strong>The counting rule</strong>
        <p>Same y-coordinate → horizontal side → length is the distance between the x's.</p>
        <p>Same x-coordinate → vertical side → length is the distance between the y's.</p>
        <p>Opposite sides of an axis? Add the distances to 0. Same side? Subtract.</p>
      </div>
    </Workbench>
  );
}

/* ---------- Guided practice ---------- */
export function CoordinateModule({ onSolved }: { onSolved: (clean: boolean) => void }) {
  const [mode, setMode] = useState<"draw" | "practice">("practice");
  const [problem, setProblem] = useState<CoordProblem>(genCoord);
  const [plotted, setPlotted] = useState(0);
  const [miss, setMiss] = useState<string | null>(null);
  const [stepIdx, setStepIdx] = useState(0);

  const next = () => { setProblem(genCoord()); setPlotted(0); setMiss(null); setStepIdx(0); };
  const target = problem.vertices[plotted];
  const allPlotted = plotted >= problem.vertices.length;
  const focus = allPlotted ? problem.steps[stepIdx]?.focus ?? [] : [];

  const plot = (x: number, y: number) => {
    if (allPlotted) return;
    if (x === target.x && y === target.y) { setPlotted(plotted + 1); setMiss(null); return; }
    const xMsg = x === target.x ? "Your x is right." : `For x = ${target.x}, move ${target.x < 0 ? "left" : "right"} ${Math.abs(target.x)} from the origin.`;
    const yMsg = y === target.y ? "Your y is right." : `For y = ${target.y}, move ${target.y < 0 ? "down" : "up"} ${Math.abs(target.y)}.`;
    setMiss(`You clicked (${x}, ${y}). ${xMsg} ${yMsg}`);
  };

  const shown = problem.vertices.slice(0, plotted);
  const segs: PlaneSegment[] = allPlotted
    ? problem.segments.map((s) => ({ a: s.a, b: s.b, highlight: focus.includes(s.id), label: stepIdx > s.revealAt ? String(s.len) : undefined }))
    : [];

  return (
    <section>
      <div className="module-head">
        <div>
          <h2>Coordinate plane</h2>
          <p className="lede">Draw polygons from their vertices and use coordinates to find side lengths.</p>
        </div>
        <Segmented label="Mode" value={mode} onChange={setMode}
          options={[{ id: "practice", label: "Practice" }, { id: "draw", label: "Draw freely" }]} />
      </div>
      {mode === "draw" ? <FreeDraw /> : (
        <Workbench
          figure={
            <CoordinatePlane
              onPick={allPlotted ? undefined : plot}
              points={shown.map((v): PlanePoint => ({ ...v, label: v.label }))}
              polygon={allPlotted ? problem.vertices : undefined}
              segments={segs}
            />
          }
          caption={problem.intro}
        >
          {!allPlotted ? (
            <div className="plot-task">
              <ol className="steps">
                <li className="step current">
                  <div className="step-num">●</div>
                  <div className="step-body">
                    <div className="step-prompt">Plot point <strong>{pt(target)}</strong> by clicking the grid.</div>
                    <p className="muted">Start at the origin (0, 0). Move across for x, then up or down for y.</p>
                    {miss && <div className="feedback bad" role="status">{miss}</div>}
                    <div className="step-tools">
                      <button className="link" onClick={() => { setPlotted(problem.vertices.length); setMiss(null); }}>Plot them all for me</button>
                    </div>
                  </div>
                </li>
              </ol>
              <div className="vertex-list">
                {problem.vertices.map((v, i) => <span key={v.label} className={"vertex-tag" + (i < plotted ? " done" : "")}>{pt(v)}</span>)}
              </div>
            </div>
          ) : (
            <StepSolver key={problem.key} steps={problem.steps} onStepChange={setStepIdx} onComplete={onSolved} onNext={next} />
          )}
        </Workbench>
      )}
    </section>
  );
}
