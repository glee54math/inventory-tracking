# MG2 Place Value to 120 — Round 1 curriculum review

- **Lab:** MG2 PlaceValueTo120Lab ("Place Value to 120"), 5 units + Module Test.
- **Round:** 1 (full review of an existing lab; no round-0 build report). **Date:** 2026-11-17.
- **Grade band assessed:** K–1. The caller set the audience: 1st graders seeing this for the first time plus 2nd graders who are behind. They work alone on an iPad, many can't read well, so the lab has to work by ear first. Note: `math-lab-builder.md` lists only MK1–MK4 and MG1 as K–1, and puts MG2 under "read-aloud labs (MG2–MG5)". Under either band the lab breaks the rules below (native `<select>` is banned in both). See Rule gaps.
- **Standards checked:** 1.NBT.1–6, using the reference file plus the official CA CCSS wording from memory where I say so. Prior: K.NBT.1 (11–19 as ten ones + more), MG1 (ten-frames, making ten). Next: 2.NBT.1 (hundreds), 2.NBT.5 (add within 100).
- **Method:** I read the code: plan, shell, all 5 units, 5 Tests, Module Test, both diagrams, and the `StepProblem`, `UnitTest`, `audience`, `choice()`, `KCheck` and CfuPointers engine code. I compared with the MG1 shell. I did not run a browser harness or a brute-force script. The generators are small, so I traced their value ranges by hand. Screen-only behavior is marked where it matters.

## 1. Verdict

**Needs rework before 1st graders use it alone.** The math is correct and the unit order is sensible. But the lab was built as an older-grade lab:
- There is no early-learner mode, so no "Show me", no number pad and no "Try one like it".
- All 20 Check for Understanding questions are reading-heavy dropdowns: 0% typed, 6 true/false, and no pictures.
- Several Practice and Test pictures color in or print the answer before the student tries.

A non-reader can pass every gate by tapping through options, and can't get taught when stuck.

## 2. Top 5 changes

1. **C1-01** Put the lab in early-learner mode. Copy the MG1/MK1 shell: `lab-early`, `EarlyLearnerProvider`, `onRetrySame`/`onHelped` retry lock. This gives every Practice step the hint → "Show me" → "Try one like it" ladder and the on-screen number pad.
2. **C1-02 / C1-03 / C1-04** Rebuild all five CFUs with `KCheck` (one short question at a time, a picture, ≥40% typed on the number pad, big buttons, a few words of feedback, show-it after misses) and add "Look here!" pointers to an Explore spot for every part. This also removes the dropdowns that re-grade live, which can be passed by trial and error.
3. **C1-11 / C1-22** Stop the hundred chart from showing the answer. In Unit 4, every Practice problem and 6 of 10 Test questions color the result cell orange. Unit 1's "start anywhere" problem highlights the next number. Mark only the start until the step is done.
4. **C1-06** Make the pictures teach. Label the rods (10, 20, 30…). Have pictures respond to a stuck student (`pointing`). Write a `showMe` line for every main step and color-match the answer boxes.
5. **C1-16 / C1-18** Teach the two ideas the lab currently assumes. In Unit 2, show 10 loose cubes being bundled into a rod (1.NBT.2a). In Unit 3, show what < and > mean with a picture before any question asks for a symbol.

## 3. Scorecard

