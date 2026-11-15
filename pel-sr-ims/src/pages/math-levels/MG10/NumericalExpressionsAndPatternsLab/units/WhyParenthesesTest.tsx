import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { pick, shuffle } from "../../../shared/lib/math";
import { evalExpr, exprText, firstPartText, fmtNum, grouped, leftToRight, plusTimes, subDiv, type Op } from "../lib/expr";
import { fruitStory, type StoryKind } from "../lib/stories";
import { valueStep, workText } from "../lib/steps";
import { ExprView } from "../diagrams";

// Self-contained: never imports the paired WhyParentheses.tsx.

type Diff = TestQuestion["difficulty"];

/** Q1/Q2 — which expression matches the story? ("each group gets both" vs "one extra"). */
export function storyQuestion(difficulty: Diff, kind: StoryKind): TestQuestion[] {
  const s = fruitStory(kind);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${s.text} Which expression matches the story?`,
          hint: kind === "each" ? `Does every ${s.scene.group} get both kinds?` : `Do the ${s.scene.item2} go ${s.scene.prep} every ${s.scene.group}?`,
          explain:
            kind === "each"
              ? `Each ${s.scene.group} gets ${s.a} + ${s.b}. There are ${s.n} ${s.scene.groups}, so ${exprText(s.right)}.`
              : `${s.n} ${s.scene.groups} with ${s.a} each is ${s.n} × ${s.a}. Add the ${s.b} ${s.scene.item2} only once: ${exprText(s.right)}.`,
        },
        exprText(s.right),
        // the other story kind (puts the parentheses around the wrong part), and "multiply only the second item"
        s.wrong.map(exprText)
      ),
    },
  ];
}

/** Q3 — parentheses at the start: (a + b) × c or (a × b) + c. */
export function parensFirstQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const { e } = plusTimes("left");
  return [{ visual: <ExprView expr={e} />, difficulty, step: valueStep(e) }];
}

/** Q4/Q5 — parentheses NOT first: a × (b + c) (Q4) or a + (b × c) (Q5). Separate pools by operation. */
export function parensLastQuestion(difficulty: Diff, ops: [Op, Op]): TestQuestion[] {
  const { e } = plusTimes("right", ops);
  return [{ visual: <ExprView expr={e} />, difficulty, step: valueStep(e) }];
}

/** Q6/Q7 — parentheses around a subtraction (Q6) or a division (Q7). */
export function subDivQuestion(difficulty: Diff, inner: "−" | "÷"): TestQuestion[] {
  const { e } = subDiv(inner);
  return [{ visual: <ExprView expr={e} />, difficulty, step: valueStep(e) }];
}

/** Q8 — Sam's answer to a × (b + c): right, or the left-to-right mistake (each half the time). */
export function samQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const { e, t } = plusTimes("right", ["×", "+"]);
  const v = evalExpr(e);
  const l2r = leftToRight(e)!;
  const samRight = Math.random() < 0.5;
  const sam = samRight ? v : l2r;
  const name = pick(["Sam", "Kim", "Ben", "Ana"]);
  const right = `${name} is right.`;
  const wrongL2R = `${name} is not right. ${name} worked out ${t.a} × ${t.b} first.`;
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${name} says ${exprText(e)} = ${fmtNum(sam)}. Is ${name} right?`,
          hint: `Work out ${firstPartText(e)} first. Then compare.`,
          explain: `${workText(e)}. ${samRight ? `${name} worked out the parentheses first.` : `${fmtNum(l2r)} comes from going left to right and skipping the parentheses.`}`,
        },
        samRight ? right : wrongL2R,
        [
          samRight ? wrongL2R : right,
          `${name} is not right. You always work from left to right.`, // the left-to-right rule itself
        ]
      ),
    },
  ];
}

/** Q9 — which grouping of the same numbers equals this value? */
export function whichEqualsQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const side = pick<"left" | "right">(["left", "right"]);
  const { e, moved, t } = plusTimes(side);
  // A third grouping with the two operations swapped: never the answer.
  const swapped = grouped(t.a, t.o2, t.b, t.o1, t.c, side);
  const v = evalExpr(e);
  const options = [moved, swapped].filter((x) => evalExpr(x) !== v);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Which expression has a value of ${fmtNum(v)}?`,
          hint: "Find the value of each one. Work out the parentheses first.",
          explain: `${workText(e)}.`,
        },
        exprText(e),
        // the same numbers with the parentheses moved (or the operations swapped)
        shuffle(options).map(exprText)
      ),
    },
  ];
}

/** Q10 — a story, then type its value. */
export function storyValueQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const s = fruitStory(pick<StoryKind>(["each", "extra"]));
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `${s.text} ${s.question}`,
        hint: s.kind === "each" ? `How many are in one ${s.scene.group}? Then think about all ${s.n}.` : `How many ${s.scene.item1} are in the ${s.scene.groups}? Then add the ${s.scene.item2}.`,
        explain: `${workText(s.right)}.`,
        answer: evalExpr(s.right),
      },
    },
  ];
}

export const whyParenthesesTest: Unit["test"] = {
  questions: [
    () => storyQuestion("easy", "each"),
    () => storyQuestion("easy", "extra"),
    () => parensFirstQuestion("easy"),
    () => parensLastQuestion("medium", ["×", "+"]),
    () => parensLastQuestion("medium", ["+", "×"]),
    () => subDivQuestion("medium", "−"),
    () => subDivQuestion("medium", "÷"),
    () => samQuestion("medium"),
    () => whichEqualsQuestion("hard"),
    () => storyValueQuestion("hard"),
  ],
  passScore: 9,
};
