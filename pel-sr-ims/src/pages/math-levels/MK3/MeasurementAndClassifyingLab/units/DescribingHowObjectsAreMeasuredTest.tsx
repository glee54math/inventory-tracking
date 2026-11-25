import type { ReactNode } from "react";
import { BalanceScale, ObjectOnBlocks, StandingRod, WordCard, WordPicture, type DescribeWord } from "../diagrams";
import { pick, randInt, shuffle } from "../../../shared/lib/math";
import { choice, pictureChoice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { OBJECTS, WORD_LINES, blocksFor, blocksWord, scaleBlocksFor, sideCountScene, sizePairScale, type MeasureObject } from "./labParts";

// ---------- end-of-unit test: Long and Heavy ----------
// Shared data comes from labParts, never from the unit file (the unit file
// imports this test, so importing back would be a circular import).

/** The object on one pan against blocks. Which way it moves shows heavy or light. */
const objectScale = (obj: MeasureObject, n: number): ReactNode => {
  const objLeft = Math.random() < 0.5;
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
      down={obj.weight === "heavy" ? objSide : blockSide}
    />
  );
};

const wordPick = (word: DescribeWord, wrong: DescribeWord, difficulty: TestQuestion["difficulty"]): TestQuestion[] => {
  const nameOf = (x: DescribeWord) => (x === "heavy" || x === "light" ? "scale" : "rod");
  const options = shuffle<DescribeWord>([word, wrong]);
  return [
    {
      visual: <WordCard word={word} />,
      difficulty,
      step: pictureChoice(
        { prompt: <>Which picture shows <b>{word}</b>?</>, hint: "Listen to the word.", explain: WORD_LINES[word] },
        options.map((x) => [nameOf(x), <WordPicture key={x} word={x} />]),
        options.indexOf(word)
      ),
    },
  ];
};

/** Long or short, read from the blocks under the object. */
export const lengthQuestion = (): TestQuestion[] => {
  const obj = pick(OBJECTS);
  return [
    {
      visual: <ObjectOnBlocks glyph={obj.glyph} name={obj.name} blocks={blocksFor(obj)} />,
      difficulty: "easy",
      step: choice({ prompt: `Is the ${obj.name} long or short?`, hint: "Look at the blocks.", explain: `The ${obj.name} is ${obj.length}.` }, obj.length, [obj.length === "long" ? "short" : "long"]),
    },
  ];
};

/** Heavy or light, read from the scale. */
export const weightQuestion = (): TestQuestion[] => {
  const obj = pick(OBJECTS);
  return [
    {
      visual: objectScale(obj, scaleBlocksFor(obj)),
      difficulty: "easy",
      step: choice({ prompt: `Is the ${obj.name} heavy or light?`, hint: "Look at the scale.", explain: `The ${obj.name} is ${obj.weight}.` }, obj.weight, [obj.weight === "heavy" ? "light" : "heavy"]),
    },
  ];
};

/** One object, a second word: told its length, read its weight. */
export const twoAttributesQuestion = (): TestQuestion[] => {
  const obj = pick(OBJECTS);
  return [
    {
      visual: objectScale(obj, scaleBlocksFor(obj)),
      difficulty: "medium",
      step: choice(
        { prompt: `The ${obj.name} is ${obj.length}. What else is it?`, hint: "Look at the scale.", explain: `The ${obj.name} is ${obj.length} and ${obj.weight}.` },
        obj.weight,
        [obj.weight === "heavy" ? "light" : "heavy"]
      ),
    },
  ];
};

const wrongFor = (w: DescribeWord): DescribeWord => (w === "heavy" || w === "light" ? pick<DescribeWord>(["long", "short", "tall"]) : pick<DescribeWord>(["heavy", "light"]));

