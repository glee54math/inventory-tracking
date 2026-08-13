import { useState } from "react";
import type { SubjectProgress } from "../../utils/types";
import { MATH_GRADE_LEVELS, ENGLISH_GRADE_LEVELS, PAGES_PER_LEVEL } from "../../utils/types";
import { getNextLevel } from "../../utils/progressService";

interface WhatsNextCardProps {
  mathProgress?: SubjectProgress;
  englishProgress?: SubjectProgress;
}

const UNLOCK_PIN = "3188";

function gradeForLevel(level: string, subject: "Math" | "English"): string | null {
  const map = subject === "Math" ? MATH_GRADE_LEVELS : ENGLISH_GRADE_LEVELS;
  for (const [grade, levels] of Object.entries(map)) {
    if (levels.includes(level)) return grade;
  }
  return null;
}

interface NextSubjectRowProps {
  progress: SubjectProgress;
  subject: "Math" | "English";
}

function NextSubjectRow({ progress, subject }: NextSubjectRowProps) {
  const nextLevel = getNextLevel(progress.currentLevel, subject);
  if (!nextLevel) return null;

  const grade = gradeForLevel(nextLevel, subject);
  const gradeLabel = grade === "K" ? "Kindergarten" : grade ? `Grade ${grade}` : null;

  const currentLevelData =
    progress.levelHistory.find((l) => l.level === progress.currentLevel && !l.isComplete) ??
    progress.levelHistory[progress.levelHistory.length - 1];

  const pagesLeft = currentLevelData
    ? Math.max(0, PAGES_PER_LEVEL - (currentLevelData.pagesCompleted ?? 0))
    : null;

  const isMath = subject === "Math";

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl ${
        isMath ? "bg-blue-50" : "bg-green-50"
      }`}
    >
      <div>
        <p
          className={`text-xs font-semibold uppercase tracking-wide ${
            isMath ? "text-blue-500" : "text-green-500"
          }`}
        >
          {subject} — Up Next
        </p>
        <p
          className={`text-2xl font-extrabold mt-1 ${
            isMath ? "text-blue-700" : "text-green-700"
          }`}
        >
          {nextLevel}
        </p>
        {gradeLabel && (
          <p className={`text-xs mt-1 ${isMath ? "text-blue-400" : "text-green-400"}`}>
            {gradeLabel} level
          </p>
        )}
      </div>
      {pagesLeft !== null && (
        <div className="text-right">
          <p
            className={`text-lg font-bold ${isMath ? "text-blue-600" : "text-green-600"}`}
          >
            {pagesLeft}
          </p>
          <p className={`text-xs ${isMath ? "text-blue-400" : "text-green-400"}`}>
            pages left
          </p>
        </div>
      )}
    </div>
  );
}

export default function WhatsNextCard({ mathProgress, englishProgress }: WhatsNextCardProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === UNLOCK_PIN) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect PIN.");
      setPin("");
    }
  };

  const hasNext =
    (mathProgress && getNextLevel(mathProgress.currentLevel, "Math")) ||
    (englishProgress && getNextLevel(englishProgress.currentLevel, "English"));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">What's Next</h3>
        {!unlocked && <span className="text-gray-300 text-xl select-none">🔒</span>}
      </div>

      {!unlocked ? (
        <form onSubmit={handleUnlock} className="space-y-4">
          <p className="text-sm text-gray-400">
            Enter the PIN to see your upcoming levels.
          </p>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
              setError("");
            }}
            maxLength={4}
            placeholder="••••"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 text-xl
              text-center tracking-[0.5em] font-bold
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400
              transition-all duration-200"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={pin.length !== 4}
            className="w-full !bg-gray-800 text-white py-2 rounded-xl font-semibold text-sm
              disabled:opacity-40 hover:!bg-gray-700 transition-all duration-200"
          >
            Unlock
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          {mathProgress && (
            <NextSubjectRow progress={mathProgress} subject="Math" />
          )}
          {englishProgress && (
            <NextSubjectRow progress={englishProgress} subject="English" />
          )}
          {!hasNext && (
            <p className="text-gray-400 text-sm">No upcoming levels — you're at the top!</p>
          )}
        </div>
      )}
    </div>
  );
}
