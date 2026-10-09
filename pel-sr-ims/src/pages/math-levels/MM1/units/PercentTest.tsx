import React from "react";
import { PercentGrid, TapeDiagram } from "../diagrams";
import { palette } from "../../shared/lib/palette";
import { pick, randInt } from "../../shared/lib/math";
import { choice, type TestQuestion } from "../../shared/engine/types";
import { QA, QB } from "../../shared/engine/controls";
import type { Unit } from "../../shared/units/types";

// ---------- end-of-unit test: Percent ----------
// 10 questions from 9 generators (the fish tank scenario produces a non-leading
// pair that shares its randomized numbers, restated in full in each question's
// own prompt). Same shape as the other three tests: 2 diagrams, 2 colored, 6
// plain (3 free-type + 3 multiple-choice "sentence" questions), 3 easy/4
// medium/3 hard, 9/10 to pass.
//
// Every percent comes from a pool that excludes 50% (matching findPartProblem/
// findWholeProblem's own pools) — 50% lets a student double/halve their way to
// the answer without ever using the 10%-block strategy this unit teaches, the
// same reasoning that removed it from practice. Since every number here is
// built from a multiple of 10, every answer is a clean integer — there's no
// fraction/"simplest form" ambiguity to disambiguate the way the ratio-based
// tests needed, so none of that machinery appears here.

// Q1 — shaded grid: diagram + QA color. Easy: read a percent straight off the 100-grid.
const shadedGridQuestion = (): TestQuestion[] => {
  const pct = pick([10, 20, 30, 40, 60, 70, 80, 90]);
  return [
    {
      visual: <PercentGrid filled={pct} color={palette.a} size={200} />,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: <>What <QA>percent</QA> of the grid is shaded?</>,
        answer: pct,
        suffix: "%",
        hint: "Count the shaded squares — each one is 1%.",
        explain: `${pct} of 100 squares are shaded, so ${pct}% is shaded.`,
      },
    },
  ];
};

// Q2 — shaded tape: diagram, no color. Hard: blocks shown, per-block value hidden — compute it.
const shadedTapeQuestion = (): TestQuestion[] => {
  const whole = randInt(2, 30) * 10;
  const pct = pick([10, 20, 30, 40, 60, 70, 80, 90]);
  const shadedBlocks = pct / 10;
  const perBlock = whole / 10;
  const answer = perBlock * shadedBlocks;
  return [
    {
      visual: (
        <TapeDiagram
          tapes={[
            {
              label: "amount",
              units: 10,
              color: palette.a,
              softColor: palette.aSoft,
              shaded: shadedBlocks,
              values: Array(10).fill("?"),
              total: `${whole} = 100%`,
            },
          ]}
          unitWidth={38}
        />
      ),
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: <>The tape shows {shadedBlocks} of the 10 blocks shaded. How much does that represent?</>,
        answer,
        hint: `Each block is ${whole} ÷ 10 = ${perBlock}. There are ${shadedBlocks} shaded blocks.`,
        explain: `${whole} ÷ 10 = ${perBlock} per block. ${shadedBlocks} × ${perBlock} = ${answer}.`,
      },
    },
  ];
};

// Q3/Q4 — fish tank: no diagram, color text. Easy "per 100" meaning, then medium 10% of the whole.
const fishTankQuestions = (): TestQuestion[] => {
  const W = randInt(2, 30) * 10;
  const p = pick([10, 20, 30, 40, 60, 70, 80, 90]);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: (
          <>
            A fish tank has <QA>{W} fish</QA>. <QB>{p}%</QB> are goldfish. {p}% means {p} out of every how many?
          </>
        ),
        answer: 100,
        hint: "Per-cent: “cent” means 100.",
        explain: `${p}% = ${p}/100.`,
      },
    },
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: (
          <>
            A fish tank has <QA>{W} fish</QA>. <QB>{p}%</QB> are goldfish. What is 10% of {W} fish?
          </>
        ),
        prefix: "10% =",
        answer: W / 10,
        suffix: "fish",
        hint: `${W} ÷ 10`,
        explain: `${W} ÷ 10 = ${W / 10}.`,
      },
    },
  ];
};

// Q5 — class vote: no diagram, no color. Easy: how many 10%-blocks make p%.
const classVoteQuestion = (): TestQuestion[] => {
  const p = pick([10, 20, 30, 40, 60, 70, 80, 90]);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: {
        kind: "number",
        prompt: <>{p}% of the class voted yes. How many 10% blocks make {p}%?</>,
        answer: p / 10,
        suffix: "blocks",
        hint: `${p} ÷ 10`,
        explain: `${p} ÷ 10 = ${p / 10} blocks.`,
      },
    },
  ];
};

