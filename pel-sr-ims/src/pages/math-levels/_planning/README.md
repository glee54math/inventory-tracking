# K-8 Curriculum Lab Plans — Index

This folder is a **Stage-0 curriculum plan**, not code. It exists so that
`.claude/skills/build-math-lab`'s "Stage 0" (standard → approved plan,
before handoff to the `math-lab-builder` subagent) is already done, in
writing, for every gap left in the K-8 CCSS coverage — see
`CCSS_K8_STANDARDS_REFERENCE.md` in this same folder for the full
transcribed standard text everything below is aligned to.

**Nothing in this folder is wired into the app.** Each `plan.md` is meant
to be handed to `math-lab-builder` later, as-is or lightly edited, when
that specific lab is ready to actually be built.

## How to use this folder

1. Pick a lab folder below.
2. Read its `plan.md` — it already has the full Stage-0 shape (standards,
   audience framing, per-unit goal/standard/buckets/CFU-gate/memorization
   flag, open questions).
3. Resolve any `[VERIFY]` or slot-contention flag it carries (see legend
   below) before building — a quick check against the named existing lab,
   or a decision conversation, as appropriate.
4. Hand the plan to `math-lab-builder` (via the `build-math-lab` skill, or
   directly) to actually build it.
5. Once built, update `VISUAL_COMPONENT_TODO.txt` and
   `src/utils/levelSubsections.ts` per their own existing conventions —
   this planning folder doesn't replace either of those, it only prepares
   the content that eventually goes into them.

## Legend

- **[NEW]** — clean gap; nothing today covers this standard.
- **[VERIFY]** — the plan explicitly flags a need to confirm against a
  named existing lab before building, since that lab's documented scope
  is ambiguous enough that outright duplication is a real risk.
- **[SLOT CONTENTION]** — the plan's proposed level-code slot is shared
  with another grade's proposals in this same folder (by design — grade
  slots overlap in this codebase's own `MATH_GRADE_LEVELS` map) and needs
  a build-time decision about final distribution.

## What's already built (left alone, not re-planned)

