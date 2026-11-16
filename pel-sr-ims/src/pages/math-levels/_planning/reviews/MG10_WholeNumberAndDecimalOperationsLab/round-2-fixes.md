# MG10 Decimal Place Value & Rounding — round 2 fixes

Round 2 (final) · 2026-11-15 · Work order: `round-2-merged.md` (8 Fix items).

## 1. Summary

**8 Fixed · 0 Partly fixed · 0 Needs decision · 0 Not fixed.**

One side effect needs a look: C2-03 makes the Unit 2 Test **11 questions** (Q9 is now two questions). To keep the old 90% bar (9 of 10), the pass score is now **10 of 11**. The unit's "Best test score" badge now reads "out of 11". The Module Test does not use Q9, so it still has 10 questions.

## 2. Items

| ID | Status | What changed | Where |
|---|---|---|---|
| C2-01 | Fixed | Greatest-of-three: half the time the 1-digit number wins (0.7, 0.65, 0.689). A quarter of the time the 2-digit number wins (0.72 > 0.7 > 0.689). A quarter of the time the 3-digit number wins (0.705 > 0.7 > 0.65). The order of the list is shuffled. The explanation uses the shown order and names the winner. This applies to Unit Test Q10 and Module Test Q5, which share one generator. Q8 (`shorterBigger`) already puts its two numbers in random order through `order()`. It keeps its purpose, so I made no change there. | `units/ReadingComparingDecimalsTest.tsx:111-158` |
| E2-13 | Fixed | `writeEveryPlace` now says "Write a digit in every place through the {place} place, even a 0." It reaches every rounding prompt in Practice, the Unit Test and the Module Test. I also changed CFU Q1–Q3. The old Test Q9 sentence is gone (see C2-03). | `lib/steps.ts:272-276`; `units/RoundingDecimals.tsx:34,54,72` |
| C2-03 | Fixed | Test Q9 is now two `roundStep`s, like Practice "Two places": "Round X to …" and then "Now round the same number, X, to …". Each step grades the written places with `padTo` (4.30, not 4.3). The pass score is now 10 of 11, and I added `ROUNDING_TEST_TOTAL = 11` for the badge. I made no shared-engine change. | `units/RoundingDecimalsTest.tsx:82-95,128-146`; shell `MG10_WholeNumberAndDecimalOperationsLab.tsx` (UNIT_TEST_TOTAL, line 271) |
| C2-02 + E2-15 | Fixed | The carry wrap-up now says "The 9 became 10. You wrote 0 and added 1 to the place on its left." | `units/RoundingDecimals.tsx:205` |
| E2-14 | Fixed | The expanded-form hint now says "Look at the number each box is times. 1/10 means tenths, 1/100 means hundredths, 1/1000 means thousandths. [100 means hundreds, 10 means tens, 1 means ones.] Find the digit in that place in {x}." CFU Q2 now uses "means" too. | `lib/steps.ts:144`; `units/ReadingComparingDecimals.tsx:92` |
| E2-16 | Fixed | The prompt now says "In 7.264, name the place of the 4." | `units/ReadingComparingDecimalsTest.tsx:88` |
| C2-04 | Fixed | The Explore "Build a decimal" has Hundreds, Tens and Ones steppers, so the whole part goes up to 999. Hundreds and Tens start at 0, so the first screen is still 3.042. The place chart adds its hundreds and tens columns, and the expanded form shows "3 × 100 + 4 × 10 + 3 × 1 + …". | `units/ReadingComparingDecimals.tsx:167-196` |
| E2 out-of-lane | Fixed (verified, no code change needed) | All of these strings are inside `<MathText>` or the engine's MathText, so they render stacked: the hint, the CFU Q2 message, Explore's "1/1000", the Key Idea and the Test review. In the browser, the visible text had 0 slash fractions (Unit 1 Explore + CFU, Unit 2 Test review). | screenshot `r2_cfu_q2_wrong.png` |

## 3. Changed files

All of these files are lab-local. No shared files changed, so no other lab is affected.
- `src/pages/math-levels/MG10/WholeNumberAndDecimalOperationsLab/lib/steps.ts`
- `src/pages/math-levels/MG10/WholeNumberAndDecimalOperationsLab/units/ReadingComparingDecimals.tsx`
- `src/pages/math-levels/MG10/WholeNumberAndDecimalOperationsLab/units/ReadingComparingDecimalsTest.tsx`
- `src/pages/math-levels/MG10/WholeNumberAndDecimalOperationsLab/units/RoundingDecimals.tsx`
- `src/pages/math-levels/MG10/WholeNumberAndDecimalOperationsLab/units/RoundingDecimalsTest.tsx`
- `src/pages/math-levels/MG10/MG10_WholeNumberAndDecimalOperationsLab.tsx` (unit test badge total)

