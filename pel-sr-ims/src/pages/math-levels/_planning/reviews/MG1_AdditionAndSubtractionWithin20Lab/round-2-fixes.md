# MG1 Addition & Subtraction Within 20: round 2 fixes

- Round 2 · 2026-11-17 · Work order: `round-2-merged.md` (User decisions final). Grade band: K–1.
- Nothing committed. Temporary harness and scratch scripts removed.

## 1. Summary

**Fixed 25 · Partly fixed 0 · Needs decision 0 · Not fixed 0 · Skipped (user) 1 (E2-38).** (E2-35 is moot: its question was removed by C2-01.)

There are no two-button CFU picks left. The three changed picks are now typed: U1 Q3, U2 Q1, and U4's new second split. U6 Q1 has three picture choices. U6 Q2 is now false, and both Yes/No picks (Q2, Q4) bring a twin question after a wrong tap, so the 2nd-miss "Look here!" and the 3rd-miss show-it can both happen. MK2 checked in the browser: unchanged.

## 2. Item table

| ID | Status | What changed | Where |
|---|---|---|---|
| C2-01 | Fixed | U1 Q3 → TypeCheck "3 + 8. Type the number you start at." (8). U2 Q1 → TypeCheck "6 + 9. Type the number you break apart." (6). U4: "Is there just one way?" dropped; Q2 typed "…2 are sports cards. How many are animal cards?" (4), NEW Q3 typed "Now 5 are sports cards. How many are animal cards?" (1). U6 Q1 → "Which one is true?" with 3 picture choices (6 = 9 / 6 = 6 / 6 = 3). U6 Q2 → "6 = 2 + 3. Is it true?" (No). New optional `twin` on `PickCheck` (only with `look`), used by U6 Q2 (twin "7 = 4 + 3", Yes) and Q4 (twin "7 = 7", Yes). Typed per unit: 4/5, 6/6, 3/6, 5/6, 3/4, 3/6 (24/33). | KCheck.tsx PickCheck; CountingOnAndBack.tsx CFU; MakingTenAndDecomposing.tsx CFU; PutTogetherCompareWordProblems.tsx CFU; EqualSignAndEquations.tsx CFU + `MiniEq` |
| E2-33 | Fixed | Singular forms: "Say 1 number after…", "Count back 1 time from…", "Add it back", "Take it away". Brute force: no "1 times/numbers/them" left. | CountingOnAndBack.tsx Practice hints; CountingOnAndBackTest.tsx `countBackSimpleNumberQuestion`; EqualSignAndEquations.tsx takeFirst hint; AddToTakeFromWordProblems.tsx addToStart/takeFromStart Show me |
| E2-36 | Fixed | `missingLine` uses the picture's numbers in the order you use them ("Change missing? Start at 5. Count on to 8." / "Start missing? Start at 8. Take away 3." / Take From: "…Count back to {end}." / "…Add back {change}."). The spot is split into `atf-missing-change` (Q3, "Look here. Count on to the end.") and `atf-missing-start` (Q6, "Look here. Start at the end. Take away."). The request switches to Add To and that part missing. The spot div is keyed by id. Q6 show line: "Watch: start at 11. Take away 4. 7 are left." | AddToTakeFromWordProblems.tsx |
| C2-03a | Fixed | "To take away 5, count back 5 times. Say 5 numbers." | CountingOnAndBack.tsx Explore |
| C2-03b | Fixed, different numbers | Defaults are **6 + 3 = 5 + 4** (Find it shows 4, total 9). The suggested 5 + 6 = 7 + 4 would print the total 11 = Q6's answer, at Q6's own pointer spot (Flip strip). | EqualSignAndEquations.tsx Explore |
| C2-02 | Fixed | `Given` takes roles: start a, change b, end c (Q1 6 start/5 change; Q4 9 start/6 end; Q5 4 change/11 end). | AddToTakeFromWordProblems.tsx |
| C2-04 | Fixed | `takeFromMissingRoleChoiceQuestion` asks about an end-missing story half the time ("…Then she gave away 3. How many buttons does Nora have left? What is missing?"). 10k draws: the end 50%, the change 50%. | AddToTakeFromWordProblemsTest.tsx |
| C2-05 | Fixed | `wrongAddendChoiceQuestion`: smaller number first in 50% of draws. `equivalentSumChoiceQuestion`: k = ±1..±3, so the answer is the biggest choice 50% of the time and the smallest 50%. All choices are 1–9. | MakingTenAndDecomposingTest.tsx |
| C2-06 + E2-40 | Fixed | Adding to subtract is used only on facts that cross 10 (sub > ones of start; start 11–18), so the result is ≤ 9 and Show me counts at most 9. Help picture: the subtracted number's frame with its empty boxes lit, plus a frame of the ones past 10 (no numeral). Wording: Explore "To take away, you can add. 12 − 8: 8 and how many make 12?"; Practice "Use adding. 8 + ☐ = 12. What number goes in the box?"; Test hint "8 + ☐ = 12." | FluencyFactsWithin20.tsx; FluencyFactsWithin20Test.tsx `factsWithin20SubNumberQuestion` |
| C2-07 | Fixed | `.choice:hover` only applies inside `@media (hover: hover)`. iPad emulation: hover media false, so the Q5 button no longer looks chosen before a tap. On desktop, hover still turns the border green. | shared/styles/lab-base.css |
| C2-08 | Fixed | `countBackRuleQuestion` is replaced by `countBackSayNumbersQuestion`, a typed question: "Count back 4 from 13. Say the numbers." with one box per number, going below 10, as in Practice. | CountingOnAndBackTest.tsx |
| E2-34 | Fixed | "Say" removed: CFU "2 are sports cards…", Practice "3 are green…" / "Now 5 are green…", Test the same. | PutTogetherCompareWordProblems.tsx, …Test.tsx |
| E2-35 | Moot | U4 Q2 removed (C2-01). | — |
| E2-37 | Fixed | "The story tells two numbers. Which one is missing?" | U3 Practice, U3 Test ×2, U4 Practice |
| E2-39 | Fixed | "Count on from 8 to 11." / "Count on from {known} to {c}." / Test "Count on to 10." | EqualSignAndEquations.tsx ×2; MakingTenAndDecomposingTest.tsx |
| E2-41 | Fixed | U3: "Picture the story. Did it go up or down?" (Practice + Test). U4: "Do you put together or take away?" | AddToTakeFromWordProblems(.Test).tsx; PutTogetherCompareWordProblems.tsx |
| E2-44 | Fixed | Practice: "{a1} got {k} bigger/smaller. It is {a2} now. What happens to {b1}?" (b1 is never a1 or a2, so the number named is unambiguous). Explain: "{b1} gets smaller by {k}." Test hints: "{a2} got bigger. So the box gets smaller." / "{sub} is {toTen} and how many more?" | MakingTenAndDecomposing.tsx; MakingTenAndDecomposingTest.tsx |
| E2-48 | Fixed | "Solve Mixed problems by yourself. That fills your stars." (MG1 shell only) | MG1_AdditionAndSubtractionWithin20Lab.tsx |
| E2-43 | Fixed | Explore: "You counted on 3 times from 6. Now you are on 9." (before the first tap: "You are on 6. Count one more."). Test: "9 + 3. Count on from 9. What is the total?" / "13 − 4. Count back from 13. What is left?" | CountingOnAndBack.tsx; CountingOnAndBackTest.tsx |
| E2-45 | Fixed | `LOOK.rule`: "Look here. One hop for each one you take away." `LOOK.any`: "Look here. Fill the ten. Then add the rest." `LOOK.diff` (Q4/Q5): "Look here. Line them up. Count the extras." New `LOOK.diffPick` (Q6) keeps the bigger/smaller line. | U1, U2, U4 |
| E2-46 | Fixed | Q2 show "Watch: 2 are sports cards. Count the rest: 1, 2, 3, 4."; Q2 praise "Yes! 2 and 4 make 6." ("So do 1 and 5" dropped: it is the new Q3's answer); Q5 "Yes! 4 more. 4 fewer. Same gap."; explain "{sentence} matches the story."; Show me "Lily has 6 and 3 more: 7, 8, 9." | PutTogetherCompareWordProblems.tsx |
| E2-47 | Fixed | Goal: "Solve stories. Add more or take some away." | AddToTakeFromWordProblems.tsx |
| E2-49 | Fixed | "Find each side. Do they match?" / "A box can hide a number. What number makes both sides the same?" / "The first side is 8. What goes with 6 to make 8?" | EqualSignAndEquationsTest.tsx; EqualSignAndEquations.tsx |
| E2-50 | Fixed | U4 title "Put Together and Compare Stories". Labels "Put Together and Compare", "Add To and Take From". Comments in ModuleTest/Test updated. `levelSubsections.ts` doesn't show unit titles (no change). | PutTogetherCompareWordProblems.tsx; AddToTakeFromWordProblems.tsx |
| C1-26 | Fixed (user decision) | New optional Practice type "Challenge: fewer stories" (bucket `challengeFewerAdd`): "Ella has 3 fewer pencils than Noah. Ella has 9. How many pencils does Noah have?" Step 1 picks the sentence (9 + 3 = ☐ vs 9 − 3 = ☐ keyword trap). Step 2 is typed. Help: lined-up rows with the extras circled. It is kept out of Mixed by a new additive `ProblemType.optional` (honored by shared `bagItems`), it is not in `requiredBuckets`, the Unit Test or the Module Test, and it gives no stars. | PutTogetherCompareWordProblems.tsx; shared/engine/types.ts; shared/engine/retryDebt.ts |
| E2-38 | Skip (user) | ☐ still spoken "blank". | — |

## 3. Changed files

Shared (re-check these and the labs listed):
- `shared/components/KCheck.tsx`: optional `twin` + `PickTwin` on `PickCheck`. Unused unless both `twin` and `look` are passed. MK1–MK4 pass neither, so their DOM keys, ring, disabling and autoplay keys are identical. Browser-checked on MK2 Making 10.
- `shared/styles/lab-base.css`: `.choice:hover` is wrapped in `@media (hover: hover)`. Affects every lab-base lab on touch devices only. MG11 Geometry has its own `.choice:hover` rule (not touched; see §6).
- `shared/engine/types.ts`: optional `ProblemType.optional`. `shared/engine/retryDebt.ts`: `bagItems` leaves optional types out of Mixed. Users: MK1–MK4, MG1, MG2, MG10 shells. No other lab sets the flag, so nothing else changes.

MG1:
- `MG1/MG1_AdditionAndSubtractionWithin20Lab.tsx`
- `MG1/AdditionAndSubtractionWithin20Lab/units/`: CountingOnAndBack.tsx, CountingOnAndBackTest.tsx, MakingTenAndDecomposing.tsx, MakingTenAndDecomposingTest.tsx, AddToTakeFromWordProblems.tsx, AddToTakeFromWordProblemsTest.tsx, PutTogetherCompareWordProblems.tsx, PutTogetherCompareWordProblemsTest.tsx, FluencyFactsWithin20.tsx, FluencyFactsWithin20Test.tsx, EqualSignAndEquations.tsx, EqualSignAndEquationsTest.tsx, ModuleTest.tsx (comment only)

Docs: `_planning/reviews/CFU_Pointer_Rollout/MG1_AdditionAndSubtractionWithin20Lab.md` (updated), `_planning/reviews/LAB_STATUS.md` (MG1 row).

## 4. New or rewritten student text

CFU:
- U1 Q3 "3 + 8. Type the number you start at." · nudge "Which number is bigger?" · why 1: "Don't start at 1. Start at a number you have."
- U1 LOOK.rule "Look here. One hop for each one you take away." · Explore "To take away 5, count back 5 times. Say 5 numbers." · Explore "You counted on/back N time(s) from S. Now you are on C." / "You are on S. Count one more." (or "Count one back.")
- U2 Q1 "6 + 9. Type the number you break apart." · nudge "Not yet. Keep the bigger number whole." · LOOK.any "Look here. Fill the ten. Then add the rest."
- U3 LOOK "Look here. Count on to the end." / "Look here. Start at the end. Take away." · Q6 show "Watch: start at 11. Take away 4. 7 are left." · Explore lines "Change missing? Start at {start}. Count on to {end}." / "Start missing? Start at {end}. Take away {change}." / "Change missing? Start at {start}. Count back to {end}." / "Start missing? Start at {end}. Add back {change}."
- U4 Q2 "Jake has 6 cards. Some are sports cards. Some are animal cards. 2 are sports cards. How many are animal cards?" · show "Watch: 2 are sports cards. Count the rest: 1, 2, 3, 4." · praise "Yes! 2 and 4 make 6."
- U4 Q3 "Now 5 are sports cards. How many are animal cards?" · nudge "Start with 6. Take away the 5." · why 11 "6 cards in all. Don't add." / 6 "6 is all the cards." / 4 "Now 5 are sports cards." · show "Watch: 5 are sports cards. Count the rest: 1." · praise "Yes! 6 can be split many ways."
- U4 Q5 praise "Yes! 4 more. 4 fewer. Same gap." · LOOK.diff "Look here. Line them up. Count the extras."
- U6 Q1 "Which one is true?" (6 = 9 / 6 = 6 / 6 = 3) · why "Count both sides. Are they the same?"
- U6 Q2 "6 = 2 + 3. Is it true?" (spoken "Is 6 the same as 2 plus 3?") · show "Watch: 2 and 3 make 5. 5 is not 6." · praise "Yes! 2 + 3 is 5, not 6." · twin "7 = 4 + 3. Is it true?" · twin show "Watch: 4 and 3 make 7. Both sides are 7." · twin praise "Yes! Both sides are 7."
- U6 Q4 twin "7 = 7. Is it true?" · show "Watch: 7 on this side. 7 on that side." · praise "Yes! 7 is the same as 7."
- U6 Q3 why "The first side is 8. What goes with 6 to make 8?" · Q5 nudge "Count on from 8 to 11." · Explore "A box can hide a number. What number makes both sides the same?"

Practice / Test / shell: every row of the item table above (E2-33, 34, 37, 39, 41, 43, 44, 46, 47, 49, 50, C2-04 story, C2-06 wording). Also the challenge templates: story "{B} has {d} fewer {item(s)} than {A}. {B} has {s}. How many {items} does {A} have?", hint "{B} has fewer. So {A} has more.", Show me "{A} has {s} and {d} more: …", wrap-up "{s} + {d} = {t}. {A} has {d} more than {B}." Shell: "Solve Mixed problems by yourself. That fills your stars."

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | Pass (0 errors) |
| `npx eslint` on every touched .ts/.tsx | Pass: 0 errors (pre-existing react-refresh warnings + one pre-existing unused-disable in the shell) |
| `npx vite build` | Pass. Only chunk-size warnings; no "does not provide an export" |
| Test ↔ unit import check | Pass. No Test file imports its unit; `countBackSayNumbersQuestion` is self-contained |
| Brute force (esbuild bundle, 6,000 draws per Practice bucket incl. the challenge, 2,000 per Test/Module generator, 6,000 targeted Test draws; ~50k unique strings) | 0 failures: every answer an integer 0–20; no duplicate or missing choices; Making Ten step 1 always the smaller number (smaller written first 50.3%); same-total prompt never ambiguous; U5 subtraction always crosses 10, result ≤ 9; U2 Test break-apart first/second 50/50; equivalent-sum answer biggest/smallest 50/50; U3 Test role end/change 50/50; U1 say-numbers boxes match the count (2–6 boxes); challenge correct is always "+", position spread evenly (0/1/2 ≈ 1/3 each); Mixed bag never holds the optional type; the optional bucket is not required. Grammar sweep: no "1 times/numbers", "them" for 1, "count up", "think addition", "Act it out", "not tell", "Say n are", "the other number", slash fractions, "did + past". The 3 flagged lines were false positives ("1 more is 11", "3 and 1 are not the same"). |
| `node scripts/english-check.cjs --grade 1` (shell + units) | 509 strings, 18 flagged (was 20). Task/after-answer 0% over. All remaining flags are earlier, accepted ones (whole, start-unknown user decision, "in all", "What does = mean?" in the Test, two Explore/shell "screen" joins). |
| Browser, iPad 820×1180, touch, speech stubbed | **U1 Q3** wrong 3, 3 → "Look here!" (said "Start at the bigger number.", lit cob-bigger) → wrong 5 → show-it → 8 praise. **Q5** pointer lit "To take away 5…". **U2 Q1** 9, 9 → Look here (mt-keep) → 9 → show (Made Ten) → 6. **U2 Q4** pointer says "Fill the ten. Then add the rest." **U3 Q3** pointer lit `atf-missing-change` "Change missing? Start at 5. Count on to 8." **Q6** lit `atf-missing-start` "Start missing? Start at 8. Take away 3."; show line as above. **Q5 "the change" button** white with a neutral border before any tap (C2-07); Q5 picture: 4 drawn orange (change), 11 purple (end). **U4 Q2/Q3** typed; pointers lit ptc-part and ptc-ways; Q3 show "Count the rest: 1." **U4 Q4** pointer says "Line them up. Count the extras." **U4 challenge**: 0 challenge stories in 24 Mixed draws; picked by hand; a clean solve left stars at 0 of 5 and clean 0. **U5** bridging fact 17 − 9: help picture shows 9 with 1 empty box lit + 7 past 10; Show me counts 10…17 (8 numbers). **U6 Q1**: after 2 wrong picks the pointer appears (one button left, as agreed). **U6 Q2**: "Yes" → twin "7 = 4 + 3" with both buttons live, voice reads the reason then "Is 7 the same as 4 plus 3?"; "No" → "Look here!" (eq-either-side); "No" again → show-it; "Yes" → praise. **Q4**: "No" → twin "7 = 7"; "Yes" → praise. **Q5** pointer turns box mode on; Find it reveals 4 (not a CFU answer). Every unit unlocks Practice. |
| MK2 unchanged (Making 10) | Q1 wrong, wrong → show-it on the 2nd miss, no "Look here" button; Q4 Yes/No pick with no twin: one wrong tap leaves only "No" (as before). Practice unlocks. |
| Desktop hover | `.choice` border turns green while hovered at 1280×900 (unchanged for mouse users). |
| Console | No page errors (one 404 for a static asset). |

Screenshots (all looked at): `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\4a0a5ada-0427-4375-a535-7a7815b05751\scratchpad\r2fix\shots\` (u1-q3-*, u1-q5-lookhere, u2-q1-*, u2-q4-lookhere, u3-q1-ask, u3-q3-lookhere, u3-q5-ask, u3-q6-*, u4-q3-*, u4-challenge*, u5-think-add-*, u6-q1-*, u6-q2-*, u6-q5-lookhere).

Note: in two long runs, headless Chromium's renderer crashed ("Target crashed") partway through. JS heap stayed about 21–29 MB, and the same steps passed in fresh, shorter runs, so this looks like the headless renderer, not the lab. Worth watching on a real iPad.

## 6. Noticed, not fixed

- Three-button picks (U1 Q5, U3 Q1/Q4/Q5, U4 Q6, U5 Q1, U6 Q1) still show "Look here!" only when one button is left. `twin` could be added to them later (curriculum C2-01's optional note).
- When the twin appears, the voice also reads the question number ("2.") before the twin prompt.
- U4 CFU Q2 is five short sentences (the old Q2 + Q3 merged). The English checker should look at it.
- MG11 Geometry has its own `.choice:hover` rule with the same sticky-hover risk on iPad (not part of this lab).
- U3 title is still "Word Problems: Add To and Take From", while U4 is now "Put Together and Compare Stories". The titles no longer match in style.
- The Mixed-only stars line says nothing about the challenge type. The shell's "Only Mixed problems give you stars" note already appears when it is picked.
- Proposed rule change (Stage 6): document `PickCheck` `twin` and `ProblemType.optional` in the builder/style guide.