- **MG8** — `OneDigitDivisionLab` (4.NBT.6)
- **MG9** — `TwoDigitDivisionLab`, `MultiDigitMultiplicationLab` (4.NBT.5-6),
  `IntroToFractionsLab` (4.NF.1-3's "forms" sub-part, equivalence, comparing)
- **MG11** — `PowersOfTen` (5.NBT.1-2), `MultDivFractionLab` (fraction÷fraction,
  long division, decimal ops, GCF/LCM — standard-text ambiguous, see
  Grade-5 `[VERIFY]` flags below), `GeometryLab` (6.G.1-4: area, volume
  with fractional edges, coordinate plane, nets/surface area)
- **MM1** — `RatioLab` (6.RP.1-3), `NegativeNumbersLab` (6.NS.5-8, ordering
  only — not operations), `ExponentsAndExpressionsLab` (6.EE.1-4)

## Deferred

- **High school** (`MH1-6`, `MHG`, `MHT`) — see `HighSchool-PLACEHOLDER.md`.
  Scope for this round was K-8 only.

---

## Grade K — 4 labs, all `[NEW]` (MK1-4 were all empty)

| Lab | Slot | Standards | Notes |
|---|---|---|---|
| CountingAndCardinalityLab | MK1 | K.CC.1-7 | 4 units |
| AdditionSubtractionAndTeenNumbersLab | MK2 | K.OA.1-5, K.NBT.1 | 6 units; K.NBT.1 deliberately folded in as the capstone unit, not a bug |
| MeasurementAndClassifyingLab | MK3 | K.MD.1-3 | 3 units; no ruler/unit measurement at this grade by design (reserved for Grade 1+) |
| ShapesLab | MK4 | K.G.1-6 | 4 units |

## Grade 1 — 4 labs, all `[NEW]` (MG1-3 supersede legacy unwired components; MG4 was empty)

| Lab | Slot | Standards | Notes |
|---|---|---|---|
| AdditionAndSubtractionWithin20Lab | MG1 | 1.OA.1-8 | 5 units; supersedes MG1.tsx's unwired TenFrame |
| PlaceValueTo120Lab | MG2 | 1.NBT.1-6 | 4 units; supersedes MG2.tsx's unwired PartPartWhole |
| MeasurementTimeAndDataLab | MG3 | 1.MD.1-4 | 4 units; supersedes MG3.tsx's unwired MakeTenStrategy |
| ShapesAndFractionsIntroLab | MG4 | 1.G.1-3 | 3 units; MG4 was a completely empty stub |

## Grade 2 — 5 labs, all `[NEW]` (scoped around MG6's live wired components)

| Lab | Slot | Standards | Notes |
|---|---|---|---|
| PlaceValueTo1000Lab | MG5 | 2.NBT.1-4 | 4 units |
| ExtendingAdditionAndSubtractionLab | MG5 | 2.OA.2, 2.NBT.6-9 | 5 units; deliberately starts where MG6's live TwoDigitVisualAddition/VerticalAdditionSubtraction (2-digit only) leaves off |
| EvenOddAndArraysLab | MG5 | 2.OA.3-4 | 4 units; multiplication foundations |
| MeasurementMoneyAndDataLab | MG5 | 2.MD.1-10 | 6 units; **plan recommends splitting into 2 labs** (Length/Number-Line vs. Time/Money/Graphing) — see its Open Questions |
| ShapesAndEqualSharesLab | MG5 | 2.G.1-3 | 3 units |

Note: 2.OA.1 (within-100 word problems) isn't covered by any Grade-2 lab
above — the plan author believes it's already served by MG6's live
`BarModelPractice`; worth a quick confirmation at build time.

## Grade 3 — 7 labs, all `[NEW]` (scoped around MG6/MG7's live wired components)

| Lab | Slot | Standards | Notes |
|---|---|---|---|
| MultiplicationFoundationsLab | MG7 | 3.OA.1,3,5,7a,9 | 5 units; conceptual/fluency side, distinct from MG7's live algorithm component |
| DivisionAndWordProblemsLab | MG7 | 3.OA.2,4,6,7b,8 | 5 units; depends on MultiplicationFoundationsLab's facts as prerequisite |
| PlaceValueAndFluencyTo1000Lab | MG6 | 3.NBT.1-3 | 4 units; flags MG6 slot crowding (shares with grade 2 content) |
| FractionsFoundationsLab | MG6 or MG7 | 3.NF.1-3 | 5 units; direct prerequisite to MG9's existing IntroToFractionsLab, scope kept narrower than that lab's equivalence/comparing depth |
| TimeMeasurementAndDataLab | MG6 or MG7 | 3.MD.1-4 | 6 units |
| AreaAndPerimeterLab | MG6 or MG7 | 3.MD.5-8 | 5 units; 3.MD.7c distributive-property-via-tiling is a visual precursor to MM1_ExponentsAndExpressionsLab's later symbolic treatment |
| QuadrilateralsAndPartitioningLab | MG6 or MG7 | 3.G.1-2 | 3 units; soft sequencing preference after FractionsFoundationsLab |

## Grade 4 — 7 labs, all `[NEW]` (gap-fill around MG8/MG9's existing built labs)

| Lab | Slot | Standards | Notes |
|---|---|---|---|
| MultiplicativeComparisonAndWordProblemsLab | MG8 or MG9 | 4.OA.1-3 | 4 units |
| FactorsMultiplesAndPatternsLab | MG8 or MG9 | 4.OA.4-5 | 4 units; primes 1-20 flagged as the lab's one memorization fact |
| FractionOperationsLab | MG9 | 4.NF.3b-d, 4.NF.4, 4.MD.4 | 5 units; direct sequel to MG9's existing IntroToFractionsLab — assumes its Forms/Equivalence/Comparing/Simplifying units are already done |
| DecimalsLab | MG8 or MG9 | 4.NF.5-7 | 3 units |
| MeasurementConversionAndWordProblemsLab | MG8 or MG9 | 4.MD.1-3 | 4 units; conversion factors flagged as a memorization fact, same `reintroEverySolved` pattern as MM1_RatioLab's existing Conversion unit |
| AnglesAndProtractorLab | MG8 or MG9 | 4.MD.5-7 | 4 units; first angle-measurement content in the whole curriculum — sequence before LinesAnglesAndShapeClassificationLab |
| LinesAnglesAndShapeClassificationLab | MG8 or MG9 | 4.G.1-3 | 5 units; sequence after AnglesAndProtractorLab so acute/right/obtuse vocabulary is already familiar |

## Grade 5 — 7 labs; 3 carry a required `[VERIFY]` flag against MG11's existing labs

| Lab | Slot | Standards | Notes |
|---|---|---|---|
| AddingAndSubtractingFractionsLab | MG10 | 5.NF.1-2 | 5 units; clean gap |
| MultiplyingAndDividingFractionsLab | MG10 | 5.NF.3-7 | 5 units; division unit deliberately numerator-always-1, narrower than MG11_MultDivFractionLab's general fraction÷fraction |
| WholeNumberAndDecimalOperationsLab | MG10 | 5.NBT.3-7 | **[VERIFY]** 5 units; confirm against MG11_MultDivFractionLab's "long division"/"decimal operations" units (and possibly MG9_TwoDigitDivisionLab/MultiDigitMultiplicationLab) before building — may become new units on an existing lab instead of a standalone one |
| VolumeLab | MG10 | 5.MD.3-5 | **[VERIFY]** 4 units; confirm MG11_GeometryLab's fractional-edge Volume unit (6.G.2) doesn't already cover whole-number basics — likely a genuine gap but flagged |
| CoordinatePlaneAndShapeClassificationLab | MG10 | 5.G.1-4 | **[VERIFY]** 4 units; confirm first-quadrant-only 5.G.1-2 is distinct from MG11_GeometryLab's all-four-quadrant 6.G.3 unit — 5.G.3-4 classification hierarchy has no overlap, build with confidence |
| NumericalExpressionsAndPatternsLab | MG10 | 5.OA.1-3 | 5 units; order-of-operations work is a prerequisite thread to MM1_ExponentsAndExpressionsLab's later unit |
| MeasurementConversionAndLinePlotsLab | MG10 | 5.MD.1-2 | 4 units |

## Grade 6 — 3 labs, all `[NEW]` (gap-fill around MM1's existing built labs; note 6.RP/6.NS/6.EE.1-4/6.G are ALL already covered, just filed under MM1 or MG11, not here)

| Lab | Slot | Standards | Notes |
|---|---|---|---|
| OneVariableEquationsAndInequalitiesLab | MM2 | 6.EE.5-9 | 5 units; direct sequel to MM1_ExponentsAndExpressionsLab |
| StatisticalQuestionsAndVariabilityLab | MM2 | 6.SP.1-3 | 3 units; **first statistics content anywhere in K-8** — zero prior exposure to build on |
| DisplayingAndSummarizingDataLab | MM2 | 6.SP.4-5 | 6 units; direct sequel, sequence after StatisticalQuestionsAndVariabilityLab |

## Grade 7 — 7 labs, all `[NEW]` (MM2/MM3 were both empty)

| Lab | Slot | Standards | Notes |
|---|---|---|---|
| ProportionalRelationshipsLab | MM3 | 7.RP.1-3 | 6 units; check for overlap with MM1_RatioLab's TablesGraphs.tsx before building |
| OperationsWithRationalNumbersLab | MM3 | 7.NS.1-3 | 5 units; direct sequel to MM1_NegativeNumbersLab (ordering only → operations here) |
| ExpressionsAndEquationsLab | MM3 | 7.EE.1-4 | 5 units |
| ScaleDrawingsAndConstructionsLab | MM3 | 7.G.1-3 | 3 units; likely needs new shared diagram primitives (draggable triangle construction, prism/pyramid cross-section) |
| AnglesAreaCircumferenceAndVolumeLab | MM3 | 7.G.4-6 | 5 units; extends MG11_GeometryLab's area/volume to circles and composites |
| RandomSamplingAndInferencesLab | MM3 | 7.SP.1-4 | 4 units; depends on Grade 6's two statistics labs as prerequisite |
| ProbabilityLab | MM3 | 7.SP.5-8 | 5 units; **first probability content anywhere in K-8** |

## Grade 8 — 8 labs, all `[NEW]`, all carry `[SLOT CONTENTION]` (MM3 vs. Grade 7)

| Lab | Slot | Standards | Notes |
|---|---|---|---|
| IrrationalNumbersAndApproximationLab | MM3 | 8.NS.1-2 | 4 units |
| ExponentsRadicalsAndScientificNotationLab | MM3 | 8.EE.1-4 | 4 units; extends MM1_ExponentsAndExpressionsLab to integer/negative exponents |
| LinearEquationsAndProportionalRelationshipsLab | MM3 | 8.EE.5-7 | 4 units; cross-check against this grade's own FunctionsLab (both reach y=mx+b) |
| SystemsOfLinearEquationsLab | MM3 | 8.EE.8 | 4 units; sequence after LinearEquationsAndProportionalRelationshipsLab |
| FunctionsLab | MM3 | 8.F.1-5 | 5 units; first explicit "function" concept in the curriculum |
| TransformationsCongruenceAndSimilarityLab | MM3 | 8.G.1-5 | 5 units; confirmed via direct code read that MG11_GeometryLab has zero rotation/reflection/dilation content — no overlap |
| PythagoreanTheoremAndVolumeLab | MM3 | 8.G.6-9 | 4 units; confirmed MG11_GeometryLab's Volume unit is rectangular-prism-only — clean extension |
| BivariateDataAndScatterPlotsLab | MM3 | 8.SP.1-4 | 4 units; first two-variable statistics content |

**`[SLOT CONTENTION]` detail:** per `MATH_GRADE_LEVELS`, `MM3` serves both
grade 7 and grade 8, and all 15 labs across these two grades currently
propose it as their primary or fallback slot. `MH1` (grade 8's other
slot) is deliberately avoided since it will likely host Algebra I/Math I
content later (see `HighSchool-PLACEHOLDER.md`). Resolving this — likely
by splitting some Grade 7 content into `MM2` and reserving `MM3` more for
Grade 8, or vice versa — is real curriculum-sequencing work the
`build-math-lab` Stage-0 conversation should do per-lab at build time,
same as every other provisional slot in this index.

---

## Totals

- **52 lab plans** across 9 grade bands (K: 4, 1: 4, 2: 5, 3: 7, 4: 7,
  5: 7, 6: 3, 7: 7, 8: 8).
- **5 labs** carry an explicit `[VERIFY]` flag (all in Grade 5, against
  MG11's existing labs).
- **15 labs** (all of Grade 7 and Grade 8) carry an `[SLOT CONTENTION]`
  flag on the `MM3` level-code.
- **1 lab** (Grade 2's MeasurementMoneyAndDataLab) carries an explicit
  recommendation to split into two labs before building.
