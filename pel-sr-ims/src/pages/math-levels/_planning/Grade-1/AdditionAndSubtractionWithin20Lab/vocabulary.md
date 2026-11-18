# Vocabulary — MG1 Addition & Subtraction Within 20

- **Level:** MG1 · **Lab:** Addition & Subtraction Within 20 (`AdditionAndSubtractionWithin20Lab`) · **Grade:** 1 (K–1 band) · **Standards:** 1.OA.1–8
- **Written:** 2026-11-18, read from the current working-tree code (reviewed 3 rounds 2026-11-17; uncommitted review changes included). Unit order: 1 Counting On and Counting Back → 2 Making Ten → 3 Add To and Take From Stories → 4 Put Together and Compare Stories → 5 Fast Facts to 20 → 6 Equal Sign and Number Sentences.
- **Assumes known from earlier labs:** see `_planning/Grade-K/CountingAndCardinalityLab/vocabulary.md`, `_planning/Grade-K/AdditionSubtractionAndTeenNumbersLab/vocabulary.md`, `_planning/Grade-K/MeasurementAndClassifyingLab/vocabulary.md`, `_planning/Grade-K/ShapesLab/vocabulary.md` (count, count on, how many, in all, more, fewer, the same, bigger/smaller, add, take away, plus, minus, + − =, number sentence, part, whole, the rest, story, left = still there, line them up, extras, split, ten, ones, teen number, empty boxes, make 10, double).
- **Fixer:** update this list whenever a fix adds, removes or renames a taught word.

Paths below are relative to `src/pages/math-levels/MG1/AdditionAndSubtractionWithin20Lab/units/`. "Look here" = the CFU pointer line (`say`) spoken on the 2nd miss.

## Unit 1: Counting On and Counting Back

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| count on (to add) | CFU "8 + 3. Count on. Where do you start? … Don't start at 1." `CountingOnAndBack.tsx:64–71`; Explore "Count on to add" `:193` | all | From MK1; here it means adding |
| start at (the number you have) | CFU `:64–71`; Look here "Start at the number you have." `:25`; Key Idea `:475` | all | |
| land / where do you land | CFU "Count on 3 from 8. Where do you land?" `:79–86` | CFU, Practice, Test | |
| hop / one hop for each | CFU "Say one number for each hop." `:83`; Look here "One hop for each one you take away." `:29`; number-line picture `:32–52` | CFU, Explore, Test | The number line is never named |
| start at the bigger number | CFU "3 + 7. Where do you start? … Start at 7. It is bigger." `:96–103`; Key Idea `:475` | all | |
| count back (to take away) | CFU "12 − 3. Count back 3 from 12. Where do you land?" `:111–118`; Explore "Count back to take away" `:194` | all | |
| times ("count back 4 times") | CFU "13 − 4. How many times do you count back? … Count back 4 times." `:126–137` | CFU, Explore, Practice, Test | |
| Count one more / Count one back (buttons) | Explore `:214` | Explore | |
| Direction | Explore picker label `:186` | Explore | |
| below 10 ("You will go below 10.") | Practice title `:465`; Test `CountingOnAndBackTest.tsx:158` | Practice, Test | Picture: number line crossing 10 |
| total ("What is the total?") | Test `CountingOnAndBackTest.tsx:26` | Test | Known from MK2 |

