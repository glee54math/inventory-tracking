# Vocabulary — MK2 Addition, Subtraction & Teen Numbers

- **Level:** MK2 · **Lab:** Addition, Subtraction & Teen Numbers (`AdditionSubtractionAndTeenNumbersLab`) · **Grade:** K (K–1 band) · **Standards:** K.OA.1–5, K.NBT.1
- **Written:** 2026-11-18, read from the current code (lab not yet through the review workflow). Unit order: 1 Putting Together and Taking Apart → 2 Solving Word Problems Within 10 → 3 Breaking Numbers Apart → 4 Making 10 → 5 Fast Facts Within 5 → 6 Teen Numbers as Ten Plus More.
- **Assumes known from earlier labs:** see `_planning/Grade-K/CountingAndCardinalityLab/vocabulary.md` (count, count on, how many, in all, the last number, one more, more, fewer, the same, Group A/B, row, line up, bigger/smaller, ten, group of ten, counters, dots, left = still there).
- **Fixer:** update this list whenever a fix adds, removes or renames a taught word.

Paths below are relative to `src/pages/math-levels/MK2/AdditionSubtractionAndTeenNumbersLab/units/`.

## Unit 1: Putting Together and Taking Apart

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| put together / together | CFU "Put 3 and 2 together. How many in all?" `PuttingTogetherAndTakingApart.tsx:31`; Explore "Putting together" `:126` | all | |
| + / plus | CFU "We put 3 and 1 together. Together is plus: 3 + 1 = 4." `:91`; CFU praise "Yes! 3 + 2 = 5." `:37` | all | First lab to use + |
| = | CFU praise "3 + 2 = 5" `:37` | all | Read "equals" by the voice; never explained in K (MG1 Unit 6 teaches "the same as") |
| take away / taking away | CFU "You take some away. Do you have more, or fewer? … Taking away leaves fewer." `:58–68` | all | |
| − / minus | CFU "Minus means take away." `:97`; praise "5 − 2 = 3." `:51` | all | |
| gives away / went away / left (= still there) | CFU "Mia has 5 apples. She gives 2 away. How many are left? … Count the ones left." `:44–51` | all | |
| fingers / fingers up | CFU "3 fingers and 1 finger. How many fingers?" `:75–81` | CFU, Explore, Practice, Test | |
| join / joining | Explore readout "3 and 2 JOIN together to make 5 in all." `:148`; Practice "…swim over to join them" `:178` | Explore, Practice, Test | |
| split apart / taking apart | Explore "5 splits APART into 3 and 2" `:149`; "Taking apart" `:126` | Explore, Practice | |
| number sentence | Explore "Written as a number sentence: 3 + 2 = 5." `:153–154`; Practice "Write the number sentence" `:259`, "Which number sentence matches this story?" `:266` | Explore, Practice, Test | Used by MG1 instead of *equation* |
| whole / part | Explore stepper labels "Whole group", "Part taken apart" `:141–142`; "A part is leaving the whole" `:285` | Explore, Practice, Test | |
| bigger / smaller (group) | CFU "Is the group bigger or smaller now?" `:67` | CFU | |
| faded ones | CFU "The faded ones went away." `:48` | CFU | Picture word |
| **Used before taught:** symbol ("The + symbol means…") | Explore `:153–154`; Practice `:266`, `:285`; Test `PuttingTogetherAndTakingApartTest.tsx:141` | Explore, Practice, Test | Grade-K not-yet word |
| **Used before taught:** subtract / subtracting | Key Idea "Subtracting means a group splits APART" `:301`; Goal `:297`; Test hint "Subtract the joining part from the total." `PuttingTogetherAndTakingApartTest.tsx:37` | Goal, Key Idea, Test | Never taught with a picture; the K word is *take away* |
| **Used before taught:** total | Test hint `PuttingTogetherAndTakingApartTest.tsx:37, :93` | Test | MK1 used it only in Explore/Key Idea; "in all" is the taught phrase |
| **Used before taught:** true / false | Test `PuttingTogetherAndTakingApartTest.tsx:157` | Test only | |

