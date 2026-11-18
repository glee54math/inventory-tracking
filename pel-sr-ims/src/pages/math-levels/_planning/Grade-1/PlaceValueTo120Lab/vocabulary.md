# Vocabulary — MG2 Place Value to 120

- **Level:** MG2 · **Lab:** Place Value to 120 (`PlaceValueTo120Lab`) · **Grade:** 1 (K–1 band) · **Standards:** 1.NBT.1–6
- **Written:** 2026-11-18 (first version same day, from the reviewed lab: 3 review rounds + user decisions 2026-11-17); rewritten per unit and checked against the current code. Unit order: 1 Counting to 120 → 2 Tens and Ones → 3 Comparing Numbers → 4 Ten More, Ten Less, and Adding Tens → 5 Adding Ones to a Number.
- **Assumes known from earlier labs:** see `_planning/Grade-K/CountingAndCardinalityLab/vocabulary.md`, `_planning/Grade-K/AdditionSubtractionAndTeenNumbersLab/vocabulary.md`, `_planning/Grade-K/MeasurementAndClassifyingLab/vocabulary.md`, `_planning/Grade-K/ShapesLab/vocabulary.md`, `_planning/Grade-1/AdditionAndSubtractionWithin20Lab/vocabulary.md` (count, count on, count back, count by tens, how many, more, less, the same, bigger/smaller, add, take away, + − =, total, one more / one less, ten, ones, teen number, make a ten, box ☐, "What goes in the box?").
- **Fixer:** update this list whenever a fix adds, removes or renames a taught word.

Paths below are relative to `src/pages/math-levels/MG2/PlaceValueTo120Lab/units/`.

## Unit 1: Counting to 120

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| count on / what comes next | CFU "97, 98, 99. What comes next? … Count on one more from 99." `CountingTo120.tsx:60–66` | all | From MK1/MG1 |
| one hundred, 101…120 | CFU "100 comes after 99." `:66`; "What comes after 109?" `:74–80`; "117, 118, 119…" `:107–113`; Key Idea `:553` | all | Spoken "one hundred one" |
| chart | Explore hundred chart; Look here "Explore: the chart" `:27`; Practice "Find 50 on the chart." `:444` | Explore, Practice, Test | Home title says "the hundred chart" (`MG2_PlaceValueTo120Lab.tsx:84`) |
| row ("Which row is 100 in?", "ends the row") | CFU "Which row is 100 in? … 100 ends the row 91 to 100." `:88–99`; Explore "Each row has ten numbers." `:265` | all | Rows end at 10, 20, 30… |
| box (one square of the chart) | Explore "Counting on moves one box right." `:265`; Look here "Count on one box at a time." `:27`; Practice "Count on one box." `:329` | Explore, Practice | Another meaning of *box*; see Findings |
| Next number / Jump to 99 (buttons) | Explore `:245–253` | Explore | |
| start at / start anywhere | Explore "Start at" stepper `:229`; Practice "Start anywhere" `:414`; Key Idea `:552` | Explore, Practice, Key Idea | |
| one less / count back | Practice "What number is one less than 74? … Count back one box." `:338–342` | Practice, Test `CountingTo120Test.tsx:152` | Not in CFU |
| stick (= 10) / cube (= 1) | Explore "A stick is 10. A cube is 1. 10 sticks make 100. Then count on." `:195`; picker labels "Sticks" / "Cubes" `:147`, `:160` | Explore, Practice, Test | Taught again in Unit 2 as "1 ten / 1 one" |
| 10 sticks make 100 / the big group | Explore `:195`; Practice "Count the sticks in the big group." `:494`, "The big group is 100." `:509`; Key Idea `:554` | Explore, Practice, Test | First 10 sticks drawn as one outlined group |
| a new ten | Practice title "A new ten" `:435`; Test choice "A new ten" `CountingTo120Test.tsx:208` | Practice, Test | From MK1 |
| past 100 | Practice "Past 100" `:463`, "Count past 100" `:536` | Practice | |
| **Used before taught:** a new hundred | Test "Is that a new ten or a new hundred? … From 100 to 199 is one hundred." `CountingTo120Test.tsx:207–209` | Test only | Wrong choice + hint; kept by user decision (C1-14), but "a hundred" as a span (100–199) is never taught |

