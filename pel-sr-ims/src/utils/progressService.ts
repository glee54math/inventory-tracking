// progressService.ts - Service for tracking and managing student progress

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Student,
  StudentProgress,
  SubjectProgress,
  LevelProgress,
  HomeworkHistoryEntry,
  LogEntry,
} from "./types";
import {
  MATH_LEVELS,
  ENGLISH_LEVELS,
  DEFAULT_MONTHS_PER_LEVEL,
  PAGES_PER_LEVEL,
} from "./types";

/**
 * Parse a homework assignment string to extract level, range, and subject
 * Example: "EG6 41-50" → { level: "EG6", range: "41-50", subject: "English" }
 */
export function parseAssignment(assignment: string): {
  level: string;
  range: string;
  subject: "Math" | "English";
} | null {
  const match = assignment.match(/^([A-Z]+\d+[A-Z]*)\s+(.+)$/);
  if (!match) return null;

  const [, level, range] = match;
  const subject = level.startsWith("M") ? "Math" : "English";

  return { level, range, subject };
}

/**
 * Check if a range represents the start of a new level (i.e., "1-10")
 */
export function isStartOfLevel(range: string): boolean {
  return range === "1-10";
}

/**
 * Get the index of a level in its subject's sequence
 */
export function getLevelIndex(level: string, subject: "Math" | "English"): number {
  const levels = subject === "Math" ? MATH_LEVELS : ENGLISH_LEVELS;
  return levels.indexOf(level);
}

/**
 * Get the next level in the sequence
 */
export function getNextLevel(currentLevel: string, subject: "Math" | "English"): string | null {
  const levels = subject === "Math" ? MATH_LEVELS : ENGLISH_LEVELS;
  const currentIndex = levels.indexOf(currentLevel);
  if (currentIndex === -1 || currentIndex === levels.length - 1) return null;
  return levels[currentIndex + 1];
}

/**
 * Build homework history from student's hwkAssigned field
 * This is the primary method for building homework history
 * hwkAssigned format: ["MG10 71-80", "EG7 31-40", ...]
 */
export function buildHwkHistoryFromAssignments(
  hwkAssigned: string[]
): HomeworkHistoryEntry[] {
  const hwkHistory: HomeworkHistoryEntry[] = [];

  hwkAssigned.forEach((assignment) => {
    const parsed = parseAssignment(assignment);
    if (!parsed) return;

    // We don't have exact dates from hwkAssigned, so we use a placeholder
    // Historical data entry should be used for accurate dates
    hwkHistory.push({
      assignment,
      dateAssigned: new Date(), // Placeholder - use historical data for real dates
      level: parsed.level,
      range: parsed.range,
      subject: parsed.subject,
    });
  });

  return hwkHistory;
}

/**
 * Build level progression history from homework history
 * Detects level changes when a "1-10" assignment is made
 * NOTE: When built from hwkAssigned (no dates), use historical data for accurate tracking
 */
export function buildLevelProgressFromHwkHistory(
  hwkHistory: HomeworkHistoryEntry[],
  subject: "Math" | "English",
  programStartDate: Date
): LevelProgress[] {
  const levelProgress: LevelProgress[] = [];
  const subjectHwk = hwkHistory.filter((h) => h.subject === subject);

  if (subjectHwk.length === 0) return [];

  // Group homework by level
  const levelGroups: Record<string, string[]> = {};

  subjectHwk.forEach((hwk) => {
    if (!levelGroups[hwk.level]) {
      levelGroups[hwk.level] = [];
    }
    levelGroups[hwk.level].push(hwk.range);
  });

  // Get levels in order they appear
  const levels = Array.from(new Set(subjectHwk.map(h => h.level)));

  console.log(`Found levels for ${subject}:`, levels);

  // Determine current level (last one in hwkAssigned)
  if (levels.length === 0) return [];

  const currentLevel = levels[levels.length - 1];

  // Calculate pages completed for current level
  const currentLevelRanges = levelGroups[currentLevel] || [];
  const pagesCompleted = currentLevelRanges.length * 10;

  // For now, just create an entry for the current level
  // Historical data should be used for complete level-by-level tracking
  const estimatedCompletion = new Date(programStartDate);
  estimatedCompletion.setMonth(
    estimatedCompletion.getMonth() + (levels.length * DEFAULT_MONTHS_PER_LEVEL)
  );

  levelProgress.push({
    level: currentLevel,
    startDate: programStartDate,
    estimatedCompletion,
    pagesCompleted,
    isComplete: false,
  });

  return levelProgress;
}

