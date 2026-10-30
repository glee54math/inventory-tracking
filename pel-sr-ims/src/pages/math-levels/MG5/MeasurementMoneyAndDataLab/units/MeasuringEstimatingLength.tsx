import { useEffect, useState } from "react";
import { Ruler, rulerReading, type RulerUnit } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { measuringEstimatingLengthTest } from "./MeasuringEstimatingLengthTest";

// Concrete, named real-world objects — matches this lab's audience framing
// (a 2nd grader seeing this for the first time, regardless of posted grade).
const SMALL_OBJECTS = [
  { name: "Pencil", glyph: "✏️" },
  { name: "Crayon", glyph: "🖍️" },
  { name: "Marker", glyph: "🖊️" },
  { name: "Key", glyph: "🔑" },
  { name: "Toothbrush", glyph: "🪥" },
  { name: "Spoon", glyph: "🥄" },
] as const;

function pickObject() {
  return shuffle(SMALL_OBJECTS)[0];
}

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Vocabulary question. */
function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "length";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> What's the word for the distance from one end of an object to the other?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="weight">Weight</option>
          <option value="length">Length</option>
          <option value="color">Color</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — length is how far it stretches from one end to the other." : "Not quite — that distance from end to end is called length."}
        </p>
      )}
    </div>
  );
}

/** THE core misconception this unit exists to break: reading a ruler's
 *  endpoint number as the length, even when the object doesn't start at 0. */
function BrokenRulerQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "6";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> This crayon does NOT start at the ruler's zero mark.
      </p>
      <Ruler unit="in" maxUnits={12} objectStart={3} objectLength={6} label="🖍️" tone="b" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          How long is the crayon?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="9">9 inches — that's where it ends</option>
            <option value="6">6 inches — from where it starts to where it ends</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the crayon starts at 3 and ends at 9, so it covers 9 − 3 = 6 inches. The 9 is just where it happens to END, not how long it is."
            : "Not quite — the crayon doesn't start at 0, so you can't just read the end mark. It starts at 3 and ends at 9: 9 − 3 = 6 inches long."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap — restates the broken-ruler misconception
 *  as a general rule, so it can't be answered by memorizing the one example above. */
function GeneralizationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: you can always find an object's length just by reading the number at its right end.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — that only works when the object starts at 0. If it doesn't, you have to subtract the start mark from the end mark."
            : "Not quite — think back to the crayon: it ended at 9, but it didn't start at 0, so 9 wasn't its length. Always check the start mark too."}
        </p>
      )}
    </div>
  );
}

/** Commonly-conflated-concept question: picking a tool at the wrong scale. */
function ToolScaleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "ruler";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> You want to measure the length of your pencil.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which tool makes more sense?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="ruler">A small ruler</option>
            <option value="yardstick">A yardstick (3 feet long)</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — a small ruler is already as long as (or longer than) the pencil, so you can read its length in one look."
            : "Not quite — a yardstick is way bigger than a pencil. A small ruler fits the pencil's own size better."}
        </p>
      )}
    </div>
  );
}

function LengthCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, broken: false, general: false, tool: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure measuring makes sense before you try practice problems.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <BrokenRulerQuestion onComplete={mark("broken")} />
      <GeneralizationQuestion onComplete={mark("general")} />
      <ToolScaleQuestion onComplete={mark("tool")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [obj, setObj] = useState(pickObject);
  const [objectLength] = useState(() => randInt(4, 7));
  const [objectStart, setObjectStart] = useState(0);
  const reading = rulerReading(objectStart, objectLength);

  const newObject = () => {
    setObj(pickObject());
    setObjectStart(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <button className="btn ghost" onClick={newObject}>
          New object
        </button>
        {!introActive && (
          <button
            type="button"
            className="btn ghost"
            style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined}
            onClick={() => setShowCheck((v) => !v)}
          >
            Check for Understanding
          </button>
        )}
      </div>
      {(introActive || showCheck) && <LengthCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">
        Drag the {obj.glyph} {obj.name} along the ruler. Watch what happens to the start and end marks — the LENGTH stays the same no matter where it sits.
      </p>
      <Ruler unit="in" maxUnits={12} objectStart={objectStart} objectLength={objectLength} label={obj.glyph} tone="a" onDrag={setObjectStart} />
      <div className="digital-display" style={{ fontSize: 20, padding: "10px 16px" }}>
        Start: {reading.start} &nbsp; End: {reading.end} &nbsp; Length: {reading.end} − {reading.start} = {reading.length} in
      </div>
      <p className="muted small">
        Notice the end mark changes as you drag, but {reading.end} − {reading.start} always comes out to {reading.length} — that's the real length.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "zeroAligned" | "brokenRuler" | "estimateCustomary" | "estimateMetric" | "chooseUnit";
const BUCKETS: Bucket[] = ["zeroAligned", "brokenRuler", "estimateCustomary", "estimateMetric", "chooseUnit"];

function rulerProblem(bucket: "zeroAligned" | "brokenRuler"): Problem {
  const obj = pickObject();
  const unit: RulerUnit = Math.random() < 0.5 ? "in" : "cm";
  const maxUnits = unit === "in" ? 12 : 20;
  const length = unit === "in" ? randInt(4, 8) : randInt(6, 14);
  const start = bucket === "zeroAligned" ? 0 : randInt(1, maxUnits - length - 1);
  const { end } = rulerReading(start, length);

  return {
    title: `Read the ${unit === "in" ? "inch" : "centimeter"} ruler`,
    bucket,
    story:
      bucket === "zeroAligned"
        ? `The ${obj.name.toLowerCase()} starts right at the ruler's zero mark.`
        : `The ${obj.name.toLowerCase()} does NOT start at the ruler's zero mark — look carefully at both ends.`,
    visual: () => <Ruler unit={unit} maxUnits={maxUnits} objectStart={start} objectLength={length} label={obj.glyph} tone="a" />,
    steps:
      bucket === "zeroAligned"
        ? [
            {
              kind: "number",
              prompt: `How long is the ${obj.name.toLowerCase()}?`,
              hint: `It starts at 0 and ends at ${end} — so the length is just ${end}.`,
              explain: `The ${obj.name.toLowerCase()} is ${length} ${unit} long.`,
              answer: length,
              suffix: unit,
            },
          ]
        : [
            { kind: "number", prompt: "Where does it START on the ruler?", hint: "Look at the left dashed line.", explain: `It starts at ${start}.`, answer: start },
            { kind: "number", prompt: "Where does it END on the ruler?", hint: "Look at the right dashed line.", explain: `It ends at ${end}.`, answer: end },
            {
              kind: "number",
              prompt: "So how long is it?",
              hint: `Subtract the start from the end: ${end} − ${start}.`,
              explain: `${end} − ${start} = ${length} ${unit}.`,
              answer: length,
              suffix: unit,
            },
          ],
    wrapUp:
      bucket === "zeroAligned"
        ? `The ${obj.name.toLowerCase()} is ${length} ${unit} long.`
        : `Even starting at ${start}, the ${obj.name.toLowerCase()} is still ${length} ${unit} long — always end minus start.`,
  };
}

// Reasonable-estimate pools: each entry gives one TRUE reasonable estimate
// plus a too-small and a too-big distractor in the SAME unit, so the
// question tests magnitude reasoning, not precise measurement.
const CUSTOMARY_ESTIMATES = [
  { name: "a crayon", glyph: "🖍️", reasonable: 3, small: 1, big: 20, unit: "inches" },
  { name: "a new pencil", glyph: "✏️", reasonable: 7, small: 1, big: 30, unit: "inches" },
  { name: "a shoe", glyph: "👟", reasonable: 10, small: 1, big: 40, unit: "inches" },
  { name: "a classroom door", glyph: "🚪", reasonable: 7, small: 1, big: 30, unit: "feet" },
  { name: "a school bus", glyph: "🚌", reasonable: 35, small: 2, big: 300, unit: "feet" },
] as const;

const METRIC_ESTIMATES = [
  { name: "a paperclip", glyph: "📎", reasonable: 3, small: 1, big: 30, unit: "centimeters" },
  { name: "a crayon", glyph: "🖍️", reasonable: 8, small: 1, big: 50, unit: "centimeters" },
  { name: "a notebook", glyph: "📓", reasonable: 25, small: 2, big: 100, unit: "centimeters" },
  { name: "a classroom door", glyph: "🚪", reasonable: 2, small: 1, big: 20, unit: "meters" },
  { name: "a school bus", glyph: "🚌", reasonable: 10, small: 1, big: 100, unit: "meters" },
] as const;

function estimateProblem(bucket: "estimateCustomary" | "estimateMetric"): Problem {
  const pool = bucket === "estimateCustomary" ? CUSTOMARY_ESTIMATES : METRIC_ESTIMATES;
  const item = pool[randInt(0, pool.length - 1)];
  const correctText = `About ${item.reasonable} ${item.unit}`;
  const choices = [correctText, `About ${item.small} ${item.unit}`, `About ${item.big} ${item.unit}`];

  return {
    title: "Estimate before measuring",
    bucket,
    story: `${item.glyph} Before you measure, make a reasonable ESTIMATE: about how long is ${item.name}?`,
    visual: () => (
      <div style={{ fontSize: 56, textAlign: "center" }} role="img" aria-label={item.name}>
        {item.glyph}
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `About how long is ${item.name}?`,
          hint: `Think about how ${item.name} compares to something you already know the size of.`,
          explain: `${correctText} is the reasonable estimate — the other choices are way too small or way too big for ${item.name}.`,
        },
        correctText,
        choices.slice(1)
      ),
      choice(
        {
          prompt: `Why is "about ${item.big} ${item.unit}" NOT a reasonable estimate for ${item.name}?`,
          hint: "Think about how big that amount really is.",
          explain: `${item.big} ${item.unit} is far bigger than ${item.name} actually is.`,
        },
        `That's way too big for ${item.name}`,
        [`That's exactly right for ${item.name}`, `Estimates don't need to make sense`]
      ),
    ],
    wrapUp: `A good estimate for ${item.name} is about ${item.reasonable} ${item.unit}.`,
  };
}

const TOOL_OBJECTS = [
  { name: "a pencil", glyph: "✏️", small: true },
  { name: "a paperclip", glyph: "📎", small: true },
  { name: "a crayon", glyph: "🖍️", small: true },
  { name: "a school bus", glyph: "🚌", small: false },
  { name: "a hallway", glyph: "🚪", small: false },
  { name: "a basketball court", glyph: "🏀", small: false },
] as const;

function chooseUnitProblem(): Problem {
  const item = TOOL_OBJECTS[randInt(0, TOOL_OBJECTS.length - 1)];
  const correctTool = item.small ? "A small ruler" : "A long tape measure or yardstick";
  const otherTool = item.small ? "A long tape measure or yardstick" : "A small ruler";

  return {
    title: "Choose the right tool",
    bucket: "chooseUnit",
    story: `You need to measure ${item.name}.`,
    visual: () => (
      <div style={{ fontSize: 56, textAlign: "center" }} role="img" aria-label={item.name}>
        {item.glyph}
      </div>
    ),
    steps: [
      choice(
        { prompt: `Which tool makes more sense for ${item.name}?`, hint: item.small ? "This object is small." : "This object is much bigger than a ruler.", explain: `${correctTool} fits the size of ${item.name}.` },
        correctTool,
        [otherTool]
      ),
      choice(
        {
          prompt: item.small ? `Why would a long tape measure be a poor choice for ${item.name}?` : `Why would a small ruler be a poor choice for ${item.name}?`,
          hint: "Think about how many times you'd have to move the tool to cover the whole thing.",
          explain: item.small
            ? `${item.name} is so small that most of a long tape measure would go unused — a small ruler already covers it in one look.`
            : `A small ruler would have to be laid down over and over to cover ${item.name}, which makes it easy to lose count — a longer tool covers it in far fewer moves.`,
        },
        item.small ? "Most of it would be unused — too big for such a small object" : "You'd have to lay it down over and over, which invites mistakes",
        [`It would give a totally different length`, `Rulers and tape measures always give the same reading`]
      ),
    ],
    wrapUp: `${correctTool} is the better choice for measuring ${item.name}.`,
  };
}

export const measuringEstimatingLength: Unit = {
  id: "measuringEstimatingLength",
  title: "Measuring and Estimating Length",
  goal: "Measure an object's length with a ruler — even when it doesn't start at zero — and make a reasonable estimate before you measure.",
  standard: "2.MD.1, 2.MD.3",
  keyIdea: (
    <>
      <p>A ruler's length is always END minus START, not just the number the object happens to end at.</p>
      <p>A good estimate should make sense for the object's real size — not too small, not too big.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [
    { label: "Read the Ruler", make: (b) => rulerProblem((b as Bucket) === "brokenRuler" ? "brokenRuler" : "zeroAligned"), buckets: ["zeroAligned", "brokenRuler"] },
    { label: "Estimate the Length", make: (b) => estimateProblem((b as Bucket) === "estimateMetric" ? "estimateMetric" : "estimateCustomary"), buckets: ["estimateCustomary", "estimateMetric"] },
    { label: "Choose the Right Tool", make: chooseUnitProblem, buckets: ["chooseUnit"] },
  ],
  requiredBuckets: BUCKETS,
  test: measuringEstimatingLengthTest,
};
