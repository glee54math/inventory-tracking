# MG10 Adding & Subtracting Fractions — summary

- **Lab:** `MG10_AddingAndSubtractingFractionsLab` (grade 5, 5.NF.1–2), 5 units plus a 25-question Module Test
- **Dates:** 2026-11-06 to 2026-11-07
- **Status:** built, reviewed twice and fixed. **Not committed.** Waiting on the user for one design decision and the rule changes below.

## Rounds

| Round | Curriculum check | English check | Fixes |
|---|---|---|---|
| 0 (build) | — | — | Built all 5 units, the Module Test and MG10 wiring. All checks passed. |
| 1 | 0 Blocker · 7 Major · 9 Minor · 4 Polish | 1 Blocker · 4 Major · 14 Minor · 6 Polish | 39 items: 37 fixed, 2 partly (as intended) |
| 2 | 0 Blocker · 0 Major · 3 Minor · 3 Polish | 0 Blocker · 0 Major · 4 Minor · 4 Polish | 11 items: all fixed |

The loop stopped after round 2, which found no Blocker or Major. The round-2 fixer ran the full checks itself: tsc, eslint, build, a 12,000-draw generator check, the grade-5 English script and an iPad-size browser walk. The main session re-ran tsc afterwards (pass).

## Biggest problems found and fixed

- **Unit 2 CFU** said two numbers were in both lists when the picture showed three, so a right reading could be marked wrong.
- **Unit 5** never made students choose the operation (the prompt printed it). "Does it make sense?" was "Yes" 69% of the time, and right claims could be copied. Students now pick "Which matches the story?" first, the verdicts are even, and stories vary so keywords don't work.
- **Units 1–2:** the Tests asked for things Practice always did for the student (naming the common pieces, listing multiples).
- **Retry lock:** switching units or reloading cleared "Try one like it". This is now fixed in MG10 **and in MK1–MK4 and MG1** (new `shared/engine/retryDebt.ts`).
- **"Carry"** was never taught and was worded four ways. It's now taught like "borrow", with a picture and a button.
- **Wording:** "Mixed" (practice option) vs "Mixed numbers", "top fraction" meaning position vs numerator, and a hint that read as the wrong procedure.

## Changes outside MG10

- `shared/engine/retryDebt.ts` (new); MK1, MK2, MK3, MK4 and MG1 shells (retry debt survives unit switches and reloads).
- `shared/engine/StepProblem.tsx`, `UnitTest.tsx`, `types.ts` (new optional `fraction` step, `NumberStep.diagnose`, retry lock without early-learner mode). These are optional additions; other labs are unchanged.
- Moved from MG9 to `shared/`: `PieceBars`, `MixedNumberBars` (new optional `ringLastWhole`), `CfuQuestion`. MG9 re-exports them and still works.
- `src/utils/levelSubsections.ts` (MG10 entry), `MATH_TSX_STYLE_GUIDE.txt`, `VISUAL_COMPONENT_TODO.txt`.

## Waiting on the user

1. **C1-20 + C1-03: unit order and benchmark checks.** Recommendation **B**: add a "Does your answer make sense?" step to Units 3–4, and bring benchmarks into Unit 1 (a 0–1 line in the add-across view, "Is it about right, too small or too big?" in place of the repeated "Who is right?" step). Unit 5 stays last. Options A, C and D are in `round-1-curriculum.md` §2a.
2. **C1-19 (skipped):** 5.NF.2's "same whole" idea (1/2 of a small pizza + 1/3 of a large one) isn't checked anywhere. Revisit with item 1.
3. **30 other lab shells** (MG2–MG9, MG11, MM1) still let practice history skip the CFU, which goes against "the CFU gates everyone". Not changed, because it affects live students.
4. **Rule and guideline changes** proposed by the checkers (not yet added):
   - Builder: Practice asks for everything the Test asks for, without help the Test leaves out.
   - Builder: in word problems, the student chooses the operation; prompts and labels don't give it away; templates vary wording and order so keywords don't work.
   - Builder: for choice steps decided by generator rejection, pick the answer first and check the balance.
   - Builder: a claim shown in a story never equals a later typed answer, and a wrong claim is shown exactly as the mistake makes it.
   - Builder: retry debt must survive leaving the unit (done in code; record the rule).
   - Builder: a new Practice step's skill must be shown in that unit's Explore; hints use only words taught so far.
   - English guidelines: add LCD, benchmark, borrow and carry to grade-5 "New in 5th"; add "mixed" (UI label vs math word) to the traps; link top/bottom to numerator/denominator once and never use them for screen position; checklist rows for "text vs picture" and for checking reviewers' own rewrites for giveaways; phrasal verbs taught in a later unit are avoided in earlier ones.
5. **Commit** when the user is ready. `scripts/seedMathLabPlanningItems.mjs` has admin credentials; don't commit it.

## Still needed

A manual pass in the running app, then a real 5th grader on a real iPad. Headless checks can't confirm touch feel or how a student actually uses it.

## Files

`round-0-build.md` (includes every CFU question, answer and reason), `round-1-*.md`, `round-2-*.md` in this folder.

## User decisions (2026-11-07)

- **Fractions must be stacked (handwritten form) everywhere.** Round 3 work order sent to the fixer (`round-3-user-request.md`). Added as a builder rule.
- **Unit order (C1-20 / C1-03):** on hold. The user wants to look into it before changing anything.
- **CFU gate:** practice history never skips the CFU. Fixed in all 30 older shells (MG2–MG9, MG11, MM1), with their comments updated, and the build-math-lab skill's "grandfather" wording removed. tsc passes.
- **Rules added:** builder rules 4 (claims in stories) and 6 (teach a step's skill before asking it), and every English-guideline change (rule 7).
- **Rules 1, 2, 3, 5:** explained to the user; waiting on their answer.
