// Step builders shared by units AND Tests (never a unit <-> Test cycle), so a
// Practice step and its Test question are graded and worded the same way.
// One instruction everywhere: "Find the value of ..." (grade-5 guide: pick
// one word for "evaluate" and keep it). Direction words: always "inside out"
// (never "outward").

import { choice, type ChoiceStep, type NumberStep } from "../../../shared/engine/types";
import { depth, evalExpr, exprText, firstPartText, fmtNum, leftToRight, outermost, SYM_NAME, workSteps, type Expr, type Sym } from "./expr";

/** "(4 + 6) × 3 = 10 × 3 = 30" */
export const workText = (e: Expr): string => workSteps(e).map(exprText).join(" = ");

/** Named feedback for the left-to-right mistake (ignoring the grouping symbols). */
export const leftToRightDiagnose =
  (e: Expr) =>
  (x: number): string | null => {
    const v = evalExpr(e);
    const l2r = leftToRight(e);
    if (l2r !== null && l2r !== v && x === l2r) return `${fmtNum(l2r)} is what you get going left to right. Work out ${firstPartText(e)} first.`;
    return null;
  };

/** Type the value of an expression. */
export const valueStep = (e: Expr, prompt?: string): NumberStep => ({
  kind: "number",
  prompt: prompt ?? `Find the value of ${exprText(e)}.`,
  hint: `Work out ${firstPartText(e)} first. ${depth(e) > 1 ? "Then keep working from the inside out." : "Then do the rest."}`,
  explain: `${workText(e)}.`,
  answer: evalExpr(e),
  diagnose: leftToRightDiagnose(e),
});

/**
 * Unit 2 "Outside marks" (Practice AND Test): for a two- or three-layer
 * expression, ask either which marks are on the outside (brackets or braces)
 * or which marks hold the part you work out first (always the parentheses,
 * the inside group), so neither the biggest mark nor the first mark from the left
 * decides it. Buttons show the names only (round 1, C1-13): the picture
 * shows the marks.
 */
export const outsideMarksStep = (e: Expr, ask: "outside" | "first"): ChoiceStep => {
  const outer = outermost(e) as Sym;
  const target: Sym = ask === "outside" ? outer : "paren";
  const name = SYM_NAME[target];
  return choice(
    {
      // The marks hold the part you work out; you don't work out the marks (round 2, E2-27).
      prompt: ask === "outside" ? "Which marks are on the outside?" : "Which marks hold the part you work out first?",
      hint: ask === "outside" ? "Find the marks that hold all the other groups." : "Find the group that is inside all the other groups.",
      explain:
        ask === "outside"
          ? `The ${name} hold all the other groups, so they are on the outside. Then do the last step, outside all the marks.`
          : "The part in parentheses is inside all the other groups, so you work it out first. Then keep working from the inside out.",
    },
    name,
    // the other two names (the three marks look alike; "outside" and "first" get mixed up)
    (["paren", "bracket", "brace"] as Sym[]).filter((s) => s !== target).map((s) => SYM_NAME[s])
  );
};
