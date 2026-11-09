# MG10 AddingAndSubtractingFractionsLab — build report (round 0)

Built 2026-11-06 by the `math-lab-builder` agent from
`_planning/Grade-5/AddingAndSubtractingFractionsLab/plan.md`. The plan's "Approved changes" section overrides the rest of the plan, and this build follows it. Nothing is committed. `git mv` staged the three promotions (renames). Everything else is unstaged.

## Grade band: 4th and up (grade 5)

The plan names Grade 5 (5.NF.1–2) and says students are seeing this for the first time. That puts the lab in the "4th and up" band: text-led questions, vocabulary, true/false traps and multi-part CFU questions. Following the MG6+ convention, there is no read-aloud and no `EarlyLearnerProvider`.

All student text was checked with `node scripts/english-check.cjs --grade 5`. It started with 15 flags and ends with 4, and those 4 are false positives. Text a student reads alone was also kept to the grade-4 limit of 18 words. The only remaining grade-4 length flags are extraction artifacts: the hero `<h1>` and the paragraph after it are merged into one sentence, and Key Idea text broken up by stacked `<Frac>`s is joined.

Language rules followed:
- "LCD" never appears before Unit 2 teaches it. Unit 1 says "cut both into sixths" and "same-size pieces".
- "Benchmark" is taught with a number line in Unit 5's Explore and in CFU Q1 before any question uses it.
- "Borrow" is used for every borrowing step. Unit 4's Explore says once that it is "also called regrouping".
- "Simplest form" matches the wording in MG9 IntroToFractions.

## Engine / shared changes (all additive)

| Change | Why | Existing callers |
|---|---|---|
| New Step kind `fraction` (`FractionStep`, `fractionStep()` in `shared/engine/types.ts`). It has an optional whole-number box, a numerator box stacked over a denominator box, and an optional printed `den`. `check()`, `answerText()`, `StepInput`, `UnitTest.studentAnswerText` and CSS in `lab-base.css` (`.frac-entry*`) all handle it. | Mixed numbers and fractions need typed answers, and simplest form has to be its own check. Earlier labs logged this as a gap: the DecimalsLab note asked for "a real stacked-fraction entry step". | No existing caller uses the kind, so nothing changes. |
| `FractionStep.simplest`: an equal answer that isn't in simplest form fails with **"That's equal, but it's not in simplest form. Simplify it."** plus one reason sentence. It also returns `formMiss`. | Approved change: simplest form is a separate check, and missing it means the solve isn't clean. | Opt-in per step. |
| `StepState.formMiss?` (optional). `isClean` treats any `formMiss` as not clean. | Same. | Only set by `fraction` steps that use `simplest`. |
| `NumberStep.diagnose?(value)` gives named feedback for a predictable wrong value. | Approved change: a common denominator that isn't the least is marked wrong, and the feedback names the mistake. | Optional. Unset means grading is exactly as before. |
| The wrap-up sentence after a helped solve, when `onRetrySame` is passed, now reads "Now solve one like it on your own. Then you can move on." for non-early labs. The early-learner wording didn't change. | The retry lock (Next disabled until a clean same-type solve) was already keyed on `onRetrySame`, not on early-learner mode. Only this sentence assumed K–1. | Every current `onRetrySame` caller (MK1–MK4, MG1) is early-learner, so their behavior is identical. |

Promotions to `shared/`, each triggered by this lab becoming the second consumer:
- `MG9/FractionOperationsLab/diagrams/PieceBars.tsx` → `shared/diagrams/PieceBars.tsx`. RecutBars, Unit 1's Explore and the CFU pictures are built on it.
- `MG9/FractionOperationsLab/diagrams/MixedNumberBars.tsx` → `shared/diagrams/MixedNumberBars.tsx`. Used for borrowing in Unit 4.
- `MG9/FractionOperationsLab/units/cfu.tsx` → `shared/components/CfuQuestion.tsx`. `DropdownQuestion` gained two additive features: **typed boxes** (a blank with no `options`) for the fill-in rule, and a function form of `bad` that names the mistake.
- MG9 keeps working through re-exports in its `diagrams/index.ts` and `units/cfu.tsx`. I checked it in the browser: its Unit 2 Explore, pictures and CFU grading behave as before.

