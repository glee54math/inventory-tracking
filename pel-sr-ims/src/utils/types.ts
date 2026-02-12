// types.ts - Updated with Progress Tracking Types

// Existing Types
export type MovementType = "BackToFront" | "BackToStudent" | "FrontToBack" | "FrontToStudent" | "ShipmentToBack" | "ShipmentToFront";

export interface Student {
  firstName: string;
  lastName: string;
  father: string;
  mother: string;
  startingGrade?: string; // Grade when they first started (K, 1, 2, ..., 12)
  subjects_startDate_Map: Record<string, string>; // [subject]: Date as string
  hwkAssigned?: string[]; // Legacy field - kept for backward compatibility
  hwkHistory?: HomeworkHistoryEntry[]; // New field for detailed homework tracking
  [key: string]: any;
}

export interface GradeSkip {
  gradeSkipped: string; // e.g., "6" for 6th grade math
  subject: "Math" | "English";
  effectiveDate: string; // ISO date string when skip takes effect
}

export interface HomeworkHistoryEntry {
  assignment: string; // e.g., "EG6 41-50"
  dateAssigned: Date;
  level: string; // e.g., "EG6"
  range: string; // e.g., "41-50"
  subject: "Math" | "English";
}

export interface StudentProgress {
  studentId: string; // firstName + lastName as unique identifier
  firstName: string;
  lastName: string;
  mathProgress?: SubjectProgress;
  englishProgress?: SubjectProgress;
  lastUpdated: Date;
}

export interface SubjectProgress {
  subject: "Math" | "English";
  levelHistory: LevelProgress[];
  programStartDate: Date;
  currentLevel: string;
  estimatedMM1Date?: Date; // For Math only
  estimatedMH1Date?: Date; // For Math only
  estimatedCompletionDate: Date;
}

export interface LevelProgress {
  level: string; // e.g., "EG6"
  startDate: Date;
  endDate?: Date; // When they moved to next level
  estimatedCompletion: Date; // Calculated based on pace
  customMonthsToComplete?: number; // Manually set pace
  pagesCompleted: number; // Number of pages finished in this level
  isComplete: boolean;
}

export type LogEntry = {
  timeStamp: Date;
  userID: string;
  eventType: string;
  message: string;
};

export interface SubmittedAction {
  subject?: string | null;
  level: string;
  selectedSubsections: string[];
  movementMap: Record<string, string>;
  movementNumOfCopiesMap: Record<string, number>;
  toStudent: Student;
}

export interface InventoryData {
  [level: string]: Subsection[];
}

export interface Subsection {
  range: string;
  count: number;
}

export interface InsufficientSubsection {
  level: string;
  range: string;
  missingCount: number;
}

export interface Worker {
  firstName: string;
  lastName: string;
  initials: string;
  pin?: string;
}

//Types for Parent Portal

export interface Parent {
  uid: string; // Firebase Auth UID
  email: string;
  firstName: string;
  lastName: string;
  parentType: "father" | "mother" | "guardian";
  children: string[]; // array of studentIds (firstName-lastName)
  accountClaimed: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface ParentRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  parentType: "father" | "mother" | "guardian";
}

export interface ChildSearchResult {
  studentId: string;
  firstName: string;
  lastName: string;
  father?: string;
  mother?: string;
  joinDate?: string;
  matchScore: number; // for sorting relevance
}

// Level sequences for progression tracking
export const MATH_LEVELS = [
  "MK1", "MK2", "MK3", "MK4",
  "MG1", "MG2", "MG3", "MG4", "MG5", "MG6", "MG7", "MG8", "MG9", "MG10", "MG11",
  "MM1", "MM2", "MM3",
  "MH1", "MH2", "MH3", "MHG", "MH4", "MHT", "MH5", "MH6"
];

export const ENGLISH_LEVELS = [
  "EK1", "EK2", "EK3", "EK4", "EK5",
  "EG1", "EG1B", "EG2", "EG2B", "EG3", "EG4", "EG5", "EG6", "EG7", "EG8", "EG9", "EG10",
  "EM1", "EM2", "EM3", "EM4", "EM5",
  "EH1", "EH2", "EH3", "EH4", "EH5"
];

export const PAGES_PER_LEVEL = 110;
export const DEFAULT_MONTHS_PER_LEVEL = 3.3;

// Grade level mappings for "average" expected progress
export const MATH_GRADE_LEVELS: Record<string, string[]> = {
  'K': ['MK1', 'MK2', 'MK3', 'MK4'],
  '1': ['MG1', 'MG2', 'MG3', 'MG4'],
  '2': ['MG5', 'MG6'],
  '3': ['MG6', 'MG7'],
  '4': ['MG8', 'MG9'],
  '5': ['MG10', 'MG11'],
  '6': ['MM1', 'MM2'],
  '7': ['MM2', 'MM3'],
  '8': ['MM3', 'MH1'],
  '9': ['MH1', 'MH2'],
  '10': ['MH3', 'MHG'],
  '11': ['MH4', 'MHT'],
  '12': ['MH5', 'MH6'],
};

export const ENGLISH_GRADE_LEVELS: Record<string, string[]> = {
  'K': ['EK1', 'EK2', 'EK3', 'EK4'],
  '1': ['EK5', 'EG1', 'EG1B'],
  '2': ['EG2', 'EG2B'],
  '3': ['EG3', 'EG4', 'EG5'],
  '4': ['EG6', 'EG7', 'EG8'],
  '5': ['EG9', 'EG10'],
  '6': ['EG10', 'EM1'],
  '7': ['EM2', 'EM3'],
  '8': ['EM4', 'EM5'],
  '9': ['EH1', 'EH2'],
  '10': ['EH2', 'EH3'],
  '11': ['EH3', 'EH4'],
  '12': ['EH4', 'EH5'],
};

// School year starts on August 15
export const SCHOOL_YEAR_START_MONTH = 7; // August (0-indexed)
export const SCHOOL_YEAR_START_DAY = 15;