## Unit 2: Solving Word Problems Within 10

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| story / how many now | CFU "Jen has 3 stickers. She gets 2 more. How many does she have now?" `WordProblemsWithin10.tsx:28` | all | |
| gets / ate / gave away / are left | CFU `:28–48`; Practice `:212`, `:233` | all | |
| both colors / all together (in the jar) | CFU "Count every marble in the jar, both colors." `:55–62` | all | |
| who has more / line them up / extras / longer row | CFU "Mia has 5 apples. Theo has 3 apples. Who has more? … Line them up. Mia's row has extras." `:69–89` | CFU, Practice, Test | |
| Add to / Take from / Put together / Missing part / Compare (story types) | Explore "Story type" picker `:116–124`; Practice titles "An 'add to' story" `:210` | Explore, Practice | Names shown as labels |
| add / Add or Subtract | Practice "Does this story ADD or SUBTRACT?" `:217`, choices "Add" / "Subtract" `:218–219` | Practice, Test | *Subtract* is a choice the student must read; see Findings |
| the rest / one color, another color | Practice "…and the rest are another color. How many are the OTHER color?" `:278` | Practice, Test | |
| **Used before taught:** how many more … than (compare difference) | Practice "How many more apples does Mia have than Theo?" `:177`, `:305`; Test `WordProblemsWithin10Test.tsx:127, :151` | Explore, Practice, Test | Compare problems are 1st grade (grade-K.md) |
| **Used before taught:** difference / gap | Explore "there's no difference to find… finding the gap" `:179`; Practice "Adding the difference back always closes the gap." `:323`; Test `WordProblemsWithin10Test.tsx:171` | Explore, Practice, Test, Key Idea `:341` | Grade-K not-yet word |
| **Used before taught:** total, starting amount, combined total, coexist | Explore `:161`, `:168`; Practice hints `:215`, `:261`, `:281` | Explore, Practice, Test | |
| **Used before taught:** equal ("they'd be equal") | Practice `:323`; Test `WordProblemsWithin10Test.tsx:172` | Practice, Test | |
| **Used before taught:** true / false | Practice `:283`; Test `WordProblemsWithin10Test.tsx:99` | Practice, Test | |

## Unit 3: Breaking Numbers Apart

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| 7 is 4 and how many more? / N is A and B | CFU "7 is 4 and how many more? … Yes! 7 is 4 and 3." `DecomposingNumbers.tsx:30–36` | all | |
| another way / more than one way | CFU "Here is another way. … There is more than one way." `:43–54`, `:61–71` | all | |
| split / two parts / the same / each part | CFU "Split 8 into two parts that are the same. How many in each part?" `:78–85` | all | |
| break apart | Explore "Number to break apart" `:109`; Practice "Break it apart" `:162` | Explore, Practice, Test | Not said in CFU |
| first part / second part | Explore slider "First part" `:120`; Practice "If the first part is 3, what is the second part?" `:167` | Explore, Practice, Test | |
| equal parts | Explore "both parts are EQUAL" `:139`; Practice "Break it into equal parts" `:239` | Explore, Practice, Test | First use of *equal* with a picture |
| different way / same way | Practice "Find a different way" `:213`, choices `:227–228` | Practice | |
| bottom row / blue / orange dots | CFU `:52–53` | CFU | |
| **Used before taught:** pairs | Explore "different pairs" `:232`; Practice hint `:169`, `:197`; Test `DecomposingNumbersTest.tsx:33` | Explore, Practice, Test | |
| **Used before taught:** valid, decomposing / decomposition | Explore "that's still a valid way!" `:139`; Key Idea `:262–263`; Test choice "Yes, it's a valid way" `DecomposingNumbersTest.tsx:87` | Explore, Key Idea, Test | *Decompose* is a grade-K not-yet word |
| **Used before taught:** add up to, whole number | Practice hint `:167`, `:224` | Practice, Test | |
| **Used before taught:** true / false | Practice `:246`; Test `DecomposingNumbersTest.tsx:103, :119, :152` | Practice, Test | |

## Unit 4: Making 10

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| N and how many make 10? | CFU "6 and how many make 10? … Count the empty boxes." `MakingTen.tsx:25–31` | all | |
| empty boxes / full / every box | CFU "Watch: the empty boxes fill in." `:30`; "Is every box full?" `:56` | CFU, Practice, Test | *box* = ten-frame cell |
| make 10 / exactly 10 | CFU `:25`, `:47` | all | |
| Yes / No (does this pair make 10?) | CFU "Do 5 and 4 make 10?" `:47–57` | CFU, Practice, Test | |
| partner / partner for 10 | Explore "Reveal the partner for 10", "6's partner for 10 is 4" `:106–109`; Practice "Find the partner for 10" `:136`; tab "Partners for 10" `:209` | Explore, Practice, Test | Grade-K not-yet word; the CFU avoids it |
| frame ("fill the frame to 10") | Explore `:109` | Explore | |
| **Used before taught:** ten frame | Practice hint "Count the empty boxes left in the ten frame." `:142`; Test `MakingTenTest.tsx:18, :44, :163` | Practice, Test | Picture never named in CFU/Explore |
| **Used before taught:** complement, recall, double the number | Test hints `MakingTenTest.tsx:31, :59, :94–97` | Test only | |
| **Used before taught:** true / false | Test `MakingTenTest.tsx:111` | Test only | |

