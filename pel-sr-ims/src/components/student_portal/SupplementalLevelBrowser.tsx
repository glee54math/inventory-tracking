import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MATH_LEVELS, ENGLISH_LEVELS } from "../../utils/types";

// Detect which level files actually exist at build time
const mathFileKeys = import.meta.glob("../../pages/math-levels/*.tsx");
const englishFileKeys = import.meta.glob("../../pages/english-levels/*.tsx");

const AVAILABLE_MATH = new Set(
  Object.keys(mathFileKeys)
    .map((p) => p.replace("../../pages/math-levels/", "").replace(".tsx", ""))
    .filter((id) => MATH_LEVELS.includes(id))
);

const AVAILABLE_ENGLISH = new Set(
  Object.keys(englishFileKeys)
    .map((p) => p.replace("../../pages/english-levels/", "").replace(".tsx", ""))
    .filter((id) => ENGLISH_LEVELS.includes(id))
);

interface SupplementalLevelBrowserProps {
  mathCurrentLevel?: string;
  englishCurrentLevel?: string;
}

function categoryOf(levelId: string): string {
  if (/^MK|^EK/.test(levelId)) return "Kindergarten";
  if (/^MG|^EG/.test(levelId)) return "Elementary";
  if (/^MM|^EM/.test(levelId)) return "Middle School";
  return "High School";
}

const CATEGORY_ORDER = ["Kindergarten", "Elementary", "Middle School", "High School"];

export default function SupplementalLevelBrowser({
  mathCurrentLevel,
  englishCurrentLevel,
}: SupplementalLevelBrowserProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"Math" | "English">("Math");

  const mathCurrentIdx = mathCurrentLevel ? MATH_LEVELS.indexOf(mathCurrentLevel) : -1;
  const englishCurrentIdx = englishCurrentLevel ? ENGLISH_LEVELS.indexOf(englishCurrentLevel) : -1;

  // Levels up to and including current, that have actual content files
  const accessibleMath =
    mathCurrentIdx >= 0
      ? MATH_LEVELS.slice(0, mathCurrentIdx + 1).filter((l) => AVAILABLE_MATH.has(l))
      : [];

  const accessibleEnglish =
    englishCurrentIdx >= 0
      ? ENGLISH_LEVELS.slice(0, englishCurrentIdx + 1).filter((l) => AVAILABLE_ENGLISH.has(l))
      : [];

  const levels = tab === "Math" ? accessibleMath : accessibleEnglish;
  const currentLevel = tab === "Math" ? mathCurrentLevel : englishCurrentLevel;

  // Group by category
  const grouped: Record<string, string[]> = {};
  for (const l of levels) {
    const cat = categoryOf(l);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(l);
  }

  const isMathTab = tab === "Math";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-base font-bold text-gray-800 mb-4">Supplemental Practice</h3>

      {/* Subject tabs */}
      <div className="flex gap-2 mb-5">
        {(["Math", "English"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t
                ? t === "Math"
                  ? "!bg-blue-600 text-white"
                  : "!bg-green-600 text-white"
                : "!bg-gray-100 text-gray-600 hover:!bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {levels.length === 0 ? (
        <p className="text-gray-400 text-sm">No supplemental levels available yet.</p>
      ) : (
        <div className="space-y-5">
          {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length > 0).map((cat) => (
            <div key={cat}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {cat}
              </p>
              <div className="flex flex-wrap gap-2">
                {grouped[cat].map((levelId) => {
                  const isCurrent = levelId === currentLevel;
                  return (
                    <button
                      key={levelId}
                      onClick={() => navigate(`/student-levels/${levelId}`)}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all
                        hover:scale-105 active:scale-95 ${
                          isCurrent
                            ? isMathTab
                              ? "!bg-blue-600 text-white border-blue-600"
                              : "!bg-green-600 text-white border-green-600"
                            : isMathTab
                            ? "!bg-white text-blue-700 border-blue-200 hover:border-blue-400"
                            : "!bg-white text-green-700 border-green-200 hover:border-green-400"
                        }`}
                    >
                      {levelId}
                      {isCurrent && <span className="ml-1 text-xs opacity-70">●</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
