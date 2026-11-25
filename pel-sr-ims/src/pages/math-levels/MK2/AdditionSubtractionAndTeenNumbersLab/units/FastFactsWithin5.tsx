import { useState } from "react";
import { SplitGroup, ZeroSpot, holdFor, splitGroupWidth, useWatch } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { fastFactsWithin5Test } from "./FastFactsWithin5Test";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";
import { HeldControls, WatchButton, readCheckRound, useCheckRound } from "./ExploreParts";
import { afterTry } from "./labHelp";
import { count, countList } from "./words";

const fingers = (n: number) => count(n, "finger", "fingers");

// ============================================================================
// CHECK FOR UNDERSTANDING: gates Practice, and comes back every 20 solves
// ============================================================================
// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// A fast fact is shown on its own; a wrong try brings the dots in. A re-check
// uses the second fixed set of numbers.

const LOOK = {
  add: { target: "u5-add", label: "Explore: add", say: "Look here. Count all the dots." },
  sub: { target: "u5-sub", label: "Explore: take away", say: "Look here. Some go away." },
  doubles: { target: "u5-doubles", label: "Explore: same two", say: "Look here. The two numbers are the same." },
  missing: { target: "u5-missing", label: "Explore: missing number", say: "Look here. How many more make 5?" },
};

const factCard = (text: string) => <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 1 }}>{text}</div>;

const SETS = [
  { add: [3, 1], sub: [5, 2], dbl: 2, miss: 1 },
  { add: [2, 3], sub: [4, 1], dbl: 1, miss: 4 },
] as const;

function FastFactsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const { round, finish } = useCheckRound("fastFacts", onComplete);
  const set = SETS[round];
  const [p, q] = set.add;
  const [s, t] = set.sub;
  const d = set.dbl;
  const m = set.miss;
  return (
    <CheckSequence
      onComplete={finish}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt={`${p} + ${q} = ☐`}
            answer={p + q}
            tone="a"
            picture={(mode) => (mode === "ask" ? factCard(`${p} + ${q} = ☐`) : <SplitGroup total={p + q} partA={p} toneA="a" toneB="b" countAlong={mode === "show" ? { from: p, base: p, items: q } : undefined} />)}
            nudge={`Look at the dots. ${p}, and ${q} more.`}
            showText={`Watch and listen: ${p}, then ${countList(p + 1, p + q)}.`}
            praise={`Yes! ${p} + ${q} = ${p + q}.`}
            look={LOOK.add}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt={`${s} − ${t} = ☐`}
            answer={s - t}
            tone="a"
            picture={(mode) => (mode === "ask" ? factCard(`${s} − ${t} = ☐`) : <SplitGroup total={s} partA={s - t} toneA="a" toneB="b" goneB countAlong={mode === "show" ? { items: s - t } : undefined} />)}
            nudge={`Look at the dots. ${t} ${t === 1 ? "goes" : "go"} away. Count the dots left.`}
            why={{ [s + t]: "Minus means take away. That makes fewer." }}
            showText={`${t} ${t === 1 ? "goes" : "go"} away. Count the dots left: ${countList(1, s - t)}.`}
            praise={`Yes! ${s} − ${t} = ${s - t}.`}
            look={LOOK.sub}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt={`${d} + ${d} = ☐`}
            answer={d + d}
            tone="a"
            picture={(mode) => (mode === "ask" ? factCard(`${d} + ${d} = ☐`) : <SplitGroup total={d + d} partA={d} toneA="a" toneB="b" countAlong={mode === "show" ? { items: d + d } : undefined} />)}
            nudge={`Look at the dots. ${d} and ${d}.`}
            showText={`Watch and listen: ${countList(1, d + d)}.`}
            praise={`Yes! ${d} + ${d} = ${d + d}. The two numbers are the same.`}
            look={LOOK.doubles}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt={`${m} + ☐ = 5`}
            answer={5 - m}
            tone="b"
            picture={(mode) => (mode === "ask" ? factCard(`${m} + ☐ = 5`) : <SplitGroup total={5} partA={m} toneA="a" toneB="b" countAlong={mode === "show" ? { from: m, items: 5 - m } : undefined} />)}
            nudge={`Look at the dots. 5 in all. ${m} ${m === 1 ? "is" : "are"} blue. Count the orange dots.`}
            why={{ [5 + m]: "5 is all of them. The missing number is less than 5." }}
            showText={`Watch and listen: the orange dots are ${countList(1, 5 - m)}.`}
            praise={`Yes! ${m} + ${5 - m} = 5.`}
            look={LOOK.missing}
            onComplete={done}
          />
        ),
      ]}
    />
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

