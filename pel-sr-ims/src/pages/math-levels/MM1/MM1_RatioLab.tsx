import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./MM1_RatioLab_styles.css";
import { units, type Unit } from "./units";
import { moduleTest, moduleTestStars, MODULE_TEST_TOTAL } from "./units/ModuleTest";
import { StepProblem } from "../shared/engine/StepProblem";
import { UnitTestView } from "../shared/engine/UnitTest";
import { UnitPreviewCarousel } from "../shared/components/UnitPreviewCarousel";
import { palette } from "../shared/lib/palette";
import { pick } from "../shared/lib/math";
import { MASTERY_GOAL, useModuleProgress, type UnitProgress } from "../../../hooks/useModuleProgress";
import { useStudentContext } from "../../../components/student_portal/StudentContext";

const MODULE_ID = "MM1_RatioLab";
// Synthetic progress key for the cross-unit module test — not a real unit id,
// but ProgressMap/recordTest are already generic over any string key (see
// moduleProgressTypes.ts's doc comment anticipating keys like "main").
const MODULE_PROGRESS_KEY = "module";

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

/** A plain n-of-max star rating, independent of the mastery-tracking Stars
 *  component above — used for the module test's letter-grade-style rating. */
function RatingStars({ n, max = 5, size = "sm", label }: { n: number; max?: number; size?: "sm" | "lg"; label: string }) {
  return (
    <span className={`stars ${size}`} aria-label={label}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < n ? "on" : ""} aria-hidden>
          ★
        </span>
      ))}
    </span>
  );
}

function Home({
  onPick,
  progress,
  onModuleTest,
}: {
  onPick: (i: number) => void;
  progress: Record<string, UnitProgress>;
  onModuleTest: () => void;
}) {
  const next = units.findIndex((u) => (progress[u.id]?.clean ?? 0) < MASTERY_GOAL);
  const moduleTestScore = progress[MODULE_PROGRESS_KEY]?.testScore;
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
      <section>
        <button className="path-card module-test-card" onClick={onModuleTest}>
          <span className="path-body">
            <span className="path-title">📝 Module Test</span>
            <span className="path-goal">20 cumulative questions, a few from every unit — no diagrams, no color hints, solved from the words alone.</span>
          </span>
          <span className="unit-stars">
            {moduleTestScore !== undefined && <RatingStars n={moduleTestStars(moduleTestScore)} label="Module test rating" />}
            <TestBadge p={progress[MODULE_PROGRESS_KEY]} passScore={moduleTest.passScore} total={MODULE_TEST_TOTAL} />
          </span>
        </button>
      </section>
    </div>
  );
}

function TestBadge({ p, passScore, total = 10 }: { p?: UnitProgress; passScore: number; total?: number }) {
  if (p?.testScore === undefined) return null;
  const passed = p.testScore >= passScore;
  return (
    <span className={`test-badge ${passed ? "pass" : "fail"}`} title="Your best score across all attempts">
      Best test score: {p.testScore}/{total}
      {passed ? " ✓" : ""}
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
  // reintroEverySolved (optional) adds periodic re-gating on top of that: once
  // the student has solved that many NEW problems since the last time they
  // passed the intro, the gate reappears even though introDone is already true.
  const solvedSinceIntro = (progress?.solved ?? 0) - (progress?.introDoneAtSolved ?? 0);
  const introNeedsRefresh = !!unit.reintroEverySolved && !!progress?.introDone && solvedSinceIntro >= unit.reintroEverySolved;
  const introSatisfied = !unit.requiresIntro || ((!!progress?.introDone || (progress?.solved ?? 0) > 0) && !introNeedsRefresh);

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
          <UnitTestView key={unit.id} test={unit.test!} onComplete={onTest} />
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
  const [moduleTestOpen, setModuleTestOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const go = useCallback((i: number | null) => {
    setModuleTestOpen(false);
    setCurrent(i);
    window.scrollTo({ top: 0 });
  }, []);
  const openModuleTest = useCallback(() => {
    setCurrent(null);
    setModuleTestOpen(true);
    window.scrollTo({ top: 0 });
  }, []);
  const unit = current === null ? null : units[current];
  const moduleTestScore = progress[MODULE_PROGRESS_KEY]?.testScore;
  const onSolved = useCallback((clean: boolean) => unit && record(unit.id, clean), [unit, record]);
  const onTest = useCallback((score: number) => unit && recordTest(unit.id, score), [unit, recordTest]);
  const onModuleTestComplete = useCallback((score: number) => recordTest(MODULE_PROGRESS_KEY, score), [recordTest]);
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
          <button className={`module-test-nav ${moduleTestOpen ? "on" : ""}`} aria-current={moduleTestOpen ? "page" : undefined} onClick={openModuleTest}>
            <span className="module-test-row">
              <span>📝 Module Test</span>
              {moduleTestScore !== undefined && moduleTestScore >= moduleTest.passScore && (
                <span className="module-test-check" aria-label="Completed">
                  ✓
                </span>
              )}
            </span>
            {moduleTestScore !== undefined && <RatingStars n={moduleTestStars(moduleTestScore)} label="Module test rating" />}
          </button>
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
          {moduleTestOpen ? (
            <div className="unit">
              <header className="unit-head">
                <div>
                  <h1>Module Test</h1>
                  <p className="goal">20 cumulative questions covering every unit in Ratio Lab — no diagrams, no color hints, solved from the words alone.</p>
                </div>
                <div className="unit-stars">
                  {progress[MODULE_PROGRESS_KEY]?.testScore !== undefined && (
                    <RatingStars n={moduleTestStars(progress[MODULE_PROGRESS_KEY].testScore)} size="lg" label="Module test rating" />
                  )}
                  <TestBadge p={progress[MODULE_PROGRESS_KEY]} passScore={moduleTest.passScore} total={MODULE_TEST_TOTAL} />
                </div>
              </header>
              <button className="btn ghost module-test-back" onClick={() => go(null)}>
                ← Back to Ratio Lab
              </button>
              <div className="panel">
                <UnitTestView test={moduleTest} onComplete={onModuleTestComplete} />
              </div>
            </div>
          ) : unit ? (
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
            <Home onPick={go} progress={progress} onModuleTest={openModuleTest} />
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
