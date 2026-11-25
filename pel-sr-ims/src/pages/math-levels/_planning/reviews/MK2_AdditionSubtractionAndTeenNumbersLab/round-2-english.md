# MK2 Addition, Subtraction & Teen Numbers: English review, round 2

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` (6 units, 6 unit Tests, Module Test of 30)
- **Round:** 2, re-review · **Date:** 2026-11-21
- **Grade assessed:** Kindergarten, K–1 band. There is no younger grade file, so `grade-K.md` is also the limit for read-alone text: assume no independent reading.
- **Audience:** K/1st graders seeing this for the first time, plus 2nd graders who are behind, alone on an iPad, audio-first.
- **Settled and not re-opened:** D1, D2, D3; voice "blank" with text "box"; correct grammar after a blank; never "ten(s)".
- **How real values were checked:** I bundled the lab's real generators and ran 4,000 problems per Practice bucket and 1,500 draws per Test question, plus 300 per Module Test slot. That gave 11,948 unique strings, which I checked for "1 + plural", banned words, length and capitals, and sampled through the real `speakableText`. CFU, Explore and pointer lines were read in the code, because their values are fixed or come from steppers.

Paths are relative to `src/pages/math-levels/MK2/AdditionSubtractionAndTeenNumbersLab/units/`, unless a line says "shell" (`MK2_AdditionSubtractionAndTeenNumbersLab.tsx`).

## 0. Status of round 1 English fixes

**38 Fixed · 2 Not fixed · 6 Fixed, but caused a new problem · 1 Skip (as decided).**

| ID | Status | Evidence or new finding |
|---|---|---|
| E1-01 "1 ducks" | **Not fixed** in 3 places | Practice is clean. Left: "Ana has 4 blue and 1 orange marbles." (E2-48) and "1 fingers." (E2-51) |
| E1-02 True/false | **Fixed, new problem** | No true/false left. The new More/Fewer item gives the answer away (E2-58) |
| E1-03 Goals and Key Ideas | Fixed | All match the agreed table |
| E1-04 Explore paragraphs | **Fixed, new problem** | Short lines now, but one is false at take away 0 (E2-52) |
| E1-05 Later-grade words | Fixed | 0 hits in generated text for *subtract, partner, digit, equation, total, pair, whole, symbol* and the rest |
| E1-06 One name per idea | **Fixed, new problem** | Unit 5 now has two names for the same idea (E2-57) |
| E1-07 "ones" as a pronoun | Fixed | "The faded dots went away." |
| E1-08 Dash asides | Skip | Rule kept in new text |
| E1-09 Homophones | **Not fixed** at one line | "He ate 2." is still spoken (E2-53) |
| E1-10 Asking twice | Fixed | |
| E1-11 Control labels | Fixed | |
| E1-12 Test hints | Fixed | Short pointers; false line gone |
| E1-13 Home and Module lines | Fixed | |
| E1-14 Module stars | Fixed | D3 bands in code; 0 stars draws empty |
| E1-15 Unit names voiced | Fixed | |
| E1-16 Standard code | Fixed | Not rendered |
| E1-17 Start-unknown | Fixed | |
| E1-18 Take-apart labels | Fixed | Start / Take away |
| E1-19 "Before" prompts | Fixed | |
| E1-20 "One more finger" | Fixed | Always 9 or less |
| E1-21 "Subtract" | Fixed | "Add, or take away?" |
| E1-22 False premise | Fixed | Challenge always names the child with more |
| E1-23 Compare (D1) | Fixed | Core is "Who has more?" |
| E1-24 Keywords | Fixed | |
| E1-25 Colors | Fixed | |
| E1-26 Impossible stories | Fixed | |
| E1-27 "Whole time" | Fixed | Deleted |
| E1-28 Passive | Fixed | |
| E1-29 Same way called different | Fixed | |
| E1-30 Long "if" prompts | **Fixed, new problem** | "If" is gone. The agreed "Split…" wording uses an untaught word (E2-49). That rewrite was mine in round 1 |
| E1-31 "Partner" | Fixed | |
| E1-32 Ranges read as minus | Fixed | |
| E1-33 Strategy question | Fixed | |
| E1-34 "5 + 5, not 5 + 5" | Fixed | |
| E1-35 "exactly", "ACTUAL" | Fixed | |
| E1-36 Two right answers | Fixed | |
| E1-37 One-button question | Fixed | |
| E1-38 Fact families | Fixed | |
| E1-39 Hint gives no help | **Fixed, new problem** | New hints point at dots that aren't there when the answer is 0 (E2-56) |
| E1-40 Doubles wording | Fixed | |
| E1-41 Asks twice | Fixed | |
| E1-42 Two unknowns | **Fixed, new problem** | The new "write another way" step rejects a true sentence with no reason (E2-50) |
| E1-43 "Digit" | Fixed | |
| E1-44 "Equation" | Fixed | |
| E1-45 "Ten-group" | Fixed | |
| E1-46 "Say to yourself" | Fixed | |
| E1-47 Vocabulary list | Fixed | Update it again for E2-49 and E2-53 |

## 1. Verdict

**Close, but not ready to sign off.** The rewrite worked: nearly every line is now short, spoken well and free of later-grade words. Three Major wording problems remain, and all three are small fixes. The biggest is a true number sentence marked wrong with no reason in Unit 3 Practice.

**New findings: 0 Blocker · 3 Major · 9 Minor · 5 Polish (17).**

## 2. Scorecard

Length is the script's % of strings over 8 words: task / after-answer / Explore and CFU screen. The Unit 6 and shell screen figures are inflated: the script joins separate JSX lines, and Unit 6 has very few screen strings.

| Unit | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| 1 Putting Together | Strong (0 / 0 / 0%) | OK ("1 fingers") | Strong | Strong | Strong | Strong |
| 2 Word Problems | OK (0 / 0 / 13%) | Weak ("1 orange marbles") | Strong | Strong | OK ("ate") | Strong |
| 3 Breaking Apart | OK (7 / 0 / 0%) | OK | Weak (*split*) | n/a | Strong | OK |
| 4 Make 10 | Strong (0 / n/a / 0%) | OK | Strong | n/a | Strong | Strong |
| 5 Fast Facts | Strong (0 / 0 / 0%) | Strong | OK (two names) | n/a | Strong | Strong |
| 6 Teen Numbers | Strong (0 / 0 / 50%, see note) | OK (lowercase starts) | Strong | n/a | Strong | Strong |
| Module Test | Inherits its items | Weak (E2-48) | OK (E2-49) | Strong | Strong | Strong |
| Shell | Strong (11%, see note) | Strong | OK | n/a | Strong | Strong |

## 3. All findings

### Unit 2

#### E2-48 · Major · "1 orange marbles" on the Test and Module Test
- **Where:** `WordProblemsWithin10Test.tsx:72` (also Module Test slot `putTogetherTotalQuestion`); Explore `WordProblemsWithin10.tsx:246`. The same pattern is over the limit at CFU `:78` and Practice `:416`.
- **Exact text (real output):** "Ana has 4 blue and 1 orange marbles. How many in all?" This happens in **22.8% of draws** of the Test item. Explore can show "A jar has 1 blue and 1 orange marbles." Practice is grammatical but runs 9 words: "Mia has 3 blue marbles and 2 orange marbles."
- **Breaks:** builder "Generated sentences must be grammatical"; checklist §3 "Generated plurals"; grade-K.md → Limits.
- **Rewrite (one pattern for all four, using `is`/`are` at 1):**
  - Test: "Ana has marbles. 3 are blue. 1 is orange. How many in all?"
  - Practice: "Mia has marbles. 3 are blue. 2 are orange."
  - CFU Q3: "A jar has marbles. 4 are orange. 3 are blue. How many in all?"
  - Explore: "A jar has marbles. 1 is blue. 1 is orange."

#### E2-53 · Minor · "He ate 2" is still spoken
- **Where:** CFU Q2 wrong-answer lines, `WordProblemsWithin10.tsx:68`.
- **Exact text and speech:** "He ate some. That leaves fewer." · "He ate 2. Those are gone." The second is heard as "He eight 2."
- **Breaks:** traps §2; E1-09; `vocabulary.md` says the lab avoids *ate*.
- **Rewrite:** "He eats some. That leaves fewer." · "He eats 2. Those are gone."

#### E2-61 · Polish · Challenge wording (optional, D1)
- **Judgment:** **clear enough for a K listener.** It asks "Who has more stickers?" first, then "How many more does Mia have?", always about the child who has more, with the extras ringed when the student needs help. No change is needed for it to work.
- **Where:** `WordProblemsWithin10.tsx:527, 541`.
- **Two small gains:**
  - The story gives bare numbers and the noun arrives only in the question. Use `count()`: "Mia has 5 stickers. Leo has 3 stickers."
  - The explanation "5 − 3 = 2." is not what the student did, which was count the extras. Use `${count(extras, "extra", "extras")}.` → "2 extras."

#### E2-62 · Polish · "Count the dots by Jen."
- **Where:** `WordProblemsWithin10.tsx:494, 495`.
- **Breaks:** traps §5 (small words). *By* is unclear here.
- **Rewrite:** "Count Jen's dots."

### Unit 3

#### E2-49 · Major · "Split" is untaught, in a 9-word sentence with "that are" and "each"
- **Where:** CFU Q4 `DecomposingNumbers.tsx:100`; its nudge `:104`; Practice `:375`; Test `DecomposingNumbersTest.tsx:130, 143` (`:130` is in the Module Test).
- **Exact text:** "Split 8 into two parts that are the same. How many in each part?" · nudge: "Make two groups with the same number of dots."
- **Breaks:** checklist §3 "Untaught words": the unit teaches *break apart* and no Explore line says *split*. grade-K.md → Limits and Not yet (*each*, two clauses).
- **Rewrite:**
  - Prompt: "Break 8 into two parts. Make them the same. How many in one part?"
  - Practice: "Break them into two parts. Make them the same. How many in one part?"
  - Nudge: "Make two groups. Make them the same."

#### E2-50 · Major · A true sentence gets "Not a match" with no reason
- **Where:** `OwnWay.tsx:26–31`, Unit 3 Practice "Now write another way." (`DecomposingNumbers.tsx:258`). The message is the shared `wrongTry` text.
- **Exact behavior:** the screen shows 5 = 1 + 4. The student types **5 = 4 + 1**, which is true. The lab correctly doesn't count it as a new way (merged row 25), but the student hears only "Not a match. Try again." A child who knows the math is told it's wrong, doesn't learn why, and loses the star on that problem.
- **Breaks:** checklist §3 "Text vs. picture"; standing requirement for few-word, useful feedback.
- **Rewrite (a line inside `OwnWay`, so `shared/` is not edited):**
  - Same two numbers: "Yes, that makes 5. Use new numbers."
  - Wrong sum: "That makes 6. Make 5." (with the real values)
  - The fixer should check how this line sits with the shared "Not a match" text. If both show, the student hears a contradiction. If the shared text can't be hidden from inside MK2, report it as Needs decision.

### Unit 1

#### E2-51 · Minor · "1 fingers" in Explore
- **Where:** `PuttingTogetherAndTakingApart.tsx:261`, take-away mode with Start at 1.
- **Exact text:** "1 fingers. Put 0 down. 1 is still up."
- **Breaks:** checklist §3 "Generated plurals"; E1-01.
- **Rewrite:** `${count(total, "finger", "fingers")}. Put ${b} down.`

#### E2-52 · Minor · "Taking away leaves fewer" is false at 0
- **Where:** `PuttingTogetherAndTakingApart.tsx:247`. The Take away stepper starts at 0.
- **Exact text:** "Taking away leaves fewer: 6 − 0 = 6."
- **Breaks:** checklist §3 "Mode-dependent lines" and "Text vs. picture."
- **Rewrite:** when `b === 0`: "None went away: 6 − 0 = 6."

#### E2-58 · Minor · The Test story says "more" before asking "more, or fewer?"
- **Where:** `PuttingTogetherAndTakingApartTest.tsx:162` (also in the Module Test).
- **Exact text:** "5 dots. 2 more dots come. Are there more, or fewer?"
- **Breaks:** checklist §3 "Giveaways"; traps §9; standing requirement that Test wording has little or no scaffolding.
- **Rewrite:** "5 dots. Add 2. More, or fewer?" · "5 dots. Take 2 away. More, or fewer?"

#### E2-63 · Polish · Two lines can be shorter
- **Where and rewrite:**
  - `PuttingTogetherAndTakingApart.tsx:107`: "Count every finger that is up." → "Count the fingers up."
  - `FastFactsWithin5.tsx:69`: "1 goes away. 1, 2, 3 are left." → "1 goes away. Count the dots left: 1, 2, 3."

### Unit 4

#### E2-55 · Minor · "9 fills every box" isn't what the picture shows
- **Where:** Show me, `MakingTen.tsx:251`.
- **Exact text:** "4 fills every box." The 4 fills only the empty boxes. The other number fills the rest.
- **Breaks:** checklist §3 "Text vs. picture."
- **Rewrite:** `${p} and ${shown} fill every box.`

### Unit 5

#### E2-54 · Minor · Pointer says "Start at the big number"
- **Where:** `FastFactsWithin5.tsx:22`.
- **Problem:** Explore opens on 1 + 1, which has no big number, and counts every dot from 1. In the re-check set (2 + 3), the show-it line then starts at the **small** number: "2, then 3, 4, 5."
- **Breaks:** checklist §3 "Text vs. picture."
- **Rewrite:** `say: "Look here. Count all the dots."`

#### E2-56 · Minor · Hints point at dots that aren't there when the answer is 0
- **Where:** `FastFactsWithin5.tsx:301` (0 + 0), `:333` (n − n), `:388–389` (missing number is 0).
- **Exact text:** "Look at the dots. Count them." with no dots · "Count the orange dots." with no orange dots · "No more are needed."
- **Breaks:** checklist §3 "Text vs. picture"; builder "K–1 hints point at the picture."
- **Rewrite:** sum 0: "Are there any dots?" · n − n: "Are any dots left?" · missing 0: hint "Are there any orange dots?", Show me "There are no orange dots. That is 0."

#### E2-57 · Minor · "Both parts" and "the two numbers" name one idea
- **Where:** Explore `FastFactsWithin5.tsx:222` and pointer `:24` say "Both parts are the same." The CFU praise (`:84`), Practice and Test say "The two numbers are the same."
- **Breaks:** english-learners.md → "Several words for one idea"; E1-06.
- **Rewrite:** "The two numbers are the same." in both places.

### Unit 6

#### E2-60 · Polish · Teen words start sentences in lowercase
- **Where:** `TeenNumbers.tsx:177, 259, 263, 265`; `TeenNumbersTest.tsx:61, 142` (25 generated strings).
- **Exact text:** "fourteen. How many ones?" · "fourteen is 14." The voice is unaffected.
- **Rewrite:** capitalize the word at the start of a sentence. Keep it lowercase after "Listen:".

### Shell and all units

#### E2-59 · Minor · Unit titles are long, and Unit 1's conflicts with "take away" (Needs the user's decision)
- **Where:** `title` in each unit file. These are voiced first on each unit and come from the approved plan, so I'm not treating a rename as a routine fix.
- **Exact text:** "Putting Together and Taking Apart" · "Solving Word Problems Within 10" · "Breaking Numbers Apart" · "Fast Facts Within 5" · "Teen Numbers as Ten Plus More"
- **Breaks:** grade-K.md → Limits (*within* is not a K word); E1-06 (the unit teaches "take away", never "taking apart").
- **Proposed:** "Put Together and Take Away" · "Story Problems to 10" · "Break Numbers Apart" · "Fast Facts to 5" · "Teen Numbers". Unit ids stay, so progress isn't affected.

#### E2-64 · Polish · "Subtraction" on the Module Test back button
- **Where:** shell `:482`, "← Back to Addition, Subtraction & Teen Numbers". Not spoken.
- **Rewrite:** "← Back". The lab's own name in the side rail is left as it is.

### The 9-word sentences the fixer reported

| Sentence | Judgment |
|---|---|
| "Split 8 into two parts that are the same." | **Shorten** (E2-49). It has an untaught word and a second clause |
| "A teen number is one ten and some ones." | **Keep.** One idea, plain "is", and it matches the CFU frame exactly |
| "A jar has 4 orange and 3 blue marbles." and Practice's "Mia has 3 blue marbles and 2 orange marbles." (not on the fixer's list) | **Shorten** (E2-48), which also fixes the plural |
| "Make two groups with the same number of dots." (not on the fixer's list) | **Shorten** (E2-49) |

Number-count lines such as "Count them all: 1, 2, 3, 4, 5, 6." go over 8 "words" only because of the count. They are fine.

## 4. What's working well

- **No later-grade words** in any generated string.
- **Nearly every sentence is 8 words or fewer**, and feedback is a few words.
- **Star wording is honest:** "Solved, with help." and "Solved it!" appear unless a star really lit up, and the Challenge earns none.
- **The voice reads the math well:** "5 plus blank equals 5. What goes in the box?"
- **"One ten and 1 one"** keeps correct grammar, as the standing decision asks.
- **The "Who has more?" stories** are clear and always name a real winner.

## 5. Out of my lane (for the curriculum checker)

- Take-away and put-together distractors can show impossible sentences, such as "1 − 3 = 4".
- Unit 3's Explore demo walks through swapped pairs (1 and 8 … 8 and 1), while Practice says a swapped pair isn't another way.
- The Unit 5 re-check set uses 2 + 2 again, the same fact as the first set.

## 6. Guideline gaps (proposed, not applied)

1. **`checklist.md` §3, Generated plurals:** "A shared noun after two numbers ('3 blue and 1 orange marbles') must agree with the nearer number. Prefer separate sentences: '3 are blue. 1 is orange.'"
2. **`checklist.md` §2:** "Also check Explore lines at every stepper value, including the minimum and 0. A generator brute force doesn't reach them."
3. **`checklist.md` §3, Giveaways:** "When an answer is rejected although it's true (a repeated way, a swapped pair), the feedback must say it is true and why it doesn't count."

## 7. What I could not check

- Real iPad speech, including how "1 one" and "He ate 2" actually sound. I used the lab's speech mapping.
- Real students.
- I did not drive the lab in a browser. Explore and CFU lines were read from the code at their real stepper ranges. So the combined on-screen effect of E2-50's message and the shared "Not a match" text still needs a look.
- Shared end-of-test wording ("Keep practicing — aim for 9 out of 10.") is in `shared/` and outside this lab's fixes. *Aim* is a little hard for K.
