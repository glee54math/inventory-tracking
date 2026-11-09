# MG9 fraction display: every fraction is stacked (handwritten)

Date: 2026-11-08. Nothing has been committed.

## Result

- In all six MG9 labs, every fraction a student sees is now stacked: the numerator over a bar over the denominator, with a mixed number written as a whole number beside a stacked fraction. This covers stories, prompts, hints, feedback, choices, CFUs, Explore, keys, review lists and diagram labels.
- Visible-text sweep (regex `\d+\s*/\s*\d+`, iPad 1024×768, touch):

| Lab | Before (hits / screens) | After (hits / screens) |
|---|---|---|
| Fraction Operations | **3,867** / 670 | **0** / 728 |
| Intro to Fractions | **477** / 188 | **0** / 189 |
| Decimals | **829** / 255 | **0** / 250 |
| Measurement Conversion & Word Problems | **56** / 453 | **0** / 453 + 167 |
| Multi-Digit Multiplication, Two-Digit Division | only score text ("2/10") | now "2 out of 10" (no full walk) |

  - Fraction Operations "before", by part: Unit 1: 411, Unit 2: 397, **Unit 3: 613**, Unit 4: 601, Unit 5: 1,648 (partial walk), Module Test: 195.
  - The first "after" run left 2 strings. Both are fixed, and their units were swept again with 0 hits:
    - Fraction Operations, Unit 5 CFU feedback: "the three 3/4s". A fraction with a letter right after it can't be stacked.
    - Measurement, "3/4 km" on a tape-diagram label.
- `npx tsc --noEmit -p tsconfig.app.json`: exit 0.
- eslint on every changed file: 0 errors. There are 49 warnings, all the existing `react-refresh/only-export-components` pattern.
- Read-aloud still says fractions as words:
  - `StackedNumber`/`Frac` carry `data-tts-say="2 3/4"`, which `mathSpeech.ts` reads as "2 and three fourths".
  - Screen-reader labels use `spokenFraction(s)` ("3 over 4").
  - Diagram aria-labels that I touched now go through `spokenFractions`.

## Root cause: why Unit 1 looked right and Unit 3 didn't

- **The MG9 labs were never opted in to stacking.** The stacking tools (`<StackedFractions>` + `<MathText>`) are opt-in per lab, and only MG10 had turned them on. In MG9, `MathText` returned text unchanged, so any fraction stored as a **string** printed as "1/2".
- **Unit 1 only *looked* fine.** Its main Explore equation, CFU questions and key idea were hand-written as JSX `<Frac n d />` components, which draw stacked by themselves. The sweep still found 411 slash fractions in Unit 1, in less visible places:
  - hints and CFU feedback strings
  - dropdown options ("an eighth (1/8)")
  - the "ways you've found" list
  - number boxes with "/6" printed after them
- **Unit 3 builds its text from template strings.** `mixedText()` / `amountWords()` produce "1 3/4 yards". Its story, its equation line (`{mixedText(x,d)} + …`), the pizza labels passed as string props, and its key idea text all printed as slash text.

## What changed

### 1. Labs are opted in (all six MG9 shells)
- **Files:** `MG9_FractionOperationsLab.tsx`, `MG9_IntroToFractionsLab.tsx`, `MG9_DecimalsLab.tsx`, `MG9_MeasurementConversionAndWordProblemsLab.tsx`, `MG9_MultiDigitMultiplicationLab.tsx`, `MG9_TwoDigitDivisionLab.tsx`
- Each lab's content is wrapped in `<StackedFractions>`, the same way as MG10.
- The hero heading, path goals, unit goal and key idea go through `<MathText>`.
- The best-score badge reads "N out of 10". Unit and module test scores also read "2 out of 10" / "aim for 9 out of 10", through the existing shared `outOf`.

### 2. Stacked-fraction CSS (4 lab stylesheets)
- **Files:** `MG9_FractionOperationsLab_styles.css`, `MG9_IntroToFractionsLab_styles.css`, `MG9_DecimalsLab_styles.css`, `MG9_MeasurementConversionAndWordProblemsLab_styles.css`
- Copied from MG10's block: `.frac-text` (a mixed number stays on one line), taller line height in text blocks, a box over a printed denominator, and a dropdown or box used as a numerator.
- Measurement also got the base `.frac` rule, which it didn't have.

