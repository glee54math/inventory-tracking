import React from "react";
import { DoubleNumberLine } from "../diagrams";
import { palette } from "../lib/palette";
import { fracText, gcd, money, pick, randInt } from "../lib/math";
import { choice, type TestQuestion } from "../engine/types";
import { QA, QB } from "../engine/controls";
import type { Unit } from "./types";

// ---------- end-of-unit test: Unit rate ----------
// 10 questions from 8 generators (candle shop produces a non-leading pair that
// shares one scenario's randomized numbers, restated in full in each question's
// own prompt). Broadly mirrors RatioLanguageTest.tsx's shape — 2 diagrams, a
// mix of easy/medium/hard, several multiple-choice "sentence" questions at the
// end — but with 1 colored question and 4 final MC questions instead of 3/3,
// after the original easy "just restate the ratio" train question was cut for
// being too trivial. Unlike RatioGroups (used in the Ratio Language test),
// DoubleNumberLine prints its own axis labels directly on the diagram, so the
// diagram questions here don't need a separate legend.
//
// Every money generator picks the unit price FIRST from a quarter-dollar pool
// (exact in binary floating point — quarters are 2⁻²) and multiplies by an
// integer quantity for any total, so the division the student performs always
// terminates to the cent — never a value that forces rounding.

// Q1 — car wash: diagram + QA/QB color. Easy: read the rate straight off the highlighted tick.
const carWashQuestion = (): TestQuestion[] => {
  const cars = randInt(3, 5);
  const rate = randInt(2, 4); // bottles of soap per car
  const totalBottles = cars * rate;
  return [
    {
      visual: (
        <DoubleNumberLine
          top={{ label: "bottles of soap", color: palette.a }}
          bottom={{ label: "cars", color: palette.b }}
          pairs={[
            { top: 0, bottom: 0 },
            { top: rate, bottom: 1, highlight: true },
            { top: totalBottles, bottom: cars },
          ]}
        />
      ),
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: (
          <>
            Using the double number line, what is the unit rate of <QA>bottles of soap</QA> per <QB>car</QB>?
          </>
        ),
        answer: rate,
        suffix: "bottles per car",
        hint: "Find the highlighted tick — that's the amount for exactly 1 car.",
        explain: `The highlighted tick shows ${rate} bottles for 1 car.`,
      },
    },
  ];
};

// Q2 — paint crew: diagram, no color. Hard: read the forward rate, then flip it.
const paintCrewQuestion = (): TestQuestion[] => {
  const cans = randInt(2, 4);
  const brushesPerCan = randInt(2, 4);
  const totalBrushes = cans * brushesPerCan;
  return [
    {
      visual: (
        <DoubleNumberLine
          top={{ label: "brushes", color: palette.a }}
          bottom={{ label: "cans", color: palette.b }}
          pairs={[
            { top: 0, bottom: 0 },
            { top: brushesPerCan, bottom: 1, highlight: true },
            { top: totalBrushes, bottom: cans },
          ]}
        />
      ),
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: <>Using the double number line, what is the unit rate of cans per brush? (That's the flip of what's highlighted.)</>,
        answer: 1 / brushesPerCan,
        suffix: "cans per brush",
        hint: `The highlighted tick shows ${brushesPerCan} brushes per can. Flip it: 1 ÷ ${brushesPerCan}.`,
        explain: `${brushesPerCan} brushes per can flips to 1/${brushesPerCan} can per brush.`,
      },
    },
  ];
};

// Q3 — train ride: no diagram, color text. Medium: unit rate via division.
const trainQuestions = (): TestQuestion[] => {
  const rate = randInt(40, 65); // miles per hour
  const hours = randInt(2, 5);
  const miles = rate * hours;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: (
          <>
            A train travels <QA>{miles} miles</QA> in <QB>{hours} hours</QB>. What is the unit rate, in miles per hour?
          </>
        ),
        answer: rate,
        suffix: "miles per hour",
        hint: `${miles} ÷ ${hours} = ?`,
        explain: `${miles} ÷ ${hours} = ${rate} miles per hour.`,
      },
    },
  ];
};