type Mode = "add" | "sub" | "doubles" | "missing";

// Each mode opens on numbers that are not the answer to a Check that points to it.
const START: Record<Mode, { a: number; b: number }> = {
  add: { a: 1, b: 1 },
  sub: { a: 4, b: 3 },
  doubles: { a: 1, b: 1 },
  missing: { a: 3, b: 2 },
};
// The second Check set asks 1 + 1, so Add opens on 1 + 3 and Same two on 2 + 2 for that round.
const startFor = (m: Mode, round: 0 | 1) => (round === 1 && m === "add" ? { a: 1, b: 3 } : round === 1 && m === "doubles" ? { a: 2, b: 2 } : START[m]);
const SPOT_MODE: Record<string, Mode> = { "u5-add": "add", "u5-sub": "sub", "u5-doubles": "doubles", "u5-missing": "missing" };

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [round] = useState(() => readCheckRound("fastFacts"));
  const [mode, setMode] = useState<Mode>("add");
  const [a, setA] = useState(() => startFor("add", round).a);
  const [b, setB] = useState(() => startFor("add", round).b);

  const left = a - b;
  const missing = 5 - a;
  const items = mode === "add" ? a + b : mode === "sub" ? b + left : mode === "doubles" ? a + a : missing;
  const demo = useWatch(items, (t) => (mode === "sub" ? (t <= b ? (t === 1 ? "Take away." : null) : String(t - b)) : String(t)));
  const running = demo.playing || demo.tick > 0;

  const switchMode = (m: Mode) => {
    demo.clear();
    setMode(m);
    setA(startFor(m, round).a);
    setB(startFor(m, round).b);
  };
  useLookHereRequest((id) => {
    const m = SPOT_MODE[id];
    if (m && m !== mode) switchMode(m);
  });
  const changeA = (v: number) => {
    demo.clear();
    setA(v);
    setB((old) => Math.min(old, mode === "add" ? 5 - v : v));
  };
  const changeB = (v: number) => {
    demo.clear();
    setB(v);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented
          label="Pick one"
          value={mode}
          onChange={switchMode}
          options={[
            { id: "add", label: "Add" },
            { id: "sub", label: "Take away" },
            { id: "doubles", label: "Same two" },
            { id: "missing", label: "Missing number" },
          ]}
        />
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

      <WatchButton demo={demo} />

      <HeldControls held={demo.playing}>
        {mode === "add" && (
          <>
            <Stepper label="First" value={a} min={0} max={5} step={1} onChange={changeA} tone="a" />
            <Stepper label="Second" value={b} min={0} max={5 - a} step={1} onChange={changeB} tone="b" />
          </>
        )}
        {mode === "sub" && (
          <>
            <Stepper label="Start" value={a} min={1} max={5} step={1} onChange={changeA} tone="a" />
            <Stepper label="Take away" value={b} min={0} max={a} step={1} onChange={changeB} tone="b" />
          </>
        )}
        {mode === "doubles" && <Stepper label="Number" value={a} min={1} max={2} step={1} onChange={changeA} tone="a" />}
        {mode === "missing" && <Stepper label="Number" value={a} min={1} max={5} step={1} onChange={changeA} tone="a" />}
      </HeldControls>

      {mode === "add" && (
        <div {...lookHereSpot("u5-add")}>
          <SplitGroup total={a + b} partA={a} toneA="a" toneB="b" numbered={{ items: demo.tick }} />
          <ReadAloud as="p" className="feedback good">
            <span data-look-here-key>{a} + {b} = {a + b}.</span>
          </ReadAloud>
        </div>
      )}
      {mode === "sub" && (
        <div {...lookHereSpot("u5-sub")}>
          <SplitGroup total={a} partA={a} toneA="a" showDivider={false} goneCount={running ? Math.min(b, demo.tick) : b} numbered={{ items: Math.max(0, demo.tick - b) }} />
          <ReadAloud as="p" className="feedback good">
            <span data-look-here-key>{a} − {b} = {left}.</span>
          </ReadAloud>
        </div>
      )}
      {mode === "doubles" && (
        <div {...lookHereSpot("u5-doubles")}>
          <SplitGroup total={a + a} partA={a} toneA="a" toneB="b" numbered={{ items: demo.tick }} />
          <ReadAloud as="p" className="feedback good">
            <span data-look-here-key>{a} + {a} = {a + a}. The two numbers are the same.</span>
          </ReadAloud>
        </div>
      )}
      {mode === "missing" && (
        <div {...lookHereSpot("u5-missing")}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ flex: "0 1 260px", minWidth: 0 }}>
              <SplitGroup total={5} partA={a} toneA="a" toneB="b" numbered={{ from: a, items: demo.tick }} />
            </div>
            {missing === 0 && <ZeroSpot showZero />}
          </div>
          <ReadAloud as="p" className="feedback good">
            <span data-look-here-key>{a} + {missing} = 5.</span>
          </ReadAloud>
        </div>
      )}
      <ReadAloud as="p" className="muted small">
        Try to know it.
      </ReadAloud>
      {/* The Check waits until the demo has played once. */}
      {introActive && !demo.seen && (
        <ReadAloud as="p" className="muted small">
          Tap Watch first.
        </ReadAloud>
      )}
      {((introActive && demo.seen) || showCheck) && <FastFactsCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "additionWithin5" | "subtractionWithin5" | "doublesWithin5" | "missingAddendWithin5";
const BUCKETS: Bucket[] = ["additionWithin5", "subtractionWithin5", "doublesWithin5", "missingAddendWithin5"];

/** The step the picture is on: "Show me" draws its own step, never the next. */
const stepNow = (done: number, help: VisualHelp | undefined, last: number) => Math.min(help?.showMe ? help.step : done, last);

/** Dots with the dashed empty spot beside them, for a fact whose answer is 0. */
const withZeroSpot = (dots: React.ReactNode, showZero: boolean, dotCount = 0) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    {dots && <div style={{ flex: `0 1 ${splitGroupWidth(dotCount)}px`, minWidth: 0 }}>{dots}</div>}
    <ZeroSpot showZero={showZero} />
  </div>
);

