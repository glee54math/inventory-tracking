import { PartsPicture } from "../diagrams";
import { equationSetup, partSetup, randomBase, threeSetup, wholeSetup, type EqContext } from "../lib/additionSetups";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Self-contained: never imports from AngleAddition.tsx (that file imports this one).

type D = TestQuestion["difficulty"];

// Q1 — two parts → whole (typed)
export function wholeQuestion(difficulty: D = "easy"): () => TestQuestion[] {
  return () => {
    const s = wholeSetup();
    return [
      {
        visual: <PartsPicture base={randomBase()} parts={[s.a, s.b]} partLabels={[`${s.a}°`, `${s.b}°`]} wholeLabel="?" />,
        difficulty,
        step: { kind: "number", prompt: "The whole angle is split into two parts that don't overlap. What is the measure of the whole angle?", hint: "The whole is the sum of its parts.", explain: `${s.a}° + ${s.b}° = ${s.whole}°.`, answer: s.whole, suffix: "°" },
      },
    ];
  };
}

// Q2 — whole and one part → missing part (typed)
export function missingPartQuestion(difficulty: D = "easy"): () => TestQuestion[] {
  return () => {
    const s = partSetup();
    return [
      {
        visual: <PartsPicture base={randomBase()} parts={[s.a, s.b]} partLabels={[`${s.a}°`, "?"]} wholeLabel={`${s.whole}°`} />,
        difficulty,
        step: { kind: "number", prompt: `The whole angle is ${s.whole}°. One part is ${s.a}°. What is the missing part?`, hint: "Take the known part away from the whole.", explain: `${s.whole}° − ${s.a}° = ${s.b}°.`, answer: s.b, suffix: "°" },
      },
    ];
  };
}

// Q3 — missing part (choice)
export function missingPartChoiceQuestion(difficulty: D = "medium"): () => TestQuestion[] {
  return () => {
    const s = partSetup();
    return [
      {
        visual: <PartsPicture base={randomBase()} parts={[s.b, s.a]} partLabels={["?", `${s.a}°`]} wholeLabel={`${s.whole}°`} />,
        difficulty,
        step: choice(
          { prompt: `The whole angle is ${s.whole}°. One part is ${s.a}°. What is the missing part?`, hint: "Is the missing piece bigger or smaller than the whole?", explain: `${s.whole}° − ${s.a}° = ${s.b}°. A part can't be bigger than the whole.` },
          `${s.b}°`,
          // whole + part (added instead of subtracting — the missing-addend trap); a regrouping slip of 10.
          [`${s.whole + s.a}°`, `${s.b + 10}°`]
        ),
      },
    ];
  };
}

/** Labels for a three-part picture with one unknown. */
const threeLabels = (parts: number[], unknownIdx: number) => parts.map((p, i) => (i === unknownIdx ? "?" : `${p}°`));

// Q4 — three parts → whole (typed)
export function threePartsWholeQuestion(difficulty: D = "medium"): () => TestQuestion[] {
  return () => {
    const s = threeSetup("shown");
    return [
      {
        visual: <PartsPicture base={randomBase()} parts={s.parts} partLabels={threeLabels(s.parts, -1)} wholeLabel="?" />,
        difficulty,
        step: { kind: "number", prompt: "This angle is split into three parts that don't overlap. What is the whole angle?", hint: "Add all three parts.", explain: `${s.parts.join("° + ")}° = ${s.whole}°.`, answer: s.whole, suffix: "°" },
      },
    ];
  };
}

// Q5 — three parts, one part missing (typed)
export function threePartsMissingQuestion(difficulty: D = "hard"): () => TestQuestion[] {
  return () => {
    let s = threeSetup();
    while (s.unknownIdx === 3) s = threeSetup();
    const known = s.parts.filter((_, i) => i !== s.unknownIdx);
    const straight = s.context === "straight";
    return [
      {
        visual: <PartsPicture base={straight ? 0 : randomBase()} parts={s.parts} partLabels={threeLabels(s.parts, s.unknownIdx)} wholeLabel={straight ? undefined : `${s.whole}°`} />,
        difficulty,
        step: {
          kind: "number",
          prompt: straight ? "The three angles fill a straight line. What is the missing angle?" : `The whole angle is ${s.whole}°. What is the missing part?`,
          hint: straight ? "A straight line is a half turn: 180°. Add the known parts, then subtract from 180°." : "Add the two known parts, then subtract from the whole.",
          explain: `${known[0]}° + ${known[1]}° = ${known[0] + known[1]}°, and ${s.whole}° − ${known[0] + known[1]}° = ${s.parts[s.unknownIdx]}°.`,
          answer: s.parts[s.unknownIdx],
          suffix: "°",
        },
      },
    ];
  };
}