| Unit | 1 Standards | 2 Audience | 3 Arc | 4 Unstuck | 5 Pictures | 6 Math | 7 Mastery | 8 Device |
|---|---|---|---|---|---|---|---|---|
| 1 Counting to 120 | OK (reading/writing numerals, objects → numeral thin) | Weak (dropdown/TF CFU, "new hundred" vocabulary) | OK | Weak (Show answer only) | Weak (chart shows next number; "Say" button is silent) | Strong | Weak (step 2 prints step 3's answer; same-answer picks) | Weak (iPad keyboard, small targets) |
| 2 Tens and Ones | Weak (bundle of ten not shown) | Weak (TF + "hidden ten" reading) | OK | Weak | Weak (unlabeled rods, no bundling) | Strong | OK (one-button step 11% of the time) | Weak |
| 3 Comparing | OK | Weak (symbol vocabulary question, TF) | Weak (symbols never taught) | Weak | OK (chart only, no blocks) | Strong | Weak (only typed step is copying a digit; same-answer pick) | Weak (steppers by 1) |
| 4 Ten More/Less, Tens | OK | Weak (TF, "how did you get it?" reading) | Weak (Explore default = CFU Q1 answer) | Weak | Weak (result cell colored = answer) | Strong | Weak (answer on screen in Practice and Test) | Weak |
| 5 Adding 2-digit + 1-digit | Strong | Weak (dropdowns, TF) | Weak (Explore default = CFU Q2 answer) | Weak | OK (good overflow picture; no animation) | Strong | OK (Test pictures over-scaffold) | Weak |

## 4. All findings

### Whole lab (shell and shared patterns)

**C1-01 — Major — The lab is not in early-learner mode**
- **Who it hurts:** all three personas, every Practice problem.
- **Evidence:** `MG2_PlaceValueTo120Lab.tsx` root is `"pv120-lab lab-base"` with no `lab-early`. It has no `<EarlyLearnerProvider>`, and `StepProblem` gets no `onRetrySame`/`onHelped` (L235–240). In this mode `StepProblem.tsx` (L374–375, L633–643) opens the hint only on the 2nd wrong try and shows **"Show answer"** on the 3rd (no "Show me" walk-through). The answer box opens the iPad keyboard, not the number pad. After a helped solve, "Next problem" is not locked and nothing forces a same-type retry. Compare with `MG1_AdditionAndSubtractionWithin20Lab.tsx` L12–14, 337–339, 410–413.
- **Fix:** Mirror the MG1 shell. Add the `lab-early` class and wrap it in `EarlyLearnerProvider` inside `TtsProvider`. Copy `lastMakeRef`/`drawRef`/`retrySame`/`owesRetry`/`useRetryDebts` and the disabled `Segmented` from MG1/MK1's `UnitView`. If the user decides MG2 is "read-aloud 2nd–3rd" and not K–1, still add `onRetrySame`. That is **Needs the user's decision** on band. My recommendation is K–1, because this is Grade-1 content.
- **Layer:** 4, 8.

**C1-02 — Major — All five CFUs use the older all-at-once dropdown layout (0% typed)**
- **Who it hurts:** first-timer who can't read (can't read the options) and the behind 2nd grader, at every unit's Explore gate.
- **Evidence:** 20 CFU questions across 5 units. All of them are native `<select>` dropdowns, and 0 have typed answers (the rule is ≥40%). 6 are true/false: U1 Q3, U2 Q4, U3 Q4, U4 Q3, U5 Q3, plus U2 Q2's yes/no. 5 ask the student to pick a reason or vocabulary in long text: U1 Q2 "new TEN or new HUNDRED", U2 Q2, U3 Q1/Q2 "Why?", U4 Q2 "How did you get it?", U5 Q2 "Why?". None shows a picture. All four questions are on screen at once. Feedback is 1–2 long sentences, e.g. TensAndOnes.tsx L124–126 and AddingTwoDigitOneDigit.tsx L126. None use `shared/components/KCheck.tsx`.
- **Fix:** Rebuild each CFU as a `CheckSequence` of `TypeCheck`/`PickCheck` items, one at a time, each under a picture. Suggested items (≥40% typed in each):
  - **U1:** chart row 91–100 with 99 lit: "What comes after 99?" [type 100]. Row 101–110: "After 109?" [type 110]. "Start at 97. Count on: 98, 99, __" [type]. Pick: which row does 100 go in (tap the row).
  - **U2:** rods + cubes for 36: "How many tens?" [type 3], "How many ones?" [type 6]. 1 rod + 4 cubes, said "fourteen": "How many tens?" [type 1]. 1 rod alone: "How many ones?" [type 0]. 7 rods: "What number?" [type 70].
  - **U3:** blocks for 42 and 45 side by side: "Which is more?" [tap the number]. "42 ◯ 45" [big < = > buttons]. Blocks for 36 and 63: "Which is more?" [tap]. 53 and 53 [tap =].
  - **U4:** chart with 47 lit: "10 more?" [type 57]. 12: "10 less?" [type 2]. 7 rods, take away 3 rods: "How many tens left?" [type 4], then "70 − 30 = __" [type].
  - **U5:** 34 + 5 blocks [type 39]. 38 + 5: "How many ones now?" [type 13], "New tens?" [type 4], "38 + 5 = __" [type 43].
  
  Feedback should be a few words. Add the 2nd-miss show-it.
