import { useState } from "react";
import { choice, numberBlank, pointing, sentence, type Problem } from "../../../shared/engine/types";
import { Segmented, Stepper } from "../../../shared/engine/controls";
import type { Unit } from "../../../shared/units/types";
import { CfuToggle, DropdownQuestion, useCfuProgress } from "../../../shared/components/CfuQuestion";
import { MathText } from "../../../shared/components/MathText";
import { pick, randInt } from "../../../shared/lib/math";
import { ExprView, GroupsPicture, WorkLines } from "../diagrams";
import { bin, evalExpr, exprText, firstPartText, fmtNum, grouped, isWhole, leftToRight, plusTimes, subDiv, type Expr, type Op } from "../lib/expr";
import { fruitStory, NAMES, type FruitStory } from "../lib/stories";
import { valueStep, workText } from "../lib/steps";
import { whyParenthesesTest } from "./WhyParenthesesTest";

// ============================================================================
// CHECK FOR UNDERSTANDING
// ============================================================================

/**
 * Q1 typed: a story -> the expression (pick) and its value (type).
 * Q2 typed: parentheses NOT first; going left to right is named (the lab's main misconception).
 * Q3 typed: parentheses around a subtraction and a division; moving them changes the value.
 * Q4 true/false generalization: parentheses are not always first, but always worked out first.
 */
