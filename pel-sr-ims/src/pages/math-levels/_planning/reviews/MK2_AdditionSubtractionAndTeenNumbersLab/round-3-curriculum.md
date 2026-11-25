# MK2 Addition, Subtraction & Teen Numbers: curriculum review, round 3

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` (6 units, 6 unit Tests, 30-question Module Test)
- **Round:** 3 (re-review, last round the workflow allows) · **Date:** 2026-11-21
- **Band assessed:** K–1 (K/1st first-timers plus behind 2nd graders, alone on an iPad, mostly non-readers, audio-first)
- **Evidence:** every unit, Test, the shell, the changed diagrams and the shared `KCheck` and `StepProblem` read; 312,000 Practice problems and 140,000 Test sittings re-run; all 25 CFU questions walked wrong three times in the browser; one demo and one Show me per unit timed at real speed; the Test pad measured at 10 screen sizes.
- **Assumptions:** D1, D2 and D4–D7 are settled and were not re-opened. C2-55 is logged shared code. The old unit titles in `plan.md` are known. Rows that are mainly about wording were checked for the change being present; the quality of the wording belongs to the English review, which I did not read.
- **Paths** are relative to `MK2/AdditionSubtractionAndTeenNumbersLab/units/` unless noted. Logs and screenshots are in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\1e6785ee-43bc-449f-859a-a32e5cfac3e8\scratchpad\r3`.

## 0. Status of round 2 fixes

**36 Fix rows: 33 Fixed · 0 Not fixed · 3 Fixed, but caused a new problem (rows 2, 6, 17).** Row 37 was Skip.

| Row | ID(s) | Status | Note |
|---|---|---|---|
| 1 | C1-06 | Fixed | A wrong try changes the picture on every step (script: 0 unchanged) |
| 2 | C1-27 | **Fixed, new problem** | No answer dots before a try. But the spoken hint can now name dots that aren't drawn: C3-61 |
| 3 | C1-12 | Fixed | D4 is in the shell's `retryItem`, including a retry carried over from an earlier visit. Read in code, not re-driven in the browser |
| 4 | C2-45 | Fixed | 0 repeated prompts in 140,000 sittings |
| 5 | C1-11 | Fixed | No picture on the Test item; "?" until a wrong try in Practice and CFU Q2 |
| 6 | C2-46, E2-50 | **Fixed, new problem** | 0 and repeated pairs no longer pass. But they also never lead to help: C3-60 |
| 7 | C2-47 | Fixed | The new row appears after a wrong sum. It can't be reached by repeats or 0: C3-60 |
| 8 | C2-48, E2-56 | Fixed | Dashed spot, arrow and 0 lines work, also in dark mode. Spacing note: C3-65 |
| 9 | C2-49 | Fixed | All keys on screen at every iPad size tested, including with Safari's toolbars |
| 10–13 | E2-48, E2-49, E2-51, E2-53 | Fixed | Change present |
| 14 | C1-17 | Fixed | Each group stays on its hand |
| 15 | C2-50 | Fixed | Browser: solve 20 goes to Explore, and "Let's check." is shown and spoken |
| 16 | C2-51 | Fixed | Picks ask about a new number |
| 17 | C2-52 | **Fixed, new problem** | New sets are in. But Unit 5's second set asks 1 + 1 while Explore opens on "1 + 1 = 2": C3-62 |
| 18 | C2-53 | Fixed | Blue known, orange missing |
| 19 | C2-54 | Fixed | Extras are numbered. Read in code |
| 20–25 | E2-52, E2-54, E2-55, E2-57, E2-58, E2-59 | Fixed | Change present; D6 titles in place |
| 26 | C2-56 | Fixed | Script: no distractor past 10 or negative |
| 27–29 | C2-57, C2-58, C2-59 | Fixed | |
| 30–35 | E2-60 to E2-64, English §5 | Fixed | Change present |
| 36 | D7 | Fixed | All 12 score points correct; `passScore` is 24 |

### The five items the fixer raised