- **Layer:** 2, 3.

**C1-03 — Major — The CFU can be passed by trial and error**
- **Who it hurts:** the guesser, every CFU.
- **Evidence:** In every question, after the first "Check Answer", `checked` stays true. Each `<select>` border turns green or red as soon as it changes (`fieldOk(ok, checked)`), and `useEffect` calls `onComplete` as soon as all fields are right, with no new Check. Example: CountingTo120.tsx L22–25/L33, TensAndOnes.tsx L26–28. A student can cycle options until every box turns green. With 2–3 options per box, the whole gate takes about a minute without understanding.
- **Fix:** Rebuilding with KCheck (C1-02) fixes this. If any hand-built question stays, reset `checked` on change (`onChange={(e) => { setX(e.target.value); setChecked(false); }}`), as MG1's hand-built CFUs do.
- **Layer:** 7.

**C1-04 — Major — No CFU "Look here!" pointers**
- **Who it hurts:** the behind 2nd grader after a 2nd miss on any CFU part.
- **Evidence:** No `useCfuPointers`, `StuckBox`, `lookHereSpot` or `look` prop anywhere in `MG2/` (grep). `CFU_Pointer_Rollout/README.md` lists MG2 as "todo (early)".
- **Fix:** When rebuilding (C1-02), pass `look={{ target, label, say }}` to each KCheck item. Mark these Explore spots with `lookHereSpot`:
  - U1: the chart row and the "Jump to 99" area, with the line "After 99 comes 100."
  - U2: the rods/cubes picture plus a new "Bundle 10" spot (C1-16).
  - U3: a new symbol line (C1-18).
  - U4: the "same column" line.
  - U5: the "Bundle 10 ones" stage.
  
  `say` lines should be a few words starting "Look here.", for example "Look here. 10 ones make 1 ten."
- **Layer:** 3.

**C1-05 — Major — Explore's default numbers show the CFU's answers**
- **Who it hurts:** the guesser, U4 and U5 gates.
- **Evidence:** In U4, the Explore default is start 23, move +1, so it prints **"23 + 10 = 33"** above CFU Q1 "What is 10 more than 23?" (TenMoreTenLess.tsx L211–212, L233 vs L28). In U5, the default is 38 + 5. Pressing the two stage buttons shows **"38 + 5 = 43"**, the same problem as CFU Q2 (AddingTwoDigitOneDigit.tsx L250–251 vs L94).
- **Fix:** Change the defaults: U4 start 46, move +2; U5 start 27, add 6. Or change the CFU numbers so none match an Explore default.
- **Layer:** 3, 7.

**C1-06 — Major — Practice pictures never respond to a stuck student, and no step has a `showMe`**
- **Who it hurts:** the first-timer who can't read, on a wrong try in any unit.
- **Evidence:**
  - None of the 5 Practice generators reads `help`/`pointing`. Visuals are `() => …` or `(done) => …` only.
  - No step has `showMe` or `tone`.
  - `BaseTenBlocks` draws rods and cubes with no number labels (BaseTenBlocks.tsx L110–126), so a 1st grader must count up to 9 tall unlabeled rods.
  - Nothing is animated, and no button waits for a picture to play.
  - The hints are words only, e.g. "Count the ten-sticks." / "The first digit." (CountingTo120.tsx L302, ComparingTwoDigitNumbers.tsx L296).
