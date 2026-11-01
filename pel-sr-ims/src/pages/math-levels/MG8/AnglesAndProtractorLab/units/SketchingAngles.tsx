import { useState } from "react";
import { AngleFigure, Protractor, angleBetween, correctScale, dragToDir, norm360, rayForMeasure } from "../diagrams";
import { acuteOrObtuse } from "../lib/angleFacts";
import { sketchPlacement, sketchTarget, type Placement } from "../lib/sketchSetups";
import { pick } from "../../../shared/lib/math";
import { choice, customStep, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { sketchingAnglesTest } from "./SketchingAnglesTest";

/** Feedback for a sketch that isn't right yet — names the wrong-scale mistake when that's what happened. */
function sketchFeedback(measured: number, target: number): string {
  if (measured === 180 - target) return `That's ${measured}° — the number ${target} on the OTHER scale. Start counting from the 0 that sits on the black ray.`;
  return measured < target ? "Not yet — your angle is too narrow. Open it wider." : "Not yet — your angle is too wide. Close it a little.";
}

// ============================================================================
// THE SKETCHING WIDGET (Practice only — never used in a Test)
// ============================================================================

/**
 * Drag-to-sketch. "benchmark" = no protractor, grid paper, 5° snap (90°/180°
 * are eyeballed). "protractor" = protractor already lined up, 1° snap, NO
 * numeric readout — the student reads the scale. "align" = the base ray is
 * slanted; the student first turns the protractor until its 0° line lies on
 * the ray (either end works), then drags. Grading uses angleBetween() — the
 * same function the rays are drawn with — so it is exact.
 */
function SketchTask({ mode, baseDir, target, startRot, onDone }: { mode: "benchmark" | "protractor" | "align"; baseDir: number; target: number; startRot: number; onDone: () => void }) {
  const [rot, setRot] = useState(startRot);
  const [dir, setDir] = useState(baseDir);
  const [msg, setMsg] = useState<string | null>(null);
  const aligned = mode !== "align" || correctScale(rot, baseDir) !== null;
  const measured = angleBetween(baseDir, dir);

  const check = () => {
    if (measured === target) onDone();
    else setMsg(sketchFeedback(measured, target));
  };
  const nudge = (d: number) => {
    setMsg(null);
    setDir((cur) => (mode === "benchmark" ? norm360(cur + d * 5) : dragToDir(rot, cur + d, 1)));
  };
  const turnProtractor = (d: number) => {
    setMsg(null);
    setRot((r) => norm360(r + d));
    setDir(baseDir);
  };

  return (
    <div className="ap-sketch">
      {mode === "benchmark" ? (
        <AngleFigure
          rays={[
            { dir: baseDir, len: 110 },
            { dir, len: 110, tone: "c", draggable: true },
          ]}
          onDragRay={(_, d) => {
            setMsg(null);
            setDir(d);
          }}
          snap={5}
          grid
          frameRadius={130}
          width={300}
          ariaLabel="Sketch pad: drag the purple ray"
        />
      ) : (
        <Protractor
          rot={rot}
          rays={[{ dir: baseDir, tone: "ink" }]}
          dragDir={aligned ? dir : undefined}
          onDrag={
            aligned
              ? (d) => {
                  setMsg(null);
                  setDir(d);
                }
              : undefined
          }
          fullFrame={mode === "align"}
          width={mode === "align" ? 360 : 400}
          ariaLabel="Protractor sketch pad: drag to turn the purple ray"
        />
      )}
      {mode === "align" && (
        <div className="control-row">
          <button type="button" className="btn ghost" onClick={() => turnProtractor(15)}>
            ↺ Turn protractor 15°
          </button>
          <button type="button" className="btn ghost" onClick={() => turnProtractor(-15)}>
            ↻ Turn protractor 15°
          </button>
          <span className={aligned ? "ap-ok" : "muted small"}>{aligned ? "✓ Lined up — now drag the purple ray." : "Turn the protractor until its straight 0° line lies on the black ray."}</span>
        </div>
      )}
      {aligned && (
        <div className="control-row">
          <button type="button" className="btn ghost" onClick={() => nudge(1)}>
            ↺ {mode === "benchmark" ? "5°" : "1°"}
          </button>
          <button type="button" className="btn ghost" onClick={() => nudge(-1)}>
            ↻ {mode === "benchmark" ? "5°" : "1°"}
          </button>
          <button type="button" className="btn primary" onClick={check}>
            Check my angle
          </button>
        </div>
      )}
      {msg && (
        <p className="feedback bad" role="alert">
          {msg}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore() {
  const [baseDir, setBaseDir] = useState(0);
  const [rot, setRot] = useState(0);
  const [dir, setDir] = useState(60);
  const [target, setTarget] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const scale = correctScale(rot, baseDir);
  const measured = angleBetween(baseDir, dir);

  const changeRot = (r: number) => {
    setRot(r);
    setDir((d) => dragToDir(r, d));
    setResult(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p>
        To <b>draw</b> an angle: put the protractor's center on the ray's endpoint, turn it so the 0° line lies on the ray, find your number on the scale that
        starts at 0 on that ray, and draw the second ray through it. Try it — turn the black ray, line up the protractor, then drag the purple ray.
      </p>
      <div className="control-row">
        <Stepper label="Black ray direction" value={baseDir} min={0} max={345} step={15} onChange={(v) => { setBaseDir(v); setResult(null); }} />
        <Stepper label="Protractor turn" value={rot} min={0} max={345} step={15} onChange={changeRot} />
        <button type="button" className="btn ghost" onClick={() => changeRot(baseDir)}>
          Line it up for me
        </button>
      </div>
      <div className="ap-explore">
        <Protractor
          rot={rot}
          rays={[{ dir: baseDir, tone: "ink" }]}
          dragDir={dir}
          onDrag={(d) => {
            setDir(d);
            setResult(null);
          }}
          highlightScale={target === null ? scale : null}
          fullFrame
          width={380}
          ariaLabel="Protractor sandbox"
        />
        <div className="ap-side">
          {scale ? (
            <p className="ap-ok">✓ Lined up: center on the vertex, 0° line on the black ray. Read the {scale === "inner" ? "blue inner" : "orange outer"} scale.</p>
          ) : (
            <p className="muted">Not lined up — the protractor's 0° line isn't on the black ray, so its numbers don't measure this angle yet.</p>
          )}
          {target === null ? (
            scale && (
              <p className="ap-readout">
                <b>{measured}°</b>
              </p>
            )
          ) : (
            <>
              <p>
                Challenge: draw a <b>{target}°</b> angle (no readout — read the scale!).
              </p>
              <div className="control-row">
                <button type="button" className="btn primary" onClick={() => setResult(measured === target ? `Yes! That's ${target}°.` : sketchFeedback(measured, target))}>
                  Check
                </button>
                <button type="button" className="btn ghost" onClick={() => { setTarget(null); setResult(null); }}>
                  Stop challenge
                </button>
              </div>
              {result && <p className={`feedback ${result.startsWith("Yes") ? "good" : "bad"}`}>{result}</p>}
            </>
          )}
          {target === null && (
            <button type="button" className="btn ghost" onClick={() => { setTarget(sketchTarget()); setResult(null); }}>
              Give me a challenge angle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — benchmark angles (90°, 180°) by eye
// ============================================================================

function benchmarkProblem(): Problem {
  const target = pick([90, 180] as const);
  const baseDir = pick([0, 90, 180, 270]);
  const name = target === 90 ? "a quarter turn" : "a half turn";
  return {
    title: `Sketch a ${target}° angle`,
    bucket: "benchmark",
    story: `No protractor needed: a ${target}° angle is ${target === 90 ? "a square corner" : "a straight line"}. Use the grid lines to help.`,
    visual: (done) =>
      done >= 1 ? (
        <AngleFigure rays={[{ dir: baseDir, len: 90 }, { dir: baseDir + target, len: 90, tone: "c" }]} arcs={[{ from: baseDir, sweep: target, r: 26, tone: "c", square: target === 90, label: `${target}°` }]} grid width={220} ariaLabel={`A ${target} degree angle`} />
      ) : (
        <div className="ap-goal">
          <span>Goal</span>
          <b>{target}°</b>
        </div>
      ),
    steps: [
      customStep(
        {
          prompt: `Drag the purple ray to make a ${target}° angle with the black ray, then press Check my angle.`,
          hint: target === 90 ? "Line the purple ray up with a grid line that makes a square corner with the black ray." : "Point the purple ray exactly the opposite way from the black ray.",
          explain: target === 90 ? "A 90° angle is a square corner." : "A 180° angle is a straight line.",
        },
        (onDone) => <SketchTask mode="benchmark" baseDir={baseDir} target={target} startRot={0} onDone={onDone} />,
        `${target}° angle drawn`
      ),
      choice(
        { prompt: `A ${target}° angle is…`, hint: "A full turn is 360°.", explain: `${target}° is ${name} — ${target === 90 ? "1/4" : "1/2"} of 360°.` },
        name,
        ["a quarter turn", "a half turn", "a three-quarter turn"].filter((n) => n !== name)
      ),
      {
        kind: "number",
        prompt: `How many ${target}° angles, placed side by side around a point, would fill a full turn?`,
        hint: "A full turn is 360°.",
        explain: `360 ÷ ${target} = ${360 / target}.`,
        answer: 360 / target,
      },
    ],
    wrapUp: `${target}° = ${name}.`,
  };
}

// ============================================================================
// PROBLEM TYPES 2-3 — a specific whole-number angle with the protractor
// ============================================================================

function protractorProblem(bucket: "specific" | "rotatedBase"): Problem {
  const placement: Placement = bucket === "rotatedBase" ? "rotated" : pick(["right", "left"] as const);
  const p = sketchPlacement(placement);
  const t = sketchTarget();
  const kind = acuteOrObtuse(t);
  const startRot = bucket === "rotatedBase" ? 0 : p.rot;
  const finalRot = bucket === "rotatedBase" ? p.baseDir : p.rot; // any valid lineup, for the finished picture
  return {
    title: `Sketch a ${t}° angle`,
    bucket,
    story:
      bucket === "rotatedBase"
        ? "This black ray is slanted, so the protractor isn't lined up with it yet. Line it up first, then draw."
        : "The protractor is already lined up on the black ray. There's no number readout — read the scale yourself.",
    visual: (done) =>
      done >= 1 ? (
        <Protractor rot={finalRot} rays={[{ dir: p.baseDir, tone: "ink" }, { dir: rayForMeasure(finalRot, p.baseDir, t), tone: "c" }]} width={260} fullFrame={bucket === "rotatedBase"} ariaLabel={`A ${t} degree angle`} />
      ) : (
        <div className="ap-goal">
          <span>Goal</span>
          <b>{t}°</b>
        </div>
      ),
    steps: [
      customStep(
        {
          prompt: bucket === "rotatedBase" ? `Turn the protractor to line it up on the black ray, then drag the purple ray to make a ${t}° angle.` : `Drag the purple ray to make a ${t}° angle with the black ray.`,
          hint: `Use the scale that reads 0 on the black ray, and count up to ${t}. The tall ticks are every 10°, the medium ones every 5°.`,
          explain: `Counting from 0 on the black ray's scale up to ${t} makes a ${t}° angle.`,
        },
        (onDone) => <SketchTask mode={bucket === "rotatedBase" ? "align" : "protractor"} baseDir={p.baseDir} target={t} startRot={startRot} onDone={onDone} />,
        `${t}° angle drawn`
      ),
      choice(
        { prompt: `Is a ${t}° angle acute or obtuse?`, hint: "Acute is less than 90°, obtuse is between 90° and 180°.", explain: `${t}° is ${t < 90 ? "less" : "more"} than 90°, so it's ${kind}.` },
        kind,
        [kind === "acute" ? "obtuse" : "acute", "right"]
      ),
      {
        kind: "number",
        prompt: `At the mark you used, what number does the OTHER scale show?`,
        hint: "The two scales always add up to 180 at the same mark.",
        explain: `180 − ${t} = ${180 - t}. If you'd counted to ${t} on that scale, you'd have drawn ${180 - t}° by mistake.`,
        answer: 180 - t,
      },
    ],
    wrapUp: `A ${t}° angle: count to ${t} on the scale that starts at 0 on your ray.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <Protractor rays={[{ dir: 0, tone: "ink" }, { dir: 73, tone: "c" }]} width={200} ariaLabel="A 73 degree angle drawn with a protractor" />;
}

export const sketchingAngles: Unit = {
  id: "sketchingAngles",
  title: "Sketching Angles of a Given Measure",
  goal: "I can draw an angle of a given size using a protractor.",
  standard: "4.MD.6",
  keyIdea: (
    <>
      <p>To draw a 65° angle: center the protractor on the ray's endpoint, turn its 0° line onto the ray, find 65 on the scale that starts at 0 on that ray, mark it, and draw the second ray through the mark.</p>
      <p>90° is a square corner and 180° is a straight line — you can sketch those by eye.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiredBuckets: ["benchmark", "specific", "rotatedBase"],
  problems: [
    { label: "90° and 180°", make: benchmarkProblem, buckets: ["benchmark"] },
    { label: "Exact angle", make: () => protractorProblem("specific"), buckets: ["specific"] },
    { label: "Slanted ray", make: () => protractorProblem("rotatedBase"), buckets: ["rotatedBase"] },
  ],
  test: sketchingAnglesTest,
};
