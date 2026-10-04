import type { ComponentType, ReactNode } from "react";
import type { ProblemType } from "../engine/types";

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
  /** Randomized, step-by-step practice problems. */
  problems: ProblemType[];
}
