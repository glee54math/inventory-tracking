import { useState } from "react";
import { NumberLine } from "../../../shared/diagrams";
import { TenFrameGroup } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, numberBlank, pointing, type Problem, type SentenceStep, type VisualHelp } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { countingOnAndBackTest } from "./CountingOnAndBackTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck, type CheckMode } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K–1 design (shared/components/KCheck.tsx): one short question at a time,
// a number line picture, typed answers on the number pad. Targets both
// named misconceptions: (1) re-counting from 1 instead of starting from the
// number you have (and from the bigger one), and (2) off-by-one in count-back.
// Each question has a "Look here" pointer after its 2nd wrong try; "show it"
// comes on the 3rd.

/** CFU "Look here" pointers: the Explore spot that teaches each question (shown after its 2nd miss). */
const LOOK = {
  start: { target: "cob-keep", label: "Explore: keep the number you have", say: "Look here. Start at the number you have." },
  many: { target: "cob-count", label: "Explore: count one more", say: "Look here. Count how many more." },
  bigger: { target: "cob-bigger", label: "Explore: start at the bigger number", say: "Look here. Start at the bigger number." },
  back: { target: "cob-back", label: "Explore: count one back", say: "Look here. Count back one at a time." },
  rule: { target: "cob-back-rule", label: "Explore: how many times to count back", say: "Look here. One hop for each one you take away." },
};

/** A 0-20 number line: two numbers marked, or a start with hops to `to`. */
const Line = ({ start, startTone = "a", to, mark }: { start?: number; startTone?: "a" | "c"; to?: number; mark?: [number, number] }) => (
  <NumberLine
    min={0}
    max={20}
    points={
      mark
        ? [
            { value: mark[1], label: String(mark[1]), tone: "b" },
            { value: mark[0], label: String(mark[0]), tone: "a" },
          ]
        : start !== undefined
          ? [{ value: start, label: "start", tone: startTone }]
          : []
    }
    hops={start !== undefined && to !== undefined && to !== start ? { from: start, to, tone: "a" } : undefined}
  />
);

/** Count from `start`: no hops at first, the first hop after a wrong try, every hop to `end` when shown. */
const hopPicture = (start: number, end: number, tone: "a" | "c") => (m: CheckMode) => (
  <Line start={start} startTone={tone} to={m === "ask" ? undefined : m === "wrong" ? start + Math.sign(end - start) : end} />
);

function CountingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="8 + 3. Count on. Where do you start?"
            answer={8}
            tone="a"
            picture={(m) => (m === "show" || m === "done" ? <Line start={8} /> : <Line mark={[8, 3]} />)}
            nudge="Don't start at 1. Count on."
            why={{ 1: "Don't start at 1. Count on.", 3: "Which number is bigger?" }}
            showText="Watch: start at the 8. Then count on."
            praise="Yes! Start at 8."
            look={LOOK.start}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="Count on 3 from 8. Where do you land?"
            answer={11}
            tone="a"
            picture={hopPicture(8, 11, "a")}
            nudge="Say one number for each hop. Say 3 numbers."
            why={{ 10: "Don't count the 8. Count on from it.", 12: "Say just 3 numbers." }}
            showText="Watch and listen: 9, 10, 11."
            praise="Yes! 9, 10, 11. You land on 11."
            look={LOOK.many}
            onComplete={done}
          />
        ),
        // Typed, not a two-button pick: one wrong tap on "3" would leave only the answer (C2-01).
        // 3 + 7, not 3 + 8: Q1 (still on screen) already answered 8 (C3-05). The small number comes first (the trap).
        (done) => (
          <TypeCheck
            n={3}
            prompt="3 + 7. Where do you start?"
            answer={7}
            tone="a"
            picture={(m) => (m === "show" || m === "done" ? <Line start={7} to={10} /> : <Line mark={[7, 3]} />)}
            nudge="Which number is bigger?"
            why={{ 3: "Which number is bigger?", 1: "Don't start at 1. Start at a number you have." }}
            showText="Watch: start at 7. Count on 3: 8, 9, 10."
            praise="Yes! Start at 7. It is bigger."
            look={LOOK.bigger}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="12 − 3. Count back 3 from 12. Where do you land?"
            answer={9}
            tone="a"
            picture={hopPicture(12, 9, "c")}
            nudge="Count back one at a time. Say 3 numbers."
            why={{ 10: "Don't say 12. Count back from it.", 8: "Say just 3 numbers.", 15: "Count back, not on." }}
            showText="Watch and listen: 11, 10, 9."
            praise="Yes! 11, 10, 9."
            look={LOOK.back}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={5}
            prompt="13 − 4. How many times do you count back?"
            picture={<Line start={13} startTone="c" />}
            showPicture={<Line start={13} startTone="c" to={9} />}
            options={[
              { id: "3", label: "3" },
              { id: "4", label: "4" },
              { id: "5", label: "5" },
            ]}
            answer="4"
            why={{ 3: "Hop back once for each one you take away.", 5: "Don't count the 13. Hop back from it." }}
            showText="Watch: one hop for each one you take away."
            praise="Yes! Take away 4. Count back 4 times."
            look={LOOK.rule}
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

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"on" | "back">("on");
  // Starts at 6, not the CFU's 8, so a "Look here" never shows a CFU answer.
  const [start, setStart] = useState(6);
  const [current, setCurrent] = useState(6);
  const [trail, setTrail] = useState<number[]>([6]);

  const resetTo = (n: number) => {
    setStart(n);
    setCurrent(n);
    setTrail([n]);
  };
  const countOnce = () => {
    // The button grays out at 0 and 20, so the count never leaves the line.
    const next = mode === "on" ? current + 1 : current - 1;
    setCurrent(next);
    setTrail((t) => [...t.slice(-5), next]);
  };
  // From start/current, not the trail: the trail only keeps the last few numbers.
  const countsSoFar = Math.abs(current - start);
  // A CFU "Look here" for a spot shown only in the other mode switches to that mode first.
  useLookHereRequest((id) => {
    const want = id === "cob-back" || id === "cob-back-rule" ? "back" : id === "cob-count" || id === "cob-bigger" ? "on" : null;
    if (want && want !== mode) {
      setMode(want);
      resetTo(start);
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented
          label="Direction"
          value={mode}
          onChange={(m) => {
            setMode(m);
            resetTo(start);
          }}
          options={[
            { id: "on", label: "Count on to add" },
            { id: "back", label: "Count back to take away" },
          ]}
        />
        <Stepper label="Start at" value={start} min={0} max={20} step={1} onChange={resetTo} tone="a" />
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

      {/* Keyed by mode: each mode's spot is its own element, so a lit spot never changes id. */}
      <div key={mode} {...lookHereSpot(mode === "on" ? "cob-count" : "cob-back")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="control-row" style={{ alignItems: "center" }} data-readaloud-part>
          <button className="btn primary" onClick={countOnce} disabled={mode === "on" ? current >= 20 : current <= 0}>
            {mode === "on" ? "Count one more" : "Count one back"}
          </button>
          <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {trail.map((n, i) => (
              <span
                key={i}
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: i === 0 ? "var(--grid)" : "var(--qa-soft)",
                  color: i === 0 ? "var(--ink)" : "var(--qa-text, var(--ink))",
                }}
              >
                {n}
              </span>
            ))}
          </span>
        </div>
        <ReadAloud as="p" className="muted small" style={{ margin: 0 }} data-look-here-key>
          {countsSoFar === 0
            ? `You are on ${start}. ${mode === "on" ? "Count one more." : "Count one back."}`
            : `You counted ${mode === "on" ? "on" : "back"} ${countsSoFar} ${countsSoFar === 1 ? "time" : "times"} from ${start}. Now you are on ${current}.`}
        </ReadAloud>
      </div>
      <ReadAloud as="p" className="muted small" {...lookHereSpot("cob-keep")}>
        <span data-look-here-key>You did not start over. You kept going from {start}.</span>
      </ReadAloud>
      {mode === "on" ? (
        <ReadAloud as="p" className="muted small" {...lookHereSpot("cob-bigger")}>
          <span data-look-here-key>Start at the bigger number. For 2 + 9, start at 9 and count on 2.</span>
        </ReadAloud>
      ) : (
        <ReadAloud as="p" className="muted small" {...lookHereSpot("cob-back-rule")}>
          {/* 5, not 4: CFU Q5's answer is 4, and a "Look here" never shows a CFU answer. */}
          <span data-look-here-key>To take away 5, count back 5 times. Say 5 numbers.</span>
        </ReadAloud>
      )}

      {/* Numbered hop arcs from the start: the standard counting-on/back model. */}
      <NumberLine
        min={0}
        max={20}
        points={[{ value: start, label: "start", tone: "c" }, ...(current !== start ? [{ value: current, label: "now", tone: "a" as const }] : [])]}
        hops={current !== start ? { from: start, to: current, tone: "a" } : undefined}
      />
      <TenFrameGroup value={current} tone="a" />
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <CountingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

/**
 * Help ladder: after a wrong try (or the hint) draw the first hop, to show HOW
 * to count; during "Show me" draw every hop to the answer. `targets` maps a
 * step index to the number that step lands on.
 */
function hopsFor(help: VisualHelp | undefined, from: number, targets: Partial<Record<number, number>>) {
  if (!help || !pointing(help, help.step)) return undefined;
  const to = targets[help.step];
  if (to === undefined || to === from) return undefined;
  return { from, to: help.showMe ? to : from + Math.sign(to - from), tone: "a" as const };
}

/** "9, 10, 11" — the numbers you say counting from `from` to `to`. */
const countWords = (from: number, to: number) => {
  const dir = to > from ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) }, (_, k) => from + (k + 1) * dir).join(", ");
};

