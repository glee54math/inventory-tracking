# MG10 Adding & Subtracting Fractions: English review, round 1

- **Lab:** `MG10_AddingAndSubtractingFractionsLab` (shell + `AddingAndSubtractingFractionsLab/`)
- **Round:** 1 (full review)
- **Date:** 2026-11-06
- **Grade assessed:** 5th (5.NF.1–2), using `grade-5.md`. Text a student reads alone was also held to `grade-4.md` (18-word sentences), because this lab has **no read-aloud**.
- **Assumptions:** The plan's "Approved changes (user, 2026-11-06)" override the rest of the plan. "LCD" and "borrow" are taught by name on purpose, so they are not flagged as jargon. The voice-capture step was skipped (no TTS). I checked what a screen reader would read where it matters.

---

## 1. Verdict

**Close. Fix one Blocker and four Majors.** Sentences are short (0% of task and feedback text is over the grade-4 limit), stories are clean, and new words are taught with pictures. The biggest problem is Unit 2's first CFU question. It says "The numbers in both lists are __ and __", but the lists on screen show **three** shared numbers (12, 24 and 36). A student who reads the picture correctly can be marked wrong. The other main problem: the practice option **"Mixed"** (a mix of problem types) sits beside problem types called **"Mixed numbers"**, and the star rule says "Only Mixed problems count."

## 2. Scorecard

Length = share of strings over the grade-4 limit (18 words), from `english-check.cjs --grade 4`.

