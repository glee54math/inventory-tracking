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
}

export interface Subsection {
  range: string;
  count: number;
}

export type InventoryData = {
  [level: string]: Subsection[];
};

export type LogEntry = {
    timeStamp: Date | Timestamp;
    userID: string;
    eventType: string;
    message: string;
}