function ParenthesesCheck({ onComplete }: { onComplete?: () => void }) {
  const { mark } = useCfuProgress(4, onComplete);
  return (
    <MathText>
      <div className="align-drill">
        <p className="intro-gate-title">Check for understanding: answer all four to unlock practice problems.</p>
        <div className="align-stack-wrap">
          <p>
            <b>1.</b> Each of 4 friends gets 2 apples and 1 orange.
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["(4 × 2) + 1", "(2 + 1) × 4", "2 + (1 × 4)"], correct: "(2 + 1) × 4", label: "Expression for the story" },
              { correct: "12", label: "Pieces of fruit in all", width: 70 },
            ]}
            render={([a, b]) => (
              <>
                The expression is {a}. The friends get {b} pieces of fruit in all.
              </>
            )}
            good="Yes. Each friend gets 2 + 1 = 3 pieces. Then 3 × 4 = 12."
            bad={(oks) => (!oks[0] ? "Does every friend get an orange? Then find what ONE friend gets first." : "Work out the part in parentheses first. Then multiply.")}
            onDone={mark(0)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>2.</b> Find the value of 5 × (2 + 4).
          </p>
          <DropdownQuestion
            blanks={[{ correct: "30", label: "Value of 5 × (2 + 4)", width: 70 }]}
            render={([a]) => <>5 × (2 + 4) = {a}</>}
            good="Right. 2 + 4 = 6 first. Then 5 × 6 = 30."
            bad={(_oks, vals) => (vals[0].trim() === "14" ? "14 is what you get going left to right. Work out (2 + 4) first." : "Work out the part in parentheses first. Then multiply by 5.")}
            onDone={mark(1)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>3.</b> Same numbers, parentheses in a different place. Find each value.
          </p>
          <DropdownQuestion
            blanks={[
              { correct: "4", label: "Value of (12 − 4) ÷ 2", width: 60 },
              { correct: "10", label: "Value of 12 − (4 ÷ 2)", width: 60 },
            ]}
            render={([a, b]) => (
              <>
                (12 − 4) ÷ 2 = {a} and 12 − (4 ÷ 2) = {b}
              </>
            )}
            good="Yes. (12 − 4) ÷ 2 = 8 ÷ 2 = 4. But 12 − (4 ÷ 2) = 12 − 2 = 10. Moving the parentheses changed the value."
            bad="In each one, work out the part in parentheses first. Then do the other step."
            onDone={mark(2)}
          />
        </div>
        <div className="align-stack-wrap">
          <p>
            <b>4.</b> True or false?
          </p>
          <DropdownQuestion
            blanks={[
              { options: ["True", "False"], correct: "False", label: "Parentheses always come at the start" },
              { options: ["True", "False"], correct: "True", label: "Parentheses are worked out first wherever they are" },
            ]}
            render={([a, b]) => (
              <>
                Parentheses always come at the start of an expression. {a}
                <br />
                You work out the part in parentheses first, wherever it is. {b}
              </>
            )}
            good="Correct. In 5 × (2 + 4), the parentheses come last. You still work them out first."
            bad="Look back at question 2. Where are the parentheses? Which part did you work out first?"
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

const OPS: Op[] = ["+", "−", "×", "÷"];

function Explore({ onIntroDone }: { onIntroDone?: () => void }) {
  const introActive = !!onIntroDone;
  const [showCheck, setShowCheck] = useState(false);
  // Part 1: the lunch-bag story.
  const [bags, setBags] = useState(3);
  const [apples, setApples] = useState(2);
  const [oranges, setOranges] = useState(1);
  const [kind, setKind] = useState<"each" | "extra">("each");
  const story: Expr = kind === "each" ? bin("×", bin("+", apples, oranges, "paren"), bags) : bin("+", bin("×", bags, apples, "paren"), oranges);
  // Part 2: move the parentheses.
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [c, setC] = useState(6);
  const [o1, setO1] = useState<Op>("×");
  const [o2, setO2] = useState<Op>("+");
  const left = grouped(a, o1, b, o2, c, "left");
  const right = grouped(a, o1, b, o2, c, "right");
  const okL = isWhole(left);
  const okR = isWhole(right);

  return (
    <MathText>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!introActive && <CfuToggle on={showCheck} onToggle={() => setShowCheck((v) => !v)} />}
        <p>
          Mia packs lunch bags for her friends. The same numbers can tell two different stories. Change the numbers and the story.
        </p>
        <div className="control-row">
          <Stepper label="Bags" value={bags} min={2} max={6} onChange={setBags} />
          <Stepper label="Apples" value={apples} min={1} max={5} onChange={setApples} />
          <Stepper label="Oranges" value={oranges} min={1} max={4} onChange={setOranges} />
        </div>
        <Segmented
          label="Where do the oranges go?"
          value={kind}
          onChange={setKind}
          options={[
            { id: "each", label: "In every bag" },
            { id: "extra", label: "On the table" },
          ]}
        />
        <p className="says">
          {kind === "each"
            ? `Each bag gets ${apples} apple${apples === 1 ? "" : "s"} and ${oranges} orange${oranges === 1 ? "" : "s"}. There are ${bags} bags.`
            : `Each bag gets ${apples} apple${apples === 1 ? "" : "s"}. There are ${bags} bags. ${oranges} orange${oranges === 1 ? " goes" : "s go"} on the table, just once.`}
        </p>
        <GroupsPicture kind={kind} n={bags} a={apples} b={oranges} group="bag" item1="apples" item2="oranges" color1="red" color2="orange" extraLabel="table" />
        <WorkLines expr={story} />
        <p className="muted small">
          {kind === "each"
            ? "First find what is in ONE bag. The parentheses show that this part comes first."
            : "First find the apples in ALL the bags. Then add the oranges on the table."}
        </p>

        <p>
          An <b>expression</b> is a math phrase made of numbers and signs, like (2 + 1) × 3. It has no = sign.
        </p>

        <h3 className="explore-head">Move the parentheses</h3>
        <p>
          <b>Parentheses</b> ( ) group part of an expression. Work out the part inside them first. Then do the rest.
        </p>
        <div className="control-row">
          <Stepper label="1st number" value={a} min={1} max={20} onChange={setA} tone="a" />
          <Stepper label="2nd number" value={b} min={1} max={12} onChange={setB} tone="b" />
          <Stepper label="3rd number" value={c} min={1} max={12} onChange={setC} tone="c" />
        </div>
        <div className="control-row">
          <span className="sign-pick">
            <span className="muted small">1st sign</span>
            <Segmented label="1st sign" value={o1} onChange={setO1} options={OPS.map((o) => ({ id: o, label: o }))} />
          </span>
          <span className="sign-pick">
            <span className="muted small">2nd sign</span>
            <Segmented label="2nd sign" value={o2} onChange={setO2} options={OPS.map((o) => ({ id: o, label: o }))} />
          </span>
        </div>
        <div className="two-col compare-cols">
          <div className="compare-col">
            <p className="compare-title">Parentheses on the left</p>
            {okL ? <WorkLines expr={left} /> : <p className="muted small">{exprText(left)} does not come out to a whole number. Try other numbers.</p>}
          </div>
          <div className="compare-col">
            <p className="compare-title">Parentheses on the right</p>
            {okR ? <WorkLines expr={right} /> : <p className="muted small">{exprText(right)} does not come out to a whole number. Try other numbers.</p>}
          </div>
        </div>
        {okL && okR && (
          <p className="says">
            {evalExpr(left) === evalExpr(right)
              ? `Both come out to ${fmtNum(evalExpr(left))} this time. Try other signs.`
              : `Same numbers, same signs, but different values: ${fmtNum(evalExpr(left))} and ${fmtNum(evalExpr(right))}. Where the parentheses go matters.`}
          </p>
        )}
        {(introActive || showCheck) && <ParenthesesCheck onComplete={onIntroDone} />}
      </div>
    </MathText>
  );
}

// ============================================================================
// PRACTICE
// ============================================================================

export const U1_BUCKETS = ["story", "parensFirst", "parensLast", "subDiv"];

function storyProblem(s: FruitStory = fruitStory(pick(["each", "extra"]))): Problem {
  const other = s.wrong[0];
  const friend = pick(NAMES.filter((x) => x.name !== s.who.name));
  // About half the time, step 2 asks the story's question without printing the expression (like Test Q10).
  const plainQuestion = Math.random() < 0.5;
  const picture = (
    <GroupsPicture kind={s.kind} n={s.n} a={s.a} b={s.b} group={s.scene.group} item1={s.scene.item1} item2={s.scene.item2} color1={s.scene.color1} color2={s.scene.color2} extraLabel={s.scene.spotLabel} />
  );
  return {
    title: "Story to expression",
    bucket: "story",
    // The question comes in step 2; step 1 asks for the expression.
    story: <>{s.text}</>,
    // The picture comes in after a wrong pick (or once the expression is chosen):
    // choosing the expression from the words is the skill.
    visual: (done, help) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(done >= 1 || pointing(help, 0)) && picture}
        {done >= 1 && <ExprView expr={s.right} focus={pointing(help, 1) ? "next" : null} />}
        {done >= 2 && <WorkLines expr={other} />}
      </div>
    ),
    steps: [
      choice(
        {
          prompt: "Which expression matches the story?",
          hint: s.kind === "each" ? `Does every ${s.scene.group} get both kinds? Then group what ONE ${s.scene.group} gets.` : `Do the ${s.scene.item2} go ${s.scene.prep} every ${s.scene.group}, or just once?`,
          explain:
            s.kind === "each"
              ? `Each ${s.scene.group} gets ${s.a} + ${s.b}. There are ${s.n} ${s.scene.groups}: ${exprText(s.right)}.`
              : `${s.n} ${s.scene.groups} with ${s.a} each is ${s.n} × ${s.a}. Add the ${s.scene.item2} only once: ${exprText(s.right)}.`,
        },
        exprText(s.right),
        s.wrong.map(exprText)
      ),
      valueStep(s.right, plainQuestion ? s.question : `${s.question} Find the value of ${exprText(s.right)}.`),
      {
        ...valueStep(other, `${friend.name} wrote ${exprText(other)} for this story. Find the value of ${friend.they === "She" ? "her" : "his"} expression.`),
        explain: `${workText(other)}. That is a different story, so it gives a different number.`,
      },
    ],
    wrapUp: (
      <>
        {exprText(s.right)} = {fmtNum(evalExpr(s.right))}. {friend.name}'s {exprText(other)} = {fmtNum(evalExpr(other))} tells a different story. The parentheses decide which part comes first.
      </>
    ),
  };
}

