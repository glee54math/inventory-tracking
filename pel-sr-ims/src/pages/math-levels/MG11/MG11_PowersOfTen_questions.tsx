import type { ReactNode } from 'react';
import {
  POW, fits, pick, plural, randNum, ri, shift, shuffle, toStr, type Digit,
} from './MG11_PowersOfTen_numberModel';
import PlaceValueChart from './MG11_PowersOfTen_PlaceValueChart';
import { MoveSentence, Pow } from './MG11_PowersOfTen_MoveSentence';
import { tw } from './MG11_PowersOfTen_styles';

export type TopicId = 'move' | 'missing' | 'exp' | 'metric' | 'mistake' | 'word';
export type TopicChoice = TopicId | 'mix';

export const TOPICS: { id: TopicChoice; name: string }[] = [
  { id: 'mix', name: 'Mix it up' },
  { id: 'move', name: 'Move the digits' },
  { id: 'missing', name: 'Find the power' },
  { id: 'exp', name: 'Exponents' },
  { id: 'metric', name: 'Metric units' },
  { id: 'mistake', name: 'Spot the mistake' },
  { id: 'word', name: 'Word problems' },
];

export type ChoiceOption = { key: string; label: ReactNode };

type QuestionBase = { topic: string; prompt: ReactNode; hint: ReactNode; explain: ReactNode };
export type InputQuestion = QuestionBase & { type: 'input'; answer: string; unit?: string };
export type ChoiceQuestion = QuestionBase & { type: 'choice'; choices: ChoiceOption[]; correct: number };
export type Question = InputQuestion | ChoiceQuestion;

const tens = (n: number) => Array(n).fill('10').join(' × ');
const eqBase = `${tw.display} font-semibold leading-[1.25]`;
const Eq = ({ children, small = false }: { children: ReactNode; small?: boolean }) => (
  <div className={`${eqBase} ${small ? 'text-2xl' : 'text-[clamp(26px,7vw,34px)]'}`}>{children}</div>
);
const Sub = ({ children }: { children: ReactNode }) => (
  <div className={`text-base font-semibold ${tw.muted}`}>{children}</div>
);

function uniqChoices(list: ChoiceOption[], correctKey: string) {
  const seen = new Set<string>();
  const choices = shuffle(list.filter((c) => (seen.has(c.key) ? false : (seen.add(c.key), true))));
  return { choices, correct: choices.findIndex((c) => c.key === correctKey) };
}
const numChoice = (s: string): ChoiceOption => ({ key: s, label: s });
const powChoice = (n: number): ChoiceOption => ({ key: `pow${n}`, label: <Pow n={n} /> });

/* ---------- Move the digits ---------- */
function moveQ(t: Digit[], n: number, mult: boolean, useExp: boolean, topic: string): InputQuestion {
  const r = shift(t, mult ? n : -n);
  const op = mult ? '×' : '÷';
  return {
    topic,
    type: 'input',
    prompt: <Eq>{toStr(t)} {op} {useExp ? <Pow n={n} /> : POW[n]} = ?</Eq>,
    answer: toStr(r),
    hint: (
      <>
        {useExp && <><Pow n={n} /> = {POW[n]}. </>}
        Count the zeros in {POW[n]}: that's {n}. Move every digit {n} {plural(n)} to the{' '}
        {mult ? 'left (answer gets bigger)' : 'right (answer gets smaller)'}.
      </>
    ),
    explain: (
      <>
        <p><MoveSentence n={n} mult={mult} useExp={useExp} /></p>
        <PlaceValueChart rows={[{ label: 'Start', tiles: t }, { label: 'Answer', tiles: r }]} />
      </>
    ),
  };
}

function randomPair() {
  for (;;) {
    const t = randNum();
    const n = ri(1, 3);
    const mult = Math.random() < 0.55;
    const r = shift(t, mult ? n : -n);
    if (fits(t) && fits(r)) return { t, n, mult, r };
  }
}

const genMove = (): Question => {
  const { t, n, mult } = randomPair();
  return moveQ(t, n, mult, Math.random() < 0.35, 'Move the digits');
};

