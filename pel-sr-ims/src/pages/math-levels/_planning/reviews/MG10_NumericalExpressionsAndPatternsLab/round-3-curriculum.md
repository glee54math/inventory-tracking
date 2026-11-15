# MG10 Expressions & Patterns: curriculum review, round 3 (re-review, final round)

- **Lab:** MG10 `NumericalExpressionsAndPatternsLab` ("Expressions & Patterns"), 5 units + Module Test
- **Round:** 3 (re-review of the round-2 fixes)
- **Date:** 2026-11-14
- **Grade band assessed:** 4th and up (Grade 5, first-time learners, no read-aloud), same as rounds 1–2.
- **Inputs:** `round-2-merged.md`, `round-2-fixes.md` (including "Noticed, not fixed"), my `round-2-curriculum.md`, the plan, and the user's decision that Unit 3 "Words to expression" has a build-it step. I did not read any round-3 English report.
- **How I checked:** I read every changed file: `lib/patternSteps.ts`, `lib/steps.ts`, `lib/reading.ts`, `lib/stories.ts`, `units/WhyParentheses.tsx`, `units/ReadingExpressions.tsx`, `units/ReadingExpressionsTest.tsx`, `units/ModuleTest.tsx`, `units/PrimeFactors.tsx`, `units/PrimeFactorsTest.tsx`, `units/Patterns.tsx`, the `isClean` change in `shared/engine/StepProblem.tsx`, the plot blank in `shared/components/CfuQuestion.tsx`, the sign-picker CSS in `shared/styles/lab-base.css`, and the lab CSS. I looked at the fixer's round-2 iPad screenshots (`scratchpad\r2\shots\`: U3 Explore, U3 build filled, U3 move step 3 wrong, U3 frame, U1 either step 4, U5 CFU Q3). I did not run my own browser pass or brute-force script this round.
- **Assumptions:** English-only rows (E2-xx) belong to the English checker. I checked that each landed in the code, but did not re-judge the wording.

---

## 0. Status of last round's fixes

| ID | Status | Notes |
|---|---|---|
| E2-20 + C2-03 | Fixed | Both traps are now false for every times pair (A always adds 1–6, k ≥ 2, `patterns.ts:52-53`). The right choice is the only one that repeats "{k} times" from the prompt (see C3-04, Polish). |
| C2-01 | Fixed | `isClean` treats `buildExpr` as a pick (`StepProblem.tsx:449`). Only MG10 uses this step kind, so no other lab changes. |
| C2-02 | Fixed | Many factors step 1 passes `allowSplit = false`, so a wrong try shows only n and the text cue (`PrimeFactors.tsx:301`). |
| C2-04 | **Fixed, but caused a new problem** | Ty's two expressions are now drawn and ringed while step 3 is asked (screenshot confirms). But step 3's answer is now always the opposite of what the student just saw in steps 1–2, so it can be answered without looking at Ty's pair (C3-01). This came from the option I suggested in round 2. |
| C2-05 | Fixed | Q3 uses its own add-2 / add-4 patterns, yMax 12, and a 520 px plane (about 36 px per row). Side effect, small: the typed pairs are now printed in the table right above (C3-03, Polish). |
| C2-07 + E2-24 | Fixed (fallback wording) | "Find the value of {expr}." The picture shows the same stored order, so text and picture agree. Acceptable. |
| E2-21 | Fixed | `PrimeFactorsTest.tsx:182, 203`. |
| E2-22 | Fixed | `reading.ts:187`. |
| E2-23 | Fixed | `missesTheTwo` in `reading.ts:160-172`; fires only for `addDouble`. |
| E2-25 | Fixed | Sentence frames in `timesStep` (both forms) and Expression to words step 2. The answer (k or j) is not on screen. |
| E2-26 | Fixed | `PrimeFactors.tsx:325`. |
| E2-27 | Fixed | `steps.ts:47-53`. |
| C2-06 | Fixed (choice wording adapted) | About 1 in 4 placement steps are + +, × ×, or + then −. The "Only … works." wording makes exactly one choice true in both cases. Step 4 in the either case asks for both inside parts, and the pair stays unworked until then (screenshot `u1-either-step4.png`). The fixer's wording change is correct and better than the agreed text. |
| E2-32 | Fixed | `WhyParentheses.tsx:330`. |
| C2-08 | Fixed | Module Test Q11 is a build from all 6 templates; Unit 3 Test Q2 draws subTimes / addDivide / timesSub. |
| C2-09 | Fixed | 2 × 2 sign grid; the build row is on one line at 820 px (screenshot `u3-build-filled.png`). Buttons are 40 × 38 px, small but usable for grade 5. |
| E2-28 | Fixed (split in two) | `ReadingExpressions.tsx:286-288`. |
| E2-29 | Fixed | |
| E2-30 | Fixed | |
| E2-31 | Fixed | |

