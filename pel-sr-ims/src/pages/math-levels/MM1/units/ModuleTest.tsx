import { gcd, money, pick, randInt } from "../../shared/lib/math";
import { numberBlank, selectBlank, sentence, type TestQuestion } from "../../shared/engine/types";
import type { Unit } from "../../shared/units/types";
import { classroomQuestions, fishTankQuestion } from "./RatioLanguageTest";
import { candleShopQuestions } from "./UnitRateTest";
import { proportionQuestion, simplifyBaseQuestion } from "./TablesGraphsTest";
import { reverseSpeedQuestion, fenceCrewQuestion } from "./RateProblemsTest";
import { theaterSeatsQuestion, cookieGoalQuestion } from "./PercentTest";
import { rateDistanceQuestion } from "./ConversionsTest";

// ---------- end-of-MODULE test: Ratio Lab ----------
// 20 questions, a few from each of the 6 units, cumulative across the whole
// module. Unlike every per-unit *Test.tsx (which deliberately mixes in
// diagrams, QA/QB color-coded text, and multiple-choice "sentence" questions
// for pedagogy and variety), this test strips most of that scaffolding out —
// almost every question is plain prose, free-type (`number`/`ratio`, never
// `choice`), medium or hard, and solvable using only the numbers stated in
// its own prompt. The one deliberate exception is the final 3 questions
// (Q7, Q18, Q20 by position): instead of a ChoiceStep ("pick the one
// correct full sentence" from 4 options), they're SentenceSteps — the
// student fills in just the 2 blanks that vary, each a small dropdown of
// options — same spirit as the per-unit tests' MC "sentence" questions, but
// without the full-sentence recognition shortcut.
//
// Cataloging every generator in the 6 unit tests against the "no diagram, no
// color, no choice, medium/hard, self-contained" bar turned up only 13
// qualifying questions (2-3 per unit, mostly medium) — the unit tests just
// weren't built with this bar in mind. So this file reuses those 13
// (imported from their unit's *Test.tsx, now exported for this purpose) and
// adds new generators to fill the gaps and add more hard-difficulty
// coverage, following the same disciplines as every other MM1 test:
// generate the final answer's building blocks FIRST so the arithmetic always
// lands clean, and every question independently restates its own scenario.

// classroomQuestions is a non-leading [easy, medium] pair in its home unit
// test — only the medium half qualifies here.
const classroomSimplified = (): TestQuestion[] => [classroomQuestions()[1]];

// ---- Ratio Language: new hard — a 3-category whole makes the "add them all
// up, then simplify" skill less obvious than a plain 2-number gcd.
const bookFairQuestion = (): TestQuestion[] => {
  let myst = randInt(2, 4);
  let comic = randInt(2, 4);
  let pic = randInt(2, 4);
  while (gcd(pic, myst + comic + pic) !== 1) {
    myst = randInt(2, 4);
    comic = randInt(2, 4);
    pic = randInt(2, 4);
  }
  const scale = randInt(2, 4);
  const [m, c, p] = [myst * scale, comic * scale, pic * scale];
  const total = m + c + p;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "ratio",
        prompt: `A book fair sold ${m} mystery books, ${c} comic books, and ${p} picture books. What is the ratio of picture books to all the books sold, in simplest form?`,
        answer: [pic, myst + comic + pic],
        tones: "none",
        equivalentHint: `${p}:${total} is correct but not simplest form — divide both numbers by their greatest common factor.`,
        hint: `All the books = ${m} + ${c} + ${p}. Find the biggest number that divides both that total and ${p}.`,
        explain: `${p} of the ${total} books are picture books. ${p}:${total} simplifies to ${pic}:${myst + comic + pic}.`,
      },
    },
  ];
};