/**
 * "Put parentheses in a o b o c so that its value is V" (round 1, C1-15:
 * students place the parentheses themselves, 5.OA.1 "use parentheses"). New
 * numbers, so the values worked out earlier in the problem don't answer it.
 * About 3 times in 4 the signs are + and × (plusTimes, two different values)
 * and the target comes from either grouping, so neither place is always
 * right. About 1 time in 4 (round 2, C2-06) the signs are + and +, × and ×,
 * or + then −, where both places give V, so "Either place works." is
 * sometimes right. Each choice is a whole claim ("Only ... works."), so only
 * one of them is ever true.
 */
const placeParens = () => {
  if (Math.random() < 0.25) {
    const [o1, o2] = pick<[Op, Op]>([
      ["+", "+"],
      ["×", "×"],
      ["+", "−"],
    ]);
    const a = o1 === "×" ? randInt(2, 5) : randInt(2, 12);
    const c = o2 === "×" ? randInt(2, 4) : randInt(2, 9);
    // + then −: b is larger than c, so b − c is a whole number.
    const b = o2 === "−" ? c + randInt(1, 9) : o1 === "×" ? randInt(2, 5) : randInt(2, 12);
    const want = grouped(a, o1, b, o2, c, "left");
    const other = grouped(a, o1, b, o2, c, "right");
    return { either: true, want, other, v: evalExpr(want), bare: `${a} ${o1} ${b} ${o2} ${c}` };
  }
  const { t, e, moved } = plusTimes(pick<"left" | "right">(["left", "right"]));
  const [want, other] = Math.random() < 0.5 ? [e, moved] : [moved, e];
  return { either: false, want, other, v: evalExpr(want), bare: `${t.a} ${t.o1} ${t.b} ${t.o2} ${t.c}` };
};

