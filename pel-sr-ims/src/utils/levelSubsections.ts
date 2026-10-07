// levelSubsections.ts
// Maps each math level to the skill(s) available for practice.
//
// No page-range breakdown yet — that would require documenting exactly which
// pages within a level's 110 teach which skill, which doesn't exist yet (see
// MATH_TSX_STYLE_GUIDE.txt section 10). Until that documentation exists,
// eligibility is level-only: if a student has any homework assigned within a
// level, every skill listed for that level is available to them. Once real
// page-range breakdowns are written down, this can be extended with a
// `ranges: string[]` field per skill (matching the "1-10"/"71-80" format
// parseAssignment() already uses) without needing to change callers that
// only care about the level.
//
// Word-problem entries are deliberately NOT guessed here. A level only gets
// a "wordProblem" entry once its operation/number-range/topic has been
// decided in WORD_PROBLEM_TOPICS.txt (in src/pages/math-levels/) and
// promoted into this file — see that file for the authoring workflow. Until
// then, a level with only a "visual" entry simply won't offer word-problem
// practice.

interface LevelSkillBase {
  skillId: string; // stable id stored on ProblemDoc.skillId, used as the problemBank lookup key
  // Student-facing name shown when a level has more than one skill of the same
  // type to choose between (see PracticeSessionPage.tsx's skill picker — only
  // rendered when a mode's pool has >1 entry). Falls back to a humanized
  // skillId when omitted, so single-skill levels never need to set this.
  label?: string;
}

export interface VisualLevelSkill extends LevelSkillBase {
  type: "visual";
  // Identifies which component to dynamically import and mount. Every level's files live
  // under its own folder (src/pages/math-levels/{level}/), so componentFile is just the
  // bare filename within that folder (no extension) — ProblemRenderer builds the full
  // path as math-levels/{level}/{componentFile}.tsx. componentExport is the named export
  // (NOT the default Demo export — see MATH_TSX_STYLE_GUIDE.txt section 1). Stored
  // separately from skillId because, as-built, file name and export name don't follow one
  // derivable pattern (e.g. MG6_VerticalAddition.tsx exports `VerticalMath`).
  componentFile: string;
  componentExport: string;
  // Produces a fresh set of valid props for the component (e.g. { num1, num2 }). Called
  // client-side on mount and whenever the student asks for a new problem — no Firestore
  // read, no AI call. Visual problems are cheap to generate; only word problems are worth
  // caching (see problemBankService.ts).
  generateParams: () => Record<string, unknown>;
}

export interface WordProblemLevelSkill extends LevelSkillBase {
  type: "wordProblem";
  operation: "add" | "sub" | "mult" | "div";
  numberRange: { min: number; max: number };
  // Short scenario ideas (e.g. "sports team scores", "recipe scaling") promoted from
  // WORD_PROBLEM_TOPICS.txt. Not used by the client-side fallback generator — only read
  // by the Phase 4 seed script as prompt context for Claude-generated variety.
  topics?: string[];
}

export interface StandaloneLevelSkill extends LevelSkillBase {
  type: "standalone";
  // Same componentFile/componentExport meaning as VisualLevelSkill, but ProblemRenderer
  // mounts this component directly with NO injected props and NO wrapper buttons — it's
  // fully self-sufficient (owns its own Check/New-Problem/level-picker UI), unlike every
  // "visual" skill which expects generateParams()'s output as props plus an external
  // showFeedback toggle. Use this type when a component doesn't fit that contract (e.g.
  // it was authored as a complete standalone practice page, not a parameterized exercise).
  componentFile: string;
  componentExport: string;
}

export type LevelSkill = VisualLevelSkill | WordProblemLevelSkill | StandaloneLevelSkill;

export const LEVEL_SKILLS: Record<string, LevelSkill[]> = {
  MG6: [
    {
      type: "visual",
      skillId: "TwoDigitVisualAddition",
      componentFile: "MG6_TwoDigitVisualAddition",
      componentExport: "TwoDigitVisualAddition",
      generateParams: () => ({
        num1: Math.floor(Math.random() * 90) + 10, // 2-digit (10-99)
        num2: Math.floor(Math.random() * 90) + 10, // 2-digit (10-99)
      }),
    },
    {
      type: "visual",
      skillId: "VerticalAdditionSubtraction",
      componentFile: "MG6_VerticalAddition",
      componentExport: "VerticalMath",
      generateParams: () => {
        const a = Math.floor(Math.random() * 90) + 10; // 2-digit (10-99)
        const b = Math.floor(Math.random() * 90) + 10; // 2-digit (10-99)
        if (Math.random() < 0.5) {
          return { nums: [a, b, a + b], operation: "add", numOfDigitsMissing: 2 };
        }
        const [big, small] = a >= b ? [a, b] : [b, a];
        return { nums: [big, small, big - small], operation: "sub", numOfDigitsMissing: 2 };
      },
    },
    {
      type: "standalone",
      skillId: "BarModel",
      componentFile: "MG6_BarModel",
      componentExport: "BarModelPractice",
    },
    // NumberLine (MG6.tsx) intentionally not wired in — it has no showFeedback/
    // correctAnswer props at all (it's an open-ended drag-and-explore tool, not a
    // checkable exercise), so it doesn't fit ProblemRenderer's "check answer" pattern.
    // Revisit once it either gains a gradable mode or ProblemRenderer supports a
    // non-gradable exploration mode.
  ],
  MG7: [
    {
      type: "visual",
      skillId: "Nx1DigitMultiplication",
      componentFile: "MG7_Nx1DigitMultiplication",
      componentExport: "Nx1Multiplication",
      generateParams: () => ({
        num1: Math.floor(Math.random() * 900) + 100, // 3-digit multiplicand (100-999)
        num2: Math.floor(Math.random() * 8) + 2, // 1-digit multiplier (2-9)
      }),
    },
    // No wordProblem entry yet — MG7 isn't in WORD_PROBLEM_TOPICS.txt as "ready" yet.
  ],
  MG11: [
    {
      type: "standalone",
      skillId: "PowersOfTen",
      label: "Powers of Ten",
      componentFile: "MG11_PowersOfTen",
      componentExport: "PowersOf10Practice",
    },
    {
      type: "standalone",
      skillId: "MultDivFractionLab",
      label: "Fractions, Decimals & Factors",
      componentFile: "MG11_MultDivFractionLab",
      componentExport: "MultDivFractionLab",
    },
  ],
  MM1: [
    {
      type: "standalone",
      skillId: "RatioLab",
      componentFile: "MM1_RatioLab",
      componentExport: "RatioLab",
    },
  ],
};

export function getSkillsForLevel(level: string): LevelSkill[] {
  return LEVEL_SKILLS[level] ?? [];
}
