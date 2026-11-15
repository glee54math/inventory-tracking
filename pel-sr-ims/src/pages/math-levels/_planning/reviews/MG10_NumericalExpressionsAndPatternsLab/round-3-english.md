# MG10 Expressions & Patterns: English review, round 3 (final re-review)

- **Lab:** MG10 `NumericalExpressionsAndPatternsLab` ("Expressions & Patterns")
- **Round:** 3 (re-review of the round-2 fixes) · **Date:** 2026-11-14
- **Grade assessed:** 5th (plan: 5.OA.1, 5.OA.2, 5.OA.2.1 CA, 5.OA.3). Text the student reads alone was also held to the 4th-grade limit (18 words a sentence).
- **Read-aloud:** none (MG6+ convention). Every sentence must work on the page. No voice to check.
- **Inputs:** `round-2-merged.md`, `round-2-fixes.md`, my `round-2-english.md`. I did not read any round-3 curriculum report.
- **Method:**
  - `english-check.cjs --grade 5` on the shell, the lab folder, `ExprBuilder.tsx`, `buildExpr.ts`, `FactorBoxes.tsx`, `factors.ts` and `FirstQuadrantPlane.tsx`: 337 strings, **0 over the length limit**, 9 flags. They are the same 9 as round 2, and all are fine for grade 5 ("Which number is NOT prime?", "in all" in worked stories, the CFU true/false prompts, "Which expression matches").
  - Bundled the five units and the Module Test with esbuild and printed real Practice problems (16 "Parentheses first" problems, 3 of each Unit 3 type, 30 "Two rules" problems, 12 Unit 2 problems) and 2 full Module Test draws. I read every prompt, choice, frame, hint, explanation and wrap-up.
  - Read the round-2 fix sites in the source, including the diagnose messages that the printer can't reach.

Paths are relative to `src/pages/math-levels/MG10/NumericalExpressionsAndPatternsLab/` unless they start with `shared/`.

## 0. Status of last round's English fixes

| ID | Round-2 problem | Status | Notes |
|---|---|---|---|
| E2-20 (+C2-03) | "Why times" trap was a true statement | **Fixed** | `lib/patternSteps.ts:103-108`. Right choice: "B's first term is 3 × A's first term, and B adds 3 times as much each time." Traps: "B adds the same number as A each time." (always false for a times pair) and "It works in the first column, so it works in every column." The second trap's conclusion is true, but its reasoning is the exact mistake CFU Q4 teaches against ("Look at every column, not just the first one."), so it is a fair trap. |
| E2-21 | "What is wrong?" when the answer can be "Nothing" | **Fixed** | `units/PrimeFactorsTest.tsx:182, 203`: "… Is anything wrong?" in both forms. Printed in the Module Test too. |
| E2-22 | "Then add the last step" | **Fixed** | `lib/reading.ts:187`. |
| E2-23 | Wrong-number message for "double it" | **Fixed** | `lib/reading.ts:192`: "\"Double it\" means multiply by 2." for a missing or wrong 2. One small gap remains for a wrong sign (E3-37, Polish). |
| E2-24 (+C2-07) | "the expression you wrote" | **Fixed** (fallback wording) | `units/ReadingExpressions.tsx:404`: "Find the value of (27 − 8) × 3." The picture shows the same order. |
| E2-25 | Echo question "X is how many times as large as Y?" | **Fixed** | All three places use the frame "Fill in the blank. Don't work it out." + "12 × (31,778 + 540) is [__] times as large as 3 × (31,778 + 540)." Printed for plain, ratio and Expression-to-words forms. One leftover word in a diagnose (E3-36, Polish). |
| E2-26 | "35 divides itself, but look for a smaller prime." | **Fixed** | `units/PrimeFactors.tsx:325`. |
| E2-27 | Outside-marks wording | **Fixed** | `lib/steps.ts:48-53`. Prompt "Which marks hold the part you work out first?"; both explanations read well for every printed expression, and each printed expression has a last step outside the marks. |
| E2-28 | "Same × 3, bigger group" | **Fixed** | `units/ReadingExpressions.tsx:287`, split into two sentences, "larger" only. |
| E2-29 | Stepper label "Compare with" | **Fixed** | "Copies to compare" (`:274`). |
| E2-30 | Passive wrap-up | **Fixed** | "29 is prime, so you write just 29." (`PrimeFactors.tsx:419`). |
| E2-31 | "break it down" | **Fixed** | "4 is not prime. Kim needs to split it into primes." |
| E2-32 | "Where do the parentheses go so 2 + 5 × 9 = 63?" | **Fixed** | "New numbers. Put parentheses in 3 + 17 − 8 so that its value is 12. Where do they go?" |

