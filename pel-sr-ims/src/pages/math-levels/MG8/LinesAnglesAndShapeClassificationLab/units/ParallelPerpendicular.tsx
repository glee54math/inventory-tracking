import { useState } from "react";
import { pick } from "../../../shared/lib/math";
import { choice, type Problem, type Step } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { Dot, GeoCanvas, LineShape, Poly, RightMark, Segment, VertexLabels } from "../diagrams/Geo";
import { SideFigureDrawing, TwoLinesDrawing } from "../diagrams/Unit2Figures";
import { foldEndpoints, lineIntersection, lineRelation, sideName, sidesPerpendicularTo, type Pt } from "../lib/geometry";
import { LINES_COLS, LINES_ROWS, makeSideFigure, makeTwoLines, parallelPartner, perpAskable, perpPartner, type FigKind, type LinesBand } from "../lib/unit2Gen";
import { CfuToggle, DropdownCFU, type CfuQuestion } from "./cfu";
import { parallelPerpendicularTest } from "./ParallelPerpendicularTest";

const REL_CHOICES = ["parallel", "perpendicular", "neither"];

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const TRAP: Pt[] = [
  [1, 1],
  [5, 1],
  [7, 5],
  [1, 5],
];
const SIDE_CHOICES = ["side BC", "side CD", "side DA"];

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    prompt: "Two new words. Match each one to what it means.",
    boxes: [
      { label: "Parallel lines…", choices: ["never meet, no matter how far they go", "cross to make a square corner", "cross at a slant"], correct: 0 },
      { label: "Perpendicular lines…", choices: ["never meet, no matter how far they go", "cross to make a square corner", "cross at a slant"], correct: 1 },
    ],
    good: "Yes! Parallel = never meet (like train tracks). Perpendicular = cross at a right angle (like the corner of a window).",
    bad: "Not quite — parallel lines stay the same distance apart forever and never meet. Perpendicular lines DO meet, at an exact square corner.",
  },
  {
    prompt: "These two lines don't touch in the picture. Remember: the arrows mean each line keeps going forever.",
    visual: (
      <GeoCanvas cols={12} rows={8} cell={24} label="Two lines that do not touch in the picture but slant toward each other">
        <LineShape a={[1, 2]} b={[6, 3]} tone="a" />
        <LineShape a={[1, 7]} b={[6, 5]} tone="b" />
      </GeoCanvas>
    ),
    boxes: [
      { label: "Do the lines cross in the picture?", choices: ["Yes", "No"], correct: 1 },
      { label: "If both lines kept going forever, would they ever meet?", choices: ["Yes", "No"], correct: 0 },
      { label: "So are they parallel?", choices: ["Yes", "No"], correct: 1 },
    ],
    good: "Right! They don't touch YET, but they're slanting toward each other — keep going to the right and they meet. Lines that would ever meet are not parallel.",
    bad: "Not quite — follow both lines to the right, past their arrows. The gap between them keeps shrinking, so they WILL meet. \"Not touching in the picture\" isn't the same as \"never meet.\"",
  },
  {
    prompt: "These two lines cross. Check the corner where they meet against the grid.",
    visual: (
      <GeoCanvas cols={12} rows={9} cell={24} label="Two lines crossing at a slant">
        <LineShape a={[1, 6]} b={[11, 6]} tone="a" />
        <LineShape a={[4, 9]} b={[7, 0]} tone="b" />
      </GeoCanvas>
    ),
    boxes: [
      { label: "Do the lines cross?", choices: ["Yes", "No"], correct: 0 },
      { label: "Are they perpendicular?", choices: ["Yes", "No"], correct: 1 },
      { label: "True or false: ANY two lines that cross are perpendicular.", choices: ["True", "False"], correct: 1 },
    ],
    good: "Correct! They cross, but the orange line leans — it isn't straight up and down — so the corners aren't square. Crossing is not enough; perpendicular lines must cross at a RIGHT angle.",
    bad: "Not quite — they do cross, but follow the grid line straight up from the crossing: the orange line leans away from it. The corners aren't square, so these lines are not perpendicular. Lines can cross without being perpendicular.",
  },
  {
    prompt: "Now find parallel and perpendicular SIDES in a shape.",
    visual: (
      <GeoCanvas cols={8} rows={6} cell={28} label="A four-sided shape ABCD">
        <Poly pts={TRAP} />
        <Segment a={TRAP[0]} b={TRAP[1]} tone="a" width={5} />
        <VertexLabels pts={TRAP} letters={["A", "B", "C", "D"]} />
      </GeoCanvas>
    ),
    boxes: [
      { label: "Which side is parallel to side AB (thick blue)?", choices: SIDE_CHOICES, correct: 1 },
      { label: "Which side is perpendicular to side AB?", choices: SIDE_CHOICES, correct: 2 },
    ],
    good: "Yes! CD runs the same direction as AB (both straight across) — parallel. DA goes straight up and down, meeting AB at a square corner — perpendicular. BC is slanted, so it's neither.",
    bad: "Not quite — AB runs straight across. Find the other side that also runs straight across (parallel), and the side that goes straight up and down from A (perpendicular).",
  },
];

