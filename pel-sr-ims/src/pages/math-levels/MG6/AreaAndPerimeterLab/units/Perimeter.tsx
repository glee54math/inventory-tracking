import { useEffect, useState } from "react";
import { PolygonOutline } from "../diagrams/PolygonOutline";
import { TilingGrid } from "../diagrams/TilingGrid";
import { cellsFromRect, countArea, countPerimeter } from "../lib/grid";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { perimeterTest } from "./PerimeterTest";
import { answerBorder } from "../../../shared/lib/answerChecks";

const UNITS = ["cm", "in", "ft", "m"] as const;

/** n side lengths (2-12) that could actually close up into a real shape:
 *  the longest side must be shorter than all the others put together. */
function polygonSides(n: number): number[] {
  for (;;) {
    const s = Array.from({ length: n }, () => randInt(2, 12));
    const total = s.reduce((a, b) => a + b, 0);
    if (Math.max(...s) < total - Math.max(...s)) return s;
  }
}

/** Two different rectangles (l > w, as [l, w]) with the same l + w — so
 *  equal perimeter, but different area. */
function samePerimeterPair(): [[number, number], [number, number]] {
  const half = randInt(8, 14);
  const ws = shuffle(Array.from({ length: Math.floor((half - 1) / 2) }, (_, i) => i + 1).filter((w) => w >= 2 && half - w <= 12));
  const [w1, w2] = ws;
  return [
    [half - w1, w1],
    [half - w2, w2],
  ];
}

/** Two different rectangles with the same area but different perimeter. */
function sameAreaPair(): [[number, number], [number, number]] {
  for (;;) {
    const area = pick([12, 16, 18, 20, 24, 30, 36]);
    const pairs: [number, number][] = [];
    for (let w = 1; w * w <= area; w++) if (area % w === 0 && area / w <= 12) pairs.push([area / w, w]);
    if (pairs.length >= 2) {
      const [a, b] = shuffle(pairs);
      return [a, b];
    }
  }
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "The total distance around the outside of the shape";
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What is the <b>perimeter</b> of a shape?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)}>
          <option value="" disabled>choose</option>
          <option value={CORRECT}>{CORRECT}</option>
          <option value="The number of unit squares that cover the inside">The number of unit squares that cover the inside</option>
          <option value="The length of its longest side">The length of its longest side</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>Check Answer</button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — perimeter is the trip all the way around the outside edge." : "Not quite — covering the inside is AREA. Perimeter is the distance all the way around the outside."}
        </p>
      )}
    </div>
  );
}

/** Q2 — the plan's mandatory same-rectangle, same-numbers pair. */
function SameNumbersQuestion({ onComplete }: { onComplete?: () => void }) {
  const l = 7;
  const w = 3;
  const [areaGuess, setAreaGuess] = useState("");
  const [perimGuess, setPerimGuess] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [areaGuess, perimGuess].every((v) => String(v).trim() !== "");
  const okA = Number(areaGuess) === l * w;
  const okP = Number(perimGuess) === 2 * l + 2 * w;
  const ok = okA && okP;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  let msg = "";
  if (checked && !ok) {
    if (Number(areaGuess) === 2 * l + 2 * w) msg = "Your area is actually the perimeter — area MULTIPLIES length × width.";
    else if (Number(perimGuess) === l * w) msg = "Your perimeter is actually the area — perimeter ADDS all four sides.";
    else if (Number(perimGuess) === l + w) msg = "7 + 3 only goes along two sides. A rectangle has FOUR sides: 7 + 3 + 7 + 3.";
    else msg = "Not yet — area is 7 × 3; perimeter is 7 + 3 + 7 + 3.";
  }
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> A garden is 7 meters long and 3 meters wide. Answer BOTH questions about it.
      </p>
      <PolygonOutline sides={[l, w, l, w]} rectangle hideLabels={[2, 3]} unit="m" size={170} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>How much ground does it cover (area)? <input className="answer" style={{ width: 55, ...answerBorder(okA, checked) }} inputMode="numeric" value={areaGuess} onChange={(e) => setAreaGuess(e.target.value)} /> sq m</label>
      </div>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>How much fence goes around it (perimeter)? <input className="answer" style={{ width: 55, ...answerBorder(okP, checked) }} inputMode="numeric" value={perimGuess} onChange={(e) => setPerimGuess(e.target.value)} /> m</label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>Check Answer</button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — same two numbers, two different questions: area 7 × 3 = 21 square meters, perimeter 7 + 3 + 7 + 3 = 20 meters." : msg}
        </p>
      )}
    </div>
  );
}

