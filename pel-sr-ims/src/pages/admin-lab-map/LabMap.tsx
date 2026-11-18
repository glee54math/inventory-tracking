// LabMap.tsx
// Mr. Lee-only board on the All Levels page: "Lab order & vocabulary".
//   - Lab order: every lab by level, with its needs (LAB_NEEDS). Pick a lab to
//     see what it needs first (direct and earlier) and what it leads to.
//   - Vocabulary: every word in the labs' vocabulary.md lists, with the lab and
//     unit that teaches it. "Check against a lab" marks each word as taught in an
//     earlier lab (one this lab needs), in this lab, or not before it.
//
// PRIVACY: load only with React.lazy / import() from AllLevelsPage (Mr. Lee-only).

import { useMemo, useState } from "react";
import { BookOpen, Lock, Network } from "lucide-react";
import { LABS, LAB_BY_ID, allNeeds, hasModuleTest, neededBy, type LabInfo } from "../../utils/labOrder";
import { ALL_VOCAB, LAB_VOCAB, VOCAB_BY_LAB, type VocabEntry } from "./labMapData";
import "./LabMap.css";

const OPEN_KEY = "labMapBoardOpen";

type Tab = "order" | "vocab";

/** Every lab that needs this one, directly or through others. */
function allNeededBy(id: string): string[] {
    const out: string[] = [];
    const queue = neededBy(id);
    while (queue.length) {
        const n = queue.shift()!;
        if (out.includes(n)) continue;
        out.push(n);
        queue.push(...neededBy(n));
    }
    return out;
}

/** "needs MG5 ×2, MG1" — level codes, counted, in the order they're listed. */
function needsSummary(l: LabInfo): string {
    if (l.needs.length === 0) return "needs nothing";
    const counts = new Map<string, number>();
    for (const n of l.needs) {
        const lv = LAB_BY_ID[n]?.level ?? "?";
        counts.set(lv, (counts.get(lv) ?? 0) + 1);
    }
    return `needs ${[...counts].map(([lv, c]) => (c > 1 ? `${lv} ×${c}` : lv)).join(", ")}`;
}

const labsByLevel: [string, LabInfo[]][] = (() => {
    const m = new Map<string, LabInfo[]>();
    for (const l of LABS) m.set(l.level, [...(m.get(l.level) ?? []), l]);
    return [...m.entries()];
})();

function LabChip({ id, onPick }: { id: string; onPick?: (id: string) => void }) {
    const lab = LAB_BY_ID[id];
    if (!lab) return <span className="lm-chip lm-chip--missing">{id} (not found)</span>;
    return (
        <button type="button" className="lm-chip" onClick={() => onPick?.(id)}>
            <span className="lm-chip-level">{lab.level}</span> {lab.label}
        </button>
    );
}

// ---------------------------------------------------------------------------