function LinesCheck({ onComplete }: { onComplete?: () => void }) {
  return <DropdownCFU title="Check for Understanding: parallel, perpendicular — and the two traps." questions={CFU_QUESTIONS} onComplete={onComplete} />;
}

// ============================================================================
// EXPLORE — turn and slide line B against line A
// ============================================================================

const ALL_DIRS: Pt[] = [
  [1, 0],
  [3, -1],
  [2, -1],
  [1, -1],
  [1, -2],
  [1, -3],
  [0, 1],
  [-1, -3],
  [-1, -2],
  [-1, -1],
  [-2, -1],
  [-3, -1],
];
const HALF = 3.5;

function TwoLinesExplorer() {
  const [aSlant, setASlant] = useState<"flat" | "slant">("flat");
  const [dirIdx, setDirIdx] = useState(3);
  const [shift, setShift] = useState(0);
  const [extend, setExtend] = useState(false);

  const dA: Pt = aSlant === "flat" ? [1, 0] : [2, -1];
  const dB = ALL_DIRS[dirIdx];
  const A0: Pt = [4, 6];
  const B0: Pt = [10, 4 - shift];
  const unit = (d: Pt): Pt => [d[0] / Math.hypot(d[0], d[1]), d[1] / Math.hypot(d[0], d[1])];
  const uA = unit(dA);
  const uB = unit(dB);
  const a1: Pt = [A0[0] - uA[0] * HALF, A0[1] - uA[1] * HALF];
  const a2: Pt = [A0[0] + uA[0] * HALF, A0[1] + uA[1] * HALF];
  const b1: Pt = [B0[0] - uB[0] * HALF, B0[1] - uB[1] * HALF];
  const b2: Pt = [B0[0] + uB[0] * HALF, B0[1] + uB[1] * HALF];

  const rel = lineRelation(dA, dB);
  const meet = lineIntersection(A0, [A0[0] + dA[0], A0[1] + dA[1]], B0, [B0[0] + dB[0], B0[1] + dB[1]]);
  const tA = meet ? (meet[0] - A0[0]) * uA[0] + (meet[1] - A0[1]) * uA[1] : Infinity;
  const tB = meet ? (meet[0] - B0[0]) * uB[0] + (meet[1] - B0[1]) * uB[1] : Infinity;
  const crossInPicture = !!meet && Math.abs(tA) <= HALF && Math.abs(tB) <= HALF;
  const meetOnCanvas = !!meet && meet[0] >= 0 && meet[0] <= LINES_COLS && meet[1] >= 0 && meet[1] <= LINES_ROWS;
  const full = (P: Pt, d: Pt) => foldEndpoints({ a: [P[0] * 2, P[1] * 2], d }, 0, 0, LINES_COLS, LINES_ROWS);
  const fa = full(A0, dA);
  const fb = full(B0, dB);

  let readout: string;
  if (rel === "parallel") readout = "PARALLEL — same direction, same gap all the way. Extend them as far as you like: they never meet.";
  else if (rel === "perpendicular") readout = crossInPicture ? "PERPENDICULAR — they cross at a square corner (a right angle)." : "These WILL cross at a square corner if you extend them — so they're perpendicular lines, even though the pieces drawn don't touch yet.";
  else readout = crossInPicture ? "NEITHER — they cross, but at a slant, not a square corner. Crossing isn't enough to be perpendicular." : "NEITHER — they don't touch in the picture, but they're not parallel: extend them and they meet.";

  return (
    <div className="lasc-card">
      <h3 className="lasc-h">Turn and slide the orange line</h3>
      <p className="muted small">
        Both are <b>lines</b> — the arrows mean they keep going forever. Turn the orange line until it never meets the blue one (<b>parallel</b>), or until it crosses at a square corner (
        <b>perpendicular</b>).
      </p>
      <Segmented label="Blue line" value={aSlant} onChange={setASlant} options={[{ id: "flat", label: "Flat" }, { id: "slant", label: "Slanted" }]} />
      <div className="control-row" style={{ flexWrap: "wrap" }}>
        <Stepper label="Turn orange" value={dirIdx} min={0} max={ALL_DIRS.length - 1} onChange={setDirIdx} tone="b" />
        <Stepper label="Slide orange" value={shift} min={-3} max={3} onChange={setShift} tone="b" />
        <button type="button" className={`btn ghost ${extend ? "pressed" : ""}`} onClick={() => setExtend((v) => !v)}>
          {extend ? "Hide" : "Extend"} the lines
        </button>
      </div>
      <GeoCanvas cols={LINES_COLS} rows={LINES_ROWS} cell={30} label="Two lines you can turn and slide">
        {extend && (
          <>
            <Segment a={fa[0]} b={fa[1]} tone="a" dash width={2} />
            <Segment a={fb[0]} b={fb[1]} tone="b" dash width={2} />
          </>
        )}
        <LineShape a={a1} b={a2} tone="a" />
        <LineShape a={b1} b={b2} tone="b" />
        {meet && meetOnCanvas && (extend || crossInPicture) && <Dot at={meet} tone="bad" r={5.5} />}
        {meet && rel === "perpendicular" && meetOnCanvas && (extend || crossInPicture) && <RightMark v={meet} a={[meet[0] + uA[0], meet[1] + uA[1]]} b={[meet[0] + uB[0], meet[1] + uB[1]]} size={0.6} tone="good" />}
      </GeoCanvas>
      <p className="lasc-readout">{readout}</p>
      {extend && meet && !meetOnCanvas && rel !== "parallel" && <p className="muted small">They meet off the edge of this page — but they DO meet.</p>}
    </div>
  );
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  return (
    <div className="lasc-stack">
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
      <TwoLinesExplorer />
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <LinesCheck onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

const BUCKET_BAND: Record<string, () => LinesBand> = {
  parallel: () => "parallel",
  perpendicular: () => "perpendicular",
  "meet-later": () => "meetLater",
  // ~1 in 3 is the hard near-square (70-84°) crossing
  "crossing-not-perp": () => (Math.random() < 0.35 ? "nearPerp" : "oblique"),
};

function twoLinesProblem(target?: string): Problem {
  const bucket = target && BUCKET_BAND[target] ? target : pick(Object.keys(BUCKET_BAND));
  const s = makeTwoLines(BUCKET_BAND[bucket]());
  const steps: Step[] = [
    choice(
      { prompt: "Do the two lines cross in the picture?", hint: "Look only at what's drawn.", explain: s.crossInPicture ? "Yes — they cross in the picture." : "No — the drawn pieces don't touch." },
      s.crossInPicture ? "Yes" : "No",
      [s.crossInPicture ? "No" : "Yes"]
    ),
  ];
  if (!s.crossInPicture) {
    const meets = s.relation !== "parallel";
    steps.push(
      choice(
        {
          prompt: "If both lines kept going forever (past their arrows), would they ever meet?",
          hint: "Is the gap between them staying the same, or getting smaller in one direction?",
          explain: meets ? "Yes — the gap shrinks in one direction, so extending them makes them meet (see the dashed lines)." : "No — same direction, same gap all the way, so they never meet.",
        },
        meets ? "Yes, they would meet" : "No, never",
        [meets ? "No, never" : "Yes, they would meet"]
      )
    );
  } else {
    const square = s.relation === "perpendicular";
    steps.push(
      choice(
        {
          prompt: "Where they cross, do they make a square corner (a right angle)?",
          hint: "Compare the crossing with the grid's square corners.",
          explain: square ? "Yes — an exact square corner (see the right-angle mark)." : "No — the paper corner shows the crossing isn't square.",
        },
        square ? "Yes" : "No",
        [square ? "No" : "Yes"]
      )
    );
  }
  steps.push(
    choice(
      {
        prompt: "So the blue line and the orange line are…",
        hint: "Parallel = never meet. Perpendicular = cross at a square corner. Otherwise: neither.",
        explain:
          s.relation === "parallel"
            ? "Parallel — they never meet."
            : s.relation === "perpendicular"
              ? "Perpendicular — they cross at a right angle."
              : s.crossInPicture
                ? "Neither — crossing at a slant isn't perpendicular."
                : "Neither — not touching YET doesn't make them parallel; they meet if extended.",
      },
      s.relation,
      REL_CHOICES.filter((c) => c !== s.relation)
    )
  );
  return {
    title: "Two lines",
    bucket,
    story: "Here are two lines. The arrows mean each one keeps going forever.",
    visual: (done) => <TwoLinesDrawing s={s} extend={done >= 2} corner={done >= 2} />,
    steps,
    wrapUp:
      s.relation === "parallel"
        ? "Parallel lines never meet, however far they go."
        : s.relation === "perpendicular"
          ? "Perpendicular lines cross at a square corner."
          : s.crossInPicture
            ? "They cross, but not at a square corner — so they are not perpendicular."
            : "They didn't touch in the picture, but they're not parallel — extended, they meet.",
  };
}

function sidesProblem(): Problem {
  const kind = pick(["rectangle", "parallelogram", "rightTrapezoid", "trapezoid", "oneRight"] as FigKind[]);
  const f = makeSideFigure(kind);
  const L = f.letters;
  const i = pick([0, 1, 2, 3]);
  const partner = parallelPartner(f, i);
  const others = (k: number) => [0, 1, 2, 3].filter((j) => j !== k).map((j) => `side ${sideName(L, j)}`);
  const NONE_PAR = "no side — none are parallel to it";
  const NONE_PERP = "no side — none make a square corner with it";
  const askable = perpAskable(f);
  const j = askable.length > 0 ? pick(askable) : pick([0, 1, 2, 3]);
  const perpStep: Step =
    askable.length > 0
      ? (() => {
          const p = perpPartner(f, j);
          const correct = p === null ? NONE_PERP : `side ${sideName(L, p)}`;
          return choice(
            {
              prompt: `Which side is perpendicular to side ${sideName(L, j)} (now thick blue)?`,
              hint: "Perpendicular sides meet at a square corner.",
              explain: p === null ? `No side meets ${sideName(L, j)} at a square corner.` : `Side ${sideName(L, p)} meets ${sideName(L, j)} at a square corner.`,
            },
            correct,
            [...others(j), NONE_PERP].filter((c) => c !== correct)
          );
        })()
      : {
          kind: "number",
          prompt: `How many sides are perpendicular to side ${sideName(L, j)} (now thick blue)?`,
          hint: "Check both sides that touch it: is each corner square?",
          explain: `${sidesPerpendicularTo(f.pts, j).length} — both sides touching it meet it at square corners.`,
          answer: sidesPerpendicularTo(f.pts, j).length,
        };
  const parCorrect = partner === null ? NONE_PAR : `side ${sideName(L, partner)}`;
  return {
    title: "Sides of a shape",
    bucket: "in-figure",
    story: `Shape ${L.join("")} is drawn on a grid. Its sides are ${[0, 1, 2, 3].map((k) => sideName(L, k)).join(", ")}.`,
    visual: (done) => <SideFigureDrawing f={f} highlight={done === 0 ? [i] : done === 1 ? [j] : []} />,
    steps: [
      choice(
        {
          prompt: `Which side is parallel to side ${sideName(L, i)} (thick blue)?`,
          hint: "Parallel sides run in the same direction — count grid steps across and up along each side.",
          explain: partner === null ? `Nothing runs the same direction as ${sideName(L, i)}.` : `Side ${sideName(L, partner)} runs the same direction as ${sideName(L, i)} — parallel.`,
        },
        parCorrect,
        [...others(i), NONE_PAR].filter((c) => c !== parCorrect)
      ),
      perpStep,
      {
        kind: "number",
        prompt: "How many pairs of parallel sides does this shape have?",
        hint: "Check each pair of opposite sides.",
        explain: `${f.parallelPairs} pair${f.parallelPairs === 1 ? "" : "s"}.`,
        answer: f.parallelPairs,
      },
    ],
    wrapUp: `Shape ${L.join("")} has ${f.parallelPairs} pair${f.parallelPairs === 1 ? "" : "s"} of parallel sides.`,
  };
}

function Preview() {
  return (
    <GeoCanvas cols={8} rows={5} cell={22} label="Parallel and perpendicular lines">
      <LineShape a={[0.5, 1]} b={[7.5, 1]} tone="a" />
      <LineShape a={[0.5, 4]} b={[7.5, 4]} tone="a" />
      <LineShape a={[4, 0.3]} b={[4, 4.7]} tone="b" />
      <RightMark v={[4, 4]} a={[5, 4]} b={[4, 3]} size={0.5} tone="good" />
    </GeoCanvas>
  );
}

export const parallelPerpendicular: Unit = {
  id: "parallelPerpendicular",
  title: "Parallel & Perpendicular Lines",
  goal: "I can identify parallel lines (lines that never meet) and perpendicular lines (lines that cross at a right angle) in a figure.",
  standard: "4.G.1",
  keyIdea: (
    <>
      <p>
        <b>Parallel</b> lines never meet — not even if you made them a mile long. <b>Perpendicular</b> lines cross at a square corner (a right angle).
      </p>
      <p>Two traps: lines that don't touch in the picture might still meet off the page (not parallel), and lines that cross at a slant are NOT perpendicular.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "Two lines", make: twoLinesProblem, buckets: ["parallel", "perpendicular", "meet-later", "crossing-not-perp"] },
    { label: "Sides of a shape", make: sidesProblem, buckets: ["in-figure"] },
  ],
  requiredBuckets: ["parallel", "perpendicular", "meet-later", "crossing-not-perp", "in-figure"],
  test: parallelPerpendicularTest,
};
