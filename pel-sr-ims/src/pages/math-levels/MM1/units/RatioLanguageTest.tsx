import React from "react";
import { RatioGroups } from "../diagrams";
import { palette } from "../../shared/lib/palette";
import { gcd, randInt } from "../../shared/lib/math";
import { choice, type TestQuestion } from "../../shared/engine/types";
import { QA, QB, QC } from "../../shared/engine/controls";
import type { Unit } from "../../shared/units/types";

// ---------- end-of-unit test: Ratio language ----------
// 10 questions from 8 generators (library and classroom each produce a non-
// leading pair that shares one scenario's randomized numbers, restated in full
// in each question's own prompt). See MM1/units/types.ts for why `questions`
// is an array of generator functions rather than a flat TestQuestion[].
//
// Most generators also randomize WHICH side of the ratio gets asked (e.g. Q10
// may ask for blue:all or red:all), so retaking the test doesn't always ask
// the exact same question shape. The one exception is Q2 (parking lot): its
// "hard" rating specifically comes from always forcing the reverse-the-order
// step, so that one is NOT randomized — doing so would remove the skill it's
// testing half the time.

// Q1 — fruit basket: diagram + QA/QB color. Easy: read totals straight off the picture.
const fruitBasketQuestion = (): TestQuestion[] => {
  const a1 = randInt(2, 4);
  let b1 = randInt(2, 4);
  while (a1 === b1) b1 = randInt(2, 4);
  const groups = randInt(2, 4);
  const [ta, tb] = [a1 * groups, b1 * groups];
  const applesFirst = Math.random() < 0.5;
  const First = applesFirst ? QA : QB;
  const Second = applesFirst ? QB : QA;
  const firstLabel = applesFirst ? "apples" : "oranges";
  const secondLabel = applesFirst ? "oranges" : "apples";
  return [
    {
      visual: <RatioGroups groups={groups} a={{ count: a1, kind: "circle", color: palette.a, label: "apples" }} b={{ count: b1, kind: "star", color: palette.b, label: "oranges" }} />,
      difficulty: "easy",
      step: {
        kind: "ratio",
        prompt: (
          <>
            Using the picture, what is the ratio of <First>{firstLabel}</First> to <Second>{secondLabel}</Second>? Count everything you see — you don't need to simplify.
          </>
        ),
        answer: applesFirst ? [ta, tb] : [tb, ta],
        labels: [firstLabel, secondLabel],
        tones: applesFirst ? ["a", "b"] : ["b", "a"],
        equivalentHint: "That's an equivalent ratio, but this question wants the totals you count in the picture, not a reduced version.",
        hint: `Count all the ${firstLabel}, then count all the ${secondLabel}.`,
        explain: `There are ${ta} apples and ${tb} oranges in all, so the ratio of ${firstLabel} to ${secondLabel} is ${applesFirst ? `${ta}:${tb}` : `${tb}:${ta}`}.`,
      },
    },
  ];
};

// Q2 — parking lot: diagram, no color. Hard: read picture, reverse the order, then simplify.
const parkingLotQuestion = (): TestQuestion[] => {
  const b1 = randInt(1, 2); // trucks per row
  let a1 = randInt(3, 5); // cars per row
  while (gcd(a1, b1) !== 1) a1 = randInt(3, 5);
  const rows = randInt(3, 5);
  const [totalCars, totalTrucks] = [a1 * rows, b1 * rows];
  return [
    {
      visual: (
        <>
          <RatioGroups groups={rows} a={{ count: a1, kind: "square", color: palette.a, label: "cars" }} b={{ count: b1, kind: "triangle", color: palette.b, label: "trucks" }} />
          <p className="legend">
            <span className="key qa-bg" /> cars <span className="key qb-bg" /> trucks
          </p>
        </>
      ),
      difficulty: "hard",
      step: {
        kind: "ratio",
        prompt: <>Using the picture, write the ratio of trucks to cars in simplest form.</>,
        answer: [b1, a1],
        labels: ["trucks", "cars"],
        tones: "none",
        equivalentHint: `${totalTrucks}:${totalCars} is correct but not simplest form — divide both by the number of rows (${rows}).`,
        hint: `Count all the trucks and all the cars first, then reduce.`,
        explain: `${totalTrucks} trucks and ${totalCars} cars simplify to ${b1}:${a1}.`,
      },
    },
  ];
};

