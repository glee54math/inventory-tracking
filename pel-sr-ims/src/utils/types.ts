import type { Timestamp } from "firebase/firestore";

export type MovementType =
  | "BackToFront"
  | "BackToStudent"
  | "FrontToBack"
  | "FrontToStudent"
  | "ShipmentToBack"
  | "ShipmentToFront";

export interface SubmittedAction {
  subject: "Math" | "English" | null;
  level: string;
  movementMap: Record<string, MovementType>;
  movementNumOfCopiesMap: Record<string, number>;
  selectedSubsections: string[];
  toStudent: Student;
}

export interface Subsection {
  range: string;
  count: number;
}

export interface InventoryData {
  [level: string]: Subsection[];
};

export interface InsufficientSubsection {
  level: string;
  range: string;
  missingCount: number;
}

export type LogEntry = {
    timeStamp: Date;
    userID: string;
    eventType: string;
    message: string;
}

export type Worker = {
    firstName: string;
    lastName: string;
    initials: string;
    password: string;
}

export interface Student {
  firstName: string;
  lastName: string;
  father: string;
  mother: string;
  subjects_startDate_Map: Record<string, Date>;
  hwkAssigned?: string[]; // This will probably be changed 
}