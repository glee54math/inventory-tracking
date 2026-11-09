import { useEffect, useState } from "react";
import { AngleFigure, PairPicture, TurnPicture, turnCCW } from "../diagrams";
import { BENCHMARKS, BETWEEN_LABELS, estimateDistractors, quarterOf, randomBetweenTurn, rayLengthPair, type RayLengthKind } from "../lib/angleFacts";
import { CheckRow, Pick, PickOne } from "./cfuParts";
import { allFilled } from "../../../shared/lib/answerChecks";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { whatIsAnAngleTest } from "./WhatIsAnAngleTest";
import { MathText } from "../../../shared/components/MathText";

const LENGTHS = [0, 50, 85, 120];
const randomBase = () => randInt(0, 23) * 15;

/** Words for a turn of m degrees, anchored to the benchmark fractions. */
function describeTurn(m: number): string {
  if (m === 0) return "No turn at all — the two rays sit on top of each other.";
  const b = BENCHMARKS.find((x) => x.deg === m);
  if (b) return `That's exactly ${b.name} — ${b.frac} of a full circle.`;
  const text = BETWEEN_LABELS[quarterOf(m)];
  return `That's ${text}.`;
}

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * Four fixed questions. Q1 = vocabulary (ray, vertex). Q2 = the documented
 * misconception: Angle A has LONGER rays whose tips are farther apart, but
 * Angle B has more turn — both "longer rays" and "bigger angle" live in the
 * same question, so neither can be answered by pattern-matching the other.
 * Q3 = the circle-fraction anchor (360° full turn → 90° quarter turn), with
 * the "degrees are like percents" (100/25) and straight-line (180/45) traps.
 * Q4 = generalization: a quarter turn is 90° whichever way it faces.
 */
