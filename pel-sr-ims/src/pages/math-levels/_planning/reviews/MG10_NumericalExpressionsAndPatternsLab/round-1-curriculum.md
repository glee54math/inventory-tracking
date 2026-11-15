# MG10 Expressions & Patterns: curriculum review, round 1

- **Lab:** MG10 `NumericalExpressionsAndPatternsLab` ("Expressions & Patterns"), 5 units + Module Test
- **Round:** 1 (full review)
- **Date:** 2026-11-14
- **Grade band assessed:** 4th and up (Grade 5, first-time learners, no read-aloud, per the plan and the MG6+ convention)
- **Assumptions:** The standards reference shortens the standards, so for wording-level points I used the official CA CCSS text: 5.OA.2 "**Write** simple expressions that record calculations with numbers…"; 5.OA.3's example ends "…observe that the terms in one sequence are twice the corresponding terms in the other sequence. **Explain informally why this is so.**" The previous lab in this strand is MG8 Factors, Multiples & Patterns (4.OA.4–5). Its words *factor pair*, *rule*, *term* and *start at … add …* are reused here the same way.
- **How I checked:** I read the plan, the builder's rules, the round-0 build report, the shell, all 5 units and Tests, the Module Test, every lab diagram and lib file, and the new shared pieces (`FactorBoxes`, `factors.ts`, the factors/plot step kinds, the CFU blanks). I also ran a 20,000-draw scratch script over the generators. I did **not** run the lab in a browser this round (see section 8).

---

## 1. Verdict

**Ready after fixes.** The lab is well built and the sequence is sound. Two things stop it from being ready for students:
- In Unit 4, the factor-tree picture shows the finished prime factorization after one wrong try. In "Many factors" it shows it with no wrong try at all. A wrong typed try still counts as a clean solve in this grade band, so copying the picture earns a star.
- Unit 3's "does moving the parentheses change the value?" problems only ever use sign pairs where "both + or both × → no change, anything else → change" is true. The hint teaches that rule. It is false for (a + b) − c.

## 2. Top 5 changes

1. **C1-06**: Stop the factor tree from showing the answer while a factors step is being asked: Short after one wrong try, Many factors with no help, Is it prime? after one wrong try.
2. **C1-01**: Add sign pairs that don't change the value, (a + b) − c and (a × b) ÷ c, to Unit 3's move-the-parentheses pool. Replace the sign hint with "find both values".
3. **C1-10**: Turn off Unit 2's always-on colored group outlines in Practice, and show them only as help. The Test never shows them.
4. **C1-03**: Unit 3: make the "how many times as large" typed step require thinking. It now copies the multiplier printed in its own prompt.
5. **C1-02**: Have students **write** an expression themselves at least once (5.OA.2). Right now they only pick from three finished ones. Needs the user's decision.

## 3. Scorecard

| Unit | 1 Standards | 2 Audience | 3 Arc | 4 Unstuck | 5 Pictures | 6 Math/miscon. | 7 Mastery | 8 Device |
|---|---|---|---|---|---|---|---|---|
| 1 Why Parentheses | OK (never places parentheses) | Strong | Strong | OK | OK | Strong | Strong | not run |
| 2 Brackets & Braces | Strong | Strong | OK | OK | **Weak**: outlines in Practice only | Strong | OK | not run |
| 3 Reading Expressions | **Weak**: never writes an expression | OK | **Weak**: size comparisons not shown first | **Weak**: sign-rule hint | OK | **Weak**: shortcut taught | **Weak**: copy-the-multiplier typed steps | not run |
| 4 Prime Factors | Strong | Strong | OK | OK | **Weak**: tree shows answer | Strong | **Weak**: copy-to-clean | not run |
| 5 Patterns | OK ("explain why" missing) | Strong | Strong | OK | OK | OK | OK | small plot grid (unverified) |

---

## 4. All findings

### Unit 3: Reading an Expression Without Solving It

