// HistoricalDataForm.tsx - Form for entering historical level completion data

import { useState, useEffect } from "react";
import type { Student } from "../../utils/types";
import { MATH_LEVELS, ENGLISH_LEVELS } from "../../utils/types";
import {
  saveHistoricalProgress,
  loadHistoricalProgress,
  type HistoricalLevelEntry,
  type HistoricalProgressData,
} from "../../utils/historicalProgressService";

interface HistoricalDataFormProps {
  student: Student;
  currentMathLevel?: string;
  currentEnglishLevel?: string;
  onSave: () => void;
}

export default function HistoricalDataForm({
  student,
  currentMathLevel,
  currentEnglishLevel,
  onSave,
}: HistoricalDataFormProps) {
  const [mathStartDate, setMathStartDate] = useState<string>("");
  const [englishStartDate, setEnglishStartDate] = useState<string>("");
  const [mathLevels, setMathLevels] = useState<HistoricalLevelEntry[]>([]);
  const [englishLevels, setEnglishLevels] = useState<HistoricalLevelEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showMathSection, setShowMathSection] = useState(true);
  const [showEnglishSection, setShowEnglishSection] = useState(true);

  // Get available levels (only those before current level)
  const getAvailableMathLevels = () => {
    if (!currentMathLevel) return [];
    const currentIndex = MATH_LEVELS.indexOf(currentMathLevel);
    if (currentIndex === -1) return [];
    return MATH_LEVELS.slice(0, currentIndex);
  };

  const getAvailableEnglishLevels = () => {
    if (!currentEnglishLevel) return [];
    const currentIndex = ENGLISH_LEVELS.indexOf(currentEnglishLevel);
    if (currentIndex === -1) return [];
    return ENGLISH_LEVELS.slice(0, currentIndex);
  };

  // Load existing historical data
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const existingData = await loadHistoricalProgress(
          student.firstName,
          student.lastName
        );

        if (existingData) {
          setMathStartDate(existingData.mathProgramStartDate || "");
          setEnglishStartDate(existingData.englishProgramStartDate || "");
          setMathLevels(existingData.mathLevels || []);
          setEnglishLevels(existingData.englishLevels || []);
        }
      } catch (err) {
        console.error("Error loading historical data:", err);
      }
    };

    loadExistingData();
  }, [student]);

  const addMathLevel = () => {
    const availableLevels = getAvailableMathLevels();
    const usedLevels = mathLevels.map((l) => l.level);
    
    // Find the next sequential level after the last added level
    let nextLevel: string | undefined;
    
    if (mathLevels.length > 0) {
      const lastAddedLevel = mathLevels[mathLevels.length - 1].level;
      const lastIndex = availableLevels.indexOf(lastAddedLevel);
      
      // Get the next level in sequence after the last added one
      if (lastIndex !== -1 && lastIndex + 1 < availableLevels.length) {
        nextLevel = availableLevels[lastIndex + 1];
      } else {
        // Fallback to first unused level
        nextLevel = availableLevels.find((l) => !usedLevels.includes(l));
      }
    } else {
      // No levels added yet, start with first available
      nextLevel = availableLevels[0];
    }

    if (!nextLevel) {
      setError("No more Math levels available to add");
      return;
    }

    // Auto-populate start date from previous level's end date + 1 day
    const lastLevel = mathLevels[mathLevels.length - 1];
    let startDate = "";
    
    if (lastLevel?.endDate) {
      const endDate = new Date(lastLevel.endDate);
      endDate.setDate(endDate.getDate() + 1); // Add one day
      startDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } else if (mathStartDate) {
      startDate = mathStartDate;
    }

    setMathLevels([
      ...mathLevels,
      {
        level: nextLevel,
        startDate,
        endDate: "",
      },
    ]);
  };

  const addEnglishLevel = () => {
    const availableLevels = getAvailableEnglishLevels();
    const usedLevels = englishLevels.map((l) => l.level);
    
    // Find the next sequential level after the last added level
    let nextLevel: string | undefined;
    
    if (englishLevels.length > 0) {
      const lastAddedLevel = englishLevels[englishLevels.length - 1].level;
      const lastIndex = availableLevels.indexOf(lastAddedLevel);
      
      // Get the next level in sequence after the last added one
      if (lastIndex !== -1 && lastIndex + 1 < availableLevels.length) {
        nextLevel = availableLevels[lastIndex + 1];
      } else {
        // Fallback to first unused level
        nextLevel = availableLevels.find((l) => !usedLevels.includes(l));
      }
    } else {
      // No levels added yet, start with first available
      nextLevel = availableLevels[0];
    }

    if (!nextLevel) {
      setError("No more English levels available to add");
      return;
    }

    // Auto-populate start date from previous level's end date + 1 day
    const lastLevel = englishLevels[englishLevels.length - 1];
    let startDate = "";
    
    if (lastLevel?.endDate) {
      const endDate = new Date(lastLevel.endDate);
      endDate.setDate(endDate.getDate() + 1); // Add one day
      startDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } else if (englishStartDate) {
      startDate = englishStartDate;
    }

    setEnglishLevels([
      ...englishLevels,
      {
        level: nextLevel,
        startDate,
        endDate: "",
      },
    ]);
  };

  const updateMathLevel = (
    index: number,
    field: "level" | "startDate" | "endDate",
    value: string
  ) => {
    const updated = [...mathLevels];
    updated[index][field] = value;

    // If end date changed, auto-populate next level's start date (with +1 day)
    if (field === "endDate" && value && updated[index + 1]) {
      const endDate = new Date(value);
      endDate.setDate(endDate.getDate() + 1); // Add one day
      updated[index + 1].startDate = endDate.toISOString().split('T')[0];
    }

    setMathLevels(updated);
  };

  const updateEnglishLevel = (
    index: number,
    field: "level" | "startDate" | "endDate",
    value: string
  ) => {
    const updated = [...englishLevels];
    updated[index][field] = value;

    // If end date changed, auto-populate next level's start date (with +1 day)
    if (field === "endDate" && value && updated[index + 1]) {
      const endDate = new Date(value);
      endDate.setDate(endDate.getDate() + 1); // Add one day
      updated[index + 1].startDate = endDate.toISOString().split('T')[0];
    }

    setEnglishLevels(updated);
  };

  const removeMathLevel = (index: number) => {
    setMathLevels(mathLevels.filter((_, i) => i !== index));
  };

  const removeEnglishLevel = (index: number) => {
    setEnglishLevels(englishLevels.filter((_, i) => i !== index));
  };

  const validateData = (): boolean => {
    setError(null);

    // Check that all levels have both start and end dates
    for (const level of mathLevels) {
      if (!level.startDate || !level.endDate) {
        setError(`Math level ${level.level} is missing start or end date`);
        return false;
      }
    }

    for (const level of englishLevels) {
      if (!level.startDate || !level.endDate) {
        setError(`English level ${level.level} is missing start or end date`);
        return false;
      }
    }

    // Check that program start dates are set if levels are entered
    if (mathLevels.length > 0 && !mathStartDate) {
      setError("Math program start date is required when adding Math levels");
      return false;
    }

    if (englishLevels.length > 0 && !englishStartDate) {
      setError("English program start date is required when adding English levels");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateData()) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const historicalData: HistoricalProgressData = {
        studentId: `${student.firstName}-${student.lastName}`,
        firstName: student.firstName,
        lastName: student.lastName,
        mathProgramStartDate: mathStartDate || undefined,
        englishProgramStartDate: englishStartDate || undefined,
        mathLevels: mathLevels.length > 0 ? mathLevels : undefined,
        englishLevels: englishLevels.length > 0 ? englishLevels : undefined,
        lastUpdated: new Date(),
      };

      await saveHistoricalProgress(historicalData);
      setSuccessMessage("Historical data saved successfully!");
      
      // Call parent callback to refresh progress
      setTimeout(() => {
        onSave();
      }, 1000);
    } catch (err) {
      console.error("Error saving historical data:", err);
      setError(`Failed to save: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 p-6 rounded shadow border border-yellow-300">
      <h3 className="text-lg font-semibold mb-4">
        Add Historical Level Data (Pre-April 2025)
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Enter level completion dates for {student.firstName} {student.lastName}.
        This data will be used instead of log data for progress tracking.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Math Section */}
      {currentMathLevel && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-semibold text-blue-600">Math Progress</h4>
            <button
              onClick={() => setShowMathSection(!showMathSection)}
              className="px-3 py-1 !bg-gray-200 rounded hover:!bg-gray-300 text-sm"
            >
              {showMathSection ? "Hide ▲" : "Show ▼"}
            </button>
          </div>
          
          {showMathSection && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Math Program Start Date:
                </label>
                <input
                  type="date"
                  value={mathStartDate}
                  onChange={(e) => setMathStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  Current Level: <span className="font-semibold">{currentMathLevel}</span>
                  {" "}(can only add historical data for levels before this)
                </p>
              </div>

              {mathLevels.length > 0 && (
                <table className="w-full mb-3 border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-2 py-2 text-left">Level</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">Start Date</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">End Date</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mathLevels.map((level, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-2 py-2">
                          <select
                            value={level.level}
                            onChange={(e) => updateMathLevel(index, "level", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          >
                            {getAvailableMathLevels().map((lvl) => (
                              <option key={lvl} value={lvl}>
                                {lvl}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="date"
                            value={level.startDate}
                            onChange={(e) => updateMathLevel(index, "startDate", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="date"
                            value={level.endDate}
                            onChange={(e) => updateMathLevel(index, "endDate", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <button
                            onClick={() => removeMathLevel(index)}
                            className="px-2 py-1 !bg-red-500 text-white rounded hover:!bg-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <button
                onClick={addMathLevel}
                disabled={getAvailableMathLevels().length === mathLevels.length}
                className="px-3 py-2 !bg-blue-500 text-white rounded hover:!bg-blue-600 disabled:!bg-gray-400 disabled:cursor-not-allowed"
              >
                + Add Math Level
              </button>
            </>
          )}
        </div>
      )}

      {/* English Section */}
      {currentEnglishLevel && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-semibold text-green-600">English Progress</h4>
            <button
              onClick={() => setShowEnglishSection(!showEnglishSection)}
              className="px-3 py-1 !bg-gray-200 rounded hover:!bg-gray-300 text-sm"
            >
              {showEnglishSection ? "Hide ▲" : "Show ▼"}
            </button>
          </div>
          
          {showEnglishSection && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  English Program Start Date:
                </label>
                <input
                  type="date"
                  value={englishStartDate}
                  onChange={(e) => setEnglishStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  Current Level: <span className="font-semibold">{currentEnglishLevel}</span>
                  {" "}(can only add historical data for levels before this)
                </p>
              </div>

              {englishLevels.length > 0 && (
                <table className="w-full mb-3 border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-2 py-2 text-left">Level</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">Start Date</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">End Date</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {englishLevels.map((level, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-2 py-2">
                          <select
                            value={level.level}
                            onChange={(e) => updateEnglishLevel(index, "level", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          >
                            {getAvailableEnglishLevels().map((lvl) => (
                              <option key={lvl} value={lvl}>
                                {lvl}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="date"
                            value={level.startDate}
                            onChange={(e) => updateEnglishLevel(index, "startDate", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="date"
                            value={level.endDate}
                            onChange={(e) => updateEnglishLevel(index, "endDate", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <button
                            onClick={() => removeEnglishLevel(index)}
                            className="px-2 py-1 !bg-red-500 text-white rounded hover:!bg-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <button
                onClick={addEnglishLevel}
                disabled={getAvailableEnglishLevels().length === englishLevels.length}
                className="px-3 py-2 !bg-green-500 text-white rounded hover:!bg-green-600 disabled:!bg-gray-400 disabled:cursor-not-allowed"
              >
                + Add English Level
              </button>
            </>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 !bg-blue-600 text-white rounded hover:!bg-blue-700 disabled:!bg-gray-400"
        >
          {loading ? "Saving..." : "Save Historical Data"}
        </button>
      </div>
    </div>
  );
}