import { AngleFigure, Protractor, ReadPicture, localForReading } from "../diagrams";
import { benchmarkLineup, markPoints, sketchPlacement, sketchTarget, type Placement } from "../lib/sketchSetups";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Self-contained: never imports from SketchingAngles.tsx (that file imports
// this one). No drag widgets here — a no-feedback test can't contain a step
// that only finishes once correct, so every sketching skill is tested with a
// pictured protractor plus a typed or multiple-choice answer.

type D = TestQuestion["difficulty"];
const scaleWord = (s: "inner" | "outer") => (s === "inner" ? "blue inner" : "orange outer");

// Q1/Q2/Q6/Q10 — which lettered point do you connect to draw a T° angle?
export function markPointQuestion(placement: Placement | "random", difficulty: D): () => TestQuestion[] {
  return () => {
    const p = sketchPlacement(placement === "random" ? pick(["right", "left", "rotated"] as const) : placement);
    const t = sketchTarget();
    const mp = markPoints(p.scale, t);
    return [
      {
        visual: <Protractor rot={p.rot} rays={[{ dir: p.baseDir, tone: "ink" }]} marks={mp.marks} width={380} ariaLabel="A protractor lined up on a black ray, with lettered points around its edge" />,
        difficulty,
        step: choice(
          {
            prompt: `The protractor is lined up on the black ray. To draw a ${t}° angle, which point should you connect to the vertex?`,
            hint: "Find the scale that reads 0 on the black ray, then count up to the target on THAT scale.",
            explain: `The ${scaleWord(p.scale)} scale starts at 0 on the black ray, so point ${mp.correctLetter} (${t} on that scale) makes ${t}°. Point ${mp.wrongScaleLetter} is ${t} on the OTHER scale — it would make ${180 - t}°.`,
          },
          `Point ${mp.correctLetter}`,
          // Includes the wrong-scale point (makes 180 − T) and tick-miscounts 10° off.
          mp.letters.filter((l) => l !== mp.correctLetter).map((l) => `Point ${l}`)
        ),
      },
    ];
  };
}

// Q3 — which pictured angle is the benchmark (90° or 180°)?
export function benchmarkPictureQuestion(difficulty: D = "easy"): () => TestQuestion[] {
  return () => {
    const target = pick([90, 180] as const);
    const lineup = benchmarkLineup(target);
    const letters = ["A", "B", "C"];
    const correct = `Angle ${letters[lineup.indexOf(target)]}`;
    return [
      {
        visual: (
          <div className="ap-figs">
            {lineup.map((m, i) => (
              <figure className="ap-fig" key={i}>
                <AngleFigure rays={[{ dir: 0, len: 70 }, { dir: m, len: 70, tone: "c" }]} grid frameRadius={82} width={140} ariaLabel={`Angle ${letters[i]}`} />
                <figcaption>Angle {letters[i]}</figcaption>
              </figure>
            ))}
          </div>
        ),
        difficulty,
        step: choice(
          {
            prompt: target === 90 ? "Which angle is a 90° angle (a square corner)?" : "Which angle is a 180° angle?",
            hint: target === 90 ? "A 90° angle fits exactly in the corner of a grid square." : "A 180° angle's rays point in exactly opposite directions — a straight line.",
            explain: target === 90 ? `${correct} makes an exact square corner. The others are a little too narrow or too wide.` : `${correct}'s rays make a straight line. The others bend a little.`,
          },
          correct,
          // The near-misses: angles that "look about right" but aren't the benchmark.
          letters.filter((l) => `Angle ${l}` !== correct).map((l) => `Angle ${l}`)
        ),
      },
    ];
  };
}

// Q4 — someone drew through a mark read on the WRONG scale: what angle did they actually make? (typed)
export function drawnAngleQuestion(difficulty: D = "medium"): () => TestQuestion[] {
  return () => {
    let x = randInt(2, 16) * 10 + 5; // 25..165, between labeled tens
    while (Math.abs(x - 90) < 10) x = randInt(2, 16) * 10 + 5;
    const rayDir = localForReading("outer", x); // flat protractor, black ray on the right (inner 0)
    return [
      {
        visual: <ReadPicture baseDir={0} rayDir={rayDir} />,
        difficulty,
        step: {
          kind: "number",
          prompt: `Sam's black ray is on 0 of the blue inner scale. He drew his purple ray through the mark that says ${x} on the ORANGE outer scale. What size angle did he actually draw?`,
          hint: "Read the angle on the scale that starts at 0 on the black ray.",
          explain: `On the blue inner scale, the purple ray is at ${180 - x}. So Sam drew ${180 - x}°, not ${x}° — he counted on the wrong scale.`,
          answer: 180 - x,
          suffix: "°",
        },
      },
    ];
  };
}

// Q5 — the first step when the ray isn't flat (choice)
export function firstStepQuestion(difficulty: D = "medium"): () => TestQuestion[] {
  return () => {
    const dir = pick([30, 60, 120, 135, 150, 210, 240, 300]);
    return [
      {
        visual: <AngleFigure rays={[{ dir, len: 100 }]} width={190} ariaLabel="One ray pointing at a slant" />,
        difficulty,
        step: choice(
          {
            prompt: "You need to draw an angle that starts from this slanted ray. What should you do first?",
            hint: "A protractor only works when it's lined up with the ray you start from.",
            explain: "Put the center mark on the ray's endpoint (the vertex) and turn the protractor so its 0° line lies right on the ray.",
          },
          "Put the center mark on the ray's endpoint and turn the 0° line onto the ray",
          // keeping the protractor flat on the page (default-orientation habit); centering on the arrow tip.
          ["Keep the protractor flat along the bottom of the page", "Put the center mark on the arrow tip of the ray"]
        ),
      },
    ];
  };
}

// Q7 — the other scale's number at your mark (typed)
export function otherScaleQuestion(difficulty: D = "hard"): () => TestQuestion[] {
  return () => {
    const t = sketchTarget();
    const outerStart = Math.random() < 0.5;
    const start = outerStart ? "orange outer" : "blue inner";
    const other = outerStart ? "blue inner" : "orange outer";
    return [
      {
        visual: null,
        difficulty,
        step: {
          kind: "number",
          prompt: `Lily is drawing a ${t}° angle. Her black ray is on 0 of the ${start} scale, so she makes her mark at ${t} on that scale. What number does the ${other} scale show at her mark?`,
          hint: "The two scales always add up to 180 at any mark.",
          explain: `180 − ${t} = ${180 - t}. That's why reading the wrong scale gives 180° minus the right answer.`,
          answer: 180 - t,
        },
      },
    ];
  };
}

// Q8 — check someone's sketch (choice)
export function checkSketchQuestion(difficulty: D = "hard"): () => TestQuestion[] {
  return () => {
    const t = sketchTarget();
    const right = Math.random() < 0.5;
    const drawn = right ? t : 180 - t;
    const side = Math.random() < 0.5 ? "right" : "left";
    const baseDir = side === "right" ? 0 : 180;
    const rayDir = side === "right" ? drawn : 180 - drawn;
    const correct = right ? "Yes — it is a " + t + "° angle" : `No — she used the wrong scale and drew ${drawn}°`;
    return [
      {
        visual: <ReadPicture baseDir={baseDir} rayDir={rayDir} />,
        difficulty,
        step: choice(
          {
            prompt: `Ava tried to draw a ${t}° angle from the black ray. Did she?`,
            hint: "Read her angle on the scale that starts at 0 on the black ray.",
            explain: right ? `Yes — counting from 0 on the black ray's scale gives ${t}°.` : `No — counting from 0 on the black ray's scale gives ${drawn}°. She found ${t} on the other scale.`,
          },
          correct,
          // Each wrong option is the other verdict, plus "ray length matters" (Unit 1's trap).
          [right ? `No — she used the wrong scale and drew ${180 - t}°` : "Yes — it is a " + t + "° angle", "No — her purple ray is too long"]
        ),
      },
    ];
  };
}

// Q9 — what a 180° angle looks like (choice)
export function straightAngleQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "easy",
      step: choice(
        {
          prompt: "You sketch a 180° angle. What does it look like?",
          hint: "180° is a half turn.",
          explain: "A half turn points the second ray exactly the opposite way — the two rays make a straight line.",
        },
        "Two rays pointing opposite ways, making a straight line",
        // confusing 180° with 90° (square corner) or with 0°/360° (rays on top of each other).
        ["A square corner", "Two rays on top of each other"]
      ),
    },
  ];
}

export const sketchingAnglesTest: Unit["test"] = {
  questions: [
    markPointQuestion("right", "easy"),
    benchmarkPictureQuestion("easy"),
    straightAngleQuestion,
    markPointQuestion("left", "medium"),
    firstStepQuestion("medium"),
    drawnAngleQuestion("medium"),
    markPointQuestion("rotated", "hard"),
    otherScaleQuestion("hard"),
    checkSketchQuestion("hard"),
    markPointQuestion("random", "hard"),
  ],
  passScore: 9,
};
