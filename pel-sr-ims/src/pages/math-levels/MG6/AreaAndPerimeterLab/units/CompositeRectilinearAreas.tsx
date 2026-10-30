import { useEffect, useState } from "react";
import { RectanglePieces } from "../diagrams/RectanglePieces";
import { lShapeNotes, makeLShape, pieceArea, totalArea, type AreaPiece, type LShape } from "../lib/grid";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { compositeRectilinearAreasTest } from "./CompositeRectilinearAreasTest";
import { answerBorder } from "../../../shared/lib/answerChecks";

/** A random L-shape with every piece and the notch at least 2 squares on a
 *  side (keeps both notch-edge labels from colliding — see lShapeNotes). */
function randomLShape(): LShape {
  const W = randInt(5, 10);
  const H = randInt(4, 9);
  const nw = randInt(2, W - 2);
  const nh = randInt(2, H - 2);
  return makeLShape(W, H, nw, nh);
}

/** A 3-step staircase: three bottom-aligned columns, each shorter than the
 *  last — the plan's "three or more rectangles" bucket. */
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

const FIXED_CFU = makeLShape(8, 6, 3, 2);

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1 — area is additive; the conflated distractor is adding PERIMETERS. */
function AdditiveQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "Add the two rectangles' areas";
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> A shape is made of two rectangles that don't overlap. How do you find the area of the whole shape?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)}>
          <option value="" disabled>choose</option>
          <option value={CORRECT}>{CORRECT}</option>
          <option value="Add the two rectangles' perimeters">Add the two rectangles' perimeters</option>
          <option value="Multiply the two rectangles' areas">Multiply the two rectangles' areas</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>Check Answer</button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — area adds up: the unit squares in both pieces together cover the whole shape." : "Not quite — perimeters measure distance around, not space covered, and multiplying areas doesn't count squares. Add the two AREAS."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the plan's mandatory question: a needed side is NOT labeled and has
 *  to be derived by subtracting given lengths first. */
function MissingDimensionQuestion({ onComplete }: { onComplete?: () => void }) {
  const s = FIXED_CFU;
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [total, setTotal] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [w, h, total].every((v) => String(v).trim() !== "");
  const okW = Number(w) === s.edges.notchWidth;
  const okH = Number(h) === s.edges.right;
  const okT = Number(total) === s.area;
  const ok = okW && okH && okT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> The orange piece's width and height are NOT labeled. Figure them out from the lengths you can see, then find the whole shape's area.
      </p>
      <RectanglePieces pieces={[s.pieces[0], { ...s.pieces[1], label: "?" }]} notes={lShapeNotes(s, ["notchWidth", "right"])} cellPx={26} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>Orange width <input className="answer" style={{ width: 50, ...answerBorder(okW, checked) }} inputMode="numeric" value={w} onChange={(e) => setW(e.target.value)} /></label>
        <label>Orange height <input className="answer" style={{ width: 50, ...answerBorder(okH, checked) }} inputMode="numeric" value={h} onChange={(e) => setH(e.target.value)} /></label>
        <label>Total area <input className="answer" style={{ width: 60, ...answerBorder(okT, checked) }} inputMode="numeric" value={total} onChange={(e) => setTotal(e.target.value)} /></label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>Check Answer</button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? `Correct — width = 8 − 5 = 3 and height = 6 − 2 = 4, so the orange piece is 4 × 3 = 12. Total: 30 + 12 = ${s.area}.`
            : !okH && Number(h) === s.H
              ? "Careful — 6 is the LEFT piece's height. The orange piece is shorter: the whole height 6 minus the notch's 2."
              : "Not yet — the bottom is 8 and the top-left part is 5, so the orange width is what's left. Its height is the whole 6 minus the notch's 2."}
        </p>
      )}
    </div>
  );
}