/** The inside part of a grouped expression, e.g. 2 + 5 for (2 + 5) × 9. */
const insidePart = (e: Expr): Expr => (e.kind === "op" ? (e.l.kind === "op" ? e.l : e.r.kind === "op" ? e.r : e) : e);

function moveProblem(bucket: "parensFirst" | "subDiv"): Problem {
  const { e, moved } = bucket === "parensFirst" ? plusTimes("left") : subDiv();
  const place = bucket === "parensFirst" ? placeParens() : null;
  const either = "Either place works.";
  const only = (x: Expr) => `Only ${exprText(x)} works.`;
  return {
    title: bucket === "parensFirst" ? "Parentheses first" : "Subtract or divide first",
    bucket,
    story: <>Work out the part in parentheses first. Then do the rest.</>,
    visual: (done, help) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {done >= 1 ? <WorkLines expr={e} /> : <ExprView expr={e} focus={pointing(help, 0) ? "next" : null} />}
        {done >= 1 && (done >= 2 ? <WorkLines expr={moved} /> : <ExprView expr={moved} focus={pointing(help, 1) ? "next" : null} />)}
        {/* Step 4 asks for the "either" pair's inside parts, so that pair stays unworked until it is done. */}
        {place && done >= 3 && (place.either && done < 4 ? <ExprView expr={place.want} focus={pointing(help, 3) ? "next" : null} /> : <WorkLines expr={place.want} />)}
        {place && done >= 3 && (done >= 4 ? <WorkLines expr={place.other} /> : <ExprView expr={place.other} focus={pointing(help, 3) ? "next" : null} />)}
      </div>
    ),
    steps: [
      valueStep(e),
      {
        ...valueStep(moved, `Now the parentheses move: ${exprText(moved)}. Find its value.`),
        explain: `${workText(moved)}. Same numbers, but a different part comes first.`,
      },
      ...(place
        ? [
            choice(
              {
                // Not "so 2 + 5 × 9 = 63": that prints an equation that looks false (round 2, E2-32).
                prompt: `New numbers. Put parentheses in ${place.bare} so that its value is ${fmtNum(place.v)}. Where do they go?`,
                hint: `Find the value with the parentheses in each place. Which ones make ${fmtNum(place.v)}?`,
                explain: place.either
                  ? `Both places give ${fmtNum(place.v)}. Here, moving the parentheses doesn't change the value.`
                  : `${workText(place.want)}.`,
              },
              place.either ? either : only(place.want),
              place.either
                ? [only(place.want), only(place.other)] // thinks only one place can work
                : [
                    only(place.other), // the other grouping
                    either, // thinks the parentheses don't change the value
                  ]
            ),
            place.either
              ? // Both values are V (on screen), so the typed work is each one's first step.
                sentence(
                  {
                    prompt: "Both places work. Find the value of the part in parentheses in each one.",
                    hint: "Work out only the part inside the parentheses.",
                    explain: `${workText(place.want)}, and ${workText(place.other)}. The first steps are different, but both end at ${fmtNum(place.v)}.`,
                  },
                  `In ${exprText(place.want)}, the part in parentheses is `,
                  numberBlank(evalExpr(insidePart(place.want))),
                  `. In ${exprText(place.other)}, it is `,
                  numberBlank(evalExpr(insidePart(place.other))),
                  "."
                )
              : {
                  ...valueStep(place.other, `Now find the value of the other one: ${exprText(place.other)}.`),
                  explain: `${workText(place.other)}. Moving the parentheses changed the value.`,
                },
          ]
        : []),
    ],
    wrapUp: (
      <>
        {exprText(e)} = {fmtNum(evalExpr(e))}, but {exprText(moved)} = {fmtNum(evalExpr(moved))}. Moving the parentheses changed the value.
        {place
          ? place.either
            ? // Says which numbers it means, after "changed the value" above (round 3, E3-33).
              ` With the new numbers, both places give ${fmtNum(place.v)}, so moving the parentheses did not change the value.`
            : ` To get ${fmtNum(place.v)}, the parentheses go here: ${exprText(place.want)}.`
          : ""}
      </>
    ),
  };
}

