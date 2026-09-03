import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentContext } from "../components/student_portal/StudentContext";
import { buildHwkHistoryFromAssignments } from "../utils/progressService";
import { getSkillsForLevel } from "../utils/levelSubsections";
import type { LevelSkill } from "../utils/levelSubsections";
import PracticeModeSelector from "../components/student_portal/PracticeModeSelector";
import ProblemRenderer from "../components/student_portal/ProblemRenderer";

export default function PracticeSessionPage() {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const { currentStudent } = useStudentContext();

  useEffect(() => {
    if (!currentStudent) navigate("/student-login");
  }, [currentStudent, navigate]);

  const skills = useMemo(() => getSkillsForLevel(level ?? ""), [level]);
  const visualSkills = useMemo(
    () => skills.filter((s): s is Extract<LevelSkill, { type: "visual" }> => s.type === "visual"),
    [skills]
  );
  const wordSkills = useMemo(
    () => skills.filter((s): s is Extract<LevelSkill, { type: "wordProblem" }> => s.type === "wordProblem"),
    [skills]
  );

  const [mode, setMode] = useState<"visual" | "wordProblem" | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<LevelSkill | null>(null);

  // Auto-pick the mode when only one type is available for this level.
  useEffect(() => {
    if (visualSkills.length > 0 && wordSkills.length === 0) setMode("visual");
    else if (wordSkills.length > 0 && visualSkills.length === 0) setMode("wordProblem");
    else setMode(null);
  }, [visualSkills, wordSkills]);

  useEffect(() => {
    if (!mode) {
      setSelectedSkill(null);
      return;
    }
    const pool = mode === "visual" ? visualSkills : wordSkills;
    setSelectedSkill(pool[Math.floor(Math.random() * pool.length)] ?? null);
  }, [mode, visualSkills, wordSkills]);

  // Student.hwkHistory is never actually written anywhere in this codebase — derive it
  // from hwkAssigned (reliably populated), same as StudentDashboard/progressService do.
  const hwkHistory = useMemo(
    () => buildHwkHistoryFromAssignments(currentStudent?.hwkAssigned ?? []),
    [currentStudent]
  );

  if (!currentStudent || !level) return null;

  const hasHomeworkInLevel = hwkHistory.some((h) => h.level === level);
  const bothModesAvailable = visualSkills.length > 0 && wordSkills.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{level} Practice</h1>
            <p className="text-sm text-gray-400">PEL Student Portal</p>
          </div>
          <button
            onClick={() => navigate("/student-portal")}
            className="px-4 py-2 text-sm font-medium text-gray-600 !bg-gray-100 rounded-xl hover:!bg-gray-200 transition-all duration-200"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {!hasHomeworkInLevel ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">
              No homework found for {level} yet, so practice isn't available here.
            </p>
          </div>
        ) : skills.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">No practice problems available yet for {level}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bothModesAvailable && mode && (
              <button
                onClick={() => setMode(null)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Change practice mode
              </button>
            )}

            {!mode && <PracticeModeSelector onSelect={setMode} />}

            {mode && selectedSkill && <ProblemRenderer level={level} skill={selectedSkill} />}
          </div>
        )}
      </main>
    </div>
  );
}
