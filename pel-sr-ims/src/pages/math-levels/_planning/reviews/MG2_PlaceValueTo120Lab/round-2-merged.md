# MG2 Place Value to 120 — round 2 merged fix list

- Lab: MG2 `PlaceValueTo120Lab` · Grade 1 · K–1 band · audience 1st-grade first-timers + behind 2nd graders, iPad alone, audio-first
- Round 2 · 2026-11-17 · Inputs: `round-2-curriculum.md` (0 B · 3 Maj · 8 Min · 3 Pol; round-1: 36 Fixed, 3 Fixed-with-new-problem, 1 Partly, 0 Not fixed), `round-2-english.md` (0 B · 1 Maj · 7 Min · 5 Pol; round-1: 31 Fixed, 2 Fixed-with-new-problem, 2 Partly (user), 0 Not fixed)
- Decisions: Fix 20 rows · Deferred to user 1 (E2-37) · still open from round 1: C1-14 Test item, C1-15, passScore, KCheck title, Test-engine spoken signs
- Exact evidence and rewrites are under each ID in the source reports. Curriculum decides *what*; English decides *how it's worded*.

## Decisions made without the user (scheduled run)

- **E2-36 → option (a): avoid the word "digit"** rather than add a teaching line to Unit 2. Simpler, no new content, and C2-30 already replaces the Test item that depended on it.
- **E2-37 (☐ spoken "blank") → deferred.** The fix is in shared `mathSpeech.ts` and is the same open decision as MG1 E2-38; make it once for both labs. No lab-side workaround this round.

## Fix list (Major → Polish)

