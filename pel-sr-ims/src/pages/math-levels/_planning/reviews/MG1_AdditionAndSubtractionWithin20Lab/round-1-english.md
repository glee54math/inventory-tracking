# MG1 Addition & Subtraction Within 20: English review, round 1

- **Lab:** MG1 `AdditionAndSubtractionWithin20Lab` ("Addition & Subtraction Within 20"), 6 units + 6 unit Tests + Module Test
- **Round:** 1 (full review; no round-0-build.md)
- **Date:** 2026-11-17
- **Grade assessed:** 1st (plan: Grade 1, 1.OA.1–1.OA.8). Audience: K/1st first-timers and 2nd graders who are behind, alone on an iPad, audio-first. Because most of this audience can't read yet, I held text the student must *read or hear to act* to the **Kindergarten** limits (8 spoken words, one idea, no "not yet" grammar) and used the 1st-grade file for math words and word-problem types.
- **Read-aloud:** yes (TtsProvider, ReadAloud on every CFU box, feedback, goal and Key Idea; Practice/Test auto-read). I checked the voice with `speakableText()` from `shared/tts/mathSpeech.ts`.
- **Method:** `node scripts/english-check.cjs --grade 1` on the shell + lab folder (569 strings, 290 flagged), then per unit. I read every screen in order (home, Explore, CFU, Practice, Test, Module Test). I bundled the lab with esbuild and ran every Practice bucket 400 times and every Test generator 300 times, printing each unique sentence (1,460 lines), and grepped them for agreement and verb-form errors. The new CFU "Look here" `say` lines and the 12 new Explore teaching lines were read as a listener.
- **User decision kept:** Making Ten uses "bigger number / smaller number" (break apart the smaller number). Every rewrite below keeps that framing.

## 1. Verdict

**Not ready for K–1 students yet. The Explore pictures and the new "Look here" lines are good, but most of the text around them was written for 3rd–4th graders.** The biggest reason: 12 questions (CFUs, unit Tests and the Module Test) are wordy **"True or false: …" statements about strategies**, 13 to 38 words long, with words like *strategy, addend* and *generalization*. A 1st grader who can count back or make a ten will still get these wrong, and each unit Test passes at 9 out of 10. Second, the **compare "smaller unknown" problems use the wrong-way wording** ("Grace has 9. Grace has 3 more than Max. How many does Max have?"), which CCSS says 1st graders meet but don't have to master; it is a required Practice bucket and a Test question. Third, **generated stories have grammar errors on many draws** ("How many buttons did Nora found?", "Liam dropped 1 shells", "if 1 are green"). Fourth, **CFU sentences average 15–36 words and wrong-answer feedback states the answer.**

## 2. Scorecard

"% over" is the script's share of strings with a sentence over the 1st-grade limit (10 words).

| Part | Length (% over) | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / home | OK (14%) | Strong | OK ("cumulative," "reps," "mastery") | n/a | Strong | OK |
| U1 Counting On and Back | **Weak (46%)** | OK | OK | n/a | OK ("cross out of the teens") | **Weak** (CFU) |
| U2 Making Ten | **Weak (38%)** | OK | **Weak** (addend, decomposing, strategy, bridging, increase/decrease) | n/a | Strong | **Weak** (CFU) |
| U3 Add To / Take From | **Weak (39%)** | **Weak** ("did Nora found," "1 shells," "had 0") | **Weak** (unknown, result, structure, keywords) | **Weak** (start-unknown required; coins/pennies) | Strong | **Weak** (3 long role options) |
| U4 Put Together / Compare | Weak (32%) | **Weak** ("1 are green," "Grace has 9. Grace has 3 more") | **Weak** (difference, addend, valid, calculation) | **Weak** (wrong-way compare required) | OK (slash, reversed "take the smaller from the bigger") | **Weak** (CFU) |
| U5 Fluency Facts | OK (27%) | Strong | **Weak** (fluency, addends, recall, automatic) | n/a | OK ("(4+8)+2" reads the same as "4+(8+2)") | Weak (CFU) |
| U6 Equal Sign | Weak (32%) | OK | **Weak** (equation, sum used two ways, compute, operation) | n/a | OK (≠ is fine; "Is 8 = 8 true or false?") | Weak (CFU) |
| Module Test | OK (inherits) | **Weak** (inherits the plural bugs) | Weak (inherits) | Weak (2 start-unknown items) | OK | OK |

## 3. All findings

Counts: **2 Blocker, 15 Major, 11 Minor, 4 Polish** (32 findings).

### Lab-wide

**E1-01 · Blocker · Conceptual "True or false: …" statements (12 questions)**
- **Where:**
  - CFU: `CountingOnAndBack.tsx:231` (Q4, 26 words), `MakingTenAndDecomposing.tsx:263` (Q3, 24 words), `AddToTakeFromWordProblems.tsx:172` (Q3, 21 words), `FluencyFactsWithin20.tsx:119` (Q2, 22 words)
  - Unit Tests: `CountingOnAndBackTest.tsx:96` and `:188`, `MakingTenAndDecomposingTest.tsx:187` (38 words), `AddToTakeFromWordProblemsTest.tsx:233`, `PutTogetherCompareWordProblemsTest.tsx:220`, `FluencyFactsWithin20Test.tsx:174`
  - Module Test: `orderDoesNotMatterQuestion` (from FluencyFactsWithin20Test)
  - Example: "True or false: the make-ten strategy (find the gap to ten, split the other addend, then add) works for ANY addition fact with a number close to ten — not just the one example you first practiced it on."
