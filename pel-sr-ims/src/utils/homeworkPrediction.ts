// homeworkPrediction.ts - Suggests likely next homework assignments from a student's history.
//
// The goal is a fast, editable starting point for the worker, not a correctness guarantee:
// every suggestion below is just a prefill for Action.tsx's existing checkboxes/dropdowns.

import type { Student, HomeworkHistoryEntry, Subject } from "./types";
import { SUBSECTIONS } from "./types";
import { buildHwkHistoryFromAssignments, toDate } from "./progressService";

// Packets from one submission are pushed to Firestore within milliseconds of each other
// (see ActionContainer.tsx's studentHWPacketsToDatabase loop), so a generous window still
// won't merge two genuinely separate visits.
const VISIT_GROUPING_WINDOW_MS = 2 * 60 * 1000;

export interface PredictionChip {
  key: "advance" | "reinforce" | "repeat";
  label: string;
  level: string;
  ranges: string[]; // SUBSECTIONS entries, already in SUBSECTIONS order
  copiesByRange: Record<string, number>;
}

export interface SubjectPrediction {
  subject: Subject;
  level: string;
  chips: PredictionChip[];
}

interface Visit {
  dateAssigned: Date;
  ranges: string[]; // unique ranges touched in this visit, in the order first seen
  copiesByRange: Record<string, number>;
}

function rangeIndex(range: string): number {
  return SUBSECTIONS.indexOf(range);
}

function byRangeOrder(a: string, b: string): number {
  return rangeIndex(a) - rangeIndex(b);
}

// Takes entries in their original array order (NOT re-sorted by dateAssigned — see the
// comment on predictForSubject below for why that matters) and groups adjacent ones into
// visits by how close their dates are.
function groupIntoVisits(entries: HomeworkHistoryEntry[]): Visit[] {
  const visits: Visit[] = [];

  for (const entry of entries) {
    const date = toDate(entry.dateAssigned);
    const current = visits[visits.length - 1];

    if (current && Math.abs(date.getTime() - current.dateAssigned.getTime()) <= VISIT_GROUPING_WINDOW_MS) {
      current.dateAssigned = date;
      current.copiesByRange[entry.range] = (current.copiesByRange[entry.range] ?? 0) + 1;
      if (!current.ranges.includes(entry.range)) current.ranges.push(entry.range);
    } else {
      visits.push({
        dateAssigned: date,
        ranges: [entry.range],
        copiesByRange: { [entry.range]: 1 },
      });
    }
  }

  return visits;
}

function mostCommonCopyCount(visit: Visit): number {
  const counts = Object.values(visit.copiesByRange);
  if (counts.length === 0) return 1;

  const freq = new Map<number, number>();
  counts.forEach((c) => freq.set(c, (freq.get(c) ?? 0) + 1));

  let best = counts[0];
  let bestFreq = 0;
  freq.forEach((f, c) => {
    if (f > bestFreq) {
      bestFreq = f;
      best = c;
    }
  });
  return best;
}

/**
 * Builds up to 3 suggestion chips (Advance / Reinforce / Repeat) for the given student +
 * subject, based on their most recent "visit" (a batch of ranges assigned close together in
 * time) at their current level. Returns null when there's no history to predict from.
 */
