import { useId, useState } from "react";
import { BaseTenBlocks, BUNDLE_MS, countAlongMs } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { pointing, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { addingTwoDigitOneDigitTest } from "./AddingTwoDigitOneDigitTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { getState, sayText } from "../../../shared/tts/speechEngine";
import { CheckSequence, TypeCheck, type CheckMode } from "../../../shared/components/KCheck";
import { lookHereSpot } from "../../../shared/lib/lookHere";
import { countOnes, countTens, onesW, tensW } from "./words";

// ============================================================================
// SHARED BREAKDOWN — the one function both Explore's diagram AND Practice's
// step-checking use, so the pictured state (the cubes before they make a new
// ten) and the graded answer can never disagree with each other.
// ============================================================================

export interface RegroupBreakdown {
  tens: number;
  ones: number;
  sumOnes: number; // can exceed 9 — the cubes before they make a new ten
  regrouped: boolean;
  newTens: number;
  newOnes: number;
  total: number;
}

export function regroupBreakdown(twoDigit: number, add: number): RegroupBreakdown {
  const tens = Math.floor(twoDigit / 10);
  const ones = twoDigit % 10;
  const sumOnes = ones + add;
  const regrouped = sumOnes > 9;
  const newOnes = sumOnes % 10;
  const newTens = tens + Math.floor(sumOnes / 10);
  return { tens, ones, sumOnes, regrouped, newTens, newOnes, total: twoDigit + add };
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// K–1 design (shared/components/KCheck.tsx), review round 1: one question at
// a time over sticks and cubes (the added cubes in violet), every answer
// typed on the number pad. Targets: adding to the ones (34 + 5), counting
// the ones past 10 (38 + 5 = 13 ones), making the new ten (4 tens), and the
// answer that forgets the new ten (33). Explore starts at 27 + 5 (review
// C1-05, C3-44: 27 + 6 made 13 ones, CFU item 2's answer), so it never shows
// these answers: 27 + 5 shows 12 ones, 3 tens, 32.

// Review C2-37: items 1-2 point at the cubes and the Add button (u5-newten),
// not the one text line, since the picture is what teaches them.
const LOOK = {
  ones: { target: "u5-newten", label: "Explore: add cubes", say: "Look here. Tap Add. Count the cubes." },
  newTen: { target: "u5-newten", label: "Explore: make a new ten", say: "Look here. 10 ones make a new ten." },
};

/** Sticks and cubes for `tens` tens + `ones` ones + `add` new cubes. */
const addPicture =
  (tens: number, ones: number, add: number, focus: "ones" | "newTen" | "total") =>
  (m: CheckMode) => {
    if (focus === "ones")
      return (
        <BaseTenBlocks key={m} tens={tens} ones={ones} extraOnes={add} tenTone="a" oneTone="b" ring={m === "wrong" ? "ones" : undefined} labels={m === "show" || m === "done" ? { ones: "count" } : undefined} countAlong={m === "show"} countFrom />
      );
    const b = regroupBreakdown(tens * 10 + ones, add);
    if (focus === "newTen")
      return m === "done" ? (
        <BaseTenBlocks tens={b.newTens} ones={b.newOnes} tenTone="a" oneTone="b" labels={{ tens: "count" }} />
      ) : (
        <BaseTenBlocks key={m} tens={tens} ones={ones} extraOnes={add} tenTone="a" oneTone="b" flagOverflow={m !== "ask"} bundle={m === "show"} />
      );
    return (
      <BaseTenBlocks
        key={m}
        tens={b.newTens}
        ones={b.newOnes}
        tenTone="a"
        oneTone="b"
        ring={m === "wrong" ? "tens" : undefined}
        labels={m === "show" || m === "done" ? { tens: "value", ones: "total" } : undefined}
        countAlong={m === "show"}
      />
    );
  };

function AddingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="34 + 5 = ?"
            answer={39}
            picture={addPicture(3, 4, 5, "ones")}
            nudge="Add the ones first: 4 and 5."
            why={{ 84: "Add 5 to the ones, not the tens.", 9: "Keep the 3 tens too." }}
            showText="Watch and listen: 4. Then 5, 6, 7, 8, 9 ones. 3 tens and 9 ones."
            praise="Yes! 34 + 5 = 39."
            look={LOOK.ones}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="38 + 5. How many ones now?"
            answer={13}
            tone="b"
            picture={addPicture(3, 8, 5, "ones")}
            nudge="Count all the cubes."
            why={{ 3: "Count all the cubes.", 43: "Count just the cubes." }}
            showText="Watch and listen: 8. Then 9, 10, 11, 12, 13 ones."
            praise="Yes! 8 and 5 make 13 ones."
            look={LOOK.ones}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="10 of the ones make a new ten. How many tens now?"
            answer={4}
            tone="a"
            picture={addPicture(3, 8, 5, "newTen")}
            nudge="Add the new ten to the 3 tens."
            why={{ 3: "Don't forget the new ten.", 13: "Count the sticks." }}
            showText="Watch: 10 cubes make a new stick. Count the sticks."
            praise="Yes! 4 tens now."
            look={LOOK.newTen}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="38 + 5 = ?"
            answer={43}
            picture={addPicture(3, 8, 5, "total")}
            nudge="Count the sticks by tens. Then count on the cubes."
            why={{ 33: "Don't forget the new ten.", 313: "10 ones make a new ten.", 413: "10 ones make a new ten." }}
            showText="Watch and listen: 10, 20, 30, 40. Then 41, 42, 43."
            praise="Yes! 38 + 5 = 43."
            look={LOOK.newTen}
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
  const [start, setStart] = useState(27);
  const [add, setAdd] = useState(5);
  // "start" → "adding" (the starting cubes keep their numbers; each new cube
  // comes in one a second and is counted on aloud, review C2-34) → "added"
  // → "making" (10 cubes slide into a new stick) → "done". The next button
  // stays gray while an animation plays (review C1-27).
  const [stage, setStage] = useState<"start" | "adding" | "added" | "making" | "done">("start");
  const [run, setRun] = useState(0);
  const voiceId = useId();
  const b = regroupBreakdown(start, add);
  const sayIt = (text: string) => {
    if (getState().autoRead) sayText(voiceId, text);
  };

  const restart = () => {
    setStage("start");
    setRun((r) => r + 1);
  };
  const setStartNum = (v: number) => {
    setStart(v);
    restart();
  };
  const setAddNum = (v: number) => {
    setAdd(v);
    restart();
  };
  const busy = stage === "adding" || stage === "making";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Stepper label="Start with" value={start} min={10} max={89} step={1} onChange={setStartNum} tone="a" />
        <Stepper label="Add" value={add} min={1} max={9} step={1} onChange={setAddNum} tone="c" />
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

      <div {...lookHereSpot("u5-newten")} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {stage === "start" && <BaseTenBlocks tens={b.tens} ones={b.ones} tenTone="a" oneTone="b" labels={{ tens: "value", ones: "count" }} />}
        {(stage === "adding" || stage === "added") && (
          <BaseTenBlocks
            key={`add${run}`}
            tens={b.tens}
            ones={b.ones}
            extraOnes={add}
            tenTone="a"
            oneTone="b"
            labels={{ ones: "count" }}
            countAlong={stage === "adding"}
            countFrom
            flagOverflow={stage === "added"}
            onCount={(k) => sayIt(String(k))}
            onAnimDone={() => setStage((s) => (s === "adding" ? "added" : s))}
          />
        )}
        {stage === "making" && (
          <BaseTenBlocks
            key={`make${run}`}
            tens={b.tens}
            ones={b.ones}
            extraOnes={add}
            tenTone="a"
            oneTone="b"
            bundle
            onAnimDone={() => {
              setStage("done");
              sayIt(`${start} + ${add} = ${b.total}`);
            }}
          />
        )}
        {stage === "done" && <BaseTenBlocks tens={b.newTens} ones={b.newOnes} tenTone="a" oneTone="b" labels={{ tens: "value", ones: "total" }} />}

        <div className="control-row" style={{ alignItems: "center" }} data-readaloud-part>
          {stage === "start" && (
            <button className="btn primary" onClick={() => setStage("adding")}>
              Add {add} {add === 1 ? "cube" : "cubes"}
            </button>
          )}
          {(stage === "adding" || stage === "added") && b.regrouped && (
            <button className="btn primary" disabled={busy} onClick={() => setStage("making")}>
              Make a new ten
            </button>
          )}
          {(stage === "adding" || stage === "added") && !b.regrouped && (
            <button
              className="btn primary"
              disabled={busy}
              onClick={() => {
                setStage("done");
                sayIt(`${start} + ${add} = ${b.total}`);
              }}
            >
              See the answer
            </button>
          )}
          {stage === "done" && (
            <button className="btn ghost" onClick={restart}>
              Start again
            </button>
          )}
        </div>
        {stage === "added" && (
          <ReadAloud as="p" className="feedback good" role="alert">
            {b.regrouped ? `${b.ones} and ${add} make ${b.sumOnes} ones. That is more than 9. Make a new ten.` : "The ones are 9 or less. The tens stay the same."}
          </ReadAloud>
        )}
        {stage === "done" && (
          <ReadAloud as="p" style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>
            {start} + {add} = {b.total}
          </ReadAloud>
        )}
        <ReadAloud as="p" className="muted small" style={{ margin: 0 }}>
          <span data-look-here-key>10 ones make a new ten.</span>
        </ReadAloud>
      </div>
      <ReadAloud as="p" className="muted small" {...lookHereSpot("u5-ones")}>
        <span data-look-here-key>Add the ones first.</span> Then count the sticks and cubes.
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <AddingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "noRegroup" | "regroup";
const BUCKETS: Bucket[] = ["noRegroup", "regroup"];

/**
 * The blocks for an adding problem. Before help: just the starting sticks and
 * cubes (what the problem gives). The added cubes (violet) come in as help on
 * the ones step, counted aloud on "Show me"; a wrong try on the new-ten step
 * rings the 10 cubes, and "Show me" slides them into a new stick; the total
 * step's "Show me" counts by tens, then on (review C1-06).
 */
const addVisual = (b: RegroupBreakdown, add: number, steps: ("ones" | "newTen" | "total")[]) => (done: number, help?: VisualHelp) => {
  const i = help?.step ?? done;
  const step = steps[i];
  const showing = !!help?.showMe && help.step === i;
  const point = pointing(help, i) && !showing;
  // Index of the ones step / new-ten step in this problem.
  const onesDone = done > steps.indexOf("ones");
  const tenIdx = steps.indexOf("newTen");
  const tenDone = tenIdx >= 0 ? done > tenIdx : onesDone;

  if (step === "ones" && (point || showing))
    return <BaseTenBlocks key={showing ? "show" : "ring"} tens={b.tens} ones={b.ones} extraOnes={add} tenTone="a" oneTone="b" ring={point ? "ones" : undefined} labels={showing ? { ones: "count" } : undefined} countAlong={showing} countFrom />;
  if (step === "newTen" && (point || showing))
    return <BaseTenBlocks key={showing ? "show" : "ring"} tens={b.tens} ones={b.ones} extraOnes={add} tenTone="a" oneTone="b" flagOverflow bundle={showing} />;
  if (step === "total" && showing)
    return <BaseTenBlocks key="show" tens={b.newTens} ones={b.newOnes} tenTone="a" oneTone="b" labels={{ tens: "value", ones: "total" }} countAlong />;
  if (step === "total" && point)
    return <BaseTenBlocks key="ring" tens={tenDone ? b.newTens : b.tens} ones={tenDone ? b.newOnes : b.sumOnes} tenTone="a" oneTone="b" ring="tens" />;
  if (tenDone && done > 0) return <BaseTenBlocks tens={b.newTens} ones={b.newOnes} tenTone="a" oneTone="b" />;
  if (onesDone) return <BaseTenBlocks tens={b.tens} ones={b.ones} extraOnes={add} tenTone="a" oneTone="b" flagOverflow={b.regrouped} />;
  return <BaseTenBlocks tens={b.tens} ones={b.ones} tenTone="a" oneTone="b" />;
};

/** "9, 10, 11" — the numbers said counting on `add` cubes after `from`. */
const countOn = (from: number, add: number) => Array.from({ length: add }, (_, i) => from + i + 1).join(", ");

function addingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  const regroup = bucket === "regroup";
  let tens: number, ones: number, add: number, b: RegroupBreakdown;
  do {
    tens = randInt(1, 8);
    ones = randInt(regroup ? 1 : 0, regroup ? 9 : 8);
    add = randInt(1, 9);
    b = regroupBreakdown(tens * 10 + ones, add);
  } while (b.regrouped !== regroup);
  const n = tens * 10 + ones;
  const onesStep = {
    kind: "number" as const,
    prompt: `${onesW(ones)} and ${onesW(add)}. How many ones?`,
    hint: "Count all the cubes.",
    // Review C3-43: count ON, like Explore (the starting cubes are numbered at
    // once, then each new cube). With 0 ones to start, it is a count from 1.
    showMe:
      ones === 0
        ? `Count the cubes: ${countOnes(b.sumOnes)}. That is ${onesW(b.sumOnes)}.`
        : `Count the cubes: ${ones}. Then ${countOn(ones, add)}. That is ${onesW(b.sumOnes)}.`,
    showMeHoldMs: countAlongMs(add),
    explain: `${ones} + ${add} = ${b.sumOnes}.`,
    answer: b.sumOnes,
    tone: "b" as const,
  };
  const totalStep = {
    kind: "number" as const,
    prompt: `${n} + ${add} = ?`,
    hint: regroup ? "Count the sticks by tens. Then count on the cubes." : "The tens stay the same. Count on the cubes.",
    showMe: `Count by tens: ${countTens(b.newTens)}.${b.newOnes > 0 ? ` Then count on ${onesW(b.newOnes)}.` : ""} ${n} + ${add} = ${b.total}.`,
    showMeHoldMs: countAlongMs(b.newTens + b.newOnes),
    explain: `${n} + ${add} = ${b.total}.`,
    answer: b.total,
    diagnose: (v: number) =>
      regroup && v === tens * 10 + b.newOnes
        ? "Did you make a new ten?"
        : regroup && v === tens * 100 + b.sumOnes
          ? "10 ones make a new ten."
          : v === (tens + add) * 10 + ones
            ? "Add the ones to the ones, not the tens."
            : null,
  };

  if (regroup) {
    return {
      title: "Make a new ten",
      bucket,
      story: `What is ${n} + ${add}?`,
      visual: addVisual(b, add, ["ones", "newTen", "total"]),
      steps: [
        onesStep,
        {
          kind: "number",
          prompt: "10 of the ones make a new ten. How many tens now?",
          hint: `Add the new ten to the ${tensW(tens)}.`,
          showMe: `Watch: 10 cubes make a new stick. ${tensW(tens)} and 1 more ten is ${tensW(b.newTens)}.`,
          showMeHoldMs: BUNDLE_MS + 500,
          explain: `${tens} + 1 = ${b.newTens}.`,
          answer: b.newTens,
          tone: "a",
          diagnose: (v) => (v === tens ? "Don't forget the new ten." : null),
        },
        totalStep,
      ],
      wrapUp: `${n} + ${add} = ${b.total}. 10 ones made a new ten.`,
    };
  }

  return {
    title: "Add ones",
    bucket,
    story: `What is ${n} + ${add}?`,
    visual: addVisual(b, add, ["ones", "total"]),
    steps: [onesStep, totalStep],
    wrapUp: `${n} + ${add} = ${b.total}. No new ten this time.`,
  };
}

export const addingTwoDigitOneDigit: Unit = {
  id: "addingTwoDigitOneDigit",
  title: "Adding Ones to a Number",
  goal: "Add ones to a number like 38.",
  standard: "1.NBT.4",
  keyIdea: (
    <>
      <p>Add the ones first.</p>
      <p>10 or more ones? Make a new ten.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Reasoned through via the add-the-ones-and-make-a-new-ten strategy each
  // time, not a memorized fact.
  problems: [{ label: "Adding Ones", make: addingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: addingTwoDigitOneDigitTest,
};
