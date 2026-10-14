// modules/Volume.tsx — volume of right rectangular prisms with fractional edges.
import React, { useEffect, useState } from "react";
import { fmt, pick, randInt } from "../lib/math";
import { PrismFig } from "../shapes/solids";
import { Num, Segmented, Slider, StepSolver, Workbench } from "../components/ui";
import { type Problem, makeProblem } from "./Area";

const CU = "cubic units";
type Den = "2" | "3" | "4";

export function packingProblem(): Omit<Problem, "key"> {
  const d = pick([2, 3, 4]);
  const nl = randInt(2, 2 * d), nw = randInt(1, 2 * d), nh = randInt(1, 2 * d);
  const l = nl / d, w = nw / d, h = nh / d, N = nl * nw * nh;
  const one = 1 / (d * d * d);
  return {
    intro: <>The prism is {fmt(l)} × {fmt(w)} × {fmt(h)} units. Pack it with small cubes whose edges are 1/{d} unit.</>,
    figure: (_f, i) => <PrismFig l={l} w={w} h={h} d={d} layers={i < 2 ? 1 : nh} />,
    steps: [
      { prompt: <>How many 1/{d}-unit cubes fit along the length of {fmt(l)}?</>, answer: nl, hint: <>How many 1/{d}s make {fmt(l)}? Multiply {fmt(l)} × {d}.</> },
      { prompt: <>How many fit along the width of {fmt(w)}?</>, answer: nw, hint: <>{fmt(w)} × {d}</> },
      { prompt: <>How many layers fit up the height of {fmt(h)}?</>, answer: nh, hint: <>{fmt(h)} × {d}</> },
      { prompt: "How many small cubes fill the whole prism?", answer: N, hint: `${nl} × ${nw} in each layer, times ${nh} layers.`, explain: `${nl} × ${nw} × ${nh} = ${N}` },
      { prompt: <>Each small cube is 1/{d} × 1/{d} × 1/{d}. What is the volume of one cube?</>, answer: one, unit: CU, hint: <>Multiply the tops: 1×1×1. Multiply the bottoms: {d}×{d}×{d}.</> },
      { prompt: "Volume of the prism = number of cubes × volume of one cube = ?", answer: N * one, unit: CU, hint: <>{N} × 1/{d * d * d} = {N}/{d * d * d}</> },
      {
        prompt: <>Now check with the formula: l × w × h = {fmt(l)} × {fmt(w)} × {fmt(h)} = ?</>, answer: l * w * h, unit: CU,
        explain: "Packing cubes and multiplying the edges give the same volume.",
      },
    ],
  };
}

const LENS = [1.5, 2, 2.5, 3, 3.5, 4];
const WIDS = [0.5, 0.75, 1, 1.5, 2];
const HTS = [2 / 3, 1, 1.25, 1.5, 2, 2.5];

export function formulaProblem(): Omit<Problem, "key"> {
  const l = pick(LENS), w = pick(WIDS), h = pick(HTS);
  const B = l * w;
  return {
    intro: <>Find the volume of the prism using V = B × h, where B is the area of the base.</>,
    figure: (_f, i) => <PrismFig l={l} w={w} h={h} grid={false} highlightTop={i === 0} />,
    steps: [
      {
        prompt: <>The base is {fmt(l)} by {fmt(w)}. Base area B = l × w = ?</>, answer: B, unit: "sq units",
        hint: "Change mixed numbers to improper fractions (or decimals), then multiply.",
        explain: "The gold top face has the same area as the base.",
      },
      {
        prompt: <>V = B × h = <Num value={B} /> × {fmt(h)} = ?</>, answer: B * h, unit: CU,
        explain: <>Same as l × w × h = {fmt(l)} × {fmt(w)} × {fmt(h)}.</>,
      },
    ],
  };
}