- **Breaks:** builder → Audience and language, K–1 row ("No vocabulary questions, no true/false"); K–1 CFU ("Check the idea with a picture, not a vocabulary question… Instead of 'true or false: turning changes a shape,' show the turned square"); grade-K.md and grade-1.md Limits (8–10 words, one idea); grade-1.md Grammar "not yet" (*if/when* clauses; "never one more, never one less" negation); traps §6.1 and §6.5. The answer depends on untaught words (*strategy, addend, generalization, single digits*). This is not the 1.OA.7 equation true/false ("Is 8 = 8 true?"), which is in the standard and stays (see E1-29).
- **Rewrite:** Replace each statement with a short question about **one new example** of the same idea, answered by typing or picking a number. The explanation can then say the rule in a few words.
  - U1 CFU Q4 / Test "count back rule": "13 − 4. How many times do you count back?" (pick 3, 4, 5). Right: "Yes! Take away 4. Count back 4 times."
  - U1 Test "bigger number rule": "4 + 9. Which number do you start at?" (4 / 9). Right: "Yes! Start at 9, the bigger number."
  - U2 CFU Q3 / Test "strategy": a new bond fill, "7 + 5. Make a ten. Break apart 5." Right: "Yes! Making ten works again."
  - U3 CFU Q3 / Test "result rule": "Ana had 9 shells. She lost some. Now she has 6. What is missing?" (the start / the change / the end). Right: "Yes! The change is missing."
  - U4 Test "more and fewer": two typed boxes, "Grace has 9 shells. Max has 5. How many more does Grace have?" then "How many fewer does Max have?" Right: "Yes! Both are 4."
  - U5 CFU Q2 / Test / Module Test "any order": "4 + 8 + 2. Add 4 + 8 first. What is the total?" (typed). Right: "Yes! 14 again. Any order gives 14."

**E1-02 · Major · Generated stories break singular/plural and "1 are…" for small numbers**
- **Where:** (found by running every generator)
  - U3 Practice `AddToTakeFromWordProblems.tsx:341, :356, :370, :397, :412, :426` and Test `AddToTakeFromWordProblemsTest.tsx:36, :62, :91, :117, :146, :170, :196, :216, :264`: "Liam dropped 1 shells, and now has 0 shells left." / "Mia had 1 balloons." / "Then Zoe got 1 more stickers." / "Mia had 0 stickers. Then Mia got 5 more stickers." (start can be 0, so the story starts with nothing, and "more" makes no sense)
  - U4 Practice `PutTogetherCompareWordProblems.tsx:426, :441, :470–471, :486, :504, :539, :563` and Test `:35, :55, :87, :108, :134, :161, :181, :203`: "Give one way: if 1 are green, how many are orange?" / "Theo has 1 more pebbles than Zara." / "Mia has 1 green buttons"
- **Breaks:** builder → "Generated sentences must be grammatical for every value" (singular/plural, is/are); checklist §3 "Generated plurals."
- **Rewrite:** Keep a singular form in each context (`item1: "sticker"`) and a helper `n === 1 ? item1 : item`; use `is/are` the same way ("If 1 is green…"). Don't let `start` be 0 in add-to stories (`randInt(1, 15)`). Examples: "Liam dropped 1 shell. Now he has 4 shells." / "Say 1 is green. How many are orange?" / "Theo has 1 more pebble than Zara."

