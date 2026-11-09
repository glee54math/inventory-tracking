# All labs: fraction display is stacked (handwritten), scores read "N out of 10"

Date: 2026-11-09. Nothing has been committed. Scope: every lab except MG9 (already done) and MG10 (another agent's); nothing under `MG10/` was edited.

## Result

- Every lab shell (MK1–MK4, MG1–MG8, MG11 Mult/Div Fractions, MG11 Geometry, MM1 ×3) is wrapped in `<StackedFractions>`, the MG9 way. Every lab now shows **0** slash fractions and **0** "N/10" scores in the headless sweep.
- `npx tsc --noEmit -p tsconfig.app.json`: exit 0. eslint on every changed `.ts/.tsx` file: **0 errors** (224 warnings, all the existing `react-refresh/only-export-components` / unused-disable kind). (`git diff` also shows earlier, not-mine changes in shared files such as `TapSelect`, `UnitPreviewCarousel`, `FractionBar`, `NumberLine`, `TwoTierBars` and the CFU-gate/retry-debt edits in the shells; only the changes listed below are mine.)
- MG9 (6 labs) and MG10 re-swept after all changes: still **0**.

### Sweep counts (regex `\d+\s*/\s*\d+` over visible text, iPad 1024×768, touch, port 5237)

Walk per unit: Explore (every button/toggle), the CFU (wrong first, then combinations), Practice (every type; wrong, hint, wrong, Show answer), Unit Test + review, Module Test. Unit-test scores were seeded (testScore 2) so the "Best test score" badge is on screen and counted — that is why the K–5 "before" numbers are large: they are one badge counted on almost every screen.

| Lab | Before (hits) | After (hits / screens) |
|---|---|---|
| MG6 Fractions Foundations | 1,887 (1,869 fractions + 18 score)¹ | 0 / 296 |
| MM1 Ratio | 366 (345 + 21)¹ | 0 / 340 |
| MG11 Mult/Div Fractions | 206 (197 + 9)¹ | 0 / 174 |
| MG7 Quadrilaterals & Partitioning | 182 (170 + 12)¹ | 0 / 159 |
| MG8 Angles & Protractor | 160 (145 + 15)¹ | 0 / 223 |
| MG7 Time, Measurement & Data | 102 (87 + 15)¹ | 0 / 153 |
| MM1 Exponents & Expressions | 88 (71 + 17)¹ | 0 / 182 |
| MG11 Geometry Lab (own walker) | 67 (measured with stacking switched off) | 0 / 151 |
| MG6 Area & Perimeter | 18 score¹ | 0 / 165 |
| MG7 Division & Word Problems | 15 score¹ | 0 / 169 |
| MG7 Multiplication Foundations | 18 score¹ | 0 / 309 |
| MG8 Factors, Multiples & Patterns | 15 score¹ | 0 / 136 |
| MG8 Lines, Angles & Shape Classification | 15 score¹ | 0 / 239 |
| MG8 Multiplicative Comparison | 15 score¹ | 0 / 143 |
| MM1 Negative Numbers | 15 score¹ | 0 / 140 |
| MG8 One-Digit Division | score badge "x/10" (source) | 0 / 10 |
| MG6 Place Value & Fluency to 1000 | score badge "x/{total}" (source) | 0 / 132 |
| MK1 Counting & Cardinality | 141 score | 0 / 140 |
| MK2 Addition, Subtraction & Teen Numbers | 250 score | 0 / 216 |
| MK3 Measurement & Classifying | 95 score | 0 / 98 |
| MK4 Shapes | 196 score | 0 / 193 |
| MG1 Addition & Subtraction within 20 | 211 score | 0 / 218 |
| MG2 Place Value to 120 | 95 score | 0 / 113 |
| MG3 Measurement, Time & Data | 95 score | 0 / 104 |
| MG4 Shapes & Fractions Intro | 160 score | 0 / 153 |
| MG5 Even/Odd & Arrays | 72 score | 0 / 90 |
| MG5 Extending Addition & Subtraction | 113 score | 0 / 121 |
| MG5 Measurement, Money & Data | 208 score | 0 / 233 |
| MG5 Place Value to 1000 | 116 score | 0 / 116 |
| MG5 Shapes & Equal Shares | 129 score | 0 / 135 |
| MG9 ×6 / MG10 (re-check) | 0 | 0 (MG9 FOP 386, Intro 121, Decimals 170, Measurement 278, Mult 28, Div 14 screens; MG10 240 screens) |

¹ "Before" for these labs is the MG9 task's sweep (same code, 1 practice draw; listed in `MG9_FractionDisplay/fixes.md`).

- MK1–MK4 / MG1–MG5: the only slash text was score text ("Best test score: 2/10", the result "6/15", "aim for 9/10"). MG4 Shapes & Fractions Intro and MG5 Shapes & Equal Shares name fractions in words ("halves", "fourths") and had **no** slash fractions.
- The sweep also lists every stacked fraction it saw. Labs with no fractions show 0 stacked (no false positives); fraction labs show only real fractions (and a student's own typed answer in a test review, e.g. "3 3/3").

## What changed

### 1. Every lab opted in (shell)
Same as MG9: `<StackedFractions>` inside the lab-base div; hero heading/paragraph, path goals, unit goal and key idea through `<MathText>` (inside `ReadAloud` for the K–5 shells); "Best test score: N out of {total}". The shared `UnitTest` already writes "2 out of 10" / "aim for 9 out of 10" inside the provider.
- Shells: `MK1_…`, `MK2_…`, `MK3_…`, `MK4_…`, `MG1_…`, `MG2_…`, `MG3_…`, `MG4_…`, `MG5_` ×5, `MG6_` ×3, `MG7_` ×4, `MG8_` ×5, `MG11_MultDivFractionLab`, `MG11_GeometryLab`, `MM1_` ×3 (`*Lab.tsx`).
- MG7 Quadrilaterals hero paragraph ("…fractions like 1/4") wrapped in `MathText`.

### 2. Stacked-fraction CSS (MG9's block)
`MG6_FractionsFoundationsLab_styles.css`, `MM1_RatioLab_styles.css`, `MM1_ExponentsAndExpressionsLab_styles.css`, `MG7_QuadrilateralsAndPartitioningLab_styles.css`, `MG7_TimeMeasurementAndDataLab_styles.css`, `MG8_AnglesAndProtractorLab_styles.css` (each also got the base `.frac` rule), `MG11_MultDivFractionLab_styles.css` (had `.frac`). Score-only labs need no CSS. Geometry's existing `.frac` rule already styles the stacked spans.

### 3. Hand-written text through `MathText`
Every component in these folders that returns JSX now wraps its top-level return in `<MathText>` (Explore, CFU questions, previews, diagrams with HTML text):
- MG6 Fractions Foundations `units/` (all 5 units + `FractionsEqualToWholeNumbersTest`).
- MM1 Ratio `units/` (6 units) and `diagrams/RatioTable`, `diagrams/ConversionChain`.
- MG11 Mult/Div `units/DecimalOperations`, `FactorsMultiples`, `FractionDivision`, `FractionDivisionTest`.
- MG7 Quadrilaterals `units/` + `diagrams/AreaPartition`, `QuadBuilder`, `QuadTile`.
- MG7 Time `units/` + `diagrams/` (Clock, GraduatedContainer, InchRuler, LinePlot, ScaledBarChart, ScaledPictureGraph, ScaleGauge).
- MG8 Angles `units/` (incl. `cfuParts`) + `diagrams/AngleFigure`, `Protractor`, `pictures`.
- MM1 Exponents `units/` (5 units).
- MG11 Geometry `components/ui.tsx` (StepSolver, Workbench, Segmented, Slider, Toggle) and `modules/` (Area, Coordinate, Nets, Volume, WordProblems).

### 4. SVG labels (shared `SvgMath` / `SvgMathLine`)
- MG6 `diagrams/PartsCircle.tsx`: the "3/4" caption is stacked (label row 34 px instead of 22), aria-label spoken ("3 over 4").
- MG11 `diagrams/AreaRectangle.tsx`: "Area = 1/6", "length = 1/3 mi", "width = 2/7 mi" stacked; viewBox taller/wider so they fit; aria-label spoken.
- MG11 `diagrams/FractionMeasureStrip.tsx`: "3/4 cup — what you have", "4/5-cup servings", the leftover cell and "last one is only 5/9 of a serving" stacked; rows taller.
- MM1 `diagrams/DoubleNumberLine.tsx`: tick labels ("3/4", "1 1/2") stacked when stacking is on; more room and a bigger stagger step only when a label is a fraction.
- MM1 `diagrams/TapeDiagram.tsx`: cell values ("1/3") and fraction totals stacked; taller bracket row only when a total has a fraction.
- MG11 Geometry `shapes/primitives.tsx` `Label`: a string label with a fraction ("1 1/2 ft" on prisms) is drawn with `SvgMathLine`.
- MG11 SharingBars captions already go through the shared `TwoTierBars` (stacked since MG9).

### 5. Dropdowns of fractions → tap buttons
- MG7 Quadrilaterals CFU Q2 ("…so each one is 1/4") and MG7 Time line-plot CFU Q2/Q3 ("exactly 3 1/4", "2 1/2 — that's the length") are now the shared `TapSelect`. Same values, same grading.

### 6. Typed fraction answers → handwritten boxes (new opt-in `NumberStep.fracBoxes`)
A typed answer like "1/3" used to need the slash, and the prompts said "(Type it like 1/3.)". Now the step shows a top box over a bar over a bottom box (`"mixed"` adds a whole-number box). The boxes are joined back into the exact text the student would have typed ("1/3", "2 1/4", or just "2"/"0.5" when the bottom box is empty), so the checker, accepted answers and feedback are unchanged. Verified headless: "1/8" in the boxes is accepted, the review list shows the answer stacked.
- `fraction`: every `frac: true` step in MG11 FractionDivision (+Test), MG7 PartitioningEqualAreas (+Test), MM1 EvaluatingExpressions (+Test), MM1 Conversions (+Test).
- `mixed`: MG7 Time "How long is the …, to the nearest 1/4 inch?" (+Test); MM1 UnitRate "How many … go with 1 …?" (+ UnitRateTest trail-mix question).
- MG11 FractionDivisionTest "prove it" (box / box after "c/d ×") uses the new opt-in `RatioStep.stacked` (box over box). Same grading, including the equivalent-fraction hint.

### 7. Letter fractions
"a/b" is a fraction a student reads, so it is now a `<Frac>`: MG11 key idea and hint "(a/b) ÷ (c/d) = (a×d)/(b×c)", MM1 UnitRate key idea "the unit rate is a/b", MG6 number-line preview "lands you at a/b".

### 8. MG11 Powers of Ten (skill, not a "Lab" file)
The word problem "Canada has about 1/10 as many people" and its hint use a local stacked `OneTenth` (Tailwind classes, `data-tts-say="1/10"`, aria "1 over 10"). Not walked headless (the harness only mounts `*Lab.tsx`); tsc/eslint clean.

## Wording changes (only where a fraction had to render)
- MG7 Quadrilaterals (3 prompts): "(Type it like 1/3.)" → "(Type the top and bottom numbers.)"
- MG7 Time (2 prompts): "(Type like 2 1/4.)" → "(Type the whole number and the fraction.)"
- MG11 Geometry StepSolver message: "Type a number, like 12, 7.5, 3/4 or 1 1/2." → "Type a number, like 12 or 7.5. For a fraction, type the top number, a slash, then the bottom number." (Geometry keeps one typed box.)
- MG11 Geometry Volume hint: "How many 1/{d}s make …" → "How many copies of 1/{d} make …" (a letter right after a fraction blocks stacking).
- MG6 Fractions Foundations practice-type button: "Name it (a/b)" → "Name the fraction".
No math, questions, answers or grading changed.

## Shared-code changes (all opt-in; nothing changes outside `<StackedFractions>` or without the new flag)
| File | Change |
|---|---|
| `shared/engine/controls.tsx` | `QA`/`QB`/`QC`, `Says`, `Segmented` option labels and `Slider` label/display render through `MathText` (a no-op outside the provider). |
| `shared/engine/StepProblem.tsx` | Problem `visual` goes through `MathText` (MM1 Exponents' "A = 6s², s = 1/2" picture). New `NumberStep.fracBoxes` input. New `RatioStep.stacked` input; `answerText` writes "c/d × q/r = a/b" for it. |
| `shared/engine/UnitTest.tsx` | Test and review `visual` through `MathText`; review "Your answer" for `RatioStep.stacked` reads "top/bottom". |
| `shared/engine/types.ts` | `NumberStep.fracBoxes?: "fraction" \| "mixed"`, `RatioStep.stacked?: boolean`. |
| `MATH_TSX_STYLE_GUIDE.txt` | A short paragraph in the stacked-fractions entry about the above. |

MG9 and MG10 don't set the new flags; their text through the new `MathText` spots already had no slash fractions, and both re-swept at 0. I re-read each shared file right before editing it.

## Read-aloud
- Stacked fractions carry `data-tts-say="2 1/4"` (read by `mathSpeech.ts` as "2 and 1 fourth"); screen readers get "2 and 1 over 4". Diagram aria-labels I touched go through `spokenFractions`.
- K–1 labs (MK1–MK4, MG1): the only change is "N out of 10" and goal/key-idea text wrapped in `MathText` inside the existing `ReadAloud` (no fractions there, so the read text is unchanged). Screenshot check: MK1 test review shows "2 out of 10" with every speaker button in place.

## Left as slash / not changed on purpose
- Rates written with words: "mi/hr" (MM1 Conversions "50 mi/hr × 3/2 hr" — the 3/2 stacks, "mi/hr" stays).
- Ratios written "a:b" / "3 : 4" and "for every … there are …" frames (MM1 Ratio) and time "4:30".
- The empty placeholder "n/d" in typed fraction boxes that don't use `fracBoxes` (letters, not a number).
- Unicode vulgar fractions already in the Geometry lab ("½·b·h", "2½ × 1½", "3¾") — single glyphs, not slash text.
- Code comments, star-band notes, aria-labels not shown on screen.
- No dates or URLs were found in visible lab text.

## Couldn't fully check / pre-existing
- The walker gets stuck on a few custom widgets (MG7 Time U1 Test Q9 clock-setting and Module Test Q5; MM1 Ratio U4 test results timed out once), so those test reviews were swept partly. All visible text before the stuck point was swept.
- MG7 Time's measure step shows its solved answer chip as a decimal ("2.25 in") — that is the existing `answerText` for a non-`frac` number step, not slash text; unchanged.
- Powers of Ten not walked (see §8).

## How it was checked
- Temporary harness (`__harness_allfrac.html` + `src/__harness_allfrac.tsx`) + Vite on 5237, headless Edge (playwright-core), 1024×768, touch. Both harness files deleted and the server stopped afterwards.
- Scripts and results: `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\6c39f246-04b5-4582-9603-1a614c7f0c61\scratchpad\allfrac\` (`sweep.mjs`, `geo.mjs`, `boxes.mjs`, `sweep-*.json`, `before-saved\`).
- Screenshots looked at: `shots-after1-ff\u1-explore-end.png`, `u5-explore.png` (MG6 FF: stacked key idea, PartsCircle label, CFU); `shots-after2-MG11_MultDivFractionLab\u1-p1-end.png` (AreaRectangle labels, stacked chips); `shots-after3-MM1_RatioLab\u2-explore.png` (double number line + tape diagram); `shots-after3-MG7_TimeMeasurementAndDataLab\u6-p1-end.png`; `shots-boxes\mg7time-mixed-boxes-checked.png`, `mg7quad-frac-boxes.png` (new answer boxes); `shots-geo-after1\1-Volume.png` (Geometry prism labels); `shots-afterK-MK1_CountingAndCardinalityLab\u2-test-review.png` ("2 out of 10").
- `scripts/seedMathLabPlanningItems.mjs` was not touched or staged.
