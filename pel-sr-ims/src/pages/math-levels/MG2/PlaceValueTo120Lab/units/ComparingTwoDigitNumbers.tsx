import { useState } from "react";
import { BlocksPair, HundredChart, countAlongMs } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, pointing, type NumberStep, type Problem, type Step, type VisualHelp } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingTwoDigitNumbersTest } from "./ComparingTwoDigitNumbersTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck, type CheckMode } from "../../../shared/components/KCheck";
import { lookHereSpot } from "../../../shared/lib/lookHere";
import { onesW, tensW } from "./words";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K–1 design (shared/components/KCheck.tsx), review round 1: one question at
// a time over the two numbers drawn as sticks and cubes. 2 of 4 typed (their
// boxes are the neutral tone c: the question is WHICH number, so a box colored
// like one of them would give it away, review C2-28). The
// symbol is checked with a picture, not "which symbol means…" (review E1-26 /
// C1-18, decision 2): the sign buttons say "this one" aloud, so the voice
// doesn't read out the answer. Targets: what < means, same tens (look at the
// ones), tens and ones swapped (more tens wins), and equal numbers, where the
// student must turn 6 tens and 5 ones into 65 first (review C2-29). None of
// the pairs is an Explore default or preset (42/58, 42/45, 36/63, 53/53).

const LOOK = {
  symbols: { target: "u3-symbols", label: "Explore: the signs", say: "Look here. The open side faces the bigger number." },
  rule: { target: "u3-rule", label: "Explore: tens first", say: "Look here. More tens? Bigger number." },
  presets: { target: "u3-presets", label: "Explore: 53 and 53", say: "Look here. Try 53 and 53." },
};

/** Sign buttons that the voice reads as "this one" (so the voice doesn't give the answer). */
const SIGNS = (["<", "=", ">"] as const).map((s) => ({
  id: s,
  label: (
    <span data-tts-say="this one" style={{ fontSize: 34, fontWeight: 900, padding: "0 10px" }}>
      {s}
    </span>
  ),
}));

const pairPicture = (a: number, b: number, part: "tens" | "ones") => (m: CheckMode) => (
  <BlocksPair key={m} a={a} b={b} ring={m === "wrong" ? part : undefined} labels={m === "show" || m === "done" ? part : undefined} countAlong={m === "show"} />
);

function ComparingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="31 ☐ 57. What goes in the box?"
            picture={<BlocksPair a={31} b={57} middle="box" />}
            showPicture={<BlocksPair a={31} b={57} middle="<" labels="tens" countAlong />}
            options={SIGNS}
            answer="<"
            why={{ ">": "The open side faces the bigger number.", "=": "Count the sticks. Are they the same?" }}
            showText="Watch: 31 has 3 tens. 57 has 5 tens. 31 is less than 57."
            praise="Yes! 31 is less than 57."
            look={LOOK.symbols}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="71 and 74. Type the bigger number."
            answer={74}
            tone="c"
            picture={pairPicture(71, 74, "ones")}
            nudge="Same tens. Count the cubes."
            why={{ 71: "Same tens. Count the cubes." }}
            showText="Watch and listen: 71 has 1 one. 74 has 4 ones."
            praise="Yes! 74 is bigger. The ones told you."
            look={LOOK.rule}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="82 and 28. Type the bigger number."
            answer={82}
            tone="c"
            picture={pairPicture(82, 28, "tens")}
            nudge="Count the sticks. Who has more tens?"
            why={{ 28: "Count the sticks. Who has more tens?" }}
            showText="Watch and listen: 82 has 8 tens. 28 has 2 tens."
            praise="Yes! 82 is bigger. It has more tens."
            look={LOOK.rule}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="6 tens and 5 ones ☐ 65. What goes in the box?"
            picture={<BlocksPair a={65} b={65} middle="box" blocksVsNumber />}
            showPicture={<BlocksPair a={65} b={65} middle="=" labels="total" countAlong blocksVsNumber />}
            options={SIGNS}
            answer="="
            why={{ "<": "Count the sticks by tens. Then the cubes.", ">": "Count the sticks by tens. Then the cubes." }}
            showText="Watch: 6 tens and 5 ones is 65. 65 equals 65."
            praise="Yes! 6 tens and 5 ones is 65."
            look={LOOK.presets}
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
  const [a, setA] = useState(42);
  const [b, setB] = useState(58);
  const symbol = a < b ? "<" : a > b ? ">" : "=";
  const sameTens = Math.floor(a / 10) === Math.floor(b / 10);
  const pick = (x: number, y: number) => {
    setA(x);
    setB(y);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Stepper label="Number A" value={a} min={10} max={99} step={1} onChange={setA} tone="a" />
        <Stepper label="Number B" value={b} min={10} max={99} step={1} onChange={setB} tone="b" />
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
      {/* Presets, so a student doesn't tap 45 times to get from 42 to 87 (review C1-21). */}
      <div {...lookHereSpot("u3-presets")} className="control-row" style={{ alignItems: "center" }} data-readaloud-part>
        <button className="btn ghost" onClick={() => pick(42, 45)}>
          42 and 45
        </button>
        <button className="btn ghost" onClick={() => pick(36, 63)}>
          36 and 63
        </button>
        <button className="btn ghost" onClick={() => pick(53, 53)}>
          53 and 53
        </button>
      </div>

      {/* What < = > mean, with the numbers drawn as sticks and cubes (review C1-18 / C1-19). */}
      <div {...lookHereSpot("u3-symbols")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <BlocksPair a={a} b={b} middle={symbol} />
        <ReadAloud as="p" style={{ fontWeight: 800, fontSize: 22, margin: 0 }}>
          <span style={{ color: "var(--qa)" }}>{a}</span> {symbol} <span style={{ color: "var(--qb)" }}>{b}</span>
        </ReadAloud>
        <ReadAloud as="p" className="muted small" style={{ margin: 0 }}>
          <span data-look-here-key>The open side faces the bigger number.</span>
        </ReadAloud>
      </div>
      <ReadAloud as="p" className="muted small" {...lookHereSpot("u3-rule")}>
        <span data-look-here-key>More tens? Bigger number. Same tens? Look at the ones.</span> {sameTens ? "These have the same tens." : "These have different tens."}
      </ReadAloud>
      <HundredChart marks={[{ n: a, tone: "a" }, { n: b, tone: "b" }]} />
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <ComparingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "diffTens" | "sameTensDiffOnes" | "equal" | "reversedDigits";
const BUCKETS: Bucket[] = ["diffTens", "sameTensDiffOnes", "equal", "reversedDigits"];

const symbolFor = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");

/**
 * The chart with both numbers marked (what the problem gives). As help, the
 * two numbers also appear as sticks and cubes: a wrong try rings the part
 * that decides (the sticks, or the cubes when the tens are the same); "Show
 * me" counts that part aloud (review C1-06 / C1-19).
 */
const compareVisual = (a: number, b: number, helpSteps: number[]) => (_done: number, help?: VisualHelp) => {
  const i = help?.step ?? -1;
  const helping = helpSteps.includes(i) && pointing(help, i);
  const part = Math.floor(a / 10) === Math.floor(b / 10) ? "ones" : "tens";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <HundredChart marks={a === b ? [{ n: a, tone: "a" }] : [{ n: a, tone: "a" }, { n: b, tone: "b" }]} />
      {helping && <BlocksPair key={help?.showMe ? "show" : "ring"} a={a} b={b} ring={help?.showMe ? undefined : part} labels={help?.showMe ? part : undefined} countAlong={help?.showMe} />}
    </div>
  );
};

/** "40, 50, 51, 52": counting t sticks by tens, then on through o cubes. */
const countTotal = (t: number, o: number) =>
  [...Array.from({ length: t }, (_, i) => (i + 1) * 10), ...Array.from({ length: o }, (_, i) => t * 10 + i + 1)].join(", ");

/**
 * The "Sticks and cubes" picture (review C2-29): the blocks (tone a, no number
 * written on them) beside the number (tone b), and the chart with that number
 * marked. The blocks' number is marked on the chart only once step 1 is done.
 * Step 1 help: a wrong try rings the sticks; "Show me" counts 10, 20 … then on
 * through the cubes. Step 2 help: the same as the other compare problems.
 */
const blocksVsNumberVisual = (blocks: number, n: number) => (done: number, help?: VisualHelp) => {
  const i = help?.step ?? -1;
  const showing = !!help?.showMe && help.step === i;
  const point = pointing(help, i) && !showing;
  const part = Math.floor(blocks / 10) === Math.floor(n / 10) ? "ones" : "tens";
  const marks = done >= 1 && blocks !== n ? [{ n: blocks, tone: "a" as const }, { n, tone: "b" as const }] : [{ n, tone: "b" as const }];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <BlocksPair
        key={showing ? `show${i}` : point ? `ring${i}` : "plain"}
        a={blocks}
        b={n}
        blocksVsNumber
        middle={done >= 2 ? symbolFor(blocks, n) : "box"}
        ring={point ? (i === 0 ? "tens" : part) : undefined}
        labels={showing ? "total" : undefined}
        countAlong={showing}
      />
      <HundredChart marks={marks} />
    </div>
  );
};

