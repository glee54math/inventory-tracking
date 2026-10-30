import { FactorRectangle } from "../../../shared/diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Own local copies — see WhatMultiplicationMeansTest.tsx's comment on why
// *Test.tsx files never import from their paired unit file.
export function distinctPair(min: number, max: number): [number, number] {
  const a = randInt(min, max);
  let b = randInt(min, max);
  while (b === a) b = randInt(min, max);
  return [a, b];
}

// Q1 — easy, visual: commutative, compute both orders
export function commutativeBothOrdersQuestion(): TestQuestion[] {
  const [rows, cols] = distinctPair(2, 9);
  return [
    {
      visual: <FactorRectangle rows={rows} cols={cols} />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: `What is ${cols} × ${rows}, if ${rows} × ${cols} = ${rows * cols}?`,
        hint: "Swapping the order of the factors doesn't change the product.",
        explain: `${cols} × ${rows} = ${rows * cols} too — same product either order.`,
        answer: rows * cols,
      },
    },
  ];
}

// Q2 — medium, choice: true/false on commutative
export function commutativeTrueFalseQuestion(): TestQuestion[] {
  const [a, b] = distinctPair(2, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `True or False: ${a} × ${b} and ${b} × ${a} always give the same product.`,
          hint: `Compute both: ${a} × ${b} and ${b} × ${a}.`,
          explain: `True — ${a} × ${b} = ${a * b} and ${b} × ${a} = ${a * b}. Order never changes the product.`,
        },
        "True — the order of the factors never changes the product",
        ["False — the order sometimes changes the product"]
      ),
    },
  ];
}

// Q3 — medium, choice: identify associative vs. commutative
export function identifyAssociativeQuestion(): TestQuestion[] {
  const a = randInt(2, 5);
  const b = randInt(2, 5);
  const c = randInt(2, 5);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `"${a} × (${b} × ${c}) = (${a} × ${b}) × ${c}" is an example of which property?`,
          hint: "Are two factors being swapped, or are three factors being regrouped?",
          explain: "Regrouping three factors (not reordering two) is the associative property.",
        },
        "Associative",
        ["Commutative", "Distributive"]
      ),
    },
  ];
}

// Q4 — medium, number: associative, two-step grouping
export function associativeGroupingQuestion(): TestQuestion[] {
  const a = randInt(2, 6);
  const b = randInt(2, 6);
  const c = randInt(2, 6);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `What is ${a} × (${b} × ${c})? (Multiply ${b} × ${c} first.)`,
        hint: `${b} × ${c} = ?, then ${a} × that.`,
        explain: `${b} × ${c} = ${b * c}, and ${a} × ${b * c} = ${a * b * c}.`,
        answer: a * b * c,
      },
    },
  ];
}

