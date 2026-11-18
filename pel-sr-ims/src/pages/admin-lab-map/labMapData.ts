// labMapData.ts
// Mr. Lee-only data for the "Lab order & vocabulary" board:
//   - Lab order: LAB_NEEDS (levelSubsections.ts) via utils/labOrder.ts.
//   - Vocabulary: every _planning/Grade-*/{Lab}/vocabulary.md, read as text and
//     parsed here, so the board stays current without hand-editing anything.
//
// PRIVACY: only import this module dynamically, from admin pages (AllLevelsPage).
// The planning files must never end up in a chunk the student portal loads.

import { LABS, type LabInfo } from "../../utils/labOrder";

const vocabFiles = import.meta.glob("../math-levels/_planning/Grade-*/*/vocabulary.md", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;

export interface VocabEntry {
    word: string;
    labId: string;
    /** 1-based unit number; null for "Shell / all units". */
    unit: number | null;
    unitTitle: string;
    how: string;
    where: string;
    notes: string;
    /** The list marks it "Used before taught" (a finding). */
    usedBeforeTaught: boolean;
}

export interface AvoidedWord {
    avoided: string;
    instead: string;
    why: string;
}

export interface LabVocab {
    lab: LabInfo;
    /** Repo path of the list, from src/pages/math-levels/. */
    path: string;
    entries: VocabEntry[];
    avoided: AvoidedWord[];
    findings: string[];
}

/** Markdown cell → plain text. */
function plain(s: string): string {
    return s
        .replace(/\*\*/g, "")
        .replace(/`/g, "")
        .replace(/\\\|/g, "|")
        .trim();
}

function cells(line: string): string[] {
    // Split on | that isn't escaped; drop the empty first/last cells.
    return line
        .split(/(?<!\\)\|/)
        .slice(1, -1)
        .map((c) => c.trim());
}

const isSeparator = (line: string) => /^\|\s*:?-{2,}/.test(line);

function parse(path: string, md: string): LabVocab | null {
    const folder = path.split("/").slice(-2, -1)[0];
    const lab = LABS.find((l) => l.id.endsWith(`_${folder}`));
    if (!lab) return null;

    const entries: VocabEntry[] = [];
    const avoided: AvoidedWord[] = [];
    const findings: string[] = [];
    type Section = { kind: "unit"; unit: number; title: string } | { kind: "shell" } | { kind: "avoided" } | { kind: "findings" } | { kind: "other" };
    let section: Section = { kind: "other" };
    let headerSeen = false;

    for (const raw of md.split(/\r?\n/)) {
        const line = raw.trim();
        const h = line.match(/^##\s+(.*)$/);
        if (h) {
            const title = h[1];
            const u = title.match(/^Unit\s+(\d+)\s*[:.—-]\s*(.*)$/i);
            if (u) section = { kind: "unit", unit: Number(u[1]), title: u[2].trim() };
            else if (/shell|all units/i.test(title)) section = { kind: "shell" };
            else if (/avoid/i.test(title)) section = { kind: "avoided" };
            else if (/finding/i.test(title)) section = { kind: "findings" };
            else section = { kind: "other" };
            headerSeen = false;
            continue;
        }
        if (section.kind === "findings") {
            const f = line.match(/^(?:\d+\.|[-*])\s+(.*)$/);
            if (f) findings.push(plain(f[1]));
            continue;
        }
        if (!line.startsWith("|")) continue;
        if (isSeparator(line)) continue;
        if (!headerSeen) {
            headerSeen = true; // first table row of a section is its header
            continue;
        }
        const c = cells(line);
        if (section.kind === "avoided") {
            avoided.push({ avoided: plain(c[0] ?? ""), instead: plain(c[1] ?? ""), why: plain(c[2] ?? "") });
        } else if (section.kind === "unit" || section.kind === "shell") {
            let word = plain(c[0] ?? "");
            const flagged = /used before taught/i.test(word);
            word = word.replace(/^used before taught:\s*/i, "");
            if (!word) continue;
            entries.push({
                word,
                labId: lab.id,
                unit: section.kind === "unit" ? section.unit : null,
                unitTitle: section.kind === "unit" ? section.title : "Shell / all units",
                how: plain(c[1] ?? ""),
                where: plain(c[2] ?? ""),
                notes: plain(c[3] ?? ""),
                usedBeforeTaught: flagged,
            });
        }
    }
    return { lab, path: path.replace("../math-levels/", ""), entries, avoided, findings };
}

const order = new Map(LABS.map((l, i) => [l.id, i]));

/** One entry per lab that has a vocabulary.md, in lab order. */
export const LAB_VOCAB: LabVocab[] = Object.entries(vocabFiles)
    .map(([path, md]) => parse(path, md))
    .filter((v): v is LabVocab => !!v)
    .sort((a, b) => (order.get(a.lab.id) ?? 0) - (order.get(b.lab.id) ?? 0));

export const VOCAB_BY_LAB: Record<string, LabVocab> = Object.fromEntries(LAB_VOCAB.map((v) => [v.lab.id, v]));

/** Every word entry, in lab order then unit order (shell last within a lab). */
export const ALL_VOCAB: VocabEntry[] = LAB_VOCAB.flatMap((v) =>
    [...v.entries].sort((a, b) => (a.unit ?? 999) - (b.unit ?? 999))
);
