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
  /**
   * Free-play sandbox with live diagrams. `onIntroDone` is only ever passed
   * when `requiresIntro` is true AND the student hasn't completed it yet —
   * its presence IS the signal for whether to show a required guided
   * exercise before free play, so a component can simply check `if
   * (onIntroDone) { ... }`. Every existing Explore component ignores this
   * (zero-arg function components are still valid here — they just never
   * read it), so this is backward compatible with every unit that doesn't
   * use it.
   */
  Explore: ComponentType<{ onIntroDone?: () => void }>;
  /**
   * When true, the unit's Explore tab must show a required guided exercise
   * (calling the `onIntroDone` prop it's given once finished) before
   * "Practice" unlocks — see UnitView in MM1_RatioLab.tsx /
   * MG11_MultDivFractionLab.tsx. Tracked per-student via
   * UnitProgress.introDone (hooks/useModuleProgress.ts). By itself this only
   * ever gates the very first visit — pair with `reintroEverySolved` below to
   * have it periodically re-gate instead of just once.
   */
  requiresIntro?: boolean;
  /**
   * Only meaningful alongside `requiresIntro: true`. When set, the guided
   * exercise gates Practice again once the student has solved this many NEW
   * problems since the last time they passed it — not just a single
   * lifetime gate. Tracked via UnitProgress.introDoneAtSolved, which snapshots
   * `solved` at the moment the intro was last completed; the gate reappears
   * once `solved - introDoneAtSolved >= reintroEverySolved`. Omit for a
   * one-time-only gate (e.g. Percent's current behavior) — use this when the
   * guided exercise is testing something meant to be memorized long-term
   * (e.g. Conversions' unit-conversion facts), where proving it once isn't
   * enough to guarantee it stuck.
   */
  reintroEverySolved?: number;
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
