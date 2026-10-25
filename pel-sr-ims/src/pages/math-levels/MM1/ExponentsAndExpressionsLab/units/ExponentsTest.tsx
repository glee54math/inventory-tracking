import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { toSuperscript } from "./formatExponent";

// ---------- end-of-unit test: Exponents ----------
// 10 single-question generators covering the same 5 skills Practice
// exercises: repeated multiplication, base-of-0/1 edge cases, exponent of 1,
// exponent-notation <-> expanded-form matching, and order of operations with
// an exponent inside a larger expression. Self-contained (no import from
// Exponents.tsx, and Exponents.tsx never imports from here either) — same
// convention as every other *Test.tsx file in this app, since the unit file
// already imports this one for its own Test tab, and an import back would
// create a real circular-import cycle (see MATH_TSX_STYLE_GUIDE.txt /
// math-lab-builder conventions).

/** Builds the repeated-multiplication string, e.g. (3, 4) -> "3 × 3 × 3 × 3". */
const repeatedMultString = (base: number, exponent: number): string => Array.from({ length: exponent }, () => base).join(" × ");

/** 1(a) repeated multiplication, straight evaluate. */
export const repeatedMultQuestion = (difficulty: "easy" | "medium"): TestQuestion[] => {
  const base = randInt(2, difficulty === "easy" ? 5 : 9);
  const exponent = randInt(2, 4);
  const value = Math.pow(base, exponent);
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: (
          <>
            What is {base}<sup>{exponent}</sup>?
          </>
        ),
        hint: `${base}${exponent === 2 ? "²" : exponent === 3 ? "³" : "⁴"} means ${base} multiplied by itself ${exponent} times: ${repeatedMultString(base, exponent)}.`,
        explain: `${repeatedMultString(base, exponent)} = ${value}.`,
        answer: value,
      },
    },
  ];
};

/** 1(d) notation <-> expanded form, multiple choice, both directions. */
export const notationMatchQuestion = (direction: "toExpanded" | "toExponent", difficulty: "easy" | "medium"): TestQuestion[] => {
  const base = randInt(2, 6);
  let exponent = randInt(2, 4);
  // Avoid base === exponent generally: (1) base×exponent (the distractor
  // targeting the 3²=3×2 conflation) then equals the correct expanded form
  // itself whenever base=exponent=2, silently collapsing a distractor into
  // the answer; (2) more generally, repeatedMultString(base, exponent-1)
  // text-coincides with "base × exponent" whenever exponent === base (both
  // render as "base × base"), producing a harmless but redundant duplicate
  // distractor pair. The brute-force verification script caught both.
  if (base === exponent) exponent = exponent < 4 ? exponent + 1 : exponent - 1;
  const expanded = repeatedMultString(base, exponent);
  // Distractor targeting the "exponent means multiply by itself" vs "multiply
  // by the exponent" mix-up — base repeated (exponent - 1) times instead of
  // exponent times, the classic off-by-one from that confusion.
  const offByOne = exponent > 2 ? repeatedMultString(base, exponent - 1) : repeatedMultString(base, exponent + 1);
  // Distractor targeting 3² = 3×2 directly: base times exponent, not base^exponent.
  const timesExponent = `${base} × ${exponent}`;
  if (direction === "toExponent") {
    return [
      {
        visual: null,
        difficulty,
        step: choice(
          {
            prompt: <>Which is the same as {expanded}, written with an exponent?</>,
            hint: `Count how many times ${base} appears — that count is the exponent.`,
            explain: (
              <>
                {expanded} has {base} appearing {exponent} times, so it's {base}<sup>{exponent}</sup>.
              </>
            ),
          },
          `${base}${toSuperscript(exponent)}`,
          // Off-by-one in each direction, targeting the "count the factors
          // carefully" mistake — never the base/exponent-swapped form, which
          // can text-collide with the correct answer when base === exponent
          // (e.g. both "3³"), as the brute-force verification script caught.
          [`${base}${toSuperscript(exponent - 1)}`, `${base}${toSuperscript(exponent + 1)}`]
        ),
      },
    ];
  }
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: (
            <>
              Which is the same as {base}<sup>{exponent}</sup>, written as repeated multiplication?
            </>
          ),
          hint: `${base}${toSuperscript(exponent)} means ${base} multiplied by itself ${exponent} times — not ${base} multiplied by ${exponent}.`,
          explain: (
            <>
              {base}<sup>{exponent}</sup> = {expanded} ({base} appears {exponent} times).
            </>
          ),
        },
        expanded,
        [timesExponent, offByOne]
      ),
    },
  ];
};

