# Vocabulary — MK1 Counting & Cardinality

- **Level:** MK1 · **Lab:** Counting & Cardinality (`CountingAndCardinalityLab`) · **Grade:** K (K–1 band) · **Standards:** K.CC.1–7
- **Written:** 2026-11-18, read from the current code (lab not yet through the review workflow; see `_planning/reviews/LAB_STATUS.md`). Unit order: 1 Counting On and Counting Forward → 2 Writing and Matching Numerals → 3 How Many? → 4 Comparing Groups and Numerals.
- **Assumes known from earlier labs:** none. This is the first lab. Known on arrival (grade-K.md): some number words by ear, *big / little*, *more* ("I want more").
- **Fixer:** update this list whenever a fix adds, removes or renames a taught word.

Paths below are relative to `src/pages/math-levels/MK1/CountingAndCardinalityLab/units/`. "CFU" = the KCheck questions at the top of each unit file; "Explore" = the `Explore` component; "Practice" = the generators; "Key Idea" / "Goal" = the `Unit` export.

## Unit 1: Counting On and Counting Forward

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| count / count on | CFU "40 comes before 49. Count on." `CountingOnAndForward.tsx:79`; "Start at 38. Count on 3 more." `:89`; Explore "Say the next number" button `:154` | CFU, Explore, Practice, Test | |
| what comes after / next number / right after | CFU "What comes after 29?" `:46`; Practice "What number comes right after…?" `:217` | all | "after" = next in the count |
| start at | Explore stepper "Start at" `:139`; CFU `:89` | CFU, Explore, Practice | |
| count by ones / count by tens | CFU "Count by ONES… Now count by TENS." `:49`, `:56`; Explore "Count by" Ones/Tens `:128–136` | CFU, Explore, Practice, Test | |
| ten / a new ten ("30 starts a new ten") | CFU `:46`, `:82`; Explore "You just started a brand new ten!" `:174` | CFU, Explore, Practice, Test | |
| group(s) of ten | Explore readout "…group(s) of ten and N more" `:180`; Practice "How many groups of ten is N?" `:322` | Explore, Practice, Test | Picture: TenGroups frames |
| dots | Practice/Explore pictures ("Count the dots") `:206` | Explore, Practice, Test | |
| counter(s) | Practice "There are N counters, all bundled…" `:243` | Practice | Explore says "dots"; Unit 2 CFU names "counters" with a picture |
| one less / count back | Practice "What number is one less than N? … Look at the dot with the X. Count back one." `:386–401` | Practice, Test `CountingOnAndForwardTest.tsx:133` | Not in CFU or Explore |
| **Used before taught:** + and = signs | Practice show-me "${before} + 1 = ${n}" `:220`, `:228`, `:268`, `:278`, `:316`; Test `CountingOnAndForwardTest.tsx:28, :47, :67, :115` | Practice, Test | Signs are first taught in MK2 Unit 1 |
| **Used before taught:** bundle(d) / bundles | Explore "every ten dots makes a new bundle" `:181`; Practice `:243`; Test hint "Count the bundles" `CountingOnAndForwardTest.tsx:172` | Explore, Practice, Test | Grade-1 "not yet" word (say "make a new ten") |
| **Used before taught:** frame(s) | Practice hint "Each full frame is ten. Count the frames" `:323` | Practice | The picture is never named |
| **Used before taught:** the 20s / the 30s (decade labels) | Practice "which ten did you just start?" choices "the 30s" `:361–372`; Key Idea `:440`; Test `CountingOnAndForwardTest.tsx:14, :89–91` | Practice, Test, Key Idea | "Decade / the 30s" is on the grade-1 not-yet list; voice garbles "30s" |
| **Used before taught:** sequence | Test "Which sequence correctly counts forward four numbers…" `CountingOnAndForwardTest.tsx:194` | Test only | |
| **Used before taught:** true / false | Test "True or false: every time you count from a number ending in 9…" `CountingOnAndForwardTest.tsx:150` | Test only | No true/false in K–1 |