// ---- Unit Rate: new hard — same "reduce to the base rate first" skill as
// UnitRateTest's cookieSaleQuestion (k2 is never a multiple of k1, so the
// stated numbers can't just be scaled directly — you must reduce first).
const factoryQuestion = (): TestQuestion[] => {
  let p = randInt(2, 4); // parts per base unit
  let q = randInt(2, 5); // hours per base unit
  while (gcd(p, q) !== 1) {
    p = randInt(2, 4);
    q = randInt(2, 5);
  }
  const k1 = randInt(3, 5);
  let k2 = randInt(6, 9);
  while (k2 % k1 === 0) k2 = randInt(6, 9);
  const parts1 = p * k1;
  const hours1 = q * k1;
  const targetParts = p * k2;
  const answer = q * k2;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `A factory produces ${parts1} parts every ${hours1} hours, working at a constant rate. At that rate, how many hours would it take to produce ${targetParts} parts?`,
        answer,
        suffix: "hours",
        hint: `First reduce ${parts1}:${hours1} to parts per hour, then scale that rate to match ${targetParts} parts.`,
        explain: `${parts1} parts in ${hours1} hours reduces to ${p} parts every ${q} hours. Scaling that up to ${targetParts} parts takes ${answer} hours.`,
      },
    },
  ];
};

// ---- Position 7: new SentenceStep, medium — same better-buy comparison
// skill as RateProblemsTest's betterBuyQuestion/UnitRateTest's
// juiceBottlesQuestion, but the student fills in just the two blanks that
// vary (which store, and its unit price) instead of recognizing one whole
// pre-written sentence. The third distractor (summed price) is a genuine
// "added instead of compared" mistake, never a formatting trap.
const goods = ["bottles of water", "granola bars", "pencils", "packs of gum"];
const betterBuySentenceQuestion = (): TestQuestion[] => {
  const item = pick(goods);
  const prices = [0.25, 0.5, 0.75, 1.25, 1.5, 1.75, 2.25, 2.5];
  const u1 = pick(prices);
  let u2 = pick(prices);
  while (u1 === u2) u2 = pick(prices);
  const n1 = randInt(3, 8);
  let n2 = randInt(3, 10);
  while (n1 === n2) n2 = randInt(3, 10);
  const p1 = u1 * n1;
  const p2 = u2 * n2;
  const aIsBetter = u1 < u2;
  const betterPrice = Math.min(u1, u2);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: sentence(
        {
          prompt: `Store A sells ${n1} ${item} for ${money(p1)}. Store B sells ${n2} ${item} for ${money(p2)}. Fill in both blanks to correctly identify the better buy. If the price isn't a whole dollar amount, write it with two decimal places (like 1.50).`,
          hint: "Find the price per item at each store, then compare.",
          explain: `${money(p1)} ÷ ${n1} and ${money(p2)} ÷ ${n2} give the two unit prices — ${aIsBetter ? "Store A" : "Store B"}'s is lower, at ${money(betterPrice)} per item.`,
        },
        "Store ",
        selectBlank(aIsBetter ? "A" : "B", [aIsBetter ? "B" : "A"]),
        " is the better buy, at $",
        numberBlank(betterPrice, true),
        " per item."
      ),
    },
  ];
};

// ---- Rate Problems: new hard — a unit-conversion step (hours → minutes)
// threaded through a rate problem.
const conveyorBeltQuestion = (): TestQuestion[] => {
  const rate = pick([8, 10, 12, 15, 20, 24]); // feet per minute
  const hours = pick([1, 2, 3]);
  const minutes = hours * 60;
  const answer = rate * minutes;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `A conveyor belt moves at a constant rate of ${rate} feet per minute. How many feet does it move in ${hours} hour${hours === 1 ? "" : "s"}?`,
        answer,
        suffix: "feet",
        hint: `First change ${hours} hour${hours === 1 ? "" : "s"} into minutes, then multiply by ${rate}.`,
        explain: `${hours} hour${hours === 1 ? "" : "s"} = ${minutes} minutes. ${rate} × ${minutes} = ${answer} feet.`,
      },
    },
  ];
};

// ---- Rate Problems: new medium — straightforward scale-up, fresh scenario.
const waterTankQuestion = (): TestQuestion[] => {
  const rate = randInt(3, 9); // gallons
  const time = randInt(2, 5); // minutes
  const scale = randInt(2, 5);
  const newTime = time * scale;
  const answer = rate * scale;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `A water tank fills at a constant rate of ${rate} gallons every ${time} minutes. How many gallons does it fill in ${newTime} minutes?`,
        answer,
        suffix: "gallons",
        hint: `${newTime} is ${scale} times ${time}, so the gallons are also ${scale} times as much.`,
        explain: `${newTime} ÷ ${time} = ${scale}, so ${rate} × ${scale} = ${answer} gallons.`,
      },
    },
  ];
};

