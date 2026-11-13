import { useCallback, useMemo, useRef, useState } from "react";
import "../shared/styles/lab-base.css";
import "./MK3_MeasurementAndClassifyingLab_styles.css";
import { units, type Unit } from "./MeasurementAndClassifyingLab/units";
import { moduleTest, moduleTestStars, MODULE_TEST_TOTAL } from "./MeasurementAndClassifyingLab/units/ModuleTest";
import { StepProblem } from "../shared/engine/StepProblem";
import { Segmented } from "../shared/engine/controls";
import { UnitTestView } from "../shared/engine/UnitTest";
import { UnitPreviewCarousel } from "../shared/components/UnitPreviewCarousel";
import { MathText, StackedFractions } from "../shared/components/MathText";
import type { Problem } from "../shared/engine/types";
import { bagItems, debtItem, useRetryDebts, type BagItem, type RetryDebt } from "../shared/engine/retryDebt";
import { shuffle } from "../shared/lib/math";
import { MASTERY_GOAL, isMastered as sharedIsMastered, starCount as sharedStarCount, useModuleProgress, type UnitProgress } from "../../../hooks/useModuleProgress";
import { useStudentContext } from "../../../components/student_portal/StudentContext";
import { ReadAllButton, ReadAloud, SpeakButton, TtsProvider } from "../shared/tts/ReadAloud";
import { EarlyLearnerProvider } from "../shared/engine/audience";

const MODULE_ID = "MK3_MeasurementAndClassifyingLab";
// Synthetic progress key for the cross-unit module test — not a real unit id,
// but ProgressMap/recordTest are already generic over any string key (same
// convention as every other lab's own module test).
const MODULE_PROGRESS_KEY = "module";

// isMastered/starCount math itself lives in useModuleProgress.ts, shared
// across every lab — these are just thin per-lab wrappers so every other
// call site in this file can keep passing a `Unit` instead of its raw
// `requiredBuckets` array.
function isMastered(unit: Unit, p?: UnitProgress): boolean {
  return sharedIsMastered(MASTERY_GOAL, unit.requiredBuckets, p);
}

