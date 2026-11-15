# MG10 Expressions & Patterns: English review, round 2 (re-review)

- **Lab:** MG10 `NumericalExpressionsAndPatternsLab` ("Expressions & Patterns")
- **Round:** 2 (re-review of the round-1 fixes) · **Date:** 2026-11-14
- **Grade assessed:** 5th (plan: 5.OA.1, 5.OA.2, 5.OA.2.1 CA, 5.OA.3). Text the student reads alone was also held to the 4th-grade limits (18 words a sentence).
- **Read-aloud:** none (MG6+ convention, no TtsProvider). Every sentence has to work on the page. No voice to check.
- **Inputs:** `round-1-merged.md`, `round-1-fixes.md`, my `round-1-english.md`. I did not read any round-2 curriculum report.
- **Method:**
  - Ran `english-check.cjs --grade 5` on the shell, the lab folder, `ExprBuilder.tsx`, `buildExpr.ts`, `FactorBoxes.tsx` and `factors.ts`: 328 strings, **0 over the length limit**, 9 flags. All 9 are fine for grade 5; the new one, "Which number is NOT prime?", is the one C1-08 asked for.
  - Read every unit, CFU, Practice type, unit Test and the Module Test, with extra attention to text the round-1 fixes added.
  - Bundled the generators with esbuild and printed real sentences for: the build step × all 6 word templates (with a wrong-number build), the "where do the parentheses go?" step, and the "why times" step.

Paths are relative to `src/pages/math-levels/MG10/NumericalExpressionsAndPatternsLab/` unless they start with `shared/`.

## 0. Status of last round's English fixes

| ID | Round-1 problem | Status | Notes |
|---|---|---|---|
| E1-01 | "expression" used before it is taught | **Fixed** | Defined in U1 Explore before "Move the parentheses" (`units/WhyParentheses.tsx:167`), and in the U1 Key Idea (`:375`). |
| E1-02 | "go in every plate" | **Fixed** | Uses `scene.prep` in Practice (`:244`) and the Test (`WhyParenthesesTest.tsx:23`). |
| E1-03 | Story question asked twice | **Fixed** | The story is just `s.text`, and the question comes in step 2. |
| E1-04 | Picture label "extra" | **Fixed** | `spotLabel` (table / desk / bowl / prize box). |
| E1-05 | "The braces hold everything else. You work them out last." | **Fixed, but caused a new problem** | The false claim is gone. The new shared step's wording has two small problems: "Which marks do you work out first?" and the inverted "After them comes the step outside every mark." See E2-27. |
| E1-06 | Coupon / shipping / outfit | **Fixed** | `units/NestedGroups.tsx:192–193, :175`. |
| E1-07 | Mark names stand in for values; passives | **Fixed** | CFU Q2 text and labels, "A sign joins two groups.", "The marks show which numbers go together." |
| E1-08 | "ringed" | **Fixed** | "Work out the green part". This is a reasonable change from my "circled", because the ring is a rounded box. |
| E1-09 | work out / outward / inside out | **Fixed** | "outward" is gone. `valueStep` says "Then keep working from the inside out." |
| E1-10 | larger / more than / as many | **Fixed, but caused a new problem** | `lib/reading.ts` uses "larger" throughout. The new Explore line brings back "bigger" ("Same × 3, bigger group"), next to "larger" in the same sentence. See E2-28. |
| E1-11 | Allowance story | **Fixed** | `units/ReadingExpressions.tsx:201`. |
| E1-12 | CFU Q4 "Move the parentheses" | **Fixed** | `:109`. |
| E1-13 | Parenthetical asides; vague "that" | **Fixed** | `:124, :252`; Test `:98`. |
| E1-14 | "go into" | **Fixed** | Changed to "divide … evenly" everywhere (`PrimeFactors.tsx`, `PrimeFactorsTest.tsx:76`). |
| E1-15 | Gerund subject, "Use + Add", two button names, semicolon | **Fixed** | `PrimeFactors.tsx:52, :166`; `FactorBoxes.tsx:62, :65` ("+ Add a factor" / "− Remove a factor"). |
| E1-16 (+C1-20) | Laps story vs. table | **Fixed** | `Patterns.tsx:149`. |
| E1-17 | "plot" undefined; grid vs. graph | **Fixed** | Explore defines **plotting**. Type label "Plot the pairs", title "Ordered pairs on a grid", and the shell hero line all match. |
| E1-18 | "You plotted 1 points" | **Fixed** | `shared/lib/factors.ts:105`. |
| E1-19 | Pattern-step grammar | **Fixed** | All five rewrites are in place. |

