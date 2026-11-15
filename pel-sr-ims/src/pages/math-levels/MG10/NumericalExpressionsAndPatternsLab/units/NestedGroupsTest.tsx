import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { pick, shuffle } from "../../../shared/lib/math";
import { ExprView } from "../diagrams";
import {
  bracketPath,
  collapsed,
  draw,
  evalExpr,
  exprText,
  firstPartText,
  fmtNum,
  isWhole,
  leftToRight,
  nodeAt,
  outermost,
  groupText,
  SYM_NAME,
  threeLayer,
  twoGroups,
  twoLayer,
  type Expr,
  type Op,
  type Sym,
} from "../lib/expr";
import { outsideMarksStep, valueStep, workText } from "../lib/steps";

// Self-contained: never imports the paired NestedGroups.tsx.

type Diff = TestQuestion["difficulty"];

/** The numbers and signs in reading order. */
const flatTokens = (e: Expr): string[] => {
  const toks: string[] = [];
  const flat = (n: Expr) => {
    if (n.kind === "num") toks.push(fmtNum(n.v));
    else {
      flat(n.l);
      toks.push(n.op);
      flat(n.r);
    }
  };
  flat(e);
  return toks;
};

/** The first two numbers with the first sign: what a left-to-right reader works out first. */
export const firstTwoText = (e: Expr): string => flatTokens(e).slice(0, 3).join(" ");
/** The last two numbers with the last sign: what a "right side first" reader works out first. */
export const lastTwoText = (e: Expr): string => flatTokens(e).slice(-3).join(" ");

/** "Which part do you work out first?" — the innermost group, against left-to-right and outside-first readings. */
export function firstPartQuestion(difficulty: Diff, layers: "two" | "three"): TestQuestion[] {
  const e = layers === "two" ? twoLayer() : threeLayer();
  const right = firstPartText(e);
  const outer = outermost(e)!;
  const bare = right.replace(/[()]/g, "");
  const distractors = [
    firstTwoText(e), // left to right: the first two numbers
    groupText(e, outer) ?? "", // outside first: the outside group, written out with its marks
    lastTwoText(e), // right side first
  ]
    .filter((d) => d && d !== right && d !== bare)
    .slice(0, 2);
  return [
    {
      // The same plain picture Practice shows (no group outlines).
      visual: <ExprView expr={e} />,
      difficulty,
      step: choice(
        {
          prompt: `${exprText(e)}. Which part do you work out first?`,
          hint: "Find the group that is inside all the others.",
          explain: `Work from the inside out: ${right} is inside every other group.`,
        },
        right,
        distractors
      ),
    },
  ];
}

/** Type the value of a nested expression. */
export function nestedValueQuestion(difficulty: Diff, layers: "two" | "three", outerOps?: Op[]): TestQuestion[] {
  const e = layers === "two" ? twoLayer(outerOps) : threeLayer();
  return [{ visual: <ExprView expr={e} />, difficulty, step: valueStep(e) }];
}

/** The middle layer of a three-layer expression: what does the [ ] part equal? */
export function bracketPartQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const e = threeLayer();
  const part = nodeAt(e, bracketPath(e)!);
  return [
    {
      visual: <ExprView expr={e} />,
      difficulty,
      step: {
        kind: "number",
        prompt: `${exprText(e)}. What does the part in brackets [ ] equal?`,
        hint: "Work out the parentheses first. Then the brackets.",
        explain: `${workText(part)}.`,
        answer: evalExpr(part),
      },
    },
  ];
}

/**
 * Which marks are on the outside, or which do you work out first? Two- and
 * three-layer expressions only; the same step and words as Practice
 * (lib/steps.ts outsideMarksStep). `want` = the outside mark.
 */
export function outermostQuestion(difficulty: Diff = "medium", want?: "bracket" | "brace"): TestQuestion[] {
  const target = want ?? pick<"bracket" | "brace">(["bracket", "brace"]);
  const e = target === "bracket" ? twoLayer() : threeLayer();
  return [{ visual: <ExprView expr={e} />, difficulty, step: outsideMarksStep(e, pick<"outside" | "first">(["outside", "first"])) }];
}

/** Vocabulary: name one of the three marks. */
export function symbolNameQuestion(difficulty: Diff = "easy"): TestQuestion[] {
  const s = pick<Sym>(["paren", "bracket", "brace"]);
  const marks = { paren: "( )", bracket: "[ ]", brace: "{ }" }[s];
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `What are the marks ${marks} called?`,
          hint: "Parentheses go inside brackets. Brackets go inside braces.",
          explain: `${marks} are ${SYM_NAME[s]}.`,
        },
        SYM_NAME[s],
        // the two other grouping marks (the three look alike)
        (["paren", "bracket", "brace"] as Sym[]).filter((x) => x !== s).map((x) => SYM_NAME[x])
      ),
    },
  ];
}

/** Two separate groups joined by a sign: (3 + 2) × (4 − 1). */
export function twoGroupsQuestion(difficulty: Diff = "medium"): TestQuestion[] {
  const e = twoGroups();
  return [{ visual: <ExprView expr={e} />, difficulty, step: valueStep(e) }];
}

/** Jo goes left to right, Kim works inside out. Who is right? (Which name is right is random.) */
export function whoIsRightQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  // Redraw until going left to right gives a whole number that isn't the answer (round 1, C1-14),
  // so the wrong value is always the mistake the explanation names.
  const e = draw(threeLayer, (x) => {
    const l = leftToRight(x);
    return l !== null && l !== evalExpr(x);
  });
  const v = evalExpr(e);
  const wrong = leftToRight(e)!;
  const [p1, p2] = shuffle(["Jo", "Kim"]);
  const p1Right = Math.random() < 0.5;
  const [v1, v2] = p1Right ? [v, wrong] : [wrong, v];
  const rightName = p1Right ? p1 : p2;
  const wrongName = p1Right ? p2 : p1;
  return [
    {
      visual: null,
      difficulty,
      step: choice(
        {
          prompt: `${p1} says ${exprText(e)} = ${fmtNum(v1)}. ${p2} says it equals ${fmtNum(v2)}. Who is right?`,
          hint: "Work from the inside out, one group at a time.",
          explain: `${workText(e)}. ${fmtNum(wrong)} comes from going left to right.`,
        },
        rightName,
        [wrongName, "Both of them"] // left-to-right answer; "both" = thinks either order is fine
      ),
    },
  ];
}

/** Two groups, then the same numbers worked as one long group: [(a + b) × c] − d. */
export function collapsedQuestion(difficulty: Diff = "hard"): TestQuestion[] {
  const c = draw(
    () => {
      const e = twoGroups();
      return { e, c: collapsed(e) };
    },
    ({ e, c }) => !!c && isWhole(c) && evalExpr(c) !== evalExpr(e)
  ).c!;
  return [{ visual: <ExprView expr={c} />, difficulty, step: valueStep(c) }];
}

export const nestedGroupsTest: Unit["test"] = {
  questions: [
    () => symbolNameQuestion("easy"),
    () => firstPartQuestion("easy", "two"),
    () => nestedValueQuestion("medium", "two", ["×", "÷"]),
    () => nestedValueQuestion("medium", "two", ["+", "−"]),
    () => bracketPartQuestion("medium"),
    () => nestedValueQuestion("hard", "three"),
    () => outermostQuestion("medium"),
    () => twoGroupsQuestion("medium"),
    () => whoIsRightQuestion("hard"),
    () => firstPartQuestion("hard", "three"),
  ],
  passScore: 9,
};
