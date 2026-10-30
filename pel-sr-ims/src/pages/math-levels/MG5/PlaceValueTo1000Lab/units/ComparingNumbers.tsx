import { useEffect, useState, type CSSProperties } from "react";
import { PlaceValueChart } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { compareNumbers, expandedForm, numberWords, valueFromDigits, type Place } from "../logic";
import { choice, type Problem } from "../../../shared/engine/types";
import { Slider } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { comparingNumbersTest } from "./ComparingNumbersTest";

// ============================================================================
// CHECK FOR UNDERSTANDING — mandatory gate before Practice unlocks
// ============================================================================

const fieldStyle = (ok: boolean, checked: boolean): CSSProperties => (checked ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {});

/** Q1 — vocabulary: which symbol means "greater than," since the direction
 *  the symbol points is a frequent reversal error on its own, separate from
 *  knowing WHICH number is bigger. */
function SymbolVocabQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = ">";
  const OPTIONS = [">", "<", "="];
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>1.</b> Which symbol means "is greater than"?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={{ width: 60, ...fieldStyle(ok, checked) }}>
          <option value="" disabled>
            ?
          </option>
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok ? 'Correct — the wide-open end of ">" faces the bigger number: "5 > 3" reads "5 is greater than 3."' : 'Not quite — think of the symbol as a mouth that opens toward the bigger number. ">" means "is greater than."'}
        </p>
      )}
    </div>
  );
}

/** Q2 — the core misconception named in the plan: a bigger-LOOKING digit
 *  somewhere in the number does NOT win — only left-to-right place value
 *  comparison does. */
function LeftToRightQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "512";
  const OPTIONS = ["512", "498", "They are equal"];
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>2.</b> Which number is greater: 512 or 498?
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — 512 has 5 hundreds and 498 has only 4 hundreds, so 512 wins right away. 498's '9' doesn't matter — it's in the TENS place, a smaller place than hundreds."
            : "Not quite — start with the hundreds place, not whichever digit looks biggest. 512 has 5 hundreds; 498 has only 4 hundreds."}
        </p>
      )}
    </div>
  );
}

/** Q3 — generalization/true-false trap: a bigger digit anywhere, or more
 *  nines, doesn't make a number bigger — only the place it's in matters. */
function MoreNinesTrapQuestion({ onComplete }: { onComplete?: () => void }) {
  const CORRECT = "False";
  const [picked, setPicked] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = picked === CORRECT;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);

  return (
    <div className="align-stack-wrap">
      <p>
        <b>3.</b> True or False: Whichever number has more digits that are "9" is always the bigger number.
      </p>
      <div className="control-row" style={{ alignItems: "center" }}>
        <select className="answer" value={picked} onChange={(e) => setPicked(e.target.value)} style={fieldStyle(ok, checked)}>
          <option value="" disabled>
            choose
          </option>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? "Correct — it's False. 912 has only one '9' but beats 299's two '9's, because 912's hundreds digit (9) beats 299's hundreds digit (2)."
            : "Not quite — it's actually False. Compare 912 and 299: 299 has two 9's, but 912 is still bigger, because the HUNDREDS place decides first."}
        </p>
      )}
    </div>
  );
}

/** Q4 — comparing numbers given in different forms, forcing the student to
 *  actually evaluate the form rather than eyeball digits. Two fixed parts,
 *  one shared check, same pattern as CoordinatePlaneUnit's two-part questions. */
