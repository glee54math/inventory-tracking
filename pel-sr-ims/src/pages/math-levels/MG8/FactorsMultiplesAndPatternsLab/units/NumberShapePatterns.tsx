import { useState } from "react";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type Problem, type Step } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { PatternStrip, TileStages } from "../diagrams";
import { patternTerms, ruleShort, ruleText, stageTiles, type PatternRule } from "../lib/numberTheory";
import { CfuToggle, FixedCheck, type CfuQuestion } from "./cfu";
import { numberShapePatternsTest } from "./NumberShapePatternsTest";

const ordinal = (n: number): string => {
  const s = n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th";
  return `${n}${s}`;
};

// ============================================================================
// FEATURES — "true about every term" statements, checked against the actual
// terms (first 30) so a claim shown as correct can never be false.
// ============================================================================

interface Feature {
  id: string;
  text: string;
  holds: (t: number[]) => boolean;
}

const featuresFor = (start: number, k: number): Feature[] => [
  { id: "even", text: "Every term is even", holds: (t) => t.every((x) => x % 2 === 0) },
  { id: "odd", text: "Every term is odd", holds: (t) => t.every((x) => x % 2 !== 0) },
  { id: "alt", text: "The terms go odd, even, odd, even, ...", holds: (t) => t.every((x, i) => i === 0 || x % 2 !== t[i - 1] % 2) },
  { id: "mult", text: `Every term is a multiple of ${k}`, holds: (t) => t.every((x) => x % k === 0) },
  { id: "ones", text: `Every term ends in ${start % 10}`, holds: (t) => t.every((x) => x % 10 === start % 10) },
];

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 is the plan's required pairing: an easy "next term" AND, in the same
 * question, a true/false about a feature the rule never mentions (all even)
 * plus its reason. Q2 is vocabulary (rule vs term — both in one sentence).
 * Q3 cross-checks Unit 2's "multiple" (add-3 terms are multiples of 3, so
 * 40 can't appear). Q4 is the generalization trap: alternating odd/even,
 * then predicting a far term from that feature.
 */
const CHECK: CfuQuestion[] = [
  {
    kind: "blanks",
    prompt: "Rule: start at 4, add 6 each time. 4, 10, 16, 22, ...",
    parts: ["The next term is ", ". “Every term in this pattern is even” is ", ", because even + even is always ", "."],
    blanks: [
      { kind: "number", answer: 28 },
      { kind: "select", choices: ["true", "false"], correct: "true" },
      { kind: "select", choices: ["even", "odd"], correct: "even" },
    ],
    right: "Right — 22 + 6 = 28. And the rule never said “even”, but every term is: you start even and keep adding an even number.",
    wrong: "Not quite — 22 + 6 = ? Then look at 4, 10, 16, 22: any odd ones? What happens when you add two even numbers?",
  },
  {
    kind: "blanks",
    prompt: "5, 8, 11, 14, ...",
    parts: ["In this pattern, “add 3” is the ", ", and 14 is the 4th ", "."],
    blanks: [
      { kind: "select", choices: ["rule", "term", "factor"], correct: "rule" },
      { kind: "select", choices: ["rule", "term", "factor"], correct: "term" },
    ],
    right: "Right — the rule tells you how to get from one term to the next. Each number in the pattern is a term.",
    wrong: "Not quite — the RULE is the instruction (add 3). Each number in the list is a TERM.",
  },
  {
    kind: "blanks",
    prompt: "Rule: start at 3, add 3. 3, 6, 9, 12, ...",
    parts: ["Every term is a ", " of 3. Will 40 ever be in this pattern? ", ""],
    blanks: [
      { kind: "select", choices: ["factor", "multiple"], correct: "multiple" },
      { kind: "select", choices: ["yes", "no"], correct: "no" },
    ],
    right: "Right — the terms are 3, 6, 9, 12 ... multiples of 3. 40 ÷ 3 leaves 1 left over, so 40 never shows up.",
    wrong: "Not quite — you get each term by multiplying 3 UP (3 × 1, 3 × 2, ...). Is 40 one of those? Try 40 ÷ 3.",
  },
  {
    kind: "blanks",
    prompt: "Rule: start at 1, add 5. 1, 6, 11, 16, 21, ...",
    parts: ["“The terms go odd, even, odd, even forever” is ", ". So the 10th term is ", "."],
    blanks: [
      { kind: "select", choices: ["true", "false"], correct: "true" },
      { kind: "select", choices: ["odd", "even"], correct: "even" },
    ],
    right: "Right — adding an odd number flips odd ↔ even every time, so even-numbered terms are even. The 10th term is 46.",
    wrong: "Not quite — look: 1 (odd), 6 (even), 11 (odd), 16 (even) ... Adding 5 flips it each time. Is 10 an odd or even position?",
  },
];

