import { useEffect, useState, type ReactNode } from "react";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";
import { PRIMES_TO_20 } from "../lib/numberTheory";

// ============================================================================
// Lab-local Check-for-Understanding building blocks. Every unit's CFU is a
// fixed (never randomized) list of these questions. Same idea as
// MG7/DivisionAndWordProblemsLab/units/cfu.tsx's FixedCFU (a second consumer
// of that shape — a shared/engine promotion candidate, but this build was
// scoped to its own lab folder), generalized to any number of blanks and
// mixed dropdown / typed-number blanks.
//
// Multi-box rule (every question with 2+ boxes): Check Answer stays disabled
// until every box is filled; after Check each box gets its OWN green/red
// border; feedback only shows once every box is filled. Changing any box
// clears the previous check, so nothing is ever graded live.
// ============================================================================

export type CfuBlank = { kind: "select"; choices: string[]; correct: string } | { kind: "number"; answer: number; width?: number };

export interface CfuChoice {
  kind: "choice";
  prompt: ReactNode;
  choices: string[];
  correct: string;
  right: ReactNode;
  wrong: ReactNode;
}

export interface CfuBlanks {
  kind: "blanks";
  /** Optional lead-in shown above the sentence. */
  prompt?: ReactNode;
  /** Text around the blanks: parts.length must be blanks.length + 1. */
  parts: ReactNode[];
  blanks: CfuBlank[];
  right: ReactNode;
  wrong: ReactNode;
}

export interface CfuPrimeGrid {
  kind: "primeGrid";
}

export type CfuQuestion = CfuChoice | CfuBlanks | CfuPrimeGrid;

const blankOk = (b: CfuBlank, v: string): boolean => (b.kind === "select" ? v === b.correct : v.trim() !== "" && Number(v.trim()) === b.answer);

function ChoiceBlock({ q, onDone }: { q: CfuChoice; onDone: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const done = picked === q.correct;
  useEffect(() => {
    if (done) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  return (
    <div>
      <div>{q.prompt}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start", marginTop: 8 }}>
        {q.choices.map((c) => (
          <button
            key={c}
            type="button"
            className="choice"
            disabled={done}
            onClick={() => setPicked(c)}
            style={picked === c ? { borderColor: c === q.correct ? "var(--good)" : "var(--bad)", background: c === q.correct ? "var(--good-soft)" : "var(--bad-soft)" } : undefined}
          >
            {c}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`feedback ${done ? "good" : "bad"}`} role="alert">
          {done ? q.right : q.wrong}
        </p>
      )}
    </div>
  );
}

function BlanksBlock({ q, onDone }: { q: CfuBlanks; onDone: () => void }) {
  const [vals, setVals] = useState<string[]>(() => q.blanks.map(() => ""));
  const [checked, setChecked] = useState(false);
  const filled = allFilled(...vals);
  const oks = q.blanks.map((b, i) => blankOk(b, vals[i]));
  const ok = oks.every(Boolean);
  const done = checked && filled && ok;
  useEffect(() => {
    if (done) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  const set = (i: number, v: string) => {
    setChecked(false);
    setVals((all) => all.map((x, k) => (k === i ? v : x)));
  };
  return (
    <div>
      {q.prompt && <div style={{ marginBottom: 6 }}>{q.prompt}</div>}
      <p style={{ lineHeight: 2.4 }}>
        {q.parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < q.blanks.length &&
              (() => {
                const b = q.blanks[i];
                if (b.kind === "select") {
                  return (
                    <select className="answer" aria-label={`blank ${i + 1}`} disabled={done} value={vals[i]} style={answerBorder(oks[i], checked)} onChange={(e) => set(i, e.target.value)}>
                      <option value="" disabled>
                        choose
                      </option>
                      {b.choices.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  );
                }
                return (
                  <input
                    className="answer"
                    aria-label={`blank ${i + 1}`}
                    inputMode="numeric"
                    autoComplete="off"
                    disabled={done}
                    value={vals[i]}
                    style={{ width: b.width ?? 64, ...answerBorder(oks[i], checked) }}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || /^\d+$/.test(v)) set(i, v);
                    }}
                  />
                );
              })()}
          </span>
        ))}
      </p>
      <div className="control-row">
        <button className="btn primary" type="button" disabled={!filled || done} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && filled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? q.right : q.wrong}
        </p>
      )}
    </div>
  );
}

