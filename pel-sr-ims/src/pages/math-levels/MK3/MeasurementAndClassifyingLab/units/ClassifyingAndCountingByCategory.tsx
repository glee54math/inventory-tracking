import { useEffect, useState } from "react";
import { SortedBins, type BinItem, type ItemShape } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { itemColors, palette } from "../../../shared/lib/palette";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { classifyingTest } from "./ClassifyingAndCountingByCategoryTest";

// ============================================================================
// SHARED HELPERS — item builders, duplicated (not imported) in
// ClassifyingAndCountingByCategoryTest.tsx per the usual *Test.tsx convention.
// ============================================================================

let uid = 0;
const nextId = () => `mk3-item-${uid++}`;

export function makeColorItems(countA: number, countB: number): { binA: BinItem[]; binB: BinItem[] } {
  const binA = Array.from({ length: countA }, () => ({ id: nextId(), shape: "circle" as ItemShape, color: itemColors.red.main }));
  const binB = Array.from({ length: countB }, () => ({ id: nextId(), shape: "circle" as ItemShape, color: itemColors.green.main }));
  return { binA, binB };
}

export function makeShapeItems(counts: [number, number, number]): BinItem[][] {
  const shapes: ItemShape[] = ["circle", "square", "triangle"];
  return counts.map((n, i) => Array.from({ length: n }, () => ({ id: nextId(), shape: shapes[i], color: palette.c })));
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: "category" and "attribute" aren't words a rote counting drill ever asks for. */
function SortingVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [groupPick, setGroupPick] = useState("");
  const [attrPick, setAttrPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [groupPick, attrPick].every((v) => String(v).trim() !== "");
  const groupOk = groupPick === "category";
  const attrOk = attrPick === "attribute";
  const ok = groupOk && attrOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> When you sort objects into groups by one feature, like color, each group has a name.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Each group is called a ___?{" "}
          <select className="answer" value={groupPick} onChange={(e) => setGroupPick(e.target.value)} style={fieldOk(groupOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="category">category</option>
            <option value="number">number</option>
          </select>
        </label>
        <label>
          The feature you sort by (like color or shape) is called the sorting ___?{" "}
          <select className="answer" value={attrPick} onChange={(e) => setAttrPick(e.target.value)} style={fieldOk(attrOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="attribute">attribute</option>
            <option value="answer">answer</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — a category is one of the groups, and the attribute is the feature you're sorting by." : "Not quite — a category is a GROUP; the attribute is the FEATURE you sorted by to make the groups."}
        </p>
      )}
    </div>
  );
}

/** Common conflation: switching sorting attribute partway through, without noticing. */
function SwitchedAttributeQuestion({ onComplete }: { onComplete?: () => void }) {
  const [correctPick, setCorrectPick] = useState("");
  const [shouldMatterPick, setShouldMatterPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [correctPick, shouldMatterPick].every((v) => String(v).trim() !== "");
  const correctOk = correctPick === "no";
  const shouldMatterOk = shouldMatterPick === "color";
  const ok = correctOk && shouldMatterOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> A student is sorting objects by COLOR. The first two objects go in the Red group because they're red. Then the student puts a blue square in the Red group too, because it's a square shape.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Was the blue square sorted correctly for a COLOR sort?{" "}
          <select className="answer" value={correctPick} onChange={(e) => setCorrectPick(e.target.value)} style={fieldOk(correctOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label>
          When sorting by color, what should decide which group an object goes in?{" "}
          <select className="answer" value={shouldMatterPick} onChange={(e) => setShouldMatterPick(e.target.value)} style={fieldOk(shouldMatterOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="color">Its color</option>
            <option value="shape">Its shape</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — no, that was sorted wrong. A blue square doesn't belong with red objects just because it's a square. Once you pick color as the attribute, every object must be sorted by COLOR, not shape."
            : "Not quite — the group was started as a COLOR sort (red objects). A blue square is the wrong color, even though its shape matches something else."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap: the sorting attribute must stay consistent. */
function ConsistentAttributeQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: once you start sorting by one attribute (like color), you should keep using that SAME attribute for every object.
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
            ? "Correct — switching attributes partway through (like the blue square above) makes the groups stop meaning anything."
            : "Not quite — remember the blue square. Switching from color to shape partway through breaks the sort."}
        </p>
      )}
    </div>
  );
}

/** Multi-part synthesis: counting AND comparing categories together. */
function CountAndCompareQuestion({ onComplete }: { onComplete?: () => void }) {
  const [fewerPick, setFewerPick] = useState("");
  const [byPick, setByPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [fewerPick, byPick].every((v) => String(v).trim() !== "");
  const fewerOk = fewerPick === "Green";
  const byOk = byPick === "2";
  const ok = fewerOk && byOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  const binA: BinItem[] = Array.from({ length: 6 }, () => ({ id: nextId(), shape: "circle", color: itemColors.red.main }));
  const binB: BinItem[] = Array.from({ length: 4 }, () => ({ id: nextId(), shape: "circle", color: itemColors.green.main }));

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> These are already sorted and counted by color.
      </p>
      <SortedBins bins={[{ label: "Red", items: binA }, { label: "Green", items: binB }]} />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which group has FEWER?{" "}
          <select className="answer" value={fewerPick} onChange={(e) => setFewerPick(e.target.value)} style={fieldOk(fewerOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="Red">Red</option>
            <option value="Green">Green</option>
          </select>
        </label>
        <label>
          How many fewer?{" "}
          <select className="answer" value={byPick} onChange={(e) => setByPick(e.target.value)} style={fieldOk(byOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="6">6</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — Green has fewer (4 vs 6), and 6 - 4 = 2 fewer." : "Not quite — count each group (Red has 6, Green has 4), then subtract to find how many fewer."}
        </p>
      )}
    </div>
  );
}

function ClassifyingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, switched: false, consistent: false, countCompare: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure sorting, counting, and comparing categories makes sense before you try practice problems.</p>
      <SortingVocabQuestion onComplete={mark("vocab")} />
      <SwitchedAttributeQuestion onComplete={mark("switched")} />
      <ConsistentAttributeQuestion onComplete={mark("consistent")} />
      <CountAndCompareQuestion onComplete={mark("countCompare")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

interface SortItem extends BinItem {
  bin: number | null;
}

function makeInitialItems(mode: "color" | "shape"): SortItem[] {
  if (mode === "color") {
    const n = 8;
    const items = Array.from({ length: n }, (_, i) => ({
      id: `exp-${i}`,
      shape: "circle" as ItemShape,
      color: i % 2 === 0 ? itemColors.red.main : itemColors.green.main,
      bin: null,
    }));
    return shuffle(items);
  }
  const shapes: ItemShape[] = ["circle", "square", "triangle"];
  const n = 9;
  const items = Array.from({ length: n }, (_, i) => ({
    id: `exp-${i}`,
    shape: shapes[i % 3],
    color: palette.c,
    bin: null as number | null,
  }));
  return shuffle(items);
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"color" | "shape">("color");
  const [items, setItems] = useState<SortItem[]>(() => makeInitialItems("color"));
  const [selected, setSelected] = useState<string | null>(null);

  const switchMode = (m: "color" | "shape") => {
    setMode(m);
    setItems(makeInitialItems(m));
    setSelected(null);
  };

  const labels = mode === "color" ? ["Red", "Green"] : ["Circles", "Squares", "Triangles"];
  const tray = items.filter((it) => it.bin === null);
  const bins = labels.map((label, i) => ({ label, items: items.filter((it) => it.bin === i) }));

  const onItemClick = (id: string) => setSelected(id);
  const onBinClick = (binIndex: number) => {
    if (selected === null) return;
    setItems((prev) => prev.map((it) => (it.id === selected ? { ...it, bin: binIndex } : it)));
    setSelected(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Segmented
          label="Sort by"
          value={mode}
          onChange={(v) => switchMode(v as "color" | "shape")}
          options={[{ id: "color", label: "Color (2 groups)" }, { id: "shape", label: "Shape (3 groups)" }]}
        />
        <button
          className="btn ghost"
          onClick={() => {
            setItems(makeInitialItems(mode));
            setSelected(null);
          }}
        >
          Start over
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
      {(introActive || showCheck) && <ClassifyingCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">Click an item, then click the group it belongs in.</p>
      <SortedBins tray={tray} bins={bins} selectedId={selected} onItemClick={onItemClick} onBinClick={onBinClick} />
      <p className="feedback good" style={{ minHeight: 24 }}>
        {tray.length === 0 ? "Every item is sorted! Check the counts under each group." : `${tray.length} left to sort.`}
      </p>
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "sortObvious" | "sortHard" | "countCategory" | "compareCategories";
const BUCKETS: Bucket[] = ["sortObvious", "sortHard", "countCategory", "compareCategories"];
const SHAPE_LABELS = ["Circles", "Squares", "Triangles"];

function classifyingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[Math.floor(Math.random() * BUCKETS.length)];

  if (bucket === "sortObvious") {
    const countA = randInt(2, 5);
    const countB = randInt(2, 5);
    const { binA, binB } = makeColorItems(countA, countB);
    const fromBinA = Math.random() < 0.5;
    const target = fromBinA ? binA[0] : binB[0];
    return {
      title: "Which group does it belong in?",
      bucket,
      story: "These are sorted by COLOR. One item (circled) hasn't been placed in a group yet.",
      visual: () => (
        <SortedBins
          tray={[target]}
          bins={[
            { label: "Red", items: fromBinA ? binA.slice(1) : binA },
            { label: "Green", items: fromBinA ? binB : binB.slice(1) },
          ]}
          highlightId={target.id}
        />
      ),
      steps: [
        choice(
          { prompt: "The circled item belongs with which group?", hint: "Look at its color.", explain: `It's ${fromBinA ? "red" : "green"}, so it goes with the ${fromBinA ? "Red" : "Green"} group.` },
          fromBinA ? "Red" : "Green",
          [fromBinA ? "Green" : "Red"]
        ),
        choice({ prompt: "What attribute were these items sorted by?", hint: "Look at what's the same within each group.", explain: "These were sorted by color." }, "Color", ["Shape"]),
      ],
      wrapUp: `The circled item belongs with the ${fromBinA ? "Red" : "Green"} group.`,
    };
  }

  if (bucket === "sortHard") {
    const counts: [number, number, number] = [randInt(1, 4), randInt(1, 4), randInt(1, 4)];
    const groups = makeShapeItems(counts);
    const targetGroup = randInt(0, 2);
    const target = groups[targetGroup][0];
    const bins = groups.map((items, i) => ({ label: SHAPE_LABELS[i], items: i === targetGroup ? items.slice(1) : items }));
    const shapeWord = ["circle", "square", "triangle"][targetGroup];
    return {
      title: "Sort by shape — three groups",
      bucket,
      story: "These are sorted by SHAPE, into three groups this time. One item (circled) hasn't been placed yet.",
      visual: () => <SortedBins tray={[target]} bins={bins} highlightId={target.id} />,
      steps: [
        choice(
          { prompt: "Which group does the circled item belong in?", hint: "Look at its shape, not its color — everything here is the same color.", explain: `It's a ${shapeWord}, so it goes with ${SHAPE_LABELS[targetGroup]}.` },
          SHAPE_LABELS[targetGroup],
          [SHAPE_LABELS[(targetGroup + 1) % 3]]
        ),
        choice(
          {
            prompt: "True or false: when there are 3 or more groups, you still sort by only ONE attribute the whole time.",
            hint: "Even with more groups, the rule stays the same.",
            explain: "True — whether there are 2 groups or more, every item is sorted by the same single attribute.",
          },
          "True",
          ["False"]
        ),
      ],
      wrapUp: `The circled item belongs with ${SHAPE_LABELS[targetGroup]}.`,
    };
  }

  if (bucket === "countCategory") {
    const countA = randInt(3, 10);
    const countB = randInt(3, 10);
    const { binA, binB } = makeColorItems(countA, countB);
    return {
      title: "How many in each group?",
      bucket,
      story: "These are already sorted by color.",
      visual: () => <SortedBins bins={[{ label: "Red", items: binA }, { label: "Green", items: binB }]} />,
      steps: [
        { kind: "number", prompt: "How many are in the Red group?", hint: "Count each one in that group exactly once.", explain: `There are ${countA} in the Red group.`, answer: countA },
        { kind: "number", prompt: "How many are in the Green group?", hint: "Count each one in that group exactly once.", explain: `There are ${countB} in the Green group.`, answer: countB },
      ],
      wrapUp: `There are ${countA} in Red and ${countB} in Green.`,
    };
  }

  // compareCategories
  const countA = randInt(2, 10);
  let countB = randInt(2, 10);
  while (countB === countA) countB = randInt(2, 10);
  const { binA, binB } = makeColorItems(countA, countB);
  const more = countA > countB ? "Red" : "Green";
  const fewer = more === "Red" ? "Green" : "Red";
  const moreCount = Math.max(countA, countB);
  const fewerCount = Math.min(countA, countB);
  const diff = moreCount - fewerCount;
  return {
    title: "Which group has more?",
    bucket,
    story: "These are already sorted and counted by color.",
    visual: () => <SortedBins bins={[{ label: "Red", items: binA }, { label: "Green", items: binB }]} />,
    steps: [
      choice({ prompt: "Which group has MORE?", hint: "Count both groups, then compare.", explain: `Red has ${countA} and Green has ${countB}, so ${more} has more.` }, more, [fewer]),
      { kind: "number", prompt: `How many MORE does ${more} have than ${fewer}?`, hint: "Subtract the smaller count from the bigger count.", explain: `${moreCount} - ${fewerCount} = ${diff}.`, answer: diff },
    ],
    wrapUp: `${more} has ${diff} more than ${fewer}.`,
  };
}

export const classifyingAndCountingByCategory: Unit = {
  id: "classifyingAndCountingByCategory",
  title: "Classifying and Counting by Category",
  goal: "Sort a group of objects into categories, count how many are in each, and tell which category has more or fewer.",
  standard: "K.MD.3",
  keyIdea: (
    <>
      <p>Pick ONE attribute (like color or shape) and sort every object by that same attribute the whole time — never switch partway through.</p>
      <p>Once everything is sorted, count each group, then compare the counts to find which has more or fewer.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoning skill applied to whatever objects/categories are presented,
  // not a fixed fact set.
  problems: [{ label: "Sorting & Counting", make: classifyingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: classifyingTest,
};
