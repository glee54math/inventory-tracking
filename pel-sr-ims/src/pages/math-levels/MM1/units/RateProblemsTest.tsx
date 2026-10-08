import React from "react";
import { DoubleNumberLine, TapeDiagram } from "../diagrams";
import { palette } from "../../shared/lib/palette";
import { fracText, gcd, money, pick, randInt } from "../../shared/lib/math";
import { choice, type TestQuestion } from "../../shared/engine/types";
import { QA, QB } from "../../shared/engine/controls";
import type { Unit } from "../../shared/units/types";

// ---------- end-of-unit test: Rate problems ----------
// 10 questions from 9 generators (lawn crew produces a non-leading pair that
// shares one scenario's randomized numbers, restated in full in each
// question's own prompt). Broadly mirrors UnitRateTest.tsx/TablesGraphsTest.tsx's
// shape — 2 diagrams, 1 colored pair, 3/4/3 easy/medium/hard, final 3
// multiple-choice "sentence" questions — organized around this unit's own
// three practice themes (constant speed, work rate, better buy) so every
// question traces back to one of lawnProblem/speedProblem/betterBuyProblem's
// skills rather than inventing a fourth context. DoubleNumberLine prints its
// own axis labels directly, same as in UnitRateTest, so the diagram question
// doesn't need a separate legend. Every money generator picks the unit price
// FIRST from a quarter-dollar pool — EXCLUDING whole-dollar values, so the
// answer always genuinely requires decimal division rather than accidentally
// landing on a whole number — and multiplies by an integer quantity, so the
// division a student performs always terminates to the cent — same trick
// UnitRateTest's money questions use. The two non-money fractional-rate
// questions (lawnCrewQuestions' reciprocal step, fenceCrewQuestion) draw
// their denominator from {2, 4, 5} rather than a plain range, for the same
// reason: those are the only small denominators whose reciprocal-based
// fractions terminate within 2 decimal places (no thirds, sixths, sevenths,
// or ninths). QA/QB color coding is reserved for the first 4 questions only
// (Q1 and the Q3/Q4 pair) — none of the later questions use it, same as
// every other MM1 unit test.

// Q1 — road trip: diagram + QA/QB color. Easy: read the unit rate straight off the highlighted tick.
const roadTripQuestion = (): TestQuestion[] => {
  const rate = pick([35, 40, 45, 50, 55, 60]); // miles per hour
  const hours = randInt(2, 5);
  const miles = rate * hours;
  return [
    {
      visual: (
        <DoubleNumberLine
          top={{ label: "miles", color: palette.a }}
          bottom={{ label: "hours", color: palette.b }}
          pairs={[
            { top: 0, bottom: 0 },
            { top: rate, bottom: 1, highlight: true },
            { top: miles, bottom: hours },
          ]}
        />
      ),
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: (
          <>
            Using the double number line, what is the unit rate of <QA>miles</QA> per <QB>hour</QB>?
          </>
        ),
        answer: rate,
        suffix: "miles per hour",
        hint: "Find the highlighted tick — that's the distance for exactly 1 hour.",
        explain: `The highlighted tick shows ${rate} miles for 1 hour.`,
      },
    },
  ];
};

// Q2 — store tape: diagram, no color. Medium: find a unit price from a tape diagram's bracket total, without the per-item amounts shown.
// Pool excludes whole-dollar values (2, 3, ...) so the answer always genuinely requires decimal division, not just luck.
const storeTapeQuestion = (): TestQuestion[] => {
  const unitPrice = pick([1.25, 1.5, 1.75, 2.25, 2.5, 2.75, 3.25, 3.5]);
  const units = randInt(4, 8);
  const total = unitPrice * units;
  return [
    {
      visual: (
        <TapeDiagram
          tapes={[{ label: "Store A", units, color: palette.a, softColor: palette.aSoft, shaded: 0, total: money(total) }]}
          unitWidth={44}
        />
      ),
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: <>The tape shows Store A's {units} items for a total of {money(total)}. What is the price per item? If it's not a whole dollar amount, write it with two decimal places (like 3.50).</>,
        prefix: "$",
        answer: unitPrice,
        money: true,
        hint: `${money(total)} ÷ ${units} = ?`,
        explain: `${money(total)} ÷ ${units} = ${money(unitPrice)} per item.`,
      },
    },
  ];
};

