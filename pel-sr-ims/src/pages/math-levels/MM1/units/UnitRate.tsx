import React, { useState } from "react";
import { DoubleNumberLine, TapeDiagram } from "../diagrams";
import { palette } from "../lib/palette";
import { fmt, fracText, gcd, money, pick, randInt } from "../lib/math";
import { choice, type Problem } from "../engine/types";
import { QA, QB, Says, Segmented, Stepper } from "../engine/controls";
import type { Unit } from "./types";

interface Preset {
  id: string;
  name: string;
  a: string;
  aOne: string;
  aShort: string;
  b: string;
  bOne: string;
  bShort: string;
  av: number;
  bv: number;
  money?: boolean;
}

const presets: Preset[] = [
  { id: "recipe", name: "Recipe", a: "cups of flour", aOne: "cup of flour", aShort: "flour", b: "cups of sugar", bOne: "cup of sugar", bShort: "sugar", av: 3, bv: 4 },
  { id: "burgers", name: "Hamburgers", a: "dollars", aOne: "dollar", aShort: "dollars", b: "hamburgers", bOne: "hamburger", bShort: "burgers", av: 75, bv: 15, money: true },
  { id: "pages", name: "Reading", a: "pages", aOne: "page", aShort: "pages", b: "minutes", bOne: "minute", bShort: "minutes", av: 12, bv: 8 },
];

/** "3/4 cup", "1 1/2 cups": singular for amounts of 1 or less. */
const amount = (n: number, d: number, one: string, many: string) => `${fracText(n, d, true)} ${n / d <= 1 ? one : many}`;

function Explore() {
  const [id, setId] = useState(presets[0].id);
  const p = presets.find((x) => x.id === id)!;
  const [av, setAv] = useState(p.av);
  const [bv, setBv] = useState(p.bv);
  const choose = (nid: string) => {
    const n = presets.find((x) => x.id === nid)!;
    setId(nid);
    setAv(n.av);
    setBv(n.bv);
  };
  const rate = av / bv;
  const maxA = p.money ? 120 : 24;

  return (
    <div className="explore">
      <div className="controls">
        <Segmented label="Situation" options={presets.map((x) => ({ id: x.id, label: x.name }))} value={id} onChange={choose} />
        <div className="control-row">
          <Stepper tone="a" label={p.a} value={av} min={1} max={maxA} step={p.money ? 5 : 1} onChange={setAv} />
          <Stepper tone="b" label={p.b} value={bv} min={1} max={p.money ? 20 : 12} onChange={setBv} />
        </div>
      </div>
      <div className="stage">
        <DoubleNumberLine
          top={{ label: p.aShort, color: palette.a, format: p.money ? (v) => money(v) : (v) => fracText(Math.round(v * bv), bv, true) }}
          bottom={{ label: p.bShort, color: palette.b }}
          pairs={[
            { top: 0, bottom: 0 },
            { top: rate, bottom: 1, highlight: true },
            ...(bv > 3 ? [{ top: rate * 2, bottom: 2 }] : []),
            { top: av, bottom: bv },
          ]}
        />
        {!p.money && (
          <TapeDiagram
            tapes={[
              { label: p.aShort, units: bv, color: palette.a, values: Array(bv).fill(fracText(av, bv)), total: `${av} ${av === 1 ? p.aOne : p.a} shared equally` },
              { label: p.bShort, units: bv, color: palette.b, values: Array(bv).fill("1"), total: `${bv} ${bv === 1 ? p.bOne : p.b}` },
            ]}
            unitWidth={Math.min(56, 460 / bv)}
          />
        )}
      </div>
      <div className="sayings">
        <Says>
          The ratio is <QA>{p.money ? money(av) : `${av} ${av === 1 ? p.aOne : p.a}`}</QA> to <QB>{`${bv} ${bv === 1 ? p.bOne : p.b}`}</QB>.
        </Says>
        <Says>
          Divide to find the amount for one: {fmt(av)} ÷ {bv} = <b>{p.money ? money(rate) : fracText(av, bv, true)}</b>. That's{" "}
          <QA>{p.money ? money(rate) : amount(av, bv, p.aOne, p.a)}</QA> <b>per</b> <QB>{p.bOne}</QB>. This is the <b>unit rate</b>.
        </Says>
        {!p.money && (
          <Says>
            Flip it for the other unit rate: {bv} ÷ {av} = <b>{fracText(bv, av, true)}</b>, so <QB>{amount(bv, av, p.bOne, p.b)}</QB> per <QA>{p.aOne}</QA>.
          </Says>
        )}
      </div>
    </div>
  );
}