### 3. Explore, CFU and diagram text (wrapped in `<MathText>`)
- `MathText` doesn't walk into components, so each component that renders hand-written text wraps its own JSX:
  - Fraction Operations: every `Explore`, `*Check` and walkthrough component, plus `TwoWholes` and `BuildPlot`.
  - Intro to Fractions: every `Explore`.
  - Decimals: every `Explore` and `*Check`.
- `<QA>{whole} {leftover}/{den}</QA>` (FractionForms, FractionFormsTest) now wraps its children in `<MathText>`.
- HTML captions now go through `MathText`: `GridRow` (Decimals), and `WholePlusPartBar` / `WholePlusPartCircles` (Intro).

### 4. Answer boxes that had "/d" printed after them
- **`lib/steps.tsx` `amountStep`** (used by most Fraction Operations practice and tests):
  - Less than 1 whole: the numerator box sits over the printed denominator (new `NumberStep.overDen`).
  - A mixed number: a whole-number box plus a numerator box over the denominator (`SentenceStep.overDen`, the MG10 mechanism). The unit word stays after it ("yards").
- **The same fix in 18 more places:**
  - Every `suffix: \`/${d}\`` in a number step became `overDen: d`: AddSubtract, Decomposing, MultiplyFractionByWhole and their tests, and FractionFormsTest.
  - Every sentence ending in "/d" or "/100" became `overDen` (Fraction Operations, Decimals).
- **Decimals "box / box" steps** ("0.16 = [ ] / [ ]") use the new `SentenceStep.stacked`, so the two boxes are drawn as one fraction.
- **Grading is unchanged everywhere.** The same boxes hold the same numbers, and the answer text still reads "3/8" (shown stacked).

### 5. CFU dropdowns
- **Fraction choices are tap buttons.**
  - Fraction Operations uses the shared `DropdownQuestion`, which already switches to `TapSelect` inside `<StackedFractions>`.
  - The hand-built Decimals CFU (Tenths Q2, "the right total") was a native `<select>` of fractions. It is now a `TapSelect`, which ignores taps once that question is passed (the select was `disabled` then).
- **A dropdown followed by "/6", "/4" or "/100"** became the numerator of a stacked fraction: `<Frac n={box} d={6} />`. This affects 7 Fraction Operations CFU lines and Decimals Tenths Q4. Whole-number dropdowns stay native selects.

### 6. SVG diagram labels
- `FracLinePlot` tick labels ("1 3/8") use the shared `SvgMath`. The plot is 8 px taller to make room.
- `FractionNumberLine` (Intro) tick labels use `SvgMath`. The line is 12 px taller.
- `TapeBar` (Measurement) part labels use `SvgMathLine`.

### Wording changes (only where needed for stacking)
- FractionLinePlots CFU Q2 feedback: "add the numerators of the three 3/4s" became "…of the three **copies of 3/4**". A letter right after a fraction blocks stacking.
- The FracLinePlot hover tooltip now says "Add a dot at 1 and 3 over 8".
- No math, answers or other wording changed.

## Shared-code changes (all opt-in, and none of them change other labs)