| ID(s) | Sev | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| C2-28 | Major | ComparingTwoDigitNumbers.tsx L244 `biggerStep`; CFU items 2–3 (L69, L84) | "Type the bigger number" box tinted the bigger number's color | Fix | `tone: "c"` (neutral) on `biggerStep`; pass `tone="c"` explicitly to CFU items 2 and 3 (KCheck default "b" leaks). Grep the lab for any other "which one" step with a matching tone. |
| C2-29 | Major | ComparingTwoDigitNumbers.tsx `equal` bucket L251–261; CFU item 4; Test `equalTrapQuestion` | Equal bucket is one tap, always "=" | Fix | Story "Compare 53 and 5 tens and 3 ones." Visual: chart with 53 + BaseTenBlocks for the tens/ones. Step 1 typed "5 tens and 3 ones is what number?"; step 2 sign pick. ~1/3 of draws the blocks don't match (e.g. 3 tens 5 ones vs 53). Same idea for the Test item ("4 tens and 7 ones ☐ 47") and the CFU item. Use E1-07 plural helpers. |
| C2-30 + E2-36 | Major | TenMoreTenLessTest.tsx `digitChangedChoiceQuestion` (+Module), `strategyWhyQuestion`; ComparingTwoDigitNumbers.tsx:272, :277; AddingTwoDigitOneDigitTest.tsx:161 | Test picks about "digits"/"fast way": fixed answers, untaught word, no Practice twin | Fix | `digitChangedChoiceQuestion` → "What is 10 more than 36?" picture pick [46 / 37 / 47] (distractors: changed the ones, changed both; vary n; shuffle). `strategyWhyQuestion` → typed "What is 10 less than 60?" (decade start, vary). Module Test stays 25. U3 title "Tens and ones swapped"; wrap-up "76 > 67. 76 has more tens."; U5 Test choice "The answer is over 100" in place of "3 digits". Final grep: no "digit" in student text. |
| C2-31 | Minor | AddingTwoDigitOneDigitTest.tsx `regroupSentenceProductionQuestion` | "How many ones? ☐" has two right answers (13 / 3) | Fix | First box "8 + 5 = ☐ ones." (built from the numbers), then "What is 38 + 5? ☐". |
| C2-32 | Minor | CountingTo120Test.tsx `cross100NumberQuestion`, `decadeCrossNumberQuestion` | Duplicate "after 99"; "decade" item never crosses | Fix | cross100Number: "99, 100. What comes next?" (101) — vary start so it isn't always 99/100 if a near-100 alternative exists (e.g. 100 or 101 → next). decadeCross: start = d·10 + 9, answer the new ten. |
| C2-33 | Minor | ComparingTwoDigitNumbersTest.tsx `pickBiggestSameTensQuestion` L156 | Biggest always listed last | Fix | Shuffle `nums` in the prompt and choices. Wording "Which is biggest: …?" (E2-44). |
| C2-34 (C1-27 partly) | Minor | AddingTwoDigitOneDigit.tsx `adding` stage L205–218; BaseTenBlocks | Counts all from 1; added cubes appear at once | Fix | `countFrom` option on BaseTenBlocks (lab-local): starting cubes labeled at once, each new cube appears and is labeled on, one per second, spoken; "Make a new ten" stays gray until done. |
| C2-35 | Minor | BaseTenBlocks L177 | 0 ones: wrong try / Show me don't change the picture | Fix | When ring/labels target ones and o === 0, draw a dashed empty box where cubes go; big "0" on Show me. |
| C2-36 | Minor | CountingTo120.tsx `countChart` | Counting back shows its answer cell | Fix | Back-move step not done → blank `m.to` (or "?" box), hop only after a wrong try. |
| C2-37 | Minor | CountingTo120.tsx CFU item 3; AddingTwoDigitOneDigit.tsx CFU items 1–2 | Pointers aim at spots that don't teach the question | Fix | U1 item 3 → `LOOK.jump`, say "Look here. Jump to 99. Count to 100. See its row." U5 items 1–2 → target `u5-newten`, say "Look here. Tap Add cubes. Count the cubes." (match E2-40 button text). |
| C2-38 + E2-45 | Minor | TenMoreTenLess.tsx:251 `tensInStep` | Same "10, 20, 30" hint for every amount | Fix | `Count by tens to ${amount}.` |
| E2-38 | Minor | TensAndOnesTest.tsx:15–16 `tensOnesSentence` | "☐ ten" singular gives the answer | Fix | Labels before boxes: "How many tens? ☐ How many ones? ☐"; prompt "16. How many tens and ones?" |
| E2-39 | Minor | ComparingTwoDigitNumbers.tsx:337 goal | Bare signs spoken as phrases | Fix | "Compare two numbers. Bigger, less, or equal?" — use "bigger" per E2-44 unless it reads wrong; English checker's text "Greater, less, or equal?" is acceptable if "bigger, less" sounds off. |
| E2-40 | Minor | AddingTwoDigitOneDigit.tsx:240 | "Add 1 more ones" | Fix | `Add ${add} ${add === 1 ? "cube" : "cubes"}`. |
| E2-41 | Minor | Shell :113, :299, :345, :353 | Stars / unlock / mastered lines too hard | Fix (MG2 shell only) | :113 "Solve problems by yourself. That fills your stars." :299 "Answer the questions above. Then you can practice." :345 "You did it! Now take the test." :353 "You did it! You passed the test." Do not edit MG1. |
| E2-42 | Minor | AddingTwoDigitOneDigit.tsx:121, :140, :359, :375, :386 | "13 ones make a new ten" implies all 13 | Fix | "10 of the ones make a new ten. How many tens now?" / "10 ones make a new ten." / wrap-up "…10 ones made a new ten." |
| E2-43 | Minor | CountingTo120.tsx:138 banner | "20! New ten!" as 20 ends its row | Fix | `${n}! ${n/10} tens!` for 20–90; "100! Keep counting!"; "110! Keep counting!"; "120! You did it!" |
| C2-39 + C2-40 | Polish | AddingTwoDigitOneDigitTest.tsx `noRegroupChoiceQuestion`, `forgotCarryChoiceQuestion`, `regroupWhyQuestion` | Weak / 2-option distractors; only right answer has a number | Fix | Distractor tens+add ≤ 9; add third distractor (total − 1); why-question distractors with numbers ("The tens make 30" / "The ones make 5"). Check for duplicates. |
| C2-41 | Polish | TensAndOnes.tsx `standard` step 3 Show me | Picture keeps counting after voice stops | Fix | Label only sticks on that Show me; `showMeHoldMs: countAlongMs(tens)`. |
| E2-44 | Polish | Unit 3 (Key Idea :341, Tests) | greater / bigger / more / biggest | Fix | "bigger / biggest" for numbers everywhere; "greater than / less than" only as the sign's spoken name. |
| E2-46 + E2-47 + E2-48 | Polish | CountingTo120.tsx:271, :299; TensAndOnes.tsx:367, :414; AddingTwoDigitOneDigit.tsx:339, :350 | Odd edge-case sentences; equation-question mix; double "=" | Fix | Per the English report rewrites. |

## Deferred to user

| ID | Question | Recommendation |
|---|---|---|
| E2-37 (= MG1 E2-38) | ☐ is spoken "blank" while text says "box". Change shared `mathSpeech.ts` ☐ → "box" for all labs (and check labs that print "blank")? | Yes, change the shared map once for all labs. |

## Proposed rule and guideline changes (for Stage 6)

Builder: (a) answer-box color only when the box stands for one fixed part, neutral when the question is *which* part; (b) when a Practice step changes, update matching Test/Module items in the same change; (c) help for a 0 quantity must still change the picture.
English: (d) a word after a blank must not depend on the blank's answer — put labels before boxes; (e) check later units/Tests don't use a word no earlier unit teaches; (f) voice must say the word the text prints (☐); (g) no bare signs inside sentences.
