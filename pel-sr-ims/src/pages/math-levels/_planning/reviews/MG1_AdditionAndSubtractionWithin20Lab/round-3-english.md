# MG1 Addition & Subtraction Within 20: English review, round 3 (final re-review)

- **Lab:** MG1 `AdditionAndSubtractionWithin20Lab` ("Addition & Subtraction Within 20"), 6 units + 6 unit Tests + Module Test
- **Round:** 3, the last round (re-review of `round-2-merged.md` + `round-2-fixes.md`)
- **Date:** 2026-11-17
- **Grade assessed:** 1st (plan: Grade 1, 1.OA.1–1.OA.8). Audience: K/1st first-timers and behind 2nd graders, alone on an iPad, audio-first. As in rounds 1–2, text a student must hear or read *to act* is held to the **Kindergarten** limits (8 spoken words, one idea); grade-1.md is used for math words and word-problem types.
- **User decisions kept:** ☐ is still spoken "blank" (E2-38, Skip). "Challenge: fewer stories" is an optional U4 type outside Mixed, stars, the Unit Test and the Module Test. Making Ten keeps "bigger number / smaller number". Start-missing stories stay (judged on wording only).
- **Method:** `node scripts/english-check.cjs --grade 1` on the shell + lab folder (513 strings, 19 flagged, was 18 of 509; every flag is an earlier, accepted one). Read every changed CFU question (U1 Q3, U2 Q1, U4 Q2/Q3, U6 Q1/Q2/Q4 and both twins), every `LOOK` `say` line, the new U3 "What is missing?" lines, the U1 Explore count line, and the challenge type. Bundled all 6 units + Module Test with esbuild and ran every Practice bucket 800× (incl. the challenge), every Test generator 500× and every Module Test question 200× (49,569 unique lines), then grepped for n = 0/1 agreement, "them" for 1, a/an, "did + past", and each round-2 phrase.

## 0. Status of round 2's English fixes

