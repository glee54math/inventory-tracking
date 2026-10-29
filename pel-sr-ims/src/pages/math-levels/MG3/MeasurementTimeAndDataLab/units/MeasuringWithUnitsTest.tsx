import { UnitRuler, tileLayout } from "../diagrams";
import { randInt } from "../../../shared/lib/math";
import { choice, type TestQuestion } from "../../../shared/engine/types";
import type { Unit } from "../../../shared/units/types";

// ---------- end-of-unit test: Measuring Length with Units ----------
// 10 single-question generators, self-contained (not imported from
// MeasuringWithUnits.tsx). Exported individually so ModuleTest.tsx can draw
// a cumulative sample from this unit's own question shapes.
//
// SCOPE BOUNDARY (1.MD.2 stops at whole-number-of-units lengths): every
// generator below only ever produces an integer `length` — there is no
// "lands between two unit marks" / fractional-length scenario anywhere in
// this file, by construction (tileLayout always divides a whole-number span
// into whole tiles). That's a 3rd-grade skill (3.MD.4), out of scope here.

/** Clean, correct measurement — straightforward count. */
export const cleanCountQuestion = (range: "short" | "wide"): TestQuestion[] => {
  const length = range === "short" ? randInt(3, 6) : randInt(7, 12);
  return [
    {
      visual: <UnitRuler length={length} mode="clean" tone="a" />,
      difficulty: range === "short" ? "easy" : "medium",
      step: { kind: "number", prompt: "These unit tiles are laid end to end with no gaps or overlaps. How many units long is the ribbon?", hint: "Count each tile exactly once.", explain: `There are ${length} tiles, so the ribbon is ${length} units long.`, answer: length },
    },
  ];
};

/** Gapped flaw: fewer tiles counted than the true length. Distractor
 *  targets the exact named misconception: just reporting the tiles-shown
 *  count instead of recognizing the gaps invalidate it. */
export const gappedMistakeQuestion = (ask: "trueLength" | "isCorrect"): TestQuestion[] => {
  const length = randInt(5, 10);
  const miscount = randInt(1, 2);
  const { tilesShown } = tileLayout(length, "gapped", miscount);
  const visual = <UnitRuler length={length} mode="gapped" miscount={miscount} tone="b" />;
  if (ask === "isCorrect") {
    return [
      {
        visual,
        difficulty: "medium",
        step: choice(
          { prompt: `A classmate laid tiles like this and counted ${tilesShown}. Is that the ribbon's real length?`, hint: "Look at the spaces between the tiles.", explain: "No — there are gaps between the tiles, so the count is wrong." },
          "No — there are gaps between the tiles",
          ["Yes, that's correct", "No — the tiles overlap"]
        ),
      },
    ];
  }
  return [
    {
      visual,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `A classmate laid tiles like this (with gaps) and counted ${tilesShown} tiles. How many tiles would it actually take, laid correctly with no gaps or overlaps?`,
        hint: "The gaps wasted room real tiles would have filled — the ribbon needs MORE tiles than were shown, not the same number.",
        explain: `Laid correctly, this ribbon takes ${length} tiles — more than the ${tilesShown} shown, since the gaps wasted room.`,
        answer: length,
      },
    },
  ];
};

/** Overlap flaw: more tiles counted than the true length. */
export const overlapMistakeQuestion = (ask: "trueLength" | "isCorrect"): TestQuestion[] => {
  const length = randInt(5, 10);
  const miscount = randInt(1, 2);
  const { tilesShown } = tileLayout(length, "overlap", miscount);
  const visual = <UnitRuler length={length} mode="overlap" miscount={miscount} tone="c" />;
  if (ask === "isCorrect") {
    return [
      {
        visual,
        difficulty: "medium",
        step: choice(
          { prompt: `A classmate laid tiles like this and counted ${tilesShown}. Is that the ribbon's real length?`, hint: "Look for tiles covering part of another tile.", explain: "No — the tiles overlap each other, so the count is wrong." },
          "No — the tiles overlap each other",
          ["Yes, that's correct", "No — there are gaps between them"]
        ),
      },
    ];
  }
  return [
    {
      visual,
      difficulty: "hard",
      step: {
        kind: "number",
        prompt: `A classmate laid tiles like this (overlapping) and counted ${tilesShown} tiles. How many tiles would it actually take, laid correctly with no gaps or overlaps?`,
        hint: "The overlaps covered some ground twice — the ribbon needs FEWER tiles than were shown, not the same number.",
        explain: `Laid correctly, this ribbon takes only ${length} tiles — fewer than the ${tilesShown} shown, since the overlaps double-covered ground.`,
        answer: length,
      },
    },
  ];
};

export const measuringWithUnitsTest: Unit["test"] = {
  questions: [
    () => cleanCountQuestion("short"),
    () => cleanCountQuestion("short"),
    () => cleanCountQuestion("wide"),
    () => cleanCountQuestion("wide"),
    () => gappedMistakeQuestion("isCorrect"),
    () => gappedMistakeQuestion("trueLength"),
    () => gappedMistakeQuestion("trueLength"),
    () => overlapMistakeQuestion("isCorrect"),
    () => overlapMistakeQuestion("trueLength"),
    () => overlapMistakeQuestion("trueLength"),
  ],
  passScore: 9,
};
