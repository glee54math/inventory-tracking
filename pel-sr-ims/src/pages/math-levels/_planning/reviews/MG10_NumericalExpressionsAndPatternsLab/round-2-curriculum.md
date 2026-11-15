# MG10 Expressions & Patterns: curriculum review, round 2 (re-review)

- **Lab:** MG10 `NumericalExpressionsAndPatternsLab` ("Expressions & Patterns"), 5 units + Module Test
- **Round:** 2 (re-review of the round-1 fixes)
- **Date:** 2026-11-14
- **Grade band assessed:** 4th and up (Grade 5, first-time learners, no read-aloud), same as round 1.
- **Inputs:** `round-1-merged.md`, `round-1-fixes.md` (including its "Noticed, not fixed" list), my `round-1-curriculum.md`, the plan, and the user's decision on C1-02 (build-it step in "Words to expression"). I did not read any round-2 English report.
- **How I checked:** I read the changed code: all 5 units, their Tests, the Module Test, `lib/reading.ts`, `lib/expr.ts` (`moveParens`), `lib/primes.ts`, `lib/steps.ts`, `lib/patternSteps.ts`, `lib/stories.ts`, the new shared `buildExpr.ts`, `ExprBuilder.tsx`, and the engine and CFU diffs. I did **not** drive the lab in a browser or re-run a brute-force script this round. The fixer's browser pass and its 3,000-draw script are the evidence for the splits quoted below, and I spot-checked the code behind each one.
- **Assumptions:** English-only rows (E1-xx) belong to the English checker. I checked that each one landed in the code, but did not re-judge the wording.

---

## 0. Status of last round's fixes

