// Glossary.tsx
// Mr. Lee-only board on the All Levels page: "Glossary" of lab-building and review
// terms, with the levels that use each one. Data lives in glossaryData.ts; keep it
// up to date when features or terms change.
//
// PRIVACY: load only with React.lazy / import() from AllLevelsPage (Mr. Lee-only).

import { useMemo, useState } from "react";
import { BookMarked, Lock } from "lucide-react";
import { GLOSSARY, GLOSSARY_UPDATED, type GlossaryGroup } from "./glossaryData";
import "../admin-lab-map/LabMap.css";

const OPEN_KEY = "glossaryBoardOpen";

const GROUPS: GlossaryGroup[] = ["Lab parts", "Help for students", "Check for Understanding", "Stars and retries", "Voice and screen", "Review workflow"];

export function GlossaryBoard() {
    const [open, setOpen] = useState(() => localStorage.getItem(OPEN_KEY) === "1");
    const [query, setQuery] = useState("");
    const [group, setGroup] = useState<"all" | GlossaryGroup>("all");

    const toggle = () => {
        localStorage.setItem(OPEN_KEY, open ? "0" : "1");
        setOpen(!open);
    };

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        return GLOSSARY.filter((t) => group === "all" || t.group === group).filter((t) => {
            if (!q) return true;
            const hay = [t.term, ...(t.aka ?? []), t.meaning, t.studentSees ?? "", t.levels, t.code ?? ""].join(" ").toLowerCase();
            return hay.includes(q);
        });
    }, [query, group]);

    return (
        <section className="lm-board">
            <button type="button" className="lm-board-head" onClick={toggle} aria-expanded={open}>
                <span className="lm-board-icon">
                    <BookMarked size={22} />
                </span>
                <span className="lm-board-title">
                    <h2>Glossary</h2>
                    <span className="lm-private">
                        <Lock size={13} /> Only you see this
                    </span>
                </span>
                <span className="lm-board-summary">
                    {GLOSSARY.length} terms · checked {GLOSSARY_UPDATED}
                </span>
                <span className="lm-chevron" aria-hidden="true">
                    {open ? "▾" : "▸"}
                </span>
            </button>

            {open && (
                <div className="lm-board-body">
                    <p className="lm-note">
                        Terms used in lab reviews, rule proposals and code, with the levels that use each one today. Search also matches other names (for example "twin" or "CFU").
                    </p>
                    <div className="lm-controls">
                        <input className="lm-search" type="search" placeholder="Search terms…" value={query} onChange={(e) => setQuery(e.target.value)} />
                        <select value={group} onChange={(e) => setGroup(e.target.value as "all" | GlossaryGroup)}>
                            <option value="all">All groups</option>
                            {GROUPS.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                        <span className="lm-muted">{rows.length} shown</span>
                    </div>
                    <div className="lm-table-wrap">
                        <table className="lm-table">
                            <thead>
                                <tr>
                                    <th>Term</th>
                                    <th>What it means</th>
                                    <th>What the student sees</th>
                                    <th>Levels</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((t) => (
                                    <tr key={t.term}>
                                        <td>
                                            <span className="lm-word">{t.term}</span>
                                            {t.aka && <div className="lm-small">also: {t.aka.join(", ")}</div>}
                                            <div className="lm-small">{t.group}</div>
                                        </td>
                                        <td>
                                            {t.meaning}
                                            {t.code && (
                                                <div className="lm-small">
                                                    Code: <code>{t.code}</code>
                                                </div>
                                            )}
                                        </td>
                                        <td>{t.studentSees ?? <span className="lm-muted">Nothing (behind the scenes)</span>}</td>
                                        <td>{t.levels}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}
