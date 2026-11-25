# MK2 Addition, Subtraction & Teen Numbers: curriculum review, round 1

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` (6 units, 6 unit Tests, a 30-question Module Test; confirmed in `units/index.ts` and `units/ModuleTest.tsx`)
- **Round:** 1 (full review) · **Date:** 2026-11-21 · **Band assessed:** K–1 (K/1st first-timers plus behind 2nd graders, alone on an iPad, mostly non-readers, audio-first)
- **Evidence used:** every unit, Test, diagram and the shell, read in full; the shared `KCheck`, `StepProblem`, `UnitTest`, `Stepper`, `choice()` and `NumberPad`; and a brute-force run of every Practice bucket (20,000 problems each) and Test generator (4,000 each).
- **Not done:** no browser walkthrough. This review was limited to creating one file, and the walkthrough needs a temporary harness page. Anything that depends on seeing the screen is listed in section 8.
- **Assumptions:**
  - The plan says Units 2 and 5 need no CFU. The later user rule (every unit has a CFU) overrides it, and the code follows the rule.
  - File references are relative to `MK2/AdditionSubtractionAndTeenNumbersLab/units/` unless they name another folder.
  - Standards wording comes from the repo reference, which condenses them. K.OA.3's and K.NBT.1's "record" clauses are from my knowledge of the official text.
  - "Compare and start-unknown are not K" comes from the repo's `grade-K.md`. I tried to confirm it against the official situation table and could not open it.

## 1. Verdict

**Needs rework before students use it.** The CFU shell is sound, but three screens show false math, and a stuck student gets almost no teaching: no Practice step has a "Show me" demo, no picture responds to a wrong try, and no CFU has a "Look here" pointer yet.

**Counts: 3 Blocker · 29 Major · 10 Minor · 2 Polish**

## 2. Top 5 changes

1. **Fix the false math (C1-01, C1-02, C1-03).** A true fact is marked wrong in 29% of Unit 5 subtraction problems. A Test asks how many more Leo has when Leo has fewer in 39% of draws. Unit 2 Explore can show "3 − 4 = -1 blue crayons."
2. **Build the help ladder (C1-06, C1-07).** Each step needs a hint that points at the picture, then a Show me that counts along at about 1 second per item, with "Got it" held until it has played.
3. **Add the 25 "Look here" pointers and move Explore off the CFU's numbers (C1-04, C1-05).** The exact spots are in the table under C1-04.
4. **Make Test and Practice pictures honest and K-appropriate (C1-10, C1-11, C1-12, C1-27, C1-30).** Remove true/false, digit and strategy questions, the always-same answers, and pictures that show the answer.
5. **Make the models match the words (C1-15, C1-17, C1-23, C1-31, C1-32).** Fingers must match the story, teen ones go in a second ten-frame, and students must build and record number sentences themselves.

## 3. Scorecard

Layers: 1 Standards · 2 Audience · 3 Arc · 4 Unstuck · 5 Pictures · 6 Math · 7 Mastery · 8 Device (code read only)

| Unit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| 1 Putting Together | OK | Weak: T/F, symbol question | Weak: no pointers | Weak: no demos | Weak: fingers contradict story | Weak: 11 fingers | OK | OK |
| 2 Word Problems | Weak: compare, start-unknown | Weak: long abstract items | Weak: keyword teaching | Weak: no demos | OK | **Weak: false premise, -1** | Weak: fixed answers | OK |
| 3 Breaking Apart | Weak: no recording | Weak: T/F | Weak: no pointers | Weak: no demos | Weak: answer is its own color | Weak: swapped pairs | Weak: fixed answers | OK |
| 4 Making 10 | OK | Weak: strategy question | Weak: no pointers | Weak: no demos | Strong: ten-frame | OK | Weak: 4 fixed Test answers | OK |
| 5 Fast Facts | Weak: 1st-grade fact families | Weak: "You should know this" | Weak: no pointers | Weak: no demos | Weak: dots on fluency items | **Weak: true fact marked wrong** | Weak: one-button step | OK |
| 6 Teen Numbers | Weak: no recording, digit | Weak: digit, equation | Weak: no pointers | Weak: no demos | Weak: ones not grouped | OK | Weak: fixed answers | OK |

## 4. Findings

Every finding below was re-checked against the code. "Script" means the brute-force run.

### Blockers

**C1-01 · Blocker · Unit 5 Practice · Layer 6: a true fact is marked wrong**
- **Who:** every student, at "Which addition fact matches this subtraction fact?"
- **Evidence:** `FastFactsWithin5.tsx:207–222`. When the number taken away is 0, the right choice is `0 + 1 = 1` and the "wrong" choice is `1 + 0 = 1`, which is also true. Script: **29.0%** of this bucket.
- **Fix:** replace this step (see C1-42). If it stays, draw the number taken away from 1 or more, as the Test already does.

**C1-02 · Blocker · Unit 2 Test and Module Test · Layer 6: the question's premise is false**
- **Who:** every student. "Leo has 3 blocks. Ana has 7 blocks. How many more blocks does Leo have than Ana?" expects 4.
- **Evidence:** `WordProblemsWithin10Test.tsx:133–157`, reused in `ModuleTest.tsx:45`. Script: **38.9%** of draws.
- **Fix:** name the child who really has more, as Practice does (`biggerKid`/`smallerKid`). Also subject to C1-13.

**C1-03 · Blocker · Unit 2 Explore · Layer 6: impossible stories and a negative answer**
- **Who:** any student who taps the steppers.
- **Evidence:** `WordProblemsWithin10.tsx:139–140, 150–170`. Lowering Total leaves Known part above it: "There are 3 crayons… 4 of them are orange… 3 − 4 = -1 blue crayons." In Take from, "Sam had 4 crackers. He ate 7" is printed while the math quietly uses 4 − 4 = 0.
- **Fix:** when the first number changes, pull the second into range. Set Take from's max to `a` and Missing part's max to `a − 1`. Remove `Math.min(b, a)` from the display.

### Major: all units

**C1-04 · Major · All CFUs · Layer 3: no "Look here" pointers (expected in this review)**
- **Who:** the guesser and the first-timer on a 2nd miss.
- **Evidence:** no `look` prop and no `lookHereSpot` anywhere in MK2.
- **Fix:** add `look` to all 25 questions as mapped below, with `early` styling. Six two-button picks need a `twin` so that real choices remain at the 2nd miss. Each twin keeps the same kind of answer as its question.

| Unit · Q | Question (answer) | Explore spot to point to | `say` line | Change needed at the spot | Twin |
|---|---|---|---|---|---|
| 1 · Q1 | 3 and 2 together (5) | `u1-join`: Putting together picture + "join" sentence | Look here. Count both groups. | Default off 3 and 2 | |
| 1 · Q2 | 5, gives 2 away (3) | `u1-apart`: Taking apart picture | Look here. Count the ones left. | Switch mode; fade the part that leaves (C1-15) | |
| 1 · Q3 | More or fewer? (fewer) | `u1-apart-line`: key line | Look here. Some went away. | Add the line "Taking away leaves fewer." | "You have 8. 3 go away. More or fewer?" (fewer) |
| 1 · Q4 | 3 and 1 fingers (4) | `u1-fingers`: the hands | Look here. Count the fingers up. | One group per hand (C1-17) | |
| 1 · Q5 | Matches fingers (3 + 1 = 4) | `u1-sentence`: number sentence line | Look here. Together is plus. | Show + beside the join picture | "2 fingers and 3 fingers": 2 + 3 = 5 / 2 − 3 = 5 |
| 2 · Q1 | 3, gets 2 more (5) | `u2-addto`: Add to story + picture | Look here. Count them all. | Switch mode | |
| 2 · Q2 | 6, ate 2 (4) | `u2-takefrom`: Take from picture | Look here. Count the ones left. | Switch mode; fade eaten ones | |
| 2 · Q3 | 4 orange, 3 blue (7) | `u2-together`: Put together picture | Look here. Count both colors. | Switch mode; default off 4 and 3 | |
| 2 · Q4 | Who has more? (Mia) | `u2-compare`: lined-up rows | Look here. Line them up. | Lined-up rows; use other names (C1-22) | "Ana has 6. Leo has 2. Who has more?" (Ana) |
| 3 · Q1 | 7 is 4 and ? (3) | `u3-split`: split picture + sentence | Look here. Count the other part. | Default off 7 and 4 | |
| 3 · Q2 | 6 is 3 and ? (3) | `u3-ways`: "Move the part" control | Look here. Move one dot over. | Show a new split while the total stays | |
| 3 · Q3 | Another way to make 5? (yes) | `u3-ways` | Look here. There are more ways. | As above | "6 is 5 and 1. Is there another way?" (yes) |
| 3 · Q4 | 8 in two same parts (4) | `u3-same`: new "Same parts" button | Look here. Make both parts the same. | New button showing **10 as 5 and 5** | |
| 4 · Q1–Q3 | 6, 7, 2 and ? make 10 (4, 3, 8) | `u4-fill`: frame + Reveal button | Look here. Count the empty boxes. | Default n = 1 (reveals 9) | |
| 4 · Q4 | Do 5 and 4 make 10? (no) | `u4-full`: new line beside the frame | Look here. 10 fills every box. | Add the line "10 fills every box." | "Do 6 and 3 make 10?" (no) |
| 5 · Q1 | 3 + 1 (4) | `u5-add`: Addition mode | Look here. Start at the big number. | On request show 2 + 1 | |
| 5 · Q2 | 5 − 2 (3) | `u5-sub`: Subtraction mode | Look here. Some go away. | On request show 4 − 3, faded | |
| 5 · Q3 | 2 + 2 (4) | `u5-doubles`: Doubles mode | Look here. Both parts are the same. | On request show 1 + 1 | |
| 5 · Q4 | 1 + ? = 5 (4) | `u5-missing`: missing-number mode | Look here. How many more make 5? | On request show 3 + ? = 5 | |
| 6 · Q1, Q3 | One ten and 4 / 9 ones (14, 19) | `u6-count`: frame + new "Count on" button | Look here. Start at 10. Count on. | Default ones = 7 | |
| 6 · Q2 | 16 is one ten and ? ones (6) | `u6-ones`: the ones beside the frame | Look here. Count the ones. | Second frame (C1-31) | |
| 6 · Q4 | One ten and 3 ones (13) | `u6-write`: new line under the number | Look here. The ten comes first. | Add the line with the 1 and the ten in one color | "One ten and 2 ones": 12 / 21 |

**C1-05 · Major · All Explores · Layer 3: the default numbers are the CFU's numbers**
- **Evidence:** U1 3 and 2 (Q1, Q2) `PuttingTogetherAndTakingApart.tsx:115–116`. U2 4 and 3 print 4 + 3 = 7 in Put together (Q3) `WordProblemsWithin10.tsx:108–109`. U3 7 and 4 (Q1) `DecomposingNumbers.tsx:101–102`. U4 n = 6 (Q1) `MakingTen.tsx:73`. U5 2 + 2 = 4 (Q3) `FastFactsWithin5.tsx:96–97`. U6 ones = 4 (Q1) `TeenNumbers.tsx:91`.
- **Fix:** defaults U1 2 and 4 · U2 6 and 3 · U3 9 and 2 · U4 n = 1 · U5 1 and 1, with the per-mode values in the C1-04 table · U6 ones = 7. None of these shows the answer to a question that points there.

**C1-06 · Major · All Practice · Layer 4: help does not teach through the picture**
- **Who:** all three personas, on every problem type.
- **Evidence:** MK2 has **no** `showMe` line, `showMeHoldMs` or `pointing()` call. Show me therefore prints the `explain` line ("3 + 2 = 5.") and "The answer is 5." After a wrong try the picture only gets a ring.
- **Fix:** for every step add (a) a `pointing(help, i)` picture change that does not print the answer, (b) a `showMe` line written to be heard, (c) a demo for that step (numbers appear on dots one per second, the leaving part fades or gets an X, empty boxes fill one by one), and (d) `showMeHoldMs` sized to the demo. Branch on `help?.showMe && help.step === i`. Hints must name an action on the picture.

**C1-07 · Major · CFUs · Layer 4: "Watch and listen" shows nothing happening**
- **Evidence:** the show-it picture is identical to the question picture and nothing is counted in U1 Q1, Q3, Q4, Q5 · U2 Q1, Q3 · U3 Q1, Q2 · U4 Q4 · U5 Q3 · U6 all four. U2 Q2 (crackers) and U4 Q1–Q3 (boxes fill in) are the good models.
- **Fix:** on `mode === "show"`, number the dots one per second in time with the spoken count, and fade or fill as the line says.

**C1-08 · Major · All Explores · Layer 3: Explore is steppers plus paragraphs**
- **Who:** the first-timer, who taps what is big and does not read.
- **Evidence:** every Explore's teaching sits in a small text line under a static picture (e.g. `PuttingTogetherAndTakingApart.tsx:146–155`, `WordProblemsWithin10.tsx:143–182`). Nothing animates, tracks a step, labels dots or holds a button until seen.
- **Fix:** give each Explore one short guided "Watch" demo at about 1 second per item, with numbers on the dots and the next control held until it finishes. Keep the steppers as free play afterward.

**C1-09 · Major · Shell · Layer 7: the picker lets a student stop earning stars**
- **Evidence:** every unit has one problem type, so the picker offers only "Mixed" and that same type (`MK2_…Lab.tsx:308–314`). Tapping it earns "Only Mixed problems earn stars," which a non-reader cannot act on.
- **Fix:** render the picker only when `unit.problems.length > 1`, as MG2 does (`MG2_PlaceValueTo120Lab.tsx:310–312`).

**C1-10 · Major · Practice and Tests · Layer 2: true/false items**
- **Evidence:** Practice `WordProblemsWithin10.tsx:283`, `DecomposingNumbers.tsx:246`. Tests `PuttingTogetherAndTakingApartTest.tsx:157`, `WordProblemsWithin10Test.tsx:99`, `DecomposingNumbersTest.tsx:103, 119, 152`, `MakingTenTest.tsx:111`, `TeenNumbersTest.tsx:96`. Three reach the Module Test.
- **Fix:** replace each with one picture example, typed where possible: "6 is 3 and how many?" for equal parts, or "5 is 4 and 1. 5 is 2 and how many?" for more than one way.

**C1-11 · Major · All Tests · Layer 5: pictures give the answer away**
- **Evidence:**
  - The asked-for group is drawn as its own colored block in take-from, missing-part, start-unknown and decompose items (e.g. `PuttingTogetherAndTakingApartTest.tsx:35, 49, 63`, `WordProblemsWithin10Test.tsx:84`, `DecomposingNumbersTest.tsx:17, 31, 45, 62, 136`).
  - `fingersApartQuestion` draws only the fingers left (`:91`).
  - The 0-ones item prints "(no extra ones)" (`TeenNumbersTest.tsx:159`, `diagrams/TenAndOnes.tsx:36–39`).
- **Fix:** draw only what the question gives. Take-from: the whole group in one color, nothing marked. Missing part or decompose: the known part plus a "?" box. Fingers: the starting fingers. Keep pictures the student must work from, such as an unfilled ten-frame.

**C1-12 · Major · Practice and Tests · Layer 7: the right answer never changes**
- **Evidence (script):** always the same in Practice: "Both groups were there the whole time," "True" (U2, U3), "Yes" (compare), "No, there are other ways too," "A different way," "It includes a full ten-group," and "The tens digit (1)." In Tests: `thirdWayQuestion`, `verifyTruePairQuestion` (Yes), `verifyFalsePairQuestion` (No), `howManyTensQuestion` (1), `decomposeTeenTensQuestion` (10), and every T/F item.
- **Fix:** replace with typed steps or choices that use the problem's own numbers. Make each yes/no item true about half the time.

**C1-13 · Major · Unit 2 · Layer 1: compare stories exceed K · Needs the user's decision**
- **Evidence:** the plan's bucket, `WordProblemsWithin10.tsx:292–330`, two Test items and the Module Test. `grade-K.md:55` lists compare problems as not yet K; MG1 Unit 4 teaches them.
- **Options:**
  - **A (recommended):** replace "How many more?" with "Who has more?" using lined-up rows, which stays in K.CC.6 and matches the CFU.
  - **B:** keep it as an optional challenge with no stars and no Test.
  - **C:** keep it as is, with the fixes above.

**C1-14 · Major · Units 1–2 Tests · Layer 3: start-unknown is tested but never taught · Needs the user's decision**
- **Evidence:** `addToStartUnknownQuestion` in both Tests and `takeFromStartUnknownQuestion`. Practice's "before" steps only recopy a number from the story. `grade-K.md:55` marks start-unknown as not yet K.
- **Recommendation:** replace them with result-unknown or missing-part items. The alternative is to teach it in Explore and Practice first.

### Major: Unit 1

**C1-15 · Major · Explore · Layer 4: "Taking apart" labels are wrong**
- **Evidence:** `PuttingTogetherAndTakingApart.tsx:117, 141–149`. Steppers read "Whole group 3" and "Part taken apart 2" while the picture has 5 dots and the sentence says 5 splits apart.
- **Fix:** in this mode make the steppers Whole and Take away, with left = whole − take away, and fade the part taken.

**C1-16 · Major · Units 1, 2, 5 Explore · Layer 7: controls leave the unit's range**
- **Evidence:** the first stepper ignores the second. U1 can reach 9 + 3 = 12 while the hands stop at 10 (`:141–142, 161–162`). U2 Add to can pass 10 (`WordProblemsWithin10.tsx:139–140`). U5 shows 5 + 2 = 7 beside "Every fact here has an answer of 5 or less," and Doubles can inherit 5 + 5 (`FastFactsWithin5.tsx:130–136`).
- **Fix:** compute each stepper's max from the other, and reset values on a mode change.

**C1-17 · Major · Explore, CFU, Practice, Test · Layer 5: fingers contradict the story**
- **Evidence:** `diagrams/Fingers.tsx:52–55` fills hand 1 before hand 2. "2 fingers on one hand and 4 on the other" draws 5 and 1.
- **Fix:** give `Fingers` `left` and `right` counts, tinted to match the two groups, and use them everywhere.

**C1-18 · Major · Practice · Layer 4: the take-away hint is false for the picture**
- **Evidence:** `:220–222, 281–283`. "Count only the color that's still there," but both colors are solid until the step is done.
- **Fix:** on a wrong try, fade the part that left (`goneB` from `pointing`), then say "Count the ones left."

**C1-19 · Major · Practice · Layer 6: "one more finger" can need 11 fingers**
- **Evidence:** `:230–245`. Script: 3.0% of the bucket asks for 11 raised fingers while the picture stops at 10.
- **Fix:** keep the total at 9 or less for this step.

### Major: Unit 2

**C1-20 · Major · Practice, Explore · Layer 3: teaches keywords and names the operation first**
- **Evidence:** titles "An 'add to' story" and "A 'take from' story" (`:210, 231`). Hints and Explore say to "look for words like…" (`:147, 154, 217, 239`). The Add/Subtract step comes after the answer and is missing from three buckets.
- **Fix:** use neutral titles such as "Story problem," drop the keyword lines, and in every story have the student pick the matching number sentence. Vary the wording.

**C1-21 · Major · Practice · Layer 2: the missing-part story never names the colors**
- **Evidence:** `:278` "…are one color, and the rest are another color. How many are the OTHER color?" over blue and orange dots.
- **Fix:** "{total} crayons. {a} are blue. The rest are orange. How many are orange?" with an orange answer box.

**C1-22 · Major · Explore · Layer 5: the compare model is not lined up and can ask a false question**
- **Evidence:** `:171–181`. The rows sit side by side, unlike the CFU's lined-up rows, and it asks how many more Mia has even when Mia has fewer.
- **Fix:** stack with `alignLeft` and `ringFrom`. Ask "Who has more?" and use names that are not the CFU's.

### Major: Unit 3

**C1-23 · Major · Units 3 and 6 · Layer 1: students never record a decomposition**
- **Evidence:** K.OA.3 and K.NBT.1 both ask students to record with a drawing or equation (e.g. 5 = 2 + 3, 18 = 10 + 8). The lab only shows finished sentences or offers picks (`TeenNumbers.tsx:205–208`).
- **Fix:** add a typed step with boxes: "7 = 4 + ☐", then the student's own second way, and "16 = 10 + ☐". Include the total-on-the-left form.

**C1-24 · Major · Practice · Layer 6: a swapped pair is called a "different way"**
- **Evidence:** `DecomposingNumbers.tsx:182, 208`. "4 and 5" is presented as different from "5 and 4." Script: 8.0% of the second-way bucket and 3.9% of the large bucket.
- **Fix:** draw the second way so it is never the same two numbers in either order.

**C1-25 · Major · Practice · Layer 6: the "other way" example is the same way**
- **Evidence:** `:169`. For 3 and 1, the explanation says 4 can also be "3 and 1." Script: **58.5%** of the bucket.
- **Fix:** choose an example pair that differs from the one shown, in either order.

### Major: Unit 4

**C1-26 · Major · Test, Module Test · Layer 2: a test question about strategy preference**
- **Evidence:** `MakingTenTest.tsx:85–101` asks which is better, counting up or "recall," with a fixed answer. It measures no math and tells a student who counts that counting is wrong.
- **Fix:** replace it with a typed partner item without a picture, e.g. "8 and how many make 10?"

### Major: Unit 5

**C1-27 · Major · Practice and Test · Layer 5: fluency items show the answer as dots, and the hint shames**
- **Evidence:** `FastFactsWithin5.tsx:193, 215, 258` and the Test. The CFU correctly hides the dots, but Practice does not. The hint "You should know this fact without counting it out" (`:195, 217`) is a phrase the builder rules ban.
- **Fix:** show the fact alone (`factCard`). After a wrong try bring in the dots with "Count the dots." Tests show no dots.

**C1-28 · Major · Practice · Layer 7: a question with only one button**
- **Evidence:** `:261–265`. When the known number is 0, the distractor equals the answer and `choice()` removes it. Script: **28.4%** of the bucket shows a single button.
- **Fix:** use a distractor that cannot match, or replace the step (see C1-42).

**C1-29 · Major · Test, Module Test · Layer 5: the picture contradicts "n − n = 0"**
- **Evidence:** `FastFactsWithin5Test.tsx:158`. `partA={0}` draws all n dots solid orange for an answer of 0, so counting them gives a wrong answer.
- **Fix:** no picture, or all dots faded with `goneB` only as help in Practice.

### Major: Unit 6

**C1-30 · Major · Practice, Test, Key Idea · Layer 2: "digit" questions exceed K**
- **Evidence:** `TeenNumbers.tsx:145–147, 165, 207, 224`; `TeenNumbersTest.tsx:80, 117`. `grade-K.md:46` lists *digit* as not yet, and the choices cannot be understood without it.
- **Fix:** ask through the picture: "Which part is the 10?" with the frame and the ones as tap targets, or "16 is 10 and ☐."

**C1-31 · Major · All screens · Layer 5: the ones are not grouped**
- **Evidence:** `diagrams/TenAndOnes.tsx:41–43` draws up to 9 ones in one ungrouped row. The builder's model puts leftover ones in a second frame.
- **Fix:** draw the ones in a second `TenFrame`, in the ones color, so 16 reads as a full frame and 5 + 1.

**C1-32 · Major · Explore · Layer 1: students never see ten ones become the ten**
- **Evidence:** `TeenNumbers.tsx:110–117`. The frame arrives already full, and the stepper only changes the ones. K.NBT.1 is about ten ones and some more.
- **Fix:** add a "Build it" demo: count ones into the frame to 10, one per second, then keep counting into the second frame (11, 12, …).

### Minor

- **C1-33 · Practice · L7:** typed follow-up steps only copy a printed number, 100% of the time: U1 addTo step 2 (`:204`), U1 takeFrom step 2 (`:223`), U2 compare step 3 (`:327`). Replace with a step that needs the idea, or drop them.
- **C1-34 · U1 CFU · L8:** two questions are numbered 4 (`PuttingTogetherAndTakingApart.tsx:74, 87`). Number the last one 5.
- **C1-35 · U2 Test · L1:** `addOrSubtractChoiceQuestion` goes past 10 in 40% of its add stories (`:42–43`). Keep the sum at 10 or less.
- **C1-36 · U4, U6 Tests · L3:** "10 and 0 more" items (`MakingTenTest.tsx:158`, `TeenNumbersTest.tsx:156`) are never taught. Remove them or add them to Explore and Practice.
- **C1-37 · U4, U5 · L7:** the re-check every 20 solves repeats the same fixed questions, so it tests memory of those screens. Give the re-check a second fixed set of numbers.
- **C1-38 · U1 Q2, U3 Q1–Q2 CFU · L5:** the answer is its own colored group, so counting it skips the idea. Show the known part and a "?" until the first miss.
- **C1-39 · U5 · L2:** Explore and the Key Idea stress "SPEED," but nothing measures it. Don't add a timer for K; say "Try to remember it," and let repeated practice build speed.
- **C1-40 · All · L2:** Goals and Key Ideas are multi-sentence paragraphs above the activity. Shorten to one spoken idea with a picture. (Wording belongs to the English review.)
- **C1-41 · Shell · L2:** "Standard K.OA.1" shows on the student screen (`MK2_…Lab.tsx:262`), which names a grade level. Hide it from students. This may apply to other shells; I did not check them.
- **C1-42 · U5 Practice/Test · L1:** "Which addition fact matches?" (fact families, 1.OA.4) and "also shows this fact" (order, 1.OA.3) go beyond K.OA.5. Replace with a second fact of the same kind.

### Polish

- **C1-43 · SplitGroup · L5:** the gap between parts pushes later dots out of column, so rows of 5 stop lining up on two-row pictures. Keep columns fixed and mark the split with color and the divider.
- **C1-44 · U3 Explore · L2:** "{total} has {total + 1} different pairs" counts swapped pairs and 0 as separate ways, which conflicts with C1-24. Say "There are many ways."

## Standard coverage

| Standard part | Unit | Practice bucket | Test | Status |
|---|---|---|---|---|
| K.OA.1 objects, fingers, equations | 1 | addTo, takeFrom, fingers, equation | Yes | Covered; fingers model wrong (C1-17) |
| K.OA.2 add to, take from | 2 | addToResult, takeFromResult | Yes | Covered |
| K.OA.2 put together, take apart | 2 | putTogetherTotal, putTogetherAddend | Yes | Covered |
| K.OA.3 pairs, more than one way | 3 | all four | Yes | Covered |
| K.OA.3 **record** | 3 | none produce it | none | **Gap (C1-23)** |
| K.OA.4 partner for 1–9 | 4 | small, near-ten, middle, verify | Yes | Covered |
| K.OA.5 within 5 | 5 | all four | Yes | Covered; pictures undercut fluency (C1-27) |
| K.NBT.1 compose, decompose | 6 | composeTeen, decomposeTeen | Yes | Covered; ten-ones idea thin (C1-32) |
| K.NBT.1 **record** | 6 | pick only | pick only | **Gap (C1-23)** |

## Standing requirements

| Requirement | Status |
|---|---|
| 1. KCheck one at a time, picture, number pad, few words | **Met** in structure |
| 1. At least 40% typed | **Met:** 19 of 25 (76%); lowest is U1 at 3 of 5 |
| 1. Passed CFU stays open (`cfuJustPassed`) | **Met** (`MK2_…Lab.tsx:243–248, 291`) |
| 2. Miss ladder with pointer | **Not met** (C1-04) |
| 3. Explore checks, tracking pictures, labels, color, 1s pacing, gating | CFU exists; the rest **not met** (C1-07, C1-08) |
| 4. Practice hints strong, Tests unscaffolded, Test pictures honest | Tests show no hints (`UnitTest`), so Test hint text is never seen. Pictures **not met** (C1-11) |
| 5. Honest stars | **Met:** `recordSolve` + `StarOutcome`; no hard-coded star |
| 6. No grade references; stacked fractions | No fractions. One grade-coded label (C1-41) |
| 7. Number pad beside boxes | CFU pad is inline. Practice/Test use the shared floating pad. **Not verified on screen** |

## 5. Persona highlights

- **First-timer who can't read, U1 take-away:** hears "Count only the color that's still there," but both colors look present. Two misses later, Show me says "5 − 2 = 3. The answer is 3." She copies it without seeing anything leave (C1-06, C1-18).
- **Guesser, U5:** types by counting the dots on a "fast fact," then reaches a matching step with one button, or taps a true fact and is told it's wrong (C1-01, C1-27, C1-28).
- **Behind 2nd grader, U6:** counts 16 from 1 because the ones are an ungrouped row, then meets "The tens digit (1)," a word nothing has taught (C1-30, C1-31).

## 6. What's working well

- All six CFUs use KCheck, one question at a time, with 76% typed and useful specific messages such as "That is backwards. Write the ten first."
- The shell's retry lock, draw caching, CFU gate and passed-CFU latch are correct.
- Star announcements are honest.
- The U4 ten-frame and U2 Q2 crackers picture are strong models to copy.
- Show me pictures never jumped ahead to the next step's answer in the code I traced.
- The unit order (join, stories, break apart, make 10, facts, teens) makes sense.

## 7. Rule gaps (proposed for `math-lab-builder.md`; not applied)

1. "When one Explore stepper's range depends on another, changing the first must pull the second back into range, so no story or sentence can show an impossible value."
2. "A choice between two number sentences must have exactly one true sentence for every generated value, including when a number is 0; the brute-force script evaluates each choice."
3. "After `choice()` removes duplicates, every choice step must still have at least two buttons; the brute-force script asserts this."
4. "Two parts in the opposite order (4 and 5, 5 and 4) are not a different way to break a number apart."
5. "A hand or finger picture must draw each group on its own hand, matching the story."

## 8. What I could not check

- The lab in a real browser, including the number pad's position at 820×1180 and the other 4 sizes, tap targets, page jumps and diagram clipping.
- Real speech on an iPad, and whether the spoken pacing matches any animation.
- The official CCSS situation table for the K problem types (see Assumptions).
- Real students.
