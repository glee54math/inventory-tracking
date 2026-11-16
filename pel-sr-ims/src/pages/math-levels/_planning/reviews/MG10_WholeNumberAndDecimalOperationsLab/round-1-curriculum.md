# MG10 Decimal Place Value & Rounding — Round 1 curriculum review

- **Lab:** MG10 WholeNumberAndDecimalOperationsLab ("Decimal Place Value & Rounding"), Units 1–2 only (Units 3–5 on hold by user decision; not a finding).
- **Round:** 1 (full review). **Date:** 2026-11-15.
- **Grade band assessed:** 4th and up (Grade 5, first-time learners). Text-led reasoning, vocabulary and "is it always true?" traps are expected.
- **Standards checked:** 5.NBT.3a-b, 5.NBT.4 (CCSS reference file wording); prior: 4.NF.6-7 (MG9 DecimalsLab, tenths/hundredths only).
- **Assumptions / method:** code reading only (lib, steps, units, Tests, diagrams, shell, engine diff). I did not run a browser harness or my own brute-force script this round; the builder's 20,000-per-bucket run is cited where relevant but not re-run. Findings that depend on screen behavior are marked where unverified.

## 1. Verdict

**Ready for students after small fixes.** The arc is well built: every plan trap (0.45 vs 0.5, 0.5 vs 0.499, 4.026 vs 4.26, the 9-carry, 5.749, "nothing changes") is shown in Explore, checked in the CFU, drilled as a Practice bucket and tested. The biggest problem is that Test rounding answers like 2.996 → "3" are marked wrong for a missing trailing zero that the Test question never asks for, which can fail a student who has the math right (pass is 9/10).

## 2. Top 5 changes

