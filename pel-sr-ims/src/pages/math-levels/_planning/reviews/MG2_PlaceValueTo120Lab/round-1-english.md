# MG2 Place Value to 120: English check, round 1

- **Lab:** MG2 `PlaceValueTo120Lab` (shell `MG2/MG2_PlaceValueTo120Lab.tsx`, 5 units + 5 unit tests + Module Test)
- **Round:** 1 (full review of an existing lab; no round-0 build report)
- **Date:** 2026-11-17
- **Grade assessed:** 1st (grade-1.md). **Read-alone text** was checked against Kindergarten limits (grade-K.md), because the audience includes 1st graders seeing this for the first time and behind 2nd graders, alone on an iPad, many of them weak readers.
- **Assumption:** the lab reads aloud (it uses `TtsProvider`/`ReadAloud`), so I judged spoken text as heavily as shown text. The shell has **no `EarlyLearnerProvider`**, so I treated it as the K–1 band anyway: the caller named a 1st-grade audience, and the builder says "when unsure, treat the lab as the younger band."
- **Method:** I ran `scripts/english-check.cjs --grade 1` (414 strings, 188 flagged). I read every unit, test and the shell by hand. I traced every generator template at its smallest and largest values. I compiled `shared/tts/mathSpeech.ts` and ran `speakableText()` on the risky strings to capture what the voice actually says.

---

## 1. Verdict

**Not ready for this audience.** The math is right for 1st grade, but the English is written for about 3rd–4th grade readers. Explore notes and Key Ideas run 25–50 words with dash asides. Every CFU feedback line is a 20–45 word paragraph. There are 12 true/false logic items, every CFU answer is a dropdown, and the lab leans on later-grade words (*multiple of ten, decade, regrouping, information, represents*). Two problems are **Blockers**:

1. The arrow `->` is spoken **"is greater than"**, so the voice tells students "109 is greater than 110."
2. One Test item (also in the Module Test) is worded so that a student who knows the math is pulled toward the wrong choice.

## 2. Scorecard

Length shows the script's "% over the 10-word limit" (screen = Explore/CFU/Key Idea; task = prompts; test = test prompts).

