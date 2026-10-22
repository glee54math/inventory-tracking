import { useCallback, useMemo, useRef, useState } from "react";
import "../shared/styles/lab-base.css";
import "./MM1_NegativeNumbersLab_styles.css";
import { units, type Unit } from "./NegativeNumbersLab/units";
import { moduleTest, moduleTestStars, MODULE_TEST_TOTAL } from "./NegativeNumbersLab/units/ModuleTest";
import { StepProblem } from "../shared/engine/StepProblem";
import { Segmented } from "../shared/engine/controls";
import { UnitTestView } from "../shared/engine/UnitTest";
import { UnitPreviewCarousel } from "../shared/components/UnitPreviewCarousel";
import type { Problem } from "../shared/engine/types";
import { shuffle } from "../shared/lib/math";
import { MASTERY_GOAL, useModuleProgress, type UnitProgress } from "../../../hooks/useModuleProgress";
import { useStudentContext } from "../../../components/student_portal/StudentContext";

const MODULE_ID = "MM1_NegativeNumbersLab";
// Synthetic progress key for the cross-unit module test — not a real unit id,
// but ProgressMap/recordTest are already generic over any string key (same
// convention as MM1 Ratio Lab's own module test).
const MODULE_PROGRESS_KEY = "module";

/** A unit is mastered at MASTERY_GOAL clean solves — AND, for a unit that
 *  declares `requiredBuckets`, a clean solve covering every one of those
 *  scenario-classes at least once, not just MASTERY_GOAL solves from
 *  wherever random generation happened to land. Units without
 *  requiredBuckets behave exactly as before. */
function isMastered(unit: Unit, p?: UnitProgress): boolean {
  if ((p?.clean ?? 0) < MASTERY_GOAL) return false;
  if (!unit.requiredBuckets) return true;
  const covered = p?.coveredBuckets ?? [];
  return unit.requiredBuckets.every((b) => covered.includes(b));
}

