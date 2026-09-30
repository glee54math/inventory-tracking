// voiceFeedbackService.ts
//
// Persists self-reported outcomes of Voice-to-Action (VTA) commands so the
// parser's grammar rules can be reviewed and improved later — see
// scripts/exportVoiceFeedback.mjs for pulling this collection down to local
// JSON files for offline review.
//
// Fields are kept flat (no nested objects) so Firestore's console shows them
// as columns in the collection table view — you can scan level/movement/
// student/reviewed for every entry without opening each document. The
// `reviewed` field is a plain boolean, which the console renders as an
// inline-editable checkbox in that same table.

import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import type { SubmittedAction } from "./types";

export interface VoiceFeedbackRecord {
  transcript: string;
  // Raw speech-to-text output, frozen before any manual edits — null when
  // voice wasn't used (typed straight into the fallback box). Lets a
  // reviewer separate "STT misheard this" (transcriptEdited: true, nothing a
  // grammar-rule change can fix) from "the parser got the transcript wrong"
  // (transcriptEdited: false, an actual voiceCommandParser.ts bug) without
  // needing to ask a separate question at record time.
  originalTranscript: string | null;
  transcriptEdited: boolean;
  outcome: "success" | "failure";
  subject: string | null;
  level: string;
  selectedSubsections: string[];
  movementType: string | null;
  numOfCopies: number | null;
  studentName: string | null;
  timestamp: Date;
  reviewed: boolean;
}

export function buildVoiceFeedbackRecord(
  transcript: string,
  outcome: "success" | "failure",
  action: SubmittedAction,
  sttInfo: { originalTranscript: string | null; transcriptEdited: boolean }
): VoiceFeedbackRecord {
  const movementValues = Object.values(action.movementMap);
  const copiesValues = Object.values(action.movementNumOfCopiesMap);
  const studentName = action.toStudent?.firstName
    ? `${action.toStudent.firstName} ${action.toStudent.lastName}`.trim()
    : null;

  return {
    transcript,
    originalTranscript: sttInfo.originalTranscript,
    transcriptEdited: sttInfo.transcriptEdited,
    outcome,
    subject: action.subject ?? null,
    level: action.level,
    selectedSubsections: action.selectedSubsections,
    movementType: movementValues[0] ?? null,
    numOfCopies: copiesValues[0] ?? null,
    studentName,
    timestamp: new Date(),
    reviewed: false,
  };
}

export async function saveVoiceCommandFeedback(record: VoiceFeedbackRecord) {
  await addDoc(collection(db, "voiceCommandFeedback"), record);
}
