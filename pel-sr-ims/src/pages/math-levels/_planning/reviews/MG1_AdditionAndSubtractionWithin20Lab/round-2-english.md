# MG1 Addition & Subtraction Within 20: English review, round 2 (re-review)

- **Lab:** MG1 `AdditionAndSubtractionWithin20Lab` ("Addition & Subtraction Within 20"), 6 units + 6 unit Tests + Module Test
- **Round:** 2 (re-review of `round-1-merged.md` + `round-1-fixes.md`)
- **Date:** 2026-11-17
- **Grade assessed:** 1st (plan: Grade 1, 1.OA.1–1.OA.8). Audience: K/1st first-timers and behind 2nd graders, alone on an iPad, audio-first. As in round 1, text the student must hear or read *to act* is held to the **Kindergarten** limits (8 spoken words, one idea); grade-1.md is used for math words and word-problem types.
- **Read-aloud:** yes. Voice checked against `shared/tts/mathSpeech.ts` (☐ → "blank", ≠ → "does not equal") and the `data-tts-say` overrides.
- **Method:** `node scripts/english-check.cjs --grade 1` on the shell + lab folder (501 strings, 20 flagged, was 290 of 569), then per unit. Read every new CFU (all 33 questions, nudges, named reasons, show lines, praise), every `LOOK` pointer `say` line and label, every changed Explore line, and every Practice/Test template. Bundled all 6 units + Module Test with esbuild and ran every Practice bucket 300× and every Test generator 200× (29,078 unique lines), then grepped for agreement errors, long sentences and synonyms.
- **User decisions kept:** Making Ten keeps "bigger number / smaller number." Start-missing stories stay a required Practice type (1 in the Unit 3 Test, 1 in the Module Test); I judged only their wording.

## 0. Status of round 1's English fixes

| ID | Round 1 | Status | Note |
|---|---|---|---|
| E1-01 | Blocker | **Fixed** | No strategy True/False left anywhere. Every replacement is one short new example (typed or 2–3 picks). |
| E1-02 | Major | **Fixed** | U3/U4 stories: no "1 shells", "1 are", "had 0" in 29k lines. (Different plural slips in U1 and U6 are new: E2-33.) |
| E1-03 | Major | **Fixed, but caused a new problem** | All 33 CFU questions are short and one at a time (0% over the limit). U4 Q2's "Is there just one way?" (my round-1 wording) has no "to do what": E2-35. |
| E1-04 | Major | **Fixed** | No first-miss nudge or named reason states a box's answer. |
| E1-05 | Major | **Fixed** | "Not yet. Keep the bigger number whole." / say "Which number is closer to 10?" |
| E1-06 | Major | **Fixed** | No addend/sum/difference/equation/compute/strategy/fluency/bridging/valid/pair in student text. |
| E1-07 | Major | **Fixed, but caused a new problem** | The U3 goal I wrote ("…where some are added or taken away") is passive + a relative clause: E2-47. |
| E1-08 | Major | **Fixed, but caused a new problem** | "What is missing?" + "the start / the change / the end" everywhere. The hint I gave, "Which number does the story not tell?", is a negative question: E2-37. |
| E1-09 | Major | **Fixed** | "How many did Nora find?" etc. |
| E1-10 | Major | **Fixed** | |
| E1-11 | Major | **User decision (kept)** | Wording is fine: 3 short sentences (≤ 6 words each) + the question, the same shape as grade-1.md's own change-unknown example. See Guideline gap 1. |
| E1-12 | Major | **Fixed** | U6 uses "first side / other side"; "left" only means "still there." |
| E1-13 | Major | **Fixed, but caused a new problem** | Lines now switch with the story kind. Two of them say the subtraction in reverse word order, and the say line still sends Q3 to "take away" while Q3's nudge says "count on": E2-36. |
| E1-14 | Major | **Fixed** | |
| E1-15 | Major | **Fixed** | |
| E1-16 | Major | **Fixed** | |
| E1-17 – E1-24 | Minor/Blocker/Polish | **Fixed** | E1-23 (Blocker): "Max has 3 fewer than Grace." in Practice and Test. |
| E1-25 | Minor | **Fixed, but caused a new problem** | "Say 3 are green" uses *say* = "suppose" in a lab where *say* means "speak the numbers": E2-34. |
| E1-26 – E1-29 | Minor/Polish | **Fixed** | |
| E1-30 | Minor | **Fixed, but caused a new problem** | Text says "box" everywhere, but the voice reads ☐ as "blank": "8 plus blank equals 11. What number goes in the box?" E2-38. |
| E1-31, E1-32 | Minor | **Fixed** | (One shell line round 1 missed: E2-48.) |

