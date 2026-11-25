import { useState } from "react";
import { SplitGroup, Fingers, holdFor, useWatch } from "../diagrams";
import { randInt, pick } from "../../../shared/lib/math";
import { choice, pointing, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { puttingTogetherAndTakingApartTest } from "./PuttingTogetherAndTakingApartTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";
import { HeldControls, WatchButton } from "./ExploreParts";
import { afterTry, joinPicture, takePicture } from "./labHelp";
import { count, countList, plusTrap, thereAre, verb } from "./words";

// ============================================================================
// CHECK FOR UNDERSTANDING: gates Practice
// ============================================================================
// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: putting together makes more; taking away leaves fewer;
// matching fingers to a number sentence.

const LOOK = {
  join: { target: "u1-join", label: "Explore: put together", say: "Look here. Count both groups." },
  apart: { target: "u1-apart", label: "Explore: take away", say: "Look here. Count the dots left." },
  apartLine: { target: "u1-apart-line", label: "Explore: take away", say: "Look here. Some went away." },
  fingers: { target: "u1-fingers", label: "Explore: fingers", say: "Look here. Count the fingers up." },
  sentence: { target: "u1-sentence", label: "Explore: plus", say: "Look here. Together is plus." },
};

function PuttingTogetherCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="Put 3 and 2 together. How many in all?"
            answer={5}
            tone="a"
            picture={(m) => <SplitGroup total={5} partA={3} toneA="a" toneB="b" countAlong={m === "show" ? { items: 5 } : undefined} />}
            nudge="Count all the dots."
            showText="Watch and listen: 1, 2, 3, 4, 5."
            praise="Yes! 3 + 2 = 5."
            look={LOOK.join}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="Mia has 5 apples. She gives 2 away. How many are left?"
            answer={3}
            tone="a"
            picture={(m) =>
              m === "ask" ? (
                <SplitGroup total={5} partA={5} toneA="a" showDivider={false} />
              ) : (
                <SplitGroup total={5} partA={3} toneA="a" toneB="b" goneB countAlong={m === "show" ? { items: 3 } : undefined} />
              )
            }
            nudge="The faded dots went away. Count the dots left."
            why={{ 5: "2 went away. Count the dots left.", 7: "She gave some away. That makes fewer." }}
            showText="Watch and listen: the dots left are 1, 2, 3."
            praise="Yes! 5 − 2 = 3."
            look={LOOK.apart}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={3}
            prompt="You take some away. Do you have more, or fewer?"
            picture={<SplitGroup total={6} partA={4} toneA="a" toneB="b" goneB />}
            showPicture={<SplitGroup total={6} partA={4} toneA="a" toneB="b" goneB countAlong={{ items: 4 }} />}
            showText="Look: the faded dots went away. There are fewer left."
            options={[
              { id: "more", label: "More" },
              { id: "fewer", label: "Fewer" },
            ]}
            answer="fewer"
            why={{ more: "Some went away. Look at the dots." }}
            praise="Yes! Taking away leaves fewer."
            look={LOOK.apartLine}
            twin={{
              prompt: "You have 8. 3 go away. More, or fewer?",
              picture: <SplitGroup total={8} partA={5} toneA="a" toneB="b" goneB />,
              showPicture: <SplitGroup total={8} partA={5} toneA="a" toneB="b" goneB countAlong={{ items: 5 }} />,
              options: [
                { id: "more", label: "More" },
                { id: "fewer", label: "Fewer" },
              ],
              answer: "fewer",
              why: { more: "Some went away. Look at the dots." },
              showText: "Look: 3 went away. There are fewer left.",
              praise: "Yes! Taking away leaves fewer.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="3 fingers and 1 finger. How many fingers?"
            answer={4}
            tone="a"
            picture={(m) => <Fingers left={3} right={1} countAlong={m === "show"} />}
            nudge="Count the fingers up."
            showText="Watch and listen: 1, 2, 3, 4."
            praise="Yes! 4 fingers."
            look={LOOK.fingers}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={5}
            prompt="Which one matches the fingers?"
            picture={<Fingers left={3} right={1} />}
            showPicture={<Fingers left={3} right={1} countAlong />}
            showText="We put 3 and 1 together. Together is plus: 3 + 1 = 4."
            options={[
              { id: "3+1=4", label: "3 + 1 = 4" },
              { id: "3-1=4", label: "3 − 1 = 4" },
            ]}
            answer="3+1=4"
            why={{ "3-1=4": "Minus means take away. We put the fingers together." }}
            praise="Yes! 3 + 1 = 4."
            look={LOOK.sentence}
            twin={{
              prompt: "2 fingers and 3 fingers. Which one matches?",
              picture: <Fingers left={2} right={3} />,
              showPicture: <Fingers left={2} right={3} countAlong />,
              options: [
                { id: "2+3=5", label: "2 + 3 = 5" },
                { id: "2-3=5", label: "2 − 3 = 5" },
              ],
              answer: "2+3=5",
              why: { "2-3=5": "Minus means take away. We put the fingers together." },
              showText: "We put 2 and 3 together. Together is plus: 2 + 3 = 5.",
              praise: "Yes! 2 + 3 = 5.",
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

const JOIN_START = { a: 2, b: 4 };
const APART_START = { a: 6, b: 2 };

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"join" | "apart">("join");
  const [a, setA] = useState(JOIN_START.a);
  const [b, setB] = useState(JOIN_START.b);
  const join = mode === "join";
  const total = join ? a + b : a;
  const left = join ? a + b : a - b;
  // Join: count every dot. Take away: fade each dot that goes, then count the dots left.
  const demoItems = join ? total : b + left;
  const demo = useWatch(demoItems, (t) => (join ? String(t) : t <= b ? (t === 1 ? "Take away." : null) : String(t - b)));

  const switchMode = (m: "join" | "apart") => {
    demo.clear();
    setMode(m);
    const start = m === "join" ? JOIN_START : APART_START;
    setA(start.a);
    setB(start.b);
  };
  useLookHereRequest((id) => {
    // The fingers spot opens on put together, so it never shows a Check answer.
    if ((id === "u1-join" || id === "u1-sentence" || id === "u1-fingers") && mode !== "join") switchMode("join");
    if ((id === "u1-apart" || id === "u1-apart-line") && mode !== "apart") switchMode("apart");
  });

  const changeA = (v: number) => {
    demo.clear();
    setA(v);
    setB((old) => Math.min(old, join ? 10 - v : v));
  };
  const changeB = (v: number) => {
    demo.clear();
    setB(v);
  };

  const running = demo.playing || demo.tick > 0;
  const goneNow = !join && running ? Math.min(b, demo.tick) : 0;
  const counted = join ? demo.tick : Math.max(0, demo.tick - b);
  const fingersUp = { left: Math.min(5, total), right: Math.max(0, total - 5) };
  // One group per hand whenever each fits on a hand (a group over 5 needs both).
  const oneEach = a <= 5 && b <= 5;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented
          label="Pick one"
          value={mode}
          onChange={switchMode}
          options={[
            { id: "join", label: "Put together" },
            { id: "apart", label: "Take away" },
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
        <Stepper label={join ? "First" : "Start"} value={a} min={1} max={join ? 9 : 10} step={1} onChange={changeA} tone="a" />
        <Stepper label={join ? "Second" : "Take away"} value={b} min={join ? 1 : 0} max={join ? 10 - a : a} step={1} onChange={changeB} tone="b" />
      </HeldControls>

      <div {...lookHereSpot(join ? "u1-join" : "u1-apart")}>
        {join ? (
          <SplitGroup total={total} partA={a} toneA="a" toneB="b" numbered={{ items: counted }} />
        ) : (
          <SplitGroup total={total} partA={total} toneA="a" showDivider={false} goneCount={running ? goneNow : b} numbered={{ items: counted }} />
        )}
      </div>
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        {join ? `${a} and ${b} make ${total}.` : `${total}. Take away ${b}. ${left} ${left === 1 ? "is" : "are"} left.`}
      </ReadAloud>
      {join ? (
        <ReadAloud as="p" {...lookHereSpot("u1-sentence")}>
          <span data-look-here-key>Together is plus: {a} + {b} = {total}.</span>
        </ReadAloud>
      ) : (
        <ReadAloud as="p" {...lookHereSpot("u1-apart-line")}>
          <span data-look-here-key>{b === 0 ? `None went away: ${total} − 0 = ${total}.` : `Taking away leaves fewer: ${total} − ${b} = ${left}.`}</span>
        </ReadAloud>
      )}

      <ReadAloud className="align-stack-wrap" {...lookHereSpot("u1-fingers")}>
        <p>
          <b>Fingers</b>
        </p>
        {join ? (
          <Fingers left={oneEach ? a : fingersUp.left} right={oneEach ? b : fingersUp.right} toneRight={oneEach ? "b" : "a"} />
        ) : (
          <Fingers left={fingersUp.left} right={fingersUp.right} toneRight="a" gone={b} />
        )}
        <p className="muted small" style={{ marginTop: 6 }}>
          {join ? `${count(a, "finger", "fingers")} and ${count(b, "finger", "fingers")} make ${total}.` : `${count(total, "finger", "fingers")}. Put ${b} down. ${left} ${left === 1 ? "is" : "are"} still up.`}
        </p>
      </ReadAloud>
      {/* The Check waits until the demo has played once. */}
      {introActive && !demo.seen && (
        <ReadAloud as="p" className="muted small">
          Tap Watch first.
        </ReadAloud>
      )}
      {((introActive && demo.seen) || showCheck) && <PuttingTogetherCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "addTo" | "takeFrom" | "fingers" | "equation";
const BUCKETS: Bucket[] = ["addTo", "takeFrom", "fingers", "equation"];

const ADD_SCENES = [
  { one: "duck", many: "ducks", comeOne: "swims over", comeMany: "swim over" },
  { one: "bunny", many: "bunnies", comeOne: "hops over", comeMany: "hop over" },
  { one: "balloon", many: "balloons", comeOne: "floats over", comeMany: "float over" },
] as const;
const SUB_SCENES = [
  { one: "bird", many: "birds", goOne: "flies away", goMany: "fly away" },
  { one: "cookie", many: "cookies", goOne: "rolls away", goMany: "roll away" },
  { one: "balloon", many: "balloons", goOne: "pops", goMany: "pop" },
] as const;

/** Wrong choices for a put-together sentence: in range, no bigger number taken from a smaller. */
const wrongJoin = (a: number, b: number, total: number) => [
  total + b <= 10 ? `${total} + ${b} = ${a}` : `${a} + ${b} = ${total < 10 ? total + 1 : total - 1}`, // misconception: total in the wrong place, or a miscount
  `${Math.max(a, b)} − ${Math.min(a, b)} = ${total}`, // misconception: wrong operation
];

/** Wrong choices for a take-away sentence: in range, no bigger number taken from a smaller. */
const wrongTake = (total: number, b: number, a: number) => [
  a >= b ? `${a} − ${b} = ${total}` : `${total} − ${b} = ${a > 1 ? a - 1 : a + 1}`, // misconception: order swapped, or a miscount
  `${total} + ${plusTrap(total, b)} = ${a}`, // misconception: wrong operation
];

function puttingTogetherProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "addTo") {
    const a = randInt(1, 8);
    const b = randInt(1, Math.min(9, 10 - a));
    const total = a + b;
    const scene = pick(ADD_SCENES);
    return {
      title: "Put together",
      bucket,
      story: `${thereAre(a, scene.one, scene.many)} ${b} more ${b === 1 ? `${scene.one} ${scene.comeOne}` : `${scene.many} ${scene.comeMany}`}.`,
      visual: (_done, help) => joinPicture(a, b, 0, help),
      steps: [
        {
          kind: "number",
          prompt: `How many ${scene.many} now?`,
          hint: "Count all the dots, both colors.",
          showMe: `Count them all: ${countList(1, total)}.`,
          showMeHoldMs: holdFor(total),
          explain: `${a} + ${b} = ${total}.`,
          answer: total,
          tone: "a",
        },
        choice(
          { prompt: "Which number sentence matches?", hint: "More came. Together is plus.", showMe: `${a} and ${b} go together. That is plus.`, explain: `${a} + ${b} = ${total}.` },
          `${a} + ${b} = ${total}`,
          wrongJoin(a, b, total)
        ),
      ],
      wrapUp: `${a} and ${b} make ${total}.`,
    };
  }

  if (bucket === "takeFrom") {
    const total = randInt(2, 10);
    const b = randInt(1, total - 1);
    const a = total - b;
    const scene = pick(SUB_SCENES);
    return {
      title: "Take away",
      bucket,
      story: `${thereAre(total, scene.one, scene.many)} ${b} ${verb(b, scene.goOne, scene.goMany)}.`,
      visual: (done, help) => takePicture(total, b, 0, done, help),
      steps: [
        {
          kind: "number",
          prompt: `How many ${scene.many} are left?`,
          hint: `Show ${total} fingers. Put ${b} down.`,
          showMe: `${b} went away. Count the dots left: ${countList(1, a)}.`,
          showMeHoldMs: holdFor(a),
          explain: `${total} − ${b} = ${a}.`,
          answer: a,
          tone: "a",
        },
        choice(
          { prompt: "Which number sentence matches?", hint: "Some went away. That is minus.", showMe: `Start with ${total}. Take away ${b}. That is minus.`, explain: `${total} − ${b} = ${a}.` },
          `${total} − ${b} = ${a}`,
          wrongTake(total, b, a)
        ),
      ],
      wrapUp: `${total} take away ${b} is ${a}.`,
    };
  }

  if (bucket === "fingers") {
    const joining = Math.random() < 0.7;
    // The count stays at 9 or less, so "1 more finger" always has a finger to raise.
    const a = joining ? randInt(1, 5) : 0;
    const b = joining ? randInt(1, Math.min(5, 9 - a)) : 0;
    const start = joining ? a + b : randInt(2, 9);
    const down = joining ? 0 : randInt(1, start - 1);
    const now = start - down;
    const hands = joining ? { left: a, right: b } : { left: Math.min(5, start), right: Math.max(0, start - 5) };
    return {
      title: "Fingers",
      bucket,
      story: joining ? `${count(a, "finger", "fingers")} on one hand. ${count(b, "finger", "fingers")} on the other.` : `${start} fingers are up. Put ${down} down.`,
      visual: (done, help) => {
        const showing = !!help?.showMe;
        const fade = !joining && (done >= 1 || afterTry(help, 0));
        const toneRight = joining ? "b" : "a";
        // The fingers up now. Each group stays on its own hand.
        const nowHands = joining ? hands : { left: Math.min(5, now), right: Math.max(0, now - 5) };
        // The new finger takes the next open spot.
        const newOn: "left" | "right" = joining ? (b < 5 ? "right" : "left") : now < 5 ? "left" : "right";
        const plusOne = newOn === "right" ? { left: nowHands.left, right: nowHands.right + 1 } : { left: nowHands.left + 1, right: nowHands.right };
        // Step 2 shows the new finger only when it is shown or answered.
        if (done >= 2 || (showing && help?.step === 1)) {
          return <Fingers key="more" {...plusOne} toneRight={toneRight} countAlong={showing && help?.step === 1} />;
        }
        // Stuck on "1 more": a faded finger marks where the next one goes.
        if (afterTry(help, 1)) return <Fingers {...plusOne} toneRight={toneRight} ghostOn={newOn} />;
        if (done === 1 && !joining) return <Fingers {...nowHands} toneRight="a" />;
        return <Fingers key={showing ? "show" : "ask"} left={hands.left} right={hands.right} toneRight={toneRight} gone={fade ? down : 0} ring={joining && pointing(help, 0) && !showing} countAlong={showing && help?.step === 0} />;
      },
      steps: [
        {
          kind: "number",
          prompt: joining ? "How many fingers are up?" : "How many fingers are still up?",
          hint: joining ? "Count the fingers on both hands." : `Show ${start} fingers. Put ${down} down.`,
          showMe: `Count the fingers up: ${countList(1, now)}.`,
          showMeHoldMs: holdFor(now),
          explain: joining ? `${a} + ${b} = ${now}.` : `${start} − ${down} = ${now}.`,
          answer: now,
          tone: "a",
        },
        {
          kind: "number",
          prompt: "1 more finger goes up. How many now?",
          hint: "Say the next number.",
          showMe: `Count them all: ${countList(1, now + 1)}.`,
          showMeHoldMs: holdFor(now + 1),
          explain: `${now} + 1 = ${now + 1}.`,
          answer: now + 1,
          tone: "a",
        },
      ],
      wrapUp: joining ? `${a} and ${b} make ${now}.` : `${start} take away ${down} is ${now}.`,
    };
  }

  // equation: pick the sentence that matches the story, then finish it.
  const joining = Math.random() < 0.5;
  if (joining) {
    const a = randInt(1, 8);
    const b = randInt(1, Math.min(9, 10 - a));
    const total = a + b;
    return {
      title: "Write the number sentence",
      bucket,
      story: `${a} fish. ${b} more ${verb(b, "fish comes", "fish come")}.`,
      visual: (_done, help) => joinPicture(a, b, 1, help),
      steps: [
        choice(
          { prompt: "Which number sentence matches?", hint: "More came. Together is plus.", showMe: `${a} and ${b} go together. That is plus.`, explain: `${a} + ${b} = ☐.` },
          `${a} + ${b} = ☐`,
          [`${Math.max(a, b)} − ${Math.min(a, b)} = ☐`] // misconception: wrong operation
        ),
        {
          kind: "number",
          prompt: `${a} + ${b} = ☐. What goes in the box?`,
          hint: "Count all the dots.",
          showMe: `Count them all: ${countList(1, total)}.`,
          showMeHoldMs: holdFor(total),
          explain: `${a} + ${b} = ${total}.`,
          answer: total,
          tone: "a",
        },
      ],
      wrapUp: `${a} + ${b} = ${total}.`,
    };
  }
  const total = randInt(2, 10);
  const b = randInt(1, total - 1);
  const a = total - b;
  return {
    title: "Write the number sentence",
    bucket,
    story: `${total} fish. ${b} ${verb(b, "swims", "swim")} away.`,
    visual: (done, help) => takePicture(total, b, 1, done, help),
    steps: [
      choice(
        { prompt: "Which number sentence matches?", hint: "Some went away. That is minus.", showMe: `Start with ${total}. Take away ${b}. That is minus.`, explain: `${total} − ${b} = ☐.` },
        `${total} − ${b} = ☐`,
        [`${total} + ${plusTrap(total, b)} = ☐`] // misconception: wrong operation
      ),
      {
        kind: "number",
        prompt: `${total} − ${b} = ☐. What goes in the box?`,
        hint: `Show ${total} fingers. Put ${b} down.`,
        showMe: `${b} went away. Count the dots left: ${countList(1, a)}.`,
        showMeHoldMs: holdFor(a),
        explain: `${total} − ${b} = ${a}.`,
        answer: a,
        tone: "a",
      },
    ],
    wrapUp: `${total} − ${b} = ${a}.`,
  };
}

export const puttingTogetherAndTakingApart: Unit = {
  id: "puttingTogetherAndTakingApart",
  title: "Put Together and Take Away",
  goal: "Put groups together. Take some away.",
  standard: "K.OA.1",
  keyIdea: <p>Put together makes more. Take away makes fewer.</p>,
  Explore,
  requiresIntro: true,
  // A skill a student can always re-derive by acting it out again, so no reintroEverySolved.
  problems: [{ label: "Put Together or Take Away", make: puttingTogetherProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: puttingTogetherAndTakingApartTest,
};
