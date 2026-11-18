# MG2 Place Value to 120 — round 1 merged fix list

- Lab: MG2 `PlaceValueTo120Lab` (5 units, 5 unit Tests, Module Test) · Grade 1 · audience 1st-grade first-timers + behind 2nd graders, iPad alone, weak readers, audio-first
- Round 1 · 2026-11-17 · Inputs: `round-1-curriculum.md` (0 B · 14 Maj · 11 Min · 2 Pol), `round-1-english.md` (2 B · 19 Maj · 11 Min · 3 Pol)
- Decisions: Fix 44 rows · Skip 1 · Deferred to user 3 (scheduled overnight run; the user was not available to ask — see below)
- Exact evidence, line numbers and rewrites are in the two source reports under each ID. **The curriculum checker decides *what* is shown/asked; the English checker decides *how it is worded*.** Where both give wording, use the English wording.

## Decisions made without the user (scheduled run — the user can reverse any of these)

1. **Band = K–1 (C1-01).** Treated MG2 as K–1: early-learner shell + KCheck CFUs. Reason: the user's scheduled instruction named the K-friendly CFU rule for this lab, the plan is Grade 1, and the builder says "when unsure, treat the lab as the younger band." The builder-file band-table edit itself waits for Stage 6 approval.
2. **Symbol-meaning question (E1-26 + C1-18) → option (b), not (a).** The skill is kept (not removed): it becomes a picture question — blocks/chart for two numbers, "42 ☐ 58. What goes in the box?", big `<` `=` `>` buttons with `data-tts-say` so the voice doesn't give it away. Feedback "Yes! 42 is less than 58." This is a redesign, not a removal, so it didn't need to wait.

## Deferred — Ask user (not changed this round)

| ID | Question | My recommendation |
|---|---|---|
| C1-14 (Test part) + E1 out-of-lane | Unit 1 Test `tenVsHundredChoiceQuestion` ("new ten or new HUNDRED? a new hundred starts at 200") reaches into 2.NBT.1. Replace it with "What comes after 109?" (typed)? | Replace. (The CFU version goes away anyway in the KCheck rebuild.) This round only fixes its wording (E1-14/E1-15). |
| C1-15 | 1.NBT.1 "read and write numerals / write how many objects" for 100–120 isn't practiced. Add a Unit 1 "How many?" bucket (e.g. 11 sticks + 4 cubes → type 114), or accept Unit 2's reverse bucket as coverage? | Add the bucket (plan change). |
| E1 out-of-lane (passScore) | Every unit Test passes at 9/10. Lower for this audience? | Keep 9/10 for now; revisit after a real student tries it. |

## Fix list (Blocker → Polish)

