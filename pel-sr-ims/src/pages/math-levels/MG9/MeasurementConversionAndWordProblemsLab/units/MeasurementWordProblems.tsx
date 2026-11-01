import { useState } from "react";
import { ScaleLine, TapeBar, type TapePart } from "../diagrams";
import { fmt, pick } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { QA, QB, Says, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { barPieces, convById } from "../lib/measures";
import { MIXED_IDS, OPS, OP_SIGN, OP_WORD, fracScenario, mixedScenario, sameUnitScenario, scaleScenario } from "../lib/wordProblems";
import { CfuToggle, CheckForUnderstanding, type CfuQuestion } from "./cfu";
import { measurementWordProblemsTest } from "./MeasurementWordProblemsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — required gate (one time; this unit applies Unit
// 1's memorized facts, it doesn't add new ones to memorize)
// ============================================================================

const CFU: CfuQuestion[] = [
  // Vocabulary: what "convert" and "same unit" actually mean.
  {
    rows: [
      ["Converting 2 kg into grams means", { kind: "select", label: "meaning of convert", options: ["making the flour heavier", "writing the same amount with a different unit", "adding 2 and 1,000"], correct: 1 }, "."],
      ["Before you add two measurements, they must be in the same", { kind: "select", label: "must match", options: ["number", "color", "unit"], correct: 2 }, "."],
    ],
    good: "Right — converting changes the number and the unit, but NOT the amount: 2 kg and 2,000 g are the same flour. And you can only add amounts in the same unit.",
    bad: "Not quite. Converting never changes how much there is — 2 kg of flour is still the same flour when you call it 2,000 g. To add, both amounts need the same unit.",
  },
  // The classic, commonly conflated trap: adding across units without converting.
  {
    rows: [
      ["Jada has 2 kg of flour and 500 g of sugar. She says together that's 502 g."],
      ["2 kg =", { kind: "number", label: "2 kg in grams", answer: 2000 }, "g, so together they are really", { kind: "number", label: "total grams", answer: 2500 }, "g."],
    ],
    good: "Right — 2 kg = 2,000 g, and 2,000 + 500 = 2,500 g. Jada added 2 + 500 without converting first.",
    bad: (v) =>
      v[1].replace(/,/g, "").trim() === "502"
        ? "502 is Jada's mistake — it adds 2 + 500 without converting. Change 2 kg into 2,000 g first."
        : v[0].replace(/,/g, "").trim() === "200"
          ? "1 kg is 1,000 g (not 100), so 2 kg = 2,000 g."
          : "Not quite. 1 kg = 1,000 g, so 2 kg = 2,000 g. Then 2,000 + 500 = 2,500 g.",
  },
  // Reading a measurement scale (number-line diagram).
  {
    visual: <ScaleLine min={0} max={1000} major={200} minor={50} unit="m" points={[{ value: 650, label: "A", tone: "a" }]} />,
    rows: [["The labels go up by 200. Each small space is worth", { kind: "number", label: "value of one small space", answer: 50, width: 70 }, "m, so point A is at", { kind: "number", label: "value at A", answer: 650, width: 70 }, "m."]],
    good: "Right — 200 is split into 4 equal spaces, so each is 50 m. A is 1 space past 600: 650 m.",
    bad: (v) =>
      v[0].trim() === "1" || v[0].trim() === "10"
        ? "Count the small spaces between 0 and 200 — there are 4 of them, sharing 200 equally. 200 ÷ 4 = 50."
        : "Not quite. Between two labels (200 apart) there are 4 small spaces, so each is 50 m. A is one space past 600.",
  },
  // Generalization / true-false trap.
  {
    rows: [
      ["True or false: two measurements with different units can never be added.", { kind: "select", label: "true or false", options: ["True", "False"], correct: 1 }],
      ["To add 1 hr and 20 min, first change 1 hr into", { kind: "select", label: "1 hour in minutes", options: ["100 min", "60 min", "10 min"], correct: 1 }, ", so the total is", { kind: "number", label: "total minutes", answer: 80, width: 70 }, "minutes."],
    ],
    good: "False — you CAN add them, once they're in the same unit: 1 hr = 60 min, and 60 + 20 = 80 minutes.",
    bad: (v) =>
      v[2].trim() === "120"
        ? "An hour is 60 minutes, not 100 — time doesn't work in tens. 60 + 20 = 80."
        : v[2].trim() === "21"
          ? "1 + 20 adds across units without converting. 1 hr = 60 min first."
          : "Not quite. Different units CAN be added after converting: 1 hr = 60 min, then 60 + 20 = 80 minutes.",
  },
];

// ============================================================================
// EXPLORE — "same unit first": see why 2 kg + 500 g isn't 502
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [id, setId] = useState("kg-g");
  const [A, setA] = useState(2);
  const [b, setB] = useState(500);
  const c = convById(id);
  const [, each] = barPieces(c.f);
  const safeB = Math.min(Math.max(b, each), c.f - each);
  const total = A * c.f + safeB;
  const major = c.f;
  const minor = each;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
      {(introActive || showCheck) && <CheckForUnderstanding title="Check for understanding: same unit first, then add." questions={CFU} onComplete={onIntroDone} />}

      <div className="control-row">
        <label className="select">
          <span className="stepper-label">Units</span>
          <select
            value={id}
            onChange={(e) => {
              const next = convById(e.target.value);
              setId(next.id);
              setB(barPieces(next.f)[1] * Math.floor(barPieces(next.f)[0] / 2));
            }}
          >
            {MIXED_IDS.map((x) => {
              const cc = convById(x);
              return (
                <option key={x} value={x}>
                  {cc.bigs} and {cc.smalls}
                </option>
              );
            })}
          </select>
        </label>
        <Stepper label={c.bigs} value={A} min={1} max={4} onChange={setA} tone="a" />
        <Stepper label={c.smalls} value={safeB} min={each} max={c.f - each} step={each} onChange={setB} tone="b" />
      </div>

      <p className="muted small" style={{ margin: 0 }}>
        Before converting — the numbers {A} and {safeB} can't be added, they count different-sized units:
      </p>
      <TapeBar
        parts={[
          { weight: A * c.f, label: `${A} ${c.bigAb}`, tone: "a" },
          { weight: safeB, label: `${safeB} ${c.smallAb}`, tone: "b" },
        ]}
        total={`NOT ${A + safeB}!`}
      />
      <p className="muted small" style={{ margin: 0 }}>
        After converting {A} {c.bigAb} into {fmt(A * c.f)} {c.smallAb} — now both parts use the same unit:
      </p>
      <TapeBar
        parts={[
          { weight: A * c.f, label: `${fmt(A * c.f)} ${c.smallAb}`, tone: "a" },
          { weight: safeB, label: `${safeB} ${c.smallAb}`, tone: "b" },
        ]}
        total={`${fmt(total)} ${c.smallAb}`}
      />
      <p className="muted small" style={{ margin: 0 }}>
        On a scale: drag the orange dot to change the {c.smalls}.
      </p>
      <ScaleLine
        min={0}
        max={(A + 1) * c.f}
        major={major}
        minor={minor}
        unit={c.smallAb}
        points={[
          { value: A * c.f, label: `${A} ${c.bigAb}`, tone: "a" },
          { value: total, label: "total", tone: "b", onChange: (v) => setB(Math.min(Math.max(v - A * c.f, each), c.f - each)) },
        ]}
        bracket={{ from: A * c.f, to: total, label: `+${safeB} ${c.smallAb}` }}
      />
      <Says>
        <QA>
          {A} {c.bigs}
        </QA>{" "}
        = {fmt(A * c.f)} {c.smalls}. Then {fmt(A * c.f)} + <QB>{safeB}</QB> = <b>{fmt(total)}</b> {c.smalls}. Same unit first, THEN add.
      </Says>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES — one per bucket
// ============================================================================

const BUCKETS = ["sameUnit", "mixedUnit", "fracDecimal", "numberLine"];

function sameUnitProblem(): Problem {
  const s = sameUnitScenario(pick(OPS));
  const tapeAt = (done: number): TapePart[] =>
    s.tape.parts.map((p) => (p.label.startsWith("?") && done >= 2 ? { ...p, label: `${fmt(s.answer)}${s.op === "divide" ? "" : " " + s.unit}` } : p));
  const totalAt = (done: number) => (s.tape.total.startsWith("?") && done >= 2 ? `${fmt(s.answer)} ${s.unit}` : s.tape.total);
  const sum = `${fmt(s.a)} ${OP_SIGN[s.op]} ${fmt(s.b)} = ${fmt(s.answer)}`;
  return {
    title: "Measurement word problem",
    bucket: "sameUnit",
    story: `${s.story} ${s.question}`,
    visual: (done) => <TapeBar parts={tapeAt(done)} total={totalAt(done)} />,
    steps: [
      choice(
        {
          prompt: "Which operation fits this story?",
          hint: "Putting together → add. Taking away or finding what's left → subtract. Equal groups → multiply. Sharing equally → divide.",
          explain: `${OP_WORD[s.op]}: ${sum}.`,
        },
        OP_WORD[s.op],
        OPS.filter((o) => o !== s.op).map((o) => OP_WORD[o])
      ),
      { kind: "number", prompt: s.question, suffix: s.unit, hint: `${fmt(s.a)} ${OP_SIGN[s.op]} ${fmt(s.b)}`, explain: `${sum} ${s.unitWord}.`, answer: s.answer },
      {
        kind: "number",
        prompt: `Check it backwards with the opposite operation: ${fmt(s.answer)} ${s.checkSign} ${fmt(s.b)} = ?`,
        hint: "Undoing your answer should land you back on a number from the story.",
        explain: `${fmt(s.answer)} ${s.checkSign} ${fmt(s.b)} = ${fmt(s.checkAnswer)} — that's back to the story's number, so the answer checks out.`,
        answer: s.checkAnswer,
      },
    ],
    wrapUp: `${sum} ${s.unitWord}.`,
  };
}

function mixedUnitProblem(): Problem {
  const s = mixedScenario();
  const { c, A, b, op } = s;
  const Af = A * c.f;
  return {
    title: "Mixed units — convert first",
    bucket: "mixedUnit",
    story: `${s.story} ${s.question}`,
    visual: (done) =>
      op === "add" ? (
        <TapeBar
          parts={[
            { weight: Af, label: done >= 2 ? `${fmt(Af)} ${c.smallAb}` : `${A} ${c.bigAb}`, tone: "a" },
            { weight: b, label: `${b} ${c.smallAb}`, tone: "b" },
          ]}
          total={done >= 3 ? `${fmt(s.answer)} ${c.smallAb}` : `? ${c.smallAb}`}
        />
      ) : (
        <TapeBar
          parts={[
            { weight: b, label: `${b} ${c.smallAb}`, tone: "b" },
            { weight: Af - b, label: done >= 3 ? `${fmt(s.answer)} ${c.smallAb}` : `? ${c.smallAb}`, tone: "a" },
          ]}
          total={done >= 2 ? `${fmt(Af)} ${c.smallAb}` : `${A} ${c.bigAb}`}
        />
      ),
    steps: [
      choice(
        {
          prompt: "What should you do FIRST?",
          hint: `${c.bigs} and ${c.smalls} are different-sized units — can you ${op} their numbers yet?`,
          explain: `Change ${A} ${c.bigAb} into ${c.smalls} first, so both amounts use the same unit.`,
        },
        `Change ${A} ${A === 1 ? c.big : c.bigs} into ${c.smalls}`,
        [`${op === "add" ? "Add" : "Subtract"} ${A} and ${b} right away`, `Multiply ${A} × ${b}`]
      ),
      { kind: "number", prompt: `${A} ${A === 1 ? c.big : c.bigs} = how many ${c.smalls}?`, suffix: c.smallAb, hint: `1 ${c.big} = ${fmt(c.f)} ${c.smalls}.`, explain: `${A} × ${fmt(c.f)} = ${fmt(Af)} ${c.smallAb}.`, answer: Af },
      {
        kind: "number",
        prompt: s.question,
        suffix: c.smallAb,
        hint: `${fmt(Af)} ${op === "add" ? "+" : "−"} ${b}`,
        explain: `${fmt(Af)} ${op === "add" ? "+" : "−"} ${b} = ${fmt(s.answer)} ${c.smalls}.`,
        answer: s.answer,
      },
    ],
    wrapUp: `${A} ${c.bigAb} ${op === "add" ? "+" : "−"} ${b} ${c.smallAb} = ${fmt(Af)} ${op === "add" ? "+" : "−"} ${b} = ${fmt(s.answer)} ${c.smallAb} — never ${op === "add" ? A + b : Math.abs(A - b)}!`,
  };
}

function fracDecimalProblem(): Problem {
  const s = fracScenario();
  const { c } = s;
  const qLabel = (done: number) => (done >= 1 ? `${fmt(s.qSmall)} ${c.smallAb}` : `${s.qText} ${c.bigAb}`);
  return {
    title: "Fractions and decimals of a unit",
    bucket: "fracDecimal",
    story: `${s.story} ${s.question}`,
    visual: (done) => (
      <TapeBar
        parts={
          s.variant === "times"
            ? Array.from({ length: s.n }, () => ({ weight: 1, label: qLabel(done), tone: "a" as const }))
            : [
                { weight: s.qSmall, label: qLabel(done), tone: "a" },
                { weight: s.s, label: `${s.s} ${c.smallAb}`, tone: "b" },
              ]
        }
        total={done >= 2 ? `${fmt(s.answer)} ${c.smallAb}` : `? ${c.smallAb}`}
      />
    ),
    steps: [
      {
        kind: "number",
        prompt: `${s.qText} ${s.q.whole + s.q.quarters / 4 > 1 ? c.bigs : c.big} = how many ${c.smalls}?`,
        suffix: c.smallAb,
        hint: `1 ${c.big} = ${fmt(c.f)} ${c.smalls}. Half of that is ${fmt(c.f / 2)}; a quarter is ${fmt(c.f / 4)}.`,
        explain: `${s.q.whole > 0 ? `${s.q.whole} × ${fmt(c.f)} = ${fmt(s.q.whole * c.f)}, plus ` : ""}${s.q.quarters === 2 ? "half" : `${s.q.quarters} quarter${s.q.quarters > 1 ? "s" : ""}`} of ${fmt(c.f)} = ${fmt((s.q.quarters * c.f) / 4)} → ${fmt(s.qSmall)} ${c.smalls}.`,
        answer: s.qSmall,
      },
      {
        kind: "number",
        prompt: s.question,
        suffix: c.smallAb,
        hint: s.variant === "times" ? `${fmt(s.qSmall)} × ${s.n}` : `${fmt(s.qSmall)} + ${s.s}`,
        explain: `${s.variant === "times" ? `${fmt(s.qSmall)} × ${s.n}` : `${fmt(s.qSmall)} + ${s.s}`} = ${fmt(s.answer)} ${c.smalls}.`,
        answer: s.answer,
      },
      {
        kind: "ratio",
        tones: "none",
        frame: ["", `${c.bigAb} and`, c.smallAb],
        labels: [c.bigs, c.smalls],
        prompt: `Now say it the other way: ${fmt(s.answer)} ${c.smalls} = how many whole ${c.bigs} and how many ${c.smalls} left over?`,
        hint: `How many whole groups of ${fmt(c.f)} fit in ${fmt(s.answer)}?`,
        explain: `${s.regroup[0]} × ${fmt(c.f)} = ${fmt(s.regroup[0] * c.f)}, with ${s.regroup[1]} left: ${s.regroup[0]} ${c.bigAb} ${s.regroup[1]} ${c.smallAb}.`,
        equivalentHint: `Use as many whole ${c.bigs} as you can, then the ${c.smalls} left over.`,
        answer: s.regroup,
      },
    ],
    wrapUp: `${fmt(s.answer)} ${c.smallAb} = ${s.regroup[0]} ${c.bigAb} ${s.regroup[1]} ${c.smallAb}.`,
  };
}

function numberLineProblem(): Problem {
  const s = scaleScenario();
  const { cfg } = s;
  const spaces = cfg.major / cfg.minor;
  return {
    title: "Read the scale",
    bucket: "numberLine",
    story: s.story,
    visual: (done) => (
      <ScaleLine
        min={0}
        max={cfg.max}
        major={cfg.major}
        minor={cfg.minor}
        unit={cfg.unit}
        points={[
          { value: s.A, label: "A", tone: "a" },
          { value: s.B, label: "B", tone: "b" },
        ]}
        bracket={done >= 3 ? { from: s.A, to: s.B, label: `${fmt(s.answer)} ${cfg.unit}` } : undefined}
      />
    ),
    steps: [
      {
        kind: "number",
        prompt: `The labels go up by ${fmt(cfg.major)}. How much is each small space worth?`,
        suffix: cfg.unit,
        hint: `Count the small spaces between two labels (there are ${spaces}), then share ${fmt(cfg.major)} equally.`,
        explain: `${fmt(cfg.major)} ÷ ${spaces} = ${fmt(cfg.minor)} ${cfg.unit} per small space.`,
        answer: cfg.minor,
      },
      {
        kind: "ratio",
        tones: ["a", "b"],
        frame: ["A =", "B =", cfg.unit],
        labels: ["A", "B"],
        prompt: (
          <>
            What values are at <QA>A</QA> and <QB>B</QB>?
          </>
        ),
        hint: `Start at the nearest label and count small spaces of ${fmt(cfg.minor)}.`,
        explain: `A = ${fmt(s.A)} ${cfg.unit} and B = ${fmt(s.B)} ${cfg.unit}.`,
        answer: [s.A, s.B],
      },
      { kind: "number", prompt: s.question, suffix: cfg.unit, hint: `${fmt(s.B)} − ${fmt(s.A)}`, explain: `${fmt(s.B)} − ${fmt(s.A)} = ${fmt(s.answer)} ${cfg.unit}.`, answer: s.answer },
    ],
    wrapUp: `From ${fmt(s.A)} to ${fmt(s.B)} is ${fmt(s.answer)} ${cfg.unitWord}.`,
  };
}

function Preview() {
  return (
    <TapeBar
      parts={[
        { weight: 2000, label: "2,000 g", tone: "a" },
        { weight: 500, label: "500 g", tone: "b" },
      ]}
      total="2,500 g"
    />
  );
}

export const measurementWordProblems: Unit = {
  id: "measurementWordProblems",
  title: "Word Problems with Distance, Time, Volume & Mass",
  goal: "I can solve word problems that add, subtract, multiply, or divide measurements — including problems where I have to convert units first.",
  standard: "4.MD.2",
  keyIdea: (
    <>
      <p>You can only add or subtract measurements that use the SAME unit. 2 kg + 500 g is not 502 — change 2 kg into 2,000 g first, then 2,000 + 500 = 2,500 g.</p>
      <p>On a scale, find what one small space is worth before reading a point: labels 200 apart with 4 spaces means each space is 50.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [
    { label: "Same unit", make: sameUnitProblem, buckets: ["sameUnit"] },
    { label: "Mixed units", make: mixedUnitProblem, buckets: ["mixedUnit"] },
    { label: "Fractions & decimals", make: fracDecimalProblem, buckets: ["fracDecimal"] },
    { label: "Number line", make: numberLineProblem, buckets: ["numberLine"] },
  ],
  requiredBuckets: BUCKETS,
  test: measurementWordProblemsTest,
};
