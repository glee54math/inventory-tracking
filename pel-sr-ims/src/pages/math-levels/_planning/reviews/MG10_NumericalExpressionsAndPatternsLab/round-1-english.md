# MG10 Expressions & Patterns: English review, round 1

- **Lab:** MG10 `NumericalExpressionsAndPatternsLab` ("Expressions & Patterns")
- **Round:** 1 (full review)
- **Date:** 2026-11-14
- **Grade assessed:** 5th (plan says Grade 5; 5.OA.1, 5.OA.2, 5.OA.2.1 CA, 5.OA.3). Text the student reads alone was also checked against the 4th-grade limits (18 words a sentence, 1–2 new words a screen).
- **Read-aloud:** none. MG10 follows the MG6+ convention (no TtsProvider), so every sentence has to work on the page. There is no voice to check.
- **Method:** I ran `english-check.cjs --grade 5` (273 strings, 0 over the length limit, 7 flags, all of them fine for grade 5). I read every unit, CFU, Practice type, Test and the Module Test in the order a student meets them. I ran the generators with esbuild to print real sentences for every story template × scene × name, every words↔expression template, the size, larger and change steps, the judge step, the relation and predict steps, and the plot and factor messages.

## 1. Verdict

**The English is in good shape, and it needs a short round of fixes, not a rewrite.** Sentences are short (none over the limit, median 5–10 words), the generated stories are grammatical for every scene and name, and one instruction ("Find the value of …") is used throughout. The biggest problem is that **"expression," the lab's main new word, is used from the first Unit 1 screen but not defined until Unit 3.** Second, a Unit 2 explanation that every student sees ("The braces hold everything else. You work them out last.") is untrue for every expression the generator makes, and it contradicts the inside-out rule the unit teaches.

## 2. Scorecard