function FormCompareQuestion({ onComplete }: { onComplete?: () => void }) {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [checked, setChecked] = useState(false);
  const okFirst = first === ">"; // "three hundred twenty-four" = 324 > 320
  const okSecond = second === "="; // 200 + 60 + 5 = 265 = 265
  const ok = okFirst && okSecond;
  useEffect(() => {
    if (checked && ok) onComplete?.();
  }, [checked, ok, onComplete]);
  const symbolSelect = (value: string, setValue: (v: string) => void, ok2: boolean) => (
    <select className="answer" style={{ width: 60, ...fieldStyle(ok2, checked) }} value={value} onChange={(e) => setValue(e.target.value)}>
      <option value="" disabled>
        ?
      </option>
      {[">", "<", "="].map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );

  return (
    <div className="align-stack-wrap">
      <p>
        <b>4.</b> "three hundred twenty-four" {symbolSelect(first, setFirst, okFirst)} 320
      </p>
      <p>200 + 60 + 5 {symbolSelect(second, setSecond, okSecond)} 265</p>
      <div className="control-row">
        <button className="btn primary" type="button" onClick={() => setChecked(true)}>
          Check Answer
        </button>
      </div>
      {checked && (
        <p className={`feedback ${ok ? "good" : "bad"}`} role="alert">
          {ok
            ? '"Three hundred twenty-four" is 324, which is greater than 320. And 200 + 60 + 5 adds up to 265, which exactly equals 265.'
            : 'Convert each form to a plain numeral FIRST, then compare: "three hundred twenty-four" = 324, and 200 + 60 + 5 = 265.'}
        </p>
      )}
    </div>
  );
}

function ComparingCheck({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState({ symbol: false, leftToRight: false, moreNines: false, formCompare: false });
  const allDone = Object.values(done).every(Boolean);
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);
  const mark = (key: keyof typeof done) => () => setDone((d) => (d[key] ? d : { ...d, [key]: true }));

  return (
    <div className="align-drill">
      <p className="intro-gate-title">Check for understanding: let's make sure comparing numbers makes sense before you try practice problems.</p>
      <SymbolVocabQuestion onComplete={mark("symbol")} />
      <LeftToRightQuestion onComplete={mark("leftToRight")} />
      <MoreNinesTrapQuestion onComplete={mark("moreNines")} />
      <FormCompareQuestion onComplete={mark("formCompare")} />
    </div>
  );
}

// ============================================================================
// EXPLORE
// ============================================================================

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [a, setA] = useState(342);
  const [b, setB] = useState(319);
  const cmp = compareNumbers(a, b);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="control-row" style={{ flexWrap: "wrap" }}>
        <Slider label="Number A" value={a} min={100} max={999} step={1} onChange={setA} />
        <Slider label="Number B" value={b} min={100} max={999} step={1} onChange={setB} />
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
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <PlaceValueChart value={a} tone="a" highlightPlace={cmp.decidingPlace === "equal" ? undefined : cmp.decidingPlace} />
        <span style={{ fontSize: 32, fontWeight: 800 }}>{cmp.symbol}</span>
        <PlaceValueChart value={b} tone="b" highlightPlace={cmp.decidingPlace === "equal" ? undefined : cmp.decidingPlace} />
      </div>
      <p className="muted small">
        {cmp.decidingPlace === "equal"
          ? `${a} and ${b} are exactly equal — every place matches.`
          : `Starting from the hundreds place and moving right, the ${cmp.decidingPlace} place is the first one that's different, so it decides: ${a} ${cmp.symbol} ${b}.`}
      </p>
      {(introActive || showCheck) && <ComparingCheck onComplete={onIntroDone} />}
    </div>
  );
}

// ============================================================================
// PROBLEM TYPE — Comparing Three-Digit Numbers
// ============================================================================

export const COMPARE_BUCKETS = ["diffHundreds", "diffTens", "diffOnes", "equal", "formCompare"] as const;
export type CompareBucket = (typeof COMPARE_BUCKETS)[number];

const PLACE_OPTIONS: Record<Place, string> = {
  hundreds: "hundreds",
  tens: "tens",
  ones: "ones",
  equal: "they're equal — no place decided it",
};

function decidingPlaceStep(cmp: { decidingPlace: Place }) {
  const correctText = PLACE_OPTIONS[cmp.decidingPlace];
  const distractors = (Object.keys(PLACE_OPTIONS) as Place[]).filter((p) => p !== cmp.decidingPlace).map((p) => PLACE_OPTIONS[p]);
  return choice(
    { prompt: "Which place value told you the answer?", hint: "Start from the hundreds place and move right until something differs.", explain: `The ${cmp.decidingPlace === "equal" ? "numbers are exactly equal, so no single place" : cmp.decidingPlace + " place"} decided it.` },
    correctText,
    distractors
  );
}

function symbolStep(a: number, b: number, cmp: { symbol: ">" | "<" | "=" }) {
  const others = ([">", "<", "="] as const).filter((s) => s !== cmp.symbol);
  return choice({ prompt: `Compare: ${a} ___ ${b}`, hint: "Compare hundreds first, then tens, then ones — stop at the first place that differs.", explain: `${a} ${cmp.symbol} ${b}.` }, cmp.symbol, [...others]);
}

