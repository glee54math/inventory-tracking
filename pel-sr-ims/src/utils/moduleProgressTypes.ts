// moduleProgressTypes.ts
// Shared shape for per-unit practice progress on a "standalone" practice module
// (e.g. MM1_RatioLab, MG11_PowersOfTen — see StandaloneLevelSkill in
// levelSubsections.ts). A module with no real sub-units (like MG11) just has a
// single entry keyed "main" instead of one key per unit.

export interface UnitProgress {
  solved: number;
  /** Problems solved cleanly (no revealed answers, at most one hint). */
  clean: number;
  /** Best-ever end-of-unit test score out of 10. A later worse retake never lowers this. */
  testScore?: number;
}

export type ProgressMap = Record<string, UnitProgress>;

// Firestore doc shape at
// students/{location}/students/{studentId}/moduleProgress/{moduleId}
export interface ModuleProgressDoc {
  units: ProgressMap;
  lastUpdated: Date;
}

// Firestore doc shape in the .../moduleProgress/{moduleId}/attempts subcollection.
// Append-only attempt log — kept separate from the summary doc above so it can
// grow without ever hitting Firestore's per-document size limit.
export interface ModuleAttempt {
  unitId: string;
  mode: "problem" | "test";
  /** Present when mode === "problem": solved with no revealed answer, at most one hint. */
  clean?: boolean;
  /** Present when mode === "test": raw score out of 10 for that attempt. */
  score?: number;
  timestamp: Date;
}