/**
 * Calculate estimated completion dates for remaining levels
 */
export function calculateRemainingLevels(
  currentLevel: string,
  subject: "Math" | "English",
  lastLevelEndDate: Date,
  customPace?: Record<string, number>
): LevelProgress[] {
  const levels = subject === "Math" ? MATH_LEVELS : ENGLISH_LEVELS;
  const currentIndex = levels.indexOf(currentLevel);

  if (currentIndex === -1) return [];

  const remainingLevels: LevelProgress[] = [];
  let estimatedStart = new Date(lastLevelEndDate);

  for (let i = currentIndex + 1; i < levels.length; i++) {
    const level = levels[i];
    const monthsToComplete = customPace?.[level] ?? DEFAULT_MONTHS_PER_LEVEL;

    const estimatedEnd = new Date(estimatedStart);
    estimatedEnd.setMonth(estimatedEnd.getMonth() + monthsToComplete);

    remainingLevels.push({
      level,
      startDate: estimatedStart,
      estimatedCompletion: estimatedEnd,
      customMonthsToComplete: customPace?.[level],
      pagesCompleted: 0,
      isComplete: false,
    });

    estimatedStart = new Date(estimatedEnd);
  }

  return remainingLevels;
}

/**
 * Build complete student progress from logs and student data
 * Prioritizes historical data over log data when available
 */