## 4. New or rewritten student text

- `steps.ts:276` (all rounding prompts with p > 0): "Write a digit in every place through the {tenths|hundredths|thousandths} place, even a 0."
- `RoundingDecimals.tsx:34/54/72` (CFU Q1–Q3): "Round 3.462 to the nearest tenth. Write a digit in every place through the tenths place, even a 0." / the same for 2.996 to the hundredths / 5.749 to the tenths.
- `RoundingDecimals.tsx:205` (carry wrap-up): "The 9 became 10. You wrote 0 and added 1 to the place on its left."
- `steps.ts:144` (expanded hint): "Look at the number each box is times. 1/10 means tenths, 1/100 means hundredths, 1/1000 means thousandths. 100 means hundreds, 10 means tens, 1 means ones. Find the digit in that place in {x}."
- `ReadingComparingDecimals.tsx:92` (CFU Q2 message): "Don't copy the digits in the order you see them. 1/10 means tenths, 1/100 means hundredths, 1/1000 means thousandths."
- `ReadingComparingDecimalsTest.tsx:88`: "In {x}, name the place of the {d}."
- `RoundingDecimalsTest.tsx:92-93` (Test Q9a/b, the same sentences as Practice): "Round {x} to the nearest {place}." / "Now round the same number, {x}, to the nearest {place}." Both are followed by the write-every-place line when needed.
- Explore stepper labels: "Hundreds", "Tens".

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | Pass |
| `npx eslint` (6 changed files) | 0 errors. There are 6 `react-refresh` warnings, which is the existing pattern. |
| `npx vite build` | Pass. The only warning is the usual large-chunk one. |
| Test/unit import check | Pass. No `*Test.tsx` imports its unit. |
| Brute force, 20,000 runs each | 0 errors. Greatest-of-three: the right answer is always the true maximum, there are 3 distinct choices, the lengths are always 1/2/3 digits, and the explanation names the answer. Which number wins: 1-digit 9,670 (48%), 2-digit 5,347, 3-digit 4,983. The answer's place in the list is about even (6,611 / 6,605 / 6,784), so "pick the first" works 33% of the time. Test Q9: always 2 number steps, and `padTo` matches the place named in the prompt. The unit test builds 11 questions with pass score 10, and the Module Test builds 10. I printed and read sample prompts and hints. |
| `english-check --grade 5` | 0 of 67 strings are over the limit. The 3 flags are the existing ones: CFU true/false, "are mixed up", and the Explore "N place" template. |
| Playwright iPad portrait (820×1180, touch) | No page errors. Explore builder at 343.042: the chart shows hundreds and tens columns, the number name is right, and the expanded form is stacked. CFU Q2 with a wrong answer (5.63) gives the new message, with stacked fractions. Unit 2 CFU shows the new sentence. Unit 1 Test, 4 runs: Q6 and Q10 had shuffled orders with different winners (for example 1.75, 1.8, 1.776 and 3.4, 3.41, 3.306). Unit 2 Test: "Question 9 of 11" and "10 of 11" are the two parts, and the end screen says "aim for 10 out of 11". There were 0 slash fractions in visible text. |

I looked at these screenshots and then deleted them with the rest of the session scratchpad: builder steppers (they wrap to 2 rows on iPad, which is fine), the builder chart, CFU Q2 wrong, the Unit 2 CFU, the Test Q9b and Q10 screens, and the Test review. The temporary harness (`harness-mg10.html`, `src/__harness_mg10.tsx`) and the dev server were removed and stopped. I did not repeat the shell walk (CFU gate, dark mode) because those screens did not change.

## 6. Noticed, not fixed

- In the harness's bare Test view, the number box did not show on screen, though it was in the DOM and could be filled. This is probably only because the harness skipped the lab-shell CSS, but check it once in the real lab.
- The Unit 2 Test review and score now say "out of 11". If the user wants exactly 10 questions, one option is to drop Q8 (whole-number rounding, which Practice already covers) to get back to 10 with pass 9. That would be a plan change.
- Steppers for a whole part like 043 show Hundreds = 0. The number shows as 43, which is correct, but the 0 stepper is a small mismatch on screen.