| ID | Status | Notes |
|---|---|---|
| C1-06 | **Fixed, but caused a new problem** | Short, Is it prime? and Many factors step 2 no longer show circled primes or the full answer while a factorization is asked (`PrimeFactors.tsx:238-247, 299-309, 376-386`). The new problem: the same `factorsPicture` help is also used for Many factors **step 1**, which asks for a factor *pair*. Its one-split help picture is a correct pair, so it can be copied (see C2-02). |
| C1-01 | Fixed | `moveParens` now has (a + b) − c and (a × b) ÷ c as "no change" and (a ÷ b) × c as "change" (`expr.ts:236-277`). The hint is "Find the value both ways." The wrap-up and Explore Part 3's "+ and −" button are in. The surface rule now predicts about 72% of answers instead of 100%. |
| C1-10 | Fixed | Practice `ExprView` has outlines only when `pointing(help, i)` (`NestedGroups.tsx:255`). The Test shows the same plain picture. |
| C1-03 | Fixed | Ratio variant 2 times in 3 (`ReadingExpressions.tsx:469`). In Expression to words, the outer-× step is now "j·k × (…) vs k × (…)" with the answer j, not on screen. CFU Q1's typed box is now the value (30), and Q2 is 6 vs 2 copies (3). The plain copy variant is still 1/3 of How big is it? and 1 Test item. That is acceptable, because it states the standard's own example. |
| C1-02 | Fixed (user decision) | Build step works: tap the grouping, type the numbers, tap the signs; graded by structure, commutative order accepted (`buildExpr.ts`). The new words differ from the picked words, so it isn't a copy. Unit 3 Test Q2 is a build item. One weakness: see C2-01. |
| E1-01 | Fixed | Definition in U1 Explore (`WhyParentheses.tsx:167`) and U1 Key Idea. |
| E1-05 + C1-12 | Fixed | Only 2- and 3-layer expressions. Random "outside" or "first" question. The true explanation is shared by Practice and the Test (`lib/steps.ts:41-58`). |
| C1-04 | Fixed | "Compare with" stepper and the bigger-group bars in Explore Part 2 (`ReadingExpressions.tsx:167-294`). |
| C1-05 | Fixed | "÷ equal parts" Explore mode, plus a ÷ form in `largerCompare` (Practice, Test, Module Test). |
| C1-07 | Fixed | Two-prime numbers get the typed "smallest prime that divides n evenly" step, with named mistakes (`PrimeFactors.tsx:311-330`). |
| C1-08 | Fixed (pool limit accepted) | Half "NOT prime", plus a typed factor-pair step, plus a full factorization step for 27. The fixer is right that the pool can't grow inside 2–50. |
| C1-11 | Fixed | The bracket group written out is a distractor (`NestedGroups.tsx:265`). |
| C1-13 | Fixed | Names only on the buttons (`SYM_NAME`). |
| C1-15 | Fixed | Placement step with new numbers, then the value of the other grouping (`WhyParentheses.tsx:275-340`). Small side effect: see C2-06. |
| C1-18 | Fixed, but one trap is a true statement | Why step added for times pairs. "B adds more each time." is true for every times pair (see C2-03). |
| C1-19 | Fixed | `timesTrapQuestion`, `notFinishedQuestion` and `sameEndQuestion` each have two forms with different right buttons (`PatternsTest.tsx:120`, `PrimeFactorsTest.tsx:93, 170`). |
| C1-20 + E1-16 | Fixed | The laps story now matches the table (`Patterns.tsx:149`). |
| C1-22 | Fixed for Practice/Test; CFU plot not covered | Practice and Test plots are capped at 12 and 520 px wide. U5 CFU Q3's plot is still 360 px wide with y up to 20 (see C2-05). |
| E1-02 | Fixed | `scene.prep` in Practice and the Test hints. |
| E1-06 | Fixed | "Outfit" is defined; line 175 says "subtract the coupon". |
| E1-07 | Fixed (per fixer; English lane) | |
| E1-09 | Fixed | `valueStep` hint: "Then keep working from the inside out." |
| E1-10 | Fixed | "larger" throughout `reading.ts`. |
| E1-11 | Fixed | `ReadingExpressions.tsx:201`. |
| E1-12 | Fixed | CFU Q4 prompt. |
| E1-13 | Fixed | `ReadingExpressions.tsx:124, 252`. |
| E1-14 | Fixed | "divide … evenly" (`PrimeFactors.tsx:228, 334`). |
| E1-17 | Fixed | "plotting" defined (`Patterns.tsx:220`); title "Ordered pairs on a grid". |
| E1-18 | Fixed | `factors.ts:105` handles singular and plural. |
| C1-09 | Fixed | `primeCheckText` (`PrimeFactors.tsx:142-147`). |
| C1-14 | Fixed (per fixer's script; code at `NestedGroupsTest.tsx:149`) | |
| C1-16 | Fixed | About half of step-2 prompts are the question alone. |
| C1-17 + E1-04 | Fixed | `spotLabel` is passed as `extraLabel` (`WhyParentheses.tsx:224`). |
| C1-21 | Fixed | `Patterns.tsx:213`. |
| C1-23 | Fixed | `ModuleTest.tsx:59`. |
| C1-24 | Fixed | Bars after a wrong "which is larger?" pick (`ReadingExpressions.tsx:478`). |
| C1-25 + E1 note | Fixed | Fresh change and no-change pairs, with a typed value (`ReadingExpressionsTest.tsx:79-109`). |
| E1-03 | Fixed | The story is `s.text` only. |
| E1-08 | Fixed (closest wording) | "Work out the green part". |
| E1-15 | Fixed | |
| E1-19 | Fixed (per fixer; English lane) | |

**Totals (39 rows): 37 Fixed · 0 Not fixed · 2 Fixed, but caused a new problem (C1-06, C1-18).** C1-22 is fixed where it was asked; the CFU grid it didn't cover is a new finding (C2-05).

---

## 1. Verdict

**Ready for students after a few small fixes.** Every round-1 Major is fixed. Nothing new is a Blocker or a Major. The most useful remaining fix is C2-01: the new build-it step lets a student guess where the parentheses go for free. That is the one decision 5.OA.2 "write" is about.

## 2. Top 5 changes

1. **C2-01:** Make a wrong build in "Words to expression" count against a clean solve (or at least a wrong *grouping* with right numbers and signs), so the parentheses placement can't be a free 50/50 guess.
2. **C2-02:** In *Many factors* step 1 (type a factor pair), don't show the one-split tree after a wrong try. That split is a correct answer to copy.
3. **C2-03:** Replace the why-step trap "B adds more each time." with a false reason.
4. **C2-04:** In *Move the parentheses*, show Ty's two expressions in the picture for step 3 (or use the step 1–2 expressions).
5. **C2-05:** Make U5 CFU Q3's plot grid easier to tap: 520 px wide, or y up to 12.

## 3. Scorecard (changed parts)

| Unit | 1 Standards | 2 Audience | 3 Arc | 4 Unstuck | 5 Pictures | 6 Math/miscon. | 7 Mastery | 8 Device |
|---|---|---|---|---|---|---|---|---|
| 1 Why Parentheses | Strong (now places parentheses) | Strong | Strong | OK | Strong | Strong | OK ("Either" never right, C2-06) | not run |
| 2 Brackets & Braces | Strong | Strong | Strong | OK | Strong (outlines only as help) | Strong | OK | not run |
| 3 Reading Expressions | Strong (writes expressions now) | OK | Strong | OK (C2-04) | OK | Strong (sign rule broken) | OK (grouping guess in build, C2-01) | not run (builder wraps per fixer) |
| 4 Prime Factors | Strong | Strong | Strong | OK | OK (pair-step help, C2-02) | Strong | OK | not run |
| 5 Patterns | Strong ("explain why" added) | Strong | Strong | OK | OK | OK (true trap, C2-03) | OK | CFU grid tight (C2-05, unverified) |

---

## 4. All findings (new this round)

### Unit 3: Reading an Expression Without Solving It

**C2-01 · Minor · Layer 7**: Where the parentheses go in the build step is a free two-way guess.
- **Who it hurts:** The guesser and the procedure-follower, on *Words to expression* step 2 (and Unit 3 Test Q2 gets one try, so the Test is fine).
- **Evidence:**
  - `StepProblem.tsx:444-455` (`isClean`) counts only `choice` and `checkEach` sentence steps as picks. A wrong `buildExpr` Check doesn't break a clean solve.
  - `buildExpr.ts:73-74`: when the numbers and signs are right but the grouping is wrong, the message says exactly that ("The numbers and signs are right. Put the parentheses around…").
  - So a student can type the numbers and signs, tap either grouping, and if it's wrong tap the other one. That is still a clean solve. Grouping is the whole point of 5.OA.2 "write".
- **Fix:** In `isClean`, treat a `buildExpr` step with `wrong > 0` as a guess (only MG10 uses this step kind). A softer option: count it as a guess only when a wrong try differed from the answer only in grouping (`regrouped` matched). Keep the named message.

**C2-04 · Minor · Layers 4 and 5**: In *Move the parentheses*, step 3's expression isn't in the picture.
- **Who it hurts:** The first-timer, on step 3.
- **Evidence:** `ReadingExpressions.tsx:490-513`. Steps 1–2 work out `e` and `moved`. Step 3 is `changeStep()`, which draws its **own** new expression ("Ty moves the parentheses in …"). The picture still shows the step 1–2 work. After a wrong pick, the hint "Find the value both ways" points at nothing on screen. This was there in round 1 too; I missed it.
- **Fix:** Either show Ty's two expressions as `ExprView`s while step 3 is asked (with `focus` on a wrong try), or build step 3 from a pair drawn with the *opposite* `change` to steps 1–2 and draw it. The second option also makes every problem show one change case and one no-change case, which teaches "sometimes".

**C2-07 · Polish · Layer 3**: Step 3 says "Find the value of the expression you wrote: (24 − 5) × 3", but the student may have written 3 × (24 − 5), which is also accepted.
- **Evidence:** `ReadingExpressions.tsx:402` prints `exprText(t2.expr)`, not the student's build.
- **Fix:** Use "Find the value of {expr}." without "you wrote", or print the student's own build from `help.answers` (prompts are static, so the wording change is simpler).

**C2-08 · Polish · Layer 3**: The Module Test has no build item. The Unit 3 Test's build item is always `subTimes`.
- **Fix:** In the Module Test, swap the words→expression pick for `buildExprQuestion("medium")` with a random template. In the Unit 3 Test, draw Q2's template from `["subTimes", "addDivide", "timesSub"]`.

**C2-09 · Polish · Layer 8 · Unverified (fixer's note)**: The builder's sign pickers push the 3rd number box onto a second line at iPad portrait.
- **Fix:** Make the sign picker narrower (a compact select, or 4 small buttons in a 2 × 2 grid) so the expression reads on one line, the way it is written.

### Unit 4: Breaking Numbers into Prime Factors

**C2-02 · Minor · Layers 5 and 7**: *Many factors* step 1 (type a factor pair): after one wrong try, the picture shows a correct pair.
- **Who it hurts:** The guesser, on numbers in `LONG` that don't have exactly two prime factors (16, 28, 32, 40, 44, 45, 48, 50).
- **Evidence:** `PrimeFactors.tsx:301` calls `factorsPicture(n, false, pointing(help, 0), …)` for step 0. That draws `helpSplit(n)`, the most-even first split (e.g. 40 → 5, 8), whenever one child isn't prime. For a *pair* step, that split is the answer, and a wrong typed try doesn't break a clean solve. Steps 2–3 still need real work, so the harm is small. It comes from applying the C1-06 help to a step it wasn't written for.
- **Fix:** For the pair step, show only the text cue after a wrong try ("Try dividing by 2, then 3, then 5."). Keep `helpSplit` for full-factorization steps.

### Unit 5: Two Rules, Two Patterns

**C2-03 · Minor · Layer 6**: A "wrong" choice in the new why step is a true statement.
- **Who it hurts:** The careful first-timer, who sees that B really does add more each time, picks it, and is told it's wrong.
- **Evidence:** `patternSteps.ts:94-108`. The trap "B adds more each time." is always true for a times pair with k ≥ 2. The code comment says so too.
- **Fix:** Replace it with a false reason, e.g. "B adds the same number as A each time." or "B's numbers are bigger, so B is always times A." Keep "The first column shows it."

**C2-05 · Minor · Layer 8 · Unverified**: U5 CFU Q3's plot grid is still tight.
- **Evidence:** `Patterns.tsx:95` gives yMax 20. `CfuQuestion.tsx` draws the CFU plane at width 360, height min(460, 120 + 20 × 20) = 460. That is about 18 px per row, with `hitPad` 14. The round-1 cap and the 520 px width only reached the Practice and Test plot step. The fixer's "22 px" figure assumed 520 px wide.
- **Fix:** Change Q3 to the points (0, 0), (2, 4), (4, 8), (6, 12) with yMax 12, or give the CFU plane the same 520 px width as the Practice step.

### Unit 1: Why We Need Parentheses

**C2-06 · Polish · Layer 7**: In the new placement step, "Either place works." is never right.
- **Evidence:** `WhyParentheses.tsx:275-286`. `plusTimes` always gives two different values, so after a few problems the step becomes a two-way guess. It is a `choice`, so a wrong pick does break a clean solve, and step 4 is real typed work.
- **Fix (optional):** About 1 time in 4, use a + + or × × triple (or (a + b) − c), so "Either place works." is right. That also ties into Unit 3's "sometimes" idea. If it is kept never-right, that is acceptable.

---

## 5. Assessment of the fixer's "Noticed, not fixed" list

| Fixer's note | My call |
|---|---|
| U5 CFU Q3 plot fixed at yMax 20 | **Finding C2-05 (Minor).** The CFU plane is 360 px wide, not 520, so rows are tighter than the fixer estimated. |
| Builder sign buttons wrap the 3rd box | **C2-09 (Polish).** |
| A Test build question can be skipped blank | No finding. Same as every Test step kind, and graded wrong. |
| Module Test still uses the pick, not a build | **C2-08 (Polish).** |
| Unit 3 Test Q4 always addDivide | No finding. Q3 covers timesAdd/timesSub, and Practice uses all 6 templates. |
| "Which marks do you work out first?" is always parentheses | No finding. That is the true convention (parentheses are the innermost marks), not a guessable bias. Across both forms the right button is 49/25/25. |
| C1-18 trap "B adds more each time." is true | **C2-03 (Minor).** |
| *Parentheses first* is now 4 steps | No finding. Steps 3–4 are new, short and different (place, then value). Fine for grade 5. |
| "Bigger group" bars are a 1.2× schematic | No finding. The bars only need to show "larger", and the sentence says why (C is larger than B). Optional polish: caption "Not to scale." |

---

## 6. Persona walkthrough highlights

- **The guesser in Unit 3, "Words to expression" step 2.** Words: "Subtract 5 from 24, then multiply by 3." They type 24, 5, 3, tap − and ×, and tap the left-hand grouping at random. If they're wrong: "The numbers and signs are right. Put the parentheses around…". They tap the other shape, and it's still a clean solve (C2-01). The pick in step 1 does make them think once per problem, so they aren't skipping the idea entirely.
- **The procedure-follower in Unit 3, *Move the parentheses*.** The old "both + or both ×" rule now fails on (12 + 5) − 3 and (4 × 6) ÷ 2. The hint says "Find the value both ways", and they have to. That is the round-1 C1-01 problem, now fixed.
- **The first-timer in Unit 4, Short, n = 35.** They type 5 × 5 and see only "35" and the cue "Try dividing by 2, 3, 5 and 7." They have to divide. The copy-to-clean route from round 1 is closed.
- **The careful first-timer in Unit 5's why step.** They read "B adds more each time.", check it (true), pick it, and are told no (C2-03).

## 7. What's working well (keep)

- The build step is a real 5.OA.2 "write" task: new words (not a copy of the pick), structural grading with commutative order, and named mistakes, including "Subtract b from a" written backwards.
- Unit 4's help pictures now teach without giving the answer. Many factors step 2 draws the student's **own** starting pair ("Your start"), which is a very good touch.
- Unit 3's size comparisons are all shown in Explore before Practice: copies vs copies, bigger group, ÷ equal parts.
- Unit 2's Practice picture now matches the Test, and outlines appear only as help.
- The Test choice questions that always had the same right button now have two forms.
- The shell's `cfuJustPassed` latch, the CFU gate, and ≥ 3 of 4 typed CFU questions in every unit are intact. Unit 3's typed CFU blanks now need work (30, 3, 3/7).
- No slash fractions.
- Shared engine changes are additive. `buildExpr`, `plot`, `factors` and `VisualHelp.answers` are used only by this lab (grep), so no other lab needs a check.

## 8. Rule gaps (proposed for `math-lab-builder.md`)

1. **Under "Practice must not be passable without the math":** "A built or typed step whose part is a two-way choice (where the parentheses go) counts as a pick for clean solves. A wrong try on it breaks the clean solve, the same as a `choice` step."
2. **Under "The picture matches the question, not the answer":** "When one help picture is reused for several steps, check it against each step's own answer. A first split that is fine help for 'write n as primes' is the answer to 'type a factor pair'."
3. **Under CFU / Test choices:** "Every wrong choice must be false. A true statement that is 'not the reason' is never a distractor. Make it false, or ask 'Which reason explains it?' with only one true reason."

## 9. What I could not check

- No browser run this round. Not seen by me: the build step on iPad (the wrapping in C2-09), the CFU plot spacing (C2-05), dark mode and the number pad.
- No brute-force run of my own. The fixer's splits (72% surface-rule fit, 50/50 sides, splits of about 49/51) are quoted from `round-1-fixes.md`. I checked the generator code behind each one.
- Real 5th graders, and real iPad touch feel.

---

**Counts (new findings):** Blocker 0 · Major 0 · Minor 5 · Polish 4

| Severity | IDs |
|---|---|
| Blocker | none |
| Major | none |
| Minor (5) | C2-01, C2-02, C2-03, C2-04, C2-05 |
| Polish (4) | C2-06, C2-07, C2-08, C2-09 |

**Round-1 Fix items:** 37 Fixed · 0 Not fixed · 2 Fixed, but caused a new problem (C1-06 → C2-02, C1-18 → C2-03).
