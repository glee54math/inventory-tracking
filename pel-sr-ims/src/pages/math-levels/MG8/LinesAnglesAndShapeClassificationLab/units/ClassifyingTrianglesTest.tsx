import { pick } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";
import { ANGLE_TRI_NAME, equalSideCount, fullName, makeTriangle, SIDE_RULE } from "../lib/unit3Gen";
import type { AngleType, SideClass } from "../lib/geometry";
import { TriangleDrawing } from "../diagrams/Unit3Figures";

// ---------- end-of-unit test: Classifying Triangles ----------
// 10 single-question generators; imports lib/ + diagrams/ only.

type Diff = TestQuestion["difficulty"];
const SIDE_NAMES: SideClass[] = ["equilateral", "isosceles", "scalene"];
const ANGLE_NAMES = ["acute triangle", "right triangle", "obtuse triangle"];

/** Q1-3: name a triangle by its sides. */
export const sideClassQuestion = (side: SideClass, difficulty: Diff): TestQuestion[] => {
  const t = makeTriangle({ side, angle: side === "equilateral" ? "acute" : pick(["acute", "obtuse", "right"] as AngleType[]) });
  return [
    {
      visual: <TriangleDrawing t={t} />,
      difficulty,
      step: choice(
        {
          prompt: "Name this triangle by its SIDES.",
          hint: "Compare the three side lengths. All equal? Exactly two? None?",
          explain: `It has ${SIDE_RULE[side]}, so it's ${side === "isosceles" ? "an" : side === "equilateral" ? "an" : "a"} ${side} triangle.`,
        },
        side,
        // equilateral <-> isosceles is the "two equal looks like all equal" slip;
        // scalene is chosen by students who ignore the labels entirely
        SIDE_NAMES.filter((n) => n !== side)
      ),
    },
  ];
};

/** Q4-6: name a triangle by its angles. */
export const angleClassQuestion = (angle: AngleType, difficulty: Diff): TestQuestion[] => {
  const t = makeTriangle({ angle, side: angle === "acute" ? pick(["equilateral", "isosceles", "scalene"] as SideClass[]) : pick(["isosceles", "scalene"] as SideClass[]) });
  return [
    {
      visual: <TriangleDrawing t={t} />,
      difficulty,
      step: choice(
        {
          prompt: "Name this triangle by its ANGLES.",
          hint: "Find its biggest angle. A little square marks a right angle.",
          explain:
            angle === "right" ? "The little square marks a right angle — a right triangle." : angle === "obtuse" ? "One angle opens wider than a square corner — an obtuse triangle." : "All three angles are smaller than a square corner — an acute triangle.",
        },
        ANGLE_TRI_NAME[angle],
        // acute <-> obtuse swap = comparing to the wrong reference; "right" on a
        // non-right triangle = guessing without the right-angle mark
        ANGLE_NAMES.filter((n) => n !== ANGLE_TRI_NAME[angle])
      ),
    },
  ];
};

/** Q7: BOTH names at once — targets "a triangle can only have one name". */
export const bothNamesQuestion = (difficulty: Diff): TestQuestion[] => {
  const combo = pick([
    ["isosceles", "right"],
    ["scalene", "right"],
    ["isosceles", "obtuse"],
    ["scalene", "obtuse"],
  ] as [SideClass, AngleType][]);
  const t = makeTriangle({ side: combo[0], angle: combo[1] });
  const correct = fullName(combo[0], combo[1]);
  const otherSide = combo[0] === "isosceles" ? "scalene" : "isosceles";
  const otherAngle = combo[1] === "right" ? "acute" : "right";
  return [
    {
      visual: <TriangleDrawing t={t} />,
      difficulty,
      step: choice(
        {
          prompt: "Which name describes this triangle by its sides AND its angles?",
          hint: "Every triangle gets one name from its sides and one from its angles.",
          explain: `By sides it's ${combo[0]}; by angles it's ${combo[1]}. Together: a ${correct}.`,
        },
        correct,
        [
          fullName(otherSide, combo[1]), // right angle-name, wrong side-name
          fullName(combo[0], otherAngle), // right side-name, wrong angle-name
          `only ${combo[0]} — a triangle can't have two names`, // the named misconception
        ]
      ),
    },
  ];
};

/** Q8: near-miss — sides that look equal but are stated different. */
export const nearMissQuestion = (difficulty: Diff): TestQuestion[] => {
  const t = makeTriangle({ nearMiss: true });
  return [
    {
      visual: <TriangleDrawing t={t} />,
      difficulty,
      step: choice(
        {
          prompt: "This triangle LOOKS like all its sides might be equal. Name it by its sides, using the measurements.",
          hint: "Trust the numbers, not your eyes.",
          explain: `The lengths are ${t.sides.join(", ")} — ${t.sideClass === "isosceles" ? "exactly two match" : "none match"}, so it's ${t.sideClass}, not equilateral.`,
        },
        t.sideClass,
        // "equilateral" = trusting the picture over the measurements
        SIDE_NAMES.filter((n) => n !== t.sideClass)
      ),
    },
  ];
};

/** Q9: how many sides share a length with another side? (typed) */
export const equalSidesQuestion = (difficulty: Diff): TestQuestion[] => {
  const t = Math.random() < 0.5 ? makeTriangle({ nearMiss: true }) : makeTriangle({ side: pick(SIDE_NAMES) });
  const n = equalSideCount(t.sideClass);
  return [
    {
      visual: <TriangleDrawing t={t} />,
      difficulty,
      step: {
        kind: "number",
        prompt: "How many of this triangle's sides are the same length as another side? (Type 0 if none are.)",
        hint: "Read each label. Which lengths repeat?",
        explain: `${n} — so it's ${t.sideClass}.`,
        answer: n,
      },
    },
  ];
};

/** Q10: true/false — right AND scalene at the same time is possible. */
export const rightScaleneTrapQuestion = (difficulty: Diff): TestQuestion[] => [
  {
    visual: null,
    difficulty,
    step: choice(
      {
        prompt: "True or False: a triangle can be a right triangle AND a scalene triangle at the same time.",
        hint: "Side names and angle names are two separate systems.",
        explain: "True — for example, a triangle with sides 3, 4 and 5 has a right angle and no equal sides. Every triangle gets a side-name AND an angle-name.",
      },
      "True",
      // "False" = the two naming systems are mutually exclusive (the unit's misconception)
      ["False"]
    ),
  },
];

export const classifyingTrianglesTest: Unit["test"] = {
  questions: [
    () => sideClassQuestion("equilateral", "easy"),
    () => sideClassQuestion("isosceles", "easy"),
    () => sideClassQuestion("scalene", "medium"),
    () => angleClassQuestion("right", "easy"),
    () => angleClassQuestion("obtuse", "medium"),
    () => angleClassQuestion("acute", "medium"),
    () => bothNamesQuestion("hard"),
    () => nearMissQuestion("hard"),
    () => equalSidesQuestion("medium"),
    () => rightScaleneTrapQuestion("hard"),
  ],
  passScore: 9,
};
