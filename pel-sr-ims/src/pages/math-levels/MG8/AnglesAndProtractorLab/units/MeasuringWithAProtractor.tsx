import { useEffect, useState } from "react";
import { Protractor, ReadPicture, correctScale, measureOnProtractor, protractorReading } from "../diagrams";
import { acuteOrObtuse } from "../lib/angleFacts";
import { acuteBetweenTens, labeledTen, obtuseBetweenTens, randomSide, setupRead, setupUnaligned } from "../lib/readSetups";
import { CheckRow, Pick, PickOne } from "./cfuParts";
import { allFilled } from "../../../shared/lib/answerChecks";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { measuringWithAProtractorTest } from "./MeasuringWithAProtractorTest";

const SCALE_CHOICES = ["the blue inner scale", "the orange outer scale"];

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/**
 * Four fixed questions, following the plan's script: Q1 = vocabulary (center
 * mark on the VERTEX, 0° line along a RAY). Q2 = a 0-90° angle: name the
 * scale, then read it (the other scale's 140 is obviously too big — no trap
 * yet). Q3 = the trap: a 130° angle whose base ray is on the LEFT, so the
 * familiar inner scale says 50 — student must name the scale, judge "bigger
 * than a square corner", and only then pick 130. Q4 = generalization: "always
 * read the inner scale" is false (Q3 is the counterexample).
 */