**Totals (19 rows): 18 Fixed · 0 Not fixed · 1 Fixed, but caused a new problem (C2-04 → C3-01).**

Shared code: the `isClean` change, the CFU `plot` blank size and the `.expr-build-row` CSS are only reached by MG10 (grep: no other lab uses `buildExpr` or a CFU `plot:` blank). `FirstQuadrantPlane` itself is unchanged, so MM1 RatioLab is unaffected.

---

## 1. Verdict

**Ready for students.** Every round-2 item landed, nothing new is a Blocker or a Major, and the CFU gate, the `cfuJustPassed` latch, ≥ 40% typed CFU blanks and stacked fractions are intact. The one fix worth making before release is C3-01: in Unit 3 *Move the parentheses*, Ty's question now always has the opposite answer to the problem just worked, so a pattern-spotter can skip the thinking on that step.

## 2. Top changes (ranked)

1. **C3-01 (Minor):** Draw Ty's change/no-change independently (50/50) instead of always the opposite, so step 3 can't be answered from steps 1–2.
2. **C3-02 (Minor):** Split Unit 3 Explore Part 2 into three modes (× copies / bigger group / ÷ equal parts), one idea and one bar set per view.
3. **C3-03 (Polish):** In U5 CFU Q3, leave Pattern B's 3rd and 4th cells blank so the typed pairs need the rule, not a copy.
4. **C3-04 (Polish):** Give the U5 why step a trap that also says "{k}", so "times" in the prompt doesn't point at the answer.
5. **C3-05 (Polish):** Add one line to the Unit 1 Key Idea about when moving the parentheses doesn't change the value.

## 3. Scorecard (changed parts)

| Unit | 1 Standards | 2 Audience | 3 Arc | 4 Unstuck | 5 Pictures | 6 Math/miscon. | 7 Mastery | 8 Device |
|---|---|---|---|---|---|---|---|---|
| 1 Why Parentheses | Strong | Strong | OK (either case not in Key Idea, C3-05) | Strong | Strong | Strong | Strong | Strong (screenshots) |
| 2 Brackets & Braces | Strong | Strong | Strong | Strong | Strong | Strong | Strong | not re-run |
| 3 Reading Expressions | Strong | OK (Explore Part 2 heavy, C3-02) | Strong | Strong | Strong | Strong | OK (Ty step predictable, C3-01) | Strong (build row on one line) |
| 4 Prime Factors | Strong | Strong | Strong | Strong | Strong | Strong | Strong | not re-run |
| 5 Patterns | Strong | Strong | Strong | OK | Strong | Strong | OK (CFU Q3 copy, C3-03; keyword, C3-04) | Strong (36 px rows) |

---

## 4. All findings (new this round)

### Unit 3: Reading an Expression Without Solving It

**C3-01 · Minor · Layer 7**: In *Move the parentheses*, step 3's answer is always the opposite of steps 1–2.
- **Who it hurts:** The procedure-follower and the guesser, on Practice step 3.
- **Evidence:** `ReadingExpressions.tsx:502-504`: `change` is random, then `ty = changeCompare(!change)`. Step 2's explain says "The value changed." or "The value stayed the same." (line 526), and screenshot `u3-move-step3-wrong.png` shows steps 1–2 "stayed the same" → Ty's pair changes. After a few problems a student learns "Ty is always the opposite" and gets a clean solve on step 3 without looking at Ty's expressions. Steps 1–2 are still real typed work, and the Test's `changeStep()` is an independent 50/50, so the Test is fine. This is the side effect of the "opposite" option I suggested in round 2 (C2-04).
- **Fix:** Draw Ty's case on its own: `const ty = changeCompare();` (50/50, independent of `change`). Keep Ty's pair drawn and ringed as it is now. Keep the wrap-up "Sometimes it changes and sometimes it doesn't." Every problem no longer shows both cases, but Explore Part 3, CFU Q4 and the Test's `sometimesQuestion` already teach "sometimes". (Option if the user wants to keep "one of each" most of the time: opposite 60%, same 40%. Simpler to go fully independent.)

