import { useEffect, useState } from "react";
import { PlaceValueBoxes } from "../diagrams";
import { tenHundredShift } from "../logic";
import { randInt } from "../../../shared/lib/math";
import type { Problem } from "../../../shared/engine/types";
import { Stepper, Segmented } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { mentalMathTenHundredTest } from "./MentalMathTenHundredTest";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { StuckBox, useCfuPointers, type ExploreTarget } from "../../../shared/components/CfuPointers";
import { lookHereSpot } from "../../../shared/lib/lookHere";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================
// Fixed, hand-picked questions. Target (per the approved plan): when ±10
// crosses a hundred boundary, a common error is adjusting only the tens
// digit without letting the carry/borrow ripple into the hundreds digit
// (e.g. treating 290 + 10 as "2(10)0" instead of 300).

// Where in Explore each CFU idea is taught (2nd wrong Check → "Look here first").
const LOOK = {
  ripple: { target: "mm-ripple", label: "Explore — when a digit rolls past 9 or 0" },
  which: { target: "mm-which", label: "Explore — which digit moves" },
} satisfies Record<string, ExploreTarget>;

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

function RippleQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "300";
  const ptr = useCfuPointers([{ key: "q", to: LOOK.ripple }], { done: checked && ok, rightNow: () => checked && ok });
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>1.</b> What is 290 + 10?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="300">300</option>
          <option value="2100">"2, 10, 0" — just bump the tens digit up by one ten, without carrying</option>
          <option value="200">200</option>
        </select>
        <button className="btn primary" type="button" onClick={() => { ptr.record(() => ok, picked); setChecked(true); }}>
          Check Answer
        </button>
      </div>
      {checked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 9 tens plus 1 more ten makes 10 tens, which is a whole new hundred. The tens digit rolls back to 0 AND the hundreds digit goes up by 1: 290 + 10 = 300."
            : "Not quite. A digit can only be 0 to 9. What happens when 9 tens get 1 more ten?"}
        </ReadAloud>
      )}
      <StuckBox {...ptr} />
    </ReadAloud>
  );
}

function TenVsHundredQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "tens";
  const ptr = useCfuPointers([{ key: "q", to: LOOK.which }], { done: checked && ok, rightNow: () => checked && ok });
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>2.</b> Adding 10 to a number directly changes which digit (before any rippling)? Adding 100 directly changes which digit?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="tens">+10 changes the tens digit directly; +100 changes the hundreds digit directly</option>
          <option value="hundreds">+10 changes the hundreds digit directly; +100 changes the tens digit directly</option>
        </select>
        <button className="btn primary" type="button" onClick={() => { ptr.record(() => ok, picked); setChecked(true); }}>
          Check Answer
        </button>
      </div>
      {checked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — +10 directly affects the tens place, +100 directly affects the hundreds place. Either one can still RIPPLE further if that place rolls past 9." : "Not quite. 10 is 1 ten. 100 is 1 hundred. Which place does each one add to?"}
        </ReadAloud>
      )}
      <StuckBox {...ptr} />
    </ReadAloud>
  );
}

function AlwaysJustTensTrueFalseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  const ptr = useCfuPointers([{ key: "q", to: LOOK.ripple }], { done: checked && ok, rightNow: () => checked && ok });
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>3.</b> True or false: subtracting 10 from a number always just lowers the tens digit by 1, and nothing else ever changes.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => { ptr.record(() => ok, picked); setChecked(true); }}>
          Check Answer
        </button>
      </div>
      {checked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — false. 300 − 10 = 290: the tens digit can't go below 0, so it borrows from the hundreds place, which drops from 3 to 2." : "Not quite. Try 300 − 10. Can the tens digit 0 go down by 1 all by itself?"}
        </ReadAloud>
      )}
      <StuckBox {...ptr} />
    </ReadAloud>
  );
}