// Q3/Q4 — lawn crew: no diagram, color text. Easy scale the rate up, then medium find the reciprocal rate.
// L (lawns) is drawn from {2, 4, 5} rather than a plain range — with gcd(L,h)=1 enforced below, that
// restricts L's prime factors to 2s and 5s, which guarantees h/L always terminates within 2 decimal
// places (e.g. never a denominator of 3, 6, 7, 9 that would produce a repeating decimal).
const lawnCrewQuestions = (): TestQuestion[] => {
  const L = pick([2, 4, 5]);
  let h = randInt(3, 9);
  while (h === L || gcd(L, h) !== 1) {
    h = randInt(3, 9);
  }
  const k = randInt(2, 5);
  const H = h * k;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: (
          <>
            A crew mows <QA>{L} lawns</QA> every <QB>{h} hours</QB>, working at a constant rate. At that rate, how many lawns can it mow in <QB>{H} hours</QB>?
          </>
        ),
        answer: L * k,
        suffix: "lawns",
        hint: `${H} is ${k} times ${h}, so the lawn count is also ${k} times as much.`,
        explain: `${H} ÷ ${h} = ${k}, so ${L} × ${k} = ${L * k} lawns.`,
      },
    },
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: (
          <>
            A crew mows <QA>{L} lawns</QA> every <QB>{h} hours</QB>, working at a constant rate. What is the rate in hours per lawn? (A fraction is fine.)
          </>
        ),
        answer: h / L,
        suffix: "hours per lawn",
        hint: `Hours ÷ lawns = ${h} ÷ ${L}.`,
        explain: `${h} ÷ ${L} = ${fracText(h, L, true)} hours per lawn.`,
      },
    },
  ];
};

// Q5 — reverse speed: no diagram, no color. Medium: given the unit rate, find the time for a new distance.
const reverseSpeedQuestion = (): TestQuestion[] => {
  const rate = pick([30, 35, 40, 45, 50, 55, 60, 65]); // miles per hour
  const time = randInt(2, 8);
  const distance = rate * time;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: <>A cyclist rides at a constant {rate} miles per hour. How long would it take to ride {distance} miles?</>,
        answer: time,
        suffix: "hours",
        hint: `How many groups of ${rate} miles fit in ${distance}?`,
        explain: `${distance} ÷ ${rate} = ${time} hours.`,
      },
    },
  ];
};

// Q6 — direct unit price: no diagram, no color, money. Easy: a single division to a unit price.
// Pool excludes whole-dollar values so the answer always genuinely requires decimal division.
const directUnitPriceQuestion = (): TestQuestion[] => {
  const unitPrice = pick([0.5, 0.75, 1.25, 1.5, 1.75, 2.25, 2.5]);
  const units = randInt(3, 8);
  const total = unitPrice * units;
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: <>A shop sells {units} notebooks for a total of {money(total)}. What is the price per notebook? If it's not a whole dollar amount, write it with two decimal places (like 3.50).</>,
        prefix: "$",
        answer: unitPrice,
        money: true,
        hint: `${money(total)} ÷ ${units} = ?`,
        explain: `${money(total)} ÷ ${units} = ${money(unitPrice)} per notebook.`,
      },
    },
  ];
};

// Q7 — fractional work rate: no diagram, no color (past question 4, color coding is reserved for the
// early questions, same as every other MM1 unit test). Hard: a rate less than 1, same skill as
// lawnCrewQuestions' reciprocal step but a fresh scenario. h is drawn from {2, 4, 5} for the same
// terminating-decimal reason as lawnCrewQuestions' L.
const fenceCrewQuestion = (): TestQuestion[] => {
  const h = pick([2, 4, 5]); // hours
  let p = randInt(1, h - 1); // fences
  while (gcd(p, h) !== 1) {
    p = randInt(1, h - 1);
  }
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: <>A crew paints {p} fence{p === 1 ? "" : "s"} every {h} hours, working at a constant rate. What is the rate in fences per hour?</>,
        answer: p / h,
        suffix: "fences per hour",
        hint: `Fences ÷ hours = ${p} ÷ ${h}.`,
        explain: `${p} ÷ ${h} = ${fracText(p, h)} of a fence per hour.`,
      },
    },
  ];
};

const goods = [
  { many: "granola bars" },
  { many: "pencils" },
  { many: "bottles of water" },
  { many: "packs of gum" },
];

