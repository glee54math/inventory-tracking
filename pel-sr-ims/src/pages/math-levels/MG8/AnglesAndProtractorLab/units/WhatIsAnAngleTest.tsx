import { PairPicture, TurnPicture } from "../diagrams";
import { BENCHMARKS, BETWEEN_LABELS, estimateDistractors, quarterOf, randomBetweenTurn, rayLengthPair, type RayLengthKind } from "../lib/angleFacts";
import { pick, randInt } from "../../../shared/lib/math";
import { choice, numberBlank, selectBlank, sentence, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// Self-contained: never imports from WhatIsAnAngle.tsx (that file imports
// this one — the reverse would be a circular import). Shared pictures/facts
// come from ../diagrams and ../lib instead.

type D = TestQuestion["difficulty"];
const randomBase = () => randInt(0, 23) * 15;

// Q1 — benchmark turn as a fraction of a circle (choice)
export function benchmarkFractionQuestion(difficulty: D = "easy"): () => TestQuestion[] {
  return () => {
    const b = pick(BENCHMARKS);
    return [
      {
        visual: <TurnPicture base={randomBase()} m={b.deg} />,
        difficulty,
        step: choice(
          {
            prompt: "The shaded part shows how far one ray turned from the other. What fraction of a full turn is it?",
            hint: "The dashed circle has a mark at every quarter turn. Count how many quarters the shading covers.",
            explain: `The shading covers ${b.deg / 90} of the 4 quarter marks, so it is ${b.frac} of a full turn — ${b.name}.`,
          },
          b.frac,
          // The other benchmark fractions (e.g. 1/4 for a 3/4 turn = reading the UNSHADED part),
          // plus 1/3 — counting the 3 marks a three-quarter turn crosses as "thirds".
          [...BENCHMARKS.filter((x) => x.deg !== b.deg).map((x) => x.frac), "1/3"]
        ),
      },
    ];
  };
}

// Q2 — benchmark turn in degrees (typed)
export function benchmarkDegreesQuestion(difficulty: D = "easy"): () => TestQuestion[] {
  return () => {
    const b = pick(BENCHMARKS);
    return [
      {
        visual: <TurnPicture base={randomBase()} m={b.deg} />,
        difficulty,
        step: {
          kind: "number",
          prompt: `This turn is ${b.name}. A full turn is 360°. How many degrees is ${b.name}?`,
          hint: "Split 360° into 4 equal quarters first.",
          explain: `360° ÷ 4 = 90° per quarter, so ${b.name} is ${b.deg}°.`,
          answer: b.deg,
          suffix: "°",
        },
      },
    ];
  };
}

// Q3 — a non-benchmark turn placed between two benchmarks (choice)
export function betweenQuestion(difficulty: D = "medium"): () => TestQuestion[] {
  return () => {
    const m = randomBetweenTurn();
    const q = quarterOf(m);
    return [
      {
        visual: <TurnPicture base={randomBase()} m={m} />,
        difficulty,
        step: choice(
          {
            prompt: "Which is true about this turn?",
            hint: "Use the quarter-turn marks on the dashed circle as benchmarks.",
            explain: `The shading passes ${q} quarter mark${q === 1 ? "" : "s"} but doesn't reach the next one, so it is ${BETWEEN_LABELS[q]}. (It is ${m}°.)`,
          },
          BETWEEN_LABELS[q],
          // The other three ranges — an off-by-one-benchmark misjudgment.
          BETWEEN_LABELS.filter((_, i) => i !== q)
        ),
      },
    ];
  };
}

// Q4 — estimate the degrees of a non-benchmark turn (choice; options in different quarters)
export function estimateQuestion(difficulty: D = "medium"): () => TestQuestion[] {
  return () => {
    const m = randomBetweenTurn();
    return [
      {
        visual: <TurnPicture base={randomBase()} m={m} />,
        difficulty,
        step: choice(
          {
            prompt: "Which is the best estimate for this turn?",
            hint: "First decide which two benchmarks (0°, 90°, 180°, 270°, 360°) it is between.",
            explain: `It is ${BETWEEN_LABELS[quarterOf(m)]}, and ${m}° is the only choice in that range.`,
          },
          `${m}°`,
          // 360 − m = measuring the OUTSIDE of the turn; the other is a quarter turn off.
          estimateDistractors(m)
        ),
      },
    ];
  };
}

function rayLengthQuestion(kind: RayLengthKind, difficulty: D): () => TestQuestion[] {
  return () => {
    const pair = rayLengthPair(kind);
    const correct = pair.bigger === "same" ? "They are the same size" : `Angle ${pair.bigger}`;
    return [
      {
        visual: <PairPicture a={{ base: 10, ...pair.A }} b={{ base: 10, ...pair.B }} />,
        difficulty,
        step: choice(
          {
            prompt: "Which angle is bigger — which one has more turn between its two rays?",
            hint: "Ignore how long the rays are. Look only at how far apart the two rays are turned at the vertex.",
            explain:
              pair.bigger === "same"
                ? `Both angles turn ${pair.A.m}°. Angle ${pair.longer}'s rays are just drawn longer — ray length doesn't change an angle.`
                : `Angle ${pair.bigger} turns ${Math.max(pair.A.m, pair.B.m)}°, more than ${Math.min(pair.A.m, pair.B.m)}°. Ray length doesn't matter.`,
          },
          correct,
          // "The one with longer rays" / "the one whose tips are farther apart" — the ray-length trap.
          ["Angle A", "Angle B", "They are the same size"].filter((c) => c !== correct)
        ),
      },
    ];
  };
}

// Q5 — ray-length trap: longer rays but LESS turn
export const rayLengthTrapQuestion = (difficulty: D = "medium") => rayLengthQuestion("trap", difficulty);
// Q6 — same turn, different ray lengths
export const rayLengthSameQuestion = (difficulty: D = "hard") => rayLengthQuestion("same", difficulty);

// Q7 — orientation: the same angle turned on the page (choice)
export function orientationQuestion(difficulty: D = "hard"): () => TestQuestion[] {
  return () => {
    const M = randInt(6, 30) * 5;
    const r = randInt(3, 21) * 15;
    const opts: string[] = [];
    const add = (v: number) => {
      if (v > 0 && v < 360 && v !== M && !opts.includes(`${v}°`)) opts.push(`${v}°`);
    };
    add(M + r < 360 ? M + r : Math.abs(M - r)); // added the amount the PICTURE was turned
    add(180 - M); // the other side of a straight line
    add(M + 45);
    return [
      {
        visual: <PairPicture a={{ base: 0, m: M, len: 100 }} b={{ base: r, m: M, len: 100 }} labels={[`${M}°`, "?"]} />,
        difficulty,
        step: choice(
          {
            prompt: `Angle B is Angle A, just turned to face a different way on the page. Angle A measures ${M}°. What does Angle B measure?`,
            hint: "Turning the whole picture doesn't change how far apart the two rays are.",
            explain: `${M}° — moving or turning an angle on the page never changes its measure.`,
          },
          `${M}°`,
          opts.slice(0, 2)
        ),
      },
    ];
  };
}

// Q8 — what a one-degree angle is (choice)
export function oneDegreeQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "medium",
      step: choice(
        {
          prompt: "A one-degree angle turns through what part of a full circle?",
          hint: "How many degrees are in a full turn?",
          explain: "A full turn is 360°, so one degree is 1/360 of a full circle.",
        },
        "1/360 of a circle",
        // 1/100 = thinking degrees work like percents; 1/180 = confusing a full turn with a straight line; 1/90 = with a quarter turn.
        ["1/100 of a circle", "1/180 of a circle", "1/90 of a circle"]
      ),
    },
  ];
}