## Unit 2: Writing and Matching Numerals

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| numeral | CFU "How many? Type the numeral." `WritingAndMatchingNumerals.tsx:42`; Explore "the numeral written for that count is…" `:157`; Key Idea `:413` | all | Grade-K lists *numeral* as "not yet"; see Findings |
| counters | CFU "Yes! 5 counters. We write 5." `:48` | all | |
| type / write (a number) | CFU "Type the numeral." `:42`; Practice "How many? Write it." `:302` | CFU, Practice, Test | "Write" means type on the pad |
| tap | CFU "Count the dots. Tap the numeral." `:55` | all | |
| look-alike / turn upside down | CFU "That is 9. A 6 has its circle at the bottom." `:61`; Explore "Turn the 6 upside down" `:170`, "Numeral look-alikes" `:163` | CFU, Explore, Test | |
| backwards / the right way | Practice "Which one is written the right way? … The other one is backwards." `:382–396` | Practice, Test | Number strip picture `:204–206` |
| number word ("seven") | Explore "The word for 7 is 'seven'" `:157`; Practice "Write the numeral for the number word…" `:279`; matchWords `:242–262` | Explore, Practice, Test | Voiced on tap (`:261`) |
| match | Practice "Match the words" `:242`; "Which numeral matches?" `:364` | Practice | |
| fewer / one fewer | CFU "Now one FEWER. How many?" `:99`; "The one with the X goes away. Count the ones left." `:105` | CFU, Practice `:331` | First use of *fewer*; Unit 4 teaches it as a comparison |
| one more | Practice "What numeral is one MORE than N? Look at the box with the question mark." `:289` | Practice, Test `:160` | |
| left (= still there) | CFU "Count the ones left." `:105–106` | CFU, Practice | Only meaning in this lab |
| Line / Grid / Scattered | Explore "Arrangement" picker `:139` | Explore | |
| **Used before taught:** symbol | Explore "the numeral is the SYMBOL, not the word" `:157`; Key Idea `:413`; Test hint "Think of the symbol, not the word" `WritingAndMatchingNumeralsTest.tsx:25` | Explore, Key Idea, Test | Grade-K not-yet word |
| **Used before taught:** teen numbers, digits | Test hint "Teen numbers are written as two digits." `WritingAndMatchingNumeralsTest.tsx:37` | Test only | *Teen* is taught in MK2 Unit 6; *digit* in no K lab |
| **Used before taught:** true / false | Test `WritingAndMatchingNumeralsTest.tsx:141` | Test only | |

## Unit 3: How Many? (Cardinality and Counting Objects)

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| how many / how many in all | CFU "How many in all? … The last number you say tells how many." `HowManyCardinality.tsx:37–43` | all | |
| the last number you say | CFU `:43`; Explore "That's 8 in all — the LAST number you said!" `:174` | all | |
| in all | CFU `:37` | all | |
| count again / moved ("We moved them!") | CFU "We moved them! How many now? … Moving them does not change how many." `:63–70` | CFU, Practice `:269` | |
| added / took away (spoken in feedback) | CFU "Nobody added any or took any away." `:67–68` | CFU, Practice | Everyday sense only; taught as math in MK2 |
| circle (counters in a ring) / go around | CFU "Count around the circle." `:77–84` | CFU, Explore, Practice, Test | Shape name *circle* is taught in MK4 |
| one more / joins | CFU "One more joins. How many now?" `:104–110` | CFU, Practice, Test | K.CC.4c |
| count out / give to your friend | Practice "Tap 6 counters to give to your friend." `:336`; "You counted out 6." `:339` | Practice, Test | Not in CFU |
| row ("Count the top row first") | Practice hint `:311` | Practice | Taught as a picture word in Unit 4 |
| total | Explore "counting correctly always gives the same total" `:189`; Key Idea `:367` | Explore, Key Idea, Test | Never said in CFU; "in all" is the taught phrase |
| mixed up | Practice "How many? They are all mixed up." `:262` | Practice | |
| **Used before taught:** arrangement | Explore picker label "Arrangement" `:151`; text `:189`; Key Idea `:367` | Explore, Key Idea | |
| **Used before taught:** cardinality | Unit title "How Many? (Cardinality and Counting Objects)" `:361` | Title | Grade-K not-yet word |
| **Used before taught:** double-count, exact same | Test hint `HowManyCardinalityTest.tsx:31`, `:90` | Test | |
| **Used before taught:** true / false | Test `HowManyCardinalityTest.tsx:147` | Test only | |

