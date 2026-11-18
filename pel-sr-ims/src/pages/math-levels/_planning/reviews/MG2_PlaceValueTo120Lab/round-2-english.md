# MG2 Place Value to 120: English check, round 2 (re-review)

- **Lab:** MG2 `PlaceValueTo120Lab` (shell `MG2/MG2_PlaceValueTo120Lab.tsx`, 5 units + 5 unit Tests + Module Test; new this round: `diagrams/BlocksPair.tsx`, `diagrams/timing.ts`, `units/words.ts`)
- **Round:** 2 (re-review of the round-1 fixes)
- **Date:** 2026-11-17
- **Grade assessed:** 1st (grade-1.md). Text a student must hear or read **to act** was held to the **Kindergarten** limits (grade-K.md: 8 spoken words, one idea), because the audience is 1st-grade first-timers and behind 2nd graders, alone on an iPad, weak readers, audio-first.
- **Band:** K–1 (merged decision 1; the shell now has `EarlyLearnerProvider` and KCheck CFUs).
- **Method:**
  - `node scripts/english-check.cjs --grade 1` on the shell + lab folder: **314 strings, 4 flagged** (round 1: 414 strings, 188 flagged). Task text 0% over the limit; screen text 9% (3 flags, all the script joining separate lines, plus "place value" in the lab's own name).
  - Read every CFU item (question, nudge, named reasons, show-it line, praise, `LOOK` say lines), every Explore line, Key Idea, goal and shell line by hand.
  - Bundled all 5 units + Module Test with esbuild and ran every Practice bucket 400× and every Test generator 200× (**22,788 unique lines**), then read one line per template and grepped for plurals, "digit", arrows, long sentences and agreement.
  - Voice: compiled `shared/tts/mathSpeech.ts` and ran `speakableText()` on every new symbol, box, range, sign and banner string.
- **Not re-raised (already with the user):** the deferred `tenVsHundredChoiceQuestion` (C1-14 Test part), C1-15 and passScore 9/10; and the fixer's two shared-file decisions (KCheck `CheckSequence` title "Show what you know!"; the Test engine reading `<` `=` `>` choices aloud as words). Their status is in the table.

---

## 0. Status of round 1's English fixes

| ID | Round 1 | Status | Note |
|---|---|---|---|
| E1-01 | Blocker | **Fixed** | No `->` or `→` in any student text. Spoken ranges now "81 to 90". |
| E1-02 | Major | **Fixed** | No dropdowns. All 5 CFUs are KCheck, one question at a time. |
| E1-03 | Major | **Fixed** | No true/false anywhere (CFU, Practice, Tests). Replacements are short typed or picture items. |
| E1-04 | Major | **Fixed** | CFU feedback is 2–8 words ("Yes! 3 tens.", "Count the sticks, not the cubes."). |
| E1-05 | Major | **Fixed** | No nudge or named reason states an answer. Show-it lines state it only on the 3rd miss, as designed. |
| E1-06 | Major | **Fixed** | Explore, Key Idea and goal sentences are all 8 words or fewer. |
| E1-07 | Major | **Fixed, but caused a new problem** | No "1 tens"/"1 ones" in 22,788 lines. But the word after a Test blank now changes with the answer ("☐ ten" means 1). See E2-38. |
| E1-08 | Minor | **Fixed** | *information, represents, identical, unbundled…* are gone. |
| E1-09 | Minor | **Fixed** | "stick" and "cube" only, taught in the U2 Key Idea and Explore. |
| E1-10 | Minor | **Partly (waiting on the user)** | The lab uses KCheck's shared title "Show what you know!" (4 words). That wording is fine for K–1 English, so I'd accept option (a). Shared-file decision 1. |
| E1-11 | Minor | **Fixed** | No everyday "even". |
| E1-12 | Major | **Fixed** | Hero, Module Test and "only Mixed" lines rewritten. The stars line and two unlock/mastery lines that round 1 missed are in E2-41. |
| E1-13 | Major | **Fixed** | Unit 1 never says "digit". The U5 title is "Adding Ones to a Number". (Units 3–5 still use "digit" without it being taught: E2-36, a round-1 miss.) |
| E1-14 | Major | **Fixed** | No decade names. Rows are asked by number ("Which row is 50 in?" / "41 to 50"). |
| E1-15 | Minor | **Fixed** | "From 100 to 199 is one hundred." (Item still deferred to the user.) |
| E1-16 | Major | **Fixed** | "Start at 18. Count on." Row question comes last. Title "A new ten". |
| E1-17 | Major | **Fixed** | Starts at 98 or 99, always passes 100, and the wrap-up is built from the values. |
| E1-18 | Minor | **Fixed** | "Count from 1: 1, 2, 3. What comes next?" (n = 1 edge case: E2-46.) |
| E1-19 | Minor | **Fixed** | n is 101–119. |
| E1-20 | Minor | **Fixed** | Banners are spoken (`role="alert"`). Wording question in E2-43. |
| E1-21 | Major | **Fixed** | "A number like 70" / "Look at 70. How many tens and ones?" |
| E1-22 | Major | **Fixed** | "11 is 1 ten and how many ones?" (typed). |
| E1-23 | Major | **Fixed** | "42 = ☐ + 2. What goes in the box?" The box matches its answer. |
| E1-24 | Minor | **Fixed** | "How many tens are in N?" everywhere. |
| E1-25 | Blocker | **Fixed** | "21 and 26 both have 2 tens. What do you look at next?" with "The ones" / "The tens". |
| E1-26 | Major | **Partly (waiting on the user)** | CFU: sign buttons say "this one", so the voice no longer answers. Practice and Test: the shared engine reads the signs aloud as words. It is now a real comparison, not "which symbol means…", so I'd accept option (a). Shared-file decision 2. |
| E1-27 | Major | **Fixed** | No "tied" or "break the tie". |
| E1-28 | Major | **Fixed** | Story "Compare 54 and 59."; short step and choices. |
| E1-29 | Polish | **Fixed, but caused a new problem** | The text says "box", but the voice reads ☐ as "blank": "42 blank 45. What goes in the box?" See E2-37. |
| E1-30 | Major | **Fixed** | No "multiple" in student text. |
| E1-31 | Minor | **Fixed** | Tens stepper + More/Less switch, so no "-3". |
| E1-32 | Major | **Fixed** | "Make a new ten" is the only phrase. No regroup, bundle or carry. |
| E1-33 | Minor | **Fixed** | No "sum". |
| E1-34 | Minor | **Fixed** | Equal-length "why" choices. The two-blank line is now "How many ones? ☐ What is 38 + 5? ☐". |
| E1-35 | Polish | **Fixed** | 2–3 word Practice titles. |

**Totals:** 35 round-1 findings → **31 Fixed, 2 Fixed but caused a new problem (E1-07, E1-29), 2 Partly fixed (E1-10, E1-26: both waiting on the user's shared-file decisions), 0 Not fixed.**

## 1. Verdict

**Close to ready. One Major is left.** The lab went from 188 flagged strings to 4, and every Blocker is fixed. What a student hears is now short, concrete and true to the picture: one question at a time, "stick" and "cube", "make a new ten", and no arrows, decades or true/false.

The one Major (E2-36): **"digit" is never taught, but a Test question depends on it.** "68 to 78. Which digit changed?" (Unit 4 Test and the Module Test) has the choices "Only the tens digit / Only the ones digit / Both digits changed". "Digit" also appears in a Unit 3 title and wrap-up and in a Unit 5 Test choice. Unit 1 dropped "digit" as round 1 asked, but nothing later teaches it. The rest are Minor voice and wording slips.

## 2. Scorecard

Length is the script's "% over the 10-word limit" (task = prompts; screen = Explore/CFU/shell).

| Part | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell | OK (screen 9%; stars line 14 words) | Strong | OK (*complete, activity, unlock, mastered*: E2-41) | n/a | Strong | OK |
| U1 Counting to 120 (+Test) | Strong (0%) | Strong | Strong | n/a | Strong (ranges "81 to 90"; banners spoken) | Strong |
| U2 Tens and Ones (+Test) | Strong (0%) | Strong (plurals fixed) | Strong | n/a | OK (☐ = "blank": E2-37) | Strong |
| U3 Comparing (+Test) | Strong (0%) | Strong | OK ("digits": E2-36; bigger/greater/more: E2-44) | n/a | OK (goal reads "Use is greater than, equals…": E2-39; ☐ = "blank") | Strong |
| U4 Ten More / Ten Less (+Test) | Strong (0%) | Strong | **Weak** (Test "Which digit changed?": E2-36) | n/a | Strong ("70 minus 30 equals what number") | Strong |
| U5 Adding Ones (+Test) | Strong (0%) | OK ("Add 1 more ones": E2-40) | OK ("3 digits" choice) | n/a | Strong | Strong |
| Module Test | Strong | OK (inherits E2-38) | Weak (inherits E2-36) | n/a | OK (signs read as words: decision 2) | Strong |

The lab still has no story problems (it is a place-value lab), so CCSS Table 1 types don't apply.

---

## 3. All findings (new this round)

**Counts: 0 Blocker · 1 Major · 7 Minor · 5 Polish (13 new; IDs continue after E1-35).**

As in round 1, unit and module Tests show no hints or "explain" text (`UnitTest`), so Test hints were not counted as student-facing. Test prompts and choices were.

### Lab-wide

**E2-36 · Major · "digit" is used, and a Test answer depends on it, but no unit teaches it**
- **Where:**
  - `TenMoreTenLessTest.tsx:144–146` `digitChangedChoiceQuestion` (**Unit 4 Test and Module Test**): "68 to 78. Which digit changed?", with the choices "Only the tens digit" / "Only the ones digit" / "Both digits changed".
  - `ComparingTwoDigitNumbers.tsx:272` Practice title "Swapped digits" (read aloud); `:277` wrap-up "76 > 67. Same digits, but the tens are not the same."
  - `AddingTwoDigitOneDigitTest.tsx:161` choice "The answer has 3 digits".
- Unit 1 dropped "digit" (E1-13). Unit 2 is where 1.NBT.2 says to teach it, but its Explore, Key Idea, CFU and Practice never say the word. So the first time a student meets "digit" is in Unit 3, and in Unit 4 it decides a Test answer. A student who knows that 10 more changes only the tens can still stall on "Which digit…?" with three long choices.
- **Breaks:** grade-1.md → Math words ("digit… teach it with a base-ten picture"); checklist §3 ("a word used before the unit teaches it"); severity guide ("an untaught word the answer depends on").
- **Rewrite** (pick one):
  - **(a) Don't use the word (simplest).**
    - U4 Test: "68 to 78. What changed?" with the choices **"The tens" / "The ones" / "Both"**.
    - U3 title: "Tens and ones swapped".
    - U3 wrap-up: "76 > 67. 76 has more tens."
    - U5 Test choice: replace "The answer has 3 digits" with "The answer is over 100" (false for every generated pair, 20–98).
  - **(b) Teach it once in Unit 2, then keep the current lines.**
    - Add to the U2 Explore number sentence: "3 and 6 are the digits. The 3 is the tens." (spoken; the picture is already on screen).
    - Then shorten the U4 Test choices anyway, to "The tens digit" / "The ones digit" / "Both digits".

**E2-37 · Minor · The voice says "blank" while the text says "box" (E1-29 side effect)**
- **Where:** every ☐ the voice reads:
  - U3 CFU Q1/Q4, Practice symbol steps and 6 Test items (4 in the Module Test). "42 ☐ 45. What goes in the box?" is spoken *"42 blank 45. What goes in the box?"*
  - U2 Practice `standard` step 3: *"42 equals blank plus 2. What goes in the box?"*
  - U2 Test sentence blanks and U5 Test "How many ones? ☐". These don't say "box", so they're only affected if the map changes.
- **Cause:** `shared/tts/mathSpeech.ts:64` maps ☐ to "blank". This is the same issue as **MG1 E2-38**.
- **Breaks:** english-learners.md (two words for one thing); traps §8 (what the voice says should match what is printed).
- **Needs the user's decision** (same decision as MG1 E2-38, so make it once for both labs): change the shared map to "box" for all labs (and check the labs that print "blank"), or override per prompt. If the map stays, the lab-side fallback is to say "blank" in the text: "42 ☐ 45. What goes in the blank?"

**E2-38 · Minor · The word after a Test blank gives away the answer (E1-07 side effect)**
- **Where:** `TensAndOnesTest.tsx:15–16` `tensOnesSentence`, in 4 Test items (3 in the Module Test). Every teen and "exactly 10" item prints **"16 = ☐ ten + ☐ ones."**, and the singular "ten" tells the student the box is 1. Any `standard` item with 1 one prints "71 = ☐ tens + ☐ one."
- Round 1 asked for the frame word to be built from the answer. That fixed "1 ones", but in a Test it leaks the answer. (Few 1st graders will use the clue, but it is still a clue, and on a Test.)
- **Breaks:** checklist §3 Giveaways; Generated plurals.
- **Rewrite:** put the label *before* the box so it never has to agree with the number, using the pattern U5's Test already uses:
  - `How many tens? ☐  How many ones? ☐` (spoken "How many tens? … How many ones? …")
  - Keep the prompt "16. How many tens and ones?"

### Shell (MG2_PlaceValueTo120Lab.tsx)

**E2-41 · Minor · Three shell lines round 1 missed: the stars line, the unlock line and the mastery line**
- **Where:**
  - `:113` (home, read aloud): "Solve each kind of problem 2 times by yourself to fill in your stars. Only Mixed problems count." It has 14 words. Since the problem-type picker is now hidden, "each kind… Only Mixed" also sounds like two different rules. This is the same line as MG1 E2-48.
  - `:299` (Explore footer, read aloud): "Complete the activity above to unlock practice problems." It is 8 words, but *complete, activity, unlock* are not K–1 read-alone words, and a student sees it every time they open a unit.
  - `:345`, `:353` (Practice, read aloud): "You've mastered counting to 120. Take the test to finish this unit." / "🔥 You've mastered ten more, ten less, and adding tens and passed the test." *Mastered* is not a 1st-grade word, and the second line runs 13+ words.
- **Breaks:** grade-1.md Limits and Math words; builder Audience and language.
- **Rewrite:**
  - :113: "Solve problems by yourself. That fills your stars." (Use whatever MG1 settles on for E2-48. The line is common to both shells.)
  - :299: "Answer the questions above. Then you can practice."
  - :345: "You did it! Now take the test."
  - :353: "You did it! You passed the test."
  - (MG1 has the same three lines. Fix them together, or note them for the shared shell.)

### Unit 1: Counting to 120

**E2-43 · Minor · "20! New ten!" is spoken just as the chart puts 20 at the *end* of a row**
- **Where:** `CountingTo120.tsx:138` Explore banner, for 20, 30 … 90, 110 and 120. The Practice row question (`:326–333`) uses "21 to 30" as the trap for "20 starts a new row," and the Show me says "20 is at the end of the row 11 to 20."
- A student hears "New ten!" exactly when 20 appears at the right end of the row, then is asked which row 20 is in. "New ten" here means "the 2nd ten is complete," but by ear it sounds like "a new row starts here," which is the misconception the lab tests.
- **Breaks:** checklist §3 Text vs. picture.
- **Rewrite:** name what happened, not "new": `${n}! ${n / 10} tens!` for 20–90 ("30! 3 tens!"), and "110! Keep counting!" / "120! You did it!" past 100. Keep "100! Keep counting!".

**E2-46 · Polish · Generated edge cases that read oddly**
- `startFrom1` with n = 1 (`CountingTo120.tsx:271`): "Count from 1: 1. What comes next?" Rewrite: draw n from 2–6, or use "Start at 1. What comes next?" when n = 1.
- `startMid` story (`:299`): "Start at 74. Count from here." Step 2 then counts *back*, so "Count from here" is vague. Rewrite: "Here is 74." (the pattern `range100to120` already uses).
- U2 `reverse` with 0 ones (`TensAndOnes.tsx:367`): "Here are 2 sticks and 0 cubes." Rewrite: drop "and 0 cubes" when ones = 0: "Here are 2 sticks."

### Unit 2: Tens and Ones

**E2-48 · Polish · Wrap-up chains two equals signs**
- **Where:** `TensAndOnes.tsx:414`: "42 = 4 tens + 2 ones = 40 + 2." This is spoken *"42 equals 4 tens plus 2 ones equals 40 plus 2"*: 13 words with two "equals".
- **Breaks:** grade-1 Limits; grade-1 Watch for (the equal sign means "the same as", and a chain blurs that).
- **Rewrite:** two sentences: "42 = 4 tens + 2 ones. 42 = 40 + 2."

### Unit 3: Comparing Two-Digit Numbers

**E2-39 · Minor · The goal is spoken "Use is greater than, equals, or is less than."**
- **Where:** `ComparingTwoDigitNumbers.tsx:337` goal "Compare two numbers. Use >, =, or <." It is read aloud on the unit header and on the home path card. The voice turns each sign into its full phrase, so the sentence becomes ungrammatical.
- **Breaks:** traps §8 (symbols the voice must say).
- **Rewrite:** "Compare two numbers. Greater, less, or equal?" (7 words; no bare signs.) The signs are taught in Explore with the picture.

**E2-44 · Polish · Four words for "the larger number" in one unit**
- *Greater* (Key Idea `:341`, Test hint), *bigger* (Explore, CFU, Practice, "Type the bigger number"), *more* (Test "Which is more, 47 or 74?") and *biggest* (Test "Which is the biggest: …?").
- **Breaks:** english-learners.md (one word per idea in a unit).
- **Rewrite:** use **bigger / biggest** for the numbers everywhere, including the Key Idea ("More tens? That number is bigger.") and the Test ("Which is bigger, 47 or 74?"). Keep *greater than / less than* only as what the sign is called when read aloud.

### Unit 4: Ten More, Ten Less, and Adding Tens

**E2-45 · Polish · Fixed hint "Count by tens: 10, 20, 30." for every amount**
- **Where:** `TenMoreTenLess.tsx:251` `tensInStep`. The hint is the same for "How many tens are in 10?" (or 20) as for 70. For 10 and 20 it counts *past* the number.
- **Rewrite:** `Count by tens to ${amount}.` ("Count by tens to 20.") This points without giving the count.

### Unit 5: Adding Ones to a Number

**E2-40 · Minor · "Add 1 more ones" (Explore button)**
- **Where:** `AddingTwoDigitOneDigit.tsx:240`: `Add {add} more ones`. The Add stepper goes down to 1, so the button reads "Add 1 more ones", and the voice reads it when the panel is read aloud.
- **Breaks:** builder "Generated sentences must be grammatical for every value"; grade-1 Watch for ("ones" vs. "one").
- **Rewrite:** name the thing the student sees: `Add ${add} ${add === 1 ? "cube" : "cubes"}` → "Add 6 cubes" / "Add 1 cube".

**E2-42 · Minor · "13 ones make a new ten": the text says all 13 cubes become the ten; the picture shows 10 go and 3 stay**
- **Where:**
  - CFU Q3 prompt (`:121`): "13 ones make a new ten. How many tens now?"
  - CFU named reason (`:140`).
  - Practice new-ten step prompt (`:375`), the diagnose line (`:359`), and the wrap-up (`:386`, "11 ones made a new ten.").
- A literal listener can take this as "the 13 ones turned into the ten," leaving 0 ones. That leads straight to the next step's wrong total (40 for 38 + 5). The Show me line ("10 cubes make a new stick") already says it correctly.
- **Breaks:** checklist §3 Text vs. picture.
- **Rewrite:**
  - Prompt: "10 of the ones make a new ten. How many tens now?" (10 words)
  - Diagnose: "10 ones make a new ten."
  - Wrap-up: "85 + 6 = 91. 10 ones made a new ten."

**E2-47 · Polish · Ones step mixes an equation and a question**
- **Where:**
  - `:339`: "5 + 3 = how many ones?" This is spoken *"5 plus 3 equals how many ones?"*
  - `:350`, the no-new-ten hint: "The tens stay the same. Put the ones with them." ("them" points back to "the tens," which is vague.)
- **Rewrite:**
  - "5 ones and 3 ones. How many ones?"
  - Hint: "The tens stay the same. Count on the cubes."

---

## 4. What's working well

- **Length is solved.** Task text is 0% over the limit, with a median longest sentence of 4 words. Every Explore, Key Idea and goal sentence is 8 words or fewer.
- **The CFUs are what this audience needs.** Each is one short question with a picture. Answers are typed on the number pad (18 of 21). Nudges are 3–6 words and point at the picture ("Count the sticks, not the cubes."). The `LOOK` say lines all start "Look here." and stay under 8 words.
- **One word per idea**, held across all 5 units: stick, cube, row, "make a new ten", "count on".
- **The voice is clean:**
  - Ranges are "81 to 90".
  - "70 − 30 = ?" is spoken *"70 minus 30 equals what number"*.
  - The Explore sentence "42 < 58" is spoken *"42 is less than 58"*.
  - The CFU sign buttons say "this one", and Explore taps speak each number.
- **Generated grammar is right.** In 22,788 lines there is no "1 tens", "1 ones" or "1 sticks", no NaN/undefined, and no arrow. "Both have 1 ten" and "71 has 1 one" come out right.
- No grade references, no fractions, no story problems needing a CCSS Table 1 check.

## 5. Out of my lane (for the curriculum checker)

- U3 `equal` bucket: its only step is a sign pick that is always "=" (the fixer noted this too).
- U3 "Type the bigger number" copies one of two numbers on screen, so it may not count as the bucket's typed step.
- U2 Test `standardChoiceQuestion` ("Which one is 65?") has only 2 choices, so it can be guessed half the time.
- Still deferred to the user: `tenVsHundredChoiceQuestion` ("Is that a new ten or a new hundred?", 2.NBT.1), C1-15 and passScore 9/10.

## 6. Guideline gaps (proposed, not edited)

- **checklist.md §3, Giveaways row:** add "A grammar word after a blank must not depend on the blank's answer ('☐ ten' = 1). Put the label before the box ('How many tens? ☐')."
- **checklist.md §3, Math words row:** add "If a later unit or Test uses a word (e.g. *digit*), check that an earlier unit teaches it, not only that the first unit avoids it."
- **checklist.md §3, Voice row** (same as MG1's proposal): "Check that the voice says the same word the text prints (☐ is spoken 'blank')."
- **math-language-traps.md §8:** add "Don't put bare signs in a sentence ('Use >, =, or <'). The voice reads each as a phrase, which makes the sentence ungrammatical."

## 7. What I could not check

- Real iOS Safari speech and pacing. I used `speakableText()` from `mathSpeech.ts`.
- Whether `ReadAloud` on the Explore control rows reads the "Add 6 more ones" button text, and how the "Look here" label (`LOOK.*.label`) is voiced. I assumed both are read.
- Whether the "Make a ten" and count-along spoken numbers keep pace with the animation on a real device (the fixer's browser run had sound off).
- Real students.
