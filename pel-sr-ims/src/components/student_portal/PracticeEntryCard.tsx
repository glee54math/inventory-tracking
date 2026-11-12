import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MATH_LEVELS } from "../../utils/types";
import type { HomeworkHistoryEntry } from "../../utils/types";
import { getSkillsForLevel } from "../../utils/levelSubsections";

interface PracticeEntryCardProps {
  hwkHistory: HomeworkHistoryEntry[];
}

export default function PracticeEntryCard({ hwkHistory }: PracticeEntryCardProps) {
  const navigate = useNavigate();

  // A level is practiceable if it's at or below the highest level the student has
  // homework in (so MK4 unlocks MK1–MK3 too) AND it has at least one skill
  // configured (see levelSubsections.ts / WORD_PROBLEM_TOPICS.txt).
  const eligibleLevels = useMemo(() => {
    const highestIndex = hwkHistory
      .filter((h) => h.subject === "Math")
      .reduce((max, h) => Math.max(max, MATH_LEVELS.indexOf(h.level)), -1);
    return MATH_LEVELS.filter(
      (level, i) => i <= highestIndex && getSkillsForLevel(level).length > 0
    );
  }, [hwkHistory]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-base font-bold text-gray-800 mb-4">Practice Problems</h3>

      {eligibleLevels.length === 0 ? (
        <p className="text-gray-400 text-sm">No practice problems available yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {eligibleLevels.map((level) => (
            <button
              key={level}
              onClick={() => navigate(`/student-practice/${level}`)}
              className="px-3 py-2 rounded-xl text-sm font-semibold border-2 border-primary-200 text-primary-700
                hover:border-primary-400 hover:bg-primary-50 transition-all hover:scale-105 active:scale-95"
            >
              {level}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