/** Whether the unit's end-of-unit test has been passed (at least once). */
function testPassed(unit: Unit, p?: UnitProgress): boolean {
  return !!unit.test && p?.testScore !== undefined && p.testScore >= unit.test.passScore;
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
          <h1>How long? How heavy? Which group?</h1>
          <ReadAloud as="p">Compare two objects to see which is longer or heavier, describe how you can tell, and sort a group of objects into categories you count and compare.</ReadAloud>
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
        <ReadAloud as="p" className="muted small">
          Solve each kind of problem 2 times by yourself to fill in your stars. Only Mixed problems count.
        </ReadAloud>
      </section>
      <section>
        <button className="path-card module-test-card" onClick={onModuleTest}>
          <span className="path-body">
            <span className="path-title">📝 Module Test</span>
            <span className="path-goal">{MODULE_TEST_TOTAL} cumulative questions, 5 from every unit in this lab.</span>
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
  const tabsRef = useRef<HTMLDivElement>(null);
  // A retry owed from an earlier visit reopens in the mode it was owed in.
  const [typeIdx, setTypeIdx] = useState<number | "mix">(() => (debt ? (debt.mix ? "mix" : debt.type) : "mix"));
  const [seed, setSeed] = useState(0);

  // A shuffle bag, not independent random draws per problem — every item in
  // the bag gets exactly one guaranteed turn (in shuffled order) before any
  // repeats. In "mix" mode the bag holds one slot per bucket (every unit in
  // this lab declares buckets), so a full cycle guarantees every required
  // bucket its own turn. Resets whenever the mode (mix vs a specific type)
  // changes, or naturally refills+reshuffles once exhausted.
  const bagRef = useRef<{ key: string; items: BagItem[] }>({ key: "", items: [] });
  // The generator behind the problem on screen, so "Try one like it" can draw the same kind again.
  const lastMakeRef = useRef<BagItem | null>(null);
  // A retry owed from an earlier visit: the first problem drawn is that same kind.
  const carriedRef = useRef<RetryDebt | null>(debt);
  // The last draw, so running this memo twice for the same draw (React
  // StrictMode does this in dev) returns the same problem instead of popping
  // a second one from the bag — which left lastMakeRef pointing at a
  // different problem type than the one on screen.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, typeIdx, seed]);

  const retrySame = useCallback(() => {
    if (lastMakeRef.current) bagRef.current.items.push(lastMakeRef.current);
    setSeed((s) => s + 1);
  }, []);

  // After help (Show me, a wrong pick...), the student owes one problem of the
  // same type solved on their own. Until then "New problem" gives the same
  // type, the type switch is locked, and leaving Practice and coming back
  // never brings back the helped problem with empty boxes.
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
  // Understanding (user requirement: the CFU gates Practice for everyone,
  // including students with practice history from before the check).
  // reintroEverySolved (optional) adds periodic re-checks on top of that.
  const solvedSinceIntro = (progress?.solved ?? 0) - (progress?.introDoneAtSolved ?? 0);
  const introNeedsRefresh = !!unit.reintroEverySolved && !!progress?.introDone && solvedSinceIntro >= unit.reintroEverySolved;
  const introSatisfied = !unit.requiresIntro || (!!progress?.introDone && !introNeedsRefresh);

  // Once the Check for Understanding is passed, keep it open (with its
  // feedback) until the student leaves the Explore tab, instead of letting
  // it vanish the moment the last answer is right.
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
          <ReadAloud as="p" className="goal">
            <MathText>{unit.goal}</MathText>
          </ReadAloud>
        </div>
        <div className="unit-stars">
          <Stars unit={unit} p={progress} size="lg" />
          <span className="small muted">{progress?.solved ?? 0} solved</span>
          <span className="small muted">Standard {unit.standard}</span>
          {unit.test && <TestBadge p={progress} passScore={unit.test.passScore} />}
        </div>
      </header>

      <ReadAloud as="aside" className="key-idea">
        <MathText>{unit.keyIdea}</MathText>
      </ReadAloud>

      <div className="tts-inline-row">
        <SpeakButton targets={() => [tabsRef.current]} label="Read the tab names" />
        <div className="tabs" role="tablist" ref={tabsRef}>
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
      </div>

      {tab === "explore" && (
        <div className="panel" role="tabpanel">
          <ReadAllButton />
          {introSatisfied && !cfuJustPassed ? <unit.Explore /> : <unit.Explore onIntroDone={handleIntroDone} />}
          <div className="panel-foot" data-readaloud-part>
            {introSatisfied ? (
              <button className="btn primary" onClick={openPractice}>
                Try practice problems
              </button>
            ) : (
              <ReadAloud as="p" className="muted small">Complete the activity above to unlock practice problems.</ReadAloud>
            )}
          </div>
        </div>
      )}

      {tab === "practice" && (
        <div className="panel" role="tabpanel">
          <ReadAllButton />
          <div className="practice-bar">
            <Segmented
              label="Problem type"
              value={typeIdx === "mix" ? "mix" : String(typeIdx)}
              onChange={(id) => setTypeIdx(id === "mix" ? "mix" : Number(id))}
              disabled={owesRetry}
              options={[{ id: "mix", label: "Mixed" }, ...unit.problems.map((p, i) => ({ id: String(i), label: p.label }))]}
            />
            <button className="btn ghost" onClick={newProblem}>
              {owesRetry ? "Try one like it" : "New problem"}
            </button>
          </div>
          {typeIdx !== "mix" && (
            <ReadAloud as="p" className="muted small">
              Practicing one type is great for extra reps, but only <b>Mixed</b> problems count toward your mastery stars.
            </ReadAloud>
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
          {mastered && (unit.test || onNextUnit) && (
            <ReadAloud className="mastered">
              {unit.test && !testPassed(unit, progress) ? (
                <>
                  <span>You've mastered {unit.title.toLowerCase()}. Take the test to finish this unit.</span>
                  <button className="btn primary" onClick={() => setTab("test")}>
                    Take the test
                  </button>
                </>
              ) : (
                <>
                  <span>
                    {unit.test && "🔥 "}You've mastered {unit.title.toLowerCase()}
                    {unit.test ? " and passed the test." : "."}
                  </span>
                  {onNextUnit && (
                    <button className="btn primary" onClick={onNextUnit}>
                      Go to the next unit
                    </button>
                  )}
                </>
              )}
            </ReadAloud>
          )}
        </div>
      )}

      {tab === "test" && unit.test && (
        <div className="panel" role="tabpanel">
          <ReadAllButton />
          <UnitTestView key={unit.id} test={unit.test!} onComplete={onTest} />
        </div>
      )}
    </div>
  );
}

function MeasurementAndClassifyingLab() {
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
  // "Try one like it" owed per unit. Kept here (and in sessionStorage), not in
  // UnitView, so switching units or reloading can't clear it.
  const { debts, setDebt, clearDebts } = useRetryDebts(`${MODULE_ID}:${currentStudent?.id ?? "guest"}`);
  const onDebt = useCallback((d: RetryDebt | null) => unit && setDebt(unit.id, d), [unit, setDebt]);

  return (
    <div className="mac-lab lab-base lab-early">
      <StackedFractions>
      <TtsProvider>
        <EarlyLearnerProvider>
          <div className="app">
            <nav className="rail" aria-label="Units">
              <button className="brand" onClick={() => go(null)}>
                <span>Measuring &amp; Classifying</span>
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
                {confirmReset ? "Click again to clear all stars" : "Reset progress"}
              </button>
            </nav>
            <main className="main">
              {moduleTestOpen ? (
                <div className="unit">
                  <header className="unit-head">
                    <div>
                      <h1>Module Test</h1>
                      <ReadAloud as="p" className="goal">{MODULE_TEST_TOTAL} cumulative questions covering every unit in Measuring &amp; Classifying — 5 from each.</ReadAloud>
                    </div>
                    <div className="unit-stars">
                      {progress[MODULE_PROGRESS_KEY]?.testScore !== undefined && (
                        <RatingStars n={moduleTestStars(progress[MODULE_PROGRESS_KEY].testScore)} size="lg" label="Module test rating" />
                      )}
                      <TestBadge p={progress[MODULE_PROGRESS_KEY]} passScore={moduleTest.passScore} total={MODULE_TEST_TOTAL} />
                    </div>
                  </header>
                  <button className="btn ghost module-test-back" onClick={() => go(null)}>
                    ← Back to Measuring &amp; Classifying
                  </button>
                  <div className="panel">
                    <ReadAllButton />
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
        </EarlyLearnerProvider>
      </TtsProvider>
      </StackedFractions>
    </div>
  );
}

// Named export (used by levelSubsections.ts's componentExport, like every other
// skill in this project) alongside the default export.
export { MeasurementAndClassifyingLab };
export default MeasurementAndClassifyingLab;
