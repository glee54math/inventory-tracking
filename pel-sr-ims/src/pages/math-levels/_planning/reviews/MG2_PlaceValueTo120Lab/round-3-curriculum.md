# MG2 Place Value to 120: round 3 curriculum review (re-review, final round)

- **Lab:** MG2 PlaceValueTo120Lab ("Place Value to 120"), 5 units, 5 unit Tests, Module Test.
- **Round:** 3 (re-review). **Date:** 2026-11-17.
- **Grade band assessed:** K–1 (early-learner shell + KCheck CFUs). Audience: 1st graders seeing this for the first time and 2nd graders who are behind, alone on an iPad, weak readers, audio-first.
- **Inputs:** `round-2-curriculum.md`, `round-2-merged.md`, `round-2-fixes.md` (round-1 files for history), the shell, all changed unit/Test files, `ModuleTest.tsx`, `BaseTenBlocks.tsx`, `BlocksPair.tsx`, `HundredChart.tsx` (`hide`), `words.ts`.
- **Method:** I read the code for every round-2 change and re-traced the help ladder (wrong → wrong → Show me) for each changed problem type by hand. I did not run a browser or my own brute-force script this round; I relied on the fixer's 12,000-per-bucket run and iPad-size browser walk (`round-2-fixes.md` §5) for screen behavior and checked the generator logic by reading it. No shared file changed, so no cross-lab check was needed.
- **Waiting on the user (not re-raised, status only):** C1-14 Test item (`tenVsHundredChoiceQuestion`, still in the Unit 1 Test, unchanged), C1-15 (no 100–120 "how many?" bucket), pass score 9/10, the KCheck `CheckSequence` title, the Test engine reading signs aloud, and E2-37 (☐ spoken "blank"). All are still open, and round 2 did not make any of them worse.

## 0. Status of last round's fixes

| ID(s) | Status | Notes |
|---|---|---|
| C2-28 | Fixed | `biggerStep` has `tone: "c"` (`ComparingTwoDigitNumbers.tsx:283`). CFU items 2–3 pass `tone="c"` (:72, :87). No other "which one" step in the lab has a matching tone. |
| C2-29 | Fixed | The "Sticks and cubes" bucket now has a typed step ("5 tens and 3 ones is what number?") before the sign. About 1 in 3 draws don't match, so "=" is no longer fixed. The Test item and CFU item 4 use the same blocks-vs-number picture. The help ladder is good: a wrong try rings the sticks, Show me counts "10, 20 … 51, 52, 53". The copy risk the fixer noted is real but small (C3-42, Minor). |
| C2-30 + E2-36 | Fixed | `tenMorePickQuestion` (46 / 37 / 47, start marked) and typed `tenLessFromTensQuestion` replace the "digit" / "fast way" picks. Pools are kept apart (odd/even ones; no numbers like 40 in `tenLessNoCrossing`). U3 title and wrap-up reworded. No "digit" in student text. |
| C2-31 | Fixed | "8 + 5 = ☐ ones. What is 38 + 5? ☐" (`AddingTwoDigitOneDigitTest.tsx:185`). Only one right answer per box. |
| C2-32 | Fixed | `cross100NumberQuestion` asks for 101 or 102. `decadeCrossNumberQuestion` starts at 19/39/59/79, so it really crosses. `decadeCrossChoiceQuestion` uses the other tens, so neither prompt prints the other's answer. |
| C2-33 + E2-44 | Fixed | Numbers listed in random order (`ComparingTwoDigitNumbersTest.tsx:179–188`). |
| C2-34 | Fixed | Explore now counts on: the first cubes are numbered at once, each new cube appears and is numbered one per second, and "Make a new ten" stays gray until done (`BaseTenBlocks.tsx:140–171`; `AddingTwoDigitOneDigit.tsx:208–222`). Practice/CFU "Show me" still counts all from 1 (C3-43, Minor, outside the agreed scope). |
| C2-35 | Fixed | Dashed empty box where cubes would go, "0" on Show me (`BaseTenBlocks.tsx:175, 232–241`). Covers U2 exactTen/exactDecade, U2 CFU, and BlocksPair sides with 0 ones. |
| C2-36 | Fixed | Counting back hides the cell before until a wrong try (`CountingTo120.tsx:234`, `HundredChart` `hide`). |
| C2-37 | **Fixed, but caused a new problem** | U1 item 3 → `u1-jump` with the row line; U5 items 1–2 → `u5-newten`. But Explore's default (27 + 6) makes 13 ones, which is exactly CFU item 2's answer, and the new pointer now sends the student right to that "13" (C3-44, Minor). |
| C2-38 + E2-45 | Fixed | `Count by tens to ${amount}.` |
| E2-38 | Fixed | "How many tens? ☐ How many ones? ☐"; nothing after a box depends on its answer. |
| E2-39 | Fixed | Goal "Compare two numbers. Greater, less, or equal?" Accepted (these name the signs). |
| E2-40 | Fixed | "Add 6 cubes" / "Add 1 cube". |
| E2-41 | Fixed | Four shell lines as agreed (MG2 shell only). |
| E2-42 | Fixed | "10 of the ones make a new ten." throughout. |
| E2-43 | Fixed | "30! 3 tens!", "100! Keep counting!", "120! You did it!". |
| C2-39 + C2-40 | Fixed | Distractors now always under 100, with a third one-short choice; why-question choices all have numbers. I agree with the fixer's change: "The tens make 30" would have been a true statement. |
| C2-41 | Fixed | Step 3 Show me labels only the sticks; hold time matches. |
| E2-46 + E2-47 + E2-48 | Fixed | Edge-case stories and the double "=" wrap-up fixed. |