## Shell (`MG10_AddingAndSubtractingFractionsLab.tsx`)

- Copied from MG9 FractionOperationsLab, with **MK1's UnitView retry lock ported** (`lastMakeRef`, `drawRef` keyed `${unit.id}|${mode}|${seed}`, `owesRetry`, `usedTokenRef`, `onHelped`/`onRetrySame`, type `Segmented` disabled, "New problem" turns into "Try one like it"). There is no `lab-early`, no number pad and no TTS.
- The CFU gate is the strict version: `!requiresIntro || (introDone && !refresh)`. Practice history (`solved > 0`) does **not** open Practice.
- The passed CFU stays open through the `cfuJustPassed` latch.
- Module Test is wired the same way as MG9: rail button, Home card, `RatingStars`, `TestBadge total`.

## Per unit

Every unit has `requiresIntro: true` and no `reintroEverySolved`. Every Practice problem has at least one typed step. The final-answer step in Units 1, 3, 4 and 5 is a `fraction` step with `simplest: true`.

### Unit 1 — Why You Can't Just Add Across (5.NF.1)
**Explore:** Steppers for two fractions (denominators 2–8). A toggle switches between:
- **"Add across":** both bars plus the add-across bar, with a caption computed from the numbers ("2/5 is less than 1/2 … adding more should always make a bigger number").
- **"Same-size pieces":** RecutBars re-cut to the common pieces, with the sum bar and the equation.

**CFU (2 of 4 questions typed):**
1. "Ana says 1/2 + 1/3 = 2/5." Pictures of 1/2 and 2/5. "2/5 is [less than] 1/2. So Ana's answer is [too small]." Targets the add-across trap: the result is smaller than one of its parts.
2. Typed, over a re-cut picture: "1/2 = [3]/6 and 1/3 = [2]/6. So 1/2 + 1/3 = [5]/6." The fix, typed out.
3. Vocabulary, with numerator and denominator both in play: "the denominator 3 tells [how many equal pieces make 1 whole]. You can add the tops only when the [denominators] are the same." Targets numerator/denominator conflation.
4. True/false generalization plus a typed answer: "adding across always works: [False]. 1/4 + 1/2 = [3]/[4]." This one-fits-the-other case is a common place students go wrong.

**Practice buckets:** `unitPair`, `unitPlusNonUnit`, `multipleDen`, `coprimeDen`, one ProblemType each. Every problem has 3 steps:
1. Re-cut both into the common pieces (two typed numerators).
2. The sum in simplest form (`fraction`). Add-across and added-the-bottoms answers get named feedback.
3. "Ana says X. Ben says Y. Who is right?" One of them adds across, and which one is random, so the right name changes each time.

**Test (10):**
1. Re-cut, typed, with picture.
2–5. Sum in simplest form, one per bucket. The bucket pools are disjoint.
6. Pick the sum. Distractors: the add-across answer, and "added the tops, kept one bottom" (ignores the piece sizes).
7. Why add-across is wrong. Distractors: "right but needs simplifying" (mixes up value and form), and "should multiply the tops" (wrong operation).
8. Which pair can you add by adding the tops? Distractors: a pair with the same **numerators** (numerator/denominator mix-up), and two unit fractions of different sizes.
9. Which pieces can both bars be cut into? Distractors: the denominators added, and the bigger denominator only.
10. Who is right? "Neither" catches students who distrust any simplified answer.

**CFU → bucket → Test:**
- add-across too small → step 3 in every bucket → T6, T7, T10
- re-cut → step 1 in every bucket → T1
- same denominator needed → all buckets → T8, T9
- one-fits-the-other → `multipleDen` → T4

