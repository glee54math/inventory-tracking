// ReviewStatus.tsx
// Mr. Lee-only views of the lab review workflow (see labReviewData.ts):
//   - ReviewStatusBoard: the full board on the All Levels page.
//   - LevelReviewDot: a dot on each level chip (all labs reviewed / some / none).
//   - LabReviewBadge: a badge + step dots on each lab card on the level page.
//
// PRIVACY: load this module only with React.lazy / import() from AllLevelsPage or
// LevelFilesPage (both Mr. Lee-only routes). Don't import it from LevelsPage, a lab,
// or math-levels/shared — the student portal uses those.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, Lock } from "lucide-react";
import {
    LAB_REVIEW_STATUS,
    levelState,
    statusByKey,
    type LabReviewStatus,
    type PointerState,
    type ReviewState,
} from "./labReviewData";
import "./ReviewStatus.css";

const REVIEW_LABEL: Record<ReviewState, string> = {
    done: "Reviewed",
    partial: "Partial",
    "not-started": "Not reviewed",
};

const POINTER_LABEL: Record<PointerState, string> = {
    done: "Pointer done",
    pilot: "Pointer pilot",
    todo: "Pointer to do",
    na: "No CFU",
};

// The workflow in order (build-math-lab SKILL.md).
const STEPS = [
    { id: "built", short: "Build", name: "Initial build" },
    { id: "curriculum", short: "Curric.", name: "Curriculum check" },
    { id: "english", short: "English", name: "English check" },
    { id: "fixes", short: "Fixes", name: "Fixer" },
    { id: "summary", short: "Wrap-up", name: "Wrap-up (summary + rules)" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

/** 0 = not done; otherwise the round count (1 for the yes/no steps). */
function stepCount(s: LabReviewStatus, id: StepId): number {
    const v = s.steps[id];
    return typeof v === "boolean" ? (v ? 1 : 0) : v.rounds;
}

function StepTrack({ status, compact = false }: { status: LabReviewStatus; compact?: boolean }) {
    return (
        <ol className={`rs-steps${compact ? " rs-steps--compact" : ""}`}>
            {STEPS.map((step) => {
                const n = stepCount(status, step.id);
                const multi = step.id !== "built" && step.id !== "summary";
                const title = `${step.name}: ${n === 0 ? "not yet" : multi ? `${n} round${n === 1 ? "" : "s"}` : "done"}`;
                return (
                    <li key={step.id} className={`rs-step${n > 0 ? " rs-step--on" : ""}`} title={title} aria-label={title}>
                        {compact ? null : (
                            <>
                                {step.short}
                                {multi && n > 0 && <span className="rs-step-n">×{n}</span>}
                            </>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

function ReviewPill({ state, text }: { state: ReviewState; text?: string }) {
    const rounds = text?.match(/\((\d+) rounds?/)?.[1];
    return (
        <span className={`rs-pill rs-pill--${state}`}>
            {REVIEW_LABEL[state]}
            {rounds && ` · ${rounds} round${rounds === "1" ? "" : "s"}`}
        </span>
    );
}

function PointerPill({ state }: { state: PointerState }) {
    return <span className={`rs-pill rs-pointer--${state}`}>{POINTER_LABEL[state]}</span>;
}

// ---------------------------------------------------------------------------

type Filter = "all" | "not-started" | "partial" | "done" | "pointer";

const FILTERS: { id: Filter; label: string; test: (s: LabReviewStatus) => boolean }[] = [
    { id: "all", label: "All", test: () => true },
    { id: "not-started", label: "Not reviewed", test: (s) => s.review === "not-started" },
    { id: "partial", label: "Partial", test: (s) => s.review === "partial" },
    { id: "done", label: "Reviewed", test: (s) => s.review === "done" },
    { id: "pointer", label: "Needs pointer", test: (s) => s.pointer === "todo" || s.pointer === "pilot" },
];

const OPEN_KEY = "reviewStatusBoardOpen";

export function ReviewStatusBoard() {
    const [open, setOpen] = useState(() => localStorage.getItem(OPEN_KEY) !== "0");
    const [filter, setFilter] = useState<Filter>("all");

    const counts = useMemo(() => {
        const c = { done: 0, partial: 0, "not-started": 0, pointerDone: 0, pointerTotal: 0 };
        for (const s of LAB_REVIEW_STATUS) {
            c[s.review]++;
            if (s.pointer !== "na") c.pointerTotal++;
            if (s.pointer === "done") c.pointerDone++;
        }
        return c;
    }, []);

    const rows = LAB_REVIEW_STATUS.filter(FILTERS.find((f) => f.id === filter)!.test);
    const toggle = () => {
        localStorage.setItem(OPEN_KEY, open ? "0" : "1");
        setOpen(!open);
    };

    return (
        <section className="rs-board">
            <button type="button" className="rs-board-head" onClick={toggle} aria-expanded={open}>
                <span className="rs-board-icon">
                    <ClipboardCheck size={22} />
                </span>
                <span className="rs-board-title">
                    <h2>Lab review status</h2>
                    <span className="rs-private">
                        <Lock size={13} /> Only you see this
                    </span>
                </span>
                <span className="rs-board-summary">
                    {counts.done} of {LAB_REVIEW_STATUS.length} labs reviewed
                </span>
                <span className="rs-chevron" aria-hidden="true">
                    {open ? "▾" : "▸"}
                </span>
            </button>

            {open && (
                <div className="rs-board-body">
                    <div className="rs-stats">
                        <div className="rs-stat rs-stat--done">
                            <b>{counts.done}</b> Reviewed
                        </div>
                        <div className="rs-stat rs-stat--partial">
                            <b>{counts.partial}</b> Partial
                        </div>
                        <div className="rs-stat rs-stat--not-started">
                            <b>{counts["not-started"]}</b> Not reviewed
                        </div>
                        <div className="rs-stat rs-stat--pointer">
                            <b>
                                {counts.pointerDone}/{counts.pointerTotal}
                            </b>{" "}
                            CFU pointers
                        </div>
                    </div>

                    <p className="rs-legend">
                        Workflow: <b>Build</b> → <b>Curriculum check</b> + <b>English check</b> → <b>Fixes</b> (×rounds) →{" "}
                        <b>Wrap-up</b>. Filled steps have a report in <code>_planning/reviews/</code>; status and notes come from{" "}
                        <code>LAB_STATUS.md</code>.
                    </p>

                    <div className="rs-filters" role="group" aria-label="Filter labs">
                        {FILTERS.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                className={`rs-filter${filter === f.id ? " rs-filter--on" : ""}`}
                                aria-pressed={filter === f.id}
                                onClick={() => setFilter(f.id)}
                            >
                                {f.label}
                                <span className="rs-filter-n">{LAB_REVIEW_STATUS.filter(f.test).length}</span>
                            </button>
                        ))}
                    </div>

                    <div className="rs-table-wrap">
                        <table className="rs-table">
                            <thead>
                                <tr>
                                    <th>Lab</th>
                                    <th>Status</th>
                                    <th>Workflow steps</th>
                                    <th>CFU pointer</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((s) => (
                                    <tr key={s.key} className={`rs-row rs-row--${s.review}`}>
                                        <td>
                                            <Link to={`/levels/${s.level}/files`} className="rs-lab">
                                                <span className="rs-level">{s.level}</span>
                                                {s.label}
                                            </Link>
                                        </td>
                                        <td>
                                            <ReviewPill state={s.review} text={s.reviewText} />
                                        </td>
                                        <td>
                                            <StepTrack status={s} />
                                        </td>
                                        <td>
                                            <PointerPill state={s.pointer} />
                                        </td>
                                        <td className="rs-notes">{s.notes}</td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="rs-empty">
                                            No labs here.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}

// ---------------------------------------------------------------------------

/** Dot on an All Levels chip. Renders nothing for untracked levels (e.g. English). */
export function LevelReviewDot({ level }: { level: string }) {
    const ls = levelState(level);
    if (!ls) return null;
    const label = `${ls.done} of ${ls.total} lab${ls.total === 1 ? "" : "s"} reviewed`;
    return <span className={`rs-dot rs-dot--${ls.state}`} title={label} aria-label={label} role="img" />;
}

/** Badge row on a lab card on the level page. */
export function LabReviewBadge({ componentFile }: { componentFile: string }) {
    const s = statusByKey.get(componentFile);
    if (!s) return null;
    return (
        <div className="rs-card-badge" title={s.notes || undefined}>
            <ReviewPill state={s.review} text={s.reviewText} />
            <StepTrack status={s} compact />
            <PointerPill state={s.pointer} />
        </div>
    );
}
