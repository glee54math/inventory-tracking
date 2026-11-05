import { useState } from "react";
import { pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { TriangleDrawing } from "../diagrams/Unit3Figures";
import { ANGLE_TYPES, angleClassSq, isValidTriangle, SIDE_CLASSES, sideClassSq, triangleFromLengths, type AngleType, type Pt, type SideClass } from "../lib/geometry";
import { ANGLE_TRI_NAME, ANGLE_TRI_RULE, equalSideCount, fullName, makeTriangle, SIDE_RULE, type TriSpec } from "../lib/unit3Gen";
import { CfuToggle, DropdownCFU, type CfuQuestion } from "./cfu";
import { classifyingTrianglesTest } from "./ClassifyingTrianglesTest";

const ANGLE_NAMES = ["acute triangle", "right triangle", "obtuse triangle"];

/** A fixed (non-random) TriSpec for the CFU pictures. */
function fixedTri(lens: [number, number, number], labels: (string | null)[], rightIso = false): TriSpec {
  const sq = lens.map((l, i) => (rightIso && i === 2 ? 2 * lens[0] * lens[0] : l * l)) as [number, number, number];
  const raw = triangleFromLengths(lens[1], lens[2], lens[0]);
  const minX = Math.min(...raw.map((p) => p[0]));
  const minY = Math.min(...raw.map((p) => p[1]));
  const w = Math.max(...raw.map((p) => p[0])) - minX;
  const h = Math.max(...raw.map((p) => p[1])) - minY;
  const k = 7 / Math.max(w, h);
  const pts = raw.map(([x, y]) => [(x - minX) * k + 1.6, (y - minY) * k + 1.4] as Pt) as [Pt, Pt, Pt];
  const angle = angleClassSq(sq[0], sq[1], sq[2]);
  const longest = sq.indexOf(Math.max(...sq));
  return {
    sides: lens,
    sq,
    labels,
    sideClass: sideClassSq(sq[0], sq[1], sq[2]),
    angleClass: angle,
    rightAt: angle === "right" ? (longest + 2) % 3 : null,
    pts,
    cols: Math.ceil(w * k + 3.2),
    rows: Math.ceil(h * k + 2.8),
    nearMiss: false,
  };
}

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

const RIGHT_ISO = fixedTri([5, 5, 5 * Math.SQRT2], ["5 cm", "5 cm", null], true);
const NEAR = fixedTri([8, 9, 8], ["8 cm", "9 cm", "8 cm"]);
const SIDE_CH = ["equilateral", "isosceles", "scalene"];

const CFU_QUESTIONS: CfuQuestion[] = [
  {
    prompt: "Triangles get a name from their SIDES. Match each rule to its name.",
    boxes: [
      { label: "All 3 sides the same length:", choices: SIDE_CH, correct: 0 },
      { label: "Exactly 2 sides the same length:", choices: SIDE_CH, correct: 1 },
      { label: "No sides the same length:", choices: SIDE_CH, correct: 2 },
    ],
    good: "Yes! Equilateral = all equal, isosceles = exactly two equal, scalene = none equal.",
    bad: "Not quite — \"equi-lateral\" means \"equal sides\" (all of them). Isosceles has exactly two equal sides. Scalene has no equal sides.",
  },
  {
    prompt: "Triangles ALSO get a name from their ANGLES. Name this one both ways. (The little square marks a right angle.)",
    visual: <TriangleDrawing t={RIGHT_ISO} />,
    boxes: [
      { label: "By its sides, it is", choices: SIDE_CH, correct: 1 },
      { label: "By its angles, it is", choices: ANGLE_NAMES, correct: 1 },
      { label: "True or false: a triangle can only have ONE of these names.", choices: ["True", "False"], correct: 1 },
    ],
    good: "Right! Two 5 cm sides make it isosceles, and the square corner makes it a right triangle — so it's a RIGHT ISOSCELES triangle. Every triangle gets a name from each system, at the same time.",
    bad: "Not quite — the side-name and the angle-name are two different questions, and a triangle answers BOTH. Its two 5 cm sides make it isosceles, and the little square makes it a right triangle — both are true at once.",
  },
  {
    prompt: "This triangle looks like all its sides could be equal. Use the measurements.",
    visual: <TriangleDrawing t={NEAR} />,
    boxes: [
      { label: "How many sides are the same length as another side?", choices: ["0", "2", "3"], correct: 1 },
      { label: "So by its sides, it is", choices: SIDE_CH, correct: 1 },
    ],
    good: "Correct! 8 cm, 8 cm and 9 cm — only two match, so it's isosceles, not equilateral. The numbers decide, not how it looks.",
    bad: "Not quite — read the labels: 8, 9 and 8. Two sides match and one doesn't, even though it looks close. That's isosceles.",
  },
  {
    prompt: "Think about what's ALWAYS possible.",
    boxes: [
      { label: "Can one triangle have TWO right angles?", choices: ["Yes", "No"], correct: 1 },
      { label: "Can a right triangle also be scalene?", choices: ["Yes", "No"], correct: 0 },
    ],
    good: "Yes! Two square corners would make two sides parallel, so they could never meet to close a triangle — at most one right angle. But a right triangle can have all different sides (like 3 cm, 4 cm, 5 cm) — right AND scalene.",
    bad: "Not quite — try drawing two square corners on one side: the other two sides go straight up side by side and never meet, so no triangle has two right angles. But a right triangle's sides can all be different, like 3, 4 and 5 — right and scalene at once.",
  },
];

function TrianglesCheck({ onComplete }: { onComplete?: () => void }) {
  return <DropdownCFU title="Check for Understanding: every triangle gets a side-name AND an angle-name." questions={CFU_QUESTIONS} onComplete={onComplete} />;
}

// ============================================================================
// EXPLORE — build a triangle from three side lengths; see BOTH names
// ============================================================================

function TriangleBuilder() {
  const [a, setA] = useState(6);
  const [b, setB] = useState(6);
  const [c, setC] = useState(6);
  const [rightIso, setRightIso] = useState(false);
  const lens: [number, number, number] = rightIso ? [5, 5, 5 * Math.SQRT2] : [a, b, c];
  const valid = rightIso || isValidTriangle(a, b, c);
  const t = valid ? fixedTri(lens, rightIso ? ["5 cm", "5 cm", null] : [`${a} cm`, `${b} cm`, `${c} cm`], rightIso) : null;
  const set = (f: (n: number) => void) => (n: number) => {
    setRightIso(false);
    f(n);
  };
  return (
    <div className="lasc-card">
      <h3 className="lasc-h">Build a triangle</h3>
      <p className="muted small">Change the three side lengths. Watch BOTH names — one from the sides, one from the angles. Try to land in every box of the table you can.</p>
      <div className="control-row" style={{ flexWrap: "wrap" }}>
        <Stepper label="Side 1 (cm)" value={a} min={2} max={12} onChange={set(setA)} tone="a" />
        <Stepper label="Side 2 (cm)" value={b} min={2} max={12} onChange={set(setB)} tone="b" />
        <Stepper label="Side 3 (cm)" value={c} min={2} max={12} onChange={set(setC)} tone="c" />
      </div>
      <div className="control-row" style={{ flexWrap: "wrap" }}>
        {(
          [
            ["Equilateral", [6, 6, 6]],
            ["3-4-5", [3, 4, 5]],
            ["Obtuse isosceles", [5, 5, 9]],
            ["Almost equal", [8, 9, 8]],
          ] as [string, [number, number, number]][]
        ).map(([label, v]) => (
          <button
            key={label}
            type="button"
            className="btn ghost"
            onClick={() => {
              setRightIso(false);
              setA(v[0]);
              setB(v[1]);
              setC(v[2]);
            }}
          >
            {label}
          </button>
        ))}
        <button type="button" className={`btn ghost ${rightIso ? "pressed" : ""}`} onClick={() => setRightIso(true)}>
          Right isosceles
        </button>
      </div>
      <div className="lasc-row" style={{ alignItems: "flex-start" }}>
        <div style={{ minWidth: 220 }}>
          {t ? (
            <TriangleDrawing t={t} cell={26} />
          ) : (
            <p className="feedback bad">These can't close up into a triangle — the longest side must be shorter than the other two put together.</p>
          )}
        </div>
        <table className="lasc-table" aria-label="Triangle names: sides by angles">
          <thead>
            <tr>
              <th />
              {ANGLE_TYPES.map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIDE_CLASSES.map((s) => (
              <tr key={s}>
                <th>{s}</th>
                {ANGLE_TYPES.map((x) => {
                  const impossible = s === "equilateral" && x !== "acute";
                  const here = !!t && t.sideClass === s && t.angleClass === x;
                  return (
                    <td key={x} className={here ? "on" : impossible ? "off" : ""}>
                      {impossible ? "impossible" : here ? "★ you are here" : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {t && (
        <p className="lasc-readout">
          By its sides: <b>{t.sideClass}</b> ({SIDE_RULE[t.sideClass]}). By its angles: <b>{ANGLE_TRI_NAME[t.angleClass]}</b> ({ANGLE_TRI_RULE[t.angleClass]}). Full name:{" "}
          <b>{fullName(t.sideClass, t.angleClass)}</b>.
          {rightIso && " (Its long side is about 7.1 cm — not a whole number, so it's left unlabeled.)"}
        </p>
      )}
    </div>
  );
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  return (
    <div className="lasc-stack">
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
      <TriangleBuilder />
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <TrianglesCheck onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

const sideArticle = (s: SideClass) => (s === "scalene" ? "a" : "an");

function bySidesProblem(): Problem {
  const side = pick(SIDE_CLASSES);
  const t = makeTriangle({ side, angle: side === "equilateral" ? "acute" : pick(["acute", "obtuse"] as AngleType[]) });
  const n = equalSideCount(side);
  return {
    title: "Name it by its sides",
    bucket: "by-sides",
    story: "Here is a triangle with its side lengths labeled.",
    visual: () => <TriangleDrawing t={t} />,
    steps: [
      {
        kind: "number",
        prompt: "How many of its sides are the same length as another side? (Type 0 if none.)",
        hint: "Read the three labels. Which numbers repeat?",
        explain: `${n} — ${t.labels.filter(Boolean).join(", ")}.`,
        answer: n,
      },
      choice(
        { prompt: "So by its sides, this triangle is…", hint: "All 3 equal: equilateral. Exactly 2: isosceles. None: scalene.", explain: `${SIDE_RULE[side]} → ${side}.` },
        side,
        SIDE_CLASSES.filter((s) => s !== side)
      ),
    ],
    wrapUp: `${sideArticle(side) === "an" ? "An" : "A"} ${side} triangle has ${SIDE_RULE[side]}.`,
  };
}

function byAnglesProblem(): Problem {
  const angle = pick(ANGLE_TYPES);
  const t = makeTriangle({ angle, side: angle === "acute" ? pick(SIDE_CLASSES) : pick(["isosceles", "scalene"] as SideClass[]) });
  return {
    title: "Name it by its angles",
    bucket: "by-angles",
    story: "Look at this triangle's corners. (A little square marks a right angle.)",
    visual: () => <TriangleDrawing t={t} />,
    steps: [
      choice(
        {
          prompt: "What kind of angle is its BIGGEST angle?",
          hint: "Find the widest corner. Compare it with a square corner.",
          explain: angle === "right" ? "It's marked with a square — a right angle." : angle === "obtuse" ? "It opens wider than a square corner — obtuse." : "Even the widest corner is smaller than a square corner — acute.",
        },
        angle,
        ANGLE_TYPES.filter((x) => x !== angle)
      ),
      choice(
        {
          prompt: "So by its angles, this triangle is…",
          hint: "A right angle makes a right triangle; an obtuse angle makes an obtuse triangle; if ALL are acute, it's acute.",
          explain: `${ANGLE_TRI_RULE[angle]} → ${ANGLE_TRI_NAME[angle]}.`,
        },
        ANGLE_TRI_NAME[angle],
        ANGLE_NAMES.filter((x) => x !== ANGLE_TRI_NAME[angle])
      ),
    ],
    wrapUp: `${ANGLE_TRI_NAME[angle][0].toUpperCase()}${ANGLE_TRI_NAME[angle].slice(1)}: ${ANGLE_TRI_RULE[angle]}.`,
  };
}

function bothProblem(): Problem {
  const combo = pick([
    ["isosceles", "right"],
    ["scalene", "right"],
    ["isosceles", "obtuse"],
    ["scalene", "obtuse"],
    ["isosceles", "acute"],
    ["scalene", "acute"],
    ["equilateral", "acute"],
  ] as [SideClass, AngleType][]);
  const t = makeTriangle({ side: combo[0], angle: combo[1] });
  const correct = fullName(combo[0], combo[1]);
  const otherSide = pick(SIDE_CLASSES.filter((s) => s !== combo[0] && !(s === "equilateral" && combo[1] !== "acute")));
  const otherAngle = pick(ANGLE_TYPES.filter((x) => x !== combo[1]));
  return {
    title: "Both names",
    bucket: "both",
    story: "Every triangle gets TWO names: one from its sides and one from its angles.",
    visual: () => <TriangleDrawing t={t} />,
    steps: [
      choice({ prompt: "By its sides, it is…", hint: "Read the labels.", explain: `${SIDE_RULE[combo[0]]} → ${combo[0]}.` }, combo[0], SIDE_CLASSES.filter((s) => s !== combo[0])),
      choice(
        { prompt: "By its angles, it is…", hint: "Look at its biggest corner.", explain: `${ANGLE_TRI_RULE[combo[1]]} → ${ANGLE_TRI_NAME[combo[1]]}.` },
        ANGLE_TRI_NAME[combo[1]],
        ANGLE_NAMES.filter((x) => x !== ANGLE_TRI_NAME[combo[1]])
      ),
      choice(
        { prompt: "So its full name is…", hint: "Put the two names together — they don't cancel each other out.", explain: `Both names at once: ${correct}.` },
        correct,
        [fullName(otherSide, combo[1]), fullName(combo[0], otherAngle), `just "${combo[0]}" — it can't have two names`]
      ),
    ],
    wrapUp: `This is ${combo[1] === "acute" || combo[1] === "obtuse" ? "an" : "a"} ${correct} — one name from its sides, one from its angles.`,
  };
}

function nearMissProblem(): Problem {
  const t = makeTriangle({ nearMiss: true });
  return {
    title: "Looks equal… is it?",
    bucket: "near-miss",
    story: "This triangle looks like all its sides might be the same length. Check the measurements.",
    visual: () => <TriangleDrawing t={t} />,
    steps: [
      choice(
        {
          prompt: "Are all three sides the same length?",
          hint: "Read the three labels carefully.",
          explain: `No — the sides are ${t.sides.join(", ")}.`,
        },
        "No",
        ["Yes"]
      ),
      choice(
        { prompt: "So by its sides, it is…", hint: "Exactly two equal: isosceles. None equal: scalene.", explain: `${SIDE_RULE[t.sideClass]} → ${t.sideClass}.` },
        t.sideClass,
        SIDE_CLASSES.filter((s) => s !== t.sideClass)
      ),
    ],
    wrapUp: "The measurements decide, not how the triangle looks.",
  };
}

function Preview() {
  return <TriangleDrawing t={RIGHT_ISO} cell={20} />;
}

export const classifyingTriangles: Unit = {
  id: "classifyingTriangles",
  title: "Classifying Triangles",
  goal: "I can sort triangles by their sides (equilateral, isosceles, scalene) and by their angles (including recognizing a right triangle).",
  standard: "4.G.2",
  keyIdea: (
    <>
      <p>
        By SIDES: <b>equilateral</b> (all 3 equal), <b>isosceles</b> (exactly 2 equal), <b>scalene</b> (none equal). By ANGLES: <b>right</b> (one square corner), <b>obtuse</b> (one angle
        bigger than square), <b>acute</b> (all angles smaller than square).
      </p>
      <p>Every triangle gets a name from BOTH lists at once — like a right isosceles triangle. Use the measurements, not how it looks.</p>
    </>
  ),
  Explore,
  preview: Preview,
  requiresIntro: true,
  problems: [
    { label: "By sides", make: bySidesProblem, buckets: ["by-sides"] },
    { label: "By angles", make: byAnglesProblem, buckets: ["by-angles"] },
    { label: "Both names", make: bothProblem, buckets: ["both"] },
    { label: "Looks equal?", make: nearMissProblem, buckets: ["near-miss"] },
  ],
  requiredBuckets: ["by-sides", "by-angles", "both", "near-miss"],
  test: classifyingTrianglesTest,
};
