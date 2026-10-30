import { randInt, pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: One-Step Word Problems with Masses and Volumes ----------
// 10 single-question generators, self-contained (not imported from
// WordProblemsWithMassAndVolume.tsx — avoids a unit<->test circular import).

type UnitName = "L" | "g" | "kg";
const UNIT_LABEL: Record<UnitName, string> = { L: "liters", g: "grams", kg: "kilograms" };
const UNIT_POOL: UnitName[] = ["L", "g", "kg"];

/** Add or subtract two same-unit amounts (free-typed). */
export const addSubtractQuestion = (isAdd: boolean, difficulty: "easy" | "medium"): TestQuestion[] => {
  const unit = pick(UNIT_POOL);
  const a = randInt(unit === "g" ? 100 : 5, unit === "g" ? 800 : 25);
  const b = randInt(unit === "g" ? 50 : 1, unit === "g" ? Math.min(a - 10, 400) : a - 1);
  const answer = isAdd ? a + b : a - b;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: isAdd
          ? `A bucket has ${a} ${UNIT_LABEL[unit]}. Then ${b} more ${UNIT_LABEL[unit]} are added. How many ${UNIT_LABEL[unit]} are in the bucket now?`
          : `A sack has ${a} ${UNIT_LABEL[unit]} of rice. ${b} ${UNIT_LABEL[unit]} are cooked. How many ${UNIT_LABEL[unit]} are left?`,
        hint: isAdd ? "Combine the two amounts." : "Take the used amount away from the start.",
        explain: isAdd ? `${a} + ${b} = ${answer} ${unit}.` : `${a} − ${b} = ${answer} ${unit}.`,
        answer,
        suffix: unit,
      },
    },
  ];
};

/** Multiply — equal groups combined. Choice version: distractor
 *  (n + each) targets "always add" (misconception); (each) targets
 *  answering with one group instead of the total. */
export const multiplyQuestion = (asChoice: boolean): TestQuestion[] => {
  const unit = pick(UNIT_POOL);
  // n >= 3 and each >= 2 guarantee n + each < n * each and each < n * each,
  // so neither distractor can collide with the correct total.
  const n = randInt(3, 8);
  const each = unit === "g" ? randInt(2, 9) * 25 : randInt(2, 6);
  const total = n * each;
  const prompt = `${n} bottles each hold ${each} ${UNIT_LABEL[unit]}. How many ${UNIT_LABEL[unit]} in all?`;
  const base = { prompt, hint: "Equal groups put together — multiply.", explain: `${n} × ${each} = ${total} ${unit}.` };
  return [
    {
      visual: null,
      difficulty: "medium",
      step: asChoice
        ? choice(base, `${total} ${unit}`, [
            `${n + each} ${unit}`, // added instead of multiplied ("always add")
            `${each} ${unit}`, // reported one group, not the total
          ])
        : { kind: "number", ...base, answer: total, suffix: unit },
    },
  ];
};

/** Divide — share a total equally. Choice version: distractor (total × n)
 *  targets multiplying when the story splits; (total − n) targets
 *  subtracting the number of groups. */
export const divideQuestion = (asChoice: boolean): TestQuestion[] => {
  const unit = pick(UNIT_POOL);
  let n = randInt(2, 6);
  let each = unit === "g" ? randInt(2, 15) * 10 : randInt(2, 8);
  // Collision guard: total − n === each exactly when each·(n−1) === n, i.e. n=2, each=2.
  while (n * each - n === each) {
    n = randInt(2, 6);
    each = randInt(2, 8);
  }
  const total = n * each;
  const prompt = `${total} ${UNIT_LABEL[unit]} are shared equally among ${n} boxes. How many ${UNIT_LABEL[unit]} go in each box?`;
  const base = { prompt, hint: "A total split into equal groups — divide.", explain: `${total} ÷ ${n} = ${each} ${unit}.` };
  return [
    {
      visual: null,
      difficulty: "hard",
      step: asChoice
        ? choice(base, `${each} ${unit}`, [
            `${total * n} ${unit}`, // multiplied instead of divided
            `${total - n} ${unit}`, // subtracted the number of boxes
          ])
        : { kind: "number", ...base, answer: each, suffix: unit },
    },
  ];
};

/** Mixed: the story never names the operation. Distractor set always
 *  includes "Add" (the default-to-add misconception) whenever the correct
 *  operation isn't addition. */
export const pickOperationQuestion = (): TestQuestion[] => {
  const scenarios: { story: string; op: string }[] = [
    { story: `A puppy had a mass of ${randInt(3, 9)} kg in the spring and gained ${randInt(2, 6)} kg by fall. What is its mass now?`, op: "Add" },
    { story: `A fish tank held ${randInt(20, 30)} liters. After cleaning it held ${randInt(5, 15)} liters. What volume was removed?`, op: "Subtract" },
    { story: `One muffin has a mass of ${randInt(4, 9) * 10} grams. What is the mass of ${randInt(3, 8)} identical muffins?`, op: "Multiply" },
    { story: `${randInt(2, 5) * 6} liters of juice fill 6 identical pitchers. What does one pitcher hold?`, op: "Divide" },
  ];
  const s = pick(scenarios);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        { prompt: `${s.story} Which operation solves this?`, hint: "Picture what's happening in the story.", explain: `${s.op} — that's what the story's situation calls for.` },
        s.op,
        ["Add", "Subtract", "Multiply", "Divide"].filter((o) => o !== s.op)
      ),
    },
  ];
};

/** The same-units rule: mismatched units can't be combined. Distractor =
 *  just adding the two numbers (the misconception the CFU targets). */
export const mismatchedUnitsQuestion = (): TestQuestion[] => {
  const g = randInt(2, 9) * 100;
  const l = randInt(2, 5);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `A recipe uses ${g} grams of flour and ${l} liters of milk. What is the combined total?`,
          hint: "Check the units first. Do they match?",
          explain: "Grams measure mass and liters measure volume — they can't be combined into one total.",
        },
        "They can't be combined — grams and liters measure different things",
        [
          `${g + l} grams`, // just added the numbers, ignoring the unit mismatch
          `${g + l} liters`, // same mistake, other unit label
        ]
      ),
    },
  ];
};

export const wordProblemsWithMassAndVolumeTest: Unit["test"] = {
  questions: [
    () => addSubtractQuestion(true, "easy"),
    () => addSubtractQuestion(false, "medium"),
    () => multiplyQuestion(false),
    () => multiplyQuestion(true),
    () => divideQuestion(false),
    () => divideQuestion(true),
    () => pickOperationQuestion(),
    () => pickOperationQuestion(),
    () => mismatchedUnitsQuestion(),
    () => addSubtractQuestion(false, "medium"),
  ],
  passScore: 9,
};
