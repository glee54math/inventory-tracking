import { SortedBins } from "../diagrams";
import { randInt, shuffle } from "../../../shared/lib/math";
import type { TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { COLOR_GROUPS, SHAPE_GROUPS, SHAPE_OF, bin, countLine, groupChoice, groupHas, groupPhrase, groupsFor, itemIn, makeGroups, mixedShapeSet, shapeWord, threeCounts, type SortRule } from "./labParts";

// ---------- end-of-unit test: Sort and Count ----------
// Shared data comes from labParts, never from the unit file (the unit file
// imports this test, so importing back would be a circular import). Every bin
// hides its count (review C1-30).

const twoColors = () => shuffle(COLOR_GROUPS).slice(0, 2);

/** Two color groups, mixed shapes: the item's shape tempts. */
export const colorSortIdentifyQuestion = (): TestQuestion[] => {
  const names = twoColors();
  const groups = makeGroups(names, [randInt(2, 5), randInt(2, 5)]);
  const home = randInt(0, 1);
  const target = itemIn(names[home]);
  return [
    {
      visual: <SortedBins tray={[target]} bins={names.map((n, i) => bin(n, groups[i]))} highlightId={target.id} />,
      difficulty: "easy",
      step: groupChoice({ prompt: "We sort by color. Where does this one go?", hint: "Look at its color.", explain: `It goes with ${groupPhrase(names[home])}.` }, names, names[home]),
    },
  ];
};

/** Three shape groups, mixed colors: all three buttons shown. */
export const shapeSortIdentifyQuestion = (): TestQuestion[] => {
  const groups = makeGroups(SHAPE_GROUPS, [randInt(1, 4), randInt(1, 4), randInt(1, 4)]);
  const home = randInt(0, 2);
  const target = itemIn(SHAPE_GROUPS[home]);
  return [
    {
      visual: <SortedBins tray={[target]} bins={SHAPE_GROUPS.map((n, i) => bin(n, groups[i]))} highlightId={target.id} />,
      difficulty: "hard",
      step: groupChoice({ prompt: "We sort by shape. Where does this one go?", hint: "Look at its shape.", explain: `It goes with ${groupPhrase(SHAPE_GROUPS[home])}.` }, SHAPE_GROUPS, SHAPE_GROUPS[home]),
    },
  ];
};

const countQuestion = (ask: 0 | 1): TestQuestion[] => {
  const names = twoColors();
  const counts = [randInt(3, 10), randInt(3, 10)];
  const groups = makeGroups(names, counts);
  return [
    {
      visual: <SortedBins bins={names.map((n, i) => bin(n, groups[i]))} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `How many are in the ${names[ask]} group?`, hint: "Count each one once.", explain: groupHas(names[ask], `${counts[ask]}.`), answer: counts[ask] },
    },
  ];
};

/** Count the first group shown. */
export const countSingleCategoryQuestion = (): TestQuestion[] => countQuestion(0);

/** Count the second group shown. */
export const countOtherCategoryQuestion = (): TestQuestion[] => countQuestion(1);

const distinctPair = (): [number, number] => {
  const a = randInt(2, 10);
  let b = randInt(2, 10);
  while (b === a) b = randInt(2, 10);
  return [a, b];
};

/** Which of two groups has more. */
export const compareWhichMoreQuestion = (): TestQuestion[] => {
  const names = twoColors();
  const [a, b] = distinctPair();
  const groups = makeGroups(names, [a, b]);
  const more = a > b ? names[0] : names[1];
  return [
    {
      visual: <SortedBins bins={names.map((n, i) => bin(n, groups[i]))} />,
      difficulty: "medium",
      step: groupChoice({ prompt: <>Which group has <b>more</b>?</>, hint: "Match them up.", explain: `${more} has more.` }, names, more),
    },
  ];
};

/** Count the extras (review D3). No subtraction. */
export const compareExtrasQuestion = (): TestQuestion[] => {
  const names = twoColors();
  const [a, b] = distinctPair();
  const groups = makeGroups(names, [a, b]);
  const more = a > b ? names[0] : names[1];
  const diff = Math.abs(a - b);
  return [
    {
      visual: <SortedBins bins={names.map((n, i) => bin(n, groups[i]))} extra={{ bin: a > b ? 0 : 1, from: Math.min(a, b), numbered: false }} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `How many extra does ${more} have?`, hint: "Match them up. Count the extras.", explain: `${diff} extra.`, answer: diff },
    },
  ];
};

/** Keep one rule: the rule varies, and the item's other attribute tempts. */
export const keepOneRuleQuestion = (): TestQuestion[] => {
  const rule: SortRule = Math.random() < 0.5 ? "color" : "shape";
  const names = groupsFor(rule);
  const groups = makeGroups(names, [randInt(1, 3), randInt(1, 3), randInt(1, 3)]);
  const home = randInt(0, 2);
  const target = itemIn(names[home]);
  return [
    {
      visual: <SortedBins tray={[target]} bins={names.map((n, i) => bin(n, groups[i]))} highlightId={target.id} />,
      difficulty: "hard",
      step: groupChoice({ prompt: `We sort by ${rule}. Where does this one go?`, hint: "Keep sorting the same way.", explain: `It goes with ${groupPhrase(names[home])}.` }, names, names[home]),
    },
  ];
};

/** Typed: a mixed set, count one shape (C2-42). Distractor: counting a color instead. */
export const wrongAttributeAppliedQuestion = (): TestQuestion[] => {
  const { items, groups } = mixedShapeSet();
  const ask = randInt(0, 2);
  const n = groups[ask].length;
  return [
    {
      visual: <SortedBins tray={items} bins={[]} />,
      difficulty: "medium",
      step: { kind: "number", prompt: <>We sort by shape. How many {shapeWord(SHAPE_GROUPS[ask], "?")}</>, hint: "Look at each shape.", explain: countLine(SHAPE_GROUPS[ask], n), answer: n },
    },
  ];
};

/** Count one of three shape groups. */
export const threeCategoryCountQuestion = (): TestQuestion[] => {
  const counts = [randInt(2, 10), randInt(2, 10), randInt(2, 10)];
  const groups = makeGroups(SHAPE_GROUPS, counts);
  const ask = randInt(0, 2);
  return [
    {
      visual: <SortedBins bins={SHAPE_GROUPS.map((n, i) => bin(n, groups[i]))} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `How many are in the ${SHAPE_GROUPS[ask]} group?`, hint: "Count each one once.", explain: countLine(SHAPE_GROUPS[ask], counts[ask]), answer: counts[ask] },
    },
  ];
};

/** Three groups: which has the fewest. All three buttons shown. */
export const fewestAmongThreeQuestion = (): TestQuestion[] => {
  const counts = threeCounts();
  const groups = makeGroups(SHAPE_GROUPS, counts);
  const few = SHAPE_GROUPS[counts.indexOf(Math.min(...counts))];
  return [
    {
      visual: <SortedBins bins={SHAPE_GROUPS.map((n, i) => ({ ...bin(n, groups[i]), icon: SHAPE_OF[n] }))} />,
      difficulty: "hard",
      step: groupChoice({ prompt: <>Which group has the <b>fewest</b>?</>, hint: "Count each group.", explain: groupHas(few, "the fewest.") }, SHAPE_GROUPS, few),
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
    compareExtrasQuestion,
    keepOneRuleQuestion,
    wrongAttributeAppliedQuestion,
    threeCategoryCountQuestion,
    fewestAmongThreeQuestion,
  ],
  passScore: 9,
};
