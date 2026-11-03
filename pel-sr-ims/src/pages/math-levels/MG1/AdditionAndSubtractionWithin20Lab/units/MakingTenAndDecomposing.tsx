import { useEffect, useState, type ReactNode } from "react";
import { TenFrameGroup, PartPartWhole, EquationStrip, type BondPart, type Tone, type Blank, type EqToken } from "../diagrams";
import { makeTenBreakdown, subtractThroughTenBreakdown } from "../logic";
import { randInt } from "../../../shared/lib/math";
import { choice, pointing, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { makingTenAndDecomposingTest } from "./MakingTenAndDecomposingTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { TapSelect } from "../../../shared/components/TapSelect";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions. Targets the plan's named misconceptions:
// (1) decomposing the WRONG addend (always breaking apart the second number
// regardless of which is closer to ten), and (2) treating "making ten" as
// one memorized answer rather than a repeatable strategy — tested on an
// UNFAMILIAR fact to confirm it actually generalizes.

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Fixed width so the SVG bond keeps its size inside wrapping flex rows. */
function Bond({ whole, parts }: { whole: number | null; parts: [BondPart, BondPart] }) {
  return (
    <div style={{ width: 280, maxWidth: "100%" }}>
      <PartPartWhole whole={whole} parts={parts} />
    </div>
  );
}

/** A ten-frame with its number underneath — the picture first, the numeral as its name. */
function Frame({ value, tone, splitAt, tone2, highlightEmpty }: { value: number; tone: Tone; splitAt?: number; tone2?: Tone; highlightEmpty?: boolean }) {
  return (
    <div>
      <TenFrameGroup value={value} tone={tone} splitAt={splitAt} tone2={tone2} highlightEmpty={highlightEmpty} />
      <ReadAloud as="p" style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, margin: "4px 0 0" }}>{value}</ReadAloud>
    </div>
  );
}

const Sign = ({ children }: { children: string }) => <span style={{ fontSize: "1.9rem", fontWeight: 700 }}>{children}</span>;

const Equations = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>{children}</div>
);

const pictureRow = { gap: 24, alignItems: "center" } as const;

// ---- Fill-in bond: the student types the parts AND the number sentences ----

type BlankSpec = { answer: number; tone?: Tone; label: string };
type Tok = EqToken | BlankSpec;
const isSpec = (t: Tok): t is BlankSpec => typeof t === "object" && "answer" in t;

/**
 * A number bond plus number sentences where the student types the parts and
 * the numbers, not just picks from a list — so they turn the picture into the
 * math themselves. Done only when every box is right.
 */
function BondFill({
  whole,
  parts,
  equations,
  hint,
  done,
  onComplete,
}: {
  whole: number;
  parts: [BlankSpec & { tone: Tone }, BlankSpec & { tone: Tone }];
  equations: Tok[][];
  hint: string;
  done: string;
  onComplete?: () => void;
}) {
  const [vals, setVals] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  // Every box gets a stable id from its position: the two parts first, then the equations left to right.
  const specs: BlankSpec[] = [...parts, ...equations.flat().filter(isSpec)];
  const valueOf = (i: number) => vals[i] ?? "";
  const allFilled = specs.every((_, i) => valueOf(i) !== "");
  const ok = specs.every((s, i) => valueOf(i) !== "" && Number(valueOf(i)) === s.answer);
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  const blank = (s: BlankSpec): Blank => {
    const i = specs.indexOf(s);
    return {
      value: valueOf(i),
      label: s.label,
      status: checked ? (Number(valueOf(i)) === s.answer ? "good" : "bad") : undefined,
      onChange: (v) => {
        setVals((old) => ({ ...old, [i]: v }));
        setChecked(false);
      },
    };
  };

  return (
    <>
      <div className="control-row" style={{ gap: 32, alignItems: "center" }} data-readaloud-part>
        <Bond
          whole={whole}
          parts={[
            { value: null, tone: parts[0].tone, blank: blank(parts[0]) },
            { value: null, tone: parts[1].tone, blank: blank(parts[1]) },
          ]}
        />
        <Equations>
          {equations.map((row, r) => (
            <EquationStrip key={r} tokens={row.map((t) => (isSpec(t) ? { blank: blank(t), tone: t.tone } : t))} />
          ))}
        </Equations>
      </div>
      <div className="control-row" style={{ alignItems: "center" }} data-readaloud-part>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? `Correct! ${done}` : `Not quite. Fix the red boxes. ${hint}`}
        </ReadAloud>
      )}
    </>
  );
}

