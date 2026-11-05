import { useState } from "react";
import { RectPlot } from "../diagrams";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Says, Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { rectOk, sameAreaPair, samePerimeterPair } from "../lib/measures";
import { CfuToggle, CheckForUnderstanding, type CfuQuestion } from "./cfu";
import { areaPerimeterFormulasTest } from "./AreaPerimeterFormulasTest";

const LEN_UNITS = ["ft", "m", "yd"] as const;
const AREA_THINGS = ["rug", "garden", "classroom floor", "patio", "poster"];
const PER_THINGS: [string, string][] = [
  ["garden", "fence"],
  ["bulletin board", "border trim"],
  ["yard", "fence"],
  ["picture", "frame"],
  ["pool", "safety rope"],
];

// ============================================================================
// CHECK FOR UNDERSTANDING — required gate. Grade 3's Area & Perimeter lab
// teaches the WHY; this checks the formulas and, above all, the plan's named
// trap: "area 24, side 4" and "perimeter 24, side 4" need opposite undos.
// ============================================================================

const CFU: CfuQuestion[] = [
  // Vocabulary: the UNITS each measure is counted in.
  {
    rows: [["Area is measured in", { kind: "select", label: "area units", options: ["feet", "square feet"], correct: 1 }, ", and perimeter is measured in", { kind: "select", label: "perimeter units", options: ["square feet", "feet"], correct: 1 }, "."]],
    good: "Right — area counts unit SQUARES that cover the inside (square feet); perimeter is a LENGTH around the outside (feet).",
    bad: "Not quite. Area counts squares that cover the inside, so it's in square units. Perimeter is a distance around, so it's in plain length units.",
  },
  // Quick refresher of grade 3's formulas.
  {
    rows: [
      ["Area of a rectangle =", { kind: "select", label: "area formula", options: ["2 × length + 2 × width", "length × width", "length + width"], correct: 1 }],
      ["Perimeter of a rectangle =", { kind: "select", label: "perimeter formula", options: ["length × width", "length + width", "2 × length + 2 × width"], correct: 2 }],
    ],
    good: "Right — area multiplies (rows × columns of squares); perimeter adds all four sides, two lengths and two widths.",
    bad: "Not quite. Area = length × width (rows of squares). Perimeter = 2 × length + 2 × width (walk all four sides).",
  },
  // The plan's core conflation: same numbers, opposite undo.
  {
    rows: [
      ["Rectangle A has an AREA of 24 sq cm and one side of 4 cm. Its other side is", { kind: "number", label: "rectangle A missing side", answer: 6, width: 60 }, "cm."],
      ["Rectangle B has a PERIMETER of 24 cm and one side of 4 cm. Its other side is", { kind: "number", label: "rectangle B missing side", answer: 8, width: 60 }, "cm."],
    ],
    good: "Right — same numbers, opposite undo. A: 4 × ? = 24, so 24 ÷ 4 = 6. B: the two 4-cm sides use 8, leaving 16 for two sides, so 16 ÷ 2 = 8.",
    bad: (v) =>
      v[0].trim() === "8" && v[1].trim() === "6"
        ? "You swapped them! AREA undoes by dividing (24 ÷ 4 = 6). PERIMETER undoes by subtracting both 4s then halving ((24 − 8) ÷ 2 = 8)."
        : v[1].trim() === "16" || v[1].trim() === "20"
          ? "For B, two sides are 4 cm (that's 8), and the 16 left is shared by TWO sides: 16 ÷ 2 = 8."
          : "Not quite. A: 4 × ? = 24 → 6. B: 24 − 4 − 4 = 16 for the other two sides → 16 ÷ 2 = 8.",
  },
  // Generalization trap.
  {
    rows: [
      ["True or false: if you know a rectangle's perimeter, you know its area.", { kind: "select", label: "true or false", options: ["True", "False"], correct: 1 }],
      ["A 5 × 1 rectangle and a 3 × 3 square both have perimeter 12. Their areas are", { kind: "number", label: "area of 5 by 1", answer: 5, width: 55 }, "and", { kind: "number", label: "area of 3 by 3", answer: 9, width: 55 }, "."],
    ],
    good: "False — same perimeter (12), different areas (5 and 9). The perimeter alone doesn't tell you the area.",
    bad: "Not quite. 5 × 1 = 5 and 3 × 3 = 9: same perimeter, different areas — so the statement is false.",
  },
];

// ============================================================================
// EXPLORE
// ============================================================================