export async function buildStudentProgress(
  student: Student,
  location: string = "san-ramon"
): Promise<StudentProgress> {
  // Import historical progress service
  const { loadHistoricalProgress } = await import("./historicalProgressService");

  // Try to load existing progress first
  const existingProgress = await loadStudentProgress(student.firstName, student.lastName, location);

  // Load historical progress data
  const historicalData = await loadHistoricalProgress(student.firstName, student.lastName, location);

  console.log(`Historical data for ${student.firstName}:`, historicalData);

  // Build homework history from hwkAssigned field (logs don't contain student names)
  const hwkAssignedArray = student.hwkAssigned || [];
  const hwkHistory = buildHwkHistoryFromAssignments(hwkAssignedArray);

  console.log(`Found ${hwkHistory.length} homework assignments in hwkAssigned for ${student.firstName}`);

  // Determine program start dates (prioritize historical data)
  const mathStartDate = historicalData?.mathProgramStartDate
    ? new Date(historicalData.mathProgramStartDate)
    : student.subjects_startDate_Map?.Math
      ? new Date(student.subjects_startDate_Map.Math)
      : new Date();

  const englishStartDate = historicalData?.englishProgramStartDate
    ? new Date(historicalData.englishProgramStartDate)
    : student.subjects_startDate_Map?.English
      ? new Date(student.subjects_startDate_Map.English)
      : new Date();

  const mathHwk = hwkHistory.filter((h) => h.subject === "Math");
  const englishHwk = hwkHistory.filter((h) => h.subject === "English");

  console.log(`Math homework: ${mathHwk.length}, English homework: ${englishHwk.length}`);

  let mathProgress: SubjectProgress | undefined;
  let englishProgress: SubjectProgress | undefined;

  // Build Math Progress
  const hasHistoricalMathData = historicalData?.mathLevels && historicalData.mathLevels.length > 0;
  const hasMathHwkData = mathHwk.length > 0;

  if (hasHistoricalMathData || hasMathHwkData) {
    let levelHistory: LevelProgress[] = [];
    let currentLevel = "MK1";

    if (hasHistoricalMathData) {
      // Use historical data as the base - these are completed levels with exact dates
      console.log("Using historical Math data");
      levelHistory = historicalData!.mathLevels!.map((entry) => ({
        level: entry.level,
        startDate: new Date(entry.startDate),
        endDate: new Date(entry.endDate),
        estimatedCompletion: new Date(entry.endDate),
        pagesCompleted: PAGES_PER_LEVEL,
        isComplete: true,
      }));

      const historicalLevels = new Set(levelHistory.map(l => l.level));
      console.log(`Historical Math levels:`, Array.from(historicalLevels));

      // Now check hwkAssigned for any NEW levels beyond historical data
      if (hasMathHwkData) {
        console.log("Checking hwkAssigned for levels beyond historical data");

        // Get all unique levels from hwkAssigned
        const hwkLevels = Array.from(new Set(mathHwk.map(h => h.level)));
        console.log(`hwkAssigned Math levels:`, hwkLevels);

        // Find levels in hwkAssigned that are NOT in historical data
        const newLevels = hwkLevels.filter(level => !historicalLevels.has(level));

        if (newLevels.length > 0) {
          console.log(`Found ${newLevels.length} new Math levels in hwkAssigned:`, newLevels);

          // Add the new levels as current work (in progress)
          // Use the end date of last historical level as start for new work
          const lastHistoricalDate = levelHistory[levelHistory.length - 1].endDate || new Date();

          newLevels.forEach((level, index) => {
            const levelHwk = mathHwk.filter(h => h.level === level);
            const pagesCompleted = levelHwk.length * 10;

            // Estimate dates for new levels
            const startDate = index === 0
              ? new Date(lastHistoricalDate.getTime() + (24 * 60 * 60 * 1000)) // Next day after historical
              : new Date(levelHistory[levelHistory.length - 1].estimatedCompletion);

            const estimatedCompletion = new Date(startDate.getTime() + (DEFAULT_MONTHS_PER_LEVEL * 30 * 24 * 60 * 60 * 1000));

            levelHistory.push({
              level,
              startDate,
              estimatedCompletion,
              pagesCompleted,
              isComplete: false, // These are in progress
            });
          });

          currentLevel = newLevels[newLevels.length - 1];
        } else {
          console.log("No new levels found in hwkAssigned, using last historical level as current");
          currentLevel = levelHistory[levelHistory.length - 1]?.level || "MK1";
        }
      } else {
        // No hwkAssigned data, current level is last historical level
        currentLevel = levelHistory[levelHistory.length - 1]?.level || "MK1";
      }

      console.log(`Current Math level after merge: ${currentLevel}`);
    } else if (hasMathHwkData) {
      // No historical data, detect current level from hwkAssigned only
      console.log("Detecting Math level from hwkAssigned (no historical data)");

      // Get unique levels from hwkAssigned
      const mathLevels = Array.from(new Set(mathHwk.map(h => h.level)));
      currentLevel = mathLevels[mathLevels.length - 1] || "MK1";

      console.log(`Current Math level from hwkAssigned: ${currentLevel}`);

      // Create a single entry for the current level
      levelHistory = [{
        level: currentLevel,
        startDate: mathStartDate,
        estimatedCompletion: new Date(mathStartDate.getTime() + (DEFAULT_MONTHS_PER_LEVEL * 30 * 24 * 60 * 60 * 1000)),
        pagesCompleted: mathHwk.length * 10,
        isComplete: false,
      }];
    }

    if (levelHistory.length === 0) {
      console.log("No level history built for Math");
    } else {
      const lastLevelEnd =
        levelHistory[levelHistory.length - 1]?.endDate ||
        levelHistory[levelHistory.length - 1]?.startDate ||
        new Date();

      const remainingLevels = calculateRemainingLevels(
        currentLevel,
        "Math",
        lastLevelEnd,
        existingProgress?.mathProgress?.levelHistory.reduce((acc, lp) => {
          if (lp.customMonthsToComplete) {
            acc[lp.level] = lp.customMonthsToComplete;
          }
          return acc;
        }, {} as Record<string, number>)
      );

      const allLevels = [...levelHistory, ...remainingLevels];
      const finalLevel = allLevels[allLevels.length - 1];

      // Find MM1 and MH1 dates, but don't set to undefined if not found
      const mm1Level = allLevels.find((l) => l.level === "MM1");
      const mh1Level = allLevels.find((l) => l.level === "MH1");

      mathProgress = {
        subject: "Math",
        levelHistory: allLevels,
        programStartDate: mathStartDate,
        currentLevel,
        ...(mm1Level && { estimatedMM1Date: mm1Level.estimatedCompletion }),
        ...(mh1Level && { estimatedMH1Date: mh1Level.estimatedCompletion }),
        estimatedCompletionDate: finalLevel?.estimatedCompletion || new Date(),
      };
    }
  }

  // Build English Progress
  const hasHistoricalEnglishData = historicalData?.englishLevels && historicalData.englishLevels.length > 0;
  const hasEnglishHwkData = englishHwk.length > 0;

  if (hasHistoricalEnglishData || hasEnglishHwkData) {
    let levelHistory: LevelProgress[] = [];
    let currentLevel = "EK1";

    if (hasHistoricalEnglishData) {
      // Use historical data as the base - these are completed levels with exact dates
      console.log("Using historical English data");
      levelHistory = historicalData!.englishLevels!.map((entry) => ({
        level: entry.level,
        startDate: new Date(entry.startDate),
        endDate: new Date(entry.endDate),
        estimatedCompletion: new Date(entry.endDate),
        pagesCompleted: PAGES_PER_LEVEL,
        isComplete: true,
      }));

      const historicalLevels = new Set(levelHistory.map(l => l.level));
      console.log(`Historical English levels:`, Array.from(historicalLevels));

      // Now check hwkAssigned for any NEW levels beyond historical data
      if (hasEnglishHwkData) {
        console.log("Checking hwkAssigned for levels beyond historical data");

        // Get all unique levels from hwkAssigned
        const hwkLevels = Array.from(new Set(englishHwk.map(h => h.level)));
        console.log(`hwkAssigned English levels:`, hwkLevels);

        // Find levels in hwkAssigned that are NOT in historical data
        const newLevels = hwkLevels.filter(level => !historicalLevels.has(level));

        if (newLevels.length > 0) {
          console.log(`Found ${newLevels.length} new English levels in hwkAssigned:`, newLevels);

          // Add the new levels as current work (in progress)
          // Use the end date of last historical level as start for new work
          const lastHistoricalDate = levelHistory[levelHistory.length - 1].endDate || new Date();

          newLevels.forEach((level, index) => {
            const levelHwk = englishHwk.filter(h => h.level === level);
            const pagesCompleted = levelHwk.length * 10;

            // Estimate dates for new levels
            const startDate = index === 0
              ? new Date(lastHistoricalDate.getTime() + (24 * 60 * 60 * 1000)) // Next day after historical
              : new Date(levelHistory[levelHistory.length - 1].estimatedCompletion);

            const estimatedCompletion = new Date(startDate.getTime() + (DEFAULT_MONTHS_PER_LEVEL * 30 * 24 * 60 * 60 * 1000));

            levelHistory.push({
              level,
              startDate,
              estimatedCompletion,
              pagesCompleted,
              isComplete: false, // These are in progress
            });
          });

          currentLevel = newLevels[newLevels.length - 1];
        } else {
          console.log("No new levels found in hwkAssigned, using last historical level as current");
          currentLevel = levelHistory[levelHistory.length - 1]?.level || "EK1";
        }
      } else {
        // No hwkAssigned data, current level is last historical level
        currentLevel = levelHistory[levelHistory.length - 1]?.level || "EK1";
      }

      console.log(`Current English level after merge: ${currentLevel}`);
    } else if (hasEnglishHwkData) {
      // No historical data, detect current level from hwkAssigned only
      console.log("Detecting English level from hwkAssigned (no historical data)");

      // Get unique levels from hwkAssigned
      const englishLevels = Array.from(new Set(englishHwk.map(h => h.level)));
      currentLevel = englishLevels[englishLevels.length - 1] || "EK1";

      console.log(`Current English level from hwkAssigned: ${currentLevel}`);

      // Create a single entry for the current level
      levelHistory = [{
        level: currentLevel,
        startDate: englishStartDate,
        estimatedCompletion: new Date(englishStartDate.getTime() + (DEFAULT_MONTHS_PER_LEVEL * 30 * 24 * 60 * 60 * 1000)),
        pagesCompleted: englishHwk.length * 10,
        isComplete: false,
      }];
    }

    if (levelHistory.length === 0) {
      console.log("No level history built for English");
    } else {
      const currentLevel = levelHistory[levelHistory.length - 1]?.level || "EK1";
      const lastLevelEnd =
        levelHistory[levelHistory.length - 1]?.endDate ||
        levelHistory[levelHistory.length - 1]?.startDate ||
        new Date();

      const remainingLevels = calculateRemainingLevels(
        currentLevel,
        "English",
        lastLevelEnd,
        existingProgress?.englishProgress?.levelHistory.reduce((acc, lp) => {
          if (lp.customMonthsToComplete) {
            acc[lp.level] = lp.customMonthsToComplete;
          }
          return acc;
        }, {} as Record<string, number>)
      );

      const allLevels = [...levelHistory, ...remainingLevels];
      const finalLevel = allLevels[allLevels.length - 1];

      englishProgress = {
        subject: "English",
        levelHistory: allLevels,
        programStartDate: englishStartDate,
        currentLevel,
        estimatedCompletionDate: finalLevel?.estimatedCompletion || new Date(),
      };
    }
  }

  return {
    studentId: `${student.firstName}-${student.lastName}`,
    firstName: student.firstName,
    lastName: student.lastName,
    ...(mathProgress && { mathProgress }),
    ...(englishProgress && { englishProgress }),
    lastUpdated: new Date(),
  };
}