**E1-03 · Major · CFU questions are long, multi-part and full of dash asides (all 24 questions)**
- **Where:** every CFU in the 6 units (script: 45 of 68 screen strings over, median longest sentence 17 words). Examples: `CountingOnAndBack.tsx:63` (26 words, two questions in one sentence, a parenthetical), `:124` (22 words), `PutTogetherCompareWordProblems.tsx:123` (14-word label), `FluencyFactsWithin20.tsx:157` (with a negative in parentheses), `:195` ("Without counting one-by-one, use what you know about making ten to quickly find 9 + 7."). Feedback lines run 12–26 words (`CountingOnAndBack.tsx:142–143`, `:206` "…is the #1 count-back mistake", `FluencyFactsWithin20.tsx:138` "…a safe shortcut, not a risk").
- **Breaks:** grade-K.md and grade-1.md Limits (8–10 words, 1 action, feedback "a few words"); builder K–1 CFU ("One short sentence per question, under ~10 words… Feedback is a few words"); checklist §5 (K–1: nothing to read before acting).
- **Rewrite:** (these work in today's layout or in a KCheck one-at-a-time layout; "Right" / "Not yet" are the feedback lines, and no "Not yet" line states a box's answer — see E1-04)

  | Q | Rewrite (spoken) | Right | Not yet |
  |---|---|---|---|
  | U1 Q1 | "8 + 3. Count on. Where do you start?" then "How many more numbers do you say?" | "Yes! Start at 8. Say 9, 10, 11." | "Don't start at 1. Count on." |
  | U1 Q2 | "3 + 8. Which number do you start at?" (options "3", "8", no parentheses) | "Yes! Start at 8. It is bigger." | "Which number is bigger?" |
  | U1 Q3 | "12 − 3. Count back from 12. Say 3 numbers." | "Yes! 11, 10, 9." | "Count back one at a time. Don't say 12." |
  | U1 Q4 | see E1-01 | | |
  | U2 Q1 | "6 + 9. Which number do you break apart?" (options "6", "9") | "Yes! Keep 9 whole. Break apart 6." | see E1-05 |
  | U2 Q2 | "8 + 6. Make a ten. Break apart 6." | "Yes! 8 + 6 = 14." | "Fix the red boxes. Count the empty boxes." |
  | U2 Q4 | "13 − 5. Get to 10 first. Break apart 5." | "Yes! 13 − 5 = 8." | "Fix the red boxes. How many are past 10?" |
  | U3 Q1–Q4 | keep the stories (Q4: stickers, not pennies, E1-20); box label "What is missing?" with options "the start / the change / the end" (E1-08) | Q1 "Yes! The end is missing." Q2 "Yes! The change is missing." | "Which number does the story not tell?" |
  | U4 Q1 | label "What is missing?" options "the total / a part" | "Yes! 4 + 5 = 9." | "Put the two parts together." |
  | U4 Q2 | "Jake has 6 cards. Some are sports cards. Some are animal cards." / "Is there just one way?" ("Just one way" / "More than one way") / "Say 2 are sports cards. How many are animal cards?" | "Yes! 2 and 4 works. So does 1 and 5." | "Try other ways to split 6." |
  | U4 Q3 | see E1-10 | "Yes! Both are 4." | "Line them up. Count the extra." |
  | U4 Q4 | "Which one finds the answer?" | "Yes! 9 − 5 = 4." | "Start with the bigger number." |
  | U5 Q1 | "4 + 8 + 2. Which two do you add first?" | "Yes! 8 + 2 = 10. Then 10 + 4 = 14." | "Find two numbers that make 10." |
  | U5 Q3 | "4 + 3 = 7. 8 + 7 = 15. Which total is past 10?" (the answer becomes 8 + 7) | "Yes! 15 is past 10." | "Look at each total. Is it past 10?" |
  | U5 Q4 | "9 + 7. Make a ten first. What is the total?" | "Yes! 9 + 1 = 10. 10 + 6 = 16." | "9 needs 1 more to make 10." |
  | U6 Q1 | "What does = mean?" ("The answer comes next" / "Both sides are the same amount") | "Yes! = means the same as." | "Look at both sides of the scale." |
  | U6 Q2 | "Is it true?" with each equation spoken as "Is 5 the same as 2 plus 3?" (`data-tts-say`); options "Yes" / "No" | "Yes! Both sides match." | "Add up each side. Are they the same?" |
  | U6 Q3 | "Is it true? 8 = 8" (spoken "Is 8 the same as 8?") | "Yes! 8 is the same as 8." | "Look at both sides." |
  | U6 Q4 | "8 + ☐ = 11. What number goes in the box?" | "Yes! 8 + 3 = 11." | "Count up from 8 to 11." |

  Gate title (`CountingOnAndBack.tsx:268`, `MakingTenAndDecomposing.tsx:329`, `AddToTakeFromWordProblems.tsx:147`, `PutTogetherCompareWordProblems.tsx:296`, `FluencyFactsWithin20.tsx:232`, `EqualSignAndEquations.tsx:237`, 15–18 words each): "Let's check! Answer these to open practice."

**E1-04 · Major · CFU wrong-answer messages state the answer**
- **Where:** all 24 CFU "Not quite" lines, e.g. `AddToTakeFromWordProblems.tsx:117` (prints `Not quite — ${explain}`, so Q1 says "…6 + 5 = 11" and Q4 says "…11 − 4 = 7"), `PutTogetherCompareWordProblems.tsx:84, :152, :216, :278`, `FluencyFactsWithin20.tsx:100, :215`, `EqualSignAndEquations.tsx:73, :141, :180, :220`, `CountingOnAndBack.tsx:98, :143, :206, :251`. The BondFill hints also give a box's answer: `MakingTenAndDecomposing.tsx:202` "9 needs 1 more to make 10" (box = 1), `:237` "8 needs 2 more" (box = 2), `:310` "Take away 3 first" (box = 3).
- **Breaks:** builder "A wrong-answer message must not state the answer"; checklist §3 "Giveaways… a wrong-answer message must not state any box's answer."
- **Rewrite:** the "Not yet" column in E1-03. Give the RolePlusNumberQuestion separate `right` and `wrong` strings instead of one shared `explain`.

