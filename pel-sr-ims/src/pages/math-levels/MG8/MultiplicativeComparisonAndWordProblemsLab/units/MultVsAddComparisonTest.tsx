import { randInt } from "../../../shared/lib/math";
import { choice, numberBlank, sentence, type NumberStep, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { makeCtx, type CompareCtx } from "./compareContexts";

// ---------- end-of-unit test: Multiplicative vs. Additive Comparison ----------
// Self-contained with respect to MultVsAddComparison.tsx (imports only the
// leaf phrasing module compareContexts.ts, never the unit file). 10
// questions, passScore 9, typed answers and choices only.

type Level = "easy" | "medium" | "hard";

/** small ≥ 3 always: with small = times = 2, "times as many" and "more than"
 *  give the same number (2 × 2 = 2 + 2), which would make the additive trap
 *  accidentally correct. */
function pair(level: Level): { small: number; times: number; big: number } {
  const [sLo, sHi] = level === "easy" ? [3, 9] : level === "medium" ? [3, 12] : [10, 25];
  const small = randInt(sLo, sHi);
  const times = randInt(2, 9);
  return { small, times, big: small * times };
}

const num = (ctx: CompareCtx, base: Omit<NumberStep, "kind" | "prefix" | "suffix">): NumberStep => ({ kind: "number", prefix: ctx.prefix, suffix: ctx.suffix, ...base });

export function productUnknownQuestion(level: Level = "easy"): TestQuestion[] {
  const ctx = makeCtx();
  const { small, times, big } = pair(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: num(ctx, {
        prompt: `${ctx.aHas(small)} ${ctx.bTimes(times)} ${ctx.qB}`,
        hint: `"${times} times as much" means ${times} × ${small}.`,
        explain: `${times} × ${small} = ${big}, so the answer is ${ctx.amt(big)}.`,
        answer: big,
      }),
    },
  ];
}

export function timesUnknownQuestion(level: Level = "medium"): TestQuestion[] {
  const ctx = makeCtx();
  const { small, times, big } = pair(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: {
        kind: "number",
        prompt: `${ctx.aHas(small)} ${ctx.bHas(big)} ${ctx.qTimes}`,
        hint: `What number times ${small} makes ${big}? Divide: ${big} ÷ ${small}.`,
        explain: `${big} ÷ ${small} = ${times}, because ${times} × ${small} = ${big}. (${big} − ${small} = ${big - small} would answer "how many MORE," a different question.)`,
        answer: times,
        suffix: "times",
      },
    },
  ];
}

export function smallerUnknownQuestion(level: Level = "hard"): TestQuestion[] {
  const ctx = makeCtx();
  const { small, times, big } = pair(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: num(ctx, {
        prompt: `${ctx.bIsTimesOfA(big, times)} ${ctx.qA}`,
        hint: `${big} is ${times} copies of the smaller amount, so divide: ${big} ÷ ${times}.`,
        explain: `${big} ÷ ${times} = ${small}, because ${times} × ${small} = ${big}.`,
        answer: small,
      }),
    },
  ];
}

export function additiveDifferenceQuestion(): TestQuestion[] {
  const ctx = makeCtx();
  // big is a multiple of small on purpose, so dividing (the wrong operation)
  // still gives a tidy, tempting whole number.
  const { small, times, big } = pair("medium");
  return [
    {
      visual: null,
      difficulty: "medium",
      step: num(ctx, {
        prompt: `${ctx.aHas(small)} ${ctx.bHas(big)} ${ctx.qMore}`,
        hint: `"How many more" is an additive comparison — subtract.`,
        explain: `${big} − ${small} = ${big - small}. (${big} ÷ ${small} = ${times} would answer "how many TIMES as many," a different question.)`,
        answer: big - small,
      }),
    },
  ];
}

