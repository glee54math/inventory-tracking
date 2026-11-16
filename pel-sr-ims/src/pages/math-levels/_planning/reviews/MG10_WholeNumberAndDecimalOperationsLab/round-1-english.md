# English review: MG10 Decimal Place Value & Rounding (WholeNumberAndDecimalOperationsLab)

- Round: 1 (full review)
- Date: 2026-11-15
- Grade assessed: 5th (limit 20 words/sentence). Read-alone text also checked against 4th grade (18 words).
- Scope: Units 1–2 only (Reading, Writing and Comparing Decimals; Rounding Decimals), their Tests, the Module Test and the shell. Units 3–5 are on hold, so they were not reviewed.
- Method: `english-check.cjs --grade 5 --all`, then I read every template in `lib/steps.ts`, `lib/decimals.ts`, both units, both Tests, ModuleTest and the shell. I traced the generators by hand to get real sentences (number names, singular and plural units). I did not run them in a browser.

## 1. Verdict

**Close to ready. The English is short, plain and consistent.** The script flags only 2 of 75 strings for length. The number-name generator is correct ("forty-two and seven hundred five thousandths", with no "and" inside the hundreds). The real problems are a few wording traps tied to this topic: **"the two tenths it is between"** also means 0.2, **"the two numbers at that place"** has no clear meaning, and one generated message says **"Thousandth need…"**.

## 2. Scorecard

| Part | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / home | Strong (0%) | Strong | Strong | n/a | OK | Strong |
| U1 Reading/Comparing | OK (1 over, 33w Explore paragraph) | Strong | OK | n/a (no stories) | OK | Weak (Explore part 1) |
| U1 Test | Strong (0%) | Strong | Strong | n/a | OK | Strong |
| U2 Rounding | OK (1 over, 21w) | Weak (E1-02) | Weak (E1-01) | n/a | OK | OK |
| U2 Test | Strong (0%) | OK | Strong | n/a | OK | Strong |
| Module Test | Strong | OK (reuses the above) | OK | n/a | OK | Strong |

Overall: 2 of 75 strings are over the limit (screen text 10%, task/after-answer text 0%). The median longest sentence in a task is 9 words.

## 3. Findings

Counts: **Blocker 0 · Major 2 · Minor 6 · Polish 3**

### Unit 2: Rounding Decimals

**E1-01 · Major · "the two tenths / two hundredths" reads as a number**
- Where: `lib/steps.ts:577` (`betweenStep` prompt). This is step 1 of every non-exact Practice problem in Unit 2.
- Text: "We will round 2.437 to the nearest hundredth. First find the two **hundredths** it is between." / "…First find the two **tenths** it is between."
- Problem: "two tenths" is also the amount 0.2, and "two hundredths" is 0.02. A 5th grader who has just learned that "forty-two thousandths" is a number can easily read it that way. The key idea says it more clearly: "between the hundredths 2.43 and 2.44". The whole-number version ("the two whole numbers") is fine.
- Breaks: traps §1 (an everyday reading that collides with the math meaning); grade-5.md → Watch for.
- Rewrite: "We will round 2.437 to the nearest hundredth. Which two hundredths is it between? Look at the place value chart." **Better**, with no "two + unit" phrase: "We will round 2.437 to the nearest hundredth. Find the hundredth just below it and the hundredth just above it." For p = 0, keep "First find the two whole numbers it is between."

