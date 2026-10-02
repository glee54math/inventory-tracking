import { Fragment, useRef, useState } from "react";
import BarModelDiagram from "./MG6_BarModel_Diagram";
import EquationRow from "./MG6_BarModel_EquationRow";
import Feedback from "./MG6_BarModel_Feedback";
import TimesTableDrill from "./MG6_BarModel_TimesTableDrill";
import {
  checkPartA,
  checkPartB,
  makeProblem,
  opHint,
  solutionA,
  solutionB,
} from "./MG6_BarModel_problemLogic";
import { EMPTY_PART } from "./MG6_BarModel_types";
import type { Feedback as FeedbackT, Field, Level, PartValues, Problem } from "./MG6_BarModel_types";

const LEVELS: { level: Level; label: string }[] = [
  { level: 1, label: "Level 1: fewer" },
  { level: 2, label: "Level 2: fewer or more" },
  { level: 3, label: "Level 3: tricky wording" },
];

const BTN_PRIMARY =
  "rounded-lg border-2 border-slate-800 bg-slate-800 px-[18px] py-2 font-medium text-white disabled:cursor-default disabled:opacity-40 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900";
const BTN_GHOST =
  "rounded-lg border-2 border-slate-800 bg-transparent px-[18px] py-2 font-medium text-slate-800 disabled:cursor-default disabled:opacity-40 dark:border-slate-100 dark:text-slate-100";
const LEVEL_ON =
  "rounded-full border-2 border-slate-800 bg-slate-800 px-3.5 py-1.5 text-sm text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900";
const LEVEL_OFF =
  "rounded-full border-2 border-slate-300 bg-white px-3.5 py-1.5 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