| Part | Length | Grammar | Vocabulary | Word problems | Voice (screen reader) | Screen load |
|---|---|---|---|---|---|---|
| Shell / Home | Weak (1 of 3 screen strings over: the stars rule, 26 words) | OK | Weak ("Mixed" collision, "reps") | n/a | OK | OK |
| Unit 1 Why Not Across | Strong (0%) | Strong | OK (tops/numerator not linked) | n/a | OK | Strong |
| Unit 2 Common Denominators | Strong (0%) | OK (pronoun in CFU Q3) | OK ("go into" never defined) | n/a | OK | **Weak** (CFU Q1 sentence doesn't match the picture) |
| Unit 3 Add/Subtract | Strong (0%) | Strong | OK | n/a | OK | Strong |
| Unit 4 Mixed Numbers | Strong (0%) | OK | **Weak** (carry / pull out / take out / make a new whole; "top fraction") | n/a | OK | OK |
| Unit 5 Word Problems | Strong (0%; one flag is a script artifact) | Strong | Strong (benchmark taught well) | Strong | OK | OK |
| Module Test | Strong (0%) | Strong | Inherits E1-03, E1-04, E1-05 | Strong | OK | Strong |

---

## 3. All findings

### Unit 2: Finding a Common Denominator

**E1-01 · Blocker · The CFU Q1 sentence says there are two common numbers, but the picture shows three**
- **Where:** `units/CommonDenominators.tsx:30-39` (CFU Q1); the cause is in `diagrams/MultiplesList.tsx:26-31`.
- **Text:** "Here are the multiples of 4 and of 6." Then: "The numbers in both lists are [ ] and [ ]. The LCD of 4 and 6 is [ ]." Screen-reader labels: "Smaller number in both lists", "Bigger number in both lists".
- **What the student sees:** `count={6}` lists 6 multiples of 6 (up to 36), and the 4-row runs to the same top value. So the rows are 4: 4, 8, …, 36 and 6: 6, …, 36. **12, 24 and 36 are all in both lists.** The sentence "The numbers in both lists are __ and __" is false. A student (or screen-reader user) who types 36 as the "bigger number in both lists" is marked wrong, even though they read the picture correctly.
- **Breaks:** checklist §3, "Giveaways / untaught word the answer depends on". Blocker definition: the wording makes a correct-math student get it wrong.
- **Rewrite** (pick one):
  - Keep the picture and change the words: "The two smallest numbers in both lists are [12] and [24]. The LCD of 4 and 6 is [12]." Labels: "Smallest number in both lists", "Next number in both lists".
  - Or keep the words and use `count={5}`, so the lists stop at 30 and only 12 and 24 are shared. Check the picture after the change.

**E1-03 · Major · A hint and a feedback line describe the wrong procedure**
- **Where:**
  - `units/CommonDenominatorsTest.tsx:127`: Test Q7/Q8 hint, also used in Module Test Q9.
  - `units/AddSubtractUnlike.tsx:45`: Unit 3 CFU Q1 wrong-answer message.
- **Text:** "Multiply each top by the same number as its bottom."
- **Problem:** The plain reading is "multiply the top by the bottom" (3/4 → 3 × 4), which is wrong. The phrase means "by the same number you multiplied its bottom by", but the words don't say that. A student who reads the hint literally gets a wrong rewrite from the help itself.
- **Breaks:** traps §6 (long noun phrase hides the meaning); grade-4.md → Watch for (say each fact in its own sentence).
- **Rewrite:**
  - Test hint: "What do you multiply each bottom by to get {L}? Multiply its top by the same number."
  - CFU Q1 bad: "Not quite. The LCD of 3 and 4 is 12. 3 × 4 = 12, so multiply the top of 2/3 by 4. 4 × 3 = 12, so multiply the top of 1/4 by 3. Then add the new tops."

### Shell (all units)

**E1-02 · Major · "Mixed" (a mix of problem types) collides with "Mixed numbers"**
- **Where:**
  - `MG10_AddingAndSubtractingFractionsLab.tsx:284`: the `Segmented` option `label: "Mixed"`.
  - `:110`: "…Only Mixed problems count."
  - `:293`: "…only **Mixed** problems count toward your mastery stars."
  - `units/CommonDenominators.tsx:265` and `units/WordProblems.tsx:451`: problem types labeled "Mixed numbers".
  - Unit 4's title is "Adding and Subtracting Mixed Numbers".
- **Problem:** In Units 2 and 5 the row reads **Mixed | … | Mixed numbers**. In this lab, "mixed" is a math word (mixed number). A student told "only Mixed problems count" can reasonably pick "Mixed numbers" and then wonder why no stars fill in. In Unit 4, every problem is a mixed-number problem.
- **Breaks:** traps §1 (an everyday/UI word next to its math meaning in the same lab); english-learners.md → one word per idea.
- **Rewrite:** Rename the option to **"All types"**, in this lab's shell at least.
  - `:110`: "Only All types problems count."
  - `:293`: "Practicing one type is good extra practice, but only **All types** problems count toward your stars."

### Unit 4: Mixed Numbers (also Units 3 and 5, and the shared fraction step)

**E1-04 · Major · "You took the top fraction from the bottom one": problems are horizontal, and "top" already means numerator**
- **Where:** `lib/fractions.ts:146` (`mixedSubDiagnose`). Shown in Unit 4 Practice (Subtract), Unit 4 Test Q4, Module Test Q17, and Unit 5 mixed-number subtraction stories and Test Q9.
- **Text:** "It looks like you took the top fraction from the bottom one. You can't. Borrow 1 whole first."
- **Problem:** Every problem is written on one line (5 1/4 − 2 3/4). There is no top or bottom fraction. Throughout the lab, "top" means **numerator** and "bottom" means **denominator** ("add the tops", "keep 12 on the bottom"). A student will read this as "you took the numerator from the denominator" and won't recognize their mistake.
- **Breaks:** traps §1 (the same word with two meanings in one lab); traps §6 (pronoun "one" pointing back).
- **Rewrite** (the function already has `a`, `b`, `L`): "It looks like you did {b}/{L} − {a}/{L}. You can't take {b}/{L} from {a}/{L}. Borrow 1 whole first." Example: "It looks like you did 9/12 − 4/12. You can't take 9/12 from 4/12. Borrow 1 whole first."

**E1-05 · Major · Four different phrases for "turn extra pieces into a whole", and "carry" is never taught**
- **Rule:** Borrow is taught by name, with a picture and a CFU question. Its partner on the addition side has no name and four wordings. Pick **one** wording, teach it once in Unit 4's Explore and Key Idea, and use it everywhere.
- **Locations:**
  - "carry it to the whole number": `units/MixedNumbers.tsx:168` (Explore)
  - "Is that 12/12 or more? Then carry 1 whole.": `units/MixedNumbers.tsx:299` (Practice hint)
  - "…so carry: 5 19/12 = 6 7/12.": `units/MixedNumbers.tsx:303` (Show answer)
  - "Borrow or carry if you need to.": `units/MixedNumbersTest.tsx:29`
  - "Carry if the fractions make a whole.": `units/WordProblems.tsx:404`, `units/WordProblemsTest.tsx:144`
  - "pull out the wholes" (phrasal verb): shared `shared/engine/StepProblem.tsx` `checkFraction` (the `why` text after `SIMPLEST_FORM_MSG`). In this lab that's every simplest-form miss on an improper answer, including Unit 3, where there is no whole number to "pull out".
  - "Take out the whole, then check the fraction part.": `units/AddSubtractUnlikeTest.tsx:81`
  - "You made a new whole from the pieces, but you forgot to add it to the whole number.": `lib/fractions.ts:160`
- **Breaks:** README idea 5 and english-learners.md (several words for one idea; phrasal verbs); grade-5.md → Math words (a new word is taught, not assumed).
- **Rewrite:**
  - Unit 4 Explore (after the borrow sentence): "When the fraction parts make 1 whole or more, **carry**: move 1 whole to the whole number. 5 19/12 = 6 7/12."
  - Key Idea: add "If the fractions make 1 whole or more, carry 1 whole to the whole number."
  - Shared message (only MG10 uses `simplest` today): "That's equal, but it's not in simplest form. Simplify it. The top is as big as the bottom or bigger. Write it as a whole number or a mixed number."
  - `AddSubtractUnlikeTest.tsx:81`: "{r}/{L} = {ans}. {L}/{L} is 1 whole. Write the rest as a fraction in simplest form."
  - `fractions.ts:160`: "The fractions make more than 1 whole. You forgot to carry 1 whole to the whole number."

**E1-15 · Minor · The "need to borrow?" question gives away its answer when subtracting from a whole number**
- **Where:** `units/MixedNumbers.tsx:262` (`subFromWhole`).
- **Text:** "6 has no fraction part. Do you need to borrow?"
- **Problem:** The first sentence is the reason, so the question answers itself, and the answer is always "Borrow".
- **Breaks:** checklist §3 (Giveaways).
- **Rewrite:** "Find 6 − 2 1/3. Can you take 1/3 from 6 now, or do you need to borrow?" Keep the current hint, which already asks about loose pieces.

**E1-16 · Minor · A dash aside in a sentence fragment**
- **Where:** `units/MixedNumbers.tsx:188` (Explore, before the Borrow button).
- **Text:** "Only 3/12 — not enough to take 8/12 away."
- **Breaks:** grade-4.md → Grammar (keep sentences whole; no dash asides).
- **Rewrite:** "There are only 3/12. That is not enough to take away 8/12."

**E1-21 · Polish · Small wording fixes in Unit 4**
- `MixedNumbers.tsx:345` caption, passive: "1 whole was borrowed and cut into pieces." → "We borrowed 1 whole and cut it into pieces."
- `MixedNumbersTest.tsx:164` Q10, unclear "it": "You borrow 1 whole from 5 1/4. What does it become?" → "You borrow 1 whole from 5 1/4. What is 5 1/4 written now?"
- `MixedNumbersTest.tsx:113` Q8, "finds" reads like she found the problem: "Ana finds 5 1/4 − 2 3/4." → "Ana works on 5 1/4 − 2 3/4."

### Unit 1: Why You Can't Just Add Across

**E1-06 · Minor · The re-cut hint says "one piece of 3/4" and is sometimes no help**
- **Where:** `units/WhyNotAcross.tsx:254` (Practice step 1 hint).
- **Text:** "How many twelfths fit in one piece of 3/4? Look at the thick lines in the picture."
- **Problem:** 3/4 has three pieces, so "one piece of 3/4" is unclear (it means "one fourth"). The hint always names the first fraction. In the "One fits the other" bucket the first fraction can already be in the common pieces (e.g. 3/8 + 1/4). Then the answer is "1", which doesn't help.
- **Breaks:** traps §5 (small words carrying the math: "of").
- **Rewrite:** Name the fraction whose pieces get cut: "How many {pieceWord(L)} fit in one {single piece name, e.g. "fourth"}? Look at the thick lines in the picture." Use whichever fraction has `L / d > 1`.

**E1-07 · Minor · Test Q9 answers are piece names only**
- **Where:** `units/WhyNotAcrossTest.tsx:155-163`.
- **Text:** "Which pieces can you cut BOTH bars into?" Choices like "twentieths / ninths / fifths" or "fourteenths / ninths / sevenths".
- **Problem:** A student who knows the answer is 20 still has to decode "twentieths". Multi-syllable ordinal plurals are hard for weak readers (grade-4.md: morphology is still being learned).
- **Rewrite:** Put the number in each choice: "twentieths (20 in 1 whole)", "ninths (9 in 1 whole)", "fifths (5 in 1 whole)".
  - Hint: "The number must work for 4 and for 5." → "Find a number that both 4 and 5 go into."

**E1-08 · Minor · "Tops/bottoms" and "numerator/denominator" are never linked**
- **Where:** The whole lab uses "tops/bottoms" (hints, feedback, choices). The CFU and steppers use "numerator/denominator". Unit 1 CFU Q3 (`WhyNotAcross.tsx:91`) mixes them in one sentence: "the denominator 3 tells … You can add the tops only when the [denominators] are the same."
- **Breaks:** README idea 5 (don't switch synonyms until each is taught).
- **Rewrite:** Say it once in Unit 1's Explore intro (`WhyNotAcross.tsx:153`): "The top number is the **numerator**. The bottom number is the **denominator**. Every bar is 1 whole, and every bar is the same size." Then keep using tops/bottoms freely.

### Unit 2: Finding a Common Denominator (continued)

**E1-09 · Minor · "Go into" is the definition of a common denominator, and it is never explained**
- **Where:** `units/CommonDenominators.tsx:140` and `:253` ("A common denominator is a number both denominators go into"). It appears in many hints and in `lcdDiagnose`.
- **Breaks:** english-learners.md → phrasal verbs.
- **Rewrite** (once, in the Explore definition): "A **common denominator** is a number both denominators go into, with nothing left over. 4 goes into 12 because 4 × 3 = 12."

**E1-10 · Minor · CFU Q3's "it" points back to an earlier paragraph**
- **Where:** `units/CommonDenominators.tsx:68-79`.
- **Text:** "Think about multiplying the two denominators, like 4 × 6 = 24." Then: "True or false: it always gives a common denominator." / "True or false: it always gives the LCD."
- **Breaks:** traps §6.6 (pronouns that point back).
- **Rewrite:** "True or false: multiplying the denominators always gives a common denominator." / "True or false: multiplying the denominators always gives the LCD."

**E1-11 · Minor · Test Q5's wording is clumsy**
- **Where:** `units/CommonDenominatorsTest.tsx:68`.
- **Text:** "For which pair is the LCD SMALLER than the two denominators multiplied?"
- **Breaks:** traps §6 (a long noun phrase with a reduced clause).
- **Rewrite:** "Multiply the two denominators in each pair. For which pair is the LCD smaller than that?"

### Unit 3: Adding and Subtracting Fractions

**E1-12 · Minor · Key Idea says "Then simplify:" but the example needs no simplifying**
- **Where:** `units/AddSubtractUnlike.tsx:268`.
- **Text:** "Then simplify: 3/4 + 1/6 = 9/12 + 2/12 = 11/12. An answer like 4/6 is equal, but not finished…"
- **Rewrite:** "Example: 3/4 + 1/6 = 9/12 + 2/12 = 11/12. Then check for simplest form. An answer like 4/6 is equal, but not finished: write 2/3. Write 17/12 as 1 5/12."

**E1-13 · Minor · CFU Q3 asks a yes/no question but the answer is True/False**
- **Where:** `units/AddSubtractUnlike.tsx:74` and `:85`.
- **Text:** "Two fractions are each less than 1. Is their sum always less than 1?" Then: "True or false: the sum is always less than 1."
- **Rewrite:** Make the lead a statement: "Two fractions are each less than 1."

**E1-14 · Minor · "No common factor but 1" ("but" meaning "except")**
- **Where:** `units/AddSubtractUnlike.tsx:193` (Explore, step 4).
- **Text:** "11 and 12 have no common factor but 1, so it is already in simplest form."
- **Breaks:** english-learners.md (idiomatic small words).
- **Rewrite:** "The only number that divides both 11 and 12 is 1. So 11/12 is already in simplest form."

**E1-20 · Polish · "The pieces make whole numbers."**
- **Where:** `units/AddSubtractUnlike.tsx:188` and `:240`.
- **Rewrite:** "The answer is a whole number."

### Unit 5: Word Problems

**E1-17 · Minor · "Worked out … before you work it out"**
- **Where:** `units/WordProblems.tsx:308` ("Does it make sense?" story).
- **Text:** "Ana worked out 1/8 + 1/3 and got 2/11. Use benchmarks to check before you work it out."
- **Problem:** A phrasal verb used twice. "Worked out" also means "exercised", and the second "it" is unclear.
- **Breaks:** english-learners.md → phrasal verbs; traps §6.6.
- **Rewrite:** "Ana says 1/8 + 1/3 = 2/11. Check her answer with benchmarks before you find the exact sum."

**E1-18 · Minor · The answer prompt asks two questions but has one answer box**
- **Where:** `units/WordProblems.tsx:272`.
- **Text:** "Write 7/8 − 1/3 in simplest form. Is it close to your estimate?"
- **Problem:** The student can't answer the second question anywhere.
- **Rewrite:** "Write 7/8 − 1/3 in simplest form. Then check that it is close to your estimate."

**E1-22 · Polish · A few story amounts don't match real measuring**
- **Where:** `lib/stories.ts` with `WORD_DENS`.
- **Problem:** "Ana used 6 1/12 cups of flour", "a recipe needs 7/10 cup of sugar", "read for 3/10 hour". Kitchen cups come in 1/4, 1/3 and 1/2, so twelfths and tenths of a cup are a mildly unfamiliar setting (traps §7).
- **Fix:** Optionally limit the cup and recipe templates to denominators {2, 3, 4, 8}. Miles, liters and feet are fine with any denominator.

### Shell (continued)

**E1-19 · Minor · The stars rule is 26 words with a parenthesis, and "reps" is slang**
- **Where:** `MG10_AddingAndSubtractingFractionsLab.tsx:110` and `:293`.
- **Text:** "To fill in your stars, solve each kind of problem twice on your own (no wrong guesses, at most one hint, answers in simplest form)." Also: "great for extra reps".
- **Breaks:** grade-4.md → Limits (18 words); english-learners.md → idioms.
- **Rewrite:** "To fill in your stars, solve each kind of problem twice on your own. Use no wrong guesses and at most one hint. Write answers in simplest form. Only All types problems count." (Uses E1-02's new label.)

### Across units

**E1-23 · Polish · Problem-type labels a student reads to choose a type**
- **Where:**
  - `WhyNotAcross.tsx:313-315`: "Unit + non-unit", "One fits the other", "Nothing in common"
  - `WordProblems.tsx:449`: "Left or more"
- **Rewrite:** "1 on top + more on top" (or keep "Unit + non-unit" if unit fraction is taught); "One bottom fits in the other"; "No shared factor"; "How much is left or more?"

**E1-24 · Polish · Screen-reader reading**
- `Frac`'s `aria-label` is "3/4", which many readers say as "3 slash 4".
- In Unit 2's Explore, the stacked `Frac n="3 × 3" d="4 × 3"` is read as "3 × 3/4 × 3", which sounds like a different expression.
- `BenchmarkLine`'s label ("Number line from 0 to 1 with benchmarks at every half") leaves out where the dots are. Unit 5 CFU Q1 says "Look at the dots."
- **Fix:** Optionally make the Frac label "3 over 4" (or "three fourths"), and add the points to BenchmarkLine's `aria-label` ("3/8 is at …; 5/6 is at …"). This matters only for screen-reader users; no read-aloud exists in this lab.

**E1-25 · Polish · "Click again to clear all stars" on an iPad**
- **Where:** `MG10_AddingAndSubtractingFractionsLab.tsx:390`.
- **Rewrite:** "Tap again to clear all stars."

---

## 4. What's working well

- **Short, plain sentences everywhere.** No task or feedback string is over the grade-4 limit. The median longest sentence is 7 words in tasks and 9 in feedback.
- **New words are taught the right way.**
  - **LCD:** taught with a multiples list and a CFU question that puts "common denominator" and "LCD" side by side.
  - **Borrow:** taught with a button that shows the borrowed whole and a vocabulary CFU, and said once to be "also called regrouping".
  - **Benchmark:** taught on a number line before any question uses it.
- **Named-mistake feedback is clear and doesn't give the answer.** Examples: "192 is a common denominator, but not the least…" and "You added across. First make same-size pieces…".
- **Word problems are clean.** I printed every template × every name × the smallest and largest amounts. Results:
  - Question last, three sentences, at most 14 words per sentence.
  - Singular and plural units are right ("3/4 mile", "1 1/4 miles", "3/4 foot", "5 1/2 feet").
  - Pronouns match the names.
  - Settings are familiar (school, flour, milk, ribbon, hike).
  - Problem types fit 5.NF.2 (join, separate, compare, how much more needed), and no keyword lists are taught.
- **Picking an answer is easy to read.** Choices are short and parallel ("Yes. It is close to the estimate." / "No. It is too small." / "No. It is too big.").

## 5. Out of my lane (for the curriculum checker)

- E1-01 is also a correctness bug in the picture. `MultiplesList count={6}` shows 36 as a third common multiple.
- Unit 5 Practice: the answer step's prompt prints the expression ("Write 7/8 − 1/3 …"), and the estimate hint names the operation. The student never has to turn the story into an operation without help, which is the core of 5.NF.2. The estimate step does require the operation implicitly.
- Unit 4 `subFromWhole`: the "Do you need to borrow?" step always has the same answer, so it checks nothing (see E1-15 for the wording).

## 6. Guideline gaps (proposed sentences; I did not edit these files)

- **`grade-5.md` → Math words → "New in 5th"**, add: "*common denominator, least common denominator (LCD)*, *benchmark fraction* (0, 1/2, 1), and the mixed-number words *borrow/regroup* and *carry*. Pick one word for each and teach it with a picture before using it in a hint."
- **`math-language-traps.md` §1**, add a row: "| mixed | a mix of types (a practice-mode label) | mixed number | 4–5 |". Add a note: "Check UI labels (practice modes, buttons) against the lab's math words. A label must not reuse a math word with a different meaning."
- **`math-language-traps.md` §1 or `english-learners.md`**, add: "*Top/bottom* for numerator/denominator is fine, but link them once ('the top number is the numerator'). Then never use *top/bottom* for position on the screen ('the top fraction') in the same lab."
- **`checklist.md` §3**, add a row: "Text vs. picture: does every sentence that describes a picture (counts, 'the two numbers in both lists') match what the picture actually shows at the values used?"

## 7. What I could not check

- Real students, and real iPad Safari rendering of the stacked fraction boxes.
- Real screen-reader output. My notes come from the `aria-label` values in the code.
- Voice: this lab has no read-aloud, so no speech was captured.
- Generators: I ran `lib/fractions.ts` and `lib/stories.ts` through a scratch esbuild bundle (stories, piece words for every reachable LCD, every `lcdDiagnose` branch, claims, mixed estimates). I did not render each unit's Practice in a browser. Prompt and hint templates in `units/*.tsx` were checked by reading them against the generator ranges.
