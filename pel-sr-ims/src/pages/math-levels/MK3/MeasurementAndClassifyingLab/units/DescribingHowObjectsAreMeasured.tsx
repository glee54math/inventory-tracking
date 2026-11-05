import { useState } from "react";
import { BalanceScale, LengthBars, ObjectGlyph, WordCard } from "../diagrams";
import { pick } from "../../../shared/lib/math";
import { choice, sentence, selectBlank, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { describingTest } from "./DescribingHowObjectsAreMeasuredTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { CheckSequence, PickCheck, TypeCheck } from "../../../shared/components/KCheck";

// ============================================================================
// SHARED DATA — object pool + describing-word pool. Duplicated (not
// imported) in DescribingHowObjectsAreMeasuredTest.tsx, same intentional
// per-*Test.tsx convention as every other lab (see MK1_CountingAndCardinalityLab).
// ============================================================================

export interface MeasureObject {
  name: string;
  glyph: string;
  length: "long" | "short";
  weight: "heavy" | "light";
}

// 3 objects per (length x weight) combination, so every combo — and every
// bucket that depends on one — is always reachable, not just reachable "on
// average."
export const OBJECTS: MeasureObject[] = [
  { name: "train", glyph: "🚂", length: "long", weight: "heavy" },
  { name: "crocodile", glyph: "🐊", length: "long", weight: "heavy" },
  { name: "log", glyph: "🪵", length: "long", weight: "heavy" },
  { name: "pencil", glyph: "✏️", length: "long", weight: "light" },
  { name: "snake", glyph: "🐍", length: "long", weight: "light" },
  { name: "jump rope", glyph: "🨢", length: "long", weight: "light" },
  { name: "rock", glyph: "🪨", length: "short", weight: "heavy" },
  { name: "anchor", glyph: "⚓", length: "short", weight: "heavy" },
  { name: "brick", glyph: "🧱", length: "short", weight: "heavy" },
  { name: "feather", glyph: "🪶", length: "short", weight: "light" },
  { name: "balloon", glyph: "🎈", length: "short", weight: "light" },
  { name: "leaf", glyph: "🍃", length: "short", weight: "light" },
];

export const WORDS: { word: string; attr: "length" | "weight" }[] = [
  { word: "long", attr: "length" },
  { word: "short", attr: "length" },
  { word: "tall", attr: "length" },
  { word: "heavy", attr: "weight" },
  { word: "light", attr: "weight" },
];

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

// Kindergarten-sized, one question at a time (shared/components/KCheck.tsx).
// Ideas checked: words for weight and length; looking bigger is not the
// same as being heavier; one object has a length AND a weight.

const wordBtn = (w: string) => ({ id: w, label: w });

function DescribingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  return (
    <CheckSequence
      onComplete={onComplete}
      items={[
        (done) => (
          <PickCheck
            n={1}
            prompt="Which word tells how heavy something is?"
            picture={<BalanceScale left={6} right={2} leftLabel="Heavy" rightLabel="Light" />}
            showPicture={<BalanceScale left={6} right={2} leftLabel="Heavy" rightLabel="Light" />}
            showText="The heavy side goes down. Heavy tells about weight."
            options={["tall", "heavy", "long"].map(wordBtn)}
            answer="heavy"
            why={{ tall: "Tall tells how high something is.", long: "Long tells how far it is from end to end." }}
            praise="Yes! Heavy tells about weight."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={2}
            prompt="A big balloon and a small rock. Which one is heavier?"
            picture={
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                <ObjectGlyph glyph={"🎈"} name="balloon" big />
                <ObjectGlyph glyph={"🪨"} name="rock" />
              </div>
            }
            showPicture={<BalanceScale left={1} right={6} leftLabel="Balloon" rightLabel="Rock" />}
            showText="Watch: on the scale, the rock goes down. The rock is heavier."
            options={["balloon", "rock"].map(wordBtn)}
            answer="rock"
            why={{ balloon: "The balloon is big, but it is full of air. Big does not mean heavy." }}
            praise="Yes! The rock is small, but it is heavier."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={2}
            prompt="How many blocks are on the heavy side?"
            answer={6}
            tone="b"
            picture={() => <BalanceScale left={1} right={6} leftLabel="Balloon" rightLabel="Rock" />}
            nudge="Find the side that went down. Count its blocks."
            why={{ 1: "That is the light side. Count the side that went down." }}
            showText="Watch and listen: the rock side has 1, 2, 3, 4, 5, 6."
            praise="Yes! The rock side has 6."
            onComplete={done}
          />
        ),
        (done) => (
          <TypeCheck
            n={3}
            prompt="How long is the train? Count the blocks."
            answer={7}
            tone="a"
            picture={(m) => <LengthBars bars={[{ blocks: 7, tone: "a", label: "Train", numbered: m === "show" || m === "done" }]} />}
            nudge="Count each block once."
            showText="Watch and listen: 1, 2, 3, 4, 5, 6, 7."
            praise="Yes! The train is 7 blocks long."
            onComplete={done}
          />
        ),
        (done) => (
          <PickCheck
            n={4}
            prompt="The train is long. What else is it?"
            picture={<ObjectGlyph glyph={"🚂"} name="train" big />}
            showPicture={<BalanceScale left={2} right={8} leftLabel="Toy" rightLabel="Train" />}
            showText="Look: the train goes way down. A train is heavy."
            options={["heavy", "light"].map(wordBtn)}
            answer="heavy"
            why={{ light: "Could you lift a train? It is not light." }}
            praise="Yes! A train is long AND heavy."
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
  const [objIndex, setObjIndex] = useState(0);
  const [revealedWord, setRevealedWord] = useState<string | null>(null);
  const shown = OBJECTS.slice(0, 8);
  const obj = shown[objIndex];

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

      <ReadAloud as="p" className="muted small">Click an object to see how it can be described.</ReadAloud>
      <div className="control-row" role="listbox" aria-label="Pick an object" data-readaloud-part>
        {shown.map((o, i) => (
          <button key={o.name} role="option" aria-selected={i === objIndex} className={`btn ghost ${i === objIndex ? "pressed" : ""}`} onClick={() => setObjIndex(i)}>
            {o.glyph} {o.name}
          </button>
        ))}
      </div>
      <ObjectGlyph glyph={obj.glyph} name={obj.name} big />
      <ReadAloud as="p" className="feedback good" style={{ minHeight: 24 }}>
        This {obj.name} is <b>{obj.length}</b> and <b>{obj.weight}</b>.
      </ReadAloud>

      <ReadAloud as="p" className="muted small">Click a describing word to see which attribute it's about.</ReadAloud>
      <div className="control-row" data-readaloud-part>
        {WORDS.map((w) => (
          <button key={w.word} type="button" className="btn ghost" onClick={() => setRevealedWord(w.word)}>
            {w.word}
          </button>
        ))}
      </div>
      {revealedWord && (
        <ReadAloud as="p" className="feedback good">
          "{revealedWord}" describes {WORDS.find((w) => w.word === revealedWord)!.attr}.
        </ReadAloud>
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

function describingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? pick(BUCKETS);

  if (bucket === "lengthSingle") {
    const obj = pick(OBJECTS);
    const other = obj.length === "long" ? "short" : "long";
    return {
      title: "Long or short?",
      bucket,
      story: `Look at the ${obj.name}.`,
      visual: () => <ObjectGlyph glyph={obj.glyph} name={obj.name} big />,
      steps: [
        choice(
          { prompt: `Is the ${obj.name} long or short?`, hint: "Think about how it would look stretched out end to end.", explain: `The ${obj.name} is ${obj.length}.` },
          obj.length,
          [other]
        ),
        choice(
          { prompt: `Which word describes LENGTH, not weight: "${obj.length}" or "heavy"?`, hint: "Length is about how long or short something is.", explain: `"${obj.length}" describes length. "heavy" describes weight instead.` },
          obj.length,
          ["heavy"]
        ),
      ],
      wrapUp: `The ${obj.name} is ${obj.length}.`,
    };
  }

  if (bucket === "weightSingle") {
    const obj = pick(OBJECTS);
    const other = obj.weight === "heavy" ? "light" : "heavy";
    return {
      title: "Heavy or light?",
      bucket,
      story: `Look at the ${obj.name}.`,
      visual: () => <ObjectGlyph glyph={obj.glyph} name={obj.name} big />,
      steps: [
        choice(
          { prompt: `Is the ${obj.name} heavy or light?`, hint: "Think about how hard it would be to lift.", explain: `The ${obj.name} is ${obj.weight}.` },
          obj.weight,
          [other]
        ),
        choice(
          { prompt: `Which word describes WEIGHT, not length: "${obj.weight}" or "long"?`, hint: "Weight is about how heavy or light something is.", explain: `"${obj.weight}" describes weight. "long" describes length instead.` },
          obj.weight,
          ["long"]
        ),
      ],
      wrapUp: `The ${obj.name} is ${obj.weight}.`,
    };
  }

  if (bucket === "twoAttributes") {
    const obj = pick(OBJECTS);
    const otherLen = obj.length === "long" ? "short" : "long";
    const otherWt = obj.weight === "heavy" ? "light" : "heavy";
    return {
      title: "Two words for one object",
      bucket,
      story: `Look at the ${obj.name}. It has more than one way to describe it.`,
      visual: () => <ObjectGlyph glyph={obj.glyph} name={obj.name} big />,
      steps: [
        sentence(
          { prompt: "Fill in both words.", hint: "One word is about length, one is about weight.", explain: `The ${obj.name} is ${obj.length} and ${obj.weight}.` },
          `This ${obj.name} is `,
          selectBlank(obj.length, [otherLen]),
          " and ",
          selectBlank(obj.weight, [otherWt]),
          "."
        ),
        choice(
          {
            prompt: `If someone painted the ${obj.name} a new color, would it become longer/shorter or heavier/lighter?`,
            hint: "Painting something changes how it looks, not how long or heavy it actually is.",
            explain: "No — color doesn't change an object's length or weight, only how it looks.",
          },
          "No — it would stay the same length and weight",
          ["Yes — a new color always changes its size"]
        ),
      ],
      wrapUp: `The ${obj.name} is ${obj.length} and ${obj.weight}.`,
    };
  }

  // vocabMatch
  const w = pick(WORDS);
  const sameAttr = WORDS.filter((x) => x.attr === w.attr && x.word !== w.word);
  const oppAttr = WORDS.filter((x) => x.attr !== w.attr);
  const sameWord = pick(sameAttr).word;
  const oppWord = pick(oppAttr).word;
  const oppLabel = w.attr === "length" ? "weight" : "length";
  return {
    title: "What does this word describe?",
    bucket,
    story: `The word "${w.word}" is a describing word.`,
    visual: () => <WordCard word={w.word} />,
    steps: [
      choice(
        {
          prompt: `Does "${w.word}" tell you about an object's LENGTH or its WEIGHT?`,
          hint: `Think about what "${w.word}" means when you say it about an object.`,
          explain: `"${w.word}" describes ${w.attr}.`,
        },
        w.attr === "length" ? "Length" : "Weight",
        [w.attr === "length" ? "Weight" : "Length"]
      ),
      choice(
        {
          prompt: `Which of these ALSO describes ${w.attr}: "${sameWord}" or "${oppWord}"?`,
          hint: `One of these words goes with "${w.word}", and one doesn't.`,
          explain: `"${sameWord}" describes ${w.attr}, just like "${w.word}" does. "${oppWord}" describes ${oppLabel} instead.`,
        },
        sameWord,
        [oppWord]
      ),
    ],
    wrapUp: `"${w.word}" describes ${w.attr}.`,
  };
}

export const describingHowObjectsAreMeasured: Unit = {
  id: "describingHowObjectsAreMeasured",
  title: "Describing How Objects Are Measured",
  goal: "Name ways an object can be measured, like how long it is or how heavy it is.",
  standard: "K.MD.1",
  keyIdea: (
    <>
      <p>Every object has measurable attributes — like how LONG or SHORT it is, and how HEAVY or LIGHT it is.</p>
      <p>Looking bigger does NOT always mean being heavier — a balloon looks big but a rock is heavier. One object can have more than one attribute at once.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Vocabulary-application skill tied to whatever object is shown, not a
  // fixed fact set — so no reintroEverySolved.
  problems: [{ label: "Describing Objects", make: describingProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: describingTest,
};