/** The core trap: the near-ten number is written SECOND, so "always break
 *  apart the second number" gives the wrong answer here. Picking the right
 *  number unlocks a fill-in bond where the student breaks 6 apart and solves. */
function WhichAddendQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "6";

  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>1.</b> For 6 + 9, which number should you break apart to make a ten?
      </p>
      <div className="control-row" style={pictureRow}>
        <Frame value={6} tone="a" />
        <Sign>+</Sign>
        <Frame value={9} tone="b" />
      </div>
      <div className="control-row" style={{ alignItems: "center" }}>
        <TapSelect value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="6">6 (the first number)</option>
          <option value="9">9 (the second number)</option>
        </TapSelect>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct! 9 is almost 10, so keep 9 whole. Now break apart 6 and solve:" : "Not quite. 9 is almost 10, so keep 9 whole. Try again!"}
        </ReadAloud>
      )}
      {checked && ok && (
        <BondFill
          whole={6}
          parts={[
            { answer: 1, tone: "c", label: "part of 6 that goes with 9" },
            { answer: 5, tone: "a", label: "part of 6 that is left over" },
          ]}
          equations={[
            [{ answer: 9, tone: "b", label: "number kept whole" }, "+", { answer: 1, tone: "c", label: "part that makes ten" }, "=", 10],
            [10, "+", { answer: 5, tone: "a", label: "part left over" }, "=", { answer: 15, label: "6 plus 9" }],
          ]}
          hint="9 needs 1 more to make 10."
          done="6 + 9 = 15"
          onComplete={onComplete}
        />
      )}
    </ReadAloud>
  );
}

/** Applying the strategy to an UNFAMILIAR fact — confirms it's a repeatable
 *  method, not a single memorized answer. */
function UnfamiliarFactQuestion({ onComplete }: { onComplete?: () => void }) {
  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>2.</b> Solve 8 + 6 by making a ten. Break apart 6.
      </p>
      <div className="control-row" style={pictureRow}>
        <Frame value={8} tone="a" />
        <Sign>+</Sign>
        <Frame value={6} tone="b" />
      </div>
      {/* 8 + 6 (not 7 + 6): 6 splits into two DIFFERENT parts (2 and 4), so it's
          clear which part makes the ten — 7 + 6 gave 3 and 3, which is ambiguous. */}
      <BondFill
        whole={6}
        parts={[
          { answer: 2, tone: "b", label: "part of 6 that goes with 8" },
          { answer: 4, tone: "c", label: "part of 6 that is left over" },
        ]}
        equations={[
          [{ answer: 8, tone: "a", label: "number kept whole" }, "+", { answer: 2, tone: "b", label: "part that makes ten" }, "=", 10],
          [10, "+", { answer: 4, tone: "c", label: "part left over" }, "=", { answer: 14, label: "8 plus 6" }],
        ]}
        hint="Count the empty boxes: 8 needs 2 more to make 10."
        done="8 + 6 = 14"
        onComplete={onComplete}
      />
    </ReadAloud>
  );
}

/** Conflation trap: is make-ten a repeatable strategy, or one memorized fact? */
function StrategyVsFactQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "true";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: make-ten is a strategy that works for ANY addition fact with a number close to ten — it's not just one answer
        to remember.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <TapSelect value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </TapSelect>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — it's a repeatable METHOD: find the gap to ten, split the other addend, add the two tens-friendly pieces. Works on any fact like this, not just the one you first learned it with."
            : "Not quite — make-ten is a repeatable strategy, not a single memorized fact. The same three steps (find the gap, split the other addend, add) work on every fact with a number close to ten."}
        </ReadAloud>
      )}
    </ReadAloud>
  );
}

