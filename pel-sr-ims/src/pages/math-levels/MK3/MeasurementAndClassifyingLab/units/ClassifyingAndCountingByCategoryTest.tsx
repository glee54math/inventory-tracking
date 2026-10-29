import { SortedBins, type BinItem, type ItemShape } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { itemColors, palette } from "../../../shared/lib/palette";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Classifying and Counting by Category ----------
// Self-contained — the item builders are duplicated here rather than
// imported from ClassifyingAndCountingByCategory.tsx, same convention as
// every other *Test.tsx in this app.

let uid = 0;
const nextId = () => `mk3-test-item-${uid++}`;

function makeColorItems(countA: number, countB: number): { binA: BinItem[]; binB: BinItem[] } {
  const binA = Array.from({ length: countA }, () => ({ id: nextId(), shape: "circle" as ItemShape, color: itemColors.red.main }));
  const binB = Array.from({ length: countB }, () => ({ id: nextId(), shape: "circle" as ItemShape, color: itemColors.green.main }));
  return { binA, binB };
}

function makeShapeItems(counts: [number, number, number]): BinItem[][] {
  const shapes: ItemShape[] = ["circle", "square", "triangle"];
  return counts.map((n, i) => Array.from({ length: n }, () => ({ id: nextId(), shape: shapes[i], color: palette.c })));
}

const SHAPE_LABELS = ["Circles", "Squares", "Triangles"];

/** Identify which 2-category (color) group an unsorted item belongs in. */
export const colorSortIdentifyQuestion = (): TestQuestion[] => {
  const countA = randInt(2, 5);
  const countB = randInt(2, 5);
  const { binA, binB } = makeColorItems(countA, countB);
  const fromBinA = Math.random() < 0.5;
  const target = fromBinA ? binA[0] : binB[0];
  return [
    {
      visual: (
        <SortedBins
          tray={[target]}
          bins={[
            { label: "Red", items: fromBinA ? binA.slice(1) : binA },
            { label: "Green", items: fromBinA ? binB : binB.slice(1) },
          ]}
          highlightId={target.id}
        />
      ),
      difficulty: "easy",
      step: choice(
        { prompt: "The circled item belongs with which group?", hint: "Look at its color.", explain: `It's ${fromBinA ? "red" : "green"}.` },
        fromBinA ? "Red" : "Green",
        [fromBinA ? "Green" : "Red"]
      ),
    },
  ];
};

/** Identify which 3-category (shape) group an unsorted item belongs in — the harder, more-categories case. */
export const shapeSortIdentifyQuestion = (): TestQuestion[] => {
  const counts: [number, number, number] = [randInt(1, 4), randInt(1, 4), randInt(1, 4)];
  const groups = makeShapeItems(counts);
  const targetGroup = randInt(0, 2);
  const target = groups[targetGroup][0];
  const bins = groups.map((items, i) => ({ label: SHAPE_LABELS[i], items: i === targetGroup ? items.slice(1) : items }));
  const shapeWord = ["circle", "square", "triangle"][targetGroup];
  return [
    {
      visual: <SortedBins tray={[target]} bins={bins} highlightId={target.id} />,
      difficulty: "hard",
      step: choice(
        { prompt: "Which group does the circled item belong in?", hint: "Look at its shape — everything here is the same color.", explain: `It's a ${shapeWord}.` },
        SHAPE_LABELS[targetGroup],
        [SHAPE_LABELS[(targetGroup + 1) % 3]]
      ),
    },
  ];
};

/** Count one already-sorted category. */
export const countSingleCategoryQuestion = (): TestQuestion[] => {
  const countA = randInt(3, 10);
  const countB = randInt(3, 10);
  const { binA, binB } = makeColorItems(countA, countB);
  return [
    {
      visual: <SortedBins bins={[{ label: "Red", items: binA }, { label: "Green", items: binB }]} />,
      difficulty: "easy",
      step: { kind: "number", prompt: "How many are in the Red group?", hint: "Count each one exactly once.", explain: `There are ${countA} in the Red group.`, answer: countA },
    },
  ];
};

/** Count the OTHER already-sorted category in the same scenario shape. */
export const countOtherCategoryQuestion = (): TestQuestion[] => {
  const countA = randInt(3, 10);
  const countB = randInt(3, 10);
  const { binA, binB } = makeColorItems(countA, countB);
  return [
    {
      visual: <SortedBins bins={[{ label: "Red", items: binA }, { label: "Green", items: binB }]} />,
      difficulty: "easy",
      step: { kind: "number", prompt: "How many are in the Green group?", hint: "Count each one exactly once.", explain: `There are ${countB} in the Green group.`, answer: countB },
    },
  ];
};

/** Compare two already-counted categories — which has more. */
export const compareWhichMoreQuestion = (): TestQuestion[] => {
  const countA = randInt(2, 10);
  let countB = randInt(2, 10);
  while (countB === countA) countB = randInt(2, 10);
  const { binA, binB } = makeColorItems(countA, countB);
  const more = countA > countB ? "Red" : "Green";
  const fewer = more === "Red" ? "Green" : "Red";
  return [
    {
      visual: <SortedBins bins={[{ label: "Red", items: binA }, { label: "Green", items: binB }]} />,
      difficulty: "medium",
      step: choice({ prompt: "Which group has MORE?", hint: "Count both groups, then compare.", explain: `${more} has more.` }, more, [fewer]),
    },
  ];
};