/* ---------- Find the power ---------- */
const genMissing = (): Question => {
  const { t, n, mult, r } = randomPair();
  const op = mult ? '×' : '÷';
  return {
    topic: 'Find the power',
    type: 'choice',
    prompt: (
      <>
        <Eq>{toStr(t)} {op} ▢ = {toStr(r)}</Eq>
        <Sub>What goes in the box?</Sub>
      </>
    ),
    choices: ['10', '100', '1,000'].map(numChoice),
    correct: n - 1,
    hint: <>Find one digit in {toStr(t)} and see where it ended up in {toStr(r)}. How many places did it move?</>,
    explain: (
      <>
        <p>
          Each digit moved {n} {plural(n)} to the {mult ? 'left' : 'right'}, so it was {op} {POW[n]} (that's{' '}
          <Pow n={n} />).
        </p>
        <PlaceValueChart rows={[{ label: 'Start', tiles: t }, { label: 'Answer', tiles: r }]} />
      </>
    ),
  };
};

/* ---------- Exponents ---------- */
const genExp = (): Question => {
  const v = ri(0, 4);
  if (v === 0) {
    const n = ri(2, 6);
    return {
      topic: 'Exponents',
      type: 'input',
      prompt: <Eq><Pow n={n} /> = ?</Eq>,
      answer: POW[n],
      hint: <><Pow n={n} /> means {n} tens multiplied together: {tens(n)}.</>,
      explain: <p>{tens(n)} = {POW[n]}. The exponent {n} tells you how many zeros: {n}.</p>,
    };
  }
  if (v === 1) {
    const n = ri(2, 6);
    return {
      topic: 'Exponents',
      type: 'input',
      prompt: (
        <>
          <Sub>Write {POW[n]} as a power of 10.</Sub>
          <Eq>{POW[n]} = 10<sup>?</sup></Eq>
        </>
      ),
      answer: String(n),
      hint: <>Count the zeros in {POW[n]}.</>,
      explain: <p>{POW[n]} has {n} zeros, so it is {n} tens multiplied: {POW[n]} = <Pow n={n} />.</p>,
    };
  }
  if (v === 2) {
    const n = ri(3, 5);
    const { choices, correct } = uniqChoices(
      [powChoice(n), numChoice(String(10 * n)), powChoice(n + 1), numChoice(POW[n - 1])],
      `pow${n}`,
    );
    return {
      topic: 'Exponents',
      type: 'choice',
      prompt: (
        <>
          <Sub>Which is the same as</Sub>
          <Eq small>{tens(n)}</Eq>
        </>
      ),
      choices,
      correct,
      hint: <>Count how many 10s are being multiplied.</>,
      explain: <p>There are {n} tens multiplied, so it's <Pow n={n} />, which equals {POW[n]}.</p>,
    };
  }
  const mult = v === 3;
  for (;;) {
    const t = mult ? randNum(3, 0, 1) : randNum(3, 0, 3);
    const n = ri(1, 3);
    if (fits(t) && fits(shift(t, mult ? n : -n))) return moveQ(t, n, mult, true, 'Exponents');
  }
};

/* ---------- Metric units ---------- */
const CONVERSIONS: [big: string, small: string, n: number][] = [
  ['m', 'cm', 2], ['m', 'mm', 3], ['km', 'm', 3], ['cm', 'mm', 1], ['L', 'mL', 3], ['kg', 'g', 3],
];

const genMetric = (): Question => {
  const [big, small, n] = pick(CONVERSIONS);
  const mult = Math.random() < 0.55; // big -> small means multiply
  const from = mult ? big : small;
  const to = mult ? small : big;
  let t: Digit[];
  let r: Digit[];
  for (;;) {
    t = randNum(3, mult ? -1 : 0, mult ? 1 : 4);
    r = shift(t, mult ? n : -n);
    if (fits(t) && fits(r)) break;
  }
  const fact = `1 ${big} = ${POW[n]} ${small}`;
  return {
    topic: 'Metric units',
    type: 'input',
    unit: to,
    prompt: (
      <>
        <Sub>Convert</Sub>
        <Eq>{toStr(t)} {from} = ? {to}</Eq>
      </>
    ),
    answer: toStr(r),
    hint: (
      <>
        {fact}.{' '}
        {mult
          ? 'Going to a smaller unit means you need more of them, so multiply'
          : 'Going to a bigger unit means you need fewer of them, so divide'}{' '}
        by {POW[n]}.
      </>
    ),
    explain: (
      <>
        <p>
          {fact}, and {POW[n]} = <Pow n={n} />.<br />
          <b>{toStr(t)} {mult ? '×' : '÷'} <Pow n={n} /> = {toStr(r)} {to}</b>
        </p>
        <p><MoveSentence n={n} mult={mult} /></p>
        <PlaceValueChart rows={[{ label: from, tiles: t }, { label: to, tiles: r }]} />
      </>
    ),
  };
};

