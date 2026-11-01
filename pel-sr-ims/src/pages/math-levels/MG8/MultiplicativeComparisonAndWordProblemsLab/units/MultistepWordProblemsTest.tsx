import { pick } from "../../../shared/lib/math";
import { choice, type NumberStep, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { MAKERS, addThenMultiply, divideThenAdd, multiplyThenSubtract, reasonableCase, subtractThenDivide, twoProducts, type Multistep, type MultistepKind } from "./multistepScenarios";

// ---------- end-of-unit test: Multistep Word Problems ----------
// Self-contained with respect to MultistepWordProblems.tsx (imports only the
// leaf scenario module multistepScenarios.ts, never the unit file). 10
// questions, passScore 9, typed answers and choices only.

const finalStep = (m: Multistep, prompt?: string): NumberStep => ({
  kind: "number",
  prompt: prompt ?? m.story,
  hint: "Find the in-between number first, then finish.",
  explain: m.work.map((w) => `${w.expr} = ${w.value}`).join(", then ") + ".",
  answer: m.final,
  prefix: m.prefix,
  suffix: m.suffix,
});

const finalQuestion = (make: () => Multistep, difficulty: TestQuestion["difficulty"]) => (): TestQuestion[] => [{ visual: null, difficulty, step: finalStep(make()) }];

export const addThenMultiplyQuestion = finalQuestion(addThenMultiply, "easy");
export const subtractThenDivideQuestion = finalQuestion(subtractThenDivide, "medium");
export const changeQuestion = finalQuestion(multiplyThenSubtract, "medium");
export const divideThenAddQuestion = finalQuestion(divideThenAdd, "medium");
export const threeStepQuestion = finalQuestion(twoProducts, "hard");

const ALL_KINDS: MultistepKind[] = ["addThenMultiply", "subtractThenDivide", "multiplyThenSubtract", "multiplyThenAdd", "divideThenAdd", "twoProducts"];

export function letterEquationQuestion(kind?: MultistepKind): TestQuestion[] {
  const m = MAKERS[kind ?? pick(ALL_KINDS)]();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${m.story} Let ${m.letter} be ${m.unknownDesc}. Which equation matches the WHOLE problem?`,
          hint: "Every number in the story has a job. Which equation uses all of them, in the right order?",
          explain: `${m.equation} — so ${m.letter} = ${m.final}.`,
        },
        m.equation,
        [
          // Misconception: building the equation from only the last two numbers read.
          m.lastTwoEquation,
          // Misconception: wrong operation or wrong order for one of the steps (see the scenario's comment).
          m.wrongOpEquation,
        ]
      ),
    },
  ];
}

export function solveLetterEquationQuestion(kind?: MultistepKind): TestQuestion[] {
  const m = MAKERS[kind ?? pick(ALL_KINDS)]();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `Solve for ${m.letter}: ${m.equation}`,
        hint: m.equation.includes("(") ? "Do the part in parentheses first." : "Multiply or divide first, then add or subtract.",
        explain: m.work.map((w) => `${w.expr} = ${w.value}`).join(", then ") + `, so ${m.letter} = ${m.final}.`,
        answer: m.final,
      },
    },
  ];
}

export function stepMeaningQuestion(kind?: MultistepKind): TestQuestion[] {
  const m = MAKERS[kind ?? pick(["addThenMultiply", "subtractThenDivide", "multiplyThenSubtract", "multiplyThenAdd", "divideThenAdd"] as MultistepKind[])]();
  const w = m.work[0];
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: `${m.story} Step 1 is ${w.expr} = ${w.value}. What does ${w.value} mean in the story?`,
          hint: "Has the story's second step happened yet?",
          explain: `${w.value} is ${m.step1Meaning.toLowerCase()} — an in-between number. The answer is ${m.final}.`,
        },
        m.step1Meaning,
        [
          // Misconception: mistaking which quantity the first step counts.
          m.step1WrongMeaning,
          // Misconception: treating the first step's result as the final answer.
          "It is the final answer to the problem",
        ]
      ),
    },
  ];
}

export function estimateQuestion(): TestQuestion[] {
  const r = reasonableCase();
  return [
    {
      visual: null,
      difficulty: "medium",
      step: {
        kind: "number",
        prompt: `${r.m.story} Round ${r.per} and ${r.extra} to the nearest ten to ESTIMATE the answer. About how many?`,
        hint: `${r.per} rounds to ${Math.round(r.per / 10) * 10}. Then ${r.q} × that, plus the rounded ${r.extra}.`,
        explain: `${r.q} × ${Math.round(r.per / 10) * 10} + ${Math.round(r.extra / 10) * 10} = ${r.estimate}. (Exact: ${r.m.final}.)`,
        answer: r.estimate,
        suffix: r.m.suffix,
      },
    },
  ];
}

/** Always shows the place-value slip (product 10× too big), so the correct
 *  judgment is always "no, about 10 times too big". */
export function reasonablenessQuestion(): TestQuestion[] {
  const r = reasonableCase();
  return [
    {
      visual: null,
      difficulty: "hard",
      step: choice(
        {
          prompt: `${r.m.story} A classmate's answer is ${r.slip.toLocaleString("en-US")}. The estimate is about ${r.estimate}. Is the classmate's answer reasonable?`,
          hint: `Compare ${r.slip.toLocaleString("en-US")} with about ${r.estimate}.`,
          explain: `No — it is way bigger than the estimate. ${r.q} × ${r.per} is ${r.q * r.per}, not ${(r.q * r.per * 10).toLocaleString("en-US")}. The real answer is ${r.m.final}.`,
        },
        "No — it's way too big compared with the estimate",
        [
          // Misconception: any answer that came from a real calculation must be right.
          "Yes — it came from multiplying and adding",
          // Misconception: comparing in the wrong direction.
          "No — it's too small",
        ]
      ),
    },
  ];
}

export const multistepWordProblemsTest: Unit["test"] = {
  questions: [
    addThenMultiplyQuestion,
    subtractThenDivideQuestion,
    changeQuestion,
    divideThenAddQuestion,
    () => letterEquationQuestion(),
    () => solveLetterEquationQuestion(),
    () => stepMeaningQuestion(),
    estimateQuestion,
    reasonablenessQuestion,
    threeStepQuestion,
  ],
  passScore: 9,
};
