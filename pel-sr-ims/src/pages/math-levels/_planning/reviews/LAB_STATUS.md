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
| MK2 | AdditionSubtractionAndTeenNumbersLab | Addition, Subtraction & Teen Numbers | Done (3 rounds, 2026-11-21) | Done (2026-11-21) | KCheck CFUs (19/25 typed), 25 pointers. User decisions: how-many-more = optional U2 challenge (no stars, no Tests); start-unknown removed; U2 retry random add/take away; shorter unit titles; Module stars 28/25/22/19/10 (0–9 = none), passes at 28 (5 stars). Round 3 fixes verified by fixer only. Open: sticky bar + read-aloud toolbar overlap (shared); real-iPad check |
| MK3 | MeasurementAndClassifyingLab | Measurement & Classifying | Done (3 rounds, 2026-11-21) | Done (2026-11-21) | KCheck CFUs (6/15 typed), 15 pointers. User decisions: reference block + clear objects; tall = standing rod; differences = count ringed extras; blue/orange scale sides; Module stars 14/12/10/8/6 (0–5 = none); Standard line kept. Round 3 fixes verified by fixer only. Open: same-spot retry passes 9 two-button CFU picks (accepted); CFUs don't auto-read (shared KCheck unchanged); sound banner over pad (shared); real-iPad check incl. 🪵 🪨 🪶; rule changes await approval |
| MK4 | ShapesLab | Shapes Lab | Done (3 rounds, 2026-11-26) | Done (2026-11-26) | KCheck CFUs with pointers on every question. User decisions: real Unit 4 building (join clay balls, choose spot, turn pieces); real-object shape buckets in U1–U2; reverse-position item kept, reworded; sides + corners taught in U1 Explore; "Flat (2D)/Solid (3D)" and "sticks" kept. Shared changes: early-lab Test layout + scroll (upright and sideways), custom-step own wrong-try reason. Round 3 fixes verified by fixer only. Open: iOS "2D" voice; 24-tap cube build; real-iPad check |
| MG1 | AdditionAndSubtractionWithin20Lab | Addition & Subtraction Within 20 | Done (3 rounds, 2026-11-17) | Done (2026-11-17) | KCheck CFUs one at a time (24/33 typed); pointer 2nd miss, show-it 3rd; Making Ten = break apart the smaller. Optional U4 challenge (no stars, no retry lock). Rule changes approved + added. Open: real-iPad check; tried-button focus outline; challenge "Next problem" grey after helped solve; other shells' "Complete the activity above…" line; MG11 sticky hover |
| MG2 | PlaceValueTo120Lab | Place Value to 120 | Done (3 rounds, 2026-11-17) | Done (2026-11-17) | Treated as K–1: early-learner shell + KCheck CFUs (18/21 typed). User decisions 2026-11-17: new-ten item kept, 100–120 "How many?" bucket added (grouped 10 sticks), pass 9/10 kept, ☐ = voice "blank"/text "box", KCheck title + Test signs OK (`user-decisions-fixes.md`). 2026-11-18: Unit 1 + Unit 4 Test charts removed (they showed the answer). Rule changes decided; first `vocabulary.md` |
| MG3 | MeasurementTimeAndDataLab | Measurement, Time & Data | Not started | — | |
| MG4 | ShapesAndFractionsIntroLab | Shapes & Fractions | Not started | — | |
| MG5 | EvenOddAndArraysLab | Even/Odd & Arrays | Not started | — | |
| MG5 | ExtendingAdditionAndSubtractionLab | Extending Addition & Subtraction | Not started | Done (2026-11-19) | Pointers added outside a review (text-line style, 5 units). Explore defaults moved off CFU numbers; "Not quite" no longer gives answers; U5 trade slider fixed (could not reach 10 tens). Still open: CFUs are 4-at-once + all dropdowns (1 typed box) — needs one-at-a-time + ≥40% typed via full review |
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
| 2026-11-17 | Floating number pad moved off the unit list on wide screens (>860px) + scroll room above it; Test pictures no longer sticky (stopped sliding over the question) | All early labs using the floating pad (MG1, MG2); Test layout in all labs | `shared/styles/lab-base.css`, `shared/components/NumberPad.tsx` |
| 2026-11-18 | Lab order: `LAB_NEEDS` (draft) in `utils/levelSubsections.ts`; students get a "This lab is easier after …" nudge + Next up / Finished / Try first in the lab picker (never locked); finished = Module Test passed or Mr. Lee's PIN mark. Vocabulary lists for MK1–MK4, MG1, MG2. "Lab order & vocabulary" board on All Levels | All labs (student portal) | `utils/labOrder.ts`, `pages/admin-lab-map/` |
| 2026-11-18 | Voice reads ⭐ as "star" ("You got a ⭐!" was "You got a") | All labs | `shared/tts/mathSpeech.ts` |
| 2026-11-18 | Rules from the MG2 review: MG2–MG4 are K–1; one question at a time in every K–5 CFU; Test pictures must not give the answer away; bold color matching (plain only when color is the answer); per-lab `vocabulary.md` word lists; + English traps | Rules only; labs updated through review. Most labs need a `vocabulary.md` and a check against the new rules | `reviews/MG2_PlaceValueTo120Lab/summary.md` (Rule decisions) |
| 2026-11-23 | No star after a hint or any wrong try. "Try one like it" rule unchanged (one hint or one wrong typed try does not owe a retry). Stars already earned are kept | All labs | `shared/engine/StepProblem.tsx`; `reviews/MK2_AdditionSubtractionAndTeenNumbersLab/summary.md` (D5) |
| 2026-11-23 | Module Test stars now use one percent rule; 10-question tests get a more lenient scale and pass at 5 stars (MG10 Decimal module and MG11 Fraction Division Test moved from 8 to 9). MK3 keeps its approved bands | 33 of 34 labs | `shared/engine/moduleStars.ts` |
| 2026-11-23 | MK2 rule decisions: 13 of 16 proposed rules added (2 and 9 on 2026-11-24), 3 declined | Builder + English guidelines | `reviews/MK2_AdditionSubtractionAndTeenNumbersLab/summary.md` (Rule decisions) |
| 2026-11-24 | Practice help ladder for every lab: hint opens on the 1st wrong try; "Show me" after the 2nd wrong try on a step (replaced "Show answer" after the 3rd for MG3+). A tapped "Show hint" now costs the star AND requires "Try one like it"; 2 wrong tries on a step require it in every lab. "Try one like it" is now required in every lab (builder, checker, fixer); MG3–MG9, MG11, MM1 still need it added. Voice reads a slash between words as "or" | All labs (engine); retry needs shell work in 9 levels | `shared/engine/StepProblem.tsx`, `shared/tts/mathSpeech.ts`; `reviews/MK3_MeasurementAndClassifyingLab/summary.md` (Rule decisions) |
| 2026-11-24 | Glossary board on All Levels (terms + levels that use them); updated at each Stage 6 | Admin page | `pages/admin-glossary/` |
| 2026-11-24 | Every Module Test passes at 5 stars (30 → 28, 25 → 23, 20 → 19, 15 → 14, 10 → 9). Students with a saved score below the new line no longer count as passed. MK3 not changed yet (user deciding separately) | 33 of 34 labs | `shared/engine/moduleStars.ts` |
| 2026-11-26 | Early-learner Tests fit the screen: MK2's landscape layout moved to `lab-base.css` `.lab-early` (plus picture-left layout), and `UnitTest` scrolls the whole question into view upright and sideways (fixed portrait in MK1, MK3, MK4, MG1, MG2 and a cut-off MG2 picture). Custom Practice steps can give their own wrong-try reason and clear it on the next tap. 6 MK4 rules added, 6 declined | MK1–MK4, MG1, MG2 (layout); engine (all labs, used by MK4 only) | `reviews/MK4_ShapesLab/summary.md` |