/* ---------- Spot the mistake ---------- */
const KIDS = ['Shaunnie', 'Marlon', 'Ava', 'Leo', 'Priya', 'Diego', 'Mei', 'Sam'];

const genMistake = (): Question => {
  const v = ri(0, 2);
  const name = pick(KIDS);

  if (v === 0) {
    const n = ri(3, 6);
    const wrong = String(10 * n);
    const { choices, correct } = uniqChoices(
      [wrong, POW[n], POW[n - 1], String(n + 10)].map(numChoice),
      POW[n],
    );
    return {
      topic: 'Spot the mistake',
      type: 'choice',
      prompt: (
        <>
          <Sub>{name} wrote:</Sub>
          <Eq><Pow n={n} /> = {wrong}</Eq>
          <Sub>What does <Pow n={n} /> really equal?</Sub>
        </>
      ),
      choices,
      correct,
      hint: <>The exponent doesn't mean "10 × {n}." It tells how many 10s to multiply.</>,
      explain: <p>{name} did 10 × {n}. But <Pow n={n} /> = {tens(n)} = {POW[n]}.</p>,
    };
  }

  if (v === 1) {
    const n = ri(2, 3);
    const t: Digit[] = [{ d: ri(1, 9), place: 0 }, { d: ri(1, 9), place: -1 }];
    if (Math.random() < 0.4) t.push({ d: ri(1, 9), place: -2 });
    const wrong = toStr(t) + '0'.repeat(n);
    const right = toStr(shift(t, n));
    const { choices, correct } = uniqChoices(
      [wrong, right, toStr(shift(t, n - 1)), toStr(shift(t, n + 1))].map(numChoice),
      right,
    );
    return {
      topic: 'Spot the mistake',
      type: 'choice',
      prompt: (
        <>
          <Sub>{name} wrote:</Sub>
          <Eq>{toStr(t)} × <Pow n={n} /> = {wrong}</Eq>
          <Sub>What's the correct answer?</Sub>
        </>
      ),
      choices,
      correct,
      hint: <>Is {wrong} really bigger than {toStr(t)}? Zeros at the end of a decimal don't change its value.</>,
      explain: (
        <>
          <p>
            {name} just stuck zeros on the end. But {wrong} is still the same as {toStr(t)}! <Pow n={n} /> ={' '}
            {POW[n]}, so every digit must slide {n} places left.
          </p>
          <PlaceValueChart rows={[{ label: 'Start', tiles: t }, { label: 'Answer', tiles: shift(t, n) }]} />
        </>
      ),
    };
  }

  let t: Digit[];
  let n: number;
  for (;;) {
    t = randNum(3, 1, 3);
    n = ri(1, 3);
    if (fits(shift(t, n)) && fits(shift(t, -n))) break;
  }
  const wrong = toStr(shift(t, n));
  const right = toStr(shift(t, -n));
  const other = toStr(shift(t, n > 1 ? -(n - 1) : -(n + 1)));
  const { choices, correct } = uniqChoices([wrong, right, other].map(numChoice), right);
  return {
    topic: 'Spot the mistake',
    type: 'choice',
    prompt: (
      <>
        <Sub>{name} says:</Sub>
        <Eq>{toStr(t)} ÷ {POW[n]} = {wrong}</Eq>
        <Sub>What's the correct answer?</Sub>
      </>
    ),
    choices,
    correct,
    hint: <>Should dividing make the number bigger or smaller?</>,
    explain: (
      <>
        <p>
          {name} moved the digits left, which is multiplying. Dividing makes a number smaller, so the digits move{' '}
          <b>right</b> {n} {plural(n)}.
        </p>
        <PlaceValueChart rows={[{ label: 'Start', tiles: t }, { label: 'Answer', tiles: shift(t, -n) }]} />
      </>
    ),
  };
};

/* ---------- Word problems ---------- */
type WordProblem = { prompt: ReactNode; answer: string; unit: string; hint: ReactNode; explain: ReactNode };

