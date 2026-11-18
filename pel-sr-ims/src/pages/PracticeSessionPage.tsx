import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentContext } from "../components/student_portal/StudentContext";
import { buildHwkHistoryFromAssignments, getLevelIndex } from "../utils/progressService";
import { getSkillsForLevel } from "../utils/levelSubsections";
import type { LevelSkill } from "../utils/levelSubsections";
import PracticeModeSelector from "../components/student_portal/PracticeModeSelector";
import type { PracticeMode } from "../components/student_portal/PracticeModeSelector";
import ProblemRenderer from "../components/student_portal/ProblemRenderer";
import SkillPicker from "../components/student_portal/SkillPicker";
import { LabNudge, TeacherLabPanel, useLabStatuses } from "../components/student_portal/LabOrder";
import { LAB_BY_ID, nextUp, unmetNeeds } from "../utils/labOrder";

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

  // Lab order (utils/labOrder.ts): this level's labs plus the labs they need.
  // Needs only nudge ("This lab is easier after …"); every lab stays open.
  const levelLabIds = useMemo(
    () => poolsByMode.standalone.map((s) => ("componentFile" in s ? s.componentFile : "")).filter((id) => LAB_BY_ID[id]),
    [poolsByMode]
  );
  const labIds = useMemo(
    () => Array.from(new Set([...levelLabIds, ...levelLabIds.flatMap((id) => LAB_BY_ID[id].needs)])),
    [levelLabIds]
  );
  const { statuses: labStatuses, refresh: refreshLabStatuses } = useLabStatuses(
    currentStudent?.location,
    currentStudent?.id,
    labIds
  );
  const nextUpId = labStatuses ? nextUp(levelLabIds, labStatuses) : null;
  const [teacherOpen, setTeacherOpen] = useState(false);
  // Labs the student chose to start anyway this session (so the tip shows once).
  const ackKey = `lab-order-ack:${currentStudent?.id ?? "guest"}`;
  const [acked, setAcked] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(ackKey) ?? "[]");
    } catch {
      return [];
    }
  });
  const ackLab = (id: string) => {
    const next = [...acked, id];
    setAcked(next);
    try {
      sessionStorage.setItem(ackKey, JSON.stringify(next));
    } catch {
      /* the tip may show again next time; that's fine */
    }
  };

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

  // A level is open if the student has homework in it OR in any higher level of the
  // same subject — e.g. a student who started in MG5 can still practice MG1–MG4.
  const subject = level.startsWith("M") ? "Math" : "English";
  const levelIdx = getLevelIndex(level, subject);
  const hasHomeworkInLevel = hwkHistory.some(
    (h) =>
      h.level === level ||
      (levelIdx >= 0 && h.level.startsWith(level[0]) && getLevelIndex(h.level, subject) >= levelIdx)
  );
  const multipleModesAvailable = availableModes.length > 1;
  const skillPool = mode ? poolsByMode[mode] : [];
  const multipleSkillsInMode = skillPool.length > 1;
  // Standalone skills (e.g. MM1_RatioLab) bring their own full page chrome and are
  // designed to render full-bleed — see the comment in ProblemRenderer.tsx's
  // StandaloneProblem. Skip our own header/max-w wrapper so they aren't squeezed
  // into the narrower column used by the visual/wordProblem card modes.
  const isStandalone = mode === "standalone" && selectedSkill?.type === "standalone";
  const selectedLabId = isStandalone && selectedSkill && "componentFile" in selectedSkill ? selectedSkill.componentFile : null;
  const selectedLab = selectedLabId ? LAB_BY_ID[selectedLabId] : undefined;
  const selectedUnmet =
    selectedLab && labStatuses && !labStatuses[selectedLab.id]?.finished ? unmetNeeds(selectedLab.id, labStatuses) : [];
  // Wait for the finished check before opening a lab that has needs, so the tip
  // doesn't pop up over a lab that already started.
  const waitingForLabOrder = !!selectedLab && selectedLab.needs.length > 0 && labStatuses === null;
  const showNudge = !!selectedLab && selectedUnmet.length > 0 && !acked.includes(selectedLab.id);

  const teacherPanel =
    teacherOpen && labStatuses && currentStudent?.location && currentStudent?.id ? (
      <TeacherLabPanel
        location={currentStudent.location}
        studentId={currentStudent.id}
        studentName={`${currentStudent.firstName} ${currentStudent.lastName}`}
        labIds={labIds}
        statuses={labStatuses}
        onChanged={refreshLabStatuses}
        onClose={() => setTeacherOpen(false)}
      />
    ) : null;

  if (isStandalone && selectedSkill && hasHomeworkInLevel && !waitingForLabOrder && !showNudge) {
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
              <SkillPicker
                skills={skillPool}
                onSelect={setSelectedSkill}
                statuses={mode === "standalone" ? labStatuses : null}
                nextUpId={nextUpId}
                onTeacher={mode === "standalone" && labStatuses ? () => setTeacherOpen(true) : undefined}
              />
            )}

            {mode && selectedSkill && waitingForLabOrder && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-sm text-gray-400">Loading…</div>
            )}

            {mode && selectedSkill && selectedLab && showNudge && (
              <LabNudge
                lab={selectedLab}
                unmet={selectedUnmet}
                onStart={() => ackLab(selectedLab.id)}
                onTeacher={() => setTeacherOpen(true)}
              />
            )}

            {mode && selectedSkill && !waitingForLabOrder && !showNudge && <ProblemRenderer level={level} skill={selectedSkill} />}
          </div>
        )}
      </main>
      {teacherPanel}
    </div>
  );
}
