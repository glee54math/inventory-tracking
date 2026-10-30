import { useEffect, useState } from "react";
import { UnitRuler, tileLayout, type TileMode } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { measuringWithUnitsTest } from "./MeasuringWithUnitsTest";

const fieldOk = (ok: boolean, checked: boolean) => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

/** Vocabulary: what "no gaps or overlaps" actually means. */
function VocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "touching";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> To measure length with unit tiles, you lay them end to end "with no gaps or overlaps."
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          What does that mean?{" "}
          <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldOk(ok, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="touching">Each tile touches the next one exactly, with no space between and none covering another</option>
            <option value="anywhere">The tiles can be placed anywhere, as long as you count them all</option>
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — each tile's edge must exactly touch the next tile's edge: no empty space between them, and no tile covering part of another."
            : "Not quite — \"no gaps or overlaps\" means each tile's edge exactly touches the next one: no empty space between tiles, and no tile covering part of another."}
        </p>
      )}
    </div>
  );
}

/** The gapped example: fewer tiles than the true length, because the gaps
 *  ate up room real tiles would have filled. */
function GappedExampleQuestion({ onComplete }: { onComplete?: () => void }) {
  const length = 7;
  const { tilesShown } = tileLayout(length, "gapped", 2);
  const [correctPick, setCorrectPick] = useState("");
  const [whyPick, setWhyPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [correctPick, whyPick].every((v) => String(v).trim() !== "");
  const correctOk = correctPick === "wrong";
  const whyOk = whyPick === "gaps";
  const ok = correctOk && whyOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Priya laid tiles on this ribbon and counted {tilesShown} tiles.
      </p>
      <UnitRuler length={length} mode="gapped" miscount={2} tone="b" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Is {tilesShown} the real length of the ribbon?{" "}
          <select className="answer" value={correctPick} onChange={(e) => setCorrectPick(e.target.value)} style={fieldOk(correctOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="right">Yes, that's correct</option>
            <option value="wrong">No, that's wrong</option>
          </select>
        </label>
        <label>
          Why?{" "}
          <select className="answer" value={whyPick} onChange={(e) => setWhyPick(e.target.value)} style={fieldOk(whyOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="gaps">There are gaps between the tiles, so it actually takes {length} tiles laid correctly</option>
            <option value="overlap">The tiles overlap each other</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? `Correct — the gaps between Priya's tiles took up room that real tiles would have filled. Laid correctly with no gaps, it actually takes ${length} tiles.`
            : `Not quite — look at the spaces between Priya's tiles. Those gaps are "wasted" room — laid correctly with no gaps, this ribbon actually takes ${length} tiles, not ${tilesShown}.`}
        </p>
      )}
    </div>
  );
}

/** The overlapping example: more tiles than the true length, because each
 *  overlap wasted some of its own coverage. */
function OverlapExampleQuestion({ onComplete }: { onComplete?: () => void }) {
  const length = 6;
  const { tilesShown } = tileLayout(length, "overlap", 2);
  const [correctPick, setCorrectPick] = useState("");
  const [whyPick, setWhyPick] = useState("");
  const [checked, setChecked] = useState(false);
  const allFilled = [correctPick, whyPick].every((v) => String(v).trim() !== "");
  const correctOk = correctPick === "wrong";
  const whyOk = whyPick === "overlap";
  const ok = correctOk && whyOk;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> Deshawn laid tiles on this ribbon and counted {tilesShown} tiles.
      </p>
      <UnitRuler length={length} mode="overlap" miscount={2} tone="c" />
      <div className="control-row" style={{ alignItems: "center" }}>
        <label>
          Is {tilesShown} the real length of the ribbon?{" "}
          <select className="answer" value={correctPick} onChange={(e) => setCorrectPick(e.target.value)} style={fieldOk(correctOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="right">Yes, that's correct</option>
            <option value="wrong">No, that's wrong</option>
          </select>
        </label>
        <label>
          Why?{" "}
          <select className="answer" value={whyPick} onChange={(e) => setWhyPick(e.target.value)} style={fieldOk(whyOk, checked)}>
            <option value="" disabled>
              choose
            </option>
            <option value="gaps">There are gaps between the tiles</option>
            <option value="overlap">The tiles overlap each other, so it actually takes only {length} tiles laid correctly</option>
          </select>
        </label>
        <button className="btn primary" type="button" disabled={!allFilled} onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && allFilled && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? `Correct — Deshawn's tiles overlap, so some tiles cover ground another tile already covered. Laid correctly with no overlaps, it actually takes ${length} tiles.`
            : `Not quite — look closely: Deshawn's tiles overlap each other, covering some of the same ground twice. Laid correctly, this ribbon actually takes only ${length} tiles, not ${tilesShown}.`}
        </p>
      )}
    </div>
  );
}

/** Generalization / true-false trap. */
function CountTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === "false";
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> True or false: as long as you count every tile you see, that number is always the correct length — even if the tiles have gaps or
        overlap.
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
            ? "Correct — the count only tells you the real length when the tiles are laid with no gaps and no overlaps. Gaps or overlaps always throw the count off."
            : "Not quite — remember Priya's gapped tiles and Deshawn's overlapping tiles. Both counts looked like real numbers, but both were wrong, because of the gaps/overlaps."}
        </p>
      )}
    </div>
  );
}