type Mode = "both" | "missArea" | "missPer";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<Mode>("both");
  const [l, setL] = useState(8);
  const [w, setW] = useState(3);
  const A = l * w;
  const P = 2 * (l + w);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
      <p className="muted small" style={{ margin: 0 }}>
        Remember from grade 3: area counts the unit squares that cover the inside; perimeter is the distance around the outside.
      </p>
      <div className="control-row">
        <Segmented
          label="What to explore"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { id: "both", label: "Area & perimeter" },
            { id: "missArea", label: "Missing side (area)" },
            { id: "missPer", label: "Missing side (perimeter)" },
          ]}
        />
      </div>
      <div className="control-row">
        <Stepper label="length (ft)" value={l} min={1} max={20} onChange={setL} tone="a" />
        <Stepper label="width (ft)" value={w} min={1} max={12} onChange={setW} tone="b" />
      </div>
      {mode === "both" && (
        <>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <RectPlot l={l} w={w} unit="ft" inside={`${A} sq ft`} caption="Area: covers the inside" />
            <RectPlot l={l} w={w} unit="ft" fill={false} trace caption="Perimeter: goes around" />
          </div>
          <Says>
            Area = {l} × {w} = <b>{A}</b> square feet. Perimeter = 2 × {l} + 2 × {w} = {2 * l} + {2 * w} = <b>{P}</b> feet.
          </Says>
        </>
      )}
      {mode === "missArea" && (
        <>
          <RectPlot l={l} w={null} drawW={w} unit="ft" inside={`Area = ${A} sq ft`} />
          <Says>
            The AREA is {A} and the length is {l}: {l} × ? = {A}. Undo multiplying by <b>dividing</b>: {A} ÷ {l} = <b>{w}</b> ft.
          </Says>
        </>
      )}
      {mode === "missPer" && (
        <>
          <RectPlot l={l} w={null} drawW={w} unit="ft" fill={false} trace inside={`Perimeter = ${P} ft`} />
          <Says>
            The PERIMETER is {P} and the length is {l}. The two lengths use 2 × {l} = {2 * l}. That leaves {P} − {2 * l} = {P - 2 * l} for the two widths, so each width is {P - 2 * l} ÷ 2 = <b>{w}</b> ft.
          </Says>
          <Says>
            Same idea, other order: half the perimeter is one length + one width ({P} ÷ 2 = {P / 2}), so the width is {P / 2} − {l} = {w}.
          </Says>
        </>
      )}
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <CheckForUnderstanding title="Check for understanding: which formula, and how do you undo it?" questions={CFU} onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES — one per bucket
// ============================================================================

const BUCKETS = ["area", "perimeter", "missingFromArea", "missingFromPerimeter", "compare"];

function sides(): [number, number] {
  for (;;) {
    const big = Math.random() < 0.4;
    const l = big ? randInt(11, 25) : randInt(3, 12);
    const w = big ? randInt(10, 15) : randInt(2, 9);
    if (rectOk(l, w) && l > w) return [l, w];
  }
}

function areaOrPerimeterProblem(askArea: boolean): Problem {
  const [l, w] = sides();
  const u = pick(LEN_UNITS);
  const [thing, edge] = askArea ? [pick(AREA_THINGS), ""] : pick(PER_THINGS);
  const area = l * w;
  const per = 2 * (l + w);
  const ans = askArea ? area : per;
  return {
    title: askArea ? "Find the area" : "Find the perimeter",
    bucket: askArea ? "area" : "perimeter",
    story: askArea ? `A rectangular ${thing} is ${l} ${u} long and ${w} ${u} wide. How much space does it cover?` : `A rectangular ${thing} is ${l} ${u} long and ${w} ${u} wide. How much ${edge} goes all the way around it?`,
    visual: (done) => <RectPlot l={l} w={w} unit={u} fill={askArea ? done >= 1 : false} trace={!askArea && done >= 1} inside={done >= 2 ? (askArea ? `${area} sq ${u}` : undefined) : undefined} caption={!askArea && done >= 2 ? `Perimeter ${per} ${u}` : undefined} />,
    steps: [
      choice(
        {
          prompt: "Is this asking for area or perimeter?",
          hint: "Covering the inside → area. Going around the outside → perimeter.",
          explain: askArea ? `Covering the ${thing} is about the inside: area.` : `${edge[0].toUpperCase() + edge.slice(1)} goes around the outside: perimeter.`,
        },
        askArea ? "Area — it covers the inside" : "Perimeter — it goes around the outside",
        [askArea ? "Perimeter — it goes around the outside" : "Area — it covers the inside"]
      ),
      {
        kind: "number",
        prompt: askArea ? "What is the area?" : "What is the perimeter?",
        suffix: askArea ? `sq ${u}` : u,
        hint: askArea ? `length × width = ${l} × ${w}` : `2 × ${l} + 2 × ${w}`,
        explain: askArea ? `${l} × ${w} = ${area} square ${u}.` : `2 × ${l} + 2 × ${w} = ${2 * l} + ${2 * w} = ${per} ${u}.`,
        answer: ans,
      },
      choice(
        {
          prompt: `What does your answer, ${ans}, mean here?`,
          hint: askArea ? "Area counts squares." : "Perimeter is a length.",
          explain: askArea ? `${area} squares, each 1 ${u} by 1 ${u}, cover the ${thing}.` : `Going once around the ${thing} is ${per} ${u}.`,
        },
        askArea ? `${ans} squares, each 1 ${u} on a side, cover the ${thing}` : `Walking once around the ${thing} is ${ans} ${u}`,
        [askArea ? `Walking once around the ${thing} is ${ans} ${u}` : `${ans} squares, each 1 ${u} on a side, cover the ${thing}`]
      ),
    ],
    wrapUp: askArea ? `Area: ${l} × ${w} = ${area} sq ${u} (the perimeter, ${per} ${u}, wasn't asked).` : `Perimeter: ${per} ${u} (the area, ${area} sq ${u}, wasn't asked).`,
  };
}

