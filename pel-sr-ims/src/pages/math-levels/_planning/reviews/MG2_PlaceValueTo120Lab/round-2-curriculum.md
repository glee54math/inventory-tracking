# MG2 Place Value to 120: round 2 curriculum review (re-review)

- **Lab:** MG2 PlaceValueTo120Lab ("Place Value to 120"), 5 units, 5 unit Tests, Module Test.
- **Round:** 2 (re-review). **Date:** 2026-11-17.
- **Grade band assessed:** K–1 (early-learner shell + KCheck CFUs, decision 1 in `round-1-merged.md`). Audience: 1st graders seeing this for the first time and 2nd graders who are behind, alone on an iPad, many weak readers, audio-first.
- **Inputs:** `round-1-curriculum.md`, `round-1-merged.md`, `round-1-fixes.md`, the plan, the shell, all 5 unit files, 5 Tests, ModuleTest, the 3 diagrams (`HundredChart`, `BaseTenBlocks`, new `BlocksPair`), `timing.ts`, `words.ts`, and the shared `KCheck.tsx` / `types.ts` (`pointing`, `choice`) / `ReadAloud` / `lookHere` code they call.
- **Method:** I read the code. I did not run a browser or a brute-force script this round. The fixer's report has a 12,000-per-bucket brute run and an iPad-size browser walk. Where I depend on screen behavior I say so. No shared files changed this round, so there was no cross-lab check (step 3).
- **Not re-raised (waiting on the user):** C1-14 Test item (`tenVsHundredChoiceQuestion`, still in the Unit 1 Test), C1-15 (no Unit 1 "how many?" bucket for 100–120), the 9/10 pass score, and the fixer's 2 shared-file questions: the `CheckSequence` title, and Test choice buttons reading the signs aloud. All are still open, and nothing in this round made them worse.

## 0. Status of last round's fixes

| ID(s) | Status | Notes |
|---|---|---|
| E1-01 | Fixed | `->` and `→` now appear only in code comments (grep). |
| E1-25 + E1-28 | Fixed | The Practice step "What do you look at next?" still always has "The ones" as its answer (only its position varies). The merged list kept it on purpose. |
| C1-01 | Fixed | The shell matches MG1: `lab-early`, `EarlyLearnerProvider` inside `TtsProvider`, the retry lock, `useRetryDebts`, and the picker hidden when there is 1 problem type. |
| C1-02 + C1-03 + E1-02…E1-05 + E1-10 + C1-14 (CFU) | Fixed | All 5 CFUs use `CheckSequence`/`TypeCheck`/`PickCheck`: one question at a time, each with a picture. Typed share: U1 3/4, U2 5/5, U3 2/4, U4 4/4, U5 4/4. The title is still waiting on the user. |
| C1-04 | Fixed | Every item has a `look`, and all 12 spots exist. Two pointers lead to a weak spot (see C2-37). |
| C1-05 | Fixed | Explore defaults are U4 46 + 20 and U5 27 + 6. No CFU item uses a default or preset. |
| C1-06 | **Fixed, but caused a new problem** | Labels, rings, `showMe` and `pointing` are all in place. But the new `tone` on "Type the bigger number" colors the answer box like the bigger number (C2-28). The ring also draws nothing when there are 0 cubes (C2-35). Not numbering cubes on a wrong try was the right call. |
| C1-07 | **Fixed, but caused a new problem** | The Practice "which digit / which way" picks are gone. Their Test twins (`digitChangedChoiceQuestion`, `strategyWhyQuestion`) are still there, now with nothing in Practice that teaches them (C2-30). |
| C1-08 + E1-03/E1-22/E1-30/E1-34 (Test) | **Fixed, but caused a new problem** | All 7 true/false items are replaced. The new two-box item "How many ones? ☐" has two possible right answers (C2-31). |
| C1-10 + E1-20 | Fixed | "Next number" speaks the number (when sound is on). The banners read aloud. |
| C1-11 | Fixed | `hideAfter` works in Practice and Tests. Counting back still shows its answer (C2-36, Minor). |
| C1-12 + E1-16 | Fixed | The row question comes last, and no earlier prompt contains a later answer. |
| C1-16 | Fixed | "Make a ten" counts 1–10, then the cubes slide into a stick labeled 10. The 14 and 70 presets speak. |
| C1-18 + E1-26 | Fixed (lab part) | Explore shows `BlocksPair` with the sign and "The open side faces the bigger number." The CFU sign buttons say "this one". The Test voice part is waiting on the user. |
| C1-22 | Fixed | Unit 4 marks only the start until a step is done, in Practice and in the Test. |
| E1-06 / E1-08 / E1-11 | Fixed | Short lines in place. Wording is the English checker's call. |
| E1-07 | Fixed | `tensW`/`onesW` used throughout. |
| E1-12 + C1-09 | Fixed | The picker is hidden. The star line still says "Only Mixed problems count." with no picker on screen; I left this to the English checker. |
| E1-13 | Fixed | Unit 1 no longer says "digit". The word is still used in the U3 Practice title and in Tests (see C2-30). |
| E1-14 + E1-15 | Fixed | |
| E1-17 + C1-13 | Fixed | Starts at 98 or 99, with 3 steps that always pass 100. |
| E1-21 | Fixed | |
| E1-23 + C1-17 | Fixed | Asking for the 30 ("36 = ☐ + 6") is a better choice than the agreed one. |
| E1-27 | Fixed | |
| E1-30 + C1-25 | Fixed | |
| E1-32 + E1-33 | Fixed | |
| C1-19 | Fixed | |
| C1-20 | Fixed (as agreed) | "Type the bigger number" is still a 1-in-2 copy. See C2-28 and §5. |
| C1-23 | Fixed | |
| C1-24 | Fixed | |
| C1-26 | Fixed | Test pictures show only the starting blocks. |
| C1-27 | **Partly fixed** | The "Make a new ten" slide plays, and the button stays gray until the adding is done. But the added cubes all appear at once, and the numbers count all the cubes from 1 instead of counting on (C2-34). |
| E1-09, E1-18, E1-19, E1-24, E1-31, C1-21, E1-29, E1-35 | Fixed | |