### Unit 2 — Finding a Common Denominator (5.NF.1)
**Explore:**
- Defines "common denominator" and "**LCD** means **least common denominator**".
- Steppers for two denominators (2–16) and a MultiplesList with three levels: Multiples / Common ones / The LCD. When the LCD isn't the product, it says so ("4 × 6 = 24 is a common denominator too, but it is not the least").
- A rewrite line showing the work, e.g. `3/4 = (3 × 3)/(4 × 3) = 9/12`, and a RecutBars picture when the LCD is 48 or less.

**CFU (2 of 4 typed):**
1. Typed, from the lists: "The numbers in both lists are [12] and [24]. The LCD of 4 and 6 is [12]." Vocabulary in action.
2. "Ben uses 24 for 3/4 + 5/6. Is 24 a common denominator? [Yes] Is 24 the LCD? [No]." Both terms in one question, targeting the conflation.
3. True/false: "multiplying the denominators always gives a common denominator [True]" and "always gives the LCD [False]". Generalization trap.
4. Typed: "LCD [18]. 2/9 = [4]/18, 5/6 = [15]/18." Typing 54 or 36 is named: "54 is a common denominator, but not the least…".

**Practice buckets:**
- `multipleDen`, `coprimeDen` and `sharedFactor` share the ProblemType "Find the LCD".
- `mixedNumbers` has its own ProblemType. The wholes carry through unchanged, and half the problems have equal wholes so the fractions decide which is bigger.
- In `sharedFactor`, the five named pairs are drawn 70% of the time. Brute force reached all of 4&6, 6&9, 8&12, 10&15 and 12&16 (each ≈2,800 times per 20k), plus 4&10, 6&8, 6&10 and 9&12.

Each problem has 3 steps:
1. The LCD, typed. `diagnose` names the mistake for any common multiple that isn't the least ("192 is a common denominator, but not the least. Find the smallest number both 12 and 16 go into."), for the denominators added, and for "goes into one but not the other".
2. Rewrite both (two typed numerators).
3. "Which number is bigger?" (choice). Using the common denominator in reverse; the right answer changes each time.

**Test (10):**
1. LCD of a multiple pair (with list).
2. LCD of a coprime pair.
3. LCD of a shared-factor pair; any other common multiple gets the named feedback.
4. "X uses 24 … which is true?" Distractors: "24 is the LCD" (common = least) and "24 is not a common denominator" (only the least counts).
5. Which pair has an LCD smaller than the product? The distractors are coprime pairs, where the product is the LCD.
6. Rewrite one fraction (fixed denominator).
7. Rewrite both.
8. Rewrite mixed numbers.
9. Compare. Distractors: the smaller fraction (picked for bigger-looking numbers) and "equal".
10. How to rewrite. Distractors: multiply only the bottom; add to the top and bottom.

**CFU → bucket → Test:**
- LCD from lists → step 1 in all buckets → T1–T3
- common vs. least → `sharedFactor` + diagnose → T3, T4
- product isn't always least → `sharedFactor` → T5
- rewrite → step 2 → T6–T8

### Unit 3 — Adding and Subtracting Fractions (5.NF.1)
**Explore:** Add/Subtract toggle, steppers (denominators 2–12), and a 4-step walkthrough:
1. LCD (multiples shown)
2. Rewrite (re-cut bars)
3. Add/Subtract (result bar)
4. Simplest form, with the reason computed from the numbers ("10 and 12 can both be divided by 2", "12/12 makes 1 whole, so write a mixed number").

**CFU (all 4 have typed parts):**
1. The whole procedure typed: LCD [12], 2/3 = [8]/12, 1/4 = [3]/12, sum [11]/12.
2. "Leo found 1/2 + 1/6 = 4/6. Is 4/6 equal to the sum? [Yes] Is it in simplest form? [No]. 4/6 = [2]/[3]." Targets the equal-vs-simplest conflation.
3. True/false: "two fractions less than 1 always sum to less than 1: [False]". Then type 17/12 as [1] [5]/[12].
4. Typed: 3/2 − 2/4 → 3/2 = [6]/4, difference [4]/4, simplest form [1].

