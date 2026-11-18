import { useId, useState } from "react";
import { BaseTenBlocks, HundredChart, countAlongMs } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, pointing, type Problem, type Step, type VisualHelp } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { countingTo120Test } from "./CountingTo120Test";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { getState, sayText } from "../../../shared/tts/speechEngine";
import { CheckSequence, PickCheck, TypeCheck, type CheckMode } from "../../../shared/components/KCheck";
import { lookHereSpot } from "../../../shared/lib/lookHere";
import { countOnes, cubesW, holdFor, sticksW, tensW } from "./words";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K–1 design (shared/components/KCheck.tsx), review round 1: one short
// question at a time, a few rows of the chart as the picture, typed answers on
// the number pad (3 of 4 typed). Targets the count past 99 ("ninety-ten"),
// past 109, where 100 sits on the chart, and counting all the way to 120.
// Each question gets a "Look here" pointer after its 2nd wrong try; "show
// it" comes on the 3rd.

/** CFU "Look here" pointers: the Explore spot that teaches each question. */
const LOOK = {
  jump: { target: "u1-jump", label: "Explore: Jump to 99, then Next number", say: "Look here. Jump to 99. Then count on." },
  chart: { target: "u1-chart", label: "Explore: the chart", say: "Look here. Count on one box at a time." },
  // Review C2-37: "Which row is 100 in?" points where the student can count to 100 and see it.
  row: { target: "u1-jump", label: "Explore: Jump to 99, then Next number", say: "Look here. Jump to 99. Count to 100. See its row." },
};

/**
 * A few rows of the chart for a "what comes next" question: `lit` numbers
 * marked, nothing shown after the last one. A wrong try draws the hop to a
 * "?" box; "show" fills in the answer.
 */
const nextPicture = (min: number, max: number, lit: number[], answer: number) => (m: CheckMode) => {
  const last = lit[lit.length - 1];
  return (
    <HundredChart
      min={min}
      max={max}
      marks={[...lit.map((n) => ({ n, tone: "a" as const })), ...(m === "show" || m === "done" ? [{ n: answer, tone: "b" as const }] : [])]}
      upTo={m === "show" || m === "done" ? answer : last}
      hideAfter={m === "ask"}
      hop={m === "ask" || m === "done" ? undefined : { from: last, to: answer }}
      ask={m === "wrong" ? answer : undefined}
    />
  );
};

function CountingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="97, 98, 99. What comes next?"
            answer={100}
            picture={nextPicture(81, 100, [97, 98, 99], 100)}
            nudge="Count on one more from 99."
            why={{ 910: "That number is too big. Count on one.", 98: "Count on, not back." }}
            showText="Watch and listen: 98, 99, 100."
            praise="Yes! 100 comes after 99."
            look={LOOK.jump}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="What comes after 109?"
            answer={110}
            picture={nextPicture(101, 120, [109], 110)}
            nudge="Count on one more from 109."
            why={{ 200: "That number is too big. Count on one.", 101: "Count on from 109.", 108: "Count on, not back." }}
            showText="Watch and listen: 108, 109, 110."
            praise="Yes! 110 comes after 109."
            look={LOOK.chart}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={3}
            prompt="Which row is 100 in?"
            picture={<HundredChart min={81} max={110} />}
            showPicture={<HundredChart min={81} max={110} marks={[{ n: 91, tone: "a" }, { n: 100, tone: "b" }]} />}
            options={[
              { id: "81", label: "81 to 90" },
              { id: "91", label: "91 to 100" },
              { id: "101", label: "101 to 110" },
            ]}
            answer="91"
            why={{ 81: "Find 100. Look at its row.", 101: "That row starts after 100. Find 100." }}
            showText="Watch: 100 is at the end of this row."
            praise="Yes! 100 ends the row 91 to 100."
            look={LOOK.row}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="117, 118, 119. What comes next?"
            answer={120}
            picture={nextPicture(101, 120, [117, 118, 119], 120)}
            nudge="Count on one more from 119."
            why={{ 200: "That number is too big. Count on one.", 118: "Count on, not back." }}
            showText="Watch and listen: 118, 119, 120."
            praise="Yes! 120 comes after 119."
            look={LOOK.chart}
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