/** Hear a word, tap its picture. The answer can be the rod or the scale. */
export const wordPictureQuestion = (): TestQuestion[] => {
  const w = pick<DescribeWord>(["long", "tall", "heavy"]);
  return wordPick(w, wrongFor(w), "medium");
};

/** The same skill from a separate word pool, so the two never match. */
export const wordPictureQuestionB = (): TestQuestion[] => {
  const w = pick<DescribeWord>(["short", "light"]);
  return wordPick(w, wrongFor(w), "medium");
};

/** Big does not mean heavy, and small does not either: read the scale.
 *  Distractor: whichever object size the student assumes wins. */
export const sizeVsWeightTrapQuestion = (): TestQuestion[] => {
  const pair = sizePairScale();
  return [
    {
      visual: <BalanceScale left={0} right={0} leftObject={pair.leftObject} rightObject={pair.rightObject} leftLabel={pair.leftObject.name} rightLabel={pair.rightObject.name} down={pair.down} />,
      difficulty: "hard",
      step: choice({ prompt: "Which one is heavier?", hint: "Look at the scale.", explain: `The ${pair.heavy} is heavier.` }, pair.heavy, [pair.light]),
    },
  ];
};

/** Typed: how many blocks long (fills the old paint slot, review D10). */
export const blocksLongQuestion = (): TestQuestion[] => {
  const obj = pick(OBJECTS.filter((o) => o.length === "long"));
  const n = randInt(5, 8);
  return [
    {
      visual: <ObjectOnBlocks glyph={obj.glyph} name={obj.name} blocks={n} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `How many blocks are under the ${obj.name}?`, hint: "Count the blocks under it.", explain: `It is ${blocksWord(n)} long.`, answer: n },
    },
  ];
};

/** Typed: count the side that went down or up (D11). Distractor: the other side's count. */
export const blocksOnScaleQuestion = (): TestQuestion[] => {
  const s = sideCountScene();
  return [
    {
      visual: <BalanceScale left={s.left} right={s.right} />,
      difficulty: "medium",
      step: { kind: "number", prompt: `How many blocks are on the side that went ${s.ask}?`, hint: "Look at the scale.", explain: `That side has ${blocksWord(s.answer)}.`, answer: s.answer },
    },
  ];
};

/** Typed: tall is long, standing up. */
export const tallRodQuestion = (): TestQuestion[] => {
  const n = randInt(3, 8);
  return [
    {
      visual: <StandingRod blocks={n} />,
      difficulty: "medium",
      step: { kind: "number", prompt: "How tall is the rod? Count the blocks.", hint: "Count the blocks.", explain: `It is ${blocksWord(n)} tall.`, answer: n },
    },
  ];
};

/** Read one marked side of the scale: it went down (heavy) or up (light). */
export const sideWordQuestion = (): TestQuestion[] => {
  const markHeavy = Math.random() < 0.5;
  const heavyLeft = Math.random() < 0.5;
  const hi = randInt(4, 8);
  const lo = randInt(1, 3);
  const markLeft = markHeavy === heavyLeft;
  const answer = markHeavy ? "heavy" : "light";
  return [
    {
      visual: <BalanceScale left={heavyLeft ? hi : lo} right={heavyLeft ? lo : hi} point={markLeft ? "left" : "right"} />,
      difficulty: "hard",
      step: choice(
        { prompt: `This side went ${markHeavy ? "down" : "up"}. Is it heavy or light?`, hint: "The heavy side goes down.", explain: `It is ${answer}.` },
        answer,
        [markHeavy ? "light" : "heavy"]
      ),
    },
  ];
};

export const describingTest: Unit["test"] = {
  questions: [
    lengthQuestion,
    weightQuestion,
    twoAttributesQuestion,
    wordPictureQuestion,
    wordPictureQuestionB,
    sizeVsWeightTrapQuestion,
    blocksLongQuestion,
    blocksOnScaleQuestion,
    tallRodQuestion,
    sideWordQuestion,
  ],
  passScore: 9,
};