## Unit 5: Fast Facts Within 5

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| fast fact / fact | Explore "Try to just KNOW this fact instantly" `FastFactsWithin5.tsx:143`; Practice title "Fast fact: addition" `:190` | Explore, Practice, Test | |
| double / doubles | CFU "Double 2 is 4. … That is a double." `:62–63`; Explore `:155` | CFU, Explore, Practice, Test | |
| missing part / missing number | CFU "5 in all. 1 is blue. How many are orange? … the missing part is less than 5" `:74–77`; Practice "What number is missing?" `:260` | all | |
| ? (unknown) | Practice "2 + ? = 5." `:257` | Practice, Test | MG1 uses ☐ instead |
| Addition / Subtraction (picker) | Explore "Fact type" `:107–114`; Practice "Fast fact: addition / subtraction" `:190`, `:211` | Explore, Practice | |
| **Used before taught:** addend ("Missing addend") | Explore picker `:114`; Practice title "Fast fact: missing addend" `:255`; Key Idea `:279` | Explore, Practice, Key Idea | Grade-1 teacher word (grade-1.md) |
| **Used before taught:** difference, families | Practice hint "Subtraction and addition facts come in families — the difference plus…" `:219` | Practice | |
| **Used before taught:** "Which addition fact matches this subtraction fact?" | Practice `:219`; Test `FastFactsWithin5Test.tsx:67` | Practice, Test | 1.OA.4 idea in K |
| **Used before taught:** "on the right of the = sign" | Test hint `FastFactsWithin5Test.tsx:133` | Test | *right* = side; and the hint is not true for "5 = 2 + 3" forms |
| **Used before taught:** speed / instantly | Explore `:165`; Key Idea `:278` | Explore, Key Idea | |

## Unit 6: Teen Numbers as Ten Plus More

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| one ten / full ten | CFU "One ten and 4 ones. What number is it? … Start at 10 for the full ten." `TeenNumbers.tsx:29–36` | all | |
| ones (= single cubes) | CFU "16 is one ten and how many ones? … Count the ones outside it." `:50–57` | all | Math sense of *ones*; MG2 builds on it |
| ten and N more ("16 is ten and 6") | CFU `:36`, `:57`, `:75` | all | |
| backwards ("Write the ten first") | CFU `:34`, `:74` | CFU, Practice, Test | |
| teen number | Practice "Build a teen number" `:138`; tab "Teen Numbers" `:232` | Practice, Test, title | Taught through the CFU picture; word itself not explained |
| ten-group / group of ten / loose ones / extra ones | Explore "1 full ten-group and N extra ones" `:112`; Practice "1 full group of ten and N more loose ones" `:140` | Explore, Practice, Test | Several names for one ten; see Findings |
| bundled | Key Idea "ONE bundled group of ten" `:223`; Test `TeenNumbersTest.tsx:117` | Key Idea, Test | Grade-1 not-yet word |
| **Used before taught:** digit / tens digit / ones digit / first digit | Practice "which digit tells you there's a full ten-group?", choices "The tens digit (1)" / "The ones digit (6)" `:145–147`; `:165`, `:207`; Key Idea `:224`; Test `TeenNumbersTest.tsx:80, :117` | Practice, Key Idea, Test | Grade-K not-yet; the choice can't be read without it |
| **Used before taught:** equation / record | Practice "Record it as an equation" `:203`, "Which equation is written correctly?" `:207`; Test `TeenNumbersTest.tsx:117, :134` | Practice, Test | Grade-K not-yet; Unit 1 taught *number sentence* |
| **Used before taught:** stand for, regardless | Test `TeenNumbersTest.tsx:49, :80` | Test | |
| **Used before taught:** true / false | Test `TeenNumbersTest.tsx:96` | Test only | |

## Shell / all units

