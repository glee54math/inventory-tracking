import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentContext } from "./StudentContext";
import { loadStudentProgress } from "../../utils/progressService";
import type { StudentProgress } from "../../utils/types";
import LevelStatusCard from "./LevelStatusCard";
import HomeworkQueue from "./HomeworkQueue";
import RecentActivity from "./RecentActivity";
import SupplementalLevelBrowser from "./SupplementalLevelBrowser";
import WhatsNextCard from "./WhatsNextCard";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { currentStudent, setCurrentStudent } = useStudentContext();
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentStudent) {
      navigate("/student-login");
      return;
    }
    let cancelled = false;
    setLoading(true);
    loadStudentProgress(currentStudent.firstName, currentStudent.lastName)
      .then((data) => { if (!cancelled) setProgress(data); })
      .catch((err) => console.error("Error loading student progress:", err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [currentStudent]);

  const handleLogout = () => {
    setCurrentStudent(null);
    navigate("/student-login");
  };

  if (!currentStudent) return null;

  const hasProgress = !!(progress?.mathProgress || progress?.englishProgress);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Hi, {currentStudent.firstName}!
            </h1>
            <p className="text-sm text-gray-400">PEL Student Portal</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-600 !bg-gray-100 rounded-xl hover:!bg-gray-200 transition-all duration-200"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
            <p className="text-gray-400">Loading your progress...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Level status */}
            {hasProgress && (
              <section>
                <SectionLabel>Your Levels</SectionLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {progress?.mathProgress && (
                    <LevelStatusCard
                      subjectProgress={progress.mathProgress}
                      startingGrade={currentStudent.startingGrade}
                    />
                  )}
                  {progress?.englishProgress && (
                    <LevelStatusCard
                      subjectProgress={progress.englishProgress}
                      startingGrade={currentStudent.startingGrade}
                    />
                  )}
                </div>
              </section>
            )}

            {/* Homework + Recent Activity */}
            <section>
              <SectionLabel>Assignments</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HomeworkQueue hwkAssigned={currentStudent.hwkAssigned ?? []} />
                <RecentActivity hwkHistory={currentStudent.hwkHistory ?? []} />
              </div>
            </section>

            {/* Supplemental Browser + What's Next */}
            {hasProgress && (
              <section>
                <SectionLabel>Practice & Ahead</SectionLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SupplementalLevelBrowser
                    mathCurrentLevel={progress?.mathProgress?.currentLevel}
                    englishCurrentLevel={progress?.englishProgress?.currentLevel}
                  />
                  <WhatsNextCard
                    mathProgress={progress?.mathProgress ?? undefined}
                    englishProgress={progress?.englishProgress ?? undefined}
                  />
                </div>
              </section>
            )}

            {/* No progress yet */}
            {!hasProgress && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <p className="text-gray-400 text-sm">
                  No progress data found yet. Check back after your first session!
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
      {children}
    </h2>
  );
}