**Totals (20 Fix rows):** 19 Fixed · 1 Fixed, but caused a new problem (C2-37) · 0 Partly fixed · 0 Not fixed.

## 1. Verdict

**Ready for students.** Round 2 fixed both Majors that let a guesser through in Unit 3 (the colored answer box and the always-"=" problem) and the untaught "digit" Test items in Unit 4, without breaking anything I could find. There are **no Blockers and no Majors** left. The four remaining items are small: the biggest is that the new Unit 3 "Sticks and cubes" step can still be copied 2 times in 3 (C3-42).

## 2. Top changes (all optional at this point)

1. **C3-42:** In "Sticks and cubes" (Practice and Test), make the blocks not match half the time instead of 1 in 3.
2. **C3-44:** Change Unit 5's Explore default from 27 + 6 to 27 + 5, so the CFU pointer doesn't land on "13 ones", the CFU answer.
3. **C3-43:** Make Unit 5's Practice/CFU "Show me" for "How many ones?" count on, like Explore now does.
4. **C3-45 / C3-46:** Two polish items (an odd-looking but valid distractor; a rare near-duplicate Test pair).

## 3. Scorecard (changed parts weighted most)

| Unit | 1 Standards | 2 Audience | 3 Arc | 4 Unstuck | 5 Pictures | 6 Math | 7 Mastery | 8 Device |
|---|---|---|---|---|---|---|---|---|
| 1 Counting to 120 | OK (C1-15 with user) | Strong | Strong | Strong | Strong | Strong | Strong | OK (not re-checked on device by me) |
| 2 Tens and Ones | Strong | Strong | Strong | Strong | Strong | Strong | OK | OK |
| 3 Comparing | Strong | Strong | Strong | Strong | Strong | Strong | OK (copy 2 in 3, C3-42) | OK |
| 4 Ten More/Less, Tens | Strong | Strong | Strong | Strong | Strong | Strong | Strong | OK |
| 5 Adding Ones | Strong | Strong | OK (pointer shows answer, C3-44) | Strong | OK (Show me counts all, C3-43) | Strong | Strong | OK |

## 4. All findings (new this round; the last round-2 ID was C2-41)

### Unit 3: Comparing Two-Digit Numbers

