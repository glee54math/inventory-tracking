// Dashboard.tsx - Main dashboard for tracking student progress (FIXED VERSION)

import { useEffect, useState } from "react";
import { loadStudentsFromDB } from "../../utils/inventoryService";
import {
  buildStudentProgress,
  saveStudentProgress,
  loadStudentProgress,
  updateCustomPace,
} from "../../utils/progressService";
import type { Student, StudentProgress, SubjectProgress } from "../../utils/types";
import ProgressGraph from "./ProgressGraph";
import HistoricalDataForm from "./HistoricalDataForm";
// import { MATH_LEVELS, ENGLISH_LEVELS } from "../utils/types";

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(true);
  const [activeSubject, setActiveSubject] = useState<"Math" | "English">("Math");
  const [showPaceEditor, setShowPaceEditor] = useState(false);
  const [customPaceMap, setCustomPaceMap] = useState<Record<string, number>>({});
  const [showHistoricalDataForm, setShowHistoricalDataForm] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const loadedStudents = await loadStudentsFromDB("san-ramon");
      console.log("Loaded students:", loadedStudents);
      setStudents(loadedStudents);
    } catch (err) {
      console.error("Error loading students:", err);
      setError("Failed to load students");
    }
  };

  const handleStudentSelect = async (student: Student) => {
    setLoading(true);
    setError(null);
    setSelectedStudent(student);

    try {
      console.log("Selected student:", student);
      
      // Try to load existing progress
      let progress = await loadStudentProgress(
        student.firstName,
        student.lastName
      );

      console.log("Existing progress:", progress);

      // If no progress exists, build it from logs
      if (!progress) {
        console.log("No existing progress found. Building from logs...");
        progress = await buildStudentProgress(student);
        console.log("Built progress:", progress);
        
        await saveStudentProgress(progress);
        console.log("Saved progress to Firestore");
      }

      setStudentProgress(progress);

      // Check if there's any progress data
      if (!progress.mathProgress && !progress.englishProgress) {
        setError("No homework history found for this student. Assign some homework first!");
      }

      // Initialize custom pace map
      const paceMap: Record<string, number> = {};
      progress.mathProgress?.levelHistory.forEach((lp) => {
        if (lp.customMonthsToComplete) {
          paceMap[lp.level] = lp.customMonthsToComplete;
        }
      });
      progress.englishProgress?.levelHistory.forEach((lp) => {
        if (lp.customMonthsToComplete) {
          paceMap[lp.level] = lp.customMonthsToComplete;
        }
      });
      setCustomPaceMap(paceMap);
    } catch (error) {
      console.error("Error loading student progress:", error);
      setError(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshProgress = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    setError(null);
    try {
      const progress = await buildStudentProgress(selectedStudent);
      await saveStudentProgress(progress);
      setStudentProgress(progress);
      alert("Progress refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing progress:", error);
      setError(`Failed to refresh: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomPace = async () => {
    if (!studentProgress) return;

    setLoading(true);
    try {
      await updateCustomPace(
        studentProgress.studentId,
        activeSubject,
        customPaceMap
      );

      // Reload progress
      const updatedProgress = await loadStudentProgress(
        selectedStudent!.firstName,
        selectedStudent!.lastName
      );
      setStudentProgress(updatedProgress);
      setShowPaceEditor(false);
      alert("Custom pace saved successfully!");
    } catch (error) {
      console.error("Error saving custom pace:", error);
      alert("Failed to save custom pace. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const getActiveProgress = (): SubjectProgress | undefined => {
    return activeSubject === "Math"
      ? studentProgress?.mathProgress
      : studentProgress?.englishProgress;
  };

  const getRemainingLevels = () => {
    const progress = getActiveProgress();
    if (!progress) return [];

    return progress.levelHistory.filter((lp) => !lp.isComplete);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 p-6 overflow-auto z-50">
      <h1 className="text-3xl font-bold mb-6">Student Progress Dashboard</h1>

      {/* Student Selector */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <label className="block text-sm font-medium mb-2">Select Student:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedStudent ? `${selectedStudent.firstName}-${selectedStudent.lastName}` : ""}
          onChange={(e) => {
            const [firstName, lastName] = e.target.value.split("-");
            const student = students.find(
              (s) => s.firstName === firstName && s.lastName === lastName
            );
            if (student) handleStudentSelect(student);
          }}
        >
          <option value="">-- Select a Student --</option>
          {students.map((student) => (
            <option
              key={student.firstName + student.lastName}
              value={`${student.firstName}-${student.lastName}`}
            >
              {student.firstName} {student.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded mb-6">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <p className="text-sm mt-2">Check browser console for details.</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-lg mt-2">Loading progress data...</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && selectedStudent && studentProgress && (
        <>
          {/* Student Info & Metrics */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              {selectedStudent.firstName} {selectedStudent.lastName}
            </h2>

            <div className={`grid gap-6 ${
              studentProgress.mathProgress && studentProgress.englishProgress 
                ? 'grid-cols-2' 
                : 'grid-cols-1'
            }`}>
              {/* Math Progress */}
              {studentProgress.mathProgress && (
                <div className={studentProgress.englishProgress ? "border-r pr-6" : ""}>
                  <h3 className="text-lg font-semibold text-blue-600 mb-3">
                    Math Progress
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Current Level:</span>{" "}
                      {studentProgress.mathProgress.currentLevel}
                    </p>
                    <p>
                      <span className="font-medium">Program Start:</span>{" "}
                      {formatDate(studentProgress.mathProgress.programStartDate)}
                    </p>
                    <p>
                      <span className="font-medium">Current Level Start:</span>{" "}
                      {formatDate(
                        studentProgress.mathProgress.levelHistory.find(
                          (l) =>
                            l.level === studentProgress.mathProgress!.currentLevel
                        )?.startDate
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Est. MM1 Completion:</span>{" "}
                      {formatDate(studentProgress.mathProgress.estimatedMM1Date)}
                    </p>
                    <p>
                      <span className="font-medium">Est. MH1 Completion:</span>{" "}
                      {formatDate(studentProgress.mathProgress.estimatedMH1Date)}
                    </p>
                    <p>
                      <span className="font-medium">
                        Est. Program Completion:
                      </span>{" "}
                      {formatDate(
                        studentProgress.mathProgress.estimatedCompletionDate
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* English Progress */}
              {studentProgress.englishProgress && (
                <div className={studentProgress.mathProgress ? "pl-6" : ""}>
                  <h3 className="text-lg font-semibold text-green-600 mb-3">
                    English Progress
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Current Level:</span>{" "}
                      {studentProgress.englishProgress.currentLevel}
                    </p>
                    <p>
                      <span className="font-medium">Program Start:</span>{" "}
                      {formatDate(studentProgress.englishProgress.programStartDate)}
                    </p>
                    <p>
                      <span className="font-medium">Current Level Start:</span>{" "}
                      {formatDate(
                        studentProgress.englishProgress.levelHistory.find(
                          (l) =>
                            l.level ===
                            studentProgress.englishProgress!.currentLevel
                        )?.startDate
                      )}
                    </p>
                    <p>
                      <span className="font-medium">
                        Est. Program Completion:
                      </span>{" "}
                      {formatDate(
                        studentProgress.englishProgress.estimatedCompletionDate
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* No Progress Warning */}
              {!studentProgress.mathProgress && !studentProgress.englishProgress && (
                <div className="col-span-1 text-center py-8">
                  <p className="text-lg text-gray-600">
                    No progress data available for this student yet.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Make sure homework has been assigned to them in the logs.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleRefreshProgress}
                className="px-4 py-2 !bg-blue-500 text-white rounded hover:!bg-blue-600"
              >
                Refresh Progress
              </button>
              <button
                onClick={() => setShowHistoricalDataForm(!showHistoricalDataForm)}
                className="px-4 py-2 !bg-green-500 text-white rounded hover:!bg-green-600"
              >
                {showHistoricalDataForm ? "Hide" : "Add"} Historical Data
              </button>
            </div>
          </div>

          {/* Historical Data Form */}
          {showHistoricalDataForm && (
            <HistoricalDataForm
              student={selectedStudent}
              currentMathLevel={studentProgress.mathProgress?.currentLevel}
              currentEnglishLevel={studentProgress.englishProgress?.currentLevel}
              onSave={handleRefreshProgress}
            />
          )}

          {/* Subject Toggle and View Controls */}
          {(studentProgress.mathProgress || studentProgress.englishProgress) && (
            <>
              <div className="bg-white p-4 rounded shadow mb-6">
                <div className="flex gap-4 items-center">
                  <span className="font-medium">Subject:</span>
                  {studentProgress.mathProgress && (
                    <button
                      onClick={() => setActiveSubject("Math")}
                      className={`px-4 py-2 rounded ${
                        activeSubject === "Math"
                          ? "!bg-blue-500 text-white"
                          : "!bg-gray-200"
                      }`}
                    >
                      Math
                    </button>
                  )}
                  {studentProgress.englishProgress && (
                    <button
                      onClick={() => setActiveSubject("English")}
                      className={`px-4 py-2 rounded ${
                        activeSubject === "English"
                          ? "!bg-green-500 text-white"
                          : "!bg-gray-200"
                      }`}
                    >
                      English
                    </button>
                  )}

                  <span className="ml-8 font-medium">View:</span>
                  <button
                    onClick={() => setShowTimeline(!showTimeline)}
                    className="px-4 py-2 !bg-purple-500 text-white rounded hover:!bg-purple-600"
                  >
                    {showTimeline ? "Switch to Level Progression" : "Switch to Timeline"}
                  </button>

                  <button
                    onClick={() => setShowPaceEditor(!showPaceEditor)}
                    className="ml-auto px-4 py-2 !bg-orange-500 text-white rounded hover:!bg-orange-600"
                  >
                    {showPaceEditor ? "Hide" : "Adjust"} Pace
                  </button>
                </div>
              </div>

              {/* Graph */}
              {getActiveProgress() && (
                <div className="bg-white p-6 rounded shadow mb-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {activeSubject} Progress{" "}
                    {showTimeline ? "(Timeline View)" : "(Level Progression View)"}
                  </h3>
                  <ProgressGraph
                    subjectProgress={getActiveProgress()!}
                    showTimeline={showTimeline}
                  />
                </div>
              )}

              {/* Pace Editor */}
              {showPaceEditor && (
                <div className="bg-white p-6 rounded shadow">
                  <h3 className="text-xl font-semibold mb-4">
                    Adjust Pace for Remaining Levels
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Set custom completion times (in months) for upcoming levels. Leave
                    blank to use default (3.3 months).
                  </p>

                  {getRemainingLevels().length > 0 ? (
                    <>
                      <div className="grid grid-cols-4 gap-4">
                        {getRemainingLevels().map((lp) => (
                          <div key={lp.level} className="border p-3 rounded">
                            <label className="block font-medium text-sm mb-1">
                              {lp.level}
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              min="0.1"
                              placeholder="3.3"
                              value={customPaceMap[lp.level] || ""}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setCustomPaceMap((prev) => ({
                                  ...prev,
                                  [lp.level]: value || 3.3,
                                }));
                              }}
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">months</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={handleSaveCustomPace}
                          className="px-4 py-2 !bg-green-500 text-white rounded hover:!bg-green-600"
                        >
                          Save Custom Pace
                        </button>
                        <button
                          onClick={() => setShowPaceEditor(false)}
                          className="px-4 py-2 !bg-gray-300 rounded hover:!bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-600">All levels completed! 🎉</p>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !selectedStudent && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            Select a student to view their progress
          </p>
        </div>
      )}
    </div>
  );
}