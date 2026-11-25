import { useState } from "react";
import { BalanceScale, ObjectGlyph, ObjectOnBlocks, StandingRod, LengthBars, WordCard, WordPicture, binCountAlongMs, type DescribeWord } from "../diagrams";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, pictureChoice, pointing, type Problem, type VisualHelp } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { describingTest } from "./DescribingHowObjectsAreMeasuredTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";
import { lookHereSpot, useLookHereRequest } from "../../../shared/lib/lookHere";
import { OBJECTS, WORD_LINES, WORD_LIST, blocksFor, blocksWord, countUp, isLengthWord, scaleBlocksFor, sideCountScene, sizePairScale, weightKind, type MeasureObject, type SideCountScene } from "./labParts";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

// K-1 design (shared/components/KCheck.tsx), one question at a time. 2 of 5
// typed. Each pick says its choices in the prompt, because KCheck doesn't read
// the buttons (review D7). Its twin has the OTHER right answer, so tapping the
// other button after a miss can't pass (C2-38). The first wrong tap's reason
// plays over the twin, so it must fit both. No Look here spot shows its own
// question's answer.

const LOOK = {
  down: { target: "u1-down", label: "Explore: the scale", say: "Look here. See which side goes down." },
  big: { target: "u1-big", label: "Explore: big and small", say: "Look here. See which one goes down." },
  same: { target: "u1-same", label: "Explore: both sides the same", say: "Look here. See the flat scale." },
  blocks: { target: "u1-blocks", label: "Explore: count the blocks", say: "Look here. Count the blocks." },
};

const SEE_SCALE = "Look at the scale. See which way it went.";
const LIFT = "Heavy is hard to lift.";
const READ_SCALE = "Look at the scale. The heavy side goes down.";

const wordBtn = (w: string) => ({ id: w, label: w });

const bigSmall = (big: { glyph: string; name: string }, small: { glyph: string; name: string }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
    <ObjectGlyph glyph={big.glyph} name={big.name} big />
    <div style={{ width: 90 }}>
      <ObjectGlyph glyph={small.glyph} name={small.name} />
    </div>
  </div>
);

function DescribingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="This side went down. Is it heavy or light?"
            picture={<BalanceScale left={6} right={2} point="left" />}
            showPicture={<BalanceScale left={6} right={2} point="left" />}
            showText="Look: the heavy side goes down."
            options={["heavy", "light"].map(wordBtn)}
            answer="heavy"
            why={{ light: SEE_SCALE }}
            praise="Yes! It is heavy."
            look={LOOK.down}
            twin={{
              prompt: "Now this side went up. Is it heavy or light?",
              picture: <BalanceScale left={1} right={5} point="left" />,
              showPicture: <BalanceScale left={1} right={5} point="left" />,
              options: ["heavy", "light"].map(wordBtn),
              answer: "light",
              why: { heavy: SEE_SCALE },
              showText: "Look: the light side goes up.",
              praise: "Yes! It is light.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={2}
            prompt="A big balloon and a small rock. Which is heavier?"
            picture={bigSmall({ glyph: "🎈", name: "balloon" }, { glyph: "🪨", name: "rock" })}
            showPicture={<BalanceScale left={0} right={0} leftObject={{ glyph: "🎈", name: "balloon", big: true }} rightObject={{ glyph: "🪨", name: "rock" }} leftLabel="balloon" rightLabel="rock" down="right" />}
            showText="Watch: the rock goes down. The rock is heavier."
            options={["balloon", "rock"].map(wordBtn)}
            answer="rock"
            why={{ balloon: LIFT }}
            praise="Yes! The rock is heavier."
            look={LOOK.big}
            twin={{
              prompt: "A big train and a small leaf. Which is heavier?",
              picture: bigSmall({ glyph: "🚂", name: "train" }, { glyph: "🍃", name: "leaf" }),
              showPicture: <BalanceScale left={0} right={0} leftObject={{ glyph: "🚂", name: "train", big: true }} rightObject={{ glyph: "🍃", name: "leaf" }} leftLabel="train" rightLabel="leaf" down="left" />,
              options: ["train", "leaf"].map(wordBtn),
              answer: "train",
              why: { leaf: LIFT },
              showText: "Watch: the train goes down. The train is heavier.",
              praise: "Yes! The train is heavier.",
            }}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="The scale is flat. How many blocks?"
            answer={5}
            tone="b"
            picture={(m) => <BalanceScale left={0} right={5} leftObject={{ glyph: "🪨", name: "rock" }} leftLabel="rock" rightLabel="blocks" down="even" countSide={m === "show" ? "right" : undefined} />}
            nudge="Count the blocks."
            showText="Watch and listen: 1, 2, 3, 4, 5."
            praise="Yes! 5 blocks. The scale is flat."
            look={LOOK.same}
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={4}
            prompt="How many blocks are under the train?"
            answer={7}
            tone="a"
            picture={(m) => <ObjectOnBlocks glyph={"🚂"} name="train" blocks={7} ring={m === "wrong"} numbered={m === "done"} countAlong={m === "show"} />}
            nudge="Count the blocks under it."
            showText="Watch and listen: 1, 2, 3, 4, 5, 6, 7."
            praise="Yes! The train is 7 blocks long."
            look={LOOK.blocks}
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={5}
            prompt="The train is long. What else is it? Heavy or light?"
            picture={<BalanceScale left={0} right={2} leftObject={{ glyph: "🚂", name: "train" }} leftLabel="train" rightLabel="blocks" down="left" />}
            showPicture={<BalanceScale left={0} right={2} leftObject={{ glyph: "🚂", name: "train" }} leftLabel="train" rightLabel="blocks" down="left" point="left" />}
            showText="Look: the train went down. A train is heavy."
            options={["heavy", "light"].map(wordBtn)}
            answer="heavy"
            why={{ light: READ_SCALE }}
            praise="Yes! A train is long and heavy."
            look={LOOK.down}
            twin={{
              prompt: "The scarf is long. What else is it? Heavy or light?",
              picture: <BalanceScale left={0} right={2} leftObject={{ glyph: "🧣", name: "scarf" }} leftLabel="scarf" rightLabel="blocks" down="right" />,
              showPicture: <BalanceScale left={0} right={2} leftObject={{ glyph: "🧣", name: "scarf" }} leftLabel="scarf" rightLabel="blocks" down="right" point="left" />,
              options: ["heavy", "light"].map(wordBtn),
              answer: "light",
              why: { heavy: READ_SCALE },
              showText: "Look: the scarf went up. A scarf is light.",
              praise: "Yes! A scarf is long and light.",
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

// None of these is a CFU question's pair or answer. One big object IS heavy,
// so "the small one" is not a rule (C2-41).
const SCALE_EXAMPLES = [
  { id: "teddy", label: "🧸 and 🔨", say: "teddy bear and hammer", left: { glyph: "🧸", name: "teddy bear", big: true }, right: { glyph: "🔨", name: "hammer" }, blocks: 0, down: "right" as const, line: "Big does not mean heavy." },
  { id: "kite", label: "🪁 and 🔨", say: "kite and hammer", left: { glyph: "🪁", name: "kite", big: true }, right: { glyph: "🔨", name: "hammer" }, blocks: 0, down: "right" as const, line: "Big does not mean heavy." },
  { id: "elephant", label: "🐘 and 🐭", say: "elephant and mouse", left: { glyph: "🐘", name: "elephant", big: true }, right: { glyph: "🐭", name: "mouse" }, blocks: 0, down: "left" as const, line: "This big one is heavy." },
  { id: "same", label: "🔨 and blocks", say: "hammer and blocks", left: { glyph: "🔨", name: "hammer" }, right: undefined, blocks: 4, down: "even" as const, line: "The scale is flat. They are the same." },
];
const SAME_EXAMPLE = SCALE_EXAMPLES.findIndex((s) => s.id === "same");
// Q2's Look here comes on its twin, whose big train is heavier (C3-51).
const BIG_HEAVY_EXAMPLE = SCALE_EXAMPLES.findIndex((s) => s.id === "elephant");

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [objIndex, setObjIndex] = useState(() => OBJECTS.findIndex((o) => o.name === "snake"));
  const [revealedWord, setRevealedWord] = useState<DescribeWord | null>(null);
  const [exampleIdx, setExampleIdx] = useState(0);
  useLookHereRequest((id) => {
    if (id === "u1-same") setExampleIdx(SAME_EXAMPLE);
    if (id === "u1-big") setExampleIdx(BIG_HEAVY_EXAMPLE);
    if (id === "u1-down") setExampleIdx(0);
  });
  const obj = OBJECTS[objIndex];
  const ex = SCALE_EXAMPLES[exampleIdx];
  // A fixed size for each kind in Explore: never the CFU's 7.
  const shownBlocks = obj.length === "long" ? 6 : 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
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

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <ReadAloud as="p" className="muted small">Tap a picture.</ReadAloud>
        <div className="control-row" role="listbox" aria-label="Pick a picture" data-readaloud-part>
          {OBJECTS.map((o, i) => (
            <button key={o.name} role="option" aria-selected={i === objIndex} className={`btn ghost ${i === objIndex ? "pressed" : ""}`} onClick={() => setObjIndex(i)}>
              {o.glyph} {o.name}
            </button>
          ))}
        </div>
      </div>
      <div {...lookHereSpot("u1-blocks")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ObjectOnBlocks glyph={obj.glyph} name={obj.name} blocks={shownBlocks} />
        <ReadAloud as="p" className="muted small"><span data-look-here-key>Many blocks? It is long. Few blocks? It is short.</span></ReadAloud>
      </div>
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        The {obj.name} is <b>{obj.length}</b> and <b>{obj.weight}</b>.
      </ReadAloud>

      {/* The big and same spots hold the scale, its buttons and its line (C2-44). */}
      <div {...lookHereSpot("u1-big")}>
        <div {...lookHereSpot("u1-same")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div {...lookHereSpot("u1-down")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ReadAloud as="p" className="muted small">This is a scale. {exampleIdx === SAME_EXAMPLE ? "The heavy side goes down." : <span data-look-here-key>The heavy side goes down.</span>} The light side goes up.</ReadAloud>
            <BalanceScale left={0} right={ex.blocks} leftObject={ex.left} rightObject={ex.right} leftLabel={ex.left.name} rightLabel={ex.right ? ex.right.name : "blocks"} down={ex.down} />
          </div>
          <div className="control-row" data-readaloud-part>
            {SCALE_EXAMPLES.map((s, i) => (
              <button key={s.id} type="button" className={`btn ghost ${i === exampleIdx ? "pressed" : ""}`} data-tts-say={s.say} onClick={() => setExampleIdx(i)}>
                {s.label}
              </button>
            ))}
          </div>
          <ReadAloud as="p" className="feedback good"><span data-look-here-key>{ex.line}</span></ReadAloud>
        </div>
      </div>

      <ReadAloud as="p" className="muted small">Tap a word.</ReadAloud>
      <div className="control-row" data-readaloud-part>
        {WORD_LIST.map((w) => (
          <button key={w} type="button" className={`btn ghost ${revealedWord === w ? "pressed" : ""}`} onClick={() => setRevealedWord(w)}>
            {w}
          </button>
        ))}
      </div>
      {revealedWord && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {revealedWord === "tall" ? <StandingRod blocks={5} /> : <WordPicture word={revealedWord} />}
          <ReadAloud as="p" className="feedback good">{isLengthWord(revealedWord) ? "This is a rod. " : ""}{WORD_LINES[revealedWord]}</ReadAloud>
        </div>
      )}
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <DescribingCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "lengthSingle" | "weightSingle" | "twoAttributes" | "vocabMatch";
const BUCKETS: Bucket[] = ["lengthSingle", "weightSingle", "twoAttributes", "vocabMatch"];

const showing = (help: VisualHelp | undefined, step: number) => !!help?.showMe && help.step === step;

/** The object on one pan against some blocks. Its side shows heavy or light. */
function objectScale(obj: MeasureObject, n: number, objLeft: boolean, point: boolean) {
  const objDown = obj.weight === "heavy";
  const objSide = objLeft ? "left" : "right";
  const blockSide = objLeft ? "right" : "left";
  const scaleObj = { glyph: obj.glyph, name: obj.name };
  return (
    <BalanceScale
      left={objLeft ? 0 : n}
      right={objLeft ? n : 0}
      leftObject={objLeft ? scaleObj : undefined}
      rightObject={objLeft ? undefined : scaleObj}
      leftLabel={objLeft ? obj.name : "blocks"}
      rightLabel={objLeft ? "blocks" : obj.name}
      down={objDown ? objSide : blockSide}
      point={point ? objSide : undefined}
    />
  );
}

/** Blocks on both sides. Help rings the side asked about, then counts it (D11). */
const sideCountPicture = (s: SideCountScene, help: VisualHelp | undefined, step: number) => (
  <BalanceScale left={s.left} right={s.right} ringSide={pointing(help, step) ? s.askSide : undefined} countSide={showing(help, step) ? s.askSide : undefined} />
);

const sideCountStep = (s: SideCountScene) => ({
  kind: "number" as const,
  prompt: `How many blocks are on the side that went ${s.ask}?`,
  hint: `Find the side that went ${s.ask}. Count its blocks.`,
  showMe: `Count with me: ${countUp(s.answer)}.`,
  showMeHoldMs: binCountAlongMs(s.answer),
  explain: `${blocksWord(s.answer)}.`,
  answer: s.answer,
});

const lengthStep = (obj: MeasureObject, other: string) =>
  choice(
    { prompt: `Is the ${obj.name} long or short?`, hint: "Many blocks? It is long. Few blocks? It is short.", explain: `The ${obj.name} is ${obj.length}.` },
    obj.length,
    [other]
  );

const countBlocksStep = (n: number, prompt: string, hint = "Count each block once.") => ({
  kind: "number" as const,
  prompt,
  hint,
  showMe: `Count with me: ${countUp(n)}.`,
  showMeHoldMs: binCountAlongMs(n),
  explain: `${blocksWord(n)}.`,
  answer: n,
});

function describingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);

  if (bucket === "lengthSingle") {
    const obj = pick(OBJECTS);
    const n = blocksFor(obj);
    return {
      title: "Blocks",
      bucket,
      story: "Look at the blocks.",
      visual: (_done, help) => <ObjectOnBlocks glyph={obj.glyph} name={obj.name} blocks={n} ring={pointing(help, 0) || (pointing(help, 1) && !help?.showMe)} countAlong={showing(help, 1)} />,
      steps: [lengthStep(obj, obj.length === "long" ? "short" : "long"), countBlocksStep(n, `How many blocks are under the ${obj.name}?`, "Count the blocks under it.")],
      wrapUp: `The ${obj.name} is ${obj.length}.`,
    };
  }

  if (bucket === "weightSingle") {
    // Step 2 is always a blocks-only scale: count the side that moved (D11).
    const scene = sideCountScene();
    if (weightKind() === "pair") {
      // A big and a small object, read from the scale. Either one can be heavier (C2-41).
      const pair = sizePairScale();
      return {
        title: "Scale",
        bucket,
        story: "Look at the scale.",
        visual: (done, help) =>
          (help?.step ?? done) < 1 ? (
            <BalanceScale left={0} right={0} leftObject={pair.leftObject} rightObject={pair.rightObject} leftLabel={pair.leftObject.name} rightLabel={pair.rightObject.name} down={pair.down} point={pointing(help, 0) ? pair.down : undefined} />
          ) : (
            sideCountPicture(scene, help, 1)
          ),
        steps: [
          choice({ prompt: "Which one is heavier?", hint: "Which side went down?", explain: `The ${pair.heavy} is heavier.` }, pair.heavy, [pair.light]),
          sideCountStep(scene),
        ],
        wrapUp: `The ${pair.heavy} is heavier.`,
      };
    }
    const obj = pick(OBJECTS);
    const n = scaleBlocksFor(obj);
    const objLeft = Math.random() < 0.5;
    return {
      title: "Scale",
      bucket,
      story: "Look at the scale.",
      visual: (done, help) => ((help?.step ?? done) < 1 ? objectScale(obj, n, objLeft, pointing(help, 0)) : sideCountPicture(scene, help, 1)),
      steps: [
        choice(
          { prompt: `Is the ${obj.name} heavy or light?`, hint: obj.weight === "heavy" ? "See the arrow. This side went down." : "See the arrow. This side went up.", explain: `The ${obj.name} is ${obj.weight}.` },
          obj.weight,
          [obj.weight === "heavy" ? "light" : "heavy"]
        ),
        sideCountStep(scene),
      ],
      wrapUp: `The ${obj.name} is ${obj.weight}.`,
    };
  }

  if (bucket === "twoAttributes") {
    const obj = pick(OBJECTS);
    const n = blocksFor(obj);
    const m = scaleBlocksFor(obj);
    const objLeft = Math.random() < 0.5;
    return {
      title: "Two words",
      bucket,
      story: `Look at the ${obj.name}.`,
      // Steps 1 and 2 are about length (blocks). Step 3 is about weight (scale).
      visual: (done, help) => {
        const at = help?.step ?? done;
        return at < 2
          ? <ObjectOnBlocks glyph={obj.glyph} name={obj.name} blocks={n} ring={pointing(help, 0) || (pointing(help, 1) && !help?.showMe)} countAlong={showing(help, 1)} />
          : objectScale(obj, m, objLeft, pointing(help, 2));
      },
      steps: [
        lengthStep(obj, obj.length === "long" ? "short" : "long"),
        countBlocksStep(n, `How many blocks are under the ${obj.name}?`, "Count the blocks under it."),
        choice(
          { prompt: `Is the ${obj.name} heavy or light?`, hint: "The heavy side goes down.", explain: `The ${obj.name} is ${obj.weight}.` },
          obj.weight,
          [obj.weight === "heavy" ? "light" : "heavy"]
        ),
      ],
      wrapUp: `The ${obj.name} is ${obj.length} and ${obj.weight}.`,
    };
  }

  // vocabMatch (review D4): hear the word, tap its picture, then use the picture.
  const w = pick(WORD_LIST);
  const lengthWord = isLengthWord(w);
  const wrongWord: DescribeWord = lengthWord ? pick<DescribeWord>(["heavy", "light"]) : pick<DescribeWord>(["long", "short", "tall"]);
  const options = shuffle<DescribeWord>([w, wrongWord]);
  const nameOf = (x: DescribeWord) => (isLengthWord(x) ? "rod" : "scale");
  const rodN = w === "short" ? randInt(1, 2) : randInt(5, 8);
  const [lo, hi] = [randInt(1, 3), randInt(5, 8)];
  const side = Math.random() < 0.5 ? "left" : "right";
  const heavyOnLeft = side === "left";
  const askCount = w === "heavy" ? hi : w === "light" ? lo : rodN;
  const askSide = (w === "heavy") === heavyOnLeft ? "left" : "right";
  return {
    title: "Words",
    bucket,
    story: "Listen to the word.",
    visual: (done, help) => {
      const at = help?.step ?? done;
      // A two-button pick can't reach Show me, so its demo plays on the first wrong try.
      if (at < 1)
        return pointing(help, 0) ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <WordCard word={w} />
            <WordPicture word={w} />
          </div>
        ) : (
          <WordCard word={w} />
        );
      const count = showing(help, 1);
      const ring = pointing(help, 1) && !help?.showMe;
      if (w === "tall") return <StandingRod blocks={rodN} ring={ring} countAlong={count} />;
      if (lengthWord) return <LengthBars max={8} bars={[{ blocks: rodN, tone: "a", label: "Rod", ring, countAlong: count }]} />;
      return <BalanceScale left={heavyOnLeft ? hi : lo} right={heavyOnLeft ? lo : hi} point={ring ? askSide : undefined} countSide={count ? askSide : undefined} />;
    },
    steps: [
      pictureChoice(
        { prompt: <>Which picture shows <b>{w}</b>?</>, hint: w === "short" ? "Short is a few blocks. Find the rod." : w === "light" ? "Light goes up. Find the scale." : lengthWord ? "It tells how long. Find the rod." : "It tells how heavy. Find the scale.", explain: WORD_LINES[w] },
        options.map((x) => [nameOf(x), <WordPicture key={x} word={x} />]),
        options.indexOf(w)
      ),
      countBlocksStep(
        askCount,
        w === "tall" ? "How tall is the rod? Count the blocks." : lengthWord ? "How many blocks long is the rod?" : `How many blocks are on the ${w} side?`
      ),
    ],
    wrapUp: WORD_LINES[w],
  };
}

export const describingHowObjectsAreMeasured: Unit = {
  id: "describingHowObjectsAreMeasured",
  title: "Long and Heavy",
  goal: "Tell how long. Tell how heavy.",
  standard: "K.MD.1",
  keyIdea: (
    <>
      <p>Things can be long or short.</p>
      <p>Things can be heavy or light.</p>
      <p>Big does not mean heavy.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Vocabulary-application skill tied to whatever object is shown, not a
  // fixed fact set — so no reintroEverySolved.
  problems: [{ label: "Long and Heavy", make: describingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: describingTest,
};
