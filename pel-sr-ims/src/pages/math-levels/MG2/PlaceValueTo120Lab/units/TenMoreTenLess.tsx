import { useState } from "react";
import { BaseTenBlocks, HundredChart, countAlongMs } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { pointing, type NumberStep, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { tenMoreTenLessTest } from "./TenMoreTenLessTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, TypeCheck, type CheckMode } from "../../../shared/components/KCheck";
import { lookHereSpot } from "../../../shared/lib/lookHere";
import { countTens, holdFor, tensW } from "./words";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K–1 design (shared/components/KCheck.tsx), review round 1: one question at
// a time over a few chart rows or sticks, every answer typed on the number
// pad. Targets: 10 more (down one row, ones stay), 10 less into one digit,
// and taking away tens with sticks (7 tens − 3 tens, then 70 − 30). Explore
// starts at 46, moving 2 tens (review C1-05), so it never shows these answers.

const LOOK = {
  column: { target: "u4-column", label: "Explore: 10 more, 10 less", say: "Look here. 10 more: go down one row." },
  tens: { target: "u4-tens", label: "Explore: take away sticks", say: "Look here. Take away sticks. Count what is left." },
};

/** A few chart rows: the start lit; a wrong try draws the hop to a "?"; "show" marks the landing. */
const rowPicture = (min: number, max: number, start: number, end: number) => (m: CheckMode) => (
  <HundredChart
    min={min}
    max={max}
    marks={[{ n: start, tone: "a" }, ...(m === "show" || m === "done" ? [{ n: end, tone: "b" as const }] : [])]}
    hop={m === "wrong" || m === "show" ? { from: start, to: end } : undefined}
    ask={m === "wrong" ? end : undefined}
  />
);

/** 7 sticks; 3 crossed out once the student is shown (or has answered); "show" counts the sticks left. */
const takePicture = (tens: number, take: number, label: "count" | "value", alwaysTaken = false) => (m: CheckMode) => (
  <BaseTenBlocks
    key={m}
    tens={tens}
    ones={0}
    tenTone="a"
    takeTens={alwaysTaken || m === "show" || m === "done" ? take : 0}
    ring={m === "wrong" ? "tens" : undefined}
    labels={m === "show" ? { tens: label } : undefined}
    countAlong={m === "show"}
  />
);

function TenMoreTenLessCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="What is 10 more than 47?"
            answer={57}
            picture={rowPicture(31, 70, 47, 57)}
            nudge="Find 47. Go down one row."
            why={{ 48: "That is 1 more. Go down one row.", 37: "That is 10 less. Go down, not up." }}
            showText="Watch: 47. Go down one row. The ones stay the same."
            praise="Yes! 10 more than 47 is 57."
            look={LOOK.column}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="What is 10 less than 12?"
            answer={2}
            picture={rowPicture(1, 30, 12, 2)}
            nudge="Find 12. Go up one row."
            why={{ 11: "That is 1 less. Go up one row.", 22: "That is 10 more. Go up, not down." }}
            showText="Watch: 12. Go up one row. The ones stay the same."
            praise="Yes! 10 less than 12 is 2."
            look={LOOK.column}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="7 tens. Take away 3 tens. How many tens are left?"
            answer={4}
            tone="a"
            picture={takePicture(7, 3, "count")}
            nudge="Take away 3 sticks. Count the rest."
            why={{ 10: "Take away, don't add.", 3: "Count the sticks that are left." }}
            showText="Watch and listen: 1, 2, 3, 4 sticks are left."
            praise="Yes! 4 tens are left."
            look={LOOK.tens}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="70 − 30 = ?"
            answer={40}
            tone="a"
            picture={takePicture(7, 3, "value", true)}
            nudge="Each stick is 10. Count the sticks left by tens."
            why={{ 4: "Each stick is 10. Count by tens.", 100: "Take away, don't add." }}
            showText="Watch and listen: 10, 20, 30, 40."
            praise="Yes! 70 − 30 = 40."
            look={LOOK.tens}
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
  const [start, setStart] = useState(46);
  // A tens count plus a More/Less switch, so the voice never reads "-3" as "3" (review E1-31).
  const [tensMove, setTensMove] = useState(2);
  const [dir, setDir] = useState<"more" | "less">("more");
  const move = dir === "more" ? tensMove * 10 : -tensMove * 10;
  const result = start + move;
  // Buttons gray out instead of leaving 0-120 (review C1-24): the start's range
  // depends on the move, and the move's range on the start.
  const startMin = dir === "less" ? Math.max(1, tensMove * 10) : 1;
  const startMax = dir === "more" ? Math.min(120, 120 - tensMove * 10) : 120;
  const tensMax = Math.min(3, Math.floor((dir === "more" ? 120 - start : start) / 10));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Stepper label="Start at" value={start} min={startMin} max={startMax} step={1} onChange={setStart} tone="a" />
        <Segmented
          label="Ten more or ten less"
          value={dir}
          onChange={(d) => {
            const room = Math.floor((d === "more" ? 120 - start : start) / 10);
            setDir(d);
            if (tensMove > room) setTensMove(Math.max(0, room));
          }}
          options={[
            { id: "more", label: "More" },
            { id: "less", label: "Less" },
          ]}
        />
        <Stepper label="Tens" value={tensMove} min={0} max={tensMax} step={1} onChange={setTensMove} tone="b" />
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

      <ReadAloud as="p" style={{ fontWeight: 800, fontSize: 24, margin: 0 }}>
        {start} {dir === "more" ? "+" : "−"} {tensMove * 10} = {result}
      </ReadAloud>
      <div {...lookHereSpot("u4-column")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <HundredChart
          marks={result >= 1 ? [{ n: start, tone: "a" }, { n: result, tone: "b" }] : [{ n: start, tone: "a" }]}
          hop={result >= 1 && result !== start ? { from: start, to: result } : undefined}
        />
        <ReadAloud as="p" className="muted small" style={{ margin: 0 }}>
          10 more: go down one row. 10 less: go up one row. <span data-look-here-key>The ones stay the same.</span>
        </ReadAloud>
      </div>
      <div {...lookHereSpot("u4-tens")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <BaseTenBlocks tens={5} ones={0} tenTone="a" takeTens={2} labels={{ tens: "value" }} />
        <ReadAloud as="p" className="muted small" style={{ margin: 0 }}>
          50 − 20: 5 sticks. <span data-look-here-key>Take away 2 sticks. 3 sticks are left.</span> 50 − 20 = 30.
        </ReadAloud>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <TenMoreTenLessCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "tenMoreNoRollover" | "tenLessCrossing" | "addMultipleOfTen" | "subtractMultipleOfTen";
const BUCKETS: Bucket[] = ["tenMoreNoRollover", "tenLessCrossing", "addMultipleOfTen", "subtractMultipleOfTen"];

/** Where a step lands on the chart (a hop from `from` to `to`), or the sticks it counts. */
type Look = { hop: { from: number; to: number } } | { sticks: number };

/**
 * The chart marks only the start before help (review C1-22). A wrong try on a
 * hop step draws the hop with a "?" where it lands; "Show me" draws the hop to
 * the answer. A "how many tens" step shows its sticks as help (counted aloud
 * on "Show me"). A step's landing cell is colored only once it is done.
 */
const chartVisual = (n: number, looks: Look[]) => (done: number, help?: VisualHelp) => {
  const i = help?.step ?? done;
  const look = looks[i];
  const showing = !!help?.showMe && help.step === i;
  const point = pointing(help, i) && !showing;
  const landed = looks.slice(0, done).flatMap((l) => ("hop" in l ? [{ n: l.hop.to, tone: "b" as const }] : []));
  const hop = look && "hop" in look && (point || showing) ? look.hop : undefined;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <HundredChart marks={[{ n, tone: "a" }, ...landed.filter((m) => m.n !== n)]} hop={hop} ask={point && hop ? hop.to : undefined} />
      {look && "sticks" in look && (point || showing) && (
        <BaseTenBlocks key={showing ? "show" : "ring"} tens={look.sticks} ones={0} tenTone="a" ring={point ? "tens" : undefined} labels={showing ? { tens: "value" } : undefined} countAlong={showing} />
      )}
    </div>
  );
};

/** "What is 10 more/less than n?" — typed, colored like the landing cell. */
const hopStep = (n: number, by: number): NumberStep => {
  const result = n + by;
  const rows = Math.abs(by) / 10;
  const way = by > 0 ? "down" : "up";
  const passed = Array.from({ length: rows }, (_, k) => n + Math.sign(by) * 10 * (k + 1)).join(", ");
  return {
    kind: "number",
    prompt: Math.abs(by) === 10 ? `What is 10 ${by > 0 ? "more" : "less"} than ${n}?` : `${n} ${by > 0 ? "+" : "−"} ${Math.abs(by)} = ?`,
    hint: `Find ${n}. Go ${way} ${rows === 1 ? "one row" : `${rows} rows`}. The ones stay the same.`,
    showMe: `Start at ${n}. Go ${way} ${rows === 1 ? "one row" : `${rows} rows`}: ${passed}.`,
    showMeHoldMs: holdFor(rows + 1),
    explain: `${n} ${by > 0 ? "+" : "−"} ${Math.abs(by)} = ${result}.`,
    answer: result,
    tone: "b",
    diagnose: (v) => (v === n + Math.sign(by) * (rows) ? "That moved by ones. Move by rows." : null),
  };
};

/** "How many tens are in 30?" (review E1-24 wording). */
const tensInStep = (amount: number): NumberStep => {
  const t = amount / 10;
  return {
    kind: "number",
    prompt: `How many tens are in ${amount}?`,
    // Review C2-38 / E2-45: the hint names this amount, not a fixed "10, 20, 30".
    hint: `Count by tens to ${amount}.`,
    showMe: `Count by tens: ${countTens(t)}. That is ${tensW(t)}.`,
    showMeHoldMs: countAlongMs(t),
    explain: `${amount} is ${tensW(t)}.`,
    answer: t,
    tone: "a",
  };
};

function tenMoreLessProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "tenMoreNoRollover") {
    // 10 more, then 10 less of the same number, both typed (review C1-07).
    const n = randInt(11, 88);
    return {
      title: "10 more",
      bucket,
      story: `Start at ${n}.`,
      visual: chartVisual(n, [{ hop: { from: n, to: n + 10 } }, { hop: { from: n, to: n - 10 } }]),
      steps: [hopStep(n, 10), hopStep(n, -10)],
      wrapUp: `${n - 10}, ${n}, ${n + 10}. Only the tens changed.`,
    };
  }

  if (bucket === "tenLessCrossing") {
    // 10 less from 11-99, half the time from 11-23 (into one digit, or just
    // above it) — review C1-23. Then 10 more, typed (C1-07).
    const n = Math.random() < 0.5 ? randInt(11, 23) : randInt(24, 99);
    return {
      title: "10 less",
      bucket,
      story: `Start at ${n}.`,
      visual: chartVisual(n, [{ hop: { from: n, to: n - 10 } }, { hop: { from: n, to: n + 10 } }]),
      steps: [hopStep(n, -10), hopStep(n, 10)],
      // Past 100 (e.g. 98 → 108) "only the tens changed" isn't true, so say
      // what is: the ones stayed the same (round 3, U4 wrap-up).
      wrapUp: `${n - 10}, ${n}, ${n + 10}. ${n + 10 >= 100 ? "The ones stayed the same." : "Only the tens changed."}`,
    };
  }

  if (bucket === "addMultipleOfTen") {
    const n = randInt(10, 79);
    const addTens = randInt(1, Math.min(2, Math.floor((99 - n) / 10)) || 1);
    const add = addTens * 10;
    const result = n + add;
    return {
      title: "Add tens",
      bucket,
      story: `What is ${n} + ${add}?`,
      visual: chartVisual(n, [{ sticks: addTens }, { hop: { from: n, to: result } }]),
      steps: [tensInStep(add), hopStep(n, add)],
      wrapUp: `${n} + ${add} = ${result}. Adding ${add} is ${tensW(addTens)} more.`,
    };
  }

  // subtractMultipleOfTen — including both the exact-ten landing (e.g.
  // 70 − 30 = 40) and the mid-row case (e.g. 45 − 20 = 25, tens change but
  // ones stay — the case that actually tests not counting by ones).
  const subTens = randInt(1, 7); // sub = 10-70
  const sub = subTens * 10;
  const extraTens = randInt(1, 9 - subTens); // keeps the result's tens digit 1-8
  const midDecade = Math.random() < 0.5;
  const ones = midDecade ? randInt(1, 9) : 0;
  const finalN = (subTens + extraTens) * 10 + ones;
  const finalResult = finalN - sub;
  return {
    title: "Take away tens",
    bucket,
    story: `What is ${finalN} − ${sub}?`,
    visual: chartVisual(finalN, [{ sticks: subTens }, { hop: { from: finalN, to: finalResult } }]),
    steps: [tensInStep(sub), hopStep(finalN, -sub)],
    wrapUp: `${finalN} − ${sub} = ${finalResult}. Taking away ${sub} is ${tensW(subTens)} less.`,
  };
}

export const tenMoreTenLess: Unit = {
  id: "tenMoreTenLess",
  title: "Ten More, Ten Less, and Adding Tens",
  goal: "Find 10 more and 10 less. Add and take away tens.",
  standard: "1.NBT.4–6",
  keyIdea: (
    <>
      <p>10 more or 10 less: only the tens change. The ones stay the same.</p>
      <p>Adding 20 is 2 tens more.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoned through via place value each time, not a memorized fact.
  problems: [{ label: "Moving by Tens", make: tenMoreLessProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: tenMoreTenLessTest,
};