1. **C1-01** Say "write every place" in Test/Practice rounding prompts where a trailing 0 is required, or accept the value (user decision).
2. **C1-02** Compare help shows the filled-in chart (0.450 / 0.500) on the first wrong try, which is the step-1 answer on screen; show the unfilled chart first, filled on the second miss.
3. **C1-03** The bars ruler can't show a 1–9 thousandths difference (0.45 vs 0.452 look the same), yet the Explore text says "the longer bar is the greater number."
4. **C1-04** Expanded form never shows whole-number places beyond ones (standard's example is 347.392).
5. **C1-05** Expanded-form typed steps (CFU Q2, Practice step 1, Test Q4) are copy-the-digits steps.

## 3. Scorecard

| Unit | 1 Standards | 2 Audience | 3 Arc | 4 Unstuck | 5 Pictures | 6 Math | 7 Mastery | 8 Device |
|---|---|---|---|---|---|---|---|---|
| 1 Reading/Comparing | OK (expanded form ones-only) | Strong | Strong | OK | Weak (bars can't show thousandths gaps; filled chart = answer) | Strong | OK (copy steps in expanded) | Not checked |
| 2 Rounding | OK (no rounding to thousandths; justified) | Strong | Strong | Strong | Strong | Strong | Weak (Test format trap on trailing 0s) | Not checked |

## 4. All findings

### Unit 2: Rounding Decimals

**C1-01 — Major — Test marks a correct rounded value wrong for a missing trailing 0**
- **Who it hurts:** first-timer and procedure-follower, Unit 2 Test Q4/Q5 (carry: 4.97 → 5.0, 2.996 → 3.00) and module test Q8; also any "up"/"down" case that lands on a 0 (e.g. 0.04 → 0.0).
- **Evidence:** `lib/steps.ts` `roundStep` → `decStep` sets `padTo: p`; `StepProblem.tsx` ~L270 rejects the right value with the wrong number of decimal places. `UnitTest.tsx` L71/L118 grades once with no feedback. The Test prompt is only "Round 2.996 to the nearest hundredth." Only CFU Q2 says "Write every place up to the hundredths." With pass 9/10, one format miss plus one real miss fails the unit.
- **Fix — Needs the user's decision:** (a) keep requiring 3.00 and append "Write every place up to the {place}." to every `roundStep` prompt (Practice and Test) so the rule is visible; or (b) accept the value (drop `padTo` grading for rounding, keep it for display in the answer key). CCSS 5.NBT.4 does not require trailing zeros. Option (a) is the smaller change.
- **Layer:** 7.

**C1-06 — Minor — Wrong "9 + 1 = 10" message on a round-down problem**
- **Who:** guesser, Practice "down" bucket when the place digit is 9 (e.g. 2.93 to tenths).
- **Evidence:** `roundStep` diagnose checks `noCarryValue` without checking that the answer rounds up; typing 2.1 on 2.93 → tenths gets the carry message, which describes a carry that shouldn't happen.
- **Fix:** guard the first diagnose line with `r === hi` (as the second line already does).
- **Layer:** 4.

**C1-07 — Polish — "Rounds to 0.0"**
- **Who:** first-timer, Practice "down" bucket with whole part 0 and place digit 0 (0.04 → 0.0).
- **Evidence:** `roundCase("down")` allows w = 0 and head digit 0; `twoPlacesCase` already excludes the "rounds to 0" case as confusing.
- **Fix:** in `roundCase`, `continue` when the rounded value is 0, as `twoPlacesCase` does.
- **Layer:** 6.

### Unit 1: Reading, Writing and Comparing Decimals

**C1-02 — Minor — First-miss help on Compare shows the typed answer**
- **Who:** guesser, Compare Practice step 1 ("0.45 is [ ] thousandths").
- **Evidence:** `ReadingComparingDecimals.tsx` `compareProblem` visual: `pointing(help, 0)` draws `<PlaceChart rows fill />`, which prints 0.450 and 0.500, so 450/500 can be read straight off after one try. Under the self-learning rule strong help is fine, but here the finished answer shows after one wrong try.
- **Fix:** on step 1 help, draw the chart without `fill` (the empty cells point at the missing places); add `fill` only on the second miss or in Show me.
- **Layer:** 5.

**C1-03 — Minor — Bars can't show a thousandths difference**
- **Who:** student with a gap, Explore preset "0.45 and 0.452", and Compare Practice step 2 help in the "thousandths" bucket (gaps of 1–9 thousandths, including 0.5 vs 0.499).
- **Evidence:** `DecimalBars.tsx` spans one whole across ~500 px, so 0.001 ≈ 0.5 px. The bars look the same length, while the text under them says "The longer bar is the greater number."
- **Fix:** when the two values differ by less than 0.01, draw the bars zoomed to the shared hundredth (e.g. 0.45 to 0.46, ten thousandth ticks), as `ZoomLine` does, or hide the bars and keep the chart for those pairs.
- **Layer:** 5.

**C1-04 — Minor — Expanded form only uses the ones place**
- **Who:** procedure-follower, later 347.392-style items (the standard's own example).
- **Evidence:** `expandedDec()` whole part 1–9; `expandedText` writes the whole part as one term. CCSS 5.NBT.3a: "347.392 = 3 × 100 + 4 × 10 + 7 × 1 + 3 × (1/10) + 9 × (1/100) + 2 × (1/1000)."
- **Fix:** let about a third of the expanded items have a 2- or 3-digit whole part, with blanks for the tens/hundreds (or the whole digits) too; mirror in Test Q4. If the user prefers to keep the lab decimal-only, note it as an intentional scope cut.
- **Layer:** 1.

**C1-05 — Minor — Expanded-form typed steps are copy steps**
- **Who:** procedure-follower, CFU Q2 (6.305 → 3, 0, 5), Practice expanded step 1, Test Q4.
- **Evidence:** the decimal is printed on the same line and the blanks are its digits in order. CFU typed share is still above 40% without Q2 (Q1 4.026, Q3 450/500 = 3 of 7 inputs = 43%), so the rule still passes, only just.
- **Fix:** make the typed part produce a value, e.g. "6.305 = 6 + 3 × 1/10 + [ ] × 1/100 + [ ] × 1/1000" mixed with "the 5 is worth [ ] thousandths", or ask for the digit of a named place in a shuffled order ("thousandths: [ ], tenths: [ ]"). Practice step 2 (short form → decimal) already does the real work and can stay.
- **Layer:** 7.

**C1-08 — Polish — No size picture of one thousandth**
- **Who:** student with a 4th-grade gap, Explore intro.
- **Evidence:** "10 thousandths make 1 hundredth" is text only; the PlaceChart and bars give no size picture.
- **Fix:** optional: a small zoom showing one hundredth split into 10 thousandths under the Build section.
- **Layer:** 5.

## 5. Persona walkthrough highlights

- **First-timer, Unit 2 Test Q5:** rounds 2.996 correctly to "3" (Practice let them recover from the format message with no penalty) and the Test marks it wrong with no explanation until the review screen (C1-01).
- **Procedure-follower, Unit 1 Compare:** learns "add zeros, compare as thousandths" well. The typed step 1 forces the real move, and the 0.5 vs 0.499 and 0.45 vs 0.450 cases stop "more digits wins." When stuck on 0.45 vs 0.452, the bars look identical, which works against "the longer bar is greater" (C1-03).
- **Student with a gap, Unit 2 between-step:** after a wrong try the chart boxes the place and fades the rest, so "keep the digits up to the place" is visible. The number line with halfway comes after step 1, and the dot only as help on step 2. This is a good help ladder.

## 6. What's working well

- Every plan bucket is a Practice bucket, a required bucket and a Test question (the table had no empty cells for 5.NBT.3b or 5.NBT.4).
- Named wrong-answer messages target real misconceptions: 4.26 for 4.026, "45 > 5", no carry / dropped carry, double-rounding 5.749, typing the number back.
- `exact` grading closes the 0.499-passes-for-0.5 hole. The engine change is additive and doesn't affect other labs (default path unchanged).
- Test distractors are each tied to a misconception (Q2 names, Q7 next-digit, Q10 which-rounds). The twoPlaces bucket blocks one-answer-per-number memorizing.
- CFU latch (`cfuJustPassed`) and `StackedFractions` wrapper are in place. Unit 2 CFU is 5 of 8 inputs typed.
- `reintroEverySolved: 20` on Unit 2 follows the plan.

## 7. Rule gaps (proposed for `math-lab-builder.md`)

- "If a typed answer must be written in a set format (trailing zeros, `padTo`, money), say so in the prompt of every Practice and Test step that grades it. The Test gives no feedback, so a format rule the student was never told is a hidden trap."
- "A bar or line model must make the difference it is used to show at least ~8 px wide; zoom the scale when two values differ only in the last place."

## 8. What I could not check

- Browser walk (wrong → wrong → Show me → Try one like it), iPad layout, speech, and edge-value screenshots of PlaceChart/ZoomLine/DecimalBars were not run this round.
- My own 10,000-trial generator script was not run. Generator correctness relies on the builder's 20,000-per-bucket report plus my reading of `roundAt`, `roundCase`, `comparePair` and the Test distractor guards, which found no math errors.
- Real students.