/** About 1 second per number said, after a short lead-in (Show me pacing). */
const holdFor = (count: number) => 1000 + count * 1000;

/**
 * "Say the numbers: ☐, ☐, ☐" — one typed box per number said while counting
 * back from `start` to `end` (2 or more boxes). Typing exactly that many,
 * starting one below the start, is the off-by-one check.
 */
function sayNumbersStep(base: Omit<SentenceStep, "kind" | "parts" | "blanks" | "more">, start: number, end: number): SentenceStep {
  const nums = Array.from({ length: Math.abs(end - start) }, (_, k) => start + (k + 1) * Math.sign(end - start));
  const blanks = nums.map((n) => numberBlank(n));
  return {
    ...base,
    kind: "sentence",
    parts: ["", ", ", nums.length > 2 ? ", " : ""],
    blanks: [blanks[0], blanks[1]],
    more: blanks.slice(2).map((b, k) => ({ blank: b, after: k + 3 < nums.length ? ", " : "" })),
  };
}

type Bucket = "countOnLarger" | "countOnSmallFirst" | "countBackSmall" | "countBackCross";
const BUCKETS: Bucket[] = ["countOnLarger", "countOnSmallFirst", "countBackSmall", "countBackCross"];

/** A count-back problem: say each number counting back, then write the answer. */
function countBackProblem(bucket: Bucket, start: number, sub: number, title: string, story: string, wrapUp: string): Problem {
  const result = start - sub;
  return {
    title,
    bucket,
    story,
    // After the numbers are said, every hop stays drawn.
    visual: (done, help) => (
      <NumberLine min={0} max={20} points={[{ value: start, label: "start", tone: "c" }]} hops={done >= 1 ? { from: start, to: result, tone: "a" } : hopsFor(help, start, { 0: result, 1: result })} />
    ),
    steps: [
      sayNumbersStep(
        {
          prompt: `Count back ${sub} from ${start}. Say the numbers.`,
          hint: `Count back one at a time. Don't say ${start}.`,
          showMe: `Start at ${start}. Count back ${sub}: ${countWords(start, result)}.`,
          showMeHoldMs: holdFor(sub),
          explain: `${countWords(start, result)}. That is ${sub} numbers.`,
        },
        start,
        result
      ),
      {
        kind: "number",
        prompt: `So ${start} − ${sub} = ?`,
        hint: "Where did you stop?",
        showMe: `You said ${countWords(start, result)}. You stopped at ${result}.`,
        showMeHoldMs: holdFor(1),
        explain: `${start} − ${sub} = ${result}.`,
        answer: result,
      },
    ],
    wrapUp,
  };
}

function countingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "countOnLarger") {
    // The larger addend shown FIRST — the "easy" ordering, still requires
    // recognizing you start from it rather than from 1. Never equal numbers
    // (6 + 6 asked "6 or 6?").
    let a = 0;
    let b = 0;
    do {
      a = randInt(5, 17);
      b = randInt(1, 9);
    } while (a + b > 20 || a <= b);
    const total = a + b;
    return {
      title: "Counting on",
      bucket,
      story: `Find ${a} + ${b} by counting on.`,
      // Step 1 asks WHERE to start, so the "start" tag only appears once that's
      // answered (or shown) — before then both numbers are just marked.
      visual: (done, help) => (
        <NumberLine
          min={0}
          max={20}
          points={
            done >= 1
              ? [{ value: a, label: "start", tone: "a" }]
              : [
                  { value: b, label: String(b), tone: "b" },
                  { value: a, label: String(a), tone: "a" },
                ]
          }
          hops={hopsFor(help, a, { 1: a + 1, 2: total })}
        />
      ),
      steps: [
        choice({ prompt: `${a} + ${b}. Which number do you start at?`, hint: "Start at the bigger number.", explain: `Start at ${a}. It is bigger.` }, String(a), [String(b)]),
        { kind: "number", prompt: `Count on from ${a}. What do you say first?`, hint: "One more than the start.", explain: `${a} + 1 = ${a + 1}.`, answer: a + 1 },
        {
          kind: "number",
          prompt: `Count on ${b} from ${a}. Where do you land?`,
          hint: `Say ${b} ${b === 1 ? "number" : "numbers"} after ${a}.`,
          showMe: `Start at ${a}. Count on ${b}: ${countWords(a, total)}.`,
          showMeHoldMs: holdFor(b),
          explain: `${a} + ${b} = ${total}.`,
          answer: total,
        },
      ],
      wrapUp: `${a} + ${b} = ${total}, by counting on ${b} from ${a}.`,
    };
  }

  if (bucket === "countOnSmallFirst") {
    // The SMALLER addend shown first — tests whether the student defaults
    // to counting from the first number regardless of size.
    let big = 0;
    let small = 0;
    do {
      big = randInt(5, 17);
      small = randInt(1, 9);
    } while (big + small > 20 || small >= big);
    const total = big + small;
    return {
      title: "Counting on",
      bucket,
      story: `Find ${small} + ${big} by counting on.`,
      visual: (_done, help) => (
        <NumberLine
          min={0}
          max={20}
          points={[
            { value: small, label: String(small), tone: "b" },
            { value: big, label: String(big), tone: "a" },
          ]}
          hops={hopsFor(help, big, { 1: big + 1, 2: total })}
        />
      ),
      steps: [
        choice({ prompt: `${small} + ${big}. Which number do you start at?`, hint: "Start at the bigger number.", explain: `Start at ${big}. It is bigger. You count less.` }, String(big), [String(small)]),
        { kind: "number", prompt: `Count on from ${big}. What do you say first?`, hint: "One more than the bigger number.", explain: `${big} + 1 = ${big + 1}.`, answer: big + 1 },
        {
          kind: "number",
          prompt: `Count on ${small} from ${big}. Where do you land?`,
          hint: `Say ${small} ${small === 1 ? "number" : "numbers"} after ${big}.`,
          showMe: `Start at ${big}. Count on ${small}: ${countWords(big, total)}.`,
          showMeHoldMs: holdFor(small),
          explain: `${big} + ${small} = ${total}.`,
          answer: total,
        },
      ],
      wrapUp: `${small} + ${big} = ${total}. Starting at ${big} was faster.`,
    };
  }

  if (bucket === "countBackSmall") {
    // Count back WITHOUT crossing into a different "ten" — isolates the
    // mechanics from the extra decade-crossing difficulty of the other bucket.
    // At least 2 numbers to say, so the "say the numbers" boxes check the count.
    let start = 0;
    let sub = 0;
    do {
      start = randInt(4, 20);
      sub = randInt(2, 4);
    } while (start - sub < 0 || Math.floor(start / 10) !== Math.floor((start - sub) / 10));
    return countBackProblem(bucket, start, sub, "Counting back", `Find ${start} − ${sub} by counting back.`, `${start} − ${sub} = ${start - sub}, by counting back ${sub} from ${start}.`);
  }

  // countBackCross — the hard bucket: going from the teens to below 10
  // (e.g. 13 - 4 = 9).
  let start = 0;
  let sub = 0;
  do {
    start = randInt(11, 19);
    sub = randInt(2, 9);
  } while (start - sub < 0 || start - sub >= 10);
  return countBackProblem(bucket, start, sub, "Counting back", `Find ${start} − ${sub} by counting back. You will go below 10.`, `${start} − ${sub} = ${start - sub}. You went below 10.`);
}

export const countingOnAndBack: Unit = {
  id: "countingOnAndBack",
  title: "Counting On and Counting Back",
  goal: "Count on to add. Count back to take away.",
  standard: "1.OA.5",
  keyIdea: (
    <>
      <p>Start at the number you have. Then count on. Start at the bigger number.</p>
      <p>To take away 3, count back 3.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // No reintroEverySolved — this is a strategy to be reasoned through each
  // time, not a fact to memorize (contrast Unit 5's fluency buckets).
  problems: [{ label: "Counting On and Back", make: countingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: countingOnAndBackTest,
};