Same shell words as MK1 (see that list), from `MK2_AdditionSubtractionAndTeenNumbersLab.tsx:45–473`. Home text "…find partners for 10, learn your fast facts, and see teen numbers as ten and some more." (`:85`) — *partners* on the home screen. "30 cumulative questions" (`:120`).

## Words this lab avoids on purpose

No review folder exists for MK2. Visible in code: the CFUs avoid *partner* ("6 and how many make 10?" `MakingTen.tsx:25`), *decompose* ("7 is 4 and how many more?" `DecomposingNumbers.tsx:30`) and *digit* ("One ten and 4 ones" `TeenNumbers.tsx:29`). Explore, Practice, Key Ideas and Tests still use them.

## Findings

1. **Untaught later-grade words the student must read to answer.** *digit / tens digit / ones digit* (choices `TeenNumbers.tsx:146–147`; `:145`, `:165`, `:207`; Test `TeenNumbersTest.tsx:80, :117`); *equation* (`TeenNumbers.tsx:203, :207`; Test `:117, :134`); *addend* (`FastFactsWithin5.tsx:114, :255, :279`); *partner* (`MakingTen.tsx:106–149`, tab `:209`, home `:85`); *decompose / valid* (`DecomposingNumbers.tsx:139, :262`; Test `:87`); *difference* (`WordProblemsWithin10.tsx:179, :323`; `FastFactsWithin5.tsx:219`); *symbol* (`PuttingTogetherAndTakingApart.tsx:153–154`, Test `:141`). All are grade-K not-yet or grade-1 teacher words. **Fix:** "Which one means the ten? The 1 / The 6" with the ten-frame pointed; "number sentence"; "missing number"; "N and how many make 10?"; "another way"; "how many extras"; drop *symbol*.
2. **"Subtract" is never taught.** It is a two-button choice ("Does this story ADD or SUBTRACT?" `WordProblemsWithin10.tsx:217–241`; Test `WordProblemsWithin10Test.tsx:51–57`) and in hints (`PuttingTogetherAndTakingApartTest.tsx:37`; `WordProblemsWithin10.tsx:237, :281, :321`). Unit 1 teaches *take away* and *minus*. MK3 and MG1 then rely on *take away*. **Fix:** choices "Add" / "Take away".
3. **"Ten frame" is used in hints but never named.** `MakingTen.tsx:142`; Test `MakingTenTest.tsx:18, :44, :163`. MG1 also never names it ("Fill the ten", "empty boxes"). **Fix:** say "Count the empty boxes." (CFU wording), or name it once in Explore with the picture.
4. **Compare-difference stories ("How many more … than …?") in a K lab.** `WordProblemsWithin10.tsx:177, :305, :321`; Test `WordProblemsWithin10Test.tsx:127, :151, :170`. Compare problems are 1st grade (grade-K.md; taught in MG1 Unit 4). **Fix:** keep the CFU form "Who has more?" and drop the how-many-more buckets, or mark them optional.
5. **Same idea, many names.** One ten: *ten / full ten / ten-group / group of ten / bundled group* (`TeenNumbers.tsx:29, :112, :140, :223`); MK1 adds *bundle / frame*, MG2 uses *stick / 1 ten*. Missing unknown: `?` here (`FastFactsWithin5.tsx:257`), ☐ "box" in MG1/MG2. Combine: *put together / join / add / plus*. **Fix:** "one ten" + "ones" everywhere (the CFU words), and introduce ☐ the way MG1 Unit 6 does if a box is shown.
6. **"=" is never explained in K.** Used from the first CFU (`PuttingTogetherAndTakingApart.tsx:37`); the only explanation is MG1 Unit 6. A Test hint even says "The total always goes on the right of the = sign." (`FastFactsWithin5Test.tsx:133`), which MG1 Unit 6 teaches is not so. **Fix:** delete that hint; optionally add one Explore line "= means the same as."
7. **True/false in every unit** (Practice `WordProblemsWithin10.tsx:283`, `DecomposingNumbers.tsx:246`; Tests `PuttingTogetherAndTakingApartTest.tsx:157`, `WordProblemsWithin10Test.tsx:99`, `DecomposingNumbersTest.tsx:103, :119, :152`, `MakingTenTest.tsx:111`, `TeenNumbersTest.tsx:96`). **Fix:** one new picture example per item.
8. **Test-only words:** *complement, recall* (`MakingTenTest.tsx:31, :94–97`), *stand for, regardless* (`TeenNumbersTest.tsx:49, :80`). **Fix:** remove from hints/choices.
</invoke>