**E1-05 · Major · Making Ten CFU Q1: the wrong-answer nudge points to the wrong number**
- **Where:** `MakingTenAndDecomposing.tsx:188` "Not quite. Which number is closer to 10? Try again!" The only wrong pick is 9, and 9 *is* closer to 10, so the nudge sends the student back to the same wrong answer.
- **Breaks:** checklist §3 "Text vs. picture"/giveaways; builder K–1 ("a short nudge that says what to do").
- **Rewrite:** "Not yet. Keep the bigger number whole. Break apart the other one." (keeps the user's bigger/smaller framing; with two choices, any useful nudge narrows it to one, which the K–1 design allows for a known wrong answer).

**E1-06 · Major · Later-grade and untaught math words (lab-wide)**
- **Where / replacement:**

  | Word | Where | Say instead |
  |---|---|---|
  | addend(s) | `MakingTenAndDecomposing.tsx:540–548`, Test `:151, :168–170, :187`; `FluencyFactsWithin20.tsx:52, :273, :445`; `PutTogetherCompareWordProblems.tsx:63, :412, :428, :443`; `EqualSignAndEquations.tsx:424, :441`, Test `:151` | "number," "part," "the first number / the second number," "Three numbers" |
  | sum | `EqualSignAndEquations.tsx:140, :365, :478`, Test `:66`; `MakingTenAndDecomposing.tsx:540`; `FluencyFactsWithin20.tsx:455` | "total" (see also E1-15) |
  | difference | `PutTogetherCompareWordProblems.tsx:379, :554, :578`, Test `:182, :204` | "the gap" (the unit already uses it) or "how many more" |
  | equation | `EqualSignAndEquations.tsx:109, :220, :407, :424, :441, :457, :474, :479`, title `:473` | "number sentence" (U2 already says "number sentences") |
  | compute / computation / computing / calculation | `EqualSignAndEquations.tsx:179–180, :381`, Test `:82`; `PutTogetherCompareWordProblems.tsx:516`, Test `:134` | "add," "Which one finds the answer?" |
  | strategy, method, repeatable, memorized | `MakingTenAndDecomposing.tsx:282–283, :585`, Test `:187–189`; `FluencyFactsWithin20.tsx:214` | drop (E1-01); "Making ten works every time." |
  | decomposing | U2 title `:579` | "Making Ten" |
  | fluency, recall, AUTOMATIC | U5 title `:470`, `:302, :364, :475`, Test `:50, :63` | "Fast Facts to 20," "Know it fast." |
  | operation | `EqualSignAndEquations.tsx:354` (title) | "Adding on both sides" |
  | increase / decrease | `MakingTenAndDecomposing.tsx:544–545` | "It gets bigger by 2" / "It gets smaller by 2" |
  | valid | `PutTogetherCompareWordProblems.tsx:152, :466, :591`, Test `:78` | "works" |
  | structure, keywords, misleading, real-world, whichever | `AddToTakeFromWordProblems.tsx:443, :448` | see E1-16 |
  | information | `PutTogetherCompareWordProblems.tsx:412` | "Which number does the story not tell?" |
  | ones digit, drop | `MakingTenAndDecomposingTest.tsx:86` | see E1-14 |
  | bridging / bridge through ten | `MakingTenAndDecomposing.tsx:362, :489, :506`, Test `:127`; `FluencyFactsWithin20.tsx:418`, Test `:93` | "Get to 10 first" (the new Look-here line already says this) |
  | single digits, boundary | `CountingOnAndBackTest.tsx:188` | "below 10" |
  | cumulative, reps, mastery | shell `:120, :462, :323` | E1-27 |
- **Breaks:** grade-1.md → Math words ("*sum* and *addend*: teacher words first… say 'the total' and 'the parts'"; "Not yet: difference, … equation (as a word)"); grade-K.md "Not yet: decompose… sum, difference"; builder "No jargon ('addend,' 'decompose'…) unless the unit teaches that word first"; README idea 5.

**E1-07 · Major · Key Ideas and goals (read aloud at the top of every unit) are long, with dash asides**
- **Where:** goals `CountingOnAndBack.tsx:541`, `MakingTenAndDecomposing.tsx:580`, `AddToTakeFromWordProblems.tsx:443`, `PutTogetherCompareWordProblems.tsx:587`, `FluencyFactsWithin20.tsx:471`, `EqualSignAndEquations.tsx:474`; Key Ideas `CountingOnAndBack.tsx:545–546`, `MakingTenAndDecomposing.tsx:584–585` (31 words), `AddToTakeFromWordProblems.tsx:447–448`, `PutTogetherCompareWordProblems.tsx:591–592`, `FluencyFactsWithin20.tsx:475–476`, `EqualSignAndEquations.tsx:478–479` (17–31 words a sentence).
- **Breaks:** grade-K.md / grade-1.md Limits; traps §6.3 ("If you know one amount…"); checklist §5.
- **Rewrite:**
  - U1 goal "Count on to add. Count back to take away." Key Idea "Start at the number you have. Then count on. Start at the bigger number. To take away 3, count back 3."
  - U2 goal "Make a ten to add and take away." Key Idea "Keep the bigger number whole. Break apart the smaller number. Fill the ten first. Then add the rest. To take away, get to 10 first."
  - U3 goal "Solve stories where some are added or taken away." Key Idea "A story has a start, a change, and an end. Find the one that is missing. Picture the story. Don't just look for one word."
  - U4 goal "Solve put-together stories and compare stories." Key Idea "Two parts make a total. To compare, line them up. Find the extra."
  - U5 goal "Know your facts to 20 fast." Key Idea "Try to know these facts fast. Adding three numbers? Add two that make 10 first."
  - U6 goal "Learn what = means. Find the missing number." Key Idea "= means the same as. Both sides have the same amount. The missing number can be anywhere."

**E1-08 · Major · "What's unknown?" role choices: long options, hard words, two names for one idea**
- **Where:** `AddToTakeFromWordProblems.tsx:22` (options read aloud as "the starting amount how much there was at the very beginning, the change how much was added or taken away, the result the amount at the end", about 30 words with a passive), `:85` and `:323` "What's unknown (in this story)?", `:323` hint "Decide: is it the starting amount, the change, or the result?"; Test `:11, :62–64`; `PutTogetherCompareWordProblems.tsx:57, :62–63` "one of the parts (an addend)", `:412`. The unit says start / starting amount / beginning, and end / ending amount / result / "total amount at the very END" (`:172`) for the same two ideas.
- **Breaks:** grade-1.md Limits; english-learners.md "Several words for one idea in the same unit"; "unknown" and "result" aren't K–1 words; traps §6.2 (passive).
- **Rewrite:** Label "What is missing?" (the Explore line already says "missing"). Options "the start / the change / the end" in U3 and "the total / a part" in U4. Hint: "Which number does the story not tell?" Rename the Explore "Result:" label (`:280`) to "End:". Explain: `The ${["start", "change", "end"][i]} is missing.`

**E1-09 · Major · Test: past-tense verb after "did" in every "how many did they get" Test question**
- **Where:** `AddToTakeFromWordProblemsTest.tsx:264` uses `ctx.verbAdd` after "did": "How many buttons did Nora **found**?" / "did Owen **earned**?" / "did Priya **got**?" / "did Theo **traded for**?" This happens on every draw of `addToChangeNumberQuestion` (Test Q10).
- **Breaks:** builder → "Verb form after a helper verb: 'How many did Mia get?', never 'did Mia got'… Keep separate pools for past-tense and base-form verbs."
- **Rewrite:** Add `verbAddBase` to the Test CONTEXTS (find, earn → see E1-20, get, trade for) and use it: "How many buttons did Nora find?"

**E1-10 · Major · Echo questions with the question word in the middle**
- **Where:** `PutTogetherCompareWordProblems.tsx:186` "Lily has how many MORE crayons than Ben?", `:197` "Ben has how many FEWER crayons than Lily?"
- **Breaks:** english-learners.md "Echo questions… Use… the question word first"; grade-1.md word problems ("How many more does Ann have?").
- **Rewrite:** "How many more crayons does Lily have than Ben?" / "How many fewer crayons does Ben have than Lily?"

**E1-11 · Major · Needs the user's decision: start-unknown stories are required for mastery**
- **Where:** U3 buckets `addToStart` and `takeFromStart` (`AddToTakeFromWordProblems.tsx:367–381, :423–437`) are in `requiredBuckets`; CFU Q4 (`:197`); Unit Test Q3, Q6, Q7, Q8 (`AddToTakeFromWordProblemsTest.tsx:75, :158, :181, :205`); Module Test (2 of 30).
- **Breaks:** grade-1.md → Word problems: start unknown is "Meet, but don't require mastery… think twice before making them a required bucket or a Test question that counts toward passing" (CCSS Table 1: mastery in 2nd). The plan asked for them, so this is a plan-level choice, not a fix I can make.
- **Options for the user:** (a) keep them required but give them the most picture support and the shortest sentences (the current stories are 2 sentences, which is fine); (b) make them a non-required "Challenge" Practice type and take them out of the Test's pass count; (c) keep them in Practice, keep 1 in the Test.

**E1-12 · Major · "Left" means two things in one lab**
- **Where:** "how many are still there": `AddToTakeFromWordProblems.tsx:397, :404, :412, :426` ("have left," "now has 5 left"), `MakingTenAndDecomposing.tsx:405, :471` ("what is left," "left over"), `:425`, `MakingTenAndDecomposingTest.tsx:127`. "Side": `EqualSignAndEquations.tsx:282–288` (stepper labels "Left, first / Left, second / Right, first…"), `:336` "unknown on the left", `:341`, `:394, :406` "Add the left side", Test `:35, :66, :102, :120`.
- **Breaks:** traps §1 ("left… Don't use both in one lab"); grade-K.md Watch for.
- **Rewrite:** Keep "left" for "still there" (the word-problem meaning the standard uses). In U6 say "this side / that side" or "first side / other side": stepper labels "Side 1, first number" … "Side 2, second number" or plain "First / Second / Third / Fourth"; title "Equal sign: the box comes first"; hint "Add up the first side. Does it match the other side?"; "The blank is first this time."

**E1-13 · Major · U3 Explore teaching line is false for Take From stories (the new "atf-missing" line)**
- **Where:** `AddToTakeFromWordProblems.tsx:294` "Start or change missing? Take the number you know away from the end." It shows in both Explore modes. In a Take From story with the start missing ("gave away 3, now has 5") you add (5 + 3), and with the change missing you take the end away from the start (9 − 5), not the other way. The spoken pointer line (`:30` "Look here. Take away from the end.") has the same problem. The CFU questions that point here (Q2, Q4) are both Add To, so they work today; Practice and the Test use all four cases.
- **Breaks:** checklist §3 "Switches… a wrap-up sentence doesn't say which part it means" and "Text vs. picture."
- **Rewrite:** Make the line depend on `action`. Add To: "Start or change missing? Take the number you know away from the end." Take From: "Start missing? Add the end and the change." (and, if a change line is wanted: "Change missing? Take the end away from the start."). Keep the `say` line Add-To-only ("Look here. Take away from the end.") since only Add To CFU items point to it.

**E1-14 · Major · U2 Test hint is confusing and uses untaught words**
- **Where:** `MakingTenAndDecomposingTest.tsx:86`: "What's left of the starting number after you drop the ones digit?" The answer box asks how much to subtract to land on 10 (the ones), but the hint asks what is *left* (the ten).
- **Breaks:** grade-1.md (digit is 1.NBT, not taught in this lab); english-learners.md (idiom "drop"); checklist §3 "Text vs. picture."
- **Rewrite:** "How many are past 10?" (the same words as the Practice hint at `MakingTenAndDecomposing.tsx:502`).

**E1-15 · Major · "Sum" is used for two different things in U6**
- **Where:** `EqualSignAndEquations.tsx:140, :478` ("The sum doesn't have to sit alone on the right") use *sum* for the total number; `EqualSignAndEquationsTest.tsx:66` ("It doesn't matter that the sum is written on the right of the number") uses *sum* for "2 + 3", the addition. In "5 = 2 + 3" the first meaning puts the sum on the **left**, so the Test hint contradicts the CFU feedback. *Sum* is also heard as *some*.
- **Breaks:** grade-1.md (*sum* is a teacher word first); traps §2 homophones; README idea 5 (one meaning, used the same way).
- **Rewrite:** Use "total" for the number and "the adding" or "the plus side" for the expression. Test hint: "The total can come first. Do both sides match?" CFU feedback: "The total can be on either side."

**E1-16 · Major · U3 and U4 Explore lines that "Look here" points to are long**
- **Where:** `AddToTakeFromWordProblems.tsx:291` (atf-roles, 19 words + dash: "A story can ask for the start, the change, or the result — read carefully to see which one is missing."); `PutTogetherCompareWordProblems.tsx:356` (ptc-ways, 17 words + dash + slash); `:379–380` (ptc-diff, 33 words: "…The difference is always bigger − smaller = 5 — whether you call it "5 more" or "5 fewer" depends only on which amount you're talking about, not on the math."); `FluencyFactsWithin20.tsx:331` (flu-order, 17 words); `CountingOnAndBack.tsx:370` (cob-keep, 18 words, and "the very top" in Count back mode is wrong: you start at the start number, not at a top).
- **Breaks:** grade-K/1 Limits; checklist §5; a pointer sends the student to *one sentence*, so that sentence has to be the short version.
- **Rewrite:**
  - atf-roles: "A story can hide the start, the change, or the end. Which one is missing?"
  - ptc-ways: "Try other green and orange splits. The total stays the same."
  - ptc-diff: "{bigger} is bigger. {smaller} is smaller. The gap is {diff}." + new line "{bigger} has {diff} more. {smaller} has {diff} fewer."
  - flu-order: "Move the numbers around. The total stays {total}."
  - cob-keep: "You did not start over. You kept going from {start}." (no mode-specific "1 / the very top")

### Unit 1: Counting On and Counting Back

**E1-17 · Minor · "Cross out of the teens" sounds like "cross out"**
- **Where:** `CountingOnAndBack.tsx:523` (story), `:528`, `:534`; `CountingOnAndBackTest.tsx:151`. In this lab "cross out" also means to strike out (the Test explains and the Take From pictures cross things out).
- **Breaks:** english-learners.md phrasal verbs; traps §1 (two meanings in one lab).
- **Rewrite:** "Find 13 − 4 by counting back. You will go below 10." / wrap-up "13 − 4 = 9. You went below 10."

**E1-18 · Minor · Practice "start counting from, 5 or 5?" and "the number already given"**
- **Where:** `CountingOnAndBack.tsx:427` allows a = b, giving "Which number should you start counting from, 5 or 5?" with two identical buttons. `:444` hint "Start from the number you already have" and explain "Start at 9, the number already given": both numbers are given.
- **Breaks:** checklist §3 "False distractors"; Text vs. picture.
- **Rewrite:** generator `while (a + b > 20 || a <= b)`; hint "Start at the bigger number."; explain "Start at 9. It is bigger."

**E1-19 · Polish · "Even though 3 is written first, which number is the SMARTER one…"**
- **Where:** `CountingOnAndBack.tsx:471` (17 words, *even though* first), `:465` "(Notice 3 is written first.)", `CountingOnAndBackTest.tsx:62` "…even though 3 was written first — fewer counts that way."
- **Breaks:** grade-1.md Grammar (clause first); traps §6.3.
- **Rewrite:** "3 + 9. Which number do you start at?" / explain "Start at 9. It is bigger. You count less."

### Unit 3: Add To / Take From

**E1-20 · Minor · Settings a K–1 child may not know: money, "used up," "shared," trading**
- **Where:** CFU Q4 "pennies" (`AddToTakeFromWordProblems.tsx:197`); Test "Owen… coins… earned / spent" (`AddToTakeFromWordProblemsTest.tsx:16`); "Zoe… stamps… used up" (`AddToTakeFromWordProblems.tsx:315`); "Ava… shared" (`:313`; sharing doesn't always mean they're gone); "Theo… traded for / traded away" (Test `:18`).
- **Breaks:** traps §7 (coins before 2nd grade); english-learners.md phrasal verbs.
- **Rewrite:** CFU Q4 "Leo had some stickers. He got 4 more. Now he has 11. How many did he have at the start?"; Owen → "rocks… found / lost"; Zoe → "stamps… got / gave away"; Ava → "crayons… got / lost"; Theo → "cards… got / gave away."

**E1-21 · Minor · Test hint "The word 'more' already happened"**
- **Where:** `AddToTakeFromWordProblemsTest.tsx:92` and `:171` (`"gave away" already happened — to undo it…`), `:172` "…subtracting again gives the wrong direction", Practice `AddToTakeFromWordProblems.tsx:378` "'More' doesn't always mean add — … subtract it back out: result − change = start" (17 words, keyword talk).
- **Breaks:** a word can't happen; traps §9 (keyword teaching, even as "doesn't always mean"); grade-1.md Limits.
- **Rewrite:** Add To start-unknown: "He got more. To find the start, take those away." Take From start-unknown: "She gave some away. To find the start, add them back."

**E1-22 · Polish · Practice titles say "they" for one person**
- **Where:** `AddToTakeFromWordProblems.tsx:354` "Add To — how many did they get?", `:410` "…did they give away?"
- **Rewrite:** "Add To: how many more?" / "Take From: how many went away?" (no pronoun).

### Unit 4: Put Together / Compare

**E1-23 · Blocker · "Smaller unknown" compare stories use wrong-way wording, and the subject repeats**
- **Where:** Practice `PutTogetherCompareWordProblems.tsx:563` (required bucket `compareSmallerUnknown`) and Test `PutTogetherCompareWordProblemsTest.tsx:203`: "Grace has 9 toy cars. Grace has 3 more toy cars than Max. How many toy cars does Max have?" The plan specified the right-way version ("Lee has 5 fewer than Sam").
- **Breaks:** grade-1.md → Word problems (compare where the words point the wrong way: "Meet, but don't require mastery"); traps §4 ("most students add and get it wrong"); checklist §6 Blocker example "a wrong-way comparison too early."
- **Rewrite:** "Grace has 9 toy cars. Max has 3 fewer than Grace. How many toy cars does Max have?" Step 1 prompt unchanged; hint `"Fewer" means Max has less.` (Practice `:577`). If the user wants the wrong-way form kept as a challenge, that's a plan decision (same options as E1-11).

**E1-24 · Minor · Look-here lines say the subtraction backwards; "In all" is taught as a keyword**
- **Where:** `PutTogetherCompareWordProblems.tsx:29` "Look here. Take the smaller from the bigger." and `:28` "Take the part away from the whole." (the words name the smaller number first, but you start with the bigger; *whole* is heard as *hole* with no bond picture on screen); `:26` "In all means put them together."; Practice hints `:497, :516, :520` "Subtract the smaller amount from the bigger amount."
- **Breaks:** traps §3 (word order ≠ operation order, e.g. "take 3 away from 10"); traps §2 (*whole/hole*); traps §9 (keyword teaching).
- **Rewrite:** say lines "Look here. Start with the bigger. Take away the smaller." / "Look here. Start with the total. Take away the part." / "Look here. Put the two parts together." Hints "Start with the bigger number. Take away the smaller one."

**E1-25 · Minor · Practice "How many different ways could the 8 buttons split…" and "if… instead"**
- **Where:** `PutTogetherCompareWordProblems.tsx:466` (verb "split" without an object), `:470–471` "Give a DIFFERENT way: if 5 are green instead, how many are orange now?", Test `:76, :87`; wrap-up `:473` "…can split into green/orange in more than one way" (the voice says "green orange").
- **Breaks:** grade-1.md Grammar (*if* clause first); traps §8 (slash).
- **Rewrite:** "Is there just one way to split 8 buttons?" / "Say 3 are green. How many are orange?" / "Now say 5 are green. How many are orange?" / wrap-up "8 buttons can be green and orange in many ways."

**E1-26 · Polish · Compare prompt "Which calculation finds the answer?"**
- **Where:** `PutTogetherCompareWordProblems.tsx:516`, Test `:134` ("Which calculation finds how many FEWER pebbles Zara has than Theo?", a long noun phrase).
- **Rewrite:** "Which one finds the answer?" (Test: story, then "Which one finds how many fewer?").

### Unit 5: Fluency Facts

**E1-27 · Minor · Hint "(4+8)+2 and 4+(8+2)" sounds identical by voice; slashes are silent**
- **Where:** `FluencyFactsWithin20Test.tsx:175` is spoken "Try 4 plus 8 plus 2 two different ways: 4 plus 8 plus 2 and 4 plus 8 plus 2." (parentheses are silent and aren't a 1st-grade symbol). `FluencyFactsWithin20.tsx:451` "biggest/easiest step" → "biggest easiest step"; `CountingOnAndBack.tsx:206` "#1" → "the 1 count-back mistake"; `CountingOnAndBack.tsx:321` "Count on (add)" → "Count on add".
- **Breaks:** traps §8; checklist §3 Voice.
- **Rewrite:** (the T/F question goes with E1-01.) "Look for two numbers that make 10. Or pick the easiest two." / drop "#1" sentence / "Count on to add" and "Count back to take away".

**E1-28 · Minor · Three-number labels "a:", "b:", "c:" and the word "pair"**
- **Where:** `FluencyFactsWithin20.tsx:312–318` (a: is read as the article "a"); "pair" in `:80` ("which two numbers"), `:99`, `:137`, `:327`, `:447`, `:451`, `:455` ("that pair's sum"), Test `:137, :176`. *Pair* is heard as *pear*.
- **Breaks:** traps §2 homophones; grade-1.md Math words.
- **Rewrite:** labels "First:", "Second:", "Third:"; "pair" → "two numbers" ("Which two numbers do you add first?", "Add the last number to that total.").

### Unit 6: Equal Sign

**E1-29 · Polish · Equation true/false: say it as "the same as"**
- **Where:** Practice `EqualSignAndEquations.tsx:381, :394, :406`, Test `:66, :82, :102, :120` "Is 8 = 8 true or false?" (spoken "Is 8 equals 8 true or false?"). These are 1.OA.7 and belong in the lab; only the wording changes.
- **Breaks:** grade-1.md Rewrites ("Is this true? 7 = 3 + 4 (spoken: 'Is 7 the same as 3 plus 4?')"); grade-1.md Watch for (the equal sign).
- **Rewrite:** prompt "Is this true?" with `data-tts-say` "Is 8 the same as 8?"; options "Yes, true" / "No, false"; titles "True or false?" → "Is it true?"

**E1-30 · Minor · Balance scale with no scale picture; "weigh"; box vs blank**
- **Where:** `EqualSignAndEquations.tsx:279` "The = sign is like a balance scale: both sides must weigh the same." (the picture is two ten-frames, not a scale; *weigh* is heard as *way*); `:313` says "A box can hide a number" but prompts say "What number goes in the blank?" (`:342, :366, :425`, Test `:35, :51…`).
- **Breaks:** traps §7 (background knowledge); traps §2; english-learners.md (one word per idea).
- **Rewrite:** "= means the same as. Both sides must have the same amount." (or add a simple scale picture); use "box" everywhere: "What number goes in the box?"

**E1-31 · Minor · Hints with "compute," "assume," "just happens to"**
- **Where:** `EqualSignAndEquations.tsx:341` (explain "the blank just happens to be on the left this time"), `:365` hint (18 words, "even though there's a sum on both sides"), `:381` "There's nothing to compute here — look at both sides as they are.", `:406` "Add the left side yourself — don't just assume it's right because it's written down.", `:457` "The blank sits between the subtraction sign and the equal sign."
- **Breaks:** grade-1.md Limits; E1-06 vocabulary.
- **Rewrite:** "= still means the same as." / "Add up each side. They must match." / "Look at both sides. Are they the same?" / "Add it up. Is it really true?" / "The box is the number you take away."

### Shell

**E1-32 · Minor · Home, Practice and Module Test lines**
- **Where:** `MG1_AdditionAndSubtractionWithin20Lab.tsx:85` (hero, 20 words + dash: "…fact fluency, and what the equal sign really means — all within 20."), `:323` "Practicing one type is great for extra reps, but only Mixed problems count toward your mastery stars.", `:120` and `:462` "30 cumulative questions covering every unit… — 5 from each."
- **Breaks:** grade-1.md Limits; E1-06.
- **Rewrite:** hero "Count on, make ten, solve stories, and learn what = means." / "Only Mixed problems give you stars." / "30 questions from all 6 units."

## 4. What's working well

- **The new "Look here" `say` lines are almost all right for K–1:** 3–7 words, one action, plain words ("Look here. Count back one at a time." / "Look here. Fill the ten first." / "Look here. Is the total past 10?"). Only the U4 reversed-order lines (E1-24) and the U3 "Take away from the end" scope (E1-13) need changes.
- **Most of the 12 new Explore teaching lines meet the K limit:** "Start at the bigger number. For 2 + 9, start at 9 and count on 2." / "To take away 4, count back 4 times. Say 4 numbers." / "Keep the bigger number whole. It is closer to 10. Break apart the smaller number." / "Take away to land on 10 first. Then take away the rest." / "A box can hide a number…". These are the model for the rest of the lab's text.
- **Practice step prompts are short** (U5 task strings: 7% over; U4: 17%), the question comes last, and each story is 1–2 sentences + the question.
- **The Add To / Take From Practice pools keep separate past and base verbs** (`verbAdd` / `verbAddBase`), so Practice reads "How many stickers did Mia get?" correctly. Only the Test copy (E1-09) lost that.
- **Story colors match the picture** (U4 Mia's buttons are green and orange; MG1 `--qa/--qb` are green/orange).
- **The voice handles this lab's symbols:** + − = ≠ ☐ all read correctly ("blank equals 4 plus 5", "9 does not equal 10"); SHOUTED words are lowercased.

## 5. Out of my lane (for the curriculum checker)

- All 6 CFUs still use the older MG1 layout (all 4 questions at once, TapSelect pickers, true/false) instead of the K–1 KCheck design. Only U2 has typed answers (BondFill); U1, U3, U4, U5 and U6 have **0% typed** CFU answers, below the ≥40% fill-in rule.
- U2 `LOOK.keep` `say` line ("Look here. Break apart the smaller number.") is Q1's answer, because the options are labelled "6 (the smaller number)" / "9 (the bigger number)". The rollout table had "Keep the number close to 10."
- `AddToTakeFromWordProblemsTest.tsx:160–162` and `:207–209`: start = result + change can reach 25, past 20.
- `FluencyFactsWithin20Test.tsx:220` (make-ten speed) shows the whole sum on the ten-frames, so the answer can be counted from the picture.
- U4 Explore sliders go to 15 + 15, and U6 steppers to 15 + 15, but the frames cap at 20 while the text says "15 + 15 = 30 in all" (text vs. picture, and past 20).
- Every unit Test passes at 9 of 10, so a single English-trap item (E1-01) nearly decides the pass.

## 6. Guideline gaps (proposed additions; I didn't edit these files)

1. **grade-1.md → Grammar: yes / not yet**, add: "Not yet: 'True or false:' statements about a rule or strategy ('you can always…', 'it works for any…'). Ask about one new example instead. Equation true/false (1.OA.7) is fine; say it as 'Is 8 the same as 8?'"
2. **checklist.md §3**, new row: "**Mode-dependent lines:** an Explore sentence that shows in every mode of a toggle (Add To / Take From, Count on / Count back) must be true in every mode, or switch with the mode. Check the 'Look here' key lines too."
3. **math-language-traps.md §3** (word order table), add the row: "take the smaller from the bigger / take the part away from the whole | bigger − smaller | (the words name the smaller first)." with the note: "In K–1 'Look here' lines, say it in operation order: 'Start with the bigger. Take away the smaller.'"
4. **math-language-traps.md §1 table**, add: "cross out | strike through (a picture action) | 'cross out of the teens' = go below 10 | 1". Phrasal-verb collisions inside one lab are easy to miss.
5. **scripts/english-check.cjs:** (a) flag `did ${…}` followed by a past-tense pool verb when the pool has no base form (`verbAdd` after "did"); (b) flag `${n} are` and `if ${n} are` (the "1 are green" case) alongside the current `plural:` check; (c) flag echo questions `has how many` / `is how many`; (d) don't flag equation true/false ("Is N = N true or false?") as a K–1 ban, only statement true/false, so the real problems stand out.

## 7. What I could not check

- Real iOS/Safari speech. I used `speakableText()`, which shows the words but not the pacing or how a voice says "make-ten" or "1st."
- Real students, and how a K student hears a 30-word option list in TapSelect.
- The exact order the Unit Test engine shows hints and explanations (I read the strings, not the running screen). I didn't open a browser harness; I generated the sentences by bundling the units with esbuild.