function ProtractorCheck({ onComplete }: { onComplete?: () => void }) {
  const [a1, setA1] = useState("");
  const [b1, setB1] = useState("");
  const [c1, setC1] = useState(false);
  const ok1a = a1 === "vertex";
  const ok1b = b1 === "ray";
  const done1 = c1 && ok1a && ok1b;

  const [a2, setA2] = useState("");
  const [b2, setB2] = useState("");
  const [c2, setC2] = useState(false);
  const ok2a = a2 === "inner";
  const ok2b = b2 === "40";
  const done2 = c2 && ok2a && ok2b;

  const [a3, setA3] = useState("");
  const [b3, setB3] = useState("");
  const [d3, setD3] = useState("");
  const [c3, setC3] = useState(false);
  const ok3a = a3 === "outer";
  const ok3b = b3 === "bigger";
  const ok3d = d3 === "130";
  const done3 = c3 && ok3a && ok3b && ok3d;

  const [q4, setQ4] = useState<string | null>(null);
  const done4 = q4 === "false";

  const allDone = done1 && done2 && done3 && done4;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  const scales = [
    { id: "inner", label: "blue inner" },
    { id: "outer", label: "orange outer" },
  ];

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Quick check: let's make sure you can read a protractor before you try practice problems.</p>

      <div className="align-stack-wrap">
        <p>
          <b>1.</b> To measure an angle, put the protractor's center mark on the angle's{" "}
          <Pick label="Where the center mark goes" value={a1} onChange={(v) => { setA1(v); setC1(false); }} ok={ok1a} checked={c1} disabled={done1} options={[{ id: "tip", label: "arrow tip" }, { id: "vertex", label: "vertex" }, { id: "middle", label: "middle of the opening" }]} />{" "}
          and line up the 0° line along{" "}
          <Pick label="What the 0 line lines up with" value={b1} onChange={(v) => { setB1(v); setC1(false); }} ok={ok1b} checked={c1} disabled={done1} options={[{ id: "page", label: "the bottom of the page" }, { id: "ray", label: "one of the angle's rays" }, { id: "longest", label: "the longest thing nearby" }]} />
          .
        </p>
        <CheckRow
          filled={allFilled(a1, b1)}
          checked={c1}
          ok={ok1a && ok1b}
          done={done1}
          onCheck={() => setC1(true)}
          good="Correct — center on the vertex, 0° line on one ray. Then read where the other ray crosses."
          bad="Not quite — check each red box. The center mark goes where the two rays meet, and the straight 0° line goes right on top of one ray."
        />
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>2.</b> This angle's black ray is on the right end of the straight edge.
        </p>
        <ReadPicture baseDir={0} rayDir={40} width={340} />
        <p>
          The black ray sits on 0 of the{" "}
          <Pick label="Which scale starts on the black ray" value={a2} onChange={(v) => { setA2(v); setC2(false); }} ok={ok2a} checked={c2} disabled={done2} options={scales} /> scale, so the angle measures{" "}
          <Pick label="The angle's measure" value={b2} onChange={(v) => { setB2(v); setC2(false); }} ok={ok2b} checked={c2} disabled={done2} options={[{ id: "40", label: "40°" }, { id: "140", label: "140°" }]} />
          .
        </p>
        <CheckRow
          filled={allFilled(a2, b2)}
          checked={c2}
          ok={ok2a && ok2b}
          done={done2}
          onCheck={() => setC2(true)}
          good="Correct — the blue inner scale reads 0 on the black ray, and counts up to 40 at the purple ray. 140 would be far too big for this narrow angle."
          bad="Not quite — start at the end of the straight edge where the black ray is. Which color says 0 there? Count up on THAT scale."
        />
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>3.</b> Now the black ray is on the LEFT end.
        </p>
        <ReadPicture baseDir={180} rayDir={50} width={340} />
        <p>
          The black ray sits on 0 of the{" "}
          <Pick label="Which scale starts on the black ray" value={a3} onChange={(v) => { setA3(v); setC3(false); }} ok={ok3a} checked={c3} disabled={done3} options={scales} /> scale. The angle is{" "}
          <Pick label="Compared with a square corner" value={b3} onChange={(v) => { setB3(v); setC3(false); }} ok={ok3b} checked={c3} disabled={done3} options={[{ id: "smaller", label: "smaller" }, { id: "bigger", label: "bigger" }]} /> than a square corner
          (90°), so it measures{" "}
          <Pick label="The angle's measure" value={d3} onChange={(v) => { setD3(v); setC3(false); }} ok={ok3d} checked={c3} disabled={done3} options={[{ id: "50", label: "50°" }, { id: "130", label: "130°" }]} />
          .
        </p>
        <CheckRow
          filled={allFilled(a3, b3, d3)}
          checked={c3}
          ok={ok3a && ok3b && ok3d}
          done={done3}
          onCheck={() => setC3(true)}
          good="Correct — the orange outer scale starts at 0 on the left, the angle is wider than a square corner, so it's 130°. The blue 50 is the trap!"
          bad="Not quite — the scales disagree here (50 and 130). Find the 0 on the black ray's end, and ask: is this angle wider or narrower than a square corner?"
        />
      </div>

      <div className="align-stack-wrap">
        <p>
          <b>4.</b> True or false: you should always read the inner scale of a protractor.
        </p>
        <PickOne
          value={q4}
          onPick={setQ4}
          correct="false"
          done={done4}
          options={[
            { id: "true", label: "True" },
            { id: "false", label: "False" },
          ]}
          good="Correct — it depends on which end your ray is on. In question 3 the inner scale said 50°, but the angle was really 130°."
          bad="Not quite — look back at question 3. The inner scale said 50°, but the angle was 130°. Read the scale that starts at 0 on your ray."
        />
      </div>
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [side, setSide] = useState<"right" | "left">("right");
  const [dir, setDir] = useState(50);
  const [hide, setHide] = useState(false);
  const baseDir = side === "right" ? 0 : 180;
  const reading = measureOnProtractor(0, baseDir, dir)!;
  const { inner, outer } = protractorReading(0, dir);
  const scale = correctScale(0, baseDir);

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
      {(introActive || showCheck) && <ProtractorCheck onComplete={onIntroDone} />}
      <p>
        A protractor has <b>two scales</b>. The <span className="ap-blue">blue inner scale</span> starts at 0 on the right; the{" "}
        <span className="ap-orange">orange outer scale</span> starts at 0 on the left. Drag over the protractor to turn the purple ray.
      </p>
      <div className="control-row">
        <Segmented
          label="Where the black ray is"
          value={side}
          onChange={(v) => setSide(v)}
          options={[
            { id: "right", label: "Black ray on the right" },
            { id: "left", label: "Black ray on the left" },
          ]}
        />
        <button type="button" className="btn ghost" onClick={() => setDir((d) => Math.min(180, d + 1))}>
          ↺ 1°
        </button>
        <button type="button" className="btn ghost" onClick={() => setDir((d) => Math.max(0, d - 1))}>
          ↻ 1°
        </button>
        <button type="button" className={`btn ghost ${hide ? "pressed" : ""}`} onClick={() => setHide((h) => !h)}>
          {hide ? "Show the readout" : "Hide the readout — let me read it"}
        </button>
      </div>
      <div className="ap-explore">
        <Protractor
          rays={[{ dir: baseDir, tone: "ink" }]}
          dragDir={dir}
          onDrag={setDir}
          arc={{ from: Math.min(baseDir, dir), sweep: Math.abs(dir - baseDir) }}
          highlightScale={hide ? null : scale}
          width={420}
          ariaLabel={`Protractor with the purple ray at ${reading} degrees from the black ray`}
        />
        {!hide && (
          <div className="ap-side">
            <p className="ap-readout">
              <b>{reading}°</b> {acuteOrObtuse(reading) !== "straight" && reading > 0 && <span className="muted small">({acuteOrObtuse(reading)})</span>}
            </p>
            <p>
              The purple ray crosses <span className="ap-blue">{inner}</span> on the inner scale and <span className="ap-orange">{outer}</span> on the outer scale.
            </p>
            <p>
              The black ray sits on 0 of the <b>{scale === "inner" ? "blue inner" : "orange outer"}</b> scale, so that's the one to read: <b>{reading}°</b>. The other
              number, {scale === "inner" ? outer : inner}, is 180 minus the answer — the classic wrong-scale mistake.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const readPrompt = "How many degrees is the angle between the black ray and the purple ray?";
const readHint = (scaleName: string, other: number) => `Count up from 0 on the ${scaleName}. (If you got ${other}°, you read the other scale.)`;

// ============================================================================
// PROBLEM TYPES 1-3 — base ray on 0 (labeled ten / acute / obtuse)
// ============================================================================

function readProblem(bucket: "aligned" | "acute" | "obtuse"): Problem {
  const m = bucket === "aligned" ? labeledTen() : bucket === "acute" ? acuteBetweenTens() : obtuseBetweenTens();
  const s = setupRead(randomSide(), m);
  const kind = acuteOrObtuse(s.reading);
  const correctScaleText = s.side === "right" ? SCALE_CHOICES[0] : SCALE_CHOICES[1];
  const third =
    bucket === "aligned"
      ? choice(
          {
            prompt: "Check that your answer makes sense: is this angle acute (less than 90°) or obtuse (more than 90°)?",
            hint: "Compare it with a square corner.",
            explain: `It's ${kind} — and ${s.reading}° is ${kind === "acute" ? "less" : "more"} than 90°, so the reading makes sense.`,
          },
          kind,
          [kind === "acute" ? "obtuse" : "acute"]
        )
      : choice(
          {
            prompt: `Where the purple ray crosses, the other scale shows ${s.other}. Why isn't ${s.other}° the answer?`,
            hint: "Which scale says 0 on the black ray?",
            explain: `The other scale doesn't start at 0 on the black ray — it counts from the far end. Also, this angle is ${kind}, and ${s.other}° isn't.`,
          },
          "That scale doesn't start at 0 on the black ray",
          // "bigger number = right" and "both are right" are the two wrong-scale rationalizations.
          [`Because ${Math.max(s.other, s.reading)} is the bigger number`, `It is — ${s.other}° and ${s.reading}° are both right`]
        );
  return {
    title: bucket === "aligned" ? "Reading a protractor" : `Reading an ${kind} angle`,
    bucket,
    story: "The protractor's center is on the vertex and its straight edge lies on the black ray.",
    visual: () => <ReadPicture baseDir={s.baseDir} rayDir={s.rayDir} />,
    steps: [
      choice(
        {
          prompt: "Which scale has its 0 sitting on the black ray?",
          hint: `The black ray is on the ${s.side} end of the straight edge. Which color says 0 there?`,
          explain: `The ${s.scaleName} reads 0 on the ${s.side} end, right on the black ray.`,
        },
        correctScaleText,
        SCALE_CHOICES.filter((c) => c !== correctScaleText)
      ),
      { kind: "number", prompt: readPrompt, hint: readHint(s.scaleName, s.other), explain: `Counting up on the ${s.scaleName}: ${s.reading}°.`, answer: s.reading, suffix: "°" },
      third,
    ],
    wrapUp: `${s.reading}° — read on the ${s.scaleName}, the one that starts at 0 on the black ray.`,
  };
}

// ============================================================================
// PROBLEM TYPE 4 — neither ray on 0: read both, subtract
// ============================================================================

function unalignedProblem(): Problem {
  const u = setupUnaligned();
  const hi = Math.max(u.read1, u.read2);
  const lo = Math.min(u.read1, u.read2);
  return {
    title: "Neither ray on 0",
    bucket: "unaligned",
    story: `Neither ray lies on the 0 line. Use the ${u.scaleName} for both rays.`,
    visual: () => <ReadPicture baseDir={u.dir1} rayDir={u.dir2} />,
    steps: [
      { kind: "number", prompt: `Where does the black ray cross the ${u.scaleName}?`, hint: "Follow the black ray out to the scale and read the number there.", explain: `The black ray crosses at ${u.read1}.`, answer: u.read1 },
      { kind: "number", prompt: `Where does the purple ray cross the ${u.scaleName}?`, hint: "Same scale — follow the purple ray out.", explain: `The purple ray crosses at ${u.read2}.`, answer: u.read2 },
      {
        kind: "number",
        prompt: "How many degrees is the angle between the two rays?",
        hint: "The angle is the distance between the two readings. Subtract the smaller from the bigger.",
        explain: `${hi} − ${lo} = ${u.measure}°.`,
        answer: u.measure,
        suffix: "°",
      },
    ],
    wrapUp: `${hi} − ${lo} = ${u.measure}°. When neither ray is on 0, subtract the two readings.`,
  };
}

/** Static snapshot for the cover page's preview carousel. */
function Preview() {
  return <ReadPicture baseDir={0} rayDir={65} width={200} />;
}

export const measuringWithAProtractor: Unit = {
  id: "measuringWithAProtractor",
  title: "Measuring with a Protractor",
  goal: "I can use a protractor to measure an angle's size in whole-number degrees.",
  standard: "4.MD.6",
  keyIdea: (
    <>
      <p>Put the protractor's center mark on the vertex and its 0° line on one ray. Read where the other ray crosses.</p>
      <p>A protractor has two scales running opposite ways. Read the one that starts at <b>0 on your ray</b> — the other gives 180° minus the answer.</p>
      <p>Then check: an acute angle must be less than 90°, an obtuse angle more than 90°.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: ["aligned", "acute", "obtuse", "unaligned"],
  problems: [
    { label: "On a labeled ten", make: () => readProblem("aligned"), buckets: ["aligned"] },
    { label: "Acute", make: () => readProblem("acute"), buckets: ["acute"] },
    { label: "Obtuse", make: () => readProblem("obtuse"), buckets: ["obtuse"] },
    { label: "Neither ray on 0", make: unalignedProblem, buckets: ["unaligned"] },
  ],
  test: measuringWithAProtractorTest,
};