export function VolumeModule({ onSolved }: { onSolved: (clean: boolean) => void }) {
  const [mode, setMode] = useState<"explore" | "packing" | "formula">("explore");
  const [den, setDen] = useState<Den>("2");
  const d = +den;
  const [n, setN] = useState({ l: 5, w: 3, h: 4 });
  const [layers, setLayers] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [problem, setProblem] = useState<Problem>(() => makeProblem(packingProblem));
  const [stepIdx, setStepIdx] = useState(0);

  const maxN = Math.min(3 * d, 10);
  const l = n.l / d, w = n.w / d, h = n.h / d, N = n.l * n.w * n.h;

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setLayers((k) => {
        if (k >= n.h) { setPlaying(false); return k; }
        return k + 1;
      });
    }, 550);
    return () => clearInterval(t);
  }, [playing, n.h]);

  const changeDen = (v: Den) => {
    const nd = +v;
    const conv = (c: number) => Math.max(1, Math.min(Math.min(3 * nd, 10), Math.round((c / d) * nd)));
    const next = { l: conv(n.l), w: conv(n.w), h: conv(n.h) };
    setDen(v); setN(next); setLayers(next.h);
  };
  const setDim = (k: "l" | "w" | "h", v: number) => {
    setN((o) => ({ ...o, [k]: v }));
    if (k === "h") setLayers(v);
  };
  const newProblem = (m: "packing" | "formula") => { setStepIdx(0); setProblem(makeProblem(m === "packing" ? packingProblem : formulaProblem)); };

  return (
    <section>
      <div className="module-head">
        <div>
          <h2>Volume</h2>
          <p className="lede">Fill a prism with tiny cubes, then see why V = l × w × h works even with fractions.</p>
        </div>
        <Segmented label="Mode" value={mode}
          onChange={(m) => { setMode(m); if (m !== "explore") newProblem(m); }}
          options={[{ id: "explore", label: "Explore" }, { id: "packing", label: "Pack cubes" }, { id: "formula", label: "V = B × h" }]} />
      </div>

      {mode === "explore" ? (
        <Workbench
          figure={<PrismFig l={l} w={w} h={h} d={d} layers={Math.min(layers, n.h)} />}
          caption={<>Each small cube has edges of 1/{d} unit. Drag the sliders, then fill the prism layer by layer.</>}
        >
          <div className="controls">
            <div className="control-row">
              <span className="slider-label">Cube size</span>
              <Segmented label="Cube size" value={den} onChange={changeDen}
                options={[{ id: "2", label: <Num value={1 / 2} /> }, { id: "3", label: <Num value={1 / 3} /> }, { id: "4", label: <Num value={1 / 4} /> }]} />
            </div>
            <Slider label="Length" min={1} max={maxN} value={n.l} onChange={(v) => setDim("l", v)} display={<Num value={l} />} />
            <Slider label="Width" min={1} max={maxN} value={n.w} onChange={(v) => setDim("w", v)} display={<Num value={w} />} />
            <Slider label="Height" min={1} max={maxN} value={n.h} onChange={(v) => setDim("h", v)} display={<Num value={h} />} />
            <div className="control-row">
              <Slider label="Layers filled" min={0} max={n.h} value={Math.min(layers, n.h)} onChange={(v) => { setPlaying(false); setLayers(v); }} display={`${Math.min(layers, n.h)} of ${n.h}`} />
              <button className="btn" onClick={() => { setLayers(0); setPlaying(true); }}>Fill it</button>
            </div>
          </div>
          <div className="compare">
            <div className="formula-card">
              <div className="card-title">Count the cubes</div>
              <div className="formula-line">{n.l} × {n.w} × {n.h} = {N} cubes</div>
              <div className="formula-line">each cube = <Num value={1 / (d * d * d)} /> cubic unit</div>
              <div className="formula-line result">{N} × <Num value={1 / (d * d * d)} /> = <Num value={N / (d * d * d)} /></div>
            </div>
            <div className="formula-card">
              <div className="card-title">Multiply the edges</div>
              <div className="formula-line">V = l × w × h</div>
              <div className="formula-line"><Num value={l} /> × <Num value={w} /> × <Num value={h} /></div>
              <div className="formula-line result">= <Num value={l * w * h} /> cubic units</div>
            </div>
          </div>
          <p className="same-note">Same volume both ways.</p>
        </Workbench>
      ) : (
        <Workbench figure={problem.figure([], stepIdx)} caption={problem.intro}>
          <StepSolver key={problem.key} steps={problem.steps} onStepChange={setStepIdx} onComplete={onSolved} onNext={() => newProblem(mode)} />
        </Workbench>
      )}
    </section>
  );
}
