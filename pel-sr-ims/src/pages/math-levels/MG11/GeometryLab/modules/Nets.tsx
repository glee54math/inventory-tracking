// modules/Nets.tsx — nets of prisms and pyramids; surface area from the net.
import React, { useState } from "react";
import { randInt } from "../lib/math";
import { Solid3D, boxFaces, boxLabels, pyramidFaces, pyramidLabels, triPrismFaces, triPrismLabels, type Face3 } from "../shapes/solids";
import { NetFig, type NetFace, boxNet, pyramidNet, triPrismNet } from "../shapes/nets";
import { Num, Segmented, Slider, type Step, StepSolver, Toggle } from "../components/ui";

type SolidId = "box" | "tri" | "pyr";
const SQ = "sq units";
/** Isosceles triangles with whole-number sides: [base, height, slanted side]. */
export const TRI_PRESETS: [number, number, number][] = [[6, 4, 5], [8, 3, 5], [10, 12, 13], [12, 8, 10], [16, 6, 10]];

type Built = { faces3: Face3[]; labels: ReturnType<typeof boxLabels>; net: NetFace[] };

export function buildSolid(id: SolidId, p: Record<string, number>): Built {
  if (id === "box") return { faces3: boxFaces(p.l, p.w, p.h), labels: boxLabels(p.l, p.w, p.h), net: boxNet(p.l, p.w, p.h) };
  if (id === "tri") {
    const [b, th, s] = TRI_PRESETS[p.preset];
    return { faces3: triPrismFaces(b, th, p.L), labels: triPrismLabels(b, th, p.L, s), net: triPrismNet(b, th, s, p.L) };
  }
  return { faces3: pyramidFaces(p.a, p.sl), labels: pyramidLabels(p.a, p.sl), net: pyramidNet(p.a, p.sl) };
}

function genNetProblem(id: SolidId): { params: Record<string, number>; steps: Step[]; intro: string } {
  if (id === "box") {
    const l = randInt(3, 9), w = randInt(2, 7), h = randInt(2, 8);
    return {
      params: { l, w, h }, intro: `Find the surface area of the ${l} × ${w} × ${h} box using its net.`,
      steps: [
        { prompt: "How many faces does the net have?", answer: 6, hint: "Count every rectangle in the net." },
        { prompt: `The top is ${l} × ${w}. The bottom matches it. Top + bottom = ?`, answer: 2 * l * w, unit: SQ, focus: ["top", "bottom"], mistakes: [{ value: l * w, msg: "That's just one of them. Add the matching bottom too." }] },
        { prompt: `The front is ${l} × ${h}. The back matches it. Front + back = ?`, answer: 2 * l * h, unit: SQ, focus: ["front", "back"], mistakes: [{ value: l * h, msg: "That's just the front. Add the back." }] },
        { prompt: `Each side is ${w} × ${h}. Left + right = ?`, answer: 2 * w * h, unit: SQ, focus: ["left", "right"], mistakes: [{ value: w * h, msg: "That's one side. There are two." }] },
        {
          prompt: "Add all three pairs. Surface area = ?", answer: 2 * (l * w + l * h + w * h), unit: SQ,
          focus: ["top", "bottom", "front", "back", "left", "right"],
          mistakes: [{ value: l * w * h, msg: "That's the volume. Surface area adds up the faces." }],
        },
      ],
    };
  }
  if (id === "tri") {
    const preset = randInt(0, TRI_PRESETS.length - 1), [b, th, s] = TRI_PRESETS[preset], L = randInt(3, 10);
    const t = (b * th) / 2;
    return {
      params: { preset, L }, intro: `Find the surface area of the triangular prism (length ${L}) using its net.`,
      steps: [
        { prompt: "How many faces does the net have?", answer: 5, hint: "2 triangles plus some rectangles." },
        { prompt: `One triangle has base ${b} and height ${th}. Its area = ?`, answer: t, unit: SQ, focus: ["triF"], mistakes: [{ value: b * th, msg: "Remember the ½ for a triangle." }] },
        { prompt: "Both triangles together = ?", answer: 2 * t, unit: SQ, focus: ["triF", "triB"] },
        { prompt: `The bottom rectangle is ${b} × ${L}. Area = ?`, answer: b * L, unit: SQ, focus: ["base"] },
        { prompt: `Each slanted rectangle is ${s} × ${L}. Both together = ?`, answer: 2 * s * L, unit: SQ, focus: ["slantL", "slantR"], mistakes: [{ value: s * L, msg: "There are two slanted rectangles." }] },
        { prompt: "Add every face. Surface area = ?", answer: 2 * t + b * L + 2 * s * L, unit: SQ, focus: ["triF", "triB", "base", "slantL", "slantR"] },
      ],
    };
  }
  const a = randInt(2, 8), sl = randInt(Math.ceil(a / 2) + 1, 10);
  return {
    params: { a, sl }, intro: `Find the surface area of the square pyramid using its net.`,
    steps: [
      { prompt: "How many faces does the net have?", answer: 5, hint: "1 square and some triangles." },
      { prompt: `The base is a ${a} × ${a} square. Area = ?`, answer: a * a, unit: SQ, focus: ["base"] },
      { prompt: `Each triangle has base ${a} and height ${sl}. One triangle = ?`, answer: (a * sl) / 2, unit: SQ, focus: ["tF"], mistakes: [{ value: a * sl, msg: "Remember the ½ for a triangle." }] },
      { prompt: "All four triangles = ?", answer: 2 * a * sl, unit: SQ, focus: ["tF", "tR", "tB", "tL"] },
      { prompt: "Add the base and the triangles. Surface area = ?", answer: a * a + 2 * a * sl, unit: SQ, focus: ["base", "tF", "tR", "tB", "tL"] },
    ],
  };
}