// Q6 — theater seats: no diagram, no color. Medium: find the part, compressed into one question.
export const theaterSeatsQuestion = (): TestQuestion[] => {
  const W = randInt(2, 30) * 10;
  const p = pick([10, 20, 30, 40, 60, 70, 80, 90]);
  const perBlock = W / 10;
  const blocks = p / 10;
  const part = perBlock * blocks;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: <>A theater has {W} seats. {p}% are reserved. How many seats are reserved?</>,
        answer: part,
        suffix: "seats",
        hint: `First find 10% of ${W}, then multiply by how many 10% blocks make ${p}%.`,
        explain: `10% of ${W} is ${perBlock}. ${p}% is ${blocks} blocks, so ${blocks} × ${perBlock} = ${part}.`,
      },
    },
  ];
};

// Q7 — cookie goal: no diagram, no color. Medium: find the whole, compressed into one question.
export const cookieGoalQuestion = (): TestQuestion[] => {
  const p = pick([20, 30, 40, 60, 70, 80, 90]);
  const n = p / 10;
  const ten = randInt(2, 15);
  const P = ten * n;
  const W = ten * 10;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: <>Maya has baked {P} cookies. That's {p}% of her baking goal for the week. How many cookies is her goal?</>,
        answer: W,
        suffix: "cookies",
        hint: `First find how many 10% blocks make ${p}% (that's ${n}). Then find 10% by dividing ${P} by ${n}, and multiply by 10.`,
        explain: `${P} ÷ ${n} = ${ten} is 10%. ${ten} × 10 = ${W} is the whole.`,
      },
    },
  ];
};

// The final 3 questions are all multiple-choice "sentence" questions: recognize
// the correct part, the correct whole, and — as a capstone — why the 50%
// doubling shortcut this unit avoids doesn't generalize to other percents.

// Q8 — pet store: no diagram, no color, multiple choice. Medium: recognize the correct part.
// p excludes 10% here specifically (on top of the pool-wide 50% exclusion): at p=10 the
// "forgot to scale" distractor (10% of the whole) would equal the correct answer itself.
const petStoreQuestion = (): TestQuestion[] => {
  const W = randInt(2, 30) * 10;
  const p = pick([20, 30, 40, 60, 70, 80, 90]);
  const perBlock = W / 10;
  const blocks = p / 10;
  const part = perBlock * blocks;
  const complementPart = perBlock * (10 - blocks);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: <>A pet store has {W} animals. {p}% are cats. Which sentence correctly describes the number of cats?</>,
          hint: "Find 10% first, then scale it up to the full percent.",
          explain: `${W} ÷ 10 = ${perBlock}. ${blocks} × ${perBlock} = ${part} cats.`,
        },
        `There are ${part} cats.`,
        [`There are ${W} cats.`, `There are ${perBlock} cats.`, `There are ${complementPart} cats.`]
      ),
    },
  ];
};

// Q9 — Liam's book: no diagram, no color, multiple choice. Hard: recognize the correct whole.
const liamsBookQuestion = (): TestQuestion[] => {
  const p = pick([20, 30, 40, 60, 70, 80, 90]);
  const n = p / 10;
  const ten = randInt(2, 15);
  const P = ten * n;
  const W = ten * 10;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>Liam read {P} pages. That's {p}% of his book. Which sentence correctly describes how many pages the book has?</>,
          hint: "Find 10% first (divide by how many 10%-blocks make the given percent), then multiply by 10.",
          explain: `${P} ÷ ${n} = ${ten} is 10%. ${ten} × 10 = ${W} pages.`,
        },
        `The book has ${W} pages.`,
        [`The book has ${P} pages.`, `The book has ${ten} pages.`, `The book has ${P * p} pages.`]
      ),
    },
  ];
};

// Q10 — the doubling question: no diagram, no color, multiple choice. Hard: conceptual
// capstone on why this unit's practice problems deliberately exclude 50%.
const doublingQuestion = (): TestQuestion[] => {
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: <>A student notices that 50% of 80 is 40, simply by dividing by 2. Which statement explains why doubling or halving doesn't work as a general strategy for finding ANY percent?</>,
          hint: "Think about percents that aren't 50% — like 30% or 70%. Can you halve your way there?",
          explain:
            "Halving only works because 50% is exactly half. Other percents, like 30% or 70%, aren't a simple half or double of the whole — the 10%-block method works for all of them, not just 50%.",
        },
        "Only 50% is found by halving — other percents like 30% or 70% need the 10%-block method instead.",
        [
          "Halving always works for any percent, not just 50%.",
          "Percents over 50% can be halved, but percents under 50% cannot.",
          "The 10%-block method only works for 50% and 100%.",
        ]
      ),
    },
  ];
};

export const percentTest: Unit["test"] = {
  questions: [
    shadedGridQuestion,
    shadedTapeQuestion,
    fishTankQuestions,
    classVoteQuestion,
    theaterSeatsQuestion,
    cookieGoalQuestion,
    petStoreQuestion,
    liamsBookQuestion,
    doublingQuestion,
  ],
  passScore: 9,
};