| Part | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell (home, tabs, banners) | Weak (screen 27%; hero sentence 20 words) | OK | Weak (*clean-solve, cumulative, reps*) | n/a | OK | OK |
| U1 Counting to 120 (+Test) | Weak (screen 78%, task 7%, test 30%) | Weak (*if*-first, T/F) | Weak (*digit* before it's taught, *new hundred*) | n/a | **Weak** (arrows, "100-199", "110s") | Weak |
| U2 Tens and Ones (+Test) | Weak (screen 78%, task 8%, test 44%) | Weak ("1 ones", "How many tens is 36?") | Weak (*decade, unbundled, information*) | OK (one "friend has" item) | OK | Weak |
| U3 Comparing (+Test) | Weak (screen 63%, test 30%) | Weak (abstract choices) | Weak (*tied / break the tie, comparison*) | n/a | Weak (symbol-meaning item answered by ear; "vs") | Weak |
| U4 Ten More / Ten Less (+Test) | Weak (screen 88%, test 25%) | OK | Weak (*multiple of ten*) | n/a | Weak ("2 -> 3") | Weak |
| U5 Adding 2-digit + 1-digit (+Test) | Weak (screen 55%, test 42%) | OK | Weak (*regrouping / bundle / carry*) | n/a | Weak ("->", *sum*) | Weak |
| Module Test | OK–Weak (it reuses the unit items) | Weak | Weak | n/a | Weak (holds the "->" item) | OK |

The lab has almost no story problems (one "A friend has … ten-sticks" item), so CCSS Table 1 problem types don't apply.

---

## 3. All findings

**Totals: 2 Blocker · 19 Major · 11 Minor · 3 Polish (35)**

Note: unit and module Tests show no hints or feedback (`UnitTest.tsx`), so Test *hints* were not counted as student-facing. Test *prompts and choices* were.

### Lab-wide (patterns across units)

**E1-01 · Blocker · Voice: `->` is spoken "is greater than"; `→` is silent**
- `mathSpeech.ts` reads a hyphen not followed by a digit as a pause, and `>` as "is greater than." Actual output:
  - "Check it: 29->30, 59->60, 109->110." → *"Check it: 29, is greater than 30, 59, is greater than 60, 109, is greater than 110."*
  - "(2 -> 3)" → *"2, is greater than 3"*
  - "13 ones -> a new ten" → *"13 ones, is greater than a new ten"*
- The voice tells students something false, in a lab that teaches `>` in Unit 3.
- `→` is dropped entirely: "check 99→100 and 109→110 against 29→30" → *"check 99 100 and 109 110 against 29 30."*
- **Where:** CountingTo120Test.tsx:141 (Test prompt; also in the Module Test), :142–143; TenMoreTenLess.tsx:46 (CFU feedback); AddingTwoDigitOneDigit.tsx:163 (CFU feedback, twice); `→` in CountingTo120.tsx:144, :145, :273.
- **Breaks:** traps §8 ("→" → "then").
- **Rewrite:** never use an arrow. Use "to" or "then": "29 to 30. 109 to 110." / "The tens went from 2 to 3." / "13 ones make a new ten."

**E1-02 · Major · Voice and reading: every CFU answer is a `<select>` dropdown**
- 20 CFU dropdowns across U1–U5. Many options are full sentences (13–15 words), for example "The tens are tied (both 4), so I compared the ones (2 vs 5) instead" and "Just changed the tens digit from 1 to 0 — no need to recount."
- **Breaks:** builder → "Read-aloud labs (MG2–MG5): never use `<select>`"; K–1 CFU design (no pickers; one short question at a time); grade-1 Limits (feedback and choices a few words).
- **Rewrite:** rebuild each CFU with `KCheck` (`CheckSequence` / `TypeCheck` / `PickCheck`). Use one short question per item, typed answers on the number pad, and picture or short-word pick buttons. The concrete question rewrites are in the unit findings below.

**E1-03 · Major · True/false logic questions in a K–1 audience (12 items)**
- **CFU:** CountingTo120.tsx:126; TensAndOnes.tsx:184; ComparingTwoDigitNumbers.tsx:159; TenMoreTenLess.tsx:122; AddingTwoDigitOneDigit.tsx:145.
- **Test:** CountingTo120Test.tsx:141; TensAndOnesTest.tsx:153, :191; ComparingTwoDigitNumbersTest.tsx:137, :163; TenMoreTenLessTest.tsx:106; AddingTwoDigitOneDigitTest.tsx:140. Five of these are also in the Module Test.
- The statements are 20–39 words with *whenever*, *always*, *never*, *not that…*, and nested clauses. Example: "True or false: a number's ones digit always tells you exactly how many single, unbundled ones are left over — even when that digit is 0, like in 70."
- **Breaks:** builder K–1 CFU ("No true/false"); grade-1 Grammar *not yet*; agent severity guide ("true/false logic questions in K–1" = Major).
- **Rewrite:** ask the same idea through a picture and a number:
  - U1 pattern: "Count: 108, 109. What comes next?" (type 110)
  - U2 zero ones: show 70 in blocks. "How many cubes?" (type 0)
  - U3 same digits: "Which is greater? 36 or 63" (two big buttons, blocks shown)
  - U4 ones don't change: show 23 and 33. "Which number changed? The tens or the ones?" (two buttons)
  - U5 make a ten: "8 ones and 5 ones. How many ones?" (13) → "How many tens now?" (4)

**E1-04 · Major · CFU feedback is a paragraph, not a few words**
- Every CFU feedback line (right and wrong) is 18–45 words. Examples:
  - CountingTo120.tsx:48 (31 words): 'Correct — after 99 comes 100, one hundred. There is no "ninety-ten" or "ninety-eleven" — once you run out of 2-digit numbers, a brand new digit appears.'
  - AddingTwoDigitOneDigit.tsx:126 (45 words): "Not quite — 8 + 5 = 13 ones. 13 is more than a single digit can hold, so bundle 10 of them into a brand new ten (making 4 tens total) …"
  - TensAndOnes.tsx:202: "The 0 is real information: it tells you there are no loose ones at all, not that the number has none to report."
- **Where:** every `feedback` line in the 5 unit files (lines 46–49, 103–106, 142–145, 197–200 in CountingTo120.tsx, and the matching lines in the other four).
- **Breaks:** grade-1 Limits (feedback: a few words); grade-K Limits (2–5 words); user rule (feedback for this audience is a few words).
- **Rewrite** (right / first-wrong nudge):
  - "Yes! 100 comes after 99." / "Look at the end of the row."
  - "Yes! 3 tens, 6 ones." / "Count the sticks."
  - "Yes! 8 and 5 make 13 ones. That is a new ten." / "Add the ones first."

**E1-05 · Major · Wrong-answer CFU feedback gives the answer**
- Because the answers are dropdowns, the student can just re-pick after reading it. Examples:
  - TenMoreTenLess.tsx:47 "…10 more than 23 is 33."
  - :103 "10 less than 12 is 2…"
  - :178 "…leaves 4 tens, which is 40."
  - ComparingTwoDigitNumbers.tsx:101 "…42 < 45."
  - :139 "…53 = 53."
  - :177 "…36 < 63, they are NOT equal."
  - AddingTwoDigitOneDigit.tsx:71 "…39."
  - :126 "…43, NOT 33…"
  - :217 "…47 + 6 = 53."
  - CountingTo120.tsx:49 "…needs a THIRD digit: 100."
  - :106 "…only crosses into a new TEN…"
  - :200 "…one more than 99 is 100…"
  - TensAndOnes.tsx:68 "the first digit (3) is the tens, the second digit (6) is the ones."
  - :126 "…1 ten and 4 ones…"
  - :164 "…it's just 0."
- **Breaks:** checklist §3 Giveaways; builder ("A wrong-answer message must not state the answer").
- **Rewrite** (a nudge that points at the picture):
  - "Find 23 on the chart. Go down one row."
  - "Look at the tens. They are the same. Now look at the ones."
  - "Add the ones first: 8 and 5."
  - "Count the cubes."

**E1-06 · Major · Explore notes, Key Ideas and unit goals are long and use dash asides**
- Explore notes run 23–50 words, Key Ideas 20–30 words per paragraph, and goals up to 22 words. All are read aloud and read alone.
- **Where:** CountingTo120.tsx:272–274, :392, :396–397; TensAndOnes.tsx:271–272, :378, :382–383; ComparingTwoDigitNumbers.tsx:240–241, :354, :358–359; TenMoreTenLess.tsx:237–238, :338, :342–343; AddingTwoDigitOneDigit.tsx:318–319, :386, :390–391.
- **Breaks:** grade-1 Limits (spoken ≤10, read ≤8); grade-K Limits; traps §6.
- **Rewrite** (all sentences ≤8 words):
  - **U1**
    - Explore: "Each row is one ten. Counting on moves one box right. At the end of a row, go to the next row. 99 to 100 works the same way."
    - Key Idea: "You can start counting at any number. After 99 comes 100. Then 101, 102, up to 120."
    - Goal: "Count to 120. Start at any number."
  - **U2**
    - Explore: "Make a number with the blocks. Then tap Show to see it."
    - Key Idea: "A stick is 1 ten. A cube is 1 one. 24 is 2 tens and 4 ones. 14 is 1 ten and 4 ones. 70 is 7 tens and 0 ones."
    - Goal: "Find the tens and ones in a number."
  - **U3**
    - Explore, same row: "Same row. Same tens. Which one is farther right?"
    - Explore, different rows: "Different rows. The lower row has more tens. That number is greater."
    - Key Idea: "Look at the tens first. More tens? That number is greater. Same tens? Look at the ones."
    - Goal: "Compare two numbers. Use >, =, or <."
  - **U4**
    - Explore: "10 more: go down one row. 10 less: go up one row. The ones stay the same."
    - Key Idea: "10 more or 10 less: only the tens change. The ones stay the same. Adding 20 is 2 tens more."
    - Goal: "Find 10 more and 10 less. Add and take away tens."
  - **U5**
    - Explore, makes a ten: "8 and 5 make 13 ones. That is more than 9. Make a new ten."
    - Explore, no new ten: "The ones are 9 or less. The tens stay the same."
    - Key Idea: "Add the ones first. 10 or more ones? Make a new ten."
    - Goal: "Add ones to a number like 38."

**E1-07 · Major · Generated plurals: "1 tens", "1 ones"**
- Values of 1 produce "1 ones" / "1 tens" in prompts the voice reads. The lab teaches exactly this difference (grade-1 Watch for: "ones" vs. "one").
- **TensAndOnes.tsx:**
  - :313–314, :316 (teen, ones=1): "11 is 1 ten and 1 ones", "11 has 1 loose ones"
  - :345–346 (reverse prompt, tens=1 or ones=1): "1 tens and 1 ones is what number?"
  - :363–364, :371 (standard, ones=1)
- **TensAndOnesTest.tsx:**
  - :23 and :44/:49 (fixed " ones." after a blank whose answer is 1)
  - :102, :115, :136 (prompts, ones=1)
  - :175–177 (choice text "3 tens and 1 ones" / distractor "1 tens and 3 ones")
- **ComparingTwoDigitNumbers.tsx:** :292, :296, :344 ("21 has 1 tens")
- **ComparingTwoDigitNumbersTest.tsx:** :39, :80 ("both have 1 tens"), :115, :137
- **Breaks:** builder "Generated sentences must be grammatical for every value"; checklist §3 plurals.
- **Rewrite:** use a helper, e.g. ``const tensW = (n) => `${n} ten${n === 1 ? "" : "s"}` `` and the same for ones. Results: "11 is 1 ten and 1 one." / "1 ten and 1 one is what number?" / "21 has 2 tens." For sentence frames, build the fixed word from the known answer (" one." vs " ones.").

**E1-08 · Minor · Abstract, later-grade words scattered through feedback and hints**
- Words: *information, reporting truthfully, represents, carries more value, identical, unbundled, single digit can hold, comparison, scales up, efficient, recount, underneath, arbitrary*.
- Examples: TensAndOnes.tsx:202–203; ComparingTwoDigitNumbersTest.tsx:163; TenMoreTenLess.tsx:140, :343; TensAndOnesTest.tsx:153.
- **Breaks:** grade-1 Math words; english-learners "What hurts."
- **Rewrite:** most of these disappear with E1-04/E1-06. Otherwise say the action: "The 0 means no cubes." / "Tens are bigger than ones." / "The ones stay the same."

**E1-09 · Minor · Several names for the same block**
- Names in use: *ten-stick / tens-stick / bundle / bundled ten / new ten*, and *ones-cube / loose one / loose cube / single unbundled one / leftover*.
- Examples: TensAndOnes.tsx:271 "tens-sticks and ones-cubes"; :298 "loose ones-cubes"; :203 "7 full ten-sticks and not one single loose cube."
- **Breaks:** english-learners ("Is each math idea named by one word in this unit?").
- **Rewrite:** pick "stick" (one ten) and "cube" (one one). Teach them once in U2's Key Idea ("A stick is 1 ten. A cube is 1 one.") and use only those words. Keep "make a new ten" as the one verb for regrouping (see E1-32).

**E1-10 · Minor · CFU gate titles are 20+ words**
- "Check for understanding: let's make sure counting all the way to 120 makes sense before you try practice problems." The same pattern appears in all five units: CountingTo120.tsx:217; TensAndOnes.tsx:220; ComparingTwoDigitNumbers.tsx:194; TenMoreTenLess.tsx:195; AddingTwoDigitOneDigit.tsx:234.
- **Breaks:** grade-1 Limits.
- **Rewrite:** "Answer these. Then you can practice."

**E1-11 · Polish · "even" in its everyday sense (about 15 times)**
- Examples: "even when that digit is 0", "even though the word doesn't say", "even past 100".
- **Breaks:** traps §1 (even/odd arrives in 2nd; behind 2nd graders are learning it now).
- **Rewrite:** drop it ("It works past 100 too.") or use "also."

### Shell (MG2_PlaceValueTo120Lab.tsx)

**E1-12 · Major · Home, practice and module-test text uses jargon and long sentences**
- :83 hero (20 words): "Count all the way to 120, see what the two digits in a number really mean, compare numbers, move by tens, and add past a ten."
- :111: "Stars fill in as you clean-solve (no wrong guesses, at most one hint) each kind of problem twice in Mixed mode — the last star needs all of them." The voice says the parenthesis without a pause.
- :118, :392: "25 cumulative questions covering every unit in Place Value to 120 — 5 from each."
- :269: "Practicing one type is great for extra reps, but only Mixed problems count toward your mastery stars."
- **Breaks:** builder Audience and language ("No jargon ('…clean solve')"); grade-1 Limits; *cumulative* and *reps* are not 1st-grade words.
- **Rewrite** (matches the MG1 shell, which already uses K–1 text):
  - :83: "Count to 120. Find tens and ones. Compare and add."
  - :111: "Solve each kind of problem 2 times by yourself to fill in your stars. Only Mixed problems count."
  - :118 / :392: "25 questions from all 5 units."
  - :269: "Only Mixed problems give you stars."

### Unit 1: Counting to 120 (CountingTo120.tsx, CountingTo120Test.tsx)

**E1-13 · Major · "digit" and "2-digit / 3-digit" are used before the unit that teaches *digit*, and the voice garbles them**
- Unit 1 is the first unit. It says "a brand new digit appears" (:48, :267, :369), "the last 2-digit number" (:49, :199), "Is 100 a 2-digit number or a 3-digit number?" (:364, a Practice step), and "99 is the very last 2-digit number" (Test :84).
- The word *digit* is taught (with blocks) only in Unit 2.
- The voice reads "2-digit" as *"2, digit"* (the hyphen becomes a pause). The U5 title "Adding a 2-Digit and a 1-Digit Number" is affected the same way.
- **Breaks:** grade-1 Math words (*digit* is new in 1st; teach it with a base-ten picture first); checklist §3 ("a word used before the unit teaches it"); traps §8.
- **Rewrite:**
  - Keep U1 about the count. "After 99 comes 100." / "100 has three numbers in it: 1, 0, 0."
  - Or teach it in one line with the picture: "1, 0 and 0 are digits. 100 has 3 digits."
  - Change the Practice step to "How many digits does 100 have?" (typed 3), and only after *digit* has been shown.
  - In titles, write "two-digit" / "one-digit" as words, or "Adding Ones to a Number."

**E1-14 · Major · "the 110s", "the 100s hundred", "the 10s": wrong or confusing when spoken**
- "110s" and "100s" aren't in the voice's decade list, so the voice says *"110s"* (likely "one hundred ten-s").
- "the 100s hundred" (CountingTo120.tsx:94, :105–106; Test :161–162) is a hard phrase even in print.
- The crossDecade choice "the 10s" (d=1, :342/Test :54) is spoken *"the tens"*, which in this lab means place-value tens.
- **Breaks:** traps §8 ("30s" → "thirties"); traps §1 (two meanings of *tens* in one lab).
- **Rewrite:**
  - Ask by number instead of by decade name: "19, then 20. Which row is 20 in?" with a row highlight, or "What ten does 20 start? 20 / 10" as typed or picked numbers.
  - Drop "100s hundred" (see Out of my lane on "new hundred").
  - "109, 110. Is 110 a new row?" (Yes / No buttons over the chart.)

**E1-15 · Minor · "100-199" is spoken "100 minus 199"**
- CountingTo120Test.tsx:161, in a Test hint. `UnitTest` shows no hints today, so students don't currently hear it. It would surface if hints or a review screen are added.
- **Breaks:** traps §8 ("a-b" ranges → "a to b").
- **Rewrite:** "from 100 to 199." Also see Out of my lane: the ten-vs-hundred item reaches past 1.NBT.1.

**E1-16 · Major · Practice "Rolling into a new ten": the story says three numbers but asks two, and step 2 gives away step 3**
- CountingTo120.tsx:336: "Start counting at 18. Keep going three numbers." The problem then asks only for 19 and 20.
- Step 2 (:341) says "19 to 20 — which ten did you just start?" That shows 20 before step 3 asks "What number comes right after 19?"
- **Breaks:** checklist §3 Giveaways and Text vs. picture.
- **Rewrite:**
  - Story: "Start at 18. Count on."
  - Step order: (1) "What comes after 18?" (2) "What comes after 19?" (3) "Is 20 in a new row?" or "20 starts the twenties. Tap the row."
  - "Rolling into" is an idiom; title it "A new ten."

**E1-17 · Major · Practice "Crossing into the hundreds": the text says a new digit appeared when it didn't**
- When start = 97 (about 15% of draws, :352), the problem counts 98, 99.
- The story still says "watch what happens when you run out of 2-digit numbers."
- The wrap-up says "97, 98, 99 — a brand new digit appeared!", which is false.
- The final step asks about 100, a number the student never reached.
- **Breaks:** checklist §3 Text vs. picture / Switches.
- **Rewrite:** always start at 98 or 99, or build the wrap-up from the values: `next2 >= 100 ? "…100 has 3 digits!" : "…next comes 100!"`. Story: "Start at 98. Count on."

**E1-18 · Minor · Practice "Counting from the very start" opens with an if-clause and a contraction**
- :299: "Start counting at 1. If you've just counted up to 3, what comes next?" The prompt then repeats the question.
- **Breaks:** grade-1 Grammar (*if…then* not yet).
- **Rewrite:** "Count from 1: 1, 2, 3. What comes next?"

**E1-19 · Minor · "Here's 100, already past one hundred."**
- :379 is false when n = 100 (randInt(100,119)).
- **Rewrite:** "Here is 104. What comes next?" Or draw n from 101–119.

**E1-20 · Minor · Explore's "You just started a brand new ten!" is never spoken**
- :267–268 are plain `<p>` elements, not `ReadAloud` or `role="alert"`, so a non-reader never hears the key moment. The 26-word note under the chart is spoken instead.
- **Breaks:** builder Read-aloud ("Explore paragraphs … `<ReadAloud as=\"p\">`").
- **Rewrite:** wrap them in `ReadAloud` and shorten: "New ten!" / "100! A new row of the chart!"

### Unit 2: Tens and Ones (TensAndOnes.tsx, TensAndOnesTest.tsx)

**E1-21 · Major · "decade" / "exact decade" is not a 1st-grade word, and it's in a student prompt**
- :324 title "An exact decade"; :326 story "70 is an exact decade — no leftovers. How many tens and ones?"; :378 goal; :383 Key Idea.
- 1.NBT.2c itself says "the numbers 10, 20, 30… refer to one, two, three… tens," not "decade."
- The story also gives away step 2: "no leftovers" means 0 ones.
- **Breaks:** grade-1 Math words; checklist §3 Giveaways.
- **Rewrite:** title "A number like 70"; story "Look at 70. How many tens and ones?"; goal and Key Idea as in E1-06.

**E1-22 · Major · "ones" used as a pronoun in a tens-and-ones question**
- TensAndOnesTest.tsx:191 (Test): "…every single teen number (11 through 19) is 1 ten and some ones, even **the ones** whose names don't sound like it, like 'eleven' or 'twelve.'" (37 words, true/false.)
- In this lab "ones" is a math word. Here it means "those numbers."
- **Breaks:** traps §1 (an everyday word with a math meaning in the same lab); grade-1 Watch for ("Ones" vs. "one"); relative clause (not yet).
- **Rewrite:** replace the item (see E1-03): show 11 in blocks. "11 is 1 ten and how many ones?" (type 1). Or for 12: "How many tens in 12?" (type 1).

**E1-23 · Major · Practice "Tens and ones" step 3: the blank doesn't match the choices**
- :366: "36 = 3 tens + ___ ones. Which number sentence is correct?" is spoken *"36 equals 3 tens plus blank ones. Which number sentence is correct?"*
- The choices are "30 + 6" / "60 + 3", but the blank asks for a count of ones (6), which neither choice is.
- A student who knows "6 ones" hears a question with no matching answer.
- **Breaks:** checklist §3 Text vs. picture; grade-1 Limits (one action).
- **Rewrite:** "Which one is 36?" with choices "30 + 6" / "60 + 3". Or keep the blank and make it typed: "36 = 30 + ___" (type 6).

**E1-24 · Minor · "How many tens is 36?" / "How many ones is 10?"**
- :297–298, :313–314, :329–330, :363–364 (all Practice prompts). The grammar is off, and reading "tens is" can trip a decoder.
- **Breaks:** grade-1 Grammar (simple, standard patterns); english-learners ("same sentence pattern every time").
- **Rewrite:** "How many tens are in 36?" / "How many ones are in 36?" Use the same pattern everywhere, including U4 :305, :328 ("How many tens are in 30?").

### Unit 3: Comparing Two-Digit Numbers (ComparingTwoDigitNumbers.tsx, ComparingTwoDigitNumbersTest.tsx)

**E1-25 · Blocker · Test "What should you do first?": the right answer and the trap begin with the same words, and the trap echoes the question**
- ComparingTwoDigitNumbersTest.tsx:80–82 (Unit Test and **Module Test**): "64 and 67 — both have 6 tens. What should you do first?"
  - ✔ "Compare the ones digits, since the tens are already tied"
  - ✘ "Compare the ones digits first, before even checking the tens"
  - ✘ "Say they're equal, since the tens match"
- The prompt asks what to do *first*, but the right answer is what you do *next*: the tens were already checked in the prompt.
- Both of the first two choices start "Compare the ones digits." Only the distractor contains the question's word "first." A student who knows tens-then-ones can easily pick it.
- All choices are 9–11 words, read alone or heard as one long list, in a Test with no hints.
- **Breaks:** checklist §3 Loaded questions / False distractors; grade-1 Limits; traps §6 (long noun phrases).
- **Rewrite:** "64 and 67 both have 6 tens. What do you look at next?" with choices **"The ones"** / **"The tens"**. (A short false choice; the answer is not in the stem.)

**E1-26 · Major · Needs the user's decision · "Which symbol means 'is less than'?" is answered by the voice**
- CFU ComparingTwoDigitNumbers.tsx:28 and Test ComparingTwoDigitNumbersTest.tsx:151 ("is GREATER than").
- The voice reads `<` as "is less than" and `>` as "is greater than." So the question is heard as *"Which symbol means is less than?"* and the choices as *"is less than / is greater than / equals."* It becomes a word match.
- The right-answer feedback is spoken *"is less than means is less than: the smaller number comes first, the point of the symbol."* The last phrase is also unclear in print.
- The wrong feedback (:45, 20 words) describes the shape: "the symbol that looks like it's pointing left, getting narrower."
- **Breaks:** traps §8; checklist §3 Giveaways.
- **Options:**
  - (a) Drop the stand-alone symbol-meaning item. Every comparing item already makes the student pick `<`, `=` or `>` between real numbers.
  - (b) Keep it as a picture question: "Show 42 and 58. Which one goes in the box?" with `data-tts-say` on the choices ("this one," "this one," "this one"). The voice then reads the finished sentence only after the pick.
  - In either case, the feedback becomes "Yes! 42 is less than 58."

**E1-27 · Major · "tied / break the tie" idiom throughout the unit**
- "The tens are tied", "break the tie", "Tens tied means move on to the next digit."
- **Where:** ComparingTwoDigitNumbers.tsx:89, :100–101, :240, :319, :325, :359; ComparingTwoDigitNumbersTest.tsx:59, :80–81.
- **Breaks:** english-learners (idioms); grade-1 Math words (*same* is the K–1 word).
- **Rewrite:** "The tens are the same. Look at the ones." / "Same tens? Look at the ones."

**E1-28 · Major · Practice "Same tens — check the ones" step 1 is abstract, and its choices are long**
- :319: "Since the tens are tied, what should decide this comparison?" Choices: "Compare the ones digits" / "Compare the tens digits again" / "Guess — it must be equal since they look similar."
- The step uses a *since*-clause, an abstract noun ("comparison"), and a 9-word joke distractor.
- The story (:315, 15 words) already says "the tens digit is the same for both!", which gives the step away.
- **Breaks:** grade-1 Grammar; traps §6; checklist §3 Giveaways.
- **Rewrite:** story "Compare 64 and 67." Step 1: "Both have 6 tens. What do you look at next?" with choices "The ones" / "The tens". Hint: "The tens are the same. Look at the ones." The wrap-up (:325) becomes "64 < 67. The ones told you."

**E1-29 · Polish · "42 ___ 45. Which symbol?"**
- Spoken *"42 blank 45. Which symbol?"* (:270, :292, :323, :345; Test :26, :59, :95, :114).
- **Rewrite:** "Which sign goes in the blank?" or show a box ☐ and ask "What goes in the box?"

### Unit 4: Ten More, Ten Less, and Multiples of Ten (TenMoreTenLess.tsx, TenMoreTenLessTest.tsx)

**E1-30 · Major · "multiple of ten" is a 4th-grade word, used in the unit title, goal, Key Idea, two Practice titles and a Test prompt**
- TenMoreTenLess.tsx:300, :323, :337–338, :343 ("The same idea scales up: adding or subtracting any multiple of ten (20, 30...)"); TenMoreTenLessTest.tsx:106 (also in the Module Test).
- **Breaks:** grade-1 Math words (not on the list; *multiple* is 4th per traps §1); script flag `later-word:multiple` ×7.
- **Rewrite:**
  - Title "Ten More, Ten Less, and Adding Tens."
  - Practice titles "Add tens" / "Take away tens."
  - Key Idea "Adding 20 is 2 tens more."
  - Test: replace the true/false with "45 + 20. Did the ones change?" (Yes / No) or "45 + 20 = ?" (typed).

**E1-31 · Minor · Idioms and small voice slips**
- :285 hint "Recounting works, but it's slow and easy to mess up." (*mess up* is an idiom.) Rewrite: "Look at the tens. Make them 1 less."
- :286 choice "Change the tens digit directly." Rewrite: "Change the tens."
- :285 explain "Just drop the tens digit by 1 (or to 0)." Rewrite: "Take 1 away from the tens."
- :219 stepper "Move by tens" with a negative value: "-3" is spoken *"3"*, so the student hears "move by tens 3" for 30 less. Label it "Tens to add" with a separate More / Less toggle, or give the stepper `data-tts-say` ("3 tens less").
- **Breaks:** english-learners (idioms); traps §8 (− before a number is "negative"/"less").

### Unit 5: Adding a 2-Digit and a 1-Digit Number (AddingTwoDigitOneDigit.tsx, AddingTwoDigitOneDigitTest.tsx)

**E1-32 · Major · "regrouping" is never taught, and it competes with "bundle," "carry" and "new ten"**
- The CFU title (:234) says "let's make sure regrouping makes sense," and the Practice title (:348) is "Adding with regrouping."
- Everywhere else the lab says "bundle 10 of them into a new ten," and the test hint says "that extra ten needs to be ADDED."
- *Regroup* is a 2nd-grade word (2.NBT.7 says "compose"), and nothing in the lab teaches it.
- **Breaks:** grade-1 Math words; README idea 5 and english-learners ("one word per idea").
- **Rewrite:** use one phrase only, **"make a new ten."** Title "Make a new ten"; CFU title per E1-10.

**E1-33 · Minor · "the ones sum" sounds like "the ones some"**
- :162–163 (CFU feedback): "every time the ones sum passes 9…"
- **Breaks:** traps §2 (*sum/some*); grade-1 (*sum* is a teacher word first).
- **Rewrite:** "When the ones make 10 or more, make a new ten."

**E1-34 · Minor · Long multi-part prompts and a longest-answer giveaway**
- :354 Practice step 2: "13 ones is too many for one digit. After bundling a new ten, what's the new tens digit?" (two sentences plus a participial clause). Rewrite: "13 ones make a new ten. How many tens now?"
- Test :174: "For 38 + 5: the ones add up to ___, and the final answer is ___." (two blanks, one sentence). Rewrite: "38 + 5. How many ones? ___ What is 38 + 5? ___" as two lines.
- Test :158: the right choice is the only long one and contains the computation ("Because the ones (8 + 5 = 13) add up to more than 9"); the others are short. Rewrite with equal-length choices: "The ones make 13" / "The tens are small" / "The answer has 3 digits".
- **Breaks:** grade-1 Limits (1 action); checklist §3 Giveaways.

**E1-35 · Polish · Practice titles are read aloud and add words**
- Examples: "Counting from the very start", "Rolling into a new ten", "Same digits, different number", "Subtracting a multiple of ten".
- **Rewrite:** 2–3 word titles: "Count from 1", "A new ten", "Past 100", "Swapped digits", "Take away tens", "Make a new ten".

---

## 4. What's working well

- Practice **prompts** are mostly short (task text 7–8% over the limit in U1 and U2). The core questions "What number comes right after 58?", "What is 10 more than 23?" and "What is 34 + 5?" are exactly the right length and pattern.
- One sentence pattern repeats across a unit ("What number comes right after N?"), which helps English learners.
- The pictures (hundred chart, base-ten blocks) fit the words "row," "stick," "cube" and "new ten." Once the text is shortened, the picture can carry each problem.
- No grade references in student text ("In 1st grade…" doesn't appear). No fractions, so the stacked-fraction rule is n/a.
- `+`, `=`, `?` and minus between numbers are all spoken correctly ("45 minus 20", "13 plus 5 equals what number").

## 5. Out of my lane (for the curriculum checker)

- The shell has **no `EarlyLearnerProvider`**, and no step has a `showMe` or a `pointing(help, …)` picture change, so the K–1 help ladder (look-here, Show me, try one like it) doesn't run.
- The CFU has **0% typed answers** (fill-in rule ≥40%), and none of it uses the K–1 `KCheck` one-at-a-time design. It also has no CFU pointer back to Explore.
- Several CFU and Test items have no picture where one is needed ("Look at 36. How many tens…?" has no blocks; U4/U5 CFU and several Test items have `visual: null`).
- Pictures give answers away: U4 Practice and Test hundred charts mark the **result** cell (tone b) for "10 more than N"; U1 startMid marks `after`; U5 Test regroupStandard shows the summed ones already laid out.
- "New ten vs. new hundred / a new hundred starts at 200" (U1 CFU Q2, Test) reaches into 2.NBT.1. 1.NBT.1 only asks students to count to 120.
- Every unit test has passScore 9/10 with 2–3 true/false or why items each. That's a high bar for 1st graders once the language is fixed.

## 6. Guideline gaps (proposed, not edited)

- **math-language-traps.md §8**, add: "Never type `->` as an arrow. The voice reads `-` as a pause and `>` as 'is greater than,' so '109 -> 110' is heard as '109 is greater than 110.' Write 'to' or 'then.'"
- **math-language-traps.md §1 table**, add a row: "ones | 'the ones that…' (those) | single units | 1 — in a tens-and-ones lab, never use *ones* as a pronoun."
- **grade-1.md → Math words → Not yet**, add: "decade (say 'a number like 70'), regroup/carry (say 'make a new ten'), multiple of ten (say 'tens' or '20, 30, 40')."
- **checklist.md §3**, add a row: "Symbol-meaning questions in read-aloud labs: the voice reads `<` as 'is less than,' so 'Which symbol means less than?' is answered by ear. Ask with numbers, or give the choices `data-tts-say`."
- **mathSpeech.ts** (code, for the fixer or the user): add "100s"/"110s" to `DECADES` ("one hundreds"? decide the wording), and read a numeral's possessive ("70's") without the "s" token. Today it says *"70 s ones digit."*

## 7. What I could not check

- Real iOS Safari speech. I used `speakableText()` from `mathSpeech.ts`, not the device voice, so the exact sound of "110s," "1st/2nd/3rd" and "ninety-ten" is unverified.
- How the browser reads a `<select>`'s options through `ReadAloud`. I assumed all options are read, as the builder doc says.
- I traced the generators by reading the code at the smallest and largest values rather than running them (they return JSX). The plural and mismatch cases listed above follow directly from the templates.
- Real students.
