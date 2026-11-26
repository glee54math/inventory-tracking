import { pick, shuffle } from "../../../shared/lib/math";
import { pointing, type TestQuestion, type VisualHelp } from "../../../shared/engine/types";
import { SHAPE_KINDS, SHAPE_LABELS, type ShapeKind } from "../diagrams/Shape2D";

// Small helpers shared by this lab's unit files AND their Test files. Nothing
// here imports a unit or a Test, so it can't make an import cycle.

/** The step the picture should show: the step being demonstrated during
 *  "Show me" (the engine passes done = step + 1 then), else `done`. */
export const shownStep = (done: number, help?: VisualHelp) => (help?.showMe ? help.step : done);
/** "Show me" is open on step i. */
export const showing = (help: VisualHelp | undefined, i: number) => !!help?.showMe && help.step === i;
/** Help (not "Show me") is on for step i: after a wrong try or a hint. */
export const helping = (help: VisualHelp | undefined, i: number) => pointing(help, i) && !help?.showMe;

/** "1, 2, 3" */
export const countUp = (n: number) => Array.from({ length: n }, (_, i) => i + 1).join(", ");

/**
 * Turns that plainly change how a shape looks (review C1-19): a square at
 * 90° or a hexagon at 60° looks the same as before, so those are left out.
 */
export const VISIBLE_TURNS: Record<Exclude<ShapeKind, "circle">, number[]> = {
  square: [20, 30, 45, 60, 70],
  rectangle: [30, 45, 60, 90, 120, 145],
  triangle: [40, 75, 110, 160, 200, 250, 300],
  hexagon: [15, 20, 30, 40, 45],
};
export const visibleTurn = (kind: ShapeKind) => (kind === "circle" ? 0 : pick(VISIBLE_TURNS[kind]));

/** Two other shape names (a square may get "Diamond", the name some people
 *  use for a turned square; Unit 1 Explore teaches that it is still a square). */
export function shapeDistractors(kind: ShapeKind, includeDiamond: boolean): string[] {
  const others = shuffle(SHAPE_KINDS.filter((k) => k !== kind)).map((k) => SHAPE_LABELS[k]);
  if (includeDiamond) return [others[0], "Diamond"];
  return others.slice(0, 2);
}

/** A test whose questions come in a new order every sitting (review C1-07:
 *  a fixed order let a student pass from a memory of the results screen). */
export const inAnyOrder = (gens: (() => TestQuestion[])[]): (() => TestQuestion[])[] => [() => shuffle(gens.flatMap((g) => g()))];