// Q5 — medium, visual: distributive, split and add
export function distributiveSplitQuestion(): TestQuestion[] {
  const a = randInt(3, 9);
  const b = randInt(6, 9);
  const part1 = randInt(1, b - 1);
  const part2 = b - part1;
  return [
    {
      visual: <FactorRectangle rows={a} cols={b} splitCols={[part1, part2]} />,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${a} × ${b} is split into ${a} × ${part1} + ${a} × ${part2}. What is the total?`,
        hint: `${a} × ${part1} = ?, and ${a} × ${part2} = ?`,
        explain: `${a} × ${part1} = ${a * part1}, and ${a} × ${part2} = ${a * part2}. ${a * part1} + ${a * part2} = ${a * b}.`,
        answer: a * b,
      },
    },
  ];
}

// Q6 — hard, choice: distributive works for ANY split, not just one
export function distributiveAnySplitQuestion(): TestQuestion[] {
  const b = randInt(6, 9);
  const shownSplit = randInt(1, b - 1);
  const altSplit = ((shownSplit + 1) % (b - 1)) + 1; // a different split of the same b, still 1..b-1
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `Someone split ${b} into ${shownSplit} + ${b - shownSplit} to use the distributive property. Could you ALSO split ${b} into ${altSplit} + ${b - altSplit} instead, and still get a correct answer?`,
          hint: "The distributive property works for any way you split a factor into two parts that add back up to it.",
          explain: `Yes — ${altSplit} + ${b - altSplit} = ${b} too, so that split works just as well as the first one.`,
        },
        "Yes — any split that adds back up to the original factor works",
        ["No — only the exact split that's shown first ever works"]
      ),
    },
  ];
}

// Q7 — hard, choice: generalize distributive to a brand-new, unseen pair
export function distributiveGeneralizationQuestion(): TestQuestion[] {
  const a = randInt(3, 9);
  const b = randInt(6, 9);
  const part1 = randInt(1, b - 1);
  const part2 = b - part1;
  return [
    {
      visual: <FactorRectangle rows={a} cols={b} splitCols={[part1, part2]} />,
      difficulty: "hard",
      step: choice(
        {
          prompt: `True or False: ${a} × ${part1} + ${a} × ${part2} equals ${a} × ${b}.`,
          hint: `${part1} + ${part2} = ${b}.`,
          explain: `True — ${a} × ${part1} + ${a} × ${part2} = ${a * part1} + ${a * part2} = ${a * b}.`,
        },
        "True",
        ["False"]
      ),
    },
  ];
}

// Q8 — medium, visual: rotate an array, confirm the product is unchanged
export function rotateQuestion(): TestQuestion[] {
  const [rows, cols] = distinctPair(2, 9);
  return [
    {
      visual: <FactorRectangle rows={rows} cols={cols} />,
      difficulty: "medium",
      step: choice(
        {
          prompt: `This array is ${rows} rows by ${cols} columns. If you rotated it to ${cols} rows by ${rows} columns, would the total number of items change?`,
          hint: "Rotating swaps rows and columns, which is just swapping the order of the two factors.",
          explain: `No — ${rows} × ${cols} = ${cols} × ${rows} = ${rows * cols}. Rotating never changes the total.`,
        },
        "No — the total stays the same",
        ["Yes — rotating changes the total"]
      ),
    },
  ];
}

// Q9 — hard, number: distributive, both parts plus the sum
export function distributiveFullQuestion(): TestQuestion[] {
  const a = randInt(6, 9);
  const b = randInt(6, 9);
  const part1 = 5;
  const part2 = b - part1 > 0 ? b - part1 : 1;
  const safeB = part1 + part2;
  return [
    {
      visual: <FactorRectangle rows={a} cols={safeB} splitCols={[part1, part2]} />,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `Use the distributive property to find ${a} × ${safeB}, by splitting ${safeB} into ${part1} + ${part2}.`,
        hint: `${a} × ${part1} = ?, ${a} × ${part2} = ?, then add.`,
        explain: `${a} × ${part1} = ${a * part1}, ${a} × ${part2} = ${a * part2}. ${a * part1} + ${a * part2} = ${a * safeB}.`,
        answer: a * safeB,
      },
    },
  ];
}

// Q10 — hard, choice: distinguish all three properties at once
export function distinguishAllThreeQuestion(): TestQuestion[] {
  const scenarios = [
    { text: "Rewriting 7 × 8 as 8 × 7", answer: "Commutative" },
    { text: "Rewriting (2 × 3) × 4 as 2 × (3 × 4)", answer: "Associative" },
    { text: "Rewriting 6 × 9 as 6 × 5 + 6 × 4", answer: "Distributive" },
  ];
  const scenario = scenarios[randInt(0, scenarios.length - 1)];
  const others = ["Commutative", "Associative", "Distributive"].filter((p) => p !== scenario.answer);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${scenario.text} uses which property?`,
          hint: "Reorder two = commutative. Regroup three = associative. Split one apart = distributive.",
          explain: `"${scenario.text}" is the ${scenario.answer.toLowerCase()} property.`,
        },
        scenario.answer,
        others
      ),
    },
  ];
}

export const propertiesOfMultiplicationTest: Unit["test"] = {
  questions: [
    commutativeBothOrdersQuestion,
    commutativeTrueFalseQuestion,
    identifyAssociativeQuestion,
    associativeGroupingQuestion,
    distributiveSplitQuestion,
    distributiveAnySplitQuestion,
    distributiveGeneralizationQuestion,
    rotateQuestion,
    distributiveFullQuestion,
    distinguishAllThreeQuestion,
  ],
  passScore: 9,
};
