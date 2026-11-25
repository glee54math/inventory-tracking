import { useState } from "react";
import { LengthBars, BalanceScale, binCountAlongMs, type LengthBarSpec } from "../diagrams";
import { pick } from "../../../shared/lib/math";
import { pointing, type Problem, type VisualHelp } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingTest } from "./ComparingTwoObjectsDirectlyTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";
import { blocksWord, countExtrasLine, countUp, offsetRods, otherSide, rodName, rodChoice, rodPair, sideChoice, sideName, wantNearTie, weightPair, type Rod, type Side } from "./labParts";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

// K-1 design, one question at a time, 2 of 5 typed. Line up first, count to
// check (review D5). Extras are ringed and counted, with no subtraction (D3).
// Explore's defaults (6 and 8) avoid the CFU's rods (7 and 4) and its 3 extras.
// Each pick's twin has the other right answer (C2-38). The first wrong tap's
// reason plays over the twin, so it must fit both.

const LOOK = {
  rods: { target: "u2-rods", label: "Explore: the rods", say: "Look here. Which rod goes past?" },
  extras: { target: "u2-extras", label: "Explore: extra blocks", say: "Look here. Count the extra blocks." },
  slide: { target: "u2-slide", label: "Explore: slide together", say: "Look here. Slide them together." },
  scale: { target: "u2-scale", label: "Explore: the scale", say: "Look here. Watch the scale." },
};

const rodOption = (r: Rod) => ({ id: `Rod ${r}`, label: rodName(r) });
const sideOption = (s: Side) => ({ id: s, label: sideName(s) });

const lined = (a: number, b: number, extra = false, numbered = false, count?: Rod) => {
  const longerA = a > b;
  const from = Math.min(a, b);
  return (
    <LengthBars
      max={9}
      bars={[
        { blocks: a, tone: "a", label: "Rod A", extraFrom: extra && longerA ? from : undefined, extraNumbered: numbered, countAlong: count === "A" },
        { blocks: b, tone: "b", label: "Rod B", extraFrom: extra && !longerA ? from : undefined, extraNumbered: numbered, countAlong: count === "B" },
      ]}
    />
  );
};

const offset = (a: number, b: number, offB: number, align = false, count?: Rod, numberB = false, offA = 0) => (
  <LengthBars
    max={9}
    alignStarts={align}
    bars={[
      { blocks: a, tone: "a", label: "Rod A", startOffset: offA, countAlong: count === "A" },
      { blocks: b, tone: "b", label: "Rod B", startOffset: offB, countAlong: count === "B", numbered: numberB },
    ]}
  />
);

const scalePicture = (left: number, right: number) => <BalanceScale left={left} right={right} leftLabel="Blue" rightLabel="Orange" />;

function ComparingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const rods = [rodOption("A"), rodOption("B")];
  const sides = [sideOption("blue"), sideOption("orange")];
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="Which rod is longer? Rod A or Rod B?"
            picture={lined(7, 4)}
            showPicture={lined(7, 4, true, true)}
            showText="Look: Rod A goes past Rod B. Rod A is longer."
            options={rods}
            answer="Rod A"
            why={{ "Rod B": "The longer one goes past." }}
            praise="Yes! Rod A is longer."
            look={LOOK.rods}
            twin={{
              prompt: "Now which rod is longer? Rod A or Rod B?",
              picture: lined(2, 6),
              showPicture: lined(2, 6, true, true),
              options: rods,
              answer: "Rod B",
              why: { "Rod A": "The longer one goes past." },
              showText: "Look: Rod B goes past Rod A. Rod B is longer.",
              praise: "Yes! Rod B is longer.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many extra blocks?"
            answer={3}
            tone="a"
            picture={(m) => lined(7, 4, true, m === "show" || m === "done")}
            nudge="Count only the extra blocks."
            why={{ 7: "That is all of Rod A. Count the extra blocks.", 4: "That is Rod B. Count the extra blocks." }}
            showText="Watch and listen: the extra blocks are 1, 2, 3."
            praise="Yes! 3 extra blocks."
            look={LOOK.extras}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={3}
            prompt="They start in different places. Which is longer? Rod A or Rod B?"
            picture={offset(7, 4, 5)}
            showPicture={offset(7, 4, 5, true)}
            showText="Watch: slide them to start together. Rod A is longer."
            options={rods}
            answer="Rod A"
            why={{ "Rod B": "They start in different places. Count the blocks." }}
            praise="Yes! Rod A is longer."
            look={LOOK.slide}
            twin={{
              prompt: "Try these. Which is longer? Rod A or Rod B?",
              picture: offset(3, 6, 0, false, undefined, false, 5),
              showPicture: offset(3, 6, 0, true, undefined, false, 5),
              options: rods,
              answer: "Rod B",
              why: { "Rod A": "They start in different places. Count the blocks." },
              showText: "Watch: slide them to start together. Rod B is longer.",
              praise: "Yes! Rod B is longer.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="How many blocks long is Rod B?"
            answer={4}
            tone="b"
            picture={(m) => offset(7, 4, 5, false, m === "show" ? "B" : undefined, m === "done")}
            nudge="Count each block in Rod B once."
            showText="Watch and listen: Rod B has 1, 2, 3, 4."
            praise="Yes! Rod B is 4 blocks long."
            look={LOOK.slide}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={5}
            prompt="Which side is heavier? Blue side or orange side?"
            picture={scalePicture(3, 6)}
            showPicture={<BalanceScale left={3} right={6} leftLabel="Blue" rightLabel="Orange" point="right" />}
            showText="Look: the heavy side goes down. The orange side went down."
            options={sides}
            answer="orange"
            why={{ blue: "Look at the scale. The heavy side goes down." }}
            praise="Yes! The heavy side goes down."
            look={LOOK.scale}
            twin={{
              prompt: "Now which side is heavier? Blue side or orange side?",
              picture: scalePicture(5, 2),
              showPicture: <BalanceScale left={5} right={2} leftLabel="Blue" rightLabel="Orange" point="left" />,
              options: sides,
              answer: "blue",
              why: { orange: "Look at the scale. The heavy side goes down." },
              showText: "Look: the heavy side goes down. The blue side went down.",
              praise: "Yes! The heavy side goes down.",
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
  const [blocksA, setBlocksA] = useState(6);
  const [blocksB, setBlocksB] = useState(8);
  const [aligned, setAligned] = useState<"aligned" | "offset">("aligned");
  const [slid, setSlid] = useState(false);
  const [blueW, setBlueW] = useState(4);
  const [orangeW, setOrangeW] = useState(4);
  useLookHereRequest((id) => {
    // The 2nd miss is on a twin whose answer is Rod B, so these spots show Rod A longer.
    if (id === "u2-slide" || id === "u2-rods") {
      setBlocksA(8);
      setBlocksB(6);
    }
    if (id === "u2-slide") {
      setAligned("offset");
      setSlid(false);
    }
    if (id === "u2-extras" || id === "u2-rods") {
      setAligned("aligned");
      setSlid(false);
    }
  });

  const together = aligned === "aligned" || slid;
  const longer: Rod | null = blocksA === blocksB ? null : blocksA > blocksB ? "A" : "B";
  const extras = Math.abs(blocksA - blocksB);
  const heavier: Side | null = blueW === orangeW ? null : blueW > orangeW ? "blue" : "orange";
  const extraFrom = (r: Rod) => (together && longer === r ? Math.min(blocksA, blocksB) : undefined);
  const bars: LengthBarSpec[] = [
    { blocks: blocksA, tone: "a", label: "Rod A", extraFrom: extraFrom("A") },
    { blocks: blocksB, tone: "b", label: "Rod B", startOffset: aligned === "offset" ? 3 : 0, extraFrom: extraFrom("B") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <ReadAloud as="p" className="muted small">This is a rod. It is made of blocks.</ReadAloud>
      <div className="control-row" data-readaloud-part>
        <Segmented
          label="Start"
          value={aligned}
          onChange={(v) => {
            setAligned(v as "aligned" | "offset");
            setSlid(false);
          }}
          options={[{ id: "aligned", label: "Same start" }, { id: "offset", label: "Different start" }]}
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

      <div className="control-row" data-readaloud-part>
        <Stepper label="Rod A" value={blocksA} min={1} max={12} onChange={setBlocksA} tone="a" />
        <Stepper label="Rod B" value={blocksB} min={1} max={12} onChange={setBlocksB} tone="b" />
      </div>
      <div {...lookHereSpot("u2-rods")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <LengthBars bars={bars} alignStarts={aligned === "offset" && slid} onBlocksChange={(i, n) => (i === 0 ? setBlocksA(n) : setBlocksB(n))} />
        <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
          {!together ? "Slide them together first." : longer ? <span data-look-here-key>Rod {longer} goes past. Rod {longer} is longer.</span> : "They are the same."}
        </ReadAloud>
      </div>
      <div {...lookHereSpot("u2-slide")} className="control-row" data-readaloud-part>
        <button type="button" className="btn primary" disabled={aligned !== "offset" || slid} onClick={() => setSlid(true)}>
          Slide together
        </button>
      </div>
      <div {...lookHereSpot("u2-extras")}>
        <ReadAloud as="p" className="muted small">
          {together && longer ? (
            <span data-look-here-key>{extras === 1 ? "The ring shows the extra block: 1." : `The rings show the extra blocks: ${countUp(extras)}.`}</span>
          ) : (
            <span data-look-here-key>Line them up. Then count the extra blocks.</span>
          )}
        </ReadAloud>
      </div>

      <div {...lookHereSpot("u2-scale")} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <ReadAloud as="p" className="muted small">Add blocks. Watch the scale.</ReadAloud>
        <div className="control-row" data-readaloud-part>
          <Stepper label="Blue side" value={blueW} min={0} max={8} onChange={setBlueW} tone="c" />
          <Stepper label="Orange side" value={orangeW} min={0} max={8} onChange={setOrangeW} tone="b" />
        </div>
        <BalanceScale left={blueW} right={orangeW} leftLabel="Blue" rightLabel="Orange" />
        <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
          {heavier ? (
            <>
              <span data-look-here-key>The heavy side goes down.</span> The {heavier} side is heavier.
            </>
          ) : (
            "Both sides are the same."
          )}
        </ReadAloud>
      </div>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <ComparingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "lengthAligned" | "lengthMisaligned" | "weightCompare" | "describeDifference";
const BUCKETS: Bucket[] = ["lengthAligned", "lengthMisaligned", "weightCompare", "describeDifference"];

const showing = (help: VisualHelp | undefined, step: number) => !!help?.showMe && help.step === step;
const rodOf = (a: number, b: number): { longer: Rod; shorter: Rod } => (a > b ? { longer: "A", shorter: "B" } : { longer: "B", shorter: "A" });

const countRodStep = (r: Rod, n: number) => ({
  kind: "number" as const,
  prompt: <>How many blocks long is {rodName(r)}?</>,
  hint: "Count each block once.",
  showMe: `Count with me: ${countUp(n)}.`,
  showMeHoldMs: binCountAlongMs(n),
  explain: `${blocksWord(n)}.`,
  answer: n,
  tone: (r === "A" ? "a" : "b") as "a" | "b",
});

function comparingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);

  if (bucket === "lengthAligned") {
    const [a, b] = rodPair(wantNearTie(bucket));
    const { longer, shorter } = rodOf(a, b);
    const ask: Rod = Math.random() < 0.5 ? longer : shorter;
    const askN = ask === "A" ? a : b;
    return {
      title: "Rods",
      bucket,
      story: "They start at the same place.",
      visual: (_done, help) => {
        const demo = pointing(help, 0);
        const from = Math.min(a, b);
        return (
          <LengthBars
            max={9}
            bars={[
              { blocks: a, tone: "a", label: "Rod A", extraFrom: demo && longer === "A" ? from : undefined, extraNumbered: false, ring: pointing(help, 1) && !help?.showMe && ask === "A", countAlong: showing(help, 1) && ask === "A" },
              { blocks: b, tone: "b", label: "Rod B", extraFrom: demo && longer === "B" ? from : undefined, extraNumbered: false, ring: pointing(help, 1) && !help?.showMe && ask === "B", countAlong: showing(help, 1) && ask === "B" },
            ]}
          />
        );
      },
      steps: [
        rodChoice({ prompt: "Which rod is longer?", hint: "Which one goes farther?", explain: `Rod ${longer} goes past Rod ${shorter}.` }, longer),
        countRodStep(ask, askN),
      ],
      wrapUp: `Rod ${longer} is longer.`,
    };
  }

  if (bucket === "lengthMisaligned") {
    const { a, b, offA, offB } = offsetRods(wantNearTie(bucket));
    const { longer } = rodOf(a, b);
    const ask: Rod = Math.random() < 0.5 ? "A" : "B";
    const askN = ask === "A" ? a : b;
    return {
      title: "Rods",
      bucket,
      story: "They start in different places.",
      visual: (done, help) => {
        // First wrong try on step 1: slide the rods to one start and ring the
        // extras, so "line them up" is shown even with only two buttons.
        const slide = pointing(help, 0) || (done >= 1 && !help);
        const from = Math.min(a, b);
        return (
          <LengthBars
            max={9}
            alignStarts={slide}
            bars={[
              { blocks: a, tone: "a", label: "Rod A", startOffset: offA, extraFrom: pointing(help, 0) && longer === "A" ? from : undefined, extraNumbered: false, ring: pointing(help, 1) && !help?.showMe && ask === "A", countAlong: showing(help, 1) && ask === "A" },
              { blocks: b, tone: "b", label: "Rod B", startOffset: offB, extraFrom: pointing(help, 0) && longer === "B" ? from : undefined, extraNumbered: false, ring: pointing(help, 1) && !help?.showMe && ask === "B", countAlong: showing(help, 1) && ask === "B" },
            ]}
          />
        );
      },
      steps: [
        rodChoice({ prompt: "Which rod is longer?", hint: "Slide them together. Which goes past?", showMeHoldMs: 1200, explain: `Rod ${longer} is longer.` }, longer),
        countRodStep(ask, askN),
      ],
      wrapUp: `Rod ${longer} is longer.`,
    };
  }

  if (bucket === "weightCompare") {
    const [blue, orange] = weightPair(wantNearTie(bucket));
    const heavier: Side = blue > orange ? "blue" : "orange";
    const lighter = otherSide(heavier);
    const lighterN = Math.min(blue, orange);
    const lighterSide = lighter === "blue" ? "left" : "right";
    const heavierSide = heavier === "blue" ? "left" : "right";
    return {
      title: "Scale",
      bucket,
      story: "Look at the scale.",
      visual: (_done, help) => (
        <BalanceScale
          left={blue}
          right={orange}
          leftLabel="Blue"
          rightLabel="Orange"
          point={pointing(help, 0) ? heavierSide : pointing(help, 1) && !help?.showMe ? lighterSide : undefined}
          countSide={showing(help, 1) ? lighterSide : undefined}
        />
      ),
      steps: [
        sideChoice({ prompt: "Which side is heavier?", hint: "The heavy side goes down.", explain: `The ${heavier} side went down.` }, heavier),
        {
          kind: "number",
          prompt: "How many blocks are on the lighter side?",
          hint: "The light side goes up. Count its blocks.",
          showMe: `Count with me: ${countUp(lighterN)}.`,
          showMeHoldMs: binCountAlongMs(lighterN),
          explain: `${blocksWord(lighterN)}.`,
          answer: lighterN,
        },
      ],
      wrapUp: `The ${heavier} side is heavier.`,
    };
  }

  // describeDifference (review D3): line up, ring the extras, count them.
  const [a, b] = rodPair(wantNearTie(bucket));
  const { longer, shorter } = rodOf(a, b);
  const shorterBlocks = Math.min(a, b);
  const diff = Math.abs(a - b);
  return {
    title: "Extras",
    bucket,
    story: "They start at the same place.",
    visual: (done, help) => {
      // The ring appears for the "how many extra" step, and numbers only in Show me.
      const at = help?.step ?? done;
      const extraFrom = at >= 1 || pointing(help, 0) ? shorterBlocks : undefined;
      const numbered = showing(help, 1) || done >= 2;
      return (
        <LengthBars
          max={9}
          bars={[
            { blocks: a, tone: "a", label: "Rod A", extraFrom: longer === "A" ? extraFrom : undefined, extraNumbered: numbered },
            { blocks: b, tone: "b", label: "Rod B", extraFrom: longer === "B" ? extraFrom : undefined, extraNumbered: numbered },
          ]}
        />
      );
    },
    steps: [
      rodChoice({ prompt: "Which rod is longer?", hint: "Which one goes farther?", explain: `Rod ${longer} goes past Rod ${shorter}.` }, longer),
      {
        kind: "number",
        prompt: "How many extra blocks?",
        hint: "Count the blocks with rings.",
        showMe: countExtrasLine(diff),
        showMeHoldMs: binCountAlongMs(diff),
        explain: `${diff} extra.`,
        answer: diff,
      },
    ],
    wrapUp: `Rod ${longer} has ${diff} extra.`,
  };
}

export const comparingTwoObjectsDirectly: Unit = {
  id: "comparingTwoObjectsDirectly",
  title: "Which Is Longer? Which Is Heavier?",
  goal: "Look at two things. Find the longer one. Find the heavier one.",
  standard: "K.MD.2",
  keyIdea: (
    <>
      <p>Start them at the same place.</p>
      <p>Which one goes past the other? It is longer.</p>
      <p>Count the blocks to check.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Direct-comparison reasoning applied fresh each time, not a memorized fact.
  problems: [{ label: "Rods and Scale", make: comparingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: comparingTest,
};
