import { useState } from "react";
import { SortedBins, binCountAlongMs, type BinItem, type ItemShape } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { itemColors, palette } from "../../../shared/lib/palette";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { classifyingTest } from "./ClassifyingAndCountingByCategoryTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

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

/** "1, 2, 3, 4" — every number from 1 to `n`. */
const countUp = (n: number) => Array.from({ length: n }, (_, i) => i + 1).join(", ");

/** Step 1 of a sort problem is "where does the circled item go?" — once it's
 *  answered (or its "Show me" is open), draw the item moved into its group. */
const placed = (done: number, help?: { step: number; showMe: boolean }) => done >= 1 || (!!help?.showMe && help.step === 0);

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: sort by one attribute (color) and keep to it, even when a
// shape tempts you; count each group; which group has fewer; sort by shape.

// Fixed ids, so the pictures stay put between renders.
const cfuItems = (prefix: string, n: number, shape: ItemShape, color: string): BinItem[] =>
  Array.from({ length: n }, (_, i) => ({ id: `cfu-${prefix}-${i}`, shape, color }));
const CFU_RED = [...cfuItems("rc", 1, "circle", itemColors.red.main), ...cfuItems("rs", 1, "square", itemColors.red.main)];
const CFU_YELLOW = cfuItems("yc", 2, "circle", itemColors.yellow.main);
const CFU_TRAY: BinItem = { id: "cfu-ys", shape: "square", color: itemColors.yellow.main };
const CFU_COUNT_RED = cfuItems("cr", 6, "circle", itemColors.red.main);
const CFU_COUNT_GREEN = cfuItems("cg", 4, "circle", itemColors.green.main);
const CFU_CIRCLES = [...cfuItems("sc1", 1, "circle", itemColors.green.main), ...cfuItems("sc2", 1, "circle", itemColors.yellow.main)];
const CFU_SQUARES = [...cfuItems("ss1", 1, "square", itemColors.red.main), ...cfuItems("ss2", 1, "square", itemColors.green.main)];
const CFU_TRAY2: BinItem = { id: "cfu-rc2", shape: "circle", color: itemColors.red.main };

function ClassifyingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const byColor = (placed: boolean) => (
    <SortedBins
      bins={[
        { label: "Red", items: CFU_RED },
        { label: "Yellow", items: placed ? [...CFU_YELLOW, CFU_TRAY] : CFU_YELLOW },
      ]}
      tray={placed ? undefined : [CFU_TRAY]}
      highlightId={CFU_TRAY.id}
    />
  );
  const counted = (countAlongBin?: number, extra?: { bin: number; from: number }) => (
    <SortedBins
      bins={[
        { label: "Red", items: CFU_COUNT_RED, hideCount: true },
        { label: "Green", items: CFU_COUNT_GREEN, hideCount: true },
      ]}
      countAlongBin={countAlongBin}
      extra={extra}
    />
  );
  const byShape = (placed: boolean) => (
    <SortedBins
      bins={[
        { label: "Circles", items: placed ? [...CFU_CIRCLES, CFU_TRAY2] : CFU_CIRCLES },
        { label: "Squares", items: CFU_SQUARES },
      ]}
      tray={placed ? undefined : [CFU_TRAY2]}
      highlightId={CFU_TRAY2.id}
    />
  );
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="We sort by color. Where does the yellow square go?"
            picture={byColor(false)}
            showPicture={byColor(true)}
            showText="We sort by color. It is yellow, so it goes with yellow."
            options={[
              { id: "red", label: "Red group" },
              { id: "yellow", label: "Yellow group" },
            ]}
            answer="yellow"
            why={{ red: "We sort by color, not shape. What color is it?" }}
            praise="Yes! It is yellow, so it goes with yellow."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many are in the Red group?"
            answer={6}
            tone="a"
            picture={(m) => counted(m === "show" ? 0 : undefined)}
            nudge="Count each red one once."
            showText="Watch and listen: 1, 2, 3, 4, 5, 6."
            praise="Yes! Red has 6."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many are in the Green group?"
            answer={4}
            tone="b"
            picture={(m) => counted(m === "show" ? 1 : undefined)}
            nudge="Count each green one once."
            showText="Watch and listen: 1, 2, 3, 4."
            praise="Yes! Green has 4."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={3}
            prompt="Which group has FEWER?"
            picture={counted()}
            showPicture={counted(undefined, { bin: 0, from: 4 })}
            showText="Look: Red has 2 extra. Green runs out first, so Green has fewer."
            options={[
              { id: "Red", label: "Red" },
              { id: "Green", label: "Green" },
            ]}
            answer="Green"
            why={{ Red: "Red has 6. Green has 4. Which is less?" }}
            praise="Yes! Green has fewer."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="Now we sort by shape. Where does the red circle go?"
            picture={byShape(false)}
            showPicture={byShape(true)}
            showText="We sort by shape now. It is a circle, so it goes with the circles."
            options={[
              { id: "circles", label: "Circles" },
              { id: "squares", label: "Squares" },
            ]}
            answer="circles"
            why={{ squares: "We sort by shape now. Is it a square?" }}
            praise="Yes! It is a circle."
            onComplete={done}
          />
        ),
      ]}
    />
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
      <div className="control-row" data-readaloud-part>
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

      <ReadAloud as="p" className="muted small">Click an item, then click the group it belongs in.</ReadAloud>
      <SortedBins tray={tray} bins={bins} selectedId={selected} onItemClick={onItemClick} onBinClick={onBinClick} />
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        {tray.length === 0 ? "Every item is sorted! Check the counts under each group." : `${tray.length} left to sort.`}
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <ClassifyingCheckForUnderstanding onComplete={onIntroDone} />}
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
      visual: (done, help) => {
        const moved = placed(done, help);
        const restA = fromBinA ? binA.slice(1) : binA;
        const restB = fromBinA ? binB : binB.slice(1);
        return (
          <SortedBins
            tray={moved ? [] : [target]}
            bins={[
              { label: "Red", items: moved && fromBinA ? [...restA, target] : restA },
              { label: "Green", items: moved && !fromBinA ? [...restB, target] : restB },
            ]}
            highlightId={target.id}
          />
        );
      },
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
      visual: (done, help) => {
        const moved = placed(done, help);
        const shown = moved ? bins.map((b, i) => (i === targetGroup ? { ...b, items: [...b.items, target] } : b)) : bins;
        return <SortedBins tray={moved ? [] : [target]} bins={shown} highlightId={target.id} />;
      },
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
      // Each group's "(n)" stays hidden until its own step is answered, and
      // each step's "Show me" counts that group's items one by one.
      visual: (done, help) => {
        const counting = help?.showMe ? help.step : undefined;
        return (
          <SortedBins
            bins={[
              { label: "Red", items: binA, hideCount: done < 1 || counting === 0 },
              { label: "Green", items: binB, hideCount: done < 2 || counting === 1 },
            ]}
            countAlongBin={counting}
          />
        );
      },
      steps: [
        {
          kind: "number",
          showMeHoldMs: binCountAlongMs(countA),
          prompt: "How many are in the Red group?",
          hint: "Count each one in that group exactly once.",
          showMe: `Let's count the Red group together: ${countUp(countA)}.`,
          explain: `There are ${countA} in the Red group.`,
          answer: countA,
        },
        {
          kind: "number",
          showMeHoldMs: binCountAlongMs(countB),
          prompt: "How many are in the Green group?",
          hint: "Count each one in that group exactly once.",
          showMe: `Let's count the Green group together: ${countUp(countB)}.`,
          explain: `There are ${countB} in the Green group.`,
          answer: countB,
        },
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
    visual: (_done, help) => (
      <SortedBins
        bins={[{ label: "Red", items: binA }, { label: "Green", items: binB }]}
        // Step 2's "Show me": ring and number the extras in the bigger group —
        // the ones with no partner across from them in the other group.
        extra={help?.showMe && help.step === 1 ? { bin: more === "Red" ? 0 : 1, from: fewerCount } : undefined}
      />
    ),
    steps: [
      choice({ prompt: "Which group has MORE?", hint: "Count both groups, then compare.", explain: `Red has ${countA} and Green has ${countB}, so ${more} has more.` }, more, [fewer]),
      { kind: "number", prompt: `How many MORE does ${more} have than ${fewer}?`, hint: "Subtract the smaller count from the bigger count.", showMe: `Match each ${fewer} one with a ${more} one. Count the ${more} ones left over: ${countUp(diff)}.`, explain: `${moreCount} - ${fewerCount} = ${diff}.`, answer: diff },
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
