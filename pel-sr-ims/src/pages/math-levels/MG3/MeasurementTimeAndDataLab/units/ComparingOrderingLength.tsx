import { useEffect, useState } from "react";
import { LengthBars, type LengthItem } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { comparingOrderingLengthTest } from "./ComparingOrderingLengthTest";

// Concrete, named real-world objects (never a bare "Object A/B/C") — matches
// this lab's audience framing (first grader, first exposure, every unit
// leans on concrete/manipulable things). Picked 3 at a time, without
// replacement, per generated problem.
const OBJECTS = [
  { name: "Pencil", glyph: "✏️" },
  { name: "Crayon", glyph: "🖍️" },
  { name: "Marker", glyph: "🖊️" },
  { name: "Ribbon", glyph: "🎀" },
  { name: "Carrot", glyph: "🥕" },
  { name: "Toothbrush", glyph: "🪥" },
  { name: "Key", glyph: "🔑" },
  { name: "Feather", glyph: "🪶" },
] as const;

function pickThreeObjects() {
  return shuffle(OBJECTS).slice(0, 3);
}

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Vocabulary + the commonly-conflated pair, in one question: shorter/longer
 *  are opposite directions of the SAME comparison, not two independent facts. */
function OppositeTermsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> The red ribbon is <b>shorter</b> than the blue ribbon.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          True or false: that also means the blue ribbon is <b>longer</b> than the red ribbon.{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — \"shorter than\" and \"longer than\" are two ways of saying the exact same comparison, just from each ribbon's own point of view."
            : "Not quite — if one object is shorter than another, the other one is always longer than it. They're the same comparison, said from each side."}
        </p>
      )}
    </div>
  );
}

/** The misaligned-start misconception, explicit. */
function MisalignedStartQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "pencil";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  const items: LengthItem[] = [
    { id: "pencil", label: "✏️ Pencil", length: 9, start: 0, tone: "a" },
    { id: "crayon", label: "🖍️ Crayon", length: 5, start: 7, tone: "b" },
  ];

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> These two were NOT lined up at the same starting point before this picture was taken.
      </p>
      <LengthBars items={items} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which one is actually longer?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="pencil">The pencil</option>
            <option value="crayon">The crayon — its end sticks out furthest right</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the crayon's far end sticks out further right, but that's only because it STARTED further right too. The pencil stretches farther from its own start to its own end, so the pencil is the longer one."
            : "Not quite — the crayon's end sticks out furthest right, but it also started further right. Compare how far each one stretches from its OWN start to its OWN end, not where it ends up on the page."}
        </p>
      )}
    </div>
  );
}

/** Transitive reasoning, with an explicit "how do you know" justification —
 *  A and B are never shown touching or side by side. */
function TransitiveReasoningQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [whyPicked, setWhyPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [picked, whyPicked].every((v) => String(v).trim() !== "");
  const pickedOk = picked === "longer";
  const whyOk = whyPicked === "transitive";
  const ok = pickedOk && whyOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> The marker is longer than the key. The key is longer than the feather. The marker and the feather are never shown next to each other.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Is the marker longer or shorter than the feather?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(pickedOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="longer">Longer</option>
            <option value="shorter">Shorter</option>
            <option value="cant">Can't tell — they were never shown together</option>
          </select>
        </label>
        <label>
          How do you know, since they're not touching?{" "}
          <select className="answer" value={whyPicked} onChange={(e) => setWhyPicked(e.target.value)} style={fieldOk(whyOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="transitive">Marker &gt; key, and key &gt; feather, so marker must be &gt; feather</option>
            <option value="guess">A good guess, since markers are usually long</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — you never need to see two objects side by side if you already know how each one compares to a third object in between. Marker > key and key > feather chain together: marker > feather."
            : "Not quite — chain the two facts together: the marker beats the key, and the key beats the feather, so the marker must beat the feather too. That's true every time, not a guess."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: restates the misaligned-start
 *  misconception as a general rule, to check it wasn't just memorized for
 *  the one pencil/crayon example above. */
function FarEdgeGeneralizationQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or false: whenever one object's far end sticks out further than another's, it's always the longer object.
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
            ? "Correct — that's only true when both objects start at the same place. If they don't, the one sticking out furthest might just have started further ahead, like the crayon above."
            : "Not quite — think back to the pencil and crayon: the crayon stuck out furthest right, but only because it started further right too. Starting point matters."}
        </p>
      )}
    </div>
  );
}

function LengthCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ opposite: false, misaligned: false, transitive: false, generalization: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure comparing lengths makes sense before you try practice problems.</p>
      <OppositeTermsQuestion onComplete={mark("opposite")} />
      <MisalignedStartQuestion onComplete={mark("misaligned")} />
      <TransitiveReasoningQuestion onComplete={mark("transitive")} />
      <FarEdgeGeneralizationQuestion onComplete={mark("generalization")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function randomTrio(): { id: string; label: string; length: number }[] {
  const objs = pickThreeObjects();
  const lengths = shuffle([randInt(3, 5), randInt(6, 8), randInt(9, 11)]);
  return objs.map((o, i) => ({ id: o.name, label: `${o.glyph} ${o.name}`, length: lengths[i] }));
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [trio, setTrio] = useState(randomTrio);
  const [order, setOrder] = useState<string[]>(() => trio.map((t) => t.id));
  const [checked, setChecked] = useState(false);

  const newTrio = () => {
    const t = randomTrio();
    setTrio(t);
    setOrder(t.map((x) => x.id));
    setChecked(false);
  };

  const byId = (id: string) => trio.find((t) => t.id === id)!;
  const sortedIds = [...trio].sort((a, b) => a.length - b.length).map((t) => t.id);
  const isCorrectOrder = order.every((id, i) => id === sortedIds[i]);

  const items: LengthItem[] = order.map((id, i) => ({
    id,
    label: byId(id).label,
    length: byId(id).length,
    start: 0,
    tone: (["a", "b", "c"] as const)[i],
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <button className="btn ghost" onClick={newTrio}>
          New objects
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

      <p className="muted small">Drag the handle (⠿) on each row to put the three objects in order, shortest to longest, top to bottom.</p>
      <LengthBars items={items} draggableReorder onReorder={setOrder} />
      <div className="control-row">
        <button className="btn primary" onClick={() => setChecked(true)}>
          Check my order
        </button>
      </div>
      {checked && (
        <p className={`feedback ${isCorrectOrder ? "good" : "bad"}`} role="alert">
          {isCorrectOrder
            ? "That's shortest to longest! Notice all three start at the same left edge — that's what makes comparing them by eye fair."
            : "Not yet — drag rows up or down to put the shortest object on top and the longest on the bottom."}
        </p>
      )}
      <p className="muted small">
        Try dragging again after clicking "New objects" a few times — the actual lengths change, but they always start lined up at the same left edge
        here, which is what makes comparing them fair just by looking.
      </p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "alignedOrder3" | "misalignedOrder3" | "indirectTransitive" | "indirectCounterToGlance";
const BUCKETS: Bucket[] = ["alignedOrder3", "misalignedOrder3", "indirectTransitive", "indirectCounterToGlance"];

function alignedOrderProblem(): Problem {
  const trio = randomTrio();
  const sorted = [...trio].sort((a, b) => a.length - b.length);
  const items: LengthItem[] = trio.map((t, i) => ({ id: t.id, label: t.label, length: t.length, start: 0, tone: (["a", "b", "c"] as const)[i] }));
  const names = trio.map((t) => t.label);

  return {
    title: "Order three objects by length",
    bucket: "alignedOrder3",
    story: "All three objects are lined up at the same starting point. Order them from shortest to longest.",
    visual: () => <LengthBars items={items} />,
    steps: [
      choice({ prompt: "Which one is the SHORTEST?", hint: "Look for the bar that stretches the least far.", explain: `${sorted[0].label} is the shortest.` }, sorted[0].label, names.filter((n) => n !== sorted[0].label)),
      choice({ prompt: "Which one is the LONGEST?", hint: "Look for the bar that stretches the farthest.", explain: `${sorted[2].label} is the longest.` }, sorted[2].label, names.filter((n) => n !== sorted[2].label)),
    ],
    wrapUp: `Shortest to longest: ${sorted.map((s) => s.label).join(" → ")}.`,
  };
}

function misalignedOrderProblem(): Problem {
  const objs = pickThreeObjects();
  const shortLen = randInt(3, 5);
  const midLen = randInt(6, 8);
  const longLen = randInt(9, 11);
  // The trap: the SHORT object starts further right than the long object
  // ends, so its far-right edge sticks out past the long object's — even
  // though it's genuinely shorter. The long object starts at 0, so its own
  // true length is fully exposed to compare against.
  const longStart = 0;
  const shortStart = longStart + longLen + randInt(1, 3) - shortLen; // guarantees short's end > long's end
  const midStart = randInt(0, 2);
  const [longObj, midObj, shortObj] = objs;
  const items: LengthItem[] = shuffle([
    { id: longObj.name, label: `${longObj.glyph} ${longObj.name}`, length: longLen, start: longStart, tone: "a" as const },
    { id: midObj.name, label: `${midObj.glyph} ${midObj.name}`, length: midLen, start: midStart, tone: "b" as const },
    { id: shortObj.name, label: `${shortObj.glyph} ${shortObj.name}`, length: shortLen, start: Math.max(0, shortStart), tone: "c" as const },
  ]);
  const longLabel = `${longObj.glyph} ${longObj.name}`;
  const shortLabel = `${shortObj.glyph} ${shortObj.name}`;
  const midLabel = `${midObj.glyph} ${midObj.name}`;
  const names = [longLabel, midLabel, shortLabel];

  return {
    title: "Order three objects — not lined up the same way",
    bucket: "misalignedOrder3",
    story: "These three were NOT lined up at the same starting point. Look carefully at how far each one actually stretches, not just where it ends up.",
    visual: () => <LengthBars items={items} />,
    steps: [
      choice({ prompt: "Which one is the SHORTEST?", hint: "Don't just look at the far-right edge — look at how far each bar stretches from its OWN start.", explain: `${shortLabel} is the shortest, even though its far end isn't the leftmost one shown.` }, shortLabel, names.filter((n) => n !== shortLabel)),
      choice({ prompt: "Which one is the LONGEST?", hint: "The one that sticks out furthest right isn't necessarily the longest — check where each one STARTS too.", explain: `${longLabel} is the longest, even though its bar doesn't reach the furthest right.` }, longLabel, names.filter((n) => n !== longLabel)),
      choice(
        {
          prompt: `How can ${longLabel} be the longest if ${shortLabel}'s bar reaches further to the right?`,
          hint: "Think about where each bar started, not just where it ended up.",
          explain: `${shortLabel} started further to the right, so it reached a further point without actually stretching as far. Length is about how far an object stretches from its OWN start to its OWN end.`,
        },
        "It started further left, so it stretches farther from its own start to its own end",
        ["Its color looks bigger", "It's drawn closer to the top of the picture"]
      ),
    ],
    wrapUp: `Even though they don't start in the same place, ${longLabel} truly stretches the farthest, and ${shortLabel} truly stretches the least.`,
  };
}

/** Shared builder for both indirect-comparison buckets — only `sameScale`
 *  differs between them (see its doc comment below). */
function indirectProblem(sameScale: boolean, bucket: Bucket): Problem {
  const objs = pickThreeObjects();
  const [a, c, b] = objs; // a > c > b, strictly decreasing
  const aLen = randInt(9, 12);
  const cLen = randInt(5, 8);
  const bLen = randInt(2, 4);
  const aLabel = `${a.glyph} ${a.name}`;
  const cLabel = `${c.glyph} ${c.name}`;
  const bLabel = `${b.glyph} ${b.name}`;

  // Row 1 (A vs C) and Row 2 (C vs B) are two SEPARATE LengthBars calls.
  // sameScale=true (indirectTransitive): both rows share one unitPx, so a
  // naive cross-row pixel comparison happens to agree with the correct
  // transitive answer anyway — this bucket is just the baseline reasoning
  // skill. sameScale=false (indirectCounterToGlance): each row is scaled to
  // its OWN taller object independently, so C's bar looks a different size
  // in each picture — a student eyeballing pixel sizes across the two
  // separate pictures gets misled, and must fall back on the stated facts
  // instead, which is the entire point of this harder bucket.
  const row1Max = Math.max(aLen, cLen);
  const row2Max = Math.max(cLen, bLen);
  const targetPx = 190;
  const row1UnitPx = sameScale ? 20 : targetPx / row1Max;
  const row2UnitPx = sameScale ? 20 : targetPx / row2Max;

  const row1: LengthItem[] = [
    { id: a.name, label: aLabel, length: aLen, tone: "a" },
    { id: c.name, label: cLabel, length: cLen, tone: "c" },
  ];
  const row2: LengthItem[] = [
    { id: c.name, label: cLabel, length: cLen, tone: "c" },
    { id: b.name, label: bLabel, length: bLen, tone: "b" },
  ];

  const whyChoices = sameScale
    ? [`${aLabel} > ${cLabel} and ${cLabel} > ${bLabel}, so ${aLabel} must be > ${bLabel}`, `${aLabel}'s picture looks bigger overall`, `${bLabel} was listed last`]
    : [
        `${aLabel} > ${cLabel} and ${cLabel} > ${bLabel}, so ${aLabel} must be > ${bLabel}`,
        `${bLabel}'s bar looks just as big as ${aLabel}'s bar in its own picture`,
        `${bLabel} was listed last`,
      ];
  const correctWhy = whyChoices[0];

  return {
    title: "Compare two objects using a third",
    bucket,
    story: `${aLabel} and ${bLabel} are never shown next to each other. Here's what we know instead: how ${aLabel} compares to ${cLabel}, and how ${cLabel} compares to ${bLabel}.`,
    visual: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <LengthBars items={row1} unitPx={row1UnitPx} />
        <LengthBars items={row2} unitPx={row2UnitPx} />
      </div>
    ),
    steps: [
      choice(
        { prompt: `Is ${aLabel} longer or shorter than ${bLabel}?`, hint: `${aLabel} beats ${cLabel}, and ${cLabel} beats ${bLabel} — chain the two facts together.`, explain: `${aLabel} is longer than ${bLabel}.` },
        `${aLabel} is longer than ${bLabel}`,
        [`${aLabel} is shorter than ${bLabel}`, "Can't tell — they were never shown together"]
      ),
      choice(
        { prompt: `How do you know, since ${aLabel} and ${bLabel} are never shown side by side?`, hint: "Use the two facts you were told, not how big either picture looks.", explain: `${correctWhy}.` },
        correctWhy,
        whyChoices.slice(1)
      ),
    ],
    wrapUp: `${aLabel} > ${cLabel} and ${cLabel} > ${bLabel}, so ${aLabel} > ${bLabel} — even without ever seeing ${aLabel} and ${bLabel} side by side.`,
  };
}

function indirectTransitiveProblem(): Problem {
  return indirectProblem(true, "indirectTransitive");
}
function indirectCounterToGlanceProblem(): Problem {
  return indirectProblem(false, "indirectCounterToGlance");
}

function lengthProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "alignedOrder3") return alignedOrderProblem();
  if (bucket === "misalignedOrder3") return misalignedOrderProblem();
  if (bucket === "indirectTransitive") return indirectTransitiveProblem();
  return indirectCounterToGlanceProblem();
}

export const comparingOrderingLength: Unit = {
  id: "comparingOrderingLength",
  title: "Comparing and Ordering Length",
  goal: "Put three objects in order from shortest to longest, and compare two objects' lengths using a third object as a go-between when they can't be placed side by side.",
  standard: "1.MD.1",
  keyIdea: (
    <>
      <p>To order objects by length, compare how far each one stretches from its OWN start to its OWN end — not just where it ends up on the page.</p>
      <p>You can compare two objects you've never seen together, as long as you know how each one compares to a third object in between.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoned through visually each time — not a memorized fact.
  problems: [{ label: "Compare & Order", make: lengthProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: comparingOrderingLengthTest,
};
