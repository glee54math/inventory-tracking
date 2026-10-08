import React, { useEffect, useRef, useState } from "react";
import { ConversionChain, DoubleNumberLine, TapeDiagram } from "../diagrams";
import { palette } from "../../shared/lib/palette";
import { fmt, fracText, gcd, money, pick, randInt } from "../../shared/lib/math";
import { choice, type Problem } from "../../shared/engine/types";
import { QA, QB, Says, Slider } from "../../shared/engine/controls";
import type { Unit } from "../../shared/units/types";
import { rateProblemsTest } from "./RateProblemsTest";

function Explore() {
  const [speed, setSpeed] = useState(40);
  const [hours, setHours] = useState(3);
  const [t, setT] = useState(hours);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => setT(hours), [hours]);
  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    const dur = 900 * hours;
    const tick = (now: number) => {
      const f = Math.min(1, (now - start) / dur);
      setT(f * hours);
      if (f < 1) raf.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
  }, [playing, hours]);

  const dist = speed * t;
  const trackW = 520;
  const maxMiles = 70 * 6;

  return (
    <div className="explore">
      <div className="controls">
        <div className="control-row">
          <Slider label="Speed:" value={speed} min={10} max={70} step={5} onChange={setSpeed} display={`${speed} miles per hour`} />
          <Slider label="Trip length:" value={hours} min={1} max={6} onChange={setHours} display={`${hours} hours`} />
          <button
            className="btn primary"
            onClick={() => {
              setT(0);
              setPlaying(true);
            }}
            disabled={playing}
          >
            {playing ? "Driving…" : "Drive"}
          </button>
        </div>
      </div>
      <div className="stage">
        <svg viewBox={`0 0 ${trackW + 40} 70`} width="100%" style={{ maxWidth: trackW + 40, display: "block", margin: "0 auto" }} role="img" aria-label={`Car has gone ${fmt(dist)} miles`}>
          <rect x={20} y={38} width={trackW} height={10} rx={5} style={{ fill: palette.grid }} />
          <rect x={20} y={38} width={(dist / maxMiles) * trackW} height={10} rx={5} style={{ fill: palette.a }} />
          {Array.from({ length: 7 }, (_, i) => (
            <text key={i} x={20 + (i * 60 * trackW) / maxMiles} y={66} textAnchor="middle" style={{ fill: palette.muted, fontSize: 11 }}>
              {i * 60}
            </text>
          ))}
          <g transform={`translate(${20 + (dist / maxMiles) * trackW} 26)`}>
            <rect x={-16} y={-10} width={32} height={16} rx={5} style={{ fill: palette.b }} />
            <rect x={-8} y={-17} width={16} height={9} rx={3} style={{ fill: palette.b }} />
            <circle cx={-9} cy={7} r={4} style={{ fill: palette.ink }} />
            <circle cx={9} cy={7} r={4} style={{ fill: palette.ink }} />
          </g>
        </svg>
        <DoubleNumberLine
          top={{ label: "miles", color: palette.a }}
          bottom={{ label: "hours", color: palette.b }}
          pairs={Array.from({ length: hours + 1 }, (_, h) => ({ top: speed * h, bottom: h, highlight: h === 1 }))}
          marker={t}
          markerTransition={false}
          maxBottom={hours}
        />
        <ConversionChain start={{ value: fmt(t), unit: "hr", color: palette.b }} factors={[{ num: { value: speed, unit: "mi", color: palette.a }, den: { value: 1, unit: "hr", color: palette.b } }]} result={{ value: fmt(dist), unit: "mi" }} />
      </div>
      <div className="sayings">
        <Says>
          At a constant speed, every hour adds the same distance: <QA>{speed} miles</QA> per <QB>hour</QB>. That's the unit rate.
        </Says>
        <Says>
          distance = rate × time. The hours cancel, leaving miles: {speed} × {fmt(t)} = <b>{fmt(dist)} miles</b>.
        </Says>
      </div>
    </div>
  );
}

