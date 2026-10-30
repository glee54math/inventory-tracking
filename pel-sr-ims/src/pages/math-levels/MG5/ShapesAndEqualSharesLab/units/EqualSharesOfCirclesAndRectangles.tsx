import { useEffect, useState } from "react";
import { SharePartition, PARTITION_META, unequalFractions, type ShareShape, type SharePattern, type RectCutStyle } from "../diagrams/SharePartition";
import { pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { equalSharesTest } from "./EqualSharesOfCirclesAndRectanglesTest";

const SHAPES: ShareShape[] = ["circle", "rectangle"];

function fieldStyle(ok: boolean, checked: boolean) {
  if (!checked) return {};
  return ok ? { borderColor: "var(--good)", background: "var(--good-soft)" } : { borderColor: "var(--bad)", background: "var(--bad-soft)" };
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Q1 — vocabulary: thirds (new at Grade 2, unlike halves/fourths from Grade 1). */
function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = ["A third", "A half", "A fourth"];
  const ok = picked === 0;
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> This rectangle is cut into 3 EQUAL pieces. What do we call each piece?
      </p>
      <SharePartition shape="rectangle" pattern="thirds-equal" width={140} height={100} />
      <div className="choices" role="group">
        {options.map((o, i) => (
          <button key={i} className="choice" onClick={() => setPicked(i)} disabled={ok} style={fieldStyle(i === 0, picked === i)}>
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Right — 3 equal pieces of a whole are called thirds." : "Not quite — how many equal pieces does this whole have?"}
        </p>
      )}
    </div>
  );
}

/** Q2 — the required unequal non-example: piece count and equal-size together. */
function UnequalNonExampleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [countVal, setCountVal] = useState("");
  const [sizeVal, setSizeVal] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [countVal, sizeVal].every((v) => String(v).trim() !== "");
  const okCount = countVal === "3";
  const okSize = sizeVal === "not-thirds";
  const ok = okCount && okSize;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Look at this circle:
      </p>
      <SharePartition shape="circle" pattern="thirds-unequal" fractions={unequalFractions(3, 0.18)} width={120} height={120} />
      <p>
        This circle has{" "}
        <select className="answer" style={{ width: 70, ...fieldStyle(okCount, checked) }} value={countVal} onChange={(e) => setCountVal(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>{" "}
        pieces, and they are{" "}
        <select className="answer" style={{ width: 260, ...fieldStyle(okSize, checked) }} value={sizeVal} onChange={(e) => setSizeVal(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="not-thirds">different sizes — so they are NOT thirds</option>
          <option value="thirds">the same size — so they ARE thirds</option>
        </select>
        .
      </p>
      <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
        Check Answer
      </button>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Right — having 3 pieces isn't enough to call them thirds. The 3 pieces also have to be the same size."
            : "Not quite — look carefully: are all 3 pieces really the same size?"}
        </p>
      )}
    </div>
  );
}

/** Q3 — required generalization: 2 different-looking cuts of the SAME whole
 *  into halves, with pieces that are genuinely different SHAPES (triangles
 *  vs sub-rectangles), both still equal shares. */
