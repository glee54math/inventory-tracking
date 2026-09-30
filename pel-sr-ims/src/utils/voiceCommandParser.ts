// voiceCommandParser.ts
//
// Rule-based parser that turns a free-text voice/typed command (e.g.
// "Assign 1 copy of MG4 41-70 to Connor Kim from the Back Inventory.")
// into structured fields matching SubmittedAction. Deliberately conservative:
// any field it can't confidently resolve is left null/empty rather than guessed,
// so the resulting action shows up blank in the UI for the user to fill in
// manually rather than silently submitting something wrong.

import {
  MATH_LEVELS,
  ENGLISH_LEVELS,
  SUBSECTIONS,
  type MovementType,
  type Student,
  type Subject,
  type SubmittedAction,
} from "./types";

export interface ParsedVoiceCommand {
  subject: Subject | null;
  level: string | null;
  selectedSubsections: string[];
  movementType: MovementType | null;
  numOfCopies: number | null;
  studentNameRaw: string | null;
  matchedStudent: Student | null;
  errors: string[];
}

const WORD_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
};

const ALL_LEVELS = [...MATH_LEVELS, ...ENGLISH_LEVELS].sort((a, b) => b.length - a.length);

// Speech-to-text sometimes splits a level code's letters and digits with a
// space (e.g. "mg 9" instead of "mg9") — tolerate that by allowing optional
// whitespace between the letter prefix and the digit suffix of each code.
function levelToPattern(code: string): string {
  const match = code.match(/^([A-Za-z]+)(\d+)$/);
  return match ? `${match[1]}\\s*${match[2]}` : code;
}
const LEVEL_REGEX = new RegExp(`\\b(${ALL_LEVELS.map(levelToPattern).join("|")})\\b`, "i");
const RANGE_REGEX = /\b(\d{1,3})\s*(?:-|to|through)\s*(\d{1,3})\b/i;

// Speech-to-text occasionally runs a level code straight into the range's
// start number with no separator at all (e.g. "mg971" for "mg9 71"). Only
// split a token when a prefix of it is an *exact* known level code AND the
// leftover digits line up with a real range later in the sentence — both
// checks are anchored to vocabulary/grammar we already trust elsewhere, so
// this won't fire on a coincidental or ambiguous merge.
function splitMergedLevelAndRangeStart(text: string): string {
  const tokenRegex = /\b[A-Za-z]+\d+\b/g;
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(text)) !== null) {
    const token = match[0];
    const upper = token.toUpperCase();
    if (ALL_LEVELS.includes(upper)) continue; // already a clean, valid code — nothing to split

    const candidates: { prefix: string; suffix: string }[] = [];
    for (let i = 1; i < upper.length; i++) {
      const prefix = upper.slice(0, i);
      const suffix = upper.slice(i);
      if (/^\d+$/.test(suffix) && ALL_LEVELS.includes(prefix)) {
        candidates.push({ prefix, suffix });
      }
    }
    candidates.sort((a, b) => b.prefix.length - a.prefix.length);

    for (const candidate of candidates) {
      const suffixNum = parseInt(candidate.suffix, 10);
      if (suffixNum < 1 || suffixNum > 110) continue;

      const normalized =
        text.slice(0, match.index) +
        `${candidate.prefix} ${candidate.suffix}` +
        text.slice(match.index + token.length);
      const rangeCheck = normalized.match(RANGE_REGEX);
      if (rangeCheck && parseInt(rangeCheck[1], 10) === suffixNum) {
        return normalized; // corroborated by the actual range grammar — accept
      }
    }
  }
  return text; // no confidently-corroborated split — leave untouched
}

const MOVEMENT_LOOKUP: Record<string, MovementType> = {
  "Back->Front": "BackToFront",
  "Back->Student": "BackToStudent",
  "Front->Back": "FrontToBack",
  "Front->Student": "FrontToStudent",
  "Shipment->Back": "ShipmentToBack",
  "Shipment->Front": "ShipmentToFront",
};

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

const STUDENT_MATCH_MAX_RATIO = 0.25;

export interface StudentMatchResult {
  student: Student | null;
  // Set when 2+ students tied for the match (exact first name, or fuzzy) —
  // distinct from "no match" so the caller can report *why* it's blank.
  ambiguousWith: Student[] | null;
  // Best guess even when it didn't clear the confidence threshold, so a
  // "did you mean X?" hint can be surfaced without ever auto-assigning it.
  closestCandidate: Student | null;
  closestRatio: number | null;
}