**C3-42: Minor: "Sticks and cubes" step 1 can be copied 2 times in 3 (the fixer's note)**
- **Who it hurts:** the guesser, in the Practice "equal" bucket and the Test/Module `equalTrapQuestion`.
- **Evidence:** `ComparingTwoDigitNumbers.tsx:295–301` and `ComparingTwoDigitNumbersTest.tsx:85–92`: blocks differ from n only with probability 1/3. The story prints n ("Compare with 53") and the chart marks it, so typing the printed number is right 2/3 of the time, and tapping "=" is right 2/3 of the time on the Test item (fixer's run: "=" 67%/66%).
- **Judgment:** Not a Major. A copier is caught on 1 in 3 draws, and when caught, the help ladder (ring the sticks → Show me counts 10, 20 … 53) teaches exactly the missing idea. The bucket needs only one clean solve for mastery, so a lucky copier can slip through once, but Unit 3's other buckets and the 9/10 Test still check place value. It is a big improvement on round 2's fixed "=".
- **Fix:** Change `1 / 3` to `1 / 2` in both generators (keep the same mismatch rules). That gives "=" 50% and "<"/">" 25% each, so neither copying nor always-"=" is a good bet. Optional; if the user prefers more "=" practice, leave it.
- **Layer:** 7.

### Unit 5: Adding Ones to a Number

**C3-43: Minor: Practice and CFU "Show me" for "How many ones?" still counts all from 1 (the fixer's note)**
- **Who it hurts:** the behind 2nd grader who still counts all; they now see Explore count on (8, 9 … 13) but every Show me in Practice and CFU item 2 counts all (1, 2, 3 … 13).
- **Evidence:** `AddingTwoDigitOneDigit.tsx:318` (Practice ones step: `labels={{ ones: "count" }} countAlong` with no `countFrom`), :345 (`"1, 2, 3, up to ${b.sumOnes}"`), :63 and :114 (CFU item 2: "1, 2, 3, up to 13 ones").
- **Judgment:** The math is right and counting all is a valid fallback for a stuck student, so this does not block learning. But 1.NBT.4 / 1.OA.5 want counting on, and the lab now shows two different strategies for the same question.
- **Fix:** Pass `countFrom` to the ones-step Show me picture (Practice :318, CFU `addPicture` "ones" focus when `m === "show"`). Change the Show me line to count on: `Start at ${ones}. Count on: ${…ones+1 … sumOnes}. That is ${onesW(sumOnes)}.` and CFU item 2's showText to "Watch and listen: 8. Then 9, 10, 11, 12, 13 ones." Set `showMeHoldMs: countAlongMs(add)`. When `ones === 0`, keep the current count from 1.
- **Layer:** 4, 5.

**C3-44: Minor: CFU item 2's new "Look here" lands on its own answer (new from C2-37)**
- **Who it hurts:** a student who misses "38 + 5. How many ones now?" twice.
- **Evidence:** CFU item 2 (`AddingTwoDigitOneDigit.tsx:106–118`) answer is 13. Its pointer now targets `u5-newten` (:53) with "Tap Add. Count the cubes." Explore's default is 27 + 6 (:161–162): tapping Add counts the cubes to 13 and the banner says "7 and 6 make 13 ones." (:272). The builder rule flags an Explore spot that shows the CFU's own answer. Before round 2 the pointer went to a text line, so this is new.
- **Fix:** Change the Explore default `add` from 6 to 5 (27 + 5 = 32; 12 ones; 3 tens). That collides with no CFU answer (39, 13, 4, 43) and still makes a new ten. Update the comment at :47–48.
- **Layer:** 3.

**C3-45: Polish: "28 + 1" choice has the start number as a distractor (the fixer's note)**
- **Evidence:** `AddingTwoDigitOneDigitTest.tsx:215`: when add = 1, `b.total − 1` equals n (28 + 1 → 28 / 29 / 38).
- **Judgment:** Leave it. It is false, it names a real error (didn't add / started the count on 28), and it isn't a giveaway: a student who doesn't add picks it. No change needed. If the user wants to tidy it, draw add ≥ 2 for this item only.
- **Layer:** 6.

### Tests (Units 1 and 4)

**C3-46: Polish: two rare near-duplicate pairs in unit Tests**
- **Evidence:** U1: `range100to120Question` (n = 101 → "What comes after 101?") and `cross100NumberQuestion` ("100, 101. What comes next?") can both ask for 102 (about 3% of Tests). U4: `subtractMultipleOfTenExactQuestion` with 10 taken away ("What is 60 − 10?") and `tenLessFromTensQuestion` ("What is 10 less than 60?") can match (about 2%).
- **Fix (optional):** `range100to120Question` draws 102–118 (not 109); `subtractMultipleOfTenExactQuestion` draws `subTens` 2–6.
- **Layer:** 7.

## 5. Persona walkthrough highlights

- **The guesser in Unit 3 "Sticks and cubes":** sees "5 tens and 3 ones. Compare with 53." and types 53, the big number on screen. Two times in three that's right; then they tap "=" and get a star. The third time ("3 tens and 5 ones. Compare with 53."), 53 is wrong, the sticks get a ring, and on a second miss Show me counts "10, 20, 30, 31 … 35". "Try one like it" then gives the same kind of problem. This is the right ladder; C3-42 just makes it catch the guesser more often.
- **The behind 2nd grader in Unit 5:** Explore now shows 27 + 6 as "1 … 7" at once, then "8, 9 … 13" one cube at a time, aloud. Good. In the CFU, after two misses on "How many ones now?", the pointer sends them to tap Add, which counts to 13, the CFU answer (C3-44). In Practice, Show me counts all the cubes from 1 (C3-43), which is the habit Explore tries to move them past.
- **The first-timer with 0 ones (Unit 2, 70):** misses "How many ones?" and now sees a dashed empty box where cubes would go; Show me puts a big "0" in it. Before, nothing changed. Fixed.

## 6. What's working well

- Unit 3 no longer leaks answers by color, and every Unit 3 bucket now needs place value, not a glance.
- Unit 3's blocks-vs-number picture reuses the Unit 2 model ("5 tens and 3 ones is what number?"), so the equal case links the two units.
- Counting on in Unit 5 Explore is paced to the voice, and "Make a new ten" waits for it.
- Unit 4's Test now asks only things Practice teaches, and all its choice items have nameable distractors.
- Test item pools were kept apart on purpose (odd/even ones, 19/39/59/79 vs 28/48/68/88), so prompts don't print each other's answers.

## 7. Rule gaps

1. **Default Explore values vs CFU answers, including partial answers.** Builder rule to add: "Check every CFU item's answer, including in-between counts (e.g. '13 ones'), against what Explore shows at its default values and presets. When a CFU pointer is moved to a new Explore spot, re-check this."
2. **One strategy per model.** Builder rule to add: "When Explore models a strategy (count on, count by tens), Practice and CFU 'Show me' for the same step must use the same strategy, unless the student is starting from 0."
3. **Mismatch rate for 'is it equal?' problems.** Builder rule to add: "A problem whose answer can be 'the same' must not be 'the same' more than half the time in Practice or the Test."

## 8. What I could not check

- I did not run a browser or my own brute-force script this round. I relied on the fixer's run (12,000 per bucket, 5,000 per Test generator, 0 problems) and checked the logic by reading it.
- Real speech: the fixer's headless run didn't turn sound on, so the spoken count-on in Unit 5 and the Unit 3 Show me count were not heard. This is the same limit as earlier rounds; it needs a pass on a real iPad.
- Side-door retry checks (leave Practice and come back, reload) were not re-run; the shell's retry code did not change this round.

**Counts (new this round):** Blocker 0 · Major 0 · Minor 3 (C3-42, C3-43, C3-44) · Polish 2 (C3-45, C3-46).
