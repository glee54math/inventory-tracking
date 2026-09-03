// problemTypes.ts
// Shared types for the AI-generated word-problem bank (Student Portal).
// Visual practice problems are generated client-side on demand (see
// levelSubsections.ts's generateParams) and are never stored here — only
// word problems are worth caching, since they're the only type that
// benefits from Claude-generated variety instead of free client-side
// randomness. See src/pages/math-levels/MATH_TSX_STYLE_GUIDE.txt and
// WORD_PROBLEM_TOPICS.txt for the authoring conventions this plugs into.

// A single word problem, cached in Firestore under "problemBank". Mirrors the
// internal ProblemData shape WordProblems.tsx already generates on the fly —
// caching one just means persisting that resolution instead of re-rolling it,
// so it can be Claude-authored text instead of the template generator's.
export interface ProblemDoc {
  id: string; // Firestore doc id
  level: string; // e.g. "MG7" — must match an id in MATH_LEVELS
  skillId: string; // matches a "wordProblem"-type skillId in LEVEL_SKILLS
  // Optional for now: no documented page-range breakdown exists yet, so eligibility is
  // level-only (see levelSubsections.ts). Set this once a problem is known to belong to
  // a specific "1-10"-style range so future filtering can use it without a migration.
  range?: string;
  subject: "Math"; // English support can extend this later

  operation: "add" | "sub" | "mult" | "div";
  nums: number[];
  answer: number;
  text: string; // full plain-text sentence
  segments: { text: string; label?: string }[]; // for the labeled/"help" rendering mode
  personName: string;
  unitSingular: string;
  unitPlural: string;
  keyword: string;

  createdAt: number; // ms since epoch
  source: "seed" | "generated" | "manual";
  usageCount: number;
}

// Input shape for creating a new ProblemDoc (before Firestore assigns an id).
export type NewProblemDoc = Omit<ProblemDoc, "id" | "createdAt" | "usageCount"> & {
  createdAt?: number;
  usageCount?: number;
};