const lawnProblem = (): Problem => {
  let L = 1,
    h = 1;
  while (L === h || gcd(L, h) !== 1) {
    L = randInt(2, 6);
    h = randInt(3, 9);
  }
  const k = randInt(2, 5);
  const H = h * k;
  return {
    title: "Mowing lawns",
    story: (
      <>
        It took <QB>{h} hours</QB> to mow <QA>{L} lawns</QA>. At that rate, how many lawns could be mowed in <QB>{H} hours</QB>? At what rate were lawns being mowed?
      </>
    ),
    visual: (done) => (
      <DoubleNumberLine
        top={{ label: "lawns", color: palette.a, format: (v) => fracText(Math.round(v * h), h, true) }}
        bottom={{ label: "hours", color: palette.b }}
        pairs={[
          { top: 0, bottom: 0 },
          ...(done >= 3 ? [{ top: L / h, bottom: 1, highlight: true }] : []),
          { top: L, bottom: h },
          ...(done >= 1 ? Array.from({ length: k - 2 }, (_, i) => ({ top: L * (i + 2), bottom: h * (i + 2) })) : []),
          { top: L * k, bottom: H, hideTop: done < 2, highlight: done < 3 },
        ]}
      />
    ),
    steps: [
      {
        kind: "number",
        prompt: (
          <>
            How many times as long is <QB>{H} hours</QB> as <QB>{h} hours</QB>?
          </>
        ),
        answer: k,
        suffix: "times",
        hint: `${h} × ? = ${H}`,
        explain: `${H} ÷ ${h} = ${k}. The time is ${k} times as long.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            So how many <QA>lawns</QA> in {H} hours?
          </>
        ),
        answer: L * k,
        suffix: "lawns",
        hint: `${k} times the time means ${k} times the lawns.`,
        explain: `${L} × ${k} = ${L * k} lawns.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            What is the rate in <QA>lawns</QA> per <QB>hour</QB>? (Fractions are fine.)
          </>
        ),
        answer: L / h,
        suffix: "lawns per hour",
        hint: `Lawns ÷ hours = ${L} ÷ ${h}.`,
        explain: `${L} ÷ ${h} = ${fracText(L, h, true)} lawn${L / h > 1 ? "s" : ""} per hour.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            And how many <QB>hours</QB> per <QA>lawn</QA>?
          </>
        ),
        answer: h / L,
        suffix: "hours per lawn",
        hint: `Hours ÷ lawns = ${h} ÷ ${L}.`,
        explain: `${h} ÷ ${L} = ${fracText(h, L, true)} hours for each lawn.`,
      },
    ],
    wrapUp: (
      <>
        In {H} hours, {L * k} lawns. The rate is {fracText(L, h, true)} lawns per hour, or {fracText(h, L, true)} hours per lawn.
      </>
    ),
  };
};

const travelers = [
  { who: "A train", verb: "travels" },
  { who: "A family car", verb: "drives" },
  { who: "A cyclist", verb: "rides" },
];

const speedProblem = (): Problem => {
  const tr = pick(travelers);
  const r = tr.who === "A cyclist" ? pick([8, 10, 12, 14, 15]) : pick([30, 35, 40, 45, 50, 55, 60, 65]);
  const t = randInt(2, 5);
  const d = r * t;
  let T = randInt(2, 8);
  while (T === t) T = randInt(2, 8);
  let T2 = randInt(2, 9);
  while (T2 === t || T2 === T) T2 = randInt(2, 9);
  const D2 = r * T2;
  return {
    title: "Constant speed",
    story: (
      <>
        {tr.who} {tr.verb} <QA>{d} miles</QA> in <QB>{t} hours</QB> at a constant speed.
      </>
    ),
    visual: (done) => (
      <DoubleNumberLine
        top={{ label: "miles", color: palette.a }}
        bottom={{ label: "hours", color: palette.b }}
        pairs={[
          { top: 0, bottom: 0 },
          { top: r, bottom: 1, hideTop: done < 1, highlight: done === 0 },
          { top: d, bottom: t },
          ...(done >= 1 ? [{ top: r * T, bottom: T, hideTop: done < 2, highlight: done === 1 }] : []),
          ...(done >= 2 ? [{ top: D2, bottom: T2, hideBottom: done < 3, highlight: done === 2 }] : []),
        ]}
      />
    ),
    steps: [
      {
        kind: "number",
        prompt: (
          <>
            What is the speed in <QA>miles</QA> per <QB>hour</QB>?
          </>
        ),
        answer: r,
        suffix: "miles per hour",
        hint: `Miles ÷ hours = ${d} ÷ ${t}.`,
        explain: `${d} ÷ ${t} = ${r} miles per hour.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            At that speed, how far would it travel in <QB>{T} hours</QB>?
          </>
        ),
        answer: r * T,
        suffix: "miles",
        hint: `${r} miles each hour, for ${T} hours.`,
        explain: `${r} × ${T} = ${r * T} miles.`,
      },
      {
        kind: "number",
        prompt: (
          <>
            How long would it take to go <QA>{D2} miles</QA>?
          </>
        ),
        answer: T2,
        suffix: "hours",
        hint: `How many groups of ${r} miles fit in ${D2}?`,
        explain: `${D2} ÷ ${r} = ${T2} hours.`,
      },
    ],
    wrapUp: (
      <>
        Speed is a unit rate: {r} miles per hour. Multiply it by hours to get miles; divide miles by it to get hours.
      </>
    ),
  };
};

