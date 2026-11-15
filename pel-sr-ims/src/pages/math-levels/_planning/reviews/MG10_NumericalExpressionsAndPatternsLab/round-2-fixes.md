# MG10 Expressions & Patterns: round 2 fixes

- Lab: MG10 `NumericalExpressionsAndPatternsLab`, Grade 5 (4th-and-up band, no read-aloud)
- Round: 2 · Date: 2026-11-14 · Work order: `round-2-merged.md` (19 items, all Fix)
- Paths are relative to `src/pages/math-levels/MG10/NumericalExpressionsAndPatternsLab/` unless they start with `shared/` or `MG10/`.

## 1. Summary

**19 items: 17 Fixed · 2 Fixed with a small change from the agreed text (C2-06, C2-07 + E2-24) · 0 Partly fixed · 0 Needs decision · 0 Not fixed.**

All checks pass: tsc, eslint (0 errors), vite build, a brute-force run with 0 failures, english-check (0 over the limit), and 38 of 38 browser checks at iPad portrait.

## 2. Item table

| ID | Status | What changed | Where |
|---|---|---|---|
| E2-20 + C2-03 | Fixed | The right choice now reads "B's first term is {k} × A's first term, and B adds {k} times as much each time." The two traps are now false statements: "B adds the same number as A each time." and "It works in the first column, so it works in every column." The choices are shuffled. The right answer lands in each position about ⅓ of the time. | `lib/patternSteps.ts:103-108` |
| C2-01 | Fixed | `isClean` now treats `buildExpr` as a pick, so any wrong Check on a build step breaks the clean solve. The named regroup message is unchanged. Browser: clean build → "Solved it! ⭐"; one wrong build → "Solved, with help." | `shared/engine/StepProblem.tsx:449` |
| C2-02 | Fixed | `factorsPicture` has a new `allowSplit` parameter (default true). For Many factors step 1 it is false, so a wrong try shows only "Try dividing by 2, then 3, then 5." Full-factorization steps still get `helpSplit`. | `units/PrimeFactors.tsx:240-242, 301` |
| C2-04 | Fixed | New `changeCompare(change)` in `lib/reading.ts` returns the step and Ty's two expressions. `changeStep()` still works as before for the Test. In Practice, step 3 is drawn with the opposite result to steps 1–2. While step 3 is asked, Ty's two expressions are drawn as `ExprView`s under the label "Ty's two expressions:", and both are ringed after a wrong pick. Once the step is done, they show as `WorkLines`. Every problem now has one change case and one no-change case (Yes/No split 51/49). | `lib/reading.ts:122-148`; `units/ReadingExpressions.tsx:496-530` |
| C2-05 | Fixed | CFU Q3 has its own patterns now: A = 0, 2, 4, 6 (adds 2) and B = 0, 4, 8, 12 (adds 4), shown in a `PatternTable`. The typed pairs are (4, 8) and (6, 12). The grid is xMax 8, yMax 12. The feedback adds "Each B term is 2 times its A term." The CFU plane is now 520 px wide with height min(520, 140 + 30·yMax), the same as the Practice plot step. The lab's `.cfu-plot` cap went from 380 to 520 px. Measured on iPad: 520 × 500, about 36 px per row (was about 18). Typed CFU share is unchanged. | `units/Patterns.tsx:83-115`; `shared/components/CfuQuestion.tsx:198-200`; `MG10/..._styles.css:650-653` |
| C2-07 + E2-24 | Fixed (fallback wording) | Step 3 prompt is now "Find the value of {expr}." with no "you wrote". The builder's prompt is a static node, so it can't print the student's own build cleanly. The picture already shows the stored order, so the text and the picture agree. | `units/ReadingExpressions.tsx:403-404` |
| E2-21 | Fixed | Both forms ask "Kim says the prime factorization of {n} is …. Is anything wrong?" | `units/PrimeFactorsTest.tsx:182, 203` |
| E2-22 | Fixed | Build hint: "Which step do the words say to do first? Put the parentheses around it. Then write the last step outside them." | `lib/reading.ts:187` |
| E2-23 | Fixed | `buildStep`'s diagnose has an `addDouble` case. `missesTheTwo` checks for fewer 2s than the answer has, or for both addends present with a third number that isn't 2. Either case gets "\"Double it\" means multiply by 2." A wrong addend still gets the shared "Check the numbers" message. No other template ever gets the double message. | `lib/reading.ts:155-192` |
| E2-25 | Fixed | All three echo questions are now sentence frames: prompt "Fill in the blank. Don't work it out.", then `NumberStep.prefix` "{X} is " [box] `suffix` "times as large as {Y}." This covers the plain and ratio forms in `timesStep` (Practice, Test and Module Test) and Practice "Expression to words" step 2. A lab-scoped CSS rule draws the affix in ink, not muted. `answerText` reads "{X} is 3 times as large as {Y}." | `lib/reading.ts:27-31, 45-48`; `units/ReadingExpressions.tsx:445-449`; `MG10/..._styles.css:660-666` |
| E2-26 | Fixed | "{n} is not prime. Which prime divides {n} evenly? Try 2, then 3, then 5." The two-prime numbers in LONG all have smallest prime 2 or 3, so the cue always reaches it. | `units/PrimeFactors.tsx:325` |
| E2-27 | Fixed | Prompt is "Which marks hold the part you work out first?" Both explanations use the agreed text. | `lib/steps.ts:47-53` |
| C2-06 | Fixed (choice wording adapted) | About 1 time in 4 (24% in the run), the placement step uses + +, × ×, or + then − numbers, and "Either place works." is right. **Change from the agreed text:** if "Either place works." is right, a bare grouping like "(2 + 5) + 9" would also be a true answer. So the grouping choices now read "Only (a o b) o c works." / "Only a o (b o c) works.", and exactly one choice is true in both cases. In the either case, step 4 asks for typed work: "Both places work. Find the part in parentheses in each one." That is a two-blank number sentence, and neither blank ever equals the target value. The picture keeps that pair unworked until step 4 is done. | `units/WhyParentheses.tsx:267-377` |
| E2-32 | Fixed | "New numbers. Put parentheses in {a o b o c} so that its value is {V}. Where do they go?" | `units/WhyParentheses.tsx:330` |
| C2-08 | Fixed | Module Test: the words → expression pick is replaced by `buildExprQuestion("medium")`, which draws from all 6 templates (each 15–19%). The import is updated. Unit 3 Test Q2 draws from subTimes, addDivide and timesSub (about ⅓ each). | `units/ModuleTest.tsx:6, 47-48`; `units/ReadingExpressionsTest.tsx:131-132` |
| C2-09 | Fixed | Each builder sign picker is now a 2 × 2 grid of small tap buttons (min 40 × 38 px, 20 px font). The whole expression stays on one line at 820 px: the row is 627 px wide in the real shell. Scoped to `.expr-build-row`, which only MG10 uses. | `shared/styles/lab-base.css:1940-1953` |
| E2-28 | Fixed (split in two) | The agreed text was 22 words, over the grade-5 limit of 20, so it is now two sentences: "Both multiply by {k}, but one group is larger. {k} × (…) is larger than {k} × (…), because … is larger than …." | `units/ReadingExpressions.tsx:286-288` |
| E2-29 | Fixed | Stepper label is "Copies to compare". | `units/ReadingExpressions.tsx:274` |
| E2-30 | Fixed | "{p} is prime, so you write just {p}." | `units/PrimeFactors.tsx:419` |
| E2-31 | Fixed | "{bad} is not prime. Kim needs to split it into primes." | `units/PrimeFactorsTest.tsx:207` |