let counter = 0;

export function NetsModule({ onSolved }: { onSolved: () => void }) {
  const [solid, setSolid] = useState<SolidId>("box");
  const [mode, setMode] = useState<"explore" | "practice">("explore");
  const [params, setParams] = useState<Record<SolidId, Record<string, number>>>({
    box: { l: 6, w: 3, h: 4 }, tri: { preset: 0, L: 7 }, pyr: { a: 6, sl: 5 },
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [showAreas, setShowAreas] = useState(false);
  const [prob, setProb] = useState(() => ({ key: ++counter, ...genNetProblem("box") }));
  const [stepIdx, setStepIdx] = useState(0);

  const newProblem = (id: SolidId) => { setStepIdx(0); setProb({ key: ++counter, ...genNetProblem(id) }); };
  const choose = (id: SolidId) => { setSolid(id); setSelected(null); newProblem(id); };

  const p = mode === "explore" ? params[solid] : prob.params;
  const built = buildSolid(solid, p);
  const total = built.net.reduce((s, f) => s + f.area, 0);
  const highlight = mode === "explore" ? (selected ? [selected] : []) : prob.steps[stepIdx]?.focus ?? [];
  const sel = built.net.find((f) => f.id === selected);
  const selName = built.faces3.find((f) => f.id === selected)?.name;
  const set = (k: string, v: number) => setParams((all) => ({ ...all, [solid]: { ...all[solid], [k]: v } }));

  const figure = (
    <div className="twin">
      <div>
        <div className="twin-label">Solid</div>
        <Solid3D faces={built.faces3} labels={built.labels} highlight={highlight} onFace={mode === "explore" ? setSelected : undefined} maxWidth={320} />
      </div>
      <div>
        <div className="twin-label">Net (unfolded)</div>
        <NetFig faces={built.net} highlight={highlight} onFace={mode === "explore" ? setSelected : undefined} showAreas={showAreas || (mode === "practice" && stepIdx >= prob.steps.length)} maxWidth={360} />
      </div>
    </div>
  );

  return (
    <section>
      <div className="module-head">
        <div>
          <h2>Nets & surface area</h2>
          <p className="lede">Unfold a solid into flat faces. Surface area is the total area of every face in the net.</p>
        </div>
        <Segmented label="Mode" value={mode} onChange={(m) => { setMode(m); setStepIdx(0); setSelected(null); }}
          options={[{ id: "explore", label: "Explore" }, { id: "practice", label: "Practice" }]} />
      </div>
      <div className="shape-picker">
        {([["box", "Rectangular prism"], ["tri", "Triangular prism"], ["pyr", "Square pyramid"]] as [SolidId, string][]).map(([id, name]) => (
          <button key={id} className={"shape-chip" + (solid === id ? " on" : "")} aria-pressed={solid === id} onClick={() => choose(id)}>{name}</button>
        ))}
      </div>
      <div className="workbench wide">
        <div className="board">
          <div className="board-figure">{figure}</div>
          <div className="board-caption">
            {mode === "explore" ? "Tap any face on the solid or the net. Matching colors are matching faces." : prob.intro}
          </div>
        </div>
        <div className="panel">
          {mode === "explore" ? (
            <>
              <div className="controls">
                {solid === "box" && (<>
                  <Slider label="Length" min={1} max={9} value={p.l} onChange={(v) => set("l", v)} />
                  <Slider label="Width" min={1} max={7} value={p.w} onChange={(v) => set("w", v)} />
                  <Slider label="Height" min={1} max={8} value={p.h} onChange={(v) => set("h", v)} />
                </>)}
                {solid === "tri" && (<>
                  <Slider label="Triangle" min={0} max={TRI_PRESETS.length - 1} value={p.preset} onChange={(v) => set("preset", v)}
                    display={`${TRI_PRESETS[p.preset][0]}, ${TRI_PRESETS[p.preset][1]}, ${TRI_PRESETS[p.preset][2]}`} />
                  <Slider label="Length" min={2} max={10} value={p.L} onChange={(v) => set("L", v)} />
                </>)}
                {solid === "pyr" && (<>
                  <Slider label="Base side" min={2} max={8} value={p.a} onChange={(v) => setParams((all) => ({ ...all, pyr: { a: v, sl: Math.max(all.pyr.sl, Math.ceil(v / 2) + 1) } }))} />
                  <Slider label="Slant height" min={Math.ceil(p.a / 2) + 1} max={10} value={p.sl} onChange={(v) => set("sl", v)} />
                </>)}
                <Toggle label="Show face areas" on={showAreas} onChange={setShowAreas} />
              </div>
              <div className="formula-card">
                {sel ? (
                  <>
                    <div className="card-title">{selName}</div>
                    <div className="formula-line">{sel.dims} = <Num value={sel.area} /> sq units</div>
                  </>
                ) : <div className="card-title muted">No face selected</div>}
              </div>
              <div className="formula-card">
                <div className="card-title">Surface area = sum of all faces</div>
                <div className="formula-line small">{built.net.map((f) => f.area).join(" + ")}</div>
                <div className="formula-line result">= <Num value={total} /> square units</div>
              </div>
            </>
          ) : (
            <StepSolver key={prob.key} steps={prob.steps} onStepChange={setStepIdx} onComplete={onSolved} onNext={() => newProblem(solid)} />
          )}
        </div>
      </div>
    </section>
  );
}