const goods = [
  { one: "granola bar", many: "granola bars" },
  { one: "pencil", many: "pencils" },
  { one: "bottle of water", many: "bottles of water" },
  { one: "pack of gum", many: "packs of gum" },
];

const betterBuyProblem = (): Problem => {
  const g = pick(goods);
  const prices = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
  const u1 = pick(prices);
  let u2 = pick(prices);
  while (u1 === u2) u2 = pick(prices);
  const n1 = randInt(3, 8);
  let n2 = randInt(3, 10);
  while (n1 === n2) n2 = randInt(3, 10);
  const p1 = u1 * n1;
  const p2 = u2 * n2;
  const better = u1 < u2 ? "Store A" : "Store B";
  return {
    title: "Better buy",
    story: (
      <>
        Store A sells <QB>{n1} {g.many}</QB> for <QA>{money(p1)}</QA>. Store B sells <QB>{n2} {g.many}</QB> for <QA>{money(p2)}</QA>. Which is the better buy?
      </>
    ),
    visual: (done) => (
      <TapeDiagram
        tapes={[
          { label: "Store A", units: n1, color: palette.a, softColor: palette.aSoft, shaded: done >= 1 ? n1 : 0, values: done >= 1 ? Array(n1).fill(money(u1)) : [], total: money(p1) },
          { label: "Store B", units: n2, color: palette.c, softColor: palette.cSoft, shaded: done >= 2 ? n2 : 0, values: done >= 2 ? Array(n2).fill(money(u2)) : [], total: money(p2) },
        ]}
        unitWidth={44}
      />
    ),
    steps: [
      {
        kind: "number",
        prompt: <>Store A: what is the price for 1 {g.one}? If it's not a whole dollar amount, write it with two decimal places (like 3.50).</>,
        prefix: "$",
        answer: u1,
        money: true,
        hint: `${money(p1)} ÷ ${n1}`,
        explain: `${money(p1)} ÷ ${n1} = ${money(u1)} per ${g.one}.`,
      },
      {
        kind: "number",
        prompt: <>Store B: what is the price for 1 {g.one}? If it's not a whole dollar amount, write it with two decimal places (like 3.50).</>,
        prefix: "$",
        answer: u2,
        money: true,
        hint: `${money(p2)} ÷ ${n2}`,
        explain: `${money(p2)} ÷ ${n2} = ${money(u2)} per ${g.one}.`,
      },
      choice(
        { prompt: "Which store is the better buy?", hint: "Better buy = lower price for one item.", explain: `Unit prices let you compare even when the package sizes are different.` },
        better,
        [better === "Store A" ? "Store B" : "Store A", "The one with more items"]
      ),
    ],
    wrapUp: (
      <>
        {better} is cheaper per {g.one} ({money(Math.min(u1, u2))} vs {money(Math.max(u1, u2))}).
      </>
    ),
  };
};

/** Static snapshot for the cover page's preview carousel — see shared/components/UnitPreviewCarousel.tsx. */
function Preview() {
  return (
    <TapeDiagram
      tapes={[
        { label: "Store A", units: 4, color: palette.a, values: ["$2", "$2", "$2", "$2"], total: "$8 total" },
        { label: "Store B", units: 5, color: palette.b, values: ["$2", "$2", "$2", "$2", "$2"], total: "$10 total" },
      ]}
      unitWidth={32}
    />
  );
}

export const rateProblems: Unit = {
  id: "rate-problems",
  title: "Rate problems",
  goal: "Use unit rates to solve speed, work and pricing problems",
  standard: "6.RP.A.3b",
  keyIdea: (
    <>
      <p>
        Find the unit rate first — the amount for one hour, one lawn, one item. Then scale it up. If <QB>7 hours</QB> mows <QA>4 lawns</QA>, then 35 hours is 5 times as long, so 5 × 4 = 20 lawns.
      </p>
      <p>To compare prices, compare unit prices: the lower price per item is the better buy.</p>
    </>
  ),
  Explore,
  preview: Preview,
  problems: [
    { label: "Mowing lawns", make: lawnProblem },
    { label: "Constant speed", make: speedProblem },
    { label: "Better buy", make: betterBuyProblem },
  ],
  test: rateProblemsTest,
};