/** A picture for an equation-style problem: one known part and the unknown x. */
const eqPicture = (e: ReturnType<typeof equationSetup>, xLabel = "x") => (
  <PartsPicture
    base={e.context === "shown" ? randomBase() : 0}
    parts={e.xFirst ? [e.x, e.a] : [e.a, e.x]}
    partLabels={e.xFirst ? [xLabel, `${e.a}°`] : [`${e.a}°`, xLabel]}
    wholeLabel={e.context === "shown" ? `${e.whole}°` : undefined}
    squareWhole={e.context === "right"}
  />
);

/** Q6/Q7 — the whole is only implied (square corner / straight line) (typed). */
export function impliedWholeQuestion(context: "right" | "straight", difficulty: D = "hard"): () => TestQuestion[] {
  return () => {
    const e = equationSetup(context);
    return [
      {
        visual: eqPicture(e, "?"),
        difficulty,
        step: {
          kind: "number",
          prompt: context === "right" ? `A square corner is split into two angles. One is ${e.a}°. What is the other?` : `Two angles sit side by side on a straight line. One is ${e.a}°. What is the other?`,
          hint: context === "right" ? "A square corner (right angle) is 90°." : "A straight line is 180°.",
          explain: `${e.whole}° − ${e.a}° = ${e.x}°.`,
          answer: e.x,
          suffix: "°",
        },
      },
    ];
  };
}

/** The three equations offered for a picture: the right one and two whole/part mix-ups. */
export const equationChoices = (a: number, whole: number) => ({
  correct: `${a} + x = ${whole}`,
  // x = whole + a: treats the whole as a part; a + whole = x: treats x as the whole.
  wrong: [`x = ${whole} + ${a}`, `${a} + ${whole} = x`],
});

// Q8 — which equation matches the picture (choice)
export function equationMatchQuestion(context: EqContext | "random" = "random", difficulty: D = "medium"): () => TestQuestion[] {
  return () => {
    const e = equationSetup(context === "random" ? undefined : context);
    const eq = equationChoices(e.a, e.whole);
    return [
      {
        visual: eqPicture(e),
        difficulty,
        step: choice(
          {
            prompt: `x stands for the missing angle${e.context === "right" ? " (the whole is a square corner)" : e.context === "straight" ? " (the parts fill a straight line)" : ""}. Which equation matches the picture?`,
            hint: "The two parts add up to the whole.",
            explain: `The parts ${e.a}° and x add up to the whole, ${e.whole}°: ${eq.correct}. So x = ${e.x}°.`,
          },
          eq.correct,
          eq.wrong
        ),
      },
    ];
  };
}

// Q9 — solve a written equation (typed, no picture)
export function equationSolveQuestion(difficulty: D = "hard"): () => TestQuestion[] {
  return () => {
    const e = equationSetup("shown");
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "number",
          prompt: `An angle of ${e.whole}° is split into two parts. One part is ${e.a}°; the other is x. Solve: ${e.a} + x = ${e.whole}. What is x?`,
          hint: `What do you add to ${e.a} to get ${e.whole}? Subtract to find out.`,
          explain: `x = ${e.whole} − ${e.a} = ${e.x}, so the missing angle is ${e.x}°.`,
          answer: e.x,
          suffix: "°",
        },
      },
    ];
  };
}

// Q10 — real-world angle addition / subtraction (typed)
export function wordProblemQuestion(difficulty: D = "medium"): () => TestQuestion[] {
  return () => {
    const add = Math.random() < 0.5;
    if (add) {
      const a = randInt(20, 60);
      const b = randInt(15, 60);
      const who = pick(["A door", "A gate", "A laptop screen"]);
      return [
        {
          visual: null,
          difficulty,
          step: { kind: "number", prompt: `${who} is opened ${a}°. Then it is pushed open ${b}° more. How many degrees is it open now?`, hint: "The two turns sit side by side — add them.", explain: `${a}° + ${b}° = ${a + b}°.`, answer: a + b, suffix: "°" },
        },
      ];
    }
    const whole = randInt(9, 18) * 10;
    const a = randInt(20, whole - 20);
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "number",
          prompt: `A lawn sprinkler turns ${whole}° in all. So far it has turned ${a}°. How many more degrees will it turn?`,
          hint: "The whole turn is made of the part so far and the part still to go.",
          explain: `${a} + x = ${whole}, so x = ${whole} − ${a} = ${whole - a}°.`,
          answer: whole - a,
          suffix: "°",
        },
      },
    ];
  };
}

export const angleAdditionTest: Unit["test"] = {
  questions: [
    wholeQuestion("easy"),
    missingPartQuestion("easy"),
    missingPartChoiceQuestion("medium"),
    threePartsWholeQuestion("medium"),
    equationMatchQuestion("random", "medium"),
    wordProblemQuestion("medium"),
    impliedWholeQuestion("right", "hard"),
    impliedWholeQuestion("straight", "hard"),
    threePartsMissingQuestion("hard"),
    equationSolveQuestion("hard"),
  ],
  passScore: 9,
};
