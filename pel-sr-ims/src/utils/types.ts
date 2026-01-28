// types.ts - Updated with Progress Tracking Types

// Existing Types
export interface Student {
  firstName: string;
  lastName: string;
  father: string;
  mother: string;
  subjects_startDate_Map: Record<string, string>; // [subject]: Date as string
  hwkAssigned?: string[]; // Legacy field - kept for backward compatibility
  hwkHistory?: HomeworkHistoryEntry[]; // New field for detailed homework tracking
  [key: string]: any;
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
  subject?: string;
  level: string;
  selectedSubsections: string[];
  movementMap: Record<string, string>;
  movementNumOfCopiesMap: Record<string, number>;
  toStudent: {
    firstName: string;
    lastName: string;
  };
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