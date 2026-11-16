# English review: MG10 Decimal Place Value & Rounding, round 2 (re-review)

- Round: 2 · Date: 2026-11-15 · Units 1–2 only, their Tests, the Module Test (reused generators)
- Grade assessed: 5th (20 words). Read-alone text also checked against 4th (18 words). No read-aloud (Grade 5 convention), so voice-only items don't apply.
- Method: `english-check.cjs --grade 5` on all changed files. I read every new or changed string in `round-1-fixes.md` §4 in the code (`lib/steps.ts`, both units, both Tests, `DecimalBars.tsx`, `ThousandthPicture.tsx`). I traced the templates by hand; I did not run them live.

## 0. Status of round-1 English fixes

| ID | Status | Note |
|---|---|---|
| E1-01 | Fixed | "Find the hundredth just below it and the hundredth just above it." |
| E1-02 | Fixed | Names the place and gives 2.43 and 2.44. |
| E1-03 | Fixed | Explore tip and Key Idea. The carry wrap-up still uses the old wording (see E2-15). |
| E1-04 | Fixed | "When you round a number, it always changes." |
| E1-05 | Fixed | All four asides are rewritten in plain words. |
| E1-06 | Fixed | Names the place: "Write 0 in the hundredths place." |
| E1-07 | Fixed | Always plural ("Thousandths need 3 digits…"). |
| E1-08 | Fixed | Three short sentences, a numbered reading rule, no capitals. The thousandth picture adds only label text in words. |
| E1-09 | Skip | Not re-reported. |
| E1-10 | Fixed | "The longer bar is the greater number. The number of digits doesn't matter." |
| E1-11 | Fixed | "Having more digits…" |
| E1-12 | Fixed | "Answer both parts." with parts a./b. Explanations now start with the decimal. |
| Out-of-lane (greatest) | Fixed | The "fewest digits" claim is gone. |

**12 Fixed · 0 Not fixed · 0 caused a new problem.** E1-03 is partly carried: the wrap-up line was never in scope.

## 1. Verdict

**Ready.** The script finds 0 of 58 strings over the length limit (it was 2 of 75), and there are no Blockers or Majors. The new text from the curriculum fixes is short and plain. What's left is small: the new "Write every place up to the tenths" ends with a bare place name, a few expanded-form messages could be tighter, and one wrap-up still uses the older carry wording.

## 2. Scorecard

| Part | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell | Strong (0%) | Strong | Strong | n/a | n/a | Strong |
| U1 Reading/Comparing | Strong (0%) | Strong | Strong | n/a | n/a | OK (staged now) |
| U1 Test | Strong (0%) | Strong | Strong | n/a | n/a | Strong |
| U2 Rounding | Strong (0%) | Strong | OK (E2-13) | n/a | n/a | OK |
| U2 Test | Strong (0%) | Strong | OK | n/a | n/a | Strong |
| Module Test | Strong | Strong | OK | n/a | n/a | Strong |

## 3. New findings

Counts: **Blocker 0 · Major 0 · Minor 1 · Polish 3**

**E2-13 · Minor · "Write every place up to the tenths."**
- Where: `lib/steps.ts:276` `writeEveryPlace`. It is added to every rounding prompt with p > 0 (Practice, Unit 2 Test Q1–Q8, Module Test Q6–Q9) and to CFU Q1–Q3. Also Test Q9: "Write every place up to the place you round to."
- Problem: "the tenths" is a bare place name with no noun, so it can be read as "up to the tenths digit" or "up to tenths amounts". "Up to" can also mean "at most", which suggests leaving the 0 off. That is the opposite of what the line is for: the student must write 3.00, not 3.
- Breaks: traps §1 (an everyday meaning of "up to"); grade-5.md → Watch for (place words need "place").
- Rewrite: "Write a digit in every place through the tenths place, even a 0." For Test Q9: "Write a digit in every place through the place you round to, even a 0." If "through" seems too formal: "Show every place to the tenths place, even if the digit is 0."

**E2-14 · Polish · Expanded-form step wording** (`lib/steps.ts:144`)
- "Look at what each box is multiplied by." This uses a passive with a stranded preposition. "Find that place's digit in {x}." This uses a possessive on "place".
- Rewrite: "Look at the number each box is times. 1/10 means tenths, 1/100 means hundredths, 1/1000 means thousandths. Find the digit in that place in {x}." The same "1/10 is tenths" wording appears in the CFU Q2 message (`ReadingComparingDecimals.tsx:92`), so use "means" there too.

**E2-15 · Polish · Carry wrap-up still uses the old wording**
- Where: `RoundingDecimals.tsx:205`: "The 9 became 0 and the 1 carried to the left."
- Problem: "the 1 carried" uses "carry" with no object. The rest of the unit now says "add 1 to the place on its left".
- Rewrite: "The 9 became 10. You wrote 0 and added 1 to the place on its left."

**E2-16 · Polish · "which place is the N in?"** (`ReadingComparingDecimalsTest.tsx:88`, script flag)
- "In 7.264, which place is the 4 in?" ends in a preposition. It is fine to read, but it is clearer as "In 7.264, what place is the 4 in?" or better "In 7.264, name the place of the 4." Optional. This was carried from round 1, and it was not flagged then.

## 4. What's working well
- The new text follows the round-1 rules: it names the place, uses plurals correctly, and has no asides.
- Mixed-up expanded form: "The parts are mixed up. Type the digit that goes in each box." This is short and the instruction comes last. The named message "Don't copy the digits in the order you see them" says exactly what went wrong.
- The zoomed-bars caption "Zoomed in: each small mark is 1 thousandth" is 8 words and plain. The thousandth picture labels ("1 hundredth is shaded", "1 hundredth, bigger", "1 thousandth is shaded") are words only, which is right.
- The rounding sentences now use one word for each idea throughout: "just below / just above", "the digit that decides", "add 1 to the place on its left".

## 5. Out of my lane
- Feedback and hint strings show fractions as "1/10" slash text (CFU Q2 message, the expanded hint, "One thousandth is 1/1000" in Explore). Under the stacked-fractions rule, check whether these render stacked.

## 6. Guideline gaps
- grade-5.md → Watch for: add "**'Up to'** in an instruction can mean 'at most'. To ask for trailing 0s, say 'through the tenths place, even a 0'."

## 7. What I could not check
- I did not run the generators live; I traced them from the code. Real students.
