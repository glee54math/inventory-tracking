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
import type { HistoricalLevelEntry } from "./historicalProgressService";
import type {
  Student,
  StudentProgress,
  SubjectProgress,
  LevelProgress,
  HomeworkHistoryEntry,
  HomeworkAssignment,
  LogEntry,
} from "./types";
import {
  MATH_LEVELS,
  ENGLISH_LEVELS,
  DEFAULT_MONTHS_PER_LEVEL,
  PAGES_PER_LEVEL,
} from "./types";

/**
 * Helper function to safely convert any date-like value to a JavaScript Date object
 * Handles: Date objects, Firestore Timestamps, ISO strings, timestamp numbers
 */
export function toDate(value: any): Date {
  // Already a Date
  if (value instanceof Date) {
    return value;
  }
  
  // Firestore Timestamp (has toDate() method or seconds property)
  if (value && typeof value === 'object') {
    // Firestore Timestamp has toDate() method
    if (typeof value.toDate === 'function') {
      return value.toDate();
    }
    // Or has seconds property (Timestamp structure)
    if (value.seconds !== undefined) {
      return new Date(value.seconds * 1000);
    }
  }
  
  // ISO string or timestamp number
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Fallback to current date
  console.warn('toDate: Could not convert value to Date, using current date:', value);
  return new Date();
}

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
  hwkAssigned: (string | HomeworkAssignment)[]
): HomeworkHistoryEntry[] {
  const hwkHistory: HomeworkHistoryEntry[] = [];

  
  hwkAssigned.forEach((hwkAssignment) => {

    let parsed;
    let assignmentObj : HomeworkAssignment;
    if (typeof(hwkAssignment) === 'string') {
      assignmentObj = {
        assignment: hwkAssignment,
        dateAssigned: new Date(), // We hope this is not the case AFTER running the script and changing the Actions!
      }
      parsed = parseAssignment(hwkAssignment);
    } else {
      // Convert Firestore Timestamp to Date at the boundary
      assignmentObj = {
        assignment: hwkAssignment.assignment,
        dateAssigned: toDate(hwkAssignment.dateAssigned),
      };
      parsed = parseAssignment(hwkAssignment.assignment);
    }
  
    if (!parsed) return;
// typeof(assignment === 'object' && parseAssignment(assignment.assignment)
    
    // We don't have exact dates from hwkAssigned, so we use a placeholder
    // Historical data entry should be used for accurate dates
    hwkHistory.push({
      assignment: assignmentObj.assignment,
      dateAssigned: assignmentObj.dateAssigned, // This now pulls the date Assigned from hwkAssigned if there
      ...(typeof hwkAssignment === 'string' && { isLegacy: true }),
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

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_LEVEL_MS = DEFAULT_MONTHS_PER_LEVEL * 30 * DAY_MS;

/**
 * When the in-progress level should finish: start + pace normally. If that date has
 * already passed (the student is taking longer than the pace), project from today
 * instead, using the share of the level's packets still left — at least one packet's
 * worth — so the rest of the timeline doesn't assume levels they haven't reached yet.
 */
function estimateCurrentLevelEnd(startDate: Date, pagesCompleted: number, customMonths?: number): Date {
  const paceMs = (customMonths ?? DEFAULT_MONTHS_PER_LEVEL) * 30 * DAY_MS;
  const onPace = startDate.getTime() + paceMs;
  const now = Date.now();
  if (onPace > now) return new Date(onPace);

  const packetsPerLevel = PAGES_PER_LEVEL / 10;
  const packetsLeft = Math.max(1, packetsPerLevel - pagesCompleted / 10);
  return new Date(now + (paceMs * packetsLeft) / packetsPerLevel);
}

/**
 * Build one subject's level timeline: historical entries (complete, exact dates) first,
 * then any levels from hwkAssigned beyond them.
 *
 * Levels are ordered by curriculum position, not by hwkAssigned order, and the current
 * level is the highest one assigned — so a review packet from an earlier level can't
 * become "current" or make the timeline dip. Legacy string-only entries have no real
 * date, so they only tell us a level was reached; those levels' start dates are spread
 * evenly between the nearest levels that do have real dates.
 */
function buildSubjectProgress(
  subject: "Math" | "English",
  subjectHwk: HomeworkHistoryEntry[],
  historicalLevels: HistoricalLevelEntry[],
  programStartDate: Date,
  existingProgress: SubjectProgress | undefined
): SubjectProgress | undefined {
  const levels = subject === "Math" ? MATH_LEVELS : ENGLISH_LEVELS;
  const byLevelOrder = (a: string, b: string) => levels.indexOf(a) - levels.indexOf(b);

  const levelHistory: LevelProgress[] = historicalLevels
    .map((entry) => ({
      level: entry.level,
      startDate: toDate(entry.startDate),
      endDate: toDate(entry.endDate),
      estimatedCompletion: toDate(entry.endDate),
      pagesCompleted: PAGES_PER_LEVEL,
      isComplete: true,
    }))
    .sort((a, b) => byLevelOrder(a.level, b.level));

  const lastHistorical = levelHistory[levelHistory.length - 1];
  const lastHistoricalIndex = lastHistorical ? levels.indexOf(lastHistorical.level) : -1;

  // Levels past the historical data, in curriculum order. Anything at or below the last
  // historical level is review work and doesn't move the timeline.
  const newLevels = Array.from(new Set(subjectHwk.map((h) => h.level)))
    .filter((level) => levels.indexOf(level) > lastHistoricalIndex)
    .sort(byLevelOrder);

  // Earliest real assignment date per level (legacy entries don't count)
  const firstDated: Record<string, Date> = {};
  subjectHwk.forEach((h) => {
    if (h.isLegacy) return;
    const date = toDate(h.dateAssigned);
    if (!firstDated[h.level] || date < firstDated[h.level]) firstDated[h.level] = date;
  });

  const starts: (Date | undefined)[] = newLevels.map((level) => firstDated[level]);
  if (newLevels.length > 0) {
    if (lastHistorical) {
      // First new level picks up the day after the last historical level ended
      const lastEnd = lastHistorical.endDate ?? lastHistorical.estimatedCompletion;
      starts[0] = new Date(lastEnd.getTime() + DAY_MS);
    } else if (!starts[0] || programStartDate < starts[0]) {
      starts[0] = programStartDate;
    }
  }

  // A real date that's later than a higher level's start is a later review packet, not
  // when the level began — drop it. Walk backwards so higher levels win.
  let nextKept = Infinity;
  for (let i = starts.length - 1; i >= 1; i--) {
    const start = starts[i];
    if (!start) continue;
    if (start.getTime() <= nextKept && start >= starts[0]!) {
      nextKept = start.getTime();
    } else {
      starts[i] = undefined;
    }
  }

  // Fill the gaps evenly between known dates
  for (let i = 1; i < starts.length; i++) {
    if (starts[i]) continue;
    const prev = starts[i - 1]!.getTime();
    let next = i + 1;
    while (next < starts.length && !starts[next]) next++;
    if (next < starts.length) {
      starts[i] = new Date(prev + (starts[next]!.getTime() - prev) / (next - i + 1));
    } else {
      // Nothing dated after this — default pace, but never into the future
      starts[i] = new Date(Math.max(prev, Math.min(prev + DEFAULT_LEVEL_MS, Date.now())));
    }
  }

  const customPace = existingProgress?.levelHistory.reduce((acc, lp) => {
    if (lp.customMonthsToComplete) {
      acc[lp.level] = lp.customMonthsToComplete;
    }
    return acc;
  }, {} as Record<string, number>);

  newLevels.forEach((level, i) => {
    const isCurrent = i === newLevels.length - 1;
    const startDate = starts[i]!;
    const endDate = isCurrent ? undefined : starts[i + 1]!;
    // Distinct packets only — repeat copies of the same range aren't extra pages
    const uniqueRanges = new Set(subjectHwk.filter((h) => h.level === level).map((h) => h.range));
    const pagesCompleted = Math.min(uniqueRanges.size * 10, PAGES_PER_LEVEL);
    levelHistory.push({
      level,
      startDate,
      endDate,
      estimatedCompletion:
        endDate ?? estimateCurrentLevelEnd(startDate, pagesCompleted, customPace?.[level]),
      pagesCompleted,
      isComplete: !isCurrent,
    });
  });

  if (levelHistory.length === 0) return undefined;

  const current = levelHistory[levelHistory.length - 1];

  const allLevels = [
    ...levelHistory,
    ...calculateRemainingLevels(
      current.level,
      subject,
      current.endDate ?? current.estimatedCompletion,
      customPace
    ),
  ];

  const mm1Level = subject === "Math" ? allLevels.find((l) => l.level === "MM1") : undefined;
  const mh1Level = subject === "Math" ? allLevels.find((l) => l.level === "MH1") : undefined;

  return {
    subject,
    levelHistory: allLevels,
    programStartDate,
    currentLevel: current.level,
    ...(mm1Level && { estimatedMM1Date: mm1Level.estimatedCompletion }),
    ...(mh1Level && { estimatedMH1Date: mh1Level.estimatedCompletion }),
    estimatedCompletionDate: allLevels[allLevels.length - 1].estimatedCompletion,
  };
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
    ? toDate(historicalData.mathProgramStartDate)
    : student.subjects_startDate_Map?.Math
      ? toDate(student.subjects_startDate_Map.Math)
      : new Date();

  const englishStartDate = historicalData?.englishProgramStartDate
    ? toDate(historicalData.englishProgramStartDate)
    : student.subjects_startDate_Map?.English
      ? toDate(student.subjects_startDate_Map.English)
      : new Date();

  const mathHwk = hwkHistory.filter((h) => h.subject === "Math");
  const englishHwk = hwkHistory.filter((h) => h.subject === "English");

  console.log(`Math homework: ${mathHwk.length}, English homework: ${englishHwk.length}`);

  const mathProgress = buildSubjectProgress(
    "Math",
    mathHwk,
    historicalData?.mathLevels ?? [],
    mathStartDate,
    existingProgress?.mathProgress
  );
  const englishProgress = buildSubjectProgress(
    "English",
    englishHwk,
    historicalData?.englishLevels ?? [],
    englishStartDate,
    existingProgress?.englishProgress
  );

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
      return toDate(obj);
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
 * Progress built fresh from the student's current hwkAssigned, for read-only views (student
 * and parent portals) so they never show a stale saved copy. Falls back to the saved copy
 * if the build fails. Doesn't write anything.
 */
export async function loadFreshStudentProgress(
  student: Student,
  location: string = "san-ramon"
): Promise<StudentProgress | null> {
  try {
    const progress = await buildStudentProgress(student, location);
    if (progress.mathProgress || progress.englishProgress) return progress;
  } catch (err) {
    console.error("Error building fresh progress, using saved copy:", err);
  }
  return loadStudentProgress(student.firstName, student.lastName, location);
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