**Practice buckets:**
- "Add" covers `addPlain`, `addSimplify` and `addMixed` (improper → mixed number).
- "Subtract" covers `subPlain`, `subSimplify` and `subWhole` (lands on a whole number: 3/2 − 2/4 = 1, or 7/3 − 2/6 = 2; both 1 and 2 are reachable).

Each problem has 3 steps: LCD (diagnose), rewrite (two typed boxes), answer (`fraction`, simplest). The answer step's diagnose names these mistakes: added across, added the bottoms too, added the old tops, computed the difference instead of the sum (and the reverse), and subtracted across.

**Test (10):**
1–6. Compute, one per bucket.
7. Simplest-form choice. Distractors: the equal unsimplified answer (form trap), and the answer from working across tops and bottoms.
8. An improper sum to finish. Distractors: "improper is finished", and "1 + the whole top" (copied the top).
9. The LCD for a named shared-factor pair, typed; the product gets the named feedback.
10. Subtracting across, what went wrong? Distractors: "only needs simplest form" (value/form conflation) and "should have added".

**CFU → bucket → Test:**
- procedure → `addPlain` → T1
- equal vs. simplest → `addSimplify` / `subSimplify` → T2, T5, T7
- can pass 1 → `addMixed` → T3, T8
- lands on a whole → `subWhole` → T6

### Unit 4 — Adding and Subtracting Mixed Numbers (5.NF.1)
**Explore:** Add/Subtract toggle, steppers for both mixed numbers (denominators 2–8), and MixedNumberBars in LCD pieces. When the first fraction part is too small, a **"Borrow 1 whole"** button turns one solid whole into L/L pieces. The text explains it: "Borrow: take 1 whole from 5. 1 whole = 12/12. So 5 3/12 = 4 15/12." Addition shows the carry.

**CFU (all 4 have typed parts):**
1. Vocabulary: "Borrow means: [Take 1 whole and cut it into fourths]" (distractors: "Take 1 away from the denominator", "Switch the two fractions"), then "1 whole = [4]/4".
2. Typed: "5 1/4 = [4] [5]/4". The picture changes to show the borrowed whole once this is right.
3. True/false trap: Jo flips to 3/4 − 1/4, and that works: [False]. The bad feedback checks it by adding back. Then the real answer in simplest form: [2] [1]/[2] (2 2/4 gets the simplest-form message).
4. Typed, subtracting from a whole: 6 = [5] [3]/3, then 6 − 2 1/3 = [3] [2]/[3].

**Practice buckets:**
- "Add" covers `addNoCarry` and `addCarry`.
- "Subtract" covers `subNoBorrow`, `subBorrow` and `subFromWhole`.

Steps:
- Add: LCD, rewrite fraction parts (wholes carried), answer (simplest). A carry is forced by the simplest-form check: 5 19/12 → "pull out the wholes".
- Subtract: LCD, rewrite, **"Do you need to borrow?"** (choice; the answer changes by bucket), then a **borrow step** when needed ("5 3/12 = [4] [15]/12"), then the answer. Answers get named feedback for the two plan-named failures:
  - "It looks like you took the top fraction from the bottom one. You can't. Borrow 1 whole first."
  - "You borrowed, but you forgot to take 1 away from the whole number."
- `subFromWhole` skips the LCD and rewrite steps.

The approved plan asks for the borrow teaching to be in every "Show me". This lab's "Show answer" (non-early) shows the step's `explain`, so the borrow step's `explain` and the answer step's `explain` both carry the full borrow wording.