**E1-02 · Major · "the two numbers at that place it sits between"**
- Where: `units/RoundingDecimals.tsx:138` (Explore opening line) and `:255` (Key Idea, "Find the two numbers at that place the decimal is between.").
- Problem: "that place" points to nothing; no place has been named yet. A relative clause ("it sits between") is also stacked on a prepositional phrase. This is the sentence that defines rounding, and a student at the bottom of the reading range can't parse it.
- Breaks: traps §6 (#1 long noun phrase, #4 relative clause, #6 a pronoun with nothing to point back to); grade-4.md → Grammar (nested clauses).
- Rewrite (Explore): "To **round** a decimal to a place, find the two numbers it is between at that place. Then pick the one it is closer to." Better, in two short steps: "To **round** 2.437 to the nearest hundredth, find the hundredths just below and just above it: 2.43 and 2.44. Then pick the one it is closer to."
- Rewrite (Key Idea): "Find the two hundredths that 2.437 is between: 2.43 and 2.44."

**E1-03 · Minor · "a 9 rounds up, it becomes 0"**
- Where: `RoundingDecimals.tsx:165` (Explore tip) and `:257` (Key Idea): "When a 9 rounds up, it becomes 0 and 1 carries to the left."
- Problem: The 9 doesn't round; you add 1 to it. "Rounds up" here doesn't mean the same as it does everywhere else in the unit. The wrap-up (`:205`) and the CFU feedback say it better ("When a 9 becomes 10, write 0 and add 1…").
- Rewrite: "When you add 1 to a 9, it becomes 10. Write 0 and add 1 to the place on its left: 2.996 rounds to 3.00."

**E1-04 · Minor · "a number's amount"**
- Where: `RoundingDecimals.tsx:95/100` (CFU Q4): "Rounding always changes a number's amount."
- Problem: A possessive noun phrase in a true/false statement, and "amount" is an odd fit for a number. Students must hold the whole claim in mind to judge it.
- Rewrite: "When you round a number, it always changes." (True/False stays the same.)

**E1-05 · Minor · Parenthesis asides read aloud**
- Where: `RoundingDecimals.tsx:76` options "the 4 (hundredths)" / "the 9 (thousandths)". `RoundingDecimalsTest.tsx:128` "Which number rounds to 4.2 (to the nearest tenth)?". `RoundingDecimalsTest.tsx:97` and `RoundingDecimals.tsx:238` "…rounds to 4.3 (the nearest tenth) and to 4 (the nearest whole number)."
- Breaks: traps §8; the script's aside rule.
- Rewrites: "the 4 in the hundredths place" / "the 9 in the thousandths place". "Round to the nearest tenth. Which number rounds to 4.2?" "To the nearest tenth, 4.27 rounds to 4.3. To the nearest whole number, it rounds to 4."

**E1-06 · Minor · "Write 0 there"**
- Where: `lib/steps.ts:620` (roundStep diagnose): "9 + 1 = 10, and 10 can't fit in one place. Write 0 there and add 1 to the place on its left."
- Problem: "there" and "its" point back to a place that is never named.
- Rewrite: "The hundredths digit is 9. 9 + 1 = 10, and 10 can't fit in one place. Write 0 in the hundredths place. Add 1 to the place on its left." (Build "hundredths" from `placeWord(p)`.)

### Unit 1: Reading, Writing and Comparing Decimals

**E1-07 · Minor · Generated grammar slip "Thousandth need 3 digits"**
- Where: `lib/steps.ts:454` (nameToDecStep diagnose). It uses `unit`, which is singular when the number after the point is 1.
- Real case: "three and one thousandth". The student types 3.1, and the message says "**Thousandth need** 3 digits after the point." The same happens with "Hundredth need 2 digits…" for 0.01.
- Breaks: checklist → Generated plurals.
- Rewrite: always use the plural place name, `PLACE_NAMES[d.p]`: "Thousandths need 3 digits after the point. Put a 0 in each empty place."

**E1-08 · Minor · Explore part 1 screen load**
- Where: `ReadingComparingDecimals.tsx:180–212`. The opening paragraph (33 words in 3 sentences), the place chart, and three new labels at once (Decimal / Number name / Expanded form). Then a 4-sentence reading rule in small muted text, with "LAST" in capitals (the voice reads it as a normal word).
- Breaks: grade-5.md → Limits (1–2 new math words per screen); checklist §5.
- Rewrite: Split the opening: "In 4th grade you used tenths and hundredths. The next place to the right is the **thousandths** place. 10 thousandths make 1 hundredth." Move "One thousandth is 1/1000" next to the expanded-form line. Make the reading rule a numbered list: "1. Say the whole number. 2. Say 'and.' 3. Read the digits after the point as one number. 4. Say the place of the last digit." Keep the 3.042 example.

**E1-09 · Minor · "= ?" mid-sentence in the expanded-to-decimal prompt**
- Where: `lib/steps.ts:504`: "4 + 7/10 + 5/1000 = ?  Write it as a decimal." The voice says "…equals question mark. Write it as a decimal."
- Breaks: traps §8.
- Rewrite: "Write 4 + 7/10 + 5/1000 as a decimal."

### Polish

**E1-10 · Polish:** `ReadingComparingDecimals.tsx:244`: "The longer bar is the greater number, however many digits it has." "however many" is a hard structure. Rewrite: "The longer bar is the greater number. The number of digits doesn't matter."

**E1-11 · Polish:** `ReadingComparingDecimals.tsx:361` (Key Idea): "More digits does not make a decimal greater." Rewrite: "Having more digits does not make a decimal greater."

**E1-12 · Polish:** CFU Q1 (`ReadingComparingDecimals.tsx:47–58`) starts "Look at 7.264." The second blank (writing 4.026) has nothing to do with 7.264. Move "Look at 7.264" into the first line only, or number the two parts "1a / 1b". Also, the generated explain and wrap-up lines start with a lowercase number name ("four and twenty-six thousandths = 4.026"). Rewrite: "4.026 is read 'four and twenty-six thousandths.'"

## 4. What's working well
- Number names are generated correctly at every size I traced (0–99 whole part, 1–999 after the point), with the right singular and plural ("one thousandth", "forty-two thousandths"). It uses the correct "and" for the point only.
- The lab uses one word for each idea throughout: "the digit that decides", "the halfway mark", "Fill empty places with 0s", "carry".
- The wrong-answer messages are short, name the mistake, and don't give the answer ("Only the hundredths digit decides. The digits after it don't count.").
- There are no story problems, so there's no word-problem load in a unit about place value. Prompts are 6–12 words.
- The voice says "<" / ">" as "is less than / is greater than", says "× 1/10" as "times one tenth", and says fractions as words.

## 5. Out of my lane
- `greatestQuestion` explain says "…is the greatest, even with the fewest digits". Check that the greatest always has the fewest digits, or the explain is false.
- The Explore readout can show "Number name: three" next to "3.000" when every digit after the point is 0. That is correct, but it might puzzle students. This is a curriculum call.

## 6. Guideline gaps
- **grade-5.md → Watch for**, add: "**'Two tenths' / 'two hundredths'** as a phrase means 0.2 / 0.02. When you mean 'the two neighboring tenths' in rounding, say 'the tenth just below and the tenth just above.'"
- **grade-5.md → Watch for**, add: "**Decimals read aloud.** The voice says '3.042' as 'three point zero four two.' When a lab teaches number names (5.NBT.3a), decide whether the voice should say the name ('three and forty-two thousandths') and keep it consistent." (`mathSpeech.ts` passes decimals through raw.)

## 7. What I could not check
- Real iOS speech for decimals. I expect "point" reading, which conflicts with the number names the lab teaches. This needs the user's decision: either leave it, or add a decimal-name rule to `mathSpeech.ts` for this lab.
- I did not run the generators live. I traced them by hand from the code, so rare combinations may hide other slips.
- Real students.