/**
 * Save student progress to Firestore
 */
export async function saveStudentProgress(
  progress: StudentProgress,
  location: string = "san-ramon"
): Promise<void> {
  const progressRef = doc(
    db,
    "students",
    location,
    "progress",
    progress.studentId
  );

  // Remove undefined values recursively to avoid Firestore errors
  const cleanObject = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return null;
    }

    if (obj instanceof Date) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(cleanObject);
    }

    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const key in obj) {
        const value = obj[key];
        // Only include non-undefined values
        if (value !== undefined) {
          cleaned[key] = cleanObject(value);
        }
      }
      return cleaned;
    }

    return obj;
  };

  const cleanedProgress = cleanObject(progress);

  await setDoc(progressRef, {
    ...cleanedProgress,
    lastUpdated: new Date(),
  });

  console.log(`✅ Saved progress for ${progress.firstName} ${progress.lastName}`);
}

/**
 * Load student progress from Firestore
 */
export async function loadStudentProgress(
  firstName: string,
  lastName: string,
  location: string = "san-ramon"
): Promise<StudentProgress | null> {
  const studentId = `${firstName}-${lastName}`;
  const progressRef = doc(db, "students", location, "progress", studentId);
  const progressSnap = await getDoc(progressRef);

  if (!progressSnap.exists()) {
    return null;
  }

  const data = progressSnap.data();

  // Convert Firestore Timestamps to Dates
  const convertTimestamps = (obj: any): any => {
    if (!obj) return obj;
    if (obj.toDate && typeof obj.toDate === 'function') {
      return obj.toDate();
    }
    if (Array.isArray(obj)) {
      return obj.map(convertTimestamps);
    }
    if (typeof obj === 'object') {
      const converted: any = {};
      for (const key in obj) {
        converted[key] = convertTimestamps(obj[key]);
      }
      return converted;
    }
    return obj;
  };

  return convertTimestamps(data) as StudentProgress;
}

