import type { ComponentType, ReactNode } from "react";
import type { ProblemType, TestQuestion } from "../engine/types";

export interface Unit {
  id: string;
  title: string;
  /** What the student will be able to do, in kid-friendly words. */
  goal: string;
  /** The standard this unit covers (for the teacher). */
  standard: string;
  /** One or two short "key idea" paragraphs with an example. */
  keyIdea: ReactNode;
  /** Free-play sandbox with live diagrams. */
  Explore: ComponentType;
  /**
   * A small, fully static snapshot of this unit for the cover page's preview
   * carousel (shared/components/UnitPreviewCarousel.tsx) — zero props, no
   * interactivity or internal state, just one hand-picked "nice" example
   * rendered at a fixed size. Optional so a unit without one yet falls back
   * to title/goal text only in the carousel.
   */
  preview?: ComponentType;
  /** Randomized, step-by-step practice problems. */
  problems: ProblemType[];
  /**
   * End-of-unit test: a fixed, curated set of questions (unlike `problems`,
   * which are picked randomly one at a time). Optional — units without one
   * simply get no "Test" tab. `questions` is an array of generator functions
   * because a few questions share a scenario's randomized numbers (a "cluster"
   * generator returns more than one TestQuestion); flattened, it must total 10.
   */
  test?: {
    questions: (() => TestQuestion[])[];
    passScore: number;
  };
}