**C1-01 · Major · Layer 6 (misconception), Layer 4**: *Move the parentheses* teaches "mixed signs always change the value."
- **Who it hurts:** The procedure-follower, on *Move the parentheses* (Practice step 3), Test Q8 and Module Test Q15.
- **Evidence:**
  - `lib/expr.ts:231-254`: `moveParens(change)` draws "changes" from {+×, ×+, −−, −+} and "stays the same" only from {++, ××}.
  - `lib/reading.ts:99`: the hint is "Look at the signs. Are they both + or both ×? Or something else?"
  - `ReadingExpressions.tsx:409`: the wrap-up says "With only adding or only multiplying, it never does."
  - Scratch script: across 20,000 draws, "both + or both × means no change, otherwise change" predicted the answer **20,000 / 20,000** times.
  - Explore Part 3 offers only ++, ××, +×, −−.
  - Counterexample the lab never shows: (12 + 5) − 3 = 12 + (5 − 3). Likewise (a × b) ÷ c = a × (b ÷ c) when it divides evenly.
- **Fix:**
  - Add `["+","−"]` (and `["×","÷"]`, drawn so b ÷ c is whole) to the no-change pool in `moveParens`. Optionally add `["÷","×"]` to the change pool.
  - Change the `changeStep` hint to "Find the value both ways. Are they the same?"
  - Change the wrap-up to "Sometimes it changes and sometimes it doesn't. Find both values to check."
  - Add a "+ and −" button to Explore Part 3.
  - The CFU Q4 feedback ("With other signs, it can") is already correct.