**Follow-through:**
- The changed shared steps (`outsideMarksStep`, `timesStep`, `changeStep`, `buildStep`, `whyTimesStep`) feed Practice, the unit Tests and the Module Test, so the wording is the same everywhere.
- The CFU → bucket → Test map is unchanged.
- Explore Part 2 of Unit 3 got no new controls. Only a label and one sentence changed.

## 3. Changed files

Shared files (only MG10 uses these code paths; checked by grep: `buildExpr`, the CFU `plot` blank and `.expr-build-row` have no other consumer; `FirstQuadrantPlane` is untouched, so MM1 RatioLab is unaffected):
- `shared/engine/StepProblem.tsx`: one line in `isClean`
- `shared/components/CfuQuestion.tsx`: plot-blank size
- `shared/styles/lab-base.css`: builder sign-picker grid

Lab files:
- `lib/reading.ts`, `lib/steps.ts`, `lib/patternSteps.ts`
- `units/WhyParentheses.tsx`, `units/ReadingExpressions.tsx`, `units/ReadingExpressionsTest.tsx`, `units/ModuleTest.tsx`, `units/PrimeFactors.tsx`, `units/PrimeFactorsTest.tsx`, `units/Patterns.tsx`
- `MG10/MG10_NumericalExpressionsAndPatternsLab_styles.css`

