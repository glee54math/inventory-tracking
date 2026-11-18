import { useId, useState } from "react";
import { BaseTenBlocks, countAlongMs } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { pointing, type NumberStep, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { tensAndOnesTest } from "./TensAndOnesTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { getState, sayText } from "../../../shared/tts/speechEngine";
import { CheckSequence, TypeCheck, type CheckMode } from "../../../shared/components/KCheck";
import { lookHereSpot } from "../../../shared/lib/lookHere";
import { countOnes, countTens, onesW, tensW } from "./words";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K–1 design (shared/components/KCheck.tsx), review round 1: one short
// question at a time under a sticks-and-cubes picture, every answer typed on
// the number pad. Targets: tens vs. ones (36), the ten inside a teen number
// (17), 0 ones (10), and counting sticks by tens (60). None of these numbers
// is an Explore default or preset (24, 14, 70), so a "Look here" never shows
// a CFU answer.

const LOOK = {
  blocks: { target: "u2-blocks", label: "Explore: sticks and cubes", say: "Look here. A stick is 1 ten. A cube is 1 one." },
  makeTen: { target: "u2-maketen", label: "Explore: Make a ten", say: "Look here. 10 ones make 1 ten." },
  presets: { target: "u2-presets", label: "Explore: 14 and 70", say: "Look here. Try 70. Count the cubes." },
};

/** The CFU picture: plain at first, the part to count ringed after a wrong try, counted aloud on "show". */
const blocksPicture =
  (tens: number, ones: number, part: "tens" | "ones", tensLabel: "count" | "value" = "count") =>
  (m: CheckMode) => (
    <BaseTenBlocks
      key={m}
      tens={tens}
      ones={ones}
      tenTone="a"
      oneTone="b"
      ring={m === "wrong" ? part : undefined}
      labels={m === "show" || m === "done" ? (part === "tens" ? { tens: tensLabel } : { ones: "count" }) : undefined}
      countAlong={m === "show"}
    />
  );

function TensAndOnesCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="How many tens are in 36?"
            answer={3}
            tone="a"
            picture={blocksPicture(3, 6, "tens")}
            nudge="Count the sticks."
            why={{ 6: "Count the sticks, not the cubes.", 30: "How many sticks? Count them." }}
            showText="Watch and listen: 1, 2, 3 sticks."
            praise="Yes! 3 tens."
            look={LOOK.blocks}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many ones are in 36?"
            answer={6}
            tone="b"
            picture={blocksPicture(3, 6, "ones")}
            nudge="Count the cubes."
            why={{ 3: "Count the cubes, not the sticks.", 36: "Count just the cubes." }}
            showText="Watch and listen: 1, 2, 3, 4, 5, 6."
            praise="Yes! 3 tens and 6 ones."
            look={LOOK.blocks}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="How many tens are in 17?"
            answer={1}
            tone="a"
            picture={blocksPicture(1, 7, "tens")}
            nudge="Look for a stick. A stick is a ten."
            why={{ 0: "Look for a stick. A stick is a ten.", 7: "Count the sticks, not the cubes.", 17: "Count just the sticks." }}
            showText="Watch: 1 stick. That is 1 ten."
            praise="Yes! 17 is 1 ten and 7 ones."
            look={LOOK.makeTen}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="How many ones are in 10?"
            answer={0}
            tone="b"
            picture={blocksPicture(1, 0, "ones")}
            nudge="Count the cubes."
            why={{ 1: "That is a stick. Count the cubes.", 10: "Count the cubes. Are there any?" }}
            showText="Watch: there are no cubes. That is 0 ones."
            praise="Yes! 10 is 1 ten and 0 ones."
            look={LOOK.presets}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={5}
            prompt="What number is this?"
            answer={60}
            tone="a"
            picture={blocksPicture(6, 0, "tens", "value")}
            nudge="Each stick is 10. Count by tens."
            why={{ 6: "Each stick is 10. Count by tens." }}
            showText="Watch and listen: 10, 20, 30, 40, 50, 60."
            praise="Yes! 6 tens is 60."
            look={LOOK.blocks}
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
 * "Make a ten" (review C1-16): 10 cubes are counted 1 to 10, about one a
 * second (each number said), then slide together into one stick labeled 10.
 */
function MakeATen() {
  const [phase, setPhase] = useState<"idle" | "count" | "join" | "done">("idle");
  const [run, setRun] = useState(0);
  const voiceId = useId();
  const busy = phase === "count" || phase === "join";
  const sayIt = (text: string) => {
    if (getState().autoRead) sayText(voiceId, text);
  };
  return (
    <div {...lookHereSpot("u2-maketen")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="control-row" style={{ alignItems: "center" }} data-readaloud-part>
        <button
          className="btn primary"
          disabled={busy}
          onClick={() => {
            setRun((r) => r + 1);
            setPhase("count");
          }}
        >
          {phase === "idle" ? "Make a ten" : "Make a ten again"}
        </button>
      </div>
      {phase !== "idle" && (
        <BaseTenBlocks
          key={run}
          tens={phase === "done" ? 1 : 0}
          ones={phase === "done" ? 0 : 10}
          tenTone="a"
          oneTone="b"
          labels={{ tens: "value", ones: "count" }}
          countAlong={phase === "count"}
          onCount={(k) => sayIt(String(k))}
          bundle={phase === "join"}
          onAnimDone={() => {
            if (phase === "count") setPhase("join");
            else if (phase === "join") {
              setPhase("done");
              sayIt("10 ones make 1 ten.");
            }
          }}
        />
      )}
      <ReadAloud as="p" className="muted small" style={{ margin: 0 }}>
        <span data-look-here-key>10 ones make 1 ten.</span>
      </ReadAloud>
    </div>
  );
}

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [tens, setTens] = useState(2);
  const [ones, setOnes] = useState(4);
  const value = tens * 10 + ones;
  const voiceId = useId();
  const preset = (t: number, o: number) => {
    setTens(t);
    setOnes(o);
    if (getState().autoRead) sayText(voiceId, String(t * 10 + o));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <MakeATen />

      <div {...lookHereSpot("u2-blocks")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="control-row" data-readaloud-part>
          <Stepper label="Tens" value={tens} min={0} max={9} step={1} onChange={(v) => setTens(v)} tone="a" />
          <Stepper label="Ones" value={ones} min={0} max={9} step={1} onChange={(v) => setOnes(v)} tone="b" />
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
        <BaseTenBlocks tens={tens} ones={ones} tenTone="a" oneTone="b" labels={{ tens: "value", ones: "total" }} />
        {/* The number sentence shows all the time once the blocks are built (review C1-16 / C1-17). */}
        <ReadAloud as="p" style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>
          {value} = {tensW(tens)} + {onesW(ones)}
        </ReadAloud>
        <ReadAloud as="p" style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>
          {value} = {tens * 10} + {ones}
        </ReadAloud>
        <ReadAloud as="p" className="muted small" style={{ margin: 0 }}>
          Make a number with sticks and cubes. <span data-look-here-key>A stick is 1 ten. A cube is 1 one.</span>
        </ReadAloud>
      </div>

      <div {...lookHereSpot("u2-presets")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="control-row" style={{ alignItems: "center" }} data-readaloud-part>
          <button className="btn ghost" onClick={() => preset(1, 4)}>
            Show 14
          </button>
          <button className="btn ghost" onClick={() => preset(7, 0)}>
            Show 70
          </button>
        </div>
        <ReadAloud as="p" className="muted small" style={{ margin: 0 }}>
          <span data-look-here-key>14 is 1 ten and 4 ones. 70 has no cubes.</span>
        </ReadAloud>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <TensAndOnesCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "standard" | "exactTen" | "teen" | "exactDecade" | "reverse";
const BUCKETS: Bucket[] = ["standard", "exactTen", "teen", "exactDecade", "reverse"];

/** What each step asks about: the sticks, the cubes, the whole value, or the
 *  sticks' value only ("42 = ☐ + 2" asks for the 40; review C2-41). */
type Part = "tens" | "ones" | "value" | "sticks";

/**
 * The blocks for a problem. Before help: just the sticks and cubes (no
 * numbers, since a label can be the answer). A wrong try rings the part the
 * step asks about; "Show me" counts it aloud, about 1 second per item
 * (review C1-06). Labels stay on a part once its step is done.
 */
const blocksVisual = (tens: number, ones: number, parts: Part[]) => (done: number, help?: VisualHelp) => {
  const i = help?.step ?? done;
  const part = parts[i];
  const showing = !!help?.showMe && help.step === i;
  const point = pointing(help, i) && !showing;
  const donePart = (p: Part) => parts.slice(0, Math.min(done, parts.length)).includes(p) && !(showing && parts[i] === p);
  const labels = showing
    ? part === "tens"
      ? { tens: "count" as const }
      : part === "ones"
        ? { ones: "count" as const }
        : part === "sticks"
          ? { tens: "value" as const }
          : { tens: "value" as const, ones: "total" as const }
    : {
        tens: donePart("value") || donePart("sticks") ? ("value" as const) : donePart("tens") ? ("count" as const) : undefined,
        ones: donePart("value") ? ("total" as const) : donePart("ones") ? ("count" as const) : undefined,
      };
  return (
    <BaseTenBlocks
      key={showing ? `show${i}` : "plain"}
      tens={tens}
      ones={ones}
      tenTone="a"
      oneTone="b"
      ring={point ? (part === "ones" ? "ones" : "tens") : undefined}
      labels={labels}
      countAlong={showing}
    />
  );
};

const tensStep = (n: number, tens: number, ones: number): NumberStep => ({
  kind: "number",
  prompt: `How many tens are in ${n}?`,
  hint: tens === 1 ? "Look for a stick. A stick is a ten." : "Count the sticks.",
  showMe: `Count the sticks: ${countOnes(tens)}. That is ${tensW(tens)}.`,
  showMeHoldMs: countAlongMs(tens),
  explain: `${n} is ${tensW(tens)} and ${onesW(ones)}.`,
  answer: tens,
  tone: "a",
});

const onesStep = (n: number, ones: number): NumberStep => ({
  kind: "number",
  prompt: `How many ones are in ${n}?`,
  hint: "Count the cubes.",
  showMe: ones === 0 ? "There are no cubes. That is 0 ones." : `Count the cubes: ${countOnes(ones)}. That is ${onesW(ones)}.`,
  showMeHoldMs: countAlongMs(ones),
  explain: `${n} has ${onesW(ones)}.`,
  answer: ones,
  tone: "b",
});

function tensAndOnesProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "exactTen") {
    return {
      title: "The number 10",
      bucket,
      story: "Look at 10. How many tens and ones?",
      visual: blocksVisual(1, 0, ["tens", "ones"]),
      steps: [tensStep(10, 1, 0), onesStep(10, 0)],
      wrapUp: "10 = 1 ten + 0 ones.",
    };
  }

  if (bucket === "teen") {
    const ones = randInt(1, 9);
    const n = 10 + ones;
    return {
      title: "A teen number",
      bucket,
      story: `Look at ${n}. How many tens and ones?`,
      visual: blocksVisual(1, ones, ["tens", "ones"]),
      steps: [tensStep(n, 1, ones), onesStep(n, ones)],
      wrapUp: `${n} = 1 ten + ${onesW(ones)}.`,
    };
  }

  if (bucket === "exactDecade") {
    const tens = randInt(2, 9);
    const n = tens * 10;
    return {
      title: "A number like 70",
      bucket,
      story: `Look at ${n}. How many tens and ones?`,
      visual: blocksVisual(tens, 0, ["tens", "ones"]),
      steps: [tensStep(n, tens, 0), onesStep(n, 0)],
      wrapUp: `${n} = ${tensW(tens)} + 0 ones.`,
    };
  }

  if (bucket === "reverse") {
    const tens = randInt(1, 9);
    const ones = randInt(0, 9);
    const n = tens * 10 + ones;
    return {
      title: "Build the number",
      bucket,
      // No "and 0 cubes" when there are none (review E2-46).
      story: `Here are ${tens} stick${tens === 1 ? "" : "s"}${ones > 0 ? ` and ${ones} cube${ones === 1 ? "" : "s"}` : ""}.`,
      visual: blocksVisual(tens, ones, ["value"]),
      steps: [
        {
          kind: "number",
          prompt: `${tensW(tens)} and ${onesW(ones)} is what number?`,
          hint: "Count the sticks by tens. Then count on the cubes.",
          showMe: `Count by tens: ${countTens(tens)}.${ones > 0 ? ` Then count on: ${Array.from({ length: ones }, (_, k) => tens * 10 + k + 1).join(", ")}.` : ""}`,
          showMeHoldMs: countAlongMs(tens + ones),
          explain: `${tensW(tens)} and ${onesW(ones)} is ${n}.`,
          answer: n,
          diagnose: (v) => (v === ones * 10 + tens && ones !== tens && ones !== 0 ? "That is backwards. Write the tens first." : v === tens + ones ? "Each stick is 10. Count by tens." : null),
        },
      ],
      wrapUp: `${tensW(tens)} + ${onesW(ones)} = ${n}.`,
    };
  }

  // standard — a regular two-digit number. Never tens === ones (review C1-17).
  const tens = randInt(2, 9);
  let ones: number;
  do {
    ones = randInt(1, 9);
  } while (ones === tens);
  const n = tens * 10 + ones;
  return {
    title: "Tens and ones",
    bucket,
    story: `Look at ${n}. How many tens and ones?`,
    visual: blocksVisual(tens, ones, ["tens", "ones", "sticks"]),
    steps: [
      tensStep(n, tens, ones),
      onesStep(n, ones),
      {
        // Typed, and the box matches its answer (review E1-23 / C1-17). It asks
        // for the 30, not the 6, so it isn't step 2's answer again.
        kind: "number",
        prompt: `${n} = ☐ + ${ones}. What goes in the box?`,
        hint: "Each stick is 10. Count the sticks by tens.",
        showMe: `Count the sticks by tens: ${countTens(tens)}. So ${n} = ${tens * 10} + ${ones}.`,
        // The picture labels only the sticks here, so it stops when the voice does (C2-41).
        showMeHoldMs: countAlongMs(tens),
        explain: `${n} = ${tens * 10} + ${ones}.`,
        answer: tens * 10,
        tone: "a",
        diagnose: (v) => (v === tens ? "Each stick is 10. Count by tens." : null),
      },
    ],
    // Two sentences, one "=" each (review E2-48).
    wrapUp: `${n} = ${tensW(tens)} + ${onesW(ones)}. ${n} = ${tens * 10} + ${ones}.`,
  };
}

export const tensAndOnes: Unit = {
  id: "tensAndOnes",
  title: "Tens and Ones",
  goal: "Find the tens and ones in a number.",
  standard: "1.NBT.2a-c",
  keyIdea: (
    <>
      <p>A stick is 1 ten. A cube is 1 one.</p>
      <p>24 is 2 tens and 4 ones. 14 is 1 ten and 4 ones. 70 is 7 tens and 0 ones.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Decomposition is meant to be derived via the blocks each time, not
  // memorized long-term the way the count sequence itself is (that's
  // Counting to 120's job) — so no periodic re-gating here.
  problems: [{ label: "Tens and Ones", make: tensAndOnesProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: tensAndOnesTest,
};