- **Fix:**
  - Add an optional `labels` prop to `BaseTenBlocks` that writes 10, 20, 30… under the rods and 1, 2, 3… on the cubes.
  - In each generator use `pointing(help, i)`:
    - U1: light the start cell and draw an arrow to the next cell, which shows "?".
    - U2: number the rods on the tens step, then number the cubes on the ones step.
    - U3: blink the two tens digits, then the ones digits.
    - U4: draw the hop straight up or down one row, with "?" at the landing cell.
    - U5: number the cubes as they are added.
  - Add `showMe` to every main step, e.g. U2 `"Count the tens: 10, 20, 30. 3 tens."`, and set `showMeHoldMs` to about 1 s per item.
  - Give each typed step the `tone` of the picture part it counts (rods "a", cubes "b").
- **Layer:** 4, 5.

**C1-07 — Major — Practice pick steps whose right answer never changes, plus 2-option picks**
- **Who it hurts:** the guesser, who learns the fixed answer once and keeps getting clean solves.
- **Evidence:** These picks always have the same right answer:
  - U1 cross100 step 3 is always "3-digit" (CountingTo120.tsx L363–367, 2 options).
  - U3 sameTensDiffOnes step 1 is always "Compare the ones digits" (ComparingTwoDigitNumbers.tsx L318–322).
  - U4 tenMore step 2 is always "Only the tens digit" (TenMoreTenLess.tsx L266).
  - U4 tenLess step 2 is always "Change the tens digit directly" (L284–288, 2 options).
  
  These picks have only 2 options: U1 crossDecade step 2, U2 standard step 3, and U3 reversedDigits step 1 (always the answer vs "=").
- **Fix:** Turn the fixed picks into typed steps that make the student produce the idea:
  - U1: "100 has how many digits?" becomes "What comes after 100?" [type].
  - U3: "Which digit decides?" becomes "Type the bigger number."
  - U4: "Which digit changed?" becomes "47 + 10 = __, and 47 − 10 = __" [type both], or a picture pick of the landing cell on the chart.
  
  Give the remaining picks 3 options.
- **Layer:** 7.