/** The fact alone. Dots come in only after a wrong try or on Show me; a hint before a try only speaks. */
const addPicture = (text: string, a: number, b: number, step: number, help?: VisualHelp) => {
  if (!afterTry(help, step)) return factCard(text);
  if (a + b === 0) return withZeroSpot(null, !!help?.showMe);
  return <SplitGroup key={help?.showMe ? "show" : "dots"} total={a + b} partA={a} toneA="a" toneB="b" countAlong={help?.showMe ? { items: a + b } : undefined} />;
};

const subPicture = (text: string, start: number, b: number, step: number, help?: VisualHelp) => {
  if (!afterTry(help, step)) return factCard(text);
  const dots = <SplitGroup key={help?.showMe ? "show" : "dots"} total={start} partA={start - b} toneA="a" toneB="b" goneB showDivider={false} countAlong={help?.showMe && start > b ? { items: start - b } : undefined} />;
  return start === b ? withZeroSpot(dots, !!help?.showMe, start) : dots;
};

const missPicture = (text: string, a: number, sum: number, step: number, help?: VisualHelp) => {
  if (!afterTry(help, step)) return factCard(text);
  if (a === sum) return withZeroSpot(<SplitGroup total={sum} partA={a} toneA="a" toneB="b" />, !!help?.showMe, sum);
  return <SplitGroup key={help?.showMe ? "show" : "dots"} total={sum} partA={a} toneA="a" toneB="b" ringB={!help?.showMe} countAlong={help?.showMe ? { from: a, items: sum - a } : undefined} />;
};

function fastFactsProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "additionWithin5") {
    // "Same two" is decided first, so Yes and No are each right about half the time.
    const same = Math.random() < 0.5;
    const a = same ? randInt(0, 2) : randInt(0, 4);
    let b = same ? a : randInt(0, 5 - a);
    while (!same && b === a) b = randInt(0, 5 - a);
    const sum = a + b;
    const text = `${a} + ${b} = ☐`;
    return {
      title: "Fast fact",
      bucket,
      story: "Try to know it.",
      visual: (done, help) => {
        if (stepNow(done, help, 1) === 0) return addPicture(text, a, b, 0, help);
        // A missed "same?" pick shows the two numbers as two groups of dots.
        if (afterTry(help, 1)) return sum === 0 ? withZeroSpot(null, false) : <SplitGroup total={sum} partA={a} toneA="a" toneB="b" />;
        return factCard(`${a} + ${b} = ${sum}`);
      },
      steps: [
        {
          kind: "number",
          tone: "a",
          prompt: `${text}. What goes in the box?`,
          hint: sum === 0 ? "Are there any dots?" : a === 0 || b === 0 ? `Show ${fingers(sum)}. Add none.` : `Show ${fingers(a)}. Show ${b} more.`,
          showMe: sum === 0 ? "There are no dots. That is 0." : `Count the dots: ${countList(1, sum)}.`,
          showMeHoldMs: holdFor(sum),
          explain: `${a} + ${b} = ${sum}.`,
          answer: sum,
        },
        choice(
          { prompt: `Are ${a} and ${b} the same?`, hint: `Look at ${a} and ${b}.`, showMe: same ? `${a} and ${b} are the same.` : `${a} and ${b} are not the same.`, explain: same ? "Yes." : "No." },
          same ? "Yes" : "No",
          [same ? "No" : "Yes"]
        ),
      ],
      wrapUp: `${a} + ${b} = ${sum}.`,
    };
  }

  if (bucket === "subtractionWithin5") {
    const start = randInt(1, 5);
    const b = randInt(0, start);
    const diff = start - b;
    // A second fact of the same kind, not the same fact.
    let start2 = randInt(1, 5);
    let b2 = randInt(0, start2);
    while (start2 === start && b2 === b) {
      start2 = randInt(1, 5);
      b2 = randInt(0, start2);
    }
    const diff2 = start2 - b2;
    const step = (s: number, t: number, d: number) => ({
      kind: "number" as const,
      tone: "a" as const,
      prompt: `${s} − ${t} = ☐. What goes in the box?`,
      hint: t === 0 ? "None went away." : `Show ${fingers(s)}. Put ${t} down.`,
      showMe: d === 0 ? "They all went away. That is 0." : `Count the dots left: ${countList(1, d)}.`,
      showMeHoldMs: holdFor(d),
      explain: `${s} − ${t} = ${d}.`,
      answer: d,
    });
    return {
      title: "Fast fact",
      bucket,
      story: "Try to know it.",
      visual: (done, help) => {
        // Finished: the last fact, solved.
        if (done >= 2 && !help?.showMe) return factCard(`${start2} − ${b2} = ${diff2}`);
        const at = stepNow(done, help, 1);
        return at === 0 ? subPicture(`${start} − ${b} = ☐`, start, b, 0, help) : subPicture(`${start2} − ${b2} = ☐`, start2, b2, 1, help);
      },
      steps: [step(start, b, diff), step(start2, b2, diff2)],
      wrapUp: `${start} − ${b} = ${diff}. ${start2} − ${b2} = ${diff2}.`,
    };
  }

  if (bucket === "doublesWithin5") {
    const n = randInt(1, 2); // 3 + 3 is past 5, so only 1 + 1 and 2 + 2
    const sum = n + n;
    return {
      title: "Fast fact",
      bucket,
      story: "The two numbers are the same.",
      visual: (done, help) => {
        const at = stepNow(done, help, 1);
        if (at === 0) return addPicture(`${n} + ${n} = ☐`, n, n, 0, help);
        if (afterTry(help, 1) || done >= 2) return <SplitGroup key={help?.showMe ? "show" : "dots"} total={sum + 1} partA={sum} toneA="a" toneB="b" countAlong={help?.showMe ? { items: sum + 1 } : undefined} />;
        return factCard(`${n} + ${n} = ${sum}`);
      },
      steps: [
        { kind: "number", tone: "a", prompt: `${n} + ${n} = ☐. What goes in the box?`, hint: `Show ${fingers(n)}. Show ${n} more.`, showMe: `Count the dots: ${countList(1, sum)}.`, showMeHoldMs: holdFor(sum), explain: `${n} + ${n} = ${sum}.`, answer: sum },
        { kind: "number", tone: "a", prompt: `What is 1 more than ${sum}?`, hint: "Say the next number.", showMe: `Count: ${countList(1, sum + 1)}.`, showMeHoldMs: holdFor(sum + 1), explain: `${sum} + 1 = ${sum + 1}.`, answer: sum + 1 },
      ],
      wrapUp: `${n} + ${n} = ${sum}.`,
    };
  }

  // missingAddendWithin5: two facts with a box.
  const sum = randInt(1, 5);
  const a = randInt(0, sum);
  const missing = sum - a;
  let sum2 = randInt(1, 5);
  let a2 = randInt(0, sum2);
  while (sum2 === sum && a2 === a) {
    sum2 = randInt(1, 5);
    a2 = randInt(0, sum2);
  }
  const missing2 = sum2 - a2;
  const step = (x: number, s: number, m: number) => ({
    kind: "number" as const,
    tone: "b" as const,
    prompt: `${x} + ☐ = ${s}. What goes in the box?`,
    // A known part or missing part of 0 can't count on, so it gets the 0 line.
    hint: m === 0 || x === 0 ? `You have ${x}. Do you need more?` : `Start at ${x}. Count on to ${s} on your fingers.`,
    showMe: m === 0 ? "There are no orange dots. That is 0." : `Count the orange dots: ${countList(1, m)}.`,
    showMeHoldMs: holdFor(m),
    explain: `${x} + ${m} = ${s}.`,
    answer: m,
  });
  return {
    title: "Fast fact",
    bucket,
    story: "Try to know it.",
    visual: (done, help) => {
      // Finished: the last fact, solved.
      if (done >= 2 && !help?.showMe) return factCard(`${a2} + ${missing2} = ${sum2}`);
      const at = stepNow(done, help, 1);
      return at === 0 ? missPicture(`${a} + ☐ = ${sum}`, a, sum, 0, help) : missPicture(`${a2} + ☐ = ${sum2}`, a2, sum2, 1, help);
    },
    steps: [step(a, sum, missing), step(a2, sum2, missing2)],
    wrapUp: `${a} + ${missing} = ${sum}. ${a2} + ${missing2} = ${sum2}.`,
  };
}

export const fastFactsWithin5: Unit = {
  id: "fastFactsWithin5",
  title: "Fast Facts to 5",
  goal: "Know small facts fast.",
  standard: "K.OA.5",
  keyIdea: <p>Try to know it. Count if you need to.</p>,
  Explore,
  // The Check gates Practice and comes back every 20 solves: facts known by
  // heart can fade. A re-check uses its second set of numbers.
  requiresIntro: true,
  reintroEverySolved: 20,
  problems: [{ label: "Fast Facts", make: fastFactsProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: fastFactsWithin5Test,
};
