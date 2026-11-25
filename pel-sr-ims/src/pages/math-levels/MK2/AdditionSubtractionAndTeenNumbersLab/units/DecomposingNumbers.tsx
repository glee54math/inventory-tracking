import { useState } from "react";
import { SplitGroup, holdFor, useWatch } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, customStep, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { decomposingNumbersTest } from "./DecomposingNumbersTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot } from "../../../shared/lib/lookHere";
import { HeldControls, WatchButton } from "./ExploreParts";
import { OwnWay, OwnWayHint } from "./OwnWay";
import { afterTry } from "./labHelp";
import { alsoPair, countList, newOwnWayHelp, otherPart } from "./words";

// ============================================================================
// CHECK FOR UNDERSTANDING: gates Practice
// ============================================================================
// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// The misconception: a number has just ONE way to break apart.

const LOOK = {
  split: { target: "u3-split", label: "Explore: two parts", say: "Look here. Count the other part." },
  ways: { target: "u3-ways", label: "Explore: move the dot", say: "Look here. Move one dot over." },
  waysMore: { target: "u3-ways", label: "Explore: move the dot", say: "Look here. There are more ways." },
  same: { target: "u3-same", label: "Explore: same parts", say: "Look here. Make both parts the same." },
};

function DecomposingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="7 is 4 and how many more?"
            answer={3}
            tone="b"
            picture={(m) => (m === "ask" ? <SplitGroup total={7} partA={4} toneA="a" toneB="b" unknownB /> : <SplitGroup total={7} partA={4} toneA="a" toneB="b" countAlong={m === "show" ? { from: 4, items: 3 } : undefined} />)}
            nudge="Count the orange dots."
            showText="Watch and listen: the orange dots are 1, 2, 3."
            praise="Yes! 7 is 4 and 3."
            look={LOOK.split}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="6 is 4 and 2. Another way: 6 is 3 and how many?"
            answer={3}
            tone="b"
            picture={(m) => (
              <div style={{ display: "grid", gap: 8 }}>
                <SplitGroup total={6} partA={4} toneA="a" toneB="b" />
                {m === "ask" ? <SplitGroup total={6} partA={3} toneA="a" toneB="b" unknownB /> : <SplitGroup total={6} partA={3} toneA="a" toneB="b" countAlong={m === "show" ? { from: 3, items: 3 } : undefined} />}
              </div>
            )}
            nudge="Look at the bottom row. Count the orange dots."
            showText="Watch and listen: in the bottom row, the orange dots are 1, 2, 3."
            praise="Yes! 6 is 3 and 3, too."
            look={LOOK.ways}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={3}
            prompt="5 is 4 and 1. Is there another way to make 5?"
            picture={<SplitGroup total={5} partA={4} toneA="a" toneB="b" />}
            showPicture={<SplitGroup total={5} partA={3} toneA="a" toneB="b" />}
            showText="Look: move one dot over. 3 and 2 make 5, too."
            options={[
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ]}
            answer="yes"
            why={{ no: "Move one blue dot over. Is it still 5?" }}
            praise="Yes! 5 is also 3 and 2."
            look={LOOK.waysMore}
            twin={{
              prompt: "6 is 5 and 1. Is there another way?",
              picture: <SplitGroup total={6} partA={5} toneA="a" toneB="b" />,
              showPicture: <SplitGroup total={6} partA={4} toneA="a" toneB="b" />,
              options: [
                { id: "yes", label: "Yes" },
                { id: "no", label: "No" },
              ],
              answer: "yes",
              why: { no: "Move one blue dot over. Is it still 6?" },
              showText: "Look: move one dot over. 4 and 2 make 6, too.",
              praise: "Yes! 6 is also 4 and 2.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="Break 8 into two parts. Make them the same. How many in one part?"
            answer={4}
            tone="b"
            picture={(m) =>
              m === "show" || m === "done" ? (
                <SplitGroup total={8} partA={4} toneA="a" toneB="b" countAlong={m === "show" ? { items: 4 } : undefined} />
              ) : m === "wrong" ? (
                // Two groups of 4 in one color, with a gap between them.
                <div style={{ display: "grid", gap: 18 }}>
                  <SplitGroup total={4} partA={4} toneA="a" showDivider={false} />
                  <SplitGroup total={4} partA={4} toneA="a" showDivider={false} />
                </div>
              ) : (
                <SplitGroup total={8} partA={8} toneA="a" toneB="b" showDivider={false} />
              )
            }
            nudge="Look: two groups. Count one group."
            why={{ 8: "That is all of them. Count one group." }}
            showText="Watch: 4 blue and 4 orange. Both parts have 4."
            praise="Yes! 8 is 4 and 4."
            look={LOOK.same}
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
  const [total, setTotal] = useState(9);
  const [partA, setPartA] = useState(2);
  // The demo walks the first part up, one way per second, and stops before the
  // same two numbers would come back in the other order.
  const demo = useWatch(Math.floor(total / 2), (t) => `${t} and ${total - t}`);
  const shownA = demo.playing && demo.tick > 0 ? demo.tick : partA;
  const shownB = total - shownA;

  const changeTotal = (n: number) => {
    demo.clear();
    setTotal(n);
    setPartA((p) => Math.max(1, Math.min(n - 1, p)));
  };
  const changePart = (n: number) => {
    demo.clear();
    setPartA(n);
  };
  const sameParts = () => {
    demo.clear();
    setTotal(10);
    setPartA(5);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <WatchButton demo={demo} />
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

      <div {...lookHereSpot("u3-ways")}>
        <HeldControls held={demo.playing}>
          <Stepper label="Number" value={total} min={2} max={10} step={1} onChange={changeTotal} tone="c" />
          <Stepper label="Move the dot" value={partA} min={1} max={total - 1} step={1} onChange={changePart} tone="a" />
        </HeldControls>
        <ReadAloud as="p" style={{ margin: "10px 0 0" }}>
          <span data-look-here-key>{total === 2 ? "Try a bigger number." : "Move the dot. Find another way. There are many ways."}</span>
        </ReadAloud>
      </div>

      <div {...lookHereSpot("u3-split")}>
        <SplitGroup total={total} partA={shownA} toneA="a" toneB="b" />
        <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
          <span data-look-here-key>{total} is {shownA} and {shownB}.</span>
        </ReadAloud>
      </div>

      <div {...lookHereSpot("u3-same")} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <button type="button" className="btn ghost" disabled={demo.playing} onClick={sameParts}>
          Same parts
        </button>
        {shownA === shownB && (
          <ReadAloud as="p" style={{ margin: 0 }}>
            <span data-look-here-key>Both parts are the same!</span>
          </ReadAloud>
        )}
      </div>
      {/* The Check waits until the demo has played once. */}
      {introActive && !demo.seen && (
        <ReadAloud as="p" className="muted small">
          Tap Watch first.
        </ReadAloud>
      )}
      {((introActive && demo.seen) || showCheck) && <DecomposingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "decomposeSmall" | "decomposeLarge" | "decomposeSecondWay" | "decomposeEqual";
const BUCKETS: Bucket[] = ["decomposeSmall", "decomposeLarge", "decomposeSecondWay", "decomposeEqual"];

/** The known part and a "?" box. Stuck: the other part appears to count. Show me: it is counted. */
const partPicture = (total: number, a: number, step: number, done: number, help?: VisualHelp) => {
  const open = done > step || afterTry(help, step);
  const showing = !!help?.showMe && help.step === step;
  return open ? (
    <SplitGroup key={showing ? "show" : "open"} total={total} partA={a} toneA="a" toneB="b" ringB={!showing && done <= step} countAlong={showing ? { from: a, items: total - a } : undefined} />
  ) : (
    <SplitGroup total={total} partA={a} toneA="a" toneB="b" unknownB />
  );
};

/** The step the picture should show: "Show me" draws its own step, not the next one. */
const stepNow = (done: number, help?: VisualHelp) => (help?.showMe ? help.step : done);

function decomposingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "decomposeSmall") {
    const total = randInt(4, 5);
    const a = randInt(1, total - 1);
    const b = total - a;
    // An example for "Show me": a way that isn't a and b in either order.
    const ex = otherPart(total, [a, b], randInt);
    const ey = total - ex;
    const ownWay = newOwnWayHelp();
    return {
      title: "Break it apart",
      bucket,
      story: `Break ${total} into two parts.`,
      visual: (done, help) => {
        const at = stepNow(done, help);
        if (at === 0) return partPicture(total, a, 0, done, help);
        return (
          <div style={{ display: "grid", gap: 8 }}>
            <SplitGroup total={total} partA={a} toneA="a" toneB="b" />
            {/* After a miss: a new row with another way, and no numbers. */}
            {(help?.showMe || done >= 2 || afterTry(help, 1)) && <SplitGroup total={total} partA={ex} toneA="a" toneB="b" />}
          </div>
        );
      },
      steps: [
        {
          kind: "number",
          tone: "b",
          prompt: `${total} = ${a} + ☐. What goes in the box?`,
          hint: `Start at ${a}. Count on to ${total} on your fingers.`,
          showMe: `Count the orange dots: ${countList(1, b)}.`,
          showMeHoldMs: holdFor(b),
          explain: `${total} = ${a} + ${b}.`,
          answer: b,
        },
        customStep(
          {
            prompt: "Now write another way.",
            hint: <OwnWayHint total={total} help={ownWay} />,
            showMe: `Here is one more way: ${ex} and ${ey}.`,
            explain: `${ex} and ${ey} make ${total}.`,
          },
          (onDone, onWrong) => (
            <OwnWay total={total} used={[[a, b]]} help={ownWay} onDone={onDone} onWrong={onWrong} />
          ),
          `${total} = ${ex} + ${ey}`
        ),
      ],
      wrapUp: "There is more than one way!",
    };
  }

  if (bucket === "decomposeLarge") {
    const total = randInt(8, 10);
    const a = randInt(1, total - 1);
    const b = total - a;
    const otherA = otherPart(total, [a, b], randInt);
    const otherB = total - otherA;
    return {
      title: "Break it apart",
      bucket,
      story: `Break ${total} into two parts.`,
      visual: (done, help) => {
        const at = stepNow(done, help);
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div key="first">{partPicture(total, a, 0, done, help)}</div>
            {at >= 1 && <div key="second">{partPicture(total, otherA, 1, done, help)}</div>}
          </div>
        );
      },
      steps: [
        {
          kind: "number",
          tone: "b",
          prompt: `${a} and how many make ${total}?`,
          hint: `Start at ${a}. Count on to ${total} on your fingers.`,
          showMe: `Count the orange dots: ${countList(1, b)}.`,
          showMeHoldMs: holdFor(b),
          explain: `${a} and ${b} make ${total}.`,
          answer: b,
        },
        {
          kind: "number",
          tone: "b",
          prompt: `Another way. ${otherA} and how many make ${total}?`,
          hint: `Start at ${otherA}. Count on to ${total} on your fingers.`,
          showMe: `Count the orange dots: ${countList(1, otherB)}.`,
          showMeHoldMs: holdFor(otherB),
          explain: `${otherA} and ${otherB} make ${total}.`,
          answer: otherB,
        },
      ],
      wrapUp: `${total} is ${a} and ${b}. ${total} is also ${otherA} and ${otherB}.`,
    };
  }

  if (bucket === "decomposeSecondWay") {
    // 6 or more, so a third way is left for the Yes/No step.
    const total = randInt(6, 10);
    const a1 = randInt(1, total - 1);
    const b1 = total - a1;
    const a2 = otherPart(total, [a1, b1], randInt);
    const b2 = total - a2;
    const { x, y, isTrue } = alsoPair(total, [a1, b1, a2, b2], randInt);
    return {
      title: "Find another way",
      bucket,
      story: `${total} is ${a1} and ${b1}.`,
      visual: (done, help) => {
        const at = stepNow(done, help);
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <SplitGroup total={total} partA={a1} toneA="a" toneB="b" />
            {partPicture(total, a2, 0, done, help)}
            {at === 1 && afterTry(help, 1) && <SplitGroup total={x + y} partA={x} toneA="a" toneB="b" />}
          </div>
        );
      },
      steps: [
        {
          kind: "number",
          tone: "b",
          prompt: `Another way: ${a2} and how many?`,
          hint: `Start at ${a2}. Count on to ${total} on your fingers.`,
          showMe: `Count the orange dots: ${countList(1, b2)}.`,
          showMeHoldMs: holdFor(b2),
          explain: `${a2} and ${b2} make ${total}.`,
          answer: b2,
        },
        choice(
          { prompt: `Is ${total} also ${x} and ${y}?`, hint: `Count ${x} and ${y} together.`, showMe: `Count them: ${countList(1, x + y)}. That is ${x + y}.`, showMeHoldMs: holdFor(x + y), explain: `${x} and ${y} make ${x + y}.` },
          isTrue ? "Yes" : "No",
          [isTrue ? "No" : "Yes"] // misconception: only one way works, or any close pair works
        ),
      ],
      wrapUp: `${total} is ${a1} and ${b1}. ${total} is also ${a2} and ${b2}.`,
    };
  }

  // decomposeEqual: two parts that are the same.
  const half = randInt(2, 5);
  const total = half * 2;
  return {
    title: "Same parts",
    bucket,
    story: `${total} dots.`,
    visual: (done, help) =>
      done >= 1 || afterTry(help, 0) ? (
        <SplitGroup key={help?.showMe ? "show" : "open"} total={total} partA={half} toneA="a" toneB="b" countAlong={help?.showMe ? { items: half } : undefined} />
      ) : (
        <SplitGroup total={total} partA={total} toneA="a" showDivider={false} />
      ),
    steps: [
      {
        kind: "number",
        prompt: "Break them into two parts. Make them the same. How many in one part?",
        hint: "Make two groups. Make them the same.",
        showMe: `Count the blue dots: ${countList(1, half)}.`,
        showMeHoldMs: holdFor(half),
        explain: `${half} and ${half} make ${total}.`,
        answer: half,
      },
    ],
    wrapUp: `${total} is ${half} and ${half}.`,
  };
}

export const decomposingNumbers: Unit = {
  id: "decomposingNumbers",
  title: "Break Numbers Apart",
  goal: "Break a number into two parts.",
  standard: "K.OA.3",
  keyIdea: <p>A number can break apart many ways.</p>,
  Explore,
  requiresIntro: true,
  // "More than one way" can always be worked out again, so no reintroEverySolved.
  problems: [{ label: "Breaking Apart", make: decomposingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: decomposingNumbersTest,
};