/** Applying the SAME bridge-through-ten idea to subtraction. */
function SubtractionBridgeQuestion({ onComplete }: { onComplete?: () => void }) {
  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>4.</b> Solve 13 − 5 by landing on 10 first. Break apart 5.
      </p>
      <div className="control-row" style={pictureRow}>
        <Frame value={13} tone="c" />
      </div>
      <BondFill
        whole={5}
        parts={[
          { answer: 3, tone: "b", label: "part of 5 that lands on 10" },
          { answer: 2, tone: "a", label: "part of 5 still to take away" },
        ]}
        equations={[
          [{ answer: 13, tone: "c", label: "starting number" }, "−", { answer: 3, tone: "b", label: "part that lands on 10" }, "=", 10],
          [10, "−", { answer: 2, tone: "a", label: "part still to take away" }, "=", { answer: 8, label: "13 minus 5" }],
        ]}
        hint="13 is 3 more than 10. Take away 3 first."
        done="13 − 5 = 8"
        onComplete={onComplete}
      />
    </ReadAloud>
  );
}

function MakeTenCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ whichAddend: false, unfamiliar: false, strategy: false, subtraction: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <ReadAloud as="p" className="intro-gate-title">Check for understanding: let's make sure making ten makes sense before you try practice problems.</ReadAloud>
      <WhichAddendQuestion onComplete={mark("whichAddend")} />
      <UnfamiliarFactQuestion onComplete={mark("unfamiliar")} />
      <StrategyVsFactQuestion onComplete={mark("strategy")} />
      <SubtractionBridgeQuestion onComplete={mark("subtraction")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"add" | "subtract">("add");
  const [a, setA] = useState(9);
  const [b, setB] = useState(4);
  const [start, setStart] = useState(13);
  const [sub, setSub] = useState(5);

  const addBreak = makeTenBreakdown(a, b);
  const subBreak = subtractThroughTenBreakdown(start, sub);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented label="Operation" value={mode} onChange={setMode} options={[{ id: "add", label: "Making ten" }, { id: "subtract", label: "Bridging through ten" }]} />
        {!introActive && (
          <button
            type="button"
            className="btn ghost"
            style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined}
            onClick={() => setShowCheck((v) => !v)}
          >
            Check for Understanding
          </button>
        )}
      </div>
      {(introActive || showCheck) && <MakeTenCheckForUnderstanding onComplete={onIntroDone} />}

      {mode === "add" ? (
        <>
          <div className="control-row" data-readaloud-part>
            <Stepper label="Near-ten number" value={a} min={6} max={9} step={1} onChange={setA} tone="a" />
            <Stepper label="Other addend" value={b} min={2} max={9} step={1} onChange={setB} tone="b" />
          </div>
          <div className="control-row" style={pictureRow} data-readaloud-part>
            <Frame value={a} tone="a" />
            <Sign>+</Sign>
            <Frame value={b} tone="b" splitAt={addBreak.addToA} tone2="c" />
          </div>
          <div className="control-row" style={{ gap: 32, alignItems: "center" }} data-readaloud-part>
            <Bond whole={b} parts={[{ value: addBreak.addToA, tone: "b" }, { value: addBreak.remainder, tone: "c" }]} />
            <Equations>
              <EquationStrip tokens={[{ value: a, tone: "a" }, "+", { value: addBreak.addToA, tone: "b" }, "=", addBreak.ten]} />
              <EquationStrip tokens={[addBreak.ten, "+", { value: addBreak.remainder, tone: "c" }, "=", addBreak.total]} />
            </Equations>
          </div>
        </>
      ) : (
        <>
          <div className="control-row" data-readaloud-part>
            <Stepper label="Starting number" value={start} min={11} max={19} step={1} onChange={setStart} tone="c" />
            <Stepper label="Subtract" value={sub} min={2} max={9} step={1} onChange={setSub} tone="b" />
          </div>
          <Frame value={start} tone="c" splitAt={subBreak.ten} tone2="b" />
          <div className="control-row" style={{ gap: 32, alignItems: "center" }} data-readaloud-part>
            <Bond whole={sub} parts={[{ value: subBreak.toTen, tone: "b" }, { value: subBreak.remainder, tone: "a" }]} />
            <Equations>
              <EquationStrip tokens={[{ value: start, tone: "c" }, "−", { value: subBreak.toTen, tone: "b" }, "=", subBreak.ten]} />
              <EquationStrip tokens={[subBreak.ten, "−", { value: subBreak.remainder, tone: "a" }, "=", subBreak.total]} />
            </Equations>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "makeTenNearTen" | "makeTenLargerGap" | "subtractBridge" | "equivalentSum";
const BUCKETS: Bucket[] = ["makeTenNearTen", "makeTenLargerGap", "subtractBridge", "equivalentSum"];

function makeTenAdditionProblem(a: number, b: number, bucket: Bucket): Problem {
  const { gap, addToA, remainder, ten, total } = makeTenBreakdown(a, b);
  return {
    title: "Making ten",
    bucket,
    story: `Find ${a} + ${b} using make-ten.`,
    visual: (done: number, help?: VisualHelp) => (
      <div className="control-row" style={pictureRow} data-readaloud-part>
        {/* Help ladder: light up the empty boxes for "how many more to make 10?" */}
        <Frame value={a} tone="a" highlightEmpty={pointing(help, 0)} />
        <Sign>+</Sign>
        <Frame value={b} tone="b" splitAt={done >= 1 ? addToA : undefined} tone2="c" />
        <Bond whole={b} parts={[{ value: done >= 1 ? addToA : null, tone: "b" }, { value: done >= 2 ? remainder : null, tone: "c" }]} />
      </div>
    ),
    steps: [
      { kind: "number", prompt: `How many more do you need to add to ${a} to make 10?`, hint: "Count the empty boxes in the first ten-frame.", showMe: `${a} fills ${a} boxes. ${gap} boxes are empty.`, explain: `${a} + ${gap} = 10.`, answer: gap },
      { kind: "number", prompt: `If you take ${gap} from ${b} to help make ten, how many are left over?`, hint: `${b} − ${gap} = ?`, explain: `${b} − ${addToA} = ${remainder} left over.`, answer: remainder },
      { kind: "number", prompt: `So 10 + ${remainder} = ?`, hint: "Add the leftover onto the ten you just made.", explain: `10 + ${remainder} = ${total}, so ${a} + ${b} = ${total}.`, answer: total },
    ],
    wrapUp: `${a} + ${b} = ${total}, by making a ten first: ${a} + ${addToA} = ${ten}, then ${ten} + ${remainder} = ${total}.`,
  };
}

function subtractBridgeProblem(): Problem {
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 18);
    sub = randInt(2, 9);
  } while (start % 10 >= sub || start - sub < 0);
  const { toTen, remainder, ten, total } = subtractThroughTenBreakdown(start, sub);
  return {
    title: "Bridging through ten",
    bucket: "subtractBridge",
    story: `Find ${start} − ${sub} by bridging through ten.`,
    visual: (done: number, help?: VisualHelp) => (
      <div className="control-row" style={pictureRow} data-readaloud-part>
        {/* Help ladder: color the ones past 10 when the student is stuck on step 1. */}
        <Frame value={start} tone="c" splitAt={done >= 1 || pointing(help, 0) ? ten : undefined} tone2="b" />
        <Bond whole={sub} parts={[{ value: done >= 1 ? toTen : null, tone: "b" }, { value: done >= 2 ? remainder : null, tone: "a" }]} />
      </div>
    ),
    steps: [
      { kind: "number", prompt: `Subtract just enough from ${start} to land exactly on a ten. How much is that?`, hint: `How many ones are past 10 in ${start}?`, showMe: `${start} is 10 and ${toTen} more. Take away ${toTen} to land on 10.`, explain: `${start} − ${toTen} = ${ten}.`, answer: toTen },
      { kind: "number", prompt: `Now how much more do you still need to subtract (from ${sub} total)?`, hint: `${sub} − ${toTen} = ?`, explain: `${sub} − ${toTen} = ${remainder} left to subtract.`, answer: remainder },
      { kind: "number", prompt: `${ten} − ${remainder} = ?`, hint: "Finish subtracting the leftover from the ten.", explain: `${ten} − ${remainder} = ${total}, so ${start} − ${sub} = ${total}.`, answer: total },
    ],
    wrapUp: `${start} − ${sub} = ${total}, by bridging through ${ten}.`,
  };
}

