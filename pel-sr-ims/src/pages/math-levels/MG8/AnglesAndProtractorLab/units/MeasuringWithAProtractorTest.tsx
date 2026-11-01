import { ReadPicture } from "../diagrams";
import { acuteBetweenTens, labeledTen, obtuseBetweenTens, randomSide, readDistractors, setupRead, setupUnaligned, type Side } from "../lib/readSetups";
import { pick } from "../../../shared/lib/math";
import { choice, selectBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Self-contained: never imports from MeasuringWithAProtractor.tsx (that file
// imports this one). Pictures come from ../diagrams, scenarios from ../lib.

type D = TestQuestion["difficulty"];

const readPrompt = "The black ray lies along the protractor's straight edge. How many degrees is the angle between the black ray and the purple ray?";
const readHint = (scaleName: string, other: number) => `Find the scale whose 0 sits on the black ray — the ${scaleName}. (If you got ${other}°, you read the other scale.)`;

// Q1 — read an angle that lands on a labeled ten (typed)
export function readAlignedQuestion(difficulty: D = "easy"): () => TestQuestion[] {
  return () => {
    const s = setupRead(randomSide(), labeledTen());
    return [
      {
        visual: <ReadPicture baseDir={s.baseDir} rayDir={s.rayDir} />,
        difficulty,
        step: { kind: "number", prompt: readPrompt, hint: readHint(s.scaleName, s.other), explain: `The black ray is on 0 of the ${s.scaleName}, so read that scale: ${s.reading}°.`, answer: s.reading, suffix: "°" },
      },
    ];
  };
}

/** Generic "read the protractor" choice question with the wrong-scale distractor. */
function readChoiceQuestion(kind: "acute" | "obtuse", side: Side | "random", difficulty: D): () => TestQuestion[] {
  return () => {
    const m = kind === "acute" ? acuteBetweenTens() : obtuseBetweenTens();
    const s = setupRead(side === "random" ? randomSide() : side, m);
    return [
      {
        visual: <ReadPicture baseDir={s.baseDir} rayDir={s.rayDir} />,
        difficulty,
        step: choice(
          { prompt: readPrompt, hint: readHint(s.scaleName, s.other), explain: `Count up from 0 on the ${s.scaleName}: ${s.reading}°. The angle is ${kind}, so ${s.other}° couldn't be right.` },
          `${s.reading}°`,
          readDistractors(s.reading)
        ),
      },
    ];
  };
}

/** Generic typed reading. */
function readTypedQuestion(kind: "acute" | "obtuse", side: Side | "random", difficulty: D): () => TestQuestion[] {
  return () => {
    const m = kind === "acute" ? acuteBetweenTens() : obtuseBetweenTens();
    const s = setupRead(side === "random" ? randomSide() : side, m);
    return [
      {
        visual: <ReadPicture baseDir={s.baseDir} rayDir={s.rayDir} />,
        difficulty,
        step: { kind: "number", prompt: readPrompt, hint: readHint(s.scaleName, s.other), explain: `Count up from 0 on the ${s.scaleName}: ${s.reading}°. (${s.other}° is the other scale — it doesn't match an ${kind} angle.)`, answer: s.reading, suffix: "°" },
      },
    ];
  };
}

// Q2 — acute, base on the right (inner scale), choice
export const readAcuteChoiceQuestion = (side: Side | "random" = "right", difficulty: D = "easy") => readChoiceQuestion("acute", side, difficulty);
// Q3 — acute, base on the LEFT (outer scale), typed
export const readAcuteTypedQuestion = (side: Side | "random" = "left", difficulty: D = "medium") => readTypedQuestion("acute", side, difficulty);
// Q4 — obtuse, choice — wrong scale gives an acute-looking number
export const readObtuseChoiceQuestion = (side: Side | "random" = "random", difficulty: D = "medium") => readChoiceQuestion("obtuse", side, difficulty);
// Q5 — obtuse, typed
export const readObtuseTypedQuestion = (side: Side | "random" = "random", difficulty: D = "hard") => readTypedQuestion("obtuse", side, difficulty);

// Q6 — neither ray on 0 (typed)
export function unalignedTypedQuestion(difficulty: D = "hard"): () => TestQuestion[] {
  return () => {
    const u = setupUnaligned();
    return [
      {
        visual: <ReadPicture baseDir={u.dir1} rayDir={u.dir2} />,
        difficulty,
        step: {
          kind: "number",
          prompt: `Neither ray is on 0. Using the ${u.scaleName}, how many degrees is the angle between the black ray and the purple ray?`,
          hint: "Read where EACH ray crosses that scale, then find how far apart the two numbers are.",
          explain: `The rays cross the ${u.scaleName} at ${u.read1} and ${u.read2}. ${Math.max(u.read1, u.read2)} − ${Math.min(u.read1, u.read2)} = ${u.measure}°.`,
          answer: u.measure,
          suffix: "°",
        },
      },
    ];
  };
}

// Q7 — neither ray on 0 (choice)
export function unalignedChoiceQuestion(difficulty: D = "hard"): () => TestQuestion[] {
  return () => {
    const u = setupUnaligned();
    const far = Math.max(u.read1, u.read2);
    return [
      {
        visual: <ReadPicture baseDir={u.dir1} rayDir={u.dir2} />,
        difficulty,
        step: choice(
          {
            prompt: `Neither ray is on 0. Using the ${u.scaleName}, how many degrees is the angle between the two rays?`,
            hint: "Read both rays on the same scale, then subtract.",
            explain: `${far} − ${Math.min(u.read1, u.read2)} = ${u.measure}°.`,
          },
          `${u.measure}°`,
          // read only the far ray as if the other were on 0; added the two readings instead of subtracting.
          [`${far}°`, `${u.read1 + u.read2}°`]
        ),
      },
    ];
  };
}

// Q8 — which scale starts on the base ray (choice)
export function whichScaleQuestion(difficulty: D = "easy"): () => TestQuestion[] {
  return () => {
    const side = randomSide();
    const m = pick([acuteBetweenTens(), obtuseBetweenTens()]);
    const s = setupRead(side, m);
    const correct = side === "right" ? "the blue inner scale" : "the orange outer scale";
    return [
      {
        visual: <ReadPicture baseDir={s.baseDir} rayDir={s.rayDir} />,
        difficulty,
        step: choice(
          {
            prompt: "Which scale should you read to measure this angle?",
            hint: "Look at the end of the straight edge where the black ray is. Which scale says 0 there?",
            explain: `The black ray sits on 0 of ${correct}, so that's the scale to count up on (${s.reading}°).`,
          },
          correct,
          // "always the inner one" habit / picking whichever scale's number looks more familiar.
          [side === "right" ? "the orange outer scale" : "the blue inner scale"]
        ),
      },
    ];
  };
}

// Q9 — reasonableness: someone read the wrong scale (choice)
export function sanityQuestion(difficulty: D = "medium"): () => TestQuestion[] {
  return () => {
    const kind = pick(["acute", "obtuse"] as const);
    const m = kind === "acute" ? acuteBetweenTens() : obtuseBetweenTens();
    const s = setupRead(randomSide(), m);
    const claim = s.other;
    const correct = `No — the angle is ${kind}, so it must be ${s.reading}°`;
    return [
      {
        visual: <ReadPicture baseDir={s.baseDir} rayDir={s.rayDir} />,
        difficulty,
        step: choice(
          {
            prompt: `Jo measured this angle and said it is ${claim}°. Is Jo right?`,
            hint: "Is the angle smaller or bigger than a square corner (90°)? Does Jo's number match that?",
            explain: `Jo read the wrong scale. The angle is ${kind}, and the scale starting at 0 on the black ray says ${s.reading}°.`,
          },
          correct,
          // trusting any number the ray crosses (the wrong-scale habit); and a right-angle guess.
          [`Yes — ${claim}° is where the purple ray crosses the protractor`, "No — it's a right angle, so it is 90°"]
        ),
      },
    ];
  };
}

// Q10 — how to place a protractor (sentence)
export function placementQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: sentence(
        {
          prompt: "Fill in both blanks about placing a protractor.",
          hint: "The center mark goes where the two rays meet.",
          explain: "Put the center mark on the vertex, and line up the 0° line along one of the angle's rays.",
        },
        "Put the protractor's center mark on the angle's ",
        selectBlank("vertex", ["arrow tip", "longest ray"]),
        ", and line up the 0° line along ",
        // "the bottom of the page" = assuming a default orientation.
        selectBlank("one of the angle's rays", ["the bottom of the page", "the middle of the angle"]),
        "."
      ),
    },
  ];
}

export const measuringWithAProtractorTest: Unit["test"] = {
  questions: [
    readAlignedQuestion("easy"),
    whichScaleQuestion("easy"),
    readAcuteChoiceQuestion("right", "easy"),
    placementQuestion,
    readAcuteTypedQuestion("left", "medium"),
    readObtuseChoiceQuestion("random", "medium"),
    sanityQuestion("medium"),
    readObtuseTypedQuestion("random", "hard"),
    unalignedChoiceQuestion("hard"),
    unalignedTypedQuestion("hard"),
  ],
  passScore: 9,
};