function SameWholeDifferentShapeQuestion({ onComplete }: { onComplete?: () => void }) {
  const [same, setSame] = useState("");
  const [different, setDifferent] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [same, different].every((v) => String(v).trim() !== "");
  const okSame = same === "area";
  const okDifferent = different === "look";
  const ok = okSame && okDifferent;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Here are two SAME-SIZE rectangles, both cut into halves, but in different ways:
      </p>
      <div className="control-row" style={{ gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <SharePartition shape="rectangle" pattern="halves-equal" cutStyle="stripesV" width={120} height={90} />
          <p className="muted small">A straight cut</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <SharePartition shape="rectangle" pattern="halves-equal" cutStyle="diag" width={120} height={90} />
          <p className="muted small">A diagonal cut</p>
        </div>
      </div>
      <p>
        Both cuts give 2 real halves because each piece is the same{" "}
        <select className="answer" style={{ width: 90, ...fieldStyle(okSame, checked) }} value={same} onChange={(e) => setSame(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="area">amount (area)</option>
          <option value="outline">outline shape</option>
        </select>
        , even though the pieces{" "}
        <select className="answer" style={{ width: 210, ...fieldStyle(okDifferent, checked) }} value={different} onChange={(e) => setDifferent(e.target.value)}>
          <option value="" disabled>
            ?
          </option>
          <option value="look">are different shapes (rectangles vs. triangles)</option>
          <option value="same">are actually identical shapes</option>
        </select>
        .
      </p>
      <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
        Check Answer
      </button>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Right — equal shares of the same whole can be cut in different ways and come out looking like different shapes, as long as each piece is the same AMOUNT."
            : "Not quite — compare how much space each piece takes up, not just its outline shape."}
        </p>
      )}
    </div>
  );
}

/** Q4 — generalization / true-false trap: half vs. third, which is bigger. */
function HalfVsThirdTrueFalseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"true" | "false" | null>(null);
  const ok = picked === "false";
  useEffect(() => {
    if (ok) onComplete?.();
  }, [ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or False: since 3 is a bigger number than 2, cutting a shape into thirds makes BIGGER pieces than cutting it into halves.
      </p>
      <div className="control-row" style={{ gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <SharePartition shape="circle" pattern="halves-equal" width={100} height={100} />
          <p className="muted small">Halves</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <SharePartition shape="circle" pattern="thirds-equal" width={100} height={100} />
          <p className="muted small">Thirds</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {(["true", "false"] as const).map((v) => (
          <button key={v} type="button" className="choice" disabled={ok} onClick={() => setPicked(v)} style={fieldStyle(v === "false", picked === v)}>
            {v === "true" ? "True" : "False"}
          </button>
        ))}
      </div>
      {picked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "False — the opposite is true! Cutting the same-size whole into MORE pieces (3 instead of 2) makes each piece SMALLER, so a half is bigger than a third."
            : "Not quite — look at the pictures: is a third slice bigger or smaller than a half slice, of the same-size whole?"}
        </p>
      )}
    </div>
  );
}

function EqualSharesCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ q1: false, q2: false, q3: false, q4: false });
  const allDone = done.q1 && done.q2 && done.q3 && done.q4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure halves, thirds, and fourths make sense before you try practice problems.</p>
      <VocabQuestion onComplete={() => setDone((d) => ({ ...d, q1: true }))} />
      <UnequalNonExampleQuestion onComplete={() => setDone((d) => ({ ...d, q2: true }))} />
      <SameWholeDifferentShapeQuestion onComplete={() => setDone((d) => ({ ...d, q3: true }))} />
      <HalfVsThirdTrueFalseQuestion onComplete={() => setDone((d) => ({ ...d, q4: true }))} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [shape, setShape] = useState<ShareShape>("circle");
  const [pieceCount, setPieceCount] = useState<"2" | "3" | "4">("2");
  const [equal, setEqual] = useState<"equal" | "unequal">("equal");
  const [cutStyle, setCutStyle] = useState<RectCutStyle>("stripesV");
  const [skew, setSkew] = useState(0.22);

  const shareName = pieceCount === "2" ? "halves" : pieceCount === "3" ? "thirds" : "fourths";
  const pattern: SharePattern = (`${shareName}-${equal === "equal" ? "equal" : "unequal"}`) as SharePattern;
  const meta = PARTITION_META[pattern];
  const fractions = equal === "unequal" ? unequalFractions(meta.pieceCount, skew) : undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && (
        <button
          type="button"
          className="btn ghost"
          style={{ width: "fit-content", ...(showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
          onClick={() => setShowCheck((v) => !v)}
        >
          Quick Check
        </button>
      )}
      {(introActive || showCheck) && <EqualSharesCheck onComplete={onIntroDone} />}
      <Segmented label="Shape" value={shape} onChange={setShape} options={SHAPES.map((s) => ({ id: s, label: s === "circle" ? "Circle" : "Rectangle" }))} />
      <div className="control-row">
        <Segmented label="Pieces" value={pieceCount} onChange={setPieceCount} options={[{ id: "2", label: "2 (halves)" }, { id: "3", label: "3 (thirds)" }, { id: "4", label: "4 (fourths)" }]} />
        <Segmented label="Equal?" value={equal} onChange={setEqual} options={[{ id: "equal", label: "Equal" }, { id: "unequal", label: "Unequal" }]} />
      </div>
      {shape === "rectangle" && equal === "equal" && (
        <Segmented
          label="Cut style"
          value={cutStyle}
          onChange={setCutStyle}
          options={pieceCount === "2" ? [{ id: "stripesV", label: "Straight cut" }, { id: "diag", label: "Diagonal cut" }] : [{ id: "stripesV", label: "Up-and-down strips" }, { id: "stripesH", label: "Side-to-side strips" }]}
        />
      )}
      {equal === "unequal" && (
        <div className="control-row">
          <Stepper label="How uneven" value={Math.round(skew * 100)} min={8} max={30} step={2} onChange={(v) => setSkew(v / 100)} tone="b" />
        </div>
      )}
      <SharePartition shape={shape} pattern={pattern} cutStyle={shape === "rectangle" ? cutStyle : undefined} fractions={fractions} width={170} height={130} />
      <p className="muted small">
        {meta.equal
          ? `This ${shape} is cut into ${meta.pieceCount} EQUAL pieces — each one is called a ${meta.shareName}.`
          : `This ${shape} has ${meta.pieceCount} pieces, but they're NOT the same size — so we can't call them ${shareName}.`}
        {shape === "rectangle" && equal === "equal" && pieceCount === "2" && " Try switching between the straight cut and the diagonal cut — both give 2 EQUAL halves, just shaped differently."}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE — one ProblemType per bucket
// ============================================================================

function halvesEqualProblem(): Problem {
  const shape = pick(SHAPES);
  const cutStyle: RectCutStyle = shape === "rectangle" ? pick(["stripesV", "stripesH", "diag"]) : "stripesV";

  return {
    title: "Cutting into halves",
    bucket: "halves-equal",
    story: `This ${shape} is cut into 2 pieces.`,
    visual: () => <SharePartition shape={shape} pattern="halves-equal" cutStyle={cutStyle} width={150} height={110} />,
    steps: [
      { kind: "number", prompt: "How many EQUAL pieces is this shape cut into?", hint: "Count the pieces, and check they're the same size.", explain: "It's cut into 2 equal pieces.", answer: 2 },
      choice({ prompt: "What do we call one of these equal pieces?", hint: "2 equal pieces of a whole are called...", explain: "2 equal pieces are called halves — each one is a half." }, "A half", ["A third", "A fourth"]),
    ],
    wrapUp: `This ${shape} is cut into 2 equal halves.`,
  };
}

function thirdsEqualProblem(): Problem {
  const shape = pick(SHAPES);
  const cutStyle: RectCutStyle = shape === "rectangle" ? pick(["stripesV", "stripesH"]) : "stripesV";
  const startDeg = shape === "circle" ? pick([-90, 0, 60, 120]) : undefined;

  return {
    title: "Cutting into thirds",
    bucket: "thirds-equal",
    story: `This ${shape} is cut into 3 pieces.`,
    visual: () => <SharePartition shape={shape} pattern="thirds-equal" cutStyle={cutStyle} startDeg={startDeg} width={150} height={110} />,
    steps: [
      { kind: "number", prompt: "How many EQUAL pieces is this shape cut into?", hint: "Count the pieces, and check they're the same size.", explain: "It's cut into 3 equal pieces.", answer: 3 },
      choice({ prompt: "What do we call one of these equal pieces?", hint: "3 equal pieces of a whole are called...", explain: "3 equal pieces are called thirds — each one is a third." }, "A third", ["A half", "A fourth"]),
    ],
    wrapUp: `This ${shape} is cut into 3 equal thirds.`,
  };
}

function fourthsEqualProblem(): Problem {
  const shape = pick(SHAPES);
  const cutStyle: RectCutStyle = shape === "rectangle" ? pick(["stripesV", "stripesH"]) : "stripesV";
  const startDeg = shape === "circle" ? pick([-90, 0, 45]) : undefined;

  return {
    title: "Cutting into fourths",
    bucket: "fourths-equal",
    story: `This ${shape} is cut into 4 pieces.`,
    visual: () => <SharePartition shape={shape} pattern="fourths-equal" cutStyle={cutStyle} startDeg={startDeg} width={150} height={110} />,
    steps: [
      { kind: "number", prompt: "How many EQUAL pieces is this shape cut into?", hint: "Count the pieces, and check they're the same size.", explain: "It's cut into 4 equal pieces.", answer: 4 },
      choice({ prompt: "What do we call one of these equal pieces?", hint: "4 equal pieces of a whole are called...", explain: "4 equal pieces are called fourths (or quarters) — each one is a fourth." }, "A fourth (or quarter)", ["A half", "A third"]),
    ],
    wrapUp: `This ${shape} is cut into 4 equal fourths.`,
  };
}

function sameWholeDifferentShapeProblem(): Problem {
  const count = pick([2, 3] as const);
  const pattern: SharePattern = count === 2 ? "halves-equal" : "thirds-equal";
  const shareName = count === 2 ? "halves" : "thirds";
  const cutStyleA: RectCutStyle = count === 2 ? "stripesV" : "stripesV";
  const cutStyleB: RectCutStyle = count === 2 ? "diag" : "stripesH";

  return {
    title: "Two ways to cut the same whole",
    bucket: "same-whole-different-shape",
    story: `Here are two SAME-SIZE rectangles, both cut into ${shareName}, but in different ways.`,
    visual: () => (
      <div style={{ display: "flex", gap: 16 }}>
        <SharePartition shape="rectangle" pattern={pattern} cutStyle={cutStyleA} width={130} height={95} />
        <SharePartition shape="rectangle" pattern={pattern} cutStyle={cutStyleB} width={130} height={95} />
      </div>
    ),
    steps: [
      choice(
        { prompt: `Is each piece in BOTH rectangles the same AMOUNT (area), even though they're shaped differently?`, hint: "Compare how much space each whole piece takes up, not its outline.", explain: "Yes — both cuts split the same-size whole into equal-amount pieces, even though the pieces look like different shapes." },
        "Yes — both are real " + shareName + ", just cut differently.",
        ["No — only one of these is really cut into " + shareName + "."]
      ),
      choice(
        { prompt: "So does a piece's outline SHAPE decide whether it's a real equal share?", hint: "What actually decides it — the shape of the piece, or the amount it covers?", explain: "No — what matters is the AMOUNT each piece covers, not what shape the piece's outline happens to be." },
        "No — the amount (area) decides it, not the outline shape.",
        ["Yes — the pieces have to look like the exact same shape."]
      ),
    ],
    wrapUp: `Both rectangles are cut into equal ${shareName} — same amount per piece, even though the pieces are shaped differently.`,
  };
}

function unequalTrapProblem(): Problem {
  const shape = pick(SHAPES);
  const count = pick([2, 3, 4] as const);
  const shareName = count === 2 ? "halves" : count === 3 ? "thirds" : "fourths";
  const fractions = unequalFractions(count);

  return {
    title: `Are these really ${count === 2 ? "halves" : count === 3 ? "thirds" : "fourths"}?`,
    bucket: "unequal-trap",
    story: `This ${shape} is cut into ${count} pieces.`,
    visual: () => <SharePartition shape={shape} pattern={(count === 2 ? "halves-unequal" : count === 3 ? "thirds-unequal" : "fourths-unequal") as SharePattern} fractions={fractions} width={150} height={110} />,
    steps: [
      choice({ prompt: `Are all ${count} of these pieces the same size?`, hint: "Compare the biggest piece to the smallest piece.", explain: "No — the pieces are different sizes." }, "No", ["Yes"]),
      choice(
        { prompt: `So can we call these ${count} pieces '${shareName}'?`, hint: `${shareName[0].toUpperCase() + shareName.slice(1)} must be ${count} EQUAL pieces, not just any ${count} pieces.`, explain: `No — ${shareName} have to be ${count} pieces that are all the SAME size.` },
        `No — ${shareName} have to be ${count} equal-size pieces.`,
        [`Yes — there are ${count} pieces, so they're ${shareName}.`]
      ),
    ],
    wrapUp: `These ${count} pieces aren't ${shareName} — they must all be the same size, and these aren't.`,
  };
}

function halfVsThirdCompareProblem(): Problem {
  const shape = pick(SHAPES);

  return {
    title: "Half vs. third",
    bucket: "half-vs-third-compare",
    story: `Here are two same-size ${shape}s — one cut into halves, one cut into thirds.`,
    visual: () => (
      <div className="control-row" style={{ gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <SharePartition shape={shape} pattern="halves-equal" width={120} height={95} />
          <p className="muted small">Halves</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <SharePartition shape={shape} pattern="thirds-equal" width={120} height={95} />
          <p className="muted small">Thirds</p>
        </div>
      </div>
    ),
    steps: [
      choice({ prompt: "Which piece is bigger — a half, or a third, of the same-size whole?", hint: "More pieces from the same-size whole means each piece is smaller.", explain: "A half is bigger than a third of the same-size whole." }, "A half", ["A third", "They're the same size"]),
      choice(
        { prompt: "Why?", hint: "Think about cutting the SAME whole into more pieces.", explain: "Cutting the same-size whole into more pieces (3 instead of 2) makes each piece smaller, not bigger." },
        "Cutting into more pieces makes each piece smaller.",
        ["3 is a bigger number than 2, so thirds must be bigger.", "Halves and thirds are actually the same size."]
      ),
    ],
    wrapUp: "A half is bigger than a third of the same-size whole — more equal shares means smaller shares.",
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <SharePartition shape="circle" pattern="thirds-equal" width={130} height={110} />;
}

export const equalShares: Unit = {
  id: "equalShares",
  title: "Equal Shares of Circles and Rectangles",
  goal: "Split a circle or rectangle into 2, 3, or 4 EQUAL pieces, and name them correctly as halves, thirds, or fourths.",
  standard: "2.G.3",
  keyIdea: (
    <>
      <p>Halves means 2 EQUAL pieces, thirds means 3 EQUAL pieces, and fourths means 4 EQUAL pieces — the pieces have to be the same size, not just the same count.</p>
      <p>Cutting the same-size whole a different way can make pieces that look like different shapes but are still equal shares — and cutting into MORE pieces always makes each piece SMALLER.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "Halves", make: halvesEqualProblem, buckets: ["halves-equal"] },
    { label: "Thirds", make: thirdsEqualProblem, buckets: ["thirds-equal"] },
    { label: "Fourths", make: fourthsEqualProblem, buckets: ["fourths-equal"] },
    { label: "Two ways to cut", make: sameWholeDifferentShapeProblem, buckets: ["same-whole-different-shape"] },
    { label: "Not equal shares?", make: unequalTrapProblem, buckets: ["unequal-trap"] },
    { label: "Half vs. third", make: halfVsThirdCompareProblem, buckets: ["half-vs-third-compare"] },
  ],
  requiredBuckets: ["halves-equal", "thirds-equal", "fourths-equal", "same-whole-different-shape", "unequal-trap", "half-vs-third-compare"],
  test: equalSharesTest,
};