**Totals:** 32 old findings → **25 Fixed, 6 Fixed but caused a new problem, 0 Not fixed, 1 user decision.**

## 1. Verdict

**Close to ready.** The text is now at the right level for K–1 listeners. All 33 rebuilt CFU questions, the pointer lines and the Practice prompts are short (the script finds 0% of task and after-answer strings over the limit, down from 27–46% per unit), and the True/False, wrong-way compare and grammar Blockers are gone. Two things still need fixing. First, **some generated hints have plural slips** ("Count back 1 times from 12", "Say 1 numbers after 14", "1 went away. Add them back"), including one in the Module Test. Second, **the Unit 3 "Look here" line a stuck student is sent to** says the subtraction backwards ("Take the end away from the start"), and it gives a different method from the nudge the student just heard. Everything else is Minor or Polish, and several of those came from my own round-1 rewrites.

## 2. Scorecard

"% over" is the script's share of strings with a sentence over the 1st-grade limit (task / screen).

| Part | Length (% over) | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / home | OK (10% screen) | Strong | Strong | n/a | Strong | OK (E2-48) |
| U1 Counting On and Back | Strong (0% / 0%) | OK (E2-33 "1 times / 1 numbers") | Strong | n/a | Strong | Strong |
| U2 Making Ten | Strong (0% / 0%) | Strong | OK ("count up", "the other number") | n/a | OK ("blank") | Strong |
| U3 Add To / Take From | Strong (0% / 25%: the script joining separate Explore lines) | OK (E2-36 word order) | OK ("act it out", "not tell") | Strong (start-missing kept by user; wording short) | OK ("blank") | OK |
| U4 Put Together / Compare | Strong (0% / 0%) | OK ("Say 3 are green") | OK | Strong (right-way compare; echo questions gone) | Strong | Strong |
| U5 Fast Facts | Strong (0% / 0%) | Strong | OK ("think addition") | Strong (three-number stories 1.OA.2) | OK ("blank") | Strong |
| U6 Equal Sign | Strong (0% / 0%) | OK ("1 went away… them") | Strong | n/a | OK ("Is 5 the same as 2 plus 3?" works; ☐ = "blank") | Strong |
| Module Test | Strong | OK (inherits "Count back 1 times") | Strong | Strong (1 start-missing) | OK | OK |

## 3. All findings (new this round)

Counts: **0 Blocker, 2 Major, 9 Minor, 6 Polish** (17 new findings; IDs continue after E1-32).

### Lab-wide

**E2-33 · Major · Generated hints still say "1 times", "1 numbers", "them" for 1**
- **Where:** (found by running every generator)
  - U1 Test `CountingOnAndBackTest.tsx:117` (`countBackSimpleNumberQuestion`, **also in the Module Test**): "Count back 1 times from 12." (every draw with sub = 1, 14 sentences in my run)
  - U1 Practice `CountingOnAndBack.tsx:389` (countOnLarger) and `:431` (countOnSmallFirst): "Say 1 numbers after 14." (b or small = 1)
  - U6 Practice `EqualSignAndEquations.tsx:726` (takeFirst, ☐ − b = c with b = 1): "1 went away. Add them back to 5."