// Q8 — better buy: no diagram, no color, multiple choice. Medium: recognize the correct better-buy sentence.
// Distractors are reasoning mistakes (wrong store, right store wrong price, "same price") — not a formatting
// trap, same reasoning UnitRateTest's juiceBottlesQuestion uses for its money distractors.
const betterBuyQuestion = (): TestQuestion[] => {
  const g = pick(goods);
  const prices = [0.25, 0.5, 0.75, 1.25, 1.5, 1.75, 2.25, 2.5];
  const u1 = pick(prices);
  let u2 = pick(prices);
  while (u1 === u2) u2 = pick(prices);
  const n1 = randInt(3, 8);
  let n2 = randInt(3, 10);
  while (n1 === n2) n2 = randInt(3, 10);
  const p1 = u1 * n1;
  const p2 = u2 * n2;
  const better = u1 < u2 ? "Store A" : "Store B";
  const worse = better === "Store A" ? "Store B" : "Store A";
  const betterPrice = Math.min(u1, u2);
  const worsePrice = Math.max(u1, u2);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: <>Store A sells {n1} {g.many} for {money(p1)}. Store B sells {n2} {g.many} for {money(p2)}. Which sentence correctly identifies the better buy?</>,
          hint: "Find the price per item at each store, then compare.",
          explain: `${money(p1)} ÷ ${n1} and ${money(p2)} ÷ ${n2} give the two unit prices — ${better}'s is lower, at ${money(betterPrice)} per item.`,
        },
        `${better} is the better buy, at ${money(betterPrice)} per item.`,
        [`${worse} is the better buy, at ${money(betterPrice)} per item.`, `${better} is the better buy, at ${money(worsePrice)} per item.`, "Both stores have the same price per item."]
      ),
    },
  ];
};

// Q9 — scaled distance: no diagram, no color, multiple choice. Hard: combine a unit-rate step with a scaling step.
// Distractors are the classic skipped-unit-rate mistakes (scaling the total directly, dividing instead of
// multiplying, an extra factor) — same "no formatting gotcha" reasoning as UnitRateTest's smoothieBarQuestion.
const scaledDistanceQuestion = (): TestQuestion[] => {
  const rate = pick([30, 35, 40, 45, 50, 55, 60]); // miles per hour
  const baseHours = randInt(2, 5);
  const baseMiles = rate * baseHours;
  let newHours = randInt(6, 9);
  while (newHours === baseHours) newHours = randInt(6, 9);
  const newMiles = rate * newHours;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>A train travels {baseMiles} miles in {baseHours} hours at a constant speed. At that rate, which sentence correctly describes how far it travels in {newHours} hours?</>,
          hint: "First find the unit rate (miles per hour), then multiply by the new number of hours.",
          explain: `${baseMiles} ÷ ${baseHours} = ${rate} miles per hour. ${rate} × ${newHours} = ${newMiles} miles.`,
        },
        `It travels ${newMiles} miles in ${newHours} hours.`,
        [`It travels ${Math.round(baseMiles / newHours)} miles in ${newHours} hours.`, `It travels ${baseMiles * newHours} miles in ${newHours} hours.`, `It travels ${baseMiles} miles in ${newHours} hours.`]
      ),
    },
  ];
};

// Q10 — reciprocal speed: no diagram, no color, multiple choice. Hard: recognize the correctly-flipped unit rate,
// same skill as UnitRateTest's paintCrewQuestion/paintingQuestion but themed to this unit's speed scenario.
const reciprocalSpeedQuestion = (): TestQuestion[] => {
  const rate = pick([20, 25, 30, 40, 50]); // miles per hour
  const hours = randInt(2, 5);
  const miles = rate * hours;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>A train travels {miles} miles in {hours} hours at a constant speed. Which sentence correctly describes how many hours it takes to travel 1 mile?</>,
          hint: `First find miles per hour (${miles} ÷ ${hours}), then flip it: instead of miles per hour, think hours per mile.`,
          explain: `${miles} ÷ ${hours} = ${rate} miles per hour, which flips to ${fracText(1, rate)} of an hour per mile.`,
        },
        `It takes ${fracText(1, rate)} of an hour to travel 1 mile.`,
        [`It takes ${rate} hours to travel 1 mile.`, `It takes ${fracText(1, hours)} of an hour to travel 1 mile.`, `It takes ${fracText(1, miles)} of an hour to travel 1 mile.`]
      ),
    },
  ];
};

export const rateProblemsTest: Unit["test"] = {
  questions: [
    roadTripQuestion,
    storeTapeQuestion,
    lawnCrewQuestions,
    reverseSpeedQuestion,
    directUnitPriceQuestion,
    fenceCrewQuestion,
    betterBuyQuestion,
    scaledDistanceQuestion,
    reciprocalSpeedQuestion,
  ],
  passScore: 9,
};