// ============================================================================
// EXPLORE
// ============================================================================

type RuleKind = "add" | "dblMinus" | "dblPlus";

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  const [mode, setMode] = useState<"number" | "shape">("number");
  const [start, setStart] = useState(3);
  const [kind, setKind] = useState<RuleKind>("add");
  const [amt, setAmt] = useState(4);
  const [parity, setParity] = useState(false);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);

  const rule: PatternRule = kind === "add" ? { op1: "+", n1: amt } : { op1: "×", n1: 2, op2: kind === "dblMinus" ? "-" : "+", n2: 1 };
  const count = kind === "add" ? 8 : 6;
  const terms = patternTerms(start, rule, count);
  const long = patternTerms(start, rule, kind === "add" ? 30 : 10);
  const truths = featuresFor(start, amt)
    .filter((f) => kind === "add" || f.id !== "mult")
    .filter((f) => f.holds(long));
  const afterFirstOdd = kind !== "add" && long.slice(1).every((x) => x % 2 !== 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!introActive && <CfuToggle open={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
      {(introActive || showCheck) && <FixedCheck title="Check for Understanding: rules, terms, and hidden features" questions={CHECK} onComplete={onIntroDone} />}

      <Segmented label="Pattern type" value={mode} onChange={setMode} options={[{ id: "number", label: "Number pattern" }, { id: "shape", label: "Shape pattern" }]} />

      {mode === "number" && (
        <>
          <Segmented
            label="Rule"
            value={kind}
            onChange={setKind}
            options={[
              { id: "add", label: "Add" },
              { id: "dblMinus", label: "Double, then − 1" },
              { id: "dblPlus", label: "Double, then + 1" },
            ]}
          />
          <div className="control-row">
            <Stepper label="Start at" value={start} min={0} max={20} onChange={setStart} tone="a" />
            {kind === "add" && <Stepper label="Add" value={amt} min={1} max={10} onChange={setAmt} tone="c" />}
            <button type="button" className={`btn ghost ${parity ? "pressed" : ""}`} onClick={() => setParity((v) => !v)}>
              {parity ? "Hide odd / even" : "Show odd / even"}
            </button>
          </div>
          <p className="muted small">
            Rule: start at {start}, then {ruleText(rule)}.{parity ? " Blue boxes are even, orange boxes are odd." : ""}
          </p>
          <PatternStrip terms={terms} rule={ruleShort(rule)} parity={parity} />
          <div className="says">
            <b>Hidden features</b> — true about the pattern, even though the rule never says so:
            <ul style={{ margin: "6px 0 0" }}>
              {truths.map((f) => (
                <li key={f.id}>{f.text}</li>
              ))}
              {afterFirstOdd && <li>Every term after the first is odd (doubling makes an even number, then ± 1 makes it odd)</li>}
              {truths.length === 0 && !afterFirstOdd && <li>Try turning on odd / even, or change the start — what do you notice?</li>}
            </ul>
          </div>
        </>
      )}

      {mode === "shape" && (
        <>
          <div className="control-row">
            <Stepper label="Stage 1 tiles" value={a} min={1} max={5} onChange={setA} tone="a" />
            <Stepper label="Tiles added each stage" value={b} min={1} max={5} onChange={setB} tone="b" />
          </div>
          <TileStages start={a} add={b} stages={[1, 2, 3, 4]} showCounts />
          <PatternStrip terms={[1, 2, 3, 4].map((s) => stageTiles(a, b, s))} rule={`+${b}`} />
          <p className="says">
            The shape pattern and the number pattern match: start at {a}, add {b}. Stage 10 would have {a} + 9 × {b} = <b>{stageTiles(a, b, 10)}</b> tiles — Stage 1 already has {a}, and only 9 more groups get added.
          </p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PRACTICE — one type, four buckets
// ============================================================================

type PatBucket = "oneStep" | "twoStep" | "shapePattern" | "hiddenFeature";
const BUCKETS: PatBucket[] = ["oneStep", "twoStep", "shapePattern", "hiddenFeature"];

const TWO_STEP: { rule: PatternRule; starts: number[] }[] = [
  { rule: { op1: "×", n1: 2, op2: "-", n2: 1 }, starts: [3, 5, 7] },
  { rule: { op1: "×", n1: 2, op2: "+", n2: 1 }, starts: [1, 3, 5] },
  { rule: { op1: "×", n1: 2, op2: "+", n2: 2 }, starts: [2, 4, 6] },
  { rule: { op1: "×", n1: 2, op2: "-", n2: 2 }, starts: [4, 6, 8] },
];

function oneStepProblem(): Problem {
  const add = Math.random() < 0.6;
  const k = randInt(2, 9);
  // Subtracting: start high enough that all 12 generated terms stay positive.
  const s = add ? randInt(1, 30) : randInt(Math.max(60, 11 * k + 1), 11 * k + 40);
  const rule: PatternRule = { op1: add ? "+" : "-", n1: k };
  const t = patternTerms(s, rule, 12);
  // Is X in the pattern? Half the time a real later term, half a near miss.
  const inIt = Math.random() < 0.5;
  const x = inIt ? t[randInt(7, 11)] : t[randInt(7, 10)] + (add ? 1 : -1) * randInt(1, k - 1);
  return {
    title: "Follow the rule",
    bucket: "oneStep",
    story: (
      <>
        Rule: start at <b>{s}</b>, then <b>{ruleText(rule)}</b> each time.
      </>
    ),
    visual: (done) => <PatternStrip terms={[...t.slice(0, 4), done >= 1 ? t[4] : null, done >= 2 ? t[5] : null]} rule={ruleShort(rule)} />,
    steps: [
      { kind: "number", prompt: "What is the 5th term?", hint: `${t[3]} ${add ? "+" : "−"} ${k} = ?`, explain: `${t[3]} ${add ? "+" : "−"} ${k} = ${t[4]}.`, answer: t[4] },
      { kind: "number", prompt: "What is the 6th term?", hint: `${t[4]} ${add ? "+" : "−"} ${k} = ?`, explain: `${t[4]} ${add ? "+" : "−"} ${k} = ${t[5]}.`, answer: t[5] },
      choice(
        {
          prompt: `If you keep going, will ${x} be one of the terms?`,
          hint: `Every term is ${s} ${add ? "plus" : "minus"} some number of ${k}s. Is the distance from ${s} to ${x} a multiple of ${k}?`,
          explain: inIt ? `Yes — keep ${add ? "adding" : "subtracting"} ${k} and you land on ${x}.` : `No — the distance from ${s} to ${x} is ${Math.abs(x - s)}, which isn't a multiple of ${k}, so you jump right over it.`,
        },
        inIt ? `Yes — you land on ${x} if you keep ${add ? "adding" : "subtracting"} ${k}` : `No — the jumps of ${k} skip right over ${x}`,
        inIt
          ? [`No — ${x} is too far away`]
          : [
              `Yes — the pattern ${add ? "keeps growing" : "keeps shrinking"}, so it reaches every number`, // MISCONCEPTION: growing = hits everything
            ]
      ),
    ],
    wrapUp: `${t.slice(0, 6).join(", ")}, ... — ${ruleText(rule)} each time.`,
  };
}

function twoStepProblem(): Problem {
  const { rule, starts } = pick(TWO_STEP);
  const s = pick(starts);
  const t = patternTerms(s, rule, 4);
  const oddAfter = rule.op2 !== undefined && rule.n2 === 1;
  return {
    title: "A two-step rule",
    bucket: "twoStep",
    story: (
      <>
        Rule: start at <b>{s}</b>. To get each next term, <b>{ruleText(rule)}</b>.
      </>
    ),
    visual: (done) => <PatternStrip terms={[t[0], done >= 1 ? t[1] : null, done >= 2 ? t[2] : null, null]} rule={ruleShort(rule)} />,
    steps: [
      { kind: "number", prompt: "What is the 2nd term?", hint: `Do both parts: ${s} × 2 = ${s * 2}, then ${rule.op2 === "+" ? "add" : "subtract"} ${rule.n2}.`, explain: `${s} × 2 = ${s * 2}, ${rule.op2 === "+" ? "+" : "−"} ${rule.n2} = ${t[1]}.`, answer: t[1] },
      { kind: "number", prompt: "What is the 3rd term?", hint: `Start from ${t[1]}: double it, then the second step.`, explain: `${t[1]} × 2 = ${t[1] * 2}, ${rule.op2 === "+" ? "+" : "−"} ${rule.n2} = ${t[2]}.`, answer: t[2] },
      choice(
        {
          prompt: `Every term after the first is ${oddAfter ? "odd" : "even"}. Why?`,
          hint: "What kind of number do you always get when you double something?",
          explain: oddAfter ? "Doubling always gives an even number; adding or subtracting 1 makes it odd." : "Doubling always gives an even number; adding or subtracting 2 keeps it even.",
        },
        oddAfter ? "Doubling makes an even number, then ± 1 makes it odd" : "Doubling makes an even number, and ± 2 keeps it even",
        [
          "It's just luck — the next term could be anything", // MISCONCEPTION: features are coincidence
          oddAfter ? "Because the start was odd, every term stays odd" : "Because the start was even, every term stays even", // MISCONCEPTION: start decides
        ]
      ),
    ],
    wrapUp: `${t.join(", ")}, ... Doubling then ${rule.op2 === "+" ? "adding" : "subtracting"} ${rule.n2} keeps every later term ${oddAfter ? "odd" : "even"}.`,
  };
}

function shapeProblem(): Problem {
  const a = randInt(1, 4);
  let b = randInt(1, 4);
  while (b === a) b = randInt(1, 4);
  const t = [1, 2, 3, 4, 5].map((s) => stageTiles(a, b, s));
  return {
    title: "A growing shape",
    bucket: "shapePattern",
    story: <>Each stage of this tile pattern grows the same way. The number pattern under it counts the tiles.</>,
    visual: (done) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
        <TileStages start={a} add={b} stages={done >= 2 ? [1, 2, 3, 4] : [1, 2, 3]} />
        <PatternStrip terms={[t[0], t[1], t[2], done >= 2 ? t[3] : null]} rule={done >= 1 ? `+${b}` : "?"} width={420} />
      </div>
    ),
    steps: [
      { kind: "number", prompt: "How many tiles are added at each new stage?", hint: `Stage 1 has ${t[0]}, Stage 2 has ${t[1]}. How many more?`, explain: `${t[1]} − ${t[0]} = ${b}: each stage adds a column of ${b} (orange).`, answer: b },
      { kind: "number", prompt: "How many tiles will Stage 4 have?", hint: `${t[2]} + ${b} = ?`, explain: `${t[2]} + ${b} = ${t[3]}.`, answer: t[3] },
      { kind: "number", prompt: "How many tiles will Stage 10 have?", hint: `Stage 1 has ${a}. Getting to Stage 10 adds ${b} tiles 9 times.`, explain: `${a} + 9 × ${b} = ${stageTiles(a, b, 10)}. (Not 10 × ${b}: Stage 1 starts with ${a}, and only 9 groups get added.)`, answer: stageTiles(a, b, 10) },
    ],
    wrapUp: `Start at ${a}, add ${b}: ${t.join(", ")}, ... Stage 10 has ${stageTiles(a, b, 10)} tiles.`,
  };
}

type FeatureKind = "even" | "alt" | "mult" | "ones";

function featureProblem(): Problem {
  const fk: FeatureKind = pick(["even", "alt", "mult", "ones"] as const);
  let s: number;
  let k: number;
  if (fk === "even") {
    s = 2 * randInt(1, 10);
    k = pick([2, 4, 6, 8]);
  } else if (fk === "alt") {
    s = randInt(1, 20);
    k = pick([3, 5, 7, 9]);
  } else if (fk === "mult") {
    k = randInt(3, 9);
    s = k;
  } else {
    s = randInt(1, 9);
    k = 10;
  }
  const t = patternTerms(s, { op1: "+", n1: k }, 30);
  const feats = featuresFor(s, k);
  const right = feats.find((f) => f.id === fk)!;
  const wrong = feats.filter((f) => !f.holds(t)).map((f) => f.text);

  // Step 3 — use the feature to predict something.
  let predict: Step;
  if (fk === "even") {
    const x = 2 * randInt(20, 49) + 1;
    predict = choice(
      { prompt: `Could ${x} ever be a term?`, hint: "Is it even or odd?", explain: `No — every term is even, and ${x} is odd.` },
      `No — every term is even, and ${x} is odd`,
      [`Yes — the pattern keeps growing, so it reaches every number`] // MISCONCEPTION: growing = hits everything
    );
  } else if (fk === "alt") {
    const n = randInt(9, 16);
    const even = t[n - 1] % 2 === 0;
    predict = choice(
      { prompt: `Is the ${ordinal(n)} term odd or even?`, hint: "The terms alternate. What kind are the 1st, 3rd, 5th terms?", explain: `The ${ordinal(n)} term is ${t[n - 1]}, which is ${even ? "even" : "odd"}.` },
      even ? "Even" : "Odd",
      [even ? "Odd" : "Even", "You can't tell without writing every term"] // MISCONCEPTION: features can't predict
    );
  } else if (fk === "mult") {
    let x = randInt(40, 99);
    while (x % k === 0) x++;
    predict = choice(
      { prompt: `Will ${x} ever be a term?`, hint: `Is ${x} a multiple of ${k}?`, explain: `No — ${x} ÷ ${k} leaves ${x % k} left over, so it isn't a multiple of ${k}.` },
      `No — ${x} isn't a multiple of ${k}`,
      [`Yes — ${x} is between two of the terms`] // MISCONCEPTION: "between" = "in"
    );
  } else {
    const x = randInt(50, 99);
    const inIt = x % 10 === s;
    predict = choice(
      { prompt: `Will ${x} ever be a term?`, hint: "What digit does every term end in?", explain: inIt ? `Yes — it ends in ${s}, and ${x} = ${s} + ${(x - s) / 10} tens.` : `No — every term ends in ${s}, and ${x} ends in ${x % 10}.` },
      inIt ? `Yes — it ends in ${s}, like every term` : `No — every term ends in ${s}`,
      inIt ? [`No — ${x} is too big`] : [`Yes — the pattern keeps growing, so it reaches every number`]
    );
  }

  return {
    title: "Find a hidden feature",
    bucket: "hiddenFeature",
    story: (
      <>
        Rule: start at <b>{s}</b>, add <b>{k}</b>. The rule doesn't say anything else — but the pattern has a secret.
      </>
    ),
    visual: (done) => <PatternStrip terms={[...t.slice(0, 5), done >= 1 ? t[5] : null]} rule={`+${k}`} parity={done >= 2 && (fk === "even" || fk === "alt")} />,
    steps: [
      { kind: "number", prompt: "What is the 6th term?", hint: `${t[4]} + ${k} = ?`, explain: `${t[4]} + ${k} = ${t[5]}.`, answer: t[5] },
      choice({ prompt: "Which of these is true about EVERY term?", hint: "Test each statement on all the terms you can see.", explain: `${right.text}. The rule never said it — you noticed it.` }, right.text, wrong.slice(0, 3)),
      predict,
    ],
    wrapUp: `${right.text} — a feature hiding in “start at ${s}, add ${k}”.`,
  };
}

function patternProblem(target?: string): Problem {
  const bucket: PatBucket = BUCKETS.includes(target as PatBucket) ? (target as PatBucket) : pick(BUCKETS);
  if (bucket === "twoStep") return twoStepProblem();
  if (bucket === "shapePattern") return shapeProblem();
  if (bucket === "hiddenFeature") return featureProblem();
  return oneStepProblem();
}

function Preview() {
  return <TileStages start={2} add={3} stages={[1, 2, 3]} showCounts width={260} />;
}

export const numberShapePatternsUnit: Unit = {
  id: "numberShapePatterns",
  title: "Number and Shape Patterns",
  goal: "Continue a number or shape pattern from its rule, and notice something true about the pattern that the rule doesn't say.",
  standard: "4.OA.5",
  keyIdea: (
    <>
      <p>
        A <b>rule</b> tells you how to get from one <b>term</b> to the next. “Start at 3, add 4” makes 3, 7, 11, 15, ... A shape pattern works the same way: if each stage gains 3 tiles, its tile counts make a number pattern that adds 3.
      </p>
      <p>Patterns often hide features the rule never mentions. In 3, 7, 11, 15, every term is odd — the rule only said “add 4”. Noticing that is different from just finding the next term, and it lets you predict terms far ahead.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  problems: [{ label: "Patterns", make: patternProblem, buckets: [...BUCKETS] }],
  requiredBuckets: [...BUCKETS],
  test: numberShapePatternsTest,
};