## Unit 2: Tens and Ones

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| stick = 1 ten / cube = 1 one | Explore "A stick is 1 ten. A cube is 1 one." `TensAndOnes.tsx:229`; Look here `:25`; Key Idea `:431` | all | One word each; not *rod*, *unit*, *bundle* |
| ten / tens | CFU "How many tens are in 36? Count the sticks." `:54–61` | all | "1 ten" / "2 tens" agree with the number (`words.ts:6`) |
| one / ones | CFU "How many ones are in 36? Count the cubes." `:69–76` | all | Math word; never "ones" = "those" |
| make a ten (10 ones make 1 ten) | Explore "Make a ten" button `:158`, "10 ones make 1 ten." `:176`; Look here `:26` | Explore, Unit 5 | |
| count by tens | CFU "Each stick is 10. Count by tens." `:114–121` | all | From MK1 |
| 0 ones / no cubes | CFU "How many ones are in 10? … there are no cubes. That is 0 ones." `:99–106` | all | |
| teen number | Practice title "A teen number" `:341`; Test hint "1 ten and some ones is a teen number." `TensAndOnesTest.tsx:72` | Practice, Test | From MK2 Unit 6 |
| a number like 70 | Practice title "A number like 70" `:354` | Practice | Replaces *decade* |
| backwards / write the tens first | Practice diagnose "That is backwards. Write the tens first." `:382` | Practice, Test | |
| ☐ / What goes in the box? | Practice "36 = ☐ + 6. What goes in the box?" `:408` | Practice | Taught in MG1 Unit 6 |
| Build the number | Practice title `:368` | Practice | |

## Unit 3: Comparing Numbers

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| bigger (the larger number) | CFU "71 and 74. Type the bigger number. … 74 is bigger. The ones told you." `ComparingTwoDigitNumbers.tsx:70–77`; Explore "More tens? Bigger number." `:173` | all | The one word for the larger number |
| signs < = > / the open side faces the bigger number | CFU "31 ☐ 57. What goes in the box? … The open side faces the bigger number." `:55–62`; Explore `:169`; Look here "Explore: the signs" `:28` | all | Sign buttons say "this one" (`:37`) |
| is less than / is greater than / equals (spoken sign names) | CFU show "31 is less than 57." `:61`; "65 equals 65." `:106`; voice reads > as "is greater than" (`shared/tts/mathSpeech.ts:57`) | CFU, Explore, Practice, Test | Spoken names only |
| compare | Practice "Compare 42 and 45." `:339`, `:359`, `:392`; Goal `:402` | Practice, Goal, title | From MK1 |
| more tens / same tens / the ones decide / the tens told you | CFU `:74–92`; Practice "What do you look at next? … The ones decide." `:365–372` | all | |
| Number A / Number B | Explore steppers `:136–137` | Explore | |
| equal (6 tens and 5 ones = 65) | CFU "6 tens and 5 ones ☐ 65" `:100–107` | CFU, Practice | |
| **Used before taught:** biggest | Test "Which is biggest: 72, 75, 71?" `ComparingTwoDigitNumbersTest.tsx:188` | Test only | Practice never asks for the biggest of three |
| **Used before taught:** swapped | Practice title "Tens and ones swapped" `:337` | Practice | Title only; picture carries it |
| **Used before taught:** greater (as the general word) | Goal "Compare two numbers. Greater, less, or equal?" `:402` | Goal (on screen) | List rule: *bigger* is the word; *greater* only inside the spoken sign name |

## Unit 4: Ten More, Ten Less, and Adding Tens

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| 10 more / 10 less | CFU "What is 10 more than 47? Find 47. Go down one row." `TenMoreTenLess.tsx:60–66`; "What is 10 less than 12? … Go up one row." `:74–80` | all | |
| go down / go up one row | CFU `:63`, `:77`; Explore "10 more: go down one row. 10 less: go up one row." `:178` | all | |
| the ones stay the same / only the tens change | CFU `:65`, `:79`; Explore `:178–179`; Key Idea `:335` | all | |
| take away tens / tens are left | CFU "7 tens. Take away 3 tens. How many tens are left?" `:88–95`; "70 − 30 = 40." `:110` | all | *left* = still there |
| add tens / "Adding 20 is 2 tens more." | Practice title "Add tens" `:299`; show-me `:304`; Key Idea `:336` | Practice, Key Idea, Test | |
| Ten more or ten less / More / Less / Tens (pickers) | Explore `:142–156` | Explore | |
| moved by ones / move by rows | Practice diagnose "That moved by ones. Move by rows." `:241` | Practice | |

