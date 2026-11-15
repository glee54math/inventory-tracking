# MG10 Expressions & Patterns — round 2 merged fix list

- Lab: MG10 `NumericalExpressionsAndPatternsLab`, Grade 5
- Round: 2 · Date: 2026-11-14
- Inputs: `round-2-curriculum.md` (0 Blocker · 0 Major · 5 Minor · 4 Polish; round-1 items 37 fixed, 2 fixed-but-new-issue), `round-2-english.md` (0 Blocker · 1 Major · 7 Minor · 5 Polish; round-1 items 17 fixed, 2 fixed-but-new-issue)
- After merging: 19 items → **Fix 19 · Skip 0 · Ask user 0**
- Not-fixed carry-overs from round 1: none.

Paths are relative to `src/pages/math-levels/MG10/NumericalExpressionsAndPatternsLab/` unless they start with `shared/`.

| ID(s) | Sev | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| E2-20 + C2-03 | Major | `lib/patternSteps.ts:94-108` (`whyTimesStep`) | Wrong choice "B adds more each time." is true for every times pair; "The first column shows it." is vague | Fix | Keep the right choice, reworded: "B's first term is {k} × A's first term, and B adds {k} times as much each time." Traps: "B adds the same number as A each time." / "It works in the first column, so it works in every column." Shuffled. |
| C2-01 | Minor | `shared/engine/StepProblem.tsx:444-455` (`isClean`); `shared/lib/buildExpr.ts:73-74` | Parentheses placement in the build step is a free 50/50 retry | Fix | In `isClean`, a `buildExpr` step with any wrong Check counts as a guess (only MG10 uses this kind). Keep the named regroup message. |
| C2-02 | Minor | `units/PrimeFactors.tsx:301` | Many factors pair step shows a correct pair (help split) after a wrong try | Fix | On the pair step show only the text cue after a wrong try ("Try dividing by 2, then 3, then 5."). Keep `helpSplit` for full-factorization steps. |
| C2-04 | Minor | `units/ReadingExpressions.tsx:490-513` | Move-the-parentheses step 3 asks about Ty's new expression that isn't drawn | Fix | Build step 3 from a pair drawn with the opposite change/no-change to steps 1–2, and draw both of Ty's expressions as `ExprView`s while step 3 is asked (focus on wrong try). Each problem then shows one change and one no-change case. |
| C2-05 | Minor | `units/Patterns.tsx:95`; `shared/components/CfuQuestion.tsx` | U5 CFU Q3 grid ~18 px per row | Fix | Change Q3 to points (0, 0), (2, 4), (4, 8), (6, 12) with yMax 12 (update the CFU's pattern text, typed pairs and feedback to match: A = 0, 2, 4, 6 add 2; B = 0, 4, 8, 12 add 4, still "2 times"), and give the CFU plane the same 520 px width as the Practice plot step if safe. Keep ≥ 40% typed CFU. |
| C2-07 + E2-24 | Minor | `units/ReadingExpressions.tsx:402` | "the expression you wrote" prints the stored order, not the student's build | Fix | Print the student's own build from `help.answers` if available cleanly; otherwise "Find the value of {expr}." without "you wrote". |
| E2-21 | Minor | `units/PrimeFactorsTest.tsx:170,198` | "What is wrong?" when answer can be "Nothing is wrong." | Fix | "Kim says the prime factorization of 20 is 5 × 2 × 2. Is anything wrong?" — same prompt for both forms. |
| E2-22 | Minor | `lib/reading.ts:154` | Build hint "Then add the last step" | Fix | "Which step do the words say to do first? Put the parentheses around it. Then write the last step outside them." |
| E2-23 | Minor | `shared/lib/buildExpr.ts:71`; `lib/stories.ts:148` | Wrong-number build message wrong for "double it" | Fix | `addDouble` template gets its own diagnose for a missing/wrong 2: "\"Double it\" means multiply by 2." |
| E2-25 | Minor | `units/ReadingExpressions.tsx:444`; `lib/reading.ts:28,43` | Echo question "X is how many times as large as Y?" | Fix | Use the CFU sentence frame with a number blank: "12 × (18,932 + 921) is __ times as large as 3 × (18,932 + 921)." (all forms) |
| E2-26 | Minor | `units/PrimeFactors.tsx:301` | "35 divides itself, but look for a smaller prime." | Fix | "35 is not prime. Which prime divides 35 evenly? Try 2, then 3, then 5." |
| E2-27 | Minor | `lib/steps.ts:47-52` (`outsideMarksStep`) | Marks treated as the groups; inverted sentence | Fix | Prompt: "Which marks hold the part you work out first?" Explain (first): "The part in parentheses is inside all the other groups, so you work it out first. Then keep working from the inside out." Explain (outside): "The {name} hold all the other groups, so they are on the outside. Then do the last step, outside all the marks." |
| C2-06 | Polish | `units/WhyParentheses.tsx:275-286` | "Either place works." is never right | Fix | About 1 in 4, use a ++ / ×× (or (a + b) − c) triple so "Either place works." is right; keep step 4 typed work meaningful in that case. |
| E2-32 | Polish | `units/WhyParentheses.tsx:308` | "Where do the parentheses go so 2 + 5 × 9 = 63?" prints a false-looking equation | Fix | "New numbers. Put parentheses in 2 + 5 × 9 so that its value is 63. Where do they go?" |
| C2-08 | Polish | Module Test; `ReadingExpressionsTest.tsx` Q2 | No build item in the Module Test; U3 Test build always `subTimes` | Fix | Module Test: swap the words→expression pick for `buildExprQuestion("medium")` with a random template. U3 Test Q2 template drawn from `["subTimes", "addDivide", "timesSub"]`. |
| C2-09 | Polish | build step sign pickers | Third number box wraps to a second line on iPad | Fix | Narrower sign picker (compact select or 2 × 2 small buttons) so the expression stays on one line at iPad portrait. |
| E2-28 | Polish | `units/ReadingExpressions.tsx:287` | "Same × 3, bigger group" | Fix | "Both multiply by 3, but one group is larger: 3 × (18,932 + 1,021) is larger than 3 × (18,932 + 921), because 1,021 is larger than 921." |
| E2-29 | Polish | `units/ReadingExpressions.tsx:274` | Stepper label "Compare with" has no unit | Fix | "Copies to compare". |
| E2-30 | Polish | `units/PrimeFactors.tsx:405` | Passive wrap-up | Fix | "29 is prime, so you write just 29." |
| E2-31 | Polish | `units/PrimeFactorsTest.tsx:200` | "break it down" | Fix | "{bad} is not prime. Kim needs to split it into primes." |

## Notes for the fixer
- Not a finding, but watch while editing: the English checker noted Unit 3 Explore Part 2 is now a heavy screen (2 modes, 2 steppers, 3 bar sets). Don't add more to it; if a change there makes it simpler, prefer that.
- Re-run tsc, lint, build, the brute-force generator run (including the new opposite-change pair in C2-04, the "either place" case in C2-06, and the build `isClean` change), and a browser pass on the changed screens (U5 CFU Q3 grid, build step layout at iPad portrait).

## Proposed rule and guideline changes (wait for Stage 6)
From curriculum (`math-lab-builder.md`):
1. A built or typed step with a two-way part (where parentheses go) counts as a pick for clean solves.
2. When one help picture is reused across steps, check it against each step's own answer.
3. Every wrong choice must be false; a true "not the reason" statement is never a distractor.

From English (`.claude/reference/english-for-math/`):
4. checklist.md §3 Giveaways: a distractor must be false, not just less complete (same as 3).
5. english-learners.md: avoid echo questions with the question word in the middle; use a sentence frame with a blank.
6. checklist.md §3: "What is wrong?" whose answer can be "Nothing" → ask "Is anything wrong?"
