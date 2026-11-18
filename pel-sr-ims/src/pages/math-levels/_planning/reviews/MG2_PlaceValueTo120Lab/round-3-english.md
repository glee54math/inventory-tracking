# MG2 Place Value to 120: English check, round 3 (final re-review)

- **Lab:** MG2 `PlaceValueTo120Lab` (shell `MG2/MG2_PlaceValueTo120Lab.tsx`, 5 units + 5 unit Tests + Module Test)
- **Round:** 3 (re-review of the round-2 fixes in `round-2-fixes.md`)
- **Date:** 2026-11-17
- **Grade assessed:** 1st (grade-1.md). Text a student must hear or read **to act** was held to the **Kindergarten** limits (grade-K.md: 8 spoken words, one idea). The audience is 1st-grade first-timers and behind 2nd graders, alone on an iPad, weak readers, audio-first.
- **Method:**
  - `node scripts/english-check.cjs --grade 1` on the shell + lab folder: **314 strings, 4 flagged** (same 4 as round 2). Task text 0% over the limit (median longest sentence 4 words). Screen text 10% (3 of 30): all 3 are separate lines that the script joins, and the 4th flag is "Place Value" in the lab's own name.
  - Re-bundled all 5 units + Module Test with esbuild and ran every Practice bucket 400× and every Test generator 200× (**23,206 unique lines**). I read 3 samples of every changed template and grepped all lines for *digit, greater, blank, arrows, regroup, carry, decade, sum, even, mastered, unlock*, singular/plural slips ("1 ones", "5 cube") and sentences over 8 words.
  - Voice: rebuilt `shared/tts/mathSpeech.ts` and ran `speakableText()` on 52 new or changed strings (equal-bucket prompts, banners, shell lines, button, pointers, Test frames).
  - Read the new CFU item (U3 Q4), the changed pointers, the U5 Explore controls and the four shell lines in the code.
- **Waiting on the user, not re-raised:** E2-37 (☐ is spoken "blank", shared `mathSpeech.ts`); the KCheck title (E1-10); the Test engine reading `<` `=` `>` aloud as words (E1-26); C1-14 Test item; C1-15; passScore.

---

## 0. Status of round 2's English fixes

| ID | Round 2 | Status | Note |
|---|---|---|---|
| E2-36 | Major | **Fixed** | "Which digit changed?" is gone. The Test now asks "What is 10 more than 36?" [46 / 37 / 47]. U3 title "Tens and ones swapped", wrap-up "15 < 51. 51 has more tens." No "digit" in any of 23,206 generated lines. One spot neither round listed is still there: the **U3 unit title** (E3-49). |
| E2-37 | Minor | **Waiting on the user** | Still spoken "blank": "4 tens and 7 ones blank 47. What goes in the box?" The new Test frame is spoken "How many tens? blank How many ones? blank". Both go away with the shared-map decision. |
| E2-38 | Minor | **Fixed** | "74. How many tens and ones?" then "How many tens? ☐  How many ones? ☐". No word after a box depends on its answer. |
| E2-39 | Minor | **Fixed** | Goal "Compare two numbers. Greater, less, or equal?" No bare signs, and it is spoken as printed. |
| E2-40 | Minor | **Fixed** | Button "Add 6 cubes" / "Add 1 cube". |
| E2-41 | Minor | **Fixed** | "Solve problems by yourself. That fills your stars." / "Answer the questions above. Then you can practice." / "You did it! Now take the test." / "You did it! You passed the test." |
| E2-42 | Minor | **Fixed** | "10 of the ones make a new ten. How many tens now?" (10 words). Diagnose and pointer: "10 ones make a new ten." Wrap-up "26 + 7 = 33. 10 ones made a new ten." |
| E2-43 | Minor | **Fixed** | "30! 3 tens!", "10! 1 ten!", "100! Keep counting!", "110! Keep counting!", "120! You did it!" |
| E2-44 | Polish | **Fixed** | Key Idea "More tens? That number is bigger."; Test "Which is bigger, 49 or 94?" / "Which is biggest: 22, 21, 29?". "Greater" is left only in the goal and the spoken sign names, as agreed. |
| E2-45 | Polish | **Fixed** | "Count by tens to 20." |
| E2-46 | Polish | **Fixed** | "Start at 1. What comes next?"; "Here is 74."; "Here are 2 sticks." |
| E2-47 | Polish | **Fixed** | "2 ones and 7 ones. How many ones?"; hint "The tens stay the same. Count on the cubes." |
| E2-48 | Polish | **Fixed** | "35 = 3 tens + 5 ones. 35 = 30 + 5." |

**Totals:** 12 round-2 items marked Fix → **12 Fixed, 0 Partly, 0 Not fixed, 0 caused a new problem.** 1 still waiting on the user (E2-37). Round-1 E1-10 and E1-26 are still waiting on the user, as before.

## 1. Verdict

**Ready on English. No Blocker or Major is left.** Every round-2 fix reads as asked and is spoken as printed. The new text from the curriculum fixes is short and grammatical for every value: the equal bucket ("5 tens and 2 ones. Compare with 25."), the Test items ("What is 10 more than 36?", "8 + 5 = ☐ ones."), the pointers and the U5 count-on. What's left is one Minor (the U3 unit title still says "Two-Digit") and one Polish (a "why" Test choice uses "make" in two senses).

## 2. Scorecard

Length is the script's "% over the 10-word limit" (task = prompts; screen = Explore/CFU/shell).

