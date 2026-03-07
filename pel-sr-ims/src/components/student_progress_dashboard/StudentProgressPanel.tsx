// StudentProgressPanel.tsx - Reusable student progress panel

import { useState } from "react";
import type { Student, StudentProgress, SubjectProgress, GradeSkip } from "../../utils/types";
import ProgressGraph from "./ProgressGraph";

interface StudentProgressPanelProps {
  student: Student;
  studentProgress: StudentProgress;
  blurName: boolean;
  onRefreshProgress: () => void;
  onToggleHistoricalDataForm: () => void;
  showHistoricalDataForm: boolean;
  showPaceEditor: boolean;
  onTogglePaceEditor: () => void;
  customPaceMap: Record<string, number>;
  onPaceChange: (level: string, months: number) => void;
  onSavePace: () => void;
  startingGrade?: string;
  gradeSkips?: GradeSkip[];
  activeSubject: string;
  setActiveSubject: React.Dispatch<React.SetStateAction<'Math'|'English'>>;
}

export default function StudentProgressPanel({
  student,
  studentProgress,
  blurName,
  onRefreshProgress,
  onToggleHistoricalDataForm,
  showHistoricalDataForm,
  showPaceEditor,
  onTogglePaceEditor,
  customPaceMap,
  onPaceChange,
  onSavePace,
  startingGrade,
  gradeSkips = [],
  activeSubject,
  setActiveSubject,
}: StudentProgressPanelProps) {
  const [showTimeline, setShowTimeline] = useState(true);
  // const [activeSubject, setActiveSubject] = useState<"Math" | "English">("Math");
  
  // Collapsible section states
  const [isStudentInfoExpanded, setIsStudentInfoExpanded] = useState(true);
  const [isGraphExpanded, setIsGraphExpanded] = useState(true);
  const [isLevelHistoryExpanded, setIsLevelHistoryExpanded] = useState(true);

  // Drag and drop state
  const [sectionOrder, setSectionOrder] = useState<string[]>(['graph', 'levelHistory', 'paceEditor']);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const getActiveProgress = (): SubjectProgress | undefined => {
    return activeSubject === "Math"
      ? studentProgress?.mathProgress
      : studentProgress?.englishProgress;
  };

  // Get remaining levels for the active subject
  const getRemainingLevels = () => {
    const progress = getActiveProgress();
    if (!progress) return [];
    
    return progress.levelHistory
      .filter((lp) => !lp.isComplete)
      .map((lp) => lp.level);
  };

  // Drag handlers
  const handleDragStart = (section: string) => (e: React.DragEvent) => {
    setDraggedSection(section);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (section: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedSection && draggedSection !== section) {
      setDragOverSection(section);
    }
  };

  const handleDragLeave = () => {
    setDragOverSection(null);
  };

  const handleDrop = (targetSection: string) => (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedSection || draggedSection === targetSection) {
      setDraggedSection(null);
      setDragOverSection(null);
      return;
    }

    const newOrder = [...sectionOrder];
    const draggedIndex = newOrder.indexOf(draggedSection);
    const targetIndex = newOrder.indexOf(targetSection);

    // Swap the sections
    [newOrder[draggedIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[draggedIndex]];

    setSectionOrder(newOrder);
    setDraggedSection(null);
    setDragOverSection(null);
  };

  const handleDragEnd = () => {
    setDraggedSection(null);
    setDragOverSection(null);
  };

  // Render draggable sections
  const renderGraphSection = () => (
    <div
      key="graph"
      draggable
      onDragStart={handleDragStart('graph')}
      onDragOver={handleDragOver('graph')}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop('graph')}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded shadow mb-6 transition-all duration-200 ${
        draggedSection === 'graph' ? 'opacity-60' : ''
      } ${
        dragOverSection === 'graph' ? 'border-2 border-dashed border-blue-500' : ''
      }`}
      style={{ cursor: draggedSection ? 'grabbing' : 'grab' }}
    >
      {/* Clickable Header */}
      <div 
        className="p-6 pb-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
        onClick={() => setIsGraphExpanded(!isGraphExpanded)}
      >
        <h3 className="text-xl font-semibold">
          {activeSubject} Progress {showTimeline ? "(Timeline View)" : "(Level Progression)"}
        </h3>
        <span className="text-2xl text-gray-500 select-none">
          {isGraphExpanded ? '▼' : '▶'}
        </span>
      </div>

      {/* Collapsible Content */}
      {isGraphExpanded && (
        <div className="px-6 pb-6">
          {getActiveProgress() && (
            <ProgressGraph
              subjectProgress={getActiveProgress()!}
              showTimeline={showTimeline}
              startingGrade={startingGrade}
              gradeSkips={gradeSkips}
            />
          )}
        </div>
      )}
    </div>
  );

  const renderLevelHistorySection = () => (
    <div
      key="levelHistory"
      draggable
      onDragStart={handleDragStart('levelHistory')}
      onDragOver={handleDragOver('levelHistory')}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop('levelHistory')}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded shadow mb-6 transition-all duration-200 ${
        draggedSection === 'levelHistory' ? 'opacity-60' : ''
      } ${
        dragOverSection === 'levelHistory' ? 'border-2 border-dashed border-blue-500' : ''
      }`}
      style={{ cursor: draggedSection ? 'grabbing' : 'grab' }}
    >
      {/* Clickable Header */}
      <div 
        className="p-6 pb-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
        onClick={() => setIsLevelHistoryExpanded(!isLevelHistoryExpanded)}
      >
        <h3 className="text-xl font-semibold">Level History</h3>
        <span className="text-2xl text-gray-500 select-none">
          {isLevelHistoryExpanded ? '▼' : '▶'}
        </span>
      </div>

      {/* Collapsible Content */}
      {isLevelHistoryExpanded && getActiveProgress() && (
        <div className="px-6 pb-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Level</th>
                  <th className="border border-gray-300 p-2 text-left">Start Date</th>
                  <th className="border border-gray-300 p-2 text-left">Est. Completion</th>
                  <th className="border border-gray-300 p-2 text-left">Pages Completed</th>
                  <th className="border border-gray-300 p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {getActiveProgress()!.levelHistory.map((level) => {
                  let status = 'In Progress';
                  let statusColor = '!bg-yellow-100 text-yellow-800';
                  
                  if (level.isComplete) {
                    status = 'Completed';
                    statusColor = '!bg-green-100 text-green-800';
                  } else if ((level.pagesCompleted || 0) === 0) {
                    status = 'Not Started';
                    statusColor = '!bg-red-50 text-red-700';
                  }
                  
                  return (
                    <tr key={level.level} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 font-medium">{level.level}</td>
                      <td className="border border-gray-300 p-2">{formatDate(level.startDate)}</td>
                      <td className="border border-gray-300 p-2">
                        {formatDate(level.estimatedCompletion)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {level.pagesCompleted || 0} / 110
                      </td>
                      <td className="border border-gray-300 p-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderPaceEditorSection = () => {
    if (!showPaceEditor || getRemainingLevels().length === 0) return null;
    
    return (
      <div
        key="paceEditor"
        draggable
        onDragStart={handleDragStart('paceEditor')}
        onDragOver={handleDragOver('paceEditor')}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop('paceEditor')}
        onDragEnd={handleDragEnd}
        className={`bg-white rounded shadow mb-6 transition-all duration-200 ${
          draggedSection === 'paceEditor' ? 'opacity-60' : ''
        } ${
          dragOverSection === 'paceEditor' ? 'border-2 border-dashed border-blue-500' : ''
        }`}
        style={{ cursor: draggedSection ? 'grabbing' : 'grab' }}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">
            Adjust Pace for Remaining Levels
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Set custom completion times (in months) for upcoming levels. Leave blank to use default pace (3.3 months).
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getRemainingLevels().map((level) => (
              <div key={level} className="border rounded p-3">
                <label className="block font-semibold text-sm mb-1">{level}</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="0.1"
                  placeholder="3.3"
                  value={customPaceMap[level] || ""}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    // If empty/invalid, send 0 which Dashboard will interpret as "delete"
                    onPaceChange(level, isNaN(value) ? 0 : value);
                  }}
                  className="w-full p-2 border rounded text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-xs text-gray-500">months</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSavePace();
              }}
              className="px-4 py-2 !bg-green-500 text-white rounded hover:!bg-green-600"
            >
              Save Custom Pace
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePaceEditor();
              }}
              className="px-4 py-2 !bg-gray-200 rounded hover:!bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Student Info & Metrics - Collapsible */}
      <div className="bg-white rounded shadow mb-6">
        {/* Clickable Header */}
        <div 
          className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
          onClick={() => setIsStudentInfoExpanded(!isStudentInfoExpanded)}
        >
          <h2 
            className="text-2xl font-semibold"
            style={{ filter: blurName ? 'blur(8px)' : 'none' }}
          >
            {student.firstName} {student.lastName}
          </h2>
          <span className="text-2xl text-gray-500 select-none">
            {isStudentInfoExpanded ? '▼' : '▶'}
          </span>
        </div>

        {/* Collapsible Content */}
        {isStudentInfoExpanded && (
          <div className="px-6 pb-6">
            <div className={`grid gap-6 ${
              studentProgress.mathProgress && studentProgress.englishProgress 
                ? 'grid-cols-2' 
                : 'grid-cols-1'
            }`}>
              {/* Math Progress */}
              {studentProgress.mathProgress && (
                <div className={studentProgress.englishProgress ? "border-r border-gray-300 pr-6" : ""}>
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
                          (l) => l.level === studentProgress.mathProgress!.currentLevel
                        )?.startDate
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Est. MM1 Completion:</span>{" "}
                      {formatDate(
                        studentProgress.mathProgress.levelHistory.find(
                          (l) => l.level === "MM1"
                        )?.estimatedCompletion
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Est. MH1 Completion:</span>{" "}
                      {formatDate(
                        studentProgress.mathProgress.levelHistory.find(
                          (l) => l.level === "MH1"
                        )?.estimatedCompletion
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Est. Program Completion:</span>{" "}
                      {formatDate(studentProgress.mathProgress.estimatedCompletionDate)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onRefreshProgress();
                }}
                className="px-4 py-2 !bg-blue-500 text-white rounded hover:!bg-blue-600"
              >
                Refresh Progress
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHistoricalDataForm();
                }}
                className="px-4 py-2 !bg-green-500 text-white rounded hover:!bg-green-600"
              >
                {showHistoricalDataForm ? "Hide" : "Add"} Historical Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subject Toggle and View Controls */}
      {(studentProgress.mathProgress || studentProgress.englishProgress) && (
        <>
          <div className="bg-white p-4 rounded shadow mb-6 overflow-x-auto">
            <div className="flex gap-4 items-center min-w-max">
              <span className="font-medium whitespace-nowrap">Subject:</span>
              {studentProgress.mathProgress && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSubject("Math");
                  }}
                  className={`px-4 py-2 rounded whitespace-nowrap ${
                    activeSubject === "Math"
                      ? "!bg-blue-500 text-white"
                      : "!bg-gray-200 hover:!bg-gray-300"
                  }`}
                >
                  Math
                </button>
              )}
              {studentProgress.englishProgress && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSubject("English");
                  }}
                  className={`px-4 py-2 rounded whitespace-nowrap ${
                    activeSubject === "English"
                      ? "!bg-green-500 text-white"
                      : "!bg-gray-200 hover:!bg-gray-300"
                  }`}
                >
                  English
                </button>
              )}

              <span className="ml-auto font-medium whitespace-nowrap">View:</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTimeline(!showTimeline);
                }}
                className="px-4 py-2 !bg-purple-500 text-white rounded hover:!bg-purple-600 whitespace-nowrap"
              >
                {showTimeline ? "Switch to Level Progression" : "Switch to Timeline View"}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePaceEditor();
                }}
                className="px-4 py-2 !bg-orange-500 text-white rounded hover:!bg-orange-600 whitespace-nowrap"
              >
                Adjust Pace
              </button>
            </div>
          </div>

          {/* Draggable Sections - Rendered in Custom Order */}
          {sectionOrder.map((sectionId) => {
            switch (sectionId) {
              case 'graph':
                return renderGraphSection();
              case 'levelHistory':
                return renderLevelHistorySection();
              case 'paceEditor':
                return renderPaceEditorSection();
              default:
                return null;
            }
          })}
        </>
      )}
    </div>
  );
}