// Graph-paper background kept inline: long gradient strings are awkward as arbitrary classes.
const GRID_BG = {
  backgroundImage:
    "linear-gradient(rgb(148 163 184 / 0.18) 1px, transparent 1px), linear-gradient(90deg, rgb(148 163 184 / 0.18) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

function Story({ text }: { text: string }) {
  return (
    <p className="mb-3.5 text-xl">
      {text.split(/(\d+)/).map((part, i) =>
        /^\d+$/.test(part) ? (
          <span key={i} className="font-bold">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </p>
  );
}

function BarModelPractice() {
  const [level, setLevel] = useState<Level>(1);
  const [problem, setProblem] = useState<Problem>(() => makeProblem(1));

  const [partA, setPartA] = useState<PartValues>(EMPTY_PART);
  const [partB, setPartB] = useState<PartValues>(EMPTY_PART);
  const [wrongA, setWrongA] = useState<Field[]>([]);
  const [wrongB, setWrongB] = useState<Field[]>([]);
  const [fbA, setFbA] = useState<FeedbackT | null>(null);
  const [fbB, setFbB] = useState<FeedbackT | null>(null);
  const [aDone, setADone] = useState(false);
  const [bDone, setBDone] = useState(false);
  const [firstTry, setFirstTry] = useState(true);

  const [solved, setSolved] = useState(0);
  const [streak, setStreak] = useState(0);

  const partBFirstInput = useRef<HTMLInputElement>(null);

  const startProblem = (lvl: Level) => {
    setProblem(makeProblem(lvl));
    setPartA(EMPTY_PART);
    setPartB(EMPTY_PART);
    setWrongA([]);
    setWrongB([]);
    setFbA(null);
    setFbB(null);
    setADone(false);
    setBDone(false);
    setFirstTry(true);
  };

  const unlockB = () => {
    setADone(true);
    // Wait for the disabled attribute to clear before focusing.
    requestAnimationFrame(() => partBFirstInput.current?.focus());
  };

  const handleCheckA = () => {
    if (aDone) return;
    const res = checkPartA(problem, partA);
    setWrongA(res.wrong);
    setFbA({ message: res.message, good: res.ok });
    if (res.ok) unlockB();
    else setFirstTry(false);
  };

  const handleCheckB = () => {
    if (!aDone || bDone) return;
    const res = checkPartB(problem, partB);
    setWrongB(res.wrong);
    if (!res.ok) {
      setFirstTry(false);
      setFbB({ message: res.message, good: false });
      return;
    }
    setBDone(true);
    setSolved((s) => s + 1);
    setStreak((s) => (firstTry ? s + 1 : 0));
    setFbB({
      message: firstTry
        ? `Perfect — ${problem.total} ${problem.item} altogether, first try!`
        : `Got it — ${problem.total} ${problem.item} altogether.`,
      good: true,
    });
  };

  const handleShowA = () => {
    if (aDone) return;
    setFirstTry(false);
    setPartA(solutionA(problem));
    setWrongA([]);
    setFbA({
      message: `${opHint(problem)} ${problem.n} ${problem.op} ${problem.d} = ${problem.bVal}.`,
      good: true,
    });
    unlockB();
  };

  const handleShowB = () => {
    if (!aDone || bDone) return;
    setFirstTry(false);
    setStreak(0);
    setPartB(solutionB(problem));
    setWrongB([]);
    setBDone(true);
    setFbB({
      message: `Put both bars together: ${problem.n} + ${problem.bVal} = ${problem.total}.`,
      good: true,
    });
  };

  const stage: 0 | 1 | 2 = bDone ? 2 : aDone ? 1 : 0;
  const { A, B, item } = problem;

  return (
    <div className="min-h-full bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100" style={GRID_BG}>
      <main className="mx-auto max-w-[760px] px-4 pb-12 pt-5 leading-normal">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="m-0 text-3xl font-bold leading-tight">
            Bar Model Practice
            <small className="mt-1 block text-base font-normal text-slate-500 dark:text-slate-400">
              Draw it, pick the operation, solve.
            </small>
          </h1>
          <div className="flex gap-4 text-[0.95rem]" aria-live="polite">
            <div>
              <b className="block text-2xl leading-none">{solved}</b>solved
            </div>
            <div>
              <b className="block text-2xl leading-none">{streak}</b>streak
            </div>
          </div>
        </header>

        <div className="mb-3.5 flex flex-wrap gap-1.5" role="group" aria-label="Level">
          {LEVELS.map(({ level: lvl, label }) => (
            <button
              key={lvl}
              type="button"
              aria-pressed={level === lvl}
              onClick={() => {
                setLevel(lvl);
                startProblem(lvl);
              }}
              className={level === lvl ? LEVEL_ON : LEVEL_OFF}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="rounded-2xl border-2 border-slate-300 bg-white px-5 py-[22px] dark:border-slate-600 dark:bg-slate-800">
          <Story text={problem.story} />
          <div className="w-full overflow-x-auto">
            <BarModelDiagram problem={problem} stage={stage} />
          </div>

          {/* Part a */}
          <div>
            <p className="mb-2 mt-[18px] text-[1.05rem] font-medium">
              a. How many {item} does {B} have?
            </p>
            <EquationRow
              values={partA}
              onChange={setPartA}
              wrong={wrongA}
              unit={item}
              sentencePrefix={`${B} has`}
              sentenceSuffix={`${item}.`}
              showOpHint
              disabled={aDone}
              onEnter={handleCheckA}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={handleCheckA} disabled={aDone} className={BTN_PRIMARY}>
                Check
              </button>
              <button type="button" onClick={handleShowA} disabled={aDone} className={BTN_GHOST}>
                Show me
              </button>
            </div>
            <Feedback feedback={fbA} />
          </div>

          {/* Part b */}
          <div className={aDone ? "" : "pointer-events-none opacity-40"} aria-disabled={!aDone}>
            <p className="mb-2 mt-[18px] text-[1.05rem] font-medium">
              b. How many {item} do {A} and {B} have altogether?
            </p>
            <EquationRow
              values={partB}
              onChange={setPartB}
              wrong={wrongB}
              unit={item}
              sentencePrefix={`${A} and ${B} have`}
              sentenceSuffix={`${item} altogether.`}
              disabled={!aDone || bDone}
              onEnter={handleCheckB}
              firstInputRef={partBFirstInput}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={handleCheckB} disabled={!aDone || bDone} className={BTN_PRIMARY}>
                Check
              </button>
              <button type="button" onClick={handleShowB} disabled={!aDone || bDone} className={BTN_GHOST}>
                Show me
              </button>
            </div>
            <Feedback feedback={fbB} />
          </div>

          <div className="mt-5 flex justify-end">
            <button type="button" onClick={() => startProblem(level)} className={BTN_PRIMARY}>
              New problem
            </button>
          </div>
        </section>

        <TimesTableDrill />
      </main>
    </div>
  );
}

// Named export (used by levelSubsections.ts's componentExport, like every other skill
// in this project) alongside the default export. This component has no separate "Demo"
// wrapper per MATH_TSX_STYLE_GUIDE.txt convention — it's a self-contained mini-app with
// its own level selector, Check/Show-me/New-problem controls, so there's nothing a demo
// wrapper would add. See VISUAL_COMPONENT_TODO.txt for why it's wired as a "standalone"
// skill instead of a "visual" one.
export { BarModelPractice };
export default BarModelPractice;