export function predictForSubject(student: Student, subject: Subject): SubjectPrediction | null {
  const allHistory: HomeworkHistoryEntry[] =
    student.hwkHistory && student.hwkHistory.length > 0
      ? student.hwkHistory
      : buildHwkHistoryFromAssignments(student.hwkAssigned || []);

  const subjectHistory = allHistory.filter((h) => h.subject === subject);
  if (subjectHistory.length === 0) return null;

  // Deliberately NOT sorted by dateAssigned: hwkAssigned is strictly append-only (see
  // assignHWToStudent in inventoryService.ts), so array order is always chronological —
  // but dateAssigned itself isn't always trustworthy. Legacy string-only entries get
  // backfilled with `new Date()` ("now") by buildHwkHistoryFromAssignments when no real
  // date survived migration, which would make old data look newer than it is under a
  // date-sort and pick the wrong "current level" (e.g. an old EG1B entry outranking real,
  // dated EG4 entries). Trusting array order instead sidesteps that entirely.
  const currentLevel = subjectHistory[subjectHistory.length - 1].level;

  const levelHistory = subjectHistory.filter((h) => h.level === currentLevel);
  const visits = groupIntoVisits(levelHistory);
  if (visits.length === 0) return null;

  const lastVisit = visits[visits.length - 1];
  const priorVisits = visits.slice(0, -1);

  const seenBefore = new Set<string>();
  priorVisits.forEach((v) => v.ranges.forEach((r) => seenBefore.add(r)));

  const frontier = lastVisit.ranges.filter((r) => !seenBefore.has(r)).sort(byRangeOrder);
  const fullLastVisit = [...lastVisit.ranges].sort(byRangeOrder);

  const maxIndexEver = Math.max(...visits.flatMap((v) => v.ranges.map(rangeIndex)));
  const defaultCopies = mostCommonCopyCount(lastVisit);

  const chips: PredictionChip[] = [];

  // English students go straight across a level — chunks are never repeated, so only
  // "Advance" makes sense. Math students commonly get a chunk repeated a few times before
  // moving on, so all 3 chips apply there.
  const repeatsApply = subject === "Math";

  // Advance: next unassigned chunk(s). For Math, sized to mirror how many NEW chunks were
  // introduced last visit (so a student who's usually given 2 new chunks a visit keeps that
  // pace). For English, sized to the full last visit, since every chunk given is new by
  // definition — "EG4 1-30" assigned means "EG4 31-60" is next, not just one chunk.
  const advanceCount = repeatsApply ? Math.max(frontier.length, 1) : Math.max(fullLastVisit.length, 1);
  const advanceRanges: string[] = [];
  for (let i = maxIndexEver + 1; i < SUBSECTIONS.length && advanceRanges.length < advanceCount; i++) {
    advanceRanges.push(SUBSECTIONS[i]);
  }
  if (advanceRanges.length > 0) {
    chips.push({
      key: "advance",
      label: `Advance → ${advanceRanges.join(", ")}`,
      level: currentLevel,
      ranges: advanceRanges,
      copiesByRange: Object.fromEntries(advanceRanges.map((r) => [r, defaultCopies])),
    });
  }

  if (repeatsApply) {
    // Reinforce: redo exactly the ranges that were new last visit (not yet given a 2nd time).
    // Skipped when it would be identical to the Repeat chip below (e.g. a student's very
    // first visit at this level, where nothing has been "seen before" yet).
    const reinforceMatchesRepeat =
      frontier.length === fullLastVisit.length && frontier.every((r, i) => r === fullLastVisit[i]);
    if (frontier.length > 0 && !reinforceMatchesRepeat) {
      chips.push({
        key: "reinforce",
        label: `Reinforce → ${frontier.join(", ")}`,
        level: currentLevel,
        ranges: frontier,
        copiesByRange: Object.fromEntries(
          frontier.map((r) => [r, lastVisit.copiesByRange[r] ?? defaultCopies])
        ),
      });
    }

    // Repeat: reissue last visit exactly as it was given (new + already-seen ranges together).
    chips.push({
      key: "repeat",
      label: `Repeat → ${fullLastVisit.join(", ")}`,
      level: currentLevel,
      ranges: fullLastVisit,
      copiesByRange: { ...lastVisit.copiesByRange },
    });
  }

  return { subject, level: currentLevel, chips };
}

/** Subjects this student is actively enrolled in, per subjects_startDate_Map. */
export function getActiveSubjects(student: Student): Subject[] {
  const keys = Object.keys(student.subjects_startDate_Map || {});
  return keys.filter((k): k is Subject => k === "Math" || k === "English");
}