/** Why the bigger one is bigger, in the student's words. */
const reason = (a: number, b: number) => {
  const [ta, tb, oa, ob] = [Math.floor(a / 10), Math.floor(b / 10), a % 10, b % 10];
  if (ta !== tb) return `${a} has ${tensW(ta)}. ${b} has ${tensW(tb)}.`;
  if (oa !== ob) return `Same tens. ${a} has ${onesW(oa)}. ${b} has ${onesW(ob)}.`;
  return "Same tens. Same ones.";
};
const holdFor = (a: number, b: number) => {
  const sameTens = Math.floor(a / 10) === Math.floor(b / 10);
  return countAlongMs(sameTens ? Math.max(a % 10, b % 10) : Math.max(Math.floor(a / 10), Math.floor(b / 10)));
};

const symbolStep = (a: number, b: number, hint: string): Step => {
  const sym = symbolFor(a, b);
  return choice(
    {
      prompt: `${a} ☐ ${b}. What goes in the box?`,
      hint,
      showMe: `${reason(a, b)} So ${a} ${sym} ${b}.`,
      showMeHoldMs: holdFor(a, b),
      explain: `${a} ${sym} ${b}.`,
    },
    sym,
    ["<", ">", "="].filter((s) => s !== sym)
  );
};

/** "Type the bigger number" (review C1-07 / C1-20). Its box is the neutral
 *  tone c: the question is WHICH number, so a box colored like one of them
 *  would give the answer away (review C2-28). */
const biggerStep = (a: number, b: number, hint: string): NumberStep => {
  const big = Math.max(a, b);
  return {
    kind: "number",
    prompt: `${a} and ${b}. Type the bigger number.`,
    hint,
    showMe: `${reason(a, b)} ${big} is bigger.`,
    showMeHoldMs: holdFor(a, b),
    explain: `${big} is bigger.`,
    answer: big,
    tone: "c",
  };
};

function comparingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "equal") {
    // Review C2-29: sticks and cubes vs a number, so "=" needs place value.
    // Step 1 (typed) turns the blocks into a number; step 2 picks the sign.
    // Half the time (review C3-42) the blocks don't match (tens and ones swapped, or 1 ten
    // off), so the answer isn't always "=".
    const n = randInt(11, 99);
    const t = Math.floor(n / 10);
    const o = n % 10;
    let blocks = n;
    if (Math.random() < 1 / 2) {
      blocks = o >= 1 && o !== t ? o * 10 + t : t === 9 ? n - 10 : n + 10;
    }
    const bt = Math.floor(blocks / 10);
    const bo = blocks % 10;
    const sym = symbolFor(blocks, n);
    return {
      title: "Sticks and cubes",
      bucket,
      story: `${tensW(bt)} and ${onesW(bo)}. Compare with ${n}.`,
      visual: blocksVsNumberVisual(blocks, n),
      steps: [
        {
          kind: "number",
          prompt: `${tensW(bt)} and ${onesW(bo)} is what number?`,
          hint: "Count the sticks by tens. Then count on the cubes.",
          showMe: `Count: ${countTotal(bt, bo)}. That is ${blocks}.`,
          showMeHoldMs: countAlongMs(bt + bo),
          explain: `${tensW(bt)} and ${onesW(bo)} is ${blocks}.`,
          answer: blocks,
          tone: "a",
        },
        // Show me counts the blocks 10, 20 … then on through the cubes.
        { ...symbolStep(blocks, n, "Look at the tens first. Then the ones."), showMeHoldMs: countAlongMs(bt + bo) },
      ],
      wrapUp: `${tensW(bt)} and ${onesW(bo)} is ${blocks}. ${blocks} ${sym} ${n}.`,
    };
  }

  if (bucket === "reversedDigits") {
    let t: number, o: number;
    do {
      t = randInt(1, 9);
      o = randInt(1, 9);
    } while (t === o);
    const a = t * 10 + o;
    const b = o * 10 + t;
    return {
      title: "Tens and ones swapped",
      bucket,
      story: `Compare ${a} and ${b}.`,
      visual: compareVisual(a, b, [0, 1]),
      steps: [biggerStep(a, b, "Count the sticks. More tens is bigger."), symbolStep(a, b, "Count the sticks. More tens is bigger.")],
      wrapUp: `${a} ${symbolFor(a, b)} ${b}. ${Math.max(a, b)} has more tens.`,
    };
  }

  if (bucket === "sameTensDiffOnes") {
    const tens = randInt(1, 9);
    let o1: number, o2: number;
    do {
      o1 = randInt(0, 9);
      o2 = randInt(0, 9);
    } while (o1 === o2);
    const a = tens * 10 + o1;
    const b = tens * 10 + o2;
    const sym = symbolFor(a, b);
    return {
      title: "Same tens",
      bucket,
      story: `Compare ${a} and ${b}.`,
      visual: compareVisual(a, b, [0, 1, 2]),
      steps: [
        // choice() shuffles, so the right one isn't always first (review E1-28 / C1-07).
        choice(
          {
            prompt: `Both have ${tensW(tens)}. What do you look at next?`,
            hint: "The tens are the same. Look at the ones.",
            showMe: "The tens are the same. So look at the ones.",
            showMeHoldMs: holdFor(a, b),
            explain: "The tens are the same. The ones decide.",
          },
          "The ones",
          ["The tens"]
        ),
        biggerStep(a, b, "The tens are the same. Look at the ones."),
        symbolStep(a, b, `Look at the ones: ${o1} and ${o2}.`),
      ],
      wrapUp: `${a} ${sym} ${b}. The ones told you.`,
    };
  }

  // diffTens — decided by tens alone.
  let ta: number, tb: number;
  do {
    ta = randInt(1, 9);
    tb = randInt(1, 9);
  } while (ta === tb);
  const a = ta * 10 + randInt(0, 9);
  const b = tb * 10 + randInt(0, 9);
  return {
    title: "Different tens",
    bucket,
    story: `Compare ${a} and ${b}.`,
    visual: compareVisual(a, b, [0, 1]),
    steps: [biggerStep(a, b, "Count the sticks. More tens is bigger."), symbolStep(a, b, "The open side faces the bigger number.")],
    wrapUp: `${a} ${symbolFor(a, b)} ${b}. The tens told you.`,
  };
}

export const comparingTwoDigitNumbers: Unit = {
  id: "comparingTwoDigitNumbers",
  title: "Comparing Numbers",
  goal: "Compare two numbers. Greater, less, or equal?",
  standard: "1.NBT.3",
  keyIdea: (
    <>
      <p>Look at the tens first. More tens? That number is bigger.</p>
      <p>Same tens? Look at the ones.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Comparison is reasoned through via place value every time, not a
  // memorized fact — no periodic re-gating.
  problems: [{ label: "Comparing Numbers", make: comparingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: comparingTwoDigitNumbersTest,
};