**Test (10):**
1–5. Compute in simplest form, one per bucket.
6. The borrow rewrite, typed.
7. Which problem needs borrowing? Distractor: a problem with a bigger second *numerator* that doesn't need borrowing once on the LCD.
8. Right answer vs. the flipped answer vs. the "forgot to take 1 from the whole" answer. All three are value-distinct by construction.
9. Carry to simplest form. Distractors: "5 19/12 is finished", and the dropped carried whole.
10. What borrowing does to 5 1/4. Distractors: "5 5/4" (didn't take the whole) and "4 1/4" (didn't add the pieces).

**CFU → bucket → Test:**
- borrow meaning → borrow choice + borrow step → T6, T10
- borrow rewrite → `subBorrow` → T4, T6
- flip trap → `subBorrow` diagnose → T8
- from a whole → `subFromWhole` → T5

### Unit 5 — Word Problems: Benchmarks and Making Sense (5.NF.2)
**Explore:**
- **"Find the benchmark":** a 0–1 BenchmarkLine with the closest benchmark ringed. Exact ¼ and ¾ say "exactly halfway… try another".
- **"Estimate a sum":** two fractions on a 0–2 line, an estimate diamond, then "Show the exact sum" with a reasonableness sentence.

**CFU (2 of 4 typed):**
1. Vocabulary on a number line: 3/8 → [1/2], 5/6 → [1].
2. Typed estimate: 1/8 → [0], 3/5 → [1/2], about [1/2].
3. "Leo says 1/8 + 1/3 = 2/11." True/false: makes sense? [False]. "2/11 is [less than] 1/3, but the sum must be [more than] 1/3." Combines the generalization trap with the reason.
4. A "how much more" story (7/8 − 1/3): estimate [1/2], exact [13]/[24] typed.

**Practice buckets:**
- `total` (join stories)
- `leftOrMore` (take-from, compare-longer and how-much-more-needed stories)
- `reasonable` (judge a claimed answer **before** computing)
- `mixedStory` (recipe, board and hike stories with mixed numbers)

Steps:
- `total`, `leftOrMore` and `mixedStory`: an estimate choice (number-ordered 0/½/1 steps), the LCD, then the exact answer in simplest form.
- `reasonable`: two benchmark dropdowns, "Does X make sense?" (Yes / too small / too big; the right answer changes), then the exact answer. Claims are the right answer, add-across (too small) or "rewrote tops, kept one bottom" (too big, capped at 3). Each claim is at least ¾ from the estimate.

The fraction pairs avoid near-ties with ¼ and ¾, the estimate stays within ¼ of the exact answer, and a sum never has an estimate of 0. All of this was verified by brute force.

**Test (10):**
1–2. Closest benchmark, from two separate pools (denominators 3–6 vs. 8–12).
3. Estimate.
4. Sensible?
5–7. One-step stories: total, left, compare or more-needed.
8–9. Mixed-number stories, add and subtract.
10. Which sum makes sense? Distractors: the add-across answer, and the bigger addend itself.

**CFU → bucket → Test:**
- benchmark vocabulary → estimate step in every bucket → T1–T3
- estimate → `total` / `leftOrMore` → T3, T5–T7
- add-across judged by benchmarks → `reasonable` → T4, T10
- "how much more" story → `leftOrMore` → T7

## Module Test (25 questions, passScore 20, stars at 23/20/18/15)

**Unit 1:**
- `addAcrossChoiceQuestion`
- `whyWrongQuestion`
- `sameSizeQuestion`
- `sumQuestion("medium","unitPlusNonUnit")` with the picture removed
- `whoIsRightQuestion`

**Unit 2:**
- `lcdQuestion("hard","shared")`
- `notLeastQuestion`
- `smallerThanProductQuestion`
- `rewriteBothQuestion(…, true)` (mixed numbers)
- `compareQuestion`

**Unit 3:**
- `computeQuestion` for `addSimplify` and `subWhole`
- `simplestChoiceQuestion`
- `improperChoiceQuestion`
- `subtractAcrossQuestion`