## Unit 2: Making Ten

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| break apart (the smaller number) | CFU "6 + 9. Which number do you break apart? … Keep 9 whole. Break apart 6." `MakingTenAndDecomposing.tsx:97–104`; Explore `:285` | all | User rule: always break apart the smaller |
| keep (the bigger number) whole | CFU `:101–104`; Explore `:285`; Key Idea `:642` | all | |
| closer to 10 | Look here "Which number is closer to 10?" `:27`; Explore `:285` | Explore, Practice, Test | |
| fill the ten / make a ten / making ten | CFU "Fill the ten first. Then add the rest." `:142–145`; "7 + 5. Make a ten." `:154`; Explore picker "Making ten" `:246` | all | |
| empty boxes | CFU "8 + 6. How many more does 8 need to make 10? Count the empty boxes." `:112–119` | CFU, Practice | *box* = ten-frame cell; see Findings |
| the rest / add the rest | CFU `:142–145` | all | |
| number bond / whole / parts | Explore "This is a number bond. The top is the whole. The two circles are its parts." `:303` | Explore | Picture: `../diagrams/PartPartWhole.tsx`; not used again by name |
| get to 10 first / past 10 | CFU "13 − 5. Get to 10 first. How many do you take away first? … How many are past 10?" `:170–177`; Explore "Get to 10 first" `:247`, `:334` | all | |
| take away the rest | CFU "3 are gone. Take away the rest of the 5." `:198–201` | CFU, Practice, Test | |
| same total / move one over / gets bigger, gets smaller | Explore "Same total" `:248`; "Move one over. The total stays the same." `:386–394`; Practice `:590–608` | Explore, Practice, Test | |
| Bigger number / Smaller number (stepper labels) | Explore `:271–272` | Explore | |
| **Used before taught:** ☐ / "What number goes in the box?" | Practice `:597`, `:600`; Test `MakingTenAndDecomposingTest.tsx:162, :189` | Practice, Test | Taught in Unit 6 Explore (`EqualSignAndEquations.tsx:451`); here *box* also means a ten-frame cell |

## Unit 3: Add To and Take From Stories

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| start / change / end (of a story) | CFU "Sam had 6 apples. He picked 5 more. What is missing? … the story tells the start and the change. The end is missing." `AddToTakeFromWordProblems.tsx:65–72`; StoryStrip picture `../diagrams/StoryStrip.tsx:23`; Key Idea `:551` | all | Replaced *starting amount / result* (review) |
| missing ("What is missing?") | CFU `:65`, `:110`, `:125`; Explore `:287–293` | all | |
| at the start | CFU "How many stickers did Leo have at the start?" `:140` | CFU, Practice, Test | Start-unknown stories |
| add back | Practice "To find the start, add them back." `:533`; Explore `:169` | Explore, Practice, Test | |
| Add To / Take From (story names) | Explore "This is an Add To story." `:283`; toggle `:264` | Explore, title | |
| went up / went down | Explore `:283`; Practice "Did it go up or down?" `:360` | Explore, Practice, Test | |
| matches the story | Practice "Which one matches the story?" `:360` | Practice, Test | Choices are number sentences with ☐ (`:388`) |
| have left / are left | Practice `:468`, `:480` | Practice, Test | *left* = still there only |
| picked, lost, got, gave away (story verbs) | CFU `:65`, `:110`, `:125`; pools `:330–334` | all | Past/base verb pools (`verbAdd` / `verbAddBase`) |
| **Used before taught:** ☐ in the choices | Practice "Which one matches the story?" choices "6 + 5 = ☐" `:388`, `:415`, `:440`, `:477`, `:504`, `:529`; Test `AddToTakeFromWordProblemsTest.tsx:300–312` | Practice, Test | ☐ is taught in Unit 6 |

## Unit 4: Put Together and Compare Stories

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| put together / two parts | CFU "Mia has 4 green buttons and 5 orange buttons. How many buttons in all? … Put the two parts together." `PutTogetherCompareWordProblems.tsx:63–70`; Explore "Put together: two parts make a total." `:227` | all | |
| total / the total / a part | Explore `:227`, `:270`; Practice "What is missing? … the total / a part" `:350–351`; Key Idea `:635` | all | |
| the rest (are animal cards) | CFU `:82–89` | all | |
| split ("You can split 6 many ways.") | CFU `:104`; Explore "Try other green and orange splits." `:266` | CFU, Explore, Practice | From MK2 |
| compare / line them up / count the extras / match them up | CFU "Lily has 9 crayons. Ben has 5. How many more…? Line them up. Count the extras." `:112–119`; Explore "Compare: line them up. Find the extras." `:276`; Key Idea `:636` | all | |
| how many more / how many fewer | CFU `:112`, `:127` | all | Words point the right way (grade-1.md) |
| gap / same gap | CFU "Yes! 4 more. 4 fewer. Same gap." `:134`; Explore "The gap" `:286` | CFU, Explore, Test | Replaces *difference*; MK4 uses *gap* for a space between pieces |
| More than / Fewer than | Explore picker `:287–288`; Practice `:517`, `:549` | Explore, Practice, Test | |
| start with the bigger number, take away the smaller | CFU "Which one finds how many fewer? … Start with the bigger number." `:142–168` | CFU, Practice, Test | |
| Which one finds the answer? | Practice `:478`, `:498`, `:531`, `:563` | Practice | Choices with ☐ (see Unit 6) |
| Challenge | Practice optional type "Challenge: tricky compare stories" `:594`, `:644` | Practice (optional) | Wrong-way compare; no stars |
| Say it | Explore button `:282` | Explore | |
| **Used before taught:** ☐ in choices | Practice `:409`, `:478`, `:498`, `:531`, `:563`, `:613` | Practice | Taught in Unit 6 |