/** 1(b) base-of-0 / base-of-1 edge cases. */
export const baseEdgeCaseQuestion = (kind: "baseOne" | "baseZero" | "powerZero", difficulty: "easy" | "medium"): TestQuestion[] => {
  if (kind === "baseOne") {
    const exponent = randInt(2, 9);
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "number",
          prompt: (
            <>
              What is 1<sup>{exponent}</sup>?
            </>
          ),
          hint: "1 multiplied by itself, any number of times, is still 1.",
          explain: `1 raised to any power is always 1, since 1 × 1 × ... × 1 is always 1.`,
          answer: 1,
        },
      },
    ];
  }
  if (kind === "baseZero") {
    const exponent = randInt(2, 6);
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "number",
          prompt: (
            <>
              What is 0<sup>{exponent}</sup>?
            </>
          ),
          hint: "0 multiplied by itself, any number of times (at least once), is still 0.",
          explain: `0 raised to any positive whole-number power is always 0.`,
          answer: 0,
        },
      },
    ];
  }
  // powerZero: n^0 = 1, the trickiest edge case — multiple choice, with a
  // distractor targeting "anything to the 0 power is 0" (confusing the
  // exponent's own value with the result) and a second targeting "n^0 = n".
  const base = randInt(2, 12);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: (
            <>
              What is {base}<sup>0</sup>?
            </>
          ),
          hint: "Any nonzero number raised to the 0 power is 1 — this is a rule to remember, not something to compute by repeated multiplication.",
          explain: `Any nonzero number to the 0 power equals 1, by definition — not 0, and not the base itself.`,
        },
        "1",
        ["0", String(base)]
      ),
    },
  ];
};

/** 1(c) exponent of 1. */
export const exponentOfOneQuestion = (): TestQuestion[] => {
  const base = randInt(2, 20);
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        {
          prompt: (
            <>
              What is {base}<sup>1</sup>?
            </>
          ),
          hint: "An exponent of 1 means the base appears just once — nothing to multiply it by.",
          explain: `Any number raised to the power of 1 is just itself.`,
        },
        String(base),
        ["1", String(base * base)]
      ),
    },
  ];
};

/** 1(e) order of operations: an exponent inside a larger numerical expression. */
export const orderOfOpsQuestion = (difficulty: "medium" | "hard"): TestQuestion[] => {
  const base = randInt(2, 5);
  const add = randInt(1, 10);
  const square = base * base;
  const total = add + square;
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: (
          <>
            What is {add} + {base}<sup>2</sup>?
          </>
        ),
        hint: `Evaluate the exponent first: ${base}² = ${square}. Then add ${add}.`,
        explain: `${base}² = ${square}, so ${add} + ${square} = ${total}.`,
        answer: total,
      },
    },
  ];
};

/** The direct 3² vs 3×2 conflation, as its own true/false trap question. */
export const conflationTrapQuestion = (): TestQuestion[] => {
  const base = randInt(3, 9);
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: (
            <>
              True or False: {base}<sup>2</sup> = {base} × 2.
            </>
          ),
          hint: `${base}² means ${base} × ${base}, not ${base} × 2 — check both values before deciding.`,
          explain: `False — ${base}² = ${base} × ${base} = ${base * base}, but ${base} × 2 = ${base * 2}. Those are different numbers.`,
        },
        "False",
        ["True"]
      ),
    },
  ];
};

export const exponentsTest: Unit["test"] = {
  questions: [
    () => repeatedMultQuestion("easy"),
    () => repeatedMultQuestion("medium"),
    () => baseEdgeCaseQuestion("baseOne", "easy"),
    () => baseEdgeCaseQuestion("baseZero", "easy"),
    () => baseEdgeCaseQuestion("powerZero", "medium"),
    exponentOfOneQuestion,
    () => notationMatchQuestion("toExponent", "medium"),
    () => notationMatchQuestion("toExpanded", "medium"),
    () => orderOfOpsQuestion("medium"),
    conflationTrapQuestion,
  ],
  passScore: 9,
};
