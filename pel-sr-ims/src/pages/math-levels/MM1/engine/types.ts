import type { ReactNode } from "react";
import { shuffle } from "../lib/math";

interface BaseStep {
  /** The question for this step. */
  prompt: ReactNode;
  /** Nudge shown on request (after a wrong try). */
  hint: ReactNode;
  /** Shown once the step is correct: the "why". */
  explain: ReactNode;
}

export interface NumberStep extends BaseStep {
  kind: "number";
  answer: number;
  prefix?: string; // e.g. "$"
  suffix?: string; // e.g. "cups"
}

export interface RatioStep extends BaseStep {
  kind: "ratio";
  answer: [number, number];
  /** Accept any equivalent ratio (e.g. 4:6 for 2:3). Default false. */
  equivalent?: boolean;
  /** Small labels under the two boxes, e.g. ["wings", "beaks"]. */
  labels?: [string, string];
  /** Optional wording around the boxes: before ___ middle ___ after. */
  frame?: [string, string, string];
}

export interface ChoiceStep extends BaseStep {
  kind: "choice";
  choices: string[];
  correct: number;
}

export type Step = NumberStep | RatioStep | ChoiceStep;

export interface Problem {
  title: string;
  /** The word problem or the setup. */
  story: ReactNode;
  steps: Step[];
  /**
   * Draws the diagram for this problem. `done` is the number of steps answered
   * correctly so far, so the picture can fill in as the student works.
   */
  visual: (done: number) => ReactNode;
  /** Final sentence shown when every step is done. */
  wrapUp: ReactNode;
}

export interface ProblemType {
  label: string;
  make: () => Problem;
}

/** Build a choice step with shuffled options. */
export const choice = (
  base: BaseStep,
  correctText: string,
  distractors: string[]
): ChoiceStep => {
  const all = shuffle([correctText, ...distractors.filter((d) => d !== correctText)]);
  return { ...base, kind: "choice", choices: all, correct: all.indexOf(correctText) };
};