| Part | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell | Strong (joined-line flags only) | Strong | Strong (E2-41 fixed) | n/a | Strong | Strong |
| U1 Counting to 120 (+Test) | Strong (0%) | Strong | Strong | n/a | Strong (banners "30! 3 tens!") | Strong |
| U2 Tens and Ones (+Test) | Strong (0%) | Strong | Strong | n/a | OK (☐ = "blank", waiting on the user) | Strong |
| U3 Comparing (+Test) | Strong (0%) | Strong | OK (unit title "Two-Digit": E3-49) | n/a | OK (☐ = "blank", waiting on the user) | Strong |
| U4 Ten More / Ten Less (+Test) | Strong (0%) | Strong | Strong | n/a | Strong | Strong |
| U5 Adding Ones (+Test) | Strong (0%) | Strong | OK ("make" twice: E3-50) | n/a | Strong | Strong |
| Module Test | Strong | Strong | Strong | n/a | OK (signs read as words, waiting on the user) | Strong |

This is a place-value lab with no story problems, so CCSS Table 1 types don't apply.

---

## 3. All findings (new this round)

**Counts: 0 Blocker · 0 Major · 1 Minor · 1 Polish (IDs continue after E2-48).**

### Unit 3: Comparing Two-Digit Numbers

**E3-49 · Minor · The unit title still says "Two-Digit"**
- **Where:** `ComparingTwoDigitNumbers.tsx:401`: `title: "Comparing Two-Digit Numbers"`. It shows on the home path card and the unit header, so a student sees it each time they open the unit.
- E2-36 and the merged row asked for no "digit" anywhere in student text. The fixer's check covered generated text, which doesn't include unit titles. No unit teaches "digit", so this is the only place a student meets the word. No answer depends on it, so it is Minor. I missed this title in rounds 1 and 2 too.
- **Breaks:** grade-1.md → Math words ("digit… teach it with a base-ten picture"); checklist §3 (a word no unit teaches).
- **Rewrite:** `title: "Comparing Numbers"`. "Which Is Bigger?" would also work. (U5 was renamed "Adding Ones to a Number" for the same reason in round 1.)

### Unit 5: Adding Ones to a Number

**E3-50 · Polish · The "why" Test choices use "make" in two senses**
- **Where:** `AddingTwoDigitOneDigitTest.tsx` `regroupWhyQuestion` (C2-40's new choices). For example: "36 + 9. Why do you make a new ten?" with "The ones make 15" / "The ones make 9" / "The ones make 5". When the ones add to exactly 10 (e.g. 11 + 9), the third choice is "The ones make 0".
- In the question, "make" means *build* ("make a new ten"). In the answers, it means *add up to*. A weak reader or English learner hears the same verb doing two jobs within one item. "The ones make 0" also sounds odd.
- **Breaks:** english-learners.md (one word for one idea); traps (everyday vs. math meaning).
- **Rewrite:** "There are 15 ones" / "There are 9 ones" / "There are 5 ones". Keep the explain line "The ones make 15. 10 of them make a new ten." or change it to "There are 15 ones. 10 of them make a new ten." Skip pairs whose ones add to exactly 10, or accept "There are 0 ones" as a false-but-clear choice.

---

## 4. What's working well

- **The new equal bucket reads cleanly at every value.** "1 ten and 5 ones. Compare with 15." / "8 tens and 0 ones is what number?" / "2 tens and 1 one ☐ 11." Singular and plural are right for 0, 1 and 2–9, with no "1 ones" or "1 tens" anywhere.
- **Test frames no longer leak answers.** U2 puts the labels before the boxes, and U5's "8 + 5 = ☐ ones." is always plural, because the ones are always 10 or more.
- **Pointers match what is on screen.** "Look here. Tap Add. Count the cubes." matches the button "Add 6 cubes". "Look here. Jump to 99. Count to 100. See its row." Every say line is 8 words or fewer per sentence.
- **Shell lines are now K-level:** 4–5 words per sentence, with no *complete, activity, unlock* or *mastered*.
- **Banners say what happened** ("30! 3 tens!"), so they no longer suggest that a new row starts at 30.
- The only long generated lines are count-along lists in Show me ("Count: 10, 20, … 85. That is 85."), which are fine.

## 5. Out of my lane (for the curriculum checker)

- U3 CFU Q4 (blocks vs. 65) points at the Explore presets ("Look here. Try 53 and 53."). The presets compare two numbers, not sticks-and-cubes against a number, so the pointer may not teach Q4's step.
- U4 `tenLessCrossing` with start 98: the wrap-up "88, 98, 108. Only the tens changed." crosses 100. The words are fine; check whether the math claim is what the plan wants for 1st grade.
- U5 Practice and CFU Show me still counts the cubes from 1 (fixer note). `countFrom` could be reused there.
- Still with the user: C1-14 Test item, C1-15, passScore.

## 6. Guideline gaps (proposed, not edited)

- **checklist.md §3, Math words row:** add "Include unit titles, goals and Practice titles in the word grep, not only generated text. A title is read on every visit (e.g. 'Two-Digit')."
- (Round 2's four proposals still stand: no word after a blank that depends on the answer; check that later units don't use a word no earlier unit teaches; the voice must say the word the text prints; no bare signs in a sentence.)

## 7. What I could not check

- Real iOS Safari speech and pacing. I used `speakableText()` from `mathSpeech.ts`.
- Whether the spoken numbers in the U5 count-on ("8", "9" …) keep pace with the cubes on a real device. The fixer's browser run had sound off.
- How `ReadAloud` voices the unit title on the header and the path card. I assumed it is read.
- Real students.