## Unit 5: Adding Ones to a Number

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| add the ones first | CFU "Add the ones first: 4 and 5." `AddingTwoDigitOneDigit.tsx:98–101`; Explore `:286`; Key Idea `:420` | all | |
| make a new ten / 10 ones make a new ten | CFU "10 of the ones make a new ten. How many tens now? … 10 cubes make a new stick." `:124–131`; Explore "Make a new ten" button `:250`, `:273`; Look here `:55` | all | The only phrase for regrouping |
| new stick | CFU `:130`; Practice show-me `:390` | CFU, Practice | |
| more than 9 / 9 or less | Explore "That is more than 9. Make a new ten." / "The ones are 9 or less." `:273` | Explore | |
| Start with / Add / See the answer / Start again (buttons) | Explore `:193–267` | Explore | |
| No new ten this time | Practice `:409` | Practice | |
| Why do you make a new ten? | Test `AddingTwoDigitOneDigitTest.tsx:174` | Test | Answer choices are counts of ones ("There are 13 ones"), so no new word is needed |

## Shell / all units

Early-learner shell (`MG2_PlaceValueTo120Lab.tsx`): "Tens, ones, and the hundred chart" / "Count to 120. Find tens and ones. Compare and add." (`:84–85`), "Solve problems by yourself. That fills your stars." (`:113`), "Answer the questions above. Then you can practice." (`:299`), "Only Mixed problems give you stars." (`:327`), "You did it! Now take the test." (`:349`), plus the shared words listed in the MK1 list (Explore / Practice / Test, Check, Enter, Erase, Show me, Look here, Mixed, Module Test). ☐ is shown as a box and spoken "blank" (user decision 2026-11-17).

## Words this lab avoids on purpose

| Avoided | Used instead | Why |
|---|---|---|
| digit, two-digit, 2-digit | "the tens" / "the ones"; titles "Comparing Numbers", "Adding Ones to a Number" | Not taught with a picture in this lab (round 2, E2-36) |
| decade, the 30s / thirties | "a number like 70"; ask by row or number | Not a 1st-grade word; "30s" is garbled by the voice |
| regroup, carry, bundle | "make a new ten" | One word per idea; *regroup* is 2nd grade |
| rod, ten-stick, unit, loose one | "stick", "cube" | One word each |
| multiple of ten | "tens", "20, 30, 40" | 4th-grade word |
| tied / break the tie | "The tens are the same." | Idiom |
| sum | "how many ones", "the total" | Sounds like "some"; teacher word first |
| greater / more (for the larger number) | "bigger" | One word per idea (E2-44); *greater* stays only in the spoken sign name |
| true or false | picture questions | No true/false in K–1 |
| blank (in text) | "box" (voice says "blank") | User decision |

## Findings

1. **"Greater" in the Unit 3 goal.** "Compare two numbers. Greater, less, or equal?" (`ComparingTwoDigitNumbers.tsx:402`) is on screen and breaks this lab's own one-word rule (*bigger*). **Fix:** "Compare two numbers. Which is bigger?"
2. **"Biggest" appears only in the Unit 3 Test** (`ComparingTwoDigitNumbersTest.tsx:188`). Practice never compares three numbers. **Fix:** add a three-number Practice item, or reword "Which one is the bigger one? 72, 75 or 71" — or keep and add *biggest* to Practice first.
3. **"Box" means a chart square in Unit 1 and the ☐ unknown in Units 2–3** (`CountingTo120.tsx:265, :329` vs `TensAndOnes.tsx:408`, `ComparingTwoDigitNumbers.tsx:55`). MG1 already uses *box* for a ten-frame cell too. **Fix:** say "one space" / "one number" on the chart ("Counting on moves one number to the right.").
4. **"A new hundred" (Unit 1 Test, `CountingTo120Test.tsx:207–209`)** uses *hundred* as a span (100–199), which no unit teaches; the hint "From 100 to 199 is one hundred" is a 2nd-grade idea. Kept by user decision C1-14; noted so later labs don't assume it was taught.
5. **"Stick" collides with MK4.** MK4 Unit 4 taught "Each stick is one side." (`MK4/ShapesLab/units/BuildingAndCombiningShapes.tsx:43`); here "A stick is 1 ten." Students who did MK4 may hear *stick* as a building straw. **Fix:** rename MK4's pieces (see MK4 list Finding 2); this lab keeps *stick*.
6. **Words needed here that no earlier lab teaches, all taught in this lab first:** *row*, *chart*, *one hundred…120*, *stick / cube* as tens/ones, *the signs < = >* and their spoken names, *10 more / 10 less*, *make a new ten*. Unit 1 already uses *stick/cube* in its "How many?" bucket, and Unit 1 Explore teaches them (`CountingTo120.tsx:195`), so they are not used before taught.
7. **Earlier labs taught several names for a ten** (MK1 *group of ten / bundle / frame*; MK2 *ten-group / full ten / loose ones*). This lab's *stick = 1 ten, cube = 1 one* is the one to keep; earlier labs should move toward "one ten" and "ones".
</invoke>