/**
 * Load all student progress from Firestore
 */
export async function loadAllStudentProgress(
  location: string = "san-ramon"
): Promise<StudentProgress[]> {
  const progressRef = collection(db, "students", location, "progress");
  const snapshot = await getDocs(progressRef);

  const allProgress: StudentProgress[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data() as StudentProgress;
    allProgress.push(data);
  });

  return allProgress;
}

/**
 * Update custom pace for specific levels
 */
export async function updateCustomPace(
  studentId: string,
  subject: "Math" | "English",
  levelPaceMap: Record<string, number>,
  location: string = "san-ramon"
): Promise<void> {
  const progress = await loadStudentProgress(
    studentId.split("-")[0],
    studentId.split("-")[1],
    location
  );

  if (!progress) {
    console.error("Progress not found for student:", studentId);
    return;
  }

  const subjectProgress =
    subject === "Math" ? progress.mathProgress : progress.englishProgress;

  if (!subjectProgress) {
    console.error(`No ${subject} progress found for student:`, studentId);
    return;
  }

  // Update custom pace for specified levels
  subjectProgress.levelHistory = subjectProgress.levelHistory.map((lp) => {
    if (levelPaceMap[lp.level] !== undefined) {
      return {
        ...lp,
        customMonthsToComplete: levelPaceMap[lp.level],
      };
    }
    return lp;
  });

  // Recalculate estimated completion dates starting from last completed level
  // Find the last completed level (compatible with older TypeScript)
  let currentDate: Date;
  let lastCompletedIndex = -1;
  
  for (let i = subjectProgress.levelHistory.length - 1; i >= 0; i--) {
    if (subjectProgress.levelHistory[i].isComplete) {
      lastCompletedIndex = i;
      break;
    }
  }

  if (lastCompletedIndex >= 0) {
    // Start from the last completed level's end date
    const lastCompleted = subjectProgress.levelHistory[lastCompletedIndex];
    currentDate = lastCompleted.endDate || lastCompleted.estimatedCompletion;
  } else {
    // No completed levels, start from program start date
    currentDate = subjectProgress.programStartDate;
  }

  // Update incomplete levels starting from the one after last completed
  for (let i = lastCompletedIndex + 1; i < subjectProgress.levelHistory.length; i++) {
    const lp = subjectProgress.levelHistory[i];

    // Always update startDate for future levels to cascade changes
    lp.startDate = currentDate;

    const monthsToComplete = lp.customMonthsToComplete ?? DEFAULT_MONTHS_PER_LEVEL;
    const estimatedEnd = new Date(lp.startDate);
    estimatedEnd.setMonth(estimatedEnd.getMonth() + monthsToComplete);
    lp.estimatedCompletion = estimatedEnd;

    // Next level starts when this one ends
    currentDate = estimatedEnd;
  }

  // Update final completion date
  const lastLevel = subjectProgress.levelHistory[subjectProgress.levelHistory.length - 1];
  subjectProgress.estimatedCompletionDate = lastLevel?.estimatedCompletion || new Date();

  // Update MM1 and MH1 dates for Math
  if (subject === "Math") {
    subjectProgress.estimatedMM1Date = subjectProgress.levelHistory.find(
      (l) => l.level === "MM1"
    )?.estimatedCompletion;
    subjectProgress.estimatedMH1Date = subjectProgress.levelHistory.find(
      (l) => l.level === "MH1"
    )?.estimatedCompletion;
  }

  // Save updated progress
  await saveStudentProgress(progress, location);
}