// ---- Percent: new hard — percent-of-a-percent, two layers of the 10%-block
// strategy. W is a multiple of 100 so both layers divide cleanly by 10.
const bakeryPercentQuestion = (): TestQuestion[] => {
  const W = randInt(2, 9) * 100; // loaves baked
  const p = pick([20, 30, 40, 60, 70, 80, 90]);
  const morningSold = (W / 10) * (p / 10);
  const q = pick([20, 30, 40, 60, 70, 80, 90]);
  const sourdough = (morningSold / 10) * (q / 10);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `A bakery baked ${W} loaves of bread. ${p}% of them sold in the morning. Of the loaves sold in the morning, ${q}% were sourdough. How many sourdough loaves sold in the morning?`,
        answer: sourdough,
        suffix: "loaves",
        hint: `First find ${p}% of ${W} (the loaves sold in the morning). Then find ${q}% of that number.`,
        explain: `${p}% of ${W} is ${morningSold}. ${q}% of ${morningSold} is ${sourdough}.`,
      },
    },
  ];
};

// ---- Unit Conversions: new hard — a rate step (multiply) plus a conversion
// step. States the conversion fact itself, so no recalled unit knowledge is needed.
const truckLoadQuestion = (): TestQuestion[] => {
  const poundsPerBox = randInt(2, 5);
  const boxes = randInt(3, 6);
  const totalPounds = poundsPerBox * boxes;
  const answer = totalPounds * 16;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `A truck carries ${boxes} boxes, each weighing ${poundsPerBox} pounds. How many OUNCES is that in total? (1 pound = 16 ounces.)`,
        answer,
        suffix: "ounces",
        hint: `First find the total pounds (${poundsPerBox} × ${boxes}), then convert pounds to ounces.`,
        explain: `${poundsPerBox} × ${boxes} = ${totalPounds} pounds. ${totalPounds} × 16 = ${answer} ounces.`,
      },
    },
  ];
};

// ---- Position 18: new SentenceStep, hard — same multiply-vs-divide-and-why
// reasoning as ConversionsTest's smallerUnitReasoningQuestion/
// biggerUnitReasoningQuestion, merged into one generator (random direction)
// and converted to two fill-in blanks instead of a full pre-written sentence.
const conversionFacts = [
  { bigs: "feet", smalls: "inches", f: 12 },
  { bigs: "yards", smalls: "feet", f: 3 },
  { bigs: "pounds", smalls: "ounces", f: 16 },
  { bigs: "meters", smalls: "centimeters", f: 100 },
  { bigs: "gallons", smalls: "quarts", f: 4 },
];
const unitConversionSentenceQuestion = (): TestQuestion[] => {
  const c = pick(conversionFacts);
  const toSmaller = Math.random() < 0.5;
  const fromUnit = toSmaller ? c.bigs : c.smalls;
  const toUnit = toSmaller ? c.smalls : c.bigs;
  const sizeWord = toSmaller ? "smaller" : "bigger";
  const opCorrect = toSmaller ? "multiply" : "divide";
  const opWrong = toSmaller ? "divide" : "multiply";
  const numCorrect = toSmaller ? "bigger" : "smaller";
  const numWrong = toSmaller ? "smaller" : "bigger";
  return [
    {
      visual: null,
      difficulty: "hard",
      step: sentence(
        {
          prompt: `Converting ${fromUnit} to ${toUnit} (a ${sizeWord} unit), fill in both blanks to correctly describe what to do and why.`,
          hint:
            toSmaller
              ? "A smaller unit means you need MORE of them to describe the same amount."
              : "A bigger unit means you need FEWER of them to describe the same amount.",
          explain:
            toSmaller
              ? `Going to a smaller unit, you need more of them: multiply by ${c.f}.`
              : `Going to a bigger unit, you need fewer of them: divide by ${c.f}.`,
        },
        "You ",
        selectBlank(opCorrect, [opWrong]),
        ` by ${c.f}, because a ${sizeWord} unit needs a `,
        selectBlank(numCorrect, [numWrong]),
        " number."
      ),
    },
  ];
};