## Unit 4: Comparing Groups and Numerals

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| more | CFU "Which group has MORE?" with the same-count trap `ComparingGroupsAndNumerals.tsx:123–130` | all | Bold MORE (groupWords.tsx) |
| fewer | CFU "Which group has FEWER? … cross out one from each group. Group B runs out first." `:150–157` | all | |
| the same | CFU choice "The same" `:127`; "Both have 6." `:130` | all | |
| Group A / Group B | CFU `:137`, TwoGroups diagram `TwoGroups.tsx:68` | all | Colored --qa / --qb |
| Grid group / Scattered group, spread out, lined up | CFU `:124–130` | CFU, Practice, Test | |
| cross out / runs out first | CFU `:153`; Practice "Cross out one from each group until one group runs out." `:409` | CFU, Practice | |
| bigger / smaller (numbers) | CFU "Which number is bigger? … Later is bigger." `:164–175`; Practice "Which number is BIGGER/SMALLER?" `:489` | CFU, Practice, Test | The comparison word for numbers |
| later / comes before / comes after (when you count) | CFU `:174`; Practice `:365–366` | CFU, Practice | |
| count on | CFU "Count on: 9, 10. 10 is more." `:211` | CFU | From Unit 1 |
| close ("They are close, so we count.") | CFU `:215` | CFU, Practice, Test | |
| more than / fewer than / the same as | Explore readout `:236`, `:263`; Key Idea `:518` | Explore, Key Idea | |
| compare | Practice "Count and compare" `:344`; "Compare the numbers" `:465` | Practice, Test, title | Not in CFU |
| row / Top row / Bottom row / line them up | Practice "Line up the two rows. Whichever row runs out first has fewer." `:310–315` | Practice, Test | |
| dotted circles (the extras) | Practice "Look for the dotted circles." `:320` | Practice, Test | |
| less | CFU wrong-pick "Look for the group with less." `:156` | CFU | Same idea as *fewer* in the same question |
| **Used before taught:** how many more (difference between groups) | Practice "How many MORE does the top row have…?" `:326`, `:408`; Test `ComparingGroupsAndNumeralsTest.tsx:105` | Practice, Test | Compare-difference stories are 1st grade (grade-K.md Word problems "Not yet: compare problems") |
| **Used before taught:** − and = signs | Practice show-me "${more} − ${fewer} = …" `:330`; Test `ComparingGroupsAndNumeralsTest.tsx:107` | Practice, Test | Counting lab: builder rule "words, not equations" |
| **Used before taught:** difference, clearly | Practice wrap-up "a difference of 4" `:415` | Practice | Grade-K not-yet word |
| **Used before taught:** amount, equal amounts, stands in for | Explore `:263`; Key Idea `:518–519`; Test `ComparingGroupsAndNumeralsTest.tsx:245` | Explore, Key Idea, Test | |
| **Used before taught:** true / false | Test `ComparingGroupsAndNumeralsTest.tsx:244` | Test only | |

## Shell / all units

| Word or phrase | Where | Notes |
|---|---|---|
| Explore / Practice / Test (tabs) | `MK1_CountingAndCardinalityLab.tsx:275–282` | "Read the tab names" button voices them |
| Check for Understanding | each unit's Explore button | Long phrase; KCheck header says "Show what you know!" (`shared/components/KCheck.tsx:353`) |
| Check / Enter / Erase / Done | KCheck + NumberPad (`shared/components/NumberPad.tsx:34–49`) | |
| Not yet / Yes! / Watch and listen | every CFU | Fixed feedback words |
| Show hint / Show me / Show answer / Look here | `shared/engine/StepProblem.tsx:530–650` | |
| mastery stars / star | shell `:45`, `:113`, `:321` | |
| Mixed / Problem type / Try one like it / New problem / Next problem | shell `:309–321` | "Only Mixed problems count." |
| mastered / Take the test / Go to the next unit | shell `:343–356` | |
| Module Test / cumulative questions / Best test score / out of | shell `:119–137`, `:462–463` | "cumulative" is not a K word |
| Units / Your path / Reset progress / Completed | shell `:95`, `:417–454` | |
| Start exploring / Continue | shell `:87` | |
| Standard (K.CC.4a-c…) | shell `:262` | Teacher text shown on screen |
| Counting & Cardinality (lab name), "1, 2, 3... how many?" | shell `:84`, `:419` | *Cardinality* again |
| Retake test / Question N of 10 / Finish test | `shared/engine/UnitTest.tsx:175–215` | |