## 4. New or rewritten student text

**Unit 1** (`units/WhyParentheses.tsx`)
- Placement step:
  - Prompt: "New numbers. Put parentheses in {a o b o c} so that its value is {V}. Where do they go?"
  - Hint: "Find the value with the parentheses in each place. Which ones make {V}?"
  - Choices: "Only {(a o b) o c} works." / "Only {a o (b o c)} works." / "Either place works."
  - Explain (either case): "Both places give {V}. Here, moving the parentheses doesn't change the value."
- Step 4 (either case):
  - Prompt: "Both places work. Find the part in parentheses in each one."
  - Frame: "In {left}, the part in parentheses is __. In {right}, it is __."
  - Hint: "Work out only the part inside the parentheses."
  - Explain: "{work left}, and {work right}. The first steps are different, but both end at {V}."
- Wrap-up (either case): "To get {V}, the parentheses can go in either place."

**Unit 2** (`lib/steps.ts`)
- Prompt: "Which marks hold the part you work out first?"
- Explain (first): "The part in parentheses is inside all the other groups, so you work it out first. Then keep working from the inside out."
- Explain (outside): "The {name} hold all the other groups, so they are on the outside. Then do the last step, outside all the marks."

**Unit 3**
- Frames (`lib/reading.ts`, `units/ReadingExpressions.tsx`):
  - Prompt: "Fill in the blank. Don't work it out."
  - Frame: "{X} is __ times as large as {Y}."
- Build step (`lib/reading.ts`):
  - Hint: "Which step do the words say to do first? Put the parentheses around it. Then write the last step outside them."
  - Message: "\"Double it\" means multiply by 2."
- Practice (`units/ReadingExpressions.tsx`):
  - Words to expression, step 3: "Find the value of {expr}."
  - Move the parentheses, picture label: "Ty's two expressions:"
- Explore (`units/ReadingExpressions.tsx`):
  - Stepper label: "Copies to compare"
  - "Both multiply by {k}, but one group is larger. {k} × (…) is larger than {k} × (…), because {C} is larger than {B}."

**Unit 4**
- `units/PrimeFactors.tsx`:
  - "{n} is not prime. Which prime divides {n} evenly? Try 2, then 3, then 5."
  - "{p} is prime, so you write just {p}."
- `units/PrimeFactorsTest.tsx`:
  - "… Is anything wrong?"
  - "{bad} is not prime. Kim needs to split it into primes."

**Unit 5**
- Why step (`lib/patternSteps.ts`):
  - Right choice: "B's first term is {k} × A's first term, and B adds {k} times as much each time."
  - Traps: "B adds the same number as A each time." / "It works in the first column, so it works in every column."
- CFU Q3 (`units/Patterns.tsx`):
  - "Ordered pairs: (0, 0), (2, 4), (__, __), (__, __)"
  - Good feedback adds "Each B term is 2 times its A term."

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | Pass (run again after the last edit) |
| `npx eslint` on all 13 touched TS/TSX files | Pass: 0 errors. Warnings are only the existing `react-refresh/only-export-components` pattern. |
| `npx vite build` | Pass. Only the existing warnings: the historicalProgressService dynamic import and chunk size. No "does not provide an export". |
| Test/unit import check | Pass: no `*Test.tsx` imports from its unit file. No new `useRef`. |
| Brute force (scratch esbuild bundle) | **Pass, 0 failures.** See the details below. |
| `english-check.cjs --grade 5` on the 10 changed lab files | Pass: 0 sentences over the limit after splitting E2-28. Flags are the existing ones: "NOT prime" (accepted in round 1), the CFU true/false prompts, "in all", and one relative clause. |
| Browser: Playwright, temporary harness, iPad portrait 820×1180, touch on | **38 of 38 pass, 0 console errors.** See the details below. |

**Brute-force scope:** 3,000 problems per Practice type and per bucket, 1,500 draws of each unit Test and the Module Test, and 10,000 direct generator trials.

**Brute-force results:**
- Every right answer passes the grader, including builds and frames.
- No duplicate choices, NaN, undefined or slash fractions.
- None of the old wording remains (the echo questions, "What is wrong?", "break it down", "divides itself", "add the last step", "you wrote", "Same ×", the old why traps).
- Every bucket is reached.