// Q9 — n one-degree angles = n degrees, and compare to a quarter turn (sentence)
export function countDegreesQuestion(): TestQuestion[] {
  let n = randInt(4, 66) * 5;
  while (Math.abs(n - 90) < 15) n = randInt(4, 66) * 5;
  return [
    {
      visual: null,
      difficulty: "medium",
      step: sentence(
        {
          prompt: "Fill in both blanks.",
          hint: "Each one-degree angle adds 1°. A quarter turn is 90°.",
          explain: `${n} one-degree angles make ${n}°, which is ${n < 90 ? "less" : "more"} than a quarter turn (90°).`,
        },
        `An angle that turns through ${n} one-degree angles measures `,
        numberBlank(n),
        " degrees, which is ",
        selectBlank(n < 90 ? "less than a quarter turn" : "more than a quarter turn", ["less than a quarter turn", "more than a quarter turn"]),
        "."
      ),
    },
  ];
}

// Q10 — vocabulary: rays + vertex (sentence)
export function vocabularyQuestion(): TestQuestion[] {
  return [
    {
      visual: null,
      difficulty: "easy",
      step: sentence(
        {
          prompt: "Fill in both blanks.",
          hint: "An angle's two sides start at the same point and go on forever in one direction.",
          explain: "An angle is two rays that share an endpoint, called the vertex.",
        },
        "An angle is made of two ",
        // "lines of the same length" targets the ray-length misconception.
        selectBlank("rays", ["lines of the same length", "circles"]),
        " that share an endpoint called the ",
        selectBlank("vertex", ["degree", "arc"]),
        "."
      ),
    },
  ];
}

export const whatIsAnAngleTest: Unit["test"] = {
  questions: [
    benchmarkFractionQuestion("easy"),
    benchmarkDegreesQuestion("easy"),
    vocabularyQuestion,
    betweenQuestion("medium"),
    estimateQuestion("medium"),
    rayLengthTrapQuestion("medium"),
    oneDegreeQuestion,
    countDegreesQuestion,
    rayLengthSameQuestion("hard"),
    orientationQuestion("hard"),
  ],
  passScore: 9,
};