| Item | Judgment |
|---|---|
| 1. Hint before a try names dots that aren't drawn | **Confirmed, Minor (C3-61).** Wider than the example: 19 of 52 core step kinds. The next try brings the picture in, so the student isn't left stuck |
| 2. Unit 6 still draws the ones | **Not a finding.** Compose step 2 and the "Listen" and "What does the 1 show?" Test items print no answer. The student must count on, or connect the picture to the written number. These are pictures to work from, which the builder rule allows |
| 3. Full CFU miss ladder | **Run on all 25 questions.** Every question gave a nudge, then a working "Look here" on the 2nd miss, then the shown answer on the 3rd, and the CFU stayed open after passing. Unit 2 Q3 is good. Unit 3 Q4 has one weak rung: C3-63 |
| 4. Demo pacing at real speed | **Passes.** At the default Slow voice setting, items came 1.29 to 1.31 seconds apart in all six demos. Controls and the Check stayed held until the end. In all six Show me demos, "Got it" stayed gray until about 1.5 seconds after the last number |
| 5. Test pad at 390×844 | **Not a finding for this audience.** No key needs a scroll at any iPad size tested. On a phone, 13 of 21 typed Module Test questions need a scroll from the top of the page, but every key is reachable and the pad never covers the picture. Worth revisiting only if students will use phones |

## 1. Verdict

**Ready after one small fix.** The lab teaches well and every round 2 fix holds, with no Blockers and no wrong math. The one thing to fix first: in "Now write another way," a child who repeats the same numbers or uses 0 is told to try again forever, and no picture or Show me ever comes.

**Counts: 0 Blocker · 1 Major · 3 Minor · 2 Polish**

## 2. Top changes

1. **Give the "write another way" step a path to help (C3-60).** This is the only change that should hold up release.
2. **Make hints true before a try (C3-61).** "Count the orange dots" over a "?" confuses the child who asks for help first.
3. **Stop Unit 5's re-check from showing its own answer (C3-62).** A one-line change.
4. **Give Unit 3 Q4's first miss something to look at (C3-63).**
5. **Keep the same teen number from being asked twice in one Test (C3-64).** Optional.

## 3. Scorecard

Layers: 1 Standards · 2 Audience · 3 Arc · 4 Unstuck · 5 Pictures · 6 Math · 7 Mastery · 8 Device

| Unit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| 1 Put Together and Take Away | Strong | Strong | Strong | OK | Strong | Strong | Strong | Strong |
| 2 Story Problems to 10 | Strong | Strong | Strong | OK | Strong | Strong | Strong | Strong |
| 3 Break Numbers Apart | Strong | Strong | Strong | **Weak: repeats and 0 never reach help** | Strong | Strong | Strong | Strong |
| 4 Make 10 | Strong | Strong | Strong | Strong | Strong | Strong | Strong | Strong |
| 5 Fast Facts to 5 | Strong | OK | OK | OK | Strong | Strong | OK | Strong |
| 6 Teen Numbers | Strong | Strong | Strong | OK | Strong | Strong | OK | Strong |

## 4. Findings

### Unit 3: Break Numbers Apart

**C3-60 · Major · Practice, "Now write another way" · Layer 4 · Row 6 new problem**
- **Who:** the first-timer and the behind 2nd grader. Swapping the numbers or using 0 are the most natural tries here.
- **Evidence:** only a wrong sum counts as a miss (`OwnWay.tsx:47–54`, `words.ts:29–31`). Browser: on 5 = 3 + 2, I entered 3 + 2, 2 + 3, 5 + 0 and 0 + 5, eight tries in all. Each time the only response was "Yes, that makes 5. Use new numbers." or "Put dots in both parts." The picture never changed, no hint opened, and Show me never appeared. Show hint only says "Make 5 with two new numbers." Exactly one new pair of numbers is left on every one of these problems (script, 20,000 draws), so a child who can't think of it has no help. The only ways out are typing a wrong sum by chance or leaving with "New problem." Screenshot: `r3/shots/ownway-loop.png`.
- **Why not a Blocker:** the student can still leave the problem.
- **Fix:** keep the first repeat or 0 as it is now, with no miss. On the **second** such try in the same problem, also call `onWrong()`. The new example row and "Look at the new row. Count both colors." then appear, and one more miss opens Show me. Keep the step's own line on screen.

**C3-63 · Minor · CFU Q4 · Layer 4**
- **Who:** the first-timer at "Break 8 into two parts."
- **Evidence:** after the 1st and 2nd miss, the nudge is "Make two groups. Make them the same." but the picture is still 8 blue dots that can't be moved (`DecomposingNumbers.tsx:104–105`; browser: picture unchanged). The 2nd miss's "Look here" and the 3rd miss's picture do work, so the student is not stuck.
- **Fix:** in `wrong` mode, draw the 8 dots in rows of 4 and 4 in one color with a gap, and say "Look: two groups. Count one group." This points strongly without printing a number.

### Unit 5: Fast Facts to 5

