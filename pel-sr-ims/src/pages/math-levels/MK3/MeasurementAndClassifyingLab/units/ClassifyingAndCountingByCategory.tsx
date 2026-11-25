import { useState } from "react";
import { SortedBins, binCountAlongMs, type BinItem, type ItemShape } from "../diagrams";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { itemColors } from "../../../shared/lib/palette";
import { choice, pointing, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { classifyingTest } from "./ClassifyingAndCountingByCategoryTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";
import { SHAPE_GROUPS, SHAPE_OF, bin, compareKind, countExtrasLine, countKind, countLine, countUp, groupChoice, groupHas, groupLabel, groupPhrase, groupsFor, itemIn, makeGroups, mixOtherAttribute, mixedShapeSet, shapeWord, threeCounts, type SortRule } from "./labParts";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

// K-1 design, one question at a time, 2 of 5 typed. Items have both a color
// and a shape, so the other attribute really competes. A prompt says "this
// one" with a ring and an arrow, never the item's own color or shape. Each
// pick's twin has the other right answer (C2-38).

const LOOK = {
  color: { target: "u3-color", label: "Explore: sort by color", say: "Look here. Look at the color." },
  shape: { target: "u3-shape", label: "Explore: sort by shape", say: "Look here. Look at the shape." },
  count: { target: "u3-count", label: "Explore: count each group", say: "Look here. Count each one once." },
  fewer: { target: "u3-compare", label: "Explore: match them up", say: "Look here. Match them up." },
};

// Fixed ids, so the pictures stay put between renders.
const cfuItems = (prefix: string, n: number, shape: ItemShape, color: string): BinItem[] =>
  Array.from({ length: n }, (_, i) => ({ id: `cfu-${prefix}-${i}`, shape, color }));
const { red, green, yellow } = { red: itemColors.red.main, green: itemColors.green.main, yellow: itemColors.yellow.main };

const CFU_RED = [...cfuItems("rc", 1, "circle", red), ...cfuItems("rs", 1, "square", red)];
const CFU_YELLOW = [...cfuItems("yc", 1, "circle", yellow), ...cfuItems("yt", 1, "triangle", yellow)];
const CFU_TRAY: BinItem = { id: "cfu-ys", shape: "square", color: yellow };
const CFU_TRAY_TWIN: BinItem = { id: "cfu-rt2", shape: "triangle", color: red };
const mixed = (prefix: string, n: number, color: string) =>
  Array.from({ length: n }, (_, i): BinItem => ({ id: `cfu-${prefix}-${i}`, shape: (["circle", "square", "triangle"] as ItemShape[])[i % 3], color }));
const CFU_COUNT_RED = mixed("cr", 6, red);
const CFU_COUNT_GREEN = mixed("cg", 4, green);
const CFU_TWIN_RED = mixed("tr", 2, red);
const CFU_TWIN_GREEN = mixed("tg", 5, green);
const CFU_CIRCLES = [...cfuItems("sc1", 1, "circle", green), ...cfuItems("sc2", 1, "circle", yellow)];
const CFU_SQUARES = [...cfuItems("ss1", 1, "square", red), ...cfuItems("ss2", 1, "square", green)];
const CFU_TRAY2: BinItem = { id: "cfu-rc2", shape: "circle", color: red };
const CFU_TRAY2_TWIN: BinItem = { id: "cfu-gs2", shape: "square", color: yellow };

const option = (name: string, id = name.toLowerCase()) => ({ id, label: groupLabel(name) });

function ClassifyingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const byColor = (item: BinItem, placed: boolean) => (
    <SortedBins
      bins={[bin("Red", placed && item.color === red ? [...CFU_RED, item] : CFU_RED), bin("Yellow", placed && item.color === yellow ? [...CFU_YELLOW, item] : CFU_YELLOW)]}
      tray={placed ? undefined : [item]}
      highlightId={item.id}
    />
  );
  const counted = (r: BinItem[], g: BinItem[], countAlongBin?: number, extra?: { bin: number; from: number }) => (
    <SortedBins bins={[bin("Red", r), bin("Green", g)]} countAlongBin={countAlongBin} extra={extra} />
  );
  const byShape = (item: BinItem, placed: boolean) => (
    <SortedBins
      bins={[bin("Circles", placed && item.shape === "circle" ? [...CFU_CIRCLES, item] : CFU_CIRCLES), bin("Squares", placed && item.shape === "square" ? [...CFU_SQUARES, item] : CFU_SQUARES)]}
      tray={placed ? undefined : [item]}
      highlightId={item.id}
    />
  );
  const colorOptions = [option("Red"), option("Yellow")];
  const shapeOptions = [option("Circles"), option("Squares")];
  const fewerOptions = [option("Red"), option("Green")];
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="We sort by color. Where does this one go? Red or yellow?"
            picture={byColor(CFU_TRAY, false)}
            showPicture={byColor(CFU_TRAY, true)}
            showText="We sort by color. It goes with yellow."
            options={colorOptions}
            answer="yellow"
            why={{ red: "We sort by color. Look at its color." }}
            praise="Yes! It goes with yellow."
            look={LOOK.color}
            twin={{
              prompt: "Try this one. We sort by color. Red or yellow?",
              picture: byColor(CFU_TRAY_TWIN, false),
              showPicture: byColor(CFU_TRAY_TWIN, true),
              options: colorOptions,
              answer: "red",
              why: { yellow: "We sort by color. Look at its color." },
              showText: "We sort by color. It goes with red.",
              praise: "Yes! It goes with red.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <div className="mk3-red">
            <TypeCheck
              n={2}
              prompt="How many are in the Red group?"
              answer={6}
              tone="a"
              picture={(m) => counted(CFU_COUNT_RED, CFU_COUNT_GREEN, m === "show" ? 0 : undefined)}
              nudge="Count each red one once."
              showText="Watch and listen: 1, 2, 3, 4, 5, 6."
              praise="Yes! Red has 6."
              look={LOOK.count}
              onComplete={done}
            />
          </div>
        ),
        (done) => (
          <div className="mk3-green">
            <TypeCheck
              n={3}
              prompt="How many are in the Green group?"
              answer={4}
              tone="a"
              picture={(m) => counted(CFU_COUNT_RED, CFU_COUNT_GREEN, m === "show" ? 1 : undefined)}
              nudge="Count each green one once."
              showText="Watch and listen: 1, 2, 3, 4."
              praise="Yes! Green has 4."
              look={LOOK.count}
              onComplete={done}
            />
          </div>
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt={<>Which group has <b>fewer</b>? Red or green?</>}
            picture={counted(CFU_COUNT_RED, CFU_COUNT_GREEN)}
            showPicture={counted(CFU_COUNT_RED, CFU_COUNT_GREEN, undefined, { bin: 0, from: 4 })}
            showText="Look: Red has extras. Green stops first. Green has fewer."
            options={fewerOptions}
            answer="green"
            why={{ red: "Match them up." }}
            praise="Yes! Green has fewer."
            look={LOOK.fewer}
            twin={{
              prompt: <>Now which group has <b>fewer</b>? Red or green?</>,
              picture: counted(CFU_TWIN_RED, CFU_TWIN_GREEN),
              showPicture: counted(CFU_TWIN_RED, CFU_TWIN_GREEN, undefined, { bin: 1, from: 2 }),
              options: fewerOptions,
              answer: "red",
              why: { green: "Match them up." },
              showText: "Look: Green has extras. Red stops first. Red has fewer.",
              praise: "Yes! Red has fewer.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={5}
            prompt="Now we sort by shape. Where does this one go? Circles or squares?"
            picture={byShape(CFU_TRAY2, false)}
            showPicture={byShape(CFU_TRAY2, true)}
            showText="We sort by shape now. It goes with the circles."
            options={shapeOptions}
            answer="circles"
            why={{ squares: "We sort by shape now. Look at its shape." }}
            praise="Yes! It goes with the circles."
            look={LOOK.shape}
            twin={{
              prompt: "Try this one. We sort by shape. Circles or squares?",
              picture: byShape(CFU_TRAY2_TWIN, false),
              showPicture: byShape(CFU_TRAY2_TWIN, true),
              options: shapeOptions,
              answer: "squares",
              why: { circles: "We sort by shape now. Look at its shape." },
              showText: "We sort by shape now. It goes with the squares.",
              praise: "Yes! It goes with the squares.",
            }}
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
  /** The group this item really belongs in, under the current rule. */
  home: number;
}

// Mixed colors AND shapes, so the other attribute really competes. The group
// sizes (5 and 3; 2, 4 and 3) stay off the CFU's counts of 6 and 4.
function makeInitialItems(mode: SortRule): SortItem[] {
  const shapes: ItemShape[] = ["circle", "square", "triangle"];
  if (mode === "color") {
    const colors = [red, red, red, red, red, green, green, green];
    return shuffle(colors.map((color, i) => ({ id: `exp-${i}`, shape: shapes[i % 3], color, bin: null, home: color === red ? 0 : 1 })));
  }
  const homes = [0, 0, 1, 1, 1, 1, 2, 2, 2];
  const colors = [red, green, yellow];
  return shuffle(homes.map((home, i) => ({ id: `exp-${i}`, shape: shapes[home], color: colors[i % 3], bin: null, home })));
}

const fixedItems = (prefix: string, n: number, shape: ItemShape, color: string) => Array.from({ length: n }, (_, i): BinItem => ({ id: `exp-${prefix}-${i}`, shape, color }));
// Yellow has fewer here: neither of the CFU's "fewer" answers (green, then red).
const COMPARE_RED = fixedItems("cr", 5, "square", red);
const COMPARE_YELLOW = fixedItems("cy", 3, "circle", yellow);
const FEWEST_BINS = [bin("Circles", fixedItems("fc", 2, "circle", green)), bin("Squares", fixedItems("fs", 5, "square", yellow)), bin("Triangles", fixedItems("ft", 3, "triangle", red))];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<SortRule>("color");
  const [items, setItems] = useState<SortItem[]>(() => makeInitialItems("color"));
  const [selected, setSelected] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);

  const switchMode = (m: SortRule) => {
    setMode(m);
    setItems(makeInitialItems(m));
    setSelected(null);
    setNudge(false);
  };
  useLookHereRequest((id) => {
    if (id === "u3-color" && mode !== "color") switchMode("color");
    if (id === "u3-shape" && mode !== "shape") switchMode("shape");
  });

  const labels = mode === "color" ? ["Red", "Green"] : ["Circles", "Squares", "Triangles"];
  const tray = items.filter((it) => it.bin === null);
  const sorted = tray.length === 0;
  // The counts appear only once everything is really sorted.
  const bins = labels.map((label, i) => ({ label, items: items.filter((it) => it.bin === i), hideCount: !sorted, icon: SHAPE_OF[label] }));

  const onItemClick = (id: string) => {
    setSelected(id);
    setNudge(false);
  };
  const onBinClick = (binIndex: number) => {
    if (selected === null) return;
    const item = items.find((it) => it.id === selected);
    setSelected(null);
    if (!item) return;
    // A wrong group sends the item back to the tray with a nudge.
    if (item.home !== binIndex) {
      setNudge(true);
      return;
    }
    setNudge(false);
    setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, bin: binIndex } : it)));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented
          label="Sort by"
          value={mode}
          onChange={(v) => switchMode(v as SortRule)}
          options={[{ id: "color", label: "Color" }, { id: "shape", label: "Shape" }]}
        />
        <button
          className="btn ghost"
          onClick={() => {
            setItems(makeInitialItems(mode));
            setSelected(null);
            setNudge(false);
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

      <div {...lookHereSpot(mode === "color" ? "u3-color" : "u3-shape")} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <ReadAloud as="p" className="muted small">
          <span data-look-here-key>{mode === "color" ? "We sort by color." : "We sort by shape."}</span> Tap one. Then tap its group.
        </ReadAloud>
        <SortedBins tray={tray} bins={bins} selectedId={selected} onItemClick={onItemClick} onBinClick={onBinClick} />
      </div>
      {nudge ? (
        <ReadAloud as="p" className="feedback bad" role="alert" style={{ minHeight: 24 }}>
          {mode === "color" ? "Look at its color." : "Look at its shape."}
        </ReadAloud>
      ) : (
        <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }} {...lookHereSpot("u3-count")}>
          <span data-look-here-key>{sorted ? "All sorted! Count each group." : `Sort ${tray.length} more. Then count each one once.`}</span>
        </ReadAloud>
      )}

      <div {...lookHereSpot("u3-compare")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">
          <span data-look-here-key>Match them up. Red has extras. Yellow has fewer.</span>
        </ReadAloud>
        <SortedBins bins={[bin("Red", COMPARE_RED), bin("Yellow", COMPARE_YELLOW)]} extra={{ bin: 0, from: 3 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ReadAloud as="p" className="muted small">Three groups. The circles have the <b>fewest</b>. The squares have the <b>most</b>.</ReadAloud>
        <SortedBins bins={FEWEST_BINS} />
      </div>
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

const showing = (help: VisualHelp | undefined, step: number) => !!help?.showMe && help.step === step;

const countStep = (group: string, n: number, hint = "Count each one once.") => ({
  kind: "number" as const,
  showMeHoldMs: binCountAlongMs(n),
  prompt: `How many are in the ${group} group?`,
  hint,
  showMe: `Count with me: ${countUp(n)}.`,
  explain: countLine(group, n),
  answer: n,
});

/** One typed count of a shape in a mixed set. */
const shapeCountStep = (group: string, n: number) => ({
  kind: "number" as const,
  showMeHoldMs: binCountAlongMs(n),
  prompt: <>How many {shapeWord(group, "?")}</>,
  hint: `Find the ${group.toLowerCase()}. Count each one once.`,
  showMe: `Count with me: ${countUp(n)}.`,
  explain: countLine(group, n),
  answer: n,
});

function classifyingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);

  if (bucket === "sortObvious") {
    // Two groups. The rule varies and the story never names it.
    const rule: SortRule = Math.random() < 0.5 ? "color" : "shape";
    const names = shuffle(groupsFor(rule)).slice(0, 2);
    const groups = makeGroups(names, [randInt(2, 5), randInt(2, 5)]);
    mixOtherAttribute(groups, rule);
    const home = randInt(0, 1);
    const target = itemIn(names[home]);
    const after = groups[home].length + 1;
    return {
      title: "Sort",
      bucket,
      story: "Look at the groups.",
      visual: (done, help) => {
        // With two buttons, one wrong tap leaves one choice, so its demo plays now.
        const moved = done >= 1 || pointing(help, 0);
        return (
          <SortedBins
            tray={moved ? undefined : [target]}
            bins={names.map((n, i) => bin(n, moved && i === home ? [...groups[i], target] : groups[i]))}
            highlightId={target.id}
            countAlongBin={showing(help, 2) ? home : undefined}
            extra={pointing(help, 1) ? { bin: home, from: 0, numbered: false } : undefined}
            outlineBin={pointing(help, 2) ? home : undefined}
          />
        );
      },
      steps: [
        groupChoice({ prompt: "Where does this one go?", hint: "What is the same in each group?", explain: `It goes with ${groupPhrase(names[home])}.` }, names, names[home]),
        choice({ prompt: "How did we sort? Color or shape?", hint: "What is the same in this group?", explain: `We sorted by ${rule}.` }, rule === "color" ? "Color" : "Shape", [rule === "color" ? "Shape" : "Color"]),
        countStep(names[home], after),
      ],
      wrapUp: `It goes with ${groupPhrase(names[home])}.`,
    };
  }

  if (bucket === "sortHard") {
    // Three groups, two items, one rule: the other attribute tempts each time.
    const rule: SortRule = Math.random() < 0.5 ? "color" : "shape";
    const names = groupsFor(rule);
    const groups = makeGroups(names, [randInt(1, 4), randInt(1, 4), randInt(1, 4)]);
    const homeA = randInt(0, 2);
    const homeB = (homeA + randInt(1, 2)) % 3;
    const itemA = itemIn(names[homeA]);
    const itemB = itemIn(names[homeB]);
    const ruleLine = rule === "color" ? "We sort by color." : "We sort by shape.";
    const lookLine = rule === "color" ? "Look at its color." : "Look at its shape.";
    const askGroup = randInt(0, 2);
    const finalCount = groups[askGroup].length + (homeA === askGroup ? 1 : 0) + (homeB === askGroup ? 1 : 0);
    return {
      title: "Three Groups",
      bucket,
      story: ruleLine,
      visual: (done, help) => {
        // Show me draws its step as done: keep THAT item ringed as it moves to
        // its group, with the next item still hidden (C2-40).
        const showA = showing(help, 0);
        const showB = showing(help, 1);
        const placedA = done >= 1;
        const placedB = done >= 2;
        const tray = showA || placedB ? undefined : placedA ? [itemB] : [itemA];
        const shown = names.map((n, i) => bin(n, [...groups[i], ...(placedA && i === homeA ? [itemA] : []), ...(placedB && i === homeB ? [itemB] : [])]));
        const ringed = showA || !placedA ? itemA.id : showB || !placedB ? itemB.id : undefined;
        return <SortedBins tray={tray} bins={shown} highlightId={ringed} arriveId={showA ? itemA.id : showB ? itemB.id : undefined} countAlongBin={showing(help, 2) ? askGroup : undefined} outlineBin={pointing(help, 2) ? askGroup : undefined} />;
      },
      steps: [
        groupChoice({ prompt: "Where does this one go?", hint: lookLine, explain: `It goes with ${groupPhrase(names[homeA])}.` }, names, names[homeA]),
        groupChoice({ prompt: "Where does this new one go?", hint: lookLine, explain: `It goes with ${groupPhrase(names[homeB])}.` }, names, names[homeB]),
        countStep(names[askGroup], finalCount),
      ],
      wrapUp: "You sorted the same way.",
    };
  }

  if (bucket === "countCategory") {
    if (countKind() === "mixed") {
      // A mixed set: count by shape while the colors tempt. The Test asks this too (C2-42).
      const { items, groups } = mixedShapeSet();
      const [askA, askB] = shuffle([0, 1, 2]);
      const asks = [askA, askB];
      return {
        title: "Count",
        bucket,
        story: "We sort by shape.",
        // After a wrong try the set sorts itself, with the asked group outlined.
        visual: (done, help) =>
          (help && pointing(help, help.step)) || done >= 2 ? (
            <SortedBins
              bins={SHAPE_GROUPS.map((n, i) => bin(n, groups[i]))}
              outlineBin={help ? asks[help.step] : undefined}
              countAlongBin={help?.showMe ? asks[help.step] : undefined}
            />
          ) : (
            <SortedBins tray={items} bins={[]} />
          ),
        steps: asks.map((g) => shapeCountStep(SHAPE_GROUPS[g], groups[g].length)),
        wrapUp: "We sorted by shape. You counted.",
      };
    }
    const names = shuffle(["Red", "Green", "Yellow"]).slice(0, 2);
    const countA = randInt(3, 10);
    const countB = randInt(3, 10);
    const groups = makeGroups(names, [countA, countB]);
    return {
      title: "Count",
      bucket,
      story: "We sort by color.",
      // Each step's "Show me" counts that group's items one by one.
      visual: (_done, help) => <SortedBins bins={[bin(names[0], groups[0]), bin(names[1], groups[1])]} countAlongBin={help?.showMe ? help.step : undefined} outlineBin={help && pointing(help, help.step) ? help.step : undefined} />,
      steps: [countStep(names[0], countA), countStep(names[1], countB)],
      wrapUp: `${names[0]} has ${countA}. ${names[1]} has ${countB}.`,
    };
  }

  // compareCategories: two groups (extras), or three groups (fewest and most).
  if (compareKind() === "three") {
    const [c0, c1, c2] = threeCounts();
    const rule: SortRule = Math.random() < 0.5 ? "color" : "shape";
    const names = groupsFor(rule);
    const counts = [c0, c1, c2];
    const groups = makeGroups(names, counts);
    const fewIdx = counts.indexOf(Math.min(...counts));
    const mostIdx = counts.indexOf(Math.max(...counts));
    return {
      title: "Most and Fewest",
      bucket,
      story: "Here are three groups.",
      visual: (_done, help) => {
        const ringed = showing(help, 0) ? fewIdx : showing(help, 2) ? mostIdx : undefined;
        return <SortedBins bins={names.map((n, i) => bin(n, groups[i]))} countAlongBin={showing(help, 1) ? fewIdx : undefined} extra={ringed !== undefined ? { bin: ringed, from: 0, numbered: false } : undefined} outlineBin={pointing(help, 1) ? fewIdx : undefined} />;
      },
      steps: [
        groupChoice({ prompt: <>Which group has the <b>fewest</b>?</>, hint: "Count each group. Which has the fewest?", explain: groupHas(names[fewIdx], "the fewest.") }, names, names[fewIdx]),
        countStep(names[fewIdx], counts[fewIdx]),
        groupChoice({ prompt: <>Which group has the <b>most</b>?</>, hint: "Count each group. Which has the most?", explain: groupHas(names[mostIdx], "the most.") }, names, names[mostIdx]),
      ],
      wrapUp: `${groupHas(names[fewIdx], "the fewest.")} ${groupHas(names[mostIdx], "the most.")}`,
    };
  }

  const names = shuffle(["Red", "Green", "Yellow"]).slice(0, 2);
  const countA = randInt(2, 10);
  let countB = randInt(2, 10);
  while (countB === countA) countB = randInt(2, 10);
  const groups = makeGroups(names, [countA, countB]);
  const moreIdx = countA > countB ? 0 : 1;
  const more = names[moreIdx];
  const fewer = names[1 - moreIdx];
  const fewerCount = Math.min(countA, countB);
  const diff = Math.abs(countA - countB);
  return {
    title: "More or Fewer",
    bucket,
    story: "Here are two groups.",
    visual: (done, help) => {
      // Review D3: the extras are ringed for the "how many extra" step, numbered only in Show me.
      const at = help?.step ?? done;
      return (
        <SortedBins
          bins={[bin(names[0], groups[0]), bin(names[1], groups[1])]}
          extra={at >= 1 || pointing(help, 0) ? { bin: moreIdx, from: fewerCount, numbered: showing(help, 1) || done >= 2 } : undefined}
        />
      );
    },
    steps: [
      groupChoice({ prompt: <>Which group has <b>more</b>?</>, hint: "Match them up. Which has extras?", explain: `${more} has more.` }, names, more),
      {
        kind: "number",
        prompt: `How many extra does ${more} have?`,
        hint: "Match them up. Count the extras.",
        showMe: `Match each ${fewer} one with a ${more} one. ${countExtrasLine(diff)}`,
        showMeHoldMs: binCountAlongMs(diff),
        explain: `${diff} extra.`,
        answer: diff,
      },
    ],
    wrapUp: `${more} has ${diff} extra.`,
  };
}

export const classifyingAndCountingByCategory: Unit = {
  id: "classifyingAndCountingByCategory",
  title: "Sort and Count",
  goal: "Sort them. Count each group. Which has more?",
  standard: "K.MD.3",
  keyIdea: (
    <>
      <p>Sort by color. Or sort by shape.</p>
      <p>Keep sorting the same way.</p>
      <p>Count each group.</p>
      <p>Which has more?</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoning skill applied to whatever objects/categories are presented,
  // not a fixed fact set.
  problems: [{ label: "Sort and Count", make: classifyingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: classifyingTest,
};