/**
 * "Tap every prime from 1 to 20" — the one memorized fact in this lab. Used
 * in Prime or Composite's first-time CFU AND as its whole periodic re-check
 * (see PrimesRecallCheck), so the re-check never re-tests the general
 * prime/composite reasoning, only this short list.
 */
export function PrimeGridBlock({ onDone }: { onDone: () => void }) {
  const [sel, setSel] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const nums = Array.from({ length: 20 }, (_, i) => i + 1);
  const isP = (n: number) => PRIMES_TO_20.includes(n);
  const cellOk = (n: number) => sel.includes(n) === isP(n);
  const missed = PRIMES_TO_20.filter((p) => !sel.includes(p)).length;
  const extra = sel.filter((n) => !isP(n)).length;
  const ok = missed === 0 && extra === 0;
  const filled = sel.length > 0;
  const done = checked && ok;
  useEffect(() => {
    if (done) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  const toggle = (n: number) => {
    setChecked(false);
    setSel((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));
  };
  return (
    <div>
      <p>Tap every <b>prime</b> number from 1 to 20. Tap again to un-pick.</p>
      <div className="fmp-prime-grid" role="group" aria-label="Numbers 1 to 20">
        {nums.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={sel.includes(n)}
            disabled={done}
            className={sel.includes(n) ? "on" : ""}
            style={answerBorder(cellOk(n), checked)}
            onClick={() => toggle(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="control-row" style={{ marginTop: 10 }}>
        <button className="btn primary" type="button" disabled={!filled || done} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && filled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Yes — 2, 3, 5, 7, 11, 13, 17, 19. Eight primes. 1 is not prime, and 2 is the only even one."
            : `Not quite — ${missed > 0 ? `you missed ${missed} prime${missed === 1 ? "" : "s"}` : ""}${missed > 0 && extra > 0 ? " and " : ""}${extra > 0 ? `you picked ${extra} number${extra === 1 ? "" : "s"} that ${extra === 1 ? "isn't" : "aren't"} prime` : ""}. Red boxes need another look: a prime has exactly one factor pair, 1 × itself.`}
        </p>
      )}
    </div>
  );
}

/** A unit's full fixed CFU. `onComplete` fires once every question is right. */
export function FixedCheck({ title, questions, onComplete }: { title: ReactNode; questions: CfuQuestion[]; onComplete?: () => void }) {
  const [done, setDone] = useState<boolean[]>(() => questions.map(() => false));
  const allDone = done.every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);
  const mark = (i: number) => () => setDone((d) => (d[i] ? d : d.map((v, k) => (k === i ? true : v))));
  return (
    <div className="align-drill">
      <p className="intro-gate-title">{title}</p>
      {questions.map((q, i) => (
        <div key={i} className="fmp-cfu-q">
          <b>{i + 1}.</b>
          <div style={{ flex: 1 }}>
            {q.kind === "choice" ? <ChoiceBlock q={q} onDone={mark(i)} /> : q.kind === "blanks" ? <BlanksBlock q={q} onDone={mark(i)} /> : <PrimeGridBlock onDone={mark(i)} />}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Prime or Composite's periodic re-check: ONLY the primes-to-20 recall. */
export function PrimesRecallCheck({ onComplete }: { onComplete?: () => void }) {
  return (
    <div className="align-drill">
      <p className="intro-gate-title">Memory check: you've solved a lot of problems since you last listed the primes up to 20. Can you still list them?</p>
      <PrimeGridBlock onDone={() => onComplete?.()} />
    </div>
  );
}

/** The standard Explore toggle for opening the CFU again after it's passed. */
export function CfuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="btn ghost"
      style={{ width: "fit-content", ...(open ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
      onClick={onToggle}
    >
      Check for Understanding
    </button>
  );
}
