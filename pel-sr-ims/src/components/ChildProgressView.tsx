// ChildProgressView.tsx - Individual child progress display for parents

import { useState, useEffect } from "react";
import { loadStudentProgress } from "../utils/progressService";
// import { loadHistoricalProgress } from "../utils/historicalProgressService";
import ProgressGraph from "../components/student_progress_dashboard/Dashboard";
import type { Student, StudentProgress } from "../utils/types";

interface ChildProgressViewProps {
  student: Student;
}

export default function ChildProgressView({ student }: ChildProgressViewProps) {
  const [progressData, setProgressData] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMathTimeline, setShowMathTimeline] = useState(true);
  const [showEnglishTimeline, setShowEnglishTimeline] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [student]);

  const loadProgress = async () => {
    setLoading(true);
    try {
      // Try to load progress data
      const progress = await loadStudentProgress(
        student.firstName,
        student.lastName
      );

      setProgressData(progress);
    } catch (err) {
      console.error("Error loading progress:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading progress data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {student.firstName} {student.lastName}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Program Start Dates */}
          {student.subjects_startDate_Map && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Program Start Dates</h3>
              <div className="space-y-1">
                {Object.entries(student.subjects_startDate_Map).map(([subject, date]) => (
                  <div key={subject} className="text-sm text-gray-600">
                    <span className="font-medium">{subject}:</span> {date}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Levels */}
          {progressData && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Current Levels</h3>
              <div className="space-y-1">
                {progressData.mathProgress && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Math:</span>{" "}
                    <span className="text-blue-600 font-semibold">
                      {progressData.mathProgress.currentLevel}
                    </span>
                  </div>
                )}
                {progressData.englishProgress && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">English:</span>{" "}
                    <span className="text-green-600 font-semibold">
                      {progressData.englishProgress.currentLevel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Math Progress */}
      {progressData?.mathProgress && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Math Progress</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMathTimeline(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  showMathTimeline
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setShowMathTimeline(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  !showMathTimeline
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                By Level
              </button>
            </div>
          </div>

          {/* Current Level Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Current Level</p>
              <p className="text-lg font-bold text-blue-800">
                {progressData.mathProgress.currentLevel}
              </p>
            </div>
            {progressData.mathProgress.estimatedMM1Date && (
              <div>
                <p className="text-sm text-gray-600">Est. MM1 Date</p>
                <p className="text-lg font-bold text-blue-800">
                  {progressData.mathProgress.estimatedMM1Date.toLocaleDateString()}
                </p>
              </div>
            )}
            {progressData.mathProgress.estimatedCompletionDate && (
              <div>
                <p className="text-sm text-gray-600">Est. Completion</p>
                <p className="text-lg font-bold text-blue-800">
                  {progressData.mathProgress.estimatedCompletionDate.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Progress Graph */}
          <ProgressGraph
            subjectProgress={progressData.mathProgress}
            showTimeline={showMathTimeline}
          />

          {/* Level History Table */}
          <div className="mt-6 overflow-x-auto">
            <h4 className="font-semibold text-gray-700 mb-3">Level History</h4>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Level</th>
                  <th className="px-4 py-2 text-left font-semibold">Start Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Pages</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {progressData.mathProgress.levelHistory.map((level) => (
                  <tr key={level.level} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{level.level}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {level.startDate.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          level.isComplete
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {level.isComplete ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {level.pagesCompleted} / 110
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* English Progress */}
      {progressData?.englishProgress && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">English Progress</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEnglishTimeline(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  showEnglishTimeline
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setShowEnglishTimeline(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  !showEnglishTimeline
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                By Level
              </button>
            </div>
          </div>

          {/* Current Level Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Current Level</p>
              <p className="text-lg font-bold text-green-800">
                {progressData.englishProgress.currentLevel}
              </p>
            </div>
            {progressData.englishProgress.estimatedCompletionDate && (
              <div>
                <p className="text-sm text-gray-600">Est. Completion</p>
                <p className="text-lg font-bold text-green-800">
                  {progressData.englishProgress.estimatedCompletionDate.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Progress Graph */}
          <ProgressGraph
            subjectProgress={progressData.englishProgress}
            showTimeline={showEnglishTimeline}
          />

          {/* Level History Table */}
          <div className="mt-6 overflow-x-auto">
            <h4 className="font-semibold text-gray-700 mb-3">Level History</h4>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Level</th>
                  <th className="px-4 py-2 text-left font-semibold">Start Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Pages</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {progressData.englishProgress.levelHistory.map((level) => (
                  <tr key={level.level} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{level.level}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {level.startDate.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          level.isComplete
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {level.isComplete ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {level.pagesCompleted} / 110
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Progress Data */}
      {!progressData && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">
            No progress data available yet. Progress tracking will appear here once {student.firstName} begins their program.
          </p>
        </div>
      )}
    </div>
  );
}