// Q4/Q5 — candle shop: no diagram, no color, money. Medium unit price, then medium scaled cost.
const candleShopQuestions = (): TestQuestion[] => {
  const unitPrice = pick([1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5]);
  const units1 = randInt(4, 8);
  const total1 = unitPrice * units1;
  let units2 = randInt(2, 6);
  while (units2 === units1) units2 = randInt(2, 6);
  const total2 = unitPrice * units2;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: <>A candle shop sells {units1} candles for a total of {money(total1)}. What is the price per candle? If it's not a whole dollar amount, write it with two decimal places (like 3.50).</>,
        prefix: "$",
        answer: unitPrice,
        money: true,
        hint: `${money(total1)} ÷ ${units1} = ?`,
        explain: `${money(total1)} ÷ ${units1} = ${money(unitPrice)} per candle.`,
      },
    },
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: <>A candle shop sells {units1} candles for {money(total1)}. At that rate, how much would {units2} candles cost? If it's not a whole dollar amount, write it with two decimal places (like 3.50).</>,
        prefix: "$",
        answer: total2,
        money: true,
        hint: `First find the price per candle (${money(total1)} ÷ ${units1}), then multiply by ${units2}.`,
        explain: `${money(total1)} ÷ ${units1} = ${money(unitPrice)} per candle. ${money(unitPrice)} × ${units2} = ${money(total2)}.`,
      },
    },
  ];
};

// Q6 — trail mix: no diagram, no color. Easy: single division, already-simplest fraction.
const trailMixQuestion = (): TestQuestion[] => {
  let b = randInt(3, 6); // batches
  let a = randInt(1, 4); // cups of nuts
  while (gcd(a, b) !== 1 || a >= b) {
    b = randInt(3, 6);
    a = randInt(1, 4);
  }
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: <>A trail mix recipe uses {a} cups of nuts for every {b} batches. How many cups of nuts go with 1 batch?</>,
        answer: a / b,
        suffix: "cups",
        hint: `${a} ÷ ${b}. A fraction like 2/3 is fine.`,
        explain: `${a} ÷ ${b} = ${fracText(a, b)} cups per batch.`,
      },
    },
  ];
};

// The final 4 questions are all multiple-choice "sentence" questions, each
// testing one distinct unit-rate skill: recognizing the correct unit price,
// flipping a rate, combining a unit-price step with a scaling step, and
// scaling a ratio to a target that isn't a whole multiple of the given amount.

// Q7 — juice bottles: no diagram, no color, multiple choice. Medium: recognize the correct unit price.
// Distractors are arithmetic mistakes (confusing total with unit price, dividing backwards,
// multiplying instead of dividing) — not a formatting trap. The free-type money questions
// (candle shop) are where the $#.## format itself is tested; a multiple-choice "sentence"
// question shouldn't turn into a gotcha about trailing zeros.
const juiceBottlesQuestion = (): TestQuestion[] => {
  const bottles = randInt(3, 6);
  const pricePerBottle = pick([1.5, 2, 2.5, 3, 3.5, 4]);
  const total = pricePerBottle * bottles;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: <>A store sells {bottles} juice bottles for {money(total)}. Which sentence correctly describes the price per bottle?</>,
          hint: "Divide the total by the number of bottles.",
          explain: `${money(total)} ÷ ${bottles} = ${money(pricePerBottle)} per bottle.`,
        },
        `The price per bottle is ${money(pricePerBottle)}.`,
        [`The price per bottle is ${money(total)}.`, `The price per bottle is ${money(bottles / total)}.`, `The price per bottle is ${money(total * bottles)}.`]
      ),
    },
  ];
};

// Q8 — painting: no diagram, no color, multiple choice. Hard: recognize the correctly-flipped unit fraction.
const paintingQuestion = (): TestQuestion[] => {
  const gallonsPerWall = randInt(2, 4);
  let walls = randInt(3, 6);
  while (walls === gallonsPerWall) walls = randInt(3, 6);
  const totalGallons = gallonsPerWall * walls;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>A painter uses {totalGallons} gallons of paint for {walls} walls. Which sentence correctly describes how much of a wall you can paint with 1 gallon?</>,
          hint: `First find gallons per wall (${totalGallons} ÷ ${walls}), then flip it: instead of gallons per wall, think walls per gallon.`,
          explain: `${gallonsPerWall} gallons per wall flips to ${fracText(1, gallonsPerWall)} of a wall per gallon.`,
        },
        `1 gallon paints ${fracText(1, gallonsPerWall)} of a wall.`,
        [`1 gallon paints ${gallonsPerWall} walls.`, `1 gallon paints ${fracText(1, walls)} of a wall.`, `1 gallon paints ${fracText(1, totalGallons)} of a wall.`]
      ),
    },
  ];
};