**Unit 4:**
- `mixedComputeQuestion` for `addCarry`, `subBorrow` and `subFromWhole`
- `borrowRewriteQuestion` with the picture removed
- `borrowMistakeQuestion`

**Unit 5:**
- `estimateQuestion`
- `sensibleQuestion`
- `storyQuestion("hard","moreNeeded")`
- `mixedStoryQuestion("hard","sub")`
- `biggerThanPartsQuestion`

## Files

**Created:**
- `src/pages/math-levels/MG10/MG10_AddingAndSubtractingFractionsLab.tsx`
- `src/pages/math-levels/MG10/MG10_AddingAndSubtractingFractionsLab_styles.css`
- `src/pages/math-levels/MG10/AddingAndSubtractingFractionsLab/lib/fractions.ts`, `lib/steps.tsx`, `lib/stories.ts`
- `.../diagrams/RecutBars.tsx`, `MultiplesList.tsx`, `BenchmarkLine.tsx`, `index.ts`
- `.../units/index.ts`, `WhyNotAcross(.tsx|Test.tsx)`, `CommonDenominators(.tsx|Test.tsx)`, `AddSubtractUnlike(.tsx|Test.tsx)`, `MixedNumbers(.tsx|Test.tsx)`, `WordProblems(.tsx|Test.tsx)`, `ModuleTest.tsx`
- `src/pages/math-levels/shared/components/CfuQuestion.tsx` (promoted, extended)
- `src/pages/math-levels/shared/diagrams/PieceBars.tsx`, `MixedNumberBars.tsx` (promoted)
- This report.

**Modified:**
- `shared/engine/types.ts`, `shared/engine/StepProblem.tsx`, `shared/engine/UnitTest.tsx`
- `shared/styles/lab-base.css`, `shared/diagrams/index.ts`
- `MG9/FractionOperationsLab/diagrams/index.ts` and `units/cfu.tsx` (now re-exports)
- `src/utils/levelSubsections.ts` (new `MG10` key)
- `VISUAL_COMPONENT_TODO.txt`: the MG10 entry is ticked [x] with reasoning, and the MG9 entry notes the promotion.
- `MATH_TSX_STYLE_GUIDE.txt`: two durable conventions — use the `fraction` step with `simplest` for fraction answers, and the retry lock is not K–1 only.

## Autonomous decisions beyond the approved plan

1. **The unit order is kept as 1→5.** The plan leaves the order to the curriculum checker. Each unit's estimate/benchmark idea depends only on Unit 5's own Explore, so moving it earlier later is a reorder of `units/index.ts`.
2. **Unit 2 bucket (d)** ("mixed numbers' whole parts carried through") became its own `mixedNumbers` bucket and ProblemType.
3. **Unit 1 is not about finding the LCD.** It gives the common pieces ("cut both into twelfths") so the unit stays conceptual, and doesn't use "LCD" before Unit 2 teaches it.
4. **The retry lock covers every non-clean solve**, not only simplest-form misses: Show answer, a wrong choice pick, or a second hint. This copies MK1 exactly. Simplest-form misses were made non-clean through `formMiss`.
5. **A wrong LCD that is a common multiple** (e.g. 24 for 4 & 6) is marked wrong with the named message. It counts as a normal wrong try, not a forced retry. Only simplest-form misses were specified as unclean.
6. **One final-answer layout everywhere:** whole box + fraction, with "Leave a box empty if you don't need it." The layout never hints whether the answer is proper, mixed or whole. `0 5/6` is accepted as equal to 5/6.
7. **"Show me" for borrowing:** this non-early lab has "Show answer" (after 3 wrong tries), which reveals the step's `explain`. The borrow wording lives there instead of a K–1-style `showMe`.
8. **Number ranges:**
   - Unit 1: denominators up to 12, sums below 1.
   - Units 2–4: the pair pools listed above, with the LCD up to 48.
   - Unit 4: wholes 1–5 (+) and 2–7 (−) to keep the bar pictures readable.
   - Unit 5: denominators {2,3,4,5,6,8,10,12}, with the LCD up to 40.