/**
 * "How many?" past 100 (1.NBT.1, user decision 2026-11-17): 10-12 sticks and
 * some cubes. The first 10 sticks sit in one big group. "Count them" counts
 * the sticks by tens (10 … 100, 110) and then the cubes (111, 112 …), one a
 * second, each number said. Default 114 is not a CFU answer (100, 110, 120).
 */
function HowManySticks() {
  const [sticks, setSticks] = useState(11);
  const [cubes, setCubes] = useState(4);
  const [phase, setPhase] = useState<"idle" | "count" | "done">("idle");
  const [run, setRun] = useState(0);
  const voiceId = useId();
  const n = sticks * 10 + cubes;
  const sayIt = (text: string) => {
    if (getState().autoRead) sayText(voiceId, text);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="control-row" style={{ alignItems: "center" }} data-readaloud-part>
        <Stepper
          label="Sticks"
          value={sticks}
          min={10}
          max={12}
          step={1}
          onChange={(v) => {
            setSticks(v);
            if (v === 12) setCubes(0); // 12 sticks is 120: no room for cubes
            setPhase("idle");
          }}
          tone="a"
        />
        <Stepper
          label="Cubes"
          value={cubes}
          min={0}
          max={sticks === 12 ? 0 : 9}
          step={1}
          onChange={(v) => {
            setCubes(v);
            setPhase("idle");
          }}
          tone="b"
        />
        <button
          className="btn primary"
          disabled={phase === "count"}
          onClick={() => {
            setRun((r) => r + 1);
            setPhase("count");
          }}
        >
          Count them
        </button>
        {phase === "done" && <span style={{ fontWeight: 800, fontSize: 28 }}>{n}</span>}
      </div>
      <BaseTenBlocks
        key={run}
        tens={sticks}
        ones={cubes}
        tenTone="a"
        oneTone="b"
        labels={phase === "idle" ? undefined : { tens: "value", ones: "total" }}
        countAlong={phase === "count"}
        onCount={(k) => sayIt(String(k <= sticks ? k * 10 : sticks * 10 + (k - sticks)))}
        onAnimDone={() => setPhase((p) => (p === "count" ? "done" : p))}
      />
      <ReadAloud as="p" className="muted small" style={{ margin: 0 }}>
        A stick is 10. A cube is 1. 10 sticks make 100. Then count on.
      </ReadAloud>
    </div>
  );
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [start, setStart] = useState(1);
  const [current, setCurrent] = useState(1);
  const voiceId = useId();

  const resetTo = (n: number) => {
    setStart(n);
    setCurrent(n);
  };
  // "Next number" says the new number with the lab voice (review C1-10). When
  // a banner appears it says the number itself (it reads aloud as an alert).
  // Review E2-43: say what was made ("30! 3 tens!"), not "New ten!", which
  // sounded like a new row starts at 30 (it ends the row).
  const banner = (n: number) =>
    n === 120 ? "120! You did it!" : n === 100 || n === 110 ? `${n}! Keep counting!` : n % 10 === 0 ? `${n}! ${tensW(n / 10)}!` : null;
  const sayNext = () => {
    if (current >= 120) return;
    const next = current + 1;
    setCurrent(next);
    if (!banner(next) && getState().autoRead) sayText(voiceId, String(next));
  };
  const shownBanner = current > start ? banner(current) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Stepper label="Start at" value={start} min={1} max={119} step={1} onChange={resetTo} tone="a" />
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

      <div {...lookHereSpot("u1-jump")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="control-row" style={{ alignItems: "center" }} data-readaloud-part>
          <button className="btn primary" onClick={sayNext} disabled={current >= 120}>
            Next number
          </button>
          <button className="btn ghost" onClick={() => resetTo(99)}>
            Jump to 99
          </button>
          <span style={{ fontWeight: 800, fontSize: 28 }}>{current}</span>
        </div>
        <ReadAloud as="p" className="muted small" style={{ margin: 0 }}>
          <span data-look-here-key>Tap Jump to 99. Then tap Next number.</span>
        </ReadAloud>
      </div>
      {shownBanner && (
        <ReadAloud as="p" className="feedback good" role="alert" autoPlayKey={`${current}`}>
          {shownBanner}
        </ReadAloud>
      )}

      <div {...lookHereSpot("u1-chart")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <HundredChart marks={[{ n: start, tone: "a" }, { n: current, tone: current === start ? "a" : "b" }]} upTo={current} />
        <ReadAloud as="p" className="muted small" style={{ margin: 0 }}>
          Each row has ten numbers. <span data-look-here-key>Counting on moves one box right.</span> At the end of a row, go to the next row. Keep
          going past 100.
        </ReadAloud>
      </div>

      <HowManySticks />
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <CountingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "startFrom1" | "startMid" | "crossDecade" | "cross100" | "range100to120" | "sticksPast100";
const BUCKETS: Bucket[] = ["startFrom1", "startMid", "crossDecade", "cross100", "range100to120", "sticksPast100"];

/** One count step: from one number to the next (or the one before). */
interface Move {
  from: number;
  to: number;
}

/**
 * The chart for a counting problem. Before help it shows only what the
 * problem gives: the start, and the numbers already answered; every box after
 * them is blank (review C1-11). On a wrong try the faint numbers come back,
 * with a hop to a "?" box (C1-06). "Show me" draws the step done, with its hop.
 * `moves[i]` is step i's count move (undefined for a non-counting step);
 * `pointAt` is the cell to light up as help on a non-counting step.
 */
const countChart =
  (start: number, moves: (Move | undefined)[], pointAt?: number) =>
  (done: number, help?: VisualHelp) => {
    const answered = moves.slice(0, done).filter((m): m is Move => !!m);
    const reached = Math.max(start, ...answered.map((m) => m.to));
    const i = help?.step ?? done;
    const m = moves[i];
    const showing = !!help?.showMe && help.step === i;
    const point = pointing(help, i) && !showing;
    const lightUp = point && !m && pointAt !== undefined ? [{ n: pointAt, tone: "c" as const }] : [];
    // Counting back: the cell before is blank until a wrong try (then the hop
    // and a "?" show) or "Show me" (review C2-36), like counting on.
    const backHidden = m && m.to < m.from && done <= i && !point && !showing ? [m.to] : undefined;
    return (
      <HundredChart
        marks={[{ n: start, tone: "a" }, ...answered.map((a) => ({ n: a.to, tone: "b" as const })), ...lightUp]}
        upTo={reached}
        hideAfter={!point}
        hide={backHidden}
        hop={(point || showing) && m ? m : undefined}
        ask={point && m ? m.to : undefined}
      />
    );
  };

/** A typed "what comes after / before" step. */
const countStep = (m: Move): Step =>
  m.to > m.from
    ? {
        kind: "number",
        prompt: `What comes after ${m.from}?`,
        hint: `Find ${m.from}. Count on one box.`,
        showMe: `Count on one: ${m.from}, ${m.to}.`,
        showMeHoldMs: holdFor(2),
        explain: `${m.to} comes after ${m.from}.`,
        answer: m.to,
        tone: "b",
      }
    : {
        kind: "number",
        prompt: `What number is one less than ${m.from}?`,
        hint: `Find ${m.from}. Count back one box.`,
        showMe: `Count back one: ${m.from}, ${m.to}.`,
        showMeHoldMs: holdFor(2),
        explain: `One less than ${m.from} is ${m.to}.`,
        answer: m.to,
        tone: "b",
      };

/**
 * The sticks and cubes for a "How many?" problem (100-120). The first 10
 * sticks are drawn as one big group (BaseTenBlocks). Before help: just the
 * blocks, no numbers. A wrong try on step 1 rings all the sticks; on step 2 it
 * lights up the big group and writes "100" under it (not for 100 itself,
 * where 100 is the answer). "Show me" counts: step 1 the sticks 1, 2, 3 …;
 * step 2 the group as 100, then 110, then the cubes 111, 112 ….
 */
const sticksVisual = (sticks: number, cubes: number) => (done: number, help?: VisualHelp) => {
  const n = sticks * 10 + cubes;
  const i = help?.step ?? done;
  const showing = !!help?.showMe && help.step === i;
  const point = pointing(help, i) && !showing;
  if (showing) {
    const labels = i === 0 ? { tens: "count" as const } : n === 100 ? { tens: "value" as const } : { tens: "group" as const, ones: "total" as const };
    return <BaseTenBlocks key={`show${i}`} tens={sticks} ones={cubes} tenTone="a" oneTone="b" labels={labels} countAlong />;
  }
  if (done >= 2) return <BaseTenBlocks key="done" tens={sticks} ones={cubes} tenTone="a" oneTone="b" labels={{ tens: "group", ones: "total" }} />;
  return (
    <BaseTenBlocks
      key="plain"
      tens={sticks}
      ones={cubes}
      tenTone="a"
      oneTone="b"
      ring={point ? (i === 0 ? "tens" : "group") : undefined}
      groupValue={point && i === 1 && n !== 100}
    />
  );
};

const rowName = (n: number) => {
  const lo = Math.floor((n - 1) / 10) * 10 + 1;
  return `${lo} to ${lo + 9}`;
};

function countingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "startFrom1") {
    const n = randInt(1, 6);
    const moves = [
      { from: n, to: n + 1 },
      { from: n + 1, to: n + 2 },
    ];
    const said = Array.from({ length: n }, (_, k) => k + 1).join(", ");
    return {
      title: "Count from 1",
      bucket,
      // n = 1 would read "Count from 1: 1." (review E2-46).
      story: n === 1 ? "Start at 1. What comes next?" : `Count from 1: ${said}. What comes next?`,
      visual: countChart(n, moves),
      steps: moves.map(countStep),
      wrapUp: `${said}, ${n + 1}, ${n + 2}.`,
    };
  }

  if (bucket === "startMid") {
    let n: number;
    do {
      n = randInt(21, 96);
    } while (n % 10 === 0 || n % 10 === 9);
    const moves = [
      { from: n, to: n + 1 },
      { from: n, to: n - 1 },
    ];
    return {
      title: "Start anywhere",
      bucket,
      story: `Here is ${n}.`,
      visual: countChart(n, moves),
      steps: moves.map(countStep),
      wrapUp: `${n - 1}, ${n}, ${n + 1}. You can start at any number.`,
    };
  }

  if (bucket === "crossDecade") {
    // Count 18, 19, 20, then find 20's row. Asked by number and row, never by
    // a decade name (review E1-14); the row question comes last so no earlier
    // prompt shows a later answer (C1-12 / E1-16).
    const d = randInt(1, 8);
    const start = d * 10 + 8;
    const ten = start + 2;
    const moves = [
      { from: start, to: start + 1 },
      { from: start + 1, to: ten },
    ];
    return {
      title: "A new ten",
      bucket,
      story: `Start at ${start}. Count on.`,
      visual: countChart(start, [...moves, undefined], ten),
      steps: [
        ...moves.map(countStep),
        choice(
          {
            prompt: `Which row is ${ten} in?`,
            hint: `Find ${ten} on the chart. Look at its row.`,
            showMe: `${ten} is at the end of the row ${rowName(ten)}.`,
            showMeHoldMs: holdFor(2),
            explain: `${ten} ends the row ${rowName(ten)}. Next comes ${ten + 1}.`,
          },
          rowName(ten),
          [rowName(ten + 1), rowName(ten - 10)] // misconceptions: "20 starts a new row"; "still with the teens"
        ),
      ],
      wrapUp: `${start}, ${start + 1}, ${ten}. Then ${ten + 1} starts the next row.`,
    };
  }

  if (bucket === "cross100") {
    // Always 98 or 99, so the count really passes 100 (review C1-13 / E1-17),
    // and "What comes after 100?" is always one of the steps (C1-07).
    const start = randInt(98, 99);
    const moves = [0, 1, 2].map((k) => ({ from: start + k, to: start + k + 1 }));
    return {
      title: "Past 100",
      bucket,
      story: `Start at ${start}. Count on.`,
      visual: countChart(start, moves),
      steps: moves.map(countStep),
      wrapUp: `${start}, ${start + 1}, ${start + 2}, ${start + 3}. After 99 comes 100.`,
    };
  }

  if (bucket === "sticksPast100") {
    // 1.NBT.1 "write a numeral for a number of objects", 100-120 (user
    // decision 2026-11-17). A third 10 sticks (100-109, no extra sticks), half
    // 11 sticks (110-119), a sixth 12 sticks (120). 0 cubes 1 time in 10 for
    // 10 or 11 sticks (100, 110), and always for 12 (120).
    const r = Math.random();
    const sticks = r < 1 / 3 ? 10 : r < 5 / 6 ? 11 : 12;
    const cubes = sticks === 12 ? 0 : randInt(0, 9);
    const n = sticks * 10 + cubes;
    const extra = sticks - 10;
    // Step 2's Show me: the group is 100, then each extra stick, then each cube.
    const onFrom100 = [...Array.from({ length: extra }, (_, k) => 110 + k * 10), ...Array.from({ length: cubes }, (_, k) => sticks * 10 + k + 1)];
    const made = cubes > 0 ? `${sticksW(sticks)} and ${cubesW(cubes)} make ${n}.` : `${sticksW(sticks)} make ${n}.`;
    return {
      title: "How many?",
      bucket,
      story: cubes > 0 ? "Look at the sticks and cubes." : "Look at the sticks.",
      visual: sticksVisual(sticks, cubes),
      steps: [
        {
          kind: "number",
          prompt: "How many sticks are there?",
          hint: extra > 0 ? "Count the sticks in the big group. Then count the others." : "Count the sticks in the big group.",
          showMe: `Count the sticks: ${countOnes(sticks)}. That is ${sticksW(sticks)}.`,
          showMeHoldMs: countAlongMs(sticks),
          explain: `There are ${sticksW(sticks)}.`,
          answer: sticks,
          tone: "a",
          diagnose: (v) => (v === 10 && extra > 0 ? "Count the other sticks too." : cubes > 0 && v === sticks + cubes ? "Count just the sticks." : null),
        },
        {
          // No tone: the answer is the whole picture, not one part of it.
          kind: "number",
          prompt: "What number is this?",
          hint:
            n === 100
              ? "Each stick is 10. Count the sticks by tens."
              : `The big group is 100.${extra > 0 ? " Each other stick is 10 more." : ""}${cubes > 0 ? " Each cube is 1 more." : ""}`,
          showMe: n === 100 ? "Count by tens: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100." : `The big group is 100. Count on: ${onFrom100.join(", ")}.`,
          showMeHoldMs: countAlongMs(n === 100 ? 10 : 1 + onFrom100.length),
          explain: made,
          answer: n,
          diagnose: (v) =>
            v === sticks + cubes
              ? "Each stick is 10. Count by tens."
              : extra > 0 && v === 100 + cubes
                ? "Count the other sticks too. Each is 10."
                : cubes > 0 && v === sticks * 10
                  ? "Count on the cubes too."
                  : null,
        },
      ],
      wrapUp: n === 100 ? "10 sticks make 100." : `10 sticks make 100. ${made}`,
    };
  }

  // range100to120 — counting on past 100. 101-119 (never 100, review E1-19);
  // 109 and 119 a third of the time, the ends of a row (C1-14).
  const n = Math.random() < 1 / 3 ? (Math.random() < 0.5 ? 109 : 119) : randInt(101, 119);
  const moves = [
    { from: n, to: n + 1 },
    { from: n, to: n - 1 },
  ];
  return {
    title: "Count past 100",
    bucket,
    story: `Here is ${n}. What comes next?`,
    visual: countChart(n, moves),
    steps: moves.map(countStep),
    wrapUp: `${n - 1}, ${n}, ${n + 1}. Past 100, you count the same way.`,
  };
}

export const countingTo120: Unit = {
  id: "countingTo120",
  title: "Counting to 120",
  goal: "Count to 120. Start at any number.",
  standard: "1.NBT.1",
  keyIdea: (
    <>
      <p>You can start counting at any number.</p>
      <p>After 99 comes 100. Then 101, 102, up to 120.</p>
      <p>10 sticks make 100. 11 sticks and 4 cubes make 114.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // The count sequence itself (including the 99 -> 100 step) is a long-term
  // memorized fact, not something re-derived by reasoning each time —
  // periodically re-check it, same convention as MK1's Unit 1.
  reintroEverySolved: 20,
  problems: [{ label: "Counting Forward", make: countingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: countingTo120Test,
};