const shopItems = [
  { one: "hamburger", many: "hamburgers" },
  { one: "notebook", many: "notebooks" },
  { one: "movie ticket", many: "movie tickets" },
  { one: "pound of apples", many: "pounds of apples" },
  { one: "smoothie", many: "smoothies" },
];

const priceProblem = (): Problem => {
  const it = pick(shopItems);
  const n = randInt(3, 12);
  const price = pick([2, 3, 4, 5, 6, 7, 8, 9, 2.5, 3.5, 4.5]);
  const total = n * price;
  return {
    title: "Unit price",
    story: (
      <>
        We paid <QA>{money(total)}</QA> for <QB>{n} {it.many}</QB>. How much is that for one {it.one}?
      </>
    ),
    visual: (done) => (
      <DoubleNumberLine
        top={{ label: "dollars", color: palette.a, format: money }}
        bottom={{ label: it.many.split(" ")[0], color: palette.b }}
        pairs={[
          { top: 0, bottom: 0 },
          { top: price, bottom: 1, hideTop: done < 2, highlight: done >= 1 },
          { top: total, bottom: n },
        ]}
      />
    ),
    steps: [
      {
        kind: "ratio",
        prompt: (
          <>
            Write the ratio of <QA>dollars</QA> to <QB>{it.many}</QB>.
          </>
        ),
        answer: [total, n],
        labels: ["dollars", it.many],
        hint: "Dollars first, then the number of items.",
        explain: `${fmt(total)}:${n}`,
      },
      choice(
        { prompt: <>To find the cost of 1 {it.one}, what should you do?</>, hint: `The ${n} ${it.many} share the cost equally.`, explain: `Split ${money(total)} into ${n} equal shares: divide.` },
        `Divide ${fmt(total)} by ${n}`,
        [`Multiply ${fmt(total)} by ${n}`, `Divide ${n} by ${fmt(total)}`, `Subtract ${n} from ${fmt(total)}`]
      ),
      {
        kind: "number",
        prompt: <>What is the unit price?</>,
        prefix: "$",
        suffix: `per ${it.one}`,
        answer: price,
        hint: `${fmt(total)} ÷ ${n} = ?`,
        explain: `${money(total)} ÷ ${n} = ${money(price)}. Check: ${n} × ${money(price)} = ${money(total)}.`,
      },
      choice(
        { prompt: "Which sentence uses rate language correctly?", hint: `"Per" means "for each one".`, explain: `The unit rate is ${money(price)} for each ${it.one}.` },
        `It costs ${money(price)} per ${it.one}.`,
        [`It costs ${money(n)} per ${it.one}.`, `You get ${fmt(price)} ${it.many} per dollar.`, `It costs ${money(total)} per ${it.one}.`]
      ),
    ],
    wrapUp: (
      <>
        {money(total)} for {n} {it.many} is a rate of {money(price)} per {it.one}.
      </>
    ),
  };
};

const mixScenes = [
  { unit: "cup", units: "cups", aThing: "flour", bThing: "sugar", what: "A recipe uses" },
  { unit: "cup", units: "cups", aThing: "juice", bThing: "water", what: "A punch recipe uses" },
  { unit: "can", units: "cans", aThing: "red paint", bThing: "white paint", what: "A paint mix uses" },
];