## Words this lab avoids on purpose

No review folder exists for MK1, so no deliberate word choices are recorded. One choice is visible in code: comparison words are *more / fewer / the same* and *bigger / smaller* for numbers, not *greater than / less than* (grade-K.md: "save greater for later"), and the bold MORE / FEWER coloring in `groupWords.tsx:18`.

## Findings

1. **Signs before they are taught.** + − = appear in Unit 1 and Unit 4 Practice show-me lines and Tests (`CountingOnAndForward.tsx:220, :228, :268, :278, :316`; `ComparingGroupsAndNumerals.tsx:330`; Tests listed above). MK2 Unit 1 is the first place + − = are taught, and the builder rule says counting labs use words, not equations. **Fix:** say it in words: "One more than 29 is 30." / "Count the dotted circles: 1, 2, 3. That is 3 more."
2. **Later-grade words.** *bundle* (`CountingOnAndForward.tsx:181, :243`, Test `:172`) and *the 20s / the 30s* (`:361–372`, Key Idea `:440`, Test `:14, :89–91`) are on the grade-1 not-yet list (MG2 replaced them). *symbol* (`WritingAndMatchingNumerals.tsx:157, :413`, Test `:25`), *cardinality* (title `HowManyCardinality.tsx:361`, lab name), *difference* (`ComparingGroupsAndNumerals.tsx:415`), *digits* (Test `WritingAndMatchingNumeralsTest.tsx:37`) are grade-K not-yet words. **Fix:** "a new ten", "Which ten did you start? 30, 40…", drop *symbol*, title "How Many?", "4 more", drop the teen/digits hint.
3. **"Numeral" is the unit's own word but grade-K.md lists it as not yet.** It is in the Unit 2 title, CFU prompts ("Type the numeral." `WritingAndMatchingNumerals.tsx:42, :55, :83`) and the Unit 4 title. **Fix (decide):** either add *numeral* to grade-K "New in K (teach with a picture)" since K.CC.3 needs it and the Explore pairs it with dots and the word, or say "number" in student text ("Type the number.").
4. **Teen numbers and digits in a Test hint.** "Teen numbers are written as two digits." (`WritingAndMatchingNumeralsTest.tsx:37`). *Teen* is first taught in MK2 Unit 6; *digit* in no K lab. **Fix:** "Write a 1. Then write the ones." or "Count the dots. Type the number."
5. **"How many more" compare questions in a K lab.** `ComparingGroupsAndNumerals.tsx:326, :408`, Test `:105`. Compare-difference problems are 1st grade (grade-K.md). The dotted-circle picture makes it countable, but the wording is the 1.OA compare form. **Fix:** "Count the dotted circles." as the prompt, or keep as a picture-only step and drop the "− =" show-me.
6. **True/false questions in every unit Test** (`CountingOnAndForwardTest.tsx:150`, `WritingAndMatchingNumeralsTest.tsx:141`, `HowManyCardinalityTest.tsx:147`, `ComparingGroupsAndNumeralsTest.tsx:244`). K–1 rule: no true/false. **Fix:** ask about one new example with a picture (as MG1 did).
7. **Same idea, more than one word.** *one less* (Unit 1 `CountingOnAndForward.tsx:394`) and *one fewer* (Unit 2 `WritingAndMatchingNumerals.tsx:99`) for the same step; *fewer* and *less* in one CFU question (`ComparingGroupsAndNumerals.tsx:150–157`); *group of ten / bundle / frame / ten* for one ten (`CountingOnAndForward.tsx:180, :181, :323, :46`); *in all / total* for how many. **Fix:** pick *fewer* for groups (K word), *one less* only in number-line counting back; pick *a ten / group of ten* and drop *bundle* and *frame*.
8. **Words used only in Tests or untaught labels:** *sequence* (`CountingOnAndForwardTest.tsx:194`), *arrangement* (Explore picker `HowManyCardinality.tsx:151`), *double-count* (`HowManyCardinalityTest.tsx:31`), *cumulative* (shell `:120`). **Fix:** "Which one counts the right way?", label "Look", "count one twice", "questions from all units" (MG1/MG2 shell wording).
9. **Shape word before MK4.** *circle* (counters in a ring, `HowManyCardinality.tsx:77, :281`) is used as a layout before MK4 teaches circle; the picture carries it, so this is low risk.
</invoke>
