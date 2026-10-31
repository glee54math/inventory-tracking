import type { SubjectProgress } from "../../utils/types";
import {
  MATH_LEVELS,
  ENGLISH_LEVELS,
  MATH_GRADE_LEVELS,
  ENGLISH_GRADE_LEVELS,
  PAGES_PER_LEVEL,
} from "../../utils/types";
import { calculateCurrentGrade } from "../../utils/gradeProgressService";

interface LevelStatusCardProps {
  subjectProgress: SubjectProgress;
  startingGrade?: string;
}

interface GradeComparison {
  label: string;
  colorClass: string;
}

function getGradeComparison(
  currentLevel: string,
  startingGrade: string | undefined,
  programStartDate: Date,
  subject: "Math" | "English"
): GradeComparison | null {
  if (!startingGrade) return null;

  const levels = subject === "Math" ? MATH_LEVELS : ENGLISH_LEVELS;
  const gradeLevels = subject === "Math" ? MATH_GRADE_LEVELS : ENGLISH_GRADE_LEVELS;

  const currentGrade = calculateCurrentGrade(startingGrade, programStartDate);
  const expectedLevels = gradeLevels[currentGrade];
  if (!expectedLevels || expectedLevels.length === 0) return null;

  const currentIdx = levels.indexOf(currentLevel);
  // Compare against the midpoint of the expected grade range
  const midIdx = Math.floor(expectedLevels.length / 2);
  const expectedIdx = levels.indexOf(expectedLevels[midIdx]);

  if (currentIdx === -1 || expectedIdx === -1) return null;

  const diff = currentIdx - expectedIdx;
  const gradeLabel = currentGrade === "K" ? "Kindergarten" : `Grade ${currentGrade}`;

  if (diff >= 2) return { label: `${diff} levels ahead of ${gradeLabel}`, colorClass: "text-success-700 bg-success-50 border-success-200" };
  if (diff === 1) return { label: `1 level ahead of ${gradeLabel}`, colorClass: "text-success-700 bg-success-50 border-success-200" };
  if (diff === 0) return { label: `On track for ${gradeLabel}`, colorClass: "text-primary-700 bg-primary-50 border-primary-200" };
  if (diff === -1) return { label: `1 level behind ${gradeLabel}`, colorClass: "text-warning-700 bg-warning-50 border-warning-200" };
  return { label: `${Math.abs(diff)} levels behind ${gradeLabel}`, colorClass: "text-danger-700 bg-danger-50 border-danger-200" };
}

export default function LevelStatusCard({ subjectProgress, startingGrade }: LevelStatusCardProps) {
  const { subject, currentLevel, estimatedCompletionDate, levelHistory, programStartDate } = subjectProgress;

  const isMath = subject === "Math";

  // Find in-progress level data (fall back to last entry)
  const currentLevelData =
    levelHistory.find((l) => l.level === currentLevel && !l.isComplete) ??
    levelHistory[levelHistory.length - 1];

  const pagesCompleted = currentLevelData?.pagesCompleted ?? 0;
  const progressPct = Math.min(100, Math.round((pagesCompleted / PAGES_PER_LEVEL) * 100));

  const gradeComparison = getGradeComparison(
    currentLevel,
    startingGrade,
    programStartDate,
    subject
  );

  const completionStr = estimatedCompletionDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border-2 p-6 ${
        isMath ? "border-primary-100" : "border-success-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-gray-700">{subject}</h3>
        <span
          className={`text-3xl font-extrabold tracking-tight ${
            isMath ? "text-primary-600" : "text-success-600"
          }`}
        >
          {currentLevel}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Level progress</span>
          <span>
            {pagesCompleted} / {PAGES_PER_LEVEL} pages ({progressPct}%)
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isMath ? "bg-primary-500" : "bg-success-500"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Grade comparison badge */}
      {gradeComparison && (
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${gradeComparison.colorClass}`}
        >
          {gradeComparison.label}
        </div>
      )}

      {/* Estimated completion */}
      <div className="text-sm text-gray-500">
        Est. completion:{" "}
        <span className="font-semibold text-gray-700">{completionStr}</span>
      </div>
    </div>
  );
}