**Totals: 19 English items. 17 Fixed, 0 Not fixed, 2 Fixed but caused a new problem (E1-05, E1-10; both small, logged as E2-27 and E2-28).**

## 1. Verdict

**The round-1 English fixes all landed, and the lab still reads at the right level.** No sentence is over the limit, and every new template is grammatical for every value I printed. One thing needs fixing before sign-off: a wrong choice in the new "Why is every B term k times…?" step, **"B adds more each time.", is a true statement** for every "times" pair. A student who reads it literally can choose it and be marked wrong. The other new issues are small: the wording of the new build step, a "What is wrong?" question whose answer can be "Nothing", and two short phrases.

## 2. Scorecard

| Part | Length (% over) | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / home | Strong (0%) | Strong | Strong | n/a | n/a | Strong |
| U1 Why We Need Parentheses | Strong (0%) | Strong | Strong (now defines "expression") | OK (placement prompt writes a bare equation, E2-32) | n/a | OK |
| U2 Brackets and Braces | Strong (0%) | OK (E2-27) | Strong | Strong | n/a | OK |
| U3 Reading an Expression | Strong (0%) | OK ("is how many times as large as" word order, E2-25) | OK ("add the last step", "bigger", E2-22/28) | OK (build-step messages, E2-23/24) | n/a | OK (Explore Part 2 is now long: 3 bar sets and 4 kinds of sentence) |
| U4 Prime Factors | Strong (0%) | OK (E2-21, E2-26) | Strong | n/a | n/a | OK |
| U5 Two Rules, Two Patterns | Strong (0%) | Strong | Strong | **Weak** (why-step trap is true, E2-20) | n/a | OK |
| Module Test | Strong (0%) | OK (inherits E2-21, E2-27) | Strong | Strong | n/a | Strong |

## 3. All findings (new this round)

### Unit 5: Two Rules, Two Patterns