// Q9 — smoothie bar: no diagram, no color, multiple choice. Hard: combine a unit-price step with a scaling step.
// Distractors are arithmetic mistakes (scaling backwards, skipping the unit-price step, forgetting
// to rescale at all) — same "no formatting gotcha" reasoning as juiceBottlesQuestion above.
const smoothieBarQuestion = (): TestQuestion[] => {
  const pricePerCup = pick([1.5, 2, 2.5, 3, 3.5, 4]);
  const cups = randInt(3, 6);
  const total = pricePerCup * cups;
  const newCups = randInt(7, 12);
  const correctCost = pricePerCup * newCups;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>A smoothie bar sells {cups} smoothies for {money(total)}. At that rate, which sentence correctly describes the cost of {newCups} smoothies?</>,
          hint: "First find the price per smoothie, then multiply by the new number of smoothies.",
          explain: `${money(total)} ÷ ${cups} = ${money(pricePerCup)} per smoothie. ${money(pricePerCup)} × ${newCups} = ${money(correctCost)}.`,
        },
        `${newCups} smoothies cost ${money(correctCost)}.`,
        [`${newCups} smoothies cost ${money(total * (cups / newCups))}.`, `${newCups} smoothies cost ${money(total * newCups)}.`, `${newCups} smoothies cost ${money(total)}.`]
      ),
    },
  ];
};

// Q10 — cookie sale: no diagram, no color, multiple choice. Hard: scale a ratio to a target
// that ISN'T a whole-number multiple of the given amount — genuine proportion reasoning
// (reduce to the base rate, then scale) instead of a "just double it" shortcut. p:q is the
// reduced base rate; the given numbers (quantity1, price1) are p:q scaled by k1, so they're
// deliberately NOT already in lowest terms. k2 is chosen so price2 is never an integer
// multiple of price1 (e.g. 21 is not a multiple of 12), yet the cookie count still comes out
// whole, since it's p — not price1 — that's being scaled by k2.
const cookieSaleQuestion = (): TestQuestion[] => {
  let p = randInt(2, 4); // cookies per base unit
  let q = randInt(3, 6); // dollars per base unit
  while (gcd(p, q) !== 1) {
    p = randInt(2, 4);
    q = randInt(3, 6);
  }
  const k1 = randInt(3, 5);
  let k2 = randInt(6, 9);
  while (k2 % k1 === 0) k2 = randInt(6, 9);
  const quantity1 = p * k1;
  const price1 = q * k1;
  const price2 = q * k2;
  const answer = p * k2;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>A store sells {quantity1} cookies for {money(price1)}. At this rate, which sentence correctly describes how many cookies you can buy with {money(price2)}?</>,
          hint: "Set up a proportion with the rate from the first sentence, then scale it to match the new dollar amount.",
          explain: `${quantity1} cookies for ${money(price1)} reduces to ${p} cookies for ${money(q)}. Scaling that up to ${money(price2)} gives ${answer} cookies.`,
        },
        `You can buy ${answer} cookies with ${money(price2)}.`,
        [
          `You can buy ${Math.round(price2 / price1)} cookies with ${money(price2)}.`,
          `You can buy ${quantity1 * price2} cookies with ${money(price2)}.`,
          `You can buy ${Math.round((price1 / price2) * quantity1)} cookies with ${money(price2)}.`,
        ]
      ),
    },
  ];
};

export const unitRateTest: Unit["test"] = {
  questions: [carWashQuestion, paintCrewQuestion, trainQuestions, candleShopQuestions, trailMixQuestion, juiceBottlesQuestion, paintingQuestion, smoothieBarQuestion, cookieSaleQuestion],
  passScore: 9,
};