function missingFromAreaProblem(): Problem {
  const known = randInt(3, 9);
  let missing = randInt(4, 25);
  while (missing === known) missing = randInt(4, 25);
  const A = known * missing;
  const u = pick(LEN_UNITS);
  const thing = pick(AREA_THINGS);
  return {
    title: "Missing side — from the area",
    bucket: "missingFromArea",
    story: `A rectangular ${thing} covers ${A} square ${u}. One side is ${known} ${u} long. How long is the other side?`,
    visual: (done) => <RectPlot l={done >= 2 ? missing : null} w={known} drawL={missing} unit={u} inside={`Area = ${A} sq ${u}`} caption={done >= 3 ? `Perimeter ${2 * (known + missing)} ${u}` : undefined} />,
    steps: [
      choice(
        { prompt: "Which equation fits?", hint: "The AREA is given, and area = length × width.", explain: `Area = side × side, so ${known} × ? = ${A}.` },
        `${known} × ? = ${A}`,
        [`2 × ${known} + 2 × ? = ${A}`, `${known} + ? = ${A}`]
      ),
      { kind: "number", prompt: "How long is the other side?", suffix: u, hint: `Undo multiplying: ${A} ÷ ${known}.`, explain: `${A} ÷ ${known} = ${missing} ${u}. Check: ${known} × ${missing} = ${A}. ✓`, answer: missing },
      {
        kind: "number",
        prompt: `Now that you know both sides, what is the ${thing}'s perimeter?`,
        suffix: u,
        hint: `2 × ${missing} + 2 × ${known}`,
        explain: `2 × ${missing} + 2 × ${known} = ${2 * (known + missing)} ${u}.`,
        answer: 2 * (known + missing),
      },
    ],
    wrapUp: `${A} ÷ ${known} = ${missing} ${u}. Area undoes with DIVISION.`,
  };
}

/** Two valid paths, randomized: subtract both lengths then halve, OR halve
 *  the perimeter (one length + one width) then subtract the length. */
function missingFromPerimeterProblem(): Problem {
  const l = randInt(6, 30);
  const w = randInt(2, l - 1);
  const P = 2 * (l + w);
  const u = pick(LEN_UNITS);
  const [thing, edge] = pick(PER_THINGS);
  const halveFirst = Math.random() < 0.5;
  return {
    title: "Missing side — from the perimeter",
    bucket: "missingFromPerimeter",
    story: `It takes ${P} ${u} of ${edge} to go around a rectangular ${thing}. The ${thing} is ${l} ${u} long. How wide is it?`,
    visual: (done) => <RectPlot l={l} w={done >= (halveFirst ? 2 : 3) ? w : null} drawW={w} unit={u} fill={false} trace inside={`Perimeter = ${P} ${u}`} />,
    steps: halveFirst
      ? [
          {
            kind: "number",
            prompt: `Half of the way around is one length + one width. What is ${P} ÷ 2?`,
            suffix: u,
            hint: `${P} ÷ 2`,
            explain: `${P} ÷ 2 = ${P / 2}: one length plus one width.`,
            answer: P / 2,
          },
          { kind: "number", prompt: "How wide is it?", suffix: u, hint: `${P / 2} − ${l}`, explain: `${P / 2} − ${l} = ${w} ${u}.`, answer: w },
          { kind: "number", prompt: `What is the ${thing}'s area?`, suffix: `sq ${u}`, hint: `${l} × ${w}`, explain: `${l} × ${w} = ${l * w} square ${u}.`, answer: l * w },
        ]
      : [
          { kind: "number", prompt: "How much do the TWO lengths use up?", suffix: u, hint: `2 × ${l}`, explain: `2 × ${l} = ${2 * l} ${u}.`, answer: 2 * l },
          { kind: "number", prompt: "How much is left for the two widths?", suffix: u, hint: `${P} − ${2 * l}`, explain: `${P} − ${2 * l} = ${P - 2 * l} ${u}.`, answer: P - 2 * l },
          { kind: "number", prompt: "How wide is it?", suffix: u, hint: `Two widths share ${P - 2 * l}: ${P - 2 * l} ÷ 2.`, explain: `${P - 2 * l} ÷ 2 = ${w} ${u}.`, answer: w },
        ],
    wrapUp: `Width = ${w} ${u}. Perimeter undoes with subtracting and halving — not dividing by the length.`,
  };
}