function MeasuringCheckForUnderstanding({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ vocab: false, gapped: false, overlap: false, trap: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure measuring with unit tiles makes sense before you try practice problems.</p>
      <VocabQuestion onComplete={mark("vocab")} />
      <GappedExampleQuestion onComplete={mark("gapped")} />
      <OverlapExampleQuestion onComplete={mark("overlap")} />
      <CountTrapQuestion onComplete={mark("trap")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [length, setLength] = useState(6);
  const [mode, setMode] = useState<TileMode>("clean");
  const { tilesShown } = tileLayout(length, mode, 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row">
        <Stepper label="Ribbon length (units)" value={length} min={3} max={12} step={1} onChange={setLength} tone="a" />
        <Segmented
          label="How the tiles were laid"
          value={mode}
          onChange={setMode}
          options={[{ id: "clean", label: "No gaps or overlaps" }, { id: "gapped", label: "With gaps" }, { id: "overlap", label: "Overlapping" }]}
        />
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
      {(introActive || showCheck) && <MeasuringCheckForUnderstanding onComplete={onIntroDone} />}

      <UnitRuler length={length} mode={mode} miscount={2} tone="a" />
      <p className="feedback good" style={{ minHeight: 24 }}>
        {mode === "clean"
          ? `Laid correctly, this ribbon is ${length} units long — the tile count matches the real length.`
          : mode === "gapped"
          ? `These gapped tiles only show ${tilesShown} of them, but the ribbon is still really ${length} units long — the gaps used up room real tiles would have filled.`
          : `These overlapping tiles show ${tilesShown} of them, but the ribbon is still really ${length} units long — the overlaps covered the same ground more than once.`}
      </p>
      <p className="muted small">Switch between "No gaps or overlaps," "With gaps," and "Overlapping" to see how the tile count changes even though the ribbon itself never does.</p>
    </div>
  );
}

// ============================================================================
// PROBLEM TYPES
// ============================================================================

type Bucket = "cleanBasic" | "cleanWide" | "gapped" | "overlap";
const BUCKETS: Bucket[] = ["cleanBasic", "cleanWide", "gapped", "overlap"];

function cleanProblem(bucket: "cleanBasic" | "cleanWide"): Problem {
  const length = bucket === "cleanBasic" ? randInt(3, 6) : randInt(7, 12);
  return {
    title: "How many unit tiles long?",
    bucket,
    story: "These unit tiles are laid end to end with no gaps or overlaps.",
    visual: () => <UnitRuler length={length} mode="clean" tone="a" />,
    steps: [
      { kind: "number", prompt: "How many unit tiles long is this ribbon?", hint: "Count each tile exactly once.", explain: `There are ${length} tiles, laid with no gaps or overlaps, so this ribbon is ${length} units long.`, answer: length },
      { kind: "number", prompt: "If one more tile were added to the end, how long would the ribbon be?", hint: "One more than the total.", explain: `One more than ${length} is ${length + 1}.`, answer: length + 1 },
    ],
    wrapUp: `This ribbon is ${length} units long.`,
  };
}

function flawedProblem(mode: "gapped" | "overlap"): Problem {
  const length = randInt(5, 10);
  const miscount = randInt(1, 2);
  const { tilesShown } = tileLayout(length, mode, miscount);
  const mistakeChoices =
    mode === "gapped"
      ? ["There are gaps between the tiles", "The tiles overlap each other", "Nothing's wrong"]
      : ["The tiles overlap each other", "There are gaps between the tiles", "Nothing's wrong"];
  return {
    title: mode === "gapped" ? "Spot the mistake — gaps" : "Spot the mistake — overlap",
    bucket: mode,
    story: `A classmate measured this ribbon with unit tiles and counted ${tilesShown}.`,
    visual: () => <UnitRuler length={length} mode={mode} miscount={miscount} tone={mode === "gapped" ? "b" : "c"} />,
    steps: [
      choice(
        { prompt: "Is that measurement correct?", hint: "Look closely at how the tiles are laid, not just the count.", explain: "No — the tiles aren't laid with no gaps or overlaps, so the count is wrong." },
        "No, that's wrong",
        ["Yes, that's correct"]
      ),
      choice(
        { prompt: "What's the mistake?", hint: "Look at the spaces between tiles, or where tiles cover each other.", explain: mode === "gapped" ? "There are gaps between the tiles." : "The tiles overlap each other." },
        mistakeChoices[0],
        mistakeChoices.slice(1)
      ),
      { kind: "number", prompt: "How many unit tiles would it actually take, laid correctly with no gaps or overlaps?", hint: "The ribbon itself didn't change size — only how it was measured did.", explain: `Laid correctly, this ribbon takes exactly ${length} tiles.`, answer: length },
    ],
    wrapUp: `This ribbon is really ${length} units long, no matter how the tiles were (mis)laid.`,
  };
}

function measuringProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as Bucket | undefined) ?? BUCKETS[randInt(0, BUCKETS.length - 1)];
  if (bucket === "cleanBasic" || bucket === "cleanWide") return cleanProblem(bucket);
  return flawedProblem(bucket);
}

export const measuringWithUnits: Unit = {
  id: "measuringWithUnits",
  title: "Measuring Length with Units",
  goal: "Measure length by laying same-size units end to end with no gaps or overlaps, and count the units to find the length.",
  standard: "1.MD.2",
  keyIdea: (
    <>
      <p>Unit tiles must be laid end to end, with no gaps and no overlaps, to give a correct length — the number of tiles IS the length.</p>
      <p>Gaps waste room real tiles would fill (undercounting); overlaps cover the same ground twice (overcounting). Either one makes the count wrong.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  // Hands-on measurement procedure, re-applied fresh every time — not a
  // memorized fact.
  problems: [{ label: "Measure With Tiles", make: measuringProblem, buckets: BUCKETS }],
  requiredBuckets: BUCKETS,
  test: measuringWithUnitsTest,
};