**C1-02 · Major · Layer 1**: Students never **write** an expression (5.OA.2's first verb). **Needs the user's decision.**
- **Who it hurts:** Every persona. "Words to expression" (Practice), CFU Q1 and Test Q1/Q2 are all three-way picks. The only typed work is finding a value.
- **Evidence:** `ReadingExpressions.tsx:291-325` (`toExprProblem`: choice, then `valueStep`); `ReadingExpressionsTest.tsx:16-34`.
- **Options:**
  - (a) Add a build-it step to *Words to expression* using the existing `sentence()` blanks: tap where the parentheses go, then type the numbers and tap the signs ("( [ ] [+ − × ÷] [ ] ) [sign] [ ]"). Keep the pick as step 1, or replace it.
  - (b) Accept picking as enough for this lab and note the gap for the user.

  Option (a) also makes the student produce something, which helps with C1-03.

**C1-03 · Major · Layer 7**: The only typed step in many Unit 3 problems copies a number printed in its own prompt.
- **Who it hurts:** The guesser.
- **Evidence:**
  - *How big is it?* (plain variant, 2 of 3 problems, `lib/reading.ts:18-32`) asks "k × (A + B) is how many times as large as A + B?" The answer k is printed in the prompt. Its other step is a three-way pick (`largerStep`).
  - *Expression to words* with an outer × (addTimes, subTimes, addDouble: half the templates, `ReadingExpressions.tsx:349-357`) has the same copy step after a three-way pick.
  - A wrong typed try doesn't break a clean solve in this band (`StepProblem.tsx:439-450`). So a student who copies k and guesses the pick gets a clean solve about 1 time in 3.
  - CFU Q1 and Q2's typed boxes ("2", "3") are copies in the same way. That leaves Q4 as the only CFU question with real typed work. The 40% rule is met on paper but not in spirit.
- **Fix:**
  - Make the times-as-large step compare two multiples of the same group most of the time: the existing `"ratio"` variant, e.g. "12 × (…) is how many times as large as 3 × (…)?". Raise it from 1/3 to at least 1/2.
  - In *Expression to words*, replace the copy step with a ratio question or a `valueStep`.
  - In CFU Q2, ask "6 × (18,932 + 921) is how many times as large as 2 × (18,932 + 921)?" (answer 3, which is not on screen).

**C1-04 · Minor · Layer 3**: Size comparisons in Practice and the Test go beyond what Explore shows.
- **Who it hurts:** The first-timer, on *How big is it?* and Test Q6/Q7.
- **Evidence:**
  - Explore Part 2 only shows k copies against 1 copy (`ReadingExpressions.tsx:227-237`).
  - Practice and the Test also ask:
    - k·j copies against j copies (ratio);
    - the same multiplier with a larger group (`largerStep` "addend" form);
    - "equal" by turning around the order inside the group (`lib/reading.ts:58-78`).
  - None of these is demonstrated first.
- **Fix:** Give Explore Part 2 a second stepper ("Compare with ___ copies") so the bars show 6 copies against 2. Add one line with a picture: "Same × 3, bigger group → bigger."

**C1-05 · Minor · Layer 3**: CFU Q3's "(20 − 4) ÷ 2 is **smaller than** 20 − 4" is never shown in Explore and never comes back.
- **Who it hurts:** The first-timer, at the CFU. A student who learns it at the CFU never practices it.
- **Evidence:** `ReadingExpressions.tsx:81`. No Explore part, Practice bucket or Test question compares a ÷ expression's size.
- **Fix:** Either drop that blank from Q3, or add a "÷" option to Explore Part 2 (half bars) and a ÷ case to `largerStep`.

**C1-24 · Polish · Layer 4**: The `largerStep` hint "Compare the parts. What is the same? What is different?" has no picture to point at.
- **Fix:** After a wrong pick, show `TimesBars` for both expressions.

**C1-25 · Polish · Layer 7**: Test Q9 (`sometimesQuestion`) types the fixed "9" from (2 + 3) + 4. That exact example is printed in CFU Q4 and in the question's own hint.
- **Fix:** Draw a fresh ++ or ×× example.

### Unit 4: Breaking Numbers into Prime Factors

**C1-06 · Major · Layers 5 and 7**: The factor tree shows the finished prime factorization while the student is being asked for it.
- **Who it hurts:** The guesser and the first-timer, on *Short*, *Many factors* and *Is it prime?*.
- **Evidence** (`PrimeFactors.tsx:221, 237, 277`; `factorTree` uses the most even pair, and leaves at the bottom are circled):
  - *Short*: after one wrong try the tree draws 2 levels. For 6, 9, 10, 14, 15, 21, 25, 35, 49 (9 of 11 numbers) those are the circled primes, i.e. the full answer.
  - *Many factors*, step 2: the tree draws 2 levels **with no wrong try**. For 22, 26, 33, 34, 38, 39, 46 (7 of 15) that is the full answer. After one wrong try it draws 3 levels, which is the full answer for 12 of 15.
  - *Is it prime?*, step 3: after one wrong try, the full answer for 9, 21, 33, 39, 49 (5 of 6).
  - In MG6+ labs a wrong typed answer doesn't break a clean solve (`StepProblem.tsx:439-450`). Type anything, read the circled primes, type them back: that is a clean solve and a star.
- **Fix:**
  - While a `factors` step is being asked, draw only the top number (`levels={1}`) until it is done or "Show answer" is used.
  - On a wrong try, draw the first split only when at least one of its two numbers is not prime, with `ringPrimes={false}`. For two-prime numbers, show the text cue "Try dividing by 2, 3, 5 and 7" instead.
  - In *Many factors* step 2, don't redraw the most-even tree. Either keep `levels={1}`, or draw the student's own pair from step 1 without circles.

**C1-07 · Minor · Layer 7**: *Many factors* asks the same thing twice for 7 of its 15 numbers.
- **Who it hurts:** Every persona.
- **Evidence:** `lib/primes.ts:17` (LONG) and `PrimeFactors.tsx:238-249`. For a two-prime number like 2 × 23, step 1's factor pair and step 2's prime factorization are the same two numbers.
- **Fix:** For two-prime numbers, skip the pair step: go straight to the primes, then the backward step. Or replace the pair step with "What is the smallest prime that goes into n?" (typed).

**C1-08 · Minor · Layer 7**: The "Which number is prime?" distractors come from a fixed list of 6 (9, 21, 27, 33, 39, 49), shared by Practice and the Test.
- **Who it hurts:** The procedure-follower. After a few problems they pick "the one that isn't one of those six" without checking.
- **Evidence:** `lib/primes.ts:24`, `PrimeFactorsTest.tsx:33-51`.
- **Fix:** Sometimes flip the question to "Which number is NOT prime?" (one composite among two primes). Or add a typed step: "Type a factor pair of {comp}." Then the right pick must be backed by work.

**C1-09 · Polish · Layer 3**: Explore never shows *how* to check whether a number is prime.
- **Evidence:** `PrimeFactors.tsx:133-184` has a list of primes as chips but no "check by dividing" demo. The method first appears as a Practice hint and placeholder line ("Try dividing by 2, 3, 5 and 7"). MG8 taught it, but a student with a gap from 4th grade meets it cold.
- **Fix:** When the Explore number is prime, add one line: "29 ÷ 2, 29 ÷ 3, 29 ÷ 5 all leave a remainder, so 29 is prime."

### Unit 2: Brackets and Braces

**C1-10 · Major · Layers 5 and 3** ("Test never helps; Practice helps only when asked"): Practice always outlines every group in its color. The Test doesn't.
- **Who it hurts:** The procedure-follower. They find the inside group by its outline in Practice, then meet the bare expression on the Test.
- **Evidence:**
  - `NestedGroups.tsx:252-254`: `picture()` always passes `boxes`, giving dashed colored outlines (`_styles.css:356-369`).
  - `NestedGroupsTest.tsx`: the "Which part first?" questions (Q2, Q10) and the bracket-part question (Q5) have `visual: null`, just the expression as plain text. The value questions show `ExprView` without outlines.
- **Fix:** In Practice, draw `ExprView` without `boxes` by default and turn `boxes` on only when the step is being helped (`pointing(help, i)`). Keep the outlines in Explore, where they teach. Better still, give the Test's first-part questions the same unoutlined `ExprView` picture as Practice.

**C1-11 · Minor · Layer 7**: In "Which part do you work out first?", the right answer is always the only choice written with parentheses.
- **Who it hurts:** The guesser.
- **Evidence:** Scratch script: in 5,000 of 5,000 draws the answer is the only "( … )" choice. The others are "5 × 3"-style pairs or "the part in brackets" (`NestedGroups.tsx:258-261`, `NestedGroupsTest.tsx:59-65`).
- **Fix:** Replace "the part in brackets" with the bracket group written out, e.g. "[(5 + 3) − 2]". Then more than one choice carries marks.

**C1-12 · Minor · Layer 7**: *Outside marks* is often answerable without reading the structure.
- **Who it hurts:** The guesser.
- **Evidence:**
  - `NestedGroups.tsx:305-306`: a third of the draws use a one-layer expression where parentheses are the only marks. The question becomes "which mark do you see?"
  - In every draw, the outside mark is also the first mark from the left.
- **Fix:** Use only two- and three-layer expressions. Randomly ask either "Which marks are on the outside?" or "Which marks do you work out first?" so the answer isn't always the biggest mark.

**C1-13 · Minor · Layer 3**: The names *parentheses / brackets / braces* (CFU Q1, Test Q1, Module Test) are never practiced.
- **Who it hurts:** The first-timer, on Test Q1.
- **Evidence:** The *Outside marks* buttons read "parentheses ( )", "brackets [ ]", "braces { }" (`SYM_LABEL`). The mark is printed next to its name, so the student never has to recall the name.
- **Fix:** In *Outside marks* Practice, use `SYM_NAME` (names only) for the buttons. Keep the colored marks in the picture.

**C1-14 · Polish · Layer 6**: Test Q9 (`whoIsRightQuestion`): in about 14% of draws, going left to right doesn't give a whole number. The wrong value is then just "answer + 1", which matches no mistake.
- **Evidence:** Scratch script: 697 of 5,000 draws.
- **Fix:** Keep drawing until the left-to-right value is a whole number different from the answer.

### Unit 1: Why We Need Parentheses

**C1-15 · Minor · Layer 1**: Students never **place** parentheses themselves (5.OA.1, "use parentheses…").
- **Evidence:** Every Practice and Test item hands over a finished expression. The closest item is Test Q9 ("Which expression has a value of V?").
- **Fix:** Add a step to *Parentheses first* or *Parentheses later*: "Where do the parentheses go so 3 × 4 + 6 = 30?" Offer 3 tap choices ((3 × 4) + 6, 3 × (4 + 6), and no grouping shown as "either way"), then type the value of the other grouping.

**C1-16 · Polish · Layer 3**: Practice always finds the value of a story after the expression is chosen ("Find the value of (2 + 1) × 4"). Test Q10 asks for the story's number straight from the words.
- **Fix:** Fine to keep, but in about half of *Stories* problems, word step 2 as "How many in all?" without printing the expression.

**C1-17 · Polish · Layer 5**: In the *Stories* picture the separate box is labeled "extra", while the story says "on the table" or "in a bowl" (`WhyParentheses.tsx:218`).
- **Fix:** Pass a short place word from the scene ("table", "desk", "bowl", "prize box") as `extraLabel`.

### Unit 5: Two Rules, Two Patterns, One Relationship

**C1-18 · Minor · Layer 1**: 5.OA.3's "Explain informally why this is so" is never asked.
- **Evidence:** Only CFU Q3's praise line touches it. No Practice or Test step asks why B is k times A.
- **Fix:** In *Two rules* ("times" kind only), add a 3-way choice after the relationship: "Why is every B term {k} times the A term?"
  - Right: "B starts at {k} × A's start and adds {k} × as much each time."
  - Trap: "B adds more each time."
  - Trap: "The first column shows it."

  Shuffle the order.

**C1-19 · Minor · Layer 7**: Some Test learning-target questions always have the same button right.
- **Who it hurts:** The guesser.
- **Evidence:**
  - Unit 5 Test Q10 and Module Test (`timesTrapQuestion`): the right choice starts with "No." in 3,000 of 3,000 draws.
  - Unit 4 `sameEndQuestion`: always "Both end with …".
  - Unit 4 `notFinishedQuestion`: always "… is not prime".
- **Fix:**
  - In `timesTrapQuestion`, half the time use a real "times" pair, so "Yes, every column works" is right.
  - In `notFinishedQuestion`, half the time show a correct factorization in a different order, so "Nothing is wrong" is right.

**C1-20 · Minor · Layer 2**: The Explore "Laps" story says "They count their laps from day 1", but the table's 1st term is 0 laps for both (`Patterns.tsx:149`).
- **Fix:** Start A at 2 and B at 4. That is still "2 times", and day 1 is now 2 and 4 laps.

**C1-21 · Polish · Layer 6**: In Explore, if A and B have the same rule, the sentence says "No single rule works for every column here." B equals A, so that is not true.
- **Fix:** Special-case it: "Pattern B is the same as Pattern A."

**C1-22 · Minor · Layer 8 · Unverified**: The plot grids may be too tight for a finger.
- **Evidence:**
  - The Practice and Test plot step is 380 px wide (`StepProblem.tsx:752-764`), so columns are about 15 px apart when the x-axis goes to about 20.
  - About 47% of plot problems reach y ≥ 16 (scratch script).
  - The builder flagged this too.
- **Fix:** Cap plot problems at 12 on both axes (`patternPair(..., 4, 12)`), or make the plot step fill the panel width on iPad.

**C1-23 · Polish · Layer 3**: The Module Test's Unit 5 questions have no "times" relationship, only "more than" and the trap.
- **Fix:** Swap `termQuestion` for `relationQuestion("medium", "times")`.

---

## 5. Persona walkthrough highlights

- **The guesser in Unit 4, *Short*, n = 35.** They type "5 × 5" and get "5 × 5 = 25, not 35". The tree drops to 35 → 5, 7, both circled. They type 5 × 7, then multiply in the backward step. The result is "Solved it! ⭐". Two of those fill the *Short* bucket without ever factoring (C1-06).
- **The procedure-follower in Unit 3, *Move the parentheses*.** The hint says to look for "both + or both ×". They stop finding values and answer from the signs, and every problem agrees. In 6th grade, (15 + 6) − 4 vs. 15 + (6 − 4) breaks the rule they learned (C1-01).
- **The first-timer in Unit 2.** Practice looks friendly: each group is outlined in its own color, and "the inside one" is easy to spot. On the Test, Q2 is a line of plain text with no outlines and no colors, and they have never had to find the inside group without help (C1-10).
- **Students with gaps did fine.**
  - A 4th-grade gap on primes: the Practice hint "Try dividing each number by 3 and by 7" plus the named "1 is not prime" message got them through.
  - A student who works left to right: they get the named "14 is what you get going left to right. Work out (2 + 4) first."
  - A coordinate-plane gap (5.G.1 not yet seen): the switched-point message "Go across to the first number, then up" names the mistake.

## 6. What's working well

- **One model drives every picture and every graded answer.** `lib/expr.ts` produces the worked lines, the ringed next part and the left-to-right value. Practice, the Test and the CFU can't disagree.
- **"Every first step is in grouping symbols."** The lab never relies on "multiply before add" (6.EE). That is a thoughtful 5th-grade boundary.
- **Named mistakes are excellent**: left to right, "10 is not prime", "1 is not prime, so write just 29", switched coordinates, "that's the 7th term", "you multiplied, B is MORE than A".
- **The Unit 1 stories** pair "in every bag" with "on the table" in the same numbers. They are the right concrete hook, and the Unit 1 picture holds back until the expression is chosen.
- **The factor-tree uniqueness work is strong:** Explore's start-pair switcher, CFU Q3 (Mia vs. Leo), the *Different trees* type (a pair that isn't Mia's), and the balanced judge step.
- **The Unit 5 "times 2 in column 1" trap** (B's first term = 2 × A's) is built into Practice (40% of "more" pairs), the CFU and the Test. That is the right misconception to target.
- **The shell has everything the user asked for:**
  - the CFU gates Practice for everyone;
  - the `cfuJustPassed` latch keeps a passed CFU open;
  - the retry debt carries across units;
  - mastery needs 2 clean solves per bucket.
- **CFU typed share is ≥ 3 of 4 in every unit**, though see C1-03 for Unit 3.
- **No slash fractions anywhere.**

## 7. Rule gaps (proposed additions to `math-lab-builder.md`)

1. **Under "The picture matches the question, not the answer":** "In older-grade labs (no `EarlyLearnerProvider`), a wrong typed try doesn't break a clean solve. So the picture a step shows after one wrong try, or before any try, must never contain that step's answer, e.g. a factor tree drawn down to its circled primes. Check every `levels` / `show` prop against the step it is drawn for."
2. **Under "Key Idea must be true for every problem":** "When a step asks whether something always, sometimes or never happens ('does moving the parentheses change the value?'), the problem pool must include a case that breaks the obvious surface rule, e.g. (a + b) − c for 'mixed signs change it'. No hint may teach a surface rule ('look at the signs')."
3. **Under "The Test never helps":** "Diagram scaffolds (outlines, color boxes, rings) that the Test version doesn't show are off by default in Practice and appear only with `pointing(help, i)`."
4. **Under Coverage / Practice:** "When a standard's verb is *write*, *place* or *construct*, at least one Practice step makes the student build it (typed numbers, tapped signs, tapped symbol placement), not only pick from finished choices."
5. **Under "Practice must not be passable without the math":** "A typed step whose answer is printed in its own prompt ('k × (…) is how many times as large as …?') is a copy step, even when it states the standard's example. Pair it with a step that needs the idea (a ratio of two multipliers)."

## 8. What I could not check

- **No browser run this round.** I did not drive the lab in Playwright at iPad size:
  - help rungs and "Show answer" screenshots;
  - number pad and keyboard behavior;
  - the plot grid with a real finger (C1-22 is unverified);
  - dark mode.

  All findings above come from the code and the scratch script. The builder's round-0 browser pass reported the CFU gate, the latch, the named mistakes and the layout as working.
- Real iPad touch feel on the 380 px plot grid and the factor boxes' "+ Add a factor" flow.
- How real 5th graders handle the reading load of the Unit 3 word choices. Sentence-level English belongs to the English checker and was not reviewed here.
- I checked the official CA CCSS wording for 5.OA.2 and 5.OA.3 from the published standard text, not from a file in the repo.

---

**Counts:** Blocker 0 · Major 5 · Minor 12 · Polish 8

| Severity | IDs |
|---|---|
| Blocker | none |
| Major (5) | C1-01, C1-02, C1-03, C1-06, C1-10 |
| Minor (12) | C1-04, C1-05, C1-07, C1-08, C1-11, C1-12, C1-13, C1-15, C1-18, C1-19, C1-20, C1-22 |
| Polish (8) | C1-09, C1-14, C1-16, C1-17, C1-21, C1-23, C1-24, C1-25 |
