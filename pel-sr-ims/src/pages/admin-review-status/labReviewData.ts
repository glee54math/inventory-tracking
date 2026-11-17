// labReviewData.ts
// Mr. Lee-only data for the lab review status board. Built from two sources so it
// stays current without hand-editing anything here:
//   1. _planning/reviews/LAB_STATUS.md — the Labs table (Review, CFU pointer, Notes).
//   2. The file names in each _planning/reviews/{Level}_{Lab}/ folder — which
//      workflow steps (curriculum check, English check, fixes, summary) have
//      reports, and how many rounds.
//
// PRIVACY: only import this module dynamically, from admin pages (AllLevelsPage,
// LevelFilesPage). Never import it from LevelsPage, a lab shell, or anything under
// math-levels/shared — those are also used by the student portal. Loaded this way it
// stays in its own chunk that the student portal never requests.

import statusMd from "../math-levels/_planning/reviews/LAB_STATUS.md?raw";

// Keys only: the report contents are never loaded (the lazy loaders are never called).
const reviewFiles = Object.keys(import.meta.glob("../math-levels/_planning/reviews/*/*.md", { query: "?raw" }));

export type ReviewState = "done" | "partial" | "not-started";
export type PointerState = "done" | "pilot" | "todo" | "na";

export interface StepCount {
    /** Rounds that have this step's report. */
    rounds: number;
}

export interface LabReviewStatus {
    level: string;
    /** Lab folder name, e.g. "DecimalsLab". */
    lab: string;
    /** `${level}_${lab}` — same as LEVEL_SKILLS' componentFile. */
    key: string;
    label: string;
    review: ReviewState;
    /** The Review cell as written, e.g. "Done (3 rounds)". */
    reviewText: string;
    pointer: PointerState;
    pointerText: string;
    notes: string;
    steps: {
        built: boolean;
        curriculum: StepCount;
        english: StepCount;
        fixes: StepCount;
        summary: boolean;
    };
}

function clean(cell: string): string {
    return cell.replace(/`/g, "").replace(/\*\*/g, "").trim();
}

function reviewState(text: string): ReviewState {
    if (/^done/i.test(text)) return "done";
    if (/^partial/i.test(text)) return "partial";
    return "not-started";
}

function pointerState(text: string): PointerState {
    if (/^done/i.test(text)) return "done";
    if (/^pilot/i.test(text)) return "pilot";
    if (/^n\/a/i.test(text)) return "na";
    return "todo";
}

function filesFor(key: string): string[] {
    const prefix = `../math-levels/_planning/reviews/${key}/`;
    return reviewFiles.filter((p) => p.startsWith(prefix)).map((p) => p.slice(prefix.length));
}

function rounds(files: string[], step: string): StepCount {
    const re = new RegExp(`^round-(\\d+)-${step}\\.md$`);
    return { rounds: new Set(files.map((f) => f.match(re)?.[1]).filter(Boolean)).size };
}

function parse(): LabReviewStatus[] {
    const labsSection = statusMd.split(/^## Labs\s*$/m)[1]?.split(/^## /m)[0] ?? "";
    const out: LabReviewStatus[] = [];
    for (const line of labsSection.split("\n")) {
        if (!/^\|\s*M[KGMH]\d/.test(line)) continue;
        const [level, lab, label, reviewText, pointerText, notes] = line.split("|").slice(1, -1).map(clean);
        if (!level || !lab) continue;
        const key = `${level}_${lab}`;
        const files = filesFor(key);
        out.push({
            level,
            lab,
            key,
            label: label || lab,
            review: reviewState(reviewText),
            reviewText,
            pointer: pointerState(pointerText),
            pointerText: pointerText === "—" ? "" : pointerText,
            notes: notes ?? "",
            steps: {
                built: true,
                curriculum: rounds(files, "curriculum"),
                english: rounds(files, "english"),
                fixes: rounds(files, "fixes"),
                summary: files.includes("summary.md"),
            },
        });
    }
    return out;
}

export const LAB_REVIEW_STATUS: LabReviewStatus[] = parse();

export const statusByKey = new Map(LAB_REVIEW_STATUS.map((s) => [s.key, s]));

export type LevelState = "done" | "some" | "none";

/** Roll-up for a level chip: every lab done, some reviewed, or none. Undefined if not tracked. */
export function levelState(level: string): { state: LevelState; done: number; total: number } | undefined {
    const labs = LAB_REVIEW_STATUS.filter((s) => s.level === level);
    if (labs.length === 0) return undefined;
    const done = labs.filter((s) => s.review === "done").length;
    const started = labs.filter((s) => s.review !== "not-started").length;
    return { state: done === labs.length ? "done" : started > 0 ? "some" : "none", done, total: labs.length };
}