**Totals (40 Fix rows):** 36 Fixed · 3 Fixed, but caused a new problem · 1 Partly fixed · 0 Not fixed. The Skip row (`mathSpeech.ts`) was not touched, as planned.

## 1. Verdict

**Ready after a few fixes.** The round-1 rework landed well. The lab now teaches by ear and through pictures, and the hint → Show me → Try one like it ladder works in every unit. The single biggest remaining problem: in Unit 3, the box for "Type the bigger number" is colored like the bigger number, in Practice and in the CFU. A guesser types the number that matches the box color, without comparing anything (C2-28). There are no Blockers.

## 2. Top 5 changes

1. **C2-28:** Remove the answer-box color from "Type the bigger number" (Practice `biggerStep`, CFU items 2–3).
2. **C2-29:** Give Unit 3's "Equal numbers" problem a real typed step, e.g. compare 53 with "5 tens and 3 ones", so "=" isn't a one-glance tap.
3. **C2-30:** Replace the two Unit 4 Test picks that ask about "digits" and "fast ways" (their answer is always the same, and Practice no longer teaches them) with picture or number items.
4. **C2-31 / C2-32:** Fix the Test items whose answer is unclear or doesn't test what their name says: "How many ones? ☐"; "What comes after 99?" asked twice; "after 18 → 19" called a decade crossing.
5. **C2-34 / C2-35:** Make the pictures teach at two key moments. In Unit 5 Explore, count on from the cubes already there, one new cube at a time. In Unit 2, when there are 0 ones, the picture should point at the empty spot where cubes would go.

## 3. Scorecard (changed parts weighted most)

| Unit | 1 Standards | 2 Audience | 3 Arc | 4 Unstuck | 5 Pictures | 6 Math | 7 Mastery | 8 Device |
|---|---|---|---|---|---|---|---|---|
| 1 Counting to 120 | OK (C1-15 deferred) | Strong | Strong | Strong | OK (counting back shows its answer, C2-36) | Strong | OK (Test duplicates, C2-32) | OK (not re-checked on device) |
| 2 Tens and Ones | Strong | Strong | Strong | OK (0-ones help is blank, C2-35) | Strong | Strong | OK (reverse bucket is a single step) | OK |
| 3 Comparing | Strong | Strong | OK | Strong | **Weak** (box color gives the answer, C2-28) | Strong | **Weak** (box color; "=" bucket has a fixed answer, C2-29) | OK |
| 4 Ten More/Less, Tens | Strong | OK (Test asks about "digits", C2-30) | **Weak** (Test items not taught, C2-30) | Strong | Strong | Strong | OK | OK |
| 5 Adding Ones | Strong | Strong | Strong | Strong | OK (count-all, C2-34) | OK (unclear item, C2-31) | OK | OK |