/** Q3 — the memorized shortcut (reintroEverySolved), plus WHY two numbers
 *  are enough. */
function ShortcutQuestion({ onComplete }: { onComplete?: () => void }) {
  const [formula, setFormula] = useState("");
  const [why, setWhy] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [formula, why].every((v) => String(v).trim() !== "");
  const ok = formula === "2l+2w" && why === "opposite";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> The perimeter of a rectangle is{" "}
        <select className="answer" style={answerBorder(formula === "2l+2w", checked)} value={formula} onChange={(e) => setFormula(e.target.value)}>
          <option value="" disabled>choose</option>
          <option value="2l+2w">2 × length + 2 × width</option>
          <option value="lw">length × width</option>
          <option value="l+w">length + width</option>
        </select>
        , because{" "}
        <select className="answer" style={answerBorder(why === "opposite", checked)} value={why} onChange={(e) => setWhy(e.target.value)}>
          <option value="" disabled>choose</option>
          <option value="opposite">opposite sides of a rectangle are the same length</option>
          <option value="rows">it has rows of unit squares</option>
          <option value="corners">it has four corners</option>
        </select>
        .
      </p>
      <div className="control-row">
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>Check Answer</button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — two lengths and two widths go around a rectangle, so P = 2 × length + 2 × width." : "Not quite — walk around a rectangle: length, width, length, width. Opposite sides match, so there are two of each."}
        </p>
      )}
    </div>
  );
}

/** Q4 — generalization trap: equal perimeter does NOT force equal area. */
function SamePerimeterTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"" | "true" | "false">("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or False: two rectangles with the same perimeter always have the same area.
      </p>
      <div className="control-row">
        <button className={`btn ghost ${picked === "true" ? "pressed" : ""}`} type="button" onClick={() => setPicked("true")}>True</button>
        <button className={`btn ghost ${picked === "false" ? "pressed" : ""}`} type="button" onClick={() => setPicked("false")}>False</button>
        <button className="btn primary" type="button" disabled={!picked} onClick={() => setChecked(true)}>Check Answer</button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "False — a 6 × 2 rectangle and a 4 × 4 square both have perimeter 16, but their areas are 12 and 16." : "Not quite — try 6 × 2 and 4 × 4: both have perimeter 16, but the areas are 12 and 16."}
        </p>
      )}
    </div>
  );
}

function CheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, same: false, shortcut: false, trap: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill" style={{ display: "grid", gap: 18 }}>
      <p className="intro-gate-title">Check for understanding: perimeter goes AROUND, area covers INSIDE — even with the same two numbers.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <SameNumbersQuestion onComplete={mark("same")} />
      <ShortcutQuestion onComplete={mark("shortcut")} />
      <SamePerimeterTrapQuestion onComplete={mark("trap")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"compare" | "fixed">("compare");
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(6);
  const [fixedLen, setFixedLen] = useState(5);
  const half = 10; // every rectangle in "same perimeter" mode has length + width = 10
  const cells = cellsFromRect(rows, cols);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="What to explore"
          value={mode}
          onChange={(v) => setMode(v as "compare" | "fixed")}
          options={[
            { id: "compare", label: "Area vs. perimeter" },
            { id: "fixed", label: "Same perimeter, different area" },
          ]}
        />
        {!introActive && (
          <button type="button" className={`btn ghost ${showCheck ? "pressed" : ""}`} onClick={() => setShowCheck((v) => !v)}>
            Check for Understanding
          </button>
        )}
      </div>
      {mode === "compare" ? (
        <>
          <div className="control-row">
            <Stepper label="width" value={cols} min={2} max={9} onChange={setCols} tone="a" />
            <Stepper label="height" value={rows} min={2} max={8} onChange={setRows} tone="b" />
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <TilingGrid rows={rows} cols={cols} mode="full" dimLabels caption={`Area: ${countArea(cells)} squares inside`} />
            <TilingGrid rows={rows} cols={cols} mode="full" hideFill showBorderTrace dimLabels caption={`Perimeter: ${countPerimeter(cells)} units around`} />
          </div>
          <p className="says">
            Same rectangle, same two numbers. Area: {cols} × {rows} = {countArea(cells)}. Perimeter: {cols} + {rows} + {cols} + {rows} = 2 × {cols} + 2 × {rows} = {countPerimeter(cells)}.
          </p>
        </>
      ) : (
        <>
          <div className="control-row">
            <Stepper label="length" value={fixedLen} min={1} max={9} onChange={setFixedLen} tone="a" />
          </div>
          <TilingGrid rows={half - fixedLen} cols={fixedLen} mode="full" showBorderTrace dimLabels cellPx={24} />
          <p className="says">
            {fixedLen} × {half - fixedLen}: perimeter is always 2 × {fixedLen} + 2 × {half - fixedLen} = 20, but the area is {fixedLen * (half - fixedLen)}. Same fence, different amount of space inside!
          </p>
        </>
      )}
      {(introActive || showCheck) && <CheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — perimeter
// ============================================================================

type Bucket = "polygonSum" | "rectangleShortcut" | "missingSide" | "samePerimeter" | "sameArea" | "discriminate";
const BUCKETS: Bucket[] = ["polygonSum", "rectangleShortcut", "missingSide", "samePerimeter", "sameArea", "discriminate"];

function perimeterProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);
  const unit = pick(UNITS);

  if (bucket === "polygonSum") {
    const n = randInt(3, 6);
    const sides = polygonSides(n);
    const p = sides.reduce((a, b) => a + b, 0);
    return {
      title: "Perimeter of a polygon",
      bucket,
      story: `This ${n}-sided shape has every side labeled.`,
      visual: () => <PolygonOutline sides={sides} unit={unit} />,
      steps: [
        {
          kind: "number",
          suffix: unit,
          prompt: "What is its perimeter?",
          hint: `Add all ${n} sides: ${sides.join(" + ")}.`,
          explain: `${sides.join(" + ")} = ${p} ${unit}.`,
          answer: p,
        },
      ],
      wrapUp: `The perimeter is ${p} ${unit}.`,
    };
  }

  if (bucket === "rectangleShortcut") {
    const l = randInt(4, 12);
    let w = randInt(2, 9);
    while (w === l) w = randInt(2, 9);
    const p = 2 * l + 2 * w;
    return {
      title: "Rectangle perimeter shortcut",
      bucket,
      story: `A rectangle is ${l} ${unit} long and ${w} ${unit} wide. Only two sides are labeled.`,
      visual: () => <PolygonOutline sides={[l, w, l, w]} rectangle hideLabels={[2, 3]} unit={unit} />,
      steps: [
        choice(
          {
            prompt: "How long are the two unlabeled sides?",
            hint: "Opposite sides of a rectangle are the same length.",
            explain: `The bottom matches the top (${l}) and the left matches the right (${w}).`,
          },
          `${l} and ${w} — they match the sides across from them`,
          [`They can't be known without more labels`, `${l * w} and ${l * w}`]
        ),
        {
          kind: "number",
          suffix: unit,
          prompt: "What is the rectangle's perimeter?",
          hint: `2 × ${l} + 2 × ${w}`,
          explain: `2 × ${l} + 2 × ${w} = ${2 * l} + ${2 * w} = ${p} ${unit}.`,
          answer: p,
        },
      ],
      wrapUp: `2 × ${l} + 2 × ${w} = ${p} ${unit}.`,
    };
  }

  if (bucket === "missingSide") {
    const n = randInt(4, 6);
    const sides = polygonSides(n);
    const p = sides.reduce((a, b) => a + b, 0);
    const missingIdx = randInt(0, n - 1);
    const known = sides.filter((_, i) => i !== missingIdx);
    const knownSum = known.reduce((a, b) => a + b, 0);
    return {
      title: "Find a missing side",
      bucket,
      story: `The perimeter of this shape is ${p} ${unit}. One side is missing.`,
      visual: (done: number) => <PolygonOutline sides={sides.map((s, i) => (i === missingIdx && done < 2 ? null : s))} unit={unit} />,
      steps: [
        {
          kind: "number",
          suffix: unit,
          prompt: "What do the sides you CAN see add up to?",
          hint: known.join(" + "),
          explain: `${known.join(" + ")} = ${knownSum}.`,
          answer: knownSum,
        },
        {
          kind: "number",
          suffix: unit,
          prompt: "How long is the missing side?",
          hint: `The whole trip around is ${p}. ${p} − ${knownSum} = ?`,
          explain: `${p} − ${knownSum} = ${sides[missingIdx]} ${unit}.`,
          answer: sides[missingIdx],
        },
      ],
      wrapUp: `The missing side is ${sides[missingIdx]} ${unit}.`,
    };
  }

  if (bucket === "samePerimeter") {
    const [[l1, w1], [l2, w2]] = samePerimeterPair();
    return {
      title: "Same perimeter, different area?",
      bucket,
      story: `Rectangle A is ${l1} by ${w1}. Rectangle B is ${l2} by ${w2}.`,
      visual: () => (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <PolygonOutline sides={[l1, w1, l1, w1]} rectangle hideLabels={[2, 3]} size={170} caption="A" />
          <PolygonOutline sides={[l2, w2, l2, w2]} rectangle hideLabels={[2, 3]} size={170} caption="B" />
        </div>
      ),
      steps: [
        {
          kind: "ratio",
          tones: "none",
          labels: ["A's perimeter", "B's perimeter"],
          prompt: "Find each rectangle's perimeter.",
          hint: `2 × ${l1} + 2 × ${w1}, and 2 × ${l2} + 2 × ${w2}.`,
          explain: `Both are ${2 * (l1 + w1)}.`,
          answer: [2 * (l1 + w1), 2 * (l2 + w2)],
        },
        {
          kind: "ratio",
          tones: "none",
          labels: ["A's area", "B's area"],
          prompt: "Now find each rectangle's area.",
          hint: `${l1} × ${w1}, and ${l2} × ${w2}.`,
          explain: `A: ${l1 * w1}. B: ${l2 * w2}.`,
          answer: [l1 * w1, l2 * w2],
        },
        choice(
          {
            prompt: "What do you notice?",
            hint: "Compare both pairs of answers.",
            explain: `Same perimeter (${2 * (l1 + w1)}), different areas (${l1 * w1} and ${l2 * w2}).`,
          },
          "Same perimeter, but different areas",
          ["Same perimeter, so the same area too", "Different perimeters and different areas"]
        ),
      ],
      wrapUp: `Equal perimeters don't mean equal areas: ${l1 * w1} ≠ ${l2 * w2}.`,
    };
  }

  if (bucket === "sameArea") {
    const [[l1, w1], [l2, w2]] = sameAreaPair();
    const p1 = 2 * (l1 + w1);
    const p2 = 2 * (l2 + w2);
    return {
      title: "Same area, different perimeter?",
      bucket,
      story: `Rectangle A is ${l1} by ${w1}. Rectangle B is ${l2} by ${w2}. Both cover ${l1 * w1} square units.`,
      visual: () => (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <PolygonOutline sides={[l1, w1, l1, w1]} rectangle hideLabels={[2, 3]} size={170} caption="A" />
          <PolygonOutline sides={[l2, w2, l2, w2]} rectangle hideLabels={[2, 3]} size={170} caption="B" />
        </div>
      ),
      steps: [
        {
          kind: "ratio",
          tones: "none",
          labels: ["A's perimeter", "B's perimeter"],
          prompt: "Find each rectangle's perimeter.",
          hint: `2 × ${l1} + 2 × ${w1}, and 2 × ${l2} + 2 × ${w2}. (Don't multiply — that's area.)`,
          explain: `A: ${p1}. B: ${p2}.`,
          answer: [p1, p2],
        },
        choice(
          {
            prompt: "Which rectangle needs MORE fence to go around it?",
            hint: "Compare the two perimeters.",
            explain: `${p1 > p2 ? "A" : "B"} has the longer perimeter (${Math.max(p1, p2)} vs. ${Math.min(p1, p2)}), even though both have area ${l1 * w1}.`,
          },
          p1 > p2 ? "Rectangle A" : "Rectangle B",
          [p1 > p2 ? "Rectangle B" : "Rectangle A", "Neither — same area means same fence"]
        ),
      ],
      wrapUp: `Same area (${l1 * w1}), different perimeters (${p1} and ${p2}).`,
    };
  }

  // discriminate — the same two numbers, area OR perimeter asked
  let l = randInt(3, 10);
  let w = randInt(2, 9);
  while (w === l || l * w === 2 * (l + w)) {
    l = randInt(3, 10);
    w = randInt(2, 9);
  }
  const askArea = Math.random() < 0.5;
  const context = askArea
    ? { q: `How much carpet is needed to cover the whole floor of a room ${l} ft by ${w} ft?`, kind: "Area — carpet covers the inside" }
    : { q: `How much border trim is needed to go all the way around a bulletin board ${l} ft by ${w} ft?`, kind: "Perimeter — trim goes around the outside" };
  const answer = askArea ? l * w : 2 * (l + w);
  return {
    title: "Area or perimeter?",
    bucket,
    story: context.q,
    visual: () => <PolygonOutline sides={[l, w, l, w]} rectangle hideLabels={[2, 3]} unit="ft" />,
    steps: [
      choice(
        {
          prompt: "Which is this question really asking for?",
          hint: "Covering = inside = area. Going around = outside = perimeter.",
          explain: askArea ? "Carpet covers the inside, so it's area." : "Trim goes around the edge, so it's perimeter.",
        },
        context.kind,
        [askArea ? "Perimeter — trim goes around the outside" : "Area — carpet covers the inside"]
      ),
      {
        kind: "number",
        suffix: askArea ? "sq ft" : "ft",
        prompt: askArea ? "How many square feet of carpet?" : "How many feet of trim?",
        hint: askArea ? `${l} × ${w}` : `2 × ${l} + 2 × ${w}`,
        explain: askArea ? `${l} × ${w} = ${l * w} square feet.` : `2 × ${l} + 2 × ${w} = ${2 * (l + w)} feet.`,
        answer,
      },
    ],
    wrapUp: askArea ? `${l * w} square feet of carpet (the perimeter, ${2 * (l + w)}, wasn't asked).` : `${2 * (l + w)} feet of trim (the area, ${l * w}, wasn't asked).`,
  };
}

function Preview() {
  return <PolygonOutline sides={[7, 3, 7, 3]} rectangle hideLabels={[2, 3]} size={150} />;
}

export const perimeter: Unit = {
  id: "perimeter",
  title: "Perimeter",
  goal: "Find the distance around a shape, find a missing side when the perimeter is known, and compare shapes that share a perimeter but not an area (or the other way around).",
  standard: "3.MD.8",
  keyIdea: (
    <>
      <p>Perimeter is the distance all the way AROUND a shape: add every side. For a rectangle, that's 2 × length + 2 × width.</p>
      <p>Same two numbers, different question: a 7 × 3 rectangle has area 21 (covers the inside) but perimeter 20 (goes around).</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  reintroEverySolved: 20,
  preview: Preview,
  problems: [{ label: "Perimeter", make: perimeterProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: perimeterTest,
};
