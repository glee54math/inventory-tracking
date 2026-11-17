# Lab review status — which labs have been through the workflow

The one place to see where every lab stands. Update it whenever a lab is
built, reviewed, fixed, or gets an all-labs change (the build-math-lab skill
does this at Stage 1 and Stage 6).

**The app reads this file.** The "Lab review status" board on Mr. Lee's All Levels
page (`src/pages/admin-review-status/`) parses the Labs table below and the
report file names in each review folder. Keep the table's columns and the
wording that starts each cell ("Done (N rounds)", "Partial", "Not started";
"Done", "Pilot", "n/a"), or the board will mislabel the row.

**The workflow** (`.claude/skills/build-math-lab/SKILL.md`): build → curriculum
checker + English checker → merged fix list → fixer → repeat until no
Blocker/Major (max 3 rounds) → summary + rule changes. Reports live in
`_planning/reviews/{Level}_{LabName}/`.

**Order for an existing lab:** run the review workflow on it. The CFU
"Look here" pointer is now a rule in the builder, fixer and curriculum
checker, so the review adds or checks the pointers as part of the fix rounds.
Don't add pointers to an unreviewed lab as a separate job first; it would
then be reviewed and changed again.

## Status key
- **Review:** `Done (N rounds)` = full workflow + summary.md · `Partial` = some
  fix pass, no curriculum + English review · `Not started`
- **CFU pointer:** `Done` · `Pilot` (added before review) · `—` not yet ·
  `n/a` (no CFU)

## Labs

| Level | Lab (folder) | Shown as | Review | CFU pointer | Notes |
|---|---|---|---|---|---|
| MK1 | CountingAndCardinalityLab | Counting & Cardinality | Not started | — | K-friendly CFU (KCheck) done |
| MK2 | AdditionSubtractionAndTeenNumbersLab | Addition, Subtraction & Teen Numbers | Not started | — | K-friendly CFU (KCheck) done |
| MK3 | MeasurementAndClassifyingLab | Measurement & Classifying | Not started | — | K-friendly CFU (KCheck) done |
| MK4 | ShapesLab | Shapes Lab | Not started | — | K-friendly CFU (KCheck) done |
| MG1 | AdditionAndSubtractionWithin20Lab | Addition & Subtraction Within 20 | Not started | Pilot (2026-11-16) | Pointer approved by user 2026-11-17. Making Ten fixed to bigger/smaller (break apart the smaller). Review round 1 running. CFUs still the older all-at-once layout |
| MG2 | PlaceValueTo120Lab | Place Value to 120 | Not started | — | |
| MG3 | MeasurementTimeAndDataLab | Measurement, Time & Data | Not started | — | |
| MG4 | ShapesAndFractionsIntroLab | Shapes & Fractions | Not started | — | |
| MG5 | EvenOddAndArraysLab | Even/Odd & Arrays | Not started | — | |
| MG5 | ExtendingAdditionAndSubtractionLab | Extending Addition & Subtraction | Not started | — | |
| MG5 | MeasurementMoneyAndDataLab | Measurement, Money & Data | Not started | — | |
| MG5 | PlaceValueTo1000Lab | Place Value to 1000 | Not started | — | |
| MG5 | ShapesAndEqualSharesLab | Shapes & Equal Shares | Not started | — | |
| MG6 | AreaAndPerimeterLab | Area & Perimeter | Not started | — | |
| MG6 | FractionsFoundationsLab | Fractions Foundations | Not started | — | |
| MG6 | PlaceValueAndFluencyTo1000Lab | Place Value & Fluency to 1000 | Not started | — | |
| MG7 | DivisionAndWordProblemsLab | Division & Word Problems | Not started | — | |
| MG7 | MultiplicationFoundationsLab | Multiplication Foundations | Not started | — | |
| MG7 | QuadrilateralsAndPartitioningLab | Quadrilaterals & Partitioning | Not started | — | |
| MG7 | TimeMeasurementAndDataLab | Time, Measurement & Data | Not started | — | |
| MG8 | AnglesAndProtractorLab | Angles & Protractor | Not started | — | |
| MG8 | FactorsMultiplesAndPatternsLab | Factors, Multiples & Patterns | Not started | — | |
| MG8 | LinesAnglesAndShapeClassificationLab | Lines, Angles & Shape Classification | Not started | — | |
| MG8 | MultiplicativeComparisonAndWordProblemsLab | Multiplicative Comparison & Word Problems | Not started | — | |
| MG8 | OneDigitDivisionLab | One-Digit Division | Not started | n/a | One unit, free-play Explore, no CFU |
| MG9 | DecimalsLab | Decimals | Not started | — | |
| MG9 | FractionOperationsLab | Fraction Operations | Not started | — | Has its own copy of DropdownQuestion (units/cfu.tsx) |
| MG9 | IntroToFractionsLab | Introduction To Fractions | Partial (1 fix pass, 2026-11-15) | — | Self-audit vs. builder rules only; `reviews/MG9_IntroToFractionsLab/round-1-fixes.md` |
| MG9 | MeasurementConversionAndWordProblemsLab | Measurement Conversion & Word Problems | Not started | — | |
| MG9 | MultiDigitMultiplicationLab | Multi-Digit Multiplication | Not started | n/a | One unit, free-play Explore, no CFU |
| MG9 | TwoDigitDivisionLab | Two-Digit Division | Not started | n/a | One unit, free-play Explore, no CFU |
| MG10 | AddingAndSubtractingFractionsLab | Adding & Subtracting Fractions | Done (6 rounds incl. user requests) | — | Reviewed before the pointer rule; needs pointers |
| MG10 | NumericalExpressionsAndPatternsLab | Expressions & Patterns | Done (3 rounds) | — | Reviewed before the pointer rule; needs pointers. Open: U3 CFU Q2 "The question asks…" → "The blank asks…" |
| MG10 | WholeNumberAndDecimalOperationsLab | Decimal Place Value & Rounding | Done (2 rounds) | Done (2026-11-16) | Units 1–2 only; Units 3–5 on hold. Pointer pilot lab |
| MG11 | GeometryLab | Geometry Lab | Not started | — | |
| MG11 | MultDivFractionLab | Fractions, Decimals & Factors | Not started | — | |

## All-labs changes (applied outside the review workflow)
| Date | Change | Scope | Report |
|---|---|---|---|
| 2026-11-08/09 | Every fraction stacked; scores read "N out of 10" | All labs | `reviews/MG9_FractionDisplay/`, `reviews/AllLabs_FractionDisplay/` |
| (earlier) | Passed CFU stays open until leaving Explore (cfuJustPassed latch) | All lab shells | — |
| (earlier) | K-friendly one-at-a-time CFU (KCheck) | MK1–MK4 | — |
| 2026-11-16 | No grade references in student text | MG1–MG9 checked; 1 fixed (MG9 Measurement, Area & Perimeter Formulas) | — |
| 2026-11-16 | CFU "Look here" pointer rule added to builder, fixer, curriculum checker | Rule only; labs updated through review | `reviews/CFU_Pointer_Rollout/README.md` |