- **Breaks:** builder "Generated sentences must be grammatical for every value"; checklist §3 "Generated plurals."
- **Rewrite:** `Count back ${sub} ${sub === 1 ? "time" : "times"} from ${start}.` → "Count back 1 time from 12." / `Say ${b} ${b === 1 ? "number" : "numbers"} after ${a}.` → "Say 1 number after 14." / `${b} went away. Add ${b === 1 ? "it" : "them"} back to ${c}.` → "1 went away. Add it back to 5."

**E2-38 · Minor · The voice says "blank" while the text says "box"**
- **Where:** every ☐ the voice reads: CFU U6 Q3/Q5/Q6 ("8 + ☐ = 11. What number goes in the box?" is spoken "8 plus blank equals 11. What number goes in the box?"); U2 Same total, U5 related facts and "Think addition", U6 Practice and Test, and the U3/U4 "Which one matches the story?" choices ("blank plus 4 equals 11"). Cause: `shared/tts/mathSpeech.ts:64` maps ☐ to "blank."
- **Breaks:** english-learners.md (two words for one thing); E1-30's agreed fix ("box" everywhere); traps §8 (what the voice says vs what is printed).
- **Rewrite:** say "box" for ☐: "8 plus box equals 11. What number goes in the box?" **Needs the user's decision** on where: `mathSpeech.ts` is shared by every lab (other labs may print "blank"), so either change the map for all labs (and check them) or add `data-tts-say` to MG1's box prompts.

**E2-39 · Minor · "Count up" and "count on" for the same action**
- **Where:** `EqualSignAndEquations.tsx:195` (CFU Q5 nudge "Count up from 8 to 11."), `:676` (Practice hint "Count up from 7 to 12."), `MakingTenAndDecomposingTest.tsx:20` ("Count up from the number to 10."). Unit 1 teaches "count on"; the rest of the lab says "count on" (87 generated lines say "count up").
- **Breaks:** english-learners.md (several words for one idea).
- **Rewrite:** "Count on from 8 to 11." / "Count on from 7 to 12." / Test: "Count on from 7 to 10." (or keep it general: "Count on to 10.").

### Unit 1: Counting On and Back

**E2-43 · Polish · An -ing clause in Explore; a mid-sentence colon in the Test**
- **Where:** `CountingOnAndBack.tsx:236` "You counted on 3 times from 6, landing on 9." (also "0 times" before the first tap); `CountingOnAndBackTest.tsx:26` "Count on from 9: what is 9 + 3?" and `:117` "Count back from 13: what is 13 − 4?" (the voice drops the colon: "Count on from 9 what is 9 plus 3").
- **Breaks:** grade-1.md Grammar (one idea a sentence); traps §8.
- **Rewrite:** "You counted on 3 times from 6. Now you are on 9." / "9 + 3. Count on from 9. What is the total?" / "13 − 4. Count back from 13. What is left?"

**E2-45 · Polish · Three pointer `say` lines don't match what the student needs**
- **Where:** `CountingOnAndBack.tsx:29` (`LOOK.rule`, Q5) "Look here. Count back the number you take away." (reads as "count back *the number*"); `MakingTenAndDecomposing.tsx:29` (`LOOK.any`, Q4 "7 + 5. Make a ten. What is the total?") "Look here. Try new numbers." (tells a stuck student to change numbers, not how to make the ten); `PutTogetherCompareWordProblems.tsx:29` (`LOOK.diff`, Q4–Q6) "Look here. Start with the bigger. Take away the smaller." while Q4/Q5's nudge says "Line them up. Count the extras." and the spot shows the gap picture.
- **Breaks:** checklist §3 "Text vs. picture"; builder K–1 (a nudge says what to do).
- **Rewrite:** `LOOK.rule`: "Look here. Take away 4? Count back 4 times." *(if the curriculum checker agrees this isn't too close to Q5's answer; otherwise "Look here. One hop for each one you take away.")* / `LOOK.any`: "Look here. Fill the ten. Then add the rest." / `LOOK.diff`: "Look here. Line them up. Count the extras." (Q6 can keep the bigger/smaller line as its own `LOOK` entry).

### Unit 2: Making Ten

