import { useRef, useState } from "react";
import type React from "react";
import { pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { AngleArc, CornerTester, Dot, GeoCanvas, Label, LineShape, Poly, Ray, Segment, VertexLabels } from "../diagrams/Geo";
import { AngleDrawing, FigureDrawing, ShapeDrawing } from "../diagrams/Unit1Figures";
import { angleDeg, angleTypeOf, type AngleType, type Pt } from "../lib/geometry";
import { FIGURE_ENDPOINTS, FIGURE_NAME, makeAngle, makeFigure, makeShapeWithOne, type AngleBand, type FigureKind, type FigureSpec } from "../lib/unit1Gen";
import { CfuToggle, DropdownCFU, type CfuQuestion } from "./cfu";
import { pointsLinesRaysAnglesTest } from "./PointsLinesRaysAnglesTest";

const TESTER_WORD: Record<AngleType, string> = {
  acute: "inside the paper corner (the angle is smaller)",
  right: "exactly on the paper corner's edge",
  obtuse: "outside the paper corner (the angle is bigger)",
};

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const CFU_RAY: FigureSpec = { kind: "ray", p: [1, 1.5], q: [4, 1.5], tipP: [0, 1.5], tipQ: [6, 1.5], names: ["A", "B"], cols: 7, rows: 3 };
const CFU_LINE: FigureSpec = { kind: "line", p: [2, 1.5], q: [5, 1.5], tipP: [0.5, 1.5], tipQ: [6.5, 1.5], names: ["C", "D"], cols: 7, rows: 3 };
const CFU_SEG: FigureSpec = { kind: "segment", p: [1, 1.5], q: [6, 1.5], tipP: [1, 1.5], tipQ: [6, 1.5], names: ["E", "F"], cols: 7, rows: 3 };
const FIG_CHOICES = ["line segment", "ray", "line"];

const CFU_NEAR = { v: [1, 7] as Pt, a: [7, 7] as Pt, b: [2, 1] as Pt }; // 80.5° — acute, but looks square
const CFU_QUAD: Pt[] = [
  [1, 5],
  [7, 5],
  [5, 1],
  [1, 1],
];

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    prompt: "Name each figure. Look closely at the ends.",
    visual: (
      <div className="lasc-row">
        {[CFU_RAY, CFU_LINE, CFU_SEG].map((f, i) => (
          <div key={i} className="lasc-tile">
            <FigureDrawing f={f} cell={24} />
            <b>Figure {i + 1}</b>
          </div>
        ))}
      </div>
    ),
    boxes: [
      { label: "Figure 1 is a", choices: FIG_CHOICES, correct: 1 },
      { label: "Figure 2 is a", choices: FIG_CHOICES, correct: 2 },
      { label: "Figure 3 is a", choices: FIG_CHOICES, correct: 0 },
    ],
    good: "Right! Figure 1 stops at A but has an arrow past B — a ray. Figure 2 has arrows on both ends — a line. Figure 3 stops at a dot on both ends — a line segment.",
    bad: "Not quite — check the ends of each one. A dot means it STOPS there. An arrow means it keeps going forever that way.",
  },
  {
    prompt: "Rays and line segments both look like a straight mark. Here's how to tell them apart.",
    boxes: [
      { label: "A ray has this many endpoints:", choices: ["0", "1", "2"], correct: 1 },
      { label: "A line segment has this many endpoints:", choices: ["0", "1", "2"], correct: 2 },
      { label: "Which one could you measure with a ruler, end to end?", choices: ["the ray", "the line segment", "both of them"], correct: 1 },
    ],
    good: "Yes! A line segment has 2 endpoints, so it has a length you can measure. A ray has only 1 endpoint — it never ends on the other side, so it has no length to measure.",
    bad: "Not quite — count where each one STOPS. A ray stops at one end only; a line segment stops at both ends. You can only measure between two ends.",
  },
  {
    prompt: "This angle looks almost like a square corner. Check it against the grid lines.",
    visual: (
      <GeoCanvas cols={9} rows={8} cell={24} label="An angle that looks almost square">
        <AngleArc v={CFU_NEAR.v} a={CFU_NEAR.a} b={CFU_NEAR.b} r={1.1} />
        <Ray from={CFU_NEAR.v} to={CFU_NEAR.a} endpointDot={false} />
        <Ray from={CFU_NEAR.v} to={CFU_NEAR.b} endpointDot={false} />
        <Dot at={CFU_NEAR.v} r={5.5} />
      </GeoCanvas>
    ),
    boxes: [
      { label: "This angle is", choices: ["acute", "right", "obtuse"], correct: 0 },
      { label: "True or false: if an angle LOOKS almost square, it is a right angle.", choices: ["True", "False"], correct: 1 },
    ],
    good: "Correct! The slanted ray leans one square to the right of the straight-up grid line, so the angle is a little SMALLER than a square corner — acute. Almost square is not the same as square; always check.",
    bad: "Not quite — follow the grid line straight up from the corner. The ray doesn't go straight up; it leans toward the other ray, so the opening is smaller than a square corner. Looking close to square isn't enough — a right angle has to be EXACTLY square.",
  },
  {
    prompt: "Now find angles inside a shape. Look at each corner one at a time.",
    visual: (
      <GeoCanvas cols={8} rows={6} cell={28} label="A four-sided shape with corners A, B, C, D">
        <Poly pts={CFU_QUAD} />
        <VertexLabels pts={CFU_QUAD} letters={["A", "B", "C", "D"]} />
      </GeoCanvas>
    ),
    boxes: [
      { label: "Which angle is obtuse?", choices: ["angle A", "angle B", "angle C", "angle D"], correct: 2 },
      { label: "How many right angles does the shape have?", choices: ["0", "1", "2", "3", "4"], correct: 2 },
    ],
    good: "Yes! Angles A and D are square corners (both sides run along grid lines) — 2 right angles. Angle C opens wider than a square corner, so it's obtuse. (Angle B is acute.)",
    bad: "Not quite — visit each corner. A corner whose two sides follow the grid lines is a right angle. One corner opens WIDER than square (obtuse) and one is narrower (acute).",
  },
];