function equivalentSumProblem(): Problem {
  let a1 = 0;
  let b1 = 0;
  let k = 0;
  let a2 = 0;
  let b2 = 0;
  do {
    a1 = randInt(2, 8);
    b1 = randInt(2, 9);
    k = [-3, -2, -1, 1, 2, 3][randInt(0, 5)];
    a2 = a1 + k;
    b2 = a1 + b1 - a2;
  } while (a2 < 1 || a2 > 9 || b2 < 1 || b2 > 9 || a1 + b1 > 18);
  const total = a1 + b1;
  const direction = k > 0 ? "more" : "less";
  const absK = Math.abs(k);
  return {
    title: "Same total, different split",
    bucket: "equivalentSum",
    story: `${a1} + ${b1} = ${a2} + ? — figure out the missing addend WITHOUT adding everything from scratch.`,
    // Two bonds, same whole: the parts change, the whole doesn't.
    visual: (done: number) => (
      <div className="control-row" style={pictureRow} data-readaloud-part>
        <Bond whole={total} parts={[{ value: a1, tone: "a" }, { value: b1, tone: "b" }]} />
        <Bond whole={total} parts={[{ value: a2, tone: "a" }, { value: done >= 2 ? b2 : null, tone: "b" }]} />
      </div>
    ),
    steps: [
      choice(
        {
          prompt: `${a2} is ${absK} ${direction} than ${a1}. For the sum to stay the same, what must happen to the OTHER addend?`,
          hint: "If one addend grows, the other has to shrink by the same amount to keep the total the same — and the other way around.",
          explain: `${a2} is ${absK} ${direction} than ${a1}, so the other addend must be ${absK} ${direction === "more" ? "less" : "more"} than ${b1}.`,
        },
        direction === "more" ? "It must decrease by the same amount" : "It must increase by the same amount",
        [direction === "more" ? "It must increase by the same amount" : "It must decrease by the same amount", "It stays exactly the same"]
      ),
      { kind: "number", prompt: `So what is the missing addend — ${a2} + ? = ${total}?`, hint: `${total} − ${a2} = ?`, explain: `${total} − ${a2} = ${b2}.`, answer: b2 },
      { kind: "number", prompt: `Check it: what is ${a2} + ${b2}?`, hint: "Add them up to confirm it matches the original total.", explain: `${a2} + ${b2} = ${total}, the same total as ${a1} + ${b1}.`, answer: total },
    ],
    wrapUp: `${a1} + ${b1} = ${a2} + ${b2} = ${total} — shifting ${absK} from one addend to the other never changes the total.`,
  };
}

function makeTenProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "makeTenNearTen") {
    const a = randInt(8, 9);
    const gap = 10 - a;
    const b = randInt(gap + 1, 9); // guarantees a genuine (nonzero-remainder) decomposition
    return makeTenAdditionProblem(a, b, bucket);
  }

  if (bucket === "makeTenLargerGap") {
    const a = randInt(6, 7);
    const gap = 10 - a;
    const b = randInt(gap + 1, 9);
    return makeTenAdditionProblem(a, b, bucket);
  }

  if (bucket === "subtractBridge") return subtractBridgeProblem();

  return equivalentSumProblem();
}

export const makingTenAndDecomposing: Unit = {
  id: "makingTenAndDecomposing",
  title: "Making Ten and Decomposing Numbers",
  goal: "Break numbers apart to make a ten first, then add on (or subtract) what's left.",
  standard: "1.OA.6",
  keyIdea: (
    <>
      <p>Keep the number closest to ten whole, and break apart the OTHER number — no matter which order the numbers are written in.</p>
      <p>Make-ten is a repeatable strategy (find the gap to ten, split the other number, add the pieces), not one fact to memorize — and the same bridge-through-ten idea works for subtraction too.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // A reasoning strategy to be re-derived each time, not a fact to memorize.
  problems: [{ label: "Making Ten", make: makeTenProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: makingTenAndDecomposingTest,
};