/** Synthesis: compute the numeric difference between two categories' counts. */
export const compareDifferenceQuestion = (): TestQuestion[] => {
  const countA = randInt(2, 10);
  let countB = randInt(2, 10);
  while (countB === countA) countB = randInt(2, 10);
  const { binA, binB } = makeColorItems(countA, countB);
  const more = countA > countB ? "Red" : "Green";
  const fewer = more === "Red" ? "Green" : "Red";
  const moreCount = Math.max(countA, countB);
  const fewerCount = Math.min(countA, countB);
  const diff = moreCount - fewerCount;
  return [
    {
      visual: <SortedBins bins={[{ label: "Red", items: binA }, { label: "Green", items: binB }]} />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `How many MORE does ${more} have than ${fewer}?`,
        hint: "Subtract the smaller count from the bigger count.",
        explain: `${moreCount} - ${fewerCount} = ${diff}.`,
        answer: diff,
      },
    },
  ];
};

/** Generalization / false trap: the sorting attribute must stay consistent. */
export const consistentAttributeTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: "True or false: it's fine to switch from sorting by color to sorting by shape partway through, as long as you finish sorting everything.",
          hint: "Think about what happens to the meaning of each group if you switch.",
          explain: "False — switching attributes partway through breaks the sort; every object must be sorted by the SAME attribute.",
        },
        "False",
        ["True"]
      ),
    },
  ];
};

/** Misconception-specific: applying the wrong attribute to one item while sorting by shape. */
export const wrongAttributeAppliedQuestion = (): TestQuestion[] => {
  const groups = makeShapeItems([randInt(2, 4), 1, 0]);
  const square = groups[1][0];
  // Recolor the lone square to visually stand out as a different color among same-shaped circles.
  const oddColorSquare: BinItem = { ...square, color: itemColors.yellow.main };
  const circles = groups[0];
  return [
    {
      visual: <SortedBins tray={[oddColorSquare]} bins={[{ label: "Circles", items: circles }]} highlightId={oddColorSquare.id} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: "These are sorted by SHAPE. Does the circled square belong with the circles, even though it's a different color?",
          hint: "Shape sorts care about shape, not color.",
          explain: "No — a square is a different shape than a circle, so it doesn't belong with the Circles group, no matter its color.",
        },
        "No",
        ["Yes"]
      ),
    },
  ];
};

/** Counting within the harder 3-category (shape) case. */
export const threeCategoryCountQuestion = (): TestQuestion[] => {
  const counts: [number, number, number] = [randInt(2, 10), randInt(2, 10), randInt(2, 10)];
  const groups = makeShapeItems(counts);
  const askIndex = randInt(0, 2);
  const bins = groups.map((items, i) => ({ label: SHAPE_LABELS[i], items }));
  return [
    {
      visual: <SortedBins bins={bins} />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `How many are in the ${SHAPE_LABELS[askIndex]} group?`,
        hint: "Count each one in that group exactly once.",
        explain: `There are ${counts[askIndex]} in the ${SHAPE_LABELS[askIndex]} group.`,
        answer: counts[askIndex],
      },
    },
  ];
};

/** Comparing across THREE categories at once — which has the fewest. */
export const mostAndFewestAmongThreeQuestion = (): TestQuestion[] => {
  let counts: [number, number, number] = [randInt(2, 10), randInt(2, 10), randInt(2, 10)];
  // guarantee a unique minimum so "fewest" has exactly one right answer
  while (counts[0] === counts[1] || counts[1] === counts[2] || counts[0] === counts[2]) {
    counts = [randInt(2, 10), randInt(2, 10), randInt(2, 10)];
  }
  const groups = makeShapeItems(counts);
  const bins = groups.map((items, i) => ({ label: SHAPE_LABELS[i], items }));
  const minIndex = counts.indexOf(Math.min(...counts));
  const otherIndex = (minIndex + 1) % 3;
  return [
    {
      visual: <SortedBins bins={bins} />,
      difficulty: "hard",
      step: choice(
        { prompt: "Which group has the FEWEST?", hint: "Count all three groups, then find the smallest count.", explain: `${SHAPE_LABELS[minIndex]} has the fewest (${counts[minIndex]}).` },
        SHAPE_LABELS[minIndex],
        [SHAPE_LABELS[otherIndex]]
      ),
    },
  ];
};

export const classifyingTest: Unit["test"] = {
  questions: [
    colorSortIdentifyQuestion,
    shapeSortIdentifyQuestion,
    countSingleCategoryQuestion,
    countOtherCategoryQuestion,
    compareWhichMoreQuestion,
    compareDifferenceQuestion,
    consistentAttributeTrueFalseQuestion,
    wrongAttributeAppliedQuestion,
    threeCategoryCountQuestion,
    mostAndFewestAmongThreeQuestion,
  ],
  passScore: 9,
};