const fractionRateProblem = (): Problem => {
  const s = pick(mixScenes);
  let a = 1,
    b = 2;
  do {
    b = randInt(2, 8);
    a = randInt(1, b - 1);
  } while (gcd(a, b) !== 1);
  const qty = (n: number, d: number, thing: string) => `${fracText(n, d, true)} ${n / d <= 1 ? s.unit : s.units} of ${thing}`;
  const oneB = `${s.unit} of ${s.bThing}`;
  const oneA = `${s.unit} of ${s.aThing}`;
  return {
    title: "Unit rate that is a fraction",
    story: (
      <>
        {s.what} <QA>{qty(a, 1, s.aThing)}</QA> for every <QB>{qty(b, 1, s.bThing)}</QB>. How much {s.aThing} goes with each {oneB}?
      </>
    ),
    visual: (done) => (
      <>
        <TapeDiagram
          tapes={[
            { label: s.aThing, units: b, color: palette.a, softColor: palette.aSoft, shaded: done >= 2 ? b : 0, values: done >= 3 ? Array(b).fill(fracText(a, b)) : [], total: qty(a, 1, s.aThing) },
            { label: s.bThing, units: b, color: palette.b, values: Array(b).fill("1"), total: qty(b, 1, s.bThing) },
          ]}
          unitWidth={Math.min(60, 440 / b)}
        />
        {done >= 3 && (
          <DoubleNumberLine
            top={{ label: s.aThing, color: palette.a, format: (v) => fracText(Math.round(v * b), b, true) }}
            bottom={{ label: s.bThing, color: palette.b }}
            pairs={[
              { top: 0, bottom: 0 },
              { top: a / b, bottom: 1, highlight: true },
              { top: a, bottom: b },
            ]}
          />
        )}
      </>
    ),
    steps: [
      {
        kind: "ratio",
        prompt: (
          <>
            Write the ratio of <QA>{s.aThing}</QA> to <QB>{s.bThing}</QB>.
          </>
        ),
        answer: [a, b],
        labels: [s.aThing, s.bThing],
        hint: "Use the numbers in the order the story names them.",
        explain: `${a}:${b}`,
      },
      {
        kind: "number",
        prompt: (
          <>
            We share the <QA>{s.aThing}</QA> equally among the <QB>{qty(b, 1, s.bThing)}</QB>. Into how many equal parts do we split it?
          </>
        ),
        answer: b,
        hint: `There are ${b} ${s.units} of ${s.bThing}, and each one gets a share.`,
        explain: `${b} equal parts, one for each ${oneB}.`,
      },
      {
        kind: "number",
        prompt: <>How many {s.units} of {s.aThing} go with 1 {oneB}? (A fraction like 2/3 is fine.)</>,
        answer: a / b,
        suffix: s.units,
        hint: `${a} ÷ ${b}. Division can be written as a fraction.`,
        explain: `${a} ÷ ${b} = ${fracText(a, b)}. The unit rate is ${qty(a, b, s.aThing)} per ${oneB}.`,
      },
      {
        kind: "number",
        prompt: <>Now flip it: how many {s.units} of {s.bThing} go with 1 {oneA}?</>,
        answer: b / a,
        suffix: s.units,
        hint: `Divide the other way: ${b} ÷ ${a}.`,
        explain: `${b} ÷ ${a} = ${fracText(b, a, true)}. Every ratio has two unit rates, and they are flips of each other.`,
      },
    ],
    wrapUp: (
      <>
        A ratio of {a}:{b} means {qty(a, b, s.aThing)} for each {oneB}, or {qty(b, a, s.bThing)} for each {oneA}.
      </>
    ),
  };
};

export const unitRate: Unit = {
  id: "unit-rate",
  title: "Unit rate",
  goal: "Find how much of one amount goes with exactly 1 of the other",
  standard: "6.RP.A.2",
  keyIdea: (
    <>
      <p>
        A <b>unit rate</b> tells you how much for <b>one</b>. If a recipe uses <QA>3 cups of flour</QA> for <QB>4 cups of sugar</QB>, each cup of sugar gets 3 ÷ 4 = <b>3/4 cup of flour</b>.
      </p>
      <p>
        For a ratio a:b, the unit rate is a/b. The word <b>per</b> means “for each one”: $75 for 15 hamburgers is <b>$5 per hamburger</b>.
      </p>
    </>
  ),
  Explore,
  problems: [
    { label: "Unit price", make: priceProblem },
    { label: "Fraction rate", make: fractionRateProblem },
  ],
};