**C3-02 · Minor · Layers 2 and 8**: Explore Part 2 ("How big is it?") is a heavy screen in "× copies" mode. (Raised by the English checker as outside its lane; my call.)
- **Who it hurts:** The first-timer who pokes at the controls without reading.
- **Evidence:** `ReadingExpressions.tsx:267-296`. In "× copies" mode one view holds: a sentence, two steppers and a button, a first bar set (2 rows), a compare sentence, a second paragraph, and a second bar set (2 rows). The second bar set ("bigger group") always multiplies by the "Copies" value and ignores "Copies to compare", and its top row is the same picture as the first set's bottom row (`u3-explore.png`: three rows of "18,932 + 921" ×3 bars in a row). A student who taps "Copies to compare" sees only the top set change and may link the bottom set to the wrong control. Only one mode shows at a time, so it is not overwhelming, but it carries three ideas (copies vs 1, copies vs copies, bigger group) under one heading. The "÷ equal parts" mode is fine.
- **Fix:** Make the Segmented control three modes: "× copies" (Copies + Copies to compare, first bar set, compare sentence), "bigger group" (the "Both multiply by k, but one group is larger" sentence and its bar set, with only the Copies stepper and "New big numbers"), and "÷ equal parts" (unchanged). No new controls, and each view has one bar set and one idea. Practice "How big is it?" and CFU Q2/Q3 need no change.

### Unit 5: Two Rules, Two Patterns

**C3-03 · Polish · Layer 7**: CFU Q3's typed ordered pairs are copied from the table printed right above them.
- **Evidence:** `Patterns.tsx:94` shows Pattern B as `[0, 4, 8, 12]`, and the blanks ask for (4, 8) and (6, 12) (lines 97-100). The fixer noted this. The old Q3 used Q2's table, whose B cells the student had generated. The ≥ 40% typed rule still holds without these four (Q1 4, Q2 3, Q4 1 typed, all needing work), so this is only a small loss.
- **Fix:** Show Pattern B as `[0, 4, null, null]` in Q3's table (Pattern A stays full). The student finds 8 and 12 from "start 0, add 4" while forming the pairs. Change the miss message to "Pattern B adds 4 each time. Pattern A's term comes first."

**C3-04 · Polish · Layer 7**: In the why step, the right choice is the only one that repeats "{k} times" from the prompt.
- **Evidence:** `patternSteps.ts:99-108`. Prompt: "Why is every Pattern B term {k} times …?" Right: "… B adds {k} times as much each time." Traps contain no number. A keyword matcher picks it. A wrong pick still breaks the clean solve, so the harm is small.
- **Fix:** Replace the first trap with one that also uses k and is always false: "B starts {k} higher than A and adds the same number as A." (The second half is false for every times pair, because A adds 1–6 and k ≥ 2.) Keep "It works in the first column, so it works in every column."

### Unit 1: Why We Need Parentheses