## Unit 5: Fast Facts to 20

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| fast facts / facts | Practice title "Fast facts" `FluencyFactsWithin20.tsx:320`; Key Idea "Try to know these facts fast." `:546` | Practice, Key Idea, title | |
| add first / which two do you add first | CFU "4 + 8 + 2. Which two do you add first? … Find two numbers that make 10." `:86–97` | all | |
| any order / a different order | CFU "Yes! 14. Any order gives 14." `:105–112`; Look here "Try a different order." `:73` | all | |
| three numbers | Explore picker "Three numbers" `:269`; Practice title `:512` | Explore, Practice, Test | Replaces *addends* |
| Within 10 / Past 10 (Fact type) | Explore picker `:263–268` | Explore | |
| turn it around | Practice show-me "Turn it around: 5 + 7 = 12." `:306` | Practice | Order idea (1.OA.3), not named |
| use the same numbers | Practice hint `:305`, `:363`; Test "Use the same three numbers." `FluencyFactsWithin20Test.tsx:119` | Practice, Test | Fact-family idea, not named |
| to take away, you can add | Explore "To take away, you can add. 12 − 8. Start at 8. How many more make 12?" `:221`; Practice "Use adding. 8 + ☐ = 12." `:438` | Explore, Practice, Test | |
| **Used before taught:** ☐ | Practice `:306`, `:362`, `:438`; Test `FluencyFactsWithin20Test.tsx:101` | Practice, Test | Taught in Unit 6 |

## Unit 6: Equal Sign and Number Sentences

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| = means the same as | CFU "Which one is the same on both sides? … Yes! = means the same as." `EqualSignAndEquations.tsx:100–116`; Explore `:363`; Key Idea `:857` | all | Spoken "the same as" (`:56`, `:64`) |
| both sides / first side / other side | CFU `:114`, `:202–203`; Explore "Both sides must have the same amount." `:363` | all | *side* again: MK3 balance side, MK4 shape side, MG2 sign side |
| add up (each side) | CFU "Add up each side. Try this one." `:146` | CFU, Practice, Test | |
| true / false ("Is it true?", "Yes, true" / "No, false") | CFU choices `:86–87`, `:64`; Practice title "Is it true?" `:607` | CFU, Practice, Test | Equation true/false only (1.OA.7), spoken as "the same as"; rule true/false removed in review |
| box / ☐ / "What number goes in the box?" | CFU "7 + 1 = 6 + ☐. What number goes in the box?" `:182`; Explore "A box can hide a number." `:451`; Look here `:82` | all | Voice reads ☐ as "blank" (user decision) |
| the box can come first / the total can go first | CFU "☐ = 6 + 5 … The box can come first." `:277–294`; Explore "The total can be on either side." `:462`; Look here `:80` | all | |
| match ("Make both sides match.") | CFU `:202`; Explore `:363` | all | |
| missing number / Which number is missing? | Practice "Find the missing number" `:729–731`; Key Idea `:858` | Practice, Key Idea | |
| the first number / the second number / what is left | Practice labels `:724–725`; Test "The box is the first number, not the total." `EqualSignAndEquationsTest.tsx:174, :188` | Practice, Test | Replaces *addend* |
| number sentence | Unit title `:852` | Title | From MK2 |
| Flip / Find it / Hide a number in a box | Explore buttons `:442–458` | Explore | |
| Adding on both sides | Practice title `:556` | Practice | Replaces *operation* (review) |
| **Used before taught:** ≠ | Explore "Not the same. 8 ≠ 7." `:428` | Explore | Never taught; voice may read "not equal" |

## Shell / all units