function PointsCheck({ onComplete }: { onComplete?: () => void }) {
  return <DropdownCFU title="Check for Understanding: show you can tell segments, rays and lines apart — and check angles instead of guessing." questions={CFU_QUESTIONS} onComplete={onComplete} />;
}

// ============================================================================
// EXPLORE
// ============================================================================

/** Toggle arrows on either end of one straight mark and watch its name change. */
function FigureBuilder() {
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const kind: FigureKind = left && right ? "line" : left || right ? "ray" : "segment";
  const P: Pt = [2, 1.5];
  const Q: Pt = [8, 1.5];
  const tipL: Pt = [0.4, 1.5];
  const tipR: Pt = [9.6, 1.5];
  const forever = kind === "line" ? "in BOTH directions" : kind === "ray" ? `in ONE direction (${right ? "to the right" : "to the left"})` : "in neither direction — it stops at both dots";
  return (
    <div className="lasc-card">
      <h3 className="lasc-h">1. Point, line segment, ray, line</h3>
      <p className="muted small">
        A <b>point</b> is one exact spot, drawn as a dot and named with a letter. Turn the arrows on and off below — an arrow means "this keeps going forever that way."
      </p>
      <div className="control-row">
        <button type="button" className={`btn ghost ${left ? "pressed" : ""}`} onClick={() => setLeft((v) => !v)}>
          {left ? "Remove" : "Add"} left arrow
        </button>
        <button type="button" className={`btn ghost ${right ? "pressed" : ""}`} onClick={() => setRight((v) => !v)}>
          {right ? "Remove" : "Add"} right arrow
        </button>
      </div>
      <GeoCanvas cols={10} rows={3} cell={34} grid={false} label={`A ${FIGURE_NAME[kind]}`}>
        {kind === "segment" && <Segment a={P} b={Q} endDots />}
        {kind === "ray" && (right ? <Ray from={P} to={tipR} /> : <Ray from={Q} to={tipL} />)}
        {kind === "line" && <LineShape a={tipL} b={tipR} />}
        {(kind === "line" || (kind === "ray" && right)) && <Dot at={Q} r={5} />}
        {(kind === "line" || (kind === "ray" && left)) && <Dot at={P} r={5} />}
        <Label at={P} text="P" dir={[0, -1]} off={18} />
        <Label at={Q} text="Q" dir={[0, -1]} off={18} />
      </GeoCanvas>
      <p className="lasc-readout">
        This is a <b>{FIGURE_NAME[kind]}</b>. Endpoints: <b>{FIGURE_ENDPOINTS[kind]}</b>. It goes on forever {forever}.
        {kind === "segment" && " Because it has two ends, you can measure its length."}
      </p>
    </div>
  );
}

