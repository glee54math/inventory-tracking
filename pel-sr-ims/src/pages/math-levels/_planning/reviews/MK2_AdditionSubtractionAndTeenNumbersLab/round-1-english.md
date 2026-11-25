# MK2 Addition, Subtraction & Teen Numbers: English review, round 1

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` (6 units, 6 unit Tests, Module Test of 30; confirmed in `units/index.ts` and `units/ModuleTest.tsx`)
- **Round:** 1, full review · **Date:** 2026-11-21
- **Grade assessed:** Kindergarten, K–1 band. There is no younger grade file, so `grade-K.md` is also the limit for read-alone text: assume no independent reading.
- **Audience:** K/1st graders seeing this for the first time, plus 2nd graders who are behind, alone on an iPad, audio-first.
- **Checked against:** the English guidelines, the approved plan, this lab's and MK1's vocabulary lists (`LAB_NEEDS`: MK2 needs MK1 only), and the MG2 standing decisions.
- **How real values were checked:** I bundled the lab's real generators and ran 6,000 problems per Practice bucket and 2,000 per Test question, and ran sample lines through the real `speakableText`. Percentages below come from those runs.

Paths are relative to `src/pages/math-levels/MK2/AdditionSubtractionAndTeenNumbersLab/units/`, unless a line says "shell" (`MK2_AdditionSubtractionAndTeenNumbersLab.tsx`).

## 1. Verdict

**Not ready.** The CFUs are close to right for Kindergarten, but Explore, Key Ideas, Practice and Tests are still written for students who can read on their own. Six problems can make a student who knows the math get it wrong, including a Test question that asks how many more blocks Leo has when Leo has fewer (39% of the time).

**Counts: 6 Blocker · 25 Major · 12 Minor · 4 Polish (47 findings).**

## 2. Scorecard

Length shows the script's % of strings over the 8-word limit: task text / after-answer text / Explore and CFU screen text.

| Unit | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| 1 Putting Together | Weak (28 / 67 / 67%) | Weak | Weak | Weak (start-unknown) | Weak ("1 ducks") | Weak |
| 2 Word Problems | Weak (49 / 55 / 75%) | Weak | Weak | Weak (false premise, compare) | Weak | Weak |
| 3 Breaking Apart | Weak (68 / 75 / 75%) | Weak | Weak | n/a | OK | Weak |
| 4 Making 10 | Weak (55 / 38 / 67%) | OK | Weak (*partner*) | n/a | Weak ("6 s partner", "1 minus 9") | Weak |
| 5 Fast Facts | Weak (42 / 17 / 67%) | OK | Weak (*addend*) | n/a | OK | Weak |
| 6 Teen Numbers | Weak (39 / 64 / 75%) | Weak ("1 ones") | Weak (*digit*, *equation*) | n/a | Weak ("11 minus 19") | Weak |
| Module Test | Inherits its 30 items | Weak | Weak | Weak | Weak | OK (one at a time) |
| Shell | OK (30% screen) | OK | Weak (*cumulative*, *mastery*) | n/a | OK | Weak (long home line) |

## 3. All findings

### All units

#### E1-01 · Major · "1 ducks": generated sentences break at the value 1
- **Where:** `PuttingTogetherAndTakingApart.tsx:199, 218, 238–239, 247, 261, 280`; `PuttingTogetherAndTakingApartTest.tsx:23, 37, 51, 65, 79, 93, 108, 126`; `WordProblemsWithin10.tsx:145, 152, 212, 233, 256, 278, 305, 323`; `WordProblemsWithin10Test.tsx:20, 34, 51–52, 72, 86, 127, 151, 170, 190`; `TeenNumbers.tsx:112, 140, 163, 165, 184, 188, 190, 202`; `TeenNumbersTest.tsx:23, 36, 49, 117, 134`.
- **Exact text (real output):** "There are 1 ducks." · "There are 5 ducks. 1 more ducks swim over to join them." · "1 fish are in a pond." · "Hold up 1 fingers on one hand" · "There are 2 cookies. 1 of them get eaten." · "4 fingers are up. 1 of them go down." · "11 has 1 extra ones." · "'eleven' is 1 ten and 1 ones."
- **Breaks:** builder "Generated sentences must be grammatical"; checklist §3 "Generated plurals."
- **Rewrite (rule):** add one `count(n, "duck", "ducks")` helper and singular verbs. Examples: "There is 1 duck. 3 more ducks come." · "There are 5 ducks. 1 more duck comes." · "There are 2 cookies. Sam eats 1." · "One ten and 1 one."

#### E1-02 · Major · True/false questions (9 items)
- **Where:** Practice `WordProblemsWithin10.tsx:283`, `DecomposingNumbers.tsx:246`. Tests `PuttingTogetherAndTakingApartTest.tsx:157`, `WordProblemsWithin10Test.tsx:99`, `DecomposingNumbersTest.tsx:103, 119, 152`, `MakingTenTest.tsx:111`, `TeenNumbersTest.tsx:96`. Three of these are also in the Module Test (`takeAwayNeverBigger`, `moreThanOneWay`, `everyTeen`).
- **Exact text, e.g.:** "True or false: when a story gives you a total and ONE part, you can always subtract to find the other part — even if the story never says 'take away.'" (30 words)
- **Breaks:** grade-K.md → Grammar, "Not yet: True or false"; builder band table.
- **Rewrite (one new example, with a picture):**

| Item | New question | Answer form |
|---|---|---|
| Unit 1 Test :157 | "5 dots. Take 2 away. Are there more, or fewer?" | More / Fewer |
| Unit 2 Practice :283 | Delete this step; the typed step already checks it | |
| Unit 2 Test :99 | "6 crayons. 2 are blue. The rest are orange. How many are orange?" | typed |
| Unit 3 Practice :246 | Delete; the step before it found the equal parts | |
| Unit 3 Test :103 | "5 is 4 and 1. Is there another way to make 5?" (CFU wording) | Yes / No |
| Unit 3 Test :119 | "6 is 5 and 1. 6 is 4 and how many?" | typed |
| Unit 3 Test :152 | "Split 6 into two parts that are the same. How many in each part?" | typed |
| Unit 4 Test :111 | "7 and how many make 10?" | typed |
| Unit 6 Test :96 | "One ten and 8 ones. What number is it?" | typed |

#### E1-03 · Major · Every Goal and Key Idea is far over the limit, and the voice reads them first
- **Where:** `goal` and `keyIdea` in all six unit files (`PuttingTogetherAndTakingApart.tsx:297–303`, `WordProblemsWithin10.tsx:336–342`, `DecomposingNumbers.tsx:258–264`, `MakingTen.tsx:195–201`, `FastFactsWithin5.tsx:274–280`, `TeenNumbers.tsx:219–225`). Key Idea sentences run up to 34 words.
- **Exact text, e.g.:** "Word problems describe add/subtract stories in different ways: a group getting MORE, a group having some TAKEN AWAY, two groups already TOGETHER, a missing PART of a known total, or two groups being COMPARED."
- **Breaks:** grade-K.md → Limits (8 words, one idea).
- **Rewrite:**

| Unit | Goal | Key Idea |
|---|---|---|
| 1 | "Put groups together. Take some away." | "Put together makes more. Take away makes fewer." |
| 2 | "Solve stories with numbers up to 10." | "Listen to the story. Look at the picture." |
| 3 | "Break a number into two parts." | "A number can break apart many ways." |
| 4 | "Find what makes 10." | "Fill the empty boxes to make 10." |
| 5 | "Know small facts fast." | "Try to know it. Count if you need to." |
| 6 | "See teen numbers as ten and more." | "A teen number is one ten and some ones." |

#### E1-04 · Major · Explore explanation paragraphs
- **Where:** `PuttingTogetherAndTakingApart.tsx:153–154, 159, 162`; `WordProblemsWithin10.tsx:147, 154, 161, 168, 179`; `DecomposingNumbers.tsx:138–139`; `MakingTen.tsx:112–113`; `FastFactsWithin5.tsx:143, 155, 165–166`; `TeenNumbers.tsx:112, 115–116`.
- **Exact text, e.g.:** "A "put together" story describes two groups that coexist from the start — nothing joins or leaves; you're just finding their combined total." · "The goal of this unit is SPEED — recognizing the answer instantly, the same way you already know your age without counting it out on your fingers."
- **Breaks:** grade-K.md → Limits; checklist §5 (screen load).
- **Rewrite, one short line per picture state:**
  - Unit 1: "3 and 2 make 5." / "3 + 2 = 5." · "5. Take away 2. 3 are still here." / "5 − 2 = 3."
  - Unit 2: put together: "Count both colors." · missing part: "Count the blue crayons."
  - Unit 3: "7 is 4 and 3. Move the dot. Find another way." When equal: "Both parts are the same!"
  - Unit 4: "How many empty boxes?" After reveal: "6 and 4 make 10."
  - Unit 5: "3 + 1 = 4." Drop the age comparison and the SPEED line.
  - Unit 6: "One ten and 4 ones make 14." / "10 + 4 = 14."

#### E1-05 · Major · Later-grade and untaught words
- **Where and replacement:**

| Word | Where | Say instead |
|---|---|---|
| decompose, decomposition | `DecomposingNumbers.tsx:262–263` | break apart |
| valid | `DecomposingNumbers.tsx:139, 263`; `DecomposingNumbersTest.tsx:86–87, 103` | "another way" |
| pair(s) | `DecomposingNumbers.tsx:138, 169, 197, 224, 226, 263`; `DecomposingNumbersTest.tsx:88`, Test explain :103; `MakingTen.tsx:144, 169` | "two parts", "these two numbers" |
| symbol | `PuttingTogetherAndTakingApart.tsx:153–154, 266, 285`; Test `:141` | "the plus sign" or "plus" |
| difference, gap | `WordProblemsWithin10.tsx:179, 323, 341`; `FastFactsWithin5.tsx:219`; `WordProblemsWithin10Test.tsx:171` | "the extras" |
| addend | `FastFactsWithin5.tsx:114, 255, 279` | "missing number" |
| complement, recall | `MakingTenTest.tsx:94, 96` (shown); `:31` (hidden hint) | remove |
| bundled, loose | `TeenNumbers.tsx:140, 165, 223`; `TeenNumbersTest.tsx:23, 117` | "one ten", "ones" |
| total, combined total, starting amount, known part, coexist | Practice hints and Explore in Units 1–3 and 5 | "in all", "at the start", "the part you know" |
| regardless, stand for | `TeenNumbersTest.tsx:49, 80` | remove / "show" |
| ten frame, frame | `MakingTen.tsx:109, 142`; `MakingTenTest.tsx:163` | "the boxes" |
| exact, exactly, actual, instantly | throughout Units 3–6 | drop the word |

- **Breaks:** grade-K.md → Math words, Not yet; checklist §3 "Untaught words."

#### E1-06 · Major · Several names for one idea
- **Where:** one ten: *full ten, ten-group, group of ten, bundled group, one ten* (`TeenNumbers.tsx:29, 33, 112, 140, 223`). Combining: *put together, join, add, plus, combined* (Units 1–2). Remaining: *left, still up, still there, gone*.
- **Breaks:** english-learners.md → "Several words for one idea"; README idea 5.
- **Rewrite:** use the CFU's words everywhere: "one ten" and "ones"; "put together" for the action and "plus" for +; "left" for what remains, matching MK1.

#### E1-07 · Major · "ones" used as a pronoun in a lab that teaches tens and ones
- **Where:** CFU `PuttingTogetherAndTakingApart.tsx:48–50`; `WordProblemsWithin10.tsx:32, 45, 47`; `FastFactsWithin5.tsx:47, 49, 76`. Unit 6 then teaches *ones* as a place-value word.
- **Exact text:** "The faded ones went away. Count the ones left." · "The blue ones are what she had."
- **Breaks:** traps §1 (*ones*); MG2 standing decision.
- **Rewrite:** "The faded dots went away. Count the dots left." · "Blue is what she had. Orange is new. Count them all."

#### E1-08 · Minor · Dash and parenthesis asides (71 + 5 flagged)
- **Where:** throughout; the script lists each one. Most disappear with E1-03, E1-04 and the rewrites below.
- **Example:** "Count carefully — there are more possible pairs…"
- **Breaks:** grade-K.md → one idea per sentence.
- **Rewrite (rule):** make two short sentences, or delete the aside. "Reread the story — does anything move?" becomes "Does anything move?"

#### E1-09 · Minor · Homophones the voice can't separate
- **Where:** *ate/eight* in stories that can say "ate 8" (`WordProblemsWithin10.tsx` CFU :41, `WordProblemsWithin10Test.tsx:34, 51`); *for/four* in "partner for 10" (see E1-31); *whole/hole* (`PuttingTogetherAndTakingApart.tsx:141, 154, 285`, `DecomposingNumbers.tsx:167, 197`); *pair/pear* near food stories.
- **Breaks:** traps §2.
- **Rewrite:** "Sam eats 2." · "all of them" in place of "the whole." The *pair* and *for* cases go away with E1-05 and E1-31.

#### E1-10 · Minor · The story and the first step say the same question twice
- **Where:** `WordProblemsWithin10.tsx:212/215, 233/237, 256/259, 278/281, 305/321`; `MakingTen.tsx:138/142`; `FastFactsWithin5.tsx:192/195, 213/217, 234/243, 257/260`.
- **Breaks:** grade-K.md → one action; checklist §5.
- **Rewrite:** the story states the facts ("Mia has 5 blocks. She gets 2 more."). Only the step asks ("How many now?").

#### E1-11 · Minor · Control labels a non-reader can't use
- **Where:** "What's happening," `PuttingTogetherAndTakingApart.tsx:123`; "Part taken apart" `:142`; "Story type" `WordProblemsWithin10.tsx:116`; "Known part" `:140`, `FastFactsWithin5.tsx:130`; "Fact type" `:107`; "Number to break apart" `DecomposingNumbers.tsx:109`; "Starting number" `MakingTen.tsx:81`; "Extra ones beyond a full ten" `TeenNumbers.tsx:97`; "Reveal the partner for 10" `MakingTen.tsx:106`.
- **Breaks:** grade-K.md → on-screen text limits.
- **Rewrite:** "Pick one" · "Take away" · "Number" · "Ones" · "Show me" / "Hide".

#### E1-12 · Polish · Test `hint` text is never shown
- **Where:** every `*Test.tsx`. `shared/engine/UnitTest.tsx` shows no hints, so I did not count their wording as findings, except where the same string also appears in Practice.
- **Breaks:** nothing students see. Several would be wrong if ever enabled, such as "The total always goes on the right of the = sign." (`FastFactsWithin5Test.tsx:133`), which MG1 Unit 6 teaches is not so.
- **Rewrite:** when fixing a Test item, replace its hint with a short picture pointer, and delete that false line.

### Shell

#### E1-13 · Major · Home and Module Test lines
- **Where and rewrite:**

| Line | Exact text | Rewrite |
|---|---|---|
| shell :85 | "Join groups together, take them apart, solve story problems, find partners for 10, learn your fast facts, and see teen numbers as ten and some more." (27 words) | "Add. Take away. Make 10. Meet teen numbers." |
| :113 | "Solve each kind of problem 2 times by yourself to fill in your stars. Only Mixed problems count." | "Solve by yourself to fill your stars." |
| :120, :463 | "30 cumulative questions, 5 from every unit in this lab." / "…covering every unit in Addition, Subtraction & Teen Numbers — 5 from each." | "30 questions from all the units." |
| :298 | "Complete the activity above to unlock practice problems." | "Finish the questions. Then you can practice." |
| :321 | "Practicing one type is great for extra reps, but only Mixed problems count toward your mastery stars." | "Only Mixed earns stars." |
| :343, :351 | "You've mastered {title}. Take the test to finish this unit." | "You did it! Now take the test." |
| :454 | "Click again to clear all stars" | "Tap again to clear your stars" |

- **Breaks:** grade-K.md → Limits; vocabulary (*cumulative*, *mastery*, *activity*, *reps*). "Click" is wrong for an iPad.

#### E1-14 · Major · Module Test shows a star at any score, even 0 of 30
- **Where:** `ModuleTest.tsx:25–31`, shown by `RatingStars` at shell `:123, :441, :467`.
- **Exact behavior:** `moduleTestStars` returns 1 for every score under 18, including 0.
- **Breaks:** standing requirement 3 (honest stars).
- **Needs the user's decision:** what earns the first star. Recommendation: under 18 of 30 shows no star (`return 0`), so stars start at 60%.

#### E1-15 · Minor · Unit names are not voiced
- **Where:** the path titles and goals at shell `:102–105`, Module Test card `:119–120`, unit `<h1>` `:254`. None are inside `ReadAloud`, and the home page has no read-all button.
- **Breaks:** grade-K.md → "Every word a student needs must be spoken."
- **Rewrite:** wrap the path cards and unit title in `ReadAloud`, or add a speak button per card.

#### E1-16 · Polish · "Standard K.OA.1" shows on the student's screen
- **Where:** shell `:262`. Teacher code; not spoken.
- **Rewrite:** hide it from the student view, if the teacher doesn't need it there.

### Unit 1: Putting Together and Taking Apart

#### E1-17 · Blocker · Start-unknown stories on the Tests
- **Where:** `PuttingTogetherAndTakingApartTest.tsx:37, 65`; `WordProblemsWithin10Test.tsx:190`.
- **Exact text:** "5 more birds joined a group, making 8 birds in all. How many birds were there before the 5 joined?" · "2 balloons popped, leaving 3 balloons. How many balloons were there before any popped?"
- **Breaks:** grade-K.md → Word problems, "Not yet: start unknown." The plan's Unit 1 and 2 buckets are result-unknown only, so this needs no plan change.
- **Rewrite:** replace with result-unknown items: "3 birds. 2 more come. How many now?" · "5 balloons. 2 pop. How many are left?"

#### E1-18 · Major · Explore labels are false in "Taking apart" mode
- **Where:** `PuttingTogetherAndTakingApart.tsx:141`, `:159–162`.
- **Exact text:** the stepper says **"Whole group" 3** while the picture and sentence show 5 ("5 splits APART into 3 and 2"). The finger line stays "3 fingers and 2 fingers makes 5 fingers in all" in take-apart mode.
- **Breaks:** checklist §3 "Text vs. picture" and "Mode-dependent lines."
- **Rewrite:** in take-apart mode, label the steppers "Stay" and "Go away", and say "5 fingers. Put 2 down. 3 are still up."

#### E1-19 · Minor · "Before" look-back prompts
- **Where:** `PuttingTogetherAndTakingApart.tsx:204, 223`.
- **Exact text:** "Before the 2 more joined, how many ducks were there?" · "How many balloons were there before any pop and are gone?"
- **Breaks:** grade-K.md → two clauses; generated grammar.
- **Rewrite:** "How many ducks at the start?" · "How many balloons at the start?"

#### E1-20 · Minor · "One more finger" can ask for 11 fingers
- **Where:** `PuttingTogetherAndTakingApart.tsx:245` (3.1% of finger problems; the picture draws at most 10).
- **Exact text:** "If one more finger went up, how many would be raised then?"
- **Breaks:** grade-K.md → *if/then*; checklist "Text vs. picture."
- **Rewrite:** "1 more finger goes up. How many now?" Only ask when the count is under 10.

### Unit 2: Solving Word Problems Within 10

#### E1-21 · Blocker · "Add or Subtract": the answer depends on an untaught word
- **Where:** Practice `WordProblemsWithin10.tsx:217–219, 238–241`; Test `WordProblemsWithin10Test.tsx:51–57` (also in the Module Test). *Subtract* is also in hints and in the Unit 1 Goal and Key Idea, but no unit teaches it with a picture. The CFU teaches *take away* and *minus*.
- **Exact text:** "Does this story ADD or SUBTRACT?" (buttons "Add", "Subtract")
- **Breaks:** checklist §3 "Untaught words"; grade-K.md → New in K (*add, plus, take away*).
- **Rewrite:** "Add, or take away?" with buttons **Add** / **Take away**. Replace *subtract* and *subtracting* across student text with *take away*.

#### E1-22 · Blocker · "How many more does Leo have?" when Leo has fewer
- **Where:** `WordProblemsWithin10Test.tsx:151` (also in the Module Test): **Leo has fewer in 38.8% of draws**. Same false premise in Explore `WordProblemsWithin10.tsx:177` whenever Mia's stepper is lower than Theo's.
- **Exact text (real case):** "Leo has 2 blocks. Ana has 7 blocks. How many more blocks does Leo have than Ana?"
- **Breaks:** grade-K.md → Word problems; traps §4. A student who sees that Leo has fewer has no correct way to answer.
- **Rewrite:** always name the child who has more, as Practice does (`biggerKid`). Pending E1-23: "Ana has 7. Leo has 2. Who has more?"

#### E1-23 · Major · Compare "how many more" stories in a K lab
- **Where:** `WordProblemsWithin10.tsx:177, 305, 321, 323`, Key Idea `:341`; `WordProblemsWithin10Test.tsx:127, 151, 170`; two reach the Module Test.
- **Exact text, e.g.:** "How many more apples does the one with more have?" (relative phrase, "more" twice) · "One jar has 3 beads, another has 7 beads. If 4 more beads were added to the smaller jar, would both jars then have the same amount?"
- **Breaks:** grade-K.md → Word problems, "Not yet: compare problems"; traps §4. **But the approved plan includes this bucket** (Unit 2, "Compare, difference unknown").
- **Needs the user's decision:**
  - **A (recommended):** keep compare at the CFU level. "Mia has 5. Theo has 3. Who has more?" with the rows lined up. Move how-many-more to MG1 Unit 4, where it's taught.
  - **B:** keep the bucket, as a picture task: "Line them up. How many extra dots?" Drop the "If… got more" step and the jar item.

#### E1-24 · Major · Keyword teaching
- **Where:** Explore `WordProblemsWithin10.tsx:147, 154`; Practice hints `:217, :239`.
- **Exact text:** "look for words like "gets," "gives her," "more."" · "Look for the word "more" — something is joining."
- **Breaks:** traps §9. This unit's own compare stories use "more" and are solved by taking away, so the keyword fails inside the same lab.
- **Rewrite:** point at what happens: "Do more come?" · "Do some go away?"

#### E1-25 · Major · Missing-part story has no real colors
- **Where:** `WordProblemsWithin10.tsx:278, 281`.
- **Exact text:** "There are 3 balloons in a box. 1 of them are one color, and the rest are another color. How many are the OTHER color?" (or "the first color")
- **Breaks:** builder "Color words name the colors on screen"; grade-K.md → pronouns and two clauses.
- **Rewrite:** "3 balloons. 1 is blue. The rest are orange. How many are orange?" (match the picture's order and tones).

#### E1-26 · Major · Explore can tell an impossible story
- **Where:** `WordProblemsWithin10.tsx:152–154`: the second stepper can exceed the first.
- **Exact text (real case):** "Sam had 4 crackers. He ate 9 of them. How many are left?", shown over "4 − 4 = 0."
- **Breaks:** checklist "Text vs. picture."
- **Rewrite:** limit the stepper to the first amount, so the sentence always matches the picture.

#### E1-27 · Major · "Were both groups there the whole time?"
- **Where:** `WordProblemsWithin10.tsx:261–263`.
- **Exact text:** "Did anything JOIN or LEAVE in this story, or were both groups there the whole time?" with choices "Both groups were there the whole time" / "Something joined partway through".
- **Breaks:** grade-K.md → one idea, 8 words; builder "no vocabulary questions." The choices must be read.
- **Rewrite:** delete this step. The typed put-together step already checks the skill.

#### E1-28 · Minor · Passive voice in a Test story
- **Where:** `WordProblemsWithin10Test.tsx:52, 54`. Also, this template goes past 10 in 19.4% of all draws (see Out of my lane).
- **Exact text:** "He was given 3 more."
- **Breaks:** grade-K.md → Not yet: passive.
- **Rewrite:** "He gets 3 more."

### Unit 3: Breaking Numbers Apart

#### E1-29 · Major · The explanation names the same way it says is different
- **Where:** `DecomposingNumbers.tsx:169` (**29.2% of the "small number" bucket**); `:206–211` and `:226` (7.6% of "different way" problems swap the same two numbers).
- **Exact text (real case):** "Is 4 and 1 the ONLY way to break 5 apart?" … "No — 5 can also be broken apart other ways, like 4 and 1." Also: "Is 3 and 4 the SAME way as 4 and 3, or a DIFFERENT way?" → "A different way."
- **Breaks:** checklist "Text vs. picture"; "Giveaways/false" logic.
- **Rewrite:** always name a pair that uses different numbers: "No. 5 is also 3 and 2." Draw `a2` so it is neither `a1` nor `b1`.

#### E1-30 · Major · Long or "if" prompts
- **Where and rewrite:**

| Line | Exact text | Rewrite |
|---|---|---|
| `:167`, `:197` | "If the first part is 3, what is the second part?" | "3 and how many make 5?" |
| `:198` | "Here's a DIFFERENT way: if the first part is 2 instead, what would the second part be?" | "Another way. 2 and how many make 7?" |
| `:224` | "Find a DIFFERENT way: if the first part is 2, what's the second part?" | same pattern |
| `:226` | "Is 2 and 5 the SAME way as 4 and 3, or a DIFFERENT way?" | delete, or "Is this a new way?" |
| `:244` | "If you split 8 into two EQUAL parts, how much is in EACH part?" | "Split 8 into two parts that are the same. How many in each part?" (CFU wording) |
| Test `:19, 33, 47, 169` | "Break 5 into two parts. The first part is 3. What is the second part?" | "5 is 3 and how many more?" |
| Test `:64` | "7 can be broken into 4 and 3. Find a DIFFERENT way: if the first part is 3, what's the second part?" | "7 is 4 and 3. Another way: 2 and how many?" |
| Test `:86` | "6 can be broken into 4 and 2. Is 1 and 5 ALSO a valid way to break 6 apart?" | "6 is 4 and 2. Is 6 also 1 and 5?" Yes / No |
| Hints `:167, :197, :198, :224, :244` | "The two parts together make the whole number — count carefully…" | "Count the orange dots." |

- **Breaks:** grade-K.md → *if/then*, 8 words, passive; builder "K–1 hints point at the picture."

### Unit 4: Making 10

#### E1-31 · Major · "Partner", and the voice says "6 s partner"
- **Where:** `MakingTen.tsx:106, 109, 112, 136, 144, 149, 186, 188, 199–200, 209`; `MakingTenTest.tsx:76, 92, 111, 149`; home shell `:85`.
- **Exact text and speech:** "6's partner for 10 is 4." is **spoken** "6 s partner for 10 is 4", and "for 10" is heard as "four ten."
- **Breaks:** grade-K.md → Not yet (*partner*); builder ("no partner"); traps §2.
- **Rewrite:** use the CFU's form: "6 and 4 make 10." · title "Make 10" · tab "Make 10" · "Which one makes 10?" · step 2 of the check: "9 and how many make 10?"

#### E1-32 · Major · The voice reads number ranges as subtraction
- **Where:** `MakingTen.tsx:195`, `TeenNumbers.tsx:219`.
- **Exact text and speech:** "any number 1-9" is **spoken** "any number 1 minus 9". "any number 11-19" is **spoken** "any number 11 minus 19".
- **Breaks:** traps §8 ("a-b ranges").
- **Rewrite:** the E1-03 Goals remove both. If a range is kept, write "1 to 9".

#### E1-33 · Major · A strategy question in words
- **Where:** `MakingTenTest.tsx:92–97` (also in the Module Test).
- **Exact text:** "To find a number's partner for 10 quickly, which is better: counting up from 1 every time, or just knowing the fact right away?" (24 words; choices "Just knowing it (recall)" / "Counting up from 1 every time")
- **Breaks:** grade-K.md → Limits; builder "no vocabulary questions"; "recall" is not a K word.
- **Rewrite:** replace with a fact item: "8 and how many make 10?" (typed, no picture).

#### E1-34 · Minor · "5 + 5 = 10, not 5 + 5 = 10."
- **Where:** `MakingTenTest.tsx:59`, when the number is 5 (1 in 7 of this item). Shown and spoken in the Test review.
- **Breaks:** checklist "Text vs. picture" (logic).
- **Rewrite:** `explain: "${n} and ${partner} make 10."`

#### E1-35 · Minor · "Exactly", "ACTUAL" and the full-frame wording
- **Where:** `MakingTen.tsx:138, 142, 182, 186`; `MakingTenTest.tsx:18, 31, 44, 59, 131, 149, 163`.
- **Exact text:** "What number goes with 6 to make exactly 10?" · "What is 6's ACTUAL partner for 10?" · "The ten frame is already completely full (10). How many MORE do you need to reach 10?"
- **Breaks:** grade-K.md → Limits.
- **Rewrite:** "6 and how many make 10?" · "All the boxes are full. How many more?"

### Unit 5: Fast Facts Within 5

#### E1-36 · Blocker · Two right answers, and one is marked wrong
- **Where:** `FastFactsWithin5.tsx:218–222` (**29.2% of subtraction problems**, every time the number taken away is 0).
- **Exact text (real case):** "What is 2 − 0?", then "Which addition fact matches this subtraction fact?" with choices **2 + 0 = 2** and **0 + 2 = 2**. Both are true; only one is accepted.
- **Breaks:** checklist "False distractors."
- **Rewrite:** remove this step (see E1-38). If it stays, skip it when `b` is 0.

#### E1-37 · Major · A question with only one button
- **Where:** `FastFactsWithin5.tsx:261–265` (**29.1% of missing-number problems**, when the first number is 0). The wrong choice equals the right one, and `choice()` removes the duplicate.
- **Exact text (real case):** "0 + ? = 4." then "Which number sentence also shows this fact?" with the single button **4 + 0 = 4**.
- **Breaks:** checklist "False distractors"; the step tests nothing.
- **Rewrite:** remove this step, or start the first number at 1.

#### E1-38 · Major · Fact-family questions the unit doesn't teach
- **Where:** `FastFactsWithin5.tsx:219, 262`; `FastFactsWithin5Test.tsx:67, 133` (`:133` is in the Module Test).
- **Exact text:** "Which addition fact matches this subtraction fact?" · "Which number sentence also shows this fact?" · hint "Subtraction and addition facts come in families — the difference plus the amount subtracted gives back the start."
- **Breaks:** grade-K.md → Math words; the plan's Unit 5 buckets don't include it (this is 1.OA.4 language).
- **Rewrite:** replace with one more typed fact: "2 + 1 = ?". For the Module Test slot: "2 + ? = 5".

#### E1-39 · Major · The hint gives no help
- **Where:** `FastFactsWithin5.tsx:195, 217`, the Show hint text for every addition and subtraction fact.
- **Exact text:** "You should know this fact without counting it out."
- **Breaks:** builder "K–1 hints point at the picture"; standing requirement 4 (Practice hints may point strongly). It also tells a stuck child they should already know it.
- **Rewrite:** "Look at the dots. Count them." For subtraction: "Count the dots left."

#### E1-40 · Minor · Doubles wording
- **Where:** `FastFactsWithin5.tsx:155, 197, 243–244`.
- **Exact text:** "Is 2 + 3 a "doubles" fact (both numbers the same)?" · "What is one MORE than 4 (that is, 2 + 2 + 1)?"
- **Breaks:** grade-K.md → one idea; paren asides.
- **Rewrite:** "Are the two numbers the same?" · "What is 1 more than 4?"

#### E1-41 · Polish · Missing number prompt asks twice
- **Where:** `FastFactsWithin5.tsx:257, 260`; `FastFactsWithin5Test.tsx:118`.
- **Exact text and speech:** "2 + ? = 5. What number is missing?" is spoken "2 plus what number equals 5. What number is missing?"
- **Rewrite:** "2 + ☐ = 5. What goes in the box?" (matches MG1 and the approved blank/box wording).

### Unit 6: Teen Numbers as Ten Plus More

#### E1-42 · Blocker · "Record this as ones: 10 + ? = what teen number?"
- **Where:** `TeenNumbers.tsx:205`.
- **Exact text and speech:** spoken "Record this as ones: 10 plus what number equals what teen number?" The sentence has **two unknowns**, and "as ones" points to the wrong answer. A student who types the ones (the `?`) is marked wrong; the box wants the teen number.
- **Breaks:** grade-K.md → one idea; checklist "Small words"/giveaway logic.
- **Rewrite:** show the ones: "10 + 6 = ☐. What goes in the box?"

#### E1-43 · Blocker · "Digit" is the only way to answer, and at 11 the choices match
- **Where:** `TeenNumbers.tsx:145–147` (choices); `TeenNumbersTest.tsx:80–82` (in the Module Test); also `TeenNumbers.tsx:165, 207, 224`, `TeenNumbersTest.tsx:117`.
- **Exact text:** "In the number 11, which digit tells you there's a full ten-group?" with the choices **"The tens digit (1)"** and **"The ones digit (1)"**. The voice says the same "1" for both.
- **Breaks:** grade-K.md → Not yet (*digit*); checklist "Untaught words"; MG2 removed this word.
- **Rewrite:** Practice: delete the step, or ask "16 is one ten and how many ones?". Test: "Look at 14. What does the 1 show?" with **One ten** / **One dot**. Use teen numbers from 12 up.

#### E1-44 · Major · "Equation" after Unit 1 taught "number sentence"
- **Where:** `TeenNumbers.tsx:200, 207`; `TeenNumbersTest.tsx:117, 134` (`:117` is in the Module Test).
- **Exact text:** "Record it as an equation" · "10 objects are bundled into a ten-group, and 4 more ones are added. Which equation is written correctly?"
- **Breaks:** grade-K.md → Not yet (*equation*); passive voice.
- **Rewrite:** title "Write the number sentence" · "One ten and 4 ones. Which number sentence matches?"

#### E1-45 · Major · Long "ten-group" prompts
- **Where and rewrite:**

| Line | Exact text | Rewrite |
|---|---|---|
| `TeenNumbers.tsx:140`, Test `:23` | "You have 1 full group of ten and 4 more loose ones." | "One ten and 4 ones." |
| `:163`, Test `:36` | "16 is made of 1 ten-group and how many more ones?" | "16 is one ten and how many ones?" |
| `:165` | "Does 16 include a full ten-group, or is it just 6 loose ones with no group at all?" | Delete; the step before already asks it |
| `:184`, Test `:63` | "When you say "sixteen," how many TENS are in that number?" | "Sixteen. How many tens?" |
| Test `:49` | "16 has 6 extra ones. How many objects are in the ten-group part?" | "How many dots in one ten?" |
| Test `:161` | "10 is 1 ten-group plus how many extra ones?" | "10 is one ten and how many ones?" |
| `:143, :163, :184, :188` hints | "Every teen number has exactly one ten-group — never zero, and never the whole number itself." | "Count the full boxes as one ten." / "Count the dots outside the ten." |

- **Breaks:** grade-K.md → Limits; passive; E1-06.

#### E1-46 · Minor · "Say the number to yourself" and its title
- **Where:** `TeenNumbers.tsx:178, 180`.
- **Exact text:** title "What does this teen number mean?" · "Say the number "sixteen" to yourself."
- **Breaks:** grade-K.md → one action; *mean* is a trap word.
- **Rewrite:** title "Teen numbers" · "Listen: sixteen."

### Vocabulary list

#### E1-47 · Polish · Update `vocabulary.md` after the fixes
- **Where:** `_planning/Grade-K/AdditionSubtractionAndTeenNumbersLab/vocabulary.md`. It is accurate today. Its last line is a stray `</invoke>` tag (MK1's list has one at the same spot).
- **Rewrite:** remove the tag, and the fixer updates the list when *subtract, partner, digit, equation* and the others leave the lab.

## 4. What's working well

- **All six CFUs** are one short question at a time, with a picture, typed answers, few-word feedback and a show-it. They are the model for the rest of the lab.
- **The CFU sentence frames** ("6 and how many make 10?", "One ten and 4 ones. What number is it?") are exactly right, and most of the rewrites above reuse them.
- **Star wording in Practice is honest:** the shared wrap-up only says "You got a star" when one lit up.
- **Voice handles the math well:** + − = , "?" as "what number", and "1&9" as "1 and 9" all read correctly.
- **Colors match the picture** in the named-color stories (blue and orange).

## 5. Out of my lane (for the curriculum checker)

- Many Test pictures draw the answer's parts, such as colored groups on "How many are left?"
- Explore steppers don't re-limit the second value when the first changes, so Unit 1 and 2 can exceed 10, and Unit 5 can show "5 + 2 = 7" beside "Every fact here has an answer of 5 or less."
- `addOrSubtractChoiceQuestion` can give stories past 10 (19.4% of draws).
- Unit 6's Explore opens on 14, which is the first CFU answer.
- The Unit 1 Test item on + has no picture.

## 6. Guideline gaps (proposed, not applied)

1. **`math-language-traps.md` §8:** "A digit followed by 's ("6's") is spoken '6 s'. Don't use a possessive on a number; rephrase."
2. **`checklist.md` §3, False distractors:** "Test each generated choice at 0 and at equal values. A distractor can become true, or identical to the answer, and `choice()` then silently shows one button."
3. **`checklist.md` §4:** "When a compare template fixes the names, check that the named child really has more at every value."

## 7. What I could not check

- Real iOS Safari speech. I used the lab's speech mapping, so pronunciation and pacing on an iPad are unconfirmed, including how "ate 8" and "for 10" actually sound.
- Real students.
- Explore screens were read from code and not driven in a browser. The Explore cases above come from the code's logic and values.
