import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./MM1_RatioLab_styles.css";
import { units, type Unit } from "./units";
import { StepProblem } from "../shared/engine/StepProblem";
import { UnitTestView } from "../shared/engine/UnitTest";
import { UnitPreviewCarousel } from "../shared/components/UnitPreviewCarousel";
import { palette } from "../shared/lib/palette";
import { pick } from "../shared/lib/math";
import { MASTERY_GOAL, useModuleProgress, type UnitProgress } from "../../../hooks/useModuleProgress";
import { useStudentContext } from "../../../components/student_portal/StudentContext";

const MODULE_ID = "MM1_RatioLab";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap";

/** Loads the Lexend web font once. Remove if your app already loads it. */
function useFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

function Stars({ p, size = "sm" }: { p?: UnitProgress; size?: "sm" | "lg" }) {
  const n = Math.min(MASTERY_GOAL, p?.clean ?? 0);
  return (
    <span className={`stars ${size}`} aria-label={`${n} of ${MASTERY_GOAL} mastery stars`}>
      {Array.from({ length: MASTERY_GOAL }, (_, i) => (
        <span key={i} className={i < n ? "on" : ""} aria-hidden>
          ★
        </span>
      ))}
    </span>
  );
}

function Home({ onPick, progress }: { onPick: (i: number) => void; progress: Record<string, UnitProgress> }) {
  const next = units.findIndex((u) => (progress[u.id]?.clean ?? 0) < MASTERY_GOAL);
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <h1>For every 2 wings, there is 1 beak.</h1>
          <p>
            That sentence is a <b>ratio</b>. Ratio Lab teaches you to see ratios, say them, and use them to solve problems — one step at a time.
          </p>
          <button className="btn primary big" onClick={() => onPick(next === -1 ? 0 : next)}>
            {next <= 0 ? "Start with ratio language" : `Continue: ${units[next].title}`}
          </button>
        </div>
        <div className="hero-art">
          <UnitPreviewCarousel units={units} onPick={onPick} />
        </div>
      </section>
      <section>
        <h2 className="section-title">Your path</h2>
        <ol className="path">
          {units.map((u, i) => (
            <li key={u.id}>
              <button className="path-card" onClick={() => onPick(i)}>
                <span className="path-num">{i + 1}</span>
                <span className="path-body">
                  <span className="path-title">{u.title}</span>
                  <span className="path-goal">{u.goal}</span>
                </span>
                <Stars p={progress[u.id]} />
              </button>
            </li>
          ))}
        </ol>
        <p className="muted small">Earn a star for each Mixed-mode problem you solve with at most one hint. Five stars = mastered.</p>
      </section>
    </div>
  );
}

function TestBadge({ p, passScore }: { p?: UnitProgress; passScore: number }) {
  if (p?.testScore === undefined) return null;
  const passed = p.testScore >= passScore;
  return (
    <span className={`test-badge ${passed ? "pass" : "fail"}`} title="Your best score across all attempts">
      Best test score: {p.testScore}/10{passed ? " ✓" : ""}
    </span>
  );
}