**E2-44 · Minor · "The other number" and "goes the other way" in Same total**
- **Where:** Practice step 1 `MakingTenAndDecomposing.tsx:591`: story "6 + 5 = 7 + ☐", prompt "7 is 1 more than 6. What happens to the other number?" (which one? there are three other numbers on screen); Test hint `MakingTenAndDecomposingTest.tsx:159` "7 is 1 more than 6. The other number goes the other way." (idiom); Test hint `:114` "You took away 3 of the 5 so far." (long noun phrase with "so far").
- **Breaks:** english-learners.md (idioms); checklist §3 (the answer depends on knowing which number is meant).
- **Rewrite:** Practice: "6 got 1 bigger. It is 7 now. What happens to 5?" (options "It gets smaller by 1" / "It gets bigger by 1" / "It stays the same" unchanged). Test `:159`: "7 got bigger. So the box gets smaller." Test `:114`: "5 is 3 and how many more?" (the Practice wording).

### Unit 3: Add To / Take From

**E2-36 · Major · The "What is missing?" lines and the pointer say the subtraction backwards and give a different method from the nudge**
- **Where:**
  - Explore `AddToTakeFromWordProblems.tsx:159` "Start or change missing? Take the number you know away from the end." (13 words, a relative clause, and the words name the number you take away first); `:160` "Change missing? Take the end away from the start." (the words name the end first, but you start with the start).
  - Pointer `:35` (`LOOK.missing`, used by CFU Q3 *and* Q6): "Look here. Take away from the end." Q3's nudge is "Start with 6. Count on to 11." so a student who misses twice hears "count on," then "take away from the end." "The end" also sounds like "the end of the story."
  - CFU Q6 show line `:141` "Watch: take the 4 away from 11. 7 are left." (same word order).
- **Breaks:** traps §3 (word order ≠ operation order; round-1 Guideline gap 3 added "take the smaller from the bigger"); grade-1.md Limits and Grammar (relative clause); checklist §3 "Text vs. picture." This is the line a struggling student is sent to, so it has to be the clearest line on the screen (same reasoning as E1-16).
- **Rewrite:** Make the lines say what the "Show" button does, with the picture's numbers, in operation order:
  - Add To, change missing: `Change missing? Start at ${start}. Count on to ${end}.`
  - Add To, start missing: `Start missing? Start at ${end}. Take away ${change}.`
  - Take From, change missing: `Change missing? Start at ${start}. Count back to ${end}.`
  - Take From, start missing: `Start missing? Start at ${end}. Add back ${change}.`
  - Split the pointer into two: Q3 `say: "Look here. Count on to the end."`; Q6 `say: "Look here. Start at the end. Take away."`
  - Q6 show line: "Watch: start at 11. Take away 4. 7 are left."

**E2-37 · Minor · Hint "Which number does the story not tell?" is a negative question**
- **Where:** U3 Practice `AddToTakeFromWordProblems.tsx:338`, Test `AddToTakeFromWordProblemsTest.tsx:89`, `:244`; U4 Practice `PutTogetherCompareWordProblems.tsx:352`. (My round-1 rewrite.)
- **Breaks:** grade-1.md Grammar "Not yet: negatives in questions."
- **Rewrite:** "The story tells two numbers. Which one is missing?"

**E2-41 · Minor · "Act it out" hints**
- **Where:** `AddToTakeFromWordProblems.tsx:342` and Test `:283` "Act it out. Does the number go up or down?"; `PutTogetherCompareWordProblems.tsx:358` "Act it out. Do you put together or take away?"
- **Breaks:** english-learners.md (idioms and phrasal verbs). A child alone on an iPad has nothing to act out with. "The number" in U3 doesn't say which number.
- **Rewrite:** U3: "Picture the story. Did it go up or down?" (Explore already says "It went up." / "It went down."). U4: "Do you put together or take away?"