**Totals: 13 English Fix items. 13 Fixed, 0 Not fixed, 0 Regressed.** Three of the fixes left a small follow-on (E3-34 near C2-06, E3-36 near E2-25, E3-37 near E2-23); none of them undoes the fix.

New or changed text from the curriculum fixes, also checked: C2-01 (no new text), C2-02 (cue "Try dividing by 2, then 3, then 5."), C2-04 (label "Ty's two expressions:"), C2-05 (CFU Q3 new table and feedback), C2-06 (placement choices, step 4 and wrap-up), C2-08 (Module Test build item), C2-09 (sign buttons, symbols only).

## 1. Verdict

**The lab is ready from the English side.** Every round-2 English fix landed, nothing regressed, no sentence is over the limit, and every printed template is grammatical. The new issues are all Minor or Polish, and the main one is a wrap-up in the new "either place" case: it says "Moving the parentheses changed the value." and then, in the next sentence, "the parentheses can go in either place," without saying the second sentence is about new numbers.

## 2. Scorecard

| Part | Length (% over) | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / home | Strong (0%) | Strong | Strong | n/a | n/a | Strong |
| U1 Why We Need Parentheses | Strong (0%) | Strong | OK ("Find the part", E3-34) | OK (either-case wrap-up, E3-33) | n/a | OK |
| U2 Brackets and Braces | Strong (0%) | Strong | Strong | Strong | n/a | OK |
| U3 Reading an Expression | Strong (0%) | Strong | Strong | Strong | n/a | OK (Explore Part 2 still long; no new controls) |
| U4 Prime Factors | Strong (0%) | Strong | Strong | n/a | n/a | OK |
| U5 Two Rules, Two Patterns | Strong (0%) | Strong | Strong | Strong | n/a | OK (CFU Q3 table not introduced, E3-35) |
| Module Test | Strong (0%) | Strong | Strong | Strong | n/a | Strong |

## 3. All findings (new this round)

**Counts: 0 Blocker · 0 Major · 3 Minor · 2 Polish.**

### Unit 1: Why We Need Parentheses

**E3-33 · Minor · The either-case wrap-up seems to contradict itself**
- **Where:** `units/WhyParentheses.tsx:365-373` (`moveProblem` wrap-up), Practice "Parentheses first", about 1 problem in 4.
- **Exact text (printed):** "(6 × 8) + 5 = 53, but 6 × (8 + 5) = 78. Moving the parentheses changed the value. To get 12, the parentheses can go in either place."
- **Problem:** The two sentences sit side by side and are about different expressions, but nothing marks the switch. A literal reader sees "moving the parentheses changed the value" and then "they can go in either place" and can't tell which is true. The step-3 explanation used "Here," for this; the wrap-up drops it.
- **Breaks:** grade-5.md → Grammar (keep the referent clear); traps §6.6 (what a sentence points back to); english-learners.md (the same sentence pattern should mean the same thing).
- **Rewrite:** " With the new numbers, both places give 12, so moving the parentheses did not change the value." (Non-either case can stay: " To get 23, the parentheses go here: 5 + (6 × 3).")

**E3-34 · Minor · "Find the part in parentheses" means "find its value"**
- **Where:** `units/WhyParentheses.tsx:348`, new step 4 in the either case.
- **Exact text:** "Both places work. Find the part in parentheses in each one." Frame: "In (3 + 17) − 8, the part in parentheses is [__]. In 3 + (17 − 8), it is [__]."
- **Problem:** "Find the part" reads as "point to the part." The student is meant to type its value. The lab's one instruction is "Find the value of …" (grade-5.md → Watch for, "evaluate" vs. "value"). The frame below helps, but the prompt says something else.
- **Breaks:** grade-5.md → Watch for (pick one instruction and keep it); english-learners.md (one word, one meaning).
- **Rewrite:** "Both places work. Find the value of the part in parentheses in each one." (13 words.) The frame can stay.

### Unit 5: Two Rules, Two Patterns

