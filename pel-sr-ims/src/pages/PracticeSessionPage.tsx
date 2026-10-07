import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentContext } from "../components/student_portal/StudentContext";
import { buildHwkHistoryFromAssignments } from "../utils/progressService";
import { getSkillsForLevel } from "../utils/levelSubsections";
import type { LevelSkill } from "../utils/levelSubsections";
import PracticeModeSelector from "../components/student_portal/PracticeModeSelector";
import type { PracticeMode } from "../components/student_portal/PracticeModeSelector";
import ProblemRenderer from "../components/student_portal/ProblemRenderer";
import SkillPicker from "../components/student_portal/SkillPicker";

const ALL_MODES: PracticeMode[] = ["visual", "wordProblem", "standalone"];

export default function PracticeSessionPage() {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const { currentStudent } = useStudentContext();

  useEffect(() => {
    if (!currentStudent) navigate("/student-login");
  }, [currentStudent, navigate]);

  const skills = useMemo(() => getSkillsForLevel(level ?? ""), [level]);

  // One pool per mode, so adding a new skill type only means adding it to ALL_MODES
  // and this map — nothing else here needs to change.
  const poolsByMode = useMemo<Record<PracticeMode, LevelSkill[]>>(
    () => ({
      visual: skills.filter((s): s is Extract<LevelSkill, { type: "visual" }> => s.type === "visual"),
      wordProblem: skills.filter(
        (s): s is Extract<LevelSkill, { type: "wordProblem" }> => s.type === "wordProblem"
      ),
      standalone: skills.filter(
        (s): s is Extract<LevelSkill, { type: "standalone" }> => s.type === "standalone"
      ),
    }),
    [skills]
  );

  const availableModes = useMemo(
    () => ALL_MODES.filter((m) => poolsByMode[m].length > 0),
    [poolsByMode]
  );

  const [mode, setMode] = useState<PracticeMode | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<LevelSkill | null>(null);

  // Auto-pick the mode when only one type is available for this level.
  useEffect(() => {
    setMode(availableModes.length === 1 ? availableModes[0] : null);
  }, [availableModes]);

  // Auto-pick only when the mode has exactly one skill — with more than one
  // (e.g. MG11's PowersOfTen + MultDivFractionLab, both "standalone"), leave
  // selectedSkill unset so the SkillPicker below renders instead of silently
  // locking the student into whichever skill happened to load first.
  useEffect(() => {
    if (!mode) {
      setSelectedSkill(null);
      return;
    }
    const pool = poolsByMode[mode];
    setSelectedSkill(pool.length === 1 ? pool[0] : null);
  }, [mode, poolsByMode]);

  // Student.hwkHistory is never actually written anywhere in this codebase — derive it
  // from hwkAssigned (reliably populated), same as StudentDashboard/progressService do.
  const hwkHistory = useMemo(
    () => buildHwkHistoryFromAssignments(currentStudent?.hwkAssigned ?? []),
    [currentStudent]
  );

  if (!currentStudent || !level) return null;

  const hasHomeworkInLevel = hwkHistory.some((h) => h.level === level);
  const multipleModesAvailable = availableModes.length > 1;
  const skillPool = mode ? poolsByMode[mode] : [];
  const multipleSkillsInMode = skillPool.length > 1;
  // Standalone skills (e.g. MM1_RatioLab) bring their own full page chrome and are
  // designed to render full-bleed — see the comment in ProblemRenderer.tsx's
  // StandaloneProblem. Skip our own header/max-w wrapper so they aren't squeezed
  // into the narrower column used by the visual/wordProblem card modes.
  const isStandalone = mode === "standalone" && selectedSkill?.type === "standalone";

  if (isStandalone && selectedSkill && hasHomeworkInLevel) {
    return (
      <>
        {multipleSkillsInMode && (
          <button
            onClick={() => setSelectedSkill(null)}
            className="fixed top-3 left-3 z-20 px-3 py-1.5 text-xs font-medium text-gray-600 !bg-white/90 border border-gray-200 rounded-lg shadow-sm hover:!bg-gray-50 transition-all duration-200"
          >
            ← Choose something else to practice
          </button>
        )}
        <ProblemRenderer level={level} skill={selectedSkill} />
      </>
    );
  }

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
            {multipleModesAvailable && mode && (
              <button
                onClick={() => setMode(null)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Change practice mode
              </button>
            )}
            {multipleSkillsInMode && selectedSkill && (
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Choose something else to practice
              </button>
            )}

            {!mode && <PracticeModeSelector availableModes={availableModes} onSelect={setMode} />}

            {mode && !selectedSkill && multipleSkillsInMode && (
              <SkillPicker skills={skillPool} onSelect={setSelectedSkill} />
            )}

            {mode && selectedSkill && <ProblemRenderer level={level} skill={selectedSkill} />}
          </div>
        )}
      </main>
    </div>
  );
}
