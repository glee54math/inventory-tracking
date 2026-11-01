import { useEffect, useState } from "react";
import { AngleFigure, PartsPicture, type FigArc, type FigRay, type Tone } from "../diagrams";
import { equationSetup, partSetup, randomBase, threeSetup, wholeSetup } from "../lib/additionSetups";
import { CheckRow, Pick, PickOne } from "./cfuParts";
import { allFilled, answerBorder } from "../../../shared/lib/answerChecks";
import { choice, type Problem } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { angleAdditionTest } from "./AngleAdditionTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * Four fixed questions. Q1 = vocabulary (angles add when they share a vertex
 * and a ray without overlapping; the whole is the SUM). Q2 = the commonly
 * conflated whole vs. part — name which is the whole, pick subtract (not
 * add), then type the part; three boxes. Q3 = generalization trap: two
 * OVERLAPPING 70° angles do NOT make 140° (the overlap gets counted twice —
 * the picture is the counterexample). Q4 = an implied whole: a square corner
 * is 90° even though no number is written on it.
 */
function AngleAdditionCheck({ onComplete }: { onComplete?: () => void }) {
  const [a1, setA1] = useState("");
  const [b1, setB1] = useState("");
  const [c1, setC1] = useState(false);
  const ok1a = a1 === "vertexRay";
  const ok1b = b1 === "sum";
  const done1 = c1 && ok1a && ok1b;

  const [a2, setA2] = useState("");
  const [b2, setB2] = useState("");
  const [n2, setN2] = useState("");
  const [c2, setC2] = useState(false);
  const ok2a = a2 === "whole";
  const ok2b = b2 === "subtract";
  const ok2n = Number(n2) === 70;
  const done2 = c2 && ok2a && ok2b && ok2n;

  const [q3, setQ3] = useState<string | null>(null);
  const done3 = q3 === "false";

  const [a4, setA4] = useState("");
  const [n4, setN4] = useState("");
  const [c4, setC4] = useState(false);
  const ok4a = a4 === "90";
  const ok4n = Number(n4) === 55;
  const done4 = c4 && ok4a && ok4n;

  const allDone = done1 && done2 && done3 && done4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  const digits = (v: string) => v.replace(/[^0-9]/g, "").slice(0, 3);

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure adding angles makes sense before you try practice problems.</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> Two angles can be added together when they share a{" "}
          <Pick label="What the angles share" value={a1} onChange={(v) => { setA1(v); setC1(false); }} ok={ok1a} checked={c1} disabled={done1} options={[{ id: "color", label: "color" }, { id: "vertexRay", label: "vertex and a ray" }, { id: "size", label: "size" }]} />{" "}
          and don't overlap. Then the whole angle's measure is the{" "}
          <Pick label="How the parts make the whole" value={b1} onChange={(v) => { setB1(v); setC1(false); }} ok={ok1b} checked={c1} disabled={done1} options={[{ id: "difference", label: "difference (subtract)" }, { id: "sum", label: "sum (add)" }, { id: "product", label: "product (multiply)" }]} />{" "}
          of the parts.
        </p>
        <CheckRow
          filled={allFilled(a1, b1)}
          checked={c1}
          ok={ok1a && ok1b}
          done={done1}
          onCheck={() => setC1(true)}
          good="Correct — side-by-side angles with the same vertex and a shared ray add up: the whole is the sum of the parts."
          bad="Not quite — check each red box. The parts have to meet at the same vertex and share a ray, and you ADD them to get the whole."
        />
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> A 110° angle is split into two parts. One part is 40°.
        </p>
        <PartsPicture base={10} parts={[40, 70]} partLabels={["40°", "?"]} wholeLabel="110°" width={240} />
        <p>
          The 110° angle is the{" "}
          <Pick label="Is 110 the whole or a part" value={a2} onChange={(v) => { setA2(v); setC2(false); }} ok={ok2a} checked={c2} disabled={done2} options={[{ id: "whole", label: "whole" }, { id: "part", label: "part" }]} />
          . To find the missing part, I{" "}
          <Pick label="Add or subtract" value={b2} onChange={(v) => { setB2(v); setC2(false); }} ok={ok2b} checked={c2} disabled={done2} options={[{ id: "add", label: "add: 110 + 40" }, { id: "subtract", label: "subtract: 110 − 40" }]} />
          . The missing part is{" "}
          <input className="answer" style={{ width: 64, ...answerBorder(ok2n, c2) }} inputMode="numeric" aria-label="Missing part" value={n2} disabled={done2} onChange={(e) => { setN2(digits(e.target.value)); setC2(false); }} />°.
        </p>
        <CheckRow
          filled={allFilled(a2, b2, n2)}
          checked={c2}
          ok={ok2a && ok2b && ok2n}
          done={done2}
          onCheck={() => setC2(true)}
          good="Correct — 110° is the whole, so take away the part you know: 110 − 40 = 70°. Check: 40 + 70 = 110."
          bad="Not quite — the biggest angle (the one around everything) is the whole. A missing PART must be smaller than the whole, so you can't add."
        />
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> The blue angle is 70° and the orange angle is 70°, but they <b>overlap</b>. True or false: the whole angle, from the first ray to the last ray, is
          70° + 70° = 140°.
        </p>
        <AngleFigure
          rays={[{ dir: 10, len: 110 }, { dir: 50, len: 110 }, { dir: 80, len: 110 }, { dir: 120, len: 110 }]}
          arcs={[
            { from: 10, sweep: 70, r: 40, tone: "a", fill: true, label: "70°" },
            { from: 50, sweep: 70, r: 64, tone: "b", fill: true, label: "70°" },
          ]}
          width={230}
          ariaLabel="Two 70 degree angles that overlap"
        />
        <PickOne
          value={q3}
          onPick={setQ3}
          correct="false"
          done={done3}
          options={[
            { id: "true", label: "True" },
            { id: "false", label: "False" },
          ]}
          good="Correct — the middle 40° piece is inside BOTH angles, so 70 + 70 counts it twice. The whole is really 110°. Angles only add like this when they don't overlap."
          bad="Not quite — look at the middle piece where blue and orange overlap. Adding 70 + 70 counts that piece twice."
        />
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>4.</b> This square corner is split into two angles. One of them is 35°.
        </p>
        <PartsPicture base={0} parts={[35, 55]} partLabels={["35°", "?"]} squareWhole width={200} />
        <p>
          A square corner is{" "}
          <Pick label="Size of a square corner" value={a4} onChange={(v) => { setA4(v); setC4(false); }} ok={ok4a} checked={c4} disabled={done4} options={[{ id: "100", label: "100°" }, { id: "90", label: "90°" }, { id: "180", label: "180°" }]} />
          , so the other angle is{" "}
          <input className="answer" style={{ width: 64, ...answerBorder(ok4n, c4) }} inputMode="numeric" aria-label="The other angle" value={n4} disabled={done4} onChange={(e) => { setN4(digits(e.target.value)); setC4(false); }} />°.
        </p>
        <CheckRow
          filled={allFilled(a4, n4)}
          checked={c4}
          ok={ok4a && ok4n}
          done={done4}
          onCheck={() => setC4(true)}
          good="Correct — a square corner (right angle) is 90°, even with no number written on it. 90 − 35 = 55°."
          bad="Not quite — a square corner is a quarter turn. Use that as the whole, then subtract the part you know."
        />
      </div>
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

const TONES: Tone[] = ["a", "b", "c"];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [rays, setRays] = useState<number[]>([0, 45, 110]);
  const [mystery, setMystery] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const parts = rays.slice(1).map((r, i) => r - rays[i]);
  const whole = rays[rays.length - 1];

  const onDrag = (i: number, raw: number) => {
    // Keep the rays in order (no overlapping parts) and on the top half (whole ≤ 180°).
    let d = raw > 180 ? (raw > 270 ? 0 : 180) : raw;
    const lo = rays[i - 1] + 5;
    const hi = i + 1 < rays.length ? rays[i + 1] - 5 : 180;
    d = Math.min(hi, Math.max(lo, d));
    setRays((rs) => rs.map((r, k) => (k === i ? d : r)));
    setRevealed(false);
  };
  const toggleThird = () => {
    setRevealed(false);
    setRays((rs) => {
      if (rs.length === 4) return rs.slice(0, 3);
      const last = rs[2];
      return last <= 160 ? [...rs, Math.min(180, last + 35)] : [0, Math.round(last / 3), Math.round((2 * last) / 3), last];
    });
  };

  const figRays: FigRay[] = rays.map((r, i) => ({ dir: r, len: 125, draggable: i > 0 }));
  const hiddenIdx = mystery ? 1 : -1;
  const arcs: FigArc[] = parts.map((p, i) => ({ from: rays[i], sweep: p, r: 44 + (i % 2) * 14, tone: TONES[i], fill: true, label: i === hiddenIdx && !revealed ? "?" : `${p}°` }));
  arcs.push({ from: 0, sweep: whole, r: 100, tone: "ink", label: `${whole}°` });

  return (
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
      {(introActive || showCheck) && <AngleAdditionCheck onComplete={onIntroDone} />}
      <p>
        When angles sit side by side — same vertex, sharing a ray, no overlap — their measures <b>add up</b> to the whole angle, just like lengths do. Drag the rays
        with dots and watch the equation.
      </p>
      <div className="ap-explore">
        <AngleFigure rays={figRays} arcs={arcs} onDragRay={onDrag} frameRadius={150} width={340} ariaLabel={`An angle of ${whole} degrees split into ${parts.length} parts`} />
        <div className="ap-side">
          <p className="ap-readout">
            {parts.map((p, i) => (
              <span key={i}>
                {i > 0 && " + "}
                <span className={`ap-tone-${TONES[i]}`}>{i === hiddenIdx && !revealed ? "?" : `${p}°`}</span>
              </span>
            ))}{" "}
            = <b>{whole}°</b>
          </p>
          {mystery && !revealed && (
            <p>
              Can you find the missing part? It's {whole}°{parts.filter((_, i) => i !== hiddenIdx).map((p) => ` − ${p}°`).join("")}.{" "}
              <button type="button" className="btn ghost" onClick={() => setRevealed(true)}>
                Reveal
              </button>
            </p>
          )}
        </div>
      </div>
      <div className="control-row">
        <button type="button" className="btn ghost" onClick={toggleThird}>
          {rays.length === 4 ? "Use 2 parts" : "Split into 3 parts"}
        </button>
        <button type="button" className={`btn ghost ${mystery ? "pressed" : ""}`} onClick={() => { setMystery((m) => !m); setRevealed(false); }}>
          {mystery ? "Show every part" : "Hide a part (mystery mode)"}
        </button>
        <button type="button" className="btn ghost" onClick={() => setRays(rays.length === 4 ? [0, 30, 90, 180] : [0, 35, 90])}>
          {rays.length === 4 ? "Fill a straight line" : "Make a square corner"}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE 1 — find the whole
// ============================================================================

function wholeProblem(): Problem {
  const s = wholeSetup();
  const base = randomBase();
  return {
    title: "Find the whole angle",
    bucket: "whole",
    story: "An angle is split into two parts that don't overlap.",
    visual: (done) => <PartsPicture base={base} parts={[s.a, s.b]} partLabels={[`${s.a}°`, `${s.b}°`]} wholeLabel={done >= 2 ? `${s.whole}°` : "?"} />,
    steps: [
      choice(
        { prompt: "Which equation finds the whole angle?", hint: "The whole is made of both parts together.", explain: `Add the parts: ${s.a} + ${s.b} = ?` },
        `${s.a} + ${s.b} = ?`,
        // subtracting the parts (treating one part as the whole); a missing-part equation.
        [`${Math.max(s.a, s.b)} − ${Math.min(s.a, s.b)} = ?`, `${s.a} + ? = ${s.b}`]
      ),
      { kind: "number", prompt: "What is the whole angle?", hint: "Add the two parts.", explain: `${s.a}° + ${s.b}° = ${s.whole}°.`, answer: s.whole, suffix: "°" },
      { kind: "number", prompt: `Now go backward: if you only knew the whole (${s.whole}°) and the blue part (${s.a}°), what would the other part be?`, hint: "Take the blue part away from the whole.", explain: `${s.whole}° − ${s.a}° = ${s.b}° — back to the orange part.`, answer: s.b, suffix: "°" },
    ],
    wrapUp: `${s.a}° + ${s.b}° = ${s.whole}°, and ${s.whole}° − ${s.a}° = ${s.b}°.`,
  };
}

// ============================================================================
// PROBLEM TYPE 2 — find a missing part
// ============================================================================

function partProblem(): Problem {
  const s = partSetup();
  const base = randomBase();
  return {
    title: "Find the missing part",
    bucket: "part",
    story: `The whole angle is ${s.whole}°. One part is ${s.a}°.`,
    visual: (done) => <PartsPicture base={base} parts={[s.a, s.b]} partLabels={[`${s.a}°`, done >= 2 ? `${s.b}°` : "?"]} wholeLabel={`${s.whole}°`} />,
    steps: [
      choice(
        { prompt: "How do you find the missing part?", hint: "The missing part is smaller than the whole.", explain: `Take the part you know away from the whole: ${s.whole} − ${s.a}.` },
        `${s.whole} − ${s.a}`,
        // adding the whole and the part — the classic missing-addend trap.
        [`${s.whole} + ${s.a}`]
      ),
      { kind: "number", prompt: "What is the missing part?", hint: `${s.whole} − ${s.a}`, explain: `${s.whole}° − ${s.a}° = ${s.b}°.`, answer: s.b, suffix: "°" },
      { kind: "number", prompt: `Check it: ${s.a}° + ${s.b}° = ?`, hint: "Add the two parts — you should get the whole back.", explain: `${s.a}° + ${s.b}° = ${s.whole}° ✓`, answer: s.whole, suffix: "°" },
    ],
    wrapUp: `${s.whole}° − ${s.a}° = ${s.b}°, and it checks: ${s.a}° + ${s.b}° = ${s.whole}°.`,
  };
}

// ============================================================================
// PROBLEM TYPE 3 — three parts, one unknown
// ============================================================================

function threePartsProblem(): Problem {
  const s = threeSetup();
  const straight = s.context === "straight";
  const base = straight ? 0 : randomBase();
  const wholeUnknown = s.unknownIdx === 3;
  const known = s.parts.filter((_, i) => i !== s.unknownIdx);
  const knownSum = known.reduce((t, p) => t + p, 0);
  const answer = wholeUnknown ? s.whole : s.parts[s.unknownIdx];
  return {
    title: "Three parts",
    bucket: "threeParts",
    story: straight ? "Three angles fill a straight line." : wholeUnknown ? "An angle is split into three parts." : `An angle of ${s.whole}° is split into three parts.`,
    visual: (done) => (
      <PartsPicture
        base={base}
        parts={s.parts}
        partLabels={s.parts.map((p, i) => (i === s.unknownIdx && done < 2 ? "?" : `${p}°`))}
        wholeLabel={straight ? undefined : wholeUnknown && done < 2 ? "?" : `${s.whole}°`}
      />
    ),
    steps: wholeUnknown
      ? [
          { kind: "number", prompt: `Start with two parts: ${s.parts[0]}° + ${s.parts[1]}° = ?`, hint: "Add the first two parts.", explain: `${s.parts[0]}° + ${s.parts[1]}° = ${s.parts[0] + s.parts[1]}°.`, answer: s.parts[0] + s.parts[1], suffix: "°" },
          { kind: "number", prompt: "Now add the third part. What is the whole angle?", hint: `${s.parts[0] + s.parts[1]} + ${s.parts[2]}`, explain: `${s.parts[0] + s.parts[1]}° + ${s.parts[2]}° = ${s.whole}°.`, answer: s.whole, suffix: "°" },
        ]
      : [
          { kind: "number", prompt: `Add the two parts you know: ${known[0]}° + ${known[1]}° = ?`, hint: "Add them first.", explain: `${known[0]}° + ${known[1]}° = ${knownSum}°.`, answer: knownSum, suffix: "°" },
          {
            kind: "number",
            prompt: straight ? "A straight line is 180°. What is the missing angle?" : "What is the missing part?",
            hint: `Subtract from the whole: ${s.whole} − ${knownSum}.`,
            explain: `${s.whole}° − ${knownSum}° = ${answer}°.`,
            answer,
            suffix: "°",
          },
        ],
    wrapUp: `${s.parts.join("° + ")}° = ${s.whole}°.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — write and solve an equation with a symbol for the unknown
// ============================================================================

function equationProblem(): Problem {
  const e = equationSetup();
  const correct = `${e.a} + x = ${e.whole}`;
  const base = e.context === "shown" ? randomBase() : 0;
  const note = e.context === "right" ? " The whole is a square corner." : e.context === "straight" ? " The parts fill a straight line." : "";
  return {
    title: "Write an equation",
    bucket: "equation",
    story: `x stands for the missing angle.${note}`,
    visual: (done) => (
      <PartsPicture
        base={base}
        parts={e.xFirst ? [e.x, e.a] : [e.a, e.x]}
        partLabels={e.xFirst ? [done >= 2 ? `${e.x}°` : "x", `${e.a}°`] : [`${e.a}°`, done >= 2 ? `${e.x}°` : "x"]}
        wholeLabel={e.context === "shown" ? `${e.whole}°` : undefined}
        squareWhole={e.context === "right"}
      />
    ),
    steps: [
      choice(
        { prompt: "Which equation matches the picture?", hint: e.context === "shown" ? "The two parts add up to the whole." : `The two parts add up to the whole — and the whole is ${e.whole}°.`, explain: `The parts ${e.a}° and x add up to ${e.whole}°: ${correct}.` },
        correct,
        // x = whole + a treats the whole as a part; a + whole = x treats x as the whole.
        [`x = ${e.whole} + ${e.a}`, `${e.a} + ${e.whole} = x`]
      ),
      { kind: "number", prompt: `Solve ${correct}. What is x?`, hint: `What do you add to ${e.a} to make ${e.whole}? Subtract to find it.`, explain: `x = ${e.whole} − ${e.a} = ${e.x}.`, answer: e.x, suffix: "°" },
    ],
    wrapUp: `${e.a} + ${e.x} = ${e.whole}, so x = ${e.x}°.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <PartsPicture base={10} parts={[40, 65]} partLabels={["40°", "65°"]} wholeLabel="105°" width={190} />;
}

export const angleAddition: Unit = {
  id: "angleAddition",
  title: "Angle Addition & Unknown Angles",
  goal: "I can find a missing angle measure when I know the whole angle is made of smaller angle parts, using addition and subtraction.",
  standard: "4.MD.7",
  keyIdea: (
    <>
      <p>When angles share a vertex and a ray and don't overlap, the whole angle is the <b>sum</b> of the parts: 40° + 65° = 105°.</p>
      <p>To find a missing part, subtract the known part from the whole. An equation with a letter for the unknown works too: 40 + x = 105, so x = 65.</p>
      <p>Watch for hidden wholes: a square corner is 90° and a straight line is 180°.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["whole", "part", "threeParts", "equation"],
  problems: [
    { label: "Find the whole", make: wholeProblem, buckets: ["whole"] },
    { label: "Missing part", make: partProblem, buckets: ["part"] },
    { label: "Three parts", make: threePartsProblem, buckets: ["threeParts"] },
    { label: "Equation", make: equationProblem, buckets: ["equation"] },
  ],
  test: angleAdditionTest,
};