function laterProblem(): Problem {
  const { e, t } = plusTimes("right");
  const v = evalExpr(e);
  const l2r = leftToRight(e)!;
  // Sam is right half the time (decided first, so the choices stay balanced).
  const samRight = Math.random() < 0.5;
  const sam = samRight ? v : l2r;
  const right = "Sam is right.";
  const wrong = `Sam is not right. He worked out ${t.a} ${t.o1} ${t.b} first.`;
  return {
    title: "Parentheses later",
    bucket: "parensLast",
    story: <>The parentheses are not at the start this time.</>,
    visual: (done, help) => (done >= 1 ? <WorkLines expr={e} /> : <ExprView expr={e} focus={pointing(help, 0) ? "next" : null} />),
    steps: [
      valueStep(e),
      choice(
        {
          prompt: `Sam says ${exprText(e)} = ${fmtNum(sam)}. Is Sam right?`,
          hint: "Compare Sam's number with yours.",
          explain: samRight ? `Sam worked out ${firstPartText(e)} first, so he got ${fmtNum(v)}.` : `${fmtNum(l2r)} comes from going left to right. The parentheses say to work out ${firstPartText(e)} first.`,
        },
        samRight ? right : wrong,
        [samRight ? wrong : right, "Sam is not right. You always work from left to right."]
      ),
    ],
    wrapUp: <>{workText(e)}. The part in parentheses comes first, even when it is at the end.</>,
  };
}

function Preview() {
  return <WorkLines expr={bin("×", 3, bin("+", 4, 6, "paren"))} />;
}

export const whyParentheses: Unit = {
  id: "whyParentheses",
  title: "Why We Need Parentheses",
  goal: "See how the order of steps can change an answer, and use parentheses to show which part comes first.",
  standard: "5.OA.1",
  keyIdea: (
    <>
      <p>An expression, like (4 + 6) × 3, is numbers and signs that show a calculation.</p>
      <p>Parentheses ( ) show which part to work out first. Work out the part inside them, then do the rest.</p>
      <p>(4 + 6) × 3 = 10 × 3 = 30. But 4 + (6 × 3) = 4 + 18 = 22. Same numbers, different values.</p>
      <p>With only + or only ×, the parentheses can go in either place. The value stays the same.</p>
    </>
  ),
  Explore,
  requiresIntro: true,
  preview: Preview,
  requiredBuckets: U1_BUCKETS,
  problems: [
    { label: "Stories", make: () => storyProblem(), buckets: ["story"] },
    { label: "Parentheses first", make: () => moveProblem("parensFirst"), buckets: ["parensFirst"] },
    { label: "Parentheses later", make: () => laterProblem(), buckets: ["parensLast"] },
    { label: "Subtract or divide", make: () => moveProblem("subDiv"), buckets: ["subDiv"] },
  ],
  test: whyParenthesesTest,
};