/** Q3 — true/false trap: reusing one piece's dimension for another. */
function ReuseDimensionTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"" | "true" | "false">("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: in an L-shape, both rectangle pieces always have the same height, so you can use the tall side's length for both.
      </p>
      <div className="control-row">
        <button className={`btn ghost ${picked === "true" ? "pressed" : ""}`} type="button" onClick={() => setPicked("true")}>True</button>
        <button className={`btn ghost ${picked === "false" ? "pressed" : ""}`} type="button" onClick={() => setPicked("false")}>False</button>
        <button className="btn primary" type="button" disabled={!picked} onClick={() => setChecked(true)}>Check Answer</button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "False — that's exactly what makes it an L: one piece is shorter. Always check each piece's OWN sides." : "Not quite — if both pieces were the same height, the shape would just be a rectangle. Each piece needs its own measurements."}
        </p>
      )}
    </div>
  );
}

/** Q4 — two strategies (add pieces vs. subtract the notch) give one answer. */
function TwoStrategiesQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const CORRECT = "Both — 48 − 6 = 42 and 30 + 12 = 42";
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> For the same L-shape, Kim adds the two pieces (30 + 12). Leo finds the big 8 × 6 rectangle and takes away the 3 × 2 corner that's missing. Who's right?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)}>
          <option value="" disabled>choose</option>
          <option value={CORRECT}>{CORRECT}</option>
          <option value="Only Kim — you can't subtract to find area">Only Kim — you can't subtract to find area</option>
          <option value="Only Leo — adding pieces double-counts">Only Leo — adding pieces double-counts</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>Check Answer</button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — both strategies count exactly the squares in the shape, so they always agree." : "Not quite — work out both: 8 × 6 − 3 × 2 = 48 − 6 = 42, and 30 + 12 = 42."}
        </p>
      )}
    </div>
  );
}

function CheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ additive: false, missing: false, trap: false, strategies: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill" style={{ display: "grid", gap: 18 }}>
      <p className="intro-gate-title">Check for understanding: break it apart (or take a piece away) — and use each piece's own sides.</p>
      <AdditiveQuestion onComplete={mark("additive")} />
      <MissingDimensionQuestion onComplete={mark("missing")} />
      <ReuseDimensionTrapQuestion onComplete={mark("trap")} />
      <TwoStrategiesQuestion onComplete={mark("strategies")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [strategy, setStrategy] = useState<"add" | "subtract">("add");
  const [W, setW] = useState(8);
  const [H, setH] = useState(6);
  const [nw, setNw] = useState(3);
  const [nh, setNh] = useState(2);
  const cw = Math.min(nw, W - 2);
  const ch = Math.min(nh, H - 2);
  const s = makeLShape(W, H, cw, ch);
  const [left, right] = s.pieces;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="Strategy"
          value={strategy}
          onChange={(v) => setStrategy(v as "add" | "subtract")}
          options={[
            { id: "add", label: "Break into pieces" },
            { id: "subtract", label: "Take away the missing corner" },
          ]}
        />
        {!introActive && (
          <button type="button" className={`btn ghost ${showCheck ? "pressed" : ""}`} onClick={() => setShowCheck((v) => !v)}>
            Check for Understanding
          </button>
        )}
      </div>
      <div className="control-row">
        <Stepper label="whole width" value={W} min={5} max={10} onChange={setW} tone="a" />
        <Stepper label="whole height" value={H} min={4} max={9} onChange={setH} tone="a" />
        <Stepper label="corner width" value={cw} min={2} max={W - 2} onChange={setNw} tone="b" />
        <Stepper label="corner height" value={ch} min={2} max={H - 2} onChange={setNh} tone="b" />
      </div>
      {strategy === "add" ? (
        <>
          <RectanglePieces pieces={s.pieces} notes={lShapeNotes(s)} cellPx={28} showGrid />
          <p className="says">
            Blue: {left.h} × {left.w} = {pieceArea(left)}. Orange: {right.h} × {right.w} = {pieceArea(right)} (its height is {H} − {ch} = {right.h}, NOT {H}). Total: {pieceArea(left)} + {pieceArea(right)} = {s.area}.
          </p>
        </>
      ) : (
        <>
          <RectanglePieces pieces={[{ ...left, label: "" }, { ...right, label: "" }]} bounding={{ w: W, h: H }} notch={s.notch} notes={lShapeNotes(s, ["topLeft", "notchDepth", "notchWidth", "right"])} cellPx={28} showGrid />
          <p className="says">
            Whole rectangle: {W} × {H} = {W * H}. Missing corner: {cw} × {ch} = {cw * ch}. Shape: {W * H} − {cw * ch} = {s.area}.
          </p>
        </>
      )}
      <p className="muted small">Change the sizes and switch strategies — both always give the same area.</p>
      {(introActive || showCheck) && <CheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — composite and rectilinear areas
// ============================================================================

type Bucket = "lShape" | "staircase" | "subtract" | "missingDimension";
const BUCKETS: Bucket[] = ["lShape", "staircase", "subtract", "missingDimension"];

function compositeProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);

  if (bucket === "lShape") {
    const s = randomLShape();
    const [a, b] = s.pieces;
    return {
      title: "Break an L-shape into rectangles",
      bucket,
      story: "Split this L-shape into two rectangles, find each area, and add.",
      visual: (done: number) => <RectanglePieces pieces={done >= 1 ? s.pieces : [{ ...a, label: "?" }, { ...b, label: "?" }]} notes={lShapeNotes(s)} cellPx={24} showGrid />,
      steps: [
        {
          kind: "ratio",
          tones: ["a", "b"],
          labels: ["blue piece", "orange piece"],
          prompt: "What is the area of each piece?",
          hint: `Blue is ${a.h} tall and ${a.w} wide. Orange is ${b.h} tall (${s.H} − ${s.nh}) and ${b.w} wide — not ${s.H} tall.`,
          explain: `Blue: ${a.h} × ${a.w} = ${pieceArea(a)}. Orange: ${b.h} × ${b.w} = ${pieceArea(b)}.`,
          answer: [pieceArea(a), pieceArea(b)],
        },
        {
          kind: "number",
          prompt: "What is the area of the whole L-shape?",
          hint: `${pieceArea(a)} + ${pieceArea(b)} = ?`,
          explain: `${pieceArea(a)} + ${pieceArea(b)} = ${s.area}.`,
          answer: s.area,
        },
      ],
      wrapUp: `The L-shape's area is ${s.area} square units.`,
    };
  }

  if (bucket === "staircase") {
    const pieces = randomStaircase();
    const [p1, p2, p3] = pieces;
    const total = totalArea(pieces);
    return {
      title: "A shape made of three rectangles",
      bucket,
      story: "This staircase shape is made of three rectangles.",
      visual: () => <RectanglePieces pieces={pieces.map((p) => ({ ...p, label: `${p.h} × ${p.w}` }))} cellPx={24} showGrid />,
      steps: [
        {
          kind: "number",
          prompt: `What is the area of the tallest piece (${p1.h} × ${p1.w})?`,
          hint: `${p1.h} × ${p1.w} = ?`,
          explain: `${p1.h} × ${p1.w} = ${pieceArea(p1)}.`,
          answer: pieceArea(p1),
        },
        {
          kind: "number",
          prompt: `What do the other two pieces (${p2.h} × ${p2.w} and ${p3.h} × ${p3.w}) add up to?`,
          hint: `Each piece uses its OWN height: ${pieceArea(p2)} + ${pieceArea(p3)}.`,
          explain: `${pieceArea(p2)} + ${pieceArea(p3)} = ${pieceArea(p2) + pieceArea(p3)}.`,
          answer: pieceArea(p2) + pieceArea(p3),
        },
        {
          kind: "number",
          prompt: "What is the area of the whole staircase?",
          hint: `${pieceArea(p1)} + ${pieceArea(p2) + pieceArea(p3)} = ?`,
          explain: `${pieceArea(p1)} + ${pieceArea(p2) + pieceArea(p3)} = ${total}.`,
          answer: total,
        },
      ],
      wrapUp: `${pieceArea(p1)} + ${pieceArea(p2)} + ${pieceArea(p3)} = ${total} square units.`,
    };
  }

  if (bucket === "subtract") {
    const s = randomLShape();
    const big = s.W * s.H;
    const cut = s.nw * s.nh;
    return {
      title: "Take away the missing corner",
      bucket,
      story: `This shape is a ${s.W} × ${s.H} rectangle with a ${s.nw} × ${s.nh} corner cut out.`,
      visual: () => (
        <RectanglePieces
          pieces={s.pieces.map((p) => ({ ...p, label: "" }))}
          bounding={{ w: s.W, h: s.H }}
          notch={s.notch}
          notes={lShapeNotes(s, ["topLeft", "notchDepth", "notchWidth", "right"])}
          cellPx={24}
        />
      ),
      steps: [
        {
          kind: "number",
          prompt: `What is the area of the whole ${s.W} × ${s.H} rectangle, before the corner is cut out?`,
          hint: `${s.W} × ${s.H} = ?`,
          explain: `${s.W} × ${s.H} = ${big}.`,
          answer: big,
        },
        {
          kind: "number",
          prompt: `What is the area of the missing ${s.nw} × ${s.nh} corner?`,
          hint: `${s.nw} × ${s.nh} = ?`,
          explain: `${s.nw} × ${s.nh} = ${cut}.`,
          answer: cut,
        },
        choice(
          {
            prompt: "So what is the area of the shape?",
            hint: "The corner is NOT part of the shape — should you add it or take it away?",
            explain: `${big} − ${cut} = ${s.area}. The corner is missing, so it's taken away.`,
          },
          `${big} − ${cut} = ${s.area}`,
          // Named mistake: adding the missing piece instead of removing it.
          [`${big} + ${cut} = ${big + cut}`]
        ),
      ],
      wrapUp: `${big} − ${cut} = ${s.area} square units.`,
    };
  }

  // missingDimension
  const s = randomLShape();
  const [a, b] = s.pieces;
  return {
    title: "Find the missing side first",
    bucket,
    story: "Two side lengths of the orange piece aren't labeled. Use the lengths you DO know to figure them out.",
    visual: (done: number) => (
      <RectanglePieces
        pieces={[a, { ...b, label: done >= 3 ? undefined : "?" }]}
        notes={[...lShapeNotes(s, ["notchWidth", "right"]), ...(done >= 1 ? [{ x: s.W - s.nw / 2, y: s.nh - 0.45, text: String(s.nw), tone: "c" as const }] : [])]}
        cellPx={24}
      />
    ),
    steps: [
      {
        kind: "number",
        prompt: "How wide is the orange piece?",
        hint: `The whole bottom is ${s.W}. The blue top is ${s.W - s.nw}. What's left over: ${s.W} − ${s.W - s.nw}.`,
        explain: `${s.W} − ${s.W - s.nw} = ${s.nw}.`,
        answer: s.nw,
      },
      {
        kind: "number",
        prompt: "How tall is the orange piece?",
        hint: `Not ${s.H} — that's the blue piece's height. The orange piece is the whole ${s.H} minus the notch's ${s.nh}.`,
        explain: `${s.H} − ${s.nh} = ${s.H - s.nh}.`,
        answer: s.H - s.nh,
      },
      {
        kind: "number",
        prompt: "What is the area of the whole shape?",
        hint: `Blue: ${a.h} × ${a.w}. Orange: ${b.h} × ${b.w}. Add them.`,
        explain: `${pieceArea(a)} + ${pieceArea(b)} = ${s.area}.`,
        answer: s.area,
      },
    ],
    wrapUp: `Blue ${pieceArea(a)} + orange ${pieceArea(b)} = ${s.area} square units.`,
  };
}

function Preview() {
  const s = makeLShape(6, 5, 2, 2);
  return <RectanglePieces pieces={s.pieces} cellPx={20} />;
}

export const compositeRectilinearAreas: Unit = {
  id: "compositeRectilinearAreas",
  title: "Composite and Rectilinear Areas",
  goal: "Find the area of an L-shape or other straight-sided figure by breaking it into rectangles and adding — or by taking a missing piece away from a bigger rectangle.",
  standard: "3.MD.7d",
  keyIdea: (
    <>
      <p>Area adds up: break a shape into rectangles that don't overlap, find each area, and add.</p>
      <p>Or start with the big rectangle around it and take away the missing piece. Either way, use each piece's OWN side lengths.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Composite figures", make: compositeProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: compositeRectilinearAreasTest,
};