export function findBestStudentMatch(rawName: string, allStudents: Student[]): StudentMatchResult {
  const normalizedRaw = rawName.trim().toLowerCase();
  const empty: StudentMatchResult = { student: null, ambiguousWith: null, closestCandidate: null, closestRatio: null };
  if (!normalizedRaw) return empty;

  const exactFullNameMatch = allStudents.find(
    (student) => `${student.firstName} ${student.lastName}`.trim().toLowerCase() === normalizedRaw
  );
  if (exactFullNameMatch) {
    return { student: exactFullNameMatch, ambiguousWith: null, closestCandidate: exactFullNameMatch, closestRatio: 0 };
  }

  // First-name-only ("assign it to Ava"): only resolve when exactly one
  // student has that first name — with two+ Avas, guessing which one would
  // violate "blank over wrong", so leave it for manual selection instead.
  const firstNameMatches = allStudents.filter(
    (student) => student.firstName.trim().toLowerCase() === normalizedRaw
  );
  if (firstNameMatches.length === 1) {
    return { student: firstNameMatches[0], ambiguousWith: null, closestCandidate: firstNameMatches[0], closestRatio: 0 };
  }
  if (firstNameMatches.length > 1) {
    return { student: null, ambiguousWith: firstNameMatches, closestCandidate: firstNameMatches[0], closestRatio: 0 };
  }

  // Fuzzy fallback — catches things like "Zach" for a student named "Zac"
  // (full-name comparison alone would be thrown off by the unrelated last
  // name, so first name is checked separately at its own, honest ratio).
  let best: { student: Student; ratio: number } | null = null;
  const withinThreshold: Student[] = [];
  for (const student of allStudents) {
    const fullName = `${student.firstName} ${student.lastName}`.trim().toLowerCase();
    const firstName = student.firstName.trim().toLowerCase();
    const fullNameRatio = levenshtein(normalizedRaw, fullName) / Math.max(normalizedRaw.length, fullName.length, 1);
    const firstNameRatio = levenshtein(normalizedRaw, firstName) / Math.max(normalizedRaw.length, firstName.length, 1);
    const ratio = Math.min(fullNameRatio, firstNameRatio);

    if (!best || ratio < best.ratio) best = { student, ratio };
    if (ratio <= STUDENT_MATCH_MAX_RATIO) withinThreshold.push(student);
  }

  if (withinThreshold.length === 1) {
    return { student: withinThreshold[0], ambiguousWith: null, closestCandidate: withinThreshold[0], closestRatio: best?.ratio ?? null };
  }
  if (withinThreshold.length > 1) {
    return { student: null, ambiguousWith: withinThreshold, closestCandidate: best?.student ?? null, closestRatio: best?.ratio ?? null };
  }

  return { student: null, ambiguousWith: null, closestCandidate: best?.student ?? null, closestRatio: best?.ratio ?? null };
}