| File | Change | Why other labs are unaffected |
|---|---|---|
| `shared/components/SvgMath.tsx` (**new**) | `SvgMath` (copied from MG10's lab-local copy, the "promote on second consumer" rule), `SvgMathLine` (a caption line with words plus stacked fractions; text widths are measured after render), `isSvgFraction` | New file. MG10 keeps its own identical copy; I didn't touch MG10 and it can switch later. |
| `shared/engine/types.ts` | `NumberStep.overDen?: number`; `SentenceStep.stacked?: boolean` | Only steps that set them render differently. |
| `shared/engine/StepProblem.tsx` | `answerText` adds "/d" for `overDen` and writes "top/bottom" for `stacked`; the number input draws the box over the denominator for `overDen`; a `stacked` sentence draws blank 1 over blank 2 | Same as above. |
| `shared/engine/UnitTest.tsx` | The review list's "Your answer" shows "/d" for `overDen` and "a/b" for `stacked` | Same as above. |
| `shared/diagrams/PieceBars.tsx` | `unitLabels` "1/den" drawn with `SvgMath` when `useStackedFractions()` is on | MG10 is the only other stacked lab, and it never sets `unitLabels`. |
| `shared/diagrams/FractionBar.tsx` | The label uses `SvgMathLine`, and the label row is 34 px instead of 22, when stacking is on | MG10 doesn't use FractionBar. |
| `shared/diagrams/TwoTierBars.tsx` | String captions use `SvgMathLine`, with taller caption spacing, when stacking is on | MG10 doesn't use it. |
| `shared/diagrams/NumberLine.tsx` | A fraction point label is stacked, with 16 px added on top, when stacking is on | MG10 doesn't use it. Off: identical, including the aria-label. |
| `MATH_TSX_STYLE_GUIDE.txt` | A short note in the stacked-fractions entry about the above | Documentation only. |

Nothing under `MG10/` was edited.

## Files changed in MG9

- **Shells:** the six `MG9_*.tsx` files listed in step 1.
- **Stylesheets:** the four `*_styles.css` files listed in step 2.
- **Fraction Operations:**
  - `lib/steps.tsx`, `diagrams/FracLinePlot.tsx`
  - `units/`: `DecomposingFractions`, `DecomposingFractionsTest`, `AddSubtractFractions`, `AddSubtractFractionsTest`, `FractionWordProblems`, `MultiplyFractionByWhole`, `MultiplyFractionByWholeTest`, `FractionLinePlots`
- **Intro to Fractions:**
  - `units/`: `FractionForms`, `FractionFormsTest`, `EquivalentFractions`, `ComparingFractions`, `SimplifyingFractions`
  - `diagrams/`: `FractionNumberLine`, `FractionCircle`, `WholePlusPartBar`, `EquivalentBars`, `SimplifyBeforeAfter` (spoken aria-labels)
- **Decimals:**
  - `units/`: `TenthsToHundredths`, `TenthsToHundredthsTest`, `DecimalNotation`, `DecimalNotationTest`, `ComparingDecimals`
  - `diagrams/HundredthsGrid.tsx`
- **Measurement:** `diagrams/TapeBar.tsx`

(`git diff` also shows changes in these folders from before this task, such as the CfuQuestion, PieceBars and MixedNumberBars promotion and the CFU gate change. Those are not mine.)

## How it was checked

- **Setup:** a temporary harness page plus a Vite dev server on port 5236, driven by headless Edge (playwright-core) at 1024×768 with touch.
- **What the walker covered, for each unit:**
  - Explore: every button and toggle, clicked one at a time, with a sweep after each.
  - The CFU: wrong answers first, then dropdown and tap combinations tried until correct. The hand-built Decimals and Intro CFUs were swept unanswered; their feedback text is inside the `MathText` wrapper.
  - Practice: every problem type, 2 draws each. Each step was answered wrong, wrong with a hint, then Show answer.
  - The Unit Test, including the review list, and the Module Test.
  - Fraction Operations' "Make a line plot" build-a-plot step can't be auto-solved; its feedback has no fractions.
- **Sweep logic:** each element's adjacent text nodes are joined, so `{n}/{d}` counts. A "/12" printed right after a box also counts, and so do `<option>` texts.
- **Cleanup:** the harness files were deleted and the server stopped. The scripts and results are outside the repo in the session scratchpad, `…/scratchpad/mg9-frac/` (`sweep.mjs`, `sweep-*.json`).

### Screenshots
- **Folder:** `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\6c39f246-04b5-4582-9603-1a614c7f0c61\scratchpad\mg9-frac\`
- **Files:**
  - `shots-after1-fop\u3-explore.png`: Unit 3 Explore. The pizza key idea, the story ("Ana used 1¾ yards… ¾ yard") and the equation "1¾ + ¾ = 2 2⁄4 yards" are all stacked.
  - `shots-before-fop\u3-explore.png`: the same screen before the fix.
  - `shots-after1-fop\u1-cfu.png`: Unit 1 CFU. Fraction choices are tap buttons, and the dropdown sits over "/6".
  - `shots-after1-fop\u2-p2-end.png`
  - `shots-inputs\fop-u2-addpast1-step1.png` and `shots-inputs\fop-u1-test-overden.png`: a box over a printed denominator, in Practice and in a Test.
  - `shots-inputs\dec-u2-test-stacked.png` and `dec-u2-test-review.png`: a box over a box, and the review list reading "2 out of 10".
  - `shots-after1-itf\u1-explore.png` and `u2-explore.png`: stacked number-line ticks and two-tier captions.
  - `shots-after1-dec\u1-cfu.png`

### Problems that were already there (not changed)
- The Intro "mixed numbers" number line labels values under 1 as "0 1/6"; the code builds them as `${whole} ${leftover}/${den}`.
- The shared NumberLine draws a 0–1 range only about 60 px wide (Intro, Equivalent Fractions).

## Other labs (looked at, not fixed)

Same walk, 1 practice draw per type, with no stacking turned on. "Score text" means "Best test score: 2/10", "aim for 9/10" and the result number; it would read "out of" once a lab is opted in.

| Lab | Screens | Fraction hits (distinct) | Score-text hits | Example strings |
|---|---|---|---|---|
| MG6 Fractions Foundations | 294 | **1,869** (282) | 18 | "1/3", "2/4"; goals "…like 1/4 or 3/4…"; "Recognize when a fraction is… (like 4/4 = 1, or 6/3 = 2)" |
| MG6 Area & Perimeter | 170 | 0 | 18 | test scores only |
| MG7 Division & Word Problems | 157 | 0 | 15 | test scores only |
| MG7 Multiplication Foundations | 306 | 0 | 18 | test scores only |
| MG7 Quadrilaterals & Partitioning | 154 | **170** (39) | 12 | "…name one part with a unit fraction like 1/4."; "1/4 (one fourth)"; dropdown option "there are 4 of them, so each one is 1/4" |
| MG7 Time, Measurement & Data | 215 | **87** (35) | 15 | "short tick = 1/4, medium tick = 1/2…"; "to the nearest 1/4 inch? (Type like 2 1/4.)"; "Above 1 3/4" |
| MG8 Angles & Protractor | 215 | **145** (23) | 15 | "…a three-quarter turn is 270°…"; "How many degrees is 1/2 of a turn?"; "270/360 of a full circle" |
| MG8 Factors, Multiples & Patterns | 136 | 0 | 15 | test scores only |
| MG8 Lines, Angles & Shape Classification | 235 | 0 | 15 | test scores only |
| MG8 Multiplicative Comparison | 137 | 0 | 15 | test scores only |
| MG11 Mult/Div Fractions | 183 | **197** (46) | 9 | "Area = 1/6"; "width = 1/3 mi"; "1/6 ÷ 1/3"; "3/4 lb — what we have" |
| MM1 Ratio | 352 | **345** (67) | 21 | "3/4 cup of flour"; "30% is… 30/100 × 60 = 18"; "2/3", "3/2" |
| MM1 Exponents & Expressions | 193 | **71** (8) | 17 | "A cube has side length s = 1/2…"; key idea "…even when s is a fraction" |
| MM1 Negative Numbers | 142 | 0 | 15 | test scores only |

Not walked: MG8 One-Digit Division. A source grep found 0 fractions.

Suggested order if these get fixed next:
1. MG6 Fractions Foundations
2. MM1 Ratio and MG11 Mult/Div Fractions
3. MG7 Quadrilaterals, MG8 Angles, MG7 Time and MM1 Exponents

The MG9 pattern carries over to each: opt the lab in, wrap its text in MathText, use `overDen` / `stacked` for boxes, and use `SvgMath` for labels. MG11 has its own fraction SVG diagrams that will need `SvgMath`.