function LabOrderView({ onShowWords }: { onShowWords: (labId: string) => void }) {
    const [selected, setSelected] = useState<string | null>("MG2_PlaceValueTo120Lab");
    const sel = selected ? LAB_BY_ID[selected] : null;

    const rel = useMemo(() => {
        if (!sel) return null;
        const earlier = allNeeds(sel.id);
        const later = allNeededBy(sel.id);
        return {
            direct: new Set(sel.needs),
            earlier: new Set(earlier),
            next: new Set(neededBy(sel.id)),
            later: new Set(later),
        };
    }, [sel]);

    const cls = (id: string) => {
        if (!rel || !sel) return "";
        if (id === sel.id) return " lm-lab--selected";
        if (rel.direct.has(id)) return " lm-lab--need";
        if (rel.earlier.has(id)) return " lm-lab--earlier";
        if (rel.next.has(id)) return " lm-lab--next";
        if (rel.later.has(id)) return " lm-lab--later";
        return " lm-lab--dim";
    };

    const vocab = sel ? VOCAB_BY_LAB[sel.id] : undefined;

    return (
        <div className="lm-order">
            <p className="lm-note">
                <b>Needs are a draft (2026-11-18)</b>, written from the standards each lab covers. Edit them in{" "}
                <code>src/utils/levelSubsections.ts</code> → <code>LAB_NEEDS</code>. Students only get a nudge ("This lab is
                easier after …"); no lab is locked. A lab is finished when its Module Test is passed, or when you mark it with
                your PIN.
            </p>

            <div className="lm-legend">
                <span className="lm-key lm-key--selected">Selected</span>
                <span className="lm-key lm-key--need">Needs first</span>
                <span className="lm-key lm-key--earlier">Earlier (needed by its needs)</span>
                <span className="lm-key lm-key--next">Leads to</span>
                <span className="lm-key lm-key--later">Later</span>
            </div>

            <div className="lm-order-grid">
                <div className="lm-levels">
                    {labsByLevel.map(([level, labs]) => (
                        <div key={level} className="lm-level-row">
                            <span className="lm-level">{level}</span>
                            <div className="lm-labs">
                                {labs.map((l) => (
                                    <button
                                        key={l.id}
                                        type="button"
                                        className={`lm-lab${cls(l.id)}`}
                                        onClick={() => setSelected(l.id === selected ? null : l.id)}
                                        aria-pressed={l.id === selected}
                                    >
                                        <span className="lm-lab-name">{l.label}</span>
                                        <span className="lm-lab-meta">
                                            {needsSummary(l)}
                                            {VOCAB_BY_LAB[l.id] && <span title="Has a vocabulary list"> · 📖</span>}
                                            {!hasModuleTest(l.id) && <span title="No Module Test: only you can mark it finished"> · no test</span>}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <aside className="lm-detail">
                    {!sel ? (
                        <p className="lm-muted">Pick a lab to see what it needs and what it leads to.</p>
                    ) : (
                        <>
                            <h3>
                                <span className="lm-chip-level">{sel.level}</span> {sel.label}
                            </h3>
                            <dl>
                                <dt>Needs first</dt>
                                <dd>{sel.needs.length ? sel.needs.map((n) => <LabChip key={n} id={n} onPick={setSelected} />) : <span className="lm-muted">Nothing. A starting lab.</span>}</dd>
                                <dt>All earlier labs</dt>
                                <dd>
                                    {rel && rel.earlier.size > 0 ? (
                                        [...rel.earlier].map((n) => <LabChip key={n} id={n} onPick={setSelected} />)
                                    ) : (
                                        <span className="lm-muted">None.</span>
                                    )}
                                </dd>
                                <dt>Leads to</dt>
                                <dd>
                                    {rel && rel.next.size > 0 ? (
                                        [...rel.next].map((n) => <LabChip key={n} id={n} onPick={setSelected} />)
                                    ) : (
                                        <span className="lm-muted">No lab needs this one yet.</span>
                                    )}
                                </dd>
                                <dt>Finished when</dt>
                                <dd>{hasModuleTest(sel.id) ? "Module Test passed, or you mark it." : "No Module Test: only when you mark it."}</dd>
                                <dt>Vocabulary list</dt>
                                <dd>
                                    {vocab ? (
                                        <>
                                            {vocab.entries.length} words, {vocab.entries.filter((e) => e.usedBeforeTaught).length} used before taught,{" "}
                                            {vocab.findings.length} findings.{" "}
                                            <button type="button" className="lm-link" onClick={() => onShowWords(sel.id)}>
                                                Show words
                                            </button>
                                        </>
                                    ) : (
                                        <span className="lm-muted">Not written yet.</span>
                                    )}
                                </dd>
                            </dl>
                        </>
                    )}
                </aside>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------

type Relation = "this" | "earlier" | "not-before";

const RELATION_LABEL: Record<Relation, string> = {
    this: "This lab",
    earlier: "Taught earlier",
    "not-before": "Not before",
};

function VocabView({ labFilter, setLabFilter }: { labFilter: string; setLabFilter: (id: string) => void }) {
    const [query, setQuery] = useState("");
    const [onlyFlags, setOnlyFlags] = useState(false);
    const [checkFor, setCheckFor] = useState("");

    const earlier = useMemo(() => new Set(checkFor ? allNeeds(checkFor) : []), [checkFor]);
    const relation = (e: VocabEntry): Relation => (e.labId === checkFor ? "this" : earlier.has(e.labId) ? "earlier" : "not-before");

    const q = query.trim().toLowerCase();
    const rows = ALL_VOCAB.filter(
        (e) =>
            (labFilter === "all" || e.labId === labFilter) &&
            (!onlyFlags || e.usedBeforeTaught) &&
            (!q || e.word.toLowerCase().includes(q) || e.notes.toLowerCase().includes(q))
    );
    const filteredLab = labFilter !== "all" ? VOCAB_BY_LAB[labFilter] : undefined;
    const withList = new Set(LAB_VOCAB.map((v) => v.lab.id));

    return (
        <div className="lm-vocab">
            <p className="lm-note">
                From each lab's <code>_planning/Grade-x/{"{Lab}"}/vocabulary.md</code>. A word is listed under the unit that first
                teaches it, so a later unit in the same lab may use it. <b>Check against a lab</b> shows whether a student
                reaching that lab has met each word: in a lab it needs (directly or earlier), in the lab itself, or not before
                it.
            </p>

            <div className="lm-controls">
                <input
                    type="search"
                    className="lm-search"
                    placeholder="Find a word, e.g. take away"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Find a word"
                />
                <label>
                    Lab{" "}
                    <select value={labFilter} onChange={(e) => setLabFilter(e.target.value)}>
                        <option value="all">All labs with a list</option>
                        {LAB_VOCAB.map((v) => (
                            <option key={v.lab.id} value={v.lab.id}>
                                {v.lab.level} · {v.lab.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Check against a lab{" "}
                    <select value={checkFor} onChange={(e) => setCheckFor(e.target.value)}>
                        <option value="">(off)</option>
                        {LABS.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.level} · {l.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="lm-check">
                    <input type="checkbox" checked={onlyFlags} onChange={(e) => setOnlyFlags(e.target.checked)} /> Only "used
                    before taught"
                </label>
            </div>

            <p className="lm-muted lm-coverage">
                Lists written for {withList.size} of {LABS.length} labs:{" "}
                {LAB_VOCAB.map((v) => v.lab.level).join(", ")}. The rest get one when they are reviewed.
            </p>

            <div className="lm-table-wrap">
                <table className="lm-table">
                    <thead>
                        <tr>
                            <th>Word</th>
                            {checkFor && <th>For {LAB_BY_ID[checkFor]?.level}</th>}
                            <th>Taught in</th>
                            <th>Unit</th>
                            <th>How it's taught</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((e, i) => {
                            const lab = LAB_BY_ID[e.labId];
                            const r = checkFor ? relation(e) : null;
                            return (
                                <tr key={`${e.labId}-${i}`} className={e.usedBeforeTaught ? "lm-row--flag" : ""}>
                                    <td className="lm-word">
                                        {e.word}
                                        {e.usedBeforeTaught && <span className="lm-flag">used before taught</span>}
                                    </td>
                                    {r && (
                                        <td>
                                            <span className={`lm-rel lm-rel--${r}`}>{RELATION_LABEL[r]}</span>
                                        </td>
                                    )}
                                    <td className="lm-nowrap">
                                        <span className="lm-chip-level">{lab?.level}</span> {lab?.label}
                                    </td>
                                    <td>{e.unit != null ? `${e.unit}. ${e.unitTitle}` : e.unitTitle}</td>
                                    <td className="lm-small">{e.how}</td>
                                    <td className="lm-small">{e.notes}</td>
                                </tr>
                            );
                        })}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={checkFor ? 6 : 5} className="lm-muted">
                                    No words match.{q && " Not in any list yet: if a lab needs it, it has to teach it first."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredLab && (filteredLab.avoided.length > 0 || filteredLab.findings.length > 0) && (
                <div className="lm-extra">
                    {filteredLab.avoided.length > 0 && (
                        <section>
                            <h4>Words {filteredLab.lab.level} avoids on purpose</h4>
                            <ul>
                                {filteredLab.avoided.map((a, i) => (
                                    <li key={i}>
                                        <b>{a.avoided}</b> → {a.instead}
                                        {a.why && <span className="lm-muted"> ({a.why})</span>}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                    {filteredLab.findings.length > 0 && (
                        <section>
                            <h4>Findings ({filteredLab.findings.length})</h4>
                            <ol>
                                {filteredLab.findings.map((f, i) => (
                                    <li key={i}>{f}</li>
                                ))}
                            </ol>
                        </section>
                    )}
                    <p className="lm-muted">
                        File: <code>{filteredLab.path}</code>
                    </p>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------

export function LabMapBoard() {
    const [open, setOpen] = useState(() => localStorage.getItem(OPEN_KEY) === "1");
    const [tab, setTab] = useState<Tab>("order");
    const [labFilter, setLabFilter] = useState("all");

    const toggle = () => {
        localStorage.setItem(OPEN_KEY, open ? "0" : "1");
        setOpen(!open);
    };

    return (
        <section className="lm-board">
            <button type="button" className="lm-board-head" onClick={toggle} aria-expanded={open}>
                <span className="lm-board-icon">
                    <Network size={22} />
                </span>
                <span className="lm-board-title">
                    <h2>Lab order &amp; vocabulary</h2>
                    <span className="lm-private">
                        <Lock size={13} /> Only you see this
                    </span>
                </span>
                <span className="lm-board-summary">
                    {LABS.length} labs · {ALL_VOCAB.length} words
                </span>
                <span className="lm-chevron" aria-hidden="true">
                    {open ? "▾" : "▸"}
                </span>
            </button>

            {open && (
                <div className="lm-board-body">
                    <div className="lm-tabs" role="tablist">
                        <button type="button" role="tab" aria-selected={tab === "order"} className={`lm-tab${tab === "order" ? " lm-tab--on" : ""}`} onClick={() => setTab("order")}>
                            <Network size={16} /> Lab order
                        </button>
                        <button type="button" role="tab" aria-selected={tab === "vocab"} className={`lm-tab${tab === "vocab" ? " lm-tab--on" : ""}`} onClick={() => setTab("vocab")}>
                            <BookOpen size={16} /> Vocabulary
                        </button>
                    </div>
                    {tab === "order" ? (
                        <LabOrderView
                            onShowWords={(id) => {
                                setLabFilter(id);
                                setTab("vocab");
                            }}
                        />
                    ) : (
                        <VocabView labFilter={labFilter} setLabFilter={setLabFilter} />
                    )}
                </div>
            )}
        </section>
    );
}