**E2-20 · Major · The "why" step's wrong choice "B adds more each time." is true**
- **Where:** `lib/patternSteps.ts:101` (`whyTimesStep`), Practice "Two rules", times pairs only. The fixer flagged this too (round-1-fixes §6).
- **Exact text:** prompt "Why is every Pattern B term 2 times the matching Pattern A term?" Choices: "B starts at 2 × A's start and adds 2 times as much each time." / "B adds more each time." / "The first column shows it."
- **Problem:** For every times pair, k ≥ 2, so B really does add more each time. Students read answer choices as true or false statements, especially English learners and literal readers. They will see two true statements and have to guess which one counts as the "reason." The third choice is also vague: "shows it" has no clear "it," and a student who checked the first column can reasonably agree with it.
- **Breaks:** checklist §3, Giveaways / Text vs. picture (a distractor must be wrong, not just less complete); traps §1 (*more* with no "than" leaves the comparison open); grade-5.md → Watch for (no trick quantifiers).
- **Rewrite:** Keep the right choice. Make both traps clearly false:
  - "B adds the same number as A each time." (false for every times pair: B adds k × A's number)
  - "It works in the first column, so it works in every column." (the one-column misconception, stated clearly)
  - Optional: change "A's start" in the right choice to "A's first term" ("B's first term is 2 × A's first term, and B adds 2 times as much each time."), because the unit taught "term" and "start" only appears as a word in the rule.

### Unit 3: Reading an Expression (build step and new compare text)

**E2-22 · Minor · The build hint says "Then add the last step."**
- **Where:** `lib/reading.ts:154` (`buildStep` hint). Practice "Words to expression" step 2, Unit 3 Test Q2.
- **Problem:** In a lab where "add" is an operation, "add the last step" can be read as "use +", and the last step may be "multiply" or "divide."
- **Breaks:** english-learners.md (one word, one meaning); traps §1 (everyday word with a math meaning).
- **Rewrite:** "Which step do the words say to do first? Put the parentheses around it. Then write the last step outside them."

**E2-23 · Minor · The "wrong numbers" build message is wrong for "double it"**
- **Where:** `shared/lib/buildExpr.ts:71`, reached from `buildStep` with the `addDouble` template (`lib/stories.ts:148`).
- **Exact text (printed):** words "Add 9 and 2, then double it."; a wrong number gets "Check the numbers. Use the numbers the words give you."
- **Problem:** The 2 that "double" stands for is not a number in the words. A student who leaves the 2 out because no "2" is written gets a message that tells them to look for numbers that aren't there.
- **Breaks:** builder rule (feedback must match the case); traps §5 (a small word, *double*, carries an operation and a number).
- **Rewrite:** Give the `addDouble` build its own `diagnose` for a missing or wrong 2: "\"Double it\" means multiply by 2." The shared message can stay as it is for the other templates.

**E2-24 · Minor · "the expression you wrote" is not always what the student wrote**
- **Where:** `units/ReadingExpressions.tsx:402`: `Find the value of the expression you wrote: ${exprText(t2.expr)}.`
- **Problem:** The builder accepts either order on the sides of + and × (for example 3 × (24 − 5)). The prompt then prints the stored order, (24 − 5) × 3, and calls it the student's expression. The text and the screen disagree.
- **Breaks:** checklist §3, Text vs. picture.
- **Rewrite:** Best: print the student's own build (`builtInputText` of the step-2 inputs, which the engine already has through `help.answers`). Otherwise: `Find the value of ${exprText(t2.expr)}.`, without "you wrote."

**E2-25 · Minor · "… is how many times as large as …?" puts the question word in the middle**
- **Where:**
  - `units/ReadingExpressions.tsx:444`: "Don't work it out. 6 × (8 + 7) is how many times as large as (8 + 7) × 2?"
  - `lib/reading.ts:43`, ratio form, now 2 draws in 3: "12 × (18,932 + 921) is how many times as large as 3 × (18,932 + 921)?"
  - `lib/reading.ts:28`, plain form (older, but it is the same pattern).
- **Problem:** This is an "echo question": the *how many* sits in the middle of a statement, with two long expressions on either side. It is hard for English learners to parse, and the two expressions are easy to swap. The CFU (Q2) handles the same idea well with a sentence frame and a blank.
- **Breaks:** english-learners.md (question word order); grade-5.md → Grammar (keep long noun phrases out of the question).
- **Rewrite:** Use the CFU's frame, a `sentence` with a number blank: "12 × (18,932 + 921) is __ times as large as 3 × (18,932 + 921)." Or split it into two sentences: "Compare 12 × (18,932 + 921) with 3 × (18,932 + 921). How many times as large is the first one?"

**E2-28 · Polish · "Same × 3, bigger group:" (Explore Part 2)**
- **Where:** `units/ReadingExpressions.tsx:287`.
- **Problem:** "bigger" and "larger" appear in one sentence, after round 1 settled on "larger." "Same × 3" uses a symbol as a word.
- **Rewrite:** "Both multiply by 3, but one group is larger: 3 × (18,932 + 1,021) is larger than 3 × (18,932 + 921), because 1,021 is larger than 921."

**E2-29 · Polish · The stepper label "Compare with" has no unit**
- **Where:** `units/ReadingExpressions.tsx:274`.
- **Rewrite:** "Compare with (copies)" or "Copies to compare". The merged list said "Compare with ___ copies."

### Unit 4: Prime Factors

**E2-21 · Minor · "What is wrong?" when the answer can be "Nothing is wrong."**
- **Where:** `units/PrimeFactorsTest.tsx:170, :198` (`notFinishedQuestion`). It is in the U4 Test and the Module Test, and it is new with C1-19.
- **Exact text:** "Kim says the prime factorization of 20 is 5 × 2 × 2. What is wrong?" Right answer: "Nothing is wrong."
- **Problem:** The question takes for granted that something is wrong. Literal readers and English learners trust the question, so they look for a mistake to choose, and "Nothing is wrong." reads like a trick.
- **Breaks:** checklist §3, Giveaways (a misleading question); grade-5.md → Watch for (trick quantifiers or logic).
- **Rewrite:** "Kim says the prime factorization of 20 is 5 × 2 × 2. Is anything wrong?" Use the same prompt for both forms, so the wording doesn't give away the answer.

**E2-26 · Minor · "35 divides itself, but look for a smaller prime."**
- **Where:** `units/PrimeFactors.tsx:301`, Many factors, smallest-prime step, the message when the student types n.
- **Problem:** "a smaller prime" suggests that n is itself a prime. Every n here is not prime (it has two prime factors).
- **Rewrite:** "35 is not prime. Which prime divides 35 evenly? Try 2, then 3, then 5."

**E2-30 · Polish · Passive voice in the "Is it prime?" wrap-up**
- **Where:** `units/PrimeFactors.tsx:405`: "29 is prime, so it is written as just 29."
- **Rewrite:** "29 is prime, so you write just 29." This matches the Test's wording.

**E2-31 · Polish · "Kim needs to break it down."**
- **Where:** `units/PrimeFactorsTest.tsx:200`.
- **Problem:** A phrasal verb. The unit says "break into primes" or "split" everywhere else.
- **Rewrite:** "{bad} is not prime. Kim needs to split it into primes."

### Unit 2: Brackets and Braces

**E2-27 · Minor · Outside-marks wording (new shared step, Practice + Test + Module Test)**
- **Where:** `lib/steps.ts:47–52` (`outsideMarksStep`).
- **Exact text and problems:**
  - "Which marks do you work out first?" You work out the part inside the marks, not the marks. Round 1 (E1-07) fixed the same mix-up of the marks with what they hold.
  - "The parentheses are inside all the other groups, so you work them out first." Same mix-up.
  - "After them comes the step outside every mark." Inverted subject and verb, and "them" points back to the marks.
- **Breaks:** english-learners.md (ELs read "brackets" literally as the marks); grade-5.md → Grammar (keep inverted or complex structures rare).
- **Rewrite:**
  - prompt: "Which marks hold the part you work out first?"
  - explain (first): "The part in parentheses is inside all the other groups, so you work it out first. Then keep working from the inside out."
  - explain (outside): "The {name} hold all the other groups, so they are on the outside. Then do the last step, outside all the marks."

### Unit 1: Why We Need Parentheses

**E2-32 · Polish · The placement prompt writes an equation that isn't true as printed**
- **Where:** `units/WhyParentheses.tsx:308`.
- **Exact text (printed):** "New numbers. Where do the parentheses go so 2 + 5 × 9 = 63?"
- **Problem:** "so" means "so that" here. Also, "2 + 5 × 9 = 63" is printed as a statement before any parentheses are placed. A student who reads it as a claim may stop to wonder whether it is true.
- **Rewrite:** "New numbers. Put parentheses in 2 + 5 × 9 so that its value is 63. Where do they go?"

### Checked and fine (new text from round-1 fixes)
- "Which number is NOT prime?": the capitals and the story line ("Only one of them is not prime.") set it up. Fine for grade 5.
- Builder labels ("Where do the parentheses go?", "Type the numbers. Tap the signs.") and the other builder messages are short and clear, and none of them states the answer. The "Subtract b from a" message names the order trap well.
- Explore Part 2 sentences (copies, compare, ÷ equal parts), the C1-09 prime check ("29 ÷ 2, 29 ÷ 3 and 29 ÷ 5 all leave a remainder, so 29 is prime."), "Pattern B is the same as Pattern A.", and the smallest-prime step's prompt, hint and explanation all read well.
- Sometimes-question sentence ("In (3 + 4) + 5 and 3 + (4 + 5), both values are __. So moving the parentheses __ changes the value."), the times-trap choices, and the sameEnd form B.

## 4. What's working well
- **0 of 328 strings are over the grade-5 limit.** The median longest sentence is 5–10 words, even after a lot of new text.
- **The round-1 word choices held up across the new text:** "divide … evenly," "inside out," "plot / grid," "outfit," "the part in parentheses." The new curriculum text (the build step, the placement step, the ratio step, the C1-09 prime checks) uses them too.
- The build step's word templates print grammatically for all 6 templates and every number range.
- **The definition of "expression" now comes first:** a student meets it in U1 before any question uses it.

## 5. Out of my lane (learning)
- **U1 placement step:** writing "2 + 5 × 9 = 63" assumes a student won't apply "multiply first." The lab avoids that rule on purpose, so a student who knows it may find the target confusing. (Worth a look by the curriculum checker; my rewrite in E2-32 keeps the equation out of the statement.)
- **U3 Explore Part 2:** this section now has 2 modes, 2 steppers, 3 bar sets and 4 kinds of sentence. That may be too much on one screen for the bottom of the grade.

## 6. Guideline gaps
- **checklist.md §3 → Giveaways row:** add "A distractor must be false, not just less complete. In 'Why…?' questions, every wrong choice must be a false statement, never a true fact that isn't the reason."
- **english-learners.md → What hurts:** add "Echo questions with the question word in the middle ('X is how many times as large as Y?'). Use a sentence frame with a blank, or put the question word first."
- **checklist.md §3:** add "A 'What is wrong?' question whose answer can be 'Nothing' takes for granted that something is wrong. Ask 'Is anything wrong?'"

## 7. What I could not check
- Real students, and how the builder (4 sign buttons a slot, wrapping on iPad portrait) feels to use.
- No voice to check: the lab is not read-aloud.
- I printed the build step, placement and why-step generators. I read the other changed text from source (the logic is simple string templates) but did not render it.
