import { choice, selectBlank, sentence, numberBlank, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { pick, randInt } from "../../../shared/lib/math";
import { evalExpr, exprText, fmtNum, grouped, moveParens } from "../lib/expr";
import { wordsChoices, wordsTemplate } from "../lib/stories";
import { buildStep, changeStep, largerStep, timesStep } from "../lib/reading";
import { workText } from "../lib/steps";

// Self-contained: never imports the paired ReadingExpressions.tsx.
// The size questions use numbers too big to want to work out (5.OA.2:
// "interpret numerical expressions without evaluating them").

type Diff = TestQuestion["difficulty"];

/** Words -> expression (pick). Traps: the numbers in word order, or only one number multiplied. */
export function wordsToExprQuestion(difficulty: Diff, id?: string): TestQuestion[] {
  const t = wordsTemplate(id);
  const { right, wrong } = wordsChoices(t);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${t.words} Which expression matches?`,
          hint: "Which step do the words say to do first? That part goes in parentheses.",
          explain: `The words say to do ${right.match(/\(([^)]*)\)/)?.[1] ?? "the first step"} first, so it goes in parentheses: ${right}.`,
        },
        right,
        wrong // t.traps: word-order reading, and "only one number multiplied"
      ),
    },
  ];
}

/** Words -> expression, built by the student (tap the parentheses, type the numbers, tap the signs), like Practice step 2. */
export function buildExprQuestion(difficulty: Diff, id?: string): TestQuestion[] {
  return [{ visual: null, difficulty, step: buildStep(wordsTemplate(id)) }];
}

/** Expression -> words (pick). */
export function exprToWordsQuestion(difficulty: Diff, id?: string): TestQuestion[] {
  const t = wordsTemplate(id);
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `Which words match ${exprText(t.expr)}?`,
          hint: "The part in parentheses is the first step.",
          explain: `${exprText(t.expr)}: ${t.words}`,
        },
        t.words,
        t.wrongWords // a wrong first step (ignores the parentheses), or the subtraction order turned around
      ),
    },
  ];
}

export function timesAsLargeQuestion(difficulty: Diff, variant: "plain" | "ratio"): TestQuestion[] {
  return [{ visual: null, difficulty, step: timesStep(variant).step }];
}

export function whichLargerQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  return [{ visual: null, difficulty, step: largerStep() }];
}

export function changeQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  return [{ visual: null, difficulty, step: changeStep() }];
}

/**
 * True/false generalization as a sentence: moving parentheses SOMETIMES
 * changes the value (not always, not never). A fresh example each time
 * (round 1, C1-25): one pair that changes is shown worked out, and the
 * student types the value of a fresh + + or × × pair, which doesn't change.
 */
export function sometimesQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const ch = moveParens(true);
  const plus = Math.random() < 0.5;
  const [a, b, c] = plus ? [randInt(2, 9), randInt(2, 9), randInt(2, 9)] : [randInt(2, 5), randInt(2, 5), randInt(2, 4)];
  const op = plus ? "+" : "×";
  const left = grouped(a, op, b, op, c, "left");
  const right = grouped(a, op, b, op, c, "right");
  return [
    {
      visual: null,
      difficulty,
      step: {
        ...sentence(
          {
            prompt: `${exprText(ch.e)} = ${fmtNum(evalExpr(ch.e))}, but ${exprText(ch.moved)} = ${fmtNum(evalExpr(ch.moved))}. Now fill in the blanks.`,
            hint: `Find the value of ${exprText(left)} and of ${exprText(right)}. Then compare with the first pair.`,
            explain: `${workText(left)}, and ${workText(right)}. With only adding, or only multiplying, moving the parentheses never matters. With other signs, it sometimes does. So: sometimes.`,
          },
          `In ${exprText(left)} and ${exprText(right)}, both values are `,
          numberBlank(evalExpr(left)),
          ". So moving the parentheses ",
          // "always" and "never" are the two over-generalizations
          selectBlank("sometimes", ["always", "never"]),
          " changes the value."
        ),
        checkEach: true,
      },
    },
  ];
}

/** Words -> value (typed). */
export function wordsValueQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const t = wordsTemplate();
  return [
    {
      visual: null,
      difficulty,
      step: {
        kind: "number",
        prompt: `${t.words} What number do you get?`,
        hint: "Write the expression first. The first step goes in parentheses.",
        explain: `${workText(t.expr)}.`,
        answer: evalExpr(t.expr),
      },
    },
  ];
}

export const readingExpressionsTest: Unit["test"] = {
  questions: [
    () => wordsToExprQuestion("easy", pick(["addTimes", "addDouble"])),
    // The build's words vary (round 2, C2-08).
    () => buildExprQuestion("medium", pick(["subTimes", "addDivide", "timesSub"])),
    () => exprToWordsQuestion("easy", pick(["timesAdd", "timesSub"])),
    () => exprToWordsQuestion("medium", "addDivide"),
    () => timesAsLargeQuestion("medium", "plain"),
    () => timesAsLargeQuestion("hard", "ratio"),
    () => whichLargerQuestion("hard"),
    () => changeQuestion("medium"),
    () => sometimesQuestion("medium"),
    () => wordsValueQuestion("hard"),
  ],
  passScore: 9,
};