// Q3/Q4 — school library: no diagram, color text. Easy direct ratio, then medium part-to-whole.
const libraryQuestions = (): TestQuestion[] => {
  let m = randInt(6, 12);
  let adv = randInt(6, 12);
  while (gcd(m, adv) !== 1) {
    m = randInt(6, 12);
    adv = randInt(6, 12);
  }
  const mysteryFirst = Math.random() < 0.5;
  const First = mysteryFirst ? QA : QB;
  const Second = mysteryFirst ? QB : QA;
  const firstLabel = mysteryFirst ? "mystery books" : "adventure books";
  const secondLabel = mysteryFirst ? "adventure books" : "mystery books";

  const askAdventure = Math.random() < 0.5; // which part is asked against the whole, independently of Q3's order
  const PartQ = askAdventure ? QB : QA;
  const partLabel = askAdventure ? "adventure books" : "mystery books";
  const partCount = askAdventure ? adv : m;

  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "ratio",
        prompt: (
          <>
            A school library has <QA>{m} mystery books</QA> and <QB>{adv} adventure books</QB>. What is the ratio of <First>{firstLabel}</First> to <Second>{secondLabel}</Second>?
          </>
        ),
        answer: mysteryFirst ? [m, adv] : [adv, m],
        labels: [firstLabel, secondLabel],
        tones: mysteryFirst ? ["a", "b"] : ["b", "a"],
        hint: `Use the order named in the question — ${firstLabel} first.`,
        explain: mysteryFirst ? `${m}:${adv}.` : `${adv}:${m}.`,
      },
    },
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "ratio",
        prompt: (
          <>
            A school library has {m} mystery books and {adv} adventure books. What is the ratio of <PartQ>{partLabel}</PartQ> to <QC>all the books</QC> in the library?
          </>
        ),
        answer: [partCount, m + adv],
        labels: [partLabel, "all books"],
        tones: askAdventure ? ["b", "c"] : ["a", "c"],
        equivalentHint: "That's an equivalent ratio, but use the actual book counts from this library, not a reduced version.",
        hint: `All the books = ${m} mystery + ${adv} adventure.`,
        explain: `${partCount} of the ${m + adv} books are ${partLabel}, so the ratio is ${partCount}:${m + adv}.`,
      },
    },
  ];
};

// Q5/Q6 — classroom: no diagram, no color. Easy direct ratio, then medium simplify.
// Both questions in the pair use the same asked order, so the cluster reads as one story.
const classroomQuestions = (): TestQuestion[] => {
  let p = randInt(2, 5);
  let q = randInt(2, 6);
  while (gcd(p, q) !== 1) {
    p = randInt(2, 5);
    q = randInt(2, 6);
  }
  const scale = randInt(2, 4);
  const [boys, girls] = [p * scale, q * scale];
  const boysFirst = Math.random() < 0.5;
  const firstLabel = boysFirst ? "boys" : "girls";
  const secondLabel = boysFirst ? "girls" : "boys";
  const [firstCount, secondCount] = boysFirst ? [boys, girls] : [girls, boys];
  const [firstSimple, secondSimple] = boysFirst ? [p, q] : [q, p];
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "ratio",
        prompt: <>A classroom has {boys} boys and {girls} girls. Write the ratio of {firstLabel} to {secondLabel} — you don't need to simplify this one.</>,
        answer: [firstCount, secondCount],
        labels: [firstLabel, secondLabel],
        tones: "none",
        equivalentHint: `That's an equivalent ratio, but this question wants ${firstCount}:${secondCount} as given, not reduced.`,
        hint: `Use the order named in the question — ${firstLabel} first.`,
        explain: `${firstCount}:${secondCount}.`,
      },
    },
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "ratio",
        prompt: <>A classroom has {boys} boys and {girls} girls. Write the ratio of {firstLabel} to {secondLabel} in simplest form.</>,
        answer: [firstSimple, secondSimple],
        labels: [firstLabel, secondLabel],
        tones: "none",
        equivalentHint: `${firstCount}:${secondCount} is correct but not simplest form — divide both numbers by their greatest common factor.`,
        hint: `Find the biggest number that divides both ${firstCount} and ${secondCount}.`,
        explain: `${firstCount} and ${secondCount} both divide by ${scale}, giving ${firstSimple}:${secondSimple}.`,
      },
    },
  ];
};