export function parseVoiceCommand(rawTranscript: string, allStudents: Student[]): ParsedVoiceCommand {
  const text = splitMergedLevelAndRangeStart(rawTranscript.trim());
  const errors: string[] = [];

  // ── Quantity ("1 copy" / "one copy") ──────────────────────────────────────
  let numOfCopies: number | null = null;
  const qtyWords = Object.keys(WORD_NUMBERS).join("|");
  const qtyMatch = text.match(new RegExp(`\\b(\\d+|${qtyWords})\\s*cop(?:y|ies)\\b`, "i"));
  if (qtyMatch) {
    const raw = qtyMatch[1].toLowerCase();
    numOfCopies = /^\d+$/.test(raw) ? parseInt(raw, 10) : WORD_NUMBERS[raw] ?? null;
  } else {
    errors.push('Could not find a number of copies (e.g. "1 copy") — leave blank and fill in manually.');
  }

  // ── Level + inferred subject ("MG4" → Math) ───────────────────────────────
  let level: string | null = null;
  let subject: Subject | null = null;
  const levelMatch = text.match(LEVEL_REGEX);
  if (levelMatch) {
    const matchedRaw = levelMatch[1].toUpperCase().replace(/\s+/g, "");
    level = ALL_LEVELS.find((l) => l.toUpperCase() === matchedRaw) ?? null;
    if (level) {
      subject = MATH_LEVELS.includes(level) ? "Math" : "English";
    }
  } else {
    errors.push('Could not recognize a grade/level code (e.g. "MG4").');
  }

  // ── Range ("41-70" / "41 to 70") expanded into the fixed 10-wide buckets ──
  let selectedSubsections: string[] = [];
  const rangeMatch = text.match(RANGE_REGEX);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    selectedSubsections = SUBSECTIONS.filter((bucket) => {
      const [bStart, bEnd] = bucket.split("-").map(Number);
      return bStart <= end && bEnd >= start;
    });
    if (selectedSubsections.length === 0) {
      errors.push(`Range "${rangeMatch[0]}" didn't match any known subsection buckets.`);
    }
  } else {
    errors.push('Could not find a page range (e.g. "41-70").');
  }

  // A range is meaningless without a resolved level — don't carry
  // selectedSubsections/copies into an action that has no level to attach
  // them to (they'd sit invisibly in state since the UI only shows the
  // subsections panel once subject+level are set).
  if (!level && selectedSubsections.length > 0) {
    errors.push("Cleared the parsed page range because no level/grade code was recognized.");
    selectedSubsections = [];
  }

  // ── Movement: source ("from the Back Inventory") + destination ───────────
  const fromMatch = text.match(/\bfrom\s+(?:the\s+)?(shipment|back(?:\s*inventory)?|front(?:\s*inventory)?)\b/i);
  let source: "Back" | "Front" | "Shipment" | null = null;
  if (fromMatch) {
    const kw = fromMatch[1].toLowerCase();
    source = kw.startsWith("ship") ? "Shipment" : kw.startsWith("back") ? "Back" : "Front";
  }

  const textWithoutFrom = fromMatch
    ? text.slice(0, fromMatch.index!) + text.slice(fromMatch.index! + fromMatch[0].length)
    : text;

  // Destination is usually introduced by "to" ("to the Front", "to Connor
  // Kim"), but people also say "for" when assigning to a student ("for
  // Connor Kim") — accept both.
  let destination: "Back" | "Front" | "Student" | null = null;
  let studentNameRaw: string | null = null;
  const toBackFrontMatch = textWithoutFrom.match(/\b(?:to|for)\s+(?:the\s+)?(back(?:\s*inventory)?|front(?:\s*inventory)?)\b/i);
  if (toBackFrontMatch) {
    destination = toBackFrontMatch[1].toLowerCase().startsWith("back") ? "Back" : "Front";
  } else {
    const toNameMatch = textWithoutFrom.match(/\b(?:to|for)\s+((?:(?!\bfrom\b)[a-zA-Z'.-]+\s*){1,4})/i);
    if (toNameMatch) {
      destination = "Student";
      studentNameRaw = toNameMatch[1].trim().replace(/[.,]+$/, "");
    }
  }

  if (!source) errors.push('Could not tell where this is moving from (e.g. "from the Back Inventory").');
  if (!destination) errors.push('Could not tell where this is moving to (e.g. "to Connor Kim" or "to the Front").');

  let movementType: MovementType | null = null;
  if (source && destination) {
    movementType = MOVEMENT_LOOKUP[`${source}->${destination}`] ?? null;
    if (!movementType) {
      errors.push(`"${source} to ${destination}" isn't a supported movement.`);
    }
  }

  // ── Student resolution (only when destination is a student) ──────────────
  let matchedStudent: Student | null = null;
  if (destination === "Student" && studentNameRaw) {
    const match = findBestStudentMatch(studentNameRaw, allStudents);
    matchedStudent = match.student;
    if (!matchedStudent) {
      if (match.ambiguousWith) {
        const names = match.ambiguousWith.map((s) => `${s.firstName} ${s.lastName}`.trim()).join(", ");
        errors.push(`Multiple students match "${studentNameRaw}" (${names}) — leave blank and select manually.`);
      } else if (match.closestCandidate) {
        const closestName = `${match.closestCandidate.firstName} ${match.closestCandidate.lastName}`.trim();
        errors.push(`Could not confidently match "${studentNameRaw}" to a known student — closest is "${closestName}" — leave blank and select manually.`);
      } else {
        errors.push(`Could not confidently match "${studentNameRaw}" to a known student — leave blank and select manually.`);
      }
    }
  }

  return {
    subject,
    level,
    selectedSubsections,
    movementType,
    numOfCopies,
    studentNameRaw,
    matchedStudent,
    errors,
  };
}

export function buildActionFromParsedCommand(parsed: ParsedVoiceCommand): SubmittedAction {
  const movementMap: Record<string, string> = {};
  const movementNumOfCopiesMap: Record<string, number> = {};

  for (const range of parsed.selectedSubsections) {
    if (parsed.movementType) movementMap[range] = parsed.movementType;
    if (parsed.numOfCopies != null) movementNumOfCopiesMap[range] = parsed.numOfCopies;
  }

  return {
    subject: parsed.subject,
    level: parsed.level ?? "",
    selectedSubsections: parsed.selectedSubsections,
    movementMap,
    movementNumOfCopiesMap,
    toStudent: parsed.matchedStudent ?? ({} as Student),
  };
}