| ID | Round 2 | Status | Note |
|---|---|---|---|
| E2-33 | Major | **Fixed** | 0 "1 times / 1 numbers / Add them" in 49k lines. Now "Count back 1 time from 12.", "Say 1 number after 14.", "1 went away. Add it back to 5." U1 Explore uses "1 time / 3 times". All n = 1 lines in U4 use "1 is green… How many are orange?". |
| E2-34 | Minor | **Fixed** | No "Say 3 are…" left (CFU, Practice, Test). |
| E2-35 | Minor | **Moot** | The question was removed (C2-01). Its replacement, Q2, is now five sentences: E3-53. |
| E2-36 | Major | **Fixed** | Lines use the picture's numbers in operation order ("Change missing? Start at 5. Count on to 8." / "Start missing? Start at 8. Take away 3." / "…Count back to 6." / "…Add back 3."). Q3 and Q6 have their own spots and say lines; Q3's nudge, pointer and Explore line all say "count on"; Q6's say "start at the end, take away". |
| E2-37 | Minor | **Fixed** | "The story tells two numbers. Which one is missing?" |
| E2-38 | Minor | **Skip (user)** | ☐ still spoken "blank". Not re-reported. |
| E2-39 | Minor | **Fixed** | "count on" everywhere; no "count up" in code or generated text. |
| E2-40 | Minor | **Fixed** | "To take away, you can add." / "Use adding. 8 + ☐ = 12." / Test hint "8 + ☐ = 12." (One small voice slip in the Explore line: E3-59.) |
| E2-41 | Minor | **Fixed** | "Picture the story. Did it go up or down?" / "Do you put together or take away?" |
| E2-43 | Polish | **Fixed** | "You counted on 3 times from 6. Now you are on 9." / "9 + 3. Count on from 9. What is the total?" |
| E2-44 | Minor | **Fixed** | "2 got 1 bigger. It is 3 now. What happens to 4?" / "3 got bigger. So the box gets smaller." / "5 is 3 and how many more?" |
| E2-45 | Polish | **Fixed** | `LOOK.rule` "One hop for each one you take away." `LOOK.any` "Fill the ten. Then add the rest." `LOOK.diff` matches Q4/Q5's nudge; Q6 has its own line. |
| E2-46 | Polish | **Fixed, but caused a new problem** | Praise and CFU show lines are good. My Practice Show me rewrite "Lily has 6 and 3 more: 7, 8, 9." says the wrong person has 6, and the new challenge copies it: E3-51. |
| E2-47 | Polish | **Fixed** | "Solve stories. Add more or take some away." |
| E2-48 | Minor | **Fixed** | "Solve Mixed problems by yourself. That fills your stars." |
| E2-49 | Polish | **Fixed** | "Find each side. Do they match?" / "A box can hide a number. What number makes both sides the same?" / "The first side is 8…" |
| E2-50 | Polish | **Fixed** | "Put Together and Compare Stories"; labels without slashes. (U3's title now doesn't match U4's style: E3-57.) |

**Totals:** 17 round-2 items → **14 Fixed, 1 Fixed but caused a new problem (E2-46), 0 Not fixed, 1 moot (E2-35), 1 user skip (E2-38).**

## 1. Verdict

**Ready.** No Blockers or Majors are left. The CFUs, pointer lines and generated hints are short, grammatical for every value (n = 0 and n = 1 included), and say the same method as each other. Four Minor items remain. The most important: two "Show me" lines say a person has the other person's number ("Lily has 6 and 3 more", where Ben has 6), and one of them sits in the new challenge, whose whole point is who has more. The other three: the challenge label "fewer stories" can be heard as "a smaller number of stories", U4 CFU Q2 is a five-sentence question, and U6 Q2 praises a correct "No" with "Yes!". This is the last round, so everything below is an **open item**.

## 2. Scorecard

"% over" is the script's share of strings with a sentence over the 1st-grade limit (task / screen).

| Part | Length (% over) | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / home | OK (screen join) | Strong | OK (E3-60 "activity above… unlock") | n/a | Strong | Strong |
| U1 Counting On and Back | Strong (0% / 0%) | Strong (E2-33 fixed) | Strong | n/a | Strong | Strong |
| U2 Making Ten | Strong (0% / 0%) | Strong | Strong | n/a | OK ("blank", user) | Strong |
| U3 Add To / Take From | Strong (0% / screen join) | Strong | Strong | Strong | OK ("blank", user) | OK |
| U4 Put Together / Compare | Strong (0% / 0%) | OK (E3-51) | OK (E3-52 label) | OK (challenge = harder "fewer → add" form, user decision; Q2 length E3-53) | Strong | OK (E3-53) |
| U5 Fast Facts | Strong (0% / 0%) | Strong | Strong | Strong | OK (E3-59) | Strong |
| U6 Equal Sign | Strong (0% / 0%) | OK (E3-54 "Yes!" after "No") | Strong | n/a | OK (E3-54 two questions back to back) | Strong |
| Module Test | Strong | Strong (inherits E2-33 fix) | Strong | Strong (1 start-missing) | OK ("blank") | OK |

## 3. All findings (new this round, all open)

Counts: **0 Blocker, 0 Major, 4 Minor, 6 Polish** (10 new findings; IDs continue after E2-50).

### Unit 4: Put Together and Compare

**E3-51 · Minor · "Lily has 6 and 3 more" says the wrong person has 6** *(from my E2-46 rewrite)*
- **Where:** Practice Show me, compare bigger-unknown `PutTogetherCompareWordProblems.tsx:535`; challenge Show me `:616`.
- **Text (real draws):** story "Ben has 6 crayons. Lily has 3 more than Ben. How many crayons does Lily have?" → Show me "Lily has 6 and 3 more: 7, 8, 9." Challenge: "Max has 5 fewer toy cars than Grace. Max has 2…" → "Grace has 2 and 5 more: 3, 4, 5, 6, 7." / "Lily has 11 and 1 more: 12."
- **Breaks:** checklist §3 "Text vs. picture" (each sentence must be true on its own); grade-K.md Grammar (a K listener hears "Grace has 2" as a whole idea and stops). In the challenge, this is the exact mix-up the type exists to fix (who has more).
- **Rewrite:** `${ctx.b} has ${base}. ${ctx.a} has ${diff} more: ${countWords(base, biggerAmount)}.` → "Ben has 6. Lily has 3 more: 7, 8, 9." / challenge: `${ctx.b} has ${small}. ${ctx.a} has ${diff} more: ${countWords(small, big)}.` → "Max has 2. Grace has 5 more: 3, 4, 5, 6, 7."

**E3-52 · Minor · "Challenge: fewer stories" can mean "not as many stories"**
- **Where:** problem-type label `PutTogetherCompareWordProblems.tsx:642` (shown on the type picker next to "Mixed").
- **Breaks:** traps §1 (a word with two meanings): "fewer stories" reads as "a smaller number of stories". A 1st grader who can read "fewer" will read it that way, and so will a teacher.
- **Rewrite:** "Challenge: tricky compare stories" (or "Challenge stories"). Keeps the user's decision (a challenge, labeled in student words); the Practice title already says "Challenge".

**E3-53 · Minor · U4 CFU Q2 is four sentences + a question (19 words) with a sentence that adds nothing**
- **Where:** `PutTogetherCompareWordProblems.tsx:81` "Jake has 6 cards. Some are sports cards. Some are animal cards. 2 are sports cards. How many are animal cards?" (fixer flagged it for me.)
- **Breaks:** grade-1.md Limits, Story row (1–2 sentences + the question; at most 3 short ones); grade-K.md Limits (one idea at a time). "Some are sports cards" is replaced two sentences later by "2 are sports cards", so a listener holds a fact that is then changed. Each sentence is short (≤ 5 words), so this is Minor, not Major.
- **Rewrite:** "Jake has 6 cards. 2 are sports cards. The rest are animal cards. How many are animal cards?" (Q3 "Now 5 are sports cards. How many are animal cards?" still follows; the idea "6 can be split many ways" still lands in Q3's praise.)

**E3-56 · Polish · Passive praise and "Count the rest: 7" that doesn't count**
- **Where:** CFU Q3 praise `:103` "Yes! 6 can be split many ways."; Practice wrap-up (both-parts-unknown) "6 buttons can be green and orange in many ways."; Practice Show me `:413` and `:445` "1 is green. Count the rest: 7. That is another way." (says "count" but gives one number; the CFU version counts "1, 2, 3, 4").
- **Breaks:** grade-1.md Grammar (passive); checklist §3 (the words should say what the Show me does).
- **Rewrite:** "Yes! You can split 6 many ways." / "You can split 6 buttons many ways." / "1 is green. The rest are 7. That is another way." (or count them, as in the CFU).

### Unit 6: Equal Sign

**E3-54 · Minor · "Yes!" after a correct "No", and two questions back to back before the twin**
- **Where:** CFU Q2 `EqualSignAndEquations.tsx:143` praise "Yes! 2 + 3 is 5, not 6." (the student just tapped "No, false"); Q2 wrong-pick reason `:141` "Add up each side. Are they the same?" is spoken right before the twin's question "Is 7 the same as 4 plus 3?" (the fixer notes the voice also reads "2." in between).
- **Breaks:** grade-K.md Feedback (2–5 words that match what the child did); english-learners.md (yes/no answers are taken literally: a child who said "No" and hears "Yes!" may think the voice disagrees); grade-K.md Limits (one question at a time).
- **Rewrite:** praise "Right! 2 + 3 is 5, not 6." · Q2's reason (only heard when the twin follows): "Add up each side. Try this one." (keeps the twin's own reason, "Add up each side. Are they the same?", as is). Optional: skip reading the number "2." before a twin (shared `PickCheck`, fixer's call).

**E3-60 · Polish · "Which one is true?" while the buttons are read "6 equals 9"**
- **Where:** CFU Q1 `:96`; option labels are spoken through `mathSpeech` as "6 equals 9 / 6 equals 6 / 6 equals 3", while the rest of the unit says "the same as".
- **Breaks:** english-learners.md (one word for one idea).
- **Rewrite:** prompt "Which one is the same on both sides?" (8 words). Optional: `data-tts-say` "6 is the same as 9" on each button.

### Unit 1 and Unit 2

**E3-55 · Polish · "Type the number you start at" / "Type the number you break apart"**
- **Where:** U1 CFU Q3 `CountingOnAndBack.tsx:95`; U2 CFU Q1 `MakingTenAndDecomposing.tsx:97`.
- **Breaks:** grade-K.md Grammar (a relative clause; "at" left at the end). Both units already ask the same thing as a plain question.
- **Rewrite:** "3 + 8. Where do you start?" (U1 Q1's wording) / "6 + 9. Which number do you break apart?" (U2 Practice's wording). Both stay typed.

### Unit 3

**E3-57 · Polish · U3 title doesn't match U4's new style**
- **Where:** `AddToTakeFromWordProblems.tsx:544` "Word Problems: Add To and Take From" (the colon is silent when read aloud); U4 is now "Put Together and Compare Stories".
- **Rewrite:** "Add To and Take From Stories" (update `ModuleTest.tsx:44` comment to match).

### Unit 5

**E3-59 · Polish · "12 − 8: 8 and how many make 12?" runs together when spoken**
- **Where:** Explore `FluencyFactsWithin20.tsx:221`. Spoken: "12 minus 8 8 and how many make 12?" (the colon is silent; two 8s in a row).
- **Breaks:** traps §8 (punctuation the voice drops).
- **Rewrite:** "To take away, you can add. 12 − 8. Start at 8. How many more make 12?"

### Shell

**E3-58 · Polish · "Complete the activity above to unlock practice problems."**
- **Where:** `MG1_AdditionAndSubtractionWithin20Lab.tsx:299` (read aloud under the locked Practice button).
- **Breaks:** grade-1.md Math/school words ("complete", "activity", "above", "unlock" are teacher words); 9 words.
- **Rewrite:** "Do the check first. Then you can practice." *(Probably the same in other lab shells; change it once in all if the user agrees.)*

## 4. What's working well

- **Every generated line is grammatical for n = 0 and n = 1** across 49,569 lines: "1 time", "1 number", "add it back", "1 is green", "1 fewer crayon", "0 are left", "Take away 0. All 10 are left."
- **U3 now speaks with one voice.** For Q3, the nudge, the pointer and the Explore line all say "count on to the end"; for Q6, all say "start at the end, take away". The numbers are said in the order you use them.
- **The new typed CFUs are short** (U1 Q3 7 words, U2 Q1 7 words, U4 Q3 9 words) and keep the K-style named reasons ("Don't start at 1. Start at a number you have.", "6 cards in all. Don't add.").
- **The twin flow reads well** ("Watch: 4 and 3 make 7. Both sides are 7.") and the spoken "Is 6 the same as 2 plus 3?" stays.
- **The challenge story is clean at every value:** "Ella has 4 fewer pencils than Noah. Ella has 13. How many pencils does Noah have?", hint "Ella has fewer. So Noah has more." (no keyword teaching; it points at who has more).
- Making Ten "bigger number / smaller number" wording is unchanged and consistent.

## 5. Out of my lane (for the curriculum checker)

- U1 CFU Q1 ("Where do you start?") and Q3 ("Type the number you start at.") both have the answer 8, and Q1 stays on screen above Q3.
- The challenge is the "fewer → bigger unknown" form CCSS Table 1 lists as the harder, 2nd-grade-mastery compare form. It is optional and labeled a challenge per the user, so I judged only its wording.
- The voice reads the question number ("2.") before a twin question (fixer's note); harmless but extra words.

## 6. Guideline gaps (proposed; I didn't edit these files)

Carried from round 2 (still not in the files): grade-1.md Story row (3 short sentences allowed for change/start-missing); traps §1 "say = suppose"; checklist §3 "voice says the same word the text prints"; english-check.cjs flags for `${n} times` / "them" after a pooled number / "not" in a question. New:
1. **checklist.md §3 "Generated plurals"**, add: "Read Show me lines as standalone sentences: '{A} has {x} and {d} more' says A has x. Name each person with their own number ('Ben has 6. Lily has 3 more.')."
2. **grade-K.md Feedback**, add: "Praise starts with a word that fits the tap. After a correct 'No', say 'Right!' not 'Yes!'."
3. **math-language-traps.md §1**, add: "fewer | compare word | 'fewer stories' = not as many stories | K–2. Don't use 'fewer' as a label adjective."

## 7. What I could not check

- Real iOS/Safari speech and pacing (I read the strings, the `data-tts-say` overrides and `mathSpeech.ts`).
- How the type-picker label is spoken on the device (whether labels auto-read).
- Real students. I didn't open a browser this round; the fixer's iPad-size pass covered the twin flow (scratch bundle and lines: `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\4a0a5ada-0427-4375-a535-7a7815b05751\scratchpad\r3eng\`).