// ---- Position 20: new SentenceStep, medium — same "find each rate, then
// compare" skill as TablesGraphsTest's fasterRateQuestion. Earlier draft had
// blank2 as a faster/slower dropdown alongside the team-name blank, but
// "Team A is faster" and "Team B is slower" are both equally true statements
// about the same fact — two valid answers for one supposedly-unique slot.
// Fixed by replacing that blank with the faster team's actual per-minute
// rate (a free-typed number): exactly one team and exactly one rate are
// correct, no symmetric rephrasing possible. Rates are generated directly as
// clean integers (not derived via LCM scaling), then scaled up by a random
// per-team multiplier for the stated numbers, so the per-minute rate still
// has to be computed, not just read off.
const fasterRateSentenceQuestion = (): TestQuestion[] => {
  const rateA = randInt(2, 8); // balloons per minute
  let rateB = randInt(2, 8);
  while (rateB === rateA) rateB = randInt(2, 8);
  const mA = randInt(2, 5);
  const mB = randInt(2, 5);
  const balloonsA = rateA * mA;
  const balloonsB = rateB * mB;
  const aFaster = rateA > rateB;
  const fasterTeam = aFaster ? "A" : "B";
  const fasterRate = aFaster ? rateA : rateB;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: sentence(
        {
          prompt: `Team A inflates ${balloonsA} balloons every ${mA} minutes. Team B inflates ${balloonsB} balloons every ${mB} minutes. Fill in both blanks to correctly compare their speeds.`,
          hint: "Find each team's balloons-per-minute rate, then compare.",
          explain: `Team A: ${balloonsA} ÷ ${mA} = ${rateA} balloons per minute. Team B: ${balloonsB} ÷ ${mB} = ${rateB} balloons per minute. Team ${fasterTeam} is faster.`,
        },
        "Team ",
        selectBlank(fasterTeam, [fasterTeam === "A" ? "B" : "A"]),
        " is faster, at ",
        numberBlank(fasterRate),
        " balloons per minute."
      ),
    },
  ];
};

// Flattened question count — the `questions` array below is generator
// FUNCTIONS, and one of them (candleShopQuestions) returns 2 questions, so
// `questions.length` (19) doesn't equal the real total (20). Exported
// separately rather than computed by actually calling every generator, which
// would burn a random draw from each just to count them.
export const MODULE_TEST_TOTAL = 20;

/**
 * 1-5 star rating for a module test score out of 20 — a coarser, letter-
 * grade-style read on the same score TestBadge shows precisely (19/20).
 * Bands line up with A-F cutoffs by percentage (<60/60s/70s/80s/90+), just
 * expressed as the raw score out of 20 the bands land on exactly.
 */
export const moduleTestStars = (score: number): number => {
  if (score >= 18) return 5;
  if (score >= 16) return 4;
  if (score >= 14) return 3;
  if (score >= 12) return 2;
  return 1;
};

export const moduleTest: NonNullable<Unit["test"]> = {
  questions: [
    // Ratio Language
    classroomSimplified,
    fishTankQuestion,
    bookFairQuestion,
    // Unit Rate
    candleShopQuestions,
    factoryQuestion,
    // Position 7: sentence fill-in-the-blank
    betterBuySentenceQuestion,
    // Tables & Graphs
    proportionQuestion,
    simplifyBaseQuestion,
    // Rate Problems
    reverseSpeedQuestion,
    fenceCrewQuestion,
    conveyorBeltQuestion,
    waterTankQuestion,
    // Percent
    theaterSeatsQuestion,
    cookieGoalQuestion,
    bakeryPercentQuestion,
    // Unit Conversions
    rateDistanceQuestion,
    // Position 18: sentence fill-in-the-blank
    unitConversionSentenceQuestion,
    truckLoadQuestion,
    // Position 20: sentence fill-in-the-blank
    fasterRateSentenceQuestion,
  ],
  // 16/20 matches the 4-star cutoff in moduleTestStars above — "passed" (the
  // checkmark on TestBadge, and UnitTestView's "Passed" message) means at
  // least 4 stars, not the full 5.
  passScore: 16,
};