const ANGLE_COLS = 12;
const ANGLE_ROWS = 7;
const AV: Pt = [6, 6];
const AA: Pt = [11, 6];

/** Drag the end of the second ray around a fixed vertex; the grid snap keeps
 *  every angle exact, so the readout (via angleTypeOf) is never a guess. */
function AngleExplorer() {
  const [b, setB] = useState<Pt>([8, 1]);
  const [tester, setTester] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const CELL = 32;
  const PAD = 16;

  const u: Pt = [AA[0] - AV[0], AA[1] - AV[1]];
  const w: Pt = [b[0] - AV[0], b[1] - AV[1]];
  const type = angleTypeOf(u, w);
  const deg = angleDeg(u, w);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const W = PAD * 2 + ANGLE_COLS * CELL;
    const scale = W / rect.width;
    const gx = Math.round(((e.clientX - rect.left) * scale - PAD) / CELL);
    const gy = Math.round(((e.clientY - rect.top) * scale - PAD) / CELL);
    const x = Math.max(0, Math.min(ANGLE_COLS, gx));
    const y = Math.max(0, Math.min(AV[1] - 1, gy)); // stay above the first ray (no straight/flat angle)
    setB([x, y]);
  };

  const presets: { label: string; at: Pt }[] = [
    { label: "Acute", at: [9, 2] },
    { label: "Right", at: [6, 1] },
    { label: "Obtuse", at: [2, 2] },
    { label: "Almost right", at: [7, 0] },
  ];

  return (
    <div className="lasc-card">
      <h3 className="lasc-h">2. Angles: acute, right, obtuse</h3>
      <p className="muted small">
        An <b>angle</b> is two rays that share the same endpoint (the <b>vertex</b>). A <b>right angle</b> is a square corner, like the corner of a sheet of paper. An <b>acute</b> angle is
        smaller than that; an <b>obtuse</b> angle is bigger (but not a flat, straight line). Drag the big dot to open or close the angle.
      </p>
      <div className="control-row" style={{ flexWrap: "wrap" }}>
        {presets.map((p) => (
          <button key={p.label} type="button" className="btn ghost" onClick={() => setB(p.at)}>
            {p.label}
          </button>
        ))}
        <button type="button" className={`btn ghost ${tester ? "pressed" : ""}`} onClick={() => setTester((v) => !v)}>
          {tester ? "Hide" : "Show"} paper corner
        </button>
      </div>
      <GeoCanvas
        cols={ANGLE_COLS}
        rows={ANGLE_ROWS}
        cell={CELL}
        pad={PAD}
        label={`An angle that is ${type}`}
        svgRef={svgRef}
        onPointerMove={onMove}
        onPointerUp={() => {
          dragging.current = false;
        }}
      >
        {tester && <CornerTester v={AV} along={AA} toward={b} size={3} />}
        <AngleArc v={AV} a={AA} b={b} r={1.2} />
        <Ray from={AV} to={AA} endpointDot={false} />
        <Ray from={AV} to={b} endpointDot={false} />
        <Dot at={AV} r={6} />
        <circle
          cx={PAD + b[0] * CELL}
          cy={PAD + b[1] * CELL}
          r={13}
          style={{ fill: "var(--card)", stroke: "var(--qa)", strokeWidth: 3, cursor: "grab", touchAction: "none" }}
          onPointerDown={(e) => {
            (e.target as Element).setPointerCapture?.(e.pointerId);
            dragging.current = true;
          }}
        />
      </GeoCanvas>
      <p className="lasc-readout">
        This is {type === "acute" ? "an" : type === "right" ? "a" : "an"} <b>{type} angle</b>
        {type === "right" ? " — an exact square corner." : type === "acute" ? " — smaller than a square corner." : " — bigger than a square corner."}
        {type !== "right" && Math.abs(deg - 90) < 12 && " Careful: it's CLOSE to square, but not exactly. Turn on the paper corner to see the gap."}
      </p>
      {tester && <p className="muted small">The paper corner lies along the bottom ray. The other ray lands {TESTER_WORD[type]}.</p>}
    </div>
  );
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  return (
    <div className="lasc-stack">
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
      {(introActive || showCheck) && <PointsCheck onComplete={onIntroDone} />}
      <FigureBuilder />
      <AngleExplorer />
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

function figureProblem(): Problem {
  const kind = pick(["segment", "ray", "line"] as FigureKind[]);
  const f = makeFigure(kind);
  const [n1, n2] = f.names;
  return {
    title: "Segment, ray, or line?",
    bucket: "line-ray-segment",
    story: `Here is a straight figure through points ${n1} and ${n2}.`,
    visual: () => <FigureDrawing f={f} />,
    steps: [
      choice(
        {
          prompt: "What is this figure called?",
          hint: "Look at each end: a dot means it stops; an arrow means it keeps going forever.",
          explain:
            kind === "segment"
              ? "Dots on both ends — it stops both ways. That's a line segment."
              : kind === "ray"
                ? "A dot on one end and an arrow on the other — a ray. It starts at its endpoint and goes on forever one way."
                : "Arrows on both ends — it never stops either way. That's a line.",
        },
        FIGURE_NAME[kind],
        ["line segment", "ray", "line"].filter((x) => x !== FIGURE_NAME[kind])
      ),
      {
        kind: "number",
        prompt: `How many endpoints does a ${FIGURE_NAME[kind]} have?`,
        hint: "An endpoint is a place where it stops.",
        explain: `A ${FIGURE_NAME[kind]} has ${FIGURE_ENDPOINTS[kind]} endpoint${FIGURE_ENDPOINTS[kind] === 1 ? "" : "s"}.`,
        answer: FIGURE_ENDPOINTS[kind],
      },
    ],
    wrapUp: `Segment = 2 endpoints, ray = 1 endpoint, line = 0 endpoints. This one was a ${FIGURE_NAME[kind]}.`,
  };
}

function angleProblem(): Problem {
  // the near-right band gets an extra share: it's the case this unit exists to fix
  const band = pick(["acute", "right", "obtuse", "nearRight", "nearRight"] as AngleBand[]);
  const s = makeAngle(band);
  return {
    title: s.nearRight ? "Almost square?" : "What kind of angle?",
    bucket: "angle-isolated",
    story: s.nearRight ? "This angle is close to a square corner. Use the grid lines to check it carefully." : "Here is an angle drawn on a grid.",
    visual: (done) => <AngleDrawing s={s} tester={done >= 1} />,
    steps: [
      choice(
        {
          prompt: "What kind of angle is it?",
          hint: "Follow the grid line that makes a square corner with the first ray. Does the other ray land inside it, on it, or outside it?",
          explain:
            s.type === "right" ? "It's an exact square corner — a right angle." : s.type === "acute" ? "It's smaller than a square corner — acute." : "It opens wider than a square corner — obtuse.",
        },
        s.type,
        ["acute", "right", "obtuse"].filter((t) => t !== s.type)
      ),
      choice(
        {
          prompt: "Now a paper corner is laid along one ray. Where does the other ray land?",
          hint: "Look at the dashed square corner.",
          explain: `It lands ${TESTER_WORD[s.type]} — so it's ${s.type === "right" ? "a right angle" : s.type === "acute" ? "acute" : "obtuse"}.`,
        },
        TESTER_WORD[s.type],
        Object.values(TESTER_WORD).filter((t) => t !== TESTER_WORD[s.type])
      ),
    ],
    wrapUp: s.nearRight ? "Close to square is NOT the same as square. A right angle has to be exactly square — always check." : `That angle is ${s.type}.`,
  };
}

function shapeAngleProblem(): Problem {
  const target = pick(["acute", "right", "obtuse"] as AngleType[]);
  const s = makeShapeWithOne(target);
  const n = s.pts.length;
  const other = pick(s.pts.map((_, i) => i).filter((i) => i !== s.targetIdx));
  const rights = s.types.filter((t) => t === "right").length;
  const article = (t: AngleType) => (t === "right" ? "a right" : t === "acute" ? "an acute" : "an obtuse");
  return {
    title: "Angles inside a shape",
    bucket: "angle-in-figure",
    story: `This ${n === 3 ? "triangle" : "four-sided shape"} has corners ${s.letters.join(", ")}. Each corner makes an angle.`,
    visual: (done) => <ShapeDrawing s={s} highlight={done === 1 ? other : undefined} />,
    steps: [
      choice(
        {
          prompt: `Which angle is ${article(target)} angle?`,
          hint: "Check one corner at a time. Compare each with a square corner on the grid.",
          explain: `Angle ${s.letters[s.targetIdx]} is the only ${target} angle in this shape.`,
        },
        `angle ${s.letters[s.targetIdx]}`,
        s.letters.filter((_, i) => i !== s.targetIdx).map((l) => `angle ${l}`)
      ),
      choice(
        {
          prompt: `What kind of angle is angle ${s.letters[other]} (shaded)?`,
          hint: "Smaller than a square corner, exactly square, or bigger?",
          explain: `Angle ${s.letters[other]} is ${s.types[other]}.`,
        },
        s.types[other],
        ["acute", "right", "obtuse"].filter((t) => t !== s.types[other])
      ),
      {
        kind: "number",
        prompt: "How many right angles does this shape have?",
        hint: "A right angle's two sides both run along grid lines here.",
        explain: `${rights === 0 ? "None" : rights} — ${s.letters.map((l, i) => `${l} is ${s.types[i]}`).join(", ")}.`,
        answer: rights,
      },
    ],
    wrapUp: `Corner by corner: ${s.letters.map((l, i) => `${l} ${s.types[i]}`).join(", ")}.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  const v: Pt = [1, 4];
  return (
    <GeoCanvas cols={7} rows={5} cell={22} label="A ray and an obtuse angle">
      <AngleArc v={v} a={[6, 4]} b={[0, 0]} r={1} />
      <Ray from={v} to={[6, 4]} endpointDot={false} />
      <Ray from={v} to={[0, 0]} endpointDot={false} />
      <Dot at={v} r={5} />
      <Segment a={[3, 1]} b={[6, 1]} endDots />
    </GeoCanvas>
  );
}

export const pointsLinesRaysAngles: Unit = {
  id: "pointsLinesRaysAngles",
  title: "Points, Lines, Rays & Angle Types",
  goal: "I can tell the difference between a point, a line, a line segment, and a ray, and I can identify right, acute, and obtuse angles inside a shape.",
  standard: "4.G.1",
  keyIdea: (
    <>
      <p>
        Look at the ENDS. A <b>line segment</b> stops at two endpoints. A <b>ray</b> has one endpoint and an arrow — it goes on forever one way. A <b>line</b> has arrows on both ends — it goes
        on forever both ways.
      </p>
      <p>
        Two rays that share an endpoint make an <b>angle</b>. Compare it to a square corner: smaller is <b>acute</b>, exactly square is <b>right</b>, bigger is <b>obtuse</b>. "Almost square"
        doesn't count — check it!
      </p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "Segment, ray, or line", make: figureProblem, buckets: ["line-ray-segment"] },
    { label: "Angle types", make: angleProblem, buckets: ["angle-isolated"] },
    { label: "Angles in a shape", make: shapeAngleProblem, buckets: ["angle-in-figure"] },
  ],
  requiredBuckets: ["line-ray-segment", "angle-isolated", "angle-in-figure"],
  test: pointsLinesRaysAnglesTest,
};
