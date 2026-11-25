import { useState } from "react";
import { TenAndOnes, holdFor, useWatch } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, pointing, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { teenNumbersTest } from "./TeenNumbersTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot } from "../../../shared/lib/lookHere";
import { HeldControls, WatchButton } from "./ExploreParts";
import { afterTry } from "./labHelp";
import { NUMBER_WORDS, cap, count, countList } from "./words";

// ============================================================================
// CHECK FOR UNDERSTANDING: gates Practice
// ============================================================================
// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: a teen number is one ten and some ones; the ten is written
// first (14, not 41).

const LOOK = {
  count: { target: "u6-count", label: "Explore: count on", say: "Look here. Start at 10. Count on." },
  ones: { target: "u6-ones", label: "Explore: the ones", say: "Look here. Count the ones." },
  write: { target: "u6-write", label: "Explore: write it", say: "Look here. The ten comes first." },
};

const oneTen = (ones: number) => `One ten and ${count(ones, "one", "ones")}`;

const teenQuestion = (n: number, ones: number, done: () => void) => (
  <TypeCheck
    key={n}
    n={n}
    prompt={`${oneTen(ones)}. What number is it?`}
    answer={10 + ones}
    tone="a"
    picture={(m) => <TenAndOnes key={m} tens={1} ones={ones} countOn={m === "show"} />}
    nudge="Start at 10. Count on the ones."
    why={{ [ones * 10 + 1]: "That is backwards. Write the ten first.", [ones]: "Don't forget the ten! Start at 10." }}
    showText={`Watch and listen: 10, ${countList(11, 10 + ones)}.`}
    praise={`Yes! ${10 + ones} is one ten and ${count(ones, "one", "ones")}.`}
    look={LOOK.count}
    onComplete={done}
  />
);

function TeenNumbersCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => teenQuestion(1, 4, done),
        (done) => (
          <TypeCheck
            n={2}
            prompt="16 is one ten and how many ones?"
            answer={6}
            tone="b"
            picture={(m) => <TenAndOnes key={m} tens={1} ones={6} unknownOnes={m === "ask"} countOnes={m === "show"} ringOnes={m === "wrong"} />}
            nudge="Count the dots outside the ten."
            why={{ 16: "That is all of them. Count the ones outside the ten." }}
            showText="Watch and listen: the ones are 1, 2, 3, 4, 5, 6."
            praise="Yes! 16 is one ten and 6 ones."
            look={LOOK.ones}
            onComplete={done}
          />
        ),
        (done) => teenQuestion(3, 9, done),
        (done) => (
          <PickCheck
            n={4}
            prompt="One ten and 3 ones. Which number is it?"
            picture={<TenAndOnes tens={1} ones={3} />}
            showPicture={<TenAndOnes tens={1} ones={3} countOn />}
            showText="Count: 10, 11, 12, 13. The ten comes first."
            options={[
              { id: "31", label: "31" },
              { id: "13", label: "13" },
            ]}
            answer="13"
            why={{ "31": "That is backwards. Write the ten first." }}
            praise="Yes! 13 is one ten and 3 ones."
            look={LOOK.write}
            twin={{
              prompt: "One ten and 2 ones. Which number is it?",
              picture: <TenAndOnes tens={1} ones={2} />,
              showPicture: <TenAndOnes tens={1} ones={2} countOn />,
              options: [
                { id: "21", label: "21" },
                { id: "12", label: "12" },
              ],
              answer: "12",
              why: { "21": "That is backwards. Write the ten first." },
              showText: "Count: 10, 11, 12. The ten comes first.",
              praise: "Yes! 12 is one ten and 2 ones.",
            }}
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
  const [ones, setOnes] = useState(7);
  const teen = 10 + ones;
  // "Build it": count ones into the frame up to 10, then on into the second frame.
  const demo = useWatch(teen, (t) => String(t));
  // "Count on": start at 10 and count only the ones.
  const countOn = useWatch(ones, (t) => String(10 + t));
  const building = demo.playing || demo.tick > 0;
  const held = demo.playing || countOn.playing;

  const clearAll = () => {
    demo.clear();
    countOn.clear();
  };
  const playBuild = () => {
    countOn.clear();
    demo.play();
  };
  const playCountOn = () => {
    demo.clear();
    countOn.play();
  };

  const tenFilled = building ? Math.min(10, demo.tick) : 10;
  const onesShown = building ? Math.max(0, demo.tick - 10) : ones;
  const onesLabels = building ? onesShown : countOn.playing || countOn.tick > 0 ? countOn.tick : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <WatchButton demo={{ ...demo, play: playBuild }} label="Build it" />
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

      <HeldControls held={held}>
        <Stepper
          label="Ones"
          value={ones}
          min={1}
          max={9}
          step={1}
          onChange={(v) => {
            clearAll();
            setOnes(v);
          }}
          tone="b"
        />
      </HeldControls>

      <div {...lookHereSpot("u6-count")} style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
        <div {...lookHereSpot("u6-ones")} style={{ width: "100%" }}>
          <TenAndOnes tens={1} ones={onesShown} tenFilled={tenFilled} tenNumbered={building ? tenFilled : 0} onesNumbered={onesLabels} />
        </div>
        <button type="button" className="btn ghost" disabled={held} onClick={playCountOn}>
          Count on
        </button>
      </div>
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        One ten and {count(ones, "one", "ones")} make {teen}. {cap(NUMBER_WORDS[teen])}.
      </ReadAloud>
      <ReadAloud as="p" {...lookHereSpot("u6-write")}>
        <span data-look-here-key>
          The ten comes first: <b style={{ color: "var(--qa)" }}>1</b>
          <b style={{ color: "var(--qb)" }}>{ones}</b>. 10 + {ones} = {teen}.
        </span>
      </ReadAloud>
      {/* The Check waits until the demo has played once. */}
      {introActive && !demo.seen && (
        <ReadAloud as="p" className="muted small">
          Tap Build it first.
        </ReadAloud>
      )}
      {((introActive && demo.seen) || showCheck) && <TeenNumbersCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

// "teenVocab" and "equationRecord" keep their ids so earned star credit survives.
type Bucket = "composeTeen" | "decomposeTeen" | "teenVocab" | "equationRecord";
const BUCKETS: Bucket[] = ["composeTeen", "decomposeTeen", "teenVocab", "equationRecord"];

function teenNumbersProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "composeTeen") {
    const ones = randInt(1, 9);
    const teen = 10 + ones;
    return {
      title: "Build a teen number",
      bucket,
      story: "Look at the dots.",
      visual: (_done, help) => <TenAndOnes key={help?.showMe ? `show-${help.step}` : "ask"} tens={1} ones={ones} countOn={!!help?.showMe && help.step === 0} countOnes={!!help?.showMe && help.step === 1} ringOnes={(pointing(help, 0) || pointing(help, 1)) && !help?.showMe} />,
      steps: [
        { kind: "number", tone: "a", prompt: "What number is it?", hint: "Start at 10. Count on the ones.", showMe: `Start at 10. Count on: ${countList(11, teen)}.`, showMeHoldMs: holdFor(ones), explain: `10 + ${ones} = ${teen}.`, answer: teen },
        { kind: "number", tone: "b", prompt: `${teen} is one ten and how many ones?`, hint: "Count the dots outside the ten.", showMe: `Count the ones: ${countList(1, ones)}.`, showMeHoldMs: holdFor(ones), explain: `${teen} is one ten and ${count(ones, "one", "ones")}.`, answer: ones },
      ],
      wrapUp: `10 + ${ones} = ${teen}.`,
    };
  }

  if (bucket === "decomposeTeen") {
    const teen = randInt(11, 19);
    const ones = teen - 10;
    // The second number sentence uses a new teen number, so it can't be copied.
    let other = randInt(11, 19);
    while (other === teen) other = randInt(11, 19);
    const otherOnes = other - 10;
    return {
      title: "Break apart a teen number",
      bucket,
      story: `Look at ${teen}.`,
      visual: (done, help) => {
        const at = help?.showMe ? help.step : done;
        const n = at >= 1 ? otherOnes : ones;
        // The full ten and a "?" where the ones go. The ones come in after a wrong try.
        const open = done >= 2 || afterTry(help, at);
        return <TenAndOnes key={`${at}-${help?.showMe ? "show" : "ask"}`} tens={1} ones={n} unknownOnes={!open} countOnes={!!help?.showMe} ringOnes={open && done < 2 && !help?.showMe} />;
      },
      steps: [
        { kind: "number", tone: "b", prompt: `${teen} is one ten and how many ones?`, hint: `Start at 10. Count on to ${teen} on your fingers.`, showMe: `Count the ones: ${countList(1, ones)}.`, showMeHoldMs: holdFor(ones), explain: `${teen} = 10 + ${ones}.`, answer: ones },
        { kind: "number", tone: "b", prompt: `Now ${other}. ${other} = 10 + ☐. What goes in the box?`, hint: `Start at 10. Count on to ${other} on your fingers.`, showMe: `Count the ones: ${countList(1, otherOnes)}.`, showMeHoldMs: holdFor(otherOnes), explain: `${other} = 10 + ${otherOnes}.`, answer: otherOnes },
      ],
      wrapUp: `${teen} = 10 + ${ones}. ${other} = 10 + ${otherOnes}.`,
    };
  }

  if (bucket === "teenVocab") {
    // 12 to 19, so the backwards number is a real, different number.
    const teen = randInt(12, 19);
    const ones = teen - 10;
    const word = NUMBER_WORDS[teen];
    return {
      title: "Teen numbers",
      bucket,
      story: `Listen: ${word}.`,
      // The full ten and a "?" where the ones go. The ones come in after a wrong try.
      visual: (done, help) => {
        const open = done >= 2 || afterTry(help, help?.step ?? -1);
        return <TenAndOnes key={help?.showMe ? `show-${help.step}` : "ask"} tens={1} ones={ones} unknownOnes={!open} countOn={!!help?.showMe && help.step === 0} countOnes={!!help?.showMe && help.step === 1} ringOnes={open && done < 2 && !help?.showMe} />;
      },
      steps: [
        choice(
          { prompt: "Which number is it?", hint: "One ten comes first. Count on.", showMe: `Start at 10. Count on: ${countList(11, teen)}.`, showMeHoldMs: holdFor(ones), explain: `${cap(word)} is ${teen}.` },
          String(teen),
          [`${ones}1`, String(ones)] // misconceptions: written backwards (41 for 14); forgot the ten
        ),
        { kind: "number", tone: "b", prompt: `${cap(word)}. How many ones?`, hint: `Start at 10. Count on to ${teen} on your fingers.`, showMe: `Count the ones: ${countList(1, ones)}.`, showMeHoldMs: holdFor(ones), explain: `${cap(word)} is one ten and ${count(ones, "one", "ones")}.`, answer: ones },
      ],
      wrapUp: `${cap(word)} is one ten and ${count(ones, "one", "ones")}.`,
    };
  }

  // equationRecord: finish the number sentence, then pick the one written right.
  const teen = randInt(11, 19);
  const ones = teen - 10;
  // The pick asks about a new teen number, so it can't repeat the answer just typed.
  let teen2 = randInt(11, 19);
  while (teen2 === teen) teen2 = randInt(11, 19);
  const ones2 = teen2 - 10;
  // 11 looks the same backwards, so its wrong choice forgets the ten instead.
  const wrong = ones2 === 1 ? `10 + 1 = 1` : `10 + ${ones2} = ${ones2}1`;
  return {
    title: "Write the number sentence",
    bucket,
    story: `${oneTen(ones)}.`,
    visual: (done, help) => {
      const at = help?.showMe ? help.step : done;
      return <TenAndOnes key={`${Math.min(at, 1)}-${help?.showMe ? "show" : "ask"}`} tens={1} ones={at >= 1 ? ones2 : ones} countOn={!!help?.showMe} ringOnes={(pointing(help, 0) || pointing(help, 1)) && !help?.showMe} />;
    },
    steps: [
      { kind: "number", tone: "a", prompt: `10 + ${ones} = ☐. What goes in the box?`, hint: "Start at 10. Count on the ones.", showMe: `Start at 10. Count on: ${countList(11, teen)}.`, showMeHoldMs: holdFor(ones), explain: `10 + ${ones} = ${teen}.`, answer: teen },
      choice(
        { prompt: `Now ${oneTen(ones2).toLowerCase()}. Which number sentence matches?`, hint: "The ten comes first.", showMe: `Start at 10. Count on: ${countList(11, teen2)}.`, showMeHoldMs: holdFor(ones2), explain: `10 + ${ones2} = ${teen2}.` },
        `10 + ${ones2} = ${teen2}`,
        [wrong] // misconception: written backwards, or forgot the ten
      ),
    ],
    wrapUp: `10 + ${ones} = ${teen}. 10 + ${ones2} = ${teen2}.`,
  };
}

export const teenNumbers: Unit = {
  id: "teenNumbers",
  title: "Teen Numbers",
  goal: "See teen numbers as ten and more.",
  standard: "K.NBT.1",
  keyIdea: <p>A teen number is one ten and some ones.</p>,
  Explore,
  requiresIntro: true,
  // Reasoned through each time (build or break apart the ten), so no reintroEverySolved.
  problems: [{ label: "Teen Numbers", make: teenNumbersProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: teenNumbersTest,
};
