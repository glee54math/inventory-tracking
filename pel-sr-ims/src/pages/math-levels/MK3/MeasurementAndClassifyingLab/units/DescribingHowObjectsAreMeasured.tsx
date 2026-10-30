import { useEffect, useState } from "react";
import { ObjectGlyph, WordCard } from "../diagrams";
import { pick } from "../../../shared/lib/math";
import { choice, sentence, selectBlank, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { describingTest } from "./DescribingHowObjectsAreMeasuredTest";

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

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Vocabulary: two describing words picked to be easy to conflate (heavy vs
 *  tall, light vs long) rather than two words that are obviously opposite. */
function VocabWordsQuestion({ onComplete }: { onComplete?: () => void }) {
  const [weightPick, setWeightPick] = useState("");
  const [lengthPick, setLengthPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [weightPick, lengthPick].every((v) => String(v).trim() !== "");
  const weightOk = weightPick === "heavy";
  const lengthOk = lengthPick === "long";
  const ok = weightOk && lengthOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Two of these words tell you about weight, and two tell you about length.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which word tells you about WEIGHT, not length?{" "}
          <select className="answer" value={weightPick} onChange={(e) => setWeightPick(e.target.value)} style={fieldOk(weightOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="tall">tall</option>
            <option value="heavy">heavy</option>
          </select>
        </label>
        <label>
          Which word tells you about LENGTH, not weight?{" "}
          <select className="answer" value={lengthPick} onChange={(e) => setLengthPick(e.target.value)} style={fieldOk(lengthOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="light">light</option>
            <option value="long">long</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? '"Heavy" is about weight, and "long" is about length — even though "tall" and "light" sound like they could also fit, "tall" is really about length and "light" is really about weight.'
            : "Not quite — read each word carefully. \"Tall\" and \"long\" both describe length; \"heavy\" and \"light\" both describe weight."}
        </p>
      )}
    </div>
  );
}

/** Common conflation: bigger-looking does NOT mean heavier. Both the "big"
 *  idea and the "heavy" idea live in the same question, on purpose. */
function SizeVsWeightQuestion({ onComplete }: { onComplete?: () => void }) {
  const [biggerPick, setBiggerPick] = useState("");
  const [heavierPick, setHeavierPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [biggerPick, heavierPick].every((v) => String(v).trim() !== "");
  const biggerOk = biggerPick === "balloon";
  const heavierOk = heavierPick === "rock";
  const ok = biggerOk && heavierOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Look at a big balloon and a small rock.
      </p>
      <div className="control-row" style={{ gap: 28 }}>
        <ObjectGlyph glyph={"🎈"} name="balloon" big />
        <ObjectGlyph glyph={"🪨"} name="rock" />
      </div>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Which one takes up MORE space (looks bigger)?{" "}
          <select className="answer" value={biggerPick} onChange={(e) => setBiggerPick(e.target.value)} style={fieldOk(biggerOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="balloon">balloon</option>
            <option value="rock">rock</option>
          </select>
        </label>
        <label>
          Which one is HEAVIER?{" "}
          <select className="answer" value={heavierPick} onChange={(e) => setHeavierPick(e.target.value)} style={fieldOk(heavierOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="balloon">balloon</option>
            <option value="rock">rock</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the balloon looks bigger, but the rock is heavier. Looking bigger and being heavier are two different things."
            : "Not quite — look again. The balloon takes up more space, but a small rock can still be heavier than it."}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap, directly following from Q2's example. */
function BiggerAlwaysHeavierQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: an object that looks bigger is always heavier than an object that looks smaller.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — false. Remember the balloon and the rock: the balloon looks bigger but the rock is heavier. Size and weight don't always match."
            : "Not quite — think back to the balloon and the rock. The balloon looked bigger, but it wasn't the heavier one."}
        </p>
      )}
    </div>
  );
}

/** Holding two independent attributes of ONE object at the same time. */
function TwoAttributesQuestion({ onComplete }: { onComplete?: () => void }) {
  const [lengthPick, setLengthPick] = useState("");
  const [weightPick, setWeightPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [lengthPick, weightPick].every((v) => String(v).trim() !== "");
  const lengthOk = lengthPick === "long";
  const weightOk = weightPick === "heavy";
  const ok = lengthOk && weightOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> Look at the train.
      </p>
      <ObjectGlyph glyph={"🚂"} name="train" big />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Is the train long or short?{" "}
          <select className="answer" value={lengthPick} onChange={(e) => setLengthPick(e.target.value)} style={fieldOk(lengthOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="long">long</option>
            <option value="short">short</option>
          </select>
        </label>
        <label>
          Is the train heavy or light?{" "}
          <select className="answer" value={weightPick} onChange={(e) => setWeightPick(e.target.value)} style={fieldOk(weightOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="heavy">heavy</option>
            <option value="light">light</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — the train is BOTH long AND heavy. One object can have more than one measurable attribute at the same time."
            : "Not quite — a train is long (think how far it stretches) and heavy (think how hard it would be to lift)."}
        </p>
      )}
    </div>
  );
}

function DescribingCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, sizeVsWeight: false, trap: false, twoAttr: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure these describing words make sense before you try practice problems.</p>
      <VocabWordsQuestion onComplete={mark("vocab")} />
      <SizeVsWeightQuestion onComplete={mark("sizeVsWeight")} />
      <BiggerAlwaysHeavierQuestion onComplete={mark("trap")} />
      <TwoAttributesQuestion onComplete={mark("twoAttr")} />
    </div>
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
      <div className="control-row">
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
      {(introActive || showCheck) && <DescribingCheckForUnderstanding onComplete={onIntroDone} />}

      <p className="muted small">Click an object to see how it can be described.</p>
      <div className="control-row" role="listbox" aria-label="Pick an object">
        {shown.map((o, i) => (
          <button key={o.name} role="option" aria-selected={i === objIndex} className={`btn ghost ${i === objIndex ? "pressed" : ""}`} onClick={() => setObjIndex(i)}>
            {o.glyph} {o.name}
          </button>
        ))}
      </div>
      <ObjectGlyph glyph={obj.glyph} name={obj.name} big />
      <p className="feedback good" style={{ minHeight: 24 }}>
        This {obj.name} is <b>{obj.length}</b> and <b>{obj.weight}</b>.
      </p>

      <p className="muted small">Click a describing word to see which attribute it's about.</p>
      <div className="control-row">
        {WORDS.map((w) => (
          <button key={w.word} type="button" className="btn ghost" onClick={() => setRevealedWord(w.word)}>
            {w.word}
          </button>
        ))}
      </div>
      {revealedWord && (
        <p className="feedback good">
          "{revealedWord}" describes {WORDS.find((w) => w.word === revealedWord)!.attr}.
        </p>
      )}
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