function UnitView({
  unit,
  progress,
  onSolved,
  onTest,
  onIntroDone,
  onNextUnit,
}: {
  unit: Unit;
  progress?: UnitProgress;
  onSolved: (clean: boolean) => void;
  onTest: (score: number) => void;
  onIntroDone: () => void;
  onNextUnit?: () => void;
}) {
  const [tab, setTab] = useState<"explore" | "practice" | "test">("explore");
  const [typeIdx, setTypeIdx] = useState<number | "mix">("mix");
  const [seed, setSeed] = useState(0);

  const problem = useMemo(() => {
    const t = typeIdx === "mix" ? pick(unit.problems) : unit.problems[typeIdx];
    return t.make();
    // seed forces a fresh problem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, typeIdx, seed]);

  const mastered = (progress?.clean ?? 0) >= MASTERY_GOAL;
  // Grandfather in anyone who already has practice history from before this unit
  // had a required intro — only ever gate a student who's never touched Practice.
  const introSatisfied = !unit.requiresIntro || !!progress?.introDone || (progress?.solved ?? 0) > 0;

  return (
    <div className="unit">
      <header className="unit-head">
        <div>
          <h1>{unit.title}</h1>
          <p className="goal">{unit.goal}</p>
        </div>
        <div className="unit-stars">
          <Stars p={progress} size="lg" />
          <span className="small muted">{progress?.solved ?? 0} solved</span>
          <span className="small muted">Standard {unit.standard}</span>
          {unit.test && <TestBadge p={progress} passScore={unit.test.passScore} />}
        </div>
      </header>

      <aside className="key-idea">{unit.keyIdea}</aside>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "explore"} className={tab === "explore" ? "on" : ""} onClick={() => setTab("explore")}>
          Explore
        </button>
        <button role="tab" aria-selected={tab === "practice"} className={tab === "practice" ? "on" : ""} disabled={!introSatisfied} onClick={() => setTab("practice")}>
          Practice
        </button>
        {unit.test && (
          <button role="tab" aria-selected={tab === "test"} className={tab === "test" ? "on" : ""} onClick={() => setTab("test")}>
            Test
          </button>
        )}
      </div>

      {tab === "explore" && (
        <div className="panel" role="tabpanel">
          {introSatisfied ? <unit.Explore /> : <unit.Explore onIntroDone={onIntroDone} />}
          <div className="panel-foot">
            {introSatisfied ? (
              <button className="btn primary" onClick={() => setTab("practice")}>
                Try practice problems
              </button>
            ) : (
              <p className="muted small">Complete the activity above to unlock practice problems.</p>
            )}
          </div>
        </div>
      )}

      {tab === "practice" && (
        <div className="panel" role="tabpanel">
          <div className="practice-bar">
            <div className="segmented" role="radiogroup" aria-label="Problem type">
              <button role="radio" aria-checked={typeIdx === "mix"} className={typeIdx === "mix" ? "on" : ""} onClick={() => setTypeIdx("mix")}>
                Mixed
              </button>
              {unit.problems.map((p, i) => (
                <button key={p.label} role="radio" aria-checked={typeIdx === i} className={typeIdx === i ? "on" : ""} onClick={() => setTypeIdx(i)}>
                  {p.label}
                </button>
              ))}
            </div>
            <button className="btn ghost" onClick={() => setSeed((s) => s + 1)}>
              New problem
            </button>
          </div>
          {typeIdx !== "mix" && (
            <p className="muted small">
              Practicing one type is great for extra reps, but only <b>Mixed</b> problems count toward your mastery stars.
            </p>
          )}
          <StepProblem key={`${unit.id}-${seed}-${String(typeIdx)}`} problem={problem} onComplete={(clean) => onSolved(clean && typeIdx === "mix")} onNext={() => setSeed((s) => s + 1)} />
          {mastered && onNextUnit && (
            <div className="mastered">
              <span>You've mastered {unit.title.toLowerCase()}.</span>
              <button className="btn primary" onClick={onNextUnit}>
                Go to the next unit
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "test" && unit.test && (
        <div className="panel" role="tabpanel">
          <UnitTestView key={unit.id} unit={unit} onComplete={onTest} />
        </div>
      )}
    </div>
  );
}

function RatioLab() {
  useFonts();
  const { currentStudent } = useStudentContext();
  const { progress, record, recordTest, recordIntroDone, reset } = useModuleProgress(
    currentStudent?.id ?? null,
    currentStudent?.location ?? null,
    MODULE_ID
  );
  const [current, setCurrent] = useState<number | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const go = useCallback((i: number | null) => {
    setCurrent(i);
    window.scrollTo({ top: 0 });
  }, []);
  const unit = current === null ? null : units[current];
  const onSolved = useCallback((clean: boolean) => unit && record(unit.id, clean), [unit, record]);
  const onTest = useCallback((score: number) => unit && recordTest(unit.id, score), [unit, recordTest]);
  const onIntroDone = useCallback(() => unit && recordIntroDone(unit.id), [unit, recordIntroDone]);

  return (
    <div className="ratio-lab">
      <div className="app">
        <nav className="rail" aria-label="Units">
          <button className="brand" onClick={() => go(null)}>
            <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden>
              <rect x="3" y="8" width="16" height="24" rx="4" style={{ fill: palette.a }} />
              <rect x="21" y="16" width="16" height="16" rx="4" style={{ fill: palette.b }} />
            </svg>
            <span>Ratio Lab</span>
          </button>
          <ol>
            {units.map((u, i) => (
              <li key={u.id}>
                <button className={current === i ? "on" : ""} aria-current={current === i ? "page" : undefined} onClick={() => go(i)}>
                  <span className="rail-num">{i + 1}</span>
                  <span className="rail-title">{u.title}</span>
                  <Stars p={progress[u.id]} />
                </button>
              </li>
            ))}
          </ol>
          <button
            className="reset"
            onClick={() => {
              if (confirmReset) {
                reset();
                setConfirmReset(false);
              } else setConfirmReset(true);
            }}
            onBlur={() => setConfirmReset(false)}
          >
            {confirmReset ? "Click again to clear all stars" : "Reset progress"}
          </button>
        </nav>
        <main className="main">
          {unit ? (
            <UnitView
              key={unit.id}
              unit={unit}
              progress={progress[unit.id]}
              onSolved={onSolved}
              onTest={onTest}
              onIntroDone={onIntroDone}
              onNextUnit={current !== null && current < units.length - 1 ? () => go(current + 1) : undefined}
            />
          ) : (
            <Home onPick={go} progress={progress} />
          )}
        </main>
      </div>
    </div>
  );
}

// Named export (used by levelSubsections.ts's componentExport, like every other skill
// in this project) alongside the default export. Same reasoning as MG6_BarModel.tsx /
// MG11_PowersOfTen.tsx — no separate "Demo" wrapper per MATH_TSX_STYLE_GUIDE.txt
// convention, since this IS the complete self-contained practice page already.
export { RatioLab };
export default RatioLab;
