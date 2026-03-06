// Dashboard.tsx - Main dashboard using modular StudentProgressPanel

import { useEffect, useState } from "react";
import { loadStudentsFromDB } from "../../utils/inventoryService";
import {
  buildStudentProgress,
  saveStudentProgress,
  loadStudentProgress,
  updateCustomPace,
} from "../../utils/progressService";
import { loadHistoricalProgress } from "../../utils/historicalProgressService";
import type { Student, StudentProgress, GradeSkip } from "../../utils/types";
import StudentProgressPanel from "./StudentProgressPanel";
import HistoricalDataForm from "./HistoricalDataForm";
import StudentDiagnostic from "./HistoricalDataDiagnostics";
import { MATH_LEVELS, ENGLISH_LEVELS } from "../../utils/types";

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  
  // Student 1
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [blurName1, setBlurName1] = useState(false);
  const [showHistoricalDataForm1, setShowHistoricalDataForm1] = useState(false);
  const [showPaceEditor1, setShowPaceEditor1] = useState(false);
  const [startingGrade1, setStartingGrade1] = useState<string | undefined>(undefined);
  const [gradeSkips1, setGradeSkips1] = useState<GradeSkip[]>([]);
  
  // Student 2 (comparison)
  const [selectedStudent2, setSelectedStudent2] = useState<Student | null>(null);
  const [studentProgress2, setStudentProgress2] = useState<StudentProgress | null>(null);
  const [blurName2, setBlurName2] = useState(false);
  const [showHistoricalDataForm2, setShowHistoricalDataForm2] = useState(false);
  const [showPaceEditor2, setShowPaceEditor2] = useState(false);
  const [startingGrade2, setStartingGrade2] = useState<string | undefined>(undefined);
  const [gradeSkips2, setGradeSkips2] = useState<GradeSkip[]>([]);
  
  // Comparison mode
  const [comparisonMode, setComparisonMode] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPaceMap, setCustomPaceMap] = useState<Record<string, number>>({});
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [activeSubject, setActiveSubject] = useState<"Math" | "English">("Math");

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
      
      let progress = await loadStudentProgress(
        student.firstName,
        student.lastName
      );

      console.log("Existing progress:", progress);

      if (!progress) {
        console.log("No existing progress found. Building from logs...");
        progress = await buildStudentProgress(student);
        console.log("Built progress:", progress);
        
        await saveStudentProgress(progress);
        console.log("Saved progress to Firestore");
      }

      setStudentProgress(progress);

      // Load grade data from historical progress
      const historicalData = await loadHistoricalProgress(
        student.firstName,
        student.lastName
      );
      
      if (historicalData) {
        setStartingGrade1(historicalData.startingGrade);
        setGradeSkips1(historicalData.gradeSkips || []);
      } else {
        setStartingGrade1(undefined);
        setGradeSkips1([]);
      }

      if (!progress.mathProgress && !progress.englishProgress) {
        setError("No homework history found for this student. Assign some homework first!");
      }

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

  const handleStudent2Select = async (student: Student | null) => {
    if (!student) {
      setSelectedStudent2(null);
      setStudentProgress2(null);
      setStartingGrade2(undefined);
      setGradeSkips2([]);
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedStudent2(student);

    try {
      console.log("Selected student 2:", student);
      
      let progress = await loadStudentProgress(
        student.firstName,
        student.lastName
      );

      if (!progress) {
        console.log("No existing progress for student 2. Building...");
        progress = await buildStudentProgress(student);
        await saveStudentProgress(progress);
      }

      setStudentProgress2(progress);

      // Load grade data from historical progress
      const historicalData = await loadHistoricalProgress(
        student.firstName,
        student.lastName
      );
      
      if (historicalData) {
        setStartingGrade2(historicalData.startingGrade);
        setGradeSkips2(historicalData.gradeSkips || []);
      } else {
        setStartingGrade2(undefined);
        setGradeSkips2([]);
      }

      if (!progress.mathProgress && !progress.englishProgress) {
        setError("No homework history found for student 2.");
      }
    } catch (error) {
      console.error("Error loading student 2 progress:", error);
      setError(`Error loading student 2: ${error instanceof Error ? error.message : String(error)}`);
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

  const handleRefreshProgress2 = async () => {
    if (!selectedStudent2) return;

    setLoading(true);
    setError(null);
    try {
      const progress = await buildStudentProgress(selectedStudent2);
      await saveStudentProgress(progress);
      setStudentProgress2(progress);
      alert("Student 2 progress refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing student 2 progress:", error);
      setError(`Failed to refresh student 2: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomPace = async () => {
    if (!studentProgress) return;

    setLoading(true);
    try {
      // Get the current subject's progress
      const progress = activeSubject === "Math" 
        ? studentProgress.mathProgress 
        : studentProgress.englishProgress;
      
      if (!progress) {
        alert("No progress data for selected subject");
        setLoading(false);
        return;
      }
      
      // Filter to only this subject's levels
      const subjectLevels = new Set(progress.levelHistory.map(lp => lp.level));
      const filteredPaceMap: Record<string, number> = {};
      
      for (const level in customPaceMap) {
        if (subjectLevels.has(level)) {
          filteredPaceMap[level] = customPaceMap[level];
        }
      }
      
      await updateCustomPace(
        studentProgress.studentId,
        activeSubject,
        filteredPaceMap
      );

      const updatedProgress = await loadStudentProgress(
        selectedStudent!.firstName,
        selectedStudent!.lastName
      );
      setStudentProgress(updatedProgress);
      setShowPaceEditor1(false);
      alert("Custom pace saved successfully!");
    } catch (error) {
      console.error("Error saving custom pace:", error);
      alert("Failed to save custom pace. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const toggleComparisonMode = () => {
    if (comparisonMode) {
      setSelectedStudent2(null);
      setStudentProgress2(null);
      setBlurName2(false);
    }
    setComparisonMode(!comparisonMode);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 p-6 overflow-auto z-50">
      <h1 className="text-3xl font-bold mb-6">Student Progress Dashboard</h1>

      {/* Student Selector */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">
            Select Student {comparisonMode ? "1" : ""}:
          </label>
          <div className="flex gap-2">
            {selectedStudent && (
              <button
                onClick={() => setBlurName1(!blurName1)}
                className={`px-3 py-1 text-sm rounded ${
                  blurName1
                    ? "!bg-gray-600 text-white hover:!bg-gray-700"
                    : "!bg-gray-200 hover:!bg-gray-300"
                }`}
              >
                {blurName1 ? "👁️ Unblur" : "👁️‍🗨️ Blur"} Name
              </button>
            )}
            <button
              onClick={toggleComparisonMode}
              disabled={!selectedStudent}
              className={`px-3 py-1 text-sm rounded ${
                comparisonMode
                  ? "!bg-red-500 text-white hover:!bg-red-600"
                  : "!bg-blue-500 text-white hover:!bg-blue-600"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {comparisonMode ? "Exit Comparison" : "+ Compare"}
            </button>
            <button
              onClick={() => setShowDiagnostic(!showDiagnostic)}
              className="px-3 py-1 !bg-orange-500 text-white text-sm rounded hover:!bg-orange-600"
            >
              {showDiagnostic ? "Hide" : "Show"} Diagnostic Tool
            </button>
          </div>
        </div>
        {!blurName1 ? (
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
        ) : (
          <div className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-500 text-center">
            Student name is blurred (Unblur to change selection)
          </div>
        )}
      </div>

      {/* Student 2 Selector (Comparison Mode) */}
      {comparisonMode && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              Compare with Student 2:
            </label>
            {selectedStudent2 && (
              <button
                onClick={() => setBlurName2(!blurName2)}
                className={`px-3 py-1 text-sm rounded ${
                  blurName2
                    ? "!bg-gray-600 text-white hover:!bg-gray-700"
                    : "!bg-gray-200 hover:!bg-gray-300"
                }`}
              >
                {blurName2 ? "👁️ Unblur" : "👁️‍🗨️ Blur"} Name
              </button>
            )}
          </div>
          {!blurName2 ? (
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedStudent2 ? `${selectedStudent2.firstName}-${selectedStudent2.lastName}` : ""}
              onChange={(e) => {
                if (!e.target.value) {
                  handleStudent2Select(null);
                  return;
                }
                const [firstName, lastName] = e.target.value.split("-");
                const student = students.find(
                  (s) => s.firstName === firstName && s.lastName === lastName
                );
                handleStudent2Select(student || null);
              }}
            >
              <option value="">-- Select a Student to Compare --</option>
              {students
                .filter(s => 
                  selectedStudent 
                    ? `${s.firstName}${s.lastName}` !== `${selectedStudent.firstName}${selectedStudent.lastName}`
                    : true
                )
                .map((student) => (
                  <option
                    key={student.firstName + student.lastName}
                    value={`${student.firstName}-${student.lastName}`}
                  >
                    {student.firstName} {student.lastName}
                  </option>
                ))}
            </select>
          ) : (
            <div className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-500 text-center">
              Student 2 name is blurred (Unblur to change selection)
            </div>
          )}
        </div>
      )}

      {/* Diagnostic Tool */}
      {showDiagnostic && (
        <div className="mb-6">
          <StudentDiagnostic />
        </div>
      )}

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

      {/* Main Content - Single or Side by Side */}
      {!loading && selectedStudent && studentProgress && (
        <div className={comparisonMode && selectedStudent2 && studentProgress2 ? "grid grid-cols-2 gap-6" : ""}>
          {/* Student 1 Panel */}
          <div>
            <StudentProgressPanel
              student={selectedStudent}
              studentProgress={studentProgress}
              blurName={blurName1}
              onRefreshProgress={handleRefreshProgress}
              onToggleHistoricalDataForm={() => setShowHistoricalDataForm1(!showHistoricalDataForm1)}
              showHistoricalDataForm={showHistoricalDataForm1}
              showPaceEditor={showPaceEditor1}
              onTogglePaceEditor={() => setShowPaceEditor1(!showPaceEditor1)}
              customPaceMap={customPaceMap}
              onPaceChange={(level, months) => {
                setCustomPaceMap(prev => {
                  // If months is 0, null, or undefined, remove from map
                  if (!months || months <= 0) {
                    const { [level]: _, ...rest } = prev;
                    return rest;
                  }
                  // Otherwise set the value
                  return {
                    ...prev,
                    [level]: months
                  };
                });
              }}
              onSavePace={handleSaveCustomPace}
              startingGrade={startingGrade1}
              gradeSkips={gradeSkips1}
              activeSubject={activeSubject}
              onSubjectChange={setActiveSubject}
            />

            {/* Historical Data Form for Student 1 */}
            {showHistoricalDataForm1 && (
              <HistoricalDataForm
                student={selectedStudent}
                currentMathLevel={studentProgress.mathProgress?.currentLevel}
                currentEnglishLevel={studentProgress.englishProgress?.currentLevel}
                onSave={handleRefreshProgress}
              />
            )}
          </div>

          {/* Student 2 Panel (Comparison Mode) */}
          {comparisonMode && selectedStudent2 && studentProgress2 && (
            <div>
              <StudentProgressPanel
                student={selectedStudent2}
                studentProgress={studentProgress2}
                blurName={blurName2}
                onRefreshProgress={handleRefreshProgress2}
                onToggleHistoricalDataForm={() => setShowHistoricalDataForm2(!showHistoricalDataForm2)}
                showHistoricalDataForm={showHistoricalDataForm2}
                showPaceEditor={showPaceEditor2}
                onTogglePaceEditor={() => setShowPaceEditor2(!showPaceEditor2)}
                customPaceMap={customPaceMap}
                onPaceChange={(level, months) => {
                  setCustomPaceMap(prev => ({
                    ...prev,
                    [level]: months
                  }));
                }}
                onSavePace={handleSaveCustomPace}
                startingGrade={startingGrade2}
                gradeSkips={gradeSkips2}
              />

              {/* Historical Data Form for Student 2 */}
              {showHistoricalDataForm2 && (
                <HistoricalDataForm
                  student={selectedStudent2}
                  currentMathLevel={studentProgress2.mathProgress?.currentLevel}
                  currentEnglishLevel={studentProgress2.englishProgress?.currentLevel}
                  onSave={handleRefreshProgress2}
                />
              )}
            </div>
          )}
        </div>
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