**E3-35 · Minor · CFU Q3 shows new patterns without saying they are new**
- **Where:** `units/Patterns.tsx:84-112`, CFU Q3 (changed by C2-05).
- **Exact text:** "3. An ordered pair (A term, B term) puts the matching terms together. The first number tells how far across. The second tells how far up." Then a table A = 0, 2, 4, 6 / B = 0, 4, 8, 12. Wrong-answer message: "Use the 3rd and 4th columns of the table."
- **Problem:** Q2, just above, has Pattern A = 0, 3, 6, 9 and the same row names. Q3 now has a different Pattern A and B, but no sentence says so. A student who reads Q3 as "the same patterns" will look back at Q2's table, and "the table" in the wrong-answer message can point at either one.
- **Breaks:** checklist §3, Text vs. picture; traps §6.6 (a reference that can point to two things).
- **Rewrite:** Start Q3 with "Here are two new patterns." Wrong-answer message: "Use the 3rd and 4th columns of this table. Pattern A's term comes first."

### Unit 3: Reading an Expression

**E3-36 · Polish · "The question asks" after the echo question became a frame**
- **Where:** `lib/reading.ts:35` (`timesStep` plain diagnose).
- **Exact text:** "That's a value you worked out. The question asks how many TIMES as large. Count the copies instead."
- **Problem:** Since E2-25 there is no question, just "Fill in the blank."
- **Rewrite:** "That's a value you worked out. The blank asks how many TIMES as large. Count the copies instead."

**E3-37 · Polish · A wrong sign next to the 2 gets the general signs message**
- **Where:** `lib/reading.ts:192` with `shared/lib/buildExpr.ts:72`, build step for "Add 13 and 7, then double it."
- **Problem:** If the student uses the 2 but adds it, e.g. (13 + 7) + 2, the numbers match, so the "Double it" message is skipped and the student gets "Check the signs. Which words tell you to add, subtract, multiply or divide?" No word in "double it" says multiply, which is the point of E2-23.
- **Rewrite:** In the `addDouble` diagnose, also return "\"Double it\" means multiply by 2." when the sign next to the 2 isn't ×. Optional: write it as "\"double it\"" in lower case, so the student can find those words in the sentence.

### Checked and fine (new or changed text)
- Placement choices: "Only (7 + 3) × 7 works." / "Only 7 + (3 × 7) works." / "Either place works." Exactly one is true in every printed case, and "works" is tied to the prompt's "so that its value is …" and the hint's "Which ones make 28?".
- Either-case step 3 explanation, step 4 frame, hint and explanation ("The first steps are different, but both end at 12.").
- All E2-25 frames, including Expression to words: "10 × (8 + 4) is [__] times as large as 5 × (8 + 4)." and their hints and explanations.
- "Ty's two expressions:" label, with the step-3 prompt "Ty moves the parentheses in (17 + 29) − 11. He gets 17 + (29 − 11). Does the value change?"
- Module Test Q11 build ("Write an expression for these words: Add 12 and 2, then multiply by 5.") and Q20 ("Kim says the prime factorization of 24 is 3 × 2 × 2 × 2. Is anything wrong?").
- Unit 4 cues "Try dividing by 2, then 3, then 5." and "1 is not prime. Try 2, then 3."
- CFU Q3 good feedback: "Each B term is 2 times its A term."

## 4. What's working well
- **0 of 337 strings are over the limit** after three rounds of added text. The median longest sentence is 5–9 words.
- **One word for each idea held through all three rounds:** "larger," "divide … evenly," "inside out," "plot," "the part in parentheses," "Find the value of."
- **Sentence frames replaced echo questions everywhere,** so every "times as large" item now has the same shape as the CFU.
- **Wrong choices are now false statements** in the why step, the placement step and Kim's question, so literal readers are no longer caught by a true distractor.

## 5. Out of my lane (learning)
- **U1 either case:** the lab shows that + + and × × (and + then −) don't change the value, but never says why in Unit 1; Unit 3 Explore says it for + + and × × only. The fixer noted this too. A word in the U1 Key Idea may help.
- **U3 Practice "Move the parentheses":** the story says "Same three numbers, same signs," but step 3 uses Ty's different numbers. The new label helps; the curriculum checker may want the story to say "Then Ty tries his own."

## 6. Guideline gaps
- **checklist.md §3, new row "Switches":** "When one problem's steps reach opposite results (changes / doesn't change), each sentence in the wrap-up must say which part it is about ('With the new numbers, …')."
- **grade-5.md → Watch for, after "Evaluate":** "Keep the verb with 'value': 'Find the value of the part in parentheses,' not 'Find the part.'"
- The three round-2 proposals (false distractors, no echo questions, "Is anything wrong?") still wait for Stage 6; this round shows they work.

## 7. What I could not check
- Real students, and how the 2 × 2 sign buttons feel on an iPad.
- No voice: the lab is not read-aloud.
- Diagnose messages (wrong-answer text) were read from source, not triggered, except where the printed problems show them.