function WhatIsAnAngleCheck({ onComplete }: { onComplete?: () => void }) {
  const [v1a, setV1a] = useState("");
  const [v1b, setV1b] = useState("");
  const [c1, setC1] = useState(false);
  const ok1a = v1a === "rays";
  const ok1b = v1b === "vertex";
  const done1 = c1 && ok1a && ok1b;

  const [v2a, setV2a] = useState("");
  const [v2b, setV2b] = useState("");
  const [c2, setC2] = useState(false);
  const ok2a = v2a === "A";
  const ok2b = v2b === "B";
  const done2 = c2 && ok2a && ok2b;

  const [v3a, setV3a] = useState("");
  const [v3b, setV3b] = useState("");
  const [c3, setC3] = useState(false);
  const ok3a = v3a === "360";
  const ok3b = v3b === "90";
  const done3 = c3 && ok3a && ok3b;

  const [q4, setQ4] = useState<string | null>(null);
  const done4 = q4 === "true";

  const allDone = done1 && done2 && done3 && done4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  const letters = [
    { id: "A", label: "A" },
    { id: "B", label: "B" },
  ];

  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Quick check: let's make sure "angle" makes sense before you try practice problems.</p>

        <div className="align-stack-wrap">
          <p>
            <b>1.</b> An angle is made of two{" "}
            <Pick
              label="What an angle is made of"
              value={v1a}
              onChange={(v) => { setV1a(v); setC1(false); }}
              ok={ok1a}
              checked={c1}
              disabled={done1}
              options={[
                { id: "segments", label: "lines that must be the same length" },
                { id: "rays", label: "rays" },
                { id: "circles", label: "circles" },
              ]}
            />{" "}
            that share an endpoint called the{" "}
            <Pick
              label="Name of the shared endpoint"
              value={v1b}
              onChange={(v) => { setV1b(v); setC1(false); }}
              ok={ok1b}
              checked={c1}
              disabled={done1}
              options={[
                { id: "degree", label: "degree" },
                { id: "vertex", label: "vertex" },
                { id: "arc", label: "arc" },
              ]}
            />
            .
          </p>
          <CheckRow
            filled={allFilled(v1a, v1b)}
            checked={c1}
            ok={ok1a && ok1b}
            done={done1}
            onCheck={() => setC1(true)}
            good="Correct — an angle is two rays that start at the same point, the vertex. Rays can be drawn any length."
            bad="Not quite — check each red box. The sides of an angle are rays (they can be drawn any length), and the point they share is the vertex."
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Look closely at these two angles.
          </p>
          <PairPicture a={{ base: 10, m: 45, len: 110 }} b={{ base: 10, m: 80, len: 50 }} />
          <p>
            Angle <Pick label="Which angle has longer rays" value={v2a} onChange={(v) => { setV2a(v); setC2(false); }} ok={ok2a} checked={c2} disabled={done2} options={letters} /> has longer rays. Angle{" "}
            <Pick label="Which angle has more turn" value={v2b} onChange={(v) => { setV2b(v); setC2(false); }} ok={ok2b} checked={c2} disabled={done2} options={letters} /> has more turn between its rays, so it is the bigger angle.
          </p>
          <CheckRow
            filled={allFilled(v2a, v2b)}
            checked={c2}
            ok={ok2a && ok2b}
            done={done2}
            onCheck={() => setC2(true)}
            good="Correct — Angle A's rays are longer and their tips are farther apart, but Angle B is turned open wider (80° vs 45°). Only the turn counts."
            bad="Not quite — long rays and a big angle are two different things. Look at how far apart the rays are turned right at the vertex, not how far apart their tips are."
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>3.</b> A full turn (all the way around a circle) is{" "}
            <Pick
              label="Degrees in a full turn"
              value={v3a}
              onChange={(v) => { setV3a(v); setC3(false); }}
              ok={ok3a}
              checked={c3}
              disabled={done3}
              options={[
                { id: "100", label: "100°" },
                { id: "180", label: "180°" },
                { id: "360", label: "360°" },
              ]}
            />
            , so a quarter turn is{" "}
            <Pick
              label="Degrees in a quarter turn"
              value={v3b}
              onChange={(v) => { setV3b(v); setC3(false); }}
              ok={ok3b}
              checked={c3}
              disabled={done3}
              options={[
                { id: "25", label: "25°" },
                { id: "45", label: "45°" },
                { id: "90", label: "90°" },
              ]}
            />
            .
          </p>
          <CheckRow
            filled={allFilled(v3a, v3b)}
            checked={c3}
            ok={ok3a && ok3b}
            done={done3}
            onCheck={() => setC3(true)}
            good="Correct — a full turn is 360 one-degree turns, and a quarter of 360° is 90°."
            bad="Not quite — degrees are not percents. A full circle is 360°, and a quarter turn is 1/4 of that."
          />
        </div>

        <div className="align-stack-wrap">
          <p>
            <b>4.</b> True or false: a quarter turn is always 90°, no matter which way the angle faces on the page.
          </p>
          <div className="ap-figs">
            <TurnPicture base={0} m={90} width={150} />
            <TurnPicture base={135} m={90} width={150} />
          </div>
          <PickOne
            value={q4}
            onPick={setQ4}
            correct="true"
            done={done4}
            options={[
              { id: "true", label: "True" },
              { id: "false", label: "False" },
            ]}
            good="Correct — both pictures turn exactly one quarter of the circle. Facing a different way doesn't change the turn."
            bad="Not quite — the second picture faces a different way, but it still turns one quarter of the circle. The direction on the page doesn't change the measure."
          />
        </div>
      </div>
    </MathText>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [base, setBase] = useState(0);
  const [m, setM] = useState(60);
  const [len1, setLen1] = useState(2);
  const [len2, setLen2] = useState(2);

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && (
          <button
            type="button"
            className="btn ghost"
            style={{ width: "fit-content", ...(showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined) }}
            onClick={() => setShowCheck((v) => !v)}
          >
            Check for Understanding
          </button>
        )}
        <p>
          An angle is two rays that share a starting point (the <b>vertex</b>). Its size is <b>how far one ray is turned from the other</b>. Drag the
          blue ray's dot to turn it.
        </p>
        <div className="ap-explore">
          <AngleFigure
            rays={[
              { dir: base, len: LENGTHS[len1] },
              { dir: base + m, len: LENGTHS[len2], tone: "a", draggable: true },
            ]}
            arcs={[{ from: base, sweep: m, r: 30, tone: "c", fill: true, label: `${m}°` }]}
            onDragRay={(_, dir) => setM(turnCCW(base, dir))}
            showCircle
            frameRadius={150}
            width={320}
            ariaLabel={`An angle turning ${m} degrees`}
          />
          <div className="ap-side">
            <p className="ap-readout">
              <b>{m}°</b>
            </p>
            <p>
              {m} one-degree turns — that's {m}/360 of a full circle.
            </p>
            <p>{describeTurn(m)}</p>
          </div>
        </div>
        <div className="control-row">
          <button type="button" className="btn ghost" onClick={() => setM(90)}>
            Quarter turn
          </button>
          <button type="button" className="btn ghost" onClick={() => setM(180)}>
            Half turn
          </button>
          <button type="button" className="btn ghost" onClick={() => setM(270)}>
            Three-quarter turn
          </button>
        </div>
        <div className="control-row">
          <Stepper label="Black ray length" value={len1} min={1} max={3} onChange={setLen1} />
          <Stepper label="Blue ray length" value={len2} min={1} max={3} onChange={setLen2} tone="a" />
          <Stepper label="Turn the whole picture" value={base} min={0} max={345} step={15} onChange={setBase} />
        </div>
        <p className="says">
          Does a longer ray make a bigger angle? Let's check: stretch or shrink either ray — the angle stays <b>{m}°</b>. Turn the whole picture — still{" "}
          <b>{m}°</b>. Only turning one ray <i>away from the other</i> changes the angle.
        </p>
        <p className="muted small">
          Angle words you'll use: an angle smaller than a quarter turn (less than 90°) is <b>acute</b>; exactly a quarter turn (90°, a square corner) is a{" "}
          <b>right angle</b>; between 90° and 180° is <b>obtuse</b>; a half turn (180°) makes a <b>straight angle</b>.
        </p>
        {/* Below the picture, so students explore first, then check. */}
        {(introActive || showCheck) && <WhatIsAnAngleCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — benchmark turns as fractions of a circle
// ============================================================================

function benchmarkProblem(): Problem {
  const b = pick(BENCHMARKS);
  const base = randomBase();
  return {
    title: "Turns as part of a circle",
    bucket: "benchmark",
    story: "The shaded part shows how far the blue ray turned from the black ray. The dashed circle has a mark at every quarter turn.",
    visual: (done) => <TurnPicture base={base} m={b.deg} label={done >= 2 ? `${b.deg}°` : undefined} width={250} />,
    steps: [
      choice(
        {
          prompt: "What fraction of a full turn is shaded?",
          hint: "Count how many quarter marks the shading covers, out of 4.",
          explain: `${b.deg / 90} quarter${b.deg === 90 ? "" : "s"} out of 4 — ${b.frac} of a full turn.`,
        },
        b.frac,
        [...BENCHMARKS.filter((x) => x.deg !== b.deg).map((x) => x.frac), "1/3"]
      ),
      {
        kind: "number",
        prompt: `A full turn is 360°. How many degrees is ${b.frac} of a turn?`,
        hint: "One quarter of 360° is 90°. How many quarters is this?",
        explain: `${b.deg / 90} × 90° = ${b.deg}°.`,
        answer: b.deg,
        suffix: "°",
      },
      {
        kind: "number",
        prompt: "How many more degrees would the blue ray need to turn to finish a full circle?",
        hint: "A full circle is 360°. Subtract what's already turned.",
        explain: `360° − ${b.deg}° = ${360 - b.deg}°.`,
        answer: 360 - b.deg,
        suffix: "°",
      },
    ],
    wrapUp: `${b.name[0].toUpperCase()}${b.name.slice(1)} is ${b.frac} of a circle: ${b.deg}°.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — non-benchmark turns "between" two benchmarks
// ============================================================================

function betweenProblem(): Problem {
  const m = randomBetweenTurn(randInt(0, 3));
  const q = quarterOf(m);
  const base = randomBase();
  return {
    title: "Between two benchmarks",
    bucket: "between",
    story: "This turn isn't exactly a quarter, half, or three-quarter turn. Use those benchmarks to figure out about how big it is.",
    visual: (done) => <TurnPicture base={base} m={m} label={done >= 2 ? `${m}°` : undefined} width={250} />,
    steps: [
      choice(
        {
          prompt: "Which is true about this turn?",
          hint: "Count the quarter marks the shading passes, then check whether it reaches the next one.",
          explain: `It is ${BETWEEN_LABELS[q]}.`,
        },
        BETWEEN_LABELS[q],
        BETWEEN_LABELS.filter((_, i) => i !== q)
      ),
      choice(
        {
          prompt: "Which is the best estimate for the turn?",
          hint: `The turn is ${BETWEEN_LABELS[q]}. Which choice fits in that range?`,
          explain: `${m}° is the only choice in that range. (${360 - m}° would be the OUTSIDE of the turn — the unshaded part.)`,
        },
        `${m}°`,
        estimateDistractors(m)
      ),
      {
        kind: "number",
        prompt: "Each one-degree angle turns 1/360 of a circle. How many one-degree angles fit into this turn?",
        hint: "An angle that measures some number of degrees is made of that many one-degree angles.",
        explain: `${m}° is ${m} one-degree angles — ${m}/360 of a full circle.`,
        answer: m,
      },
    ],
    wrapUp: `${m}° = ${m} one-degree turns, ${BETWEEN_LABELS[q]}.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — ray length doesn't change an angle
// ============================================================================

function rayLengthProblem(): Problem {
  const kind: RayLengthKind = pick(["trap", "trap", "same", "control"] as const);
  const pair = rayLengthPair(kind);
  const correct = pair.bigger === "same" ? "They are the same size" : `Angle ${pair.bigger}`;
  const longM = pair[pair.longer].m;
  return {
    title: "Long rays, big angle?",
    bucket: "rayLength",
    story: "One of these angles is drawn with longer rays.",
    visual: (done) => <PairPicture a={{ base: 10, ...pair.A }} b={{ base: 10, ...pair.B }} labels={done >= 1 ? [`${pair.A.m}°`, `${pair.B.m}°`] : undefined} />,
    steps: [
      choice(
        {
          prompt: "Which angle is bigger — which one has more turn between its rays?",
          hint: "Cover up the ends of the rays with your fingers. Which one is opened wider right at the vertex?",
          explain:
            pair.bigger === "same"
              ? `Both turn ${pair.A.m}° — Angle ${pair.longer} is just drawn with longer rays.`
              : `Angle ${pair.bigger} turns ${Math.max(pair.A.m, pair.B.m)}°, the other only ${Math.min(pair.A.m, pair.B.m)}°.`,
        },
        correct,
        ["Angle A", "Angle B", "They are the same size"].filter((c) => c !== correct)
      ),
      choice(
        {
          prompt: "What decides how big an angle is?",
          hint: "Think about what changed in Explore when you stretched a ray.",
          explain: "Only the amount of turn between the two rays. Ray length and how far apart the tips are don't matter.",
        },
        "How far one ray is turned from the other",
        ["How long the rays are", "How far apart the tips of the rays are"]
      ),
      {
        kind: "number",
        prompt: `Angle ${pair.longer} measures ${longM}°. If you erased half of each of its rays to make them shorter, what would it measure?`,
        hint: "Shorter rays, same turn.",
        explain: `Still ${longM}° — the turn between the rays didn't change.`,
        answer: longM,
        suffix: "°",
      },
    ],
    wrapUp: "Ray length never changes an angle — only the turn does.",
  };
}

// ============================================================================
// PROBLEM TYPE 4 — same angle, turned on the page
// ============================================================================

function orientationProblem(): Problem {
  const M = randInt(6, 30) * 5;
  const r = randInt(3, 21) * 15;
  const opts: string[] = [];
  const add = (v: number) => {
    if (v > 0 && v < 360 && v !== M && !opts.includes(`${v}°`)) opts.push(`${v}°`);
  };
  add(M + r < 360 ? M + r : Math.abs(M - r)); // added how far the PICTURE turned
  add(180 - M);
  add(M + 45);
  return {
    title: "Same angle, turned around",
    bucket: "orientation",
    story: `Angle B is a copy of Angle A that was turned to face a different way on the page. Angle A measures ${M}°.`,
    visual: (done) => <PairPicture a={{ base: 0, m: M, len: 100 }} b={{ base: r, m: M, len: 100 }} labels={[`${M}°`, done >= 2 ? `${M}°` : "?"]} />,
    steps: [
      choice(
        {
          prompt: "Compared with Angle A, Angle B is…",
          hint: "Turning a whole picture doesn't open or close the angle.",
          explain: "The same size — it's the same angle, just facing a different way.",
        },
        "the same size",
        ["bigger", "smaller"]
      ),
      choice(
        {
          prompt: "What does Angle B measure?",
          hint: `Angle A measures ${M}°.`,
          explain: `${M}°. Don't add how far the picture was turned — that's not part of the angle.`,
        },
        `${M}°`,
        opts.slice(0, 2)
      ),
      choice(
        {
          prompt: "True or false: turning an angle to face a different way on the page changes its measure.",
          hint: "Did Angle B's measure change?",
          explain: "False — an angle's measure only depends on the turn between its two rays.",
        },
        "False",
        ["True"]
      ),
    ],
    wrapUp: `Facing any direction, this angle is still ${M}°.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <TurnPicture base={20} m={120} label="120°" width={170} />;
}

export const whatIsAnAngle: Unit = {
  id: "whatIsAnAngle",
  title: "What Is an Angle?",
  goal: "I can recognize an angle as the amount of turn between two rays that share a starting point, and understand that a full circle is 360 one-degree turns.",
  standard: "4.MD.5a-b",
  keyIdea: (
    <>
      <p>An angle is two rays that share an endpoint, the <b>vertex</b>. Its measure is how far one ray is turned from the other.</p>
      <p>A full turn is 360°, so a quarter turn is 90°, a half turn is 180°, and a three-quarter turn is 270°. A one-degree angle turns 1/360 of a circle.</p>
      <p>Long or short rays, facing any direction — the angle only depends on the turn.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["benchmark", "between", "rayLength", "orientation"],
  problems: [
    { label: "Benchmark turns", make: benchmarkProblem, buckets: ["benchmark"] },
    { label: "In between", make: betweenProblem, buckets: ["between"] },
    { label: "Ray length", make: rayLengthProblem, buckets: ["rayLength"] },
    { label: "Turned around", make: orientationProblem, buckets: ["orientation"] },
  ],
  test: whatIsAnAngleTest,
};
