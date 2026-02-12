// historicalProgressService.ts - Service for managing manually-entered historical progress data

import {
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { GradeSkip } from "./types";

export interface HistoricalLevelEntry {
  level: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
}

export interface HistoricalProgressData {
  studentId: string;
  firstName: string;
  lastName: string;
  startingGrade?: string; // Grade when they first started (K, 1, 2, ..., 12)
  mathProgramStartDate?: string;
  englishProgramStartDate?: string;
  mathLevels?: HistoricalLevelEntry[];
  englishLevels?: HistoricalLevelEntry[];
  gradeSkips?: GradeSkip[]; // Track when student skipped grades
  lastUpdated: Date;
}

/**
 * Save historical progress data to Firestore
 */
export async function saveHistoricalProgress(
  data: HistoricalProgressData,
  location: string = "san-ramon"
): Promise<void> {
  const historicalRef = doc(
    db,
    "students",
    location,
    "historical-progress",
    data.studentId
  );

  // Remove undefined values
  const cleanData: any = {
    studentId: data.studentId,
    firstName: data.firstName,
    lastName: data.lastName,
    lastUpdated: new Date(),
  };

  if (data.startingGrade) cleanData.startingGrade = data.startingGrade;
  if (data.mathProgramStartDate) cleanData.mathProgramStartDate = data.mathProgramStartDate;
  if (data.englishProgramStartDate) cleanData.englishProgramStartDate = data.englishProgramStartDate;
  if (data.mathLevels) cleanData.mathLevels = data.mathLevels;
  if (data.englishLevels) cleanData.englishLevels = data.englishLevels;
  if (data.gradeSkips) cleanData.gradeSkips = data.gradeSkips;

  if (data.mathProgramStartDate) {
    cleanData.mathProgramStartDate = data.mathProgramStartDate;
  }
  if (data.englishProgramStartDate) {
    cleanData.englishProgramStartDate = data.englishProgramStartDate;
  }
  if (data.mathLevels && data.mathLevels.length > 0) {
    cleanData.mathLevels = data.mathLevels;
  }
  if (data.englishLevels && data.englishLevels.length > 0) {
    cleanData.englishLevels = data.englishLevels;
  }

  await setDoc(historicalRef, cleanData);

  console.log(`✅ Saved historical progress for ${data.firstName} ${data.lastName}`);
}

/**
 * Load historical progress data from Firestore
 */
export async function loadHistoricalProgress(
  firstName: string,
  lastName: string,
  location: string = "san-ramon"
): Promise<HistoricalProgressData | null> {
  const studentId = `${firstName}-${lastName}`;
  const historicalRef = doc(
    db,
    "students",
    location,
    "historical-progress",
    studentId
  );

  const snapshot = await getDoc(historicalRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  // Convert Firestore Timestamp to Date
  const lastUpdated = data.lastUpdated?.toDate
    ? data.lastUpdated.toDate()
    : new Date();

  return {
    studentId: data.studentId,
    firstName: data.firstName,
    lastName: data.lastName,
    startingGrade: data.startingGrade,
    mathProgramStartDate: data.mathProgramStartDate,
    englishProgramStartDate: data.englishProgramStartDate,
    mathLevels: data.mathLevels,
    englishLevels: data.englishLevels,
    gradeSkips: data.gradeSkips,
    lastUpdated,
  };
}