**Item checks:**
- **C2-06:**
  - Split: either 24%, left 39%, right 37%.
  - In the either case, both "Only …" expressions really equal V. Otherwise exactly one does.
  - Step 4's blanks never equal V, and the picture doesn't show that pair worked out before step 4 is done.
- **C2-04:** Step 3's result is always the opposite of steps 1–2. Ty's pair is in the step-3 picture with no values. Yes/No split 51/49.
- **C2-02:** After a wrong try on the pair step, the picture shows only n.
- **E2-23:**
  - The double message fires for a missing 2, a 3 or a 1 in place of the 2.
  - It never fires for a wrong addend or for another template.
  - The commutative build is accepted.
- **E2-20:** B.add ≠ A.add for every times pair.
- **C2-08:** Module Q11 is always a build. Unit 3 Test Q2 draws subTimes, addDivide and timesSub at about ⅓ each.
- **E2-21:** Kim's right answer is about 50/50.

I printed sentences for every new template and read them; all are grammatical.

**Browser checks:**
- **U1 either case:**
  - Prompt and choices render.
  - A wrong pick gets feedback.
  - Step 4 has 2 typed boxes, and a wrong value gets feedback.
  - A wrong pick gives "Solved, with help."
- **U3 Move the parentheses:**
  - Ty's two expressions are drawn while step 3 is asked.
  - A wrong pick rings both of them.
- **U3 build step:**
  - A clean solve gives ⭐. One wrong build gives "Solved, with help." (C2-01)
  - The double-it message shows. The regroup message still shows.
  - The step 3 prompt has no "you wrote".
  - The row is on one line in the harness and in the real shell at 820 px.
  - Dark mode is readable.
- **U3 frames:** they render in ink, and they can be solved.
- **U4:** Many factors, a wrong pair shows only "32" plus the cue.
- **U5 why:** the new choices render.
- **U2 marks:** the new prompt renders.
- **U3 Explore:** the new label and sentences render.
- **Full lab, U5 CFU (C2-05):**
  - Practice is locked before the CFU.
  - The plane is 520 px wide, about 36 px per row.
  - A wrong point gets red feedback; the right points get green.
  - Practice opens after the CFU, and the passed CFU stays on screen (`cfuJustPassed` latch). It closes after leaving Explore.
  - No slash fractions.

The harness page, its HTML file, the dev server (port 5199) and the scratch scripts are removed or stopped.

**Screenshots** (all looked at), in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\4a0a5ada-0427-4375-a535-7a7815b05751\scratchpad\r2\shots\`:
- U1: `u1-either-step3.png`, `u1-either-step4.png`, `u1-either-done.png`, `u1-only-step3.png`
- U2: `u2-marks.png`
- U3: `u3-move-step3.png`, `u3-move-step3-wrong.png`, `u3-move-done.png`, `u3-build-empty.png`, `u3-build-filled.png`, `u3-build-double-wrong.png`, `u3-build-real-shell.png`, `u3-build-dark.png`, `u3-words-frame.png`, `u3-compare-frame.png`, `u3-explore.png`
- U4: `u4-many-pair-wrong.png`
- U5: `u5-why.png`, `u5-cfu-q3-empty.png`, `u5-cfu-q3-wrong.png`, `u5-cfu-passed.png`

## 6. Noticed, not fixed

- **U1 placement, either case:** The "+ then −" form, (a + b) − c = a + (b − c), means the "either" answer isn't only the + + / × × case. That is true, and it matches Unit 3's "sometimes" idea. But Unit 1's Explore line "Both come out to X this time. Try other signs." is the only place Unit 1 shows it. The next review may want a word in the U1 Key Idea.
- **U5 CFU Q3:** The typed pairs can be read straight off the table now shown in Q3. The old Q3 also read them from Q2's table, so the skill checked is the same (pairing A first, then plotting). It is just more visible now.
- **U5 CFU Q3:** A wrong plot (one point off) gets the generic "1 of your points is not in the right spot. Go across first, then up." That is the existing `checkPlot` message.
- **Full-page screenshots:** The sticky unit nav sits over the page in full-page screenshots. This is an existing screenshot artifact, not a layout bug in the viewport.
- **Old scratch files:** `scratchpad\` still holds files from earlier rounds (`brute.tsx`, `pw.cjs`, `shots\` and others). I didn't create them, so I left them.
- **Proposed rules:** The six proposed rule and guideline changes in `round-2-merged.md` still wait for Stage 6.