function EdgeCaseQuestion({ onComplete }: { onComplete?: () => void }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = answer === "1000";
  const ptr = useCfuPointers([{ key: "q", to: LOOK.ripple }], { done: checked && ok, rightNow: () => checked && ok });
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  return (
    <ReadAloud className="align-stack-wrap">
      <p>
        <b>4.</b> What is 900 + 100?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <input className="answer" inputMode="numeric" value={answer} onChange={(e) => setAnswer(e.target.value.replace(/[^0-9]/g, ""))} style={fieldOk(ok, checked)} />
        <button className="btn primary" type="button" onClick={() => { ptr.record(() => ok, answer); setChecked(true); }}>
          Check Answer
        </button>
      </div>
      {checked && (
        <ReadAloud as="p" className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? "Correct — 9 hundreds plus 1 more hundred makes 10 hundreds, which is a whole new thousand: 1000." : "Not quite. 9 hundreds and 1 more hundred make how many hundreds? What is that many hundreds?"}
        </ReadAloud>
      )}
      <StuckBox {...ptr} />
    </ReadAloud>
  );
}

function MentalMathCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ ripple: false, tenVsHundred: false, trueFalse: false, edge: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));
  return (
    <div className="align-drill">
      <ReadAloud as="p" className="intro-gate-title">Check for understanding: let's make sure these ideas are clear before you try practice problems.</ReadAloud>
      <RippleQuestion onComplete={mark("ripple")} />
      <TenVsHundredQuestion onComplete={mark("tenVsHundred")} />
      <AlwaysJustTensTrueFalseQuestion onComplete={mark("trueFalse")} />
      <EdgeCaseQuestion onComplete={mark("edge")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  // Default differs from the CFU numbers (290, 300, 900).
  const [n, setN] = useState(590);
  const [delta, setDelta] = useState<10 | -10 | 100 | -100>(10);
  const shift = tenHundredShift(n, delta);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" data-readaloud-part>
        <Stepper label="Number" value={n} min={0} max={900} step={10} onChange={setN} tone="a" />
        <Segmented
          label="Move"
          value={String(delta)}
          onChange={(v) => setDelta(Number(v) as 10 | -10 | 100 | -100)}
          options={[{ id: "10", label: "+10" }, { id: "-10", label: "−10" }, { id: "100", label: "+100" }, { id: "-100", label: "−100" }]}
        />
        {!introActive && (
          <button type="button" className="btn ghost" style={showCheck ? { background: "var(--good-soft)", borderColor: "var(--good)" } : undefined} onClick={() => setShowCheck((v) => !v)}>
            Check for Understanding
          </button>
        )}
      </div>

      <PlaceValueBoxes shift={shift} showAfter />
      <ReadAloud as="p" {...lookHereSpot("mm-which")}>
        <span data-look-here-key>+10 or −10 changes the tens digit. +100 or −100 changes the hundreds digit.</span>
      </ReadAloud>
      <ReadAloud as="p" {...lookHereSpot("mm-ripple")}>
        <span data-look-here-key>A digit can only be 0 to 9. If it goes past 9, it rolls to 0 and the next digit goes up 1. If it goes below 0, it rolls to 9 and the next digit goes down 1.</span>
      </ReadAloud>
      <ReadAloud as="p" className="muted small">
        {n} {delta > 0 ? "+" : "−"} {Math.abs(delta)} = {shift.result}.{" "}
        {shift.rippled ? "Notice this rippled into another digit, not just the one you'd expect." : "Only the one digit you'd expect changed here."}
      </ReadAloud>
      {/* Below the picture, so students explore first, then check. */}
      {(introActive || showCheck) && <MentalMathCheckForUnderstanding onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

type Bucket = "plus10SameHundred" | "plus10CrossHundred" | "minus10SameHundred" | "minus10CrossHundred" | "plusMinus100NoBoundary" | "plusMinus100AtEdge";
const BUCKETS: Bucket[] = ["plus10SameHundred", "plus10CrossHundred", "minus10SameHundred", "minus10CrossHundred", "plusMinus100NoBoundary", "plusMinus100AtEdge"];

function shiftProblem(n: number, delta: 10 | -10 | 100 | -100, bucket: Bucket): Problem {
  const shift = tenHundredShift(n, delta);
  const op = delta > 0 ? "+" : "−";
  return {
    title: "Mental math: ±10 or ±100",
    bucket,
    story: `What is ${n} ${op} ${Math.abs(delta)}?`,
    visual: (done) => <PlaceValueBoxes shift={shift} showAfter={done > 0} />,
    steps: [{ kind: "number", prompt: `${n} ${op} ${Math.abs(delta)} = ?`, hint: Math.abs(delta) === 10 ? "Watch the tens digit — does it roll past 0 or 9?" : "Watch the hundreds digit — does it roll past 0 or 9?", explain: `${n} ${op} ${Math.abs(delta)} = ${shift.result}.`, answer: shift.result }],
    wrapUp: `${n} ${op} ${Math.abs(delta)} = ${shift.result}.`,
  };
}

function plus10SameHundredProblem(): Problem {
  const base = randInt(1, 9) * 100;
  const n = base + randInt(0, 88);
  return shiftProblem(n, 10, "plus10SameHundred");
}

function plus10CrossHundredProblem(): Problem {
  const base = randInt(1, 8) * 100;
  const n = base + randInt(91, 99);
  return shiftProblem(n, 10, "plus10CrossHundred");
}

function minus10SameHundredProblem(): Problem {
  const base = randInt(1, 9) * 100;
  const n = base + randInt(10, 99);
  return shiftProblem(n, -10, "minus10SameHundred");
}

function minus10CrossHundredProblem(): Problem {
  const base = randInt(1, 9) * 100;
  const n = base + randInt(0, 9);
  return shiftProblem(n, -10, "minus10CrossHundred");
}

function plusMinus100NoBoundaryProblem(): Problem {
  const isAdd = Math.random() < 0.5;
  if (isAdd) {
    // Hundreds digit 1-8: +100 lands on 2-9, never rolling into a new thousand.
    const n = randInt(1, 8) * 100 + randInt(0, 99);
    return shiftProblem(n, 100, "plusMinus100NoBoundary");
  }
  // Hundreds digit 2-9: -100 lands on 1-8, staying a positive 3-digit number.
  const n = randInt(2, 9) * 100 + randInt(0, 99);
  return shiftProblem(n, -100, "plusMinus100NoBoundary");
}

function plusMinus100AtEdgeProblem(): Problem {
  const isAdd = Math.random() < 0.5;
  if (isAdd) return shiftProblem(900, 100, "plusMinus100AtEdge");
  return shiftProblem(100, -100, "plusMinus100AtEdge");
}

function mentalMathProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "plus10SameHundred") return plus10SameHundredProblem();
  if (bucket === "plus10CrossHundred") return plus10CrossHundredProblem();
  if (bucket === "minus10SameHundred") return minus10SameHundredProblem();
  if (bucket === "minus10CrossHundred") return minus10CrossHundredProblem();
  if (bucket === "plusMinus100NoBoundary") return plusMinus100NoBoundaryProblem();
  return plusMinus100AtEdgeProblem();
}

export const mentalMathTenHundred: Unit = {
  id: "mentalMathTenHundred",
  title: "Mental Math — Add or Subtract 10 or 100",
  goal: "Figure out a number that's 10 or 100 more or less than a given number, in your head, using what you know about place value.",
  standard: "2.NBT.8",
  keyIdea: (
    <>
      <p>Adding or subtracting 10 moves the tens digit; adding or subtracting 100 moves the hundreds digit. But when that digit rolls past 0 or 9, the change ripples into the NEXT digit too.</p>
      <p>290 + 10 isn't "2, 10, 0" — ten tens make a new hundred, so it's 300.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "±10 / ±100", make: mentalMathProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: mentalMathTenHundredTest,
};