**E2-47 · Polish · U3 goal is passive with a relative clause**
- **Where:** `AddToTakeFromWordProblems.tsx:529` "Solve stories where some are added or taken away." (my round-1 rewrite; the script flags it as passive).
- **Breaks:** grade-1.md Grammar (passive, relative clause).
- **Rewrite:** "Solve stories. Add more or take some away."

### Unit 4: Put Together / Compare

**E2-34 · Minor · "Say 3 are green" uses *say* in a second sense**
- **Where:** CFU Q3 `PutTogetherCompareWordProblems.tsx:98` "Say 2 are sports cards. How many are animal cards?"; Practice `:442` "Say 3 are green…", `:445` "Now say 5 are green…"; Test `PutTogetherCompareWordProblemsTest.tsx:105`. In Unit 1, *say* means speak aloud ("Say 3 numbers." `CountingOnAndBack.tsx:83`, "Say the numbers." `:325`). (My round-1 rewrite, E1-25.)
- **Breaks:** traps §1 (one word, two meanings in one lab); english-learners.md (idiom "say" = suppose).
- **Rewrite:** drop *say*: "2 are sports cards. How many are animal cards?" / "3 are green. How many are orange?" / "Now 5 are green. How many are orange?" (The story's "Some are green. Some are orange." already sets it up.)

**E2-35 · Minor · CFU Q2 "Is there just one way?" doesn't say one way to do what**
- **Where:** `PutTogetherCompareWordProblems.tsx:75` "Jake has 6 cards. Some are sports cards. Some are animal cards. Is there just one way?" (my round-1 wording).
- **Breaks:** checklist §3 (the question must say what is asked); grade-1.md (a K–1 listener has no verb to attach "way" to).
- **Rewrite:** "…Is there just one way to split them?" (8 words; matches the wrong-pick line "Try other ways to split 6.").

**E2-46 · Polish · Praise and Show-me wording**
- **Where:** CFU Q3 praise `:105` "Yes! 2 and 4 works. So does 1 and 5."; Q3 show `:104` "The rest are 3, 4, 5, 6. That is 4." (four numbers that are not the answer, then the answer); Q5 praise `:135` "Yes! Both are 4." (both what?); Practice explain `:358` "{sentence} finds it."; Practice Show me `:537` "Lily has those and 3 extra: 7, 8, 9."
- **Rewrite:** "Yes! 2 and 4 make 6. So do 1 and 5." / "Watch: 2 are sports cards. Count the rest: 1, 2, 3, 4." / "Yes! 4 more. 4 fewer. Same gap." / "{sentence} matches the story." / "Lily has 6 and 3 more: 7, 8, 9."

**E2-50 · Polish · Slashes and "Take Apart" in titles and labels**
- **Where:** unit title `PutTogetherCompareWordProblems.tsx:581` "Word Problems: Put Together/Take Apart and Compare" (spoken "Put Together Take Apart"; "take apart" is never taught); Practice labels `:592` "Put Together / Compare", `AddToTakeFromWordProblems.tsx:539` "Add To / Take From".
- **Breaks:** traps §8 (slash is silent).
- **Rewrite:** "Put Together and Compare Stories"; labels "Put Together and Compare", "Add To and Take From".

### Unit 5: Fast Facts

**E2-40 · Minor · "Think addition" and "8 and what make 12?"**
- **Where:** Explore `FluencyFactsWithin20.tsx:221` "To take away, think addition. For 12 − 8, think: 8 and what make 12?"; Practice step `:428` "Think addition: 8 + ☐ = 12. What number goes in the box?"; Test hint `FluencyFactsWithin20Test.tsx:96`.
- **Breaks:** grade-1.md Math words (teacher phrase, not a K–1 phrase: *think* + a noun); grade-1.md Grammar.
- **Rewrite:** Explore: "To take away, you can add. 12 − 8: 8 and how many make 12?" Practice: "Use adding. 8 + ☐ = 12. What number goes in the box?" Test hint: "8 + ☐ = 12."

### Unit 6: Equal Sign

**E2-49 · Polish · "Work out", a relative clause, "8 is the first side"**
- **Where:** Test hint `EqualSignAndEquationsTest.tsx:160` "Work out each side. Do they match?"; Explore `EqualSignAndEquations.tsx:378` "Find the number that makes both sides the same."; CFU Q3 named reason `:154` "8 is the first side. What goes with 6 to make 8?"
- **Rewrite:** "Find each side. Do they match?" / "What number makes both sides the same?" / "The first side is 8. What goes with 6 to make 8?"

### Shell

**E2-48 · Minor · Stars line: 14 words, and it reads as a contradiction**
- **Where:** `MG1_AdditionAndSubtractionWithin20Lab.tsx:113` "Solve each kind of problem 2 times by yourself to fill in your stars. Only Mixed problems count." (read aloud).
- **Breaks:** grade-1.md Limits; "each kind… Only Mixed" sounds like two different rules.
- **Rewrite:** "Solve Mixed problems by yourself. That fills your stars." *(Check with the shared shell if this line is common to every lab.)*

## 4. What's working well

- **The KCheck CFUs are right for K–1 listeners.** 33 questions, longest sentence 10 words, one question at a time, named-reason lines that say what to do ("Don't count the 8. Count on from it.", "That is the ten. Add the rest too.", "11 is the end. What did he have at the start?"), and no first-miss line gives the answer.
- **Pointer `say` lines** are 4–8 words and mostly match their spot ("Look here. Which number is closer to 10?", "Look here. Start with the total. Take away the part.", "Look here. The total can go first.").
- **Generated stories are clean:** singular/plural and is/are handled everywhere in U3/U4/U5 ("1 is shiny. The rest are plain."), "did" + base verb in every pool, no "had 0", Priya's balloons "popped / pop".
- **Word problems match grade 1:** compare stories use the right-way wording ("Max has 3 fewer than Grace."); question last; start-missing stories are three short sentences.
- **Equation true/false is said as "the same as":** "Is 5 the same as 2 plus 3?" with "Yes, true" / "No, false".
- **The Making Ten bigger/smaller wording is the same in Explore, CFU, Practice, Test and the Key Idea.**

## 5. Out of my lane (for the curriculum checker)

- U3 CFU Q3 reuses Q1's story (Sam, 6 apples, 5 more, 11), and Q1 stays on screen above it, so Q3's answer (5) is printed above the question.
- U1 CFU Q5 ("13 − 4. How many times do you count back?", answer 4) points to the Explore line "To take away 4, count back 4 times." The "Look here" shows the answer number.
- Two-button picks (U1 Q3, U2 Q1, U4 Q2, U6 Q1/Q2/Q4) can't reach their pointer (fixer's note); fine by design, but those `say` lines are never heard.
- C1-26 ("fewer" that leads to adding) still needs the user's decision (fixer §1).

## 6. Guideline gaps (proposed; I didn't edit these files)

1. **grade-1.md → Limits, Story row:** change "1–2 sentences + the question" to "1–2 sentences + the question; a change- or start-missing story may use 3 short sentences (start, change, end; 6 words or fewer each) + the question." The file's own example ("3 birds. Some more came. Now there are 7. How many came?") already does this.
2. **math-language-traps.md §1 table**, add: "say | speak aloud ('Say 3 numbers') | suppose ('Say 3 are green') | K–2". Use only the first meaning in K–1.
3. **checklist.md §3 Voice row**, add: "Check that the voice says the same word the text prints (☐ is spoken 'blank'; if the text says 'box', override it)."
4. **scripts/english-check.cjs:** flag `${n} times` / `${n} numbers` and `them` after a pooled number with no singular case; flag "not" inside a question ("does the story not tell?"), not just "NOT".

## 7. What I could not check

- Real iOS/Safari speech and pacing; I used `speakableText()` and read the `data-tts-say` strings.
- Whether Practice auto-read honors `data-tts-say` inside a step prompt (the fixer's browser pass covered CFUs).
- Real students. I didn't open a browser; I read the code and the 29,078 generated lines (scratch bundle in the session scratchpad, not in the repo).
