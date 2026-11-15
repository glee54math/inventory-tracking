import { useState } from "react";
import { choice, pointing, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { MathText } from "../../../shared/components/MathText";
import { pick } from "../../../shared/lib/math";
import { ExprView, SymbolKey, WorkLines } from "../diagrams";
import {
  bin,
  bracketPath,
  collapsed,
  draw,
  evalExpr,
  exprText,
  firstPartText,
  fmtNum,
  isWhole,
  nodeAt,
  groupText,
  threeLayer,
  twoGroups,
  twoLayer,
  workSteps,
  type Expr,
  type Sym,
} from "../lib/expr";
import { outsideMarksStep, valueStep, workText } from "../lib/steps";
import { nestedGroupsTest } from "./NestedGroupsTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 vocabulary: name all three marks (they look alike).
 * Q2 typed: inside out, one layer at a time (parentheses, then brackets, then the rest).
 * Q3 typed + the conflation "outside" vs "first": the braces are outside, the parentheses come first.
 * Q4 typed + true/false: two separate groups; going left to right across groups is named.
 */
function NestedCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  const names = ["parentheses", "brackets", "braces"];
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Name each kind of mark.
          </p>
          <DropdownQuestion
            blanks={[
              { options: names, correct: "parentheses", label: "Name of ( )" },
              { options: names, correct: "brackets", label: "Name of [ ]" },
              { options: names, correct: "braces", label: "Name of { }" },
            ]}
            render={([a, b, c]) => (
              <>
                ( ) are {a}. [ ] are {b}. {"{ }"} are {c}.
              </>
            )}
            good="Yes. Parentheses go inside brackets, and brackets go inside braces."
            bad="Look at the key above the shopping example. Each mark has its own name."
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Find the value of 2 × [(5 + 3) − 2], one step at a time.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "8", label: "Value of the part in parentheses", width: 60 },
              { correct: "6", label: "Value of the part in brackets", width: 60 },
              { correct: "12", label: "Value of the whole expression", width: 60 },
            ]}
            render={([a, b, c]) => (
              <>
                The part in parentheses: 5 + 3 = {a}. The part in brackets equals {b}. The whole expression equals {c}.
              </>
            )}
            good="Right. 2 × [(5 + 3) − 2] = 2 × [8 − 2] = 2 × 6 = 12. Inside first, then out."
            bad={(_oks, vals) =>
              vals[2].trim() === "11"
                ? "11 is what you get going left to right. Work out (5 + 3) first, then the brackets."
                : vals[2].trim() === "14"
                  ? "14 comes from 2 × 8 = 16, then 16 − 2. The brackets say to finish 8 − 2 first. Then multiply by 2."
                  : "Start inside the parentheses. Use that answer inside the brackets. Then multiply by 2."
            }
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Look at {"{3 × [(4 + 2) − 1]} + 5"}.
          </p>
          <DropdownQuestion
            blanks={[
              { options: names, correct: "braces", label: "Marks on the outside" },
              { options: ["(4 + 2)", "3 × 4", "the part in braces"], correct: "(4 + 2)", label: "Part to work out first" },
              { correct: "20", label: "Value of the expression", width: 60 },
            ]}
            render={([a, b, c]) => (
              <>
                The marks on the outside are the {a}. You work out {b} first. The value is {c}.
              </>
            )}
            good="Yes. The braces are on the outside, but the parentheses come first: 4 + 2 = 6, then 6 − 1 = 5, then 3 × 5 = 15, then 15 + 5 = 20."
            bad={(oks) =>
              !oks[0] || !oks[1]
                ? "The outside marks hold all the other groups. The part you work out first is the group inside all the others."
                : "Work from the inside out: the parentheses, then the brackets, then the braces, then the last step."
            }
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> Two groups, side by side: (3 + 2) × (4 − 1).
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "15", label: "Value of (3 + 2) × (4 − 1)", width: 60 },
              { options: ["True", "False"], correct: "False", label: "Always work left to right" },
            ]}
            render={([a, b]) => (
              <>
                (3 + 2) × (4 − 1) = {a}
                <br />
                True or false: you always work from left to right, even when there are groups. {b}
              </>
            )}
            good="Correct. Work out each group first: 3 + 2 = 5 and 4 − 1 = 3. Then 5 × 3 = 15."
            bad={(oks, vals) =>
              !oks[0] && vals[0].trim() === "19"
                ? "19 is what you get going left to right. Work out each group first, then multiply."
                : !oks[0]
                  ? "Work out each group first. Then multiply the two answers."
                  : "Groups come first. Going left to right gives a different number here."
            }
            onDone={mark(3)}
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
  const [shirt, setShirt] = useState(9);
  const [hat, setHat] = useState(5);
  const [coupon, setCoupon] = useState(4);
  const [friends, setFriends] = useState(3);
  const [ship, setShip] = useState(6);
  const [layers, setLayers] = useState<"two" | "three">("three");
  const [step, setStep] = useState(0);
  const cpn = Math.min(coupon, shirt + hat - 1);
  const inner = bin("−", bin("+", shirt, hat, "paren"), cpn, "bracket");
  const expr: Expr = layers === "two" ? bin("×", inner, friends) : bin("+", bin("×", inner, friends, "brace"), ship);
  const lines = workSteps(expr);
  const shown = Math.min(step, lines.length - 1);
  const reset = (f: () => void) => {
    f();
    setStep(0);
  };
  const said = [
    `First the parentheses: one shirt and one hat cost ${shirt} + ${hat} = ${shirt + hat} dollars.`,
    `Next the brackets: subtract the ${cpn}-dollar coupon. One outfit costs ${shirt + hat - cpn} dollars.`,
    layers === "two" ? `Last, ${friends} friends: ${shirt + hat - cpn} × ${friends} = ${evalExpr(expr)} dollars in all.` : `Next the braces: ${friends} outfits cost ${(shirt + hat - cpn) * friends} dollars.`,
    `Last, add ${ship} dollars for shipping: ${evalExpr(expr)} dollars in all.`,
  ];

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          Sometimes a group sits inside another group. Then we use a different mark for each layer, so you can tell them apart.
        </p>
        <SymbolKey />
        <p>Parentheses go inside brackets. Brackets go inside braces. Work from the inside out.</p>

        <h3 className="explore-head">Shopping for friends</h3>
        <p className="says">
          Ana buys a shirt and a hat for each friend. A shirt and a hat together are one <b>outfit</b>. A coupon makes each outfit a few dollars cheaper.
          {layers === "three" ? " Then she pays one shipping cost to mail them." : ""}
        </p>
        <div className="control-row">
          <Stepper label="Shirt ($)" value={shirt} min={5} max={20} onChange={(v) => reset(() => setShirt(v))} tone="a" />
          <Stepper label="Hat ($)" value={hat} min={2} max={10} onChange={(v) => reset(() => setHat(v))} tone="a" />
          <Stepper label="Coupon ($)" value={cpn} min={1} max={shirt + hat - 1} onChange={(v) => reset(() => setCoupon(v))} tone="b" />
          <Stepper label="Friends" value={friends} min={2} max={5} onChange={(v) => reset(() => setFriends(v))} tone="c" />
          {layers === "three" && <Stepper label="Shipping ($)" value={ship} min={1} max={9} onChange={(v) => reset(() => setShip(v))} />}
        </div>
        <Segmented
          label="Layers"
          value={layers}
          onChange={(v) => reset(() => setLayers(v))}
          options={[
            { id: "two", label: "No shipping (2 layers)" },
            { id: "three", label: "With shipping (3 layers)" },
          ]}
        />
        <div className="nested-stage">
          <ExprView expr={lines[shown]} boxes focus={shown < lines.length - 1 ? "next" : null} />
        </div>
        {shown > 0 && <p className="says">{said[shown - 1]}</p>}
        <div className="control-row">
          <button className="btn primary" type="button" disabled={shown >= lines.length - 1} onClick={() => setStep((s) => s + 1)}>
            Work out the green part
          </button>
          <button className="btn ghost" type="button" disabled={shown === 0} onClick={() => setStep(0)}>
            Start over
          </button>
        </div>
        {shown >= lines.length - 1 && <WorkLines expr={expr} />}
        {(introActive || showCheck) && <NestedCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

export const U2_BUCKETS = ["twoLayer", "threeLayer", "outermost", "twoGroups"];

const flatTokens = (e: Expr): string[] => {
  const toks: string[] = [];
  const flat = (n: Expr) => {
    if (n.kind === "num") toks.push(fmtNum(n.v));
    else {
      flat(n.l);
      toks.push(n.op);
      flat(n.r);
    }
  };
  flat(e);
  return toks;
};

/**
 * Practice picture: the plain expression, like the Test shows it. The colored
 * group outlines (and the ring on the next part) come in only as help, after
 * a wrong try or a hint (round 1, C1-10: the Test never outlines groups).
 */
function picture(e: Expr, done: number, finalStep: number, helping: boolean) {
  return done > finalStep ? <WorkLines expr={e} /> : <ExprView expr={e} boxes={helping} focus={helping ? "next" : null} />;
}

function twoLayerProblem(): Problem {
  const e = twoLayer();
  const right = firstPartText(e);
  const bare = right.replace(/[()]/g, "");
  const toks = flatTokens(e);
  // The bracket group written out, so more than one choice carries marks (round 1, C1-11).
  const outer = groupText(e, "bracket") ?? "";
  const wrong = [toks.slice(0, 3).join(" "), outer, toks.slice(-3).join(" ")].filter((d) => d && d !== right && d !== bare).slice(0, 2);
  return {
    title: "Two layers",
    bucket: "twoLayer",
    story: <>Find the value of {exprText(e)}.</>,
    visual: (done, help) => picture(e, done, 1, pointing(help, 0) || pointing(help, 1)),
    steps: [
      choice(
        {
          prompt: "Which part do you work out first?",
          hint: "Find the group that is inside the other group.",
          explain: `${right} is inside the brackets, so it comes first.`,
        },
        right,
        wrong // left to right (the first two numbers), outside first, right side first
      ),
      valueStep(e),
    ],
    wrapUp: <>{workText(e)}. Inside first, then out.</>,
  };
}

function threeLayerProblem(): Problem {
  const e = threeLayer();
  const part = nodeAt(e, bracketPath(e)!);
  return {
    title: "Three layers",
    bucket: "threeLayer",
    story: <>Find the value of {exprText(e)}.</>,
    visual: (done, help) => picture(e, done, 1, pointing(help, 0) || pointing(help, 1)),
    steps: [
      {
        kind: "number",
        prompt: "What does the part in brackets [ ] equal?",
        hint: "Work out the parentheses first. Then finish the brackets.",
        explain: `${workText(part)}.`,
        answer: evalExpr(part),
      },
      valueStep(e, "Now find the value of the whole expression."),
    ],
    wrapUp: <>{workText(e)}. Parentheses, then brackets, then braces, then the last step.</>,
  };
}

/**
 * Two- and three-layer expressions only (round 1, C1-12: with one layer the
 * parentheses were the only marks). Asks either which marks are on the
 * outside or which you work out first (lib/steps.ts outsideMarksStep, the
 * same step as the Test).
 */
function outermostProblem(target: Sym = pick<Sym>(["bracket", "brace"])): Problem {
  const e = target === "bracket" ? twoLayer() : threeLayer();
  const ask = pick<"outside" | "first">(["outside", "first"]);
  return {
    title: "Outside marks",
    bucket: "outermost",
    story: <>Look at the marks in {exprText(e)}.</>,
    visual: (done, help) => picture(e, done, 1, pointing(help, 0) || pointing(help, 1)),
    steps: [outsideMarksStep(e, ask), valueStep(e)],
    wrapUp: <>{workText(e)}. Inside first. The outside marks come after the inner groups.</>,
  };
}

function twoGroupsProblem(): Problem {
  const { e, c } = draw(
    () => {
      const e = twoGroups();
      return { e, c: collapsed(e) };
    },
    ({ e, c }) => !!c && isWhole(c) && evalExpr(c) !== evalExpr(e)
  );
  const merged = c!;
  return {
    title: "Two groups",
    bucket: "twoGroups",
    story: <>A sign joins two groups. Work out each group first.</>,
    visual: (done, help) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {picture(e, done, 0, pointing(help, 0))}
        {done >= 1 && picture(merged, done, 1, pointing(help, 1))}
      </div>
    ),
    steps: [
      valueStep(e),
      {
        ...valueStep(merged, `Same numbers, new groups: ${exprText(merged)}. Find its value.`),
        explain: `${workText(merged)}. The groups changed, so the value changed.`,
      },
    ],
    wrapUp: (
      <>
        {exprText(e)} = {fmtNum(evalExpr(e))}, but {exprText(merged)} = {fmtNum(evalExpr(merged))}. The marks show which numbers go together.
      </>
    ),
  };
}

function Preview() {
  return <ExprView expr={bin("+", bin("×", 3, bin("−", bin("+", 4, 2, "paren"), 1, "bracket"), "brace"), 5)} boxes size="md" />;
}

export const nestedGroups: Unit = {
  id: "nestedGroups",
  title: "Brackets and Braces: Groups Inside Groups",
  goal: "Use parentheses, brackets and braces to show groups inside groups, and work from the inside out.",
  standard: "5.OA.1",
  keyIdea: (
    <>
      <p>Parentheses ( ) go inside brackets [ ], and brackets go inside braces {"{ }"}. Work from the inside out.</p>
      <p>2 × [(5 + 3) − 2] = 2 × [8 − 2] = 2 × 6 = 12.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: U2_BUCKETS,
  problems: [
    { label: "Two layers", make: () => twoLayerProblem(), buckets: ["twoLayer"] },
    { label: "Three layers", make: () => threeLayerProblem(), buckets: ["threeLayer"] },
    { label: "Outside marks", make: () => outermostProblem(), buckets: ["outermost"] },
    { label: "Two groups", make: () => twoGroupsProblem(), buckets: ["twoGroups"] },
  ],
  test: nestedGroupsTest,
};
