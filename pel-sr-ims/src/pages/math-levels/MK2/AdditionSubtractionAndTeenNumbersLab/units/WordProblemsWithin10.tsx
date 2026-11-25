import { useState } from "react";
import { CompareRows, ObjectGroup, SplitGroup, holdFor, useWatch } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, pointing, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { wordProblemsWithin10Test } from "./WordProblemsWithin10Test";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";
import { HeldControls, WatchButton } from "./ExploreParts";
import { afterTry, colorNames, joinPicture, takePicture } from "./labHelp";
import { ITEM_WORDS, count, countList, nIs, plusTrap, type ItemWord } from "./words";

// ============================================================================
// CHECK FOR UNDERSTANDING: gates Practice
// ============================================================================
// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: more come (add to); some go away (take from); two groups
// together (put together); who has more, with the rows lined up.

const LOOK = {
  addTo: { target: "u2-addto", label: "Explore: more come", say: "Look here. Count them all." },
  takeFrom: { target: "u2-takefrom", label: "Explore: some go away", say: "Look here. Count the dots left." },
  together: { target: "u2-together", label: "Explore: two colors", say: "Look here. Count both colors." },
  compare: { target: "u2-compare", label: "Explore: who has more", say: "Look here. Line them up." },
};

const twoRows = (top: number, bottom: number, ring?: number) => (
  <div style={{ display: "grid", gap: 6 }}>
    <ObjectGroup count={top} arrangement="line" tone="a" alignLeft ringFrom={ring} />
    <ObjectGroup count={bottom} arrangement="line" tone="b" alignLeft />
  </div>
);

function WordProblemsCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <TypeCheck
            n={1}
            prompt="Jen has 3 stickers. She gets 2 more. How many now?"
            answer={5}
            tone="a"
            picture={(m) => <SplitGroup total={5} partA={3} toneA="a" toneB="b" countAlong={m === "show" ? { items: 5 } : undefined} />}
            nudge="Blue is what she had. Orange is new. Count them all."
            showText="Watch and listen: 1, 2, 3, 4, 5."
            praise="Yes! 3 + 2 = 5 stickers."
            look={LOOK.addTo}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="Sam has 6 crackers. He eats 2. How many are left?"
            answer={4}
            tone="a"
            picture={(m) =>
              m === "ask" ? (
                <SplitGroup total={6} partA={6} toneA="a" showDivider={false} />
              ) : (
                <SplitGroup total={6} partA={4} toneA="a" toneB="b" goneB countAlong={m === "show" ? { items: 4 } : undefined} />
              )
            }
            nudge="The faded dots went away. Count the dots left."
            why={{ 8: "He eats some. That leaves fewer.", 6: "He eats 2. Those are gone." }}
            showText="Watch: 2 are gone. The dots left are 1, 2, 3, 4."
            praise="Yes! 6 − 2 = 4 crackers."
            look={LOOK.takeFrom}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="A jar has marbles. 4 are orange. 3 are blue. How many in all?"
            answer={7}
            tone="a"
            picture={(m) => <SplitGroup total={7} partA={4} toneA="b" toneB="a" showDivider={false} countAlong={m === "show" ? { items: 7 } : undefined} />}
            nudge="Count all the marbles, both colors."
            why={{ 4: "That is one color. Count both colors.", 3: "That is one color. Count both colors." }}
            showText="Watch and listen: 1, 2, 3, 4, 5, 6, 7."
            praise="Yes! 4 + 3 = 7 marbles."
            look={LOOK.together}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="Mia has 5 apples. Theo has 3 apples. Who has more?"
            picture={twoRows(5, 3)}
            showPicture={twoRows(5, 3, 3)}
            showText="Look: line them up. Mia's row has extras. Mia has more."
            options={[
              { id: "mia", label: <span style={{ color: "var(--qa)", fontWeight: 800 }}>Mia</span> },
              { id: "theo", label: <span style={{ color: "var(--qb)", fontWeight: 800 }}>Theo</span> },
            ]}
            answer="mia"
            why={{ theo: "Line them up. Whose row is longer?" }}
            praise="Yes! Mia has more apples."
            look={LOOK.compare}
            twin={{
              prompt: "Ana has 6. Leo has 2. Who has more?",
              picture: twoRows(6, 2),
              showPicture: twoRows(6, 2, 2),
              options: [
                { id: "ana", label: <span style={{ color: "var(--qa)", fontWeight: 800 }}>Ana</span> },
                { id: "leo", label: <span style={{ color: "var(--qb)", fontWeight: 800 }}>Leo</span> },
              ],
              answer: "ana",
              why: { leo: "Line them up. Whose row is longer?" },
              showText: "Look: line them up. Ana's row has extras. Ana has more.",
              praise: "Yes! Ana has more.",
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

type Scenario = "addTo" | "takeFrom" | "together" | "missingPart" | "compare";

const SPOT_MODE: Record<string, Scenario> = {
  "u2-addto": "addTo",
  "u2-takefrom": "takeFrom",
  "u2-together": "together",
  "u2-compare": "compare",
};

/** The range of the second number, given the first. */
const secondRange = (s: Scenario, a: number): [number, number] => {
  if (s === "takeFrom") return [0, a];
  if (s === "missingPart") return [1, a - 1];
  if (s === "compare") return [1, 10];
  return [1, 10 - a];
};
const firstRange = (s: Scenario): [number, number] => (s === "missingPart" ? [2, 10] : s === "takeFrom" || s === "compare" ? [1, 10] : [1, 9]);

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("addTo");
  const [a, setA] = useState(6);
  const [b, setB] = useState(3);

  const left = a - b;
  const lineUp = Math.min(a, b);
  const items = scenario === "addTo" || scenario === "together" ? a + b : scenario === "takeFrom" ? b + left : scenario === "missingPart" ? left : lineUp + 1;
  const demo = useWatch(items, (t) => {
    if (scenario === "takeFrom") return t <= b ? (t === 1 ? "Take away." : null) : String(t - b);
    if (scenario === "compare") return t <= lineUp ? String(t) : a === b ? "They have the same number." : "Look at the extras.";
    return String(t);
  });

  const switchTo = (s: Scenario) => {
    demo.clear();
    setScenario(s);
    setA(6);
    setB(3);
  };
  useLookHereRequest((id) => {
    const s = SPOT_MODE[id];
    if (s && s !== scenario) switchTo(s);
  });

  const changeA = (v: number) => {
    demo.clear();
    setA(v);
    const [lo, hi] = secondRange(scenario, v);
    setB((old) => Math.max(lo, Math.min(hi, old)));
  };
  const changeB = (v: number) => {
    demo.clear();
    setB(v);
  };

  const [minA, maxA] = firstRange(scenario);
  const [minB, maxB] = secondRange(scenario, a);
  const running = demo.playing || demo.tick > 0;
  const firstLabel = scenario === "compare" ? "Zoe" : scenario === "takeFrom" ? "Start" : scenario === "missingPart" ? "In all" : "First";
  const secondLabel = scenario === "compare" ? "Ben" : scenario === "takeFrom" ? "Take away" : scenario === "missingPart" ? "Blue" : "Second";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Segmented
          label="Pick one"
          value={scenario}
          onChange={switchTo}
          options={[
            { id: "addTo", label: "More come" },
            { id: "takeFrom", label: "Some go" },
            { id: "together", label: "Two colors" },
            { id: "missingPart", label: "Missing part" },
            { id: "compare", label: "Who has more?" },
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
        <Stepper label={firstLabel} value={a} min={minA} max={maxA} step={1} onChange={changeA} tone={scenario === "missingPart" ? "c" : "a"} />
        <Stepper label={secondLabel} value={b} min={minB} max={maxB} step={1} onChange={changeB} tone={scenario === "missingPart" ? "a" : "b"} />
      </HeldControls>

      {scenario === "addTo" && (
        <div {...lookHereSpot("u2-addto")}>
          <ReadAloud as="p">Jen has {count(a, "sticker", "stickers")}. She gets {b} more.</ReadAloud>
          <SplitGroup total={a + b} partA={a} toneA="a" toneB="b" numbered={{ items: demo.tick }} />
          <ReadAloud as="p" className="feedback good">
            <span data-look-here-key>Now she has {a + b}. {a} + {b} = {a + b}.</span>
          </ReadAloud>
        </div>
      )}
      {scenario === "takeFrom" && (
        <div {...lookHereSpot("u2-takefrom")}>
          <ReadAloud as="p">Sam has {count(a, "cracker", "crackers")}. He eats {b}.</ReadAloud>
          <SplitGroup total={a} partA={a} toneA="a" showDivider={false} goneCount={running ? Math.min(b, demo.tick) : b} numbered={{ items: Math.max(0, demo.tick - b) }} />
          <ReadAloud as="p" className="feedback good">
            <span data-look-here-key>{left} {left === 1 ? "is" : "are"} left. {a} − {b} = {left}.</span>
          </ReadAloud>
        </div>
      )}
      {scenario === "together" && (
        <div {...lookHereSpot("u2-together")}>
          <ReadAloud as="p">A jar has marbles. {nIs(a)} blue. {nIs(b)} orange.</ReadAloud>
          <SplitGroup total={a + b} partA={a} toneA="a" toneB="b" showDivider={false} numbered={{ items: demo.tick }} />
          <ReadAloud as="p" className="feedback good">
            <span data-look-here-key>Count both colors. {a} + {b} = {a + b}.</span>
          </ReadAloud>
        </div>
      )}
      {scenario === "missingPart" && (
        <div>
          <ReadAloud as="p">{a} crayons. {nIs(b)} blue. The rest are orange.</ReadAloud>
          <SplitGroup total={a} partA={b} toneA="a" toneB="b" numbered={{ from: b, items: demo.tick }} />
          <ReadAloud as="p" className="feedback good">
            Count the orange crayons. {a} − {b} = {left}.
          </ReadAloud>
        </div>
      )}
      {scenario === "compare" && (
        <div {...lookHereSpot("u2-compare")}>
          <ReadAloud as="p">Zoe has {a}. Ben has {b}.</ReadAloud>
          <CompareRows nameA="Zoe" countA={a} nameB="Ben" countB={b} matched={demo.playing && demo.tick <= lineUp ? demo.tick : undefined} ringExtras={!demo.playing || demo.tick > lineUp} />
          <ReadAloud as="p" className="feedback good">
            <span data-look-here-key>{a === b ? "They have the same number." : `Line them up. ${a > b ? "Zoe" : "Ben"} has more.`}</span>
          </ReadAloud>
        </div>
      )}
      {/* The Check waits until the demo has played once. */}
      {introActive && !demo.seen && (
        <ReadAloud as="p" className="muted small">
          Tap Watch first.
        </ReadAloud>
      )}
      {((introActive && demo.seen) || showCheck) && <WordProblemsCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

// "compareDifference" keeps its id so earned star credit survives. Since D1 it
// asks "Who has more?" and never "how many more".
type Bucket = "addToResult" | "takeFromResult" | "putTogetherTotal" | "putTogetherAddend" | "compareDifference";
const BUCKETS: Bucket[] = ["addToResult", "takeFromResult", "putTogetherTotal", "putTogetherAddend", "compareDifference"];
const CHALLENGE_BUCKET = "challengeHowManyMore";

const KIDS = [
  { name: "Jen", he: "She" },
  { name: "Sam", he: "He" },
  { name: "Mia", he: "She" },
  { name: "Theo", he: "He" },
  { name: "Ana", he: "She" },
  { name: "Leo", he: "He" },
] as const;
const ITEMS = Object.keys(ITEM_WORDS) as ItemWord[];
// Things that really come in blue and orange, for the stories that name colors.
const COLOR_ITEMS: ItemWord[] = ["stickers", "crayons", "marbles", "balloons", "blocks"];
const pickOne = <T,>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)];

const addOrTakeStep = (isAdd: boolean, explain: string) =>
  choice(
    { prompt: "Add, or take away?", hint: isAdd ? "Do more come?" : "Do some go away?", showMe: isAdd ? "More come. So we add." : "Some go away. So we take away.", explain },
    isAdd ? "Add" : "Take away",
    [isAdd ? "Take away" : "Add"]
  );

const sentenceStep = (right: string, wrong: string, isAdd: boolean, missingPart = false) =>
  choice(
    {
      prompt: "Which number sentence matches?",
      hint: missingPart ? "Start with all of them. Take away the blue." : isAdd ? "Together is plus." : "Take away is minus.",
      showMe: missingPart ? "Start with all of them. Take away the blue. That is minus." : isAdd ? "Put them together. That is plus." : "Take some away. That is minus.",
      explain: right,
    },
    right,
    [wrong]
  );

function wordProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  const kid = pickOne(KIDS);
  const many = pickOne(ITEMS);
  const one = ITEM_WORDS[many];

  if (bucket === "addToResult") {
    const a = randInt(1, 8);
    const b = randInt(1, Math.min(9, 10 - a));
    const total = a + b;
    return {
      title: "Story problem",
      bucket,
      story: `${kid.name} has ${count(a, one, many)}. ${kid.he} gets ${b} more.`,
      visual: (_done, help) => joinPicture(a, b, 2, help),
      steps: [
        addOrTakeStep(true, "More came."),
        sentenceStep(`${a} + ${b} = ☐`, `${Math.max(a, b)} − ${Math.min(a, b)} = ☐`, true),
        {
          kind: "number",
          prompt: "How many now?",
          hint: "Count all the dots, both colors.",
          showMe: `Count them all: ${countList(1, total)}.`,
          showMeHoldMs: holdFor(total),
          explain: `${a} + ${b} = ${total}.`,
          answer: total,
          tone: "a",
        },
      ],
      wrapUp: `${kid.name} has ${count(total, one, many)} now.`,
    };
  }

  if (bucket === "takeFromResult") {
    const total = randInt(2, 10);
    const b = randInt(1, total - 1);
    const a = total - b;
    return {
      title: "Story problem",
      bucket,
      story: `${kid.name} has ${total} ${many}. ${kid.he} gives ${b} away.`,
      visual: (done, help) => takePicture(total, b, 2, done, help),
      steps: [
        addOrTakeStep(false, "Some went away."),
        sentenceStep(`${total} − ${b} = ☐`, `${total} + ${plusTrap(total, b)} = ☐`, false),
        {
          kind: "number",
          prompt: "How many are left?",
          hint: `Show ${total} fingers. Put ${b} down.`,
          showMe: `${b} went away. Count the dots left: ${countList(1, a)}.`,
          showMeHoldMs: holdFor(a),
          explain: `${total} − ${b} = ${a}.`,
          answer: a,
          tone: "a",
        },
      ],
      wrapUp: `${kid.name} has ${count(a, one, many)} left.`,
    };
  }

  if (bucket === "putTogetherTotal") {
    const a = randInt(1, 8);
    const b = randInt(1, Math.min(9, 10 - a));
    const total = a + b;
    return {
      title: "Story problem",
      bucket,
      story: `${kid.name} has ${pickOne(COLOR_ITEMS)}. ${nIs(a)} blue. ${nIs(b)} orange.`,
      visual: (_done, help) => joinPicture(a, b, 1, help, false),
      steps: [
        sentenceStep(`${a} + ${b} = ☐`, `${Math.max(a, b)} − ${Math.min(a, b)} = ☐`, true),
        {
          kind: "number",
          prompt: "How many in all?",
          hint: "Count both colors.",
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

  if (bucket === "putTogetherAddend") {
    const total = randInt(3, 10);
    const a = randInt(1, total - 1);
    const b = total - a;
    return {
      title: "Story problem",
      bucket,
      story: `${total} ${pickOne(COLOR_ITEMS)}. ${a} ${a === 1 ? "is" : "are"} blue. The rest are orange.`,
      // The known part and a "?" box. A wrong pick acts it out: the blue dots
      // fade. Stuck on the count: the orange dots appear to count.
      visual: (done, help) => {
        if (afterTry(help, 0)) return <SplitGroup key="act" total={total} partA={a} toneA="a" toneB="b" showDivider={false} goneA />;
        const open = done >= 2 || afterTry(help, 1);
        return open ? (
          <SplitGroup key={help?.showMe ? "show" : "open"} total={total} partA={a} toneA="a" toneB="b" ringB={!help?.showMe && done < 2} countAlong={help?.showMe && help.step === 1 ? { from: a, items: b } : undefined} />
        ) : (
          <SplitGroup total={total} partA={a} toneA="a" toneB="b" unknownB />
        );
      },
      steps: [
        sentenceStep(`${total} − ${a} = ☐`, `${total} + ${plusTrap(total, a)} = ☐`, false, true),
        {
          kind: "number",
          prompt: "How many are orange?",
          hint: `Start at ${a}. Count on to ${total} on your fingers.`,
          showMe: `Count the orange dots: ${countList(1, b)}.`,
          showMeHoldMs: holdFor(b),
          explain: `${total} − ${a} = ${b}.`,
          answer: b,
          tone: "b",
        },
      ],
      wrapUp: `${a} blue and ${b} orange make ${total}.`,
    };
  }

  // compareDifference: "Who has more?" on lined-up rows. Never equal.
  const big = randInt(2, 10);
  const small = randInt(1, big - 1);
  const firstHasMore = Math.random() < 0.5;
  const countA = firstHasMore ? big : small;
  const countB = firstHasMore ? small : big;
  const other = pickOne(KIDS.filter((k) => k.name !== kid.name));
  const winner = firstHasMore ? kid.name : other.name;
  const loser = firstHasMore ? other.name : kid.name;
  return {
    title: "Story problem",
    bucket,
    story: `${kid.name} and ${other.name} have ${many}.`,
    visual: (_done, help) => (
      <CompareRows
        key={help?.showMe ? `show-${help.step}` : "ask"}
        nameA={kid.name}
        countA={countA}
        nameB={other.name}
        countB={countB}
        countRow={help?.showMe && help.step === 0 ? "a" : help?.showMe && help.step === 1 ? "b" : undefined}
        ringRow={help?.showMe ? undefined : pointing(help, 0) ? "a" : pointing(help, 1) ? "b" : undefined}
        ringExtras={pointing(help, 2)}
      />
    ),
    steps: [
      { kind: "number", prompt: `How many does ${kid.name} have?`, hint: `Count ${kid.name}'s dots.`, showMe: `Count: ${countList(1, countA)}.`, showMeHoldMs: holdFor(countA), explain: `${kid.name} has ${countA}.`, answer: countA, tone: "a" },
      { kind: "number", prompt: `How many does ${other.name} have?`, hint: `Count ${other.name}'s dots.`, showMe: `Count: ${countList(1, countB)}.`, showMeHoldMs: holdFor(countB), explain: `${other.name} has ${countB}.`, answer: countB, tone: "b" },
      colorNames(
        choice(
          { prompt: "Who has more?", hint: "Whose row is longer?", showMe: `Line them up. ${winner}'s row has extras.`, explain: `${winner} has more than ${loser}.` },
          winner,
          [loser] // misconception: picking the name said first, or the shorter row
        ),
        kid.name
      ),
    ],
    wrapUp: `${winner} has more.`,
  };
}

// ============================================================================
// CHALLENGE (optional, user decision D1): "How many more?"
// Not in Mixed, requiredBuckets, the Unit Test or the Module Test, so it never
// counts toward stars. The story always asks about the child who has more.
// ============================================================================

function howManyMoreChallenge(): Problem {
  const kid = pickOne(KIDS);
  const other = pickOne(KIDS.filter((k) => k.name !== kid.name));
  const many = pickOne(ITEMS);
  const one = ITEM_WORDS[many];
  const big = randInt(2, 10);
  const small = randInt(1, big - 1);
  const firstHasMore = Math.random() < 0.5;
  const countA = firstHasMore ? big : small;
  const countB = firstHasMore ? small : big;
  const winner = firstHasMore ? kid.name : other.name;
  const loser = firstHasMore ? other.name : kid.name;
  const extras = big - small;
  return {
    title: "Challenge",
    bucket: CHALLENGE_BUCKET,
    story: `${kid.name} has ${count(countA, one, many)}. ${other.name} has ${count(countB, one, many)}.`,
    visual: (done, help) => <CompareRows key={help?.showMe ? `show-${help.step}` : "ask"} nameA={kid.name} countA={countA} nameB={other.name} countB={countB} ringExtras={done >= 2 || pointing(help, 0) || pointing(help, 1)} countExtras={!!help?.showMe && help.step === 1} />,
    steps: [
      colorNames(
        choice(
          { prompt: `Who has more ${many}?`, hint: "Whose row is longer?", showMe: `Line them up. ${winner}'s row has extras.`, explain: `${winner} has more.` },
          winner,
          [loser]
        ),
        kid.name
      ),
      {
        kind: "number",
        prompt: `How many more does ${winner} have?`,
        hint: "Count the dots with rings.",
        showMe: `Count the extras: ${countList(1, extras)}.`,
        showMeHoldMs: holdFor(extras),
        explain: `${count(extras, "extra", "extras")}.`,
        answer: extras,
      },
    ],
    wrapUp: `${winner} has ${extras} more.`,
  };
}

export const wordProblemsWithin10: Unit = {
  id: "wordProblemsWithin10",
  title: "Story Problems to 10",
  goal: "Solve stories with numbers up to 10.",
  standard: "K.OA.2",
  keyIdea: <p>Listen to the story. Look at the picture.</p>,
  Explore,
  requiresIntro: true,
  problems: [
    { label: "Word Problems", make: wordProblem, buckets: BUCKETS },
    // Optional: not in Mixed, and its bucket is not in requiredBuckets (no stars).
    { label: "Challenge: how many more?", make: howManyMoreChallenge, buckets: [CHALLENGE_BUCKET], optional: true },
  ],
  requiredBuckets: BUCKETS,
  test: wordProblemsWithin10Test,
};