**C1-08 — Major — Unit Tests use long true/false sentences, and "True" is right 6 of 7 times**
- **Who it hurts:** the first-timer (can't read the sentence) and the guesser (always taps True).
- **Evidence:** The Tests have 7 true/false items. 6 have the answer "True": U1 patternRepeats, U2 zeroOnes, U2 teenGeneralization, U3 tensFirstGeneralization, U4 onesNeverChange, U5 regroupRule. Only U3 reversedDigitsTF is "False". Each is 20–35 words. 4 of them are in the Module Test. True/false is banned for K–1 (builder table).
- **Fix:** Replace each with a picture item that checks the same trap:
  - U1: "What comes after 109?" [type].
  - U2: 13 cubes on screen: "Make the tens and ones" [type 1, 3]. And 50 as rods: "How many ones?" [type 0].
  - U3: "Which is more, 47 or 74?" [tap].
  - U4: "68 − 30 = __" [type].
  - U5: "47 + 6 = __" [type].
- **Layer:** 2, 7.

**C1-09 — Minor — Shell text and controls are written for older students**
- **Who it hurts:** the first-timer on Home and in Practice.
- **Evidence:** Home says "Stars fill in as you clean-solve (no wrong guesses, at most one hint) each kind of problem twice in Mixed mode…" (L122–124). Practice says "Practicing one type is great for extra reps, but only Mixed…" (L223–226). Each unit has a single problem type, so the "Problem type" picker only lets a child step out of Mixed and silently stop earning stars.
- **Fix:** Use MG1's K–1 star line. Hide the `Segmented` picker when `unit.problems.length === 1`.
- **Layer:** 2, 7.

### Unit 1: Counting to 120

**C1-10 — Major — "Say the next number" doesn't say anything**
- **Who it hurts:** the first-timer who can't read. 1.NBT.1 counting is a spoken skill, and the plan's main misconception ("ninety-ten") is a spoken one.
- **Evidence:** CountingTo120.tsx L240 `sayNext` only adds 1 to the counter. The big number (L266) is not inside `ReadAloud`. The "brand new ten / hundreds" banners (L267–268) are plain `<p>`, so they are not spoken automatically. The lab never says a number name aloud while counting.
- **Fix:** On each tap, speak the new number with the lab voice (`sayText` inside `TtsProvider`), e.g. "one hundred", "one hundred one". Also speak the banner when one appears: "New ten!" / "One hundred! A new digit!". Rename the button to the speaker icon + "Next number" if speech can't start.
- **Layer:** 3, 8.

**C1-11 — Major — The chart shows the answer (Practice "start anywhere", and every Test counting item)**
- **Who it hurts:** the guesser, who reads the lit or next cell without counting.
- **Evidence:**
  - Practice `startMid` marks `after` in orange with `upTo={after}` (L319). Step 1's answer is a bright labeled cell before any try.
  - All six Test successor items draw the full 1–120 chart with `upTo={n}` (CountingTo120Test.tsx L18, 34, 69, 81, 99, 112). Cells after `n` are dimmed to 30% but still show their numbers, so "100" sits right next to the lit 99 on the hardest item.
- **Fix:** In Practice `startMid`, make the visual `(done) => <HundredChart marks={[{n, tone:"a"}, ...(done >= 1 ? [{n: after, tone:"b"}] : [])]} upTo={done >= 1 ? after : n} />`. In `HundredChart`, add a `hideAfter` option that draws blank cells after `upTo`, and use it in all Test items and in Practice before a wrong try. Keep the faint numbers as the hint after a wrong try.
- **Layer:** 5, 7.

**C1-12 — Major — Step 2's wording prints step 3's answer ("Rolling into a new ten")**
- **Who it hurts:** the guesser, crossDecade bucket.
- **Evidence:** Step 2's prompt is `` `${next} to ${next2} — which ten did you just start?` `` (L341). Example: "39 to 40". Step 3 then asks "What number comes right after 39?" (L345). Finished steps keep their prompt on screen (`StepProblem.tsx` L540–546), so "40" stays visible above the box.
- **Fix:** Put the "which ten?" pick last, worded "Which ten did you just start?" with only the row picture, or make it a typed "40 starts the __s" after step 3.
- **Layer:** 7.

**C1-13 — Minor — "Crossing into the hundreds" sometimes never reaches 100**
- **Who it hurts:** the behind 2nd grader, cross100 bucket.
- **Evidence:** `start = Math.random() < 0.7 ? 99 : randInt(97, 98)` (L352). With start 97 (about 15% of draws), the steps ask for 98 and 99, then "Is 100 a 2-digit or 3-digit number?" The student never produces 100. The stories in crossDecade and cross100 say "Keep going three numbers" but ask for only two.
- **Fix:** Use `start ∈ {98, 99}` and ask for three numbers (add a third number step). Or change the story to "two numbers".
- **Layer:** 3, 6.

**C1-14 — Minor — "New ten or new hundred?" goes past the 120 limit, and two CFU ideas never reach Practice**
- **Who it hurts:** the first-timer, CFU Q2 and Test Q10.
- **Evidence:** CFU Q2 (L89–96) and Test `tenVsHundredChoiceQuestion` ask whether 110 is "a new HUNDRED" and say a new hundred "starts at 200". That is 2.NBT.1 content and a vocabulary question. Neither the ten-vs-hundred idea nor the pattern true/false (Q3) is a Practice bucket.
- **Fix:** Replace both with typed "After 109 comes __" over the 101–110 row. Practice already covers it in `range100to120` when n = 109; force 109 and 119 into that bucket at least a third of the time.
- **Layer:** 1, 2, 3.

**C1-15 — Minor — 1.NBT.1's "read and write numerals, and write how many objects" is thin. Needs the user's decision**
- **Who it hurts:** the first-timer. The standard's second sentence isn't practiced in Unit 1.
- **Evidence:** The official CA CCSS 1.NBT.1 (from memory; the reference file shortens it) adds: "In this range, read and write numerals and represent a number of objects with a written numeral." Unit 1 only asks for the next or previous number. Unit 2's `reverse` bucket (rods + cubes → number) covers objects → numeral up to 99, but not 100–120. The plan's irregular teen names ("eleven/twelve") are never spoken or shown.
- **Fix:** Options: (a) add a Unit 1 bucket "How many?" with rods + cubes for 100–120 (e.g. 11 rods + 4 cubes → type 114); (b) accept Unit 2's reverse bucket as the coverage and say so in the plan.
- **Layer:** 1.

### Unit 2: Tens and Ones

**C1-16 — Major — "A ten is a bundle of ten ones" is never shown, and the rod model arrives with no bridge**
- **Who it hurts:** the first-timer and the behind 2nd grader, who knew ten-frames from MK2/MG1.
- **Evidence:** 1.NBT.2a says 10 is "a bundle of ten ones, called a ten." The Unit 2 Explore (TensAndOnes.tsx L233–277) shows ready-made rods only, and no cubes ever join into a rod. The rod (`BaseTenBlocks`) is new to students. Its own comment says it differs from MK1/MG1's ten-frame and dot-group convention (BaseTenBlocks.tsx L28–32), and nothing links the two. Teen numbers are never named or shown as a preset, yet CFU Q2 asks about the "hidden ten inside fourteen." The number sentence is hidden behind a button (L261–269).
- **Fix:** In Explore:
  - Add a "Make a ten" button: 10 loose cubes count up 1…10 (about 1 s each, spoken), slide together into one rod, and the rod gets the label "10".
  - Add presets "14" (1 rod + 4) and "70" (7 rods + 0), with the number name spoken.
  - Show the number sentence by default once the blocks have been built.
  - Optionally show a full ten-frame next to the first rod ("a full ten-frame = 1 ten").
  
  Mark the "Make a ten" area as a Look-here spot.
- **Layer:** 1, 3, 5.

**C1-17 — Minor — Step 3 of the "standard" problem doesn't match its own answers, and is sometimes a one-button step**
- **Who it hurts:** the behind 2nd grader, standard bucket.
- **Evidence:** The prompt reads `` `${n} = ${tens} tens + ___ ones. Which number sentence is correct?` `` but the options are "30 + 6" / "60 + 3" (L365–369). That written form ("30 + 6") is never shown in Explore. When `tens === ones` (22, 33, … about 11% of draws, since `ones` 1–9 and `tens` 2–9), the swapped wrong answer equals the right one. `choice()` drops the duplicate, which leaves a single button: a free step.
- **Fix:** Exclude `ones === tens` (the Test already does, TensAndOnesTest.tsx L16). Change the step to a typed "36 = 30 + __". Add "= 30 + 6" to Explore's number sentence.
- **Layer:** 3, 7.

### Unit 3: Comparing Two-Digit Numbers

**C1-18 — Major — < and > are never taught, yet every question asks for them**
- **Who it hurts:** the first-timer and the behind 2nd grader, from CFU Q1 on.
- **Evidence:** Explore (ComparingTwoDigitNumbers.tsx L232–236) shows the symbol changing between A and B, but no line or picture says which symbol means what. CFU Q1 and Test `symbolVocabQuestion` are vocabulary questions ("Which symbol means 'is LESS than'?"). K–1 bans those. Every Practice problem then asks for a symbol.
- **Fix:** Add a short Explore teaching line plus a picture, marked as a Look-here spot. Show the two numbers' rods side by side, with "The open side faces the bigger number" drawn as a widening wedge toward the larger stack. Speak "42 is less than 58". In the CFU, show the picture and "42 ◯ 45" and have the student tap a big symbol button, not name it.
- **Layer:** 2, 3.

**C1-19 — Minor — Comparing never uses the tens and ones blocks**
- **Who it hurts:** the student with a gap, who doesn't yet link the row on the chart to tens.
- **Evidence:** 1.NBT.3 says to compare "based on meanings of the tens and ones digits." Unit 3 uses only chart position. The Explore text is a long reading line ("whichever row is further down has the bigger tens digit…", L239–241).
- **Fix:** Show `BaseTenBlocks` for A and B side by side under the chart in Explore and in the Practice help on the symbol step: on a wrong try, blink the rods, then the cubes. Shorten the line to "More tens? Bigger number." / "Same tens? Look at the ones."
- **Layer:** 5.

**C1-20 — Minor — The only typed step in Unit 3 is copying a digit**
- **Who it hurts:** the guesser.
- **Evidence:** diffTens and reversedDigits each type "How many tens does 47 have?" with the hint "The first digit." The answer is on screen. The rest are 2–3 option picks.
- **Fix:** Have the student type both tens digits ("47 has __ tens, 52 has __ tens"). Or add "Type the bigger number" before the symbol pick.
- **Layer:** 7.

**C1-21 — Polish — Explore steppers move by 1 across 10–99**
- **Evidence:** L218–219. Getting from 42 to 87 takes 45 taps.
- **Fix:** Add preset buttons (42 & 45, 36 & 63, 53 & 53) or ±10 buttons.
- **Layer:** 8.

### Unit 4: Ten More, Ten Less, and Multiples of Ten

**C1-22 — Major — The chart colors in the answer in Practice and in the Test**
- **Who it hurts:** the guesser, who types the number in the orange cell. This applies to every problem in the unit.
- **Evidence:** All four Practice buckets draw `marks={[{ n, tone: "a" }, { n: result, tone: "b" }]}` before any try (TenMoreTenLess.tsx L263, 281, 303, 326). The Test does the same in 6 of 10 questions: tenMore, tenLessNoCrossing, tenLessCrossing, addMultipleOfTen, both subtracts (TenMoreTenLessTest.tsx L18, 31, 44, 60, 76, 94). Three of these are in the Module Test. The Test can be passed by copying.
- **Fix:** Practice: `visual: (done, help) =>` mark only `n`. On `pointing(help, i)`, draw a hop arrow along the column with "?" at the landing cell. Mark `result` only when `done > i`. Test: mark only `n`, or show no chart.
- **Layer:** 5, 7.

**C1-23 — Minor — Practice "10 less" only starts from 11–23**
- **Who it hurts:** the student with a gap, at Test Q2.
- **Evidence:** `tenLessCrossing` uses `n = randInt(11, 23)` (L275). It is the only 10-less bucket. The Test's `tenLessNoCrossingQuestion` uses 31–99, which only `subtractMultipleOfTen` with `subTens = 1` touches.
- **Fix:** Add a `tenLess` bucket (31–99), or widen to 11–99 with half the draws in 11–23.
- **Layer:** 3.

**C1-24 — Minor — Explore shows "10 − 10 = ?" and other "?" results**
- **Who it hurts:** the first-timer exploring.
- **Evidence:** L233 prints "?" whenever the result is outside 1–120, including 0 (start 10, move −1), and hides the chart. A true answer (0) is shown as unknown. The steppers don't gray out.
- **Fix:** Show 0 as "0", with no chart mark. Disable the "Move by tens" − and + buttons when the next move would leave 0–120.
- **Layer:** 6, 7.

**C1-25 — Polish — Standard label and one true/false wording**
- **Evidence:** The unit header lists "1.NBT.5, 1.NBT.6", but the unit also teaches 1.NBT.4's "2-digit + multiple of 10". CFU Q3 says ±10 "ALWAYS changes only the tens digit". That's not true at 95 + 10 = 105, where a hundreds digit appears. The mid-decade subtraction (45 − 20) goes past 1.NBT.6 (multiples of 10 from multiples of 10), but the plan approved it.
- **Fix:** Change the label to "1.NBT.4–6". The true/false item goes away under C1-02/C1-08.
- **Layer:** 1, 6.

### Unit 5: Adding a 2-Digit and a 1-Digit Number

**C1-26 — Minor — Test pictures do half the work**
- **Who it hurts:** a Test-taker who hasn't really learned to regroup still passes.
- **Evidence:** `regroupStandardQuestion`, `regroupRoundTenQuestion` and `regroupWhyQuestion` draw the ones **already added** with the "10 ones — ready to bundle into a new ten!" banner (AddingTwoDigitOneDigitTest.tsx L90, 107, 154). The Test should have little scaffolding, and the first two are in the Module Test.
- **Fix:** In the Test, draw only the starting blocks (`ones={ones}`, no `flagOverflow`) or no picture.
- **Layer:** 5, 7.

**C1-27 — Minor — The bundling moment isn't animated**
- **Who it hurts:** the first-timer, Explore.
- **Evidence:** The stages swap instantly (L281–315). The 13 cubes appear at once, then the next stage jumps to rods. The key event, 10 cubes becoming a ten, is never seen happening.
- **Fix:** On "Add 5 more ones", add the cubes one per second with spoken counting. On "Bundle", slide the 10 ringed cubes into a new rod, then show the total. Keep the next button grayed until each animation ends.
- **Layer:** 5.

## 5. Persona walkthrough highlights

- **First-timer who can't read, Unit 2 CFU.** She sees four questions at once. Q2's dropdown reads "Yes — 14 is 1 ten and some ones" / "No — 'fourteen' is just its own separate word". She can't read either. She picks one and taps Check, and the border goes red. She picks the other, and it goes green with no new Check (C1-03). She passes all four this way and reaches Practice. There she sees 4 unlabeled rods and is asked "How many tens is 47?". After three misses she gets "Show answer", which shows 4 with no counting along (C1-01, C1-06).
- **Guesser, Unit 4 Practice and Test.** Every problem shows the start cell in blue and the answer cell in orange. He types the orange number every time: clean solves, stars, and a passed Test (C1-22). The two pick steps always have the same answer ("Only the tens digit", "Change the tens digit directly"), so he learns those once (C1-07).
- **Behind 2nd grader, Unit 1 Explore.** He taps "Say the next number" from 95 and hears nothing (C1-10). At 99 → 100 a green banner appears that he can't read. In the CFU, "ninety-ten" is one of the dropdown options. Since he says "ninety-ten" aloud, he picks it. The red feedback is two long sentences.

## 6. What's working well

- **Unit order and buckets** follow the plan closely. Every plan trap is present somewhere: 99→100, 0 ones in 10 and decades, teens, same tens, reversed digits (36/63), equal, 10 less into single digits, regrouping.
- **Unit 5's shared `regroupBreakdown`** keeps the picture and the graded answer in step. The Practice picture changes per step: ones added and ringed "ready to bundle", then the bundled rods.
- **The CFU gate and cfuJustPassed latch** in the shell are correct. Unit 1 re-gates every 20 solves for the count sequence.
- **The math is correct** for every generator range I traced. Distractors name real misconceptions: 33 for 38+5, 413, swapped digits, ninety-ten. Sums stay within 100 (max 89+9 = 98).
- **The hundred chart is 1–120 with the ones digit fixed per column.** That makes "+10 = straight down" and "99→100 is the same wrap" visible. It's a good model once it stops showing answers.

## 7. Rule gaps (proposed sentences for `math-lab-builder.md`)

1. **Band table:** Change "K–1 (MK1–MK4, MG1)" to "K–1 (MK1–MK4, MG1, and every lab built from a Grade-1 plan, e.g. MG2–MG4)". Change "Read-aloud labs (MG2–MG5)" to "(MG5)". As written, MG2 (Grade 1) falls in the read-aloud band, which skips the early-learner shell and KCheck.
2. **Pictures:** "A Practice or Test picture must not mark, color or print a step's answer (a lit result cell, a labeled landing spot, a readable 'next' cell) before that step is done. Draw the result only when `done > stepIndex`, or as help after a wrong try. Tests draw the givens only."
3. **Step wording:** "A finished step's prompt stays on screen, so no step's prompt may contain a later step's answer."
4. **Explore controls:** "A control labeled 'Say…' or 'Count…' must speak each number it shows with the lab voice."
5. **Hand-built CFUs (any band):** "After a wrong Check, changing an answer clears the check (`setChecked(false)`). Fields must never re-grade live."

## 8. What I could not check

- I did not run the lab in a browser or at iPad size, and took no screenshots. Tap-target size, number-pad overlap and auto-read on load are unverified. Without `lab-early`, I expect small targets.
- Real speech: whether the read-aloud voice reads `<select>` options or the chart numbers.
- A 10,000-trial generator script. I traced ranges by hand, and the generators are short.
- Real students.
