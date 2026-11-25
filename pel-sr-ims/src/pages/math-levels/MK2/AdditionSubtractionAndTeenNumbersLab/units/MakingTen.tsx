import { useState } from "react";
import { TenFrame, holdFor, useCountAlong, useWatch } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, pointing, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { makingTenTest } from "./MakingTenTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot } from "../../../shared/lib/lookHere";
import { HeldControls, WatchButton, useCheckRound } from "./ExploreParts";
import { countList } from "./words";

// ============================================================================
// CHECK FOR UNDERSTANDING: gates Practice, and comes back every 20 solves
// ============================================================================
// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: what makes 10 fills the empty boxes; a pair must really fill
// every box. A re-check uses the second fixed set of numbers.

const LOOK = {
  fill: { target: "u4-fill", label: "Explore: the boxes", say: "Look here. Count the empty boxes." },
  full: { target: "u4-full", label: "Explore: every box", say: "Look here. 10 fills every box." },
};

/** The boxes fill in one per second, each numbered from 1. */
function FillAlong({ start, active = true }: { start: number; active?: boolean }) {
  const partner = 10 - start;
  const shown = useCountAlong(active, partner);
  return <TenFrame filled={start} tone="a" fillB={shown} fillBTone="b" numberFrom={start} numberCount={shown} />;
}

const partnerQuestion = (n: number, start: number, done: () => void) => (
  <TypeCheck
    key={`${n}-${start}`}
    n={n}
    prompt={`${start} and how many make 10?`}
    answer={10 - start}
    tone="b"
    picture={(m) => (m === "show" ? <FillAlong start={start} /> : <TenFrame filled={start} tone="a" fillB={m === "done" ? 10 - start : 0} fillBTone="b" ringEmpty={m === "wrong"} />)}
    nudge="Count the empty boxes."
    showText={`Watch: the empty boxes fill in. ${start} and ${10 - start} make 10.`}
    praise={`Yes! ${start} and ${10 - start} make 10.`}
    look={LOOK.fill}
    onComplete={done}
  />
);

const yesNo = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
];

// The Yes/No pair is false in the first set and true in the second, so a
// returning student can't tap the same answer from memory.
const SETS = [
  { firsts: [6, 7, 2], pair: [5, 4], twin: [6, 3] },
  { firsts: [3, 8, 4], pair: [7, 3], twin: [9, 1] },
] as const;

/** The show-it line, praise and answer for "Do x and y make 10?". */
const pairLines = (x: number, y: number) =>
  x + y === 10
    ? { answer: "yes", showText: `Look: every box is full. ${x} and ${y} make 10.`, praise: `Yes! Every box is full. ${x} and ${y} make 10.` }
    : { answer: "no", showText: `Look: one box is still empty. ${x} and ${y} make ${x + y}.`, praise: `Right! One box is empty. ${x} and ${y} make ${x + y}.` };

function MakingTenCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const { round, finish } = useCheckRound("makingTen", onComplete);
  const set = SETS[round];
  const [p, q] = set.pair;
  const [tp, tq] = set.twin;
  const main = pairLines(p, q);
  const other = pairLines(tp, tq);
  const wrongPick = main.answer === "no" ? "yes" : "no";
  return (
    <CheckSequence
      onComplete={finish}
      items={[
        (done) => partnerQuestion(1, set.firsts[0], done),
        (done) => partnerQuestion(2, set.firsts[1], done),
        (done) => partnerQuestion(3, set.firsts[2], done),
        (done) => (
          <PickCheck
            n={4}
            prompt={`Do ${p} and ${q} make 10?`}
            picture={<TenFrame filled={p} tone="a" fillB={q} fillBTone="b" />}
            showPicture={<TenFrame filled={p} tone="a" fillB={q} fillBTone="b" ringEmpty />}
            showText={main.showText}
            options={yesNo}
            answer={main.answer}
            why={{ [wrongPick]: "Look again. Is every box full?" }}
            praise={main.praise}
            look={LOOK.full}
            twin={{
              prompt: `Do ${tp} and ${tq} make 10?`,
              picture: <TenFrame filled={tp} tone="a" fillB={tq} fillBTone="b" />,
              showPicture: <TenFrame filled={tp} tone="a" fillB={tq} fillBTone="b" ringEmpty />,
              options: yesNo,
              answer: other.answer,
              why: { [wrongPick]: "Look again. Is every box full?" },
              showText: other.showText,
              praise: other.praise,
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
  const [n, setN] = useState(1);
  const [revealed, setRevealed] = useState(false);
  const partner = 10 - n;
  const demo = useWatch(partner, (t) => String(t));
  const running = demo.playing || demo.tick > 0;
  const filledB = running ? demo.tick : revealed ? partner : 0;
  const showing = filledB === partner;

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

      <HeldControls held={demo.playing}>
        <Stepper
          label="Number"
          value={n}
          min={1}
          max={9}
          step={1}
          onChange={(v) => {
            demo.clear();
            setN(v);
            setRevealed(false);
          }}
          tone="a"
        />
      </HeldControls>

      <div {...lookHereSpot("u4-fill")} style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
        <TenFrame filled={n} tone="a" fillB={filledB} fillBTone="b" numberFrom={n} numberCount={running ? demo.tick : 0} />
        <button
          className="btn primary"
          style={{ width: "fit-content" }}
          disabled={demo.playing}
          onClick={() => {
            demo.clear();
            setRevealed(!showing);
          }}
        >
          {showing ? "Hide" : "Show me"}
        </button>
        <ReadAloud as="p" className="feedback good" style={{ minHeight: 24, margin: 0 }}>
          <span data-look-here-key>{showing ? `${n} and ${partner} make 10.` : "How many empty boxes?"}</span>
        </ReadAloud>
      </div>
      <ReadAloud as="p" {...lookHereSpot("u4-full")}>
        <span data-look-here-key>10 fills every box.</span>
      </ReadAloud>
      {/* The Check waits until the demo has played once. */}
      {introActive && !demo.seen && (
        <ReadAloud as="p" className="muted small">
          Tap Watch first.
        </ReadAloud>
      )}
      {((introActive && demo.seen) || showCheck) && <MakingTenCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "smallComplement" | "nearTenComplement" | "middleComplement" | "verifyPair";
const BUCKETS: Bucket[] = ["smallComplement", "nearTenComplement", "middleComplement", "verifyPair"];

function makingTenProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];

  if (bucket === "smallComplement" || bucket === "nearTenComplement" || bucket === "middleComplement") {
    const n = bucket === "smallComplement" ? randInt(1, 3) : bucket === "nearTenComplement" ? randInt(7, 9) : randInt(4, 6);
    const partner = 10 - n;
    // The pick asks about a new number, so it can't repeat the answer just typed.
    let m = randInt(1, 9);
    while (m === n || m === partner) m = randInt(1, 9);
    const mPartner = 10 - m;
    const wrong = mPartner === 1 ? 2 : mPartner === 9 ? 8 : Math.random() < 0.5 ? mPartner - 1 : mPartner + 1;
    return {
      title: "Make 10",
      bucket,
      story: "Look at the boxes.",
      visual: (done, help) => {
        if (help?.showMe && help.step === 0) return <FillAlong key="show" start={n} />;
        if (help?.showMe && help.step === 1) return <FillAlong key="show-new" start={m} />;
        if (done >= 2) return <TenFrame filled={m} tone="a" fillB={mPartner} />;
        if (done === 1) return <TenFrame filled={m} tone="a" ringEmpty={pointing(help, 1)} />;
        return <TenFrame filled={n} tone="a" ringEmpty={pointing(help, 0)} />;
      },
      steps: [
        {
          kind: "number",
          tone: "b",
          prompt: `${n} and how many make 10?`,
          hint: "Count the empty boxes.",
          showMe: `The empty boxes fill in: ${countList(1, partner)}.`,
          showMeHoldMs: holdFor(partner),
          explain: `${n} and ${partner} make 10.`,
          answer: partner,
        },
        choice(
          { prompt: `Now ${m}. Which one makes 10?`, hint: "Count the empty boxes.", showMe: `${m} and ${mPartner} fill every box.`, showMeHoldMs: holdFor(mPartner), explain: `${m} + ${mPartner} = 10.` },
          `${m} + ${mPartner} = 10`,
          [`${m} + ${wrong} = 10`] // misconception: off by one when counting the empty boxes
        ),
      ],
      wrapUp: `${n} and ${partner} make 10. ${m} and ${mPartner} make 10.`,
    };
  }

  // verifyPair: Yes or No, decided first so each is right about half the time.
  const p = randInt(1, 9);
  const actual = 10 - p;
  const isTrue = Math.random() < 0.5;
  const shown = isTrue ? actual : actual > 1 && Math.random() < 0.5 ? actual - 1 : actual + 1;
  // The typed step uses a new number, so it can't be copied from the question.
  let m = randInt(1, 9);
  while (m === p || m === shown) m = randInt(1, 9);
  const mPartner = 10 - m;
  return {
    title: "Do they make 10?",
    bucket,
    story: `${p} and ${shown}.`,
    visual: (done, help) => {
      const at = help?.showMe ? help.step : done;
      if (at === 0) {
        if (help?.showMe) return <TenFrame filled={p} tone="a" fillB={Math.min(shown, actual)} overflow={Math.max(0, shown - actual)} ringEmpty={shown < actual} />;
        return <TenFrame filled={p} tone="a" ringEmpty={pointing(help, 0)} />;
      }
      if (help?.showMe && help.step === 1) return <FillAlong key="show" start={m} />;
      if (done >= 2) return <TenFrame filled={m} tone="a" fillB={mPartner} />;
      return <TenFrame filled={m} tone="a" ringEmpty={pointing(help, 1)} />;
    },
    steps: [
      choice(
        {
          prompt: `Do ${p} and ${shown} make 10?`,
          hint: `Count the empty boxes. Is it ${shown}?`,
          showMe: isTrue ? `${p} and ${shown} fill every box.` : shown < actual ? "One box is still empty." : "One dot does not fit.",
          explain: `${p} and ${shown} make ${p + shown}.`,
        },
        isTrue ? "Yes" : "No",
        [isTrue ? "No" : "Yes"]
      ),
      {
        kind: "number",
        tone: "b",
        prompt: `Now ${m}. ${m} and how many make 10?`,
        hint: "Count the empty boxes.",
        showMe: `The empty boxes fill in: ${countList(1, mPartner)}.`,
        showMeHoldMs: holdFor(mPartner),
        explain: `${m} and ${mPartner} make 10.`,
        answer: mPartner,
      },
    ],
    wrapUp: `${m} and ${mPartner} make 10.`,
  };
}

export const makingTen: Unit = {
  id: "makingTen",
  title: "Make 10",
  goal: "Find what makes 10.",
  standard: "K.OA.4",
  keyIdea: <p>Fill the empty boxes to make 10.</p>,
  Explore,
  requiresIntro: true,
  // The pairs that make 10 are a small fixed set to know by heart, so the
  // Check comes back now and then (with its second set of numbers).
  reintroEverySolved: 20,
  problems: [{ label: "Make 10", make: makingTenProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: makingTenTest,
};