| Part | Length (% over) | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / home | Strong (0%) | Strong | Strong | n/a | n/a (not read-aloud) | Strong |
| U1 Why We Need Parentheses | Strong (0%) | Strong | **Weak** ("expression" untaught) | Strong | n/a | OK |
| U2 Brackets and Braces | Strong (0%) | OK (passives, "the brackets equal") | OK (outfit / coupon / shipping, "ringed") | OK | n/a | OK |
| U3 Reading an Expression | Strong (0%) | Strong | OK (larger / more / as many: three words for one idea) | Strong | n/a | OK |
| U4 Prime Factors | Strong (0%) | Strong | OK ("go into") | n/a | n/a | OK |
| U5 Two Rules, Two Patterns | Strong (0%) | OK ("1 points," "Use how B compares") | OK ("plot" not defined; grid / graph) | OK (laps story doesn't match the table) | n/a | OK |
| Module Test | Strong (0%) | Strong | OK (inherits U1–U5) | Strong | n/a | Strong |

## 3. All findings

### Lab-wide / Unit 1

**E1-01 · Major · "expression" is used two units before it is taught**
- **Where:** `units/WhyParentheses.tsx:168` (U1 Explore: "**Parentheses** ( ) group part of an expression."), `:36–41` (U1 CFU Q1: "The expression is ___", blank label "Expression for the story"), `:240` (Practice: "Which expression matches the story?"), `WhyParenthesesTest.tsx:22, :99`. Unit 2 (`NestedGroups.tsx:78, :82`, "the whole expression") uses it too. The only definition is in U3 Explore, `ReadingExpressions.tsx:168`: "An **expression** is a math phrase made of numbers and signs…"
- **Breaks:** grade-5.md → Math words ("expression" is *new in 5th*: "teach it with a picture before a hint uses it"); README idea 5 ("A math word is taught, not assumed"); checklist §3 "a word used before the unit teaches it."
- **Rewrite:** Move the definition to the first place the word appears, U1 Explore, just before "Move the parentheses":
  > An **expression** is a math phrase made of numbers and signs, like (2 + 1) × 3. It has no = sign.

  Add a short version to the U1 Key Idea: "An expression, like (4 + 6) × 3, is numbers and signs that show a calculation." U3 can keep its sentence as a reminder.

**E1-02 · Minor · Practice hint uses "in every plate"**
- **Where:** `units/WhyParentheses.tsx:241` and `WhyParenthesesTest.tsx:23`. The hint is built with a fixed "in," but the plates scene uses "on" (`stories.ts:31` has `prep: "on"`). The output reads "Do the strawberries go in every plate, or just once?"
- **Breaks:** builder rule "Generated sentences must be grammatical for every value"; checklist §2.
- **Rewrite:** use the scene's preposition: `` `Do the ${item2} go ${scene.prep} every ${scene.group}, or just once?` `` → "Do the strawberries go on every plate, or just once?"

**E1-03 · Polish · The story question is asked twice, and the first time it isn't what the step asks**
- **Where:** `WhyParentheses.tsx:223–250`. The story ends with "How many apples and oranges are there in all?", but step 1 asks "Which expression matches the story?" Step 2 then repeats the "How many…" question.
- **Breaks:** checklist §4 ("Is the question last and asking for one thing?").
- **Rewrite:** Story = `{s.text}` only. Step 1 stays "Which expression matches the story?" Step 2 keeps its prompt, which already includes `s.question`.

**E1-04 · Polish · The picture label says "extra," but the story names a place**
- **Where:** `WhyParentheses.tsx:218` (`extraLabel="extra"`). The story says "on the teacher's desk," "in a bowl" or "in the prize box," and the U1 Explore picture says "table."
- **Breaks:** checklist §3 "Text vs. picture."
- **Rewrite:** Add a short `spotLabel` to each scene ("table," "desk," "bowl," "prize box") and pass it as `extraLabel`.

### Unit 2: Brackets and Braces

**E1-05 · Major · "The braces hold everything else. You work them out last." is untrue for every generated expression**
- **Where:** `units/NestedGroups.tsx:317` (Practice "Outside marks," explanation), `:324` (wrap-up: "The outside marks are worked out last."), `NestedGroupsTest.tsx:263` (Test and Module Test explanation). `oneLayer`, `twoLayer` and `threeLayer` (`lib/expr.ts:276–290`) always add one step outside every mark, e.g. {3 × [(4 + 2) − 1]} **+ 5**. So the marks never "hold everything," and they are never worked out last. The unit's own CFU Q3 feedback (`NestedGroups.tsx:115`) correctly says "…then the braces, then the last step."
- **Breaks:** checklist §3 "Text vs. picture" (the sentence doesn't match the expression on screen); traps §1 note. The student reads two different rules for the last step in one unit.
- **Rewrite:**
  - explanation: `` `The ${name} hold all the other groups, so they are on the outside. After them comes the step outside every mark.` `` For the one-layer case, where there are no other groups: "The parentheses are the only marks, so they are on the outside."
  - wrap-up: `{workText(e)}. Inside first. The outside marks come after the inner groups.`
  - Test explanation: the same as the Practice explanation.

**E1-06 · Minor · The shopping story assumes "coupon," "shipping" and an undefined "outfit"**
- **Where:** `NestedGroups.tsx:194–195` ("She has a coupon that takes some dollars off each outfit. Then she pays for shipping one time."), `:177` ("One outfit costs …"). "Outfit" is never linked to "a shirt and a hat," and "takes … off" is a phrasal verb.
- **Breaks:** traps §7 (background knowledge: coupons, shipping); english-learners.md → phrasal verbs.
- **Rewrite:** "Ana buys a shirt and a hat for each friend. A shirt and a hat together are one **outfit**. A coupon makes each outfit a few dollars cheaper. Then she pays one shipping cost to mail them." Line 177 becomes `` `Next the brackets: subtract the ${cpn}-dollar coupon. One outfit costs …` ``.

**E1-07 · Minor · Mark names stand in for the groups' values, and passive voice in the feedback**
- **Where:** `NestedGroups.tsx:82` ("The parentheses: 5 + 3 = __. The brackets equal __."), blank labels `:76–77` ("Value of the parentheses / brackets"); `:340` ("Two groups are joined by a sign." is passive); `:356` ("The marks decide what is grouped.").
- **Breaks:** grade-5.md → Grammar (keep passive rare); english-learners.md (ELs read "brackets" literally as the marks, and marks don't "equal" a number).
- **Rewrite:** "The part in parentheses: 5 + 3 = __. The part in brackets equals __. The whole expression equals __." "A sign joins two groups. Work out each group first." "The marks show which numbers go together."

**E1-08 · Polish · "Work out the ringed part"**
- **Where:** `NestedGroups.tsx:219` (Explore button).
- **Breaks:** english-learners.md (a rare word where an everyday one exists).
- **Rewrite:** "Work out the circled part" (or "the part with the outline" if the ring isn't round).

### Units 1–3: instruction words

**E1-09 · Minor · Several phrasings for "compute" and "inside first"**
- **Where:** "work out" (the phrasal verb is used everywhere, e.g. `steps.ts:356`, `WhyParentheses.tsx:168`), "Then work outward" (`steps.ts:356`, `NestedGroups.tsx:85, :279`), "Work from the inside out" (`NestedGroups.tsx:190, :373`), "Inside first, then outward." "Work out" and "work outward" sit side by side in one hint and mean different things.
- **Breaks:** english-learners.md ("Several words for one idea," phrasal verbs); grade-5.md → Watch for ("Pick one instruction … and keep it").
- **Rewrite:** Keep "work out" (it's taught by use from U1 on) and use one phrase for direction: "**inside out**." `valueStep` hint: `` `Work out ${first} first. Then keep working from the inside out.` `` wrap-up: "Inside first, then out." Never "outward."

### Unit 3: Reading an Expression

**E1-10 · Minor · "larger," "more than" and "as many" are used for the same comparison in one question**
- **Where:** `lib/reading.ts:305`. The prompt asks "which is **larger**?" The explanations at `:294` and `:299` answer with "6 copies is **more than** 4 copies," "2,586 + 746 is **more than** …". At `:263–265`, the prompt says "how many times as **large**" and the explanation says "3 times as **many** as 2 copies."
- **Breaks:** english-learners.md ("Several words for one idea in the same unit").
- **Rewrite:** "Both use the same group. 6 copies is larger than 4 copies." "… 2,586 + 746 is larger than 2,586 + 664, because 746 is larger than 664." "9 copies of the group is 3 times as large as 3 copies, because 3 × 3 = 9."

**E1-11 · Minor · The Explore story leaves out a step and has an unclear "it"**
- **Where:** `ReadingExpressions.tsx:171`: "Grandma gives you 12 dollars and Grandpa gives you 15 dollars. You share it equally with your 2 cousins, so 3 kids split it." "It" refers to a total that is never named, and the student has to work out that 2 cousins plus you makes 3.
- **Breaks:** traps §6.6 (a pronoun that points back to an unnamed thing); grade-5.md → Word problems.
- **Rewrite:** "Grandma gives you 12 dollars. Grandpa gives you 15 dollars. You and your 2 cousins share all the money equally. That's 3 kids. The expression is (12 + 15) ÷ 3: add first, then divide."

**E1-12 · Minor · CFU Q4 says "Move the parentheses," but nothing can be moved**
- **Where:** `ReadingExpressions.tsx:101`: "Move the parentheses. Find each value. Then finish the sentence." Both expressions are already printed, so the student only types.
- **Breaks:** builder rule "Tell the student what to DO"; checklist §3 "Text vs. picture."
- **Rewrite:** "Here the parentheses are in two different places. Find each value. Then finish the sentence."

**E1-13 · Polish · Parenthetical asides and vague "that"**
- **Where:** `ReadingExpressions.tsx:116` and `ReadingExpressionsTest.tsx:79` ("With only adding (or only multiplying), …"); `ReadingExpressions.tsx:222` ("Its value is 9, but you can read it without that.").
- **Rewrite:** "With only adding, or only multiplying, moving the parentheses never matters." "Its value is 9. But you can read what it says without finding the value."

### Unit 4: Prime Factors

**E1-14 · Minor · The phrasal verb "go into" carries the divisibility question**
- **Where:** `PrimeFactors.tsx:199` ("Does any number besides 1 and 29 go into 29?"), `:242` and `PrimeFactorsTest.tsx:63` ("Which small numbers go into 40?"). It is never taught. The same unit says "Try dividing … by 3 and by 7" elsewhere (`:273, :283`).
- **Breaks:** english-learners.md → "What hurts: phrasal verbs" (this file names *go into* as its example).
- **Rewrite:** "Can you divide 29 evenly by any number other than 1 and 29?" "Which small numbers divide 40 evenly? Try 2, 3 and 5."

**E1-15 · Polish · Explore and CFU wording**
- **Where:** `PrimeFactors.tsx:137` ("Writing a number as a product of primes is its prime factorization." has a gerund subject and "its" with no clear owner); `:35` ("Use + Add a factor for more boxes." reads "use plus add"); `shared/components/FactorBoxes.tsx:62, :65` ("+ Add a factor" / "− Remove a box" give two names for the same box); `:334` (a semicolon in the wrap-up).
- **Rewrite:** "When you write a number as primes multiplied together, that is its **prime factorization**." "Tap **+ Add a factor** to get another box." Buttons: "+ Add a box" / "− Remove a box" (or "Add a factor" / "Remove a factor"). "The start can change. The primes don't."

### Unit 5: Two Rules, Two Patterns

**E1-16 · Minor · The "laps" story doesn't match its table**
- **Where:** `Patterns.tsx:149`: "Each day, Mia runs 2 laps and Leo runs 4 laps. They count their laps from day 1." The table's 1st term is 0, not 2 and 4 laps on day 1.
- **Breaks:** checklist §3 "Text vs. picture."
- **Rewrite:** "Mia and Leo start with 0 laps. Each day, Mia runs 2 laps and Leo runs 4 laps."

**E1-17 · Minor · "Plot" is never defined, and grid and graph are used for the same thing**
- **Where:** "Plot" first appears at `Patterns.tsx:102` (CFU Q3 "Plot all four points. Tap a grid point to plot it."), then `:350` and `patternSteps.ts:132`. Explore (`Patterns.tsx:217`) says "a point on a **grid**," the Practice title says "Ordered pairs on a **graph**," and the type label says "**Graph** the pairs."
- **Breaks:** grade-5.md → Watch for ("**Plot** (a point) vs. a story's plot"); english-learners.md (one word per idea).
- **Rewrite:** Explore `:217`: "An **ordered pair** (A term, B term) is a point on a grid. Go across to the first number. Then go up to the second number. Putting the point there is called **plotting** it." Choose "grid" for the picture and "plot" for the action; rename the type label "Plot the pairs" and the title "Ordered pairs on a grid."

**E1-18 · Minor · Generated message says "You plotted 1 points"**
- **Where:** `shared/lib/factors.ts:105`, `` `You plotted ${pts.length} points. Plot all ${answer.length}.` `` I confirmed the output: "You plotted 1 points. Plot all 4."
- **Breaks:** builder rule (singular/plural in generated sentences).
- **Rewrite:** `` `You plotted ${n} point${n === 1 ? "" : "s"}. Plot all ${answer.length}.` `` Also check line 106 the same way: "You plotted 5 points, but there are only 4 ordered pairs" is fine, because the answer always has 4 or more points.

**E1-19 · Polish · Awkward hint and feedback grammar in the pattern steps**
- **Where:** `patternSteps.ts:115` ("Use how B compares with A."); `:120, :122` ("Pattern B is 3 MORE than Pattern A," which compares patterns, not terms); `Patterns.tsx:288` ("Now go backward. Another pattern goes 5, 9, 13, 17." "Goes" is casual, and this "backward" means something different from U4's "go backward"); `:370` ("Use ( , )."); `:133` ("The first column fooled lots of people.").
- **Rewrite:** "Use the rule that links B to A. You don't need to list all the terms." "You multiplied. Each B term is 3 MORE than its A term." "Another pattern is 5, 9, 13, 17. What number does its rule add each time?" "Write it like this: (A term, B term)." "The first column looks like 'times 2.' Check every column before you decide."

## 4. What's working well

- **Short, plain sentences everywhere:** 0 of 273 strings are over the grade-5 limit, and almost all also meet the 4th-grade limit, which suits students who read below grade level.
- **One instruction for evaluating:** "Find the value of …" is used everywhere, as grade-5.md asks.
- **Story generator:** it is grammatical across all 4 scenes × 6 names × 2 kinds × 2 templates. Pronouns match the names, every noun is plural (counts start at 2), and the question is short and comes last.
- **Words ↔ expressions templates:** they follow the grade-5 model exactly ("Add 8 and 7, then multiply by 2"), with "then" marking the order. The word-order trap ("Subtract 8 from 28") appears only in Unit 3, where it is the skill being taught.
- **Wrong-answer messages:** they name the mistake ("14 is what you get going left to right"; "That's the 7th term. The start number is the 1st term."; "1 is not a prime number, so leave it out") without stating the answer.
- **New words:** the three bracket names get a symbol key before any question uses them. "Prime," "term," "rule" and "ordered pair" are each bolded and defined in one sentence on the screen where they're first used. "The matching Pattern A term" is used the same way every time.
- No idioms in praise ("Yes." / "Right." / "Correct."), and the names are easy to decode.

## 5. Out of my lane (learning, for the curriculum checker)

- U3 Test "Fill in the blanks" (`ReadingExpressionsTest.tsx:77–86`): the only example shown right after the "always / sometimes / never" blank is one where the value doesn't change, which may push students toward "never." The CFU version shows both cases.
- U2 "Outside marks" with `oneLayer()`: the expression has only parentheses, so "Which marks are on the outside?" can be answered by spotting the only marks present.

## 6. Guideline gaps

- **grade-5.md → Math words → New in 5th:** add "*term*, *rule*, *matching (corresponding) terms* (5.OA.3); *prime factorization*, *factor tree* (5.OA.2.1, CA)." These are new this year and aren't listed anywhere, so a reviewer can't tell whether they need teaching.
- **english-learners.md → What hurts:** add *work out* (meaning "calculate"), *take off* (a price), *tell apart* and *go into* (divide) to the phrasal-verb examples, with the note: "*Work out* is fine once a lab uses it as its one word for 'calculate'; don't also use *work outward* or *work out* meaning 'succeed.'"
- **checklist.md §2 / english-check.cjs:** the script can't see plural slips after a template number ("You plotted ${n} points"). Add a flag for `${…} <plural noun>` with no `=== 1` check nearby, labeled "possible '1 points'." The same goes for `${…} in every ${…}`-style fixed prepositions in front of pooled nouns.

## 7. What I could not check

- Real students' reading, and how the CFU screen with four questions at once feels on an iPad.
- Rendered layout: whether the "( , )" hint and the bracket key wrap in a readable way at iPad portrait width.
- No voice to check: the lab is not read-aloud.
- I ran the generators (stories, words templates, size, larger, change, judge, relation, predict, plot and factor messages) but not the full Explore UI. I read the Explore text from source.