Same shell words as MK1 (see that list), from `MG1_AdditionAndSubtractionWithin20Lab.tsx:45–481`, with the reviewed early-learner wording: "Solve Mixed problems by yourself. That fills your stars." (`:113`), "Do the check first. Then you can practice." (`:303`), "Only Mixed problems give you stars." (`:327`), "questions from all units" (`:120`). Home "Count on, make ten, solve stories, and learn what = means." (`:85`). The "Look here!" button (shared `CfuPointers.tsx`) speaks each pointer's `say` line; the `label` text ("Explore: the number bond and the two number sentences") is only a tooltip.

## Words this lab avoids on purpose

From `_planning/reviews/MG1_AdditionAndSubtractionWithin20Lab/` (round-1-english.md E1-06, E1-15, round-2-english.md, summary.md):

| Avoided | Used instead | Why |
|---|---|---|
| addend(s) | "the first number / the second number", "part", "three numbers" | Grade-1 teacher word first (E1-06) |
| sum | "the total" | Teacher word; heard as "some"; was used two ways (E1-15) |
| difference | "the gap", "how many more" | Grade-1 not-yet word (E1-06) |
| equation | "number sentence" | Not yet as a word to read (E1-06) |
| compute, calculation, operation | "add", "Which one finds the answer?", "Adding on both sides" | Later-grade (E1-06) |
| strategy, method, fluency, bridging, valid, recall | dropped; "Making ten works every time." | Later-grade (E1-01, E1-06) |
| digit, ones digit, drop | "How many are past 10?" | 1.NBT, not taught here (E1-14) |
| single digits, boundary | "below 10" | (E1-06) |
| starting amount, result, beginning | "the start", "the end" | One word per idea (round 1) |
| count up | "count on" | Unit 1 teaches *count on* (round 2) |
| pair | "two numbers" | Heard as "pear" (E1-28) |
| blank (in text) | "box" (text); voice still says "blank" | User decision |
| Left / Right side of = | "first side / other side", "both sides" | *Left* also means "still there" (round 1) |
| balance scale, weigh | "the same as" with ten-frame pictures | Picture mismatch; *weigh* heard as *way* (round 1) |
| "True or false: …" rule statements | one new example | K–1 rule; equation true/false kept for 1.OA.7 |

## Findings

1. **☐ "box" is used in Units 2–5 but taught in Unit 6.** Unit 2 Practice/Test (`MakingTenAndDecomposing.tsx:597, :600`; Test `:162, :189`), Unit 3 choices (`AddToTakeFromWordProblems.tsx:388` and five more), Unit 4 choices (`PutTogetherCompareWordProblems.tsx:409, :478…`), Unit 5 (`FluencyFactsWithin20.tsx:306, :362, :438`; Test `:101`). The first teaching line is Unit 6 Explore "A box can hide a number." (`EqualSignAndEquations.tsx:451`). MK2 used `?` for the unknown. **Fix:** add one line + picture to Unit 2's "Same total" Explore ("The box hides a number.") and its Look-here, or move ☐ teaching to Unit 1/2.
2. **"Box" means two things in Unit 2.** Ten-frame cell ("Count the empty boxes." `MakingTenAndDecomposing.tsx:116, :458`) and the ☐ unknown ("What number goes in the box?" `:597`) in the same unit. MG2 adds a third (hundred-chart cell). **Fix:** call ten-frame cells "spaces" or "empty spots", keep *box* for ☐.
3. **≠ shown without teaching** (`EqualSignAndEquations.tsx:428`). **Fix:** "Not the same. 8 and 7 are not the same."
4. **"Side" now has four meanings across the early labs:** balance side (MK3), shape side (MK4), equation side (MG1 Unit 6), "the open side" of < > (MG2 Unit 3). Each is picture-supported, so no fix is required here; later labs should say which side ("this side / that side" with the picture), never "left side".
5. **Number line and ten frame are never named** (number line `CountingOnAndBack.tsx:32–52`, ten frames throughout). Fine for K–1 if later labs also avoid the names; if a later lab says "number line" or "ten frame", it must teach the name first (MK2 already uses "ten frame" untaught in hints).
6. **Number bond is named once** (`MakingTenAndDecomposing.tsx:303`) and never used again by name. Later labs may assume the picture but should re-teach the word before asking about it.
7. **Not taught by any earlier lab but needed here, all taught in this lab with a picture first:** *count back* (MK1 used it only in Practice), *hop / land*, *start / change / end*, *gap*, *= means the same as*, *box ☐*. No later-grade words remain in student text (review rounds 1–3).
</invoke>
