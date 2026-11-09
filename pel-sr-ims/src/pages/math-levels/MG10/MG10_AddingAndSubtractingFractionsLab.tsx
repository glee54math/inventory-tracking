import { useCallback, useMemo, useRef, useState } from "react";
import "../shared/styles/lab-base.css";
import "./MG10_AddingAndSubtractingFractionsLab_styles.css";
import { units, type Unit } from "./AddingAndSubtractingFractionsLab/units";
import { moduleTest, moduleTestStars, MODULE_TEST_TOTAL } from "./AddingAndSubtractingFractionsLab/units/ModuleTest";
import { StepProblem } from "../shared/engine/StepProblem";
import { Segmented } from "../shared/engine/controls";
import { UnitTestView } from "../shared/engine/UnitTest";
import { UnitPreviewCarousel } from "../shared/components/UnitPreviewCarousel";
import { MathText, StackedFractions } from "../shared/components/MathText";
import { AnswerFormPick } from "../shared/components/AnswerForm";
import type { Problem } from "../shared/engine/types";
import { bagItems, debtItem, useRetryDebts, type BagItem, type RetryDebt } from "../shared/engine/retryDebt";
import { shuffle } from "../shared/lib/math";
import { MASTERY_GOAL, isMastered as sharedIsMastered, starCount as sharedStarCount, useModuleProgress, type UnitProgress } from "../../../hooks/useModuleProgress";
import { useStudentContext } from "../../../components/student_portal/StudentContext";

// Grade 5 (5.NF.1-2). MG6+ convention: no read-aloud, no EarlyLearnerProvider.
// UnitView DOES carry MK1's "Try one like it" retry lock (user requirement for
// this lab: an equal-but-not-simplest answer, or any other helped solve, must
// be followed by a clean solve of the SAME problem type before moving on).
// Every fraction is drawn stacked, the handwritten way (user requirement,
// round 3): the lab sits inside <StackedFractions>, and its own text goes
// through <MathText>. Scores read "8 out of 10", so no "a/b" is left on screen.
// Fraction answers start with "pick the kind of answer" buttons (Whole number /
// Mixed number / Proper fraction; user request, round 4): <AnswerFormPick>
// turns them on for every answer step, CFU mixed-number blank and Test.

const MODULE_ID = "MG10_AddingAndSubtractingFractionsLab";
// Synthetic progress key for the cross-unit module test — not a real unit id,
// but ProgressMap/recordTest are already generic over any string key (same
// convention as every other lab's own module test).
const MODULE_PROGRESS_KEY = "module";

// isMastered/starCount math itself lives in useModuleProgress.ts, shared
// across every lab — these are just thin per-lab wrappers.
function isMastered(unit: Unit, p?: UnitProgress): boolean {
  return sharedIsMastered(MASTERY_GOAL, unit.requiredBuckets, p);
}

function starCount(unit: Unit, p?: UnitProgress): number {
  return sharedStarCount(MASTERY_GOAL, unit.requiredBuckets, p);
}