// Q7 — fish tank: no diagram, no color. Medium: part-to-whole, simplified.
const fishTankQuestion = (): TestQuestion[] => {
  let p = randInt(2, 4); // goldfish per unit
  let q = randInt(3, 6); // guppies per unit
  while (gcd(p, q) !== 1) {
    p = randInt(2, 4);
    q = randInt(3, 6);
  }
  const scale = randInt(2, 3);
  const [goldfish, guppies] = [p * scale, q * scale];
  const askGoldfish = Math.random() < 0.5;
  const partLabel = askGoldfish ? "goldfish" : "guppies";
  const partTotal = askGoldfish ? goldfish : guppies;
  const partSimple = askGoldfish ? p : q;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "ratio",
        prompt: <>A fish tank has {goldfish} goldfish and {guppies} guppies. What is the ratio of {partLabel} to all the fish in the tank, in simplest form?</>,
        answer: [partSimple, p + q],
        labels: [partLabel, "all fish"],
        tones: "none",
        equivalentHint: `${partTotal}:${goldfish + guppies} is correct but not simplest form — divide both numbers by their greatest common factor.`,
        hint: `Both numbers share a factor of ${scale}.`,
        explain: `${partTotal}:${goldfish + guppies} simplifies to ${partSimple}:${p + q}.`,
      },
    },
  ];
};

// The final 3 questions are all multiple-choice "sentence" questions — same
// quilt-style format, each testing one distinct ratio-language skill: a
// part-to-part ratio that needs simplifying, a part-to-part ratio whose
// wording order is flipped from how it's asked, and a part-to-whole ratio
// that needs simplifying.

// Q8 — orchard: no diagram, no color, multiple choice. Medium: part-to-part, simplified.
const orchardQuestion = (): TestQuestion[] => {
  let p = randInt(2, 5);
  let q = randInt(2, 6);
  while (gcd(p, q) !== 1) {
    p = randInt(2, 5);
    q = randInt(2, 6);
  }
  const scale = randInt(2, 4);
  const [peaches, plums] = [p * scale, q * scale];
  const peachesFirst = Math.random() < 0.5;
  const firstLabel = peachesFirst ? "peaches" : "plums";
  const secondLabel = peachesFirst ? "plums" : "peaches";
  const [firstSimple, secondSimple] = peachesFirst ? [p, q] : [q, p];
  const [firstTotal, secondTotal] = peachesFirst ? [peaches, plums] : [plums, peaches];
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: <>An orchard has {peaches} peaches and {plums} plums. Which sentence correctly describes the ratio of {firstLabel} to {secondLabel}, in simplest form?</>,
          hint: `Find the biggest number that divides both totals, and keep ${firstLabel} first.`,
          explain: `${firstTotal} and ${secondTotal} both divide by ${scale}, giving ${firstSimple}:${secondSimple}.`,
        },
        `The ratio of ${firstLabel} to ${secondLabel} is ${firstSimple}:${secondSimple}.`,
        [
          `The ratio of ${firstLabel} to ${secondLabel} is ${firstTotal}:${secondTotal}.`,
          `The ratio of ${firstLabel} to ${secondLabel} is ${secondSimple}:${firstSimple}.`,
          `The ratio of ${firstLabel} to ${secondLabel} is ${firstSimple}:${firstSimple + secondSimple}.`,
        ]
      ),
    },
  ];
};