const WORD_PROBLEMS: WordProblem[] = [
  {
    prompt: 'The United States has about 320,000,000 people. Canada has about 1/10 as many people. About how many people live in Canada?',
    answer: '32,000,000', unit: 'people',
    hint: '"1/10 as many" means divide by 10.',
    explain: '320,000,000 ÷ 10 = 32,000,000. Each digit moves 1 place right, so the answer has one fewer zero (7 zeros become 6).',
  },
  {
    prompt: 'James drinks 800 mL of water during each workout and works out 3 days a week. Henry drinks 600 mL each workout and works out 5 days a week. How many liters do they drink in all each week?',
    answer: '5.4', unit: 'L',
    hint: 'Find the total milliliters first. Then remember 1,000 mL = 1 L.',
    explain: <>James: 800 × 3 = 2,400 mL. Henry: 600 × 5 = 3,000 mL. Together: 5,400 mL.<br />5,400 ÷ <Pow n={3} /> = 5.4 L (digits move 3 places right).</>,
  },
  {
    prompt: 'The bar for a high jump contest must be 4.75 m high. How many millimeters is that?',
    answer: '4,750', unit: 'mm',
    hint: <>1 m = 1,000 mm = <Pow n={3} /> mm.</>,
    explain: <>4.75 × <Pow n={3} /> = 4,750 mm. The digits move 3 places left.</>,
  },
  {
    prompt: 'A roll of ribbon is 3.6 m long. How many centimeters long is it?',
    answer: '360', unit: 'cm',
    hint: <>1 m = 100 cm = <Pow n={2} /> cm.</>,
    explain: <>3.6 × <Pow n={2} /> = 360 cm. The digits move 2 places left, and a placeholder zero fills the ones place.</>,
  },
  {
    prompt: 'A garden path is 2,500 cm long. How many meters long is it?',
    answer: '25', unit: 'm',
    hint: 'Centimeters to meters is small unit to big unit. Divide by 100.',
    explain: <>2,500 ÷ <Pow n={2} /> = 25 m. The digits move 2 places right.</>,
  },
  {
    prompt: 'A 5 kg bag of rice is shared equally into 100 small bags. How many kilograms of rice go in each small bag?',
    answer: '0.05', unit: 'kg',
    hint: 'Share equally into 100 bags means divide by 100.',
    explain: '5 ÷ 100 = 0.05 kg. The 5 moves from the ones place 2 places right, into the hundredths place.',
  },
  {
    prompt: 'Four water bottles each hold 750 mL. How many liters is that in all?',
    answer: '3', unit: 'L',
    hint: 'Find the total mL, then divide by 1,000.',
    explain: <>750 × 4 = 3,000 mL. 3,000 ÷ <Pow n={3} /> = 3 L.</>,
  },
  {
    prompt: 'A bake sale raised $420. The school fair raised 10 times as much. How many dollars did the fair raise?',
    answer: '4,200', unit: 'dollars',
    hint: '"10 times as much" means multiply by 10.',
    explain: '420 × 10 = 4,200. Each digit moves 1 place left.',
  },
  {
    prompt: 'A ladybug is 0.8 cm long. A picture in a book shows it 100 times as long. How long is the ladybug in the picture?',
    answer: '80', unit: 'cm',
    hint: 'Multiply by 100: move the digits 2 places left.',
    explain: <>0.8 × <Pow n={2} /> = 80 cm. The 8 moves from tenths to tens.</>,
  },
  {
    prompt: <>Each week, Ms. Lee's class collects <Pow n={3} /> cans. How many cans do they collect in 6 weeks?</>,
    answer: '6,000', unit: 'cans',
    hint: <><Pow n={3} /> = 1,000. Now multiply by 6.</>,
    explain: <>6 × <Pow n={3} /> = 6 × 1,000 = 6,000 cans.</>,
  },
];

/* ---------- Bank ---------- */
/** Creates a question source. Word problems are dealt from a shuffled deck so none repeat until all are used. */
export function createQuestionBank() {
  let deck: number[] = [];
  const genWord = (): Question => {
    if (!deck.length) deck = shuffle(WORD_PROBLEMS.map((_, i) => i));
    const w = WORD_PROBLEMS[deck.pop()!];
    return {
      topic: 'Word problems',
      type: 'input',
      unit: w.unit,
      prompt: <div className="font-semibold">{w.prompt}</div>,
      answer: w.answer,
      hint: w.hint,
      explain: <p>{w.explain}</p>,
    };
  };

  const generators: Record<TopicId, () => Question> = {
    move: genMove,
    missing: genMissing,
    exp: genExp,
    metric: genMetric,
    mistake: genMistake,
    word: genWord,
  };

  return {
    next(topic: TopicChoice): Question {
      const id = topic === 'mix' ? pick(Object.keys(generators) as TopicId[]) : topic;
      return generators[id]();
    },
  };
}
