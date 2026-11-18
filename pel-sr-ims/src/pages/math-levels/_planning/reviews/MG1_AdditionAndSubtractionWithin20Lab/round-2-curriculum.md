# MG1 Addition & Subtraction Within 20: curriculum review, round 2 (re-review)

- **Lab:** MG1 `AdditionAndSubtractionWithin20Lab` (6 units, 6 unit Tests, Module Test)
- **Round:** 2 · **Date:** 2026-11-17
- **Grade band assessed:** K–1 (K/1st first-timers and behind 2nd graders, alone on an iPad, audio-first)
- **Inputs:** `round-1-merged.md` (its User decisions are final), `round-1-fixes.md`, `round-1-curriculum.md`, the plan, the standards reference, `shared/components/KCheck.tsx` and `CfuPointers.tsx`, and every unit, Test and diagram file in the lab.
- **How I checked:** I read every changed file. I ran the lab in a temporary harness page at iPad portrait size (820×1180, touch on, speech stubbed so spoken lines are logged) and walked: Unit 2 CFU Q1 (wrong pick) and Q2 (wrong ×3, then right, with "Look here!" pressed); Unit 6 CFU Q1 and Q2 (wrong pick); Unit 3 CFU Q1–Q5. Screenshots are in the scratchpad: `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\4a0a5ada-0427-4375-a535-7a7815b05751\scratchpad\r2\shots\`. The harness was deleted afterwards.
- **Not re-raised:** C1-26 (waiting for the user), C1-25 (Skip). Wording-only rows (E1-xx) belong to the English checker. I only checked that they are in place where I read the code.

---

## 0. Status of last round's fixes

| ID(s) | Status | Note |
|---|---|---|
| C1-01 | Fixed | U3 Explore: Steppers; Add max 20 − start, Take max start; Switch grays out; no clamp. |
| E1-01 | Fixed | No rule true/false left in CFUs or Tests. Only 1.OA.7 equation Yes/No remains, as agreed. |
| E1-23 | Fixed | The smaller-unknown story is worded the right way in Practice and the Test. |
| C1-04 + C1-02 + C1-03 + E1-03 + E1-04 + C1-40 | **Fixed, but caused a new problem** | All 6 CFUs are KCheck, one question at a time, 21 of 33 typed. No first-miss message states an answer. **But the six two-button picks give the answer away by elimination after one wrong tap, and their pointer can never appear.** See **C2-01**. |
| E1-05 + Making Ten pointer | Fixed | Q1 options are plain "6" / "9", the 9 is drawn in the bigger number's color, the first miss says "Not yet. Keep the bigger number whole.", and the pointer asks rather than tells. (Its pointer can't show; see C2-01.) |
| C1-05 + C1-31 | Fixed | Before a try, pictures show only what is given (the fact written big in U5, separate frames in U4/U6). Combined pictures appear only after a wrong try. U5 step 2 is a related fact, not a copy. |
| C1-06 | Fixed | Every final step in U2–U6 has a spoken Show me that walks through the picture, with a hold of about 1 second per number. I checked Show me on every step in code (`visualDone = current + 1`), and no picture jumps ahead. |
| C1-07 | Fixed | "Which one matches the story?" / "Which one finds the answer?" uses the story's own numbers, and the right one's position varies. |
| C1-08 + C1-23 | Fixed | All Explore ranges come from each other. No `Math.min(20, …)` reaches a picture. |
| C1-09 | Fixed | U6 true/false has typed "add it up" steps (except "n = n", as noted), "the total" is sometimes missing, and U4 both-parts is two typed steps. |
| C1-14 | Fixed | The smaller number is written first half the time. Step 1 asks which number to break apart, and the ten is always filled by the bigger number. |
| C1-15 | Fixed | Bigger 6–9, smaller min = 11 − bigger, take-away min = start % 10 + 1. Nothing is rounded. |
| C1-16 | Fixed | The "Same total" Explore mode is in. Step 3 is typed with a third first number. |
| C1-20 + E1-11 | Fixed | StoryStrip "What is missing?" Explore with "Show". The U3 Test has 1 start-missing story, and so does the Module Test. |
| C1-21 | Fixed | Take-from-start numbers are built from the end and stay ≤ 20. |
| C1-24 + C1-28 | Fixed | CompareRows is used in Explore (with "Say it" more/fewer lines) and in the Test (no circles). |
| C1-29 | Fixed | "Which two first" is asked only when the three numbers are all different and exactly one pair makes 10. |
| C1-30 | Fixed | The Making Ten rule now holds everywhere. See the check below. |
| E1-02 | Fixed (spot-checked) | Singular helpers are in U3/U4/U5. Add-to start ≥ 1. |
| E1-06 + C1-37 | Fixed (spot-checked) | |
| E1-07 | Fixed (spot-checked) | The U2 Key Idea keeps the bigger/smaller wording. |
| E1-08 + C1-22 | Fixed | "the start / the change / the end" and "the total / a part"; neutral titles. |
| E1-09, E1-10, E1-12, E1-13, E1-14, E1-15, E1-16 | Fixed (spot-checked) | The atf-missing line is true in every mode/part (`missingLine`). |
| C1-38 | Fixed | "Think addition" step + Explore line, tagged 1.OA.4. (New side effect: see C2-06.) |
| C1-33 | Fixed | Half the three-number problems are short stories. |
| C1-34 | Fixed | Typed within-10 fact in the CFU and the Test. |
| C1-10 + E1-18 | Fixed | |
| C1-11 | Fixed | Practice uses typed "say the numbers" boxes. (The Test still asks "how many times" twice; see C2-08.) |
| C1-12, C1-13 | Fixed | |
| C1-17 | Fixed | Bigger in tone a, smaller in tone b (screenshot `u2-q1-miss1.png`). |
| C1-19 | Fixed | |
| C1-27 | Fixed | Gap after every 5th counter. |
| C1-32 | Fixed | |
| C1-35 | Fixed | Box mode + "Find it", and Flip. (New side effect: see C2-03.) |
| C1-36 | Fixed | |
| E1-17, E1-19 … E1-32 | Fixed (spot-checked) | |
| C1-18 | Fixed | "Break apart the smaller number" everywhere. No "other addend" / "split the other" left. |
| C1-26 | Left out, waiting for the user | Not re-raised. |

**Totals: 50 Fixed · 0 Not fixed · 1 Fixed, but caused a new problem (the KCheck CFU rebuild → C2-01) · C1-26 pending the user.**

**Making Ten rule (user): verified everywhere.** In U2 CFU/Explore/Practice/Test, U5 CFU/Explore/Practice/Test and the Module Test, the ten is always filled by the bigger number. Every break-apart answer, gap, hint and explanation comes from the bigger number ("Keep {bigger} whole", "{big} needs {gap}"). The smaller number is always strictly smaller in make-ten generators. Doubles (7 + 7) appear only in U5 fast facts, where either number may be broken apart. No "split the other addend" wording is left.

**KCheck `look` prop: MK1–MK4 are unaffected (verified in code).** Without `look`, `useCfuPointers([])` records nothing, `StuckBox` renders nothing, show-it stays on the 2nd miss, and the hooks are called in the same order. With `look` (verified in the browser, U2 Q2): 1st miss → the named reason plus a ring on the picture. 2nd miss → "Look here!" appears, speaks "Look here. Fill the ten first.", scrolls and lights the Explore number bond with the arrow. 3rd miss → the worked picture and the "Watch…" line, with the button still there. Right → the button and all lit spots clear. The pointer rule works exactly as agreed **for typed questions**.

---

## 1. Verdict

**Ready after one Major fix.** Round 1's fixes are all in and work. The CFUs now look and sound right for K–1, and the Making Ten rule is consistent across the lab. The one real gap: **six CFU questions have only two buttons.** One wrong tap grays out the wrong button and leaves only the right one. So a guesser passes them with no understanding, and the agreed "Look here" pointer never appears. In Unit 6, all three picks are answered by "the same / Yes", so tapping "Yes" every time passes half of that CFU.

## 2. Top 5 changes (ranked)

1. **C2-01 (Major):** Rebuild the six two-button CFU picks so one wrong tap can't hand over the answer: make two of them typed, drop one, and give the Unit 6 Yes/No questions a mix of answers plus a twin question after a miss.
2. **C2-03 (Minor):** Change two Explore defaults that print a CFU answer at the "Look here" spot. In U1, "To take away 4, count back 4 times" is Q5's answer. In U6, box mode finds 3, which is Q5's answer.
3. **C2-02 (Minor):** In U3 CFU pictures, color each number by its role (start / change / end), as the StoryStrip does. Right now Q5's change (4) is drawn in the start color.
4. **C2-04 / C2-05 (Minor):** Remove fixed-answer patterns in the U3 and U2 Tests (both U3 role questions are always "the change"; the U2 break-apart pick is always the first number written).
5. **C2-06 (Minor):** Use "think addition" only on facts that cross 10, so Show me never has to count 17 numbers in 7 seconds.

## 3. Scorecard (changed parts)

Layers: 1 Standards · 2 Audience · 3 Learning arc · 4 Getting unstuck · 5 Pictures · 6 Math · 7 Mastery · 8 Device

| Unit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| 1 Counting On/Back | Strong | Strong | OK: Look-here line prints Q5's answer | Weak: Q3 pick, no pointer possible | Strong | Strong | Weak: Q3 pick answered by elimination | OK |
| 2 Making Ten | Strong | Strong | Strong | Weak: Q1 pick, no pointer possible | Strong | Strong | Weak: Q1 by elimination; Test pick always first number | OK |
| 3 Add To/Take From | Strong | OK: 3-sentence stories (fixer note) | Strong | Strong | Weak: Given colors contradict roles | Strong | OK: Test role answers always "the change" | OK |
| 4 Put Together/Compare | Strong | Strong | Strong | OK: Q2 pick | Strong | Strong | OK: Q2 by elimination (Q3 typed follows) | OK |
| 5 Fast Facts | Strong | Strong | Strong | Strong | OK: think-addition help picture stops at 10 | OK: non-bridging think-addition | Strong | OK |
| 6 Equal Sign | Strong | Strong | OK: box-mode finds Q5's answer | Weak: 3 of 6 CFU questions can't reach a pointer | Strong | Strong | **Weak: every CFU pick is "same/Yes"** | OK |

## 4. All findings

### Lab-wide (CFUs)

**C2-01 · Major · Layer 4/7 · Two-button CFU picks give the answer away after one wrong tap, so the "Look here" pointer can never show.**
- *Who it hurts:* the guesser (passes without knowing) and the first-timer (never gets pointed to the Explore spot that teaches the idea).
- *Where:* U1 Q3 "3 + 8. Which number do you start at?" (3 / 8); U2 Q1 "6 + 9. Which number do you break apart?" (6 / 9); U4 Q2 "Is there just one way?"; U6 Q1 "What does = mean?", Q2 "5 = 2 + 3. Is it true?", Q4 "8 = 8. Is it true?".
- *Evidence:* `KCheck.tsx:143–149`: a tried wrong button is disabled, so after one wrong pick only the answer is left. In the browser (`u2-q1-miss1.png`), tapping 9 left only "6" enabled, with 0 "Look here" buttons. In U6, after "No, false" on Q2, only "Yes, true" was enabled and no pointer appeared. `useCfuPointers` needs 2 wrong tries, and `PickCheck` can't get a second one. U6's three picks are all answered "Both sides are the same amount" / "Yes, true", so always tapping that choice passes all three. The fixer saw this ("wired, never reached").
- *Judgement:* the merged rule is "never an answer on the 1st miss; 2nd miss → Look here". Leaving exactly one live button after the 1st miss shows the answer in effect, and it skips the pointer rung. These questions carry the lab's core traps (start at the bigger number, break apart the smaller, = means the same, n = n). In round 1 this was Polish (C1-40) only because the old feedback named the answer. Now the pointer is the agreed help, so it matters.
- *Fix (recommended):*
  1. **U1 Q3 and U2 Q1 → TypeCheck** (number pad): "3 + 8. Type the number you start at." (answer 8) and "6 + 9. Type the number you break apart." (answer 6). Keep the same `why` lines as `why` by number (3 → "Which number is bigger?", 9 → "Not yet. Keep the bigger number whole."). This also raises the typed share.
  2. **U4 Q2:** drop the "Just one way / More than one way" pick (Practice already did). After Q3 add a typed "Now say 5 are sports cards. How many are animal cards?" (answer 1), with praise "Yes! 6 can be split many ways."
  3. **U6 Q1:** give 3 picture choices instead of 2 options, e.g. "Which one is true?" with `6 = 6`, `6 = 3`, `6 = 9` under ten-frames (answer `6 = 6`). Or keep the meaning question but add a third option, "Add the numbers".
  4. **U6 Q2/Q4 (Yes/No stays, per User decision 1):** make one of them false (e.g. Q2 "6 = 2 + 3. Is it true?" → No), so "always Yes" fails. Add an optional `twin` prop to `PickCheck`, used only with `look`: on a wrong pick, the buttons reset and a twin question with new numbers replaces the prompt and picture (e.g. "7 = 4 + 3"). The twin's miss counts as the 2nd miss and shows "Look here!". A miss after that shows it. MK1–MK4 don't pass `twin`, so they are unchanged.
  - *Small related note:* on 3-button picks (U1 Q5, U3 Q1/Q4/Q5, U4 Q6, U5 Q1), "Look here!" appears only once a single button is left, so it is shown together with the answer. With the twin prop on these too, the pointer would have meaning. This is optional.

**C2-07 · Minor · Layer 8 · Unverified on a real iPad · A tapped spot can leave the next question's button looking "chosen".**
- *Evidence:* `lab-base.css:908`: `.choice:hover` uses the green border and soft fill. That looks like the right-answer style. In the touch harness, after answering U3 Q4 with "the change", the Q5 button in the same spot showed green before any tap (`u3-q5-ask.png`; "the change" is wrong for Q5). On iPads, :hover sticks after a tap.
- *Fix (shared CSS, all labs):* wrap the rule in `@media (hover: hover) { … }`, or use a neutral hover color that differs from `--good`.

### Unit 1: Counting On and Counting Back

**C2-03a · Minor · Layer 3 · The Look-here spot for CFU Q5 prints Q5's answer.**
- *Evidence:* `CountingOnAndBack.tsx:248`: "To take away 4, count back 4 times. Say 4 numbers." CFU Q5 is "13 − 4. How many times do you count back?" (answer 4). The pointer targets this line (`cob-back-rule`).
- *Fix:* use 5: "To take away 5, count back 5 times. Say 5 numbers." (No CFU question uses 5.)

**C2-08 · Polish · Layer 7 · The U1 Test asks "How many times do you count back?" twice, and both answers are the number in the prompt.**
- *Evidence:* `CountingOnAndBackTest.tsx`: `countBackHowManyTimesChoiceQuestion` and `countBackRuleQuestion`, which is 2 of 10 questions. Practice moved to typed "say the numbers" (C1-11).
- *Fix:* replace `countBackRuleQuestion` with a typed sentence question, "Count back 4 from 13. Say the numbers: ☐, ☐, ☐, ☐", like Practice.

### Unit 2: Making Ten

**C2-05 · Minor · Layer 7 · Two U2 Test picks have a fixed answer pattern.**
- *Evidence:* `MakingTenAndDecomposingTest.tsx:73`: `wrongAddendChoiceQuestion` always writes the smaller number first, so "break apart the first number" is always right. That rewards the mirror misconception. Lines 166–181: `equivalentSumChoiceQuestion` always has a2 = a1 + k (always "more"), so the answer is always the smallest of the three options.
- *Fix:* write the smaller number first only half the time, as Practice does. Pick k from ±1..±3, so the box number sometimes gets bigger. Keep the distractors "moved the same way" / "didn't move".

### Unit 3: Add To and Take From

**C2-02 · Minor · Layer 5 · CFU "Given" pictures color numbers by position, not by role, which contradicts the StoryStrip colors.**
- *Evidence:* `AddToTakeFromWordProblems.tsx:39–49`: the first number is always tone a (the start color) and the second is tone c (the end color). In Q1 the change (5) is drawn in the end color. In Q5 the change (4) is drawn in the start color (`u3-q5-ask.png`), on the question that asks "the start is missing". The show-it StoryStrip then recolors them (start a, change b, end c). A student who reads the colors is misled on exactly the trap question.
- *Fix:* pass roles: `<Given parts={[{n:6, role:"start"},{n:5, role:"change"}]} />`, with tone a/b/c by role. Or draw both in one neutral tone before the answer.

**C2-04 · Minor · Layer 7 · Both U3 Test role questions are always "the change".**
- *Evidence:* `AddToTakeFromWordProblemsTest.tsx:79–97, 234–252`: `changeUnknownRoleChoiceQuestion` and the new `takeFromMissingRoleChoiceQuestion` both answer `ROLES[1]`. A student who notices passes both with "the change".
- *Fix:* `takeFromMissingRoleChoiceQuestion` picks at random between a change-missing story and an end-missing story ("…Then she lost 3. How many does she have now? What is missing?" → the end). That keeps the one-start-story limit.

### Unit 5: Fast Facts to 20

**C2-06 · Minor · Layer 4/6 · "Think addition" is used on facts that don't cross 10, so Show me can't keep pace.**
- *Evidence:* `FluencyFactsWithin20.tsx:408–447`: start 11–19, sub 2–9, any pair, so 19 − 2 gives "Think addition: 2 + ☐ = 19" and Show me counts 3 … 19 (17 numbers) in the 7-second cap (`holdFor`). For counting this should be about 1 second per number. The help picture (`TenFrameGroup value={sub} highlightEmpty`) shows only the 2 with its empty boxes up to 10. Nothing shows the 9 past 10. The same generator is in `factsWithin20SubNumberQuestion` (Test hint "Think addition: 2 + ☐ = 19").
- *Fix:* generate only bridging facts here (`sub > start % 10`, e.g. 12 − 8, 15 − 7), where think-addition is the efficient strategy. Their result is at most 9, so Show me counts at most 9. Draw the help picture as the sub frame plus a second frame for the part past 10 (or `TenFrameGroup value={start} splitAt={sub}` without the numeral).

### Unit 6: Equal Sign and Number Sentences

**C2-03b · Minor · Layer 3 · The box-mode Look-here spot finds CFU Q5's answer.**
- *Evidence:* `EqualSignAndEquations.tsx:243–246`: the defaults are 5 + 4 = 6 + ☐, so "Find it" reveals 3. CFU Q5 ("8 + ☐ = 11") points to `eq-missing`, and its answer is 3. (Q3's answer is 2 and Q6's is 11, so avoid those too.)
- *Fix:* defaults 5 + 6 = 7 + 4 (box finds 4). Re-check that no CFU answer is 4 (none is).

## 5. Persona walkthrough highlights

- **The guesser, U2 CFU Q1 "6 + 9. Which number do you break apart?"** Taps 9 (bigger, written last). Hears "Not yet. Keep the bigger number whole." Only "6" is still lit, so taps it: "Yes!" They learned nothing about why, and the pointer to "Keep the bigger number whole. It is closer to 10." never came (C2-01).
- **The first-timer, U2 CFU Q2 "How many more does 8 need to make 10?"** Types 6, then 5. The 8's empty boxes are lit, and after the 2nd miss a big "Look here!" says "Look here. Fill the ten first." It scrolls to the number bond and equations with a bouncing arrow (`u2-q2-lookhere.png`). On the 3rd miss the picture fills the ten ("8 + 2") and the voice says "Watch: 2 boxes are empty. 2 from the 6 fill them." A non-reader gets unstuck. This is the design working as intended.
- **The behind 2nd grader, U3 CFU Q5 "Leo had some stickers. He got 4 more…"** The 4 is drawn in the same green as every "start" so far, and the "the change" button is already green from the last tap. Picks "the change". Wrong (C2-02, C2-07).

## 6. What's working well

- K–1 CFUs: one question and one number pad at a time, typed share 64%, short feedback lines, no answer in any first-miss line, and the passed CFU stays open.
- The pointer ladder on typed questions (nudge → Look here, which switches Explore mode when needed → worked picture) is exactly the agreed design, and MK1–MK4 are untouched.
- The Making Ten rule is consistent across every unit, Test and explanation, and Practice now asks the break-apart question with the order mixed.
- Show me lines teach through the picture and are paced to the voice. The StoryStrip and CompareRows pictures make "what is missing" and "the extras" visible.

## 7. Rule gaps (proposed for `math-lab-builder.md`, K–1 CFU section; don't edit now)

1. "In a K–1 CFU, a pick with only two options can't carry a 'Look here' pointer: one wrong tap leaves only the answer. Use a typed answer, three or more options, or a twin question after a wrong pick. In one CFU, the right answers to Yes/No picks must not all be the same. (MG1 round 2: six two-button picks; U6's were all 'Yes'.)"
2. "Pictures that show a story's given numbers color each number by its role (start / change / end, part / total), the same colors as the unit's Explore model, not by the order they appear. (MG1 U3 Q5 drew the change in the start color.)"
3. "An Explore Look-here spot's default numbers, and any number it reveals ('Find it', 'Show'), must not equal any CFU answer that points to it." (This extends the existing default-numbers check to revealed values.)

## 8. What I could not check

- A real iPad (iOS speech timing, sticky hover, touch scrolling while "Look here" scrolls).
- Every Practice bucket's full help ladder in the browser. I checked the Practice visuals and Show me rungs in code; the fixer walked U3/U5/U6 in the browser.
- Real students.