export function classifyComparisonQuestion(): TestQuestion[] {
  const ctx = makeCtx();
  const { small, times, big } = pair("medium");
  const multiplicative = Math.random() < 0.5;
  const MULT = "Multiplicative — it asks how many TIMES as many";
  const ADD = "Additive — it asks how many MORE";
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${ctx.aHas(small)} ${ctx.bHas(big)} ${multiplicative ? ctx.qTimes : ctx.qMore} What kind of comparison is this question?`,
          hint: "Look at the question's key words: 'times as' or 'more / longer'?",
          explain: multiplicative
            ? `"Times as" means multiplicative: ${big} ÷ ${small} = ${times}.`
            : `"How many more" means additive: ${big} − ${small} = ${big - small}.`,
        },
        multiplicative ? MULT : ADD,
        // Misconception: classifying by the numbers (a tidy multiple) instead of by the question's words.
        [multiplicative ? ADD : MULT]
      ),
    },
  ];
}

export function timesEquationQuestion(): TestQuestion[] {
  const ctx = makeCtx();
  const { small, big } = pair("medium");
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${ctx.aHas(small)} ${ctx.bHas(big)} ${ctx.qTimes} Which equation finds n, the answer?`,
          hint: "n copies of the smaller amount make the bigger amount.",
          explain: `n × ${small} = ${big}, so n = ${big} ÷ ${small}.`,
        },
        `n = ${big} ÷ ${small}`,
        [
          // Misconception: answering "how many times" with subtraction (additive comparison).
          `n = ${big} − ${small}`,
          // Misconception: the word "times" always means multiply.
          `n = ${big} × ${small}`,
        ]
      ),
    },
  ];
}

export function moreThanTrapQuestion(): TestQuestion[] {
  const ctx = makeCtx();
  const small = randInt(3, 12);
  const more = randInt(2, 9);
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${ctx.aHas(small)} ${ctx.bMore(more)} ${ctx.qB}`,
          hint: `"${more} more than" means add ${more}.`,
          explain: `${small} + ${more} = ${small + more}.`,
        },
        ctx.amt(small + more),
        [
          // Misconception: treating "more than" as "times as many".
          ctx.amt(small * more),
          // Misconception: giving the difference itself as the amount.
          ctx.amt(more),
        ]
      ),
    },
  ];
}

export function timesAsManyTrapQuestion(level: Level = "hard"): TestQuestion[] {
  const ctx = makeCtx();
  const { small, times, big } = pair(level);
  return [
    {
      visual: null,
      difficulty: level,
      step: choice(
        {
          prompt: `${ctx.aHas(small)} ${ctx.bHas(big)} ${ctx.qTimes}`,
          hint: `What number times ${small} makes ${big}?`,
          explain: `${big} ÷ ${small} = ${times} times.`,
        },
        `${times} times`,
        [
          // Misconception: subtracting (an additive answer to a multiplicative question).
          `${big - small} times`,
          // Misconception: multiplying because the question says "times".
          `${big * small} times`,
        ]
      ),
    },
  ];
}

export function pairedStemQuestion(): TestQuestion[] {
  const ctx = makeCtx("count");
  const small = randInt(3, 12);
  const n = randInt(2, 9);
  const timesFirst = Math.random() < 0.5;
  const s1 = timesFirst ? ctx.bTimes(n) : ctx.bMore(n);
  const s2 = timesFirst ? ctx.bMore(n) : ctx.bTimes(n);
  const a1 = timesFirst ? small * n : small + n;
  const a2 = timesFirst ? small + n : small * n;
  return [
    {
      visual: null,
      difficulty: "hard",
      step: sentence(
        {
          prompt: `${ctx.aHas(small)} Problem 1: ${s1} Problem 2: ${s2} ${ctx.qB} Answer both.`,
          hint: "Only one key phrase changes. 'Times as many' multiplies; 'more than' adds.",
          explain: `Problem 1: ${timesFirst ? `${n} × ${small}` : `${small} + ${n}`} = ${a1}. Problem 2: ${timesFirst ? `${small} + ${n}` : `${n} × ${small}`} = ${a2}.`,
        },
        "Problem 1: ",
        numberBlank(a1),
        "   Problem 2: ",
        numberBlank(a2),
        ""
      ),
    },
  ];
}

export const multVsAddComparisonTest: Unit["test"] = {
  questions: [
    () => productUnknownQuestion("easy"),
    () => productUnknownQuestion("hard"),
    () => timesUnknownQuestion("medium"),
    () => smallerUnknownQuestion("hard"),
    additiveDifferenceQuestion,
    classifyComparisonQuestion,
    timesEquationQuestion,
    moreThanTrapQuestion,
    () => timesAsManyTrapQuestion("hard"),
    pairedStemQuestion,
  ],
  passScore: 9,
};