export function comparingProblem(targetBucket?: string): Problem {
  const bucket = (targetBucket as CompareBucket) ?? COMPARE_BUCKETS[randInt(0, COMPARE_BUCKETS.length - 1)];

  if (bucket === "formCompare") {
    const useWord = Math.random() < 0.5;
    const a = randInt(100, 999);
    let b = randInt(100, 999);
    while (b === a) b = randInt(100, 999);
    const formText = useWord ? numberWords(a) : expandedForm(a);
    const cmp = compareNumbers(a, b);
    return {
      title: "Comparing Numbers Given in Different Forms",
      bucket,
      story: `Compare ${useWord ? `"${formText}"` : formText} with ${b}.`,
      visual: (done: number) =>
        done >= 1 ? (
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <PlaceValueChart value={a} tone="a" highlightPlace={done >= 2 && cmp.decidingPlace !== "equal" ? cmp.decidingPlace : undefined} />
            <span style={{ fontSize: 28, fontWeight: 800 }}>{done >= 2 ? cmp.symbol : "?"}</span>
            <PlaceValueChart value={b} tone="b" highlightPlace={done >= 2 && cmp.decidingPlace !== "equal" ? cmp.decidingPlace : undefined} />
          </div>
        ) : (
          <p className="muted small">First, turn {useWord ? `"${formText}"` : formText} into a plain numeral.</p>
        ),
      steps: [
        { kind: "number", prompt: `What numeral is ${useWord ? `"${formText}"` : formText}?`, hint: useWord ? "Build the hundreds first, then the rest." : "Add the terms together.", explain: `${useWord ? `"${formText}"` : formText} is the numeral ${a}.`, answer: a },
        symbolStep(a, b, cmp),
        decidingPlaceStep(cmp),
      ],
      wrapUp: `${formText} is ${a}, and ${a} ${cmp.symbol} ${b}.`,
    };
  }

  let a: number, b: number;
  if (bucket === "equal") {
    a = randInt(100, 999);
    b = a;
  } else if (bucket === "diffHundreds") {
    const hA = randInt(1, 9);
    let hB = randInt(1, 9);
    while (hB === hA) hB = randInt(1, 9);
    a = valueFromDigits(hA, randInt(0, 9), randInt(0, 9));
    b = valueFromDigits(hB, randInt(0, 9), randInt(0, 9));
  } else if (bucket === "diffTens") {
    const h = randInt(1, 9);
    const tA = randInt(0, 9);
    let tB = randInt(0, 9);
    while (tB === tA) tB = randInt(0, 9);
    a = valueFromDigits(h, tA, randInt(0, 9));
    b = valueFromDigits(h, tB, randInt(0, 9));
  } else {
    const h = randInt(1, 9);
    const t = randInt(0, 9);
    const oA = randInt(0, 9);
    let oB = randInt(0, 9);
    while (oB === oA) oB = randInt(0, 9);
    a = valueFromDigits(h, t, oA);
    b = valueFromDigits(h, t, oB);
  }
  const cmp = compareNumbers(a, b);

  const thirdStep =
    bucket === "equal"
      ? choice({ prompt: "True or False: these two numbers are exactly equal.", hint: "Check every place.", explain: `${a} and ${b} match in every place.` }, "True", ["False"])
      : ({ kind: "number" as const, prompt: `Which number is smaller, ${a} or ${b}?`, hint: "The one on the losing side of the symbol.", explain: `${Math.min(a, b)} is smaller.`, answer: Math.min(a, b) });

  return {
    title: "Comparing Three-Digit Numbers",
    bucket,
    story: `Compare ${a} and ${b}.`,
    visual: (done: number) => (
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <PlaceValueChart value={a} tone="a" highlightPlace={done >= 1 && cmp.decidingPlace !== "equal" ? cmp.decidingPlace : undefined} />
        <span style={{ fontSize: 28, fontWeight: 800 }}>{done >= 1 ? cmp.symbol : "?"}</span>
        <PlaceValueChart value={b} tone="b" highlightPlace={done >= 1 && cmp.decidingPlace !== "equal" ? cmp.decidingPlace : undefined} />
      </div>
    ),
    steps: [symbolStep(a, b, cmp), decidingPlaceStep(cmp), thirdStep],
    wrapUp: `${a} ${cmp.symbol} ${b}.`,
  };
}

export const comparingNumbers: Unit = {
  id: "comparingNumbers",
  title: "Comparing Three-Digit Numbers",
  goal: "Decide whether one 3-digit number is greater than, less than, or equal to another, by comparing place by place from the left.",
  standard: "2.NBT.4",
  keyIdea: (
    <>
      <p>Compare the hundreds digit first. If they're different, that decides it — the tens and ones don't matter at all.</p>
      <p>Only if the hundreds match do you move on to tens, and only if those match too do you move on to ones.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  problems: [{ label: "Compare Two Numbers", make: comparingProblem, buckets: [...COMPARE_BUCKETS] }],
  requiredBuckets: [...COMPARE_BUCKETS],
  test: comparingNumbersTest,
};