| ID(s) | Sev | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| E1-01 | Blocker | CountingTo120Test.tsx:141–143 (+Module), TenMoreTenLess.tsx:46, AddingTwoDigitOneDigit.tsx:163, `→` in CountingTo120.tsx:144,145,273 | `->` spoken "is greater than" ("109 is greater than 110"); `→` silent | Fix | No arrows anywhere in student text. Use "to"/"then": "29 to 30. 109 to 110." / "13 ones make a new ten." Grep the whole lab folder + shell for `->` and `→` after fixing. |
| E1-25 + E1-28 | Blocker | ComparingTwoDigitNumbersTest.tsx:80–82 (+Module); Practice ComparingTwoDigitNumbers.tsx:315–325 | "What should you do first?" — right answer and trap start the same; trap echoes "first". Practice step abstract + story gives it away | Fix | Test: "64 and 67 both have 6 tens. What do you look at next?" → "The ones" / "The tens". Practice: story "Compare 64 and 67."; step 1 same question/choices; hint "The tens are the same. Look at the ones."; wrap-up "64 < 67. The ones told you." Vary which pair so the right pick isn't always first (C1-07). |
| C1-01 | Major | Shell `MG2_PlaceValueTo120Lab.tsx` | No early-learner mode: no Show me / number pad / Try one like it / retry lock | Fix (decision 1) | Mirror MG1 shell: `lab-early` class, `EarlyLearnerProvider` inside `TtsProvider`, `onRetrySame`/`onHelped`, `lastMakeRef`/`drawRef`/`retrySame`/`owesRetry`/`useRetryDebts`. Do NOT edit MG1 files — copy patterns only. |
| C1-02 + C1-03 + E1-02 + E1-03 (CFU part) + E1-04 + E1-05 + E1-10 + C1-14 (CFU part) | Major | all 5 CFUs | Older all-at-once `<select>` layout, 0% typed, T/F, live re-grading (passable by trial and error), paragraph feedback that states answers, 20-word titles, no pictures | Fix | Rebuild each CFU with `shared/components/KCheck.tsx` (`CheckSequence` / `TypeCheck` / `PickCheck`) — one short question at a time, a picture each, number-pad typing, ≥40% typed per unit (aim ≥ half), big buttons, no T/F, no copy steps. Use C1-02's item list per unit; word them per E1-03/E1-04 (right: "Yes! 100 comes after 99." / first-wrong nudge pointing at the picture, never the answer). U1 Q2 "new hundred" item is dropped from the CFU (replace with typed "After 109 comes __" over the 101–110 row). Gate title: "Answer these. Then you can practice." Passed CFU stays open (shell `cfuJustPassed` latch — keep it). Do not modify KCheck.tsx itself (shared and currently being edited by the MG1 review); if it lacks something, report Needs decision. |
| C1-04 | Major | all 5 CFUs + Explore | No "Look here" pointers | Fix | Each KCheck item gets `look={{ target, label, say }}`; mark Explore spots with `lookHereSpot` per C1-04 (U1 chart row/"Jump to 99"; U2 new "Make a ten" spot; U3 new symbol picture; U4 "same column" line; U5 bundle stage). `say` a few words starting "Look here." Follow MG1/MG10 pointer usage. Miss order as in MG1: 2nd miss → pointer; KCheck show-it on the 3rd. |
| C1-05 | Major | TenMoreTenLess.tsx:211–212 vs CFU; AddingTwoDigitOneDigit.tsx:250–251 vs CFU | Explore defaults show the CFU answers (23+10=33, 38+5=43) | Fix | Explore defaults U4 start 46, move +2; U5 27 + 6 — and confirm no rebuilt CFU item matches any Explore default. |
| C1-06 | Major | all Practice generators; `diagrams/BaseTenBlocks.tsx` | Pictures never respond to a stuck student; no `showMe`; unlabeled rods; no tone/color match | Fix | `labels` prop on BaseTenBlocks (10, 20, 30… under sticks; 1, 2, 3… on cubes). `pointing(help, i)` per C1-06 per unit. `showMe` on every main step (spoken, through the picture) + `showMeHoldMs` ≈ 1 s/item. `tone` on typed steps matching picture parts (sticks "a", cubes "b"). |
| C1-07 | Major | CountingTo120.tsx:363–367; ComparingTwoDigitNumbers.tsx:318–322; TenMoreTenLess.tsx:266, 284–288; 2-option picks | Picks with a fixed right answer; 2-option picks | Fix | Fixed picks → typed steps per C1-07 (U1 "What comes after 100?"; U3 "Type the bigger number."; U4 "47 + 10 = __" typed). Remaining picks get 3 options with the right one's position varying. |
| C1-08 + E1-03 (Test part) + E1-22 + E1-30 (Test part) + E1-34 | Major | 7 T/F items in Tests (5 in Module Test); TensAndOnesTest.tsx:191; AddingTwoDigitOneDigitTest.tsx:158,174 | Long T/F, "True" 6 of 7; "ones" as a pronoun; longest-answer giveaway; two blanks in one line | Fix | Replace each T/F with C1-08's picture item (wording per E1-03). TensAndOnesTest:191 → show 11 in blocks: "11 is 1 ten and how many ones?" (typed). Test :158 equal-length choices; :174 split into two lines/fields per E1-34. Module Test picks up the replacements. |
| C1-10 + E1-20 | Major | CountingTo120.tsx:240, 266–268 | "Say the next number" says nothing; "New ten!" banners not spoken | Fix | Each tap speaks the new number with the lab voice ("one hundred one"). Banners in `ReadAloud`, short: "New ten!" / "100! A new row!" |
| C1-11 | Major | CountingTo120.tsx:319; CountingTo120Test.tsx:18,34,69,81,99,112 | Chart shows the next number (Practice startMid lit cell; Test dimmed but readable) | Fix | `hideAfter` option on HundredChart (blank cells after `upTo`); Tests use it; Practice marks `after` only when done ≥ 1, faint numbers come back as help after a wrong try. |
| C1-12 + E1-16 | Major | CountingTo120.tsx:336–345 | crossDecade: story says three numbers, asks two; step 2 prints step 3's answer; "Rolling into" idiom | Fix | Story "Start at 18. Count on."; steps: after 18 (typed), after 19 (typed), then "Which row is 20 in?" (tap the row) last. Title "A new ten." |
| C1-16 | Major | TensAndOnes.tsx Explore L233–277 | "A ten is 10 ones" never shown; rods appear with no bridge | Fix | "Make a ten" button: 10 cubes count in ~1 s each (spoken), slide into one stick labeled 10. Presets 14 and 70 (names spoken). Number sentence shown by default once built. Look-here spot on "Make a ten". |
| C1-18 + E1-26 | Major | ComparingTwoDigitNumbers.tsx Explore L232–236, CFU :28; Test :151 | < and > never taught; symbol-vocab question answered by ear | Fix (decision 2) | Explore: short line + picture (sticks for both numbers side by side; open side faces the bigger number), spoken "42 is less than 58", Look-here spot. CFU and Test symbol item → picture question with `data-tts-say` on the 3 buttons. |
| C1-22 | Major | TenMoreTenLess.tsx:263,281,303,326; TenMoreTenLessTest.tsx:18,31,44,60,76,94 | Chart colors the answer cell before any try (Practice + 6/10 Test) | Fix | Practice: mark only `n`; on `pointing(help, i)` draw hop arrow with "?" at landing cell; mark result only when `done > i`. Test: mark only `n`. |
| E1-06 + E1-08 + E1-11 | Major | Explore notes / Key Ideas / goals in all 5 units (lines in E1-06) | 23–50-word paragraphs, dash asides, later-grade words, "even" | Fix | Use E1-06's rewrites verbatim (≤ 8 words per sentence). Remove the E1-08 words and everyday "even" wherever they remain. |
| E1-07 | Major | TensAndOnes(.Test), ComparingTwoDigitNumbers(.Test) lines in E1-07 | "1 tens", "1 ones" | Fix | Plural helper (`tensW`/`onesW`); build fixed frame words from the known answer. Brute-check every generator at value 1. |
| E1-12 + C1-09 | Major | Shell :83, :111, :118, :269, :392 | Jargon (clean-solve, cumulative, reps), long sentences; problem-type picker useless when 1 type | Fix | E1-12 rewrites (MG1 K–1 wording). Hide `Segmented` when `unit.problems.length === 1`. |
| E1-13 | Major | CountingTo120.tsx:48,49,199,267,364,369; Test :84; U5 title | "digit" used before taught; "2-digit" spoken "2, digit" | Fix | U1 talks about the count, not digits ("After 99 comes 100."). Practice "2-digit or 3-digit?" step is replaced by C1-07's "What comes after 100?". Titles write "two-digit"/"one-digit" as words (or "Adding Ones to a Number"). |
| E1-14 + E1-15 | Major | CountingTo120.tsx:94,105–106,342; Test :54,161–162 | "the 110s", "the 100s hundred", "the 10s", "100-199" garbled when spoken | Fix | Ask by number/row ("19, then 20. Which row is 20 in?"), never by decade name. The deferred `tenVsHundredChoiceQuestion` stays this round but drop "100s hundred" and write "from 100 to 199". |
| E1-17 + C1-13 | Major | CountingTo120.tsx:352 and wrap-up | cross100 with start 97 never reaches 100; false "new digit appeared" | Fix | start ∈ {98, 99}, story "Start at 98. Count on.", ask through 100 (add a third count step if needed); wrap-up built from the values. |
| E1-21 | Major | TensAndOnes.tsx:324,326,378,383 | "decade"/"exact decade"; story gives away 0 ones | Fix | Title "A number like 70"; story "Look at 70. How many tens and ones?" |
| E1-23 + C1-17 | Major | TensAndOnes.tsx:363–371 | Blank doesn't match choices; one-button step when tens = ones | Fix | Typed "36 = 30 + ___"; exclude `ones === tens`; add "= 30 + 6" to Explore's number sentence. |
| E1-27 | Major | ComparingTwoDigitNumbers.tsx:89,100–101,240,319,325,359; Test :59,80–81 | "tied / break the tie" idiom | Fix | "The tens are the same. Look at the ones." |
| E1-30 + C1-25 | Major | TenMoreTenLess.tsx:300,323,337–338,343; header | "multiple of ten"; standard label | Fix | Title "Ten More, Ten Less, and Adding Tens"; Practice titles "Add tens"/"Take away tens"; Key Idea "Adding 20 is 2 tens more."; header "1.NBT.4–6". |
| E1-32 + E1-33 | Major | AddingTwoDigitOneDigit.tsx:162–163,234,348; Test hints | "regrouping"/"bundle"/"carry"/"sum" all for one idea | Fix | One phrase: "make a new ten." Title "Make a new ten". "When the ones make 10 or more, make a new ten." |
| C1-19 | Minor | ComparingTwoDigitNumbers.tsx Explore + symbol step help | Comparing never uses tens/ones blocks | Fix | BaseTenBlocks for A and B under the chart in Explore and as help on the symbol step (blink sticks, then cubes). Line "More tens? Bigger number. Same tens? Look at the ones." |
| C1-20 | Minor | Unit 3 Practice diffTens/reversedDigits | Only typed step copies a digit | Fix | "Type the bigger number" before the symbol pick (combine with C1-07). |
| C1-23 | Minor | TenMoreTenLess.tsx:275 | 10 less only from 11–23 | Fix | Widen to 11–99 with half the draws in 11–23. |
| C1-24 | Minor | TenMoreTenLess.tsx:233, 219 | Explore shows "10 − 10 = ?"; steppers don't gray out | Fix | Show 0; disable moves leaving 0–120. |
| C1-26 | Minor | AddingTwoDigitOneDigitTest.tsx:90,107,154 | Test pictures show ones already added + "ready to bundle" banner | Fix | Tests draw only the starting blocks (no `flagOverflow`) or no picture. |
| C1-27 | Minor | AddingTwoDigitOneDigit.tsx:281–315 | Bundling not animated | Fix | Cubes added one per second with spoken counting; slide 10 ringed cubes into a stick; next button grayed until the animation ends. |
| E1-09 | Minor | lab-wide | Many names for sticks/cubes | Fix | "stick" (1 ten), "cube" (1 one); taught once in U2 Key Idea. |
| E1-18 | Minor | CountingTo120.tsx:299 | if-clause + contraction | Fix | "Count from 1: 1, 2, 3. What comes next?" |
| E1-19 | Minor | CountingTo120.tsx:379 | "already past one hundred" false at n = 100 | Fix | Draw n from 101–119 or "Here is 104." |
| E1-24 | Minor | TensAndOnes.tsx:297–298,313–314,329–330,363–364; TenMoreTenLess.tsx:305,328 | "How many tens is 36?" | Fix | "How many tens are in 36?" everywhere. |
| E1-31 | Minor | TenMoreTenLess.tsx:219,285–286 | Idioms; "-3" spoken "3" | Fix | E1-31 rewrites; stepper → "Tens" + More/Less toggle (or `data-tts-say`). |
| C1-21 | Polish | ComparingTwoDigitNumbers.tsx:218–219 | Steppers by 1 over 10–99 | Fix | Preset pairs (42 & 45, 36 & 63, 53 & 53) or ±10 buttons. |
| E1-29 | Polish | "42 ___ 45. Which symbol?" (U3 + Test) | Spoken "42 blank 45" | Fix | Show a box ☐: "What goes in the box?" |
| E1-35 | Polish | Practice titles | Long titles read aloud | Fix | 2–3 word titles per E1-35. |
| mathSpeech.ts "100s/110s" + possessive (E1 §6) | — | `shared/tts/mathSpeech.ts` | Shared voice code | Skip | Shared file used by every lab; the lab-side fix (E1-14) removes the triggers. Listed as a proposed change for Stage 6. |

## Proposed rule and guideline changes (wait for Stage 6 / user approval)

Builder (`math-lab-builder.md`), from the curriculum report:
1. Band table: K–1 = MK1–MK4, MG1, and every lab built from a Grade-1 plan (MG2–MG4); read-aloud band = MG5.
2. Practice/Test pictures must not mark, color or print a step's answer before that step is done; Tests draw the givens only.
3. A finished step's prompt stays on screen, so no step's prompt may contain a later step's answer.
4. A control labeled "Say…"/"Count…" must speak each number it shows.
5. Hand-built CFUs: changing an answer after a wrong Check clears the check; fields never re-grade live.

English guidelines, from the English report:
6. `math-language-traps.md §8`: never type `->` (spoken "is greater than"); write "to"/"then".
7. `math-language-traps.md §1`: "ones" never used as a pronoun in a tens-and-ones lab.
8. `grade-1.md` Not yet: decade, regroup/carry, multiple of ten (with replacements).
9. `checklist.md §3`: symbol-meaning questions are answered by ear in read-aloud labs.
10. `shared/tts/mathSpeech.ts`: "100s"/"110s" decade names and numeral possessives (code change, all labs).