function Stars({ unit, p, size = "sm" }: { unit: Unit; p?: UnitProgress; size?: "sm" | "lg" }) {
  // The last star only lights up at true mastery (bucket coverage included,
  // where that applies) — clean count alone fills at most MASTERY_GOAL - 1,
  // so "all stars lit" never overstates what's actually been proven.
  const n = isMastered(unit, p) ? MASTERY_GOAL : Math.min(MASTERY_GOAL - 1, p?.clean ?? 0);
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
  const next = units.findIndex((u) => !isMastered(u, progress[u.id]));
  const moduleTestScore = progress[MODULE_PROGRESS_KEY]?.testScore;
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <h1>−3 &gt; −7</h1>
          <p>Positive and negative numbers — real-world meaning, the number line, the coordinate plane, and comparing, ordering, and absolute value.</p>
          <button className="btn primary big" onClick={() => onPick(next === -1 ? 0 : next)}>
            {next <= 0 ? "Start exploring" : `Continue: ${units[next].title}`}
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
                <Stars unit={u} p={progress[u.id]} />
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
            <span className="path-goal">20 cumulative questions, 5 from every unit in this lab.</span>
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
  onSolved: (clean: boolean, bucket?: string) => void;
  onTest: (score: number) => void;
  onIntroDone: () => void;
  onNextUnit?: () => void;
}) {
  const [tab, setTab] = useState<"explore" | "practice" | "test">("explore");
  const [typeIdx, setTypeIdx] = useState<number | "mix">("mix");
  const [seed, setSeed] = useState(0);

  // A shuffle bag, not independent random draws per problem — every item in
  // the bag gets exactly one guaranteed turn (in shuffled order) before any
  // repeats, instead of relying on chance to eventually surface everything.
  // In "mix" mode the bag holds one slot per problem type, except a type
  // that declares `buckets` (every type in this lab does) expands into one
  // slot per bucket instead of a single slot for the whole type — so a full
  // cycle guarantees every required bucket its own turn. Selecting a single
  // type (not "mix") gets its own smaller bag of just that type's own
  // buckets. Resets whenever the mode (mix vs a specific type) changes, or
  // naturally refills+reshuffles once exhausted.
  const bagRef = useRef<{ key: string; items: Array<() => Problem> }>({ key: "", items: [] });

  const problem = useMemo(() => {
    const key = typeIdx === "mix" ? "mix" : String(typeIdx);
    if (bagRef.current.key !== key || bagRef.current.items.length === 0) {
      const types = typeIdx === "mix" ? unit.problems : [unit.problems[typeIdx]];
      const items = types.flatMap((pt) => (pt.buckets && pt.buckets.length > 0 ? pt.buckets.map((b) => () => pt.make(b)) : [() => pt.make()]));
      bagRef.current = { key, items: shuffle(items) };
    }
    const make = bagRef.current.items.pop()!;
    return make();
    // seed forces drawing a fresh problem from the bag
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, typeIdx, seed]);

  const mastered = isMastered(unit, progress);
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
          <Stars unit={unit} p={progress} size="lg" />
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
            <Segmented
              label="Problem type"
              value={typeIdx === "mix" ? "mix" : String(typeIdx)}
              onChange={(id) => setTypeIdx(id === "mix" ? "mix" : Number(id))}
              options={[{ id: "mix", label: "Mixed" }, ...unit.problems.map((p, i) => ({ id: String(i), label: p.label }))]}
            />
            <button className="btn ghost" onClick={() => setSeed((s) => s + 1)}>
              New problem
            </button>
          </div>
          {typeIdx !== "mix" && (
            <p className="muted small">
              Practicing one type is great for extra reps, but only <b>Mixed</b> problems count toward your mastery stars.
            </p>
          )}
          <StepProblem
            key={`${unit.id}-${seed}-${String(typeIdx)}`}
            problem={problem}
            onComplete={(clean, bucket) => onSolved(clean && typeIdx === "mix", bucket)}
            onNext={() => setSeed((s) => s + 1)}
          />
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

function NegativeNumbersLab() {
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
  const onSolved = useCallback((clean: boolean, bucket?: string) => unit && record(unit.id, clean, bucket), [unit, record]);
  const onTest = useCallback((score: number) => unit && recordTest(unit.id, score), [unit, recordTest]);
  const onModuleTestComplete = useCallback((score: number) => recordTest(MODULE_PROGRESS_KEY, score), [recordTest]);
  const onIntroDone = useCallback(() => unit && recordIntroDone(unit.id), [unit, recordIntroDone]);

  return (
    <div className="neg-lab lab-base">
      <div className="app">
        <nav className="rail" aria-label="Units">
          <button className="brand" onClick={() => go(null)}>
            <span>Negative Numbers</span>
          </button>
          <ol>
            {units.map((u, i) => (
              <li key={u.id}>
                <button className={current === i ? "on" : ""} aria-current={current === i ? "page" : undefined} onClick={() => go(i)}>
                  <span className="rail-num">{i + 1}</span>
                  <span className="rail-title">{u.title}</span>
                  <Stars unit={u} p={progress[u.id]} />
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
                  <p className="goal">20 cumulative questions covering every unit in Negative Numbers — 5 from each.</p>
                </div>
                <div className="unit-stars">
                  {progress[MODULE_PROGRESS_KEY]?.testScore !== undefined && (
                    <RatingStars n={moduleTestStars(progress[MODULE_PROGRESS_KEY].testScore)} size="lg" label="Module test rating" />
                  )}
                  <TestBadge p={progress[MODULE_PROGRESS_KEY]} passScore={moduleTest.passScore} total={MODULE_TEST_TOTAL} />
                </div>
              </header>
              <button className="btn ghost module-test-back" onClick={() => go(null)}>
                ← Back to Negative Numbers
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

// Named export (used by levelSubsections.ts's componentExport, like every other
// skill in this project) alongside the default export.
export { NegativeNumbersLab };
export default NegativeNumbersLab;