9. **Unit 5 estimates round each fraction part to 0, 1/2 or 1.** Mixed numbers use the same rule on the fraction part. Near-ties with ¼ and ¾ (within 0.05) are never generated.
10. **Bucket-family ProblemTypes** in Units 2–4 (e.g. "Subtract" = 3 buckets), so the borrow choice's answer changes within a type.
11. **The CFU gate is strict in this lab only.** I found that **30 other lab shells** (MG2–MG9, MG11, MM1) still treat `solved > 0` as passing the CFU, which conflicts with the "CFU gates everyone" requirement. I did not change them, because that changes live students' access across the curriculum. It is flagged here for the user.

## Verification

| # | Check | Result |
|---|---|---|
| 1 | `npx tsc --noEmit -p tsconfig.app.json` | **Pass** |
| 2 | `npx eslint` on every touched file | **Pass**: 0 errors. Only the pre-existing `react-refresh/only-export-components` warnings remain. |
| 3 | `npx vite build`, scanned for per-import warnings | **Pass**: no "does not provide an export" warnings. The only warning is the pre-existing chunk-size one. |
| 4 | No Test↔unit imports | **Pass** |
| 5 | No bare `useRef<T>()` | **Pass** |
| 6 | Brute force: 3,000 draws per bucket (Practice) and per test question, plus 20,000 independent re-derivations | **Pass, 0 issues** after one fix. Overlapping Unit 1 pools made two test questions identical; the pools are now disjoint. Also checked: every correct input is accepted, every simplest-form step rejects ×2 and improper forms with `formMiss`, there are no value collisions with distractors (except the intended equal-but-unsimplified distractors in "simplest form" questions), every bucket's hard edge is reachable, and the story templates were read for every name (singular/plural units, "did … use"). |
| 7 | Lab renders through the same dynamic import ProblemRenderer uses (`LEVEL_SKILLS.MG10`), with no console errors | **Pass** |
| 8 | Progressive reveal | **Pass**, from screenshots: re-cut labels stay hidden until the rewrite is done, the LCD tag shows only after step 1, result/borrow pictures on a wrong try show pieces but no numerals, and the estimate, claim and exact points appear only after their steps. |
| 9 | Enter on a typed step, then a choice step | **Pass**: no auto-selected choice, no feedback, and focus is not on a choice. |
| 10 | Dark mode palette | **Pass** (dark and light backgrounds switch). |
| 11 | Multi-box rule on CFU Q1 of every unit | **Pass**: Check is disabled with 0 or 1 boxes filled, each box gets its own red/green border, and "Not quite" appears only once all boxes are filled. |
| 12 | CFU gate | **Pass** for a new student and for a student with practice history but no CFU pass. The passed CFU stays on screen. |
| — | Retry lock (this lab's requirement) | **Pass**: an unsimplified answer gets the exact message; the wrap-up says "Solved, with help."; Next is disabled; the type switch is locked; the bar shows "Try one like it". Leaving Practice and coming back gives a fresh problem of the same type. A clean retry shows "Solved it! ⭐" and unlocks everything. |
| — | MG9 FractionOperationsLab after the promotions | **Pass**: renders, and the CFU grades correctly. |
| 13–16 | K–1 checks (help ladder, number pad, K–1 CFU) | Not applicable (grade 5). |
| — | English check (grade 5) | **Pass**: 4 flags left, all false positives (extraction joins and "which" questions). |

The browser checks used a temporary harness page (iPad portrait 820×1180, touch on, headless Edge), which has been deleted. The `dist/` folder from the build check was also removed.

Still worth a manual pass on a real iPad before calling this done. A headless browser can't confirm iOS Safari behavior, real touch feel (especially the stacked fraction boxes), or how a young student actually uses it.
