import { BaseTenBlocks, PlaceValueColumns } from "../diagrams";
import { buildAddColumns, type ColumnBreakdown } from "../logic";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Explaining Why the Strategies Work ----------
// 10 questions from 10 generators. Self-contained (no import from
// ExplainingStrategies.tsx, and that file never imports back from here).

export const regroupValueNumberQuestion = (): TestQuestion[] => {
  const tens = randInt(1, 9);
  const value = tens * 10;
  return [
    {
      visual: <BaseTenBlocks hundreds={0} tens={tens} ones={0} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${tens} tens worth?`, hint: "Each ten is worth 10.", explain: `${tens} tens = ${value}.`, answer: value },
    },
  ];
};

/** Misconception distractor: believing regrouping changes the value. */
export const regroupValueChoiceQuestion = (): TestQuestion[] => {
  const tens = randInt(2, 9);
  return [
    {
      visual: <BaseTenBlocks hundreds={0} tens={tens} ones={0} />,
      difficulty: "medium",
      step: choice(
        { prompt: `If you traded some of these ${tens} tens for hundreds, what would happen to the total value?`, hint: "10 tens and 1 hundred are the same amount.", explain: "Trading never changes the value — only how it's grouped." },
        "It would stay exactly the same",
        ["It would get bigger", "It would get smaller"]
      ),
    },
  ];
};

export const columnAdditionJustifyChoiceQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(10, 79);
    b = randInt(10, 19);
    breakdown = buildAddColumns([a, b], 2);
  } while (breakdown.carry[0] !== 0);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "medium",
      step: choice(
        { prompt: `For ${a} + ${b}, why is it safe to add the ones and tens columns completely separately?`, hint: "Check each column's digit-sum.", explain: "Neither column's digits add to 10 or more, so there's no carrying needed." },
        "Neither column's digit-sum reaches 10, so there's nothing to carry",
        ["Because every addition problem works this way", "Because the numbers are both two digits"]
      ),
    },
  ];
};

export const commutativeNumberQuestion = (): TestQuestion[] => {
  const a = randInt(3, 9);
  const b = randInt(3, 9);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: { kind: "number", prompt: `A box has ${a} red blocks and ${b} blue blocks. ${b} + ${a} = ?`, hint: "Same two groups, either order.", explain: `${b} + ${a} = ${a + b}.`, answer: a + b },
    },
  ];
};

/** Generalization trap on the commutative property's scope. */
export const commutativeScopeChoiceQuestion = (): TestQuestion[] => {
  const a = randInt(10, 90);
  const b = randInt(10, 90);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `${a} + ${b} = ${b} + ${a}. Does swapping the order change the total for ADDITION problems in general, not just this one?`, hint: "Try a few different pairs of numbers.", explain: "No — addition's order never changes the total, for any pair of numbers, not just this one." },
        "No — order never matters for addition, for any numbers",
        ["Yes — it only happens to work for this particular pair", "Yes — it only works because both numbers are two digits"]
      ),
    },
  ];
};

export const critiqueWhereChoiceQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(10, 79);
    b = randInt(10, 79);
    breakdown = buildAddColumns([a, b], 2);
  } while (breakdown.carry[0] === 0);
  const onesSum = breakdown.digitsByOperand[0][0] + breakdown.digitsByOperand[1][0];
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "hard",
      step: choice(
        { prompt: `For ${a} + ${b}, a student adds each column with no carrying (ones column = ${onesSum}). Where does this go wrong?`, hint: "Check whether the ones column's sum is a single digit.", explain: `${onesSum} is 10 or more, so it needed to carry into the tens column — this method skipped that step.` },
        "The ones column's sum is 10 or more, and this method never carries",
        ["The student used the wrong two numbers", "Nothing is wrong — both strategies give the same answer"]
      ),
    },
  ];
};

export const critiqueCorrectAnswerNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(10, 79);
    b = randInt(10, 79);
    breakdown = buildAddColumns([a, b], 2);
  } while (breakdown.carry[0] === 0);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "hard",
      step: { kind: "number", prompt: `What is the correct answer to ${a} + ${b}?`, hint: "Carry the extra ten from the ones column into the tens column.", explain: `${a} + ${b} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

/** Generalization trap, restated from the CFU with fresh wording. */
export const fewExamplesTrueFalseQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: "True or false: if a strategy gives the right answer on a few easy examples, it's guaranteed to work on every example.", hint: "Think about what happens once regrouping shows up.", explain: "False — a strategy that works on easy, no-regroup cases can quietly break on a harder case, like one that needs regrouping." },
        "False",
        ["True"]
      ),
    },
  ];
};

export const columnAdditionNumberQuestion = (): TestQuestion[] => {
  let a = 0;
  let b = 0;
  let breakdown: ColumnBreakdown;
  do {
    a = randInt(10, 79);
    b = randInt(10, 19);
    breakdown = buildAddColumns([a, b], 2);
  } while (breakdown.carry[0] !== 0);
  return [
    {
      visual: <PlaceValueColumns breakdown={breakdown} revealCols={breakdown.numCols} />,
      difficulty: "easy",
      step: { kind: "number", prompt: `What is ${a} + ${b}?`, hint: "Add each column separately.", explain: `${a} + ${b} = ${breakdown.total}.`, answer: breakdown.total },
    },
  ];
};

/** 10 tens traded for 1 hundred — the other direction of the same
 *  value-preserving regroup, with a bigger unit than regroupValueNumberQuestion. */
export const tradeTensForHundredNumberQuestion = (): TestQuestion[] => {
  return [
    {
      visual: <BaseTenBlocks hundreds={1} tens={0} ones={0} />,
      difficulty: "medium",
      step: { kind: "number", prompt: "10 tens are traded for 1 hundred. What is that hundred worth?", hint: "Trading never changes the value.", explain: "1 hundred = 100, the exact same value as 10 tens.", answer: 100 },
    },
  ];
};

export const explainingStrategiesTest: Unit["test"] = {
  questions: [
    regroupValueNumberQuestion,
    regroupValueChoiceQuestion,
    columnAdditionJustifyChoiceQuestion,
    commutativeNumberQuestion,
    commutativeScopeChoiceQuestion,
    critiqueWhereChoiceQuestion,
    critiqueCorrectAnswerNumberQuestion,
    fewExamplesTrueFalseQuestion,
    columnAdditionNumberQuestion,
    tradeTensForHundredNumberQuestion,
  ],
  passScore: 9,
};