function Stars({ unit, p, size = "sm" }: { unit: Unit; p?: UnitProgress; size?: "sm" | "lg" }) {
  const n = starCount(unit, p);
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
 *  component above — used for the module test's rating. */
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
          <h1>
            <MathText>1/2 + 1/3 = 5/6</MathText>
          </h1>
          <p>Add and subtract fractions with different denominators. Make same-size pieces, work with mixed numbers, and check that answers make sense.</p>
          {/* Soft prerequisite note only — no hard lock (no cross-lab
              prerequisite enforcement exists anywhere in this codebase). */}
          <p className="muted small prereq-note">
            This lab builds on <b>Introduction to Fractions</b> and <b>Fraction Operations</b>. You should know equivalent fractions, simplest form, and how to add same-size pieces.
          </p>
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
                  <span className="path-goal">
                    <MathText>{u.goal}</MathText>
                  </span>
                </span>
                <Stars unit={u} p={progress[u.id]} />
              </button>
            </li>
          ))}
        </ol>
        <p className="muted small">
          To fill in your stars, solve each kind of problem twice on your own. Use no wrong guesses and at most one hint. Write answers in simplest form. Only <b>All types</b> problems count.
        </p>
      </section>
      <section>
        <button className="path-card module-test-card" onClick={onModuleTest}>
          <span className="path-body">
            <span className="path-title">📝 Module Test</span>
            <span className="path-goal">25 questions, 5 from every unit in this lab.</span>
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
      Best test score: {p.testScore} out of {total}
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
  debt,
  onDebt,
}: {
  unit: Unit;
  progress?: UnitProgress;
  onSolved: (clean: boolean, bucket?: string) => void;
  onTest: (score: number) => void;
  onIntroDone: () => void;
  onNextUnit?: () => void;
  /** "Try one like it" still owed in this unit, kept by the lab so leaving the unit doesn't clear it. */
  debt: RetryDebt | null;
  onDebt: (debt: RetryDebt | null) => void;
}) {
  const [tab, setTab] = useState<"explore" | "practice" | "test">("explore");
  // A retry owed from an earlier visit reopens in the mode it was owed in.
  const [typeIdx, setTypeIdx] = useState<number | "mix">(() => (debt ? (debt.mix ? "mix" : debt.type) : "mix"));
  const [seed, setSeed] = useState(0);

  // A shuffle bag: every bucket gets one guaranteed turn (in shuffled order)
  // before any repeats. Resets when the mode (mix vs one type) changes.
  const bagRef = useRef<{ key: string; items: BagItem[] }>({ key: "", items: [] });
  // The generator behind the problem on screen, so "Try one like it" can draw the same kind again.
  const lastMakeRef = useRef<BagItem | null>(null);
  // A retry owed from an earlier visit: the first problem drawn is that same kind.
  const carriedRef = useRef<RetryDebt | null>(debt);
  // The last draw, so running this memo twice for the same draw (React
  // StrictMode does this in dev) returns the same problem instead of popping
  // a second one from the bag — which left lastMakeRef pointing at a
  // different problem type than the one on screen (MK1 bug).
  const drawRef = useRef<{ token: string; problem: Problem } | null>(null);

  const problem = useMemo(() => {
    const key = typeIdx === "mix" ? "mix" : String(typeIdx);
    const token = `${unit.id}|${key}|${seed}`;
    if (drawRef.current?.token === token) return drawRef.current.problem;
    if (bagRef.current.key !== key || bagRef.current.items.length === 0) {
      bagRef.current = { key, items: shuffle(bagItems(unit.problems, typeIdx)) };
    }
    const carried = carriedRef.current && debtItem(unit.problems, carriedRef.current);
    carriedRef.current = null;
    const item = carried || bagRef.current.items.pop()!;
    lastMakeRef.current = item;
    const made = item.make();
    drawRef.current = { token, problem: made };
    return made;
    // seed forces drawing a fresh problem from the bag
  }, [unit, typeIdx, seed]);

  const retrySame = useCallback(() => {
    if (lastMakeRef.current) bagRef.current.items.push(lastMakeRef.current);
    setSeed((s) => s + 1);
  }, []);

  // After a solve that wasn't clean (not simplest form, Show answer, a wrong
  // pick...), the student owes one problem of the same type solved on their
  // own. Until then "New problem" gives the same type, the type switch is
  // locked, and leaving Practice and coming back never brings back the
  // helped problem with empty boxes.
  const [owesRetry, setOwesRetry] = useState(!!debt);
  // The draw on screen once it is finished or helped, so it isn't shown again fresh.
  const usedTokenRef = useRef<string | null>(null);
  const handleHelped = useCallback(() => {
    setOwesRetry(true);
    usedTokenRef.current = drawRef.current?.token ?? null;
    const item = lastMakeRef.current;
    if (item) onDebt({ type: item.type, bucket: item.bucket, mix: typeIdx === "mix" });
  }, [onDebt, typeIdx]);
  const newProblem = () => (owesRetry ? retrySame() : setSeed((s) => s + 1));
  const openPractice = () => {
    if (tab !== "practice" && usedTokenRef.current !== null && usedTokenRef.current === drawRef.current?.token) {
      usedTokenRef.current = null;
      newProblem();
    }
    setTab("practice");
  };

  const mastered = isMastered(unit, progress);
  // Practice opens only after the student passes this unit's Check for
  // Understanding — for everyone, including students with practice history
  // (user requirement). No unit in this lab uses reintroEverySolved.
  const solvedSinceIntro = (progress?.solved ?? 0) - (progress?.introDoneAtSolved ?? 0);
  const introNeedsRefresh = !!unit.reintroEverySolved && !!progress?.introDone && solvedSinceIntro >= unit.reintroEverySolved;
  const introSatisfied = !unit.requiresIntro || (!!progress?.introDone && !introNeedsRefresh);

  // Once the Check for Understanding is passed, keep it open (with its
  // feedback) until the student leaves the Explore tab.
  const [cfuJustPassed, setCfuJustPassed] = useState(false);
  if (tab !== "explore" && cfuJustPassed) setCfuJustPassed(false);
  const handleIntroDone = useCallback(() => {
    setCfuJustPassed(true);
    onIntroDone();
  }, [onIntroDone]);

  return (
    <div className="unit">
      <header className="unit-head">
        <div>
          <h1>{unit.title}</h1>
          <p className="goal">
            <MathText>{unit.goal}</MathText>
          </p>
        </div>
        <div className="unit-stars">
          <Stars unit={unit} p={progress} size="lg" />
          <span className="small muted">{progress?.solved ?? 0} solved</span>
          <span className="small muted">Standard {unit.standard}</span>
          {unit.test && <TestBadge p={progress} passScore={unit.test.passScore} />}
        </div>
      </header>

      <aside className="key-idea">
        <MathText>{unit.keyIdea}</MathText>
      </aside>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "explore"} className={tab === "explore" ? "on" : ""} onClick={() => setTab("explore")}>
          Explore
        </button>
        <button role="tab" aria-selected={tab === "practice"} className={tab === "practice" ? "on" : ""} disabled={!introSatisfied} onClick={openPractice}>
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
          {introSatisfied && !cfuJustPassed ? <unit.Explore /> : <unit.Explore onIntroDone={handleIntroDone} />}
          <div className="panel-foot">
            {introSatisfied ? (
              <button className="btn primary" onClick={openPractice}>
                Try practice problems
              </button>
            ) : (
              <p className="muted small">Pass the Check for Understanding above to unlock practice problems.</p>
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
              disabled={owesRetry}
              options={[{ id: "mix", label: "All types" }, ...unit.problems.map((p, i) => ({ id: String(i), label: p.label }))]}
            />
            <button className="btn ghost" onClick={newProblem}>
              {owesRetry ? "Try one like it" : "New problem"}
            </button>
          </div>
          {owesRetry && <p className="muted small">Solve one like it on your own before you switch problem types.</p>}
          {typeIdx !== "mix" && (
            <p className="muted small">
              Practicing one type is good extra practice, but only <b>All types</b> problems count toward your stars.
            </p>
          )}
          <StepProblem
            key={`${unit.id}-${seed}-${String(typeIdx)}`}
            problem={problem}
            onComplete={(clean, bucket) => {
              usedTokenRef.current = drawRef.current?.token ?? null;
              if (clean) {
                setOwesRetry(false);
                onDebt(null);
              }
              onSolved(clean && typeIdx === "mix", bucket);
            }}
            onHelped={handleHelped}
            onNext={() => setSeed((s) => s + 1)}
            onRetrySame={retrySame}
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

function AddingAndSubtractingFractionsLab() {
  const { currentStudent } = useStudentContext();
  const { progress, record, recordTest, recordIntroDone, reset } = useModuleProgress(currentStudent?.id ?? null, currentStudent?.location ?? null, MODULE_ID);
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
  // "Try one like it" owed per unit. Kept here (and in sessionStorage), not in
  // UnitView, so switching units or reloading can't clear it.
  const { debts, setDebt, clearDebts } = useRetryDebts(`${MODULE_ID}:${currentStudent?.id ?? "guest"}`);
  const onDebt = useCallback((d: RetryDebt | null) => unit && setDebt(unit.id, d), [unit, setDebt]);

  return (
    <div className="asf-lab lab-base">
      <StackedFractions>
        <AnswerFormPick>
        <div className="app">
          <nav className="rail" aria-label="Units">
            <button className="brand" onClick={() => go(null)}>
              <span>Adding &amp; Subtracting Fractions</span>
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
                  clearDebts();
                  setConfirmReset(false);
                } else setConfirmReset(true);
              }}
              onBlur={() => setConfirmReset(false)}
            >
              {confirmReset ? "Tap again to clear all stars" : "Reset progress"}
            </button>
          </nav>
          <main className="main">
            {moduleTestOpen ? (
              <div className="unit">
                <header className="unit-head">
                  <div>
                    <h1>Module Test</h1>
                    <p className="goal">25 questions from every unit in this lab, 5 from each.</p>
                  </div>
                  <div className="unit-stars">
                    {progress[MODULE_PROGRESS_KEY]?.testScore !== undefined && (
                      <RatingStars n={moduleTestStars(progress[MODULE_PROGRESS_KEY].testScore)} size="lg" label="Module test rating" />
                    )}
                    <TestBadge p={progress[MODULE_PROGRESS_KEY]} passScore={moduleTest.passScore} total={MODULE_TEST_TOTAL} />
                  </div>
                </header>
                <button className="btn ghost module-test-back" onClick={() => go(null)}>
                  ← Back to Adding &amp; Subtracting Fractions
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
                debt={debts[unit.id] ?? null}
                onDebt={onDebt}
                onNextUnit={current !== null && current < units.length - 1 ? () => go(current + 1) : undefined}
              />
            ) : (
              <Home onPick={go} progress={progress} onModuleTest={openModuleTest} />
            )}
          </main>
        </div>
        </AnswerFormPick>
      </StackedFractions>
    </div>
  );
}

// Named export (used by levelSubsections.ts's componentExport, like every other
// skill in this project) alongside the default export.
export { AddingAndSubtractingFractionsLab };
export default AddingAndSubtractingFractionsLab;
