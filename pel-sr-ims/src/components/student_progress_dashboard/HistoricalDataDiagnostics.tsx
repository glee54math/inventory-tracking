// StudentDiagnostic.tsx - Tool to diagnose missing subject data

import { useEffect, useState } from "react";
import { loadStudentsFromDB } from "../../utils/inventoryService";
import { buildHwkHistoryFromLogs } from "../../utils/progressService";
import type { Student } from "../../utils/types";

export default function StudentDiagnostic() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const loadedStudents = await loadStudentsFromDB("san-ramon");
    setStudents(loadedStudents);
  };

  const diagnoseStudent = async (student: Student) => {
    setLoading(true);
    setSelectedStudent(student);

    try {
      // Check subjects_startDate_Map
      const hasMapData = student.subjects_startDate_Map || {};
      
      // Check homework history from logs
      const hwkHistory = await buildHwkHistoryFromLogs(student.firstName, student.lastName);
      const mathHwk = hwkHistory.filter((h) => h.subject === "Math");
      const englishHwk = hwkHistory.filter((h) => h.subject === "English");

      // Check hwkAssigned field
      const hwkAssigned = student.hwkAssigned || [];
      const mathAssigned = hwkAssigned.filter((hw) => hw.startsWith("M"));
      const englishAssigned = hwkAssigned.filter((hw) => hw.startsWith("E"));

      const info = {
        studentName: `${student.firstName} ${student.lastName}`,
        subjectsStartDateMap: hasMapData,
        hasMathStartDate: !!hasMapData.Math,
        hasEnglishStartDate: !!hasMapData.English,
        mathStartDate: hasMapData.Math || "MISSING",
        englishStartDate: hasMapData.English || "MISSING",
        logsFound: {
          totalLogs: hwkHistory.length,
          mathLogs: mathHwk.length,
          englishLogs: englishHwk.length,
        },
        hwkAssignedField: {
          total: hwkAssigned.length,
          mathCount: mathAssigned.length,
          englishCount: englishAssigned.length,
          mathSample: mathAssigned.slice(0, 3),
          englishSample: englishAssigned.slice(0, 3),
        },
        issues: [],
      };

      // Identify issues
      if (!hasMapData.Math && mathHwk.length > 0) {
        info.issues.push("❌ Math homework found in logs but no Math start date in subjects_startDate_Map");
      }
      if (!hasMapData.English && englishHwk.length > 0) {
        info.issues.push("❌ English homework found in logs but no English start date in subjects_startDate_Map");
      }
      if (mathAssigned.length > 0 && !hasMapData.Math) {
        info.issues.push("❌ Math homework in hwkAssigned but no Math start date");
      }
      if (englishAssigned.length > 0 && !hasMapData.English) {
        info.issues.push("❌ English homework in hwkAssigned but no English start date");
      }

      setDiagnosticInfo(info);
    } catch (error) {
      console.error("Error diagnosing student:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateFix = () => {
    if (!selectedStudent || !diagnosticInfo) return "";

    const fixes: string[] = [];
    
    if (diagnosticInfo.logsFound.mathLogs > 0 && !diagnosticInfo.hasMathStartDate) {
      fixes.push(`Math start date: Set to earliest Math log date or estimated program start`);
    }
    if (diagnosticInfo.logsFound.englishLogs > 0 && !diagnosticInfo.hasEnglishStartDate) {
      fixes.push(`English start date: Set to earliest English log date or estimated program start`);
    }

    return fixes.join("\n");
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Student Subject Diagnostic Tool</h2>
      <p className="text-sm text-gray-600 mb-4">
        Use this tool to identify students with missing subject data
      </p>

      {/* Student Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Student:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          onChange={(e) => {
            const [firstName, lastName] = e.target.value.split("-");
            const student = students.find(
              (s) => s.firstName === firstName && s.lastName === lastName
            );
            if (student) diagnoseStudent(student);
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

      {/* Loading */}
      {loading && (
        <div className="text-center py-4">
          <p>Analyzing student data...</p>
        </div>
      )}

      {/* Diagnostic Results */}
      {!loading && diagnosticInfo && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h3 className="font-semibold text-lg mb-2">
              {diagnosticInfo.studentName}
            </h3>
          </div>

          {/* Issues */}
          {diagnosticInfo.issues.length > 0 && (
            <div className="bg-red-50 p-4 rounded border border-red-200">
              <h4 className="font-semibold mb-2 text-red-700">⚠️ Issues Found:</h4>
              <ul className="list-disc list-inside space-y-1">
                {diagnosticInfo.issues.map((issue: string, i: number) => (
                  <li key={i} className="text-sm text-red-700">{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {diagnosticInfo.issues.length === 0 && (
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <p className="text-green-700">✅ No issues detected!</p>
            </div>
          )}

          {/* Start Dates */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h4 className="font-semibold mb-2">subjects_startDate_Map:</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Math:</span>{" "}
                <span className={diagnosticInfo.hasMathStartDate ? "text-green-600" : "text-red-600"}>
                  {diagnosticInfo.mathStartDate}
                  {!diagnosticInfo.hasMathStartDate && " ❌"}
                </span>
              </p>
              <p>
                <span className="font-medium">English:</span>{" "}
                <span className={diagnosticInfo.hasEnglishStartDate ? "text-green-600" : "text-red-600"}>
                  {diagnosticInfo.englishStartDate}
                  {!diagnosticInfo.hasEnglishStartDate && " ❌"}
                </span>
              </p>
            </div>
          </div>

          {/* Log Data */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h4 className="font-semibold mb-2">Homework Logs Found:</h4>
            <div className="space-y-1 text-sm">
              <p>Total logs: {diagnosticInfo.logsFound.totalLogs}</p>
              <p>Math logs: {diagnosticInfo.logsFound.mathLogs}</p>
              <p>English logs: {diagnosticInfo.logsFound.englishLogs}</p>
            </div>
          </div>

          {/* hwkAssigned Field */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h4 className="font-semibold mb-2">hwkAssigned Field:</h4>
            <div className="space-y-1 text-sm">
              <p>Total assigned: {diagnosticInfo.hwkAssignedField.total}</p>
              <p>Math count: {diagnosticInfo.hwkAssignedField.mathCount}</p>
              <p>English count: {diagnosticInfo.hwkAssignedField.englishCount}</p>
              {diagnosticInfo.hwkAssignedField.mathSample.length > 0 && (
                <p className="text-xs text-gray-600">
                  Math sample: {diagnosticInfo.hwkAssignedField.mathSample.join(", ")}
                </p>
              )}
              {diagnosticInfo.hwkAssignedField.englishSample.length > 0 && (
                <p className="text-xs text-gray-600">
                  English sample: {diagnosticInfo.hwkAssignedField.englishSample.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Suggested Fix */}
          {generateFix() && (
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
              <h4 className="font-semibold mb-2">💡 Suggested Fix:</h4>
              <pre className="text-sm whitespace-pre-wrap">{generateFix()}</pre>
              <p className="text-xs text-gray-600 mt-2">
                To fix: Update the student's subjects_startDate_Map in Firestore to include the missing subject(s) with appropriate start dates.
              </p>
            </div>
          )}

          {/* Raw Data */}
          <details className="bg-gray-50 p-4 rounded border border-gray-200">
            <summary className="font-semibold cursor-pointer">
              🔍 View Raw Data (for debugging)
            </summary>
            <pre className="text-xs mt-2 overflow-auto bg-white p-2 rounded">
              {JSON.stringify(diagnosticInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}