## 4. All findings (new this round; the last round-1 ID was C1-27)

### Unit 3: Comparing Two-Digit Numbers

**C2-28: Major: the box for "Type the bigger number" is the bigger number's color (Practice and CFU)**
- **Who it hurts:** the guesser, in every diffTens, sameTens and reversedDigits problem, and at CFU items 2–3.
- **Evidence:** `ComparingTwoDigitNumbers.tsx` L244: `tone: big === a ? "a" : "b"`. The CFU passes `tone="b"` for "71 and 74" (L69; 74 is the right side, drawn in `--qb`) and `tone="a"` for "82 and 28" (L84; 82 is the left side, `--qa`). The box gets the class `answer q{tone}`, which is tinted (`lab-base.css` L833–848; `KCheck.tsx` L255). The chart and `BlocksPair` draw A in tone a and B in tone b, so the box color names the right answer before any comparing. This came from the C1-06 "color-match the answer box" fix. Color-matching is right when the box stands for one part of the picture. It's wrong when the choice of part IS the question.
- **Fix:** For `biggerStep`, use a neutral `tone: "c"`, or none. In the CFU, pass `tone="c"` to items 2 and 3. KCheck's default is "b", so leaving the prop out still leaks for item 2.
- **Layer:** 5, 7.

**C2-29: Major: the "Equal numbers" problem is one tap whose answer is always "="**
- **Who it hurts:** the guesser (1 in 3 by chance, and it's always "=" once seen). Any student also learns nothing beyond "the two numbers look the same." The fixer flagged this for round 2.
- **Evidence:** `comparingProblem` `equal` bucket (L251–261): story "Compare 53 and 53.", with one step, `symbolStep(a, a)`. There is no typed step, and the right answer is always "=". It is a required bucket. The CFU's item 4 (65 ☐ 65) and the Test's `equalTrapQuestion` are just as trivial.
- **Fix:** Make the equal case need place value. Story: "Compare 53 and 5 tens and 3 ones." Visual: the chart with 53 marked, plus `BaseTenBlocks` for 5 tens and 3 ones. Step 1, typed: "5 tens and 3 ones is what number?" (53, tone a). Step 2: the symbol pick "53 ☐ 53". For variety, about a third of the time the blocks should not match (e.g. 3 tens 5 ones vs 53), so the answer isn't always "=". Do the same in the Test's `equalTrapQuestion`: "4 tens and 7 ones ☐ 47".
- **Layer:** 7.

**C2-33: Minor: in the Test, "Which is the biggest" always lists the biggest number last**
- **Evidence:** `ComparingTwoDigitNumbersTest.tsx` `pickBiggestSameTensQuestion` L156 sorts `nums` before writing the prompt. The voice also reads the biggest last. Comparing three numbers is never practiced in Practice, either.
- **Fix:** List `nums` in shuffled order in the prompt, or replace the item with a pair compare (a typed same-tens "Type the bigger number").
- **Layer:** 7, 3.

### Unit 4: Ten More, Ten Less, and Adding Tens

**C2-30: Major: two Test picks ask about "digits" and a "fast way"; their answer never changes, and Practice no longer teaches them**
- **Who it hurts:** the first-timer who can't read (three long, similar choices) and the guesser (the right answer is fixed). These items are in the unit Test, and one is in the Module Test.
- **Evidence:**
  - `digitChangedChoiceQuestion`: "47 to 57. Which digit changed?" The answer is always "Only the tens digit" (n is 10–88, so there is never a rollover). It is in the Module Test.
  - `strategyWhyQuestion`: "How can you find 10 more than N fast?" The answer is always "Change the tens", with 2 options.
  - The word "digit" is never taught in any Explore or Key Idea. Round 1's C1-07 removed the matching Practice picks, so nothing now teaches either item. K–1 rules ban vocabulary and reason questions.
- **Fix:** Replace both with number items that test the same traps:
  - `digitChangedChoiceQuestion` → "What is 10 more than 36?" with a picture pick [46 / 37 / 47]. The distractors are "changed the ones" and "changed both". Vary which digit pattern comes up.
  - `strategyWhyQuestion` → typed "What is 10 less than 60?" (a decade start, a case no other Test item covers).
  - Keep the Module Test count at 25.
- **Layer:** 2, 3, 7.

**C2-38: Minor: "How many tens are in 20?" has the same hint for every number**
- **Evidence:** `tensInStep` L251: `hint: "Count by tens: 10, 20, 30."` is fixed. The amount is 10–70 (subTens 1–7, addTens 1–2). For "How many tens are in 10?" (answer 1), a stuck student hears three numbers and may type 3.
- **Fix:** `hint: \`Count by tens up to ${amount}. Count the sticks.\`` (the help picture already draws the sticks).
- **Layer:** 4.

### Unit 5: Adding Ones to a Number

**C2-31: Minor: "How many ones? ☐" has two right answers**
- **Who it hurts:** the student who did make the new ten, and types 3 for 38 + 5 (the ones in 43). That student is marked wrong. It hurts most on a 9/10 Test and in the Module Test.
- **Evidence:** `regroupSentenceProductionQuestion`: "38 + 5 / How many ones? ☐ What is 38 + 5? ☐", with answer 13. Practice asks it clearly as "8 + 5 = how many ones?". This wording came from the E1-34 split.
- **Fix:** The first box becomes "8 + 5 = ☐ ones." (same as Practice), then "What is 38 + 5? ☐".
- **Layer:** 6, 3.

**C2-34: Minor (C1-27 partly fixed): Explore's "Add 6 more ones" counts all from 1, and the cubes arrive all at once**
- **Who it hurts:** the behind 2nd grader who still counts all from 1. The lab shows that same habit.
- **Evidence:** In the `adding` stage (L205–218), `BaseTenBlocks` is drawn with all `extraOnes` at once, with `labels={{ ones: "count" }}` and `countAlong`. The numbers 1…13 appear over every cube, the 7 that were there plus the 6 new ones, about 1 s each. No cube "comes in".
- **Fix (lab-local diagram):** Add a `countFrom` option to `BaseTenBlocks`. The starting cubes show 1–7 at once. Then each new violet cube appears and is labeled 8, 9, … 13, one per second, spoken. Keep "Make a new ten" gray until it ends (that part already works).
- **Layer:** 5.

**C2-39: Polish: the 2-option Test picks have weak distractors**
- **Evidence:** In `noRegroupChoiceQuestion`, the "added to the tens" distractor can be over 100 (e.g. 81 + 7 → 158, which is obviously wrong). `forgotCarryChoiceQuestion` also has only 2 options.
- **Fix:** Limit `tens + add ≤ 9` for the distractor, and add a third distractor (one off from counting on, e.g. `total − 1`) to both.
- **Layer:** 7.

**C2-40: Polish: in "Why do you make a new ten?", the right answer is the only choice with a number**
- **Evidence:** `regroupWhyQuestion`: "The ones make 13" vs "The tens are small" / "The answer has 3 digits". A guesser learns "pick the one with a number." It is also a reason question read as text, which a K–1 non-reader can only follow by ear.
- **Fix:** Use distractors that also have numbers, e.g. "The tens make 30" and "The ones make 5". Or replace it with a typed "8 + 5 = ☐ ones. Is that 10 or more?" picture item.
- **Layer:** 2, 7.

### Unit 2: Tens and Ones

**C2-35: Minor: when there are 0 ones, a wrong try or "Show me" doesn't change the picture**
- **Who it hurts:** the first-timer at the hardest trap in the unit: 10 and 70 have 0 ones.
- **Evidence:** In `BaseTenBlocks` L177, `showRingOnes = ring === "ones" && o > 0`, so the ring is skipped when there are no cubes. This affects CFU item 4 ("How many ones are in 10?"), Practice `exactTen`/`exactDecade` step 2 after a wrong try, and their Show me. Show me says "There are no cubes. That is 0 ones." over an unchanged picture.
- **Fix:** When `ring === "ones"` (or `labels.ones`) and `o === 0`, draw a dashed empty box where the cubes go, with a big "0" on Show me.
- **Layer:** 4, 5.

**C2-41: Polish: what the voice says and what the picture counts don't match in "36 = ☐ + 6"**
- **Evidence:** In the `standard` step 3, Show me says only "Count the sticks by tens: 10, 20, 30. So 36 = 30 + 6." The picture then also counts on 31…36 (`labels: tens value + ones total`), so it is still counting after the voice stops.
- **Fix:** On that step's Show me, label only the sticks (`{ tens: "value" }`) and set `showMeHoldMs: countAlongMs(tens)`.
- **Layer:** 5.

### Unit 1: Counting to 120

**C2-32: Minor: Test items that repeat or don't cross what their names say**
- **Evidence:**
  - `cross100NumberQuestion` uses start 98 or 99. Half the time it asks "What comes after 99?". That is the same question as `cross100ChoiceQuestion`, and both are in the unit Test and the Module Test. The other half asks 98 → 99, which crosses nothing.
  - `decadeCrossNumberQuestion` asks after 18, 28, …, so the answer is 19, 29, and never crosses a ten. The fixer noted both.
- **Fix:**
  - `cross100NumberQuestion`: "99, 100. What comes next?" (101).
  - `decadeCrossNumberQuestion`: start = d·10 + 9, so the answer is the new ten (30).
- **Layer:** 7.

**C2-36: Minor: counting back shows its answer on the chart**
- **Evidence:** In `countChart`, only cells after `upTo` are blanked. On the "What number is one less than 47?" step (startMid and range100to120), 46 is a plain, readable cell next to the lit 47 before any try. Counting on hides that cell (C1-11).
- **Fix:** In `countChart`, when the current step is a back move and not done, also blank the cell `m.to` (or show it as a "?" box without the hop until a wrong try).
- **Layer:** 5.

**C2-37: Minor: two "Look here" pointers go to spots that don't teach their question**
- **Evidence:**
  - U1 CFU item 3, "Which row is 100 in?", points to `u1-chart` with "Look here. Count on one box at a time." That is about counting, not rows, and the Explore chart doesn't light 100 unless the student counts there.
  - U5 CFU items 1–2 point to `u5-ones`, which is one text line ("Add the ones first…") with no picture. The cubes and the "Add 6 more ones" button are in `u5-newten`.
- **Fix:**
  - U1 item 3: `look={LOOK.jump}` with say "Look here. Jump to 99. Count to 100. See its row."
  - U5 items 1–2: target `u5-newten`, say "Look here. Tap Add more ones. Count the cubes."
- **Layer:** 3.

**Counts:** Blocker 0 · Major 3 · Minor 8 · Polish 3.

## 5. Persona walkthrough highlights

- **Guesser, Unit 3 Practice "Different tens" (41 and 76).** The box under "Type the bigger number" is orange, and 76 is the orange cell on the chart. He types 76 without looking at the tens. He taps a sign (1 in 3) and sometimes gets a clean solve. In "Equal numbers" he taps "=" every time once he's seen it once (C2-28, C2-29).
- **First-timer who can't read, Unit 2 CFU item 4 ("How many ones are in 10?").** She types 1. The why line says "That is a stick. Count the cubes." The picture doesn't change, because there are no cubes to ring. On the 2nd miss she gets the "Look here" pointer to the 14/70 presets, which is a good spot. On the 3rd miss she hears "there are no cubes", still over the same picture (C2-35). She gets through, but the picture never showed her the empty spot.
- **Behind 2nd grader, Unit 4 Test.** He does the hops well, then hears "47 to 57. Which digit changed? Only the tens digit / Only the ones digit / Both digits changed." He has never heard "digit" in this lab, so he guesses (C2-30).

## 6. What's working well

- The **K–1 CFUs** are well built: one question at a time, a picture each, number-pad answers, few-word "why" lines that never state the answer, a pointer on the 2nd miss and show-it on the 3rd. Explore defaults avoid every CFU number.
- **"Make a ten"** (U2) and the **sign picture** (U3, `BlocksPair` at the same scale on both sides) now teach the two ideas the lab used to assume.
- **Pictures hold back answers** until the step is done (`hideAfter`, marks only on `done > i`), and Tests draw only the givens.
- **Help that teaches:** every main step has a spoken Show me paced at about 1 s per item, and a hop arrow to a "?" box on a wrong try.
- Choosing to ask for the 30 in "36 = ☐ + 6", and not numbering cubes on a wrong try, were good, careful departures from the fix list.

## 7. Rule gaps (proposed sentences for `math-lab-builder.md`)

1. **Answer-box color:** "Color-match an answer box only when the box stands for one fixed part of the picture. If the question is *which* of two colored things is the answer (bigger number, more, the winner), the box gets a neutral tone, or its color gives the answer away."
2. **Keep Practice and Test in step:** "When a Practice step is removed or changed, search the unit's Test (and Module Test) for the same idea. A Test item whose skill or word no longer appears in Explore/Practice must be replaced in the same change."
3. **Empty quantities:** "Help for a part that is 0 (no cubes, no ones) must still change the picture: draw the empty spot and point at it."

## 8. What I could not check

- I didn't run the lab in a browser, at iPad size, or with real speech this round. I relied on the fixer's walk for layout and timing.
- I didn't run a new brute-force script. The fixer's 12,000-trial run covers ranges and duplicates. My findings come from reading the code.
- Real students.
