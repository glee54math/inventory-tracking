import { LengthBars, type LengthItem } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Comparing and Ordering Length ----------
// 10 single-question generators, self-contained (not imported from
// ComparingOrderingLength.tsx) the same way every other *Test.tsx file in
// this app is independent of its unit's Explore/Practice source. Exported
// individually so MeasurementTimeAndDataLab's ModuleTest.tsx can draw a
// cumulative sample from this unit's own question shapes.

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

const pickThree = () => shuffle(OBJECTS).slice(0, 3);

/** Aligned ordering: pick the shortest or the longest from three objects
 *  lined up at the same start. */
export const alignedOrderQuestion = (ask: "shortest" | "longest", difficulty: "easy" | "medium"): TestQuestion[] => {
  const objs = pickThree();
  const lengths = shuffle([randInt(3, 5), randInt(6, 8), randInt(9, 11)]);
  const items: LengthItem[] = objs.map((o, i) => ({ id: o.name, label: `${o.glyph} ${o.name}`, length: lengths[i], tone: (["a", "b", "c"] as const)[i] }));
  const sorted = [...items].sort((x, y) => x.length - y.length);
  const target = ask === "shortest" ? sorted[0] : sorted[2];
  const others = items.filter((it) => it.id !== target.id).map((it) => it.label);
  return [
    {
      visual: <LengthBars items={items} />,
      difficulty,
      step: choice(
        { prompt: `Which one is the ${ask.toUpperCase()}?`, hint: "All three start at the same place — compare how far each one stretches.", explain: `${target.label} is the ${ask}.` },
        target.label,
        others
      ),
    },
  ];
};

/** The misaligned-start trap: the shortest object's far edge sticks out
 *  past the longest object's far edge. */
export const misalignedOrderQuestion = (ask: "shortest" | "longest"): TestQuestion[] => {
  const objs = pickThree();
  const shortLen = randInt(3, 5);
  const longLen = randInt(9, 11);
  const midLen = randInt(6, 8);
  const [longObj, midObj, shortObj] = objs;
  const longStart = 0;
  const shortStart = longStart + longLen + randInt(1, 3) - shortLen;
  const midStart = randInt(0, 2);
  const items: LengthItem[] = shuffle([
    { id: longObj.name, label: `${longObj.glyph} ${longObj.name}`, length: longLen, start: longStart, tone: "a" as const },
    { id: midObj.name, label: `${midObj.glyph} ${midObj.name}`, length: midLen, start: midStart, tone: "b" as const },
    { id: shortObj.name, label: `${shortObj.glyph} ${shortObj.name}`, length: shortLen, start: shortStart, tone: "c" as const },
  ]);
  const longLabel = `${longObj.glyph} ${longObj.name}`;
  const shortLabel = `${shortObj.glyph} ${shortObj.name}`;
  const midLabel = `${midObj.glyph} ${midObj.name}`;
  const target = ask === "shortest" ? shortLabel : longLabel;
  const others = [longLabel, midLabel, shortLabel].filter((l) => l !== target);
  return [
    {
      visual: <LengthBars items={items} />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `These three do NOT start at the same place. Which one is the ${ask.toUpperCase()}?`,
          hint: "Don't just look at which bar reaches furthest right — check where each one starts, too.",
          explain: `${target} is the ${ask}, even though that's not just "whichever bar's edge is furthest right or left."`,
        },
        target,
        others
      ),
    },
  ];
};

/** Indirect/transitive comparison — A and B are never shown together. */
export const indirectComparisonQuestion = (counterToGlance: boolean): TestQuestion[] => {
  const objs = pickThree();
  const [a, c, b] = objs;
  const aLen = randInt(9, 12);
  const cLen = randInt(5, 8);
  const bLen = randInt(2, 4);
  const aLabel = `${a.glyph} ${a.name}`;
  const cLabel = `${c.glyph} ${c.name}`;
  const bLabel = `${b.glyph} ${b.name}`;
  const row1Max = Math.max(aLen, cLen);
  const row2Max = Math.max(cLen, bLen);
  const targetPx = 190;
  const row1UnitPx = counterToGlance ? targetPx / row1Max : 20;
  const row2UnitPx = counterToGlance ? targetPx / row2Max : 20;
  const row1: LengthItem[] = [
    { id: a.name, label: aLabel, length: aLen, tone: "a" },
    { id: c.name, label: cLabel, length: cLen, tone: "c" },
  ];
  const row2: LengthItem[] = [
    { id: c.name, label: cLabel, length: cLen, tone: "c" },
    { id: b.name, label: bLabel, length: bLen, tone: "b" },
  ];
  return [
    {
      visual: (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <LengthBars items={row1} unitPx={row1UnitPx} />
          <LengthBars items={row2} unitPx={row2UnitPx} />
        </div>
      ),
      difficulty: counterToGlance ? "hard" : "medium",
      step: choice(
        {
          prompt: `${aLabel} and ${bLabel} are never shown next to each other. Based on the two pictures, is ${aLabel} longer or shorter than ${bLabel}?`,
          hint: `${aLabel} beats ${cLabel}, and ${cLabel} beats ${bLabel} — chain the two facts together instead of comparing the two pictures by eye.`,
          explain: `${aLabel} > ${cLabel} and ${cLabel} > ${bLabel}, so ${aLabel} > ${bLabel}.`,
        },
        `${aLabel} is longer than ${bLabel}`,
        [`${aLabel} is shorter than ${bLabel}`, "Can't tell — they were never shown together"]
      ),
    },
  ];
};

export const comparingOrderingLengthTest: Unit["test"] = {
  questions: [
    () => alignedOrderQuestion("shortest", "easy"),
    () => alignedOrderQuestion("longest", "easy"),
    () => alignedOrderQuestion("shortest", "medium"),
    () => alignedOrderQuestion("longest", "medium"),
    () => misalignedOrderQuestion("shortest"),
    () => misalignedOrderQuestion("longest"),
    () => misalignedOrderQuestion("shortest"),
    () => indirectComparisonQuestion(false),
    () => indirectComparisonQuestion(true),
    () => indirectComparisonQuestion(true),
  ],
  passScore: 9,
};