**C3-62 · Minor · Second CFU set, Q3 · Layer 3 · Row 17 new problem**
- **Who:** any student on a re-check.
- **Evidence:** the second set asks `1 + 1 = ☐`. Row 17 made Same two open on 2 + 2, but Explore still **opens in Add on 1 + 1** (`FastFactsWithin5.tsx:118, 132–133`). Browser: with Q3 on screen, the line above it still reads "1 + 1 = 2." Screenshot: `r3/shots/u5-recheck-q3.png`.
- **Fix:** use `startFor` for Add too, and for the second round open Add on 1 + 3. That total, 4, is not an answer in the second set (5, 3, 2, 1). The first `useState` values for `a` and `b` must use it as well.

### Several units

**C3-61 · Minor · Practice, Units 1, 2, 3, 5, 6 · Layers 4 and 5 · Row 2 new problem**
- **Who:** the child who taps Show hint before trying, which is what a stuck non-reader is likely to do.
- **Evidence:** script: on **19 of 52 core step kinds (31.6% of step draws)**, the hint before a try names something the picture doesn't draw. Examples: "The faded dots went away" with no faded dots (Units 1, 2, 5); "Count the orange dots" over a "?" (Units 2, 3) or a bare fact (Unit 5); "Look at the dots. Count them." with no dots (Unit 5); "Count the dots outside the ten" over a "?" (Unit 6). One try brings the picture in and makes the line true, so this is confusing but not a dead end.
- **Fix:** reword so the line is true both before and after a try, without bringing the answer dots back:
  - Faded dots: `${b} went away. Count the dots left.`
  - Faded fingers: `Put ${down} down. Count the fingers up.`
  - Orange over a "?": `Start at ${a}. Count up to ${total}.`
  - Unit 3 same parts: "Make two groups. Make them the same."
  - Unit 5 add and doubles: "Hold up your fingers. Count them all."
  - Unit 5 missing 0: `You have ${s} already. Do you need any more?`
  - Unit 6 ones: `Start at 10. Count up to ${teen}.`

### Polish

- **C3-64 · Unit 6 Test · Layer 7:** the same teen number is asked in two forms in **30.6%** of sittings, such as "16 is one ten and how many ones?" and "16 = 10 + ☐." `noRepeats` compares exact wording only. **Fix:** in the Unit 6 Test, draw the "how many ones" items from different teen numbers.
- **C3-65 · Unit 5 Practice · Layer 5:** on a 0 fact with few dots, the dashed spot sits far from them at iPad width (`r3/shots/dark-zero.png`), so it reads less like "the other part." **Fix:** size the dots' wrapper in `withZeroSpot` to the dots instead of a 240-pixel basis.

## 5. Persona walkthrough highlights

- **First-timer who can't read, Unit 3:** she solves 5 = 3 + ☐, then hears "Now write another way." She types 2 + 3, then 5 + 0, then 3 + 2. The voice keeps asking for new numbers and the picture stays the same (C3-60).
- **Guesser, Unit 5:** he taps Show hint on "2 + 2 = ☐" and hears "Look at the dots," but there are none. He types a guess, the dots appear, and the hint now makes sense (C3-61).
- **Behind 2nd grader, Unit 2 Q3:** she types 4, hears "That is one color. Count both colors," and is taken to the two-color spot on her 2nd miss. On the 3rd, the dots are counted for her. This ladder works as intended.

## 6. What's working well

- All 25 CFU questions have a working miss ladder, and none of the Look-here spots shows that question's answer in the first set.
- Demos are paced to the voice, and buttons wait for them.
- A missed two-button pick now acts the story out, which was the biggest gap in round 2.
- Test pictures no longer give answers away, repeats are gone, and the pad fits every iPad size tested.
- Math and distractors are clean across 312,000 Practice problems and 1,800,000 Test questions.
- Dark mode is readable for the new 0 spot and "?" pictures.

## 7. Rule gaps (proposed for `math-lab-builder.md`; not applied)

1. "A true answer that doesn't count (a 0, a repeat) must still lead to help: on the second such try, treat it as a wrong try so the picture and Show me can open."
2. "A hint can open before any try, so its words must be true of the picture drawn before a try."
3. "For a CFU with a second set, check the opening numbers of every Explore mode against that set's answers, not only the mode its pointer opens."

## 8. What I could not check

- Real iPad speech, touch and Safari layout, and real students. Safari's toolbars were simulated with shorter screens.
- Whether a real voice finishes each number inside its one-item beat. Speech was stubbed. Timing was measured at the default Slow setting only.
- The D4 retry and the Challenge's numbered extras were confirmed in code this round, not re-driven in the browser.
- The sentence-level English, which belongs to the English review.