function compareProblem(): Problem {
  const samePer = Math.random() < 0.5;
  const [[l1, w1], [l2, w2]] = samePer ? samePerimeterPair() : sameAreaPair();
  const a1 = l1 * w1;
  const a2 = l2 * w2;
  const p1 = 2 * (l1 + w1);
  const p2 = 2 * (l2 + w2);
  const pens = (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <RectPlot l={l1} w={w1} unit="m" caption="Pen A" maxW={260} />
      <RectPlot l={l2} w={w2} unit="m" caption="Pen B" maxW={260} />
    </div>
  );
  return {
    title: samePer ? "Same fence, different room?" : "Same room, different fence?",
    bucket: "compare",
    story: `Two rectangular dog pens: A is ${l1} m by ${w1} m, and B is ${l2} m by ${w2} m.`,
    visual: () => pens,
    steps: [
      { kind: "ratio", tones: "none", frame: ["A:", "B:", "m"], labels: ["A's perimeter", "B's perimeter"], prompt: "How much fence does each pen need (perimeter)?", hint: `2 × ${l1} + 2 × ${w1}, and 2 × ${l2} + 2 × ${w2}.`, explain: `A: ${p1} m. B: ${p2} m.`, answer: [p1, p2] },
      { kind: "ratio", tones: "none", frame: ["A:", "B:", "sq m"], labels: ["A's area", "B's area"], prompt: "How much room does each pen have (area)?", hint: `${l1} × ${w1}, and ${l2} × ${w2}.`, explain: `A: ${a1} sq m. B: ${a2} sq m.`, answer: [a1, a2] },
      samePer
        ? choice(
            { prompt: "Which pen gives the dog MORE room?", hint: "Compare the areas.", explain: `${a1 > a2 ? "A" : "B"} — same fence (${p1} m), but ${Math.max(a1, a2)} sq m beats ${Math.min(a1, a2)} sq m.` },
            a1 > a2 ? "Pen A" : "Pen B",
            [a1 > a2 ? "Pen B" : "Pen A", "Neither — same fence means same room"]
          )
        : choice(
            { prompt: "Which pen needs MORE fence?", hint: "Compare the perimeters.", explain: `${p1 > p2 ? "A" : "B"} — same room (${a1} sq m), but ${Math.max(p1, p2)} m of fence vs ${Math.min(p1, p2)} m.` },
            p1 > p2 ? "Pen A" : "Pen B",
            [p1 > p2 ? "Pen B" : "Pen A", "Neither — same room means same fence"]
          ),
    ],
    wrapUp: samePer ? `Same perimeter (${p1} m), different areas (${a1} and ${a2} sq m).` : `Same area (${a1} sq m), different perimeters (${p1} and ${p2} m).`,
  };
}

function Preview() {
  return <RectPlot l={8} w={3} unit="ft" inside="24 sq ft" trace maxW={260} />;
}

export const areaPerimeterFormulas: Unit = {
  id: "areaPerimeterFormulas",
  title: "Area & Perimeter Formulas in Context",
  goal: "I can use area = length × width and perimeter = 2 × length + 2 × width to solve real problems about rectangles, including finding a missing side.",
  standard: "4.MD.3",
  keyIdea: (
    <>
      <p>Area = length × width (square units). Perimeter = 2 × length + 2 × width (length units).</p>
      <p>Missing side? From the AREA, divide: 24 ÷ 4 = 6. From the PERIMETER, take away both known sides and halve: (24 − 4 − 4) ÷ 2 = 8. Same numbers, different undo!</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [
    { label: "Area", make: () => areaOrPerimeterProblem(true), buckets: ["area"] },
    { label: "Perimeter", make: () => areaOrPerimeterProblem(false), buckets: ["perimeter"] },
    { label: "Missing side (area)", make: missingFromAreaProblem, buckets: ["missingFromArea"] },
    { label: "Missing side (perimeter)", make: missingFromPerimeterProblem, buckets: ["missingFromPerimeter"] },
    { label: "Compare", make: compareProblem, buckets: ["compare"] },
  ],
  requiredBuckets: BUCKETS,
  test: areaPerimeterFormulasTest,
};
