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
 * Parse logs to build homework history for a student
 * Only looks at FrontToStudent and BackToStudent movements
 */
export async function buildHwkHistoryFromLogs(
  studentFirstName: string
): Promise<HomeworkHistoryEntry[]> {
  const logsRef = collection(db, "logs");
  const q = query(logsRef, orderBy("timeStamp", "asc"));
  const snapshot = await getDocs(q);

  const hwkHistory: HomeworkHistoryEntry[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const message = data.message as string;
    const timeStamp = data.timeStamp.toDate();

    // Check if this log entry is relevant (FrontToStudent or BackToStudent)
    if (
      !message.includes("FrontToStudent") &&
      !message.includes("BackToStudent")
    ) {
      return;
    }

    // Check if this is for the target student
    if (!message.includes(`for ${studentFirstName}`)) {
      return;
    }

    // Parse the assignment from message
    // Format: "X copies of LEVEL RANGE from [Front/Back]ToStudent for STUDENT"
    const assignmentMatch = message.match(/of ([A-Z]+\d+[A-Z]*\s+[\d\-]+)/);
    if (!assignmentMatch) return;

    const assignment = assignmentMatch[1];
    const parsed = parseAssignment(assignment);
    if (!parsed) return;

    hwkHistory.push({
      assignment,
      dateAssigned: timeStamp,
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
 */
export function buildLevelProgressFromHwkHistory(
  hwkHistory: HomeworkHistoryEntry[],
  subject: "Math" | "English",
  programStartDate: Date
): LevelProgress[] {
  const levelProgress: LevelProgress[] = [];
  const subjectHwk = hwkHistory.filter((h) => h.subject === subject);

  if (subjectHwk.length === 0) return [];

  let currentLevel: string | null = null;
  let currentLevelStart: Date | null = null;
  let pagesCompleted = 0;

  for (const hwk of subjectHwk) {
    // Detect level change
    if (isStartOfLevel(hwk.range)) {
      // Close out previous level if exists
      if (currentLevel && currentLevelStart) {
        levelProgress.push({
          level: currentLevel,
          startDate: currentLevelStart,
          endDate: hwk.dateAssigned,
          estimatedCompletion: hwk.dateAssigned,
          pagesCompleted: PAGES_PER_LEVEL,
          isComplete: true,
        });
      }

      // Start new level
      currentLevel = hwk.level;
      currentLevelStart = hwk.dateAssigned;
      pagesCompleted = 10; // First 10 pages
    } else if (currentLevel === hwk.level) {
      // Continue in same level
      pagesCompleted += 10;
    }
  }

  // Add current incomplete level
  if (currentLevel && currentLevelStart) {
    const estimatedCompletion = new Date(currentLevelStart);
    estimatedCompletion.setMonth(
      estimatedCompletion.getMonth() + DEFAULT_MONTHS_PER_LEVEL
    );

    levelProgress.push({
      level: currentLevel,
      startDate: currentLevelStart,
      estimatedCompletion,
      pagesCompleted,
      isComplete: false,
    });
  }

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

  // Build homework history from logs (as fallback)
  const hwkHistory = await buildHwkHistoryFromLogs(student.firstName);

  console.log(`Found ${hwkHistory.length} homework assignments for ${student.firstName}`);

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
      // Use historical data - convert to LevelProgress format
      console.log("Using historical Math data");
      levelHistory = historicalData!.mathLevels!.map((entry) => ({
        level: entry.level,
        startDate: new Date(entry.startDate),
        endDate: new Date(entry.endDate),
        estimatedCompletion: new Date(entry.endDate),
        pagesCompleted: PAGES_PER_LEVEL,
        isComplete: true,
      }));

      // If there's also log data, use it to determine CURRENT level
      if (hasMathHwkData) {
        console.log("Also checking log data for current Math level");
        const logLevelHistory = buildLevelProgressFromHwkHistory(
          hwkHistory,
          "Math",
          mathStartDate
        );
        
        if (logLevelHistory.length > 0) {
          // Current level is the last one from logs
          const currentFromLogs = logLevelHistory[logLevelHistory.length - 1];
          currentLevel = currentFromLogs.level;
          
          // Only add the current level from logs (not historical ones)
          const historicalLevels = levelHistory.map(l => l.level);
          if (!historicalLevels.includes(currentLevel)) {
            levelHistory.push(currentFromLogs);
          }
        } else {
          // No current level from logs, so current is last historical
          currentLevel = levelHistory[levelHistory.length - 1]?.level || "MK1";
        }
      } else {
        // No log data, so current level is last historical level
        currentLevel = levelHistory[levelHistory.length - 1]?.level || "MK1";
      }
    } else {
      // Fallback to log data only
      console.log("Using log data for Math");
      levelHistory = buildLevelProgressFromHwkHistory(
        hwkHistory,
        "Math",
        mathStartDate
      );
      currentLevel = levelHistory[levelHistory.length - 1]?.level || "MK1";
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
      // Use historical data - convert to LevelProgress format
      console.log("Using historical English data");
      levelHistory = historicalData!.englishLevels!.map((entry) => ({
        level: entry.level,
        startDate: new Date(entry.startDate),
        endDate: new Date(entry.endDate),
        estimatedCompletion: new Date(entry.endDate),
        pagesCompleted: PAGES_PER_LEVEL,
        isComplete: true,
      }));

      // If there's also log data, use it to determine CURRENT level
      if (hasEnglishHwkData) {
        console.log("Also checking log data for current English level");
        const logLevelHistory = buildLevelProgressFromHwkHistory(
          hwkHistory,
          "English",
          englishStartDate
        );
        
        if (logLevelHistory.length > 0) {
          // Current level is the last one from logs
          const currentFromLogs = logLevelHistory[logLevelHistory.length - 1];
          currentLevel = currentFromLogs.level;
          
          // Only add the current level from logs (not historical ones)
          const historicalLevels = levelHistory.map(l => l.level);
          if (!historicalLevels.includes(currentLevel)) {
            levelHistory.push(currentFromLogs);
          }
        } else {
          // No current level from logs, so current is last historical
          currentLevel = levelHistory[levelHistory.length - 1]?.level || "EK1";
        }
      } else {
        // No log data, so current level is last historical level
        currentLevel = levelHistory[levelHistory.length - 1]?.level || "EK1";
      }
    } else {
      // Fallback to log data only
      console.log("Using log data for English");
      levelHistory = buildLevelProgressFromHwkHistory(
        hwkHistory,
        "English",
        englishStartDate
      );
      currentLevel = levelHistory[levelHistory.length - 1]?.level || "EK1";
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

  // Recalculate estimated completion dates
  let currentDate = new Date();
  for (const lp of subjectProgress.levelHistory) {
    if (lp.isComplete) {
      currentDate = lp.endDate || lp.estimatedCompletion;
    } else {
      lp.startDate = currentDate;
      const monthsToComplete = lp.customMonthsToComplete ?? DEFAULT_MONTHS_PER_LEVEL;
      const estimatedEnd = new Date(currentDate);
      estimatedEnd.setMonth(estimatedEnd.getMonth() + monthsToComplete);
      lp.estimatedCompletion = estimatedEnd;
      currentDate = estimatedEnd;
    }
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