// Q9 — bakery: no diagram, no color, multiple choice. Hard: part-to-part, flipped from how it's stated.
const bakeryQuestion = (): TestQuestion[] => {
  let muffins = randInt(3, 6);
  let croissants = randInt(5, 9);
  while (gcd(muffins, croissants) !== 1) {
    muffins = randInt(3, 6);
    croissants = randInt(5, 9);
  }
  // Which item is named first in the sentence varies; the asked ratio is always
  // the reverse of however it's stated, so the "flip" skill is always required.
  const muffinsStatedFirst = Math.random() < 0.5;
  const statedFirstLabel = muffinsStatedFirst ? "muffins" : "croissants";
  const statedSecondLabel = muffinsStatedFirst ? "croissants" : "muffins";
  const [statedFirstCount, statedSecondCount] = muffinsStatedFirst ? [muffins, croissants] : [croissants, muffins];
  const askedFirstLabel = statedSecondLabel;
  const askedSecondLabel = statedFirstLabel;
  const [askedFirstCount, askedSecondCount] = [statedSecondCount, statedFirstCount];
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: (
            <>
              A bakery sells {statedFirstCount} {statedFirstLabel} for every {statedSecondCount} {statedSecondLabel}. Which sentence correctly describes the ratio of {askedFirstLabel} to {askedSecondLabel}?
            </>
          ),
          hint: `The sentence names ${statedFirstLabel} first, but the question asks for ${askedFirstLabel} first — flip the order.`,
          explain: `The sentence gives ${statedFirstLabel}:${statedSecondLabel} as ${statedFirstCount}:${statedSecondCount}, so ${askedFirstLabel}:${askedSecondLabel} is ${askedFirstCount}:${askedSecondCount}.`,
        },
        `The ratio of ${askedFirstLabel} to ${askedSecondLabel} is ${askedFirstCount}:${askedSecondCount}.`,
        [
          `The ratio of ${askedFirstLabel} to ${askedSecondLabel} is ${askedSecondCount}:${askedFirstCount}.`,
          `The ratio of ${askedFirstLabel} to ${askedSecondLabel} is ${askedFirstCount}:${askedFirstCount + askedSecondCount}.`,
          `The ratio of ${askedFirstLabel} to ${askedSecondLabel} is ${askedSecondCount}:${askedFirstCount + askedSecondCount}.`,
        ]
      ),
    },
  ];
};

// Q10 — quilt pattern: no diagram, no color, multiple choice. Hard: part-to-whole, simplified.
const quiltQuestion = (): TestQuestion[] => {
  let p = randInt(2, 4); // blue squares per unit
  let q = randInt(3, 5); // red squares per unit
  while (gcd(p, q) !== 1) {
    p = randInt(2, 4);
    q = randInt(3, 5);
  }
  const scale = randInt(2, 3);
  const [blue, red] = [p * scale, q * scale];
  const total = blue + red;
  const askBlue = Math.random() < 0.5;
  const partLabel = askBlue ? "blue" : "red";
  const partTotal = askBlue ? blue : red;
  const partSimple = askBlue ? p : q;
  const otherSimple = askBlue ? q : p;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>A quilt pattern has {blue} blue squares and {red} red squares. Which sentence correctly describes the ratio of {partLabel} squares to all the squares, in simplest form?</>,
          hint: `All the squares = ${blue} blue + ${red} red. Add first, then simplify.`,
          explain: `${partTotal} of the ${total} squares are ${partLabel}, which simplifies to ${partSimple}:${p + q}.`,
        },
        `The ratio of ${partLabel} squares to all the squares is ${partSimple}:${p + q}.`,
        [
          `The ratio of ${partLabel} squares to all the squares is ${partTotal}:${total}.`,
          `The ratio of ${partLabel} squares to all the squares is ${otherSimple}:${p + q}.`,
          `The ratio of ${partLabel} squares to all the squares is ${partSimple}:${otherSimple}.`,
        ]
      ),
    },
  ];
};

export const ratioLanguageTest: Unit["test"] = {
  questions: [fruitBasketQuestion, parkingLotQuestion, libraryQuestions, classroomQuestions, fishTankQuestion, orchardQuestion, bakeryQuestion, quiltQuestion],
  passScore: 9,
};
