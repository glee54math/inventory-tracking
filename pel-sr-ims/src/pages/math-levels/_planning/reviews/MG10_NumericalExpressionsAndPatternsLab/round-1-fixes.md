# MG10 Expressions & Patterns: round 1 fixes

- Lab: MG10 `NumericalExpressionsAndPatternsLab`, Grade 5
- Round: 1 · Date: 2026-11-14 · Work order: `round-1-merged.md` (every row marked Fix, including the user's C1-02 decision)
- Not committed.

## 1. Summary

**41 rows in the merged list: 38 Fixed, 3 Partly fixed (closest change that meets the intent, explained below), 0 Needs decision, 0 Not fixed.**

- Partly fixed:
  - **C1-08**: the "look prime" pool can't be widened. 9, 21, 27, 33, 39 and 49 are every odd composite from 2 to 50 that doesn't end in 5. The other two parts are done: the "NOT prime" flip and the typed factor-pair step.
  - **E1-08**: the button now says "Work out the green part", not "circled". The ring is a rounded green box. "The part with the outline" would be unclear because Explore outlines every group.
  - **C1-22**: both halves are done. It is marked partly fixed only because finger feel on a real iPad is still unverified.
- Things that differ from the agreed change:
  - **C1-02 (build step)**: the student writes an expression for **new words** (a different template), not the words they just picked for. Building the same expression again would copy the answer chip on screen, and the builder rules call that a copy step. Step 3 now finds the value of the expression they wrote.
  - **C1-15**: the placement step uses **new numbers**. Steps 1–2 already work out both groupings of the first numbers, so the same numbers would answer it.

## 2. Item table

Paths are relative to `src/pages/math-levels/MG10/NumericalExpressionsAndPatternsLab/` unless they start with `shared/`.

| ID | Status | What changed | Where |
|---|---|---|---|
| C1-06 | Fixed | While a factors step is asked, the tree shows only the top number. After a wrong try it shows one split with no circles, but only if one child is not prime; otherwise it shows the text cue "Try dividing by 2, 3, 5 and 7." Many factors step 2 draws the student's own pair (no circles, caption "Your start"). The full tree appears only when the step is done or the answer is shown. *Is it prime?* follows the same rule. | `units/PrimeFactors.tsx:234` (`factorsPicture`), `:274`, `:291`, `:359`; `lib/primes.ts:81` (`helpSplit`, `pairTree`); engine `VisualHelp.answers` |
| C1-01 | Fixed | Added (a + b) − c and (a × b) ÷ c (b ÷ c whole) to the no-change pool, and (a ÷ b) × c to the change pool. New hint: "Find the value both ways. Are they the same?" New wrap-up line. Explore Part 3 has a "+ and −" button. | `lib/expr.ts:236`; `lib/reading.ts:126`; `units/ReadingExpressions.tsx:329, :512` |
| C1-10 | Fixed | Practice `ExprView` has no outlines. Outlines and the ring appear only with `pointing(help, i)`. Explore keeps its outlines. The Test's first-part and bracket-part questions now show the same plain `ExprView`. | `units/NestedGroups.tsx:255`; `units/NestedGroupsTest.tsx:68, :95` |
| C1-03 | Fixed | "How big is it?" uses the ratio variant 2 times in 3. In "Expression to words" the copy step is now a ratio step: "j·k × (group) is how many times as large as k × (group)?" CFU Q1's typed box is now the value (30). CFU Q2 now asks 6 × (…) vs 2 × (…), answer 3. Q2 names the "4 (more than)", "6 (one copy)" and computed-value mistakes. Unit 3 CFU: 3 of 4 questions have typed boxes, and none is a copy. | `units/ReadingExpressions.tsx:43, :63, :444, :469` |
| C1-02 | Fixed (user decision) | New shared Step kind `buildExpr`: tap where the parentheses go, type the numbers, tap the signs. It is graded by structure, so either order on the two sides of + or × counts (2 × (8 + 7) = (7 + 8) × 2). Named mistakes: wrong grouping, wrong numbers, wrong signs, parts in the wrong places, and "Subtract b from a" written backwards. In "Words to expression" it is step 2 (new words), then step 3 finds the value of that expression. Test Q2 is now a build question (subTimes). | `shared/lib/buildExpr.ts`; `shared/components/ExprBuilder.tsx`; `lib/reading.ts:135, :149`; `units/ReadingExpressions.tsx:378`; `units/ReadingExpressionsTest.tsx:37, :131` |
| E1-01 | Fixed | Added the definition of "expression" to U1 Explore before "Move the parentheses", and an expression sentence to the U1 Key Idea. U3 keeps its own sentence as a reminder. | `units/WhyParentheses.tsx:167, :375` |
| E1-05 + C1-12 | Fixed | *Outside marks* uses 2- and 3-layer expressions only. It asks at random "Which marks are on the outside?" or "Which marks do you work out first?" Explanation and wrap-up use the agreed wording. Practice and the Test now share one step builder, so they say the same thing. | `lib/steps.ts:41`; `units/NestedGroups.tsx:316`; `units/NestedGroupsTest.tsx:113` |
| C1-04 | Fixed | Explore Part 2 has a "Compare with ___ copies" stepper. The bars show k copies against j copies, with a sentence (times as large / larger / equal / smaller). There is also a "Same × k, bigger group" line with its own bars. | `units/ReadingExpressions.tsx:161–300`; `diagrams/TimesBars.tsx` (`BarRows`) |
| C1-05 | Fixed | Explore Part 2 has a "÷ equal parts" mode with split bars. `largerCompare` has a ÷ form: (A + B) ÷ k vs A + B. That covers Practice, the Test and the Module Test. The CFU blank is unchanged. | `units/ReadingExpressions.tsx:264`; `lib/reading.ts:59` |
| C1-07 | Fixed | For numbers with exactly two prime factors, step 1 of *Many factors* is now typed: "What is the smallest prime that divides n evenly?" It names 1, n itself, a non-prime divisor, a larger prime, and a number that leaves a remainder. | `units/PrimeFactors.tsx:291` |
| C1-08 | Partly fixed | Half the time the question is "Which number is NOT prime?" (one look-alike, two primes), in Practice and the Test. Every problem adds the typed step "Show that c is not prime. Type a factor pair of c." For 27 there is also a full factorization step. Pool not widened (see Summary). | `units/PrimeFactors.tsx:359`; `units/PrimeFactorsTest.tsx:37`; `lib/primes.ts:29` (comment) |
| C1-11 | Fixed | In Practice and the Test, the "outside first" distractor is now the outer group written out, e.g. "[6 × (15 − 7)]". 3000 of 3000 draws have more than one choice with marks. | `units/NestedGroups.tsx:265`; `units/NestedGroupsTest.tsx:60`; `lib/expr.ts:334` (`groupPath`, `groupText`) |
| C1-13 | Fixed | *Outside marks* buttons show names only (`SYM_NAME`), in Practice and the Test. The picture keeps the colored marks. | `lib/steps.ts:41` |
| C1-15 | Fixed | *Parentheses first* has two new steps with new numbers. Step 3 asks "Where do the parentheses go so a o b o c = V?" with choices (a o b) o c / a o (b o c) / "Either place works.". The target comes from either grouping (balanced), and "either" is never right. Step 4 types the value of the other grouping. | `units/WhyParentheses.tsx:275–340` |
| C1-18 | Fixed | For "times" pairs only, *Two rules* has a new step 3: "Why is every Pattern B term k times the matching Pattern A term?" It has the agreed right answer and two traps, shuffled. | `lib/patternSteps.ts:94`; `units/Patterns.tsx:338` |
| C1-19 | Fixed | `timesTrapQuestion`: half the time a real ×2 pair, so "Yes. Every column works…" is right. `notFinishedQuestion`: half the time Kim's primes are right but reordered, so "Nothing is wrong." is right. `sameEndQuestion` has a second form whose answer is the list of primes. Splits from 4000 draws: 49/51, 50/50, and 58/42 between the two sameEnd forms. | `units/PatternsTest.tsx:120`; `units/PrimeFactorsTest.tsx:93, :170` |
| C1-20 + E1-16 | Fixed | Laps story reworded as agreed. | `units/Patterns.tsx:149` |
| C1-22 | Fixed (unverified feel) | Practice and Test plot problems are capped at 12 on both axes. The plot step is 520 px wide (was 380) and `.plot-step` max-width is 540 px. Measured on iPad portrait: the grid is 520 px wide, about 37 px per column at x = 12. | `units/Patterns.tsx:347`; `units/PatternsTest.tsx:75`; `shared/engine/StepProblem.tsx` (plot branch); `shared/styles/lab-base.css` (.plot-step) |
| E1-02 | Fixed | Hint uses `scene.prep` ("go on every plate"), in Practice and the Test. | `units/WhyParentheses.tsx:244`; `units/WhyParenthesesTest.tsx:23` |
| E1-06 | Fixed | Shopping story and line 177 reworded as agreed ("outfit" defined; "subtract the coupon"). | `units/NestedGroups.tsx:175, :192` |
| E1-07 | Fixed | CFU Q2 text and blank labels ("the part in parentheses / brackets"). Story: "A sign joins two groups." Wrap-up: "The marks show which numbers go together." | `units/NestedGroups.tsx:76–83, :341, :357` |
| E1-09 | Fixed | `valueStep` hint now ends "Then keep working from the inside out." Wrap-ups and CFU say "Inside first, then out." "outward" no longer appears anywhere (grep and brute force both clean). | `lib/steps.ts:27`; `units/NestedGroups.tsx:83, :284` |
| E1-10 | Fixed | "larger" is used throughout the comparisons ("…is larger than…", "…3 times as large as 3 copies"). | `lib/reading.ts:44, :86, :93` |
| E1-11 | Fixed | Allowance story reworded as agreed. | `units/ReadingExpressions.tsx:201` |
| E1-12 | Fixed | CFU Q4 prompt reworded as agreed. | `units/ReadingExpressions.tsx:109` |
| E1-13 | Fixed | No more parenthetical asides. The CFU Q4 praise and the Test explanation match the new wrap-up. The Explore line now says "Its value is 9. But you can read what it says without finding the value." | `units/ReadingExpressions.tsx:124, :252`; `units/ReadingExpressionsTest.tsx:79` |
| E1-14 | Fixed | No more "go into": the prime hint, the *Many factors* pair hint and the Test factor-pair hint now say "divide … evenly". | `units/PrimeFactors.tsx:228`; `units/PrimeFactorsTest.tsx:76` |
| E1-17 | Fixed | Explore defines **plotting**. The type label is now "Plot the pairs" and the title "Ordered pairs on a grid". The unit goal and the shell's hero line say "plot … on a grid" instead of "graph". | `units/Patterns.tsx:220, :353, :416`; shell `MG10_NumericalExpressionsAndPatternsLab.tsx:91` |
| E1-18 | Fixed | "You plotted 1 point." Singular/plural follows n. Confirmed in the browser. | `shared/lib/factors.ts` (`checkPlot`) |
| C1-09 | Fixed | When the Explore number is prime, it shows the real checks, e.g. "29 ÷ 2, 29 ÷ 3 and 29 ÷ 5 all leave a remainder, so 29 is prime." The wording covers 1, 2 or 3 checks. 2 and 3 just say "n is prime." | `units/PrimeFactors.tsx:142` |
| C1-14 | Fixed | `whoIsRightQuestion` redraws until the left-to-right value is a whole number that isn't the answer. The explanation always names it. | `units/NestedGroupsTest.tsx:149` |
| C1-16 | Fixed | About half of *Stories* step-2 prompts are just the story's question, with no expression printed. | `units/WhyParentheses.tsx:222, :253` |
| C1-17 + E1-04 | Fixed | Each scene has a `spotLabel` (table / desk / bowl / prize box), passed as `extraLabel`. | `lib/stories.ts`; `units/WhyParentheses.tsx:224` |
| C1-21 | Fixed | When the two rules are the same, the line says "Pattern B is the same as Pattern A." | `units/Patterns.tsx:213` |
| C1-23 | Fixed | Module Test: `termQuestion` swapped for `relationQuestion("medium", "times")`. | `units/ModuleTest.tsx:59` |
| C1-24 | Fixed | After a wrong "which is larger?" pick, the picture shows `BarRows` for both expressions. The larger-group bar is drawn 1.2× wide as a schematic, because the real sizes differ by under 1%. | `lib/reading.ts:59`; `units/ReadingExpressions.tsx:479` |
| C1-25 + E1 note | Fixed | `sometimesQuestion` draws a fresh changing pair (shown worked out in the prompt) and a fresh + + or × × pair, and the student types that pair's value. Both cases are next to the blanks. | `units/ReadingExpressionsTest.tsx:79` |
| E1-03 | Fixed | The *Stories* story is just `s.text`. The question comes in step 2. | `units/WhyParentheses.tsx` (`storyProblem`) |
| E1-08 | Partly fixed | "Work out the green part" (see Summary). | `units/NestedGroups.tsx:217` |
| E1-15 | Fixed | Explore: "When you write a number as primes multiplied together…". CFU Q1: "Tap **+ Add a factor** to get another box." Buttons: "+ Add a factor" / "− Remove a factor". Wrap-up: "The start can change. The primes don't." | `units/PrimeFactors.tsx:52, :166, :456`; `shared/components/FactorBoxes.tsx` |
| E1-19 | Fixed | All five rewrites as agreed (predict hint, both predict diagnoses, "Another pattern is…", "Write it like this: (A term, B term).", the CFU Q4 message). | `lib/patternSteps.ts:64–71`; `units/Patterns.tsx:133, :291, :375` |

Also changed to stay consistent (same screen as E1-05): the U2 CFU Q3 wrong-answer message said "The outside marks hold everything else", the same false claim. It now says "…hold all the other groups." (`units/NestedGroups.tsx`, `NestedCheck`)

## 3. Changed files

Shared. Only MG10 Expressions & Patterns uses `buildExpr`, `plot` and `VisualHelp.answers` (grep confirmed). Everything is additive, and other step kinds are unchanged.
- `shared/engine/types.ts`: new `BuildExprStep`/`BuiltExpr` and the optional `VisualHelp.answers`.
- `shared/engine/StepProblem.tsx`: `buildExpr` in `answerText`/`check`/`StepInput`, the Check-waits rule, `help.answers`, and the plot step's width/height.
- `shared/engine/UnitTest.tsx`: review text for `buildExpr`.
- `shared/lib/buildExpr.ts` (new).
- `shared/components/ExprBuilder.tsx` (new).
- `shared/styles/lab-base.css`: `.plot-step` max-width 420 → 540 (only plot steps use it, and only MG10 has plot steps) and new `.expr-build*` rules.
- `shared/lib/factors.ts`: the "1 point" message.
- `shared/components/FactorBoxes.tsx`: "− Remove a factor".
- MM1 RatioLab is unaffected: `FirstQuadrantPlane` itself was not changed.

Lab:
- `lib/expr.ts`, `lib/steps.ts`, `lib/reading.ts`, `lib/stories.ts`, `lib/primes.ts`, `lib/patternSteps.ts`
- `diagrams/TimesBars.tsx` (BarRows), `diagrams/index.ts`
- all 5 units and their Tests, and `units/ModuleTest.tsx`
- shell `MG10_NumericalExpressionsAndPatternsLab.tsx` (hero line) and `_styles.css` (split-bar rules)

Docs: `VISUAL_COMPONENT_TODO.txt` has a "Round 1 fixes" note under this lab.

## 4. New or rewritten student text

U1 `WhyParentheses.tsx`
- Explore: "An **expression** is a math phrase made of numbers and signs, like (2 + 1) × 3. It has no = sign."
- Key Idea: "An expression, like (4 + 6) × 3, is numbers and signs that show a calculation."
- Stories hint: "Do the {item2} go {in|on} every {group}, or just once?" The Test hint has the same fix.
- Stories step 2, half the time: just "{How many … are there in all?}"
- Parentheses first, step 3: "New numbers. Where do the parentheses go so {a o b o c} = {V}?" Choices: the two groupings and "Either place works." Hint: "Find the value of each one. Which one makes {V}?"
- Parentheses first, step 4: "Now find the value of the other one: {expr}." Explain: "{work}. Moving the parentheses changed the value." Wrap-up adds "To get {V}, the parentheses go here: {expr}."

U2 `NestedGroups.tsx` / `NestedGroupsTest.tsx` / `lib/steps.ts`
- CFU Q2: "The part in parentheses: 5 + 3 = __. The part in brackets equals __. The whole expression equals __." Labels: "Value of the part in parentheses / in brackets". Praise ends "Inside first, then out."
- CFU Q3 wrong message: "The outside marks hold all the other groups. The part you work out first is the group inside all the others."
- Explore story: "Ana buys a shirt and a hat for each friend. A shirt and a hat together are one **outfit**. A coupon makes each outfit a few dollars cheaper. [Then she pays one shipping cost to mail them.]"
- Explore step line: "Next the brackets: subtract the {c}-dollar coupon. One outfit costs {n} dollars."
- Explore button: "Work out the green part".
- Two layers wrap-up: "{work}. Inside first, then out."
- Outside marks:
  - prompts: "Which marks are on the outside?" or "Which marks do you work out first?"
  - hints: "Find the marks that hold all the other groups." / "Find the group that is inside all the other groups."
  - explains: "The {name} hold all the other groups, so they are on the outside. After them comes the step outside every mark." / "The parentheses are inside all the other groups, so you work them out first. Then keep working from the inside out."
  - wrap-up: "{work}. Inside first. The outside marks come after the inner groups."
- Two groups: story "A sign joins two groups. Work out each group first."; wrap-up ends "The marks show which numbers go together."
- Who is right explanation: "{work}. {L2R} comes from going left to right."
- `valueStep` hint (all units): "Work out {first} first. Then keep working from the inside out."

U3 `ReadingExpressions.tsx` / `ReadingExpressionsTest.tsx` / `lib/reading.ts` / `shared/lib/buildExpr.ts` / `ExprBuilder.tsx`
- CFU Q1: "The expression is __. Its value is __."
  - praise: "Yes. The words say to add first, so 8 + 7 goes in parentheses. 8 + 7 = 15, and 2 × 15 = 30."
  - wrong: "23 is (2 × 8) + 7. The words say to add 8 and 7 first." / "Add 8 and 7 first. Then multiply by 2."
- CFU Q2: "6 × (18,932 + 921) is __ times as large as 2 × (18,932 + 921)."
  - praise: "Right. 6 copies is 3 times as large as 2 copies, because 2 × 3 = 6. You didn't need to add."
  - wrong: "You worked it out. The question asks how many TIMES as large. Compare the copies." / "6 copies is 4 MORE than 2 copies. How many TIMES as large is it?" / "6 × (18,932 + 921) is 6 times as large as ONE copy. Compare it with 2 copies." / "Both have the same group. How many times as large is 6 as 2?"
- CFU Q4 prompt: "Here the parentheses are in two different places. Find each value. Then finish the sentence." Praise: "Correct. With only adding, or only multiplying, moving the parentheses never matters. With other signs, it sometimes does. Find both values to check."
- Explore story: "Grandma gives you 12 dollars. Grandpa gives you 15 dollars. You and your 2 cousins share all the money equally. That's 3 kids. The expression is (12 + 15) ÷ 3: add first, then divide."
- Explore words line: "…Its value is {v}. But you can read what it says without finding the value."
- Explore Part 2:
  - buttons: "× copies" / "÷ equal parts"; steppers: "Compare with", "Equal parts"
  - copies line: "{k} × (G) is {k} copies of G. So it is **{k} times as large** as G. You never need to add the big numbers."
  - compare lines: "{k} copies is **{q} times as large** as {j} copies, because {j} × {q} = {k}." / "{k} copies is **larger than** {j} copies." / "Same number of copies of the same group, so they are equal." / "{k} copies is **smaller than** {j} copies."
  - bigger group: "Same × {k}, bigger group: {k} × (A + C) is larger than {k} × (A + B), because C is larger than B."
  - divide: "(G) ÷ {k} splits G into {k} equal parts. One part is smaller than the whole group. So (G) ÷ {k} is **smaller than** G."
- Explore Part 3: button "+ and −"; line "Same value here. Try other signs and numbers. Find both values to check."
- Words to expression:
  - step 2: "Now write one yourself. {words}"; builder labels "Where do the parentheses go?" and "Type the numbers. Tap the signs."
  - hint: "Which step do the words say to do first? Put the parentheses around it. Then add the last step."
  - explain: "The first step goes in parentheses: {expr}."
  - step 3: "Find the value of the expression you wrote: {expr}."
  - wrap-up: "{words 1} That is {expr 1}. {words 2} That is {work 2}."
- Builder messages:
  - "Tap where the parentheses go."
  - "Fill in every number and every sign."
  - "Type one whole number in each box."
  - "Check the numbers. Use the numbers the words give you."
  - "Check the signs. Which words tell you to add, subtract, multiply or divide?"
  - "The numbers and signs are right. Put the parentheses around the step the words say to do first."
  - "The numbers and signs are right, but not in the right places. Read the words again. Which step comes first, and which number does it start with?"
  - "\"Subtract {b} from {a}\" starts with {a}. Write {a} first."
- Test Q2 prompt: "Write an expression for these words: {words}"
- Expression to words, step 2 (outer ×):
  - prompt: "Don't work it out. {jk} × ({inner}) is how many times as large as {expr}?"
  - hint: "{expr} is {k} copies of ({inner}). How many times as large is {jk} copies as {k} copies?"
  - explain: "{jk} copies of ({inner}) is {j} times as large as {k} copies, because {k} × {j} = {jk}."
  - wrong: "{expr} is already {k} copies. Compare {jk} copies with {k} copies." / "{jk} is {v} MORE than {k}. How many TIMES as large is it?" / "That's a value you worked out. Compare the copies instead."
- Ratio explain: "{jk} copies of the group is {k} times as large as {j} copies, because {j} × {k} = {jk}."
- Which is larger:
  - "Both use the same group. {hi} copies is larger than {lo} copies."
  - "Both multiply by {k}. A + C is larger than A + B, because C is larger than B."
  - "Dividing by {k} splits G into {k} equal parts. One part is smaller than the whole group."
- Change step: hint "Find the value both ways. Are they the same?"; no-change explain "No. {work L}, and {work R}. Both equal {v}."
- Move the parentheses wrap-up: "Sometimes it changes and sometimes it doesn't. Find both values to check."
- Test "Fill in the blanks":
  - prompt: "{X} = {x}, but {Y} = {y}. Now fill in the blanks."
  - sentence: "In {L} and {R}, both values are __. So moving the parentheses [sometimes] changes the value."
  - hint: "Find the value of {L} and of {R}. Then compare with the first pair."
  - explain: "{work L}, and {work R}. With only adding, or only multiplying, moving the parentheses never matters. With other signs, it sometimes does. So: sometimes."

U4 `PrimeFactors.tsx` / `PrimeFactorsTest.tsx`
- CFU Q1: "Write 20 as a product of prime factors. Tap **+ Add a factor** to get another box."
- Explore: "When you write a number as primes multiplied together, that is its **prime factorization**." and "{n} ÷ 2, {n} ÷ 3 and {n} ÷ 5 all leave a remainder, so {n} is prime." (or "both leave", "leaves", or "{n} is prime.")
- Prime hint: "Can you divide {n} evenly by any number other than 1 and {n}?"
- Pair hint (Practice and Test): "Which small numbers divide {n} evenly? Try 2, 3 and 5."
- Picture cues: "Try dividing by 2, 3, 5 and 7." / "Try dividing by 2, then 3, then 5." / "Split each number that is not prime." / "Start with {n} ÷ {p}." / "Try dividing {c} by 3 and by 7." / caption "Your start".
- Many factors, smallest-prime step:
  - prompt: "What is the smallest prime that divides {n} evenly?"
  - hint: "Try 2, then 3, then 5, then 7."
  - explain: "{n} ÷ {p} = {q}, with no remainder.[ 2 does not divide {n} evenly[, and neither does 3].]"
  - wrong: "1 is not prime. Try 2, then 3." / "{n} divides itself, but look for a smaller prime." / "{v} divides {n} evenly, but is there a smaller prime that does?" / "{v} divides {n} evenly, but {v} is not prime." / "{n} ÷ {v} leaves a remainder. Try another prime."
- Is it prime:
  - story: "Look at a, b, c. Only one of them is [not] prime."
  - prompt: "Which number is NOT prime?"
  - explain: "{p1} and {p2} have only the factors 1 and themselves. {c} = {pair}."
  - pair step: "Show that {c} is not prime. Type a factor pair of {c}. Don't use 1." Explain: "{c} = {pair}, so {c} has factors other than 1 and {c}."
  - 27 only: "Now write 27 as a product of prime factors."
- Different trees wrap-up: "…The start can change. The primes don't." Button: "− Remove a factor".
- Test, same end (form B):
  - prompt: "Mia starts a factor tree for {n} with {p1}. Her tree ends with {primes}. Leo starts with {p2}. What does Leo's tree end with?"
  - hint: "Finish Leo's tree in your head, or on paper."
- Test, Kim's answer:
  - hint: "Check each factor. Is it prime? Do they multiply to the number?"
  - choices: "Nothing is wrong." / "The primes are in the wrong order."
  - explain: "Every factor is prime, and {claim} = {n}. The order doesn't matter, so nothing is wrong."

U5 `Patterns.tsx` / `PatternsTest.tsx` / `lib/patternSteps.ts`
- Laps: "Mia and Leo start with 0 laps. Each day, Mia runs 2 laps and Leo runs 4 laps."
- "Pattern B is the same as Pattern A."
- Explore: "…Putting the point there is called **plotting** it."
- Goal: "Make two patterns from two rules, compare the matching terms, and plot them as ordered pairs on a grid."
- Title "Ordered pairs on a grid"; label "Plot the pairs".
- "Write the ordered pair for the {nth} terms. Write it like this: (A term, B term)."
- "Another pattern is {a, b, c, d}. What number does its rule add each time?"
- Why step:
  - prompt: "Why is every Pattern B term {k} times the matching Pattern A term?"
  - choices: "B starts at {k} × A's start and adds {k} times as much each time." / "B adds more each time." / "The first column shows it."
  - hint: "Compare the two rules: where each pattern starts, and what each one adds."
  - explain: "Pattern B starts at {s} = {k} × {a} and adds {d} = {k} × {e} each time. So every B term stays {k} times the A term."
- Predict:
  - hint: "Use the rule that links B to A. You don't need to list all the terms."
  - wrong: "You multiplied. Each B term is {c} MORE than its A term." / "You added {k}. Each B term is {k} TIMES its A term."
- CFU Q4: "The first column looks like 'times 2.' Check every column before you decide."
- Test, times trap:
  - choices: "Yes. Every column works, not just the first one." / "No. Each B term is {n} more." / "Yes. Both patterns add the same number."
  - explain (real pair): "{a} × 2 = {b}, … Every column works, so each B term is 2 times the A term."
- Shell hero: "…Break numbers into primes, and plot two patterns on a grid."
- Shared: "You plotted 1 point. Plot all 4."

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | **Pass** (run again after the last edit) |
| `npx eslint` on every touched file | **Pass**: 0 errors. 23 warnings, all the existing `react-refresh/only-export-components` pattern. |
| `npx vite build` | **Pass**. Only the existing warnings (historicalProgressService dynamic import, chunk size). No "does not provide an export". |
| Test/unit import check; `useRef<…>()` with no initial value | **Pass**: only the allowed unit → Test imports; no bare `useRef`. |
| Brute force (scratch esbuild bundle; 3000 problems per Practice type and per targeted bucket, 1500 draws of each unit Test and the Module Test) | **Pass, 0 failures.** Details below. |
| `english-check.cjs --grade 5` on changed files | **Pass**: 322 strings, 0 over the limit. 9 flags. The only new one is "Which number is NOT prime?" (negative question), which C1-08 asked for. The others were there before ("in all", true/false, relative clause). |
| Browser: Playwright, harness page, iPad portrait 820×1180, touch on | **Pass.** Details below. One 404 resource error showed up while navigating. It doesn't happen on page load and isn't from a lab module (most likely the harness page's favicon). |

Brute force:
- Every right answer passes the grader.
- No duplicate choices, undefined, NaN, slash fractions, "1 points/factors", "outward", "go into" or "ringed".
- Every required bucket is reached.
- No factors step's own tree ever shows circled primes, or its full factorization, before it is answered (with no help and after 1 wrong try).
- Unit 2 Practice pictures have no outlines without help.
- C1-01: the "both + or both ×" rule now predicts 72% of "does it change?" answers (was 100%). Yes/No split 50/50.
- C1-02: the commutative flip is accepted every time (5000 draws). The regrouped build is rejected with the parentheses message every time. The reversed "subtract b from a" gets its named message.
- C1-11: 3000 of 3000 first-part questions have more than one choice with marks.
- C1-22: plot grids are always ≤ 12 × 12.
- C1-19 splits: about 50/50 for all three questions (see the table).
- Other right-answer splits:
  - *Which is larger?* about ⅓ each.
  - Placement step: about 50/50 left/right.
  - *Outside marks*: parentheses 49%, brackets 25%, braces 25%. "Which first?" is always parentheses; it is half the draws.
  - *Is it prime?*: half "prime", half "NOT prime".
- Sentences were printed and read for every new template (build prompts for all 6 word templates, placement, sometimes, Is it prime/NOT, Many factors both kinds, Two rules with the why step, stories with spot labels).

Browser:
- U1:
  - Explore shows the expression definition.
  - Placement step: 3 choices; a wrong pick gives feedback.
- U2:
  - Two layers: 0 outlines before help, 2 after a wrong pick.
  - Distractors include "[6 × (15 − 7)]".
  - Outside marks shows names only.
- U3:
  - Explore shows the ÷ split bars, the compare stepper and the bigger-group bars.
  - Builder Check is off until every part is filled.
  - A regrouped build gets "The numbers and signs are right. Put the parentheses…".
  - The commutative build "3 × (24 − 5)" for "Subtract 5 from 24, then multiply by 3" is accepted. The value step follows, and the problem finishes.
  - A wrong "which is larger" pick brings in the bars.
  - Test Q2 renders the builder.
  - Dark-mode builder is readable.
- U4:
  - Explore 29: "29 ÷ 2, 29 ÷ 3 and 29 ÷ 5 all leave a remainder, so 29 is prime."
  - Short (15): just "15" with 0 circles; after a wrong try the text cue appears and there are still 0 circles.
  - Many factors (44): step 2 shows the student's 22 × 2 with 0 circles.
  - The "NOT prime" variant renders.
- U5:
  - Laps text is right.
  - Title is "Ordered pairs on a grid".
  - Plot SVG is 520 px wide.
  - "You plotted 1 point. Plot all 4."
  - The why step renders with shuffled choices.
- Not re-run this round (no change to them): the CFU gate and `cfuJustPassed` latch, the multi-box Check rule on CFU blanks, and the Enter focus check. They are unchanged since round 0.

Screenshots (all looked at), in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\4a0a5ada-0427-4375-a535-7a7815b05751\scratchpad\pw\shots\`:
- U1: `u1-explore-expression.png`, `u1-place-step.png`
- U2: `u2-two-layers-start.png`, `u2-two-layers-help.png`, `u2-outside-marks.png`
- U3: `u3-explore-copies.png`, `u3-explore-divide.png`, `u3-build-empty.png`, `u3-build-wrong.png`, `u3-build-done.png`, `u3-larger-bars.png`, `u3-test-build.png`
- U4: `u4-explore.png`, `u4-short-start.png`, `u4-short-wrong.png`, `u4-many-own-pair.png`, `u4-is-prime.png`
- U5: `u5-plot-step.png`, `u5-why-times.png`
- Dark mode: `dark-build.png`

The harness page, its HTML file, the dev server and the scratch scripts were removed or stopped.

## 6. Noticed, not fixed

- U5 CFU Q3's plot is fixed at yMax 20 (points up to (9, 18)), so the 12 cap doesn't apply to it. Its rows are about 22 px apart at 520 px wide.
- The builder's 4 sign buttons per slot push the 3rd number box onto a second line in Practice at iPad portrait. It works, but a more compact sign picker could keep it on one line.
- A Test build question can be skipped blank with "Next question" (graded wrong), the same as every other Test step kind.
- The Module Test still uses the words→expression **pick** (subTimes). Only the Unit 3 Test has a build item.
- Unit 3 Test Q4 (expression → words) always uses the addDivide template. This was already so before this round.
- *Outside marks* "Which marks do you work out first?" always has "parentheses" as its answer. Across both question forms the right button varies (49/25/25), but within that form it is fixed.
- C1-18's trap "B adds more each time." is literally true for a times pair; it is just not the reason. The English and curriculum checkers may want to look at its wording.
- *Parentheses first* is now 4 steps (the builder rule suggests 2–3 per problem).
- The "bigger group" bars are a 1.2× schematic, not true to scale. The real sums differ by less than 1%.
- Proposed rule changes from the merged list (Stage 6) were not applied. That is not this agent's job.