**C3-05 · Polish · Layer 3**: "Either place works." is now right about 1 time in 4, but the Unit 1 Key Idea says only "Same numbers, different values."
- **Evidence:** fixer's note; `WhyParentheses.tsx:417-424`. Explore shows it only if the student picks + + or × × ("Both come out to X this time. Try other signs."), and the step's explain teaches it after the pick. It is not in the Test, so nothing is tested that wasn't shown.
- **Fix:** Add one sentence to the Key Idea: "With only + or only ×, the parentheses can go in either place. The value stays the same." (Leave the + then − case to the explain and to Unit 3's "sometimes".)

---

## 5. Assessment of the fixer's "Noticed, not fixed" list

| Fixer's note | My call |
|---|---|
| U1 either case: "+ then −" also gives "either"; Key Idea doesn't say so | **C3-05 (Polish).** The math is right, and it matches Unit 3's "sometimes". |
| U5 CFU Q3 typed pairs read off the table | **C3-03 (Polish).** |
| U5 CFU Q3 wrong plot gets the generic "Go across first, then up." | No finding. For a one-point miss on a 4-point line that is the right cue, and the table is on screen. |
| Sticky nav over full-page screenshots | No finding (screenshot artifact; the viewport is fine). |
| Old scratch files left in the scratchpad | No finding (not lab code). |
| Proposed rules wait for Stage 6 | Agreed; one more below. |

**English checker's out-of-lane note (Unit 3 Explore Part 2 too heavy):** I agree it is heavier than it needs to be. Minor, not Major: only one mode shows at a time and the CFU after it checks the ideas. See C3-02 for a split that removes, not adds.

---

## 6. Persona walkthrough highlights

- **The procedure-follower in Unit 3, *Move the parentheses*.** Problem 1: types 52 and 52, sees "The value stayed the same," then reads Ty's pair and works it out. Problem 3: notices Ty's answer has always been the opposite and taps it at once. Clean solve, no thinking (C3-01).
- **The guesser in Unit 3, *Words to expression* build step.** Taps a grouping at random; if wrong, the regroup message names the fix, but the clean solve is now gone (C2-01 fixed). The 50/50 is no longer free.
- **The first-timer in Unit 1, *Parentheses first*, either case (5 × 5 × 4 = 100).** Doesn't know the ×× rule, so finds both values (both 100) and picks "Either place works." Step 4 then makes them write both inside parts (25 and 20), and the explain says "The first steps are different, but both end at 100." That is good teaching for a case the Key Idea doesn't yet mention (C3-05).
- **The first-timer in Unit 4, *Many factors*, n = 40.** Types 3 × 13, sees only "40" and "Try dividing by 2, then 3, then 5." Must divide. The copyable split is gone (C2-02 fixed).

## 7. What's working well (keep)

- The build step: one-line row at iPad portrait, named mistakes (word order, "double it"), structure grading with commutative order, and now it counts against a clean solve when wrong.
- The fixer's "Only … works." wording for the placement step: exactly one true choice in every case, and "either" is now really possible.
- Ty's expressions drawn and ringed during step 3: the hint "Find the value both ways" now points at something on screen.
- Sentence frames for "times as large": the answer is never printed, and the named "you worked it out" / "MORE than" messages remain.
- U5 CFU plot at 520 px with yMax 12: rows are about 36 px, easy to tap.
- CFU gate, `cfuJustPassed` latch (shell lines 247-248, 291), ≥ 40% typed CFU blanks in every unit, no slash fractions.

## 8. Rule gaps (proposed for `math-lab-builder.md`)

1. **Under "Practice must not be passable without the math":** "When a later step's answer is built from an earlier step's result (the opposite case, the same case), check that the later step can't be answered from that link alone. Draw it independently unless the link is the point being taught."
2. **Under CFU / Test choices:** "If the prompt names a number or a key word ('{k} times'), at least one wrong choice must use it too, so the right choice can't be found by matching words."

## 9. What I could not check

- No browser run of my own this round; I relied on the fixer's round-2 screenshots (looked at) and the code. Not seen by me: dark mode, the number pad over the build row, the "bigger group" view at other numbers.
- No brute-force run of my own. The splits quoted (either 24%, Yes/No 51/49, template thirds) come from `round-2-fixes.md`; I checked the generator code behind each one. C3-01 holds by construction (line 504), so it needs no script.
- Real 5th graders and real iPad touch feel.

---

**Counts (new findings):** Blocker 0 · Major 0 · Minor 2 · Polish 3

| Severity | IDs |
|---|---|
| Blocker | none |
| Major | none |
| Minor (2) | C3-01, C3-02 |
| Polish (3) | C3-03, C3-04, C3-05 |

**Round-2 Fix items (19):** 18 Fixed · 0 Not fixed · 1 Fixed, but caused a new problem (C2-04 → C3-01).
